// Final Fantasy XV — definitions consumed by src/game/wardrobeOfficialR9.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createWardrobeResearchR9({ research }) {
  return (research('Final Fantasy XV','noctis_ff15','ff15-half-life-main','ff15-half-life','WEARER_AND_MODEL_REFERENCE_REQUIRED',
  'Confirmer le modèle porté par Noctis pour Half-Life Costume du jeu principal ; ne pas lui attribuer automatiquement le HEV ou les lunettes réservés à COMRADES.',
  'Confirm Noctis’s main-game Half-Life Costume model; do not automatically assign COMRADES-exclusive HEV or glasses.'));
}
