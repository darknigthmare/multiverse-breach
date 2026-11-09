// House of the Dead — definitions consumed by src/game/loreEnemyOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreEnemyOverrides({ ANOMALY_PACK, BREACH_STALKER, RIFT_DRONE, candidate, defineUniverse }) {
  return (defineUniverse("House of the Dead", [
    candidate(
      RIFT_DRONE,
      "Sam Type A-1",
      "Hands and teeth",
      "lumbering bite",
      "Creature humanoide commune du manoir Curien qui avance lentement puis mord a courte portee.",
      "The common Curien Mansion humanoid creature that advances slowly before biting at close range.",
      "https://thehouseofthedead.fandom.com/wiki/Sam",
      "Exact 1997 Sam Type A-1 game creature: bald decomposed humanoid, original torn clothing and exposed flesh colors, no modern remake redesign, armor or weapon.",
    ),
    candidate(
      BREACH_STALKER,
      "Name Type G-2",
      "Slime spit and teeth",
      "slime projectile swarm",
      "Creature G-2 rare en forme de limace cerebrale qui mord et projette des boules de mucus.",
      "The rare G-2 brain-slug creature that bites and spits slime balls in groups.",
      "https://thehouseofthedead.fandom.com/wiki/Name",
      "Exact original Name Type G-2: dark-pink brain-shaped slug body, sharp long teeth, small pink tentacles and antennae; no humanoid anatomy and no written name label.",
    ),
    candidate(
      ANOMALY_PACK,
      "Kenfis Type F-1",
      "Teeth and pounce",
      "zigzag canine leap",
      "Creature canine F-1 qui charge en zigzag avant de bondir et mordre.",
      "The F-1 canine creature that charges in a zigzag before pouncing and biting.",
      "https://thehouseofthedead.fandom.com/wiki/Kenfis",
      "Exact original Kenfis Type F-1: low eyeless gargoyle-like canine, exposed side ribs, rough gray-brown hide and small leathery wings; never a normal dog or flying dragon.",
    ),
  ]));
}
