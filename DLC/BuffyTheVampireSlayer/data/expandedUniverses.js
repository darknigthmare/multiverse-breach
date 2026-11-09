// Buffy the Vampire Slayer — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Buffy the Vampire Slayer',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Sunnydale Hellmouth',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'The First Evil',
    title: { en: 'Buffy the Vampire Slayer', fr: 'Buffy contre les vampires' },
    desc: {
      en: 'A Hellmouth town where a Slayer, Watchers, witches, and friends fight vampires and apocalyptic demons.',
      fr: 'Une ville sur la Bouche de l Enfer ou Tueuse, Observateurs, sorcieres et amis combattent vampires et demons.'
    },
    hero: { id: 'buffy_summers', name: 'Buffy Summers', cat: 'slayer', color: '#f6c15b' },
    allies: [
      { id: 'willow_rosenberg', name: 'Willow Rosenberg', cat: 'hacker', color: '#c0392b' },
      { id: 'giles_buffy', name: 'Rupert Giles', cat: 'tactical', color: '#7f8c8d' }
    ],
    monsters: ['Vampire Minion', 'Hellmouth Imp', 'Bringer Scout'],
    bosses: ['Spike Duel', 'Glory Godling'],
    worldBoss: 'The First Evil',
    gear: [
      ['buffy_stake', 'Mr Pointy Stake', 'Pieu Mr Pointy', { atk: 10 }],
      ['buffy_watcher_book', 'Watcher Field Book', 'Carnet d Observateur', { def: 6, spd: 1 }],
      ['buffy_witch_charm', 'Willow Witch Charm', 'Charme de Willow', { hp: 60, atk: 5 }]
    ],
    event: ['evt_buffy_slayer', 'Slayer Scythe Rally', 'Ralliement de la faux', 'The Slayer cuts through demons and rallies every ally.', 'La Tueuse traverse les demons et rallie tous les allies.'],
    decor: { sky: ['#2b1822', '#060205'], floor: 'rgba(198, 57, 78, 0.18)', grid: 'rgba(246, 193, 91, 0.28)', motif: 'hauntedset', accent: '#f6c15b' }
  });
}
