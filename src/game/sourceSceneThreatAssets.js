import { resolveSourceScene } from './sourceSceneStages.js';

// The Nov 9 sheet supplies sixteen existing poses for the intact, biomasked
// Prey (2022) Feral. Reusing it is not approval of this scene's art, wounds,
// launcher animations or the still-missing maskless appearance.
export const MASKED_FERAL_SOURCE_SCENE_ART = Object.freeze({
  stageId: 50106,
  sourceSceneId: 'prey_1719_naru_feral_bog',
  universe: 'Prey',
  threatName: 'Feral Predator',
  spriteSource: '/sprites/generated/heroes/prey/feral-predator-v2-fidelity-wave13-2026-11-09.png',
  evidence: 'docs/audits/feral-predator-v2-reference-sprite-fidelity-wave13-2026-11-09.json',
  artApproved: false
});

const permittedThreatIds = new Set(['feral_predator', 'prey-feral-predator']);
const permittedIncarnations = new Set([
  'Prey (2022) - masked Feral Predator, intact default appearance'
]);

/** Only the authored Naru scene owns this masked Feral binding. */
export function getSourceSceneMaskedFeralSprite(scene) {
  const definition = scene?.definition, threat = scene?.threat;
  const art = MASKED_FERAL_SOURCE_SCENE_ART;
  if (!definition || resolveSourceScene(definition) !== definition
    || definition.id !== art.stageId || definition.sourceSceneId !== art.sourceSceneId
    || definition.universe !== art.universe || definition.material !== 'prey'
    || definition.threatName !== art.threatName || scene.complete
    || !(scene.done instanceof Set) || scene.done.has('take_mask') || scene.done.has('redirect')
    || scene.actor?.id !== 'naru_prey' || scene.actor.universe !== art.universe
    || threat?.name !== art.threatName) return '';
  if ([threat.universe, threat.sourceUniverse].some(value => value && value !== art.universe)
    || [threat.id, threat.sourceId, threat.sourceHeroId].some(value => value && !permittedThreatIds.has(value))
    || [threat.incarnation, threat.sourceIncarnation].some(value => value && !permittedIncarnations.has(value))
    || threat.masked === false
    || (threat.legacyWorldBossId && threat.legacyWorldBossId !== 'prey-feral-predator')) return '';
  // The authoritative boss uses a locked continuity object, not the playable
  // ally's incarnation string. Preserve that exact 1719 edition as well.
  if (threat.continuity) {
    const continuity = threat.continuity;
    if (typeof continuity !== 'object'
      || continuity.id !== 'prey-2022-great-plains-1719'
      || continuity.label !== 'Prey (2022) - Great Plains 1719'
      || continuity.status !== 'locked') return '';
  }
  return art.spriteSource;
}

/** Resolve the same scene-owned art before GameCanvas instantiates its engine. */
export function getSourceSceneEnemyPreloadOverride(stage, heroes, threat) {
  const definition = resolveSourceScene(stage);
  if (!definition || !Array.isArray(heroes) || !threat) return '';
  const actors = heroes.filter(hero => hero?.id === definition.sceneLead.id
    && hero.universe === definition.sceneLead.universe);
  if (actors.length !== 1) return '';
  return getSourceSceneMaskedFeralSprite({
    definition, actor: actors[0], done: new Set(),
    threat: { ...threat, universe: threat.universe || definition.universe }
  });
}
