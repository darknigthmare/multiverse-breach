import { register } from 'node:module';
import { afterEach, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
register('./sourceSceneTestLoader.mjs', import.meta.url);
const [{EngineTactics},{HEROES_DB},{ENEMIES_DB},{SOURCE_SCENE_STAGES,resolveSourceScene,getSourceSceneBattlefield},sceneApi,{resolveStageEnemyData},{getCanonicalEncounterBriefing},{evaluateMissionAccess},{readStaticStages},spriteApi]=await Promise.all([
  import('../src/game/engineTactics.js'),import('../src/game/heroes.js'),import('../src/game/enemies.js'),
  import('../src/game/sourceSceneStages.js'),import('../src/game/sourceSceneEncounter.js'),
  import('../src/game/stageEnemyResolver.js'),import('../src/game/canonEncounterBriefing.js'),
  import('../src/game/missions/missionAccessRules.js'),import('./riftDossierStaticStages.mjs'),
  import('../src/game/spriteAssets.js')
]);
const engines=[];
const make=(stage,team)=>{
 const h=HEROES_DB.find(h=>h.id===stage.sceneLead.id);
 const pool=resolveStageEnemyData({stage,...ENEMIES_DB[stage.universe]});
 const callbacks=[];
 const e=new EngineTactics(960,600,team||[h],pool,{add(){}},()=>{},(...args)=>callbacks.push(args),{...stage});
 e.testCallbacks=callbacks;engines.push(e);return e;
};
afterEach(()=>engines.splice(0).forEach(e=>e.dispose()));
function settle(e){for(let n=0;n<200 && !e.gameOver && !e.canCommandActiveUnit();n++)e.update();}
function walkTo(e,cell){
 for(let i=0;i<50&&!e.gameOver;i++){
  settle(e);const a=e.sourceScene.actor;
  if(a.gridX===cell.x&&a.gridY===cell.y)return;
  if(e.actionPhase==='action')e.cancelSelectedAction();
  const route=sceneApi.sourceSceneRoute(e,cell);
  const p=route.filter(c=>c.cost<=e.movementBudget-e.movementSpent).at(-1);
  if(p)assert.equal(e.handleCellClick(p.x,p.y).handled,true);
  if(a.gridX===cell.x&&a.gridY===cell.y)return;
  e.skipActiveTurn();
 }
 assert.fail('Route did not arrive');
}
function doCommand(e,id){settle(e);const c=e.sourceScene.definition.commands.find(c=>c.id===id);if(!c.anywhere)walkTo(e,c.cell);assert.equal(e.triggerSourceSceneAction(id,e.turnSerial),true,id);settle(e);}

for(const d of SOURCE_SCENE_STAGES){
 test(`${d.id}: exact native stage, no fallback army or automatic empty-arena victory`,()=>{
  const e=make(d);assert.equal(e.objective,'source_scene');assert.equal(e.enemies.length,0);assert.equal(e.heroes.length,1);
  for(let i=0;i<180;i++)e.update();assert.equal(e.gameOver,false);assert.equal(e.sourceScene.turns,0);
  assert.equal(e.missionProfile.reinforcementEvery,0);assert.equal(e.missionProfile.hazardPulseEvery,0);
 });
 test(`${d.id}: complete manual route through native cells and commands`,()=>{
  const e=make(d);for(const c of d.commands.filter(c=>!c.repeatable))doCommand(e,c.id);
  assert.equal(e.battleResult,'victory');assert.equal(e.sourceScene.turns,e.turnsElapsed);
  assert.equal(e.objectiveProgress,e.objectiveTarget);assert.equal(e.getCombatSummary().sourceEncounter.artApproved,false);
  for(let i=0;i<300;i++)e.update();assert.equal(e.testCallbacks.length,1);assert.doesNotThrow(()=>JSON.stringify(e.getCombatSummary()));
 });
 test(`${d.id}: native autoBattle reaches the real victory condition`,()=>{
  const e=make(d);e.autoBattle=true;e.runHeroAI();
  for(let i=0;i<20000&&!e.gameOver;i++)e.update();
  assert.equal(e.battleResult,'victory');assert.ok(e.sourceScene.log.length>=d.commands.filter(c=>!c.repeatable).length);
 });
 test(`${d.id}: distant, unknown and premature final commands cannot consume a turn`,()=>{
  const e=make(d),before=JSON.stringify(e.getSourceSceneState());
  assert.equal(e.triggerSourceSceneAction('not-a-command',e.turnSerial),false);
  assert.equal(e.triggerSourceSceneAction(d.commands[0].id,e.turnSerial),false);
  assert.equal(e.triggerSourceSceneAction(d.commands.find(c=>c.final).id,e.turnSerial),false);
  assert.equal(JSON.stringify(e.getSourceSceneState()),before);assert.equal(e.turnsElapsed,0);
 });
 test(`${d.id}: native pause rejects commands and movement without advancing pressure`,()=>{
  const e=make(d);walkTo(e,d.commands[0].cell);e.setPaused(true);
  const before=JSON.stringify(e.getSourceSceneState());
  assert.equal(e.triggerSourceSceneAction(d.commands[0].id,e.turnSerial),false);
  assert.equal(e.handleCellClick(0,0).handled,false);assert.equal(e.skipActiveTurn(),false);
  for(let i=0;i<300;i++)e.update();assert.equal(JSON.stringify(e.getSourceSceneState()),before);
  e.setPaused(false);assert.equal(e.triggerSourceSceneAction(d.commands[0].id,e.turnSerial),true);
 });
 test(`${d.id}: a command consumes one turn; duplicate/stale/non-numeric tokens are refused`,()=>{
  const e=make(d),c=d.commands[0];walkTo(e,c.cell);const token=e.turnSerial,n=e.turnsElapsed;
  for(const t of [undefined,null,NaN,Infinity,String(token),token-1])assert.equal(e.triggerSourceSceneAction(c.id,t),false);
  assert.equal(e.triggerSourceSceneAction(c.id,token),true);assert.equal(e.triggerSourceSceneAction(c.id,token),false);
  assert.equal(e.turnsElapsed,n+1);settle(e);assert.equal(e.triggerSourceSceneAction(c.id,token),false);
 });
 test(`${d.id}: source actor replacement, even same id, invalidates mission`,()=>{
  const e=make(d);const old=e.heroes[0];e.heroes[0]={...old};e.activeUnit=e.heroes[0];
  e.update();assert.equal(e.battleResult,'defeat');assert.equal(e.sourceScene.reason,'protagonist_lost');
 });
 test(`${d.id}: a KO followed by resurrection cannot resume an old encounter`,()=>{
  const e=make(d),h=e.heroes[0];h.currentHp=0;h.state='dead';e.invalidateActorActions(h);
  h.currentHp=h.maxHp;h.state='idle';e.update();assert.equal(e.battleResult,'defeat');
 });
 test(`${d.id}: source identity/edition changes cannot retain active commands`,()=>{
  const e=make(d);e.stage.incarnation='wrong edition';e.update();assert.equal(e.battleResult,'defeat');
 });
 test(`${d.id}: expired turns fail, no free empty-roster reward`,()=>{
  const e=make(d);for(let n=0;n<d.turnLimit&&!e.gameOver;n++){settle(e);e.skipActiveTurn();}
  assert.equal(e.battleResult,'defeat');assert.equal(e.sourceScene.reason,'turn_limit');
 });
 test(`${d.id}: ordinary kits, pickups and crossover events cannot bypass source actions`,()=>{
  const e=make(d);for(const key of ['simple','attack','heavy','secondary','special'])assert.equal(e.selectAction(key),false);
  assert.equal(e.applyTacticalBattleItem({effect:{ultimateDamage:99999,heal:100}},'manual'),false);
  assert.equal(e.triggerCombatEvent('hammer_strike'),false);assert.equal(e.objectiveProgress,0);
 });
 test(`${d.id}: team and global templates stay unchanged; no substitute granted`,()=>{
  const h=HEROES_DB.find(h=>h.id===d.sceneLead.id),other=HEROES_DB.find(h=>h.id!==d.sceneLead.id);
  const before=JSON.stringify([h,other,ENEMIES_DB[d.universe]]);const e=make(d,[h,other]);
  assert.equal(e.heroes.length,1);assert.equal(e.heroes[0].id,h.id);assert.notEqual(e.heroes[0],h);
  assert.equal(JSON.stringify([h,other,ENEMIES_DB[d.universe]]),before);
  assert.throws(()=>make(d,[other]),/requires exactly one/);assert.throws(()=>make(d,[h,h]),/requires exactly one/);
 });
 test(`${d.id}: native movement spends AP and cannot jump blocked geometry`,()=>{
  const e=make(d),p=d.field.blocked[0];assert.equal(e.handleCellClick(...p).handled,false);
  const move=e.getReachableCells(e.activeUnit,2).find(p=>p.cost===2);assert.ok(move);
  assert.equal(e.handleCellClick(move.x,move.y).handled,true);assert.equal(e.movementSpent,2);
  assert.deepEqual(e.getReachableCells(e.activeUnit,0).map(p=>p.cost),[0]);
 });
 test(`${d.id}: marked danger resolves once per ended turn and not during idle`,()=>{
  const e=make(d),p=sceneApi.getSourceSceneDanger(e.sourceScene)[0],a=e.heroes[0];
  a.gridX=p.x;a.gridY=p.y;const hp=a.currentHp;
  for(let i=0;i<60;i++)e.update();assert.equal(a.currentHp,hp);
  e.skipActiveTurn();assert.ok(a.currentHp<hp);const after=a.currentHp;
  e.endActiveTurn();e.updateTacticsObjective(true);assert.equal(a.currentHp,after);
 });
 test(`${d.id}: cancelled/disposed scene cannot issue delayed victory`,()=>{
  const e=make(d);e.dispose();assert.equal(e.triggerSourceSceneAction(d.commands[0].id,e.turnSerial),false);
  for(let i=0;i<150;i++)e.update();assert.equal(e.testCallbacks.length,0);
 });
 test(`${d.id}: exact source briefing exists in FR and EN`,()=>{
  for(const lang of ['fr','en']){const b=getCanonicalEncounterBriefing(d,lang);assert.ok(b.objective.length>50);assert.match(b.adaptation,/certifi/);}
 });
 for(const [name,patch] of Object.entries({custom:{customBattle:{}},isCustom:{isCustom:true},p2:{isCustomBattle:true},wrongMode:{mode:'Smash'},wrongUniverse:{universe:'Elsewhere'},wrongEdition:{incarnation:'Another'},wrongId:{id:987654},baseArena:{forceBaseArena:true},hidden:{dlcSuppressedArena:true}})){
  test(`${d.id}: ${name} does not inherit source controller/battlefield`,()=>{
   const stage={...d,...patch};assert.equal(resolveSourceScene(stage),null);assert.equal(getSourceSceneBattlefield(stage),null);
  });
 }
 test(`${d.id}: protagonist required by native mission access even on replay`,()=>{
  const hero=HEROES_DB.find(h=>h.id===d.sceneLead.id);
  const context={activeTeam:[hero.id],ownedHeroIds:[hero.id],eligibleHeroIds:[hero.id],heroDb:HEROES_DB,baseUnlocked:true,completedStages:[d.id]};
  const valid=evaluateMissionAccess(d,context);assert.equal(valid.allowed,true);
  const wrong=evaluateMissionAccess(d,{...context,activeTeam:[]});assert.equal(wrong.allowed,false);
 });
}
test('Narcissus: harness locks movement, without locking the remaining controls',()=>{
 const d=SOURCE_SCENE_STAGES[1],e=make(d);for(const id of ['suit','grappleGun','harness'])doCommand(e,id);
 assert.equal(e.handleCellClick(4,3).handled,false);assert.equal(e.sourceScene.actor.gridX,3);
 for(const id of ['flush','hatch','harpoon','close','thrust'])doCommand(e,id);assert.equal(e.battleResult,'victory');
});
test('Blast Pit: fuel/oxygen/power can be restored in another order',()=>{
 const e=make(SOURCE_SCENE_STAGES[2]);for(const id of ['power','fuel','oxygen','screen','ignite','exit'])doCommand(e,id);assert.equal(e.battleResult,'victory');
});
test('Blast Pit: diversion has finite stock, two turn endings, no invented bonus grenade',()=>{
 const e=make(SOURCE_SCENE_STAGES[2]);doCommand(e,'decoy');assert.equal(e.sourceScene.decoys,2);assert.equal(e.sourceScene.diversionTurns,1);
 e.skipActiveTurn();settle(e);assert.equal(e.sourceScene.diversionTurns,0);
 doCommand(e,'decoy');doCommand(e,'decoy');assert.equal(e.sourceScene.decoys,0);assert.equal(e.triggerSourceSceneAction('decoy',e.turnSerial),false);
});
test('Existing static stage inventory is retained, new scenes appended separately',()=>{
 const hub=readFileSync(new URL('../src/components/HubScreen.jsx',import.meta.url),'utf8');
 assert.equal(readStaticStages(hub).length,39);assert.equal((hub.match(/insertBeforeMetaStage\(SOURCE_SCENE_STAGES\)/g)||[]).length,1);
 assert.equal(new Set(SOURCE_SCENE_STAGES.map(s=>s.id)).size,6);
});
test('Legacy combat still spawns its original active opponents',()=>{
 const unit=HEROES_DB[0],enemy={name:'QA',hp:50,atk:1,spd:1};
 const e=new EngineTactics(960,600,[unit],{monsters:[enemy],bosses:[enemy]}, {add(){}},()=>{},()=>{}, {id:999,universe:'Nexus de Convergence',mode:'Tactics'});engines.push(e);
 assert.equal(e.sourceScene,null);assert.equal(e.enemies.length,5);assert.equal(e.selectAction('simple'),true);
});

test('Predator 1987: the Dutch finale uses the original Hunter, never a generic fight',()=>{
 const d=SOURCE_SCENE_STAGES.find(scene=>scene.id===50104);
 assert.ok(d);assert.equal(d.universe,'Predator');assert.equal(d.sceneLead.id,'dutch');
 assert.equal(d.threatName,'Jungle Hunter');assert.equal(d.material,'jungle');
 assert.equal(d.commands.length,9);assert.equal(d.commands.at(-1).id,'escape');
 const dutch=HEROES_DB.find(h=>h.id==='dutch'&&h.universe==='Predator');
 assert.ok(dutch);assert.match(d.incarnation,/1987/);assert.equal(d.visualReviewStatus,'pending');
 assert.ok(d.referenceUrls.every(url=>url.startsWith('https://')));
 const e=make(d);assert.equal(e.objective,'source_scene');assert.equal(e.enemies.length,0);
 if(e.sourceScene.threat)e.sourceScene.threat.currentHp=0;
 for(let n=0;n<120;n++)e.update();
 assert.equal(e.gameOver,false,'HP or an empty roster must not automatically win this scene');
});
test('Predator 1987: mud masks thermal search and the river removes concealment',()=>{
 const d=SOURCE_SCENE_STAGES.find(scene=>scene.id===50104),e=make(d);
 assert.ok(sceneApi.getSourceSceneDanger(e.sourceScene).length>0);
 doCommand(e,'mud');
 assert.equal(e.getSourceSceneState().thermalConcealment,true);
 assert.deepEqual(sceneApi.getSourceSceneDanger(e.sourceScene),[]);
 for(const id of ['bow','rig','lure','disrupt','wash'])doCommand(e,id);
 assert.equal(e.getSourceSceneState().thermalConcealment,false);
 assert.ok(sceneApi.getSourceSceneDanger(e.sourceScene).length>0);
 assert.equal(e.sourceScene.done.has('crush'),false);
});
test('Predator 1987: the log triggers an eight-turn self-destruct escape, not an HP victory',()=>{
 const d=SOURCE_SCENE_STAGES.find(scene=>scene.id===50104),e=make(d);
 for(const id of ['mud','bow','rig','lure','disrupt','wash','bait','crush'])doCommand(e,id);
 assert.equal(e.sourceScene.done.has('crush'),true);
 assert.deepEqual(sceneApi.getSourceSceneDanger(e.sourceScene),[]);
 assert.equal(e.getSourceSceneState().escapeTurnsRemaining,8);
 assert.equal(e.battleResult,null);
 for(let i=0;i<7&&!e.gameOver;i++){settle(e);e.skipActiveTurn();}
 assert.equal(e.battleResult,null);
 settle(e);e.skipActiveTurn();
 assert.equal(e.battleResult,'defeat');
 assert.equal(e.sourceScene.reason,'self_destruct');
 assert.equal(e.triggerSourceSceneAction('escape',e.turnSerial),false);
});
test('Predator 1987: reaching shelter wins while preserving the existing completion/reward gate',()=>{
 const d=SOURCE_SCENE_STAGES.find(scene=>scene.id===50104),e=make(d);
 for(const id of d.commands.map(c=>c.id))doCommand(e,id);
 assert.equal(e.battleResult,'victory');
 assert.equal(e.getCombatSummary().sourceEncounter.complete,true);
 assert.ok(e.getCombatSummary().sourceEncounter.escapeTurnsRemaining>0);
 for(let n=0;n<300;n++)e.update();
 assert.equal(e.testCallbacks.length,1);
});

test('Predator 1987: unmasked duel and secondary log trap keep the film beats distinct',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50104),e=make(d);
 assert.match(e.getSourceSceneState().sourceBeat.en,/Dutch/);
 for(const id of ['mud','bow','rig','lure','disrupt','wash'])doCommand(e,id);
 assert.match(e.getSourceSceneState().sourceBeat.en,/removes its mask and shoulder cannon/);
 doCommand(e,'bait');
 assert.match(e.getSourceSceneState().sourceBeat.en,/avoids the sharpened-stake trap/);
 assert.equal(e.getSourceSceneState().escapeTurnsRemaining,null);
 doCommand(e,'crush');
 assert.equal(e.getSourceSceneState().countdownLabel.en,'SELF-DESTRUCT');
});
test('Predator 2: exact 1990 source-locked ship, Harrigan and original City Hunter',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50105);
 assert.ok(d);assert.equal(d.material,'ship');assert.equal(d.universe,'Predator');
 assert.equal(d.sceneLead.id,'harrigan_predator');assert.equal(d.threatName,'City Hunter Predator');
 assert.equal(d.commands.length,9);assert.equal(d.commands.at(-1).id,'escape');
 assert.ok(d.referenceUrls.some(url=>url.includes('catalog.afi.com')));
 assert.match(d.incarnation,/Predator 2 \(1990\)/);
 const h=HEROES_DB.find(hero=>hero.id==='harrigan_predator'&&hero.universe==='Predator');
 assert.ok(h,'the global legacy Harrigan roster is retained');
 const e=make(d);
 assert.equal(e.heroes.length,1);assert.equal(e.heroes[0].id,h.id);
 assert.equal(e.enemies.length,0);
 assert.equal(e.sourceScene.threat?.name,'City Hunter Predator');
 e.sourceScene.threat.currentHp=0;
 for(let i=0;i<100;i++)e.update();
 assert.equal(e.gameOver,false,'raw boss HP depletion cannot bypass story');
 assert.equal(e.getSourceSceneState().honorTrophy,null);
});
test('Predator 2: net disables manual and AI movement until the recovered smart disc cuts it',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50105),e=make(d);
 for(const id of ['enter','trophies','net'])doCommand(e,id);
 settle(e);
 assert.equal(e.sourceScene.actor.gridX,3);
 assert.equal(e.sourceScene.actor.gridY,3);
 assert.match(e.getSourceSceneState().sourceBeat.en,/caught in the net/);
 assert.equal(e.handleCellClick(4,3).handled,false);
 assert.equal(e.sourceScene.actor.gridX,3);
 assert.equal(e.triggerSourceSceneAction('duel',e.turnSerial),false);
 doCommand(e,'cut_net');
 assert.notEqual(e.canOccupyCell(e.sourceScene.actor,4,3),false);
});
test('Predator 2: the Lost Tribe does not attack, and the honor pistol is narrative-only',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50105),e=make(d);
 for(const id of ['enter','trophies','net','cut_net','duel'])doCommand(e,id);
 assert.deepEqual(sceneApi.getSourceSceneDanger(e.sourceScene),[]);
 assert.match(e.getSourceSceneState().sourceBeat.en,/recover the body/);
 assert.equal(e.getSourceSceneState().honorTrophy,null);
 doCommand(e,'tribe');doCommand(e,'gift');
 assert.equal(e.getSourceSceneState().honorTrophy,'Raphael Adolini 1715');
 assert.equal(e.getCombatSummary().sourceEncounter.honorTrophy,null,
   'having received a clue is not proof of a completed escape');
});
test('Predator 2: ship launch, not wrist self-destruct, expires after 8 turn endings',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50105),e=make(d);
 for(const id of ['enter','trophies','net','cut_net','duel','tribe','gift','ignite'])doCommand(e,id);
 assert.equal(e.getSourceSceneState().escapeTurnsRemaining,8);
 assert.equal(e.getSourceSceneState().countdownLabel.en,'SHIP LAUNCH');
 assert.match(e.getSourceSceneState().sourceBeat.en,/already disabled/);
 assert.ok(sceneApi.getSourceSceneDanger(e.sourceScene).length>0);
 for(let i=0;i<7&&!e.gameOver;i++){settle(e);e.skipActiveTurn();}
 assert.equal(e.battleResult,null);
 settle(e);e.skipActiveTurn();
 assert.equal(e.battleResult,'defeat');
 assert.equal(e.sourceScene.reason,'ship_takeoff_blast');
 assert.equal(e.getCombatSummary().sourceEncounter.honorTrophy,null);
 assert.equal(e.triggerSourceSceneAction('escape',e.turnSerial),false);
});
test('Predator 2: correct manual extraction grants one victory and records the 1715 gift',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50105),e=make(d);
 for(const c of d.commands)doCommand(e,c.id);
 assert.equal(e.battleResult,'victory');
 const summary=e.getCombatSummary().sourceEncounter;
 assert.equal(summary.honorTrophy,'Raphael Adolini 1715');
 assert.equal(summary.artApproved,false);
 assert.equal(summary.commands.at(-1).command,'escape');
 assert.ok(summary.escapeTurnsRemaining>0);
 for(let i=0;i<300;i++)e.update();
 assert.equal(e.testCallbacks.length,1,'one completion callback, no double rewards');
});

