import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import CustomBattleMode from '../../../../src/components/CustomBattleMode.jsx';
import { EngineTactics } from '../../../../src/game/engineTactics.js';
import { HEROES_DB } from '../../../../src/game/heroes.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import { buildCustomEnemyCatalog } from '../../../../src/game/customBattle.js';
import '../../../../src/index.css';

const stage = getExpandedStages().find(item => item.stageKey === 'pirate_dead_calm_graveyard');
const heroes = HEROES_DB.filter(hero => hero.universe === stage.universe);
const enemy = buildCustomEnemyCatalog().find(item => item.universe === stage.universe && item.data.id === stage.bossId);
const empty = Object.freeze({});
const none = Object.freeze([]);
const team = Object.freeze(['ysara_flint']);
const unlocked = heroes.map(hero => hero.id);
const profile = Object.freeze({ name: 'QA' });
const archive = { ...stage, id: 'qa-dead-calm-archive', image: null };
const audit = window.__deadCalm = { engine: null, reports: [] };
// Observe the production instance. All gameplay is still dispatched by the real lobby and Canvas.
const update = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) { audit.engine = this; return update.apply(this, args); };

export function Fixture() {
  const [collection, setCollection] = useState({ archives: [archive], customBattlePreset: {
    mode: 'Tactics', opponentControl: 'p2', playerTeamIds: team, enemyIds: [enemy.id],
    stageArchiveId: archive.id, tacticsBattlefieldId: 'auto', items: true, hazards: false
  } });
  return <CustomBattleMode lang="en" heroes={heroes} unlockedHeroes={unlocked} activeTeam={team} playerProfile={profile}
    portalCollection={collection} setPortalCollection={setCollection} sessionPaused={false}
    heroLevels={empty} equippedGear={empty} equippedEventItems={empty} heroTalents={empty} heroSkins={empty}
    completedStages={none} hiddenUniverses={none} disabledAssets={empty}
    onSessionEnd={report => audit.reports.push(report)} />;
}

const root = createRoot(document.getElementById('root'));
audit.unmount = () => root.unmount();
root.render(<Fixture />);
