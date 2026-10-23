import { COMBAT_SOURCE_DEFINITIONS_WAVE10 as DEFINITIONS } from '../src/game/combat/combatSourceDefinitionsWave10.js';
import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import sharp from 'sharp';

const IDS = Object.keys(DEFINITIONS);
const SUPPORT = new Set(IDS.filter(id=>DEFINITIONS[id].effect!=='damage'));
const CONTACT = IDS.filter(id=>DEFINITIONS[id].effect==='damage');
const MODES = ['rpg','melee','fighter'], SIDES = ['player','opponent'];
const observations = [], engines = [], noop = () => {}, particles = { add: noop };
let vite, EngineRpg, EngineSmash, EngineFighter, heroes, resolveMeleeSuper, tickMeleeCombatActor, beginMeleeShield;
let supportsNative, supportsTracked, getVisual, drawVisual, sampleMotion, getCharacterVisual, drawCharacterVisual, sampleCharacterMotion, getFrame, projectAnchor;
const hero = id => { const h=heroes.find(h=>h.id===id);assert.ok(h,id);return h; };
const dummy = id => ({id,name:id,universe:'Wave10 runtime training',category:'test',weaponType:'melee',primaryColor:'#89aacc',secondaryColor:'#ddeeff',
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
  ({EngineRpg}=await vite.ssrLoadModule('/src/game/engineRpg.js?native-wave10'));({EngineSmash}=await vite.ssrLoadModule('/src/game/engineSmash.js?native-wave10'));({EngineFighter}=await vite.ssrLoadModule('/src/game/engineFighter.js?native-wave10'));
  ({HEROES_DB:heroes}=await vite.ssrLoadModule('/src/game/heroes.js'));({resolveMeleeSuper}=await vite.ssrLoadModule('/src/game/combatIdentity.js'));
  ({tickMeleeCombatActor,beginMeleeShield}=await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));
  ({supportsNativeSuperWave10:supportsNative,supportsTrackedProjectileVisualWave10:supportsTracked,getNativeSuperVisualStateWave10:getVisual,drawNativeSuperVisualsWave10:drawVisual,sampleNativeSuperMotionWave10:sampleMotion,projectNativeSuperAnchorWave10:projectAnchor}=await vite.ssrLoadModule('/src/game/combat/nativeSuperVisualsWave10.js'));
  ({getCharacterSuperVisualState:getCharacterVisual,drawCharacterSuperVisuals:drawCharacterVisual,sampleCharacterSuperMotion:sampleCharacterMotion}=await vite.ssrLoadModule('/src/game/combat/characterSuperVisuals.js'));
  ({getCharacterAnimationFrame:getFrame}=await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js'));
});
after(async()=>{
  engines.forEach(e=>e.dispose?.());await vite?.close();
  if(process.env.NATIVE_WAVE10_REPORT_PATH){const sources=await Promise.all(['scripts/nativeSuperRuntimeWave10.test.mjs','src/game/engineRpg.js','src/game/engineSmash.js','src/game/engineFighter.js','src/game/combat/nativeSuperVisualsWave10.js','src/game/combat/characterSuperVisuals.js'].map(async path=>({path,sha256:createHash('sha256').update(await readFile(path)).digest('hex')})));
    await writeFile(process.env.NATIVE_WAVE10_REPORT_PATH,JSON.stringify({date:'2026-10-23',method:'Real Vite SSR engines, accepted gameplay changes and recorded canvas commands. Native decoding and real browser drawing are verified separately.',coverage:{identities:40,modes:MODES,sides:SIDES,supports:[...SUPPORT],contactSupers:CONTACT,trackedFighter:IDS.filter(id=>supportsTracked(resolveMeleeSuper(hero(id))))},sources,observations,source1to1Verified:false},null,2)+'\n');}
});

