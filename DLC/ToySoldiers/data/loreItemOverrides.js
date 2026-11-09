// Toy Soldiers — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Toy Soldiers", "toy_soldiers", "https://store.steampowered.com/app/98300/Toy_Soldiers/", [
    item("Wind-up Key", "Cle de remontage", "Single brass toy wind-up key with twin oval loops and short square shaft."),
    item("Tin Soldier Rifle", "Fusil de soldat en etain", "One miniature stamped-tin bolt-action rifle with painted wood and metal colors."),
    item("Toy Artillery Shell", "Obus miniature", "Single miniature brass artillery shell with toy-scale seams and blunt safe tip."),
    item("Ration Tin", "Boite de ration", "One small olive drab ration tin with rolled rim and no readable military markings."),
  ]));
}
