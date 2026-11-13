// Sword Art Online: Gun Gale Online — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'sao_gun_gale',
    universe: 'Sword Art Online: Gun Gale Online',
    mediaType: 'series',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Sword Art Online - Gun Gale Online',
    stage: 'Gun Gale Online Bullet of Bullets',
    boss: 'Death Gun Sterben',
    hero: ['sinon_ggo', 'Sinon', 'marine'],
    allies: [['kirito_ggo', 'Kirito GGO', 'slayer'], ['llenn_ggo', 'LLENN', 'tactical']],
    monsters: ['BoB Assault Gunner', 'Laughing Coffin Remnant', 'Gun Gale Combat Drone'],
    bosses: ['Behemoth Heavy Gunner', 'Pitohui Berserk Avatar'],
    gear: [['hecate_ii', 'PGM Ultima Ratio Hecate II', 'PGM Hecate II', { atk: 12, spd: 1 }], ['photon_sword_ggo', 'Kiritos Photon Sword', 'Sabre photon de Kirito', { atk: 10, def: 4 }], ['optical_camouflage_ggo', 'GGO Optical Camouflage', 'Camouflage optique GGO', { spd: 2, def: 7 }]],
    event: ['evt_bullet_line_read', 'Bullet Line Prediction', 'Prediction des lignes de tir', 'Sinon reads ballistic warning lines and relocates before the first real round reaches her.', 'Sinon lit les lignes d avertissement balistique et se replace avant l arrivee de la premiere balle reelle.' ],
    theme: 'the firearm VRMMO Gun Gale Online, Bullet Lines, sniper duels, Death Gun, and Squad Jam tactics',
    desc: { en: 'This is the firearm-focused SAO branch: rifles, ballistic prediction, ammunition, and VR avatar movement drive combat.', fr: 'Il s agit de la branche armes a feu de SAO: fusils, prediction balistique, munitions et mouvement des avatars VR dirigent le combat.' },
    motif: 'wasteland',
    colors: ['#1c2025', '#040405', '#e55838'],
    stageVariants: [['Smash', 'GGO Desert BoB Ruins', 'Hard', 'Behemoth Heavy Gunner'], ['RPG', 'Squad Jam Urban Killbox', 'Very Hard', 'Pitohui Berserk Avatar']]
  });
}
