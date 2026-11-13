// Family Guy — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Ernie the Giant Chicken',
      weapon: 'cartoon_brawling',
      special: 'Extended Chicken Fight',
      phases: ['Uses punches, tackles and environmental crashes', 'Recovers from an apparent defeat for one shorter and faster reprise'],
      lore: {
        fr: 'Ernie est le rival recurrent de Peter dans leurs combats destructeurs.',
        en: 'Ernie is Peter s recurring rival in their destructive fights.'
      },
      referenceUrl: 'https://familyguy.fandom.com/wiki/Ernie_the_Giant_Chicken',
      visualAnchor: 'Exact Family Guy giant yellow chicken design, red comb and wattles, white shirt cuffs only when shown; flat series proportions.'
    },
    {
      name: 'Bertram',
      weapon: 'advanced_gadgets',
      special: 'Time-Travel Vendetta',
      phases: ['Uses documented gadgets and evasive attacks', 'Triggers a short time-displacement pattern before the final exchange'],
      lore: {
        fr: 'Bertram est le demi-frere rival de Stewie.',
        en: 'Bertram is Stewie s rival half-brother.'
      },
      referenceUrl: 'https://familyguy.fandom.com/wiki/Bertram',
      visualAnchor: 'Exact Family Guy infant design for Bertram, orange overalls, yellow shirt, oval head and hostile expression; no adult redesign.'
    }
  ]);
}
