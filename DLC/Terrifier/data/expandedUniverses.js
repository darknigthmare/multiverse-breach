// Terrifier — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Terrifier',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Miles County Clown Night',
    mode: 'Smash',
    difficulty: 'Very Hard',
    bossName: 'Art the Clown Nightmare',
    title: { en: 'Terrifier', fr: 'Terrifier' },
    desc: { en: 'Silent slasher cruelty, grimy alleys, and clown-mime nightmare logic tear into the Nexus.', fr: 'Cruaute slasher muette, ruelles sales et logique de clown cauchemar dechirent le Nexus.' },
    hero: { id: 'sienna_terrifier', name: 'Sienna Shaw', cat: 'slayer', color: '#d8c17f' },
    allies: [{ id: 'victoria_terrifier', name: 'Victoria Heyes', cat: 'horror', color: '#7d7d7d' }, { id: 'jonathan_terrifier', name: 'Jonathan Shaw', cat: 'tactical', color: '#55606b' }],
    monsters: ['Clown Mime Shade', 'Miles County Maniac', 'Black Bag Prop'],
    bosses: ['Little Pale Girl Echo', 'Halloween Alley Trap'],
    worldBoss: 'Art the Clown Nightmare',
    gear: [['terrifier_sword', 'Valkyrie Sword', 'Epee valkyrie', { atk: 11, def: 3 }], ['terrifier_wings', 'Homemade Armor Wings', 'Ailes armure maison', { def: 7, hp: 45 }], ['terrifier_horn', 'Silent Horn', 'Klaxon muet', { spd: 2, atk: 4 }]],
    event: ['evt_terrifier_final_girl', 'Final Girl Stand', 'Derniere survivante', 'Sienna anchors the squad and counters the next lethal hit.', 'Sienna ancre l escouade et contre le prochain coup lethal.'],
    decor: { sky: ['#230b0b', '#030000'], floor: 'rgba(120, 20, 20, 0.18)', grid: 'rgba(255, 245, 210, 0.22)', motif: 'hauntedset', accent: '#fff5d2' }
  });
}
