// Iron Sky — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Klaus Adler',
      weapon: 'luger_and_moon_trooper_command',
      special: 'Moon Invasion Order',
      phases: ['Uses a sidearm while ordering Moon trooper crossfire', 'Abandons command cover and fights aggressively at close range'],
      lore: {
        fr: 'Klaus Adler tente de prendre le pouvoir a la tete des nazis lunaires.',
        en: 'Klaus Adler attempts to seize power at the head of the Moon Nazis.'
      },
      referenceUrl: 'https://ironsky.net/',
      visualAnchor: 'Exact Gotz Otto likeness, black Moon Nazi officer uniform, cap, insignia and period-styled Luger from the film.'
    },
    {
      name: 'Vivian Wagner',
      weapon: 'presidential_command_console',
      special: 'Moon Fuehrer Command',
      phases: ['Uses command-console hazards and security reinforcements', 'Enters the documented Moon leadership phase with frantic close-range attacks'],
      lore: {
        fr: 'Vivian Wagner devient une antagoniste politique de la continuite Iron Sky.',
        en: 'Vivian Wagner becomes a political antagonist in the Iron Sky continuity.'
      },
      referenceUrl: 'https://ironsky.net/',
      visualAnchor: 'Exact Peta Sergeant likeness and the specific Moon leadership costume from the selected Iron Sky film; no powered armor.'
    }
  ]);
}
