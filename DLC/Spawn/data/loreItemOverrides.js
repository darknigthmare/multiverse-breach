// Spawn — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Spawn", "spawn", "https://mcfarlane.com/toys/series/spawn-series-1/", [
    item("Necroplasm Chain", "Chaine necroplasmique", "Single length of heavy black-green living chain coiled into one compact pickup."),
    item("Living Cape Clasp", "Agrafe de cape vivante", "One skull-like red-black cape clasp with organic ridges and green necroplasm glow."),
    item("Military Dog Tags", "Plaques militaires", "One pair of worn military dog tags on a single ball chain, no readable personal data."),
    item("Agony Axe", "Hache Agony", "Single massive dark fantasy battle axe with hooked blades and green necroplasm veins."),
  ]));
}
