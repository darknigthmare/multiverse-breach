// Planete Hurlante — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Planete Hurlante", "planete_hurlante", "https://en.wikipedia.org/wiki/Screamers_%281995_film%29", [
    item("Alliance Rifle", "Fusil de l Alliance", "Single rugged grey sci-fi assault rifle with ribbed barrel shroud and desert wear."),
    item("Alliance ID Tag", "Plaque d identite de l Alliance", "One angular military identity tag on a short chain, scratched metal and no readable data."),
    item("Type 3 Teddy Bear", "Ours en peluche Type 3", "Single dusty brown teddy bear with one damaged eye and subtle mechanical seam."),
    item("Screamer Blade", "Lame de Screamer", "One crescent-shaped autonomous metal blade with serrated edge and compact motor housing."),
  ]));
}
