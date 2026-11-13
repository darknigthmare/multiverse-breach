// Discworld — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Vorbis',
      weapon: 'staff_and_authority',
      special: 'Omnian Inquisition',
      phases: ['Uses a staff, commands and psychological feints', 'Loses composure and commits to direct strikes after his authority breaks'],
      lore: {
        fr: 'Vorbis remplace la tempete de Sourcery, qui est un evenement.',
        en: 'Vorbis replaces the Sourcery storm, which is an event.'
      },
      referenceUrl: 'https://www.terrypratchettbooks.com/books/small-gods/',
      visualAnchor: 'Original text-faithful Vorbis based on one selected licensed edition: bald severe cleric, austere robes and plain staff.'
    },
    {
      name: 'Mr Teatime',
      weapon: 'knives_and_assassin_tools',
      special: 'Hogfather Assassination Plan',
      phases: ['Uses precise knives and concealed assassin tools', 'Reveals his unstable focus and attacks in rapid unpredictable bursts'],
      lore: {
        fr: 'Mr Teatime est l assassin charge d eliminer le Hogfather.',
        en: 'Mr Teatime is the assassin hired to eliminate the Hogfather.'
      },
      referenceUrl: 'https://www.terrypratchettbooks.com/books/hogfather/',
      visualAnchor: 'Original text-faithful Mr Teatime based on one selected licensed edition, mismatched eyes, neat dark clothing and assassin knives.'
    }
  ]);
}
