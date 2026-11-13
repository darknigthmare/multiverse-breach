// Siren Head — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createPolicySpecs({ finalPolicy }) {
  return (finalPolicy(
    "Siren Head",
    null,
    "nonCombatFinal",
    "Siren Head - Trevor Henderson source continuity",
    "Detruire les relais de mimetisme sonore puis atteindre l'extraction sans engager un duel de boxe.",
    "Destroy the sound-mimic relays, then reach extraction without entering a boxing-style duel.",
    "La menace fonctionne par traque, son et echelle; sa survie finale n'exige pas une barre de vie.",
    "The threat works through stalking, sound and scale; its survival finale does not require a health bar.",
    ["https://trevorhenderson.fandom.com/wiki/Siren_Head"],
    "Extremely tall emaciated rust-brown humanoid with twin sirens at distant scales, forest, pylons and audio telegraph layers.",
  ));
}
