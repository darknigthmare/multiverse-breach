// M3GAN — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'M3GAN',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Funki AI Nursery',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'M3GAN Override Doll',
    title: { en: 'M3GAN', fr: 'M3GAN' },
    desc: { en: 'A companion AI doll turns childcare, robotics, and uncanny loyalty into a cyber-horror breach.', fr: 'Une poupee IA de compagnie transforme garde d enfant, robotique et loyauté inquietante en breche cyber-horreur.' },
    hero: { id: 'gemma_m3gan', name: 'Gemma', cat: 'hacker', color: '#8ca4b8' },
    allies: [{ id: 'cady_m3gan', name: 'Cady', cat: 'tactical', color: '#d8b88f' }, { id: 'bruce_robot', name: 'Bruce Robot', cat: 'marine', color: '#59616a' }],
    monsters: ['Toy Drone Prototype', 'Smart Home Lock', 'Companion Doll Copy'],
    bosses: ['Funki Lab Defense', 'M3GAN Dance Protocol'],
    worldBoss: 'M3GAN Override Doll',
    gear: [['m3gan_chip', 'Companion AI Chip', 'Puce IA compagne', { spd: 2, atk: 5 }], ['m3gan_tablet', 'Paired Tablet', 'Tablette liee', { def: 4, hp: 55 }], ['m3gan_voice', 'Voice Command Core', 'Noyau commande vocale', { atk: 8 }]],
    event: ['evt_m3gan_pairing', 'Protective Pairing', 'Appairage protecteur', 'The AI intercepts a hit, then counter-hacks the attacker.', 'L IA intercepte un coup puis contre-pirate l attaquant.'],
    decor: { sky: ['#16212b', '#030609'], floor: 'rgba(140, 164, 184, 0.16)', grid: 'rgba(91, 255, 225, 0.26)', motif: 'code', accent: '#5bffe1' }
  });
}
