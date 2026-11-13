// Naruto — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Naruto", "naruto", "https://naruto-official.com/en/anime/naruto1/list/01_228", [
    item("Konoha Forehead Protector", "Bandeau frontal de Konoha", "Single original-series Konohagakure forehead protector: brushed silver plate with four rivets and centered engraved Leaf spiral emblem, fixed to a folded dark navy cloth band with tied ends."),
    item("Shinobi Kunai", "Kunai shinobi", "Single standard original-series kunai with a matte dark leaf-shaped triangular blade, short wrapped handle and large circular ring pommel, no fantasy ornament or duplicate weapon."),
    item("Scroll of Seals", "Rouleau des Sceaux", "Single oversized sealed scroll from Naruto's first mission: heavy pale parchment cylinder, dark green end caps, thick binding straps and cord, with only the small canonical Japanese title label."),
    item("Kakashi Bell Test Bells", "Cloches de l epreuve de Kakashi", "Exactly two small polished brass training bells, each suspended from a short bright red cord joined loosely at the top, matching Team 7's original survival test."),
  ]));
}
