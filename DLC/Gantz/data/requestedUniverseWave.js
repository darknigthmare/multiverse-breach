// Gantz — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'gantz',
    universe: 'Gantz',
    mediaType: 'manga',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Expert',
    titleFr: 'Gantz',
    stage: 'Tokyo Gantz Room Mission',
    boss: 'Nurarihyon Osaka Final Form',
    hero: ['kei_kurono', 'Kei Kurono', 'slayer'],
    allies: [['masaru_kato', 'Masaru Kato', 'tactical'], ['reika_shimohira', 'Reika Shimohira', 'marine']],
    monsters: ['Onion Alien', 'Tanaka Alien', 'Buddhist Statue Alien'],
    bosses: ['Nura Alien Tengu', 'Italian Statue God'],
    gear: [['gantz_x_gun', 'Gantz X-Gun', 'X-Gun de Gantz', { atk: 11, spd: 1 }], ['gantz_suit', 'Gantz Reinforcement Suit', 'Combinaison renforcee Gantz', { def: 9, hp: 65 }], ['gantz_y_gun', 'Gantz Y-Gun', 'Y-Gun de Gantz', { atk: 8, def: 5 }]],
    event: ['evt_gantz_transfer', 'Gantz Transfer Recall', 'Rappel de transfert Gantz', 'The black sphere recalls surviving hunters before the mission boundary erases them.', 'La sphere noire rappelle les chasseurs survivants avant que la limite de mission ne les efface.'],
    theme: 'dead recruits, timed alien hunts, opaque scoring, black-sphere technology, and disposable survival missions',
    desc: { en: 'Gantz controls equipment, mission boundaries, scoring, and revival; A.R.C.A. cannot simply free its hunters.', fr: 'Gantz controle equipement, limites de mission, score et resurrection; A.R.C.A. ne peut pas simplement liberer ses chasseurs.' },
    motif: 'arcanecity',
    colors: ['#111214', '#020203', '#4fcfff'],
    stageVariants: [['Smash', 'Osaka Team Nurarihyon Hunt', 'Expert', 'Nurarihyon Osaka Final Form'], ['RPG', 'Rome Statue Massacre', 'Expert', 'Italian Statue God']]
  });
}
