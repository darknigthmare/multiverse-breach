// Ghost in the Shell — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'manga',
    title: { en: 'Ghost in the Shell', fr: 'Ghost in the Shell' },
    desc: {
      en: 'Cybernetic counter-terrorism Section 9 chasing cyber-brain hackers.',
      fr: 'La Section 9 cyber-antiterroriste traquant les pirates de cyber-cerveaux.'
    }
  });
}
