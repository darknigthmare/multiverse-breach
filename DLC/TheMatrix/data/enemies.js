// The Matrix — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Matrix Security SWAT Program', hp: 80, atk: 9, spd: 5, color: '#2b2b2b', weapon: 'system_rifle' },
      { name: 'Agent Possessed Host', hp: 105, atk: 13, spd: 7, color: '#1f2b1f', weapon: 'agent_pistol' },
      { name: 'Rogue Exile Cyber-Program', hp: 90, atk: 11, spd: 6, color: '#27ae60', weapon: 'code_blade' },
      { name: 'Sentinel Squid Drone', hp: 100, atk: 12, spd: 6, color: '#7f8c8d', weapon: 'machine_laser' },
      { name: 'Merovingian Twin Ghost', hp: 85, atk: 12, spd: 8, color: '#dfe6e9', weapon: 'phase_knife' }
    ],
    bosses: [
      { name: 'Agent Smith Clone', hp: 620, atk: 22, spd: 8, color: '#1a1d24', weapon: 'system_rewrite', special: 'Viral Replication Punch' },
      { name: 'Agent Jones Squad', hp: 500, atk: 18, spd: 7, color: '#2b2c30', weapon: 'agent_pistol', special: 'Perfect Dodge Protocol' },
      { name: 'Merovingian Exile Court', hp: 540, atk: 19, spd: 6, color: '#243323', weapon: 'causality_code', special: 'Choice Denial Loop' }
    ],
    worldBoss: { name: 'Deus Ex Machina Source Core', hp: 1480, atk: 34, spd: 4, color: '#09080d', weapon: 'machine_swarm', special: 'Source Reset Pulse' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Agent Brown Program', hp: 120, atk: 14, spd: 8, color: '#1f1f1f', weapon: 'pistol' },
      { name: 'Agent Thompson Program', hp: 125, atk: 15, spd: 8, color: '#202820', weapon: 'desert_eagle' },
      { name: 'Twin Exile Ghost', hp: 100, atk: 13, spd: 7, color: '#d7d7d7', weapon: 'phase_blade' },
      { name: 'Machine Sentinel Swarm', hp: 110, atk: 14, spd: 6, color: '#7f8c8d', weapon: 'cutters' }
    ],
    bosses: [
      { name: 'Merovingian Exile Lord', hp: 540, atk: 18, spd: 6, color: '#8e6e53', weapon: 'causality_code', special: 'Cause and Effect Trap' },
      { name: 'Architect White Room', hp: 620, atk: 20, spd: 4, color: '#ecf0f1', weapon: 'choice_matrix', special: 'Reload the Equation' }
    ]
  });
}
