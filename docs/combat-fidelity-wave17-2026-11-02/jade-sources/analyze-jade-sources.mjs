import fs from 'node:fs/promises';
import {importJadeSource} from './native-jade-regions.mjs';
const dir='docs/combat-fidelity-wave17-2026-11-02/jade-sources';
for(const id of ['jade-motion-a','jade-motion-b','jade-defense','jade-correction-a','jade-combat-a-1','jade-combat-a-2','jade-combat-b-1','jade-combat-b-2','jade-ledge-1','jade-ledge-2']){
 const rows=['jade-motion-a'].includes(id)?8:['jade-motion-b','jade-defense'].includes(id)?7:4;
 try{const s=await importJadeSource(dir+'/'+id+'.native.png',rows,{groupComponentsByGrid:id==='jade-combat-a-2',...(id==='jade-defense'?{minimumBodyHeight:24}:{})});const report={...s,frames:s.frames.map(({raw,...f})=>f)};await fs.writeFile(dir+'/'+id+'.region-review.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({id,width:s.width,height:s.height,large:s.largeComponents,frames:s.frames.length,clipped:s.frames.filter(f=>f.canvasClipped).map(f=>[f.nativeRow,f.nativeColumn]),bounds:s.frames.map(f=>f.sourceRect)}));}catch(e){console.error(id+': '+e.message);process.exitCode=1;}
}
