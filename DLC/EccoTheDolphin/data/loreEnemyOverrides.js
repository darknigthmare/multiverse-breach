// Ecco the Dolphin — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Ecco the Dolphin", [
    candidate(
      RIFT_DRONE,
      "Vortex Drone",
      "Carapace claws and autonomous head",
      "grapple, bite and severed-head pursuit",
      "Drone biomecanique Vortex charge de recolter les formes de vie et de defendre la ruche, capable de poursuivre Ecco meme apres avoir perdu son corps.",
      "A biomechanical Vortex worker and hive defender that can continue pursuing Ecco after losing most of its body.",
      "https://eccothedolphin.fandom.com/wiki/Vortex_Drone",
      "Dark green biomechanical arthropod from the original game: tall oval domed head, purple facial cavity, segmented tapering body, two long clawed arms plus smaller limbs, and a narrow tail; no shark body, fish fins, dolphin silhouette, or added metal armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Jellyfish",
      "Stinging tentacles",
      "tentacle sting",
      "Meduse marine dont les tentacules venimeux bloquent le passage d'Ecco.",
      "A marine jellyfish whose stinging tentacles obstruct Ecco's path.",
      "https://eccothedolphin.fandom.com/wiki/Jellyfish",
      "Translucent jellyfish body, trailing tentacles and palette matching the selected Ecco game.",
    ),
  ]));
}
