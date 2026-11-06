// Ecco the Dolphin — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Ecco the Dolphin", "ecco", "https://manuals.sega.com/genesismini/pdf/ECCO_THE_DOLPHIN.pdf", [
    item("Key Glyph", "Glyphe-cle", "Tall narrow Atlantean crystalline device with pointed faceted ends, pale lavender rim and deep blue-violet inner channel."),
    item("Barrier Glyph", "Glyphe-barriere", "Tall Atlantean crystal surrounded by the circular blue-violet force field that blocks Ecco until a Key Glyph empowers him."),
    item("Invincibility Glyph", "Glyphe d invincibilite", "Rare pale lavender Atlantean crystal emitting a compact halo of blue-violet sparks that grants temporary invincibility."),
    item("Clam", "Palourde", "Natural ridged Shelled One opened horizontally and releasing one healing air bubble when Ecco sings to it."),
  ]));
}
