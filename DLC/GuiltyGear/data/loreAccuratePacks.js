// Guilty Gear — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('dizzy_gg', 'Dizzy', 'hacker', '#9b59b6', 'magic', 'Necro Undine Shot', 'Gamma Ray Seed', 'Wings of Restraint', 'Gear Peace Overture'),
    hero('baiken', 'Baiken', 'slayer', '#e17055', 'katana', 'Tatami Gaeshi', 'Kabari Hook Pull', 'Azami Guard', 'Kenjutsu Revenge Arc'),
    hero('millia_rage', 'Millia Rage', 'slayer', '#f1c40f', 'hair', 'Tandem Top Cut', 'Haircar Rush', 'Mirazh Step', 'Iron Maiden Hair Storm')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('blade', 'Stun Edge', 'Vapor Thrust', 'Sacred Order Guard', 'Ride The Lightning', '#3498db'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('anchor', 'Anchor Swing', 'Dolphin Charge', 'Pirate Guard', 'Great Yamada Attack', '#ff7675'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Gear Cell Fragment', 95, 14, 6, '#c0392b', 'fire'),
      monster('Illyrian Knight', 105, 13, 5, '#3498db', 'blade'),
      monster('Backyard Data Wraith', 90, 15, 7, '#9b59b6', 'data')
    ],
    bosses: [
      boss('Justice Gear Core', 640, 24, 5, '#b03a2e', 'gamma_ray', 'Gamma Ray Annihilation'),
      boss('I-No Temporal Witch', 590, 22, 8, '#d91e59', 'guitar', 'Time Rift Note')
    ]
  });
}
