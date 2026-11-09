// Zombies Ate My Neighbors — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Zombies Ate My Neighbors", "zombies_neighbors", "https://segaretro.org/images/e/ed/Zombies_Ate_My_Neighbors_MD_US_Manual.pdf", [
    item("Water Pistol", "Pistolet a eau", "Single colorful plastic water pistol with oversized blue reservoir and red nozzle."),
    item("Soda Can", "Canette de soda", "One bright arcade soda can with generic color bands and no copied brand text."),
    item("Pandora's Box", "Boite de Pandore", "Single ornate dark box with gold corners and eerie violet light leaking from the lid."),
    item("Bazooka", "Bazooka", "One chunky olive shoulder-fired launcher with simple sights and 16-bit proportions."),
  ]));
}
