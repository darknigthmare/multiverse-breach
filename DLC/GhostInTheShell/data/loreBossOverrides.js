// Ghost in the Shell — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawSlotPolicies({ definePolicy }) {
  return (definePolicy({
    convertTo: { 'Puppet Master Firewall': 'networkBoss:cyberspaceEncounter' },
    fr: 'Project 2501 doit rester une confrontation reseau, pas un corps melee fixe.',
    en: 'Project 2501 remains a network confrontation rather than a fixed melee body.'
  }));
}
