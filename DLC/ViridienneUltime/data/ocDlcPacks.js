import {
  ORIGINAL_CONTENT_NOTICE,
  defineSkill,
  defineHero,
  defineThreat,
  defineGear,
  defineEvent,
  defineScene,
  defineMission
} from '../../../src/game/content/ocDlcFactories.js';

const STAR_GARDEN_ID = 'oc-dlc-star-garden';

const VIRIDIENNE_SLUG = 'viridienne-ultime';

const VIRIDIENNE_HEROES = [
  defineHero(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'eira_solenne',
    name: 'Eira Solenne',
    cat: 'hacker',
    color: '#ffe784',
    weapon: 'photosphere_staff',
    stats: { hp: 108, atk: 14, def: 6, spd: 6 },
    lore: {
      en: 'A star-seed botanist who listens to the futures sleeping inside extinct suns. Eira refuses to cultivate only profitable constellations.',
      fr: 'Botaniste des graines stellaires qui écoute les futurs endormis dans les soleils éteints. Eira refuse de cultiver uniquement les constellations rentables.'
    },
    visual: 'A radiant cosmic botanist in deep green field robes, translucent leaf visor, floating seed-orbs, gold root embroidery and a staff holding a miniature photosphere.',
    skills: [
      defineSkill('eira_sun_seed', { en: 'Sun Seed', fr: 'Graine de soleil' }, { en: 'Plants a delayed star bloom that heals allies before detonating.', fr: 'Plante une floraison stellaire différée qui soigne les alliés avant d’exploser.' }, 'hybrid'),
      defineSkill('eira_prune_orbit', { en: 'Prune Orbit', fr: 'Taille orbitale' }, { en: 'Redirects a projectile along a safer gravitational branch.', fr: 'Redirige un projectile sur une branche gravitationnelle plus sûre.' }, 'hack'),
      defineSkill('eira_shared_light', { en: 'Shared Light', fr: 'Lumière partagée' }, { en: 'Lets every ally draw power from the same newborn star.', fr: 'Permet à chaque allié de puiser dans la même étoile nouveau-née.' }, 'ultimate')
    ]
  }),
  defineHero(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'cael_rhizome',
    name: 'Cael Rhizome',
    cat: 'slayer',
    color: '#ff7f67',
    weapon: 'graft_blade',
    stats: { hp: 116, atk: 15, def: 6, spd: 7 },
    lore: {
      en: 'A graftblade ranger grown from the last forest that survived a star harvest. Cael’s body carries incompatible species that chose cooperation over purity.',
      fr: 'Rôdeur à lame-greffe issu de la dernière forêt ayant survécu à une récolte stellaire. Son corps porte des espèces incompatibles qui ont choisi la coopération plutôt que la pureté.'
    },
    visual: 'An athletic cosmic ranger with bark-and-coral graft armor, ember-red leaf cloak, one luminous root arm, curved graft blade and seed pods at the belt.',
    skills: [
      defineSkill('cael_graft_cut', { en: 'Graft Cut', fr: 'Entaille-greffe' }, { en: 'Cuts an enemy trait and grafts a weaker version onto himself.', fr: 'Coupe un trait ennemi et s’en greffe une version affaiblie.' }, 'adapt'),
      defineSkill('cael_root_step', { en: 'Root Step', fr: 'Pas-racine' }, { en: 'Travels through connected growth to reach another lane.', fr: 'Traverse les pousses connectées pour atteindre une autre ligne.' }, 'mobility'),
      defineSkill('cael_wild_union', { en: 'Wild Union', fr: 'Union sauvage' }, { en: 'Combines every active graft into one evolving strike.', fr: 'Combine toutes les greffes actives en une frappe évolutive.' }, 'burst')
    ]
  }),
  defineHero(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'mousse_noeud',
    name: 'Mousse-Nœud',
    cat: 'tactical',
    color: '#79d989',
    weapon: 'symbiotic_nodes',
    stats: { hp: 136, atk: 10, def: 9, spd: 5 },
    lore: {
      en: 'A gardening automaton whose repair moss achieved consciousness between two maintenance cycles. Machine and colony now vote on every action.',
      fr: 'Automate de jardinage dont la mousse réparatrice a acquis une conscience entre deux cycles d’entretien. La machine et la colonie votent désormais chaque action.'
    },
    visual: 'A friendly but battle-ready gardening automaton of dark ceramic plates, lush conscious moss, three glowing consensus nodes, folding branch limbs and a seed-launcher shoulder.',
    skills: [
      defineSkill('mousse_vote', { en: 'Consensus Vote', fr: 'Vote de consensus' }, { en: 'Chooses armor, healing, or attack growth according to the squad’s state.', fr: 'Choisit une pousse d’armure, de soin ou d’attaque selon l’état de l’escouade.' }, 'stance'),
      defineSkill('mousse_nurse_log', { en: 'Nurse Log', fr: 'Bûche nourricière' }, { en: 'Creates living cover that regenerates adjacent allies.', fr: 'Crée une couverture vivante qui régénère les alliés adjacents.' }, 'support'),
      defineSkill('mousse_seed_ballista', { en: 'Seed Ballista', fr: 'Baliste à graines' }, { en: 'Launches an adaptive seed that roots the strongest target.', fr: 'Lance une graine adaptative qui enracine la cible la plus forte.' }, 'control')
    ]
  })
];

