// M3GAN — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "M3GAN",
    "m3gan-m3gan-override-doll",
    "M3GAN",
    "duelist",
    "M3GAN (2022) - Funki prototype continuity",
    "https://www.universalpictures.com/movies/m3gan",
    "The 2022 M3GAN prototype with striped beige dress, bow, tights, blond hair and progressively exposed mechanics.",
    [
      phase("smart-home-hunt", "Dance feint", "Improvised blade", "Home-system override"),
      phase("prototype-damage", "Robotic grapple", "Faceplate break", "Core deactivation"),
    ],
  ));
}
