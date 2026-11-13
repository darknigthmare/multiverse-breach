// Overlord Anime — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Overlord Anime", "overlord_anime", "https://overlordmaruyama.fandom.com/wiki/Staff_of_Ainz_Ooal_Gown", [
    item("Staff of Ainz Ooal Gown", "Sceptre d Ainz Ooal Gown", "Single ornate black-gold staff crowned by seven colored serpent-held gems."),
    item("Ring of Nazarick", "Anneau de Nazarick", "One heavy gold signet ring with a dark central crest and no copied lettering."),
    item("Red Healing Potion", "Potion de soin rouge", "Single small faceted glass vial filled with vivid red potion and sealed by a cork."),
    item("Momonga's Red Orb", "Orbe rouge de Momonga", "One large polished crimson orb with deep internal glow and dark metal setting."),
  ]));
}
