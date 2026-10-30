// Isolated QA only: source actors and real GameCanvas, native selection/turns.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineTactics } from '../../src/game/engineTactics.js';
import { HEROES_DB } from '../../src/game/heroes.js';
import '../../src/index.css';
import './combatHarness.css';
const query = new URLSearchParams(location.search);
const side = query.get('side') === 'enemy' ? 'enemy' : 'hero';
const lang = query.get('lang') === 'en' ? 'en' : 'fr';
const source = HEROES_DB.find(h => h.id === 'aerith_ff7');
if (!source) throw new Error('Aerith source fixture identity missing');
const sourceBefore = JSON.stringify(source);
const toEnemy = h => ({ ...structuredClone(h), hp: h.stats.hp, atk: h.stats.atk, def: h.stats.def, spd: h.stats.spd });
const foe = { id: 'qa-foe', name: 'QA foe', universe: 'QA', hp: 600, atk: 1, def: 0, spd: 1 };
const roster = side === 'enemy'
  ? [toEnemy(source), { ...foe, id: 'qa-patient', name: 'QA patient' }, { ...foe, id: 'qa-third', name: 'QA third' }]
  : [foe, { ...foe, id: 'qa-foe2', name: 'QA foe 2' }];
const team = side === 'hero' ? ['player_anchor', 'aerith_ff7', 'arca_bastion'] : ['player_anchor', 'arca_bastion'];
const stage = { id: 'qa-tactics-healing', name: 'Healing Wind tactical QA', universe: 'Final Fantasy VII', mode: 'Tactics',
  disableItems: true, disableHazards: true,
  customBattle: { singleRoster: true, opponentControl: 'p2', enemyData: { customRoster: roster, monsters: roster, bosses: [], worldBoss: null } } };
const audit = { engine: null, results: [], updates: 0, sourceBefore,
  storageBefore: JSON.stringify(Object.entries(localStorage)), side, kind: null };
window.__tacticsHealingAudit = audit;
const update = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) {
  audit.engine = this; audit.updates++; return update.apply(this, args);
};
const members = () => {
  const e = audit.engine, cell = side === 'hero' ? e.heroes : e.enemies;
  const caster = cell.find(u => (u.sourceId || u.id) === 'aerith_ff7');
  if (!caster || caster.special?.sourceSignatureKey !== 'aerith_ff7') throw new Error('Source healing not prepared by Tactics');
  return { caster, allies: [caster, ...cell.filter(u => u !== caster)], foes: side === 'hero' ? e.enemies : e.heroes };
};
audit.snapshot = () => {
  const e = audit.engine, { caster, allies, foes } = members();
  return { hp: allies.map(u => u.currentHp), enemyHP: foes.map(u => u.currentHp), charge: caster.specialCharge,
    turns: e.turnsElapsed, name: caster.special.name, identity: caster.sourceId || caster.id,
    paused: e.paused, disposed: e.disposed, resultCount: audit.results.length,
    storageIntact: JSON.stringify(Object.entries(localStorage)) === audit.storageBefore,
    sourceIntact: JSON.stringify(source) === sourceBefore };
};
audit.prepare = kind => {
  const e = audit.engine, { caster, allies, foes } = members();
  audit.kind = kind; e.timers.clear(); e.turnSerial++; e.interruptedTurn = null;
  e.obstacles = []; e.tiles = []; e.protectedArtifact = null; e.escortUnit = null; e.objective = 'rout';
  e.cols = 10; e.rows = 8; e.autoBattle = false;
  e.missionProfile = { ...e.missionProfile, reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
  allies.forEach((u, i) => Object.assign(u, { gridX: i + 1, gridY: 2, maxHp: 200, currentHp: 200,
    state: 'idle', stateTimer: 0, cooldown: 0, specialCharge: 100,
    statusEffects: { infected: 0, glitched: 0, radiated: 0 } }));
  foes.forEach((u, i) => Object.assign(u, { gridX: i + 1, gridY: 5, currentHp: u.maxHp, state: 'idle', stateTimer: 0 }));
  if (kind === 'wounded') { caster.currentHp = 180; allies[1].currentHp = 40; allies[2].currentHp = 10; }
  else if (kind === 'wall') {
    allies[1].gridX = 3; allies[2].gridX = 4; allies[1].currentHp = 40;
    e.obstacles = [{ type: 'barrier', gridX: 2, gridY: 2, hp: 100 }];
  } else if (kind === 'radiation') {
    allies[1].currentHp = 90; allies[1].statusEffects.radiated = 10000;
    allies[2].currentHp = 0; allies[2].state = 'dead';
  } else if (kind !== 'full') throw new Error(`Unknown preparation: ${kind}`);
  Object.assign(e, { activeUnit: caster, activeUnitType: side, actionPhase: 'move', selectedAction: null,
    selectedActionExplicit: false, movementBudget: 2, movementSpent: 0 });
  e.turnQueue = foes.map(unit => ({ type: side === 'hero' ? 'enemy' : 'hero', unit }));
  e.calculateMovementRange(); e.syncActorsToCamera();
  return audit.snapshot();
};
export function Harness() {
  const [paused, setPaused] = useState(false), [mounted, setMounted] = useState(true);
  return <><header className="combat-qa-toolbar" style={{ padding: 12 }}><span>Isolated tactical source healing QA. </span>
    <button id="qa-pause" onClick={() => setPaused(v => !v)}>QA pause</button>
    <button id="qa-unmount" onClick={() => setMounted(false)}>QA unmount</button></header>
    {mounted && <GameCanvas lang={lang} playerProfile={{ name: 'QA Anchor' }} activeTeam={team} stage={stage}
      heroLevels={{}} equippedGear={{}} equippedEventItems={{}} heroTalents={{}} heroSkins={{}} completedStages={[]}
      sessionPaused={paused} onBattleEnd={(...r) => audit.results.push(r)} onSessionComplete={(...r) => audit.results.push(r)} />}</>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
