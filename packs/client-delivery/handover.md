# Delivery and operator handover

Use this packet when another engineer must own the result. Replace every unresolved item with evidence or retain an explicit hold. Link one canonical architecture record rather than copying incompatible versions.

## Receiving record

| Item | Delivery reference |
| --- | --- |
| Project / brief / accepted scope | [IDs and revisions] |
| Source and release contents | [Exact commit and inventory] |
| Dependencies and supported environment | [Versions and fresh-install evidence] |
| Data/corpus and model configuration | [Approved revisions; no credentials] |
| Architecture decision | [Canonical ADR] |
| Trial policy / run records / report | [Exact files and hashes] |
| Raw evidence and reviewer decision | [Controlled references] |
| Delivery owner / receiving owner | [Named people] |
| Next source/dependency review | [Event and owner] |
| Current production state | [None / identified deployment and verification] |

## Receiving engineer's rehearsal

- [ ] Obtain the pinned source and validate its inventory.
- [ ] Follow the installation/run instructions in a fresh directory.
- [ ] Complete the normal task and inspect its source references.
- [ ] Run an unsupported-input and denied-action case.
- [ ] Cause the documented failure and complete the manual fallback.
- [ ] Export a task, close the session, reopen the artifact and inspect identity/version continuity.
- [ ] Reproduce the release report and explain its failed or unknown gates.
- [ ] Locate the person who can disable or roll back the live route.
- [ ] Record the exact commands, observations and remaining limitations.

A check is complete only after the receiving engineer records the observation. Repository examples are synthetic; copy no private client evidence into public fixtures.

## Operator response map

| Condition | Immediate action | Evidence and recovery |
| --- | --- | --- |
| No supporting source | Escalate to the designated specialist | Preserve the question, retrieved IDs and reason |
| Conflicting sources | Withhold the proposed answer | Identify conflicting revisions; ask the source owner to resolve |
| Retrieval/provider timeout | End the attempt at the defined deadline | Keep the failure and costs; use manual search; retry only within the agreed limit |
| Tenant or tool boundary failure | Disable the affected route | Preserve redacted traces; investigate before any resumed use |
| Misleading citation | Quarantine the draft | Attach source discrepancy and a regression case |
| Changed model/prompt/corpus | Start a new versioned trial | Rerun affected and mandatory boundary cases |
| Lost session | Reopen the approved local export | Confirm tenant, task and source versions before continuing |

## Rollback rehearsal

Record the last accepted version and the command/control that disables the route. Rehearse in the permitted environment: disable the candidate, restore the previous accepted configuration or manual workflow, complete one representative task, and verify the serving revision. Preserve the original incident evidence.

| Rehearsal field | Observation |
| --- | --- |
| Authorized environment and scope | [Reference] |
| Triggering failure | [Exact case] |
| Who executed recovery | [Person] |
| Disabled/restored revision | [IDs] |
| Task after recovery | [Evidence] |
| Elapsed recovery time | Unknown until measured |
| Unresolved risk and reopening condition | [Decision] |

No rollback has occurred merely because this document exists.

## Delivery inventory and export

Include the brief, canonical ADR, implementation instructions, data permissions, version manifest, all-attempt trial records, raw evidence references, report, independent findings, owner acceptance, support boundary and this completed rehearsal. An export should open with ordinary local tools. Before sharing, inspect it for customer data, credentials and unsupported claims.

Receiving decision: [Accepted within stated scope / rejected / evidence incomplete].  
Reason and next action: [Specific result, responsible person and review event].

