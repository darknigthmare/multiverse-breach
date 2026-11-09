// Buffy the Vampire Slayer — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'The Master',
      weapon: 'vampire_strength_and_hypnosis',
      special: 'Prophecy Blood Drain',
      phases: ['Uses hypnosis, grapples and vampire strikes', 'Breaks the prophecy seal and attacks with increased speed'],
      lore: {
        fr: 'The Master remplace Spike comme antagoniste de ce slot.',
        en: 'The Master replaces Spike as the antagonist for this slot.'
      },
      referenceUrl: 'https://www.disneyplus.com/series/buffy-the-vampire-slayer/DmJepBrlNiUe',
      visualAnchor: 'Exact Mark Metcalf Master makeup, bald head, pointed ears, ancient vampire face and black robes from Buffy season 1.'
    }
  ]);
}
