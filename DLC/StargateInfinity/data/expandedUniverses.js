// Stargate Infinity — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Stargate Infinity',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Infinity Training Gate',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'TlakKahn Pursuit Fleet',
    title: { en: 'Stargate Infinity', fr: 'Stargate Infinity' },
    desc: {
      en: 'Animated Stargate cadets chased through alien worlds by TlakKahn hunters and unstable gate routes.',
      fr: 'Des cadets Stargate animes poursuivis par les TlakKahn a travers des routes de portes instables.'
    },
    hero: { id: 'gus_bonner', name: 'Gus Bonner', cat: 'tactical', color: '#3b7ddd' },
    allies: [
      { id: 'stacey_bonner', name: 'Stacey Bonner', cat: 'hacker', color: '#9b59b6' },
      { id: 'ecgab_infinity', name: 'Ecgab', cat: 'marine', color: '#27ae60' }
    ],
    monsters: ['TlakKahn Trooper', 'Training Drone', 'Gate Route Parasite'],
    bosses: ['DaKyll Hunter', 'Infinity Gate Storm'],
    worldBoss: 'TlakKahn Pursuit Fleet',
    gear: [
      ['sgi_cadet_gdo', 'Cadet GDO', 'GDO cadet', { def: 6, hp: 40 }],
      ['sgi_training_blaster', 'Training Blaster', 'Blaster entrainement', { atk: 8 }],
      ['sgi_gate_map', 'Animated Gate Map', 'Carte de portes animee', { spd: 2, def: 3 }]
    ],
    event: ['evt_sgi_gate_dash', 'Infinity Gate Dash', 'Dash porte Infinity', 'A rapid gate hop dodges attacks and strikes every lane.', 'Un saut de porte rapide esquive et frappe chaque ligne.'],
    decor: { sky: ['#1b315c', '#040710'], floor: 'rgba(68, 130, 220, 0.17)', grid: 'rgba(120, 240, 190, 0.28)', motif: 'stargate', accent: '#78f0be' }
  });
}
