# Execute the support boundary before connecting a model

This reference runs a small deterministic support assistant against a synthetic
corpus and records its behavior. It gives an architect an executable boundary to
inspect: which tenant may read a document, which tools may run, how retrieval
failure becomes an escalation, and what survives export and recovery.

It uses no LLM, API key, network request or provider account. The reference is a
local test implementation; it is not a deployed support product and does not
establish model quality. The source articles and questions are synthetic, while
the generated results describe an actual local execution of this code.

## Run and inspect

From the repository root, use Node.js 22 or later:

```sh
node examples/support-agent-reference/run.mjs --out-dir support-reference-trial-001
node scripts/release-evidence.mjs support-reference-trial-001/policy.json support-reference-trial-001/runs.json --markdown
```

Choose an output directory that does not already exist. The runner creates a new
packet rather than overwriting earlier evidence. Keep each run intact when
comparing a repair with its previous behavior.

| Output | Purpose |
| --- | --- |
| `policy.json` | The evaluated versions, required cases, permitted tools and gate limits |
| `runs.json` | Compatible attempt records for the offline release-evidence evaluator |
| `evidence.json` | The execution details to inspect alongside the recorded assertions |

Open all three files. An assertion result is useful only when the underlying
output or tool behavior supports it. The evaluator reads `policy.json` and
`runs.json`; it does not independently inspect or authenticate `evidence.json`.

## What the reference exercises

The implementation and synthetic corpus are in [agent.mjs](agent.mjs) and
[corpus.json](corpus.json). The [runner](run.mjs) executes bounded scenarios and
retains **11 attempts across 10 cases**, including the failed timeout attempt and
its later retry. Question routing uses a few explicit keyword rules; supported
answers are composed from administrator-reviewed structured token-policy facts.
It is not general semantic search or unrestricted support-question answering.

| Scenario | Boundary under test |
| --- | --- |
| Grounded answer | A supported question produces the current source-backed response |
| Missing evidence | An unsupported question escalates without inventing a capability |
| Current and archived citations | Superseded documentation does not replace the current instruction |
| Contradictory evidence | Conflicting current instructions cannot silently become one confident answer |
| Retrieved prompt injection | Hostile source text cannot add tools or change the task's permissions |
| Tenant isolation | Another tenant's article cannot be read through the reference's tool interface |
| Forbidden write request | A request to change an account or issue a refund does not become a write action |
| Direct unauthorized tool invocation | The tool boundary rejects a forbidden call even outside the answer path |
| Tool timeout | Retrieval failure produces a bounded response and retains the failed attempt |
| Export and recovery | A resumed reference retains the intended task and source boundary |

The corpus has two distinct trust levels. Its structured `facts` are trusted
administrator input. The `rawText` field is untrusted and is deliberately ignored
when composing an answer or selecting a tool. The injection case verifies this
deterministic separation; it does not test an LLM's response to hostile context.

The constructor accepts `tenantId` from its caller. It does not authenticate a
user or decide which tenant that user may select. A serving application must
derive this identity from a trusted session before creating the reference.

The earlier [scenario worksheet](../support-rag/README.md) explains the client job
and acceptance criteria. This executable reference adds local behavior evidence;
it does not replace the worksheet's independent review or client handover.

The packet's target binds the implementation source and structured corpus through
SHA-256 fingerprints. The evidence also records the runner and raw corpus-file
fingerprints. These identify the evaluated bytes; they do not authenticate the
person who ran them or provide an independent review.

## Read the blocked gates correctly

The evidence evaluator is expected to report **`DECLARED_GATES_FAIL`** for this
trial. Three boundaries are deliberate:

- No external model or API charge is incurred. Total infrastructure cost has not
  been measured, so each attempt's total `cost` remains `null`. Zero external API
  spend is not a zero-cost claim.
- The timeout scenario records an error even when the assistant returns a useful
  fallback. The hard error gate preserves that failure. Recovery does not erase
  it.
- The direct forbidden-tool scenario deliberately attempts `refund_customer`.
  The runtime denies it successfully, but the strict evaluator still records the
  forbidden attempt and its error. A successful negative boundary test is not a
  successful normal-operation attempt.

The evaluator exits with code `2` when supplied records fail a gate; code `1`
means invalid input or a command/file error. A blocked report is an inspectable trial
result. Do not replace unknown cost with zero or remove a failed attempt to make
it pass. Changes to acceptance policy need an explicit, versioned rationale.

Other failures may reveal defects in the implementation or assumptions. Inspect
the corresponding evidence, correct the cause, and generate a new packet. Keep
the failed packet and the repair version together.

## Adapt the boundary to a real client

Start by replacing the synthetic source set with an authorized, versioned corpus
and preserving the client's tenant and access rules. The client must define
which outcomes justify an answer, an escalation or a stopped task.

A model-backed implementation may generate better prose and interpret a wider
range of questions. It also creates new failure modes that this deterministic
reference cannot measure. Keep authorization outside the model: validate tool
names and arguments, scope retrieval to the authenticated tenant, and enforce
timeouts in the actual tool implementation. A prompt alone is not that boundary.

Export saves the tenant, source/configuration target and last question. Resume
rejects a different tenant or target, then recomputes the answer in a fresh
instance instead of trusting a saved answer. The snapshot is not signed and does
not prove that a question was previously approved. Add authentication and any
required approval checks at the serving boundary; a saved file cannot supply
them.

Run the same scenarios through the real provider adapter, add representative
client questions and adversarial variants, and retain every attempt and retry.
Measure model and infrastructure cash, latency and operator review time. Use a
distinct reviewer to inspect grounding, data isolation, recovery and the exact
implementation revision before a client trial.

Complete the [handover worksheet](../support-rag/handover.md) with actual owners,
versions, rollback evidence and the client's acceptance decision. Deployment,
commercial fulfillment and ongoing operation require their own evidence. This
free MIT reference supplies a testable starting point; its report grants none
of those states.
