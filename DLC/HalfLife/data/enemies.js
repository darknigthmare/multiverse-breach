// Half-Life — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Leaping Headcrab Zombie', hp: 70, atk: 8, spd: 4, color: '#8d6e63', weapon: 'claws' },
      { name: 'Combine Overwatch Soldier', hp: 85, atk: 10, spd: 5, color: '#34495e', weapon: 'gun' },
      { name: 'Acid-Spitting Bullsquid', hp: 90, atk: 11, spd: 5, color: '#d35400', weapon: 'acid' },
      { name: 'Vortigaunt Shock Trooper', hp: 105, atk: 13, spd: 5, color: '#6f8f4f', weapon: 'vortessence' },
      { name: 'Race X Shock Trooper', hp: 115, atk: 14, spd: 4, color: '#6b4b8a', weapon: 'spore_launcher' }
    ],
    bosses: [
      { name: 'Combine Gunship', hp: 560, atk: 20, spd: 5, color: '#424949', weapon: 'laser', special: 'Pulse Cannon Barrage' },
      {
        name: 'Alien Nihilanth Core', hp: 520, atk: 19, spd: 3, color: '#cca43b', weapon: 'portal_psionics', special: 'Teleportation Orb',
        canonicalName: 'Nihilanth',
        incarnation: 'Half-Life (1998) - Xen finale',
        equipment: ['Energy projectiles', 'Teleportation orbs', 'Orbiting energy spheres'],
        referenceUrl: 'https://combineoverwiki.net/wiki/Nihilanth',
        visualAnchor: 'Massive floating Nihilanth with an oversized head, small legs and vestigial chest arm, shackles, orange orbiting spheres and a head that opens over its brain. Organic Xen crystal cavern, never a Combine core or a Strider.',
        visualReviewStatus: 'pending'
      },
      { name: 'Gonarch Brood Mother', hp: 540, atk: 21, spd: 4, color: '#d6b36a', weapon: 'headcrab_brood', special: 'Headcrab Swarm Birth' }
    ],
    worldBoss: { name: 'Combine Strider Heavy', hp: 1350, atk: 33, spd: 3, color: '#2c3e50', weapon: 'warp_cannon', special: 'Dark Energy Impale' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Houndeye Pack', hp: 75, atk: 11, spd: 6, color: '#7d6f3f', weapon: 'sonic_blast' },
      { name: 'Barnacle Ceiling Trap', hp: 65, atk: 10, spd: 2, color: '#a36b6b', weapon: 'tongue_grab' },
      { name: 'Antlion Guard Larva', hp: 130, atk: 15, spd: 6, color: '#8e6f2e', weapon: 'charge' }
    ],
    bosses: [
      { name: 'HECU Black Ops Squad', hp: 500, atk: 18, spd: 7, color: '#111317', weapon: 'suppressed_fire', special: 'Black Mesa Cleanup' },
      { name: 'Advisor Pod Core', hp: 650, atk: 22, spd: 4, color: '#5d4a73', weapon: 'psychic_lift', special: 'Neural Harvest' }
    ]
  });
}
