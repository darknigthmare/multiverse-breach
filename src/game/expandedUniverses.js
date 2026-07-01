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
