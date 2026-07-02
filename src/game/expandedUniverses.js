const EXPANDED_STAGE_START_ID = 39;

const modeReward = {
  RPG: { gold: 125, shards: 38 },
  Tactics: { gold: 135, shards: 40 },
  Smash: { gold: 120, shards: 36 }
};

const difficultyScale = {
  Medium: 0,
  Hard: 1,
  'Very Hard': 2,
  Expert: 3
};

export const EXPANDED_UNIVERSES = [
  {
    universe: 'Discworld',
    mediaType: 'manga',
    faction: 'arcane',
    stageName: 'Ankh-Morpork Octarine Breach',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Dungeon Dimensions Breach',
    title: { en: 'Discworld', fr: 'Discworld' },
    desc: {
      en: 'A flat world of absurd magic, city politics, witches, wizards, and reality leaks riding through the multiverse.',
      fr: 'Un Disque-monde de magie absurde, politique urbaine, sorcieres, mages et fuites de realite dans le multivers.'
    },
    hero: { id: 'rincewind_dw', name: 'Rincewind', cat: 'hacker', color: '#8e44ad' },
    allies: [
      { id: 'vimes_dw', name: 'Sam Vimes', cat: 'tactical', color: '#59656f' },
      { id: 'granny_dw', name: 'Granny Weatherwax', cat: 'horror', color: '#c9c2aa' }
    ],
    monsters: ['Auditor Shade', 'Watch Golem', 'Luggage Mimic'],
    bosses: ['Sourcery Storm', 'Patrician Gambit'],
    worldBoss: 'Dungeon Dimensions Breach',
    gear: [
      ['disc_luggage', 'Sapient Pearwood Luggage', 'Bagage en poirier savant', { hp: 80, def: 5 }],
      ['disc_octarine', 'Octarine Focus', 'Focaliseur octarine', { atk: 9, spd: 1 }],
      ['disc_watch_badge', 'Watch Badge', 'Plaque du Guet', { def: 7, hp: 45 }]
    ],
    event: ['evt_disc_luggage', 'Luggage Stampede', 'Charge du Bagage', 'The sapient luggage tramples the field for heavy damage.', 'Le Bagage traverse le terrain et pietine les ennemis.'],
    decor: { sky: ['#2d2140', '#07040d'], floor: 'rgba(126, 89, 170, 0.16)', grid: 'rgba(231, 212, 118, 0.28)', motif: 'arcanecity', accent: '#e7d476' }
  },
  {
    universe: 'Joker New 52',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Gotham Endgame Funhouse',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Endgame Joker',
    title: { en: 'Joker New 52', fr: 'Joker New 52' },
    desc: {
      en: 'A cruel Gotham nightmare shaped by the New 52 era: surgical horror, toxin traps, and smiling chaos.',
      fr: 'Un cauchemar de Gotham version New 52 : horreur chirurgicale, toxines et chaos souriant.'
    },
    hero: { id: 'joker_n52', name: 'Joker New 52', cat: 'horror', color: '#7d3c98' },
    allies: [
      { id: 'harley_n52', name: 'Harley Quinn New 52', cat: 'slayer', color: '#e74c3c' },
      { id: 'batman_n52', name: 'Batman New 52', cat: 'tactical', color: '#1b2631' }
    ],
    monsters: ['Jokerized Thug', 'Laughing Gas Drone', 'Carnival Knife Guard'],
    bosses: ['Dollmaker Surgeon', 'Endgame Toxin Host'],
    worldBoss: 'Endgame Joker',
    gear: [
      ['joker_face_mask', 'Stapled Face Mask', 'Masque au visage agrafe', { atk: 10, def: 3 }],
      ['joker_toxin_vial', 'Joker Toxin Vial', 'Fiole de toxine Joker', { spd: 2, atk: 6 }],
      ['joker_carnival_card', 'Carnival Death Card', 'Carte de carnaval mortel', { hp: 45, atk: 7 }]
    ],
    event: ['evt_joker_toxin', 'Endgame Laugh Cloud', 'Nuage de rire Endgame', 'A toxin cloud stuns enemies and cuts their defense.', 'Un nuage de toxine etourdit les ennemis et brise leur defense.'],
    decor: { sky: ['#27142f', '#07020a'], floor: 'rgba(143, 43, 94, 0.18)', grid: 'rgba(76, 220, 94, 0.26)', motif: 'hauntedset', accent: '#4cdc5e' }
  },
  {
    universe: 'The Batman Who Laughs',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Dark Multiverse Gotham',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Darkest Knight Core',
    title: { en: 'The Batman Who Laughs', fr: 'The Batman Who Laughs' },
    desc: {
      en: 'A Dark Multiverse incursion where Batman tactics fuse with Joker cruelty and metal-corrupted nightmares.',
      fr: 'Une intrusion du Multivers Noir ou la strategie de Batman fusionne avec la cruaute du Joker.'
    },
    hero: { id: 'batman_laughs', name: 'Batman Who Laughs', cat: 'horror', color: '#111111' },
    allies: [
      { id: 'grim_knight', name: 'The Grim Knight', cat: 'tactical', color: '#4b4f56' },
      { id: 'red_death', name: 'The Red Death', cat: 'slayer', color: '#8b0000' }
    ],
    monsters: ['Robined Crow', 'Dark Metal Drone', 'Jokerized Bat Guard'],
    bosses: ['The Grim Knight', 'Dark Robin Swarm'],
    worldBoss: 'Darkest Knight Core',
    gear: [
      ['dark_visor', 'Spiked Dark Visor', 'Visiere noire cloutee', { def: 7, atk: 5 }],
      ['robin_chain', 'Dark Robin Chain', 'Chaine de Robin noir', { spd: 2, atk: 7 }],
      ['nth_metal_shard', 'Nth Metal Shard', 'Eclat de Nth Metal', { hp: 70, def: 5 }]
    ],
    event: ['evt_dark_metal', 'Dark Metal Howl', 'Hurlement de metal noir', 'Dark metal shockwaves damage and fear-lock enemies.', 'Des ondes de metal noir blessent et terrorisent les ennemis.'],
    decor: { sky: ['#161616', '#030303'], floor: 'rgba(78, 78, 78, 0.18)', grid: 'rgba(214, 33, 33, 0.32)', motif: 'fortress', accent: '#d62121' }
  },
  {
    universe: 'Kaamelott',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Kaamelott Table Ronde',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Lancelot Noir',
    title: { en: 'Kaamelott', fr: 'Kaamelott' },
    desc: {
      en: 'Arthurian strategy, absurd council debates, Breton legends, and a Grail quest that keeps derailing.',
      fr: 'Strategie arthurienne, conseils absurdes, legendes bretonnes et quete du Graal qui deraille toujours.'
    },
    hero: { id: 'arthur_kaamelott', name: 'Arthur Pendragon', cat: 'tactical', color: '#34495e' },
    allies: [
      { id: 'perceval_kaamelott', name: 'Perceval', cat: 'hacker', color: '#d6b15f' },
      { id: 'karadoc_kaamelott', name: 'Karadoc', cat: 'marine', color: '#8d6e63' }
    ],
    monsters: ['Burgonde Raider', 'Saxon Scout', 'Graal Bureaucrat'],
    bosses: ['Lancelot Noir', 'Meleagant Whisper'],
    worldBoss: 'Graal Rift',
    gear: [
      ['kaamelott_excalibur', 'Excalibur Spark', 'Etincelle d Excalibur', { atk: 10, def: 4 }],
      ['kaamelott_tablet', 'Tactical Wax Tablet', 'Tablette tactique', { def: 6, spd: 1 }],
      ['kaamelott_roti', 'Karadoc Ration', 'Ration de Karadoc', { hp: 90 }]
    ],
    event: ['evt_kaamelott_graal', 'Round Table Order', 'Ordre de la Table Ronde', 'The squad gains defense while enemies are confused by council orders.', 'L escouade gagne de la defense pendant que les ordres du conseil perturbent les ennemis.'],
    decor: { sky: ['#263b32', '#070c08'], floor: 'rgba(137, 111, 62, 0.18)', grid: 'rgba(214, 180, 101, 0.28)', motif: 'castle', accent: '#d6b465' }
  },
  {
    universe: 'Prometheus',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'LV-223 Engineer Temple',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Engineer Juggernaut',
    title: { en: 'Prometheus', fr: 'Prometheus' },
    desc: {
      en: 'A sterile expedition into Engineer ruins, black pathogen chambers, and creation myths turning hostile.',
      fr: 'Une expedition sterile dans les ruines des Ingenieurs, entre pathogene noir et mythes de creation hostiles.'
    },
    hero: { id: 'shaw_prometheus', name: 'Elizabeth Shaw', cat: 'tactical', color: '#c8d6d6' },
    allies: [
      { id: 'david8_prometheus', name: 'David 8', cat: 'hacker', color: '#d6c48c' },
      { id: 'janek_prometheus', name: 'Captain Janek', cat: 'marine', color: '#52616b' }
    ],
    monsters: ['Hammerpede', 'Infected Crewman', 'Black Goo Drone'],
    bosses: ['Fifield Mutation', 'Engineer Pilot'],
    worldBoss: 'Engineer Juggernaut',
    gear: [
      ['prometheus_map_orb', 'Engineer Map Orb', 'Orbe cartographique Ingenieur', { spd: 2, def: 5 }],
      ['black_goo_vial', 'Black Pathogen Vial', 'Fiole de pathogene noir', { atk: 11 }],
      ['prometheus_medpod', 'Automated MedPod', 'MedPod automatise', { hp: 100 }]
    ],
    event: ['evt_prometheus_medpod', 'Emergency MedPod', 'MedPod urgence', 'A surgical pod heals the squad and purges poison effects.', 'Un module chirurgical soigne l escouade et purge les effets toxiques.'],
    decor: { sky: ['#17242a', '#030609'], floor: 'rgba(120, 145, 143, 0.17)', grid: 'rgba(120, 220, 215, 0.24)', motif: 'shipdeck', accent: '#78dcd7' }
  },
  {
    universe: 'Aliens',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Hadleys Hope Last Stand',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Alien Queen',
    title: { en: 'Aliens', fr: 'Aliens' },
    desc: {
      en: 'Colonial Marines, motion trackers, sentry corridors, and the hive war for Hadley s Hope.',
      fr: 'Marines coloniaux, detecteurs de mouvement, couloirs sous tourelles et guerre de ruche a Hadley s Hope.'
    },
    hero: { id: 'hicks_aliens', name: 'Corporal Hicks', cat: 'marine', color: '#6b7767' },
    allies: [
      { id: 'vasquez_aliens', name: 'Vasquez', cat: 'slayer', color: '#8f8f76' },
      { id: 'bishop_aliens', name: 'Bishop', cat: 'hacker', color: '#dfe6e9' }
    ],
    monsters: ['Warrior Xenomorph', 'Facehugger Nest', 'Acid Spitter'],
    bosses: ['Praetorian Guard', 'Power Loader Duel'],
    worldBoss: 'Alien Queen',
    gear: [
      ['aliens_pulse_rifle', 'M41A Pulse Rifle', 'Fusil M41A', { atk: 10, hp: 40 }],
      ['aliens_tracker', 'Motion Tracker', 'Detecteur de mouvement', { spd: 2, def: 4 }],
      ['aliens_sentry', 'UA 571-C Sentry Gun', 'Tourelle sentinelle', { atk: 8, def: 5 }]
    ],
    event: ['evt_aliens_sentries', 'Sentry Corridor', 'Couloir de sentinelles', 'Automated sentries rake the battlefield with pulse fire.', 'Des tourelles automatiques balayent le terrain au tir pulse.'],
    decor: { sky: ['#0b1d24', '#020608'], floor: 'rgba(88, 113, 116, 0.19)', grid: 'rgba(120, 227, 230, 0.25)', motif: 'hive', accent: '#78e3e6' }
  },
  {
    universe: 'Alien 3',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Fiorina 161 Furnace Run',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Runner Alien',
    title: { en: 'Alien 3', fr: 'Alien 3' },
    desc: {
      en: 'A prison foundry without weapons, where survival depends on doors, bait, heat, and sacrifice.',
      fr: 'Une fonderie-prison sans armes, ou la survie depend des portes, des leurres, de la chaleur et du sacrifice.'
    },
    hero: { id: 'ripley_a3', name: 'Ellen Ripley A3', cat: 'horror', color: '#8b6f5a' },
    allies: [
      { id: 'dillon_a3', name: 'Dillon', cat: 'marine', color: '#6a4f3f' },
      { id: 'morse_a3', name: 'Morse', cat: 'tactical', color: '#7d7d68' }
    ],
    monsters: ['Prisoner Host', 'Vent Runner', 'Furnace Swarm'],
    bosses: ['Leadworks Chase', 'Company Retrieval Team'],
    worldBoss: 'Runner Alien',
    gear: [
      ['a3_furnace_key', 'Furnace Control Key', 'Cle de fourneau', { def: 6, hp: 50 }],
      ['a3_signal_flare', 'Industrial Signal Flare', 'Fussee industrielle', { atk: 7, spd: 1 }],
      ['a3_pipe_trap', 'Lead Pipe Trap', 'Piege au tuyau', { atk: 8, def: 3 }]
    ],
    event: ['evt_a3_furnace', 'Leadworks Furnace Trap', 'Piege du fourneau', 'A furnace blast burns and slows the strongest enemy.', 'Un souffle de fourneau brule et ralentit l ennemi le plus fort.'],
    decor: { sky: ['#2d2016', '#090503'], floor: 'rgba(148, 92, 48, 0.2)', grid: 'rgba(255, 121, 44, 0.28)', motif: 'facility', accent: '#ff792c' }
  },
  {
    universe: 'Alien Resurrection',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'USM Auriga Clone Deck',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Newborn Hybrid',
    title: { en: 'Alien Resurrection', fr: 'Alien Resurrection' },
    desc: {
      en: 'Military cloning labs, smugglers, failed Ripley copies, and a hybrid nightmare loose aboard the Auriga.',
      fr: 'Laboratoires de clonage militaires, contrebandiers, copies ratees de Ripley et cauchemar hybride sur l Auriga.'
    },
    hero: { id: 'ripley8', name: 'Ripley 8', cat: 'slayer', color: '#2c3e50' },
    allies: [
      { id: 'call_resurrection', name: 'Annalee Call', cat: 'hacker', color: '#7f8c8d' },
      { id: 'christie_resurrection', name: 'Christie', cat: 'tactical', color: '#5d6d7e' }
    ],
    monsters: ['Clone Lab Xeno', 'Aqua Xenomorph', 'Military Drone'],
    bosses: ['Queen Clone', 'Auriga Security Core'],
    worldBoss: 'Newborn Hybrid',
    gear: [
      ['ar_clone_tube', 'Clone Tube Shard', 'Fragment de cuve clone', { hp: 90 }],
      ['ar_auton_patch', 'Auton Interface Patch', 'Patch interface Auton', { spd: 2, def: 4 }],
      ['ar_betty_rifle', 'Betty Crew Rifle', 'Fusil du Betty', { atk: 9, hp: 30 }]
    ],
    event: ['evt_ar_betty', 'Betty Escape Vector', 'Vecteur de fuite Betty', 'The Betty strafes the field and extracts the weakest ally from danger.', 'Le Betty mitraille le terrain et evacue l allie le plus faible.'],
    decor: { sky: ['#17202a', '#030508'], floor: 'rgba(92, 124, 142, 0.18)', grid: 'rgba(75, 214, 200, 0.25)', motif: 'shipdeck', accent: '#4bd6c8' }
  },
  {
    universe: 'Alien: Covenant',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Planet 4 Cathedral Ruins',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Protomorph Cathedral',
    title: { en: 'Alien: Covenant', fr: 'Alien: Covenant' },
    desc: {
      en: 'A false paradise of spores, Engineer ruins, David s experiments, and the first elegant xenomorph design.',
      fr: 'Un faux paradis de spores, ruines Ingenieur, experiences de David et premier xenomorphe elegant.'
    },
    hero: { id: 'daniels_covenant', name: 'Daniels', cat: 'tactical', color: '#b0a27a' },
    allies: [
      { id: 'walter_covenant', name: 'Walter', cat: 'hacker', color: '#d6d6c2' },
      { id: 'tennessee_covenant', name: 'Tennessee', cat: 'marine', color: '#7b8a8b' }
    ],
    monsters: ['Neomorph', 'Spore Host', 'Praetomorph Stalker'],
    bosses: ['David Lab Horror', 'Covenant Cargo Xeno'],
    worldBoss: 'Protomorph Cathedral',
    gear: [
      ['covenant_spore_filter', 'Spore Filter Mask', 'Masque anti-spores', { def: 7, hp: 45 }],
      ['covenant_flare_gun', 'Covenant Flare Gun', 'Pistolet de detresse Covenant', { atk: 8, spd: 1 }],
      ['covenant_synth_key', 'Synthetic Access Key', 'Cle synthetique', { spd: 2, def: 3 }]
    ],
    event: ['evt_covenant_airlock', 'Cargo Airlock Flush', 'Purge du sas cargo', 'Flushes enemies into vacuum lanes for burst damage.', 'Projette les ennemis dans des couloirs de vide pour de gros degats.'],
    decor: { sky: ['#1f2b1f', '#040805'], floor: 'rgba(124, 129, 91, 0.18)', grid: 'rgba(202, 215, 122, 0.23)', motif: 'castle', accent: '#cad77a' }
  },
  {
    universe: 'Alien: Romulus',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Renaissance Station Breach',
    mode: 'Smash',
    difficulty: 'Very Hard',
    bossName: 'Offspring Hybrid',
    title: { en: 'Alien: Romulus', fr: 'Alien: Romulus' },
    desc: {
      en: 'Young scavengers, derelict corporate science, zero-g acid blood, and a station dropping toward catastrophe.',
      fr: 'Jeunes recup, science corpo abandonnee, sang acide en zero-g et station en chute vers la catastrophe.'
    },
    hero: { id: 'rain_romulus', name: 'Rain Carradine', cat: 'tactical', color: '#8fa3a5' },
    allies: [
      { id: 'andy_romulus', name: 'Andy', cat: 'hacker', color: '#c5c9c7' },
      { id: 'tyler_romulus', name: 'Tyler', cat: 'marine', color: '#6f7d7d' }
    ],
    monsters: ['Facehugger Swarm', 'Station Xeno', 'Zero-G Acid Cloud'],
    bosses: ['Rook Science Core', 'Romulus Hive Cluster'],
    worldBoss: 'Offspring Hybrid',
    gear: [
      ['romulus_pulse_carbine', 'Pulse Carbine', 'Carabine pulse', { atk: 10, spd: 1 }],
      ['romulus_gravity_boots', 'Gravity Boots', 'Bottes gravite', { def: 5, spd: 2 }],
      ['romulus_android_chip', 'Android Directive Chip', 'Puce directive androide', { hp: 55, def: 5 }]
    ],
    event: ['evt_romulus_zerog', 'Zero-G Acid Drift', 'Derive acide zero-g', 'Suspends acid blood in zero-g, damaging every enemy lane.', 'Suspend le sang acide en zero-g et blesse toutes les lignes ennemies.'],
    decor: { sky: ['#0f2028', '#020508'], floor: 'rgba(81, 105, 112, 0.18)', grid: 'rgba(129, 233, 236, 0.27)', motif: 'shipdeck', accent: '#81e9ec' }
  },
  {
    universe: 'Predator 2',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Los Angeles Heat Hunt',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'City Hunter',
    title: { en: 'Predator 2', fr: 'Predator 2' },
    desc: {
      en: 'A concrete-jungle hunt through overheated Los Angeles rooftops, subway tunnels, and trophy rooms.',
      fr: 'Une chasse urbaine dans Los Angeles surchauffee, entre toits, metro et salle des trophees.'
    },
    hero: { id: 'harrigan_p2', name: 'Mike Harrigan', cat: 'tactical', color: '#6c5f54' },
    allies: [
      { id: 'city_hunter_p2', name: 'City Hunter', cat: 'slayer', color: '#6b5d46' },
      { id: 'keyes_p2', name: 'Peter Keyes', cat: 'marine', color: '#1f3a3d' }
    ],
    monsters: ['Heatwave Hunter', 'Subway Stalker', 'Trophy Room Drone'],
    bosses: ['Cloaked Rooftop Duel', 'Elder Ship Guard'],
    worldBoss: 'City Hunter',
    gear: [
      ['p2_smart_disc', 'Smart Disc', 'Disque intelligent', { atk: 11 }],
      ['p2_spear_tip', 'Collapsible Spear', 'Lance retractable', { atk: 8, def: 4 }],
      ['p2_thermal_mask', 'Thermal Mask', 'Masque thermique', { spd: 2, def: 4 }]
    ],
    event: ['evt_p2_trophy', 'Trophy Room Ambush', 'Embuscade de trophees', 'A cloaked hunter strikes the strongest enemy with a smart disc.', 'Un chasseur camoufle frappe l ennemi le plus fort au disque intelligent.'],
    decor: { sky: ['#302217', '#070403'], floor: 'rgba(185, 103, 48, 0.18)', grid: 'rgba(255, 126, 54, 0.28)', motif: 'cybercity', accent: '#ff7e36' }
  },
  {
    universe: 'Predators',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Game Preserve Planet',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Berserker Predator',
    title: { en: 'Predators', fr: 'Predators' },
    desc: {
      en: 'A game preserve planet where abducted killers face Super Predators, tracker beasts, and shifting alliances.',
      fr: 'Une planete-reserve ou des tueurs enleves affrontent Super Predators, molosses pisteurs et alliances fragiles.'
    },
    hero: { id: 'royce_predators', name: 'Royce', cat: 'tactical', color: '#3f4f3f' },
    allies: [
      { id: 'berserker_predator', name: 'Berserker Predator', cat: 'slayer', color: '#4a1f1f' },
      { id: 'hanzo_predators', name: 'Hanzo', cat: 'slayer', color: '#2f3536' }
    ],
    monsters: ['Tracker Hound', 'Falconer Drone', 'Preserve Trap'],
    bosses: ['Falconer Predator', 'Tracker Predator'],
    worldBoss: 'Berserker Predator',
    gear: [
      ['predators_falconer', 'Falconer Drone Eye', 'Oeil du drone fauconnier', { spd: 2, atk: 6 }],
      ['predators_tracker_chain', 'Tracker Chain', 'Chaine de pisteur', { def: 6, hp: 45 }],
      ['predators_yakuza_blade', 'Yakuza Duel Blade', 'Lame de duel yakuza', { atk: 10 }]
    ],
    event: ['evt_predators_preserve', 'Preserve Pack Hunt', 'Chasse de la reserve', 'Tracker beasts pin enemies while the squad gains speed.', 'Les molosses pisteurs bloquent les ennemis et accelerent l escouade.'],
    decor: { sky: ['#1f321c', '#030802'], floor: 'rgba(53, 147, 67, 0.18)', grid: 'rgba(158, 217, 74, 0.27)', motif: 'jungle', accent: '#9ed94a' }
  },
  {
    universe: 'The Predator',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Stargazer Lab Lockdown',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Ultimate Predator',
    title: { en: 'The Predator', fr: 'The Predator' },
    desc: {
      en: 'Stargazer labs, hybridized predator upgrades, crashed tech, and a hunt weaponized by genetic escalation.',
      fr: 'Labos Stargazer, ameliorations hybrides, technologie crashee et chasse militarisee par l escalation genetique.'
    },
    hero: { id: 'quinn_predator', name: 'Quinn McKenna', cat: 'marine', color: '#4b5b42' },
    allies: [
      { id: 'casey_predator', name: 'Casey Bracket', cat: 'hacker', color: '#768b8d' },
      { id: 'fugitive_predator', name: 'Fugitive Predator', cat: 'slayer', color: '#6a5d45' }
    ],
    monsters: ['Predator Dog', 'Stargazer Trooper', 'Hybrid Drone'],
    bosses: ['Fugitive Predator', 'Upgrade Hunter'],
    worldBoss: 'Ultimate Predator',
    gear: [
      ['tp_predator_killer_mask', 'Predator Killer Mask', 'Masque Predator Killer', { def: 8, atk: 5 }],
      ['tp_hybrid_dna', 'Hybrid DNA Sample', 'Echantillon ADN hybride', { hp: 85 }],
      ['tp_gauntlet', 'Stargazer Gauntlet', 'Gantelet Stargazer', { atk: 9, spd: 1 }]
    ],
    event: ['evt_tp_upgrade', 'Hybrid Upgrade Burst', 'Surcharge hybride', 'Hybrid tech boosts attack and drops plasma bursts.', 'La technologie hybride augmente l attaque et declenche des tirs plasma.'],
    decor: { sky: ['#1b2720', '#030604'], floor: 'rgba(76, 116, 89, 0.18)', grid: 'rgba(102, 234, 141, 0.27)', motif: 'facility', accent: '#66ea8d' }
  },
  {
    universe: 'Prey',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Comanche Great Plains Hunt',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Feral Predator',
    title: { en: 'Prey', fr: 'Prey' },
    desc: {
      en: 'A stripped-down first hunt across the Great Plains, where observation, traps, and courage beat alien steel.',
      fr: 'Une premiere chasse brute dans les Grandes Plaines, ou observation, pieges et courage battent l acier alien.'
    },
    hero: { id: 'naru_prey', name: 'Naru', cat: 'tactical', color: '#8c6a45' },
    allies: [
      { id: 'taabe_prey', name: 'Taabe', cat: 'slayer', color: '#6f4e37' },
      { id: 'feral_predator', name: 'Feral Predator', cat: 'horror', color: '#6a5c44' }
    ],
    monsters: ['Feral Trap Drone', 'Cloaked River Stalker', 'Shield Hunter'],
    bosses: ['Bear Hunt Echo', 'Feral Predator'],
    worldBoss: 'Feral Predator',
    gear: [
      ['prey_rope_axe', 'Rope Tomahawk', 'Tomahawk corde', { atk: 9, spd: 2 }],
      ['prey_orange_flower', 'Cooling Orange Flower', 'Fleur orange refroidissante', { def: 6, hp: 50 }],
      ['prey_bone_mask', 'Feral Bone Mask', 'Masque osseux Feral', { atk: 7, def: 5 }]
    ],
    event: ['evt_prey_mud', 'Mud Camouflage Trap', 'Piege camouflage de boue', 'The squad cloaks briefly and counterattacks from ambush.', 'L escouade se camoufle brievement et contre-attaque en embuscade.'],
    decor: { sky: ['#22391d', '#060903'], floor: 'rgba(94, 129, 64, 0.19)', grid: 'rgba(230, 175, 83, 0.24)', motif: 'forest', accent: '#e6af53' }
  },
  {
    universe: 'Predator: Killer of Killers',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Yautja Anthology Arena',
    mode: 'Tactics',
    difficulty: 'Expert',
    bossName: 'First Blooded Champion',
    title: { en: 'Predator: Killer of Killers', fr: 'Predator: Killer of Killers' },
    desc: {
      en: 'An animated anthology breach where elite warriors from different eras are selected for Yautja judgment.',
      fr: 'Une breche anthologique animee ou des guerriers de plusieurs epoques sont choisis pour le jugement Yautja.'
    },
    hero: { id: 'viking_kok', name: 'Viking Shieldmaiden', cat: 'slayer', color: '#7f8c8d' },
    allies: [
      { id: 'ninja_kok', name: 'Shadow Ninja', cat: 'horror', color: '#111111' },
      { id: 'pilot_kok', name: 'War Pilot', cat: 'tactical', color: '#4f5d45' }
    ],
    monsters: ['Era-Hunter Drone', 'Blooded Initiate', 'Trophy Collector'],
    bosses: ['Samurai Hunt Master', 'Air War Predator'],
    worldBoss: 'First Blooded Champion',
    gear: [
      ['kok_blooded_mark', 'Blooded Mark', 'Marque de sang', { atk: 10, def: 4 }],
      ['kok_viking_shield', 'Runic Shield', 'Bouclier runique', { def: 8, hp: 45 }],
      ['kok_predator_spear', 'Trial Combistick', 'Combistick d epreuve', { atk: 9, spd: 1 }]
    ],
    event: ['evt_kok_trial', 'Blooded Trial', 'Epreuve de sang', 'Era champions strike in sequence and mark the boss.', 'Les champions d epoque frappent en sequence et marquent le boss.'],
    decor: { sky: ['#251b1b', '#050303'], floor: 'rgba(112, 85, 64, 0.18)', grid: 'rgba(255, 80, 64, 0.28)', motif: 'duelarena', accent: '#ff5040' }
  },
  {
    universe: 'Predator: Badlands',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Badlands Exile Hunt',
    mode: 'RPG',
    difficulty: 'Expert',
    bossName: 'Exiled Yautja Warlord',
    title: { en: 'Predator: Badlands', fr: 'Predator: Badlands' },
    desc: {
      en: 'A hostile future badlands hunt built around an outcast Yautja, brutal terrain, and survival through exile.',
      fr: 'Une chasse futuriste en terres hostiles, centree sur un Yautja exile, un terrain brutal et la survie.'
    },
    hero: { id: 'dek_badlands', name: 'Dek', cat: 'slayer', color: '#5d4b36' },
    allies: [
      { id: 'thia_badlands', name: 'Thia', cat: 'hacker', color: '#c7d6d2' },
      { id: 'badlands_scout', name: 'Badlands Scout', cat: 'tactical', color: '#9a6a3f' }
    ],
    monsters: ['Badlands Scavenger', 'Wasteland Drone', 'Exile Trial Beast'],
    bosses: ['Ridge Ambusher', 'Clan Executioner'],
    worldBoss: 'Exiled Yautja Warlord',
    gear: [
      ['badlands_exile_mask', 'Exile Mask', 'Masque d exile', { def: 7, spd: 1 }],
      ['badlands_heat_cloak', 'Heat Cloak', 'Cape thermique', { hp: 75, def: 4 }],
      ['badlands_plasma_lance', 'Plasma Lance', 'Lance plasma', { atk: 11 }]
    ],
    event: ['evt_badlands_exile', 'Exile Survival Surge', 'Sursaut d exile', 'Survival instincts heal allies and burn enemies with plasma dust.', 'L instinct de survie soigne les allies et brule les ennemis a la poussiere plasma.'],
    decor: { sky: ['#392411', '#090401'], floor: 'rgba(170, 91, 42, 0.2)', grid: 'rgba(255, 151, 66, 0.28)', motif: 'desert', accent: '#ff9742' }
  },
  {
    universe: 'Alien vs Predator',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Bouvetoya Pyramid Trial',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Predalien Prototype',
    title: { en: 'Alien vs Predator', fr: 'Alien vs Predator' },
    desc: {
      en: 'A shifting Antarctic pyramid where young Yautja hunt xenomorphs under ancient trial rules.',
      fr: 'Une pyramide antarctique mouvante ou de jeunes Yautja chassent des xenomorphes selon un rite ancien.'
    },
    hero: { id: 'lex_avp', name: 'Alexa Woods', cat: 'tactical', color: '#6c7a89' },
    allies: [
      { id: 'scar_avp', name: 'Scar Predator', cat: 'slayer', color: '#6b604c' },
      { id: 'sebastian_avp', name: 'Sebastian De Rosa', cat: 'hacker', color: '#b7a77a' }
    ],
    monsters: ['Pyramid Xenomorph', 'Trial Facehugger', 'Ancient Trap Tile'],
    bosses: ['Scar Predator Trial', 'Alien Queen Escape'],
    worldBoss: 'Predalien Prototype',
    gear: [
      ['avp_plasma_caster', 'Trial Plasma Caster', 'Canon plasma rituel', { atk: 10, def: 3 }],
      ['avp_acid_spear', 'Acid-Marked Spear', 'Lance marquee a l acide', { atk: 8, spd: 1 }],
      ['avp_pyramid_map', 'Shifting Pyramid Map', 'Carte de pyramide mouvante', { def: 6, hp: 55 }]
    ],
    event: ['evt_avp_trial', 'Ancient Hunt Trial', 'Rite de chasse ancien', 'Pyramid walls shift, crushing enemies and shielding allies.', 'Les murs de pyramide bougent, ecrasent les ennemis et protegent les allies.'],
    decor: { sky: ['#16242d', '#030609'], floor: 'rgba(99, 132, 145, 0.18)', grid: 'rgba(85, 221, 215, 0.27)', motif: 'labyrinth', accent: '#55ddd7' }
  },
  {
    universe: 'Aliens vs Predator: Requiem',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Gunnison Containment Night',
    mode: 'Smash',
    difficulty: 'Very Hard',
    bossName: 'Predalien Queen',
    title: { en: 'Aliens vs Predator: Requiem', fr: 'Aliens vs Predator: Requiem' },
    desc: {
      en: 'A small-town outbreak where Wolf Predator cleans the evidence while the Predalien spreads the hive.',
      fr: 'Une infection de petite ville ou Wolf Predator efface les preuves pendant que le Predalien propage la ruche.'
    },
    hero: { id: 'wolf_avpr', name: 'Wolf Predator', cat: 'slayer', color: '#4f4a3e' },
    allies: [
      { id: 'dallas_avpr', name: 'Dallas Howard', cat: 'marine', color: '#4b5f6a' },
      { id: 'kelly_avpr', name: 'Kelly O Brien', cat: 'tactical', color: '#596d5d' }
    ],
    monsters: ['Sewer Xenomorph', 'Hospital Hive Host', 'Predalien Larva'],
    bosses: ['Wolf Cleanup Duel', 'National Guard Collapse'],
    worldBoss: 'Predalien Queen',
    gear: [
      ['avpr_cleaner_fluid', 'Cleaner Dissolve Fluid', 'Fluide dissolvant cleaner', { atk: 8, def: 5 }],
      ['avpr_dual_caster', 'Dual Plasma Caster', 'Double canon plasma', { atk: 12 }],
      ['avpr_sewer_tracker', 'Sewer Tracker Beacon', 'Balise egouts', { spd: 2, hp: 40 }]
    ],
    event: ['evt_avpr_cleaner', 'Cleaner Protocol', 'Protocole Cleaner', 'Wolf dissolves hazards and burns the enemy formation.', 'Wolf dissout les dangers et brule la formation ennemie.'],
    decor: { sky: ['#141d22', '#020405'], floor: 'rgba(73, 88, 91, 0.19)', grid: 'rgba(117, 231, 166, 0.25)', motif: 'fogtown', accent: '#75e7a6' }
  },
  {
    universe: 'Dungeon Meshi',
    mediaType: 'manga',
    faction: 'arcane',
    stageName: 'Golden Dungeon Kitchen',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Winged Lion Appetite',
    title: { en: 'Dungeon Meshi', fr: 'Dungeon Meshi' },
    desc: {
      en: 'A dungeon crawl where ecology, cooking, resurrection, and appetite become tactical survival systems.',
      fr: 'Un donjon ou ecologie, cuisine, resurrection et appetit deviennent des systemes tactiques de survie.'
    },
    hero: { id: 'laios_meshi', name: 'Laios Touden', cat: 'tactical', color: '#d8c08b' },
    allies: [
      { id: 'marcille_meshi', name: 'Marcille', cat: 'hacker', color: '#f4d03f' },
      { id: 'senshi_meshi', name: 'Senshi', cat: 'marine', color: '#6e5c45' }
    ],
    monsters: ['Living Armor', 'Basilisk Skewer', 'Mimic Pot'],
    bosses: ['Red Dragon', 'Mad Mage Feast'],
    worldBoss: 'Winged Lion Appetite',
    gear: [
      ['meshi_cooking_pot', 'Dungeon Cooking Pot', 'Marmite de donjon', { hp: 85 }],
      ['meshi_spellbook', 'Marcille Spellbook', 'Grimoire de Marcille', { atk: 8, spd: 1 }],
      ['meshi_monster_meal', 'Monster Meal Kit', 'Kit repas monstre', { def: 6, hp: 45 }]
    ],
    event: ['evt_meshi_feast', 'Monster Feast', 'Festin de monstre', 'The squad eats a dungeon meal, healing and gaining attack.', 'L escouade mange un plat de donjon, se soigne et gagne de l attaque.'],
    decor: { sky: ['#22301d', '#050804'], floor: 'rgba(131, 103, 64, 0.18)', grid: 'rgba(226, 195, 106, 0.27)', motif: 'labyrinth', accent: '#e2c36a' }
  },
  {
    universe: 'Noob',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Olydri Guild Rift',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Horizon 1.0 Corrupted Raid',
    title: { en: 'Noob', fr: 'Noob' },
    desc: {
      en: 'A French MMORPG comedy universe where guild mistakes, avatars, raids, and Olydri lore become a breach event.',
      fr: 'Un univers MMORPG francais ou boulettes de guilde, avatars, raids et lore d Olydri deviennent une breche.'
    },
    hero: { id: 'sparadrap_noob', name: 'Sparadrap', cat: 'hacker', color: '#f0e6c8' },
    allies: [
      { id: 'gloglo_noob', name: 'Gaea', cat: 'tactical', color: '#75b843' },
      { id: 'omega_zell_noob', name: 'Omega Zell', cat: 'slayer', color: '#345995' }
    ],
    monsters: ['Olydri Slime', 'Bugged NPC', 'PK Ambusher'],
    bosses: ['Corrupted Guild Master', 'Raid Boss Instance'],
    worldBoss: 'Horizon 1.0 Corrupted Raid',
    gear: [
      ['noob_guild_tabard', 'Noob Guild Tabard', 'Tabard guilde Noob', { hp: 70, def: 4 }],
      ['noob_bug_report', 'Bug Report Scroll', 'Parchemin rapport de bug', { spd: 2, def: 3 }],
      ['noob_raid_token', 'Olydri Raid Token', 'Jeton de raid Olydri', { atk: 9 }]
    ],
    event: ['evt_noob_respawn', 'Chaotic Respawn', 'Respawn chaotique', 'A bugged respawn heals allies and scrambles enemy actions.', 'Un respawn bugge soigne les allies et brouille les actions ennemies.'],
    decor: { sky: ['#1d3148', '#04070c'], floor: 'rgba(71, 139, 94, 0.17)', grid: 'rgba(106, 213, 255, 0.27)', motif: 'digitalfield', accent: '#6ad5ff' }
  },
  {
    universe: 'Rammstein',
    mediaType: 'music',
    faction: 'horror',
    stageName: 'Industrial Feuerzone',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Pyro Stage Titan',
    title: { en: 'Rammstein', fr: 'Rammstein' },
    desc: {
      en: 'Industrial metal staged as a furnace arena: flame columns, steel rhythm, and theatrical pressure.',
      fr: 'Metal industriel transforme en arene de fournaise : colonnes de feu, rythme d acier et pression scenique.'
    },
    hero: { id: 'rammstein_pyro', name: 'Rammstein Pyro-Rigger', cat: 'slayer', color: '#7b241c' },
    allies: [
      { id: 'rammstein_keyboard', name: 'Industrial Keyboarder', cat: 'hacker', color: '#566573' },
      { id: 'rammstein_drummer', name: 'Steel Drummer', cat: 'marine', color: '#a04000' }
    ],
    monsters: ['Flame Jet Drone', 'Steel Mask Guard', 'Feedback Imp'],
    bosses: ['Pyro Crane', 'Industrial Chorus Wall'],
    worldBoss: 'Pyro Stage Titan',
    gear: [
      ['rammstein_flamer', 'Stage Flamethrower', 'Lance-flammes de scene', { atk: 11 }],
      ['rammstein_steel_boots', 'Steel Stage Boots', 'Bottes de scene acier', { def: 6, hp: 45 }],
      ['rammstein_mic_stand', 'Reinforced Mic Stand', 'Pied micro renforce', { atk: 8, spd: 1 }]
    ],
    event: ['evt_rammstein_pyro', 'Feuerzone Burst', 'Explosion Feuerzone', 'Pyro columns burn enemies and boost squad attack.', 'Des colonnes pyro brulent les ennemis et renforcent l attaque.'],
    decor: { sky: ['#36110d', '#090201'], floor: 'rgba(179, 55, 31, 0.21)', grid: 'rgba(255, 105, 45, 0.34)', motif: 'concert', accent: '#ff692d' }
  },
  {
    universe: 'System of a Down',
    mediaType: 'music',
    faction: 'horror',
    stageName: 'Chaotic Protest Stage',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Toxicity Riot Core',
    title: { en: 'System of a Down', fr: 'System of a Down' },
    desc: {
      en: 'A sharp political-alt-metal breach with tempo breaks, protest energy, and unstable rhythm traps.',
      fr: 'Une breche alt-metal politique, avec cassures de tempo, energie de protestation et pieges rythmiques.'
    },
    hero: { id: 'soad_vocal', name: 'SOAD Frontline Voice', cat: 'hacker', color: '#b03a2e' },
    allies: [
      { id: 'soad_guitar', name: 'Staccato Guitarist', cat: 'slayer', color: '#1c2833' },
      { id: 'soad_bass', name: 'Groove Bassist', cat: 'tactical', color: '#7d6608' }
    ],
    monsters: ['Tempo Break Drone', 'Riot Static Guard', 'Toxic Feedback'],
    bosses: ['Chop Suey Pulse', 'Prison Song Siren'],
    worldBoss: 'Toxicity Riot Core',
    gear: [
      ['soad_tempo_pick', 'Tempo Break Pick', 'Mediator rupture tempo', { spd: 2, atk: 7 }],
      ['soad_protest_banner', 'Protest Banner', 'Banniere de protestation', { def: 5, hp: 60 }],
      ['soad_feedback_amp', 'Feedback Amp', 'Ampli feedback', { atk: 9 }]
    ],
    event: ['evt_soad_breakdown', 'Tempo Breakdown', 'Cassure de tempo', 'A sudden rhythm break freezes enemies before a heavy hit.', 'Une rupture de tempo fige les ennemis avant un choc lourd.'],
    decor: { sky: ['#251b18', '#060403'], floor: 'rgba(139, 71, 45, 0.18)', grid: 'rgba(241, 196, 15, 0.28)', motif: 'concert', accent: '#f1c40f' }
  },
  {
    universe: 'Rob Zombie',
    mediaType: 'music',
    faction: 'horror',
    stageName: 'Grindhouse Dragula Lot',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Living Dead Stage Machine',
    title: { en: 'Rob Zombie', fr: 'Rob Zombie' },
    desc: {
      en: 'Shock-rock horror with grindhouse lights, monster-movie props, hot rods, and undead stage energy.',
      fr: 'Shock-rock horrifique avec lumiere grindhouse, accessoires de film de monstre, hot rods et scene morte-vivante.'
    },
    hero: { id: 'rob_zombie_stage', name: 'Dragula Ringmaster', cat: 'horror', color: '#5b2c1f' },
    allies: [
      { id: 'rob_zombie_guitar', name: 'Ghoul Guitarist', cat: 'slayer', color: '#922b21' },
      { id: 'rob_zombie_bassist', name: 'Grindhouse Bassist', cat: 'marine', color: '#7b7d7d' }
    ],
    monsters: ['Living Dead Dancer', 'Grindhouse Ghoul', 'Hot Rod Fiend'],
    bosses: ['Dragula Engine', 'House of 1000 Riffs'],
    worldBoss: 'Living Dead Stage Machine',
    gear: [
      ['rz_dragula_key', 'Dragula Ignition Key', 'Cle de contact Dragula', { spd: 2, atk: 6 }],
      ['rz_grindhouse_reel', 'Grindhouse Film Reel', 'Bobine grindhouse', { def: 4, hp: 65 }],
      ['rz_shock_mic', 'Shock Rock Mic', 'Micro shock-rock', { atk: 10 }]
    ],
    event: ['evt_rz_dragula', 'Dragula Hot-Rod Ram', 'Charge hot-rod Dragula', 'A horror hot rod rams through all enemies.', 'Un hot-rod horrifique traverse tous les ennemis.'],
    decor: { sky: ['#2b140f', '#070201'], floor: 'rgba(132, 48, 37, 0.2)', grid: 'rgba(255, 169, 67, 0.28)', motif: 'toyfactory', accent: '#ffa943' }
  },
  {
    universe: 'Daft Punk',
    mediaType: 'music',
    faction: 'cyber',
    stageName: 'Pyramid Alive Grid',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Derezzed Pyramid Core',
    title: { en: 'Daft Punk', fr: 'Daft Punk' },
    desc: {
      en: 'French electronic mythology as a neon pyramid grid, helmeted avatars, and synchronized light combat.',
      fr: 'Mythologie electro francaise en pyramide neon, avatars casques et combat de lumiere synchronisee.'
    },
    hero: { id: 'daft_gold', name: 'Gold Helmet DJ', cat: 'hacker', color: '#d4af37' },
    allies: [
      { id: 'daft_silver', name: 'Silver Helmet DJ', cat: 'tactical', color: '#bdc3c7' },
      { id: 'daft_light_crew', name: 'Alive Light Crew', cat: 'marine', color: '#00d8ff' }
    ],
    monsters: ['Derezzed Drone', 'Neon Sequencer', 'Grid Enforcer'],
    bosses: ['Pyramid Light Wall', 'Robot Rock Titan'],
    worldBoss: 'Derezzed Pyramid Core',
    gear: [
      ['daft_gold_helmet', 'Gold Helmet', 'Casque or', { def: 6, spd: 2 }],
      ['daft_pyramid_console', 'Alive Pyramid Console', 'Console pyramide Alive', { atk: 8, def: 5 }],
      ['daft_neon_disc', 'Derezzed Neon Disc', 'Disque neon Derezzed', { atk: 9, spd: 1 }]
    ],
    event: ['evt_daft_alive', 'Alive Light Sync', 'Synchronisation Alive', 'A light-grid sync boosts speed and lasers every lane.', 'La grille lumineuse booste la vitesse et laserise chaque ligne.'],
    decor: { sky: ['#071729', '#010309'], floor: 'rgba(38, 142, 190, 0.17)', grid: 'rgba(255, 199, 64, 0.34)', motif: 'code', accent: '#ffc740' }
  },
  {
    universe: 'Oliver Tree',
    mediaType: 'music',
    faction: 'cyber',
    stageName: 'Turbo Scooter Suburb',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Turbo Clown Scooter',
    title: { en: 'Oliver Tree', fr: 'Oliver Tree' },
    desc: {
      en: 'A surreal pop-punk scooter world with bowl cuts, meme stunts, oversized props, and chaotic velocity.',
      fr: 'Un monde pop-punk surrealiste de trottinettes, coupes au bol, cascades meme et vitesse chaotique.'
    },
    hero: { id: 'oliver_tree_turbo', name: 'Turbo Oliver', cat: 'hacker', color: '#d8d43f' },
    allies: [
      { id: 'oliver_scooter', name: 'Scooter Stunt Double', cat: 'slayer', color: '#ff6f3c' },
      { id: 'oliver_camera', name: 'Viral Camera Crew', cat: 'tactical', color: '#34495e' }
    ],
    monsters: ['Scooter Cone Drone', 'Viral Glitch Fan', 'Oversized Prop Guard'],
    bosses: ['Bowl Cut Decoy', 'Turbo Meme Machine'],
    worldBoss: 'Turbo Clown Scooter',
    gear: [
      ['ot_turbo_scooter', 'Turbo Scooter', 'Trottinette turbo', { spd: 3, atk: 5 }],
      ['ot_bowl_helmet', 'Bowl-Cut Helmet', 'Casque coupe au bol', { def: 6, hp: 40 }],
      ['ot_viral_camera', 'Viral Camera Rig', 'Camera virale', { atk: 7, spd: 1 }]
    ],
    event: ['evt_ot_scooter', 'Scooter Crash Cut', 'Crash cut trottinette', 'A viral scooter crash interrupts enemies and grants speed.', 'Un crash viral interrompt les ennemis et donne de la vitesse.'],
    decor: { sky: ['#263644', '#05070a'], floor: 'rgba(196, 186, 65, 0.16)', grid: 'rgba(255, 111, 60, 0.3)', motif: 'portalgarage', accent: '#ff6f3c' }
  },
  {
    universe: 'Hazbin Hotel',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Happy Hotel Redemption Rift',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Extermination Overlord',
    title: { en: 'Hazbin Hotel', fr: 'Hazbin Hotel' },
    desc: {
      en: 'A musical Hell hotel caught between redemption, overlords, angelic extermination, and theatrical chaos.',
      fr: 'Un hotel infernal musical entre redemption, overlords, extermination angelique et chaos de cabaret.'
    },
    hero: { id: 'charlie_hazbin', name: 'Charlie Morningstar', cat: 'hacker', color: '#ff5b6e' },
    allies: [
      { id: 'vaggie_hazbin', name: 'Vaggie', cat: 'tactical', color: '#d7c8ff' },
      { id: 'alastor_hazbin', name: 'Alastor', cat: 'horror', color: '#8b0000' }
    ],
    monsters: ['Exorcist Scout', 'Cannibal Town Imp', 'Radio Static Demon'],
    bosses: ['Radio Demon Contract', 'Angel Spear Captain'],
    worldBoss: 'Extermination Overlord',
    gear: [
      ['hazbin_hotel_key', 'Happy Hotel Key', 'Cle du Happy Hotel', { hp: 75, def: 4 }],
      ['hazbin_radio_mic', 'Radio Demon Mic', 'Micro du demon radio', { atk: 10 }],
      ['hazbin_angel_spear', 'Exorcist Spear Shard', 'Eclat de lance exorciste', { atk: 8, spd: 1 }]
    ],
    event: ['evt_hazbin_redemption', 'Redemption Refrain', 'Refrain de redemption', 'A cabaret burst heals allies and fears demonic enemies.', 'Un numero de cabaret soigne les allies et effraie les demons.'],
    decor: { sky: ['#34111b', '#070204'], floor: 'rgba(206, 45, 83, 0.18)', grid: 'rgba(255, 211, 92, 0.28)', motif: 'circus', accent: '#ffd35c' }
  },
  {
    universe: 'Splice',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Nucleic Exchange Lab',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Dren Chimera',
    title: { en: 'Splice', fr: 'Splice' },
    desc: {
      en: 'A genetic engineering breach where ambition, biotech patents, and hybrid lifeforms mutate beyond control.',
      fr: 'Une breche de genie genetique ou ambition, brevets biotech et hybrides echappent au controle.'
    },
    hero: { id: 'elsa_splice', name: 'Elsa Kast', cat: 'hacker', color: '#8ed6d3' },
    allies: [
      { id: 'clive_splice', name: 'Clive Nicoli', cat: 'tactical', color: '#4d7f8c' },
      { id: 'dren_splice', name: 'Dren', cat: 'slayer', color: '#b8d9c0' }
    ],
    monsters: ['Specimen Pod', 'Nucleic Larva', 'Lab Security Drone'],
    bosses: ['Ginger Mutation', 'Hybrid Containment Breach'],
    worldBoss: 'Dren Chimera',
    gear: [
      ['splice_gene_vial', 'Hybrid Gene Vial', 'Fiole gene hybride', { atk: 9, spd: 1 }],
      ['splice_lab_badge', 'Nucleic Lab Badge', 'Badge labo Nucleic', { def: 6, hp: 55 }],
      ['splice_sample_case', 'Cryo Sample Case', 'Mallette cryo', { hp: 80 }]
    ],
    event: ['evt_splice_chimera', 'Chimera Growth Shock', 'Choc de croissance chimere', 'A hybrid pulse mutates enemies, slowing them and cutting defense.', 'Une onde hybride ralentit les ennemis et brise leur defense.'],
    decor: { sky: ['#172d32', '#03080a'], floor: 'rgba(105, 190, 184, 0.17)', grid: 'rgba(142, 214, 211, 0.3)', motif: 'facility', accent: '#8ed6d3' }
  },
  {
    universe: 'Police Squad',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Police Squad Evidence Room',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Frame-Up Commissioner',
    title: { en: 'Police Squad!', fr: 'Police Squad!' },
    desc: {
      en: 'A deadpan police procedural breach where Frank Drebin turns absurd evidence into tactical chaos.',
      fr: 'Une breche de procedural policier absurde ou Frank Drebin transforme les preuves en chaos tactique.'
    },
    hero: { id: 'frank_drebin', name: 'Frank Drebin', cat: 'tactical', color: '#2f75b5' },
    allies: [
      { id: 'ed_hocken', name: 'Ed Hocken', cat: 'marine', color: '#5d6d7e' },
      { id: 'nordberg', name: 'Nordberg', cat: 'hacker', color: '#f1c40f' }
    ],
    monsters: ['Confused Henchman', 'Evidence Clerk Drone', 'Misdirected Sniper'],
    bosses: ['Hypnotized Umpire', 'Frame-Up Commissioner'],
    worldBoss: 'Deadpan Crime Nexus',
    gear: [
      ['drebin_badge', 'Drebin Badge', 'Plaque Drebin', { def: 7, spd: 1 }],
      ['squad_micro_recorder', 'Hidden Wire Recorder', 'Micro cache', { atk: 7, def: 4 }],
      ['squad_coffee_cup', 'Stakeout Coffee', 'Cafe de planque', { hp: 70 }]
    ],
    event: ['evt_drebin_misfire', 'Accidental Perfect Arrest', 'Arrestation accidentelle parfaite', 'A chain of mistakes stuns enemies and buffs squad evasion.', 'Une chaine de maladresses etourdit les ennemis et booste l esquive.'],
    decor: { sky: ['#1c2b3a', '#04070b'], floor: 'rgba(47, 117, 181, 0.16)', grid: 'rgba(241, 196, 15, 0.28)', motif: 'facility', accent: '#2f75b5' }
  },
  {
    universe: 'Breaking Bad',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Albuquerque Lab Breach',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Heisenberg Empire',
    title: { en: 'Breaking Bad', fr: 'Breaking Bad' },
    desc: {
      en: 'A criminal chemistry breach of desert strategy, blue product, cartel pressure, and collapsing identities.',
      fr: 'Une breche de chimie criminelle, strategie desertique, produit bleu et identites qui s effondrent.'
    },
    hero: { id: 'walter_white', name: 'Walter White', cat: 'hacker', color: '#5c8a43' },
    allies: [
      { id: 'jesse_pinkman', name: 'Jesse Pinkman', cat: 'slayer', color: '#f1c40f' },
      { id: 'mike_ehrmantraut', name: 'Mike Ehrmantraut', cat: 'tactical', color: '#7f8c8d' }
    ],
    monsters: ['Cartel Runner', 'Lab Guard', 'Desert Informant'],
    bosses: ['Tuco Salamanca', 'Gus Fring Operation'],
    worldBoss: 'Heisenberg Empire',
    gear: [
      ['bb_blue_sample', 'Blue Crystal Sample', 'Echantillon bleu', { atk: 10 }],
      ['bb_hazmat_suit', 'Yellow Hazmat Suit', 'Combinaison jaune', { def: 7, hp: 45 }],
      ['bb_rv_keys', 'Desert RV Keys', 'Cles du camping-car', { spd: 2, hp: 35 }]
    ],
    event: ['evt_bb_say_my_name', 'Say My Name', 'Say My Name', 'Heisenberg pressure fears enemies and boosts tactical damage.', 'La pression Heisenberg effraie les ennemis et booste les degats tactiques.'],
    decor: { sky: ['#463a20', '#090603'], floor: 'rgba(210, 175, 80, 0.17)', grid: 'rgba(92, 138, 67, 0.32)', motif: 'portalgarage', accent: '#d2af50' }
  },
  {
    universe: 'Stargate Atlantis',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Atlantis City Shield',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Wraith Hive Ship',
    title: { en: 'Stargate Atlantis', fr: 'Stargate Atlantis' },
    desc: {
      en: 'The Pegasus expedition defends an Ancient city against Wraith hives, Replicators, and unstable ZPM power.',
      fr: 'L expedition Pegasus defend une cite Ancienne contre ruches Wraith, Replicateurs et ZPM instables.'
    },
    hero: { id: 'sheppard_sga', name: 'John Sheppard', cat: 'marine', color: '#4e89b8' },
    allies: [
      { id: 'mckay_sga', name: 'Rodney McKay', cat: 'hacker', color: '#f1c40f' },
      { id: 'teyla_sga', name: 'Teyla Emmagan', cat: 'tactical', color: '#7d6b4f' }
    ],
    monsters: ['Wraith Drone', 'Genii Saboteur', 'Replicator Probe'],
    bosses: ['Michael Hybrid', 'Wraith Queen'],
    worldBoss: 'Wraith Hive Ship',
    gear: [
      ['sga_zpm', 'ZPM Charge', 'Charge ZPM', { atk: 9, hp: 60 }],
      ['sga_lantean_tablet', 'Lantean Tablet', 'Tablette lanteenne', { def: 6, spd: 1 }],
      ['sga_puddle_jumper', 'Puddle Jumper Beacon', 'Balise jumper', { spd: 2, atk: 5 }]
    ],
    event: ['evt_sga_city_shield', 'Atlantis City Shield', 'Bouclier de la cite Atlantis', 'The city shield absorbs damage and fires drone weapons.', 'Le bouclier de la cite absorbe les degats et tire des drones.'],
    decor: { sky: ['#12324a', '#02070c'], floor: 'rgba(80, 176, 220, 0.18)', grid: 'rgba(110, 208, 255, 0.34)', motif: 'stargate', accent: '#6ed0ff' }
  },
  {
    universe: 'Stargate Universe',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Destiny FTL Corridor',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Destiny Control Lockout',
    title: { en: 'Stargate Universe', fr: 'Stargate Universe' },
    desc: {
      en: 'A stranded crew aboard Destiny, rationing power, air, trust, and Ancient systems at the edge of galaxies.',
      fr: 'Un equipage piege sur Destiny, economisant energie, air, confiance et systemes Anciens.'
    },
    hero: { id: 'rush_sgu', name: 'Nicholas Rush', cat: 'hacker', color: '#8d6e63' },
    allies: [
      { id: 'young_sgu', name: 'Everett Young', cat: 'tactical', color: '#536d7a' },
      { id: 'greer_sgu', name: 'Ronald Greer', cat: 'marine', color: '#2f4f4f' }
    ],
    monsters: ['Lucian Raider', 'Drone Command Ship', 'Destiny System Fault'],
    bosses: ['Blue Alien Boarding Team', 'Ancient Chair Lockout'],
    worldBoss: 'Destiny Control Lockout',
    gear: [
      ['sgu_communication_stone', 'Communication Stone', 'Pierre de communication', { def: 5, spd: 2 }],
      ['sgu_destiny_console', 'Destiny Console Core', 'Console de Destiny', { atk: 8, def: 5 }],
      ['sgu_air_filter', 'Emergency Air Filter', 'Filtre a air urgence', { hp: 95 }]
    ],
    event: ['evt_sgu_ftl_jump', 'Emergency FTL Jump', 'Saut FTL urgence', 'Destiny jumps through the battlefield, scrambling enemy targeting.', 'Destiny saute en FTL et brouille le ciblage ennemi.'],
    decor: { sky: ['#2a2118', '#060403'], floor: 'rgba(168, 115, 59, 0.18)', grid: 'rgba(255, 173, 79, 0.28)', motif: 'shipdeck', accent: '#ffad4f' }
  },
  {
    universe: 'Stargate Infinity',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Infinity Training Gate',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'TlakKahn Pursuit Fleet',
    title: { en: 'Stargate Infinity', fr: 'Stargate Infinity' },
    desc: {
      en: 'Animated Stargate cadets chased through alien worlds by TlakKahn hunters and unstable gate routes.',
      fr: 'Des cadets Stargate animes poursuivis par les TlakKahn a travers des routes de portes instables.'
    },
    hero: { id: 'gus_bonner', name: 'Gus Bonner', cat: 'tactical', color: '#3b7ddd' },
    allies: [
      { id: 'stacey_bonner', name: 'Stacey Bonner', cat: 'hacker', color: '#9b59b6' },
      { id: 'ecgab_infinity', name: 'Ecgab', cat: 'marine', color: '#27ae60' }
    ],
    monsters: ['TlakKahn Trooper', 'Training Drone', 'Gate Route Parasite'],
    bosses: ['DaKyll Hunter', 'Infinity Gate Storm'],
    worldBoss: 'TlakKahn Pursuit Fleet',
    gear: [
      ['sgi_cadet_gdo', 'Cadet GDO', 'GDO cadet', { def: 6, hp: 40 }],
      ['sgi_training_blaster', 'Training Blaster', 'Blaster entrainement', { atk: 8 }],
      ['sgi_gate_map', 'Animated Gate Map', 'Carte de portes animee', { spd: 2, def: 3 }]
    ],
    event: ['evt_sgi_gate_dash', 'Infinity Gate Dash', 'Dash porte Infinity', 'A rapid gate hop dodges attacks and strikes every lane.', 'Un saut de porte rapide esquive et frappe chaque ligne.'],
    decor: { sky: ['#1b315c', '#040710'], floor: 'rgba(68, 130, 220, 0.17)', grid: 'rgba(120, 240, 190, 0.28)', motif: 'stargate', accent: '#78f0be' }
  },
  {
    universe: 'The Brave Little Toaster',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Appliance Junkyard Run',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Junkyard Magnet',
    title: { en: 'The Brave Little Toaster', fr: 'Le Petit Grille-Pain courageux' },
    desc: {
      en: 'A bittersweet appliance odyssey where loyal machines cross hostile roads, repair shops, and junkyards.',
      fr: 'Une odyssee douce-amere d appareils fideles traversant routes, ateliers et decharges hostiles.'
    },
    hero: { id: 'toaster_brave', name: 'Toaster', cat: 'slayer', color: '#dfe6e9' },
    allies: [
      { id: 'lampy_brave', name: 'Lampy', cat: 'hacker', color: '#f1c40f' },
      { id: 'kirby_brave', name: 'Kirby', cat: 'marine', color: '#8e5b3a' }
    ],
    monsters: ['Repair Shop Clamp', 'Junkyard Crusher', 'Storm Drain Spark'],
    bosses: ['Air Conditioner Rage', 'Giant Magnet Arm'],
    worldBoss: 'Junkyard Magnet',
    gear: [
      ['toaster_chrome_slot', 'Chrome Toast Slot', 'Fente chrome', { def: 7 }],
      ['lampy_bulb', 'Lampy Bulb', 'Ampoule Lampy', { atk: 7, spd: 1 }],
      ['kirby_vacuum_bag', 'Kirby Vacuum Bag', 'Sac aspirateur Kirby', { hp: 85 }]
    ],
    event: ['evt_toaster_spark', 'Appliance Loyalty Surge', 'Surtension de loyauté', 'The appliance squad sparks the field and shields allies.', 'Les appareils creent une surtension et protegent les allies.'],
    decor: { sky: ['#27313a', '#050608'], floor: 'rgba(190, 160, 105, 0.17)', grid: 'rgba(241, 196, 15, 0.28)', motif: 'toyfactory', accent: '#f1c40f' }
  },
  {
    universe: 'Evolution',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Arizona Meteor Lab',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Rapid Evolution Colony',
    title: { en: 'Evolution', fr: 'Evolution' },
    desc: {
      en: 'A meteor-borne alien ecosystem evolves at impossible speed, turning science, shampoo, and panic into weapons.',
      fr: 'Un ecosysteme alien venu d une meteorite evolue a vitesse impossible entre science, shampooing et panique.'
    },
    hero: { id: 'ira_kane', name: 'Ira Kane', cat: 'hacker', color: '#6ab04c' },
    allies: [
      { id: 'harry_block', name: 'Harry Block', cat: 'tactical', color: '#3498db' },
      { id: 'wayne_green', name: 'Wayne Grey', cat: 'marine', color: '#e67e22' }
    ],
    monsters: ['Flatworm Specimen', 'Flying Alien Drake', 'Cave Primate Mutant'],
    bosses: ['Selenium Burst Nest', 'Giant Amoeba Growth'],
    worldBoss: 'Rapid Evolution Colony',
    gear: [
      ['evo_selenium_shampoo', 'Selenium Shampoo', 'Shampooing selenium', { atk: 10 }],
      ['evo_meteor_chip', 'Meteorite Core Chip', 'Fragment meteorite', { hp: 65, def: 4 }],
      ['evo_lab_spray', 'Lab Decon Sprayer', 'Pulverisateur decontamination', { def: 6, spd: 1 }]
    ],
    event: ['evt_evo_selenium', 'Selenium Cascade', 'Cascade de selenium', 'A selenium burst burns alien cells and cleanses the squad.', 'Une vague de selenium brule les cellules aliens et purifie l escouade.'],
    decor: { sky: ['#2b4631', '#050904'], floor: 'rgba(116, 170, 76, 0.16)', grid: 'rgba(106, 176, 76, 0.32)', motif: 'facility', accent: '#6ab04c' }
  },
  {
    universe: 'Evolution: The Animated Series',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Genus Command Field',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Genus Swarm Queen',
    title: { en: 'Evolution: The Animated Series', fr: 'Evolution : la serie animee' },
    desc: {
      en: 'The Genus threat spreads into animated monster-of-the-week mutations and field-response science missions.',
      fr: 'La menace Genus devient une suite de mutations animees et de missions scientifiques de terrain.'
    },
    hero: { id: 'ira_evo_anim', name: 'Ira Kane Animated', cat: 'hacker', color: '#2ecc71' },
    allies: [
      { id: 'harry_evo_anim', name: 'Harry Block Animated', cat: 'tactical', color: '#3498db' },
      { id: 'gassie_evo_anim', name: 'Gassie', cat: 'slayer', color: '#d35400' }
    ],
    monsters: ['Genus Runner', 'Mutant Flyer', 'Cell Splitter'],
    bosses: ['Genus Brute', 'Animated Hive Node'],
    worldBoss: 'Genus Swarm Queen',
    gear: [
      ['evoa_genus_scanner', 'Genus Scanner', 'Scanner Genus', { spd: 2, def: 4 }],
      ['evoa_field_pack', 'Field Science Pack', 'Sac scientifique terrain', { hp: 75 }],
      ['evoa_cell_sample', 'Animated Cell Sample', 'Cellule animee', { atk: 8, def: 3 }]
    ],
    event: ['evt_evoa_counteragent', 'Genus Counteragent', 'Contre-agent Genus', 'A counteragent weakens mutation waves and grants speed.', 'Un contre-agent affaiblit les mutations et donne de la vitesse.'],
    decor: { sky: ['#1d3b4a', '#03080b'], floor: 'rgba(58, 180, 145, 0.16)', grid: 'rgba(90, 230, 178, 0.28)', motif: 'facility', accent: '#5ae6b2' }
  },
  {
    universe: 'Early Edition',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Tomorrow Newspaper Loop',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Deadline Paradox',
    title: { en: 'Early Edition', fr: 'Demain a la une' },
    desc: {
      en: 'A mysterious newspaper delivers tomorrow s disasters today, turning small choices into time-loop missions.',
      fr: 'Un journal mysterieux livre les catastrophes de demain et transforme les choix en missions temporelles.'
    },
    hero: { id: 'gary_hobson', name: 'Gary Hobson', cat: 'tactical', color: '#c49a5a' },
    allies: [
      { id: 'marissa_clark', name: 'Marissa Clark', cat: 'hacker', color: '#8e7cc3' },
      { id: 'chuck_fishman', name: 'Chuck Fishman', cat: 'slayer', color: '#e67e22' }
    ],
    monsters: ['Deadline Echo', 'Tomorrow Accident', 'Time Misprint'],
    bosses: ['Paradox Courier', 'Front Page Disaster'],
    worldBoss: 'Deadline Paradox',
    gear: [
      ['ee_tomorrow_paper', 'Tomorrow Paper', 'Journal de demain', { spd: 2, def: 5 }],
      ['ee_cat_bell', 'Orange Cat Bell', 'Clochette du chat', { hp: 60, spd: 1 }],
      ['ee_press_pass', 'Press Pass', 'Badge presse', { atk: 6, def: 5 }]
    ],
    event: ['evt_ee_front_page', 'Front Page Rewrite', 'Reecriture de une', 'Tomorrow s headline rewinds damage and reveals enemy intent.', 'La une de demain annule des degats et revele les intentions ennemies.'],
    decor: { sky: ['#2d2a20', '#070604'], floor: 'rgba(196, 154, 90, 0.18)', grid: 'rgba(245, 218, 135, 0.26)', motif: 'arcanecity', accent: '#f5da87' }
  },
  {
    universe: 'Charmed',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Halliwells Manor Nexus',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Source of All Evil',
    title: { en: 'Charmed', fr: 'Charmed' },
    desc: {
      en: 'The Power of Three holds back demons, warlocks, time loops, and Book of Shadows corruption.',
      fr: 'Le Pouvoir des Trois retient demons, sorciers, boucles temporelles et corruption du Livre des Ombres.'
    },
    hero: { id: 'prue_halliwell', name: 'Prue Halliwell', cat: 'hacker', color: '#8e44ad' },
    allies: [
      { id: 'piper_halliwell', name: 'Piper Halliwell', cat: 'tactical', color: '#3498db' },
      { id: 'phoebe_halliwell', name: 'Phoebe Halliwell', cat: 'slayer', color: '#e67e22' }
    ],
    monsters: ['Lower Demon', 'Warlock Thief', 'Shadow Familiar'],
    bosses: ['Balthazor', 'The Seer'],
    worldBoss: 'Source of All Evil',
    gear: [
      ['charmed_bos_page', 'Book of Shadows Page', 'Page du Livre des Ombres', { atk: 9, def: 4 }],
      ['charmed_potion_vial', 'Vanquishing Potion', 'Potion de destruction', { atk: 8, spd: 1 }],
      ['charmed_triquetra', 'Triquetra Charm', 'Charme triquetra', { hp: 70, def: 5 }]
    ],
    event: ['evt_charmed_power_three', 'Power of Three', 'Pouvoir des Trois', 'A triple spell blasts demons and shields the squad.', 'Un sort triple frappe les demons et protege l escouade.'],
    decor: { sky: ['#2d173d', '#06030a'], floor: 'rgba(142, 68, 173, 0.18)', grid: 'rgba(214, 180, 255, 0.28)', motif: 'arcanecity', accent: '#d6b4ff' }
  },
  {
    universe: 'Buffy the Vampire Slayer',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Sunnydale Hellmouth',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'The First Evil',
    title: { en: 'Buffy the Vampire Slayer', fr: 'Buffy contre les vampires' },
    desc: {
      en: 'A Hellmouth town where a Slayer, Watchers, witches, and friends fight vampires and apocalyptic demons.',
      fr: 'Une ville sur la Bouche de l Enfer ou Tueuse, Observateurs, sorcieres et amis combattent vampires et demons.'
    },
    hero: { id: 'buffy_summers', name: 'Buffy Summers', cat: 'slayer', color: '#f6c15b' },
    allies: [
      { id: 'willow_rosenberg', name: 'Willow Rosenberg', cat: 'hacker', color: '#c0392b' },
      { id: 'giles_buffy', name: 'Rupert Giles', cat: 'tactical', color: '#7f8c8d' }
    ],
    monsters: ['Vampire Minion', 'Hellmouth Imp', 'Bringer Scout'],
    bosses: ['Spike Duel', 'Glory Godling'],
    worldBoss: 'The First Evil',
    gear: [
      ['buffy_stake', 'Mr Pointy Stake', 'Pieu Mr Pointy', { atk: 10 }],
      ['buffy_watcher_book', 'Watcher Field Book', 'Carnet d Observateur', { def: 6, spd: 1 }],
      ['buffy_witch_charm', 'Willow Witch Charm', 'Charme de Willow', { hp: 60, atk: 5 }]
    ],
    event: ['evt_buffy_slayer', 'Slayer Scythe Rally', 'Ralliement de la faux', 'The Slayer cuts through demons and rallies every ally.', 'La Tueuse traverse les demons et rallie tous les allies.'],
    decor: { sky: ['#2b1822', '#060205'], floor: 'rgba(198, 57, 78, 0.18)', grid: 'rgba(246, 193, 91, 0.28)', motif: 'hauntedset', accent: '#f6c15b' }
  },
  {
    universe: 'Attack on Titan',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Shiganshina Wall Breach',
    mode: 'Smash',
    difficulty: 'Very Hard',
    bossName: 'Colossal Titan',
    title: { en: 'Attack on Titan', fr: 'L Attaque des Titans' },
    desc: {
      en: 'Humanity fights towering Titans with ODM gear, wall warfare, political secrets, and brutal sacrifice.',
      fr: 'L humanite affronte les Titans avec equipement tridimensionnel, murs, secrets politiques et sacrifices.'
    },
    hero: { id: 'eren_yeager', name: 'Eren Yeager', cat: 'slayer', color: '#2f7d55' },
    allies: [
      { id: 'mikasa_ackerman', name: 'Mikasa Ackerman', cat: 'slayer', color: '#8b1e2d' },
      { id: 'armin_arlert', name: 'Armin Arlert', cat: 'tactical', color: '#f1c40f' }
    ],
    monsters: ['Pure Titan', 'Crawler Titan', 'Wall Cult Fanatic'],
    bosses: ['Armored Titan', 'Female Titan'],
    worldBoss: 'Colossal Titan',
    gear: [
      ['aot_odm_gear', 'ODM Gear', 'Equipement tridimensionnel', { spd: 3, atk: 6 }],
      ['aot_blade_pair', 'Titan Blade Pair', 'Lames anti-Titan', { atk: 10 }],
      ['aot_survey_cloak', 'Survey Corps Cloak', 'Cape du bataillon', { def: 6, hp: 45 }]
    ],
    event: ['evt_aot_wall_breach', 'Wall Breach Counterattack', 'Contre-attaque du mur', 'ODM strikes slash every huge enemy and grant speed.', 'Les frappes tridimensionnelles taillent les grands ennemis et donnent vitesse.'],
    decor: { sky: ['#3a3324', '#080604'], floor: 'rgba(117, 91, 48, 0.2)', grid: 'rgba(205, 166, 82, 0.26)', motif: 'castle', accent: '#cda652' }
  },
  {
    universe: 'Death Note',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Kira Investigation Board',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Kira Judgment Loop',
    title: { en: 'Death Note', fr: 'Death Note' },
    desc: {
      en: 'A supernatural investigation breach where names, rules, shinigami, and deduction become lethal weapons.',
      fr: 'Une enquete surnaturelle ou noms, regles, shinigami et deduction deviennent des armes mortelles.'
    },
    hero: { id: 'light_yagami', name: 'Light Yagami', cat: 'hacker', color: '#2d3436' },
    allies: [
      { id: 'l_lawliet', name: 'L Lawliet', cat: 'tactical', color: '#dfe6e9' },
      { id: 'misa_amane', name: 'Misa Amane', cat: 'horror', color: '#f5c2d1' }
    ],
    monsters: ['Task Force Tail', 'Kira Copycat', 'Shinigami Whisper'],
    bosses: ['Rem Contract', 'Near Deduction Trap'],
    worldBoss: 'Kira Judgment Loop',
    gear: [
      ['dn_black_notebook', 'Black Notebook Page', 'Page du carnet noir', { atk: 10, def: 2 }],
      ['dn_sugar_cube', 'L Sugar Cube', 'Sucre de L', { spd: 2, hp: 35 }],
      ['dn_shinigami_apple', 'Shinigami Apple', 'Pomme shinigami', { hp: 60, atk: 5 }]
    ],
    event: ['evt_dn_name_rule', 'Name Written Rule', 'Regle du nom ecrit', 'A rule trap marks the strongest enemy and lowers its attack.', 'Une regle piege marque l ennemi le plus fort et baisse son attaque.'],
    decor: { sky: ['#151515', '#030303'], floor: 'rgba(80, 80, 80, 0.18)', grid: 'rgba(220, 220, 220, 0.22)', motif: 'hauntedset', accent: '#dfe6e9' }
  },
  {
    universe: 'Cells at Work!',
    mediaType: 'manga',
    faction: 'sciFi',
    stageName: 'Body System Infection',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Sepsis Breach',
    title: { en: 'Cells at Work!', fr: 'Les Brigades immunitaires' },
    desc: {
      en: 'Inside the body, red cells deliver oxygen while white cells battle bacteria, viruses, and systemic collapse.',
      fr: 'Dans le corps, les globules rouges livrent l oxygene pendant que les blancs combattent microbes et virus.'
    },
    hero: { id: 'red_blood_cell', name: 'Red Blood Cell AE3803', cat: 'marine', color: '#e74c3c' },
    allies: [
      { id: 'white_blood_cell', name: 'White Blood Cell U-1146', cat: 'slayer', color: '#ecf0f1' },
      { id: 'platelet_cells', name: 'Platelet Squad', cat: 'tactical', color: '#f6d365' }
    ],
    monsters: ['Pneumococcus Germ', 'Cedar Pollen Allergen', 'Cancer Cell Scout'],
    bosses: ['Influenza Virus Swarm', 'Killer T Cell Drill'],
    worldBoss: 'Sepsis Breach',
    gear: [
      ['caw_oxygen_box', 'Oxygen Delivery Box', 'Caisse oxygene', { hp: 80 }],
      ['caw_white_knife', 'Neutrophil Knife', 'Couteau neutrophile', { atk: 9 }],
      ['caw_platelet_net', 'Platelet Repair Net', 'Filet plaquette', { def: 7, spd: 1 }]
    ],
    event: ['evt_caw_immunity', 'Immune Response Surge', 'Poussee immunitaire', 'Immune cells purge poison and damage biological enemies.', 'Les cellules immunitaires purgent le poison et frappent les ennemis biologiques.'],
    decor: { sky: ['#4b1720', '#080204'], floor: 'rgba(231, 76, 60, 0.16)', grid: 'rgba(236, 240, 241, 0.28)', motif: 'facility', accent: '#ecf0f1' }
  },
  {
    universe: 'Inuyashiki',
    mediaType: 'manga',
    faction: 'cyber',
    stageName: 'Cyber Body Tokyo Incident',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    bossName: 'Hiro Shishigami Rampage',
    title: { en: 'Inuyashiki', fr: 'Inuyashiki' },
    desc: {
      en: 'Two rebuilt human weapons choose opposite paths: protection, massacre, family, and machine morality.',
      fr: 'Deux humains reconstruits en armes choisissent des voies opposees entre protection, massacre et morale machine.'
    },
    hero: { id: 'ichiro_inuyashiki', name: 'Ichiro Inuyashiki', cat: 'hacker', color: '#bdc3c7' },
    allies: [
      { id: 'hiro_shishigami', name: 'Hiro Shishigami', cat: 'slayer', color: '#2d3436' },
      { id: 'mari_inuyashiki', name: 'Mari Inuyashiki', cat: 'tactical', color: '#fd79a8' }
    ],
    monsters: ['Cyber Weapon Trace', 'Media Panic Mob', 'Drone Police Unit'],
    bosses: ['Airport Missile Lock', 'Hiro Remote Kill Pattern'],
    worldBoss: 'Hiro Shishigami Rampage',
    gear: [
      ['inu_cyber_core', 'Cyber Body Core', 'Noyau corps cyber', { atk: 9, def: 5 }],
      ['inu_healing_beam', 'Healing Beam Lens', 'Lentille de soin', { hp: 95 }],
      ['inu_flight_thruster', 'Hidden Flight Thruster', 'Propulseur cache', { spd: 3 }]
    ],
    event: ['evt_inu_machine_heart', 'Machine Heart Override', 'Override coeur machine', 'A cyber-heart burst heals allies and locks enemy weapons.', 'Un coeur cyber soigne les allies et verrouille les armes ennemies.'],
    decor: { sky: ['#101923', '#020305'], floor: 'rgba(92, 120, 145, 0.17)', grid: 'rgba(189, 195, 199, 0.3)', motif: 'code', accent: '#bdc3c7' }
  }
];

