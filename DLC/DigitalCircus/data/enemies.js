// Digital Circus — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Creeping Gloink Bug', hp: 60, atk: 7, spd: 6, color: '#e74c3c', weapon: 'bite' },
      { name: 'Circus Juggler Toy', hp: 75, atk: 9, spd: 6, color: '#3498db', weapon: 'juggling' },
      { name: 'Cardboard Stage Mannequin', hp: 80, atk: 8, spd: 5, color: '#d5dbdb', weapon: 'slam' }
    ],
    bosses: [
      { name: 'Kaufmo Abstracted Beast', hp: 550, atk: 20, spd: 6, color: '#212f3d', weapon: 'glitch_claws', special: 'Dimensional Claws Chaos' },
      { name: 'Possessed Ragatha Doll', hp: 460, atk: 16, spd: 6, color: '#a93226', weapon: 'fists', special: 'Stitched Doll Panic Rush' }
    ],
    worldBoss: { name: 'Caine Ringmaster AI', hp: 1250, atk: 29, spd: 5, color: '#d4ac0d', weapon: 'eyes', special: 'Circus Stage Glitch Reset' }
  });
}
