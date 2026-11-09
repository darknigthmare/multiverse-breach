import fs from 'node:fs';
import sharp from 'sharp';
import {locateNativeRegions} from './source-regions.mjs';
const p='docs/combat-fidelity-wave17-2026-11-02/part-a/',results=[];
for(const name of fs.readdirSync(p+'sources').filter(n=>n.endsWith('-tool-result.json'))){
 const call=JSON.parse(fs.readFileSync(p+'sources/'+name));if(!call.kind||!call.archivedPath)continue;
 const b=fs.readFileSync(call.archivedPath),{data,info}=await sharp(b).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let edgeVisible=0;for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++)if((x===0||y===0||x===info.width-1||y===info.height-1)&&data[(y*info.width+x)*4+3]>24)edgeVisible++;
 let review,error;try{review=await locateNativeRegions(b,{rows:call.sourceRows||call.slots.length,columns:call.sourceColumns||4,excludedSlots:call.kind==='bald-three-eye-correction'?[4,7,10]:call.kind==='broken-horn-skull-correction'?[7]:[],groupComponentsByGrid:call.heroId==='rayman_rayman'});fs.writeFileSync(call.archivedPath.replace('.png','-region-review.json'),JSON.stringify(review,null,2)+'\n');}catch(e){error=e.message;}
 const result={heroId:call.heroId,kind:call.kind,size:[info.width,info.height],edgeVisible,observed:review?.sourceBodiesObserved,missingSlots:review?.missingSlots,error};results.push(result);console.log(JSON.stringify(result));
}
fs.writeFileSync(p+'corrective-source-geometry-progress.json',JSON.stringify({schemaVersion:1,checkedAt:new Date().toISOString(),sourceOnly:true,results},null,2)+'\n');
