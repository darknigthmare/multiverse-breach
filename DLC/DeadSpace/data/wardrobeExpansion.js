// Dead Space — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createOfficialCostumeExtension({ L, official }) {
  return (official('Dead Space','isaac','ds3-marauder','RIG Marauder','Marauder RIG','Dead Space 3 (2013) — Marauder Pack',
    'https://store.steampowered.com/app/1303195/Dead_Space_3_Marauder_Pack/',
    'PUBLISHER_DLC_DESCRIPTION',L('Reproduire la version d’Isaac, casque et plaques SCAF, dos RIG lisible. Le pack comprend une arme : elle ne fait pas partie du costume livré au moteur.','Use Isaac’s version, helmet and SCAF plates, keeping the RIG spine readable. The pack’s weapon is not part of the cosmetic implementation.')));
}

export function createOfficialCostumeExtension2({ L, official }) {
  return (official('Dead Space','isaac','ds3-sharpshooter','RIG Sharpshooter','Sharpshooter RIG','Dead Space 3 (2013) — Sharpshooter Pack',
    'https://store.steampowered.com/app/1303194/Dead_Space_3_Sharpshooter_Pack/',
    'PUBLISHER_DLC_DESCRIPTION',L('Capturer la tenue complète d’Isaac, ses attaches et marquages. Ne pas prendre le modèle de Carver ; aucun fusil ou multiplicateur de tir ajouté.','Capture Isaac’s complete suit, attachments and markings. Do not use Carver’s model; grant no rifle or firing multiplier.')));
}

export function createOfficialCostumeExtension3({ L, official }) {
  return (official('Dead Space','isaac','ds3-tundra-recon','RIG Tundra Recon','Tundra Recon RIG','Dead Space 3 (2013) — Tundra Recon Pack',
    'https://store.steampowered.com/app/1303192/Dead_Space_3_Tundra_Recon_Pack/',
    'PUBLISHER_DLC_DESCRIPTION',L('Verrouiller la variante d’Isaac et son isolation textile ; maintenir casque, gants et affichage dorsal cohérents dans toutes les vues. Pas de bonus thermique importé.','Lock Isaac’s variant and insulated fabric; maintain consistent helmet, gloves and spine display across views. No imported thermal bonus.')));
}

export function createSignatureDesignExtension({ design }) {
  return (design('Dead Space','carver','boarding','Équipe d’abordage Nexus','Nexus boarding crew','Plaques de maintenance et rubans ambre sur le RIG de Carver ; conserver casque et affichage propres à Carver, ne pas recopier la version Isaac.','Maintenance plates and amber strips on Carver’s RIG; retain Carver’s helmet and display, do not copy Isaac’s version.'));
}

export function createSignatureDesignExtension2({ design }) {
  return (design('Dead Space','ellie','pilot','Pilote des Failles','Rift pilot','Blouson de vol utilitaire et harnais court, visage et œil conformes à l’incarnation choisie ; aucun rétablissement arbitraire d’un trait physique.','Utility flight jacket and short harness, face and eye matched to the chosen incarnation; never arbitrarily restore a physical trait.'));
}

export function createWardrobeResearchTargets({ L }) {
  return ({universe:'Dead Space',id:'isaac',key:'first-contact',question:L('First Contact : titre et description Steam contradictoires ; chercher une seconde source EA.','First Contact: conflicting Steam title and description; find a second EA source.'),sourceUrl:'https://store.steampowered.com/app/1303196/',status:'SOURCE_CONFLICT'});
}
