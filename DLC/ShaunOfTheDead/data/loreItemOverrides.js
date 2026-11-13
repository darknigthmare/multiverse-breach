// Shaun of the Dead — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Shaun of the Dead", "shaun_dead", "https://propstore.com/movie/shaun-of-the-dead-2004", [
    item("Cricket Bat", "Batte de cricket", "Single worn willow cricket bat with taped handle and light pub-floor grime."),
    item("Winchester Pint", "Pinte du Winchester", "One clear pub pint glass filled with amber beer and a small foam head, no logo."),
    item("Foree Electronics Badge", "Badge Foree Electronics", "Single clipped employee badge with red-blue blocks and no readable company name."),
    item("Vinyl Record", "Disque vinyle", "One black vinyl record in a plain sleeve with a small torn corner, no copied cover art."),
  ]));
}
