import { isMediGunProfileWave17 } from './combat/sourceMechanicsWave17.js';
import { isSourceBubbleCaptureProfileWave17, isSourceBubbleCaptureTargetEligibleWave17 } from './combat/sourceBubbleCaptureWave17.js';
// RPG targeting is intentionally pure: preview, manual confirmation and AI all
// resolve the same identities, without spending resources or choosing at random.
import { getRpgCleansableStatuses, getRpgReviveHp } from './rpgSupport.js';
import { previewBattleItemDamage } from './battleItemShield.js';
import { getEffectiveCombatDefense } from './combatStatPreparation.js';
import { resolveCombatAbility, resolveUniverseSummon } from './combatIdentity.js';
import { isPhaselockProfile, isPhaselockTargetEligible } from './combat/combatControlWave15.js';
import { isSourceControlProfileWave16 } from './combat/combatControlWave16.js';
import { canSourceControlTargetWave16, getPossessedSligActionWave16 } from './combat/sourceCombatRuntimeWave16.js';
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const positive = (value, fallback) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
export const rpgUnitId = unit => unit?.battleId || unit?.runtimeId || unit?.id;
const beneficialEffects = new Set(['heal', 'revive', 'buff', 'guard', 'cleanse']);

// These six current source locks already own explicit mode contracts. Their
// RPG commands retain raw RPG shapes/ranges rather than Smash pixel profiles.
const CURRENT_INLINE_RPG_SOURCES = Object.freeze({
  han_solo: ['Star Wars', 'Star Wars: A New Hope (1977) - Mos Eisley / Death Star escape'],
  luke: ['Star Wars', 'Star Wars: Return of the Jedi (1983) - Death Star II Jedi Knight'],
  vader: ['Star Wars', 'Star Wars: The Empire Strikes Back (1980) - Bespin Sith Lord'],
  bob_minions: ['Minions', 'Minions (2015) - Bob, London crown-heist adventure'],
  kevin_minions: ['Minions', 'Minions (2015) - Kevin, London crown-heist adventure'],
  stuart_minions: ['Minions', 'Minions (2015) - Stuart, London rock-star finale']
});
const hasCurrentInlineRpgSource = actor => {
  const id = actor?.sourceHeroId || actor?.sourceId || actor?.id;
  const source = CURRENT_INLINE_RPG_SOURCES[id], universe = actor?.sourceUniverse || actor?.universe;
  return !!source && universe === source[0] && actor.universe === universe && actor.incarnation === source[1]
    && Array.isArray(actor.equipment) && actor.equipment.length > 0 && typeof actor.referenceUrl === 'string';
};

// The command label and the actual RPG resolver share the same authored action.
// Unlisted actors keep their exact supplied ability object and custom metadata.
export function getRpgCombatantAbility(actor, abilityType) {
  const supplied = actor?.[abilityType];
  if (supplied && (actor.rpgAttacks?.[abilityType] || supplied.rpgProfile || hasCurrentInlineRpgSource(actor))) return supplied;
  if (['simple', 'secondary', 'defense', 'special'].includes(abilityType)) {
    const authored = resolveCombatAbility(actor, abilityType);
    if (authored?.provenance?.identityAuthored) return authored.sourceAbility;
  }
  return actor?.[abilityType] || null;
}

