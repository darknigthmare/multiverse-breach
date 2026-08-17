import { freezeCanonRosterPart } from './canonRosterPackFactory.js';

const partI = [
  {
    key: 'fear', universe: 'F.E.A.R.', aliases: ['FEAR', 'F.E.A.R. First Encounter Assault Recon'],
    continuity: 'F.E.A.R. (2005), the original Monolith continuity',
    adaptationRule: 'Use the first game only. Alma is represented as a psychic environmental event: her child appearance is never a fighter, target or injured subject. Reduce gore and preserve the industrial paranormal tone.',
    visualAnchor: 'Cold Armacham offices, concrete service tunnels, orange industrial light, black tactical armor and blue-white psychic distortions.',
    referenceUrl: 'https://store.steampowered.com/app/21090/FEAR/',
    referenceUrls: ['https://store.steampowered.com/app/21090/FEAR/'],
    colors: ['#27313a', '#08090b', '#e36e32'], motif: 'reflex', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
    heroes: [
      { id: 'point_man', name: 'Point Man', role: 'marine', weapon: 'RPL Sub-Machinegun', weaponType: 'gun', special: 'Reflex Time', visualAnchor: 'Anonymous F.E.A.R. operative in dark gray tactical armor, compact SMG and deliberately unseen face.' },
      { id: 'jin_sun_kwon', name: 'Jin Sun-Kwon', nonCombat: true, objective: 'Read psychic residue and relay the safe route through Armacham.', visualAnchor: 'F.E.A.R. technical officer in gray field jacket with medical-psychic scanner and original non-actor face.' },
      { id: 'douglas_holiday', name: 'Douglas Holiday', role: 'tactical', weapon: 'G2A2 assault rifle', weaponType: 'gun', visualAnchor: 'Delta Force sergeant in olive-black tactical kit, helmet, goggles and rifle; original face.' }
    ],
    enemies: [
      { id: 'replica_soldier', name: 'Replica Soldier', weapon: 'G2A2 rifle', special: 'Coordinated flank', visualAnchor: 'Masked clone infantry in black segmented armor with red optics and compact rifle.' },
      { id: 'atc_assassin', name: 'ATC Assassin', weapon: 'Claw strike', special: 'Optical camouflage', visualAnchor: 'Lean black-armored ATC infiltrator with translucent camouflage shimmer and clawed gloves.' },
      { id: 'heavy_armor', name: 'Heavy Armor', weapon: 'Heavy cannon', special: 'Armored advance', visualAnchor: 'Broad Replica heavy unit in bulky gray-black powered armor with enclosed helmet and rotary cannon.' }
    ],
    bosses: [
      { id: 'paxton_fettel', name: 'Paxton Fettel', weapon: 'Psychic command', special: 'Replica synchronization', visualAnchor: 'Pale psychic commander in dark suit and long coat, surrounded by red-black signal echoes; original face.' },
      { id: 'rev6_power_armor', name: 'REV6 Power Armor', weapon: 'Twin cannons', special: 'Powered stomp', visualAnchor: 'Tall enclosed gray military exoskeleton with squared cockpit, twin arm cannons and orange warning lights.' },
      { id: 'atc_heavy_mech', name: 'ATC Heavy Mech', weapon: 'Rocket pods', special: 'Facility lockdown', visualAnchor: 'Blocky ATC combat mech in dirty white-gray plating, red sensors and shoulder rocket racks.' }
    ],
    worldBoss: { id: 'alma_psychic_event', name: 'Alma’s Psychic Event', nonCombat: true, objective: 'Seal the psychic breach and escape the collapsing Origin facility without targeting Alma.', visualAnchor: 'A corridor-scale red psychic wave, floating debris and adult shadow silhouette far beyond the route; no child body, injury or target reticle.' },
    gear: ['RPL Sub-Machinegun', 'Type-7 Particle Weapon', 'Reflex Booster'],
    stages: [
      { name: 'Armacham Technology Corporation', visualAnchor: 'Abandoned corporate floors opening into industrial laboratories and Replica ambush routes.' },
      { name: 'Interval 07 — Urban Decay', visualAnchor: 'Ruined city blocks, subway works and orange utility lamps.' },
      { name: 'Origin Facility Evacuation', nonCombat: true, objective: 'Reach the blast-safe route while sealing psychic relays.', visualAnchor: 'Underground vault collapsing beneath a red-white psychic shockwave.' }
    ],
    event: { id: 'first_encounter', name: 'First Encounter', frName: 'Premier contact', visualAnchor: 'F.E.A.R. squad lights crossing a psychic distortion inside Armacham.' }
  },
  {
    key: 'finding_frankie', universe: 'Finding Frankie', aliases: [], allNonCombat: true,
    continuity: 'Finding Frankie (2024) parkour-horror game',
    adaptationRule: 'Every encounter is a chase, timing gate or parkour Trial. No mascot or contestant is attacked, and blades/crushers are shown as readable course hazards without injury.',
    visualAnchor: 'Bright but abandoned mascot game-show arenas, padded parkour blocks, blue-red signage shapes without readable logos, analog security lights.',
    referenceUrl: 'https://store.steampowered.com/app/2597970/Finding_Frankie/', colors: ['#315f86', '#0a1018', '#f05b59'], motif: 'parkour', mode: 'Trial', difficulty: 'Hard',
    heroes: [
      { id: 'lucky_contestant', name: 'Lucky Contestant', visualAnchor: 'Anonymous adult contestant in blue athletic jumpsuit, knee pads, gloves and blank face visor.' },
      { id: 'deputy_duck', name: 'Deputy Duck', visualAnchor: 'Friendly yellow duck mascot with small blue deputy hat, rounded beak and padded cartoon proportions.' },
      { id: 'noob_noob', name: 'Noob Noob', visualAnchor: 'Small friendly game-show mascot with blue body, simple round eyes and padded gloves.' }
    ],
    enemies: ['Saw Track', 'Crushing Wall', 'Security Obstacle'],
    bosses: [
      { id: 'henry_hotline_chase', name: 'Henry Hotline Chase', visualAnchor: 'Red telephone mascot silhouette pursuing across elevated foam platforms; route states, no attack.' },
      { id: 'frankie_chase', name: 'Frankie Chase', visualAnchor: 'Large blue rabbit mascot silhouette advancing through a neon parkour corridor; escape states only.' },
      { id: 'final_parkour_protocol', name: 'Final Parkour Protocol', visualAnchor: 'Four-stage timed obstacle assembly of conveyors, vault blocks and closing gates.' }
    ],
    worldBoss: { id: 'game_show_core', name: 'Frankie’s Game Show Core', visualAnchor: 'Central broadcast machinery and course-control lights progressing from locked to safely shut down.' },
    gear: ['Double-Jump Trainers', 'Wall-Run Gloves', 'Contestant Wristband'],
    stages: ['Frankie’s Parkour Palace', 'Henry Hotline Course', 'Final Broadcast Escape'],
    event: { id: 'showtime', name: 'Showtime Escape', frName: 'Évasion en direct' }
  },
  {
    key: 'freddi_fish', universe: 'Freddi Fish', aliases: ['Freddi Fish franchise'], allNonCombat: true,
    continuity: 'Humongous Entertainment Freddi Fish adventure series',
    adaptationRule: 'Dialogue, clues, collection and environmental puzzles only. Rivals and suspects are never hit or framed as combat enemies.',
    visualAnchor: 'Cheerful hand-painted underwater coves, bright coral, soft bubbles and readable cartoon silhouettes recreated as original fan art.',
    referenceUrl: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/283940/manuals/freddifish1-manual.pdf?t=1578016205', colors: ['#167fa3', '#062c45', '#ffd35a'], motif: 'clue', mode: 'Trial', difficulty: 'Easy',
    heroes: [
      { id: 'freddi', name: 'Freddi Fish', visualAnchor: 'Small golden-yellow fish with blue fins, long eyelashes and curious friendly expression.' },
      { id: 'luther', name: 'Luther', visualAnchor: 'Small bright-green fish with yellow fins, round eyes and playful expression.' },
      { id: 'cousin_calico', name: 'Cousin Calico', visualAnchor: 'Friendly orange-yellow older fish with purple accessories and calm guide posture.' }
    ],
    enemies: ['Kelp Maze', 'Bubble Current', 'Jellyfish Gate'],
    bosses: ['Boss & Spongehead Clue Confrontation', 'Royal Crown Maze', 'Haunted School Puzzle'],
    worldBoss: { id: 'squidfather_case', name: 'Squidfather Case Finale', visualAnchor: 'A clue board of shells, kelp routes and a friendly squid-shaped shadow resolving into the recovered object.' },
    gear: ['Purple Sea Urchin Notebook', 'Message Bottle', 'Treasure Map'],
    stages: ['Grandma Grouper’s Kelp Seeds', 'Case of the Haunted Schoolhouse', 'Creatures of Coral Cove Park'],
    event: { id: 'missing_conch', name: 'The Missing Conch Clue', frName: 'L’indice de la conque disparue' }
  },
  {
    key: 'gtfo', universe: 'GTFO', aliases: [],
    continuity: 'GTFO Rundown continuity and the Complex',
    adaptationRule: 'Use the four-prisoner tactical survival language and official creature silhouettes. Depict tension, biosecurity and extraction without gore.',
    visualAnchor: 'Pitch-dark underground research sectors, yellow work lights, red scan circles, industrial doors, biofoam and sealed prisoner gear.',
    referenceUrl: 'https://gtfothegame.com/prisoners', referenceUrls: ['https://gtfothegame.com/prisoners', 'https://gtfo.wiki.gg/wiki/Enemies'], colors: ['#3b433f', '#090b0c', '#e2a648'], motif: 'rundown', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
    heroes: [
      { id: 'woods', name: 'Woods', role: 'marine', weapon: 'Assault rifle', weaponType: 'gun', visualAnchor: 'Adult prisoner in yellow-gray expedition layers, respirator at neck, rifle and original non-actor face.' },
      { id: 'dauda', name: 'Dauda', role: 'tactical', weapon: 'Burst rifle', weaponType: 'gun', visualAnchor: 'Adult prisoner in layered dark utility kit, headlamp, backpack and burst rifle; original face.' },
      { id: 'hackett', name: 'Hackett', role: 'hacker', weapon: 'Bio Tracker', weaponType: 'focus', visualAnchor: 'Adult prisoner in heavy utility vest with glowing bio-tracker screen and compact firearm; original face.' }
    ],
    enemies: ['Striker', 'Shooter', 'Scout'], bosses: ['Mother', 'Tank', 'Big Mother'],
    worldBoss: { id: 'kraken', name: 'Kraken', visualAnchor: 'Colossal pale creature silhouette spanning a flooded underground chamber, sealed anatomy and no gore.' },
    gear: ['Bio Tracker', 'C-Foam Launcher', 'Mine Deployer'],
    stages: ['The Complex — Security Scan', 'Rundown Reactor Startup', 'Prisoner Extraction'],
    event: { id: 'warden_order', name: 'Warden Order', frName: 'Ordre du Gardien' }
  },
  {
    key: 'hawken', universe: 'HAWKEN', aliases: ['Hawken'],
    continuity: 'Original HAWKEN multiplayer game on Illal, not later unrelated projects',
    adaptationRule: 'The original game has pilots and chassis classes rather than a named hero trio; use representative pilot roles and canonical mech classes without inventing personal lore.',
    visualAnchor: 'Dusty Illal megacity ruins, rust-orange industrial towers, blue holographic systems and compact angular walking mechs.',
    referenceUrl: 'https://www.playhawken.com/game-guide', referenceUrls: ['https://www.playhawken.com/game-guide', 'https://blog.playstation.com/2016/06/27/hawken-launches-july-8-on-ps4/'], colors: ['#5c4937', '#111516', '#48b9de'], motif: 'mech', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
    heroes: [
      { id: 'crt_recruit', name: 'CR-T Recruit', role: 'marine', weapon: 'Assault rifle arm', visualAnchor: 'Compact CR-T biped mech in worn gray-orange plates, rectangular cockpit and rifle arm.' },
      { id: 'assault_pilot', name: 'Assault Pilot', role: 'tactical', weapon: 'Assault chassis autocannon', visualAnchor: 'Anonymous fully helmeted adult pilot presented beside a balanced gray-blue Assault mech.' },
      { id: 'technician_pilot', name: 'Technician Pilot', role: 'hacker', weapon: 'Helix Repair Torch', weaponType: 'focus', visualAnchor: 'Anonymous fully helmeted adult support pilot beside a slim yellow-gray Technician mech with repair beam.' }
    ],
    enemies: ['Prosk Rival Axe', 'Sentium Rival Axe', 'Siege Drone'], bosses: ['Bruiser', 'Rocketeer', 'Incinerator'],
    worldBoss: { id: 'siege_battleship', name: 'Siege Battleship', visualAnchor: 'Massive hovering angular carrier above Illal rooftops with shield nodes and no faction logo.' },
    gear: ['Repair Charge', 'Hologram Decoy', 'EMP Device'], stages: ['Bazaar — Team Assault', 'Last Eco — Missile Defense', 'Siege Battleship Route'],
    event: { id: 'illal_siege', name: 'Illal Siege', frName: 'Siège d’Illal' }
  },
  {
    key: 'haydee_safe', universe: 'Haydee — Safe Adaptation', aliases: ['Haydee'],
    continuity: 'Haydee (2016) artificial complex',
    adaptationRule: 'Preserve the white synthetic helmet and color-zone puzzle identity while redesigning every body as a fully covered, nonsexualized utility android. No fetish framing, exposed anatomy or sexual pose.',
    visualAnchor: 'Sterile white-black industrial rooms, colored access zones, grid vents, security robots and fully covered synthetic exploration suits.',
    referenceUrl: 'https://store.steampowered.com/app/530890/Haydee/', colors: ['#d9e0e5', '#11161b', '#d44a4a'], motif: 'access-card', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
    heroes: [
      { id: 'green_loadout', name: 'Haydee — Green-Zone Loadout', role: 'tactical', weapon: 'Service pistol', weaponType: 'gun', visualAnchor: 'Fully covered white-gray utility android suit, smooth opaque helmet, green access lights and compact pistol.' },
      { id: 'red_loadout', name: 'Haydee — Red-Zone Loadout', role: 'marine', weapon: 'Magnum', weaponType: 'gun', visualAnchor: 'Fully covered reinforced white-black utility android suit, opaque helmet and red access lights.' },
      { id: 'blue_loadout', name: 'Haydee — Blue-Zone Loadout', role: 'hacker', weapon: 'Remote mine tool', visualAnchor: 'Fully covered slim white-gray technical android suit, opaque helmet and blue access lights.' }
    ],
    enemies: ['Slasher', 'Walker', 'Automated Trap Grid'],
    bosses: [
      { id: 'red_zone_pursuit', name: 'Red Zone Pursuit', nonCombat: true, visualAnchor: 'Timed red-door route with moving security beams and closing shutters.' },
      { id: 'black_zone_ambush', name: 'Black Zone Ambush', nonCombat: true, visualAnchor: 'Dark ventilation route with sensor lights and safe cover markers.' },
      { id: 'blue_zone_exit', name: 'Blue Zone Exit Protocol', nonCombat: true, visualAnchor: 'Blue-card circuitry and four exit-lock states from sealed to open.' }
    ],
    worldBoss: { id: 'complex_core', name: 'Artificial Complex Core', nonCombat: true, visualAnchor: 'White industrial control core with red, green and blue access circuits resolving into an open exit.' },
    gear: ['Green Keycard', 'Night Visor', 'Remote Mine'], stages: ['Green Zone Access', 'Red-Black Security Route', 'Blue Zone Exit'],
    event: { id: 'access_reset', name: 'Access Reset', frName: 'Réinitialisation des accès' }
  },
  {
    key: 'hellblade', universe: 'Hellblade: Senua’s Sacrifice', aliases: ['Hellblade'],
    continuity: 'Hellblade: Senua’s Sacrifice (2017)',
    adaptationRule: 'Treat psychosis respectfully as Senua’s lived perception, not as villainy. Druth and Dillion are memory/guidance Trials, never fighters. Use mythic silhouettes without actor likeness.',
    visualAnchor: 'Storm-dark Norse shores, charred wood, carved runes, blue mist, torch orange and Senua’s braided warrior silhouette with original face.',
    referenceUrl: 'https://ninjatheory.com/games/', referenceUrls: ['https://ninjatheory.com/games/', 'https://blog.playstation.com/2017/06/06/hellblade-senuas-sacrifice-from-ninja-theory-launches-august-8-on-ps4/'], colors: ['#263741', '#090b0c', '#dc743b'], motif: 'rune', faction: 'horror', mode: 'RPG', difficulty: 'Hard',
    heroes: [
      { id: 'senua', name: 'Senua', role: 'slayer', weapon: 'Forged sword', visualAnchor: 'Pict warrior with dark braided hair, blue-black face paint, fur-and-leather layers, short sword and original non-actor face.' },
      { id: 'druth', name: 'Druth', nonCombat: true, objective: 'Reveal the Northmen lore stones and guide Senua through the fire route.', visualAnchor: 'Warm ember memory silhouette in tattered traveler layers, original face, no weapon.' },
      { id: 'dillion', name: 'Dillion', nonCombat: true, objective: 'Complete the memory alignment that opens the final bridge.', visualAnchor: 'Calm blue memory silhouette in simple Pict clothing, original face, no weapon.' }
    ],
    enemies: ['Northman Raider', 'Shield Northman', 'Dark Rot Manifestation'], bosses: ['Surtr', 'Valravn', 'Garm'],
    worldBoss: { id: 'hela', name: 'Hela', visualAnchor: 'Towering half-shadowed Norse death figure with antlerlike crown, black robes and blue mist; original face.' },
    gear: ['Senua’s Sword', 'Druth Lorestone', 'Mirror Focus'], stages: ['Shipwreck Shore', 'Valravn’s Illusion Maze', 'Bridge to Helheim'],
    event: { id: 'furies_alignment', name: 'Furies Alignment', frName: 'Alignement des voix' }
  },
  {
    key: 'hello_neighbor', universe: 'Hello Neighbor', aliases: ['Hello Neighbor franchise'], allNonCombat: true,
    continuity: 'Hello Neighbor stealth-game continuity centered on Nicky Roth and the Peterson house',
    adaptationRule: 'Children solve stealth and fear Trials and are never attacked or represented as combatants. Mr. Peterson’s pursuit remains escape gameplay; no child injury.',
    visualAnchor: 'Tilted suburban house architecture, exaggerated red-yellow-blue props, surveillance devices, long shadows and toy-like stealth routes.',
    referenceUrl: 'https://www.helloneighborgame.com/home-en', referenceUrls: ['https://www.helloneighborgame.com/home-en', 'https://www.helloneighborgame.com/hn-mediakit'], colors: ['#4c6d84', '#17202a', '#e6b24e'], motif: 'keyhole', mode: 'Trial', difficulty: 'Hard',
    heroes: [
      { id: 'nicky_roth', name: 'Nicky Roth', visualAnchor: 'Fully clothed child stealth protagonist in blue cap, red shirt and backpack; safe cartoon proportions.' },
      { id: 'aaron_peterson', name: 'Aaron Peterson', visualAnchor: 'Fully clothed child in striped shirt and shorts, shown navigating toward safety, never injured.' },
      { id: 'quentin', name: 'Quentin', visualAnchor: 'Young adult investigative journalist in green jacket, messenger bag and original cartoon face.' }
    ],
    enemies: ['Security Camera', 'Bear Trap Route', 'Adaptive AI Pursuit'], bosses: ['Fear School', 'Fear Darkness', 'Fear Supermarket'],
    worldBoss: { id: 'shadow_man', name: 'The Thing / Shadow Man', visualAnchor: 'Huge abstract black shadow beyond a child-safe escape route, represented as fear geometry rather than a target.' },
    gear: ['Basement Key', 'Magnet Gun', 'Security Camera Monitor'], stages: ['Peterson House Infiltration', 'Fear Rooms', 'Basement Escape'],
    event: { id: 'house_rebuild', name: 'Adaptive House Rebuild', frName: 'Maison adaptative' }
  },
  {
    key: 'hitman_woa', universe: 'HITMAN — World of Assassination', aliases: ['Hitman'],
    continuity: 'IO Interactive World of Assassination trilogy',
    adaptationRule: 'Use original game-character silhouettes without actor likeness. Civilians are never enemies; harming a civilian fails the mission. Diana’s content is analysis and coordination.',
    visualAnchor: 'Elegant modern infiltration spaces, red-gray ICA equipment, tailored disguises, clean sightlines and environmental puzzle staging.',
    referenceUrl: 'https://ioi.dk/hitman-codename-47', colors: ['#34383d', '#0a0b0d', '#d34747'], motif: 'barcode', faction: 'stealth', mode: 'Tactics', difficulty: 'Expert',
    heroes: [
      { id: 'agent_47', name: 'Agent 47', role: 'tactical', weapon: 'ICA19 pistol', weaponType: 'gun', visualAnchor: 'Bald fictional assassin in black suit, white shirt, red tie and black gloves; stylized original face, no actor likeness.' },
      { id: 'diana_burnwood', name: 'Diana Burnwood', nonCombat: true, objective: 'Analyze intel, identify the valid route and keep civilians out of danger.', visualAnchor: 'Professional handler in dark tailored jacket with tablet and earpiece; original non-actor face.' },
      { id: 'lucas_grey', name: 'Lucas Grey', role: 'tactical', weapon: 'Suppressed rifle', weaponType: 'gun', visualAnchor: 'Fictional former operative in practical gray coat with suppressed rifle and original face.' }
    ],
    enemies: ['Providence Commando', 'ICA Assassination Agent', 'Syndicate Enforcer'], bosses: ['Erich Soders', 'The Maelstrom', 'Don Yates'],
    worldBoss: { id: 'arthur_edwards', name: 'Arthur Edwards — The Constant', nonCombat: true, objective: 'Expose Providence, secure the train route and force the Constant’s capture without harming bystanders.', visualAnchor: 'Tailored mastermind silhouette inside a sealed luxury train carriage with evidence nodes and original face.' },
    gear: ['ICA19 Silverballer', 'Fiber Wire', 'Lockpick'], stages: ['Paris Fashion Infiltration', 'Hokkaido Surgical Protocol', 'Carpathian Train'],
    event: { id: 'mission_story', name: 'Mission Story Opportunity', frName: 'Opportunité de mission' }
  },
  {
    key: 'splinter_cell', universe: 'Tom Clancy’s Splinter Cell', aliases: ['Splinter Cell'],
    continuity: 'Main Splinter Cell game continuity through Blacklist',
    adaptationRule: 'Use stealth, gadgets and light/shadow language. Grim’s role is non-combat intelligence; civilians and hostages are failure-state protected subjects. No actor likeness.',
    visualAnchor: 'Near-black infiltration spaces, green tri-lens goggles, blue security light, fiber-optic cameras and restrained tactical silhouettes.',
    referenceUrl: 'https://www.ubisoft.com/en-us/company/about-us/our-brands/tom-clancy-s-splinter-cell', colors: ['#1e3029', '#050807', '#5ee48f'], motif: 'tri-goggles', faction: 'stealth', mode: 'Tactics', difficulty: 'Expert',
    heroes: [
      { id: 'sam_fisher', name: 'Sam Fisher', role: 'tactical', weapon: 'SC pistol', weaponType: 'gun', visualAnchor: 'Veteran covert operative in black tactical suit with three green goggle lenses, compact pistol and original non-actor face.' },
      { id: 'anna_grim', name: 'Anna “Grim” Grímsdóttir', nonCombat: true, objective: 'Decrypt the intelligence feed and route the team around civilian zones.', visualAnchor: 'Operations specialist in dark professional fieldwear with green-lit tablet and original face.' },
      { id: 'isaac_briggs', name: 'Isaac Briggs', role: 'tactical', weapon: 'SC4000 carbine', weaponType: 'gun', visualAnchor: 'Fourth Echelon operative in black-gray body armor, green optic and compact carbine; original face.' }
    ],
    enemies: ['Mercenary Rifleman', 'Blacklist Engineer', 'Displace Operative'], bosses: ['Kombayn Nikoladze', 'Douglas Shetland', 'Emile Dufraisne'],
    worldBoss: { id: 'majid_sadiq', name: 'Majid Sadiq', visualAnchor: 'Fictional Blacklist leader in dark tactical coat within a green-lit Site F corridor; original face.' },
    gear: ['Tri-Rotor Drone', 'Sticky Camera', 'SC-20K'], stages: ['Georgian Defense Ministry', 'Bathhouse Shadows', 'Site F Blacklist Finale'],
    event: { id: 'lights_out', name: 'Lights Out', frName: 'Extinction des lumières' }
  },
  {
    key: 'super_meat_boy', universe: 'Super Meat Boy', aliases: [], allNonCombat: true,
    continuity: 'Super Meat Boy (2010)',
    adaptationRule: 'Every threat is a platforming, chase or switch Trial. Cartoon hazards may reset the course but no injury, gore or combat target is depicted.',
    visualAnchor: 'Bold flat-color platform rooms, dark factory blocks, saw routes and tiny expressive cartoon silhouettes recreated as original fan art.',
    referenceUrl: 'https://www.team-meat.com/', colors: ['#9f2525', '#151112', '#f3d8b7'], motif: 'bandage', mode: 'Trial', difficulty: 'Expert',
    heroes: [
      { id: 'meat_boy', name: 'Meat Boy', visualAnchor: 'Tiny square red cartoon hero with simple eyes and smile, clean stylized surface without anatomical detail.' },
      { id: 'bandage_girl', name: 'Bandage Girl', visualAnchor: 'Tiny square pink cartoon hero with white bandage patch and simple friendly face.' },
      { id: 'brownie', name: 'Brownie', visualAnchor: 'Tiny square brown cartoon runner with clean geometric body and simple face.' }
    ],
    enemies: ['Dust Bunny Route', 'Fly Swarm Route', 'Oob Platform'], bosses: ['Lil Slugger Chase', 'C.H.A.D. Escape', 'Larries Lament Race'],
    worldBoss: { id: 'dr_fetus_finale', name: 'Dr. Fetus Finale', visualAnchor: 'Tiny suited jar-helmet villain operating a giant switchboard while the player routes toward the shutdown button.' },
    gear: ['Bandage Patch', 'Warp Zone Key', 'Commander Video Cartridge'], stages: ['The Forest', 'The Hospital', 'The End Escape'],
    event: { id: 'warp_zone', name: 'Warp Zone', frName: 'Zone de distorsion' }
  },
  {
    key: 'bit_trip', universe: 'BIT.TRIP', aliases: ['BIT.TRIP series'], allNonCombat: true,
    continuity: 'CommanderVideo BIT.TRIP series continuity',
    adaptationRule: 'Translate every confrontation into rhythm, deflection, running or dodge Trials. Preserve the abstract pixel grammar and never invent a combat arsenal.',
    visualAnchor: 'Black voids, rainbow pixel trails, crisp white beats, retro rectangular avatars and synchronized geometric machinery.',
    referenceUrl: 'https://www.rerunner.game/presskit', colors: ['#111111', '#020202', '#f3e84f'], motif: 'beat', mode: 'Trial', difficulty: 'Expert',
    heroes: [
      { id: 'commander_video', name: 'CommanderVideo', visualAnchor: 'Small black rectangular pixel runner with white square eye and horizontal rainbow trail.' },
      { id: 'commandgirl_video', name: 'CommandGirlVideo', visualAnchor: 'Small dark rectangular pixel runner with white eye, distinct bright accent pixels and rainbow trail.' },
      { id: 'radbot', name: 'Radbot', visualAnchor: 'Compact friendly retro robot made of dark square pixels with a bright central face panel.' }
    ],
    enemies: ['Hostile Beats', 'Timbletot Gear', 'Void Orb'], bosses: ['Timbletot Flying Machine', 'Lava Rig', 'Timbletot Mech'],
    worldBoss: { id: 'mingrawn_timbletot', name: 'Mingrawn Timbletot', visualAnchor: 'Large retro geometric antagonist machine made of black-white blocks and rainbow-reactive nodes.' },
    gear: ['BIT.TRIP Paddle', 'Rainbow Cape', 'Gold Bar'], stages: ['BIT.TRIP BEAT Grid', 'RUNNER Rhythm Road', 'FATE Final Pattern'],
    event: { id: 'perfect_chain', name: 'Perfect Rhythm Chain', frName: 'Chaîne rythmique parfaite' }
  }
];

export const CANON_ROSTER_WAVE_PART_I = freezeCanonRosterPart(partI);
