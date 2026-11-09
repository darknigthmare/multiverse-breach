// Stargate — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'series',
    title: { en: 'Stargate', fr: 'Stargate' },
    desc: {
      en: 'A military exploration universe where the SGC uses an Ancient Stargate network to reach alien worlds, confront Goa uld false gods, protect Earth with the iris, ally with free Jaffa, study naquadah and Ancient technology, and survive threats like Replicators and Anubis.',
      fr: 'Un univers d exploration militaire ou le SGC utilise le reseau de Portes des Anciens pour atteindre d autres mondes, affronter les faux dieux Goa uld, proteger la Terre avec l iris, s allier aux Jaffa libres, etudier le naquadah et survivre aux Replicateurs comme a Anubis.'
    }
  });
}
