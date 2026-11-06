// Discworld — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Discworld',
    mediaType: 'manga',
    faction: 'arcane',
    stageName: 'Ankh-Morpork Octarine Breach',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Dungeon Dimensions Breach',
    title: { en: 'Discworld', fr: 'Discworld' },
    desc: {
      en: 'A flat world of absurd magic, city politics, witches, wizards, and reality leaks riding through the multiverse.',
      fr: 'Un Disque-monde de magie absurde, politique urbaine, sorcieres, mages et fuites de realite dans le multivers.'
    },
    hero: { id: 'rincewind_dw', name: 'Rincewind', cat: 'hacker', color: '#8e44ad' },
    allies: [
      { id: 'vimes_dw', name: 'Sam Vimes', cat: 'tactical', color: '#59656f' },
      { id: 'granny_dw', name: 'Granny Weatherwax', cat: 'horror', color: '#c9c2aa' }
    ],
    monsters: ['Auditor Shade', 'Watch Golem', 'Luggage Mimic'],
    bosses: ['Sourcery Storm', 'Patrician Gambit'],
    worldBoss: 'Dungeon Dimensions Breach',
    gear: [
      ['disc_luggage', 'Sapient Pearwood Luggage', 'Bagage en poirier savant', { hp: 80, def: 5 }],
      ['disc_octarine', 'Octarine Focus', 'Focaliseur octarine', { atk: 9, spd: 1 }],
      ['disc_watch_badge', 'Watch Badge', 'Plaque du Guet', { def: 7, hp: 45 }]
    ],
    event: ['evt_disc_luggage', 'Luggage Stampede', 'Charge du Bagage', 'The sapient luggage tramples the field for heavy damage.', 'Le Bagage traverse le terrain et pietine les ennemis.'],
    decor: { sky: ['#2d2140', '#07040d'], floor: 'rgba(126, 89, 170, 0.16)', grid: 'rgba(231, 212, 118, 0.28)', motif: 'arcanecity', accent: '#e7d476' }
  });
}
