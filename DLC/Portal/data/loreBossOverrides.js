// Portal — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Frankenturret',
      weapon: 'multiple_turret_guns',
      special: 'Component Failure',
      phases: ['Scuttles with mismatched limbs and fires its attached turrets', 'Loses one component at a time and becomes unstable'],
      lore: {
        fr: 'Frankenturret est un assemblage canonique de tourelles et de cubes.',
        en: 'Frankenturret is a canonical assembly of turrets and cubes.'
      },
      referenceUrl: 'https://theportalwiki.com/wiki/Frankenturret',
      visualAnchor: 'Exact Portal 2 mismatched turret-cube construction, white panels, black joints, red optics and awkward walking posture.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: {
      'Fact Core Logic Snare': 'dialogueModifier:factCore',
      'Space Core Vacuum Loop': 'dialogueModifier:spaceCore',
      'Cave Johnson Recording Core': 'narrativeHazard:combustibleLemons',
      'Neurotoxin Vent System': 'stageHazard:neurotoxin'
    },
    fr: 'Les cores parlent et les systemes de ventilation modifient l arene; aucun n est un corps de boss.',
    en: 'The cores speak and the vent system modifies the arena; none is a boss body.'
  }));
}
