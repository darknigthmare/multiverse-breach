// Les Chevaliers du Fiel — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Overtime Refusal': 'comedyChallenge:municipalWork',
      'Mayor Complaint Desk': 'comedyQTE:townHall'
    },
    fr: 'Le gameplay repose sur le sketch municipal, pas sur des boss abstraits.',
    en: 'The gameplay is built around the municipal sketch rather than abstract bosses.'
  }));
}
