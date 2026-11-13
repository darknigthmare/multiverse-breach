// One Punch Man — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'one_punch_man',
    universe: 'One Punch Man',
    mediaType: 'manga',
    faction: 'sciFi',
    mode: 'Smash',
    difficulty: 'Expert',
    titleFr: 'One Punch Man',
    stage: 'City A Hero Association Assault',
    boss: 'Boros Meteoric Burst',
    hero: ['saitama_opm', 'Saitama', 'slayer'],
    allies: [['genos_opm', 'Genos', 'marine'], ['tatsumaki_opm', 'Tatsumaki', 'hacker']],
    monsters: ['Deep Sea Folk', 'Monster Association Beast', 'Machine God Drone'],
    bosses: ['Garou Cosmic Fear', 'Orochi Monster King'],
    gear: [['saitama_glove', 'Saitamas Hero Glove', 'Gant de heros de Saitama', { atk: 12, def: 3 }], ['genos_core', 'Genos Incineration Core', 'Noyau d incineration de Genos', { atk: 11, hp: 45 }], ['hero_association_badge', 'Hero Association Badge', 'Badge de l Association des Heros', { def: 7, hp: 55 }]],
    event: ['evt_serious_punch', 'Serious Punch Shockwave', 'Onde du Coup serieux', 'Saitama uses only the force required to end the current threat without turning every encounter into an automatic clear.', 'Saitama emploie seulement la force necessaire pour terminer la menace actuelle sans transformer chaque combat en victoire automatique.' ],
    theme: 'Hero Association rankings, disaster levels, monsters, cyborg upgrades, and Saitamas deliberately anticlimactic strength',
    desc: { en: 'Saitamas power is handled as an objective and timing constraint so his canon strength does not erase the game.', fr: 'La puissance de Saitama devient une contrainte d objectif et de timing afin que sa force canonique n efface pas le jeu.' },
    motif: 'arcanecity',
    colors: ['#1e2c35', '#040607', '#f4d52d'],
    stageVariants: [['Tactics', 'Monster Association Underground', 'Very Hard', 'Orochi Monster King'], ['RPG', 'Alien Conqueror Ship Deck', 'Expert', 'Boros Meteoric Burst']]
  });
}
