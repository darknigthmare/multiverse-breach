// From — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Smiley Creature',
      weapon: 'monster_claws_and_bite',
      special: 'Night Smile Reveal',
      phases: ['Approaches slowly in a human facade and speaks calmly', 'Reveals the exact creature mouth and attacks with sudden speed'],
      lore: {
        fr: 'Smiley est une creature nocturne nommee de la serie From.',
        en: 'Smiley is a named nocturnal creature from From.'
      },
      referenceUrl: 'https://www.mgmplus.com/series/from',
      visualAnchor: 'Exact Smiley human facade, 1950s-style clothing and actor likeness, then the source creature face with needle teeth.'
    },
    {
      name: 'Music Box Ballerina',
      weapon: 'music_box_curse',
      special: 'Melody Possession',
      phases: ['Appears with the documented music-box melody and slow dance', 'Uses short curse pulses tied to the ballerina movement without physical weapons'],
      lore: {
        fr: 'La ballerine materialise la malediction de la boite a musique.',
        en: 'The ballerina manifests the music-box curse.'
      },
      referenceUrl: 'https://www.mgmplus.com/series/from',
      visualAnchor: 'Exact pale ballerina apparition and aged ballet costume from From, tied to the physical music box; no generic demon anatomy.'
    }
  ]);
}
