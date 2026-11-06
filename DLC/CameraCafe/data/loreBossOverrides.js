// Camera Cafe — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Open Space Rumor Swarm': 'comedyQTE:officeGossip',
      'Director Office Lock': 'comedyQTE:management'
    },
    fr: 'Les situations de bureau deviennent sketches et QTE sociaux.',
    en: 'The office situations become sketches and social QTEs.'
  }));
}
