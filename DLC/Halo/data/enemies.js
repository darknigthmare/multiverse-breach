// Halo — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Covenant Grunt', hp: 70, atk: 7, spd: 5, color: '#33527a', weapon: 'plasma_pistol' },
      { name: 'Jackal Sniper', hp: 80, atk: 11, spd: 6, color: '#e67e22', weapon: 'beam_rifle' },
      { name: 'Elite Minor', hp: 110, atk: 10, spd: 5, color: '#335fa7', weapon: 'plasma_rifle', incarnation: 'Halo 2 (2004) - blue-armored Sangheili Minor', referenceUrl: 'https://www.halopedia.org/Sangheili_Minor', visualReviewStatus: 'pending' },
      { name: 'Forerunner Sentinel', hp: 90, atk: 12, spd: 7, color: '#7fd7ff', weapon: 'sentinel_beam' },
      { name: 'Flood Combat Form', hp: 120, atk: 13, spd: 5, color: '#8d7b46', weapon: 'infected_claws' }
    ],
    bosses: [
      { name: 'Brute Chieftain Tartarus', hp: 500, atk: 20, spd: 4, color: '#595045', weapon: 'gravity_hammer', special: 'Fist of Rukt Slam' },
      { name: 'Prophet of Regret', hp: 440, atk: 17, spd: 5, color: '#cca43b', weapon: 'gravity_throne', special: 'Gravity Throne Laser' },
      { name: '343 Guilty Spark Fragment', hp: 470, atk: 18, spd: 6, color: '#9fdfff', weapon: 'monitor_beam', special: 'Containment Protocol' }
    ],
    worldBoss: {
      name: 'Covenant Scarab Mech', hp: 1300, atk: 30, spd: 2, color: '#2c1f30', weapon: 'focus_cannon', special: 'Ultra-Focus Plasma Beam',
      canonicalName: 'Protos-pattern Scarab',
      incarnation: 'Halo 2 (2004) - Metropolis',
      equipment: ['Ultra-heavy focus cannon', 'Heavy plasma repeaters'],
      referenceUrl: 'https://www.halopedia.org/Protos-pattern_Scarab',
      visualAnchor: 'Halo 2 Protos-pattern Scarab: four legs, high purple-gray hull, broad flat deck, arched gangway and passenger cabin. No Halo 3 Deutoros exposed rear reactor.',
      visualReviewStatus: 'pending'
    }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Hunter Bond Pair', hp: 165, atk: 16, spd: 3, color: '#34495e', weapon: 'fuel_rod' },
      { name: 'Brute Captain', hp: 125, atk: 14, spd: 5, color: '#5c5146', weapon: 'spiker' },
      { name: 'Yanme Drone Swarm', hp: 70, atk: 10, spd: 8, color: '#8fbc8f', weapon: 'needle_swarm' },
      { name: 'Flood Carrier Form', hp: 90, atk: 17, spd: 3, color: '#9a8b55', weapon: 'infection_burst' },
      { name: 'Promethean Knight', hp: 135, atk: 15, spd: 5, color: '#f0f7ff', weapon: 'hardlight_blade' }
    ],
    bosses: [
      { name: 'Gravemind Tendril', hp: 720, atk: 24, spd: 2, color: '#6b5a38', weapon: 'flood_mind', special: 'Logic Plague Whisper' },
      { name: 'Ur-Didact Echo', hp: 640, atk: 23, spd: 5, color: '#dfefff', weapon: 'constraint_field', special: 'Composer Pulse' }
    ]
  });
}
