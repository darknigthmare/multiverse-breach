// Nemesis — Awaken Realms — definitions consumed by src/game/canonRosterWavePartG.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonRosterWavePartG({ event, gear, hero, stage, threat }) {
  return ({
    key: 'nemesis_awaken_realms', universe: 'Nemesis — Awaken Realms', aliases: ['Nemesis tabletop', 'Nemesis board game'],
    continuity: 'Awaken Realms Nemesis base game aboard the infested ship, with only official core-box roles and Intruder ecology.',
    adaptationRule: 'Preserve semi-cooperative survival, noise and ship-system tension; crew roles are archetypes, and ordinary crewmates are never enemies.',
    visualAnchor: 'A failing industrial starship of dark corridors, red alarms, asymmetric crew suits and pale-black Intruder carapaces.',
    referenceUrl: 'https://awakenrealms.com/games/awaken-realms/nemesis', referenceUrls: ['https://awakenrealms.com/games/awaken-realms/nemesis', 'https://awakenrealms.com/images/download/Nemesis/ENG/RULEBOOK_280x280mm_bleed3mm_28pages_PRINT.pdf'],
    heroes: [hero('soldier', 'Soldier', 'Armored crew soldier in orange-gray pressure gear carrying a compact rifle.', 'Assault Rifle', 'Suppressing Fire', { role: 'marine' }), hero('scientist', 'Scientist', 'Adult researcher in sealed white-gray ship suit carrying scanner and sample case.', 'Stun Tool', 'Intruder Weakness Analysis', { role: 'hacker' }), hero('scout', 'Scout', 'Light-suited crew explorer with hood, flashlight and compact sidearm.', 'Sidearm', 'Silent Recon', { role: 'tactical' })],
    enemies: [threat('larva', 'Intruder Larva', 'Small pale segmented parasite with black mouthparts and no humanoid shape.', 'Latch', 'Contamination'), threat('creeper', 'Intruder Creeper', 'Low six-limbed juvenile Intruder with pale shell and elongated tail.', 'Ambush Bite', 'Vent Crawl'), threat('adult', 'Adult Intruder', 'Tall black-pale alien predator with blade-like limbs and ribbed head.', 'Claw Strike', 'Noise Hunt')],
    bosses: [threat('breeder', 'Intruder Breeder', 'Large many-limbed breeding caste with swollen armored thorax.', 'Multi-Claw Sweep', 'Larva Call'), threat('drone', 'Intruder Drone', 'Rare hulking caste with thick frontal shell and heavy forelimbs.', 'Armor Ram', 'Corridor Block'), threat('nest', 'Intruder Nest', 'Organic egg cluster filling a ship room with resin and pulsing sacs.', 'Egg Hatch', 'Noise Cascade')],
    worldBoss: threat('queen', 'Intruder Queen', 'Towering pale-black alien queen with crown-like head shell and four attacking limbs.', 'Queen Claws', 'Nest Fury'),
    gear: [gear('noise_marker', 'Noise Marker', 'Yellow triangular ship-noise token represented as an in-world sensor beacon.', { atk: 0, def: 2, spd: 3 }), gear('fire_extinguisher', 'Fire Extinguisher', 'Heavy red starship extinguisher with silver nozzle.', { atk: 1, def: 4, spd: 0 }), gear('intruder_weakness', 'Intruder Weakness Sample', 'Sealed transparent specimen vial in a yellow bio-case.', { atk: 4, def: 1, spd: 0 })],
    stages: [stage('Hibernatorium', 'Cryopods, frost, emergency lights and branching sealed corridors.'), stage('Engine Room Failure', 'Hot machinery, spreading fire and damaged coolant pipes.'), stage('Intruder Nest', 'Resin-coated chamber packed with eggs and narrow escape routes.')],
    event: event('jump_to_earth', 'Jump to Earth', 'The damaged ship aligns with Earth while engines, coordinates and contamination remain unresolved.')
  });
}
