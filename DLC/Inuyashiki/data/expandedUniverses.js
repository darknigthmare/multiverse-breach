// Inuyashiki — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Inuyashiki',
    mediaType: 'manga',
    faction: 'cyber',
    stageName: 'Cyber Body Tokyo Incident',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Hiro Shishigami Rampage',
    title: { en: 'Inuyashiki', fr: 'Inuyashiki' },
    desc: {
      en: 'Two rebuilt human weapons choose opposite paths: protection, massacre, family, and machine morality.',
      fr: 'Deux humains reconstruits en armes choisissent des voies opposees entre protection, massacre et morale machine.'
    },
    hero: { id: 'ichiro_inuyashiki', name: 'Ichiro Inuyashiki', cat: 'hacker', color: '#bdc3c7' },
    allies: [
      { id: 'hiro_shishigami', name: 'Hiro Shishigami', cat: 'slayer', color: '#2d3436' },
      { id: 'mari_inuyashiki', name: 'Mari Inuyashiki', cat: 'tactical', color: '#fd79a8' }
    ],
    monsters: ['Cyber Weapon Trace', 'Media Panic Mob', 'Drone Police Unit'],
    bosses: ['Airport Missile Lock', 'Hiro Remote Kill Pattern'],
    worldBoss: 'Hiro Shishigami Rampage',
    gear: [
      ['inu_cyber_core', 'Cyber Body Core', 'Noyau corps cyber', { atk: 9, def: 5 }],
      ['inu_healing_beam', 'Healing Beam Lens', 'Lentille de soin', { hp: 95 }],
      ['inu_flight_thruster', 'Hidden Flight Thruster', 'Propulseur cache', { spd: 3 }]
    ],
    event: ['evt_inu_machine_heart', 'Machine Heart Override', 'Override coeur machine', 'A cyber-heart burst heals allies and locks enemy weapons.', 'Un coeur cyber soigne les allies et verrouille les armes ennemies.'],
    decor: { sky: ['#101923', '#020305'], floor: 'rgba(92, 120, 145, 0.17)', grid: 'rgba(189, 195, 199, 0.3)', motif: 'code', accent: '#bdc3c7' }
  });
}
