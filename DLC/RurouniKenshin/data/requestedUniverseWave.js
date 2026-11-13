// Rurouni Kenshin — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'rurouni_kenshin',
    universe: 'Rurouni Kenshin',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Kenshin le vagabond',
    stage: 'Kyoto Juppongatana Pursuit',
    boss: 'Makoto Shishio Final Duel',
    hero: ['kenshin_himura', 'Kenshin Himura', 'slayer'],
    allies: [['kaoru_kamiya', 'Kaoru Kamiya', 'tactical'], ['sanosuke_sagara', 'Sanosuke Sagara', 'marine']],
    monsters: ['Juppongatana Swordsman', 'Oniwabanshu Shinobi', 'Gatling Gun Guard'],
    bosses: ['Aoshi Shinomori', 'Soujiro Seta'],
    gear: [['sakabato', 'Sakabato Reverse-Blade Sword', 'Sabre a lame inversee', { atk: 9, def: 6 }], ['zanbato_fragment', 'Zanbato Fragment', 'Fragment de Zanbato', { atk: 11, hp: 35 }], ['kamiya_scroll', 'Kamiya Kasshin Scroll', 'Rouleau Kamiya Kasshin', { def: 7, spd: 1 }]],
    event: ['evt_amakakeru', 'Amakakeru Ryu no Hirameki', 'Amakakeru Ryu no Hirameki', 'Kenshin commits to one non-lethal Hiten Mitsurugi counter that breaks the attackers stance.', 'Kenshin engage une contre-attaque Hiten Mitsurugi non lethale qui brise la garde adverse.'],
    theme: 'Meiji-era sword schools, Kenshins vow not to kill, revolution scars, and the Kyoto conspiracy',
    desc: { en: 'Kenshins reverse-blade vow remains a gameplay constraint, not cosmetic flavor.', fr: 'Le serment de Kenshin et sa lame inversee restent une contrainte de gameplay, pas un simple detail cosmetique.' },
    motif: 'castle',
    colors: ['#351716', '#060202', '#e6c05c'],
    stageVariants: [['Tactics', 'Kamiya Dojo Defense', 'Medium', 'Aoshi Shinomori'], ['Smash', 'Shishio Burning Ironclad', 'Very Hard', 'Makoto Shishio Final Duel']]
  });
}
