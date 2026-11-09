// Moonwalker — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Moonwalker", [
    candidate(
      RIFT_DRONE,
      "Mr. Big Thug",
      "Fists or handgun",
      "punch or handgun shot",
      "Homme de main de Mr. Big qui se bat a coups de poing ou avec l'arme montree dans son niveau.",
      "One of Mr. Big's henchmen, fighting with punches or the handgun shown for his stage variant.",
      "https://gamefaqs.gamespot.com/genesis/586315-michael-jacksons-moonwalker/faqs/53524",
      "Human gangster from the Sega game; dark suit, fedora or stage-specific street outfit; fists or handgun only when shown by the referenced enemy set.",
    ),
    candidate(
      BREACH_STALKER,
      "Attack Dog",
      "Jaws",
      "running bite",
      "Chien de garde de Mr. Big qui traverse rapidement l'ecran pour mordre.",
      "One of Mr. Big's guard dogs, sprinting across the stage to bite its target.",
      "https://gamefaqs.gamespot.com/genesis/586315-michael-jacksons-moonwalker/faqs/53524",
      "Four-legged guard dog used by Mr. Big; dark coat, visible collar, low attack posture.",
    ),
    candidate(
      ANOMALY_PACK,
      "Zombie",
      "Claws and hands",
      "claw swipe and grab",
      "Cadavre du cimetiere de Moonwalker qui avance lentement avant de griffer et saisir.",
      "A Moonwalker graveyard corpse that shambles forward before clawing and grabbing.",
      "https://www.mobygames.com/game/7432/michael-jacksons-moonwalker/",
      "Moonwalker graveyard enemy: grey-green corpse, torn clothing, raised arms and slow shambling gait.",
    ),
  ]));
}
