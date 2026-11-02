import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {COMBAT_SOURCE_DEFINITIONS_WAVE16_PART_A as defs} from '../../../src/game/combat/combatSourceDefinitionsWave16PartA.js';
import {ABILITIES_WAVE16_PART_A as kits} from '../../../src/game/combat/abilities/abilitiesWave16PartA.js';
const p='docs/combat-fidelity-wave16-2026-10-28/part-a/';
const read=f=>JSON.parse(fs.readFileSync(f)),hash=b=>createHash('sha256').update(b).digest('hex'),write=(f,d)=>fs.writeFileSync(f,JSON.stringify(d,null,2)+'\n');
const plan=read(p+'source-plan.json'),original=read(p+'generation-inventory.json').calls.filter(c=>c.archivedPath.endsWith('-native-original.png'));
const corrections=fs.readFileSync(p+'correction-calls.ndjson','utf8').trim().split('\n').map(JSON.parse);
const all=[...original,...corrections].map(c=>({...c,heroId:c.heroId||c.archivedPath.split('/').at(-1).replace('-native-original.png','')}));
write(p+'generation-inventory-complete.json',{schemaVersion:1,part:'A',calls:all,notes:'Actual tool calls only. Raw original receipts remain unchanged. No prepared intent is counted as execution.'});
const five=new Set(['deponia_rufus','jet_set_radio_beat_casque_vert','jet_set_radio_corn_bonnet_et_veste']);
const replacements={cuphead_cuphead:['top-rim-final-correction',[4,7]],earthworm_jim:['whip-final-correction',[4,7]],peter_puppy:['victory-correction',[5]],sam_and_max_sam_deduction:['victory-super-correction',[5,7]],cuphead_ms_chalice:['shield-pal-correction',[4,7]],deponia_rufus:['defeat-super-correction',[6,7]],jet_set_radio_beat_casque_vert:['defeat-super-correction',[6,7]],jet_set_radio_corn_bonnet_et_veste:['defeat-super-correction',[6,7]],bit_trip_commandgirl_video:['ordinary-correction',[10]],wallace_gromit_gromit:['round-victory-correction',[2]],sam_and_max_sybil_pandemik_expertise:['appearance-correction',Array.from({length:12},(_,i)=>i)],deponia_bozo:['captain-appearance-correction',Array.from({length:12},(_,i)=>i)]};
const records=[];
fs.mkdirSync(p+'references',{recursive:true});
for(const e of plan.characters){
 const calls=all.filter(c=>c.heroId===e.id),sources=[],selected=Array.from({length:12},()=>null),sourceReviews=[];
 for(const c of calls){
  const f=c.archivedPath.replace('.png','-region-review.json');assert.ok(fs.existsSync(f),f);let review=read(f),importFile=f;
  if(e.id==='gex_agent_xtra'&&c.archivedPath.endsWith('-native-original.png')){
   review=structuredClone(review);const g=review.missingGroups.find(g=>g.slot===10);assert.equal(g.regions.length,5);review.slotToSequence[10]=review.sequences.length;review.sequences.push([0,1,3,4].map(i=>g.regions[i]));review.importSelectionReview={slot:10,retainedPhysicalColumns:[0,1,3,4],excludedPhysicalColumns:[2],reason:'Five complete independent ordinary gestures; retain ready, headset preparation, decisive pointing, return-to-device. Exclude redundant device presentation.'};importFile=f.replace('-region-review','-selected-region-review');write(importFile,review);
  }
  if(e.id==='sam_and_max_sybil_pandemik_expertise'&&c.kind==='appearance-correction'){
   review=structuredClone(review);review.importSelectionReview=[];
   for(const g of review.missingGroups){assert.equal(g.regions.length,5);const keep=g.slot===0?[0,1,2,4]:[0,1,2,3];review.slotToSequence[g.slot]=review.sequences.length;review.sequences.push(keep.map(i=>g.regions[i]));review.importSelectionReview.push({slot:g.slot,retainedPhysicalColumns:keep.map(i=>g.regions[i].physicalColumn),excludedPhysicalColumns:g.regions.filter((_,i)=>!keep.includes(i)).map(r=>r.physicalColumn),reason:'Model emitted five complete independent drawings in this group; retain four reviewed complete poses, exclude one extra. No merging or duplicated drawing.'});}importFile=f.replace('-region-review','-selected-region-review');write(importFile,review);
  }
  const originalCall=c.archivedPath.endsWith('-native-original.png');const sourceIndex=sources.length;
  const calibrationSlot=originalCall?(five.has(e.id)?6:8):(c.kind==='defeat-super-correction'?1:0);
  const calibrationSequence=review.slotToSequence[calibrationSlot]??0;const calibrationColumn=c.kind==='victory-correction'?1:0;
  const body=review.sequences[calibrationSequence][calibrationColumn].body;
  sources.push({key:e.id+'-'+(c.kind||'native-original'),heroId:e.id,kind:c.kind||'original',tool:'image_gen',provider:'OpenAI',generationId:null,jobId:null,generatedPath:c.generatedPath,archivedPath:c.archivedPath,promptFile:c.promptFile,prompt:c.arguments.prompt,referenceInputs:c.arguments.referenced_image_paths||[],toolResultFile:c.toolResultFile,sha256:c.sha256,rows:review.rows,columns:review.columns,bodyHeight:body.bottom-body.top+1,excludesWeaponEffects:true,calibration:{measurementKind:'visible-native-body-component-height',sequence:calibrationSequence,column:calibrationColumn,bodyBounds:body,notes:'One measured body calibration per source, shared uniformly across all its poses. Stylised stature is not source1:1 certified. Body excludes detached effects; no per-pose size correction.'},nativeDrawingsObserved:review.sourceBodiesObserved,sourceComponentsObserved:review.sourceComponentsObserved,componentGrouping:review.componentGrouping,nativeDrawingsRetainedByImport:0,nativeDrawingsExcluded:review.sourceBodiesObserved,importRegionsFile:importFile,importRegionsSha256:hash(fs.readFileSync(importFile)),anchorMode:['aku_aku','freddi_fish_freddi','freddi_fish_luther','freddi_fish_cousin_calico'].includes(e.id)?'body-center':'native-foot-median',acceptedForSelection:false,missingSlots:review.missingSlots});
  sourceReviews.push(review);
  if(originalCall){const logical=five.has(e.id)?[0,1,2,3,4,5,8,9,10,11]:Array.from({length:12},(_,i)=>i);logical.forEach((slot,physicalSlot)=>{const row=review.slotToSequence[physicalSlot];if(row!==undefined)selected[slot]={source:sourceIndex,row};});}
 }
 // Peter's second complete transformation belongs to SUPER, not match victory.
 if(e.id==='peter_puppy')selected[7]={...selected[5]};
 const replacement=replacements[e.id];if(replacement){const [kind,slots]=replacement,idx=sources.findIndex(s=>s.kind===kind);assert.ok(idx>=0,e.id+': correction missing');slots.forEach((slot,i)=>{const row=sourceReviews[idx].slotToSequence[i];assert.ok(row!==undefined,e.id+': correction row'+i);selected[slot]={source:idx,row};});}
 for(const slot of [7])if(['crash_bandicoot','sam_and_max_max_chaos'].includes(e.id))selected[slot]={...selected[slot],columnOrder:[0,2,1,3],permutationReason:'The original independently drawn release/flash is second. Reorder the four original complete poses so release occupies native column2; no new drawing is counted.'};
 assert.ok(selected.every(Boolean),e.id+': incomplete selection');
 const retainedKeys=new Set();for(const s of selected){const key=s.source+':'+s.row;assert.ok(!retainedKeys.has(key),e.id+': source sequence selected twice');retainedKeys.add(key);sources[s.source].nativeDrawingsRetainedByImport+=4;}
 for(const s of sources){s.nativeDrawingsExcluded=s.nativeDrawingsObserved-s.nativeDrawingsRetainedByImport;s.acceptedForSelection=s.nativeDrawingsRetainedByImport>0;assert.ok(s.nativeDrawingsExcluded>=0);}
 const ref='public'+e.referenceAsset,archive=p+'references/'+e.id+'-historical.png';assert.equal(hash(fs.readFileSync(ref)),e.referenceSha256);if(!fs.existsSync(archive))fs.copyFileSync(ref,archive);assert.equal(hash(fs.readFileSync(archive)),e.referenceSha256);
 const d=defs[e.id],k=kits[e.id];records.push({heroId:e.id,name:e.name,universe:e.universe,sourceWork:e.sourceWork,sourceReference:e.sourceReference,version:d.appearance,referenceAsset:e.referenceAsset,referenceAssetSha256:e.referenceSha256,referenceArchive:archive,referenceUse:'Historical image archived for comparison only. It is not canonical proof. Frozen source plan plus dated errata define current intended incarnation.',targetBodyHeight:e.bodyHeight,simpleName:k.simple.name,superName:k.special.name,effect:d.effect,delivery:d.delivery,reviewed:true,reviewNotes:'Actual returned source atlases visually reviewed. Complete retained independent drawings only; excluded, extra, incomplete and superseded figures remain archived with counts. All native phases have four complete poses. Source-period pixel-art adaptation, exact original game frames and textures not certified. RGBA retained by geometry/nearest resize only; no repainting, mirroring or body-part composition.',sources,nativeSelections:selected.slice(0,8),baseSelections:selected.slice(8),retainedDistinctPoses:48});
 console.log(JSON.stringify({heroId:e.id,sources:sources.length,retained:sources.reduce((n,s)=>n+s.nativeDrawingsRetainedByImport,0),excludedCandidates:sources.reduce((n,s)=>n+s.nativeDrawingsExcluded,0)}));
}
write(p+'generation-records.json',{schemaVersion:1,part:'A',sourcePlanSha256:hash(fs.readFileSync(p+'source-plan.json')),actualToolCalls:all.length,source1to1Verified:false,records,remainingHeroIds:[],blockedHeroIds:[]});
