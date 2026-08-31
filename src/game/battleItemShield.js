const positive = value => Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : 0;

// Pickup protection is a separate, battle-local pool. It absorbs direct hits
// until depleted or battle exit, never heals HP and never stacks above max HP.
export function grantBattleItemShield(actor, amount) {
  if (!actor || actor.currentHp <= 0) return 0;
  const before = positive(actor.battleItemShield);
  const cap = positive(actor.maxHp || actor.stats?.hp || actor.hp || actor.currentHp);
  actor.battleItemShield = Math.min(cap, Math.max(before, positive(amount)));
  return Math.max(0, actor.battleItemShield - before);
}

export const previewBattleItemDamage = (actor, damage) => Math.max(0, positive(damage) - positive(actor?.battleItemShield));

export function absorbBattleItemDamage(actor, damage) {
  const raw = positive(damage);
  if (!actor) return raw;
  const shield = positive(actor.battleItemShield);
  const absorbed = Math.min(shield, raw);
  actor.battleItemShield = shield - absorbed;
  return raw - absorbed;
}
