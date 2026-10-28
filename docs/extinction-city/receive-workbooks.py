"""Restore exactly reviewed artifact_tool exports; never calculate or edit cells."""
import base64, gzip, hashlib, io, json, subprocess, tempfile, zipfile
from pathlib import Path

def digest(raw):
    return hashlib.sha256(raw).hexdigest()

out = Path('/tmp/ec-xlsx'); out.mkdir(exist_ok=True)
parts = sorted(Path('docs/extinction-city').glob('xlsx-delivery.part*'))
assert len(parts) == 11
encoded = ''.join(p.read_text().strip() for p in parts)
assert digest(encoded.encode()) == 'b554a49991dc5fe747fd6954589dcef095b4bf0e447798c842d20366c68fb95f'
raw = gzip.decompress(base64.b64decode(encoded, validate=True)); assert len(raw) < 500000
manifest = json.loads(raw)
allowed = {'docs/excel/Multiverse_Breach_Extinction_Cite_Production.xlsx', 'docs/excel/Multiverse_Breach_UI_Immersion.xlsx', '.github/workflows/extinction-content.yml', 'docs/extinction-city/workbook-followup-2026-10-28.json', 'docs/extinction-city/protocols-2026-10-28.md'}
assert len(manifest['files']) == 5 and {f['path'] for f in manifest['files']} == allowed
verified = []
for f in manifest['files']:
    p = Path(f['path']); assert not p.is_symlink()
    old = p.read_bytes() if p.exists() else b''
    assert (digest(old) if p.exists() else None) == f['before'], ('base mismatch', str(p))
    if p.name == 'Multiverse_Breach_UI_Immersion.xlsx':
        (out/'ui-before.xlsx').write_bytes(old)
    if f['kind'] == 'raw':
        fragments = []
        for op in f['ops']:
            if isinstance(op, list):
                assert len(op) == 2 and all(type(i) is int for i in op) and 0 <= op[0] <= op[1] <= len(old)
                fragments.append(old[op[0]:op[1]])
            else:
                fragments.append(base64.b64decode(op, validate=True))
        result = b''.join(fragments)
    else:
        assert f['kind'] == 'zip'
        buffer = io.BytesIO()
        with zipfile.ZipFile(io.BytesIO(old)) as source, zipfile.ZipFile(buffer, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as target, tempfile.TemporaryDirectory() as temp:
            temp = Path(temp); names = set()
            for entry in f['entries']:
                name = entry['name']
                assert name not in names and not name.startswith('/') and '..' not in name.split('/')
                names.add(name)
                before = source.read(name) if name in source.namelist() else b''
                for a, b in entry.get('replacements', []):
                    before = before.replace(base64.b64decode(a, validate=True), base64.b64decode(b, validate=True))
                if entry.get('copy'):
                    data = before
                else:
                    assert 0 <= entry['size'] <= 20000000
                    (temp/'old').write_bytes(before)
                    (temp/'patch').write_bytes(base64.b64decode(entry['zstd'], validate=True))
                    subprocess.run(['zstd', '-q', '-d', '-f', '--patch-from='+str(temp/'old'), str(temp/'patch'), '-o', str(temp/'result')], check=True, timeout=30)
                    data = (temp/'result').read_bytes()
                assert len(data) == entry['size'] and digest(data) == entry['sha256'], name
                info = zipfile.ZipInfo(name, (2026,10,28,0,0,0)); info.compress_type = zipfile.ZIP_DEFLATED; info.external_attr = 0o600 << 16
                target.writestr(info, data, compresslevel=9)
        result = buffer.getvalue()
    assert digest(result) == f['after'], ('target mismatch', str(p))
    p.parent.mkdir(parents=True, exist_ok=True); p.write_bytes(result)
    verified.append({'path': str(p), 'sha256': digest(result)})
(out/'manifest.json').write_text(json.dumps(verified, indent=2))
print(json.dumps(verified, indent=2))
