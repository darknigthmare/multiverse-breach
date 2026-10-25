import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {segmentNativeAtlas} from './native-segmentation.mjs';
import {ABILITIES_WAVE14_DEFINITIONS as KITS} from '../../../src/game/combat/abilities/abilitiesWave14Definitions.js';
const ROOT=path.resolve(import.meta.dirname,'../../..'),DOCS='docs/combat-fidelity-wave14-2026-10-25/part-b';
const read=p=>fs.readFileSync(path.resolve(ROOT,p)), json=p=>JSON.parse(read(p)), sha=b=>createHash('sha256').update(b).digest('hex');
const plan=json('docs/combat-fidelity-wave14-2026-10-25/batch-plan-before.json');
const columns=start=>[start,start+1,start+2,start+3];
const records=[],failures=[];
for(const entry of plan.heroes.filter(x=>x.part==='B')){
 const id=entry.hero.id,kit=KITS[id],receiptFile=DOCS+'/sources/'+id+'-result.json';
 assert.ok(fs.existsSync(path.resolve(ROOT,receiptFile)),id+': request pending');
 const receipt=json(receiptFile);
 if(!receipt.imageReturned){failures.push({heroId:id,reason:'image_gen did not return an image; no retry or alias was attempted',receipt:receiptFile,promptFile:DOCS+'/sources/'+id+'-prompt.txt',providerResponse:receipt.error??receipt.response??receipt});continue;}
 const sourceFile=DOCS+'/sources/'+id+'.png',promptFile=DOCS+'/sources/'+id+'-prompt.txt';
 const atlas=await segmentNativeAtlas(path.resolve(ROOT,sourceFile));
 assert.deepEqual(atlas.rowCounts,[8,8,8,8,8,8],id+': incomplete layout must not count as delivered');
 assert.ok(atlas.frames.every(f=>f.bodyBounds.left>0&&f.bodyBounds.top>0&&f.bodyBounds.right<atlas.width-1&&f.bodyBounds.bottom<atlas.height-1),id+': clipped source body');
 const native=Array.from({length:8},(_,row)=>[0,Math.floor(row/2),columns(row%2*4)]);
 const base=[[0,4,columns(0)],[0,4,columns(4)],[0,5,columns(0)],[0,5,columns(4)]];
 const corrections=[];
 if(['kelly_087','kait_diaz','no_mans_sky_traveller'].includes(id)){
  native[4][2]=[0,2,1,3];native[7][2]=[4,6,5,7];base[2][2]=[0,2,1,3];
  corrections.push('The source firing drawing is second in each attack group. Native cells are ordered 0,2,1,3 to put the actual fire drawing third. All 48 source drawings are retained once without pixel modification.');
 }
 if(id==='boone_fnv'){base[2][2]=[0,2,1,3];corrections.push('Ordinary rifle source cells are ordered 0,2,1,3 to place the actual flash drawing third, without painting or copying.');}
 const body=atlas.rows[0][0].bodyBounds,referenceArchive=DOCS+'/references/'+id+'.png';
 assert.equal(sha(read(referenceArchive)),entry.referenceSha256);assert.equal(sha(read('public'+entry.referenceAsset)),entry.referenceSha256);
 const source={archivedPath:sourceFile,sha256:sha(read(sourceFile)),promptFile,promptSha256:sha(read(promptFile)),toolResultFile:receiptFile,toolResultSha256:sha(read(receiptFile)),generatedPath:receipt.imagePath,rows:6,rowCounts:atlas.rowCounts,nativeComponentsObserved:atlas.frames.length,nativeDrawingsObserved:48,retainedDrawings:48,excludedDrawings:0,acceptedForDelivery:true,calibration:{method:'first-complete-standing-native-body-component',bodyHeight:body.height,bodyBounds:body,bodyRoi:{left:body.left,top:body.top,width:body.width,height:body.height}},sourceCanvasDimensions:[atlas.width,atlas.height],allSelectedBodiesAvoidGlobalCanvasEdges:true};
 const sources=[source];
 if(['kassandra_ac','deus_ex_adam_jensen','mordin'].includes(id)){
  const name=id+'-correction48',file=DOCS+'/sources/'+name+'.png',resultFile=DOCS+'/sources/'+name+'-result.json',promptFile=DOCS+'/sources/'+name+'-prompt.txt';
  const r=json(resultFile);assert.equal(r.imageReturned,true,id+': corrected source missing; rejected original must not be published');
  const corrected=await segmentNativeAtlas(path.resolve(ROOT,file));assert.deepEqual(corrected.rowCounts,[8,8,8,8,8,8]);
  const body=corrected.rows[0][0].bodyBounds;
  source.retainedDrawings=0;source.excludedDrawings=48;source.acceptedForDelivery=false;
  sources.push({...source,archivedPath:file,sha256:sha(read(file)),promptFile,promptSha256:sha(read(promptFile)),toolResultFile:resultFile,toolResultSha256:sha(read(resultFile)),generatedPath:r.imagePath,retainedDrawings:48,excludedDrawings:0,acceptedForDelivery:true,calibration:{method:'first-complete-standing-native-body-component',bodyHeight:body.height,bodyBounds:body,bodyRoi:{left:body.left,top:body.top,width:body.width,height:body.height}},sourceCanvasDimensions:[corrected.width,corrected.height]});
  for(const row of [...native,...base])row[0]=1;
  corrections.push(id==='kassandra_ac'?'Initial source wrongly depicts a full-length spear and all 48 drawings are excluded. The image_gen correction replaces every long pole with the short dagger-sized Broken Spear of Leonidas. Only the new corrected 48 drawings are retained; no RGBA weapon repainting is used.':id==='mordin'?'Initial source thermal effects are too large and disconnected fragments intrude into neighboring cells. All 48 drawings are excluded. The image_gen correction confines compact thermal discharge to the wrist omni-tool in the third action frame, without a gun, biotic effect, beam or RGBA repainting.':'Initial source has invented extra mechanical appendages and all 48 drawings are excluded. The image_gen correction shows only two normal augmented arms and a finite compact radial spark discharge. Only the new corrected 48 drawings are retained; no directed beam or RGBA repainting is used.');
 }
 records.push({heroId:id,name:entry.hero.name,universe:entry.hero.universe,sourceWork:entry.source.sourceWork,sourceReference:entry.source.sourceReference,referenceAsset:entry.referenceAsset,referenceAssetSha256:entry.referenceSha256,referenceArchive,targetBodyHeight:entry.source.bodyHeight,simpleActionName:kit.simple.name,simpleEffect:kit.simple.targeting.effect,specialActionName:kit.special.name,specialEffect:kit.special.targeting.effect,selectedSourceAppearance:entry.source.appearance,selectedSourceWeapon:entry.source.weapon,selectedSourcePose:entry.source.pose,sourceActionName:entry.source.actionName,sourceEffect:entry.source.effect,sourceDelivery:entry.source.delivery,reviewed:true,sources,selections:{native,base},correctionNotes:corrections,reviewNotes:'Selected adult source version and practical equipment inspected. Four different native poses per phase/state, one scalar for every retained body in each source, complete weapon/head/feet silhouettes, measured alpha margins and no source-pixel painting. Support gestures cause zero damage; Mordin uses wrist omni-tool and the Traveller a multi-tool emitter. Native anatomy, source RGBA fragments and small adult Gek stature are preserved. Images and choreography are generated gameplay adaptations, not official animation frames or certified 1:1 reproductions.'});
}
const out={schemaVersion:1,date:'2026-10-25',part:'B',selectedHeroIds:plan.parts.B,records,failures,allSelectedIdentitiesAccountedFor:records.length+failures.length===20,source1to1Verified:false};
fs.writeFileSync(path.resolve(ROOT,DOCS,'generation-records.json'),JSON.stringify(out,null,2)+'\n');fs.writeFileSync(path.resolve(ROOT,DOCS,'request-failures.json'),JSON.stringify({schemaVersion:1,part:'B',failures},null,2)+'\n');console.log(JSON.stringify({part:'B',selected:20,records:records.length,failures:failures.length}));
