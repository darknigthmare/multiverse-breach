// Aliens — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesignExtension({ design }) {
  return (design('Aliens','ripley_aliens','flight-deck','Équipe de pont Nexus','Nexus flight-deck crew','Gilet court de pont à bandes ambre sur tenue utilitaire ; silhouette de Ripley 1986 conservée. Harnais et loader restent équipements séparés.','Short amber-striped deck vest over utility clothing; keep 1986 Ripley’s silhouette. Harness and loader remain separate equipment.'));
}

export function createSignatureDesignExtension2({ design }) {
  return (design('Aliens','hicks_aliens','field-leader','Chef de section des Failles','Rift squad leader','Panneaux amovibles gris sur l’armure existante, brassard Nexus et pochette de cartes ; visage, casque et arme restent ceux de Hicks.','Removable grey panels on existing armor, Nexus armband and map pouch; retain Hicks’s face, helmet and weapon.'));
}

export function createSignatureDesignExtension3({ design }) {
  return (design('Aliens','vasquez_aliens','support-rig','Soutien du Seuil','Threshold support','Renforts textiles et plaques latérales graphite ; conserver visage, bandana et dégagement du harnais Smartgun, sans fusionner arme et costume.','Textile reinforcement and graphite side plates; keep face, bandana and Smartgun harness clearance, never merge weapon and costume.'));
}

export function createSignatureDesignExtension4({ design }) {
  return (design('Aliens','bishop_aliens','medic','Technicien secouriste','Rescue technician','Combinaison d’entretien claire à bandes de secours turquoise, gants fins et trousse fermée ; aucun bras mécanique ou dispositif d’attaque ajouté.','Light maintenance suit with turquoise rescue bands, thin gloves and closed kit; no added mechanical arm or attack device.'));
}

export function createSignatureDesignExtension5({ design }) {
  return (design('Aliens','newt_hadley','shelter','Exploratrice du Refuge','Shelter explorer','Veste chaude ajustée à un enfant, écusson Nexus et petite sacoche ; préserver âge, taille, cheveux et expressions, sans armes ni armure de soldat.','Child-sized warm jacket, Nexus patch and small satchel; preserve age, height, hair and expressions, no weapons or soldier armor.'));
}
