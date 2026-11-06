// Rob Zombie — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Rob Zombie',
    mediaType: 'music',
    faction: 'horror',
    stageName: 'Grindhouse Dragula Lot',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Dragula Stage Machine',
    title: { en: 'Rob Zombie', fr: 'Rob Zombie' },
    desc: {
      en: 'Shock-rock horror with grindhouse lights, monster-movie props, hot rods, and undead stage energy.',
      fr: 'Shock-rock horrifique avec lumiere grindhouse, accessoires de film de monstre, hot rods et scene morte-vivante.'
    },
    hero: { id: 'rob_zombie', name: 'Rob Zombie', cat: 'horror', color: '#5b2c1f' },
    allies: [
      { id: 'mike_riggs', name: 'Mike Riggs', cat: 'slayer', color: '#922b21' },
      { id: 'rob_blasko_nicholson', name: 'Rob "Blasko" Nicholson', cat: 'marine', color: '#7b7d7d' }
    ],
    monsters: ['Living Dead Girl Dancer', 'Dragula Hot Rod Fiend', 'House of 1000 Corpses Ghoul'],
    bosses: ['Superbeast Stage Brute', 'Lords of Salem Ritual'],
    worldBoss: 'Dragula Stage Machine',
    gear: [
      ['rz_dragula_key', 'Dragula Ignition Key', 'Cle de contact Dragula', { spd: 2, atk: 6 }],
      ['rz_grindhouse_reel', 'Grindhouse Film Reel', 'Bobine grindhouse', { def: 4, hp: 65 }],
      ['rz_shock_mic', 'Shock Rock Mic', 'Micro shock-rock', { atk: 10 }]
    ],
    event: ['evt_rz_dragula', 'Dragula Hot-Rod Ram', 'Charge hot-rod Dragula', 'A horror hot rod rams through all enemies.', 'Un hot-rod horrifique traverse tous les ennemis.'],
    decor: { sky: ['#2b140f', '#070201'], floor: 'rgba(132, 48, 37, 0.2)', grid: 'rgba(255, 169, 67, 0.28)', motif: 'toyfactory', accent: '#ffa943' }
  });
}
