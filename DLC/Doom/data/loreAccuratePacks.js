// Doom — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('vega', 'VEGA', 'hacker', '#b8f2ff', 'laser', 'UAC Data Spike', 'Argent Filter Hack', 'Facility Override Shield', 'VEGA Core Reboot'),
    hero('night_sentinel', 'Night Sentinel', 'slayer', '#d9b86b', 'blade', 'Sentinel Spear Jab', 'Argent Hammer Slam', 'Praetor Guard', 'Sentinel Prime Oath'),
    hero('betrayer_doom', 'The Betrayer', 'marine', '#7f5f3f', 'axe', 'Crucible Axe Cut', 'Atlan Memory Strike', 'Sentinel Shame Guard', 'Lost Son Reckoning')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('laser', 'Argent Lance', 'UAC Facility Lock', 'Cybernetic Frame Guard', 'Crucible Transfer', '#bdc3c7'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'UAC Rifle Burst', 'Frag Grenade Toss', 'Praetor Bootleg Guard', 'Mars Security Push', '#27ae60'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Imp Fireball Pack', 80, 12, 6, '#b03a2e', 'fireball'),
      monster('Mancubus Heavy Demon', 150, 18, 3, '#a04000', 'flame_cannon'),
      monster('Cacodemon Floater', 110, 15, 5, '#c0392b', 'plasma_bite')
    ],
    bosses: [
      boss('Marauder Sentinel Fallen', 640, 24, 8, '#5d4037', 'argent_axe', 'Wolf Summon Counter'),
      boss('Icon of Sin Fragment', 820, 30, 2, '#7b241c', 'hell_portal', 'Hell On Earth Collapse')
    ]
  });
}
