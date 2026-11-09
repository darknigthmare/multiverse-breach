// Prometheus — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Prometheus',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'LV-223 Engineer Temple',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Engineer Juggernaut',
    title: { en: 'Prometheus', fr: 'Prometheus' },
    desc: {
      en: 'A sterile expedition into Engineer ruins, black pathogen chambers, and creation myths turning hostile.',
      fr: 'Une expedition sterile dans les ruines des Ingenieurs, entre pathogene noir et mythes de creation hostiles.'
    },
    hero: { id: 'shaw_prometheus', name: 'Elizabeth Shaw', cat: 'tactical', color: '#c8d6d6' },
    allies: [
      { id: 'david8_prometheus', name: 'David 8', cat: 'hacker', color: '#d6c48c' },
      { id: 'janek_prometheus', name: 'Captain Janek', cat: 'marine', color: '#52616b' }
    ],
    monsters: ['Hammerpede', 'Infected Crewman', 'Black Goo Drone'],
    bosses: ['Fifield Mutation', 'Engineer Pilot'],
    worldBoss: 'Engineer Juggernaut',
    gear: [
      ['prometheus_map_orb', 'Engineer Map Orb', 'Orbe cartographique Ingenieur', { spd: 2, def: 5 }],
      ['black_goo_vial', 'Black Pathogen Vial', 'Fiole de pathogene noir', { atk: 11 }],
      ['prometheus_medpod', 'Automated MedPod', 'MedPod automatise', { hp: 100 }]
    ],
    event: ['evt_prometheus_medpod', 'Emergency MedPod', 'MedPod urgence', 'A surgical pod heals the squad and purges poison effects.', 'Un module chirurgical soigne l escouade et purge les effets toxiques.'],
    decor: { sky: ['#17242a', '#030609'], floor: 'rgba(120, 145, 143, 0.17)', grid: 'rgba(120, 220, 215, 0.24)', motif: 'shipdeck', accent: '#78dcd7' }
  });
}
