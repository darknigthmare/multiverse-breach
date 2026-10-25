// QA-only: exact hero identity, prepared starting state, real FighterMode and controls.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import FighterMode from '../../src/components/FighterMode.jsx';
import { EngineFighter } from '../../src/game/engineFighter.js';
import { HEROES_DB } from '../../src/game/heroes.js';
import { getFighterRangedDefinition } from '../../src/game/fighterRangedSignatures.js';
import '../../src/index.css';
import './combatHarness.css';
const q = new URLSearchParams(location.search);
const lang = q.get('lang') === 'en' ? 'en' : 'fr';
const id = q.get('actor') || 'barret_ff7';
const source = HEROES_DB.find(a => a.id === id);
if (!source || !getFighterRangedDefinition(source)) throw Error(`Unsupported direct-fire fixture: ${id}`);
const reserve = HEROES_DB.find(a => a.id === 'tifa_ff7');
const heroes = [source, reserve], ids = [source.id, reserve.id];
const config = { autoStart: true, opponentControl: 'p2', difficulty: 'standard', playerTeamIds: ids, opponentTeamIds: ids };
const levels = {}, collection = {}, hidden = [], disabled = {};
const audit = { engine: null, hits: [], results: [], exits: [] };
window.__fighterRanged = audit;
const setPaused = EngineFighter.prototype.setPaused;
EngineFighter.prototype.setPaused = function (...args) { audit.engine = this; return setPaused.apply(this, args); };
const applyHit = EngineFighter.prototype.applyHit;
EngineFighter.prototype.applyHit = function (a, b, action, ...args) {
  const damage = applyHit.call(this, a, b, action, ...args);
  if (action?.meleeSignature?.delivery === 'ranged' && action?.meleeContact && damage > 0) audit.hits.push({
    side: a.side, index: action.meleeContact.index, total: action.meleeContact.total, damage, elapsed: this.elapsed
  });
  return damage;
};
audit.prepare = (side, distance = 'near') => {
  const e = audit.engine;
  if (!e || e.disposed || !e.paused) throw Error('Prepare only a paused QA session');
  e.countdown = 0; e.hitStop = 0; e.clearInputs(); audit.hits = [];
  for (const camp of ['player', 'cpu']) for (const a of e.getTeam(camp).fighters) Object.assign(a, {
    state: 'idle', action: null, meter: 100, hitstun: 0, guardBreak: 0, invulnerable: 0,
    guarding: false, crouching: false, vx: 0, vy: 0, y: e.groundY, currentHp: a.maxHp,
    comboWindow: 0, comboStep: 0
  });
  const a = e.getActive(side), b = e.getOpponent(side), d = getFighterRangedDefinition(a);
  a.x = 350;
  b.x = a.x + (distance === 'far' ? d.range + 50 : distance === 'edge' ? d.range - 8 : Math.max(60, (d.minRange || 0) + 10));
  b.currentHp = b.maxHp = 10000;
  return { id: a.sourceId || a.id, name: d.name, hits: d.hits, range: d.range, gap: d.hitGapTicks / 60,
    hp: b.currentHp, score: e.stats[side].damage, storage: JSON.stringify(Object.entries(localStorage)) };
};
export default function Harness() {
  const [paused, pause] = useState(true), [mounted, mount] = useState(true);
  return <><header className="combat-qa-toolbar"><p>Direct-fire QA — real controls, synthetic start, no campaign reward</p>
    <button id="qa-pause" onClick={() => pause(v => !v)}>QA pause</button>
    <button id="qa-unmount" onClick={() => mount(false)}>QA unmount</button>
  </header>{mounted && <FighterMode lang={lang} heroes={heroes} unlockedHeroes={ids} activeTeam={ids}
    heroLevels={levels} portalCollection={collection} hiddenUniverses={hidden} disabledAssets={disabled}
    customConfig={config} sessionPaused={paused} onMatchComplete={v => audit.results.push(v)}
    onSessionEnd={v => audit.exits.push(v)} />}</>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
