// Metal Gear — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('meryl_mgs', 'Meryl Silverburgh', 'tactical', '#8e6f4e', 'gun', 'Desert Eagle Shot', 'Codec Morale Call', 'Foxhound Cover Step', 'Shadow Moses Resolve'),
    hero('gray_fox', 'Gray Fox', 'slayer', '#bfc9ca', 'blade', 'High-Frequency Slash', 'Stealth Camo Lunge', 'Ninja Parry', 'Cyborg Fox Sacrifice'),
    hero('big_boss', 'Big Boss', 'tactical', '#4d5b43', 'gun', 'CQC Takedown', 'Outer Heaven Ambush', 'Legendary Soldier Guard', 'Boss Protocol')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('high_frequency_blade', 'HF Blade Cut', 'Ninja Run Slash', 'Parry Stance', 'Zandatsu Overdrive', '#95a5a6'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('terminal', 'Codec Support Ping', 'Metal Gear Data Hack', 'Stealth Lab Guard', 'Philanthropy Upload', '#16a085'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('FROG Haven Trooper', 100, 14, 7, '#5d6d7e', 'p90'),
      monster('Dwarf Gekko Swarm', 70, 13, 8, '#bdc3c7', 'tripod_kick'),
      monster('PMC Heavy Shield', 130, 12, 4, '#2f3f46', 'riot_shield')
    ],
    bosses: [
      boss('Psycho Mantis Memory', 520, 18, 7, '#8e44ad', 'psychic', 'Controller Port Blackout'),
      boss('Vamp Immortal Striker', 560, 21, 8, '#17202a', 'knife', 'Nanomachine Regeneration'),
      boss('Metal Gear REX Phantom', 720, 25, 3, '#4f5b5c', 'railgun', 'Shadow Moses Railgun')
    ]
  });
}
