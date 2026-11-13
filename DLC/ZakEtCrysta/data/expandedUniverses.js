// Zak et Crysta — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Zak et Crysta',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'FernGully Hexxus Breach',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Hexxus Pollution Spirit',
    title: { en: 'FernGully', fr: 'Zak et Crysta' },
    desc: { en: 'Rainforest magic, fairy scale, pollution spirits, and ecological wonder bloom inside the Nexus.', fr: 'Magie de foret, echelle de fee, esprits de pollution et merveille ecologique fleurissent dans le Nexus.' },
    hero: { id: 'crysta_ferngully', name: 'Crysta', cat: 'hacker', color: '#65d56e' },
    allies: [{ id: 'zak_ferngully', name: 'Zak', cat: 'tactical', color: '#4f9ed8' }, { id: 'batty_ferngully', name: 'Batty Koda', cat: 'slayer', color: '#7b5b9e' }],
    monsters: ['Pollution Sludge', 'Logging Machine Drone', 'Smoke Imp'],
    bosses: ['Leveler Harvester', 'Oil Pit Hexxus'],
    worldBoss: 'Hexxus Pollution Spirit',
    gear: [['fg_seed', 'Rainforest Seed', 'Graine de foret', { hp: 85 }], ['fg_fairy_dust', 'Fairy Dust Bloom', 'Poussiere fee', { spd: 2, def: 4 }], ['fg_batty_wire', 'Batty Antenna Wire', 'Fil antenne Batty', { atk: 6, spd: 1 }]],
    event: ['evt_fg_regrowth', 'FernGully Regrowth', 'Repousse FernGully', 'Living roots heal allies and bind machines.', 'Les racines vivantes soignent les allies et entravent les machines.'],
    decor: { sky: ['#11351e', '#020703'], floor: 'rgba(72, 190, 82, 0.18)', grid: 'rgba(154, 255, 132, 0.28)', motif: 'forest', accent: '#9aff84' }
  });
}
