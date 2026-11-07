// The Grudge — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'The Grudge',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Saeki House Curse',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Kayako Onryo Curse',
    title: { en: 'The Grudge', fr: 'The Grudge' },
    desc: { en: 'A curse born from rage stains a house, spreading onryo whispers, crawling dread, and inescapable contact.', fr: 'Une malediction nee de la rage tache une maison, propageant murmures onryo, peur rampante et contact inevitable.' },
    hero: { id: 'karen_grudge', name: 'Karen Davis', cat: 'horror', color: '#d8d8cf' },
    allies: [{ id: 'detective_nakagawa', name: 'Detective Nakagawa', cat: 'tactical', color: '#5a6470' }, { id: 'toshio_echo', name: 'Toshio Echo', cat: 'hacker', color: '#bfc7c9' }],
    monsters: ['Crawling Onryo Shade', 'Attic Cat Echo', 'Cursed House Door'],
    bosses: ['Toshio Stairwell Echo', 'Saeki House Lock'],
    worldBoss: 'Kayako Onryo Curse',
    gear: [['grudge_photo', 'Saeki House Photo', 'Photo maison Saeki', { def: 5, hp: 50 }], ['grudge_hair', 'Onryo Hair Thread', 'Meche onryo', { atk: 8 }], ['grudge_tape', 'Case Tape Recorder', 'Magnetophone enquete', { spd: 2, def: 3 }]],
    event: ['evt_grudge_rattle', 'Onryo Death Rattle', 'Rale onryo', 'A crawling curse silences enemy specials for one beat.', 'Une malediction rampante fait taire les specials ennemis un instant.'],
    decor: { sky: ['#181818', '#030303'], floor: 'rgba(180, 180, 170, 0.12)', grid: 'rgba(230, 230, 220, 0.2)', motif: 'hauntedset', accent: '#e6e6dc' }
  });
}
