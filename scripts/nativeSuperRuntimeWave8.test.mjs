import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import sharp from 'sharp';

const IDS = ['robin_tt','cyborg_tt','raven_tt','starfire_tt','beast_boy_tt','kiryu_yakuza','majima_yakuza','ichiban_yakuza','saejima_yakuza','akiyama_yakuza','blade_wolf_mgr','jetstream_sam','armstrong_mgr','mistral_mgr','monsoon_mgr','laios_meshi','marcille_meshi','senshi_meshi','chilchuck_meshi','falin_meshi'];
const SUPPORT = new Set(['raven_tt','saejima_yakuza','senshi_meshi','chilchuck_meshi','falin_meshi']);
const CONTACT = ['robin_tt','beast_boy_tt','kiryu_yakuza','majima_yakuza','ichiban_yakuza','akiyama_yakuza','blade_wolf_mgr','jetstream_sam','mistral_mgr','laios_meshi'];
const MODES = ['rpg','melee','fighter'], SIDES = ['player','opponent'];
const observations = [], engines = [], noop = () => {}, particles = { add: noop };
let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, resolveCombatAbility, tickMeleeCombatActor, beginMeleeShield;
let supportsNative, supportsTracked, getVisual, drawVisual, sampleMotion, getCharacterVisual, drawCharacterVisual, sampleCharacterMotion, getFrame;
const hero = id => { const h=heroes.find(h=>h.id===id);assert.ok(h,id);return h; };
const dummy = id => ({id,name:id,universe:'Wave8 runtime training',category:'test',weaponType:'melee',primaryColor:'#89aacc',secondaryColor:'#ddeeff',
  stats:{hp:5000,atk:20,def:8,spd:5},simple:{name:'Training strike',type:'melee',dmg:1},secondary:{name:'Training shot',type:'bullet',dmg:1,cd:3},
  defense:{name:'Training guard',type:'shield',reduce:0.4,dur:1},special:{name:'Training finish',type:'bullet',dmg:2}});
