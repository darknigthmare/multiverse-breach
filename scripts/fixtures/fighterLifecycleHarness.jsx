// Synthetic starting states, real FighterMode and EngineFighter.
// Not imported by production and never reads/writes an account or save.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import FighterMode from '../../src/components/FighterMode.jsx';
import { EngineFighter } from '../../src/game/engineFighter.js';
import { HEROES_DB } from '../../src/game/heroes.js';
import '../../src/index.css';
const q = new URLSearchParams(location.search);
const lang = q.get('lang') === 'en' ? 'en' : 'fr';
const heroIds = ['team_fortress_2_medic', 'cloud_ff7', 'barret_ff7'];
const heroes = heroIds.map(id => {
  const hero = HEROES_DB.find(actor => actor.id === id);
  if (!hero) throw new Error(`Unknown Fighter QA identity: ${id}`);
  return hero;
});
const config = { autoStart: true, opponentControl: 'p2', difficulty: 'training',
  playerTeamIds: heroIds.slice(0, 2), opponentTeamIds: [heroIds[0], heroIds[2]] };
const levels = {}, collection = {}, hidden = [], disabled = {}, team = heroIds.slice(0, 2);
const audit = { engine: null, engines: [], results: [], exits: [], injectedError: false };
window.__fighterLifecycle = audit;
const originalSetPaused = EngineFighter.prototype.setPaused;
EngineFighter.prototype.setPaused = function (...args) {
  if (!audit.engines.includes(this)) audit.engines.push(this);
  audit.engine = this;
  return originalSetPaused.apply(this, args);
};
audit.prepare = (side = 'player', overkill = false) => {
  const e = audit.engine;
  if (!e || e.disposed) throw new Error('Fighter fixture not ready');
  e.countdown = 0; e.hitStop = 0; e.medicSupport.dispose(); e.projectiles.length = 0;
  for (const camp of ['player', 'cpu']) {
    e.teams[camp].tagCooldown = 0;
    for (const a of e.teams[camp].fighters) Object.assign(a, {
      x: camp === 'player' ? 380 : 440, y: e.groundY, vx: 0, vy: 0, state: 'idle',
      action: null, meter: 100, currentHp: a.maxHp, hitstun: 0, guardBreak: 0,
      invulnerable: 0, guarding: false, crouching: false, comboStep: 0, comboWindow: 0
    });
  }
  if (overkill) {
    e.getActive(side).meter = 0;
    e.getOpponent(side).currentHp = 1;
  }
  return { source: e.getActive(side).sourceId || e.getActive(side).id,
    targetHp: e.getOpponent(side).currentHp, damage: e.stats[side].damage };
};
audit.snapshot = () => {
  const e = audit.engine;
  return { timer: e.timer, elapsed: e.elapsed, inputs: e.inputs,
    hp: ['player', 'cpu'].map(side => e.getActive(side).currentHp),
    meters: ['player', 'cpu'].map(side => e.getActive(side).meter), support: e.medicSupport.snapshot() };
};
audit.injectDrawFailure = () => {
  audit.injectedError = true;
  audit.engine.draw = () => { throw new Error('Deliberate Fighter renderer failure for QA'); };
};
export default function Harness() {
  const [paused, setPaused] = useState(false), [mounted, setMounted] = useState(true);
  return <><header><p>Isolated Fighter QA: prepared state, real controls, no campaign rewards.</p>
    <button id="qa-pause" onClick={() => setPaused(value => !value)}>QA pause</button>
    <button id="qa-unmount" onClick={() => setMounted(false)}>QA unmount</button>
  </header>{mounted && <FighterMode lang={lang} heroes={heroes} unlockedHeroes={heroIds}
    activeTeam={team} heroLevels={levels} portalCollection={collection} hiddenUniverses={hidden}
    disabledAssets={disabled} customConfig={config} sessionPaused={paused}
    onMatchComplete={report => audit.results.push(report)} onSessionEnd={result => audit.exits.push(result)} />}</>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
