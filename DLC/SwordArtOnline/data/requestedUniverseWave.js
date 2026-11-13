// Sword Art Online — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'sword_art_online',
    universe: 'Sword Art Online',
    mediaType: 'series',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Sword Art Online',
    stage: 'Aincrad Floor 74 Labyrinth',
    boss: 'Heathcliff Kayaba Final Duel',
    hero: ['kirito_sao', 'Kirito', 'slayer'],
    allies: [['asuna_sao', 'Asuna', 'slayer'], ['klein_sao', 'Klein', 'tactical']],
    monsters: ['Ruin Kobold Sentinel', 'Laughing Coffin Player Killer', 'Skull Reaper Limb'],
    bosses: ['Illfang the Kobold Lord', 'The Skull Reaper'],
    gear: [['elucidator_sao', 'Elucidator', 'Elucidator', { atk: 11, def: 3 }], ['lambent_light', 'Lambent Light', 'Lambent Light', { atk: 10, spd: 2 }], ['teleport_crystal', 'Teleport Crystal', 'Cristal de teleportation', { hp: 65, spd: 2 }]],
    event: ['evt_starburst_stream', 'Starburst Stream', 'Starburst Stream', 'Kirito executes the sixteen-hit Dual Blades Sword Skill while allies protect its commitment window.', 'Kirito execute les seize coups du Sword Skill Dual Blades pendant que les allies protegent sa fenetre d engagement.' ],
    theme: 'Aincrad death-game rules, floors, Sword Skills, guild raids, player killers, and Kayabas hidden final condition',
    desc: { en: 'Aincrad remains a sword-based death game with menus, crystals, skill cooldowns, and real death on logout failure.', fr: 'Aincrad reste un death game a l epee avec menus, cristaux, temps de recharge et mort reelle en cas d echec.' },
    motif: 'castle',
    colors: ['#18233c', '#030508', '#6fb9ff'],
    stageVariants: [['Tactics', 'Floor 1 Illfang Raid', 'Hard', 'Illfang the Kobold Lord'], ['Smash', 'Floor 75 Skull Reaper Chamber', 'Expert', 'The Skull Reaper']]
  });
}
