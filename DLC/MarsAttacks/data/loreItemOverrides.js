// Mars Attacks — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Mars Attacks", "mars_attacks", "https://screencraft.org/wp-content/uploads/2019/11/MarsAttacks.pdf", [
    item("Martian Ray Gun", "Pistolet a rayons martien", "Single retro-futurist silver ray gun with transparent green chamber and red emitter tip."),
    item("Martian Bubble Helmet", "Casque-bulle martien", "One clear glass dome helmet with silver neck ring and green atmosphere valves."),
    item("Translation Device", "Appareil de traduction", "Single compact Martian translator box with chrome grille, colored lights and no readable controls."),
    item("Slim Whitman Record", "Disque de Slim Whitman", "One black vinyl record in a plain western-themed sleeve with no copied portrait, logo or text."),
  ]));
}
