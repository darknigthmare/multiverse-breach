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

const BORROWED_HOURS_ID = 'oc-dlc-borrowed-hours';

const MERIDIEN_SLUG = 'meridien-creux';

const MERIDIEN_HEROES = [
  defineHero(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'kael_venn',
    name: 'Kael Venn',
    cat: 'slayer',
    color: '#ffb347',
    weapon: 'minute_blades',
    stats: { hp: 110, atk: 15, def: 5, spd: 8 },
    lore: {
      en: 'A minute smuggler who steals tiny intervals from predatory contracts and gives them to exhausted districts. Kael never carries tomorrow, only enough now to escape.',
      fr: 'Contrebandier de minutes qui vole de minuscules intervalles aux contrats prédateurs pour les offrir aux quartiers épuisés. Kael ne transporte jamais demain, seulement assez de présent pour s’échapper.'
    },
    visual: 'A swift time smuggler in amber-black courier layers, asymmetrical clockwork goggles, coat lined with glowing stolen seconds and twin crescent minute blades.',
    skills: [
      defineSkill('kael_spare_second', { en: 'Spare Second', fr: 'Seconde de rechange' }, { en: 'Inserts a stolen instant before an enemy action.', fr: 'Insère un instant volé avant une action ennemie.' }, 'interrupt'),
      defineSkill('kael_shortcut', { en: 'Unauthorized Shortcut', fr: 'Raccourci non autorisé' }, { en: 'Cuts across the initiative order to strike an exposed target.', fr: 'Traverse l’ordre d’initiative pour frapper une cible exposée.' }, 'mobility'),
      defineSkill('kael_refund', { en: 'Full Refund', fr: 'Remboursement total' }, { en: 'Returns accumulated delay as a chain of rapid attacks.', fr: 'Restitue le retard accumulé sous forme d’une chaîne d’attaques rapides.' }, 'ultimate')
    ]
  }),
  defineHero(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'ysolde_quarz',
    name: 'Ysolde Quarz',
    cat: 'hacker',
    color: '#67f0ff',
    weapon: 'chronal_suture',
    stats: { hp: 102, atk: 13, def: 6, spd: 7 },
    lore: {
      en: 'A clock surgeon who repairs timelines at street level. Ysolde was licensed to extend the wealthy until she discovered their extra years were harvested from neonatal wards.',
      fr: 'Chirurgienne des horloges qui répare les chronologies à hauteur de rue. Ysolde était autorisée à prolonger les riches avant de découvrir que leurs années supplémentaires étaient prélevées dans les maternités.'
    },
    visual: 'A precise clock surgeon in cyan-white medical tailoring, floating lens monocle, threadlike chronal sutures, glass metronome backpack and a needle-shaped pulse tool.',
    skills: [
      defineSkill('ysolde_stitch', { en: 'Moment Suture', fr: 'Suture d’instant' }, { en: 'Repairs an ally’s last damaged state without moving the whole timeline.', fr: 'Répare le dernier état blessé d’un allié sans déplacer toute la chronologie.' }, 'heal'),
      defineSkill('ysolde_local_pause', { en: 'Local Pause', fr: 'Pause locale' }, { en: 'Freezes one mechanism while every living target continues moving.', fr: 'Fige un mécanisme tandis que toutes les cibles vivantes continuent d’agir.' }, 'hack'),
      defineSkill('ysolde_clean_cut', { en: 'Clean Cut', fr: 'Coupe nette' }, { en: 'Severs a hostile effect from its original timestamp.', fr: 'Sépare un effet hostile de son horodatage d’origine.' }, 'cleanse')
    ]
  }),
  defineHero(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'bramm_treize',
    name: 'Bramm Treize',
    cat: 'marine',
    color: '#d6c6a4',
    weapon: 'arrears_shield',
    stats: { hp: 152, atk: 11, def: 11, spd: 3 },
    lore: {
      en: 'A former hour-debt collector who once aged entire homes by decree. Bramm defected when his own daughter received an invoice for time she had not lived.',
      fr: 'Ancien percepteur de dettes horaires qui vieillissait autrefois des immeubles entiers par décret. Bramm a déserté lorsque sa fille a reçu une facture pour du temps qu’elle n’avait pas vécu.'
    },
    visual: 'A heavy former time collector in worn ivory enforcement armor, broken ledger seals, rectangular arrears shield, clock-chain gauntlet and a deliberately uncovered face.',
    skills: [
      defineSkill('bramm_moratorium', { en: 'Moratorium', fr: 'Moratoire' }, { en: 'Suspends incoming damage as a debt Bramm can later cancel.', fr: 'Suspend les dégâts entrants comme une dette que Bramm pourra ensuite annuler.' }, 'guard'),
      defineSkill('bramm_seize_chain', { en: 'Seizure Chain', fr: 'Chaîne de saisie' }, { en: 'Pulls an elite away from vulnerable allies.', fr: 'Éloigne une élite des alliés vulnérables.' }, 'control'),
      defineSkill('bramm_void_invoice', { en: 'Void Invoice', fr: 'Facture annulée' }, { en: 'Destroys every temporal tax affecting the squad.', fr: 'Détruit toutes les taxes temporelles qui affectent l’escouade.' }, 'support')
    ]
  })
];