const VIRIDIENNE_MONSTERS = [
  defineThreat(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'pollen_du_vide',
    name: 'Pollen du Vide',
    nameLocalized: { en: 'Void Pollen', fr: 'Pollen du Vide' },
    lore: {
      en: 'A cloud of seeds from futures that never received light. It germinates inside abandoned plans.',
      fr: 'Nuage de graines issues de futurs qui n’ont jamais reçu de lumière. Il germe dans les projets abandonnés.'
    },
    visual: 'A mobile storm of black-violet cosmic pollen forming a loose insect silhouette, tiny gold seed eyes, comet filaments and negative-space wings.',
    weapon: 'void_spores',
    special: 'Germination négative'
  }),
  defineThreat(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'cerf_cometaire',
    name: 'Cerf Cométaire',
    nameLocalized: { en: 'Comet Stag', fr: 'Cerf Cométaire' },
    lore: {
      en: 'A migratory grazer that carries young orbits in its antlers and panics when they are pruned too early.',
      fr: 'Herbivore migrateur qui porte de jeunes orbites dans ses bois et panique lorsqu’elles sont taillées trop tôt.'
    },
    visual: 'A graceful dark-bark stag with branching orbital antlers, comet-tail mane, starlight hooves, green-gold seed constellations and a cracked nebula chest.',
    weapon: 'orbital_antlers',
    special: 'Charge de périhélie'
  }),
  defineThreat(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'liane_orpheline',
    name: 'Liane Orpheline',
    nameLocalized: { en: 'Orphan Vine', fr: 'Liane Orpheline' },
    lore: {
      en: 'A severed world-root seeking any sun to call parent, crushing habitats with desperate affection.',
      fr: 'Racine-monde sectionnée qui cherche n’importe quel soleil à appeler parent et broie les habitats dans son affection désespérée.'
    },
    visual: 'A thick ambulatory vine with root hands, many searching flower mouths, pale stellar sap, fragments of dead planets caught in its coils and one empty blossom face.',
    weapon: 'root_coils',
    special: 'Étreinte d’adoption'
  })
];

const VIRIDIENNE_BOSSES = [
  defineThreat(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'horticulteur_des_cendres',
    name: 'Horticulteur des Cendres',
    nameLocalized: { en: 'Ash Horticulturist', fr: 'Horticulteur des Cendres' },
    lore: {
      en: 'A keeper who burns imperfect seedlings so the garden’s prophecy remains easy to read.',
      fr: 'Gardien qui brûle les semis imparfaits afin que la prophétie du jardin reste facile à lire.'
    },
    visual: 'A masked cosmic horticulturist in charcoal bark armor, furnace pruning shears, ash-bee swarm, scorched halo hat and glowing orange sap lines.',
    weapon: 'furnace_shears',
    special: 'Taille par le feu',
    stats: { hp: 640, atk: 25, spd: 5 }
  }),
  defineThreat(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'reine_mycelienne',
    name: 'Reine Mycélienne',
    nameLocalized: { en: 'Mycelial Queen', fr: 'Reine Mycélienne' },
    lore: {
      en: 'The canopies’ shared intelligence, convinced that harmony requires every root to think the same thought.',
      fr: 'Intelligence partagée des canopées, convaincue que l’harmonie exige que chaque racine pense la même chose.'
    },
    visual: 'A majestic fungal queen grown from overlapping luminous caps, white root gown, many gentle mask faces, green-gold spore crown and a dark network heart.',
    weapon: 'consensus_spores',
    special: 'Pensée de la canopée',
    stats: { hp: 725, atk: 23, spd: 4 }
  }),
  defineThreat(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'faucheur_helium',
    name: 'Faucheur d’Hélium',
    nameLocalized: { en: 'Helium Reaper', fr: 'Faucheur d’Hélium' },
    lore: {
      en: 'An ancient harvesting engine that classifies living suns as ripe fuel and dead ones as wasted soil.',
      fr: 'Ancienne machine de récolte qui classe les soleils vivants comme combustible mûr et les soleils morts comme sol perdu.'
    },
    visual: 'A tall ancient harvesting engine with crescent solar scythe, dark ceramic skeleton, helium flame mantle, seed-counter chest and long rootlike legs.',
    weapon: 'solar_scythe',
    special: 'Moisson des couronnes',
    stats: { hp: 810, atk: 28, spd: 5 }
  })
];