const colorPalette = {
  sciFi: '#63d7ff',
  horror: '#e74c3c',
  cyber: '#39ffcc',
  arcane: '#d9b86b'
};

const weaponByCategory = {
  marine: 'gun',
  horror: 'slash',
  slayer: 'slash',
  hacker: 'laser',
  tactical: 'gun'
};

const statsByCategory = {
  marine: { hp: 130, atk: 10, def: 8, spd: 4 },
  horror: { hp: 115, atk: 11, def: 7, spd: 5 },
  slayer: { hp: 105, atk: 14, def: 5, spd: 6 },
  hacker: { hp: 100, atk: 12, def: 6, spd: 6 },
  tactical: { hp: 120, atk: 11, def: 7, spd: 4 }
};

function stageIdFor(index) {
  return EXPANDED_STAGE_START_ID + index;
}

function difficultyRank(universe) {
  return difficultyScale[universe.difficulty] || 0;
}

function rewardFor(universe) {
  const reward = modeReward[universe.mode] || modeReward.RPG;
  const rank = difficultyRank(universe);
  return {
    goldPrize: reward.gold + rank * 18,
    shardPrize: reward.shards + rank * 6
  };
}

function makeCombatHero(item) {
  const stats = statsByCategory[item.cat] || statsByCategory.tactical;
  const weapon = weaponByCategory[item.cat] || 'gun';
  return {
    id: item.id,
    name: item.name,
    cat: item.cat,
    color: item.color,
    weapon,
    stats
  };
}

