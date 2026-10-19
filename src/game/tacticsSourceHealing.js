// Adapt the existing, verified Healing Wind identity to the tactical board.
// Five Manhattan cells + line of sight are Breach rules, not a new FFVII claim.
import { resolveSourceSignature, prepareSourceSignature } from './signatureSourceKits.js';
export const TACTICS_HEALING_WIND_RANGE = 5;

export function getTacticsHealingDefinition(actor) {
  const action = actor?.special;
  if (actor?.tacticsAttacks?.special || action?.tacticsProfile || action?.tactics || action?.attackProfile) return null;
  const d = resolveSourceSignature(actor);
  if (d?.key !== 'aerith_ff7' || d.effect !== 'heal' || d.shape !== 'group'
    || !Number.isFinite(d.healRatio) || d.healRatio <= 0) return null;
  // In-place edits must invalidate a pending source cast rather than changing
  // its power, purifying statuses or silently becoming an offensive action.
  if (action?.sourceSignatureKey === d.key && (action.name !== d.name
    || action.type !== 'heal' || action.healRatio !== d.healRatio || action.dmg !== 0)) return null;
  return d;
}

export function prepareTacticsHealing(actor) {
  return getTacticsHealingDefinition(actor) ? prepareSourceSignature(actor) : null;
}

export function getTacticsHealingProfile(actor, actionType) {
  const d = actionType === 'special' ? getTacticsHealingDefinition(actor) : null;
  if (!d) return null;
  return { name: d.name, action: actor.special, actionType, sourceSignatureKey: d.key,
    effect: 'heal', targetSide: 'ally', delivery: 'support', shape: 'group',
    maxTargets: Infinity, minTargets: 1, range: TACTICS_HEALING_WIND_RANGE, minRange: 0,
    healRatio: d.healRatio, multiplier: 0, cleanses: [],
    requiresLineOfSight: true, blocksOnUnits: false, pierceObstacles: false };
}
