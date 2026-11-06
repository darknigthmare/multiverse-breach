// Moonwalker — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Mr. Big',
      weapon: 'tommy_gun_and_gas',
      special: 'Moonwalker Crime Syndicate',
      phases: ['Commands guards and uses the film firearm and gas traps', 'Retreats toward the Spider Mecha transition instead of spawning a duplicate boss'],
      lore: {
        fr: 'Mr. Big est l antagoniste humain de Moonwalker avant sa transformation mecanique.',
        en: 'Mr. Big is Moonwalker s human antagonist before his mechanical transformation.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Moonwalker',
      visualAnchor: 'Exact Joe Pesci likeness, black suit, ponytail and film weapon from Moonwalker.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    convertTo: { [fallbackName('Moonwalker', 'CA')]: 'worldBossPhase:Mr Big Spider Mecha' },
    fr: 'La forme Spider Mecha est une phase de Mr. Big, pas un second boss local.',
    en: 'The Spider Mecha form is a phase of Mr. Big rather than a second local boss.'
  }));
}
