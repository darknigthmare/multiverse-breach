// Streets of Rage — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Shiva',
      weapon: 'martial_arts',
      special: 'Final Crash Combo',
      phases: ['Uses fast kicks, blocks and counterattacks', 'Extends into his documented high-speed boss combo below half health'],
      lore: {
        fr: 'Shiva est l artiste martial elite associe a Mr. X.',
        en: 'Shiva is the elite martial artist associated with Mr. X.'
      },
      referenceUrl: 'https://www.streets4rage.com/',
      visualAnchor: 'Exact selected Streets of Rage Shiva design, long dark hair, bare arms, martial trousers and series-specific color palette.'
    },
    {
      name: 'Abadede',
      weapon: 'wrestling_grapples',
      special: 'Arena Power Slam',
      phases: ['Uses wrestling grabs, throws and shoulder charges', 'Enters a faster rage with repeated power slams'],
      lore: {
        fr: 'Abadede est le catcheur massif recurrent de la serie.',
        en: 'Abadede is the series recurring massive wrestler.'
      },
      referenceUrl: 'https://streetsofrage.fandom.com/wiki/Abadede',
      visualAnchor: 'Faithful high-detail version of Abadede s classic sprite: huge wrestler build, mohawk, boots, wristbands and original palette.'
    }
  ]);
}
