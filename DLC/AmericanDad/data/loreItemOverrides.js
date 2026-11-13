// American Dad — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("American Dad", "american_dad", "https://americandad.fandom.com/wiki/The_Golden_Turd", [
    item("Golden Turd", "Etron dore", "Single polished gold novelty sculpture with a compact curled silhouette and bright highlights."),
    item("CIA Badge", "Badge de la CIA", "One black leather federal badge wallet with gold shield shape and no copied seal or text."),
    item("Roger Wig", "Perruque de Roger", "Single flamboyant blonde disguise wig on no head, curled ends and synthetic shine."),
    item("Klaus Fishbowl", "Bocal de Klaus", "One round clear fishbowl with orange pebble, tiny castle and blue water, no fish character."),
  ]));
}
