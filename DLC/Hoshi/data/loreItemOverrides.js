// Hoshi — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Hoshi", "hoshi_music", "https://www.nrj.fr/artistes/hoshi/albums/coeur-parapluie", [
    item("Heart Umbrella", "Parapluie Coeur", "Single folded black umbrella with one small original red heart patch and curved handle."),
    item("Black Glasses", "Lunettes noires", "Single pair of thick black rectangular glasses with dark lenses."),
    item("Heart Pin", "Epingle coeur", "One small red enamel heart pin with silver edge and no lettering."),
    item("Stage Microphone", "Microphone de scene", "One black handheld vocal microphone with silver grille and no branding."),
  ]));
}