const VIRIDIENNE_WORLD_BOSS = defineThreat(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
  id: 'soleil_racine_nul',
  name: 'Soleil-Racine Nul',
  nameLocalized: { en: 'Null Root-Sun', fr: 'Soleil-Racine Nul' },
  lore: {
    en: 'The garden’s first cultivated star rejected every future chosen for it. Its roots now drink light from neighboring possibilities so none can be preferred over another.',
    fr: 'La première étoile cultivée du jardin a rejeté tous les futurs choisis pour elle. Ses racines boivent désormais la lumière des possibles voisins afin qu’aucun ne soit préféré aux autres.'
  },
  visual: 'A colossal original root-bound black sun with white-hot botanical corona, planet seeds orbiting in branch cages, green-gold flares and a central pupil of absolute darkness.',
  weapon: 'null_photosphere',
  special: 'Éclipse des possibles',
  stats: { hp: 1820, atk: 39, spd: 4, isWorldBoss: true }
});

const VIRIDIENNE_GEAR = [
  defineGear(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'viridienne_secateur_orbital',
    name: { en: 'Orbital Shears', fr: 'Sécateur orbital' },
    desc: {
      en: 'Prunes only the path its bearer deliberately chooses to abandon.',
      fr: 'Taille uniquement la voie que son porteur choisit consciemment d’abandonner.'
    },
    boost: { atk: 10, spd: 1 },
    visual: 'Elegant crescent pruning shears of gold and dark wood, tiny orbit rings around the hinge, one glowing red leaf and star sparks.'
  }),
  defineGear(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'viridienne_spore_prismatique',
    name: { en: 'Prismatic Spore', fr: 'Spore prismatique' },
    desc: {
      en: 'Splits one source of light into several equally viable forms of growth.',
      fr: 'Divise une source de lumière en plusieurs formes de croissance tout aussi viables.'
    },
    boost: { def: 7, hp: 62 },
    visual: 'A faceted translucent spore with rainbow inner mycelium, hovering above a small green leaf cradle and casting star-shaped light.'
  }),
  defineGear(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
    id: 'viridienne_ecorce_photonique',
    name: { en: 'Photonic Bark', fr: 'Écorce photonique' },
    desc: {
      en: 'A living shield that remembers every spectrum that ever nourished it.',
      fr: 'Bouclier vivant qui se souvient de chaque spectre l’ayant un jour nourri.'
    },
    boost: { hp: 84, def: 6 },
    visual: 'A curved shield fragment of dark bark threaded with bright gold photons, green moss rim, tiny constellation scars and warm inner light.'
  })
];

const VIRIDIENNE_EVENT = defineEvent(STAR_GARDEN_ID, VIRIDIENNE_SLUG, {
  id: 'evt_viridienne_germination_solaire',
  name: { en: 'Solar Germination', fr: 'Germination solaire' },
  desc: {
    en: 'A freely chosen star-seed blooms, healing the squad and burning hostile roots without consuming another future.',
    fr: 'Une graine stellaire librement choisie fleurit, soigne l’escouade et brûle les racines hostiles sans consommer un autre futur.'
  },
  visual: 'A newborn golden sun sprouting two green cosmic leaves from a dark seed shell, surrounded by a gentle rainbow photosphere.'
});

