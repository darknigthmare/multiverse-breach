// Naruto Shippuden — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'naruto_shippuden',
    universe: 'Naruto Shippuden',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Expert',
    titleFr: 'Naruto Shippuden',
    stage: 'Fourth Shinobi World War',
    boss: 'Kaguya Otsutsuki Dimension Shift',
    hero: ['naruto_six_paths', 'Naruto Uzumaki Shippuden', 'slayer'],
    allies: [['sasuke_rinnegan', 'Sasuke Uchiha Shippuden', 'slayer'], ['kakashi_war', 'Kakashi Hatake', 'tactical']],
    monsters: ['White Zetsu Army', 'Edo Tensei Shinobi', 'Pain Summoning Beast'],
    bosses: ['Pain Six Paths', 'Obito Ten-Tails Jinchuriki'],
    gear: [['rasenshuriken_scroll', 'Rasenshuriken Formula', 'Formule du Rasenshuriken', { atk: 11, spd: 1 }], ['rinnegan_lens', 'Rinnegan Chakra Lens', 'Lentille chakra Rinnegan', { atk: 8, def: 7 }], ['kakashi_flak_vest', 'Kakashis Flak Vest', 'Gilet tactique de Kakashi', { def: 8, hp: 55 }]],
    event: ['evt_six_paths_link', 'Six Paths Chakra Link', 'Lien chakra des Six Chemins', 'Naruto shares chakra cloaks with allies while Sasuke anchors the dimensional exit.', 'Naruto partage des manteaux de chakra avec les allies pendant que Sasuke ancre la sortie dimensionnelle.' ],
    theme: 'Akatsuki hunts, tailed beasts, the Fourth Shinobi War, Six Paths power, and the final Team 7 reunion',
    desc: { en: 'Shippuden remains separate from young Naruto so unlock levels, techniques, and narrative prerequisites cannot collapse together.', fr: 'Shippuden reste separe du jeune Naruto afin que niveaux, techniques et prerequis narratifs ne se confondent pas.' },
    motif: 'wasteland',
    colors: ['#23162d', '#050306', '#ff7c28'],
    stageVariants: [['RPG', 'Amegakure Pain Assault', 'Very Hard', 'Pain Six Paths'], ['Smash', 'Kamui Dimension Obito Duel', 'Expert', 'Obito Ten-Tails Jinchuriki']]
  });
}