export function getRpgActionProfile(actor, abilityType, side = 'player', arena = {}, suppliedAction = null) {
  const enemyFallbacks = {
    simple: { name: 'Attack', type: /gun|laser|bullet|projectile/.test(actor?.weapon || '') ? 'bullet' : 'melee', dmg: 1 },
    secondary: { name: 'Strong attack', type: 'bullet', dmg: 1.45, cd: 3 },
    special: { name: 'Special', type: 'group', dmg: 1.15, targeting: { shape: 'group' } }
  };
  if (!['simple', 'secondary', 'special', 'defense', 'summon'].includes(abilityType)) return null;
  // An invocation is a separate command. It never aliases an actor's existing
  // secondary or special, including their medical and defensive semantics.
  const summon = abilityType === 'summon' ? resolveUniverseSummon(actor) : null;
  const possessedAction = getPossessedSligActionWave16(actor, abilityType);
  const action = suppliedAction || (possessedAction ? { ...possessedAction, sourceSligRifle: true } : abilityType === 'summon' ? summon?.action
    : getRpgCombatantAbility(actor, abilityType) || (side === 'enemy' ? enemyFallbacks[abilityType] : null));
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
  const defensiveEffect = beneficialEffects.has(declaredEffect) ? declaredEffect : /heal|restore|regen/.test(type) ? 'heal' : 'guard';
  const effect = abilityType === 'defense' ? defensiveEffect : declaredEffect || loreEffect
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
  const declaredDelivery = ['melee', 'ranged', 'projectile', 'beam', 'area', 'radial', 'control', 'support', 'self'].includes(explicit.delivery);
  const melee = explicit.delivery === 'melee' || (!declaredDelivery
    && (/melee|slash|punch|bite|claw|dodge_strike|drill_smash/.test(type)
      || (!type && abilityType === 'simple' && !/gun|laser|cards|staff|bow/.test(actor.weaponType || actor.weapon || ''))));
  const scale = positive(arena.width, 760) / 760;
  const authoredMeleeApproach = action !== actor?.[abilityType] && melee && effect === 'damage';
  return {
    abilityType,
    summon,
    sourceHeroId: summon?.sourceHeroId || actor.sourceHeroId || actor.sourceId || actor.id,
    universe: actor.universe,
    name: action.name || abilityType,
    action,
    effect,
    targetSide,
    excludeSelf: explicit.excludeSelf === true || action.sourceMediGunWave17===true,
    shape,
    delivery: targetSide === 'self' ? 'self' : beneficialEffects.has(effect) ? 'support'
      : effect === 'control' && explicit.delivery === 'control' ? 'control' : explicit.delivery === 'radial' ? 'radial' : melee ? 'melee' : 'ranged',
    maxTargets: shape === 'single' ? 1 : finiteTargets || (shape === 'multi' ? 2 : Infinity),
    minTargets: explicit.delivery === 'radial' ? 0 : Math.max(1, Math.round(positive(explicit.minTargets, 1))),
    // Authored melee range describes contact after the existing RPG approach.
    // It must not prevent selecting an opponent in the opposing formation.
    range: action.sourceMediGunWave17===true&&actor.universe==='Team Fortress 2'&&(actor.sourceHeroId||actor.sourceId||actor.id)==='team_fortress_2_medic'?220:authoredMeleeApproach ? Math.hypot(arena.width || 760, arena.height || 420)
      : positive(explicit.range ?? action.rpgRange, Math.hypot(arena.width || 760, arena.height || 420)),
    areaRadius: positive(explicit.areaRadius ?? explicit.radius ?? action.areaRadius, 105 * scale),
    lineWidth: positive(explicit.lineWidth ?? action.lineWidth, 38 * scale),
    coneAngle: clamp(positive(explicit.coneAngle ?? action.coneAngle, 55), 1, 180),
    multiplier: Math.max(0, Number(action.dmg ?? 1) || 0),
    controlKind: effect === 'control' ? explicit.controlKind || null : null,
    controlDuration: effect === 'control' ? clamp(positive(explicit.controlDuration ?? explicit.duration, 2.4), 1 / 60, 5) : 0,
    controlTurns: effect === 'control' ? 1 : 0,
    ...(explicit.authorization ? { authorization: explicit.authorization } : {}),
    ...(explicit.channelDuration ? { channelDuration: explicit.channelDuration } : {}),
    ...(explicit.requiresExplicitTargetEligibility !== undefined ? { requiresExplicitTargetEligibility: explicit.requiresExplicitTargetEligibility } : {}),
    ...(explicit.nonlethal === true ? {nonlethal:true} : {}),
    ...(explicit.hitSequence ? { hitSequence: structuredClone(explicit.hitSequence) } : {}),
    ...(explicit.postSequenceStunDuration ? { postSequenceStunDuration: explicit.postSequenceStunDuration } : {}),
    ...(explicit.invulnerabilityKind ? { invulnerabilityKind: explicit.invulnerabilityKind,
      invulnerabilityDuration: explicit.invulnerabilityDuration ?? explicit.duration } : {}),
    ...(explicit.shieldKind ? { shieldKind: explicit.shieldKind, shieldHits: explicit.shieldHits } : {}),
    ...(explicit.counterKind ? { counterKind: explicit.counterKind,
      counterWindowDuration: explicit.counterWindowDuration, counterMultiplier: explicit.counterMultiplier,
      counterRange: explicit.counterRange, counterRequiresIncomingContact: explicit.counterRequiresIncomingContact } : {}),
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
    if (!unit || !Number.isFinite(unit.currentHp) || !Number.isFinite(unit.maxHp) || unit.maxHp <= 0) return false;
    if (profile.excludeSelf) {
      const performerId = profile.summon?.performerRole === 'reinforcement' ? profile.summon.sourceHeroId : null;
      if (performerId ? (unit.sourceHeroId || unit.sourceId || unit.id) === performerId : unit === actor) return false;
    }
    if (profile.effect === 'revive') return getRpgReviveHp(unit, profile.reviveRatio) > 0;
    if (unit.currentHp <= 0 || unit.state === 'dead') return false;
    if (profile.effect === 'control') {
      if (isSourceBubbleCaptureProfileWave17(profile)) { if(!isSourceBubbleCaptureTargetEligibleWave17(profile,unit))return false; }
      else if (isSourceControlProfileWave16(profile)) {
        if (!canSourceControlTargetWave16(actor, unit, profile)) return false;
      } else if (!isPhaselockProfile(profile) || !isPhaselockTargetEligible(unit) || unit.rpgControlTicks > 0) return false;
    }
    if (profile.effect === 'heal') {
      const cap = unit.statusEffects?.radiated > 0 ? unit.maxHp * 0.5 : unit.maxHp;
      if (unit.currentHp >= cap && !isMediGunProfileWave17(profile) && !getRpgCleansableStatuses(unit, profile.cleanses).length) return false;
    }
    if (profile.effect === 'cleanse' && !getRpgCleansableStatuses(unit, profile.cleanses).length) return false;
    return true;
  }).filter(unit => Math.hypot(unit.x - actor.x, unit.y - actor.y) <= profile.range + 0.001);
}

export function resolveRpgTargets({ actor, profile, eligibleTargets, selectedTargetIds = [] }) {
  if (!profile || !actor) return { valid: false, reason: 'unavailable', targets: [] };
  if (!Array.isArray(selectedTargetIds)) return { valid: false, reason: 'invalid-selection', targets: [] };
  const ids = [...new Set(selectedTargetIds)];
  const selected = ids.map(id => eligibleTargets.find(unit => rpgUnitId(unit) === id));
  if (selected.some(unit => !unit)) return { valid: false, reason: 'ineligible-target', targets: [] };
  if (!eligibleTargets.length) return { valid: false, reason: 'no-eligible-target', targets: [] };
  if (profile.delivery !== 'radial' && profile.shape !== 'group' && (selected.length < profile.minTargets || selected.length > (profile.shape === 'multi' ? profile.maxTargets : 1))) {
    return { valid: false, reason: 'select-target', targets: [] };
  }
  let targets;
  const anchor = selected[0];
  if (profile.delivery === 'radial') targets = eligibleTargets.filter(unit => Math.hypot(unit.x - actor.x, unit.y - actor.y) <= Math.min(profile.range, profile.areaRadius) + .001);
  else if (profile.shape === 'group') targets = eligibleTargets;
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
