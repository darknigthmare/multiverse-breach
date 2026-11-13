// Portal — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Aperture Security Turret', hp: 60, atk: 10, spd: 5, color: '#ececec', weapon: 'gun' },
      { name: 'Defective Red Eye Turret', hp: 50, atk: 13, spd: 5, color: '#c0392b', weapon: 'shoot' },
      { name: 'Sentry Drone Sphere', hp: 75, atk: 9, spd: 7, color: '#7f8c8d', weapon: 'tackle' }
    ],
    bosses: [
      { name: 'Wheatley Central AI', hp: 510, atk: 18, spd: 6, color: '#2980b9', weapon: 'bombs', special: 'Portal Loop Crush' },
      { name: 'Neurotoxin Vent System', hp: 440, atk: 16, spd: 4, color: '#27ae60', weapon: 'poison', special: 'Choking Gas Cascade' }
    ],
    worldBoss: { name: 'GLaDOS Central Core', hp: 1300, atk: 29, spd: 4, color: '#1a1a1a', weapon: 'rocket', special: 'Neurotoxin & Robotic Claw Smash' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Frankenturret Cube', hp: 90, atk: 10, spd: 4, color: '#dfe6e9', weapon: 'hop_crush' },
      { name: 'Rocket Turret Mount', hp: 100, atk: 15, spd: 3, color: '#bdc3c7', weapon: 'rocket' },
      { name: 'Excursion Funnel Hazard', hp: 80, atk: 9, spd: 5, color: '#85c1e9', weapon: 'tractor_beam' }
    ],
    bosses: [
      { name: 'Fact Core Logic Snare', hp: 420, atk: 15, spd: 5, color: '#f1c40f', weapon: 'false_fact', special: 'Contradiction Cascade' },
      { name: 'Space Core Vacuum Loop', hp: 450, atk: 16, spd: 8, color: '#2980b9', weapon: 'orbit_loop', special: 'SPAAACE Pull' }
    ]
  });
}
