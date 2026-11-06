// Harry Potter — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Cornish Pixie', hp: 60, atk: 7, spd: 7, color: '#3498db', weapon: 'magic' },
      { name: 'Swarming Dementor', hp: 90, atk: 12, spd: 4, color: '#2c3e50', weapon: 'cold' },
      { name: 'Death Eater Scout', hp: 100, atk: 10, spd: 5, color: '#111317', weapon: 'wand' }
    ],
    bosses: [
      { name: 'Lucius Malfoy Lord', hp: 490, atk: 18, spd: 5, color: '#566573', weapon: 'wand', special: 'Crucio Curse Spark' },
      { name: 'Bellatrix Lestrange Witch', hp: 520, atk: 20, spd: 6, color: '#2b1a3d', weapon: 'wand', special: 'Avada Spark Burst' }
    ],
    worldBoss: { name: 'Lord Voldemort Dark Lord', hp: 1450, atk: 35, spd: 4, color: '#17202a', weapon: 'wand', special: 'Fiendfyre Dragon Storm' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Dementor Patrol', hp: 100, atk: 13, spd: 5, color: '#1c1c1c', weapon: 'soul_chill' },
      { name: 'Acromantula Brood', hp: 90, atk: 12, spd: 7, color: '#4b352a', weapon: 'fangs' },
      { name: 'Death Eater Duelist', hp: 110, atk: 14, spd: 6, color: '#2c2c2c', weapon: 'dark_wand' }
    ],
    bosses: [
      { name: 'Basilisk of Secrets', hp: 690, atk: 25, spd: 4, color: '#1f5f3f', weapon: 'venom_fang', special: 'Petrifying Gaze' },
      { name: 'Voldemort Horcrux Echo', hp: 720, atk: 27, spd: 6, color: '#d5dbdb', weapon: 'elder_wand', special: 'Avada Kedavra Lock' }
    ]
  });
}
