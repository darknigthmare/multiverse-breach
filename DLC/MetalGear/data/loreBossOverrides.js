// Metal Gear — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Metal Gear REX',
      weapon: 'railgun_missiles_and_laser',
      special: 'Radome Break',
      phases: ['Uses missiles, machine guns, laser and intact radome targeting', 'Broken radome exposes the cockpit for the final phase'],
      lore: {
        fr: 'Les variantes Shadow et Phantom sont fusionnees dans le REX de Shadow Moses.',
        en: 'The Shadow and Phantom variants are merged into the Shadow Moses REX.'
      },
      referenceUrl: 'https://www.konami.com/mg/history/us/en/',
      visualAnchor: 'Exact gray-black Metal Gear REX from Metal Gear Solid, bipedal legs, railgun, radome, missile pods and cockpit.'
    },
    {
      name: 'Psycho Mantis',
      weapon: 'psychokinesis',
      special: 'Mind-Control Pattern',
      phases: ['Throws room objects with psychokinesis and evades direct aim', 'Uses the documented mind-control pattern before a vulnerable recovery'],
      lore: {
        fr: 'Psycho Mantis est represente comme personnage reel, pas comme souvenir spectral.',
        en: 'Psycho Mantis is represented as the actual character, not a spectral memory.'
      },
      referenceUrl: 'https://www.konami.com/mg/history/us/en/',
      visualAnchor: 'Exact Metal Gear Solid Psycho Mantis, black gas mask, bald scarred head, black tactical bodysuit and red-brown harness.'
    }
  ]);
}
