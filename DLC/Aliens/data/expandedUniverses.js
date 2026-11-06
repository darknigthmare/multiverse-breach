// Aliens — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Aliens',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Hadleys Hope Last Stand',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Alien Queen',
    title: { en: 'Aliens', fr: 'Aliens' },
    desc: {
      en: 'Colonial Marines, motion trackers, sentry corridors, and the hive war for Hadley s Hope.',
      fr: 'Marines coloniaux, detecteurs de mouvement, couloirs sous tourelles et guerre de ruche a Hadley s Hope.'
    },
    hero: { id: 'hicks_aliens', name: 'Corporal Hicks', cat: 'marine', color: '#6b7767' },
    allies: [
      { id: 'vasquez_aliens', name: 'Vasquez', cat: 'slayer', color: '#8f8f76' },
      { id: 'bishop_aliens', name: 'Bishop', cat: 'hacker', color: '#dfe6e9' }
    ],
    monsters: ['Warrior Xenomorph', 'Facehugger Nest', 'Acid Spitter'],
    bosses: ['Praetorian Guard', 'Power Loader Duel'],
    worldBoss: 'Alien Queen',
    gear: [
      ['aliens_pulse_rifle', 'M41A Pulse Rifle', 'Fusil M41A', { atk: 10, hp: 40 }],
      ['aliens_tracker', 'Motion Tracker', 'Detecteur de mouvement', { spd: 2, def: 4 }],
      ['aliens_sentry', 'UA 571-C Sentry Gun', 'Tourelle sentinelle', { atk: 8, def: 5 }]
    ],
    event: ['evt_aliens_sentries', 'Sentry Corridor', 'Couloir de sentinelles', 'Automated sentries rake the battlefield with pulse fire.', 'Des tourelles automatiques balayent le terrain au tir pulse.'],
    decor: { sky: ['#0b1d24', '#020608'], floor: 'rgba(88, 113, 116, 0.19)', grid: 'rgba(120, 227, 230, 0.25)', motif: 'hive', accent: '#78e3e6' }
  });
}
