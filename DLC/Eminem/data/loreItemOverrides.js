// Eminem — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Eminem", "eminem", "https://www.eminem.com/news/cyber-monday-additions-on-the-eminem-store/", [
    item("Hockey Mask", "Masque de hockey", "Single off-white hockey mask with small ventilation holes, black straps and restrained red marks."),
    item("Prop Chainsaw", "Tronconneuse factice", "One theatrical compact chainsaw with orange casing, blunt silver bar and stage wear."),
    item("Cassette Tape", "Cassette audio", "Single clear audio cassette with black reels and blank white label."),
    item("Stage Microphone", "Microphone de scene", "One black handheld rap microphone with silver grille and no branding."),
  ]));
}
