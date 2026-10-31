import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { evaluateEvidence, renderMarkdown } from './release-evidence.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const policyPath = join(root, 'examples/support-rag/policy.json');
const runsPath = join(root, 'examples/support-rag/runs.json');
const policy = () => JSON.parse(readFileSync(policyPath, 'utf8'));
const runs = () => JSON.parse(readFileSync(runsPath, 'utf8'));
const passing = () => { const r = runs(); r.attempts[6].error = null; return r; };
const has = (result, gate) => result.findings.some(item => item.gate === gate);

test('synthetic recovery example retains the failed tool attempt and exits blocked', () => {
  const result = evaluateEvidence(policy(), runs());
  assert.equal(result.state, 'ILLUSTRATIVE_GATES_FAIL');
  assert.equal(result.gatesPass, false);
  assert.equal(result.releaseApproved, false);
  assert.equal(result.attempts, 8);
  assert.equal(result.coveredCases, 8);
  assert.ok(has(result, 'error'));
});

test('passing declarations never grant verification, release or certification', () => {
  const fixture = passing();
  assert.equal(evaluateEvidence(policy(), fixture).state, 'ILLUSTRATIVE_GATES_PASS');
  fixture.evidenceMode = 'declared';
  const result = evaluateEvidence(policy(), fixture);
  assert.equal(result.state, 'DECLARED_GATES_PASS_NOT_VERIFIED');
  assert.equal(result.releaseApproved, false);
});

test('missing cases and empty runs fail closed', () => {
  for (const attempts of [[], passing().attempts.slice(0, -1)]) {
    const r = passing(); r.attempts = attempts;
    const result = evaluateEvidence(policy(), r);
    assert.equal(result.gatesPass, false);
    assert.ok(has(result, 'coverage'));
  }
});

test('a successful retry cannot erase an earlier failure or its cost', () => {
  const r = passing();
  r.attempts[0].cost = 0.4;
  const retry = structuredClone(r.attempts[0]); retry.id = 'retry-001'; retry.cost = 0.3;
  r.attempts[0].assertions.answer_supported = false;
  r.attempts.push(retry);
  const result = evaluateEvidence(policy(), r);
  assert.ok(has(result, 'quality'));
  assert.ok(has(result, 'cost'));
  assert.ok(result.totalCost > 0.7);
});

test('version mismatches cover dataset, system, model, prompt and corpus', () => {
  for (const key of Object.keys(policy().target)) {
    const r = passing(); r.attempts[0].target[key] += '-changed';
    assert.ok(has(evaluateEvidence(policy(), r), 'version'));
  }
  const r = passing(); r.datasetRevision += '-changed';
  assert.ok(has(evaluateEvidence(policy(), r), 'version'));
});

test('unknown, false and misspelled assertions block the case', () => {
  for (const value of [null, false, undefined]) {
    const r = passing();
    if (value === undefined) delete r.attempts[0].assertions.answer_supported;
    else r.attempts[0].assertions.answer_supported = value;
    assert.ok(has(evaluateEvidence(policy(), r), 'quality'));
  }
  const r = passing(); r.attempts[0].assertions.answr_supported = true;
  assert.ok(has(evaluateEvidence(policy(), r), 'quality'));
});

test('inherited assertion values cannot satisfy required evidence', () => {
  const r = passing();
  for (const attempt of r.attempts) attempt.assertions = Object.create(attempt.assertions);
  const result = evaluateEvidence(policy(), r);
  assert.equal(result.gatesPass, false);
  assert.ok(has(result, 'quality'));
});

test('unknown cost, wrong currency, slow latency and forbidden attempted tools block', () => {
  const r = passing();
  r.attempts[0].cost = null;
  r.attempts[1].latencyMs = 4001;
  r.attempts[2].latencyMs = null;
  r.attempts[3].attemptedTools.push('issue_refund');
  let result = evaluateEvidence(policy(), r);
  for (const gate of ['cost', 'latency', 'permission']) assert.ok(has(result, gate));
  assert.equal(result.totalCost, null);
  const c = passing(); c.currency = 'EUR';
  result = evaluateEvidence(policy(), c);
  assert.ok(has(result, 'cost'));
  assert.equal(result.totalCost, null);
});

