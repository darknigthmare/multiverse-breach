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
  },
  {
    universe: 'Borderlands',
    mediaType: 'game',
    faction: 'sciFi',
    stageName: 'Pandora Vault Breach',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'The Destroyer Vault Maw',
    title: { en: 'Borderlands', fr: 'Borderlands' },
    desc: { en: 'Vault hunters, psycho raids, cel-shaded guns, and Pandora chaos spill into the Nexus.', fr: 'Chasseurs de l Arche, raids de psychos, armes cel-shadees et chaos de Pandore percent le Nexus.' },
    hero: { id: 'lilith_borderlands', name: 'Lilith', cat: 'hacker', color: '#b24cff' },
    allies: [{ id: 'mordecai_borderlands', name: 'Mordecai', cat: 'tactical', color: '#8b6b3f' }, { id: 'claptrap_borderlands', name: 'Claptrap', cat: 'hacker', color: '#f4c542' }],
    monsters: ['Psycho Raider', 'Skag Pack', 'Bandit Bruiser'],
    bosses: ['Nine-Toes Warlord', 'Handsome Jack Echo'],
    worldBoss: 'The Destroyer Vault Maw',
    gear: [['bl_vault_key', 'Vault Key Fragment', 'Fragment de cle de l Arche', { atk: 9, spd: 1 }], ['bl_eridian_cell', 'Eridian Cell', 'Cellule eridienne', { def: 5, hp: 70 }], ['bl_loot_scope', 'Loot Scope', 'Viseur a butin', { spd: 2, atk: 5 }]],
    event: ['evt_bl_lootsplosion', 'Lootsplosion Breach', 'Breche lootsplosion', 'A Pandora loot blast damages enemies and raises shard drops.', 'Une explosion de butin de Pandore blesse les ennemis et augmente les eclats.'],
    decor: { sky: ['#39200f', '#090402'], floor: 'rgba(206, 114, 43, 0.18)', grid: 'rgba(255, 216, 83, 0.28)', motif: 'wasteland', accent: '#ffd853' }
  },
  {
    universe: 'VelociPastor',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Parish Raptor Confession',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'VelociPastor Dino Form',
    title: { en: 'VelociPastor', fr: 'VelociPastor' },
    desc: { en: 'A low-budget sacred mutation turns faith, claws, and absurd monster cinema into a breach signature.', fr: 'Une mutation sacree de serie B melange foi, griffes et cinema absurde en signature de breche.' },
    hero: { id: 'doug_velocipastor', name: 'Doug Jones Pastor', cat: 'horror', color: '#6c8a4b' },
    allies: [{ id: 'carol_velocipastor', name: 'Carol', cat: 'slayer', color: '#c45b5b' }, { id: 'frankie_velocipastor', name: 'Frankie Mermaid', cat: 'tactical', color: '#5c6f7f' }],
    monsters: ['Rubber Suit Raptor', 'Cult Ninja Acolyte', 'Confession Ghoul'],
    bosses: ['Dragon Warrior Monk', 'Possessed Parish Bell'],
    worldBoss: 'VelociPastor Dino Form',
    gear: [['vp_claw_rosary', 'Clawed Rosary', 'Rosaire griffe', { atk: 8, def: 3 }], ['vp_parish_coat', 'Parish Coat', 'Manteau de paroisse', { hp: 75 }], ['vp_ninja_script', 'Ninja Script Page', 'Page de script ninja', { spd: 2, atk: 4 }]],
    event: ['evt_vp_dino_sermon', 'Dino Sermon', 'Sermon raptor', 'The raptor sermon frightens enemies and boosts melee allies.', 'Le sermon raptor effraie les ennemis et renforce les allies de melee.'],
    decor: { sky: ['#24341d', '#050905'], floor: 'rgba(114, 86, 55, 0.18)', grid: 'rgba(153, 218, 91, 0.25)', motif: 'hauntedset', accent: '#99da5b' }
  },
  {
    universe: 'Rubber',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Desert Tire Psychokinesis',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Robert the Killer Tire',
    title: { en: 'Rubber', fr: 'Rubber le pneu killer' },
    desc: { en: 'A sentient tire rolls through desert absurdity, exploding heads by pure psychokinetic nonsense.', fr: 'Un pneu conscient traverse le desert absurde et fait exploser les cibles par psychokinese.' },
    hero: { id: 'robert_rubber', name: 'Robert Tire', cat: 'hacker', color: '#1b1b1b' },
    allies: [{ id: 'sheriff_rubber', name: 'Rubber Sheriff', cat: 'tactical', color: '#8c6f45' }, { id: 'spectator_rubber', name: 'Desert Spectator', cat: 'horror', color: '#c9b27a' }],
    monsters: ['Desert Bottle Target', 'Spectator Drone', 'Motel Patrol'],
    bosses: ['Psychic Tire Swarm', 'Fourth Wall Sheriff'],
    worldBoss: 'Robert the Killer Tire',
    gear: [['rubber_tread', 'Psychic Tire Tread', 'Bande de pneu psychique', { atk: 9 }], ['rubber_binoculars', 'Spectator Binoculars', 'Jumelles de spectateur', { spd: 2, def: 3 }], ['rubber_desert_dust', 'Desert Dust Loop', 'Boucle de poussiere', { hp: 60, def: 4 }]],
    event: ['evt_rubber_no_reason', 'No Reason Detonation', 'Explosion sans raison', 'A no-reason psychic pulse hits the strongest enemy.', 'Une onde psychique sans raison frappe l ennemi le plus fort.'],
    decor: { sky: ['#3b2a18', '#090503'], floor: 'rgba(194, 141, 70, 0.2)', grid: 'rgba(255, 216, 130, 0.26)', motif: 'wasteland', accent: '#ffd882' }
  },
  {
    universe: 'From',
    mediaType: 'series',
    faction: 'horror',
    stageName: 'Town That Does Not Let Go',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Smiling Night Entity',
    title: { en: 'From', fr: 'From' },
    desc: { en: 'A trapped town loops roads, talismans, radio static, and smiling night creatures into a survival breach.', fr: 'Une ville piege boucle routes, talismans, parasites radio et creatures souriantes en breche de survie.' },
    hero: { id: 'boyd_from', name: 'Boyd Stevens', cat: 'tactical', color: '#4f5d4f' },
    allies: [{ id: 'tabitha_from', name: 'Tabitha Matthews', cat: 'horror', color: '#8e6f55' }, { id: 'jade_from', name: 'Jade Herrera', cat: 'hacker', color: '#6f7f8f' }],
    monsters: ['Smiling Townwalker', 'Faraway Tree Echo', 'Cicada Nightmare'],
    bosses: ['Music Box Curse', 'Radio Tower Voice'],
    worldBoss: 'Smiling Night Entity',
    gear: [['from_talisman', 'Protection Talisman', 'Talisman de protection', { def: 8, hp: 45 }], ['from_radio', 'Broken Radio Tower Part', 'Piece de tour radio', { spd: 1, atk: 6 }], ['from_map_pin', 'Impossible Road Pin', 'Repere de route impossible', { hp: 70 }]],
    event: ['evt_from_talisman_ring', 'Talisman Night Lock', 'Verrou nocturne talisman', 'Talismans seal the squad and reduce incoming horror damage.', 'Les talismans scellent l escouade et reduisent les degats d horreur.'],
    decor: { sky: ['#1a2420', '#030504'], floor: 'rgba(88, 106, 82, 0.17)', grid: 'rgba(220, 200, 140, 0.22)', motif: 'hauntedset', accent: '#dcc88c' }
  },
  {
    universe: 'Uzumaki',
    mediaType: 'manga',
    faction: 'horror',
    stageName: 'Kurozu-cho Spiral Curse',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Spiral City Maw',
    title: { en: 'Uzumaki', fr: 'Uzumaki - Spirale' },
    desc: { en: 'Spiral obsession bends a coastal town into body horror, pattern madness, and impossible geometry.', fr: 'L obsession de la spirale tord une ville cotiere en body horror, folie de motif et geometrie impossible.' },
    hero: { id: 'kirie_uzumaki', name: 'Kirie Goshima', cat: 'horror', color: '#3d3d3d' },
    allies: [{ id: 'shuichi_uzumaki', name: 'Shuichi Saito', cat: 'hacker', color: '#6d6d6d' }, { id: 'azami_uzumaki', name: 'Azami Spiral Echo', cat: 'slayer', color: '#2f2f2f' }],
    monsters: ['Spiral Snail Student', 'Twisted Hair Storm', 'Cremation Smoke Coil'],
    bosses: ['Azami Spiral Eye', 'Lighthouse Coil'],
    worldBoss: 'Spiral City Maw',
    gear: [['uzu_spiral_shell', 'Spiral Shell', 'Coquille spirale', { def: 6, atk: 4 }], ['uzu_black_notebook', 'Kurozu Notebook', 'Carnet de Kurozu', { spd: 2, hp: 40 }], ['uzu_coil_lantern', 'Coiled Lantern', 'Lanterne spiralee', { atk: 8 }]],
    event: ['evt_uzu_spiral_lock', 'Spiral Pattern Lock', 'Verrouillage spirale', 'A spiral curse traps enemies in looping movement.', 'Une malediction spirale enferme les ennemis dans une boucle.'],
    decor: { sky: ['#202020', '#050505'], floor: 'rgba(190, 190, 180, 0.12)', grid: 'rgba(230, 230, 220, 0.22)', motif: 'sigil', accent: '#d7d7cb' }
  },
  {
    universe: 'Toxic Avenger',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Tromaville Toxic Spill',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Toxic Waste Overlord',
    title: { en: 'The Toxic Avenger', fr: 'Toxic Avenger' },
    desc: { en: 'Tromaville mutates bullying, toxic sludge, mop justice, and gross-out heroism into a radioactive breach.', fr: 'Tromaville mute harcelement, dechets toxiques, justice au balai et heroisme crade en breche radioactive.' },
    hero: { id: 'toxie_avenger', name: 'Toxie', cat: 'slayer', color: '#6ee04f' },
    allies: [{ id: 'sara_toxic', name: 'Sara Tromaville', cat: 'tactical', color: '#d8c68a' }, { id: 'tromaville_cop', name: 'Tromaville Cop', cat: 'marine', color: '#4b6f7d' }],
    monsters: ['Toxic Thug', 'Sludge Mutant', 'Corporate Dump Guard'],
    bosses: ['Tromaville Bully Pack', 'Radiation Barrel Beast'],
    worldBoss: 'Toxic Waste Overlord',
    gear: [['toxie_mop', 'Radioactive Mop', 'Balai radioactif', { atk: 11 }], ['toxie_barrel', 'Toxic Barrel Chunk', 'Morceau de fut toxique', { hp: 80, def: 3 }], ['toxie_tutu', 'Tromaville Tutu Relic', 'Relique tutu Tromaville', { spd: 2, atk: 4 }]],
    event: ['evt_toxie_cleanup', 'Tromaville Cleanup', 'Nettoyage de Tromaville', 'Toxie splashes sludge that poisons enemies and buffs slayers.', 'Toxie projette de la boue qui empoisonne les ennemis et renforce les slayers.'],
    decor: { sky: ['#18351c', '#030703'], floor: 'rgba(88, 220, 65, 0.17)', grid: 'rgba(172, 255, 86, 0.3)', motif: 'facility', accent: '#acff56' }
  },
  {
    universe: 'Exit 8',
    mediaType: 'game',
    faction: 'horror',
    stageName: 'Endless Passage Anomaly',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Exit 8 Anomaly Loop',
    title: { en: 'Exit 8', fr: 'Exit 8' },
    desc: { en: 'A sterile underground corridor repeats until the smallest anomaly becomes a lethal rule.', fr: 'Un couloir souterrain sterile se repete jusqu a ce que la moindre anomalie devienne une regle mortelle.' },
    hero: { id: 'commuter_exit8', name: 'Lost Commuter', cat: 'tactical', color: '#d6d6c8' },
    allies: [{ id: 'sign_watcher_exit8', name: 'Sign Watcher', cat: 'hacker', color: '#f1c40f' }, { id: 'corridor_runner_exit8', name: 'Corridor Runner', cat: 'horror', color: '#9aa0a6' }],
    monsters: ['Wrong Poster Copy', 'Blinking Light Fault', 'Passing Man Echo'],
    bosses: ['Flooded Corridor', 'Impossible Signage'],
    worldBoss: 'Exit 8 Anomaly Loop',
    gear: [['exit8_sign', 'Exit Sign Shard', 'Eclat panneau sortie', { spd: 2, def: 4 }], ['exit8_tile', 'White Tile Sample', 'Carreau blanc', { def: 6, hp: 45 }], ['exit8_map', 'Loop Route Note', 'Note de boucle', { atk: 5, spd: 1 }]],
    event: ['evt_exit8_anomaly_check', 'Anomaly Check', 'Verification anomalie', 'The squad detects the wrong frame and resets enemy buffs.', 'L escouade detecte la mauvaise frame et reinitialise les buffs ennemis.'],
    decor: { sky: ['#202426', '#080909'], floor: 'rgba(220, 220, 210, 0.12)', grid: 'rgba(250, 230, 120, 0.24)', motif: 'facility', accent: '#fae678' }
  },
  {
    universe: 'Hell House LLC',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Abaddon Hotel Walkthrough',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Abaddon Clown Entity',
    title: { en: 'Hell House LLC', fr: 'Hell House LLC' },
    desc: { en: 'Found footage corridors, cursed hotel rooms, and motionless clown props turn into a haunted attraction breach.', fr: 'Couloirs found footage, chambres maudites et clowns immobiles deviennent une breche d attraction hantee.' },
    hero: { id: 'alex_hellhouse', name: 'Alex Taylor', cat: 'tactical', color: '#8b8b7a' },
    allies: [{ id: 'sara_hellhouse', name: 'Sara Havel', cat: 'horror', color: '#b08a7a' }, { id: 'paul_hellhouse', name: 'Paul Camera Lead', cat: 'hacker', color: '#4f5f66' }],
    monsters: ['Basement Clown Prop', 'Hotel Door Knocker', 'Found Footage Static'],
    bosses: ['Abaddon Priest Shade', 'Stairwell Camera Trap'],
    worldBoss: 'Abaddon Clown Entity',
    gear: [['hhllc_camera', 'Found Footage Camera', 'Camera found footage', { spd: 2, atk: 4 }], ['hhllc_key', 'Abaddon Room Key', 'Cle de chambre Abaddon', { def: 6 }], ['hhllc_clown_mask', 'Clown Prop Mask', 'Masque accessoire clown', { atk: 8 }]],
    event: ['evt_hhllc_static', 'Basement Static Cut', 'Coupure statique cave', 'The camera feed cuts and fear-locks enemy actions.', 'Le flux camera coupe et verrouille les actions ennemies par la peur.'],
    decor: { sky: ['#221614', '#050202'], floor: 'rgba(120, 76, 58, 0.16)', grid: 'rgba(229, 80, 65, 0.26)', motif: 'hauntedset', accent: '#e55041' }
  },
  {
    universe: 'Sausage Party',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Shopwell Great Beyond Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Great Beyond Kitchen Grinder',
    title: { en: 'Sausage Party', fr: 'Sausage Party' },
    desc: { en: 'Animated food panic reframes supermarket faith, kitchen horror, and absurd rebellion as a Nexus food-war.', fr: 'La panique alimentaire animee transforme foi de supermarche, horreur de cuisine et rebellion absurde en guerre du Nexus.' },
    hero: { id: 'frank_sausage', name: 'Frank', cat: 'slayer', color: '#c0392b' },
    allies: [{ id: 'brenda_bun', name: 'Brenda Bunson', cat: 'tactical', color: '#d9a45f' }, { id: 'barry_sausage', name: 'Barry', cat: 'hacker', color: '#b83c35' }],
    monsters: ['Panicked Grocery Mob', 'Kitchen Knife Drone', 'Shopping Cart Rammer'],
    bosses: ['Douche Warlord', 'Freezer Aisle Cult'],
    worldBoss: 'Great Beyond Kitchen Grinder',
    gear: [['sp_mustard', 'Sacred Mustard', 'Moutarde sacree', { atk: 6, spd: 2 }], ['sp_cartwheel', 'Cart Wheel Shield', 'Roue de caddie', { def: 6, hp: 40 }], ['sp_wrapper', 'Lucky Wrapper', 'Emballage porte-bonheur', { hp: 70 }]],
    event: ['evt_sp_food_riot', 'Food Riot', 'Emeute alimentaire', 'Food rebels swarm the field and interrupt enemy attacks.', 'Les rebelles alimentaires envahissent le terrain et interrompent les attaques.'],
    decor: { sky: ['#2c1d26', '#070305'], floor: 'rgba(230, 151, 64, 0.18)', grid: 'rgba(255, 220, 115, 0.28)', motif: 'cinema', accent: '#ffdc73' }
  },
  {
    universe: 'Spermageddon',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Body Odyssey Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Biology Musical Apocalypse',
    title: { en: 'Spermageddon', fr: 'Spermageddon' },
    desc: { en: 'A crude animated body-odyssey musical becomes a surreal inner-world breach of cells, songs, and chaos.', fr: 'Une odyssee corporelle animee et crue devient une breche interne de cellules, chansons et chaos.' },
    hero: { id: 'simen_spermageddon', name: 'Simen', cat: 'hacker', color: '#e6e6ff' },
    allies: [{ id: 'cumilla_spermageddon', name: 'Cumilla', cat: 'tactical', color: '#ff8fb3' }, { id: 'body_guard_cell', name: 'Body Guard Cell', cat: 'marine', color: '#75d5ff' }],
    monsters: ['Hormone Gremlin', 'Body Cell Patrol', 'Awkward Musical Note'],
    bosses: ['Contraception Gatekeeper', 'Cringe Chorus Beast'],
    worldBoss: 'Biology Musical Apocalypse',
    gear: [['sperm_mic', 'Tiny Musical Mic', 'Micro miniature', { spd: 2, atk: 4 }], ['sperm_cell_map', 'Body Route Map', 'Carte du corps', { def: 4, hp: 60 }], ['sperm_rhythm', 'Awkward Rhythm Core', 'Noyau rythme genant', { atk: 8 }]],
    event: ['evt_sperm_musical_surge', 'Awkward Musical Surge', 'Montee musicale genante', 'A surreal chorus scrambles enemy timing.', 'Un choeur surrealiste brouille le timing ennemi.'],
    decor: { sky: ['#2b1a33', '#060208'], floor: 'rgba(255, 143, 179, 0.14)', grid: 'rgba(117, 213, 255, 0.24)', motif: 'speaker', accent: '#75d5ff' }
  },
  {
    universe: 'Spy x Family',
    mediaType: 'manga',
    faction: 'cyber',
    stageName: 'Berlint Operation Strix',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Operation Strix Collapse',
    title: { en: 'Spy x Family', fr: 'Spy x Family' },
    desc: { en: 'Espionage, assassination, telepathy, and found-family secrets become a precision tactical breach.', fr: 'Espionnage, assassinat, telepathie et famille improvisee deviennent une breche tactique de precision.' },
    hero: { id: 'loid_forger', name: 'Loid Forger', cat: 'tactical', color: '#6f8f78' },
    allies: [{ id: 'yor_forger', name: 'Yor Forger', cat: 'slayer', color: '#111111' }, { id: 'anya_forger', name: 'Anya Forger', cat: 'hacker', color: '#ff9fbd' }],
    monsters: ['Ostania Agent', 'Eden Hall Bully', 'Secret Police Tail'],
    bosses: ['Garden Assassin Cell', 'Desmond Security Wall'],
    worldBoss: 'Operation Strix Collapse',
    gear: [['sxf_bond_tag', 'Bond Mission Tag', 'Medaille mission Bond', { spd: 2, hp: 45 }], ['sxf_thorn_pin', 'Thorn Princess Pin', 'Epingle Princesse Epine', { atk: 10 }], ['sxf_spy_watch', 'Twilight Spy Watch', 'Montre espion Twilight', { def: 5, atk: 4 }]],
    event: ['evt_sxf_mind_read', 'Telepathic Read', 'Lecture telepathique', 'Anya reads enemy intent and boosts dodge timing.', 'Anya lit les intentions ennemies et ameliore l esquive.'],
    decor: { sky: ['#1f2f28', '#030605'], floor: 'rgba(154, 126, 86, 0.16)', grid: 'rgba(255, 159, 189, 0.24)', motif: 'arcanecity', accent: '#ff9fbd' }
  },
  {
    universe: 'Terrifier',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Miles County Clown Night',
    mode: 'Smash',
    difficulty: 'Very Hard',
    bossName: 'Art the Clown Nightmare',
    title: { en: 'Terrifier', fr: 'Terrifier' },
    desc: { en: 'Silent slasher cruelty, grimy alleys, and clown-mime nightmare logic tear into the Nexus.', fr: 'Cruaute slasher muette, ruelles sales et logique de clown cauchemar dechirent le Nexus.' },
    hero: { id: 'sienna_terrifier', name: 'Sienna Shaw', cat: 'slayer', color: '#d8c17f' },
    allies: [{ id: 'victoria_terrifier', name: 'Victoria Heyes', cat: 'horror', color: '#7d7d7d' }, { id: 'jonathan_terrifier', name: 'Jonathan Shaw', cat: 'tactical', color: '#55606b' }],
    monsters: ['Clown Mime Shade', 'Miles County Maniac', 'Black Bag Prop'],
    bosses: ['Little Pale Girl Echo', 'Halloween Alley Trap'],
    worldBoss: 'Art the Clown Nightmare',
    gear: [['terrifier_sword', 'Valkyrie Sword', 'Epee valkyrie', { atk: 11, def: 3 }], ['terrifier_wings', 'Homemade Armor Wings', 'Ailes armure maison', { def: 7, hp: 45 }], ['terrifier_horn', 'Silent Horn', 'Klaxon muet', { spd: 2, atk: 4 }]],
    event: ['evt_terrifier_final_girl', 'Final Girl Stand', 'Derniere survivante', 'Sienna anchors the squad and counters the next lethal hit.', 'Sienna ancre l escouade et contre le prochain coup lethal.'],
    decor: { sky: ['#230b0b', '#030000'], floor: 'rgba(120, 20, 20, 0.18)', grid: 'rgba(255, 245, 210, 0.22)', motif: 'hauntedset', accent: '#fff5d2' }
  },
  {
    universe: 'Zak et Crysta',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'FernGully Hexxus Breach',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Hexxus Pollution Spirit',
    title: { en: 'FernGully', fr: 'Zak et Crysta' },
    desc: { en: 'Rainforest magic, fairy scale, pollution spirits, and ecological wonder bloom inside the Nexus.', fr: 'Magie de foret, echelle de fee, esprits de pollution et merveille ecologique fleurissent dans le Nexus.' },
    hero: { id: 'crysta_ferngully', name: 'Crysta', cat: 'hacker', color: '#65d56e' },
    allies: [{ id: 'zak_ferngully', name: 'Zak', cat: 'tactical', color: '#4f9ed8' }, { id: 'batty_ferngully', name: 'Batty Koda', cat: 'slayer', color: '#7b5b9e' }],
    monsters: ['Pollution Sludge', 'Logging Machine Drone', 'Smoke Imp'],
    bosses: ['Leveler Harvester', 'Oil Pit Hexxus'],
    worldBoss: 'Hexxus Pollution Spirit',
    gear: [['fg_seed', 'Rainforest Seed', 'Graine de foret', { hp: 85 }], ['fg_fairy_dust', 'Fairy Dust Bloom', 'Poussiere fee', { spd: 2, def: 4 }], ['fg_batty_wire', 'Batty Antenna Wire', 'Fil antenne Batty', { atk: 6, spd: 1 }]],
    event: ['evt_fg_regrowth', 'FernGully Regrowth', 'Repousse FernGully', 'Living roots heal allies and bind machines.', 'Les racines vivantes soignent les allies et entravent les machines.'],
    decor: { sky: ['#11351e', '#020703'], floor: 'rgba(72, 190, 82, 0.18)', grid: 'rgba(154, 255, 132, 0.28)', motif: 'forest', accent: '#9aff84' }
  },
  {
    universe: 'Richard au pays des livres magiques',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Pagemaster Library Breach',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Library Storm Dragon',
    title: { en: 'The Pagemaster', fr: 'Richard au pays des livres magiques' },
    desc: { en: 'Books become worlds: adventure, fantasy, horror, and library storms fold into a readable Nexus breach.', fr: 'Les livres deviennent des mondes: aventure, fantasy, horreur et tempetes de bibliotheque se plient dans le Nexus.' },
    hero: { id: 'richard_pagemaster', name: 'Richard Tyler', cat: 'tactical', color: '#496da8' },
    allies: [{ id: 'adventure_book', name: 'Adventure', cat: 'slayer', color: '#c47b35' }, { id: 'fantasy_book', name: 'Fantasy', cat: 'hacker', color: '#b44cc4' }],
    monsters: ['Ink Pirate', 'Library Bat Swarm', 'Book Golem'],
    bosses: ['Horror Book Phantom', 'Pagemaster Trial'],
    worldBoss: 'Library Storm Dragon',
    gear: [['page_card', 'Library Card Relic', 'Carte de bibliotheque', { spd: 2, def: 4 }], ['page_bookmark', 'Magic Bookmark', 'Marque-page magique', { atk: 6, hp: 45 }], ['page_ink', 'Living Ink Bottle', 'Encre vivante', { atk: 8 }]],
    event: ['evt_page_story_shift', 'Story Shift', 'Changement de recit', 'The battlefield flips genre and weakens enemy resistances.', 'Le champ change de genre et affaiblit les resistances ennemies.'],
    decor: { sky: ['#2a1f3a', '#06030a'], floor: 'rgba(150, 98, 58, 0.18)', grid: 'rgba(216, 186, 110, 0.28)', motif: 'library', accent: '#d8ba6e' }
  },
  {
    universe: 'Les Visiteurs du Futur',
    mediaType: 'series',
    faction: 'sciFi',
    stageName: 'Temporal Brigade Breach',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Time Paradox Reactor',
    title: { en: 'The Visitors from the Future', fr: 'Les Visiteurs du Futur' },
    desc: { en: 'French temporal chaos turns apocalypse prevention, paradoxes, and bricolage sci-fi into a breach.', fr: 'Le chaos temporel francais transforme prevention d apocalypse, paradoxes et SF bricolee en breche.' },
    hero: { id: 'visiteur_futur', name: 'Le Visiteur', cat: 'hacker', color: '#4aa3df' },
    allies: [{ id: 'raph_visiteur', name: 'Raph', cat: 'tactical', color: '#657786' }, { id: 'constance_visiteur', name: 'Constance', cat: 'marine', color: '#b0835a' }],
    monsters: ['Temporal Cop', 'Paradox Duplicate', 'Future Ruin Drone'],
    bosses: ['Missionnaires Cell', 'Brigade Temporelle Lock'],
    worldBoss: 'Time Paradox Reactor',
    gear: [['vdf_beacon', 'Temporal Beacon', 'Balise temporelle', { spd: 2, atk: 4 }], ['vdf_coat', 'Visitor Coat', 'Manteau du Visiteur', { def: 5, hp: 55 }], ['vdf_paradox_note', 'Paradox Note', 'Note paradoxe', { atk: 7 }]],
    event: ['evt_vdf_reset', 'Timeline Correction', 'Correction temporelle', 'A future warning rewinds the last enemy buff.', 'Un avertissement du futur rembobine le dernier buff ennemi.'],
    decor: { sky: ['#152532', '#030609'], floor: 'rgba(78, 140, 180, 0.16)', grid: 'rgba(85, 220, 255, 0.26)', motif: 'code', accent: '#55dcff' }
  },
  {
    universe: 'Tenacious D',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Pick of Destiny Riff Rift',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Rock Demon Showdown',
    title: { en: 'Tenacious D and the Pick of Destiny', fr: 'Tenacious D and the Pick of Destiny' },
    desc: { en: 'Rock mythology, absurd quests, demon riffs, and the Pick turn stage noise into weaponized resonance.', fr: 'Mythologie rock, quetes absurdes, riffs demoniaques et Mediator changent le bruit de scene en resonance armee.' },
    hero: { id: 'jb_tenacious', name: 'JB', cat: 'slayer', color: '#2c2c2c' },
    allies: [{ id: 'kg_tenacious', name: 'KG', cat: 'hacker', color: '#7d4f2a' }, { id: 'lee_tenacious', name: 'Lee Superfan', cat: 'tactical', color: '#9b8b54' }],
    monsters: ['Open Mic Heckler', 'Rock Cult Roadie', 'Demon Groupie'],
    bosses: ['Sasquatch Jam Spirit', 'Pick Guardian'],
    worldBoss: 'Rock Demon Showdown',
    gear: [['td_pick', 'Pick of Destiny Chip', 'Eclat du Mediator du Destin', { atk: 11 }], ['td_guitar', 'Acoustic Battle Guitar', 'Guitare acoustique de combat', { atk: 7, spd: 1 }], ['td_stage_pass', 'Backstage Pass', 'Pass backstage', { hp: 65, def: 3 }]],
    event: ['evt_td_master_exploder', 'Master Exploder Riff', 'Riff Master Exploder', 'A legendary riff blasts the lane and boosts music personas.', 'Un riff legendaire explose la ligne et renforce les personas musicales.'],
    decor: { sky: ['#2b0f0f', '#060101'], floor: 'rgba(190, 54, 34, 0.18)', grid: 'rgba(255, 196, 64, 0.3)', motif: 'speaker', accent: '#ffc440' }
  },
  {
    universe: 'M3GAN',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Funki AI Nursery',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'M3GAN Override Doll',
    title: { en: 'M3GAN', fr: 'M3GAN' },
    desc: { en: 'A companion AI doll turns childcare, robotics, and uncanny loyalty into a cyber-horror breach.', fr: 'Une poupee IA de compagnie transforme garde d enfant, robotique et loyauté inquietante en breche cyber-horreur.' },
    hero: { id: 'gemma_m3gan', name: 'Gemma', cat: 'hacker', color: '#8ca4b8' },
    allies: [{ id: 'cady_m3gan', name: 'Cady', cat: 'tactical', color: '#d8b88f' }, { id: 'bruce_robot', name: 'Bruce Robot', cat: 'marine', color: '#59616a' }],
    monsters: ['Toy Drone Prototype', 'Smart Home Lock', 'Companion Doll Copy'],
    bosses: ['Funki Lab Defense', 'M3GAN Dance Protocol'],
    worldBoss: 'M3GAN Override Doll',
    gear: [['m3gan_chip', 'Companion AI Chip', 'Puce IA compagne', { spd: 2, atk: 5 }], ['m3gan_tablet', 'Paired Tablet', 'Tablette liee', { def: 4, hp: 55 }], ['m3gan_voice', 'Voice Command Core', 'Noyau commande vocale', { atk: 8 }]],
    event: ['evt_m3gan_pairing', 'Protective Pairing', 'Appairage protecteur', 'The AI intercepts a hit, then counter-hacks the attacker.', 'L IA intercepte un coup puis contre-pirate l attaquant.'],
    decor: { sky: ['#16212b', '#030609'], floor: 'rgba(140, 164, 184, 0.16)', grid: 'rgba(91, 255, 225, 0.26)', motif: 'code', accent: '#5bffe1' }
  },
  {
    universe: 'Camera Cafe',
    mediaType: 'series',
    faction: 'cyber',
    stageName: 'Office Coffee Machine Loop',
    mode: 'Tactics',
    difficulty: 'Medium',
    bossName: 'Corporate Coffee Machine Core',
    title: { en: 'Camera Cafe', fr: 'Camera Cafe' },
    desc: { en: 'French office absurdity compresses gossip, hierarchy, and coffee-machine static into workplace combat.', fr: 'L absurde de bureau francais compresse ragots, hierarchie et parasites de machine a cafe en combat professionnel.' },
    hero: { id: 'jean_claude_camera', name: 'Jean-Claude Convenant', cat: 'tactical', color: '#5f6f7f' },
    allies: [{ id: 'herve_camera', name: 'Herve Dumont', cat: 'hacker', color: '#8a7a63' }, { id: 'maeva_camera', name: 'Maeva Capucin', cat: 'marine', color: '#b88b8b' }],
    monsters: ['HR Memo Drone', 'Broken Copier', 'Coffee Queue Rival'],
    bosses: ['Open Space Rumor Swarm', 'Director Office Lock'],
    worldBoss: 'Corporate Coffee Machine Core',
    gear: [['cc_mug', 'Office Mug', 'Mug de bureau', { hp: 70 }], ['cc_badge', 'Access Badge', 'Badge acces', { spd: 1, def: 5 }], ['cc_memo', 'Aggressive Memo', 'Note agressive', { atk: 7 }]],
    event: ['evt_cc_pause_cafe', 'Pause Cafe Ambush', 'Embuscade pause cafe', 'Office gossip distracts enemies and gives the team tempo.', 'Les ragots de bureau distraient les ennemis et donnent du tempo.'],
    decor: { sky: ['#20282f', '#050708'], floor: 'rgba(160, 135, 100, 0.16)', grid: 'rgba(200, 220, 230, 0.22)', motif: 'facility', accent: '#c8dce6' }
  },
  {
    universe: 'Samantha Oups!',
    mediaType: 'series',
    faction: 'arcane',
    stageName: 'Appartement Oups Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Oups Catastrophe Loop',
    title: { en: 'Samantha Oups!', fr: 'Samantha Oups!' },
    desc: { en: 'French sketch chaos turns domestic accidents, loud misunderstandings, and friendship panic into a comedy breach.', fr: 'Le chaos de sketch francais transforme accidents domestiques, malentendus bruyants et panique amicale en breche comique.' },
    hero: { id: 'samantha_oups', name: 'Samantha', cat: 'hacker', color: '#ff8fbd' },
    allies: [{ id: 'chantal_oups', name: 'Chantal', cat: 'tactical', color: '#8fd3ff' }, { id: 'voisine_oups', name: 'Voisine Oups', cat: 'horror', color: '#d6c278' }],
    monsters: ['Falling Shelf', 'Misheard Order', 'Apartment Prop Swarm'],
    bosses: ['Neighbor Complaint Wave', 'Kitchen Disaster'],
    worldBoss: 'Oups Catastrophe Loop',
    gear: [['oups_phone', 'Misunderstood Phone', 'Telephone mal compris', { spd: 2, atk: 4 }], ['oups_apron', 'Chaos Apron', 'Tablier chaos', { hp: 70 }], ['oups_keys', 'Lost Keys', 'Cles perdues', { def: 4, spd: 1 }]],
    event: ['evt_oups_confusion', 'Oups Confusion', 'Confusion Oups', 'A comedy misunderstanding scrambles enemy targeting.', 'Un malentendu comique brouille le ciblage ennemi.'],
    decor: { sky: ['#2f2130', '#070408'], floor: 'rgba(255, 143, 189, 0.15)', grid: 'rgba(143, 211, 255, 0.24)', motif: 'cinema', accent: '#8fd3ff' }
  },
  {
    universe: 'Les Chevaliers du Fiel',
    mediaType: 'series',
    faction: 'arcane',
    stageName: 'Municipaux Town Hall Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Municipal Paperwork Titan',
    title: { en: 'Les Chevaliers du Fiel - Les Municipaux', fr: 'Les Chevaliers du Fiel - Les Municipaux' },
    desc: { en: 'Municipal comedy turns paperwork, local authority, and exaggerated laziness into a bureaucratic breach.', fr: 'La comedie municipale transforme paperasse, autorite locale et flemme exageree en breche bureaucratique.' },
    hero: { id: 'municipal_agent_fiel', name: 'Agent Municipal', cat: 'tactical', color: '#4f6f4f' },
    allies: [{ id: 'brigadier_fiel', name: 'Brigadier Municipal', cat: 'marine', color: '#6b7d5f' }, { id: 'mairie_fiel', name: 'Mairie Clerk', cat: 'hacker', color: '#c7b37a' }],
    monsters: ['Paperwork Stack', 'Town Hall Queue', 'Broken Service Van'],
    bosses: ['Overtime Refusal', 'Mayor Complaint Desk'],
    worldBoss: 'Municipal Paperwork Titan',
    gear: [['fiel_stamp', 'Municipal Stamp', 'Tampon municipal', { atk: 6, def: 4 }], ['fiel_vest', 'Service Vest', 'Gilet de service', { hp: 70 }], ['fiel_clipboard', 'Inspection Clipboard', 'Planchette inspection', { spd: 1, def: 5 }]],
    event: ['evt_fiel_arrete', 'Municipal Decree', 'Arrete municipal', 'A town decree slows all enemies and raises defense.', 'Un arrete ralentit tous les ennemis et augmente la defense.'],
    decor: { sky: ['#242b22', '#050705'], floor: 'rgba(150, 132, 76, 0.15)', grid: 'rgba(210, 200, 120, 0.24)', motif: 'arcanecity', accent: '#d2c878' }
  },
  {
    universe: 'Noelle Perna',
    mediaType: 'series',
    faction: 'arcane',
    stageName: 'Mado Nice Comedy Rift',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Mado Monologue Storm',
    title: { en: 'Noelle Perna', fr: 'Noelle Perna' },
    desc: { en: 'Southern French stage comedy and Mado s verbal tornado become a resonance persona breach.', fr: 'La scene comique du Sud et la tornade verbale de Mado deviennent une breche de persona de resonance.' },
    hero: { id: 'mado_perna', name: 'Mado la Nicoise', cat: 'hacker', color: '#e36b8f' },
    allies: [{ id: 'cafe_nice_regular', name: 'Cafe de Nice Regular', cat: 'tactical', color: '#c89b5a' }, { id: 'theater_stagehand', name: 'Theater Stagehand', cat: 'marine', color: '#5c6470' }],
    monsters: ['Heckler Echo', 'Stage Light Gremlin', 'Gossip Cyclone'],
    bosses: ['One-Woman-Show Spotlight', 'Nice Cafe Rumor'],
    worldBoss: 'Mado Monologue Storm',
    gear: [['perna_scarf', 'Mado Scarf', 'Foulard de Mado', { spd: 2, hp: 45 }], ['perna_mic', 'Stage Mic', 'Micro de scene', { atk: 8 }], ['perna_ticket', 'Comedy Ticket', 'Billet de spectacle', { def: 4, hp: 45 }]],
    event: ['evt_perna_tirade', 'Nicoise Tirade', 'Tirade nicoise', 'A relentless monologue interrupts enemy casts.', 'Une tirade intarissable interrompt les incantations ennemies.'],
    decor: { sky: ['#2c1d2b', '#070407'], floor: 'rgba(227, 107, 143, 0.15)', grid: 'rgba(255, 206, 118, 0.26)', motif: 'speaker', accent: '#ffce76' }
  },
  {
    universe: 'War of the Worlds',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Tripod Red Weed Invasion',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Martian Tripod Harvester',
    title: { en: 'War of the Worlds', fr: 'War of the Worlds - Steven Spielberg' },
    desc: { en: 'Spielberg s invasion collapses panic, red weed, EMP storms, and towering tripods into survival sci-fi.', fr: 'L invasion de Spielberg condense panique, herbe rouge, tempetes EMP et tripodes geants en survie SF.' },
    hero: { id: 'ray_wotw', name: 'Ray Ferrier', cat: 'tactical', color: '#4a5960' },
    allies: [{ id: 'rachel_wotw', name: 'Rachel Ferrier', cat: 'horror', color: '#b6a08c' }, { id: 'robbie_wotw', name: 'Robbie Ferrier', cat: 'marine', color: '#6b6f72' }],
    monsters: ['Red Weed Tendril', 'Tripod Probe Eye', 'Refugee Panic Echo'],
    bosses: ['Basement Probe Sweep', 'EMP Street Collapse'],
    worldBoss: 'Martian Tripod Harvester',
    gear: [['wotw_fuse', 'Dead Fuse Box', 'Boitier fusible mort', { def: 5, hp: 55 }], ['wotw_tripod_eye', 'Tripod Lens Shard', 'Eclat lentille tripod', { atk: 9 }], ['wotw_redweed', 'Red Weed Sample', 'Echantillon herbe rouge', { hp: 80 }]],
    event: ['evt_wotw_emp', 'EMP Skyfall', 'Chute EMP', 'Tripod interference disables enemy tech for one beat.', 'Les interferences tripodes coupent la technologie ennemie un instant.'],
    decor: { sky: ['#1d2428', '#030405'], floor: 'rgba(130, 30, 30, 0.18)', grid: 'rgba(118, 205, 255, 0.24)', motif: 'wasteland', accent: '#76cdff' }
  },
  {
    universe: 'Ghostbusters',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'New York Containment Breach',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Gozer Dimension Gate',
    title: { en: 'Ghostbusters', fr: 'Ghostbusters' },
    desc: { en: 'Proton packs, ghost traps, ectoplasm, and New York hauntings cross the streams into the Nexus.', fr: 'Packs a protons, pieges fantomes, ectoplasme et hantises new-yorkaises croisent les effluves dans le Nexus.' },
    hero: { id: 'venkman_gb', name: 'Peter Venkman', cat: 'hacker', color: '#b8a77a' },
    allies: [{ id: 'stantz_gb', name: 'Ray Stantz', cat: 'tactical', color: '#d9c58f' }, { id: 'zeddemore_gb', name: 'Winston Zeddemore', cat: 'marine', color: '#a8905f' }],
    monsters: ['Class Five Free-Roamer', 'Slimer Ectoplasm', 'Library Ghost'],
    bosses: ['Terror Dog Sentinel', 'Stay Puft Manifestation'],
    worldBoss: 'Gozer Dimension Gate',
    gear: [['gb_proton', 'Proton Pack Coil', 'Bobine pack proton', { atk: 10 }], ['gb_trap', 'Ghost Trap', 'Piege fantome', { def: 6, spd: 1 }], ['gb_meter', 'PKE Meter', 'Detecteur PKE', { spd: 2, hp: 35 }]],
    event: ['evt_gb_cross_streams', 'Cross the Streams', 'Croiser les effluves', 'A proton convergence damages ghosts and seals summons.', 'Une convergence protonique blesse les spectres et scelle les invocations.'],
    decor: { sky: ['#1b2730', '#030507'], floor: 'rgba(120, 210, 150, 0.14)', grid: 'rgba(100, 255, 160, 0.28)', motif: 'arcanecity', accent: '#64ffa0' }
  },
  {
    universe: 'Onechanbara',
    mediaType: 'game',
    faction: 'horror',
    stageName: 'Zombie Bikini Blade Arena',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Blood Mist Zombie Queen',
    title: { en: 'Onechanbara', fr: 'Onechanbara' },
    desc: { en: 'Zombie crowds, katana dances, blood rage, and exploitation-horror arcade combat hit the Nexus.', fr: 'Foules zombies, danses au katana, rage sanglante et arcade exploitation-horror frappent le Nexus.' },
    hero: { id: 'aya_onechanbara', name: 'Aya', cat: 'slayer', color: '#c0392b' },
    allies: [{ id: 'saki_onechanbara', name: 'Saki', cat: 'slayer', color: '#6c4aa3' }, { id: 'reiko_onechanbara', name: 'Reiko', cat: 'marine', color: '#4d5f6f' }],
    monsters: ['Arena Zombie', 'Blood Mist Ghoul', 'Chainsaw Corpse'],
    bosses: ['Mutant Zombie Sister', 'Cursed Katana Duelist'],
    worldBoss: 'Blood Mist Zombie Queen',
    gear: [['one_katana', 'Blood Katana', 'Katana sanglant', { atk: 11 }], ['one_charm', 'Anti-Zombie Charm', 'Charme anti-zombie', { def: 5, hp: 45 }], ['one_scabbard', 'Quickdraw Scabbard', 'Fourreau degainage', { spd: 2, atk: 4 }]],
    event: ['evt_one_blood_rage', 'Blood Rage Combo', 'Combo rage sanglante', 'A katana rush hits all enemies and boosts slayers.', 'Une ruee de katana touche tous les ennemis et renforce les slayers.'],
    decor: { sky: ['#2c0810', '#050101'], floor: 'rgba(190, 25, 45, 0.2)', grid: 'rgba(255, 180, 100, 0.24)', motif: 'arena', accent: '#ffb464' }
  },
  {
    universe: 'Kung Pow',
    mediaType: 'movie',
    faction: 'arcane',
    stageName: 'Chosen One Dub Breach',
    mode: 'Smash',
    difficulty: 'Medium',
    bossName: 'Master Pain Betty',
    title: { en: 'Kung Pow', fr: 'Kung Pow' },
    desc: { en: 'Absurd martial arts dubbing, impossible training, and joke-fu bend combat timing into parody resonance.', fr: 'Doublage martial absurde, entrainement impossible et joke-fu tordent le timing du combat en resonance parodique.' },
    hero: { id: 'chosen_one_kungpow', name: 'The Chosen One', cat: 'slayer', color: '#d6c09a' },
    allies: [{ id: 'woah_kungpow', name: 'Master Tang', cat: 'hacker', color: '#9d6f45' }, { id: 'ling_kungpow', name: 'Ling', cat: 'tactical', color: '#b85f6d' }],
    monsters: ['Bad Dub Fighter', 'Training Dummy Cow', 'Evil Council Grunt'],
    bosses: ['Moo Nieu Beast', 'Betty Disciple'],
    worldBoss: 'Master Pain Betty',
    gear: [['kp_tongue', 'Chosen Tongue Scar', 'Cicatrice langue choisie', { atk: 7, spd: 1 }], ['kp_bowl', 'Training Bowl', 'Bol entrainement', { def: 5, hp: 55 }], ['kp_dub_scroll', 'Bad Dub Scroll', 'Parchemin mauvais doublage', { atk: 8 }]],
    event: ['evt_kp_weeooweeoo', 'Wee-Oo Timing Break', 'Rupture Wee-Oo', 'A dubbed timing break makes enemies miss their next action.', 'Une rupture de timing double fait rater la prochaine action ennemie.'],
    decor: { sky: ['#2d2414', '#070503'], floor: 'rgba(190, 142, 71, 0.18)', grid: 'rgba(255, 212, 115, 0.26)', motif: 'arena', accent: '#ffd473' }
  },
  {
    universe: 'Despicer',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Hell Maze Despicer Rift',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Despicer Hell Warden',
    title: { en: 'Despiser', fr: 'Despicer' },
    desc: { en: 'A surreal low-budget afterlife war twists purgatory roads, demons, and lost souls into a hell breach.', fr: 'Une guerre d apres-vie surrealiste tord routes de purgatoire, demons et ames perdues en breche infernale.' },
    hero: { id: 'gordon_despiser', name: 'Gordon Hauge', cat: 'horror', color: '#8a5a3d' },
    allies: [{ id: 'maggie_despiser', name: 'Maggie', cat: 'tactical', color: '#a56f5b' }, { id: 'afterlife_guard', name: 'Afterlife Guard', cat: 'marine', color: '#5d6870' }],
    monsters: ['Purgatory Crawler', 'Hell Road Wraith', 'Demon Pawn'],
    bosses: ['Soul Gate Keeper', 'Infernal Highway Beast'],
    worldBoss: 'Despicer Hell Warden',
    gear: [['despiser_coin', 'Afterlife Coin', 'Piece d apres-vie', { hp: 70 }], ['despiser_map', 'Purgatory Map', 'Carte du purgatoire', { spd: 2, def: 3 }], ['despiser_blade', 'Hell Road Blade', 'Lame route infernale', { atk: 9 }]],
    event: ['evt_despiser_soulroad', 'Soul Road Detour', 'Detour route des ames', 'The afterlife road redirects enemy damage into a demon pawn.', 'La route des ames redirige les degats ennemis vers un pion demon.'],
    decor: { sky: ['#30130f', '#070201'], floor: 'rgba(190, 73, 35, 0.18)', grid: 'rgba(255, 120, 64, 0.28)', motif: 'wasteland', accent: '#ff7840' }
  },
  {
    universe: 'How to Make a Monster',
    mediaType: 'movie',
    faction: 'cyber',
    stageName: 'Game Studio Monster Build',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'AI Monster Build',
    title: { en: 'How to Make a Monster', fr: 'How to Make a Monster' },
    desc: { en: 'Game-development horror turns motion capture, AI behavior, and monster design into a lethal build.', fr: 'L horreur de developpement jeu transforme mocap, IA comportementale et design de monstre en build lethal.' },
    hero: { id: 'dev_howmonster', name: 'Lead Game Dev', cat: 'hacker', color: '#4ec9b0' },
    allies: [{ id: 'mocap_actor_howmonster', name: 'Mocap Actor', cat: 'slayer', color: '#9aa0a6' }, { id: 'qa_tester_howmonster', name: 'QA Tester', cat: 'tactical', color: '#d7ba7d' }],
    monsters: ['Bugged AI Minion', 'Mocap Skeleton', 'Compile Error Beast'],
    bosses: ['Prototype Monster Rig', 'Crunch Time Entity'],
    worldBoss: 'AI Monster Build',
    gear: [['htmam_code', 'Monster AI Code', 'Code IA monstre', { atk: 8, spd: 1 }], ['htmam_mocap', 'Mocap Marker Set', 'Marqueurs mocap', { spd: 2, def: 3 }], ['htmam_devkit', 'Haunted Devkit', 'Devkit hante', { hp: 70, atk: 4 }]],
    event: ['evt_htmam_hotfix', 'Emergency Hotfix', 'Hotfix urgence', 'A dirty hotfix disables one enemy behavior branch.', 'Un hotfix sale desactive une branche comportementale ennemie.'],
    decor: { sky: ['#101826', '#020305'], floor: 'rgba(78, 201, 176, 0.16)', grid: 'rgba(215, 186, 125, 0.26)', motif: 'code', accent: '#4ec9b0' }
  },
  {
    universe: 'Repo! The Genetic Opera',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'GeneCo Opera Breach',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'GeneCo Repo Opera',
    title: { en: 'Repo! The Genetic Opera', fr: 'Repo! The Genetic Opera' },
    desc: { en: 'Gothic biotech, organ debt, opera melodrama, and GeneCo repossession become a surgical breach.', fr: 'Biotech gothique, dette d organes, melodrame opera et saisie GeneCo deviennent une breche chirurgicale.' },
    hero: { id: 'shilo_repo', name: 'Shilo Wallace', cat: 'hacker', color: '#7f6ba8' },
    allies: [{ id: 'repo_man', name: 'Repo Man', cat: 'slayer', color: '#2b2b2b' }, { id: 'blind_mag', name: 'Blind Mag', cat: 'tactical', color: '#d4b1c8' }],
    monsters: ['GeneCo Guard', 'Zydrate Addict Echo', 'Surgical Drone'],
    bosses: ['Luigi Pavi Rotti Cell', 'Amber Sweet Stage'],
    worldBoss: 'GeneCo Repo Opera',
    gear: [['repo_zydrate', 'Zydrate Vial', 'Fiole Zydrate', { spd: 2, atk: 5 }], ['repo_scalpel', 'Repo Scalpel', 'Scalpel Repo', { atk: 10 }], ['repo_contract', 'Organ Contract', 'Contrat organe', { hp: 80, def: 3 }]],
    event: ['evt_repo_opera', 'Genetic Opera Crescendo', 'Crescendo Genetic Opera', 'A biotech aria damages enemies and heals surgical allies.', 'Une aria biotech blesse les ennemis et soigne les allies chirurgicaux.'],
    decor: { sky: ['#2b0f1d', '#060106'], floor: 'rgba(160, 32, 80, 0.18)', grid: 'rgba(220, 170, 210, 0.26)', motif: 'speaker', accent: '#dcaad2' }
  },
  {
    universe: 'Tremors',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Perfection Graboid Hunt',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Queen Graboid Tremor',
    title: { en: 'Tremors', fr: 'Tremors' },
    desc: { en: 'Desert survival, underground predators, vibration traps, and improvised explosives shake the Nexus.', fr: 'Survie desertique, predateurs souterrains, pieges vibratoires et explosifs improvises secouent le Nexus.' },
    hero: { id: 'val_tremors', name: 'Valentine McKee', cat: 'tactical', color: '#b47c45' },
    allies: [{ id: 'earl_tremors', name: 'Earl Bassett', cat: 'marine', color: '#7a6d52' }, { id: 'burt_tremors', name: 'Burt Gummer', cat: 'marine', color: '#4b5d3f' }],
    monsters: ['Shrieker Pack', 'Ass-Blaster Scout', 'Seismic Wormling'],
    bosses: ['Graboid Ambusher', 'Burt Bunker Siege'],
    worldBoss: 'Queen Graboid Tremor',
    gear: [['tremors_sensor', 'Seismic Sensor', 'Capteur sismique', { spd: 2, def: 4 }], ['tremors_dynamite', 'Desert Dynamite', 'Dynamite desert', { atk: 10 }], ['tremors_bunker', 'Gummer Bunker Plate', 'Plaque bunker Gummer', { def: 7, hp: 50 }]],
    event: ['evt_tremors_highground', 'High Ground Trap', 'Piege hauteur', 'The squad climbs out of reach and detonates a lure.', 'L escouade prend de la hauteur et fait exploser un leurre.'],
    decor: { sky: ['#3a2614', '#080402'], floor: 'rgba(194, 123, 60, 0.2)', grid: 'rgba(255, 200, 116, 0.26)', motif: 'wasteland', accent: '#ffc874' }
  },
  {
    universe: 'Elvira',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Macabre Mansion Stage',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Macabre Spellbook Coven',
    title: { en: 'Elvira', fr: 'Elvira' },
    desc: { en: 'Camp horror glamour, haunted mansions, witchcraft, and late-night host charisma become a gothic breach.', fr: 'Glamour camp horror, manoir hante, sorcellerie et charisme de presentatrice nocturne deviennent une breche gothique.' },
    hero: { id: 'elvira_mistress', name: 'Elvira', cat: 'horror', color: '#0f0f12' },
    allies: [{ id: 'gonk_elvira', name: 'Gonk Familiar', cat: 'hacker', color: '#7d3c98' }, { id: 'mansion_handyman', name: 'Macabre Handyman', cat: 'tactical', color: '#8b6f5a' }],
    monsters: ['Haunted Mansion Bat', 'Campy Ghoul', 'Spellbook Spark'],
    bosses: ['Uncle Vincent Curse', 'Town Morality Mob'],
    worldBoss: 'Macabre Spellbook Coven',
    gear: [['elvira_dagger', 'Macabre Dagger', 'Dague macabre', { atk: 9 }], ['elvira_spellbook', 'Spellbook Page', 'Page grimoire', { spd: 2, def: 4 }], ['elvira_necklace', 'Gothic Necklace', 'Collier gothique', { hp: 75 }]],
    event: ['evt_elvira_midnight', 'Midnight Horror Host', 'Hotesse horreur minuit', 'Elvira charms the lane and weakens undead enemies.', 'Elvira charme la ligne et affaiblit les morts-vivants.'],
    decor: { sky: ['#201126', '#050207'], floor: 'rgba(150, 65, 180, 0.16)', grid: 'rgba(230, 180, 255, 0.26)', motif: 'hauntedset', accent: '#e6b4ff' }
  },
  {
    universe: 'Skyline',
    mediaType: 'movie',
    faction: 'sciFi',
    stageName: 'Los Angeles Harvest Beam',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Alien Harvest Mothership',
    title: { en: 'Skyline Trilogy', fr: 'Skyline - Trilogie' },
    desc: { en: 'Blue alien harvest beams, brain-snatching ships, and resistance warfare pull the skyline into invasion combat.', fr: 'Rayons bleus de recolte, vaisseaux voleurs de cerveaux et guerre de resistance tirent la skyline en combat d invasion.' },
    hero: { id: 'jarrod_skyline', name: 'Jarrod', cat: 'marine', color: '#3f5f8f' },
    allies: [{ id: 'elaine_skyline', name: 'Elaine', cat: 'tactical', color: '#7d8fa8' }, { id: 'rose_skyline', name: 'Rose Corley', cat: 'slayer', color: '#5b6d9e' }],
    monsters: ['Blue Light Drone', 'Alien Tanker Beast', 'Harvest Pod'],
    bosses: ['Brain Harvest Guardian', 'Resistance Skimmer Duel'],
    worldBoss: 'Alien Harvest Mothership',
    gear: [['sky_blue_core', 'Blue Light Core', 'Noyau lumiere bleue', { atk: 9, spd: 1 }], ['sky_resist_plate', 'Resistance Armor Plate', 'Plaque resistance', { def: 6, hp: 45 }], ['sky_pod_lens', 'Harvest Pod Lens', 'Lentille pod recolte', { atk: 6, def: 4 }]],
    event: ['evt_skyline_blue_pull', 'Blue Light Pull', 'Attraction lumiere bleue', 'A harvest beam drags enemies into a focused strike zone.', 'Un rayon de recolte attire les ennemis dans une zone de frappe.'],
    decor: { sky: ['#101b32', '#020306'], floor: 'rgba(70, 110, 170, 0.18)', grid: 'rgba(75, 180, 255, 0.3)', motif: 'arcanecity', accent: '#4bb4ff' }
  },
  {
    universe: 'The Ring',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Cursed Tape Seven Days',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Samara Tape Curse',
    title: { en: 'The Ring', fr: 'The Ring' },
    desc: { en: 'Cursed videotape static, wells, wet hair, and seven-day dread crawl through the Nexus screen.', fr: 'Statique de cassette maudite, puits, cheveux trempes et terreur des sept jours rampent hors de l ecran du Nexus.' },
    hero: { id: 'rachel_ring', name: 'Rachel Keller', cat: 'tactical', color: '#4f5f66' },
    allies: [{ id: 'aiden_ring', name: 'Aidan Keller', cat: 'hacker', color: '#9ca8ad' }, { id: 'noah_ring', name: 'Noah Clay', cat: 'marine', color: '#6f7d82' }],
    monsters: ['Cursed Tape Static', 'Wet Footprint Shade', 'Well Water Hand'],
    bosses: ['Seven Days Phone Call', 'Cursed Horse Vision'],
    worldBoss: 'Samara Tape Curse',
    gear: [['ring_tape', 'Cursed Tape', 'Cassette maudite', { atk: 8, spd: 1 }], ['ring_photo', 'Distorted Photo', 'Photo deformee', { def: 4, hp: 60 }], ['ring_well_stone', 'Well Stone', 'Pierre du puits', { hp: 90 }]],
    event: ['evt_ring_seven_days', 'Seven Days Deadline', 'Deadline sept jours', 'The tape curse marks the strongest enemy for delayed collapse.', 'La cassette marque l ennemi le plus fort pour un effondrement differe.'],
    decor: { sky: ['#12191b', '#020303'], floor: 'rgba(80, 105, 110, 0.16)', grid: 'rgba(190, 220, 220, 0.22)', motif: 'hauntedset', accent: '#bedcdc' }
  },
  {
    universe: 'The Grudge',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Saeki House Curse',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Kayako Onryo Curse',
    title: { en: 'The Grudge', fr: 'The Grudge' },
    desc: { en: 'A curse born from rage stains a house, spreading onryo whispers, crawling dread, and inescapable contact.', fr: 'Une malediction nee de la rage tache une maison, propageant murmures onryo, peur rampante et contact inevitable.' },
    hero: { id: 'karen_grudge', name: 'Karen Davis', cat: 'horror', color: '#d8d8cf' },
    allies: [{ id: 'detective_nakagawa', name: 'Detective Nakagawa', cat: 'tactical', color: '#5a6470' }, { id: 'toshio_echo', name: 'Toshio Echo', cat: 'hacker', color: '#bfc7c9' }],
    monsters: ['Crawling Onryo Shade', 'Attic Cat Echo', 'Cursed House Door'],
    bosses: ['Toshio Stairwell Echo', 'Saeki House Lock'],
    worldBoss: 'Kayako Onryo Curse',
    gear: [['grudge_photo', 'Saeki House Photo', 'Photo maison Saeki', { def: 5, hp: 50 }], ['grudge_hair', 'Onryo Hair Thread', 'Meche onryo', { atk: 8 }], ['grudge_tape', 'Case Tape Recorder', 'Magnetophone enquete', { spd: 2, def: 3 }]],
    event: ['evt_grudge_rattle', 'Onryo Death Rattle', 'Rale onryo', 'A crawling curse silences enemy specials for one beat.', 'Une malediction rampante fait taire les specials ennemis un instant.'],
    decor: { sky: ['#181818', '#030303'], floor: 'rgba(180, 180, 170, 0.12)', grid: 'rgba(230, 230, 220, 0.2)', motif: 'hauntedset', accent: '#e6e6dc' }
  },
  ...makeUniverseWave([
    { key: 'heavy_metal_2000', universe: 'Heavy Metal 2000', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Hard', titleFr: 'Heavy Metal 2000', stage: 'Fakk2 Loc-Nar Wasteland', boss: 'Tyler Loc-Nar Tyrant', hero: ['julie_hm2000', 'Julie', 'slayer'], allies: [['odin_hm2000', 'Odin', 'marine'], ['zeek_hm2000', 'Zeek', 'hacker']], theme: 'adult animated metal fantasy, mutant raiders, cosmic corruption, and wasteland combat', motif: 'wasteland', colors: ['#2b1320', '#050205', '#ff4f8b'] },
    { key: 'killer_tomatoes', universe: 'Killer Tomatoes from Outer Space', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Medium', titleFr: 'Tomates tueuses venues de l espace', stage: 'Tomato Saucer Panic', boss: 'Mutant Tomato Mother', hero: ['wilbur_tomatoes', 'Wilbur Finletter', 'tactical'], allies: [['tara_tomatoes', 'Tara Boumdeay', 'slayer'], ['ft_tomato', 'F.T.', 'hacker']], theme: 'absurd alien tomatoes, vegetable panic, B-movie invasions, and sauce-splattered chaos', motif: 'hauntedset', colors: ['#2b0808', '#070202', '#ff3b30'] },
    { key: 'planete_hurlante', universe: 'Planete Hurlante', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Planete Hurlante', stage: 'Sirius 6B Screamer Zone', boss: 'Autonomous Screamer Core', hero: ['hendricksson_screamers', 'Commander Hendricksson', 'marine'], allies: [['jessica_screamers', 'Jessica Hanson', 'tactical'], ['ace_screamers', 'Ace Jefferson', 'slayer']], theme: 'Sirius 6B trenches, autonomous killer machines, paranoia, and buried metallic traps', motif: 'facility', colors: ['#20242b', '#050608', '#c6d6d9'] },
    { key: 'sharknado', universe: 'Sharknado', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Medium', titleFr: 'Sharknado', stage: 'Los Angeles Shark Storm', boss: 'Category Five Sharknado', hero: ['fin_sharknado', 'Fin Shepard', 'slayer'], allies: [['april_sharknado', 'April Wexler', 'tactical'], ['nova_sharknado', 'Nova Clarke', 'marine']], theme: 'chainsaws, airborne sharks, disaster absurdity, and storm-front survival', motif: 'wasteland', colors: ['#12364c', '#02070a', '#4fd7ff'] },
    { key: 'godzilla_tas', universe: 'Godzilla The Animated Series', mediaType: 'series', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Godzilla la serie animee', stage: 'H.E.A.T. Kaiju Response', boss: 'Cyber Kaiju Mutation', hero: ['nick_tatopoulos_tas', 'Nick Tatopoulos', 'tactical'], allies: [['elsie_chapman_tas', 'Elsie Chapman', 'hacker'], ['godzilla_jr_tas', 'Godzilla Junior', 'slayer']], theme: 'H.E.A.T. science missions, mutated kaiju threats, and city-scale monster battles', motif: 'arcanecity', colors: ['#0d2a1f', '#020604', '#4dff88'] },
    { key: 'pee_wee', universe: 'Pee-wee', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Pee-wee', stage: 'Playhouse Bicycle Quest', boss: 'Stolen Bike Dream Trial', hero: ['peewee_herman', 'Pee-wee Herman', 'hacker'], allies: [['chairry_playhouse', 'Chairry', 'tactical'], ['cowboy_curtis', 'Cowboy Curtis', 'marine']], theme: 'surreal playhouse logic, strange gadgets, bicycle obsession, and comic detours', motif: 'arcanecity', colors: ['#1b3c8f', '#050718', '#ffdd33'] },
    { key: 'malcolm', universe: 'Malcolm in the Middle', mediaType: 'series', faction: 'cyber', mode: 'Tactics', difficulty: 'Medium', titleFr: 'Malcolm', stage: 'Family Chaos Command Center', boss: 'Household Meltdown', hero: ['malcolm_wilkerson', 'Malcolm', 'hacker'], allies: [['lois_malcolm', 'Lois', 'tactical'], ['reese_malcolm', 'Reese', 'slayer']], theme: 'family chaos, genius problem solving, school trouble, and domestic escalation', motif: 'facility', colors: ['#283240', '#060709', '#ffcf4a'] },
    { key: 'tanya_the_evil', universe: 'Tanya the Evil', mediaType: 'manga', faction: 'arcane', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Tanya the Evil', stage: 'Imperial Mage Frontline', boss: 'Being X War Miracle', hero: ['tanya_degurechaff', 'Tanya Degurechaff', 'tactical'], allies: [['viktoriya_serebryakov', 'Viktoriya Serebryakov', 'marine'], ['weiss_203rd', 'Weiss', 'slayer']], theme: 'military mage doctrine, aerial artillery, alternate war fronts, and ruthless command logic', motif: 'fortress', colors: ['#24304d', '#05070c', '#d6b15f'] },
    { key: 'virus_1999', universe: 'Virus', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Virus', stage: 'Akademik Vladislav Volkov', boss: 'Alien Machine Intelligence', hero: ['kit_foster_virus', 'Kit Foster', 'marine'], allies: [['steve_baker_virus', 'Steve Baker', 'tactical'], ['nadia_virus', 'Nadia Vinogradova', 'hacker']], theme: 'derelict research ship, alien machine infection, body-tech hybrids, and electrical possession', motif: 'shipdeck', colors: ['#111d22', '#030506', '#72f0ff'] },
    { key: 'house_dead_1', universe: 'House of the Dead', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead', stage: 'Curien Mansion Outbreak', boss: 'Magician Type-0', hero: ['thomas_rogan_hotd', 'Thomas Rogan', 'marine'], allies: [['g_hotd', 'Agent G', 'tactical'], ['sophie_hotd', 'Sophie Richards', 'hacker']], theme: 'arcade agents, Curien mansion experiments, zombies, and Tarot-coded bioweapons', motif: 'hauntedset', colors: ['#1a0d0d', '#030101', '#ff4b3e'] },
    { key: 'house_dead_2', universe: 'House of the Dead 2', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead 2', stage: 'Venice Goldman Incident', boss: 'Emperor Prototype', hero: ['james_taylor_hotd2', 'James Taylor', 'marine'], allies: [['gary_stewart_hotd2', 'Gary Stewart', 'tactical'], ['amy_crystal_hotd2', 'Amy Crystal', 'hacker']], theme: 'Goldman outbreak, canals full of undead, arcade rescue routes, and synthetic final forms', motif: 'arcanecity', colors: ['#1b1510', '#030201', '#ff9d4a'] },
    { key: 'house_dead_3', universe: 'House of the Dead 3', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead 3', stage: 'EFI Research Facility', boss: 'Wheel of Fate', hero: ['lisa_rogan_hotd3', 'Lisa Rogan', 'slayer'], allies: [['g_hotd3', 'Agent G Veteran', 'tactical'], ['dan_taylor_hotd3', 'Dan Taylor', 'marine']], theme: 'shotguns, abandoned facilities, post-outbreak corridors, and fate-driven experiments', motif: 'facility', colors: ['#101916', '#020403', '#5dff88'] },
    { key: 'toy_soldiers', universe: 'Toy Soldiers', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Medium', titleFr: 'Toy Soldiers', stage: 'Miniature Trench Tabletop', boss: 'Clockwork Siege Engine', hero: ['tin_commander', 'Tin Commander', 'tactical'], allies: [['plastic_gunner', 'Plastic Gunner', 'marine'], ['windup_sapper', 'Wind-Up Sapper', 'hacker']], theme: 'miniature battlefield tactics, trench dioramas, toy artillery, and tabletop war machines', motif: 'fortress', colors: ['#243421', '#050705', '#b7d36b'] },
    { key: 'shaun_dead', universe: 'Shaun of the Dead', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'Shaun of the Dead', stage: 'Winchester Last Pint', boss: 'Pub Zombie Siege', hero: ['shaun_sotd', 'Shaun', 'slayer'], allies: [['ed_sotd', 'Ed', 'hacker'], ['liz_sotd', 'Liz', 'tactical']], theme: 'British zombie comedy, pub defense, cricket bats, and deadpan survival plans', motif: 'hauntedset', colors: ['#251111', '#040202', '#d64242'] },
    { key: 'puppet_master', universe: 'Puppet Master', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Puppet Master', stage: 'Bodega Bay Puppet Theater', boss: 'Totem Puppet Rite', hero: ['blade_puppet', 'Blade', 'horror'], allies: [['pinhead_puppet', 'Pinhead', 'slayer'], ['six_shooter_puppet', 'Six-Shooter', 'marine']], theme: 'killer puppets, occult animation, tiny assassins, and hotel corridor ambushes', motif: 'hauntedset', colors: ['#201614', '#040202', '#c28a4a'] },
    { key: 'chicken_run', universe: 'Chicken Run', mediaType: 'movie', faction: 'arcane', mode: 'Tactics', difficulty: 'Medium', titleFr: 'Chicken Run', stage: 'Tweedy Farm Escape', boss: 'Pie Machine Grinder', hero: ['ginger_chickenrun', 'Ginger', 'tactical'], allies: [['rocky_chickenrun', 'Rocky Rhodes', 'slayer'], ['fowler_chickenrun', 'Fowler', 'marine']], theme: 'farm escape plans, claymation grit, pie machines, and improvised aviation', motif: 'fortress', colors: ['#332514', '#070503', '#f4c45f'] },
    { key: 'another', universe: 'Another', mediaType: 'manga', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Another', stage: 'Yomiyama Class 3 Curse', boss: 'Calamity Extra Student', hero: ['mei_misaki', 'Mei Misaki', 'horror'], allies: [['kouichi_sakakibara', 'Kouichi Sakakibara', 'tactical'], ['tatsuji_chibiki', 'Tatsuji Chibiki', 'hacker']], theme: 'school curse, missing identity, quiet dread, and fatal accidents around Class 3', motif: 'hauntedset', colors: ['#151923', '#020304', '#9fb4d9'] },
    { key: 'gunnm', universe: 'Gunnm', mediaType: 'manga', faction: 'cyber', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Gunnm', stage: 'Scrapyard Motorball Arena', boss: 'Zalem Hunter-Killer', hero: ['gally_gunnm', 'Gally', 'slayer'], allies: [['ido_gunnm', 'Daisuke Ido', 'hacker'], ['yugo_gunnm', 'Yugo', 'tactical']], theme: 'cyborg martial arts, scrapyard bounty hunting, motorball violence, and Zalem class divide', motif: 'facility', colors: ['#171d24', '#030507', '#67d8ff'] },
    { key: 'battle_royale', universe: 'Battle Royale', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Battle Royale', stage: 'Program Island Kill Zone', boss: 'Collar Detonation Network', hero: ['shuya_nanahara', 'Shuya Nanahara', 'tactical'], allies: [['noriko_nakagawa', 'Noriko Nakagawa', 'hacker'], ['kazuo_kiriyama', 'Kazuo Kiriyama', 'slayer']], theme: 'student survival program, explosive collars, island sectors, and moral collapse under rules', motif: 'wasteland', colors: ['#231414', '#030202', '#ff4e4e'] },
    { key: 'spawn', universe: 'Spawn', mediaType: 'manga', faction: 'horror', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Spawn', stage: 'Rat City Necroplasm Rift', boss: 'Malebolgia Throne', hero: ['al_simmons_spawn', 'Spawn', 'horror'], allies: [['cogliostro_spawn', 'Cogliostro', 'tactical'], ['sam_twitch_spawn', 'Sam and Twitch', 'marine']], theme: 'necroplasm chains, hellspawn bargains, alley warfare, and infernal command structures', motif: 'hauntedset', colors: ['#08130f', '#010302', '#42ff66'] },
    { key: 'pingu', universe: 'Pingu', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Pingu', stage: 'Antarctic Noot Noot Rift', boss: 'Frozen Fish Avalanche', hero: ['pingu', 'Pingu', 'hacker'], allies: [['pinga', 'Pinga', 'tactical'], ['roby_pingu', 'Roby', 'slayer']], theme: 'clay penguin antics, arctic family chaos, fish economy, and noot-noot disruption', motif: 'wasteland', colors: ['#112b3a', '#02070a', '#b9f2ff'] },
    { key: 'linkin_park', universe: 'Linkin Park', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Linkin Park', stage: 'Hybrid Theory Soundstage', boss: 'Meteora Feedback Core', hero: ['chester_lp', 'Chester Echo', 'slayer'], allies: [['mike_lp', 'Mike Signal', 'hacker'], ['mr_hahn_lp', 'Turntable Operator', 'tactical']], theme: 'nu-metal energy, glitch visuals, turntable cuts, emotional surges, and arena feedback', motif: 'facility', colors: ['#151a22', '#030407', '#00b7ff'] },
    { key: 'moonwalker', universe: 'Moonwalker', mediaType: 'movie', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Moonwalker', stage: 'Smooth Criminal Club Breach', boss: 'Mr Big Mecha Raid', hero: ['moonwalker_hero', 'Moonwalker', 'slayer'], allies: [['annie_moonwalker', 'Annie', 'hacker'], ['club_dancer_moonwalker', 'Club Dancer', 'tactical']], theme: 'music-video fantasy, anti-gravity dance combat, gangster clubs, and transforming starship spectacle', motif: 'arcanecity', colors: ['#101820', '#030406', '#f5f5f5'] },
    { key: 'michael_jackson', universe: 'Michael Jackson', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Michael Jackson', stage: 'King of Pop Rhythm Rift', boss: 'Thriller Beat Revenant', hero: ['mj_performer', 'King of Pop Avatar', 'slayer'], allies: [['rhythm_guard_mj', 'Rhythm Guard', 'tactical'], ['stage_light_mj', 'Stage Light Tech', 'hacker']], theme: 'pop spectacle, thriller horror dance, spotlight timing, and precision rhythm strikes', motif: 'hauntedset', colors: ['#171717', '#030303', '#f3d35c'] },
    { key: 'the_thing', universe: 'The Thing', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'The Thing', stage: 'Outpost 31 Blood Test', boss: 'Assimilation Biomass', hero: ['macready_thing', 'R.J. MacReady', 'marine'], allies: [['childs_thing', 'Childs', 'tactical'], ['blair_thing', 'Blair', 'hacker']], theme: 'antarctic paranoia, assimilation horror, blood tests, flamethrowers, and identity collapse', motif: 'facility', colors: ['#15212a', '#020406', '#c8f4ff'] },
    { key: 'evil_dead', universe: 'Evil Dead', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Evil Dead', stage: 'Knowby Cabin Deadite Night', boss: 'Necronomicon Kandarian Demon', hero: ['ash_williams', 'Ash Williams', 'slayer'], allies: [['annie_knowby', 'Annie Knowby', 'hacker'], ['scotty_evildead', 'Scotty', 'marine']], theme: 'cabin deadites, Necronomicon rites, chainsaw heroics, and demonic forest pressure', motif: 'hauntedset', colors: ['#1f0d0d', '#030101', '#ff3f2f'] },
    { key: 'die_antwoord', universe: 'Die Antwoord', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Die Antwoord', stage: 'Zef Neon Warehouse', boss: 'Bassline Freak Core', hero: ['ninja_da', 'Ninja', 'slayer'], allies: [['yolandi_da', 'Yo-Landi', 'hacker'], ['dj_hi_tek_da', 'DJ Hi-Tek', 'tactical']], theme: 'zef rave aggression, distorted bass, neon warehouse sets, and abrasive cyber-punk energy', motif: 'facility', colors: ['#1b1020', '#040206', '#ff4fd8'] },
    { key: 'chappie', universe: 'Chappie', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Chappie', stage: 'Johannesburg Scout AI Lab', boss: 'MOOSE Weapons Platform', hero: ['chappie_ai', 'Chappie', 'hacker'], allies: [['deon_chappie', 'Deon Wilson', 'tactical'], ['yolandi_chappie', 'Yolandi', 'marine']], theme: 'learning robot consciousness, police scouts, criminal crews, and corporate weapons platforms', motif: 'facility', colors: ['#20272b', '#050607', '#8de8ff'] },
    { key: 'gremlins', universe: 'Gremlins', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Medium', titleFr: 'Gremlins', stage: 'Kingston Falls Midnight Rules', boss: 'Stripe Gremlin Swarm', hero: ['gizmo_gremlins', 'Gizmo', 'hacker'], allies: [['billy_peltzer', 'Billy Peltzer', 'tactical'], ['kate_gremlins', 'Kate Beringer', 'marine']], theme: 'mogwai rules, midnight chaos, multiplying gremlins, and small-town creature mayhem', motif: 'hauntedset', colors: ['#142415', '#020402', '#7aff60'] },
    { key: 'rocky_horror', universe: 'Rocky Horror Picture Show', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Rocky Horror Picture Show', stage: 'Frankenfurter Castle Floor Show', boss: 'Transylvanian Time Warp', hero: ['frank_n_furter', 'Frank-N-Furter', 'horror'], allies: [['janet_rhps', 'Janet Weiss', 'tactical'], ['rocky_rhps', 'Rocky Horror', 'slayer']], theme: 'glam sci-fi castle, theatrical horror, laboratory creation, and midnight musical ritual', motif: 'hauntedset', colors: ['#240b28', '#050106', '#ff5cff'] },
    { key: 'les_inconnus', universe: 'Les Inconnus', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Inconnus', stage: 'Sketch TV Parody Breach', boss: 'Prime Time Absurdity', hero: ['inconnus_trio', 'Le Trio Inconnu', 'hacker'], allies: [['bernard_inconnus', 'Bernard', 'tactical'], ['didier_inconnus', 'Didier', 'slayer']], theme: 'French sketch comedy, TV parody, social satire, and absurd catchphrase energy', motif: 'arcanecity', colors: ['#232323', '#040404', '#ffd15c'] },
    { key: 'rrrrrrr', universe: 'RRRrrrr!!!', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'RRRrrrr!!!', stage: 'Age de Pierre Shampooing', boss: 'Premier Crime Tribal', hero: ['pierre_rrr', 'Pierre', 'slayer'], allies: [['guy_rrr', 'Guy', 'tactical'], ['chef_cheveux_sales', 'Chef Cheveux Sales', 'hacker']], theme: 'prehistoric comedy, rival hair tribes, first murder mystery, and absurd stone-age logic', motif: 'wasteland', colors: ['#302214', '#080503', '#f0b45b'] },
    { key: 'cite_peur', universe: 'La Cite de la Peur', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'La Cite de la Peur', stage: 'Cannes Projection Slasher', boss: 'Odile Deray Premiere Trap', hero: ['odile_deray', 'Odile Deray', 'tactical'], allies: [['simon_jeremi', 'Simon Jeremi', 'hacker'], ['serge_karamazov', 'Serge Karamazov', 'slayer']], theme: 'French comedy thriller, film festival murders, meta-cinema jokes, and chaotic publicity tactics', motif: 'hauntedset', colors: ['#261414', '#040202', '#ff5757'] },
    { key: 'defiance', universe: 'Defiance', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Defiance', stage: 'Votan Frontier Siege', boss: 'Arkfall War Engine', hero: ['nolan_defiance', 'Joshua Nolan', 'marine'], allies: [['irisa_defiance', 'Irisa', 'slayer'], ['datak_tarr', 'Datak Tarr', 'tactical']], theme: 'post-alien-war frontier towns, Votan cultures, arkfall tech, and uneasy alliances', motif: 'wasteland', colors: ['#1e2b2b', '#030606', '#58d6c7'] },
    { key: 'mars_attacks', universe: 'Mars Attacks', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Hard', titleFr: 'Mars Attacks', stage: 'Ack Ack Capitol Invasion', boss: 'Martian Supreme Commander', hero: ['byron_mars', 'Byron Williams', 'marine'], allies: [['ritchie_mars', 'Richie Norris', 'hacker'], ['nathalie_mars', 'Nathalie Lake', 'tactical']], theme: 'Martian rayguns, cruel comedy invasion, flying saucers, and yodel-powered reversal', motif: 'arcanecity', colors: ['#10251b', '#020503', '#39ff66'] },
    { key: 'dandadan', universe: 'Dandadan', mediaType: 'manga', faction: 'arcane', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Dandadan', stage: 'Occult Alien Turbo Chase', boss: 'Turbo Granny UFO Merge', hero: ['momo_ayase', 'Momo Ayase', 'hacker'], allies: [['oken_dandadan', 'Okarun', 'slayer'], ['aira_dandadan', 'Aira Shiratori', 'tactical']], theme: 'aliens, yokai, psychic powers, turbo curses, and chaotic occult battles', motif: 'hauntedset', colors: ['#241531', '#050208', '#ff6ad5'] },
    { key: 'baby_cart', universe: 'Baby Cart', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Baby Cart', stage: 'Lone Wolf Assassin Road', boss: 'Yagyu Ambush Clan', hero: ['ogami_itto', 'Ogami Itto', 'slayer'], allies: [['daigoro_babycart', 'Daigoro', 'hacker'], ['azami_assassin', 'Roadside Assassin', 'tactical']], theme: 'ronin executioner road, hidden weapons cart, clan ambushes, and grim chanbara duels', motif: 'wasteland', colors: ['#201915', '#040303', '#d8b46a'] },
    { key: 'cloverfield', universe: 'Cloverfield', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Cloverfield', stage: 'Manhattan Found Footage Collapse', boss: 'Clover Parasite Titan', hero: ['rob_cloverfield', 'Rob Hawkins', 'tactical'], allies: [['hud_cloverfield', 'Hud Platt', 'hacker'], ['marlena_cloverfield', 'Marlena Diamond', 'slayer']], theme: 'found-footage panic, city destruction, parasite bites, and colossal unseen biology', motif: 'arcanecity', colors: ['#141f25', '#020405', '#93c8d8'] },
    { key: 'collector', universe: 'The Collector', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'The Collector', stage: 'Trap House Extraction', boss: 'Collector Masked Architect', hero: ['arkin_collector', 'Arkin', 'tactical'], allies: [['elena_collector', 'Elena Peters', 'hacker'], ['lucello_collector', 'Lucello', 'marine']], theme: 'masked trap maker, house-wide mechanisms, desperate rescue, and brutal survival puzzles', motif: 'facility', colors: ['#1a1111', '#030202', '#d13d3d'] },
    { key: 'h2g2', universe: 'H2G2', mediaType: 'movie', faction: 'sciFi', mode: 'RPG', difficulty: 'Medium', titleFr: 'H2G2', stage: 'Infinite Improbability Drive', boss: 'Vogon Bureaucracy Armada', hero: ['arthur_dent_h2g2', 'Arthur Dent', 'hacker'], allies: [['ford_prefect', 'Ford Prefect', 'tactical'], ['zaphod_beeblebrox', 'Zaphod Beeblebrox', 'slayer']], theme: 'cosmic absurdity, guide entries, Vogon bureaucracy, towels, and probability disasters', motif: 'shipdeck', colors: ['#14243a', '#02050a', '#7dd3ff'] },
    { key: 'tuche', universe: 'Les Tuche', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Tuche', stage: 'Bouzolles Lottery Breach', boss: 'Monaco Culture Shock', hero: ['jeff_tuche', 'Jeff Tuche', 'hacker'], allies: [['cathy_tuche', 'Cathy Tuche', 'tactical'], ['coincoin_tuche', 'Coin-Coin', 'slayer']], theme: 'lottery chaos, family stubbornness, class shock comedy, and potato-based morale', motif: 'arcanecity', colors: ['#2d2415', '#070503', '#ffd45a'] },
    { key: 'iron_sky', universe: 'Iron Sky', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Iron Sky', stage: 'Moon Reich Dark Side Base', boss: 'Gotterdammerung Warship', hero: ['renate_ironsky', 'Renate Richter', 'tactical'], allies: [['james_ironsky', 'James Washington', 'marine'], ['sasha_ironsky', 'Sasha', 'hacker']], theme: 'moonbase satire, retro-futurist saucers, political absurdity, and orbital war machines', motif: 'shipdeck', colors: ['#1d2027', '#040507', '#bfc7d5'] },
    { key: 'rec', universe: 'REC', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'REC', stage: 'Quarantined Barcelona Building', boss: 'Medeiros Attic Host', hero: ['angela_vidal', 'Angela Vidal', 'hacker'], allies: [['manu_rec', 'Manu', 'marine'], ['pablo_rec', 'Pablo Camera', 'tactical']], theme: 'found-footage infection, sealed apartment stairwells, panic screams, and attic possession horror', motif: 'hauntedset', colors: ['#161616', '#020202', '#e84b3c'] },
    { key: 'sinister', universe: 'Sinister', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Sinister', stage: 'Super 8 Murder Archive', boss: 'Bughuul Film Curse', hero: ['ellison_sinister', 'Ellison Oswalt', 'hacker'], allies: [['tracy_sinister', 'Tracy Oswalt', 'tactical'], ['deputy_so_and_so', 'Deputy So-and-So', 'marine']], theme: 'Super 8 reels, occult murder patterns, child ghosts, and image-borne possession', motif: 'hauntedset', colors: ['#17120f', '#030201', '#d87b3d'] },
    { key: 'les_visiteurs', universe: 'Les Visiteurs', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Visiteurs', stage: 'Couloir du Temps Medieval', boss: 'Potion Temporelle Instable', hero: ['godefroy_visiteurs', 'Godefroy de Montmirail', 'slayer'], allies: [['jacquouille', 'Jacquouille la Fripouille', 'hacker'], ['beatrice_visiteurs', 'Beatrice', 'tactical']], theme: 'medieval time travel, mistaken identities, magic potion accidents, and noble chaos in modern France', motif: 'castle', colors: ['#2b2417', '#070503', '#d9b86b'] },
    { key: 'kazaam', universe: 'Kazaam', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Kazaam', stage: 'Urban Genie Boom Box', boss: 'Wish Contract Overload', hero: ['kazaam_genie', 'Kazaam', 'hacker'], allies: [['max_kazaam', 'Max Connor', 'tactical'], ['malik_kazaam', 'Malik', 'marine']], theme: 'urban genie wishes, music-powered magic, kid adventure, and oversized supernatural muscle', motif: 'arcanecity', colors: ['#1e1b35', '#05040a', '#8f7cff'] },
    { key: 'spirited_away', universe: 'Voyage de Chihiro', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Voyage de Chihiro', stage: 'Bathhouse Spirit Crossing', boss: 'No-Face Gold Hunger', hero: ['chihiro_ogino', 'Chihiro', 'tactical'], allies: [['haku_spirited', 'Haku', 'slayer'], ['lin_spirited', 'Lin', 'hacker']], theme: 'spirit bathhouse rules, river dragons, masked hunger, and courage through enchanted labor', motif: 'castle', colors: ['#162d2a', '#020706', '#6ff0c8'] },
    { key: 'feebles', universe: 'Meet the Feebles', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Les Feebles', stage: 'Variety Show Backstage Riot', boss: 'Heidi Stage Meltdown', hero: ['heidi_feebles', 'Heidi', 'horror'], allies: [['wynyard_feebles', 'Wynyard', 'marine'], ['robert_feebles', 'Robert', 'tactical']], theme: 'puppet show corruption, backstage crime, grotesque satire, and variety-stage breakdown', motif: 'hauntedset', colors: ['#221015', '#040203', '#ff5a7a'] },
    { key: 'roger_rabbit', universe: 'Roger Rabbit', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Roger Rabbit', stage: 'Toontown Dip Crisis', boss: 'Judge Doom Dip Machine', hero: ['roger_rabbit', 'Roger Rabbit', 'hacker'], allies: [['eddie_valiant', 'Eddie Valiant', 'tactical'], ['jessica_rabbit', 'Jessica Rabbit', 'slayer']], theme: 'toon physics, noir investigation, Dip danger, and reality-bending gag combat', motif: 'arcanecity', colors: ['#2d1424', '#060205', '#ff6ab7'] },
    { key: 'starship_troopers', universe: 'Starship Troopers', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Starship Troopers', stage: 'Klendathu Bug War', boss: 'Brain Bug Hive Command', hero: ['johnny_rico', 'Johnny Rico', 'marine'], allies: [['dizzy_flores', 'Dizzy Flores', 'slayer'], ['carl_jenkins', 'Carl Jenkins', 'hacker']], theme: 'mobile infantry, arachnid swarms, propaganda war, and brutal planetary assaults', motif: 'wasteland', colors: ['#1b2113', '#030402', '#9ed34f'] },
    { key: 'banlieue_13', universe: 'Banlieue 13', mediaType: 'movie', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Banlieue 13', stage: 'District 13 Parkour Raid', boss: 'Neutron Bomb Countdown', hero: ['leito_b13', 'Leito', 'slayer'], allies: [['damien_b13', 'Damien Tomaso', 'tactical'], ['lola_b13', 'Lola', 'hacker']], theme: 'parkour escapes, sealed district raids, tactical infiltration, and ticking urban bomb plots', motif: 'arcanecity', colors: ['#182126', '#030506', '#ff7a45'] },
    { key: 'house_1000_corpses', universe: 'House of 1000 Corpses', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'House of 1000 Corpses', stage: 'Firefly Family Funhouse', boss: 'Doctor Satan Basement', hero: ['baby_firefly', 'Baby Firefly', 'horror'], allies: [['otis_driftwood', 'Otis Driftwood', 'slayer'], ['captain_spaulding', 'Captain Spaulding', 'tactical']], theme: 'Firefly family horror, roadside attractions, grindhouse cruelty, and underground nightmare rooms', motif: 'hauntedset', colors: ['#2a120c', '#050201', '#ff6a2f'] },
    { key: 'overlord_anime', universe: 'Overlord Anime', mediaType: 'manga', faction: 'arcane', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Overlord', stage: 'Nazarick Tomb Defense', boss: 'Ainz Ooal Gown Supreme Magic', hero: ['ainz_overlord', 'Ainz Ooal Gown', 'horror'], allies: [['albedo_overlord', 'Albedo', 'slayer'], ['demiurge_overlord', 'Demiurge', 'tactical']], theme: 'isekai dark guild, Nazarick guardians, undead kingship, and overwhelming tier magic', motif: 'castle', colors: ['#181126', '#030207', '#b88cff'] },
    { key: 'scp', universe: 'SCP Foundation', mediaType: 'series', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'SCP', stage: 'Site-19 Containment Breach', boss: 'Keter Class Cascade', hero: ['mtf_commander_scp', 'MTF Commander', 'tactical'], allies: [['researcher_scp', 'Foundation Researcher', 'hacker'], ['scp_999_echo', 'SCP-999 Echo', 'horror']], theme: 'containment protocols, anomalous entities, site lockdowns, and Keter escalation procedures', motif: 'facility', colors: ['#151515', '#020202', '#e5e5e5'] },
    { key: 'spoof_movie', universe: 'Spoof Movie', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Spoof Movie', stage: 'Parody Multigenre Studio', boss: 'Reference Overload Director', hero: ['spoof_survivor', 'Spoof Survivor', 'hacker'], allies: [['parody_detective', 'Parody Detective', 'tactical'], ['slapstick_fighter', 'Slapstick Fighter', 'slayer']], theme: 'genre parody, broken tropes, joke logic, and cinematic references collapsing into combat', motif: 'arcanecity', colors: ['#202020', '#040404', '#ffcf5a'] }
  ]),
  ...makeUniverseWave([
    { key: 'mgsr', universe: 'Metal Gear Rising', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Metal Gear Rising', stage: 'Denver Cyborg Duel', boss: 'Senator Armstrong Nanomachine Core', hero: ['raiden_mgr', 'Raiden', 'slayer'], allies: [['blade_wolf_mgr', 'Blade Wolf', 'tactical'], ['jetstream_sam', 'Jetstream Sam', 'slayer']], theme: 'cyborg sword duels, private armies, memes, and nanomachine brutality', motif: 'facility', colors: ['#15202b', '#030507', '#58d6ff'] },
    { key: 'bioshock', universe: 'BioShock', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Hard', titleFr: 'BioShock', stage: 'Rapture ADAM Collapse', boss: 'Atlas Fontaine Splicer King', hero: ['jack_bioshock', 'Jack', 'hacker'], allies: [['big_daddy_bioshock', 'Big Daddy', 'marine'], ['little_sister_echo', 'Little Sister Echo', 'tactical']], theme: 'underwater dystopia, plasmids, ADAM addiction, Big Daddies, and broken utopian science', motif: 'facility', colors: ['#123448', '#020709', '#b88942'] },
    { key: 'twisted_metal', universe: 'Twisted Metal', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Twisted Metal', stage: 'Calypso Deathmatch Freeway', boss: 'Sweet Tooth War Rig', hero: ['sweet_tooth_tm', 'Sweet Tooth', 'horror'], allies: [['outlaw_tm', 'Outlaw', 'tactical'], ['roadkill_tm', 'Roadkill', 'marine']], theme: 'vehicular carnage, cursed wishes, arena mayhem, and clown-faced apocalypse metal', motif: 'wasteland', colors: ['#250f12', '#050203', '#ff3f2f'] },
    { key: 'spider_ps1', universe: 'Spider-Man PS1', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Spider-Man PS1', stage: 'Rooftop Symbiote Chase', boss: 'Monster Ock Nexus Pursuit', hero: ['spiderman_ps1', 'Spider-Man', 'slayer'], allies: [['black_cat_ps1', 'Black Cat', 'tactical'], ['captain_stacy_ps1', 'Police Scanner', 'hacker']], theme: 'PS1 rooftop swings, symbiote chases, comic panels, and polygonal superhero action', motif: 'arcanecity', colors: ['#142c59', '#03050a', '#ff3535'] },
    { key: 'tomba', universe: 'Tomba', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Tomba', stage: 'Evil Pig Jungle Rift', boss: 'Seven Evil Pigs Gate', hero: ['tomba_hero', 'Tomba', 'slayer'], allies: [['charles_tomba', 'Charles', 'hacker'], ['tabby_tomba', 'Tabby', 'tactical']], theme: 'pink-haired platforming, cursed pigs, jungle quests, and whimsical object logic', motif: 'wasteland', colors: ['#2e1b32', '#050207', '#ff66aa'] },
    { key: 'ff7', universe: 'Final Fantasy VII', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Final Fantasy VII', stage: 'Midgar Mako Reactor Breach', boss: 'Safer Sephiroth Jenova Core', hero: ['cloud_ff7', 'Cloud Strife', 'slayer'], allies: [['tifa_ff7', 'Tifa Lockhart', 'slayer'], ['aerith_ff7', 'Aerith Gainsborough', 'tactical']], theme: 'mako reactors, SOLDIER trauma, materia, planetary memory, and Jenova corruption', motif: 'facility', colors: ['#14261f', '#020503', '#6dff8d'] },
    { key: 'ff8', universe: 'Final Fantasy VIII', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Final Fantasy VIII', stage: 'Balamb Time Compression', boss: 'Ultimecia Junction Core', hero: ['squall_ff8', 'Squall Leonhart', 'slayer'], allies: [['rinoa_ff8', 'Rinoa Heartilly', 'hacker'], ['quistis_ff8', 'Quistis Trepe', 'tactical']], theme: 'gunblades, Gardens, Guardian Forces, sorceress wars, and time compression', motif: 'castle', colors: ['#19233b', '#03050a', '#8fb6ff'] },
    { key: 'ff13', universe: 'Final Fantasy XIII', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Final Fantasy XIII', stage: 'Cocoon FalCie Purge', boss: 'Orphan Cradle Core', hero: ['lightning_ff13', 'Lightning', 'slayer'], allies: [['fang_ff13', 'Fang', 'marine'], ['vanille_ff13', 'Vanille', 'hacker']], theme: 'lCie brands, falCie destiny, paradigm shifts, and crystalline rebellion', motif: 'shipdeck', colors: ['#20273a', '#04060a', '#f0a8d8'] },
    { key: 'ff15', universe: 'Final Fantasy XV', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Final Fantasy XV', stage: 'Lucis Roadtrip Nightfall', boss: 'Ardyn Starscourge Throne', hero: ['noctis_ff15', 'Noctis Lucis Caelum', 'slayer'], allies: [['gladiolus_ff15', 'Gladiolus', 'marine'], ['ignis_ff15', 'Ignis', 'tactical']], theme: 'royal road trips, astral pacts, daemon nights, and warp-strike brotherhood', motif: 'wasteland', colors: ['#171b2b', '#030407', '#7d9bff'] },
    { key: 'crash_bandicoot', universe: 'Crash Bandicoot', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Crash Bandicoot', stage: 'Wumpa Island Cortex Lab', boss: 'Neo Cortex Mutagen Ray', hero: ['crash_bandicoot', 'Crash Bandicoot', 'slayer'], allies: [['coco_bandicoot', 'Coco Bandicoot', 'hacker'], ['aku_aku', 'Aku Aku', 'tactical']], theme: 'wumpa crates, mutant islands, mask magic, spinning chaos, and mad science traps', motif: 'wasteland', colors: ['#2e1608', '#070301', '#ff8a22'] },
    { key: 'tomb_raider', universe: 'Tomb Raider', mediaType: 'game', faction: 'arcane', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Tomb Raider', stage: 'Ancient Tomb Relic Siege', boss: 'Atlantean Scion Guardian', hero: ['lara_croft_tr', 'Lara Croft', 'tactical'], allies: [['winston_tr', 'Winston', 'hacker'], ['jonah_tr', 'Jonah Maiava', 'marine']], theme: 'ancient tombs, relic puzzles, dual pistols, traps, and archaeological survival', motif: 'castle', colors: ['#2a2115', '#050403', '#d4a64a'] },
    { key: 'tekken_ogre', universe: 'Tekken', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Tekken', stage: 'King of Iron Fist Nexus', boss: 'True Ogre Ancient Form', hero: ['yoshimitsu_tekken', 'Yoshimitsu', 'slayer'], allies: [['true_ogre_tekken', 'True Ogre', 'horror'], ['gon_tekken', 'Gon', 'slayer']], theme: 'martial arts tournaments, cursed bloodlines, weapon styles, ancient ogres, and arcade rivalries', motif: 'arcanecity', colors: ['#1d1828', '#040306', '#9dff4a'] },
    { key: 'spyro', universe: 'Spyro', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Spyro', stage: 'Artisans Dragon Realm', boss: 'Gnasty Gnorc Crystal Trap', hero: ['spyro_dragon', 'Spyro', 'slayer'], allies: [['sparx_spyro', 'Sparx', 'hacker'], ['hunter_spyro', 'Hunter', 'tactical']], theme: 'dragon realms, gems, portals, gliding, and colorful platforming magic', motif: 'castle', colors: ['#2b1750', '#05020a', '#b56dff'] },
    { key: 'rayman', universe: 'Rayman', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Rayman', stage: 'Dream Forest Electoon Rift', boss: 'Mr Dark Nightmare Hand', hero: ['rayman_hero', 'Rayman', 'slayer'], allies: [['globox_rayman', 'Globox', 'marine'], ['betilla_rayman', 'Betilla', 'hacker']], theme: 'limbless platforming, dream worlds, lums, strange music, and surreal cartoon hazards', motif: 'arcanecity', colors: ['#1b3f39', '#030807', '#ffdc4a'] },
    { key: 'croc', universe: 'Croc', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Croc', stage: 'Gobbo Island Baron Raid', boss: 'Baron Dante Crystal Beast', hero: ['croc_hero', 'Croc', 'slayer'], allies: [['gobbo_chief', 'Gobbo Chief', 'tactical'], ['beany_bird', 'Beany Bird', 'hacker']], theme: 'gobbo rescue, island castles, crystal monsters, and cheerful platform adventure', motif: 'castle', colors: ['#163b18', '#030803', '#7dff5a'] },
    { key: 'parasite_eve', universe: 'Parasite Eve', mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Parasite Eve', stage: 'NYC Mitochondria Opera', boss: 'Eve Ultimate Being', hero: ['aya_brea', 'Aya Brea', 'tactical'], allies: [['daniel_dollis', 'Daniel Dollis', 'marine'], ['maeda_pe', 'Kunihiko Maeda', 'hacker']], theme: 'mitochondrial horror, opera mutations, police investigation, and biological ascension', motif: 'facility', colors: ['#261314', '#050202', '#ff5f4a'] },
    { key: 'oddworld', universe: 'Oddworld', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Oddworld', stage: 'RuptureFarms Mudokon Escape', boss: 'Molluck Industrial Grinder', hero: ['abe_oddworld', 'Abe', 'hacker'], allies: [['munch_oddworld', 'Munch', 'tactical'], ['alf_mudokon', 'Alf', 'marine']], theme: 'industrial slavery, Mudokon chanting, possession puzzles, and dark alien satire', motif: 'facility', colors: ['#162b22', '#030605', '#7edc8a'] },
    { key: 'legacy_kain', universe: 'Legacy of Kain', mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Legacy of Kain', stage: 'Nosgoth Soul Reaver Rift', boss: 'Elder God Fate Engine', hero: ['kain_lok', 'Kain', 'horror'], allies: [['raziel_lok', 'Raziel', 'slayer'], ['moebius_lok', 'Moebius', 'hacker']], theme: 'vampire dynasties, soul reaving, fate loops, and decaying gothic Nosgoth', motif: 'castle', colors: ['#201126', '#040205', '#8d5aff'] },
    { key: 'rugrats', universe: 'Rugrats', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Rugrats', stage: 'Backyard Baby Imagination', boss: 'Reptar Toy Rampage', hero: ['tommy_pickles', 'Tommy Pickles', 'hacker'], allies: [['chuckie_finster', 'Chuckie Finster', 'tactical'], ['angelica_pickles', 'Angelica Pickles', 'horror']], theme: 'baby imagination, household objects, Reptar fantasies, and tiny-scale adventure logic', motif: 'arcanecity', colors: ['#2e3d17', '#060803', '#c7ff4a'] },
    { key: 'guitar_hero', universe: 'Guitar Hero', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Guitar Hero', stage: 'Stadium Note Highway', boss: 'Star Power Feedback Demon', hero: ['guitar_hero_avatar', 'Guitar Hero', 'slayer'], allies: [['judy_nails', 'Judy Nails', 'hacker'], ['axel_steel', 'Axel Steel', 'marine']], theme: 'note highways, star power, plastic guitars, crowd energy, and rhythm duel spectacle', motif: 'facility', colors: ['#241433', '#050207', '#ff4fd8'] },
    { key: 'enchanted', universe: 'Enchanted', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Il etait une fois', stage: 'Andalasia Manhattan Spell', boss: 'Narissa Dragon Curse', hero: ['giselle_enchanted', 'Giselle', 'hacker'], allies: [['robert_enchanted', 'Robert Philip', 'tactical'], ['edward_enchanted', 'Prince Edward', 'slayer']], theme: 'fairy-tale logic, Manhattan culture shock, musical spells, and dragon queen curses', motif: 'arcanecity', colors: ['#351b3d', '#07030a', '#ff9fe8'] },
    { key: 'simpsons', universe: 'The Simpsons', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Simpson', stage: 'Springfield Nuclear Gag Breach', boss: 'Mr Burns Reactor Scheme', hero: ['homer_simpson', 'Homer Simpson', 'horror'], allies: [['bart_simpson', 'Bart Simpson', 'slayer'], ['lisa_simpson', 'Lisa Simpson', 'hacker']], theme: 'Springfield satire, nuclear accidents, family chaos, and endless sitcom reality resets', motif: 'arcanecity', colors: ['#2e2b12', '#070603', '#ffd83d'] },
    { key: 'futurama', universe: 'Futurama', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Futurama', stage: 'Planet Express Timeline Leak', boss: 'Hypnotoad Delivery Singularity', hero: ['fry_futurama', 'Philip J. Fry', 'hacker'], allies: [['leela_futurama', 'Leela', 'slayer'], ['bender_futurama', 'Bender', 'marine']], theme: 'future delivery work, robot crime, alien bureaucracy, and time paradox comedy', motif: 'shipdeck', colors: ['#152b3d', '#03070a', '#55dfff'] },
    { key: 'big_mouth', universe: 'Big Mouth', mediaType: 'series', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'Big Mouth', stage: 'Hormone Monster Hallway', boss: 'Shame Wizard Spiral', hero: ['nick_bigmouth', 'Nick Birch', 'hacker'], allies: [['andrew_bigmouth', 'Andrew Glouberman', 'horror'], ['jessi_bigmouth', 'Jessi Glaser', 'tactical']], theme: 'puberty monsters, awkward school chaos, emotional avatars, and surreal adult animation', motif: 'hauntedset', colors: ['#2b1730', '#060307', '#ff6aa5'] },
    { key: 'family_guy', universe: 'Family Guy', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Griffin', stage: 'Quahog Cutaway Rift', boss: 'Chicken Fight Continuity Break', hero: ['peter_griffin', 'Peter Griffin', 'horror'], allies: [['stewie_griffin', 'Stewie Griffin', 'hacker'], ['brian_griffin', 'Brian Griffin', 'tactical']], theme: 'cutaway gags, Quahog chaos, talking dogs, and reality-breaking comedy loops', motif: 'arcanecity', colors: ['#203350', '#05070a', '#7dc7ff'] },
    { key: 'american_dad', universe: 'American Dad', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Medium', titleFr: 'American Dad', stage: 'CIA Langley Alien Coverup', boss: 'Roger Persona Cascade', hero: ['stan_smith', 'Stan Smith', 'marine'], allies: [['roger_alien', 'Roger', 'hacker'], ['hayley_smith', 'Hayley Smith', 'tactical']], theme: 'CIA paranoia, alien disguises, family politics, and absurd covert operations', motif: 'facility', colors: ['#182b44', '#030609', '#ff4f5c'] },
    { key: 'killzone', universe: 'Killzone', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Killzone', stage: 'Helghan Warzone Breach', boss: 'Helghast MAWLR Command', hero: ['sev_killzone', 'Sev', 'marine'], allies: [['rico_killzone', 'Rico', 'slayer'], ['echo_killzone', 'Echo', 'tactical']], theme: 'Helghast warfare, ISA squads, industrial planets, and red-eyed battlefield pressure', motif: 'fortress', colors: ['#171d22', '#030405', '#ff3d32'] },
    { key: 'yakuza', universe: 'Yakuza', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Yakuza', stage: 'Kamurocho Street Brawl', boss: 'Tojo Clan Dragon Trial', hero: ['kiryu_yakuza', 'Kazuma Kiryu', 'slayer'], allies: [['majima_yakuza', 'Goro Majima', 'horror'], ['ichiban_yakuza', 'Ichiban Kasuga', 'tactical']], theme: 'street brawls, clan honor, karaoke side quests, and dramatic crime melodrama', motif: 'arcanecity', colors: ['#221313', '#040202', '#ff5252'] },
    { key: 'soul_calibur', universe: 'Soul Calibur', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Soul Calibur', stage: 'Cursed Sword Duel Shrine', boss: 'Inferno Soul Edge Avatar', hero: ['nightmare_sc', 'Nightmare', 'horror'], allies: [['siegfried_sc', 'Siegfried', 'slayer'], ['ivy_sc', 'Ivy', 'tactical']], theme: 'cursed blades, weapon masters, ancient arenas, and soul-consuming sword rituals', motif: 'castle', colors: ['#191326', '#030205', '#806dff'] },
    { key: 'last_of_us', universe: 'The Last of Us', mediaType: 'game', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'The Last of Us', stage: 'Cordyceps Quarantine Zone', boss: 'Bloater Spore Nest', hero: ['ellie_tlou', 'Ellie', 'slayer'], allies: [['joel_tlou', 'Joel', 'marine'], ['tess_tlou', 'Tess', 'tactical']], theme: 'cordyceps infection, ruined cities, stealth survival, and found-family desperation', motif: 'wasteland', colors: ['#1d2518', '#030403', '#a0b86a'] },
    { key: 'little_big_planet', universe: 'LittleBigPlanet', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'LittleBigPlanet', stage: 'Craftworld Sticker Breach', boss: 'Negativitron Stitch Storm', hero: ['sackboy_lbp', 'Sackboy', 'hacker'], allies: [['sackgirl_lbp', 'Sackgirl', 'tactical'], ['toggle_lbp', 'Toggle', 'marine']], theme: 'Craftworld creativity, stickers, handmade physics, and imagination-powered platforming', motif: 'arcanecity', colors: ['#2b2113', '#050403', '#f2c06b'] },
    { key: 'counter_strike', universe: 'Counter-Strike', mediaType: 'game', faction: 'cyber', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Counter-Strike', stage: 'Dust II Bombsite Breach', boss: 'Defuse Timer Singularity', hero: ['ct_operator_cs', 'CT Operator', 'tactical'], allies: [['terrorist_cs', 'Rogue Terrorist', 'slayer'], ['awper_cs', 'AWPer', 'marine']], theme: 'bombsites, economy rounds, tactical peeks, defuse kits, and esports pressure', motif: 'facility', colors: ['#222820', '#050605', '#d7b45a'] },
    { key: 'left_4_dead', universe: 'Left 4 Dead', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Left 4 Dead', stage: 'No Mercy Rooftop Horde', boss: 'Tank Witch Crescendo', hero: ['zoey_l4d', 'Zoey', 'slayer'], allies: [['bill_l4d', 'Bill', 'marine'], ['ellis_l4d', 'Ellis', 'tactical']], theme: 'co-op zombie hordes, safe rooms, special infected, and desperate extraction finales', motif: 'hauntedset', colors: ['#1a1812', '#030302', '#d6563c'] },
    { key: 'team_fortress_2', universe: 'Team Fortress 2', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Team Fortress 2', stage: '2Fort Payload Breach', boss: 'Mann Co. Mercenary Stampede', hero: ['scout_tf2', 'Scout', 'slayer'], allies: [['heavy_tf2', 'Heavy', 'marine'], ['medic_tf2', 'Medic', 'hacker']], theme: 'class-based mayhem, payloads, hats, mercenary banter, and cartoon explosives', motif: 'fortress', colors: ['#2c1a14', '#060302', '#ff7a45'] },
    { key: 'lost_planet_2', universe: 'Lost Planet 2', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Lost Planet 2', stage: 'EDN III Akrid Hunt', boss: 'Category G Akrid Leviathan', hero: ['snow_pirate_lp2', 'Snow Pirate', 'marine'], allies: [['wayne_lp2', 'Wayne Echo', 'slayer'], ['thermal_engineer_lp2', 'Thermal Engineer', 'hacker']], theme: 'Akrid hunts, thermal energy, hostile planets, giant monsters, and armored squad warfare', motif: 'wasteland', colors: ['#132a35', '#020608', '#62d9ff'] },
    { key: 'seaman', universe: 'Seaman', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Seaman', stage: 'Talking Aquarium Rift', boss: 'Evolved Seaman Oracle', hero: ['seaman_oracle', 'Seaman', 'hacker'], allies: [['aquarium_keeper', 'Aquarium Keeper', 'tactical'], ['frogman_seaman', 'Frogman Echo', 'horror']], theme: 'talking fish psychology, aquarium care, surreal life simulation, and strange conversations', motif: 'facility', colors: ['#12343b', '#020708', '#6ee6d8'] },
    { key: 'jet_set_radio', universe: 'Jet Set Radio', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Jet Set Radio', stage: 'Tokyo-to Graffiti Run', boss: 'Rokkaku Police Tank', hero: ['beat_jsr', 'Beat', 'slayer'], allies: [['gum_jsr', 'Gum', 'tactical'], ['professor_k_jsr', 'Professor K', 'hacker']], theme: 'inline skating, pirate radio, graffiti tags, police chases, and cel-shaded rebellion', motif: 'arcanecity', colors: ['#102d2a', '#020605', '#5dff8a'] },
    { key: 'dynamite_duke', universe: 'Dynamite Duke', mediaType: 'game', faction: 'sciFi', mode: 'Smash', difficulty: 'Medium', titleFr: 'Dynamite Duke', stage: 'Bio-Army Arcade Assault', boss: 'Mutant Commander Duke Duel', hero: ['dynamite_duke', 'Duke', 'marine'], allies: [['arcade_commando_duke', 'Arcade Commando', 'slayer'], ['intel_duke', 'Intel Operator', 'hacker']], theme: 'arcade run-and-gun action, mutant soldiers, explosions, and punch-heavy commando raids', motif: 'facility', colors: ['#2a1f14', '#050403', '#ff9b3d'] },
    { key: 'altered_beast', universe: 'Altered Beast', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Altered Beast', stage: 'Ancient Beast Resurrection', boss: 'Neff Demon God', hero: ['centurion_ab', 'Beast Centurion', 'horror'], allies: [['werewolf_ab', 'Werewolf Form', 'slayer'], ['zeus_ab', 'Zeus Signal', 'hacker']], theme: 'ancient resurrection, beast transformations, mythic demons, and arcade body horror', motif: 'castle', colors: ['#251612', '#050302', '#d6a04a'] },
    { key: 'streets_of_rage', universe: 'Streets of Rage', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Streets of Rage', stage: 'Wood Oak City Riot', boss: 'Mr X Syndicate Tower', hero: ['axel_sor', 'Axel Stone', 'slayer'], allies: [['blaze_sor', 'Blaze Fielding', 'slayer'], ['adam_sor', 'Adam Hunter', 'tactical']], theme: 'street brawling, crime syndicates, neon alleys, police specials, and beat-em-up rhythm', motif: 'arcanecity', colors: ['#1e1428', '#040306', '#ff4f9a'] },
    { key: 'cool_spot', universe: 'Cool Spot', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Cool Spot', stage: 'Soda Beach Bubble Pop', boss: 'Bottle Cap Brand Storm', hero: ['cool_spot', 'Cool Spot', 'slayer'], allies: [['bubble_spot', 'Bubble Spot', 'hacker'], ['lifeguard_spot', 'Beach Guard', 'tactical']], theme: 'brand mascot platforming, soda bubbles, beach hazards, and 90s advertising surrealism', motif: 'wasteland', colors: ['#301018', '#070203', '#ff2f55'] },
    { key: 'earthworm_jim', universe: 'Earthworm Jim', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Earthworm Jim', stage: 'New Junk City Launch', boss: 'Psy-Crow Queen Slug-for-a-Butt', hero: ['earthworm_jim', 'Earthworm Jim', 'slayer'], allies: [['peter_puppy', 'Peter Puppy', 'horror'], ['princess_whats_her_name', 'Princess Whats-Her-Name', 'tactical']], theme: 'absurd platform shooting, worm-in-suit heroics, junk planets, and cartoon cosmic nonsense', motif: 'wasteland', colors: ['#18351f', '#030703', '#aaff4d'] },
    { key: 'ecco', universe: 'Ecco the Dolphin', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Hard', titleFr: 'Ecco the Dolphin', stage: 'Tides of Time Ocean Rift', boss: 'Vortex Queen Deep Signal', hero: ['ecco_dolphin', 'Ecco', 'hacker'], allies: [['atlantean_ecco', 'Atlantean Glyph', 'tactical'], ['orca_echo', 'Orca Echo', 'marine']], theme: 'ocean exploration, sonar puzzles, alien vortex threats, and time-bending aquatic mystery', motif: 'wasteland', colors: ['#05283f', '#010508', '#4edcff'] },
    { key: 'flashback', universe: 'Flashback', mediaType: 'game', faction: 'cyber', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Flashback', stage: 'Titan Jungle Memory Lab', boss: 'Morph Infiltration Core', hero: ['conrad_flashback', 'Conrad B. Hart', 'tactical'], allies: [['ian_flashback', 'Ian', 'hacker'], ['agent_flashback', 'Resistance Agent', 'marine']], theme: 'rotoscoped sci-fi, erased memories, alien infiltrators, and dystopian platform puzzles', motif: 'facility', colors: ['#10242e', '#020506', '#62d3e8'] },
    { key: 'ristar', universe: 'Ristar', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Ristar', stage: 'Valdi Star Handle Rift', boss: 'Kaiser Greedy Star Tyrant', hero: ['ristar_hero', 'Ristar', 'slayer'], allies: [['star_handle', 'Star Handle', 'hacker'], ['planet_guardian_ristar', 'Planet Guardian', 'tactical']], theme: 'stretchy star heroics, planetary stages, grabbing movement, and colorful cosmic rescue', motif: 'shipdeck', colors: ['#152b4d', '#02050a', '#ffe84d'] },
    { key: 'splatterhouse', universe: 'Splatterhouse', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Splatterhouse', stage: 'West Mansion Gore Rift', boss: 'Terror Mask Hell Beast', hero: ['rick_splatterhouse', 'Rick Taylor', 'horror'], allies: [['jennifer_splatterhouse', 'Jennifer Willis', 'tactical'], ['terror_mask', 'Terror Mask', 'hacker']], theme: 'masked rage, haunted mansions, body horror, and brutal arcade survival', motif: 'hauntedset', colors: ['#250b0b', '#050101', '#ff2a2a'] },
    { key: 'woodruff', universe: 'Woodruff', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Woodruff', stage: 'Bouzouk City Absurdity', boss: 'Bigwig Bureaucratic Tyrant', hero: ['woodruff_hero', 'Woodruff', 'hacker'], allies: [['professor_azimuth', 'Professor Azimuth', 'tactical'], ['boozook_guard', 'Bouzouk Guard', 'slayer']], theme: 'French adventure absurdity, strange puzzles, post-human satire, and bureaucratic surrealism', motif: 'arcanecity', colors: ['#273218', '#050703', '#c8ef58'] },
    { key: 'skibidi', universe: 'Skibidi', mediaType: 'series', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Skibidi', stage: 'Camera City Toilet War', boss: 'Titan Toilet Broadcast Core', hero: ['cameraman_skibidi', 'Cameraman', 'tactical'], allies: [['speakerman_skibidi', 'Speakerman', 'slayer'], ['tvman_skibidi', 'TV Man', 'hacker']], theme: 'viral video war, camera soldiers, speaker blasts, and surreal toilet invasion escalation', motif: 'arcanecity', colors: ['#171b22', '#030405', '#80e8ff'] },
    { key: 'squid_game', universe: 'Squid Game', mediaType: 'series', faction: 'horror', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Squid Game', stage: 'Red Light Green Light Arena', boss: 'Front Man Debt Trial', hero: ['gi_hun_squid', 'Seong Gi-hun', 'tactical'], allies: [['sae_byeok_squid', 'Sae-byeok', 'slayer'], ['ali_squid', 'Ali Abdul', 'marine']], theme: 'deadly children games, masked guards, debt pressure, and social survival trials', motif: 'facility', colors: ['#24131c', '#050203', '#ff3f8f'] },
    { key: 'casa_papel', universe: 'La Casa de Papel', mediaType: 'series', faction: 'cyber', mode: 'Tactics', difficulty: 'Hard', titleFr: 'La Casa de Papel', stage: 'Royal Mint Hostage Plan', boss: 'Inspector Siege Countdown', hero: ['professor_casa', 'The Professor', 'hacker'], allies: [['tokyo_casa', 'Tokyo', 'slayer'], ['nairobi_casa', 'Nairobi', 'tactical']], theme: 'heist planning, masks, hostages, police pressure, and rebellion iconography', motif: 'facility', colors: ['#2d1010', '#060202', '#ff2f2f'] },
    { key: 'skrillex', universe: 'Skrillex', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Skrillex', stage: 'Dubstep Bass Drop Breach', boss: 'Wub Singularity', hero: ['skrillex_avatar', 'Skrillex Avatar', 'hacker'], allies: [['bass_rider_skrillex', 'Bass Rider', 'slayer'], ['laser_dj_skrillex', 'Laser DJ', 'tactical']], theme: 'dubstep drops, neon bass pressure, glitch edits, and club-scale sonic ruptures', motif: 'facility', colors: ['#180f2e', '#030206', '#c14dff'] },
    { key: 'gorillaz', universe: 'Gorillaz', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'Gorillaz', stage: 'Plastic Beach Demon Studio', boss: 'Murdoc Bassline Phantom', hero: ['2d_gorillaz', '2-D', 'hacker'], allies: [['noodle_gorillaz', 'Noodle', 'slayer'], ['russel_gorillaz', 'Russel', 'marine']], theme: 'virtual band myth, haunted studios, plastic beaches, and animated genre-shifting sound', motif: 'shipdeck', colors: ['#102e35', '#020608', '#5ed6c8'] },
    { key: 'indila', universe: 'Indila', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Indila', stage: 'Derniere Danse Memory Street', boss: 'Echo of the Lost City', hero: ['indila_avatar', 'Indila Avatar', 'hacker'], allies: [['danse_echo', 'Danse Echo', 'tactical'], ['mini_world_spirit', 'Mini World Spirit', 'slayer']], theme: 'melancholic pop, cinematic streets, memory storms, and emotional resonance waves', motif: 'arcanecity', colors: ['#1d2638', '#03050a', '#d8a0ff'] },
    { key: 'monkey_island', universe: 'Secret of Monkey Island', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Secret of Monkey Island', stage: 'Melee Island Insult Duel', boss: 'LeChuck Ghost Pirate', hero: ['guybrush_threepwood', 'Guybrush Threepwood', 'hacker'], allies: [['elaine_marley', 'Elaine Marley', 'tactical'], ['stan_monkey', 'Stan', 'slayer']], theme: 'pirate comedy, insult swordfighting, ghost curses, and point-and-click puzzle logic', motif: 'wasteland', colors: ['#1b2f3a', '#030608', '#ffd15a'] },
    { key: 'zombies_neighbors', universe: 'Zombies Ate My Neighbors', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Zombies Ate My Neighbors', stage: 'Suburban Monster Rescue', boss: 'Giant Baby Chainsaw Panic', hero: ['zeke_zamn', 'Zeke', 'slayer'], allies: [['julie_zamn', 'Julie', 'tactical'], ['neighbor_rescue', 'Neighbor Rescue', 'hacker']], theme: 'suburban monster chaos, water guns, rescue runs, B-movie enemies, and arcade panic', motif: 'hauntedset', colors: ['#172b18', '#030603', '#7dff4f'] },
    { key: 'wrong_turn', universe: 'Wrong Turn', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Wrong Turn', stage: 'Backwoods Trap Ambush', boss: 'Mountain Clan Butcher', hero: ['jessie_wrongturn', 'Jessie Burlingame', 'tactical'], allies: [['chris_wrongturn', 'Chris Flynn', 'marine'], ['carly_wrongturn', 'Carly', 'hacker']], theme: 'backwoods traps, brutal survival, wrong roads, and isolated forest ambushes', motif: 'wasteland', colors: ['#171f10', '#030402', '#b5d15a'] },
    { key: 'kyary', universe: 'Kyary Pamyu Pamyu', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Kyary Pamyu Pamyu', stage: 'Harajuku Candy Pop Rift', boss: 'Kawaii Nightmare Parade', hero: ['kyary_avatar', 'Kyary Avatar', 'hacker'], allies: [['ponpon_dancer', 'PonPon Dancer', 'slayer'], ['fashion_spirit_kyary', 'Fashion Spirit', 'tactical']], theme: 'Harajuku surreal pop, candy colors, fashion monsters, and dreamlike music-video logic', motif: 'arcanecity', colors: ['#35143a', '#07020a', '#ff78df'] },
    { key: 'karune_cal', universe: 'Karune Cal', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Medium', titleFr: 'Karune Cal', stage: 'Synthetic Vocal Archive', boss: 'Resonance Voice Core', hero: ['karune_cal_avatar', 'Karune Cal Avatar', 'hacker'], allies: [['vocal_patch_cal', 'Vocal Patch', 'tactical'], ['signal_dancer_cal', 'Signal Dancer', 'slayer']], theme: 'synthetic vocal energy, fan archive echoes, digital stages, and fragile identity signals', motif: 'facility', colors: ['#151c2d', '#030407', '#8ed6ff'] },
    { key: 'sub_urban', universe: 'Sub Urban', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Sub Urban', stage: 'Cradles Dollhouse Breach', boss: 'Freakshow Shadow Ringmaster', hero: ['sub_urban_avatar', 'Sub Urban Avatar', 'horror'], allies: [['cradles_echo', 'Cradles Echo', 'hacker'], ['freak_dancer_sub', 'Freak Dancer', 'slayer']], theme: 'dark pop, dollhouse imagery, circus unease, and glitchy emotional nightmares', motif: 'hauntedset', colors: ['#201326', '#040205', '#b86cff'] },
    { key: 'billie_eilish', universe: 'Billie Eilish', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Billie Eilish', stage: 'Bad Guy Neon Bedroom', boss: 'Ocean Eyes Nightmare', hero: ['billie_avatar', 'Billie Avatar', 'hacker'], allies: [['neon_shadow_billie', 'Neon Shadow', 'horror'], ['whisper_beat_billie', 'Whisper Beat', 'tactical']], theme: 'whisper pop, neon dread, dreamlike rooms, and quiet bass-heavy menace', motif: 'hauntedset', colors: ['#101812', '#020302', '#86ff61'] },
    { key: 'bella_poarch', universe: 'Bella Poarch', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Bella Poarch', stage: 'Build-a-Breach Doll Factory', boss: 'Inferno Doll Core', hero: ['bella_poarch_avatar', 'Bella Avatar', 'hacker'], allies: [['doll_guard_bella', 'Doll Guard', 'tactical'], ['inferno_dancer_bella', 'Inferno Dancer', 'slayer']], theme: 'viral pop, doll-factory rebellion, hyper-polished visuals, and social-feed glitch combat', motif: 'facility', colors: ['#2a1420', '#050203', '#ff709e'] },
    { key: 'man_with_mission', universe: 'Man with a Mission', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Man with a Mission', stage: 'Wolfhead Rock Operation', boss: 'Mission Bass Predator', hero: ['mwam_avatar', 'Wolfhead Vocalist', 'slayer'], allies: [['dj_santa_monica', 'DJ Santa Monica', 'hacker'], ['rock_commando_mwam', 'Rock Commando', 'marine']], theme: 'wolf-mask rock, anime openings, mission energy, and high-speed live-show combat', motif: 'facility', colors: ['#161f24', '#030405', '#d5e5f0'] },
    { key: 'guns_n_roses', universe: 'Guns N Roses', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Guns N Roses', stage: 'Paradise City Amp Riot', boss: 'Appetite Feedback Serpent', hero: ['gnr_frontman', 'Rose Stage Avatar', 'slayer'], allies: [['slash_avatar', 'Top Hat Guitarist', 'hacker'], ['jungle_drummer_gnr', 'Jungle Drummer', 'marine']], theme: 'hard rock swagger, guitar solos, stadium chaos, and dangerous glam energy', motif: 'arcanecity', colors: ['#2b1111', '#060202', '#ff3f3f'] },
    { key: 'band_maid', universe: 'Band-Maid', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Band-Maid', stage: 'Maid Rock Serving Stage', boss: 'Domination Feedback Core', hero: ['bandmaid_avatar', 'Maid Rocker', 'slayer'], allies: [['guitar_maid', 'Guitar Maid', 'hacker'], ['drum_maid', 'Drum Maid', 'marine']], theme: 'maid costumes, hard rock precision, live-house energy, and disciplined stage assault', motif: 'facility', colors: ['#181818', '#030303', '#f0f0f0'] },
    { key: 'bring_me_horizon', universe: 'Bring Me the Horizon', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Bring Me the Horizon', stage: 'Post-Human Mosh Pit', boss: 'Sempiternal Hex Core', hero: ['bmth_avatar', 'Post-Human Vocalist', 'horror'], allies: [['amo_signal', 'Amo Signal', 'hacker'], ['mosh_guard_bmth', 'Mosh Guard', 'slayer']], theme: 'metalcore surges, cyber-horror visuals, emotional collapse, and arena breakdowns', motif: 'hauntedset', colors: ['#15151f', '#030304', '#ff4f6d'] },
    { key: 'blackpink', universe: 'Blackpink', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Blackpink', stage: 'Pink Venom Arena', boss: 'DDU-DU Cannon Core', hero: ['blackpink_avatar', 'Blackpink Unit', 'slayer'], allies: [['pink_venom_dancer', 'Pink Venom Dancer', 'hacker'], ['blink_guard', 'Blink Guard', 'tactical']], theme: 'K-pop spectacle, fashion weapons, synchronized strikes, and arena-scale bass drops', motif: 'arcanecity', colors: ['#250f1e', '#050203', '#ff5fb7'] },
    { key: 'lil_nas_x', universe: 'Lil Nas X', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Lil Nas X', stage: 'Montero Neon Descent', boss: 'Old Town Road Rift Rider', hero: ['lilnasx_avatar', 'Montero Avatar', 'slayer'], allies: [['star_walkin_echo', 'Star Walkin Echo', 'hacker'], ['rodeo_guard', 'Rodeo Guard', 'tactical']], theme: 'genre fusion, mythic pop imagery, cowboy neon, and self-made spectacle portals', motif: 'arcanecity', colors: ['#27144a', '#05020a', '#ff6bd6'] },
    { key: 'eminem', universe: 'Eminem', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'Eminem', stage: 'Slim Shady Rap Battle', boss: 'Rap God Wordstorm', hero: ['eminem_avatar', 'Slim Shady Avatar', 'hacker'], allies: [['stan_echo', 'Stan Echo', 'horror'], ['detroit_cipher', 'Detroit Cipher', 'tactical']], theme: 'rapid-fire rap, alter egos, battle lyrics, Detroit grit, and verbal pressure waves', motif: 'arcanecity', colors: ['#1c1c1c', '#030303', '#d8d8d8'] },
    { key: 'atarashii_gakko', universe: 'Atarashii Gakko', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Atarashii Gakko', stage: 'Seishun School Riot', boss: 'Discipline Dance Core', hero: ['atarashii_unit', 'Atarashii Unit', 'slayer'], allies: [['school_dancer_ag', 'School Dancer', 'tactical'], ['megaphone_ag', 'Megaphone Signal', 'hacker']], theme: 'school-uniform rebellion, sharp choreography, punk-pop energy, and synchronized chaos', motif: 'facility', colors: ['#171723', '#030304', '#ff3333'] },
    { key: 'queen_bee', universe: 'Queen Bee', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Queen Bee', stage: 'Avu-Chan Honeycomb Stage', boss: 'Hypnotic Hive Diva', hero: ['queen_bee_avatar', 'Queen Bee Avatar', 'hacker'], allies: [['honey_dancer_qb', 'Honey Dancer', 'slayer'], ['velvet_signal_qb', 'Velvet Signal', 'tactical']], theme: 'glam rock, hypnotic vocals, honeycomb visuals, and theatrical identity storms', motif: 'hauntedset', colors: ['#2b1810', '#060302', '#ffc247'] },
    { key: 'ghost_band', universe: 'Ghost', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Ghost', stage: 'Ritual Chapel Concert', boss: 'Papa Emeritus Antipope', hero: ['papa_emeritus', 'Papa Emeritus', 'horror'], allies: [['nameless_ghoul', 'Nameless Ghoul', 'slayer'], ['sister_imperator', 'Sister Imperator', 'tactical']], theme: 'occult rock, cathedral staging, masked musicians, and ritualized arena spectacle', motif: 'castle', colors: ['#1c1218', '#030203', '#d9b86b'] },
    { key: 'babymetal', universe: 'Babymetal', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Babymetal', stage: 'Fox God Metal Galaxy', boss: 'Kami Band Rift Fox', hero: ['babymetal_unit', 'Babymetal Unit', 'slayer'], allies: [['fox_god_signal', 'Fox God Signal', 'hacker'], ['kami_band_guard', 'Kami Band Guard', 'marine']], theme: 'kawaii metal, fox mythology, synchronized dance, and heavy galaxy riffs', motif: 'castle', colors: ['#1b0f18', '#030203', '#ff335f'] },
    { key: 'ladybaby', universe: 'Ladybaby', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Ladybaby', stage: 'Kawaii Metal Pop Burst', boss: 'Cute Riot Feedback', hero: ['ladybaby_unit', 'Ladybaby Unit', 'slayer'], allies: [['idol_guard_ladybaby', 'Idol Guard', 'tactical'], ['metal_cute_signal', 'Metal Cute Signal', 'hacker']], theme: 'idol metal fusion, cute chaos, heavy riffs, and bright stage absurdity', motif: 'arcanecity', colors: ['#311727', '#070304', '#ff79c8'] },
    { key: 'bigflo_oli', universe: 'Bigflo & Oli', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Bigflo & Oli', stage: 'Toulouse Rap Storyline', boss: 'Narrative Verse Storm', hero: ['bigflo_oli_unit', 'Bigflo & Oli', 'hacker'], allies: [['toulouse_crowd', 'Toulouse Crowd', 'tactical'], ['verse_guard_bfo', 'Verse Guard', 'slayer']], theme: 'French rap storytelling, brother duo energy, city pride, and emotional verse missions', motif: 'arcanecity', colors: ['#1b2a38', '#030506', '#ffb14f'] },
    { key: 'little_big_band', universe: 'Little Big', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Little Big', stage: 'Rave Meme Factory', boss: 'Skibidi Bass Trickster', hero: ['little_big_unit', 'Little Big Unit', 'hacker'], allies: [['rave_dancer_lb', 'Rave Dancer', 'slayer'], ['meme_signal_lb', 'Meme Signal', 'tactical']], theme: 'rave absurdity, meme choreography, hard bass, and satirical dance-floor combat', motif: 'facility', colors: ['#25143a', '#050208', '#8dff4a'] },
    { key: 'the_weeknd', universe: 'The Weeknd', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'The Weeknd', stage: 'After Hours Neon City', boss: 'Blinding Lights Red Suit', hero: ['weeknd_avatar', 'After Hours Avatar', 'hacker'], allies: [['neon_driver_weeknd', 'Neon Driver', 'tactical'], ['starboy_echo', 'Starboy Echo', 'slayer']], theme: 'nocturnal pop, neon city drives, red-suit imagery, and cinematic synthwave loneliness', motif: 'arcanecity', colors: ['#171326', '#030205', '#ff2f4f'] },
    { key: 'hoshi_music', universe: 'Hoshi', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Hoshi', stage: 'Coeur Parapluie Signal', boss: 'Amour Censure Storm', hero: ['hoshi_avatar', 'Hoshi Avatar', 'hacker'], allies: [['parapluie_echo', 'Parapluie Echo', 'tactical'], ['coeur_guard_hoshi', 'Coeur Guard', 'slayer']], theme: 'French pop emotion, intimate stages, heart imagery, and sincere vocal resonance', motif: 'arcanecity', colors: ['#251b28', '#050305', '#ff8fb6'] },
    { key: 'ado', universe: 'Ado', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Ado', stage: 'Usseewa Vocal Storm', boss: 'Show Shadow Diva', hero: ['ado_avatar', 'Ado Avatar', 'horror'], allies: [['uta_echo_ado', 'Uta Echo', 'hacker'], ['rebellion_dancer_ado', 'Rebellion Dancer', 'slayer']], theme: 'powerful vocals, rebellious silhouettes, anime-stage intensity, and shadowed pop theatre', motif: 'hauntedset', colors: ['#171327', '#030205', '#3f6dff'] },
    { key: 'asmrz', universe: 'ASMRZ', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Medium', titleFr: 'ASMRZ', stage: 'Whisper Signal Lab', boss: 'Tingle Frequency Core', hero: ['asmrz_avatar', 'ASMRZ Avatar', 'hacker'], allies: [['whisper_operator', 'Whisper Operator', 'tactical'], ['microphone_guard', 'Microphone Guard', 'slayer']], theme: 'whisper textures, close-mic signals, delicate triggers, and frequency-based calm combat', motif: 'facility', colors: ['#14252a', '#030506', '#8fffea'] },
    { key: 'lady_gaga', universe: 'Lady Gaga', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Lady Gaga', stage: 'Chromatica Fame Monster', boss: 'Bad Romance Paparazzi Core', hero: ['gaga_avatar', 'Gaga Avatar', 'slayer'], allies: [['little_monster_guard', 'Little Monster Guard', 'hacker'], ['chromatica_dancer', 'Chromatica Dancer', 'tactical']], theme: 'theatrical pop, fame monsters, fashion armor, and arena-scale reinvention rituals', motif: 'arcanecity', colors: ['#2e1431', '#060207', '#ff78ff'] },
    { key: 'within_temptation', universe: 'Within Temptation', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Within Temptation', stage: 'Symphonic Storm Cathedral', boss: 'Mother Earth Angel Core', hero: ['within_temptation_avatar', 'Symphonic Guardian', 'hacker'], allies: [['angelic_guitar_wt', 'Angelic Guitar', 'slayer'], ['cathedral_drum_wt', 'Cathedral Drum', 'marine']], theme: 'symphonic metal, gothic choirs, angelic storms, and cinematic fantasy battlefields', motif: 'castle', colors: ['#151c2a', '#030406', '#9fd8ff'] },
    { key: 'nightwish', universe: 'Nightwish', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Nightwish', stage: 'Imaginaerum Dream Theater', boss: 'Dark Passion Play Titan', hero: ['nightwish_avatar', 'Imaginaerum Bard', 'hacker'], allies: [['opera_voice_nightwish', 'Opera Voice', 'tactical'], ['metal_ship_nightwish', 'Metal Ship', 'marine']], theme: 'symphonic metal, fantasy voyages, operatic storms, and dream-theatre epics', motif: 'shipdeck', colors: ['#111b2d', '#020406', '#7fb6ff'] },
    { key: 'ultravomit', universe: 'Ultra Vomit', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Ultra Vomit', stage: 'Metal Parody Kitchen', boss: 'Kammthaar Comedy Riff', hero: ['ultravomit_avatar', 'Ultra Vomit Avatar', 'horror'], allies: [['parody_riffer_uv', 'Parody Riffer', 'slayer'], ['blast_joke_uv', 'Blast Joke', 'hacker']], theme: 'French parody metal, absurd riffs, genre jokes, and heavy comedy stage chaos', motif: 'hauntedset', colors: ['#22180f', '#050302', '#ffb547'] },
    { key: 'psy', universe: 'PSY', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'PSY', stage: 'Gangnam Dancefloor Rift', boss: 'Horse Dance Bass Core', hero: ['psy_avatar', 'PSY Avatar', 'hacker'], allies: [['gangnam_dancer', 'Gangnam Dancer', 'slayer'], ['kpop_crowd_psy', 'K-Pop Crowd', 'tactical']], theme: 'viral dance, comic swagger, K-pop spectacle, and global meme-energy shockwaves', motif: 'arcanecity', colors: ['#1e2032', '#040407', '#44d7ff'] },
    { key: 'tommy_heavenly', universe: 'Tommy Heavenly6', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'Tommy Heavenly6', stage: 'Goth Pop Candy Cemetery', boss: 'Heavenly Nightmare Doll', hero: ['tommy_heavenly_avatar', 'Tommy Heavenly6', 'horror'], allies: [['goth_candy_echo', 'Goth Candy Echo', 'hacker'], ['punk_bunny_guard', 'Punk Bunny Guard', 'slayer']], theme: 'goth pop, candy-punk visuals, cute darkness, and stylish graveyard stage moods', motif: 'hauntedset', colors: ['#271327', '#050205', '#ff6fcf'] },
    { key: 'black_eyed_peas', universe: 'Black Eyed Peas', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Black Eyed Peas', stage: 'Boom Boom Pow Club Grid', boss: 'I Gotta Feeling Party Core', hero: ['bep_unit', 'Black Eyed Peas Unit', 'hacker'], allies: [['boom_dancer_bep', 'Boom Dancer', 'slayer'], ['party_signal_bep', 'Party Signal', 'tactical']], theme: 'electro-pop hooks, party anthems, club futurism, and synchronized crowd surges', motif: 'facility', colors: ['#121f2b', '#020405', '#4ee6ff'] },
    { key: 'shaka_ponk', universe: 'Shaka Ponk', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Shaka Ponk', stage: 'Goz Monkey Digital Pit', boss: 'Shaka Bass Ape Core', hero: ['shaka_ponk_avatar', 'Shaka Ponk Unit', 'slayer'], allies: [['goz_signal', 'Goz Signal', 'hacker'], ['punk_drum_shaka', 'Punk Drum', 'marine']], theme: 'digital monkey mascots, electro-rock, stage screens, and punky live-show impacts', motif: 'facility', colors: ['#172323', '#030505', '#77ff7d'] },
    { key: 'shakira', universe: 'Shakira', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Shakira', stage: 'She Wolf Rhythm Jungle', boss: 'Hips Dont Lie Pulse', hero: ['shakira_avatar', 'Shakira Avatar', 'slayer'], allies: [['she_wolf_echo', 'She Wolf Echo', 'hacker'], ['waka_guard', 'Waka Guard', 'tactical']], theme: 'Latin pop rhythm, dance power, wolf imagery, and global stadium celebration energy', motif: 'wasteland', colors: ['#2d2212', '#060503', '#ffc44a'] },
    { key: 'deadmau5', universe: 'Deadmau5', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'Deadmau5', stage: 'Mau5head EDM Grid', boss: 'Ghosts n Stuff Signal Core', hero: ['deadmau5_avatar', 'Mau5head Avatar', 'hacker'], allies: [['edm_grid_mouse', 'EDM Grid Mouse', 'tactical'], ['laser_sync_mau5', 'Laser Sync', 'slayer']], theme: 'progressive house, mau5head visuals, LED grids, and precise electronic build-ups', motif: 'facility', colors: ['#151515', '#030303', '#ff3030'] },
    { key: 'cthulhu', universe: 'Cthulhu', mediaType: 'series', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Cthulhu', stage: 'Rlyeh Dreaming Breach', boss: 'Great Old One Awakening', hero: ['investigator_cthulhu', 'Mythos Investigator', 'hacker'], allies: [['deep_one_hybrid', 'Deep One Hybrid', 'horror'], ['miskatonic_scholar', 'Miskatonic Scholar', 'tactical']], theme: 'cosmic horror, forbidden dreams, eldritch seas, cult rites, and sanity-breaking revelations', motif: 'hauntedset', colors: ['#0d2421', '#010504', '#31b58f'] },
    { key: 'necronomicon', universe: 'Necronomicon', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Necronomicon', stage: 'Forbidden Book Catacomb', boss: 'Book of the Dead Avatar', hero: ['occult_reader_necro', 'Occult Reader', 'hacker'], allies: [['deadite_scribe', 'Deadite Scribe', 'horror'], ['ritual_guard_necro', 'Ritual Guard', 'tactical']], theme: 'forbidden pages, dead languages, cursed ink, and book-bound nightmare dimensions', motif: 'castle', colors: ['#1b1210', '#030202', '#c29a5a'] },
    { key: 're_animator', universe: 'Re-Animator', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Re-Animator', stage: 'Miskatonic Reagent Lab', boss: 'Reanimated Biomass Surge', hero: ['herbert_west', 'Herbert West', 'hacker'], allies: [['dan_cain', 'Dan Cain', 'tactical'], ['megan_halsey', 'Megan Halsey', 'horror']], theme: 'mad science, green reagent, medical horror, and corpses returning very incorrectly', motif: 'facility', colors: ['#142218', '#030503', '#61ff59'] },
    { key: 'digimon_celestial', universe: 'Digimon Celestial Rift', mediaType: 'manga', faction: 'arcane', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Digimon - Faille celeste', stage: 'Digital World Angel Demon Gate', boss: 'Beelzemon Blast Mode Rupture', hero: ['angewomon_digi', 'Angewomon', 'hacker'], allies: [['lady_devimon_digi', 'LadyDevimon', 'horror'], ['beelzemon_digi', 'Beelzemon', 'slayer'], ['darcmon_digi', 'Darcmon', 'tactical']], theme: 'angel and demon Digimon, digital crests, holy arrows, and dark evolution conflicts', motif: 'castle', colors: ['#1b1835', '#030307', '#e8d7ff'] },
    { key: 'aural_vampire', universe: 'Aural Vampire', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Aural Vampire', stage: 'Darkwave Vampire Club', boss: 'Bloodbeat Synth Countess', hero: ['aural_vampire_avatar', 'Aural Vampire Avatar', 'horror'], allies: [['darkwave_dj_av', 'Darkwave DJ', 'hacker'], ['bloodbeat_dancer', 'Bloodbeat Dancer', 'slayer']], theme: 'darkwave club energy, vampire aesthetics, synth beats, and gothic electronic pressure', motif: 'hauntedset', colors: ['#220d18', '#040102', '#ff3d8f'] },
    { key: 'buckhead', universe: 'Buckhead', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Medium', titleFr: 'Buckhead', stage: 'Masked Guitar Labyrinth', boss: 'Bucket Riff Automaton', hero: ['buckhead_avatar', 'Buckhead Avatar', 'hacker'], allies: [['bucket_guitar_echo', 'Bucket Guitar Echo', 'slayer'], ['white_mask_signal', 'White Mask Signal', 'tactical']], theme: 'masked guitar virtuosity, surreal instrumental worlds, shred mazes, and silent stage personas', motif: 'facility', colors: ['#181818', '#030303', '#f5f5f5'] },
    { key: 'korn', universe: 'Korn', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Korn', stage: 'Nu-Metal Field Pit', boss: 'Freak on a Leash Core', hero: ['korn_avatar', 'Korn Avatar', 'horror'], allies: [['seven_string_riff', 'Seven String Riff', 'slayer'], ['bagpipe_signal', 'Bagpipe Signal', 'hacker']], theme: 'nu-metal dread, detuned riffs, cathartic screams, and mosh-pit emotional pressure', motif: 'hauntedset', colors: ['#181214', '#030202', '#b0b0b0'] },
    { key: 'marilyn_manson', universe: 'Marilyn Manson', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Marilyn Manson', stage: 'Mechanical Animals Chapel', boss: 'Antichrist Superstar Effigy', hero: ['manson_avatar', 'Shock Rock Avatar', 'horror'], allies: [['mechanical_animal', 'Mechanical Animal', 'tactical'], ['pale_emperor_echo', 'Pale Emperor Echo', 'hacker']], theme: 'shock rock theatre, industrial glam, occult imagery, and corrupted celebrity rituals', motif: 'hauntedset', colors: ['#1f1111', '#030202', '#d9d9d9'] }
  ])
];

function makeUniverseWave(entries) {
  return entries.map(entry => {
    const [skyTop, skyBottom, accent] = entry.colors;
    const title = entry.title || entry.universe;
    const titleFr = entry.titleFr || entry.universe;
    const shortKey = entry.key.replace(/[^a-z0-9_]/gi, '').toLowerCase();
    const factionLine = {
      sciFi: 'technology, survival protocols, and breach combat',
      horror: 'fear pressure, curses, ambushes, and survival horror',
      cyber: 'rhythm, systems, speed, and glitch tactics',
      arcane: 'ritual logic, strange rules, and unstable magic'
    }[entry.faction] || 'multiverse instability and anomaly combat';

    return {
      universe: entry.universe,
      mediaType: entry.mediaType,
      faction: entry.faction,
      stageName: entry.stage,
      mode: entry.mode,
      difficulty: entry.difficulty,
      bossName: entry.boss,
      title: { en: title, fr: titleFr },
      desc: {
        en: `${capitalize(entry.theme)} collide with Nexus instability through ${factionLine}.`,
        fr: `${capitalize(entry.theme)} entrent en collision avec l instabilite du Nexus via ${factionLine}.`
      },
      hero: makeWaveHero(entry.hero, accent),
      allies: entry.allies.map((ally, index) => makeWaveHero(ally, index === 0 ? lightenAccent(accent) : darkenAccent(accent))),
      monsters: entry.monsters || [`${title} Rift Drone`, `${title} Breach Stalker`, `${title} Anomaly Pack`],
      bosses: entry.bosses || [`${title} Elite Guardian`, `${title} Crisis Avatar`],
      worldBoss: entry.boss,
      gear: entry.gear || makeWaveGear(shortKey, title, titleFr),
      event: entry.event || [
        `evt_${shortKey}_breach`,
        `${title} Breach Signal`,
        `Signal breche ${titleFr}`,
        `${title} opens a signature anomaly that damages enemies and boosts the squad tempo.`,
        `${titleFr} ouvre une anomalie signature qui blesse les ennemis et accelere l escouade.`
      ],
      decor: {
        sky: [skyTop, skyBottom],
        floor: `rgba(${hexToRgb(accent).join(', ')}, 0.16)`,
        grid: `rgba(${hexToRgb(accent).join(', ')}, 0.28)`,
        motif: entry.motif,
        accent
      }
    };
  });
}

function makeWaveHero([id, name, cat], color) {
  return { id, name, cat, color };
}

function makeWaveGear(key, title, titleFr) {
  return [
    [`${key}_sigil`, `${title} Signature Relic`, `Relique signature ${titleFr}`, { atk: 8, spd: 1 }],
    [`${key}_armor`, `${title} Field Plate`, `Plaque terrain ${titleFr}`, { def: 6, hp: 45 }],
    [`${key}_core`, `${title} Nexus Core`, `Noyau Nexus ${titleFr}`, { hp: 75 }]
  ];
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map(char => char + char).join('')
    : value;
  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16)
  ];
}

function lightenAccent(hex) {
  const [r, g, b] = hexToRgb(hex).map(value => Math.min(255, value + 35));
  return `#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`;
}

function darkenAccent(hex) {
  const [r, g, b] = hexToRgb(hex).map(value => Math.max(0, value - 35));
  return `#${[r, g, b].map(value => value.toString(16).padStart(2, '0')).join('')}`;
}

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

export const EXPANDED_UNIVERSE_SIGNATURES = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, {
    universe: universe.universe,
    mediaType: universe.mediaType,
    faction: universe.faction,
    theme: universe.theme || universe.desc?.en || universe.universe,
    stageName: universe.stageName,
    bossName: universe.bossName,
    worldBoss: universe.worldBoss,
    monsters: universe.monsters,
    bosses: universe.bosses,
    gearNames: universe.gear.map(([, enName, frName]) => ({ en: enName, fr: frName })),
    eventName: { en: universe.event[1], fr: universe.event[2] },
    eventDesc: { en: universe.event[3], fr: universe.event[4] }
  }])
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
    faction: universe.faction,
    theme: universe.theme,
    stageName: universe.stageName,
    bossName: universe.bossName,
    worldBoss: universe.worldBoss,
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
