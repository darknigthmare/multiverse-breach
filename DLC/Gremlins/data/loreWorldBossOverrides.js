// Gremlins — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Gremlins",
    "gremlins-stripe-gremlin-swarm",
    "Stripe",
    "duelist",
    "Gremlins (1984) - department store finale",
    "https://gremlins.fandom.com/wiki/Stripe",
    "Stripe with his distinct white mohawk, green skin and film-seen props; other Gremlins are separate reinforcements.",
    [
      phase("department-store", "Shelf ambush", "Firearm burst", "Chainsaw pressure"),
      phase("fountain", "Electric sign hazard", "Water threat", "Sunlight defeat"),
    ],
  ));
}
