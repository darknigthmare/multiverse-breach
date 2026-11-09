import json,sys,datetime,shutil,hashlib
from pathlib import Path
p=Path('docs/combat-fidelity-wave17-2026-11-02/jade-sources');id=sys.argv[1]
if (p/(id+'.tool-receipt.json')).exists():raise SystemExit('Actual receipt already exists; do not overwrite')
v=json.loads(sys.argv[2]);src=Path(sys.argv[3]);r=json.loads((p/(id+'.actual-arguments.json')).read_text());dst=p/(id+'.native.png');shutil.copyfile(src,dst);r.update(completedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(),originalImage=str(src),savedSource=str(dst),sourceSha256=hashlib.sha256(dst.read_bytes()).hexdigest(),outputHint=v['output_hint'],returnedFields=v['returnedFields'],promptFile=str(p/(id+'.actual.prompt.txt')),status='returned-pending-technical-check');(p/(id+'.tool-receipt.json')).write_text(json.dumps(r,indent=2)+'\n');print(json.dumps({'id':id,'saved':str(dst),'sha256':r['sourceSha256']}))
