// Earthworm Jim — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Earthworm Jim",
    "earthworm-jim-psy-crow-queen-slug-for-a-butt",
    "Queen Slug-for-a-Butt",
    "large",
    "Earthworm Jim - Buttville finale",
    "https://earthwormjim.fandom.com/wiki/Queen_Slug-for-a-Butt",
    "Queen Slug-for-a-Butt as the enormous fleshy insect-slug ruler in her absurd throne chamber, with Psy-Crow excluded from the body.",
    [
      phase("buttville-throne", "Body slam", "Larva spit", "Cage hazard"),
      phase("queen-rage", "Tongue lash", "Platform crush", "Princess rescue opening"),
    ],
  ));
}
