// Prey — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Prey",
    "prey-feral-predator",
    "Feral Predator",
    "duelist",
    "Prey (2022) - Great Plains 1719",
    "https://avp.fandom.com/wiki/Feral_Predator",
    "The 1719 Feral Predator with bone mask, primitive armor, shield, spear and bolt gun; no modern plasma caster.",
    [
      phase("forest-hunt", "Bolt gun", "Retractable shield", "Spear combo"),
      phase("mud-trap", "Bear trap", "Mask removal", "Redirected bolt finish"),
    ],
    { renderHeight: 204 },
  ));
}
