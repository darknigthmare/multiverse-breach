// Aliens — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Warrior Xenomorph Alpha',
      weapon: 'claws_tail_and_inner_jaw',
      special: 'Hive Ambush',
      phases: ['Stalks on walls and uses claws and tail strikes', 'Uses a fast inner-jaw lunge after its carapace is damaged'],
      lore: {
        fr: 'Le Warrior remplace le Power Loader, qui est l equipement de Ripley.',
        en: 'The Warrior replaces the Power Loader, which is Ripley s equipment.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens',
      visualAnchor: 'Exact 1986 Warrior Xenomorph, ribbed blue-black dome, biomechanical exoskeleton, six dorsal tubes, long tail and digitigrade limbs.'
    }
  ]);
}
