// Sonic — definitions consumed by src/game/wardrobeOfficialR9.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createOfficialCostumesR9({ make }) {
  return (make('Sonic','sonic_hedgehog','frontiers-holiday-cheer','Holiday Cheer Suit','Sonic Frontiers — DLC (2022)','sonic-holiday',
  'Capturer la tenue Holiday Cheer telle qu’affichée par Frontiers, ses attaches et ses volumes en course et en boule. La description commerciale ne fixe pas les détails : ne pas la remplacer par un Père Noël générique. Ne pas changer l’âge ni les proportions de Sonic.',
  'Capture the Holiday Cheer outfit as displayed in Frontiers, its fastenings and volumes while running and curled up. Marketing text does not establish details: do not substitute a generic Santa outfit. Do not change Sonic’s age or proportions.'));
}

export function createOfficialCostumesR92({ make }) {
  return (make('Sonic','sonic_hedgehog','frontiers-sa2-shoes','Sonic Adventure 2 Shoes','Sonic Frontiers — accessoire promotionnel (2022)','sonic-shoes',
  'Chaussures uniquement : relever semelles, attaches, profil et zones colorées du modèle Frontiers. Conserver tout le reste de Sonic et les volumes des pieds en course. Ne pas créer un nouveau corps Classic ou ajouter des capacités de grind par cette apparence.',
  'Footwear only: record soles, fastenings, profile and color regions of the Frontiers model. Retain the rest of Sonic and foot volumes while running. Do not create a Classic body or grant grind abilities through this appearance.','official-accessory','footwear-only'));
}
