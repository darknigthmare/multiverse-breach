// Browser fixture. Use the normal stage and isolate the catalog enemy in custom battle.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../../../src/game/engineRpg.js';
import { getMonstersForUniverse } from '../../../../src/game/enemies.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import '../../../../src/index.css';

const dock = getExpandedStages().find(candidate => candidate.stageKey === 'aether_leviathan_dock');
const mite = getMonstersForUniverse('The Aether Crown').find(enemy => enemy.id === 'aether_crown:aether_mite_swarm');
const customBattle = { singleRoster: true, enemyData: { customRoster: [mite] } };
const stage = { ...dock, customBattle };
const team = ['elara_voss'];
const audit = { engine: null };
window.__aetherMiteAudit = audit;

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
