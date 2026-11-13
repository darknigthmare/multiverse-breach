// Earthworm Jim — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Earthworm Jim", "earthworm_jim", "https://r.mprd.se/Sega%20CD/Manuals/Earthworm%20Jim%20-%20Special%20Edition%20%28U%29.pdf", [
    item("Plasma Blaster", "Blaster plasma", "Cartoon sci-fi blaster with a bulbous silver barrel, blue accents and oversized trigger guard."),
    item("Super Suit Collar", "Col du Super Suit", "Single thick white powered-suit collar with blue-grey inner padding and red fastener."),
    item("Pocket Rocket", "Pocket Rocket", "Compact silver-red cartoon rocket with one saddle-like grip and a bright rear nozzle."),
    item("Life Atom", "Atome de vie", "Single glowing atomic pickup made of a bright core and three clean orbiting pixel rings."),
  ]));
}
