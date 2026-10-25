"""Apply reviewed UTF-8 source changes; publish only after tests, with branch lease."""
import hashlib,json,os,pathlib,sys,urllib.request
BASE='61549b656908ce312c75cf59e83c5d2c4c1e7d6e'
BRANCH='codex/costumes-fidelite-r14-2026-10-25'
API='https://api.github.com/repos/darknigthmare/multiverse-breach/'
root=pathlib.Path.cwd();out=pathlib.Path('/tmp/wardrobe-r14-review');out.mkdir(exist_ok=True)
manifest=json.loads((root/'audit/wardrobe-r14-delivery/manifest.json').read_text())
assert len(manifest)==15 and len({e['path'] for e in manifest})==15
assert all(e['path'].startswith(('src/game/','scripts/')) and e['path'].endswith(('.js','.mjs')) for e in manifest)
def digest(b):return hashlib.sha256(b).hexdigest()
def api(p,method='GET',data=None):
 headers={'Accept':'application/vnd.github+json','User-Agent':'Wardrobe-reviewed-source'}
 if method!='GET':headers['Authorization']='Bearer '+os.environ['GH_TOKEN']
 req=urllib.request.Request(API+p,data=None if data is None else json.dumps(data).encode(),headers=headers,method=method)
 with urllib.request.urlopen(req,timeout=90) as response:return json.load(response)
def replace_file(p,fn):
 target=root/p;target.write_text(fn(target.read_text()))
