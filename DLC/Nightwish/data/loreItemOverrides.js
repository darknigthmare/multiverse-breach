// Nightwish — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Nightwish", "nightwish", "https://www.nightwish.com/releases/imaginaerum", [
    item("Imaginaerum Snow Globe", "Boule a neige Imaginaerum", "One ornate snow globe containing a miniature dark carnival silhouette and blue winter glow."),
    item("Pendulum", "Pendule", "Single brass clock pendulum with long rod and moon-shaped bob."),
    item("Lantern", "Lanterne", "One antique black lantern with warm blue-white flame and frosted glass."),
    item("Closed Score Book", "Livre de partitions ferme", "Single closed dark-blue music score book with silver corner pieces and no readable title."),
  ]));
}
