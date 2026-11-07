// Pingu — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Pingu", "pingu", "https://pingu.jp/", [
    item("Fish", "Poisson", "Single small silver-blue fish with simple clay-animation proportions and bright eye."),
    item("Red Sled", "Luge rouge", "One compact red wooden sled with curved runners and tan pull rope."),
    item("Mailbag", "Sac postal", "One blue-grey canvas mailbag with flap, shoulder strap and no postal logo."),
    item("Accordion", "Accordeon", "One small red accordion with cream keys, black bellows and no brand lettering."),
  ]));
}
