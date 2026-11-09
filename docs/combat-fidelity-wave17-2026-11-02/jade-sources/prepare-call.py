import json,sys,datetime
from pathlib import Path
p=Path('docs/combat-fidelity-wave17-2026-11-02/jade-sources')
r=next(r for r in json.loads((p/'planned-tool-arguments.json').read_text()) if r['id']==sys.argv[1])
if (p/(r['id']+'.tool-receipt.json')).exists() or (p/(r['id']+'.actual-arguments.json')).exists():raise SystemExit('Actual attempt already exists; use a separately planned attempt ID rather than overwrite chronology')
start={'id':r['id'],'startedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'arguments':r['arguments'],'provider':'OpenAI','tool':'image_gen','model':None,'jobId':None,'generationId':None,'source1to1Verified':False}
(p/(r['id']+'.actual-arguments.json')).write_text(json.dumps(start,indent=2)+'\n')
(p/(r['id']+'.actual.prompt.txt')).write_text(r['arguments']['prompt']+'\n')
print(json.dumps(r['arguments']))