if sys.argv[1]=='prepare':
 for e in manifest:
  assert digest((root/e['path']).read_bytes())==(e['beforeSha256'] or e['afterSha256']),e['path']
 def wardrobe(s):
  s="import { OFFICIAL_COSTUMES_R14, WARDROBE_RESEARCH_R14, WARDROBE_SOURCE_SCOPES_R14 } from './wardrobeOfficialR14.js';\n"+s
  s=s.replace('WARDROBE_VERSION = 8','WARDROBE_VERSION = 9').replace("'deadbydaylight.com'].includes", "'deadbydaylight.com','ioi.dk','www.nacongaming.com'].includes")
  s=s.replace('...OFFICIAL_COSTUMES_R13]);','...OFFICIAL_COSTUMES_R13,...OFFICIAL_COSTUMES_R14]);')
  s=s.replace('...WARDROBE_RESEARCH_R13].filter','...WARDROBE_RESEARCH_R13,...WARDROBE_RESEARCH_R14].filter')
  return s.replace('...WARDROBE_SOURCE_SCOPES_R13].filter','...WARDROBE_SOURCE_SCOPES_R13,...WARDROBE_SOURCE_SCOPES_R14].filter')
 replace_file('src/game/wardrobe.js',wardrobe)
 def scopes(s):
  start=s.index('// Every source scope declares');end=s.index('export const WARDROBE_RESEARCH_R13',start)
  return s[:start]+'''// Independent source requirements: never generate expectations from the delivered
// OFFICIAL_COSTUMES_R13 list, otherwise a missing entry can silently remove its own check.
const sourceRequirements=[
 ...PAYDAY_NAMED_PACKS_R13.map(p=>({id:p.id,sourceId:p.sourceId,work:p.work,universe:'Payday',actorIds:PAYDAY_WEARERS_R13,
  items:p.items.map(i=>({key:`r13-${p.id}-${i.slug}`,name:i.name,nature:i.component==='outfit-only'?'official-costume':'official-accessory',component:i.component,sourceMode:'PAYDAY2_PC_SHARED_COSMETIC'}))})),
 {id:'magicka-gamer-named-robes',sourceId:'paradox-gamer',work:'Magicka (2011) — Gamer Bundle',universe:'Magicka',actorIds:MAGICKA_WEARERS_R13,
  items:[{key:'r13-magicka-gamer-zombie',name:'Zombie Robe',nature:'official-model',component:'robe-model'},
   {key:'r13-magicka-gamer-tentacle',name:'Tentacle Robe',nature:'official-model',component:'robe-model'},
   {key:'r13-magicka-gamer-epic',name:'Epic Robe',nature:'official-costume',component:'outfit-only'}].map(i=>({...i,sourceMode:'MAGICKA1_PC_PLAYER_ROBE'}))},
 {id:'magicka-survival-wearable-only',sourceId:'paradox-survival',work:"Magicka (2011) — Wizard's Survival Kit",universe:'Magicka',actorIds:MAGICKA_WEARERS_R13,
  items:[{key:'r13-magicka-survival-hat',name:"Wizard's Hat",nature:'official-accessory',component:'headwear',sourceMode:'MAGICKA1_PC_PLAYER_ROBE'}]}
];
export const WARDROBE_SOURCE_SCOPES_R13=Object.freeze(sourceRequirements.flatMap(s=>s.actorIds.map(actorId=>Object.freeze({
 id:s.id,universe:s.universe,actorId,sourceUrl:sources.get(s.sourceId).url,checkedOn,
 boundary:'Named cosmetic components in this exact source only; wearer-specific imagery and whole-character wardrobe completeness remain unverified.',
 expectedItems:Object.freeze(s.items.map(i=>Object.freeze({...i,sourceWork:s.work})))
}))));
'''+s[end:]
 replace_file('src/game/wardrobeOfficialR13.js',scopes)
 for p in ['scripts/exportWardrobe.mjs','scripts/exportWardrobeBoosters.mjs','scripts/exportActorFidelityBacklog.mjs']:
  replace_file(p,lambda s:s.replace("'R13'","'R14'"))
 for f in ['actorFidelityR9.test.mjs','reauditWardrobeCatalog.test.mjs','reauditWardrobeFidelityR7.test.mjs','wardrobeBoosters.test.mjs','wardrobeR10.test.mjs','wardrobeR11.test.mjs','wardrobeR12.test.mjs','wardrobeR13.test.mjs']:
  p=root/'scripts'/f;s=p.read_text()
  s="import { OFFICIAL_COSTUMES_R14, WARDROBE_SOURCE_SCOPES_R14 } from '../src/game/wardrobeOfficialR14.js';\n"+s
  s=s.replace('+OFFICIAL_COSTUMES_R13.length)', '+OFFICIAL_COSTUMES_R13.length+OFFICIAL_COSTUMES_R14.length)')
  s=s.replace('+OFFICIAL_COSTUMES_R13.reduce((n,c)=>n+c.actorIds.length,0))', '+OFFICIAL_COSTUMES_R13.reduce((n,c)=>n+c.actorIds.length,0)+OFFICIAL_COSTUMES_R14.reduce((n,c)=>n+c.actorIds.length,0))')
  if f=='wardrobeR13.test.mjs':
   s=s.replace('old=all.filter(e=>!isNew(e))',"old=all.filter(e=>!isNew(e)&&!e.id.split(':').at(-1).startsWith('r14-'))")
   s=s.replace('ALL_OFFICIAL_WARDROBE.length,176','ALL_OFFICIAL_WARDROBE.length,176+OFFICIAL_COSTUMES_R14.length')
   s=s.replace('.length,335)', '.length,335+OFFICIAL_COSTUMES_R14.reduce((n,c)=>n+c.actorIds.length,0))')
   s=s.replace('all.length,20139','all.length,20139+OFFICIAL_COSTUMES_R14.reduce((n,c)=>n+c.actorIds.length,0)')
   s=s.replace(".filter(e=>e.origin==='OFFICIAL').map", ".filter(e=>e.origin==='OFFICIAL'&&!e.id.split(':').at(-1).startsWith('r14-')).map")
  if f=='wardrobeR12.test.mjs':
   s=s.replace('const r13Keys=new Set(OFFICIAL_COSTUMES_R13.map(e=>e.key));','const r13Keys=new Set([...OFFICIAL_COSTUMES_R13,...OFFICIAL_COSTUMES_R14].map(e=>e.key));')
   s=s.replace('const r13Bindings=OFFICIAL_COSTUMES_R13.reduce','const r13Bindings=[...OFFICIAL_COSTUMES_R13,...OFFICIAL_COSTUMES_R14].reduce')
   s=s.replace(".filter(e=>e.origin==='OFFICIAL').map", ".filter(e=>e.origin==='OFFICIAL'&&!e.id.split(':').at(-1).startsWith('r14-')).map")
   s=s.replace('1+new Set(WARDROBE_SOURCE_SCOPES_R13.map','1+new Set([...WARDROBE_SOURCE_SCOPES_R13,...WARDROBE_SOURCE_SCOPES_R14].map')
  else:s=s.replace('OFFICIAL_COSTUMES_R14, WARDROBE_SOURCE_SCOPES_R14','OFFICIAL_COSTUMES_R14')
  if f=='reauditWardrobeFidelityR7.test.mjs':
   s=s.replace("test('Agent 47 gets only six named suits, not associated pack weapons'", "test('Agent 47 retains the six R7 named suits, not associated pack weapons'")
   s=s.replace("getOfficialCostumes({id:'hitman_woa_agent_47',universe:'HITMAN — World of Assassination'});assert.equal(rows.length,6)","getOfficialCostumes({id:'hitman_woa_agent_47',universe:'HITMAN — World of Assassination'}).filter(c=>OFFICIAL_COSTUMES_R7.some(r=>r.key===c.key));assert.equal(rows.length,6)")
  if f=='wardrobeR11.test.mjs':s=s.replace('OFFICIAL_COSTUMES_R12,...OFFICIAL_COSTUMES_R13','OFFICIAL_COSTUMES_R12,...OFFICIAL_COSTUMES_R13,...OFFICIAL_COSTUMES_R14')
  p.write_text(s)
 for e in manifest:assert digest((root/e['path']).read_bytes())==e['afterSha256'],e['path']
 (out/'source-manifest.json').write_text(json.dumps(manifest,indent=2))
 print('All fifteen reviewed source hashes match.')
elif sys.argv[1]=='publish':
 assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent feature-branch change; stop'
 elements=[]
 for e in manifest:
  data=(root/e['path']).read_bytes();assert digest(data)==e['afterSha256'],e['path']
  text=data.decode('utf-8');blob=api('git/blobs','POST',{'content':text,'encoding':'utf-8'})
  assert blob['sha']==hashlib.sha1(b'blob '+str(len(data)).encode()+b'\0'+data).hexdigest()
  elements.append({'path':e['path'],'mode':'100644','type':'blob','sha':blob['sha']})
 tree=api('git/trees','POST',{'base_tree':api('git/commits/'+BASE)['tree']['sha'],'tree':elements})
 commit=api('git/commits','POST',{'message':'feat(wardrobe): add 14 source-backed costumes and prevent circular completeness checks','tree':tree['sha'],'parents':[BASE]})
 assert api('git/ref/heads/'+BRANCH)['object']['sha']==BASE,'Concurrent branch change; refuse advance'
 api('git/refs/heads/'+BRANCH,'PATCH',{'sha':commit['sha'],'force':False})
 result={'commit':commit['sha'],'tree':tree['sha'],'base':BASE,'files':elements}
 (out/'publication.json').write_text(json.dumps(result,indent=2));print(json.dumps(result))
else:raise ValueError('prepare or publish')
