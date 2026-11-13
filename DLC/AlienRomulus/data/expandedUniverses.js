// Alien: Romulus — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Alien: Romulus',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Renaissance Station Breach',
    mode: 'Smash',
    difficulty: 'Very Hard',
    bossName: 'Offspring Hybrid',
    title: { en: 'Alien: Romulus', fr: 'Alien: Romulus' },
    desc: {
      en: 'Young scavengers, derelict corporate science, zero-g acid blood, and a station dropping toward catastrophe.',
      fr: 'Jeunes recup, science corpo abandonnee, sang acide en zero-g et station en chute vers la catastrophe.'
    },
    hero: { id: 'rain_romulus', name: 'Rain Carradine', cat: 'tactical', color: '#8fa3a5' },
    allies: [
      { id: 'andy_romulus', name: 'Andy', cat: 'hacker', color: '#c5c9c7' },
      { id: 'tyler_romulus', name: 'Tyler', cat: 'marine', color: '#6f7d7d' }
    ],
    monsters: ['Facehugger Swarm', 'Station Xeno', 'Zero-G Acid Cloud'],
    bosses: ['Rook Science Core', 'Romulus Hive Cluster'],
    worldBoss: 'Offspring Hybrid',
    gear: [
      ['romulus_pulse_carbine', 'Pulse Carbine', 'Carabine pulse', { atk: 10, spd: 1 }],
      ['romulus_gravity_boots', 'Gravity Boots', 'Bottes gravite', { def: 5, spd: 2 }],
      ['romulus_android_chip', 'Android Directive Chip', 'Puce directive androide', { hp: 55, def: 5 }]
    ],
    event: ['evt_romulus_zerog', 'Zero-G Acid Drift', 'Derive acide zero-g', 'Suspends acid blood in zero-g, damaging every enemy lane.', 'Suspend le sang acide en zero-g et blesse toutes les lignes ennemies.'],
    decor: { sky: ['#0f2028', '#020508'], floor: 'rgba(81, 105, 112, 0.18)', grid: 'rgba(129, 233, 236, 0.27)', motif: 'shipdeck', accent: '#81e9ec' }
  });
}
