// H2G2 — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Prostetnic Vogon Jeltz',
      weapon: 'vogon_blaster_and_poetry',
      special: 'Third-Worst Poetry Recital',
      phases: ['Uses a Vogon blaster and bureaucratic guard commands', 'Recites poetry that disrupts movement before a final blaster volley'],
      lore: {
        fr: 'Jeltz est le capitaine Vogon qui detruit la Terre et torture par la poesie.',
        en: 'Jeltz is the Vogon captain who destroys Earth and tortures through poetry.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Prostetnic_Vogon_Jeltz',
      visualAnchor: 'Exact chosen adaptation s bulky green Vogon captain, heavy uniform, bureaucratic insignia and compact energy sidearm.'
    },
    {
      name: 'Agrajag',
      weapon: 'reincarnation_lunges',
      special: 'Repeated-Reincarnation Grudge',
      phases: ['Cycles through brief visual echoes of documented reincarnations', 'Locks into the gaunt cavern form for lunges and an accidental final collapse'],
      lore: {
        fr: 'Agrajag accuse Arthur Dent de l avoir tue dans de nombreuses incarnations.',
        en: 'Agrajag blames Arthur Dent for killing him across many incarnations.'
      },
      referenceUrl: 'https://hitchhikers.fandom.com/wiki/Agrajag',
      visualAnchor: 'Use the exact gaunt batlike cavern incarnation from the selected adaptation, with no unrelated alien armor.'
    }
  ]);
}
