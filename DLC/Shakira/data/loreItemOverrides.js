// Shakira — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Shakira", "shakira", "https://grammymuseum.org/wp-content/uploads/2023/01/Shakira-exhibit-announce_FINAL.pdf", [
    item("Hip Scarf", "Foulard de hanche", "Single folded red-purple dance hip scarf edged with small gold coins."),
    item("Crystal Gibson Firebird", "Gibson Firebird cristal", "One translucent crystal-like angular electric guitar with silver hardware and no brand."),
    item("Leather Bracelet", "Bracelet en cuir", "Single stacked brown-black leather wrist bracelet with small silver beads."),
    item("Stage Microphone", "Microphone de scene", "One gold handheld concert microphone with dark grille and no branding."),
  ]));
}
