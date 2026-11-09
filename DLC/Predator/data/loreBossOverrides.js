// Predator — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'City Hunter Predator': 'universe:Predator 2',
      'Berserker Predator': 'universe:Predators',
      'Feral Predator': 'universe:Prey'
    },
    fr: 'Chaque Predator doit rester dans le film et la periode qui lui correspondent.',
    en: 'Each Predator must remain in its matching film and era.'
  }));
}
