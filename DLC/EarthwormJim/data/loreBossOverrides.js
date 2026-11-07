// Earthworm Jim — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Evil the Cat',
      weapon: 'claws_and_nine_lives',
      special: 'Nine-Life Recovery',
      phases: ['Uses claw swipes and cartoon teleport feints', 'Recovers once with a shorter accelerated life cycle'],
      lore: {
        fr: 'Evil the Cat est le souverain demoniaque de Heck.',
        en: 'Evil the Cat is the demonic ruler of Heck.'
      },
      referenceUrl: 'https://earthwormjim.fandom.com/wiki/Evil_the_Cat',
      visualAnchor: 'Exact selected-game cartoon cat villain, red-black demonic palette, cape and horns where present; no realistic feline anatomy.'
    },
    {
      name: 'Professor Monkey-for-a-Head',
      weapon: 'laboratory_devices',
      special: 'Monkey-Head Override',
      phases: ['Uses laboratory gadgets and erratic movement', 'The monkey controls the body more aggressively during the final phase'],
      lore: {
        fr: 'Le professeur partage son corps avec un singe greffe a sa tete.',
        en: 'The professor shares his body with a monkey grafted to his head.'
      },
      referenceUrl: 'https://earthwormjim.fandom.com/wiki/Professor_Monkey-For-A-Head',
      visualAnchor: 'Exact cartoon scientist with the live monkey attached to his head, white coat, glasses and Earthworm Jim proportions.'
    }
  ]);
}
