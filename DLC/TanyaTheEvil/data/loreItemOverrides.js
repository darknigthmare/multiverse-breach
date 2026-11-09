// Tanya the Evil — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Tanya the Evil", "tanya_the_evil", "https://youjo-senki.jp/tv/", [
    item("Type-95 Computation Orb", "Orbe de calcul Type-95", "Single jeweled four-core computation orb in brass housing with pale blue magical light."),
    item("Mage Rifle", "Fusil de mage", "One wood-and-steel imperial bolt-action rifle fitted with a compact magical computation sight."),
    item("Silver Wings Assault Badge", "Insigne Silver Wings", "Single silver winged military badge with central gemstone and no readable text."),
    item("Imperial Dog Tags", "Plaques imperiales", "One pair of dark imperial identity tags on a chain, stamped texture without legible writing."),
  ]));
}
