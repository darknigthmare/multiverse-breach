import fs from'node:fs/promises';import{locateNativeRegions}from'./source-regions.mjs';
const dir=import.meta.dirname;const out=[];
for(const f of(await fs.readdir(dir+'/sources')).filter(f=>f.endsWith('-native-original.png'))){try{const p=await locateNativeRegions(dir+'/sources/'+f);const name=f.replace('-native-original.png','');await fs.writeFile(dir+'/sources/'+name+'-region-review.json',JSON.stringify(p,null,2)+'\n');out.push({id:name,ok:true,observed:p.sourceBodiesObserved,usable:p.retainedDrawings,missing:p.missingSlots});}catch(e){out.push({id:f,ok:false,error:e.message});}}
await fs.writeFile(dir+'/source-import-status.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify(out));
