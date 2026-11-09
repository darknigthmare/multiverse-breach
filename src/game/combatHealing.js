// Radiation limits healing, but must never turn a heal into damage or revival.
export function getCombatHealingAmount(target, amount) {
  if (!target || !Number.isFinite(target.currentHp) || target.currentHp <= 0 || !Number.isFinite(amount)) return 0;
  const maxHp = Number(target.maxHp);
  if (!Number.isFinite(maxHp) || maxHp <= 0) return 0;
  const cap = target.statusEffects?.radiated > 0 ? maxHp * 0.5 : maxHp;
  return Math.max(0, Math.min(cap - target.currentHp, Math.round(amount)));
}

export function applyCombatHealing(target, amount) {
  const gained = getCombatHealingAmount(target, amount);
  if (gained > 0) target.currentHp += gained;
  return gained;
}
