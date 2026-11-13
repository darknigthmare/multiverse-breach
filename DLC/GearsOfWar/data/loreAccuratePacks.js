// Gears of War — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('baird', 'Damon Baird', 'hacker', '#c7c9c7', 'gun', 'Lancer Tech Burst', 'Jackbot Field Hack', 'COG Repair Cover', 'Declassified Kill Zone'),
    hero('anya_stroud', 'Anya Stroud', 'tactical', '#7b8f9b', 'gun', 'COG Command Shot', 'Intel Relay Mark', 'Tac-Com Evac Route', 'Sovereign Command Fire'),
    hero('kait_diaz', 'Kait Diaz', 'slayer', '#8c5f4a', 'knife', 'Outsider Knife Cut', 'Locust Link Break', 'Swarm Sense Guard', 'Hivemind Severance')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('gun', 'Lancer Cover Fire', 'Gnasher Breach Shot', 'Brotherhood Last Stand', 'Maria Memory Charge', '#3498db'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'Thrashball Tackle', 'Boomshot Hype Shot', 'Cole Train Brace', 'Cole Train Runs On Whole Grain', '#f1c40f'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Kantus Priest', 120, 13, 4, '#75624a', 'gorgon_pistol'),
      monster('Theron Guard', 130, 14, 5, '#6e5b45', 'torque_bow'),
      monster('Boomer Locust', 170, 18, 2, '#5a4a3a', 'boomshot')
    ],
    bosses: [
      boss('Berserker Matriarch', 620, 24, 5, '#3b2b28', 'blind_charge', 'Sonic Charge Break'),
      boss('Queen Myrrah', 610, 22, 6, '#6d5946', 'tempest', 'Tempest Beetle Storm'),
      boss('Corpser Burrower', 680, 23, 3, '#2d2b24', 'burrow_claws', 'Emergence Pit Collapse')
    ]
  });
}
