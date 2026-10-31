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
    escapeTurnsRemaining:null,maskAimTarget:null,
    lastEndTurn:0, log:[], threat:sourceThreat ? {...sourceThreat,
      universe:sourceThreat.universe || definition.universe,
      // Prey is a dedicated catalog universe but its existing Feral bitmap
      // resides in the Predator boss archive. Bind only this exact actor;
      // leave all legacy enemy templates and other film variants untouched.
      ...(definition.material==='prey' && !sourceThreat.spriteSource
        ? {spriteSource:'/sprites/generated/bosses/predator/feral-predator.png'} : {}),
      state:'idle',stateTimer:0} : null };
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
  // Cold mud masks the Hunter's thermal search until the river removes it.
  // After the log trap, the remaining threat is the wrist self-destruct clock.
  if (d.material==='jungle' && (done.has('crush') || (done.has('mud') && !done.has('wash')))) return [];
  // The cooling herb hides Naru from thermal targeting, not sound. Her
  // flintlock shot draws the Feral Predator's attention back to this area.
  if (d.material==='prey' && (done.has('redirect') || (done.has('herb') && !done.has('flintlock')))) return [];
  // The clan is non-hostile once its champion falls; subsequent threats come
  // from the spacecraft's engines, not invented enemy Predators.
  if (d.material==='ship' && done.has('duel') && !done.has('ignite')) return [];
  if (d.material==='ship' && done.has('ignite')) {
    const patterns=d.launchDangerPatterns || [];
    return (patterns[scene.turns % patterns.length] || []).map(([x,y])=>({x,y}));
  }
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
  if (scene.definition.material==='prey' && id==='redirect') {
    // Mask steering is meaningful: it must point along the bog column.
    // Naru cannot use a generic attack or tamper with the mask to skip this.
    const mask=scene.definition.field.props.find(p=>p.id==='mask_mount');
    const bog=scene.definition.field.props.find(p=>p.id==='bog');
    if (!mask || !bog || mask.x!==bog.x || mask.y>=bog.y
      || scene.maskAimTarget?.x!==bog.x || scene.maskAimTarget?.y!==bog.y) {
      return {enabled:false,reason:'alignment'};
    }
  }
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
  if (scene.definition.material==='jungle' && id==='crush') {
    // The triggering turn itself is counted below; display eight subsequent
    // turn endings to reach shelter, never grant a free post-expiry action.
    scene.escapeTurnsRemaining=scene.definition.selfDestructTurnLimit+1;
  }
  if (scene.definition.material==='prey' && id==='set_mask') {
    const mask=scene.definition.field.props.find(p=>p.id==='mask_mount');
    const bog=scene.definition.field.props.find(p=>p.id==='bog');
    scene.maskAimTarget=mask && bog && mask.x===bog.x && mask.y<bog.y
      ? {x:bog.x,y:bog.y} : null;
  }
  if (scene.definition.material==='ship' && id==='ignite') {
    // Unlike the 1987 wrist bomb, the 1990 rooftop bomb is already disabled.
    // This counter only represents the ship's lethal departure blast.
    scene.escapeTurnsRemaining=scene.definition.shipLaunchTurnLimit+1;
  }
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
    const damage=Math.max(1,Math.round(scene.actor.maxHp*(scene.definition.material==='jungle'?0.10:0.16)));
    // Native guard, damage feedback and KO invalidation remain authoritative.
    engine.applyDamage({name:scene.definition.threatName,gridX:scene.definition.threatCell.x,
      gridY:scene.definition.threatCell.y,stats:{atk:1,def:0},simple:{dmg:1}},scene.actor,damage,null,{ignoreCover:true});
    if (scene.actor.currentHp<before) engine.hazardPulses++;
  }
  scene.turns++;
  scene.diversionTurns=Math.max(0,scene.diversionTurns-1);
  if (scene.escapeTurnsRemaining!==null) {
    scene.escapeTurnsRemaining=Math.max(0,scene.escapeTurnsRemaining-1);
    if (scene.escapeTurnsRemaining===0) {
      scene.failed=true;
      scene.reason=scene.definition.material==='ship'?'ship_takeoff_blast':'self_destruct';
      engine.completeBattle('defeat');return;
    }
  }
  if (!validateSceneActor(engine)) { scene.failed=true;scene.reason='protagonist_lost';engine.completeBattle('defeat'); }
  else if (scene.turns>=scene.definition.turnLimit) { scene.failed=true;scene.reason='turn_limit';engine.completeBattle('defeat'); }
}
/** Player-visible source beats are assertions about the current story route, not art approvals. */
export function getSourceSceneBeat(scene) {
  if (!scene) return null;
  const d=scene.done, material=scene.definition.material;
  if (material==='jungle') {
    if (d.has('crush')) return {fr:'Le Jungle Hunter déclenche son autodestruction au poignet. Rejoignez l’abri.',en:'The Jungle Hunter arms its wrist self-destruct. Get to cover.'};
    if (d.has('bait')) return {fr:'Le chasseur contourne les pieux. Le contrepoids de secours reste votre seule chance.',en:'The hunter avoids the sharpened-stake trap. The backup log counterweight is your last chance.'};
    if (d.has('wash')) return {fr:'La rivière a effacé la boue. Le chasseur retire son masque et son canon d’épaule pour le duel au corps à corps.',en:'The river has washed off the mud. The hunter removes its mask and shoulder cannon for a hand-to-hand duel.'};
    if (d.has('mud')) return {fr:'La boue froide masque votre signature thermique jusqu’à la traversée de l’eau.',en:'Cold mud masks your thermal signature until you cross water.'};
    return {fr:'Dutch est seul dans la jungle face au chasseur de 1987.',en:'Dutch is alone in the jungle against the 1987 hunter.'};
  }
  if (material==='prey') {
    if (d.has('trophy')) return {
      fr:'Naru a récupéré la preuve du duel. Sarii est à l’abri au village ; ramenez-la à sa communauté.',
      en:'Naru has recovered proof of the hunt. Sarii is safely by the village; return to her community.'
    };
    if (d.has('redirect')) return {
      fr:'Le projectile guidé du Feral Predator a suivi le masque et frappé sa propre tête. Aucune arme à plasma.',
      en:'The Feral Predator’s guided bolt followed the mask and struck its own head. No plasma cannon.'
    };
    if (d.has('bog')) return {
      fr:'Le chasseur est prisonnier du marécage ; ses projectiles suivront le masque placé face à lui.',
      en:'The hunter is mired in the bog; its projectile will follow the mask aimed toward it.'
    };
    if (d.has('set_mask')) return {
      fr:'Le masque osseux est orienté vers le marécage, sans tirer lui-même de projectile.',
      en:'The bone mask is aimed at the bog; the mask itself does not fire a projectile.'
    };
    if (d.has('flintlock')) return {
      fr:'Le pistolet a alerté le chasseur. La plante réduit encore la chaleur visible, pas le son ni la vue directe.',
      en:'The flintlock has alerted the hunter. The herb still lowers visible heat, not noise or direct sight.'
    };
    if (d.has('herb')) return {
      fr:'La plante médicinale diminue la signature thermique de Naru. Préparez l’embuscade.',
      en:'The medicinal herb lowers Naru’s heat signature. Prepare the ambush.'
    };
    return {
      fr:'Naru, seule après la mort de Taabe, doit vaincre le Feral Predator de 1719 par son propre ciblage.',
      en:'Naru, alone after Taabe’s death, must defeat the 1719 Feral Predator through its own targeting system.'
    };
  }
  if (material==='ship') {
    if (d.has('ignite')) return {fr:'Les moteurs du vaisseau s’allument. Le dispositif d’autodestruction du toit avait déjà été neutralisé : fuyez le souffle du décollage.',en:'The ship engines ignite. The rooftop wrist bomb was already disabled: flee the take-off blast.'};
    if (d.has('gift')) return {fr:'L’Ancien remet le pistolet « Raphael Adolini 1715 » comme trophée d’honneur, sans rejoindre le combat.',en:'The elder hands over the “Raphael Adolini 1715” flintlock as an honor trophy, without entering combat.'};
    if (d.has('duel')) return {fr:'Le City Hunter est vaincu par son propre disque. Le clan arrive pour reprendre le corps, sans nouvelle bataille.',en:'City Hunter is defeated by its own disc. The clan arrives to recover the body, not to start another fight.'};
    if (d.has('net')) return {fr:'Le filet retient Harrigan : coupez-le avec le disque intelligent récupéré sur le toit.',en:'Harrigan is caught in the net: cut free with the smart disc recovered on the rooftop.'};
    return {fr:'Le vaisseau caché sous Los Angeles abrite les trophées du clan. Le City Hunter n’a pas encore été vaincu.',en:'The ship hidden beneath Los Angeles houses the tribe’s trophies. The City Hunter is still alive.'};
  }
  return null;
}

