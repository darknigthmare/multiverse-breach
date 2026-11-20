import assert from'node:assert/strict';import{before,after,test}from'node:test';import{createServer}from'vite';
let vite,Fighter,Smash,Rpg,Tactics,heroes,mechanics,tickMelee,npcCatalog;const engines=[],noop=()=>{};
before(async()=>{vite=await createServer({configFile:false,publicDir:false,appType:'custom',logLevel:'silent',cacheDir:'/tmp/w17-source-tests-vite',server:{middlewareMode:true,hmr:false,watch:null}});({EngineFighter:Fighter}=await vite.ssrLoadModule('/src/game/engineFighter.js'));({EngineSmash:Smash}=await vite.ssrLoadModule('/src/game/engineSmash.js'));({EngineRpg:Rpg}=await vite.ssrLoadModule('/src/game/engineRpg.js'));({EngineTactics:Tactics}=await vite.ssrLoadModule('/src/game/engineTactics.js'));({HEROES_DB:heroes}=await vite.ssrLoadModule('/src/game/heroes.js'));npcCatalog=await vite.ssrLoadModule('/src/game/combat/sourceCaptureEnemyCatalogWave17.js');mechanics=await vite.ssrLoadModule('/src/game/combat/sourceMechanicsWave17.js');({tickMeleeCombatActor:tickMelee}=await vite.ssrLoadModule('/src/game/melee/meleeCombatRuntime.js'));});
after(async()=>{engines.forEach(e=>e.dispose?.());await vite?.close();});
const dummy=()=>({id:'w17-runtime-target',name:'W17 explicit scenario target',universe:'W17 fixture',weaponType:'melee',stats:{hp:10000,atk:10,def:2,spd:1},simple:{name:'Fixture contact',type:'melee',dmg:1},defense:{name:'Fixture guard',type:'guard',reduce:.4,dur:1},special:{name:'Fixture special',type:'melee',dmg:1}});
const hero=id=>structuredClone(heroes.find(h=>h.id===id));
function make(mode,id,allies=[],targetTemplate=null){const own=[hero(id),...allies.map(hero)],opposition=[targetTemplate||dummy()];const stage={universe:'Nexus de Convergence',disableHazards:true,customBattle:{singleRoster:true,opponentControl:'p2'}};
 const e=mode==='fighter'?new Fighter(1100,600,own,opposition,{add:noop},noop,noop,{opponentControl:'p2'}):new({melee:Smash,rpg:Rpg,tactics:Tactics}[mode])(1100,600,own,{monsters:opposition,bosses:[],customRoster:opposition},{add:noop},noop,noop,stage);engines.push(e);
 const actor=mode==='fighter'?e.getActive('player'):e.heroes[0],target=mode==='fighter'?e.getActive('cpu'):e.enemies[0],actors=mode==='fighter'?[actor,target]:[...e.heroes,...e.enemies];
 if(mode==='fighter')e.countdown=0;if(mode==='melee')e.syncPreMatchFromServer(3000);
 for(const u of actors){u.currentHp=u.maxHp=10000;u.atb=-100000;u.specialCharge=u.meter=100;u.state='idle';u.action=null;u.actionPending=false;u.cooldown=0;}
 actor.atb=100;actor.x=actor.homeX=400;target.x=target.homeX=500;actor.y=actor.homeY=target.y=target.homeY=mode==='fighter'?e.groundY:400;actor.facing=1;target.facing=-1;
 e.enemyGlobalRecovery=100000;
 if(mode==='tactics'){e.activeUnit=actor;e.activeUnitType='hero';e.actionPhase='action';e.selectedAction='special';e.selectedActionExplicit=true;
   if(e.verticalTerrain){const surfaces=e.terrain.surfaces.filter(s=>s.walkable);let pair;for(const a of surfaces){const b=surfaces.find(b=>a.z===b.z&&Math.abs(a.x-b.x)+Math.abs(a.y-b.y)===1);if(b){pair=[a,b];break;}}assert.ok(pair);for(const[u,s]of[[actor,pair[0]],[target,pair[1]]]){u.gridX=s.x;u.gridY=s.y;u.gridZ=s.z;u.surfaceId=s.id;Object.assign(u,e.verticalTerrain.position(s.x,s.y,s.id,true,true));}}
   else{actor.gridX=3;actor.gridY=3;target.gridX=4;target.gridY=3;}e.syncActorsToCamera();}
 const cast=()=>mode==='fighter'?e.tryAction('player','super'):mode==='melee'?e.triggerMeleeSuper(actor):mode==='rpg'?(e.beginTargeting(actor,'special')&&e.confirmTargeting()):e.handleCellClick(target.gridX,target.gridY,target.surfaceId).handled===true;
 const step=count=>{for(let n=0;n<count;n++){if(mode==='fighter'){mechanics.advanceSourceMechanicsWave17(e,[[actor],[target]],1/60,{groundY:e.groundY});e.updateActions(1/60);}else if(mode==='melee'){mechanics.advanceSourceMechanicsWave17(e,[e.heroes,e.enemies],1/60);for(const u of actors)tickMelee(u,1/60,{resolveActionHit:(s,a)=>e.resolveMeleeActionHit(s,a)});}else e.update();}};
 return{e,actor,target,actors,cast,step,mode};}
