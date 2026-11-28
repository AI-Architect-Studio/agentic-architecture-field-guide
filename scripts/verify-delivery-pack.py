#!/usr/bin/env python3
"""Build the same Git revision twice and replay the packaged reference."""

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path
import sys


ROOT = Path(__file__).resolve().parents[1]


def verify(source_revision, destination):
    if not re.fullmatch(r"[0-9a-f]{40}", source_revision):
        raise ValueError("A full source commit SHA is required.")
    destination = destination.resolve()
    if destination == ROOT or ROOT in destination.parents:
        raise ValueError("Write the review evidence outside the source directory.")
    if destination.exists():
        raise ValueError("Choose a new evidence directory.")

    with tempfile.TemporaryDirectory(prefix="field-guide-replay-") as temp:
        scratch = Path(temp)
        archive = scratch / "source.zip"
        subprocess.run(
            ["git", "archive", "--format=zip", f"--output={archive}", source_revision],
            cwd=ROOT,
            check=True,
        )
        source = scratch / "source"
        with zipfile.ZipFile(archive) as zipped:
            zipped.extractall(source)

        builds = []
        for name in ("first", "second"):
            output = scratch / name
            pack = subprocess.run(
                [sys.executable, str(source / "scripts/build-delivery-pack.py"),
                 "--source-revision", source_revision, "--out", str(output)],
                cwd=source,
                check=True,
                capture_output=True,
                text=True,
            )
            builds.append(Path(json.loads(pack.stdout)["archive"]))

        digest = hashlib.sha256(builds[0].read_bytes()).hexdigest()
        if digest != hashlib.sha256(builds[1].read_bytes()).hexdigest():
            raise ValueError("Independent package builds produced different bytes.")

        unpacked = scratch / "unpacked"
        kit = unpacked / "ai-architect-client-delivery"
        with zipfile.ZipFile(builds[0]) as zipped:
            zipped.extractall(unpacked)
        manifest = json.loads((kit / "release-manifest.json").read_text(encoding="utf-8"))
        if manifest["sourceRevision"] != source_revision:
            raise ValueError("The package manifest identifies a different commit.")

        observed = scratch / "observed"
        subprocess.run(
            ["node", "examples/support-agent-reference/run.mjs", "--out-dir", str(observed)],
            cwd=kit,
            check=True,
        )
        evaluation = subprocess.run(
            ["node", "scripts/release-evidence.mjs", str(observed / "policy.json"),
             str(observed / "runs.json"), "--markdown"],
            cwd=kit,
            capture_output=True,
            text=True,
        )
        required = ("DECLARED_GATES_FAIL", "tool_timeout-1", "direct_forbidden_tool-1",
                    "All-attempt cost: Unknown USD")
        # The Markdown renderer escapes underscores in attempt identifiers.
        report = evaluation.stdout.replace(r"\_", "_")
        if evaluation.returncode != 2 or any(fragment not in report for fragment in required):
            raise ValueError(
                f"Expected the held reference trial, got exit {evaluation.returncode}.\n"
                f"{evaluation.stderr}{evaluation.stdout}"
            )

        (observed / "evaluation.md").write_text(evaluation.stdout, encoding="utf-8")
        destination.mkdir(parents=True, exist_ok=False)
        shutil.copyfile(builds[0], destination / builds[0].name)
        shutil.copytree(observed, destination / "observed")
        (destination / "summary.md").write_text(
            "# Field Guide review package\n\n"
            f"- Source revision: `{source_revision}`\n"
            f"- Edition: `{manifest['version']}`\n"
            f"- SHA-256: `{digest}`\n"
            "- Two builds matched. The unpacked reference replay reached the expected hold.\n"
            "- Review candidate. The replay used synthetic inputs and no model API.\n",
            encoding="utf-8",
        )
        print(digest)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-revision", required=True)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    try:
        verify(args.source_revision, args.out)
    except (OSError, ValueError, subprocess.CalledProcessError, zipfile.BadZipFile) as error:
        parser.exit(1, f"Review package: {error}\n")


if __name__ == "__main__":
    main()
