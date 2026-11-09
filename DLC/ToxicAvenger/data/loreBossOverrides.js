// Toxic Avenger — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Bozo',
      weapon: 'shotgun_and_vehicle',
      special: 'Tromaville Hit-and-Run',
      phases: ['Uses a shotgun and gang attacks', 'Turns the documented car into a short arena hazard before the final exchange'],
      lore: {
        fr: 'Bozo est le chef des voyous responsables de l accident de Melvin.',
        en: 'Bozo is the thug leader responsible for Melvin s accident.'
      },
      referenceUrl: 'https://www.troma.com/films/the-toxic-avenger/',
      visualAnchor: 'Exact Gary Schneider likeness as Bozo, 1980s thug clothing, hair, shotgun and film car; no toxic mutation.'
    },
    {
      name: 'Cigar Face',
      weapon: 'handgun_and_cigar',
      special: 'Tromaville Crime Order',
      phases: ['Uses armed henchmen and deliberate handgun fire', 'Fights alone while retaining the documented cigar and crime-boss look'],
      lore: {
        fr: 'Cigar Face est un criminel de Tromaville, pas une bete radioactive.',
        en: 'Cigar Face is a Tromaville criminal rather than a radioactive beast.'
      },
      referenceUrl: 'https://www.troma.com/films/the-toxic-avenger/',
      visualAnchor: 'Exact Dan Snow likeness, dark 1980s crime clothing, moustache, cigar and handgun from The Toxic Avenger.'
    }
  ]);
}
