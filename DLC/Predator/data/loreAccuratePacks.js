// Predator — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('naru', 'Naru', 'tactical', '#8c6a45', 'axe', 'Rope Tomahawk', 'Mud Ambush Trap', 'Medicinal Cooling Hide', 'Predator Hunt Reversal'),
    hero('harrigan_p2_core', 'Mike Harrigan', 'tactical', '#6c5f54', 'gun', 'LAPD Pistol Burst', 'Subway Pursuit Shot', 'Concrete Jungle Cover', 'Trophy Room Stand'),
    hero('royce_predators_core', 'Royce', 'tactical', '#3f4f3f', 'gun', 'Mercenary Rifle Cut', 'Game Preserve Trap', 'Thermal Mask Feint', 'Super Predator Ambush')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('smart_disc', 'Wristblade Slice', 'Smart Disc Return', 'Cloak Reposition', 'Los Angeles Trophy Hunt', '#d35400'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'M16 Jungle Burst', 'Mud Trap Counter', 'Commando Tree Cover', 'Get To The Chopper', '#16a085'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Tracker Predator Hound', 90, 14, 8, '#4a4239', 'bite'),
      monster('Thermal Mine Drone', 70, 16, 6, '#d35400', 'mine'),
      monster('Cloaked Young Blood', 110, 15, 6, '#5a544c', 'combistick')
    ],
    bosses: [
      boss('Jungle Hunter', 560, 23, 6, '#40513b', 'plasma_caster', 'Self-Destruct Countdown'),
      boss('Feral Predator', 590, 24, 7, '#6a5c44', 'shield_blade', 'Bone Mask Shield Slam')
    ]
  });
}