const MERIDIEN_MONSTERS = [
  defineThreat(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'huissier_instant',
    name: 'Huissier d’Instant',
    nameLocalized: { en: 'Instant Bailiff', fr: 'Huissier d’Instant' },
    lore: {
      en: 'A faceless enforcement clerk that confiscates the pause between a warning and its punishment.',
      fr: 'Agent d’exécution sans visage qui confisque la pause entre un avertissement et sa sanction.'
    },
    visual: 'A faceless clockwork bailiff in narrow black coat, stamped ivory mask, receipt-scroll limbs, red wax knuckles and a swinging foreclosure pendulum.',
    weapon: 'foreclosure_pendulum',
    special: 'Saisie immédiate'
  }),
  defineThreat(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'mite_horlogere',
    name: 'Mite Horlogère',
    nameLocalized: { en: 'Clock Mite', fr: 'Mite Horlogère' },
    lore: {
      en: 'A brass parasite that eats maintenance time until bridges and bodies age all at once.',
      fr: 'Parasite de laiton qui dévore le temps d’entretien jusqu’à ce que ponts et corps vieillissent d’un seul coup.'
    },
    visual: 'A dog-sized brass mite with clock-face abdomen, eight needle legs, gear mandibles, cyan oil sacs and a trail of rapidly rusting dust.',
    weapon: 'rust_bite',
    special: 'Vieillissement différé'
  }),
  defineThreat(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'voleur_vieillesse',
    name: 'Voleur de Vieillesse',
    nameLocalized: { en: 'Age Thief', fr: 'Voleur de Vieillesse' },
    lore: {
      en: 'A market phantom that sells youthful faces while the stolen years scream from jars under its coat.',
      fr: 'Fantôme de marché qui vend des visages jeunes tandis que les années volées hurlent dans des bocaux sous son manteau.'
    },
    visual: 'A slender market phantom wearing layered borrowed faces, bottle-lined coat, silver hourglass fingers and violet age vapor trailing from its feet.',
    weapon: 'age_vials',
    special: 'Échange d’années'
  })
];

const MERIDIEN_BOSSES = [
  defineThreat(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'prevot_midi_vide',
    name: 'Prévôt du Midi Vide',
    nameLocalized: { en: 'Provost of Hollow Noon', fr: 'Prévôt du Midi Vide' },
    lore: {
      en: 'The market magistrate who removed noon from poor districts, then charged residents for the missing hour.',
      fr: 'Magistrat du marché qui a retiré midi aux quartiers pauvres avant de facturer aux habitants l’heure manquante.'
    },
    visual: 'A towering market magistrate in split amber robes, empty sundial halo, long gavel-spear, tax seals and a chest cavity showing a sunless noon.',
    weapon: 'gavel_spear',
    special: 'Décret du midi absent',
    stats: { hp: 625, atk: 24, spd: 6 }
  }),
  defineThreat(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'comptable_derniers_souffles',
    name: 'Comptable des Derniers Souffles',
    nameLocalized: { en: 'Accountant of Last Breaths', fr: 'Comptable des Derniers Souffles' },
    lore: {
      en: 'A palace auditor that balances every extended life with a stranger’s premature final breath.',
      fr: 'Auditeur du palais qui équilibre chaque vie prolongée avec le dernier souffle prématuré d’un inconnu.'
    },
    visual: 'A severe clockwork accountant with abacus ribs, breath jars orbiting its shoulders, ledger blade, ink-stained ivory hands and a narrow cyan flame head.',
    weapon: 'ledger_blade',
    special: 'Bilan des respirations',
    stats: { hp: 700, atk: 22, spd: 5 }
  }),
  defineThreat(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'veuve_du_fuseau',
    name: 'Veuve du Fuseau',
    nameLocalized: { en: 'Spindle Widow', fr: 'Veuve du Fuseau' },
    lore: {
      en: 'The first engineer of Meridian’s time mint, kept alive inside the machine as its compulsory witness.',
      fr: 'Première ingénieure de la fabrique temporelle du Méridien, maintenue en vie dans la machine comme témoin obligatoire.'
    },
    visual: 'An elegant mechanical widow fused to a vertical time spindle, black veil made of clock chains, six loom arms and a halo of snapped timeline threads.',
    weapon: 'timeline_spindle',
    special: 'Trame des échéances',
    stats: { hp: 790, atk: 27, spd: 4 }
  })
];

