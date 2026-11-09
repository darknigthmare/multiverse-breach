// Splice — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Splice',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Nucleic Exchange Lab',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Dren Chimera',
    title: { en: 'Splice', fr: 'Splice' },
    desc: {
      en: 'A genetic engineering breach where ambition, biotech patents, and hybrid lifeforms mutate beyond control.',
      fr: 'Une breche de genie genetique ou ambition, brevets biotech et hybrides echappent au controle.'
    },
    hero: { id: 'elsa_splice', name: 'Elsa Kast', cat: 'hacker', color: '#8ed6d3' },
    allies: [
      { id: 'clive_splice', name: 'Clive Nicoli', cat: 'tactical', color: '#4d7f8c' },
      { id: 'dren_splice', name: 'Dren', cat: 'slayer', color: '#b8d9c0' }
    ],
    monsters: ['Specimen Pod', 'Nucleic Larva', 'Lab Security Drone'],
    bosses: ['Ginger Mutation', 'Hybrid Containment Breach'],
    worldBoss: 'Dren Chimera',
    gear: [
      ['splice_gene_vial', 'Hybrid Gene Vial', 'Fiole gene hybride', { atk: 9, spd: 1 }],
      ['splice_lab_badge', 'Nucleic Lab Badge', 'Badge labo Nucleic', { def: 6, hp: 55 }],
      ['splice_sample_case', 'Cryo Sample Case', 'Mallette cryo', { hp: 80 }]
    ],
    event: ['evt_splice_chimera', 'Chimera Growth Shock', 'Choc de croissance chimere', 'A hybrid pulse mutates enemies, slowing them and cutting defense.', 'Une onde hybride ralentit les ennemis et brise leur defense.'],
    decor: { sky: ['#172d32', '#03080a'], floor: 'rgba(105, 190, 184, 0.17)', grid: 'rgba(142, 214, 211, 0.3)', motif: 'facility', accent: '#8ed6d3' }
  });
}
