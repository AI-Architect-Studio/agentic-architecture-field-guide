# Client Delivery Workbench

Open `index.html` directly in a modern browser. It runs offline, needs no install,
and makes no network requests. The single HTML file contains its entire interface,
styles and application code.

The workbench produces an editable client packet from four stages: brief,
architecture decision, evidence map and handover. Load the synthetic Northstar
example, replace its assumptions with your own, then download Markdown or export
JSON. Import the JSON into another copy of the workbench to continue.

## What it does

- Edits the buyer job, exclusions, architecture tradeoffs, operating limits and owners.
- Records references and reviewer declarations for five evidence areas.
- Exports JSON, editable Markdown and a printable handover.
- Saves or restores a browser copy only when you explicitly choose the action.
- Validates imported structure and keeps release approval and runtime verification false.

It does not run an agent, evaluate answers, open references, verify a reviewer,
approve deployment, or establish client acceptance. The completeness count only
describes document fields. A recorded review is a user declaration. This project
JSON is its own editing format; it is not the policy/run input format consumed by
the repository's release-evidence CLI.

## Storage and limits

Edits remain in memory until an explicit save or export. Reload starts a blank
workspace; use **Restore saved** to recover a manually saved browser copy. Browser
storage is unencrypted, scoped by browser origin and may be unavailable or cleared.
File-origin storage behavior varies between browsers, so use an exported JSON as
the portable backup. **Remove saved copy** clears only this workbench's storage key
and leaves the open project in memory.

Import supports this workbench's schema version 1 and tool version 0.2.0. Files
larger than 1 MiB are rejected. Each editable text field is limited to 8,000
characters. Unknown fields, unsupported states, unbounded numeric limits and
review records without required references/reviewer names are rejected without
replacing the open project. Do not store secrets or private transcripts here.

## Checks

The optional `smoke.mjs` uses Playwright to exercise the real browser flow. It
requires a local Playwright installation and Chromium; neither is required to use
the HTML workbench.

```sh
node workbench/smoke.mjs
```

Set `WORKBENCH_QA_DIR` for captures and `WORKBENCH_CHROMIUM_PATH` only when using an
existing non-default Chromium executable. Checks cover editing, explicit storage,
restore, malformed import, JSON/Markdown export, injection handling, keyboard tabs,
mobile overflow, print output and absence of remote requests.

This is a free MIT product artifact in the Agentic Architecture Field Guide. The
synthetic sample does not establish a production deployment or paid customer.
