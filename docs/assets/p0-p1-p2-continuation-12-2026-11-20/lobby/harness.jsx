import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import CustomBattleMode from '../../../../src/components/CustomBattleMode.jsx';
import { EngineTactics } from '../../../../src/game/engineTactics.js';
import { HEROES_DB } from '../../../../src/game/heroes.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import { buildCustomEnemyCatalog } from '../../../../src/game/customBattle.js';
import '../../../../src/index.css';

const mission = getExpandedStages().find(stage => stage.stageKey === 'iron_ashline_trenches');
const heroes = HEROES_DB.filter(hero => hero.universe === 'Iron Tempest');
const heroIds = heroes.map(hero => hero.id);
const squad = ['mara_veylan'];
const enemy = buildCustomEnemyCatalog().find(actor => actor.universe === 'Iron Tempest' && actor.kind === 'boss');
const archive = { id: 'qa-ashline', universe: mission.universe, name: mission.name };
const empty = Object.freeze({});
const none = Object.freeze([]);
const probe = window.__customResume = { engine: null, starts: 0, reports: [] };
const update = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) {
  probe.engine = this;
  return update.apply(this, args);
};

export function Fixture() {
  const [paused, setPaused] = useState(false);
  const [exitRequest, setExitRequest] = useState(0);
  const [collection, setCollection] = useState({ archives: [archive], customBattlePreset: {
    mode: 'Tactics', opponentControl: 'p2', playerTeamIds: squad, enemyIds: [enemy.id],
    stageArchiveId: archive.id, tacticsBattlefieldId: 'iron_ashline_radio_ridge_tactics'
  } });

  return <>
    <header style={{ position: 'fixed', bottom: 6, left: 6, zIndex: 10000 }}>
      {paused && <>
        <button type="button" onClick={() => setCollection(previous => ({ ...previous,
          archives: previous.archives.map(entry => ({ ...entry }))
        }))}>Refresh collection</button>
        <button type="button" onClick={() => setPaused(false)}>Resume session</button>
      </>}
      <button type="button" onClick={() => { setPaused(false); setExitRequest(value => value + 1); }}>Leave session</button>
    </header>
    <CustomBattleMode lang="en" heroes={heroes} unlockedHeroes={heroIds} activeTeam={squad}
      playerProfile={empty} heroLevels={empty} heroSkins={empty} equippedGear={empty} equippedEventItems={empty}
      heroTalents={empty} hiddenUniverses={none} disabledAssets={empty} completedStages={none}
      portalCollection={collection} setPortalCollection={setCollection}
      sessionPaused={paused} sessionExitRequest={exitRequest} onPauseRequest={() => setPaused(true)}
      onSessionStart={() => probe.starts++} onSessionEnd={report => probe.reports.push(report)} />
  </>;
}

createRoot(document.getElementById('root')).render(<Fixture />);
