// Kung Pow — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Kung Pow',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Chosen One Dub Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Master Pain Betty',
    title: { en: 'Kung Pow', fr: 'Kung Pow' },
    desc: { en: 'Absurd martial arts dubbing, impossible training, and joke-fu bend combat timing into parody resonance.', fr: 'Doublage martial absurde, entrainement impossible et joke-fu tordent le timing du combat en resonance parodique.' },
    hero: { id: 'chosen_one_kungpow', name: 'The Chosen One', cat: 'slayer', color: '#d6c09a' },
    allies: [{ id: 'woah_kungpow', name: 'Master Tang', cat: 'hacker', color: '#9d6f45' }, { id: 'ling_kungpow', name: 'Ling', cat: 'tactical', color: '#b85f6d' }],
    monsters: ['Bad Dub Fighter', 'Training Dummy Cow', 'Evil Council Grunt'],
    bosses: ['Moo Nieu Beast', 'Betty Disciple'],
    worldBoss: 'Master Pain Betty',
    gear: [['kp_tongue', 'Chosen Tongue Scar', 'Cicatrice langue choisie', { atk: 7, spd: 1 }], ['kp_bowl', 'Training Bowl', 'Bol entrainement', { def: 5, hp: 55 }], ['kp_dub_scroll', 'Bad Dub Scroll', 'Parchemin mauvais doublage', { atk: 8 }]],
    event: ['evt_kp_weeooweeoo', 'Wee-Oo Timing Break', 'Rupture Wee-Oo', 'A dubbed timing break makes enemies miss their next action.', 'Une rupture de timing double fait rater la prochaine action ennemie.'],
    decor: { sky: ['#2d2414', '#070503'], floor: 'rgba(190, 142, 71, 0.18)', grid: 'rgba(255, 212, 115, 0.26)', motif: 'arena', accent: '#ffd473' }
  });
}
