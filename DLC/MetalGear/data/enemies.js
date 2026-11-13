// Metal Gear — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Genome Soldier Patrol', hp: 80, atk: 8, spd: 5, color: '#7f8c8d', weapon: 'gun' },
      { name: 'Cyborg Ninja Drone', hp: 75, atk: 13, spd: 8, color: '#2c3e50', weapon: 'sword' },
      { name: 'Overwatch Gurlukovich Soldier', hp: 85, atk: 10, spd: 5, color: '#212f3d', weapon: 'gun' }
    ],
    bosses: [
      { name: 'Liquid Snake', hp: 550, atk: 19, spd: 6, color: '#7f5c38', weapon: 'fists', special: 'Hind D Gunship Support' },
      { name: 'Revolver Ocelot Champion', hp: 480, atk: 18, spd: 7, color: '#7b7d7d', weapon: 'gun', special: 'Six-Shot Ricochet Bullet' }
    ],
    worldBoss: { name: 'Metal Gear RAY Goliath', hp: 1400, atk: 33, spd: 3, color: '#17202a', weapon: 'missiles', special: 'Water Jet Cutter Cannon' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'FROG Haven Trooper', hp: 100, atk: 12, spd: 7, color: '#5d6d7e', weapon: 'p90' },
      { name: 'Dwarf Gekko Swarm', hp: 70, atk: 10, spd: 8, color: '#bdc3c7', weapon: 'grapple' },
      { name: 'Gekko Walker', hp: 130, atk: 15, spd: 5, color: '#7f8c8d', weapon: 'leg_stomp' }
    ],
    bosses: [
      { name: 'Psycho Mantis Memory', hp: 520, atk: 18, spd: 7, color: '#6c3483', weapon: 'psychic_control', special: 'Controller Port Read' },
      {
        name: 'Metal Gear REX Shadow', canonicalName: 'Metal Gear REX',
        hp: 720, atk: 26, spd: 3, color: '#455a64', weapon: 'rex_machine_gun', special: 'Radome Break',
        incarnation: 'Metal Gear Solid (1998) - Shadow Moses',
        referenceUrl: 'https://www.konami.com/mg/history/us/en/',
        visualAnchor: 'Metal Gear REX from Metal Gear Solid (1998): gray-black bipedal chassis, railgun, radome, missile pods and exposed cockpit after the radome breaks. Shadow is a historical asset name, not another REX incarnation; no RAY or Gekko parts.',
        visualReviewStatus: 'pending'
      }
    ]
  });
}
