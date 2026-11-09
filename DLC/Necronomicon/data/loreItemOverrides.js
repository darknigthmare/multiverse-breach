// Necronomicon — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Necronomicon", "necronomicon", "https://en.wikipedia.org/wiki/Necronomicon_%28film%29", [
    item("Forbidden Bound Book", "Livre interdit relie", "Single thick forbidden book with cracked dark leather, metal corners and an abstract eye relief."),
    item("Vault Key", "Cle du coffre", "One long antique iron vault key with ornate teeth and oxidized surface."),
    item("Lovecraft's Pen", "Stylo de Lovecraft", "Single black fountain pen with gold nib, worn cap and dried ink stain."),
    item("Ink Bottle", "Flacon d encre", "One squat faceted glass ink bottle filled with near-black violet ink and cork stopper."),
  ]));
}
