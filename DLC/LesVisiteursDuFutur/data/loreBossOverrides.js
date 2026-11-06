// Les Visiteurs du Futur — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Missionnaires Cell': 'narrativeFaction:missionnaires',
      'Brigade Temporelle Lock': 'narrativeFaction:brigadeTemporelle'
    },
    fr: 'Les groupes restent des factions tant qu un chef et une continuite exacts ne sont pas verrouilles.',
    en: 'The groups remain factions until an exact leader and continuity are locked.'
  }));
}
