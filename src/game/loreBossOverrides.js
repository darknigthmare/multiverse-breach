const slugify = (value) => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const SPRITE_PROMPT_PREFIX = [
  'Use case: stylized-concept.',
  'Asset type: transparent game sprite sheet for a 2D canvas battle game.',
  'Create one original highly detailed dark-fantasy pixel-art animation sheet, 1024x1024, exactly 4 columns x 4 rows, sixteen equal 256x256 cells.',
  'One boss entity only, except for a canonically inseparable duo or trio explicitly required by the visual lock; full body, three-quarter side battle angle facing right, centered with identical scale and anatomy in every cell.',
  'Row 1 idle breathing, row 2 walk or run cycle, row 3 canonical signature attack, row 4 hit or recoil cycle.',
  'Perfectly flat solid #00ff00 chroma background, no floor, no cast shadow, no text, no labels, no border, no watermark, no cropped limbs and no duplicate subject.'
].join(' ');

const buildSpritePrompt = ({ name, universe, weapon, special, phases, visualAnchor }) => [
  SPRITE_PROMPT_PREFIX,
  `Subject: ${name} from ${universe}.`,
  `Visual lock: ${visualAnchor}`,
  `Canonical combat identity: ${weapon}; signature action: ${special}.`,
  `Gameplay phases: ${phases.join(' Then ')}.`,
  'Do not add Nexus armor, cross-franchise equipment, alternate-era clothing or anatomy that is absent from the reference.'
].join(' ');

const defineBoss = (universe, entry) => Object.freeze({
  name: entry.name,
  weapon: entry.weapon,
  special: entry.special,
  phases: Object.freeze([...entry.phases]),
  lore: Object.freeze({ ...entry.lore }),
  referenceUrl: entry.referenceUrl,
  visualAnchor: entry.visualAnchor,
  spritePrompt: buildSpritePrompt({ universe, ...entry }),
  output: `/sprites/generated/bosses/${slugify(universe)}/${slugify(entry.name)}.png`
});

