// Killer Tomatoes from Outer Space — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Killer Tomatoes from Outer Space", "killer_tomatoes", "https://catalog.afi.com/Film/56192-ATTACK-OFTHEKILLERTOMATOES?cp=1&cxt=Filmography1&pos=1&sid=51558907-02aa-4f93-86a4-7021ddf1e46d&sr=0.09320808", [
    item("Finletter's Parachute", "Parachute de Finletter", "Single folded military parachute pack with olive straps and a small strip of canopy fabric."),
    item("Puberty Love Sheet Music", "Partition Puberty Love", "One loose sheet of music with abstract note marks but no readable title or lyrics."),
    item("Vinyl Record", "Disque vinyle", "Single black 7-inch vinyl record with plain red center label and no lettering."),
    item("Ketchup Bottle", "Bouteille de ketchup", "One generic red squeeze bottle with white cap and no copied label."),
  ]));
}
