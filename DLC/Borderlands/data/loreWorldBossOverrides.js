// Borderlands — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Borderlands",
    "borderlands-the-destroyer-vault-maw",
    "The Destroyer",
    "stationary",
    "Borderlands (2009) - Vault finale",
    "https://borderlands.fandom.com/wiki/The_Destroyer",
    "The Borderlands 1 Destroyer anchored in the opened Vault, with a central eye and independently animated tentacles.",
    [
      phase("vault-emergence", "Tentacle sweep", "Corrosive projectile", "Guardian reinforcement"),
      phase("eye-exposure", "Eye weak point", "Tentacle sever", "Vault closure"),
    ],
    { renderHeight: 410, footprint: { width: 3, height: 3, placement: "anchored" } },
  ));
}
