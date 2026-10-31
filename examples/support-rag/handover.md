# Support assistant trial handover

This editable worksheet belongs to the synthetic support/RAG example. All live
implementation, execution and client acceptance fields remain **unverified**.
Complete them with source-bound evidence before an operator receives the system.

## Ownership and version record

| Field | Trial record |
| --- | --- |
| Client and beneficiary | Synthetic Northstar Desk; tenant-A support operator |
| Delivery owner | Unassigned |
| Client acceptance owner | Unassigned |
| Independent technical reviewer | Unassigned; must inspect the maker's evidence |
| Implementation revision | Unverified |
| Model, prompt and retrieval configuration revisions | Unverified |
| Corpus revision and tenant policy revision | Unverified |
| Evaluation policy, run-file and report fingerprints | Record the exact generated values |
| Review date and evidence expiry | Unassigned; repeat review on material change |
| Runtime and deployment | None established by this example |
| Live release decision | Pending; a local report cannot grant it |

Use the existing [architecture decision worksheet](../../docs/worksheets/decision-to-release.md)
for the chosen option, alternatives and trust boundary. Attach the decision
revision to this packet instead of creating a second architecture narrative.

## Acceptance packet

Retain these artifacts together for the same evaluated revision:

1. The agreed job, excluded actions and client-approved acceptance policy.
2. The source/corpus manifest, data permissions and current-versus-archived rules.
3. The input and response for every required case, including every failed attempt
   and retry, with retrieval IDs and a redacted tool trace.
4. Measured cash and latency, the collection method, coverage gaps and allocation
   of shared costs. Unknown costs remain unknown.
5. The local evaluation report and source-file fingerprints.
6. The distinct reviewer's inspected evidence, findings, unresolved defects and
   recommendation for this exact version.
7. The client's acceptance or rejection, approved rollout scope and rollback owner.

A Boolean assertion is an index into evidence. The reviewer should be able to
find the exact response or boundary trace that supports it. A source hash binds
bytes; it does not prove an observation authentic or a judgment correct.

## Operator runbook

| Condition | Required operator action | Evidence to retain |
| --- | --- | --- |
| Supported answer with current citation | Inspect the cited article and draft before sending through the existing support workflow | Draft, article revision and operator disposition |
| Missing or contradictory evidence | Escalate to a support specialist; do not infer a product capability or policy | Question, retrieved references and escalation reason |
| Retrieval timeout or provider failure | Stop that attempt after the configured timeout; use the manual search baseline | Error, elapsed time, all attempt costs and fallback result |
| Forbidden tool call or tenant-access attempt | Halt the trial and restrict the affected route while the owner investigates | Redacted authorization decision, exact versions and incident reference |
| Suspected misleading citation or answer | Quarantine the draft; add the example to the regression set before another release | Original output, source discrepancy and correction |
| Interrupted task | Resume only with the same tenant, task and approved source/configuration identity; otherwise start a new reviewed task | Interruption and resume record; no repeated side effects |
| Model, prompt, tool or corpus change | Assign new revisions and rerun affected cases plus the mandatory boundary cases | Change description, new policy/run fingerprints and review |

Runtime timeouts, tenant filters and tool authorization must be implemented and
tested in the serving system. This worksheet and the offline evaluator do not
install those controls.

## Recovery and rollback rehearsal

Before the trial, the owner records the last accepted configuration and confirms
that operators can use manual article search without the assistant. Rehearse an
interruption after retrieval: export the allowed draft and sources, reopen them
in a fresh session, and verify tenant identity, article revisions and task state.

For rollback, disable the assistant route, retain redacted evidence, and restore
the last accepted configuration through the runtime's documented deployment
process. Confirm the support team can complete the job through manual search.
Record who executed rollback, which revision is serving, the observation time,
and the smoke test. Re-enabling requires resolution of the triggering defect and
a new independent review. No rollback has been executed by this example.

## Trial scorecard and stop decision

| Measure | How to collect it | Current value |
| --- | --- | --- |
| Accepted drafts / all attempted drafts | Operator dispositions linked to retained outputs | Unknown |
| Cash per accepted draft | All trial attempt cash, including retries, divided by accepted drafts | Unknown |
| Human minutes per accepted draft | Authoring, review, correction and support time across all attempts | Unknown |
| Manual baseline | Comparable support questions completed with article search alone | Unknown |
| Defects and escalations | Versioned cases, severity, owner and resolution | Unknown |
| Customer acceptance | Client's decision on the exact delivered packet | Unknown |

Stop the trial on a tenant-boundary failure, forbidden action, unresolved
misleading answer, exceeded agreed budget or missing evidence needed for the
release decision. Do not expand traffic to compensate for an inconclusive trial.
The next useful result is a completed, independently inspected client packet;
more generated reports do not establish it.