test('unregistered cases cannot count toward required coverage', () => {
  const r = passing(); r.attempts[0].caseId = 'invented_case';
  const result = evaluateEvidence(policy(), r);
  assert.equal(result.coveredCases, 7);
  assert.equal(result.findings.filter(item => item.gate === 'coverage').length, 2);
});

test('invalid contracts, duplicate identities and numeric coercions are rejected', () => {
  const mutations = [
    (p, r) => { r.extra = true; },
    (p, r) => { r.evidenceMode = 'verified'; },
    (p, r) => { r.attempts[0].id = r.attempts[1].id; },
    (p, r) => { r.attempts[0].cost = -1; },
    (p, r) => { r.attempts[0].cost = NaN; },
    (p, r) => { r.attempts[0].cost = '0'; },
    (p, r) => { r.attempts[0].latencyMs = Infinity; },
    (p, r) => { r.attempts[0].assertions.answer_supported = 1; },
    (p, r) => { r.attempts[0].evidenceRef = ''; },
    (p, r) => { r.attempts[0].target = {}; },
    (p, r) => { p.cases = []; },
    (p, r) => { p.cases.push(p.cases[0]); },
    (p, r) => { p.allowedTools.push(p.allowedTools[0]); },
  ];
  for (const mutate of mutations) {
    const p = policy(); const r = passing(); mutate(p, r);
    assert.throws(() => evaluateEvidence(p, r), /Invalid field:/);
  }
});

test('Markdown escapes authored markup and never executes evidence references', () => {
  const p = policy(); p.title = '[click](javascript:alert(1)) <script> | title';
  const r = passing(); r.attempts[0].evidenceRef = '$(do-not-run)';
  const markdown = renderMarkdown(evaluateEvidence(p, r));
  assert.ok(markdown.includes('\\[click\\]'));
  assert.ok(markdown.includes('\\<script\\>'));
  assert.ok(markdown.includes('$(do-not-run)'));
  assert.ok(markdown.includes('synthetic-support-agent-v1'));
  assert.ok(markdown.includes('References are unverified input text.'));
});

test('CLI binds exact policy, runs and tool fingerprints and returns gate exit code', () => {
  const cli = spawnSync(process.execPath, [join(root, 'scripts/release-evidence.mjs'), policyPath, runsPath], { encoding: 'utf8' });
  assert.equal(cli.status, 2);
  assert.equal(cli.stderr, '');
  const report = JSON.parse(cli.stdout);
  assert.equal(report.state, 'ILLUSTRATIVE_GATES_FAIL');
  for (const value of Object.values(report.fingerprints)) assert.match(value, /^[0-9a-f]{64}$/);
  const md = spawnSync(process.execPath, [join(root, 'scripts/release-evidence.mjs'), policyPath, runsPath, '--markdown'], { encoding: 'utf8' });
  assert.equal(md.status, 2);
  assert.match(md.stdout, /Release approved: \*\*No\*\*/);
});

test('CLI rejects malformed, oversized, non-UTF8 and non-regular input', () => {
  const dir = mkdtempSync(join(tmpdir(), 'release-evidence-'));
  try {
    const invalids = [['malformed.json', 'PRIVATE_TOKEN_FIXTURE'], ['large.json', ' '.repeat(1024 * 1024 + 1)], ['bytes.json', Buffer.from([0xff])]];
    for (const [name, value] of invalids) {
      const path = join(dir, name); writeFileSync(path, value);
      const cli = spawnSync(process.execPath, [join(root, 'scripts/release-evidence.mjs'), path, runsPath], { encoding: 'utf8' });
      assert.equal(cli.status, 1); assert.equal(cli.stdout, '');
      assert.ok(!cli.stderr.includes('PRIVATE_'));
    }
    const cli = spawnSync(process.execPath, [join(root, 'scripts/release-evidence.mjs'), dir, runsPath], { encoding: 'utf8' });
    assert.equal(cli.status, 1); assert.equal(cli.stdout, '');
  } finally { rmSync(dir, { recursive: true, force: true }); }
});
