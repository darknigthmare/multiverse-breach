// RPG targeting is intentionally pure: preview, manual confirmation and AI all
// resolve the same identities, without spending resources or choosing at random.
import { previewBattleItemDamage } from './battleItemShield.js';
import { getEffectiveCombatDefense } from './combatStatPreparation.js';
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const positive = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
export const rpgUnitId = unit => unit?.battleId || unit?.runtimeId || unit?.id;
const beneficialEffects = new Set(['heal', 'revive', 'buff', 'guard', 'cleanse']);

export function getRpgActionProfile(actor, abilityType, side = 'player', arena = {}) {
  const enemyFallbacks = {
    simple: { name: 'Attack', type: /gun|laser|bullet|projectile/.test(actor?.weapon || '') ? 'bullet' : 'melee', dmg: 1 },
    secondary: { name: 'Strong attack', type: 'bullet', dmg: 1.45, cd: 3 },
    special: { name: 'Special', type: 'group', dmg: 1.15, targeting: { shape: 'group' } }
  };
  const action = actor?.[abilityType] || (side === 'enemy' ? enemyFallbacks[abilityType] : null);
  if (!action) return null;
  const explicit = Object.assign({},
    typeof action.targeting === 'object' ? action.targeting : null,
    action.attackProfile,
    action.rpgProfile,
    actor.rpgAttacks?.[abilityType]
  );
  const type = String(action.type || '').toLowerCase();
  // These summons are explicitly medical/defensive in their existing OC lore.
  const loreEffect = actor.id === 'arca_loom' && abilityType === 'secondary' ? 'heal'
    : actor.id === 'arca_bastion' && abilityType === 'secondary' ? 'guard' : null;
  const declaredEffect = explicit.effect || action.effect?.type || (typeof action.effect === 'string' ? action.effect : null);
  const effect = abilityType === 'defense' ? 'guard' : declaredEffect || loreEffect
    || (/reviv|resurrect/.test(type) ? 'revive'
      : /heal|restore|regen/.test(type) ? 'heal'
        : /cleanse|purify/.test(type) ? 'cleanse'
          : /buff|support/.test(type) ? 'buff'
            : /shield|guard/.test(type) ? 'guard' : 'damage');
  const requestedSide = explicit.targetSide || action.targetSide || explicit.team;
  const targetSide = abilityType === 'defense' ? 'self'
    : ['self', 'ally', 'allies', 'enemy', 'enemies'].includes(requestedSide)
      ? ({ allies: 'ally', enemies: 'enemy' }[requestedSide] || requestedSide)
      : beneficialEffects.has(effect) ? 'ally' : 'enemy';
  const declaredShape = explicit.shape || explicit.pattern
    || (typeof action.targeting === 'string' ? action.targeting : null);
  const shapeAliases = { all: 'group', allies: 'group', enemies: 'group', aoe: 'area', zone: 'area', multiple: 'multi', multitarget: 'multi', ray: 'line' };
  let shape = shapeAliases[declaredShape] || declaredShape;
  const finiteTargets = positive(explicit.maxTargets ?? explicit.targetCount ?? action.maxTargets ?? action.targetCount, 0);
  if (!shape) {
    if (targetSide === 'self') shape = 'single';
    else if (finiteTargets > 1) shape = 'multi';
    else if (beneficialEffects.has(effect) && (abilityType === 'special' || /_aoe|group/.test(type))) shape = 'group';
    else if (/shotgun|cone|spray/.test(type)) shape = 'cone';
    else if (/beam|laser|line/.test(type)) shape = 'line';
    else if (/_aoe|rocket|explosion|vortex/.test(type)) shape = 'area';
    else if (type === 'group') shape = 'group';
    else shape = 'single';
  }
  if (!['single', 'group', 'multi', 'area', 'line', 'cone'].includes(shape)) shape = 'single';
  const melee = explicit.delivery === 'melee' || (explicit.delivery !== 'ranged'
    && (/melee|slash|punch|bite|claw|dodge_strike|drill_smash/.test(type)
      || (!type && abilityType === 'simple' && !/gun|laser|cards|staff|bow/.test(actor.weaponType || actor.weapon || ''))));
  const scale = positive(arena.width, 760) / 760;
  return {
    abilityType,
    name: action.name || abilityType,
    action,
    effect,
    targetSide,
    shape,
    delivery: targetSide === 'self' ? 'self' : beneficialEffects.has(effect) ? 'support' : melee ? 'melee' : 'ranged',
    maxTargets: shape === 'single' ? 1 : finiteTargets || (shape === 'multi' ? 2 : Infinity),
    minTargets: Math.max(1, Math.round(positive(explicit.minTargets, 1))),
    range: positive(explicit.range ?? action.rpgRange, Math.hypot(arena.width || 760, arena.height || 420)),
    areaRadius: positive(explicit.areaRadius ?? explicit.radius ?? action.areaRadius, 105 * scale),
    lineWidth: positive(explicit.lineWidth ?? action.lineWidth, 38 * scale),
    coneAngle: clamp(positive(explicit.coneAngle ?? action.coneAngle, 55), 1, 180),
    multiplier: Math.max(0, Number(action.dmg ?? 1) || 0),
    duration: positive(explicit.duration ?? action.duration ?? action.dur, 3),
    buffMultiplier: positive(explicit.buffMultiplier ?? action.buffMultiplier, 1.2),
    healRatio: positive(explicit.healRatio ?? action.healRatio, 0),
    reviveRatio: clamp(positive(explicit.reviveRatio ?? action.reviveRatio, 0.3), 0.01, 1),
    guardReduce: clamp(Number(explicit.reduce ?? action.reduce ?? 0.4), 0, 0.95),
    cleanses: explicit.cleanses ?? action.cleanses ?? effect === 'cleanse'
  };
}

