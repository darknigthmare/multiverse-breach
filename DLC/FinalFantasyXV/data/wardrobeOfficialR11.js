// Final Fantasy XV — definitions consumed by src/game/wardrobeOfficialR11.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createWardrobeResearchR11({ L, sourceById }) {
  return (Object.freeze({universe:'Final Fantasy XV',id:'noctis_ff15',key:'ffxv-royal-raiment-reference',sourceUrl:sourceById.get('square-ffxv-research').url,
    question:L('Royal Raiment : compléter la preuve du porteur exact et ses vues dans cette édition.','Royal Raiment: complete exact-wearer evidence and views for this edition.'),
    status:'WEARER_AND_TURNAROUND_REVIEW',note:'Outfit existence documented; do not infer a complete wearer reference from the pack list alone.'}));
}
