// Silent Hill — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Lying Figure Spitter', hp: 75, atk: 9, spd: 4, color: '#bb8f8f', weapon: 'acid_breath' },
      { name: 'Bubble Head Nurse', hp: 90, atk: 11, spd: 5, color: '#e0d3bf', weapon: 'rust_pipe' },
      { name: 'Grey Child Memory', hp: 65, atk: 8, spd: 6, color: '#5a5d64', weapon: 'knife_swarm' },
      { name: 'Mannequin Twitcher', hp: 85, atk: 10, spd: 5, color: '#b48a78', weapon: 'leg_snap' },
      { name: 'Otherworld Crawler', hp: 105, atk: 13, spd: 4, color: '#6b2d24', weapon: 'rust_claws' }
    ],
    bosses: [
      { name: 'Pyramid Head Executioner', hp: 650, atk: 22, spd: 2, color: '#5c1e18', weapon: 'great_knife', special: 'Great Knife Sentence' },
      { name: 'Abstract Daddy Demon', hp: 520, atk: 18, spd: 3, color: '#7a6860', weapon: 'flesh_wall', special: 'Memory Room Crush' },
      { name: 'Claudia Order Prophet', hp: 500, atk: 17, spd: 4, color: '#8d7b60', weapon: 'ritual_word', special: 'God-Birth Invocation' }
    ],
    worldBoss: { name: 'God of the Otherworld Core', hp: 1400, atk: 32, spd: 3, color: '#3b0000', weapon: 'rust_fire', special: 'Siren Apocalypse Birth' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Closer Hallway Giant', hp: 130, atk: 14, spd: 3, color: '#9c7a6a', weapon: 'arm_slam' },
      { name: 'Mandarin Undergrate', hp: 95, atk: 12, spd: 4, color: '#7d544a', weapon: 'floor_grab' },
      { name: 'Needler Street Horror', hp: 110, atk: 13, spd: 5, color: '#69423d', weapon: 'bone_lance' },
      { name: 'Schism Split-Face', hp: 120, atk: 15, spd: 4, color: '#7a5b55', weapon: 'head_blade' }
    ],
    bosses: [
      { name: 'Memory of Alessa', hp: 590, atk: 20, spd: 5, color: '#6c3483', weapon: 'psychic_fire', special: 'Incubator Trial' },
      { name: 'Mary Maria Echo', hp: 540, atk: 18, spd: 5, color: '#c27a7a', weapon: 'grief_chain', special: 'Letter From the Dead' }
    ]
  });
}
