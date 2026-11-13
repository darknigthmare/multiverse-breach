// Breaking Bad — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Breaking Bad',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Albuquerque Lab Breach',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Heisenberg Empire',
    title: { en: 'Breaking Bad', fr: 'Breaking Bad' },
    desc: {
      en: 'A criminal chemistry breach of desert strategy, blue product, cartel pressure, and collapsing identities.',
      fr: 'Une breche de chimie criminelle, strategie desertique, produit bleu et identites qui s effondrent.'
    },
    hero: { id: 'walter_white', name: 'Walter White', cat: 'hacker', color: '#5c8a43' },
    allies: [
      { id: 'jesse_pinkman', name: 'Jesse Pinkman', cat: 'slayer', color: '#f1c40f' },
      { id: 'mike_ehrmantraut', name: 'Mike Ehrmantraut', cat: 'tactical', color: '#7f8c8d' }
    ],
    monsters: ['Cartel Runner', 'Lab Guard', 'Desert Informant'],
    bosses: ['Tuco Salamanca', 'Gus Fring Operation'],
    worldBoss: 'Heisenberg Empire',
    gear: [
      ['bb_blue_sample', 'Blue Crystal Sample', 'Echantillon bleu', { atk: 10 }],
      ['bb_hazmat_suit', 'Yellow Hazmat Suit', 'Combinaison jaune', { def: 7, hp: 45 }],
      ['bb_rv_keys', 'Desert RV Keys', 'Cles du camping-car', { spd: 2, hp: 35 }]
    ],
    event: ['evt_bb_say_my_name', 'Say My Name', 'Say My Name', 'Heisenberg pressure fears enemies and boosts tactical damage.', 'La pression Heisenberg effraie les ennemis et booste les degats tactiques.'],
    decor: { sky: ['#463a20', '#090603'], floor: 'rgba(210, 175, 80, 0.17)', grid: 'rgba(92, 138, 67, 0.32)', motif: 'portalgarage', accent: '#d2af50' }
  });
}
