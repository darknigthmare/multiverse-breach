// Man with a Mission — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Man with a Mission", "man_with_mission", "https://www.sonymusic.co.jp/artist/manwithamission/profile/", [
    item("Wolf Mask", "Masque de loup", "Single realistic grey wolf stage mask with open jaw, fur texture and dark eye mesh."),
    item("Military Dog Tags", "Plaques militaires", "One pair of worn steel dog tags on a black cord, no readable personal data."),
    item("Stage Guitar", "Guitare de scene", "Single black-red electric guitar with angular body and no copied brand."),
    item("DJ Deck", "Platine DJ", "One compact black DJ controller with twin jog wheels and colored pads without labels."),
  ]));
}
