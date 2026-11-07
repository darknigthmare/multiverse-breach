// Oliver Tree — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Oliver Tree',
    mediaType: 'music',
    faction: 'cyber',
    stageName: 'Turbo Scooter Suburb',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Turbo Scooter Breakdown',
    title: { en: 'Oliver Tree', fr: 'Oliver Tree' },
    desc: {
      en: 'A surreal pop-punk scooter world with bowl cuts, meme stunts, oversized props, and chaotic velocity.',
      fr: 'Un monde pop-punk surrealiste de trottinettes, coupes au bol, cascades meme et vitesse chaotique.'
    },
    hero: { id: 'oliver_tree', name: 'Oliver Tree', cat: 'hacker', color: '#d8d43f' },
    allies: [
      { id: 'turbo_oliver_tree', name: 'Turbo Oliver', cat: 'slayer', color: '#ff6f3c' },
      { id: 'cowboy_tears_oliver', name: 'Cowboy Tears Oliver', cat: 'tactical', color: '#34495e' }
    ],
    monsters: ['Turbo Scooter Crash', 'Alien Boy UFO Glitch', 'Miss You Viral Echo'],
    bosses: ['Bowl Cut Persona', 'Cowboy Tears Rodeo Loop'],
    worldBoss: 'Turbo Scooter Breakdown',
    gear: [
      ['ot_turbo_scooter', 'Turbo Scooter', 'Trottinette turbo', { spd: 3, atk: 5 }],
      ['ot_bowl_helmet', 'Bowl-Cut Helmet', 'Casque coupe au bol', { def: 6, hp: 40 }],
      ['ot_viral_camera', 'Viral Camera Rig', 'Camera virale', { atk: 7, spd: 1 }]
    ],
    event: ['evt_ot_scooter', 'Scooter Crash Cut', 'Crash cut trottinette', 'A viral scooter crash interrupts enemies and grants speed.', 'Un crash viral interrompt les ennemis et donne de la vitesse.'],
    decor: { sky: ['#263644', '#05070a'], floor: 'rgba(196, 186, 65, 0.16)', grid: 'rgba(255, 111, 60, 0.3)', motif: 'portalgarage', accent: '#ff6f3c' }
  });
}
