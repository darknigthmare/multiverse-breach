import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';
import { fileURLToPath } from 'node:url';
import { HEROES_DB } from '../src/game/heroes.js';
import { MELEE_STATES } from '../src/game/melee/meleeStateMachine.js';
import { getMeleeAnimationManifest, getMeleeAnimationFrame, getMeleeAnimationSheetSources, validateMeleeAnimationManifest } from '../src/game/melee/meleeAnimationManifest.js';
import { getHeroMeleeAnimationFrame } from '../src/game/spriteAssets.js';
const id='hellblade_senua',hero=HEROES_DB.find(h=>h.id===id),manifest=getMeleeAnimationManifest(id);
let vite,EngineSmash,tickMeleeCombatActor;
const noop=()=>{};
before(async()=>{
 vite=await createServer({root:fileURLToPath(new URL('../',import.meta.url)),configFile:false,publicDir:false,appType:'custom',logLevel:'silent',server:{middlewareMode:true,hmr:false,watch:{ignored:['**/*']}}});
 ({EngineSmash}=await vite.ssrLoadModule('/src/game/engineSmash.js'));
 ({tickMeleeCombatActor}=await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
});
after(async()=>{await vite?.close();});
function setup(side){
 const engine=new EngineSmash(1000,540,[hero],{monsters:[hero],bosses:[],customRoster:[hero]},{add:noop},noop,noop,{universe:'Hellblade: Senua’s Sacrifice',mode:'Smash',difficulty:'Training',skipPreMatchInTraining:true,disableHazards:true,disableItems:true,customBattle:{singleRoster:true,opponentControl:'p2'}});
 engine.syncPreMatchFromServer(3000);
 const actor=side==='player'?engine.heroes[0]:engine.enemies[0],target=side==='player'?engine.enemies[0]:engine.heroes[0];
 const facing=side==='player'?1:-1;
 for(const unit of [actor,target])Object.assign(unit,{currentHp:100000,maxHp:100000,y:engine.groundY,vx:0,vy:0,state:'idle',stateElapsed:0,action:null,meleePresentation:null,presentationPhase:null,meleeRecoveryTimer:0,shieldBreakTimer:0});
 Object.assign(actor,{x:facing>0?300:700,facing});Object.assign(target,{x:actor.x+facing*55,facing:-facing});
 return{engine,actor,target,side,facing};
}
function advance(c,seconds){for(let t=0;t<seconds-1e-9;){const dt=Math.min(1/60,seconds-t);tickMeleeCombatActor(c.actor,dt,{resolveActionHit:(actor,action)=>c.engine.resolveMeleeActionHit(actor,action)});t+=dt;}}
test('Senua has45 native state rows with180 bounded cells and no visual combat authority',()=>{
 assert.ok(hero);assert.deepEqual(validateMeleeAnimationManifest(manifest),[]);assert.deepEqual(Object.keys(manifest.animations).sort(),[...MELEE_STATES].sort());
 assert.equal(manifest.visualOnly,true);assert.equal(manifest.source1to1Verified,false);assert.equal(manifest.gameplayAuthority,'meleeCombatRuntime');
 const rectangles=new Set();for(const state of MELEE_STATES){const clip=manifest.animations[state];assert.equal(clip.frameCount,4);assert.deepEqual(clip.hitboxes,[]);assert.deepEqual(clip.events,[]);for(let frame=0;frame<4;frame++){const actual=getMeleeAnimationFrame(manifest,state,1000*(frame+.01)/clip.fps);assert.equal(actual.col,frame);rectangles.add(`${actual.animation.sheet}:${actual.row}:${actual.col}`);}}
 assert.equal(rectangles.size,180);assert.equal(getMeleeAnimationSheetSources(id).length,6);
});
test('both camps resolve their exact native source while foreign continuity cannot borrow Senua',()=>{
 for(const field of ['sourceHeroId','sourceId']){
  const actor={...hero,id:'p2:copied-senua',[field]:id,state:'run',stateElapsed:.2};
  const before=JSON.stringify(actor);assert.ok(getHeroMeleeAnimationFrame(actor,200));assert.equal(getMeleeAnimationSheetSources(actor).length,6);assert.equal(JSON.stringify(actor),before);
  assert.equal(getHeroMeleeAnimationFrame({...actor,universe:'Foreign continuity'},200),null);assert.deepEqual(getMeleeAnimationSheetSources({...actor,universe:'Foreign continuity'}),[]);
 }
});
for(const side of ['player','cpu'])test(`Senua ${side}: real light input applies one bounded hit independently of pose sampling`,()=>{
 for(const accepted of [true,false]){
  const c=setup(side);try{
   assert.equal(c.engine.triggerMeleeAction(side,'AttackLight'),true);assert.equal(c.actor.state,'attackLight1');const action=c.actor.action;
   if(!accepted)c.target.x=c.actor.x+c.facing*(action.range+500);
   const before=c.target.currentHp,actorBefore=JSON.stringify(c.actor),cells=[];
   for(const elapsed of [0,action.hitAt*.75,action.hitAt+.001,action.duration-.001]){
    const frame=getMeleeAnimationFrame(manifest,c.actor.state,0,{action:{...action,elapsed}});cells.push(frame.col);
   }
   assert.deepEqual(cells,[0,1,2,3]);assert.equal(c.target.currentHp,before);assert.equal(JSON.stringify(c.actor),actorBefore,'Sampling artwork cannot advance actor or combat');
   advance(c,action.hitAt-.001);assert.equal(c.target.currentHp,before,'No damage in startup');advance(c,.003);
   const atImpact=c.target.currentHp;if(accepted)assert.ok(atImpact<before);else assert.equal(atImpact,before,'A distant target cannot be hit by the illustration');
   advance(c,1.2);assert.equal(c.target.currentHp,atImpact,'No repeated impact from later native poses');
  }finally{c.engine.dispose?.();}
 }
});
for(const side of ['player','cpu'])test(`Senua ${side}: mirror Focus consumes100 only once, applies support after hitAt and never hurts opponent`,()=>{
 const c=setup(side);try{
  c.actor.specialCharge=100;const actorHp=c.actor.currentHp,targetHp=c.target.currentHp;
  assert.equal(c.engine.triggerMeleeAction(side,'Special'),true);const action=c.actor.action;
  assert.equal(action.id,'super');assert.equal(action.superProfile.effect,'buff');assert.equal(action.superProfile.delivery,'support');assert.equal(c.actor.specialCharge,0);
  assert.equal(c.actor.meleeSuperSupport,undefined);advance(c,action.hitAt-.001);assert.equal(c.actor.meleeSuperSupport,undefined);assert.equal(c.target.currentHp,targetHp);
  advance(c,.003);assert.equal(c.actor.meleeSuperSupport.buffMultiplier,1.45);assert.ok(c.actor.meleeSuperSupport.remaining>0&&c.actor.meleeSuperSupport.remaining<=6);assert.equal(c.actor.currentHp,actorHp);assert.equal(c.target.currentHp,targetHp);
  assert.equal(c.engine.triggerMeleeAction(side,'Special'),false);advance(c,1.4);assert.equal(c.actor.specialCharge,0);assert.equal(c.target.currentHp,targetHp);
 }finally{c.engine.dispose?.();}
});
