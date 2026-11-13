// Naruto — definitions consumed by src/game/requestedUniverseWave.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createRequestedUniverseWave() {
  return ({
    key: 'naruto',
    universe: 'Naruto',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Naruto',
    stage: 'Chunin Exams Forest of Death',
    boss: 'Orochimaru Konoha Crush',
    hero: ['naruto_uzumaki_young', 'Naruto Uzumaki', 'slayer'],
    allies: [['sasuke_uchiha_young', 'Sasuke Uchiha', 'slayer'], ['sakura_haruno_young', 'Sakura Haruno', 'tactical']],
    monsters: ['Sound Ninja Genin', 'Giant Forest Leech', 'Orochimaru Test Subject'],
    bosses: ['Gaara Shukaku', 'Kabuto Yakushi Chunin'],
    gear: [['kunai_pouch_naruto', 'Konoha Kunai Pouch', 'Sacoche de kunai de Konoha', { atk: 8, spd: 1 }], ['shadow_clone_scroll', 'Shadow Clone Scroll', 'Rouleau du Multi-clonage', { atk: 7, hp: 50 }], ['soldier_pill', 'Akimichi Soldier Pill', 'Pilule militaire Akimichi', { hp: 85, atk: 5 }]],
    event: ['evt_naruto_shadow_clones', 'Multi Shadow Clone Barrage', 'Barrage de Multi-clonage', 'Naruto spends chakra to fill lanes with fragile physical clones that share his intent.', 'Naruto depense du chakra pour remplir les lignes de clones physiques fragiles qui partagent son intention.' ],
    theme: 'Team 7, chakra control, the Chunin Exams, Sannin conflicts, and Narutos first struggle with the Nine-Tails',
    desc: { en: 'This pack stops before the Shippuden time skip and preserves young Team 7s limited techniques and experience.', fr: 'Ce pack s arrete avant l ellipse de Shippuden et conserve les techniques et l experience limitees de la jeune equipe 7.' },
    motif: 'wasteland',
    colors: ['#162d38', '#030607', '#f58b2a'],
    stageVariants: [['Tactics', 'Konoha Rooftop Gaara Pursuit', 'Hard', 'Gaara Shukaku'], ['Smash', 'Valley of the End First Duel', 'Very Hard', 'Orochimaru Konoha Crush']]
  });
}
