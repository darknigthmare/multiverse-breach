// BlazBlue — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('rachel_alucard', 'Rachel Alucard', 'hacker', '#8e44ad', 'magic', 'Wind Drive Spark', 'George XIII Summon', 'Nago Umbrella Guard', 'Tempest Dahlia'),
    hero('hakumen', 'Hakumen', 'slayer', '#ecf0f1', 'blade', 'Zantetsu Cut', 'Magatama Counter', 'Susanoo Guard', 'Time Killer Judgment'),
    hero('hazama', 'Hazama', 'slayer', '#145a32', 'chain', 'Ouroboros Chain', 'Serpent Trap', 'Green Suit Feint', 'Terumi Possession Break')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('blade', 'Ice Carver', 'Frost Bite Drive', 'Barrier Trigger Guard', 'Yukianesa Freeze', '#74b9ff'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'Nox Nyctores Shot', 'Chain Revolver Rush', 'Blue Uniform Guard', 'Bolverk Bullet Ballet', '#0984e3'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('NOL Guard Trooper', 95, 12, 5, '#34495e', 'rifle'),
      monster('Seithr Beast', 105, 15, 6, '#8e44ad', 'claws'),
      monster('Cauldron Automaton', 120, 14, 4, '#2c3e50', 'blade')
    ],
    bosses: [
      boss('Nu-13 Murakumo Unit', 600, 23, 7, '#ecf0f1', 'sword_bits', 'Sword Summoner Spiral'),
      boss('Terumi Azure Ghost', 610, 24, 8, '#27ae60', 'chain', 'Ouroboros Possession')
    ]
  });
}
