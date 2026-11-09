// Dead Space — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('nicole_brennan', 'Nicole Brennan Echo', 'hacker', '#8e44ad', 'medkit', 'Medical Flash', 'Marker Hallucination Hack', 'Ishimura Memory Guard', 'Make Us Whole Reversal'),
    hero('hammond_ds', 'Zach Hammond', 'marine', '#7f8c8d', 'gun', 'Security Pulse Rifle', 'Bridge Order Mark', 'USG Command Guard', 'Escape Pod Sacrifice'),
    hero('kendra_daniels', 'Kendra Daniels', 'hacker', '#bdc3c7', 'terminal', 'CEC Terminal Hack', 'Data Cache Lock', 'Corporate Cover', 'Marker File Extraction')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('gun', 'Security Rifle Burst', 'Co-op Stasis Shot', 'Soldier Trauma Guard', 'Tau Volantis Push', '#7f8c8d'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'Engineer Cover Shot', 'Ship Route Fix', 'Eye Trauma Grit', 'Sprawl Escape Vector', '#fdcb6e'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Slasher Necromorph', 95, 14, 6, '#7a4b3a', 'bone_blades'),
      monster('Leaper Necromorph', 85, 15, 7, '#7d5f50', 'tail'),
      monster('Infector Winged Corpse', 80, 13, 8, '#5d4037', 'infection')
    ],
    bosses: [
      boss('Hunter Regenerator', 620, 22, 5, '#8d6e63', 'regrowth_claws', 'Regenerator Pursuit'),
      boss('Hive Mind Core', 780, 29, 3, '#7b241c', 'tentacles', 'Aegis VII Devour')
    ]
  });
}
