// Atarashii Gakko — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Atarashii Gakko", "atarashii_gakko", "https://atarashiigakko-themovie.jp/", [
    item("Leader Armband", "Brassard de leader", "Single red-white school leader armband laid flat, no copied characters or readable text."),
    item("Megaphone", "Megaphone", "One compact red-white school megaphone with black handle and no printed logo."),
    item("Uwabaki Shoe", "Chaussure uwabaki", "Single white Japanese indoor school shoe with blue toe cap and rubber sole."),
    item("School Whistle", "Sifflet scolaire", "One silver school whistle on a short red cord, clean metal reflections."),
  ]));
}
