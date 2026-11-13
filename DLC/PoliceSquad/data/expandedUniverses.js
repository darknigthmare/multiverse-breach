// Police Squad — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Police Squad',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Police Squad Evidence Room',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Frame-Up Commissioner',
    title: { en: 'Police Squad!', fr: 'Police Squad!' },
    desc: {
      en: 'A deadpan police procedural breach where Frank Drebin turns absurd evidence into tactical chaos.',
      fr: 'Une breche de procedural policier absurde ou Frank Drebin transforme les preuves en chaos tactique.'
    },
    hero: { id: 'frank_drebin', name: 'Frank Drebin', cat: 'tactical', color: '#2f75b5' },
    allies: [
      { id: 'ed_hocken', name: 'Ed Hocken', cat: 'marine', color: '#5d6d7e' },
      { id: 'nordberg', name: 'Nordberg', cat: 'hacker', color: '#f1c40f' }
    ],
    monsters: ['Confused Henchman', 'Evidence Clerk Drone', 'Misdirected Sniper'],
    bosses: ['Hypnotized Umpire', 'Frame-Up Commissioner'],
    worldBoss: 'Deadpan Crime Nexus',
    gear: [
      ['drebin_badge', 'Drebin Badge', 'Plaque Drebin', { def: 7, spd: 1 }],
      ['squad_micro_recorder', 'Hidden Wire Recorder', 'Micro cache', { atk: 7, def: 4 }],
      ['squad_coffee_cup', 'Stakeout Coffee', 'Cafe de planque', { hp: 70 }]
    ],
    event: ['evt_drebin_misfire', 'Accidental Perfect Arrest', 'Arrestation accidentelle parfaite', 'A chain of mistakes stuns enemies and buffs squad evasion.', 'Une chaine de maladresses etourdit les ennemis et booste l esquive.'],
    decor: { sky: ['#1c2b3a', '#04070b'], floor: 'rgba(47, 117, 181, 0.16)', grid: 'rgba(241, 196, 15, 0.28)', motif: 'facility', accent: '#2f75b5' }
  });
}
