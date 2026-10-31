# AI Architect Client Delivery Kit

Turn a client brief into an editable architecture and handover package, then inspect the evidence behind a concrete support-agent reference.

This edition combines a local browser workbench, reusable delivery templates, a worked client dossier, a guided lab and executable reference code. Everything in this source package is MIT licensed. It is a reference and delivery toolkit; it does not include a hosted AI service, a paid support contract or a certification.

## Open the workbench

Open `workbench/index.html` in a modern desktop browser. It works offline, with no account or API key. Complete the client brief, architecture, evidence and handover stages. Export JSON to preserve editable state and Markdown to hand the document to another person. Use synthetic examples until your own handling rules permit client information on the device.

The workbench records decisions and declarations. Its checklist does not execute tests or establish deployment approval.

## Complete a client delivery

Start with [the guided lab](docs/labs/client-delivery-lab.md). Use the [client delivery pack](packs/client-delivery/README.md) for reusable templates and the worked example. The completion condition is another engineer being able to understand the scope, inspect the evidence and take over the next action.

## Run the reference

Install Node.js 22 or later, then follow [the runnable support-agent reference](examples/support-agent-reference/README.md). It executes a deterministic retrieval baseline against synthetic material and derives assertions from observed outputs. It does not call a language model or prove how one will behave.

Run the complete local test suite from the package root:

```sh
node --test scripts/architecture-review.test.mjs scripts/release-evidence.test.mjs scripts/support-agent-reference.test.mjs
```

The [release-evidence guide](docs/release-evidence-kit.md) explains the distinction between imported declarations, observed local behavior and independent release acceptance. Intentional failure cases and unknown measurements remain visible.

## Keep the source and evidence together

The included `release-manifest.json` identifies the source revision and every delivered file's checksum. The authoritative source is [Agentic Architecture Field Guide](https://github.com/AI-Architect-Studio/agentic-architecture-field-guide). Update or replace examples deliberately; old evidence does not transfer to a changed model, prompt, tool, corpus or client boundary.

Commercial prices, live deployment, actual client results and service guarantees are not established by this package. See [LICENSE](LICENSE) and [the distribution model](docs/DISTRIBUTION.md).
