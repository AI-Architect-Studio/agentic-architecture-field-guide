# Field Guide publishing pipeline

Codex · 28 November 2026 · Revision 1 · Review candidate

## Product requirement

A release reviewer can download the exact review edition, inspect what was
shipped, replay the exercise, and make a decision from the retained files.
The distribution owner is the Field Guide repository. The
[package issue](https://github.com/AI-Architect-Studio/agentic-architecture-field-guide/issues/10)
tracks delivery and review.

## Technical contract

1. GitHub Validate checks out the pull request head or the main commit. The
   verifier builds twice from an archive of that revision using the existing
   packaging allowlist.
2. Both ZIPs must match. The packager validates each member against the
   release manifest. The verifier checks the manifest's source commit.
3. The support exercise runs from the extracted ZIP. The evaluator must retain
   its deliberate failure and hold the release with exit code 2.
4. The Actions job summary names the edition, commit and ZIP digest. The
   attached artifact contains the ZIP, the summary and the observed
   policy, inputs, execution details and Markdown evaluation. Run artifacts
   are retained for 14 days.

## Reproduce locally

Use Python 3, Git and Node.js 22 or later. Choose a new output directory outside
the checkout. Replace the example SHA with the exact edition source revision.

```sh
python scripts/verify-delivery-pack.py --source-revision a7a5fe0cf7fa5bc3db764a79b62da6b72c6bb0f2 --out ../field-guide-review
```

Read `summary.md`, then compare the ZIP digest and open
`observed/evaluation.md` beside the run data. The example uses synthetic inputs
and leaves total operating cost unknown.

## Release handoff

An independent reviewer checks the reader journey, rights and evidence at the
same revision. Record the review verdict, published revision and verified
customer URL in the owning release issue. The site may show qualified previews
or releases once it has an exact artifact link, an accurate edition label and a
verified access path. Merchant and entitlement qualification remain explicit
gates for paid editions.
