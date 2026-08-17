import { freezeCanonRosterPart } from './canonRosterPackFactory.js';

const hero = (id, name, visualAnchor, weapon, special, extra = {}) => ({
  id, name, visualAnchor, weapon, special,
  fr: `${name} conserve sa silhouette et sa fonction canoniques dans cette adaptation fan-made originale.`,
  en: `${name} preserves the canonical silhouette and function in this original fan-made adaptation.`,
  ...extra
});

const threat = (id, name, visualAnchor, weapon, special, extra = {}) => ({
  id, name, visualAnchor, weapon, special,
  fr: `${name} reste une menace canonique clairement identifiable, sans gore ni reprise d'illustration officielle.`,
  en: `${name} remains a clearly identifiable canonical threat, without gore or copied official artwork.`,
  ...extra
});

const trial = (id, name, visualAnchor, objective, extra = {}) => ({
  id, name, visualAnchor, nonCombat: true, objective,
  objectiveFr: `Terminer l'épreuve « ${name} » par l'observation, l'orientation, le rythme ou l'interaction, sans attaquer personne.`,
  victoryCondition: `complete-${id}-trial`,
  fr: `${name} est une épreuve environnementale non combattante et jamais une cible vivante.`,
  en: `${name} is a non-combat environmental Trial and never a living target.`,
  ...extra
});

const gear = (id, name, visualAnchor, boost = { atk: 2, def: 2, spd: 1 }) => ({
  id, name, frName: name, visualAnchor, boost,
  fr: `${name} conserve sa forme et son usage canoniques.`,
  en: `${name} preserves its canonical shape and use.`
});

const stage = (name, visualAnchor, extra = {}) => ({
  name, visualAnchor,
  fr: `${name} transpose fidèlement ce lieu ou cette situation en parcours de jeu original.`,
  en: `${name} faithfully translates this location or situation into an original gameplay route.`,
  ...extra
});

const event = (id, name, visualAnchor, extra = {}) => ({
  id, name, frName: name, visualAnchor,
  en: `${name} temporarily reshapes the breach around the continuity's signature rules.`,
  fr: `${name} reconfigure temporairement la brèche autour des règles emblématiques de la continuité.`,
  ...extra
});

