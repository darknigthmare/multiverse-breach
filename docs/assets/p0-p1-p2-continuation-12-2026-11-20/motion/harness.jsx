import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../../../src/game/engineRpg.js';
import { buildCustomEnemyCatalog, buildCustomEnemyData } from '../../../../src/game/customBattle.js';
import { getExpandedStages } from '../../../../src/game/expandedUniverses.js';
import { applyDisplayPreferences } from '../../../../src/game/displayPreferences.js';
import { BRIAR_QUEEN } from '../../../../src/game/originalBriarQueenGuard.js';
import '../../../../src/index.css';

const ids = [BRIAR_QUEEN.id, 'valedor_shattered_crown:dragon_du_pic_creux', 'valedor_shattered_crown:chevalier_creux'];
const catalog = buildCustomEnemyCatalog().filter(entry => entry.universe === BRIAR_QUEEN.universe && ids.includes(entry.data.id));
const enemyData = buildCustomEnemyData(ids.map(id => catalog.find(entry => entry.data.id === id).id), catalog);
const arena = getExpandedStages().find(candidate => candidate.stageKey === 'fantasy_shattered_throne');
if (arena?.mode !== 'RPG' || arena.universe !== BRIAR_QUEEN.universe) throw new Error('Valedor RPG stage unavailable');

const stage = {
  ...arena, difficulty: 'Training', skipPreMatchInTraining: true, disableItems: true, disableHazards: true,
  customBattle: { singleRoster: true, opponentControl: 'p2', enemyData }
};
const trace = { engine: null, manual: false, setMotion: motion => applyDisplayPreferences({ motion }) };
window.briarMotion = trace;
const update = EngineRpg.prototype.update;
EngineRpg.prototype.update = function (...args) {
  trace.engine = this;
  if (!trace.manual) return update.apply(this, args);
};
trace.step = count => { for (let frame = 0; frame < count; frame++) update.call(trace.engine); };

const activeTeam = ['aelwen_starbough'];
const playerProfile = { name: 'Vérification' };
const loadout = {};
const completedStages = [];
const onBattleEnd = () => {};

export function Fixture() {
  const [mounted, setMounted] = useState(true);
  return <>
    <button id="qa-unmount" onClick={() => setMounted(false)}>Démonter</button>
    {mounted && <GameCanvas lang="fr" playerProfile={playerProfile} activeTeam={activeTeam} stage={stage}
      heroLevels={loadout} equippedGear={loadout} equippedEventItems={loadout} heroTalents={loadout}
      heroSkins={loadout} completedStages={completedStages} onBattleEnd={onBattleEnd} />}
  </>;
}
createRoot(document.getElementById('root')).render(<Fixture />);
