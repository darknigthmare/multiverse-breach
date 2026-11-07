// Mass Effect — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Mass Effect",
    "mass-effect-human-reaper-larva-node",
    "Sovereign",
    "capitalShip",
    "Mass Effect (2007) - Battle of the Citadel",
    "https://masseffect.fandom.com/wiki/Sovereign",
    "Sovereign as the black Reaper capital ship anchored to the Citadel, with long appendages, shield, beam and separable weak points.",
    [
      phase("citadel-assault", "Capital beam", "Geth fighter screen", "Shield cycle"),
      phase("saren-link-break", "Possessed Saren sub-phase", "Anchor rupture", "Fleet finishing strike"),
    ],
  ));
}