const hp = actors => actors.map(a=>a.currentHp);
function make(mode,side,id,withAlly=true) {
  const own=[hero(id),...(withAlly?[dummy('allied-patient')]:[])],opposing=[dummy('near-one'),dummy('near-two'),dummy('far-one')];
  const players=side==='player'?own:opposing,opponents=side==='opponent'?own:opposing;
  let engine,engineSide,actor,allies,targets;
  if(mode==='fighter') {
    engine=new EngineFighter(1800,500,players,opponents,particles,noop,noop,{opponentControl:'p2'});engine.countdown=0;
    engineSide=side==='player'?'player':'cpu';actor=engine.getActive(engineSide);allies=engine.getTeam(engineSide).fighters;targets=engine.getTeam(side==='player'?'cpu':'player').fighters;
  } else {
    const data={monsters:opponents,bosses:[],customRoster:opponents},options={universe:'Nexus de Convergence',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}};
    engine=mode==='rpg'?new EngineRpg(1800,500,players,data,particles,noop,noop,options):new EngineSmash(1800,500,players,data,particles,noop,noop,{...options,mode:'Smash'});
    if(mode==='rpg')engine.autoBattle=false;else engine.syncPreMatchFromServer(3000);
    engineSide=side==='player'?'player':mode==='rpg'?'enemy':'cpu';allies=side==='player'?engine.heroes:engine.enemies;targets=side==='player'?engine.enemies:engine.heroes;actor=allies[0];
  }
  engines.push(engine);
  for(const unit of [...allies,...targets]) {
    unit.maxHp=Math.max(1000,unit.maxHp);unit.currentHp=unit.maxHp;unit.state='idle';unit.vx=0;unit.vy=0;unit.y=mode==='rpg'?330:engine.groundY;unit.atb=100;unit.specialCharge=100;
  }
  const facing=side==='player'?1:-1;actor.x=facing>0?200:1500;actor.facing=facing;actor.meter=100;
  allies.slice(1).forEach((a,i)=>{a.x=actor.x-facing*(80+i*15);});targets.forEach((t,i)=>{t.x=actor.x+facing*[60,75,-350][i];});
  return {mode,side,engineSide,engine,actor,allies,targets,facing};
}
const meter = c => c.mode==='fighter'?c.actor.meter:c.actor.specialCharge;
const setMeter = (c,value) => {if(c.mode==='fighter')c.actor.meter=value;else c.actor.specialCharge=value;};
function commit(c) {
  if(c.mode==='fighter')return c.engine.triggerSideAction(c.engineSide,'super');
  if(c.mode==='melee')return c.side==='player'?c.engine.triggerAbility(c.actor,'special'):c.engine.triggerOpponentAbility('special');
  if(!c.engine.beginTargeting(c.actor,'special',c.engineSide))return false;
  const targeting=c.engine.getTargetingState();if(!targeting)return true;
  if(targeting.shape==='single'&&targeting.profile.targetSide==='enemy')assert.equal(c.engine.selectTarget(c.targets[0].battleId),true);
  c.expectedTargetIds=[...c.engine.getTargetingState().previewTargetIds];return c.engine.confirmTargeting();
}
function advance(c,seconds) {
  if(c.mode==='rpg'){for(let i=0;i<Math.round(seconds*60);i++)c.engine.update();return;}
  for(let elapsed=0;elapsed<seconds-1e-9;){const dt=Math.min(1/60,seconds-elapsed);
    if(c.mode==='fighter'){c.engine.updateActions(dt);c.engine.updateProjectiles(dt);}
    else tickMeleeCombatActor(c.actor,dt,{resolveActionHit:(actor,action)=>c.engine.resolveMeleeActionHit(actor,action)});
    elapsed+=dt;
  }
}
const snapshot = c => JSON.stringify({actor:c.actor,allies:c.allies,targets:c.targets,queue:c.engine.actionQueue,projectiles:c.engine.projectiles,impacts:c.engine.projectileVisualImpacts,damage:c.engine.damageDealt,stats:c.engine.stats});
function paused(c) {
  const before=snapshot(c);if(c.mode==='rpg')c.engine.setPaused(true);
  for(let i=0;i<100;i++)if(c.mode==='rpg')c.engine.update();else if(c.mode==='fighter'){c.engine.updateActions(0);c.engine.updateProjectiles(0);}else tickMeleeCombatActor(c.actor,0,{resolveActionHit:(actor,action)=>c.engine.resolveMeleeActionHit(actor,action)});
  if(c.mode==='rpg')c.engine.setPaused(false);assert.equal(snapshot(c),before,'Pause must preserve actors, HP, queues and physical projectiles');
}
function recorder() {
  const calls=[],stack=[];let properties={globalAlpha:0.7,lineWidth:9,strokeStyle:'#123456',fillStyle:'#654321'};const initial={...properties};
  const ctx=new Proxy({}, {get(_t,key){if(key in properties)return properties[key];if(key==='save')return()=>{stack.push({...properties});calls.push(['save']);};if(key==='restore')return()=>{assert.ok(stack.length);properties=stack.pop();calls.push(['restore']);};if(key==='createLinearGradient'||key==='createRadialGradient')return()=>({addColorStop:noop});return(...args)=>{args.filter(v=>typeof v==='number').forEach(v=>assert.ok(Number.isFinite(v),String(key)));calls.push([key,...args]);};},set(_t,key,value){if(typeof value==='number')assert.ok(Number.isFinite(value));properties[key]=value;calls.push(['set',key,value]);return true;}});
  return {ctx,calls,balanced(){assert.equal(stack.length,0);assert.deepEqual(properties,initial);}};
}
function render(c) {
  const r=recorder();if(c.mode==='rpg')c.engine.drawRpgCharacterSuperEffects(r.ctx);else if(c.mode==='melee')c.engine.drawMeleeSuper(r.ctx,c.actor);else c.engine.drawPersonalSuper(r.ctx,c.actor);r.balanced();return r.calls;
}
function pureDraw(c) {const before=snapshot(c),calls=render(c);for(let i=0;i<12;i++)assert.deepEqual(render(c),calls);assert.equal(snapshot(c),before);paused(c);assert.deepEqual(render(c),calls);return calls;}
const actionOf = c => c.mode==='rpg'?c.actor.rpgSpecialVisual:c.actor.action;
const hitAt = c => c.mode==='rpg'?c.engine.actionQueue[0].ticks/60:c.actor.action.hitAt;
const atImpact = c => advance(c,hitAt(c)+0.001);
const guardRemaining = (mode,actor) => mode==='rpg'?actor.rpgGuardTicks:mode==='fighter'?actor.superGuardSeconds:actor.meleeSuperSupport?.effect==='guard'?actor.meleeSuperSupport.remaining:0;

