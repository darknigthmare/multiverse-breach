import json,hashlib,subprocess,datetime,os
from pathlib import Path
root=Path('/workspace/multiverse-breach');out=Path('/tmp/p0-p1-cg-snapshot-20261113')
files=set()
for folder in ['src/game','DLC']:
 for p in (root/folder).rglob('*'):
  if p.is_file() and (p.suffix=='.js' or p.name in ['distribution.json','manifest.json','cgRosterArtwork.generated.json','cgRevisions.generated.json']):files.add(p)
for folder in ['docs/cg','docs/rift-dossiers/references']:
 for p in (root/folder).rglob('*.json'):
  if p.is_file():files.add(p)
for name in ['README.md','docs/rift-dossiers/catalog.json','docs/cg/roster-production-2026-10-18.json','docs/cg/roster-production-2026-10-18.md','public/cg/cg-manifest.json','docs/audits/fidelity-p0-wave4-2026-10-01.json','scripts/buildCgRosterProductionPlan.mjs','scripts/cgSourceEvidence.mjs','scripts/cgPublishedDeliveryMetadata.mjs','scripts/cgRosterPlanSnapshot.mjs','scripts/sourceSceneTestLoader.mjs']:
 files.add(root/name)
files=sorted(files)
def snap():return {str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
before=snap();(out/'inputs-before.json').write_text(json.dumps(before,indent=2)+'\n')
node=next(Path('/tmp/p0-p1-npm-cache/_npx').glob('*/node_modules/node/bin/node'))
env=os.environ.copy();env['NODE_OPTIONS']='--max-old-space-size=4096';env['PATH']=str(node.parent)+':'+env['PATH']
command=['taskset','--cpu-list','2,3',str(node),'--experimental-loader',str(root/'scripts/sourceSceneTestLoader.mjs'),str(out/'capture.mjs')]
start=datetime.datetime.now(datetime.timezone.utc).isoformat()
with (out/'capture.log').open('wb') as log:r=subprocess.run(command,cwd=root,env=env,stdout=log,stderr=subprocess.STDOUT)
after=snap();(out/'inputs-after.json').write_text(json.dumps(after,indent=2)+'\n')
changed=[p for p in before if before[p]!=after[p]]
receipt={'startedAt':start,'endedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'command':command,'exitCode':r.returncode,'inputFileCount':len(files),'changedInputs':changed,'stable':not changed,'validationScope':'metadata-only','physicalMediaChecked':False,'prebuildBypassed':True,'staticMediaCopied':False}
(out/'capture-exit.json').write_text(json.dumps(receipt,indent=2)+'\n');print(json.dumps(receipt),flush=True)
if r.returncode:print((out/'capture.log').read_text()[-4000:])
