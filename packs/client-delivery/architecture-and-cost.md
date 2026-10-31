# Architecture and cost record

Keep the architecture decision in the existing [decision-to-release worksheet](../../docs/worksheets/decision-to-release.md) and [ADR template](../../docs/adr-template.md). This page connects those records to the delivery pack; it does not introduce a second decision schema.

## Choose the smallest sufficient system

Compare the manual workflow, a deterministic retrieval baseline and a model-assisted system against the same operator job. State what the model improves, the new failure modes it introduces, and the evidence that would justify its cost.

| Record | Link or immutable reference | Current state |
| --- | --- | --- |
| Client brief | [Project ID and revision] | [Draft / accepted for trial] |
| Decision worksheet | [One canonical path] | [Draft / reviewed] |
| ADR | [ID, source revision and owner] | [Proposed / accepted / superseded] |
| Input and tool boundaries | [Runtime policy/configuration] | [Specified / tested] |
| Supported environment | [Runtime and dependency versions] | [Declared / freshly tested] |
| Reversal condition | [Evidence that changes the selected option] | [Open / triggered] |

The [local reference implementation](../../examples/support-agent-reference/README.md) is a deterministic baseline over synthetic sources. Use it to inspect control boundaries and test delivery mechanics. An LLM, vector database, production authentication or hosted workflow requires its own implementation and evidence.

## Use the existing economics calculator

The [architecture proof kit](../../docs/architecture-proof-kit.md) defines the input contract and arithmetic. Copy its [complete example JSON](../../examples/consultant-brief/decision.json) into the private project, retain its required fields and replace the assumptions. Run from the repository root:

```sh
node scripts/architecture-review.mjs examples/consultant-brief/decision.json
node scripts/architecture-review.mjs examples/consultant-brief/decision.json --json
```

These commands generate the unchanged fictional example. For a real forecast, pass the edited project's file path. No provider prices are embedded as authoritative current rates. Record the verified rate source and date separately when replacing an assumption.

## Collect actuals without losing failures

| Quantity | Collection boundary | Actual | Evidence |
| --- | --- | --- | --- |
| Total attempts | Successes, rejected outputs, failures and retries | Unknown | [Attempt ledger] |
| Accepted outputs | Receiving operator's decisions on exact outputs | Unknown | [Disposition references] |
| Model/tool cash | Every billed call in the same currency/window | Unknown | [Redacted provider receipt] |
| Infrastructure cash | Explicit allocation for the measurement window | Unknown | [Allocation method] |
| Operator/reviewer/support minutes | Every attempt and correction | Unknown | [Time observations] |
| Comparable manual minutes | Matched jobs completed without the assistant | Unknown | [Baseline records] |

Cash per accepted output is all-attempt cash divided by accepted outputs. No accepted outputs or incomplete costs leave the result unknown. A zero external API charge in a local deterministic run does not establish zero delivery cost.

Model cost, latency and review time often move in different directions. Compare them separately before assigning monetary value to time. Revenue, acquisition, taxes, refunds and product-development effort belong in the commercial record; the architecture calculator does not establish profit.

## Decision to expand

Record the accepted result, comparable baseline, error severity, support load and total cost coverage. Expand only within the client's agreed scope. A useful baseline may be the final system; a more complex architecture must earn its additional operating burden.

