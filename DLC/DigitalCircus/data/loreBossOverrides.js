// Digital Circus — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Abstracted Kaufmo',
      weapon: 'abstracted_limbs',
      special: 'Abstracted Rampage',
      phases: ['Charges with erratic multilimbed movement', 'Distorts the arena edges and accelerates below half health'],
      lore: {
        fr: 'Kaufmo abstrait est une seule entite, pas deux variantes de boss.',
        en: 'Abstracted Kaufmo is one entity, not two separate boss variants.'
      },
      referenceUrl: 'https://www.glitchprod.com/theamazingdigitalcircus',
      visualAnchor: 'Exact black multicolored-eye abstracted Kaufmo creature from the pilot, irregular limbs and no remaining clown body.'
    },
    {
      name: 'Gloink Queen',
      weapon: 'gloink_spawn_and_vacuum',
      special: 'Geometric Consumption',
      phases: ['Spawns a limited Gloink wave and uses mouth sweeps', 'Creates a suction pattern toward the huge mouth'],
      lore: {
        fr: 'La Gloink Queen est la creature geometrique du sous-sol du cirque.',
        en: 'The Gloink Queen is the geometric creature beneath the circus.'
      },
      referenceUrl: 'https://www.glitchprod.com/theamazingdigitalcircus',
      visualAnchor: 'Exact red-pink geometric Gloink Queen, huge toothed mouth and pilot proportions; no Caine or Kaufmo features.'
    }
  ]);
}
