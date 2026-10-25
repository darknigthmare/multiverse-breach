// Independent validation of the delivered native poses, geometry, provenance and real hand pixels.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import sharp from 'sharp';
const hero='ripley';const check=process.argv.includes('--check');
const base='docs/combat-fidelity-wave13-2026-10-24',dir=`${base}/${hero}-sources`;
const read=async p=>JSON.parse(await fs.readFile(p,'utf8'));const sha=b=>crypto.createHash('sha256').update(b).digest('hex');
const cfg=await read(`${dir}/packing-plan.json`),motion=await read(`src/game/combat/${hero}MeleeMotion.generated.json`),combat=await read(`src/game/combat/${hero}MeleeCombat.generated.json`),entries=[...motion.entries,...combat.entries],calls=await read(`${dir}/actual-tool-calls.json`),hands=await read(`${dir}/hand-measurements.json`);
const review=await read(`${dir}/source-row-review.json`);
assert.equal(review.reviewed,true);assert.equal(review.rowsReviewed,45);assert.equal(review.nativePosesReviewed,180);
assert.equal(sha(await fs.readFile(cfg.reference.asset)),sha(await fs.readFile(cfg.reference.savedImage)),'Identity reference copy must preserve actual source pixels');
assert.equal(entries.length,6);assert.equal(motion.deliveredNativePoses,96);assert.equal(combat.deliveredNativePoses,84);assert.equal(new Set(entries.flatMap(e=>e.stateOrder)).size,45);
const unique=new Set(),scales=new Map(),proofs=[];
const samples=async(file,x,y)=>{const{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});let n=0;for(let yy=y-4;yy<=y+4;yy++)for(let xx=x-4;xx<=x+4;xx++){assert.ok(xx>=0&&yy>=0&&xx<info.width&&yy<info.height);n+=data[(yy*info.width+xx)*4+3]>24;}return n;};
for(const entry of entries){
 assert.equal(entry.heroId,cfg.heroId);assert.equal(entry.universe,cfg.universe);assert.equal(entry.canonicalVerified??entry.provenance.canonicalVerified,false);assert.equal(entry.provenance.model,null);assert.equal(entry.provenance.jobId,null);assert.equal(entry.provenance.generationId,null);assert.equal(entry.visualValidation.reviewed,true);assert.equal(entry.normalization.rowFit,false);
 const file='public'+entry.sheet,bytes=await fs.readFile(file);assert.equal(sha(bytes),entry.sha256);const{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});assert.equal(info.width,1024);assert.equal(info.height,2048);assert.equal(info.channels,4);
 assert.equal(entry.visualValidation.reviewEvidence.path,`${dir}/source-row-review.json`);
 assert.equal(entry.visualValidation.reviewEvidence.sha256,sha(await fs.readFile(entry.visualValidation.reviewEvidence.path)));
 assert.equal(review.atlasSha256[entry.sheet],entry.sha256,'Visual review must bind current public PNG');
 for(const [row,state]of entry.stateOrder.entries()){
  const selected=entry.normalization.frames.filter(f=>f.state===state);assert.equal(selected.length,4);assert.equal(new Set(selected.map(f=>f.sourceFrameRgbaSha256)).size,4);
  const calibration=entry.normalization.rows[row].statureCalibration;assert.ok(Math.abs(calibration.sourceStandingBodyHeight*calibration.scale*calibration.renderScale-190)<1e-8);assert.equal(calibration.sameScaleForEveryPoseInSource,true);assert.ok(calibration.excludesWeaponEffects);
  const known=scales.get(calibration.sourceImage);if(known)assert.deepEqual(known,[calibration.scale,calibration.renderScale]);else scales.set(calibration.sourceImage,[calibration.scale,calibration.renderScale]);
  for(const f of selected){assert.ok(!unique.has(f.sourceFrameRgbaSha256),'Repeated native pose across full45');unique.add(f.sourceFrameRgbaSha256);assert.equal(f.nativeColumn,f.frame);assert.ok(f.destinationRect.x>=10);assert.ok(f.destinationRect.y>=10);assert.ok(f.destinationRect.x+f.destinationRect.width<=246);assert.equal(f.destinationRect.y+f.destinationRect.height,244);
   const cell=await sharp(bytes).extract({left:f.frame*256,top:row*256,width:256,height:256}).raw().toBuffer();let n=0;for(let y=0;y<256;y++)for(let x=0;x<256;x++){if(cell[(y*256+x)*4+3]>=24){n++;assert.ok(x>=10&&x<246&&y>=10&&y<244,`${state}/${f.frame} unsafe alpha`);}}assert.ok(n>1000);
  }
 }
 for(let row=entry.activeRows;row<8;row++)for(let y=row*256;y<(row+1)*256;y++)for(let x=0;x<1024;x++)assert.equal(data[(y*1024+x)*4+3],0,'Unused row must be transparent');
 for(const source of entry.sourceImages)assert.equal(sha(await fs.readFile(source.path)),source.sha256);
 for(const prompt of entry.provenance.prompts)assert.equal(sha(await fs.readFile(prompt.path)),prompt.sha256);
 assert.equal(sha(await fs.readFile(`${dir}/actual-tool-calls.json`)),entry.provenance.actualToolCallsSha256);
 proofs.push({atlas:entry.id,states:entry.activeRows,nativePoses:entry.frames,sha256:entry.sha256});
}
assert.equal(unique.size,180);assert.equal(hands.reviewed,true);assert.equal(hands.requiredPalms,12);assert.equal(hands.requiredWrists,12);
let palms=0,wrists=0,contacts=0;const ledge=entries.find(e=>e.id.endsWith('-ledge'));
for(const[state,frames]of Object.entries(hands.states)){assert.equal(frames.length,4);for(const p of frames){assert.equal(p.contact,!(state==='ledgeCatch'&&p.frame===0));contacts+=p.contact;assert.ok(p.wrist&&p.sourcePalm&&p.wrist.sourcePoint);const row=ledge.stateOrder.indexOf(state);assert.ok(row>=0);const file='public'+ledge.sheet;
 const a=await samples(file,p.frame*256+p.x,row*256+p.y),b=await samples(file,p.frame*256+p.wrist.x,row*256+p.wrist.y),c=await samples(p.sourceImage,p.sourcePalm.x,p.sourcePalm.y),d=await samples(p.sourceImage,p.wrist.sourcePoint.x,p.wrist.sourcePoint.y);assert.equal(a,p.visibleNeighborhood9x9);assert.equal(b,p.wrist.visibleNeighborhood9x9);assert.equal(c,p.sourceVisibleNeighborhood9x9);assert.equal(d,p.wrist.sourceVisibleNeighborhood9x9);assert.ok(a>=60&&b>=60&&c>=60&&d>=60,'Actual hand/wrist ROI must contain visible native pixels');palms++;wrists++;
 }}assert.equal(palms,12);assert.equal(wrists,12);assert.equal(contacts,11);
