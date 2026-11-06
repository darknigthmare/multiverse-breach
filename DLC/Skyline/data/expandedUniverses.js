// Skyline — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialRoutes() {
  return (['Skyline', 'rescue', ['skyline_brain_collector']]);
}

export function createLegacyNonCombatTrialRoutes2() {
  return (['Skyline', 'hit-targets', ['skyline_harvest_core']]);
}

export function createLegacyNonCombatTrialRoutes3() {
  return (['Skyline', 'switches', ['skyline_mothership']]);
}

export function createExpandedUniverses() {
  return ({
    universe: 'Skyline',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Los Angeles Harvest Beam',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Alien Harvest Mothership',
    title: { en: 'Skyline Trilogy', fr: 'Skyline - Trilogie' },
    desc: { en: 'Blue alien harvest beams, brain-snatching ships, and resistance warfare pull the skyline into invasion combat.', fr: 'Rayons bleus de recolte, vaisseaux voleurs de cerveaux et guerre de resistance tirent la skyline en combat d invasion.' },
    hero: { id: 'jarrod_skyline', name: 'Jarrod', cat: 'marine', color: '#3f5f8f' },
    allies: [{ id: 'elaine_skyline', name: 'Elaine', cat: 'tactical', color: '#7d8fa8' }, { id: 'rose_skyline', name: 'Rose Corley', cat: 'slayer', color: '#5b6d9e' }],
    monsters: ['Blue Light Drone', 'Alien Tanker Beast', 'Harvest Pod'],
    bosses: ['Brain Harvest Guardian', 'Resistance Skimmer Duel'],
    worldBoss: 'Alien Harvest Mothership',
    gear: [['sky_blue_core', 'Blue Light Core', 'Noyau lumiere bleue', { atk: 9, spd: 1 }], ['sky_resist_plate', 'Resistance Armor Plate', 'Plaque resistance', { def: 6, hp: 45 }], ['sky_pod_lens', 'Harvest Pod Lens', 'Lentille pod recolte', { atk: 6, def: 4 }]],
    event: ['evt_skyline_blue_pull', 'Blue Light Pull', 'Attraction lumiere bleue', 'A harvest beam drags enemies into a focused strike zone.', 'Un rayon de recolte attire les ennemis dans une zone de frappe.'],
    decor: { sky: ['#101b32', '#020306'], floor: 'rgba(70, 110, 170, 0.18)', grid: 'rgba(75, 180, 255, 0.3)', motif: 'arcanecity', accent: '#4bb4ff' }
  });
}
