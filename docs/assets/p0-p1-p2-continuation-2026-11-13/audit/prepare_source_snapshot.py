#!/usr/bin/env python3
"""Prepare exact Git source and a complete asset tree without copying media."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess


def git(root, args):
    return subprocess.run(['git', '-C', str(root), *args], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE,
                          env={**os.environ, 'GIT_OPTIONAL_LOCKS': '0', 'GIT_NO_LAZY_FETCH': '1', 'GIT_LFS_SKIP_SMUDGE': '1'}).stdout


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, default=Path.cwd())
    parser.add_argument('--revision', required=True)
    parser.add_argument('--out', type=Path, required=True)
    parser.add_argument('--manifest', type=Path, required=True)
    args = parser.parse_args()
    root, target = args.repo.resolve(), args.out.resolve()
    assert re.fullmatch('[a-f0-9]{40}', args.revision)
    assert git(root, ['rev-parse', '--verify', args.revision + '^{commit}']).decode().strip() == args.revision
    assert not target.exists(), 'Refuse an existing output; no user files are removed.'
    entries = []
    for row in git(root, ['ls-tree', '-rz', '--full-tree', args.revision]).split(b'\0'):
        if not row:
            continue
        header, name = row.split(b'\t', 1)
        mode, kind, oid = header.decode().split()
        entries.append({'path': name.decode(), 'mode': mode, 'type': kind, 'sha': oid, 'size': None})
    scripts = {'scripts/exportActorFidelityBacklog.mjs', 'scripts/sourceSceneTestLoader.mjs', 'scripts/exportAssetTree.mjs', 'scripts/dlcAssetPaths.mjs'}
    def source(entry):
        name = entry['path']
        return (entry['type'] == 'blob' and (name in scripts
                or re.fullmatch(r'src/.*\.(?:[cm]?js|jsx|tsx?|json|css)', name)
                or re.fullmatch(r'DLC/[^/]+/(?:data|runtime)/.*\.(?:[cm]?js|jsx|tsx?|json)', name)
                or re.fullmatch(r'DLC/(?:[^/]+/(?:manifest|assets)\.json|index\.js|distribution\.json|content-identities\.json|shared-assets\.json|shared-asset-dependencies\.json)', name)))
    selected = [entry for entry in entries if source(entry)]
    target.mkdir(parents=True)
    process = subprocess.Popen(['git', '-C', str(root), 'cat-file', '--batch'], stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                               stderr=subprocess.DEVNULL, env={**os.environ, 'GIT_NO_LAZY_FETCH': '1', 'GIT_OPTIONAL_LOCKS': '0'})
    files = []
    try:
        for entry in selected:
            assert entry['mode'] in ('100644', '100755'), entry['path']
            process.stdin.write((entry['sha'] + '\n').encode()); process.stdin.flush()
            oid, kind, length = process.stdout.readline().decode().split(); length = int(length)
            assert oid == entry['sha'] and kind == 'blob' and length <= 25 * 1024 * 1024
            content = process.stdout.read(length)
            assert len(content) == length and process.stdout.read(1) == b'\n'
            assert hashlib.sha1(f'blob {length}\0'.encode() + content).hexdigest() == oid
            destination = target / entry['path']; destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(content)
            files.append({'path': entry['path'], 'gitBlobOid': oid, 'bytes': length, 'sha256': hashlib.sha256(content).hexdigest()})
    finally:
        process.stdin.close(); process.stdout.close(); process.wait(timeout=30)
    (target / 'complete-tree.json').write_text(json.dumps({'sourceCommit': args.revision, 'truncated': False, 'tree': entries}, separators=(',', ':')) + '\n')
    manifest = {'schemaVersion': 1, 'sourceCommit': args.revision, 'scope': 'Exact Git source snapshot, complete Git asset tree; no image payload copied or decoded.',
                'scriptSha256': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), 'files': files, 'fileCount': len(files),
                'sourceBytes': sum(item['bytes'] for item in files), 'gitTreeEntries': len(entries), 'mediaCopied': 0}
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({key: manifest[key] for key in ('sourceCommit', 'fileCount', 'sourceBytes', 'gitTreeEntries', 'mediaCopied')}))


if __name__ == '__main__':
    main()
