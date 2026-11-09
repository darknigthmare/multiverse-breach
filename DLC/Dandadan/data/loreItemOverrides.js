// Dandadan — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Dandadan", "dandadan", "https://anime-dandadan.com/", [
    item("Turbo Granny Maneki-neko", "Maneki-neko Turbo Granny", "Single white lucky-cat figure with Turbo Granny's wide grin, red bib and raised paw."),
    item("Golden Ball", "Boule doree", "One smooth supernatural golden sphere with a warm aura and clean reflective surface."),
    item("Seiko's Bat", "Batte de Seiko", "Single worn wooden baseball bat wrapped near the grip with talisman paper lacking readable text."),
    item("Okarun's Glasses", "Lunettes d Okarun", "Single pair of black rectangular school glasses with thick rims and clear lenses."),
  ]));
}
