// Cells at Work! — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Cells at Work!',
    mediaType: 'manga',
    faction: 'sciFi',
    stageName: 'Body System Infection',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Sepsis Breach',
    title: { en: 'Cells at Work!', fr: 'Les Brigades immunitaires' },
    desc: {
      en: 'Inside the body, red cells deliver oxygen while white cells battle bacteria, viruses, and systemic collapse.',
      fr: 'Dans le corps, les globules rouges livrent l oxygene pendant que les blancs combattent microbes et virus.'
    },
    hero: { id: 'red_blood_cell', name: 'Red Blood Cell AE3803', cat: 'marine', color: '#e74c3c' },
    allies: [
      { id: 'white_blood_cell', name: 'White Blood Cell U-1146', cat: 'slayer', color: '#ecf0f1' },
      { id: 'platelet_cells', name: 'Platelet Squad', cat: 'tactical', color: '#f6d365' },
      { id: 'red_blood_cell_courier_ae3803', name: 'Red Blood Cell Courier AE3803', cat: 'tactical', color: '#e74c3c', weapon: 'oxygen delivery box' },
      { id: 'white_blood_cell_long_hair', name: 'White Blood Cell Long-Hair Defender', cat: 'slayer', color: '#ecf0f1', weapon: 'immune baton and knife' },
      { id: 'white_blood_cell_short_hair', name: 'White Blood Cell Short-Hair Defender', cat: 'slayer', color: '#ecf0f1', weapon: 'immune baton and knife' },
      { id: 'neutrophil_u1146_combat', name: 'Neutrophil U-1146 Combat', cat: 'slayer', color: '#dfe6e9', weapon: 'neutrophil knife' },
      { id: 'platelet_squad_leader', name: 'Platelet Squad Leader', cat: 'tactical', color: '#f6d365', weapon: 'repair net and clot patch' },
      { id: 'macrophage_cleaner', name: 'Macrophage Cleaner', cat: 'tactical', color: '#f8eadf', weapon: 'cleanup sweep' }
    ],
    monsters: ['Pneumococcus Germ', 'Cedar Pollen Allergen', 'Cancer Cell Scout'],
    bosses: ['Influenza Virus Swarm', 'Killer T Cell Drill', { name: 'Cancer Cell True Form', weapon: 'tendril claws', special: 'Uncontrolled Cellular Proliferation' }],
    worldBoss: 'Sepsis Breach',
    gear: [
      ['caw_oxygen_box', 'Oxygen Delivery Box', 'Caisse oxygene', { hp: 80 }],
      ['caw_white_knife', 'Neutrophil Knife', 'Couteau neutrophile', { atk: 9 }],
      ['caw_platelet_net', 'Platelet Repair Net', 'Filet plaquette', { def: 7, spd: 1 }]
    ],
    event: ['evt_caw_immunity', 'Immune Response Surge', 'Poussee immunitaire', 'Immune cells purge poison and damage biological enemies.', 'Les cellules immunitaires purgent le poison et frappent les ennemis biologiques.'],
    decor: { sky: ['#4b1720', '#080204'], floor: 'rgba(231, 76, 60, 0.16)', grid: 'rgba(236, 240, 241, 0.28)', motif: 'facility', accent: '#ecf0f1' }
  });
}
