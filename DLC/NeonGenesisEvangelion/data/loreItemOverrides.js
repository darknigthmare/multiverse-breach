// Neon Genesis Evangelion — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Neon Genesis Evangelion", "neon_genesis_evangelion", "https://www.evangelion.jp/", [
    item("Progressive Knife", "Progressive Knife", "Single original-TV EVA-01 Progressive Knife: complete oversized dark gunmetal Bowie blade, clipped point, thick angular spine and compact purple-black mechanical handle with restrained acid-green inserts."),
    item("NERV Access Card", "Carte d acces NERV", "Single original-series personnel access card: rigid off-white rectangular card with clipped corner, black and deep-red security bands, metallic contact strip and blank data blocks, no portrait, logo or readable characters."),
    item("S-DAT Player", "Lecteur S-DAT", "Single original-series portable digital audio tape player: compact dark indigo rectangular casing, small blank green monochrome LCD, narrow cassette window and tactile side controls, no headphones, cord, logo, letters or numbers."),
    item("LCL-Filled Entry Plug", "Entry Plug remplie de LCL", "Single complete original-TV 2015-type Entry Plug capsule: long tapered off-white cylindrical shell, rounded red-orange end collars, dark mechanical seams and one small amber window revealing orange LCL, no pilot, markings or readable text."),
  ]));
}