function makeEnemy(name, index, universe, tier = 0) {
  const rank = difficultyRank(universe);
  return {
    name,
    hp: 85 + rank * 18 + tier * 35 + index * 12,
    atk: 11 + rank * 2 + tier * 4 + index,
    spd: 4 + (index % 3),
    color: universe.decor.accent,
    weapon: universe.faction === 'arcane' ? 'magic' : universe.faction === 'cyber' ? 'laser' : universe.faction === 'horror' ? 'claws' : 'gun'
  };
}

export function getExpandedStages() {
  return EXPANDED_UNIVERSES.map((universe, index) => ({
    id: stageIdFor(index),
    name: universe.stageName,
    universe: universe.universe,
    mode: universe.mode,
    difficulty: universe.difficulty,
    bossName: universe.bossName,
    ...rewardFor(universe)
  }));
}

export const EXPANDED_STAGE_ID_BY_UNIVERSE = Object.fromEntries(
  EXPANDED_UNIVERSES.map((universe, index) => [universe.universe, stageIdFor(index)])
);

export const EXPANDED_FACTION_UNIVERSES = {
  sciFi: EXPANDED_UNIVERSES.filter(universe => universe.faction === 'sciFi').map(universe => universe.universe),
  horror: EXPANDED_UNIVERSES.filter(universe => universe.faction === 'horror').map(universe => universe.universe),
  cyber: EXPANDED_UNIVERSES.filter(universe => universe.faction === 'cyber').map(universe => universe.universe),
  arcane: EXPANDED_UNIVERSES.filter(universe => universe.faction === 'arcane').map(universe => universe.universe)
};

