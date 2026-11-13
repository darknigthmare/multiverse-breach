// Sausage Party — definitions consumed by src/game/loreWorldBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCombatSpecs({ boss, phase }) {
  return (boss(
    "Sausage Party",
    "sausage-party-great-beyond-kitchen-grinder",
    "Douche",
    "large",
    "Sausage Party (2016) - supermarket finale",
    "https://sausageparty.fandom.com/wiki/Douche",
    "The blue-grey douche product with nozzle, rubber body and inflated final form; Darren and kitchen appliances remain separate hazards.",
    [
      phase("supermarket-hunt", "Nozzle ram", "Shelf charge", "Product absorption"),
      phase("overfilled-form", "Crushing slam", "Liquid spray", "Pressure rupture"),
    ],
  ));
}
