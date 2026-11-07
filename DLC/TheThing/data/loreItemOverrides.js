// The Thing — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("The Thing", "the_thing", "https://www.imdb.com/title/tt0084787/plotsummary", [
    item("Blood-test Petri Dish", "Boite de Petri du test sanguin", "Single clear Petri dish holding one dark red blood sample on a metal tray insert."),
    item("Heated Copper Wire", "Fil de cuivre chauffe", "One bent copper wire loop glowing orange at the tip with insulated clamp handle."),
    item("Flamethrower", "Lance-flammes", "Single improvised Antarctic flamethrower with metal fuel canister, hose and rifle-like nozzle."),
    item("Whisky Bottle", "Bouteille de whisky", "One square amber whisky bottle with plain cream label shape and no copied brand text."),
  ]));
}
