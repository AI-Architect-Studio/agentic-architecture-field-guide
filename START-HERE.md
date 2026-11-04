# AI Architect Client Delivery Kit

Turn a client brief into an editable architecture and handover package, then inspect the evidence behind a concrete support-agent reference.

This edition combines a local browser workbench, reusable delivery templates, a worked client dossier, a guided lab and executable reference code. Everything in this source package is MIT licensed. It is a reference and delivery toolkit; it does not include a hosted AI service, a paid support contract or a certification.

## Open the workbench

Open `workbench/index.html` in a modern desktop browser. It works offline, with no account or API key. Complete the client brief, architecture, evidence and handover stages. Export JSON to preserve editable state and Markdown to hand the document to another person. Use synthetic examples until your own handling rules permit client information on the device.

The workbench records decisions and declarations. Its checklist does not execute tests or establish deployment approval.

## Complete a client delivery

Start with [the guided lab](docs/labs/client-delivery-lab.md). Use the [client delivery pack](packs/client-delivery/README.md) for reusable templates and the worked example. The completion condition is another engineer being able to understand the scope, inspect the evidence and take over the next action.

## Run the reference

Install Node.js 22 or later, then follow [the runnable support-agent reference](examples/support-agent-reference/README.md). It executes a deterministic retrieval baseline against synthetic material and derives assertions from observed outputs. It does not call a language model or prove how one will behave.

Run the complete local test suite from the package root:

```sh
node --test scripts/architecture-review.test.mjs scripts/release-evidence.test.mjs scripts/support-agent-reference.test.mjs
```

The [release-evidence guide](docs/release-evidence-kit.md) explains the distinction between imported declarations, observed local behavior and independent release acceptance. Intentional failure cases and unknown measurements remain visible.

## Keep the source and evidence together

The included `release-manifest.json` identifies the source revision and every delivered file's checksum. The authoritative source is [Agentic Architecture Field Guide](https://github.com/AI-Architect-Studio/agentic-architecture-field-guide). Update or replace examples deliberately; old evidence does not transfer to a changed model, prompt, tool, corpus or client boundary.

Commercial prices, live deployment, actual client results and service guarantees are not established by this package. See [LICENSE](LICENSE) and [the distribution model](docs/DISTRIBUTION.md).

## Demonstrate the evidence handoff in 12 minutes

Use this bounded demonstration before adapting the kit to a real engagement. It proves that the recipient can inspect a local run, see a retained failure and reopen the handover without relying on the original chat. It does not prove live-model quality, deployment readiness or customer acceptance.

1. Run the deterministic reference and save the evaluator report:

   ```sh
   node examples/support-agent-reference/run.mjs --out-dir demo-trial-001
   set +e
   node scripts/release-evidence.mjs demo-trial-001/policy.json demo-trial-001/runs.json --markdown > demo-trial-001/evaluation.md
   status=$?
   set -e
   test "$status" -eq 2
   ```

   The evaluator must exit **2**. A zero exit would hide the intended blocked gates; exit **1** would mean the evidence input is invalid. Preserve `evaluation.md` with the trial.

2. Show the receiving engineer all three boundaries:
   - `tool_timeout-1` and its preserved retry `tool_timeout-2`;
   - `direct_forbidden_tool-1`, which the runtime denied with `tool_not_allowed`;
   - the unknown USD cost, which remains unknown rather than becoming zero.

3. Export one dossier from `workbench/index.html` as JSON and Markdown. Close the page, reopen it and import the JSON. Confirm that the exported `project.name`, `project.client`, `project.owner`, `project.job`, `architecture.decision`, `evidence.refs` and `operations.acceptanceOwner` survive the round trip.

4. Hand the recipient the generated trial directory, both dossier exports, the receipt below and the exact repository revision. The recipient passes the demonstration only when they can locate the retained failure and retry, explain the blocked release decision and verify every receipt reference without access to the original chat.

Copy and complete this receipt outside the public repository:

```yaml
verdict: accepted | held | rejected
reviewer: <name or accountable identity>
observed_at_utc: <RFC 3339 timestamp>
source_revision: <full commit SHA>
dossier_json:
  file: <path>
  sha256: <digest>
dossier_markdown:
  file: <path>
  sha256: <digest>
evaluator_report:
  file: demo-trial-001/evaluation.md
  sha256: <digest>
  exit_code: 2
retained_failure:
  failed_attempt: tool_timeout-1
  retry_attempt: tool_timeout-2
  evidence_ref: <file and JSON path or report section>
release_decision:
  status: held
  evidence_ref: <report section>
next_action: <one bounded action>
owner: <accountable identity>
```

A prepared dossier or green unit test is not an accepted handover. Keep confidential client material and completed private receipts outside this public repository.
