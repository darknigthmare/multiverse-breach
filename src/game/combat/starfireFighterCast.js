import { getQuarantinedCanonSprite } from '../runtimeSpriteQuarantine.js';
import { prefersCurrentCanonCombatKit } from './sourceKitPriority.js';
import { getWave16NativeSummonAsset } from './rosterSummonChoreographyWave16.js';

const asset = getWave16NativeSummonAsset('Teen Titans', 'Starfire', 'Starbolts verts de Starfire');
// The release cell contains a separate flash beyond x352. Fighter has its
// own launched projectile, so the skin retains the hand and its close glow.
const releasedPose = { row: 2, col: 2, clipAtSourceX: 352 };
const displayLeadDistance = 52;

export function getStarfireFighterCastAtlas(actor) {
  const sourceId = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  if (sourceId !== 'starfire_tt' || getQuarantinedCanonSprite(actor)?.actorId !== sourceId
    || actor.weaponType !== 'starbolts'
    || [actor.sourceHeroId, actor.sourceId].some(id => id !== undefined && id !== '' && id !== sourceId)
    || !prefersCurrentCanonCombatKit(actor)) return null;
  return asset;
}

export function isStarfireFighterCast(actor, action) {
  const profile = action?.identity;
  if (profile?.sourceHeroId !== 'starfire_tt' || profile.universe !== 'Teen Titans'
    || action.delivery !== 'projectile' || action.effect !== 'damage'
    || profile.sourceAbility?.type !== 'energy' || !getStarfireFighterCastAtlas(actor)) return false;
  return (action.type === 'light' && profile.sourceAbility.slot === 'simple' && profile.name === 'Green Starbolt')
    || (action.type === 'super' && profile.sourceAbility.slot === 'special' && profile.name === 'Green Starbolt Volley');
}

export function getStarfireFighterCastFrame(actor, reducedMotion = false) {
  const action = actor?.action;
  if (actor?.state !== 'attack' || !isStarfireFighterCast(actor, action)) return null;
  const { elapsed, hitAt, duration } = action;
  if (![elapsed, hitAt, duration].every(Number.isFinite) || hitAt <= 0 || hitAt >= duration
    || elapsed < 0 || elapsed > duration) return null;

  if (elapsed < hitAt) {
    const progress = reducedMotion ? 0 : elapsed / hitAt;
    return { asset, row: progress >= 0.62 ? 2 : 1, col: progress >= 0.28 ? 1 : 0 };
  }
  const returnProgress = (elapsed - hitAt) / (duration - hitAt);
  if (returnProgress < 0.38) return { asset, ...releasedPose };
  return { asset, row: 3, col: !reducedMotion && returnProgress >= 0.78 ? 3 : 2 };
}

export function getStarfireFighterCastCenter(asset, y, height) {
  return y + height / 2 - asset.normalization.baseline * height / asset.frameHeight;
}

// Keep the physical projectile and its collision geometry unchanged. The
// first 52 display pixels blend the inspected palm with the engine trajectory.
export function getStarfireFighterLaunch(actor, action, origin, height) {
  if (!isStarfireFighterCast(actor, action)) return null;
  const palm = asset.effectAnchors.attack[releasedPose.col];
  const scale = height / asset.frameHeight;
  const facing = action.facing ?? actor.facing;
  const x = Math.round(actor.x) + (palm.x - asset.frameWidth / 2) * scale * facing;
  const y = Math.round(getStarfireFighterCastCenter(asset, actor.y, height)) + palm.y * scale - height / 2;
  return { originX: origin.x, dx: x - origin.x, dy: y - origin.y };
}

export function getStarfireFighterProjectilePoint(projectile) {
  const { x, y, starfireLaunch } = projectile;
  if (!starfireLaunch) return projectile;
  const blend = Math.max(0, 1 - Math.abs(x - starfireLaunch.originX) / displayLeadDistance);
  return { x: x + starfireLaunch.dx * blend, y: y + starfireLaunch.dy * blend };
}
