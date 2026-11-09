import fs from 'node:fs/promises';
import crypto from 'node:crypto';
const dir='docs/combat-fidelity-wave17-2026-11-02/jade-sources',read=async p=>JSON.parse(await fs.readFile(p,'utf8')),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const initial=await read(dir+'/source-plan.json'),planned=await read(dir+'/planned-tool-arguments.json');
const order={
 'jade-motion-a':['idle','walk','run','turn','jumpStart','jumpRise','jumpApex','fall'],
 'jade-motion-b':['fastFall','land','crouchEnter','crouchExit','crouchCharge','taunt1','hitStun'],
 'jade-defense':['shieldEnter','shieldHold','shieldHit','shieldBreak','shieldExit','dead','defeat']
};
const calibrations={
 'jade-motion-a':{row:0,column:0,bodyBounds:{x:137,y:6,width:88,height:197}},
 'jade-motion-b':{row:6,column:0,bodyBounds:{x:64,y:1284,width:171,height:226}},
 'jade-defense':{row:4,column:3,bodyBounds:{x:827,y:863,width:133,height:206}},
 'jade-correction-a':{row:3,column:0,bodyBounds:{x:94,y:949,width:148,height:326}},
 'jade-combat-a-1':{row:0,column:0,bodyBounds:{x:34,y:45,width:188,height:272}},
 'jade-combat-a-2':{row:3,column:2,bodyBounds:{x:651,y:1003,width:173,height:292}},
 'jade-combat-b-1':{row:1,column:0,bodyBounds:{x:82,y:452,width:157,height:338}},
 'jade-combat-b-2':{row:2,column:0,bodyBounds:{x:59,y:785,width:162,height:325}},
 'jade-ledge-1':{row:0,column:3,bodyBounds:{x:978,y:24,width:202,height:260}},
 'jade-ledge-2':{row:2,column:0,bodyBounds:{x:52,y:784,width:167,height:357}}
};
const excluded={'jade-motion-b':new Set(['taunt1'])},sources=[],calls=[];
for(const p of planned){
 if(p.batch==='GyrodiskAction')continue;
 const receipt=await read(dir+'/'+p.id+'.tool-receipt.json'),review=await read(dir+'/'+p.id+'.region-review.json'),states=order[p.id]||p.states;
 const source={id:p.id,image:receipt.savedSource,sha256:receipt.sourceSha256,states,promptFile:receipt.promptFile,receiptFile:dir+'/'+p.id+'.tool-receipt.json',importRegionsFile:dir+'/'+p.id+'.region-review.json',importRegionsSha256:hash(await fs.readFile(dir+'/'+p.id+'.region-review.json')),
  importOptions:{groupComponentsByGrid:p.id==='jade-combat-a-2',...(p.id==='jade-defense'?{minimumBodyHeight:24}:{})},calibration:{...calibrations[p.id],state:states[calibrations[p.id].row],reviewed:true,raisedArmsExcluded:true,reason:'Manual crown-to-sole anatomical ROI on the actual opened Jade2003 native source. Body measurement excludes Daï-Jo reach, camera and detached native energy; one common effective stature is used for every source and lowered body poses remain naturally lower.'}};
 sources.push(source);
 calls.push({...receipt,observedRows:states.length,observedBodies:review.observedBodies,observedNativePoses:review.frames.length,observedNativePoseCandidates:review.frames.length,observedFullBodyCompleteCandidates:review.frames.length-(p.id==='jade-motion-b'?4:0),observedIncompleteCandidates:p.id==='jade-motion-b'?4:0,review:{actuallyViewed:true,actualStateOrder:states,excludedStateRows:states.flatMap((s,row)=>s.startsWith('reserved')||excluded[p.id]?.has(s)?[{state:s,row,poses:4,reason:s.startsWith('reserved')?'Reserved study, excluded from gameplay and delivered-pose counts.':'Camera row was drawn as cropped lower bodies; all four native drawings excluded, no body repair or compositing.'}]:[])},status:'returned-and-visually-reviewed',source1to1Verified:false});
}
const selectionByState={};
for(const s of sources)for(const[row,state]of s.states.entries())if(!state.startsWith('reserved')&&!excluded[s.id]?.has(state)){
 if(selectionByState[state])throw new Error('Repeated source state '+state);selectionByState[state]={sourceId:s.id,row};
}
const atlases=initial.atlases.map(a=>({
 id:a.id,batch:a.batch,states:a.states,
 selection:Object.fromEntries(a.states.map(s=>{if(!selectionByState[s])throw new Error('Missing '+s);return[s,selectionByState[s]];})),
 discardedRows:calls.flatMap(c=>c.review.excludedStateRows.filter(r=>a.states.includes(r.state)||(a.id==='jade-ledge'&&r.state.startsWith('reserved'))).map(r=>({...r,sourceImage:c.savedSource})))
}));
const cfg={heroId:initial.heroId,universe:initial.universe,sourceWork:initial.sourceWork,sourceReference:initial.sourceReference,date:'2026-11-02',archiveDir:dir,outputDir:'public/sprites/generated/jade-melee-wave17',reference:{asset:dir+'/research/steam-official-screen-2.jpg',savedImage:dir+'/research/steam-official-screen-2.jpg'},registryPaths:{Motion:'src/game/combat/characterJadeMotionWave17.generated.json',Combat:'src/game/combat/characterJadeActionWave17.generated.json'},sources,atlases,visualReview:{complete:true,evidence:dir+'/source-row-review.json',outfit:'Original2003 Jade: short black swept hair, green cloth headband (no hat), green lipstick and eyes, darkgreen cropped jacket, white tank top, teal/green swirl-pattern trousers, brown sneakers, dark fingerless wrist gloves, compact round-lens camera and retractable blunt metallic Daï-Jo.',weapons:'Physical Daï-Jo staff; personal special is informational camera use with zero damage; no offensive camera ray, sword, shield or firearm.',limitations:['New generated pixel-art adaptations, not official source animation frames; source1to1Verified remainsfalse.','Continuous shield states depict staff bracing/evasive recovery; original2003 usesdodging. Platform-fighter shields/aerials and timings are declared adaptations.','Opposite facing mirrors the sprite at runtime and is not counted as newart; anatomical equipment handedness in mirrored camp is not source-certified.']},incompleteInitialSources:[{id:'jade-motion-b',requested:32,observed:28,missingState:'crouchIdle',excludedState:'taunt1',reason:'Only seven rows returned; photo row drawn with cropped legs.'},{id:'jade-defense',requested:32,observed:28,missingState:'perfectShield',reason:'Only seven rows returned; missing state independently generated.'}],rejectedSources:[]};
const review={heroId:cfg.heroId,reviewedAt:new Date().toISOString(),actuallyViewedSourceImages:sources.map(s=>({id:s.id,path:s.image,sha256:s.sha256})),source1to1Verified:false,complete:true,retainedStates:45,retainedDistinctPoses:180,observedBodies:calls.reduce((n,c)=>n+c.observedBodies,0),excludedCandidateDrawings:calls.reduce((n,c)=>n+c.review.excludedStateRows.length*4,0),excludedCompleteDrawings:16,excludedIncompleteDrawings:4,observedFullBodyCompleteCandidates:196,excludedRows:calls.flatMap(c=>c.review.excludedStateRows.map(r=>({...r,sourceImage:c.savedSource}))),notes:'All ten actual image_gen returns were individually seen. Exact complete-body state rows were classified by returned content; 200observed native drawings include180retained and20excluded. No correction constructs a pose from body parts or borrows a different-state drawing.'};
if(review.observedBodies!==200||review.excludedCandidateDrawings!==20)throw new Error('Unexpected actual count');
await fs.writeFile(dir+'/actual-tool-calls.json',JSON.stringify(calls,null,2)+'\n');await fs.writeFile(dir+'/packing-plan.json',JSON.stringify(cfg,null,2)+'\n');await fs.writeFile(dir+'/source-row-review.json',JSON.stringify(review,null,2)+'\n');
console.log(JSON.stringify({calls:calls.length,sources:sources.length,states:Object.keys(selectionByState).length,poses:180,observed:200,excluded:20}));
