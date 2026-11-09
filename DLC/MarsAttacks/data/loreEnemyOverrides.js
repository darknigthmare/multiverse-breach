// Mars Attacks — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("Mars Attacks", [
    candidate(
      RIFT_DRONE,
      "Martian Soldier",
      "Ray gun",
      "ray-gun shot",
      "Fantassin martien au cerveau expose qui desintegre les humains avec son pistolet a rayons.",
      "An exposed-brain Martian infantryman who disintegrates humans with a ray gun.",
      "https://marsattacks.fandom.com/wiki/Martian_Soldier",
      "Small Martian with exposed oversized green brain, skull-like face, glass helmet, red cape/space uniform and ray gun.",
    ),
  ]));
}
