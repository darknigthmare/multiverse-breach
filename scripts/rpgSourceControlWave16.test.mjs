import assert from 'node:assert/strict';
import { before,after,test } from 'node:test';
import { createServer } from 'vite';
let vite,Engine,HEROES,ENEMIES;const engines=[];
before(async()=>{vite=await createServer({ configFile: false, publicDir: false,appType:'custom',logLevel:'silent',server:{middlewareMode:true,watch:null}});
 ({EngineRpg:Engine}=await vite.ssrLoadModule('/src/game/engineRpg.js'));
 ({HEROES_DB:HEROES}=await vite.ssrLoadModule('/src/game/heroes.js'));
 ({ENEMIES_DB:ENEMIES}=await vite.ssrLoadModule('/src/game/enemies.js'));});
after(async()=>{engines.forEach(engine=>engine.dispose());await vite?.close();});
const hero=id=>structuredClone(HEROES.find(h=>h.id===id));
const tick=(engine,count)=>{for(let n=0;n<count;n++)engine.update();};
const slig=()=>{const body=structuredClone(ENEMIES.Oddworld.monsters.find(e=>e.id==='oddworld_slig'));assert.equal(body.possessionEligible,true);
 return {...body,stats:body.stats||{hp:body.hp,atk:body.atk,def:body.def||5,spd:body.spd||5}};};
