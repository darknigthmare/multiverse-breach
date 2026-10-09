// Source-locked kits opt into spatial combat rules. Distances, hit limits and
// musical/comic damage are game adaptations, not measurements from the films.
const contact = Object.freeze({ delivery: 'melee', shape: 'single', range: 70, verticalRange: 35 });
const ranged = Object.freeze({ delivery: 'ranged', shape: 'single', range: 300, verticalRange: 35 });

export const CANON_SMASH_ABILITY_PROFILES = Object.freeze({
  han_solo: Object.freeze({
    simple: ranged,
    secondary: ranged,
    special: Object.freeze({ ...ranged, shape: 'multi', maxTargets: 3 })
  }),
  luke: Object.freeze({ simple: contact, secondary: ranged, special: contact }),
  vader: Object.freeze({
    simple: contact,
    secondary: ranged,
    special: Object.freeze({ ...ranged, knockback: 0 })
  }),
  bob_minions: Object.freeze({ simple: contact, secondary: ranged, special: contact }),
  kevin_minions: Object.freeze({ simple: contact, secondary: ranged, special: contact }),
  stuart_minions: Object.freeze({
    simple: contact,
    secondary: ranged,
    special: Object.freeze({ delivery: 'ranged', shape: 'area', range: 160, verticalRange: 100, directional: false })
  })
});

const positive = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;

export function getSmashAbilityProfile(actor, abilityType) {
  const action = actor?.[abilityType];
  if (!action || typeof action !== 'object') return null;
  const sourceId = actor.sourceId || actor.id;
  const canonical = CANON_SMASH_ABILITY_PROFILES[sourceId]?.[abilityType];
  const explicit = action.smashProfile || actor.smashAttacks?.[abilityType];
  // A general attack profile alone must not silently change unrelated legacy
  // Smash kits. Opt-in is a Smash profile or one of the six reviewed source kits.
  if (!canonical && !explicit) return null;
  // Mode-specific pixel distances and shapes take priority over shared RPG /
  // Tactics hints. Only an explicit Smash profile may override this contract.
  const profile = { ...action.attackProfile, ...canonical, ...explicit };
  const delivery = profile.delivery === 'melee' ? 'melee' : 'ranged';
  const shape = ['single', 'multi', 'area', 'group'].includes(profile.shape) ? profile.shape : 'single';
  return {
    ...profile,
    delivery,
    shape,
    range: positive(profile.range, delivery === 'melee' ? 70 : 300),
    verticalRange: positive(profile.verticalRange, 35),
    directional: profile.directional ?? !['area', 'group'].includes(shape),
    maxTargets: shape === 'single' ? 1 : positive(profile.maxTargets, shape === 'multi' ? 3 : Infinity)
  };
}

export function getSmashAbilityTargets(actor, candidates, profile) {
  if (!actor || !profile) return [];
  const facing = actor.facing === -1 ? -1 : 1;
  return candidates.filter(target => {
    if (target.currentHp <= 0 || target.state === 'dead') return false;
    const dx = target.x - actor.x;
    const dy = target.y - actor.y;
    if (profile.directional && dx * facing < 0) return false;
    if (Math.abs(dy) > profile.verticalRange) return false;
    const distance = profile.shape === 'area' ? Math.hypot(dx, dy) : Math.abs(dx);
    return distance <= profile.range;
  }).sort((left, right) => (
    Math.hypot(left.x - actor.x, left.y - actor.y)
    - Math.hypot(right.x - actor.x, right.y - actor.y)
  )).slice(0, profile.maxTargets);
}
