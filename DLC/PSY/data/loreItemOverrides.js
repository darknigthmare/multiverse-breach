// PSY — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("PSY", "psy", "https://abcnews.go.com/Entertainment/Music/south-korean-rapper-psys-gangnam-style-viral/story?id=16996559", [
    item("Black Sunglasses", "Lunettes noires", "Single pair of glossy black rounded sunglasses with thick temples."),
    item("Blue Bow Tie", "Noeud papillon bleu", "One bright blue satin bow tie with compact formal knot."),
    item("Prop Horse Head", "Tete de cheval factice", "Single theatrical brown horse-head prop with synthetic mane and clearly artificial finish."),
    item("Stage Microphone", "Microphone de scene", "One black handheld pop microphone with silver grille and no branding."),
  ]));
}
