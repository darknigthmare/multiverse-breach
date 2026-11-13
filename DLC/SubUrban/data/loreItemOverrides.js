// Sub Urban — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Sub Urban", "sub_urban", "https://suburban.lnk.to/Cradles", [
    item("Cradles Music Box", "Boite a musique Cradles", "Single dark wooden music box with brass crank and small porcelain cradle figure."),
    item("Black Top Hat", "Haut-de-forme noir", "One tall black top hat with narrow burgundy ribbon and dusty felt texture."),
    item("Porcelain Doll", "Poupee de porcelaine", "Single small cracked porcelain doll in pale vintage dress with glass eyes."),
    item("Funeral Ticket", "Ticket funeraire", "One aged black-cream admission ticket with ornamental border and no readable text."),
  ]));
}
