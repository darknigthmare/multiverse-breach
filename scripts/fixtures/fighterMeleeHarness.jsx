// QA-only: prepared initial states, real FighterMode, controls and damage.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import FighterMode from '../../src/components/FighterMode.jsx';
import { EngineFighter } from '../../src/game/engineFighter.js';
import { HEROES_DB } from '../../src/game/heroes.js';
import { getFighterMeleeDefinition } from '../../src/game/fighterMeleeSignatures.js';
import '../../src/index.css';
const q = new URLSearchParams(location.search);
const lang = q.get('lang') === 'en' ? 'en' : 'fr';
const actorId = q.get('actor') || 'cloud_ff7';
const source = HEROES_DB.find(a => a.id === actorId);
if (!source || !getFighterMeleeDefinition(source)) throw Error(`Unsupported melee fixture identity: ${actorId}`);
const reserve = HEROES_DB.find(a => a.id === 'barret_ff7');
const heroes = [source, reserve], ids = [source.id, reserve.id];
const config = { autoStart: true, opponentControl: 'p2', difficulty: 'standard', playerTeamIds: ids, opponentTeamIds: ids };
const levels = {}, collection = {}, hidden = [], disabled = {};
const audit = { engine: null, hits: [], results: [], exits: [] };
window.__fighterMelee = audit;
const setPaused = EngineFighter.prototype.setPaused;
EngineFighter.prototype.setPaused = function (...args) { audit.engine = this; return setPaused.apply(this, args); };
const applyHit = EngineFighter.prototype.applyHit;
EngineFighter.prototype.applyHit = function (a, b, action, ...args) {
  const damage = applyHit.call(this, a, b, action, ...args);
  if (action?.meleeContact && damage > 0) audit.hits.push({ side: a.side, index: action.meleeContact.index,
    total: action.meleeContact.total, damage, elapsed: this.elapsed });
  return damage;
};
audit.prepare = (side, far = false) => {
  const e = audit.engine;
  if (!e || e.disposed || !e.paused) throw Error('Prepare only an explicitly paused QA session');
  e.countdown = 0; e.hitStop = 0; e.clearInputs(); audit.hits = [];
  for (const camp of ['player', 'cpu']) for (const a of e.getTeam(camp).fighters) Object.assign(a, {
    state: 'idle', action: null, meter: 100, hitstun: 0, guardBreak: 0, invulnerable: 0,
    guarding: false, crouching: false, vx: 0, vy: 0, y: e.groundY, currentHp: a.maxHp,
    comboWindow: 0, comboStep: 0
  });
  const a = e.getActive(side), b = e.getOpponent(side), d = getFighterMeleeDefinition(a);
  a.x = 350; b.x = far ? 800 : 410; b.currentHp = b.maxHp = 10000;
  return { id: a.sourceId || a.id, name: d.name, hits: d.hits, gap: d.hitGapTicks / 60,
    hp: b.currentHp, score: e.stats[side].damage, storage: JSON.stringify(Object.entries(localStorage)) };
};
export default function Harness() {
  const [paused, setPausedState] = useState(true), [mounted, setMounted] = useState(true);
  return <><header><p>Isolated contact-super QA — real controls, no campaign rewards</p>
    <button id="qa-pause" onClick={() => setPausedState(value => !value)}>QA pause</button>
    <button id="qa-unmount" onClick={() => setMounted(false)}>QA unmount</button>
  </header>{mounted && <FighterMode lang={lang} heroes={heroes} unlockedHeroes={ids} activeTeam={ids}
    heroLevels={levels} portalCollection={collection} hiddenUniverses={hidden} disabledAssets={disabled}
    customConfig={config} sessionPaused={paused} onMatchComplete={value => audit.results.push(value)}
    onSessionEnd={value => audit.exits.push(value)} />}</>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
