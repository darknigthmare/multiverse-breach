"""One-shot publication of reviewed UTF-8 source edits to one existing PR branch.
No external file relay, no binary upload, no production ref, no repository settings.
"""
import base64, concurrent.futures, hashlib, json, os, pathlib, sys, urllib.parse, urllib.request
REPO='darknigthmare/multiverse-breach'
BASE='f6fe60f8742cb17772af8a9b4a228d24e7abc899'
TARGET='codex/audit-fidelite-excels-2026-10-24'
ROOT=pathlib.Path('/tmp/source-stages-r4')
NEW={'src/game/sourceSceneStages.js','src/game/sourceSceneEncounter.js','src/game/sourceScenePresentation.js','src/components/SourceScenePanel.jsx','src/components/SourceScenePanel.css','scripts/sourceSceneTestLoader.mjs','scripts/reauditSourceScenes.test.mjs'}
MOD={'src/game/canonAliensRescueEncounter.js','src/game/stageEnemyResolver.js','src/game/engineTactics.js','src/game/tacticsBattlefields.js','src/game/canonPriorityStages.js','src/game/canonEncounterBriefing.js','src/components/HubScreen.jsx','src/components/GameCanvas.jsx','docs/excel/tools/refreshFidelityEvidence.mjs'}
def api(path,body=None,method=None):
 data=None if body is None else json.dumps(body).encode()
 req=urllib.request.Request('https://api.github.com/repos/'+REPO+'/'+path,data=data,method=method,headers={'Authorization':'Bearer '+os.environ['GH_TOKEN'],'Accept':'application/vnd.github+json','Content-Type':'application/json','User-Agent':'Source-Scene-PR-Delivery'})
 with urllib.request.urlopen(req,timeout=60) as r:return json.load(r)
def raw(path,ref):
 url='https://raw.githubusercontent.com/'+REPO+'/'+ref+'/'+urllib.parse.quote(path)
 with urllib.request.urlopen(url,timeout=60) as r:return r.read()
def sha(data):return hashlib.sha256(data).hexdigest()
def gitblob(data):return hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
def current():return api('git/ref/heads/'+TARGET)['object']['sha']
mode=sys.argv[1]
if mode=='prepare':
 if current()!=BASE:raise RuntimeError('PR branch advanced; refuse overwrite')
 transport=os.environ['GITHUB_SHA']
 manifest=json.loads(raw('docs/stage-delivery-r4/line-changes.json',transport))
 if manifest['baseCommit']!=BASE or manifest['targetBranch']!=TARGET:raise RuntimeError('Wrong target')
 if {x['path'] for x in manifest['changes']}!=MOD or {x['path'] for x in manifest['newFiles']}!=NEW:raise RuntimeError('Unexpected changed paths')
 base_tree=api('git/commits/'+BASE)['tree']['sha'];tree=api('git/trees/'+base_tree+'?recursive=1')
 if tree.get('truncated'):raise RuntimeError('Incomplete tree')
 index={e['path']:e for e in tree['tree'] if e['type']=='blob'}
 selected=[e for p,e in index.items() if (p.startswith('src/') and p.endswith(('.js','.jsx','.json','.css'))) or p in MOD or p in {'package.json','scripts/riftDossierStaticStages.mjs'}]
 ROOT.mkdir(exist_ok=True)
 def get(e):
  data=raw(e['path'],BASE)
  if gitblob(data)!=e['sha']:raise RuntimeError('Source blob mismatch '+e['path'])
  dst=ROOT/e['path'];dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(data)
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:list(pool.map(get,selected))
 for c in manifest['changes']:
  dst=ROOT/c['path'];data=dst.read_bytes()
  if sha(data)!=c['beforeSha256']:raise RuntimeError('Before hash mismatch '+c['path'])
  lines=data.decode('utf-8').splitlines(True)
  for edit in reversed(c['edits']):
   a,b=edit['start'],edit['end']
   if not isinstance(a,int) or not isinstance(b,int) or not 0<=a<=b<=len(lines):raise RuntimeError('Invalid edit bounds')
   lines[a:b]=edit['text'].splitlines(True)
  after=''.join(lines).encode()
  if sha(after)!=c['afterSha256']:raise RuntimeError('After hash mismatch '+c['path'])
  dst.write_bytes(after)
 for c in manifest['newFiles']:
  if c['path'] in index:raise RuntimeError('New path already exists')
  data=raw(c['path'],transport)
  if sha(data)!=c['sha256']:raise RuntimeError('New source mismatch '+c['path'])
  dst=ROOT/c['path'];dst.parent.mkdir(parents=True,exist_ok=True);dst.write_bytes(data)
 (ROOT/'delivery-manifest.json').write_text(json.dumps(manifest))
 (ROOT/'base-tree.txt').write_text(base_tree)
 print('Verified source preparation:',len(selected),'source files;',len(MOD)+len(NEW),'target files')
elif mode=='publish':
 if current()!=BASE:raise RuntimeError('PR branch advanced during tests; refuse publication')
 manifest=json.loads((ROOT/'delivery-manifest.json').read_text())
 entries=[]
 for c in manifest['changes']+manifest['newFiles']:
  data=(ROOT/c['path']).read_bytes();expected=c.get('afterSha256',c.get('sha256'))
  if sha(data)!=expected:raise RuntimeError('Tested source changed '+c['path'])
  blob=api('git/blobs',{'content':data.decode('utf-8'),'encoding':'utf-8'})
  if blob['sha']!=gitblob(data):raise RuntimeError('Published blob mismatch')
  entries.append({'path':c['path'],'mode':'100644','type':'blob','sha':blob['sha']})
 tree=api('git/trees',{'base_tree':(ROOT/'base-tree.txt').read_text(),'tree':entries})
 commit=api('git/commits',{'message':'feat(stages): add Sulaco, Narcissus and Blast Pit contextual encounters with 83 native tests','tree':tree['sha'],'parents':[BASE]})
 if current()!=BASE:raise RuntimeError('Concurrent edit; refuse reference update')
 api('git/refs/heads/'+TARGET,{'sha':commit['sha'],'force':False},'PATCH')
 if current()!=commit['sha']:raise RuntimeError('Reference readback differs')
 report={'commit':commit['sha'],'parent':BASE,'tree':tree['sha'],'files':entries,'targetBranch':TARGET,'binaryFiles':0}
 (ROOT/'published.json').write_text(json.dumps(report,indent=2))
 print('Published source commit',commit['sha'])
else:raise RuntimeError('Unknown operation')
