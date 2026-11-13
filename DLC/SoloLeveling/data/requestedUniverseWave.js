// Solo Leveling — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'solo_leveling',
    universe: 'Solo Leveling',
    mediaType: 'manga',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Expert',
    titleFr: 'Solo Leveling',
    stage: 'Cartenon Double Dungeon',
    boss: 'Antares Monarch of Destruction',
    hero: ['sung_jinwoo', 'Sung Jinwoo', 'slayer'],
    allies: [['cha_haein', 'Cha Hae-In', 'slayer'], ['yoo_jinho', 'Yoo Jinho', 'tactical']],
    monsters: ['Dungeon Goblin', 'High Orc Warrior', 'Ice Elf Archer'],
    bosses: ['Blood-Red Commander Igris', 'Ant King Beru'],
    gear: [['kasaka_dagger', 'Kasakas Venom Fang', 'Croc empoisonne de Kasaka', { atk: 10, spd: 2 }], ['demon_king_sword', 'Demon Kings Longsword', 'Epee longue du Roi-Demon', { atk: 12, def: 3 }], ['shadow_extract_rune', 'Shadow Extraction Rune', 'Rune d extraction des ombres', { hp: 60, atk: 7 }]],
    event: ['evt_arise_shadow', 'Arise: Shadow Extraction', 'Leve-toi: extraction d ombre', 'Jinwoo converts a defeated eligible enemy into a temporary named shadow soldier.', 'Jinwoo transforme un ennemi vaincu et compatible en soldat d ombre temporaire et nomme.' ],
    theme: 'hunter gates, the System, daily quests, shadow extraction, Monarchs, and Jinwoos unique leveling path',
    desc: { en: 'Only Jinwoo owns the System and its leveling interface; other hunters retain fixed awakened ranks.', fr: 'Seul Jinwoo possede le Systeme et son interface de niveau; les autres chasseurs gardent leur rang eveille fixe.' },
    motif: 'castle',
    colors: ['#151025', '#030205', '#8b5cff'],
    stageVariants: [['Tactics', 'Jeju Island Ant Nest', 'Very Hard', 'Ant King Beru'], ['Smash', 'Seoul Monarch Invasion', 'Expert', 'Antares Monarch of Destruction']]
  });
}
