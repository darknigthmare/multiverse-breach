// Boruto: Two Blue Vortex — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'boruto_two_blue_vortex',
    universe: 'Boruto: Two Blue Vortex',
    mediaType: 'manga',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Expert',
    titleFr: 'Boruto: Two Blue Vortex',
    stage: 'Time-Skip Konoha Claw Grime Siege',
    boss: 'Jura Divine Tree Incarnation',
    hero: ['boruto_tbv', 'Boruto Uzumaki Two Blue Vortex', 'slayer'],
    allies: [['sarada_tbv', 'Sarada Uchiha Two Blue Vortex', 'tactical'], ['kawaki_tbv', 'Kawaki', 'marine']],
    monsters: ['Claw Grime', 'God Tree Spawn', 'Code Claw Mark Raider'],
    bosses: ['Code Limitless', 'Hidari Divine Tree'],
    gear: [['uzuhiko_formula', 'Rasengan Uzuhiko Formula', 'Formule du Rasengan Uzuhiko', { atk: 12, spd: 1 }], ['sasuke_sword_tbv', 'Sasukes Sword', 'Epee de Sasuke', { atk: 10, def: 4 }], ['omnipotence_memory', 'Omnipotence Memory Anchor', 'Ancre memoire d Omnipotence', { def: 8, hp: 55 }]],
    event: ['evt_uzuhiko', 'Rasengan Uzuhiko', 'Rasengan Uzuhiko', 'Boruto binds planetary rotation to the targets balance until the technique is released.', 'Boruto lie la rotation planetaire a l equilibre de la cible jusqu a la liberation de la technique.' ],
    theme: 'post-Omnipotence identities, Borutos exile, Claw Grimes, evolved Divine Trees, and a changed Konoha',
    desc: { en: 'Two Blue Vortex remains a distinct time-skip universe so its identities, powers, and spoilers do not overwrite early Boruto.', fr: 'Two Blue Vortex reste un univers distinct afin que ses identites, pouvoirs et revelations n ecrasent pas le premier Boruto.' },
    motif: 'arcanecity',
    colors: ['#1b1830', '#030306', '#47c8ff'],
    stageVariants: [['Tactics', 'Code Ten-Tails Pocket Dimension', 'Expert', 'Code Limitless'], ['Smash', 'Divine Tree Konoha Hunt', 'Expert', 'Jura Divine Tree Incarnation']]
  });
}
