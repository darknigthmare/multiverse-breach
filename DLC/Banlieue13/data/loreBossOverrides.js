// Banlieue 13 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Taha Bemamud',
      weapon: 'handgun_and_gang_command',
      special: 'B13 Gang Lockdown',
      phases: ['Uses gang crossfire from cover', 'Fights with a handgun while attempting to reach an escape route'],
      lore: {
        fr: 'Taha controle la cite et detient la bombe.',
        en: 'Taha controls the district and holds the bomb.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/District_13',
      visualAnchor: 'Exact Bibi Naceri likeness, shaved head, dark streetwear and handgun from District 13.'
    },
    {
      name: 'K2',
      weapon: 'assault_rifle',
      special: 'Taha Enforcer Rush',
      phases: ['Uses controlled assault-rifle bursts and physical blocks', 'Switches to heavy close combat after ammunition runs out'],
      lore: {
        fr: 'K2 est l homme de main massif de Taha.',
        en: 'K2 is Taha s massive enforcer.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/District_13',
      visualAnchor: 'Exact Tony D Amario likeness, massive build, shaved head, black street clothing and film assault rifle.'
    }
  ]);
}
