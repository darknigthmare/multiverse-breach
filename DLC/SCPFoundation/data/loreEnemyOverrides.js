// SCP Foundation — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("SCP Foundation", [
    candidate(
      RIFT_DRONE,
      "SCP-049-2 Instance",
      "Bare hands",
      "grab and blunt strike",
      "Cadavre humain transforme par SCP-049, anime de mouvements simples et violents.",
      "A human corpse altered by SCP-049 and animated with simple, violent movements.",
      "https://scp-wiki.wikidot.com/scp-049",
      "Human corpse altered by SCP-049: surgical incisions, stiff gait and damaged civilian or staff clothing; follow the exact SCP article image when present.",
    ),
    candidate(
      BREACH_STALKER,
      "SCP-939 Instance",
      "Jaws and claws",
      "voice lure then bite",
      "Predateur SCP-939 sans yeux qui imite des voix pour attirer une victime avant de mordre.",
      "An eyeless SCP-939 predator that mimics voices to lure a victim before biting.",
      "https://scp-wiki.wikidot.com/scp-939",
      "Large red quadrupedal predator with exposed-muscle texture, elongated limbs, no visible eyes and a toothed mouth.",
    ),
  ]));
}
