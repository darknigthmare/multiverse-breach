// Team Fortress 2 — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Team Fortress 2", "team_fortress_2", "https://wiki.teamfortress.com/wiki/Mann_Co._Supply_Crate_Key", [
    item("Sandvich", "Sandvich", "Single triangular sandwich with white bread, olive toothpick, lettuce, tomato and meat layers."),
    item("Mann Co. Crate Key", "Cle de caisse Mann Co.", "Single chunky brass industrial crate key with rectangular teeth, no copied company logo."),
    item("Australium Bar", "Lingot d Australium", "One radiant golden metal bar with beveled corners and no stamped text."),
    item("Medkit", "Medkit", "Single small white medical case with red color block and no copied symbol or text."),
  ]));
}
