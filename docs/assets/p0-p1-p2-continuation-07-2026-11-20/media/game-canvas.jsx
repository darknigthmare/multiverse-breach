import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../../../src/game/engineRpg.js';
import { EngineTactics } from '../../../../src/game/engineTactics.js';
import { buildCustomEnemyCatalog, buildCustomEnemyData, makeCustomEnemyId } from '../../../../src/game/customBattle.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import '../../../../src/index.css';

const pneuma = new URLSearchParams(location.search).get('boss') === 'pneuma';
const universe = pneuma ? 'The Aether Crown' : 'Valedor: The Shattered Crown';
const stageKey = pneuma ? 'aether_crown_foundry' : 'fantasy_shattered_throne';
const native = getExpandedStages().find(stage => stage.stageKey === stageKey);
const enemyId = makeCustomEnemyId(universe, pneuma ? 'boss' : 'worldBoss', pneuma ? 'Lord Pneuma' : 'Vaelgor, Premier Wyrm');
const enemyData = buildCustomEnemyData([enemyId], buildCustomEnemyCatalog());
const customBattle = { singleRoster: true, opponentControl: pneuma ? 'cpu' : 'p2', enemyData };
const stage = { ...native, customBattle };
const team = ['elara_voss'];
const audit = { engine: null, stageKey, mode: native.mode };
window.__staticBossAudit = audit;
const engineType = pneuma ? EngineTactics : EngineRpg;
const update = engineType.prototype.update;
engineType.prototype.update = function (...args) {
  audit.engine = this;
  return update.apply(this, args);
};

function Fixture() {
  const [mounted, setMounted] = useState(true);
  return <>
    <button id="qa-unmount" onClick={() => setMounted(false)}>Démonter</button>
    {mounted && <GameCanvas lang="fr" playerProfile={{ name: 'Test' }}
      activeTeam={team} stage={stage} heroLevels={{}} equippedGear={{}}
      equippedEventItems={{}} heroTalents={{}} heroSkins={{}}
      completedStages={[]} onBattleEnd={() => {}} />}
  </>;
}

createRoot(document.getElementById('root')).render(<Fixture />);
