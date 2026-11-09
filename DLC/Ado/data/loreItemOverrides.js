// Ado — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Ado", "ado", "https://ado.fandom.com/wiki/Ado_Music_Video_Characters", [
    item("Chando Blue Rose", "Rose bleue de Chando", "Single stylized deep-blue rose with black thorned stem and sharp music-video silhouette."),
    item("Black Ribbon", "Ruban noir", "One long black satin hair ribbon tied into a compact bow with trailing ends."),
    item("Cage Microphone", "Microphone-cage", "Single dark stage microphone enclosed by thin curved cage bars, no logo."),
    item("Cracked Mirror", "Miroir fissure", "One small oval black-framed mirror with radial cracks and a blue reflected glow."),
  ]));
}
