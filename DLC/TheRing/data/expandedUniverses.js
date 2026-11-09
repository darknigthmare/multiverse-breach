// The Ring — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'The Ring',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Cursed Tape Seven Days',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Samara Tape Curse',
    title: { en: 'The Ring', fr: 'The Ring' },
    desc: { en: 'Cursed videotape static, wells, wet hair, and seven-day dread crawl through the Nexus screen.', fr: 'Statique de cassette maudite, puits, cheveux trempes et terreur des sept jours rampent hors de l ecran du Nexus.' },
    hero: { id: 'rachel_ring', name: 'Rachel Keller', cat: 'tactical', color: '#4f5f66' },
    allies: [{ id: 'aiden_ring', name: 'Aidan Keller', cat: 'hacker', color: '#9ca8ad' }, { id: 'noah_ring', name: 'Noah Clay', cat: 'marine', color: '#6f7d82' }],
    monsters: ['Cursed Tape Static', 'Wet Footprint Shade', 'Well Water Hand'],
    bosses: ['Seven Days Phone Call', 'Cursed Horse Vision'],
    worldBoss: 'Samara Tape Curse',
    gear: [['ring_tape', 'Cursed Tape', 'Cassette maudite', { atk: 8, spd: 1 }], ['ring_photo', 'Distorted Photo', 'Photo deformee', { def: 4, hp: 60 }], ['ring_well_stone', 'Well Stone', 'Pierre du puits', { hp: 90 }]],
    event: ['evt_ring_seven_days', 'Seven Days Deadline', 'Deadline sept jours', 'The tape curse marks the strongest enemy for delayed collapse.', 'La cassette marque l ennemi le plus fort pour un effondrement differe.'],
    decor: { sky: ['#12191b', '#020303'], floor: 'rgba(80, 105, 110, 0.16)', grid: 'rgba(190, 220, 220, 0.22)', motif: 'hauntedset', accent: '#bedcdc' }
  });
}
