import { getOriginalTideActorDesign } from './originalTideActorDesigns.js';

export const BRIAR_QUEEN = Object.freeze({
  id: 'valedor_shattered_crown:reine_des_ronces',
  universe: 'Valedor: The Shattered Crown',
  name: 'Reine des Ronces',
  weapon: 'magic',
  sheet: '/sprites/generated/bosses/valedor-the-shattered-crown/reine-des-ronces.png'
});

export function isBriarQueen(actor) {
  return actor?.id === BRIAR_QUEEN.id && actor.name === BRIAR_QUEEN.name
    && actor.weapon === BRIAR_QUEEN.weapon && actor.universe === BRIAR_QUEEN.universe
    && (!actor.sourceUniverse || actor.sourceUniverse === BRIAR_QUEEN.universe)
    && (!actor.sourceId || actor.sourceId === BRIAR_QUEEN.id)
    && (!actor.sourceHeroId || actor.sourceHeroId === BRIAR_QUEEN.id);
}

export function isBriarQueenGuard(actor, profile) {
  if (!isBriarQueen(actor) || profile?.abilityType !== 'special' || profile.effect !== 'guard'
    || profile.targetSide !== 'ally' || profile.shape !== 'group') return false;
  const move = getOriginalTideActorDesign(actor).rpgMove;
  return profile.name === move.name && profile.action?.fr === move.description && profile.action.en === move.description
    && profile.duration === move.targeting.duration && profile.guardReduce === move.targeting.reduce;
}
