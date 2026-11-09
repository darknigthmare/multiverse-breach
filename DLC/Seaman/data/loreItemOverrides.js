// Seaman — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Seaman", "seaman", "https://www.digitpress.com/library/manuals/dreamcast/seaman.pdf", [
    item("Dreamcast Microphone", "Microphone Dreamcast", "Single grey console microphone module with short stem, round grille and controller connector."),
    item("Seaman Egg", "Oeuf de Seaman", "One mottled aquatic egg with leathery shell, translucent veins and damp organic sheen."),
    item("Seaman Shell", "Coquille de Seaman", "Single rough spiral aquarium shell with muted sand-grey ridges and chipped opening."),
    item("Food Pellet", "Granule de nourriture", "One compact brown aquarium food pellet with a slightly porous cylindrical surface."),
  ]));
}
