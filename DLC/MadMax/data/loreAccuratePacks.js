// Mad Max — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('goose_mm', 'Jim Goose', 'tactical', '#7f8c8d', 'gun', 'MFP Shotgun Blast', 'Pursuit Bike Ram', 'Highway Patrol Cover', 'Bronze Badge Revenge'),
    hero('feral_kid', 'Feral Kid', 'horror', '#d2a679', 'boomerang', 'Metal Boomerang Throw', 'Scrap Ambush', 'Crawlspace Hide', 'Wasteland Heir'),
    hero('praetorian_jack', 'Praetorian Jack', 'marine', '#8d6e63', 'gun', 'War Rig Rifle', 'Road Warrior Escort', 'Convoy Armor Guard', 'Forty Day Wasteland Run')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('gun', 'War Rig Rifle Burst', 'Mechanical Arm Grapple', 'Citadel Defiance Guard', 'Green Place Run', '#7f8c8d'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('melee', 'Chrome Spear Rush', 'War Boy Nitro', 'Witness Me Guard', 'Valhalla Turnaround', '#ffeaa7'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Polecat Raider', 85, 13, 7, '#d9b36c', 'spear'),
      monster('Bullet Farmer Gunner', 115, 16, 4, '#7f8c8d', 'machine_gun'),
      monster('People Eater Convoy', 130, 15, 3, '#5d4037', 'ram')
    ],
    bosses: [
      boss('Lord Humungus Warlord', 620, 24, 5, '#3d2b1f', 'magnum', 'Wasteland Ultimatum'),
      boss('Dementus Horde Chief', 650, 25, 6, '#a04000', 'chariot', 'Biker Horde Collapse')
    ]
  });
}