for(const mode of['fighter','melee','rpg','tactics'])test(mode+': Waffle captures only an explicitly admitted actual target with zero HP, lift, faction change or input proxy',()=>{
 const c=make(mode,'tail_concerto_waffle');assert.equal(c.cast(),false);assert.equal(c.actor.specialCharge,100);c.target.bubbleCaptureEligible=true;const hp=c.target.currentHp,y=c.target.y;assert.equal(c.cast(),true);if(mode==='tactics')assert.equal(c.target.sourceBubbleCaptureWave17,undefined);c.step(mode==='tactics'?Math.ceil(c.e.getAttackProfile(c.actor,'special').hitAt*60):23);assert.equal(c.target.sourceBubbleCaptureWave17?.active,true);assert.equal(c.target.currentHp,hp);assert.equal(c.target.y,y);assert.equal(c.target.sourceControlWave16?.inputProxy,undefined);assert.equal(mechanics.isBubbleActorImmobilizedWave17(c.target),true);c.actor.currentHp=0;assert.equal(mechanics.isBubbleActorImmobilizedWave17(c.target),false);
});
for(const mode of['fighter','melee','rpg','tactics'])test(mode+': Jade’s photo reveals the selected opponent without attack buff, guard, healing or HP damage',()=>{
 const c=make(mode,'beyond_good_evil_jade'),hp=c.target.currentHp,actorHp=c.actor.currentHp;assert.equal(c.cast(),true);if(mode==='tactics')assert.equal(c.target.sourcePhotographicEvidenceWave17,undefined);c.step(mode==='tactics'?Math.ceil(c.e.getAttackProfile(c.actor,'special').hitAt*60):35);assert.equal(c.target.sourcePhotographicEvidenceWave17?.active,true);assert.equal(c.target.currentHp,hp);assert.equal(c.actor.currentHp,actorHp);assert.equal(c.target.superBuffSeconds||0,0);assert.equal(c.target.rpgBuffTicks||0,0);assert.equal(c.target.tacticsBuffTicks||0,0);assert.equal(c.target.meleeSuperSupport,undefined);assert.equal(c.actor.superBuffSeconds||0,0);
});
test('RPG: ordinary Melody performs a physical cardinal step; an immobile replay never damages',()=>{
 const c=make('rpg','crypt_necrodancer_melody');c.actor.x=c.actor.homeX=288;c.actor.y=c.actor.homeY=352;c.target.x=c.target.homeX=416;c.target.y=c.target.homeY=352;const hp=c.target.currentHp;assert.equal(c.cast(),true);assert.ok(c.actor.sourceRpgLuteMoveWave17);c.step(18);assert.equal(c.actor.x,352);assert.ok(c.target.currentHp<hp);const settled=c.target.currentHp;c.step(20);assert.equal(c.target.currentHp,settled);
});
test('RPG: stock Medic really channels, charges through40 injured-patient seconds, and gives8s protection only through an existing ally beam',()=>{
 const c=make('rpg','team_fortress_2_scout',['team_fortress_2_medic']),medic=c.e.heroes[1];medic.x=medic.homeX=340;medic.y=medic.homeY=400;medic.atb=100;assert.equal(c.e.canUseAction(c.actor,'summon'),false);assert.equal(c.e.beginTargeting(medic,'secondary'),true);assert.equal(c.e.selectTarget(c.actor.battleId),true);assert.equal(c.e.confirmTargeting(),true);c.step(20);assert.equal(medic.sourceMediGunWave17?.connected,true);
 for(let n=0;n<2400;n++){c.actor.currentHp=5000;c.e.update();}assert.equal(mechanics.findChargedMedicWave17(c.actor,c.e.heroes),medic);c.actor.atb=100;c.actor.specialCharge=100;assert.equal(c.e.beginTargeting(c.actor,'summon'),true);assert.equal(c.e.confirmTargeting(),true);assert.equal(c.e.activeSummon.sourceMedicWave17,medic);c.step(100);assert.equal(medic.sourceMediGunWave17.uberRemaining,8);c.step(92);assert.equal(c.e.activeSummon,null);const hp=c.actor.currentHp;c.e.applyDamage(c.target,c.actor,50);assert.equal(c.actor.currentHp,hp);medic.x=999;c.e.applyDamage(c.target,c.actor,50);assert.ok(c.actor.currentHp<hp);
});

