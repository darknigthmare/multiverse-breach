// Lost Planet 2 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Lost Planet 2", "lost_planet_2", "https://www.videogamemanual.com/xbox360/Lost%20Planet-%20Extreme%20Condition%20Colonies%20Edition.pdf", [
    item("T-ENG Canister", "Reservoir T-ENG", "Cylindrical orange thermal-energy canister with armored caps and glowing amber fluid window."),
    item("Harmonizer Injector", "Injecteur Harmonizer", "Rugged sci-fi medical injector with amber vial, metal grip and insulated needle guard."),
    item("Anchor Gun", "Anchor Gun", "Compact industrial grappling launcher with cable drum, claw head and orange-white snowfield wear."),
    item("Vital Suit Activation Key", "Cle d activation VS", "Heavy electronic vehicle key with angular orange casing and one blue status light."),
  ]));
}
