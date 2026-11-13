// Stargate — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Jaffa Serpent Guard', hp: 95, atk: 9, spd: 4, color: '#f1c40f', weapon: 'ma_tok_staff', spriteSource: '/sprites/generated/bosses/stargate/jaffa-serpent-guard.png' },
      { name: 'Replicator Insect Drone', hp: 60, atk: 12, spd: 7, color: '#95a5a6', weapon: 'replicator_claws', spriteSource: '/sprites/generated/bosses/stargate/replicator-insect-drone.png' },
      { name: 'Anubis Jackal Guard (1994)', hp: 100, atk: 10, spd: 4, color: '#2c3e50', weapon: 'jackal_staff', spriteSource: '/sprites/generated/bosses/stargate/anubis-jackal-guard-1994.png' },
      { name: 'Kull Warrior Prototype', hp: 135, atk: 14, spd: 4, color: '#1f1f24', weapon: 'kull_blaster', spriteSource: '/sprites/generated/bosses/stargate/kull-warrior-prototype.png' },
      { name: 'Ashrak Assassin', hp: 85, atk: 15, spd: 7, color: '#6d4c41', weapon: 'stealth_blade' }
    ],
    bosses: [
      { name: 'Lord Apophis Goa\'uld', hp: 500, atk: 18, spd: 5, color: '#d4af37', weapon: 'hand_ribbon', special: 'Shield Barrier Blast' },
      { name: 'Ba\'al Clone Commander', hp: 470, atk: 17, spd: 6, color: '#a04000', weapon: 'goauld_device', special: 'Clone Command Loop' },
      { name: 'Replicator Queen Node', hp: 540, atk: 20, spd: 5, color: '#b8c0c8', weapon: 'nanite_swarm', special: 'Self-Assembly Flood' }
    ],
    worldBoss: { name: 'Anubis Flagship Nexus', hp: 1290, atk: 30, spd: 3, color: '#0b162a', weapon: 'ancient_beam', special: 'Ascended Hyperspace Weapon Array' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Horus Guard Phalanx', hp: 105, atk: 10, spd: 4, color: '#d4af37', weapon: 'staff_weapon' },
      { name: 'Unas Host Warrior', hp: 125, atk: 13, spd: 5, color: '#6d4c41', weapon: 'claws' },
      { name: 'Ori Prior Convert', hp: 115, atk: 14, spd: 4, color: '#f5e6a1', weapon: 'prior_staff' }
    ],
    bosses: [
      { name: 'Ra Sun-God System Lord', hp: 560, atk: 20, spd: 5, color: '#f1c40f', weapon: 'ribbon_device', special: 'Pyramid Ship Command' },
      { name: 'Replicator Carter Echo', hp: 590, atk: 21, spd: 6, color: '#b8c0c8', weapon: 'nanite_blade', special: 'Human-Form Replication' }
    ]
  });
}
