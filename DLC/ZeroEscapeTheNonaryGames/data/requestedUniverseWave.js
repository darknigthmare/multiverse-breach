// Zero Escape: The Nonary Games — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'zero_escape_nonary',
    universe: 'Zero Escape: The Nonary Games',
    mediaType: 'game',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Zero Escape: The Nonary Games',
    stage: 'Gigantic Nonary Game',
    boss: 'Zero Time-Door Protocol',
    hero: ['junpei_tenmyouji', 'Junpei Tenmyouji', 'tactical'],
    allies: [['akane_kurashiki', 'Akane Kurashiki', 'hacker'], ['sigma_klim', 'Sigma Klim', 'marine']],
    monsters: ['Bracelet Bomb Enforcer', 'Q Room Trap Drone', 'Radical-6 Host'],
    bosses: ['Dio Myrmidon', 'Zero II Decision Engine'],
    gear: [['digital_root_watch', 'Digital Root Bracelet', 'Bracelet a racine numerique', { def: 7, spd: 1 }], ['morphogenetic_key', 'Morphogenetic Key', 'Cle morphogenetique', { atk: 7, spd: 2 }], ['antidote_accelavir', 'Accelavir Dose', 'Dose d Accelavir', { hp: 90 }]],
    event: ['evt_nonary_shift', 'Morphogenetic Shift', 'Transfert morphogenetique', 'A memory from another decision branch reveals the safe door before the timer expires.', 'Un souvenir venu d une autre branche de decision revele la bonne porte avant la fin du chrono.'],
    theme: 'numbered doors, bracelet bombs, escape rooms, morphogenetic memory, and branching decision timelines',
    desc: { en: 'The Nonary Game preserves its arithmetic doors, lethal bracelets, and information transfer across decision branches.', fr: 'Le Nonary Game conserve ses portes arithmetiques, ses bracelets mortels et ses transferts d information entre branches de decision.' },
    motif: 'shipdeck',
    colors: ['#111b25', '#020406', '#52c9ff'],
    stageVariants: [['RPG', 'AB Project Lunar Facility', 'Very Hard', 'Zero II Decision Engine'], ['Smash', 'Decision Game Underground Ward', 'Expert', 'Zero Time-Door Protocol']]
  });
}
