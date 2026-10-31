# Client project brief

Editable delivery template. Replace the bracketed fields before review. This is a project-scoping record; it does not establish contractual terms, a price or authorization to access a client's systems.

## Decision and beneficiary

| Field | Project record |
| --- | --- |
| Project ID and brief revision | [Stable ID; revision; date] |
| Client decision owner | [Role and approved internal contact reference] |
| Delivery architect | [Responsible person] |
| Intended operator | [Specific role and operating situation] |
| Trigger | [Event that starts one task] |
| Input already available | [Question, tenant identity and approved source] |
| Output to accept | [Artifact the operator can inspect] |
| First-value event | [Observed completed job, not a login or generated response] |
| Current manual alternative | [How the job is done today] |

Write the decision in one sentence: “[Operator] will use [bounded mechanism] to produce [inspectable artifact], with [named person] responsible for [external action].”

## Scope and delivery inventory

| Deliverable | Exact output and format | Acceptance reference | Receiving owner |
| --- | --- | --- | --- |
| Architecture decision | Existing ADR and decision worksheet, pinned revision | [Criterion ID] | [Owner] |
| Working implementation | Source commit, dependency/version record, configuration guide | [Criterion ID] | [Owner] |
| Evaluation | Policy, all-attempt records, raw traces and report | [Criterion ID] | [Owner] |
| Operations | Runbook, fallback, export and rollback rehearsal | [Criterion ID] | [Owner] |
| Knowledge transfer | A receiving engineer reproduces the agreed job | [Criterion ID] | [Owner] |

Explicit exclusions: [For example: autonomous sending, refunds, account writes, additional tenants, private-memory ingestion, continuous hosting, new provider procurement.]

## Data and action agreement

| Boundary | Approved input or action | Denied input or action | Enforcement and evidence |
| --- | --- | --- | --- |
| Tenant identity | [Identity authority] | [Caller-authored tenant override] | [Serving-system check and test] |
| Corpus | [Named approved collection and revision] | [Private/unlicensed/unreviewed sources] | [Ingestion manifest and access test] |
| Tools | [Named allowed operations] | [All other operations] | [Runtime enforcement and denied-case trace] |
| Model/service | [Chosen provider and settings, when applicable] | [Unapproved destinations/fallbacks] | [Current provider configuration evidence] |
| Export | [Approved fields and recipient scope] | [Credentials/private raw transcripts] | [Redaction and reopen inspection] |

Record credential ownership by reference; never paste credentials here. A retrieved article cannot grant tool access. An editable template cannot enforce a runtime boundary.

## Client inputs and unresolved assumptions

| Required input or decision | Owner | Needed before | Current state |
| --- | --- | --- | --- |
| Approved source inventory | [Owner] | Implementation trial | [Unknown / received / inspected] |
| Workload examples and unacceptable outcomes | [Owner] | Acceptance-policy freeze | [State] |
| Runtime/data permissions | [Owner] | Any real-client execution | [State] |
| Baseline and cost collection method | [Owner] | Comparison trial | [State] |
| Commercial terms and support scope | [Owner] | Paid commitment | [State] |

Do not convert a missing input into an assumed approval. A change to the job, tenant set, corpus, actions or model configuration returns to this brief and the acceptance protocol.

## Delivery decision

Decision: [Continue / revise / hold / stop].  
Reason and next evidence: [Specific observation].  
Owner and review point: [Person; event or date].  
Separate commercial record: [Approved quote/contract reference, or unagreed].  
Separate execution authorization: [Exact permitted trial scope, or absent].