function prepareChargedMedic() {
 const c = make('rpg', 'team_fortress_2_scout', ['team_fortress_2_medic']);
 const medic = c.e.heroes[1];
 medic.x = medic.homeX = 340;
 medic.y = medic.homeY = 400;
 medic.atb = 100;
 assert.equal(c.e.beginTargeting(medic, 'secondary'), true);
 assert.equal(c.e.selectTarget(c.actor.battleId), true);
 assert.equal(c.e.confirmTargeting(), true);
 c.step(20);
 assert.equal(medic.sourceMediGunWave17?.connected, true);
 medic.sourceMediGunWave17.charge = 1;
 c.actor.atb = c.actor.specialCharge = 100;
 return { ...c, medic };
}

test('RPG: ÜberCharge is unavailable when a fully charged Medic has already been hit', () => {
 const { e, actor, medic, target } = prepareChargedMedic();
 assert.equal(e.canUseAction(actor, 'summon'), true);
 e.applyDamage(target, medic, 50);
 assert.equal(medic.state, 'hit');
 assert.equal(e.canUseAction(actor, 'summon'), false);
 assert.equal(e.beginTargeting(actor, 'summon'), false);
 assert.equal(actor.specialCharge, 100);
});

test('RPG: an ÜberCharge cinematic cannot activate a new beam after losing its committed channel', () => {
 const { e, actor, medic, step } = prepareChargedMedic();
 assert.equal(e.beginTargeting(actor, 'summon') && e.confirmTargeting(), true);
 const selectedBeam = medic.sourceMediGunWave17;
 assert.equal(e.activeSummon.sourceMedicWave17, medic);
 mechanics.stopMediGunBeamWave17(medic);
 assert.equal(mechanics.startMediGunBeamWave17(medic, actor, { allied: true }), true);
 assert.notEqual(medic.sourceMediGunWave17, selectedBeam);
 step(1);
 assert.equal(e.activeSummon, null);
 step(100);
 assert.equal(medic.sourceMediGunWave17.uberRemaining, 0);
 assert.equal(medic.sourceMediGunWave17.charge, 1);
});

