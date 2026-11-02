import fs from'node:fs';
import assert from'node:assert/strict';
import{createHash}from'node:crypto';
import{segmentNativeAtlas}from'./native-segmentation.mjs';
import{COMBAT_SOURCE_DEFINITIONS_WAVE16_PART_B as defs}from'../../../src/game/combat/combatSourceDefinitionsWave16PartB.js';
import{ABILITIES_WAVE16_PART_B as kits}from'../../../src/game/combat/abilities/abilitiesWave16PartB.js';
const D='docs/combat-fidelity-wave16-2026-10-28/part-b',P='docs/combat-fidelity-wave16-2026-10-28/';
const read=f=>fs.readFileSync(f),json=f=>JSON.parse(read(f)),sha=b=>createHash('sha256').update(b).digest('hex');
const plan=json(P+'batch-plan-before.json'),amendments=json(P+'batch-amendments-before-generation.json'),effectiveIds=amendments.effectiveParts.B;
const allRows=[...plan.heroes,...amendments.newRows],reviews=json(D+'/source-reviews.json'),records=[];
for(const id of effectiveIds){
 const review=reviews.entries[id];if(!review?.acceptedForDelivery)continue;
 assert.equal(review.actuallyViewedWith,'view_image');
 const old=allRows.find(r=>r.hero.id===id),s=defs[id],kit=kits[id];
 const native=[[0,0,[0,1,2,3]],[0,0,[4,5,6,7]],[0,1,[0,1,2,3]],[0,1,[4,5,6,7]],[0,2,[0,1,2,3]],[0,2,[4,5,6,7]],[0,3,[0,1,2,3]],[0,3,[4,5,6,7]]];
 const base=[[0,4,[0,1,2,3]],[0,4,[4,5,6,7]],[0,5,[0,1,2,3]],[0,5,[4,5,6,7]]];
 for(const[k,permutation]of Object.entries(review.nativeSourceColumnPermutations||{}))native[Number(k)][2]=permutation;
 for(const[k,selection]of Object.entries(review.nativeSelectionOverrides||{}))native[Number(k)]=selection;
 for(const[k,selection]of Object.entries(review.baseSelectionOverrides||{}))base[Number(k)]=selection;
 const variants=[{basename:review.primaryBasename||id,rowCount:review.primaryRowCount||6,expectedRowCounts:review.primaryExpectedRowCounts||[8,8,8,8,8,8],calibrationFrame:review.primaryCalibrationFrame||[4,0],incompleteCandidateDrawings:review.primaryIncompleteCandidateDrawings||0,observedNativeDrawings:review.primaryObservedNativeDrawings},...(review.additionalSources||[])];
 const sources=[];
 for(const[index,v]of variants.entries()){
  const file=D+'/sources/'+v.basename+'.png',receiptFile=D+'/sources/'+v.basename+'-result.json',receipt=json(receiptFile);
  assert.equal(receipt.imageReturned,true);
  const segmentation={...(v.minimumBodyHeight?{minimumBodyHeight:v.minimumBodyHeight}:{})};
  const a=await segmentNativeAtlas(file,{rowCount:v.rowCount,...segmentation});assert.deepEqual(a.rowCounts,v.expectedRowCounts,id+' incomplete source needs an explicit repair');
  const chosen=[...native,...base].filter(row=>row[0]===index).flatMap(row=>row[2].map(column=>[row[1],column]));
  assert.equal(new Set(chosen.map(c=>c.join(':'))).size,chosen.length,id+' source drawing selected twice');
  const[cr,cc]=v.calibrationFrame,calibration=a.rows[cr][cc],bodyHeight=v.calibrationBodyHeight||review.calibrationBodyHeight||calibration.bodyBounds.height;
  sources.push({archivedPath:file,sha256:sha(read(file)),promptFile:D+'/sources/'+v.basename+'-prompt.txt',promptSha256:sha(read(D+'/sources/'+v.basename+'-prompt.txt')),toolResultFile:receiptFile,toolResultSha256:sha(read(receiptFile)),generatedPath:receipt.imagePath,rows:v.rowCount,segmentation,rowCounts:a.rowCounts,nativeComponentsObserved:a.frames.length,nativeDrawingsObserved:v.observedNativeDrawings??a.frames.length-(v.incompleteCandidateDrawings||0),incompleteCandidateDrawings:v.incompleteCandidateDrawings||0,retainedDrawings:chosen.length,excludedDrawings:(v.observedNativeDrawings??a.frames.length-(v.incompleteCandidateDrawings||0))-chosen.length,excludedCandidates:a.frames.length-chosen.length,acceptedForDelivery:chosen.length>0,calibration:{method:'visually-inspected-crown-to-sole-height-of-standing-idle',sourceFrame:v.calibrationFrame,bodyHeight,sourceBodyBounds:calibration.bodyBounds,sourceRoi:calibration.sourceBounds,excludesWeaponEffects:true,calibrationNotes:'Complete standing calibration pose inspected; chosen equipment does not extend above the crown or below soles. Calibration poses do not count again as a delivery.'}});
 }
 records.push({heroId:id,name:old.hero.name,universe:old.hero.universe,sourceWork:s.sourceWork,sourceReference:s.sourceReference,referenceAsset:old.referenceAsset,referenceAssetSha256:old.referenceSha256,referenceArchive:D+'/references/'+id+'.png',targetBodyHeight:s.bodyHeight,simpleActionName:kit.simple.name,simpleEffect:kit.simple.targeting.effect,specialActionName:kit.special.name,specialEffect:kit.special.targeting.effect,selectedSourceAppearance:s.appearance,selectedSourceWeapon:s.weapon,selectedSourcePose:s.pose,sourceActionName:s.actionName,sourceEffect:s.effect,sourceDelivery:s.delivery,reviewed:true,reviewedAt:review.reviewedAt,sources,selections:{native,base},correctionNotes:review.correctionNotes||[],reviewNotes:review.notes,source1to1Verified:false});
}
const failures=json(D+'/request-failures.json').failures;
const unusedSourceImages=json(D+'/source-exclusions.json').exclusions.map(e=>({...e,path:e.source,sha256:sha(read(e.source)),nativeDrawingsObserved:e.observedDrawings,retainedDrawings:0,excludedDrawings:e.excludedDrawings}));
const value={schemaVersion:1,date:'2026-10-28',part:'B',selectedHeroIds:effectiveIds,originalSelectedHeroIds:plan.parts.B,preGenerationAmendment:P+'batch-amendments-before-generation.json',sourcePlanInitial:D+'/source-plan.json',additionalSourcePlans:[D+'/source-plan-tank-addendum.json',D+'/source-plan-dead-rising-equipment-clarification.json',D+'/source-plan-dead-rising-layout-correction.json',D+'/source-plan-rocky-footwear-clarification.json'],records,failures,unusedSourceImages,remainingHeroIds:effectiveIds.filter(id=>!records.some(r=>r.heroId===id)),remainingReason:'Not yet generated, reviewed and imported; pending work is not a refusal or a delivery.'};
fs.writeFileSync(D+'/generation-records.json',JSON.stringify(value,null,2)+'\n');
console.log(JSON.stringify({reviewed:records.length,pending:value.remainingHeroIds.length,blockedOriginals:failures.map(f=>f.heroId)}));
