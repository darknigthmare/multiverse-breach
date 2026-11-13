// Rocky Horror Picture Show — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Rocky Horror Picture Show", "rocky_horror", "https://dcrockyhorror.com/prop-guide", [
    item("Sonic Transducer", "Transducteur sonique", "Single retro laboratory control device with silver body, red dome light and black cable."),
    item("Rocky's Gold Trunks", "Short dore de Rocky", "One neatly folded pair of metallic gold stage trunks with black waistband."),
    item("Floor-show Corset", "Corset du floor-show", "One folded black sequined stage corset with red lacing and no wearer."),
    item("Laboratory Glove", "Gant de laboratoire", "Single long pale rubber laboratory glove with rolled cuff and theatrical pink tint."),
  ]));
}
