import { before, after, afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
let vite, kits, prepare, resolve, heroes, enemies, EngineRpg, EngineSmash, install, Panel;
const engines=[];
before(async()=>{
  vite=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
  ({SIGNATURE_SOURCE_KITS:kits,prepareSourceSignature:prepare,resolveSourceSignature:resolve}=await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  ({HEROES_DB:heroes}=await vite.ssrLoadModule('/src/game/heroes.js'));
  ({default:Panel}=await vite.ssrLoadModule('/src/components/SignatureSequencePanel.jsx'));
  ({ENEMIES_DB:enemies}=await vite.ssrLoadModule('/src/game/enemies.js'));
  ({EngineRpg}=await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({EngineSmash}=await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({installSignatureDirector:install}=await vite.ssrLoadModule('/src/game/signatureDirector.js'));
});
afterEach(()=>engines.splice(0).forEach(e=>e.dispose()));
after(async()=>vite?.close());
const template=d=>d.actorId?heroes.find(a=>a.id===d.actorId):[...enemies[d.universe].monsters,...enemies[d.universe].bosses,enemies[d.universe].worldBoss].filter(Boolean).find(a=>a.name===d.enemyName);
const tick=(e,n=1)=>{for(let i=0;i<n;i++)e.update({},{},{preMatchDeltaMs:1000/60,stageDeltaMs:1000/60});};
function make(key='city_hunter',mode='Smash',side='player'){
  const d=kits[key], source=structuredClone(template(d));source.universe=d.universe;
  source.stats||={hp:source.hp,atk:source.atk,def:source.def||0,spd:source.spd||1};
  const fixture={id:'disc-fixture',name:'Stationary QA target',universe:d.universe,hp:20000,atk:1,spd:1,stats:{hp:20000,atk:1,def:0,spd:1},simple:{name:'Test',type:'melee',dmg:1}};
  const leader=side==='player'?source:fixture,foe=side==='enemy'?{...source,hp:source.stats.hp,atk:source.stats.atk}:fixture;
  const e=new (mode==='RPG'?EngineRpg:EngineSmash)(760,420,[leader],{customRoster:[foe],monsters:[foe],bosses:[]},{add(){}},()=>{},()=>{},
    {universe:d.universe,mode,disableHazards:true,disableSignatureAI:true,customBattle:{singleRoster:true,opponentControl:'p2'}});
  e.syncPreMatchFromServer?.(3000);e.completeMeleeIntros?.();
  for(const a of [...e.heroes,...e.enemies])Object.assign(a,{state:'idle',stateTimer:0,action:null,actionPending:false,charging:false,guarding:false,ledge:null,atb:0,specialCharge:0,vx:0,vy:0,y:e.groundY||260});
  e.heroes[0].x=200;e.heroes[0].facing=1;e.enemies[0].x=490;e.enemies[0].facing=-1;
  const actor=side==='player'?e.heroes[0]:e.enemies[0],target=side==='player'?e.enemies[0]:e.heroes[0];
  actor.atb=100;actor.specialCharge=100;install(e,{mode});engines.push(e);return{e,actor,target,d};
}
const trigger=(s,mode='Smash',side='player')=>mode==='RPG'?s.e.executeRpgAction(s.e.getActionContext(s.actor,'special',side),[s.target.battleId]):side==='player'?s.e.triggerAbility(s.actor,'special'):s.e.triggerOpponentAbility('special');
test('sixteen explicit new identities, three returning discs, prior waves unchanged',()=>{
  const rows=Object.values(kits).filter(d=>d.wave===4);assert.equal(rows.length,16);assert.equal(rows.filter(d=>d.projectile).length,3);
  assert.equal(Object.values(kits).filter(d=>!d.wave||d.wave<4).length,96);
  for(const d of rows){const a={...template(d),universe:d.universe};assert.ok(a.name,d.key);const source=JSON.stringify(a);assert.equal(resolve(a),d);prepare({...a});assert.equal(JSON.stringify(a),source);
    assert.ok(d.referenceUrl.startsWith('https://'));assert.equal(d.canonicalFidelityApproved,false);
    assert.equal(resolve({...a,universe:'Wrong',sourceUniverse:'Wrong'}),null);
    assert.equal(prepare({...a,special:{name:'Custom',dmg:4}}),null);
    assert.equal(prepare({...a,nonCombat:true}),null);
  }
});
for(const key of ['city_hunter','city_hunter_p2','Predator::City Hunter Predator'])for(const side of ['player','enemy'])test(`${key}/${side}: melee release, visible travel, one hit and return`,()=>{
  const s=make(key,'Smash',side),{e,actor,target,d}=s;const hp=target.currentHp;
  assert.equal(trigger(s,'Smash',side),true);assert.equal(actor.specialCharge,0);tick(e,d.windupTicks+d.revealTicks);
  assert.equal(target.currentHp,hp);assert.equal(e.signatureDirector.getProjectileState().length,1);
  const before=e.signatureDirector.getProjectileState();e.paused=true;tick(e,200);assert.deepEqual(e.signatureDirector.getProjectileState(),before);e.paused=false;
  const hits=[];const damage=e.applyDamage;e.applyDamage=(...args)=>{hits.push(args);return damage(...args);};tick(e,100);
  assert.equal(hits.filter(a=>a[1]===target).length,1);assert.ok(target.currentHp<hp);assert.equal(e.signatureDirector.getProjectileState().length,0);assert.equal(actor.actionPending,false);
});
test('RPG smart disc retains its abstract contact; does not create a melee projectile',()=>{
  const s=make('city_hunter','RPG'),hp=s.target.currentHp;assert.equal(trigger(s,'RPG'),true);tick(s.e,78);
  assert.ok(s.target.currentHp<hp);assert.equal(s.e.signatureDirector.getProjectileState().length,0);assert.equal(s.actor.atb,0);
});
for(const change of ['ko','action','universe','camp'])test(`flight cleanup after ${change} in the real engine`,()=>{
  const s=make();trigger(s);tick(s.e,54);assert.equal(s.e.signatureDirector.getProjectileState().length,1);
  if(change==='ko')s.e.applyDamage(s.target,s.actor,99999);
  if(change==='action')s.actor.special={...s.actor.special};
  if(change==='universe')s.actor.universe='Halo';
  if(change==='camp'){s.e.heroes=[];s.e.enemies.push(s.actor);}
  const hp=s.target.currentHp;assert.equal(s.e.signatureDirector.getProjectileState().length,0);tick(s.e,100);assert.equal(s.target.currentHp,hp);
});
test('lateral evasion causes a miss instead of homing onto a new unit',()=>{
  const s=make();trigger(s);tick(s.e,54);s.target.y-=120;
  // Hold the target at its new elevation to isolate the evasion from gravity.
  const physics=s.e.applyPhysics;s.e.applyPhysics=function(a){if(a===s.target)return;return physics.call(this,a);};
  const hp=s.target.currentHp;tick(s.e,160);assert.equal(s.target.currentHp,hp);assert.equal(s.e.signatureDirector.getProjectileState().length,0);
});
test('fresh full meter cannot launch a second disc while first is in flight',()=>{
  const s=make();trigger(s);tick(s.e,79);s.actor.specialCharge=100;s.actor.state='idle';
  assert.equal(s.e.signatureDirector.superReadiness(s.actor).reason,'projectile-active');assert.equal(trigger(s),false);assert.equal(s.actor.specialCharge,100);
});
test('leaving the combat removes flying entities without changing shared source actions',()=>{
  const s=make();const raw=JSON.stringify(template(s.d));trigger(s);tick(s.e,54);s.e.dispose();
  assert.deepEqual(s.e.signatureDirector.getProjectileState(),[]);assert.equal(JSON.stringify(template(s.d)),raw);
});

for (const lang of ['fr', 'en']) test(`projectile UI never reports its release as a confirmed hit (${lang})`, () => {
  const state = {phase:'return',name:'Disc',actorName:'Hunter',kind:'personal',tick:60,duration:78,hit:1,hits:1,projectile:'returning-disc'};
  const html = renderToStaticMarkup(createElement(Panel, {state, lang}));
  assert.ok(html.includes(lang === 'fr' ? 'dégâts uniquement au contact' : 'damage only on collision'));
  assert.ok(!html.includes('1/1'));
});
test('non-projectile sequences retain their existing contact count', () => {
  const html = renderToStaticMarkup(createElement(Panel, {state:{phase:'return',name:'Test',tick:10,duration:20,hit:3,hits:3}, lang:'fr'}));
  assert.ok(html.includes('3/3'));
});
