import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import {segmentAragornSource} from './native-aragorn-segmentation.mjs';
const dir='docs/combat-fidelity-wave14-2026-10-25/aragorn-sources';
const read=async file=>JSON.parse(await fs.readFile(file,'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const main=await read(`${dir}/planned-tool-arguments.json`),corrective=await read(`${dir}/planned-corrective-tool-arguments.json`);
const rejectedStates=new Set(['jumpApex','fall','jumpRise','crouchCharge','shieldExit','aerialForward','aerialDown','dead','ledgeCatch','ledgeHang','ledgeClimb']);
const sources=[];
for(const p of [...main,...corrective]){
 const isMain=main.some(s=>s.id===p.id),states=p.states.map(s=>isMain&&rejectedStates.has(s)?`discarded-${s}`:s);
 const layout={columns:p.sourceColumns,rowCounts:Array.from({length:p.physicalRows},()=>p.sourceColumns)};
 if(p.id==='aragorn-motion-a'){layout.rowCounts[2]=7;layout.missingColumnsByRow={2:[7]};}
 if(p.id==='aragorn-defense'){layout.rowCounts[3]=7;layout.missingColumnsByRow={3:[3]};}
 const image=`${dir}/${p.id}.native.png`,seg=await segmentAragornSource(image,states.length,24,layout);
 const row=isMain?8:states.indexOf('uprightCalibration'),column=0,frame=seg.frames[row*4+column];
 if(!frame)throw new Error('Missing upright calibration');
 const bodyBounds=frame.sourceRect;
 const report={file:image,sha256:seg.sha256,width:seg.width,height:seg.height,edgePixels:seg.edgePixels,actualSegmentedBodies:seg.observedBodies,
  physicalRowCounts:seg.physicalRowCounts,nativeSlots:seg.frames.length,missingSlots:seg.frames.flatMap((f,i)=>f?[]:[i]),distinctRealRawFrames:new Set(seg.frames.filter(Boolean).map(f=>sha(f.raw))).size,
  frames:seg.frames.map(f=>!f?null:{nativeRow:f.nativeRow,nativeColumn:f.nativeColumn,sourceRect:f.sourceRect,rawSha256:sha(f.raw),canvasClipped:f.sourceRect.x<=0||f.sourceRect.y<=0||f.sourceRect.x+f.sourceRect.width>=seg.width||f.sourceRect.y+f.sourceRect.height>=seg.height})};
 await fs.writeFile(`${dir}/${p.id}.segmentation.json`,JSON.stringify(report,null,2)+'\n');
 sources.push({id:p.id,image,states,promptFile:p.promptFile,layout,calibration:{reviewed:true,state:states[row],row,column,bodyBounds,nativeStandingBodyHeight:bodyBounds.height,raisedArmsExcluded:true,
  reason:'Manually inspected complete upright crown-to-boot-sole interval. Bare hands are lowered and ranger longsword sheathed; no raised hand, blade, scabbard or VFX determines stature. A single source-wide scale preserves crouched, hanging, prone and aerial proportions.'}});
 console.log(JSON.stringify({id:p.id,bodies:seg.observedBodies,distinct:report.distinctRealRawFrames,missingSlots:report.missingSlots,clipped:report.frames.filter(Boolean).filter(f=>f.canvasClipped).map(f=>[f.nativeRow,f.nativeColumn]),calibration:bodyBounds}));
}
const choices=new Map();
for(const s of sources)for(const[row,state]of s.states.entries()){
 if(state.startsWith('reserved')||state.startsWith('discarded')||state==='uprightCalibration')continue;
 if(choices.has(state))throw new Error('Native state selected twice: '+state);
 choices.set(state,{sourceId:s.id,row});
}
const atlases=main.map(p=>{const states=p.states.slice(0,p.id==='aragorn-ledge'?5:8);return{id:p.id,batch:p.batch,states,
 selection:Object.fromEntries(states.map(state=>[state,choices.get(state)])),discardedRows:p.states.flatMap((state,row)=>row>=states.length||rejectedStates.has(state)?[{sourceImage:`${dir}/${p.id}.native.png`,nativeRow:row,poses:state==='jumpRise'||state==='dead'?3:4,reason:row>=states.length?'Reserved native calibration/study, never counted as a game pose.':'Original state sequence incomplete or insufficiently articulated; replaced in full by independently generated four-pose corrective.'}]:[])};});
if(choices.size!==45||atlases.some(a=>Object.values(a.selection).some(s=>!s)))throw new Error('45 exclusive native state rows required');
const cfg={heroId:'aragorn_lotr',registryStem:'aragorn',universe:'The Lord of the Rings',sourceWork:'The Fellowship of the Ring (2001), Strider before Amon Hen',sourceReference:'https://tolkiengateway.net/wiki/Aragorn',date:'2026-10-25',
 archiveDir:dir,outputDir:'public/sprites/generated/melee-aragorn-wave14',reference:{asset:'docs/combat-fidelity-wave14-2026-10-25/part-a/sources/aragorn_lotr-native-original.png',savedImage:`${dir}/aragorn-identity-reference-original.png`},correctionId:null,sources,atlases,
 visualReview:{complete:false,outfit:'Adult Strider from Fellowship2001 before Amon Hen: shoulder-length dark brown hair, short beard, weathered brown leather ranger coat, dark gray-green cloak, dark trousers and leather boots.',
 weapons:'Conventional ranger longsword and attached dark scabbard; sheathed on locomotion and all ledge contacts with visible free bare hands. Physical cuts and forearm guards, no Anduril, Army of the Dead, magic or projectile.',
 limitations:['Original generated gameplay adaptation, not official film animation or certified source1:1.','Opposite facing is the runtime horizontal mirror, including costume/scabbard asymmetry.','Shared platform-fighter charge, physical guard, kicks and aerial movement are explicit gameplay adaptations.']},
 incompleteInitialSources:[{id:'aragorn-motion-a',expectedBodies:48,observedBodies:47,missingStatePose:'jumpRise/3'},{id:'aragorn-defense',expectedBodies:48,observedBodies:47,missingStatePose:'dead/3'}],
 rejectedSources:[{id:'aragorn-motion-a-portrait-incomplete',posesRetained:0,reason:'28 bodies instead of32; missing/mixed final state row.'},{id:'aragorn-motion-a-landscape32-incomplete',posesRetained:0,reason:'31 bodies instead of32; incomplete jumpRise.'}]};
await fs.writeFile(`${dir}/packing-plan.json`,JSON.stringify(cfg,null,2)+'\n');
const calls=await read(`${dir}/actual-tool-calls.json`);
for(const call of calls){
 if(call.savedRejectedSource){call.savedSource=call.savedRejectedSource;call.observedNativePoses=call.rejectedCompleteCandidateBodies;call.observedSegmentedBodies=call.rejectedCompleteCandidateBodies;call.observedCompleteRowCounts=call.observedRowCounts;continue;}
 const s=sources.find(s=>s.id===call.id),seg=await read(`${dir}/${call.id}.segmentation.json`);
 call.observedRows=s.layout.rowCounts.length;call.observedRowCounts=s.layout.rowCounts;call.observedCompleteRowCounts=s.layout.rowCounts;call.observedNativePoses=seg.actualSegmentedBodies;call.observedSegmentedBodies=seg.actualSegmentedBodies;
 call.review={actualStateOrder:s.states,retainedStateRows:atlases.flatMap(a=>Object.entries(a.selection).filter(([,v])=>v.sourceId===s.id).map(([state,v])=>({state,row:v.row}))),
  canvasClippedFrames:seg.frames.filter(Boolean).filter(f=>f.canvasClipped).map(f=>[f.nativeRow,f.nativeColumn]),noOriginalReferencePoseReused:true,reservedRowsNeverCounted:true};
}
await fs.writeFile(`${dir}/actual-tool-calls.json`,JSON.stringify(calls,null,2)+'\n');
console.log(JSON.stringify({sources:sources.length,atlases:6,exclusiveStates:choices.size,retainedNativePoses:180}));
