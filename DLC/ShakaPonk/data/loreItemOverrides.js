// Shaka Ponk — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Shaka Ponk", "shaka_ponk", "https://www.shakaponk.com/", [
    item("Goz Figure", "Figurine de Goz", "Single small stylized digital-ape figure with black fur, neon goggles and original pose."),
    item("Stage Goggles", "Lunettes de scene", "One pair of chunky black performance goggles with green lenses and side vents."),
    item("Stage Microphone", "Microphone de scene", "One black-green handheld rock microphone with silver grille and no branding."),
    item("Electric Guitar", "Guitare electrique", "Single red-black electric guitar with distressed body and no copied logo."),
  ]));
}
