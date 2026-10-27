"""Transport already reviewed bytes; no spreadsheet authoring or ref movement."""
import base64,gzip,hashlib,io,json,zipfile
from pathlib import Path
out=Path('/tmp/ec-workbooks');out.mkdir(exist_ok=True)
def h(raw):return hashlib.sha256(raw).hexdigest()
def decode(text,expected):
    assert h(text.encode())==expected
    raw=gzip.decompress(base64.b64decode(text,validate=True));assert len(raw)<1000000
    return json.loads(raw)
parts=sorted(Path('docs/extinction-city').glob('workbook-delivery.part*'));assert len(parts)==6
m=decode(''.join(p.read_text().strip() for p in parts),'b737ac595e2a0d57c4f721a6b1bb3f7aa48d6c9c7d544e084c8b0a42394eec84')
allowed={'docs/excel/Multiverse_Breach_Extinction_Cite_Production.xlsx','docs/excel/Multiverse_Breach_UI_Immersion.xlsx','scripts/extinction-city/catalog.mjs','scripts/extinction-city/build_workbook.py','docs/extinction-city/workbook-followup-2026-10-27.json'}
assert len(m['files'])==5 and {f['path'] for f in m['files']}==allowed
def reconstruct(old,ops):
    result=[]
    for op in ops:
        if isinstance(op,list):
            assert len(op)==2 and all(type(i)==int for i in op) and 0<=op[0]<=op[1]<=len(old)
            result.append(old[op[0]:op[1]])
        else:result.append(base64.b64decode(op,validate=True))
    return b''.join(result)
manifest={}
for f in m['files']:
    p=Path(f['path']);assert not p.is_symlink()
    old=p.read_bytes() if p.exists() else b''
    assert (h(old) if p.exists() else None)==f['before'],('base mismatch',str(p))
    if f['kind']=='raw':raw=reconstruct(old,f['ops'])
    else:
        assert f['kind']=='zip'
        buff=io.BytesIO()
        with zipfile.ZipFile(io.BytesIO(old)) as source,zipfile.ZipFile(buff,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as target:
            names=set()
            for entry in f['entries']:
                name=entry['name'];assert name not in names and not name.startswith('/') and '..' not in name.split('/')
                names.add(name)
                before=source.read(name) if name in source.namelist() else b''
                for a,b in entry.get('replacements',[]):before=before.replace(base64.b64decode(a,validate=True),base64.b64decode(b,validate=True))
                data=reconstruct(before,entry['ops']);assert h(data)==entry['sha256'],name
                info=zipfile.ZipInfo(name,(2026,10,27,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o600<<16
                target.writestr(info,data,compresslevel=9)
        raw=buff.getvalue()
    assert h(raw)==f['after'],('target mismatch',str(p))
    p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(raw)
    manifest[str(p)]={'path':str(p),'sha256':h(raw)}
encoded=Path('docs/extinction-city/workbook-delivery-fixes.b64').read_text().strip()
# Repair the identified transport transcription; the full hash remains mandatory.
encoded=encoded.replace('ZVLfjyWveZJrfjha','ZVLfjyWveZrfjha')
fixes=decode(encoded,'8dc6b86f221211ebb0afbf8cf10efd07c96d307a747c956d61b51f79cf82f8d9')['fixes']
fix_paths={'scripts/extinction-city/catalog.mjs','scripts/extinctionCityCatalog.test.mjs','scripts/extinctionViewmodelContract.mjs','scripts/extinctionViewmodelContract.test.mjs','scripts/progressionAudit.mjs'}
assert len(fixes)==7 and {f['path'] for f in fixes}==fix_paths
for f in fixes:
    p=Path(f['path']);assert not p.is_symlink()
    before=p.read_bytes();assert h(before)==f['before'],f['path']
    text=before.decode();old,new=f['replace'];assert text.count(old)==1,f['path']
    after=text.replace(old,new).encode();assert h(after)==f['after'],f['path']
    p.write_bytes(after);manifest[str(p)]={'path':str(p),'sha256':h(after)}
(out/'manifest.json').write_text(json.dumps(list(manifest.values()),indent=2))
(out/'fixes-manifest.json').write_text(json.dumps(fixes,indent=2))
