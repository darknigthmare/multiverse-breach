// Toxic Avenger — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Toxic Avenger',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Tromaville Toxic Spill',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Toxic Waste Overlord',
    title: { en: 'The Toxic Avenger', fr: 'Toxic Avenger' },
    desc: { en: 'Tromaville mutates bullying, toxic sludge, mop justice, and gross-out heroism into a radioactive breach.', fr: 'Tromaville mute harcelement, dechets toxiques, justice au balai et heroisme crade en breche radioactive.' },
    hero: { id: 'toxie_avenger', name: 'Toxie', cat: 'slayer', color: '#6ee04f' },
    allies: [{ id: 'sara_toxic', name: 'Sara Tromaville', cat: 'tactical', color: '#d8c68a' }, { id: 'tromaville_cop', name: 'Tromaville Cop', cat: 'marine', color: '#4b6f7d' }],
    monsters: ['Toxic Thug', 'Sludge Mutant', 'Corporate Dump Guard'],
    bosses: ['Tromaville Bully Pack', 'Radiation Barrel Beast'],
    worldBoss: 'Toxic Waste Overlord',
    gear: [['toxie_mop', 'Radioactive Mop', 'Balai radioactif', { atk: 11 }], ['toxie_barrel', 'Toxic Barrel Chunk', 'Morceau de fut toxique', { hp: 80, def: 3 }], ['toxie_tutu', 'Tromaville Tutu Relic', 'Relique tutu Tromaville', { spd: 2, atk: 4 }]],
    event: ['evt_toxie_cleanup', 'Tromaville Cleanup', 'Nettoyage de Tromaville', 'Toxie splashes sludge that poisons enemies and buffs slayers.', 'Toxie projette de la boue qui empoisonne les ennemis et renforce les slayers.'],
    decor: { sky: ['#18351c', '#030703'], floor: 'rgba(88, 220, 65, 0.17)', grid: 'rgba(172, 255, 86, 0.3)', motif: 'facility', accent: '#acff56' }
  });
}
