// Digimon Celestial Rift — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Digimon Celestial Rift", "digimon_celestial", "https://toy.bandai.co.jp/manuals/files/2648482.pdf?ver=sf7ii9", [
    item("Digivice", "Digivice", "Single compact handheld evolution device with rounded white casing, blue screen and colored buttons."),
    item("Crest of Light", "Crest of Light", "One small golden crest tag with a sun-like light emblem and no lettering."),
    item("Holy Ring", "Anneau sacre", "Single thick golden sacred ring with subtle engraved bands and white radiance."),
    item("Berenjena Gun", "Pistolet Berenjena", "One purple-black demonic handgun with organic curves and silver barrel details."),
  ]));
}
