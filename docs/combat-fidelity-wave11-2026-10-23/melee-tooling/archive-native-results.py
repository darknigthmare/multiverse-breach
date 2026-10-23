"""Archive exact image_gen bytes/arguments. Row counts are entered only after visual review."""
from pathlib import Path
from PIL import Image
import json,hashlib,shutil,base64
root=Path('/workspace/multiverse-breach');base=root/'docs/combat-fidelity-wave11-2026-10-23'
def h(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for hero in ['buffy','arthur']:
 d=base/(hero+'-sources');reviewPath=d/'source-row-review.json';reviews=json.loads(reviewPath.read_text()) if reviewPath.exists() else {};calls=[]
 plans=json.loads((d/'planned-tool-arguments.json').read_text())
 extra=d/'corrective-tool-arguments.json'
 if extra.exists():plans+=json.loads(extra.read_text())
 for plan in plans:
  metaPath=Path('/tmp/w11-'+plan['id']+'-native-result.json')
  if not metaPath.exists():continue
  m=json.loads(metaPath.read_text());dst=d/(plan['id']+'.native.png');source=m.get('sourcePath')
  if source:shutil.copy2(source,dst)
  elif m.get('inlineImageUrl','').startswith('data:image/png;base64,'):dst.write_bytes(base64.b64decode(m['inlineImageUrl'].split(',',1)[1]))
  saved=dst.exists();rel=str(dst.relative_to(root)) if saved else None;r=reviews.get(plan['id'],{});rows=r.get('observedRows');prompt=root/plan['promptFile'];refs=[{'path':path,'sha256':h(Path(path))} for path in plan['arguments'].get('referenced_image_paths',[])]
  record={k:v for k,v in m.items() if k not in ['inlineImageUrl']};record.update({'provider':'OpenAI','tool':'image_gen','model':m.get('model'),'jobId':m.get('jobId'),'generationId':m.get('generationId'),'date':'2026-10-23','savedSource':rel,'sourceSha256':h(dst) if saved else None,'dimensions':dict(zip(['width','height'],Image.open(dst).size)) if saved else None,'promptFile':plan['promptFile'],'promptFileSha256':h(prompt),'references':refs,'observedRows':rows,'observedNativePoses':rows*4 if rows else None,'review':r,'canonicalVerified':False,'canon1to1Verified':False,'nativeReviewStatus':'reviewed' if rows else 'pending'})
  if not source and saved:record['sourceRecovery']='Exact image_url PNG bytes base64-decoded without transformation; tool supplied no filesystem output path.'
  calls.append(record)
 (d/'actual-tool-calls.json').write_text(json.dumps(calls,indent=2,ensure_ascii=False)+'\n')
 print(hero,[{'id':c['id'],'saved':bool(c['savedSource']),'observedRows':c['observedRows']} for c in calls])
