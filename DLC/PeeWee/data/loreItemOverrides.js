// Pee-wee — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Pee-wee", "pee_wee", "https://www.thealamo.org/support/preservation/updates/artifact-spotlight-pee-wees-red-bicycle", [
    item("Red Bicycle", "Velo rouge", "Single complete bright red vintage bicycle with white tires, chrome handlebars and rear carrier."),
    item("Red Bow Tie", "Noeud papillon rouge", "One small vivid red fabric bow tie with neat central knot."),
    item("Bicycle Lock", "Antivol de velo", "Single coiled steel bicycle cable lock with red plastic coating and small key cylinder."),
    item("Fortune Card", "Carte de voyance", "One illustrated fortune card with abstract moon-eye symbols and no readable text."),
  ]));
}
