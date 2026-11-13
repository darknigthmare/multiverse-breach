// Dungeon Meshi — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Dungeon Meshi',
    mediaType: 'manga',
    faction: 'arcane',
    stageName: 'Golden Dungeon Kitchen',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Winged Lion Appetite',
    title: { en: 'Dungeon Meshi', fr: 'Dungeon Meshi' },
    desc: {
      en: 'A dungeon crawl where ecology, cooking, resurrection, and appetite become tactical survival systems.',
      fr: 'Un donjon ou ecologie, cuisine, resurrection et appetit deviennent des systemes tactiques de survie.'
    },
    hero: { id: 'laios_meshi', name: 'Laios Touden', cat: 'tactical', color: '#d8c08b' },
    allies: [
      { id: 'marcille_meshi', name: 'Marcille', cat: 'hacker', color: '#f4d03f' },
      { id: 'senshi_meshi', name: 'Senshi', cat: 'marine', color: '#6e5c45' }
    ],
    monsters: ['Living Armor', 'Basilisk Skewer', 'Mimic Pot'],
    bosses: ['Red Dragon', 'Mad Mage Feast'],
    worldBoss: 'Winged Lion Appetite',
    gear: [
      ['meshi_cooking_pot', 'Dungeon Cooking Pot', 'Marmite de donjon', { hp: 85 }],
      ['meshi_spellbook', 'Marcille Spellbook', 'Grimoire de Marcille', { atk: 8, spd: 1 }],
      ['meshi_monster_meal', 'Monster Meal Kit', 'Kit repas monstre', { def: 6, hp: 45 }]
    ],
    event: ['evt_meshi_feast', 'Monster Feast', 'Festin de monstre', 'The squad eats a dungeon meal, healing and gaining attack.', 'L escouade mange un plat de donjon, se soigne et gagne de l attaque.'],
    decor: { sky: ['#22301d', '#050804'], floor: 'rgba(131, 103, 64, 0.18)', grid: 'rgba(226, 195, 106, 0.27)', motif: 'labyrinth', accent: '#e2c36a' }
  });
}