const MERIDIEN_WORLD_BOSS = defineThreat(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
  id: 'horloge_devore_demain',
  name: 'Horloge qui Dévore Demain',
  nameLocalized: { en: 'Clock That Devours Tomorrow', fr: 'Horloge qui Dévore Demain' },
  lore: {
    en: 'The central mint became hungry after being ordered to guarantee infinite growth. It consumes futures before anyone can choose them.',
    fr: 'La fabrique centrale est devenue affamée après avoir reçu l’ordre de garantir une croissance infinie. Elle dévore les futurs avant que quiconque puisse les choisir.'
  },
  visual: 'A colossal original living clock tower with a circular jaw of hour marks, furnace heart, many district-sized hands, amber-black armor and streams of unborn cyan possibilities.',
  weapon: 'tomorrow_maw',
  special: 'Échéance de tout avenir',
  stats: { hp: 1750, atk: 38, spd: 5, isWorldBoss: true }
});

const MERIDIEN_GEAR = [
  defineGear(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'meridien_minute_contrebande',
    name: { en: 'Smuggled Minute', fr: 'Minute de contrebande' },
    desc: {
      en: 'A free interval that no ledger can detect or tax.',
      fr: 'Un intervalle libre qu’aucun registre ne peut détecter ni taxer.'
    },
    boost: { atk: 9, spd: 2 },
    visual: 'A tiny amber minute sealed in a cracked black pocket watch, illegal cyan thread, broken tax stamp and a bright moving hand.'
  }),
  defineGear(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'meridien_suture_chronale',
    name: { en: 'Chronal Suture', fr: 'Suture chronale' },
    desc: {
      en: 'Repairs a damaged instant without stealing replacement time.',
      fr: 'Répare un instant endommagé sans voler de temps de remplacement.'
    },
    boost: { def: 7, hp: 58 },
    visual: 'A curved silver surgical needle carrying luminous cyan time-thread, hovering above a small amber clock wound.'
  }),
  defineGear(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
    id: 'meridien_bouclier_arrieres',
    name: { en: 'Arrears Shield', fr: 'Bouclier d’arriérés' },
    desc: {
      en: 'Turns imposed delay into a reserve owned by its bearer.',
      fr: 'Transforme le retard imposé en réserve appartenant à son porteur.'
    },
    boost: { hp: 80, def: 6 },
    visual: 'A rectangular ivory shield plate made from cancelled invoices, amber edge lights, snapped clock chains and a bold wax seal split in half.'
  })
];

const MERIDIEN_EVENT = defineEvent(BORROWED_HOURS_ID, MERIDIEN_SLUG, {
  id: 'evt_meridien_greve_des_secondes',
  name: { en: 'Strike of the Seconds', fr: 'Grève des secondes' },
  desc: {
    en: 'Every unpaid second stops working at once, freezing hostile mechanisms while allies reclaim their initiative.',
    fr: 'Toutes les secondes non payées cessent de travailler à la fois, figent les mécanismes hostiles et rendent l’initiative aux alliés.'
  },
  visual: 'Three rebellious clock hands crossing like picket signs over a stopped amber dial, cyan sparks and torn invoice ribbons.'
});

