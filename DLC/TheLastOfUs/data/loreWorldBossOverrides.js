// The Last of Us — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "The Last of Us",
    "the-last-of-us-bloater-spore-nest",
    "Rat King",
    "large",
    "The Last of Us Part II - Seattle hospital",
    "https://thelastofus.fandom.com/wiki/Rat_king",
    "The Rat King as a fused mass of infected bodies with distinct limbs and Stalker component in the hospital basement, never a Bloater nest.",
    [
      phase("hospital-basement", "Mass charge", "Wall break", "Acid spore throw"),
      phase("stalker-separation", "Detached Stalker ambush", "Grab", "Fire vulnerability"),
    ],
  ));
}
