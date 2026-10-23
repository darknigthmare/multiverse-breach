import fs from 'node:fs/promises';
import sharp from 'sharp';
import {fileURLToPath} from 'node:url';
const dir=new URL('../',import.meta.url), root=new URL('../../../',import.meta.url);
const {records}=JSON.parse(await fs.readFile(new URL('summon-generation-records.json',dir)));
const rows=[];
for(const record of records){
 const file=fileURLToPath(new URL('public/sprites/generated/summon-animations-wave9/'+record.slug+'.png',root));
 const parts=[];
 const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 for(const [r,phase]of ['preparation','attack'].entries())for(let col=0;col<4;col++){
  const p=record.effectAnchors[phase][col];if(!p)continue;
  const x=col*512+p.x,y=(r+1)*256+p.y;
  const bytes=await sharp(file).extract({left:x-20,top:y-20,width:40,height:40}).resize(160,160,{kernel:'nearest'}).png().toBuffer();
  const svg=Buffer.from('<svg width="160" height="160"><path d="M70 80h20M80 70v20" stroke="#ff54ee" stroke-width="1" fill="none"/><circle cx="80" cy="80" r="9" stroke="#ff54ee" stroke-width="1" fill="none"/></svg>');
  parts.push({input:await sharp(bytes).composite([{input:svg}]).png().toBuffer(),left:col*160,top:r*160});
  let opaque=0;for(let dy=-3;dy<=3;dy++)for(let dx=-3;dx<=3;dx++)if(data[((y+dy)*info.width+x+dx)*4+3]>24)opaque++;
  rows.push({slug:record.slug,phase,col,anchor:p,opaquePixelsIn7x7:opaque});
 }
 await sharp({create:{width:640,height:320,channels:4,background:'#1a2130'}}).composite(parts).png().toFile(fileURLToPath(new URL('summon-anchor-proofs/'+record.slug+'-orifice-review.png',dir)));
}
await fs.writeFile(new URL('summon-anchor-proofs/review.json',dir),JSON.stringify({method:'Manual inspection of packed native barrel openings; crop/crosshair is QA only, runtime PNG bytes untouched.',rows,source1to1Verified:false},null,2)+'\n');
console.log(JSON.stringify({anchors:rows.length,emptyNeighborhoods:rows.filter(r=>!r.opaquePixelsIn7x7)}));