export const CANON_ROSTER_WAVE_PART_G = freezeCanonRosterPart([
  {
    key: 'crypt_necrodancer', universe: 'Crypt of the NecroDancer', aliases: ['NecroDancer', 'Crypt of the Necrodancer'],
    continuity: 'Crypt of the NecroDancer base campaign and AMPLIFIED family storyline.',
    adaptationRule: 'Every action lands on the beat; retain readable voxel-like fantasy silhouettes and musical attacks, using only original fan-made art.',
    visualAnchor: 'A neon-lit grid crypt whose stone chambers pulse in blue, purple and gold on each musical beat.',
    referenceUrl: 'https://braceyourselfgames.com/crypt-of-the-necrodancer/',
    referenceUrls: ['https://braceyourselfgames.com/crypt-of-the-necrodancer/'],
    heroes: [
      hero('cadence', 'Cadence', 'Red-haired adventurer, blue tunic, brown boots, small dagger and glowing heart beat marker.', 'Dagger Beat', 'Golden Lute Resonance', { role: 'slayer' }),
      hero('melody', 'Melody', 'Older red-haired bard in practical purple adventuring clothes carrying the Golden Lute.', 'Lute Pulse', 'Family Refrain', { role: 'tactical' }),
      hero('aria', 'Aria', 'Elder musician in a dark purple dress and hood, holding a compact golden lute.', 'Lute Note', 'Aria Perfect Measure', { role: 'tactical' })
    ],
    enemies: [
      threat('skeleton', 'Skeleton', 'White dungeon skeleton with square skull, tiny sword and beat-ready stance.', 'Bone Sword', 'Rhythmic Step'),
      threat('zombie', 'Zombie', 'Green blocky undead in torn brown dungeon clothes, slow one-tile gait.', 'Heavy Swipe', 'Delayed Beat'),
      threat('red_dragon', 'Red Dragon', 'Large red-orange pixel dragon with broad wings and a bright fire-breath tell.', 'Fire Breath', 'Lane Sweep')
    ],
    bosses: [
      threat('king_conga', 'King Conga', 'Huge crowned gorilla conductor backed by an orderly conga line of undead.', 'Conga Slam', 'Undead Procession'),
      threat('death_metal', 'Death Metal', 'Armored skeletal reaper with microphone-scythe and blazing heavy-metal aura.', 'Microphone Scythe', 'Fireball Chorus'),
      threat('necrodancer', 'The NecroDancer', 'Pale caped dungeon master with tall collar, dark armor and luminous magic.', 'Necromantic Bolt', 'Crypt Tempo Shift')
    ],
    worldBoss: threat('golden_lute', 'Golden Lute', 'Gigantic sentient golden instrument occupying a musical boss grid.', 'Resonant String', 'Full-Grid Chord'),
    gear: [gear('golden_lute_fragment', 'Golden Lute Fragment', 'Small angular shard of radiant gold from the legendary instrument.', { atk: 4, def: 0, spd: 1 }), gear('ring_of_peace', 'Ring of Peace', 'Simple gold ring with a calm pale-blue pulse.', { atk: 0, def: 4, spd: 1 }), gear('glass_rapier', 'Glass Rapier', 'Fragile translucent rapier with a narrow cyan edge.', { atk: 5, def: 0, spd: 2 })],
    stages: [stage('Zone 1 Crypt', 'Blue-gray dungeon tiles, braziers, doors and a central beat grid.'), stage('King Conga Hall', 'Purple crypt ballroom with ordered enemy lanes and a raised royal platform.'), stage('Golden Lute Chamber', 'Black-and-gold musical sanctum where luminous strings divide the grid.')],
    event: event('all_zones', 'All Zones Medley', 'Five crypt biomes change palette and hazard pattern in synchrony with one continuous medley.')
  },
  {
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
  },
  {
    key: 'no_mans_sky', universe: "No Man's Sky", aliases: ['No Mans Sky', 'NMS'],
    continuity: 'Atlas, Artemis and Sentinel storylines across the current No Man’s Sky universe.',
    adaptationRule: 'Prioritize exploration, scanning and Sentinel combat; procedural travellers stay helmeted and original, avoiding any single player-avatar claim.',
    visualAnchor: 'Vivid procedural planets, red Atlas geometry, turquoise Traveller technology and orange Sentinel optics.',
    referenceUrl: 'https://www.nomanssky.com/atlas-rises-update/',
    referenceUrls: ['https://www.nomanssky.com/atlas-rises-update/', 'https://www.nomanssky.com/sentinel-update/'],
    heroes: [hero('traveller', 'The Traveller', 'Helmeted explorer in an orange-and-white exosuit with backpack, visor and Multi-Tool.', 'Multi-Tool Bolt', 'Terrain Manipulator', { role: 'tactical' }), hero('nada', 'Priest Entity Nada', 'Korvax entity with faceted machine head, long dark robe and teal chest lights.', 'Anomaly Beacon', 'Reality Shelter', { role: 'hacker', nonCombat: true, objective: 'Calibrate the Space Anomaly reality beacon.', objectiveFr: 'Calibrer la balise de réalité de l’Anomalie spatiale.' }), hero('polo', 'Specialist Polo', 'Short stocky Gek specialist in padded yellow-brown exploration gear with wide amphibian head.', 'Discovery Scanner', 'Anomaly Coordinates', { role: 'trial', nonCombat: true, objective: 'Scan and catalogue three anomalous discoveries.', objectiveFr: 'Scanner et cataloguer trois découvertes anormales.' })],
    enemies: [threat('sentinel_drone', 'Sentinel Drone', 'Small floating orange-white enforcement drone with central red lens.', 'Rapid Laser', 'Repair Beam'), threat('corrupted_sentinel', 'Corrupted Sentinel', 'Purple crystalline drone with jagged corrupted plating and violet eye.', 'Corrupted Bolt', 'Crystal Burst'), threat('biological_horror', 'Biological Horror', 'Lean black insectoid quadruped with pale claws and no humanoid traits.', 'Claw Rush', 'Acid Spit')],
    bosses: [threat('quadruped', 'Sentinel Quadruped', 'Low four-legged armored machine with orange eye and hard angular shell.', 'Pounce Beam', 'Armor Lock'), threat('hardframe', 'Sentinel Hardframe', 'Tall orange-white bipedal combat mech with broad shoulders and jet pack.', 'Hardframe Cannon', 'Jump Slam'), threat('walker', 'Sentinel Walker', 'Towering four-legged red-and-white machine with exposed glowing brain core.', 'Walker Laser', 'Mortar Barrage')],
    worldBoss: threat('capital_ship', 'Sentinel Capital Ship', 'Huge black-and-orange Sentinel freighter with geometric hull and many laser emplacements.', 'Capital Laser', 'Interceptor Swarm'),
    gear: [gear('multi_tool', 'Traveller Multi-Tool', 'Compact red-and-gray scanning tool with short barrel.', { atk: 3, def: 0, spd: 2 }), gear('atlas_pass', 'AtlasPass', 'Small red-and-black geometric access card without readable text.', { atk: 0, def: 2, spd: 3 }), gear('walker_brain', 'Walker Brain', 'Glowing orange machine core in white armor fragments.', { atk: 2, def: 4, spd: 0 })],
    stages: [stage('Paradise Planet Survey', 'Lush alien grass, floating rocks, ringed planet and scanning waypoints.', { nonCombat: true, objective: 'Scan fauna, flora and minerals without harming wildlife.' }), stage('Sentinel Pillar', 'Tall orange-black archive pillar guarded by drones.'), stage('Atlas Interface', 'Monumental black chamber dominated by a luminous red diamond.', { nonCombat: true, objective: 'Align the Atlas glyph sequence and reach the interface.' })],
    event: event('sixteen', 'The Meaning of Sixteen', 'Red Atlas glyphs repeat through portals while reality fragments into glass-like layers.')
  },
  {
    key: 'team_fortress_2', universe: 'Team Fortress 2', aliases: ['TF2', 'Mann vs. Machine'],
    continuity: 'Valve Team Fortress 2, specifically the RED mercenaries defending Mann Co. in Mann vs. Machine.',
    adaptationRule: 'Use the stylized 1960s mercenary shapes and blue-eyed robots; preserve class readability without Valve logos or copied promotional poses.',
    visualAnchor: 'Warm RED industrial bases opposed by cold blue-gray Mann vs. Machine robots and bomb tracks.',
    referenceUrl: 'https://wiki.teamfortress.com/wiki/Mann_vs._Machine',
    referenceUrls: ['https://wiki.teamfortress.com/wiki/Classes', 'https://wiki.teamfortress.com/wiki/Mann_vs._Machine', 'https://wiki.teamfortress.com/wiki/Robots'],
    heroes: [hero('scout', 'Scout', 'Lean young adult mercenary in red T-shirt, headset, dog tags and baseball cap, carrying a scattergun.', 'Scattergun', 'Bonk Flank', { role: 'slayer' }), hero('soldier', 'Soldier', 'Broad helmeted mercenary in red military coat with rocket launcher and grenades.', 'Rocket Launcher', 'Banner Charge', { role: 'marine' }), hero('medic', 'Medic', 'Tall doctor in white coat, red gloves and mechanical healing backpack, carrying Medi Gun.', 'Syringe Gun', 'ÜberCharge', { role: 'tactical' })],
    enemies: [threat('robot_scout', 'Robot Scout', 'Slim blue-eyed steel Scout replica with cap and scattergun.', 'Robot Scattergun', 'Bomb Sprint'), threat('robot_soldier', 'Robot Soldier', 'Blue-eyed steel Soldier replica with helmet and rocket launcher.', 'Robot Rockets', 'Bomb Advance'), threat('robot_heavy', 'Robot Heavy', 'Massive blue-eyed steel Heavy replica with rotary minigun.', 'Robot Minigun', 'Sustained Fire')],
    bosses: [threat('sentry_buster', 'Sentry Buster', 'Round bomb-bodied blue robot with long legs and spinning warning light.', 'Detonation', 'Engineer Pursuit'), threat('giant_demoman', 'Giant Demoman Robot', 'Oversized blue-eyed Demoman machine with grenade launcher and heavy armor.', 'Grenade Barrage', 'Giant Bomb Carry'), threat('tank_robot', 'Tank Robot', 'Huge tracked gray bomb carrier with glowing blue hatch and no crew.', 'Crushing Treads', 'Hatch Bomb')],
    worldBoss: threat('sergeant_crits', 'Sergeant Crits', 'Colossal steel Soldier robot with Tyrant helmet, yellow eyes and oversized rocket launcher.', 'Critical Rocket Storm', 'Regenerating Barrage'),
    gear: [gear('scattergun', 'Scattergun', 'Short lever-action scattergun with wooden grip.', { atk: 4, def: 0, spd: 2 }), gear('medi_gun', 'Medi Gun', 'White-red healing projector linked to a compact hose.', { atk: 0, def: 5, spd: 1 }), gear('canteen', 'Power Up Canteen', 'Small metal field canteen with blue energy cap.', { atk: 2, def: 3, spd: 1 })],
    stages: [stage('Mannworks Bomb Route', 'Desert factory yard with painted blue bomb arrows and RED hatch.'), stage('Rottenburg Gate', 'Old European village defenses, timber buildings and robot path.'), stage('Bigrock Final Wave', 'Rocky industrial canyon containing the final robot drop zone.')],
    event: event('machine_wave', 'Mann vs. Machine Final Wave', 'A blue robot carrier opens over a RED Mann Co. bomb route.')
  },
  {
    key: 'natural_selection_2', universe: 'Natural Selection 2', aliases: ['NS2', 'Natural Selection II'],
    continuity: 'Unknown Worlds’ Frontiersmen versus Kharaa strategic multiplayer conflict.',
    adaptationRule: 'Maintain asymmetric FPS/RTS roles: named slots are battlefield classes rather than invented individuals.',
    visualAnchor: 'Dark industrial space facilities split between blue marine technology and orange organic infestation.',
    referenceUrl: 'https://www.krafton.com/en/games/natural-selection-2/', referenceUrls: ['https://www.krafton.com/en/games/natural-selection-2/', 'https://store.steampowered.com/app/4920/Natural_Selection_2/'],
    heroes: [hero('marine', 'Frontiersman Marine', 'Helmeted blue-gray space marine with rifle, shoulder lamp and compact armor.', 'Assault Rifle', 'Cluster Grenade', { role: 'marine' }), hero('jetpack_marine', 'Jetpack Marine', 'Light-armored marine suspended by a twin-thruster jetpack and carrying a shotgun.', 'Shotgun', 'Jetpack Strafe', { role: 'slayer' }), hero('exosuit', 'Exosuit Marine', 'Bulky bipedal blue-gray exoskeleton with enclosed cockpit and twin heavy guns.', 'Exosuit Miniguns', 'Armor Lock', { role: 'marine' })],
    enemies: [threat('skulk', 'Skulk', 'Low black-orange Kharaa quadruped with wide jaws and wall-clinging feet.', 'Bite', 'Wall Leap'), threat('gorge', 'Gorge', 'Stocky orange-brown builder lifeform with broad mouth and short legs.', 'Acid Spit', 'Hydra Construction'), threat('lerk', 'Lerk', 'Small pterosaur-like Kharaa with leathery wings and pointed head.', 'Spike Volley', 'Umbra Cloud')],
    bosses: [threat('fade', 'Fade', 'Tall black-and-orange Kharaa with long scythe forearms and narrow torso.', 'Scythe Slash', 'Blink Ambush'), threat('onos', 'Onos', 'Huge armored rhinoceros-like Kharaa with tusks and massive forelimbs.', 'Gore', 'Stomp'), threat('alien_commander', 'Kharaa Commander Assault', 'Organic hive command nexus projecting infestation tendrils and ability spores.', 'Hive Abilities', 'Lifeform Evolution')],
    worldBoss: threat('mature_hive', 'Mature Hive', 'Enormous pulsing orange hive rooted into walls by infestation and egg clusters.', 'Defensive Spawn', 'Infestation Overrun'),
    gear: [gear('pulse_grenade', 'Pulse Grenade', 'Blue cylindrical marine grenade with orange arming strip.', { atk: 3, def: 0, spd: 2 }), gear('welder', 'Marine Welder', 'Compact industrial repair torch with blue handle.', { atk: 1, def: 5, spd: 0 }), gear('onos_bone_shield', 'Onos Bone Plate', 'Heavy curved orange-black armor plate shed by an Onos.', { atk: 1, def: 5, spd: 0 })],
    stages: [stage('Tram Marine Start', 'Blue-lit command station, resource nozzle and branching metal corridors.'), stage('Ventilation Infestation', 'Narrow vents overtaken by glowing orange Kharaa tissue.'), stage('Hive Room', 'Vast organic chamber with eggs, cyst chains and central hive.')],
    event: event('resource_war', 'Resource Tower War', 'Marine extractors and Kharaa harvesters contest the same glowing resource nodes.')
  },
  {
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
  },
  {
    key: 'unreal_tournament_2004', universe: 'Unreal Tournament 2004', aliases: ['UT2004', 'UT2K4', 'Unreal Tournament 2k4'],
    continuity: 'Epic Games Unreal Tournament 2004 Liandri Grand Tournament, distinct from Unreal Tournament 1999.',
    adaptationRule: 'Use UT2004 team biographies, armor families, weapons and arenas; do not merge UT99 models or the unfinished 2014 game.',
    visualAnchor: 'Bright 2004 sci-fi tournament arenas, chunky team armor, Liandri robots, Skaarj competitors and energy weapons.',
    referenceUrl: 'https://www.epicgames.com/unrealtournament/?lang=en-US', referenceUrls: ['https://www.epicgames.com/unrealtournament/?lang=en-US', 'https://unrealarchive.org/wikis/the-liandri-archives/Unreal_Tournament_2004.html'],
    heroes: [hero('gorge', 'Gorge', 'Massive bald Juggernaut champion in bulky red-and-silver tournament armor.', 'Flak Cannon', 'Juggernaut Charge', { role: 'marine' }), hero('sapphire', 'Sapphire', 'Adult woman Juggernaut in full blue-silver heavy armor with covered torso and limbs.', 'Shock Rifle', 'Shock Combo', { role: 'tactical' }), hero('frostbite', 'Frostbite', 'Masked Juggernaut in complete white-blue tournament armor with broad shoulder plates.', 'Rocket Launcher', 'Adrenaline Burst', { role: 'marine' })],
    enemies: [threat('skaarj_warrior', 'Skaarj Warrior', 'Muscular reptilian alien tournament fighter with plated limbs and twin wrist blades.', 'Razik Blades', 'Predator Leap'), threat('gen_mokai', 'Gen Mo’Kai Fighter', 'Lean horned alien athlete in orange-black segmented arena armor.', 'Link Gun', 'Wall Dodge'), threat('necris', 'Necris Combatant', 'Pale adult arena warrior in fully closed black nanoblack armor with blue markings.', 'Lightning Gun', 'Adrenaline Invisibility')],
    bosses: [threat('damarus', 'Damarus', 'Tall Gen Mo’Kai team leader with crown-like horns and gold-black armor.', 'Shock Rifle', 'Team Assault'), threat('clanlord', 'ClanLord', 'Huge Skaarj champion in red-black armor with imposing horns and wrist blades.', 'Blade Rush', 'Skaarj Roar'), threat('xan', 'Xan Kriegor', 'Tall gold-and-black Liandri combat android with narrow glowing faceplate.', 'Minigun', 'Liandri Overcharge')],
    worldBoss: threat('malcolm', 'Malcolm — Tournament Champion', 'Veteran Black adult champion in complete blue-white Thunder Crash armor, with original face not based on an actor.', 'Rocket Launcher', 'Champion Adrenaline', { prohibitedConcepts: ['actor likeness'] }),
    gear: [gear('shock_rifle', 'Shock Rifle', 'Long blue-gray energy rifle with glowing cyan emitter.', { atk: 4, def: 0, spd: 1 }), gear('redeemer', 'Redeemer', 'Large dark missile launcher with yellow hazard accents and no logo.', { atk: 6, def: 0, spd: 0 }), gear('double_damage', 'Double Damage Core', 'Floating purple energy amp in a compact mechanical frame.', { atk: 5, def: 0, spd: 1 })],
    stages: [stage('DM-Rankin', 'Rust-red industrial arena with ramps, brick halls and glowing pickups.'), stage('ONS-Torlan', 'Open green battlefield with linked power nodes and distant towers.'), stage('AS-Mothership', 'Skaarj mothership assault route from space approach to reactor core.')],
    event: event('grand_tournament', 'Liandri Grand Tournament', 'Arena brackets converge across Deathmatch, Onslaught and Assault battlegrounds without logos or UI.')
  },
  {
    key: 'angels_fall_first', universe: 'Angels Fall First', aliases: ['AFF', 'Angel Fall First'],
    continuity: 'Strangely Interactive’s ULA-versus-AIA combined-arms war in Angels Fall First.',
    adaptationRule: 'Because the game uses player soldiers rather than named leads, the roster represents canonical ULA roles and AIA military platforms, never invented celebrities.',
    visualAnchor: 'Ground infantry, tracked armor, angular mechs, dropships and boardable capital ships across blue-gray future battlefields.',
    referenceUrl: 'https://store.steampowered.com/app/367270/Angels_Fall_First/', referenceUrls: ['https://store.steampowered.com/app/367270/Angels_Fall_First/'],
    heroes: [hero('ula_rifleman', 'ULA Rifleman', 'Fully helmeted United League infantry in blue-gray armor carrying a modular rifle.', 'ULA Rifle', 'Squad Grenade', { role: 'marine' }), hero('ula_pilot', 'ULA Pilot', 'Fully suited United League pilot with sealed visor and compact flight harness.', 'Pilot Sidearm', 'Sturm Gunship Run', { role: 'tactical' }), hero('ula_commander', 'ULA Fleet Commander', 'Adult commander in full navy field uniform and enclosed combat vest, carrying a command tablet.', 'Command Sidearm', 'Fleet Targeting', { role: 'tactical' })],
    enemies: [threat('aia_trooper', 'AIA Shock Trooper', 'Fully helmeted Antarean infantry in angular tan-black armor with battle rifle.', 'AIA Battle Rifle', 'Shock Advance'), threat('gheist', 'AIA Gheist Mech', 'Tall angular Antarean combat walker with paired arm weapons and dark cockpit.', 'Twin Cannons', 'Jump Jet Strike'), threat('interceptor', 'AIA Interceptor', 'Sharp-winged Antarean fighter with swept engines and paired nose guns.', 'Nose Cannons', 'High-Speed Pass')],
    bosses: [threat('dhaka', 'AIA Dhaka Tank', 'Broad Antarean main battle tank with low turret and heavy frontal armor.', 'Tank Cannon', 'Smoke Advance'), threat('destroyer', 'AIA Destroyer', 'Long angular capital escort covered in turrets and bright engine banks.', 'Turret Broadside', 'Fighter Screen'), threat('battleship', 'AIA Battleship', 'Enormous boardable warship with hangars, subsystems and armored command bridge.', 'Heavy Broadside', 'Boarding Counterattack')],
    worldBoss: threat('flagship', 'AIA Flagship Siege', 'Fleet-scale Antarean flagship surrounded by escorts, breach points and subsystem targets.', 'Flagship Batteries', 'Full Fleet Muster'),
    gear: [gear('ula_rifle', 'ULA Modular Rifle', 'Blue-gray future rifle with modular barrel and optic.', { atk: 4, def: 0, spd: 1 }), gear('breach_pod', 'Boarding Breach Pod', 'Compact armored pod with drilling nose and ULA-blue lights.', { atk: 2, def: 4, spd: 0 }), gear('vehicle_repair_tool', 'Vehicle Repair Tool', 'Handheld industrial welder with blue casing and orange sparks.', { atk: 0, def: 5, spd: 1 })],
    stages: [stage('Ground Incursion', 'Fortified valley objectives crossed by infantry, tanks and gunships.'), stage('Space Territories', 'Capital ships and fighter lanes around a fractured moon.'), stage('Flagship Boarding', 'Dropship breach leading through corridors to bridge and reactor subsystems.')],
    event: event('combined_arms', 'Combined-Arms Offensive', 'Ground objectives and orbital fleets align into one continuous operation.')
  },
  {
    key: 'counter_strike', universe: 'Counter-Strike', aliases: ['Counter Strike', 'Counter-Strike 2', 'CS2'],
    continuity: 'Valve Counter-Strike competitive defusal identity, using Counter-Strike 2 presentation and classic faction archetypes.',
    adaptationRule: 'No supervillains are invented: enemies and bosses are opposing training teams or objective scenarios; civilians and hostages are never targets.',
    visualAnchor: 'Realistic but original tactical operators, bombsites, utility smoke and clean Source 2 material language without logos or esports branding.',
    referenceUrl: 'https://www.counter-strike.net/home?l=english', referenceUrls: ['https://www.counter-strike.net/home?l=english', 'https://www.valvesoftware.com/en/about/'],
    heroes: [hero('sas', 'SAS Operator', 'Adult counter-terrorist in full navy tactical uniform, gas mask, helmet and body armor; original face concealed.', 'M4A1-S', 'Flashbang Entry', { role: 'tactical' }), hero('gign', 'GIGN Operator', 'Adult counter-terrorist in full blue armor, helmet, balaclava and compact rifle.', 'FAMAS', 'Defuse Cover', { role: 'marine' }), hero('fbi', 'FBI HRT Operator', 'Adult tactical agent in green-gray full-body gear, helmet and protective glasses.', 'M4A4', 'Smoke Retake', { role: 'tactical' })],
    enemies: [threat('phoenix', 'Phoenix Connexion Operator', 'Adult fictional opposing operator in full beige jacket, balaclava and protective gear.', 'AK-47', 'Bombsite Execute'), threat('elite_crew', 'Elite Crew Operator', 'Adult fictional opposing operator in dark jacket, scarf-mask and full trousers.', 'Galil AR', 'Molotov Denial'), threat('separatist', 'Separatist Operator', 'Adult fictional opposing operator in olive full clothing and covered face.', 'SG 553', 'Crossfire Hold')],
    bosses: [threat('awp_bot', 'Expert AWP Bot', 'Training automaton silhouette in neutral armor carrying a long sniper rifle.', 'AWP Hold', 'Angle Reposition'), threat('heavy_assault', 'Heavy Assault Training Unit', 'Armored training opponent with full helmet and reinforced vest.', 'Heavy Rifle', 'Armor Push'), threat('retake_squad', 'Bombsite Retake Squad', 'Three clearly robotic tactical training dummies advancing with smoke and flash utility.', 'Coordinated Rifles', 'Utility Retake')],
    worldBoss: trial('global_elite_final', 'Global Elite Defusal Final', 'Empty tournament bombsite with planted device, smoke lanes and a visible defuse route.', 'Defuse the planted device after clearing a timed tactical route.'),
    gear: [gear('defuse_kit', 'Defuse Kit', 'Small blue tactical tool pouch and wire cutters without labels.', { atk: 0, def: 3, spd: 3 }), gear('flashbang', 'Flashbang', 'Compact gray cylindrical diversion grenade.', { atk: 1, def: 1, spd: 4 }), gear('kevlar', 'Kevlar Vest', 'Plain dark tactical vest with no insignia.', { atk: 0, def: 5, spd: 0 })],
    stages: [stage('Dust II Bombsite A', 'Sunlit stone bombsite with crates, ramp and long approach, rebuilt without map signage.'), stage('Inferno Retake', 'Mediterranean courtyard and narrow lanes filled with tactical smoke.'), stage('Global Elite Defusal', 'Neutral competitive training arena with device timer and three approach lanes.', { nonCombat: true, objective: 'Reach and defuse the training device before its timer expires.' })],
    event: event('match_point', 'Match Point', 'A final-round defusal route reshuffles utility, cover and approach timing.')
  },
  {
    key: 'beat_banger_safe', universe: 'Beat Banger — Safe Rhythm Studio', aliases: ['Beat Banger', 'BeatBanger Safe'], allNonCombat: true,
    continuity: 'Beat Banger’s rhythm-studio cast reinterpreted exclusively as a safe professional music production workplace.',
    adaptationRule: 'Every person is explicitly 20+ and fully clothed in opaque conservative workwear. No nudity, sex, romance, suggestive pose, fetish framing or adult-industry depiction; gameplay is rhythm and production only.',
    visualAnchor: 'A colorful animal-person music studio with mixing boards, microphones and waveform lights; every adult wears practical full work clothing.',
    referenceUrl: 'https://store.steampowered.com/app/1813430/Beat_Banger/', referenceUrls: ['https://store.steampowered.com/app/1813430/Beat_Banger/'],
    heroes: [hero('cathy', 'Cathy', 'Adult 20+ gray cat person in a fully buttoned teal studio jacket, long trousers and sneakers.', null, 'Perfect Take', { prohibitedConcepts: ['nudity', 'sexualization', 'fetish framing'], objective: 'Complete Cathy’s percussion timing track with perfect beats.' }), hero('zoe', 'Zoe', 'Adult 20+ purple bird person in a high-collar orange sweater, long trousers and closed shoes.', null, 'Harmony Track', { prohibitedConcepts: ['nudity', 'sexualization', 'fetish framing'], objective: 'Synchronize Zoe’s harmony cues across the studio timeline.' }), hero('elaine', 'Elaine Claire', 'Adult 20+ brown rabbit person and studio director in a closed white shirt, navy blazer and full-length trousers.', null, 'Production Approval', { prohibitedConcepts: ['nudity', 'sexualization', 'fetish framing'], objective: 'Organize the safe studio production schedule before the deadline.' })],
    enemies: [trial('missed_beat', 'Missed Beat Pattern', 'Red rhythm blocks drifting out of alignment on an abstract studio floor.', 'Correct every off-beat input in sequence.'), trial('broken_mixer', 'Broken Mixer Channel', 'Physical mixing console with three dark channels and loose patch cables, no UI text.', 'Reconnect the three signal paths by matching cable colors.'), trial('deadline', 'Studio Deadline Clock', 'Large analog wall clock above stacked recording reels and task lights.', 'Finish the recording checklist before the hand reaches midnight.')],
    bosses: [trial('audition', 'Studio Audition', 'Empty spotlighted recording booth with microphone and four rhythmic floor pads.', 'Complete the audition chart without missing a cue.'), trial('live_mix', 'Live Mix Session', 'Mixing desk whose faders and colored lamps form a timing puzzle.', 'Balance all channels during the live arrangement.'), trial('showcase', 'Final Showcase', 'Safe concert stage with instruments, lights and an empty audience area.', 'Perform the final rhythm medley with full timing accuracy.')],
    worldBoss: trial('master_session', 'Master Rhythm Session', 'Whole studio transformed into linked percussion, melody and mixing stations.', 'Clear all three music-production stations in one uninterrupted master session.'),
    gear: [gear('studio_headphones', 'Studio Headphones', 'Large padded teal headphones with coiled cable.', { atk: 0, def: 2, spd: 3 }), gear('mixing_fader', 'Mixing Fader', 'Silver console fader isolated on a blue channel strip without text.', { atk: 0, def: 3, spd: 2 }), gear('metronome', 'Metronome', 'Classic wooden metronome with visible pendulum.', { atk: 0, def: 2, spd: 4 })],
    stages: [stage('Percussion Booth', 'Soundproof studio booth with drums and four glowing timing pads.'), stage('Mixing Room', 'Colorful professional mixing desk, speakers and acoustic panels.'), stage('Safe Final Showcase', 'Bright all-ages music stage with instruments and geometric lights.')],
    event: event('studio_marathon', 'Studio Rhythm Marathon', 'Three recording rooms connect into one long cooperative timing course.')
  },
  {
    key: 'doom_sweeper_safe', universe: 'Doom Sweeper — Safe Apocalypse', aliases: ['Doom Sweeper', '末日清理专家'],
    continuity: 'Paper Dog’s Doom Sweeper zombie-survival journey, stripped of all sexual material.',
    adaptationRule: 'Yamato and Roche are explicitly adults 20+ in fully opaque practical apocalypse clothing. No nudity, sexuality, pin-up framing or suggestive upgrades; only survival, scavenging and zombie containment.',
    visualAnchor: 'Bright 2D apocalypse roads, a battered second-hand military vehicle, airdrops and dense cartoon zombie swarms.',
    referenceUrl: 'https://store.steampowered.com/app/2162680/Doom_Sweeper/', referenceUrls: ['https://store.steampowered.com/app/2162680/Doom_Sweeper/'],
    heroes: [hero('yamato', 'Yamato', 'Adult 20+ woman in a fully closed green field jacket, cargo trousers, boots and protective gloves.', 'Service Rifle', 'Sweeper Barrage', { role: 'marine', prohibitedConcepts: ['nudity', 'sexualization', 'revealing clothing'] }), hero('roche', 'Roche', 'Adult 20+ man in a fully buttoned orange mechanic jacket, work trousers, boots and goggles.', 'Repair Wrench', 'Vehicle Overdrive', { role: 'tactical', prohibitedConcepts: ['nudity', 'sexualization'] }), hero('armored_van', 'Doom Sweeper Armored Van', 'Boxy second-hand olive military vehicle with welded plates, roof gun and cargo racks.', 'Roof Turret', 'Airdrop Beacon', { role: 'marine' })],
    enemies: [threat('walker', 'Zombie Walker', 'Cartoon undead adult in torn but non-graphic city clothing with slow gait.', 'Clumsy Swipe', 'Crowd Press'), threat('runner', 'Zombie Runner', 'Lean cartoon undead adult in damaged sportswear, with no gore.', 'Sprint Lunge', 'Flanking Rush'), threat('mutant_swarm', 'Mutant Insect Swarm', 'Cloud of oversized post-apocalyptic beetles with glowing green shells.', 'Swarm Bite', 'Screen Spread')],
    bosses: [threat('siege_brute', 'Siege Brute', 'Huge armored zombie silhouette behind welded road signs, without wounds or gore.', 'Barrier Slam', 'Debris Throw'), threat('armored_mutant', 'Armored Mutant', 'Broad nonsexual mutant in scavenged military plates and sealed helmet.', 'Armor Charge', 'Shockwave'), threat('horde_commander', 'Horde Commander', 'Tall signal-bearing mutant directing zombie lanes with a warning beacon.', 'Command Strike', 'Horde Muster')],
    worldBoss: threat('apocalypse_titan', 'Apocalypse Titan', 'Colossal fully armored mutant looming behind a ruined overpass and vehicle convoy.', 'Titan Stomp', 'Apocalypse Horde'),
    gear: [gear('sample_case', 'Zombie Sample Case', 'Sealed green scientific case with biohazard shape but no text.', { atk: 1, def: 4, spd: 0 }), gear('airdrop_radio', 'Airdrop Radio', 'Rugged orange field radio with folding antenna.', { atk: 2, def: 1, spd: 3 }), gear('vehicle_plate', 'Vehicle Armor Plate', 'Welded olive steel plate with bolt holes.', { atk: 0, def: 5, spd: 0 })],
    stages: [stage('Ruined Highway Sweep', 'Broken highway, abandoned cars and clean cartoon zombie lanes.'), stage('Airdrop Defence', 'Open roadside extraction circle around a descending military crate.'), stage('Titan Overpass', 'Collapsed overpass where the armored van circles a giant silhouette.')],
    event: event('twenty_minutes', 'Twenty-Minute Sweep', 'A visible sunset arc marks a timed salvage-and-survival route without suggestive material.')
  },
  {
    key: 'stellar_dream_safe', universe: 'Stellar Dream — Safe Colony Mission', aliases: ['Stellar Dream', 'Stellar Dream Part 1'], allNonCombat: true,
    continuity: 'Stellar Dream Part 1 colony-ship, missing-scout and first-contact premise, adapted as a safe diplomatic science mission.',
    adaptationRule: 'All people are adults 20+ and fully clothed in opaque conservative expedition uniforms. Remove every sexual, romantic, pregnancy or fetish element; gameplay is rescue, research, diplomacy and containment only.',
    visualAnchor: 'A hopeful colony ship, cryo chambers, alien planets and survey equipment in blue-white science-fiction palettes.',
    referenceUrl: 'https://steamcommunity.com/app/3087180', referenceUrls: ['https://steamcommunity.com/app/3087180'],
    heroes: [hero('captain', 'Colony Captain', 'Adult 20+ commander in a fully closed navy expedition jacket, trousers and boots.', null, 'Rescue Coordination', { prohibitedConcepts: ['nudity', 'sexualization', 'romance'], objective: 'Coordinate the search for the missing scouting parties.' }), hero('maria', 'Maria', 'Adult 20+ engineer in a fully zipped blue-white technical coverall with gloves and toolkit.', null, 'Cryo Repair', { prohibitedConcepts: ['nudity', 'sexualization', 'romance'], objective: 'Restore the cryo-chamber life-support grid.' }), hero('ronda', 'Ronda', 'Adult 20+ xenodiplomat in a high-collar green expedition uniform with scanner and translator.', null, 'First Contact', { prohibitedConcepts: ['nudity', 'sexualization', 'romance'], objective: 'Complete a peaceful first-contact translation sequence.' })],
    enemies: [trial('hazardous_flora', 'Hazardous Flora Field', 'Tall luminous alien plants blocking a survey route with drifting spores.', 'Map a safe route between the spore cycles.'), trial('sentinel_drone', 'Alien Sentinel Drone Scan', 'Non-humanoid floating alien probe casting harmless search cones.', 'Avoid its scan cones and transmit a peaceful identification code.'), trial('unstable_ruins', 'Unstable Alien Ruins', 'Ancient stone arches, shifting tiles and green energy seams.', 'Stabilize all ruin anchors before entering the archive.')],
    bosses: [trial('hope_storm', 'Hope-1 Ion Storm', 'Colony shuttle flying through layered violet lightning and navigation gates.', 'Guide Hope-1 through every safe corridor.'), trial('ruin_guardian', 'Arongs Ruin Guardian Protocol', 'Dormant geometric guardian construct surrounded by three translation plinths.', 'Solve its symbolic language rather than attack it.'), trial('cryo_failure', 'Cryo-System Failure', 'Frosted cryo chamber with failing coolant pipes and three power relays.', 'Repair all relays before the temperature threshold is crossed.')],
    worldBoss: trial('life_support', 'Colony Ship Life-Support Crisis', 'Vast ship core with oxygen gardens, coolant conduits and synchronized control stations.', 'Restore oxygen, coolant and navigation systems without combat.'),
    gear: [gear('survey_scanner', 'Planetary Survey Scanner', 'White-blue handheld scanner with green sensor dish.', { atk: 0, def: 2, spd: 4 }), gear('translator', 'Alien Translator', 'Round green-gold translation device with geometric lights and no text.', { atk: 0, def: 3, spd: 2 }), gear('cryo_tool', 'Cryo Repair Tool', 'Insulated silver wrench-tool with blue coolant cartridge.', { atk: 0, def: 5, spd: 1 })],
    stages: [stage('Hope-1 Survey Route', 'Bright alien valley crossed by scan markers and a parked shuttle.'), stage('Arongs First Contact', 'Peaceful circular plaza with alien delegates represented at respectful distance.'), stage('Colony Ship Crisis', 'Blue-white engineering deck linked to cryogenic and life-support rooms.')],
    event: event('lost_scouts', 'Lost Scouts Rescue', 'Three scout beacons blink across separate planets while the colony ship waits in orbit.')
  },
  {
    key: 'absolver_downfall', universe: 'Absolver: Downfall', aliases: ['Absolver Downfall', 'Absolver'],
    continuity: 'Sloclap’s Absolver base journey and free Downfall expansion in the Mines of Adal.',
    adaptationRule: 'Masked Prospects use learnable martial styles; Downfall enemies are Arcell-corrupted combatants, not ordinary inhabitants.',
    visualAnchor: 'Muted stone ruins, ochre cloth, smooth masks, martial stances and pale Gleam crystals in Adal.',
    referenceUrl: 'https://absolvergame.com/news/absolver-downfall', referenceUrls: ['https://absolvergame.com/news/absolver-downfall'],
    heroes: [hero('windfall', 'Windfall Prospect', 'Masked martial artist in layered ochre cloth and light leather, hands raised to evade.', 'Windfall Strikes', 'Avoid Counter', { role: 'slayer' }), hero('khalt', 'Kahlt Prospect', 'Broad masked fighter in dark layered cloth with grounded absorbing stance.', 'Kahlt Blows', 'Absorb Counter', { role: 'marine' }), hero('forsaken', 'Forsaken Prospect', 'Masked fighter in blue-gray wraps with precise defensive posture.', 'Forsaken Combo', 'Parry Counter', { role: 'tactical' })],
    enemies: [threat('corrupted_prospect', 'Arcell-Corrupted Prospect', 'Masked fighter with pale Gleam veins across otherwise practical robes.', 'Corrupted Combo', 'Gleam Burst'), threat('fold_guardian', 'Fold Guardian', 'Heavy masked temple defender in layered stone-colored armor.', 'Guard Break', 'Temple Stance'), threat('gleam_echo', 'Gleam Echo', 'Abstract humanoid martial afterimage made of white-blue crystal light.', 'Echo Strike', 'Mirrored Sequence')],
    bosses: [threat('kuretz', 'Kuretz', 'Masked arena champion with muscular bare arms, heavy belt and disciplined combat pose.', 'Boxing Combination', 'Arena Pressure'), threat('cargal_kilnor', 'Cargal & Kilnor', 'Two masked martial masters, one tall and one broad, in contrasting layered robes.', 'Twin Combination', 'Alternating Stances'), threat('dormek', 'Dormek', 'Towering masked Downfall guardian in heavy pale armor with powerful kicking stance.', 'Heavy Kick', 'Gleam Shockwave')],
    worldBoss: threat('arcell', 'Arcell', 'Tall Etheran figure framed by white Gleam crystals and the broken Fold containment.', 'Etheran Strikes', 'Fold Rupture'),
    gear: [gear('prospect_mask', 'Prospect Mask', 'Smooth ivory martial mask with narrow eye slits.', { atk: 0, def: 4, spd: 2 }), gear('gleam_shard', 'Gleam Shard', 'Angular white-blue crystal emitting pale mist.', { atk: 3, def: 2, spd: 1 }), gear('combat_deck', 'Combat Deck', 'Stack of abstract stance cards without readable writing.', { atk: 2, def: 2, spd: 3 })],
    stages: [stage('Guidance Bridge', 'Weathered stone bridge linking Adal ruins under warm haze.'), stage('Mines of Adal', 'Dark mine passages lit by pale Gleam growths and masked patrols.'), stage('Fold Temple', 'Circular stone sanctuary broken by an Etheran crystal rupture.')],
    event: event('downfall_run', 'Downfall Gleam Run', 'A procedural path branches through mines and temples toward three escalating encounters.')
  },
  {
    key: 'agony_2018', universe: 'Agony', aliases: ['Agony 2018', 'Agony game'],
    continuity: 'Madmind Studio’s 2018 infernal survival-horror continuity, represented through its censored horror and escape premise.',
    adaptationRule: 'Expurgated presentation only: all figures fully covered by armor, cloth, shadow or non-anatomical carapace; no nudity, sexuality, genital imagery, sexualized demons, graphic gore or victim exploitation.',
    visualAnchor: 'Surreal red-black infernal caverns, bone-like architecture, smoke, sigils and fully covered demonic silhouettes.',
    referenceUrl: 'https://store.steampowered.com/app/487720/Agony/', referenceUrls: ['https://store.steampowered.com/app/487720/Agony/'],
    heroes: [hero('nimrod_soul', 'Nimrod’s Soul', 'Faceless human soul fully wrapped in dark red pilgrim cloth and hood.', 'Soul Push', 'Vessel Possession', { role: 'horror', prohibitedConcepts: ['nudity', 'gore', 'sexualization'] }), hero('martyr_vessel', 'Martyr Vessel', 'Adult human vessel fully covered by torn layered robes, hood, gloves and boots.', 'Torch', 'Soul Escape', { role: 'tactical', prohibitedConcepts: ['nudity', 'gore', 'victim exploitation'] }), hero('demon_vessel', 'Armored Demon Vessel', 'Nonsexual horned demon fully enclosed in black-red chitin armor with no exposed anatomy.', 'Claw Strike', 'Gate Break', { role: 'slayer', prohibitedConcepts: ['nudity', 'sexual anatomy', 'gore'] })],
    enemies: [threat('chort', 'Armored Chort', 'Stocky horned demon fully covered in cracked basalt-like plates.', 'Claw Swipe', 'Tunnel Charge', { prohibitedConcepts: ['nudity', 'sexualization', 'gore'] }), threat('onoskelis', 'Expurgated Onoskelis', 'Plant-headed demon redesigned in complete thorned carapace armor with no exposed human anatomy.', 'Thorn Claws', 'Sound Hunt', { prohibitedConcepts: ['nudity', 'sexual anatomy', 'sexualization'] }), threat('winged_demon', 'Winged Demon', 'Fully armored non-humanoid bat-like demon with broad black wings.', 'Dive Claw', 'Ash Gust', { prohibitedConcepts: ['nudity', 'gore'] })],
    bosses: [threat('baphomet', 'Expurgated Baphomet', 'Four-armed goat-headed colossus fully encased in ceremonial basalt armor and cloth.', 'Four-Arm Sweep', 'Statue Ambush', { prohibitedConcepts: ['nudity', 'sexual anatomy', 'gore'] }), threat('giant_chort', 'Giant Chort', 'Huge horned demon whose entire body is covered in rocky armor and shadow.', 'Cavern Slam', 'Boulder Charge'), threat('beast', 'The Beast', 'Colossal quadrupedal infernal silhouette with plated spine and ember eyes.', 'Beast Charge', 'Infernal Roar')],
    worldBoss: threat('red_goddess', 'The Red Goddess — Expurgated', 'Regal adult infernal ruler in a fully opaque floor-length crimson mantle, horned crown and covered armor.', 'Crimson Sigil', 'Hell Dominion', { prohibitedConcepts: ['nudity', 'sexualization', 'actor likeness'] }),
    gear: [gear('torch', 'Infernal Torch', 'Black iron torch with controlled red-orange flame.', { atk: 1, def: 2, spd: 3 }), gear('sigil_stone', 'Sigil Stone', 'Dark tablet carved with an original glowing geometric seal.', { atk: 2, def: 4, spd: 0 }), gear('soul_mirror', 'Soul Mirror', 'Cracked obsidian hand mirror emitting pale smoke.', { atk: 3, def: 2, spd: 1 })],
    stages: [stage('Floating Forest', 'Red-black suspended roots, smoke and narrow stone paths with no bodies or gore.'), stage('Fractal Forest', 'Repeating basalt arches and ember-lit navigation sigils.'), stage('Red Goddess Tower', 'Tall crimson-black citadel of covered statues and geometric seals.')],
    event: event('escape_hell', 'Escape from Hell', 'A chain of soul gates opens through caverns while demonic patrols close alternate routes.')
  },
  {
    key: 'atomic_heart', universe: 'Atomic Heart', aliases: ['AtomicHeart'],
    continuity: 'Atomic Heart base-game Facility 3826 uprising and its Soviet retrofuturist robot ecology.',
    adaptationRule: 'Keep P-3, CHAR-les, Facility robots and boss machines; avoid political symbols, sexual framing of the Twins and actor likenesses.',
    visualAnchor: 'Polished white-red retrofuturist robots, polymer, monumental research halls and overgrown Facility 3826 fields.',
    referenceUrl: 'https://press.kochmedia.com/nl/Files/Download?Enc=0F6ABF6ED5D7EA961742E3B05B11299D&File=%2Fblob%2FPlaionGames%2F2023%2F03%2F031202-4bfd590f%2FEN-Factsheet.pdf&FileGuid=ceb5e118-6898-48fb-9e37-ba9e30f68a31&direct=False', referenceUrls: ['https://press.kochmedia.com/nl/Files/Download?Enc=0F6ABF6ED5D7EA961742E3B05B11299D&File=%2Fblob%2FPlaionGames%2F2023%2F03%2F031202-4bfd590f%2FEN-Factsheet.pdf&FileGuid=ceb5e118-6898-48fb-9e37-ba9e30f68a31&direct=False'],
    heroes: [hero('p3', 'Major Sergey “P-3” Nechaev', 'Adult agent in dark leather field jacket, glove-polymer tendrils and compact axe; original face.', 'Zvezdochka Axe', 'CHAR-les Polymer Shock', { role: 'slayer', prohibitedConcepts: ['actor likeness'] }), hero('granny_zina', 'Granny Zina', 'Older adult woman in practical red-brown field clothes with boots and a compact weapon case; original face.', 'Field Rifle', 'Baba Zina Support', { role: 'tactical', prohibitedConcepts: ['actor likeness'] }), hero('tereshkova', 'Tereshkova', 'Slim white service robot with rounded faceplate, red accents and articulated hands.', null, 'Facility Guidance', { role: 'trial', nonCombat: true, objective: 'Restore a damaged Tereshkova service network.' })],
    enemies: [threat('lab_tech', 'Lab-Tech Robot', 'White humanoid maintenance robot with mustache-like face panel and red joints.', 'Tool Swing', 'Repair Call'), threat('vova', 'VOV-A Robot', 'White mustached humanoid combat robot with black limbs and red star-free chest panel.', 'Robot Punch', 'Grab Rush'), threat('pchela', 'Pchela Drone', 'Small white flying repair drone with red rotors and tool arms.', 'Repair Laser', 'Drone Swarm')],
    bosses: [threat('hedgie', 'Hedgie', 'Huge red-white spherical robot unfolding into spikes and mechanical legs.', 'Rolling Crush', 'Ground Eruption'), threat('belyash', 'Belyash', 'Large white-red ape-like construction robot with powerful arms and round head.', 'Ground Slam', 'Flame Charge'), threat('natasha', 'Natasha', 'Towering round-bodied white ballerina-inspired industrial robot, mechanical and nonsexual.', 'Ballistic Spin', 'Missile Salvo', { prohibitedConcepts: ['sexualization'] })],
    worldBoss: threat('twins', 'The Twins', 'Two fully mechanical polished silver bodyguard robots with crown-like cable heads and completely opaque seamless shells, posed tactically.', 'Polymer Blades', 'Synchronized Assault', { prohibitedConcepts: ['sexualization', 'nudity', 'fetish pose'] }),
    gear: [gear('charles_glove', 'CHAR-les Glove', 'Dark red-black polymer glove with compact tendril emitters.', { atk: 3, def: 2, spd: 2 }), gear('zvezdochka', 'Zvezdochka', 'Industrial red shaft weapon with two toothed mechanical heads.', { atk: 5, def: 1, spd: 0 }), gear('neuromodule', 'Neuromodule', 'Small turquoise neural capsule inside a silver ring.', { atk: 2, def: 3, spd: 2 })],
    stages: [stage('VDNH Exhibition', 'Grand pale exhibition hall with plants, sculptures and service robots.'), stage('Theatre Stage', 'Red-gold mechanical theatre with rotating platforms and robot props.'), stage('Sechenov Complex', 'Minimal white laboratory towers joined by glass walkways and polymer conduits.')],
    event: event('collective_failure', 'Kollektiv Failure', 'Facility 3826 maintenance networks turn red as repair drones reactivate machines across the route.')
  },
  {
    key: 'bioshock_rapture', universe: 'BioShock', aliases: ['Bioshock', 'BioShock 1'],
    continuity: 'BioShock 2007 in Rapture, from Jack’s arrival through the confrontation with Frank Fontaine.',
    adaptationRule: 'Preserve Art Deco Rapture, plasmids and protectors. Little Sisters are rescue-only noncombatants and never targets, enemies, bosses or damageable props; no actor likeness or graphic body horror.',
    visualAnchor: 'Flooded Art Deco halls, brass bathyspheres, teal seawater, neon signs without copied text, plasmid energy and diving-suit protectors.',
    referenceUrl: 'https://store.steampowered.com/app/7670/BioShock/', referenceUrls: ['https://store.steampowered.com/app/7670/BioShock/', 'https://cdn.akamai.steamstatic.com/steam/apps/8850/manuals/BIOSHOCK%202%20G4W%20MANUAL%20ENG.pdf?t=1568765660'],
    heroes: [hero('jack', 'Jack', 'Adult man in practical sweater and trousers, holding wrench and plasmid-lit hand; face kept generic.', 'Wrench', 'Electro Bolt', { role: 'slayer', prohibitedConcepts: ['actor likeness'] }), hero('tenenbaum', 'Brigid Tenenbaum', 'Adult scientist in conservative dark 1960s suit and lab coat, carrying a rescue plasmid case.', null, 'Little Sister Rescue', { role: 'trial', nonCombat: true, objective: 'Safely escort rescued Little Sisters to a protected vent.', prohibitedConcepts: ['actor likeness', 'child target'] }), hero('bouncer', 'Bouncer Big Daddy', 'Huge rusted brass diving suit with round glowing portholes and conical drill arm.', 'Drill', 'Protector Charge', { role: 'marine' })],
    enemies: [threat('thuggish_splicer', 'Thuggish Splicer', 'Adult masked Rapture aggressor in damaged 1950s clothing, no gore or actor likeness.', 'Lead Pipe', 'Plasmid Rush'), threat('leadhead_splicer', 'Leadhead Splicer', 'Adult masked Rapture gunman in worn suit and full clothing.', 'Pistol', 'Cover Fire'), threat('houdini_splicer', 'Houdini Splicer', 'Adult fully clothed masked splicer surrounded by orange plasmid distortion.', 'Fireball', 'Teleport Ambush')],
    bosses: [threat('steinman', 'Dr. Steinman', 'Adult surgeon in stained but non-graphic medical coat, surgical mask and lamp.', 'Pistol', 'Medical Pavilion Ambush'), threat('peach', 'Peach Wilkins', 'Adult smuggler in winter coat, gas mask and grenade bandolier.', 'Grenades', 'Freezer Trap'), threat('cohen', 'Sander Cohen', 'Adult artist in formal black tailcoat and white rabbit mask, no actor likeness.', 'Crossbow', 'Fort Frolic Tableau')],
    worldBoss: threat('fontaine', 'ADAM-Enhanced Frank Fontaine', 'Massive adult final antagonist with stone-like plasmid musculature, fully covered waist and non-graphic glowing veins.', 'Elemental Strike', 'ADAM Overload', { prohibitedConcepts: ['nudity', 'gore', 'actor likeness'] }),
    gear: [gear('wrench', 'Jack’s Wrench', 'Heavy steel pipe wrench with red handle.', { atk: 4, def: 1, spd: 1 }), gear('eve_hypo', 'EVE Hypo', 'Sealed blue glass syringe canister with brass cap, isolated as a prop.', { atk: 3, def: 2, spd: 2 }), gear('research_camera', 'Research Camera', 'Boxy brass-and-black 1950s camera with round flash.', { atk: 0, def: 2, spd: 4 })],
    stages: [stage('Welcome to Rapture', 'Bathysphere dock opening into flooded brass-and-marble Art Deco corridors.'), stage('Fort Frolic', 'Theatrical Art Deco mall with masks, curtains and frozen tableau silhouettes.'), stage('Point Prometheus', 'Industrial genetic laboratory with Big Daddy conversion machinery and glass tunnels.')],
    event: event('rapture_blackout', 'Rapture Blackout', 'Floodwater rises while emergency lights and bathysphere routes fail across the city.')
  },
  {
    key: 'bendy_ink_machine', universe: 'Bendy and the Ink Machine', aliases: ['Bendy', 'BATIM'],
    continuity: 'Joey Drew Studios’ Bendy and the Ink Machine five-chapter Cycle starring Henry Stein.',
    adaptationRule: 'Retain sepia rubber-hose cartoon shapes and ink horror with no copied key art, logos, actor likeness or graphic gore.',
    visualAnchor: 'Sepia animation-studio corridors, black ink pools, hand-painted props and warped 1930s cartoon machinery.',
    referenceUrl: 'https://www.joeydrewstudios.com/batim', referenceUrls: ['https://www.joeydrewstudios.com/batim', 'https://www.joeydrewstudios.com/joeydrewstudios'],
    heroes: [hero('henry', 'Henry Stein', 'Adult former animator in simple 1960s shirt, vest and trousers, carrying an axe; original face.', 'Axe', 'Animator’s Resolve', { role: 'horror', prohibitedConcepts: ['actor likeness'] }), hero('boris', 'Boris the Wolf', 'Tall black-and-white rubber-hose cartoon wolf in overalls with long ears and rounded gloves.', 'Gent Pipe', 'Safehouse Support', { role: 'tactical' }), hero('allison', 'Allison Angel', 'Adult ink heroine in fully opaque black-white adventure clothes with halo-like hair shape and sword.', 'Sword', 'Angel Guard', { role: 'slayer' })],
    enemies: [threat('searcher', 'Searcher', 'Low humanoid ink blob with glossy black body and simple white face marks.', 'Ink Swipe', 'Pool Emerge'), threat('piper', 'The Piper', 'Distorted cartoon figure with projector-like pipe weapon and white mask face.', 'Pipe Swing', 'Butcher Rush'), threat('projectionist', 'The Projectionist', 'Tall ink-covered humanoid with film projector for a head and bright lens.', 'Projector Strike', 'Light Pursuit')],
    bosses: [threat('sammy', 'Sammy Lawrence', 'Adult masked cultist fully clothed in ink-black overalls, suspenders and Bendy mask.', 'Axe', 'Ink Searcher Call'), threat('bertrum', 'Bertrum Piedmont', 'Huge rotating carnival ride face made of sepia machinery and mechanical arms.', 'Ride Arm Sweep', 'Carousel Spin'), threat('brute_boris', 'Brute Boris', 'Oversized distorted Boris form with broad shoulders and ink-dark overalls, no gore.', 'Brute Slam', 'Arena Charge')],
    worldBoss: threat('beast_bendy', 'Beast Bendy', 'Gigantic horned ink demon with elongated rubber-hose limbs and glossy black silhouette.', 'Ink Claw', 'Cycle Rampage'),
    gear: [gear('gent_pipe', 'Gent Pipe', 'Short dark metal pipe with wrapped grip.', { atk: 3, def: 2, spd: 1 }), gear('audio_log', 'Studio Audio Log', 'Sepia reel-to-reel recorder without readable labels.', { atk: 0, def: 2, spd: 4 }), gear('the_end_reel', 'The End Film Reel', 'Small black film reel in a sepia metal can, no text visible.', { atk: 3, def: 3, spd: 1 })],
    stages: [stage('Old Workshop', 'Sepia drawing desks, wooden corridors and the inactive Ink Machine.'), stage('Heavenly Toys', 'Toy-production floor with conveyor belts, cutouts and ink pipes.'), stage('The Ink Machine', 'Vast black machinery chamber crossed by film reels and rising ink.')],
    event: event('cycle_restart', 'The Cycle Restarts', 'A film reel rewinds while the sepia studio rebuilds its corridors around Henry.')
  }
]);
