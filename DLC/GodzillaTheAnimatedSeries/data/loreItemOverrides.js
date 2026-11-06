// Godzilla The Animated Series — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Godzilla The Animated Series", "godzilla_tas", "https://www.scifijapan.com/anime-animation/godzilla-the-series", [
    item("H.E.A.T. Communicator", "Communicateur H.E.A.T.", "Single rugged grey handheld communicator with green screen, antenna and no copied acronym text."),
    item("Sonic Signaler", "Emetteur sonique", "One compact tripod sonic beacon with circular speaker, red light and black casing."),
    item("DNA Sample Vial", "Fiole d ADN", "Single sealed laboratory vial containing dark green reptilian tissue and amber fluid."),
    item("Tracking Beacon", "Balise de suivi", "One magnetic oval tracking beacon with blinking green diode and reinforced shell."),
  ]));
}
