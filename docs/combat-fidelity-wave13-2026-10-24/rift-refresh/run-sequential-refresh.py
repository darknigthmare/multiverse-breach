#!/usr/bin/env python3
"""Authorized Wave13 Rift refresh; historical scripts and thresholds untouched."""
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
import shutil
import subprocess
import sys
import threading
import time

ROOT=Path('/workspace/multiverse-breach')
LOG=ROOT/'docs/combat-fidelity-wave13-2026-10-24/rift-refresh'
COMMANDS=[
 ('01-catalog-refresh',['node','scripts/buildRiftDossierCatalog.mjs','--refresh-character-reference-audit']),
 ('02-character-reference-audit',['python','scripts/auditCharacterReferenceQuality.py']),
 ('03-catalog-build',['node','scripts/buildRiftDossierCatalog.mjs']),
 ('04-asset-registry-build',['node','scripts/buildRiftDossierAssetRegistry.mjs']),
 ('05-rift-audit',['npm','run','rift:audit']),
]
SOURCES=['scripts/buildRiftDossierCatalog.mjs','scripts/auditCharacterReferenceQuality.py','scripts/buildRiftDossierAssetRegistry.mjs','package.json']
OUTPUTS=['docs/rift-dossiers/catalog.json','docs/rift-dossiers/character-reference-quality.json','src/game/riftDossierAssets.json']
def now():return datetime.now(timezone.utc).isoformat()
def hashes(paths):return {p:sha256((ROOT/p).read_bytes()).hexdigest() for p in paths}
resume = sys.argv[1:] == ['--resume-after-reference-audit']
if sys.argv[1:] and not resume:raise SystemExit('Only --resume-after-reference-audit is supported.')
LOG.mkdir(parents=True,exist_ok=True)
authorizationPath=LOG/'authorization.json'
if not authorizationPath.exists():raise SystemExit('Root base-freeze authorization is required; preparation only.')
authorization=json.loads(authorizationPath.read_text())
if authorization.get('authorized') is not True or authorization.get('referenceInputsFrozen') is not True:raise SystemExit('Root base freeze is not authorized.')
if len(authorization.get('references',[])) != 40:raise SystemExit('Exactly 40 frozen character references required.')
plan=json.loads((LOG.parent/'batch-plan-before.json').read_text())
selected={hero['hero']['id'] for hero in plan['heroes']}
if {ref['id'] for ref in authorization['references']} != selected:raise SystemExit('Authorization must bind exactly the selected 40 identities.')
preparation=json.loads((LOG/'preparation-only.json').read_text())
if hashes(['scripts/auditCharacterReferenceQuality.py'])['scripts/auditCharacterReferenceQuality.py'] != preparation['historicalPythonSha256']:raise SystemExit('Historical Python source drift; no command executed.')
def verify_references():
 for ref in authorization['references']:
  if hashes(['public'+ref['sheet']])['public'+ref['sheet']] != ref['sha256']:raise SystemExit('Frozen reference drift: '+ref['id'])
verify_references()
priorArchive=authorization.get('previousSuccessfulRunArchive')
if priorArchive:
 prior=json.loads((ROOT/priorArchive/'result.json').read_text())
 if hashes(SOURCES)!=prior['sourceSha256Before']:raise SystemExit('Historical audit scripts/package differ from the first successful run; no command executed.')
 for name in ['catalog-before.json','quality-before.json','registry-before.json','auditCharacterReferenceQuality-before.py']:
  if sha256((LOG/name).read_bytes()).hexdigest()!=sha256((ROOT/priorArchive/name).read_bytes()).hexdigest():raise SystemExit('Original before snapshot changed: '+name)
# Immutable local before copies: all existing root snapshots are preserved.
for source,name in [(OUTPUTS[0],'catalog-before.json'),(OUTPUTS[1],'quality-before.json'),(OUTPUTS[2],'registry-before.json')]:
 target=LOG/name
 if not target.exists():shutil.copy2(ROOT/source,target)
