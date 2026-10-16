// Tactical support uses the same authored effects as RPG, but grid distances,
// occupied revival cells and line-of-sight remain tactical rules.
import { getRpgActionProfile } from './rpgTargeting.js';
import { getCombatHealingAmount, applyCombatHealing } from './combatHealing.js';
import { getRpgCleansableStatuses, cleanseRpgStatuses, getRpgReviveHp } from './rpgSupport.js';

const EFFECTS = new Set(['heal', 'cleanse', 'revive', 'buff', 'guard']);
const records = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const finite = (value, fallback) => Number.isFinite(Number(value)) ? Number(value) : fallback;

export function getTacticsSupportProfile(unit, actionType) {
  const action = unit?.[actionType];
  if (!action || typeof action !== 'object') return null;
  // Classic shield/dodge defence retains the existing self-guard command.
  if (actionType === 'defense' && !/heal|restore|regen|cleanse|purify|reviv|buff|support/.test(action.type || '')) return null;
  const explicit = Object.assign({}, records(unit.tacticsAttacks?.[actionType]), records(action.targeting),
    records(action.tactics), records(action.attackProfile), records(action.tacticsProfile));
  Object.assign(explicit, records(explicit.targeting));
  if (typeof action.targeting === 'string' && !explicit.shape) explicit.shape = action.targeting;
  const key = actionType === 'defense' ? 'simple' : actionType;
  const source = { ...unit, rpgAttacks: undefined, [key]: { ...action, targeting: explicit, attackProfile: undefined, rpgProfile: undefined } };
  const profile = getRpgActionProfile(source, key);
  if (!profile || !EFFECTS.has(profile.effect) || profile.targetSide === 'enemy') return null;
  const self = actionType === 'defense' || profile.targetSide === 'self';
  const range = self ? 0 : Math.max(0, finite(explicit.range ?? action.tacticsRange ?? action.range, actionType === 'special' ? 5 : 3));
  return { ...profile, actionType, action, targetSide: self ? 'self' : 'ally',
    delivery: 'support', shape: self ? 'single' : profile.shape,
    range, minRange: 0, areaRadius: Math.max(0, finite(explicit.areaRadius ?? explicit.radius, 1)),
    requiresLineOfSight: explicit.requiresLineOfSight ?? (explicit.lineOfSight !== false),
    blocksOnUnits: false, pierceObstacles: explicit.pierceObstacles === true };
}

export function getTacticsSupportAmount(actor, target, profile) {
  return profile.healRatio ? target.maxHp * profile.healRatio : Math.max(0, finite(actor?.stats?.atk ?? actor?.atk, 0) * profile.multiplier);
}

export function getTacticsSupportCandidates(engine, actor, profile) {
  if (!actor || !profile || !Number.isFinite(actor.currentHp) || actor.currentHp <= 0 || actor.state === 'dead') return [];
  const source = actor._tacticsSourceUnit || actor;
  const allies = engine.heroes.includes(source) ? engine.heroes : engine.enemies.includes(source) ? engine.enemies : [];
  const candidates = profile.targetSide === 'self' ? allies.filter(u => u === source) : allies;
  return candidates.filter(unit => {
    if (!Number.isFinite(unit.currentHp) || !Number.isFinite(unit.maxHp) || unit.maxHp <= 0
      || !engine.isInsideGrid(unit.gridX, unit.gridY)) return false;
    const distance = Math.abs(unit.gridX - actor.gridX) + Math.abs(unit.gridY - actor.gridY);
    if (distance > profile.range || !engine.hasLineOfSight(actor, unit, profile)) return false;
    if (profile.effect === 'revive') return getRpgReviveHp(unit, profile.reviveRatio) > 0
      && engine.canOccupyCell(unit, unit.gridX, unit.gridY);
    if (unit.currentHp <= 0 || unit.state === 'dead') return false;
    const cleanses = getRpgCleansableStatuses(unit, profile.cleanses).length;
    if (profile.effect === 'heal') return getCombatHealingAmount(unit, getTacticsSupportAmount(actor, unit, profile)) > 0 || cleanses > 0;
    if (profile.effect === 'cleanse') return cleanses > 0;
    if (profile.effect === 'buff') return !(unit.tacticsBuffTicks > 0) || unit.tacticsBuffMultiplier < profile.buffMultiplier || cleanses > 0;
    if (profile.effect === 'guard') return !(unit.tacticsGuardTicks > 0) || unit.tacticsGuardReduce < profile.guardReduce || cleanses > 0;
    return false;
  });
}

