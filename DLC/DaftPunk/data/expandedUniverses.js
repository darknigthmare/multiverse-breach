// Daft Punk — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Daft Punk',
    mediaType: 'music',
    faction: 'cyber',
    stageName: 'Pyramid Alive Grid',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Derezzed Pyramid Core',
    title: { en: 'Daft Punk', fr: 'Daft Punk' },
    desc: {
      en: 'French electronic mythology as a neon pyramid grid, helmeted avatars, and synchronized light combat.',
      fr: 'Mythologie electro francaise en pyramide neon, avatars casques et combat de lumiere synchronisee.'
    },
    hero: { id: 'thomas_bangalter', name: 'Thomas Bangalter', cat: 'hacker', color: '#d4af37' },
    allies: [
      { id: 'guy_manuel', name: 'Guy-Manuel de Homem-Christo', cat: 'tactical', color: '#bdc3c7' },
      { id: 'stella_interstella', name: 'Stella (Interstella 5555)', cat: 'hacker', color: '#00d8ff' }
    ],
    monsters: ['Derezzed Grid Drone', 'Harder Better Faster Loop', 'Technologic Command Line'],
    bosses: ['Alive Pyramid Light Wall', 'Robot Rock Titan'],
    worldBoss: 'Derezzed Pyramid Core',
    gear: [
      ['daft_gold_helmet', 'Gold Helmet', 'Casque or', { def: 6, spd: 2 }],
      ['daft_pyramid_console', 'Alive Pyramid Console', 'Console pyramide Alive', { atk: 8, def: 5 }],
      ['daft_neon_disc', 'Derezzed Neon Disc', 'Disque neon Derezzed', { atk: 9, spd: 1 }]
    ],
    event: ['evt_daft_alive', 'Alive Light Sync', 'Synchronisation Alive', 'A light-grid sync boosts speed and lasers every lane.', 'La grille lumineuse booste la vitesse et laserise chaque ligne.'],
    decor: { sky: ['#071729', '#010309'], floor: 'rgba(38, 142, 190, 0.17)', grid: 'rgba(255, 199, 64, 0.34)', motif: 'code', accent: '#ffc740' }
  });
}
