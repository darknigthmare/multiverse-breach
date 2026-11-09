// Fullmetal Alchemist — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Fullmetal Alchemist", "fullmetal_alchemist", "https://fullmetalalchemistusa.com/introduction/", [
    item("Transmutation Chalk", "Craie de transmutation", "Single thick white field chalk stick used to draw alchemical arrays, squared worn tip, blue-grey mineral dust embedded in its surface and no drawn circle, writing or loose duplicate chalk."),
    item("State Alchemist Pocket Watch", "Montre d Alchimiste d Etat", "Single closed silver State Alchemist pocket watch with a short attached chain, heavy polished lid and restrained raised geometric relief without copied crest, inscription, numerals or readable text."),
    item("Automail Maintenance Kit", "Kit d entretien automail", "Single compact closed automail maintenance case: worn blue-grey steel shell, reinforced corners, brown leather carry grip, two secure latches and no loose tools, letters or emblem."),
    item("Philosopher's Stone", "Pierre Philosophale", "Exactly one irregular faceted crimson Philosopher's Stone with a dense blood-red core, contained internal glow and glassy mineral edges, no vial, pedestal, circle or second gem."),
  ]));
}
