// Ghost in the Shell — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('aramaki', 'Daisuke Aramaki', 'tactical', '#7f8c8d', 'command', 'Section 9 Order', 'Political Pressure Trap', 'Director Cover', 'Stand Alone Directive'),
    hero('ishikawa_gits', 'Ishikawa', 'hacker', '#34495e', 'terminal', 'Cyberbrain Trace', 'Network Backdoor', 'Console Cover', 'Section 9 Data Sweep'),
    hero('tachikoma_unit', 'Tachikoma Unit', 'marine', '#2980b9', 'gun', 'Spider Tank Burst', 'Think Tank Grenade', 'AI Curiosity Guard', 'Tachikoma Sacrifice')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('gun', 'Cybernetic Pistol Burst', 'Thermoptic Raid', 'Ranger Eye Guard', 'Section 9 Heavy Entry', '#b2bec3'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'Mateba Revolver Shot', 'Old-School Detective Scan', 'Human Instinct Guard', 'Major Case Break', '#ffeaa7'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Geisha Bot Ambusher', 85, 13, 7, '#dfe6e9', 'mono_wire'),
      monster('Cyberbrain Virus Host', 80, 12, 8, '#39ffcc', 'hack'),
      monster('Armed Suit Prototype', 140, 16, 4, '#7f8c8d', 'cannon')
    ],
    bosses: [
      boss('Kuze Refugee Network Ghost', 580, 20, 6, '#34495e', 'cyberbrain_link', 'Individual Eleven Signal'),
      boss('Solid State Society Puppeteer', 620, 22, 5, '#95a5a6', 'network_ghost', 'Remote Body Cascade')
    ]
  });
}