for(const mode of['fighter','melee','rpg','tactics'])test(mode+': the canonical manual kitten keeps its actual native body through capture and release and can never deal invented HP attacks',()=>{
 const c=make(mode,'tail_concerto_waffle',[],structuredClone(npcCatalog.CANONICAL_CAPTURE_NPC_WAVE17));const hp=c.actor.currentHp,targetHp=c.target.currentHp,targetY=c.target.y;
 const camp={hero:c.e.heroes?.includes(c.target)||false,enemy:c.e.enemies?.includes(c.target)||false,side:c.target.side,team:c.target.team};
 // Commit the real next recipient turn before the capture begins.
 if(mode==='tactics')c.e.turnQueue=[{unit:c.target,type:'enemy'}];
 assert.equal(c.target.sourceEnemyId,'tail_concerto_red_vest_kitten');assert.equal(c.cast(),true);if(mode==='tactics')assert.equal(c.target.sourceBubbleCaptureWave17,undefined);c.step(mode==='tactics'?Math.ceil(c.e.getAttackProfile(c.actor,'special').hitAt*60):23);assert.equal(npcCatalog.getSourceCaptureEnemyFrameWave17(c.target,.2).phase,'captured');
 if(mode==='fighter')c.e.applyHit(c.target,c.actor,{type:'light',base:80,guardDamage:0,knockback:0});else if(mode==='melee')c.e.applyDamage(c.target,c.actor,80,0);else c.e.applyDamage(c.target,c.actor,80);
 assert.equal(c.actor.currentHp,hp);assert.equal(c.target.currentHp,targetHp);assert.equal(c.target.y,targetY);
 assert.deepEqual({hero:c.e.heroes?.includes(c.target)||false,enemy:c.e.enemies?.includes(c.target)||false,side:c.target.side,team:c.target.team},camp);
 assert.equal(c.target.sourceControlWave16?.inputProxy,undefined);
 if(mode==='tactics'){
  assert.equal(c.target.sourceBubbleCaptureWave17.active,true);assert.equal(c.target.sourceBubbleCaptureWave17.remaining,1.25);
  assert.equal(c.target.sourceBubbleCaptureWave17.turnsRemaining,1);assert.notEqual(c.e.activeUnit,c.target);
  let beforeTargetTurn=0;
  while(c.e.activeUnit!==c.target&&beforeTargetTurn++<180){
   assert.equal(c.target.sourceBubbleCaptureWave17.active,true,'capture remains active before the queued target turn');
   c.step(1);
  }
  assert.ok(beforeTargetTurn<=180);assert.equal(c.e.activeUnit,c.target);
  assert.equal(c.target.sourceBubbleCaptureWave17.endedBy,'target-turn-consumed');
  assert.equal(c.target.sourceBubbleCaptureWave17.active,false);assert.equal(c.target.currentHp,targetHp);assert.equal(c.target.y,targetY);
  assert.deepEqual({hero:c.e.heroes.includes(c.target),enemy:c.e.enemies.includes(c.target),side:c.target.side,team:c.target.team},camp);
 }
 let expiryTicks=0;while(c.target.sourceBubbleCaptureWave17.active&&expiryTicks++<180)c.step(1);assert.ok(expiryTicks<=180);
 assert.equal(c.target.sourceBubbleCaptureWave17.active,false);assert.equal(npcCatalog.getSourceCaptureEnemyFrameWave17(c.target,.5).phase,'released');
});

