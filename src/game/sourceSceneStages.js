// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcAliens from '../../DLC/Aliens/data/sourceSceneStages.js';
import * as dlcAlien from '../../DLC/Alien/data/sourceSceneStages.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/sourceSceneStages.js';
import * as dlcPredator from '../../DLC/Predator/data/sourceSceneStages.js';
import * as dlcPrey from '../../DLC/Prey/data/sourceSceneStages.js';

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
  dlcHalfLife.createSourceSceneStages({ base, command, commonAdaptation }),
  dlcPredator.createPredator1987SourceSceneStage({ base, command, commonAdaptation }),
  dlcPredator.createPredator2SourceSceneStage({ base, command, commonAdaptation }),
  dlcPrey.createSourceSceneStages({ base, command, commonAdaptation })
];


// Sarii stays a non-combat story marker, but must visibly accompany Naru
// after returning her tethered hatchet. A fixed tile would leave him behind
// during the bog duel and the journey to the village.
export function getSourceSceneCompanionCell(scene, prop) {
  if (!scene || !prop) return null;
  const fallback = { x: prop.x, y: prop.y };
  if (scene.definition?.material !== 'prey' || prop.id !== 'sarii'
    || !(scene.done instanceof Set) || !scene.done.has('sarii_hatchet')) return fallback;
  const actor = scene.actor, field = scene.definition.field;
  if (!Number.isInteger(actor?.gridX) || !Number.isInteger(actor?.gridY) || !field) return fallback;
  const forbidden = new Set((field.blocked || []).map(([x, y]) => `${x},${y}`));
  const adjacent = [
    { x: actor.gridX - 1, y: actor.gridY },
    { x: actor.gridX, y: actor.gridY + 1 },
    { x: actor.gridX, y: actor.gridY - 1 },
    { x: actor.gridX + 1, y: actor.gridY }
  ];
  return adjacent.find(({ x, y }) => x >= 0 && x < field.cols
    && y >= 0 && y < field.rows && !forbidden.has(`${x},${y}`)) || fallback;
}

// Story props are not permanent battlefield fixtures. In particular, Prey's
// bone targeting mask cannot be on the ground, carried and mounted at once.
// This only gates schematic props; the actual command target remains visible
// through the existing 'ready' highlight even before its prop is revealed.
export function isSourceScenePropVisible(scene, prop) {
  if (!scene || !prop || typeof prop.id !== 'string') return false;
  if (scene.definition?.material !== 'prey') return true;
  const done = scene.done;
  if (!(done instanceof Set)) return false;
  switch (prop.id) {
    case 'herb': return !done.has('herb');
    case 'trapper': return !done.has('flintlock');
    case 'flintlock': return done.has('bait') && !done.has('flintlock');
    case 'mask': return done.has('flintlock') && !done.has('take_mask');
    case 'mask_mount': return done.has('set_mask');
    case 'trophy': return done.has('redirect') && !done.has('trophy');
    default: return true;
  }
}

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
