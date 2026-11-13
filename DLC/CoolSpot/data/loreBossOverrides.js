// Cool Spot — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    removeSlots: [fallbackName('Cool Spot', 'EG')],
    convertTo: { [fallbackName('Cool Spot', 'CA')]: 'objective:collectSpots' },
    fr: 'Le jeu ne comporte pas de boss; la fin de niveau reste un objectif de collecte.',
    en: 'The game has no bosses; the level end remains a collection objective.'
  }));
}
