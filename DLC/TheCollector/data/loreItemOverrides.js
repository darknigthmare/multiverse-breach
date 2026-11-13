// The Collector — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("The Collector", "collector", "https://en.wikipedia.org/wiki/The_Collector_%282009_film%29", [
    item("Collector Mask", "Masque du Collector", "Single dark stitched leather mask with narrow eye openings and metal fasteners."),
    item("Red Trunk", "Malle rouge", "One heavy red travel trunk with brass corners, black straps and multiple locks."),
    item("Bear Trap", "Piege a machoires", "Single open steel bear trap with toothed jaws, chain and trigger plate."),
    item("Insect Display Box", "Boite d exposition d insectes", "One shallow glass specimen box containing pinned insect silhouettes without labels."),
  ]));
}
