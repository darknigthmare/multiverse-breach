// Halo — definitions consumed by src/game/loreAccuratePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createLoreAccurateHeroExpansions({ hero }) {
  return ([
    hero('cortana_fragment', 'Cortana Fragment', 'hacker', '#5fd7ff', 'laser', 'Data Spike', 'Forerunner Door Override', 'Hardlight Decoy', 'Rampancy Logic Storm'),
    hero('noble_six', 'Noble Six', 'marine', '#4d5f64', 'gun', 'DMR Precision Burst', 'Armor Lock Counter', 'Reach Last Stand', 'Sabre Strike Beacon'),
    hero('buck', 'Edward Buck', 'tactical', '#556b5d', 'gun', 'ODST SMG Burst', 'Drop Pod Flank', 'Helljumper Cover', 'Orbital Drop Shock')
  ]);
}

export function createLoreAccurateHeroOverrides({ loadout }) {
  return (loadout('energy_sword', 'Energy Sword Cut', 'Active Camo Flank', 'Sangheili Honor Guard', 'Great Schism Strike', '#95a5a6'));
}

export function createLoreAccurateHeroOverrides2({ loadout }) {
  return (loadout('gun', 'Marine Sergeant Burst', 'Spartan Morale Rally', 'Cigar Smoke Cover', 'Send Me Out With A Bang', '#27ae60'));
}

export function createLoreAccurateEnemyExpansions({ boss, monster }) {
  return ({
    monsters: [
      monster('Hunter Bond Brother', 180, 18, 3, '#1f7a66', 'fuel_rod'),
      monster('Brute Captain', 145, 16, 5, '#6f4e37', 'spiker'),
      monster('Flood Carrier Form', 85, 15, 4, '#8a7b3f', 'infection_burst')
    ],
    bosses: [
      boss('Gravemind Tendril Node', 640, 21, 2, '#5f6b3d', 'flood_tendrils', 'Logic Plague Whisper'),
      boss('Warden Eternal Fragment', 620, 23, 5, '#7fd7ff', 'hardlight_blade', 'Slipspace Slash')
    ]
  });
}
