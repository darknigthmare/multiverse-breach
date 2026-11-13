"""Index exact local historical blobs for LFS targets, without media copies."""
import argparse
import collections
import datetime
import gzip
import hashlib
import json
import os
from pathlib import Path
import subprocess
import time

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--repo', type=Path, default=Path.cwd())
parser.add_argument('--output', type=Path, required=True)
parser.add_argument('--preflight', type=Path)
parser.add_argument('--asset-snapshot', required=True)
args = parser.parse_args()
ROOT = args.repo.resolve()
OUT = args.output.resolve()
OUT.mkdir(parents=True, exist_ok=True)
PREFLIGHT = args.preflight.resolve() if args.preflight else ROOT / 'docs/assets/dlc-completion-2026-11-13/materialization-preflight-all.json.gz'
SNAPSHOT = args.asset_snapshot
assert len(SNAPSHOT) == 40 and all(char in '0123456789abcdef' for char in SNAPSHOT)
ENV = {**os.environ, 'GIT_NO_LAZY_FETCH': '1', 'GIT_TERMINAL_PROMPT': '0', 'GIT_LFS_SKIP_SMUDGE': '1'}
GIT = ['git', '-c', 'core.deltaBaseCacheLimit=16m', '-C', str(ROOT)]
STARTED = datetime.datetime.now(datetime.timezone.utc).isoformat()


def digest_file(path):
    h = hashlib.sha256()
    with path.open('rb') as stream:
        while chunk := stream.read(1024 * 1024):
            h.update(chunk)
    return h.hexdigest()


def write_json(name, value):
    path = OUT / name
    temporary = path.with_suffix(path.suffix + '.tmp')
    temporary.write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n')
    temporary.replace(path)


def git_output(args):
    return subprocess.check_output(GIT + args, env=ENV)


preflight_hash = digest_file(PREFLIGHT)
with gzip.open(PREFLIGHT, 'rt') as stream:
    preflight = json.load(stream)
targets = [row for row in preflight['entries'] if row['lfsPointer']]
assert len(targets) == 1951
by_sha = {}
by_size = collections.defaultdict(set)
for row in targets:
    identity = row['contentIdentity']
    assert identity['algorithm'] == 'sha256'
    sha = identity['value']
    assert len(sha) == 64 and all(char in '0123456789abcdef' for char in sha)
    size = row['expectedPayloadBytes']
    assert isinstance(size, int) and size >= 0
    by_sha.setdefault(sha, []).append(row)
    by_size[size].add(sha)
source_paths = {row['sourcePath']: row for row in targets}
del preflight

# The preflight was measured before the immutable asset snapshot was made.
# Require every selected pointer OID to be unchanged in that exact tree.
tree = subprocess.Popen(GIT + ['ls-tree', '-r', '-z', '--full-tree', SNAPSHOT], env=ENV, stdout=subprocess.PIPE)
remaining = b''
pointer_paths_verified = set()
while chunk := tree.stdout.read(65536):
    pieces = (remaining + chunk).split(b'\0')
    remaining = pieces.pop()
    for record in pieces:
        head, path_bytes = record.split(b'\t', 1)
        path = path_bytes.decode('utf-8', 'surrogateescape')
        expected = source_paths.get(path)
        if expected is None:
            continue
        mode, kind, oid = head.decode('ascii').split()
        assert kind == 'blob' and oid == expected['gitObjectId'], path
        pointer_paths_verified.add(path)
assert tree.wait() == 0 and not remaining
assert pointer_paths_verified == source_paths.keys(), 'Target pointers differ from the frozen snapshot'
print(json.dumps({'event': 'POINTER_TREE_VERIFIED', 'targets': len(targets), 'uniqueSha256': len(by_sha),
                  'distinctTargetSizes': len(by_size), 'sourceAssetSnapshot': SNAPSHOT}), flush=True)

