#!/usr/bin/env python3
"""Build a portable, checksummed release from the public source allowlist."""
import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ROOT_FILES = ["START-HERE.md", "README.md", "LICENSE", "CONTRIBUTING.md", "product.manifest.yaml", "marketplace.listing.yaml"]
DIRECTORIES = ["assets", "docs", "examples", "packs", "scripts", "workbench"]
REQUIRED = ["workbench/index.html", "packs/client-delivery/README.md", "docs/labs/client-delivery-lab.md", "examples/support-agent-reference/README.md", "scripts/release-evidence.mjs"]
EXTENSIONS = {".md", ".json", ".yaml", ".yml", ".html", ".css", ".js", ".mjs", ".py", ".ps1", ".svg", ".csv"}


def build(source_revision, destination):
    if not re.fullmatch(r"[0-9a-f]{40}", source_revision):
        raise ValueError("A full source commit SHA is required.")
    destination = destination.resolve()
    if destination == ROOT or ROOT in destination.parents:
        raise ValueError("Write the release outside the source directory.")
    for name in ROOT_FILES + REQUIRED:
        if not (ROOT / name).is_file():
            raise ValueError("Missing required deliverable: " + name)
    candidates = [ROOT / name for name in ROOT_FILES]
    for name in DIRECTORIES:
        directory = ROOT / name
        if directory.is_symlink():
            raise ValueError("Symlink directory is not a release input: " + name)
        candidates.extend(directory.rglob("*"))
    members = {}
    for path in sorted(set(candidates)):
        relative = path.relative_to(ROOT)
        if path.is_symlink():
            raise ValueError("Symlinks are not release inputs: " + relative.as_posix())
        try:
            path.resolve().relative_to(ROOT)
        except ValueError:
            raise ValueError("Release input escapes the source directory: " + relative.as_posix()) from None
        if not path.is_file() or any(part.startswith(".") or part == "__pycache__" for part in relative.parts):
            continue
        if relative.as_posix() not in ROOT_FILES and path.suffix.lower() not in EXTENSIONS:
            continue
        members[relative.as_posix()] = path.read_bytes()
    manifest = {
        "schemaVersion": 1,
        "edition": "AI Architect Client Delivery Kit",
        "version": "0.2.0",
        "sourceRepository": "AI-Architect-Studio/agentic-architecture-field-guide",
        "sourceRevision": source_revision,
        "sourceRevisionProvenance": "Caller-declared; this offline packager does not contact or authenticate GitHub.",
        "license": "MIT; see LICENSE",
        "state": "source_package_not_deployment_or_client_acceptance",
        "start": "START-HERE.md",
        "files": [{"path": name, "bytes": len(data), "sha256": hashlib.sha256(data).hexdigest()} for name, data in sorted(members.items())],
    }
    members["release-manifest.json"] = (json.dumps(manifest, indent=2) + "\n").encode()
    destination.mkdir(parents=True, exist_ok=True)
    archive = destination / "AI-Architect-Client-Delivery-Kit-v0.2.0.zip"
    with zipfile.ZipFile(archive, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as zf:
        for name, data in sorted(members.items()):
            info = zipfile.ZipInfo("ai-architect-client-delivery/" + name, (2026, 10, 31, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            info.external_attr = 0o100644 << 16
            zf.writestr(info, data, compresslevel=9)
    with zipfile.ZipFile(archive) as zf:
        if zf.testzip() is not None:
            raise ValueError("Archive integrity check failed.")
        for entry in manifest["files"]:
            data = zf.read("ai-architect-client-delivery/" + entry["path"])
            if hashlib.sha256(data).hexdigest() != entry["sha256"]:
                raise ValueError("Archive content mismatch.")
    return {"archive": str(archive), "files": len(members), "bytes": archive.stat().st_size, "sha256": hashlib.sha256(archive.read_bytes()).hexdigest(), "sourceRevision": source_revision}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source-revision", required=True)
    parser.add_argument("--out", required=True, type=Path)
    args = parser.parse_args()
    try:
        print(json.dumps(build(args.source_revision, args.out), indent=2))
    except (OSError, ValueError, zipfile.BadZipFile) as error:
        parser.exit(1, "Delivery package: " + str(error) + "\n")
