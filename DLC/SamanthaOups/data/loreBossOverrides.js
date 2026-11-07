// Samantha Oups! — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Neighbor Complaint Wave': 'comedyQTE:neighbor',
      'Kitchen Disaster': 'stageHazard:kitchen'
    },
    fr: 'Les catastrophes domestiques sont des situations de sketch et non des personnages.',
    en: 'The domestic disasters are sketch situations rather than characters.'
  }));
}
