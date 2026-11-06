// Alien Resurrection — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Alien Resurrection',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'USM Auriga Clone Deck',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Newborn Hybrid',
    title: { en: 'Alien Resurrection', fr: 'Alien Resurrection' },
    desc: {
      en: 'Military cloning labs, smugglers, failed Ripley copies, and a hybrid nightmare loose aboard the Auriga.',
      fr: 'Laboratoires de clonage militaires, contrebandiers, copies ratees de Ripley et cauchemar hybride sur l Auriga.'
    },
    hero: { id: 'ripley8', name: 'Ripley 8', cat: 'slayer', color: '#2c3e50' },
    allies: [
      { id: 'call_resurrection', name: 'Annalee Call', cat: 'hacker', color: '#7f8c8d' },
      { id: 'christie_resurrection', name: 'Christie', cat: 'tactical', color: '#5d6d7e' }
    ],
    monsters: ['Clone Lab Xeno', 'Aqua Xenomorph', 'Military Drone'],
    bosses: ['Queen Clone', 'Auriga Security Core'],
    worldBoss: 'Newborn Hybrid',
    gear: [
      ['ar_clone_tube', 'Clone Tube Shard', 'Fragment de cuve clone', { hp: 90 }],
      ['ar_auton_patch', 'Auton Interface Patch', 'Patch interface Auton', { spd: 2, def: 4 }],
      ['ar_betty_rifle', 'Betty Crew Rifle', 'Fusil du Betty', { atk: 9, hp: 30 }]
    ],
    event: ['evt_ar_betty', 'Betty Escape Vector', 'Vecteur de fuite Betty', 'The Betty strafes the field and extracts the weakest ally from danger.', 'Le Betty mitraille le terrain et evacue l allie le plus faible.'],
    decor: { sky: ['#17202a', '#030508'], floor: 'rgba(92, 124, 142, 0.18)', grid: 'rgba(75, 214, 200, 0.25)', motif: 'shipdeck', accent: '#4bd6c8' }
  });
}
