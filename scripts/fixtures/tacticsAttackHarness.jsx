// Isolated native AI regression fixture; never imported by the production app.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineTactics } from '../../src/game/engineTactics.js';
import '../../src/index.css';
const query = new URLSearchParams(location.search);
const side = query.get('side') === 'enemy' ? 'enemy' : 'hero';
const lang = query.get('lang') === 'en' ? 'en' : 'fr';
const roster = ['qa-target', 'qa-reserve', 'qa-third'].map(id => ({ id, name: id, universe: 'QA', hp: 400, atk: 40, def: 0, spd: 1, weapon: 'gun' }));
const stage = { id: 'qa-tactics-attack', name: 'Deferred tactical attack QA', universe: 'Nexus de Convergence', mode: 'Tactics',
  disableItems: true, disableHazards: true,
  customBattle: { singleRoster: true, opponentControl: 'p2', enemyData: { customRoster: roster, monsters: roster, bosses: [], worldBoss: null } } };
// Keep roster identity stable when the harness toggles pause.
const team = ['player_anchor', 'arca_bastion', 'cloud_ff7'];
const audit = { engine: null, results: [], storage: JSON.stringify(Object.entries(localStorage)), caster: null, target: null };
window.__tacticsAttackAudit = audit;
const update = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) { audit.engine = this; return update.apply(this, args); };
audit.snapshot = () => ({ hp: audit.target?.currentHp, turns: audit.engine?.turnsElapsed,
  meter: audit.caster?.specialCharge, pending: audit.engine ? [...audit.engine.timers].map(t => t.ticks) : [],
  paused: audit.engine?.paused, disposed: audit.engine?.disposed, resultCount: audit.results.length,
  storageIntact: JSON.stringify(Object.entries(localStorage)) === audit.storage });
audit.prepare = kind => {
  const e = audit.engine;
  if (!e || e.disposed || !e.paused) throw new Error('Fixture preparation requires the mounted, paused engine');
  e.timers.clear(); e.turnSerial++; e.interruptedTurn = null;
  e.tiles = []; e.obstacles = []; e.escortUnit = null; e.protectedArtifact = null; e.objective = 'rout';
  e.cols = 10; e.rows = 8; e.autoBattle = false;
  e.missionProfile = { ...e.missionProfile, reinforcementEvery: 0, hazardPulseEvery: 0, pressure: 0 };
  for (const [team, x] of [[e.heroes, 1], [e.enemies, 3]]) team.forEach((u, i) => Object.assign(u, {
    gridX: x, gridY: 1 + i * 2, currentHp: 400, maxHp: 400, state: 'idle', stateTimer: 0,
    stats: { hp: 400, atk: 40, def: 0, spd: 1 }, atk: 40, def: 0, weapon: 'gun', weaponType: 'gun',
    simple: { name: 'QA shot', type: 'bullet', dmg: 1, tacticsProfile: { shape: 'single', range: 6 } },
    secondary: { name: 'QA secondary', type: 'bullet', dmg: 2, cd: 3 },
    special: { name: 'QA limit', type: 'bullet', dmg: 3 },
    cooldown: 100, specialCharge: 0, statusEffects: { infected: 0, radiated: 0, glitched: 0 }
  }));
  const allies = side === 'hero' ? e.heroes : e.enemies, foes = side === 'hero' ? e.enemies : e.heroes;
  const caster = allies[0], target = foes[0]; audit.caster = caster; audit.target = target;
  Object.assign(e, { activeUnit: caster, activeUnitType: side, actionPhase: 'move', selectedAction: null,
    selectedActionExplicit: false, movementBudget: 0, movementSpent: 0, turnQueue: [] });
  e.syncActorsToCamera(); e.setPaused(false);
  if (side === 'hero') e.runHeroAI(); else e.runEnemyAI();
  if (!e.timers.size || e.actionPhase !== 'resolving') throw new Error('Native AI did not schedule an attack');
  if (kind === 'revived') {
    e.applyDamage(allies[1], target, 100000);
    if (target.currentHp !== 0) throw new Error('Native damage did not kill target');
    Object.assign(target, { currentHp: 250, state: 'idle', stateTimer: 0 });
  } else if (kind === 'skill') caster.simple = { ...caster.simple, dmg: 5 };
  else if (kind === 'blocked') e.obstacles.push({ type: 'barrier', gridX: 2, gridY: 1, hp: 300 });
  else if (kind !== 'valid') throw new Error(`Unknown fixture: ${kind}`);
  e.setPaused(true);
  return audit.snapshot();
};
export function Harness() {
  const [paused, setPaused] = useState(false), [mounted, setMounted] = useState(true);
  return <><header style={{ padding: 12 }}><span>Prepared QA state — native tactical AI. </span>
    <button id="qa-pause" onClick={() => setPaused(v => !v)}>{paused ? 'Resume QA' : 'Pause QA'}</button>
    <button id="qa-unmount" onClick={() => setMounted(false)}>Unmount QA</button></header>
    {mounted && <GameCanvas lang={lang} playerProfile={{ name: 'QA' }} activeTeam={team}
      stage={stage} heroLevels={{}} equippedGear={{}} equippedEventItems={{}} heroTalents={{}} heroSkins={{}} completedStages={[]}
      sessionPaused={paused} onBattleEnd={(...r) => audit.results.push(r)} onSessionComplete={(...r) => audit.results.push(r)} />}</>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
