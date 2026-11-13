"""Read-only independent codec review against the immutable original Git blobs."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import struct
import subprocess
import sys

import PIL
from PIL import Image, features

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--repo', type=Path, default=Path.cwd())
parser.add_argument('--output', type=Path, required=True)
args = parser.parse_args()
root = args.repo.resolve()
snapshot = '3fb49277809f28d11d4886c847558fca6ee91f21'
environment = {**os.environ, 'GIT_NO_LAZY_FETCH': '1', 'GIT_TERMINAL_PROMPT': '0'}
expected = {
    'melee-platforms': ('d8e09fc2417674319a5edf4eca539761201c2ffe', '71f060b3d7c7b596efaf15280d572930f851153791e73371dbf6847f65f227d2'),
    'tactics-tiles': ('ebfe774bdeff72e25da750999fd58ce1694b9fdc', '44beb133be7df97560f5104d3f6727fdb265cd86277714d82cd52483bd093204'),
}


def sha(data):
    return hashlib.sha256(data).hexdigest()


def git(args):
    return subprocess.check_output(['git', '-C', str(root), *args], env=environment)


def webp_chunks(data):
    assert data[:4] == b'RIFF' and data[8:12] == b'WEBP', 'Not a RIFF/WEBP container'
    assert struct.unpack('<I', data[4:8])[0] + 8 == len(data), 'RIFF byte length mismatch'
    offset = 12
    chunks = []
    while offset < len(data):
        assert offset + 8 <= len(data), 'Truncated chunk header'
        kind = data[offset:offset + 4].decode('ascii')
        size = struct.unpack('<I', data[offset + 4:offset + 8])[0]
        start = offset + 8
        end = start + size
        assert end + size % 2 <= len(data), 'Truncated chunk body'
        chunk = {'type': kind, 'bytes': size}
        if kind == 'VP8L':
            assert size >= 5 and data[start] == 0x2F, 'Bad VP8L lossless header'
            bits = struct.unpack('<I', data[start + 1:start + 5])[0]
            chunk.update({'lossless': True, 'width': 1 + (bits & 0x3FFF),
                          'height': 1 + ((bits >> 14) & 0x3FFF),
                          'alphaHint': bool((bits >> 28) & 1), 'version': bits >> 29})
            assert chunk['version'] == 0
        chunks.append(chunk)
        offset = end + size % 2
    assert offset == len(data)
    return chunks


def decoded(data):
    image = Image.open(io.BytesIO(data))
    image.load()
    rgba = image.convert('RGBA')
    raw = rgba.tobytes()
    profile = image.info.get('icc_profile', b'') or b''
    exif = image.info.get('exif', b'') or b''
    return {
        'format': image.format, 'size': list(image.size), 'mode': image.mode,
        'frames': getattr(image, 'n_frames', 1), 'rgbaBytes': len(raw), 'rgbaSha256': sha(raw),
        'alphaRange': list(rgba.getchannel('A').getextrema()),
        'alphaSha256': sha(rgba.getchannel('A').tobytes()),
        'iccBytes': len(profile), 'iccSha256': sha(profile) if profile else None,
        'exifBytes': len(exif), 'exifSha256': sha(exif) if exif else None,
        'orientation': image.getexif().get(274),
    }, raw, profile


plan = root / 'docs/assets/dlc-completion-2026-11-13/batches/all-plan.json'
plan_before = sha(plan.read_bytes())
entries = []
for name, (expected_oid, expected_pixels) in expected.items():
    source_path = f'DLC/AlienVsPredator/assets/backgrounds/lore-stages/alien-vs-predator/{name}.webp'
    oid = git(['rev-parse', f'{snapshot}:{source_path}']).decode().strip()
    assert oid == expected_oid
    original = git(['cat-file', 'blob', oid])
    assert hashlib.sha1(f'blob {len(original)}\0'.encode() + original).hexdigest() == oid
    assert original.startswith(b'\x89PNG\r\n\x1a\n')
    original_info, original_rgba, original_profile = decoded(original)
    assert original_info['rgbaSha256'] == expected_pixels
    path = root / source_path
    before = path.stat()
    current = path.read_bytes()
    current_hash = sha(current)
    chunks = webp_chunks(current)
    current_info, current_rgba, current_profile = decoded(current)
    pixel_mismatches = sum(original_rgba[i:i + 4] != current_rgba[i:i + 4]
                           for i in range(0, min(len(original_rgba), len(current_rgba)), 4))
    checks = {
        'originalGitBlobVerified': True, 'originalWasPngUnderWebpPath': original_info['format'] == 'PNG',
        'currentRiffWebpParses': True, 'currentDecoderFormatIsWebp': current_info['format'] == 'WEBP',
        'usesVp8lLossless': any(chunk['type'] == 'VP8L' for chunk in chunks)
                          and not any(chunk['type'] in ['VP8 ', 'ANIM', 'ANMF'] for chunk in chunks),
        'sameDimensions': original_info['size'] == current_info['size'] == [1024, 1024],
        'sameMode': original_info['mode'] == current_info['mode'] == 'RGBA',
        'sameSingleFrame': original_info['frames'] == current_info['frames'] == 1,
        'exactAllRgbaBytes': original_rgba == current_rgba,
        'exactRgbaSha256': original_info['rgbaSha256'] == current_info['rgbaSha256'],
        'exactAlphaBytes': original_info['alphaSha256'] == current_info['alphaSha256'],
        'sameAlphaRange': original_info['alphaRange'] == current_info['alphaRange'],
        'exactIccProfileIncludingAbsence': original_profile == current_profile,
        'sameOrientation': original_info['orientation'] == current_info['orientation'],
        'containerActuallyChanged': sha(original) != current_hash,
        'sourceNotChangedDuringReview': current_hash == sha(path.read_bytes())
                                      and before.st_mtime_ns == path.stat().st_mtime_ns,
    }
    entries.append({
        'sourcePath': source_path, 'publicPath': source_path.split('/assets', 1)[1],
        'original': {'sourceRevision': snapshot, 'gitBlobOid': oid, 'bytes': len(original),
                     'fileSha256': sha(original), **original_info},
        'current': {'bytes': len(current), 'fileSha256': current_hash, 'chunks': chunks, **current_info},
        'rgbaPixelMismatchCount': pixel_mismatches,
        'checks': checks, 'status': 'PASSED' if all(checks.values()) else 'FAILED',
    })
plan_after = sha(plan.read_bytes())
result = {
    'schemaVersion': 1, 'date': '2026-11-13', 'reviewer': '/root/p1_metadata_lot',
    'scope': 'Independent read-only codec/container check against frozen Git payloads; includes RGB values under fully transparent alpha, no image edit or identity assessment.',
    'originalSourceRevision': snapshot,
    'tools': {'python': sys.version.split()[0], 'pillow': PIL.__version__, 'webp': features.version('webp')},
    'decodingPipeline': 'Pillow Image.open(...).load().convert(RGBA).tobytes(); no resize, orientation, colour transform or premultiplication requested.',
    'entries': entries,
    'frozenPlanPreservation': {'path': str(plan.relative_to(root)), 'sha256Before': plan_before,
                               'sha256After': plan_after, 'unchanged': plan_before == plan_after,
                               'interpretation': 'The803 runner plan remains a historical frozen plan; these corrected files require a separate later source snapshot for future batch validation.'},
    'status': 'PASSED' if all(entry['status'] == 'PASSED' for entry in entries) and plan_before == plan_after else 'FAILED',
    'rasterFilesModifiedByReview': 0, 'sourceCodeModifiedByReview': 0,
    'networkAllowed': False, 'lazyFetchAllowed': False,
    'browserMimeDecodePerformed': False, 'browserMimeDecodeNote': 'Optional browser probe not performed by this independent Pillow review.',
    'visualIdentityInspectionPerformed': False, 'canonicalFidelityApproved': False,
    'source1to1Verified': False, 'actorBacklogClosed': False,
}
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'status': result['status'], 'entries': [{'path': row['sourcePath'], 'status': row['status'],
                  'exactRgbaBytes': row['checks']['exactAllRgbaBytes'], 'currentSha256': row['current']['fileSha256']}
                  for row in entries], 'frozenPlanUnchanged': plan_before == plan_after}))
raise SystemExit(0 if result['status'] == 'PASSED' else 1)
