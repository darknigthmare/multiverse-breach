import { BOOSTER_ROTATION_SIZE, getPortalBoosterRotation } from './portalBoosterCatalog.js';

export const ROTATION_REROLL_GOLD_COST = 500;
const uniquePool = universes => [...new Set(universes)].filter(value => typeof value === 'string' && value.length > 0);

export function getPersonalPortalRotation(universes, now, portalStats = {}) {
  const pool = uniquePool(universes);
  const daily = getPortalBoosterRotation(pool, now);
  const personal = portalStats.personalRotation;
  if (personal?.cycle !== daily.cycle || !Array.isArray(personal.universes)) return daily;
  const valid = uniquePool(personal.universes).filter(universe => pool.includes(universe));
  return valid.length === daily.universes.length ? { ...daily, universes: valid, personal: true } : daily;
}

// The caller persists the entire returned save in one atomic storage write,
// before publishing either the balance or the new rotation to the interface.
export function applyBoosterRotationReroll(save, { requestId, universes = [], expectedCycle, now = Date.now() } = {}) {
  const reject = reason => ({ applied: false, reason, save });
  if (typeof requestId !== 'string' || !requestId || requestId.length > 128) return reject('invalid-request');
  const previous = save.portalStats?.personalRotation;
  if (previous?.requestIds?.includes(requestId) || previous?.lastRequestId === requestId) return reject('already-applied');
  const hidden = new Set(save.hiddenUniverses || []);
  const pool = uniquePool(universes).filter(universe => !hidden.has(universe));
  const current = getPersonalPortalRotation(pool, now, save.portalStats);
  if (current.cycle !== expectedCycle) return reject('stale-cycle');
  if (pool.length <= BOOSTER_ROTATION_SIZE) return reject('not-enough-universes');
  if (!Number.isFinite(save.gold) || save.gold < ROTATION_REROLL_GOLD_COST) return reject('insufficient-gold');
  const rerolls = previous?.cycle === current.cycle ? Math.max(0, Number(previous.rerolls) || 0) + 1 : 1;
  let replacement = null;
  for (let offset = 0; offset < pool.length; offset += 1) {
    const start = ((current.cycle + rerolls) * BOOSTER_ROTATION_SIZE + offset) % pool.length;
    const candidate = Array.from({ length: BOOSTER_ROTATION_SIZE }, (_, index) => pool[(start + index) % pool.length]);
    if (candidate.some(universe => !current.universes.includes(universe))) { replacement = candidate; break; }
  }
  if (!replacement) return reject('not-enough-universes');
  return {
    applied: true,
    reason: null,
    save: {
      ...save,
      gold: save.gold - ROTATION_REROLL_GOLD_COST,
      portalStats: { ...save.portalStats, personalRotation: {
        cycle: current.cycle, universes: replacement, rerolls, lastRequestId: requestId,
        requestIds: [...(previous?.requestIds || []), requestId].slice(-32)
      } }
    }
  };
}
