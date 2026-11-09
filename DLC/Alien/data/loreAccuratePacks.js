// Alien — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('amanda_ripley', 'Amanda Ripley', 'horror', '#7e8581', 'scanner', 'Motion Tracker Ping', 'Access Rewire Trap', 'Locker Breath Hold', 'Sevastopol Overload'),
    hero('dallas_alien', 'Captain Dallas', 'tactical', '#8a7d68', 'gun', 'Nostromo Flamethrower Tap', 'Air Duct Sweep', 'MU-TH-UR Route Lock', 'Self Destruct Countdown'),
    hero('parker_alien', 'Parker', 'marine', '#6c5b4a', 'wrench', 'Maintenance Wrench Hit', 'Coolant Valve Burst', 'Engineering Hold', 'Nostromo Engine Surge')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('gun', 'M41A Pulse Rifle Burst', 'Shotgun Door Breach', 'Colonial Marine Cover', 'Hudson Corridor Hold', '#7f8c8d'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('scanner', 'Synthetic Knife Trick', 'APC Systems Bypass', 'Android Self-Seal', 'Dropship Remote Route', '#bdc3c7'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Chestburster Larva', 45, 16, 8, '#c7a17a', 'inner_jaw'),
      monster('Warrior Xenomorph', 120, 16, 7, '#101217', 'acid_claws'),
      monster('Acid Blood Pool', 70, 14, 2, '#9ac430', 'acid')
    ],
    bosses: [
      boss('Ash Synthetic Saboteur', 460, 17, 6, '#d9d9d9', 'rolled_magazine', 'Special Order 937'),
      boss('Weyland-Yutani Retrieval Team', 520, 19, 5, '#2f3f46', 'pulse_rifle', 'Specimen Capture Protocol')
    ]
  });
}
