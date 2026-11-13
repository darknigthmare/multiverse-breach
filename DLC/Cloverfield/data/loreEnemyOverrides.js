// Cloverfield — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Cloverfield", [
    candidate(
      RIFT_DRONE,
      "Cloverfield Parasite",
      "Long claws and inverted serrated jaws",
      "ceiling leap and venomous bite",
      "Petit parasite tombe du monstre de Cloverfield, assez vif pour bondir sur les survivants.",
      "A small parasite shed by the Cloverfield monster, fast enough to leap onto survivors.",
      "https://wikizilla.org/wiki/Human_Scale_Parasite",
      "Dog-sized pale ivory crustacean-like parasite with a low narrow carapace, many very long thin jointed legs, four pairs of tiny black eyes, and an enormous vertically opening serrated jaw with a blue-purple membrane; never a compact beetle or tick.",
    ),
  ]));
}
