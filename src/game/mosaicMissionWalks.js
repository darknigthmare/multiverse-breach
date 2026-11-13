import { findMosaicWalkablePosition, getMosaicNavigationObstacles, planMosaicPath } from './mosaicCityRuntime.js';

/** A reconnaissance is earned by reaching its ordered places in the live City.
 * This is a local gameplay receipt, not an anti-cheat or a simulated escort. */
const point = value => Number.isFinite(value?.x) && Number.isFinite(value?.y);
const words = value => typeof value?.fr === 'string' && value.fr.trim()
  && typeof value?.en === 'string' && value.en.trim();
const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
export const MOSAIC_WALK_RANGE = 64;

/** Request an ordinary walking destination, including after restoring at a
 * marker. This never places the player or grants a receipt. The same collision
 * envelopes and path planner as the movement loop own every approach. */
export function getMosaicMissionWalkApproach(state, target, district) {
  if (!point(state?.player) || !point(target) || !Number.isFinite(district?.worldW)
    || !Number.isFinite(district?.worldH)) return null;
  const obstacles = getMosaicNavigationObstacles({ ...state, pendingInteraction: null });
  const origin = findMosaicWalkablePosition(state.player, district, obstacles);
  if (!origin) return null;
  const offsets = [[0, 44], [44, 0], [-44, 0], [0, -44], [31, 31], [-31, 31], [31, -31], [-31, -31]];
  const candidates = offsets.map(([x, y]) => ({ x: target.x + x, y: target.y + y }));
  if (Math.hypot(state.player.x - target.x, state.player.y - target.y) > MOSAIC_WALK_RANGE) candidates.unshift(target);
  for (const candidate of candidates) {
    const approach = findMosaicWalkablePosition(candidate, district, obstacles);
    if (approach && Math.hypot(approach.x - target.x, approach.y - target.y) <= MOSAIC_WALK_RANGE
      && Math.hypot(approach.x - state.player.x, approach.y - state.player.y) > 1
      && planMosaicPath(origin, approach, district, obstacles).length) return approach;
  }
  return null;
}

export function getMosaicMissionWalkSpec(step) {
  const walk = step?.walk;
  if (step?.type !== 'marker' || step.operation?.kind !== 'route'
    || !Array.isArray(walk?.points) || walk.points.length < 2 || walk.points.length > 6
    || !walk.points.every(value => point(value) && typeof value.id === 'string'
      && /^[a-z0-9-]{1,80}$/.test(value.id) && words(value.label))
    || new Set(walk.points.map(value => value.id)).size !== walk.points.length
    || walk.points.at(-1).x !== step.x || walk.points.at(-1).y !== step.y) return null;
  // Two neighbouring places must require a new journey, not one stationary frame.
  if (walk.points.some((value, index) => index > 0
    && Math.hypot(value.x - walk.points[index - 1].x, value.y - walk.points[index - 1].y) <= MOSAIC_WALK_RANGE * 2)) return null;
  return walk;
}

const identity = (mission, step, saved) => ({ version: 1, missionId: mission.id,
  stepId: step.id, universe: mission.universe, districtId: mission.districtId,
  originChoiceId: mission.requiresMissionId ? saved.originChoiceId : null,
  originStoryRevision: mission.requiresMissionId ? saved.originStoryRevision || 1 : null,
  branchChoiceId: step.byChoice ? saved.choiceId : null });
const sameIdentity = (value, expected) => Object.entries(expected).every(([key, field]) => value?.[key] === field);

function validSample(value, target) {
  if (!point(value?.from) || !point(value?.to) || !Number.isFinite(value.elapsedMs)
    || value.elapsedMs <= 0 || value.elapsedMs > 50 || !Number.isFinite(value.speed)
    || value.speed <= 0 || value.speed > 12 || !Number.isFinite(value.distance)) return false;
  const distance = Math.hypot(value.to.x - value.from.x, value.to.y - value.from.y);
  return distance > 0.0001 && Math.abs(distance - value.distance) < 1e-6
    && distance <= value.speed * 60 * value.elapsedMs / 1000 + 1e-6
    && Math.hypot(value.to.x - target.x, value.to.y - target.y) <= MOSAIC_WALK_RANGE
    && value.id === target.id && value.x === target.x && value.y === target.y;
}

/** Invalid, foreign or old-route data stays in the save but grants no waypoint. */
export function getMosaicMissionWalkProgress(mission, step, saved = {}) {
  const spec = getMosaicMissionWalkSpec(step);
  if (!spec) return null;
  const receipt = record(saved.walkReceipts)[step.id];
  const expected = identity(mission, step, saved);
  const points = sameIdentity(receipt, expected) && Array.isArray(receipt.points)
    && receipt.points.length <= spec.points.length
    && receipt.points.every((value, index) => validSample(value, spec.points[index]))
    ? receipt.points : [];
  const completed = points.length === spec.points.length;
  return { completed, visited: points.length, total: spec.points.length,
    next: spec.points[Math.min(points.length, spec.points.length - 1)], points };
}

/** Called immediately after advanceMosaicPlayer, never from a menu or a draw.
 * At most one checkpoint is saved per moving frame. No step/choice/cargo is
 * completed here; the final local interaction still owns the operation. */
export function recordMosaicMissionWalk(mission, step, saved, movement) {
  const progress = getMosaicMissionWalkProgress(mission, step, saved);
  if (!progress || progress.completed || movement?.districtId !== mission.districtId) return null;
  const target = progress.next;
  const sample = { id: target.id, x: target.x, y: target.y,
    from: { x: movement.from?.x, y: movement.from?.y },
    to: { x: movement.to?.x, y: movement.to?.y }, elapsedMs: movement.elapsedMs,
    speed: movement.speed, distance: movement.distance };
  if (!validSample(sample, target)) return null;
  return { ...identity(mission, step, saved), points: [...progress.points, sample] };
}
