import base64,gzip,hashlib,json,os,sys,urllib.request,zipfile
from pathlib import Path
OUT=Path('/tmp/ec-access-evidence');OUT.mkdir(parents=True,exist_ok=True)
def digest(raw):return hashlib.sha256(raw).hexdigest()
def blob_hash(raw):return hashlib.sha1(b'blob '+str(len(raw)).encode()+b'\0'+raw).hexdigest()
if sys.argv[1]=='apply':
    raw=gzip.decompress(base64.b64decode(Path('docs/ec-access-review/bundle.b64').read_text()))
    assert digest(raw)=='36e1070696c8fc6238061f9d0feedfe1e5657a5827224309583dfe63a9880cf1'
    m=json.loads(raw)
    existing={'src/components/HubScreen.jsx','scripts/fixtures/cityExtinctionHarness.jsx'}
    new={'src/game/sceneRosterAccess.js','scripts/sceneRosterAccess.test.mjs','scripts/browserSceneRosterAccess.py','docs/extinction-city/roster-access.md'}
    assert {f['path'] for f in m['patches']}==existing and set(m['newFiles'])==new
    updates={}
    for f in m['patches']:
        p=Path(f['path']);assert not p.is_symlink() and digest(p.read_bytes())==f['before'],str(p)
        text=p.read_text()
        for old,replacement in f['ops']:
            assert text.count(old)==1,(str(p),old[:100],text.count(old))
            text=text.replace(old,replacement)
        updates[str(p)]=text
    for name,text in m['newFiles'].items():
        assert not Path(name).exists(),name
        updates[name]=text
    wf=Path('.github/workflows/extinction-content.yml')
    assert blob_hash(wf.read_bytes())=='26b9a01a7981f7973b4d9d4928577a530c401ea4'
    text=wf.read_text()
    old='node --test scripts/extinctionContent.test.mjs'
    assert text.count(old)==1
    text=text.replace(old,'node --test scripts/sceneRosterAccess.test.mjs scripts/extinctionContent.test.mjs')
    old='npx oxlint --max-warnings 0 src/components/HubScreen.jsx'
    assert text.count(old)==1
    text=text.replace(old,'npx oxlint --max-warnings 0 src/game/sceneRosterAccess.js scripts/sceneRosterAccess.test.mjs src/components/HubScreen.jsx')
    old='          /tmp/ec-playwright/bin/python scripts/browserExtinctionCatalog.py --require-art --evidence /tmp/ec-evidence/browser | tee /tmp/ec-evidence/browser.log'
    assert text.count(old)==1
    text=text.replace(old,old+'\n          /tmp/ec-playwright/bin/python scripts/browserSceneRosterAccess.py --evidence /tmp/ec-evidence/roster | tee /tmp/ec-evidence/roster.log')
    updates[str(wf)]=text
    files=[]
    for name,text in updates.items():
        p=Path(name);p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text)
        files.append({'path':name,'sha256':digest(p.read_bytes())})
    (OUT/'manifest.json').write_text(json.dumps(files,indent=2))
    with zipfile.ZipFile(OUT/'verified-source.zip','w',zipfile.ZIP_DEFLATED) as z:
        for f in files:z.write(f['path'],f['path'])
    print('Applied exact reviewed changes to seven allowlisted files.')
elif sys.argv[1]=='blobs':
    files=json.loads((OUT/'manifest.json').read_text());blobs=[]
    for f in files:
        raw=Path(f['path']).read_bytes();assert digest(raw)==f['sha256']
        data=json.dumps({'encoding':'base64','content':base64.b64encode(raw).decode()}).encode()
        req=urllib.request.Request('https://api.github.com/repos/darknigthmare/multiverse-breach/git/blobs',data=data,method='POST',headers={'Authorization':'Bearer '+os.environ['GH_TOKEN'],'Accept':'application/vnd.github+json','User-Agent':'pr9-roster-review','X-GitHub-Api-Version':'2022-11-28'})
        with urllib.request.urlopen(req,timeout=30) as r:result=json.load(r)
        assert result['sha']==blob_hash(raw)
        blobs.append({'path':f['path'],'mode':'100644','type':'blob','sha':result['sha']})
    (OUT/'verified-blobs.json').write_text(json.dumps(blobs,indent=2))
    print('Verified Git objects stored; no commit, ref update or deployment.')
else:raise SystemExit('Unknown operation')
