// Rugrats — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Rugrats", "rugrats", "https://nickelodeon.fandom.com/wiki/Cynthia", [
    item("Reptar Doll", "Poupee Reptar", "Single green cartoon dinosaur toy with purple back plates and soft vinyl texture."),
    item("Cynthia Doll", "Poupee Cynthia", "Single fashion doll with uneven blonde hair, pink dress and one missing shoe."),
    item("Tommy's Screwdriver", "Tournevis de Tommy", "One small yellow-handled flat screwdriver with rounded child-safe cartoon proportions."),
    item("Baby Bottle", "Biberon", "Single clear baby bottle filled with milk, blue cap and measurement marks without numbers."),
  ]));
}