for(const mode of ['rpg','tactics'])test(mode+': Gyrodisk advances its real sixteen-pose clock, freezes in pause, releases from the glove and clears after recovery',()=>{
 const c=make(mode,'beyond_good_evil_jade'),hp=c.target.currentHp;
 const accepted=mode==='rpg'?(c.e.beginTargeting(c.actor,'secondary')&&c.e.confirmTargeting()):c.e.beginSourceGyrodiskActionWave17(c.actor,c.target,'secondary').length>0;assert.equal(accepted,true);
 const field=mode==='rpg'?'rpgGyrodiskActionWave17':'tacticsGyrodiskActionWave17',action=c.actor[field];assert.ok(action);assert.equal(action.elapsed,0);
 c.e.setPaused(true);for(let n=0;n<60;n++)c.e.update();assert.equal(action.elapsed,0);assert.equal(c.target.currentHp,hp);c.e.setPaused(false);
 c.step(4);assert.ok(action.elapsed>0);assert.ok(action.elapsed<action.hitAt);assert.equal(c.target.currentHp,hp);
 let tick=4;while(!c.actor.sourceGyrodiskLastReleaseWave17&&tick++<80)c.step(1);const origin=c.actor.sourceGyrodiskLastReleaseWave17;assert.ok(origin);assert.equal(origin.kind,'jade-gyrodisk-glove-wave17');assert.equal(origin.separateFromCamera,true);assert.equal(origin.index,10);assert.ok(c.target.currentHp<hp);
 c.step(80);assert.equal(c.actor[field],null);
});
for(const mode of ['rpg','tactics'])test(mode+': damage before the Gyrodisk release cancels its native action and cannot ghost-hit later',()=>{
 const c=make(mode,'beyond_good_evil_jade'),hp=c.target.currentHp;
 if(mode==='rpg'){assert.equal(c.e.beginTargeting(c.actor,'secondary')&&c.e.confirmTargeting(),true);}else assert.ok(c.e.beginSourceGyrodiskActionWave17(c.actor,c.target,'secondary').length);
 c.step(3);c.e.applyDamage(c.target,c.actor,50);c.step(90);assert.equal(c.target.currentHp,hp);assert.equal(c.actor[mode==='rpg'?'rpgGyrodiskActionWave17':'tacticsGyrodiskActionWave17'],null);assert.equal(c.actor.sourceGyrodiskLastReleaseWave17,undefined);
});
for(const mode of ['fighter','melee','rpg','tactics'])test(mode+': Okarun can commit only two source all-out actions, and the third consumes no charge',()=>{
 const c=make(mode,'oken_dandadan');
 // updateActions isolates action release; the full update owns hit-stop decay.
 // Reset that global clock between these independently prepared commitments.
 for(let i=0;i<2;i++){c.actor.atb=100;c.actor.specialCharge=c.actor.meter=100;c.actor.state='idle';c.actor.action=null;c.actor.actionPending=false;c.actor.cooldown=0;if(c.actor.abilityCooldowns)for(const k of Object.keys(c.actor.abilityCooldowns))c.actor.abilityCooldowns[k]=0;
  if(mode==='tactics'){c.e.activeUnit=c.actor;c.e.activeUnitType='hero';c.e.actionPhase='action';c.e.selectedAction='special';c.e.selectedActionExplicit=true;}
  if(mode==='fighter')c.e.hitStop=0;
  assert.equal(c.cast(),true);c.step(mode==='tactics'?Math.ceil(c.e.getAttackProfile(c.actor,'special').duration*60)+1:65);
 }
 assert.equal(c.actor.sourceOkarunAllOutUsesWave17,2);c.actor.atb=100;c.actor.specialCharge=c.actor.meter=100;c.actor.state='idle';c.actor.action=null;c.actor.actionPending=false;c.actor.cooldown=0;if(c.actor.abilityCooldowns)for(const k of Object.keys(c.actor.abilityCooldowns))c.actor.abilityCooldowns[k]=0;
 if(mode==='tactics'){c.e.activeUnit=c.actor;c.e.activeUnitType='hero';c.e.actionPhase='action';c.e.selectedAction='special';c.e.selectedActionExplicit=true;}
 if(mode==='fighter')c.e.hitStop=0;
 assert.equal(c.cast(),false);assert.equal(mode==='fighter'?c.actor.meter:c.actor.specialCharge,100);
});
for(const mode of ['fighter','melee','tactics'])test(mode+': Melody’s real source action moves a cardinal step and only movement contacts may damage',()=>{
 const c=make(mode,'crypt_necrodancer_melody');
 if(mode==='melee'){const p=c.e.platforms.filter(p=>p.x2-p.x1>=240).sort((a,b)=>(b.x2-b.x1)-(a.x2-a.x1))[0];assert.ok(p);c.actor.x=(p.x1+p.x2)/2-70;c.target.x=c.actor.x+140;c.actor.y=c.target.y=p.y;}
 const before={x:c.actor.x,y:c.actor.y,gx:c.actor.gridX,gy:c.actor.gridY},hp=c.target.currentHp;assert.equal(c.cast(),true);
 for(let n=0;n<65;n++){if(mode==='fighter')c.e.update(1/60);else c.e.update();}
 assert.ok(c.actor.x!==before.x||c.actor.y!==before.y||c.actor.gridX!==before.gx||c.actor.gridY!==before.gy);assert.ok(c.target.currentHp<hp,'only the real accepted step must resolve lute contacts');const settled=c.target.currentHp;
 if(mode==='fighter')c.e.applyHit(c.actor,c.target,{type:'light',base:900,range:500,knockback:0});else if(mode==='melee')c.e.applyDamage(c.actor,c.target,900,0);else c.e.applyDamage(c.actor,c.target,900);
 assert.equal(c.target.currentHp,settled,'a stationary replay without a movement contact has zero HP effect');
});
test('RPG: Momo’s actual reinforcement and an already present Okarun share the same two-use all-out resource',()=>{
 const c=make('rpg','momo_ayase',['oken_dandadan']),okarun=c.e.heroes[1];okarun.x=okarun.homeX=340;okarun.y=okarun.homeY=400;okarun.atb=100;okarun.specialCharge=100;
 assert.equal(c.e.beginTargeting(okarun,'special')&&c.e.confirmTargeting(),true);c.step(65);assert.equal(okarun.sourceOkarunAllOutUsesWave17,1);
 c.actor.atb=100;c.actor.specialCharge=100;assert.equal(c.e.beginTargeting(c.actor,'summon')&&c.e.confirmTargeting(),true);assert.equal(okarun.sourceOkarunAllOutUsesWave17,2);assert.equal(c.actor.sourceOkarunAllOutUsesWave17,undefined);c.step(192);
 okarun.atb=100;okarun.specialCharge=100;okarun.state='idle';okarun.actionPending=false;assert.equal(c.e.beginTargeting(okarun,'special'),false);assert.equal(okarun.specialCharge,100);
});
