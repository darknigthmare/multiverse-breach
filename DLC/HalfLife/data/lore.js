// Half-Life — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'game',
    title: { en: 'Half-Life', fr: 'Half-Life' },
    desc: {
      en: 'A science-fiction disaster universe born from Black Mesa resonance cascade: Xen creatures, HEV survival, HECU cleanup, G-Man manipulation, Resistance cells, and Combine occupation turn one experiment into a planetary rupture.',
      fr: 'Un univers de catastrophe science-fiction ne de la cascade de resonance de Black Mesa: creatures de Xen, survie HEV, intervention HECU, manipulation du G-Man, cellules de Resistance et occupation Combine transforment une experience en rupture planetaire.'
    }
  });
}