test('Prey 2022: Naru and Feral are exact 1719 roles, never silver Jungle Hunter or City Hunter',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50106);
 assert.ok(d);assert.equal(d.material,'prey');assert.equal(d.universe,'Prey');
 assert.equal(d.sceneLead.id,'naru_prey');assert.equal(d.threatName,'Feral Predator');
 assert.match(d.incarnation,/2022/);assert.match(d.incarnation,/1719/);
 assert.match(d.visualAnchor,/bone\/skull biomask/);
 assert.match(d.visualAnchor,/no flying plasma cannon/i);
 assert.equal(d.commands.length,9);
 const naru=HEROES_DB.find(hero=>hero.id==='naru_prey'&&hero.universe==='Prey');
 assert.ok(naru,'Naru exists in current authoritative hero roster');
 const e=make(d);
 assert.equal(e.heroes.length,1);assert.equal(e.heroes[0].id,'naru_prey');
 assert.equal(e.sourceScene.threat?.name,'Feral Predator');
 assert.equal(e.enemies.length,0);
 const expectedSrc='/sprites/generated/bosses/predator/feral-predator.png';
 assert.equal(spriteApi.getEnemySpriteSheetSrc(e.sourceScene.threat),expectedSrc);
 const layout=spriteApi.getSpriteSheetLayout(expectedSrc);
 assert.equal(layout.columns,1);
 assert.equal(layout.rows,1);
 assert.equal(spriteApi.getSpriteFrameForLayout('hit',999,layout).col,0);
 assert.equal(spriteApi.getSpriteFrameForLayout('run',999,layout).row,0);
 assert.equal(e.getSourceSceneState().maskAimTarget,null);
 if(e.sourceScene.threat)e.sourceScene.threat.currentHp=0;
 for(let n=0;n<120;n++)e.update();
 assert.equal(e.gameOver,false,'Feral HP and the empty generic roster never resolve a source duel');
});
test('Prey 2022: herb blocks thermal pressure but a flintlock shot can still attract pursuit',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50106),e=make(d);
 assert.ok(sceneApi.getSourceSceneDanger(e.sourceScene).length);
 doCommand(e,'herb');
 assert.equal(e.getSourceSceneState().thermalConcealment,true);
 assert.deepEqual(sceneApi.getSourceSceneDanger(e.sourceScene),[]);
 assert.match(e.getSourceSceneState().sourceBeat.en,/lowers Naru/);
 doCommand(e,'bait');
 assert.equal(e.getSourceSceneState().thermalConcealment,true);
 doCommand(e,'flintlock');
 assert.equal(e.getSourceSceneState().thermalConcealment,true,'flintlock noise does not cancel medicinal effect');
 assert.ok(sceneApi.getSourceSceneDanger(e.sourceScene).length,'audible shot attracts hunter despite low heat');
 assert.match(e.getSourceSceneState().sourceBeat.en,/not noise or direct sight/);
});
test('Prey 2022: the bone targeting mask requires authentic line-up above the bog',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50106),e=make(d);
 assert.equal(e.triggerSourceSceneAction('redirect',e.turnSerial),false);
 for(const id of ['herb','bait','flintlock','take_mask','set_mask'])doCommand(e,id);
 assert.deepEqual(e.getSourceSceneState().maskAimTarget,{x:6,y:4});
 assert.match(e.getSourceSceneState().sourceBeat.en,/mask itself does not fire/);
 assert.equal(e.triggerSourceSceneAction('redirect',e.turnSerial),false,'target not yet trapped');
 doCommand(e,'bog');
 walkTo(e,{x:5,y:4});settle(e);
 const token=e.turnSerial;
 e.sourceScene.maskAimTarget={x:5,y:4};
 assert.equal(e.triggerSourceSceneAction('redirect',token),false,'wrong guide target cannot kill Feral');
 assert.equal(e.getSourceSceneState().commands.find(c=>c.id==='redirect').reason,'alignment');
 assert.equal(e.sourceScene.done.has('redirect'),false);
 e.sourceScene.maskAimTarget={x:6,y:4};
 assert.equal(e.triggerSourceSceneAction('redirect',token),true,'correct mask target redirects Feral projectile');
 settle(e);assert.deepEqual(sceneApi.getSourceSceneDanger(e.sourceScene),[]);
 assert.equal(e.getSourceSceneState().thermalConcealment,false,'after final shot no active hunt');
});
test('Prey 2022: a trophy alone is not a reward and returning to the village wins exactly once',()=>{
 const d=SOURCE_SCENE_STAGES.find(stage=>stage.id===50106),e=make(d);
 for(const id of ['herb','bait','flintlock','take_mask','set_mask','bog','redirect','trophy'])doCommand(e,id);
 assert.equal(e.getSourceSceneState().narrativeProof,'Feral Predator head');
 assert.equal(e.getCombatSummary().sourceEncounter.narrativeProof,null,'unfinished village return cannot grant epilogue proof');
 assert.equal(e.battleResult,null);
 doCommand(e,'return');
 assert.equal(e.battleResult,'victory');
 const summary=e.getCombatSummary().sourceEncounter;
 assert.equal(summary.narrativeProof,'Feral Predator head');
 assert.equal(summary.artApproved,false);
 assert.equal(summary.maskAimTarget.x,6);
 assert.equal(summary.commands.at(-1).command,'return');
 for(let n=0;n<300;n++)e.update();
 assert.equal(e.testCallbacks.length,1,'no duplicate reward on repeated updates');
});
test('Cross-film Adolini 1715: 1719 origin and 1990 gift are not invented as a save-item transfer',()=>{
 const a=SOURCE_SCENE_STAGES.find(stage=>stage.id===50105);
 const b=SOURCE_SCENE_STAGES.find(stage=>stage.id===50106);
 assert.match(a.briefing.en.objective,/Adolini 1715/);
 assert.match(b.briefing.en.objective,/Raphael/);
 assert.equal(a.material,'ship');assert.equal(b.material,'prey');
 assert.notEqual(a.sceneLead.id,b.sceneLead.id);
 const e=make(b);
 assert.equal(e.getSourceSceneState().honorTrophy,null);
 assert.equal(e.getSourceSceneState().narrativeProof,null);
 assert.equal(e.getCombatSummary().sourceEncounter.narrativeProof,null);
});
