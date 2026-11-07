// Tremors — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Tremors',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Perfection Graboid Hunt',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Queen Graboid Tremor',
    title: { en: 'Tremors', fr: 'Tremors' },
    desc: { en: 'Desert survival, underground predators, vibration traps, and improvised explosives shake the Nexus.', fr: 'Survie desertique, predateurs souterrains, pieges vibratoires et explosifs improvises secouent le Nexus.' },
    hero: { id: 'val_tremors', name: 'Valentine McKee', cat: 'tactical', color: '#b47c45' },
    allies: [{ id: 'earl_tremors', name: 'Earl Bassett', cat: 'marine', color: '#7a6d52' }, { id: 'burt_tremors', name: 'Burt Gummer', cat: 'marine', color: '#4b5d3f' }],
    monsters: ['Shrieker Pack', 'Ass-Blaster Scout', 'Seismic Wormling'],
    bosses: ['Graboid Ambusher', 'Burt Bunker Siege'],
    worldBoss: 'Queen Graboid Tremor',
    gear: [['tremors_sensor', 'Seismic Sensor', 'Capteur sismique', { spd: 2, def: 4 }], ['tremors_dynamite', 'Desert Dynamite', 'Dynamite desert', { atk: 10 }], ['tremors_bunker', 'Gummer Bunker Plate', 'Plaque bunker Gummer', { def: 7, hp: 50 }]],
    event: ['evt_tremors_highground', 'High Ground Trap', 'Piege hauteur', 'The squad climbs out of reach and detonates a lure.', 'L escouade prend de la hauteur et fait exploser un leurre.'],
    decor: { sky: ['#3a2614', '#080402'], floor: 'rgba(194, 123, 60, 0.2)', grid: 'rgba(255, 200, 116, 0.26)', motif: 'wasteland', accent: '#ffc874' }
  });
}