function make(kind,side,allies=[],opponents=[hero('noble_six')]){
 const owner=hero(kind==='possession'?'oddworld_abe_possession':'akane_tsunemori');
 const target=kind==='possession'?slig():{...hero('shinya_kogami'),paralyzerEligible:true};
 const own=[owner,...allies],opposition=[target,...opponents];
 const engine=new Engine(1040,460,side==='player'?own:opposition,{monsters:side==='player'?opposition:own,bosses:[],customRoster:side==='player'?opposition:own},{add(){}},()=>{},()=>{},
 {universe:owner.universe,customBattle:{singleRoster:true,opponentControl:'p2'}});engines.push(engine);engine.enemyGlobalRecovery=0;
 const actor=(side==='player'?engine.heroes:engine.enemies)[0],targets=side==='player'?engine.enemies:engine.heroes;
 for(const unit of[...engine.heroes,...engine.enemies]){unit.atb=-100000;unit.specialCharge=100;unit.state='idle';unit.actionPending=false;}
 const direction=side==='player'?1:-1;actor.x=actor.homeX=side==='player'?400:640;actor.y=actor.homeY=350;actor.atb=100;
 targets.forEach((unit,index)=>{unit.x=unit.homeX=actor.x+direction*(180+index*90);unit.y=unit.homeY=350;});targets[0].atb=100;
 return{engine,actor,target:targets[0],other:targets[1],side,targets};
}
function start(c){assert.equal(c.engine.beginTargeting(c.actor,'special',c.side),true);assert.equal(c.engine.confirmTargeting(),true);}
for(const side of['player','enemy']){
 test(`${side}: Paralyzer targets only the explicitly authorized live Kogami, pauses and expires without HP or elevation changes`,()=>{
  const c=make('paralyzer',side),{engine,actor,target,other}=c,hp=target.currentHp,y=target.y;
  assert.equal(engine.beginTargeting(actor,'special',side),true);let preview=engine.getTargetingState();assert.equal(preview.eligibleTargets.length,1);assert.equal(preview.estimates[0].amount,0);
  assert.equal(actor.atb,100);engine.cancelTargeting();assert.equal(actor.specialCharge,100);start(c);
  tick(engine,40);assert.equal(target.sourceControlWave16?.kind,'paralyzer');assert.equal(target.sourceControlWave16.active,true);
  assert.equal(target.currentHp,hp);assert.equal(target.y,y);assert.equal(target.rpgControlTicks||0,0);
  assert.equal(other.sourceControlWave16,undefined);assert.equal(engine.canUseAction(target,'simple',side==='player'?'enemy':'player'),false);
  const state=JSON.stringify(target.sourceControlWave16);engine.setPaused(true);tick(engine,90);assert.equal(JSON.stringify(target.sourceControlWave16),state);engine.setPaused(false);
  tick(engine,100);assert.equal(target.sourceControlWave16.active,false);assert.equal(target.currentHp,hp);assert.equal(target.y,y);
  assert.equal(actor.specialCharge,0);assert.ok(actor.atb<100);
 });
 test(`${side}: Abe channels into the real historical Slig and redirects its own ready ATB/rifle without changing the stored team`,()=>{
  const c=make('possession',side),{engine,actor,target,other}=c,team=engine.heroes.includes(target),hp=target.currentHp,otherHp=other.currentHp;
  start(c);assert.equal(target.sourceControlWave16.phase,'channeling');assert.equal(engine.getRpgPossessionCommandState(side),null);
  assert.equal(target.currentHp,hp);tick(engine,65);assert.equal(target.sourceControlWave16.phase,'channeling');assert.equal(other.currentHp,otherHp);
  tick(engine,2);assert.equal(target.sourceControlWave16.phase,'active');assert.equal(engine.heroes.includes(target),team);assert.equal(target.currentHp,hp);
  assert.equal(engine.canUseAction(actor,'simple',side),false);const command=engine.getRpgPossessionCommandState(side);assert.equal(command.bodyId,target.battleId);assert.equal(command.ready,true);
  assert.equal(engine.beginPossessedTargeting(actor.battleId,side),true);const preview=engine.getTargetingState();assert.match(preview.abilityName,/fusil du Slig/);assert.equal(preview.actorId,target.battleId);
  assert.deepEqual(preview.eligibleTargets.map(t=>t.id),[other.battleId]);engine.cancelTargeting();assert.equal(target.atb,100);assert.equal(actor.specialCharge,0);
  assert.equal(engine.beginPossessedTargeting(actor.battleId,side),true);assert.equal(engine.confirmTargeting(),true);assert.equal(target.atb,0);
  tick(engine,14);assert.equal(other.currentHp,otherHp);assert.equal(target.rpgPossessedRifleLastReleaseWave16,undefined);
  tick(engine,1);assert.ok(other.currentHp<otherHp);assert.equal(target.rpgPossessedRifleLastReleaseWave16.nativePoint.col,2);assert.equal(target.currentHp,hp);
  assert.equal(engine.heroes.includes(target),team);assert.equal(actor.specialCharge,0);
  assert.equal(engine.releaseRpgPossession(actor.battleId,side),true);assert.equal(target.sourceControlWave16.active,false);assert.equal(engine.getRpgPossessionCommandState(side),null);
 });
 test(`${side}: an interrupted or invalidated chant never activates a substitute Slig and never refunds or repeats its cost`,()=>{
  for(const invalid of['source-hit','source-dead','target-dead','target-removed','out-of-range','expired-selection']){
   const c=make('possession',side);start(c);tick(c.engine,20);
   if(invalid==='expired-selection'){tick(c.engine,47);assert.equal(c.engine.beginPossessedTargeting(c.actor.battleId,side),true);c.engine.setTargetingWait(false);tick(c.engine,130);assert.equal(c.engine.getTargetingState(),null);}
   if(invalid==='source-hit')c.engine.applyDamage(c.other,c.actor,20,null,{delivery:'melee'});
   if(invalid==='source-dead'){c.actor.currentHp=0;c.actor.state='dead';}
   if(invalid==='target-dead'){c.target.currentHp=0;c.target.state='dead';}
   if(invalid==='target-removed'){if(side==='player')c.engine.enemies=c.engine.enemies.filter(u=>u!==c.target);else c.engine.heroes=c.engine.heroes.filter(u=>u!==c.target);}
   if(invalid==='out-of-range')c.target.x=c.actor.x+(side==='player'?700:-700);
   tick(c.engine,100);assert.equal(c.target.sourceControlWave16.active,false,invalid);assert.equal(c.engine.getRpgPossessionCommandState(side),null);
   assert.equal(c.actor.specialCharge,0);assert.equal(c.other.sourceControlWave16,undefined);
  }
 });
 test(`${side}: invalid source eligibility cannot spend a control action`,()=>{
  for(const kind of['possession','paralyzer']){const c=make(kind,side);if(kind==='possession')c.target.species='human';else c.target.paralyzerEligible=false;
   assert.equal(c.engine.beginTargeting(c.actor,'special',side),false);assert.equal(c.actor.atb,100);assert.equal(c.actor.specialCharge,100);}
 });
}

