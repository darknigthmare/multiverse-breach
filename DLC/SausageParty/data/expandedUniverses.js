// Sausage Party — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Sausage Party',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Shopwell Great Beyond Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Great Beyond Kitchen Grinder',
    title: { en: 'Sausage Party', fr: 'Sausage Party' },
    desc: { en: 'Animated food panic reframes supermarket faith, kitchen horror, and absurd rebellion as a Nexus food-war.', fr: 'La panique alimentaire animee transforme foi de supermarche, horreur de cuisine et rebellion absurde en guerre du Nexus.' },
    hero: { id: 'frank_sausage', name: 'Frank', cat: 'slayer', color: '#c0392b' },
    allies: [{ id: 'brenda_bun', name: 'Brenda Bunson', cat: 'tactical', color: '#d9a45f' }, { id: 'barry_sausage', name: 'Barry', cat: 'hacker', color: '#b83c35' }],
    monsters: ['Panicked Grocery Mob', 'Kitchen Knife Drone', 'Shopping Cart Rammer'],
    bosses: ['Douche Warlord', 'Freezer Aisle Cult'],
    worldBoss: 'Great Beyond Kitchen Grinder',
    gear: [['sp_mustard', 'Sacred Mustard', 'Moutarde sacree', { atk: 6, spd: 2 }], ['sp_cartwheel', 'Cart Wheel Shield', 'Roue de caddie', { def: 6, hp: 40 }], ['sp_wrapper', 'Lucky Wrapper', 'Emballage porte-bonheur', { hp: 70 }]],
    event: ['evt_sp_food_riot', 'Food Riot', 'Emeute alimentaire', 'Food rebels swarm the field and interrupt enemy attacks.', 'Les rebelles alimentaires envahissent le terrain et interrompent les attaques.'],
    decor: { sky: ['#2c1d26', '#070305'], floor: 'rgba(230, 151, 64, 0.18)', grid: 'rgba(255, 220, 115, 0.28)', motif: 'cinema', accent: '#ffdc73' }
  });
}