metadata = subprocess.Popen(GIT + ['cat-file', '--batch-all-objects', '--unordered',
                                  '--batch-check=%(objectname) %(objecttype) %(objectsize)'],
                            env=ENV, stdout=subprocess.PIPE, text=True)
candidates = []
objects = 0
blobs = 0
blob_bytes = 0
for line in metadata.stdout:
    oid, kind, size_text = line.rstrip('\n').split()
    objects += 1
    if kind != 'blob':
        continue
    size = int(size_text)
    blobs += 1
    blob_bytes += size
    if size in by_size:
        candidates.append((oid, size))
assert metadata.wait() == 0
uncached_sizes = {row['expectedPayloadBytes'] for row in targets if row['lfsCacheState'] != 'verified-sha256'}
candidates.sort(key=lambda item: (item[1] not in uncached_sizes, item[1], item[0]))
write_json('candidate-metadata.json', {'sourceAssetSnapshot': SNAPSHOT, 'objectsEnumerated': objects,
           'blobsEnumerated': blobs, 'allLocalBlobBytes': blob_bytes, 'candidateCount': len(candidates),
           'candidateBytes': sum(size for _, size in candidates),
           'candidates': [{'gitBlobOid': oid, 'bytes': size} for oid, size in candidates]})
print(json.dumps({'event': 'CANDIDATES_ENUMERATED', 'objects': objects, 'blobs': blobs,
                  'candidateCount': len(candidates), 'candidateBytes': sum(size for _, size in candidates)}), flush=True)

verified = {}
hashes_checked = 0
bytes_hashed = 0
unmatched_candidates = 0
size_groups_already_satisfied = 0
first_match = None


def save_index(complete=False):
    missing = sorted(set(by_sha) - verified.keys())
    uncached = [sha for sha, rows in by_sha.items()
                if any(row['lfsCacheState'] != 'verified-sha256' for row in rows)]
    result = {
        'schemaVersion': 1, 'sourceAssetSnapshot': SNAPSHOT,
        'preflight': {'path': str(PREFLIGHT.relative_to(ROOT)), 'sha256': preflight_hash},
        'readOnly': True, 'networkAllowed': False, 'lazyFetchAllowed': False,
        'payloadFilesWritten': 0, 'scanComplete': complete,
        'verification': 'Exact payload SHA-256, byte length and canonical Git blob SHA-1 recomputed by streaming local cat-file output. No path/name-only matches.',
        'counts': {'pointerSources': len(targets), 'uniqueLfsSha256Targets': len(by_sha),
                   'uncachedLfsTargets': len(uncached), 'verifiedHistoricalMatches': len(verified),
                   'uncachedTargetsRecoveredFromGit': sum(sha in verified for sha in uncached),
                   'unmatchedTargets': len(missing), 'objectsEnumerated': objects,
                   'blobsEnumerated': blobs, 'sameSizeCandidates': len(candidates),
                   'candidateBlobsHashed': hashes_checked, 'payloadBytesHashed': bytes_hashed,
                   'nonmatchingSameSizeBlobs': unmatched_candidates,
                   'skippedCandidatesAfterSizeGroupSatisfied': size_groups_already_satisfied},
        'bytes': {'allPointerPayloadBytes': sum(rows[0]['expectedPayloadBytes'] for rows in by_sha.values()),
                  'verifiedHistoricalPayloadBytes': sum(row['bytes'] for row in verified.values()),
                  'uncachedPayloadBytesRecoveredFromGit': sum(verified[sha]['bytes'] for sha in uncached if sha in verified)},
        'entries': [verified[sha] for sha in sorted(verified)],
        'unmatched': [{'sha256': sha, 'bytes': by_sha[sha][0]['expectedPayloadBytes'],
                       'sourcePaths': [row['sourcePath'] for row in by_sha[sha]],
                       'lfsCacheStates': sorted({row['lfsCacheState'] for row in by_sha[sha]})} for sha in missing],
        'source1to1Verified': False, 'actorBacklogClosed': False,
    }
    write_json('verified-historical-lfs-map.json', result)


