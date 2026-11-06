// Final Fantasy XIII — definitions consumed by src/game/wardrobeOfficialR9.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createWardrobeResearchR9({ research }) {
  return (research('Final Fantasy XIII','lightning_ff13','lr-aerith-console','lightning-pc','EDITION_RESEARCH_REQUIRED',
  'Costume FFVII Aerith : identifier l’édition console et ses références, car la source PC l’exclut explicitement.',
  'FFVII Aerith costume: identify the console edition and references; the PC source explicitly excludes it.'));
}
