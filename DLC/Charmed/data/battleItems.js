// Charmed — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Potion Halliwell', 'Halliwell Potion', 'Soin et bouclier magique.'],
      ['Page du Livre des Ombres', 'Book of Shadows Page', 'Bonus special et contre-sort.'],
      ['Cristal de protection', 'Warding Crystal', 'Pose une zone defensive.']
    ],
    summon: ['Pouvoir des Trois', 'Power of Three', 'Une assistance magique temporaire amplifie l escouade.'],
    ultimate: ['Rituel de bannissement', 'Vanquishing Ritual', 'Un cercle de bannissement frappe toutes les menaces.']
  });
}
