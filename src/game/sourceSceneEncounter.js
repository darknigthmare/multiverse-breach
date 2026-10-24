import { resolveSourceScene } from './sourceSceneStages.js';

/** Native-turn scene controller. No timers, storage, account access or catalog mutations. */
export function selectSourceSceneParticipants(stage, heroes) {
  const definition = resolveSourceScene(stage);
  if (!definition) return heroes;
  const matches = heroes.filter(h => h?.id === definition.sceneLead.id && h.universe === definition.sceneLead.universe);
  if (matches.length !== 1) throw new Error(`Source scene requires exactly one ${definition.sceneLead.id}; no substitute granted.`);
  return matches;
}
export function createSourceSceneEncounter(stage, heroes, enemiesData = {}) {
  const definition = resolveSourceScene(stage);
  if (!definition) return null;
  const actor = selectSourceSceneParticipants(stage, heroes)[0];
  const sourceThreat = [...(enemiesData.monsters || []), ...(enemiesData.bosses || []), enemiesData.worldBoss]
    .filter(Boolean).find(e => e.name === definition.threatName);
  return { definition, actor, actorId:actor.id, actorUniverse:actor.universe, actorLifetime:0,
    done:new Set(), turns:0, complete:false, failed:false, reason:'', decoys:3, diversionTurns:0,
    lastEndTurn:0, log:[], threat:sourceThreat ? {...sourceThreat,universe:sourceThreat.universe || definition.universe,state:'idle',stateTimer:0} : null };
}
const living = actor => !!actor && Number.isFinite(actor.currentHp) && actor.currentHp > 0 && actor.state !== 'dead';
export function validateSceneActor(engine) {
  const scene=engine.sourceScene;
  return !!scene && resolveSourceScene(engine.stage)===scene.definition && engine.heroes.length===1 && engine.heroes[0]===scene.actor
    && scene.actor.id===scene.actorId && scene.actor.universe===scene.actorUniverse
    && (engine.actorLifetimes.get(scene.actor)||0)===scene.actorLifetime && living(scene.actor);
}
export function getSourceSceneDanger(scene) {
  if (!scene || scene.complete || scene.failed) return [];
  const d=scene.definition, done=scene.done;
  if (d.material==='silo' && done.has('ignite')) return [];
  if (d.material==='hangar' && done.has('grapple')) return [];
  if (d.material==='shuttle' && done.has('harness')) return [];
  if (scene.diversionTurns > 0) return [{x:4,y:2},{x:4,y:3},{x:4,y:4}];
  return d.dangerPatterns[scene.turns % d.dangerPatterns.length].map(([x,y])=>({x,y}));
}
export function getSourceSceneCommandState(engine, id) {
  const scene=engine.sourceScene, command=scene?.definition.commands.find(c=>c.id===id);
  if (!scene || !command) return {enabled:false,reason:'unknown'};
  if (scene.complete || scene.failed || !validateSceneActor(engine) || !engine.canCommandActiveUnit()
    || engine.activeUnit !== scene.actor || engine.activeUnitType !== 'hero') return {enabled:false,reason:'inactive'};
  if (scene.done.has(id)) return {enabled:false,reason:'done'};
  if (command.repeatable && (scene.decoys<=0 || scene.done.has('ignite'))) return {enabled:false,reason:'empty'};
  if (!command.requires.every(r=>scene.done.has(r))) return {enabled:false,reason:'prerequisite'};
  if (!command.anywhere && (scene.actor.gridX!==command.cell.x || scene.actor.gridY!==command.cell.y)) return {enabled:false,reason:'position'};
  return {enabled:true,reason:''};
}
export function executeSourceSceneCommand(engine, id, token) {
  const scene=engine.sourceScene;
  if (!scene || !Number.isInteger(token) || token!==engine.turnSerial
    || !getSourceSceneCommandState(engine,id).enabled) return false;
  const command=scene.definition.commands.find(c=>c.id===id);
  if (command.repeatable) { scene.decoys--; scene.diversionTurns=2; }
  else scene.done.add(id);
  scene.log.push({command:id,turn:token,cell:{x:scene.actor.gridX,y:scene.actor.gridY}});
  if (command.final) scene.complete=true;
  engine.objectiveEvents++;
  engine.playSfx(command.final?'shield':'click');
  engine.endActiveTurn();
  return true;
}
export function advanceSourceScene(engine, advanceTurn=false) {
  const scene=engine.sourceScene;
  if (!scene || engine.disposed || engine.paused || engine.gameOver) return;
  if (!validateSceneActor(engine)) { scene.failed=true;scene.reason='protagonist_lost';engine.completeBattle('defeat');return; }
  engine.objectiveProgress=scene.done.size;
  if (scene.complete) {
    if (advanceTurn && scene.lastEndTurn !== engine.turnSerial) { scene.turns++; scene.lastEndTurn=engine.turnSerial; }
    engine.completeBattle('victory');return;
  }
  if (!advanceTurn || scene.lastEndTurn===engine.turnSerial) return;
  scene.lastEndTurn=engine.turnSerial;
  // Danger is announced during the player's turn and resolved only once at its end.
  const danger=getSourceSceneDanger(scene);
  if (danger.some(p=>p.x===scene.actor.gridX && p.y===scene.actor.gridY)) {
    const before=scene.actor.currentHp;
    const damage=Math.max(1,Math.round(scene.actor.maxHp*0.16));
    // Native guard, damage feedback and KO invalidation remain authoritative.
    engine.applyDamage({name:scene.definition.threatName,gridX:scene.definition.threatCell.x,
      gridY:scene.definition.threatCell.y,stats:{atk:1,def:0},simple:{dmg:1}},scene.actor,damage,null,{ignoreCover:true});
    if (scene.actor.currentHp<before) engine.hazardPulses++;
  }
  scene.turns++;
  scene.diversionTurns=Math.max(0,scene.diversionTurns-1);
  if (!validateSceneActor(engine)) { scene.failed=true;scene.reason='protagonist_lost';engine.completeBattle('defeat'); }
  else if (scene.turns>=scene.definition.turnLimit) { scene.failed=true;scene.reason='turn_limit';engine.completeBattle('defeat'); }
}
export function getSourceSceneState(engine) {
  const s=engine.sourceScene;
  if (!s) return null;
  const d=s.definition;
  return {id:d.sourceSceneId,name:{fr:d.nameFr,en:d.name},incarnation:d.incarnation,
    objective:d.briefing,turnToken:engine.turnSerial,turns:s.turns,turnLimit:d.turnLimit,
    complete:s.complete,failed:s.failed,reason:s.reason,progress:s.done.size,target:d.commands.filter(c=>!c.repeatable).length,
    decoys:s.decoys,danger:getSourceSceneDanger(s),artApproved:false,
    commands:d.commands.map(c=>({id:c.id,label:c.label,cell:c.cell,anywhere:!!c.anywhere,done:s.done.has(c.id),
      ...getSourceSceneCommandState(engine,c.id)}))};
}
export function getSourceSceneSummary(scene) {
  if (!scene) return null;
  return {kind:'source_scene',id:scene.definition.sourceSceneId,incarnation:scene.definition.incarnation,
    complete:scene.complete,failed:scene.failed,reason:scene.reason,turns:scene.turns,
    commands:scene.log.map(e=>({...e,cell:{...e.cell}})),decoysRemaining:scene.decoys,artApproved:false};
}
/** Find a true shortest path, not greedy Manhattan movement around the blocked silo. */
export function sourceSceneRoute(engine, target) {
  const actor=engine.sourceScene?.actor;
  if (!actor || !target) return [];
  const queue=[{x:actor.gridX,y:actor.gridY,cost:0,path:[]}],visited=new Set();
  while(queue.length) {
    queue.sort((a,b)=>a.cost-b.cost);
    const p=queue.shift(),key=`${p.x},${p.y}`;
    if(visited.has(key))continue;
    visited.add(key);
    if(p.x===target.x && p.y===target.y)return p.path;
    for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]) {
      const x=p.x+dx,y=p.y+dy;
      if(!engine.isInsideGrid(x,y)||!engine.canOccupyCell(actor,x,y)||visited.has(`${x},${y}`))continue;
      const cost=p.cost+engine.getTileMoveCost(x,y,actor);
      queue.push({x,y,cost,path:[...p.path,{x,y,cost}]});
    }
  }
  return [];
}
export function runSourceSceneAI(engine) {
  const s=engine.sourceScene;
  if (!s || !validateSceneActor(engine) || !engine.canCommandActiveUnit() || engine.activeUnit!==s.actor) return false;
  const pending=s.definition.commands.filter(c=>!c.repeatable&&!s.done.has(c.id)&&c.requires.every(r=>s.done.has(r)));
  const target=pending.map(c=>({command:c,path:sourceSceneRoute(engine,c.cell)}))
    .filter(p=>p.path.length || (p.command.cell.x===s.actor.gridX&&p.command.cell.y===s.actor.gridY))
    .sort((a,b)=>(a.path.at(-1)?.cost||0)-(b.path.at(-1)?.cost||0))[0];
  if(!target) {engine.endActiveTurn();return true;}
  if (engine.actionPhase==='action') engine.cancelSelectedAction();
  const available=Math.max(0,engine.movementBudget-engine.movementSpent);
  const move=target.path.filter(c=>c.cost<=available).at(-1);
  if(move) engine.handleCellClick(move.x,move.y);
  if (!executeSourceSceneCommand(engine,target.command.id,engine.turnSerial)) engine.endActiveTurn();
  return true;
}
