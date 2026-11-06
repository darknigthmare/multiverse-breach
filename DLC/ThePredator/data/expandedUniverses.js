// The Predator — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'The Predator',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Stargazer Lab Lockdown',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Ultimate Predator',
    title: { en: 'The Predator', fr: 'The Predator' },
    desc: {
      en: 'Stargazer labs, hybridized predator upgrades, crashed tech, and a hunt weaponized by genetic escalation.',
      fr: 'Labos Stargazer, ameliorations hybrides, technologie crashee et chasse militarisee par l escalation genetique.'
    },
    hero: { id: 'quinn_predator', name: 'Quinn McKenna', cat: 'marine', color: '#4b5b42' },
    allies: [
      { id: 'casey_predator', name: 'Casey Bracket', cat: 'hacker', color: '#768b8d' },
      { id: 'fugitive_predator', name: 'Fugitive Predator', cat: 'slayer', color: '#6a5d45' }
    ],
    monsters: ['Predator Dog', 'Stargazer Trooper', 'Hybrid Drone'],
    bosses: ['Fugitive Predator', 'Upgrade Hunter'],
    worldBoss: 'Ultimate Predator',
    gear: [
      ['tp_predator_killer_mask', 'Predator Killer Mask', 'Masque Predator Killer', { def: 8, atk: 5 }],
      ['tp_hybrid_dna', 'Hybrid DNA Sample', 'Echantillon ADN hybride', { hp: 85 }],
      ['tp_gauntlet', 'Stargazer Gauntlet', 'Gantelet Stargazer', { atk: 9, spd: 1 }]
    ],
    event: ['evt_tp_upgrade', 'Hybrid Upgrade Burst', 'Surcharge hybride', 'Hybrid tech boosts attack and drops plasma bursts.', 'La technologie hybride augmente l attaque et declenche des tirs plasma.'],
    decor: { sky: ['#1b2720', '#030604'], floor: 'rgba(76, 116, 89, 0.18)', grid: 'rgba(102, 234, 141, 0.27)', motif: 'facility', accent: '#66ea8d' }
  });
}
