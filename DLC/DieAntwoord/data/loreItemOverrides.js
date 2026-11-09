// Die Antwoord — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Die Antwoord", "die_antwoord", "https://en.wikipedia.org/wiki/Die_Antwoord", [
    item("Ninja Cap-mask", "Casquette-masque de Ninja", "Single black-white performance cap with attached lower-face cloth and original geometric marks."),
    item("Yo-Landi Platform Shoe", "Chaussure plateforme de Yo-Landi", "One oversized white-black platform sneaker with thick stacked sole."),
    item("Stage Microphone", "Microphone de scene", "Single white handheld rap microphone with black grille and no branding."),
    item("Chappie Prop Pistol", "Pistolet accessoire de Chappie", "One bright stylized prop pistol with white-pink casing, clearly non-real finish and no text."),
  ]));
}
