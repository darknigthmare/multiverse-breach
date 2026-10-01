// Presentation for the six source-locked kits. These small combat effects are
// game abstractions, not approval of any character sprite or film choreography.
import { emitP0CanonAttackEffect, getP0HeroSourceId, resolveP0CanonAttackEffect } from './canonP0AttackEffects.js';
const SOURCE_KITS = new Set([
  'han_solo', 'luke', 'vader', 'bob_minions', 'kevin_minions', 'stuart_minions'
]);

export const getCanonHeroSourceId = getP0HeroSourceId;

export function resolveCanonHeroAttackEffect(actor, actionOrType) {
  const p0Effect = resolveP0CanonAttackEffect(actor, actionOrType);
  if (p0Effect) return p0Effect;
  const sourceId = getCanonHeroSourceId(actor);
  const action = typeof actionOrType === 'string' ? actor?.[actionOrType] : actionOrType;
  if (!SOURCE_KITS.has(sourceId) || !action) return null;
  if (action.type === 'gravity') {
    return { kind: /choke/i.test(action.name || '') ? 'forceChoke' : 'telekinesis', color: '#aeb4b9', sfx: 'shield' };
  }
  if (sourceId === 'han_solo' && ['bullet', 'projectile'].includes(action.type)) {
    return { kind: 'blaster', color: '#ff4136', sfx: 'shoot' };
  }
  if (['bob_minions', 'kevin_minions'].includes(sourceId) && action.type === 'projectile') {
    return { kind: 'banana', color: '#f4d74d', sfx: 'jump' };
  }
  if (sourceId === 'stuart_minions' && /sound|music/.test(action.type || '')) {
    return { kind: 'music', color: '#cf2a25', sfx: 'special' };
  }
  if (action.type === 'melee') {
    return { kind: 'melee', color: actor.weaponColor || '#e2e2e2', sfx: ['luke', 'vader'].includes(sourceId) ? 'slash' : 'hit' };
  }
  return null;
}

export function emitCanonHeroAttackEffect(particles, actor, target, actionOrType) {
  const p0Effect = resolveP0CanonAttackEffect(actor, actionOrType);
  if (p0Effect) return emitP0CanonAttackEffect(particles, actor, target, p0Effect);
  const effect = resolveCanonHeroAttackEffect(actor, actionOrType);
  if (!effect || !particles?.add) return false;
  const destination = target || { x: actor.x + (actor.facing || 1) * 60, y: actor.y };
  const dx = destination.x - actor.x;
  const dy = destination.y - actor.y;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const ux = dx / distance;
  const uy = dy / distance;
  if (effect.kind === 'blaster') {
    particles.add(actor.x + ux * 15, actor.y - 12 + uy * 15, ux * 8, uy * 8, effect.color, 4, Math.max(12, Math.ceil(distance / 8)), 'laser_line');
  } else if (effect.kind === 'banana') {
    particles.add(actor.x + ux * 15, actor.y - 12 + uy * 15, ux * 8, uy * 8, effect.color, 12, Math.max(12, Math.ceil(distance / 8)), 'banana');
  } else if (effect.kind === 'music') {
    particles.add(actor.x, actor.y - 24, ux * 4, uy * 4, effect.color, 20, Math.max(18, Math.ceil(distance / 4)), 'music');
  } else if (effect.kind === 'telekinesis') {
    // Moving debris near the selected target, without an electrical beam.
    particles.add(destination.x - 10, destination.y - 24, 0.6, -0.5, effect.color, 4, 18, 'spark');
    particles.add(destination.x + 10, destination.y - 18, -0.6, -0.4, effect.color, 3, 18, 'spark');
  } else if (effect.kind === 'forceChoke') {
    // The Force itself has no visible ray; only a restrained target cue.
    particles.add(destination.x, destination.y - 30, 0, -0.15, effect.color, 2, 18, 'spark');
  } else {
    particles.add(destination.x, destination.y - 18, 0, 0, effect.color, 4, 12, 'spark');
  }
  return true;
}
