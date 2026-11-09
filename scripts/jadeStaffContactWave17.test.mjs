import assert from 'node:assert/strict';import {test} from 'node:test';
import registry from '../src/game/combat/characterJadeActionWave17.generated.json' with {type:'json'};
import {HEROES_DB} from '../src/game/heroes.js';import {resolveCombatAbility} from '../src/game/combatIdentity.js';
import {createJadeStaffProjectorWave17,projectJadeStaffContactWave17,isJadeStaffActionWave17,intersectsJadeStaffHurtboxWave17} from '../src/game/combat/jadeStaffContactWave17.js';
import {getJadeGyrodiskActionFrameWave17,projectJadeGyrodiskOriginWave17} from '../src/game/combat/jadeGyrodiskActionWave17.js';
const hero=HEROES_DB.find(h=>h.id==='beyond_good_evil_jade'),actor={...hero,x:300,y:420,facing:1},simple=resolveCombatAbility(actor,'simple'),secondary=resolveCombatAbility(actor,'secondary');
const make=(id='light1',facing=1)=>({abilityProfile:simple,id,elapsed:.2,hitAt:.2,duration:.55,facing});
test('All nine native staff contact states project only inside physical contactcolumn2, in both camps, without mutation',()=>{
 for(const id of ['light1','light2','light3','crouchLight','charged','aerialNeutral','aerialForward','aerialDown','ledgeAttack'])for(const facing of [1,-1]){const a={...actor,id:'runtime:jade',sourceHeroId:hero.id,facing},action=make(id,facing),before=JSON.stringify([a,action]);const p=projectJadeStaffContactWave17(a,action);assert.ok(p,id);assert.equal(p.col,2);assert.equal(p.physicallyMeasured,true);assert.equal(p.gameplayEffect,'none');assert.equal(p.facing,facing);assert.equal(JSON.stringify([a,action]),before);assert.equal(projectJadeStaffContactWave17(a,{...action,elapsed:.19999}),null);assert.equal(projectJadeStaffContactWave17(a,{...action,elapsed:.2+(.55-.2)*.65}),null);}
 const right=projectJadeStaffContactWave17(actor,make()),left=projectJadeStaffContactWave17({...actor,facing:-1},make('light1',-1));assert.ok(Math.abs(right.tip.x+left.tip.x-600)<1e-9);assert.equal(right.tip.y,left.tip.y);
});
test('Photographs, glove projectiles, source forgeries and unmeasured native evidence cannot borrow a Daï-Jo capsule',()=>{
 const action=make();for(const bad of [{...actor,universe:'Foreign'},{...actor,id:'someone-else'},{...actor,sourceHeroId:'someone-else'}])assert.equal(projectJadeStaffContactWave17(bad,action),null);
 for(const p of [{...simple,name:'Camera'},{...simple,delivery:'projectile'},{...simple,effect:'buff'},{...simple,sourceHeroId:'someone-else'},secondary])assert.equal(projectJadeStaffContactWave17(actor,{...action,abilityProfile:p}),null);
 for(const a of [{...action,id:'super'},{...action,elapsed:NaN},{...action,hitAt:0},{...action,duration:Infinity}])assert.equal(projectJadeStaffContactWave17(actor,a),null);
 const changed=structuredClone(registry),entry=changed.entries.find(e=>e.normalization.staffContactMeasurements.attackLight1);entry.normalization.staffContactMeasurements.attackLight1.sheetSha256='0'.repeat(64);assert.equal(createJadeStaffProjectorWave17(changed)(actor,action),null);assert.equal(isJadeStaffActionWave17(actor,{...action,abilityProfile:secondary}),false);
});
test('Capsule/hurtbox collision uses the real rounded segment and rejects a range-only hit or a square-corner false positive',()=>{
 const p={kind:'jade-daijo-contact-wave17',sourceHeroId:hero.id,universe:hero.universe,physicallyMeasured:true,start:{x:0,y:0},tip:{x:10,y:0},radius:1};
 assert.equal(intersectsJadeStaffHurtboxWave17(p,{left:4,top:-.5,right:6,bottom:.5}),true);assert.equal(intersectsJadeStaffHurtboxWave17(p,{left:10.6,top:.6,right:11.6,bottom:1.6}),true);assert.equal(intersectsJadeStaffHurtboxWave17(p,{left:10.8,top:.8,right:11.8,bottom:1.8}),false);assert.equal(intersectsJadeStaffHurtboxWave17(p,{left:40,top:-20,right:60,bottom:20}),false);assert.equal(intersectsJadeStaffHurtboxWave17(p,{left:1,top:1,right:0,bottom:0}),false);assert.equal(intersectsJadeStaffHurtboxWave17({...p,physicallyMeasured:false},{left:4,top:-1,right:6,bottom:1}),false);
});
test('Gyrodisk plays all16 distinct action frames and emits from the measured glove at exact release, including RPG/Tactics views',()=>{
 const action={identity:secondary,duration:.55,hitAt:.2,elapsed:0,facing:1},seen=new Set();for(let i=0;i<5500;i++){const f=getJadeGyrodiskActionFrameWave17(actor,action,{elapsed:i/10000});if(f)seen.add(f.index);}assert.deepEqual([...seen],[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);assert.equal(getJadeGyrodiskActionFrameWave17(actor,{...action,elapsed:.2}).index,10);
 const before=JSON.stringify([actor,action]),right=projectJadeGyrodiskOriginWave17(actor,action),left=projectJadeGyrodiskOriginWave17({...actor,facing:-1},{...action,facing:-1});assert.ok(right.separateFromCamera);assert.equal(right.index,10);assert.equal(right.y,left.y);assert.ok(Math.abs(right.x+left.x-600)<1e-9);assert.equal(JSON.stringify([actor,action]),before);
 for(const key of ['rpgGyrodiskActionWave17','tacticsGyrodiskActionWave17'])assert.equal(getJadeGyrodiskActionFrameWave17({...actor,[key]:{...action,elapsed:.2}}).index,10);
 assert.equal(getJadeGyrodiskActionFrameWave17({...actor,universe:'Foreign'},action),null);assert.equal(getJadeGyrodiskActionFrameWave17(actor,{...action,identity:simple}),null);assert.equal(projectJadeGyrodiskOriginWave17({...actor,x:NaN},action),null);
});
