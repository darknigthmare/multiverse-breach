// Borderlands — definitions consumed by src/game/expandedUniverses.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createExpandedUniverses() {
  return ({
    universe: 'Borderlands',
    mediaType: 'game',
    faction: 'sciFi',
    stageName: 'Pandora Vault Breach',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'The Destroyer Vault Maw',
    title: { en: 'Borderlands', fr: 'Borderlands' },
    desc: { en: 'Vault hunters, psycho raids, cel-shaded guns, and Pandora chaos spill into the Nexus.', fr: 'Chasseurs de l Arche, raids de psychos, armes cel-shadees et chaos de Pandore percent le Nexus.' },
    hero: { id: 'lilith_borderlands', name: 'Lilith', cat: 'hacker', color: '#b24cff' },
    allies: [{ id: 'mordecai_borderlands', name: 'Mordecai', cat: 'tactical', color: '#8b6b3f' }, { id: 'claptrap_borderlands', name: 'Claptrap', cat: 'hacker', color: '#f4c542' }],
    monsters: ['Psycho Raider', 'Skag Pack', 'Bandit Bruiser'],
    bosses: ['Nine-Toes Warlord', 'Handsome Jack Echo'],
    worldBoss: 'The Destroyer Vault Maw',
    gear: [['bl_vault_key', 'Vault Key Fragment', 'Fragment de cle de l Arche', { atk: 9, spd: 1 }], ['bl_eridian_cell', 'Eridian Cell', 'Cellule eridienne', { def: 5, hp: 70 }], ['bl_loot_scope', 'Loot Scope', 'Viseur a butin', { spd: 2, atk: 5 }]],
    event: ['evt_bl_lootsplosion', 'Lootsplosion Breach', 'Breche lootsplosion', 'A Pandora loot blast damages enemies and raises shard drops.', 'Une explosion de butin de Pandore blesse les ennemis et augmente les eclats.'],
    decor: { sky: ['#39200f', '#090402'], floor: 'rgba(206, 114, 43, 0.18)', grid: 'rgba(255, 216, 83, 0.28)', motif: 'wasteland', accent: '#ffd853' }
  });
}
