// Dead Space — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Necromorph Slasher Scythe', hp: 85, atk: 12, spd: 6, color: '#a04000', weapon: 'claws' },
      { name: 'Necromorph Leaper Demon', hp: 70, atk: 11, spd: 7, color: '#566573', weapon: 'tail' },
      { name: 'Necromorph Lurker Pod', hp: 60, atk: 10, spd: 5, color: '#4d5656', weapon: 'spit' }
    ],
    bosses: [
      { name: 'Necromorph Infector Pod', hp: 450, atk: 16, spd: 6, color: '#7d6608', weapon: 'inject', special: 'T-Virus Necromorph Infection' },
      { name: 'Armored Brute Smasher', hp: 650, atk: 22, spd: 3, color: '#5c4033', weapon: 'fists', special: 'Bulldozer Charge Slam' }
    ],
    worldBoss: { name: 'Giant Hive Mind Leviathan', hp: 1500, atk: 35, spd: 3, color: '#2c1e15', weapon: 'tentacles', special: 'Planet Crushing Tentacle Slam' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Slasher Necromorph', hp: 90, atk: 13, spd: 5, color: '#9a6b44', weapon: 'bone_blades' },
      { name: 'Pregnant Necromorph', hp: 135, atk: 12, spd: 3, color: '#7a5b45', weapon: 'swarm_burst' },
      { name: 'Exploder Necromorph', hp: 70, atk: 17, spd: 5, color: '#d4ac0d', weapon: 'acid_sac' },
      { name: 'Divider Necromorph', hp: 120, atk: 14, spd: 4, color: '#6e4f39', weapon: 'split_attack' }
    ],
    bosses: [
      { name: 'Hunter Regenerator', hp: 650, atk: 21, spd: 5, color: '#4d342f', weapon: 'regrowth_claws', special: 'Impossible Regeneration' },
      { name: 'Hive Mind Aegis VII', hp: 760, atk: 28, spd: 3, color: '#5c2018', weapon: 'tentacles', special: 'Marker Hive Crush' }
    ]
  });
}
