#!/usr/bin/env python3
"""Freeze an explicit source overlay without claiming its bytes belong to Git HEAD."""
import argparse
import hashlib
import json
from pathlib import Path
import shutil


def digest(content):
    return hashlib.sha256(content).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--base', type=Path, required=True)
    parser.add_argument('--base-manifest', type=Path, required=True)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--paths', type=Path, required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, required=True)
    args = parser.parse_args()
    assert not args.out.exists(), 'Output must be new; no existing files are removed.'
    paths = json.loads(args.paths.read_text())
    assert isinstance(paths, list) and len(paths) == len(set(paths))
    baseline = json.loads(args.base_manifest.read_text())
    for entry in baseline['files']:
        assert digest((args.base / entry['path']).read_bytes()) == entry['sha256'], entry['path']
    entries, payloads = [], {}
    for name in paths:
        path = Path(name)
        assert not path.is_absolute() and '..' not in path.parts
        assert path.suffix in ('.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx', '.json'), name
        source = args.repo / path
        assert source.is_file() and not source.is_symlink(), name
        content = source.read_bytes()
        assert len(content) <= 25 * 1024 * 1024
        payloads[name] = content
        entries.append({'path': name, 'bytes': len(content), 'sha256': digest(content), 'origin': 'WORKING_FILE_FROZEN_NOT_GIT_COMMIT'})
    # Copy only the attested source inventory. A peer may add a test runner or
    # node_modules symlink to the baseline directory for SSR; do not follow it.
    args.out.mkdir(parents=True)
    for entry in baseline['files']:
        destination = args.out / entry['path']
        destination.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(args.base / entry['path'], destination)
    shutil.copyfile(args.base / 'complete-tree.json', args.out / 'complete-tree.json')
    for name, content in payloads.items():
        destination = args.out / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        destination.write_bytes(content)
        assert (args.repo / name).read_bytes() == content, 'Working file changed during snapshot: ' + name
    document = {'schemaVersion': 1, 'scope': 'Explicit frozen source overlay; its changed bytes are not represented as belonging to the base Git commit.',
                'baseSourceCommit': baseline['sourceCommit'], 'baseManifestSha256': digest(args.base_manifest.read_bytes()),
                'overlayFiles': entries, 'overlaySha256': digest(json.dumps(entries, sort_keys=True, separators=(',', ':')).encode()),
                'mediaCopied': 0, 'artApprovals': 0, 'source1to1Verified': False}
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(document, indent=2) + '\n')
    print(json.dumps({'baseCommit': baseline['sourceCommit'], 'overlayFiles': len(entries), 'overlaySha256': document['overlaySha256']}))


if __name__ == '__main__':
    main()
