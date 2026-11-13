// Devilman — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'devilman',
    universe: 'Devilman',
    mediaType: 'manga',
    faction: 'horror',
    mode: 'Smash',
    difficulty: 'Expert',
    titleFr: 'Devilman',
    stage: 'Tokyo Demon Apocalypse',
    boss: 'Satan Final War',
    hero: ['akira_fudo', 'Akira Fudo Devilman', 'horror'],
    allies: [['miki_makimura', 'Miki Makimura', 'tactical'], ['miko_kuroda', 'Miko Kuroda', 'slayer']],
    monsters: ['Sabbath Demon', 'Demon Army Harpy', 'Jinmen Shell Host'],
    bosses: ['Sirene and Kaim', 'Xenon Demon General'],
    gear: [['amon_horn', 'Amon Horn Fragment', 'Fragment de corne d Amon', { atk: 11, hp: 40 }], ['devilman_wing_membrane', 'Devilman Wing Membrane', 'Membrane d aile de Devilman', { spd: 2, def: 5 }], ['miki_baton', 'Mikis Relay Baton', 'Baton relais de Miki', { hp: 70, def: 4 }]],
    event: ['evt_devilman_heart', 'Human Heart in a Demon Body', 'Coeur humain dans un corps demon', 'Akira unleashes Amons body while retaining the empathy that defines Devilman.', 'Akira libere le corps d Amon tout en conservant l empathie qui definit Devilman.' ],
    theme: 'demonic possession, mass paranoia, Akiras human heart, and the apocalyptic war between Satan and humanity',
    desc: { en: 'Akira is powerful because a human heart controls Amons body; losing that empathy would erase the character, not upgrade him.', fr: 'Akira est puissant parce qu un coeur humain controle le corps d Amon; perdre cette empathie effacerait le personnage au lieu de l ameliorer.' },
    motif: 'wasteland',
    colors: ['#1e1014', '#040203', '#e53636'],
    stageVariants: [['RPG', 'Sabbath Club Possession', 'Very Hard', 'Sirene and Kaim'], ['Tactics', 'Demon Army Armageddon', 'Expert', 'Satan Final War']]
  });
}