export function getRpgEligibleTargets({ actor, profile, allies, opponents }) {
  if (!actor || !profile) return [];
  const candidates = profile.targetSide === 'self' ? [actor] : profile.targetSide === 'ally' ? allies : opponents;
  return candidates.filter(unit => {
    if (profile.effect === 'revive') return unit.currentHp <= 0;
    if (unit.currentHp <= 0 || unit.state === 'dead') return false;
    if (profile.effect === 'heal') {
      const cap = unit.statusEffects?.radiated > 0 ? unit.maxHp * 0.5 : unit.maxHp;
      if (unit.currentHp >= cap) return false;
    }
    if (profile.effect === 'cleanse' && !Object.values(unit.statusEffects || {}).some(duration => duration > 0)) return false;
    return true;
  }).filter(unit => Math.hypot(unit.x - actor.x, unit.y - actor.y) <= profile.range + 0.001);
}

export function resolveRpgTargets({ actor, profile, eligibleTargets, selectedTargetIds = [] }) {
  if (!profile || !actor) return { valid: false, reason: 'unavailable', targets: [] };
  const ids = [...new Set(selectedTargetIds)];
  const selected = ids.map(id => eligibleTargets.find(unit => rpgUnitId(unit) === id));
  if (selected.some(unit => !unit)) return { valid: false, reason: 'ineligible-target', targets: [] };
  if (!eligibleTargets.length) return { valid: false, reason: 'no-eligible-target', targets: [] };
  if (profile.shape !== 'group' && (selected.length < profile.minTargets || selected.length > (profile.shape === 'multi' ? profile.maxTargets : 1))) {
    return { valid: false, reason: 'select-target', targets: [] };
  }
  let targets;
  const anchor = selected[0];
  if (profile.shape === 'group') targets = eligibleTargets;
  else if (profile.shape === 'single' || profile.shape === 'multi') targets = selected;
  else if (profile.shape === 'area') targets = eligibleTargets.filter(unit => Math.hypot(unit.x - anchor.x, unit.y - anchor.y) <= profile.areaRadius);
  else {
    const dx = anchor.x - actor.x;
    const dy = anchor.y - actor.y;
    const length = Math.hypot(dx, dy);
    const ux = length > 0 ? dx / length : actor.facing || 1;
    const uy = length > 0 ? dy / length : 0;
    targets = eligibleTargets.filter(unit => {
      const tx = unit.x - actor.x;
      const ty = unit.y - actor.y;
      const along = tx * ux + ty * uy;
      if (along < 0 || along > profile.range) return false;
      const across = Math.abs(tx * uy - ty * ux);
      return profile.shape === 'line' ? across <= profile.lineWidth / 2
        : Math.atan2(across, along) <= profile.coneAngle * Math.PI / 360;
    }).sort((a, b) => Math.hypot(a.x - actor.x, a.y - actor.y) - Math.hypot(b.x - actor.x, b.y - actor.y));
  }
  targets = targets.slice(0, profile.maxTargets);
  return { valid: targets.length > 0, reason: targets.length ? null : 'no-eligible-target', targets, anchor: anchor || targets[0] };
}

// DEF and active guard are distinct multipliers, each applied exactly once.
export function calculateRpgDamage(defender, baseDamage, variance = 1, includeItemShield = true, attacker = null) {
  const defense = getEffectiveCombatDefense(defender, attacker);
  const guard = defender.state === 'defense' ? clamp(Number(defender.defense?.reduce ?? 0.42), 0, 0.95) : 0;
  const supportGuard = defender.rpgGuardTicks > 0 ? clamp(Number(defender.rpgGuardReduce) || 0, 0, 0.95) : 0;
  const damage = Math.max(0, Math.round(Math.max(0, baseDamage) * (100 / (100 + defense)) * (1 - Math.max(guard, supportGuard)) * variance));
  return includeItemShield ? previewBattleItemDamage(defender, damage) : damage;
}
