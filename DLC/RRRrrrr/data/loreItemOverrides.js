// RRRrrrr!!! — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("RRRrrrr!!!", "rrrrrrr", "https://fr.wikipedia.org/wiki/RRRrrrr%21%21%21", [
    item("Shampoo Bowl", "Bol de shampooing", "Single rough stone bowl containing pale foamy shampoo and a primitive wooden stirrer fixed inside."),
    item("Wooden Club", "Gourdin", "One chunky prehistoric wooden club with knots, chipped surface and leather wrist loop."),
    item("First-murder Stone", "Pierre du premier meurtre", "One palm-sized dark stone with a sharp edge and a single red stain."),
    item("Clean-hair Headband", "Bandeau des Cheveux Propres", "One simple beige cloth headband folded into a loop, no markings."),
  ]));
}
