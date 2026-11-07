// Les Inconnus — definitions consumed by src/game/loreItemOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createActivePackSpecs({ item, pack }) {
  return (pack("Les Inconnus", "les_inconnus", "https://fr.wikipedia.org/wiki/Liste_des_sketches_des_Inconnus", [
    item("Sketch Cue Card", "Fiche de sketch", "Single studio cue card with abstract blocking marks and no readable joke or text."),
    item("Stade 2 Tracksuit", "Survetement Stade 2", "One folded retro blue sports tracksuit with white stripes and no copied logo."),
    item("Hunter's Rifle", "Fusil du chasseur", "One old double-barrel hunting shotgun with worn wood and leather sling."),
    item("Auteuil Cap", "Casquette d Auteuil", "Single dark supporter cap with red-blue panels and no readable club name."),
  ]));
}
