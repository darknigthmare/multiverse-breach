// Browser fixture. Use the normal stage and isolate the catalog enemy in custom battle.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../../../src/components/GameCanvas.jsx';
import { EngineTactics } from '../../../../src/game/engineTactics.js';
import { getBossesForUniverse } from '../../../../src/game/enemies.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import '../../../../src/index.css';

const workshop = getExpandedStages().find(candidate => candidate.stageKey === 'meridian_astrarium');
const judge = getBossesForUniverse('Meridian Clockwork').find(enemy => enemy.id === 'meridian_clockwork:the_twelve_bell_judges');
const customBattle = { singleRoster: true, enemyData: { customRoster: [{ ...judge, isBoss: true }] } };
const stage = { ...workshop, customBattle };
const team = ['seraphine_meridius'];
const audit = { engine: null };
window.__bellJudgesAudit = audit;

const update = EngineTactics.prototype.update;
EngineTactics.prototype.update = function (...args) {
  audit.engine = this;
  return update.apply(this, args);
};

export function Fixture() {
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
