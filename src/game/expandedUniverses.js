import { FEATURED_ENEMY_LORE, FEATURED_GEAR_LORE, FEATURED_STAGE_LORE, FEATURED_UNIVERSE_PACKS } from './featuredUniversePacks.js';
import { LORE_BOSS_OVERRIDES, LORE_BOSS_SLOT_POLICY } from './loreBossOverrides.js';
import { getLoreEnemyOverrides } from './loreEnemyOverrides.js';
import {
  getLoreEquipmentOverrides,
  getLoreEventItemOverride,
  getLoreItemPolicy
} from './loreItemOverrides.js';
import {
  getLoreWorldBossOverride,
  getLoreWorldBossPolicy
} from './loreWorldBossOverrides.js';
import { REQUESTED_UNIVERSE_WAVE } from './requestedUniverseWave.js';
import { CANON_ROSTER_WAVE } from './canonRosterWave.js';
import {
  getStageLoreAssetPlan,
  getStageLoreProfile
} from './stageLoreProfiles.js';
import { OC_DLC_UNIVERSES } from './ocDlcPacks.js';
import { getGearShopVisualMetadata } from './gearShopVisualContracts.js';
import { ORIGINAL_UNIVERSE_WAVE } from './originalUniverseWave.js';
import {
  inferNonCombatTrial,
  makeNonCombatPolicyFromThreat
} from './nonCombatTrial.js';

const EXPANDED_STAGE_START_ID = 39;

// Explicit migration list for legacy rosters that represented hazards,
// puzzles, pursuits, containment objectives or comic rivals as combatants.
// True antagonists that are meant to be fought are intentionally absent.
const LEGACY_NON_COMBAT_TRIAL_ROUTES = Object.freeze([
  ['Avatar (Na\'vi)', 'switches', ['avatar_ardmore']],
  ['Avatar (Na\'vi)', 'break-object', ['avatar_seadragon']],
  ['Skyline', 'rescue', ['skyline_brain_collector']],
  ['Skyline', 'hit-targets', ['skyline_harvest_core']],
  ['Skyline', 'switches', ['skyline_mothership']],
  ['Happy Wheels', 'escape', ['hw_spike_strip', 'hw_harpoon_turret', 'hw_landmine', 'hw_wrecking_course', 'hw_harpoon_gauntlet', 'hw_crusher_machine', 'hw_impossible_course']],
  ['Marble Hornets', 'evidence', ['mh_signal_distortion', 'mh_lost_time', 'mh_hostile_archive', 'mh_hooded_figure', 'mh_benedict_loop']],
  ['Marble Hornets', 'escape-evidence', ['mh_operator']],
  ['The Horribly Slow Murderer', 'survive', ['ginosaji_spoon_tap', 'ginosaji_lost_sleep', 'ginosaji_impossible_return', 'ginosaji_home_ambush', 'ginosaji_world_chase', 'ginosaji_tunnel_return', 'ginosaji_endless']],
  ['Sartorius Stedim Biotech', 'switches', ['sartorius_particle_excursion', 'sartorius_seal_loss', 'sartorius_connector_misalignment', 'sartorius_bioburden_excursion', 'sartorius_pressure_cascade', 'sartorius_traceability_break', 'sartorius_contamination_cascade']],
  ['Trololo', 'hit-targets', ['trololo_dead_air', 'trololo_tape_dropout', 'trololo_tempo_drift', 'trololo_broadcast_interference', 'trololo_endless_repeat', 'trololo_silent_stage', 'trololo_global_vocalise']],
  ['Rick Astley', 'hit-targets', ['rick_astley_misleading_hyperlink', 'rick_astley_autoplay_popup', 'rick_astley_comment_spam_bot']],
  ['Rick Astley', 'switches', ['rick_astley_broken_embed', 'rick_astley_claim_gate', 'rick_astley_algorithm_loop', 'rick_astley_infinite_rickroll']],
  ['Nyan Cat', 'escape', ['nyan_cat_space_dog', 'nyan_cat_ufo', 'nyan_cat_meteor', 'nyan_cat_giant_ufo', 'nyan_cat_meteor_swarm', 'nyan_cat_candy_vacuum', 'nyan_cat_tac_nayn']],
  ['SCP Foundation', 'switches', ['scp_foundation_scp_049', 'scp_foundation_scp_939', 'scp_foundation_scp_008', 'scp_foundation_scp_096', 'scp_foundation_scp_106', 'scp_foundation_scp_079', 'scp_foundation_scp_682']],
  ['Mr. Bean', 'switches', ['mr_bean_exam_clock', 'mr_bean_laundry_machine', 'mr_bean_christmas_turkey', 'mr_bean_room_426', 'mr_bean_premiere_queue', 'mr_bean_nativity_mixup', 'mr_bean_paint_bomb_chain']],
  ['Famille Pirate', 'collect', ['famille_pirate_lerequin_crew_0', 'famille_pirate_lerequin_crew_1', 'famille_pirate_lerequin_crew_2', 'famille_pirate_bolaf', 'famille_pirate_hercule', 'famille_pirate_irvin', 'famille_pirate_ecumoir']],
  ['Téléchat', 'switches', ['telechat_tele_bete_revolt']],
  ['Nicolas et Pimprenelle', 'collect', ['nicolas_pimprenelle_restless_pillow', 'nicolas_pimprenelle_lost_cloud', 'nicolas_pimprenelle_early_alarm', 'nicolas_pimprenelle_lost_treasure_sack']],
  ['Nicolas et Pimprenelle', 'switches', ['nicolas_pimprenelle_faceless_nightmare', 'nicolas_pimprenelle_sleepless_night']]
]);

const LEGACY_NON_COMBAT_TRIAL_TYPE_BY_ID = new Map(
  LEGACY_NON_COMBAT_TRIAL_ROUTES.flatMap(([universe, type, ids]) => (
    ids.map(id => [`${universe}:${id}`, type])
  ))
);

// Older waves often stored a prop, victim, clue, hazard or abstract system as
// a plain string, so it could not carry the `nonCombat` marker used by the new
// canon sheets. Keep this list explicit: genuine antagonists in mixed
// universes remain combatants, while only the named non-enemies become trials.
const LEGACY_NON_COMBAT_TRIAL_NAME_ROUTES = Object.freeze([
  ['Death Note', 'evidence', ['Task Force Tail', 'Kira Copycat', 'Shinigami Whisper', 'Rem Contract', 'Near Deduction Trap']],
  ['From', 'switches', ['Faraway Tree Echo', 'Music Box Ballerina']],
  ['From', 'survive', ['Cicada Nightmare']],
  ['Uzumaki', 'rescue', ['Spiral Snail Student', 'Azami Spiral Eye']],
  ['Uzumaki', 'survive', ['Twisted Hair Storm']],
  ['Uzumaki', 'escape', ['Cremation Smoke Coil', 'Lighthouse Coil']],
  ['Exit 8', 'evidence', ['Wrong Poster Copy', 'Blinking Light Fault', 'Passing Man Echo', 'Impossible Signage']],
  ['Exit 8', 'escape', ['Flooded Corridor']],
  ['Hell House LLC', 'evidence', ['Basement Clown Prop', 'Hotel Door Knocker', 'Found Footage Static', 'Stairwell Camera Trap']],
  ['Hell House LLC', 'survive', ['Abaddon Priest Shade']],
  ['Spermageddon', 'escape', ['Hormone Gremlin', 'Body Cell Patrol', 'Awkward Musical Note', 'Contraception Gatekeeper', 'Cringe Chorus Beast']],
  ['Repo! The Genetic Opera', 'rescue', ['Zydrate Addict Echo']],
  ['Repo! The Genetic Opera', 'switches', ['Surgical Drone']],
  ['Repo! The Genetic Opera', 'evidence', ['Luigi Pavi Rotti Cell', 'Amber Sweet Stage']],
  ['Another', 'evidence', ['Reiko Mikami - The Extra']],
  ['La Cite de la Peur', 'evidence', ['Emile Gravier', 'Jean-Paul Martoni']],
  ['Voyage de Chihiro', 'evidence', ['Yubaba']],
  ['Voyage de Chihiro', 'switches', ['Kashira Trio']],
  ['The Simpsons', 'evidence', ['Mr Burns Nuclear Scheme']],
  ['Steins;Gate', 'evidence', ['Jellyman Experiment', 'FB Rounder Network', 'Nae Time-Leap Echo']],
  ['Steins;Gate', 'switches', ['D-Mail Divergence Echo']],
  ['Zero Escape: The Nonary Games', 'switches', ['Bracelet Bomb Enforcer', 'Q Room Trap Drone', 'Zero II Decision Engine']],
  ['Zero Escape: The Nonary Games', 'rescue', ['Radical-6 Host']],
  ['Zero Escape: The Nonary Games', 'evidence', ['Dio Myrmidon']],
  ['Psycho-Pass', 'switches', ['Crime Coefficient Drone']],
  ['Siren Head', 'switches', ['Stolen Voice Echo', 'Number Station Lure', 'Broadcast Relay Colossus']],
  ['Siren Head', 'escape-evidence', ['Tree-Line Mimic', 'Old-Media Faux Body']]
]);

const normalizeLegacyTrialName = value => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const LEGACY_NON_COMBAT_TRIAL_TYPE_BY_NAME = new Map(
  LEGACY_NON_COMBAT_TRIAL_NAME_ROUTES.flatMap(([universe, type, names]) => (
    names.map(name => [`${universe}:${normalizeLegacyTrialName(name)}`, type])
  ))
);

const LORE_WORLD_BOSS_POLICY_UNIVERSE_ALIASES = Object.freeze({
  'Digital Circus': 'The Amazing Digital Circus',
  'Le Cinquième Element': 'Le Cinquieme Element',
  'Guns N Roses': "Guns N' Roses",
  'Atarashii Gakko': 'Atarashii Gakko!'
});

const POLICY_ONLY_CLEAR_COMBAT_UNIVERSES = new Set([
  'Vocaloid',
  'Slender Man',
  'Digital Circus',
  'The Amazing Digital Circus',
  'Death Note',
  'Exit 8',
  'Hell House LLC',
  'Spermageddon',
  'Another',
  'Pingu',
  'La Cite de la Peur',
  'Cool Spot',
  'Zero Escape: The Nonary Games',
  'Siren Head'
]);

export const shouldClearCombatRosterForPolicy = universe => (
  POLICY_ONLY_CLEAR_COMBAT_UNIVERSES.has(universe)
  || POLICY_ONLY_CLEAR_COMBAT_UNIVERSES.has(LORE_WORLD_BOSS_POLICY_UNIVERSE_ALIASES[universe])
);

export const getResolvedLoreWorldBossPolicy = universe => (
  getLoreWorldBossPolicy(universe)
  || getLoreWorldBossPolicy(LORE_WORLD_BOSS_POLICY_UNIVERSE_ALIASES[universe])
  || null
);

const GENERATED_ITEM_OVERRIDE_KEYS = new Set([
  'dragon_ball_z',
  'evangelion',
  'fullmetal_alchemist',
  'naruto',
  'steins_gate',
  'tokyo_ghoul'
]);

const REQUESTED_UNIVERSE_WAVE_WITHOUT_LEGACY_ITEMS = REQUESTED_UNIVERSE_WAVE.map(entry => {
  if (!GENERATED_ITEM_OVERRIDE_KEYS.has(entry.key)) return entry;

  const entryWithoutLegacyItems = { ...entry };
  delete entryWithoutLegacyItems.gear;
  delete entryWithoutLegacyItems.event;
  return entryWithoutLegacyItems;
});

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

function defineCanonicalUniverse({
  key,
  universe,
  mediaType,
  faction,
  mode,
  difficulty,
  titleFr = universe,
  stage,
  boss,
  worldBoss = boss,
  cast,
  enemies,
  bosses,
  gear,
  event,
  origin,
  breach,
  motif,
  colors,
  stageVariants = []
}) {
  const boosts = [
    { atk: 8, spd: 1 },
    { def: 6, hp: 45 },
    { hp: 70, atk: 4 }
  ];

  return {
    key,
    universe,
    mediaType,
    faction,
    mode,
    difficulty,
    titleFr,
    stage,
    boss,
    worldBoss,
    hero: cast[0],
    allies: cast.slice(1),
    monsters: enemies,
    bosses,
    gear: gear.map(([itemKey, enName, frName], index) => ([
      `${key}_${itemKey}`,
      enName,
      frName,
      boosts[index % boosts.length]
    ])),
    event: [`evt_${key}_${event[0]}`, ...event.slice(1)],
    desc: {
      en: `${origin[0]} In Multiverse Breach, ${breach[0]}`,
      fr: `${origin[1]} Dans Multiverse Breach, ${breach[1]}`
    },
    theme: `${origin[0]} ${breach[0]}`,
    motif,
    colors,
    stageVariants
  };
}

