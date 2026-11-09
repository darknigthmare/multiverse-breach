// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcAliens from '../../DLC/Aliens/data/sourceSceneStages.js';
import * as dlcAlien from '../../DLC/Alien/data/sourceSceneStages.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/sourceSceneStages.js';

/** Source-locked scenes. Grids/timing are explicit tactical adaptations, NOT art certification. */
const text = (fr, en) => ({ fr, en });
const command = (id, x, y, fr, en, requires = [], extra = {}) => ({
  id, cell: { x, y }, label: text(fr, en), requires, ...extra
});
const commonAdaptation = text(
  'Reconstruction tactique en grille : distances, tours, dégâts et positions sont adaptés. Seul le protagoniste requis participe ; les équipiers restent hors scène. Les commandes de mission remplacent armes, objets et événements crossover. Décors procéduraux et sprites existants : fidélité artistique non certifiée.',
  'Tactical grid reconstruction: distances, turns, damage and positions are adapted. Only the required protagonist participates; teammates stay off-scene. Mission commands replace crossover weapons, items and events. Procedural scenery and existing sprites: artistic fidelity is not certified.'
);
const base = (id, key, universe, heroId, incarnation, name, nameFr) => ({
  id, sourceSceneId: key, universe, mode: 'Tactics', difficulty: 'Hard', unlockClears: 0,
  name, nameFr, incarnation, canonStatus: 'Source-locked tactical adaptation; artistic review pending',
  visualReviewStatus: 'pending', sourceSceneParty: 'required-protagonist-only',
  requiredTeam: { type: 'character', heroId, firstClearOnly: false, freeReplayAfterArc: false, allowAnchor: true },
  tacticsBattlefieldId: key, enemyRosterExclusive: true,
  disableItems: true, gameplayAdaptation: commonAdaptation.en
});

export const SOURCE_SCENE_STAGES = [
  dlcAliens.createSourceSceneStages({ base, command, commonAdaptation }),
  dlcAlien.createSourceSceneStages({ base, command, commonAdaptation }),
  dlcHalfLife.createSourceSceneStages({ base, command, commonAdaptation })
];

export function resolveSourceScene(stage) {
  if (!stage || stage.customBattle || stage.isCustomBattle || stage.isCustom
    || stage.forceBaseArena || stage.dlcSuppressedArena) return null;
  return SOURCE_SCENE_STAGES.find(s => Number(stage.id) === s.id
    && stage.sourceSceneId === s.sourceSceneId && stage.universe === s.universe
    && stage.mode === s.mode && stage.incarnation === s.incarnation) || null;
}
export function getSourceSceneBattlefield(stage) {
  const scene = resolveSourceScene(stage);
  if (!scene) return null;
  return { id: scene.sourceSceneId, label: text(scene.nameFr, scene.name), objective:'source_scene',
    objectiveTarget:scene.commands.filter(c=>!c.repeatable).length, rows:scene.field.rows,cols:scene.field.cols,
    heroSpawns:scene.field.heroSpawns.map(p=>({...p})), monsterSpawns:[],bossSpawns:[],obstacles:[],
    tags:['sourceScene'], tiles:scene.field.blocked.map(([x,y])=>({x,y,type:'blocked'})) };
}
