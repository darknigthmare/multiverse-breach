// Gorillaz — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Gorillaz", "gorillaz", "https://wmg.jp/gorillaz/profile/", [
    item("Noodle's Guitar", "Guitare de Noodle", "Single slim red-black electric guitar with anime-band wear and no copied brand."),
    item("2-D's Melodica", "Melodica de 2-D", "One compact blue keyboard melodica with flexible black mouth tube and no logo."),
    item("Murdoc's Bass", "Basse de Murdoc", "Single dark green-black bass guitar with pointed body and tarnished metal hardware."),
    item("Plastic Beach Key", "Cle de Plastic Beach", "One large weathered brass island key with coral-like bow and pink plastic fragment."),
  ]));
}