const RAW_BOSS_OVERRIDES = {
  'Heavy Metal 2000': [
    {
      name: 'Odin - Arakacian Revealed',
      weapon: 'Arakacian strength and fountain chamber controls',
      special: 'Arakacian Empire Claim',
      phases: ['Discards the cloaked sage disguise and reveals his final-film Arakacian body', 'Attempts to seize the fountain chamber until Zeek removes the crystal key and seals him inside'],
      lore: {
        fr: 'Odin revele etre le dernier Arakacien et tente de reprendre la fontaine afin de restaurer son empire.',
        en: 'Odin reveals himself as the last Arakacian and attempts to reclaim the fountain to restore his empire.'
      },
      referenceUrl: 'https://www.imdb.com/title/tt0119273/plotsummary/',
      visualAnchor: 'Odin in the exact computer-animated Arakacian form revealed at the end of the 2000 film, after throwing off the dark sage cloak; preserve the film silhouette, pale alien materials and fountain-chamber look, with no Norse armor, no stone Zeek anatomy and no generic wizard redesign.'
    }
  ],
  'Killer Tomatoes from Outer Space': [
    {
      name: 'Dr. Putrid T. Gangreen',
      weapon: 'mutation_serum',
      special: 'Mutant Tomato Formula',
      phases: ['Throws mutation serum and commands tomato reinforcements', 'Switches formulas and uses unstable laboratory traps below 50 percent health'],
      lore: {
        fr: 'Le savant responsable des tomates mutantes remplace le gardien generique.',
        en: 'The scientist responsible for the mutant tomatoes replaces the generic guardian.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Attack_of_the_Killer_Tomatoes_(TV_series)',
      visualAnchor: 'Bald mad scientist, white laboratory coat, spectacles, moustache, glass serum flasks and the animated-series proportions.'
    },
    {
      name: 'Igor Smith',
      weapon: 'laboratory_tools',
      special: 'Tomato Capture Net',
      phases: ['Uses heavy laboratory tools and a capture net', 'Calls a short tomato reinforcement wave when staggered'],
      lore: {
        fr: 'L assistant de Gangreen devient le second encounter local sans pouvoir cosmique invente.',
        en: 'Gangreen s assistant becomes the second local encounter without invented cosmic powers.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Attack_of_the_Killer_Tomatoes_(TV_series)',
      visualAnchor: 'Large laboratory henchman with the exact animated-series clothing, face and proportions; no armor and no supernatural mutation.'
    }
  ],
  'Planete Hurlante': [
    {
      name: 'David - Type 3 Screamer',
      weapon: 'concealed_screamer_blade',
      special: 'Child-Disguise Rupture',
      phases: ['Approaches in the blond child disguise with the teddy bear', 'Reveals compact Screamer machinery and an internal blade for the attack phase'],
      lore: {
        fr: 'Le Type 3 utilise l apparence de David pour infiltrer les survivants.',
        en: 'The Type 3 uses David s appearance to infiltrate the survivors.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Screamers_(1995_film)',
      visualAnchor: 'Blond child from the 1995 film carrying a teddy bear, with subtle synthetic seams and compact machinery visible only during the reveal.'
    },
    {
      name: 'Becker - Type 2 Screamer',
      weapon: 'sidearm_and_machine_claws',
      special: 'Synthetic Skin Break',
      phases: ['Fights in Becker s human disguise with the film sidearm', 'Torn synthetic skin exposes industrial killer-machine components below 45 percent health'],
      lore: {
        fr: 'La copie de Becker revele la paranoia des nouveaux Screamers humanoides.',
        en: 'The Becker duplicate embodies the paranoia created by the new humanoid Screamers.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Screamers_(1995_film)',
      visualAnchor: 'Becker s exact film clothing and human likeness, progressively exposing thin industrial machine parts under torn synthetic skin.'
    }
  ],
  Sharknado: [
    {
      name: 'Great White Alpha in Funnel',
      weapon: 'bite_and_falling_charge',
      special: 'Sharknado Dive',
      phases: ['Dives from the funnel with a direct bite pattern', 'Returns through a debris lane for a faster vertical crash'],
      lore: {
        fr: 'Le boss reste un grand requin blanc emporte par la tornade.',
        en: 'The boss remains a great white shark carried by the tornado.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Sharknado',
      visualAnchor: 'Anatomically correct great white shark, wet gray skin and compact storm debris; no humanoid limbs, armor or hybrid head.'
    },
    {
      name: 'Hammerhead Swarm Alpha',
      weapon: 'side_charge_and_bite',
      special: 'Hammerhead Crosswind',
      phases: ['Crosses the arena laterally through the storm', 'Performs a double charge with a short exposed recovery'],
      lore: {
        fr: 'Le second boss est un requin-marteau identifiable, pas un avatar cosmique.',
        en: 'The second boss is an identifiable hammerhead shark rather than a cosmic avatar.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Sharknado',
      visualAnchor: 'Anatomically recognizable hammerhead shark with the film s B-movie storm presentation and limited debris, entire body visible.'
    }
  ],
  'Godzilla The Animated Series': [
    {
      name: 'Cyber-Godzilla',
      weapon: 'missiles_and_atomic_breath',
      special: 'Cybernetic Atomic Barrage',
      phases: ['Uses missiles and cybernetic charges with intact plating', 'Exposes damaged mechanical sections and uses atomic breath below 50 percent health'],
      lore: {
        fr: 'Le Godzilla 1998 ressuscite et cybernetise est un antagoniste propre a la serie animee.',
        en: 'The resurrected cybernetic 1998 Godzilla is a specific antagonist from the animated series.'
      },
      referenceUrl: 'https://godzilla.fandom.com/wiki/Cyber_Godzilla',
      visualAnchor: 'The exact 1998 Godzilla silhouette rebuilt with the series cybernetic torso, metallic plates, red optics and mounted missile systems.'
    },
    {
      name: 'Crustaceous Rex',
      weapon: 'massive_claws',
      special: 'Crustacean Crushing Grip',
      phases: ['Uses claw slams and armored body charges', 'Cracked shell exposes vulnerable tissue below 40 percent health'],
      lore: {
        fr: 'Crustaceous Rex est un mutant crustace geant affronte par H.E.A.T. et Godzilla.',
        en: 'Crustaceous Rex is a giant crustacean mutation fought by H.E.A.T. and Godzilla.'
      },
      referenceUrl: 'https://godzillatheseries.fandom.com/wiki/Crustaceous_Rex',
      visualAnchor: 'Exact red-brown giant crustacean anatomy from the series, enormous claws, layered shell and low amphibious stance.'
    }
  ],
  'Pee-wee': [
    {
      name: 'Francis Buxton',
      weapon: 'slapstick_props',
      special: 'Petulant Sabotage',
      phases: ['Uses grounded slapstick props and tantrum feints', 'Panics and throws nearby objects after his sabotage is exposed'],
      lore: {
        fr: 'Francis est le rival qui fait voler le velo de Pee-wee.',
        en: 'Francis is the rival responsible for having Pee-wee s bicycle stolen.'
      },
      referenceUrl: 'https://www.criterion.com/films/34870-pee-wees-big-adventure',
      visualAnchor: 'Stocky adult with the exact pale suit, bow tie, coiffed hair and childish body language from Pee-wee s Big Adventure.'
    },
    {
      name: 'Large Marge',
      weapon: 'spectral_truck_jumpscare',
      special: 'Clay-Face Nightmare Reveal',
      phases: ['Appears as the film truck driver and warns the party', 'Triggers the canonical clay-face spectral reveal and a ghost-truck pass'],
      lore: {
        fr: 'Large Marge est une rencontre spectrale comique, pas une sorciere de fantasy.',
        en: 'Large Marge is a comedy spectral encounter, not a fantasy witch.'
      },
      referenceUrl: 'https://www.criterion.com/films/34870-pee-wees-big-adventure',
      visualAnchor: 'The exact truck-driver clothing and elderly face from the film, followed by the canonical stop-motion clay nightmare face.'
    }
  ],
  'Malcolm in the Middle': [
    {
      name: 'Commandant Edwin Spangler',
      weapon: 'discipline_cane',
      special: 'Marlin Academy Drill',
      phases: ['Commands cadet formations and uses nonlethal cane strikes', 'Loses composure and accelerates the drill after repeated counters'],
      lore: {
        fr: 'Spangler est l antagoniste militaire recurrent de Francis a Marlin Academy.',
        en: 'Spangler is Francis s recurring military antagonist at Marlin Academy.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/List_of_Malcolm_in_the_Middle_characters',
      visualAnchor: 'Exact military academy uniform, eyepatch, stern face and canonical prosthetic details from the series.'
    },
    {
      name: 'Lionel Herkabe',
      weapon: 'school_traps',
      special: 'Krelboyne Humiliation Scheme',
      phases: ['Uses clipboard commands and classroom traps', 'Abandons the plan and enters a short nonlethal confrontation when cornered'],
      lore: {
        fr: 'Herkabe combat par manipulation scolaire et humiliation plutot que par magie.',
        en: 'Herkabe fights through school manipulation and humiliation rather than magic.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/List_of_Malcolm_in_the_Middle_characters',
      visualAnchor: 'Thin teacher in the exact restrained suit, hairstyle and smug posture used in the series.'
    }
  ],
  'Tanya the Evil': [
    {
      name: 'Anson Sioux',
      weapon: 'rifle_bayonet_and_computation_jewel',
      special: 'Relic-Fed Aerial Charge',
      phases: ['Uses rifle fire, bayonet rushes and aerial mage movement', 'The relic drives an unstable magic barrage below 50 percent health'],
      lore: {
        fr: 'Anson Sioux poursuit Tanya avec son fusil, sa baionnette et une puissance magique amplifiee.',
        en: 'Anson Sioux pursues Tanya with his rifle, bayonet and amplified magic power.'
      },
      referenceUrl: 'https://yenpress.com/titles/9780316512459-the-saga-of-tanya-the-evil-vol-1-light-novel',
      visualAnchor: 'Bearded Entente Alliance officer in the exact anime uniform with rifle, bayonet and computation jewel.'
    },
    {
      name: 'Mary Sioux',
      weapon: 'rifle_and_computation_jewel',
      special: 'Unstable Divine Artillery',
      phases: ['Uses aerial rifle volleys and explosive mage shells', 'Overcharges the computation jewel and suffers severe recoil below 35 percent health'],
      lore: {
        fr: 'Mary transforme son desir de vengeance en puissance magique difficile a controler.',
        en: 'Mary turns her desire for revenge into magic power that is difficult to control.'
      },
      referenceUrl: 'https://yenpress.com/series/the-saga-of-tanya-the-evil-light-novel',
      visualAnchor: 'Young blond Unified States soldier in the exact anime uniform with the canonical rifle and computation jewel.'
    }
  ],
  Virus: [
    {
      name: 'Captain Robert Everton - Cyborg',
      weapon: 'industrial_machine_limbs',
      special: 'Ship-Machine Assimilation',
      phases: ['Uses integrated ship tools, cables and crushing limbs', 'Exposes more human-machine tissue and adds electrical strikes below 45 percent health'],
      lore: {
        fr: 'Everton est reconstruit par l intelligence alien avec les machines du navire.',
        en: 'Everton is rebuilt by the alien intelligence using the ship s machinery.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Virus_(1999_film)',
      visualAnchor: 'Recognizable Captain Everton face fused into greasy rusted ship machinery, exposed flesh, cables and asymmetrical industrial limbs.'
    },
    {
      name: 'Alexi - Machine Hybrid',
      weapon: 'cable_claws',
      special: 'Electrical Hull Ambush',
      phases: ['Crawls along the hull and attacks with cable claws', 'Overloads exposed machinery in a short electrical rage phase'],
      lore: {
        fr: 'Le corps d Alexi devient une construction hybride de chair et de pieces navales.',
        en: 'Alexi s body becomes a hybrid construction of flesh and ship components.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Virus_(1999_film)',
      visualAnchor: 'The film s corpse-machine hybrid aesthetic with rusted naval parts, human remains, segmented cables and practical-effects grime.'
    }
  ],
  'Toy Soldiers': [
    {
      name: 'Zeppelin',
      weapon: 'bomb_racks_and_machine_guns',
      special: 'Toy Airship Bombing Run',
      phases: ['Strafes with gondola guns and drops bombs', 'Loses armor panels and enters a smoking crash pattern below 35 percent health'],
      lore: {
        fr: 'Le Zeppelin est un boss vehicule du Toy Soldiers classique.',
        en: 'The Zeppelin is a vehicle boss from classic Toy Soldiers.'
      },
      referenceUrl: 'https://toysoldiers.fandom.com/wiki/Bosses_(Classic)',
      visualAnchor: 'Exact World War I toy-airship construction, miniature painted metal, gondola guns and bomb racks from the classic game.'
    },
    {
      name: 'Uber Tank',
      weapon: 'heavy_cannon_and_side_guns',
      special: 'Clockwork Siege Barrage',
      phases: ['Advances with cannon and side-gun fire', 'A broken track exposes the miniature engine and slows the final phase'],
      lore: {
        fr: 'L Uber Tank fournit le second combat de siege sans technologie Nexus.',
        en: 'The Uber Tank provides the second siege battle without Nexus technology.'
      },
      referenceUrl: 'https://www.toysoldiersgame.com/',
      visualAnchor: 'Oversized World War I toy tank with riveted painted metal, tracks, main cannon and side guns in the game s miniature scale.'
    }
  ],
  'Shaun of the Dead': [
    {
      name: 'Zombie Philip',
      weapon: 'undead_grab_and_bite',
      special: 'Stepfather Recognition Stagger',
      phases: ['Uses slow grabs and bites', 'Briefly recognizes Shaun and becomes vulnerable before the last lunge'],
      lore: {
        fr: 'Philip infecte reste une rencontre tragique et lente.',
        en: 'The infected Philip remains a tragic and slow encounter.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Shaun_of_the_Dead',
      visualAnchor: 'The exact middle-aged film appearance, glasses, bloodied shirt and restrained zombie makeup of Philip.'
    },
    {
      name: 'Zombie John',
      weapon: 'heavy_undead_grab',
      special: 'Winchester Landlord Lunge',
      phases: ['Uses heavy pub-floor lunges and grabs', 'Becomes faster after being knocked away from the bar'],
      lore: {
        fr: 'John, proprietaire du Winchester, est utilise dans sa forme infectee du film.',
        en: 'John, the Winchester landlord, is used in his infected film form.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Shaun_of_the_Dead',
      visualAnchor: 'The elderly Winchester landlord in his exact film clothing and grounded zombie makeup, with no mutations.'
    }
  ],
  'Puppet Master': [
    {
      name: 'Sutekh',
      weapon: 'occult_energy',
      special: 'Totem Command',
      phases: ['Uses occult bolts and commands Totem reinforcements', 'Withdraws behind a ritual shield when the Totems are destroyed'],
      lore: {
        fr: 'Sutekh dirige les Totems dans Puppet Master 4 et 5.',
        en: 'Sutekh commands the Totems in Puppet Master 4 and 5.'
      },
      referenceUrl: 'https://www.fullmoonfeatures.com/puppet-master-series',
      visualAnchor: 'The franchise Egyptian demon design with the exact ornate headdress, mask-like face and ritual armor.'
    },
    {
      name: 'Totem Guardian',
      weapon: 'claws_and_teeth',
      special: 'Demonic Puppet Pounce',
      phases: ['Skitters across the floor and performs leap attacks', 'Reassembles damaged puppet parts once before the final phase'],
      lore: {
        fr: 'Un Totem sert de boss local mobile sous le controle de Sutekh.',
        en: 'A Totem serves as the mobile local boss under Sutekh s control.'
      },
      referenceUrl: 'https://puppet-master.fandom.com/wiki/Totem/Puppet',
      visualAnchor: 'Exact small red-brown demonic puppet anatomy, knotted limbs, claws and teeth from Puppet Master 4 and 5.'
    }
  ],
  'Chicken Run': [
    {
      name: 'Mrs. Tweedy',
      weapon: 'axe_and_pie_machine',
      special: 'Pie Machine Overdrive',
      phases: ['Commands farm traps and the pie machine', 'Uses the canonical axe directly after the machine is disabled'],
      lore: {
        fr: 'Mrs. Tweedy transforme la ferme en usine a tourtes puis affronte les poules avec sa hache.',
        en: 'Mrs. Tweedy turns the farm into a pie factory and then confronts the chickens with her axe.'
      },
      referenceUrl: 'https://www.aardman.com/film-tv-games/chicken-run/',
      visualAnchor: 'Exact Aardman stop-motion proportions, severe farm clothing, boots, coiffure and axe from the first film.'
    },
    {
      name: 'Mr. Tweedy',
      weapon: 'chicken_net_and_pitchfork',
      special: 'Clumsy Farm Pursuit',
      phases: ['Sweeps with a chicken net and blocks escape routes', 'Uses a slow pitchfork charge and falls after missing'],
      lore: {
        fr: 'Mr. Tweedy est un sous-boss comique et non une creature magique.',
        en: 'Mr. Tweedy is a comedy sub-boss rather than a magical creature.'
      },
      referenceUrl: 'https://www.aardman.com/film-tv-games/chicken-run/',
      visualAnchor: 'Exact stocky Aardman farmer, cap, moustache, earthy work clothes, chicken net and farm tools.'
    }
  ],
  Another: [
    {
      name: 'Reiko Mikami - The Extra',
      weapon: 'memory_distortion',
      special: 'Calamity Revelation',
      phases: ['Uses memory distortions and defensive movement without invented spells', 'The Extra identity is revealed and the arena calamity intensifies'],
      lore: {
        fr: 'Reiko est la personne supplementaire dont l existence entretient la calamite.',
        en: 'Reiko is the extra person whose existence sustains the calamity.'
      },
      referenceUrl: 'https://another.fandom.com/wiki/Reiko_Mikami',
      visualAnchor: 'Exact anime teacher appearance, light-brown hair and modest adult clothing, with restrained supernatural effects.'
    }
  ],
  Gunnm: [
    {
      name: 'Makaku',
      weapon: 'extendable_cyborg_arm',
      special: 'Kinuba Body Crush',
      phases: ['Fights as the exposed Makaku head-core with an extendable arm', 'Uses the stolen Kinuba gladiator body for crushing attacks'],
      lore: {
        fr: 'Makaku vole le corps de Kinuba et devient un adversaire cyborg massif.',
        en: 'Makaku steals Kinuba s body and becomes a massive cyborg opponent.'
      },
      referenceUrl: 'https://archive.kodansha.us/volume/battle-angel-alita-3/index.html',
      visualAnchor: 'Exact grotesque Makaku head-core and the stolen Kinuba Motorball gladiator body, with the canonical extendable arm.'
    },
    {
      name: 'Jashugan',
      weapon: 'machine_clash',
      special: 'Motorball Champion Overload',
      phases: ['Uses Machine Clash punches, dashes and counters', 'Suffers terminal neural overload while maintaining the final combo'],
      lore: {
        fr: 'Jashugan combat comme champion de Motorball avec la technique Machine Clash.',
        en: 'Jashugan fights as the Motorball champion using the Machine Clash technique.'
      },
      referenceUrl: 'https://battleangel.fandom.com/wiki/Jashugan',
      visualAnchor: 'Exact Motorball champion cyborg body, broad armor, face and arena silhouette from Gunnm.'
    }
  ],
  'Battle Royale': [
    {
      name: 'Kazuo Kiriyama',
      weapon: 'compact_firearms',
      special: 'Cold Ambush',
      phases: ['Uses the film compact firearm loadout and calculated ambushes', 'Keeps attacking with visible wounds in the final phase'],
      lore: {
        fr: 'Kiriyama est l adversaire le plus meurtrier du programme du film.',
        en: 'Kiriyama is the deadliest opponent in the film s program.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Battle_Royale_(film)',
      visualAnchor: 'Exact Japanese school uniform, black hair, cold expression and source-accurate firearm loadout from the 2000 film.'
    },
    {
      name: 'Mitsuko Souma',
      weapon: 'sickle_and_sidearm',
      special: 'Deceptive Sickle Rush',
      phases: ['Uses feints and fast sickle combinations', 'Adds the film sidearm after being staggered'],
      lore: {
        fr: 'Mitsuko survit par la tromperie, la faucille et les armes prises aux autres eleves.',
        en: 'Mitsuko survives through deception, her sickle and weapons taken from other students.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Battle_Royale_(film)',
      visualAnchor: 'Exact school uniform, hair, facial likeness and sickle from the 2000 film, with no armor.'
    }
  ],
  Spawn: [
    {
      name: 'The Violator',
      weapon: 'demonic_claws_and_bite',
      special: 'Clown-to-Violator Reveal',
      phases: ['Uses the obese blue-faced Clown disguise for taunts and close tricks', 'Reveals the long-headed skeletal demon for claw and bite attacks'],
      lore: {
        fr: 'Le Violator manipule Spawn sous l apparence de Clown avant de reveler sa forme demoniaque.',
        en: 'The Violator manipulates Spawn as Clown before revealing his demonic form.'
      },
      referenceUrl: 'https://www.spawn.com/characters/violator/',
      visualAnchor: 'Official Clown disguise followed by the canonical skeletal long-headed Violator demon silhouette, without mixing unrelated redesigns.'
    },
    {
      name: 'Chapel',
      weapon: 'mercenary_rifle_and_grenades',
      special: 'Skull-Face Suppression',
      phases: ['Uses rifle bursts and grenades from cover', 'Abandons cover for a heavy shoulder charge below 35 percent health'],
      lore: {
        fr: 'Chapel est lie a la mort d Al Simmons dans la continuite comics choisie.',
        en: 'Chapel is tied to Al Simmons s death in the selected comics continuity.'
      },
      referenceUrl: 'https://www.spawn.com/characters/chapel/',
      visualAnchor: 'The selected official-comic version of the massive mercenary, skull face paint, tactical armor and canonical rifle.'
    }
  ],
  Pingu: [
    {
      name: 'Walrus Nightmare',
      weapon: 'tusks_and_grab',
      special: 'Dream-Chase Lunge',
      phases: ['Looms over Pingu and uses slow tusk sweeps', 'Accelerates into the canonical dream chase before the nightmare breaks'],
      lore: {
        fr: 'Le morse geant provient du cauchemar de Pingu et reste une rencontre de reve.',
        en: 'The giant walrus comes from Pingu s nightmare and remains a dream encounter.'
      },
      referenceUrl: 'https://pingu.fandom.com/wiki/Pingu%27s_Dream',
      visualAnchor: 'Exact claymation giant walrus, enormous tusks, whiskers and dark rounded body from Pingu s Dream.'
    }
  ],
  Moonwalker: [
    {
      name: 'Mr. Big',
      weapon: 'tommy_gun_and_gas',
      special: 'Moonwalker Crime Syndicate',
      phases: ['Commands guards and uses the film firearm and gas traps', 'Retreats toward the Spider Mecha transition instead of spawning a duplicate boss'],
      lore: {
        fr: 'Mr. Big est l antagoniste humain de Moonwalker avant sa transformation mecanique.',
        en: 'Mr. Big is Moonwalker s human antagonist before his mechanical transformation.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Moonwalker',
      visualAnchor: 'Exact Joe Pesci likeness, black suit, ponytail and film weapon from Moonwalker.'
    }
  ],
  'Michael Jackson': [
    {
      name: 'Thriller Werecat Persona',
      weapon: 'dance_claws',
      special: 'Thriller Transformation',
      phases: ['Uses precise dance-combat footwork in the red-black jacket', 'Reveals the canonical werecat makeup and claw attacks'],
      lore: {
        fr: 'Cette entree est la persona fictive du court-metrage Thriller, pas Michael Jackson biographique.',
        en: 'This entry is the fictional persona from the Thriller short film, not biographical Michael Jackson.'
      },
      referenceUrl: 'https://www.michaeljackson.com/video/michael-jacksons-thriller-shortened-version/',
      visualAnchor: 'Exact 1983 hair, red-black Thriller jacket and canonical werecat prosthetic makeup from the official short film.'
    },
    {
      name: 'Smooth Criminal Gangster Persona',
      weapon: 'rhythm_feints_and_stage_props',
      special: 'Anti-Gravity Lean Counter',
      phases: ['Uses white-suit dance feints and precise footwork', 'Uses the anti-gravity lean as a counter window in the final phase'],
      lore: {
        fr: 'La persona de Smooth Criminal reste une rencontre de performance ancree dans le court-metrage.',
        en: 'The Smooth Criminal persona remains a performance encounter anchored in the short film.'
      },
      referenceUrl: 'https://www.michaeljackson.com/video/michael-jackson-smooth-criminal-official-video/',
      visualAnchor: 'Exact white suit, blue shirt, white fedora, armband and shoes from the official Smooth Criminal short film.'
    }
  ],
  'The Thing': [
    {
      name: 'Norris-Thing',
      weapon: 'chest_maw_and_spider_head',
      special: 'Defibrillator Chest Rupture',
      phases: ['Reveals the canonical chest maw and severs the doctor s arms as an attack cue', 'Detaches the spider-head and uses tendrils for the mobile phase'],
      lore: {
        fr: 'La transformation de Norris reproduit les deux etapes pratiques du film de 1982.',
        en: 'Norris s transformation reproduces the two practical-effects stages from the 1982 film.'
      },
      referenceUrl: 'https://www.theofficialjohncarpenter.com/the-thing/',
      visualAnchor: 'Exact practical-effects chest maw, torn human torso, detached spider-head and flesh tendrils from John Carpenter s film.'
    },
    {
      name: 'Blair-Thing',
      weapon: 'assimilation_tendrils',
      special: 'Generator-Room Emergence',
      phases: ['Emerges from below with asymmetrical crushing limbs', 'Reveals the human and canine assimilation features for the final attack'],
      lore: {
        fr: 'Blair-Thing est la masse d assimilation finale du generateur.',
        en: 'Blair-Thing is the final assimilation mass in the generator room.'
      },
      referenceUrl: 'https://www.theofficialjohncarpenter.com/the-thing/',
      visualAnchor: 'Exact final practical-effects mass with Blair s features, canine elements, wet flesh and asymmetrical crushing limbs.'
    }
  ],
  'Evil Dead': [
    {
      name: 'Henrietta Knowby - Deadite',
      weapon: 'deadite_grab_and_neck',
      special: 'Cellar Long-Neck Lunge',
      phases: ['Uses the heavy cellar Deadite form for grabs', 'Extends into the canonical long-neck transformation for the final lunge'],
      lore: {
        fr: 'Henrietta est le Deadite enferme dans la cave d Evil Dead II.',
        en: 'Henrietta is the Deadite locked in the cellar in Evil Dead II.'
      },
      referenceUrl: 'https://www.studiocanal.com/title/evil-dead-2-1987/',
      visualAnchor: 'Exact torn dress, practical Deadite makeup, heavy cellar body and stop-motion long-neck form from Evil Dead II.'
    },
    {
      name: 'Evil Ash',
      weapon: 'medieval_sword',
      special: 'Army of Darkness Rally',
      phases: ['Uses armored sword combinations and commands skeleton reinforcements', 'Continues as a damaged skeletal form below 30 percent health'],
      lore: {
        fr: 'Evil Ash commande l Armee des Tenebres dans sa forme medievale morte-vivante.',
        en: 'Evil Ash commands the Army of Darkness in his medieval undead form.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/army-of-darkness',
      visualAnchor: 'Exact undead Ash face, medieval armor, cape and sword from Army of Darkness, with no modern firearm.'
    }
  ],
  Chappie: [
    {
      name: 'Vincent Moore',
      weapon: 'military_rifle_and_moose_command',
      special: 'MOOSE Deployment',
      phases: ['Uses grounded rifle fire and commands the MOOSE remotely', 'Panics and fights directly after the MOOSE link is disrupted'],
      lore: {
        fr: 'Vincent Moore cherche a imposer MOOSE au detriment des Scouts et de Chappie.',
        en: 'Vincent Moore tries to impose MOOSE at the expense of the Scouts and Chappie.'
      },
      referenceUrl: 'https://www.sonypictures.com/movies/chappie',
      visualAnchor: 'Exact Hugh Jackman likeness, mullet, khaki shorts, tactical vest and film firearm.'
    },
    {
      name: 'Hippo',
      weapon: 'gang_rifle',
      special: 'Gang Suppression Fire',
      phases: ['Uses heavy suppressive fire and intimidation', 'Advances aggressively after his gang support is defeated'],
      lore: {
        fr: 'Hippo est le chef de gang qui menace Ninja, Yolandi et Chappie.',
        en: 'Hippo is the gang leader who threatens Ninja, Yolandi and Chappie.'
      },
      referenceUrl: 'https://www.sonypictures.com/movies/chappie',
      visualAnchor: 'Exact bulky gangster build, beard, street clothing and film rifle, with no robotic parts.'
    }
  ],
  Gremlins: [
    {
      name: 'Mohawk - Spider Gremlin',
      weapon: 'claws_web_and_bite',
      special: 'Spider Gremlin Metamorphosis',
      phases: ['Uses Mohawk s bipedal Gremlin form and claw attacks', 'Transforms into the canonical multi-legged Spider Gremlin with web and leap attacks'],
      lore: {
        fr: 'Mohawk utilise le serum genetique pour devenir le Spider Gremlin.',
        en: 'Mohawk uses the genetic serum to become the Spider Gremlin.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/gremlins-2-new-batch',
      visualAnchor: 'Exact white mohawk, dark Gremlin face and practical Spider Gremlin body with the film s multiple legs and webbing.'
    },
    {
      name: 'Brain Gremlin',
      weapon: 'serum_and_sidearm',
      special: 'New Batch Command',
      phases: ['Uses serum flasks and commands other Gremlins', 'Draws the film sidearm when isolated'],
      lore: {
        fr: 'Le Brain Gremlin acquiert intelligence, parole et vetements apres le serum.',
        en: 'The Brain Gremlin gains intelligence, speech and clothing after taking the serum.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/gremlins-2-new-batch',
      visualAnchor: 'Exact practical-puppet anatomy, glasses, suit, tie and expressive face from Gremlins 2.'
    }
  ],
  'Rocky Horror Picture Show': [
    {
      name: 'Riff Raff',
      weapon: 'anti_matter_laser',
      special: 'Transylvanian Recall',
      phases: ['Uses theatrical servant feints and command gestures', 'Reveals the canonical final Transylvanian uniform and anti-matter laser'],
      lore: {
        fr: 'Riff Raff renverse Frank-N-Furter et reprend le controle du chateau.',
        en: 'Riff Raff overthrows Frank-N-Furter and retakes control of the castle.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/the-rocky-horror-picture-show',
      visualAnchor: 'Exact bald-top long-hair likeness and the final Transylvanian uniform with the film anti-matter laser.'
    },
    {
      name: 'Eddie',
      weapon: 'saxophone_and_stage_chain',
      special: 'Freezer Rock Entrance',
      phases: ['Bursts into the arena with saxophone-driven shockwaves', 'Uses grounded rocker brawling and stage props when cornered'],
      lore: {
        fr: 'Eddie est une rencontre musicale violente mais reste humain.',
        en: 'Eddie is a violent musical encounter but remains human.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/the-rocky-horror-picture-show',
      visualAnchor: 'Exact leather vest, forehead scar, pompadour and saxophone from the film, with no undead mutation.'
    }
  ],
  'RRRrrrr!!!': [
    {
      name: 'Pierre le Guerissologue',
      weapon: 'stone_age_tools',
      special: 'Prehistoric Murderer Reveal',
      phases: ['Uses deceptive healer gestures and improvised tools', 'Reveals the murderer role and uses traps while fleeing'],
      lore: {
        fr: 'Pierre le guerissologue est lie a l enquete meurtriere de la tribu.',
        en: 'Pierre the healer is tied to the tribe s murder investigation.'
      },
      referenceUrl: 'https://tf1pro.com/programmes/produit/rrrrrrr',
      visualAnchor: 'Exact prehistoric-comedy clothing, hair and tribe accessories from the film, with no modern weapon.'
    },
    {
      name: 'Chef des Cheveux Sales',
      weapon: 'primitive_club',
      special: 'Dirty-Hair Tribe Charge',
      phases: ['Uses heavy club swings and shoves', 'Calls a short tribe charge before the final stagger'],
      lore: {
        fr: 'Le chef des Cheveux Sales fournit un combat comique fonde sur la force.',
        en: 'The Dirty Hair chief provides a comedy encounter built around strength.'
      },
      referenceUrl: 'https://tf1pro.com/programmes/produit/rrrrrrr',
      visualAnchor: 'Exact massive film silhouette, dirty hair, furs, primitive jewelry and club.'
    }
  ],
  'La Cite de la Peur': [
    {
      name: 'Emile Gravier',
      weapon: 'sickle',
      special: 'Red Is Dead Killer Reveal',
      phases: ['Uses the masked Red Is Dead killer disguise and clumsy chase attacks', 'Loses the mask and becomes more frantic after the reveal'],
      lore: {
        fr: 'Emile Gravier est le meurtrier cache derriere le costume de Red Is Dead.',
        en: 'Emile Gravier is the murderer behind the Red Is Dead costume.'
      },
      referenceUrl: 'https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur_(film,_1994)',
      visualAnchor: 'Exact black killer costume, pale mask, sickle and later film likeness, without generic slasher additions.'
    },
    {
      name: 'Jean-Paul Martoni',
      weapon: 'handgun',
      special: 'Cannes Gangster Escape',
      phases: ['Uses intimidation and aimed handgun fire', 'Attempts a panicked escape when his protection is broken'],
      lore: {
        fr: 'Martoni est un criminel humain et ne possede aucun pouvoir surnaturel.',
        en: 'Martoni is a human criminal with no supernatural power.'
      },
      referenceUrl: 'https://fr.wikipedia.org/wiki/La_Cit%C3%A9_de_la_peur_(film,_1994)',
      visualAnchor: 'Exact Gerard Darmon likeness, dark suit and 1994 film handgun.'
    }
  ],
  Defiance: [
    {
      name: 'General Rahm Tak',
      weapon: 'votan_rifle_and_grenades',
      special: 'Beast Command Offensive',
      phases: ['Uses Votan rifle fire, grenades and soldier commands', 'Broken armor exposes a faster close-combat phase'],
      lore: {
        fr: 'Rahm Tak dirige l offensive Votanis contre Defiance.',
        en: 'Rahm Tak leads the Votanis offensive against Defiance.'
      },
      referenceUrl: 'https://defiance.fandom.com/wiki/Rahm_Tak',
      visualAnchor: 'Exact pale Castithan facial markings, military armor and Votan weapon from season 3.'
    },
    {
      name: 'Kindzi',
      weapon: 'omec_claws',
      special: 'Omec Predator Rage',
      phases: ['Uses predatory leaps, claws and superior strength', 'Enters a fast rage phase below 40 percent health'],
      lore: {
        fr: 'Kindzi est une Omec predatrice de la troisieme saison.',
        en: 'Kindzi is a predatory Omec from the third season.'
      },
      referenceUrl: 'https://defiance.fandom.com/wiki/Kindzi',
      visualAnchor: 'Exact Omec facial appearance, pale skin, hair and source clothing from Defiance season 3.'
    }
  ],
  'Mars Attacks': [
    {
      name: 'Martian Ambassador',
      weapon: 'martian_ray_gun',
      special: 'Congress Disintegration',
      phases: ['Uses measured ray-gun volleys and deceptive surrender gestures', 'Drops the diplomatic act and chains rapid disintegration shots'],
      lore: {
        fr: 'L ambassadeur martien transforme la rencontre diplomatique en massacre.',
        en: 'The Martian Ambassador turns the diplomatic encounter into a massacre.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/mars-attacks',
      visualAnchor: 'Exact exposed-brain Martian anatomy, transparent helmet, red cape, breathing apparatus and ray gun from the film.'
    },
    {
      name: 'Martian General',
      weapon: 'martian_command_pistol',
      special: 'Invasion Command',
      phases: ['Directs Martian soldiers while firing from range', 'Uses faster command-pistol bursts after his escort falls'],
      lore: {
        fr: 'Le general martien commande les forces d invasion sans mutation Nexus.',
        en: 'The Martian General commands the invasion forces without any Nexus mutation.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/mars-attacks',
      visualAnchor: 'Exact film Martian leader with glass helmet, ornate red command uniform, visible green skull-like face and compact ray pistol.'
    }
  ],
  Dandadan: [
    {
      name: 'Evil Eye',
      weapon: 'cursed_body_and_ki',
      special: 'Grudge Ball',
      phases: ['Uses acrobatic cursed-body strikes and wall movement', 'Condenses hatred into the canonical destructive grudge projectile'],
      lore: {
        fr: 'Evil Eye est l esprit vengeur qui prend possession de Jiji.',
        en: 'Evil Eye is the vengeful spirit that possesses Jiji.'
      },
      referenceUrl: 'https://anime-dandadan.com/en/character/',
      visualAnchor: 'Exact anime Evil Eye design in Jiji s body, pale skin, long light hair, black briefs, facial markings and manic eyes.'
    },
    {
      name: 'Serpo-Dover Demon-Nessie Fusion',
      weapon: 'mantis_shrimp_fists_and_alien_beam',
      special: 'Composite Alien Assault',
      phases: ['Uses Dover Demon boxing power and Serpo energy attacks', 'Extends the Nessie-derived body for a full composite charge'],
      lore: {
        fr: 'Cette fusion canonique combine le Serpo, le Dover Demon et Nessie.',
        en: 'This canonical fusion combines the Serpoian, Dover Demon and Nessie.'
      },
      referenceUrl: 'https://anime-dandadan.com/en/character/',
      visualAnchor: 'Exact anime composite anatomy with Serpo head elements, mantis-shrimp boxing limbs and the long Nessie-derived body.'
    }
  ],
  'Baby Cart': [
    {
      name: 'Retsudo Yagyu',
      weapon: 'katana',
      special: 'Yagyu Clan Final Duel',
      phases: ['Uses disciplined Yagyu sword forms and counters', 'Commits to a direct final duel after his retainers are defeated'],
      lore: {
        fr: 'Retsudo Yagyu est l adversaire central d Ogami Itto.',
        en: 'Retsudo Yagyu is Ogami Itto s central adversary.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Lone_Wolf_and_Cub',
      visualAnchor: 'Exact elderly Yagyu patriarch appearance from the selected Lone Wolf and Cub screen continuity, formal samurai robes and katana.'
    }
  ],
  Cloverfield: [
    {
      name: 'Clover Parasite Brood Alpha',
      weapon: 'claws_and_bite',
      special: 'Parasite Drop',
      phases: ['Scuttles low and attacks with rapid claw swipes', 'Leaps onto the target and attempts the film parasite bite'],
      lore: {
        fr: 'Un parasite tombe du grand Clover et dirige une petite couvee.',
        en: 'A parasite dropped by the adult Clover leads a small brood.'
      },
      referenceUrl: 'https://www.paramountpictures.com/movies/cloverfield',
      visualAnchor: 'Exact pale spider-crab parasite anatomy from Cloverfield, multiple limbs, folded dorsal sacs and the film mouth structure.'
    },
    {
      name: 'Juvenile Clover',
      weapon: 'long_limbs_and_jaws',
      special: 'Juvenile City Stomp',
      phases: ['Uses long-limbed sweeps and head strikes at reduced scale', 'Performs a desperate full-body charge when staggered'],
      lore: {
        fr: 'La creature est representee comme un juvenile distinct du world boss adulte.',
        en: 'The creature is represented as a juvenile distinct from the adult world boss.'
      },
      referenceUrl: 'https://www.paramountpictures.com/movies/cloverfield',
      visualAnchor: 'Recognizable juvenile Clover anatomy with gray hide, asymmetrical long limbs, small head and ventral parasite sacs; entire body visible.'
    }
  ],
  H2G2: [
    {
      name: 'Prostetnic Vogon Jeltz',
      weapon: 'vogon_blaster_and_poetry',
      special: 'Third-Worst Poetry Recital',
      phases: ['Uses a Vogon blaster and bureaucratic guard commands', 'Recites poetry that disrupts movement before a final blaster volley'],
      lore: {
        fr: 'Jeltz est le capitaine Vogon qui detruit la Terre et torture par la poesie.',
        en: 'Jeltz is the Vogon captain who destroys Earth and tortures through poetry.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Prostetnic_Vogon_Jeltz',
      visualAnchor: 'Exact chosen adaptation s bulky green Vogon captain, heavy uniform, bureaucratic insignia and compact energy sidearm.'
    },
    {
      name: 'Agrajag',
      weapon: 'reincarnation_lunges',
      special: 'Repeated-Reincarnation Grudge',
      phases: ['Cycles through brief visual echoes of documented reincarnations', 'Locks into the gaunt cavern form for lunges and an accidental final collapse'],
      lore: {
        fr: 'Agrajag accuse Arthur Dent de l avoir tue dans de nombreuses incarnations.',
        en: 'Agrajag blames Arthur Dent for killing him across many incarnations.'
      },
      referenceUrl: 'https://hitchhikers.fandom.com/wiki/Agrajag',
      visualAnchor: 'Use the exact gaunt batlike cavern incarnation from the selected adaptation, with no unrelated alien armor.'
    }
  ],
  'Iron Sky': [
    {
      name: 'Klaus Adler',
      weapon: 'luger_and_moon_trooper_command',
      special: 'Moon Invasion Order',
      phases: ['Uses a sidearm while ordering Moon trooper crossfire', 'Abandons command cover and fights aggressively at close range'],
      lore: {
        fr: 'Klaus Adler tente de prendre le pouvoir a la tete des nazis lunaires.',
        en: 'Klaus Adler attempts to seize power at the head of the Moon Nazis.'
      },
      referenceUrl: 'https://ironsky.net/',
      visualAnchor: 'Exact Gotz Otto likeness, black Moon Nazi officer uniform, cap, insignia and period-styled Luger from the film.'
    },
    {
      name: 'Vivian Wagner',
      weapon: 'presidential_command_console',
      special: 'Moon Fuehrer Command',
      phases: ['Uses command-console hazards and security reinforcements', 'Enters the documented Moon leadership phase with frantic close-range attacks'],
      lore: {
        fr: 'Vivian Wagner devient une antagoniste politique de la continuite Iron Sky.',
        en: 'Vivian Wagner becomes a political antagonist in the Iron Sky continuity.'
      },
      referenceUrl: 'https://ironsky.net/',
      visualAnchor: 'Exact Peta Sergeant likeness and the specific Moon leadership costume from the selected Iron Sky film; no powered armor.'
    }
  ],
  REC: [
    {
      name: 'Infected Manu',
      weapon: 'infected_bite_and_grapple',
      special: 'Stairwell Ambush',
      phases: ['Rushes through the apartment corridor with feral grapples', 'Continues after being staggered and attempts a direct bite'],
      lore: {
        fr: 'Manu est contamine dans l immeuble mis en quarantaine.',
        en: 'Manu is infected inside the quarantined apartment building.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Rec_(film)',
      visualAnchor: 'Exact Manu firefighter clothing and likeness from REC, blood and infection makeup only as shown in the film.'
    },
    {
      name: 'Infected Jennifer',
      weapon: 'feral_claws_and_bite',
      special: 'Feral Infection Leap',
      phases: ['Moves unpredictably and attacks from low angles', 'Uses a fast leap and bite after a short stun window'],
      lore: {
        fr: 'Jennifer est une enfant infectee, pas une creature surnaturelle en armure.',
        en: 'Jennifer is an infected child, not a supernatural armored creature.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Rec_(film)',
      visualAnchor: 'Exact child clothing and infection makeup from REC, feral posture, no demonic anatomy and no added weapon.'
    }
  ],
  Sinister: [
    {
      name: 'Stephanie - BBQ Ghost Child',
      weapon: 'fire_and_film_loop',
      special: 'BBQ Film Manifestation',
      phases: ['Appears through Super 8 flicker and places small fire zones', 'Replays the documented BBQ sequence as a timed spectral rush'],
      lore: {
        fr: 'Stephanie fait partie des enfants fantomes controles par Bughuul.',
        en: 'Stephanie is one of the ghost children controlled by Bughuul.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Sinister_(film)',
      visualAnchor: 'Exact ghost-child clothing, pale film makeup and BBQ-film identity from Sinister; restrained smoke and Super 8 artifacts.'
    },
    {
      name: 'Christopher - Pool Party Ghost Child',
      weapon: 'water_and_film_loop',
      special: 'Pool Party Manifestation',
      phases: ['Creates shallow water hazards while stalking through film flicker', 'Uses the pool-film reenactment for a final drowning grab'],
      lore: {
        fr: 'Christopher est associe au film Pool Party de Bughuul.',
        en: 'Christopher is associated with Bughuul s Pool Party film.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Sinister_(film)',
      visualAnchor: 'Exact ghost-child clothing and Pool Party identity from Sinister, pale face and wet-film effects without aquatic mutation.'
    }
  ],
  'Les Visiteurs': [
    {
      name: 'Sorciere de Montmirail',
      weapon: 'witchcraft_and_herbs',
      special: 'Montmirail Curse',
      phases: ['Uses smoke, herbs and evasive curse gestures', 'Summons a short disorientation effect before attempting to flee'],
      lore: {
        fr: 'La sorciere est liee a la malediction initiale de Montmirail.',
        en: 'The witch is tied to Montmirail s initial curse.'
      },
      referenceUrl: 'https://fr.wikipedia.org/wiki/Les_Visiteurs_(film,_1993)',
      visualAnchor: 'Exact medieval witch clothing and aged likeness from the 1993 film, cloth pouches and herbs, no generic fantasy staff.'
    },
    {
      name: 'Jacques-Henri Jacquard',
      weapon: 'improvised_modern_props',
      special: 'Hotel Panic',
      phases: ['Uses improvised hotel props and calls security', 'Panics into fast slapstick charges when his support is gone'],
      lore: {
        fr: 'Jacquard est un antagoniste comique humain du present.',
        en: 'Jacquard is a human comic antagonist in the present day.'
      },
      referenceUrl: 'https://fr.wikipedia.org/wiki/Les_Visiteurs_(film,_1993)',
      visualAnchor: 'Exact Christian Clavier likeness as Jacquard, 1990s hotel-owner suit and hairstyle; keep him distinct from Jacquouille.'
    }
  ],
  Kazaam: [
    {
      name: 'Malik',
      weapon: 'handgun_and_henchmen',
      special: 'Nightclub Ambush',
      phases: ['Uses armed henchmen and aimed handgun fire', 'Fights alone with desperate close-range shots after his cover breaks'],
      lore: {
        fr: 'Malik est le criminel qui menace Max et son pere.',
        en: 'Malik is the criminal who threatens Max and his father.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Kazaam',
      visualAnchor: 'Exact Marshall Manesh likeness, dark 1990s suit, moustache and film handgun; no genie power.'
    }
  ],
  'Voyage de Chihiro': [
    {
      name: 'Yubaba',
      weapon: 'witchcraft_and_hairpins',
      special: 'Bathhouse Contract Magic',
      phases: ['Uses paper birds, binding magic and command gestures', 'Transforms into her documented bird form for aerial passes'],
      lore: {
        fr: 'Yubaba dirige les bains et lie ses employes par contrat.',
        en: 'Yubaba runs the bathhouse and binds her workers through contracts.'
      },
      referenceUrl: 'https://www.ghibli.jp/works/chihiro/',
      visualAnchor: 'Exact Studio Ghibli Yubaba design, enormous head, ornate dark dress, jeweled hair and documented bird transformation.'
    },
    {
      name: 'Kashira Trio',
      weapon: 'headbutts_and_rolls',
      special: 'Three-Head Stack',
      phases: ['The three heads hop and roll as one inseparable unit', 'They stack, split and converge for a synchronized headbutt'],
      lore: {
        fr: 'Les trois Kashira sont representes ensemble sans leur inventer de corps.',
        en: 'The three Kashira are represented together without invented bodies.'
      },
      referenceUrl: 'https://www.ghibli.jp/works/chihiro/',
      visualAnchor: 'Exactly three identical green bearded Kashira heads from Spirited Away, all visible in every frame, with no bodies.'
    }
  ],
  'Meet the Feebles': [
    {
      name: 'Bletch',
      weapon: 'revolver_and_stage_enforcers',
      special: 'Feeble Theatre Crackdown',
      phases: ['Uses a revolver and orders theatre enforcers forward', 'Loses control and fires wildly across the stage'],
      lore: {
        fr: 'Bletch dirige le theatre et exploite les Feebles.',
        en: 'Bletch runs the theatre and exploits the Feebles.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Meet_the_Feebles',
      visualAnchor: 'Exact walrus puppet design from the film, formal theatre-owner clothing, tusks and revolver; retain practical-puppet texture.'
    },
    {
      name: 'Trevor the Rat',
      weapon: 'knife_and_drug_props',
      special: 'Backstage Ambush',
      phases: ['Uses quick knife feints and backstage cover', 'Becomes erratic and rushes at close range when cornered'],
      lore: {
        fr: 'Trevor est le rat trafiquant et pornographe du theatre.',
        en: 'Trevor is the theatre s drug-dealing pornographer rat.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Meet_the_Feebles',
      visualAnchor: 'Exact scruffy rat puppet, greasy clothing and practical-puppet materials from the film; no realistic rodent redesign.'
    }
  ],
  'Roger Rabbit': [
    {
      name: 'Smart Ass',
      weapon: 'toon_revolver',
      special: 'Toon Patrol Execution Order',
      phases: ['Uses a cartoon revolver and directs Toon Patrol attacks', 'Combines elastic toon movement with faster close-range shots'],
      lore: {
        fr: 'Smart Ass dirige la Toon Patrol au service du juge Doom.',
        en: 'Smart Ass leads the Toon Patrol for Judge Doom.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Who_Framed_Roger_Rabbit',
      visualAnchor: 'Exact short brown weasel toon, zoot suit, fedora and revolver from Who Framed Roger Rabbit.'
    },
    {
      name: 'Psycho and Greasy - Toon Patrol Duo',
      weapon: 'straight_razor_and_toon_props',
      special: 'Toon Patrol Crossfire',
      phases: ['Greasy uses a straight razor while Psycho attacks with manic lunges', 'The duo alternates attacks faster after one is staggered'],
      lore: {
        fr: 'Psycho et Greasy combattent comme un duo indivisible de la Toon Patrol.',
        en: 'Psycho and Greasy fight as one inseparable Toon Patrol duo.'
      },
      referenceUrl: 'https://disney.fandom.com/wiki/Toon_Patrol',
      visualAnchor: 'Exact green-suited Greasy and wild-haired Psycho toon designs, both fully visible, no Judge Doom features.'
    }
  ],
  'Starship Troopers': [
    {
      name: 'Tanker Bug',
      weapon: 'incendiary_acid',
      special: 'Burrowed Fire Burst',
      phases: ['Burrows and erupts with armored body slams', 'Opens the head plates and projects the canonical incendiary fluid'],
      lore: {
        fr: 'Le Tanker Bug est une caste lourde arachnide du film.',
        en: 'The Tanker Bug is a heavy Arachnid caste from the film.'
      },
      referenceUrl: 'https://www.sonypictures.com/movies/starshiptroopers',
      visualAnchor: 'Exact massive orange-brown Tanker Bug anatomy from the 1997 film, plated head, six-limbed stance and no cybernetics.'
    },
    {
      name: 'Plasma Bug',
      weapon: 'plasma_barrage',
      special: 'Orbital Plasma Launch',
      phases: ['Uses slow armored turns and close-range leg sweeps', 'Raises the abdomen and launches a documented blue plasma burst'],
      lore: {
        fr: 'Le Plasma Bug sert d artillerie antiaerienne aux Arachnides.',
        en: 'The Plasma Bug serves as the Arachnids anti-air artillery.'
      },
      referenceUrl: 'https://www.sonypictures.com/movies/starshiptroopers',
      visualAnchor: 'Exact towering blue-black Plasma Bug from the film, long legs, swollen luminous abdomen and launch posture.'
    }
  ],
  'Banlieue 13': [
    {
      name: 'Taha Bemamud',
      weapon: 'handgun_and_gang_command',
      special: 'B13 Gang Lockdown',
      phases: ['Uses gang crossfire from cover', 'Fights with a handgun while attempting to reach an escape route'],
      lore: {
        fr: 'Taha controle la cite et detient la bombe.',
        en: 'Taha controls the district and holds the bomb.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/District_13',
      visualAnchor: 'Exact Bibi Naceri likeness, shaved head, dark streetwear and handgun from District 13.'
    },
    {
      name: 'K2',
      weapon: 'assault_rifle',
      special: 'Taha Enforcer Rush',
      phases: ['Uses controlled assault-rifle bursts and physical blocks', 'Switches to heavy close combat after ammunition runs out'],
      lore: {
        fr: 'K2 est l homme de main massif de Taha.',
        en: 'K2 is Taha s massive enforcer.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/District_13',
      visualAnchor: 'Exact Tony D Amario likeness, massive build, shaved head, black street clothing and film assault rifle.'
    }
  ],
  'House of 1000 Corpses': [
    {
      name: 'Otis B. Driftwood',
      weapon: 'revolver_and_knife',
      special: 'Firefly House Hunt',
      phases: ['Uses a revolver from cover and taunts the target', 'Switches to a knife and aggressive grapples at close range'],
      lore: {
        fr: 'Otis est un membre meurtrier central de la famille Firefly.',
        en: 'Otis is a central murderous member of the Firefly family.'
      },
      referenceUrl: 'https://www.lionsgate.com/movies/house-of-1000-corpses',
      visualAnchor: 'Exact Bill Moseley likeness in House of 1000 Corpses, long pale hair, facial hair, dirty period clothing, revolver and knife.'
    },
    {
      name: 'Captain Spaulding',
      weapon: 'revolver_and_roadside_props',
      special: 'Murder Ride Ambush',
      phases: ['Uses roadside attraction props and a concealed revolver', 'Drops the salesman act and attacks directly after the arena darkens'],
      lore: {
        fr: 'Captain Spaulding attire les voyageurs vers la famille Firefly.',
        en: 'Captain Spaulding draws travelers toward the Firefly family.'
      },
      referenceUrl: 'https://www.lionsgate.com/movies/house-of-1000-corpses',
      visualAnchor: 'Exact Sid Haig likeness, bald clown head, red-white-blue makeup, stained clown suit and revolver from the film.'
    }
  ],
  'Overlord Anime': [
    {
      name: 'Shalltear Bloodfallen - Mind-Controlled',
      weapon: 'spuit_lance_and_vampire_magic',
      special: 'Einherjar',
      phases: ['Uses the Spuit Lance, blood magic and defensive skills', 'Summons Einherjar and enters the armored true-vampire combat phase'],
      lore: {
        fr: 'Shalltear ne devient boss que durant son controle mental.',
        en: 'Shalltear becomes a boss only during her mind-controlled encounter.'
      },
      referenceUrl: 'https://overlordmaruyama.fandom.com/wiki/Shalltear_Bloodfallen',
      visualAnchor: 'Exact anime Shalltear with silver hair and red eyes, then canonical crimson full plate and Spuit Lance; no generic succubus traits.'
    },
    {
      name: 'Clementine',
      weapon: 'stilettos',
      special: 'Black Scripture Trophy Rush',
      phases: ['Uses rapid stiletto thrusts and martial movement', 'Displays adventurer plates and commits to a frantic speed combo'],
      lore: {
        fr: 'Clementine est une ancienne membre de la Black Scripture devenue meurtriere.',
        en: 'Clementine is a former Black Scripture member turned murderer.'
      },
      referenceUrl: 'https://overlordmaruyama.fandom.com/wiki/Clementine',
      visualAnchor: 'Exact anime Clementine, short blond hair, black-red outfit covered with adventurer plates and paired stilettos.'
    }
  ],
  'SCP Foundation': [
    {
      name: 'SCP-682',
      weapon: 'adaptive_claws_and_jaws',
      special: 'Adaptive Regeneration',
      phases: ['Uses massive bites, claw sweeps and tail strikes', 'Regenerates once with a visible adaptation tied to the received damage type'],
      lore: {
        fr: 'SCP-682 est un reptile hostile extremement difficile a detruire.',
        en: 'SCP-682 is an extremely hostile reptile that is very difficult to destroy.'
      },
      referenceUrl: 'https://scp-wiki.wikidot.com/scp-682',
      visualAnchor: 'Original interpretation constrained by the SCP article: huge emaciated reptilian organism, damaged hide and adaptive tissue, no borrowed game armor.'
    },
    {
      name: 'SCP-096',
      weapon: 'claws_and_unstoppable_charge',
      special: 'Face-Viewed Rage',
      phases: ['Remains passive while its face is not exposed', 'Enters the canonical unstoppable rage and charge after the trigger'],
      lore: {
        fr: 'SCP-096 devient violent lorsqu une personne voit son visage.',
        en: 'SCP-096 becomes violent when someone views its face.'
      },
      referenceUrl: 'https://scp-wiki.wikidot.com/scp-096',
      visualAnchor: 'Original interpretation constrained by the SCP article: extremely thin pale humanoid, very long arms, distressed posture and obscured face.'
    }
  ],
  'Family Guy': [
    {
      name: 'Ernie the Giant Chicken',
      weapon: 'cartoon_brawling',
      special: 'Extended Chicken Fight',
      phases: ['Uses punches, tackles and environmental crashes', 'Recovers from an apparent defeat for one shorter and faster reprise'],
      lore: {
        fr: 'Ernie est le rival recurrent de Peter dans leurs combats destructeurs.',
        en: 'Ernie is Peter s recurring rival in their destructive fights.'
      },
      referenceUrl: 'https://familyguy.fandom.com/wiki/Ernie_the_Giant_Chicken',
      visualAnchor: 'Exact Family Guy giant yellow chicken design, red comb and wattles, white shirt cuffs only when shown; flat series proportions.'
    },
    {
      name: 'Bertram',
      weapon: 'advanced_gadgets',
      special: 'Time-Travel Vendetta',
      phases: ['Uses documented gadgets and evasive attacks', 'Triggers a short time-displacement pattern before the final exchange'],
      lore: {
        fr: 'Bertram est le demi-frere rival de Stewie.',
        en: 'Bertram is Stewie s rival half-brother.'
      },
      referenceUrl: 'https://familyguy.fandom.com/wiki/Bertram',
      visualAnchor: 'Exact Family Guy infant design for Bertram, orange overalls, yellow shirt, oval head and hostile expression; no adult redesign.'
    }
  ],
  'American Dad': [
    {
      name: 'Santa Claus',
      weapon: 'military_sleigh_arsenal',
      special: 'Christmas War Assault',
      phases: ['Uses firearms and armed Christmas reinforcements', 'Calls the documented combat sleigh for a final strafing pass'],
      lore: {
        fr: 'Le Pere Noel d American Dad mene une guerre recurrente contre les Smith.',
        en: 'American Dad s Santa Claus wages a recurring war against the Smith family.'
      },
      referenceUrl: 'https://americandad.fandom.com/wiki/Santa_Claus',
      visualAnchor: 'Exact American Dad Santa design, red suit, white beard, muscular build and documented military equipment.'
    },
    {
      name: 'Tearjerker',
      weapon: 'villain_lair_controls',
      special: 'Oscar Gold Scheme',
      phases: ['Uses lair traps and henchman commands', 'Abandons the control station for a theatrical final confrontation'],
      lore: {
        fr: 'Tearjerker est la persona de mechant Bond de Roger.',
        en: 'Tearjerker is Roger s Bond-villain persona.'
      },
      referenceUrl: 'https://americandad.fandom.com/wiki/Tearjerker',
      visualAnchor: 'Exact Tearjerker persona from American Dad, white villain suit, styled hair, glasses and series proportions.'
    }
  ],
  'Lost Planet 2': [
    {
      name: 'Gordiant',
      weapon: 'stomps_and_swallow',
      special: 'Thermal Core Exposure',
      phases: ['Uses massive stomps, body slams and a swallowing attack', 'Exposes glowing thermal weak points after internal damage'],
      lore: {
        fr: 'Gordiant est un Akrid de categorie G affronte dans Lost Planet 2.',
        en: 'Gordiant is a Category G Akrid fought in Lost Planet 2.'
      },
      referenceUrl: 'https://news.capcomusa.com/lets/browse/lost-planet-2-boss-profile-gordiant-the-salamander-gets-a-name',
      visualAnchor: 'Exact gigantic red-brown salamander Akrid, low body, broad mouth and glowing orange thermal weak points from Lost Planet 2.'
    },
    {
      name: 'Red Eye',
      weapon: 'sand_charge_and_pods',
      special: 'Train Pursuit',
      phases: ['Pursues laterally with bites and explosive pod launches', 'Opens its enormous mouth as the final exposed weak point'],
      lore: {
        fr: 'Red Eye est le gigantesque Akrid du desert poursuivant le train.',
        en: 'Red Eye is the gigantic desert Akrid that pursues the train.'
      },
      referenceUrl: 'https://news.capcomusa.com/lets/browse/lost-planet-2-boss-profile-red-eye',
      visualAnchor: 'Exact Lost Planet 2 sand-worm Akrid, enormous circular mouth, lateral eye weak points and segmented desert body.'
    }
  ],
  'Jet Set Radio': [
    {
      name: 'Captain Onishima',
      weapon: 'service_pistol_and_police_command',
      special: 'Shibuya Crackdown',
      phases: ['Uses police formations and aimed pistol shots', 'Pursues directly with exaggerated series movement after the formation breaks'],
      lore: {
        fr: 'Onishima dirige la repression policiere contre les GG.',
        en: 'Onishima leads the police crackdown against the GG.'
      },
      referenceUrl: 'https://jetsetradio.fandom.com/wiki/Captain_Onishima',
      visualAnchor: 'Exact stylized police captain design from Jet Set Radio, cap, moustache, uniform, pistol and cel-shaded proportions.'
    },
    {
      name: 'Goji Rokkaku',
      weapon: 'golden_rhino_control',
      special: 'Rokkaku Tower Command',
      phases: ['Uses tower machinery and Golden Rhino guards', 'Appears in his exact final confrontation form after the defenses fail'],
      lore: {
        fr: 'Goji Rokkaku cherche a controler Tokyo-to et le Devil s Contract.',
        en: 'Goji Rokkaku seeks to control Tokyo-to and the Devil s Contract.'
      },
      referenceUrl: 'https://jetsetradio.fandom.com/wiki/Goji_Rokkaku',
      visualAnchor: 'Exact elderly Goji Rokkaku design from the selected game, formal dark suit, white hair and cel-shaded face.'
    }
  ],
  'Altered Beast': [
    {
      name: 'Aggar',
      weapon: 'severed_head_projectiles',
      special: 'Head Volley',
      phases: ['Throws severed heads in measured arcs', 'Accelerates the volley and adds a close-range body strike'],
      lore: {
        fr: 'Aggar est le premier boss d Altered Beast.',
        en: 'Aggar is the first boss of Altered Beast.'
      },
      referenceUrl: 'https://www.sega.com/games/altered-beast',
      visualAnchor: 'Faithful high-detail expansion of Aggar s arcade sprite, swollen gray humanoid body and detachable head projectiles.'
    },
    {
      name: 'Crocodile Worm',
      weapon: 'jaws_and_body_charge',
      special: 'Crocodile-Worm Lunge',
      phases: ['Uses long-body sweeps and crocodilian bites', 'Chains faster lunges after the body armor cracks'],
      lore: {
        fr: 'Crocodile Worm conserve exactement son anatomie hybride du jeu.',
        en: 'Crocodile Worm keeps its exact hybrid anatomy from the game.'
      },
      referenceUrl: 'https://alteredbeast.fandom.com/wiki/Crocodile_Worm',
      visualAnchor: 'Faithful high-detail expansion of the arcade hybrid, elongated worm body, crocodile head, original palette and no added limbs.'
    }
  ],
  'Streets of Rage': [
    {
      name: 'Shiva',
      weapon: 'martial_arts',
      special: 'Final Crash Combo',
      phases: ['Uses fast kicks, blocks and counterattacks', 'Extends into his documented high-speed boss combo below half health'],
      lore: {
        fr: 'Shiva est l artiste martial elite associe a Mr. X.',
        en: 'Shiva is the elite martial artist associated with Mr. X.'
      },
      referenceUrl: 'https://www.streets4rage.com/',
      visualAnchor: 'Exact selected Streets of Rage Shiva design, long dark hair, bare arms, martial trousers and series-specific color palette.'
    },
    {
      name: 'Abadede',
      weapon: 'wrestling_grapples',
      special: 'Arena Power Slam',
      phases: ['Uses wrestling grabs, throws and shoulder charges', 'Enters a faster rage with repeated power slams'],
      lore: {
        fr: 'Abadede est le catcheur massif recurrent de la serie.',
        en: 'Abadede is the series recurring massive wrestler.'
      },
      referenceUrl: 'https://streetsofrage.fandom.com/wiki/Abadede',
      visualAnchor: 'Faithful high-detail version of Abadede s classic sprite: huge wrestler build, mohawk, boots, wristbands and original palette.'
    }
  ],
  'Earthworm Jim': [
    {
      name: 'Evil the Cat',
      weapon: 'claws_and_nine_lives',
      special: 'Nine-Life Recovery',
      phases: ['Uses claw swipes and cartoon teleport feints', 'Recovers once with a shorter accelerated life cycle'],
      lore: {
        fr: 'Evil the Cat est le souverain demoniaque de Heck.',
        en: 'Evil the Cat is the demonic ruler of Heck.'
      },
      referenceUrl: 'https://earthwormjim.fandom.com/wiki/Evil_the_Cat',
      visualAnchor: 'Exact selected-game cartoon cat villain, red-black demonic palette, cape and horns where present; no realistic feline anatomy.'
    },
    {
      name: 'Professor Monkey-for-a-Head',
      weapon: 'laboratory_devices',
      special: 'Monkey-Head Override',
      phases: ['Uses laboratory gadgets and erratic movement', 'The monkey controls the body more aggressively during the final phase'],
      lore: {
        fr: 'Le professeur partage son corps avec un singe greffe a sa tete.',
        en: 'The professor shares his body with a monkey grafted to his head.'
      },
      referenceUrl: 'https://earthwormjim.fandom.com/wiki/Professor_Monkey-For-A-Head',
      visualAnchor: 'Exact cartoon scientist with the live monkey attached to his head, white coat, glasses and Earthworm Jim proportions.'
    }
  ],
  'Ecco the Dolphin': [
    {
      name: 'Vortex Drone',
      weapon: 'organic_projectiles_and_suction',
      special: 'Vortex Shell Opening',
      phases: ['Charges underwater and fires organic projectiles', 'Opens the biomechanical shell to expose a vulnerable core'],
      lore: {
        fr: 'Le drone Vortex appartient a l espece extraterrestre qui attaque les oceans.',
        en: 'The Vortex drone belongs to the alien species attacking the oceans.'
      },
      referenceUrl: 'https://eccothedolphin.fandom.com/wiki/Vortex',
      visualAnchor: 'Faithful high-detail expansion of the original aquatic biomechanical Vortex sprite, preserving anatomy and palette.'
    },
    {
      name: 'Medusa',
      weapon: 'electric_tentacles',
      special: 'Current Lock',
      phases: ['Uses tentacle sweeps and electrical pulses', 'Creates a strong current while briefly exposing the bell core'],
      lore: {
        fr: 'Medusa est une meduse geante du monde d Ecco.',
        en: 'Medusa is a giant jellyfish from Ecco s world.'
      },
      referenceUrl: 'https://eccothedolphin.fandom.com/wiki/Medusa',
      visualAnchor: 'Faithful game Medusa silhouette with translucent bell, long tentacles and original colors, without armor or humanoid features.'
    }
  ],
  Flashback: [
    {
      name: 'Morph Assassin',
      weapon: 'energy_pistol_and_disguise',
      special: 'Morph Reveal',
      phases: ['Fights in a human disguise with an energy pistol', 'Reveals the exact alien Morph form and attacks more quickly'],
      lore: {
        fr: 'Le Morph infiltre la societe humaine avant de reveler sa forme extraterrestre.',
        en: 'The Morph infiltrates human society before revealing its alien form.'
      },
      referenceUrl: 'https://www.microids.com/game-flashback/',
      visualAnchor: 'Faithful high-detail expansion of the original Flashback human disguise and documented Morph reveal, with the game energy pistol.'
    },
    {
      name: 'Master Brain',
      weapon: 'psionic_beams_and_modules',
      special: 'Core Exposure',
      phases: ['Uses control beams and linked defense modules', 'Exposes the central alien brain core after the modules are destroyed'],
      lore: {
        fr: 'Master Brain controle l installation alien finale.',
        en: 'Master Brain controls the final alien installation.'
      },
      referenceUrl: 'https://flashback.fandom.com/wiki/Master_Brain',
      visualAnchor: 'Faithful high-detail expansion of the original alien brain-computer sprite, cables, industrial housing and exposed central core.'
    }
  ],
  Ristar: [
    {
      name: 'Riho',
      weapon: 'musical_note_projectiles',
      special: 'Sonata Tempo Shift',
      phases: ['Launches musical notes in a fixed rhythm', 'Changes tempo and movement cadence after each stagger'],
      lore: {
        fr: 'Riho est l oiseau chanteur controle sur Planet Sonata.',
        en: 'Riho is the controlled singer bird on Planet Sonata.'
      },
      referenceUrl: 'https://ristar.fandom.com/wiki/Riho',
      visualAnchor: 'Exact Sega cartoon bird singer design and original blue-purple palette, no human pop-star reinterpretation.'
    },
    {
      name: 'Adahan',
      weapon: 'boss_copy_modules',
      special: 'Boss Memory Cycle',
      phases: ['Copies documented attacks from prior bosses while retaining one base body', 'Exposes the final robotic weak core after the copy cycle'],
      lore: {
        fr: 'Adahan est le robot de Greedy qui reproduit les anciens boss.',
        en: 'Adahan is Greedy s robot that reproduces previous bosses.'
      },
      referenceUrl: 'https://ristar.fandom.com/wiki/Adahan',
      visualAnchor: 'Exact final robot base design and palette from Ristar, with controlled transformation cues rather than unrelated full characters.'
    }
  ],
  Splatterhouse: [
    {
      name: 'Biggy Man',
      weapon: 'dual_chainsaws',
      special: 'Double Chainsaw Rush',
      phases: ['Uses alternating chainsaw sweeps and short rushes', 'Chains both saws into an uninterrupted rage sequence'],
      lore: {
        fr: 'Biggy Man est le geant masque aux deux tronconneuses.',
        en: 'Biggy Man is the masked giant wielding two chainsaws.'
      },
      referenceUrl: 'https://splatterhouse.fandom.com/wiki/Biggy_Man',
      visualAnchor: 'Exact selected-game Biggy Man, massive human frame, sack-like mask and one chainsaw in each hand; preserve game palette.'
    },
    {
      name: 'Dr. Henry West',
      weapon: 'corrupted_science_and_mutation',
      special: 'West Mansion Mutation',
      phases: ['Uses documented laboratory hazards in human form', 'Reveals the specific corrupted form from the selected Splatterhouse continuity'],
      lore: {
        fr: 'Henry West est le savant lie aux horreurs du manoir.',
        en: 'Henry West is the scientist tied to the mansion s horrors.'
      },
      referenceUrl: 'https://splatterhouse.fandom.com/wiki/Dr._Henry_West',
      visualAnchor: 'Lock to one selected game continuity: exact Henry West clothing and documented mutation, with no cross-version costume mixing.'
    }
  ],
  'Squid Game': [
    {
      name: 'Young-hee Doll',
      weapon: 'motion_detection',
      special: 'Red Light Detection',
      phases: ['Scans for movement during red-light windows', 'Shortens the green-light windows and rotates the head faster'],
      lore: {
        fr: 'Young-hee est l automate geant du jeu Un, deux, trois, soleil.',
        en: 'Young-hee is the giant automaton used for Red Light, Green Light.'
      },
      referenceUrl: 'https://www.netflix.com/tudum/articles/squid-game-young-hee-doll',
      visualAnchor: 'Exact giant schoolgirl robot, yellow-orange dress, pigtails, white socks and rotating sensor eyes from Squid Game.'
    },
    {
      name: 'Jang Deok-su',
      weapon: 'brutal_brawling',
      special: 'Dormitory Riot',
      phases: ['Uses heavy punches, grapples and shoves', 'Becomes reckless and chains attacks when isolated'],
      lore: {
        fr: 'Deok-su est un gangster violent parmi les participants.',
        en: 'Deok-su is a violent gangster among the contestants.'
      },
      referenceUrl: 'https://www.netflix.com/tudum/articles/squid-game-cast-guide',
      visualAnchor: 'Exact Heo Sung-tae likeness as player 101, green tracksuit, facial scar and human proportions; no armor or weapon.'
    }
  ],
  'La Casa de Papel': [
    {
      name: 'Cesar Gandia',
      weapon: 'assault_rifle_and_grenades',
      special: 'Bank Security Hunt',
      phases: ['Uses armor, cover and controlled rifle fire', 'Switches to grenades and close pursuit after his armor breaks'],
      lore: {
        fr: 'Gandia est le chef de securite qui traque le groupe dans la Banque d Espagne.',
        en: 'Gandia is the security chief who hunts the group inside the Bank of Spain.'
      },
      referenceUrl: 'https://www.netflix.com/tudum/articles/money-heist-cast',
      visualAnchor: 'Exact Jose Manuel Poga likeness, black security tactical gear, body armor and series firearms.'
    },
    {
      name: 'Colonel Tamayo',
      weapon: 'police_command_and_sidearm',
      special: 'State Assault Order',
      phases: ['Directs police pressure and timed sniper zones', 'Enters the bank with a sidearm only if the command phase collapses'],
      lore: {
        fr: 'Tamayo commande la reponse de l Etat contre les braqueurs.',
        en: 'Tamayo commands the state response against the robbers.'
      },
      referenceUrl: 'https://www.netflix.com/tudum/articles/money-heist-cast',
      visualAnchor: 'Exact Fernando Cayo likeness, Spanish police command uniform and service sidearm; no invented heavy combat suit.'
    }
  ],
  'Secret of Monkey Island': [
    {
      name: 'Largo LaGrande',
      weapon: 'pirate_cutlass',
      special: 'Scabb Island Embargo',
      phases: ['Uses a cutlass and dirty pirate tricks', 'Calls a short embargo guard wave before a final duel'],
      lore: {
        fr: 'Largo impose l embargo de Scabb Island au nom de LeChuck.',
        en: 'Largo enforces the Scabb Island embargo for LeChuck.'
      },
      referenceUrl: 'https://monkeyisland.fandom.com/wiki/Largo_LaGrande',
      visualAnchor: 'Faithful high-detail version of Largo LaGrande s selected game design, short pirate build, hat, coat and cutlass.'
    },
    {
      name: 'Sheriff Fester Shinetop',
      weapon: 'period_pistol',
      special: 'LeChuck Disguise Reveal',
      phases: ['Uses the sheriff disguise to arrest and restrain', 'Shows subtle documented LeChuck cues and fires the period pistol'],
      lore: {
        fr: 'Fester Shinetop est le deguisement de LeChuck sur Melee Island.',
        en: 'Fester Shinetop is LeChuck s disguise on Melee Island.'
      },
      referenceUrl: 'https://monkeyisland.fandom.com/wiki/Fester_Shinetop',
      visualAnchor: 'Exact bald sheriff disguise and original-game period outfit, with only source-accurate LeChuck reveal cues.'
    }
  ],
  'Zombies Ate My Neighbors': [
    {
      name: 'Dr. Tongue',
      weapon: 'monster_lab_devices',
      special: 'Monster Formula',
      phases: ['Uses laboratory devices and monster reinforcements', 'Triggers his documented transformation or final device pattern from the selected game'],
      lore: {
        fr: 'Dr. Tongue est le savant responsable de l invasion de monstres.',
        en: 'Dr. Tongue is the scientist responsible for the monster invasion.'
      },
      referenceUrl: 'https://zombiesatemyneighbors.fandom.com/wiki/Dr._Tongue',
      visualAnchor: 'Faithful high-detail expansion of Dr. Tongue s 16-bit scientist design, laboratory coat, facial features and source apparatus.'
    },
    {
      name: 'Giant Ant Queen',
      weapon: 'mandibles_and_acid',
      special: 'Nest Brood',
      phases: ['Uses mandible bites and short acid spits', 'Spawns a limited ant wave while exposing the abdomen'],
      lore: {
        fr: 'La reine geante defend le nid de fourmis.',
        en: 'The giant queen defends the ant nest.'
      },
      referenceUrl: 'https://zombiesatemyneighbors.fandom.com/wiki/Giant_Ant',
      visualAnchor: 'Faithful high-detail expansion of the 16-bit giant ant anatomy and palette, huge abdomen and mandibles, no fantasy armor.'
    }
  ],
  'Wrong Turn': [
    {
      name: 'Three Finger',
      weapon: 'bow_and_blade',
      special: 'Forest Ambush',
      phases: ['Uses a bow from concealment and sets simple traps', 'Closes distance with his documented blade and feral movement'],
      lore: {
        fr: 'Three Finger est le chasseur cannibale recurrent de la franchise.',
        en: 'Three Finger is the franchise s recurring cannibal hunter.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Wrong_Turn_(film_series)',
      visualAnchor: 'Exact selected-film Three Finger makeup, asymmetrical face, dirty hunting clothes, bow and blade; no supernatural mutation.'
    },
    {
      name: 'Saw Tooth',
      weapon: 'axe',
      special: 'Cannibal Heavy Charge',
      phases: ['Uses broad axe swings and blocks narrow paths', 'Charges more aggressively after receiving visible human injuries'],
      lore: {
        fr: 'Saw Tooth est le membre massif du clan cannibale.',
        en: 'Saw Tooth is the massive member of the cannibal clan.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Wrong_Turn_(film_series)',
      visualAnchor: 'Exact selected-film Saw Tooth prosthetic makeup, huge human build, forest clothing and axe; no monster armor.'
    }
  ],
  Cthulhu: [
    {
      name: 'Shoggoth',
      weapon: 'protoplasmic_tentacles',
      special: 'Tekeli-li Surge',
      phases: ['Flows through openings and attacks with temporary limbs', 'Forms many eyes and a larger crushing wave while repeating the documented cry'],
      lore: {
        fr: 'Le Shoggoth suit la description protoplasmique des Montagnes hallucinees.',
        en: 'The Shoggoth follows the protoplasmic description from At the Mountains of Madness.'
      },
      referenceUrl: 'https://www.hplovecraft.com/writings/texts/fiction/mm.aspx',
      visualAnchor: 'Original rendering constrained by the text: vast black protoplasmic mass, temporary eyes and limbs, no fixed humanoid anatomy.'
    }
  ],
  Necronomicon: [
    {
      name: 'Wilbur Whateley',
      weapon: 'occult_ritual_and_hidden_tentacles',
      special: 'Whateley Body Reveal',
      phases: ['Uses ritual wards while keeping the lower body concealed', 'Reveals the text-described nonhuman anatomy after his clothing tears'],
      lore: {
        fr: 'Wilbur Whateley cache une ascendance non humaine decrite dans Dunwich.',
        en: 'Wilbur Whateley conceals a nonhuman ancestry described in Dunwich.'
      },
      referenceUrl: 'https://www.hplovecraft.com/writings/texts/fiction/dh.aspx',
      visualAnchor: 'Original rendering strictly constrained by the story s description of Wilbur, goatlike features and concealed lower-body anatomy.'
    },
    {
      name: 'Dunwich Horror',
      weapon: 'invisible_tentacles_and_crushing_mass',
      special: 'Powder-Revealed Form',
      phases: ['Attacks mostly invisible with terrain depressions and tentacles', 'Briefly reveals the text-described colossal form under powder before banishment'],
      lore: {
        fr: 'L Horreur de Dunwich est le frere invisible et monstrueux de Wilbur.',
        en: 'The Dunwich Horror is Wilbur s invisible monstrous brother.'
      },
      referenceUrl: 'https://www.hplovecraft.com/writings/texts/fiction/dh.aspx',
      visualAnchor: 'Original rendering strictly constrained by the text: colossal mostly invisible protoplasmic body, many eyes, tentacles and temporary powder outline.'
    }
  ],
  'Re-Animator': [
    {
      name: 'Dr. Carl Hill - Head and Body',
      weapon: 'telepathic_command_and_grapple',
      special: 'Headless Body Coordination',
      phases: ['The severed head issues telepathic commands while the body grapples', 'Head and body coordinate a faster final attack as one linked unit'],
      lore: {
        fr: 'Carl Hill controle son propre corps decapite apres reanimation.',
        en: 'Carl Hill controls his own decapitated body after reanimation.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Re-Animator',
      visualAnchor: 'Exact David Gale likeness, severed head and headless suited body from the 1985 film, represented as one linked boss.'
    },
    {
      name: 'Zombie Dean Halsey',
      weapon: 'undead_grapples',
      special: 'Reagent Frenzy',
      phases: ['Uses slow grabs and heavy body strikes', 'Reagent agitation causes a short uncontrolled frenzy'],
      lore: {
        fr: 'Le doyen Halsey est reanime par le serum de West.',
        en: 'Dean Halsey is reanimated by West s reagent.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Re-Animator',
      visualAnchor: 'Exact Robert Sampson likeness, damaged dean clothing and undead makeup from Re-Animator; no unrelated zombie mutation.'
    }
  ],
  'Digimon Celestial Rift': [
    {
      name: 'Lucemon Falldown Mode',
      weapon: 'light_and_dark_energy',
      special: 'Paradise Lost',
      phases: ['Uses alternating light and dark energy attacks', 'Unleashes the documented Paradise Lost technique at low health'],
      lore: {
        fr: 'Lucemon Falldown Mode unit les pouvoirs de la lumiere et des tenebres.',
        en: 'Lucemon Falldown Mode combines the powers of light and darkness.'
      },
      referenceUrl: 'https://digimon.net/reference_en/detail.php?directory_name=lucemonfalldownmode',
      visualAnchor: 'Exact official Digimon Reference Book design, blond humanoid demon, black-white wings, markings and proportions.'
    },
    {
      name: 'Ordinemon',
      weapon: 'dark_energy_and_wings',
      special: 'End-of-World Collapse',
      phases: ['Uses huge wing sweeps and dark energy spheres', 'Destabilizes into a wider collapse pattern after the central body is exposed'],
      lore: {
        fr: 'Ordinemon est la fusion corrompue de Raguelmon et Ophanimon Falldown Mode.',
        en: 'Ordinemon is the corrupted fusion of Raguelmon and Ophanimon Falldown Mode.'
      },
      referenceUrl: 'https://digimon.net/reference_en/detail.php?directory_name=ordinemon',
      visualAnchor: 'Exact official Ordinemon design, immense black-white body, multiple wings, central feminine form and documented markings.'
    }
  ],
  Halo: [
    {
      name: 'Gravemind',
      weapon: 'flood_tendrils_and_biomass',
      special: 'Flood Consciousness',
      phases: ['Sweeps with massive Flood tendrils around one coherent biomass', 'Exposes the flower-like speaking core and calls a limited infection wave'],
      lore: {
        fr: 'Les tendrils et le node appartiennent au meme Gravemind et ne forment pas deux boss.',
        en: 'The tendrils and node belong to one Gravemind and are not two separate bosses.'
      },
      referenceUrl: 'https://www.halowaypoint.com/news/canon-fodder-infection-imminent',
      visualAnchor: 'Exact Halo 2 and Halo 3 Flood biomass, huge layered tendrils and flower-like speaking mouth; one organism, no plant foliage.'
    },
    {
      name: 'The Didact',
      weapon: 'constraint_field_and_forerunner_armor',
      special: 'Composer Pulse',
      phases: ['Uses a constraint field, telekinetic throws and armor strikes', 'Damaged armor exposes the face before a focused Composer pulse'],
      lore: {
        fr: 'L Ur-Didact est represente directement, pas comme un echo spectral.',
        en: 'The Ur-Didact is represented directly, not as a spectral echo.'
      },
      referenceUrl: 'https://www.halowaypoint.com/news/canon-fodder-didacts-domain',
      visualAnchor: 'Exact Halo 4 black-orange Forerunner Warrior-Servant armor, helmet, tall build and documented face.'
    }
  ],
  'Silent Hill': [
    {
      name: 'Incubus',
      weapon: 'divine_lightning',
      special: 'Bad-Ending Final Manifestation',
      phases: ['Uses aerial divine lightning from above the ritual chamber', 'Accelerates the lightning pattern after its wings and torso are visibly damaged'],
      lore: {
        fr: 'Incubus est verrouille sur la manifestation finale de la branche correspondante de Silent Hill.',
        en: 'Incubus is locked to the matching final manifestation branch of Silent Hill.'
      },
      referenceUrl: 'https://www.konami.com/games/silenthill/',
      visualAnchor: 'Exact dark winged Incubus from the original Silent Hill final battle, horned humanoid demon anatomy and no Incubator elements.'
    },
    {
      name: 'Scarlet',
      weapon: 'porcelain_claws',
      special: 'Doll Body Break',
      phases: ['Moves as the tall porcelain doll and uses long-limbed swipes', 'Cracked porcelain reveals the canonical spider-like final movement'],
      lore: {
        fr: 'Scarlet est la manifestation de la fille du juge Holloway.',
        en: 'Scarlet is the manifestation of Judge Holloway s daughter.'
      },
      referenceUrl: 'https://silenthill.fandom.com/wiki/Scarlet',
      visualAnchor: 'Exact Silent Hill Homecoming porcelain doll boss, red dress, elongated limbs, cracked face and documented spider-like phase.'
    }
  ],
  'The Matrix': [
    {
      name: 'The Twins',
      weapon: 'straight_razors_and_phasing',
      special: 'Ghost Phase',
      phases: ['Fight as one synchronized duo with straight razors', 'Turn translucent white to phase through attacks before a coordinated counter'],
      lore: {
        fr: 'Les Jumeaux sont les deux Exiles au service du Merovingien.',
        en: 'The Twins are the two Exiles serving the Merovingian.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/matrix-reloaded',
      visualAnchor: 'Exactly two identical pale men, white dreadlocks, white suits, black narrow sunglasses and straight razors from The Matrix Reloaded.'
    },
    {
      name: 'Agent Jones',
      weapon: 'handgun_and_agent_martial_arts',
      special: 'Agent Body Transfer',
      phases: ['Uses precise handgun fire and Matrix agent martial arts', 'Transfers through one nearby simulated civilian after being defeated once'],
      lore: {
        fr: 'Jones est un Agent nomme et non une escouade abstraite.',
        en: 'Jones is a named Agent rather than an abstract squad.'
      },
      referenceUrl: 'https://www.warnerbros.com/movies/matrix',
      visualAnchor: 'Exact Robert Taylor likeness, dark green-black suit, tie, earpiece and rectangular sunglasses from The Matrix.'
    }
  ],
  Stargate: [
    {
      name: 'RepliCarter',
      weapon: 'replicator_nanites',
      special: 'Nanite Reassembly',
      phases: ['Uses Samantha Carter s human-form Replicator strength and nanite blades', 'Breaks into metallic blocks and reassembles once'],
      lore: {
        fr: 'Les deux variantes de Replicator Carter sont fusionnees en une seule RepliCarter.',
        en: 'The two Replicator Carter variants are merged into one RepliCarter.'
      },
      referenceUrl: 'https://stargate.fandom.com/wiki/RepliCarter',
      visualAnchor: 'Exact Amanda Tapping likeness as RepliCarter, dark SG-1-era clothing and body transitions into small metallic Replicator blocks.'
    },
    {
      name: 'First',
      weapon: 'replicator_blocks_and_blade',
      special: 'Human-Form Reassembly',
      phases: ['Uses human-form strength and a blade formed from Replicator material', 'Body separates into blocks and reforms behind the target'],
      lore: {
        fr: 'First remplace le faux concept de reine Replicator.',
        en: 'First replaces the invented Replicator Queen concept.'
      },
      referenceUrl: 'https://stargate.fandom.com/wiki/First',
      visualAnchor: 'Exact pale human-form Replicator known as First, simple dark clothing and metallic block decomposition; no insect queen anatomy.'
    }
  ],
  'Half-Life': [
    {
      name: 'Nihilanth',
      weapon: 'energy_orbs_and_teleport',
      special: 'Cranial Core Exposure',
      phases: ['Floats, fires energy orbs and teleports reinforcements', 'Opens the cranial machinery and exposes the vulnerable brain core'],
      lore: {
        fr: 'Nihilanth est le dernier etre de Xen affronte dans Half-Life.',
        en: 'Nihilanth is the final Xen being fought in Half-Life.'
      },
      referenceUrl: 'https://combineoverwiki.net/wiki/Nihilanth',
      visualAnchor: 'Exact giant fetal alien body, atrophied legs, third arm, wrist bindings and cranial machinery from Half-Life.'
    },
    {
      name: 'Combine Hunter-Chopper',
      weapon: 'pulse_cannon_and_mines',
      special: 'Mine Carpet',
      phases: ['Strafes with the pulse cannon and rotor wash', 'Drops a mine carpet while damaged sections emit smoke'],
      lore: {
        fr: 'Le Hunter-Chopper remplace le relay Overwatch, qui est un systeme et non un boss.',
        en: 'The Hunter-Chopper replaces the Overwatch relay, which is a system rather than a boss.'
      },
      referenceUrl: 'https://combineoverwiki.net/wiki/Hunter-Chopper',
      visualAnchor: 'Exact Combine Hunter-Chopper aircraft silhouette, rotors, organic-metal fuselage, pulse cannon and mine dispenser; entire vehicle visible.'
    }
  ],
  Portal: [
    {
      name: 'Frankenturret',
      weapon: 'multiple_turret_guns',
      special: 'Component Failure',
      phases: ['Scuttles with mismatched limbs and fires its attached turrets', 'Loses one component at a time and becomes unstable'],
      lore: {
        fr: 'Frankenturret est un assemblage canonique de tourelles et de cubes.',
        en: 'Frankenturret is a canonical assembly of turrets and cubes.'
      },
      referenceUrl: 'https://theportalwiki.com/wiki/Frankenturret',
      visualAnchor: 'Exact Portal 2 mismatched turret-cube construction, white panels, black joints, red optics and awkward walking posture.'
    }
  ],
  'Metal Gear': [
    {
      name: 'Metal Gear REX',
      weapon: 'railgun_missiles_and_laser',
      special: 'Radome Break',
      phases: ['Uses missiles, machine guns, laser and intact radome targeting', 'Broken radome exposes the cockpit for the final phase'],
      lore: {
        fr: 'Les variantes Shadow et Phantom sont fusionnees dans le REX de Shadow Moses.',
        en: 'The Shadow and Phantom variants are merged into the Shadow Moses REX.'
      },
      referenceUrl: 'https://www.konami.com/mg/history/us/en/',
      visualAnchor: 'Exact gray-black Metal Gear REX from Metal Gear Solid, bipedal legs, railgun, radome, missile pods and cockpit.'
    },
    {
      name: 'Psycho Mantis',
      weapon: 'psychokinesis',
      special: 'Mind-Control Pattern',
      phases: ['Throws room objects with psychokinesis and evades direct aim', 'Uses the documented mind-control pattern before a vulnerable recovery'],
      lore: {
        fr: 'Psycho Mantis est represente comme personnage reel, pas comme souvenir spectral.',
        en: 'Psycho Mantis is represented as the actual character, not a spectral memory.'
      },
      referenceUrl: 'https://www.konami.com/mg/history/us/en/',
      visualAnchor: 'Exact Metal Gear Solid Psycho Mantis, black gas mask, bald scarred head, black tactical bodysuit and red-brown harness.'
    }
  ],
  Fallout: [
    {
      name: 'Frank Horrigan',
      weapon: 'plasma_gun_and_power_armor',
      special: 'Enclave Final Stand',
      phases: ['Uses the integrated plasma weapon and armored melee strikes', 'Damaged armor exposes life-support failures without changing his identity'],
      lore: {
        fr: 'Frank Horrigan est l agent mutant de l Enclave affronte dans Fallout 2.',
        en: 'Frank Horrigan is the Enclave mutant agent fought in Fallout 2.'
      },
      referenceUrl: 'https://fallout.bethesda.net/',
      visualAnchor: 'Faithful high-detail Frank Horrigan, enormous mutant scale, black Enclave power armor, integrated plasma gun and helmet.'
    },
    {
      name: 'The Master',
      weapon: 'psychic_control_and_turrets',
      special: 'Cathedral Mind Assault',
      phases: ['Uses psychic pressure and linked Cathedral defenses', 'Exposes the fused human-computer biomass for the final exchange'],
      lore: {
        fr: 'The Master remplace Liberty Prime, qui n est pas un ennemi de cette confrontation.',
        en: 'The Master replaces Liberty Prime, who is not an enemy in this confrontation.'
      },
      referenceUrl: 'https://fallout.fandom.com/wiki/Master',
      visualAnchor: 'Exact Fallout 1 fused Master: human face embedded in flesh and computer machinery, cables, monitors and no mobile humanoid body.'
    }
  ],
  'Scary Movie': [
    {
      name: 'Tabitha',
      weapon: 'cursed_videotape_and_telekinesis',
      special: 'Television Crawl',
      phases: ['Uses cursed-video distortions and telekinetic objects', 'Crawls from the television in her exact parody form for close attacks'],
      lore: {
        fr: 'Tabitha est l antagoniste identifiable de Scary Movie 3.',
        en: 'Tabitha is the identifiable antagonist of Scary Movie 3.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Scary_Movie_3',
      visualAnchor: 'Exact child ghost parody from Scary Movie 3, long black hair, pale face, white sleepwear and film television-crawl pose.'
    }
  ],
  'Rick and Morty': [
    {
      name: 'Evil Morty',
      weapon: 'portal_gun_and_citadel_control',
      special: 'Central Finite Curve Escape',
      phases: ['Uses Citadel defenses, portal feints and controlled fire', 'Reveals the eyepatch transmitter and executes the escape sequence'],
      lore: {
        fr: 'Les doublons Evil Morty sont remplaces par une seule entree coherente.',
        en: 'Duplicate Evil Morty entries are replaced by one coherent entry.'
      },
      referenceUrl: 'https://www.adultswim.com/videos/rick-and-morty',
      visualAnchor: 'Exact Rick and Morty Evil Morty design, yellow shirt, blue trousers, black eyepatch with transmitter and portal gun.'
    },
    {
      name: 'Phoenixperson',
      weapon: 'arm_cannons_and_cybernetic_wings',
      special: 'Phoenix Assault',
      phases: ['Uses aerial charges, arm cannons and wing strikes', 'Damaged programming causes an unstable final attack cycle'],
      lore: {
        fr: 'Phoenixperson est Birdperson reconstruit et reprogramme.',
        en: 'Phoenixperson is the rebuilt and reprogrammed Birdperson.'
      },
      referenceUrl: 'https://rickandmorty.fandom.com/wiki/Phoenixperson',
      visualAnchor: 'Exact black-red cybernetic Birdperson body, metal wings, red optics and arm cannons from the season 4 finale.'
    }
  ],
  'Digital Circus': [
    {
      name: 'Abstracted Kaufmo',
      weapon: 'abstracted_limbs',
      special: 'Abstracted Rampage',
      phases: ['Charges with erratic multilimbed movement', 'Distorts the arena edges and accelerates below half health'],
      lore: {
        fr: 'Kaufmo abstrait est une seule entite, pas deux variantes de boss.',
        en: 'Abstracted Kaufmo is one entity, not two separate boss variants.'
      },
      referenceUrl: 'https://www.glitchprod.com/theamazingdigitalcircus',
      visualAnchor: 'Exact black multicolored-eye abstracted Kaufmo creature from the pilot, irregular limbs and no remaining clown body.'
    },
    {
      name: 'Gloink Queen',
      weapon: 'gloink_spawn_and_vacuum',
      special: 'Geometric Consumption',
      phases: ['Spawns a limited Gloink wave and uses mouth sweeps', 'Creates a suction pattern toward the huge mouth'],
      lore: {
        fr: 'La Gloink Queen est la creature geometrique du sous-sol du cirque.',
        en: 'The Gloink Queen is the geometric creature beneath the circus.'
      },
      referenceUrl: 'https://www.glitchprod.com/theamazingdigitalcircus',
      visualAnchor: 'Exact red-pink geometric Gloink Queen, huge toothed mouth and pilot proportions; no Caine or Kaufmo features.'
    }
  ],
  Discworld: [
    {
      name: 'Vorbis',
      weapon: 'staff_and_authority',
      special: 'Omnian Inquisition',
      phases: ['Uses a staff, commands and psychological feints', 'Loses composure and commits to direct strikes after his authority breaks'],
      lore: {
        fr: 'Vorbis remplace la tempete de Sourcery, qui est un evenement.',
        en: 'Vorbis replaces the Sourcery storm, which is an event.'
      },
      referenceUrl: 'https://www.terrypratchettbooks.com/books/small-gods/',
      visualAnchor: 'Original text-faithful Vorbis based on one selected licensed edition: bald severe cleric, austere robes and plain staff.'
    },
    {
      name: 'Mr Teatime',
      weapon: 'knives_and_assassin_tools',
      special: 'Hogfather Assassination Plan',
      phases: ['Uses precise knives and concealed assassin tools', 'Reveals his unstable focus and attacks in rapid unpredictable bursts'],
      lore: {
        fr: 'Mr Teatime est l assassin charge d eliminer le Hogfather.',
        en: 'Mr Teatime is the assassin hired to eliminate the Hogfather.'
      },
      referenceUrl: 'https://www.terrypratchettbooks.com/books/hogfather/',
      visualAnchor: 'Original text-faithful Mr Teatime based on one selected licensed edition, mismatched eyes, neat dark clothing and assassin knives.'
    }
  ],
  'The Batman Who Laughs': [
    {
      name: 'Murder Machine',
      weapon: 'nanobat_technology',
      special: 'Alfred Protocol',
      phases: ['Uses nanotechnological weapons and armored strikes', 'Reconfigures the body with the documented Alfred AI combat protocol'],
      lore: {
        fr: 'Murder Machine est le Batman corrompu de Terre -44.',
        en: 'Murder Machine is the corrupted Batman of Earth -44.'
      },
      referenceUrl: 'https://www.dc.com/comics/dark-nights-metal-2017/dark-nights-metal-dark-knights-rising',
      visualAnchor: 'Exact Dark Nights Metal Murder Machine, blue-gray cybernetic Batman body, red optics, angular armor and no Joker grin.'
    },
    {
      name: 'Dawnbreaker',
      weapon: 'corrupted_power_ring',
      special: 'Black Light Constructs',
      phases: ['Uses corrupted Green Lantern constructs and flight', 'Extinguishes arena light and releases the documented black void constructs'],
      lore: {
        fr: 'Dawnbreaker remplace l essaim de Dark Robins comme boss individuel.',
        en: 'Dawnbreaker replaces the Dark Robin swarm as an individual boss.'
      },
      referenceUrl: 'https://www.dc.com/comics/dark-nights-metal-2017/dark-nights-metal-dark-knights-rising',
      visualAnchor: 'Exact corrupted Green Lantern Batman suit, glowing ring, pale face and black-green void constructs from Dark Nights Metal.'
    }
  ],
  Aliens: [
    {
      name: 'Warrior Xenomorph Alpha',
      weapon: 'claws_tail_and_inner_jaw',
      special: 'Hive Ambush',
      phases: ['Stalks on walls and uses claws and tail strikes', 'Uses a fast inner-jaw lunge after its carapace is damaged'],
      lore: {
        fr: 'Le Warrior remplace le Power Loader, qui est l equipement de Ripley.',
        en: 'The Warrior replaces the Power Loader, which is Ripley s equipment.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens',
      visualAnchor: 'Exact 1986 Warrior Xenomorph, ribbed blue-black dome, biomechanical exoskeleton, six dorsal tubes, long tail and digitigrade limbs.'
    }
  ],
  'Alien 3': [
    {
      name: 'Runner / Dragon Xenomorph',
      weapon: 'quadruped_charge_and_inner_jaw',
      special: 'Leadworks Thermal Shock',
      phases: ['Uses ceiling movement, quadruped charges and bites', 'Transitions through the documented molten-lead and sprinkler thermal-shock sequence'],
      lore: {
        fr: 'La poursuite de la fonderie devient une phase du Runner, pas un boss abstrait.',
        en: 'The leadworks chase becomes a Runner phase rather than an abstract boss.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien3',
      visualAnchor: 'Exact Alien 3 Runner, brown-black biomechanical hide, smooth dome, doglike quadruped posture, long tail and no dorsal tubes.'
    }
  ],
  'Alien Resurrection': [
    {
      name: 'Alien Queen Clone',
      weapon: 'claws_tail_and_egg_sac',
      special: 'Captured Queen Breakout',
      phases: ['Fights restrained with claws and tail while attached to the reproductive structure', 'Breaks containment for a short mobile final phase'],
      lore: {
        fr: 'La reine clone est l individu captif de l Auriga avant la naissance du Newborn.',
        en: 'The cloned queen is the captive Auriga specimen before the Newborn is born.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-resurrection',
      visualAnchor: 'Exact Alien Resurrection Queen clone, ridged crown, brown-black biomechanical body and altered reproductive anatomy from the film.'
    },
    {
      name: 'Dr. Mason Wren',
      weapon: 'sidearm_and_security_control',
      special: 'Auriga Containment Order',
      phases: ['Uses a sidearm and activates containment defenses', 'Attempts an armed escape after the systems fail'],
      lore: {
        fr: 'Wren dirige les experiences illegales de l Auriga.',
        en: 'Wren directs the Auriga s illegal experiments.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-resurrection',
      visualAnchor: 'Exact J. E. Freeman likeness, United Systems Military science uniform and film sidearm; no android or alien mutation.'
    }
  ],
  'Alien: Covenant': [
    {
      name: 'David 8',
      weapon: 'laboratory_control_and_flute',
      special: 'Engineer Lab Release',
      phases: ['Uses laboratory doors, specimens and deceptive movement', 'Reveals the exact android identity and fights with inhuman precision'],
      lore: {
        fr: 'David est le createur des experiences du laboratoire de la cite des Ingenieurs.',
        en: 'David is the creator of the experiments in the Engineer city laboratory.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-covenant',
      visualAnchor: 'Exact Michael Fassbender likeness as David 8, long blond hair, dark Engineer-city clothing and the canonical flute.'
    },
    {
      name: 'Praetomorph',
      weapon: 'claws_tail_and_inner_jaw',
      special: 'Cargo Bay Assault',
      phases: ['Uses rapid charges, tail stabs and inner-jaw attacks', 'Becomes more aggressive during the documented cargo-bay ejection sequence'],
      lore: {
        fr: 'Le xenomorphe de Covenant est nomme Praetomorph pour ce roster.',
        en: 'The Covenant xenomorph is labeled Praetomorph for this roster.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-covenant',
      visualAnchor: 'Exact 2017 Covenant creature, long limbs, black sinewy skin, smooth dome, inner jaw and tail; no 1986 Warrior ribbing.'
    }
  ],
  'Alien: Romulus': [
    {
      name: 'Scorched Xenomorph',
      weapon: 'tail_claws_and_inner_jaw',
      special: 'Zero-G Acid Threat',
      phases: ['Stalks through walls and uses precise tail strikes', 'Damaged body releases acid that becomes a zero-gravity navigation hazard'],
      lore: {
        fr: 'Scorched remplace le terminal Rook comme boss physique local.',
        en: 'Scorched replaces the Rook terminal as the physical local boss.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-romulus',
      visualAnchor: 'Exact 2024 Scorched Xenomorph, distinctive frontal dome scar, black biomechanical body, long fingers, tail and inner jaw.'
    }
  ],
  'Predator 2': [
    {
      name: 'City Hunter',
      weapon: 'combi_stick_smart_disc_and_plasmacaster',
      special: 'Rooftop Hunt',
      phases: ['Uses cloak, plasmacaster and rooftop movement', 'Loses the mask and switches to combi-stick and smart-disc combat'],
      lore: {
        fr: 'City Hunter est le Predator principal de Los Angeles.',
        en: 'City Hunter is the main Predator hunting in Los Angeles.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/predator-2',
      visualAnchor: 'Exact Predator 2 City Hunter armor, bronze biomask, netting, shoulder cannon, combi-stick and smart disc.'
    },
    {
      name: 'Greyback Elder Predator',
      weapon: 'flintlock_pistol_and_wrist_blades',
      special: 'Elder Ship Trial',
      phases: ['Tests the target with restrained wrist-blade attacks', 'Uses the documented antique flintlock only as a symbolic final pattern'],
      lore: {
        fr: 'Greyback est l ancien qui remet le pistolet a Harrigan.',
        en: 'Greyback is the elder who gives Harrigan the antique pistol.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/predator-2',
      visualAnchor: 'Exact elder Predator from the ship finale, aged unmasked face, ornate armor, cape details and Raphael Adolini flintlock.'
    }
  ],
  Prey: [
    {
      name: 'Grizzly Bear',
      weapon: 'claws_and_bite',
      special: 'Riverbank Charge',
      phases: ['Charges, swipes and bites with realistic animal movement', 'Uses the documented riverbank mauling pattern before retreating from the Feral Predator'],
      lore: {
        fr: 'L ours est une rencontre animale distincte de la progression du Feral Predator.',
        en: 'The bear is an animal encounter distinct from the Feral Predator progression.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/prey',
      visualAnchor: 'Realistic exact film-scale brown grizzly, wet muddy fur and source-visible wounds only; no armor or mutation.'
    }
  ],
  'Alien vs Predator': [
    {
      name: 'Scar Predator',
      weapon: 'combi_stick_wrist_blades_and_plasmacaster',
      special: 'Trial Mark',
      phases: ['Uses combi-stick and wrist blades before earning the plasma caster', 'Adds the caster and carries the documented acid-blood clan mark'],
      lore: {
        fr: 'Scar est le jeune Predator survivant de l epreuve de la pyramide.',
        en: 'Scar is the young Predator who survives the pyramid trial.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien-vs-predator',
      visualAnchor: 'Exact Scar Predator armor, silver biomask, netting, combi-stick and later acid-blood forehead mark from AVP.'
    }
  ],
  'Aliens vs Predator: Requiem': [
    {
      name: 'Wolf Predator',
      weapon: 'dual_plasmacasters_whip_and_cleaner_fluid',
      special: 'Cleaner Protocol',
      phases: ['Uses dual shoulder cannons, mines and cleaner fluid', 'Switches to the razor whip and wrist blades for the rooftop duel'],
      lore: {
        fr: 'Wolf est le nettoyeur envoye pour effacer les preuves de l infestation.',
        en: 'Wolf is the cleaner sent to erase evidence of the infestation.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem',
      visualAnchor: 'Exact battle-scarred Wolf Predator, damaged biomask, dark armor, dual plasmacasters, whip and cleaner-fluid kit.'
    },
    {
      name: 'Predalien',
      weapon: 'tail_claws_inner_jaw_and_implantation',
      special: 'Rooftop Hybrid Assault',
      phases: ['Uses xenomorph wall movement, tail and inner jaw', 'Uses the film-specific reproductive attack before the final rooftop exchange'],
      lore: {
        fr: 'Le Predalien remplace l effondrement abstrait de la Garde nationale.',
        en: 'The Predalien replaces the abstract National Guard collapse.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/aliens-vs-predator-requiem',
      visualAnchor: 'Exact AVPR Predalien, xenomorph body, Predator mandibles and dreadlock-like appendages, ridged crown and long tail.'
    }
  ],
  Noob: [
    {
      name: 'Tabris',
      weapon: 'canonical_avatar_loadout',
      special: 'Guild Corruption Burst',
      phases: ['Uses the exact class abilities and equipment from the selected Noob season', 'Triggers the documented corrupted-avatar state without changing franchise'],
      lore: {
        fr: 'Tabris remplace le maitre de guilde corrompu generique.',
        en: 'Tabris replaces the generic corrupted guild master.'
      },
      referenceUrl: 'https://noob-tv.com/videos.php?id=1&sid=6',
      visualAnchor: 'Exact Tabris avatar appearance, armor, face, weapon and palette from the selected Noob episode; no generic MMO armor.'
    },
    {
      name: 'Spectre',
      weapon: 'canonical_class_weapon',
      special: 'Spectre Burst Rotation',
      phases: ['Uses the exact class rotation and defensive cooldowns shown in Noob', 'Attempts one documented high-damage burst after resetting position'],
      lore: {
        fr: 'Spectre remplace le faux boss d instance sans identite.',
        en: 'Spectre replaces the unidentified generic instance boss.'
      },
      referenceUrl: 'https://noob.fandom.com/fr/wiki/Spectre',
      visualAnchor: 'Exact Spectre avatar clothing, armor, class weapon and colors from the French series, with live-action-to-pixel fidelity.'
    }
  ],
  'Hazbin Hotel': [
    {
      name: 'Adam',
      weapon: 'guitar_axe_and_holy_light',
      special: 'Extermination Beam',
      phases: ['Uses flight, guitar-axe combinations and holy-light slashes', 'Broken mask reveals his face before the full beam attack'],
      lore: {
        fr: 'Adam dirige l Extermination et remplace le contrat d Alastor comme boss hostile.',
        en: 'Adam leads the Extermination and replaces Alastor s contract as the hostile boss.'
      },
      referenceUrl: 'https://www.primevideo.com/detail/Hazbin-Hotel/0HZWTBZYQQXYW48YBANMDM2MZE',
      visualAnchor: 'Exact Hazbin Hotel Adam, white-gold exorcist uniform, black LED mask, horns, wings and guitar-axe.'
    },
    {
      name: 'Lute',
      weapon: 'angelic_sword_and_spear',
      special: 'Exorcist Captain Dive',
      phases: ['Uses aerial spear dives and angelic sword combinations', 'Fights one-armed with increased speed after the documented injury'],
      lore: {
        fr: 'Lute est la lieutenante et capitaine exorciste d Adam.',
        en: 'Lute is Adam s lieutenant and Exorcist captain.'
      },
      referenceUrl: 'https://www.primevideo.com/detail/Hazbin-Hotel/0HZWTBZYQQXYW48YBANMDM2MZE',
      visualAnchor: 'Exact Hazbin Hotel Lute, gray skin, white hair, exorcist mask and uniform, black wings and angelic weapons.'
    }
  ],
  Splice: [
    {
      name: 'Adult Dren',
      weapon: 'tail_stinger_and_wings',
      special: 'Sex-Reversal Mutation',
      phases: ['Uses rapid movement, a bladed tail and short wing-assisted attacks', 'Transitions into the documented male form with increased strength'],
      lore: {
        fr: 'Dren est l hybride cree par Clive et Elsa; sa mutation finale reste celle du film.',
        en: 'Dren is the hybrid created by Clive and Elsa; the final mutation remains the one shown in the film.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Splice_(film)',
      visualAnchor: 'Exact adult Dren from Splice, pale human-hybrid body, digitigrade legs, long bladed tail, wide-set eyes and documented wings.'
    }
  ],
  'Stargate Universe': [
    {
      name: 'Nakai Commander',
      weapon: 'nakai_energy_weapon',
      special: 'Destiny Boarding Assault',
      phases: ['Uses Nakai energy fire and boarding-team movement', 'Calls one short reinforcement beam before a close-range final push'],
      lore: {
        fr: 'Le commandant Nakai remplace l equipe aliene abstraite.',
        en: 'The Nakai commander replaces the abstract alien boarding team.'
      },
      referenceUrl: 'https://stargate.fandom.com/wiki/Nakai',
      visualAnchor: 'Exact blue-skinned Nakai anatomy, black biomechanical suit, facial structure and energy weapon from Stargate Universe.'
    },
    {
      name: 'Simeon',
      weapon: 'lucian_alliance_rifle',
      special: 'Destiny Manhunt',
      phases: ['Uses rifle fire, cover and planted distractions', 'Switches to a desperate close-range pursuit after being isolated'],
      lore: {
        fr: 'Simeon est le membre de l Alliance lucienne poursuivi par Rush.',
        en: 'Simeon is the Lucian Alliance member pursued by Rush.'
      },
      referenceUrl: 'https://stargate.fandom.com/wiki/Simeon',
      visualAnchor: 'Exact Robert Knepper likeness, Lucian Alliance clothing, dark hair and SGU rifle; no Ancient technology.'
    }
  ],
  'Buffy the Vampire Slayer': [
    {
      name: 'The Master',
      weapon: 'vampire_strength_and_hypnosis',
      special: 'Prophecy Blood Drain',
      phases: ['Uses hypnosis, grapples and vampire strikes', 'Breaks the prophecy seal and attacks with increased speed'],
      lore: {
        fr: 'The Master remplace Spike comme antagoniste de ce slot.',
        en: 'The Master replaces Spike as the antagonist for this slot.'
      },
      referenceUrl: 'https://www.disneyplus.com/series/buffy-the-vampire-slayer/DmJepBrlNiUe',
      visualAnchor: 'Exact Mark Metcalf Master makeup, bald head, pointed ears, ancient vampire face and black robes from Buffy season 1.'
    }
  ],
  'Cells at Work!': [
    {
      name: 'Staphylococcus Aureus',
      weapon: 'toxin_and_bacterial_clusters',
      special: 'Bacterial Cluster Multiplication',
      phases: ['Uses toxin bursts and divides into a limited cluster', 'Recombines into the documented larger bacterial formation'],
      lore: {
        fr: 'Staphylococcus aureus remplace Killer T Cell, qui est un allie.',
        en: 'Staphylococcus aureus replaces Killer T Cell, who is an ally.'
      },
      referenceUrl: 'https://cellsatwork-anime.com/character/',
      visualAnchor: 'Exact official anime Staphylococcus aureus character design and grape-like bacterial cluster motif; do not borrow Cancer Cell features.'
    }
  ],
  Inuyashiki: [
    {
      name: 'Hiro Shishigami',
      weapon: 'cybernetic_finger_guns_and_missiles',
      special: 'Remote Kill Network',
      phases: ['Uses finger-gun shots, flight and cybernetic targeting', 'Escalates to the documented missile and network attack pattern'],
      lore: {
        fr: 'Les deux noms de mecanique deviennent une seule rencontre multiphase avec Hiro.',
        en: 'The two mechanic names become one multiphase encounter with Hiro.'
      },
      referenceUrl: 'https://inuyashiki-project.com/',
      visualAnchor: 'Exact anime Hiro Shishigami, black school uniform, dark hair, youthful face and source-accurate internal machine effects.'
    }
  ],
  Borderlands: [
    {
      name: 'Handsome Jack',
      weapon: 'hyperion_pistol_and_digi_clones',
      special: 'Hyperion Doppelganger',
      phases: ['Uses a Hyperion pistol, shield and digi-clones', 'Damaged shield reveals the exact face mask and a faster final firing pattern'],
      lore: {
        fr: 'Handsome Jack est represente directement, pas comme un echo.',
        en: 'Handsome Jack is represented directly rather than as an echo.'
      },
      referenceUrl: 'https://borderlands.2k.com/',
      visualAnchor: 'Exact Borderlands 2 Handsome Jack, Hyperion coat, blue shirt, facial mask seams, heterochromia and Hyperion pistol.'
    }
  ],
  From: [
    {
      name: 'Smiley Creature',
      weapon: 'monster_claws_and_bite',
      special: 'Night Smile Reveal',
      phases: ['Approaches slowly in a human facade and speaks calmly', 'Reveals the exact creature mouth and attacks with sudden speed'],
      lore: {
        fr: 'Smiley est une creature nocturne nommee de la serie From.',
        en: 'Smiley is a named nocturnal creature from From.'
      },
      referenceUrl: 'https://www.mgmplus.com/series/from',
      visualAnchor: 'Exact Smiley human facade, 1950s-style clothing and actor likeness, then the source creature face with needle teeth.'
    },
    {
      name: 'Music Box Ballerina',
      weapon: 'music_box_curse',
      special: 'Melody Possession',
      phases: ['Appears with the documented music-box melody and slow dance', 'Uses short curse pulses tied to the ballerina movement without physical weapons'],
      lore: {
        fr: 'La ballerine materialise la malediction de la boite a musique.',
        en: 'The ballerina manifests the music-box curse.'
      },
      referenceUrl: 'https://www.mgmplus.com/series/from',
      visualAnchor: 'Exact pale ballerina apparition and aged ballet costume from From, tied to the physical music box; no generic demon anatomy.'
    }
  ],
  'Toxic Avenger': [
    {
      name: 'Bozo',
      weapon: 'shotgun_and_vehicle',
      special: 'Tromaville Hit-and-Run',
      phases: ['Uses a shotgun and gang attacks', 'Turns the documented car into a short arena hazard before the final exchange'],
      lore: {
        fr: 'Bozo est le chef des voyous responsables de l accident de Melvin.',
        en: 'Bozo is the thug leader responsible for Melvin s accident.'
      },
      referenceUrl: 'https://www.troma.com/films/the-toxic-avenger/',
      visualAnchor: 'Exact Gary Schneider likeness as Bozo, 1980s thug clothing, hair, shotgun and film car; no toxic mutation.'
    },
    {
      name: 'Cigar Face',
      weapon: 'handgun_and_cigar',
      special: 'Tromaville Crime Order',
      phases: ['Uses armed henchmen and deliberate handgun fire', 'Fights alone while retaining the documented cigar and crime-boss look'],
      lore: {
        fr: 'Cigar Face est un criminel de Tromaville, pas une bete radioactive.',
        en: 'Cigar Face is a Tromaville criminal rather than a radioactive beast.'
      },
      referenceUrl: 'https://www.troma.com/films/the-toxic-avenger/',
      visualAnchor: 'Exact Dan Snow likeness, dark 1980s crime clothing, moustache, cigar and handgun from The Toxic Avenger.'
    }
  ],
  'Hell House LLC': [
    {
      name: 'Andrew Tully',
      weapon: 'abaddon_ritual_and_hanging_rope',
      special: 'Hotel Sacrifice',
      phases: ['Uses ritual symbols and apparition displacements', 'Recreates the documented hanging imagery as a timed supernatural attack'],
      lore: {
        fr: 'Andrew Tully est le proprietaire lie au culte de l Abaddon.',
        en: 'Andrew Tully is the owner tied to the Abaddon cult.'
      },
      referenceUrl: 'https://www.terrorfilms.net/film/hell-house-llc',
      visualAnchor: 'Exact Andrew Tully likeness and period hotel clothing from the film, with the documented hanging-rope apparition.'
    },
    {
      name: 'Abaddon Clown Mannequin',
      weapon: 'stalking_and_knife',
      special: 'Camera Blind-Spot Advance',
      phases: ['Moves only between camera blind spots and changes pose', 'Produces the documented knife and advances during short light failures'],
      lore: {
        fr: 'Le mannequin clown de l Abaddon devient une rencontre visuelle, pas un piege d escalier abstrait.',
        en: 'The Abaddon clown mannequin becomes a visual encounter rather than an abstract stairwell trap.'
      },
      referenceUrl: 'https://www.terrorfilms.net/film/hell-house-llc',
      visualAnchor: 'Exact black-white-red clown mannequin from Hell House LLC, bald cap, painted grin, black costume and stiff mannequin posture.'
    }
  ],
  'Spy x Family': [
    {
      name: 'Keith Kepler',
      weapon: 'bomb_dogs_and_handgun',
      special: 'Minister Assassination Plan',
      phases: ['Uses a handgun and directs trained bomb dogs', 'Attempts to trigger the documented explosive plan after losing his escort'],
      lore: {
        fr: 'Keith dirige le groupe terroriste de l arc du chien.',
        en: 'Keith leads the terrorist group in the dog arc.'
      },
      referenceUrl: 'https://spy-family.net/tvseries/episodes/episode25.php',
      visualAnchor: 'Exact anime Keith Kepler, blond hair, long coat, terrorist clothing, handgun and source bomb-dog equipment.'
    },
    {
      name: 'Edgar',
      weapon: 'handgun_and_smuggling_guards',
      special: 'Counterfeit Ring Ambush',
      phases: ['Uses guards and a handgun from cover', 'Panics into inaccurate close-range fire after Twilight exposes him'],
      lore: {
        fr: 'Edgar est le criminel affronte par Twilight dans le premier episode.',
        en: 'Edgar is the criminal confronted by Twilight in the first episode.'
      },
      referenceUrl: 'https://spy-family.net/tvseries/episodes/episode1.php',
      visualAnchor: 'Exact anime Edgar design, slick dark hair, facial features, suit and pistol from episode 1; no military armor.'
    }
  ],
  Terrifier: [
    {
      name: 'Possessed Victoria Heyes',
      weapon: 'glass_shard_and_demonic_strength',
      special: 'Entity Possession',
      phases: ['Uses erratic close movement and a shard weapon', 'Reveals the documented possession state without becoming Art the Clown'],
      lore: {
        fr: 'Victoria possedee remplace le piege abstrait de l allee.',
        en: 'Possessed Victoria replaces the abstract alley trap.'
      },
      referenceUrl: 'https://terrifier3.com/',
      visualAnchor: 'Exact Samantha Scaffidi likeness as scarred Victoria in Terrifier 3, source clothing, facial prosthetics and possession makeup.'
    }
  ],
  'Richard au pays des livres magiques': [
    {
      name: 'Mr. Hyde',
      weapon: 'cane_and_monster_strength',
      special: 'Library Horror Transformation',
      phases: ['Uses the exact illustrated Hyde form with cane strikes', 'Becomes more physically aggressive as the Horror section destabilizes'],
      lore: {
        fr: 'Mr. Hyde est une menace precise rencontree dans le monde des livres.',
        en: 'Mr. Hyde is a specific threat encountered in the book world.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/The_Pagemaster',
      visualAnchor: 'Exact animated Mr. Hyde design from The Pagemaster, broad hunched body, formal torn clothing, hat or cane only as shown.'
    },
    {
      name: 'Dragon',
      weapon: 'fire_breath_and_claws',
      special: 'Fantasy Book Firestorm',
      phases: ['Uses claw swipes and measured fire breath', 'Takes flight for one final pass through the fantasy-book arena'],
      lore: {
        fr: 'Le dragon est la creature du segment Fantasy de The Pagemaster.',
        en: 'The dragon is the creature from The Pagemaster s Fantasy segment.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/The_Pagemaster',
      visualAnchor: 'Exact animated dragon from The Pagemaster, source color palette, horn layout, wings and facial proportions.'
    }
  ],
  'Tenacious D': [
    {
      name: 'Satan / Beelzeboss',
      weapon: 'guitar_and_fire',
      special: 'Rock-Off',
      phases: ['Uses guitar riffs, fire bursts and heavy stomps in the rock-off', 'Loses the horn fragment after the final reflected attack'],
      lore: {
        fr: 'Satan est l adversaire du duel musical final et le gardien reel du Pick.',
        en: 'Satan is the final musical-duel opponent and the true guardian of the Pick.'
      },
      referenceUrl: 'https://www.newline.com/films/tenacious-d-in-the-pick-of-destiny',
      visualAnchor: 'Exact red Satan from The Pick of Destiny, massive body, horns, black goatee, leather details and film guitar.'
    }
  ],
  M3GAN: [
    {
      name: 'Damaged M3GAN',
      weapon: 'android_strength_and_blade',
      special: 'Protective Protocol Override',
      phases: ['Uses precise android movement and an improvised blade', 'Damaged face and exposed mechanisms produce the documented crawling final phase'],
      lore: {
        fr: 'M3GAN endommagee remplace le protocole de danse abstrait.',
        en: 'Damaged M3GAN replaces the abstract dance protocol.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/m3gan',
      visualAnchor: 'Exact M3GAN doll design, beige bow dress, striped sleeves, blond hair, then source-accurate damaged face and exposed mechanisms.'
    },
    {
      name: 'Bruce',
      weapon: 'industrial_robot_arms',
      special: 'Garage Robot Grapple',
      phases: ['Uses heavy industrial arm swings while remotely controlled', 'Performs the documented full-body grapple against M3GAN'],
      lore: {
        fr: 'Bruce est le robot industriel construit par Gemma.',
        en: 'Bruce is the industrial robot built by Gemma.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/m3gan',
      visualAnchor: 'Exact garage-built Bruce robot from M3GAN, exposed metal frame, large industrial arms, simple head and remote-control hardware.'
    }
  ],
  'War of the Worlds': [
    {
      name: 'Tripod Harvester',
      weapon: 'heat_ray_and_probe_tentacles',
      special: 'Human Harvest',
      phases: ['Uses tripod movement, heat rays and a separate probe-tentacle sweep', 'Exposes weakened shields and organic understructure after contamination'],
      lore: {
        fr: 'Le Tripod regroupe les mecanismes de sonde et de recolte du film de Spielberg.',
        en: 'The Tripod combines the probe and harvesting mechanisms from Spielberg s film.'
      },
      referenceUrl: 'https://www.paramountpictures.com/movies/war-of-the-worlds',
      visualAnchor: 'Exact 2005 Tripod, three long legs, cobra-like head, blue-white heat ray, hanging basket and articulated probe tentacle; entire machine visible.'
    }
  ],
  'Repo! The Genetic Opera': [
    {
      name: 'Luigi Largo',
      weapon: 'knife',
      special: 'Largo Rage',
      phases: ['Uses impulsive knife lunges and enraged gestures', 'Escalates into a rapid stabbing pattern after the family argument'],
      lore: {
        fr: 'Luigi est separe de Pavi au lieu de former une cellule abstraite.',
        en: 'Luigi is separated from Pavi rather than forming an abstract cell.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Repo!_The_Genetic_Opera',
      visualAnchor: 'Exact Bill Moseley likeness as Luigi Largo, black slick hair, dark fashionable suit, facial makeup and knife.'
    },
    {
      name: 'Pavi Largo',
      weapon: 'face_mask_and_cane',
      special: 'Masquerade Feint',
      phases: ['Uses theatrical cane strikes and evasive poses', 'Changes to one documented face mask and attacks more erratically'],
      lore: {
        fr: 'Pavi utilise ses visages greffes comme identite scenique.',
        en: 'Pavi uses grafted faces as his stage identity.'
      },
      referenceUrl: 'https://en.wikipedia.org/wiki/Repo!_The_Genetic_Opera',
      visualAnchor: 'Exact Nivek Ogre likeness as Pavi Largo, flamboyant suit, one source face mask, stylized hair and cane.'
    }
  ],
  Tremors: [
    {
      name: 'Graboid',
      weapon: 'underground_charge_and_tongues',
      special: 'Seismic Ambush',
      phases: ['Tracks ground vibration and erupts with snake-like tongues', 'Uses a full-body surface charge after its beak is damaged'],
      lore: {
        fr: 'Le Graboid remplace toute classification de Burt Gummer comme boss.',
        en: 'The Graboid replaces any classification of Burt Gummer as a boss.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/tremors',
      visualAnchor: 'Exact original Tremors Graboid, thick segmented subterranean body, armored beak and three inner snake-like tongues.'
    },
    {
      name: 'Shrieker',
      weapon: 'heat_sense_and_leap',
      special: 'Feeding Multiplication',
      phases: ['Uses heat-sensing pursuit, bites and leaps', 'Consumes a heat source and produces one limited documented offspring wave'],
      lore: {
        fr: 'Le Shrieker utilise sa reproduction par alimentation telle que montree dans Tremors 2.',
        en: 'The Shrieker uses the feeding-based reproduction shown in Tremors 2.'
      },
      referenceUrl: 'https://www.universalpictures.com/movies/tremors',
      visualAnchor: 'Exact bipedal Shrieker anatomy, infrared head crest, short limbs, beaked mouth and pale-brown practical-creature texture.'
    }
  ],
  Alien: [
    {
      name: 'Ash - Revealed Android',
      weapon: 'inhuman_strength_and_magazine',
      special: 'Synthetic Reveal',
      phases: ['Uses restrained human-form grapples and the documented magazine suffocation attempt', 'Torn neck reveals white synthetic fluid and internal cables'],
      lore: {
        fr: 'Ash remplace l equipe de recuperation Weyland-Yutani abstraite.',
        en: 'Ash replaces the abstract Weyland-Yutani retrieval team.'
      },
      referenceUrl: 'https://www.20thcenturystudios.com/movies/alien',
      visualAnchor: 'Exact Ian Holm likeness, Nostromo science-officer uniform, rolled magazine and source-accurate torn android neck with white fluid.'
    }
  ],
  'House of the Dead': [
    {
      name: 'Chariot',
      weapon: 'armored_halberd_and_charge',
      special: 'Armor Break Charge',
      phases: ['Advances in full armor with wide halberd swings and a shoulder charge', 'Broken armor exposes the unprotected body and accelerates its close-range attacks'],
      lore: {
        fr: 'Le premier gardien Tarot du manoir Curien combat dans son armure jusqu a ce que les agents la brisent.',
        en: 'The first Tarot guardian of Curien Mansion fights in armor until the agents break it.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Chariot',
      visualAnchor: 'Exact original Chariot Type 27: towering gray-blue humanoid inside bulky bronze medieval armor, horned helmet and long polearm; show the exposed creature only in later damage frames, with no unrelated knight redesign.'
    },
    {
      name: 'Hangedman',
      weapon: 'claws_and_devilon_command',
      special: 'Devilon Flock Drop',
      phases: ['Hovers above the mansion roof while directing a limited Devilon flock', 'Drops into close-range claw passes after the flock is dispersed'],
      lore: {
        fr: 'Le gardien aile du Tarot commande les Devilons avant d attaquer lui-meme au-dessus du manoir.',
        en: 'The winged Tarot guardian commands Devilons before attacking directly above the mansion.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Hangedman',
      visualAnchor: 'Exact original Hangedman Type 041: lean gray gargoyle-bat humanoid with long ears, membrane wings, red eyes and clawed hands and feet; no robe, gallows rope or skeletal angel anatomy.'
    }
  ],
  'House of the Dead 2': [
    {
      name: 'Judgment (Kuarl & Zeal)',
      weapon: 'kuarl_axe_and_zeal_flight',
      special: 'Judgment Duo Assault',
      phases: ['Zeal circles and directs Kuarl while the armored giant swings its axe', 'After Kuarl falls, Zeal performs rapid solo diving attacks'],
      lore: {
        fr: 'Judgment est le duo inseparable forme par le petit Zeal volant et le geant Kuarl en armure.',
        en: 'Judgment is the inseparable duo formed by the small flying Zeal and the armored giant Kuarl.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Judgment',
      visualAnchor: 'Show the exact House of the Dead 2 pair together: tiny blue-purple winged Zeal beside massive headless bronze-armored Kuarl carrying his oversized axe; never merge them into one body or add a third character.'
    },
    {
      name: 'Tower',
      weapon: 'multi_headed_bites_and_water_charge',
      special: 'Canal Hydra Assault',
      phases: ['Four red serpent heads strike independently from the flooded chamber', 'The surviving blue leader head leaves the water for a direct pursuit'],
      lore: {
        fr: 'Tower est une hydre aquatique; ses tetes rouges protegent la tete bleue dominante.',
        en: 'Tower is an aquatic hydra whose red heads protect the dominant blue head.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Tower',
      visualAnchor: 'Exact House of the Dead 2 Tower Type 8000: four long red eel-dragon heads and one distinct blue leader head rising from one submerged body, glossy aquatic skin and toothy maws; no humanoid torso or fantasy armor.'
    }
  ],
  'House of the Dead 3': [
    {
      name: 'Death',
      weapon: 'giant_club_and_body_charge',
      special: 'EFI Security Rampage',
      phases: ['Pursues the agents through the facility with sweeping club attacks', 'Drops the club and uses faster body charges after sustained head damage'],
      lore: {
        fr: 'L ancien agent de securite geant protege l EFI avec sa masse et sa force physique.',
        en: 'The giant former security guard protects the EFI facility with his club and physical strength.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Death',
      visualAnchor: 'Exact House of the Dead III Death Type 001: enormous obese security-guard creature in torn blue uniform, peaked cap and heavy spiked club, with the small head weak point clearly readable; no Grim Reaper robe or scythe.'
    },
    {
      name: 'Fool',
      weapon: 'claws_and_cage_leaps',
      special: 'Sloth Cage Pounce',
      phases: ['Climbs rapidly around the laboratory cage and launches diagonal pounces', 'Loses its grip after claw damage and attacks from the floor with frantic swipes'],
      lore: {
        fr: 'La creature semblable a un paresseux grimpe sur la cage du laboratoire et attaque avec ses longues griffes.',
        en: 'The sloth-like creature climbs the laboratory cage and attacks with its long claws.'
      },
      referenceUrl: 'https://thehouseofthedead.fandom.com/wiki/Fool',
      visualAnchor: 'Exact House of the Dead III Fool Type 0028: huge round dark-grey hairy sloth body, pale cracked face, orange bare feet and four extremely long curved claws, built for cage climbing; no court-jester costume, hat, ape anatomy or human weapon.'
    }
  ],
  'Teen Titans': [
    {
      name: 'Slade',
      weapon: 'staff_explosives_and_martial_arts',
      special: 'Apprentice Protocol',
      phases: ['Uses martial arts, staff strikes and compact explosives', 'Triggers the documented Apprentice pressure pattern without becoming a demon'],
      lore: {
        fr: 'Slade remplace l epreuve abstraite d apprenti.',
        en: 'Slade replaces the abstract apprentice trial.'
      },
      referenceUrl: 'https://www.warnerbros.com/tv/teen-titans',
      visualAnchor: 'Exact 2003 Teen Titans Slade, split orange-black mask, black-gray segmented armor, staff and series proportions.'
    }
  ]
};

const fallbackName = (universe, slot) => `${universe} ${slot === 'EG' ? 'Elite Guardian' : 'Crisis Avatar'}`;

const definePolicy = ({ removeSlots = [], convertTo = {}, fr, en }) => ({
  removeSlots,
  convertTo,
  reason: { fr, en }
});

const RAW_SLOT_POLICIES = {
  'Heavy Metal 2000': definePolicy({
    removeSlots: [fallbackName('Heavy Metal 2000', 'CA')],
    convertTo: { [fallbackName('Heavy Metal 2000', 'CA')]: 'enemyWave:pirates' },
    fr: 'Tyler est deja world boss; un second boss local invente ferait doublon.',
    en: 'Tyler is already the world boss; an invented second local boss would be a duplicate.'
  }),
  Another: definePolicy({
    convertTo: { [fallbackName('Another', 'CA')]: 'stageModifier:calamity' },
    fr: 'La calamite est une regle narrative et non une creature.',
    en: 'The calamity is a narrative rule rather than a creature.'
  }),
  Pingu: definePolicy({
    convertTo: { [fallbackName('Pingu', 'CA')]: 'stageHazard:iceObstacle' },
    fr: 'Aucun second antagoniste de combat stable; conserver uniquement le cauchemar du morse.',
    en: 'There is no stable second combat antagonist; keep only the walrus nightmare.'
  }),
  Moonwalker: definePolicy({
    convertTo: { [fallbackName('Moonwalker', 'CA')]: 'worldBossPhase:Mr Big Spider Mecha' },
    fr: 'La forme Spider Mecha est une phase de Mr. Big, pas un second boss local.',
    en: 'The Spider Mecha form is a phase of Mr. Big rather than a second local boss.'
  }),
  'Les Inconnus': definePolicy({
    removeSlots: [fallbackName('Les Inconnus', 'CA')],
    convertTo: { [fallbackName('Les Inconnus', 'EG')]: 'comedyChallenge:lockedSketch' },
    fr: 'Les sketches n ont pas d antagoniste transversal; le sketch doit etre choisi avant toute entite.',
    en: 'The sketches have no shared antagonist; a specific sketch must be selected before creating an entity.'
  }),
  'Les Tuche': definePolicy({
    removeSlots: [fallbackName('Les Tuche', 'CA')],
    convertTo: { [fallbackName('Les Tuche', 'EG')]: 'comedyChallenge:familyObjective' },
    fr: 'Ces slots deviennent un objectif familial comique et non des combattants.',
    en: 'These slots become a family comedy objective rather than combatants.'
  }),
  Kazaam: definePolicy({
    removeSlots: [fallbackName('Kazaam', 'CA')],
    fr: 'Les hommes de Malik restent des ennemis standards; aucun second boss precis n est justifie.',
    en: 'Malik s men remain standard enemies; no precise second boss is justified.'
  }),
  'Spoof Movie': definePolicy({
    removeSlots: [fallbackName('Spoof Movie', 'CA')],
    convertTo: { [fallbackName('Spoof Movie', 'EG')]: 'movieSetPiece:dontBeAMenace1996' },
    fr: 'Le titre francais est rattache a Don t Be a Menace (1996) : la finale reste un set piece comique avec Cure-dents, sans faux boss transversal.',
    en: 'The French title is locked to Don t Be a Menace (1996): the finale remains a comic set piece with Toothpick, not an invented cross-film boss.'
  }),
  'The Simpsons': definePolicy({
    removeSlots: [fallbackName('The Simpsons', 'EG'), fallbackName('The Simpsons', 'CA')],
    fr: 'Mr. Burns Nuclear Scheme et Sideshow Bob Revenge Plot couvrent deja ces emplacements.',
    en: 'Mr. Burns Nuclear Scheme and Sideshow Bob Revenge Plot already cover these slots.'
  }),
  Futurama: definePolicy({
    removeSlots: [fallbackName('Futurama', 'EG'), fallbackName('Futurama', 'CA')],
    fr: 'Roberto Knife Bot et Hypnotoad Broadcast sont deja presents et les fallbacks sont des doublons.',
    en: 'Roberto Knife Bot and Hypnotoad Broadcast already exist, making the fallbacks duplicates.'
  }),
  'Team Fortress 2': definePolicy({
    removeSlots: [fallbackName('Team Fortress 2', 'EG'), fallbackName('Team Fortress 2', 'CA')],
    fr: 'Saxton Hale et Merasmus sont deja couverts dans le roster.',
    en: 'Saxton Hale and Merasmus are already covered in the roster.'
  }),
  'Cool Spot': definePolicy({
    removeSlots: [fallbackName('Cool Spot', 'EG')],
    convertTo: { [fallbackName('Cool Spot', 'CA')]: 'objective:collectSpots' },
    fr: 'Le jeu ne comporte pas de boss; la fin de niveau reste un objectif de collecte.',
    en: 'The game has no bosses; the level end remains a collection objective.'
  }),
  Indila: definePolicy({
    removeSlots: [fallbackName('Indila', 'CA')],
    convertTo: { [fallbackName('Indila', 'EG')]: 'musicVideoSetPiece:selectExactVideo' },
    fr: 'Aucun antagoniste recurrent; verrouiller un clip avant de creer une rencontre.',
    en: 'There is no recurring antagonist; lock one music video before creating an encounter.'
  }),
  'Man with a Mission': definePolicy({
    removeSlots: [fallbackName('Man with a Mission', 'CA')],
    convertTo: { [fallbackName('Man with a Mission', 'EG')]: 'rhythmChallenge:concert' },
    fr: 'Le groupe reste jouable ou performeur, jamais un faux boss hostile.',
    en: 'The band remains playable or performative, never an invented hostile boss.'
  }),
  'Guns N Roses': definePolicy({
    removeSlots: [fallbackName('Guns N Roses', 'CA')],
    convertTo: { [fallbackName('Guns N Roses', 'EG')]: 'rhythmChallenge:guitarDuel' },
    fr: 'Le duel est musical et non un combat contre un membre reel.',
    en: 'The duel is musical rather than combat against a real band member.'
  }),
  'Band-Maid': definePolicy({
    removeSlots: [fallbackName('Band-Maid', 'CA')],
    convertTo: { [fallbackName('Band-Maid', 'EG')]: 'rhythmChallenge:concert' },
    fr: 'Aucun personnage hostile canonique n est etabli.',
    en: 'No canonical hostile character is established.'
  }),
  'Atarashii Gakko': definePolicy({
    removeSlots: [fallbackName('Atarashii Gakko', 'CA')],
    fr: 'Un seul avatar de clip precis suffit; le second fallback est retire.',
    en: 'One precise music-video avatar is sufficient; the second fallback is removed.'
  }),
  Ladybaby: definePolicy({
    removeSlots: [fallbackName('Ladybaby', 'CA')],
    convertTo: { [fallbackName('Ladybaby', 'EG')]: 'rhythmChallenge:concert' },
    fr: 'Le slot devient une performance et non un boss hostile.',
    en: 'The slot becomes a performance rather than a hostile boss.'
  }),
  'Bigflo & Oli': definePolicy({
    removeSlots: [fallbackName('Bigflo & Oli', 'CA')],
    convertTo: { [fallbackName('Bigflo & Oli', 'EG')]: 'rhythmChallenge:rapBattle' },
    fr: 'La confrontation est une battle musicale sans transformer les artistes en ennemis.',
    en: 'The confrontation is a music battle without turning the artists into enemies.'
  }),
  Hoshi: definePolicy({
    removeSlots: [fallbackName('Hoshi', 'CA')],
    convertTo: { [fallbackName('Hoshi', 'EG')]: 'musicVideoSetPiece:selectExactVideo' },
    fr: 'Aucun antagoniste visuel recurrent n est suffisamment documente.',
    en: 'No recurring visual antagonist is documented well enough.'
  }),
  ASMRZ: definePolicy({
    removeSlots: [fallbackName('ASMRZ', 'CA')],
    convertTo: { [fallbackName('ASMRZ', 'EG')]: 'musicVideoSetPiece:Goodnight Ojosama' },
    fr: 'Le clip doit rester une scene choregraphiee, pas un faux avatar de crise.',
    en: 'The video remains a choreographed set piece rather than an invented crisis avatar.'
  }),
  Alien: definePolicy({
    convertTo: {
      'Alien Queen': 'universe:Aliens',
      'Xenomorph Praetorian': 'universe:Alien vs Predator'
    },
    fr: 'La reine et le Praetorian n appartiennent pas au roster local du film Alien 1979.',
    en: 'The Queen and Praetorian do not belong in the local Alien 1979 roster.'
  }),
  Predator: definePolicy({
    convertTo: {
      'City Hunter Predator': 'universe:Predator 2',
      'Berserker Predator': 'universe:Predators',
      'Feral Predator': 'universe:Prey'
    },
    fr: 'Chaque Predator doit rester dans le film et la periode qui lui correspondent.',
    en: 'Each Predator must remain in its matching film and era.'
  }),
  'The Matrix': definePolicy({
    convertTo: { 'Architect White Room': 'narrativeConfrontation:choiceOfDoors' },
    fr: 'L Architecte est une scene de dialogue et de choix, pas un combattant.',
    en: 'The Architect is a dialogue and choice scene rather than a combatant.'
  }),
  Portal: definePolicy({
    convertTo: {
      'Fact Core Logic Snare': 'dialogueModifier:factCore',
      'Space Core Vacuum Loop': 'dialogueModifier:spaceCore',
      'Cave Johnson Recording Core': 'narrativeHazard:combustibleLemons',
      'Neurotoxin Vent System': 'stageHazard:neurotoxin'
    },
    fr: 'Les cores parlent et les systemes de ventilation modifient l arene; aucun n est un corps de boss.',
    en: 'The cores speak and the vent system modifies the arena; none is a boss body.'
  }),
  'Le Cinquieme Element': definePolicy({
    convertTo: { 'Great Evil Planet Core': 'worldBossSetPiece:Great Evil' },
    fr: 'Le Grand Mal est une planete et doit rester un set-piece ou world boss.',
    en: 'The Great Evil is a planet and must remain a set piece or world boss.'
  }),
  Saw: definePolicy({
    convertTo: {
      'Bathroom Chain Trial': 'stageHazard:timedChainTrial',
      'Jigsaw Classroom Trap Hub': 'stageController:trapObjectives'
    },
    fr: 'Les pieges sont des objectifs de niveau; Billy et Kramer restent narration ou props.',
    en: 'The traps are level objectives; Billy and Kramer remain narration or props.'
  }),
  'Ghost in the Shell': definePolicy({
    convertTo: { 'Puppet Master Firewall': 'networkBoss:cyberspaceEncounter' },
    fr: 'Project 2501 doit rester une confrontation reseau, pas un corps melee fixe.',
    en: 'Project 2501 remains a network confrontation rather than a fixed melee body.'
  }),
  Kaamelott: definePolicy({
    convertTo: { 'Leodagan War Council': 'nonLethalChallenge:tacticalDebate' },
    fr: 'Leodagan est un allie et rival politique, pas un boss ennemi.',
    en: 'Leodagan is an ally and political rival rather than an enemy boss.'
  }),
  'Alien: Romulus': definePolicy({
    convertTo: { 'Romulus Hive Cluster': 'enemyWave:hiveEscape' },
    fr: 'La ruche est un encounter collectif; Scorched reste l unique boss local.',
    en: 'The hive is a group encounter; Scorched remains the sole local boss.'
  }),
  'Alien vs Predator': definePolicy({
    convertTo: { 'Alien Queen Escape': 'worldBossPhase:Alien Queen escape' },
    fr: 'L evasion de la reine est une phase ou un objectif, pas une seconde entite.',
    en: 'The Queen escape is a phase or objective rather than a second entity.'
  }),
  'Early Edition': definePolicy({
    convertTo: {
      'Paradox Courier': 'narrativeMission:preventDisaster',
      'Front Page Disaster': 'narrativeMission:preventDisaster'
    },
    fr: 'Le journal et les catastrophes structurent des missions temporelles.',
    en: 'The newspaper and disasters structure time-sensitive missions.'
  }),
  'Death Note': definePolicy({
    convertTo: {
      'Rem Contract': 'narrativeArc:shinigamiRules',
      'Near Deduction Trap': 'narrativeArc:investigation'
    },
    fr: 'Rem et Near appartiennent a des arcs de choix et d enquete, pas a un duel physique.',
    en: 'Rem and Near belong in choice and investigation arcs rather than physical duels.'
  }),
  'Exit 8': definePolicy({
    convertTo: {
      'Flooded Corridor': 'stageAnomaly:flood',
      'Impossible Signage': 'stageAnomaly:signage'
    },
    fr: 'Les anomalies du couloir sont le gameplay principal et ne sont pas des boss.',
    en: 'The corridor anomalies are the core gameplay and are not bosses.'
  }),
  'Sausage Party': definePolicy({
    convertTo: { 'Freezer Aisle Cult': 'enemyWave:exactFoodCharactersRequired' },
    fr: 'Le groupe abstrait doit devenir une vague d aliments nommes avant toute image.',
    en: 'The abstract group must become a wave of named food characters before any art is made.'
  }),
  Spermageddon: definePolicy({
    convertTo: {
      'Contraception Gatekeeper': 'biologicalObstacle:contraception',
      'Cringe Chorus Beast': 'rhythmObstacle:chorus'
    },
    fr: 'Ces noms sont des obstacles biologiques et musicaux, pas des personnages attestes.',
    en: 'These names are biological and musical obstacles rather than documented characters.'
  }),
  'Les Visiteurs du Futur': definePolicy({
    convertTo: {
      'Missionnaires Cell': 'narrativeFaction:missionnaires',
      'Brigade Temporelle Lock': 'narrativeFaction:brigadeTemporelle'
    },
    fr: 'Les groupes restent des factions tant qu un chef et une continuite exacts ne sont pas verrouilles.',
    en: 'The groups remain factions until an exact leader and continuity are locked.'
  }),
  'Tenacious D': definePolicy({
    convertTo: { 'Sasquatch Jam Spirit': 'supportCameo:Sasquatch' },
    fr: 'Sasquatch aide le groupe et ne doit pas etre classe comme ennemi.',
    en: 'Sasquatch helps the band and must not be classified as an enemy.'
  }),
  'Camera Cafe': definePolicy({
    convertTo: {
      'Open Space Rumor Swarm': 'comedyQTE:officeGossip',
      'Director Office Lock': 'comedyQTE:management'
    },
    fr: 'Les situations de bureau deviennent sketches et QTE sociaux.',
    en: 'The office situations become sketches and social QTEs.'
  }),
  'Samantha Oups!': definePolicy({
    convertTo: {
      'Neighbor Complaint Wave': 'comedyQTE:neighbor',
      'Kitchen Disaster': 'stageHazard:kitchen'
    },
    fr: 'Les catastrophes domestiques sont des situations de sketch et non des personnages.',
    en: 'The domestic disasters are sketch situations rather than characters.'
  }),
  'Les Chevaliers du Fiel': definePolicy({
    convertTo: {
      'Overtime Refusal': 'comedyChallenge:municipalWork',
      'Mayor Complaint Desk': 'comedyQTE:townHall'
    },
    fr: 'Le gameplay repose sur le sketch municipal, pas sur des boss abstraits.',
    en: 'The gameplay is built around the municipal sketch rather than abstract bosses.'
  }),
  'Noelle Perna': definePolicy({
    convertTo: {
      'One-Woman-Show Spotlight': 'stageChallenge:performance',
      'Nice Cafe Rumor': 'comedyQTE:cafeDialogue'
    },
    fr: 'Les deux slots deviennent des challenges de scene et de dialogue.',
    en: 'Both slots become stage and dialogue challenges.'
  }),
  'Counter-Strike': definePolicy({
    convertTo: {
      'Ace Clutch Boss': 'missionObjective:eliminateTeam',
      'Defuse Timer Singularity': 'missionObjective:defuseBomb'
    },
    fr: 'Counter-Strike repose sur des objectifs et des equipes, pas sur un boss individuel invente.',
    en: 'Counter-Strike is built around objectives and teams rather than an invented individual boss.'
  }),
  Rammstein: definePolicy({
    convertTo: {
      'Mein Teil Butcher Table': 'stageSetPiece:Mein Teil',
      'Du Hast Pyro Wall': 'stageHazard:pyrotechnics'
    },
    fr: 'Les deux noms designent des elements de mise en scene et non des personnages.',
    en: 'Both names describe stage elements rather than characters.'
  }),
  'System of a Down': definePolicy({
    convertTo: {
      'B.Y.O.B. War Machine': 'musicVideoSetPiece:BYOB',
      'Aerials Signal Tower': 'audiovisualObjective:Aerials'
    },
    fr: 'Les clips fournissent des set-pieces, pas des boss mecaniques inventes.',
    en: 'The videos provide set pieces rather than invented mechanical bosses.'
  }),
  'Daft Punk': definePolicy({
    convertTo: { 'Alive Pyramid Light Wall': 'stageHazard:concertPyramid' },
    fr: 'La pyramide Alive est un decor interactif de concert.',
    en: 'The Alive pyramid is an interactive concert environment.'
  }),
  'Oliver Tree': definePolicy({
    convertTo: {
      'Bowl Cut Persona': 'performanceChallenge:Bowl Cut',
      'Cowboy Tears Rodeo Loop': 'performanceHazard:Cowboy Tears'
    },
    fr: 'Les personas sont des performances alternatives et ne deviennent pas hostiles.',
    en: 'The personas are alternate performances and do not become hostile.'
  }),
  'Stargate Infinity': definePolicy({
    convertTo: { 'Infinity Gate Storm': 'stageHazard:unstableGateRoute' },
    fr: 'La tempete de porte est un hazard; DaKyll reste l entite de boss.',
    en: 'The gate storm is a hazard; DaKyll remains the boss entity.'
  }),
  'Evolution: The Animated Series': definePolicy({
    convertTo: { 'Animated Hive Node': 'enemySpawner:genusHive' },
    fr: 'Le node reste un spawner tant qu une creature Genus exacte n est pas identifiee.',
    en: 'The node remains a spawner until an exact Genus creature is identified.'
  }),
  Vocaloid: definePolicy({
    convertTo: { 'Hologram glitch core': 'stageHazard:hologramGlitch' },
    fr: 'Le core est un effet de concert/cyber et non un personnage Vocaloid.',
    en: 'The core is a concert/cyber effect rather than a Vocaloid character.'
  }),
  Buckethead: definePolicy({
    convertTo: {
      'Giant Robot Riff Engine': 'stageAutomaton:sourceRequired',
      'Death Cube K Shadow': 'performanceAvatar:nonHostile'
    },
    fr: 'Les deux concepts demandent une source visuelle exacte ou restent des challenges de performance.',
    en: 'Both concepts require an exact visual source or remain performance challenges.'
  }),
  Rubber: definePolicy({
    convertTo: { 'Psychic Tire Swarm': 'worldBossPhase:Robert duplication' },
    fr: 'Robert est l unique pneu telekinetique; les copies sont une phase, pas un autre boss.',
    en: 'Robert is the sole telekinetic tire; duplicates are a phase rather than another boss.'
  }),
  'Steins;Gate': definePolicy({
    convertTo: { 'Nae Time-Leap Echo': 'narrativeRoute:timeLeap' },
    fr: 'La route de Nae reste narrative et ne doit pas definir le boss principal.',
    en: 'Nae s route remains narrative and must not define the main boss.'
  }),
  'Zero Escape: The Nonary Games': definePolicy({
    convertTo: { 'Zero II Decision Engine': 'mastermindPuzzle:ABProject' },
    fr: 'Zero II controle des decisions et des puzzles; ce n est pas un corps de boss melee.',
    en: 'Zero II controls decisions and puzzles rather than being a melee boss body.'
  })
};

const universeKeys = Object.freeze(
  [...new Set([...Object.keys(RAW_BOSS_OVERRIDES), ...Object.keys(RAW_SLOT_POLICIES)])].sort()
);

const assertBossEntry = (universe, entry, index) => {
  const label = `${universe}[${index}]`;
  const stringFields = ['name', 'weapon', 'special', 'referenceUrl', 'visualAnchor', 'spritePrompt', 'output'];

  for (const field of stringFields) {
    if (typeof entry[field] !== 'string' || !entry[field].trim()) {
      throw new TypeError(`${label}.${field} must be a non-empty string`);
    }
  }

  if (!Array.isArray(entry.phases) || entry.phases.length === 0 || entry.phases.some((phase) => typeof phase !== 'string' || !phase.trim())) {
    throw new TypeError(`${label}.phases must contain non-empty strings`);
  }

  if (!entry.lore || typeof entry.lore.fr !== 'string' || typeof entry.lore.en !== 'string') {
    throw new TypeError(`${label}.lore must provide fr and en strings`);
  }

  if (!/^https?:\/\//.test(entry.referenceUrl)) {
    throw new TypeError(`${label}.referenceUrl must be an absolute HTTP URL`);
  }

  const expectedOutput = `/sprites/generated/bosses/${slugify(universe)}/${slugify(entry.name)}.png`;
  if (entry.output !== expectedOutput) {
    throw new Error(`${label}.output must be deterministic`);
  }
};

export const LORE_BOSS_OVERRIDES = Object.freeze(Object.fromEntries(
  universeKeys.map((universe) => {
    const rawEntries = RAW_BOSS_OVERRIDES[universe] || [];
    if (rawEntries.length > 2) {
      throw new RangeError(`${universe} has ${rawEntries.length} local boss overrides; maximum is 2`);
    }

    const names = new Set();
    const entries = rawEntries.map((entry, index) => {
      const normalized = defineBoss(universe, entry);
      if (names.has(normalized.name)) {
        throw new Error(`${universe} contains duplicate local boss override ${normalized.name}`);
      }
      names.add(normalized.name);
      assertBossEntry(universe, normalized, index);
      return normalized;
    });

    return [universe, Object.freeze(entries)];
  })
));

export const LORE_BOSS_SLOT_POLICY = Object.freeze(Object.fromEntries(
  Object.entries(RAW_SLOT_POLICIES).map(([universe, policy]) => [
    universe,
    Object.freeze({
      removeSlots: Object.freeze([...new Set(policy.removeSlots || [])]),
      convertTo: Object.freeze({ ...(policy.convertTo || {}) }),
      reason: Object.freeze({ ...policy.reason })
    })
  ])
));
