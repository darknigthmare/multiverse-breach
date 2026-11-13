// Scary Movie — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Tabitha',
      weapon: 'cursed_videotape_and_telekinesis',
      special: 'Television Crawl',
      phases: ['Uses cursed-video distortions and telekinetic objects', 'Crawls from the television in her exact parody form for close attacks'],
      lore: {
        fr: 'Tabitha est l antagoniste identifiable de Scary Movie 3.',
        en: 'Tabitha is the identifiable antagonist of Scary Movie 3.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Scary_Movie_3',
      visualAnchor: 'Exact child ghost parody from Scary Movie 3, long black hair, pale face, white sleepwear and film television-crawl pose.'
    }
  ]);
}
