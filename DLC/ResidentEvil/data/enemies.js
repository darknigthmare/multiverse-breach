// Resident Evil — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'T-Virus Zombie', hp: 70, atk: 8, spd: 3, color: '#7d6608', weapon: 'bite' },
      { name: 'Zombie Dog (Cerberus)', hp: 60, atk: 10, spd: 6, color: '#4a3f35', weapon: 'bite' },
      { name: 'Ceiling-Clinging Licker', hp: 90, atk: 12, spd: 6, color: '#900c3f', weapon: 'tongue' },
      { name: 'Hunter Beta', hp: 115, atk: 14, spd: 6, color: '#315c31', weapon: 'claws' },
      { name: 'G-Embryo Mutant', hp: 105, atk: 13, spd: 4, color: '#a04a2b', weapon: 'mutation_burst' }
    ],
    bosses: [
      { name: 'Nemesis T-Type', hp: 600, atk: 24, spd: 4, color: '#2c3539', weapon: 'rocket_launcher', special: 'Tentacle Bind Slam' },
      { name: 'Albert Wesker', hp: 520, atk: 21, spd: 8, color: '#1a1a1a', weapon: 'gun', special: 'Uroboros Dash Strike' },
      { name: 'Mr. X T-00 Tyrant', hp: 560, atk: 22, spd: 3, color: '#30333a', weapon: 'crushing_fist', special: 'Stalker Door Breach' }
    ],
    worldBoss: { name: 'William Birkin G-Stage 4', hp: 1400, atk: 33, spd: 4, color: '#5c2018', weapon: 'claws', special: 'G-Virus Mutation Cascade' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Crimson Head Prototype', hp: 95, atk: 14, spd: 7, color: '#8b1e16', weapon: 'claws' },
      { name: 'Ganado Plaga Host', hp: 85, atk: 12, spd: 5, color: '#5d4037', weapon: 'axe' },
      { name: 'Regenerator Lab Specimen', hp: 145, atk: 15, spd: 4, color: '#c9c7b8', weapon: 'stretch_claws' },
      { name: 'Ivy Plant B.O.W.', hp: 120, atk: 13, spd: 3, color: '#2e7d32', weapon: 'acid_vines' }
    ],
    bosses: [
      { name: 'Lisa Trevor Memory', hp: 620, atk: 21, spd: 4, color: '#6b4b40', weapon: 'chains', special: 'Undying Pursuit' },
      { name: 'Jack Baker Molded Patriarch', hp: 650, atk: 24, spd: 5, color: '#3d2d28', weapon: 'chainsaw_shear', special: 'Welcome to the Family' }
    ]
  });
}