test('RPG: an allied invocation pauses a committed Slig rifle pose and its release together', () => {
 const c = make('possession', 'player', [hero('mei_zhen')]);
 const { engine, actor, target, other } = c;
 const summoner = engine.heroes[1];
 summoner.x = summoner.homeX = actor.x - 65;
 summoner.y = summoner.homeY = actor.y;
 start(c);
 tick(engine, 67);
 assert.equal(engine.beginPossessedTargeting(actor.battleId), true);
 assert.equal(engine.confirmTargeting(), true);
 tick(engine, 4);
 const rifle = target.rpgPossessedRifleActionWave16;
 const hp = other.currentHp;
 assert.equal(rifle.elapsedTicks, 4);
 summoner.atb = 100;
 assert.equal(engine.beginTargeting(summoner, 'summon') && engine.confirmTargeting(), true);
 const duration = engine.activeSummon.durationTicks;
 tick(engine, duration);
 assert.equal(engine.activeSummon, null);
 assert.equal(target.rpgPossessedRifleActionWave16, rifle);
 assert.equal(rifle.elapsedTicks, 4);
 assert.equal(other.currentHp, hp);
 assert.equal(target.rpgPossessedRifleLastReleaseWave16, undefined);
 tick(engine, 10);
 assert.equal(other.currentHp, hp);
 tick(engine, 1);
 assert.equal(target.rpgPossessedRifleLastReleaseWave16.nativePoint.col, 2);
 assert.ok(other.currentHp < hp);
});

test('RPG J2: releasing a Slig leaves its teammate’s current attack locked', () => {
 const c = make('possession', 'enemy', [hero('kirito_sao'), hero('noble_six')]);
 const { engine, actor, target, other } = c;
 const [, attacker, reserve] = engine.enemies;
 attacker.x = attacker.homeX = other.x - 135;
 attacker.y = attacker.homeY = other.y;
 other.currentHp = other.maxHp = 100000;
 start(c);
 tick(engine, 67);
 attacker.atb = reserve.atb = 100;
 assert.equal(engine.triggerEnemyAbility(attacker, 'special', [other.battleId]), true);
 assert.equal(engine.releaseRpgPossession(actor.battleId, 'enemy'), true);
 assert.equal(target.sourceControlWave16.active, false);
 assert.equal(attacker.actionPending, true);
 assert.equal(engine.canUseAction(reserve, 'simple', 'enemy'), false);
 let ticks = 0;
 while (attacker.actionPending && ticks++ < 300) engine.update();
 assert.equal(attacker.actionPending, false);
 assert.equal(engine.canUseAction(reserve, 'simple', 'enemy'), true);
});

