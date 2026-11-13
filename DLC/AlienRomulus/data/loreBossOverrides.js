// Alien: Romulus — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Scorched Xenomorph',
      weapon: 'tail_claws_and_inner_jaw',
      special: 'Zero-G Acid Threat',
      phases: ['Stalks through walls and uses precise tail strikes', 'Damaged body releases acid that becomes a zero-gravity navigation hazard'],
      lore: {
        fr: 'Scorched remplace le terminal Rook comme boss physique local.',
        en: 'Scorched replaces the Rook terminal as the physical local boss.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-romulus',
      visualAnchor: 'Exact 2024 Scorched Xenomorph, distinctive frontal dome scar, black biomechanical body, long fingers, tail and inner jaw.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Romulus Hive Cluster': 'enemyWave:hiveEscape' },
    fr: 'La ruche est un encounter collectif; Scorched reste l unique boss local.',
    en: 'The hive is a group encounter; Scorched remains the sole local boss.'
  }));
}
