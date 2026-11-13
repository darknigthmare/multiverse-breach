// Halo — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSignatureDesignExtension({ design }) {
  return (design('Halo','masterchief','ceremony','Vigile de cérémonie','Ceremonial sentinel','Panneaux ivoire sur les points de fixation existants et marquage discret du Nexus ; préserver intégralement casque, visière et articulations.','Ivory panels on existing attachment points and a restrained Nexus marking; preserve helmet, visor and joints.'));
}

export function createSignatureDesignExtension2({ design }) {
  return (design('Halo','arbiter','expedition','Éclaireur du Seuil','Threshold outrider','Protection de terrain sur armure existante, tissus courts et attaches adaptées aux jambes de Sangheili ; mandibules, mains et posture conservées.','Field protection on existing armor, short textiles and fastenings fitted to Sangheili legs; preserve mandibles, hands and stance.'));
}

export function createSignatureDesignExtension3({ design }) {
  return (design('Halo','johnson','veteran','Vétéran de Convergence','Convergence veteran','Gilet utilitaire olive, insignes Nexus originaux et épaulettes usées ; garder couvre-chef, visage et carrure, ne pas lui donner une armure Spartan.','Olive utility vest, original Nexus insignia and worn shoulder panels; keep headwear, face and build, no Spartan armor.'));
}

export function createSignatureDesignExtension4({ design }) {
  return (design('Halo','cortana','interface','Interface des constellations','Constellation interface','Graphismes de projection avec fines constellations cyan sur trame existante ; visage, proportions et nature holographique inchangés, aucune armure physique.','Projection graphics with fine cyan constellations over the existing pattern; keep face, proportions and holographic nature, no physical armor.'));
}

export function createWardrobeResearchTargets({ L }) {
  return ({universe:'Halo',id:'masterchief',key:'worn-armor',question:L('Armures réellement portées par John-117 : séparer épisodes et cosmétiques multijoueurs.','Armor actually worn by John-117: separate episodes from multiplayer cosmetics.'),sourceUrl:'https://www.halowaypoint.com/news/canon-fodder-armory-amore',status:'WEARER_AND_EDITION_TO_VERIFY'});
}
