// Les Tuche — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Les Tuche", "tuche", "https://en.wikipedia.org/wiki/Les_Tuche", [
    item("Lottery Ticket", "Ticket de loterie", "Single creased lottery ticket with colored number boxes but no readable numbers or brand."),
    item("Fries Cone", "Cornet de frites", "One paper cone filled with golden fries, generic red-white paper and no logo."),
    item("Bouzolles Football Scarf", "Echarpe de football de Bouzolles", "Single folded blue-red supporter scarf with simple stripes and no readable club name."),
    item("Monaco Bow Tie", "Noeud papillon de Monaco", "One oversized formal bow tie in bright luxury colors with satin highlights."),
  ]));
}
