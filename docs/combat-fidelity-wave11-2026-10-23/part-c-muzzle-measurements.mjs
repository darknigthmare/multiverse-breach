import fs from'node:fs';import{createHash}from'node:crypto';import{createRequire}from'node:module';import assert from'node:assert/strict';
const root='/workspace/multiverse-breach',docs='docs/combat-fidelity-wave11-2026-10-23',sharp=createRequire(root+'/package.json')('sharp'),read=p=>fs.readFileSync(`${root}/${p}`),json=p=>JSON.parse(read(p)),hash=b=>createHash('sha256').update(b).digest('hex');
const entries=json('src/game/combat/characterAnimationsWave11PartC.generated.json').entries,points=json(`${docs}/part-c-anchor-points.json`),anchors={},measurements=[],grid=[];
for(const[id,phases]of Object.entries(points)){
 const e=entries.find(e=>e.heroId===id),{data,info}=await sharp(read(`public${e.sheet}`)).ensureAlpha().raw().toBuffer({resolveWithObject:true});anchors[id]={};
 for(const[phase,rowPoints]of Object.entries(phases)){
  anchors[id][phase]=rowPoints.map(p=>p?{x:p[0],y:p[1]}:null);
  for(const[column,p]of rowPoints.entries()){
   if(!p)continue;const[x,y]=p,row=e.phases[phase].row,roi=Buffer.alloc(9*9*4);let n=0,visible=0;
   for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const at=((row*256+y+dy)*info.width+column*256+x+dx)*4;data.copy(roi,n++*4,at,at+4);if(data[at+3]>24)visible++;}
   const at=((row*256+y)*info.width+column*256+x)*4,centerAlpha=data[at+3];assert.ok(centerAlpha>24,`${id}/${phase}/${column}: transparent emitter`);assert.ok(visible>=8);
   const roiPath=`${docs}/part-c-anchor-proofs/${id}-${phase}-${column}-rgba.png`;
   fs.writeFileSync(`${root}/${roiPath}`,await sharp(roi,{raw:{width:9,height:9,channels:4}}).png().toBuffer());
   const crop=await sharp(read(`public${e.sheet}`)).extract({left:column*256+x-20,top:row*256+y-14,width:40,height:28}).png().toBuffer();
   const marked=await sharp(crop).composite([{input:Buffer.from('<svg width="40" height="28"><path d="M17 14h6M20 11v6" stroke="#00ffff" stroke-width=".6"/></svg>')}]).flatten({background:'#26354a'}).png().toBuffer();
   grid.push({input:await sharp(marked).resize(200,140,{kernel:'nearest'}).png().toBuffer(),left:(measurements.length%6)*200,top:Math.floor(measurements.length/6)*140});
   measurements.push({heroId:id,universe:e.universe,phase,column,point:{x,y},centerAlpha,visiblePixels:visible,totalPixels:81,alphaThreshold:24,rgbaSha256:hash(roi),rgbaProof:roiPath,rgbaProofSha256:hash(read(roiPath)),normalizedPngSha256:e.sha256,measurementKind:'visually-located-real-firearm-muzzle',reason:'Visible terminal metal of the actual held rifle/shotgun, just inside barrel before flash/transparent fringe; not face, eye or free-floating flash. Recovery column3 is null. The recoil pose may tilt a physical barrel; no additional damage is asserted.'});
  }
 }
}
await sharp({create:{width:1200,height:Math.ceil(measurements.length/6)*140,channels:4,background:'#26354a'}}).composite(grid).png().toFile(`${root}/${docs}/part-c-anchor-proofs/muzzle-grid.png`);
fs.writeFileSync(`${root}/src/game/combat/nativeSuperAnchorsWave11PartC.generated.json`,JSON.stringify(anchors,null,2)+'\n');
fs.writeFileSync(`${root}/${docs}/part-c-muzzle-measurements.json`,JSON.stringify({schemaVersion:1,method:'Manual inspection of real normalized gun-barrel tips followed by strict center-alpha and actual9x9RGBA proof. Entire-cell renderer stature metadata is applied by the shared helper; these are unscaled local256px coordinates. Only four physical shooter supers have anchors; all six other characters are support/contact/area and deliberately absent.',canon1to1Verified:false,networkVerified:false,measurements},null,2)+'\n');console.log({measurements:measurements.length,minAlpha:Math.min(...measurements.map(v=>v.centerAlpha)),minVisible:Math.min(...measurements.map(v=>v.visiblePixels))});
