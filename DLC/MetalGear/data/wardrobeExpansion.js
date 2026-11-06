// Metal Gear — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesignExtension({ design }) {
  return (design('Metal Gear','snake','arctic','Infiltration polaire Nexus','Nexus polar infiltration','Couche thermique graphite à manches ajustées, écharpe courte et repères discrets ; bandana et deux yeux conservés, aucun marqueur de Big Boss.','Fitted graphite thermal layer, short scarf and restrained markings; preserve bandana and both eyes, no Big Boss markers.'));
}

export function createSignatureDesignExtension2({ design }) {
  return (design('Metal Gear','raiden','urban','Éclaireur urbain Nexus','Nexus urban scout','Panneaux de finition et textile court adaptés uniquement au corps de l’incarnation retenue ; ne jamais mélanger Raiden humain et cyborg sans nouvelle fiche.','Finish panels and short textiles fitted only to the chosen incarnation’s body; never mix human and cyborg Raiden without a separate record.'));
}

export function createSignatureDesignExtension3({ design }) {
  return (design('Metal Gear','otacon','field-lab','Laboratoire mobile','Mobile laboratory','Veste d’ingénieur à poches d’instruments fermées, manches courtes de travail et identifiant Nexus ; lunettes et silhouette non combattante conservées.','Engineer jacket with closed instrument pockets, work sleeves and Nexus ID; preserve glasses and noncombatant silhouette.'));
}