payload = subprocess.Popen(GIT + ['cat-file', '--batch'], env=ENV,
                           stdin=subprocess.PIPE, stdout=subprocess.PIPE)
try:
    for oid, size in candidates:
        if by_size[size] <= verified.keys():
            size_groups_already_satisfied += 1
            continue
        payload.stdin.write((oid + '\n').encode('ascii'))
        payload.stdin.flush()
        header = payload.stdout.readline().decode('ascii').rstrip('\n').split()
        assert header == [oid, 'blob', str(size)], header
        sha256 = hashlib.sha256()
        git_sha1 = hashlib.sha1()
        git_sha1.update(f'blob {size}\0'.encode('ascii'))
        remaining_bytes = size
        while remaining_bytes:
            chunk = payload.stdout.read(min(1024 * 1024, remaining_bytes))
            assert chunk, f'Truncated blob {oid}'
            remaining_bytes -= len(chunk)
            sha256.update(chunk)
            git_sha1.update(chunk)
        assert payload.stdout.read(1) == b'\n'
        assert git_sha1.hexdigest() == oid, f'Local Git object content mismatch {oid}'
        hashes_checked += 1
        bytes_hashed += size
        sha = sha256.hexdigest()
        if sha not in by_size[size]:
            unmatched_candidates += 1
            continue
        rows = by_sha[sha]
        verified[sha] = {
            'sha256': sha, 'gitBlobOid': oid, 'bytes': size, 'verified': True,
            'gitBlobOidRecomputed': True, 'sourcePaths': sorted(row['sourcePath'] for row in rows),
            'publicPaths': sorted(row['publicPath'] for row in rows),
            'ownerPackIds': sorted({row['ownerPackId'] for row in rows if row['ownerPackId'] is not None}),
            'lfsCacheStates': sorted({row['lfsCacheState'] for row in rows}),
            'pathAmbiguity': len(rows) > 1,
        }
        if first_match is None:
            first_match = verified[sha]
            save_index()
            print(json.dumps({'event': 'FIRST_EXACT_HISTORICAL_MATCH', **first_match,
                              'map': str(OUT / 'verified-historical-lfs-map.json')}), flush=True)
        if len(verified) % 100 == 0:
            save_index()
            print(json.dumps({'event': 'PROGRESS', 'verified': len(verified),
                              'bytesHashed': bytes_hashed, 'candidateBlobsHashed': hashes_checked}), flush=True)
finally:
    payload.stdin.close()
    assert payload.wait() == 0
save_index(True)
assert digest_file(PREFLIGHT) == preflight_hash, 'Preflight evidence changed during scan'
finished = datetime.datetime.now(datetime.timezone.utc).isoformat()
write_json('scan-receipt.json', {'startedAt': STARTED, 'finishedAt': finished, 'exitCode': 0,
           'sourceAssetSnapshot': SNAPSHOT, 'preflightSha256Before': preflight_hash,
           'preflightSha256After': digest_file(PREFLIGHT), 'networkAllowed': False,
           'lazyFetchAllowed': False, 'payloadFilesWritten': 0, 'gitDeltaBaseCacheLimit': '16m',
           'pythonPid': os.getpid(), 'cpuAffinity': sorted(os.sched_getaffinity(0)),
           'candidateBlobsHashed': hashes_checked, 'bytesHashed': bytes_hashed,
           'verifiedHistoricalMatches': len(verified), 'unmatchedTargets': len(by_sha) - len(verified)})
print(json.dumps({'event': 'COMPLETE', 'verified': len(verified), 'unmatched': len(by_sha) - len(verified),
                  'bytesHashed': bytes_hashed, 'map': str(OUT / 'verified-historical-lfs-map.json')}), flush=True)
