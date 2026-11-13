// Stargate — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Stargate",
    "stargate-anubis-flagship-nexus",
    "Anubis Mothership",
    "capitalShip",
    "Stargate SG-1 season 6 - Full Circle",
    "https://www.rdanderson.com/stargate/lexicon/entries/anubissweapon.htm",
    "Anubis's dark pyramidal Goa'uld mothership with the six Eyes as distinct modules, shield, batteries and exposed reactor.",
    [
      phase("orbital-shield", "Staff-cannon batteries", "Fighter launch", "Shield pulse"),
      phase("eyes-superweapon", "Superweapon charge", "Hardpoint barrage", "Reactor sabotage"),
    ],
    { renderHeight: 468, anchor: { x: 0.64, y: 0.3 } },
  ));
}
