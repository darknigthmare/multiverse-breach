// Indila — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Indila", "indila", "https://www.universal-music.de/indila/videos/derniere-danse-335045", [
    item("White Umbrella", "Parapluie blanc", "Single folded white vintage umbrella with slender dark shaft and curved handle."),
    item("Snow Globe", "Boule a neige", "One small glass snow globe containing a miniature Parisian rooftop silhouette."),
    item("Stage Microphone", "Microphone de scene", "One elegant silver handheld vocal microphone with dark grille and no logo."),
    item("Music-box Key", "Cle de boite a musique", "Single ornate brass winding key with curled bow and short square stem."),
  ]));
}
