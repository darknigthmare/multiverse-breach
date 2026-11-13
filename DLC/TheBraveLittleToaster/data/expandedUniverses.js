// The Brave Little Toaster — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'The Brave Little Toaster',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Appliance Junkyard Run',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Junkyard Magnet',
    title: { en: 'The Brave Little Toaster', fr: 'Le Petit Grille-Pain courageux' },
    desc: {
      en: 'A bittersweet appliance odyssey where loyal machines cross hostile roads, repair shops, and junkyards.',
      fr: 'Une odyssee douce-amere d appareils fideles traversant routes, ateliers et decharges hostiles.'
    },
    hero: { id: 'toaster_brave', name: 'Toaster', cat: 'slayer', color: '#dfe6e9' },
    allies: [
      { id: 'lampy_brave', name: 'Lampy', cat: 'hacker', color: '#f1c40f' },
      { id: 'kirby_brave', name: 'Kirby', cat: 'marine', color: '#8e5b3a' }
    ],
    monsters: ['Repair Shop Clamp', 'Junkyard Crusher', 'Storm Drain Spark'],
    bosses: ['Air Conditioner Rage', 'Giant Magnet Arm'],
    worldBoss: 'Junkyard Magnet',
    gear: [
      ['toaster_chrome_slot', 'Chrome Toast Slot', 'Fente chrome', { def: 7 }],
      ['lampy_bulb', 'Lampy Bulb', 'Ampoule Lampy', { atk: 7, spd: 1 }],
      ['kirby_vacuum_bag', 'Kirby Vacuum Bag', 'Sac aspirateur Kirby', { hp: 85 }]
    ],
    event: ['evt_toaster_spark', 'Appliance Loyalty Surge', 'Surtension de loyauté', 'The appliance squad sparks the field and shields allies.', 'Les appareils creent une surtension et protegent les allies.'],
    decor: { sky: ['#27313a', '#050608'], floor: 'rgba(190, 160, 105, 0.17)', grid: 'rgba(241, 196, 15, 0.28)', motif: 'toyfactory', accent: '#f1c40f' }
  });
}
