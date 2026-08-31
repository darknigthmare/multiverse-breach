// GameCanvas supplies final preparation stats. Raw engine callers remain valid,
// but each archetype bonus belongs only to members of its matching category.
export function resolveArchetypeCombatStats(hero, activeSynergies = []) {
  const stats = { ...hero.stats };
  if (hero.archetypeSynergiesPrepared === true) return stats;
  activeSynergies.filter(rule => rule.category === hero.category).forEach(rule => {
    Object.entries(rule.multiplier || {}).forEach(([stat, multiplier]) => {
      if (!Number.isFinite(stats[stat]) || !Number.isFinite(multiplier)) return;
      const value = stats[stat] * multiplier;
      stats[stat] = ['hp', 'atk', 'def', 'spd'].includes(stat) ? Math.round(value) : value;
    });
  });
  return stats;
}

// Critical Edge already supplies +20% ATK during preparation. Its separate
// direct-hit perk ignores exactly 20% of DEF, never guard, cover or shields.
export function getEffectiveCombatDefense(defender, attacker = null) {
  const defense = Math.max(0, Number(defender?.stats?.def ?? defender?.def ?? 0) || 0);
  return defense * (attacker?.talent === 'critical_edge' ? 0.8 : 1);
}