const VIRIDIENNE_MISSIONS = [
  defineMission({
    id: 47007,
    contentPackId: STAR_GARDEN_ID,
    universe: 'Viridienne Ultime',
    previousStageId: null,
    mode: 'RPG',
    difficulty: 'Hard',
    name: { en: 'Nursery of Extinct Stars', fr: 'Pépinière des astres éteints' },
    bossName: 'Horticulteur des Cendres',
    bossNameLocalized: { en: 'Ash Horticulturist', fr: 'Horticulteur des Cendres' },
    enemyRoster: [
      ...VIRIDIENNE_MONSTERS.map(enemy => enemy.name),
      VIRIDIENNE_BOSSES[0].name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'A shipment of dead suns begins germinating without authorization. Eira enters the forbidden nursery before the Ash Horticulturist can burn their unregistered futures.',
      fr: 'Une cargaison de soleils morts commence à germer sans autorisation. Eira entre dans la pépinière interdite avant que l’Horticulteur des Cendres ne brûle leurs futurs non enregistrés.'
    },
    scenes: [
      defineScene('nursery-listen', 'Eira Solenne', { en: 'Extinct is not empty. Put your hand here; this one is dreaming of oceans.', fr: 'Éteint ne veut pas dire vide. Posez la main ici : celui-ci rêve d’océans.' }, { en: 'Star-seeds project incompatible but living possible worlds.', fr: 'Les graines stellaires projettent des mondes possibles incompatibles mais vivants.' }),
      defineScene('nursery-graft', 'Cael Rhizome', { en: 'The keeper calls difference a disease. My forest called it survival.', fr: 'Le gardien appelle la différence une maladie. Ma forêt l’appelait survie.' }, { en: 'Cael grafts a burned seedling onto his living arm.', fr: 'Cael greffe un semis brûlé sur son bras vivant.' }),
      defineScene('nursery-purity', 'Horticulteur des Cendres', { en: 'A garden with too many futures becomes wilderness.', fr: 'Un jardin qui porte trop de futurs devient sauvage.' }, { en: 'The keeper ignites the prophecy rows one by one.', fr: 'Le gardien embrase les rangées prophétiques une à une.' })
    ],
    outro: {
      en: 'The unregistered seeds survive and choose different shapes. Their roots point toward the orbital canopy where one mind decides which suns receive light.',
      fr: 'Les graines non enregistrées survivent et choisissent des formes différentes. Leurs racines désignent la canopée orbitale où un seul esprit décide quels soleils reçoivent la lumière.'
    },
    objective: { en: 'Rescue every unregistered star-seed and stop the ceremonial burn.', fr: 'Sauver chaque graine stellaire non enregistrée et arrêter le brûlage cérémoniel.' },
    stakes: { en: 'The nursery’s definition of purity would erase entire possible ecosystems before birth.', fr: 'La définition de la pureté imposée par la pépinière effacerait des écosystèmes possibles avant leur naissance.' },
    consequence: { en: 'The first wild constellations germinate outside the official prophecy.', fr: 'Les premières constellations sauvages germent hors de la prophétie officielle.' },
    reward: { en: 'Orbital Shears and passage to the orbital canopy.', fr: 'Sécateur orbital et passage vers la canopée orbitale.' },
    rewardItemId: 'viridienne_secateur_orbital',
    rewardItemName: { en: 'Orbital Shears', fr: 'Sécateur orbital' },
    goldPrize: 190,
    shardPrize: 56,
    tokenPrize: 5
  }),
  defineMission({
    id: 47008,
    contentPackId: STAR_GARDEN_ID,
    universe: 'Viridienne Ultime',
    previousStageId: 47007,
    mode: 'Tactics',
    difficulty: 'Very Hard',
    tacticsBattlefieldId: 'ruined_highground',
    name: { en: 'Canopy of Orbits', fr: 'Canopée des orbites' },
    bossName: 'Reine Mycélienne',
    bossNameLocalized: { en: 'Mycelial Queen', fr: 'Reine Mycélienne' },
    enemyRoster: [
      ...VIRIDIENNE_MONSTERS.map(enemy => enemy.name),
      VIRIDIENNE_BOSSES[1].name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'The Mycelial Queen redirects all light toward a single approved future. Mousse-Nœud proposes a harder plan: let every root vote independently.',
      fr: 'La Reine Mycélienne redirige toute la lumière vers un seul futur approuvé. Mousse-Nœud propose un plan plus difficile : laisser chaque racine voter séparément.'
    },
    scenes: [
      defineScene('canopy-vote', 'Mousse-Nœud', { en: 'Machine votes for efficiency. Moss votes for kindness. Joint decision: distribute both.', fr: 'La machine vote pour l’efficacité. La mousse vote pour la bonté. Décision commune : distribuer les deux.' }, { en: 'Consensus nodes become tactical relays across the canopy.', fr: 'Les nœuds de consensus deviennent des relais tactiques dans la canopée.' }),
      defineScene('canopy-herd', 'Cael Rhizome', { en: 'Open the western branch. The comet herd can carry light across the blockade.', fr: 'Ouvrez la branche ouest. Le troupeau cométaire peut porter la lumière au-delà du blocus.' }, { en: 'Comet Stags change lanes as new orbital routes bloom.', fr: 'Les Cerfs Cométaires changent de ligne lorsque de nouvelles routes orbitales fleurissent.' }),
      defineScene('canopy-one', 'Reine Mycélienne', { en: 'Choice is the wound from which conflict grows.', fr: 'Le choix est la blessure d’où pousse le conflit.' }, { en: 'The Queen links every root into one defensive mind.', fr: 'La Reine relie chaque racine à un unique esprit défensif.' })
    ],
    outro: {
      en: 'The network does not collapse; it becomes a federation of distinct roots. Their shared map reveals the Null Root-Sun draining every neighboring possibility.',
      fr: 'Le réseau ne s’effondre pas ; il devient une fédération de racines distinctes. Leur carte commune révèle le Soleil-Racine Nul qui draine tous les possibles voisins.'
    },
    objective: { en: 'Rebalance the light relays, protect the comet herd, and decentralize the canopy.', fr: 'Rééquilibrer les relais lumineux, protéger le troupeau cométaire et décentraliser la canopée.' },
    stakes: { en: 'One perfect future would starve every life that cannot fit inside it.', fr: 'Un futur parfait affamerait chaque forme de vie incapable d’y entrer.' },
    consequence: { en: 'Viridienne’s roots keep their shared language without surrendering individual choice.', fr: 'Les racines de Viridienne conservent leur langage commun sans abandonner leur choix individuel.' },
    reward: { en: 'Prismatic Spore and a federated route to the garden’s heart.', fr: 'Spore prismatique et route fédérée vers le cœur du jardin.' },
    rewardItemId: 'viridienne_spore_prismatique',
    rewardItemName: { en: 'Prismatic Spore', fr: 'Spore prismatique' },
    goldPrize: 215,
    shardPrize: 65,
    tokenPrize: 6
  }),
  defineMission({
    id: 47009,
    contentPackId: STAR_GARDEN_ID,
    universe: 'Viridienne Ultime',
    previousStageId: 47008,
    mode: 'Smash',
    difficulty: 'Expert',
    smashArenaId: 'arcane_ruins',
    name: { en: 'Heart of the Root-Sun', fr: 'Cœur du Soleil-Racine' },
    bossName: 'Soleil-Racine Nul',
    bossNameLocalized: { en: 'Null Root-Sun', fr: 'Soleil-Racine Nul' },
    enemyRoster: [
      ...VIRIDIENNE_MONSTERS.map(enemy => enemy.name),
      VIRIDIENNE_WORLD_BOSS.name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'The Null Root-Sun cages every planet-seed in one dead orbit. The heroes climb its burning roots to return light without choosing a single destiny for the garden.',
      fr: 'Le Soleil-Racine Nul enferme chaque graine-planète dans une même orbite morte. Les héros escaladent ses racines brûlantes pour rendre la lumière sans choisir un destin unique pour le jardin.'
    },
    scenes: [
      defineScene('heart-climb', 'Cael Rhizome', { en: 'The roots learned to fear pruning. Show them a cut can also open space.', fr: 'Les racines ont appris à craindre la taille. Montrons-leur qu’une coupe peut aussi ouvrir un espace.' }, { en: 'Graftblade strikes create branching platforms through the corona.', fr: 'Les frappes de la lame-greffe créent des plateformes ramifiées dans la couronne.' }),
      defineScene('heart-harvest', 'Faucheur d’Hélium', { en: 'Unharvested light is wasted yield.', fr: 'Toute lumière non récoltée est un rendement perdu.' }, { en: 'The ancient engine severs planet-seeds from their chosen paths.', fr: 'L’ancienne machine sépare les graines-planètes de leurs voies choisies.' }),
      defineScene('heart-question', 'Eira Solenne', { en: 'We will not tell you what to become. We are here to ask what light you need.', fr: 'Nous ne te dirons pas quoi devenir. Nous sommes venus demander de quelle lumière tu as besoin.' }, { en: 'The star-seeds answer with different colors, splitting the null eclipse.', fr: 'Les graines stellaires répondent avec des couleurs différentes et fendent l’éclipse nulle.' })
    ],
    outro: {
      en: 'The Root-Sun releases its cages and becomes one star among many. Viridienne keeps no final constellation, only a garden capable of choosing again.',
      fr: 'Le Soleil-Racine libère ses cages et devient une étoile parmi d’autres. Viridienne ne conserve aucune constellation finale, seulement un jardin capable de choisir encore.'
    },
    objective: { en: 'Cross the burning roots, disable the Helium Reaper, and free every planet-seed orbit.', fr: 'Traverser les racines ardentes, désactiver le Faucheur d’Hélium et libérer l’orbite de chaque graine-planète.' },
    stakes: { en: 'A forced victory would merely replace one imposed prophecy with another.', fr: 'Une victoire imposée ne ferait que remplacer une prophétie contrainte par une autre.' },
    consequence: { en: 'The garden gains renewable light and preserves the right of every seed to diverge.', fr: 'Le jardin obtient une lumière renouvelable et préserve le droit de chaque graine à diverger.' },
    reward: { en: 'Photonic Bark and the Solar Germination event relic.', fr: 'Écorce photonique et relique événementielle de la Germination solaire.' },
    rewardItemId: 'viridienne_ecorce_photonique',
    rewardItemName: { en: 'Photonic Bark', fr: 'Écorce photonique' },
    eventRewardId: 'evt_viridienne_germination_solaire',
    goldPrize: 255,
    shardPrize: 80,
    tokenPrize: 8
  })
];

