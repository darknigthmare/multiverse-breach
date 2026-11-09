// Hellraiser — definitions consumed by src/game/lore.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreDb() {
  return ({
    mediaType: 'movie',
    title: { en: 'Hellraiser', fr: 'Hellraiser' },
    desc: {
      en: 'Lemarchand configurations open Leviathans Labyrinth, where distinct Cenobite orders interpret desire, sensation, transformation, and loss as ritual bargains.',
      fr: 'Les configurations de Lemarchand ouvrent le Labyrinthe de Leviathan, ou plusieurs ordres cenobites interpretent desir, sensation, transformation et perte comme des pactes rituels.'
    }
  });
}
