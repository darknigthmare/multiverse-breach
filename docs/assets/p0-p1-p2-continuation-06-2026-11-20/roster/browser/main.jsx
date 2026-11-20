import React from 'react';
import { createRoot } from 'react-dom/client';
import GameCanvas from '../../../../../src/components/GameCanvas.jsx';
import { EngineRpg } from '../../../../../src/game/engineRpg.js';
import { HEROES_DB } from '../../../../../src/game/heroes.js';
import { buildCustomEnemyCatalog, buildCustomEnemyData } from '../../../../../src/game/customBattle.js';
import '../../../../../src/index.css';

const cases = {
  storm: ['Kemet: The Devoured Sun', ['kemet_devoured_sun:tempete_rouge_avatar_d_isfet']],
  orbital: ['Helios 56', ['helios_56:moonbase_warden']],
  guard: ['Ilyr Concordat', ['ilyr_concordat:cuirasse_nul_oblique', 'ilyr_concordat:drone_nul_paleen', 'ilyr_concordat:archonte_sevrix']],
};
const caseId = new URLSearchParams(location.search).get('case');
const [universe, ids] = cases[caseId];
const catalog = buildCustomEnemyCatalog().filter(entry => entry.universe === universe && ids.includes(entry.data.id));
const enemyData = buildCustomEnemyData(ids.map(id => catalog.find(entry => entry.data.id === id).id), catalog);
const stage = { id: 'qa-original-ability', name: 'Essai des techniques originales', universe, mode: 'RPG', disableHazards: true,
  customBattle: { singleRoster: true, opponentControl: 'p2', enemyData } };
const team = HEROES_DB.filter(actor => actor.universe === universe).map(actor => actor.id);
window.rpgRosterAudit = { engine: null, draws: [] };
const update = EngineRpg.prototype.update;
EngineRpg.prototype.update = function (...args) {
  window.rpgRosterAudit.engine = this;
  return update.apply(this, args);
};
const draw = CanvasRenderingContext2D.prototype.drawImage;
CanvasRenderingContext2D.prototype.drawImage = function (image, ...args) {
  const src = image?.currentSrc || image?.src;
  if (src?.includes('/sprites/generated/bosses/')) {
    const path = new URL(src).pathname;
    if (!window.rpgRosterAudit.draws.includes(path)) window.rpgRosterAudit.draws.push(path);
  }
  return draw.call(this, image, ...args);
};
const root = createRoot(document.getElementById('root'));
window.rpgRosterAudit.unmount = () => root.unmount();
root.render(<GameCanvas lang="fr" playerProfile={{ name: 'Vérification' }} activeTeam={team} stage={stage} heroLevels={{}} equippedGear={{}}
  equippedEventItems={{}} heroTalents={{}} heroSkins={{}} completedStages={[]} onBattleEnd={() => {}} />);
