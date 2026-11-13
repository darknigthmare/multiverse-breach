// Portal — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Portal', fr: 'Portal' },
    desc: {
      en: 'Aperture Science quantum testing loops monitored by the passive-aggressive AI GLaDOS.',
      fr: 'Salles de tests d\'Aperture Science gérées par l\'IA passive-agressive GLaDOS.'
    }
  });
}
