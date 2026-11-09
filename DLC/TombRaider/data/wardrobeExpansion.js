// Tomb Raider — definitions consumed by src/game/wardrobeExpansion.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createOfficialCostumeExtension({ L, official }) {
  return (official('Tomb Raider','lara_croft_tr','rise-20year-cold-weather','20 ans — tenue grand froid inspirée de TRIII','20 Year — TRIII-inspired cold-weather outfit','Rise of the Tomb Raider — 20 Year Celebration',
    'https://store.steampowered.com/api/appdetails?appids=391220',
    'PUBLISHER_GAME_DESCRIPTION',L('Tenue grand froid de Rise : ne pas la présenter comme le modèle original de 1998. Vérifier le visage Survivor et la référence exacte ; les cinq modèles classiques mentionnés par la source sont un autre lot.','The Rise cold-weather outfit is not the original 1998 model. Check the Survivor face and exact reference; the source’s five classic models form a separate set.')));
}

export function createSignatureDesignExtension({ design }) {
  return (design('Tomb Raider','lara_croft_tr','archive','Conservatrice du Nexus','Nexus conservator','Veste de relevés, gants de conservation et sacoche plate ; choix Classic/Survivor explicite avant production, jamais un visage hybride.','Survey jacket, conservation gloves and flat satchel; choose Classic or Survivor before production, never a hybrid face.'));
}

export function createWardrobeResearchTargets({ L }) {
  return ({universe:'Tomb Raider',id:'lara_croft_tr',key:'classic-models',question:L('Identifier séparément les cinq modèles classiques annoncés dans Rise ; ne pas inventer leurs noms.','Identify the five classic models announced for Rise individually; do not invent names.'),sourceUrl:'https://store.steampowered.com/api/appdetails?appids=391220',status:'INDIVIDUAL_MODELS_TO_VERIFY'});
}
