# From a ChatGPT brief to a Codex change you can review

**Output.** One behavior test, a reviewable diff, an evidence packet and a continuation prompt another maintainer can use. The public lab is MIT licensed. Use a disposable checkout and synthetic material. Node.js 22 or later is required to execute the tests. The local exercise can be completed manually with the prompts and commands below.

## 1. Set the decision and the scope

Use the [decision-to-release worksheet](../worksheets/decision-to-release.md) for the brief. In ChatGPT, paste the following with your checkout's `git rev-parse HEAD` result, or give it to the companion skill when installed.

> A maintainer of the synthetic support reference needs proof that whitespace-only questions are rejected before retrieval. Prepare a bounded Codex task. Change only the support reference test file. The new test must observe a rejected answer with the existing bounded-question error and an empty tool trace. Compare a test-only change with changing runtime validation, then select the smallest option supported by the source. Record unknowns and give me two testable acceptance criteria. Keep the decision and prompt in Markdown.

The intended decision is a test-only addition when inspection confirms that runtime validation already meets the contract. Stop and report the discrepancy if it does not. A maintainer owns the final review.

## 2. Execute in Codex and retain the evidence

Give Codex the brief and your accepted scope. Ask it to inspect repository instructions, run the baseline and record the exact command and status, then add one separate test to `scripts/support-agent-reference.test.mjs`. Use the existing local agent constructor. Check the rejection message and that the same agent has an empty tool trace. Run the test suite again and inspect the diff.

```sh
node --test scripts/support-agent-reference.test.mjs
git diff --check
git diff -- scripts/support-agent-reference.test.mjs
```

Next, produce a separate evaluator packet. Use a new output directory for each attempt. The evaluator should exit **2** for this fixture. Its deliberately blocked gates describe the synthetic reference trial. The unit suite above should still pass.

```sh
node examples/support-agent-reference/run.mjs --out-dir field-guide-trial-001
node scripts/release-evidence.mjs field-guide-trial-001/policy.json field-guide-trial-001/runs.json --markdown > field-guide-trial-001/evaluation.md
```

Preserve the evaluator exit status immediately. Inspect the held result, retained timeout and retry, and unknown total cost. The packet is local. Keep it outside your commit and inspect exports before attaching them to chat.

## 3. Give a reviewer a cold start

| Criterion | Evidence to hand over | Reviewer check |
| --- | --- | --- |
| Blank input is rejected before retrieval | Exact test diff and complete test output | The assertion observes the actual rejection and zero tool calls on the same agent |
| Scope is limited to one test file | Base SHA and full changed-file list, including any staged paths | No runtime edits are included in the proposed change |
| Failed evidence stays visible | Evaluator status, report and run records | The timeout and retry both appear, the result stays held, and unknown cost stays unknown |
| Another maintainer can resume | One Markdown handoff with base SHA, diff or commit, commands, receipt paths, gaps and next action | A recipient opens the files and repeats the review without the original conversation |

Ask the reviewer to return `accepted`, `held` or `rejected` for the **proposed test change** and record their rationale. Preserve the separate held result for the evaluator fixture.

> Continue from revision or diff **[reference]**. Inspect **[receipt paths]** and rerun **[command]**. The new test outcome is **[observed status or not run]**. The fixture gate is **[observed status or unknown]**. The remaining review item is **[item]**. Next authorized action is **[action]**.

## Install and maintain the companion

This repository defines a one-entry Codex marketplace. From a local checkout that contains the companion files, run these commands with a Codex CLI that supports local marketplaces.

```sh
codex plugin marketplace add .
codex plugin add starlight-field-guide@agentic-architecture-field-guide
codex plugin list
```

The [skill instructions](../../plugins/starlight-field-guide/skills/decision-to-evidence/SKILL.md) are readable directly. The companion ships one skill and declares no integrations, services or hooks. ChatGPT invocation and public listing require their own verification. The core lab also works with the prompts above.

Keep the source revision and plugin version with every receiving-user test. Review an update in a clean install before promoting it. Retain the last known-good source revision and package hash for rollback. The [edition and distribution policy](../DISTRIBUTION.md) governs publication and paid access.
