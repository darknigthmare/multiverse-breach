#!/usr/bin/env python3
"""Verify that a later commit and working files preserve the audited actor inputs."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--repo', type=Path, required=True)
    parser.add_argument('--checkpoint-dir', type=Path, required=True)
    parser.add_argument('--revision', required=True)
    parser.add_argument('--out', type=Path, required=True)
    args = parser.parse_args()
    root, directory = args.repo.resolve(), args.checkpoint_dir.resolve()
    assert re.fullmatch('[0-9a-f]{40}', args.revision)
    assert not args.out.exists(), 'Use a new receipt path.'
    environment = {**os.environ, 'GIT_NO_LAZY_FETCH': '1', 'GIT_OPTIONAL_LOCKS': '0'}

    def git(*command):
        return subprocess.check_output(['git', '-C', str(root), *command], env=environment)

    validation = json.loads((directory / 'validation.json').read_text())
    source = json.loads((directory / 'source-inputs.json').read_text())
    checkpoint = validation['sourceCommit']
    assert source['sourceCommit'] == checkpoint
    assert git('rev-parse', '--verify', args.revision + '^{commit}').decode().strip() == args.revision
    subprocess.run(['git', '-C', str(root), 'merge-base', '--is-ancestor', checkpoint, args.revision], env=environment, check=True)
    entries = {}
    for record in git('ls-tree', '-rz', '--full-tree', args.revision).split(b'\0'):
        if record:
            header, name = record.split(b'\t', 1)
            mode, kind, oid = header.decode().split()
            entries[name.decode()] = {'mode': mode, 'type': kind, 'gitBlobOid': oid}
    commit_changes, working_changes = [], []
    for entry in source['files']:
        current = entries.get(entry['path'])
        if not current or current['type'] != 'blob' or current['gitBlobOid'] != entry['gitBlobOid']:
            commit_changes.append(entry['path'])
        file = root / entry['path']
        if not file.is_file() or file.is_symlink() or digest(file) != entry['sha256']:
            working_changes.append(entry['path'])
    helper_changes = [filename for filename, sha256 in validation['auditHelpersSha256'].items()
                      if not Path(filename).is_file() or digest(Path(filename)) != sha256]
    changed_paths = [name.decode() for name in git('diff', '--name-only', '-z', checkpoint, args.revision).split(b'\0') if name]
    # The exporter also consumes Git-tree presence for public/DLC rasters;
    # keep their paths and bytes stable as well as the imported source graph.
    runtime_changes = [name for name in changed_paths if name.startswith(('src/', 'DLC/', 'public/'))]
    report = {'schemaVersion': 1, 'scope': 'Byte/OID continuity of the audited actor-source inventory and actual audit helpers. A later CG metadata/testing change does not reclassify art or certify a full distribution.',
              'runtimeCheckpoint': checkpoint, 'laterCommit': args.revision,
              'gitHeadAtVerification': git('rev-parse', 'HEAD').decode().strip(),
              'sourceManifestSha256': digest(directory / 'source-inputs.json'), 'validationSha256': digest(directory / 'validation.json'),
              'sourceInventoryFilesChecked': len(source['files']), 'laterCommitSourceChanges': commit_changes,
              'workingSourceChanges': working_changes, 'auditHelperChanges': helper_changes,
              'allLaterCommitChangedPaths': changed_paths, 'laterSrcDlcOrPublicChanges': runtime_changes,
              'checksPassed': not any((commit_changes, working_changes, helper_changes, runtime_changes)),
              'scriptSha256': digest(Path(__file__)), 'mediaDecodedOrCopied': 0, 'artApprovals': 0, 'actorClosuresApproved': 0}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(report, indent=2, ensure_ascii=False) + '\n')
    print(json.dumps({key: report[key] for key in ('runtimeCheckpoint', 'laterCommit', 'sourceInventoryFilesChecked', 'laterCommitSourceChanges', 'workingSourceChanges', 'auditHelperChanges', 'checksPassed')}))
    assert report['checksPassed'], 'An audited input changed; continuity is not established.'


if __name__ == '__main__':
    main()