for(const call of calls){assert.equal(call.model??null,null);assert.equal(call.jobId??null,null);assert.equal(call.generationId??null,null);if(call.savedSource){assert.equal(sha(await fs.readFile(call.savedSource)),call.sourceSha256);assert.equal(sha(await fs.readFile(call.promptFile)),call.promptFileSha256);assert.equal(call.observedNativePoses,(call.observedCompleteRowCounts||call.observedRowCounts).reduce((n,c)=>n+c,0));assert.equal(call.observedRowCounts.length,call.observedRows);}else{assert.ok(call.error||call.status==='error');assert.equal(call.observedNativePoses||0,0);}}
const before=await read(`${dir}/previous-thirteen-manifests-before.json`);const {getMeleeAnimationManifest}=await import('../../../src/game/melee/meleeAnimationManifest.js');
for(const[id,record]of Object.entries(before)){assert.deepEqual(getMeleeAnimationManifest(id),record.manifest,`Historical manifest changed: ${id}`);assert.equal(sha(JSON.stringify(getMeleeAnimationManifest(id))),record.sha256);}

const { MELEE_STATES } = await import('../../../src/game/melee/meleeStateMachine.js');
const { getMeleeAnimationFrame, validateMeleeAnimationManifest } = await import('../../../src/game/melee/meleeAnimationManifest.js');
const manifest = getMeleeAnimationManifest(hero);
assert.deepEqual(validateMeleeAnimationManifest(manifest), []);
assert.deepEqual(Object.keys(manifest.animations).sort(), [...MELEE_STATES].sort());
assert.equal(manifest.visualOnly, true); assert.equal(manifest.source1to1Verified, false);
const actualPackedHashes = new Set();
for (const entry of entries) for (const [row, state] of entry.stateOrder.entries()) {
  for (let frame=0;frame<4;frame++) {
    const sampled=getMeleeAnimationFrame(manifest,state,1000*(frame+0.05)/manifest.animations[state].fps);
    assert.equal(sampled.col,frame); assert.equal(sampled.row,row); assert.equal(sampled.animation.sheet,entry.sheet);
    const cell=await sharp('public'+entry.sheet).extract({left:frame*256,top:row*256,width:256,height:256}).raw().toBuffer();
    const digest=sha(cell); assert.ok(!actualPackedHashes.has(digest),'Duplicate actual packed RGBA cell'); actualPackedHashes.add(digest);
  }
  const selection=cfg.atlases.find(atlas=>atlas.id===entry.id).selection[state];
  const source=cfg.sources.find(source=>source.id===selection.sourceId);
  assert.equal(source.states[selection.row],state);
  for(const mapping of entry.normalization.frames.filter(frame=>frame.state===state)){
    const metadata=await sharp(mapping.sourceImage).metadata(),rect=mapping.sourceRect;
    assert.ok(rect.x>0&&rect.y>0&&rect.x+rect.width<metadata.width&&rect.y+rect.height<metadata.height,'Retained native pose touches source edge');
  }
}
assert.equal(actualPackedHashes.size,180);
for(const state of ['ledgeCatch','ledgeHang','ledgeClimb']) {
  assert.equal(manifest.anchorByFrame[state].length,4);
  for(let frame=0;frame<4;frame++) {
    const anchor=manifest.anchorByFrame[state][frame],point=hands.states[state][frame];
    assert.equal(anchor.measuredContact,true); assert.equal(anchor.attachToLedge,point.contact);
    assert.equal(anchor.x,point.normalizedX);assert.equal(anchor.y,point.normalizedY);
  }
}
const previousValidation=await read('docs/combat-fidelity-wave12-2026-10-23/validation.json');
let historicalSheetCount=0;
for(const [id,record]of Object.entries(before))for(const sheet of new Set(Object.values(record.manifest.animations).map(entry=>entry.sheet))){
  const old=previousValidation.distAssets.find(asset=>asset.sheet===sheet); assert.ok(old,id+': old sheet was not in baseline');
  assert.equal(sha(await fs.readFile('public'+sheet)),old.sha256);historicalSheetCount++;
}
assert.equal(historicalSheetCount,78);

