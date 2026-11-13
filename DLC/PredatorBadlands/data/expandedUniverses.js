// Predator: Badlands — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Predator: Badlands',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Badlands Exile Hunt',
    mode: 'RPG',
    difficulty: 'Expert',
    bossName: 'Exiled Yautja Warlord',
    title: { en: 'Predator: Badlands', fr: 'Predator: Badlands' },
    desc: {
      en: 'A hostile future badlands hunt built around an outcast Yautja, brutal terrain, and survival through exile.',
      fr: 'Une chasse futuriste en terres hostiles, centree sur un Yautja exile, un terrain brutal et la survie.'
    },
    hero: { id: 'dek_badlands', name: 'Dek', cat: 'slayer', color: '#5d4b36' },
    allies: [
      { id: 'thia_badlands', name: 'Thia', cat: 'hacker', color: '#c7d6d2' },
      { id: 'badlands_scout', name: 'Badlands Scout', cat: 'tactical', color: '#9a6a3f' }
    ],
    monsters: ['Badlands Scavenger', 'Wasteland Drone', 'Exile Trial Beast'],
    bosses: ['Ridge Ambusher', 'Clan Executioner'],
    worldBoss: 'Exiled Yautja Warlord',
    gear: [
      ['badlands_exile_mask', 'Exile Mask', 'Masque d exile', { def: 7, spd: 1 }],
      ['badlands_heat_cloak', 'Heat Cloak', 'Cape thermique', { hp: 75, def: 4 }],
      ['badlands_plasma_lance', 'Plasma Lance', 'Lance plasma', { atk: 11 }]
    ],
    event: ['evt_badlands_exile', 'Exile Survival Surge', 'Sursaut d exile', 'Survival instincts heal allies and burn enemies with plasma dust.', 'L instinct de survie soigne les allies et brule les ennemis a la poussiere plasma.'],
    decor: { sky: ['#392411', '#090401'], floor: 'rgba(170, 91, 42, 0.2)', grid: 'rgba(255, 151, 66, 0.28)', motif: 'desert', accent: '#ff9742' }
  });
}
