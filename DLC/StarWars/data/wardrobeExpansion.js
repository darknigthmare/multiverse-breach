// Star Wars — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesignExtension({ design }) {
  return (design('Star Wars','vader','nexus-finish','Armure du Seuil — création Nexus','Threshold armor — Nexus original','Patine de service et plaque Nexus discrète sur éléments existants ; casque, respirateur et plastron restent inchangés, pas de nouvelle technologie narrative.','Service patina and a discreet Nexus plate on existing parts; keep helmet, respirator and chest panel unchanged, no new narrative technology.'));
}

export function createSignatureDesignExtension2({ design }) {
  return (design('Star Wars','leia_organa','field-command','Commandement des Failles','Rift command','Surveste pratique ivoire à repères ambre et ceinture d’expédition ; préserver coiffure et visage de la fiche, ne pas emprunter ceux d’une autre époque.','Practical ivory over-jacket with amber markings and expedition belt; preserve the record’s hair and face, do not borrow another era’s.'));
}
