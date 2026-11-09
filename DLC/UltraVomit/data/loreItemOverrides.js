// Ultra Vomit — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Ultra Vomit", "ultravomit", "https://www.sugeguitare.fr/guitares/sg-ultra-vomit-fetus/", [
    item("Fetus SG Guitar", "Guitare SG Fetus", "Single custom double-cut electric guitar with vivid original creature graphic and no copied logo."),
    item("Stage Frying Pan", "Poele de scene", "One battered black frying pan used as a stage prop, silver handle and comic dents."),
    item("Stage Microphone", "Microphone de scene", "One black handheld metal microphone with silver grille and no branding."),
    item("Parody Guitar Pick", "Mediator parodique", "One oversized yellow-black guitar pick with an original comic face and no text or logo."),
  ]));
}
