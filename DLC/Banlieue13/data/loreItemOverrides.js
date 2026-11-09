// Banlieue 13 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Banlieue 13", "banlieue_13", "https://www.imdb.com/title/tt0414852/plotsummary/", [
    item("Neutron Bomb Detonator", "Detonateur de bombe a neutrons", "Single rugged digital detonator with numeric keypad shapes, red switch and no readable text."),
    item("Damien's Badge", "Badge de Damien", "One worn undercover police badge in a black leather holder, no copied seal or lettering."),
    item("Leito's Parkour Shoe", "Chaussure de parkour de Leito", "Single lightweight black urban trainer with reinforced sole and red accent."),
    item("Taha's Pistol", "Pistolet de Taha", "One compact dark semi-automatic pistol with worn grip and no custom markings."),
  ]));
}
