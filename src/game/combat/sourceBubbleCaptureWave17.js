// Tail Concerto's Police Robo arrests with a nonlethal capture bubble. This
// state never deals HP damage, teleports, lifts, changes teams or proxies input.
// The1.25s /1turn limit is a crossover rule, not a source-game frame claim.
const HERO='tail_concerto_waffle',UNIVERSE='Tail Concerto',KIND='bubble-capture';
const field=(profile,key)=>profile?.[key]??profile?.targeting?.[key];
const sourceId=actor=>actor?.sourceHeroId??actor?.sourceId??actor?.heroId??actor?.id;
const runtimeId=actor=>actor?.battleId??actor?.runtimeId??actor?.id;
const living=actor=>!!actor&&Number.isFinite(actor.currentHp)&&actor.currentHp>0&&actor.state!=='dead';
const canonicalKittens=new Set(['tail_concerto_red_vest_kitten','tail_concerto_blue_overalls_kitten','tail_concerto_black_shirt_kitten']);
export const SOURCE_BUBBLE_CAPTURE_CONTRACT_WAVE17=Object.freeze({
 sourceHeroId:HERO,universe:UNIVERSE,kind:KIND,duration:1.25,tacticsTurns:1,
 damage:0,lift:0,nonlethal:true,requiresExplicitTargetEligibility:true,
 durationIsEngineAdaptation:true,source1to1Verified:false
});

export function isSourceBubbleCaptureProfileWave17(profile){
 return !!profile&&profile.sourceHeroId===HERO&&profile.universe===UNIVERSE
  &&field(profile,'effect')==='control'&&field(profile,'delivery')==='control'
  &&field(profile,'controlKind')===KIND&&field(profile,'targetSide')==='enemy'
  &&field(profile,'shape')==='single'&&field(profile,'maxTargets')===1
  &&Number(profile.multiplier??profile.dmg)===0
  &&field(profile,'requiresExplicitTargetEligibility')===true
  &&field(profile,'nonlethal')===true
  &&(field(profile,'controlDuration')??field(profile,'effectDuration')??field(profile,'duration'))===SOURCE_BUBBLE_CAPTURE_CONTRACT_WAVE17.duration;
}

export function isSourceBubbleCaptureTargetEligibleWave17(profile,target){
 if(!isSourceBubbleCaptureProfileWave17(profile)||!living(target)||target.isBoss||target.isWorldBoss
  ||target.controlImmune||target.captureImmune||target.invulnerable>0
  ||target.rpgControlTicks>0||target.sourceControlWave16?.active
  ||target.combatControl?.remaining>0||target.sourceBubbleCaptureWave17?.active
  ||target.sourceProtectionWave16?.active&&target.sourceProtectionWave16.kind==='mugman-super-art-ii')return false;
 const id=target.sourceEnemyId??target.enemyId??sourceId(target);
 return target.bubbleCaptureEligible===true
  ||target.universe===UNIVERSE&&canonicalKittens.has(id);
}

export function beginSourceBubbleCaptureWave17(source,target,profile,{
 hostile=false,sourceRuntimeId=runtimeId(source),targetRuntimeId=runtimeId(target)
}={}){
 if(hostile!==true||!living(source)||source===target||sourceId(source)!==HERO||source.universe!==UNIVERSE
  ||!isSourceBubbleCaptureTargetEligibleWave17(profile,target)
  ||typeof sourceRuntimeId!=='string'||typeof targetRuntimeId!=='string'
  ||!sourceRuntimeId||!targetRuntimeId||sourceRuntimeId===targetRuntimeId)return null;
 return Object.freeze({kind:KIND,active:true,phase:'captured',sourceHeroId:HERO,universe:UNIVERSE,
  sourceRuntimeId,targetRuntimeId,remaining:1.25,duration:1.25,turnsRemaining:1,
  originalSide:target.side??target.team??null,nonlethal:true,immobilize:true,
  suppressActions:true,lift:0,changesFaction:false,inputProxy:null,
  durationIsEngineAdaptation:true,source1to1Verified:false});
}

export function advanceSourceBubbleCaptureWave17(state,seconds,{
 paused=false,sourceAlive=true,targetAlive=true,sourcePresent=true,targetPresent=true,
 released=false,targetTurnConsumed=false
}={}){
 if(!state?.active||state.kind!==KIND)return state;
 const end=reason=>Object.freeze({...state,active:false,phase:'released',remaining:0,
  turnsRemaining:0,immobilize:false,suppressActions:false,lift:0,endedBy:reason});
 if(!targetAlive)return end('target-dead');
 if(!sourceAlive)return end('source-dead');
 if(!sourcePresent||!targetPresent)return end(!sourcePresent?'source-removed':'target-removed');
 if(released)return end('released');
 if(paused)return state;
 if(targetTurnConsumed)return end('target-turn-consumed');
 if(!Number.isFinite(seconds)||seconds<=0)return state;
 const remaining=Math.max(0,state.remaining-seconds);
 return remaining>0?Object.freeze({...state,remaining}):end('expired');
}

export function isSourceBubbleCapturedWave17(state,{
 sourceAlive=true,targetAlive=true,sourcePresent=true,targetPresent=true,
 sourceRuntimeId=state?.sourceRuntimeId,targetRuntimeId=state?.targetRuntimeId
}={}){
 return !!state&&state.kind===KIND&&state.active===true&&state.phase==='captured'
  &&state.remaining>0&&state.immobilize===true&&state.suppressActions===true
  &&sourceAlive&&targetAlive&&sourcePresent&&targetPresent
  &&sourceRuntimeId===state.sourceRuntimeId&&targetRuntimeId===state.targetRuntimeId;
}

// Kept explicit so engines can share the same vocabulary as other source controls.
export const createSourceBubbleCaptureWave17=beginSourceBubbleCaptureWave17;
