// Black Eyed Peas — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Black Eyed Peas", "black_eyed_peas", "https://www.universal-music.co.jp/black-eyed-peas/videos/boom-boom-pow/", [
    item("The E.N.D. Cube Token", "Jeton-cube The E.N.D.", "Single small black-white futuristic cube with original geometric panels and no copied lettering."),
    item("Boom Boom Pow Visor", "Visiere Boom Boom Pow", "One wraparound mirrored performance visor with angular silver temples and cyan reflections."),
    item("Futuristic Microphone", "Microphone futuriste", "Single chrome handheld microphone with segmented blue light rings and no logo."),
    item("Stage Touch Panel", "Panneau tactile de scene", "One portable black touch panel displaying abstract neon equalizer shapes without text."),
  ]));
}
