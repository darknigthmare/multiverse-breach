// Boruto: Naruto Next Generations — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'boruto',
    universe: 'Boruto: Naruto Next Generations',
    mediaType: 'manga',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Boruto',
    stage: 'Konoha Chunin Exams Otsutsuki Raid',
    boss: 'Isshiki Otsutsuki',
    hero: ['boruto_uzumaki', 'Boruto Uzumaki', 'slayer'],
    allies: [['sarada_uchiha', 'Sarada Uchiha', 'tactical'], ['mitsuki_boruto', 'Mitsuki', 'hacker']],
    monsters: ['Scientific Ninja Tool Drone', 'Kara Outer', 'Bandit Shinobi'],
    bosses: ['Momoshiki Otsutsuki', 'Boro Regeneration Core'],
    gear: [['boruto_scientific_gauntlet', 'Scientific Ninja Tool Gauntlet', 'Gantelet scientifique ninja', { atk: 8, spd: 2 }], ['karma_mark_fragment', 'Karma Mark Fragment', 'Fragment de Karma', { atk: 10, hp: 40 }], ['sarada_headband', 'Saradas Konoha Headband', 'Bandeau de Konoha de Sarada', { def: 7, hp: 45 }]],
    event: ['evt_team7_compression', 'New Team 7 Combination', 'Combinaison de la nouvelle equipe 7', 'Boruto, Sarada, and Mitsuki combine Karma pressure, Sharingan analysis, and Sage movement.', 'Boruto, Sarada et Mitsuki combinent pression du Karma, analyse du Sharingan et mouvement ermite.' ],
    theme: 'a modernized Konoha, scientific ninja tools, the new Team 7, Kara, Karma, and Otsutsuki vessels',
    desc: { en: 'This era uses the original Boruto team before the Two Blue Vortex time skip.', fr: 'Cette periode utilise l equipe de Boruto avant l ellipse de Two Blue Vortex.' },
    motif: 'arcanecity',
    colors: ['#182c38', '#030607', '#f34d9a'],
    stageVariants: [['RPG', 'Kara Boro Cult Chamber', 'Very Hard', 'Boro Regeneration Core'], ['Smash', 'Konoha Isshiki Invasion', 'Expert', 'Isshiki Otsutsuki']]
  });
}