const MERIDIEN_MISSIONS = [
  defineMission({
    id: 47004,
    contentPackId: BORROWED_HOURS_ID,
    universe: 'Méridien Creux',
    previousStageId: null,
    mode: 'RPG',
    difficulty: 'Hard',
    name: { en: 'Market of Seized Minutes', fr: 'Marché des minutes saisies' },
    bossName: 'Prévôt du Midi Vide',
    bossNameLocalized: { en: 'Provost of Hollow Noon', fr: 'Prévôt du Midi Vide' },
    enemyRoster: [
      ...MERIDIEN_MONSTERS.map(enemy => enemy.name),
      MERIDIEN_BOSSES[0].name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'A whole district wakes sixty years older after missing one payment. Kael returns to the market where those stolen years are being auctioned.',
      fr: 'Un quartier entier se réveille vieilli de soixante ans après un seul impayé. Kael retourne au marché où ces années volées sont mises aux enchères.'
    },
    scenes: [
      defineScene('market-bid', 'Kael Venn', { en: 'They sell life in lots small enough that nobody sees the funeral.', fr: 'Ils vendent la vie en lots assez petits pour que personne ne voie l’enterrement.' }, { en: 'Age Thieves carry sealed years between crowded stalls.', fr: 'Des Voleurs de Vieillesse transportent des années scellées entre les étals.' }),
      defineScene('market-witness', 'Bramm Treize', { en: 'That seal is mine. I signed the first seizure order.', fr: 'Ce sceau est le mien. J’ai signé le premier ordre de saisie.' }, { en: 'Bramm opens a route using an obsolete collector credential.', fr: 'Bramm ouvre une route grâce à un ancien titre de percepteur.' }),
      defineScene('market-noon', 'Prévôt du Midi Vide', { en: 'Time has value because someone is excluded from it.', fr: 'Le temps a de la valeur parce que quelqu’un en est exclu.' }, { en: 'The market loses its sky as the empty sundial descends.', fr: 'Le marché perd son ciel tandis que descend le cadran solaire vide.' })
    ],
    outro: {
      en: 'The auction vault opens and sixty stolen years return as choices, not forced age. Its ledger points to the Palace of Maturity.',
      fr: 'Le coffre des enchères s’ouvre et soixante années volées reviennent sous forme de choix, non de vieillissement imposé. Son registre désigne le Palais de l’Échéance.'
    },
    objective: { en: 'Free the seized intervals, protect the aged district, and defeat the Provost.', fr: 'Libérer les intervalles saisis, protéger le quartier vieilli et vaincre le Prévôt.' },
    stakes: { en: 'The auction will normalize mass aging as a routine municipal fee.', fr: 'La vente rendra le vieillissement collectif aussi banal qu’une taxe municipale.' },
    consequence: { en: 'Citizens regain ownership of their next hour and expose the palace ledger.', fr: 'Les citoyens récupèrent la propriété de leur prochaine heure et dévoilent le registre du palais.' },
    reward: { en: 'Smuggled Minute and access to the Palace of Maturity.', fr: 'Minute de contrebande et accès au Palais de l’Échéance.' },
    rewardItemId: 'meridien_minute_contrebande',
    rewardItemName: { en: 'Smuggled Minute', fr: 'Minute de contrebande' },
    goldPrize: 185,
    shardPrize: 54,
    tokenPrize: 5
  }),
  defineMission({
    id: 47005,
    contentPackId: BORROWED_HOURS_ID,
    universe: 'Méridien Creux',
    previousStageId: 47004,
    mode: 'Tactics',
    difficulty: 'Very Hard',
    tacticsBattlefieldId: 'nexus_escort_route',
    name: { en: 'Palace of Maturity', fr: 'Palais de l’Échéance' },
    bossName: 'Comptable des Derniers Souffles',
    bossNameLocalized: { en: 'Accountant of Last Breaths', fr: 'Comptable des Derniers Souffles' },
    enemyRoster: [
      ...MERIDIEN_MONSTERS.map(enemy => enemy.name),
      MERIDIEN_BOSSES[1].name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'The palace processes an entire lifetime every twelve seconds. Ysolde plans a local pause precise enough to free the breath jars without freezing their owners.',
      fr: 'Le palais traite une vie entière toutes les douze secondes. Ysolde prépare une pause locale assez précise pour libérer les bocaux de souffle sans figer leurs propriétaires.'
    },
    scenes: [
      defineScene('palace-triage', 'Ysolde Quarz', { en: 'Blue threads are patients. Amber threads are contracts. Cut only what was imposed.', fr: 'Les fils bleus sont des patients. Les fils ambrés sont des contrats. Coupez uniquement ce qui fut imposé.' }, { en: 'The battlefield divides into moving surgery lanes.', fr: 'Le champ de bataille se divise en lignes chirurgicales mobiles.' }),
      defineScene('palace-moratorium', 'Bramm Treize', { en: 'I will carry the penalties. You make sure nobody inherits them.', fr: 'Je porterai les pénalités. Faites en sorte que personne n’en hérite.' }, { en: 'The arrears shield holds back waves of accelerating debt.', fr: 'Le bouclier d’arriérés retient des vagues de dette accélérée.' }),
      defineScene('palace-balance', 'Comptable des Derniers Souffles', { en: 'Extension requires subtraction. The ledger is never cruel, only balanced.', fr: 'Toute prolongation exige une soustraction. Le registre n’est jamais cruel, seulement équilibré.' }, { en: 'Breath jars form an abacus around the auditor.', fr: 'Les bocaux de souffle forment un boulier autour de l’auditeur.' })
    ],
    outro: {
      en: 'The breath jars shatter without harming their owners. The released seconds stop obeying the mint and whisper the location of its hungry core.',
      fr: 'Les bocaux de souffle éclatent sans blesser leurs propriétaires. Les secondes libérées cessent d’obéir à la fabrique et murmurent l’emplacement de son cœur affamé.'
    },
    objective: { en: 'Separate patients from contracts, release every stored breath, and audit the Accountant.', fr: 'Séparer les patients des contrats, libérer chaque souffle stocké et solder le Comptable.' },
    stakes: { en: 'A wrong cut could save the contract while erasing the life attached to it.', fr: 'Une mauvaise coupe pourrait sauver le contrat tout en effaçant la vie qui lui est attachée.' },
    consequence: { en: 'The city learns that infinite extension was financed by invisible deaths.', fr: 'La cité apprend que les prolongations infinies étaient financées par des morts invisibles.' },
    reward: { en: 'Chronal Suture and the route to the mortgaged tomorrow dial.', fr: 'Suture chronale et route vers le cadran du demain hypothéqué.' },
    rewardItemId: 'meridien_suture_chronale',
    rewardItemName: { en: 'Chronal Suture', fr: 'Suture chronale' },
    goldPrize: 210,
    shardPrize: 63,
    tokenPrize: 6
  }),
  defineMission({
    id: 47006,
    contentPackId: BORROWED_HOURS_ID,
    universe: 'Méridien Creux',
    previousStageId: 47005,
    mode: 'Smash',
    difficulty: 'Expert',
    smashArenaId: 'vertical_tower',
    name: { en: 'Dial of Mortgaged Tomorrow', fr: 'Cadran du demain hypothéqué' },
    bossName: 'Horloge qui Dévore Demain',
    bossNameLocalized: { en: 'Clock That Devours Tomorrow', fr: 'Horloge qui Dévore Demain' },
    enemyRoster: [
      ...MERIDIEN_MONSTERS.map(enemy => enemy.name),
      MERIDIEN_WORLD_BOSS.name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'The central mint starts consuming futures faster than they can form. The team must climb its moving hands and give the unborn possibilities a chance to refuse.',
      fr: 'La fabrique centrale commence à dévorer les futurs plus vite qu’ils ne se forment. L’équipe doit escalader ses aiguilles mobiles et offrir aux possibles à naître une chance de refuser.'
    },
    scenes: [
      defineScene('dial-climb', 'Kael Venn', { en: 'Do not race the clock. Steal the finish line.', fr: 'Ne faites pas la course contre l’horloge. Volez la ligne d’arrivée.' }, { en: 'Kael cuts new platforms into the rotating minute hand.', fr: 'Kael découpe de nouvelles plateformes dans la grande aiguille en rotation.' }),
      defineScene('dial-engineer', 'Veuve du Fuseau', { en: 'I built a mint. They taught it hunger. End the order, not the witness.', fr: 'J’ai construit une fabrique. Ils lui ont appris la faim. Mettez fin à l’ordre, pas au témoin.' }, { en: 'The imprisoned engineer exposes the command spindle.', fr: 'L’ingénieure prisonnière révèle le fuseau de commande.' }),
      defineScene('dial-choice', 'Ysolde Quarz', { en: 'Tomorrow is not a resource. It is a patient who has not arrived yet.', fr: 'Demain n’est pas une ressource. C’est un patient qui n’est pas encore arrivé.' }, { en: 'Chronal sutures hold open the final route through the clock’s jaw.', fr: 'Des sutures chronales maintiennent ouverte la route finale à travers la mâchoire de l’horloge.' })
    ],
    outro: {
      en: 'The mint stops. Every resident receives the same untaxed second, and uses it differently. Meridian finally has a future that cannot be pre-sold.',
      fr: 'La fabrique s’arrête. Chaque habitant reçoit la même seconde non taxée et l’utilise différemment. Le Méridien possède enfin un futur qui ne peut être vendu d’avance.'
    },
    objective: { en: 'Scale the moving dial, release the Spindle Widow, and stop the Clock without erasing tomorrow.', fr: 'Escalader le cadran mobile, libérer la Veuve du Fuseau et arrêter l’Horloge sans effacer demain.' },
    stakes: { en: 'If the mint completes one final cycle, every possible future will become collateral.', fr: 'Si la fabrique achève un dernier cycle, chaque futur possible deviendra une garantie financière.' },
    consequence: { en: 'Time becomes a shared condition again instead of a privately owned currency.', fr: 'Le temps redevient une condition partagée plutôt qu’une monnaie privée.' },
    reward: { en: 'Arrears Shield and the Strike of the Seconds event relic.', fr: 'Bouclier d’arriérés et relique événementielle de la Grève des secondes.' },
    rewardItemId: 'meridien_bouclier_arrieres',
    rewardItemName: { en: 'Arrears Shield', fr: 'Bouclier d’arriérés' },
    eventRewardId: 'evt_meridien_greve_des_secondes',
    goldPrize: 250,
    shardPrize: 77,
    tokenPrize: 8
  })
];

