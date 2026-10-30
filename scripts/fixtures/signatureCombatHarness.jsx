// Isolated QA entry, never imported by the shipped application.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../src/game/engineRpg.js';
import { EngineSmash } from '../../src/game/engineSmash.js';
import '../../src/index.css';
import './combatHarness.css';
const q = new URLSearchParams(location.search);
const mode = q.get('mode') === 'Smash' ? 'Smash' : 'RPG';
const lang = q.get('lang') === 'en' ? 'en' : 'fr';
const actorId = mode === 'Smash' ? 'liquid_snake' : 'cloud_ff7';
const universe = mode === 'Smash' ? 'Metal Gear' : 'Final Fantasy VII';
const audit = { engine: null, results: [] }; window.__signatureAudit = audit;
const prototype = mode === 'Smash' ? EngineSmash.prototype : EngineRpg.prototype;
const update = prototype.update;
prototype.update = function (...args) { audit.engine = this; return update.apply(this, args); };
const foe = { id: 'signature-fixture-enemy', name: 'QA target', universe, hp: 5000, atk: 1, spd: 1, color: '#888888' };
const stage = { id: 'qa-signature', name: 'Synthetic signature fixture', universe, mode, disableHazards: true,
  customBattle: { singleRoster: true, opponentControl: 'p2', enemyData: { customRoster: [foe], monsters: [foe], bosses: [], worldBoss: null } } };
export function Harness() {
  const [mounted, setMounted] = useState(true);
  return <><header className="combat-qa-toolbar"><p>QA synthetic state; real GameCanvas, controls, renderer and engines.</p><button id="qa-unmount" onClick={() => setMounted(false)}>QA unmount</button></header>
    {mounted && <GameCanvas lang={lang} playerProfile={{ name: 'QA' }} activeTeam={[actorId]} stage={stage}
      heroLevels={{}} equippedGear={{}} equippedEventItems={mode === 'RPG' ? { cloud_ff7: 'evt_knights_of_the_round' } : {}}
      heroTalents={{}} heroSkins={{}} completedStages={[]} onBattleEnd={(...r) => audit.results.push(r)} />}</>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
