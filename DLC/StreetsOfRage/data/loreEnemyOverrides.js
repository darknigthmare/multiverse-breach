// Streets of Rage — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Streets of Rage", [
    candidate(
      RIFT_DRONE,
      "Galsia",
      "Fists or knife",
      "punch or knife charge",
      "Voyou commun du Syndicat qui frappe a mains nues ou charge avec un couteau selon sa variante.",
      "A common Syndicate thug who punches bare-handed or charges with a knife, depending on the variant.",
      "https://streetsofrage.fandom.com/wiki/Galsia",
      "Common Syndicate thug: denim vest and jeans, black shirt, boots; knife only for the armed variant.",
    ),
    candidate(
      BREACH_STALKER,
      "Signal",
      "Unarmed grappling",
      "slide kick and throw",
      "Punk mobile du Syndicat qui glisse sous les attaques avant d'enchainer une projection.",
      "A mobile Syndicate punk who slides under attacks before following with a throw.",
      "https://streetsofrage.fandom.com/wiki/Signal",
      "Mohawk punk in bright street clothing; low slide stance and judo throw animation.",
    ),
    candidate(
      ANOMALY_PACK,
      "Donovan",
      "Fists",
      "uppercut",
      "Voyou muscle specialise dans l'uppercut, dangereux contre les attaques aeriennes.",
      "A muscular thug whose signature uppercut punishes aerial attacks.",
      "https://streetsofrage.fandom.com/wiki/Donovan",
      "Bald muscular thug, sleeveless top and trousers; upright boxing posture with signature uppercut.",
    ),
  ]));
}