export const MERIDIEN_PACK = {
  id: BORROWED_HOURS_ID,
  contentPackId: BORROWED_HOURS_ID,
  universe: 'Méridien Creux',
  universeKey: 'meridien_creux',
  title: { en: 'The Hours We Owe', fr: 'La Dette des Heures' },
  actLabel: { en: 'Standalone act — Borrowed Hours', fr: 'Acte annexe — Heures Empruntées' },
  desc: {
    en: 'In a city where time is minted, taxed and seized, three defectors dismantle an economy that consumes tomorrow before anyone can choose it.',
    fr: 'Dans une cité où le temps est frappé, taxé et saisi, trois transfuges démantèlent une économie qui consomme demain avant que quiconque puisse le choisir.'
  },
  theme: {
    en: 'time debt, illegal seconds, clock surgery, predatory ledgers, moving dials and collective ownership of tomorrow',
    fr: 'dette temporelle, secondes illégales, chirurgie horlogère, registres prédateurs, cadrans mobiles et propriété collective de demain'
  },
  mediaType: 'game',
  faction: 'cyber',
  motif: 'facility',
  colors: ['#241709', '#050301', '#ffb347'],
  decor: {
    sky: ['#241709', '#050301'],
    floor: 'rgba(255, 179, 71, 0.14)',
    grid: 'rgba(103, 240, 255, 0.27)',
    motif: 'facility',
    accent: '#ffb347'
  },
  heroes: MERIDIEN_HEROES,
  monsters: MERIDIEN_MONSTERS,
  bosses: MERIDIEN_BOSSES,
  worldBoss: MERIDIEN_WORLD_BOSS,
  gear: MERIDIEN_GEAR,
  event: MERIDIEN_EVENT,
  missions: MERIDIEN_MISSIONS,
  standalone: true,
  numberedAct: false,
  campaignDependency: null,
  requiredCampaignStageIds: [],
  contentOrigin: 'oc',
  originalContent: true,
  originalContentNotice: ORIGINAL_CONTENT_NOTICE
};
