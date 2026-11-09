// Baby Cart — definitions consumed by src/game/loreBossOverrides.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRawBossOverrides() {
  return ([
    {
      name: 'Retsudo Yagyu',
      weapon: 'katana',
      special: 'Yagyu Clan Final Duel',
      phases: ['Uses disciplined Yagyu sword forms and counters', 'Commits to a direct final duel after his retainers are defeated'],
      lore: {
        fr: 'Retsudo Yagyu est l adversaire central d Ogami Itto.',
        en: 'Retsudo Yagyu is Ogami Itto s central adversary.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Lone_Wolf_and_Cub',
      visualAnchor: 'Exact elderly Yagyu patriarch appearance from the selected Lone Wolf and Cub screen continuity, formal samurai robes and katana.'
    }
  ]);
}
