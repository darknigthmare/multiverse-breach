// Godzilla The Animated Series — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Godzilla The Animated Series", [
    candidate(
      RIFT_DRONE,
      "Cyber Fly",
      "Cybernetic mandibles and wings",
      "cyber fly dive",
      "Insecte cybernetique commande par les Tachyons lors de l'invasion de Monster Wars.",
      "A cybernetic insect controlled by the Tachyons during the Monster Wars invasion.",
      "https://en.wikipedia.org/wiki/Godzilla:_The_Series",
      "Exact Godzilla: The Series Cyber Fly silhouette, metallic insect body, angular translucent wings and red electronic details in the 1998 animated style.",
    ),
    candidate(
      BREACH_STALKER,
      "Giant Mutant Rat",
      "Teeth and claws",
      "sewer pounce",
      "Rat mutant geant affronte par H.E.A.T. et Godzilla dans la serie animee.",
      "A giant mutant rat fought by H.E.A.T. and Godzilla in the animated series.",
      "https://godzilla.fandom.com/wiki/List_of_Godzilla_monsters",
      "Godzilla: The Series giant mutant rat with hunched rodent anatomy, coarse brown-gray fur, oversized incisors and the series' angular creature proportions.",
    ),
    candidate(
      ANOMALY_PACK,
      "Giant Mutant Termite Swarm",
      "Mandibles and burrowing bodies",
      "termite colony rush",
      "Colonie de termites mutantes geantes qui attaque en groupe comme dans la serie.",
      "A colony of giant mutant termites that attacks as a group as depicted in the series.",
      "https://godzilla.fandom.com/wiki/List_of_Godzilla_monsters",
      "Compact cluster of the animated series' giant termites, with pale segmented bodies, dark heads and large mandibles; no unrelated kaiju anatomy.",
    ),
  ]));
}
