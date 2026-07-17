const hero = (id, name, cat, color, weapon, simpleName, secondaryName, defenseName, specialName) => ({
  id,
  name,
  cat,
  color,
  weapon,
  simpleName,
  secondaryName,
  defenseName,
  specialName
});

const threat = (name, spriteSource, weapon, special, extra = {}) => ({
  name,
  spriteSource,
  weapon,
  special,
  ...extra
});

const localized = (fr, en) => ({ fr, en });

export const FEATURED_UNIVERSE_KEYS = [
  'Tomba',
  'Woodruff',
  'Hellraiser',
  'A Nightmare on Elm Street',
  'The Ring',
  'The Grudge'
];

export const FEATURED_UNIVERSE_PACKS = [
  {
    universe: 'Tomba',
    mediaType: 'game',
    faction: 'arcane',
    stageName: 'Mushroom Forest Evil Pig Hunt',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Fire Evil Pig',
    title: { en: 'Tomba!', fr: 'Tomba!' },
    desc: {
      en: 'Tomba crosses a bright island whose villages, forests, mountains, and inhabitants have been warped by seven Evil Pig curses. Events, odd favors, pig bags, the stolen golden bracelet, and physical platforming remain the laws of this Thread.',
      fr: 'Tomba traverse une ile coloree dont les villages, forets, montagnes et habitants ont ete deformes par les maledictions de sept Evil Pigs. Les evenements, services absurdes, sacs a cochons, le bracelet vole et le platforming physique restent les lois de cette Trame.'
    },
    hero: hero('tomba_hero', 'Tomba', 'slayer', '#ff5c9a', 'spiked_ball', 'Pig Grab Throw', 'Spiked Ball Swing', 'Animal Dash', 'Evil Pig Bag Seal'),
    allies: [
      hero('charles_tomba', 'Charles', 'hacker', '#a66b32', 'claws', 'Monkey Pounce', 'Animal Technique Lesson', 'Tree Branch Dodge', 'Charles Training Rush'),
      hero('tabby_tomba', 'Tabby', 'tactical', '#e8c28d', 'staff', 'Travel Staff Jab', 'Friendship Necklace Signal', 'Village Route Guard', 'Evil Swine Rescue Call')
    ],
    monsters: [
      threat('Koma Pig Patrol', '/sprites/generated/bosses/tomba/koma-pig-patrol.png', 'pitchfork', 'Gold Snatch Charge'),
      threat('Biting Plant Cluster', '/sprites/generated/bosses/tomba/biting-plant-cluster.png', 'bite', 'Root Snare'),
      threat('Needlegator Ravine Pack', '/sprites/generated/bosses/tomba/needlegator-ravine-pack.png', 'spines', 'Phoenix Mountain Ambush')
    ],
    bosses: [
      threat('Fire Evil Pig', '/sprites/generated/bosses/tomba/fire-evil-pig.png', 'fire_magic', 'Village of All Beginnings Inferno'),
      threat('Stormy Evil Pig', '/sprites/generated/bosses/tomba/stormy-evil-pig.png', 'storm_magic', 'Phoenix Mountain Gale')
    ],
    worldBoss: threat('Real Evil Pig', '/sprites/generated/bosses/tomba/real-evil-pig.png', 'curse_magic', 'Seven Curses Recast'),
    gear: [
      ['tomba_grandfather_bracelet', 'Grandfathers Golden Bracelet', 'Bracelet dore du grand-pere', { atk: 8, def: 4 }],
      ['tomba_evil_pig_bag', 'Blue Evil Pig Bag', 'Sac bleu a Evil Pig', { atk: 10, spd: 2 }],
      ['tomba_charity_wings', 'Charity Wings', 'Ailes de charite', { hp: 65, spd: 2 }]
    ],
    event: ['evt_tomba_pig_bag_seal', 'Black Evil Pig Bag', 'Sac noir du Real Evil Pig', 'The eighth black bag appears after the seven Evil Pigs are sealed. It reveals the Real Evil Pigs lair and provides the only physical vessel able to contain him.', 'Le huitieme sac noir apparait apres le scellement des sept Evil Pigs. Il revele le repaire du Real Evil Pig et constitue le seul receptacle physique capable de l enfermer.'],
    decor: { sky: ['#2b1640', '#07040c'], floor: 'rgba(93, 190, 92, 0.18)', grid: 'rgba(255, 102, 170, 0.3)', motif: 'wasteland', accent: '#ff66aa' },
    stageVariants: [
      { mode: 'Tactics', name: 'Phoenix Mountain Wind Routes', difficulty: 'Hard', bossName: 'Stormy Evil Pig' },
      { mode: 'Smash', name: 'Seven Evil Pig Bag Sanctuary', difficulty: 'Very Hard', bossName: 'Real Evil Pig' }
    ]
  },
  {
    universe: 'Woodruff',
    mediaType: 'game',
    faction: 'arcane',
    stageName: 'Vlurxtrznbnaxl Lower City Search',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Bigwig Captive Beast',
    title: { en: 'The Bizarre Adventures of Woodruff and the Schnibble', fr: 'Woodruff et le Schnibble d Azimuth' },
    desc: {
      en: 'A hand-painted point-and-click Thread set in the vertical dystopian city of Vlurxtrznbnaxl after returning humans conquered and oppressed the peaceful Boozooks. Woodruff, aged by Azimuths Viblefrotzer, must learn language, collect syllables, rebuild the Wisemens Council, free Azimuth, and oppose Bigwigs absurd bureaucracy.',
      fr: 'Une Trame point-and-click peinte a la main dans la ville verticale et dystopique de Vlurxtrznbnaxl, apres que les humains revenus a la surface ont conquis et opprime les paisibles Bouzouks. Vieilli par le Viblefrotzer d Azimuth, Woodruff doit apprendre le langage, reunir les syllabes, reformer le Conseil des Sages, liberer Azimuth et affronter la bureaucratie absurde de Bigwig.'
    },
    hero: hero('woodruff_hero', 'Woodruff', 'hacker', '#e1c34d', 'schnibble', 'Glove Slap', 'Tobozon Misdial', 'Transportozon Escape', 'Schnibble Syllable Release'),
    allies: [
      hero('professor_azimuth', 'Professor Azimuth', 'tactical', '#e8d26a', 'device', 'Viblefrotzer Pulse', 'Laboratory Override', 'Hidden Workshop Guard', 'Growth Formula Reversal'),
      hero('master_boozook', 'Boozook Master', 'hacker', '#5bbf88', 'syllable', 'Ear Control Lesson', 'Council Formula', 'Past Vision', 'Sage Council Convergence')
    ],
    monsters: [
      threat('Bigwig Henchman', '/sprites/generated/bosses/woodruff/bigwig-henchman.png', 'ray_pistol', 'Azimuth House Raid'),
      threat('Slammers End Jailer', '/sprites/generated/bosses/woodruff/slammers-end-jailer.png', 'prison_keys', 'Prison Tower Lockout'),
      threat('Factory Permit Guard', '/sprites/generated/bosses/woodruff/factory-permit-guard.png', 'work_permit', 'Factory Entrance Refusal')
    ],
    bosses: [
      threat('Schnibble Sect High Priest', '/sprites/generated/bosses/woodruff/schnibble-sect-high-priest.png', 'sacred_code', 'Chosen Initiate Donation Loop'),
      threat('Bigwig Captive Beast', '/sprites/generated/bosses/woodruff/bigwig-captive-beast.png', 'possession', 'Schprotznog Escape')
    ],
    worldBoss: threat('The Bigwig', '/sprites/generated/bosses/woodruff/the-bigwig.png', 'command', 'Schnibble Suppression Decree'),
    gear: [
      ['woodruff_tobozon', 'Tobozon Communicator', 'Communicateur Tobozon', { spd: 2, def: 5 }],
      ['woodruff_viblefrotzer', 'Viblefrotzer Regulator', 'Regulateur Viblefrotzer', { atk: 8, hp: 45 }],
      ['woodruff_syllable_stone', 'Council Syllable Stone', 'Pierre-syllabe du Conseil', { hp: 70, def: 4 }]
    ],
    event: ['evt_woodruff_schnibble_formula', 'Boozook Council Syllable Set', 'Jeu de pierres-syllabes du Conseil Bouzouk', 'The recovered physical syllable stones reform the Boozook Councils words and formulas. Their exact order exposes false permits, opens locked routes, and restores the Chprotznog.', 'Les pierres-syllabes physiques recuperees reforment les mots et les formules du Conseil Bouzouk. Leur ordre exact devoile les faux permis, ouvre les routes verrouillees et restaure le Chprotznog.'],
    decor: { sky: ['#382a19', '#080503'], floor: 'rgba(92, 131, 86, 0.18)', grid: 'rgba(225, 195, 77, 0.28)', motif: 'arcanecity', accent: '#e1c34d' },
    stageVariants: [
      { mode: 'Tactics', name: 'Administration Permit and Factory Gate', difficulty: 'Hard', bossName: 'Schnibble Sect High Priest' },
      { mode: 'Smash', name: 'Bigwig Apartment Schprotznog Trap', difficulty: 'Very Hard', bossName: 'The Bigwig' }
    ]
  },
  {
    universe: 'Hellraiser',
    mediaType: 'movie',
    faction: 'horror',
    skipPrimaryStage: true,
    stageName: 'Labyrinth Cenobite Chamber',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Leviathan God',
    title: { en: 'Hellraiser', fr: 'Hellraiser' },
    desc: {
      en: 'Lemarchands puzzle box opens the Labyrinth, a geometric domain ruled by Leviathan where Cenobites treat sensation, desire, pain, and transformation as ritual law. Kirsty survives by understanding the bargain instead of reducing the Order of the Gash to ordinary demons.',
      fr: 'La boite de Lemarchand ouvre le Labyrinthe, domaine geometrique gouverne par Leviathan ou les Cenobites traitent sensation, desir, douleur et transformation comme des lois rituelles. Kirsty survit en comprenant le pacte au lieu de reduire l Ordre de l Entaille a de simples demons.'
    },
    hero: hero('kirsty', 'Kirsty Cotton', 'horror', '#e7e4de', 'puzzlebox', 'Lament Spark', 'Chain Bargain', 'Puzzle Reversal', 'Leviathan Gate Seal'),
    allies: [
      hero('female_cenobite', 'Female Cenobite', 'slayer', '#c8c5bd', 'chains', 'Needle Chain Lash', 'Throat Wound Command', 'Order of the Gash Guard', 'Labyrinth Procession'),
      hero('butterball', 'Butterball', 'tactical', '#68625f', 'cleaver', 'Butcher Cleaver', 'Hidden Eye Hook', 'Leather Apron Brace', 'Cenobite Appetite')
    ],
    monsters: [
      threat('Skinless Frank Cotton', '/sprites/generated/bosses/hellraiser/skinless-frank-cotton.png', 'claws', 'Blood Resurrection'),
      threat('Eremite Puzzle Guardian', '/sprites/generated/bosses/hellraiser/eremite-puzzle-guardian.png', 'cube', 'Lemarchand Lock'),
      threat('Labyrinth Chain Corridor', '/sprites/generated/bosses/hellraiser/labyrinth-chain-corridor.png', 'hook', 'Wall Chain Volley')
    ],
    bosses: [
      threat('Channard Cenobite', '/sprites/generated/bosses/hellraiser/channard-cenobite.png', 'tentacles', 'And To Think I Hesitated'),
      threat('The Engineer', '/sprites/generated/bosses/hellraiser/the-engineer.png', 'maw', 'Threshold Pursuit')
    ],
    worldBoss: threat('Leviathan Diamond', '/sprites/generated/bosses/hellraiser/leviathan-diamond.png', 'black_light', 'Labyrinth Geometry'),
    gear: [
      ['cenobite_hook', 'Barbed Cenobite Hook', 'Crochet barbe de Cenobite', { atk: 11, spd: 1 }],
      ['puzzle_piece', 'Lament Configuration', 'Configuration des Lamentations', { def: 7, hp: 50 }],
      ['pillar_stone', 'Pillar of Souls Fragment', 'Fragment du Pilier des Ames', { atk: 7, def: 5 }],
      ['hellraiser_2022_configuration', 'Six-Phase Configuration', 'Configuration a six phases', { atk: 6, def: 6, spd: 1 }],
      ['hellraiser_voight_nerve_mechanism', 'Voight Nerve Mechanism', 'Mecanisme nerveux de Voight', { atk: 12, hp: 35 }],
      ['hellraiser_priest_pearl_pin', 'Priest Pearl Pin', 'Epingle perlee de la Pretresse', { def: 8, spd: 1 }]
    ],
    event: ['evt_hellraiser_lament_reversal', 'Lament Configuration', 'Configuration des Lamentations', 'Kirsty manipulates the brass-and-black puzzle box under pressure, redirects the Labyrinth chains toward the true subject of the bargain, and closes the threshold.', 'Kirsty manipule sous pression la boite-puzzle noire et doree, redirige les chaines du Labyrinthe vers la veritable cible du pacte et referme le seuil.'],
    decor: { sky: ['#281311', '#050202'], floor: 'rgba(145, 45, 36, 0.2)', grid: 'rgba(211, 158, 72, 0.3)', motif: 'labyrinth', accent: '#d39e48' },
    stageVariants: [
      { mode: 'Tactics', name: 'Cotton House Attic Bargain', difficulty: 'Very Hard', bossName: 'The Engineer' },
      { mode: 'Smash', name: 'Leviathan Black-Light Labyrinth', difficulty: 'Expert', bossName: 'Leviathan Diamond' },
      { mode: 'RPG', name: 'Voight Mansion Six-Phase Trial', difficulty: 'Expert', bossName: 'The Priest (2022)' },
      { mode: 'Tactics', name: 'Voight Mansion Steel Cage', difficulty: 'Expert', bossName: 'Roland Voight - Leviathan Transformation' },
      { mode: 'Smash', name: 'Leviathan Audience Chamber 2022', difficulty: 'Expert', bossName: 'The Priest (2022)' }
    ]
  },
  {
    universe: 'A Nightmare on Elm Street',
    mediaType: 'movie',
    faction: 'horror',
    stageName: '1428 Elm Street Sleep Trap',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Freddy Boiler-Room Stalker',
    title: { en: 'A Nightmare on Elm Street', fr: 'Les Griffes de la nuit' },
    desc: {
      en: 'Springwood teenagers are hunted in dreams by Freddy Krueger, whose burned body, fedora, striped sweater, and bladed glove can reshape sleep into lethal theatrical traps. Nancy, Kristen, and Alice resist through preparation, shared dreams, and control of their own fear.',
      fr: 'Les adolescents de Springwood sont traques dans leurs reves par Freddy Krueger, dont le corps brule, le fedora, le pull raye et le gant a lames transforment le sommeil en pieges mortels et theatraux. Nancy, Kristen et Alice resistent par la preparation, les reves partages et la maitrise de leur peur.'
    },
    hero: hero('nancy_thompson', 'Nancy Thompson', 'tactical', '#d8c6aa', 'trapkit', 'Alarm Clock Strike', 'Booby-Trap Route', 'Wake-Up Burn', 'Turn Your Back on Freddy'),
    allies: [
      hero('kristen_parker', 'Kristen Parker', 'hacker', '#e5b7c6', 'dream', 'Dream Kick', 'Pull Ally Into Dream', 'Dream Room Shift', 'Dream Warriors Convergence'),
      hero('alice_johnson', 'Alice Johnson', 'slayer', '#c7a875', 'dream', 'Dream Master Strike', 'Borrowed Dream Skill', 'Mirror Guard', 'Dream Child Counter')
    ],
    monsters: [
      threat('Freddy Puppet Marionette', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-puppet-marionette.png', 'tendon_strings', 'Sleepwalk Control'),
      threat('Freddy Serpent Form', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-serpent-form.png', 'bite', 'Dream Swallow'),
      threat('Soul Chest Wretch', '/sprites/generated/bosses/a-nightmare-on-elm-street/soul-chest-wretch.png', 'soul_claws', 'Victim Soul Cry')
    ],
    bosses: [
      threat('Freddy Television Form', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-television-form.png', 'television_head', 'Welcome to Prime Time'),
      threat('Freddy Dream Master', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-dream-master.png', 'bladed_glove', 'Borrowed Nightmare Powers')
    ],
    worldBoss: threat('Freddy Krueger', '/sprites/generated/bosses/a-nightmare-on-elm-street/freddy-krueger.png', 'bladed_glove', 'Boiler Room Dream Dominion'),
    gear: [
      ['elm_hypnocil', 'Hypnocil Vial', 'Fiole d Hypnocil', { hp: 65, def: 6 }],
      ['elm_nancy_trapkit', 'Nancys Booby-Trap Kit', 'Kit de pieges de Nancy', { atk: 8, spd: 2 }],
      ['elm_glove_shard', 'Freddys Bladed Glove', 'Gant a lames de Freddy', { atk: 12 }]
    ],
    event: ['evt_elm_dream_warriors', 'Kristens 1428 Elm Street Model', 'Maquette du 1428 Elm Street de Kristen', 'Kristens papier-mache model reproduces the boarded house she sees in her nightmares. Securing it reveals Freddys recurring dream entry before Nancy forces the wake-up route.', 'La maquette en papier mache de Kristen reproduit la maison condamnee vue dans ses cauchemars. La securiser revele l entree recurrente de Freddy avant que Nancy ne force la route du reveil.'],
    decor: { sky: ['#2c1310', '#050101'], floor: 'rgba(156, 62, 36, 0.2)', grid: 'rgba(116, 181, 74, 0.26)', motif: 'hauntedset', accent: '#b84d2f' },
    stageVariants: [
      { mode: 'Tactics', name: 'Westin Hills Dream Warriors Ward', difficulty: 'Very Hard', bossName: 'Freddy Dream Master' },
      { mode: 'Smash', name: 'Springwood Boiler Room Nightmare', difficulty: 'Expert', bossName: 'Freddy Krueger' }
    ]
  },
  {
    universe: 'The Ring',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Shelter Mountain Cabin 12',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Samara Television Crawl',
    title: { en: 'The Ring', fr: 'Le Cercle' },
    desc: {
      en: 'Rachel Keller investigates a VHS recording imprinted by Samara Morgans psychic rage. The seven-day call, distorted photographs, Morgan Ranch, Moesko Island, Shelter Mountain, the stone well, and the need to copy the tape define a curse that wants circulation rather than closure.',
      fr: 'Rachel Keller enquete sur une cassette VHS imprimee par la rage psychique de Samara Morgan. L appel des sept jours, les photos deformees, Morgan Ranch, Moesko Island, Shelter Mountain, le puits de pierre et la copie de la cassette definissent une malediction qui cherche a circuler plutot qu a se refermer.'
    },
    hero: hero('rachel_ring', 'Rachel Keller', 'tactical', '#59666a', 'camera', 'Camera Flash', 'Tape Frame Analysis', 'Deadline Route', 'Copy the Tape'),
    allies: [
      hero('aiden_ring', 'Aidan Keller', 'hacker', '#9ba6a8', 'psychic', 'Static Warning', 'Samara Drawing Read', 'Childs Premonition', 'Seven-Day Pattern Break'),
      hero('noah_ring', 'Noah Clay', 'tactical', '#596d72', 'camera', 'Photo Lab Flash', 'Video Timecode Trace', 'Darkroom Cover', 'Nensha Evidence Reconstruction')
    ],
    monsters: [
      threat('Distorted Victim Echo', '/sprites/generated/bosses/the-ring/distorted-victim-echo.png', 'fear', 'Twisted Photograph'),
      threat('Cursed Tape Static', '/sprites/generated/bosses/the-ring/cursed-tape-static.png', 'static', 'Seven-Day Mark'),
      threat('Morgan Ranch Horse Panic', '/sprites/generated/bosses/the-ring/morgan-ranch-horse-panic.png', 'charge', 'Ferry Stampede')
    ],
    bosses: [
      threat('Anna Morgan Well Vision', '/sprites/generated/bosses/the-ring/anna-morgan-well-vision.png', 'psychic', 'Moesko Cliff Memory'),
      threat('Samara Television Crawl', '/sprites/generated/bosses/the-ring/samara-television-crawl.png', 'nensha', 'Screen Threshold')
    ],
    worldBoss: threat('Samara Morgan', '/sprites/generated/bosses/the-ring/samara-morgan.png', 'psychic_curse', 'Seven Days Without End'),
    gear: [
      ['ring_cursed_vhs', 'Cursed VHS Copy', 'Copie VHS maudite', { atk: 9, spd: 1 }],
      ['ring_distorted_photo', 'Distorted Polaroid', 'Polaroid deforme', { def: 5, hp: 55 }],
      ['ring_shelter_well_stone', 'Aidans Black Ring Drawing', 'Dessin de lanneau noir d Aidan', { hp: 85, def: 3 }]
    ],
    event: ['evt_ring_copy_deadline', 'Copied Cursed VHS Tape', 'Copie de la cassette VHS maudite', 'Rachel duplicates the unlabelled physical tape because copying and showing it to another viewer is the curses actual survival rule, not a cure.', 'Rachel duplique la cassette physique sans etiquette, car la copier puis la montrer a un autre spectateur constitue la veritable regle de survie de la malediction, pas un remede.'],
    decor: { sky: ['#10191b', '#020303'], floor: 'rgba(82, 106, 108, 0.17)', grid: 'rgba(196, 224, 221, 0.24)', motif: 'hauntedset', accent: '#bedbd6' },
    stageVariants: [
      { mode: 'Tactics', name: 'Morgan Ranch Nensha Investigation', difficulty: 'Very Hard', bossName: 'Anna Morgan Well Vision' },
      { mode: 'Smash', name: 'Stone Well Television Threshold', difficulty: 'Expert', bossName: 'Samara Morgan' }
    ]
  },
  {
    universe: 'The Grudge',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Saeki House Care Visit',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Kayako Stair Crawl',
    title: { en: 'The Grudge', fr: 'The Grudge' },
    desc: {
      en: 'The Saeki house carries a Ju-On born when Takeos violence killed Kayako and Toshio. Karen Davis, Detective Nakagawa, and Aubrey follow a non-linear chain of visits, recordings, attic noises, black hair, Toshios catlike cry, and Kayakos death rattle; entering the house is enough for the curse to follow.',
      fr: 'La maison Saeki porte un Ju-On ne lorsque la violence de Takeo a tue Kayako et Toshio. Karen Davis, l inspecteur Nakagawa et Aubrey suivent une chaine non lineaire de visites, enregistrements, bruits de grenier, cheveux noirs, cri felin de Toshio et rale de Kayako; entrer dans la maison suffit pour que la malediction suive.'
    },
    hero: hero('karen_grudge', 'Karen Davis', 'horror', '#e2dfd4', 'flashlight', 'Flashlight Sweep', 'Care File Search', 'House Exit Sprint', 'Saeki House Firebreak'),
    allies: [
      hero('detective_nakagawa', 'Detective Nakagawa', 'tactical', '#59656d', 'gun', 'Tokyo Police Shot', 'Case Tape Review', 'Gasoline Line Guard', 'Saeki File Reconstruction'),
      hero('aubrey_grudge', 'Aubrey Davis', 'horror', '#b9a18f', 'camera', 'Camera Flash', 'Karen Trail Search', 'Hotel Corridor Dodge', 'Ju-On Contact Trace')
    ],
    monsters: [
      threat('Toshio Attic Apparition', '/sprites/generated/bosses/the-grudge/toshio-attic-apparition.png', 'cat_cry', 'Attic Lure'),
      threat('Mar Black-Cat Echo', '/sprites/generated/bosses/the-grudge/mar-black-cat-echo.png', 'shadow_claws', 'Cat Cry Blindspot'),
      threat('Cursed Security Camera Shade', '/sprites/generated/bosses/the-grudge/cursed-security-camera-shade.png', 'static', 'Office Hallway Advance')
    ],
    bosses: [
      threat('Takeo Bathtub Rage Echo', '/sprites/generated/bosses/the-grudge/takeo-bathtub-rage-echo.png', 'drowning_grip', 'Saeki Family Murder Loop'),
      threat('Kayako Stair Crawl', '/sprites/generated/bosses/the-grudge/kayako-stair-crawl.png', 'hair_claws', 'Death Rattle Descent')
    ],
    worldBoss: threat('Kayako Saeki Onryo', '/sprites/generated/bosses/the-grudge/kayako-saeki-onryo.png', 'juon_curse', 'Grudge Without Exit'),
    gear: [
      ['grudge_saeki_photo', 'Saeki Family Photograph', 'Photographie de la famille Saeki', { def: 5, hp: 55 }],
      ['grudge_case_recorder', 'Kayakos Journal', 'Journal de Kayako', { spd: 2, def: 4 }],
      ['grudge_house_key', 'Nakagawas Gasoline Can', 'Bidon dessence de Nakagawa', { atk: 7, hp: 45 }]
    ],
    event: ['evt_grudge_contact_chain', 'Kayakos Journal', 'Journal de Kayako', 'The physical journal records Kayakos obsession with Peter Kirk and the discovery that triggers Takeos murderous rage. Reading it identifies the curses original contact chain without claiming to break it.', 'Le journal physique consigne l obsession de Kayako pour Peter Kirk et la decouverte qui declenche la rage meurtriere de Takeo. Sa lecture identifie la chaine de contact originelle sans pretendre briser la malediction.'],
    decor: { sky: ['#181817', '#030303'], floor: 'rgba(178, 178, 166, 0.12)', grid: 'rgba(229, 229, 217, 0.22)', motif: 'hauntedset', accent: '#deded2' },
    stageVariants: [
      { mode: 'Tactics', name: 'Nakagawa Curse Contact Board', difficulty: 'Very Hard', bossName: 'Takeo Bathtub Rage Echo' },
      { mode: 'Smash', name: 'Saeki Staircase and Attic Descent', difficulty: 'Expert', bossName: 'Kayako Saeki Onryo' }
    ]
  }
];

export const FEATURED_UNIVERSE_NARRATIVE_ARCS = [
  {
    id: 'tomba_seven_evil_pig_curses',
    title: { fr: 'Arc Univers - Tomba!: les sept maledictions', en: 'Universe Arc - Tomba!: The Seven Curses' },
    universes: ['Tomba'],
    intro: {
      fr: 'Les Koma Pigs volent le bracelet dore du grand-pere de Tomba au moment ou les sept Evil Pigs divisent son ile en domaines maudits. La Breche superpose leurs maledictions, mais chaque zone conserve ses evenements, ses habitants et son sac de scellement.',
      en: 'Koma Pigs steal Tombas grandfathers golden bracelet as the seven Evil Pigs divide his island into cursed domains. The Breach overlaps their curses, but every region keeps its events, inhabitants, and sealing bag.'
    },
    missions: [
      { fr: 'Intro - Village de tous les commencements: poursuivre les Koma Pigs, retrouver la piste du bracelet et obtenir le premier indice du 100 Year Old Wise Man.', en: 'Intro - Village of All Beginnings: chase the Koma Pigs, recover the bracelets trail, and obtain the first clue from the 100 Year Old Wise Man.' },
      { fr: 'Mission - Mushroom Forest: resoudre les etats rieur et pleureur de la foret, aider ses habitants et recuperer un Evil Pig Bag sans bruler les evenements secondaires.', en: 'Mission - Mushroom Forest: resolve the forests laughing and crying states, help its inhabitants, and recover an Evil Pig Bag without erasing its side events.' },
      { fr: 'Interlude - Lecons de Charles: apprendre Animal Dash et la nage afin que les nouvelles routes deviennent des capacites de Tomba, pas des clefs generiques A.R.C.A.', en: 'Interlude - Charles Lessons: learn Animal Dash and swimming so new routes become Tombas abilities rather than generic A.R.C.A. keys.' },
      { fr: 'Mission - Phoenix Mountain: traverser les vents, les Needlegators et les chemins verticaux pour ouvrir le sac du Stormy Evil Pig dans son propre domaine.', en: 'Mission - Phoenix Mountain: cross wind, Needlegators, and vertical routes to open the Stormy Evil Pigs bag inside its own domain.' },
      { fr: 'Boss - Real Evil Pig: reunir les sept sacs dans le sanctuaire, retourner chaque malediction contre son auteur et reprendre le bracelet dore.', en: 'Boss - Real Evil Pig: gather all seven bags in the sanctuary, turn every curse against its author, and recover the golden bracelet.' }
    ],
    outro: { fr: 'Les villages retrouvent leurs formes et leurs habitants conservent le souvenir des services rendus. Tomba recupere le bracelet sans laisser A.R.C.A. remplacer son ile par une simple arene.', en: 'The villages regain their forms and their inhabitants keep the memory of every favor completed. Tomba recovers the bracelet without allowing A.R.C.A. to replace his island with a simple arena.' },
    reward: { fr: 'Apparence Bracelet du grand-pere + Evil Pig Bag utilisable', en: 'Grandfathers Bracelet skin + usable Evil Pig Bag' }
  },
  {
    id: 'woodruff_schnibble_of_azimuth',
    title: { fr: 'Arc Univers - Woodruff: le Schnibble d Azimuth', en: 'Universe Arc - Woodruff: Azimuths Schnibble' },
    universes: ['Woodruff'],
    intro: {
      fr: 'Bigwig fait enlever Azimuth et detruire le foyer de Woodruff. Le Viblefrotzer du professeur transforme le jeune adopte demi-humain, demi-Bouzouk en adolescent avant que la ville de Vlurxtrznbnaxl ne puisse effacer les preuves.',
      en: 'Bigwig has Azimuth abducted and Woodruffs home destroyed. The professors Viblefrotzer ages his half-human, half-Boozook adopted son into a teenager before the city of Vlurxtrznbnaxl can erase the evidence.'
    },
    missions: [
      { fr: 'Intro - Laboratoire detruit: retrouver le Viblefrotzer, la trace d Azimuth et le souvenir du nounours qui donne a Woodruff une raison personnelle de poursuivre Bigwig.', en: 'Intro - Ruined Laboratory: recover the Viblefrotzer, Azimuths trail, and the memory of the teddy bear that gives Woodruff a personal reason to pursue Bigwig.' },
      { fr: 'Mission - Basse ville: utiliser Tobozons, Transportozons et services absurdes pour obtenir de vrais permis sans accepter les decrets contradictoires de l Administration.', en: 'Mission - Lower City: use Tobozons, Transportozons, and absurd public services to obtain real permits without accepting the Administrations contradictory decrees.' },
      { fr: 'Interlude - Memoire Bouzouk: apprendre les syllabes, decouvrir le passe des humains et des Bouzouks, puis comprendre pourquoi le Schnibble ne peut pas etre traite comme une arme.', en: 'Interlude - Boozook Memory: learn the syllables, uncover the history of humans and Boozooks, then understand why the Schnibble cannot be treated as a weapon.' },
      { fr: 'Mission - Conseil des Sages: retrouver les membres disperses, reconstituer leurs formules et annuler les faux titres avec la logique exacte de leurs mots.', en: 'Mission - Wisemens Council: find the scattered members, rebuild their formulas, and cancel false titles through the exact logic of their words.' },
      { fr: 'Boss - Palais de Bigwig: liberer Azimuth, exposer les mensonges du regime et laisser le Schnibble rendre la ville aux Bouzouks au lieu de la reprogrammer.', en: 'Boss - Bigwigs Palace: free Azimuth, expose the regimes lies, and let the Schnibble return the city to the Boozooks instead of reprogramming it.' }
    ],
    outro: { fr: 'Azimuth retrouve son fils adopte et le Conseil peut de nouveau parler avec des syllabes completes. La Breche conserve la satire, les enigmes et la memoire du monde au lieu de normaliser son absurdite.', en: 'Azimuth reunites with his adopted son and the Council can speak in complete syllables again. The Breach preserves the satire, puzzles, and world memory instead of normalizing its absurdity.' },
    reward: { fr: 'Transportozon d Azimuth + apparence Woodruff Viblefrotzer', en: 'Azimuth Transportozon + Viblefrotzer Woodruff skin' }
  },
  {
    id: 'hellraiser_lament_configuration',
    title: { fr: 'Arc Univers - Hellraiser: configuration des Lamentations', en: 'Universe Arc - Hellraiser: Lament Configuration' },
    universes: ['Hellraiser'],
    intro: {
      fr: 'La Configuration de Lemarchand ouvre simultanement la maison Cotton et le Labyrinthe de Leviathan. Frank cherche du sang pour reconstruire son corps tandis que les Cenobites viennent reclamer celui qui a ouvert le seuil.',
      en: 'Lemarchands Configuration opens the Cotton house and Leviathans Labyrinth at once. Frank seeks blood to rebuild his body while the Cenobites come to claim the one who opened the threshold.'
    },
    missions: [
      { fr: 'Intro - Grenier Cotton: suivre les traces de sang et comprendre que le corps sans peau est Frank, pas une creature anonyme produite par la Breche.', en: 'Intro - Cotton Attic: follow the blood trail and identify the skinless body as Frank rather than an anonymous Breach creature.' },
      { fr: 'Mission - Prix de Julia: empecher de nouvelles victimes de nourrir la resurrection sans effacer le desir, la trahison et les choix humains qui ont ouvert la maison.', en: 'Mission - Julias Price: stop new victims from feeding the resurrection without erasing the desire, betrayal, and human choices that opened the house.' },
      { fr: 'Interlude - Pacte de Kirsty: proposer Frank aux Cenobites, conserver la boite et rappeler que leur sentence suit un pacte plutot qu une chasse aleatoire.', en: 'Interlude - Kirstys Bargain: offer Frank to the Cenobites, retain the box, and establish that their sentence follows a bargain rather than a random hunt.' },
      { fr: 'Mission - Labyrinthe: resoudre les configurations pendant que Chatterer, Butterball et la Female Cenobite ferment les routes sous la lumiere noire.', en: 'Mission - Labyrinth: solve the configurations while Chatterer, Butterball, and the Female Cenobite close routes beneath the black light.' },
      { fr: 'Boss - Leviathan: retourner la configuration au moment exact, briser le relais de Channard et fermer le seuil sans pretendre detruire le dieu du Labyrinthe.', en: 'Boss - Leviathan: reverse the configuration at the exact moment, break Channards relay, and close the threshold without pretending to destroy the god of the Labyrinth.' }
    ],
    outro: { fr: 'La maison redevient un lieu humain, mais la boite demeure. A.R.C.A. archive la regle essentielle: ouvrir est un choix, negocier a un prix et refermer exige de comprendre la configuration.', en: 'The house becomes human space again, but the box remains. A.R.C.A. archives the essential rule: opening is a choice, bargaining has a price, and closing requires understanding the configuration.' },
    reward: { fr: 'Configuration Lemarchand scellee + apparence Kirsty Labyrinthe', en: 'Sealed Lemarchand Configuration + Labyrinth Kirsty skin' }
  },
  {
    id: 'hellraiser_2022_six_configurations',
    title: { fr: 'Arc Univers - Hellraiser 2022: les six configurations', en: 'Universe Arc - Hellraiser 2022: The Six Configurations' },
    universes: ['Hellraiser'],
    intro: {
      fr: 'Six ans apres avoir exige la sensation, Roland Voight vit prisonnier de son propre mecanisme nerveux. Riley recupere une nouvelle boite dont chaque forme exige un sacrifice et rapproche le manoir de l audience de Leviathan.',
      en: 'Six years after demanding sensation, Roland Voight lives trapped inside his own nerve mechanism. Riley finds a new box whose every form demands a sacrifice and draws the mansion closer to Leviathans audience.'
    },
    missions: [
      { fr: 'Intro - Entrepot de Voight: retrouver la boite, identifier sa lame retractable et refuser de traiter la premiere victime comme un simple cout de tutoriel.', en: 'Intro - Voights Warehouse: recover the box, identify its retractable blade, and refuse to treat its first victim as a disposable tutorial cost.' },
      { fr: 'Mission - Configurations: stabiliser Lament, Lore, Laudarant, Liminal et Lazarus sans laisser le Sans-Auteur fusionner leurs recompenses en un bonus generique.', en: 'Mission - Configurations: stabilize Lament, Lore, Laudarant, Liminal, and Lazarus without letting the Authorless merge their rewards into a generic bonus.' },
      { fr: 'Interlude - Maison piege: Riley, Colin et Trevor traversent les couloirs mobiles tandis que la Gasp, la Weeper, l Asphyx, la Mother, le Masque et Chatterer appliquent les marques deja ouvertes.', en: 'Interlude - Puzzle Mansion: Riley, Colin, and Trevor cross shifting corridors while the Gasp, Weeper, Asphyx, Mother, Masque, and Chatterer enforce the marks already opened.' },
      { fr: 'Mission - Cage d acier: utiliser le dessin du manoir pour enfermer les Cenobites sans pretendre que la grille annule la juridiction de la boite.', en: 'Mission - Steel Cage: use the mansions design to contain the Cenobites without pretending the grid cancels the boxs jurisdiction.' },
      { fr: 'Boss - Audience de Leviathan: retourner le dernier sacrifice contre Voight, survivre a sa transformation et choisir Lament plutot qu une recompense falsifiee.', en: 'Boss - Leviathans Audience: turn the final sacrifice against Voight, survive his transformation, and choose Lament rather than accept a falsified reward.' }
    ],
    outro: { fr: 'Riley accepte la perte au lieu de demander a Leviathan de reecrire son histoire. A.R.C.A. archive les deux continuites Hellraiser sans confondre la Pretresse de 2022 avec Elliot Spencer.', en: 'Riley accepts loss instead of asking Leviathan to rewrite her history. A.R.C.A. archives both Hellraiser continuities without confusing the 2022 Priest with Elliot Spencer.' },
    reward: { fr: 'Configuration Lament 2022 + apparence Riley audience', en: '2022 Lament Configuration + Audience Riley skin' }
  },
  {
    id: 'nightmare_elm_street_wake_up',
    title: { fr: 'Arc Univers - Les Griffes de la nuit: reveil de Springwood', en: 'Universe Arc - A Nightmare on Elm Street: Springwood Wake-Up' },
    universes: ['A Nightmare on Elm Street'],
    intro: {
      fr: 'Apres la mort de Tina, Nancy comprend que le meme homme au pull rouge et vert poursuit les adolescents de Springwood dans leurs reves. Freddy transforme chaque sommeil en scene, mais il perd son avantage quand ses victimes partagent leurs preuves et preparent le reveil.',
      en: 'After Tinas death, Nancy realizes the same man in a red and green sweater hunts Springwoods teenagers in their dreams. Freddy turns every sleep into a stage, but loses his advantage when his victims share evidence and prepare to wake.'
    },
    missions: [
      { fr: 'Intro - Premier cauchemar: relier le gant a lames, la chaufferie et la comptine avant que la police ne classe la mort de Tina comme un crime ordinaire.', en: 'Intro - First Nightmare: connect the bladed glove, boiler room, and nursery rhyme before police reduce Tinas death to an ordinary crime.' },
      { fr: 'Mission - 1428 Elm Street: fabriquer les pieges de Nancy, regler les reveils et maintenir un passage materiel pour arracher Freddy au reve.', en: 'Mission - 1428 Elm Street: build Nancys traps, set the alarms, and maintain a physical route for pulling Freddy out of the dream.' },
      { fr: 'Interlude - Westin Hills: Kristen rassemble les Dream Warriors, Hypnocil retarde le sommeil paradoxal et chaque survivant choisit la forme de son pouvoir onirique.', en: 'Interlude - Westin Hills: Kristen gathers the Dream Warriors, Hypnocil delays REM sleep, and each survivor chooses the form of their dream power.' },
      { fr: 'Mission - Dream Master: Alice recueille les techniques des victimes sans les reduire a des bonus et ouvre le miroir ou leurs ames peuvent repondre.', en: 'Mission - Dream Master: Alice carries the victims techniques without reducing them to bonuses and opens the mirror where their souls can answer.' },
      { fr: 'Boss - Freddy Krueger: le rendre materiel, declencher les pieges du 1428 puis lui retirer la peur et les ames qui maintiennent son controle du reve.', en: 'Boss - Freddy Krueger: make him physical, trigger the 1428 traps, then strip away the fear and souls sustaining his control of the dream.' }
    ],
    outro: { fr: 'Springwood se reveille sans garantie de fin definitive. Nancy laisse un protocole de sommeil partage: personne ne combat seul, chaque reve possede une heure de sortie et Freddy ne decide plus qui doit etre oublie.', en: 'Springwood wakes without any promise of a permanent ending. Nancy leaves a shared-sleep protocol: nobody fights alone, every dream has an exit time, and Freddy no longer decides who is forgotten.' },
    reward: { fr: 'Reveil de Nancy + apparence Dream Warriors', en: 'Nancys Alarm Clock + Dream Warriors skin' }
  },
  {
    id: 'the_ring_seven_day_investigation',
    title: { fr: 'Arc Univers - Le Cercle: sept jours', en: 'Universe Arc - The Ring: Seven Days' },
    universes: ['The Ring'],
    intro: {
      fr: 'Rachel Keller regarde la cassette sans etiquette apres la mort de Katie. Le telephone annonce sept jours; les images du puits, de l echelle, des chevaux et du miroir deviennent les seules pistes capables de mener jusqu a Samara Morgan.',
      en: 'Rachel Keller watches the unmarked tape after Katies death. The telephone announces seven days; images of the well, ladder, horses, and mirror become the only clues leading to Samara Morgan.'
    },
    missions: [
      { fr: 'Intro - Shelter Mountain: recuperer la cassette, photographier ses distortions et lancer un compte a rebours qui ne se met jamais en pause entre deux missions.', en: 'Intro - Shelter Mountain: recover the tape, photograph its distortions, and start a countdown that never pauses between missions.' },
      { fr: 'Mission - Morgan Ranch: interroger Richard, relier les chevaux a Anna et retrouver les dossiers qui prouvent que les images viennent de Samara.', en: 'Mission - Morgan Ranch: question Richard, connect the horses to Anna, and recover records proving the images come from Samara.' },
      { fr: 'Interlude - Dessins d Aidan: comprendre que l enfant voit deja Samara et que lui rendre son corps ne signifie pas apaiser la malediction.', en: 'Interlude - Aidans Drawings: understand that the child already sees Samara and that recovering her body does not mean appeasing the curse.' },
      { fr: 'Mission - Moesko Island: suivre l arbre brule jusqu au puits, descendre dans la chambre de sept jours et ramener les preuves avant la fermeture.', en: 'Mission - Moesko Island: follow the burned tree to the well, descend into the seven-day chamber, and recover the evidence before it closes.' },
      { fr: 'Boss - Samara hors de l ecran: survivre a la sortie de television, isoler la nensha et produire une copie controlee sans la transmettre a un innocent.', en: 'Boss - Samara Beyond the Screen: survive the television crawl, isolate the nensha, and create a controlled copy without passing it to an innocent.' }
    ],
    outro: { fr: 'Rachel ne celebre pas une victoire fausse. La copie est enfermee dans une coordonnee A.R.C.A., le compte des sept jours reste visible et chaque nouveau visionnage devient une decision de quarantaine.', en: 'Rachel does not celebrate a false victory. The copy is sealed inside an A.R.C.A. coordinate, the seven-day count remains visible, and every new viewing becomes a quarantine decision.' },
    reward: { fr: 'Cassette de quarantaine + apparence Rachel enquetrice', en: 'Quarantine Tape + Investigator Rachel skin' }
  },
  {
    id: 'the_grudge_saeki_contact_chain',
    title: { fr: 'Arc Univers - The Grudge: chaine de contact Saeki', en: 'Universe Arc - The Grudge: Saeki Contact Chain' },
    universes: ['The Grudge'],
    intro: {
      fr: 'Karen Davis remplace une aide a domicile disparue dans la maison Saeki. Emma reste seule, Toshio apparait dans le placard et le rale de Kayako confirme que le Ju-On attend deja chaque personne entree dans la piece.',
      en: 'Karen Davis replaces a missing care worker inside the Saeki house. Emma sits alone, Toshio appears in the closet, and Kayakos death rattle confirms the Ju-On is already waiting for everyone who entered the room.'
    },
    missions: [
      { fr: 'Intro - Visite de soins: retrouver Emma, ouvrir le placard condamne et marquer Karen comme contact avant que la maison ne reecrive l ordre des evenements.', en: 'Intro - Care Visit: find Emma, open the sealed closet, and mark Karen as a contact before the house rewrites the order of events.' },
      { fr: 'Mission - Dossier Nakagawa: relier les meurtres Saeki, les policiers disparus et les visiteurs recents a partir de photos, magnetophones et cameras de securite.', en: 'Mission - Nakagawa File: connect the Saeki murders, missing police officers, and recent visitors through photographs, recorders, and security cameras.' },
      { fr: 'Interlude - Takeo et le grenier: reconstituer le meurtre de Kayako, la noyade de Toshio et la violence qui a cree la malediction sans transformer les victimes en simples monstres.', en: 'Interlude - Takeo and the Attic: reconstruct Kayakos murder, Toshios drowning, and the violence that created the curse without turning its victims into generic monsters.' },
      { fr: 'Mission - Maison incendiee: utiliser l essence de Nakagawa comme barriere de repli, evacuer les nouveaux visiteurs et constater que le feu ne coupe pas les contacts deja transmis.', en: 'Mission - Burning House: use Nakagawas gasoline as a retreat barrier, evacuate new visitors, and establish that fire does not break contacts already transmitted.' },
      { fr: 'Boss - Descente de Kayako: traverser escalier, plafond et grenier, rompre la chaine de nouvelles visites et extraire Karen sans annoncer une purification impossible.', en: 'Boss - Kayakos Descent: cross staircase, ceiling, and attic, break the chain of new visits, and extract Karen without claiming an impossible cleansing.' }
    ],
    outro: { fr: 'La maison reste condamnee et le Ju-On survit dans ses contacts. A.R.C.A. obtient seulement une victoire honnete: aucune nouvelle personne ne franchit le seuil et chaque survivant porte un dossier qui ne sera plus nie.', en: 'The house remains condemned and the Ju-On survives through its contacts. A.R.C.A. earns only an honest victory: nobody new crosses the threshold and every survivor carries a record that will no longer be denied.' },
    reward: { fr: 'Magnetophone Nakagawa + apparence Karen maison Saeki', en: 'Nakagawa Recorder + Saeki House Karen skin' }
  }
];

export const FEATURED_ENEMY_LORE = {
  Tomba: {
    'Koma Pig Patrol': localized('Les Koma Pigs sont les voleurs recurrents de l ile: ils derobent le bracelet du grand-pere de Tomba, transportent des objets et deviennent des projectiles quand il les agrippe.', 'Koma Pigs are the islands recurring thieves: they steal Tombas grandfathers bracelet, carry objects, and become projectiles when he grapples them.'),
    'Biting Plant Cluster': localized('Ces plantes carnivores appartiennent aux obstacles vivants de la foret. Elles ferment un chemin par leur morsure et doivent etre contournees ou frappees comme dans une sequence de plateforme.', 'These carnivorous plants belong to the forests living obstacles. Their bite seals a route and they must be bypassed or struck like a platforming hazard.'),
    'Needlegator Ravine Pack': localized('Les Needlegators de Phoenix Mountain utilisent leur dos epineux pour punir une chute mal preparee et obligent Tomba a lire le vent avant de sauter.', 'Phoenix Mountain Needlegators use their spined backs to punish a bad landing and force Tomba to read the wind before jumping.'),
    'Fire Evil Pig': localized('Le Fire Evil Pig impose une malediction de chaleur a son domaine. Seul le sac qui lui correspond permet de le faire apparaitre puis de retourner sa magie contre lui.', 'The Fire Evil Pig places a heat curse on its domain. Only its matching bag can reveal it and turn its own magic back against it.'),
    'Stormy Evil Pig': localized('Le Stormy Evil Pig controle les rafales de Phoenix Mountain et transforme les routes verticales en pieges. Son scellement restaure les vents normaux de la zone.', 'The Stormy Evil Pig controls Phoenix Mountains gusts and turns vertical routes into traps. Sealing it restores the regions natural winds.'),
    'Real Evil Pig': localized('Le Real Evil Pig est la source qui rassemble les sept maledictions et le dernier obstacle entre Tomba et le bracelet vole. Il doit etre enferme avec la logique complete des sept sacs.', 'The Real Evil Pig is the source gathering all seven curses and the last obstacle between Tomba and the stolen bracelet. It must be sealed through the complete logic of all seven bags.')
  },
  Woodruff: {
    'Bigwig Henchman': localized('Ces hommes de main en noir participent au raid contre la maison d Azimuth, enlevent le professeur et abattent le nounours de Woodruff. Ils representent la violence concrete derriere la bureaucratie.', 'These black-clad henchmen raid Azimuths home, abduct the professor, and shoot Woodruffs teddy bear. They are the concrete violence behind the bureaucracy.'),
    'Slammers End Jailer': localized('Le geolier de Slammers End bloque la tour de prison par sa fonction et ses clefs. Woodruff ne le vainc pas par la force: il doit obtenir la bonne route et le bon objet.', 'The Slammers End jailer blocks the prison tower through office and keys. Woodruff does not defeat him by force: he needs the right route and item.'),
    'Factory Permit Guard': localized('Le garde de l usine refuse toute entree sans certificat de travail. Dans le jeu, sa menace est administrative: une enigme de permis, pas un soldat fantastique invente.', 'The factory guard refuses entry without a work certificate. In the original game his threat is administrative: a permit puzzle, not an invented fantasy soldier.'),
    'Schnibble Sect High Priest': localized('Le Grand Pretre exige mantra, donations, code sacre et cycle de concentration avant de designer un initie. Son combat A.R.C.A. conserve cette boucle de manipulation sectaire.', 'The High Priest demands a mantra, donations, the sacred code, and a concentration cycle before choosing an initiate. His A.R.C.A. encounter preserves that cult manipulation loop.'),
    'Bigwig Captive Beast': localized('La bete liberee dans l appartement de Bigwig tente de posseder Woodruff. Le Bouzooioli permet de resister avant de la capturer dans le Schprotznog avec le chewing-gum.', 'The beast released inside Bigwigs apartment tries to possess Woodruff. Boozooioli resists it before the creature is trapped in the Schprotznog with chewing gum.'),
    'The Bigwig': localized('Bigwig est le conseiller corrompu qui gouverne la ville par impots, interdictions et police, fait enlever Azimuth et veut accaparer le Schnibble. Il reste un tyran humain, jamais un demon generique.', 'Bigwig is the corrupt adviser ruling the city through taxes, restrictions, and police, abducting Azimuth and seeking the Schnibble. He remains a human tyrant, never a generic demon.')
  },
  Hellraiser: {
    'Skinless Frank Cotton': localized('Frank revient sous le plancher du grenier quand le sang touche le lieu de sa fuite. Sans peau et incomplet, il pousse Julia a lui fournir des victimes pour reconstruire son corps.', 'Frank returns beneath the attic floor when blood touches the place of his escape. Skinless and incomplete, he drives Julia to supply victims so he can rebuild his body.'),
    'Eremite Puzzle Guardian': localized('L Eremite est la figure squelettique associee a la Configuration de Lemarchand. Il garde la boite et rappelle que le seuil possede un mecanisme precis.', 'The Eremite is the skeletal figure associated with Lemarchands Configuration. It guards the box and establishes that the threshold follows a precise mechanism.'),
    'Labyrinth Chain Corridor': localized('Ce couloir est un mecanisme du Labyrinthe, pas un monstre autonome: les murs ouvrent des crochets qui suivent la sentence prononcee par les Cenobites.', 'This corridor is a Labyrinth mechanism rather than an autonomous monster: its walls release hooks that execute the sentence pronounced by the Cenobites.'),
    'Channard Cenobite': localized('Le docteur Channard est transforme par Leviathan en Cenobite chirurgical relie a un long appendice. Il retourne son obsession pour les esprits malades contre patients et Cenobites.', 'Doctor Channard is transformed by Leviathan into a surgical Cenobite attached to a long appendage. He turns his obsession with damaged minds against patients and Cenobites alike.'),
    'The Engineer': localized('L Engineer est la bete du Labyrinthe qui poursuit Kirsty dans les couloirs apres ouverture de la boite. Sa gueule et son corps bas en font un traqueur, pas un demon humanoide.', 'The Engineer is the Labyrinth beast that pursues Kirsty through the corridors after the box opens. Its maw and low body make it a tracker rather than a humanoid demon.'),
    'Leviathan Diamond': localized('Leviathan domine le Labyrinthe sous la forme dun immense losange noir projetant sa lumiere. Il ordonne les transformations cenobites et la geometrie du royaume.', 'Leviathan rules the Labyrinth as a vast black diamond projecting its light. It commands Cenobite transformations and the realms geometry.'),
    'The Auditor (Judgment)': localized('L Auditor est le greffier balafre de l Inquisition stygienne. Derriere ses lunettes rondes et son costume noir use, il consigne les confessions sur des feuilles de chair avec une machine a ecrire; il ne fait pas partie de l Ordre de l Entaille.', 'The Auditor is the scarred clerk of the Stygian Inquisition. Behind round goggles and a worn black suit, he records confessions on flesh pages with a typewriter; he is not part of the Order of the Gash.'),
    'The Assessor (Judgment)': localized('L Assessor est le membre corpulent de l Inquisition qui traite les pages remises par l Auditor. Son veston sale porte sans chemise et son rituel de consommation transmettent la matiere du verdict au Jury.', 'The Assessor is the corpulent Inquisition member who processes pages delivered by the Auditor. His dirty shirtless jacket and consumption ritual pass the verdict material to the Jury.'),
    'The Jury (Judgment)': localized('Le Jury rassemble trois jeunes femmes aux visages depouilles, toujours presentes comme un collectif. Elles lisent la matiere produite par l Assessor et prononcent ensemble le verdict; le jeu conserve leur silhouette de trio sans nudite explicite.', 'The Jury consists of three young women with stripped faces, always presented as a collective. They read the material produced by the Assessor and deliver one verdict together; the game preserves their trio silhouette without explicit nudity.'),
    'The Cleaners (Judgment)': localized('Les Cleaners sont trois femmes tres agees qui accomplissent la phase de purification avant la sentence chirurgicale. Elles restent un trio de l Inquisition stygienne, jamais des Cenobites ni une seule creature dupliquee.', 'The Cleaners are three very old women who perform the cleansing phase before surgical punishment. They remain a Stygian Inquisition trio, never Cenobites or one duplicated creature.'),
    'The Butcher (Judgment)': localized('Le Butcher est le colosse de l Inquisition stygienne. Son masque de cheveux, son tablier souille et sa gigantesque faux accompagnent de larges gestes de decoupe; il execute la sentence avec le Surgeon.', 'The Butcher is the Stygian Inquisitions behemoth. His curtain of hair, stained apron, and giant scythe accompany broad cutting motions; he carries out punishment with the Surgeon.'),
    'The Surgeon (Judgment)': localized('Le Surgeon de Judgment est un bourreau maigre suspendu a un harnais, masque par une tete organique et un respirateur noir, puis arme d instruments chirurgicaux. Il est distinct du Surgeon Cenobite de Hellseeker deja repertorie.', 'Judgments Surgeon is a thin executioner suspended from a harness, hidden behind an organic headpiece and black respirator, and armed with surgical instruments. This character is distinct from the Hellseeker Surgeon Cenobite already catalogued.'),
    'The Gasp (2022)': localized('La Gasp porte une architecture de perles et de tensions autour de la gorge et du visage. Sa silhouette pale et drapee appartient au nouvel ordre de 2022, jamais a la Female Cenobite classique.', 'The Gasp carries a pearl-and-tension architecture around her throat and face. Her pale draped silhouette belongs to the 2022 order and is never substituted for the classic Female Cenobite.'),
    'The Weeper (2022)': localized('La Weeper avance avec une ouverture faciale verticale et des traces sombres semblables a des larmes. Son attaque prolonge cette ligne anatomique au lieu de lui donner une arme humaine arbitraire.', 'The Weeper advances with a vertical facial opening and dark tear-like trails. Her attack extends that anatomical line instead of assigning her an arbitrary human weapon.'),
    'The Asphyx (2022)': localized('L Asphyx est construit autour de la respiration contrainte: tete et gorge sont enchassees dans un dispositif organique rigide. Il impose silence et manque dair dans les couloirs du manoir.', 'The Asphyx is built around constrained breathing: head and throat are locked inside a rigid organic device. He imposes silence and air deprivation through the mansion corridors.'),
    'The Mother (2022)': localized('La Mother possede une masse maternelle monumentale sculptee par des plis anatomiques. Sa lenteur sert une presence de procession et une zone de saisie, pas un profil de brute generique.', 'The Mother has a monumental maternal mass sculpted through anatomical folds. Her slow movement supports a processional presence and grappling zone rather than a generic brute profile.'),
    'The Masque (2022)': localized('Le Masque expose son visage comme une piece tenue a distance du crane. Ses gestes jouent sur cette separation et sur les angles du manoir, sans le confondre avec Camerahead.', 'The Masque displays his face as a piece held away from the skull. His motions exploit that separation and the mansions angles without confusing him with Camerahead.'),
    'Chatterer (2022)': localized('Le Chatterer de 2022 est une nouvelle incarnation gigantesque, pale et presque nue, dont la bouche exposee reste le centre de lecture. Il demeure distinct du Chatterer classique et de Chatterer II.', 'The 2022 Chatterer is a new towering, pale, nearly unclothed incarnation whose exposed mouth remains its visual center. It stays distinct from classic Chatterer and Chatterer II.'),
    'The Priest (2022)': localized('La Pretresse de 2022 porte un quadrillage de fines incisions, des epingles perlees et des vetements formes par sa propre anatomie. Elle preside les six configurations sans etre Elliot Spencer.', 'The 2022 Priest bears a grid of fine incisions, pearl-headed pins, and garments formed from her own anatomy. She presides over the six configurations without being Elliot Spencer.'),
    'Roland Voight - Leviathan Transformation': localized('Voight exige le pouvoir apres avoir rejete la sensation. Leviathan repond en le suspendant et en le remodelant devant son audience; cette forme est une recompense-punition, pas un Cenobite officiellement nomme.', 'Voight demands power after rejecting sensation. Leviathan answers by suspending and remaking him before its audience; this form is a reward-punishment, not an officially named Cenobite.'),
    'Pistonhead Cenobite': localized('Pistonhead est la transformation de J.P. Monroe dans Hellraiser III. Son crane est traverse par un piston mecanique et ses charges doivent conserver cette origine industrielle.', 'Pistonhead is J.P. Monroes transformation in Hellraiser III. A mechanical piston crosses his skull, and his charges preserve that industrial origin.'),
    'Camerahead Cenobite': localized('Camerahead vient du cameraman Doc transforme par Pinhead. Une camera fusionnee a son visage enregistre et frappe; il ne partage ni silhouette ni pouvoir avec le Masque de 2022.', 'Camerahead comes from cameraman Doc after Pinheads transformation. A camera fused to his face records and strikes; he shares neither silhouette nor power with the 2022 Masque.'),
    'CD Cenobite': localized('Le DJ de la Boiler Room devient CD, un pseudo-Cenobite de Hellraiser III qui projette des disques comme des lames. Son equipement musical reste visible dans chaque attaque.', 'The Boiler Room DJ becomes CD, a Hellraiser III pseudo-Cenobite who throws discs like blades. His musical equipment remains visible in every attack.'),
    'Barbie Cenobite': localized('Le barman de la Boiler Room est transforme en Barbie, dont le dispositif buccal alimente une projection de feu. Le nom vient du barbecue, pas dune apparence de poupee.', 'The Boiler Room bartender becomes Barbie, whose mouth device feeds a burst of flame. The name refers to barbecue rather than a doll-like appearance.'),
    'Dreamer Cenobite': localized('Terri devient Dreamer dans Hellraiser III. Sa cigarette et sa fumee structurent ses attaques et rappellent le desir de rever et de fuir qui a permis a Pinhead de la manipuler.', 'Terri becomes Dreamer in Hellraiser III. Her cigarette and smoke structure her attacks and recall the wish to dream and escape that let Pinhead manipulate her.'),
    'Chatterer II': localized('Apres avoir retrouve brievement le visage de Nicholas, Chatterer est transforme de nouveau avec des yeux visibles et une dentition differente. Cette etape reste separee de sa premiere apparence.', 'After briefly recovering Nicholass face, Chatterer is transformed again with visible eyes and altered teeth. This stage remains separate from his first appearance.'),
    'Chatterer Beast': localized('Le Chatterer Beast de Bloodline se deplace comme un animal bas et rapide. Sa gueule et ses proportions quadrupedes interdisent de recycler une animation humanoide de Chatterer.', 'The Bloodline Chatterer Beast moves as a low, fast animal. Its maw and quadrupedal proportions prevent reuse of a humanoid Chatterer animation.'),
    'Bloodline Twins': localized('Les Twins de Bloodline sont deux victimes fusionnees en une seule architecture symetrique. Leurs attaques alternent traction opposee et mouvement parfaitement coordonne.', 'The Bloodline Twins are two victims fused into one symmetrical architecture. Their attacks alternate opposing pulls and perfectly coordinated movement.'),
    'Angelique Cenobite': localized('Angelique, princesse demoniaque invoquee par de L Isle puis soumise aux regles de Pinhead, conserve sa robe noire, ses fils et son lien direct avec la genealogie de la boite.', 'Angelique, a demon princess summoned by de L Isle and later subjected to Pinheads rules, retains her black gown, wires, and direct link to the boxs lineage.'),
    'Wire Twins': localized('Les Wire Twins forment une paire symetrique aux chairs retenues par des fils et des crochets. Elles attaquent comme un duo et ne doivent jamais etre reduites a un seul sprite clone.', 'The Wire Twins form a symmetrical pair whose anatomy is held by wires and hooks. They attack as a duo and must never be reduced to one cloned sprite.'),
    'Torso Cenobite': localized('Torso se traine sans membres inferieurs et transforme sa faible hauteur en approche sous les gardes. Sa locomotion au sol exige un cadrage different des Cenobites debout.', 'Torso drags itself without lower limbs and turns its low height into an approach beneath guards. Its ground locomotion requires framing distinct from standing Cenobites.'),
    'Stitch Cenobite': localized('Stitch porte une couture faciale horizontale qui ferme et deforme ses traits. Ses crochets suivent cette ligne sans inventer une magie qui ne vient pas du film.', 'Stitch bears a horizontal facial seam that closes and distorts her features. Her hooks follow that line without inventing magic absent from the film.'),
    'Bound Cenobites': localized('Les Bound Cenobites sont maintenus dans des contraintes de cuir et de metal qui limitent leurs gestes. En jeu, leur resistance et leur attaque liee viennent de cette immobilisation.', 'The Bound Cenobites are held inside leather and metal restraints that limit their movement. In play, their resistance and binding attack come from that immobilization.'),
    'Surgeon Cenobite': localized('Le Surgeon utilise des instruments integres a sa fonction rituelle. Il controle une zone par gestes precis et ne devient pas un simple medecin zombie.', 'The Surgeon uses instruments integrated into his ritual function. He controls an area through precise gestures rather than becoming a generic zombie doctor.'),
    'Pseudo-Pinhead': localized('Pseudo-Pinhead reproduit imparfaitement le quadrillage et les clous du Hell Priest. Le dossier le classe comme imitation tardive afin de ne jamais remplacer Pinhead ou la Pretresse de 2022.', 'Pseudo-Pinhead imperfectly reproduces the Hell Priests grid and nails. The dossier classifies him as a later imitation so he never replaces Pinhead or the 2022 Priest.')
  },
  'A Nightmare on Elm Street': {
    'Freddy Puppet Marionette': localized('Freddy utilise la logique de marionnette pour prendre le controle dun dormeur et faire de son propre corps un piege. Les fils sont une extension du cauchemar, pas une nouvelle espece.', 'Freddy uses puppet logic to control a sleeper and turn the victims own body into a trap. The strings are an extension of the nightmare, not a new species.'),
    'Freddy Serpent Form': localized('Dans le reve de Kristen, Freddy allonge son corps en serpent geant pour avaler sa victime. La forme conserve son visage brule, son fedora et son humour cruel.', 'Inside Kristens dream, Freddy stretches into a giant serpent to swallow his victim. The form keeps his burned face, fedora, and cruel humor.'),
    'Soul Chest Wretch': localized('Les visages emprisonnes dans la poitrine de Freddy sont les victimes dont il tire sa puissance. Leurs cris deviennent aussi la faille qui permet de les liberer.', 'The faces trapped in Freddys chest are victims from whom he draws power. Their cries also become the opening through which they can be freed.'),
    'Freddy Television Form': localized('Freddy traverse le televiseur pour tuer Jennifer et transforme la culture populaire en execution. Le poste et les bras mecaniques restent une mise en scene de son reve.', 'Freddy crosses through a television to kill Jennifer, turning popular culture into an execution. The set and mechanical arms remain part of his dream staging.'),
    'Freddy Dream Master': localized('Face a Alice, Freddy exploite les peurs et pouvoirs accumules par les derniers enfants de Springwood. Le miroir des ames retourne finalement cette collection contre lui.', 'Against Alice, Freddy exploits the fears and powers accumulated from Springwoods remaining children. The mirror of souls ultimately turns that collection against him.'),
    'Freddy Krueger': localized('Freddy est le meurtrier brule de Springwood revenu dans les reves avec fedora, pull rouge et vert et gant a quatre lames. La peur et les ames de ses victimes alimentent son controle.', 'Freddy is Springwoods burned murderer returned through dreams with fedora, red-and-green sweater, and four-bladed glove. Fear and his victims souls feed his control.')
  },
  'The Ring': {
    'Distorted Victim Echo': localized('Cet echo reprend la deformation faciale laissee par Samara sur ses victimes et dans les photographies. Il represente une preuve de la malediction, pas un zombie supplementaire.', 'This echo reproduces the facial distortion Samara leaves on victims and photographs. It represents evidence of the curse rather than an additional zombie.'),
    'Cursed Tape Static': localized('Le parasite de la cassette masque des images de puits, echelle, miroir, chevaux et arbre. Chaque frame est un indice projete par la nensha de Samara.', 'The tapes static masks images of a well, ladder, mirror, horses, and tree. Every frame is a clue projected through Samaras nensha.'),
    'Morgan Ranch Horse Panic': localized('Les chevaux Morgan reagissent violemment a la presence psychique de Samara. Cette menace est une charge de panique environnementale, jamais une creature possedee inventee.', 'The Morgan horses react violently to Samaras psychic presence. This threat is an environmental panic charge, never an invented possessed creature.'),
    'Anna Morgan Well Vision': localized('La vision reconstruit le moment ou Anna etouffe Samara puis la pousse dans le puits de Shelter Mountain. Elle doit etre comprise comme memoire de la cassette, pas comme un second fantome antagoniste.', 'The vision reconstructs Anna suffocating Samara and pushing her into the Shelter Mountain well. It is a tape memory, not a second antagonistic ghost.'),
    'Samara Television Crawl': localized('Samara sort de limage du puits, traverse le poste puis la piece jusqu a sa victime. La distance de lecran cesse alors de proteger celui qui a regarde la cassette.', 'Samara leaves the wells image, crosses the television, then the room toward her victim. Distance from the screen no longer protects anyone who watched the tape.'),
    'Samara Morgan': localized('Samara projette mentalement des images sur film et dans les esprits. Morte apres sept jours au fond du puits, elle attache ce delai a une cassette qui ne laisse vivre que par copie et transmission.', 'Samara projects images psychically onto film and into minds. Dead after seven days in the well, she binds that deadline to a tape that only spares through copying and transmission.')
  },
  'The Grudge': {
    'Toshio Attic Apparition': localized('Toshio apparait pale, silencieux ou accompagne dun miaulement apres avoir ete tue avec le chat Mar. Il attire le regard vers les pieces deja marquees par le Ju-On.', 'Toshio appears pale, silent, or accompanied by a cats cry after being killed with Mar. He draws attention toward rooms already marked by the Ju-On.'),
    'Mar Black-Cat Echo': localized('Mar est le chat noir de Toshio, tue pendant le massacre Saeki. Son cri fusionne avec les apparitions de Toshio et signale une presence avant quelle soit visible.', 'Mar is Toshios black cat, killed during the Saeki massacre. Its cry merges with Toshios apparitions and signals a presence before it becomes visible.'),
    'Cursed Security Camera Shade': localized('La camera du bureau montre Kayako avancer image par image vers l objectif. Nakagawa comprend alors que les disparitions recentes remontent toutes a la maison Saeki.', 'The office security camera shows Kayako advancing frame by frame toward the lens. Nakagawa then understands the recent disappearances all lead back to the Saeki house.'),
    'Takeo Bathtub Rage Echo': localized('Takeo reapparait dans la salle de bain ou Toshio fut noye et tue Nakagawa venu incendier la maison. Il incarne la violence initiale qui a produit le Ju-On.', 'Takeo reappears in the bathroom where Toshio was drowned and kills Nakagawa, who came to burn the house. He embodies the original violence that produced the Ju-On.'),
    'Kayako Stair Crawl': localized('Kayako descend lescalier avec son corps brise et son rale de gorge, rejouant la mort infligee par Takeo. La maison utilise cette descente pour fermer toute fuite.', 'Kayako descends the stairs with her broken body and throat rattle, replaying the death Takeo inflicted. The house uses this descent to close every escape.'),
    'Kayako Saeki Onryo': localized('Kayako meurt dans une rage et une douleur extremes, donnant naissance au Ju-On qui contamine quiconque entre dans le lieu. Elle ne chasse pas selon une morale: le contact suffit.', 'Kayako dies in extreme rage and pain, creating the Ju-On that contaminates anyone entering the place. She does not hunt by morality: contact alone is enough.')
  }
};

export const FEATURED_STAGE_LORE = {
  Tomba: {
    RPG: localized('Mushroom Forest alterne ses etats rieur et pleureur sous la malediction. Le parcours garde ses embranchements, habitants, services et objets evenementiels; le Fire Evil Pig ne peut apparaitre quavec le bon sac.', 'Mushroom Forest alternates between laughing and crying states under the curse. The route keeps its branches, inhabitants, favors, and event objects; the Fire Evil Pig only appears through the matching bag.'),
    Tactics: localized('Phoenix Mountain devient une grille verticale de courants dair, points de grappin et cretes a Needlegators. Le placement sert a proteger les routes stables avant de sceller le Stormy Evil Pig.', 'Phoenix Mountain becomes a vertical grid of wind currents, grapple points, and Needlegator ridges. Positioning protects stable routes before the Stormy Evil Pig is sealed.'),
    Smash: localized('Le sanctuaire des sept sacs transforme chaque malediction en hazard de plateforme distinct. Quand les sept ouvertures sont controlees, le Real Evil Pig peut enfin etre projete dans le dernier sceau.', 'The seven-bag sanctuary turns every curse into a distinct platform hazard. Once all seven openings are controlled, the Real Evil Pig can be thrown into the final seal.')
  },
  Woodruff: {
    RPG: localized('La basse ville de Vlurxtrznbnaxl reste une aventure point-and-click: apprendre a lire, composer des syllabes au Tobozon, parler aux habitants et relier les objets vaut mieux que frapper un faux monstre.', 'The lower city of Vlurxtrznbnaxl remains a point-and-click adventure: learning to read, dialing syllables on the Tobozon, speaking with residents, and connecting objects matter more than striking an invented monster.'),
    Tactics: localized('L Administration, la porte de lusine et le temple Bouzouk forment une carte de permis, codes et trajets. Chaque formule correcte change une regle de case et retire une interdiction reelle.', 'The Administration, factory gate, and Boozook temple form a map of permits, codes, and routes. Every correct formula changes one tile rule and removes a real restriction.'),
    Smash: localized('L appartement de Bigwig rejoue le final: Ceedeerom dans le lecteur, Viblefrotzer sur le tyran, carte magnetique, bete de possession puis Schprotznog arme de chewing-gum.', 'Bigwigs apartment reenacts the finale: Ceedeerom in the player, Viblefrotzer on the tyrant, magnetic card, possessing beast, then a Schprotznog prepared with chewing gum.')
  },
  Hellraiser: {
    RPG: localized('Le Labyrinthe suit les angles de la Configuration et la lumiere noire de Leviathan. Chaines, couloirs et Cenobites appliquent un pacte ouvert par la boite; ils ne sont pas une horde infernale sans regles.', 'The Labyrinth follows the Configurations angles and Leviathans black light. Chains, corridors, and Cenobites apply a bargain opened by the box; they are not a ruleless infernal horde.'),
    Tactics: localized('Le grenier Cotton superpose la resurrection de Frank, les victimes attirees par Julia et la negociation de Kirsty. Chaque case de sang accelere Frank tandis que la boite peut rediriger les Cenobites.', 'The Cotton attic overlaps Franks resurrection, victims lured by Julia, and Kirstys bargain. Every blood tile advances Frank while the box can redirect the Cenobites.'),
    Smash: localized('Sous le losange Leviathan, les plateformes du Labyrinthe pivotent comme les pieces de Lemarchand. La lumiere noire transforme les combattants marques et les chaines sanctionnent toute ouverture forcee.', 'Beneath Leviathans diamond, Labyrinth platforms rotate like Lemarchand pieces. Black light transforms marked fighters and chains punish every forced opening.'),
    'Voight Mansion Six-Phase Trial': localized('Le manoir de Voight reproduit la symetrie de la boite 2022. Chaque victime fait avancer une configuration precise; Riley doit atteindre Lament sans accepter les recompenses de Leviathan.', 'Voights mansion repeats the symmetry of the 2022 box. Every victim advances one precise configuration; Riley must reach Lament without accepting Leviathans rewards.'),
    'Voight Mansion Steel Cage': localized('La grille d acier integree au manoir ferme les lignes de passage des Cenobites mais ne rompt pas la marque de la boite. Le placement sert a sauver les porteurs marques et a retourner Voight contre son propre plan.', 'The steel grid built into the mansion closes Cenobite approach lines but does not break the boxs mark. Positioning saves marked carriers and turns Voight against his own plan.'),
    'Leviathan Audience Chamber 2022': localized('La derniere configuration ouvre une audience verticale sous Leviathan. Les seuils changent de profondeur, la Pretresse dirige la procession et la transformation de Voight occupe le centre sans remplacer le boss final par un noyau generique.', 'The final configuration opens a vertical audience beneath Leviathan. Thresholds shift in depth, the Priest leads the procession, and Voights transformation occupies center stage without being replaced by a generic core.')
  },
  'A Nightmare on Elm Street': {
    RPG: localized('Le 1428 Elm Street relie chambres, cave et chaufferie par le sommeil. Nancy prepare alarmes et pieges afin de ramener Freddy dans la maison materielle ou ses transformations peuvent enfin etre blessees.', '1428 Elm Street links bedrooms, basement, and boiler room through sleep. Nancy prepares alarms and traps to pull Freddy into the physical house where his transformations can finally be hurt.'),
    Tactics: localized('Westin Hills devient un reve partage: Kristen ouvre les chambres, les Dream Warriors choisissent leurs formes et les doses d Hypnocil retardent la prochaine intrusion de Freddy.', 'Westin Hills becomes a shared dream: Kristen opens the rooms, the Dream Warriors choose their forms, and Hypnocil doses delay Freddys next intrusion.'),
    Smash: localized('La chaufferie de Springwood fait surgir serpent, marionnette, television et poitrine d ames sur plusieurs plateformes. Alice utilise le miroir final pour rendre les victimes a elles-memes.', 'The Springwood boiler room brings serpent, puppet, television, and soul-chest forms across several platforms. Alice uses the final mirror to return the victims to themselves.')
  },
  'The Ring': {
    RPG: localized('La Cabine 12 de Shelter Mountain conserve le televiseur, le magnetoscope et le plancher place au-dessus du puits. Le compte des sept jours avance pendant lenquete au lieu de disparaitre entre les combats.', 'Shelter Mountain Cabin 12 keeps the television, VCR, and floor built above the well. The seven-day count advances throughout the investigation instead of disappearing between fights.'),
    Tactics: localized('Morgan Ranch et le laboratoire photo de Noah deviennent une table dindices: cheval, miroir, echelle, arbre, timecode et photographies deformees doivent etre relies avant la prochaine manifestation.', 'Morgan Ranch and Noahs photo lab become an evidence grid: horse, mirror, ladder, tree, timecode, and distorted photographs must be connected before the next manifestation.'),
    Smash: localized('Le puits ouvre directement dans une salle de television ou Samara reduit la distance image par image. Les sorties-ecran doivent etre bloquees avant la fin du septieme jour.', 'The well opens directly into a television room where Samara closes the distance frame by frame. Screen exits must be sealed before the seventh day ends.')
  },
  'The Grudge': {
    RPG: localized('La maison Saeki garde son escalier, son grenier, son placard condamne et sa salle de bain. Entrer marque immediatement le visiteur; lextraction consiste a limiter les nouveaux contacts, pas a purifier la maison.', 'The Saeki house keeps its staircase, attic, sealed closet, and bathroom. Entry immediately marks a visitor; extraction limits new contacts rather than pretending to cleanse the house.'),
    Tactics: localized('Le dossier Nakagawa relie chaque visite, disparition, photographie et camera de securite. Les cases representent une chaine de contact: partager une piece avec une trace propage le Ju-On.', 'Nakagawas file connects every visit, disappearance, photograph, and security camera. Tiles represent a contact chain: sharing a room with a trace spreads the Ju-On.'),
    Smash: localized('Lescalier et le grenier se replient lun sur lautre pendant que Toshio, Mar, Takeo et Kayako rejouent les points du massacre. Le feu ouvre une sortie courte sans detruire la malediction.', 'The staircase and attic fold into one another while Toshio, Mar, Takeo, and Kayako replay points of the massacre. Fire opens a short exit without destroying the curse.')
  }
};

export const FEATURED_GEAR_LORE = {
  tomba_grandfather_bracelet: localized('Le bracelet dore appartenait au grand-pere de Tomba avant le vol des Koma Pigs. Sa recuperation donne a toute la chasse aux Evil Pigs son objectif personnel.', 'The golden bracelet belonged to Tombas grandfather before the Koma Pigs stole it. Recovering it gives the entire Evil Pig hunt its personal objective.'),
  tomba_evil_pig_bag: localized('Le sac bleu est remis par le Dwarf Elder et correspond a son Evil Pig. Chaque sac colore ne revele que la porte de la zone maudite qui lui est associee.', 'The blue bag is given by the Dwarf Elder and matches its Evil Pig. Each colored bag only reveals the doorway to its matching cursed region.'),
  tomba_charity_wings: localized('Les Charity Wings ramenent Tomba vers une zone deja visitee. Dans la Breche, elles conservent ce role de retour rapide plutot que de devenir des ailes de vol.', 'Charity Wings return Tomba to a previously visited area. In the Breach they keep that fast-return role rather than becoming flight wings.'),
  woodruff_tobozon: localized('Le Tobozon compose des mots avec les syllabes apprises pour appeler personnes et services. Une mauvaise combinaison produit une mauvaise route, pas une attaque magique.', 'The Tobozon combines learned syllables to call people and services. A wrong combination produces a wrong route rather than a magic attack.'),
  woodruff_viblefrotzer: localized('Azimuth utilise le Viblefrotzer pour accelerer lage des cellules et permettre a Woodruff de quitter sa cachette sous une forme adolescente.', 'Azimuth uses the Viblefrotzer to accelerate cellular aging and let Woodruff leave hiding in an adolescent form.'),
  woodruff_syllable_stone: localized('Les pierres-syllabes rendent au Conseil des Sages ses mots et ses formules. Leur ordre exact permet de comprendre le passe Bouzouk et de retablir le Chprotznog.', 'Syllable stones restore words and formulas to the Wisemens Council. Their exact order reveals Boozook history and restores the Chprotznog.'),
  cenobite_hook: localized('Les crochets barbes surgissent des murs du Labyrinthe et sont tires par des chaines invisibles. Ils appliquent une sentence cenobite; ils ne sont pas une arme humaine ordinaire.', 'Barbed hooks emerge from Labyrinth walls and are pulled by unseen chains. They execute a Cenobite sentence rather than serving as an ordinary human weapon.'),
  puzzle_piece: localized('La Configuration de Lemarchand est une boite-puzzle qui ouvre ou referme le seuil du Labyrinthe. La posseder ne donne jamais le controle gratuit des Cenobites.', 'Lemarchands Configuration is a puzzle box that opens or closes the Labyrinth threshold. Possessing it never grants free control of the Cenobites.'),
  pillar_stone: localized('Le Pilier des Ames retient Pinhead et des victimes de la boite avant son reveil dans Hellraiser III. Ce fragment conserve leurs visages sans dupliquer la Configuration.', 'The Pillar of Souls contains Pinhead and victims of the box before his awakening in Hellraiser III. This fragment preserves their faces without duplicating the Configuration.'),
  hellraiser_2022_configuration: localized('La boite de 2022 traverse six formes: Lament, Lore, Laudarant, Liminal, Lazarus et Leviathan. Sa lame marque une victime et chaque sacrifice rapproche le porteur dune audience.', 'The 2022 box passes through six forms: Lament, Lore, Laudarant, Liminal, Lazarus, and Leviathan. Its blade marks a victim and every sacrifice draws the holder closer to an audience.'),
  hellraiser_voight_nerve_mechanism: localized('Le cadeau de sensation de Voight est un mecanisme fixe dans son corps qui tire aleatoirement sur ses nerfs. Cet objet signale le prix deja paye, il ne soigne ni ne renforce gratuitement.', 'Voights gift of sensation is a mechanism fixed into his body that pulls at his nerves at random. This item records the price already paid and never grants free healing or strength.'),
  hellraiser_priest_pearl_pin: localized('Les epingles perlees de la Pretresse ponctuent le quadrillage de son visage et son costume anatomique. Le fragment sert de balise de procession, pas de substitut aux clous du Pinhead classique.', 'The Priests pearl-headed pins mark the grid of her face and anatomical vestments. The fragment serves as a processional beacon rather than a substitute for classic Pinheads nails.'),
  elm_glove_shard: localized('Le gant fabrique par Freddy porte quatre lames fixees aux doigts. Dans le reve, son grincement annonce sa presence avant que la chaufferie ne se referme.', 'Freddys handmade glove carries four blades fixed to its fingers. In dreams, its scrape announces him before the boiler room closes.'),
  elm_nancy_trapkit: localized('Nancy transforme reveils, fil de piege, poudre et objets domestiques en route de reveil. Le kit blesse Freddy seulement quand il est ramene dans le monde materiel.', 'Nancy turns alarms, tripwire, powder, and household objects into a waking route. The kit hurts Freddy only after he is pulled into the physical world.'),
  elm_hypnocil: localized('Hypnocil supprime les reves et protege temporairement les patients de Westin Hills, mais son usage prolonge comporte un risque medical mortel.', 'Hypnocil suppresses dreams and temporarily protects Westin Hills patients, but prolonged use carries lethal medical risk.'),
  ring_cursed_vhs: localized('La cassette sans etiquette contient les images psychiques de Samara et declenche un appel annoncant sept jours. La survie exige une copie montree a une autre personne.', 'The unmarked tape contains Samaras psychic images and triggers a call announcing seven days. Survival requires a copy shown to another person.'),
  ring_distorted_photo: localized('Les visages photographies se deforment apres exposition a la cassette. Rachel et Noah utilisent cette anomalie comme preuve mesurable de la nensha.', 'Photographed faces distort after exposure to the tape. Rachel and Noah use the anomaly as measurable evidence of nensha.'),
  ring_shelter_well_stone: localized('Aidan dessine un cercle noir avant que Rachel ne comprenne quil reproduit lanneau de lumiere visible depuis le puits de Samara. Le dessin sert d indice physique de sa communication avec elle.', 'Aidan draws a black ring before Rachel understands that it reproduces the ring of light visible from Samaras well. The drawing is physical evidence of his contact with her.'),
  grudge_saeki_photo: localized('La photographie de famille conserve Kayako, Takeo, Toshio et Mar avant le massacre. Ses visages permettent de reconnaitre les manifestations sans les confondre.', 'The family photograph preserves Kayako, Takeo, Toshio, and Mar before the massacre. Its faces identify manifestations without confusing them.'),
  grudge_case_recorder: localized('Le journal de Kayako contient ses sentiments obsessionnels pour Peter Kirk. Takeo le decouvre avant le massacre qui engendre le Ju-On.', 'Kayakos journal records her obsessive feelings for Peter Kirk. Takeo discovers it before the murders that create the Ju-On.'),
  grudge_house_key: localized('Nakagawa apporte un bidon dessence dans la maison Saeki pour tenter de la detruire par le feu. Le geste retarde une manifestation sans supprimer la malediction.', 'Nakagawa brings a gasoline can into the Saeki house in an attempt to destroy it by fire. The act delays a manifestation without ending the curse.')
};

export const FEATURED_UNIVERSE_ICONS = {
  Tomba: '/universe-icons/tomba-openai.png',
  Woodruff: '/universe-icons/woodruff-openai.png',
  Hellraiser: '/universe-icons/hellraiser-openai.png',
  'A Nightmare on Elm Street': '/universe-icons/a-nightmare-on-elm-street-openai.png',
  'The Ring': '/universe-icons/the-ring-openai.png',
  'The Grudge': '/universe-icons/the-grudge-openai.png'
};

export const FEATURED_BACKDROPS = {
  Tomba: {
    RPG: '/backgrounds/featured/tomba-rpg-openai.png',
    Tactics: '/backgrounds/featured/tomba-tactics-openai.png',
    Smash: '/backgrounds/featured/tomba-smash-openai.png'
  },
  Woodruff: {
    RPG: '/backgrounds/featured/woodruff-rpg-openai.png',
    Tactics: '/backgrounds/featured/woodruff-tactics-openai.png',
    Smash: '/backgrounds/featured/woodruff-smash-openai.png'
  },
  Hellraiser: {
    RPG: '/backgrounds/hellraiser-rpg-openai.png',
    Tactics: '/backgrounds/featured/hellraiser-tactics-openai.png',
    Smash: '/backgrounds/featured/hellraiser-smash-openai.png'
  },
  'A Nightmare on Elm Street': {
    RPG: '/backgrounds/featured/a-nightmare-on-elm-street-rpg-openai.png',
    Tactics: '/backgrounds/featured/a-nightmare-on-elm-street-tactics-openai.png',
    Smash: '/backgrounds/featured/a-nightmare-on-elm-street-smash-openai.png'
  },
  'The Ring': {
    RPG: '/backgrounds/featured/the-ring-rpg-openai.png',
    Tactics: '/backgrounds/featured/the-ring-tactics-openai.png',
    Smash: '/backgrounds/featured/the-ring-smash-openai.png'
  },
  'The Grudge': {
    RPG: '/backgrounds/featured/the-grudge-rpg-openai.png',
    Tactics: '/backgrounds/featured/the-grudge-tactics-openai.png',
    Smash: '/backgrounds/featured/the-grudge-smash-openai.png'
  }
};

const plaque = (originFr, originEn, breachFr, breachEn, doctrineFr, doctrineEn, tags = []) => ({
  origin: { fr: originFr, en: originEn },
  dossier: { fr: breachFr, en: breachEn },
  breachLore: { fr: breachFr, en: breachEn },
  doctrine: { fr: doctrineFr, en: doctrineEn },
  tags
});

export const FEATURED_CHARACTER_PLAQUES = {
  tomba_hero: plaque(
    'Tomba vit sur une ile que sept Evil Pigs ont divisee en zones maudites. Sauvage, direct et presque toujours pieds nus, il bondit sur les cochons, les mord, les saisit et les projette tout en poursuivant le bracelet dore vole a son grand-pere.',
    'Tomba lives on an island split into cursed regions by seven Evil Pigs. Wild, direct, and usually barefoot, he jumps on pigs, bites, grabs, and throws them while pursuing the golden bracelet stolen from his grandfather.',
    'La Breche accroche simultanement plusieurs maledictions de l ile. Tomba refuse de frapper un noyau generique: il retrouve le sac correspondant, force chaque Evil Pig a reapparaitre dans son propre domaine et restaure les villages evenement par evenement.',
    'The Breach hooks several island curses at once. Tomba refuses to hit a generic core: he recovers the matching bag, forces each Evil Pig to reappear inside its own domain, and restores villages one event at a time.',
    'Saut agrippe, projection de Koma Pig, grappin, Animal Dash et scellement par sac.',
    'Grapple jump, Koma Pig throw, grappling hook, Animal Dash, and bag sealing.',
    ['Evil Pigs', 'golden bracelet', 'pig bag']
  ),
  charles_tomba: plaque(
    'Charles est le singe espiegle qui enseigne a Tomba des techniques animales, notamment l Animal Dash et la nage, en echange de nourriture et de services rendus.',
    'Charles is the mischievous monkey who teaches Tomba animal techniques, including Animal Dash and swimming, in exchange for food and favors.',
    'A.R.C.A. classe Charles comme instructeur mobile: il lit les routes verticales, ouvre des raccourcis et transforme les mouvements propres a Tomba en options de repositionnement pour toute la cellule.',
    'A.R.C.A. classifies Charles as a mobile instructor: he reads vertical routes, opens shortcuts, and turns Tombas movement techniques into repositioning options for the whole cell.',
    'Bond, lecon animale, esquive de branche et acceleration collective.',
    'Pounce, animal lesson, branch dodge, and squad acceleration.',
    ['Charles', 'Animal Dash', 'teacher']
  ),
  tabby_tomba: plaque(
    'Tabby est l amie d enfance de Tomba et la personne que les Evil Pigs enlevent dans Tomba 2, donnant a sa seconde aventure un objectif personnel au-dela du bracelet.',
    'Tabby is Tombas childhood friend and the person kidnapped by the Evil Pigs in Tomba 2, giving his second adventure a personal goal beyond the bracelet.',
    'Dans la Trame fracturee, Tabby conserve les itineraires civils et les souvenirs que les nouvelles maledictions tentent de remplacer. Elle ne devient pas une guerriere arbitraire: elle guide, protege et maintient le lien qui empeche Tomba de se perdre dans la chasse.',
    'Inside the fractured Thread, Tabby preserves civilian routes and memories that new curses try to replace. She does not become an arbitrary warrior: she guides, protects, and maintains the bond that keeps Tomba from disappearing into the hunt.',
    'Signal du collier, garde de route, soutien villageois et appel de sauvetage.',
    'Necklace signal, route guard, village support, and rescue call.',
    ['Tabby', 'Tomba 2', 'rescue']
  ),
  woodruff_hero: plaque(
    'Woodruff est le fils adoptif mi-humain mi-Bouzouk du professeur Azimuth. Le Viblefrotzer le fait vieillir d environ quinze ans en quelques secondes; encore illetre, pieds nus et mentalement jeune, il part sauver Azimuth, venger son ours et comprendre le Schnibble.',
    'Woodruff is Professor Azimuths adopted half-human, half-Boozook son. The Viblefrotzer ages him roughly fifteen years in seconds; still illiterate, barefoot, and mentally young, he leaves to save Azimuth, avenge his teddy bear, and understand the Schnibble.',
    'La Breche transforme les formulaires de Bigwig en verrous reels. Woodruff progresse comme dans son aventure: il apprend, collecte des syllabes, obtient des certificats absurdes, reforme le Conseil des Sages et gagne par une solution de puzzle plutot que par une puissance inventee.',
    'The Breach turns Bigwigs paperwork into physical locks. Woodruff progresses as in his adventure: he learns, collects syllables, obtains absurd certificates, rebuilds the Wisemens Council, and wins through puzzle logic rather than invented power.',
    'Tobozon, Transportozon, formules de syllabes, objets combines et Schnibble.',
    'Tobozon, Transportozon, syllable formulas, combined objects, and the Schnibble.',
    ['Schnibble', 'Viblefrotzer', 'point and click']
  ),
  professor_azimuth: plaque(
    'Azimuth cache ses recherches dans une maison-laboratoire et protege Woodruff apres la guerre contre les Bouzouks. Son Viblefrotzer est un accelerateur de croissance improvise, pas une arme de combat.',
    'Azimuth hides his research inside a house laboratory and protects Woodruff after the war against the Boozooks. His Viblefrotzer is an improvised growth accelerator, not a combat weapon.',
    'A.R.C.A. lui confie les anomalies d age et de causalite que Bigwig utilise pour falsifier les dossiers. Azimuth stabilise Woodruff sans annuler ce que la machine lui a fait et transforme son laboratoire en point de retour.',
    'A.R.C.A. assigns him age and causality anomalies Bigwig uses to falsify records. Azimuth stabilizes Woodruff without undoing what the machine did and turns his laboratory into a return point.',
    'Reglage du Viblefrotzer, appareils de laboratoire, cache secrete et formule de croissance.',
    'Viblefrotzer tuning, laboratory devices, hidden workshop, and growth formula.',
    ['Azimuth', 'laboratory', 'Viblefrotzer']
  ),
  master_boozook: plaque(
    'Le Maitre Bouzouk transmet a Woodruff des controles corporels et l aide a relier les Sages, les syllabes et les formules necessaires au Conseil.',
    'The Boozook Master teaches Woodruff bodily controls and helps connect the Wisemen, syllables, and formulas required by the Council.',
    'Dans Multiverse Breach, il conserve la grammaire Bouzouk lorsque le Sans-Auteur remplace les mots par des icones sans sens. Ses formules donnent au terrain une logique lisible et rendent les faux decrets de Bigwig contradictoires.',
    'In Multiverse Breach, he preserves Boozook grammar when the Authorless replaces words with meaningless icons. His formulas give the field readable logic and make Bigwigs false decrees contradict themselves.',
    'Syllabes, formules, controle corporel, memoire du passe et Conseil des Sages.',
    'Syllables, formulas, body control, past memory, and the Wisemens Council.',
    ['Boozook', 'Wisemen', 'syllables']
  ),
  nancy_thompson: plaque(
    'Nancy Thompson comprend que Freddy tue dans les reves mais peut etre ramene dans le monde reel. Elle organise des reveils, construit des pieges dans la maison du 1428 Elm Street et gagne en refusant de nourrir le pouvoir que sa peur lui donne.',
    'Nancy Thompson understands that Freddy kills in dreams but can be pulled into the waking world. She schedules wake-ups, builds traps inside 1428 Elm Street, and wins by refusing to feed the power her fear gives him.',
    'A.R.C.A. ne lui donne aucun super-pouvoir. Nancy etablit des protocoles de sommeil partage, des alarmes et une route de reveil, puis oblige Freddy a entrer dans une mission ou ses transformations ont enfin un cout materiel.',
    'A.R.C.A. gives her no superpower. Nancy establishes shared-sleep protocols, alarms, and a wake-up route, then forces Freddy into a mission where his transformations finally have a material cost.',
    'Alarmes, pieges domestiques, lecture du reve et extraction forcee au reveil.',
    'Alarms, household traps, dream reading, and forced waking extraction.',
    ['Nancy Thompson', '1428 Elm Street', 'wake-up']
  ),
  kristen_parker: plaque(
    'Kristen Parker peut attirer dautres personnes dans ses reves. A Westin Hills, ce pouvoir permet aux Dream Warriors de se rejoindre et de confronter Freddy ensemble.',
    'Kristen Parker can pull other people into her dreams. At Westin Hills, this power allows the Dream Warriors to gather and confront Freddy together.',
    'La Breche amplifie le partage de reve mais menace de melanger toutes les identites de l escouade. Kristen ouvre une chambre commune limitee, attribue a chacun une forme coherente, puis rend le controle a Nancy pour le reveil.',
    'The Breach amplifies dream sharing but threatens to mix every squad identity. Kristen opens a limited common room, gives each member a coherent form, then returns control to Nancy for waking.',
    'Projection de reve, appel des allies, changement de chambre et lien Dream Warriors.',
    'Dream projection, ally pull, room shifting, and Dream Warriors link.',
    ['Kristen Parker', 'Dream Warriors', 'Westin Hills']
  ),
  alice_johnson: plaque(
    'Alice Johnson devient le Dream Master en absorbant les capacites et la memoire de victimes de Freddy. Son miroir et sa maitrise progressive du reve lui permettent de renvoyer les ames contre lui.',
    'Alice Johnson becomes the Dream Master by absorbing the abilities and memories of Freddys victims. Her mirror and growing dream control allow her to turn the trapped souls against him.',
    'A.R.C.A. limite cette absorption a des techniques consenties et archivees. Alice construit une reponse collective sans effacer les personnes dont elle porte la trace, puis utilise le miroir comme preuve que Freddy ne possede pas leurs visages.',
    'A.R.C.A. limits this absorption to consented, archived techniques. Alice builds a collective response without erasing the people whose traces she carries, then uses the mirror as proof Freddy does not own their faces.',
    'Techniques de reve empruntees, garde miroir, attaque Dream Master et liberation des ames.',
    'Borrowed dream techniques, mirror guard, Dream Master strike, and soul release.',
    ['Alice Johnson', 'Dream Master', 'mirror']
  ),
  rachel_ring: plaque(
    'Rachel Keller est une journaliste de Seattle qui remonte la cassette jusqu a Shelter Mountain, Morgan Ranch et Moesko Island. Elle decouvre que retrouver le corps de Samara ne suffit pas: la cassette exige d etre copiee et transmise.',
    'Rachel Keller is a Seattle journalist who traces the tape through Shelter Mountain, Morgan Ranch, and Moesko Island. She discovers that recovering Samaras body is not enough: the tape demands to be copied and passed on.',
    'A.R.C.A. la classe comme enquetrice de malediction, pas comme exorciste. Rachel conserve le compte des sept jours, compare chaque image et isole la nouvelle copie dans une coordonnee de quarantaine au lieu de pretendre avoir obtenu une fin heureuse.',
    'A.R.C.A. classifies her as a curse investigator, not an exorcist. Rachel keeps the seven-day count, compares every image, and isolates the new copy in a quarantine coordinate instead of pretending she earned a happy ending.',
    'Appareil photo, analyse VHS, itineraire de deadline et copie controlee.',
    'Camera, VHS analysis, deadline routing, and controlled copying.',
    ['Rachel Keller', 'cursed tape', 'seven days']
  ),
  aiden_ring: plaque(
    'Aidan Keller percoit Samara avant les adultes, dessine ses visions et comprend que Rachel ne devait pas aider la jeune fille du puits.',
    'Aidan Keller perceives Samara before the adults, draws his visions, and understands that Rachel was not supposed to help the girl in the well.',
    'Dans la Cite-Mosaique, Aidan reste un temoin protege. Ses dessins signalent les images que la cassette va projeter et donnent a l escouade une seconde davance sans transformer un enfant en combattant de premiere ligne.',
    'Inside Mosaic City, Aidan remains a protected witness. His drawings flag images the tape is about to project and give the squad one second of warning without turning a child into a frontline fighter.',
    'Premonition, dessin de Samara, alerte statique et lecture du cycle des sept jours.',
    'Premonition, Samara drawing, static warning, and seven-day cycle reading.',
    ['Aidan Keller', 'drawings', 'premonition']
  ),
  noah_ring: plaque(
    'Noah Clay travaille avec l image et la video. Son laboratoire revele les distortions photographiques et les informations cachees dans la bande, mais il sous-estime la regle de transmission de la malediction.',
    'Noah Clay works with photography and video. His lab reveals photographic distortions and information hidden in the tape, but he underestimates the curses transmission rule.',
    'A.R.C.A. conserve Noah au point exact avant sa mort comme analyste de support. Il ralentit la bande, reconstruit les timecodes et marque les frames impossibles, sachant desormais qu une preuve comprise peut encore tuer son observateur.',
    'A.R.C.A. anchors Noah at the exact point before his death as a support analyst. He slows the tape, reconstructs timecodes, and marks impossible frames, now knowing understood evidence can still kill its viewer.',
    'Chambre noire, timecode VHS, flash photographique et reconstruction nensha.',
    'Darkroom, VHS timecode, photographic flash, and nensha reconstruction.',
    ['Noah Clay', 'photo lab', 'timecode']
  ),
  karen_grudge: plaque(
    'Karen Davis est une etudiante americaine a Tokyo qui remplace une aide a domicile disparue dans la maison Saeki. Elle comprend progressivement que chaque personne entree dans la maison est deja prise dans le Ju-On.',
    'Karen Davis is an American student in Tokyo who replaces a missing care worker inside the Saeki house. She gradually understands that everyone who entered the house is already caught in the Ju-On.',
    'La Breche duplique les pieces de la maison dans plusieurs quartiers. Karen cartographie l ordre reel des visites, tente de couper les nouvelles entrees et accepte que bruler le batiment ne suffit pas a effacer le contact deja transmis.',
    'The Breach duplicates rooms from the house across several districts. Karen maps the true order of visits, tries to stop new entries, and accepts that burning the building is not enough to erase contact already transmitted.',
    'Lampe, dossier de soins, fuite de la maison et coupe-feu de contact.',
    'Flashlight, care file, house escape, and contact firebreak.',
    ['Karen Davis', 'Saeki house', 'care visit']
  ),
  detective_nakagawa: plaque(
    'Nakagawa est le detective de Tokyo qui relie les disparitions recentes aux meurtres Saeki et a la mort de ses collegues. Il retourne finalement a la maison avec de l essence, convaincu que le lieu doit etre detruit.',
    'Nakagawa is the Tokyo detective who connects recent disappearances to the Saeki murders and the deaths of his colleagues. He eventually returns to the house with gasoline, convinced the place must be destroyed.',
    'A.R.C.A. lui donne enfin un tableau causal complet. Nakagawa marque les visiteurs, recoupe les enregistrements et se sert de l essence comme barriere temporaire, jamais comme solution magique a une malediction deja propagee.',
    'A.R.C.A. finally gives him a complete causal board. Nakagawa marks visitors, cross-checks recordings, and uses gasoline as a temporary barrier, never as a magical solution to an already spread curse.',
    'Dossier de police, magnetophone, ligne d essence et reconstruction des contacts.',
    'Police file, tape recorder, gasoline line, and contact reconstruction.',
    ['Nakagawa', 'Tokyo police', 'case recorder']
  ),
  aubrey_grudge: plaque(
    'Aubrey Davis vient au Japon chercher sa soeur Karen et suit a son tour la trace de Kayako. Son enquete montre que la malediction survit au premier incendie et se propage par les personnes deja touchees.',
    'Aubrey Davis travels to Japan to find her sister Karen and follows Kayakos trail in turn. Her investigation shows the curse survives the first fire and spreads through people already touched.',
    'Dans Multiverse Breach, Aubrey relie les survivants de plusieurs temporalites sans confondre leurs versions. Elle suit la trace de Karen, documente les nouveaux foyers et ferme les routes qui transporteraient le Ju-On hors de la Cite.',
    'In Multiverse Breach, Aubrey connects survivors from several timelines without confusing their versions. She follows Karens trail, documents new sites, and closes routes that would carry the Ju-On outside the City.',
    'Camera, piste de Karen, esquive de couloir et trace de contact Ju-On.',
    'Camera, Karens trail, corridor dodge, and Ju-On contact trace.',
    ['Aubrey Davis', 'The Grudge 2', 'contact trace']
  )
};

const hellraiserShared = plaque(
  'Signature de l Ordre de l Entaille, liee au Labyrinthe de Leviathan et aux configurations de Lemarchand.',
  'Signature of the Order of the Gash, tied to Leviathans Labyrinth and Lemarchands configurations.',
  'La Breche ne transforme pas les Cenobites en monstres generiques: leurs chaines, rites et sentences restent soumis au pacte ouvert par la boite.',
  'The Breach does not turn Cenobites into generic monsters: their chains, rites, and sentences remain bound to the bargain opened by the box.',
  'Chaine de Labyrinthe, presence rituelle, lecture du desir et sentence cenobite.',
  'Labyrinth chain, ritual presence, desire reading, and Cenobite sentence.',
  ['Cenobite', 'Labyrinth', 'Leviathan']
);

Object.assign(FEATURED_CHARACTER_PLAQUES, {
  kirsty: plaque(
    'Kirsty Cotton ouvre puis manipule la Configuration des Lamentations pour survivre aux Cenobites, negocier la capture de Frank et comprendre que la boite est un seuil avec des regles.',
    'Kirsty Cotton opens and then manipulates the Lament Configuration to survive the Cenobites, bargain over Franks capture, and understand the box is a threshold with rules.',
    'A.R.C.A. lui confie la fermeture des seuils Hellraiser. Kirsty ne domine pas le Labyrinthe: elle observe le pacte, identifie la signature qui a echappe a sa sentence et retourne la configuration au moment precis.',
    'A.R.C.A. assigns her the closure of Hellraiser thresholds. Kirsty does not dominate the Labyrinth: she reads the bargain, identifies the signature escaping its sentence, and reverses the configuration at the exact moment.',
    'Manipulation de la boite, negociation, detournement des chaines et fermeture du seuil.',
    'Box manipulation, bargaining, chain redirection, and threshold closure.',
    ['Kirsty Cotton', 'Lament Configuration', 'bargain']
  ),
  female_cenobite: hellraiserShared,
  butterball: hellraiserShared,
  pinhead: hellraiserShared,
  pinhead_cenobite: hellraiserShared,
  chatterer: hellraiserShared,
  chatterer_cenobite: hellraiserShared,
  julia_cotton: plaque(
    'Julia Cotton nourrit la resurrection de Frank avec le sang de victimes attirees dans la maison. Son desir et sa trahison font delle un agent humain du Labyrinthe avant sa propre transformation.',
    'Julia Cotton feeds Franks resurrection with the blood of victims lured into the house. Her desire and betrayal make her a human agent of the Labyrinth before her own transformation.',
    'Dans la Breche, Julia exploite les seuils domestiques et les promesses personnelles. A.R.C.A. ne la classe pas comme Cenobite: elle reste une manipulatrice humaine dont chaque avantage exige un prix visible.',
    'Inside the Breach, Julia exploits domestic thresholds and personal promises. A.R.C.A. does not classify her as a Cenobite: she remains a human manipulator whose every advantage demands a visible price.',
    'Leurre, couteau, pacte de sang et trahison de seuil.',
    'Lure, knife, blood bargain, and threshold betrayal.',
    ['Julia Cotton', 'Frank Cotton', 'blood bargain']
  ),
  joey_summerskill: plaque(
    'Joey Summerskill est la journaliste de Hellraiser III qui enquete sur le pilier, les victimes et le retour de Pinhead avant de reunir ses moities humaine et cenobite.',
    'Joey Summerskill is the Hellraiser III reporter who investigates the pillar, its victims, and Pinheads return before reuniting his human and Cenobite halves.',
    'A.R.C.A. utilise ses enquetes pour distinguer Elliot Spencer du Hell Priest quand la Breche superpose leurs signatures. Joey collecte des preuves oniriques, protege la boite et empeche le Sans-Auteur de ne conserver que le monstre.',
    'A.R.C.A. uses her investigation to distinguish Elliot Spencer from the Hell Priest when the Breach overlaps their signatures. Joey collects dream evidence, protects the box, and stops the Authorless from preserving only the monster.',
    'Enquete, reve de guerre, protection de la boite et reunification de signature.',
    'Investigation, war dream, box protection, and signature reunification.',
    ['Joey Summerskill', 'Elliot Spencer', 'Hellraiser III']
  ),
  riley_mckendry: plaque(
    'Riley McKendry trouve la boite de Voight pendant quelle lutte contre une dependance et la perte de son frere Matt. Elle apprend que chaque nouvelle forme marque une victime et que la derniere configuration offre un choix dont le langage cache toujours un prix.',
    'Riley McKendry finds Voights box while struggling with addiction and the loss of her brother Matt. She learns that every new form marks a victim and that the final configuration offers a choice whose wording always hides a price.',
    'A.R.C.A. protege la distinction entre memoire, resurrection et reecriture. Riley conduit les porteurs marques a travers le manoir, retourne la lame contre Voight puis choisit Lament afin que le Sans-Auteur ne remplace pas son deuil par une copie docile.',
    'A.R.C.A. protects the distinction between memory, resurrection, and rewriting. Riley guides marked carriers through the mansion, turns the blade against Voight, then chooses Lament so the Authorless cannot replace her grief with a compliant copy.',
    'Lecture des six configurations, esquive des seuils, sauvetage des marques et choix de Lament.',
    'Six-configuration reading, threshold evasion, marked-target rescue, and the choice of Lament.',
    ['Riley McKendry', 'Hellraiser 2022', 'Lament']
  ),
  the_priest_2022: plaque(
    'La Pretresse de Hellraiser 2022 dirige un ordre distinct de celui du Hell Priest Elliot Spencer. Son quadrillage de fines incisions, ses epingles perlees et ses vetements anatomiques accompagnent les six configurations de la nouvelle boite.',
    'The Priest of Hellraiser 2022 leads an order distinct from Elliot Spencers Hell Priest. Her grid of fine incisions, pearl-headed pins, and anatomical vestments accompanies the new boxs six configurations.',
    'La Breche conserve les deux continuites sans fusionner leurs visages ni leurs sentences. La Pretresse suit la marque de la lame, expose le desir exact du porteur et ouvre une audience de Leviathan seulement quand la progression de la boite est complete.',
    'The Breach preserves both continuities without merging their faces or sentences. The Priest follows the blades mark, exposes the holders exact desire, and opens a Leviathan audience only when the boxs progression is complete.',
    'Chaines perlees, procession silencieuse, lecture du desir et audience de Leviathan.',
    'Pearled chains, silent procession, desire reading, and Leviathan audience.',
    ['The Priest', 'Hellraiser 2022', 'six configurations']
  )
});

export const FEATURED_BATTLE_ITEM_OVERRIDES = {
  Tomba: {
    pickups: [
      ['Boule epinee de Tomba', 'Tombas Spiked Ball', 'La boule epinee au bout dune chaine frappe un obstacle, assomme un Koma Pig ou prepare sa projection.'],
      ['Charity Wings', 'Charity Wings', 'Les ailes renvoient le porteur vers une zone deja visitee et servent de repli rapide sur une case stabilisee.'],
      ['Cle du Sage de cent ans', '100-Year-Old Mans Key', 'La grande cle doree ouvre les coffres et passages lies aux enigmes du Sage de cent ans.']
    ],
    summon: ['Sac bleu a Evil Pig', 'Blue Evil Pig Bag', 'Le sac remis par le Dwarf Elder revele la porte du domaine bleu et fournit le receptacle physique du scellement.'],
    ultimate: ['Sac noir du Real Evil Pig', 'Black Evil Pig Bag', 'Le huitieme sac apparait apres les sept scellements, revele le repaire final et enferme le Real Evil Pig.']
  },
  Woodruff: {
    pickups: [
      ['Tobozon public', 'Public Tobozon', 'Compose un contact, appelle un service ou transmet une preuve a distance selon la piece active.'],
      ['Transportozon d Azimuth', 'Azimuth Transportozon', 'Ramene le porteur vers un lieu deja visite sans inventer un teleporteur de combat hors lore.'],
      ['Pierre-syllabe', 'Syllable Stone', 'Ajoute un mot a une formule Bouzouk et change la regle dune case verrouillee.']
    ],
    summon: ['Viblefrotzer d Azimuth', 'Azimuths Viblefrotzer', 'Lappareil d Azimuth accelere lage cellulaire de Woodruff puis sert contre Bigwig au moment precis du plan final.'],
    ultimate: ['Chprotznog bloque au chewing-gum', 'Chewing-Gum-Locked Chprotznog', 'Le Chprotznog est suspendu au crochet puis verrouille avec le chewing-gum afin de capturer physiquement la Bete.']
  },
  Hellraiser: {
    pickups: [
      ['Configuration Lament - Vie', 'Lament Configuration - Life', 'La forme cubique initiale de 2022 dissimule une lame retractable qui marque le prochain sacrifice.'],
      ['Configuration Lore - Connaissance', 'Lore Configuration - Knowledge', 'La seconde forme octogonale represente le choix de la connaissance et poursuit le cycle des sacrifices.'],
      ['Configuration Laudarant - Amour', 'Laudarant Configuration - Love', 'Deux pyramides imbriquees forment le choix de lamour selon la geometrie rituelle de la boite.'],
      ['Configuration Liminal - Sensation', 'Liminal Configuration - Sensation', 'La forme creuse et angulaire correspond au don de sensation choisi par Voight.'],
      ['Configuration Lazarus - Resurrection', 'Lazarus Configuration - Resurrection', 'La forme en sablier represente la resurrection et le temps defait.'],
      ['Configuration Leviathan - Pouvoir', 'Leviathan Configuration - Power', 'La forme finale en losange reprend la silhouette de Leviathan et ouvre laudience apres cinq sacrifices.']
    ],
    summon: ['Crochet cenobite barbe', 'Barbed Cenobite Hook', 'Le crochet physique jaillit du seuil sur une chaine du Labyrinthe et tire la cible deja marquee par la boite.'],
    ultimate: ['Configuration Leviathan', 'Leviathan Configuration', 'La forme finale en losange accorde laudience avec Leviathan et materialise le prix du choix de pouvoir.']
  },
  'A Nightmare on Elm Street': {
    pickups: [
      ['Reveil de Nancy', 'Nancys Alarm Clock', 'Declenche une fenetre de reveil qui retire peur et immobilisation au porteur.'],
      ['Dose d Hypnocil', 'Hypnocil Dose', 'Bloque temporairement les reves, reduit les apparitions de Freddy mais ralentit la recharge speciale.'],
      ['Piege au marteau de Nancy', 'Nancys Sledgehammer Trap', 'Le marteau domestique suspendu frappe Freddy uniquement apres son extraction dans le monde materiel.']
    ],
    summon: ['Maquette du 1428 de Kristen', 'Kristens 1428 Elm Street Model', 'La maquette en papier mache localise la maison condamnee qui sert de porte recurrente au cauchemar.'],
    ultimate: ['Fedora de Freddy', 'Freddys Fedora', 'Nancy arrache le fedora marque Fred Krueger au cauchemar: cet objet physique prouve que Freddy peut etre ramene puis piege.']
  },
  'The Ring': {
    pickups: [
      ['Cassette sans etiquette', 'Unmarked VHS Tape', 'Marque une cible avec le compte des sept jours et revele sa prochaine action sous forme de frame parasite.'],
      ['Polaroid deforme', 'Distorted Polaroid', 'Montre quelle unite est deja touchee par la nensha et augmente son esquive avant manifestation.'],
      ['Dessin de lanneau noir d Aidan', 'Aidans Black Ring Drawing', 'Le dessin au crayon noir reproduit lanneau de lumiere vu depuis le puits et signale le contact psychique de Samara.']
    ],
    summon: ['Cle de la Cabine 12', 'Cabin 12 Key Tag', 'La cle etiquetee de Shelter Mountain localise la cabine ou Rachel trouve et visionne la cassette sans etiquette.'],
    ultimate: ['Telephone des sept jours', 'Seven-Days Telephone', 'Le combine noir sonne juste apres la cassette et transmet lannonce physique du delai de sept jours.']
  },
  'The Grudge': {
    pickups: [
      ['Journal de Kayako', 'Kayakos Journal', 'Le journal consigne lobsession pour Peter Kirk et revele la decouverte qui precede le massacre des Saeki.'],
      ['Photographie de famille Saeki laceree', 'Defaced Saeki Family Photograph', 'La photographie dont le visage de Kayako est decoupe relie Takeo, Kayako, Toshio et Mar a lorigine du Ju-On.'],
      ['Bidon dessence de Nakagawa', 'Nakagawas Gasoline Can', 'Le bidon alimente une barriere de feu temporaire qui retarde Kayako sans detruire la malediction.']
    ],
    summon: ['Photographie de Peter Kirk', 'Peter Kirk Photograph', 'La photographie conservee avec le journal materialise lobsession de Kayako et identifie le premier contact exterieur de la chaine.'],
    ultimate: ['Briquet de Doug', 'Dougs Lighter', 'Karen ouvre le briquet de Doug au-dessus de lessence pour incendier la maison et obtenir une courte voie devacuation.']
  }
};
