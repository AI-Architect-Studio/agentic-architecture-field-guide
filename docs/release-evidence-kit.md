# Bring evidence to the release decision

An architect handing a support agent to a client needs to show what was tested,
which versions were used, what failed, and who owns recovery. A passing unit test
does not answer those questions. This free kit connects an explicit acceptance
policy to imported attempt records and a concrete client handover.

Use it alongside the [architecture proof kit](architecture-proof-kit.md).
That kit records the architecture decision and cost assumptions. This one checks
declared test evidence against the decision's acceptance limits. Both run locally
with Node.js 22 or later, without dependencies, accounts, API keys or model calls.

## Run the example

```sh
node scripts/release-evidence.mjs examples/support-rag/policy.json examples/support-rag/runs.json
node scripts/release-evidence.mjs examples/support-rag/policy.json examples/support-rag/runs.json --markdown
node --test scripts/release-evidence.test.mjs
```

The example intentionally exits **2**: its timeout fallback meets the declared
behavior assertions, but the underlying tool error remains visible and blocks
the strict error gate. That is a useful delivery conversation. The architect
must investigate the cause and run a new trial, or explicitly redesign the
acceptance policy with the client. Deleting the failed attempt would conceal the
trial's reliability and cost.

Read the [scenario](../examples/support-rag/README.md) and
[handover](../examples/support-rag/handover.md). Every result and cost in these
fixtures is synthetic. No support agent was executed or customer served.

## Input and output contract

Copy both JSON files and retain the exact fields. Unknown or missing fields,
duplicate IDs, non-finite or negative measurements, and implicit type conversions
are rejected. Input files must be regular UTF-8 JSON files no larger than 1 MiB.
Output goes to stdout; the tool writes no files, calls no providers, opens no
evidence references, and performs no actions described by input text.

The policy records the system, model, prompt and corpus revisions, evaluation
dataset revision, currency, total trial cost ceiling, per-attempt latency limit,
tool allowlist and mandatory assertions for every scenario. Use immutable Git
SHAs, version IDs or content digests for real trials. Synthetic fixture names are
only demonstration identifiers. Pin raw evidence separately before sharing.

The runs file declares `illustrative` or `declared` evidence and **every attempt**,
including retries, rejected answers and tool failures. Each row has a unique ID,
case ID, exact target revisions, boolean/null assertion results, cost, latency,
attempted tool names, error and a redacted evidence reference. Costs and latency
may be `null`; unknown measurements block the affected gate. Use a single currency
and include all model/tool costs allocated to each attempt. The tool performs no
currency conversion or automatic pricing lookup.

| Gate | Passing condition |
| --- | --- |
| Version | Every attempt matches all four target revisions and the dataset revision |
| Coverage | Every policy case occurs; no unregistered case appears |
| Quality | Every configured assertion is explicitly true on every attempt; no unknown assertion appears |
| Cost | Every attempt has known cost in the policy currency; all attempts together fit the ceiling |
| Latency | Every attempt has known latency at or below the limit |
| Permission | Every attempted tool is allowlisted, including unsuccessful tool attempts |
| Error | Every attempt records `error: null` |

This is intentionally a conservative, all-attempt contract. It does not infer
statistical reliability from eight cases, average away a tenant leak, or let a
successful retry erase a failed attempt. Define workload-specific coverage and
sampling before evaluating real systems. A source-provided assertion is not an
independently checked fact.

JSON and Markdown reports retain the SHA-256 of the exact policy bytes, run bytes
and tool source. These fingerprints identify what was evaluated. They do not
authenticate a producer or prove that the input was complete. Raw traces,
assertion methods, collection boundaries and reviewer observations belong in the
handover record. Changes to a policy, system, model, prompt or corpus require a
new evaluation and review; old reports do not transfer automatically.

| Exit | Meaning |
| --- | --- |
| `0` | Supplied evidence satisfies configured gates; verification and release remain separate |
| `1` | Input, file or command contract is invalid; no report was produced |
| `2` | Valid input produced one or more failed gates |

Passing fixtures are `ILLUSTRATIVE_GATES_PASS`. Passing imported records are
`DECLARED_GATES_PASS_NOT_VERIFIED`. The report always sets
`releaseApproved: false`. It cannot verify tool enforcement, judge answer quality,
authenticate reviewers, establish that all retries were included, certify
security or approve a deployment.

## Use existing evaluation tools

Collect measurements and assertion results with the evaluation or observability
system already used by the client. Translate its output into the small input
contract and retain the raw evidence. This kit provides the delivery policy and
handover boundary; it does not replace a tracing platform, LLM judge, test runner
or runtime permission layer. The current input adapter is manual JSON only.

Keep customer transcripts, secrets and private documents out of examples and
public reports. The tool does not detect sensitive material. Use synthetic inputs
for a public demonstration and redacted, access-controlled evidence references
for a client review.

## Edition boundary

This entire kit, its examples and safety guidance follow the repository's MIT
license. It is free proof for the existing professional-pack direction. Paid
value must come from completed workload-specific implementation artifacts,
independent review, client acceptance and supported delivery. No commercial
price, availability, exclusive license or customer result is established here.