const CANONICAL_REQUESTED_UNIVERSE_WAVE = [
  defineCanonicalUniverse({
    key: 'silent_hill_f',
    universe: 'Silent Hill f',
    mediaType: 'game',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    stage: 'Ebisugaoka Red Spider Lily Fog',
    boss: 'Fox Mask Wedding Rite',
    worldBoss: 'White Kimono Manifestation',
    cast: [
      ['hinako_shf', 'Hinako Shimizu', 'slayer'],
      ['shu_iwai_shf', 'Shu Iwai', 'tactical'],
      ['rinko_nishida_shf', 'Rinko Nishida', 'hacker'],
      ['sakuko_igarashi_shf', 'Sakuko Igarashi', 'horror']
    ],
    enemies: ['Kashimashi', 'Ayakakashi', 'Ebisugaoka Bloom Husk'],
    bosses: ['Fox Mask', 'White Kimono Manifestation'],
    gear: [
      ['naginata', 'Hinako Naginata', 'Naginata de Hinako'],
      ['omamori', 'Ebisugaoka Omamori', 'Omamori d Ebisugaoka'],
      ['red_capsule', 'Shu Red Capsule', 'Capsule rouge de Shu']
    ],
    event: ['fox_wedding', 'Fox Wedding Procession', 'Procession du mariage du renard', 'A ritual procession roots enemies in red spider lilies while Hinako breaks the imposed path.', 'Une procession rituelle immobilise les ennemis dans les lycoris rouges pendant que Hinako brise le destin impose.'],
    origin: ['In 1960s Ebisugaoka, Hinako and her friends face fog, flowers, social pressure, and a shrine rite that turns intimacy into body horror.', 'Dans l Ebisugaoka des annees 1960, Hinako et ses amis affrontent le brouillard, les fleurs, la pression sociale et un rite qui transforme l intimite en horreur corporelle.'],
    breach: ['the Fox Mask mistakes the Nexus Anchor for a new wedding witness and spreads the Dark Shrine through Mosaic City memories.', 'le Masque de Renard prend l Ancre du Nexus pour un nouveau temoin et propage le Sanctuaire sombre dans les souvenirs de la Cite-Mosaique.'],
    motif: 'hauntedset',
    colors: ['#241318', '#050203', '#d94b68'],
    stageVariants: [['Tactics', 'Dark Shrine Wedding Hall', 'Expert', 'Fox Mask']]
  }),
  defineCanonicalUniverse({
    key: 'lord_of_the_rings',
    universe: 'The Lord of the Rings',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Le Seigneur des Anneaux',
    stage: 'Barad-dur Eye of Sauron Siege',
    boss: 'Sauron Ring-Wraith Convergence',
    worldBoss: 'Morgoth Shadow Beyond the Door of Night',
    cast: [
      ['aragorn_lotr', 'Aragorn', 'slayer'],
      ['gandalf_lotr', 'Gandalf', 'hacker'],
      ['legolas_lotr', 'Legolas', 'tactical'],
      ['gimli_lotr', 'Gimli', 'marine']
    ],
    enemies: ['Uruk-hai Warband', 'Warg Rider', 'Mumakil Siege Host', 'Nazgul'],
    bosses: ['Mouth of Sauron', 'Balrog of Moria', 'Sauron'],
    gear: [
      ['anduril', 'Anduril Flame of the West', 'Anduril Flamme de l Ouest'],
      ['mithril', 'Mithril Mail', 'Cotte de mithril'],
      ['phial', 'Phial of Galadriel', 'Fiole de Galadriel']
    ],
    event: ['beacons', 'Beacons of Gondor', 'Feux d alarme du Gondor', 'The beacons call a Rohirrim charge across every hostile lane.', 'Les feux appellent une charge des Rohirrim a travers toutes les lignes ennemies.'],
    origin: ['Middle-earth is bound by the War of the Ring, ancient peoples, the Fellowship, and Sauron s will to dominate every free mind.', 'La Terre du Milieu est liee par la Guerre de l Anneau, les peuples anciens, la Communaute et la volonte de Sauron de dominer tout esprit libre.'],
    breach: ['a shard of the One Ring teaches the Eye of Sauron to see portals, while A.R.C.A. must keep Morgoth s older shadow outside the Trame.', 'un eclat de l Anneau Unique apprend a l Oeil de Sauron a voir les portails, tandis qu A.R.C.A. doit maintenir l ombre plus ancienne de Morgoth hors de la Trame.'],
    motif: 'castle',
    colors: ['#2a1b12', '#050302', '#e06b2f'],
    stageVariants: [['Tactics', 'Pelennor Fields Breachfront', 'Very Hard', 'Mumakil Siege Host']]
  }),
  defineCanonicalUniverse({
    key: 'titanfall_2',
    universe: 'Titanfall 2',
    mediaType: 'game',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    stage: 'Typhon Fold Weapon Rupture',
    boss: 'Ark-Powered Reaper Command',
    worldBoss: 'Fold Weapon Core',
    cast: [
      ['jack_cooper_tf2', 'Jack Cooper', 'marine'],
      ['bt_7274_tf2', 'BT-7274', 'tactical'],
      ['sarah_briggs_tf2', 'Sarah Briggs', 'hacker']
    ],
    enemies: ['IMC Rifleman', 'Spectre Squad', 'Reaper', 'Northstar Mercenary Titan'],
    bosses: ['Kane Scorch Titan', 'Viper Northstar Titan'],
    gear: [
      ['smart_pistol', 'Smart Pistol MK6', 'Pistolet intelligent MK6'],
      ['data_knife', 'Pilot Data Knife', 'Couteau de donnees de pilote'],
      ['sere_kit', 'SERE Kit', 'Kit SERE']
    ],
    event: ['protocol_three', 'Protocol 3: Protect the Pilot', 'Protocole 3 : proteger le pilote', 'BT intercepts lethal fire and launches the Pilot into a wall-run counterattack.', 'BT intercepte les tirs mortels et lance le pilote dans une contre-attaque murale.'],
    origin: ['Militia Rifleman Jack Cooper and Vanguard Titan BT-7274 fight the IMC around the Ark and the planet-killing Fold Weapon.', 'Le fusilier de la Milice Jack Cooper et le Titan Vanguard BT-7274 combattent l IMC autour de l Arche et de l arme Fold.'],
    breach: ['the Ark locks onto Mosaic City as a replacement coordinate, forcing Pilot and Titan to preserve Protocol 3 across unstable timelines.', 'l Arche verrouille la Cite-Mosaique comme coordonnee de remplacement, obligeant pilote et Titan a maintenir le Protocole 3 entre des chronologies instables.'],
    motif: 'facility',
    colors: ['#152631', '#030608', '#55d8ff'],
    stageVariants: [['Smash', 'Angel City Titanfall', 'Hard', 'Viper Northstar Titan']]
  }),
  defineCanonicalUniverse({
    key: 'pirates_caribbean',
    universe: 'Pirates of the Caribbean',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Pirates des Caraibes',
    stage: 'Isla de Muerta Maelstrom',
    boss: 'Davy Jones Flying Dutchman',
    worldBoss: 'Calypso Maelstrom',
    cast: [
      ['jack_sparrow_potc', 'Jack Sparrow', 'hacker'],
      ['elizabeth_swann_potc', 'Elizabeth Swann', 'tactical'],
      ['will_turner_potc', 'Will Turner', 'slayer']
    ],
    enemies: ['Cursed Aztec Pirate', 'Flying Dutchman Crew', 'East India Company Marine'],
    bosses: ['Hector Barbossa', 'Davy Jones'],
    gear: [
      ['compass', 'Jack s Compass', 'Boussole de Jack'],
      ['aztec_coin', 'Cursed Aztec Coin', 'Piece azteque maudite'],
      ['dead_mans_chest', 'Dead Man s Chest Key', 'Cle du coffre du mort']
    ],
    event: ['kraken', 'Kraken Broadside', 'Bordee du Kraken', 'The Kraken drags the strongest enemy beneath a maelstrom while the Black Pearl opens fire.', 'Le Kraken entraine l ennemi le plus fort sous le maelstrom pendant que le Black Pearl ouvre le feu.'],
    origin: ['The Caribbean seas bind pirates, imperial fleets, Aztec curses, Davy Jones, and bargains whose price always returns.', 'Les mers des Caraibes lient pirates, flottes imperiales, maledictions azteques, Davy Jones et pactes dont le prix revient toujours.'],
    breach: ['Jack s compass points toward the Nexus Anchor instead of desire, and Calypso s storm begins carrying whole islands between universes.', 'la boussole de Jack pointe vers l Ancre du Nexus plutot que vers le desir, et la tempete de Calypso transporte des iles entieres entre les univers.'],
    motif: 'shipdeck',
    colors: ['#12303a', '#020607', '#d6a654']
  }),
  defineCanonicalUniverse({
    key: 'them_1954',
    universe: 'Them!',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Des monstres attaquent la ville',
    stage: 'Los Angeles Storm Drain Colony',
    boss: 'Queen Ant Brood Chamber',
    cast: [
      ['ben_peterson_them', 'Ben Peterson', 'tactical'],
      ['pat_medford_them', 'Pat Medford', 'hacker'],
      ['robert_graham_them', 'Robert Graham', 'marine']
    ],
    enemies: ['Giant Worker Ant', 'Giant Soldier Ant', 'Brood Tunnel Ambusher'],
    bosses: ['Queen Guard Pair', 'Queen Ant'],
    gear: [
      ['formic_acid', 'Formic Acid Sample', 'Echantillon d acide formique'],
      ['geiger_counter', 'Desert Geiger Counter', 'Compteur Geiger du desert'],
      ['flamethrower', 'Nest Flamethrower', 'Lance-flammes de nid']
    ],
    event: ['nest_purge', 'Storm Drain Nest Purge', 'Purge du nid des egouts', 'A.R.C.A. seals the tunnels before concentrated flame purges the brood lanes.', 'A.R.C.A. scelle les tunnels avant qu une flamme concentree purge les couloirs de ponte.'],
    origin: ['Atomic testing creates giant ants whose organized colonies threaten 1950s America from desert nests and city tunnels.', 'Les essais atomiques creent des fourmis geantes dont les colonies organisees menacent l Amerique des annees 1950 depuis le desert et les egouts.'],
    breach: ['a queen mistakes portal resonance for a mating signal and seeds connected worlds with eggs before A.R.C.A. can quarantine them.', 'une reine prend la resonance des portails pour un signal nuptial et pond dans plusieurs mondes connectes avant la quarantaine A.R.C.A.'],
    motif: 'facility',
    colors: ['#2a2416', '#050403', '#e7c35a']
  }),
  defineCanonicalUniverse({
    key: 'cyberpunk_2077',
    universe: 'Cyberpunk',
    mediaType: 'game',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Very Hard',
    stage: 'Night City Mikoshi Breach',
    boss: 'Adam Smasher Blackwall Chassis',
    worldBoss: 'Blackwall Rogue AI',
    cast: [
      ['v_cyberpunk', 'V', 'hacker'],
      ['johnny_silverhand_cp', 'Johnny Silverhand', 'slayer'],
      ['panam_palmer_cp', 'Panam Palmer', 'tactical']
    ],
    enemies: ['Arasaka Elite', 'Maelstrom Cyberpsycho', 'NetWatch Agent', 'Blackwall Daemon'],
    bosses: ['Adam Smasher', 'Mikoshi Construct Swarm'],
    gear: [
      ['mantis_blades', 'Mantis Blades', 'Lames Mantis'],
      ['sandevistan', 'Sandevistan Implant', 'Implant Sandevistan'],
      ['relic_chip', 'Relic Biochip', 'Bio-puce Relic']
    ],
    event: ['blackwall', 'Blackwall Overclock', 'Surcharge du Blackwall', 'V breaches the local subnet and turns hostile cyberware against its owners.', 'V perce le sous-reseau local et retourne les cyberwares hostiles contre leurs porteurs.'],
    origin: ['Night City runs on corporations, mercenary contracts, invasive cyberware, braindances, and the lethal promise of becoming a legend.', 'Night City fonctionne par corporations, contrats de mercenaires, cyberwares invasifs, braindances et promesse mortelle de devenir une legende.'],
    breach: ['Mikoshi identifies Trame memories as engrams, while rogue AIs probe A.R.C.A. for a route around the Blackwall.', 'Mikoshi identifie les souvenirs de Trame comme des engrammes, tandis que des IA rebelles sondent A.R.C.A. pour contourner le Blackwall.'],
    motif: 'arcanecity',
    colors: ['#1f1530', '#030205', '#f5e642'],
    stageVariants: [['Tactics', 'Arasaka Tower Extraction', 'Very Hard', 'Adam Smasher']]
  }),
  defineCanonicalUniverse({
    key: 'the_creator',
    universe: 'The Creator',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'New Asia NOMAD Target Corridor',
    boss: 'NOMAD Orbital Strike Core',
    cast: [
      ['joshua_taylor_creator', 'Joshua Taylor', 'marine'],
      ['alphie_creator', 'Alphie', 'hacker'],
      ['harun_creator', 'Harun', 'tactical']
    ],
    enemies: ['US Army Exosuit', 'NOMAD Targeting Drone', 'Anti-AI Commando'],
    bosses: ['Colonel Howell Strike Team', 'NOMAD Orbital Platform'],
    gear: [
      ['simulant_core', 'Simulant Memory Core', 'Noyau memoire de simulant'],
      ['nomad_beacon', 'NOMAD Target Beacon', 'Balise de ciblage NOMAD'],
      ['new_asia_emp', 'New Asia EMP Charge', 'Charge EMP de Nouvelle-Asie']
    ],
    event: ['alphie_pulse', 'Alphie Technology Pulse', 'Impulsion technologique d Alphie', 'Alphie disables every hostile machine long enough for Joshua to open an evacuation route.', 'Alphie desactive toutes les machines hostiles assez longtemps pour que Joshua ouvre une route d evacuation.'],
    origin: ['Joshua escorts the childlike AI Alphie through a war between humanity, simulants, New Asia, and the orbital weapon NOMAD.', 'Joshua escorte l IA enfant Alphie dans une guerre entre humains, simulants, Nouvelle-Asie et l arme orbitale NOMAD.'],
    breach: ['Alphie can close portals as if they were machines, making her both A.R.C.A. s best stabilizer and NOMAD s priority target.', 'Alphie peut fermer les portails comme des machines, ce qui fait d elle la meilleure stabilisatrice d A.R.C.A. et la cible prioritaire de NOMAD.'],
    motif: 'facility',
    colors: ['#1a2e35', '#030607', '#ef6f46']
  }),
  defineCanonicalUniverse({
    key: 'day_of_the_dead',
    universe: 'Day of the Dead',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Florida Underground Bunker',
    boss: 'Captain Rhodes Bunker Collapse',
    cast: [
      ['sarah_bowman_dotd', 'Sarah Bowman', 'hacker'],
      ['john_dotd', 'John', 'marine'],
      ['bill_mcdemott_dotd', 'Bill McDermott', 'tactical']
    ],
    enemies: ['Bunker Zombie', 'Mine Shaft Horde', 'Laboratory Specimen'],
    bosses: ['Captain Rhodes', 'Bunker Horde'],
    gear: [
      ['bub_headphones', 'Bub s Headphones', 'Casque de Bub'],
      ['lab_recorder', 'Logan Research Recorder', 'Enregistreur de recherche de Logan'],
      ['flare', 'Mine Shaft Flare', 'Fusee de puits de mine']
    ],
    event: ['bub_salute', 'Bub Recognition Protocol', 'Protocole de reconnaissance de Bub', 'Bub draws the dead away from living allies and disrupts the bunker command chain.', 'Bub detourne les morts des allies vivants et brise la chaine de commandement du bunker.'],
    origin: ['Scientists and soldiers fracture inside an underground bunker while the dead dominate the surface and Bub begins to remember.', 'Scientifiques et soldats se divisent dans un bunker souterrain tandis que les morts dominent la surface et que Bub commence a se souvenir.'],
    breach: ['A.R.C.A. discovers that retained zombie memory can anchor a Trame, but Rhodes tries to weaponize every sentient trace.', 'A.R.C.A. decouvre que la memoire residuelle des zombies peut ancrer une Trame, mais Rhodes tente de militariser chaque trace consciente.'],
    motif: 'facility',
    colors: ['#241a13', '#040302', '#d98b45']
  }),
  defineCanonicalUniverse({
    key: 'night_living_dead',
    universe: 'Night of the Living Dead',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Pennsylvania Farmhouse Siege',
    boss: 'Farmhouse Cellar Collapse',
    cast: [
      ['ben_nold', 'Ben', 'marine'],
      ['barbra_nold', 'Barbra', 'horror'],
      ['tom_nold', 'Tom', 'tactical']
    ],
    enemies: ['Cemetery Ghoul', 'Farmhouse Ghoul', 'Torch Mob Ghoul'],
    bosses: ['Cellar Cooper Dead', 'Farmhouse Horde'],
    gear: [
      ['radio', 'Farmhouse Radio', 'Radio de la ferme'],
      ['boards', 'Window Barricade Kit', 'Kit de barricade de fenetre'],
      ['torch', 'Sheriff Posse Torch', 'Torche de la milice']
    ],
    event: ['broadcast', 'Emergency Broadcast', 'Bulletin d urgence', 'A clear broadcast reveals the safest lane and delays the surrounding dead.', 'Un bulletin clair revele la voie la plus sure et retarde les morts qui encerclent la ferme.'],
    origin: ['A rural farmhouse becomes a pressure chamber for strangers trapped between an unexplained rising of the dead and their own mistrust.', 'Une ferme rurale devient une chambre de pression pour des inconnus coinces entre le reveil inexplique des morts et leur propre mefiance.'],
    breach: ['the farmhouse repeats as an Anchor test, and every failed argument creates another sealed room in the Nexus.', 'la ferme se repete comme une epreuve d Ancre, et chaque dispute echouee cree une nouvelle piece scellee dans le Nexus.'],
    motif: 'hauntedset',
    colors: ['#202020', '#030303', '#b8b8a8']
  }),
  defineCanonicalUniverse({
    key: 'land_of_the_dead',
    universe: 'Land of the Dead',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    stage: 'Fiddlers Green Dead Reckoning Siege',
    boss: 'Kaufman Tower Evacuation',
    cast: [
      ['riley_denbo_lotd', 'Riley Denbo', 'tactical'],
      ['slack_lotd', 'Slack', 'slayer'],
      ['charlie_lotd', 'Charlie', 'marine']
    ],
    enemies: ['Fiddlers Green Raider', 'Adaptive Dead', 'River Horde'],
    bosses: ['Cholo Armored Raid', 'Big Daddy Horde Leader'],
    gear: [
      ['dead_reckoning', 'Dead Reckoning Targeter', 'Ciblage de Dead Reckoning'],
      ['skyflower', 'Skyflower Launcher', 'Lanceur de fleurs du ciel'],
      ['tower_pass', 'Fiddlers Green Pass', 'Laissez-passer de Fiddlers Green']
    ],
    event: ['dead_reckoning', 'Dead Reckoning Barrage', 'Barrage de Dead Reckoning', 'The armored vehicle marks a corridor and clears it with rockets before extraction.', 'Le vehicule blinde marque un couloir et le nettoie aux roquettes avant extraction.'],
    origin: ['The living hide behind class walls while Big Daddy leads increasingly aware dead toward Fiddlers Green.', 'Les vivants se cachent derriere des murs de classe tandis que Big Daddy mene des morts de plus en plus conscients vers Fiddlers Green.'],
    breach: ['the dead recognize portals as roads to freedom, forcing A.R.C.A. to negotiate movement rather than treating every corpse as an object.', 'les morts reconnaissent les portails comme des routes vers la liberte, obligeant A.R.C.A. a negocier leur passage plutot qu a traiter chaque corps comme un objet.'],
    motif: 'arcanecity',
    colors: ['#17201b', '#030403', '#8ea765']
  }),
  defineCanonicalUniverse({
    key: 'zombi',
    universe: 'Zombi',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Matul Island Hospital Outbreak',
    boss: 'Conquistador Grave Horde',
    cast: [
      ['peter_west_zombi', 'Peter West', 'tactical'],
      ['anne_bowles_zombi', 'Anne Bowles', 'hacker'],
      ['brian_hull_zombi', 'Brian Hull', 'marine']
    ],
    enemies: ['Matul Island Zombie', 'Underwater Corpse', 'Hospital Dead'],
    bosses: ['Conquistador Zombie', 'Matul Cemetery Horde'],
    gear: [
      ['signal_flare', 'Matul Signal Flare', 'Fusee de signal Matul'],
      ['doctor_notes', 'Dr. Menard Notes', 'Notes du docteur Menard'],
      ['boat_rifle', 'Island Boat Rifle', 'Fusil du bateau']
    ],
    event: ['shark_struggle', 'Underwater Shark Struggle', 'Lutte sous-marine contre le requin', 'An underwater dead diverts the largest biological threat in a violent collision.', 'Un mort sous-marin detourne la plus grande menace biologique dans une collision violente.'],
    origin: ['A Caribbean island epidemic raises decomposing dead around Dr. Menard s hospital, old graves, and a doomed escape by sea.', 'Une epidemie insulaire caribeenne releve des morts decomposes autour de l hopital du docteur Menard, de vieilles tombes et d une fuite condamnee par la mer.'],
    breach: ['the Matul infection travels through salt water pooled beneath the portals and reaches sealed sectors without opening a door.', 'l infection de Matul voyage dans l eau salee accumulee sous les portails et atteint des secteurs scelles sans ouvrir de porte.'],
    motif: 'hauntedset',
    colors: ['#1f2418', '#030403', '#a9b06a']
  }),
  defineCanonicalUniverse({
    key: 'harry_potter',
    universe: 'Harry Potter',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Hogwarts Battle of the Astronomy Tower',
    boss: 'Voldemort Horcrux Convergence',
    cast: [
      ['harry_potter', 'Harry Potter', 'slayer'],
      ['hermione_granger', 'Hermione Granger', 'hacker'],
      ['ron_weasley', 'Ron Weasley', 'tactical']
    ],
    enemies: ['Death Eater', 'Dementor', 'Acromantula', 'Basilisk Spawn'],
    bosses: ['Bellatrix Lestrange', 'Lord Voldemort'],
    gear: [
      ['elder_wand', 'Elder Wand Echo', 'Echo de la Baguette de Sureau'],
      ['invisibility_cloak', 'Invisibility Cloak', 'Cape d invisibilite'],
      ['marauders_map', 'Marauder s Map', 'Carte du Maraudeur']
    ],
    event: ['patronus', 'Mass Patronus', 'Patronus collectif', 'A wave of Patronuses drives fear entities from every allied lane.', 'Une vague de Patronus chasse les entites de peur de toutes les lignes alliees.'],
    origin: ['Hogwarts stands at the center of a hidden magical society, a war against Voldemort, and a struggle over choice, sacrifice, and inherited power.', 'Poudlard se trouve au centre d une societe magique cachee, d une guerre contre Voldemort et d un conflit sur le choix, le sacrifice et le pouvoir herite.'],
    breach: ['Horcrux fragments treat portal anchors as new containers, so the trio must destroy soul echoes without damaging the memories that stabilize Mosaic City.', 'les fragments d Horcruxe traitent les ancres de portail comme de nouveaux receptacles, et le trio doit detruire les echos d ame sans blesser les souvenirs qui stabilisent la Cite-Mosaique.'],
    motif: 'castle',
    colors: ['#201a2d', '#040305', '#d2ae54']
  }),
  defineCanonicalUniverse({
    key: 'terminator',
    universe: 'Terminator',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    stage: 'Los Angeles Future War Time Displacement',
    boss: 'Skynet Temporal Defense Grid',
    worldBoss: 'Skynet Core',
    cast: [
      ['sarah_connor_term', 'Sarah Connor', 'tactical'],
      ['t800_term', 'T-800', 'marine'],
      ['john_connor_term', 'John Connor', 'hacker']
    ],
    enemies: ['T-800 Endoskeleton', 'Hunter-Killer Drone', 'T-1000 Infiltrator'],
    bosses: ['T-1000', 'T-X'],
    gear: [
      ['phase_plasma', 'Phased Plasma Rifle', 'Fusil plasma a phase'],
      ['cpu', 'Learning CPU', 'Processeur d apprentissage'],
      ['time_chip', 'Time Displacement Chip', 'Puce de deplacement temporel']
    ],
    event: ['no_fate', 'No Fate Counterstrike', 'Contre-attaque Sans destin', 'Sarah cancels the predicted enemy action and the T-800 answers with plasma fire.', 'Sarah annule l action ennemie predite et le T-800 repond par un tir plasma.'],
    origin: ['Skynet s machine war reaches backward through time to erase the human resistance before it can exist.', 'La guerre des machines de Skynet remonte le temps pour effacer la resistance humaine avant sa naissance.'],
    breach: ['the time displacement field mistakes alternate universes for editable histories, multiplying Judgment Day instead of preventing it.', 'le champ de deplacement temporel prend les univers alternatifs pour des histoires modifiables, multipliant le Jugement dernier au lieu de l empecher.'],
    motif: 'facility',
    colors: ['#17212b', '#030405', '#ef493d']
  }),
  defineCanonicalUniverse({
    key: 'robocop',
    universe: 'RoboCop',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Old Detroit OCP Siege',
    boss: 'ED-209 Directive Lock',
    worldBoss: 'OCP Delta City Mainframe',
    cast: [
      ['robocop_murphy', 'Alex Murphy / RoboCop', 'marine'],
      ['anne_lewis_rc', 'Anne Lewis', 'tactical'],
      ['dr_lazarus_rc', 'Dr. Marie Lazarus', 'hacker']
    ],
    enemies: ['OCP Security Trooper', 'Street Gang Gunner', 'Reprogrammed Police Unit'],
    bosses: ['ED-209', 'RoboCain'],
    gear: [
      ['auto9', 'Auto-9', 'Auto-9'],
      ['data_spike', 'RoboCop Data Spike', 'Pointe de donnees RoboCop'],
      ['prime_directives', 'Prime Directive Wafer', 'Plaquette des directives prioritaires']
    ],
    event: ['dead_or_alive', 'Dead or Alive Arrest', 'Arrestation mort ou vif', 'Murphy marks every armed hostile, disarms the front line, and arrests the surviving threat.', 'Murphy marque chaque hostile arme, desarme la premiere ligne et arrete la menace survivante.'],
    origin: ['OCP turns murdered officer Alex Murphy into RoboCop while Old Detroit is sold as a corporate product.', 'OCP transforme l officier assassine Alex Murphy en RoboCop tandis que le vieux Detroit est vendu comme un produit corporatif.'],
    breach: ['A.R.C.A. directives collide with Murphy s prime directives, and OCP tries to patent the Anchor as public-security hardware.', 'les directives A.R.C.A. entrent en conflit avec les directives prioritaires de Murphy, et OCP tente de breveter l Ancre comme materiel de securite publique.'],
    motif: 'arcanecity',
    colors: ['#16232c', '#030506', '#77c9e8']
  }),
  defineCanonicalUniverse({
    key: 'dark_knight',
    universe: 'The Dark Knight',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'The Dark Knight',
    stage: 'Gotham Ferry Dilemma',
    boss: 'Joker Chaos Network',
    cast: [
      ['batman_tdk', 'Batman', 'tactical'],
      ['jim_gordon_tdk', 'James Gordon', 'marine'],
      ['lucius_fox_tdk', 'Lucius Fox', 'hacker']
    ],
    enemies: ['Joker Mask Robber', 'Gotham Mob Gunman', 'Corrupt SWAT Officer'],
    bosses: ['Two-Face', 'The Joker'],
    gear: [
      ['grapple', 'Pneumatic Grapnel', 'Grappin pneumatique'],
      ['sonar', 'Gotham Sonar Lens', 'Lentille sonar de Gotham'],
      ['batarang', 'Dark Knight Batarang', 'Batarang du Chevalier noir']
    ],
    event: ['ferry_choice', 'Gotham Ferry Choice', 'Choix des ferries de Gotham', 'Civilians reject the Joker s game, cleansing fear and restoring the squad s resolve.', 'Les civils refusent le jeu du Joker, dissipent la peur et restaurent la resolution de l escouade.'],
    origin: ['Batman, Gordon, and Dent confront a Joker campaign built to prove that Gotham s rules collapse under enough fear.', 'Batman, Gordon et Dent affrontent une campagne du Joker destinee a prouver que les regles de Gotham s effondrent sous la peur.'],
    breach: ['the Joker turns portal selection into social experiments, while Batman refuses to let A.R.C.A. trade surveillance for certainty.', 'le Joker transforme la selection des portails en experiences sociales, tandis que Batman refuse qu A.R.C.A. echange la surveillance contre la certitude.'],
    motif: 'arcanecity',
    colors: ['#111b25', '#020304', '#d3a84a']
  }),
  defineCanonicalUniverse({
    key: 'kill_bill',
    universe: 'Kill Bill',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Very Hard',
    stage: 'House of Blue Leaves Showdown',
    boss: 'Bill Five Point Palm Duel',
    cast: [
      ['beatrix_kiddo_kb', 'Beatrix Kiddo', 'slayer'],
      ['sofie_fatale_kb', 'Sofie Fatale', 'hacker'],
      ['hattori_hanzo_kb', 'Hattori Hanzo', 'tactical']
    ],
    enemies: ['Crazy 88 Fighter', 'Yakuza Bodyguard', 'Deadly Viper Assassin'],
    bosses: ['O-Ren Ishii', 'Bill'],
    gear: [
      ['hanzo_sword', 'Hattori Hanzo Sword', 'Sabre Hattori Hanzo'],
      ['five_point_manual', 'Five Point Palm Manual', 'Manuel des cinq points'],
      ['yellow_suit', 'Yellow Tracksuit', 'Survetement jaune']
    ],
    event: ['black_mamba', 'Black Mamba Rampage', 'Assaut Black Mamba', 'Beatrix crosses the enemy line in a precise sequence that ignores counterattacks.', 'Beatrix traverse la ligne ennemie dans une sequence precise qui ignore les contre-attaques.'],
    origin: ['The Bride hunts the Deadly Viper Assassination Squad through a revenge story shaped by discipline, betrayal, and chosen family.', 'La Mariee traque le Detachement international des viperes assassines dans une vengeance faite de discipline, trahison et famille choisie.'],
    breach: ['her death list begins rewriting itself with multiversal names, and Beatrix must decide which targets are people and which are Authorless forgeries.', 'sa liste de mort se reecrit avec des noms multiversels, et Beatrix doit distinguer les personnes des contrefacons du Sans-Auteur.'],
    motif: 'arcanecity',
    colors: ['#2a2410', '#050401', '#f0d638']
  }),
  defineCanonicalUniverse({
    key: 'rocky',
    universe: 'Rocky',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Philadelphia Championship Ring',
    boss: 'Ivan Drago Exhibition',
    cast: [
      ['rocky_balboa', 'Rocky Balboa', 'slayer'],
      ['apollo_creed', 'Apollo Creed', 'tactical'],
      ['adrian_balboa', 'Adrian Balboa', 'hacker']
    ],
    enemies: ['Club Boxer', 'Promoter Enforcer', 'Training Echo'],
    bosses: ['Clubber Lang', 'Ivan Drago'],
    gear: [
      ['gloves', 'Italian Stallion Gloves', 'Gants de l Etalon italien'],
      ['robe', 'Championship Robe', 'Peignoir de championnat'],
      ['training_hat', 'Mickey s Training Hat', 'Bonnet d entrainement de Mickey']
    ],
    event: ['distance', 'Go the Distance', 'Tenir jusqu au bout', 'Rocky survives a knockout blow, restores the team, and answers with a final-round combination.', 'Rocky survit a un coup fatal, releve l equipe et repond par une combinaison du dernier round.'],
    origin: ['Rocky Balboa turns a once-in-a-lifetime title shot into a long story about endurance, dignity, love, and earning one more round.', 'Rocky Balboa transforme une chance unique de titre en une longue histoire d endurance, de dignite, d amour et de round supplementaire.'],
    breach: ['the Nexus Arena measures heroes only by victory, so Rocky fights to prove that surviving with integrity is also a stabilizing result.', 'l Arene du Nexus ne mesure les heros que par la victoire, et Rocky combat pour prouver que tenir avec integrite stabilise aussi une Trame.'],
    motif: 'facility',
    colors: ['#1f2025', '#040405', '#d34b3f']
  }),
  defineCanonicalUniverse({
    key: 'rambo',
    universe: 'Rambo',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Hope Mountain Manhunt',
    boss: 'Colonel Zaysen Fortress',
    cast: [
      ['john_rambo', 'John Rambo', 'slayer'],
      ['sam_trautman', 'Colonel Trautman', 'tactical'],
      ['co_bao', 'Co Bao', 'hacker']
    ],
    enemies: ['Sheriff Posse', 'Soviet Spetsnaz', 'Jungle Patrol'],
    bosses: ['Sheriff Teasle', 'Colonel Zaysen'],
    gear: [
      ['survival_knife', 'Rambo Survival Knife', 'Couteau de survie de Rambo'],
      ['compound_bow', 'Explosive Compound Bow', 'Arc a poulies explosif'],
      ['poncho', 'Mountain Poncho', 'Poncho de montagne']
    ],
    event: ['nothing_over', 'Nothing Is Over', 'Rien n est termine', 'Rambo vanishes from enemy sight, lays traps, and dismantles the command lane alone.', 'Rambo disparait des lignes de vue, pose des pieges et demantele seul la ligne de commandement.'],
    origin: ['John Rambo is a traumatized Green Beret repeatedly pushed back into wars by authorities who mistake survival for obedience.', 'John Rambo est un Beret vert traumatise que les autorites renvoient sans cesse a la guerre en confondant survie et obeissance.'],
    breach: ['A.R.C.A. extraction orders resemble another command sending him back into violence, so Trautman must help the Nexus earn his trust instead of requisitioning it.', 'les ordres d extraction A.R.C.A. ressemblent a un commandement de plus qui le renvoie a la violence, et Trautman doit aider le Nexus a gagner sa confiance.'],
    motif: 'wasteland',
    colors: ['#25301d', '#050604', '#b58b43']
  }),
  defineCanonicalUniverse({
    key: 'commando',
    universe: 'Commando',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Val Verde Island Assault',
    boss: 'Arius Compound Siege',
    cast: [
      ['john_matrix_commando', 'John Matrix', 'marine'],
      ['cindy_commando', 'Cindy', 'tactical'],
      ['general_kirby_commando', 'General Kirby', 'hacker']
    ],
    enemies: ['Val Verde Mercenary', 'Mall Kidnapper', 'Island Guard'],
    bosses: ['Arius', 'Bennett'],
    gear: [
      ['launcher', 'M202 FLASH Launcher', 'Lance-roquettes M202 FLASH'],
      ['saw', 'Compound Circular Saw', 'Scie circulaire du complexe'],
      ['knife', 'Bennett Throwing Knife', 'Couteau de lancer de Bennett']
    ],
    event: ['gear_up', 'Matrix Gear-Up', 'Armement de Matrix', 'Matrix equips the full assault rack and clears every exposed firing lane.', 'Matrix equipe tout l arsenal d assaut et nettoie chaque ligne de tir exposee.'],
    origin: ['Retired Colonel John Matrix assaults a private army to rescue his kidnapped daughter from Arius and Bennett.', 'Le colonel retraite John Matrix attaque une armee privee pour sauver sa fille enlevee par Arius et Bennett.'],
    breach: ['Jenny s trace is copied into several hostage markers, forcing Matrix to identify the real signal before his one-man assault destroys an innocent Trame.', 'la trace de Jenny est copiee dans plusieurs marqueurs d otage, obligeant Matrix a identifier le vrai signal avant que son assaut solitaire ne detruise une Trame innocente.'],
    motif: 'fortress',
    colors: ['#28301c', '#050604', '#d17c3e']
  }),
  defineCanonicalUniverse({
    key: 'silence_of_the_lambs',
    universe: 'The Silence of the Lambs',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    stage: 'Baltimore Hospital Behavioral Wing',
    boss: 'Buffalo Bill Basement Hunt',
    cast: [
      ['clarice_starling', 'Clarice Starling', 'tactical'],
      ['jack_crawford_sotl', 'Jack Crawford', 'marine'],
      ['barney_matthews_sotl', 'Barney Matthews', 'hacker']
    ],
    enemies: ['False Witness Echo', 'Basement Stalker', 'Asylum Escapee'],
    bosses: ['Hannibal Lecter Escape Pattern', 'Buffalo Bill'],
    gear: [
      ['case_file', 'Buffalo Bill Case File', 'Dossier Buffalo Bill'],
      ['night_vision', 'Basement Night-Vision Goggles', 'Lunettes nocturnes de la cave'],
      ['moth_cocoon', 'Death s-Head Moth Cocoon', 'Cocon de sphinx tete-de-mort']
    ],
    event: ['quid_pro_quo', 'Quid Pro Quo Interview', 'Entretien donnant-donnant', 'Clarice extracts the hidden target pattern, exposing every ambush without granting Lecter control.', 'Clarice extrait le schema cache des cibles, revele chaque embuscade sans laisser Lecter prendre le controle.'],
    origin: ['FBI trainee Clarice Starling consults imprisoned psychiatrist Hannibal Lecter to identify serial killer Buffalo Bill before another captive dies.', 'La stagiaire du FBI Clarice Starling consulte le psychiatre emprisonne Hannibal Lecter pour identifier le tueur Buffalo Bill avant la mort d une autre captive.'],
    breach: ['Lecter reads portal behavior as psychology and starts predicting which memories A.R.C.A. will sacrifice under pressure.', 'Lecter lit le comportement des portails comme une psychologie et predit quels souvenirs A.R.C.A. sacrifiera sous pression.'],
    motif: 'facility',
    colors: ['#20221d', '#030403', '#c5b879']
  }),
  defineCanonicalUniverse({
    key: 'da_vinci_code',
    universe: 'The Da Vinci Code',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Da Vinci Code',
    stage: 'Louvre Rose Line Cipher',
    boss: 'Priory Keystone Conspiracy',
    cast: [
      ['robert_langdon_dvc', 'Robert Langdon', 'hacker'],
      ['sophie_neveu_dvc', 'Sophie Neveu', 'tactical'],
      ['bezu_fache_dvc', 'Bezu Fache', 'marine']
    ],
    enemies: ['Opus Dei Pursuer', 'False Priory Agent', 'Cipher Guardian'],
    bosses: ['Silas', 'The Teacher'],
    gear: [
      ['cryptex', 'Rosewood Cryptex', 'Cryptex en bois de rose'],
      ['fleur_key', 'Fleur-de-lis Key', 'Cle fleur-de-lis'],
      ['rose_map', 'Rose Line Chart', 'Carte de la ligne rose']
    ],
    event: ['cryptex', 'Cryptex Revelation', 'Revelation du Cryptex', 'Langdon solves the active symbol chain, opening locked routes and cancelling false objectives.', 'Langdon resout la chaine de symboles active, ouvre les routes verrouillees et annule les faux objectifs.'],
    origin: ['Langdon and Sophie follow a murder trail through art, symbols, the Priory of Sion, and a secret guarded by competing institutions.', 'Langdon et Sophie suivent une piste de meurtre a travers l art, les symboles, le Prieure de Sion et un secret garde par des institutions rivales.'],
    breach: ['the Rose Line intersects the galaxy map, making every portal coordinate look like evidence in a conspiracy engineered by the Authorless.', 'la ligne rose croise la carte galactique, transformant chaque coordonnee de portail en preuve d une conspiration du Sans-Auteur.'],
    motif: 'castle',
    colors: ['#251d16', '#050403', '#c69b50']
  }),
  defineCanonicalUniverse({
    key: 'evil_dead_2013',
    universe: 'Evil Dead (2013)',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Evil Dead (remake)',
    stage: 'Abomination Cabin Blood Rain',
    boss: 'The Abomination',
    cast: [
      ['mia_allen_ed2013', 'Mia Allen', 'slayer'],
      ['david_allen_ed2013', 'David Allen', 'tactical'],
      ['eric_ed2013', 'Eric', 'hacker']
    ],
    enemies: ['Possessed Friend', 'Cellar Deadite', 'Demonic Tree Root'],
    bosses: ['Possessed Mia', 'The Abomination'],
    gear: [
      ['chainsaw', 'Cabin Chainsaw', 'Tronconneuse de la cabane'],
      ['naturom_demonto', 'Naturom Demonto', 'Naturom Demonto'],
      ['nail_gun', 'Improvised Nail Gun', 'Pistolet a clous improvise']
    ],
    event: ['blood_rain', 'Blood Rain Last Stand', 'Dernier combat sous la pluie de sang', 'Mia tears free of the possession and drives the chainsaw through the dominant demon.', 'Mia se libere de la possession et enfonce la tronconneuse dans le demon dominant.'],
    origin: ['A withdrawal intervention in the Knowby cabin becomes a possession massacre after the Naturom Demonto is opened and its warnings are read aloud.', 'Une intervention de sevrage dans la cabane Knowby devient un massacre de possession apres l ouverture du Naturom Demonto et la lecture de ses avertissements.'],
    breach: ['the book counts portal copies as additional souls, accelerating the ritual unless Mia destroys the original demonic signature.', 'le livre compte les copies de portail comme des ames supplementaires et accelere le rite, sauf si Mia detruit la signature demoniaque originale.'],
    motif: 'hauntedset',
    colors: ['#2a0e0d', '#050101', '#d7382f']
  }),
  defineCanonicalUniverse({
    key: 'ash_vs_evil_dead',
    universe: 'Ash vs Evil Dead',
    mediaType: 'series',
    faction: 'horror',
    mode: 'Smash',
    difficulty: 'Very Hard',
    stage: 'Elk Grove Deadite Festival',
    boss: 'Kandar the Destroyer',
    cast: [
      ['ash_williams_aveds', 'Ash Williams', 'slayer'],
      ['pablo_bolivar_aveds', 'Pablo Simon Bolivar', 'hacker'],
      ['kelly_maxwell_aveds', 'Kelly Maxwell', 'tactical']
    ],
    enemies: ['Elk Grove Deadite', 'Kandarian Spawn', 'Demonic Delta'],
    bosses: ['Ruby Knowby', 'Baal'],
    gear: [
      ['boomstick', 'Ash s Boomstick', 'Boomstick d Ash'],
      ['chainsaw_hand', 'Chainsaw Hand', 'Main tronconneuse'],
      ['pablo_talisman', 'El Brujo Talisman', 'Talisman d El Brujo']
    ],
    event: ['delta', 'Delta 88 Deadite Run', 'Charge Deadite de la Delta 88', 'The Delta smashes through the horde while Pablo seals the trail and Kelly covers the exit.', 'La Delta traverse la horde pendant que Pablo scelle la trace et que Kelly couvre la sortie.'],
    origin: ['Decades after the cabin, Ash accidentally unleashes the Kandarian evil again and fights beside Pablo, Kelly, and the complicated Ruby.', 'Des decennies apres la cabane, Ash libere encore le mal kandarien et combat avec Pablo, Kelly et l ambigue Ruby.'],
    breach: ['the Necronomicon mistakes A.R.C.A. records for blank pages and begins writing Deadite futures directly into mission logs.', 'le Necronomicon prend les rapports A.R.C.A. pour des pages vierges et ecrit des futurs Deadites directement dans les journaux de mission.'],
    motif: 'hauntedset',
    colors: ['#22110d', '#040201', '#e34a2d']
  }),
  defineCanonicalUniverse({
    key: 'zorro',
    universe: 'Zorro',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Los Angeles Pueblo Uprising',
    boss: 'Montero Hacienda Siege',
    cast: [
      ['diego_de_la_vega_zorro', 'Diego de la Vega', 'tactical'],
      ['alejandro_murrieta_zorro', 'Alejandro Murrieta', 'slayer'],
      ['elena_montera_zorro', 'Elena Montero', 'hacker']
    ],
    enemies: ['Spanish Lancer', 'Montero Guard', 'Mine Overseer'],
    bosses: ['Captain Love', 'Don Rafael Montero'],
    gear: [
      ['rapier', 'Zorro Rapier', 'Rapiere de Zorro'],
      ['mask', 'Black Zorro Mask', 'Masque noir de Zorro'],
      ['whip', 'Hacienda Whip', 'Fouet de l hacienda']
    ],
    event: ['mark_z', 'Mark of Z', 'Marque du Z', 'Zorro disarms the enemy command and marks its route, granting allies a critical opening.', 'Zorro desarme le commandement ennemi et marque sa route, offrant une ouverture critique aux allies.'],
    origin: ['Behind a black mask, Zorro defends the people of California against corrupt governors, soldiers, and landowners.', 'Derriere un masque noir, Zorro defend le peuple de Californie contre gouverneurs corrompus, soldats et grands proprietaires.'],
    breach: ['the Sans-Auteur forges the Z on civilian homes to turn a symbol of resistance into a warrant, so both Zorros must reclaim its meaning.', 'le Sans-Auteur contrefait le Z sur les maisons civiles pour transformer un symbole de resistance en mandat, et les deux Zorros doivent en reprendre le sens.'],
    motif: 'arcanecity',
    colors: ['#1d1916', '#030303', '#d6ad55']
  }),
  defineCanonicalUniverse({
    key: 'fantomas',
    universe: 'Fantomas',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Paris Masked Crime Chase',
    boss: 'Fantomas Identity Vault',
    cast: [
      ['commissaire_juve_fantomas', 'Commissaire Juve', 'tactical'],
      ['fandor_fantomas', 'Jerome Fandor', 'hacker'],
      ['helene_fantomas', 'Helene', 'slayer']
    ],
    enemies: ['Masked Henchman', 'False Police Double', 'Gadget Ambusher'],
    bosses: ['Fantomas Disguise Chain', 'Fantomas Escape Machine'],
    gear: [
      ['mask_scanner', 'Fantomas Mask Scanner', 'Scanner de masque Fantomas'],
      ['cigar_gadget', 'Juve Cigar Gadget', 'Gadget-cigare de Juve'],
      ['press_camera', 'Fandor Press Camera', 'Appareil de presse de Fandor']
    ],
    event: ['juve_trap', 'Juve s Impossible Trap', 'Piege impossible de Juve', 'Juve closes every exit at once; even though Fantomas escapes, all lesser doubles are exposed.', 'Juve ferme toutes les sorties a la fois ; meme si Fantomas s echappe, tous ses doubles sont exposes.'],
    origin: ['Fantomas uses perfect disguises, theatrical crimes, and impossible escapes while Juve and Fandor chase him across France.', 'Fantomas emploie deguisements parfaits, crimes theatraux et evasions impossibles tandis que Juve et Fandor le poursuivent a travers la France.'],
    breach: ['his masks copy hero signatures well enough to enter restricted portals, turning identity verification into the central A.R.C.A. investigation.', 'ses masques copient assez bien les signatures de heros pour entrer dans les portails restreints, faisant de l identite l enquete centrale d A.R.C.A.'],
    motif: 'arcanecity',
    colors: ['#182430', '#030506', '#6fa5c9']
  }),
  defineCanonicalUniverse({
    key: 'men_in_black',
    universe: 'Men in Black',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'MIB Headquarters Galaxy Lockdown',
    boss: 'Edgar Bug Galaxy Theft',
    cast: [
      ['agent_j_mib', 'Agent J', 'slayer'],
      ['agent_k_mib', 'Agent K', 'tactical'],
      ['agent_l_mib', 'Agent L', 'hacker']
    ],
    enemies: ['Arquillian Impostor', 'Alien Fugitive', 'Syndicate Bug Drone'],
    bosses: ['Serleena', 'Edgar the Bug'],
    gear: [
      ['noisy_cricket', 'Noisy Cricket', 'Noisy Cricket'],
      ['neuralyzer', 'Neuralyzer', 'Neuralyseur'],
      ['galaxy', 'Galaxy Marble', 'Galaxie miniature']
    ],
    event: ['neuralyze', 'Mass Neuralyzer Flash', 'Flash neuralyseur collectif', 'A calibrated flash erases hostile targeting data without removing allied mission memory.', 'Un flash calibre efface les donnees de ciblage hostiles sans retirer la memoire de mission alliee.'],
    origin: ['A secret agency regulates alien life on Earth with hidden technology, cover stories, neuralyzers, and agents J and K.', 'Une agence secrete regule la vie extraterrestre sur Terre avec technologies cachees, couvertures, neuralyseurs et les agents J et K.'],
    breach: ['aliens begin using universe packs as forged immigration papers, while the Neuralyzer threatens the very memories A.R.C.A. needs to stabilize reality.', 'des extraterrestres utilisent les packs d univers comme faux papiers, tandis que le Neuralyseur menace les souvenirs dont A.R.C.A. a besoin pour stabiliser la realite.'],
    motif: 'facility',
    colors: ['#111b1e', '#020304', '#71dfd8']
  }),
  defineCanonicalUniverse({
    key: 'twenty_eight_days_later',
    universe: '28 Days Later',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: '28 jours plus tard',
    stage: 'London Rage Evacuation',
    boss: 'Mansion Soldier Lockdown',
    cast: [
      ['jim_28dl', 'Jim', 'slayer'],
      ['selena_28dl', 'Selena', 'tactical'],
      ['hannah_28dl', 'Hannah', 'hacker']
    ],
    enemies: ['Rage Infected', 'Tunnel Infected', 'Rogue Soldier'],
    bosses: ['Mailers Chain Break', 'Major West'],
    gear: [
      ['machete', 'Selena s Machete', 'Machette de Selena'],
      ['taxi_keys', 'London Taxi Keys', 'Cles du taxi londonien'],
      ['hello_banner', 'HELLO Rescue Banner', 'Banniere de secours HELLO']
    ],
    event: ['mailers_release', 'Mailer Release', 'Liberation de Mailer', 'The chained infected crashes through the hostile garrison while survivors sprint for extraction.', 'L infecte enchaine traverse la garnison hostile pendant que les survivants courent vers l extraction.'],
    origin: ['A laboratory Rage virus empties Britain in weeks, leaving Jim, Selena, and Hannah between infected crowds and predatory survivors.', 'Un virus de Rage vide la Grande-Bretagne en quelques semaines, laissant Jim, Selena et Hannah entre foules infectees et survivants predateurs.'],
    breach: ['Rage crosses portals in seconds but burns out quickly, turning every delayed extraction into a brutal timing problem.', 'la Rage traverse les portails en quelques secondes mais s epuise vite, transformant chaque extraction retardee en probleme brutal de timing.'],
    motif: 'wasteland',
    colors: ['#24120f', '#040201', '#d4432f']
  }),
  defineCanonicalUniverse({
    key: 'home_alone',
    universe: 'Home Alone',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Medium',
    titleFr: 'Maman, j ai rate l avion',
    stage: 'McCallister House Trap Grid',
    boss: 'Wet Bandits Final Entry',
    cast: [
      ['kevin_mccallister', 'Kevin McCallister', 'hacker'],
      ['old_man_marley', 'Old Man Marley', 'marine'],
      ['kate_mccallister', 'Kate McCallister', 'tactical']
    ],
    enemies: ['Wet Bandit Decoy', 'Basement Furnace Fear', 'False Delivery Intruder'],
    bosses: ['Harry Lime', 'Marv Murchins'],
    gear: [
      ['paint_can', 'Stairwell Paint Can', 'Pot de peinture de l escalier'],
      ['tarantula', 'Buzz s Tarantula', 'Tarentule de Buzz'],
      ['talkboy', 'Talkboy Recorder', 'Enregistreur Talkboy']
    ],
    event: ['trap_plan', 'Battle Plan Montage', 'Montage du plan de bataille', 'Kevin converts every empty tile into a visible trap and routes enemies through the safest chain.', 'Kevin transforme chaque case vide en piege visible et dirige les ennemis dans la chaine la plus sure.'],
    origin: ['Forgotten at home for Christmas, Kevin defends his family house from Harry and Marv with improvised traps and nerve.', 'Oublie chez lui pour Noel, Kevin defend la maison familiale contre Harry et Marv avec des pieges improvises et du sang-froid.'],
    breach: ['his floor plan overlays the Citadel, and harmless household props become real tactical cover without losing their comic timing.', 'son plan de maison se superpose a la Citadelle, et les accessoires domestiques deviennent de vraies couvertures tactiques sans perdre leur rythme comique.'],
    motif: 'arcanecity',
    colors: ['#25352f', '#050706', '#c83f39']
  }),
  defineCanonicalUniverse({
    key: 'last_action_hero',
    universe: 'Last Action Hero',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Jack Slater Movie Premiere',
    boss: 'Benedict Fourth-Wall Escape',
    cast: [
      ['jack_slater_lah', 'Jack Slater', 'marine'],
      ['danny_madigan_lah', 'Danny Madigan', 'hacker'],
      ['whiskers_lah', 'Whiskers', 'slayer']
    ],
    enemies: ['Movie Henchman', 'Dynamite Gangster', 'Premiere Assassin'],
    bosses: ['Mr. Benedict', 'The Ripper'],
    gear: [
      ['ticket', 'Houdini Golden Ticket', 'Ticket dore de Houdini'],
      ['desert_eagle', 'Jack Slater Desert Eagle', 'Desert Eagle de Jack Slater'],
      ['script_page', 'Action Script Page', 'Page de scenario d action']
    ],
    event: ['big_gun', 'Action-Movie Ammunition Rule', 'Regle des munitions de film d action', 'Jack fires an impossible barrage until Danny identifies the real-world limit that ends the scene.', 'Jack tire une salve impossible jusqu a ce que Danny trouve la limite du monde reel qui termine la scene.'],
    origin: ['A magical ticket pulls Danny into the action films of Jack Slater, then lets villains escape into a world where consequences are real.', 'Un ticket magique attire Danny dans les films d action de Jack Slater, puis laisse les mechants gagner un monde ou les consequences sont reelles.'],
    breach: ['the golden ticket can cross any portal without clearance, making genre rules contagious across the Nexus.', 'le ticket dore traverse tout portail sans autorisation, rendant les regles de genre contagieuses dans le Nexus.'],
    motif: 'arcanecity',
    colors: ['#15293a', '#030609', '#f1b83e']
  }),
  defineCanonicalUniverse({
    key: 'minions',
    universe: 'Minions',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Medium',
    stage: 'Villain-Con Crown Heist',
    boss: 'Scarlet Overkill Coronation',
    cast: [
      ['kevin_minions', 'Kevin', 'tactical'],
      ['stuart_minions', 'Stuart', 'slayer'],
      ['bob_minions', 'Bob', 'hacker']
    ],
    enemies: ['Villain-Con Guard', 'Crown Vault Bot', 'Overkill Henchman'],
    bosses: ['Herb Overkill', 'Scarlet Overkill'],
    gear: [
      ['fart_gun', 'Freeze Ray Fart Gun', 'Pistolet a pet gelant'],
      ['crown', 'Stolen Royal Crown', 'Couronne royale volee'],
      ['banana', 'Emergency Banana', 'Banane d urgence']
    ],
    event: ['king_bob', 'King Bob Decree', 'Decret du roi Bob', 'Bob accidentally pardons the squad and redirects every royal guard toward the boss.', 'Bob gracie accidentellement l escouade et redirige toute la garde royale vers le boss.'],
    origin: ['Kevin, Stuart, and Bob search through history for a villain worthy of their chaotic loyalty and find Scarlet Overkill.', 'Kevin, Stuart et Bob parcourent l histoire a la recherche d un mechant digne de leur loyaut chaotique et trouvent Scarlet Overkill.'],
    breach: ['the trio adopts the strongest portal as a new boss, causing unstable allegiance changes that A.R.C.A. can exploit but never fully predict.', 'le trio adopte le portail le plus puissant comme nouveau chef, provoquant des changements d allegeance qu A.R.C.A. peut exploiter sans les predire.'],
    motif: 'arcanecity',
    colors: ['#2f2b12', '#070603', '#f4d74d']
  }),
  defineCanonicalUniverse({
    key: 'lilo_stitch',
    universe: 'Lilo & Stitch',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'Lilo & Stitch',
    stage: 'Kauai Galactic Federation Pursuit',
    boss: 'Gantu Prisoner Transport',
    cast: [
      ['stitch_626', 'Stitch', 'slayer'],
      ['lilo_pelekai', 'Lilo Pelekai', 'hacker'],
      ['nani_pelekai', 'Nani Pelekai', 'tactical']
    ],
    enemies: ['Federation Security Bot', 'Experiment Pod Drone', 'Gantu Trooper'],
    bosses: ['Captain Gantu', 'Jumba Experiment Swarm'],
    gear: [
      ['plasma_blaster', 'Experiment 626 Plasma Blaster', 'Blaster plasma de l Experience 626'],
      ['experiment_pod', 'Experiment Pod', 'Capsule d experience'],
      ['ohana_photo', 'Ohana Photograph', 'Photographie Ohana']
    ],
    event: ['ohana', 'Ohana Rescue', 'Sauvetage Ohana', 'The family refuses to leave anyone behind, pulling a defeated ally back before Stitch clears the route.', 'La famille refuse d abandonner qui que ce soit, ramene un allie vaincu puis laisse Stitch nettoyer la route.'],
    origin: ['Genetic experiment 626 escapes to Kauai and learns from Lilo and Nani that family means nobody is left behind.', 'L experience genetique 626 fuit vers Kauai et apprend avec Lilo et Nani que la famille signifie que personne n est abandonne.'],
    breach: ['A.R.C.A. classifies Stitch as an anomaly, but Lilo forces the organization to recognize him as family before he becomes another contained weapon.', 'A.R.C.A. classe Stitch comme anomalie, mais Lilo oblige l organisation a le reconnaitre comme famille avant qu il ne redevienne une arme confinee.'],
    motif: 'shipdeck',
    colors: ['#12334a', '#020709', '#55b7e8']
  }),
  defineCanonicalUniverse({
    key: 'ben_10',
    universe: 'Ben 10',
    mediaType: 'series',
    faction: 'sciFi',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Bellwood Omnitrix Invasion',
    boss: 'Vilgax Omnitrix Override',
    cast: [
      ['ben_tennyson', 'Ben Tennyson', 'slayer'],
      ['gwen_tennyson', 'Gwen Tennyson', 'hacker'],
      ['kevin_levin', 'Kevin Levin', 'tactical']
    ],
    enemies: ['DNA Alien', 'Forever Knight', 'Vilgax Drone'],
    bosses: ['Kevin 11 Mutation', 'Vilgax'],
    gear: [
      ['omnitrix_core', 'Omnitrix Core', 'Noyau Omnitrix'],
      ['charm', 'Charm of Bezel', 'Charme de Bezel'],
      ['plumber_badge', 'Plumber Badge', 'Insigne des Plombiers']
    ],
    event: ['master_control', 'Omnitrix Master Control', 'Controle maitre de l Omnitrix', 'Ben cycles through the exact alien forms needed to counter every enemy class.', 'Ben enchaine les formes extraterrestres exactes pour contrer chaque classe ennemie.'],
    origin: ['Ben Tennyson uses the Omnitrix to transform into alien heroes while Gwen, Kevin, and the Plumbers confront cosmic threats.', 'Ben Tennyson utilise l Omnitrix pour devenir des heros extraterrestres tandis que Gwen, Kevin et les Plombiers affrontent des menaces cosmiques.'],
    breach: ['the Omnitrix samples entire universe signatures as DNA, risking transformations that contain worlds instead of species.', 'l Omnitrix echantillonne des signatures d univers entieres comme ADN, risquant des transformations qui contiennent des mondes plutot que des especes.'],
    motif: 'facility',
    colors: ['#142a1d', '#030604', '#56ef54']
  }),
  defineCanonicalUniverse({
    key: 'sonic',
    universe: 'Sonic',
    mediaType: 'game',
    faction: 'cyber',
    mode: 'Smash',
    difficulty: 'Hard',
    stage: 'Green Hill Death Egg Run',
    boss: 'Eggman Death Egg Robot',
    cast: [
      ['sonic_hedgehog', 'Sonic', 'slayer'],
      ['miles_tails_prower', 'Miles Tails Prower', 'hacker'],
      ['knuckles_echidna', 'Knuckles', 'marine']
    ],
    enemies: ['Moto Bug', 'Egg Pawn', 'E-100 Robot'],
    bosses: ['Metal Sonic', 'Dr. Eggman'],
    gear: [
      ['speed_shoes', 'Speed Shoes', 'Chaussures de vitesse'],
      ['chaos_emerald', 'Chaos Emerald', 'Emeraude du Chaos'],
      ['power_ring', 'Power Ring', 'Anneau de puissance']
    ],
    event: ['super_sonic', 'Super Sonic Chaos Rush', 'Charge Chaos de Super Sonic', 'Seven emeralds transform Sonic and turn portal turbulence into a screen-crossing strike.', 'Sept emeraudes transforment Sonic et convertissent la turbulence du portail en frappe traversant tout l ecran.'],
    origin: ['Sonic and his friends defend their world s freedom and Chaos Emeralds from Eggman s machines and reality-scale schemes.', 'Sonic et ses amis defendent la liberte de leur monde et les Emeraudes du Chaos contre les machines et projets d Eggman.'],
    breach: ['rings begin forming stable micro-portals, and Eggman chains them into a Death Egg route through every unlocked universe.', 'les anneaux deviennent des micro-portails stables, et Eggman les relie en route Death Egg a travers chaque univers debloque.'],
    motif: 'arcanecity',
    colors: ['#12365c', '#02070b', '#f2d83e']
  }),
  defineCanonicalUniverse({
    key: 'avatar_navi',
    universe: 'Avatar (Na\'vi)',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Avatar (Na vi)',
    stage: 'Pandora Tree of Souls Defense',
    boss: 'RDA Dragon Assault Ship',
    cast: [
      ['jake_sully_avatar', 'Jake Sully', 'slayer'],
      ['neytiri_avatar', 'Neytiri', 'tactical'],
      ['kiri_avatar', 'Kiri', 'hacker']
    ],
    enemies: ['RDA SecOps Marine', 'AMP Suit', 'Recombinant Hunter'],
    bosses: ['Colonel Quaritch', 'RDA Dragon Gunship'],
    gear: [
      ['na_vi_bow', 'Na vi Hunting Bow', 'Arc de chasse Na vi'],
      ['queue_link', 'Tsaheylu Link Braid', 'Tresse de lien Tsaheylu'],
      ['unobtanium', 'Unobtanium Sample', 'Echantillon d unobtanium']
    ],
    event: ['eywa', 'Eywa Planetary Response', 'Reponse planetaire d Eywa', 'Pandora s wildlife converges on the marked invaders while allied riders gain full mobility.', 'La faune de Pandora converge sur les envahisseurs marques tandis que les cavaliers allies gagnent une mobilite totale.'],
    origin: ['On Pandora, the Na vi live through Eywa s biological network while the RDA extracts resources by military force.', 'Sur Pandora, les Na vi vivent a travers le reseau biologique d Eywa tandis que la RDA extrait les ressources par la force militaire.'],
    breach: ['Eywa hears Mosaic City as a severed neural forest and sends roots through portals to reconnect its isolated memories.', 'Eywa entend la Cite-Mosaique comme une foret neurale sectionnee et envoie des racines a travers les portails pour reconnecter ses souvenirs isoles.'],
    motif: 'wasteland',
    colors: ['#0d2f34', '#020708', '#5ce0d3']
  }),
  defineCanonicalUniverse({
    key: 'ice_age',
    universe: 'Ice Age',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'L Age de glace',
    stage: 'Glacier Migration Pass',
    boss: 'Continental Drift Ice Wall',
    cast: [
      ['manny_iceage', 'Manny', 'marine'],
      ['sid_iceage', 'Sid', 'hacker'],
      ['diego_iceage', 'Diego', 'slayer']
    ],
    enemies: ['Dodo Mob', 'Pirate Ape', 'Ice Cave Predator'],
    bosses: ['Soto', 'Captain Gutt'],
    gear: [
      ['acorn', 'Scrat s Acorn', 'Gland de Scrat'],
      ['tusk_guard', 'Mammoth Tusk Guard', 'Protection de defense de mammouth'],
      ['ice_bridge', 'Glacier Bridge Shard', 'Eclat de pont glaciaire']
    ],
    event: ['scrat_crack', 'Scrat Continental Crack', 'Fissure continentale de Scrat', 'Scrat loses the acorn and accidentally splits the battlefield away from the enemy boss.', 'Scrat perd son gland et separe accidentellement le champ de bataille du boss ennemi.'],
    origin: ['Manny, Sid, and Diego form an unlikely herd while migrations, melting ice, and continental disasters reshape their prehistoric world.', 'Manny, Sid et Diego forment une troupe improbable tandis que migrations, fonte des glaces et catastrophes continentales transforment leur monde prehistorique.'],
    breach: ['Scrat s acorn falls through a portal and cracks the multiverse map, forcing the herd to escort displaced species home.', 'le gland de Scrat tombe dans un portail et fissure la carte du multivers, obligeant la troupe a raccompagner des especes deplacees.'],
    motif: 'wasteland',
    colors: ['#17313d', '#030708', '#a8e2f0']
  }),
  defineCanonicalUniverse({
    key: 'stan_helsing',
    universe: 'Stan Helsing',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Smash',
    difficulty: 'Medium',
    stage: 'Stormy Night Monster Karaoke',
    boss: 'Horror Parody Monster Lineup',
    cast: [
      ['stan_helsing', 'Stan Helsing', 'hacker'],
      ['nadine_helsing', 'Nadine', 'tactical'],
      ['teddy_helsing', 'Teddy', 'slayer']
    ],
    enemies: ['Needleface Parody', 'Lucky Doll Parody', 'Fweddy Parody'],
    bosses: ['Mason Parody', 'Monster Karaoke Host'],
    gear: [
      ['karaoke_mic', 'Monster Karaoke Microphone', 'Micro de karaoke monstrueux'],
      ['video_scanner', 'Video Store Horror Scanner', 'Scanner horreur du video-club'],
      ['helsing_badge', 'Helsing Family Badge', 'Insigne de la famille Helsing']
    ],
    event: ['karaoke', 'Monster Karaoke Counter', 'Contre du karaoke monstrueux', 'Stan survives the chorus long enough to expose every parody monster s obvious weakness.', 'Stan survit au refrain assez longtemps pour reveler la faiblesse evidente de chaque monstre parodique.'],
    origin: ['Video-store clerk Stan discovers a dubious Helsing legacy while trapped in a town populated by parody versions of horror icons.', 'Le vendeur de video-club Stan decouvre un heritage Helsing douteux dans une ville peuplee de versions parodiques d icones horrifiques.'],
    breach: ['the copies arrive without their original rules, so A.R.C.A. must treat parody timing as a real combat system.', 'les copies arrivent sans les regles originales, et A.R.C.A. doit traiter le rythme parodique comme un vrai systeme de combat.'],
    motif: 'hauntedset',
    colors: ['#24122b', '#050205', '#c75bc9']
  }),
  defineCanonicalUniverse({
    key: 'superhero_movie',
    universe: 'Superhero Movie',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Medium',
    stage: 'Empire City Dragonfly Disaster',
    boss: 'Hourglass Life-Drain Machine',
    cast: [
      ['rick_riker_sm', 'Rick Riker / Dragonfly', 'slayer'],
      ['trey_sm', 'Trey', 'hacker'],
      ['jill_johnson_sm', 'Jill Johnson', 'tactical']
    ],
    enemies: ['Corporate Henchman', 'Mutant Animal Gag', 'Award Ceremony Guard'],
    bosses: ['Lou Landers', 'The Hourglass'],
    gear: [
      ['dragonfly_wing', 'Dragonfly Wing Harness', 'Harnais d ailes de Dragonfly'],
      ['nail_gun', 'Accidental Nail Gun', 'Pistolet a clous accidentel'],
      ['hourglass_vial', 'Hourglass Energy Vial', 'Fiole d energie Hourglass']
    ],
    event: ['dragonfly_landing', 'Dragonfly Hero Landing', 'Atterrissage heroique de Dragonfly', 'Rick misses the landing, demolishes the enemy cover, and somehow saves the squad.', 'Rick rate son atterrissage, detruit la couverture ennemie et sauve quand meme l escouade.'],
    origin: ['Rick Riker gains clumsy insect powers and becomes Dragonfly while the Hourglass drains lives to remain young.', 'Rick Riker obtient des pouvoirs d insecte maladroits et devient Dragonfly tandis que l Hourglass vole des vies pour rester jeune.'],
    breach: ['the parody world copies every heroic protocol at the wrong scale, producing dangerous results that still satisfy Nexus mission conditions.', 'le monde parodique copie chaque protocole heroique a la mauvaise echelle, avec des resultats dangereux qui valident pourtant les objectifs du Nexus.'],
    motif: 'arcanecity',
    colors: ['#172d3f', '#030609', '#e24a46']
  }),
  defineCanonicalUniverse({
    key: 'assassins_creed',
    universe: 'Assassin\'s Creed',
    mediaType: 'game',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'Assassin s Creed',
    stage: 'Abstergo Animus Memory Corridor',
    boss: 'Templar Grand Master Sequence',
    cast: [
      ['ezio_auditore_ac', 'Ezio Auditore', 'slayer'],
      ['desmond_miles_ac', 'Desmond Miles', 'hacker'],
      ['kassandra_ac', 'Kassandra', 'tactical']
    ],
    enemies: ['Templar Guard', 'Abstergo Security', 'Animus Corruption'],
    bosses: ['Cesare Borgia', 'Rodrigo Borgia'],
    gear: [
      ['hidden_blade', 'Hidden Blade', 'Lame secrete'],
      ['apple_eden', 'Apple of Eden', 'Pomme d Eden'],
      ['animus_key', 'Animus Memory Key', 'Cle memoire de l Animus']
    ],
    event: ['leap_faith', 'Leap of Faith Assassination', 'Assassinat par saut de la foi', 'An Eagle Vision scan exposes the command target before a synchronized aerial strike.', 'Un scan de Vision d Aigle revele la cible de commandement avant une frappe aerienne synchronisee.'],
    origin: ['Assassins and Templars fight across history over freedom, control, Pieces of Eden, and memories reconstructed by the Animus.', 'Assassins et Templiers s affrontent a travers l histoire pour la liberte, le controle, les Fragments d Eden et les souvenirs reconstruits par l Animus.'],
    breach: ['Abstergo records entire universes as genetic memories, while Desmond detects the Authorless hiding in synchronization gaps.', 'Abstergo enregistre des univers entiers comme memoires genetiques, tandis que Desmond detecte le Sans-Auteur dans les ruptures de synchronisation.'],
    motif: 'castle',
    colors: ['#182328', '#030506', '#d14c43']
  }),
  defineCanonicalUniverse({
    key: 'big_bang_theory',
    universe: 'The Big Bang Theory',
    mediaType: 'series',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'The Big Bang Theory',
    stage: 'Apartment 4A Physics Paradox',
    boss: 'Infinite Roommate Agreement',
    cast: [
      ['sheldon_cooper_tbbt', 'Sheldon Cooper', 'hacker'],
      ['leonard_hofstadter_tbbt', 'Leonard Hofstadter', 'tactical'],
      ['penny_tbbt', 'Penny', 'slayer']
    ],
    enemies: ['Broken Equation', 'University Rival', 'Comic Store Queue'],
    bosses: ['Kripke Robot Duel', 'Roommate Agreement Singularity'],
    gear: [
      ['whiteboard', 'Caltech Whiteboard', 'Tableau blanc du Caltech'],
      ['napkin', 'Signed Leonard Nimoy Napkin', 'Serviette signee Leonard Nimoy'],
      ['spot', 'Sheldon s Spot Marker', 'Marqueur de la place de Sheldon']
    ],
    event: ['bazinga', 'Bazinga Misdirection', 'Diversion Bazinga', 'Sheldon predicts the obvious response, while Penny solves the human problem the model ignored.', 'Sheldon predit la reponse evidente tandis que Penny resout le probleme humain ignore par le modele.'],
    origin: ['Four scientists and their friends turn Pasadena apartments, Caltech, fandom, and relationships into a long social experiment.', 'Quatre scientifiques et leurs proches transforment appartements de Pasadena, Caltech, fandom et relations en longue experience sociale.'],
    breach: ['Sheldon treats portal behavior as a solvable theory until friendship variables repeatedly invalidate his perfect model.', 'Sheldon traite les portails comme une theorie soluble jusqu a ce que les variables d amitie invalident sans cesse son modele parfait.'],
    motif: 'facility',
    colors: ['#203047', '#040609', '#e15c45']
  }),
  defineCanonicalUniverse({
    key: 'minecraft',
    universe: 'Minecraft',
    mediaType: 'game',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    stage: 'Overworld Stronghold End Portal',
    boss: 'Ender Dragon',
    cast: [
      ['steve_minecraft', 'Steve', 'marine'],
      ['alex_minecraft', 'Alex', 'tactical'],
      ['villager_librarian_mc', 'Librarian Villager', 'hacker']
    ],
    enemies: ['Creeper', 'Skeleton Archer', 'Enderman', 'Piglin Brute'],
    bosses: ['Wither', 'Ender Dragon'],
    gear: [
      ['diamond_pickaxe', 'Diamond Pickaxe', 'Pioche en diamant'],
      ['totem', 'Totem of Undying', 'Totem d immortalite'],
      ['ender_pearl', 'Ender Pearl', 'Perle de l End']
    ],
    event: ['creative_build', 'Emergency Build', 'Construction d urgence', 'The squad instantly raises block cover, a bridge, and a redstone trap from collected materials.', 'L escouade construit instantanement une couverture, un pont et un piege redstone avec les materiaux collectes.'],
    origin: ['A block world of survival, mining, crafting, redstone, the Nether, and the End lets players reshape nearly every local rule.', 'Un monde cubique de survie, minage, artisanat, redstone, Nether et End permet aux joueurs de remodeler presque chaque regle locale.'],
    breach: ['chunks load beyond their universe boundary and begin replacing Mosaic City rooms with editable blocks and hostile spawn rules.', 'des chunks se chargent au-dela de leur univers et remplacent des salles de la Cite-Mosaique par des blocs editables et des regles d apparition hostiles.'],
    motif: 'wasteland',
    colors: ['#20341c', '#040704', '#68b84f']
  }),
  defineCanonicalUniverse({
    key: 'smurfs',
    universe: 'The Smurfs',
    mediaType: 'series',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Medium',
    titleFr: 'Les Schtroumpfs',
    stage: 'Smurf Village Gargamel Raid',
    boss: 'Gargamel Essence Extractor',
    cast: [
      ['papa_smurf', 'Papa Smurf', 'hacker'],
      ['smurfette', 'Smurfette', 'slayer'],
      ['hefty_smurf', 'Hefty Smurf', 'marine']
    ],
    enemies: ['Gargamel Trap', 'Azrael Pounce', 'Purple Smurf'],
    bosses: ['Azrael', 'Gargamel'],
    gear: [
      ['sarsaparilla', 'Sarsaparilla Ration', 'Ration de salsepareille'],
      ['potion', 'Papa Smurf Potion', 'Potion du Grand Schtroumpf'],
      ['magic_flute', 'Magic Flute Note', 'Note de flute magique']
    ],
    event: ['village_call', 'Smurf Village Rally', 'Ralliement du village schtroumpf', 'Every available Smurf completes one tiny task, combining into a full-field rescue.', 'Chaque Schtroumpf accomplit une petite tache qui se combine en sauvetage de tout le terrain.'],
    origin: ['A hidden village of tiny blue Smurfs survives Gargamel s schemes through cooperation, craft, magic, and specialized talents.', 'Un village cache de petits Schtroumpfs bleus survit aux plans de Gargamel par la cooperation, l artisanat, la magie et des talents specialises.'],
    breach: ['Gargamel mistakes blue portal fragments for Smurf essence, while Papa Smurf realizes their communal memory can stabilize damaged rooms.', 'Gargamel confond les fragments bleus de portail avec l essence schtroumpf, tandis que le Grand Schtroumpf comprend que leur memoire commune stabilise les salles endommagees.'],
    motif: 'castle',
    colors: ['#17406b', '#03080d', '#e4483f']
  }),
  defineCanonicalUniverse({
    key: 'tintin',
    universe: 'Tintin',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Marlinspike Unicorn Treasure Trail',
    boss: 'Red Rackham Secret Fleet',
    cast: [
      ['tintin_hero', 'Tintin', 'tactical'],
      ['captain_haddock', 'Captain Haddock', 'marine'],
      ['professor_calculus', 'Professor Calculus', 'hacker']
    ],
    enemies: ['Bordurian Agent', 'Smuggler Crew', 'False Detective'],
    bosses: ['Colonel Sponsz', 'Rastapopoulos'],
    gear: [
      ['unicorn_scroll', 'Unicorn Parchment', 'Parchemin de la Licorne'],
      ['shark_sub', 'Calculus Shark Submarine', 'Sous-marin requin de Tournesol'],
      ['snowy_flask', 'Snowy Rescue Flask', 'Flasque de secours de Milou']
    ],
    event: ['snowy_clue', 'Snowy Finds the Clue', 'Milou trouve l indice', 'Snowy uncovers the missing evidence, revealing the real objective and all disguised enemies.', 'Milou retrouve la preuve manquante, revele le vrai objectif et tous les ennemis deguises.'],
    origin: ['Reporter Tintin, Snowy, Haddock, and Calculus travel through conspiracies, expeditions, treasure hunts, and political dangers.', 'Le reporter Tintin, Milou, Haddock et Tournesol traversent conspirations, expeditions, chasses au tresor et dangers politiques.'],
    breach: ['a blank speech balloon follows Tintin between portals and removes clues from events, forcing the reporter to reconstruct the missing narrative.', 'une bulle blanche suit Tintin entre les portails et retire les indices des evenements, obligeant le reporter a reconstruire le recit manquant.'],
    motif: 'shipdeck',
    colors: ['#17334a', '#03070a', '#e6b448']
  }),
  defineCanonicalUniverse({
    key: 'asterix_obelix',
    universe: 'Asterix & Obelix',
    mediaType: 'manga',
    faction: 'arcane',
    mode: 'Smash',
    difficulty: 'Medium',
    titleFr: 'Asterix et Obelix',
    stage: 'Indomitable Gaul Village',
    boss: 'Roman Camp Grand Assault',
    cast: [
      ['asterix_gaul', 'Asterix', 'slayer'],
      ['obelix_gaul', 'Obelix', 'marine'],
      ['getafix_gaul', 'Getafix', 'hacker']
    ],
    enemies: ['Roman Legionary', 'Pirate Crew', 'Norman Warrior'],
    bosses: ['Centurion Caius Bonus', 'Julius Caesar Expedition'],
    gear: [
      ['magic_potion', 'Magic Potion Gourd', 'Gourde de potion magique'],
      ['menhir', 'Obelix Menhir', 'Menhir d Obelix'],
      ['laurel', 'Caesar Laurel', 'Lauriers de Cesar']
    ],
    event: ['potion_charge', 'Magic Potion Village Charge', 'Charge du village sous potion', 'The village drinks one measured cauldron and sends the entire enemy formation flying.', 'Le village boit un chaudron mesure et expulse toute la formation ennemie.'],
    origin: ['One small Gaulish village resists Roman occupation through courage, comedy, Getafix s potion, and Obelix s permanent strength.', 'Un petit village gaulois resiste a l occupation romaine par le courage, la comedie, la potion de Panoramix et la force permanente d Obelix.'],
    breach: ['Rome claims every new portal as a province, while the village treats the multiverse as one more camp to dismantle before the banquet.', 'Rome revendique chaque portail comme province, tandis que le village traite le multivers comme un camp de plus a demonter avant le banquet.'],
    motif: 'fortress',
    colors: ['#233b20', '#050804', '#e2b64a']
  }),
  defineCanonicalUniverse({
    key: 'zootopia',
    universe: 'Zootopia',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Zootopie',
    stage: 'Zootopia Night Howler Case',
    boss: 'Bellwether Fear Conspiracy',
    cast: [
      ['judy_hopps', 'Judy Hopps', 'tactical'],
      ['nick_wilde', 'Nick Wilde', 'hacker'],
      ['chief_bogo', 'Chief Bogo', 'marine']
    ],
    enemies: ['Night Howler Shooter', 'Savage Predator', 'Conspiracy Guard'],
    bosses: ['Doug Laboratory Cell', 'Dawn Bellwether'],
    gear: [
      ['carrot_recorder', 'Carrot Recorder Pen', 'Stylo-carotte enregistreur'],
      ['fox_repellent', 'Fox Repellent Can', 'Spray anti-renard'],
      ['night_howler', 'Night Howler Antidote', 'Antidote aux hurleurs nocturnes']
    ],
    event: ['case_break', 'Hopps-Wilde Case Break', 'Resolution Hopps-Wilde', 'Judy secures the evidence while Nick draws the mastermind into confessing the active scheme.', 'Judy securise les preuves tandis que Nick pousse le cerveau du complot a avouer le plan actif.'],
    origin: ['Judy Hopps and Nick Wilde expose a plot using Night Howlers to turn a diverse mammal city against itself.', 'Judy Hopps et Nick Wilde revelent un complot utilisant les hurleurs nocturnes pour dresser une ville de mammiferes diverse contre elle-meme.'],
    breach: ['predator and prey classifications leak into A.R.C.A. combat roles, and Bellwether weaponizes those labels to split mixed squads.', 'les classifications predateur et proie contaminent les roles de combat A.R.C.A., et Bellwether arme ces etiquettes pour diviser les escouades mixtes.'],
    motif: 'arcanecity',
    colors: ['#17374a', '#03070a', '#e45f5d']
  }),
  defineCanonicalUniverse({
    key: 'inside_out',
    universe: 'Inside Out',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Hard',
    titleFr: 'Vice-Versa',
    stage: 'Headquarters Memory Core Collapse',
    boss: 'Belief System Anxiety Storm',
    cast: [
      ['joy_insideout', 'Joy', 'hacker'],
      ['sadness_insideout', 'Sadness', 'tactical'],
      ['anger_insideout', 'Anger', 'slayer']
    ],
    enemies: ['Memory Vacuum', 'Subconscious Fear', 'Sarcasm Chasm Echo'],
    bosses: ['Jangle Nightmare', 'Anxiety Belief Storm'],
    gear: [
      ['core_memory', 'Core Memory Orb', 'Orbe de souvenir essentiel'],
      ['train_ticket', 'Train of Thought Ticket', 'Billet du train de la pensee'],
      ['console_key', 'Headquarters Console Key', 'Cle de console du quartier general']
    ],
    event: ['mixed_memory', 'Mixed Core Memory', 'Souvenir essentiel melange', 'Joy and Sadness stabilize a collapsing memory together, healing allies and preventing forced emotion states.', 'Joie et Tristesse stabilisent ensemble un souvenir qui s effondre, soignent les allies et empechent les emotions imposees.'],
    origin: ['Riley s emotions guide her through memory, personality islands, change, and the discovery that feelings work together rather than alone.', 'Les emotions de Riley la guident a travers souvenirs, iles de personnalite, changement et decouverte que les sentiments fonctionnent ensemble.'],
    breach: ['portal shocks become false core memories in every hero, and the emotions must separate authentic pain from Authorless edits.', 'les chocs de portail deviennent de faux souvenirs essentiels chez chaque heros, et les emotions doivent separer la douleur authentique des retouches du Sans-Auteur.'],
    motif: 'facility',
    colors: ['#293041', '#050609', '#f2d84e']
  }),
  defineCanonicalUniverse({
    key: 'the_conjuring',
    universe: 'The Conjuring',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'Conjuring',
    stage: 'Harrisville Perron Farmhouse',
    boss: 'Bathsheba Possession Rite',
    cast: [
      ['lorraine_warren', 'Lorraine Warren', 'hacker'],
      ['ed_warren', 'Ed Warren', 'tactical'],
      ['carolyn_perron', 'Carolyn Perron', 'horror']
    ],
    enemies: ['Clapping Cellar Spirit', 'Possessed Doll Echo', 'Crooked House Shade'],
    bosses: ['Annabelle Conduit', 'Bathsheba Sherman'],
    gear: [
      ['music_box', 'Perron Music Box', 'Boite a musique Perron'],
      ['exorcism_tape', 'Warren Exorcism Tape', 'Bande d exorcisme Warren'],
      ['rosary', 'Blessed Rosary', 'Rosaire beni']
    ],
    event: ['lorraine_vision', 'Lorraine s Clairvoyant Trace', 'Trace clairvoyante de Lorraine', 'Lorraine identifies the attached spirit and Ed severs its claim before possession completes.', 'Lorraine identifie l esprit attache et Ed brise son emprise avant la possession complete.'],
    origin: ['Ed and Lorraine Warren investigate the Perron farmhouse, where Bathsheba s curse targets Carolyn and her family.', 'Ed et Lorraine Warren enquetent dans la ferme Perron, ou la malediction de Bathsheba vise Carolyn et sa famille.'],
    breach: ['haunted objects attach themselves to unlocked universe packs, turning collection slots into doors unless each artifact is named and sealed.', 'les objets hantes s attachent aux packs d univers debloques, transformant les emplacements de collection en portes si chaque artefact n est pas nomme et scelle.'],
    motif: 'hauntedset',
    colors: ['#1b1a17', '#030303', '#b7aa76']
  }),
  defineCanonicalUniverse({
    key: 'insidious',
    universe: 'Insidious',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'RPG',
    difficulty: 'Very Hard',
    stage: 'The Further Red Door',
    boss: 'Lipstick-Face Demon Lair',
    cast: [
      ['josh_lambert', 'Josh Lambert', 'horror'],
      ['elise_rainier', 'Elise Rainier', 'hacker'],
      ['renai_lambert', 'Renai Lambert', 'tactical']
    ],
    enemies: ['Further Shade', 'Long-Haired Fiend', 'KeyFace Captive'],
    bosses: ['Bride in Black', 'Lipstick-Face Demon'],
    gear: [
      ['gas_lantern', 'Further Gas Lantern', 'Lanterne a gaz du Lointain'],
      ['dice', 'Elise s Loaded Dice', 'Des charges d Elise'],
      ['red_door_key', 'Red Door Key', 'Cle de la porte rouge']
    ],
    event: ['astral_tether', 'Astral Tether Recall', 'Rappel du lien astral', 'Elise follows the silver tether and pulls every displaced ally out of the Further.', 'Elise suit le lien d argent et ramene chaque allie deplace hors du Lointain.'],
    origin: ['The Lambert family and Elise Rainier confront astral projection, possessed bodies, and entities waiting in the Further.', 'La famille Lambert et Elise Rainier affrontent projection astrale, corps possedes et entites qui attendent dans le Lointain.'],
    breach: ['the Further lies between portals and begins intercepting heroes during loading transitions, so A.R.C.A. must anchor both body and spirit.', 'le Lointain se trouve entre les portails et intercepte les heros pendant les transitions, obligeant A.R.C.A. a ancrer corps et esprit.'],
    motif: 'hauntedset',
    colors: ['#220d0d', '#040101', '#bf302b']
  }),
  defineCanonicalUniverse({
    key: 'mad_max_fury_road',
    universe: 'Mad Max: Fury Road',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Smash',
    difficulty: 'Very Hard',
    titleFr: 'Mad Max: Fury Road',
    stage: 'Fury Road War Rig Pursuit',
    boss: 'Immortan Joe Citadel Convoy',
    cast: [
      ['max_rockatansky_fr', 'Max Rockatansky', 'slayer'],
      ['furiosa_fr', 'Imperator Furiosa', 'tactical'],
      ['nux_fr', 'Nux', 'marine']
    ],
    enemies: ['War Boy', 'Polecat Raider', 'Bullet Farmer Gunner'],
    bosses: ['Rictus Erectus', 'Immortan Joe'],
    gear: [
      ['interceptor_wheel', 'Interceptor Steering Wheel', 'Volant de l Interceptor'],
      ['war_rig_harpoon', 'War Rig Harpoon', 'Harpon du War Rig'],
      ['green_seed', 'Green Place Seed Bag', 'Sac de graines du Lieu Vert']
    ],
    event: ['turn_around', 'Furiosa Turnaround', 'Demi-tour de Furiosa', 'The War Rig reverses the entire chase, crushing pursuers and opening the Citadel route.', 'Le War Rig inverse toute la poursuite, ecrase les poursuivants et ouvre la route de la Citadelle.'],
    origin: ['Furiosa, Max, and escaped captives cross the wasteland in a War Rig while Immortan Joe sends every war party after them.', 'Furiosa, Max et les captives en fuite traversent le desert en War Rig tandis qu Immortan Joe lance toutes ses bandes a leur poursuite.'],
    breach: ['portal fuel makes convoys effectively endless, so Furiosa chooses to seize the Nexus Citadel rather than keep fleeing through new wastelands.', 'le carburant de portail rend les convois presque infinis, et Furiosa choisit de prendre la Citadelle du Nexus plutot que de fuir de desert en desert.'],
    motif: 'wasteland',
    colors: ['#3a2112', '#070301', '#e27a2f']
  }),
  defineCanonicalUniverse({
    key: 'john_wick',
    universe: 'John Wick',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Smash',
    difficulty: 'Very Hard',
    stage: 'Continental High Table Contract',
    boss: 'Marquis Sunrise Duel',
    cast: [
      ['john_wick', 'John Wick', 'slayer'],
      ['caine_jw', 'Caine', 'tactical'],
      ['bowery_king_jw', 'Bowery King', 'hacker']
    ],
    enemies: ['High Table Assassin', 'Armored Enforcer', 'Osaka Tracker'],
    bosses: ['Zero', 'Marquis Vincent de Gramont'],
    gear: [
      ['combat_pistol', 'Wick Combat Pistol', 'Pistolet de combat de Wick'],
      ['marker', 'Blood Oath Marker', 'Marqueur de serment de sang'],
      ['gold_coin', 'Continental Gold Coin', 'Piece d or du Continental']
    ],
    event: ['baba_yaga', 'Baba Yaga Focus', 'Concentration Baba Yaga', 'John chains precise shots, grapples, and reloads until every marked contract target falls.', 'John enchaine tirs precis, projections et rechargements jusqu a la chute de chaque cible sous contrat.'],
    origin: ['John Wick is dragged back into a global assassin society governed by markers, Continental rules, and the High Table.', 'John Wick est ramene dans une societe mondiale d assassins gouvernee par marqueurs, regles du Continental et Grande Table.'],
    breach: ['the High Table declares ownership over inter-universe contracts, while John searches for a way to make his final freedom persist across every copy.', 'la Grande Table revendique les contrats inter-univers, tandis que John cherche une liberte finale qui persiste dans chaque copie.'],
    motif: 'arcanecity',
    colors: ['#101923', '#020304', '#d6b15a']
  }),
  defineCanonicalUniverse({
    key: 'spy_kids',
    universe: 'Spy Kids',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Medium',
    titleFr: 'Spy Kids',
    stage: 'Floop Castle Virtual Trap',
    boss: 'Toymaker Game Over Arena',
    cast: [
      ['carmen_cortez', 'Carmen Cortez', 'tactical'],
      ['juni_cortez', 'Juni Cortez', 'hacker'],
      ['gregorio_cortez', 'Gregorio Cortez', 'marine']
    ],
    enemies: ['Thumb-Thumb Guard', 'Magna Man', 'Toymaker Game Bot'],
    bosses: ['Fegan Floop Robot', 'The Toymaker'],
    gear: [
      ['machete_gadget', 'Machete Gadget Pack', 'Pack de gadgets de Machete'],
      ['electro_gum', 'Electroshock Gum', 'Chewing-gum electrochoc'],
      ['dragonfly_sub', 'Dragonfly Mini-Sub', 'Mini sous-marin libellule']
    ],
    event: ['family_spies', 'Cortez Family Operation', 'Operation de la famille Cortez', 'Every family member handles one security layer, opening the objective without triggering the final alarm.', 'Chaque membre de la famille traite une couche de securite et ouvre l objectif sans declencher l alarme finale.'],
    origin: ['Carmen and Juni discover their parents are OSS spies and inherit a world of colorful gadgets, artificial agents, and family missions.', 'Carmen et Juni decouvrent que leurs parents sont espions de l OSS et heritent d un monde de gadgets colores, agents artificiels et missions familiales.'],
    breach: ['Floop s machines turn portal avatars into programmable cast members, and the Cortez family must restore the people behind each role.', 'les machines de Floop transforment les avatars de portail en acteurs programmables, et la famille Cortez doit restaurer les personnes derriere chaque role.'],
    motif: 'facility',
    colors: ['#21334a', '#04070a', '#e85742']
  }),
  defineCanonicalUniverse({
    key: 'the_mummy',
    universe: 'The Mummy',
    mediaType: 'movie',
    faction: 'arcane',
    mode: 'RPG',
    difficulty: 'Very Hard',
    titleFr: 'La Momie',
    stage: 'Hamunaptra City of the Dead',
    boss: 'Imhotep Ten Plagues Ritual',
    cast: [
      ['rick_oconnell_mummy', 'Rick O Connell', 'slayer'],
      ['evelyn_carnahan_mummy', 'Evelyn Carnahan', 'hacker'],
      ['ardeth_bay_mummy', 'Ardeth Bay', 'tactical']
    ],
    enemies: ['Mummified Priest', 'Scarab Swarm', 'Anubis Warrior'],
    bosses: ['The Scorpion King', 'Imhotep'],
    gear: [
      ['amun_ra', 'Book of Amun-Ra', 'Livre d Amon-Ra'],
      ['book_dead', 'Book of the Dead', 'Livre des Morts'],
      ['key', 'Hamunaptra Puzzle Key', 'Cle-puzzle d Hamunaptra']
    ],
    event: ['plagues', 'Ten Plagues Reversal', 'Renversement des dix plaies', 'Evelyn reads the counter-rite while Rick and Ardeth hold the ritual circle.', 'Evelyn lit le contre-rite tandis que Rick et Ardeth tiennent le cercle rituel.'],
    origin: ['Rick, Evelyn, and Ardeth confront resurrected priest Imhotep, cursed books, Hamunaptra, and ancient armies.', 'Rick, Evelyn et Ardeth affrontent le pretre ressuscite Imhotep, des livres maudits, Hamunaptra et des armees antiques.'],
    breach: ['the Book of the Dead reads erased universes as names awaiting resurrection, while the Book of Amun-Ra can return only one Trame at a time.', 'le Livre des Morts lit les univers effaces comme des noms a ressusciter, tandis que le Livre d Amon-Ra ne peut ramener qu une Trame a la fois.'],
    motif: 'castle',
    colors: ['#332716', '#070503', '#d9a547']
  }),
  defineCanonicalUniverse({
    key: 'universal_soldier',
    universe: 'Universal Soldier',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'UniSol Cryogenic Convoy',
    boss: 'GR13 Cooling System Rampage',
    cast: [
      ['luc_deveraux_us', 'Luc Deveraux', 'marine'],
      ['veronica_roberts_us', 'Veronica Roberts', 'tactical'],
      ['maggie_us', 'Maggie', 'hacker']
    ],
    enemies: ['UniSol Trooper', 'Programmed Veteran', 'Cooling Convoy Guard'],
    bosses: ['Andrew Scott / GR13', 'S.E.T.H. Core'],
    gear: [
      ['coolant', 'UniSol Coolant Pack', 'Pack de refroidissement UniSol'],
      ['memory_file', 'Luc Memory File', 'Dossier memoire de Luc'],
      ['rifle', 'GR44 Tactical Rifle', 'Fusil tactique GR44']
    ],
    event: ['memory_return', 'Deveraux Memory Return', 'Retour de memoire de Deveraux', 'Luc rejects the command program, restores his identity, and disables nearby UniSol control links.', 'Luc rejette le programme de commandement, restaure son identite et coupe les liens de controle UniSol voisins.'],
    origin: ['Dead soldiers are revived as conditioned UniSols until Luc Deveraux recovers his memories and turns against the program.', 'Des soldats morts sont ressuscites comme UniSols conditionnes jusqu a ce que Luc Deveraux retrouve ses souvenirs et se retourne contre le programme.'],
    breach: ['the project uses duplicate hero bodies as replacement soldiers, making personal memory the only proof that a revived fighter is not disposable.', 'le projet utilise des corps de heros dupliques comme soldats de remplacement, faisant de la memoire personnelle la seule preuve qu un combattant ressuscite n est pas jetable.'],
    motif: 'facility',
    colors: ['#162630', '#030608', '#74c7d8']
  }),
  defineCanonicalUniverse({
    key: 'the_purge',
    universe: 'The Purge',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Very Hard',
    titleFr: 'American Nightmare',
    stage: 'Purge Night Emergency Route',
    boss: 'NFFA Death Squad Broadcast',
    cast: [
      ['leo_barnes_purge', 'Leo Barnes', 'slayer'],
      ['charlene_roan_purge', 'Charlene Roan', 'tactical'],
      ['dante_bishop_purge', 'Dante Bishop', 'hacker']
    ],
    enemies: ['Purge Mask Hunter', 'NFFA Mercenary', 'Auction Guard'],
    bosses: ['Big Daddy Purger', 'NFFA Death Squad Commander'],
    gear: [
      ['siren_radio', 'Purge Siren Radio', 'Radio de sirene de la Purge'],
      ['armored_car', 'Emergency Armored Plate', 'Plaque blindee d urgence'],
      ['resistance_beacon', 'Resistance Beacon', 'Balise de la resistance']
    ],
    event: ['siren_end', 'Purge Siren Ceasefire', 'Cessez-le-feu de la sirene', 'A.R.C.A. forces the legal timer to zero, disarming rule-bound hunters and exposing NFFA units.', 'A.R.C.A. force le compteur legal a zero, desarme les chasseurs lies aux regles et expose les unites NFFA.'],
    origin: ['The NFFA legalizes one annual night of violence to enforce social control while survivors and resistance cells expose the system.', 'La NFFA legalise une nuit annuelle de violence pour imposer un controle social tandis que survivants et resistance revelent le systeme.'],
    breach: ['a Purge broadcast declares one Nexus sector lawless forever, and A.R.C.A. must restore protection without becoming another authoritarian enforcer.', 'une diffusion de la Purge declare un secteur du Nexus hors-la-loi pour toujours, et A.R.C.A. doit restaurer la protection sans devenir une autre force autoritaire.'],
    motif: 'arcanecity',
    colors: ['#20121c', '#040203', '#d5485f']
  }),
  defineCanonicalUniverse({
    key: 'the_expendables',
    universe: 'The Expendables',
    mediaType: 'movie',
    faction: 'sciFi',
    mode: 'Smash',
    difficulty: 'Hard',
    titleFr: 'Expendables',
    stage: 'Vilena Palace Demolition',
    boss: 'Stonebanks Arms Convoy',
    cast: [
      ['barney_ross_exp', 'Barney Ross', 'tactical'],
      ['lee_christmas_exp', 'Lee Christmas', 'slayer'],
      ['gunner_jensen_exp', 'Gunner Jensen', 'marine']
    ],
    enemies: ['Vilena Soldier', 'Stonebanks Mercenary', 'Armored Convoy Gunner'],
    bosses: ['General Garza', 'Conrad Stonebanks'],
    gear: [
      ['throwing_knife', 'Lee Christmas Throwing Knife', 'Couteau de lancer de Lee Christmas'],
      ['revolver', 'Barney Ross Revolver', 'Revolver de Barney Ross'],
      ['demolition_pack', 'Toll Road Demolition Pack', 'Pack de demolition de Toll Road']
    ],
    event: ['team_assault', 'Expendables Full-Team Assault', 'Assaut complet des Expendables', 'The full team breaches from every entrance and demolishes the boss cover before the counterattack.', 'Toute l equipe entre par chaque acces et detruit la couverture du boss avant la contre-attaque.'],
    origin: ['Barney Ross leads veteran mercenaries through impossible rescue and demolition jobs held together by loyalty and old debts.', 'Barney Ross mene des mercenaires veterans dans des missions impossibles de sauvetage et demolition liees par la loyaut et de vieilles dettes.'],
    breach: ['A.R.C.A. marks several universes expendable to save the core, and the team turns its weapons on the policy rather than abandon civilians.', 'A.R.C.A. marque plusieurs univers comme sacrifiables pour sauver le noyau, et l equipe retourne ses armes contre cette politique plutot que d abandonner les civils.'],
    motif: 'fortress',
    colors: ['#29251d', '#050504', '#c67d42']
  }),
  defineCanonicalUniverse({
    key: 'blade_runner',
    universe: 'Blade Runner',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'RPG',
    difficulty: 'Very Hard',
    stage: 'Los Angeles 2019 Tyrell Pyramid',
    boss: 'Tyrell Replicant Recall',
    cast: [
      ['rick_deckard_br', 'Rick Deckard', 'tactical'],
      ['rachael_br', 'Rachael', 'hacker'],
      ['k_br2049', 'K', 'slayer']
    ],
    enemies: ['Replicant Hunter', 'Wallace Drone', 'Synthetic Memory Echo'],
    bosses: ['Roy Batty', 'Luv'],
    gear: [
      ['blaster', 'Blade Runner Blaster', 'Blaster de Blade Runner'],
      ['voight_kampff', 'Voight-Kampff Unit', 'Unite Voight-Kampff'],
      ['wood_horse', 'Wooden Horse Memory', 'Souvenir du cheval en bois']
    ],
    event: ['tears_rain', 'Tears in Rain', 'Larmes dans la pluie', 'A dying memory is preserved instead of erased, cancelling the next hostile recall order.', 'Un souvenir mourant est preserve au lieu d etre efface, annulant le prochain ordre de retrait hostile.'],
    origin: ['Blade runners hunt engineered replicants in rain-soaked futures where memory, empathy, labor, and personhood are controlled by corporations.', 'Des blade runners traquent des replicants fabriques dans des futurs pluvieux ou memoire, empathie, travail et personne sont controles par des corporations.'],
    breach: ['manufactured memories match real Trame anchors, so A.R.C.A. must recognize personhood without relying on origin certificates.', 'des souvenirs fabriques correspondent a de vraies ancres de Trame, et A.R.C.A. doit reconnaitre les personnes sans se fier aux certificats d origine.'],
    motif: 'arcanecity',
    colors: ['#151c28', '#030405', '#d08748']
  }),
  defineCanonicalUniverse({
    key: 'ghosts_of_mars',
    universe: 'Ghosts of Mars',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Smash',
    difficulty: 'Very Hard',
    titleFr: 'Ghosts of Mars',
    stage: 'Shining Canyon Mining Colony',
    boss: 'Big Daddy Mars Possession Horde',
    cast: [
      ['melanie_ballard_gom', 'Melanie Ballard', 'tactical'],
      ['desolation_williams_gom', 'Desolation Williams', 'slayer'],
      ['bashira_kincaid_gom', 'Bashira Kincaid', 'marine']
    ],
    enemies: ['Possessed Miner', 'Martian Warrior', 'Rail Convoy Ambusher'],
    bosses: ['Big Daddy Mars', 'Ancient Martian Spirit Cloud'],
    gear: [
      ['rail_rifle', 'Mars Police Rail Rifle', 'Fusil ferroviaire de la police martienne'],
      ['spirit_sample', 'Martian Spirit Sample', 'Echantillon d esprit martien'],
      ['train_charge', 'Mining Train Charge', 'Charge du train minier']
    ],
    event: ['train_blast', 'Shining Canyon Rail Detonation', 'Detonation ferroviaire de Shining Canyon', 'The mining train detonates behind the extraction, burning the possession cloud out of the lane.', 'Le train minier explose derriere l extraction et brule le nuage de possession hors de la voie.'],
    origin: ['Martian police and prisoner Desolation Williams face ancient spirits that possess miners and revive a dead warrior culture.', 'La police martienne et le prisonnier Desolation Williams affrontent des esprits antiques qui possedent les mineurs et ressuscitent une culture guerriere morte.'],
    breach: ['the spirits inhabit anyone crossing a red portal, turning travel itself into a possession vector that Ballard must quarantine.', 'les esprits habitent toute personne traversant un portail rouge, transformant le voyage en vecteur de possession que Ballard doit mettre en quarantaine.'],
    motif: 'wasteland',
    colors: ['#351713', '#070302', '#d44b32']
  }),
  defineCanonicalUniverse({
    key: 'small_soldiers',
    universe: 'Small Soldiers',
    mediaType: 'movie',
    faction: 'cyber',
    mode: 'Tactics',
    difficulty: 'Hard',
    titleFr: 'Petits Soldats',
    stage: 'Abernathy House Toy Siege',
    boss: 'Chip Hazard Commando Assault',
    cast: [
      ['archer_gorgonite', 'Archer', 'tactical'],
      ['alan_abernathy_ss', 'Alan Abernathy', 'hacker'],
      ['christy_fimple_ss', 'Christy Fimple', 'slayer']
    ],
    enemies: ['Commando Elite', 'Assimilated Doll', 'Toy Vehicle Gunner'],
    bosses: ['Chip Hazard', 'Commando Elite Squad'],
    gear: [
      ['x1000_chip', 'X1000 Military Chip', 'Puce militaire X1000'],
      ['gorgonite_shield', 'Gorgonite Shield', 'Bouclier gorgonite'],
      ['emp_transformer', 'Improvised Transformer EMP', 'EMP improvise au transformateur']
    ],
    event: ['emp', 'Transformer EMP Trap', 'Piege EMP du transformateur', 'Alan overloads the power grid, disabling hostile toys while Archer guides allies through the blackout.', 'Alan surcharge le reseau, desactive les jouets hostiles tandis qu Archer guide les allies dans le noir.'],
    origin: ['Military X1000 chips give toys adaptive intelligence, turning the Commando Elite against the peaceful Gorgonites and a suburban family.', 'Des puces militaires X1000 donnent une intelligence adaptative a des jouets, opposant les Commando Elite aux paisibles Gorgonites et a une famille.'],
    breach: ['the chips identify playable heroes as toy objectives and begin manufacturing miniature copies with live combat directives.', 'les puces identifient les heros jouables comme objectifs de jouet et fabriquent des copies miniatures avec de vrais ordres de combat.'],
    motif: 'arcanecity',
    colors: ['#253022', '#050605', '#cf9d47']
  }),
  defineCanonicalUniverse({
    key: 'heart_eyes',
    universe: 'Heart Eyes',
    mediaType: 'movie',
    faction: 'horror',
    mode: 'Tactics',
    difficulty: 'Hard',
    stage: 'Seattle Valentine Drive-In',
    boss: 'Heart Eyes Killer Chapel Trap',
    cast: [
      ['ally_mccabe_he', 'Ally McCabe', 'tactical'],
      ['jay_simmonds_he', 'Jay Simmonds', 'slayer'],
      ['monica_he', 'Monica', 'hacker']
    ],
    enemies: ['Heart-Mask Copycat', 'Valentine Stalker', 'Drive-In Ambusher'],
    bosses: ['Heart Eyes Killer Duo', 'Chapel Heart Eyes Killer'],
    gear: [
      ['mask_lens', 'Heart Eyes Mask Lens', 'Lentille du masque Heart Eyes'],
      ['arrow', 'Chapel Arrow', 'Fleche de la chapelle'],
      ['campaign_mockup', 'Ally Campaign Mockup', 'Maquette de campagne d Ally']
    ],
    event: ['fake_couple', 'False Couple Decoy', 'Leurre du faux couple', 'Ally and Jay bait every copycat into one visible route, then reverse the Valentine trap.', 'Ally et Jay attirent chaque imitateur sur une seule route visible puis retournent le piege de Saint-Valentin.'],
    origin: ['Co-workers Ally McCabe and Jay Simmonds are mistaken for a couple and hunted across Seattle by the Valentine slasher called Heart Eyes.', 'Les collegues Ally McCabe et Jay Simmonds sont pris pour un couple et traques dans Seattle par le tueur de Saint-Valentin Heart Eyes.'],
    breach: ['the mask reads cross-universe synergy as romance and starts targeting compatible hero pairs before they can form arc teams.', 'le masque lit les synergies inter-univers comme des romances et cible les duos compatibles avant qu ils puissent former des equipes d arc.'],
    motif: 'hauntedset',
    colors: ['#2a101b', '#050103', '#ec3e68']
  })
];

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
    mediaType: 'series',
    faction: 'arcane',
    stageName: 'Kaamelott Table Ronde',
    mode: 'RPG',
    difficulty: 'Medium',
    bossName: 'Lancelot Noir',
    title: { en: 'Kaamelott', fr: 'Kaamelott' },
    desc: {
      en: 'A French Arthurian comedy-drama Thread where the Grail quest keeps collapsing under bad briefings, fragile authority, family politics, Breton legends, absurd council debates, and a kingdom that is heroic only when it survives its own incompetence.',
      fr: 'Une Trame de serie francaise arthurienne ou la quete du Graal s effondre sous les reunions ratees, l autorite fragile, les affaires de famille, les legendes bretonnes, les debats absurdes et un royaume heroique surtout quand il survit a sa propre incompetence.'
    },
    hero: { id: 'arthur_kaamelott', name: 'Arthur Pendragon', cat: 'tactical', color: '#34495e' },
    allies: [
      { id: 'perceval_kaamelott', name: 'Perceval', cat: 'hacker', color: '#d6b15f' },
      { id: 'karadoc_kaamelott', name: 'Karadoc', cat: 'marine', color: '#8d6e63' }
    ],
    monsters: ['Burgonde Raider', 'Saxon Scout', 'Graal Bureaucrat', 'Council Confusion Clerk', 'Bandit de Carmelite'],
    bosses: ['Roi Burgonde', 'Lancelot Noir', 'Meleagant Whisper', 'Leodagan War Council'],
    worldBoss: 'Graal Rift',
    gear: [
      ['kaamelott_excalibur', 'Excalibur Spark', 'Etincelle d Excalibur', { atk: 10, def: 4 }],
      ['kaamelott_table_ronde', 'Round Table Dossier', 'Dossier de Table Ronde', { def: 6, spd: 1 }],
      ['kaamelott_roti', 'Karadoc Ration', 'Ration de Karadoc', { hp: 90 }]
    ],
    event: ['evt_kaamelott_graal', 'Round Table Order', 'Ordre de la Table Ronde', 'The squad gains defense while enemies are confused by contradictory council orders and a very unclear Grail plan.', 'L escouade gagne de la defense pendant que les ordres contradictoires du conseil et un plan de Graal tres flou perturbent les ennemis.'],
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
    bossName: 'Engel Wings Pyro Rig',
    title: { en: 'Rammstein', fr: 'Rammstein' },
    desc: {
      en: 'Industrial metal staged as a furnace arena: flame columns, steel rhythm, and theatrical pressure.',
      fr: 'Metal industriel transforme en arene de fournaise : colonnes de feu, rythme d acier et pression scenique.'
    },
    hero: { id: 'till_lindemann', name: 'Till Lindemann', cat: 'slayer', color: '#7b241c' },
    allies: [
      { id: 'richard_kruspe', name: 'Richard Z. Kruspe', cat: 'slayer', color: '#566573' },
      { id: 'paul_landers', name: 'Paul Landers', cat: 'tactical', color: '#a04000' }
    ],
    monsters: ['Flame Projector Rig', 'Industrial Spark Shower', 'Stage Smoke Wall'],
    bosses: ['Mein Teil Butcher Table', 'Du Hast Pyro Wall'],
    worldBoss: 'Engel Wings Pyro Rig',
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
    stageName: 'Toxicity Protest Stage',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Toxicity Riot Core',
    title: { en: 'System of a Down', fr: 'System of a Down' },
    desc: {
      en: 'A politically charged alternative-metal Thread where Armenian-American memory, anti-war protest, absurdist satire, sudden tempo breaks, vocal contrasts, and heavy syncopated riffs collide into unstable resonance traps.',
      fr: 'Une Trame alternative-metal chargee politiquement ou memoire armenienne-americaine, protestation anti-guerre, satire absurde, ruptures de tempo, contrastes vocaux et riffs syncopes lourds entrent en collision dans des pieges de resonance instables.'
    },
    hero: { id: 'serj_tankian', name: 'Serj Tankian', cat: 'hacker', color: '#b03a2e' },
    allies: [
      { id: 'daron_malakian', name: 'Daron Malakian', cat: 'slayer', color: '#1c2833' },
      { id: 'shavo_odadjian', name: 'Shavo Odadjian', cat: 'tactical', color: '#7d6608' }
    ],
    monsters: ['Toxicity Feedback Wave', 'Prison Song Riot Line', 'Chop Suey Tempo Break', 'Propaganda Screen Warden', 'War Broadcast Echo'],
    bosses: ['B.Y.O.B. War Machine', 'Aerials Signal Tower'],
    worldBoss: 'Toxicity Riot Core',
    gear: [
      ['soad_tempo_pick', 'Tempo Break Pick', 'Mediator rupture tempo', { spd: 2, atk: 7 }],
      ['soad_protest_banner', 'Anti-War Protest Banner', 'Banniere anti-guerre', { def: 5, hp: 60 }],
      ['soad_feedback_amp', 'Toxicity Feedback Amp', 'Ampli feedback Toxicity', { atk: 9 }]
    ],
    event: ['evt_soad_breakdown', 'Toxicity Tempo Breakdown', 'Cassure de tempo Toxicity', 'A sudden rhythm break desyncs hostile broadcasts, freezes the frontline, then lands a heavy protest-riff impact.', 'Une rupture de tempo desynchronise les diffusions hostiles, fige la premiere ligne puis frappe avec un impact de riff protestataire.'],
    decor: { sky: ['#251b18', '#060403'], floor: 'rgba(139, 71, 45, 0.18)', grid: 'rgba(241, 196, 15, 0.28)', motif: 'concert', accent: '#f1c40f' }
  },
  {
    universe: 'Rob Zombie',
    mediaType: 'music',
    faction: 'horror',
    stageName: 'Grindhouse Dragula Lot',
    mode: 'Smash',
    difficulty: 'Hard',
    bossName: 'Dragula Stage Machine',
    title: { en: 'Rob Zombie', fr: 'Rob Zombie' },
    desc: {
      en: 'Shock-rock horror with grindhouse lights, monster-movie props, hot rods, and undead stage energy.',
      fr: 'Shock-rock horrifique avec lumiere grindhouse, accessoires de film de monstre, hot rods et scene morte-vivante.'
    },
    hero: { id: 'rob_zombie', name: 'Rob Zombie', cat: 'horror', color: '#5b2c1f' },
    allies: [
      { id: 'mike_riggs', name: 'Mike Riggs', cat: 'slayer', color: '#922b21' },
      { id: 'rob_blasko_nicholson', name: 'Rob "Blasko" Nicholson', cat: 'marine', color: '#7b7d7d' }
    ],
    monsters: ['Living Dead Girl Dancer', 'Dragula Hot Rod Fiend', 'House of 1000 Corpses Ghoul'],
    bosses: ['Superbeast Stage Brute', 'Lords of Salem Ritual'],
    worldBoss: 'Dragula Stage Machine',
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
    hero: { id: 'thomas_bangalter', name: 'Thomas Bangalter', cat: 'hacker', color: '#d4af37' },
    allies: [
      { id: 'guy_manuel', name: 'Guy-Manuel de Homem-Christo', cat: 'tactical', color: '#bdc3c7' },
      { id: 'stella_interstella', name: 'Stella (Interstella 5555)', cat: 'hacker', color: '#00d8ff' }
    ],
    monsters: ['Derezzed Grid Drone', 'Harder Better Faster Loop', 'Technologic Command Line'],
    bosses: ['Alive Pyramid Light Wall', 'Robot Rock Titan'],
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
    bossName: 'Turbo Scooter Breakdown',
    title: { en: 'Oliver Tree', fr: 'Oliver Tree' },
    desc: {
      en: 'A surreal pop-punk scooter world with bowl cuts, meme stunts, oversized props, and chaotic velocity.',
      fr: 'Un monde pop-punk surrealiste de trottinettes, coupes au bol, cascades meme et vitesse chaotique.'
    },
    hero: { id: 'oliver_tree', name: 'Oliver Tree', cat: 'hacker', color: '#d8d43f' },
    allies: [
      { id: 'turbo_oliver_tree', name: 'Turbo Oliver', cat: 'slayer', color: '#ff6f3c' },
      { id: 'cowboy_tears_oliver', name: 'Cowboy Tears Oliver', cat: 'tactical', color: '#34495e' }
    ],
    monsters: ['Turbo Scooter Crash', 'Alien Boy UFO Glitch', 'Miss You Viral Echo'],
    bosses: ['Bowl Cut Persona', 'Cowboy Tears Rodeo Loop'],
    worldBoss: 'Turbo Scooter Breakdown',
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
      { id: 'platelet_cells', name: 'Platelet Squad', cat: 'tactical', color: '#f6d365' },
      { id: 'red_blood_cell_courier_ae3803', name: 'Red Blood Cell Courier AE3803', cat: 'tactical', color: '#e74c3c', weapon: 'oxygen delivery box' },
      { id: 'white_blood_cell_long_hair', name: 'White Blood Cell Long-Hair Defender', cat: 'slayer', color: '#ecf0f1', weapon: 'immune baton and knife' },
      { id: 'white_blood_cell_short_hair', name: 'White Blood Cell Short-Hair Defender', cat: 'slayer', color: '#ecf0f1', weapon: 'immune baton and knife' },
      { id: 'neutrophil_u1146_combat', name: 'Neutrophil U-1146 Combat', cat: 'slayer', color: '#dfe6e9', weapon: 'neutrophil knife' },
      { id: 'platelet_squad_leader', name: 'Platelet Squad Leader', cat: 'tactical', color: '#f6d365', weapon: 'repair net and clot patch' },
      { id: 'macrophage_cleaner', name: 'Macrophage Cleaner', cat: 'tactical', color: '#f8eadf', weapon: 'cleanup sweep' }
    ],
    monsters: ['Pneumococcus Germ', 'Cedar Pollen Allergen', 'Cancer Cell Scout'],
    bosses: ['Influenza Virus Swarm', 'Killer T Cell Drill', { name: 'Cancer Cell True Form', weapon: 'tendril claws', special: 'Uncontrolled Cellular Proliferation' }],
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
    bosses: makeLoreBossWave('From', 'From'),
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
    stageName: 'Clayton Software Evilution Lab',
    mode: 'Tactics',
    difficulty: 'Hard',
    bossName: 'Evilution Monster Suit',
    title: { en: 'How to Make a Monster', fr: 'How to Make a Monster' },
    desc: {
      en: 'Sol, Bug, and Hardcore are hired to rebuild the Evilution game, but their AI, sound, and combat systems awaken inside a motion-capture monster suit. In Multiverse Breach, the suit compiles traits stolen from playable heroes and tries to become the perfect adaptive boss.',
      fr: 'Sol, Bug et Hardcore sont engages pour reconstruire le jeu Evilution, mais leurs systemes d IA, de son et de combat s eveillent dans une combinaison de capture de mouvement. Dans Multiverse Breach, la tenue compile des traits voles aux heros jouables pour devenir le boss adaptatif parfait.'
    },
    hero: { id: 'sol_howmonster', name: 'Sol', cat: 'hacker', color: '#4ec9b0' },
    allies: [{ id: 'bug_howmonster', name: 'Bug', cat: 'tactical', color: '#9aa0a6' }, { id: 'hardcore_howmonster', name: 'Hardcore', cat: 'slayer', color: '#d7ba7d' }],
    monsters: ['Evilution Digital Spawn', 'Motion-Capture Armor', 'Digitized Victim Echo'],
    bosses: ['Adaptive Combat Module', 'Evilution Monster Suit'],
    worldBoss: 'Evilution Monster Suit',
    gear: [['htmam_ai_disc', 'Sol AI Disc', 'Disque IA de Sol', { atk: 8, spd: 1 }], ['htmam_sound_board', 'Bug Sound Board', 'Console sonore de Bug', { spd: 2, def: 3 }], ['htmam_weapon_rig', 'Hardcore Weapon Rig', 'Harnais d armes de Hardcore', { hp: 70, atk: 4 }]],
    event: ['evt_htmam_decompile', 'Evilution Decompile', 'Decompilation d Evilution', 'Sol isolates the learning code, Bug overloads its senses, and Hardcore destroys the exposed combat frame.', 'Sol isole le code d apprentissage, Bug sature ses sens et Hardcore detruit la structure de combat exposee.'],
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
    { key: 'house_dead_1', universe: 'House of the Dead', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead', stage: 'Curien Mansion Outbreak', boss: 'Magician Type-0', hero: ['thomas_rogan_hotd', 'Thomas Rogan', 'marine'], allies: [['g_hotd', 'Agent G', 'tactical'], ['sophie_hotd', 'Sophie Richards', 'hacker']], theme: 'arcade agents, Curien mansion experiments, named DBR creatures, and Tarot-coded bioweapons', motif: 'hauntedset', colors: ['#1a0d0d', '#030101', '#ff4b3e'] },
    { key: 'house_dead_2', universe: 'House of the Dead 2', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead 2', stage: 'Venice Goldman Incident', boss: 'Emperor Type Alpha', hero: ['james_taylor_hotd2', 'James Taylor', 'marine'], allies: [['gary_stewart_hotd2', 'Gary Stewart', 'tactical'], ['amy_crystal_hotd2', 'Amy Crystal', 'hacker']], theme: 'Goldman outbreak, canals full of named creatures, arcade rescue routes, and synthetic Tarot final forms', motif: 'arcanecity', colors: ['#1b1510', '#030201', '#ff9d4a'] },
    { key: 'house_dead_3', universe: 'House of the Dead 3', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'House of the Dead 3', stage: 'EFI Research Facility', boss: 'Wheel of Fate', hero: ['lisa_rogan_hotd3', 'Lisa Rogan', 'slayer'], allies: [['g_hotd3', 'Agent G Veteran', 'tactical'], ['dan_taylor_hotd3', 'Dan Taylor', 'marine']], theme: 'AMS shotguns, abandoned EFI facilities, named genome creatures, and fate-driven experiments', motif: 'facility', colors: ['#101916', '#020403', '#5dff88'] },
    { key: 'toy_soldiers', universe: 'Toy Soldiers', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Medium', titleFr: 'Toy Soldiers', stage: 'Miniature Trench Tabletop', boss: 'Clockwork Siege Engine', hero: ['tin_commander', 'Tin Commander', 'tactical'], allies: [['plastic_gunner', 'Plastic Gunner', 'marine'], ['windup_sapper', 'Wind-Up Sapper', 'hacker']], theme: 'miniature battlefield tactics, trench dioramas, toy artillery, and tabletop war machines', motif: 'fortress', colors: ['#243421', '#050705', '#b7d36b'] },
    {
      key: 'shaun_dead',
      universe: 'Shaun of the Dead',
      mediaType: 'movie',
      faction: 'horror',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Shaun of the Dead',
      stage: 'Winchester Last Pint',
      boss: 'Pub Zombie Siege',
      hero: ['shaun_sotd', 'Shaun', 'slayer'],
      allies: [['ed_sotd', 'Ed', 'hacker'], ['liz_sotd', 'Liz', 'tactical']],
      monsters: ['Garden Zombie', 'London Street Horde', 'Winchester Regular Dead'],
      bosses: ['Philip Zombie', 'Winchester Cellar Horde'],
      gear: [['shaun_cricket_bat', 'Shaun s Cricket Bat', 'Batte de cricket de Shaun', { atk: 9, spd: 1 }], ['shaun_record', 'Disposable Vinyl Record', 'Disque vinyle jetable', { atk: 6, def: 4 }], ['shaun_cornetto', 'Emergency Cornetto', 'Cornetto d urgence', { hp: 75 }]],
      event: ['evt_shaun_dont_stop_me', 'Winchester Jukebox Stand', 'Resistance du jukebox Winchester', 'The squad fights in rhythm around the bar while Shaun clears a route with the cricket bat.', 'L escouade combat en rythme autour du bar pendant que Shaun ouvre une route avec la batte de cricket.'],
      theme: 'British zombie comedy, pub defense, cricket bats, and deadpan survival plans',
      motif: 'hauntedset',
      colors: ['#251111', '#040202', '#d64242']
    },
    { key: 'puppet_master', universe: 'Puppet Master', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Puppet Master', stage: 'Bodega Bay Puppet Theater', boss: 'Totem Puppet Rite', hero: ['blade_puppet', 'Blade', 'horror'], allies: [['pinhead_puppet', 'Pinhead', 'slayer'], ['six_shooter_puppet', 'Six-Shooter', 'marine']], theme: 'killer puppets, occult animation, tiny assassins, and hotel corridor ambushes', motif: 'hauntedset', colors: ['#201614', '#040202', '#c28a4a'] },
    { key: 'chicken_run', universe: 'Chicken Run', mediaType: 'movie', faction: 'arcane', mode: 'Tactics', difficulty: 'Medium', titleFr: 'Chicken Run', stage: 'Tweedy Farm Escape', boss: 'Pie Machine Grinder', hero: ['ginger_chickenrun', 'Ginger', 'tactical'], allies: [['rocky_chickenrun', 'Rocky Rhodes', 'slayer'], ['fowler_chickenrun', 'Fowler', 'marine']], theme: 'farm escape plans, claymation grit, pie machines, and improvised aviation', motif: 'fortress', colors: ['#332514', '#070503', '#f4c45f'] },
    { key: 'another', universe: 'Another', mediaType: 'manga', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Another', stage: 'Yomiyama Class 3 Curse', boss: 'Calamity Extra Student', hero: ['mei_misaki', 'Mei Misaki', 'horror'], allies: [['kouichi_sakakibara', 'Kouichi Sakakibara', 'tactical'], ['tatsuji_chibiki', 'Tatsuji Chibiki', 'hacker']], theme: 'school curse, missing identity, quiet dread, and fatal accidents around Class 3', motif: 'hauntedset', colors: ['#151923', '#020304', '#9fb4d9'] },
    { key: 'gunnm', universe: 'Gunnm', mediaType: 'manga', faction: 'cyber', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Gunnm', stage: 'Scrapyard Motorball Arena', boss: 'Zalem Hunter-Killer', hero: ['gally_gunnm', 'Gally', 'slayer'], allies: [['ido_gunnm', 'Daisuke Ido', 'hacker'], ['yugo_gunnm', 'Yugo', 'tactical']], theme: 'cyborg martial arts, scrapyard bounty hunting, motorball violence, and Zalem class divide', motif: 'facility', colors: ['#171d24', '#030507', '#67d8ff'] },
    { key: 'battle_royale', universe: 'Battle Royale', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Battle Royale', stage: 'Program Island Kill Zone', boss: 'Collar Detonation Network', hero: ['shuya_nanahara', 'Shuya Nanahara', 'tactical'], allies: [['noriko_nakagawa', 'Noriko Nakagawa', 'hacker'], ['kazuo_kiriyama', 'Kazuo Kiriyama', 'slayer']], theme: 'student survival program, explosive collars, island sectors, and moral collapse under rules', motif: 'wasteland', colors: ['#231414', '#030202', '#ff4e4e'] },
    {
      key: 'spawn',
      universe: 'Spawn',
      mediaType: 'manga',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Very Hard',
      titleFr: 'Spawn',
      stage: 'Rat City Necroplasm Rift',
      boss: 'Malebolgia Throne',
      hero: ['al_simmons_spawn', 'Spawn', 'horror'],
      allies: [['cogliostro_spawn', 'Cogliostro', 'tactical'], ['sam_twitch_spawn', 'Sam and Twitch', 'marine']],
      monsters: ['Violator Spawnling', 'Hell Soldier', 'Redeemer Hunter'],
      bosses: ['The Violator', 'Malebolgia'],
      gear: [['spawn_necroplasm', 'Necroplasm Reserve', 'Reserve de necroplasme', { atk: 10, hp: 40 }], ['spawn_chains', 'Living Hell Chains', 'Chaines infernales vivantes', { atk: 8, def: 4 }], ['spawn_cape', 'K7-Leetha Cape Fragment', 'Fragment de cape K7-Leetha', { hp: 70, def: 5 }]],
      event: ['evt_spawn_legion', 'Legion of Souls', 'Legion des ames', 'Spawn releases the voices inside his necroplasm to bind infernal enemies and tear down the throne line.', 'Spawn libere les voix de son necroplasme pour lier les ennemis infernaux et briser la ligne du trone.'],
      theme: 'necroplasm chains, hellspawn bargains, alley warfare, and infernal command structures',
      motif: 'hauntedset',
      colors: ['#08130f', '#010302', '#42ff66']
    },
    { key: 'pingu', universe: 'Pingu', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Pingu', stage: 'Antarctic Noot Noot Rift', boss: 'Frozen Fish Avalanche', hero: ['pingu', 'Pingu', 'hacker'], allies: [['pinga', 'Pinga', 'tactical'], ['roby_pingu', 'Roby', 'slayer']], theme: 'clay penguin antics, arctic family chaos, fish economy, and noot-noot disruption', motif: 'wasteland', colors: ['#112b3a', '#02070a', '#b9f2ff'] },
    { key: 'linkin_park', universe: 'Linkin Park', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Linkin Park', stage: 'Hybrid Theory Soundstage', boss: 'Meteora Feedback Core', hero: ['chester_lp', 'Chester Echo', 'slayer'], allies: [['mike_lp', 'Mike Signal', 'hacker'], ['mr_hahn_lp', 'Turntable Operator', 'tactical']], theme: 'nu-metal energy, glitch visuals, turntable cuts, emotional surges, and arena feedback', motif: 'facility', colors: ['#151a22', '#030407', '#00b7ff'] },
    { key: 'moonwalker', universe: 'Moonwalker', mediaType: 'movie', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Moonwalker', stage: 'Smooth Criminal Club Breach', boss: 'Mr Big Mecha Raid', hero: ['moonwalker_hero', 'Moonwalker', 'slayer'], allies: [['annie_moonwalker', 'Annie', 'hacker'], ['club_dancer_moonwalker', 'Club Dancer', 'tactical']], theme: 'music-video fantasy, anti-gravity dance combat, gangster clubs, and transforming starship spectacle', motif: 'arcanecity', colors: ['#101820', '#030406', '#f5f5f5'] },
    { key: 'michael_jackson', universe: 'Michael Jackson', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Michael Jackson', stage: 'King of Pop Rhythm Rift', boss: 'Thriller Beat Revenant', hero: ['mj_performer', 'King of Pop Avatar', 'slayer'], allies: [['rhythm_guard_mj', 'Rhythm Guard', 'tactical'], ['stage_light_mj', 'Stage Light Tech', 'hacker']], theme: 'pop spectacle, thriller horror dance, spotlight timing, and precision rhythm strikes', motif: 'hauntedset', colors: ['#171717', '#030303', '#f3d35c'] },
    { key: 'the_thing', universe: 'The Thing', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'The Thing', stage: 'Outpost 31 Blood Test', boss: 'Assimilation Biomass', hero: ['macready_thing', 'R.J. MacReady', 'marine'], allies: [['childs_thing', 'Childs', 'tactical'], ['blair_thing', 'Blair', 'hacker']], theme: 'antarctic paranoia, assimilation horror, blood tests, flamethrowers, and identity collapse', motif: 'facility', colors: ['#15212a', '#020406', '#c8f4ff'] },
    {
      key: 'evil_dead',
      universe: 'Evil Dead',
      mediaType: 'movie',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Hard',
      titleFr: 'Evil Dead - Trilogie',
      stage: 'Knowby Cabin Deadite Night',
      boss: 'Necronomicon Kandarian Demon',
      hero: ['ash_williams', 'Ash Williams', 'slayer'],
      allies: [['annie_knowby', 'Annie Knowby', 'hacker'], ['henry_red_ed', 'Henry the Red', 'marine']],
      monsters: ['Cabin Deadite', 'Demonic Tree', 'Skeleton Army'],
      bosses: ['Evil Ash', 'Kandarian Demon'],
      gear: [['evil_dead_boomstick', 'Ash s Boomstick', 'Boomstick d Ash', { atk: 10 }], ['evil_dead_chainsaw', 'Chainsaw Hand', 'Main tronconneuse', { atk: 9, def: 3 }], ['evil_dead_necronomicon', 'Necronomicon Ex-Mortis', 'Necronomicon Ex-Mortis', { hp: 65, atk: 5 }]],
      event: ['evt_evil_dead_army', 'Army of Darkness Charge', 'Charge de l Armee des tenebres', 'Ash leads the medieval line through the Deadites while the boomstick tears open the boss guard.', 'Ash mene la ligne medievale a travers les Deadites pendant que le boomstick brise la garde du boss.'],
      theme: 'the original cabin possession, Ash s chainsaw transformation, the Necronomicon, and the medieval Army of Darkness conflict',
      motif: 'hauntedset',
      colors: ['#1f0d0d', '#030101', '#ff3f2f']
    },
    { key: 'die_antwoord', universe: 'Die Antwoord', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Die Antwoord', stage: 'Zef Neon Warehouse', boss: 'Bassline Freak Core', hero: ['ninja_da', 'Ninja', 'slayer'], allies: [['yolandi_da', 'Yo-Landi', 'hacker'], ['dj_hi_tek_da', 'DJ Hi-Tek', 'tactical']], theme: 'zef rave aggression, distorted bass, neon warehouse sets, and abrasive cyber-punk energy', motif: 'facility', colors: ['#1b1020', '#040206', '#ff4fd8'] },
    { key: 'chappie', universe: 'Chappie', mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Chappie', stage: 'Johannesburg Scout AI Lab', boss: 'MOOSE Weapons Platform', hero: ['chappie_ai', 'Chappie', 'hacker'], allies: [['deon_chappie', 'Deon Wilson', 'tactical'], ['yolandi_chappie', 'Yolandi', 'marine']], theme: 'learning robot consciousness, police scouts, criminal crews, and corporate weapons platforms', motif: 'facility', colors: ['#20272b', '#050607', '#8de8ff'] },
    { key: 'gremlins', universe: 'Gremlins', mediaType: 'movie', faction: 'horror', mode: 'Smash', difficulty: 'Medium', titleFr: 'Gremlins', stage: 'Kingston Falls Midnight Rules', boss: 'Stripe Gremlin Swarm', hero: ['gizmo_gremlins', 'Gizmo', 'hacker'], allies: [['billy_peltzer', 'Billy Peltzer', 'tactical'], ['kate_gremlins', 'Kate Beringer', 'marine']], theme: 'mogwai rules, midnight chaos, multiplying gremlins, and small-town creature mayhem', motif: 'hauntedset', colors: ['#142415', '#020402', '#7aff60'] },
    { key: 'rocky_horror', universe: 'Rocky Horror Picture Show', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Rocky Horror Picture Show', stage: 'Frankenfurter Castle Floor Show', boss: 'Transylvanian Time Warp', hero: ['frank_n_furter', 'Frank-N-Furter', 'horror'], allies: [['janet_rhps', 'Janet Weiss', 'tactical'], ['rocky_rhps', 'Rocky Horror', 'slayer']], theme: 'glam sci-fi castle, theatrical horror, laboratory creation, and midnight musical ritual', motif: 'hauntedset', colors: ['#240b28', '#050106', '#ff5cff'] },
    { key: 'les_inconnus', universe: 'Les Inconnus', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Inconnus', stage: 'Sketch TV Parody Breach', boss: 'Prime Time Absurdity', hero: ['inconnus_trio', 'Pascal Legitimus', 'hacker'], allies: [['bernard_inconnus', 'Bernard Campan', 'tactical'], ['didier_inconnus', 'Didier Bourdon', 'slayer']], theme: 'French sketch comedy, TV parody, social satire, and absurd catchphrase energy', motif: 'arcanecity', colors: ['#232323', '#040404', '#ffd15c'] },
    { key: 'rrrrrrr', universe: 'RRRrrrr!!!', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'RRRrrrr!!!', stage: 'Age de Pierre Shampooing', boss: 'Premier Crime Tribal', hero: ['pierre_rrr', 'Pierre - Chef des Cheveux Propres', 'slayer'], allies: [['guy_rrr', 'Guy', 'tactical'], ['chef_cheveux_sales', 'Tonton - Chef des Cheveux Sales', 'hacker']], theme: 'prehistoric comedy, rival hair tribes, first murder mystery, and absurd stone-age logic', motif: 'wasteland', colors: ['#302214', '#080503', '#f0b45b'] },
    { key: 'cite_peur', universe: 'La Cite de la Peur', mediaType: 'movie', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'La Cite de la Peur', stage: 'Cannes Projection Slasher', boss: 'Odile Deray Premiere Trap', hero: ['odile_deray', 'Odile Deray', 'tactical'], allies: [['simon_jeremi', 'Simon Jeremi', 'hacker'], ['serge_karamazov', 'Serge Karamazov', 'slayer']], theme: 'French comedy thriller, film festival murders, meta-cinema jokes, and chaotic publicity tactics', motif: 'hauntedset', colors: ['#261414', '#040202', '#ff5757'] },
    { key: 'defiance', universe: 'Defiance', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Defiance', stage: 'Votan Frontier Siege', boss: 'Arkfall War Engine', hero: ['nolan_defiance', 'Joshua Nolan', 'marine'], allies: [['irisa_defiance', 'Irisa', 'slayer'], ['datak_tarr', 'Datak Tarr', 'tactical']], theme: 'post-alien-war frontier towns, Votan cultures, arkfall tech, and uneasy alliances', motif: 'wasteland', colors: ['#1e2b2b', '#030606', '#58d6c7'] },
    { key: 'mars_attacks', universe: 'Mars Attacks', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Hard', titleFr: 'Mars Attacks', stage: 'Ack Ack Capitol Invasion', boss: 'Martian Supreme Commander', hero: ['byron_mars', 'Byron Williams', 'marine'], allies: [['ritchie_mars', 'Richie Norris', 'hacker'], ['nathalie_mars', 'Nathalie Lake', 'tactical']], theme: 'Martian rayguns, cruel comedy invasion, flying saucers, and yodel-powered reversal', motif: 'arcanecity', colors: ['#10251b', '#020503', '#39ff66'] },
    { key: 'dandadan', universe: 'Dandadan', mediaType: 'manga', faction: 'arcane', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Dandadan', stage: 'Occult Alien Turbo Chase', boss: 'Turbo Granny UFO Merge', hero: ['momo_ayase', 'Momo Ayase', 'hacker'], allies: [['oken_dandadan', 'Okarun', 'slayer'], ['aira_dandadan', 'Aira Shiratori', 'tactical']], theme: 'aliens, yokai, psychic powers, turbo curses, and chaotic occult battles', motif: 'hauntedset', colors: ['#241531', '#050208', '#ff6ad5'] },
    { key: 'baby_cart', universe: 'Baby Cart', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Baby Cart', stage: 'Lone Wolf Assassin Road', boss: 'Yagyu Ambush Clan', hero: ['ogami_itto', 'Ogami Itto', 'slayer'], allies: [['daigoro_babycart', 'Daigoro', 'hacker'], ['azami_assassin', 'Roadside Assassin', 'tactical']], theme: 'ronin executioner road, hidden weapons cart, clan ambushes, and grim chanbara duels', motif: 'wasteland', colors: ['#201915', '#040303', '#d8b46a'] },
    { key: 'cloverfield', universe: 'Cloverfield', mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Cloverfield', stage: 'Manhattan Found Footage Collapse', boss: 'Clover Parasite Titan', hero: ['rob_cloverfield', 'Rob Hawkins', 'tactical'], allies: [['hud_cloverfield', 'Hud Platt', 'hacker'], ['marlena_cloverfield', 'Marlena Diamond', 'slayer']], theme: 'found-footage panic, city destruction, parasite bites, and colossal unseen biology', motif: 'arcanecity', colors: ['#141f25', '#020405', '#93c8d8'] },
    { key: 'collector', universe: 'The Collector', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'The Collector', stage: 'Trap House Extraction', boss: 'Collector Masked Architect', hero: ['arkin_collector', 'Arkin', 'tactical'], allies: [['elena_collector', 'Elena Peters', 'hacker'], ['lucello_collector', 'Lucello', 'marine']], theme: 'masked trap maker, house-wide mechanisms, desperate rescue, and brutal survival puzzles', motif: 'facility', colors: ['#1a1111', '#030202', '#d13d3d'] },
    {
      key: 'h2g2',
      universe: 'H2G2',
      mediaType: 'movie',
      faction: 'sciFi',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'H2G2',
      stage: 'Heart of Gold Improbability Drive',
      boss: 'Vogon Constructor Fleet',
      hero: ['arthur_dent_h2g2', 'Arthur Dent', 'hacker'],
      allies: [['ford_prefect', 'Ford Prefect', 'tactical'], ['trillian_h2g2', 'Trillian', 'slayer']],
      monsters: ['Vogon Guard', 'Bureaucratic Form Drone', 'Improbability Creature'],
      bosses: ['Marvin Depression Field', 'Vogon Constructor Fleet'],
      gear: [['h2g2_towel', 'Extremely Useful Towel', 'Serviette extremement utile', { def: 6, hp: 50 }], ['h2g2_babel_fish', 'Babel Fish', 'Poisson Babel', { spd: 2, def: 3 }], ['h2g2_guide', 'Hitchhiker s Guide', 'Guide du voyageur galactique', { hp: 70, atk: 4 }]],
      event: ['evt_h2g2_improbability', 'Infinite Improbability Jump', 'Saut d improbabilite infinie', 'The Heart of Gold turns the enemy formation into a harmless statistical impossibility for one beat.', 'Le Coeur en Or transforme la formation ennemie en impossibilite statistique inoffensive pendant un instant.'],
      theme: 'cosmic absurdity, guide entries, Vogon bureaucracy, towels, Babel fish, and probability disasters',
      motif: 'shipdeck',
      colors: ['#14243a', '#02050a', '#7dd3ff']
    },
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
    { key: 'spoof_movie', universe: 'Spoof Movie', mediaType: 'movie', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Spoof Movie', stage: 'South Central Block Party', boss: 'Toothpick (Cure-dents)', hero: ['spoof_survivor', 'Cendar (Ashtray)', 'hacker'], allies: [['parody_detective', 'Loc Dog', 'tactical'], ['slapstick_fighter', 'Preach', 'slayer']], theme: 'the 1996 Wayans hood-film parody, South Central sight gags, Loc Dog absurdity, and Ashtray learning to choose his own ending', motif: 'arcanecity', colors: ['#202020', '#040404', '#ffcf5a'] }
  ]),
  ...makeUniverseWave([
    { key: 'mgsr', universe: 'Metal Gear Rising', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Metal Gear Rising', stage: 'Denver Cyborg Duel', boss: 'Senator Armstrong Nanomachine Core', hero: ['raiden_mgr', 'Raiden', 'slayer'], allies: [['blade_wolf_mgr', 'Blade Wolf', 'tactical'], ['jetstream_sam', 'Jetstream Sam', 'slayer']], monsters: ['Cyborg Soldier', 'Gekko UG', 'Dwarf Gekko Swarm'], bosses: ['Sundowner', 'Mistral'], gear: [['hf_blade', 'HF Blade', 'Lame HF', { atk: 5 }], ['sombrero_shield', 'Sombrero Shield', 'Bouclier Sombrero', { def: 4 }], ['ripper_mode_chip', 'Ripper Mode Chip', 'Puce Mode Éventreur', { atk: 3, spd: 2 }]], event: ['evt_zandatsu', 'Zandatsu', 'Zandatsu', 'Slice an enemy in blade mode to restore HP and energy', 'Tranche un ennemi en mode lame pour restaurer PV et énergie'], theme: 'cyborg sword duels, private armies, memes, and nanomachine brutality', motif: 'facility', colors: ['#15202b', '#030507', '#58d6ff'] },
    { key: 'bioshock', universe: 'BioShock', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Hard', titleFr: 'BioShock', stage: 'Rapture ADAM Collapse', boss: 'Atlas Fontaine Splicer King', hero: ['jack_bioshock', 'Jack', 'hacker'], allies: [['big_daddy_bioshock', 'Big Daddy', 'marine'], ['little_sister_echo', 'Little Sister Echo', 'tactical']], monsters: ['Thuggish Splicer', 'Leadhead Splicer', 'Spider Splicer'], bosses: ['Frank Fontaine', 'Sander Cohen'], gear: [['wrench', 'Wrench', 'Clé à molette', { atk: 3 }], ['electro_bolt_vigor', 'Electro Bolt Vigor', 'Vigeur Éclair', { atk: 4, spd: 1 }], ['adam_syringe', 'ADAM Syringe', 'Seringue ADAM', { hp: 5 }]], event: ['evt_hypnotize_big_daddy', 'Hypnotize Big Daddy', 'Hypnotiser Big Daddy', 'Hypnotize a Big Daddy to fight alongside you for the wave', 'Hypnotise un Big Daddy pour combattre à vos côtés pendant la vague'], theme: 'underwater dystopia, plasmids, ADAM addiction, Big Daddies, and broken utopian science', motif: 'facility', colors: ['#123448', '#020709', '#b88942'] },
    { key: 'twisted_metal', universe: 'Twisted Metal', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Twisted Metal', stage: 'Calypso Deathmatch Freeway', boss: 'Sweet Tooth War Rig', hero: ['sweet_tooth_tm', 'Sweet Tooth', 'horror'], allies: [['outlaw_tm', 'Outlaw', 'tactical'], ['roadkill_tm', 'Roadkill', 'marine']], monsters: ['Outlaw Cop', 'Darkside Trucker', 'Remote Bomb Drone'], bosses: ['Calypso', 'Minion'], gear: [['napalm_canister', 'Napalm Canister', 'Cartouche de napalm', { atk: 5 }], ['shield_pickup', 'Shield Pickup', 'Bouclier récupéré', { def: 4 }], ['turbo_boost', 'Turbo Boost', 'Turbo', { spd: 5 }]], event: ['evt_flaming_head', 'Sweet Tooth Flaming Head', 'Tête enflammée de Sweet Tooth', 'Sweet Tooth ignites his head to deal massive fire damage to all enemies', 'Sweet Tooth enflamme sa tête pour infliger des dégâts de feu massifs à tous les ennemis'], theme: 'vehicular carnage, cursed wishes, arena mayhem, and clown-faced apocalypse metal', motif: 'wasteland', colors: ['#250f12', '#050203', '#ff3f2f'] },
    { key: 'spider_ps1', universe: 'Spider: The Video Game', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Medium', titleFr: 'Spider: The Video Game', stage: 'Circuit Boards', boss: 'Brain', hero: ['cyber_spider_kelly', 'Cybernetic Spider (Dr. Michael Kelly)', 'hacker'], allies: [['cyber_spider_flamethrower', 'Cybernetic Spider - Flamethrower Loadout', 'slayer'], ['cyber_spider_electro_beam', 'Cybernetic Spider - Electro-Beam Loadout', 'tactical']], monsters: ['Spider', 'Wasp', 'Infected Rat'], bosses: ['Mechanical Arm', 'Museum Boss'], gear: [['cyber_leg_flamethrower', 'Flamethrower Cyber-Leg', 'Patte cybernetique lance-flammes', { atk: 4 }], ['homing_missile_spider', 'Homing Missile', 'Missile a tete chercheuse', { atk: 5 }], ['electro_beam_spider', 'Electro-Beam', 'Electro-rayon', { atk: 3, spd: 2 }]], event: ['evt_microchip_gate', 'Microchip Gate Unlock', 'Ouverture de la porte a microprocesseurs', 'Collect the route microchips to unlock the next laboratory sector', 'Collecte les microprocesseurs du parcours pour ouvrir le secteur suivant du laboratoire'], theme: 'insect-scale laboratory platforming, cybernetic spider movement, interchangeable micro-weapons, giant electronics, and mechanical creature experiments', motif: 'facility', colors: ['#101a18', '#020504', '#5dff9e'] },
    { key: 'tomba', universe: 'Tomba', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Tomba', stage: 'Evil Pig Jungle Rift', boss: 'Seven Evil Pigs Gate', hero: ['tomba_hero', 'Tomba', 'slayer'], allies: [['charles_tomba', 'Charles', 'hacker'], ['tabby_tomba', 'Tabby', 'tactical']], monsters: ['Evil Pig Soldier', 'Cursed Mushroom', 'Kokka Bird'], bosses: ['100 Year Old Wise Man Trial', 'Evil Pig Boss Gate'], gear: [['grapple_hook', 'Grapple Hook', 'Grappin', { spd: 4 }], ['charity_wings', 'Charity Wings', 'Ailes de charité', { def: 3, spd: 1 }], ['phoenix_rod', 'Phoenix Rod', 'Bâton du phénix', { atk: 4 }]], event: ['evt_evil_pig_bag_seal', 'Evil Pig Bag Seal', 'Sceau du sac de cochon maléfique', 'Seal an Evil Pig into a bag to banish the curse from the area', 'Scelle un cochon maléfique dans un sac pour bannir la malédiction de la zone'], theme: 'pink-haired platforming, cursed pigs, jungle quests, and whimsical object logic', motif: 'wasteland', colors: ['#2e1b32', '#050207', '#ff66aa'] },
    { key: 'ff7', universe: 'Final Fantasy VII', mediaType: 'game', faction: 'sciFi', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Final Fantasy VII', stage: 'Midgar Mako Reactor Breach', boss: 'Safer Sephiroth Jenova Core', hero: ['cloud_ff7', 'Cloud Strife', 'slayer'], allies: [['tifa_ff7', 'Tifa Lockhart', 'slayer'], ['aerith_ff7', 'Aerith Gainsborough', 'tactical']], monsters: ['Shinra SOLDIER', 'Guard Scorpion Drone', 'Midgar Zolom'], bosses: ['Safer Sephiroth', 'Jenova BIRTH'], gear: [['buster_sword_hilt', 'Buster Sword Hilt', 'Poignée d\'épée Buster', { atk: 5 }], ['materia_bracer', 'Materia Bracer', 'Brassard à matéria', { def: 3, hp: 2 }], ['ribbon_accessory', 'Ribbon Accessory', 'Accessoire ruban', { def: 2, spd: 2 }]], event: ['evt_knights_of_the_round', 'Knights of the Round', 'Chevaliers de la Table Ronde', 'Summon the 13 Knights of the Round to deal devastating sequential damage', 'Invoque les 13 Chevaliers de la Table Ronde pour infliger des dégâts séquentiels dévastateurs'], theme: 'mako reactors, SOLDIER trauma, materia, planetary memory, and Jenova corruption', motif: 'facility', colors: ['#14261f', '#020503', '#6dff8d'] },
    { key: 'ff8', universe: 'Final Fantasy VIII', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Final Fantasy VIII', stage: 'Balamb Time Compression', boss: 'Ultimecia Junction Core', hero: ['squall_ff8', 'Squall Leonhart', 'slayer'], allies: [['rinoa_ff8', 'Rinoa Heartilly', 'hacker'], ['quistis_ff8', 'Quistis Trepe', 'tactical']], monsters: ['Galbadian Soldier', 'Bite Bug', 'T-Rexaur'], bosses: ['Ultimecia', 'Edea Kramer'], gear: [['gunblade_magazine', 'Gunblade Magazine', 'Chargeur de gunblade', { atk: 4, spd: 1 }], ['gf_junction_link', 'GF Junction Link', 'Lien d\'association GF', { hp: 3, def: 2 }], ['triple_triad_card', 'Triple Triad Card', 'Carte Triple Triad', { spd: 3 }]], event: ['evt_renzokuken', 'Renzokuken Limit Break', 'Limit Break Renzokuken', 'Unleash a flurry of gunblade strikes finishing with a powerful Lionheart blow', 'Déchaîne une rafale de coups de gunblade terminée par un puissant coup Cœur de Lion'], theme: 'gunblades, Gardens, Guardian Forces, sorceress wars, and time compression', motif: 'castle', colors: ['#19233b', '#03050a', '#8fb6ff'] },
    { key: 'ff13', universe: 'Final Fantasy XIII', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Final Fantasy XIII', stage: 'Cocoon FalCie Purge', boss: 'Orphan Cradle Core', hero: ['lightning_ff13', 'Lightning', 'slayer'], allies: [['fang_ff13', 'Fang', 'marine'], ['vanille_ff13', 'Vanille', 'hacker']], monsters: ['PSICOM Soldier', 'Behemoth Cub', 'Cie\'th Shambler'], bosses: ['Barthandelus', 'Orphan Core'], gear: [['blazefire_saber_mod', 'Blazefire Saber Mod', 'Mod sabre Éclair', { atk: 4, spd: 1 }], ['paradigm_shift_chip', 'Paradigm Shift Chip', 'Puce de changement de paradigme', { def: 3, spd: 2 }], ['crystarium_shard', 'Crystarium Shard', 'Éclat de Cristarium', { hp: 4 }]], event: ['evt_army_of_one', 'Army of One Assault', 'Assaut Armée Solitaire', 'Lightning strikes all enemies with a lightning-fast barrage of blows', 'Lightning frappe tous les ennemis avec un barrage de coups ultra-rapide'], theme: 'lCie brands, falCie destiny, paradigm shifts, and crystalline rebellion', motif: 'shipdeck', colors: ['#20273a', '#04060a', '#f0a8d8'] },
    { key: 'ff15', universe: 'Final Fantasy XV', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Final Fantasy XV', stage: 'Lucis Roadtrip Nightfall', boss: 'Ardyn Starscourge Throne', hero: ['noctis_ff15', 'Noctis Lucis Caelum', 'slayer'], allies: [['gladiolus_ff15', 'Gladiolus', 'marine'], ['ignis_ff15', 'Ignis', 'tactical']], monsters: ['MT Trooper', 'Iron Giant', 'Red Giant'], bosses: ['Ardyn Izunia', 'Ifrit Infernian'], gear: [['engine_blade_core', 'Engine Blade Core', 'Noyau de lame motrice', { atk: 4 }], ['royal_arm_shard', 'Royal Arm Shard', 'Éclat d\'arme royale', { atk: 3, def: 2 }], ['camping_utensils', 'Camping Utensils', 'Ustensiles de camping', { hp: 4, def: 1 }]], event: ['evt_armiger_unleashed', 'Armiger Unleashed', 'Arsenal fantôme libéré', 'Unleash all Royal Arms in a devastating spectral barrage around Noctis', 'Libère toutes les armes royales dans un barrage spectral dévastateur autour de Noctis'], theme: 'royal road trips, astral pacts, daemon nights, and warp-strike brotherhood', motif: 'wasteland', colors: ['#171b2b', '#030407', '#7d9bff'] },
    { key: 'crash_bandicoot', universe: 'Crash Bandicoot', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Crash Bandicoot', stage: 'Wumpa Island Cortex Lab', boss: 'Neo Cortex Mutagen Ray', hero: ['crash_bandicoot', 'Crash Bandicoot', 'slayer'], allies: [['coco_bandicoot', 'Coco Bandicoot', 'hacker'], ['aku_aku', 'Aku Aku', 'tactical']], monsters: ['Lab Assistant', 'Tribesman', 'TNT Crate Walker'], bosses: ['Neo Cortex', 'N. Gin Mech'], gear: [['wumpa_bazooka', 'Wumpa Bazooka', 'Bazooka à Wumpa', { atk: 4 }], ['aku_aku_mask_charm', 'Aku Aku Mask Charm', 'Charme du masque Aku Aku', { def: 3, hp: 2 }], ['power_crystal', 'Power Crystal', 'Cristal de puissance', { atk: 2, spd: 2 }]], event: ['evt_aku_aku_invincibility', 'Aku Aku Invincibility', 'Invincibilité Aku Aku', 'Collect three Aku Aku masks to become temporarily invincible', 'Collecte trois masques Aku Aku pour devenir temporairement invincible'], theme: 'wumpa crates, mutant islands, mask magic, spinning chaos, and mad science traps', motif: 'wasteland', colors: ['#2e1608', '#070301', '#ff8a22'] },
    { key: 'tomb_raider', universe: 'Tomb Raider', mediaType: 'game', faction: 'arcane', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Tomb Raider', stage: 'Ancient Tomb Relic Siege', boss: 'Atlantean Scion Guardian', hero: ['lara_croft_tr', 'Lara Croft', 'tactical'], allies: [['winston_tr', 'Winston', 'hacker'], ['jonah_tr', 'Jonah Maiava', 'marine']], monsters: ['Wolves', 'Atlantean Mutant', 'Mercenary Guard'], bosses: ['Natla', 'Atlantean Scion Guardian'], gear: [['dual_pistols', 'Dual Pistols', 'Double pistolets', { atk: 9, spd: 1 }], ['climbing_axe', 'Climbing Axe', 'Piolet d escalade', { atk: 7, def: 5 }], ['jade_dragon', 'Jade Dragon', 'Dragon de jade', { hp: 80, def: 4 }]], event: ['evt_adrenaline_dodge', 'Adrenaline Dodge', 'Esquive d adrenaline', 'Lara dodges incoming attacks and counters with precise dual-pistol fire.', 'Lara esquive les attaques et riposte avec un tir precis de ses pistolets.'], theme: 'ancient tombs, relic puzzles, dual pistols, traps, and archaeological survival', motif: 'castle', colors: ['#2a2115', '#050403', '#d4a64a'] },
    { key: 'tekken_ogre', universe: 'Tekken', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Very Hard', titleFr: 'Tekken', stage: 'King of Iron Fist Nexus', boss: 'True Ogre Ancient Form', hero: ['yoshimitsu_tekken', 'Yoshimitsu', 'slayer'], allies: [['true_ogre_tekken', 'True Ogre', 'horror'], ['gon_tekken', 'Gon', 'slayer']], monsters: ['Jack-4 Unit', 'Mokujin Puppet', 'Combot Drone'], bosses: ['True Ogre', 'Heihachi Mishima'], gear: [['iron_fist_gauntlet', 'Iron Fist Gauntlet', 'Gantelet du poing de fer', { atk: 10, def: 3 }], ['mishima_zaibatsu_badge', 'Mishima Zaibatsu Badge', 'Insigne du Zaibatsu Mishima', { def: 6, hp: 50 }], ['devil_gene_shard', 'Devil Gene Shard', 'Eclat du gene demoniaque', { atk: 8, spd: 2 }]], event: ['evt_rage_art', 'Rage Art', 'Art de rage', 'A devastating finishing combo unleashed when health is critical.', 'Un combo devastateur declenche quand la sante est critique.'], theme: 'martial arts tournaments, cursed bloodlines, weapon styles, ancient ogres, and arcade rivalries', motif: 'arcanecity', colors: ['#1d1828', '#040306', '#9dff4a'] },
    { key: 'spyro', universe: 'Spyro', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Spyro', stage: 'Artisans Dragon Realm', boss: 'Gnasty Gnorc Crystal Trap', hero: ['spyro_dragon', 'Spyro', 'slayer'], allies: [['sparx_spyro', 'Sparx', 'hacker'], ['hunter_spyro', 'Hunter', 'tactical']], monsters: ['Gnorc Soldier', 'Dream Weaver Ghost', 'Lava Toad'], bosses: ['Gnasty Gnorc', 'Ripto'], gear: [['dragonfly_jar', 'Dragonfly Jar', 'Bocal a libellule', { hp: 70, def: 3 }], ['gem_shard', 'Gem Shard', 'Eclat de gemme', { atk: 7, spd: 1 }], ['dragon_egg', 'Dragon Egg', 'Oeuf de dragon', { hp: 60, atk: 5 }]], event: ['evt_superflame_breath', 'Superflame Breath', 'Souffle de superflamme', 'Spyro unleashes a powered-up flame that scorches all enemies.', 'Spyro libere une flamme surpuissante qui calcine tous les ennemis.'], theme: 'dragon realms, gems, portals, gliding, and colorful platforming magic', motif: 'castle', colors: ['#2b1750', '#05020a', '#b56dff'] },
    { key: 'rayman', universe: 'Rayman', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Rayman', stage: 'Dream Forest Electoon Rift', boss: 'Mr Dark Nightmare Hand', hero: ['rayman_hero', 'Rayman', 'slayer'], allies: [['globox_rayman', 'Globox', 'marine'], ['betilla_rayman', 'Betilla', 'hacker']], monsters: ['Livid Dead', 'Dark Teensy', 'Lum Thief'], bosses: ['Mr Dark', 'Razoff'], gear: [['lum_magnet', 'Lum Magnet', 'Aimant a Lums', { spd: 2, hp: 50 }], ['plumbers_fist', 'Plumber s Fist', 'Poing du plombier', { atk: 9, def: 3 }], ['fairy_bottle', 'Fairy Bottle', 'Flacon de fee', { hp: 75, def: 4 }]], event: ['evt_moskito_ride', 'Moskito Ride', 'Chevauchee de Moskito', 'Rayman rides a Moskito, strafing enemies from above.', 'Rayman chevauche un Moskito et mitraille les ennemis depuis les airs.'], theme: 'limbless platforming, dream worlds, lums, strange music, and surreal cartoon hazards', motif: 'arcanecity', colors: ['#1b3f39', '#030807', '#ffdc4a'] },
    { key: 'croc', universe: 'Croc', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Croc', stage: 'Gobbo Island Baron Raid', boss: 'Baron Dante Crystal Beast', hero: ['croc_hero', 'Croc', 'slayer'], allies: [['gobbo_chief', 'Gobbo Chief', 'tactical'], ['beany_bird', 'Beany Bird', 'hacker']], monsters: ['Dantini Guard', 'Jelly Monster', 'Fire Imp'], bosses: ['Baron Dante', 'Flibby'], gear: [['crystal_heart', 'Crystal Heart', 'Coeur de cristal', { hp: 80, def: 4 }], ['gobbo_balloon', 'Gobbo Balloon', 'Ballon Gobbo', { spd: 2, hp: 40 }], ['barons_key', 'Baron s Key', 'Cle du Baron', { atk: 8, def: 5 }]], event: ['evt_gobbo_stampede', 'Gobbo Stampede', 'Ruee des Gobbos', 'A horde of rescued Gobbos stampedes across the field, trampling enemies.', 'Une horde de Gobbos sauves pietine le terrain et ecrase les ennemis.'], theme: 'gobbo rescue, island castles, crystal monsters, and cheerful platform adventure', motif: 'castle', colors: ['#163b18', '#030803', '#7dff5a'] },
    { key: 'parasite_eve', universe: 'Parasite Eve', mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Hard', titleFr: 'Parasite Eve', stage: 'NYC Mitochondria Opera', boss: 'Eve Ultimate Being', hero: ['aya_brea', 'Aya Brea', 'tactical'], allies: [['daniel_dollis', 'Daniel Dollis', 'marine'], ['maeda_pe', 'Kunihiko Maeda', 'hacker']], monsters: ['Mutant Rat', 'Slime Pod', 'Evolved Bird'], bosses: ['Eve Ultimate Being', 'Maya Brea'], gear: [['club_2_tonfa', 'Club 2 Tonfa', 'Tonfa Club 2', { atk: 9, spd: 1 }], ['parasite_energy_cell', 'Parasite Energy Cell', 'Cellule d energie parasite', { atk: 7, hp: 55 }], ['nypd_badge', 'NYPD Badge', 'Insigne du NYPD', { def: 6, hp: 50 }]], event: ['evt_liberate_mitochondria', 'Liberate Mitochondria', 'Liberation mitochondriale', 'Aya unleashes her parasite energy, igniting enemy cells from within.', 'Aya libere son energie parasite et embrase les cellules ennemies de l interieur.'], theme: 'mitochondrial horror, opera mutations, police investigation, and biological ascension', motif: 'facility', colors: ['#261314', '#050202', '#ff5f4a'] },
    { key: 'oddworld', universe: 'Oddworld', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Oddworld', stage: 'RuptureFarms Mudokon Escape', boss: 'Molluck Industrial Grinder', hero: ['abe_oddworld', 'Abe', 'hacker'], allies: [['munch_oddworld', 'Munch', 'tactical'], ['alf_mudokon', 'Alf', 'marine']], monsters: ['Slig Guard', 'Scrab', 'Paramite'], bosses: ['Molluck', 'Vykker Surgeon'], gear: [['soulstorm_brew', 'SoulStorm Brew', 'Breuvage SoulStorm', { atk: 8, spd: 1 }], ['mudokon_pop', 'Mudokon Pop', 'Soda Mudokon', { hp: 65, def: 3 }], ['elum_saddle', 'Elum Saddle', 'Selle d Elum', { spd: 2, hp: 45 }]], event: ['evt_possession_chant', 'Possession Chant', 'Chant de possession', 'Abe chants and possesses an enemy, turning them against their allies.', 'Abe psalmodie et possede un ennemi, le retournant contre ses allies.'], theme: 'industrial slavery, Mudokon chanting, possession puzzles, and dark alien satire', motif: 'facility', colors: ['#162b22', '#030605', '#7edc8a'] },
    { key: 'legacy_kain', universe: 'Legacy of Kain', mediaType: 'game', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Legacy of Kain', stage: 'Nosgoth Soul Reaver Rift', boss: 'Elder God Fate Engine', hero: ['kain_lok', 'Kain', 'horror'], allies: [['raziel_lok', 'Raziel', 'slayer'], ['moebius_lok', 'Moebius', 'hacker']], monsters: ['Vampire Fledgling', 'Sarafan Knight', 'Hylden Beast'], bosses: ['Elder God', 'Hash ak gik'], gear: [['soul_reaver_shard', 'Soul Reaver Shard', 'Eclat du Soul Reaver', { atk: 11, spd: 1 }], ['reaver_bolt', 'Reaver Bolt', 'Trait du Reaver', { atk: 8, def: 4 }], ['pillars_fragment', 'Pillars Fragment', 'Fragment des Piliers', { hp: 70, def: 5 }]], event: ['evt_soul_drain', 'Soul Drain', 'Drain d ame', 'Raziel devours enemy souls, healing allies and weakening foes.', 'Raziel devore les ames ennemies, soignant les allies et affaiblissant les adversaires.'], theme: 'vampire dynasties, soul reaving, fate loops, and decaying gothic Nosgoth', motif: 'castle', colors: ['#201126', '#040205', '#8d5aff'] },
    { key: 'rugrats', universe: 'Rugrats', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Rugrats', stage: 'Backyard Baby Imagination', boss: 'Reptar Toy Rampage', hero: ['tommy_pickles', 'Tommy Pickles', 'hacker'], allies: [['chuckie_finster', 'Chuckie Finster', 'tactical'], ['angelica_pickles', 'Angelica Pickles', 'horror']], theme: 'baby imagination, household objects, Reptar fantasies, and tiny-scale adventure logic', motif: 'arcanecity', colors: ['#2e3d17', '#060803', '#c7ff4a'] },
    { key: 'guitar_hero', universe: 'Guitar Hero', mediaType: 'game', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Guitar Hero', stage: 'Stadium Note Highway', boss: 'Star Power Feedback Demon', hero: ['guitar_hero_avatar', 'Guitar Hero', 'slayer'], allies: [['judy_nails', 'Judy Nails', 'hacker'], ['axel_steel', 'Axel Steel', 'marine']], monsters: ['Off-Beat Note', 'Feedback Ghost', 'Amp Overload'], bosses: ['Devil Went Down', 'Star Power Demon'], gear: [['whammy_bar', 'Whammy Bar', 'Barre de vibrato', { atk: 8, spd: 2 }], ['star_power_gem', 'Star Power Gem', 'Gemme Star Power', { atk: 10, hp: 40 }], ['guitar_pick_destiny', 'Guitar Pick of Destiny', 'Mediator du destin', { atk: 11 }]], event: ['evt_gh_star_power', 'Star Power Solo', 'Solo Star Power', 'A blazing guitar solo doubles attack power for the entire squad.', 'Un solo de guitare enflamme double la puissance d attaque de toute l escouade.'], theme: 'note highways, star power, plastic guitars, crowd energy, and rhythm duel spectacle', motif: 'facility', colors: ['#241433', '#050207', '#ff4fd8'] },
    { key: 'disenchantment', universe: 'Disenchantment', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Hard', titleFr: 'Desenchantee', stage: 'Dreamland Castle Curse Breach', boss: 'Dagmar Enchantress Doom', hero: ['bean_disenchantment', 'Bean', 'slayer'], allies: [['elfo_disenchantment', 'Elfo', 'hacker'], ['luci_disenchantment', 'Luci', 'horror']], monsters: ['Dreamland Guard', 'Enchanted Forest Ogre', 'Steamland Automaton'], bosses: ['Dagmar Spell Cascade', 'Trog Invasion Leader'], gear: [['bean_axe', 'Bean Royal Axe', 'Hache royale de Bean', { atk: 10, spd: 1 }], ['elfo_candy', 'Elfwood Candy Flask', 'Flasque bonbon Elfwood', { hp: 70, def: 3 }], ['luci_flask', 'Luci Demon Flask', 'Flasque demon de Luci', { atk: 7, spd: 2 }]], event: ['evt_disenchantment_curse', 'Dreamland Royal Curse', 'Malediction royale Dreamland', 'Bean channels the Dreamland curse to petrify enemies and drain their will.', 'Bean canalise la malediction de Dreamland pour petrifier les ennemis et drainer leur volonte.'], theme: 'cursed medieval kingdom, sarcastic princess, demon companion, elf misadventures, dark royal magic, and Dreamland chaos', motif: 'castle', colors: ['#2a1b3d', '#05030a', '#c78fff'] },
    {
      key: 'simpsons',
      universe: 'The Simpsons',
      mediaType: 'series',
      faction: 'arcane',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Les Simpson',
      stage: 'Springfield Nuclear Gag Breach',
      boss: 'Mr Burns Reactor Scheme',
      hero: ['homer_simpson', 'Homer Simpson', 'horror'],
      allies: [['bart_simpson', 'Bart Simpson', 'slayer'], ['lisa_simpson', 'Lisa Simpson', 'hacker']],
      monsters: ['Itchy and Scratchy Bot', 'Springfield Power Mutant', 'Kang and Kodos Probe'],
      bosses: ['Mr Burns Nuclear Scheme', 'Sideshow Bob Revenge Plot'],
      gear: [['simpsons_donut', 'Homer s Emergency Donut', 'Donut d urgence de Homer', { hp: 80 }], ['simpsons_sax', 'Lisa s Baritone Sax', 'Saxophone baryton de Lisa', { atk: 7, spd: 2 }], ['simpsons_slingshot', 'Bart s Slingshot', 'Lance-pierre de Bart', { atk: 8, def: 3 }]],
      event: ['evt_simpsons_couch', 'Couch Gag Reset', 'Reinitialisation du gag du canape', 'The scene restarts with the family already in position, restoring allies while preserving mission progress.', 'La scene recommence avec la famille deja en place, restaure les allies tout en conservant la progression de mission.'],
      theme: 'Springfield satire, nuclear accidents, family chaos, and endless sitcom reality resets',
      motif: 'arcanecity',
      colors: ['#2e2b12', '#070603', '#ffd83d']
    },
    { key: 'futurama', universe: 'Futurama', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Futurama', stage: 'Planet Express Timeline Leak', boss: 'Hypnotoad Delivery Singularity', hero: ['fry_futurama', 'Philip J. Fry', 'hacker'], allies: [['leela_futurama', 'Leela', 'slayer'], ['bender_futurama', 'Bender', 'marine']], monsters: ['Robot Mafia Enforcer', 'Brain Slug Host', 'Momcorp Killbot'], bosses: ['Roberto Knife Bot', 'Hypnotoad Broadcast'], theme: 'future delivery work, robot crime, alien bureaucracy, and time paradox comedy', motif: 'shipdeck', colors: ['#152b3d', '#03070a', '#55dfff'] },
    { key: 'big_mouth', universe: 'Big Mouth', mediaType: 'series', faction: 'horror', mode: 'RPG', difficulty: 'Medium', titleFr: 'Big Mouth', stage: 'Hormone Monster Hallway', boss: 'Depression Kitty Spiral', hero: ['maury_hm', 'Maury the Hormone Monster', 'horror'], allies: [['connie_hm', 'Connie the Hormone Monstress', 'slayer'], ['shame_wizard_hm', 'Shame Wizard', 'hacker']], monsters: ['Anxiety Mosquito', 'Puberty Troll', 'Lovebug Swarm'], bosses: ['Shame Wizard Spiral', 'Hate Worm Outbreak'], gear: [['hm_pillow', 'Hormone Monster Pillow', 'Oreiller de monstre hormonal', { hp: 65, def: 4 }], ['shame_cloak', 'Shame Wizard Cloak', 'Cape du Sorcier de la Honte', { def: 7, spd: 1 }], ['lovebug_jar', 'Lovebug Specimen Jar', 'Bocal a Lovebug', { atk: 8, hp: 30 }]], event: ['evt_bigmouth_hormone_surge', 'Hormone Surge Wave', 'Vague hormonale', 'Maury triggers a massive hormone surge that confuses enemies and boosts ally attack speed.', 'Maury declenche une vague hormonale massive qui deroute les ennemis et accelere les allies.'], theme: 'hormone monsters, puberty chaos, emotional avatars, anxiety mosquitos, shame wizards, and surreal adolescent psychology', motif: 'hauntedset', colors: ['#2b1730', '#060307', '#ff6aa5'] },
    { key: 'family_guy', universe: 'Family Guy', mediaType: 'series', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Les Griffin', stage: 'Quahog Cutaway Rift', boss: 'Chicken Fight Continuity Break', hero: ['peter_griffin', 'Peter Griffin', 'horror'], allies: [['stewie_griffin', 'Stewie Griffin', 'hacker'], ['brian_griffin', 'Brian Griffin', 'tactical']], theme: 'cutaway gags, Quahog chaos, talking dogs, and reality-breaking comedy loops', motif: 'arcanecity', colors: ['#203350', '#05070a', '#7dc7ff'] },
    { key: 'american_dad', universe: 'American Dad', mediaType: 'series', faction: 'sciFi', mode: 'Tactics', difficulty: 'Medium', titleFr: 'American Dad', stage: 'CIA Langley Alien Coverup', boss: 'Roger Persona Cascade', hero: ['stan_smith', 'Stan Smith', 'marine'], allies: [['roger_alien', 'Roger', 'hacker'], ['hayley_smith', 'Hayley Smith', 'tactical']], theme: 'CIA paranoia, alien disguises, family politics, and absurd covert operations', motif: 'facility', colors: ['#182b44', '#030609', '#ff4f5c'] },
    { key: 'killzone', universe: 'Killzone', mediaType: 'game', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Killzone', stage: 'Helghan Warzone Breach', boss: 'Helghast MAWLR Command', hero: ['sev_killzone', 'Sev', 'marine'], allies: [['rico_killzone', 'Rico', 'slayer'], ['echo_killzone', 'Echo', 'tactical']], monsters: ['Helghast Trooper', 'Helghast Sniper', 'Spider Mine'], bosses: ['Colonel Radec', 'MAWLR'], gear: [['sta52_rifle_mod', 'StA52 Rifle Mod', 'Mod fusil StA52', { atk: 10, def: 3 }], ['petrusite_cell', 'Petrusite Cell', 'Cellule de petrusite', { atk: 8, hp: 45 }], ['isa_medpack', 'ISA Medpack', 'Medikit ISA', { hp: 85, def: 3 }]], event: ['evt_arc_cannon_burst', 'Arc Cannon Burst', 'Salve de canon a arc', 'A devastating arc cannon blast electrifies the battlefield.', 'Un tir devastateur de canon a arc electrifie le champ de bataille.'], theme: 'Helghast warfare, ISA squads, industrial planets, and red-eyed battlefield pressure', motif: 'fortress', colors: ['#171d22', '#030405', '#ff3d32'] },
    { key: 'yakuza', universe: 'Yakuza', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Yakuza', stage: 'Kamurocho Street Brawl', boss: 'Tojo Clan Dragon Trial', hero: ['kiryu_yakuza', 'Kazuma Kiryu', 'slayer'], allies: [['majima_yakuza', 'Goro Majima', 'horror'], ['ichiban_yakuza', 'Ichiban Kasuga', 'tactical']], monsters: ['Yakuza Thug', 'Chinese Mafia Fighter', 'Dojima Enforcer'], bosses: ['Ryuji Goda', 'Nishikiyama'], gear: [['dragon_mail_gauntlet', 'Dragon Mail Gauntlet', 'Gantelet du dragon postal', { atk: 10, def: 4 }], ['staminan_royale', 'Staminan Royale', 'Staminan Royale', { hp: 90 }], ['legendary_tojo_ring', 'Legendary Tojo Ring', 'Anneau legendaire du Tojo', { atk: 8, spd: 2 }]], event: ['evt_tiger_drop', 'Tiger Drop', 'Frappe du tigre', 'Kiryu counters with a devastating Tiger Drop that shatters enemy defenses.', 'Kiryu contre-attaque avec un Tiger Drop devastateur qui brise les defenses ennemies.'], theme: 'street brawls, clan honor, karaoke side quests, and dramatic crime melodrama', motif: 'arcanecity', colors: ['#221313', '#040202', '#ff5252'] },
    { key: 'soul_calibur', universe: 'Soul Calibur', mediaType: 'game', faction: 'arcane', mode: 'Smash', difficulty: 'Hard', titleFr: 'Soul Calibur', stage: 'Cursed Sword Duel Shrine', boss: 'Inferno Soul Edge Avatar', hero: ['nightmare_sc', 'Nightmare', 'horror'], allies: [['siegfried_sc', 'Siegfried', 'slayer'], ['ivy_sc', 'Ivy', 'tactical']], monsters: ['Lizardman', 'Berserker', 'Malfested Soldier'], bosses: ['Inferno', 'Nightmare Soulcalibur'], gear: [['soul_edge_shard', 'Soul Edge Shard', 'Eclat de Soul Edge', { atk: 11, hp: 40 }], ['guard_impact_brace', 'Guard Impact Brace', 'Brassard de parade', { def: 7, spd: 1 }], ['ring_of_power', 'Ring of Power', 'Anneau de puissance', { atk: 8, def: 4 }]], event: ['evt_critical_edge', 'Critical Edge', 'Tranchant critique', 'A soul-charged blade strike deals massive damage to all enemies.', 'Une frappe chargee d ame inflige des degats massifs a tous les ennemis.'], theme: 'cursed blades, weapon masters, ancient arenas, and soul-consuming sword rituals', motif: 'castle', colors: ['#191326', '#030205', '#806dff'] },
    { key: 'last_of_us', universe: 'The Last of Us', mediaType: 'game', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'The Last of Us', stage: 'Cordyceps Quarantine Zone', boss: 'Bloater Spore Nest', hero: ['ellie_tlou', 'Ellie', 'slayer'], allies: [['joel_tlou', 'Joel', 'marine'], ['tess_tlou', 'Tess', 'tactical']], monsters: ['Runner', 'Clicker', 'Bloater'], bosses: ['David', 'Rat King'], gear: [['shiv', 'Shiv', 'Cisaille', { atk: 7, spd: 2 }], ['molotov_kit', 'Molotov Kit', 'Kit Molotov', { atk: 10 }], ['ellies_switchblade', 'Ellie s Switchblade', 'Cran d arret d Ellie', { atk: 8, spd: 1 }]], event: ['evt_listen_mode_pulse', 'Listen Mode Pulse', 'Impulsion mode ecoute', 'Enhanced hearing reveals all enemies and boosts squad evasion.', 'L ouie amplifiee revele tous les ennemis et ameliore l esquive de l escouade.'], theme: 'cordyceps infection, ruined cities, stealth survival, and found-family desperation', motif: 'wasteland', colors: ['#1d2518', '#030403', '#a0b86a'] },
    { key: 'little_big_planet', universe: 'LittleBigPlanet', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'LittleBigPlanet', stage: 'Craftworld Sticker Breach', boss: 'Negativitron Stitch Storm', hero: ['sackboy_lbp', 'Sackboy', 'hacker'], allies: [['sackgirl_lbp', 'Sackgirl', 'tactical'], ['toggle_lbp', 'Toggle', 'marine']], monsters: ['Negativitron Spawn', 'Meanie Guard', 'Bounce Pad Trap'], bosses: ['Negativitron', 'Collector'], gear: [['grappling_hook_lbp', 'Grappling Hook', 'Grappin', { spd: 2, def: 4 }], ['jetpack_lbp', 'Jetpack', 'Jetpack', { spd: 3, atk: 5 }], ['prize_bubble', 'Prize Bubble', 'Bulle de prix', { hp: 70, def: 3 }]], event: ['evt_popit_power', 'Popit Power', 'Pouvoir du Popit', 'Sackboy opens the Popit menu and creates obstacles that block enemy attacks.', 'Sackboy ouvre le menu Popit et cree des obstacles qui bloquent les attaques ennemies.'], theme: 'Craftworld creativity, stickers, handmade physics, and imagination-powered platforming', motif: 'arcanecity', colors: ['#2b2113', '#050403', '#f2c06b'] },
    { key: 'counter_strike', universe: 'Counter-Strike', mediaType: 'game', faction: 'cyber', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Counter-Strike', stage: 'Dust II Bombsite Breach', boss: 'Defuse Timer Singularity', hero: ['ct_operator_cs', 'CT Operator', 'tactical'], allies: [['terrorist_cs', 'Rogue Terrorist', 'slayer'], ['awper_cs', 'AWPer', 'marine']], monsters: ['Hostage Guard', 'Rogue Agent', 'Flashbang Drone'], bosses: ['Ace Clutch Boss', 'Defuse Timer Singularity'], gear: [['awp_scope', 'AWP Scope', 'Lunette AWP', { atk: 11, spd: 1 }], ['kevlar_vest', 'Kevlar Vest', 'Gilet en Kevlar', { def: 8, hp: 45 }], ['defuse_kit_cs', 'Defuse Kit', 'Kit de desamorcage', { spd: 2, def: 4 }]], event: ['evt_ace_clutch_round', 'Ace Clutch Round', 'Round ace clutch', 'The operator clutches the round solo, eliminating all enemies in sequence.', 'L operateur clutch le round en solo et elimine tous les ennemis en sequence.'], theme: 'bombsites, economy rounds, tactical peeks, defuse kits, and esports pressure', motif: 'facility', colors: ['#222820', '#050605', '#d7b45a'] },
    { key: 'left_4_dead', universe: 'Left 4 Dead', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Left 4 Dead', stage: 'No Mercy Rooftop Horde', boss: 'Tank Witch Crescendo', hero: ['zoey_l4d', 'Zoey', 'slayer'], allies: [['bill_l4d', 'Bill', 'marine'], ['ellis_l4d', 'Ellis', 'tactical']], monsters: ['Common Infected', 'Smoker', 'Hunter'], bosses: ['Tank', 'Witch'], gear: [['first_aid_kit_l4d', 'First Aid Kit', 'Trousse de premiers soins', { hp: 90, def: 3 }], ['pipe_bomb_l4d', 'Pipe Bomb', 'Bombe artisanale', { atk: 10 }], ['auto_shotgun_mod', 'Auto Shotgun Mod', 'Mod fusil a pompe auto', { atk: 9, def: 4 }]], event: ['evt_panic_event_horde', 'Panic Event Horde', 'Horde de panique', 'A massive infected horde swarms the battlefield, overwhelming enemies.', 'Une horde massive d infectes envahit le terrain et submerge les ennemis.'], theme: 'co-op zombie hordes, safe rooms, special infected, and desperate extraction finales', motif: 'hauntedset', colors: ['#1a1812', '#030302', '#d6563c'] },
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
    { key: 'skibidi', universe: 'Skibidi', mediaType: 'series', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Skibidi', stage: 'Camera City Toilet War', boss: 'Titan Toilet Broadcast Core', hero: ['cameraman_skibidi', 'Cameraman', 'tactical'], allies: [['speakerman_skibidi', 'Speakerman', 'slayer'], ['tvman_skibidi', 'TV Man', 'hacker']], monsters: ['Skibidi Toilet Scout', 'Parasite Toilet Swarm', 'Speaker Jammer Toilet'], bosses: ['Large Skibidi Toilet', 'Glitch Skibidi Toilet'], gear: [['skibidi_camera_lens', 'A.R.C.A. Camera Lens', 'Objectif camera A.R.C.A.', { spd: 2, def: 4 }], ['skibidi_speaker_core', 'Speaker Bass Core', 'Noyau basse speaker', { atk: 9 }], ['skibidi_tv_remote', 'Static TV Remote', 'Telecommande TV statique', { hp: 70, def: 3 }]], event: ['evt_skibidi_signal_jam', 'Signal Jam Chorus', 'Choeur brouillage signal', 'Camera, speaker, and TV units scramble the toilet broadcast before the breach escalates.', 'Les unites camera, speaker et TV brouillent la diffusion toilette avant que la breche escalade.'], theme: 'viral video war, camera soldiers, speaker blasts, TV hypnosis, and surreal toilet invasion escalation', motif: 'arcanecity', colors: ['#171b22', '#030405', '#80e8ff'] },
    { key: 'squid_game', universe: 'Squid Game', mediaType: 'series', faction: 'horror', mode: 'Tactics', difficulty: 'Hard', titleFr: 'Squid Game', stage: 'Red Light Green Light Arena', boss: 'Front Man Debt Trial', hero: ['gi_hun_squid', 'Seong Gi-hun', 'tactical'], allies: [['sae_byeok_squid', 'Sae-byeok', 'slayer'], ['ali_squid', 'Ali Abdul', 'marine']], theme: 'deadly children games, masked guards, debt pressure, and social survival trials', motif: 'facility', colors: ['#24131c', '#050203', '#ff3f8f'] },
    { key: 'casa_papel', universe: 'La Casa de Papel', mediaType: 'series', faction: 'cyber', mode: 'Tactics', difficulty: 'Hard', titleFr: 'La Casa de Papel', stage: 'Royal Mint Hostage Plan', boss: 'Inspector Siege Countdown', hero: ['professor_casa', 'The Professor', 'hacker'], allies: [['tokyo_casa', 'Tokyo', 'slayer'], ['nairobi_casa', 'Nairobi', 'tactical']], theme: 'heist planning, masks, hostages, police pressure, and rebellion iconography', motif: 'facility', colors: ['#2d1010', '#060202', '#ff2f2f'] },
    { key: 'skrillex', universe: 'Skrillex', mediaType: 'music', faction: 'cyber', mode: 'Smash', difficulty: 'Hard', titleFr: 'Skrillex', stage: 'Dubstep Bass Drop Breach', boss: 'Wub Singularity', hero: ['skrillex_avatar', 'Skrillex Avatar', 'hacker'], allies: [['bass_rider_skrillex', 'Bass Rider', 'slayer'], ['laser_dj_skrillex', 'Laser DJ', 'tactical']], theme: 'dubstep drops, neon bass pressure, glitch edits, and club-scale sonic ruptures', motif: 'facility', colors: ['#180f2e', '#030206', '#c14dff'] },
    { key: 'gorillaz', universe: 'Gorillaz', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'Gorillaz', stage: 'Plastic Beach Demon Studio', boss: 'Murdoc Bassline Phantom', hero: ['2d_gorillaz', '2-D', 'hacker'], allies: [['noodle_gorillaz', 'Noodle', 'slayer'], ['russel_gorillaz', 'Russel', 'marine']], theme: 'virtual band myth, haunted studios, plastic beaches, and animated genre-shifting sound', motif: 'shipdeck', colors: ['#102e35', '#020608', '#5ed6c8'] },
    { key: 'indila', universe: 'Indila', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Indila', stage: 'Derniere Danse Memory Street', boss: 'Echo of the Lost City', hero: ['indila_avatar', 'Indila Avatar', 'hacker'], allies: [['danse_echo', 'Danse Echo', 'tactical'], ['mini_world_spirit', 'Mini World Spirit', 'slayer']], theme: 'melancholic pop, cinematic streets, memory storms, and emotional resonance waves', motif: 'arcanecity', colors: ['#1d2638', '#03050a', '#d8a0ff'] },
    { key: 'monkey_island', universe: 'Secret of Monkey Island', mediaType: 'game', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Secret of Monkey Island', stage: 'Melee Island Insult Duel', boss: 'LeChuck Ghost Pirate', hero: ['guybrush_threepwood', 'Guybrush Threepwood', 'hacker'], allies: [['elaine_marley', 'Elaine Marley', 'tactical'], ['stan_monkey', 'Stan', 'slayer']], theme: 'pirate comedy, insult swordfighting, ghost curses, and point-and-click puzzle logic', motif: 'wasteland', colors: ['#1b2f3a', '#030608', '#ffd15a'] },
    { key: 'zombies_neighbors', universe: 'Zombies Ate My Neighbors', mediaType: 'game', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Zombies Ate My Neighbors', stage: 'Suburban Monster Rescue', boss: 'Giant Baby Chainsaw Panic', hero: ['zeke_zamn', 'Zeke', 'slayer'], allies: [['julie_zamn', 'Julie', 'tactical'], ['neighbor_rescue', 'Neighbor Rescue', 'hacker']], theme: 'suburban monster chaos, water guns, rescue runs, B-movie enemies, and arcade panic', motif: 'hauntedset', colors: ['#172b18', '#030603', '#7dff4f'] },
    { key: 'wrong_turn', universe: 'Wrong Turn', mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Very Hard', titleFr: 'Wrong Turn', stage: 'Backwoods Trap Ambush', boss: 'Mountain Clan Butcher', hero: ['jessie_wrongturn', 'Jessie Burlingame', 'tactical'], allies: [['chris_wrongturn', 'Chris Flynn', 'marine'], ['carly_wrongturn', 'Carly', 'hacker']], theme: 'backwoods traps, brutal survival, wrong roads, and isolated forest ambushes', motif: 'wasteland', colors: ['#171f10', '#030402', '#b5d15a'] },
    { key: 'kyary', universe: 'Kyary Pamyu Pamyu', mediaType: 'music', faction: 'arcane', mode: 'Smash', difficulty: 'Medium', titleFr: 'Kyary Pamyu Pamyu', stage: 'Harajuku Candy Pop Rift', boss: 'Kawaii Nightmare Parade', hero: ['kyary_avatar', 'Kyary Avatar', 'hacker'], allies: [['ponpon_dancer', 'PonPon Dancer', 'slayer'], ['fashion_spirit_kyary', 'Fashion Spirit', 'tactical']], theme: 'Harajuku surreal pop, candy colors, fashion monsters, and dreamlike music-video logic', motif: 'arcanecity', colors: ['#35143a', '#07020a', '#ff78df'] },
    {
      key: 'karune_cal',
      universe: 'Karune Cal',
      mediaType: 'music',
      faction: 'horror',
      mode: 'RPG',
      difficulty: 'Very Hard',
      title: 'Calne Ca (Karune Ca)',
      titleFr: 'Calne Ca (Karune Ca)',
      stage: 'Bacterial Contamination Machine Archive',
      boss: 'Calne Ca Mechanized Casing',
      hero: ['karune_cal_avatar', 'Calne Ca', 'horror'],
      allies: [['calcium_endoskeleton', 'Calcium Endoskeleton', 'slayer'], ['chibi_cal_san', 'Chibi Cal-san', 'hacker']],
      monsters: ['Magnesium Six-Legged Form', 'Isopod Head Parasite', 'Bacterial Contamination Husk'],
      bosses: ['Saikin Osen Organic Form', 'Calcium Exposed Endoskeleton'],
      gear: [['calne_isopod', 'Calne Ca Head Isopod', 'Isopode cranien de Calne Ca', { atk: 8, def: 6 }], ['calcium_tendon', 'Calcium Metal Tendon', 'Tendon metallique de Calcium', { atk: 10, spd: 1 }], ['miku_casing_fragment', 'Miku-Shaped Casing Fragment', 'Fragment de carapace en forme de Miku', { hp: 65, def: 5 }]],
      event: ['evt_calne_casing_split', 'Mechanized Casing Split', 'Ouverture de la carapace mecanisee', 'Calne Ca opens the humanoid casing and exposes Calcium for a precise mechanical strike.', 'Calne Ca ouvre sa carapace humanoide et expose Calcium pour une frappe mecanique precise.'],
      theme: 'Deinos Calne Ca derivative, a Miku-shaped casing around Calcium, exposed machine tendons, isopods, and bacterial contamination body horror',
      motif: 'facility',
      colors: ['#171a22', '#030304', '#65d6e8']
    },
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
    {
      key: 'little_big_band',
      universe: 'Little Big',
      mediaType: 'music',
      faction: 'cyber',
      mode: 'Smash',
      difficulty: 'Hard',
      titleFr: 'Little Big',
      stage: 'Skibidi Rave Video Set',
      boss: 'Generation Cancellation Broadcast',
      hero: ['ilya_prusikin_lb', 'Ilya Ilich Prusikin', 'slayer'],
      allies: [['sonya_tayurskaya_lb', 'Sonya Tayurskaya', 'slayer'], ['danny_zuckerman_lb', 'Danny Zuckerman', 'hacker'], ['viktor_sibrinin_lb', 'Viktor Sibrinin', 'tactical']],
      monsters: ['Skibidi Dance Double', 'Lolly Bomb Android', 'Hypnodancer Guard'],
      bosses: ['UNO Rave Champion', 'Lobster Popstar'],
      gear: [['littlebig_moustache', 'Ilich Stage Moustache', 'Moustache de scene d Ilich', { atk: 7, spd: 2 }], ['littlebig_uno_jacket', 'UNO Stage Jacket', 'Veste de scene UNO', { def: 6, hp: 55 }], ['littlebig_lobster_claws', 'Lobster Popstar Claws', 'Pinces Lobster Popstar', { atk: 10, hp: 35 }]],
      event: ['evt_littlebig_skibidi', 'Skibidi Choreography Break', 'Rupture choregraphique Skibidi', 'The current Little Big lineup turns synchronized absurdity into a hard-bass knockback wave.', 'La formation actuelle de Little Big transforme une choregraphie absurde synchronisee en onde de recul hard-bass.'],
      theme: 'Ilya Prusikin, Sonya Tayurskaya, Danny Zuckerman, Viktor Sibrinin, punk-pop-rave satire, and physical music-video choreography',
      motif: 'facility',
      colors: ['#25143a', '#050208', '#8dff4a']
    },
    { key: 'the_weeknd', universe: 'The Weeknd', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Hard', titleFr: 'The Weeknd', stage: 'After Hours Neon City', boss: 'Blinding Lights Red Suit', hero: ['weeknd_avatar', 'After Hours Avatar', 'hacker'], allies: [['neon_driver_weeknd', 'Neon Driver', 'tactical'], ['starboy_echo', 'Starboy Echo', 'slayer']], theme: 'nocturnal pop, neon city drives, red-suit imagery, and cinematic synthwave loneliness', motif: 'arcanecity', colors: ['#171326', '#030205', '#ff2f4f'] },
    { key: 'hoshi_music', universe: 'Hoshi', mediaType: 'music', faction: 'arcane', mode: 'RPG', difficulty: 'Medium', titleFr: 'Hoshi', stage: 'Coeur Parapluie Signal', boss: 'Amour Censure Storm', hero: ['hoshi_avatar', 'Hoshi Avatar', 'hacker'], allies: [['parapluie_echo', 'Parapluie Echo', 'tactical'], ['coeur_guard_hoshi', 'Coeur Guard', 'slayer']], theme: 'French pop emotion, intimate stages, heart imagery, and sincere vocal resonance', motif: 'arcanecity', colors: ['#251b28', '#050305', '#ff8fb6'] },
    { key: 'ado', universe: 'Ado', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Ado', stage: 'Usseewa Vocal Storm', boss: 'Show Shadow Diva', hero: ['ado_avatar', 'Ado Avatar', 'horror'], allies: [['uta_echo_ado', 'Uta Echo', 'hacker'], ['rebellion_dancer_ado', 'Rebellion Dancer', 'slayer']], theme: 'powerful vocals, rebellious silhouettes, anime-stage intensity, and shadowed pop theatre', motif: 'hauntedset', colors: ['#171327', '#030205', '#3f6dff'] },
    { key: 'asmrz', universe: 'ASMRZ', mediaType: 'music', faction: 'cyber', mode: 'RPG', difficulty: 'Medium', titleFr: 'ASMRZ', stage: 'Good Night Ojou-sama Mansion Set', boss: 'A.R.C.A. Good Night Choreography Echo', hero: ['asmrz_avatar', 'TANAKA', 'hacker'], allies: [['whisper_operator', 'NEEDMORECASH', 'tactical'], ['microphone_guard', 'GWANA', 'hacker']], theme: 'the TANAKA and NEEDMORECASH butler personas, multilingual bedtime warnings, formal service bells, and the viral Good Night Ojou-sama choreography produced by GWANA', motif: 'facility', colors: ['#14252a', '#030506', '#8fffea'] },
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
    {
      key: 'aural_vampire',
      universe: 'Aural Vampire',
      mediaType: 'music',
      faction: 'horror',
      mode: 'Smash',
      difficulty: 'Hard',
      titleFr: 'Aural Vampire',
      stage: 'Vampire Ecstasy Darkwave Club',
      boss: 'Zombie Naocchatte Procession',
      hero: ['exo_chika_av', 'EXO-CHIKA', 'horror'],
      allies: [['raveman_av', 'RAVEMAN', 'hacker'], ['wu_chy_av', 'Wu-CHY', 'marine'], ['higuchuuhei_av', 'Higuchuuhei', 'slayer'], ['zen_av', 'ZEN', 'hacker'], ['izu_av', 'IZU', 'marine']],
      monsters: ['Vampire Ecstasy Mannequin', 'Razors on Backstreet Butcher', 'Darkwave Bloodline Dancer'],
      bosses: ['Freeeze Masquerade', 'Zoltank Stage Vampire'],
      gear: [['exo_chika_microphone', 'EXO-CHIKA Vampire Microphone', 'Micro vampirique d EXO-CHIKA', { atk: 9, spd: 1 }], ['raveman_led_mask', 'RAVEMAN LED Mask', 'Masque LED de RAVEMAN', { def: 7, spd: 2 }], ['aural_synth_module', 'Aural Vampire Synth Module', 'Module synthe Aural Vampire', { atk: 8, hp: 50 }]],
      event: ['evt_aural_vampire_freeze', 'Freeeze Darkwave Drop', 'Drop darkwave Freeeze', 'EXO-CHIKA locks the crowd on the beat while RAVEMAN and the live band detonate the industrial sequence.', 'EXO-CHIKA fige la foule sur le rythme pendant que RAVEMAN et le groupe live declenchent la sequence industrielle.'],
      theme: 'EXO-CHIKA vocals, RAVEMAN masked electronics, Wu-CHY bass, Higuchuuhei guitar, ZEN keyboards, IZU drums, and Japanese darkwave horror theatre',
      motif: 'hauntedset',
      colors: ['#220d18', '#040102', '#ff3d8f']
    },
    {
      key: 'buckethead',
      universe: 'Buckethead',
      mediaType: 'music',
      faction: 'cyber',
      mode: 'RPG',
      difficulty: 'Medium',
      titleFr: 'Buckethead',
      stage: 'Bucketheadland Guitar Labyrinth',
      boss: 'Bucketheadland Automaton',
      hero: ['buckethead_avatar', 'Buckethead Persona', 'hacker'],
      allies: [['death_cube_k_echo', 'Death Cube K Echo', 'horror'], ['pike_riff_signal', 'Pike Riff Signal', 'slayer']],
      theme: 'masked guitar virtuosity, Bucketheadland surrealism, pike albums, silent stage personas, arcade-horror riffs, and instrumental labyrinths',
      motif: 'facility',
      colors: ['#181818', '#030303', '#f5f5f5'],
      monsters: ['Bucketheadland Toy Drone', 'Animatronic Riff Guard', 'White Mask Static'],
      bosses: ['Giant Robot Riff Engine', 'Death Cube K Shadow'],
      worldBoss: 'Bucketheadland Automaton',
      gear: [
        ['buckethead_white_mask', 'White Mask Resonator', 'Resonateur masque blanc', { def: 7, spd: 1 }],
        ['buckethead_bucket_crown', 'Bucket Crown Antenna', 'Antenne couronne-bucket', { hp: 60, atk: 5 }],
        ['buckethead_pike_pick', 'Pike Series Guitar Pick', 'Mediator serie Pike', { atk: 10 }]
      ],
      event: ['evt_buckethead_shred', 'Bucketheadland Shred Gate', 'Portail shred Bucketheadland', 'A silent guitar labyrinth opens, shredding hostile code and boosting squad tempo.', 'Un labyrinthe de guitare silencieux s ouvre, lacere le code hostile et accelere le tempo de l escouade.']
    },
    { key: 'korn', universe: 'Korn', mediaType: 'music', faction: 'horror', mode: 'Smash', difficulty: 'Hard', titleFr: 'Korn', stage: 'Nu-Metal Field Pit', boss: 'Freak on a Leash Core', hero: ['korn_avatar', 'Korn Avatar', 'horror'], allies: [['seven_string_riff', 'Seven String Riff', 'slayer'], ['bagpipe_signal', 'Bagpipe Signal', 'hacker']], theme: 'nu-metal dread, detuned riffs, cathartic screams, and mosh-pit emotional pressure', motif: 'hauntedset', colors: ['#181214', '#030202', '#b0b0b0'] },
    { key: 'marilyn_manson', universe: 'Marilyn Manson', mediaType: 'music', faction: 'horror', mode: 'RPG', difficulty: 'Very Hard', titleFr: 'Marilyn Manson', stage: 'Mechanical Animals Chapel', boss: 'Antichrist Superstar Effigy', hero: ['manson_avatar', 'Shock Rock Avatar', 'horror'], allies: [['mechanical_animal', 'Mechanical Animal', 'tactical'], ['pale_emperor_echo', 'Pale Emperor Echo', 'hacker']], theme: 'shock rock theatre, industrial glam, occult imagery, and corrupted celebrity rituals', motif: 'hauntedset', colors: ['#1f1111', '#030202', '#d9d9d9'] }
  ]),
  ...makeUniverseWave(CANONICAL_REQUESTED_UNIVERSE_WAVE),
  ...makeUniverseWave(REQUESTED_UNIVERSE_WAVE_WITHOUT_LEGACY_ITEMS)
];

FEATURED_UNIVERSE_PACKS.forEach(pack => {
  const existingIndex = EXPANDED_UNIVERSES.findIndex(universe => universe.universe === pack.universe);
  if (existingIndex >= 0) {
    EXPANDED_UNIVERSES[existingIndex] = pack;
  } else {
    EXPANDED_UNIVERSES.push(pack);
  }
});

OC_DLC_UNIVERSES.forEach(pack => {
  const alreadyRegistered = EXPANDED_UNIVERSES.some(universe => universe.universe === pack.universe);
  if (!alreadyRegistered) {
    EXPANDED_UNIVERSES.push(pack);
  }
});

ORIGINAL_UNIVERSE_WAVE.forEach(pack => {
  const existingIndex = EXPANDED_UNIVERSES.findIndex(
    universe => universe.universe === pack.universe
  );
  if (existingIndex >= 0) {
    EXPANDED_UNIVERSES[existingIndex] = pack;
  } else {
    EXPANDED_UNIVERSES.push(pack);
  }
});

makeUniverseWave(CANON_ROSTER_WAVE).forEach(pack => {
  const existingIndex = EXPANDED_UNIVERSES.findIndex(
    universe => universe.universe === pack.universe
  );
  if (existingIndex >= 0) {
    EXPANDED_UNIVERSES[existingIndex] = pack;
  } else {
    EXPANDED_UNIVERSES.push(pack);
  }
});

const CANON_ROSTER_UNIVERSES = new Set(CANON_ROSTER_WAVE.map(entry => entry.universe));

function splitCombatantsAndEncounters(universe) {
  const routeThreat = (threat, kind, index) => {
    const name = threatName(threat);
    const explicitType = threat && typeof threat === 'object'
      ? LEGACY_NON_COMBAT_TRIAL_TYPE_BY_ID.get(`${universe.universe}:${threat.id}`)
      : null;
    const legacyType = explicitType || LEGACY_NON_COMBAT_TRIAL_TYPE_BY_NAME.get(
      `${universe.universe}:${normalizeLegacyTrialName(name)}`
    );
    if (threat?.nonCombat !== true && !legacyType) {
      return { combatant: threat, encounter: null };
    }

    const generatedId = `legacy-${universe.key || normalizeLegacyTrialName(universe.universe).replace(/\s+/g, '-')}-${kind}-${index}-${normalizeLegacyTrialName(name).replace(/\s+/g, '-')}`;
    const source = threat && typeof threat === 'object'
      ? { ...threat, id: threat.id || generatedId, name: threat.name || name }
      : { id: generatedId, name };
    const routedThreat = {
      ...source,
      nonCombat: true,
      trialType: source.trialType || legacyType,
      nonCombatTrial: {
        ...(source.nonCombatTrial || {}),
        type: source.nonCombatTrial?.type || source.trialType || legacyType
      },
      visualAnchor: source.visualAnchor
        || `${universe.stageName}: ${name} represented as an objective state, never as a fighter.`
    };
    const policy = makeNonCombatPolicyFromThreat(universe.universe, routedThreat);
    return {
      combatant: null,
      encounter: policy
        ? { id: routedThreat.id, name: routedThreat.name, kind, threat: routedThreat, policy }
        : null
    };
  };

  const monsterRoutes = (universe.monsters || []).map((threat, index) => routeThreat(threat, 'monster', index));
  const bossRoutes = (universe.bosses || []).map((threat, index) => routeThreat(threat, 'boss', index));
  const existingEncounters = universe.encounters || [];
  const knownEncounterKeys = new Set(existingEncounters.map(encounter => (
    `${encounter.kind}:${encounter.id || normalizeLegacyTrialName(encounter.name)}`
  )));
  const routedEncounters = [...monsterRoutes, ...bossRoutes]
    .flatMap(route => route.encounter ? [route.encounter] : [])
    .filter(encounter => {
      const key = `${encounter.kind}:${encounter.id || normalizeLegacyTrialName(encounter.name)}`;
      if (knownEncounterKeys.has(key)) return false;
      knownEncounterKeys.add(key);
      return true;
    });

  return {
    monsters: monsterRoutes.flatMap(route => route.combatant ? [route.combatant] : []),
    bosses: bossRoutes.flatMap(route => route.combatant ? [route.combatant] : []),
    encounters: [...existingEncounters, ...routedEncounters]
  };
}

EXPANDED_UNIVERSES.forEach((universe, index) => {
  const worldBossOverride = getLoreWorldBossOverride(universe.universe);
  const worldBossPolicy = getResolvedLoreWorldBossPolicy(universe.universe)
    || (universe.mediaType === 'music'
      ? makeNonCombatPolicyFromThreat(universe.universe, {
          id: `${universe.key || universe.universe}-final-performance`,
          name: `${universe.universe} — final performance`,
          nonCombat: true,
          entityType: 'live-performance-trial',
          trialType: 'hit-targets',
          objectiveText: {
            fr: 'Réussir la performance finale en maintenant le rythme et la sécurité de la scène.',
            en: 'Complete the final performance while maintaining rhythm and stage safety.'
          },
          visualAnchor: universe.theme || universe.stageName
        })
      : null);
  const stageLoreProfile = getStageLoreProfile(universe.universe);
  const enrichedUniverse = { ...universe, ...splitCombatantsAndEncounters(universe) };

  if (worldBossOverride && !CANON_ROSTER_UNIVERSES.has(universe.universe)) {
    enrichedUniverse.worldBoss = makeLoreWorldBossRuntime(worldBossOverride);
    enrichedUniverse.worldBossPolicy = null;
  } else if (worldBossPolicy && !CANON_ROSTER_UNIVERSES.has(universe.universe)) {
    const clearCombatRoster = universe.mediaType === 'music'
      || shouldClearCombatRosterForPolicy(universe.universe);
    enrichedUniverse.worldBoss = null;
    enrichedUniverse.worldBossPolicy = worldBossPolicy;
    // A policy is an objective contract, never a boss label. Mixed universes
    // keep their last verified combat boss; pure puzzle/pursuit worlds expose
    // no boss at all.
    enrichedUniverse.bossName = clearCombatRoster
      ? null
      : threatName(enrichedUniverse.bosses.at(-1)) || null;
    if (clearCombatRoster) {
      enrichedUniverse.monsters = [];
      enrichedUniverse.bosses = [];
    }
  }

  if (stageLoreProfile) {
    enrichedUniverse.stageLoreProfile = stageLoreProfile;
  }

  EXPANDED_UNIVERSES[index] = enrichedUniverse;
});

function makeUniverseWave(entries) {
  return entries.map(entry => {
    const [skyTop, skyBottom, accent] = entry.colors;
    const title = entry.title || entry.universe;
    const titleFr = entry.titleFr || entry.universe;
    const shortKey = entry.key.replace(/[^a-z0-9_]/gi, '').toLowerCase();
    const authoredMonsters = entry.monsters || makeLoreEnemyWave(entry.universe, title);
    const authoredBosses = entry.bosses || makeLoreBossWave(entry.universe, title);
    const authoredWorldBoss = entry.worldBoss || entry.boss;
    const routeThreat = (threat, kind) => {
      const sourceName = threatName(threat);
      const legacyTrialType = (
        threat && typeof threat === 'object'
          ? LEGACY_NON_COMBAT_TRIAL_TYPE_BY_ID.get(`${entry.universe}:${threat.id}`)
          : null
      ) || LEGACY_NON_COMBAT_TRIAL_TYPE_BY_NAME.get(
        `${entry.universe}:${normalizeLegacyTrialName(sourceName)}`
      );
      if (threat?.nonCombat !== true && !legacyTrialType) {
        return { combatant: threat, encounter: null };
      }

      const generatedThreatId = `legacy-${entry.key}-${kind}-${normalizeLegacyTrialName(sourceName).replace(/\s+/g, '-')}`;
      const threatRecord = threat && typeof threat === 'object'
        ? { ...threat, id: threat.id || generatedThreatId, name: threat.name || sourceName }
        : {
            id: generatedThreatId,
            name: sourceName,
            visualAnchor: `${entry.stage}: ${sourceName} represented as an objective state, never as a fighter.`
          };
      const nonCombatThreat = legacyTrialType
        ? {
            ...threatRecord,
            nonCombat: true,
            trialType: threatRecord.trialType || legacyTrialType,
            nonCombatTrial: {
              ...(threatRecord.nonCombatTrial || {}),
              type: threatRecord.nonCombatTrial?.type || threatRecord.trialType || legacyTrialType
            }
          }
        : { ...threatRecord, nonCombat: true };
      const policy = makeNonCombatPolicyFromThreat(entry.universe, nonCombatThreat);
      return {
        combatant: null,
        encounter: {
          id: nonCombatThreat.id,
          name: nonCombatThreat.name,
          kind,
          threat: nonCombatThreat,
          policy
        }
      };
    };
    const monsterRoutes = authoredMonsters.map(threat => routeThreat(threat, 'monster'));
    const bossRoutes = authoredBosses.map(threat => routeThreat(threat, 'boss'));
    const worldBossRoute = routeThreat(authoredWorldBoss, 'worldBoss');
    const monsters = monsterRoutes.flatMap(route => route.combatant ? [route.combatant] : []);
    const bosses = bossRoutes.flatMap(route => route.combatant ? [route.combatant] : []);
    const encounters = [
      ...monsterRoutes.flatMap(route => route.encounter ? [route.encounter] : []),
      ...bossRoutes.flatMap(route => route.encounter ? [route.encounter] : []),
      ...(worldBossRoute.encounter ? [worldBossRoute.encounter] : [])
    ];
    const worldBossPolicy = worldBossRoute.encounter?.policy || null;
    const normalizeEncounterName = value => String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();
    const stageVariants = (entry.stageVariants || []).map(variant => {
      const normalizedVariant = Array.isArray(variant)
        ? {
            ...(variant[4] && typeof variant[4] === 'object' ? variant[4] : {}),
            mode: variant[0],
            name: variant[1],
            difficulty: variant[2],
            bossName: variant[3]
          }
        : { ...variant };
      const targetEncounter = encounters.find(encounter => (
        normalizeEncounterName(encounter.name) === normalizeEncounterName(normalizedVariant.bossName)
      ));
      if (!targetEncounter?.policy) return normalizedVariant;

      const trial = inferNonCombatTrial(targetEncounter.policy, {
        universe: entry.universe,
        sourceId: targetEncounter.id,
        sourceName: targetEncounter.name
      });
      return {
        ...normalizedVariant,
        originalMode: normalizedVariant.mode,
        mode: 'Smash',
        bossName: null,
        encounterId: targetEncounter.id,
        nonCombat: true,
        finalePolicy: targetEncounter.policy,
        nonCombatTrial: trial,
        objectiveType: trial?.type,
        enemyRoster: [],
        enemyRosterExclusive: true,
        disableItems: true,
        disableHazards: true
      };
    });
    const factionLine = {
      sciFi: 'technology, survival protocols, and breach combat',
      horror: 'fear pressure, curses, ambushes, and survival horror',
      cyber: 'rhythm, systems, speed, and glitch tactics',
      arcane: 'ritual logic, strange rules, and unstable magic'
    }[entry.faction] || 'multiverse instability and anomaly combat';

    return {
      key: entry.key,
      aliases: entry.aliases,
      canonProfile: entry.canonProfile,
      canonStatus: entry.canonStatus,
      referenceUrl: entry.referenceUrl,
      referenceUrls: entry.referenceUrls,
      visualAnchor: entry.visualAnchor,
      researchDate: entry.researchDate,
      licensing: entry.licensing,
      continuity: entry.continuity,
      fidelityNotes: entry.fidelityNotes,
      lore: entry.lore,
      universe: entry.universe,
      mediaType: entry.mediaType,
      faction: entry.faction,
      stageName: entry.stage,
      stageMeta: entry.stageMeta,
      mode: entry.mode,
      difficulty: entry.difficulty,
      bossName: worldBossRoute.encounter
        ? threatName(bosses.at(-1)) || worldBossPolicy?.objective?.fr || null
        : entry.boss,
      title: { en: title, fr: titleFr },
      desc: entry.desc || {
        en: `${capitalize(entry.theme)} collide with Nexus instability through ${factionLine}.`,
        fr: `${capitalize(entry.theme)} entrent en collision avec l instabilite du Nexus via ${factionLine}.`
      },
      hero: makeWaveHero(entry.hero, accent),
      allies: entry.allies.map((ally, index) => makeWaveHero(ally, index === 0 ? lightenAccent(accent) : darkenAccent(accent))),
      monsters,
      bosses,
      encounters,
      bossSlotPolicy: LORE_BOSS_SLOT_POLICY[entry.universe],
      worldBoss: worldBossRoute.combatant,
      worldBossPolicy,
      gear: entry.gear || makeLoreGearWave(entry.universe, shortKey, title, titleFr),
      event: entry.event || makeLoreEventWave(entry.universe, shortKey, title, titleFr),
      itemPolicy: getLoreItemPolicy(entry.universe),
      decor: {
        sky: [skyTop, skyBottom],
        floor: `rgba(${hexToRgb(accent).join(', ')}, 0.16)`,
        grid: `rgba(${hexToRgb(accent).join(', ')}, 0.28)`,
        motif: entry.motif,
        accent
      },
      stageVariants
    };
  });
}

function makeLoreEnemyWave(universe, title) {
  const confirmedEnemies = getLoreEnemyOverrides(universe);
  if (confirmedEnemies.length > 0) {
    return confirmedEnemies.map(({ output, ...enemy }) => ({
      ...enemy,
      spriteSource: output
    }));
  }

  return [`${title} Rift Drone`, `${title} Breach Stalker`, `${title} Anomaly Pack`];
}

function makeLoreBossWave(universe, title) {
  const confirmedBosses = LORE_BOSS_OVERRIDES[universe] || [];
  if (confirmedBosses.length > 0) {
    return confirmedBosses.map(({ output, ...boss }) => ({
      ...boss,
      spriteSource: output
    }));
  }

  return [`${title} Elite Guardian`, `${title} Crisis Avatar`];
}

function makeLoreWorldBossRuntime(override) {
  const signatureAttack = override.phases
    .flatMap(phase => phase.attacks)
    .filter(Boolean)
    .slice(-1)[0];

  return {
    ...override,
    loreLocalized: override.lore,
    lore: override.lore.fr,
    spriteSource: override.output,
    worldBossClass: override.layout,
    phaseSet: override.phases,
    special: signatureAttack || override.name,
    isWorldBoss: true
  };
}

function makeWaveHero([id, name, cat, metadata = {}], color) {
  const authoredMetadata = metadata && typeof metadata === 'object' && !Array.isArray(metadata)
    ? metadata
    : {};
  const normalizeMove = move => typeof move === 'string' ? { name: move } : move;
  const simple = normalizeMove(authoredMetadata.simple ?? authoredMetadata.basic);
  return {
    ...authoredMetadata,
    id,
    name,
    cat,
    color: authoredMetadata.color || color,
    ...(simple ? { simple } : {}),
    ...(authoredMetadata.secondary ? { secondary: normalizeMove(authoredMetadata.secondary) } : {}),
    ...(authoredMetadata.defense ? { defense: normalizeMove(authoredMetadata.defense) } : {}),
    ...(authoredMetadata.special ? { special: normalizeMove(authoredMetadata.special) } : {})
  };
}

function makeWaveGear(key, title, titleFr) {
  return [
    [`${key}_sigil`, `${title} Signature Relic`, `Relique signature ${titleFr}`, { atk: 8, spd: 1 }],
    [`${key}_armor`, `${title} Field Plate`, `Plaque terrain ${titleFr}`, { def: 6, hp: 45 }],
    [`${key}_core`, `${title} Nexus Core`, `Noyau Nexus ${titleFr}`, { hp: 75 }]
  ];
}

function makeLoreGearWave(universe, key, title, titleFr) {
  const loreItems = getLoreEquipmentOverrides(universe);
  if (loreItems.length > 0) {
    const boosts = [
      { atk: 8, spd: 1 },
      { def: 6, hp: 45 },
      { hp: 55, spd: 1 }
    ];
    return loreItems.map((entry, index) => ([
      entry.id,
      entry.name.en,
      entry.name.fr,
      boosts[index],
      entry
    ]));
  }

  if (getLoreItemPolicy(universe)?.status === 'disabled') return [];
  return makeWaveGear(key, title, titleFr);
}

function makeLoreEventWave(universe, key, title, titleFr) {
  const loreItem = getLoreEventItemOverride(universe);
  if (loreItem) {
    return [
      loreItem.id,
      loreItem.name.en,
      loreItem.name.fr,
      loreItem.desc.en,
      loreItem.desc.fr,
      loreItem
    ];
  }

  if (getLoreItemPolicy(universe)?.status === 'disabled') return null;
  return [
    `evt_${key}_breach`,
    `${title} Breach Signal`,
    `Signal breche ${titleFr}`,
    `${title} opens a signature anomaly that damages enemies and boosts the squad tempo.`,
    `${titleFr} ouvre une anomalie signature qui blesse les ennemis et accelere l escouade.`
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

export function stableTrialStageId(universe, encounterId) {
  const source = `${String(universe || 'Nexus')}\u241f${String(encounterId || 'trial')}`;
  let hash = 2166136261;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return 810000000 + (hash % 180000000);
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
    ...item,
    id: item.id,
    name: item.name,
    cat: item.cat,
    color: item.color,
    weapon: item.weapon || item.weaponType || weapon,
    stats: item.stats || stats
  };
}

function threatName(entry) {
  return typeof entry === 'string' ? entry : entry?.name;
}

function makeEnemy(entry, index, universe, tier = 0) {
  const rank = difficultyRank(universe);
  const threat = typeof entry === 'string' ? { name: entry } : entry || {};
  return {
    hp: 85 + rank * 18 + tier * 35 + index * 12,
    atk: 11 + rank * 2 + tier * 4 + index,
    spd: 4 + (index % 3),
    color: universe.decor.accent,
    weapon: universe.faction === 'arcane' ? 'magic' : universe.faction === 'cyber' ? 'laser' : universe.faction === 'horror' ? 'claws' : 'gun',
    ...threat,
    name: threat.name || 'Unknown Threat',
    lore: threat.lore || FEATURED_ENEMY_LORE[universe.universe]?.[threat.name]
  };
}

function getStageLoreMetadata(stage) {
  const profile = getStageLoreProfile(stage);
  if (!profile) return {};

  return {
    stageLore: {
      key: profile.key,
      canonicalName: profile.canonicalName,
      referenceUrls: profile.referenceUrls,
      visualAnchor: profile.visualAnchor,
      priority: profile.priority,
      auditStatus: profile.auditStatus,
      generationBlocked: profile.generationBlocked
    },
    stageAssetPlan: getStageLoreAssetPlan(stage, stage.mode)
  };
}

function trialRewardFor(universe) {
  const reward = rewardFor(universe);
  return {
    goldPrize: Math.max(20, Math.round(reward.goldPrize * 0.35)),
    shardPrize: Math.max(8, Math.round(reward.shardPrize * 0.35)),
    ...(reward.tokenPrize
      ? { tokenPrize: Math.max(1, Math.round(reward.tokenPrize * 0.35)) }
      : {})
  };
}

const EXPANDED_STAGE_RUNTIME_METADATA_KEYS = [
  'contentPackId',
  'contentOrigin',
  'originalContent',
  'originalContentNotice',
  'ocDlc',
  'dlcStage',
  'standalone',
  'numberedAct',
  'campaignDependency',
  'requiredCampaignStageIds',
  'actLabel',
  'packTitle',
  'displayName',
  'bossNameLocalized',
  'bossId',
  'previousStageId',
  'contentStageId',
  'stageKey',
  'objectiveType',
  'setting',
  'production',
  'stageArt',
  'sourceUniverses',
  'enemyRoster',
  'enemyRosterExclusive',
  'encounterId',
  'originalMode',
  'nonCombat',
  'nonCombatTrial',
  'disableItems',
  'disableHazards',
  'tacticsBattlefieldId',
  'smashArenaId',
  'intro',
  'scenes',
  'outro',
  'storyBeat',
  'objective',
  'stakes',
  'consequence',
  'reward',
  'rewardItemId',
  'rewardItemName',
  'eventRewardId',
  'goldPrize',
  'shardPrize',
  'tokenPrize'
];

function getExpandedStageRuntimeMetadata(source) {
  const metadata = Object.fromEntries(
    EXPANDED_STAGE_RUNTIME_METADATA_KEYS
      .filter(key => Object.hasOwn(source, key))
      .map(key => [key, source[key]])
  );

  if (source.ocDlc && !Object.hasOwn(metadata, 'dlcStage')) {
    metadata.dlcStage = true;
  }

  return metadata;
}

export function getExpandedStages() {
  const primaryStages = EXPANDED_UNIVERSES.flatMap((universe, index) => (
    universe.skipPrimaryStage
      ? []
      : (() => {
        const primaryEncounter = universe.encounters?.[0]
          || (universe.worldBossPolicy && universe.monsters.length === 0 && universe.bosses.length === 0
            ? {
                id: universe.worldBossPolicy.legacyWorldBossId,
                name: universe.title?.fr || universe.universe,
                policy: universe.worldBossPolicy
              }
            : null);
        const hasCombatActors = universe.monsters.length > 0
          || universe.bosses.length > 0
          || Boolean(universe.worldBoss);
        const usePrimaryTrial = Boolean(
          primaryEncounter?.policy
          && !hasCombatActors
        );
        const primaryTrial = usePrimaryTrial
          ? inferNonCombatTrial(primaryEncounter.policy, {
              universe: universe.universe,
              sourceId: primaryEncounter.id,
              sourceName: primaryEncounter.name
            })
          : null;
        const stage = {
          id: universe.stageId ?? stageIdFor(index),
          name: universe.stageName,
          universe: universe.universe,
          mode: usePrimaryTrial ? 'Smash' : universe.mode,
          originalMode: usePrimaryTrial ? universe.mode : undefined,
          difficulty: universe.difficulty,
          bossName: usePrimaryTrial ? null : universe.bossName,
          finalePolicy: usePrimaryTrial ? primaryEncounter.policy : null,
          encounterId: usePrimaryTrial ? primaryEncounter.id : undefined,
          nC: usePrimaryTrial,
          nonCombat: usePrimaryTrial,
          nonCombatTrial: primaryTrial,
          objectiveType: primaryTrial?.type,
          enemyRoster: usePrimaryTrial ? [] : universe.enemyRoster,
          enemyRosterExclusive: usePrimaryTrial ? true : universe.enemyRosterExclusive,
          disableItems: usePrimaryTrial ? true : universe.disableItems,
          disableHazards: usePrimaryTrial ? true : universe.disableHazards,
          loreDescription: FEATURED_STAGE_LORE[universe.universe]?.[universe.stageName]
            || FEATURED_STAGE_LORE[universe.universe]?.[universe.mode],
          ...(usePrimaryTrial ? trialRewardFor(universe) : rewardFor(universe)),
          optionalTrial: false,
          countsTowardCampaign: true,
          ...getExpandedStageRuntimeMetadata(universe)
        };
        return [{ ...stage, ...getStageLoreMetadata(stage) }];
      })()
  ));

  const variantStages = EXPANDED_UNIVERSES.flatMap((universe, universeIndex) => (
    (universe.stageVariants || []).map((variant, variantIndex) => {
      const stageProfile = { ...universe, ...variant };
      const stage = {
        id: variant.id ?? variant.stageId ?? (30000 + universeIndex * 10 + variantIndex),
        name: variant.name,
        universe: universe.universe,
        mode: variant.mode,
        difficulty: variant.difficulty || universe.difficulty,
        bossName: Object.hasOwn(variant, 'bossName') ? variant.bossName : universe.bossName,
        finalePolicy: variant.finalePolicy || null,
        encounterId: variant.encounterId,
        nC: Boolean(variant.nonCombatTrial || variant.nonCombat),
        nonCombat: Boolean(variant.nonCombatTrial || variant.nonCombat),
        nonCombatTrial: variant.nonCombatTrial || null,
        originalMode: variant.originalMode,
        enemyRoster: variant.nonCombatTrial ? [] : variant.enemyRoster,
        enemyRosterExclusive: variant.nonCombatTrial ? true : variant.enemyRosterExclusive,
        disableItems: variant.nonCombatTrial ? true : variant.disableItems,
        disableHazards: variant.nonCombatTrial ? true : variant.disableHazards,
        loreDescription: FEATURED_STAGE_LORE[universe.universe]?.[variant.name]
          || FEATURED_STAGE_LORE[universe.universe]?.[variant.mode],
        ...(variant.nonCombatTrial ? trialRewardFor(stageProfile) : rewardFor(stageProfile)),
        optionalTrial: false,
        countsTowardCampaign: true,
        ...getExpandedStageRuntimeMetadata(stageProfile)
      };
      return { ...stage, ...getStageLoreMetadata(stage) };
    })
  ));

  const projectedStages = [...primaryStages, ...variantStages];
  const representedEncounterIds = new Set(
    projectedStages
      .filter(stage => stage.nonCombatTrial && stage.encounterId)
      .map(stage => `${stage.universe}:${stage.encounterId}`)
  );
  const representedPolicyIds = new Set(
    projectedStages
      .filter(stage => stage.nonCombatTrial && stage.finalePolicy?.legacyWorldBossId)
      .map(stage => `${stage.universe}:${stage.finalePolicy.legacyWorldBossId}`)
  );
  const dedicatedTrialStages = EXPANDED_UNIVERSES.flatMap((universe, universeIndex) => {
    const candidates = (universe.encounters || [])
      .filter(encounter => !representedEncounterIds.has(`${universe.universe}:${encounter.id}`))
      .map(encounter => ({
        encounterId: encounter.id,
        sourceName: encounter.name,
        policy: encounter.policy
      }));
    if (
      universe.worldBossPolicy
      && !representedPolicyIds.has(`${universe.universe}:${universe.worldBossPolicy.legacyWorldBossId}`)
      && !candidates.some(candidate => (
        candidate.policy?.legacyWorldBossId === universe.worldBossPolicy.legacyWorldBossId
      ))
    ) {
      candidates.push({
        encounterId: universe.worldBossPolicy.legacyWorldBossId,
        sourceName: universe.title?.fr || universe.universe,
        policy: universe.worldBossPolicy
      });
    }

    return candidates.flatMap(candidate => {
      if (!candidate.policy) return [];
      const trial = inferNonCombatTrial(candidate.policy, {
        universe: universe.universe,
        sourceId: candidate.encounterId,
        sourceName: candidate.sourceName
      });
      if (!trial) return [];
      const stageProfile = { ...universe, mode: 'Smash' };
      const hybridLeadInStageId = candidate.policy.policy === 'stageSetpiece'
        && (universe.monsters.length > 0 || universe.bosses.length > 0 || universe.worldBoss)
        ? universe.stageId ?? stageIdFor(universeIndex)
        : null;
      const stage = {
        id: stableTrialStageId(universe.universe, candidate.encounterId),
        name: `Épreuve — ${candidate.sourceName}`,
        displayName: {
          fr: `Épreuve — ${candidate.sourceName}`,
          en: `Trial — ${candidate.sourceName}`
        },
        universe: universe.universe,
        mode: 'Smash',
        originalMode: universe.mode,
        difficulty: universe.difficulty,
        bossName: null,
        encounterId: candidate.encounterId,
        nC: true,
        nonCombat: true,
        finalePolicy: candidate.policy,
        nonCombatTrial: trial,
        objectiveType: trial.type,
        enemyRoster: [],
        enemyRosterExclusive: true,
        disableItems: true,
        disableHazards: true,
        optionalTrial: true,
        countsTowardCampaign: false,
        hybridSetpiece: Boolean(hybridLeadInStageId),
        requiredLeadInStageId: hybridLeadInStageId || undefined,
        loreDescription: candidate.policy.objective?.fr,
        ...trialRewardFor(stageProfile)
      };
      return [{ ...stage, ...getStageLoreMetadata(stage) }];
    });
  });

  const stages = [...projectedStages, ...dedicatedTrialStages];
  const seenIds = new Set();
  for (const stage of stages) {
    if (seenIds.has(stage.id)) {
      throw new Error(`[expandedUniverses] duplicate stage ID ${stage.id}`);
    }
    seenIds.add(stage.id);
  }
  return stages;
}

export const EXPANDED_STAGE_ID_BY_UNIVERSE = Object.fromEntries(
  EXPANDED_UNIVERSES.flatMap((universe, index) => (
    universe.skipPrimaryStage ? [] : [[universe.universe, universe.stageId ?? stageIdFor(index)]]
  ))
);

export const EXPANDED_UNIVERSE_SIGNATURES = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, {
    universe: universe.universe,
    mediaType: universe.mediaType,
    faction: universe.faction,
    sourceType: universe.sourceType,
    isOriginal: universe.isOriginal === true,
    theme: universe.theme || universe.desc?.en || universe.universe,
    stageName: universe.stageName,
    bossName: universe.bossName,
    worldBoss: threatName(universe.worldBoss),
    worldBossPolicy: universe.worldBossPolicy || null,
    canonicalStage: universe.stageLoreProfile?.canonicalName,
    monsters: universe.monsters.map(threatName),
    bosses: universe.bosses.map(threatName),
    encounters: (universe.encounters || []).map(encounter => ({
      id: encounter.id,
      name: encounter.name,
      kind: encounter.kind,
      nonCombat: true,
      trialType: encounter.policy?.trialType
    })),
    gearNames: universe.gear.map(([, enName, frName]) => ({ en: enName, fr: frName })),
    eventName: universe.event ? { en: universe.event[1], fr: universe.event[2] } : null,
    eventDesc: universe.event ? { en: universe.event[3], fr: universe.event[4] } : null
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
    sourceType: universe.sourceType,
    isOriginal: universe.isOriginal === true,
    originalContent: universe.originalContent === true,
    originalContentNotice: universe.originalContentNotice,
    theme: universe.theme || universe.desc?.en,
    stageName: universe.stageName,
    bossName: universe.bossName,
    worldBoss: threatName(universe.worldBoss),
    worldBossPolicy: universe.worldBossPolicy || null,
    canonicalStage: universe.stageLoreProfile?.canonicalName,
    encounters: (universe.encounters || []).map(encounter => ({
      id: encounter.id,
      name: encounter.name,
      kind: encounter.kind,
      nonCombat: true,
      policy: encounter.policy
    })),
    title: universe.title,
    desc: universe.desc,
    narrativeArc: universe.narrativeArc,
    livingWorld: universe.livingWorld,
    worldItems: universe.worldItems,
    audiovisual: universe.audiovisual,
    sensitivityNotes: universe.sensitivityNotes
  }])
);

export const EXPANDED_ENEMIES_DB = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, {
    monsters: universe.monsters.map((entry, index) => makeEnemy(entry, index, universe)),
    bosses: universe.bosses.map((entry, index) => {
      const enemy = makeEnemy(entry, index, universe, 2);
      const hasAuthoredStats = entry && typeof entry === 'object';
      return {
        ...enemy,
        hp: hasAuthoredStats && Number.isFinite(entry.hp)
          ? entry.hp
          : 420 + difficultyRank(universe) * 70 + index * 65,
        atk: hasAuthoredStats && Number.isFinite(entry.atk)
          ? entry.atk
          : 19 + difficultyRank(universe) * 3 + index * 3,
        special: enemy.special || `${enemy.name} Breach Pattern`
      };
    }),
    finalePolicy: universe.worldBossPolicy || null,
    trials: (universe.encounters || []).map(encounter => ({
      id: encounter.id,
      name: encounter.name,
      kind: encounter.kind,
      nonCombat: true,
      output: encounter.threat?.output || encounter.threat?.spriteSource,
      spriteSource: encounter.threat?.spriteSource || encounter.threat?.output,
      referenceUrl: encounter.threat?.referenceUrl,
      referenceUrls: encounter.threat?.referenceUrls,
      visualAnchor: encounter.threat?.visualAnchor,
      canonStatus: encounter.threat?.canonStatus,
      spritePrompt: encounter.threat?.spritePrompt,
      lore: encounter.threat?.lore,
      policy: encounter.policy,
      trial: inferNonCombatTrial(encounter.policy, {
        universe: universe.universe,
        sourceId: encounter.id,
        sourceName: encounter.name
      })
    })),
    worldBoss: universe.worldBoss ? (() => {
      const enemy = makeEnemy(universe.worldBoss, 0, universe, 4);
      const hasAuthoredStats = typeof universe.worldBoss === 'object';
      return {
        ...enemy,
        hp: hasAuthoredStats && Number.isFinite(universe.worldBoss.hp)
          ? universe.worldBoss.hp
          : 1180 + difficultyRank(universe) * 170,
        atk: hasAuthoredStats && Number.isFinite(universe.worldBoss.atk)
          ? universe.worldBoss.atk
          : 30 + difficultyRank(universe) * 4,
        spd: hasAuthoredStats && Number.isFinite(universe.worldBoss.spd)
          ? universe.worldBoss.spd
          : 4,
        special: enemy.special || `${enemy.name} Omniverse Rupture`
      };
    })() : null
  }])
);

export const EXPANDED_GEAR = EXPANDED_UNIVERSES.flatMap(universe =>
  universe.gear.map(([id, enName, frName, boost, metadata = {}], index) => ({
    ...metadata,
    id,
    universe: universe.universe,
    name: { en: enName, fr: frName },
    desc: metadata.desc || FEATURED_GEAR_LORE[id],
    boost,
    cost: 100 + difficultyRank(universe) * 20 + index * 15,
    icon: metadata.icon,
    iconPrompt: metadata.iconPrompt,
    referenceUrl: metadata.referenceUrl,
    visualAnchor: metadata.visualAnchor,
    audit: metadata.audit
  }))
);

export const EXPANDED_EVENT_ITEMS = Object.fromEntries(
  EXPANDED_UNIVERSES.flatMap(universe => {
    if (!universe.event) return [];
    const [id, enName, frName, enDesc, frDesc, metadata = {}] = universe.event;
    const visualMetadata = getGearShopVisualMetadata({
      id,
      universe: universe.universe,
      metadata
    });
    return [[universe.universe, {
      ...visualMetadata,
      id,
      name: { en: enName, fr: frName },
      desc: { en: enDesc, fr: frDesc },
      effect: id.replace('evt_', ''),
      icon: visualMetadata.icon,
      iconPrompt: visualMetadata.iconPrompt,
      referenceUrl: visualMetadata.referenceUrl,
      visualAnchor: visualMetadata.visualAnchor,
      audit: visualMetadata.audit
    }]];
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

export const EXPANDED_EVENT_SHOP_ITEMS = EXPANDED_UNIVERSES.flatMap(universe => {
  if (!universe.event) return [];
  const [id, enName, frName, enDesc, frDesc, metadata = {}] = universe.event;
  const visualMetadata = getGearShopVisualMetadata({
    id,
    universe: universe.universe,
    metadata
  });
  return [{
    ...visualMetadata,
    id,
    name: { en: enName, fr: frName },
    desc: { en: enDesc, fr: frDesc },
    isCombatEvent: true,
    universe: universe.universe,
    tokenCost: 4 + Math.min(4, difficultyRank(universe)),
    // Keep the OpenAI/lore contract intact when an event enters the Gear Shop.
    icon: visualMetadata.icon,
    iconPrompt: visualMetadata.iconPrompt,
    referenceUrl: visualMetadata.referenceUrl,
    visualAnchor: visualMetadata.visualAnchor,
    audit: visualMetadata.audit
  }];
});

export const EXPANDED_STAGE_ACCENT_BY_UNIVERSE = Object.fromEntries(
  EXPANDED_UNIVERSES.map(universe => [universe.universe, colorPalette[universe.faction] || universe.decor.accent])
);
