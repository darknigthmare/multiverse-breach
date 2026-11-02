// Test-only entry: real GameCanvas, handlers and rendering; synthetic battle states.
// Not imported by the application, and no production debug interface is added.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineTactics } from '../../src/game/engineTactics.js';
import '../../src/index.css';
import './combatHarness.css';

const audit = { engine: null, results: [], updates: 0 };
window.__tacticsAudit = audit;
const original = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) {
  audit.engine = this; audit.updates++;
  return original.apply(this, args);
};
const team = ['player_anchor', 'arca_mirelle', 'arca_bastion'];
const enemy = { name: 'QA target', id: 'qa-target', hp: 500, atk: 5, def: 0, spd: 1, color: '#888888', universe: 'Nexus de Convergence' };
const stage = { id: 'qa-tactics-lifecycle', name: 'Tactics synthetic fixture', universe: 'Nexus de Convergence', mode: 'Tactics',
  disableItems: true, disableHazards: true,
  customBattle: { singleRoster: true, opponentControl: 'p2', enemyData: { customRoster: [enemy, { ...enemy, id: 'qa-two', name: 'QA other target' }], monsters: [enemy], bosses: [], worldBoss: null } } };

// Battle-state setup only. Actual decisions are made through production buttons.
audit.prepare = kind => {
  const e = audit.engine;
  e.timers.clear(); e.turnSerial++; e.interruptedTurn = null;
  e.obstacles = []; e.tiles = []; e.protectedArtifact = null; e.escortUnit = null;
  e.objective = 'rout'; e.missionProfile = { ...e.missionProfile, reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
  e.heroes.forEach((h, i) => Object.assign(h, { gridX: 1, gridY: i + 1, maxHp: 200, currentHp: 200,
    state: 'idle', stateTimer: 0, cooldown: 0, specialCharge: 100, statusEffects: { infected: 0, glitched: 0, radiated: 0 } }));
  e.enemies.forEach((u, i) => Object.assign(u, { gridX: 5, gridY: i + 1, currentHp: u.maxHp, state: 'idle', stateTimer: 0 }));
  const h = e.heroes[1], patient = e.heroes[0];
  h.stats = { ...h.stats, atk: 20 };
  h.secondary = { name: 'QA Heal', type: 'heal', dmg: 2, cd: 3 };
  e.activeUnit = h; e.activeUnitType = 'hero'; e.actionPhase = 'move'; e.selectedAction = null;
  e.turnQueue = e.enemies.map(unit => ({ type: 'enemy', unit })); e.autoBattle = false;
  e.movementBudget = 2; e.movementSpent = 0; e.calculateMovementRange();
  patient.currentHp = 90; patient.statusEffects.radiated = 10000;
  if (kind === 'cleanse') {
    h.secondary = { name: 'QA Cleanse', type: 'heal', dmg: 2, cd: 3, cleanses: ['infected'] };
    patient.currentHp = 100; patient.statusEffects.infected = 10000;
  } else if (kind === 'revive' || kind === 'occupied') {
    h.secondary = { name: 'QA Revive', type: 'revive', reviveRatio: 0.3, cd: 3 };
    patient.currentHp = 0; patient.state = 'dead'; patient.stateTimer = 999;
    if (kind === 'occupied') Object.assign(e.heroes[2], { gridX: patient.gridX, gridY: patient.gridY });
  } else if (kind === 'hazard') {
    e.hazardsDisabled = false;
    h.currentHp = 5;
    e.tiles = [{ x: 2, y: 2, type: 'hazard' }]; e.calculateMovementRange();
  }
  e.syncActorsToCamera();
  return { turns: e.turnsElapsed, patient: patient.currentHp, enemies: e.enemies.map(u => u.currentHp) };
};
export function Harness() {
  const [paused, setPaused] = useState(false);
  const [mounted, setMounted] = useState(true);
  const lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'fr';
  return <>
    <header className="combat-qa-toolbar" style={{ padding: 12 }}>
      <span>QA: synthetic Tactics setup, production controls and renderer. </span>
      <button id="qa-pause" type="button" onClick={() => setPaused(value => !value)}>QA pause</button>
      <button id="qa-unmount" type="button" onClick={() => setMounted(false)}>QA unmount</button>
    </header>
    {mounted && <GameCanvas lang={lang} playerProfile={{ name: 'QA Anchor' }} activeTeam={team} stage={stage}
      heroLevels={{}} equippedGear={{}} equippedEventItems={{}} heroTalents={{}} heroSkins={{}} completedStages={[]}
      sessionPaused={paused} onBattleEnd={(...result) => audit.results.push(result)} onSessionComplete={(...result) => audit.results.push(result)} />}
  </>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