test('40 Wave10 identities dispatch purely with exact source identity and support accents stay at their own caster',()=>{
  for(const id of IDS)for(const facing of [1,-1])for(const progress of [0.15,0.55,0.9]){
    const actor={...hero(id),x:500,y:350,currentHp:1000},profile=resolveMeleeSuper(actor),supportive=SUPPORT.has(id);
    assert.equal(supportsNative(profile),true,id);assert.equal(supportsTracked(profile),profile.effect==='damage'&&profile.delivery==='projectile',id);
    const options={actor,profile,action:{duration:profile.duration,elapsed:progress*profile.duration,hitAt:profile.hitAt,facing},target:{x:500+facing*80,y:350,currentHp:1000},contactVisual:{confirmed:false}};
    const before=JSON.stringify(options),state=getVisual(options);assert.equal(state.family,'native-wave10');assert.equal(state.gameplayEffect,'none');assert.equal(state.source1to1Verified,false);assert.equal(state.supportive,supportive);assert.equal(state.contactEligible,false);
    assert.deepEqual(getCharacterVisual(options),state);const a=recorder(),b=recorder();assert.equal(drawVisual(a.ctx,state),true);assert.equal(drawCharacterVisual(b.ctx,getCharacterVisual(options)),true);a.balanced();b.balanced();assert.deepEqual(a.calls,b.calls);assert.equal(JSON.stringify(options),before);
    const moved=getVisual({...options,target:{x:-9000,y:-5000,currentHp:0},contactVisual:{confirmed:true,x:620,y:350}});
    if(supportive){assert.deepEqual(moved.target,state.ground);const r=recorder();drawVisual(r.ctx,moved);r.balanced();assert.deepEqual(r.calls,a.calls,'Support accent cannot follow an enemy');}
    else{assert.equal(moved.contactEligible,true);assert.deepEqual(moved.target,{x:620,y:350});}
    for(const invalid of [{actor:{...actor,id:'wrong'}},{actor:{...actor,universe:'Wrong'}},{profile:{...profile,name:'Generic burst'}},{profile:{...profile,sourceHeroId:'wrong'}},{profile:{...profile,universe:'Wrong'}},{profile:{...profile,effect:supportive?'damage':'heal'}}])assert.equal(getVisual({...options,...invalid}),null,id);
    assert.deepEqual(getVisual({...options,actor:{...actor,id:'local-p2',sourceHeroId:id}}),state);
    assert.deepEqual(sampleCharacterMotion({heroId:id,universe:actor.universe,phase:'super',progress}),sampleMotion({heroId:id,universe:actor.universe,phase:'super',progress}));
  }
});

for(const mode of MODES)for(const side of SIDES)test(`${mode} ${side}: all40 supers pay once, preserve startup/pause and resolve only once`,()=>{
  for(const id of IDS){const c=make(mode,side,id),profile=resolveMeleeSuper(c.actor),supportive=SUPPORT.has(id),changes=[];
    if(profile.effect==='heal')c.allies.forEach(a=>{a.currentHp=a.maxHp*0.45;});
    const beforeAllies=hp(c.allies),beforeTargets=hp(c.targets),applyName=mode==='fighter'?'applyHit':'applyDamage',apply=c.engine[applyName].bind(c.engine);
    c.engine[applyName]=(source,target,...args)=>{const old=target.currentHp,result=apply(source,target,...args);if(source===c.actor&&target.currentHp<old)changes.push(target);return result;};
    setMeter(c,99);assert.equal(commit(c),false,id);assert.equal(meter(c),99);setMeter(c,100);assert.equal(commit(c),true,id);assert.equal(meter(c),0);assert.equal(commit(c),false,id);
    advance(c,Math.min(0.1,hitAt(c)/2));assert.deepEqual(hp(c.targets),beforeTargets,`${id}: premature enemy damage`);assert.deepEqual(hp(c.allies),beforeAllies,`${id}: premature support`);pureDraw(c);advance(c,0.5);
    if(supportive){assert.deepEqual(hp(c.targets),beforeTargets,`${id}: support damaged enemy`);assert.equal(changes.length,0);
      if(profile.effect==='heal')assert.ok(c.allies.some((a,i)=>a.currentHp>beforeAllies[i]),`${id}: no ally healed`);
      else if(profile.effect==='buff'){assert.deepEqual(hp(c.allies),beforeAllies);assert.ok(mode==='fighter'?c.actor.superBuffSeconds>0:mode==='rpg'?c.actor.rpgBuffTicks>0:c.actor.meleeSuperSupport?.effect==='buff',`${id}: actual buff absent`);}
      else{assert.deepEqual(hp(c.allies),beforeAllies);assert.ok(guardRemaining(mode,c.actor)>0,`${id}: no actual guard`);if(profile.targetSide==='self')assert.equal(guardRemaining(mode,c.allies[1])||0,0);else assert.ok(guardRemaining(mode,c.allies[1])>0,`${id}: ally guard absent`);}
    } else {advance(c,1.1);assert.ok(changes.length>0,`${id}: no accepted hit`);assert.equal(new Set(changes).size,changes.length,`${id}: repeated hit on same target`);if(mode==='rpg')assert.deepEqual(new Set(changes.map(t=>t.battleId)),new Set(c.expectedTargetIds),id);assert.deepEqual(hp(c.allies),beforeAllies);}
    const afterAllies=hp(c.allies),afterTargets=hp(c.targets);advance(c,1.6);assert.deepEqual(hp(c.allies),afterAllies,`${id}: replayed support`);assert.deepEqual(hp(c.targets),afterTargets,`${id}: replayed damage`);
    observations.push({case:'Real super',mode,side,id,name:profile.name,effect:profile.effect,cost:100,acceptedDamageTargets:changes.length,allyHpDelta:c.allies.map((a,i)=>a.currentHp-beforeAllies[i]),enemyHpDelta:c.targets.map((a,i)=>a.currentHp-beforeTargets[i]),uniqueImpact:true});
  }
});