for (const end of ['release', 'expiry']) test(`RPG J2: possession ${end} cancels its own pending rifle and returns the command`, () => {
 const c = make('possession', 'enemy', [hero('noble_six')]);
 const { engine, actor, target, other } = c;
 const reserve = engine.enemies[1];
 start(c);
 tick(engine, 67);
 if (end === 'expiry') {
  let ticks = 0;
  while (target.sourceControlWave16.remaining > 0.1 && ticks++ < 180) engine.update();
  assert.ok(target.sourceControlWave16.active);
 }
 reserve.atb = target.atb = 100;
 assert.equal(engine.beginPossessedTargeting(actor.battleId, 'enemy'), true);
 assert.equal(engine.confirmTargeting(), true);
 assert.equal(engine.enemyActionOwner, target);
 assert.equal(engine.canUseAction(reserve, 'simple', 'enemy'), false);
 const hp = other.currentHp;
 if (end === 'release') assert.equal(engine.releaseRpgPossession(actor.battleId, 'enemy'), true);
 else tick(engine, 8);
 assert.equal(target.sourceControlWave16.active, false);
 assert.equal(target.rpgPossessedRifleActionWave16, null);
 assert.equal(engine.enemyActionOwner, null);
 assert.equal(engine.canUseAction(reserve, 'simple', 'enemy'), true);
 tick(engine, 20);
 assert.equal(other.currentHp, hp);
 assert.equal(target.rpgPossessedRifleLastReleaseWave16, undefined);
});

test('RPG J2: the Paralyzer cannot unlock a teammate’s command while another enemy is still attacking', () => {
 const c = make('paralyzer', 'player', [], [hero('kirito_sao'), hero('noble_six')]);
 const { engine, actor, target, other } = c;
 const reserve = engine.enemies[2];
 actor.currentHp = actor.maxHp = 100000;
 other.x = other.homeX = actor.x + 135;
 other.atb = reserve.atb = 100;
 start(c);
 assert.equal(engine.triggerEnemyAbility(other, 'special', [actor.battleId]), true);
 assert.equal(engine.enemyActionOwner, other);
 let elapsed = 0;
 while (!target.sourceControlWave16?.active && elapsed++ < 90) engine.update();
 assert.equal(target.sourceControlWave16?.kind, 'paralyzer');
 assert.equal(other.actionPending, true);
 assert.equal(engine.canUseAction(reserve, 'simple', 'enemy'), false);

 elapsed = 0;
 while (other.actionPending && elapsed++ < 300) engine.update();
 assert.equal(other.actionPending, false);
 assert.equal(engine.canUseAction(reserve, 'simple', 'enemy'), true);
});

test('RPG J2: the Paralyzer unlocks the team when it interrupts the actor that owns the command', () => {
 const c = make('paralyzer', 'player');
 const { engine, actor, target, other } = c;
 target.x = target.homeX = actor.x + 135;
 other.atb = 100;
 start(c);
 tick(engine, engine.actorActions.get(actor).ticks - 1);
 assert.equal(engine.triggerEnemyAbility(target, 'simple', [actor.battleId]), true);
 assert.equal(engine.enemyActionOwner, target);
 const hp = actor.currentHp;
 tick(engine, 1);
 assert.equal(target.sourceControlWave16?.kind, 'paralyzer');
 assert.equal(engine.enemyActionOwner, null);
 assert.equal(engine.canUseAction(other, 'simple', 'enemy'), true);
 tick(engine, 40);
 assert.equal(actor.currentHp, hp);
});

