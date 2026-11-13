// Negima — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('konoka_konoe', 'Konoka Konoe', 'hacker', '#ffb6c1', 'healing', 'Healing Bell Pulse', 'Kyoto Barrier Prayer', 'Gentle Pactio Guard', 'Konoe Restoration'),
    hero('setsuna_sakurazaki', 'Setsuna Sakurazaki', 'slayer', '#ecf0f1', 'katana', 'Shinmei-Ryu Slash', 'Winged Guardian Dash', 'Oath Guard', 'Setsuna Blade Storm'),
    hero('kotaro_inugami_hero', 'Kotaro Inugami', 'slayer', '#d35400', 'claws', 'Dog God Claw', 'Shadow Clone Strike', 'Wolf Guard', 'Inugami Rival Rush')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('blade', 'Artifact Sword Hit', 'Anti-Magic Break', 'Pactio Guard', 'Ensis Exorcizans Burst', '#e17055'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('magic', 'Dark Ice Bolt', 'Puppeteer Shadow', 'Vampire Barrier', 'Magia Erebea Lesson', '#6c5ce7'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Mahora Mage Student', 85, 11, 6, '#d9b86b', 'spell'),
      monster('Ala Alba Training Doll', 90, 12, 5, '#bdc3c7', 'staff'),
      monster('Demon Pact Beast', 115, 15, 6, '#8e44ad', 'claws')
    ],
    bosses: [
      boss('Chao Lingshen Future Plot', 570, 20, 7, '#3498db', 'future_tech', 'Timeline Rewrite Device'),
      boss('Lifemaker Avatar', 760, 28, 4, '#ecf0f1', 'creation_magic', 'Perfect World Invocation')
    ]
  });
}
