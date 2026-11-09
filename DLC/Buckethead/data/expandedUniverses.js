// Buckethead — definitions consumed by src/game/expandedUniverses.js.

export function createExpandedUniverseRecord() {
  return ({
      key: 'buckethead',
      universe: 'Buckethead',
      mediaType: 'music',
      faction: 'cyber',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Buckethead',
      stage: 'Bucketheadland Guitar Labyrinth',
      boss: 'Bucketheadland Automaton',
      hero: ['buckethead_avatar', 'Buckethead Persona', 'hacker'],
      allies: [['death_cube_k_echo', 'Death Cube K Echo', 'horror'], ['pike_riff_signal', 'Pike Riff Signal', 'slayer']],
      theme: 'masked guitar virtuosity, Bucketheadland surrealism, pike albums, silent stage personas, arcade-horror riffs, and instrumental labyrinths',
      motif: 'facility',
      colors: ['#181818', '#030303', '#f5f5f5'],
      monsters: ['Bucketheadland Toy Drone', 'Animatronic Riff Guard', 'White Mask Static'],
      bosses: ['Giant Robot Riff Engine', 'Death Cube K Shadow'],
      worldBoss: 'Bucketheadland Automaton',
      gear: [
        ['buckethead_white_mask', 'White Mask Resonator', 'Resonateur masque blanc', { def: 7, spd: 1 }],
        ['buckethead_bucket_crown', 'Bucket Crown Antenna', 'Antenne couronne-bucket', { hp: 60, atk: 5 }],
        ['buckethead_pike_pick', 'Pike Series Guitar Pick', 'Mediator serie Pike', { atk: 10 }]
      ],
      event: ['evt_buckethead_shred', 'Bucketheadland Shred Gate', 'Portail shred Bucketheadland', 'A silent guitar labyrinth opens, shredding hostile code and boosting squad tempo.', 'Un labyrinthe de guitare silencieux s ouvre, lacere le code hostile et accelere le tempo de l escouade.']
    });
}
