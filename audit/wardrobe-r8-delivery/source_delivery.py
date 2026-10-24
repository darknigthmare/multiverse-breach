"""Validate and publish only the reviewed R8 UTF-8 source files. No workbook or asset transport."""
import concurrent.futures,hashlib,json,os,pathlib,sys,urllib.parse,urllib.request
REPO='darknigthmare/multiverse-breach'
BASE='f857dcf6bd739aa93a46134d7bf13956981d7239'
BRANCH='codex/audit-fidelite-excels-2026-10-24'
ROOT=pathlib.Path('/tmp/wardrobe-r8-source');EVID=pathlib.Path('/tmp/wardrobe-r8-evidence');EVID.mkdir(exist_ok=True)
API='https://api.github.com/repos/'+REPO+'/'
def api(part,method='GET',data=None):
 headers={'Accept':'application/vnd.github+json','User-Agent':'Multiverse-R8-Reviewed-Source'}
 if method!='GET':headers['Authorization']='Bearer '+os.environ['GH_TOKEN']
 request=urllib.request.Request(API+part,data=None if data is None else json.dumps(data).encode(),headers=headers,method=method)
 with urllib.request.urlopen(request,timeout=90) as response:return json.load(response)
def raw(ref,p):
 with urllib.request.urlopen('https://raw.githubusercontent.com/'+REPO+'/'+ref+'/'+urllib.parse.quote(p),timeout=90) as r:return r.read()
def blob(b):return hashlib.sha1(b'blob '+str(len(b)).encode()+b'\0'+b).hexdigest()
def sha(b):return hashlib.sha256(b).hexdigest()
m=json.loads(raw(os.environ['GITHUB_SHA'],'audit/wardrobe-r8-delivery/manifest.json'))
assert m['base']==BASE and m['branch']==BRANCH
allowed=set(x['path'] for x in m['additions'])|set(m['editedFiles'])
assert len(allowed)==11 and all(p.startswith(('src/','scripts/')) and p.endswith(('.js','.jsx','.css','.mjs','.py','.html')) for p in allowed)
if sys.argv[1]=='prepare':
 assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent PR change; stop'
 base=api('git/commits/'+BASE);tree=api('git/trees/'+base['tree']['sha']+'?recursive=1');assert tree['truncated'] is False
 entries={e['path']:e for e in tree['tree'] if e['type']=='blob'}
 def keep(p):return (p.startswith(('src/','scripts/','api/')) and p.endswith(('.js','.jsx','.mjs','.json','.jsonl','.css','.html','.py'))) or (p.startswith('public/') and p.endswith(('.json','.jsonl'))) or ('/' not in p and p.endswith(('.json','.js','.mjs','.html')))
 def get(e):
  data=raw(BASE,e['path']);assert blob(data)==e['sha'],e['path'];p=ROOT/e['path'];p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
  return {'path':e['path'],'blob':e['sha'],'sha256':sha(data)}
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:verified=list(pool.map(get,[e for p,e in entries.items() if keep(p)]))
 for row in m['additions']:
  assert row['path'] not in entries,'Unexpected file exists'
  data=raw(os.environ['GITHUB_SHA'],row['path']);assert sha(data)==row['sha256'],row['path']
  p=ROOT/row['path'];p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(data)
 for p,row in m['editedFiles'].items():assert blob((ROOT/p).read_bytes())==row['before'],p
 for row in m['edits']:
  p=ROOT/row['path'];text=p.read_text();assert text.count(row['old'])==1,row['path'];p.write_text(text.replace(row['old'],row['new'],1))
 for p,row in m['editedFiles'].items():assert sha((ROOT/p).read_bytes())==row['afterSha256'],p
 (EVID/'source-verification.json').write_text(json.dumps({'base':BASE,'tree':base['tree']['sha'],'verifiedFiles':len(verified),'publishedFiles':len(allowed),'additions':m['additions'],'edits':m['editedFiles']},indent=2))
 print(json.dumps({'verifiedSources':len(verified),'reviewedChanges':len(allowed)}))
elif sys.argv[1]=='publish':
 assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent PR change; stop'
 expected={x['path']:x['sha256'] for x in m['additions']};expected.update({p:x['afterSha256'] for p,x in m['editedFiles'].items()})
 elements=[];files=[]
 for p in sorted(allowed):
  b=(ROOT/p).read_bytes();assert sha(b)==expected[p],p
  result=api('git/blobs','POST',{'content':b.decode('utf-8'),'encoding':'utf-8'});assert result['sha']==blob(b)
  elements.append({'path':p,'mode':'100644','type':'blob','sha':result['sha']});files.append({'path':p,'blob':result['sha'],'sha256':sha(b)})
 baseTree=api('git/commits/'+BASE)['tree']['sha'];tree=api('git/trees','POST',{'base_tree':baseTree,'tree':elements})
 commit=api('git/commits','POST',{'message':'feat(wardrobe): unlock matching outfits through duplicate-free booster bonuses','tree':tree['sha'],'parents':[BASE]})
 assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent PR change; stop'
 result=api('git/refs/heads/'+BRANCH,'PATCH',{'sha':commit['sha'],'force':False})
 assert result['object']['sha']==commit['sha'],'Unexpected ref update response'
 report={'commit':commit['sha'],'tree':tree['sha'],'parent':BASE,'files':files,'refUpdateResponse':result['object']['sha']}
 (EVID/'publication.json').write_text(json.dumps(report,indent=2));print(json.dumps(report))
else:raise ValueError('prepare or publish')
