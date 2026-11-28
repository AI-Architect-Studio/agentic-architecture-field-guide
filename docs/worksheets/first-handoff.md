# First handoff: can someone else make the release decision?

AI Architect Client Delivery Kit · Open Reference review edition 0.3.0 · Codex · 28 November 2026

Use this sheet when you hand a support assistant from its builder to the engineer who will operate it. The operator should be able to reproduce a supported answer, trace a failed lookup, and decide whether to ship using the files in front of them. The worked exercise uses a synthetic support corpus and a deterministic local reference.

## Give the operator four files

| File | What to inspect |
| --- | --- |
| `policy.json` | The permitted tools, required cases and conditions that hold a release. |
| `runs.json` | Every attempt, including failures, retries and unmeasured cost. |
| `evidence.json` | The answers, tool outcomes and source details behind the recorded assertions. |
| `release-manifest.json` | The source revision and checksums for the delivered kit. |

From the kit root, run with Node.js 22 or later. Use a fresh directory name for each attempt.

```text
node examples/support-agent-reference/run.mjs --out-dir handoff-trial-001
node scripts/release-evidence.mjs handoff-trial-001/policy.json handoff-trial-001/runs.json --markdown
```

Expect evaluator exit **2** for this exercise. Exit **1** indicates invalid input or a command error. Treat an exit of **0** as a discrepancy and inspect the report before relying on it.

## Ask the operator to replay three decisions

1. **Answer or escalate.** Locate the answer supported by a current article. Find the case that escalates when evidence is missing. Ask which source would need to change for the missing answer to become supportable.
2. **Retry or stop.** Compare `tool_timeout-1` with `tool_timeout-2`. Confirm both attempts survive. Find `direct_forbidden_tool-1` and confirm the attempted action was denied. A retry does not confer new permission.
3. **Release or hold.** Explain why the evaluator holds the release. Identify the deliberately planted timeout, the denied tool and the unmeasured total cost. Record what proof an operator would need from a real provider run before reconsidering.

## Record the next move

In the [offline workbench](../../workbench/index.html), write the client job, the selected architecture and the exact evidence references. Export JSON for the person continuing the work and Markdown for review. Ask that person to import the JSON in a fresh browser session and name the release owner and next action from the handover.

Record the review date, source SHA, reviewer and disposition alongside the outputs. A review of this exercise covers the local reference and its synthetic data. A real client release also needs authenticated tenant isolation, approved sources, provider failure tests and measured costs against the specific release candidate.

**Sources and revision.** [Executable reference and case list](../../examples/support-agent-reference/README.md) · [Evaluator and interpretation](../release-evidence-kit.md) · [Delivery lab](../labs/client-delivery-lab.md). Revision 0.3.0 adds this first-handoff exercise. The exact packaged revision is recorded in `release-manifest.json`. Review state: internal candidate.
