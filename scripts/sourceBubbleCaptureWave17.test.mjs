import assert from 'node:assert/strict';
import test from 'node:test';
import {beginSourceBubbleCaptureWave17,advanceSourceBubbleCaptureWave17,
 isSourceBubbleCapturedWave17,isSourceBubbleCaptureProfileWave17,
 isSourceBubbleCaptureTargetEligibleWave17} from '../src/game/combat/sourceBubbleCaptureWave17.js';
const profile=()=>({sourceHeroId:'tail_concerto_waffle',universe:'Tail Concerto',dmg:0,
 targeting:{effect:'control',delivery:'control',shape:'single',range:260,targetSide:'enemy',
  controlKind:'bubble-capture',duration:1.25,maxTargets:1,nonlethal:true,requiresExplicitTargetEligibility:true}});
const caster=()=>({id:'p1:waffle',sourceHeroId:'tail_concerto_waffle',universe:'Tail Concerto',currentHp:100,team:'p1',x:100,y:70});
const enemy=()=>({id:'p2:eligible',sourceHeroId:'ordinary-crossover-adult',universe:'Other',currentHp:70,team:'p2',x:140,y:70,bubbleCaptureEligible:true});

test('bubble capture preserves HP, position, identity and side while immobilising only the accepted target',()=>{
 const source=caster(),target=enemy(),before=JSON.stringify([source,target]);
 const state=beginSourceBubbleCaptureWave17(source,target,profile(),{hostile:true});
 assert.ok(state);assert.equal(isSourceBubbleCapturedWave17(state),true);
 assert.equal(state.nonlethal,true);assert.equal(state.lift,0);assert.equal(state.changesFaction,false);
 assert.equal(state.inputProxy,null);assert.equal(state.originalSide,'p2');
 assert.equal(JSON.stringify([source,target]),before);assert.equal(Object.isFrozen(state),true);
});

test('source identity, profile effect and explicit target permission cannot be forged',()=>{
 for(const key of ['sourceHeroId','universe']){const p=profile();p[key]='forged';assert.equal(isSourceBubbleCaptureProfileWave17(p),false);}
 for(const [key,value]of [['controlKind','possession'],['effect','damage'],['delivery','projectile'],['targetSide','ally'],['shape','group'],['maxTargets',8],['nonlethal',false],['requiresExplicitTargetEligibility',false],['duration',99]]){
  const p=profile();p.targeting[key]=value;assert.equal(isSourceBubbleCaptureProfileWave17(p),false,key);
 }
 const p=profile();p.dmg=1;assert.equal(isSourceBubbleCaptureProfileWave17(p),false);
 assert.equal(beginSourceBubbleCaptureWave17({...caster(),sourceHeroId:'another'},enemy(),profile(),{hostile:true}),null);
 assert.equal(beginSourceBubbleCaptureWave17(caster(),enemy(),profile()),null);
 assert.equal(isSourceBubbleCaptureTargetEligibleWave17(profile(),{...enemy(),bubbleCaptureEligible:false}),false);
});

test('canonical kittens are eligible by exact source identity, bosses and protected bodies remain excluded',()=>{
 const kitten={...enemy(),sourceHeroId:'tail_concerto_red_vest_kitten',universe:'Tail Concerto',bubbleCaptureEligible:false};
 assert.equal(isSourceBubbleCaptureTargetEligibleWave17(profile(),kitten),true);
 assert.equal(isSourceBubbleCaptureTargetEligibleWave17(profile(),{...kitten,universe:'Other'}),false);
 for(const extra of [{isBoss:true},{isWorldBoss:true},{controlImmune:true},{captureImmune:true},{invulnerable:1},{currentHp:0},{state:'dead'},{rpgControlTicks:1},{sourceControlWave16:{active:true}},{combatControl:{remaining:1}},{sourceBubbleCaptureWave17:{active:true}},{sourceProtectionWave16:{active:true,kind:'mugman-super-art-ii'}}])
  assert.equal(isSourceBubbleCaptureTargetEligibleWave17(profile(),{...enemy(),...extra}),false,JSON.stringify(extra));
});

test('pause, real elapsed time and coarse steps expire the same finite capture without replaying it',()=>{
 const state=beginSourceBubbleCaptureWave17(caster(),enemy(),profile(),{hostile:true});
 assert.equal(advanceSourceBubbleCaptureWave17(state,100,{paused:true}),state);
 assert.equal(advanceSourceBubbleCaptureWave17(state,NaN),state);
 assert.equal(advanceSourceBubbleCaptureWave17(state,-1),state);
 const next=advanceSourceBubbleCaptureWave17(state,.5);assert.equal(next.remaining,.75);
 const ended=advanceSourceBubbleCaptureWave17(next,1);assert.equal(ended.active,false);
 assert.equal(ended.endedBy,'expired');assert.equal(ended.immobilize,false);assert.equal(ended.suppressActions,false);
 assert.equal(advanceSourceBubbleCaptureWave17(ended,100),ended);
});

test('one Tactics target turn releases capture and paused turns do not count',()=>{
 const state=beginSourceBubbleCaptureWave17(caster(),enemy(),profile(),{hostile:true});
 assert.equal(advanceSourceBubbleCaptureWave17(state,0,{paused:true,targetTurnConsumed:true}),state);
 const ended=advanceSourceBubbleCaptureWave17(state,0,{targetTurnConsumed:true});
 assert.equal(ended.active,false);assert.equal(ended.turnsRemaining,0);assert.equal(ended.endedBy,'target-turn-consumed');
});

test('death, removal, release and immediate eligibility reads clear both sides without waiting a tick',()=>{
 const state=beginSourceBubbleCaptureWave17(caster(),enemy(),profile(),{hostile:true});
 for(const key of ['sourceAlive','targetAlive','sourcePresent','targetPresent']){
  assert.equal(isSourceBubbleCapturedWave17(state,{[key]:false}),false,key);
  const ended=advanceSourceBubbleCaptureWave17(state,0,{[key]:false});assert.equal(ended.active,false,key);
 }
 assert.equal(isSourceBubbleCapturedWave17(state,{targetRuntimeId:'other'}),false);
 assert.equal(isSourceBubbleCapturedWave17(state,{sourceRuntimeId:'other'}),false);
 assert.equal(advanceSourceBubbleCaptureWave17(state,0,{released:true}).endedBy,'released');
});
