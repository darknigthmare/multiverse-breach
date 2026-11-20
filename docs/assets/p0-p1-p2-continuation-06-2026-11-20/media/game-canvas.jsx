// Use each world's actual stage and isolate its catalog boss in a custom RPG battle.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../../../src/game/engineRpg.js';
import { buildCustomEnemyCatalog, buildCustomEnemyData, makeCustomEnemyId } from '../../../../src/game/customBattle.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import '../../../../src/index.css';

const phare = new URLSearchParams(location.search).get('boss') === 'phare';
const universe = phare ? 'The Drowned Testament' : 'The Crownless Sea';
const stageKey = phare ? 'lovecraft_abyssal_basilica' : 'pirate_kraken_maelstrom';
const native = getExpandedStages().find(stage => stage.stageKey === stageKey);
const enemyId = makeCustomEnemyId(universe, phare ? 'boss' : 'worldBoss', phare ? 'Le Phare qui Regarde' : 'Kraken Sans Couronne');
const enemyData = buildCustomEnemyData([enemyId], buildCustomEnemyCatalog());
const [boss] = enemyData.customRoster;
const customBattle = { singleRoster: true, opponentControl: 'p2', enemyData };
const stage = { ...native, customBattle };
const team = ['elara_voss'];
const audit = { engine: null, stageKey: native.stageKey, boss };
window.__bossAtlasAudit = audit;

const update = EngineRpg.prototype.update;
EngineRpg.prototype.update = function (...args) {
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
