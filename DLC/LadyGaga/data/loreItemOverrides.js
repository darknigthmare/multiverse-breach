// Lady Gaga — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Lady Gaga", "lady_gaga", "https://www.ladygaga.com/us-en/music/telephone-with-beyonce", [
    item("Disco Stick", "Disco Stick", "Single chrome crystal-tipped performance wand with faceted transparent head and black grip."),
    item("Telephone Glasses", "Lunettes Telephone", "One pair of angular black sunglasses decorated with small metallic chain links."),
    item("Chromatica Armor Piece", "Piece d armure Chromatica", "Single pink-silver sculpted shoulder armor plate with spikes and iridescent finish."),
    item("Red Stage Microphone", "Microphone rouge", "One metallic red handheld concert microphone with dark grille and no branding."),
  ]));
}
