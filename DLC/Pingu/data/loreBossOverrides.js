// Pingu — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Walrus Nightmare',
      weapon: 'tusks_and_grab',
      special: 'Dream-Chase Lunge',
      phases: ['Looms over Pingu and uses slow tusk sweeps', 'Accelerates into the canonical dream chase before the nightmare breaks'],
      lore: {
        fr: 'Le morse geant provient du cauchemar de Pingu et reste une rencontre de reve.',
        en: 'The giant walrus comes from Pingu s nightmare and remains a dream encounter.'
      },
      referenceUrl: 'https://pingu.fandom.com/wiki/Pingu%27s_Dream',
      visualAnchor: 'Exact claymation giant walrus, enormous tusks, whiskers and dark rounded body from Pingu s Dream.'
    }
  ]);
}

export function createRawSlotPolicies({ definePolicy, fallbackName }) {
  return (definePolicy({
    convertTo: { [fallbackName('Pingu', 'CA')]: 'stageHazard:iceObstacle' },
    fr: 'Aucun second antagoniste de combat stable; conserver uniquement le cauchemar du morse.',
    en: 'There is no stable second combat antagonist; keep only the walrus nightmare.'
  }));
}
