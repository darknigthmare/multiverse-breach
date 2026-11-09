// Event power-ups have independent clocks. Reusing one refreshes its duration;
// distinct sources multiply without ever changing a unit's prepared stats.
const EVENT_BUFFS = Object.freeze({
  quad_damage: Object.freeze({ ticks: 600, damage: 2, speed: 1 }),
  magia_erebea: Object.freeze({ ticks: 900, damage: 1.5, speed: 1.2 })
});

export function grantCombatEventBuff(unit, effect) {
  const definition = EVENT_BUFFS[effect];
  if (!definition || !unit || unit.currentHp <= 0) return false;
  unit.combatEventBuffs ||= {};
  unit.combatEventBuffs[effect] = definition.ticks;
  return true;
}

export function tickCombatEventBuffs(unit) {
  for (const effect of Object.keys(unit?.combatEventBuffs || {})) {
    const remaining = Math.max(0, (Number(unit.combatEventBuffs[effect]) || 0) - 1);
    if (remaining > 0) unit.combatEventBuffs[effect] = remaining;
    else delete unit.combatEventBuffs[effect];
  }
}

function getEventMultiplier(unit, stat) {
  return Object.entries(unit?.combatEventBuffs || {}).reduce((multiplier, [effect, remaining]) => (
    remaining > 0 ? multiplier * (EVENT_BUFFS[effect]?.[stat] || 1) : multiplier
  ), 1);
}

export const getCombatEventDamageMultiplier = unit => getEventMultiplier(unit, 'damage');
export const getCombatEventSpeedMultiplier = unit => getEventMultiplier(unit, 'speed');
