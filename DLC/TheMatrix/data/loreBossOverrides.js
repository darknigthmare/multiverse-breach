// The Matrix — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'The Twins',
      weapon: 'straight_razors_and_phasing',
      special: 'Ghost Phase',
      phases: ['Fight as one synchronized duo with straight razors', 'Turn translucent white to phase through attacks before a coordinated counter'],
      lore: {
        fr: 'Les Jumeaux sont les deux Exiles au service du Merovingien.',
        en: 'The Twins are the two Exiles serving the Merovingian.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/matrix-reloaded',
      visualAnchor: 'Exactly two identical pale men, white dreadlocks, white suits, black narrow sunglasses and straight razors from The Matrix Reloaded.'
    },
    {
      name: 'Agent Jones',
      weapon: 'handgun_and_agent_martial_arts',
      special: 'Agent Body Transfer',
      phases: ['Uses precise handgun fire and Matrix agent martial arts', 'Transfers through one nearby simulated civilian after being defeated once'],
      lore: {
        fr: 'Jones est un Agent nomme et non une escouade abstraite.',
        en: 'Jones is a named Agent rather than an abstract squad.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/matrix',
      visualAnchor: 'Exact Robert Taylor likeness, dark green-black suit, tie, earpiece and rectangular sunglasses from The Matrix.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Architect White Room': 'narrativeConfrontation:choiceOfDoors' },
    fr: 'L Architecte est une scene de dialogue et de choix, pas un combattant.',
    en: 'The Architect is a dialogue and choice scene rather than a combatant.'
  }));
}
