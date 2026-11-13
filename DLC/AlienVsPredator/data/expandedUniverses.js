// Alien vs Predator — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Alien vs Predator',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Bouvetoya Pyramid Trial',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Predalien Prototype',
    title: { en: 'Alien vs Predator', fr: 'Alien vs Predator' },
    desc: {
      en: 'A shifting Antarctic pyramid where young Yautja hunt xenomorphs under ancient trial rules.',
      fr: 'Une pyramide antarctique mouvante ou de jeunes Yautja chassent des xenomorphes selon un rite ancien.'
    },
    hero: { id: 'lex_avp', name: 'Alexa Woods', cat: 'tactical', color: '#6c7a89' },
    allies: [
      { id: 'scar_avp', name: 'Scar Predator', cat: 'slayer', color: '#6b604c' },
      { id: 'sebastian_avp', name: 'Sebastian De Rosa', cat: 'hacker', color: '#b7a77a' }
    ],
    monsters: ['Pyramid Xenomorph', 'Trial Facehugger', 'Ancient Trap Tile'],
    bosses: ['Scar Predator Trial', 'Alien Queen Escape'],
    worldBoss: 'Predalien Prototype',
    gear: [
      ['avp_plasma_caster', 'Trial Plasma Caster', 'Canon plasma rituel', { atk: 10, def: 3 }],
      ['avp_acid_spear', 'Acid-Marked Spear', 'Lance marquee a l acide', { atk: 8, spd: 1 }],
      ['avp_pyramid_map', 'Shifting Pyramid Map', 'Carte de pyramide mouvante', { def: 6, hp: 55 }]
    ],
    event: ['evt_avp_trial', 'Ancient Hunt Trial', 'Rite de chasse ancien', 'Pyramid walls shift, crushing enemies and shielding allies.', 'Les murs de pyramide bougent, ecrasent les ennemis et protegent les allies.'],
    decor: { sky: ['#16242d', '#030609'], floor: 'rgba(99, 132, 145, 0.18)', grid: 'rgba(85, 221, 215, 0.27)', motif: 'labyrinth', accent: '#55ddd7' }
  });
}
