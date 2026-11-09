// Dino Crisis — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Dino Crisis', fr: 'Dino Crisis' },
    desc: {
      en: 'A survival-action universe where Third Energy research on Ibis Island and later temporal disasters around Edward City tear prehistoric predators into modern facilities, forcing SORT and TRAT operatives to balance infiltration, key-card routes, scarce supplies, dinosaur pursuit, and scientific containment.',
      fr: 'Recherches sur la Troisième Énergie ouvrant des failles temporelles remplies de dinosaures.'
    }
  });
}
