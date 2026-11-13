// Payday — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('chains_pd', 'Chains', 'marine', '#2d3436', 'gun', 'Enforcer Shotgun', 'Ammo Bag Drop', 'Heavy Armor Brace', 'Assault Wave Breaker'),
    hero('clover_pd', 'Clover', 'slayer', '#2ecc71', 'gun', 'Akimbo Pistol Cut', 'Lockpick Sprint', 'Irish Luck Dodge', 'Queen of Heists'),
    hero('houston_pd', 'Houston', 'tactical', '#6c5ce7', 'gun', 'CAR-4 Burst', 'ECM Feedback', 'Hostage Trade Cover', 'Perfect Getaway Line')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('gun', 'AK Burst', 'Drill Restart Kick', 'Armor Bag Cover', 'Panic Room Assault', '#c0392b'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'Akimbo Pistol Shot', 'ECM Jailbreak', 'Mask Switch Dodge', 'Hoxton Revenge Job', '#2980b9'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Medic SWAT Responder', 95, 8, 5, '#2ecc71', 'medkit'),
      monster('Sniper Laser Officer', 80, 16, 6, '#e74c3c', 'sniper'),
      monster('Captain Winters Shield Wall', 145, 10, 3, '#34495e', 'shield')
    ],
    bosses: [
      boss('Captain Winters Assault Leader', 560, 19, 4, '#34495e', 'shield_wall', 'Police Morale Lock'),
      boss('Skulldozer Elite', 680, 25, 3, '#111111', 'shotgun', 'Dozer Breach Slam')
    ]
  });
}
