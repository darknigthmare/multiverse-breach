// Tommy Heavenly6 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Tommy Heavenly6", "tommy_heavenly", "https://www.sonymusic.co.jp/artist/Tommyheavenly6/discography/", [
    item("Gothic Top Hat", "Haut-de-forme gothique", "Single small black top hat with red ribbon, lace veil and silver safety pin."),
    item("Gothic Rabbit Doll", "Lapin gothique", "One black-white stuffed rabbit with stitched eye, tiny cross patch and red bow."),
    item("Red Guitar", "Guitare rouge", "Single glossy red electric guitar with black pickguard and no copied brand."),
    item("Candy-cross Pendant", "Pendentif bonbon-croix", "One red-white candy-like cross pendant on a black ribbon, original geometry and no text."),
  ]));
}
