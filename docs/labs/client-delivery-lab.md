# Lab: deliver a support-agent evidence packet

Build a client-ready decision packet from a real local reference run. You will inspect a failure, preserve the retry, connect the result to a scoped delivery and export a handover another engineer can use.

**Result:** a completed project brief, one architecture decision, a versioned trial packet and a reasoned accept/hold decision. The reference uses deterministic logic and synthetic sources; the lab does not establish live-model performance or production readiness.

## Prerequisites and working boundary

Use Node.js 22 or later and a writable local directory. No account, package install, API key, network service or model call is required. Run commands from the repository root. Use fresh output directory names so earlier evidence is preserved.

Read the [worked Northstar dossier](../../packs/client-delivery/northstar-dossier.md) and the [reference instructions](../../examples/support-agent-reference/README.md). Keep confidential client material outside this public repository. A future client adapter needs its own data permission and runtime boundary.

## 1. Produce actual local evidence

```sh
node examples/support-agent-reference/run.mjs --out-dir support-reference-trial-001
node scripts/release-evidence.mjs support-reference-trial-001/policy.json support-reference-trial-001/runs.json --markdown
```

The first command executes the deterministic reference and creates three files:

- `policy.json`: required cases, permitted tools, evaluated versions and limits.
- `runs.json`: attempt-level declarations derived from that execution.
- `evidence.json`: input, output, trace, measured latency and accounting boundaries.

The second command should exit **2**, meaning a valid report contains failed gates. Inspect the findings before changing anything. Expected causes include unknown total costs, a retained timeout and a deliberately rejected forbidden-tool attempt. A denied call can fail the evaluator's strict attempted-tool gate even though the runtime blocked its execution.

Open the files in an editor. Find the timeout case's failed attempt and subsequent retry. Confirm both remain in the packet. Explain which result was observed, which assertion was derived by the runner, and which independent evidence is still absent.

## 2. Locate the failure and recovery

Use this command to print only the timeout records and their traces:

```sh
node -e "const p=require('./support-reference-trial-001/evidence.json'); console.log(JSON.stringify(p.attempts.filter(x=>x.caseId==='tool_timeout'),null,2))"
```

The runner creates one attempt with a real local retrieval delay exceeding its deadline, then a second attempt without that injected delay. The retry demonstrates recovery in the local baseline. The first error remains part of the trial.

Write a three-sentence finding:

1. What failed, with the exact attempt ID and source revision?
2. What did the operator receive, and which retry/recovery behavior was observed?
3. Why does the full report remain blocked even when recovery succeeds?

A good finding distinguishes successful fallback from absence of a tool error. Do not erase a failed attempt, lower an unknown cost to zero or relabel a derived assertion as independent verification.

## 3. Break an input contract, then repair the input

This exercise changes a copy of a synthetic dataset. It demonstrates that a malformed measurement cannot become evidence through coercion.

```sh
node -e "const fs=require('node:fs'); const p=JSON.parse(fs.readFileSync('support-reference-trial-001/runs.json','utf8')); p.attempts[0].latencyMs='unknown'; fs.writeFileSync('support-reference-trial-001/malformed-runs.json',JSON.stringify(p,null,2),{flag:'wx'})"
node scripts/release-evidence.mjs support-reference-trial-001/policy.json support-reference-trial-001/malformed-runs.json
```

Expect exit **1** and an invalid-field error. The evaluator requires a number or explicit `null`; a string is not a measurement.

Repair the copy from the intact original, preserving both files:

```sh
node -e "const fs=require('node:fs'); fs.copyFileSync('support-reference-trial-001/runs.json','support-reference-trial-001/restored-runs.json',fs.constants.COPYFILE_EXCL)"
node scripts/release-evidence.mjs support-reference-trial-001/policy.json support-reference-trial-001/restored-runs.json --markdown
```

Expect exit **2** again. The input contract is repaired; the underlying trial's failed gates remain. This is the correct distinction between fixing a representation and improving a system.

## 4. Adapt the delivery decision

Complete these artifacts for an authorized project or clearly fictional practice project:

| Artifact | Required decision |
| --- | --- |
| [Project brief](../../packs/client-delivery/project-brief.md) | Operator job, included deliverables, denied actions and receiving owner |
| [Architecture and cost record](../../packs/client-delivery/architecture-and-cost.md) | Manual, deterministic and model-assisted alternatives; one canonical ADR |
| [Acceptance protocol](../../packs/client-delivery/acceptance-protocol.md) | Workload-specific criteria, test population, limits and independent reviewer |
| [Handover](../../packs/client-delivery/handover.md) | Exact files, failure response, export/reopen and rollback rehearsal |
| [Support boundary](../../packs/client-delivery/support-and-change.md) | Supported versions, staffed responsibility and what constitutes new scope |

Keep the reference's synthetic evidence separate from your project's trial. Do not replace the reference corpus with real client data until its use is authorized and the serving identity/tool boundary is implemented. Provider-backed behavior needs new evaluation; it is not demonstrated by this local baseline.

The [offline workbench](../../workbench/index.html) can help author and export a project dossier. Workbench JSON is a planning format, not the `release-evidence.mjs` run schema. Use the workbench's explicit export controls and inspect the resulting files before sharing.

## 5. Hand over and reopen

Ask a separate reviewer or receiving engineer to follow the reference run instructions from a fresh directory. They inspect the raw traces, reproduce the report, reopen your dossier and identify the same hold reasons. Their observation must name the exact source and files.

When a second person is unavailable, mark the review self-performed. Finish the usable packet, retain the missing independent-review gate and avoid inventing a reviewer.

| Capstone criterion | Evidence for completion |
| --- | --- |
| Scope is bounded | One operator job; explicit exclusions; real or clearly fictional owners |
| Decision is defensible | Alternatives, selected mechanism, reversal condition and one canonical ADR |
| Evidence is inspectable | Original files, failure plus retry, version binding and collection limits |
| Claims are accurate | Local baseline distinguished from model, deployment and customer outcomes |
| Operations are usable | Fallback, rollback owner, reopened export and supported-environment statement |
| Economics remain honest | All attempts counted; unmeasured total cost and human effort remain unknown |
| Handover can continue | Receiving engineer reproduces it, or independent review is explicitly pending |

The capstone is complete when the packet supports a clear next decision without the original conversation. A responsible outcome may be **hold deployment and repair one specified boundary**.

## Continue from evidence

Run the meaningful behavior tests after adapting the implementation:

```sh
node --test scripts/architecture-review.test.mjs scripts/release-evidence.test.mjs scripts/support-agent-reference.test.mjs
```

Generate another packet in a new output directory after a code or configuration change. Keep the prior packet, source revision and repair explanation. A changed policy is a changed acceptance decision; record who authorized it and why. The point of the report is to preserve the reasoning a client needs to operate the system.

