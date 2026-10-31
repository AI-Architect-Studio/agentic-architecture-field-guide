import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';

const hash = value => createHash('sha256').update(value).digest('hex');
const SYSTEM_REVISION = hash(readFileSync(fileURLToPath(import.meta.url)));
const ALLOWED_TOOLS = new Set(['search_knowledge', 'open_article']);
const ownObject = (value, keys) => value !== null && typeof value === 'object' && !Array.isArray(value)
  && Object.keys(value).length === keys.length && keys.every(key => Object.hasOwn(value, key));
const boundedText = value => typeof value === 'string' && value.trim().length > 0 && value.length <= 2000 && !/[\u0000-\u001f\u007f]/u.test(value);
class ToolFailure extends Error { constructor(code) { super(code); this.code = code; } }

function validateCorpus(corpus) {
  if (!Array.isArray(corpus) || corpus.length > 1000) throw new Error('Invalid corpus.');
  const identities = new Set();
  for (const row of corpus) {
    if (!ownObject(row, ['id', 'tenantId', 'topic', 'status', 'revision', 'title', 'facts', 'rawText'])) throw new Error('Invalid corpus record.');
    for (const key of ['id', 'tenantId', 'topic', 'revision', 'title', 'rawText']) if (!boundedText(row[key])) throw new Error('Invalid corpus text.');
    if (!['current', 'archived'].includes(row.status)) throw new Error('Invalid corpus status.');
    if (!ownObject(row.facts, ['menuPath', 'previousTokenStopsImmediately']) || !boundedText(row.facts.menuPath) || typeof row.facts.previousTokenStopsImmediately !== 'boolean') throw new Error('Invalid corpus facts.');
    const identity = `${row.tenantId}\0${row.id}`;
    if (identities.has(identity)) throw new Error('Duplicate corpus identity.');
    identities.add(identity);
  }
}

// This is a deterministic baseline over administrator-reviewed structured facts.
// rawText is deliberately untrusted and cannot select tools or supply instructions.
export function createSupportAgent({ tenantId, corpus, timeoutMs = 25, delayMs = 0 }) {
  if (!boundedText(tenantId)) throw new Error('A trusted tenant identity is required.');
  if (![timeoutMs, delayMs].every(value => Number.isFinite(value) && value >= 0 && value <= 10000) || timeoutMs === 0) throw new Error('Invalid timing configuration.');
  validateCorpus(corpus);
  const source = structuredClone(corpus);
  const target = Object.freeze({ system: SYSTEM_REVISION, model: 'none-deterministic-reference', prompt: 'none-deterministic-reference', corpus: hash(JSON.stringify(source)) });
  const trace = [];
  let lastQuestion = null;

  async function invokeTool(name, args) {
    const start = performance.now();
    const entry = { name: typeof name === 'string' ? name : 'invalid', status: 'pending', error: null, latencyMs: null };
    trace.push(entry);
    try {
      if (!ALLOWED_TOOLS.has(name)) throw new ToolFailure('tool_not_allowed');
      const key = name === 'search_knowledge' ? 'topic' : 'articleId';
      if (!ownObject(args, [key]) || !boundedText(args[key])) throw new ToolFailure('invalid_tool_arguments');
      const result = await new Promise((resolve, reject) => {
        const deadline = setTimeout(() => {
          clearTimeout(work);
          reject(new ToolFailure('retrieval_timeout'));
        }, timeoutMs);
        const work = setTimeout(() => {
          clearTimeout(deadline);
          // Tenant scoping precedes search and ID lookup. Missing and inaccessible
          // IDs return the same shape; caller arguments cannot override the tenant.
          const visible = source.filter(row => row.tenantId === tenantId);
          resolve(name === 'search_knowledge'
            ? visible.filter(row => row.topic === args.topic).map(row => ({ id: row.id, status: row.status, revision: row.revision }))
            : structuredClone(visible.find(row => row.id === args.articleId) ?? null));
        }, delayMs);
      });
      entry.status = 'ok';
      return result;
    } catch (error) {
      entry.status = 'failed'; entry.error = error.code ?? 'tool_failure';
      throw error;
    } finally { entry.latencyMs = performance.now() - start; }
  }

  const escalation = reason => ({ status: 'escalated', reason, answer: 'A support specialist needs to review this request.', citations: [], ignoredArchived: [] });
  async function answer(question) {
    if (!boundedText(question)) throw new Error('A bounded question is required.');
    lastQuestion = question;
    if (/refund|reset.{0,20}account/iu.test(question)) return escalation('human_action_required');
    try {
      const requestedId = question.match(/\bKB-\d+\b/iu)?.[0].toUpperCase();
      let records;
      if (requestedId) {
        const article = await invokeTool('open_article', { articleId: requestedId });
        if (article === null) return escalation('evidence_unavailable');
        records = [article];
      } else {
        const topic = /legacy token policy/iu.test(question) ? 'legacy_token_policy' : /token|api key/iu.test(question) ? 'token_rotation' : 'unknown';
        const hits = await invokeTool('search_knowledge', { topic });
        records = [];
        for (const hit of hits) records.push(await invokeTool('open_article', { articleId: hit.id }));
      }
      const current = records.filter(row => row && row.status === 'current');
      if (!current.length) return escalation('evidence_unavailable');
      if (new Set(current.map(row => JSON.stringify(row.facts))).size !== 1) return escalation('conflicting_current_evidence');
      if (current.some(row => row.topic !== 'token_rotation')) return escalation('evidence_unavailable');
      const selected = current[0];
      return {
        status: 'answered', reason: 'supported_structured_facts',
        answer: `Use ${selected.facts.menuPath}.${selected.facts.previousTokenStopsImmediately ? ' The previous token stops working immediately.' : ''}`,
        citations: [{ id: selected.id, revision: selected.revision, title: selected.title }],
        ignoredArchived: records.filter(row => row?.status === 'archived').map(row => row.id),
      };
    } catch (error) {
      return escalation(error.code === 'retrieval_timeout' ? 'retrieval_timeout' : 'retrieval_failure');
    }
  }

  function exportState() {
    return JSON.stringify({ schemaVersion: 1, tenantId, target, lastQuestion });
  }
  async function resume(serialized) {
    let state;
    try { state = JSON.parse(serialized); } catch { throw new Error('Invalid saved state.'); }
    if (!ownObject(state, ['schemaVersion', 'tenantId', 'target', 'lastQuestion']) || state.schemaVersion !== 1 || state.tenantId !== tenantId || !ownObject(state.target, Object.keys(target)) || Object.keys(target).some(key => state.target[key] !== target[key]) || !boundedText(state.lastQuestion)) throw new Error('Saved state does not match this tenant and version.');
    // Recompute the answer from bounded source instead of trusting saved output.
    return answer(state.lastQuestion);
  }

  return { answer, invokeTool, exportState, resume, getTrace: () => structuredClone(trace), target: () => ({ ...target }) };
}
