// Alien: Covenant — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Alien: Covenant',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Planet 4 Cathedral Ruins',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Protomorph Cathedral',
    title: { en: 'Alien: Covenant', fr: 'Alien: Covenant' },
    desc: {
      en: 'A false paradise of spores, Engineer ruins, David s experiments, and the first elegant xenomorph design.',
      fr: 'Un faux paradis de spores, ruines Ingenieur, experiences de David et premier xenomorphe elegant.'
    },
    hero: { id: 'daniels_covenant', name: 'Daniels', cat: 'tactical', color: '#b0a27a' },
    allies: [
      { id: 'walter_covenant', name: 'Walter', cat: 'hacker', color: '#d6d6c2' },
      { id: 'tennessee_covenant', name: 'Tennessee', cat: 'marine', color: '#7b8a8b' }
    ],
    monsters: ['Neomorph', 'Spore Host', 'Praetomorph Stalker'],
    bosses: ['David Lab Horror', 'Covenant Cargo Xeno'],
    worldBoss: 'Protomorph Cathedral',
    gear: [
      ['covenant_spore_filter', 'Spore Filter Mask', 'Masque anti-spores', { def: 7, hp: 45 }],
      ['covenant_flare_gun', 'Covenant Flare Gun', 'Pistolet de detresse Covenant', { atk: 8, spd: 1 }],
      ['covenant_synth_key', 'Synthetic Access Key', 'Cle synthetique', { spd: 2, def: 3 }]
    ],
    event: ['evt_covenant_airlock', 'Cargo Airlock Flush', 'Purge du sas cargo', 'Flushes enemies into vacuum lanes for burst damage.', 'Projette les ennemis dans des couloirs de vide pour de gros degats.'],
    decor: { sky: ['#1f2b1f', '#040805'], floor: 'rgba(124, 129, 91, 0.18)', grid: 'rgba(202, 215, 122, 0.23)', motif: 'castle', accent: '#cad77a' }
  });
}
