"""One-shot exact-byte review transport; no ref, commit, merge or deployment."""
import base64,lzma,hashlib,io,json,os,re,subprocess,sys,urllib.request,zipfile
from pathlib import Path
from xml.sax.saxutils import escape
EXPECTED_PACKAGE='98818fe25672ac1fe4aac259e5bfdc434977b44abc2b123a2b2102aec423128d'
ROOT=Path('docs/extinction-city-review');OUT=Path('/tmp/ec-evidence');OUT.mkdir(parents=True,exist_ok=True)
encoded=''.join(p.read_text().strip() for p in sorted(ROOT.glob('package.part*')))
raw=lzma.decompress(base64.b64decode(encoded));assert len(raw)<3000000 and hashlib.sha256(raw).hexdigest()==EXPECTED_PACKAGE
package=json.loads(raw)
allowed={'src/components/HubScreen.jsx','src/game/extinctionContent.js','src/game/mosaicUniversePlaces.js','scripts/fixtures/cityExtinctionHarness.jsx','scripts/extinctionContent.test.mjs','scripts/mosaicUniversePlaces.test.mjs','scripts/extinctionCityCatalog.test.mjs','scripts/browserExtinctionCatalog.py','scripts/extinction-city/catalog.mjs','scripts/extinction-city/build_workbook.py','scripts/extinction-city/verify_workbook.py','.github/workflows/extinction-content.yml','docs/extinction-city/README.md','docs/extinction-city/inventory-2026-10-26.json'}
assert {f['path']for f in package['files']}==allowed
if sys.argv[1]=='apply':
    for f in package['files']:
        p=Path(f['path']);assert not p.is_symlink()
        actual=hashlib.sha256(p.read_bytes()).hexdigest()if p.exists()else None
        assert actual==f['beforeSha256'],('Base mismatch',str(p))
    patch=package['patch'].encode();assert hashlib.sha256(patch).hexdigest()==package['patchSha256']
    Path('/tmp/ec-reviewed.patch').write_bytes(patch)
    subprocess.run(['git','apply','--check','--binary','/tmp/ec-reviewed.patch'],check=True)
    subprocess.run(['git','apply','--binary','/tmp/ec-reviewed.patch'],check=True)
    for f in package['files']:assert hashlib.sha256(Path(f['path']).read_bytes()).hexdigest()==f['afterSha256'],f['path']
    (OUT/'manifest.json').write_text(json.dumps(package['files'],indent=2))
elif sys.argv[1]=='workbook':
    data=json.loads((OUT/'catalog.json').read_text());recipe=package['workbook']
    assert data['dataSha256']==recipe['catalogSha256']
    buf=io.BytesIO()
    with zipfile.ZipFile(buf,'w',zipfile.ZIP_DEFLATED,compresslevel=9)as z:
        for entry in recipe['entries']:
            name=entry['name'];assert not name.startswith('/')and '..'not in name.split('/')
            if 'table'in entry:
                rows=data['tables'][entry['table']]['rows'];parts=[entry['prefix']];i=0
                for index,count in entry['runs']:
                    for _ in range(count):
                        values=rows[i]
                        def sub(m):
                            if m[1]=='R':return str(i+6)
                            v=values[int(m[1][1:])];v=''if v is None else str(v)
                            if v.startswith(('=','+','-','@')):v="'"+v
                            return escape(v)
                        parts.append(re.sub(r'\{\{(R|V\d+)\}\}',sub,entry['templates'][index]));i+=1
                assert i==len(rows);parts.append(entry['suffix']);raw=''.join(parts).encode()
            else:raw=entry['raw'].encode()
            assert hashlib.sha256(raw).hexdigest()==entry['sha256'],name
            info=zipfile.ZipInfo(name,(2026,10,26,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o600<<16
            z.writestr(info,raw,compresslevel=9)
    raw=buf.getvalue();assert hashlib.sha256(raw).hexdigest()==recipe['targetSha256']
    target=Path('docs/excel/Multiverse_Breach_Extinction_Cite_Production.xlsx');target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(raw)
    (OUT/target.name).write_bytes(raw)
    print('Exact artifact_tool export reassembled; every ZIP member and complete file verified.')
elif sys.argv[1]=='blobs':
    files=package['files']+[{'path':'docs/excel/Multiverse_Breach_Extinction_Cite_Production.xlsx','afterSha256':package['workbook']['targetSha256']}]
    assert hashlib.sha256(Path('docs/excel/Multiverse_Breach_UI_Immersion.xlsx').read_bytes()).hexdigest()=='3865e2d96486c7275bab8a4f7f9c095b06fe16c17109218277121c5d02aa0402'
    blobs=[]
    for f in files:
        raw=Path(f['path']).read_bytes();assert hashlib.sha256(raw).hexdigest()==f['afterSha256']
        body=json.dumps({'encoding':'base64','content':base64.b64encode(raw).decode()}).encode()
        req=urllib.request.Request('https://api.github.com/repos/darknigthmare/multiverse-breach/git/blobs',data=body,method='POST',headers={'Authorization':'Bearer '+os.environ['GH_TOKEN'],'Accept':'application/vnd.github+json','User-Agent':'ec-reviewed-delivery','X-GitHub-Api-Version':'2022-11-28'})
        with urllib.request.urlopen(req,timeout=60)as r:result=json.load(r)
        assert result['sha']==hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
        blobs.append({'path':f['path'],'mode':'100644','type':'blob','sha':result['sha']})
    (OUT/'verified-blobs.json').write_text(json.dumps(blobs,indent=2))
    print('Verified objects stored. No commit or reference moved.')
else:raise ValueError('Unknown step')
