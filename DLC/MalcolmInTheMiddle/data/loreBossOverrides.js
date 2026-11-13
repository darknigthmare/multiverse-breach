// Malcolm in the Middle — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Commandant Edwin Spangler',
      weapon: 'discipline_cane',
      special: 'Marlin Academy Drill',
      phases: ['Commands cadet formations and uses nonlethal cane strikes', 'Loses composure and accelerates the drill after repeated counters'],
      lore: {
        fr: 'Spangler est l antagoniste militaire recurrent de Francis a Marlin Academy.',
        en: 'Spangler is Francis s recurring military antagonist at Marlin Academy.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/List_of_Malcolm_in_the_Middle_characters',
      visualAnchor: 'Exact military academy uniform, eyepatch, stern face and canonical prosthetic details from the series.'
    },
    {
      name: 'Lionel Herkabe',
      weapon: 'school_traps',
      special: 'Krelboyne Humiliation Scheme',
      phases: ['Uses clipboard commands and classroom traps', 'Abandons the plan and enters a short nonlethal confrontation when cornered'],
      lore: {
        fr: 'Herkabe combat par manipulation scolaire et humiliation plutot que par magie.',
        en: 'Herkabe fights through school manipulation and humiliation rather than magic.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/List_of_Malcolm_in_the_Middle_characters',
      visualAnchor: 'Thin teacher in the exact restrained suit, hairstyle and smug posture used in the series.'
    }
  ]);
}
