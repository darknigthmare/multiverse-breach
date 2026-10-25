"""Apply hash-locked UTF-8 source edits, then publish only those tested source files."""
import hashlib,json,os,pathlib,subprocess,sys,time,urllib.request
ROOT=pathlib.Path.cwd()
BASE='e09265fa5a6b75caa8b66b6784629ea69cd0da8a'
BRANCH='codex/audit-fidelite-excels-2026-10-24'
API='https://api.github.com/repos/darknigthmare/multiverse-breach/'
OUT=pathlib.Path('/tmp/wardrobe-r13-evidence');OUT.mkdir(exist_ok=True)
m=json.loads((ROOT/'audit/wardrobe-r13-delivery/manifest.json').read_text())
assert m['base']==BASE and m['branch']==BRANCH
assert len(m['files'])==14
for p in m['files']:
    assert p.startswith(('src/game/wardrobe','scripts/')) and p.endswith(('.js','.mjs')) and '..' not in p.split('/')
def blob(data):return hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()
def check_after(p):
    data=(ROOT/p).read_bytes(); h=m['files'][p]
    assert hashlib.sha256(data).hexdigest()==h['afterSha256'],p+' sha256'
    assert blob(data)==h['afterGit'],p+' git blob'
    return data
if sys.argv[1]=='prepare':
    for p,h in m['files'].items():
        if h['before'] is not None:assert blob((ROOT/p).read_bytes())==h['before'],p
        else:check_after(p)
    for p,edits in m['patches'].items():
        text=(ROOT/p).read_text()
        for start,end,old,new in reversed(edits):
            assert text[start:end]==old,p
            text=text[:start]+new+text[end:]
        (ROOT/p).write_text(text)
    for p in m['files']:check_after(p)
    (OUT/'source-verification.json').write_text(json.dumps({'base':BASE,'files':m['files']},indent=2))
    print('Fourteen source files match the reviewed hashes.')
elif sys.argv[1]=='publish':
    def api(part,method='GET',data=None):
        headers={'Accept':'application/vnd.github+json','Authorization':'Bearer '+os.environ['GH_TOKEN'],'User-Agent':'Multiverse-Reviewed-Source'}
        req=urllib.request.Request(API+part,headers=headers,method=method,data=None if data is None else json.dumps(data).encode())
        with urllib.request.urlopen(req,timeout=90) as response:return json.load(response)
    assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent PR change: publication stopped.'
    elems=[]
    for p in sorted(m['files']):
        data=check_after(p);b=api('git/blobs','POST',{'content':data.decode('utf-8'),'encoding':'utf-8'});assert b['sha']==blob(data)
        elems.append({'path':p,'mode':'100644','type':'blob','sha':b['sha']})
    tree=api('git/trees','POST',{'base_tree':api('git/commits/'+BASE)['tree']['sha'],'tree':elems})
    commit=api('git/commits','POST',{'message':'feat(wardrobe): add named PAYDAY and Magicka cosmetics, scoped component checks and exact booster bindings','tree':tree['sha'],'parents':[BASE]})
    assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent PR change: publication stopped.'
    api('git/refs/heads/'+BRANCH,'PATCH',{'sha':commit['sha'],'force':False})
    observed=None
    for _ in range(4):
        observed=api('git/ref/heads/'+BRANCH)['object']['sha']
        if observed==commit['sha']:break
        time.sleep(2)
    result={'commit':commit['sha'],'tree':tree['sha'],'parent':BASE,'observedHead':observed,'files':elems}
    (OUT/'publication.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
    assert observed==commit['sha'],'Publication response recorded; ref readback not yet confirmed.'
else:raise ValueError('prepare or publish')
