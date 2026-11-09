// SCP Foundation — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("SCP Foundation", "scp", "https://scp-wiki.wikidot.com/scp-500", [
    item("SCP-500 Bottle", "Flacon SCP-500", "Single small white medicine bottle holding red pills, plain label shapes and no copied text."),
    item("SCP-714 Ring", "Anneau SCP-714", "One smooth green jade ring with heavy muted sheen and no inscription."),
    item("Level 4 Keycard", "Carte d acces niveau 4", "Single dark facility keycard with orange stripe and abstract clearance blocks, no readable text."),
    item("Scranton Reality Anchor", "Ancre de realite Scranton", "One compact industrial reality anchor with steel frame, coils and pale blue central emitter."),
  ]));
}
