// Within Temptation — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Within Temptation", "within_temptation", "https://www.within-temptation.com/products/hydra", [
    item("Hydra Pendant", "Pendentif Hydra", "Single silver multi-headed serpent pendant on a dark chain, original arrangement and no logo."),
    item("Ice Queen Glove", "Gant Ice Queen", "One long white-silver stage glove with crystal-like cuff and frosted embroidery."),
    item("Stage Microphone", "Microphone de scene", "One silver-black symphonic-rock microphone with blue gem ring and no branding."),
    item("Stage Crown", "Couronne de scene", "One slender dark-silver crown with blue crystals and branching gothic points."),
  ]));
}