scriptBaseline=LOG/'auditCharacterReferenceQuality-before.py'
if not scriptBaseline.exists():shutil.copy2(ROOT/'scripts/auditCharacterReferenceQuality.py',scriptBaseline)
if resume:
 # Reuse only completed, byte-bound commands. No prior timestamp or step is rewritten.
 originalBytes=(LOG/'result.json').read_bytes()
 result=json.loads(originalBytes)
 assert result.get('success') is None and result.get('finishedAt') is None
 assert 'resumption' not in result and 'finalWriteGate' not in result
 assert result['authorization']==authorization
 assert hashes(SOURCES)==result['sourceSha256Before']
 assert hashes(['package.json'])['package.json']==authorization['packageSha256']
 assert len(result['steps'])==2
 for index,step in enumerate(result['steps']):
  label,argv=COMMANDS[index]
  assert step['id']==label and step['argv']==argv and step['exitCode']==0
  assert step['log']==label+'.log'
  assert sha256((LOG/step['log']).read_bytes()).hexdigest()==step['logSha256']
  assert datetime.fromisoformat(step['startedAt'])<=datetime.fromisoformat(step['finishedAt'])
  previous=result['startedAt'] if index==0 else result['steps'][index-1]['finishedAt']
  assert datetime.fromisoformat(previous)<=datetime.fromisoformat(step['startedAt'])
 assert hashes([OUTPUTS[2]])[OUTPUTS[2]]==result['generatedSha256Before'][OUTPUTS[2]], 'Registry changed before authorized final writes.'
 assert sha256((LOG/'registry-before.json').read_bytes()).hexdigest()==result['generatedSha256Before'][OUTPUTS[2]]
 quality=json.loads((ROOT/OUTPUTS[1]).read_text())
 qualityFiles={entry['path']:entry for entry in quality['referenceFiles']}
 catalog=json.loads((ROOT/OUTPUTS[0]).read_text())
 catalogPaths={path for entry in catalog['entrees'] if entry['famille']=='arc-personnage' for path in entry.get('candidatsReferencesLocalesAudit',entry.get('referencesLocalesOpenAI',[]))}
 for ref in authorization['references']:
  assert ref['sheet'] in catalogPaths, 'Authorized reference absent from completed catalog refresh.'
  measured=qualityFiles[ref['sheet']]
  assert measured['classification']=='approved'
  assert measured['metrics']['fileSha256']==ref['sha256'], 'Completed audit does not bind the frozen reference.'
 resumedAt=now()
 archive=LOG/('interrupted-after-reference-audit-'+datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S%fZ'))
 archive.mkdir()
 (archive/'result.json').write_bytes(originalBytes)
 assert (archive/'result.json').read_bytes()==originalBytes
 result['resumption']={'mode':'resume-after-reference-audit','resumedAt':resumedAt,
  'archivedResult':{'path':str((archive/'result.json').relative_to(ROOT)),'sha256':sha256(originalBytes).hexdigest()},
  'originalStartedAt':result['startedAt'],'completedStepIds':[step['id'] for step in result['steps']],
  'runner':{'path':str(Path(__file__).resolve().relative_to(ROOT)),'sha256':sha256(Path(__file__).read_bytes()).hexdigest()},
  'verified':{'completedStepLogsAndArguments':True,'historicalSourcesAndPackageUnchanged':True,
    'frozenReferences':40,'qualityReportBindsFrozenReferences':True,'registryStillBeforeFinalWrites':True},
  'basis':'The environment was replaced after the real successful reference audit. Its two completed commands remain unchanged; only commands 3–5 resume after the separate root browser-closure gate.'}
 commands=COMMANDS[2:]
else:
 if (LOG/'result.json').exists():raise SystemExit('Existing execution must be preserved; use the explicit checked resume mode after step02.')
 result={'startedAt':now(),'authorization':authorization,'sourceSha256Before':hashes(SOURCES),'generatedSha256Before':hashes(OUTPUTS),'steps':[]}
 commands=COMMANDS

def save():(LOG/'result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
save()
for label,argv in commands:
 if label=='03-catalog-build':
  gate=LOG/'allow-final-writes.json'
  print(json.dumps({'event':'await-browser-freeze','gate':str(gate)}),flush=True)
  while not gate.exists() or json.loads(gate.read_text()).get('authorized') is not True:time.sleep(5)
  barrier=json.loads(gate.read_text())
  assert barrier.get('productionFrozen') is True and barrier.get('allBrowserWindowsClosed') is True
  assert barrier.get('rootFinalSignalReceived') is True
  assert datetime.fromisoformat(result['steps'][1]['finishedAt']) <= datetime.fromisoformat(barrier['createdAt'].replace('Z','+00:00'))
  frozen=barrier.get('productionFreeze',{})
  assert frozen.get('path') and frozen.get('sha256'), 'Root must bind the actual production freeze.'
  assert hashes([frozen['path']])[frozen['path']] == frozen['sha256'], 'Production-freeze receipt drift.'
  frozen_data=json.loads((ROOT/frozen['path']).read_text())
  assert frozen_data.get('productionFrozen') is True
  for path,digest in frozen_data['files'].items():
   assert hashes([path])[path] == digest, 'Frozen production input drift: '+path
  assert hashes(SOURCES)==result['sourceSha256Before']
  verify_references()
  result['finalWriteGate']=barrier;save()
 verify_references()
 start=time.monotonic();step={'id':label,'argv':argv,'startedAt':now(),'log':label+'.log','exitCode':None};result['steps'].append(step);save()
 print(json.dumps({'event':'start','step':label,'argv':argv}),flush=True)
 lines=[]
 with (LOG/step['log']).open('w',encoding='utf-8') as log:
  process=subprocess.Popen(argv,cwd=ROOT,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,bufsize=1)
  def read_output():
   for line in process.stdout:
    log.write(line);log.flush();lines.append(line.rstrip())
  reader=threading.Thread(target=read_output,daemon=True);reader.start()
  while True:
   try:code=process.wait(timeout=30);break
   except subprocess.TimeoutExpired:print(json.dumps({'event':'running','step':label,'elapsedSeconds':round(time.monotonic()-start,1),'latestOutput':lines[-2:]}),flush=True)
  reader.join()
 step.update({'finishedAt':now(),'elapsedSeconds':round(time.monotonic()-start,3),'exitCode':code,'logSha256':sha256((LOG/step['log']).read_bytes()).hexdigest()});save()
 print(json.dumps({'event':'finished',**step,'outputTail':lines[-12:]}),flush=True)
 if code:
  result.update({'finishedAt':now(),'success':False,'sourceSha256After':hashes(SOURCES)});save();sys.exit(code)
verify_references()
result.update({'finishedAt':now(),'success':True,'sourceSha256After':hashes(SOURCES),'generatedSha256After':hashes(OUTPUTS)})
result['sourceFilesUnchanged']=result['sourceSha256Before']==result['sourceSha256After'];save()
print(json.dumps({'event':'complete','success':True,'sourceFilesUnchanged':result['sourceFilesUnchanged'],'manifest':str(LOG/'result.json')}),flush=True)
