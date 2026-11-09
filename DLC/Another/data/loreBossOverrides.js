// Another — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Reiko Mikami - The Extra',
      weapon: 'memory_distortion',
      special: 'Calamity Revelation',
      phases: ['Uses memory distortions and defensive movement without invented spells', 'The Extra identity is revealed and the arena calamity intensifies'],
      lore: {
        fr: 'Reiko est la personne supplementaire dont l existence entretient la calamite.',
        en: 'Reiko is the extra person whose existence sustains the calamity.'
      },
      referenceUrl: 'https://another.fandom.com/wiki/Reiko_Mikami',
      visualAnchor: 'Exact anime teacher appearance, light-brown hair and modest adult clothing, with restrained supernatural effects.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    convertTo: { [fallbackName('Another', 'CA')]: 'stageModifier:calamity' },
    fr: 'La calamite est une regle narrative et non une creature.',
    en: 'The calamity is a narrative rule rather than a creature.'
  }));
}
