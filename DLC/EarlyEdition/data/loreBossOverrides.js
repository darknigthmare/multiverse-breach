// Early Edition — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Paradox Courier': 'narrativeMission:preventDisaster',
      'Front Page Disaster': 'narrativeMission:preventDisaster'
    },
    fr: 'Le journal et les catastrophes structurent des missions temporelles.',
    en: 'The newspaper and disasters structure time-sensitive missions.'
  }));
}
