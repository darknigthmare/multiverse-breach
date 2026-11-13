// Wrong Turn — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Wrong Turn", "wrong_turn", "https://www.yourprops.com/Barb-wire-prop-used-by-original-movie-prop-Wrong-Turn-2003-YP829721.html", [
    item("Barbed-wire Trap", "Piege en fil barbele", "Single coiled barbed-wire snare with rusty hooks and one compact pressure trigger."),
    item("Compound Bow", "Arc a poulies", "One rugged hunting compound bow with dark limbs, cams and olive grip."),
    item("Backroads Map", "Carte des routes secondaires", "One folded paper forest road map with red route line and no readable place names."),
    item("Truck Key", "Cle du camion", "One old ignition key with cracked black plastic bow and small rusty ring."),
  ]));
}