const result={passed:true,heroId:cfg.heroId,atlases:6,states:45,nativePoses:180,distinctNativeRgbaFrames:unique.size,distinctPackedRgbaCells:actualPackedHashes.size,realSamplerCellsChecked:180,historicalManifestSheetsPreserved:historicalSheetCount,sourceWideCalibrations:scales.size,palms,wrists,contacts,historicalManifestsPreserved:Object.keys(before).length,actualToolAttempts:calls.length,successfulNativeCalls:calls.filter(c=>c.savedSource).length,observedNativePoses:calls.reduce((n,c)=>n+(c.observedNativePoses||0),0),discardedCompleteNativePoses:calls.reduce((n,c)=>n+(c.observedNativePoses||0),0)-180,unselectedCandidateBodies:calls.reduce((n,c)=>n+(c.observedSegmentedBodies||0),0)-180,incompleteCandidateBodies:calls.reduce((n,c)=>n+(c.observedSegmentedBodies||0)-(c.observedNativePoses||0),0),canonical1to1Verified:false,proofs};
const encoded=JSON.stringify(result,null,2)+'\n';if(check){assert.equal(await fs.readFile(`${dir}/verify-all-result.json`,'utf8'),encoded,'Stale independent validation result');}else await fs.writeFile(`${dir}/verify-all-result.json`,encoded);console.log(JSON.stringify(result));
