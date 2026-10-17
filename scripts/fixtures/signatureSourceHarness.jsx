// QA only. This file is not imported by the production entry point.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../src/game/engineRpg.js';
import { EngineSmash } from '../../src/game/engineSmash.js';
import { SIGNATURE_SOURCE_KITS } from '../../src/game/signatureSourceKits.js';
import { ENEMIES_DB } from '../../src/game/enemies.js';
import '../../src/index.css';
const query = new URLSearchParams(location.search);
const mode = query.get('mode') === 'Smash' ? 'Smash' : 'RPG';
const lang = query.get('lang') === 'en' ? 'en' : 'fr';
const key = query.get('source') || 'cloud_ff7';
const definition = Object.hasOwn(SIGNATURE_SOURCE_KITS, key) ? SIGNATURE_SOURCE_KITS[key] : SIGNATURE_SOURCE_KITS.cloud_ff7;
const side = definition.enemyName ? 'enemy' : 'player';
const actorId = definition.actorId || 'cloud_ff7';
const universe = definition.universe;
const pool = ENEMIES_DB[universe];
const rawFoe = definition.enemyName
  ? [...pool.monsters, ...pool.bosses, pool.worldBoss].filter(Boolean).find(actor => actor.name === definition.enemyName) : null;
const foe = rawFoe ? { ...rawFoe, universe, isBoss: pool.bosses.includes(rawFoe) || rawFoe === pool.worldBoss }
  : { id: 'source-qa-target', name: 'QA target', universe, hp: 20000, atk: 1, spd: 1, color: '#888888' };
const audit = { engine: null, side, definition, results: [] };window.__sourceAudit = audit;
const prototype = mode === 'Smash' ? EngineSmash.prototype : EngineRpg.prototype;
const originalUpdate = prototype.update;
prototype.update = function (...args) { audit.engine = this;return originalUpdate.apply(this, args); };
const stage = { id: 'qa-source-signatures', name: 'Synthetic source signature QA', universe, mode,
  disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2', enemyData: { customRoster: [foe], monsters: [foe], bosses: [], worldBoss: null } } };
export default function Harness() {
  const [mounted, setMounted] = useState(true);
  return <><header><p>QA synthetic start; real GameCanvas, combat, targeting and controls.</p>
    <button id="qa-unmount" onClick={() => setMounted(false)}>QA unmount</button></header>
    {mounted && <GameCanvas lang={lang} playerProfile={{ name: 'QA' }} activeTeam={[actorId]} stage={stage}
      heroLevels={{}} equippedGear={{}} equippedEventItems={{}} heroTalents={{}} heroSkins={{}} completedStages={[]}
      onBattleEnd={(...args) => audit.results.push(args)} />}</>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
