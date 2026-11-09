// Family Guy — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Family Guy", "family_guy", "https://familyguy.fandom.com/wiki/Rupert", [
    item("Pawtucket Beer Can", "Canette de biere Pawtucket", "Single generic cartoon beer can with red-white bands and no copied brand name."),
    item("Stewie's Ray Gun", "Pistolet a rayons de Stewie", "One bulbous grey-blue cartoon ray gun with red antenna tip and oversized trigger."),
    item("Rupert Teddy Bear", "Ours Rupert", "Single worn brown teddy bear with simple button eyes, rounded ears and stitched paws."),
    item("Peter's Glasses", "Lunettes de Peter", "Single pair of round wire-frame glasses with thick clear lenses and no face."),
  ]));
}
