// Deadman Wonderland — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'deadman_wonderland',
    universe: 'Deadman Wonderland',
    mediaType: 'manga',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Deadman Wonderland',
    stage: 'G Ward Carnival Corpse',
    boss: 'Wretched Egg Red Hole',
    hero: ['ganta_igarashi', 'Ganta Igarashi', 'tactical'],
    allies: [['shiro_deadman', 'Shiro', 'slayer'], ['senji_kiyomasa', 'Senji Kiyomasa Crow', 'marine']],
    monsters: ['Undertaker Guard', 'Forgeries Deadman', 'Prison Security Drone'],
    bosses: ['Genkaku Azuma', 'Toto Sakigami Mockingbird'],
    gear: [['deadman_collar_candy', 'Deadman Collar Candy', 'Bonbon de collier Deadman', { hp: 85 }], ['ganta_gun_blood', 'Ganta Gun Blood Core', 'Noyau sanguin Ganta Gun', { atk: 10, hp: 35 }], ['crow_blood_blade', 'Crows Blood Blade', 'Lame de sang de Crow', { atk: 11, def: 3 }]],
    event: ['evt_branch_of_sin', 'Branch of Sin Release', 'Liberation de la Branche du Peche', 'Deadmen spend their own blood to form distinct weapons while poison timers keep advancing.', 'Les Deadmen depensent leur propre sang pour former des armes distinctes tandis que le poison des colliers continue.' ],
    theme: 'a privatized prison carnival, poison collars, Branches of Sin, and the hidden G Ward experiments',
    desc: { en: 'Blood weapons cost health and each Deadman retains a specific Branch of Sin instead of generic hemomancy.', fr: 'Les armes de sang coutent de la vie et chaque Deadman conserve sa Branche du Peche au lieu d une hemomancie generique.' },
    motif: 'facility',
    colors: ['#24141a', '#050203', '#ff3d61'],
    stageVariants: [['Smash', 'Dog Race Show Arena', 'Hard', 'Genkaku Azuma'], ['RPG', 'Mother Goose System Chamber', 'Expert', 'Wretched Egg Red Hole']]
  });
}
