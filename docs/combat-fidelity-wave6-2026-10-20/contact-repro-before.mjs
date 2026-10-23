import { createServer } from '/workspace/multiverse-breach/node_modules/vite/dist/node/index.js';
import fs from 'node:fs/promises';
const vite=await createServer({root:'/workspace/multiverse-breach',appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
const {EngineRpg}=await vite.ssrLoadModule('/src/game/engineRpg.js?independent-wave6');
const {EngineFighter}=await vite.ssrLoadModule('/src/game/engineFighter.js?independent-wave6');
const {HEROES_DB}=await vite.ssrLoadModule('/src/game/heroes.js');
const {getCharacterSuperVisualState,drawCharacterSuperVisuals}=await vite.ssrLoadModule('/src/game/combat/characterSuperVisuals.js');
const noop=()=>{}, particles={add:noop}, cases=[], engines=[];
const dummy=id=>({id,name:id,universe:'Independent wave6 audit',stats:{hp:5000,atk:20,def:8,spd:5},simple:{name:'Contact',type:'melee',dmg:1},secondary:{name:'Contact',type:'melee',dmg:1},defense:{name:'Guard',type:'shield',reduce:.4},special:{name:'Contact',type:'melee',dmg:2}});
try{
for(const id of ['snake','raiden'])for(const side of ['player','enemy']){
 const own=HEROES_DB.find(h=>h.id===id), d=dummy('edge-target'), players=side==='player'?[own]:[d], opponents=side==='player'?[d]:[own];
 const engine=new EngineRpg(1000,500,players,{monsters:opponents,bosses:[],customRoster:opponents},particles,noop,noop,{universe:'Nexus de Convergence',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}});engines.push(engine);engine.autoBattle=false;
 const actor=(side==='player'?engine.heroes:engine.enemies)[0],target=(side==='player'?engine.enemies:engine.heroes)[0];
 for(const [a,x]of [[actor,30],[target,55]]){a.x=x;a.y=330;a.homeX=x;a.homeY=330;a.state='idle';a.atb=100;a.specialCharge=100;a.currentHp=5000;a.maxHp=5000;engine.fitCombatantToArena(a);}
 const start={actorX:actor.x,targetX:target.x},beforeHp=target.currentHp;
 const ok=side==='player'?engine.triggerAbility(actor,'special',[target.battleId]):engine.triggerEnemyAbility(actor,'special',[target.battleId]);
 const initial={actorX:actor.x,bodyFacing:actor.facing,visualFacing:actor.rpgSpecialVisual?.facing};
 const visual=actor.rpgSpecialVisual;
 const sample=()=>getCharacterSuperVisualState({actor,profile:visual.profile,action:{elapsed:.47,duration:1.1,hitAt:.451,facing:visual.facing},target:visual.target,height:72});
 const beforeImpactVisual=sample();
 for(let i=0;i<29;i++)engine.update();
 cases.push({case:'RPG edge approach',id,side,ok,start,afterApproach:initial,contactEligible:beforeImpactVisual.contactEligible,visualTarget:beforeImpactVisual.target,actualDamage:beforeHp-target.currentHp});
}
for(const id of ['snake','raiden'])for(const side of ['player','cpu']){
 const own=HEROES_DB.find(h=>h.id===id),d=dummy('air-target'),engine=new EngineFighter(1000,500,side==='player'?[own]:[d],side==='player'?[d]:[own],particles,noop,noop,{opponentControl:'p2'});engines.push(engine);engine.countdown=0;
 const actor=engine.getActive(side),target=engine.getOpponent(side),facing=side==='player'?1:-1;actor.x=side==='player'?200:800;actor.facing=facing;actor.meter=100;target.x=actor.x+facing*100;target.y=actor.y-94;target.currentHp=5000;target.maxHp=5000;
 const hp=target.currentHp,ok=engine.triggerSideAction(side,'super');engine.updateActions(.47);
 const state=getCharacterSuperVisualState({actor,profile:actor.action.identity,action:actor.action,target,height:142});const marks=[];
 const ctx=new Proxy({globalAlpha:1},{get(t,k){if(k in t)return t[k];return(...a)=>marks.push([k,...a]);},set(t,k,v){t[k]=v;return true;}});drawCharacterSuperVisuals(ctx,state);
 cases.push({case:'Fighter airborne near-miss',id,side,ok,dy:target.y-actor.y,contactEligible:state.contactEligible,actualDamage:hp-target.currentHp,targetContactMarks:marks.filter(a=>a[0]==='ellipse'||a[0]==='lineTo')});
}
console.log(JSON.stringify(cases,null,2));await fs.writeFile('/tmp/wave6-independent-audit-result.json',JSON.stringify(cases,null,2));
}finally{engines.forEach(e=>e.dispose?.());await vite.close();}
