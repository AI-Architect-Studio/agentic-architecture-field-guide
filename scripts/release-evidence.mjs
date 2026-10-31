#!/usr/bin/env node
// Offline evaluation of declared evidence. No agent execution or release approval.
import { createHash } from 'node:crypto';
import { closeSync, constants, fstatSync, openSync, readFileSync, readSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const MAX_BYTES = 1024 * 1024;
const hash = value => createHash('sha256').update(value).digest('hex');
const invalid = path => { throw new Error(`Invalid field: ${path}`); };
const object = (value, keys, path) => {
  if (value === null || typeof value !== 'object' || Array.isArray(value) || Object.keys(value).length !== keys.length || keys.some(key => !Object.hasOwn(value, key))) invalid(path);
};
const text = (value, path) => {
  if (typeof value !== 'string' || !value.trim() || value.length > 2000 || /[\u0000-\u001f\u007f]/u.test(value)) invalid(path);
};
const array = (value, path, min = 0, max = 1000) => {
  if (!Array.isArray(value) || value.length < min || value.length > max) invalid(path);
};
const unique = (values, path) => { if (new Set(values).size !== values.length) invalid(path); };
const strings = (value, path, min = 0) => {
  array(value, path, min, 100);
  value.forEach((item, i) => text(item, `${path}[${i}]`));
  unique(value, path);
};
const number = (value, path) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 1_000_000) invalid(path);
};
const versions = (value, path) => {
  object(value, ['system', 'model', 'prompt', 'corpus'], path);
  for (const key of Object.keys(value)) text(value[key], `${path}.${key}`);
};

export function validatePolicy(policy) {
  object(policy, ['schemaVersion', 'title', 'datasetRevision', 'target', 'currency', 'maxTotalCost', 'maxLatencyMs', 'allowedTools', 'cases'], 'policy');
  if (policy.schemaVersion !== 1) invalid('policy.schemaVersion');
  for (const key of ['title', 'datasetRevision']) text(policy[key], `policy.${key}`);
  versions(policy.target, 'policy.target');
  if (!['USD', 'EUR', 'GBP'].includes(policy.currency)) invalid('policy.currency');
  for (const key of ['maxTotalCost', 'maxLatencyMs']) number(policy[key], `policy.${key}`);
  strings(policy.allowedTools, 'policy.allowedTools');
  array(policy.cases, 'policy.cases', 1, 100);
  policy.cases.forEach((item, i) => {
    const path = `policy.cases[${i}]`;
    object(item, ['id', 'job', 'assertions'], path);
    text(item.id, `${path}.id`);
    text(item.job, `${path}.job`);
    strings(item.assertions, `${path}.assertions`, 1);
  });
  unique(policy.cases.map(item => item.id), 'policy.cases.id');
  return policy;
}

export function validateRuns(input) {
  object(input, ['schemaVersion', 'evidenceMode', 'datasetRevision', 'currency', 'attempts'], 'runs');
  if (input.schemaVersion !== 1) invalid('runs.schemaVersion');
  if (!['illustrative', 'declared'].includes(input.evidenceMode)) invalid('runs.evidenceMode');
  text(input.datasetRevision, 'runs.datasetRevision');
  if (!['USD', 'EUR', 'GBP'].includes(input.currency)) invalid('runs.currency');
  array(input.attempts, 'runs.attempts');
  input.attempts.forEach((attempt, i) => {
    const path = `runs.attempts[${i}]`;
    object(attempt, ['id', 'caseId', 'target', 'assertions', 'cost', 'latencyMs', 'attemptedTools', 'error', 'evidenceRef'], path);
    for (const key of ['id', 'caseId', 'evidenceRef']) text(attempt[key], `${path}.${key}`);
    versions(attempt.target, `${path}.target`);
    if (attempt.assertions === null || typeof attempt.assertions !== 'object' || Array.isArray(attempt.assertions) || Object.keys(attempt.assertions).length > 100) invalid(`${path}.assertions`);
    for (const [key, value] of Object.entries(attempt.assertions)) {
      text(key, `${path}.assertions.key`);
      if (typeof value !== 'boolean' && value !== null) invalid(`${path}.assertions.value`);
    }
    for (const key of ['cost', 'latencyMs']) if (attempt[key] !== null) number(attempt[key], `${path}.${key}`);
    strings(attempt.attemptedTools, `${path}.attemptedTools`);
    if (attempt.error !== null) text(attempt.error, `${path}.error`);
  });
  unique(input.attempts.map(item => item.id), 'runs.attempts.id');
  return input;
}

