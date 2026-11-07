// Ristar — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Riho',
      weapon: 'musical_note_projectiles',
      special: 'Sonata Tempo Shift',
      phases: ['Launches musical notes in a fixed rhythm', 'Changes tempo and movement cadence after each stagger'],
      lore: {
        fr: 'Riho est l oiseau chanteur controle sur Planet Sonata.',
        en: 'Riho is the controlled singer bird on Planet Sonata.'
      },
      referenceUrl: 'https://ristar.fandom.com/wiki/Riho',
      visualAnchor: 'Exact Sega cartoon bird singer design and original blue-purple palette, no human pop-star reinterpretation.'
    },
    {
      name: 'Adahan',
      weapon: 'boss_copy_modules',
      special: 'Boss Memory Cycle',
      phases: ['Copies documented attacks from prior bosses while retaining one base body', 'Exposes the final robotic weak core after the copy cycle'],
      lore: {
        fr: 'Adahan est le robot de Greedy qui reproduit les anciens boss.',
        en: 'Adahan is Greedy s robot that reproduces previous bosses.'
      },
      referenceUrl: 'https://ristar.fandom.com/wiki/Adahan',
      visualAnchor: 'Exact final robot base design and palette from Ristar, with controlled transformation cues rather than unrelated full characters.'
    }
  ]);
}
