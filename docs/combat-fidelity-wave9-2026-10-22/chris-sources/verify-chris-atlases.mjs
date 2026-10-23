import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';

const docs = 'docs/combat-fidelity-wave9-2026-10-22/chris-sources';
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const entries = [], cells = [], projections = [], sources = new Map();
for (const batch of ['Motion','Combat']) {
  const registry = JSON.parse(await fs.readFile(`src/game/combat/chrisMelee${batch}.generated.json`));
  assert.deepEqual(registry, JSON.parse(await fs.readFile(`${docs}/provenance-${batch.toLowerCase()}.json`)));
  assert.equal(registry.deliveredNativePoses, batch === 'Motion' ? 96 : 84);
  assert.equal(registry.nativeGenerationCalls, batch === 'Motion' ? 4 : 5); assert.equal(registry.uniqueFull45NativeGenerationCalls,8); assert.equal(registry.canon1to1Verified, false);
  entries.push(...registry.entries);
}
assert.equal(entries.length, 6); assert.equal(entries.reduce((n,e)=>n+e.activeRows,0),45);
assert.equal(new Set(entries.flatMap(e=>e.stateOrder)).size,45);
for (const entry of entries) {
  const bytes = await fs.readFile('public'+entry.sheet), {data,info} = await sharp(bytes).raw().toBuffer({resolveWithObject:true});
  assert.equal(hash(bytes),entry.sha256); assert.deepEqual([info.width,info.height,info.channels],[1024,2048,4]);
  assert.equal(entry.heroId,'chris_redfield'); assert.equal(entry.universe,'Resident Evil');
  assert.equal(entry.visualValidation.reviewed,true); assert.equal(entry.visualValidation.handContactsReviewed,true);
  assert.equal(entry.provenance.model,null); assert.equal(entry.provenance.jobId,null); assert.equal(entry.provenance.generationId,null);
  assert.equal(entry.provenance.canonicalVerified,false); assert.equal(entry.provenance.canon1to1Verified,false);
  assert.equal(entry.normalization.rowFit,false); assert.equal(entry.normalization.sharedScalePerSource,true);
  assert.deepEqual(Object.values(entry.normalization.sourceCanvasEdgePixels),[0,0,0,0]);
  for(const calibration of entry.normalization.sourceStatureCalibration) {
    assert.ok(Math.abs(calibration.sourceStandingBodyHeight*calibration.scale*calibration.renderScale-190)<1e-9);
    if(sources.has(calibration.sourceImage))assert.deepEqual(sources.get(calibration.sourceImage),calibration);
    else sources.set(calibration.sourceImage,calibration);
  }
  for(const row of entry.normalization.rows) {
    const calibration=sources.get(row.sourceImage);
    assert.equal(row.scale,calibration.scale);assert.equal(row.renderScale,calibration.renderScale);
    assert.equal(entry.states[row.state].renderScale,calibration.renderScale);
    for(const [column,frame] of row.frameBounds.entries()) {
      assert.equal(frame.output.width,Math.round(frame.source.width*calibration.scale));
      assert.equal(frame.output.height,Math.round(frame.source.height*calibration.scale));
      if(['crouchIdle','crouchCharge','crouchLight','chargeLoop'].includes(row.state)) {
        assert.ok(frame.source.height<calibration.sourceStandingBodyHeight);
        projections.push({state:row.state,column,nativeHeight:frame.source.height,normalizedHeight:frame.output.height,
          effectiveHeight:frame.source.height*calibration.scale*calibration.renderScale,standingHeight:190});
      }
    }
  }
  for(let row=0;row<8;row++)for(let column=0;column<4;column++) {
    const rgba=Buffer.alloc(256*256*4); let visible=0,x0=256,y0=256,x1=-1,y1=-1;
    for(let y=0;y<256;y++)for(let x=0;x<256;x++) {
      const at=((row*256+y)*info.width+column*256+x)*4, to=(y*256+x)*4;
      data.copy(rgba,to,at,at+4); if(!data[at+3])continue;
      visible++; x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);
      assert.ok(x>=10&&x<246&&y>=10&&y<246,`${entry.id}/${row}/${column} unsafe margin`);
    }
    if(row>=entry.activeRows) {assert.equal(visible,0);continue;}
    assert.ok(visible>1000);
    cells.push({atlas:entry.id,state:entry.stateOrder[row],column,visiblePixels:visible,
      alphaBounds:{x:x0,y:y0,width:x1-x0+1,height:y1-y0+1},sha256:hash(rgba)});
  }
}
assert.equal(cells.length,180);assert.equal(new Set(cells.map(cell=>cell.sha256)).size,180);
const ledge=entries.find(e=>e.id==='chris-ledge'), measurements=ledge.normalization.contactAnchorMeasurements;
const {data,info}=await sharp('public'+ledge.sheet).raw().toBuffer({resolveWithObject:true});
const readRoi=(row,column,point)=>{
  const rgba=Buffer.alloc(9*9*4);let visible=0,skin=0,cuff=0,glove=0;
  for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++) {
    const at=((row*256+point.y+dy)*info.width+column*256+point.x+dx)*4;
    data.copy(rgba,((dy+4)*9+dx+4)*4,at,at+4);const[r,g,b,a]=data.subarray(at,at+4);
    if(a<24)continue; visible++;
    if(Math.max(r,g,b)<110&&Math.max(r,g,b)-Math.min(r,g,b)<45)glove++;
    if(r>85&&r>g+12&&g>b+8)skin++;
    if(Math.min(r,g,b)>60&&Math.max(r,g,b)-Math.min(r,g,b)<45||r>70&&g<90&&b<90)cuff++;
  }
  return{rgba,visible,skin,cuff,glove,sha256:hash(rgba)};
};
const contacts=[];
const nativeHandChecks=[];
for(const state of ['ledgeCatch','ledgeHang','ledgeClimb'])for(const point of measurements[state]) {
  const row=ledge.states[state].row,palm=readRoi(row,point.frame,point),wrist=readRoi(row,point.frame,point.wrist);
  assert.equal(palm.visible,81);assert.ok(palm.glove>=50);assert.equal(wrist.visible,81);assert.ok(wrist.glove>=40);
  assert.equal(point.normalizedX,point.x/256);assert.equal(point.normalizedY,point.y/256);
  assert.equal(point.wrist.normalizedX,point.wrist.x/256);assert.equal(point.wrist.normalizedY,point.wrist.y/256);
  assert.equal(point.contact,state!=='ledgeCatch'||point.frame!==0);
  const source=await sharp(point.sourceImage).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(const[kind,nativePoint]of [['palm',point.sourcePalm],['wrist',point.wrist.sourcePoint]]) {
    let nativeVisible=0;
    for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++) {
      const at=((nativePoint.y+dy)*source.info.width+nativePoint.x+dx)*4;
      if(source.data[at+3]>=24)nativeVisible++;
    }
    assert.equal(nativeVisible,81,`${state}/${point.frame}/${kind} native hand neighborhood`);
    nativeHandChecks.push({state,frame:point.frame,kind,sourceImage:point.sourceImage,nativePoint,visiblePixels:nativeVisible});
  }
  const files={};
  for(const[kind,roi]of [['palm',palm],['wrist',wrist]]) {
    const file=`${docs}/roi-${state}-${point.frame}-${kind}.png`;
    const png=await sharp(roi.rgba,{raw:{width:9,height:9,channels:4}}).png().toBuffer();await fs.writeFile(file,png);
    files[kind]={path:file,sha256:hash(png),rgbaSha256:roi.sha256,visiblePixels:roi.visible,skinPixels:roi.skin,darkGlovePixels:roi.glove};
  }
  // Annotation belongs only to a documentation crop, never the served atlas.
  const mark=`<svg width="512" height="512"><rect x="${(point.x-4)*2}" y="${(point.y-4)*2}" width="18" height="18" fill="none" stroke="#21ff82"/><rect x="${(point.wrist.x-4)*2}" y="${(point.wrist.y-4)*2}" width="18" height="18" fill="none" stroke="#ffe254"/></svg>`;
  await sharp('public'+ledge.sheet).extract({left:point.frame*256,top:row*256,width:256,height:256}).flatten({background:'#a3b0bb'}).resize(512,512,{kernel:'nearest'}).composite([{input:Buffer.from(mark)}]).png().toFile(`${docs}/grip-${state}-${point.frame}-review.png`);
  contacts.push({state,frame:point.frame,x:point.x,y:point.y,contact:point.contact,wrist:{x:point.wrist.x,y:point.wrist.y},...files,passed:true});
}
assert.equal(contacts.length,12);assert.equal(contacts.filter(point=>point.contact).length,11);
assert.deepEqual(measurements.ledgeDrop.map(p=>p.contact),[true,true,false,false]);
assert.deepEqual(measurements.ledgeJump.map(p=>p.contact),[true,false,false,false]);
const calls=JSON.parse(await fs.readFile(`${docs}/actual-tool-calls.json`));assert.equal(calls.length,8);
for(const call of calls) {
  assert.equal(call.model,null);assert.equal(call.jobId,null);assert.equal(call.generationId,null);
  assert.equal(hash(Buffer.from(call.arguments.prompt)),call.promptSha256);
  assert.equal(hash(await fs.readFile(call.savedSource)),call.sourceSha256);
  assert.equal(hash(await fs.readFile(call.promptFile)),call.promptFileSha256);
  for(const ref of call.references)assert.equal(hash(await fs.readFile(ref.path)),ref.sha256);
}
const proof={date:'2026-10-22',heroId:'chris_redfield',sourceWork:'Resident Evil 5 (2009)',nativeGenerationCalls:8,nativeSourceDrawings:200,discardedNativePoses:20,selectedNativePoses:180,
  states:45,atlases:6,standingBodyHeight:190,sourceWideScaleOnly:true,calibratedSources:[...sources.values()],
  uniqueRawCells:180,transparentMargins10:true,reservedEmptyCells:12,source1to1Verified:false,
  handMeasurements:{requiredPalms:12,requiredWrists:12,rgbaRois:24,acceptedContacts:11,precontact:'ledgeCatch/0',allVisible81of81:true,contacts},projections,cells};
proof.handMeasurements.nativeHandChecks=nativeHandChecks;
await fs.writeFile(`${docs}/validation-all.json`,JSON.stringify(proof,null,2)+'\n');
await fs.writeFile(`${docs}/grip-pixel-checks.json`,JSON.stringify(proof.handMeasurements,null,2)+'\n');
console.log(JSON.stringify({passed:true,states:45,nativePoses:180,uniqueRawCells:180,atlases:6,standingBodyHeight:190,measuredPalms:12,measuredWrists:12,all24RoisVisible81of81:true,acceptedContacts:11,sourceGenerationCalls:8}));