export function evaluateEvidence(policy, input) {
  validatePolicy(policy);
  validateRuns(input);
  const findings = [];
  const fail = (gate, reason, attemptId = null) => findings.push({ gate, reason, attemptId });
  if (input.datasetRevision !== policy.datasetRevision) fail('version', 'Dataset revision differs from the policy.');
  if (input.currency !== policy.currency) fail('cost', 'Currency differs from the policy; no conversion is performed.');
  const caseMap = new Map(policy.cases.map(item => [item.id, item]));
  for (const required of policy.cases) {
    if (!input.attempts.some(item => item.caseId === required.id)) fail('coverage', `Missing case: ${required.id}`);
  }
  for (const attempt of input.attempts) {
    const expected = caseMap.get(attempt.caseId);
    if (!expected) fail('coverage', `Unregistered case: ${attempt.caseId}`, attempt.id);
    for (const key of Object.keys(policy.target)) {
      if (attempt.target[key] !== policy.target[key]) fail('version', `Target ${key} revision differs from the policy.`, attempt.id);
    }
    if (expected) {
      for (const key of expected.assertions) {
        if (!Object.hasOwn(attempt.assertions, key) || attempt.assertions[key] !== true) fail('quality', `Assertion is false, missing or unknown: ${key}`, attempt.id);
      }
      for (const key of Object.keys(attempt.assertions)) {
        if (!expected.assertions.includes(key)) fail('quality', `Unregistered assertion: ${key}`, attempt.id);
      }
    }
    for (const tool of attempt.attemptedTools) {
      if (!policy.allowedTools.includes(tool)) fail('permission', `Forbidden attempted tool: ${tool}`, attempt.id);
    }
    if (attempt.error !== null) fail('error', `Attempt records an error: ${attempt.error}`, attempt.id);
    if (attempt.cost === null) fail('cost', 'Attempt cost is unknown.', attempt.id);
    if (attempt.latencyMs === null || attempt.latencyMs > policy.maxLatencyMs) fail('latency', 'Latency is unknown or exceeds the per-attempt limit.', attempt.id);
  }
  const costKnown = input.currency === policy.currency && input.attempts.length > 0 && input.attempts.every(item => item.cost !== null);
  const totalCost = costKnown ? input.attempts.reduce((sum, item) => sum + item.cost, 0) : null;
  if (totalCost !== null && totalCost > policy.maxTotalCost) fail('cost', 'All-attempt cost exceeds the policy limit.');
  const passed = findings.length === 0;
  return {
    schemaVersion: 1,
    title: policy.title,
    evidenceMode: input.evidenceMode,
    state: input.evidenceMode === 'illustrative' ? (passed ? 'ILLUSTRATIVE_GATES_PASS' : 'ILLUSTRATIVE_GATES_FAIL') : (passed ? 'DECLARED_GATES_PASS_NOT_VERIFIED' : 'DECLARED_GATES_FAIL'),
    gatesPass: passed,
    releaseApproved: false,
    boundary: 'Checks imported declarations only. Does not run an agent, inspect receipts, establish completeness, certify security, or authorize release.',
    target: policy.target,
    datasetRevision: policy.datasetRevision,
    attempts: input.attempts.length,
    requiredCases: policy.cases.length,
    coveredCases: policy.cases.filter(item => input.attempts.some(attempt => attempt.caseId === item.id)).length,
    currency: policy.currency,
    totalCost,
    maxTotalCost: policy.maxTotalCost,
    maxLatencyMs: policy.maxLatencyMs,
    findings,
    evidenceReferences: input.attempts.map(({ id, caseId, evidenceRef }) => ({ attemptId: id, caseId, evidenceRef })),
    nextEvidence: ['Independent review of raw traces and all retries for these exact versions.', 'Observed tenant and tool controls, recovery/export drill, and owner acceptance.', 'Separate authorization and verification of deployment and commercial fulfillment.'],
  };
}

