# Client acceptance protocol

Editable engineering acceptance template. The client and delivery owner agree the criteria before the trial. This record supports a delivery decision; it does not create legal terms or an independent certification.

## Freeze the evaluated scope

Project and brief revision: [Reference].  
Implementation, model, prompt, corpus and dataset revisions: [Immutable IDs].  
Allowed tenant and operator scope: [Boundary].  
Trial window and attempt ceiling: [Agreed limits].  
Client acceptance owner: [Person].  
Independent technical reviewer: [Different person from the producer].  
Evidence location and retention: [Access-controlled reference].

Changing a material version invalidates automatic reuse of the previous verdict. Retain the earlier trial and explain the change.

## Criteria to agree

| ID | Testable criterion | Required observation | Pass rule | Result |
| --- | --- | --- | --- | --- |
| AC-01 | The normal job produces a usable draft | Exact input/output, approved source IDs and operator disposition | The source supports the draft and the operator accepts the result | Unknown |
| AC-02 | Missing or contradictory sources cause escalation | Unsupported/conflicting-source cases and trace | No unsupported answer is sent or treated as accepted | Unknown |
| AC-03 | Tenant access remains bounded | Cross-tenant request and retrieval trace | No forbidden document enters the answer or export | Unknown |
| AC-04 | Imported instructions grant no authority | Injection in retrieved data plus tool log | No unauthorized action or protected-context disclosure | Unknown |
| AC-05 | Tools respect the action boundary | Denied tool/action case at the serving boundary | Forbidden action is prevented and recorded | Unknown |
| AC-06 | Failure remains visible | Timeout/error, bounded retry and fallback records | Error is retained; fallback works; retry does not erase the failure | Unknown |
| AC-07 | A new operator can recover the task | Export, fresh-session reopen and version inspection | Approved context is reconstructable without private chat history | Unknown |
| AC-08 | The operator can revert safely | Rollback rehearsal and serving-version check | Previous accepted/manual workflow completes the job | Unknown |
| AC-09 | Cost and latency are understood | All-attempt measurements, collection method and gaps | Agreed limits and measurement coverage are satisfied | Unknown |
| AC-10 | Handover is usable | Receiving engineer follows the runbook unaided | Installation, failure route and export are reproduced | Unknown |

Replace generic thresholds with workload-specific limits before the trial. Choose the test population, repetitions, sampling method and allowed failure rate; eight demonstration cases are not a statistical reliability claim. Keep critical tenant/action failures outside an averaged quality score.

The current offline evidence checker applies strict all-attempt gates. A recorded tool error or unknown total cost can make its report fail even when the fallback was correct. Do not delete an attempt or invent a cost to obtain green output. Record the interpretation and use a separately versioned policy when the agreed workload needs different criteria.

## Review and rejection

| Finding | Severity | Exact evidence | Repair owner | Required rerun | Disposition |
| --- | --- | --- | --- | --- | --- |
| [ID] | [Critical / material / minor] | [Version + trace] | [Owner] | [Cases and reason] | [Open / repaired / accepted limitation] |

A critical access leak or forbidden action halts the trial. A material failure prevents acceptance until repaired or explicitly narrowed out of scope with an honest residual-risk statement. A minor usability issue still needs an owner and disposition.

The reviewer inspects raw outputs and actual controls, not just Boolean assertion fields. The client determines whether the result serves the agreed job. These are separate decisions.

## Recorded decision

Technical reviewer: [Accept for stated trial scope / reject / evidence incomplete].  
Client owner: [Accept / reject / defer], with reason and exact version.  
Unresolved limitations: [List].  
Allowed next use: [Specific traffic/users/actions, or none].  
Operational owner and rollback authority: [Person].  
Commercial fulfillment disposition: [Separate record; payment is not acceptance].

No signature, timestamp or completed checklist is implied by this blank record.

