// Browser fixture. The stage and wave are supplied by the normal game catalog.
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../../../src/game/engineRpg.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import '../../../../src/index.css';

const stage = getExpandedStages().find(candidate => candidate.stageKey === 'inca_uku_pacha_sunwell');
const team = ['killa_mayu'];
const audit = { engine: null };
window.__pachakutiAudit = audit;

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
