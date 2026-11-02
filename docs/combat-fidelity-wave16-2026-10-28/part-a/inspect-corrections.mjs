import fs from 'node:fs';
import {locateNativeRegions} from './source-regions.mjs';
const p='docs/combat-fidelity-wave16-2026-10-28/part-a/';
const calls=fs.readFileSync(p+'correction-calls.ndjson','utf8').trim().split('\n').map(JSON.parse);
const counts={'top-rim-final-correction':8,'head-beam-correction':8,'layout-correction':48,'whip-correction':8,'victory-correction':4,'victory-super-correction':8,'shield-pal-correction':8,'defeat-super-correction':8,'ordinary-correction':4,'round-victory-correction':4,'appearance-correction':48,'captain-appearance-correction':48,'whip-final-correction':8};
for(const c of calls){const count=counts[c.kind];try{const r=await locateNativeRegions(fs.readFileSync(c.archivedPath),{rows:count===48?6:count/4,columns:count===48?8:4,groupComponentsByGrid:c.kind==='shield-pal-correction'});const f=c.archivedPath.replace('.png','-region-review.json');fs.writeFileSync(f,JSON.stringify(r,null,2)+'\n');console.log(JSON.stringify({heroId:c.heroId,kind:c.kind,observed:r.sourceBodiesObserved,components:r.sourceComponentsObserved,missing:r.missingSlots}));}catch(e){console.log(JSON.stringify({heroId:c.heroId,kind:c.kind,error:e.message}));}}
