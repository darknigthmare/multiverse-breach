// Test-only bootstrap: real CustomBattleMode -> GameCanvas, original identities.
// update is observed by a call-through wrapper; no command or damage is replaced.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import CustomBattleMode from '../../../../src/components/CustomBattleMode.jsx';
import { EngineTactics } from '../../../../src/game/engineTactics.js';
import { HEROES_DB } from '../../../../src/game/heroes.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import { buildCustomEnemyCatalog } from '../../../../src/game/customBattle.js';
import '../../../../src/index.css';
const stage = getExpandedStages().find(s => s.stageKey === 'iron_ashline_trenches');
const heroes = HEROES_DB.filter(h => h.universe === 'Iron Tempest');
const empty = Object.freeze({}), none = Object.freeze([]);
const activeTeam = Object.freeze(['mara_veylan']), unlocked = heroes.map(h => h.id);
const playerProfile = Object.freeze({ name: 'QA' });
const enemy = buildCustomEnemyCatalog().find(e => e.universe === 'Iron Tempest' && e.kind === 'boss');
const archive = { id: 'qa-iron-archive', universe: stage.universe, name: stage.name, image: null };
const audit = window.__ashline = { engine: null, reports: [], starts: 0, stage };
const originalUpdate = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) { audit.engine = this; return originalUpdate.apply(this, args); };
export function Fixture() {
  const [paused, setPaused] = useState(false), [mounted, setMounted] = useState(true);
  const [collection, setCollection] = useState({ archives: [archive], customBattlePreset: {
    mode: 'Tactics', opponentControl: 'p2', playerTeamIds: ['mara_veylan'],
    enemyIds: [enemy.id], stageArchiveId: archive.id, tacticsBattlefieldId: 'auto', items: true, hazards: false
  } });
  return <>
    <header style={{ position: 'fixed', top: 0, right: 0, zIndex: 500, padding: 4, background: '#101923' }}>
      <button id="qa-pause" onClick={() => setPaused(p => !p)}>QA pause</button>
      <button id="qa-unmount" onClick={() => setMounted(false)}>QA unmount</button>
    </header>
    {mounted && <CustomBattleMode lang="en" heroes={heroes} unlockedHeroes={unlocked} activeTeam={activeTeam}
      playerProfile={playerProfile} portalCollection={collection} setPortalCollection={setCollection}
      sessionPaused={paused} onPauseRequest={() => setPaused(p => !p)}
      heroLevels={empty} equippedGear={empty} equippedEventItems={empty} heroTalents={empty} heroSkins={empty} completedStages={none}
      hiddenUniverses={none} disabledAssets={empty}
      onSessionStart={() => audit.starts++} onSessionEnd={report => audit.reports.push(report)} />}
  </>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
