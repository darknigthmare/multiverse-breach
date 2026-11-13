// Saw — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Pighead Trap Patrol', hp: 85, atk: 10, spd: 5, color: '#566573', weapon: 'knife' },
      { name: 'Trap-Bound Panic Victim', hp: 70, atk: 9, spd: 6, color: '#cca43b', weapon: 'slam' },
      { name: 'Sawblade Drone Sentry', hp: 60, atk: 13, spd: 7, color: '#95a5a6', weapon: 'saw' }
    ],
    bosses: [
      { name: 'Amanda Young Accomplice', hp: 480, atk: 18, spd: 7, color: '#78281f', weapon: 'knife', special: 'Pig Mask Stabbing Rush' },
      { name: 'Hoffman Detective Trapper', hp: 520, atk: 19, spd: 5, color: '#2e4053', weapon: 'gun', special: 'Locked Room Gas Countdown' }
    ],
    worldBoss: { name: 'Jigsaw Classroom Trap Hub', hp: 1200, atk: 28, spd: 4, color: '#1b2631', weapon: 'machinery', special: 'Reverse Bear Trap Clamping' }
  });
}