export const EXPANDED_LORE_DB = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, {
    mediaType: universe.mediaType,
    title: universe.title,
    desc: universe.desc
  }])
);

export const EXPANDED_ENEMIES_DB = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, {
    monsters: universe.monsters.map((name, index) => makeEnemy(name, index, universe)),
    bosses: universe.bosses.map((name, index) => ({
      ...makeEnemy(name, index, universe, 2),
      hp: 420 + difficultyRank(universe) * 70 + index * 65,
      atk: 19 + difficultyRank(universe) * 3 + index * 3,
      special: `${name} Breach Pattern`
    })),
    worldBoss: {
      ...makeEnemy(universe.worldBoss, 0, universe, 4),
      hp: 1180 + difficultyRank(universe) * 170,
      atk: 30 + difficultyRank(universe) * 4,
      spd: 4,
      special: `${universe.worldBoss} Omniverse Rupture`
    }
  }])
);

export const EXPANDED_GEAR = EXPANDED_UNIVERSES.flatMap(universe =>
  universe.gear.map(([id, enName, frName, boost], index) => ({
    id,
    universe: universe.universe,
    name: { en: enName, fr: frName },
    boost,
    cost: 100 + difficultyRank(universe) * 20 + index * 15
  }))
);

export const EXPANDED_EVENT_ITEMS = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => {
    const [id, enName, frName, enDesc, frDesc] = universe.event;
    return [universe.universe, {
      id,
      name: { en: enName, fr: frName },
      desc: { en: enDesc, fr: frDesc },
      effect: id.replace('evt_', '')
    }];
  })
);

export const EXPANDED_EXTRA_HERO_DATA = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [
    universe.universe,
    [universe.hero, ...universe.allies].map(makeCombatHero)
  ])
);

export const EXPANDED_DECOR_THEMES = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, universe.decor])
);

export const EXPANDED_MEDIA_FILTERS = [
  { id: 'music', label: { fr: 'MUSIQUE', en: 'MUSIC' } }
];

export const EXPANDED_EVENT_SHOP_ITEMS = EXPANDED_UNIVERSES.map(universe => {
  const [id, enName, frName] = universe.event;
  return {
    id,
    name: { en: enName, fr: frName },
    isCombatEvent: true,
    universe: universe.universe,
    tokenCost: 4 + Math.min(4, difficultyRank(universe))
  };
});

export const EXPANDED_STAGE_ACCENT_BY_UNIVERSE = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, colorPalette[universe.faction] || universe.decor.accent])
);
