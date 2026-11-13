// Mass Effect — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('tali', 'Tali Zorah', 'hacker', '#7d5fff', 'shotgun', 'Quarian Shotgun', 'Combat Drone Deploy', 'Tech Armor Seal', 'Migrant Fleet Override'),
    hero('wrex', 'Urdnot Wrex', 'marine', '#6b8e23', 'shotgun', 'Krogan Shotgun Blast', 'Biotic Charge Roar', 'Battle Rage Guard', 'Clan Urdnot War Cry'),
    hero('mordin', 'Mordin Solus', 'hacker', '#4aa3df', 'omnitool', 'Incinerate Pulse', 'Salarian Analysis', 'Medi-Gel Protocol', 'Had To Be Me')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('gun', 'Turian Sniper Shot', 'Concussive Mine', 'Calibrated Cover', 'Archangel Killbox', '#0984e3'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('biotic', 'Warp Field', 'Singularity Lift', 'Asari Barrier', 'Shadow Broker Data Storm', '#74b9ff'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Husk Shock Trooper', 85, 12, 6, '#8a9a9a', 'electric_claws'),
      monster('Geth Prime Platform', 155, 17, 4, '#5dade2', 'plasma'),
      monster('Collector Seeker Swarm', 75, 13, 8, '#d2b48c', 'swarm')
    ],
    bosses: [
      boss('Saren Arterius Spectre', 610, 22, 7, '#34495e', 'biotic_rifle', 'Sovereign Indoctrination'),
      boss('Harbinger Possessed Collector', 640, 23, 5, '#f39c12', 'dark_energy', 'Assuming Direct Control')
    ]
  });
}