function sourceCase(id,side){
 const own=[hero(id)],opposition=[hero('noble_six')];
 const engine=new Engine(1040,460,side==='player'?own:opposition,{monsters:side==='player'?opposition:own,bosses:[],customRoster:side==='player'?opposition:own},{add(){}},()=>{},()=>{},
 {universe:own[0].universe,customBattle:{singleRoster:true,opponentControl:'p2'}});engines.push(engine);engine.enemyGlobalRecovery=0;
 const actor=(side==='player'?engine.heroes:engine.enemies)[0],target=(side==='player'?engine.enemies:engine.heroes)[0];
 for(const unit of[actor,target]){unit.atb=-100000;unit.specialCharge=100;unit.state='idle';unit.actionPending=false;unit.y=unit.homeY=350;}
 actor.x=actor.homeX=side==='player'?200:840;target.x=target.homeX=actor.x+(side==='player'?180:-180);actor.atb=100;
 return{engine,actor,target,side};
}
for(const side of['player','enemy']){
 for(const[id,kind]of[['cuphead_mugman','mugman-super-art-ii'],['cuphead_ms_chalice','shield-pal-one-hit'],['hakumen_bb','yukikaze']]){
  test(`${side}: ${kind} resolves real incoming commands with its own source protection and physical retaliation`,()=>{
   const c=sourceCase(id,side);start(c);let steps=0;while(!c.actor.sourceProtectionWave16?.active&&steps++<100)c.engine.update();assert.ok(c.actor.sourceProtectionWave16?.active);
   const ownerHp=c.actor.currentHp,targetHp=c.target.currentHp;
   const originalDefense=c.actor.stats?.def??c.actor.def;
   if(kind==='mugman-super-art-ii'){
    c.actor.statusEffects.infected=300;tick(c.engine,60);assert.equal(c.actor.currentHp,ownerHp);
    assert.equal(c.actor.statusEffects.infected,240,'invulnerability prevents damage without cleansing infection');
   }
   if(kind==='yukikaze'){
    tick(c.engine,c.actor.stateTimer+1);assert.equal(c.actor.state,'idle');assert.equal(c.actor.sourceProtectionWave16.active,true);
    c.actor.atb=100;assert.equal(c.engine.canUseAction(c.actor,'simple',side),false,'an armed counter stance cannot retain its protection while starting another order');
   }
   const incoming=()=>{c.target.atb=100;c.target.state='idle';c.target.actionPending=false;c.engine.enemyActionLock=false;c.engine.enemyGlobalRecovery=0;assert.equal(c.engine.beginTargeting(c.target,'simple',side==='player'?'enemy':'player'),true);assert.equal(c.engine.confirmTargeting(),true);};
   if(kind==='shield-pal-one-hit'){
    tick(c.engine,240);assert.equal(c.actor.sourceProtectionWave16.active,true);assert.equal(c.actor.sourceProtectionWave16.charges,1);
    c.engine.applyDamage(c.target,c.actor,1,null,{delivery:'melee',sequenceParent:{},sequenceFraction:1/16});
    assert.equal(c.actor.currentHp,ownerHp);assert.equal(c.actor.sourceProtectionWave16.charges,1,'zero rounded sequence fragment must not consume Shield Pal');
    c.actor.battleItemShield=1000;c.engine.applyDamage(c.target,c.actor,10,null,{delivery:'melee'});
    assert.equal(c.actor.currentHp,ownerHp);assert.equal(c.actor.sourceProtectionWave16.charges,1,'a fully absorbed item-shield hit must not consume Shield Pal');
    c.actor.battleItemShield=0;
    c.target.talent='suppressing_fire';
   }
   incoming();
   if(kind==='yukikaze'){
    const positions=[c.actor.x];for(let n=0;n<90&&c.target.currentHp===targetHp;n++){c.engine.update();positions.push(c.actor.x);}
    assert.equal(c.actor.currentHp,ownerHp);assert.ok(c.target.currentHp<targetHp);assert.ok(positions.some(x=>Math.abs(x-positions[0])>1));
    for(let n=1;n<positions.length;n++)assert.ok(Math.abs(positions[n]-positions[n-1])<=140/6+1e-8,'counter must advance by physical dash steps');
    assert.equal(c.actor.rpgSpecialVisual.visualConfirmedContact.confirmed,true);
   }else{
    tick(c.engine,40);assert.equal(c.actor.currentHp,ownerHp);
    if(kind==='shield-pal-one-hit')assert.equal(c.actor.stats?.def??c.actor.def,originalDefense,'a source-blocked hit must not apply its defense debuff');
    if(kind==='mugman-super-art-ii')tick(c.engine,Math.ceil(c.actor.sourceProtectionWave16.remaining*60)+2);
    assert.equal(c.actor.sourceProtectionWave16.active,false);const afterExpiryHp=c.actor.currentHp;incoming();tick(c.engine,40);assert.ok(c.actor.currentHp<afterExpiryHp);
   }
   assert.equal(c.actor.specialCharge,0);
   const cleanup=sourceCase(id,side);start(cleanup);let cleanupFrames=0;
   while(!cleanup.actor.sourceProtectionWave16?.active&&cleanupFrames++<100)cleanup.engine.update();
   const cleanupHp=cleanup.actor.currentHp,cleanupCharge=cleanup.actor.specialCharge;
   assert.equal(cleanup.actor.sourceProtectionWave16.active,true);cleanup.engine.dispose();
   assert.equal(cleanup.actor.sourceProtectionWave16.active,false);
   assert.notEqual(cleanup.actor.sourceProtectionEntityWave16?.active,true);
   assert.equal(cleanup.actor.currentHp,cleanupHp);assert.equal(cleanup.actor.specialCharge,cleanupCharge);
  });
 }
 for(const id of['kirito_sao','aya_brea','bt_7274_tf2'])test(`${side}: ${id} timed source sequence never hits a victim that escaped its real range, and damage interrupts all remaining hits`,()=>{
  for(const invalid of['escaped','interrupted']){
   const c=sourceCase(id,side);start(c);let frames=0;while(!c.actor.rpgSourceSequence?.releases.length&&frames++<120)c.engine.update();assert.ok(c.actor.rpgSourceSequence?.releases.length);
   const hp=c.target.currentHp;assert.ok(hp<c.target.maxHp);
   if(invalid==='escaped')c.target.x=c.target.homeX=side==='player'?1020:20;
   else c.engine.applyDamage(c.target,c.actor,20,null,{delivery:'melee'});
   tick(c.engine,500);assert.equal(c.target.currentHp,hp,invalid);assert.equal(c.actor.specialCharge,0);
  }
  if(id==='kirito_sao'){
   for(const geometry of['contact','vertical-miss','body-blocked']){
    const c=sourceCase(id,side);c.target.currentHp=c.target.maxHp=100000;start(c);
    const sequence=c.actor.rpgSourceSequence,approach=sequence.sourceBladeApproachWave16,hp=c.target.currentHp;
    if(geometry==='vertical-miss')c.target.y-=100;
    if(geometry==='body-blocked'){
     const blocker={...c.target,battleId:'physical-blocker',runtimeId:'physical-blocker',x:c.actor.x+approach.facing*30,atb:-100000};
     (side==='player'?c.engine.heroes:c.engine.enemies).push(blocker);
    }
    const beforePause=JSON.stringify({x:c.actor.x,approach});c.engine.setPaused(true);tick(c.engine,60);
    assert.equal(JSON.stringify({x:c.actor.x,approach}),beforePause);c.engine.setPaused(false);
    let priorX=c.actor.x;
    for(let frame=0;frame<209;frame++){
     c.engine.update();assert.ok(Math.abs(c.actor.x-priorX)<=200/60+1e-8,'blade approach must advance in bounded simulation steps');priorX=c.actor.x;
    }
    assert.ok(approach.travelled<=80+1e-8);assert.equal(sequence.releases.length,16);
    const contacts=sequence.sourceBladeContactsWave16||[];assert.equal(contacts.length,16);
    assert.ok(contacts.every(row=>!row.acceptedDamage||row.physicalOverlap),'HP changes require the measured native primary tip inside the body');
    if(geometry==='contact'){
     assert.ok(c.target.currentHp<hp);assert.ok(contacts.some(row=>row.acceptedDamage));
     assert.ok(contacts.some(row=>!row.physicalOverlap),'backswings may miss rather than extending a physical blade');
    }else{
     assert.equal(c.target.currentHp,hp,geometry);assert.ok(contacts.every(row=>!row.acceptedDamage));
     if(geometry==='body-blocked')assert.equal(approach.blockedByBody,true);
    }
   }
  }
 });
}