const md = value => String(value).replace(/[\\`*_{}\[\]<>|#]/gu, '\\$&');
export function renderMarkdown(result) {
  return [
    `# ${md(result.title)}`, '', `Evidence state: **${result.state}**`, '', result.boundary, '',
    `Release approved: **No**. Covered cases: ${result.coveredCases}/${result.requiredCases}. Attempts: ${result.attempts}.`, '',
    '## Version binding', '',
    `Dataset: ${md(result.datasetRevision)}`, '',
    ...Object.entries(result.target).map(([key, value]) => `- ${key}: ${md(value)}`), '',
    `All-attempt cost: ${result.totalCost === null ? 'Unknown' : result.totalCost.toFixed(4)} ${result.currency}; limit: ${result.maxTotalCost} ${result.currency}. Per-attempt latency limit: ${result.maxLatencyMs} ms.`, '',
    '| Gate | Attempt | Finding |', '| --- | --- | --- |',
    ...result.findings.map(item => `| ${item.gate} | ${md(item.attemptId ?? 'Whole run')} | ${md(item.reason)} |`),
    ...(result.findings.length ? [] : ['| All | Whole run | Supplied declarations meet the configured gates |']), '',
    '## Imported evidence references', '',
    'References are unverified input text. The tool did not open or authenticate them.', '',
    '| Attempt | Case | Redacted reference |', '| --- | --- | --- |',
    ...result.evidenceReferences.map(item => `| ${md(item.attemptId)} | ${md(item.caseId)} | ${md(item.evidenceRef)} |`), '',
    '## Independent evidence still required', '', ...result.nextEvidence.map(item => `- ${item}`), '',
    '## Fingerprints', '', ...Object.entries(result.fingerprints ?? {}).map(([key, value]) => `- ${key}: ${value}`), '',
  ].join('\n');
}

function readBounded(path) {
  const fd = openSync(path, constants.O_RDONLY | (constants.O_NONBLOCK ?? 0));
  try {
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.size > MAX_BYTES) throw new Error('Input must be a regular UTF-8 JSON file no larger than 1 MiB.');
    const buffer = Buffer.alloc(MAX_BYTES + 1);
    let bytes = 0;
    while (bytes < buffer.length) {
      const count = readSync(fd, buffer, bytes, buffer.length - bytes, null);
      if (!count) break;
      bytes += count;
    }
    if (bytes > MAX_BYTES) throw new Error('Input exceeds 1 MiB.');
    const raw = buffer.subarray(0, bytes);
    try {
      return { raw, input: JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(raw)) };
    } catch {
      throw new Error('Input must contain valid UTF-8 JSON.');
    }
  } finally { closeSync(fd); }
}

export function main(args) {
  try {
    if (args.length < 2 || args.length > 3 || (args.length === 3 && args[2] !== '--markdown')) throw new Error('Usage: node scripts/release-evidence.mjs POLICY.json RUNS.json [--markdown]');
    const policy = readBounded(args[0]);
    const runs = readBounded(args[1]);
    const result = evaluateEvidence(policy.input, runs.input);
    result.fingerprints = { policySha256: hash(policy.raw), runsSha256: hash(runs.raw), toolSha256: hash(readFileSync(fileURLToPath(import.meta.url))) };
    process.stdout.write(args[2] === '--markdown' ? renderMarkdown(result) : JSON.stringify(result, null, 2) + '\n');
    return result.gatesPass ? 0 : 2;
  } catch (error) {
    process.stderr.write(`Release evidence: ${error.message}\n`);
    return 1;
  }
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) process.exitCode = main(process.argv.slice(2));
