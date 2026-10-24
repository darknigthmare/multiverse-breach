"""Publish reviewed UTF-8 source edits only, after isolated tests; no binary transport."""
import concurrent.futures,hashlib,json,os,pathlib,sys,urllib.request,urllib.parse
REPO='darknigthmare/multiverse-breach'
BASE='20585ab5d0f61683c5f5586a04dda2ae0afc81a3'
BRANCH='codex/audit-fidelite-excels-2026-10-24'
ROOT=pathlib.Path('/tmp/wardrobe-source');EVID=pathlib.Path('/tmp/wardrobe-evidence');EVID.mkdir(exist_ok=True)
API='https://api.github.com/repos/'+REPO+'/'
def api(part,method='GET',data=None):
    headers={'Accept':'application/vnd.github+json','User-Agent':'Multiverse-Source-Review'}
    if method!='GET':headers['Authorization']='Bearer '+os.environ['GH_TOKEN']
    request=urllib.request.Request(API+part,data=None if data is None else json.dumps(data).encode(),headers=headers,method=method)
    with urllib.request.urlopen(request,timeout=90) as response:return json.load(response)
def raw(ref,path):
    url='https://raw.githubusercontent.com/'+REPO+'/'+ref+'/'+urllib.parse.quote(path)
    with urllib.request.urlopen(url,timeout=90) as response:return response.read()
def blob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def sha(b):return hashlib.sha256(b).hexdigest()
def manifest():return json.loads(raw(os.environ['GITHUB_SHA'],'audit/wardrobe-r5-delivery/manifest.json'))
m=manifest();assert m['base']==BASE and m['branch']==BRANCH
allowed=set(x['path'] for x in m['additions'])|set(m['editedFiles'])
assert len(allowed)==15 and all(p.startswith(('src/','scripts/')) and p.endswith(('.js','.jsx','.css','.mjs','.py','.html')) for p in allowed)
if sys.argv[1]=='prepare':
    assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent PR change; stop'
    commit=api('git/commits/'+BASE);tree=api('git/trees/'+commit['tree']['sha']+'?recursive=1');assert tree['truncated'] is False
    entries={x['path']:x for x in tree['tree'] if x['type']=='blob'}
    def keep(p):
        return (p.startswith(('src/','scripts/','api/')) and p.endswith(('.js','.jsx','.mjs','.py','.json','.jsonl','.css','.html'))) or (p.startswith('public/') and p.endswith(('.json','.jsonl'))) or ('/' not in p and p.endswith(('.json','.js','.mjs','.html')))
    selected=[x for p,x in entries.items() if keep(p)]
    def get(e):
        data=raw(BASE,e['path']);assert blob(data)==e['sha'],e['path'];dest=ROOT/e['path'];dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
        return {'path':e['path'],'gitBlob':e['sha'],'sha256':sha(data)}
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:verified=list(pool.map(get,selected))
    for x in m['additions']:
        assert x['path'] not in entries,'Unexpected existing file'
        data=raw(os.environ['GITHUB_SHA'],x['path']);assert sha(data)==x['sha256'],x['path']
        dest=ROOT/x['path'];dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
    for p,h in m['editedFiles'].items():assert blob((ROOT/p).read_bytes())==h['before'],p
    for e in m['edits']:
        dest=ROOT/e['path'];text=dest.read_text();assert text.count(e['old'])==1,e['path'];dest.write_text(text.replace(e['old'],e['new'],1))
    for p,h in m['editedFiles'].items():assert sha((ROOT/p).read_bytes())==h['afterSha256'],p
    (EVID/'source-verification.json').write_text(json.dumps({'base':BASE,'tree':commit['tree']['sha'],'verifiedFiles':len(verified),'editedFiles':m['editedFiles'],'additions':m['additions']},indent=2))
    print(json.dumps({'verifiedFiles':len(verified),'sourceFilesToPublish':len(allowed)}))
elif sys.argv[1]=='publish':
    assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent PR change; stop'
    # Re-read only allowlisted bytes; never include dependencies, workflows, artifacts or workbooks.
    expected={x['path']:x['sha256'] for x in m['additions']};expected.update({p:x['afterSha256'] for p,x in m['editedFiles'].items()})
    elements=[];published=[]
    for p in sorted(allowed):
        data=(ROOT/p).read_bytes();assert sha(data)==expected[p],p
        text=data.decode('utf-8');b=api('git/blobs','POST',{'content':text,'encoding':'utf-8'});assert b['sha']==blob(data)
        elements.append({'path':p,'mode':'100644','type':'blob','sha':b['sha']});published.append({'path':p,'gitBlob':b['sha'],'sha256':sha(data)})
    baseTree=api('git/commits/'+BASE)['tree']['sha']
    tree=api('git/trees','POST',{'base_tree':baseTree,'tree':elements})
    commit=api('git/commits','POST',{'message':'feat(wardrobe): add sourced outfit research, Nexus concepts and identity-safe cosmetic effects','tree':tree['sha'],'parents':[BASE]})
    assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent PR change; do not advance'
    api('git/refs/heads/'+BRANCH,'PATCH',{'sha':commit['sha'],'force':False})
    assert api('git/ref/heads/'+BRANCH)['object']['sha']==commit['sha']
    result={'commit':commit['sha'],'tree':tree['sha'],'parent':BASE,'files':published}
    (EVID/'publication.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
else:raise ValueError('prepare or publish')
