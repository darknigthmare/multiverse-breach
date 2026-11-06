// Le Cinquième Element — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Mangalore Commando', hp: 95, atk: 11, spd: 4, color: '#797d7f', weapon: 'gun' },
      { name: 'Zorg Mercenary Thug', hp: 80, atk: 10, spd: 5, color: '#9a7d0a', weapon: 'laser' },
      { name: 'Shadow Parasite Spawn', hp: 60, atk: 13, spd: 7, color: '#17202a', weapon: 'claws' }
    ],
    bosses: [
      { name: 'Jean-Baptiste Zorg Leader', hp: 480, atk: 17, spd: 6, color: '#d35400', weapon: 'gun', special: 'ZF-1 Replay Rocket' },
      { name: 'Mangalore Chieftain Aknot', hp: 520, atk: 19, spd: 4, color: '#565d6d', weapon: 'rifle', special: 'Heavy Grenade Launch' }
    ],
    worldBoss: { name: 'The Ultimate Evil Sphere', hp: 1380, atk: 32, spd: 2, color: '#1a0505', weapon: 'darkness', special: 'Cosmic Incineration Flare' }
  });
}