export function getSourceSceneState(engine) {
  const s=engine.sourceScene;
  if (!s) return null;
  const d=s.definition;
  return {id:d.sourceSceneId,name:{fr:d.nameFr,en:d.name},incarnation:d.incarnation,
    objective:d.briefing,turnToken:engine.turnSerial,turns:s.turns,turnLimit:d.turnLimit,
    complete:s.complete,failed:s.failed,reason:s.reason,progress:s.done.size,target:d.commands.filter(c=>!c.repeatable).length,
    decoys:s.decoys,escapeTurnsRemaining:s.escapeTurnsRemaining,
    countdownLabel:d.material==='ship'
      ? {fr:'DÉCOLLAGE',en:'SHIP LAUNCH'} : {fr:'AUTODESTRUCTION',en:'SELF-DESTRUCT'},
    sourceBeat:getSourceSceneBeat(s),
    honorTrophy:d.material==='ship'&&s.done.has('gift')?'Raphael Adolini 1715':null,
    narrativeProof:d.material==='prey'&&s.done.has('trophy')?'Feral Predator head':null,
    maskAimTarget:d.material==='prey'&&s.maskAimTarget?{...s.maskAimTarget}:null,
    thermalConcealment:(d.material==='jungle'&&s.done.has('mud')&&!s.done.has('wash'))
      ||(d.material==='prey'&&s.done.has('herb')&&!s.done.has('redirect')),
    danger:getSourceSceneDanger(s),artApproved:false,
    commands:d.commands.map(c=>({id:c.id,label:c.label,cell:c.cell,anywhere:!!c.anywhere,done:s.done.has(c.id),
      ...getSourceSceneCommandState(engine,c.id)}))};
}
export function getSourceSceneSummary(scene) {
  if (!scene) return null;
  return {kind:'source_scene',id:scene.definition.sourceSceneId,incarnation:scene.definition.incarnation,
    complete:scene.complete,failed:scene.failed,reason:scene.reason,turns:scene.turns,
    commands:scene.log.map(e=>({...e,cell:{...e.cell}})),decoysRemaining:scene.decoys,
    escapeTurnsRemaining:scene.escapeTurnsRemaining,
    honorTrophy:scene.complete&&scene.definition.material==='ship'&&scene.done.has('gift')
      ? 'Raphael Adolini 1715':null,
    narrativeProof:scene.complete&&scene.definition.material==='prey'&&scene.done.has('trophy')
      ? 'Feral Predator head':null,
    maskAimTarget:scene.definition.material==='prey'&&scene.maskAimTarget?{...scene.maskAimTarget}:null,
    artApproved:false};
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
