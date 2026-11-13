#!/usr/bin/env python3
"""Read manifests, local files and existing Git objects; write diagnostic reports only.

No checkout, lazy fetch, LFS download, publisher, deletion or source-tree mutation.
Git object sizes are logical (uncompressed) byte counts; valid LFS pointers use
their declared payload size. Only small Git blobs are read to identify pointers.
"""
from pathlib import Path
import argparse
import collections
import csv
import datetime
import hashlib
import json
import os
import re
import stat
import subprocess


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=Path, default=Path(__file__).resolve().parents[3])
    parser.add_argument('--out', type=Path, default=Path(__file__).resolve().parent)
    args = parser.parse_args()
    root = args.root.resolve()
    out = args.out.resolve()
    out.mkdir(parents=True, exist_ok=True)
    env = dict(os.environ, GIT_NO_LAZY_FETCH='1', GIT_OPTIONAL_LOCKS='0')

    def git(*arguments, data=None):
        return subprocess.run(['git', *arguments], cwd=root, env=env, input=data,
                              stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=True).stdout

    def parse_pointer(data):
        if not data.startswith(b'version https://git-lfs.github.com/spec/v1\n'):
            return None
        oid = re.search(rb'^oid sha256:([0-9a-f]{64})$', data, re.M)
        size = re.search(rb'^size ([0-9]+)$', data, re.M)
        return {'oid': oid[1].decode(), 'bytes': int(size[1])} if oid and size else None

    def info(path):
        try:
            st = path.lstat()
        except FileNotFoundError:
            return {'kind': 'absent'}
        if not stat.S_ISREG(st.st_mode):
            return {'kind': 'symlink' if stat.S_ISLNK(st.st_mode) else 'non-regular'}
        with path.open('rb') as stream:
            head = stream.read(1024).replace(b'\r\n', b'\n').lstrip(b'\xef\xbb\xbf')
        return {'kind': 'lfs-pointer' if parse_pointer(head) else 'regular',
                'bytes': st.st_size, 'allocatedBytes': st.st_blocks * 512,
                'device': st.st_dev, 'inode': st.st_ino}

    manifests = sorted(root.glob('DLC/*/assets.json')) + [root / 'DLC/shared-assets.json']
    entries = []
    for path in manifests:
        document = json.loads(path.read_text())
        for asset in document['assets']:
            entry = dict(asset)
            entry['manifest'] = str(path.relative_to(root))
            entries.append(entry)
    assert len({entry['sourcePath'] for entry in entries}) == len(entries)
    index = {}
    for row in git('ls-files', '--stage', '-z').split(b'\0'):
        if row:
            meta, path = row.split(b'\t', 1)
            mode, oid, stage = meta.split()
            if stage == b'0':
                index[path.decode()] = (oid.decode(), mode.decode())
    head = {}
    for row in git('ls-tree', '-r', '-z', 'HEAD').split(b'\0'):
        if row:
            meta, path = row.split(b'\t', 1)
            mode, kind, oid = meta.split()
            head[path.decode()] = oid.decode()
    oids = sorted({index[entry['sourcePath']][0] for entry in entries if entry['sourcePath'] in index})
    result = git('cat-file', '--batch-check=%(objectname) %(objecttype) %(objectsize) %(objectsize:disk)',
                 data=('\n'.join(oids) + '\n').encode())
    objects = {}
    for line in result.decode().splitlines():
        parts = line.split()
        if len(parts) == 4 and parts[1] == 'blob':
            objects[parts[0]] = {'kind': 'blob', 'bytes': int(parts[2]), 'diskBytes': int(parts[3])}
        else:
            objects[parts[0]] = {'kind': 'unavailable'}
    small = [oid for oid in oids if objects[oid].get('bytes', 1025) <= 1024]
    data = git('cat-file', '--batch', data=('\n'.join(small) + '\n').encode()) if small else b''
    offset = 0
    for oid in small:
        end = data.index(b'\n', offset)
        header = data[offset:end].split()
        length = int(header[2])
        body = data[end + 1:end + 1 + length]
        pointer = parse_pointer(body.replace(b'\r\n', b'\n').lstrip(b'\xef\xbb\xbf'))
        if pointer:
            objects[oid]['lfsPointer'] = pointer
        offset = end + 1 + length + 1
    gitdir = Path(git('rev-parse', '--git-dir').decode().strip())
    if not gitdir.is_absolute():
        gitdir = root / gitdir

    rows = []
    local_inodes = {}
    for asset in entries:
        path = asset['sourcePath']
        source = info(root / path)
        public = info(root / 'public' / asset['publicPath'].lstrip('/'))
        oid, mode = index.get(path, (None, None))
        obj = objects.get(oid, {'kind': 'untracked'})
        pointer = obj.get('lfsPointer')
        lfs_cached = None
        if pointer:
            target = gitdir / 'lfs/objects' / pointer['oid'][:2] / pointer['oid'][2:4] / pointer['oid']
            lfs_cached = target.is_file() and target.stat().st_size == pointer['bytes']
        payload = pointer['bytes'] if pointer else obj.get('bytes')
        row = {'sourcePath': path, 'publicPath': asset['publicPath'], 'manifest': asset['manifest'],
               'owner': path.split('/')[1] if path.startswith('DLC/') else 'shared-public',
               'extension': Path(path).suffix.lower(), 'localKind': source['kind'],
               'localBytes': source.get('bytes'), 'localAllocatedBytes': source.get('allocatedBytes'),
               'publicKind': public['kind'], 'publicBytes': public.get('bytes'),
               'sourceAndPublicSameInode': source.get('inode') is not None and
                   (source.get('device'), source.get('inode')) == (public.get('device'), public.get('inode')),
               'gitOid': oid, 'gitMode': mode, 'gitObjectKind': obj['kind'],
               'gitLogicalBytes': obj.get('bytes'), 'gitDiskBytes': obj.get('diskBytes'),
               'headOidMatchesIndex': head.get(path) == oid if oid else False,
               'lfsPointer': bool(pointer), 'lfsPayloadOid': pointer['oid'] if pointer else None,
               'lfsPayloadBytes': pointer['bytes'] if pointer else None,
               'lfsCachePresentWithExpectedSize': lfs_cached,
               'expectedPayloadBytes': payload,
               'recoverableWithoutNetwork': obj['kind'] == 'blob' and (not pointer or lfs_cached)}
        rows.append(row)
        if source.get('inode') is not None:
            local_inodes[(source['device'], source['inode'])] = source['allocatedBytes']

    missing = [row for row in rows if row['sourcePath'].startswith('DLC/') and row['localKind'] == 'absent']
    def summarize(group):
        known = [row for row in group if row['expectedPayloadBytes'] is not None]
        block = lambda value: ((value + 4095) // 4096) * 4096
        return {'files': len(group), 'localKinds': dict(collections.Counter(row['localKind'] for row in group)),
                'localLogicalBytes': sum(row['localBytes'] or 0 for row in group),
                'expectedPayloadBytes': sum(row['expectedPayloadBytes'] for row in known),
                'expected4KiBAllocatedBytes': sum(block(row['expectedPayloadBytes']) for row in known),
                'unknownPayloadSizes': len(group) - len(known),
                'gitBlobReferences': sum(row['gitObjectKind'] == 'blob' for row in group),
                'gitUniqueObjects': len({row['gitOid'] for row in group if row['gitOid']}),
                'gitLogicalBlobBytesIncludingPointerText': sum(row['gitLogicalBytes'] or 0 for row in group),
                'lfsPointers': sum(row['lfsPointer'] for row in group),
                'lfsPayloadBytes': sum(row['lfsPayloadBytes'] or 0 for row in group),
                'lfsCachedWithExpectedSize': sum(row['lfsCachePresentWithExpectedSize'] is True for row in group),
                'lfsUncached': sum(row['lfsCachePresentWithExpectedSize'] is False for row in group),
                'recoverableWithoutNetwork': sum(row['recoverableWithoutNetwork'] for row in group),
                'headMatchesIndex': sum(row['headOidMatchesIndex'] for row in group),
                'publicKinds': dict(collections.Counter(row['publicKind'] for row in group)),
                'sameInodePublicFiles': sum(row['sourceAndPublicSameInode'] for row in group),
                'absentPublicPayloadBytes': sum(row['expectedPayloadBytes'] or 0 for row in group if row['publicKind'] == 'absent')}

    by_owner = {owner: summarize([row for row in rows if row['owner'] == owner])
                for owner in sorted({row['owner'] for row in rows})}
    missing_by_ext = {ext: summarize([row for row in missing if row['extension'] == ext])
                      for ext in sorted({row['extension'] for row in missing})}
    volumes = {}
    for volume in ['/workspace', '/tmp']:
        fs = os.statvfs(volume)
        volumes[volume] = {'availableBytes': fs.f_bavail * fs.f_frsize,
                           'totalBytes': fs.f_blocks * fs.f_frsize,
                           'availableInodes': fs.f_favail, 'blockSize': fs.f_frsize,
                           'device': Path(volume).stat().st_dev}
    count_objects = dict(line.split(': ', 1) for line in git('count-objects', '-v').decode().splitlines())
    report = {'schemaVersion': 1, 'recordedAt': datetime.datetime.now(datetime.timezone.utc).isoformat(),
              'head': git('rev-parse', 'HEAD').decode().strip(),
              'method': {'readOnlySourceTree': True, 'networkAndLazyFetchDisabled': True,
                         'allManifestEntriesInspected': True, 'allReferencedGitOidsCheckedLocally': True,
                         'gitBlobsAtMost1024BytesActuallyReadForLfsDetection': len(small),
                         'largeNativeBlobContentsNotDecompressed': True,
                         'lfsCachePayloadSha256Recomputed': False,
                         'publicContentHashesCompared': False},
              'volumes': volumes, 'gitObjectStorageKiB': count_objects,
              'allAssets': summarize(rows), 'dlcAssets': summarize([row for row in rows if row['sourcePath'].startswith('DLC/')]),
              'missingDlcSources': summarize(missing), 'missingByExtension': missing_by_ext,
              'byOwner': by_owner, 'materializedSourceUniqueAllocatedBytes': sum(local_inodes.values()),
              'largestMissing': sorted(missing, key=lambda row: row['expectedPayloadBytes'] or 0, reverse=True)[:20],
              'limitations': ['Git object availability is not visual-fidelity approval.',
                              'LFS cache presence verifies path/type/declared byte size; payload SHA-256 must be checked before use.',
                              'Native Git blobs larger than the valid 1-KiB LFS-pointer size are counted by Git logical bytes, not read into the report.',
                              'Storage estimates exclude dependencies, build JavaScript, temporary copies, filesystem directories and test output.']}
    (out / 'materialization-measurement.json').write_text(json.dumps(report, indent=2) + '\n')
    fields = list(rows[0])
    for filename, group in [('all-asset-availability.csv', rows), ('missing-dlc-sources.csv', missing)]:
        with (out / filename).open('w', newline='') as stream:
            writer = csv.DictWriter(stream, fieldnames=fields)
            writer.writeheader(); writer.writerows(group)
    print(json.dumps({key: report[key] for key in ['head', 'volumes', 'allAssets', 'dlcAssets', 'missingDlcSources']}, indent=2))


if __name__ == '__main__':
    main()
