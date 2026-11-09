// Items and field effects use the same encounter protection as normal attacks.
// A handled hit may deal zero damage; it must never fall through to raw HP loss.
import { absorbBattleItemDamage } from './battleItemShield.js';

export function applyEncounterOrDirectDamage(engine, actor, damage, context = {}) {
  const before = Number(actor?.currentHp);
  const amount = Number(damage);
  if (!actor || !Number.isFinite(before) || before <= 0 || !Number.isFinite(amount) || amount <= 0) return 0;
  const floor = context.nonlethal ? 1 : 0;
  if (engine?.applyEncounterDamage?.(actor, amount, { ...context, directDamage: true }) !== true) {
    const appliedAmount = context.absorbBattleItemShield ? absorbBattleItemDamage(actor, amount) : amount;
    actor.currentHp = Math.max(floor, before - appliedAmount);
  }
  if (actor.currentHp <= 0) actor.state = 'dead';
  return Math.max(0, before - actor.currentHp);
}
