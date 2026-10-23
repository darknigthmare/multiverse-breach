#!/usr/bin/env python3
"""Authorized Wave10 Rift refresh; historical scripts and thresholds untouched."""
from datetime import datetime, timezone
from hashlib import sha256
import json
from pathlib import Path
import subprocess
import sys
import threading
import time

ROOT=Path('/workspace/multiverse-breach')
LOG=ROOT/'docs/combat-fidelity-wave10-2026-10-23/rift-refresh'
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
LOG.mkdir(parents=True,exist_ok=True)
authorizationPath=LOG/'authorization.json'
if not authorizationPath.exists():raise SystemExit('Root base-freeze authorization is required; preparation only.')
authorization=json.loads(authorizationPath.read_text())
if authorization.get('authorized') is not True:raise SystemExit('Root base freeze is not authorized.')
resume='--resume-python' in sys.argv
if resume:
 result=json.loads((LOG/'result.json').read_text())
 if len(result['steps'])!=2 or result['steps'][0]['exitCode']!=0 or result['steps'][1]['exitCode']==0:raise SystemExit('Expected precisely a successful catalog refresh and the archived failed Python audit.')
 result['failedAttempts']=[result['steps'][1]]
 result['steps']=result['steps'][:1]
 result['firstAttemptArchive']='first-attempt-known-retired-reference'
 result['resumedAt']=now()
 result['sourceSha256AtResume']=hashes(SOURCES)
 result['resumeReason']='Root approved separate historical known-case verification for retired Freeman PNG; current reference audit retains1912 count and unchanged quality thresholds.'
 result.pop('finishedAt',None);result.pop('success',None);result.pop('sourceSha256After',None)
 COMMANDS=COMMANDS[1:]
else:
 result={'startedAt':now(),'authorization':authorization,'sourceSha256Before':hashes(SOURCES),'generatedSha256Before':hashes(OUTPUTS),'steps':[]}

def save():(LOG/'result.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
save()
for label,argv in COMMANDS:
 if label=='03-catalog-build':
  gate=LOG/'allow-final-writes.json'
  print(json.dumps({'event':'await-browser-freeze','gate':str(gate)}),flush=True)
  while not gate.exists() or json.loads(gate.read_text()).get('authorized') is not True:time.sleep(5)
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
result.update({'finishedAt':now(),'success':True,'sourceSha256After':hashes(SOURCES),'generatedSha256After':hashes(OUTPUTS)})
result['sourceFilesUnchanged']=result['sourceSha256Before']==result['sourceSha256After'];save()
print(json.dumps({'event':'complete','success':True,'sourceFilesUnchanged':result['sourceFilesUnchanged'],'manifest':str(LOG/'result.json')}),flush=True)
