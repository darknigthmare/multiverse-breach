// Team Fortress 2 — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Team Fortress 2", [
    candidate(
      RIFT_DRONE,
      "Heavy",
      "Sasha minigun",
      "minigun burst",
      "Mercenaire lourd qui verrouille une zone avec les rafales de sa mitrailleuse Sasha.",
      "A heavy mercenary who locks down an area with bursts from his minigun, Sasha.",
      "https://wiki.teamfortress.com/wiki/Heavy",
      "Large broad RED or BLU mercenary, sleeveless team shirt, ammo belt, fingerless gloves and minigun Sasha.",
    ),
    candidate(
      BREACH_STALKER,
      "Soldier",
      "Rocket launcher",
      "rocket shot",
      "Mercenaire equipe d'un lance-roquettes qui avance sous ses propres explosions.",
      "A rocket-launcher mercenary who advances under the pressure of his own explosions.",
      "https://wiki.teamfortress.com/wiki/Soldier",
      "Team-colored military coat, steel helmet covering the eyes, grenades on chest and shoulder-fired rocket launcher.",
    ),
    candidate(
      ANOMALY_PACK,
      "Spy",
      "Butterfly knife and revolver",
      "backstab or revolver shot",
      "Assassin infiltre qui alterne tir au revolver, deguisement et coup de couteau dans le dos.",
      "An infiltrating assassin who alternates revolver fire, disguise and backstabs.",
      "https://wiki.teamfortress.com/wiki/Spy",
      "Slim team-colored suit, balaclava, leather gloves, revolver and butterfly knife; optional disguise mask only.",
    ),
  ]));
}
