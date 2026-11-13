// Stargate Atlantis — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Stargate Atlantis',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Atlantis City Shield',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Wraith Hive Ship',
    title: { en: 'Stargate Atlantis', fr: 'Stargate Atlantis' },
    desc: {
      en: 'The Pegasus expedition defends an Ancient city against Wraith hives, Replicators, and unstable ZPM power.',
      fr: 'L expedition Pegasus defend une cite Ancienne contre ruches Wraith, Replicateurs et ZPM instables.'
    },
    hero: { id: 'sheppard_sga', name: 'John Sheppard', cat: 'marine', color: '#4e89b8' },
    allies: [
      { id: 'mckay_sga', name: 'Rodney McKay', cat: 'hacker', color: '#f1c40f' },
      { id: 'teyla_sga', name: 'Teyla Emmagan', cat: 'tactical', color: '#7d6b4f' }
    ],
    monsters: ['Wraith Drone', 'Genii Saboteur', 'Replicator Probe'],
    bosses: ['Michael Hybrid', 'Wraith Queen'],
    worldBoss: 'Wraith Hive Ship',
    gear: [
      ['sga_zpm', 'ZPM Charge', 'Charge ZPM', { atk: 9, hp: 60 }],
      ['sga_lantean_tablet', 'Lantean Tablet', 'Tablette lanteenne', { def: 6, spd: 1 }],
      ['sga_puddle_jumper', 'Puddle Jumper Beacon', 'Balise jumper', { spd: 2, atk: 5 }]
    ],
    event: ['evt_sga_city_shield', 'Atlantis City Shield', 'Bouclier de la cite Atlantis', 'The city shield absorbs damage and fires drone weapons.', 'Le bouclier de la cite absorbe les degats et tire des drones.'],
    decor: { sky: ['#12324a', '#02070c'], floor: 'rgba(80, 176, 220, 0.18)', grid: 'rgba(110, 208, 255, 0.34)', motif: 'stargate', accent: '#6ed0ff' }
  });
}
