// Ghost — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Ghost", "ghost_band", "https://shopuk.ghost-official.com/products/grucifix-ghoul-mask", [
    item("Papa Mitre", "Mitre de Papa", "Single tall black-white ceremonial mitre with gold piping and original occult geometry without text."),
    item("Grucifix", "Grucifix", "One black-silver inverted cross-like stage pendant with original proportions and no copied logo."),
    item("Nameless Ghoul Mask", "Masque de Nameless Ghoul", "Single silver horned stage mask with smooth expressionless face and dark eye mesh."),
    item("Thurible", "Encensoir", "One ornate silver censer on a single chain cluster, faint smoke and gothic cutouts."),
  ]));
}