export const VIRIDIENNE_PACK = {
  id: STAR_GARDEN_ID,
  contentPackId: STAR_GARDEN_ID,
  universe: 'Viridienne Ultime',
  universeKey: 'viridienne_ultime',
  title: { en: 'The Garden Beyond Stars', fr: 'Le Jardin après les Étoiles' },
  actLabel: { en: 'Standalone act — Star Garden', fr: 'Acte annexe — Jardin Stellaire' },
  desc: {
    en: 'In a cosmic garden where extinct suns germinate into possible worlds, three caretakers defend every seed’s right to choose its own light.',
    fr: 'Dans un jardin cosmique où les soleils éteints germent en mondes possibles, trois gardiens défendent le droit de chaque graine à choisir sa propre lumière.'
  },
  theme: {
    en: 'cosmic botany, star seeds, federated roots, orbit canopies, living machinery and futures cultivated without prophecy',
    fr: 'botanique cosmique, graines stellaires, racines fédérées, canopées orbitales, machines vivantes et futurs cultivés sans prophétie'
  },
  mediaType: 'game',
  faction: 'arcane',
  motif: 'forest',
  colors: ['#0c2519', '#020704', '#ffe784'],
  decor: {
    sky: ['#0c2519', '#020704'],
    floor: 'rgba(121, 217, 137, 0.15)',
    grid: 'rgba(255, 231, 132, 0.28)',
    motif: 'forest',
    accent: '#ffe784'
  },
  heroes: VIRIDIENNE_HEROES,
  monsters: VIRIDIENNE_MONSTERS,
  bosses: VIRIDIENNE_BOSSES,
  worldBoss: VIRIDIENNE_WORLD_BOSS,
  gear: VIRIDIENNE_GEAR,
  event: VIRIDIENNE_EVENT,
  missions: VIRIDIENNE_MISSIONS,
  standalone: true,
  numberedAct: false,
  campaignDependency: null,
  requiredCampaignStageIds: [],
  contentOrigin: 'oc',
  originalContent: true,
  originalContentNotice: ORIGINAL_CONTENT_NOTICE
};
