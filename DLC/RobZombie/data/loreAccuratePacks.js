// Rob Zombie — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('ginger_fish', 'Ginger Fish', 'tactical', '#8d6e63', 'drums', 'Shock Rock Drum Hit', 'Grindhouse Beat Trap', 'Stage Kit Guard', 'Living Dead Drumline')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Living Dead Girl Dancer', 92, 13, 6, '#5b2c1f', 'dance_slash'),
      monster('Dragula Hot Rod Fiend', 120, 16, 7, '#ffa943', 'hot_rod_ram'),
      monster('House of 1000 Corpses Ghoul', 105, 15, 5, '#922b21', 'grindhouse_claws')
    ],
    bosses: [
      boss('Superbeast Stage Brute', 610, 24, 5, '#7b241c', 'brute_charge', 'Superbeast Roar'),
      boss('Lords of Salem Ritual', 570, 22, 4, '#8e44ad', 'ritual_fire', 'Salem Witch Chorus')
    ],
    worldBoss: boss('Dragula Stage Machine', 1280, 32, 5, '#ff6f3c', 'dragula_ram', 'Dragula Hot-Rod Massacre')
  });
}
