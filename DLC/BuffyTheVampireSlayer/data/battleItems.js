// Buffy the Vampire Slayer — definitions consumed by src/game/battleItems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBattleItemOverrides() {
  return ({
    pickups: [
      ['Pieu beni', 'Blessed Stake', 'Degats lourds contre les elites.'],
      ['Grimoire Watcher', 'Watcher Grimoire', 'Charge speciale et lecture tactique.'],
      ['Eau benite', 'Holy Water', 'Zone de protection courte.']
    ],
    summon: ['Scooby Gang', 'Scooby Gang', 'Un groupe allie coupe la pression autour du heros actif.'],
    ultimate: ['Ouverture de Hellmouth', 'Hellmouth Breach', 'La faille s ouvre sous les ennemis et les disperse.']
  });
}
