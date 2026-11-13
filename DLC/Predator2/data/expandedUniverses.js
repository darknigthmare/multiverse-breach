// Predator 2 — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Predator 2',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Los Angeles Heat Hunt',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'City Hunter',
    title: { en: 'Predator 2', fr: 'Predator 2' },
    desc: {
      en: 'A concrete-jungle hunt through overheated Los Angeles rooftops, subway tunnels, and trophy rooms.',
      fr: 'Une chasse urbaine dans Los Angeles surchauffee, entre toits, metro et salle des trophees.'
    },
    hero: { id: 'harrigan_p2', name: 'Mike Harrigan', cat: 'tactical', color: '#6c5f54' },
    allies: [
      { id: 'city_hunter_p2', name: 'City Hunter', cat: 'slayer', color: '#6b5d46' },
      { id: 'keyes_p2', name: 'Peter Keyes', cat: 'marine', color: '#1f3a3d' }
    ],
    monsters: ['Heatwave Hunter', 'Subway Stalker', 'Trophy Room Drone'],
    bosses: ['Cloaked Rooftop Duel', 'Elder Ship Guard'],
    worldBoss: 'City Hunter',
    gear: [
      ['p2_smart_disc', 'Smart Disc', 'Disque intelligent', { atk: 11 }],
      ['p2_spear_tip', 'Collapsible Spear', 'Lance retractable', { atk: 8, def: 4 }],
      ['p2_thermal_mask', 'Thermal Mask', 'Masque thermique', { spd: 2, def: 4 }]
    ],
    event: ['evt_p2_trophy', 'Trophy Room Ambush', 'Embuscade de trophees', 'A cloaked hunter strikes the strongest enemy with a smart disc.', 'Un chasseur camoufle frappe l ennemi le plus fort au disque intelligent.'],
    decor: { sky: ['#302217', '#070403'], floor: 'rgba(185, 103, 48, 0.18)', grid: 'rgba(255, 126, 54, 0.28)', motif: 'cybercity', accent: '#ff7e36' }
  });
}
