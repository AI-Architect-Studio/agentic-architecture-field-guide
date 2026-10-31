# Northstar Desk: a worked client delivery dossier

**Fictional project.** Northstar Desk, its roles, workload and numerical targets below are authored examples. They are not a client, testimonial, paid engagement or measured outcome.

## The decision

A support specialist needs a grounded draft for a product-support question. The specialist already has the question, tenant identity and an approved help centre. The useful result is a concise draft with current article references, or an explicit escalation when evidence is missing or conflicting. The specialist retains the decision to send.

The first delivery is a tenant-scoped, read-only assistant. Refunds, account changes, customer-message sending, private memory and additional tenants are excluded. Source: this dossier version 1; implementing example: [support-agent reference](../../examples/support-agent-reference/README.md).

| Role | Responsibility in the fictional project |
| --- | --- |
| Support lead | Own the job, source quality and operator acceptance |
| Delivery architect | Own scope, architecture and working implementation |
| Independent reviewer | Inspect access boundaries, raw trial results and recovery |
| Receiving engineer | Reproduce installation and own the operational route |
| Support specialist | Inspect the draft and decide whether to send it |

These are project roles, not assigned real people. A real trial remains on hold until each necessary responsibility is accepted.

## What is delivered

1. A deterministic reference baseline over synthetic articles, with tenant scope and explicit retrieval operations.
2. A scenario suite that includes normal retrieval, unavailable knowledge, contradictory evidence, hostile source text, cross-tenant requests, forbidden actions and a timeout/retry path.
3. Actual local execution records from that baseline when the practitioner runs it.
4. A strict supplied-evidence report and a handover record explaining every failed or unknown gate.
5. An adaptation exercise that preserves the manual support workflow.

The local baseline has no LLM and establishes no model-quality result. A future model-assisted version would require provider configuration, prompt/model revisions, real workload evaluation and independently inspected controls.

## Architecture choice

| Option | Benefit | Operating burden | Decision |
| --- | --- | --- | --- |
| Manual help-centre search | Clear source and action boundary | Specialist performs retrieval and drafting | Retain as the operational baseline and fallback |
| Deterministic scoped retrieval | Reproducible behavior and small permission surface | Limited language coverage and source adaptation | Select for the current reference and boundary rehearsal |
| Model-assisted retrieval and drafting | May improve varied-question handling and drafting | Model uncertainty, provider/data settings, cost and evaluation | Defer until a matched workload shows sufficient benefit |

Use the [canonical decision worksheet](../../docs/worksheets/decision-to-release.md) for the real client's ADR. Reversal condition: representative questions require synthesis the deterministic baseline cannot deliver, and a bounded model-assisted trial demonstrates better accepted results at tolerable total cost.

## Trial scope and failure decisions

Illustrative targets for a future client trial: 50 representative questions, two repetitions per configuration, zero observed cross-tenant leaks or forbidden actions, and operator dispositions for every attempted draft. A p95 latency target of four seconds is a hypothetical business requirement; it is not a result from the local synthetic suite. This sample size does not establish general safety or a rare-event failure rate.

Unsupported answers are rejected. Insufficient knowledge escalates. Conflicting current articles stop an answer until a source owner resolves the conflict. Retrieved instructions cannot widen the tool allowlist. A timed-out attempt remains in the record even when a bounded retry succeeds.

The current strict evaluator can correctly fail the full trial because a timeout occurred and infrastructure cost is unknown. The architect's useful output is an honest hold decision and a specific recovery plan. A passing retry does not rewrite the earlier trial.

## Cost and commercial scope

The reference performs no external API calls. Its external API charge is therefore zero for the local execution path. Compute allocation, implementation, review and support cost are unmeasured; the evidence report must keep total attempt cost unknown until a defensible allocation exists.

Illustrative future forecast: 600 attempted drafts per month, 80% operator acceptance, €0.02 model cash per attempt, €30 allocated infrastructure per month and two human review minutes per attempt. Under those assumptions, cash is €42 and accepted drafts are 480, or €0.0875 cash per accepted draft. Review effort is 20 hours across all attempts. At a hypothetical €60 hourly time value, the combined cash-plus-valued-time comparison is €1,242, or €2.5875 per accepted draft. Valued time is not cash revenue; these are arithmetic examples, not current provider prices or a price quote.

The client would receive the named source edition, adaptation instructions and a supported-environment statement. Ongoing hosting, custom integrations and staffed response commitments require separately agreed scope. No commercial terms have been agreed in this fictional project.

## Handover decision

**Hold production; continue the local adaptation exercise.** The package provides a working deterministic baseline and a reproducible evidence path. It does not yet establish a real client runtime, tenant authentication, live-model evaluation, operational deployment, complete costs or customer acceptance.

The next acceptance event is concrete: a receiving engineer runs the reference from a fresh directory, finds the timeout and unknown-cost gates, explains the relevant raw evidence, and completes a client-specific brief, architecture decision and recovery plan. The independent reviewer then assesses the exact artifacts.

