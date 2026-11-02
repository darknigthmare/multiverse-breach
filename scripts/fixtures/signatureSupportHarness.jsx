// Isolated fixture; never imported by the production application.
import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../src/game/engineRpg.js';
import { EngineSmash } from '../../src/game/engineSmash.js';
import { SIGNATURE_SOURCE_KITS } from '../../src/game/signatureSourceKits.js';
import { ENEMIES_DB } from '../../src/game/enemies.js';
import { HEROES_DB } from '../../src/game/heroes.js';
import '../../src/index.css';
import './combatHarness.css';
const query = new URLSearchParams(location.search);
const key = query.get('source') || 'team_fortress_2_medic';
const definition = Object.hasOwn(SIGNATURE_SOURCE_KITS, key) ? SIGNATURE_SOURCE_KITS[key] : SIGNATURE_SOURCE_KITS.team_fortress_2_medic;
const mode = query.get('mode') === 'Smash' ? 'Smash' : 'RPG';
const lang = query.get('lang') === 'en' ? 'en' : 'fr';
const side = query.get('side') === 'enemy' || definition.enemyName ? 'enemy' : 'player';
const pool = ENEMIES_DB[definition.universe];
const source = definition.enemyName
  ? [...pool.monsters, ...pool.bosses, pool.worldBoss].filter(Boolean).find(a => a.name === definition.enemyName)
  : HEROES_DB.find(a => a.id === definition.actorId);
const toEnemy = a => ({ ...a, universe: definition.universe, hp: a.stats?.hp || a.hp,
  atk: a.stats?.atk || a.atk, spd: a.stats?.spd || a.spd, def: a.stats?.def || a.def || 0 });
const patient = HEROES_DB.find(a => a.id === 'team_fortress_2_soldier');
const other = HEROES_DB.find(a => a.id === 'team_fortress_2_scout');
const opponents = side === 'enemy'
  ? [toEnemy(source), ...(definition.protection ? [toEnemy(patient), toEnemy(other)] : [])]
  : [{ id: 'wave3-qa-foe', name: 'QA target', universe: definition.universe, hp: 20000, atk: 1, def: 0, spd: 1 }];
const team = side === 'player' ? [definition.actorId, ...(definition.protection ? [patient.id, other.id] : [])] : ['cloud_ff7'];
const audit = { engine: null, definition, side, results: [] }; window.__supportAudit = audit;
const prototype = mode === 'RPG' ? EngineRpg.prototype : EngineSmash.prototype;
const update = prototype.update;
prototype.update = function (...args) { audit.engine = this; return update.apply(this, args); };
const stage = { id: 'qa-stock-support', name: 'Synthetic support fixture', universe: definition.universe, mode,
  disableHazards: true, disableSignatureAI: true, customBattle: { singleRoster: true, opponentControl: 'p2',
    enemyData: { customRoster: opponents, monsters: opponents, bosses: [], worldBoss: null } } };
export default function Harness() {
  const [mounted, setMounted] = useState(true);
  return <><header className="combat-qa-toolbar"><p>Isolated synthetic state; real GameCanvas, input, targeting and engines.</p>
    <button id="qa-unmount" onClick={() => setMounted(false)}>QA unmount</button></header>
    {mounted && <GameCanvas lang={lang} playerProfile={{ name: 'QA' }} activeTeam={team} stage={stage}
      heroLevels={{}} equippedGear={{}} equippedEventItems={{}} heroTalents={{}} heroSkins={{}} completedStages={[]}
      onBattleEnd={(...args) => audit.results.push(args)} />}</>;
}
createRoot(document.getElementById('root')).render(<StrictMode><Harness /></StrictMode>);