for(const mode of ['melee','fighter'])for(const side of SIDES)test(`${mode} ${side}:25 offensive supers suppress misses and preserve confirmed points`,()=>{
  for(const id of CONTACT)for(const reason of ['range','behind','height','dead',mode==='fighter'?'invulnerable':'perfect-shield','accepted']){
    const c=make(mode,side,id),target=c.targets[0];if(mode==='fighter'&&supportsTracked(resolveMeleeSuper(c.actor)))continue;assert.equal(commit(c),true);const action=c.actor.action;
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

for(const side of SIDES)test(`RPG ${side}:25 damage supers cannot paint contact on protected/dead targets`,()=>{
  for(const id of IDS.filter(id=>!SUPPORT.has(id)))for(const reason of ['protected','dead','accepted']){
    const c=make('rpg',side,id);assert.equal(commit(c),true);const chosen=c.targets.filter(t=>c.expectedTargetIds.includes(t.battleId));
    if(reason==='protected')chosen.forEach(t=>{t.battleItemShield=100000;});if(reason==='dead')chosen.forEach(t=>{t.currentHp=0;});const before=hp(c.targets);atImpact(c);
    if(reason==='accepted'){assert.ok(chosen.some(t=>t.currentHp<before[c.targets.indexOf(t)]));assert.equal(actionOf(c)?.visualConfirmedContact?.confirmed,true);}
    else{assert.deepEqual(hp(c.targets),before,`${id}:${reason}`);assert.equal(actionOf(c)?.visualConfirmedContact,undefined);if(CONTACT.includes(id))assert.equal(pureDraw(c).filter(call=>call[0]==='ellipse').length,0);}
  }
});

for(const mode of ['rpg','fighter'])for(const side of SIDES)test(`${mode} ${side}:disposal cancels pending40 supers without further effects`,()=>{
  for(const id of IDS){const c=make(mode,side,id);c.allies.forEach(a=>{a.currentHp=a.maxHp*0.5;});assert.equal(commit(c),true);advance(c,0.1);const before=hp([...c.allies,...c.targets]);c.engine.dispose();advance(c,1.5);assert.deepEqual(hp([...c.allies,...c.targets]),before,id);}
});

for(const side of SIDES)test(`Fighter ${side}:every Wave10 physical projectile uses its real position, incoming facing and one accepted collision`,()=>{
  for(const id of IDS.filter(id=>supportsTracked(resolveMeleeSuper(hero(id))))){
    const c=make('fighter',side,id),target=c.targets[0],profile=resolveMeleeSuper(c.actor);target.x=c.actor.x+c.facing*Math.min(500,profile.range-60);const before=target.currentHp,events=[];
    const apply=c.engine.applyHit.bind(c.engine);c.engine.applyHit=(source,unit,...args)=>{const hpBefore=unit.currentHp,r=apply(source,unit,...args);if(source===c.actor&&unit.currentHp<hpBefore)events.push(unit);return r;};
    assert.equal(commit(c),true,id);advance(c,c.actor.action.hitAt-0.01);assert.equal(c.engine.projectiles.length,0);assert.equal(target.currentHp,before);
    advance(c,0.02);assert.equal(c.engine.projectiles.length,1,id);assert.equal(target.currentHp,before,'Launching a shot cannot damage a distant target');
    const shot=c.engine.projectiles[0];assert.equal(Math.sign(shot.vx),c.facing);target.guarding=true;target.facing=-c.facing;
    c.actor.x+=c.facing*600;c.actor.facing=-c.facing;
    const draw=()=>{const r=recorder();c.engine.drawProjectile(r.ctx,shot);r.balanced();return r.calls;},first=draw(),state=snapshot(c),s=142/72;
    assert.ok(id==='freeman'?first.some(call=>call[0]==='ellipse'&&call[1]===shot.x&&call[2]===shot.y):first.some(call=>call[0]==='moveTo'&&Math.abs(call[1]-(shot.x-c.facing*6*s))<1e-9&&call[2]===shot.y),`${id}: helper does not draw the actual projectile`);
    for(let i=0;i<100;i++){c.engine.updateProjectiles(0);assert.deepEqual(draw(),first);}assert.equal(snapshot(c),state,'Zero simulation time must freeze flight, HP and presentation');
    let limit=240;while(!c.engine.projectileVisualImpacts.length&&limit-->0)advance(c,1/120);assert.ok(limit>0,id);assert.equal(events.length,1,id);assert.equal(events[0],target);assert.ok(target.currentHp<before);assert.ok(target.guard<100,'The shot must preserve its incoming direction after its owner crosses the target');
    assert.equal(c.engine.projectiles.length,0);assert.equal(c.engine.projectileVisualImpacts.length,1);const impact=c.engine.projectileVisualImpacts[0],r=recorder();c.engine.drawProjectileImpact(r.ctx,impact);r.balanced();
    const hpAfter=target.currentHp;target.x-=c.facing*500;target.y-=200;const moved=recorder();c.engine.drawProjectileImpact(moved.ctx,impact);moved.balanced();assert.deepEqual(moved.calls,r.calls,'Confirmed collision stays at its stored world position');
    advance(c,2);assert.equal(target.currentHp,hpAfter);assert.equal(events.length,1);assert.equal(c.engine.projectileVisualImpacts.length,0);
    observations.push({case:'Physical projectile',id,side,committedFacing:c.facing,guarded:true,damage:before-hpAfter,impact:{x:impact.x,y:impact.y},singleAcceptedHit:true});
  }
});

for(const side of SIDES)test(`Fighter ${side}:every Wave10 physical projectile suppresses unaccepted contacts`,()=>{
  for(const id of IDS.filter(id=>supportsTracked(resolveMeleeSuper(hero(id)))))for(const reason of ['range','height','dead','invulnerable']){
    const c=make('fighter',side,id),target=c.targets[0],profile=resolveMeleeSuper(c.actor);target.x=c.actor.x+c.facing*500;
    if(reason==='range')target.x=c.actor.x+c.facing*(profile.range+1);if(reason==='height')target.y-=200;if(reason==='dead')target.currentHp=0;if(reason==='invulnerable')target.invulnerable=10;
    const before=hp(c.targets);assert.equal(commit(c),true);advance(c,1.9);assert.deepEqual(hp(c.targets),before,`${id}:${reason}`);assert.equal(c.engine.projectileVisualImpacts.length,0,`${id}:${reason}: false native impact`);assert.equal(c.engine.projectiles.length,0);
  }
});

test('Every Wave10 active native aperture is an actual source pixel and projects with its own row scale, phase and facing',async()=>{
  const merged=Object.assign({},...await Promise.all(['A','B','C','D'].map(async part=>JSON.parse(await readFile(`src/game/combat/nativeSuperAnchorsWave10Part${part}.generated.json`)))));
  let active=0,lowered=0;
  for(const id of IDS){
    const profile=resolveMeleeSuper(hero(id));
    for(const phase of ['super','fatality']){
      const native=getFrame({...hero(id),presentationPhase:phase,presentationProgress:0.6});if(id==='janine_gb'){assert.equal(native,null,'Janine refused super/finale cannot expose a fabricated native phase');continue;}assert.ok(native,id);assert.equal(native.asset.frames,32,id);
      const asset=native.asset,bytes=await readFile(`public${asset.sheet}`),{data,info}=await sharp(bytes).ensureAlpha().raw().toBuffer({resolveWithObject:true});
      assert.equal(createHash('sha256').update(bytes).digest('hex'),asset.sha256);
      const anchors=merged[id]?.[phase]||[null,null,null,null];
      if(profile.effect==='damage'&&profile.delivery==='projectile'){assert.ok(anchors[1],`${id}/${phase}: missing aiming point`);assert.ok(anchors[2],`${id}/${phase}: missing release point`);}
      for(let col=0;col<4;col++)for(const facing of [1,-1])for(const height of [72,142]){
        const actor={...hero(id),id:`local-${id}`,sourceHeroId:id,x:500,y:350,facing:-facing,presentationPhase:phase,presentationFrame:{row:native.row,col},action:{facing}},p=(col+0.5)/4,anchor=anchors[col];
        const result=projectAnchor(actor,p,profile.hitAt/profile.duration,height);
        if(!anchor){assert.equal(result,null);lowered++;continue;}
        assert.equal(Array.isArray(anchor),false,`${id}/${phase}/${col}: runtime requires an {x,y} point, never a silent array fallback`);
        assert.ok(Number.isFinite(anchor.x)&&Number.isFinite(anchor.y));assert.ok(result,`${id}/${phase}/${col}: authored point was silently discarded`);
        const offset=((native.row*256+anchor.y)*info.width+col*256+anchor.x)*4;assert.ok(data[offset+3]>24,`${id}/${phase}/${col}: anchor misses genuine native pixels`);
        const rowScale=asset.normalization.rows[native.row].renderScale,scale=height/256*rowScale;
        assert.ok(Math.abs(result.x-(500+(anchor.x-128)*scale*facing))<1e-9);assert.ok(Math.abs(result.y-(350+(anchor.y-244)*scale))<1e-9);assert.equal(result.col,col);assert.equal(result.phase,phase);active++;
      }
    }
  }
  assert.ok(active>0&&lowered>0);observations.push({case:'Native aperture RGBA/projection',projectedActivePoints:active,inactivePoints:lowered,frameDimensions:[256,256],baseline:244});
});

for(const side of SIDES)test(`Fighter ${side}:every tracked Wave10 shot physically spawns at its measured native weapon opening`,()=>{
  for(const id of IDS.filter(id=>supportsTracked(resolveMeleeSuper(hero(id))))){
    const c=make('fighter',side,id),profile=resolveMeleeSuper(c.actor);c.targets[0].x=c.actor.x+c.facing*Math.min(500,profile.range-60);assert.equal(commit(c),true);
    const action=c.actor.action,before={x:c.actor.x,y:c.actor.y};c.engine.updateActions(action.hitAt);assert.equal(c.engine.projectiles.length,1,id);
    const projected=getVisual({actor:c.actor,profile,action,target:c.targets[0],height:142});assert.equal(projected.nativeMuzzleActive,true,`${id}: source opening was not read`);
    const shot=c.engine.projectiles[0];assert.ok(Math.abs(shot.x-projected.origin.x)<1e-9,id);assert.ok(Math.abs(shot.y-projected.origin.y)<1e-9,id);assert.equal(shot.visualOriginX,shot.x);
    assert.ok(Math.abs(shot.life-Math.max(0,action.range-(shot.x-c.actor.x)*c.facing)/520)<1e-9);assert.deepEqual({x:c.actor.x,y:c.actor.y},before,'Native aperture projection must not displace the fighter');
    const state=snapshot(c);for(let i=0;i<100;i++){c.engine.updateActions(0);c.engine.updateProjectiles(0);}assert.equal(snapshot(c),state);assert.equal(c.actor.meter,0);
    observations.push({case:'Native physical muzzle spawn',id,side,nativePoint:projected.nativeAnchor.nativePoint,origin:{x:shot.x,y:shot.y},range:action.range,lifetime:shot.life,pauseStable:true});
  }
});

test('Wave10 cosmetic weapon travel stays on the action clock and cannot invent a target impact',()=>{
  for(const id of IDS.filter(id=>{const p=resolveMeleeSuper(hero(id));return p.effect==='damage'&&p.delivery==='projectile';} ))for(const facing of [1,-1]){
    const actor={...hero(id),x:500,y:350},profile=resolveMeleeSuper(actor),target={x:500+facing*350,y:350},options={actor,profile,target,height:72,contactVisual:{confirmed:false}};
    const drawAt=(factor,contactVisual=options.contactVisual)=>{const action={duration:profile.duration,hitAt:profile.hitAt,elapsed:profile.hitAt*factor,facing},state=getVisual({...options,action,contactVisual}),r=recorder();drawVisual(r.ctx,state);r.balanced();return {state,calls:r.calls};};
    const before=JSON.stringify(options),startup=drawAt(0.2);assert.equal(startup.calls.some(c=>c[0]==='lineTo'),false,`${id}: flying bolt during preparation`);
    const flight=drawAt(0.8),start=flight.calls.find(c=>c[0]==='moveTo'),end=flight.calls.find(c=>c[0]==='lineTo');const orb=flight.calls.find(c=>c[0]==='ellipse');assert.ok(id==='freeman'?orb:start&&end,`${id}: no pre-impact flight from measured aperture`);
    const middle=id==='freeman'?orb[1]:(start[1]+end[1])/2;assert.ok((middle-flight.state.origin.x)*facing>0);assert.ok((target.x-middle)*facing>0);assert.equal(flight.calls.some(c=>c[0]==='ellipse'&&c[1]===target.x),false,'A travelling visual is not a successful contact');
    const missed=drawAt(1.1);assert.equal(missed.calls.some(c=>['lineTo','ellipse'].includes(c[0])),false,`${id}: a missed action painted a lingering projectile or impact`);
    const accepted=drawAt(1.1,{confirmed:true,x:600,y:350});assert.ok(accepted.calls.some(c=>c[0]==='ellipse'&&c[1]===600));assert.equal(accepted.calls.some(c=>c[0]==='lineTo'),false,'Post-impact recoil cannot launch another shot');assert.equal(JSON.stringify(options),before);
  }
});

test('Proton streams start at their physical wand and require an accepted cross-universe contact',()=>{
  for(const id of ['venkman_gb','zeddemore_gb'])for(const facing of [1,-1]){
    const actor={...hero(id),x:500,y:350},profile=resolveMeleeSuper(actor),action={duration:profile.duration,hitAt:profile.hitAt,elapsed:profile.hitAt+0.05,facing},point={x:500+facing*250,y:350};
    const options={actor,profile,action,target:{x:-900,y:-900},contactVisual:{confirmed:true,...point},height:72},state=getVisual(options),r=recorder();assert.equal(state.nativeMuzzleActive,true);drawVisual(r.ctx,state);r.balanced();
    const start=r.calls.find(c=>c[0]==='moveTo'),end=r.calls.find(c=>c[0]==='lineTo');assert.ok(start&&end);assert.equal(start[1],state.origin.x);assert.equal(start[2],state.origin.y);assert.equal(end[1],point.x);assert.equal(end[2],point.y-72*.42);assert.notEqual(start[1],actor.x,'A proton stream starts at the real emitter, not the torso');
    const miss=recorder();drawVisual(miss.ctx,getVisual({...options,target:point,contactVisual:{confirmed:false}}));miss.balanced();assert.equal(miss.calls.some(c=>['lineTo','ellipse'].includes(c[0])),false,'A miss cannot paint a capture or target strike');
  }
});

test('Janine retains only24 accepted presentation drawings and uses an explicitly non-dedicated existing-pose fallback',async()=>{
  const {getHeroSpriteSheetSrc,getSpriteSheetLayout,getSpriteStateResolution}=await vite.ssrLoadModule('/src/game/spriteAssets.js');
  const {resolveCharacterAnimationAsset}=await vite.ssrLoadModule('/src/game/combat/characterAnimationCatalog.js');
  const actor=hero('janine_gb'),asset=resolveCharacterAnimationAsset(actor),sheet=getHeroSpriteSheetSrc(actor,'melee'),layout=getSpriteSheetLayout(sheet);
  assert.equal(asset.frames,24);assert.equal(layout.rows,6);assert.equal(sheet,asset.sheet);assert.equal(layout.adaptedPresentationFallback,true);assert.equal(layout.countedAsDedicatedBase16,false);assert.equal(layout.countedAsDedicatedSuperOrFinale,false);
  for(const phase of ['super','fatality'])assert.equal(getFrame({...actor,presentationPhase:phase,presentationProgress:0.6}),null);
  for(const phase of ['intro','outro','roundVictory','roundDefeat','victory','defeat'])assert.ok(getFrame({...actor,presentationPhase:phase,presentationProgress:0.6}));
  for(const state of ['idle','run','attack','support','special','defense','hit','dead']){const resolution=getSpriteStateResolution(state,layout);assert.equal(resolution.binding,'adapted-existing-pose');assert.equal(resolution.dedicated,false);assert.equal(resolution.sourcePhase,layout.sourcePhaseByState[state]);assert.ok(resolution.row>=0&&resolution.row<6);}
});
