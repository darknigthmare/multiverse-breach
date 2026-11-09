// Unreal — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Unreal Tournament', fr: 'Unreal Tournament' },
    desc: {
      en: 'Galactic blood sport tournaments featuring high-velocity weapons.',
      fr: 'Tournois de combats sanglants galactiques avec des armes à haute vélocité.'
    }
  });
}
