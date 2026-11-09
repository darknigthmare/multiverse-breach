// Alien vs Predator — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Scar Predator',
      weapon: 'combi_stick_wrist_blades_and_plasmacaster',
      special: 'Trial Mark',
      phases: ['Uses combi-stick and wrist blades before earning the plasma caster', 'Adds the caster and carries the documented acid-blood clan mark'],
      lore: {
        fr: 'Scar est le jeune Predator survivant de l epreuve de la pyramide.',
        en: 'Scar is the young Predator who survives the pyramid trial.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-vs-predator',
      visualAnchor: 'Exact Scar Predator armor, silver biomask, netting, combi-stick and later acid-blood forehead mark from AVP.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Alien Queen Escape': 'worldBossPhase:Alien Queen escape' },
    fr: 'L evasion de la reine est une phase ou un objectif, pas une seconde entite.',
    en: 'The Queen escape is a phase or objective rather than a second entity.'
  }));
}
