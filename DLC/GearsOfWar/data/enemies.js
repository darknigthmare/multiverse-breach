// Gears of War — definitions consumed by src/game/enemies.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createEnemiesDb() {
  return ({
    monsters: [
      { name: 'Locust Drone', hp: 90, atk: 9, spd: 4, color: '#6e7a68', weapon: 'gun' },
      { name: 'Locust Wretch', hp: 70, atk: 11, spd: 6, color: '#535c50', weapon: 'claws' },
      { name: 'Explosive Ticker', hp: 50, atk: 16, spd: 8, color: '#cca43b', weapon: 'suicide' }
    ],
    bosses: [
      {
        name: 'General RAAM', hp: 450, atk: 18, spd: 3, color: '#3c4238', weapon: 'gun', special: 'Kryll Swarm',
        canonicalName: 'General RAAM',
        incarnation: 'Gears of War (2006) - Lightmass Bomb train',
        equipment: ['Troika heavy machine gun', 'Kryll swarm'],
        referenceUrl: 'https://en.wikipedia.org/wiki/Gears_of_War_(video_game)',
        visualAnchor: 'Huge pale Locust general, dark heavy armor, Troika heavy machine gun and protective Kryll swarm on the moving Lightmass Bomb train. No Skorge chainsaw staff or Brumak vehicle.',
        visualReviewStatus: 'pending'
      },
      { name: 'High Priest Skorge', hp: 420, atk: 19, spd: 4, color: '#4a3f35', weapon: 'staff', special: 'Chainsaw Staff Slice' }
    ],
    worldBoss: { name: 'Gargantuan Brumak', hp: 1200, atk: 28, spd: 2, color: '#272d24', weapon: 'rockets', special: 'Back-Mounted Rocket Barrage' }
  });
}

export function createCanonEnemyExpansion() {
  return ({
    monsters: [
      { name: 'Theron Guard', hp: 112, atk: 13, spd: 5, color: '#7b6a52', weapon: 'torque_bow' },
      { name: 'Boomer Locust', hp: 145, atk: 16, spd: 3, color: '#5d4a3b', weapon: 'boomshot' },
      { name: 'Kantus Priest', hp: 100, atk: 12, spd: 5, color: '#8d6b45', weapon: 'gorgon_pistol' },
      { name: 'Corpser Hatchling', hp: 130, atk: 14, spd: 4, color: '#3b2d28', weapon: 'burrow_claws' }
    ],
    bosses: [
      { name: 'Berserker Matriarch', hp: 620, atk: 24, spd: 4, color: '#6b2d2d', weapon: 'charge', special: 'Blind Rage Charge' },
      { name: 'Karn Locust General', hp: 570, atk: 22, spd: 5, color: '#2f3a30', weapon: 'sniper', special: 'Siege Beast Command' }
    ]
  });
}
