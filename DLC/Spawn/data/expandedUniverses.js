// Spawn — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  return ({
      key: 'spawn',
      universe: 'Spawn',
      mediaType: 'manga',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Very Hard',
      titleFr: 'Spawn',
      stage: 'Rat City Necroplasm Rift',
      boss: 'Malebolgia Throne',
      hero: ['al_simmons_spawn', 'Spawn', 'horror'],
      allies: [['cogliostro_spawn', 'Cogliostro', 'tactical'], ['sam_twitch_spawn', 'Sam and Twitch', 'marine']],
      monsters: ['Violator Spawnling', 'Hell Soldier', 'Redeemer Hunter'],
      bosses: ['The Violator', 'Malebolgia'],
      gear: [['spawn_necroplasm', 'Necroplasm Reserve', 'Reserve de necroplasme', { atk: 10, hp: 40 }], ['spawn_chains', 'Living Hell Chains', 'Chaines infernales vivantes', { atk: 8, def: 4 }], ['spawn_cape', 'K7-Leetha Cape Fragment', 'Fragment de cape K7-Leetha', { hp: 70, def: 5 }]],
      event: ['evt_spawn_legion', 'Legion of Souls', 'Legion des ames', 'Spawn releases the voices inside his necroplasm to bind infernal enemies and tear down the throne line.', 'Spawn libere les voix de son necroplasme pour lier les ennemis infernaux et briser la ligne du trone.'],
      theme: 'necroplasm chains, hellspawn bargains, alley warfare, and infernal command structures',
      motif: 'hauntedset',
      colors: ['#08130f', '#010302', '#42ff66']
    });
}
