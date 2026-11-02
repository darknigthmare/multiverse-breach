import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createServer } from 'vite';
import { isCombatGameplayAdvancing } from '../src/game/combatActivity.js';
import { readFileSync } from 'node:fs';
let vite, heroes, Rpg, Smash, Fighter, Tactics, install, kits, getSupport;
const noop=()=>{}; const particles={add:noop};
before(async()=>{
  vite=await createServer({appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
  ({HEROES_DB:heroes}=await vite.ssrLoadModule('/src/game/heroes.js'));
  ({EngineRpg:Rpg}=await vite.ssrLoadModule('/src/game/engineRpg.js'));
  ({EngineSmash:Smash}=await vite.ssrLoadModule('/src/game/engineSmash.js'));
  ({EngineFighter:Fighter}=await vite.ssrLoadModule('/src/game/engineFighter.js'));
  ({EngineTactics:Tactics}=await vite.ssrLoadModule('/src/game/engineTactics.js'));
  ({installSignatureDirector:install}=await vite.ssrLoadModule('/src/game/signatureDirector.js'));
  ({SIGNATURE_SOURCE_KITS:kits}=await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  ({getTacticsSupportProfile:getSupport}=await vite.ssrLoadModule('/src/game/tacticsSupport.js'));
});
after(async()=>{await vite?.close();});
const medic=()=>structuredClone(heroes.find(h=>h.id==='team_fortress_2_medic'));
const ally=(id='patient')=>({id,name:id,universe:'Team Fortress 2',stats:{hp:1000,atk:1,def:0,spd:1},simple:{name:'QA strike',dmg:1,type:'melee'},defense:{name:'Guard',reduce:0,dur:1}});
function make(mode, squad=[medic(),ally(),ally('third')]) {
  const foe={id:'qa-foe',name:'QA foe',universe:'Team Fortress 2',hp:20000,atk:1,def:0,spd:1};
  const C={RPG:Rpg,Smash,Tactics}[mode];
  const e=new C(760,420,squad,{customRoster:[foe],monsters:[foe],bosses:[]},particles,noop,noop,
    {mode,universe:'Team Fortress 2',disableHazards:true,disableSignatureAI:true,customBattle:{singleRoster:true,opponentControl:'p2'}});
  e.syncPreMatchFromServer?.(3000); e.completeMeleeIntros?.();
  for(const a of [...e.heroes,...e.enemies]) Object.assign(a,{state:'idle',stateTimer:0,action:null,actionPending:false,charging:false,guarding:false,ledge:null,atb:0,specialCharge:0,vx:0,vy:0,y:260});
  e.heroes.forEach((a,i)=>Object.assign(a,{x:200+45*i,gridX:1+i,gridY:2,facing:1}));
  e.enemies.forEach(a=>Object.assign(a,{x:420,gridX:6,gridY:2,facing:-1}));
  if(mode==='Tactics') {e.obstacles=[];e.tiles=[];e.cols=8;e.rows=5;e.escortUnit=null;e.protectedArtifact=null;e.objective='rout';}
  else install(e,{mode});
  Object.assign(e.heroes[0],{atb:100,specialCharge:100});return e;
}
function activate(e,mode){
  const c=e.heroes[0],p=e.heroes[1];
  if(mode==='Tactics') {
    Object.assign(e,{activeUnit:c,activeUnitType:'hero',actionPhase:'move',selectedAction:null,selectedActionExplicit:false});
    assert.equal(e.selectAction('special'),true);
    const clicked=e.handleCellClick(p.gridX,p.gridY);assert.equal(clicked.handled,true,JSON.stringify(clicked));assert.equal(c.specialCharge,0);
  } else {
    assert.equal(mode==='RPG'?e.executeRpgAction(e.getActionContext(c,'special','player'),[p.battleId]):e.triggerAbility(c,'special'),true);
    const d=kits.team_fortress_2_medic;
    for(let i=0;i<d.windupTicks+d.revealTicks+(d.hits-1)*d.hitGapTicks+d.outroTicks;i++) e.update({},{},{preMatchDeltaMs:1000/60,stageDeltaMs:1000/60});
  }
}
function snapshot(e,mode){return mode==='Tactics'?e.medicSupport.snapshot():e.signatureDirector.getSupportState();}
for(const mode of ['RPG','Smash','Tactics']) for(const victim of ['caster','patient']) {
  test(`${mode}: ${victim} KO followed by immediate revival cannot preserve old protection`,()=>{
    const e=make(mode);
    try {
      activate(e,mode);assert.equal(snapshot(e,mode).length,1);
      const u=e.heroes[victim==='caster'?0:1],p=e.heroes[1];
      e.applyDamage({x:0,y:260,gridX:0,gridY:2,stats:{atk:1}},u,1e6,0);
      assert.equal(u.currentHp,0);
      Object.assign(u,{currentHp:u.maxHp,state:'idle',stateTimer:0,action:null,actionPending:false,invulnTimer:0});
      const links=snapshot(e,mode);assert.ok(links.every(l=>![p.battleId,p.runtimeId,p.id].filter(Boolean).includes(l.patientId)));
      const hp=p.currentHp;e.applyDamage(e.enemies[0],p,50,0);assert.ok(p.currentHp<hp);
    }finally{e.dispose();}
  });
}
for(const mode of ['RPG','Smash']) test(`${mode}: two simultaneous Medics retain independent links after first caster KO`,()=>{
  const e=make(mode,[medic(),ally(),{...medic(),id:'second-medic',sourceId:'team_fortress_2_medic'}]);
  try {
    activate(e,mode);const second=e.heroes[2];Object.assign(second,{atb:100,specialCharge:100});
    const fired=mode==='RPG'?e.executeRpgAction(e.getActionContext(second,'special','player'),[e.heroes[1].battleId]):e.triggerAbility(second,'special');
    assert.equal(fired,true);
    for(let i=0;i<100;i++)e.update({},{},{preMatchDeltaMs:1000/60,stageDeltaMs:1000/60});
    assert.equal(snapshot(e,mode).length,2);
    e.applyDamage({x:0,y:260,stats:{atk:1}},e.heroes[0],1e6,0);
    assert.equal(snapshot(e,mode).length,1);
  }finally{e.dispose();}
});
for(const variant of ['stock','kritzkrieg','quick-fix','vaccinator']) test(`Tactics: ${variant} never becomes an offensive super`,()=>{
  const e=make('Tactics',[{...medic(),medigunType:variant},ally(),ally('third')]);
  try {
    const c=e.heroes[0],p=e.heroes[1],third=e.heroes[2],enemy=e.enemies[0];
    assert.equal(getSupport(c,'special').effect,'guard');
    assert.equal(e.getDamagePreview(c,enemy,'special').damage,0);
    Object.assign(e,{activeUnit:c,activeUnitType:'hero',actionPhase:'move',selectedAction:null,selectedActionExplicit:false});
    assert.equal(e.selectAction('special'),true);
    assert.equal(e.handleCellClick(enemy.gridX,enemy.gridY).handled,false);
    assert.equal(c.specialCharge,100);
    if(variant!=='stock'){assert.equal(e.handleCellClick(p.gridX,p.gridY).handled,false);return;}
    activate(e,'Tactics');const hp=p.currentHp,other=third.currentHp;
    assert.equal(e.getDamagePreview(enemy,p).damage,0);
    assert.equal(e.applyDamage(enemy,p,50),0);assert.equal(p.currentHp,hp);
    e.applyDamage(enemy,third,50);assert.ok(third.currentHp<other);
    const before=snapshot(e,'Tactics');e.setPaused(true);for(let i=0;i<70;i++)e.update();assert.deepEqual(snapshot(e,'Tactics'),before);e.setPaused(false);
    p.gridX=7;assert.equal(e.medicSupport.protects(p),false);p.gridX=2;assert.equal(e.medicSupport.protects(p),false);
    assert.equal(e.medicSupport.protects(c),true);e.applyDamage(c,enemy,10);assert.equal(e.medicSupport.protects(c),false);
  }finally{e.dispose();}
});
test('Tactics: barrier, self-target, exact duration and repeat-cast rejection',()=>{
  const e=make('Tactics');try{
    const c=e.heroes[0],p=e.heroes[1];p.gridX=4;
    e.obstacles=[{type:'barrier',gridX:2,gridY:2,hp:100}];
    assert.equal(e.performSupportAction(c,p,'special').length,0);
    assert.equal(e.performSupportAction(c,c,'special').length,1);
    assert.equal(e.performSupportAction(c,c,'special').length,0);
    e.medicSupport.advance(479);assert.equal(e.medicSupport.protects(c),true);
    e.medicSupport.advance();assert.equal(e.medicSupport.protects(c),false);
  }finally{e.dispose();}
});
function fighter(side='player',variant='stock'){
  const squad=[{...medic(),medigunType:variant},ally('reserve')], rivals=[ally('foe')];
  const e=new Fighter(760,420,side==='player'?squad:rivals,side==='cpu'?squad:rivals,particles,noop,noop,{opponentControl:'p2'});
  e.countdown=0;e.getActive(side).meter=100;return e;
}
for(const side of ['player','cpu']) test(`Fighter ${side}: stock super protects self, no offensive hit, no bench protection`,()=>{
  const e=fighter(side);const c=e.getActive(side),enemy=e.getOpponent(side),reserve=e.getTeam(side).fighters[1];
  c.x=200;enemy.x=280;const hp=enemy.currentHp;
  assert.equal(e.tryAction(side,'super'),true);assert.equal(c.meter,0);assert.equal(e.medicSupport.protects(c),false);
  e.updateActions(0.46);assert.equal(enemy.currentHp,hp);assert.equal(e.medicSupport.protects(c),true);assert.equal(e.medicSupport.protects(reserve),false);
  const own=c.currentHp,enemyMeter=enemy.meter;
  e.applyHit(enemy,c,{type:'light',base:100,knockback:100,guardDamage:50});
  assert.equal(c.currentHp,own);assert.equal(enemy.meter,enemyMeter);assert.ok(Math.abs(c.vx)>0);
  e.updateActions(0.5);c.meter=100;assert.equal(e.tryAction(side,'super'),false);assert.equal(c.meter,100);
  e.medicSupport.advance(479);assert.equal(e.medicSupport.protects(c),true);e.medicSupport.advance();assert.equal(e.medicSupport.protects(c),false);
});
for(const variant of ['kritzkrieg','quick-fix','vaccinator'])test(`Fighter rejects unsupported ${variant} without damage or resource spending`,()=>{
  const e=fighter('player',variant);assert.equal(e.tryAction('player','super'),false);assert.equal(e.getActive('player').meter,100);
});
test('Fighter: attacking, tagging and completion tear down the caster link',()=>{
  for(const action of ['attack','tag','finish']){
    const e=fighter(),c=e.getActive('player');assert.equal(e.tryAction('player','super'),true);e.updateActions(1);
    assert.equal(e.medicSupport.protects(c),true);
    if(action==='attack') assert.equal(e.tryAction('player','light'),true);
    if(action==='tag') assert.equal(e.requestTag('player',1),true);
    if(action==='finish') e.finish('victory');
    assert.equal(e.medicSupport.protects(c),false);
  }
});
test('Fighter: interrupting the windup prevents protection from manifesting',()=>{
  const e=fighter(),c=e.getActive('player');e.tryAction('player','super');
  e.applyHit(e.getOpponent('player'),c,{type:'light',base:5,knockback:0,guardDamage:0});
  e.updateActions(1);assert.equal(e.medicSupport.protects(c),false);assert.equal(c.meter>100,false);
});
test('wrong universe and customized special never acquire the stock adapter',()=>{
  for(const source of [{...medic(),universe:'Other'}, {...medic(),special:{name:'Custom',dmg:1,type:'melee'}}]){
    const e=make('Tactics',[source,ally()]);try{assert.equal(getSupport(e.heroes[0],'special'),null);}finally{e.dispose();}
  }
});
for(const [name,patch] of Object.entries({pause:{paused:true},disposed:{disposed:true},gameOver:{gameOver:true},targeting:{isTargetingPaused:()=>true},countdown:{isMatchInputLocked:()=>true},cinematic:{signatureDirector:{freezesWorld:true}}})){
  test(`active clock excludes ${name}`,()=>assert.equal(isCombatGameplayAdvancing(patch),false));
}
test('catch-up batch counts only genuinely active steps, including cinematic end/start',()=>{
  const e={signatureDirector:{freezesWorld:true}};let active=0;
  for(let i=0;i<6;i++){const advancing=isCombatGameplayAdvancing(e);if(i===2)e.signatureDirector.freezesWorld=false;if(i===4)e.signatureDirector.freezesWorld=true;if(advancing)active++;}
  assert.equal(active,2);assert.equal(isCombatGameplayAdvancing(null),false);
  const source=readFileSync(new URL('../src/components/GameCanvas.jsx',import.meta.url),'utf8');
  assert.match(source,/const advancing = !simulationPaused && isCombatGameplayAdvancing\(engine\)/);
  assert.match(source,/combatTime \+= activeCombatSteps/);assert.doesNotMatch(source,/combatTime \+= updateLoops/);
});
test('OC command specifications match real 100-ATB readiness and consumption, without a rebalance',()=>{
  const source=heroes.find(h=>h.id==='nyra_vale');assert.ok(source);
  for(const command of source.production.modeKits.RPG.commands)assert.equal(command.atbCost,100);
  const e=make('RPG',[structuredClone(source),ally()]);try{
    const c=e.heroes[0];
    for(const atb of [35,65,99]){c.atb=atb;assert.equal(e.canUseAction(c,'simple'),false);assert.equal(c.atb,atb);}
    c.atb=100;assert.equal(e.canUseAction(c,'simple'),true);
    assert.equal(e.executeRpgAction(e.getActionContext(c,'simple','player'),[e.enemies[0].battleId]),true);assert.equal(c.atb,0);
  }finally{e.dispose();}
});
test('mode-specific custom profiles are never replaced by a stock kit',()=>{
  const custom={effect:'heal',targetSide:'ally',shape:'single',range:2};
  const source=medic();source.special.tacticsProfile=custom;
  const e=make('Tactics',[source,ally()]);try{
    assert.equal(e.heroes[0].special.sourceSignatureKey,undefined);
    assert.equal(getSupport(e.heroes[0],'special').protection,undefined);
    assert.deepEqual(source.special.tacticsProfile,custom);
  }finally{e.dispose();}
});
