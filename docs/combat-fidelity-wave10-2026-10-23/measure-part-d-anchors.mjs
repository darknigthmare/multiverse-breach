import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const ROOT=path.resolve(import.meta.dirname,'../..'),DOCS='docs/combat-fidelity-wave10-2026-10-23';
const hash=data=>createHash('sha256').update(data).digest('hex');
const points={
 venkman_gb:{fatality:[null,{x:212,y:125},{x:202,y:129},null],super:[null,{x:212,y:96},{x:203,y:114},null]},
 stantz_gb:{fatality:[null,null,null,null],super:[null,null,null,null]},
 zeddemore_gb:{fatality:[null,{x:218,y:129},{x:203,y:136},null],super:[null,{x:208,y:126},{x:198,y:138},null]},
 spengler_gb:{fatality:[null,null,null,null],super:[null,null,null,null]},
 janine_gb:{fatality:[null,null,null,null],super:[null,null,null,null]},
 bill_l4d:{fatality:[null,null,null,null],super:[null,null,null,null]},
 ellis_l4d:{fatality:[null,null,null,null],super:[null,null,null,null]},
 coach_l4d:{fatality:[null,null,null,null],super:[null,null,null,null]},
 rochelle_l4d:{fatality:[null,null,null,null],super:[null,null,null,null]},
 nick_l4d:{fatality:[null,{x:238,y:81},{x:198,y:87},null],super:[null,{x:207,y:91},{x:192,y:102},null]}
};
const registry=JSON.parse(await fs.readFile(path.join(ROOT,'src/game/combat/characterAnimationsWave10PartD.generated.json')));
const measurements=[],tiles=[];
for(const[id,phases]of Object.entries(points)){
 const entry=registry.entries.find(e=>e.heroId===id),bytes=await fs.readFile(path.join(ROOT,'public'+entry.sheet)),{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 assert.equal(hash(bytes),entry.sha256);
 for(const[phase,columns]of Object.entries(phases))for(const[col,point]of columns.entries()){
  const row=entry.phases[phase]?.row ?? null;
  if(!point){measurements.push({heroId:id,phase,row,col,active:false,anchor:null,reason:row===null?'Dedicated phase unavailable: explicitly retained Janine24 only.':!['venkman_gb','zeddemore_gb','nick_l4d'].includes(id)?'Support equipment or gesture: no damaging weapon emitter.':col===0?'Preparation/lowered weapon: no active aim or discharge.':'Powered-down/lowered recovery: no active aim or discharge.'});continue;}
  const px=col*256+point.x,py=row*256+point.y,center=(py*info.width+px)*4,rgba=[...data.subarray(center,center+4)];let visible=0,opaque=0;
  const roi={left:px-4,top:py-4,width:9,height:9};
  for(let y=roi.top;y<roi.top+9;y++)for(let x=roi.left;x<roi.left+9;x++){const a=data[(y*info.width+x)*4+3];if(a>24)visible++;if(a>220)opaque++;}
  assert.ok(rgba[3]>24,`${id}/${phase}/${col}: chosen aperture must touch actual visible pixels`);assert.ok(visible>=20,`${id}/${phase}/${col}: aperture ROI lacks physical equipment`);
  const proof=`${DOCS}/part-d-anchor-proofs/${id}-${phase}-${col}-rgba.png`;
  const crop=await sharp(bytes).extract({left:px-12,top:py-12,width:25,height:25}).resize(200,200,{kernel:sharp.kernel.nearest}).flatten({background:'#172032'}).png().toBuffer();await fs.writeFile(path.join(ROOT,proof),crop);
  tiles.push({input:crop,left:(measurements.filter(m=>m.active).length%4)*200,top:Math.floor(measurements.filter(m=>m.active).length/4)*200});
  measurements.push({heroId:id,phase,row,col,active:true,anchor:point,normalized:{x:point.x/256,y:point.y/256},globalPixel:{x:px,y:py},rgba,roi,visiblePixels9x9:visible,opaquePixels9x9:opaque,proof,proofSha256:hash(crop),sheet:entry.sheet,sheetSha256:entry.sha256,renderScale:entry.normalization.rows[row].renderScale,equipment:id==='nick_l4d'?'Front physical aperture of the leading pistol. Second gun is a real offhand prop, not a second engine projectile.':'Front metal aperture of the handheld proton wand, connected to the backpack; no beam from the body.'});
 }
}
await sharp({create:{width:800,height:600,channels:4,background:'#172032'}}).composite(tiles).png().toFile(path.join(ROOT,`${DOCS}/part-d-anchor-proofs/muzzle-grid.png`));
await fs.writeFile(path.join(ROOT,'src/game/combat/nativeSuperAnchorsWave10PartD.generated.json'),JSON.stringify(points,null,2)+'\n');
await fs.writeFile(path.join(ROOT,`${DOCS}/part-d-anchor-measurements.json`),JSON.stringify({schemaVersion:1,method:'Pixel-inspected native weapon aperture, local256px cell coordinates. 9x9 RGBA proof around every active point; no inferred muzzle in preparation/recovery. Debug crops preserve the genuine native pixels.',bodyBaseline:244,source1to1Verified:false,measurements},null,2)+'\n');
console.log(JSON.stringify({heroes:10,phaseCells:80,activeMeasurements:measurements.filter(m=>m.active).length,measurements:measurements.filter(m=>m.active).map(m=>({id:m.heroId,phase:m.phase,col:m.col,anchor:m.anchor,rgba:m.rgba,visible:m.visiblePixels9x9}))}));
