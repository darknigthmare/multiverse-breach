import registry from './summonAnimationsWave17.generated.json' with {type:'json'};
import {RPG_SUMMON_SPECS_WAVE17} from './rosterReinforcementsWave17.js';
import {sampleSummonAnimationFrame} from './summonAnimationState.js';
const assets=new Map(registry.entries.map(entry=>[entry.id,entry]));
const specs=new Map(RPG_SUMMON_SPECS_WAVE17.map(entry=>[entry.id,entry]));
const unit=n=>Math.max(0,Math.min(1,Number(n)||0));
const ease=n=>1-(1-unit(n))**3;
const lerp=(a,b,p)=>a+(b-a)*p;
const point=(asset,anchor,performer)=>({x:performer.x+(anchor.x-asset.frameWidth/2)/asset.frameHeight*performer.size*performer.facing,
 y:performer.y+Math.round(performer.size/2-(asset.normalization?.baseline||244)/asset.frameHeight*performer.size)-performer.size/2+anchor.y/asset.frameHeight*performer.size});
export const ROSTER_SUMMON_CHOREOGRAPHIES_WAVE17=Object.freeze(RPG_SUMMON_SPECS_WAVE17.map((entry,index)=>{
 const asset=assets.get(entry.id),body=asset?.normalization?.bodyCalibration?.outputBodyHeight;
 return Object.freeze({id:entry.id+'-native',universe:entry.universe,entityName:entry.entityName,actionName:entry.actionName,
 sourceReference:entry.sourceWork+'. '+entry.adaptationNote,path:['melee','lute'].includes(entry.nativeRole)?'roster-wave17-contact':'roster-cover-fire',
 arrival:.30,travelTicks:24,holdTicks:28,scale:body>0?entry.bodyHeight/body:1,maxSize:132,offsetX:82+index*2,
 preparation:'roster-wave17-'+entry.slug+'-ready',attack:'roster-wave17-'+entry.slug+'-'+entry.nativeRole,recovery:'roster-ground-return',muzzle:Object.freeze([0,-.45]),
 nativeEntityId:entry.id,contactAnchor:asset?.effectAnchors?.attack?.[2]||null,nativeFrameWidth:asset?.frameWidth||512,nativeFrameHeight:256,nativeBaseline:244,
 fidelity:'authored-native-source-motion-adaptation',source1to1Verified:false});
}));
export const usesConfirmedSummonContactWave17=asset=>specs.has(asset?.id)&&specs.get(asset.id).nativeRole!=='support';
export function getWave17NativeSummonAsset(universe,entityName,actionName){return registry.entries.find(entry=>entry.universe===universe&&entry.entityName===entityName&&entry.actionName===actionName)||null;}
export function projectSourceSummonChoreographyWave17(scene,state){
 if(!state?.performer||!scene?.descriptor)return state;
 const asset=getWave17NativeSummonAsset(scene.descriptor.universe,scene.descriptor.entityName,scene.descriptor.action?.name),spec=specs.get(asset?.id);
 if(!spec)return state;
 const frame=sampleSummonAnimationFrame(scene,asset,state),anchor=asset.effectAnchors?.[frame?.phase]?.[frame?.col]||asset.effectAnchors?.attack?.[2];
 if(spec.nativeRole==='lute'&&scene.sourceLuteActorWave17){const body=scene.sourceLuteActorWave17,performer={...state.performer,x:body.x,y:body.y,alpha:1};return {...state,performer,origin:point(asset,anchor,performer),sourcePhysicalLuteStep:scene.sourceLuteStepWave17||null};}
 if(spec.nativeRole==='support'&&scene.sourceMedicWave17){const body=scene.sourceMedicWave17,performer={...state.performer,x:body.x,y:body.y,alpha:1};return {...state,performer,origin:point(asset,anchor,performer),sourceActualMedic:true};}
 if(spec.nativeRole!=='melee'||!anchor)return state;
 const target=scene.impacted&&scene.visualContacts?.length?scene.visualContacts[0]:scene.targets?.[0];
 const contact=asset.effectAnchors?.attack?.[2];
 if(!target||!contact)return state;
 const side=state.side<0?-1:1,accepted={x:target.x,y:target.y-state.height*.095};
 const offset=point(asset,contact,{...state.performer,x:0,y:0,facing:side});
 const destination={x:accepted.x-offset.x,y:accepted.y-offset.y};
 const station={x:Math.max(45,Math.min(state.width-45,state.caller.x+side*82)),y:state.caller.y};
 let x=lerp(station.x,destination.x,ease(state.travelProgress)),y=lerp(station.y,destination.y,ease(state.travelProgress));
 if(state.tick<state.attackStartTick){x=lerp(state.caller.x,station.x,ease(state.arrivalProgress));y=station.y;}
 if(state.returnProgress>0){x=lerp(destination.x,station.x,ease(state.returnProgress));y=lerp(destination.y,station.y,ease(state.returnProgress));}
 const performer={...state.performer,x,y,facing:side},origin=point(asset,anchor,performer);
 return {...state,performer,origin,sourceNativeContact:{assetId:asset.id,role:spec.nativeRole,phase:frame?.phase,column:frame?.col,targetId:target.battleId||target.runtimeId||target.id,target:accepted,measuredAnchor:anchor,accepted:scene.impacted===true&&!!scene.visualContacts?.length,distanceToTarget:Math.hypot(origin.x-accepted.x,origin.y-accepted.y),visualOnly:true}};
}
export function projectNativeSummonEffectOriginWave17(state,asset,frame){if(!state||!specs.has(asset?.id))return state;const anchor=asset.effectAnchors?.[frame?.phase]?.[frame?.col];return {...state,...(anchor?{origin:point(asset,anchor,state.performer)}:{}),nativeMuzzleActive:!!anchor&&frame?.phase==='attack'&&frame?.col===2&&specs.get(asset.id).nativeRole==='gun'};}
export function drawRosterSummonCueWave17(ctx,state,cue){if(!cue?.kind?.startsWith('roster-wave17-'))return false;if(cue.stage!=='contact'||state.effect!=='damage')return true;ctx.save();ctx.strokeStyle='#edd6a0';ctx.lineWidth=2;for(const target of state.targets){ctx.beginPath();ctx.ellipse(target.x,target.centerY,7+state.attackProgress*14,5+state.attackProgress*9,0,0,Math.PI*2);ctx.stroke();}ctx.restore();return true;}
