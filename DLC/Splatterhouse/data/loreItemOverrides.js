// Splatterhouse — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Splatterhouse", "splatterhouse", "https://dds.konami.com/games/manual/pcemini/en_Splatter.pdf", [
    item("Terror Mask", "Terror Mask", "Single cracked white hockey-like mask with narrow eye slots, red markings and aged straps."),
    item("Shotgun", "Fusil a pompe", "One worn pump-action shotgun with wooden stock and dark steel barrel."),
    item("Two-by-Four Plank", "Madrier 2x4", "Single splintered wooden construction plank stained by damp basement grime."),
    item("Meat Cleaver", "Couperet", "One heavy rectangular butcher cleaver with chipped steel blade and dark wooden handle."),
  ]));
}
