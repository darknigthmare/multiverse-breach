// Pee-wee — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Pee-wee", [
    candidate(
      RIFT_DRONE,
      "Satan's Helpers Biker",
      "Motorcycle chain and bar furniture",
      "biker bar charge",
      "Membre du gang de motards menace par la chute de ses motos avant la danse de Pee-wee.",
      "A member of the biker gang angered by the fallen motorcycles before Pee-wee's dance.",
      "https://catalog.afi.com/Film/67303-PEE-WEES-BIGADVENTURE",
      "1985 outlaw biker from Satan's Helpers in film-accurate black leather, denim and boots, using grounded bar props; no demonic powers or fantasy armor.",
    ),
    candidate(
      BREACH_STALKER,
      "Warner Bros. Studio Guard",
      "Security baton",
      "soundstage pursuit",
      "Agent de securite du studio qui poursuit Pee-wee lorsqu'il recupere son velo sur le plateau.",
      "A studio security guard who pursues Pee-wee after he recovers his bicycle on the set.",
      "https://en.wikipedia.org/wiki/Pee-wee%27s_Big_Adventure",
      "Ordinary 1985 movie-studio security guard in period uniform with cap and baton, matching the chase sequence; no police tactical armor.",
    ),
    candidate(
      ANOMALY_PACK,
      "Movie-Set Godzilla Performer",
      "Rubber suit tail and body check",
      "soundstage monster stumble",
      "Cascadeur en costume de Godzilla traverse par Pee-wee pendant sa fuite a travers les plateaux du studio.",
      "A performer in a Godzilla suit crossed by Pee-wee during the chase through the studio sets.",
      "https://www.imdb.com/title/tt0089791/fullcredits/",
      "Clearly human-scale rubber movie-monster suit and visible practical-costume proportions from the 1985 soundstage gag; not a real kaiju and no atomic breath.",
    ),
  ]));
}
