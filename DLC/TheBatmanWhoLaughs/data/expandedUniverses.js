// The Batman Who Laughs — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'The Batman Who Laughs',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Dark Multiverse Gotham',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Darkest Knight Core',
    title: { en: 'The Batman Who Laughs', fr: 'The Batman Who Laughs' },
    desc: {
      en: 'A Dark Multiverse incursion where Batman tactics fuse with Joker cruelty and metal-corrupted nightmares.',
      fr: 'Une intrusion du Multivers Noir ou la strategie de Batman fusionne avec la cruaute du Joker.'
    },
    hero: { id: 'batman_laughs', name: 'Batman Who Laughs', cat: 'horror', color: '#111111' },
    allies: [
      { id: 'grim_knight', name: 'The Grim Knight', cat: 'tactical', color: '#4b4f56' },
      { id: 'red_death', name: 'The Red Death', cat: 'slayer', color: '#8b0000' }
    ],
    monsters: ['Robined Crow', 'Dark Metal Drone', 'Jokerized Bat Guard'],
    bosses: ['The Grim Knight', 'Dark Robin Swarm'],
    worldBoss: 'Darkest Knight Core',
    gear: [
      ['dark_visor', 'Spiked Dark Visor', 'Visiere noire cloutee', { def: 7, atk: 5 }],
      ['robin_chain', 'Dark Robin Chain', 'Chaine de Robin noir', { spd: 2, atk: 7 }],
      ['nth_metal_shard', 'Nth Metal Shard', 'Eclat de Nth Metal', { hp: 70, def: 5 }]
    ],
    event: ['evt_dark_metal', 'Dark Metal Howl', 'Hurlement de metal noir', 'Dark metal shockwaves damage and fear-lock enemies.', 'Des ondes de metal noir blessent et terrorisent les ennemis.'],
    decor: { sky: ['#161616', '#030303'], floor: 'rgba(78, 78, 78, 0.18)', grid: 'rgba(214, 33, 33, 0.32)', motif: 'fortress', accent: '#d62121' }
  });
}
