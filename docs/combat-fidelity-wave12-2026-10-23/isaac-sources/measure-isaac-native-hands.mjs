import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const dir='docs/combat-fidelity-wave12-2026-10-23/isaac-sources';
const check=process.argv.includes('--check');
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));
const points=await read(`${dir}/native-hand-points.json`);
const registry=await read('src/game/combat/isaacMeleeCombat.generated.json');
const ledge=registry.entries.find(entry=>entry.id==='isaac-ledge'),cache=new Map();
async function pixels(file,x,y) {
 if(!cache.has(file))cache.set(file,await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true}));
 const {data,info}=cache.get(file);let count=0;
 for(let yy=y-4;yy<=y+4;yy++)for(let xx=x-4;xx<=x+4;xx++){
  assert.ok(xx>=0&&yy>=0&&xx<info.width&&yy<info.height);
  count+=data[(yy*info.width+xx)*4+3]>24;
 }
 return count;
}
async function mapPoint(frame,row,sourcePoint) {
 const r=frame.sourceRect,d=frame.destinationRect;
 const x=Math.round(d.x+(sourcePoint[0]-r.x+.5)*d.width/r.width-.5);
 const y=Math.round(d.y+(sourcePoint[1]-r.y+.5)*d.height/r.height-.5);
 const visible=await pixels('public'+ledge.sheet,frame.frame*256+x,row*256+y);
 const sourceVisible=await pixels(frame.sourceImage,...sourcePoint);
 assert.ok(visible>=60&&sourceVisible>=60,'Manually measured native glove/wrist must have opaque9x9 support');
 return {x,y,normalizedX:x/256,normalizedY:y/256,visibleNeighborhood9x9:visible,sourceVisibleNeighborhood9x9:sourceVisible,sourcePoint:{x:sourcePoint[0],y:sourcePoint[1]},localRefinement:{x:0,y:0}};
}
const result={date:'2026-10-23',heroId:'isaac',sourceWork:'Dead Space (2008), level3 engineering RIG',reviewed:points.reviewed,source1to1Verified:false,method:'Manual native glove/wrist localization; exact nearest-neighbor source-to-packed mapping using destination dimensions, no image redrawing and no point search away from the measured anatomy.',requiredPalms:12,requiredWrists:12,requiredContacts:11,states:{}};
for(const [state,measured] of Object.entries(points.states)){
 const row=ledge.stateOrder.indexOf(state);assert.ok(row>=0);
 result.states[state]=[];
 for(const [index,point] of measured.entries()){
  const frame=ledge.normalization.frames.find(f=>f.state===state&&f.frame===index);
  const p=await mapPoint(frame,row,point.palm),w=await mapPoint(frame,row,point.wrist);
  result.states[state].push({x:p.x,y:p.y,normalizedX:p.normalizedX,normalizedY:p.normalizedY,visibleNeighborhood9x9:p.visibleNeighborhood9x9,sourceVisibleNeighborhood9x9:p.sourceVisibleNeighborhood9x9,frame:index,contact:!(state==='ledgeCatch'&&index===0),baseline:'ledgeGrip',sourceImage:frame.sourceImage,sourcePalm:p.sourcePoint,wrist:w,localRefinement:p.localRefinement,measurement:'Visible leading armored glove palm connected through actual native wrist/arm. No assertion of hidden anatomical handedness.'});
 }
}
const encoded=JSON.stringify(result,null,2)+'\n',target=`${dir}/hand-measurements.json`;
if(check)assert.equal(await fs.readFile(target,'utf8'),encoded);else await fs.writeFile(target,encoded);
console.log(JSON.stringify({passed:true,check,palms:12,wrists:12,contacts:11,packedCounts:Object.values(result.states).flat().map(p=>[p.visibleNeighborhood9x9,p.wrist.visibleNeighborhood9x9]),sourceCounts:Object.values(result.states).flat().map(p=>[p.sourceVisibleNeighborhood9x9,p.wrist.sourceVisibleNeighborhood9x9])}));
