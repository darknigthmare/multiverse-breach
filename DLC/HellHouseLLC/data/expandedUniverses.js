// Hell House LLC — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLegacyNonCombatTrialNameRoutes() {
  return (['Hell House LLC', 'evidence', ['Basement Clown Prop', 'Hotel Door Knocker', 'Found Footage Static', 'Stairwell Camera Trap']]);
}

export function createLegacyNonCombatTrialNameRoutes2() {
  return (['Hell House LLC', 'survive', ['Abaddon Priest Shade']]);
}

export function createExpandedUniverses() {
  return ({
    universe: 'Hell House LLC',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Abaddon Hotel Walkthrough',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Abaddon Clown Entity',
    title: { en: 'Hell House LLC', fr: 'Hell House LLC' },
    desc: { en: 'Found footage corridors, cursed hotel rooms, and motionless clown props turn into a haunted attraction breach.', fr: 'Couloirs found footage, chambres maudites et clowns immobiles deviennent une breche d attraction hantee.' },
    hero: { id: 'alex_hellhouse', name: 'Alex Taylor', cat: 'tactical', color: '#8b8b7a' },
    allies: [{ id: 'sara_hellhouse', name: 'Sara Havel', cat: 'horror', color: '#b08a7a' }, { id: 'paul_hellhouse', name: 'Paul Camera Lead', cat: 'hacker', color: '#4f5f66' }],
    monsters: ['Basement Clown Prop', 'Hotel Door Knocker', 'Found Footage Static'],
    bosses: ['Abaddon Priest Shade', 'Stairwell Camera Trap'],
    worldBoss: 'Abaddon Clown Entity',
    gear: [['hhllc_camera', 'Found Footage Camera', 'Camera found footage', { spd: 2, atk: 4 }], ['hhllc_key', 'Abaddon Room Key', 'Cle de chambre Abaddon', { def: 6 }], ['hhllc_clown_mask', 'Clown Prop Mask', 'Masque accessoire clown', { atk: 8 }]],
    event: ['evt_hhllc_static', 'Basement Static Cut', 'Coupure statique cave', 'The camera feed cuts and fear-locks enemy actions.', 'Le flux camera coupe et verrouille les actions ennemies par la peur.'],
    decor: { sky: ['#221614', '#050202'], floor: 'rgba(120, 76, 58, 0.16)', grid: 'rgba(229, 80, 65, 0.26)', motif: 'hauntedset', accent: '#e55041' }
  });
}