before(async()=>{
  vite=await createServer({root:fileURLToPath(new URL('..',import.meta.url)),appType:'custom',logLevel:'silent',server:{middlewareMode:true}});
  ({EngineRpg}=await vite.ssrLoadModule('/src/game/engineRpg.js?native-wave8'));({EngineSmash}=await vite.ssrLoadModule('/src/game/engineSmash.js?native-wave8'));({EngineFighter}=await vite.ssrLoadModule('/src/game/engineFighter.js?native-wave8'));
  ({HEROES_DB:heroes}=await vite.ssrLoadModule('/src/game/heroes.js'));({resolveMeleeSuper,resolveCombatAbility}=await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({tickMeleeCombatActor,beginMeleeShield}=await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({supportsNativeSuperWave8:supportsNative,supportsTrackedProjectileVisualWave8:supportsTracked,getNativeSuperVisualStateWave8:getVisual,drawNativeSuperVisualsWave8:drawVisual,sampleNativeSuperMotionWave8:sampleMotion}=await vite.ssrLoadModule('/src/game/combat/nativeSuperVisualsWave8.js'));
  ({getCharacterSuperVisualState:getCharacterVisual,drawCharacterSuperVisuals:drawCharacterVisual,sampleCharacterSuperMotion:sampleCharacterMotion}=await vite.ssrLoadModule('/src/game/combat/characterSuperVisuals.js'));
  ({getCharacterAnimationFrame:getFrame}=await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
});
after(async()=>{
  engines.forEach(e=>e.dispose?.());await vite?.close();
  if(process.env.NATIVE_WAVE8_REPORT_PATH){const sources=await Promise.all(['scripts/nativeSuperRuntimeWave8.test.mjs','src/game/engineRpg.js','src/game/engineSmash.js','src/game/engineFighter.js','src/game/combat/nativeSuperVisualsWave8.js','src/game/combat/characterSuperVisuals.js'].map(async path=>({path,sha256:createHash('sha256').update(await readFile(path)).digest('hex')})));
    await writeFile(process.env.NATIVE_WAVE8_REPORT_PATH,JSON.stringify({date:'2026-10-20',method:'Real Vite SSR engines, accepted gameplay changes and recorded canvas commands. Native decoding and real browser drawing are verified separately.',coverage:{identities:20,modes:MODES,sides:SIDES,supports:[...SUPPORT],contactSupers:CONTACT,trackedFighter:['starfire_tt']},sources,observations,source1to1Verified:false},null,2)+'\n');}
});

test('20 Wave8 identities dispatch purely with exact source identity and support accents stay at their own caster',()=>{
  for(const id of IDS)for(const facing of [1,-1])for(const progress of [0.15,0.55,0.9]){
    const actor={...hero(id),x:500,y:350,currentHp:1000},profile=resolveMeleeSuper(actor),supportive=SUPPORT.has(id);
    assert.equal(supportsNative(profile),true,id);assert.equal(supportsTracked(profile),id==='starfire_tt',id);
    const options={actor,profile,action:{duration:profile.duration,elapsed:progress*profile.duration,hitAt:profile.hitAt,facing},target:{x:500+facing*80,y:350,currentHp:1000},contactVisual:{confirmed:false}};
    const before=JSON.stringify(options),state=getVisual(options);assert.equal(state.family,'native-wave8');assert.equal(state.gameplayEffect,'none');assert.equal(state.source1to1Verified,false);assert.equal(state.supportive,supportive);assert.equal(state.contactEligible,false);
    assert.deepEqual(getCharacterVisual(options),state);const a=recorder(),b=recorder();assert.equal(drawVisual(a.ctx,state),true);assert.equal(drawCharacterVisual(b.ctx,getCharacterVisual(options)),true);a.balanced();b.balanced();assert.deepEqual(a.calls,b.calls);assert.equal(JSON.stringify(options),before);
    const moved=getVisual({...options,target:{x:-9000,y:-5000,currentHp:0},contactVisual:{confirmed:true,x:620,y:350}});
    if(supportive){assert.deepEqual(moved.target,state.ground);const r=recorder();drawVisual(r.ctx,moved);r.balanced();assert.deepEqual(r.calls,a.calls,'Support accent cannot follow an enemy');}
    else{assert.equal(moved.contactEligible,true);assert.deepEqual(moved.target,{x:620,y:350});}
    for(const invalid of [{actor:{...actor,id:'wrong'}},{actor:{...actor,universe:'Wrong'}},{profile:{...profile,name:'Generic burst'}},{profile:{...profile,sourceHeroId:'wrong'}},{profile:{...profile,universe:'Wrong'}},{profile:{...profile,effect:supportive?'damage':'heal'}}])assert.equal(getVisual({...options,...invalid}),null,id);
    assert.deepEqual(getVisual({...options,actor:{...actor,id:'local-p2',sourceHeroId:id}}),state);
    assert.deepEqual(sampleCharacterMotion({heroId:id,universe:actor.universe,phase:'super',progress}),sampleMotion({heroId:id,universe:actor.universe,phase:'super',progress}));
  }
});

for(const mode of MODES)for(const side of SIDES)test(`${mode} ${side}: all20 supers pay once, preserve startup/pause and resolve only once`,()=>{
  for(const id of IDS){const c=make(mode,side,id),profile=resolveMeleeSuper(c.actor),supportive=SUPPORT.has(id),changes=[];
    if(profile.effect==='heal')c.allies.forEach(a=>{a.currentHp=a.maxHp*0.45;});
    const beforeAllies=hp(c.allies),beforeTargets=hp(c.targets),applyName=mode==='fighter'?'applyHit':'applyDamage',apply=c.engine[applyName].bind(c.engine);
    c.engine[applyName]=(source,target,...args)=>{const old=target.currentHp,result=apply(source,target,...args);if(source===c.actor&&target.currentHp<old)changes.push(target);return result;};
    setMeter(c,99);assert.equal(commit(c),false,id);assert.equal(meter(c),99);setMeter(c,100);assert.equal(commit(c),true,id);assert.equal(meter(c),0);assert.equal(commit(c),false,id);
    advance(c,Math.min(0.1,hitAt(c)/2));assert.deepEqual(hp(c.targets),beforeTargets,`${id}: premature enemy damage`);assert.deepEqual(hp(c.allies),beforeAllies,`${id}: premature support`);pureDraw(c);advance(c,0.5);
    if(supportive){assert.deepEqual(hp(c.targets),beforeTargets,`${id}: support damaged enemy`);assert.equal(changes.length,0);
      if(profile.effect==='heal')assert.ok(c.allies.some((a,i)=>a.currentHp>beforeAllies[i]),`${id}: no ally healed`);
      else{assert.deepEqual(hp(c.allies),beforeAllies);assert.ok(guardRemaining(mode,c.actor)>0,`${id}: no actual guard`);if(profile.targetSide==='self')assert.equal(guardRemaining(mode,c.allies[1])||0,0);else assert.ok(guardRemaining(mode,c.allies[1])>0,`${id}: ally guard absent`);}
    } else {advance(c,1.1);assert.ok(changes.length>0,`${id}: no accepted hit`);assert.equal(new Set(changes).size,changes.length,`${id}: repeated hit on same target`);if(mode==='rpg')assert.deepEqual(new Set(changes.map(t=>t.battleId)),new Set(c.expectedTargetIds),id);assert.deepEqual(hp(c.allies),beforeAllies);}
    const afterAllies=hp(c.allies),afterTargets=hp(c.targets);advance(c,1.6);assert.deepEqual(hp(c.allies),afterAllies,`${id}: replayed support`);assert.deepEqual(hp(c.targets),afterTargets,`${id}: replayed damage`);
    observations.push({case:'Real super',mode,side,id,name:profile.name,effect:profile.effect,cost:100,acceptedDamageTargets:changes.length,allyHpDelta:c.allies.map((a,i)=>a.currentHp-beforeAllies[i]),enemyHpDelta:c.targets.map((a,i)=>a.currentHp-beforeTargets[i]),uniqueImpact:true});
  }
});

for(const mode of ['melee','fighter'])for(const side of SIDES)test(`${mode} ${side}:10 contact supers suppress misses and preserve confirmed points`,()=>{
  for(const id of CONTACT)for(const reason of ['range','behind','height','dead',mode==='fighter'?'invulnerable':'perfect-shield','accepted']){
    const c=make(mode,side,id),target=c.targets[0];assert.equal(commit(c),true);const action=c.actor.action;
    const profile=resolveMeleeSuper(c.actor);
    // Authored circular/area attacks legitimately include targets behind the
    // caster. A directional miss assertion only applies to directional kits.
    if(reason==='behind'&&(profile.delivery==='area'||(mode==='melee'&&profile.shape==='area')))continue;
    if(reason==='range')c.targets.forEach(t=>{t.x=c.actor.x+c.facing*(action.range+300);});if(reason==='behind')c.targets.forEach(t=>{t.x=c.actor.x-c.facing*100;});if(reason==='height')c.targets.forEach(t=>{t.y=c.actor.y-Math.max(240,profile.range+10);});if(reason==='dead')c.targets.forEach(t=>{t.currentHp=0;});if(reason==='invulnerable')c.targets.forEach(t=>{t.invulnerable=10;});if(reason==='perfect-shield')c.targets.forEach(t=>assert.equal(beginMeleeShield(t),true));
    const before=hp(c.targets);atImpact(c);const confirmed=actionOf(c)?.visualConfirmedContact;
    if(reason==='accepted'){assert.ok(target.currentHp<before[0],id);assert.equal(confirmed?.confirmed,true);const calls=pureDraw(c);target.x-=c.facing*450;target.y-=200;target.currentHp=0;assert.deepEqual(render(c),calls,'Confirmed contact follows actual stored point, not moved/dead actor');}
    else{assert.deepEqual(hp(c.targets),before,`${id}:${reason}`);assert.equal(confirmed,undefined);const calls=pureDraw(c);assert.equal(calls.filter(call=>call[0]==='ellipse').length,0,`${id}:${reason} displayed false contact`);target.x=c.actor.x+c.facing*60;target.y=c.actor.y;assert.equal(render(c).filter(call=>call[0]==='ellipse').length,0);}
  }
});

for(const side of SIDES)test(`RPG ${side}:15 damage supers cannot paint contact on protected/dead targets`,()=>{
  for(const id of IDS.filter(id=>!SUPPORT.has(id)))for(const reason of ['protected','dead','accepted']){
    const c=make('rpg',side,id);assert.equal(commit(c),true);const chosen=c.targets.filter(t=>c.expectedTargetIds.includes(t.battleId));
    if(reason==='protected')chosen.forEach(t=>{t.battleItemShield=100000;});if(reason==='dead')chosen.forEach(t=>{t.currentHp=0;});const before=hp(c.targets);atImpact(c);
    if(reason==='accepted'){assert.ok(chosen.some(t=>t.currentHp<before[c.targets.indexOf(t)]));assert.equal(actionOf(c)?.visualConfirmedContact?.confirmed,true);}
    else{assert.deepEqual(hp(c.targets),before,`${id}:${reason}`);assert.equal(actionOf(c)?.visualConfirmedContact,undefined);if(CONTACT.includes(id))assert.equal(pureDraw(c).filter(call=>call[0]==='ellipse').length,0);}
  }
});

for(const side of SIDES)test(`Fighter ${side}:Starfire follows its physical projectile, retains facing, pauses and impacts once`,()=>{
  const c=make('fighter',side,'starfire_tt'),target=c.targets[0];target.x=c.actor.x+c.facing*500;const before=target.currentHp;assert.equal(commit(c),true);advance(c,c.actor.action.hitAt-0.01);assert.equal(c.engine.projectiles.length,0);
  const startup=pureDraw(c);assert.equal(startup.some(call=>call[0]==='lineTo'),false);advance(c,0.02);assert.equal(c.engine.projectiles.length,1);assert.equal(target.currentHp,before);
  const shot=c.engine.projectiles[0];assert.equal(Math.sign(shot.vx),c.facing);c.actor.x+=c.facing*600;c.actor.facing=-c.facing;
  const flight=()=>{const r=recorder();c.engine.drawProjectile(r.ctx,shot);r.balanced();return r.calls;};const first=flight(),state=snapshot(c);for(let i=0;i<100;i++){c.engine.updateProjectiles(0);assert.deepEqual(flight(),first);}assert.equal(snapshot(c),state);
  assert.ok(first.some(call=>call[0]==='moveTo'&&call[1]===shot.x-c.facing*8*(142/72)&&call[2]===shot.y));
  let steps=240;while(!c.engine.projectileVisualImpacts.length&&steps-->0)advance(c,1/120);assert.ok(steps>0);assert.ok(target.currentHp<before);assert.equal(c.engine.projectiles.length,0);assert.equal(c.engine.projectileVisualImpacts.length,1);
  const impact=c.engine.projectileVisualImpacts[0],r=recorder();c.engine.drawProjectileImpact(r.ctx,impact);r.balanced();const hpAfter=target.currentHp;target.x-=c.facing*500;const moved=recorder();c.engine.drawProjectileImpact(moved.ctx,impact);moved.balanced();assert.deepEqual(moved.calls,r.calls);advance(c,2);assert.equal(target.currentHp,hpAfter);assert.equal(c.engine.projectileVisualImpacts.length,0);
  observations.push({case:'Physical Starfire projectile',side,committedFacing:c.facing,damage:before-hpAfter,impact:{x:impact.x,y:impact.y}});
});

for(const mode of ['rpg','fighter'])for(const side of SIDES)test(`${mode} ${side}:disposal cancels pending20 supers without further effects`,()=>{
  for(const id of IDS){const c=make(mode,side,id);c.allies.forEach(a=>{a.currentHp=a.maxHp*0.5;});assert.equal(commit(c),true);advance(c,0.1);const before=hp([...c.allies,...c.targets]);c.engine.dispose();advance(c,1.5);assert.deepEqual(hp([...c.allies,...c.targets]),before,id);}
});

test('Dungeon Meshi basic support metadata and native impact pose stay faithful to resolved gameplay roles',()=>{
  for(const id of ['marcille_meshi','chilchuck_meshi','falin_meshi']){const p=resolveCombatAbility(hero(id),'simple');assert.equal(p.effect,'buff');assert.equal(p.multiplier,0);assert.equal(p.delivery,'support');}
  for(const id of ['laios_meshi','marcille_meshi','senshi_meshi','chilchuck_meshi','falin_meshi']){const actor=hero(id),p=resolveMeleeSuper(actor),frame=getFrame({...actor,presentationPhase:'super',presentationProgress:0.6,presentationImpactProgress:p.hitAt/p.duration});assert.ok(frame,id);assert.equal(frame.col,2,id);assert.equal(frame.asset.frames,32);assert.equal(frame.asset.visualValidation.canon1to1Verified,false);}
});

for(const mode of ['rpg','melee'])for(const side of SIDES)test(`${mode} ${side}:Starfire cosmetic bolt travels on the action clock before its accepted impact`,()=>{
  const c=make(mode,side,'starfire_tt'),before=hp(c.targets);assert.equal(commit(c),true);const impact=hitAt(c);
  advance(c,impact*0.2);const charge=pureDraw(c);assert.equal(charge.some(call=>call[0]==='lineTo'),false,'Column0 is only local charge');assert.deepEqual(hp(c.targets),before);
  advance(c,impact*0.57);const state=snapshot(c),flight=pureDraw(c),start=flight.find(call=>call[0]==='moveTo'),end=flight.find(call=>call[0]==='lineTo');assert.ok(start&&end,'Actual engine must use the new pre-impact cosmetic bolt');
  const middle=(start[1]+end[1])/2,targetX=c.actor.rpgSpecialVisual?.target.x??c.targets[0].x,dx=(targetX-c.actor.x)*c.facing;
  assert.ok((middle-c.actor.x)*c.facing>0);assert.ok((middle-c.actor.x)*c.facing<dx,'Pre-impact bolt must be between caster and target, not already on target');
  assert.deepEqual(hp(c.targets),before);assert.equal(snapshot(c),state,'Drawing cannot add projectile, cost, HP change or new clock');
  if(mode==='rpg')c.targets.forEach(t=>{t.battleItemShield=100000;});else c.targets.forEach(t=>{t.x=c.actor.x-c.facing*400;});
  advance(c,impact*0.3);assert.deepEqual(hp(c.targets),before);assert.equal(actionOf(c)?.visualConfirmedContact,undefined);assert.equal(pureDraw(c).filter(call=>call[0]==='ellipse').length,0,'An unaccepted impact has no target marker');
  observations.push({case:'Clocked Starfire cosmetic flight',mode,side,boltCenterX:middle,casterX:c.actor.x,targetX,hpUnchanged:true});
});

test('Monsoon debris arrives at impact, becomes local fragments afterwards, and never claims a missed contact',()=>{
  for(const facing of [1,-1]){
    const actor={...hero('monsoon_mgr'),x:500,y:350},profile=resolveMeleeSuper(actor),duration=profile.duration,hit=profile.hitAt;
    const options=elapsed=>({actor,profile,action:{duration,elapsed,hitAt:hit,facing},target:{x:500+facing*300,y:350,currentHp:1000},height:72,contactVisual:{confirmed:false}});
    const draw=option=>{const state=getVisual(option),r=recorder(),before=JSON.stringify(option);drawVisual(r.ctx,state);r.balanced();assert.equal(JSON.stringify(option),before);return {state,calls:r.calls,fragments:r.calls.filter(call=>call[0]==='strokeRect')};};
    assert.equal(draw(options(hit*0.2)).fragments.length,0);
    const mid=draw(options(hit*0.775));assert.equal(mid.fragments.length,4);const center={x:mid.state.target.x,y:mid.state.target.y-72*0.42};
    for(const rectangle of mid.fragments){const x=rectangle[1]+3;assert.ok((x-mid.state.origin.x)*facing>0);assert.ok((center.x-x)*facing>0);}
    const accepted=elapsed=>({...options(elapsed),contactVisual:{confirmed:true,x:center.x,y:350}}),arrival=draw(accepted(hit));assert.equal(arrival.fragments.length,4);
    for(const rectangle of arrival.fragments){assert.ok(Math.abs(rectangle[1]+3-center.x)<1e-6);assert.ok(Math.abs(rectangle[2]+2-center.y)<1e-6);}
    const after=draw(accepted(hit+(duration-hit)*0.5));assert.equal(after.fragments.length,4);for(const rectangle of after.fragments)assert.ok(Math.hypot(rectangle[1]+3-center.x,rectangle[2]+2-center.y)<=18);
    const moved=draw({...accepted(hit+(duration-hit)*0.5),target:{x:-9000,y:-3000,currentHp:0}});assert.deepEqual(moved.calls,after.calls);
    const miss=draw(options(hit+(duration-hit)*0.5));assert.equal(miss.fragments.length,0);assert.equal(miss.calls.filter(call=>call[0]==='ellipse').length,0);
  }
});

for(const mode of MODES)for(const side of SIDES)test(`${mode} ${side}:Raven, Saejima and Chilchuck guards reduce real incoming damage on the correct allies`,()=>{
  for(const id of ['raven_tt','saejima_yakuza','chilchuck_meshi']){
    const c=make(mode,side,id),plain=make(mode,side,id),profile=resolveMeleeSuper(c.actor);assert.equal(commit(c),true);advance(c,0.6);
    const protectedActors=profile.targetSide==='self'?[c.actor]:c.allies;
    for(const [index,target] of protectedActors.entries()){
      const unguarded=profile.targetSide==='self'?plain.actor:plain.allies[index],hpBefore=target.currentHp,hpPlain=unguarded.currentHp,random=Math.random;
      try{Math.random=()=>0.5;if(mode==='fighter'){target.facing=c.facing;unguarded.facing=c.facing;const incoming={type:'light',base:40,knockback:0,guardDamage:1,facing:-c.facing};c.engine.applyHit(c.targets[0],target,incoming);plain.engine.applyHit(plain.targets[0],unguarded,incoming);}else{c.engine.applyDamage(c.targets[0],target,100);plain.engine.applyDamage(plain.targets[0],unguarded,100);}}finally{Math.random=random;}
      const reduced=hpBefore-target.currentHp,normal=hpPlain-unguarded.currentHp;assert.ok(reduced>=0&&reduced<normal,`${id}: guard metadata did not reduce actual damage (${reduced}/${normal})`);
    }
    assert.deepEqual(hp(c.targets),hp(plain.targets));
    if(profile.targetSide==='self')assert.equal(guardRemaining(mode,c.allies[1])||0,0);
  }
});

test('Cyborg cannon accents follow opaque native muzzle cells and stop with the lowered recovery arm',async()=>{
  const source=hero('cyborg_tt'),profile=resolveMeleeSuper(source),probes=[];
  const anchors={super:[{x:202,y:118},{x:164,y:117},{x:158,y:119},null],fatality:[null,{x:189,y:121},{x:160,y:120},null]};
  for(const phase of ['super','fatality'])for(const facing of [1,-1])for(const col of [0,1,2,3]){
    const impact=profile.hitAt/profile.duration,progress=(phase==='super'?[impact*0.2,impact*0.8,impact+(1-impact)*0.2,0.99]:[0.1,0.35,0.6,0.9])[col];
    const actor={...source,x:500,y:350,presentationPhase:phase,presentationFrame:{col}},action={duration:profile.duration,elapsed:progress*profile.duration,hitAt:profile.hitAt,facing};
    const frame=getFrame(actor,{phase,progress,impactProgress:impact});assert.ok(frame);assert.equal(frame.col,col);
    const options={actor,profile,action,height:142,target:{x:500+facing*300,y:350,currentHp:1000},contactVisual:{confirmed:true,x:500+facing*300,y:350}},before=JSON.stringify(options),state=getVisual(options),anchor=anchors[phase][col],r=recorder();
    drawVisual(r.ctx,state);r.balanced();assert.equal(JSON.stringify(options),before);assert.equal(state.nativeMuzzleActive,!!anchor);
    if(anchor){
      const scale=142/frame.asset.frameHeight*(frame.asset.normalization.rows[frame.row].renderScale||1),baseline=frame.asset.normalization.baseline;
      assert.equal(state.origin.x,actor.x+(anchor.x-128)*scale*facing);assert.equal(state.origin.y,actor.y+(anchor.y-baseline)*scale);
      const image=await sharp('public'+frame.asset.sheet).ensureAlpha().raw().toBuffer({resolveWithObject:true});let opaque=0;
      for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){const x=col*256+anchor.x+dx,y=frame.row*256+anchor.y+dy;if(image.data[(y*image.info.width+x)*4+3]>220)opaque++;}
      assert.ok(opaque>=30,`${phase}/${col}: muzzle must lie on the real opaque cannon, not on an empty coordinate`);probes.push({phase,col,facing,opaquePixels9x9:opaque,pixel:anchor,projectedOrigin:state.origin});
      const originCall=r.calls.find(call=>call[0]===(state.release?'moveTo':'ellipse'));assert.ok(originCall);assert.equal(originCall[1],state.origin.x);assert.equal(originCall[2],state.origin.y);
    }else{
      assert.equal(r.calls.some(call=>call[0]==='lineTo'),false,`${phase}/${col}: inactive/lowered cannon still fired`);
      const withoutContact=recorder();drawVisual(withoutContact.ctx,getVisual({...options,contactVisual:{confirmed:false}}));withoutContact.balanced();assert.equal(withoutContact.calls.some(call=>call[0]==='ellipse'||call[0]==='lineTo'),false,'Inactive cannon has neither a charge nor an unconfirmed target ring');
    }
  }
  observations.push({case:'Native Cyborg muzzle projection',probes});
});

test('Raven and Saejima P2 guard arcs reflect their opening while keeping caster-local geometry',()=>{
  for(const id of ['raven_tt','saejima_yakuza']){
    const actor={...hero(id),x:500,y:350},profile=resolveMeleeSuper(actor),arcs=[];
    for(const facing of [1,-1]){const options={actor,profile,action:{elapsed:0.6,duration:profile.duration,hitAt:profile.hitAt,facing},target:{x:-9000,y:-4000}},before=JSON.stringify(options),r=recorder();drawVisual(r.ctx,getVisual(options));r.balanced();assert.equal(JSON.stringify(options),before);const arc=r.calls.find(call=>call[0]==='arc');assert.ok(arc);assert.equal(arc[1],actor.x);arcs.push(arc);}
    assert.deepEqual(arcs[0].slice(1,4),arcs[1].slice(1,4));assert.ok(Math.abs(arcs[1][4]-arcs[0][4]-Math.PI)<1e-9);assert.ok(Math.abs(arcs[1][5]-arcs[0][5]-Math.PI)<1e-9);
  }
});
