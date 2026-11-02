import fs from'node:fs/promises';import path from'node:path';import sharp from'sharp';import assert from'node:assert/strict';import{createHash}from'node:crypto';
const root=path.resolve(import.meta.dirname,'../../..'),dir=import.meta.dirname,hash=b=>createHash('sha256').update(b).digest('hex'),r=JSON.parse(await fs.readFile(dir+'/native-muzzle-review-draft.json')),points=JSON.parse(await fs.readFile(dir+'/anchor-points-draft.json'));
assert.equal(r.points,256);assert.equal(r.pending.length,0);assert.equal(Object.keys(points).length,32);await fs.mkdir(dir+'/anchor-review/final',{recursive:true});
const contacts=[];
for(const[id,phases]of Object.entries(points)){
 const report=r.entries.filter(x=>x.heroId===id),e=report[0];assert.equal(hash(await fs.readFile(root+'/public'+e.sheet)),e.sheetSha256,'Native sheet changed after muzzle measurement');const composites=[];
 for(const[row,phase]of['fatality','super'].entries())for(let col=0;col<4;col++){
 const cell=report.find(x=>x.phase===phase&&x.column===col);assert.equal(hash(await fs.readFile(root+'/'+cell.cell)),cell.cellSha256);composites.push({input:await fs.readFile(root+'/'+cell.cell),left:col*256,top:40+row*256});}
 let svg=`<svg width="1024" height="552" xmlns="http://www.w3.org/2000/svg"><text x="5" y="17" fill="white" font-size="13">${id}: fatality(top), super(bottom); frame2 = release</text>`;
 for(const[row,phase]of['fatality','super'].entries())for(let col=0;col<4;col++){
  const point=phases[phase][col],x=col*256+point.x,y=40+row*256+point.y;svg+=`<rect x="${col*256}" y="${40+row*256}" width="256" height="256" fill="none" stroke="#666"/><path d="M${x-6} ${y}h12M${x} ${y-6}v12" stroke="#ff38e0" stroke-width="1"/><circle cx="${x}" cy="${y}" r="3.5" fill="none" stroke="#ffff62"/><text x="${col*256+5}" y="${40+row*256+18}" font-size="12" fill="#ffffaa">${phase} c${col} (${point.x},${point.y})</text>`;
 }svg+='</svg>';const out='docs/combat-fidelity-wave15-2026-10-26/part-a/anchor-review/final/'+id+'.png';await sharp({create:{width:1024,height:552,channels:4,background:'#182235'}}).composite([...composites,{input:Buffer.from(svg)}]).png().toFile(root+'/'+out);contacts.push({heroId:id,path:out,sha256:hash(await fs.readFile(root+'/'+out)),points:8});
}
await fs.writeFile(dir+'/native-muzzle-review.json',JSON.stringify({...r,visualReview:'Manual physical muzzle selection completed; awaiting independent review of32 marked grids.',contacts,source1to1Verified:false},null,2)+'\n');await fs.writeFile(root+'/src/game/combat/nativeSuperAnchorsWave15PartA.generated.json',JSON.stringify(points,null,2)+'\n');console.log(JSON.stringify({projectileHeroes:32,points:256,contacts:contacts.length,source1to1Verified:false}));
