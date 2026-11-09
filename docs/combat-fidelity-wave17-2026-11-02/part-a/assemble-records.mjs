import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {COMBAT_SOURCE_DEFINITIONS_WAVE17_PART_A as defs} from '../../../src/game/combat/combatSourceDefinitionsWave17PartA.js';
import {ABILITIES_WAVE17_PART_A as kits} from '../../../src/game/combat/abilities/abilitiesWave17PartA.js';
const p='docs/combat-fidelity-wave17-2026-11-02/part-a/';
const read=f=>JSON.parse(fs.readFileSync(f)),hash=b=>createHash('sha256').update(b).digest('hex'),write=(f,v)=>fs.writeFileSync(f,JSON.stringify(v,null,2)+'\n');
const plan=read(p+'source-plan.json'),review=read(p+'visual-source-review-progress.json');
const all=fs.readdirSync(p+'sources').filter(n=>n.endsWith('-tool-result.json')).map(n=>read(p+'sources/'+n)).map(c=>({...c,kind:c.kind||'native-original',sha256:c.archivedPath?hash(fs.readFileSync(c.archivedPath)):null})).sort((a,b)=>a.startedAt.localeCompare(b.startedAt));
write(p+'generation-inventory.json',{schemaVersion:1,part:'A',calls:all,source1to1Verified:false,notes:'Actual tool calls and returned native files only. Prepared requests are not executions. All superseded source drawings and receipts remain archived.'});
const records=[],remaining=[],blocked=[];
for(const e of plan.characters){
 const approval=review.entries.find(r=>r.heroId===e.id);
 if(!approval?.sourceReviewed||approval.pendingSourceConfirmation){remaining.push(e.id);continue;}
 const calls=all.filter(c=>c.heroId===e.id&&c.archivedPath),selected=Array.from({length:12},()=>null),sources=[],excludedSources=[];
 let pending=false;
 for(const call of calls){
  const regionFile=call.archivedPath.replace('.png','-region-review.json');
  if(!fs.existsSync(regionFile)){const logicalSlots=call.kind==='native-original'?Array.from({length:12},(_,i)=>i):call.slots||[];const laterSlots=new Set(calls.slice(calls.indexOf(call)+1).flatMap(c=>c.slots||[]));if(logicalSlots.every(slot=>laterSlots.has(slot))){excludedSources.push({archivedPath:call.archivedPath,sha256:call.sha256,toolResultFile:call.toolResultFile,promptFile:call.promptFile,nativePoseCandidatesObserved:logicalSlots.length*4,nativeDrawingsRetainedByImport:0,reason:'Entire source superseded by later returned requests covering every logical group. No pixel from this source is imported; its unusable geometry and raw receipt remain archived.'});continue;}pending=true;continue;}
  const regions=read(regionFile),index=sources.length,calibrationSlot=call.kind==='native-original'?8:0;
  const calibrationSequence=regions.slotToSequence[calibrationSlot]??0;
  const body=regions.sequences[calibrationSequence]?.[0]?.body;
  if(!body){pending=true;continue;}
  const expectedCandidates=call.kind==='native-original'?48:(call.slots?.length||regions.rows)*4;
  const missingCompleteBodies=call.kind==='native-original'?({rayman_rayman:3,spyro_hunter:1,jersey_devil_jersey_devil:1}[e.id]||0):e.id==='metal_hellsinger_paz'&&call.kind==='broken-horn-skull-correction'?1:0;
  const source={key:e.id+'-'+call.kind,heroId:e.id,kind:call.kind,tool:'image_gen',provider:'OpenAI',generationId:null,jobId:null,generatedPath:call.generatedPath,archivedPath:call.archivedPath,promptFile:call.promptFile,prompt:call.arguments.prompt,referenceInputs:call.arguments.referenced_image_paths||[],toolResultFile:call.toolResultFile,sha256:call.sha256,rows:regions.rows,columns:regions.columns,bodyHeight:body.bottom-body.top+1,excludesWeaponEffects:false,calibration:{measurementKind:'visible-native-standing-pose-envelope',sequence:calibrationSequence,column:0,bodyBounds:body,notes:'One source-wide standing-pose scale shared by every selected pose. The measured source envelope may include held equipment or native wings; no anatomy is repainted or resized separately.'},sourcePoseCandidatesExpected:expectedCandidates,incompleteOrMissingFullBodyCandidates:missingCompleteBodies,nativeDrawingsObserved:expectedCandidates-missingCompleteBodies,rawSourceBodyCandidatesObserved:regions.sourceBodiesObserved,sourceComponentsObserved:regions.sourceComponentsObserved,componentGrouping:regions.componentGrouping,nativeDrawingsRetainedByImport:0,nativeDrawingsExcluded:0,importRegionsFile:regionFile,importRegionsSha256:hash(fs.readFileSync(regionFile)),anchorMode:['spyro_sparx','metal_hellsinger_paz','shadow_man_jaunty','croc_beany_bird','heart_of_darkness_amigo_evacuation'].includes(e.id)?'body-center':'native-foot-median',acceptedForSelection:false,missingSlots:regions.missingSlots};
  sources.push(source);
  if(call.kind==='native-original'){for(let slot=0;slot<12;slot++)if(regions.slotToSequence[slot]!==undefined)selected[slot]={source:index,row:regions.slotToSequence[slot]};}
  else {for(const[physicalRow,slot]of(call.slots||[]).entries())if(regions.slotToSequence[physicalRow]!==undefined)selected[slot]={source:index,row:regions.slotToSequence[physicalRow]};}
 }
 if(!selected.every(Boolean)||pending){remaining.push(e.id);continue;}
 // Pey'j's first generated finishing row shows hop in column2 and landing in
 // column3. Import its four original complete drawings in a physical sequence
 // that puts the landing contact in the runtime's third column.
 if(e.id==='beyond_good_evil_peyj')selected[4]={...selected[4],columnOrder:[0,2,3,1],permutationReason:'Native crouch, hop, real ground-pound landing, crouched recovery. The actual landing was fourth in the raw source. No drawing is duplicated or newly counted.'};
 if(e.id==='heart_of_darkness_andy')selected[7]={...selected[7],columnOrder:[0,2,1,3],permutationReason:'The actual native hand-energy release was second; import anticipation, prepared hands, true release, recovery so release is column2. No drawing duplicated.'};
 const retained=new Set();for(const selection of selected){const key=selection.source+':'+selection.row;assert.ok(!retained.has(key),e.id+': selected native sequence twice');retained.add(key);sources[selection.source].nativeDrawingsRetainedByImport+=4;}
 for(const source of sources){source.nativeDrawingsExcluded=source.nativeDrawingsObserved-source.nativeDrawingsRetainedByImport;assert.ok(source.nativeDrawingsExcluded>=0);source.acceptedForSelection=source.nativeDrawingsRetainedByImport>0;}
 const archive=p+'references/'+e.id+'-historical.png';assert.ok(e.referenceAsset&&e.referenceSha256,e.id+': missing historical reference');
 const original=fs.readFileSync('public'+e.referenceAsset);assert.equal(hash(original),e.referenceSha256);if(!fs.existsSync(archive))fs.copyFileSync('public'+e.referenceAsset,archive);assert.equal(hash(fs.readFileSync(archive)),e.referenceSha256);
 const d=defs[e.id],k=kits[e.id];records.push({heroId:e.id,name:e.name,universe:e.universe,sourceWork:d.sourceWork,sourceReference:d.sourceReference,version:d.appearance,referenceAsset:e.referenceAsset,referenceAssetSha256:e.referenceSha256,referenceArchive:archive,referenceUse:'Historical project image retained for comparison only. The frozen source work, chronological errata and actually inspected primary images take precedence; old art is not canonical proof.',targetBodyHeight:e.bodyHeight,simpleName:k.simple.name,superName:k.special.name,effect:d.effect,delivery:d.delivery,reviewed:true,excludedSources,reviewNotes:'Actual original and corrective native source images viewed. Exactly48 complete retained distinct source drawings; incomplete, connected, superseded and excluded candidates are never delivered or counted as new poses. Geometry selects source pixels with zero visible seam crossings for retained regions, shared source calibration and nearest-neighbour packing. No manual paint, recolour, mirror or body-part assembly. Original game frames and textures remain uncertified.',sources,nativeSelections:selected.slice(0,8),baseSelections:selected.slice(8),retainedDistinctPoses:48,visualSourceReview:p+'visual-source-review-progress.json'});
}
write(p+'generation-records.json',{schemaVersion:1,part:'A',sourcePlanSha256:hash(fs.readFileSync(p+'source-plan.json')),actualToolCalls:all.length,source1to1Verified:false,records,remainingHeroIds:remaining,blockedHeroIds:blocked});
console.log(JSON.stringify({part:'A',deliveredReady:records.length,remaining:remaining.length,actualToolCalls:all.length,retainedNativePoses:records.length*48,source1to1Verified:false}));
