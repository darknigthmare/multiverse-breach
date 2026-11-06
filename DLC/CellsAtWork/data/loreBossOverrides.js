// Cells at Work! — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Staphylococcus Aureus',
      weapon: 'toxin_and_bacterial_clusters',
      special: 'Bacterial Cluster Multiplication',
      phases: ['Uses toxin bursts and divides into a limited cluster', 'Recombines into the documented larger bacterial formation'],
      lore: {
        fr: 'Staphylococcus aureus remplace Killer T Cell, qui est un allie.',
        en: 'Staphylococcus aureus replaces Killer T Cell, who is an ally.'
      },
      referenceUrl: 'https://cellsatwork-anime.com/character/',
      visualAnchor: 'Exact official anime Staphylococcus aureus character design and grape-like bacterial cluster motif; do not borrow Cancer Cell features.'
    }
  ]);
}