export function resolveTacticsSupport(engine, actor, actionType, anchor) {
  const profile = getTacticsSupportProfile(actor, actionType);
  if (!profile || !anchor || !engine.isInsideGrid(anchor.gridX, anchor.gridY)) return [];
  const distance = Math.abs(anchor.gridX - actor.gridX) + Math.abs(anchor.gridY - actor.gridY);
  if (distance > profile.range || !engine.hasLineOfSight(actor, anchor, profile)) return [];
  const candidates = getTacticsSupportCandidates(engine, actor, profile);
  const atAnchor = unit => unit.gridX === anchor.gridX && unit.gridY === anchor.gridY;
  let targets;
  if (profile.shape === 'group') targets = candidates;
  else if (profile.shape === 'area') targets = candidates.filter(u => Math.max(Math.abs(u.gridX - anchor.gridX), Math.abs(u.gridY - anchor.gridY)) <= profile.areaRadius);
  else if (profile.shape === 'line') {
    const cells = engine.getCellsOnLine(actor, anchor);
    targets = candidates.filter(unit => cells.some(cell => cell.x === unit.gridX && cell.y === unit.gridY));
  } else if (profile.shape === 'cone') {
    const dx = anchor.gridX - actor.gridX, dy = anchor.gridY - actor.gridY;
    const length = Math.hypot(dx, dy);
    targets = candidates.filter(unit => {
      const ux = unit.gridX - actor.gridX, uy = unit.gridY - actor.gridY;
      const distance = Math.hypot(ux, uy);
      return length > 0 && distance > 0 && (ux * dx + uy * dy) / (distance * length) >= Math.cos(profile.coneAngle * Math.PI / 360);
    });
  } else if (profile.shape === 'multi') {
    if (!candidates.some(atAnchor)) return [];
    targets = [...candidates].sort((a, b) => Number(atAnchor(b)) - Number(atAnchor(a))
      || Math.abs(a.gridX - anchor.gridX) + Math.abs(a.gridY - anchor.gridY) - Math.abs(b.gridX - anchor.gridX) - Math.abs(b.gridY - anchor.gridY));
  } else targets = candidates.filter(atAnchor);
  return targets.slice(0, profile.maxTargets).map(unit => ({ unit, type: engine.heroes.includes(unit) ? 'hero' : 'enemy',
    cell: { x: unit.gridX, y: unit.gridY }, effect: profile.effect, profile,
    amount: profile.effect === 'heal' ? getCombatHealingAmount(unit, getTacticsSupportAmount(actor, unit, profile))
      : profile.effect === 'revive' ? getRpgReviveHp(unit, profile.reviveRatio) : 0,
    cleanses: getRpgCleansableStatuses(unit, profile.cleanses) }));
}

export function applyTacticsSupport(actor, entry) {
  const { unit, profile } = entry;
  let amount = 0;
  if (profile.effect === 'heal') amount = applyCombatHealing(unit, getTacticsSupportAmount(actor, unit, profile));
  else if (profile.effect === 'revive') {
    amount = getRpgReviveHp(unit, profile.reviveRatio);
    if (!amount) return { amount: 0, cleansed: 0 };
    unit.currentHp = amount; unit.state = 'idle'; unit.stateTimer = 0;
    cleanseRpgStatuses(unit, true);
  } else if (profile.effect === 'buff') {
    const previous = unit.tacticsBuffTicks > 0 ? unit.tacticsBuffMultiplier : 1;
    unit.tacticsBuffTicks = Math.max(unit.tacticsBuffTicks || 0, Math.round(profile.duration * 60));
    unit.tacticsBuffMultiplier = Math.max(previous || 1, profile.buffMultiplier);
  } else if (profile.effect === 'guard') {
    const previous = unit.tacticsGuardTicks > 0 ? unit.tacticsGuardReduce : 0;
    unit.tacticsGuardTicks = Math.max(unit.tacticsGuardTicks || 0, Math.round(profile.duration * 60));
    unit.tacticsGuardReduce = Math.max(previous || 0, profile.guardReduce);
  }
  // Keep the shared, documented heal-then-cleanse order.
  return { amount, cleansed: cleanseRpgStatuses(unit, profile.cleanses) };
}

export function tickTacticsSupport(unit) {
  if (unit.tacticsBuffTicks > 0) unit.tacticsBuffTicks--;
  if (unit.tacticsGuardTicks > 0) unit.tacticsGuardTicks--;
}
export const getTacticsSupportDamageMultiplier = unit => unit?.tacticsBuffTicks > 0 && Number.isFinite(unit.tacticsBuffMultiplier)
  ? Math.max(0, unit.tacticsBuffMultiplier) : 1;
export const getTacticsSupportGuard = unit => unit?.tacticsGuardTicks > 0 && Number.isFinite(unit.tacticsGuardReduce)
  ? Math.max(0, Math.min(0.95, unit.tacticsGuardReduce)) : 0;
