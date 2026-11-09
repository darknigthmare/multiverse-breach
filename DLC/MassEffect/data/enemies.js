// Mass Effect — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Reaper Husk Ghoul', hp: 70, atk: 9, spd: 6, color: '#8e44ad', weapon: 'melee' },
      { name: 'Collector Drone Soldier', hp: 85, atk: 11, spd: 5, color: '#e59866', weapon: 'laser' },
      { name: 'Geth Trooper Robot', hp: 95, atk: 10, spd: 5, color: '#34495e', weapon: 'plasma_rifle' }
    ],
    bosses: [
      { name: 'Sovereign Reaper Vanguard', hp: 650, atk: 23, spd: 4, color: '#2c3e50', weapon: 'beam', special: 'Red Indoctrination Ray' },
      { name: 'Saren Arterius Corrupted', hp: 520, atk: 19, spd: 6, color: '#7f8c8d', weapon: 'gun', special: 'Geth Glider Board Sweep' }
    ],
    worldBoss: { name: 'Human-Reaper Larva Node', hp: 1380, atk: 32, spd: 3, color: '#d35400', weapon: 'shockwave', special: 'Biotic Singularity Explosion' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Husks Swarm', hp: 75, atk: 10, spd: 6, color: '#6c7a89', weapon: 'shock_grab' },
      { name: 'Geth Rocket Trooper', hp: 100, atk: 13, spd: 5, color: '#2e4053', weapon: 'rocket' },
      { name: 'Cerberus Phantom', hp: 110, atk: 15, spd: 7, color: '#f1c40f', weapon: 'monomolecular_sword' },
      { name: 'Collector Drone', hp: 105, atk: 14, spd: 5, color: '#b7950b', weapon: 'particle_beam' }
    ],
    bosses: [
      { name: 'Saren Arterius', hp: 620, atk: 23, spd: 7, color: '#34495e', weapon: 'sovereign_augments', special: 'Indoctrinated Charge' },
      { name: 'Harbinger Avatar', hp: 680, atk: 25, spd: 5, color: '#d35400', weapon: 'collector_beam', special: 'Assuming Direct Control' }
    ]
  });
}
