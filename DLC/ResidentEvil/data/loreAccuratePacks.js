// Resident Evil — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('chris_redfield', 'Chris Redfield', 'marine', '#3f5673', 'gun', 'S.T.A.R.S. Rifle Burst', 'Boulder Punch Break', 'BSAA Cover Fire', 'Anti-B.O.W. Suppression'),
    hero('claire_redfield', 'Claire Redfield', 'tactical', '#c0392b', 'gun', 'Quickdraw Revolver', 'Rescue Route Signal', 'Medic Herb Guard', 'Code Veronica Escape'),
    hero('ada_wong', 'Ada Wong', 'slayer', '#8b0000', 'crossbow', 'Punisher Pistol Shot', 'Grapple Hook Kick', 'Spy Smoke Vanish', 'Red Dress Extraction')
  ]);
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Crimson Head Prototype', 105, 15, 7, '#7b1f1f', 'claws'),
      monster('Regenerator Parasite Host', 150, 17, 4, '#c5b7a1', 'spikes'),
      monster('Ganado Plaga Villager', 95, 13, 5, '#8d6e63', 'axe')
    ],
    bosses: [
      boss('Osmund Saddler Plaga Apostle', 610, 23, 4, '#3f2f2f', 'plaga_tendrils', 'Dominant Plaga Command'),
      boss('Lady Dimitrescu Mutant', 650, 24, 5, '#d8c6a0', 'talons', 'Castle Blood Curse'),
      boss('Jack Baker Molded Patriarch', 590, 22, 5, '#5d4037', 'mold_axe', 'Welcome To The Family')
    ]
  });
}
