// Overlord Anime — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Overlord Anime", [
    candidate(
      RIFT_DRONE,
      "Sunlight Scripture Soldier",
      "Scripture unit weapon shown in the reference",
      "formation weapon attack",
      "Soldat de la Sunlight Scripture combattant en formation avec l'arme attribuee a son unite.",
      "A Sunlight Scripture soldier who fights in formation with the weapon assigned to the unit.",
      "https://overlordmaruyama.fandom.com/wiki/Sunlight_Scripture",
      "Slane Theocracy scripture unit member in the exact white religious military uniform/armor and insignia shown in the anime; carry the shown weapon only.",
    ),
    candidate(
      BREACH_STALKER,
      "Archangel Flame",
      "Flaming sword",
      "flaming sword dive",
      "Invocation angelique blindee qui plonge sur l'ennemi avec son epee enflammee.",
      "An armored angelic summon that dives onto enemies with a flaming sword.",
      "https://overlordmaruyama.fandom.com/wiki/Archangel_Flame",
      "Armored angelic summon with white wings, bright plate armor and flaming sword as shown in the anime.",
    ),
  ]));
}
