// Subverse — Safe Galactic Rebellion — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'subverse_safe_rebellion', universe: 'Subverse — Safe Galactic Rebellion', aliases: ['Subverse', 'Subverse Safe'],
    continuity: 'Subverse Prodigium rebellion, recast as a nonsexual adult science-fiction resistance campaign.',
    adaptationRule: 'All people are unambiguously 20+ and fully clothed in opaque practical uniforms; no nudity, sexuality, fetish framing or body emphasis. Enemies are armed Imperium forces, drones or monsters, never victims.',
    visualAnchor: 'Colorful Prodigium star systems, the Mary Celeste bridge and sleek resistance technology, with conservative space uniforms.',
    referenceUrl: 'https://store.steampowered.com/app/1034140/Subverse/',
    referenceUrls: ['https://store.steampowered.com/app/1034140/Subverse/'],
    heroes: [
      hero('captain', 'The Captain', 'Adult 20+ solar resistance captain in a fully closed dark naval jacket, trousers and boots; no actor likeness.', 'Service Sidearm', 'Mary Celeste Broadside', { role: 'tactical', prohibitedConcepts: ['nudity', 'sexualization', 'fetish outfit', 'actor likeness'] }),
      hero('demi', 'DEMI', 'Adult-coded blue-haired android in a fully opaque high-collar technician suit with covered arms and legs.', 'Systems Pulse', 'Shipwide Firewall', { role: 'hacker', prohibitedConcepts: ['nudity', 'sexualization', 'bodysuit emphasis'] }),
      hero('lily', 'Lily', 'Adult 20+ scientist with red hair, lab coat, closed shirt, practical trousers, gloves and scanner.', 'Research Blaster', 'Bio-Sample Countermeasure', { role: 'hacker', prohibitedConcepts: ['nudity', 'sexualization', 'revealing clothing'] })
    ],
    enemies: [
      threat('imperium_drone', 'Imperium Combat Drone', 'White-and-crimson compact military drone with angular wings and blue optics.', 'Pulse Cannons', 'Lock-On Volley'),
      threat('pirate_fighter', 'Space Pirate Fighter', 'Scratched asymmetrical strike craft with orange thrusters and improvised armor.', 'Wing Guns', 'Strafing Run'),
      threat('mantic_bioform', 'Hostile Mantic Bioform', 'Non-humanoid armored alien creature with four grounded limbs and luminous teal carapace.', 'Carapace Charge', 'Bio-Electric Burst')
    ],
    bosses: [
      threat('tibold', 'Dread Lord Tibold', 'Adult armored space pirate in a fully closed coat and helmet, carrying a heavy energy blade.', 'Energy Cleaver', 'Boarding Reinforcements'),
      threat('maeyomodo', 'Admiral Maeyomodo', 'Adult Imperium admiral in a high-collar full military uniform commanding from a shielded dais.', 'Command Sidearm', 'Imperium Barrage'),
      threat('dreadnought', 'Imperium Dreadnought', 'Vast wedge-shaped warship with crimson armor bands, cannon batteries and bright engines.', 'Battery Salvo', 'Prodigium Blockade')
    ],
    worldBoss: threat('command_nexus', 'Imperium Command Nexus', 'Planet-scale armored command station with concentric shield rings and drone docks.', 'Orbital Beam', 'Imperium Fleet Muster'),
    gear: [gear('demi_scanner', 'DEMI Systems Scanner', 'Compact blue holographic diagnostic tool without UI text.', { atk: 0, def: 3, spd: 2 }), gear('lily_sample_case', 'Lily Sample Case', 'Sealed silver science case with green specimen lights.', { atk: 1, def: 4, spd: 0 }), gear('mary_celeste_core', 'Mary Celeste Core', 'Turquoise ship-energy core inside a dark protective frame.', { atk: 3, def: 3, spd: 1 })],
    stages: [stage('Mary Celeste Boarding Deck', 'Blue-lit resistance corridors with cargo clamps and closed blast doors.'), stage('Imperium Blockade', 'Crimson fleet silhouettes around a bright nebula and a navigable debris lane.'), stage('Command Nexus Orbit', 'Shield rings, defense satellites and the station core over a violet planet.')],
    event: event('prodigium_uprising', 'Prodigium Uprising', 'Resistance beacons ignite across five nebulae while the Mary Celeste crosses the foreground.')
  });
}
