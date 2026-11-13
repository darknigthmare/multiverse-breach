// Zombies Ate My Neighbors — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Zombies Ate My Neighbors", [
    candidate(
      RIFT_DRONE,
      "Zombie",
      "Hands and teeth",
      "grab and bite",
      "Zombie suburbain du jeu SNES qui avance bras tendus pour saisir et mordre.",
      "A suburban SNES zombie that advances with outstretched arms to grab and bite.",
      "https://zombiesatemyneighbors.fandom.com/wiki/Zombie",
      "Green-grey suburban zombie in torn everyday clothing, arms forward, matching the SNES enemy sprite.",
    ),
    candidate(
      BREACH_STALKER,
      "Chainsaw Maniac",
      "Two-handed chainsaw",
      "chainsaw rush",
      "Maniaque masque qui poursuit les voisins en chargeant avec sa tronconneuse a deux mains.",
      "A masked maniac who chases the neighbors with a two-handed chainsaw rush.",
      "https://zombiesatemyneighbors.fandom.com/wiki/Chainsaw_Maniac",
      "Large masked human in work clothes holding a two-handed chainsaw; use the exact SNES palette and mask.",
    ),
    candidate(
      ANOMALY_PACK,
      "Evil Doll",
      "Canonical handheld toy weapon",
      "leaping toy strike",
      "Poupee miniature hostile qui bondit en brandissant l'arme montree par son sprite d'origine.",
      "A hostile miniature doll that leaps while wielding the weapon shown by its original sprite.",
      "https://zombiesatemyneighbors.fandom.com/wiki/Evil_Doll",
      "Tiny hostile doll with toy proportions, painted face and the exact handheld weapon shown in the game.",
    ),
  ]));
}
