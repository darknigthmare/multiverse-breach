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

const DROWNED_DAWN_ID = 'oc-dlc-drowned-dawn';

const THALASSA_SLUG = 'thalassa-mnemique';

const THALASSA_HEROES = [
  defineHero(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'neris_vale',
    name: 'Neris Vale',
    cat: 'tactical',
    color: '#64e6dd',
    weapon: 'mnemonic_sonar',
    stats: { hp: 122, atk: 11, def: 8, spd: 6 },
    lore: {
      en: 'An abyssal cartographer who maps memories instead of coastlines. Neris carries the last honest chart of Thalassa and refuses to erase a name, even when remembering it makes the sea rise.',
      fr: 'Cartographe abyssale qui relève les souvenirs plutôt que les côtes. Neris porte la dernière carte honnête de Thalassa et refuse d’effacer un nom, même lorsque s’en souvenir fait monter la mer.'
    },
    visual: 'A lean abyssal cartographer in teal pressure cloth, transparent diving mantle, brass sonar halo, waterproof map ribbons and a compact mnemonic harpoon.',
    skills: [
      defineSkill('neris_echo_mark', { en: 'Echo Mark', fr: 'Balise d’écho' }, { en: 'Marks a target so every ally can read its next movement.', fr: 'Balise une cible afin que chaque allié puisse lire son prochain mouvement.' }, 'control'),
      defineSkill('neris_safe_current', { en: 'Safe Current', fr: 'Courant sûr' }, { en: 'Draws a temporary route that raises squad speed and evasion.', fr: 'Trace une route temporaire qui augmente la vitesse et l’esquive de l’escouade.' }, 'support'),
      defineSkill('neris_true_name', { en: 'True Name', fr: 'Nom véritable' }, { en: 'Restores an erased memory to break armor and illusions.', fr: 'Restaure un souvenir effacé pour briser armures et illusions.' }, 'burst')
    ]
  }),
  defineHero(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'oryn_pell',
    name: 'Oryn Pell',
    cat: 'marine',
    color: '#e8bd70',
    weapon: 'pressure_lance',
    stats: { hp: 148, atk: 12, def: 10, spd: 4 },
    lore: {
      en: 'A rescue diver sealed inside a hand-built pressure frame. Oryn survived the Ninth Trench collapse by sharing his oxygen with strangers whose names the Admiralty later deleted.',
      fr: 'Plongeur de sauvetage enfermé dans une armature de pression artisanale. Oryn a survécu à l’effondrement de la Neuvième Fosse en partageant son oxygène avec des inconnus dont l’Amirauté a ensuite supprimé les noms.'
    },
    visual: 'A broad rescue diver in a compact brass-and-ceramic pressure exosuit, round luminous visor, anchor boots, emergency air canisters and a hydraulic pressure lance.',
    skills: [
      defineSkill('oryn_bulkhead', { en: 'Living Bulkhead', fr: 'Cloison vivante' }, { en: 'Intercepts damage and converts pressure into armor.', fr: 'Intercepte les dégâts et convertit la pression en armure.' }, 'guard'),
      defineSkill('oryn_decompression', { en: 'Decompression Ram', fr: 'Bélier de décompression' }, { en: 'Releases a short shock wave that scatters nearby enemies.', fr: 'Libère une onde de choc courte qui disperse les ennemis proches.' }, 'control'),
      defineSkill('oryn_last_tank', { en: 'Last Air Tank', fr: 'Dernière bouteille' }, { en: 'Keeps a fallen ally active long enough to finish an action.', fr: 'Maintient un allié à terre actif le temps d’achever une action.' }, 'rescue')
    ]
  }),
  defineHero(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'sio_lume',
    name: 'Sio Lume',
    cat: 'hacker',
    color: '#a98cff',
    weapon: 'echo_splicer',
    stats: { hp: 104, atk: 13, def: 6, spd: 7 },
    lore: {
      en: 'A mnemonic acoustician who hears edits in recorded history as missing notes. Sio deserted the Salt Archive after learning that its sacred silence was manufactured.',
      fr: 'Acousticienne mnémique qui entend les retouches de l’histoire comme des notes manquantes. Sio a déserté les Archives de Sel après avoir découvert que leur silence sacré était fabriqué.'
    },
    visual: 'A nimble mnemonic acoustician in violet-black diving streetwear, shell-shaped headphones, glowing waveform tattoos, echo drones and a forked sonic splicer.',
    skills: [
      defineSkill('sio_feedback', { en: 'Archive Feedback', fr: 'Larsen d’archive' }, { en: 'Loops an enemy command until its formation collapses.', fr: 'Boucle un ordre ennemi jusqu’à l’effondrement de sa formation.' }, 'hack'),
      defineSkill('sio_counter_song', { en: 'Counter-Song', fr: 'Contre-chant' }, { en: 'Cancels fear and silence effects with a recovered melody.', fr: 'Annule la peur et le silence grâce à une mélodie retrouvée.' }, 'cleanse'),
      defineSkill('sio_whole_chorus', { en: 'Whole Chorus', fr: 'Chœur entier' }, { en: 'Combines every recorded ally voice into a piercing sonic beam.', fr: 'Fusionne toutes les voix alliées enregistrées en un rayon sonore perforant.' }, 'ultimate')
    ]
  })
];

const THALASSA_MONSTERS = [
  defineThreat(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'rature_de_corail',
    name: 'Rature de Corail',
    nameLocalized: { en: 'Coral Erasure', fr: 'Rature de Corail' },
    lore: {
      en: 'A reef grown around a censored memory. It scrapes names from armor before adding their colors to its branches.',
      fr: 'Un récif poussé autour d’un souvenir censuré. Il gratte les noms sur les armures avant d’ajouter leurs couleurs à ses branches.'
    },
    visual: 'A stalking quadruped made of white coral cancellation marks, ink-blue joints, wet glass spines and strips of erased map parchment.',
    weapon: 'coral_scrape',
    special: 'Mémoire abrasée'
  }),
  defineThreat(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'nageur_sans_nom',
    name: 'Nageur Sans-Nom',
    nameLocalized: { en: 'Nameless Swimmer', fr: 'Nageur Sans-Nom' },
    lore: {
      en: 'A drowned citizen whose identity was traded for passage. It follows any voice that sounds almost familiar.',
      fr: 'Citoyen noyé dont l’identité fut échangée contre un passage. Il suit toute voix qui lui semble presque familière.'
    },
    visual: 'A translucent humanoid swimmer wrapped in torn census ribbons, faceless pearl diving mask, elongated fin hands and a dim heartbeat lantern.',
    weapon: 'undertow_claws',
    special: 'Appel presque familier'
  }),
  defineThreat(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'archiviste_de_sel',
    name: 'Archiviste de Sel',
    nameLocalized: { en: 'Salt Archivist', fr: 'Archiviste de Sel' },
    lore: {
      en: 'A walking shelf of crystallized testimonies. Breaking one tablet releases a truth sharp enough to wound both sides.',
      fr: 'Rayonnage ambulant de témoignages cristallisés. Briser une tablette libère une vérité assez coupante pour blesser les deux camps.'
    },
    visual: 'A tall crustacean archivist with salt-tablet armor, many careful writing claws, wax-sealed air sacs and an ink-black lantern eye.',
    weapon: 'salt_tablets',
    special: 'Témoignage tranchant'
  })
];

const THALASSA_BOSSES = [
  defineThreat(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'amiral_palimpseste',
    name: 'Amiral Palimpseste',
    nameLocalized: { en: 'Admiral Palimpsest', fr: 'Amiral Palimpseste' },
    lore: {
      en: 'The officer who keeps Thalassa peaceful by rewriting every disaster as a voluntary departure.',
      fr: 'L’officier qui maintient la paix à Thalassa en réécrivant chaque catastrophe comme un départ volontaire.'
    },
    visual: 'An imposing ocean admiral in layered translucent uniforms, erased medals, pearl prosthetic jaw, folding map-saber and a cloak flowing like black ink underwater.',
    weapon: 'map_saber',
    special: 'Décret de disparition',
    stats: { hp: 610, atk: 23, spd: 5 }
  }),
  defineThreat(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'choeur_bathyal',
    name: 'Chœur Bathyal',
    nameLocalized: { en: 'Bathyal Choir', fr: 'Chœur Bathyal' },
    lore: {
      en: 'Nine diving bells joined by one borrowed breath. Their harmony locks doors and thoughts to the same rhythm.',
      fr: 'Neuf cloches de plongée unies par un souffle emprunté. Leur harmonie verrouille portes et pensées sur le même rythme.'
    },
    visual: 'A ring of nine small abyssal diving bells fused into a floating choir body, breathing tubes as limbs, turquoise sound rings and a central conductor eye.',
    weapon: 'pressure_chorus',
    special: 'Accord de neuf fosses',
    stats: { hp: 685, atk: 21, spd: 4 }
  }),
  defineThreat(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'gardien_neuvieme_fosse',
    name: 'Gardien de la Neuvième Fosse',
    nameLocalized: { en: 'Guardian of the Ninth Trench', fr: 'Gardien de la Neuvième Fosse' },
    lore: {
      en: 'A rescue engine ordered to protect a trench whose inhabitants were removed from every register. It now treats remembrance as trespassing.',
      fr: 'Machine de sauvetage chargée de protéger une fosse dont les habitants furent retirés de tous les registres. Elle considère désormais le souvenir comme une intrusion.'
    },
    visual: 'A massive crab-shaped rescue engine with ceramic pressure plates, broken lifebuoy halo, searchlight eyes, anchor pincers and warning pennants.',
    weapon: 'anchor_pincers',
    special: 'Quarantaine abyssale',
    stats: { hp: 760, atk: 25, spd: 3 }
  })
];

const THALASSA_WORLD_BOSS = defineThreat(DROWNED_DAWN_ID, THALASSA_SLUG, {
  id: 'leviathan_noms_engloutis',
  name: 'Léviathan des Noms Engloutis',
  nameLocalized: { en: 'Leviathan of Drowned Names', fr: 'Léviathan des Noms Engloutis' },
  lore: {
    en: 'A continent-sized memory organism fed by every identity Thalassa chose to forget. It does not seek revenge; it only wants every stolen name spoken at once.',
    fr: 'Organisme-mémoire grand comme un continent, nourri par chaque identité que Thalassa a choisi d’oublier. Il ne cherche pas vengeance : il veut seulement que tous les noms volés soient prononcés ensemble.'
  },
  visual: 'A colossal original abyssal leviathan with a whale-like glass skull, cathedral coral ribs, thousands of luminous name ribbons, deep teal fins and a sunrise trapped in its chest.',
  weapon: 'memory_tide',
  special: 'Marée de tous les noms',
  stats: { hp: 1680, atk: 36, spd: 4, isWorldBoss: true }
});

const THALASSA_GEAR = [
  defineGear(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'thalassa_compas_mnemique',
    name: { en: 'Mnemonic Compass', fr: 'Compas mnémique' },
    desc: {
      en: 'Points toward the memory the bearer is most afraid to lose.',
      fr: 'Pointe vers le souvenir que son porteur craint le plus de perdre.'
    },
    boost: { atk: 7, spd: 2 },
    visual: 'A brass diving compass whose needle is a tiny luminous handwriting stroke, teal enamel, pearl hinges and one suspended memory droplet.'
  }),
  defineGear(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'thalassa_cloche_de_pression',
    name: { en: 'Pressure Bell', fr: 'Cloche de pression' },
    desc: {
      en: 'Stores a safe breath and releases it when an ally crosses a lethal threshold.',
      fr: 'Conserve un souffle sûr et le libère lorsqu’un allié franchit un seuil mortel.'
    },
    boost: { def: 8, hp: 55 },
    visual: 'A palm-sized ceramic diving bell wrapped in copper pressure rings, glowing air bubble inside and a short rescue chain.'
  }),
  defineGear(DROWNED_DAWN_ID, THALASSA_SLUG, {
    id: 'thalassa_encre_des_vivants',
    name: { en: 'Ink of the Living', fr: 'Encre des vivants' },
    desc: {
      en: 'Makes restored names impossible to overwrite for the duration of a battle.',
      fr: 'Rend les noms restaurés impossibles à réécrire pendant toute la durée d’un combat.'
    },
    boost: { hp: 72, atk: 5 },
    visual: 'A faceted black-ink ampoule with a bright cyan fingerprint swirling inside, capped by white coral and tied with a map ribbon.'
  })
];

const THALASSA_EVENT = defineEvent(DROWNED_DAWN_ID, THALASSA_SLUG, {
  id: 'evt_thalassa_chant_des_noms',
  name: { en: 'Chant of Returned Names', fr: 'Chant des noms rendus' },
  desc: {
    en: 'The drowned speak their own names, cleansing silence effects and sending a memory tide through every hostile line.',
    fr: 'Les noyés prononcent leurs propres noms, dissipent les effets de silence et lancent une marée de mémoire à travers toutes les lignes ennemies.'
  },
  visual: 'A luminous conch containing many tiny multicolored voice ribbons, encircled by a calm teal wave and a coral sunrise.'
});

const THALASSA_MISSIONS = [
  defineMission({
    id: 47001,
    contentPackId: DROWNED_DAWN_ID,
    universe: 'Thalassa Mnémique',
    previousStageId: null,
    mode: 'RPG',
    difficulty: 'Hard',
    name: { en: 'Reef of Erased Charts', fr: 'Récif des cartes effacées' },
    bossName: 'Amiral Palimpseste',
    bossNameLocalized: { en: 'Admiral Palimpsest', fr: 'Amiral Palimpseste' },
    enemyRoster: [
      ...THALASSA_MONSTERS.map(enemy => enemy.name),
      THALASSA_BOSSES[0].name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'An impossible sunrise appears beneath Thalassa’s sea. Neris discovers that every ray illuminates a district removed from the official charts.',
      fr: 'Une aube impossible apparaît sous la mer de Thalassa. Neris découvre que chaque rayon éclaire un quartier retiré des cartes officielles.'
    },
    scenes: [
      defineScene('reef-chart', 'Neris Vale', { en: 'Do not follow the coast. Follow the handwriting they tried to wash away.', fr: 'Ne suivez pas la côte. Suivez l’écriture qu’ils ont tenté de laver.' }, { en: 'The party crosses a reef shaped like crossed-out streets.', fr: 'Le groupe traverse un récif formé de rues raturées.' }),
      defineScene('reef-rescue', 'Oryn Pell', { en: 'These air tanks still bear fingerprints. The missing people were here.', fr: 'Ces bouteilles portent encore des empreintes. Les disparus étaient bien ici.' }, { en: 'Nameless Swimmers gather around the recovered equipment.', fr: 'Des Nageurs Sans-Nom se rassemblent autour du matériel retrouvé.' }),
      defineScene('reef-decree', 'Amiral Palimpseste', { en: 'A peaceful city has no missing citizens, only corrected records.', fr: 'Une cité paisible n’a pas de citoyens disparus, seulement des registres corrigés.' }, { en: 'The Admiral unfolds a map-saber and erases the path home.', fr: 'L’Amiral déploie un sabre-cartographique et efface le chemin du retour.' })
    ],
    outro: {
      en: 'The false chart burns away. Beneath it lies a route to the mobile Salt Archive and a list beginning with the Ninth Trench.',
      fr: 'La fausse carte se consume. Dessous apparaît une route vers les Archives de Sel mobiles et une liste commençant par la Neuvième Fosse.'
    },
    objective: { en: 'Recover the erased district chart and defeat Admiral Palimpsest.', fr: 'Récupérer la carte du quartier effacé et vaincre l’Amiral Palimpseste.' },
    stakes: { en: 'If the reef is redacted again, thousands of identities will become permanent fuel for the deep.', fr: 'Si le récif est de nouveau censuré, des milliers d’identités deviendront le carburant permanent des profondeurs.' },
    consequence: { en: 'The first stolen names return to public memory, revealing the Archive’s route.', fr: 'Les premiers noms volés reviennent dans la mémoire publique et révèlent la route des Archives.' },
    reward: { en: 'Mnemonic Compass and access to the Bathyscaphe Library.', fr: 'Compas mnémique et accès à la Bibliothèque Bathyscaphe.' },
    rewardItemId: 'thalassa_compas_mnemique',
    rewardItemName: { en: 'Mnemonic Compass', fr: 'Compas mnémique' },
    goldPrize: 180,
    shardPrize: 52,
    tokenPrize: 5
  }),
  defineMission({
    id: 47002,
    contentPackId: DROWNED_DAWN_ID,
    universe: 'Thalassa Mnémique',
    previousStageId: 47001,
    mode: 'Tactics',
    difficulty: 'Very Hard',
    tacticsBattlefieldId: 'facility_lockdown',
    name: { en: 'Bathyscaphe Library', fr: 'Bibliothèque Bathyscaphe' },
    bossName: 'Chœur Bathyal',
    bossNameLocalized: { en: 'Bathyal Choir', fr: 'Chœur Bathyal' },
    enemyRoster: [
      ...THALASSA_MONSTERS.map(enemy => enemy.name),
      THALASSA_BOSSES[1].name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'The Salt Archive surfaces for nine minutes. Sio must split its synchronized bells before the library dives with its prisoners.',
      fr: 'Les Archives de Sel remontent pendant neuf minutes. Sio doit séparer leurs cloches synchronisées avant que la bibliothèque ne replonge avec ses prisonniers.'
    },
    scenes: [
      defineScene('library-grid', 'Sio Lume', { en: 'Each bell censors the next. Break the chorus in the wrong order and the witnesses drown.', fr: 'Chaque cloche censure la suivante. Brisez le chœur dans le mauvais ordre et les témoins se noient.' }, { en: 'Nine pressure lanes pulse across the tactical deck.', fr: 'Neuf lignes de pression pulsent sur le pont tactique.' }),
      defineScene('library-bulkhead', 'Oryn Pell', { en: 'I can hold one bulkhead. Choose which truth reaches the surface first.', fr: 'Je peux retenir une cloison. Choisissez quelle vérité remontera en premier.' }, { en: 'Water advances one tile at a time while rescue beacons activate.', fr: 'L’eau avance case après case pendant l’activation des balises de sauvetage.' }),
      defineScene('library-song', 'Chœur Bathyal', { en: 'One breath. One record. One acceptable past.', fr: 'Un souffle. Un registre. Un passé acceptable.' }, { en: 'The bells fuse around the central archive engine.', fr: 'Les cloches fusionnent autour du moteur central des Archives.' })
    ],
    outro: {
      en: 'Freed testimonies form a counter-song. Its final note awakens something vast beneath the Ninth Trench.',
      fr: 'Les témoignages libérés forment un contre-chant. Sa dernière note réveille une présence immense sous la Neuvième Fosse.'
    },
    objective: { en: 'Disable the nine censorship bells in sequence and evacuate every witness.', fr: 'Désactiver les neuf cloches de censure dans l’ordre et évacuer tous les témoins.' },
    stakes: { en: 'A single failed lane will let the Archive overwrite the rescued testimonies.', fr: 'Une seule ligne perdue permettra aux Archives de réécrire les témoignages sauvés.' },
    consequence: { en: 'Thalassa hears the victims without an official narrator for the first time.', fr: 'Thalassa entend pour la première fois les victimes sans narrateur officiel.' },
    reward: { en: 'Pressure Bell and the complete counter-song.', fr: 'Cloche de pression et contre-chant complet.' },
    rewardItemId: 'thalassa_cloche_de_pression',
    rewardItemName: { en: 'Pressure Bell', fr: 'Cloche de pression' },
    goldPrize: 205,
    shardPrize: 61,
    tokenPrize: 6
  }),
  defineMission({
    id: 47003,
    contentPackId: DROWNED_DAWN_ID,
    universe: 'Thalassa Mnémique',
    previousStageId: 47002,
    mode: 'Smash',
    difficulty: 'Expert',
    smashArenaId: 'vertical_tower',
    name: { en: 'Crest of the Drowned Dawn', fr: 'Crête de l’Aube Noyée' },
    bossName: 'Léviathan des Noms Engloutis',
    bossNameLocalized: { en: 'Leviathan of Drowned Names', fr: 'Léviathan des Noms Engloutis' },
    enemyRoster: [
      ...THALASSA_MONSTERS.map(enemy => enemy.name),
      THALASSA_WORLD_BOSS.name
    ],
    enemyRosterExclusive: true,
    intro: {
      en: 'The sea turns vertical as the Leviathan rises. The heroes must climb its living archive and speak the stolen names before sunrise reaches the surface.',
      fr: 'La mer devient verticale lorsque le Léviathan se dresse. Les héros doivent escalader son archive vivante et prononcer les noms volés avant que l’aube n’atteigne la surface.'
    },
    scenes: [
      defineScene('crest-ascent', 'Neris Vale', { en: 'These are not scales. Every plate is a door someone closed.', fr: 'Ce ne sont pas des écailles. Chaque plaque est une porte que quelqu’un a fermée.' }, { en: 'Platforms of glass bone rise through an inverted ocean.', fr: 'Des plateformes d’os de verre montent dans un océan renversé.' }),
      defineScene('crest-choice', 'Sio Lume', { en: 'It is not attacking us. It is trying to sing through a mouth too small for everyone.', fr: 'Il ne nous attaque pas. Il tente de chanter avec une bouche trop petite pour tous.' }, { en: 'The counter-song changes the battle rhythm and opens the heart route.', fr: 'Le contre-chant modifie le rythme du combat et ouvre la route du cœur.' }),
      defineScene('crest-promise', 'Oryn Pell', { en: 'Then we make room. No name stays below alone.', fr: 'Alors nous ferons de la place. Aucun nom ne restera seul au fond.' }, { en: 'The rescue frame anchors the final platform against the memory tide.', fr: 'L’armature de sauvetage ancre la dernière plateforme contre la marée de mémoire.' })
    ],
    outro: {
      en: 'The Leviathan opens instead of dying. Returned names rise as an aurora, and Thalassa keeps its first dawn that belongs to everyone.',
      fr: 'Le Léviathan s’ouvre au lieu de mourir. Les noms rendus montent comme une aurore, et Thalassa conserve sa première aube qui appartient à tous.'
    },
    objective: { en: 'Ascend the Leviathan, survive the memory tide, and complete the Chant of Returned Names.', fr: 'Escalader le Léviathan, survivre à la marée de mémoire et achever le Chant des noms rendus.' },
    stakes: { en: 'Destroying the creature would erase the victims; failing to open it would drown the living city.', fr: 'Détruire la créature effacerait les victimes ; ne pas l’ouvrir noierait la cité vivante.' },
    consequence: { en: 'Thalassa adopts a public memory no authority can own or delete.', fr: 'Thalassa adopte une mémoire publique qu’aucune autorité ne peut posséder ni supprimer.' },
    reward: { en: 'Ink of the Living and the Chant of Returned Names event relic.', fr: 'Encre des vivants et relique événementielle du Chant des noms rendus.' },
    rewardItemId: 'thalassa_encre_des_vivants',
    rewardItemName: { en: 'Ink of the Living', fr: 'Encre des vivants' },
    eventRewardId: 'evt_thalassa_chant_des_noms',
    goldPrize: 245,
    shardPrize: 74,
    tokenPrize: 8
  })
];

export const THALASSA_PACK = {
  id: DROWNED_DAWN_ID,
  contentPackId: DROWNED_DAWN_ID,
  universe: 'Thalassa Mnémique',
  universeKey: 'thalassa_mnemique',
  title: { en: 'Wardens of the Drowned Dawn', fr: 'Les Veilleurs de l’Aube Noyée' },
  actLabel: { en: 'Standalone act — Drowned Dawn', fr: 'Acte annexe — Aube Noyée' },
  desc: {
    en: 'On an ocean world where public history controls the tides, three dissidents restore the names used to feed a living abyss.',
    fr: 'Sur un monde océanique où l’histoire publique commande les marées, trois dissidents restaurent les noms utilisés pour nourrir un abîme vivant.'
  },
  theme: {
    en: 'abyssal memory cartography, civic erasure, pressure technology, recovered testimony and a sunrise beneath the sea',
    fr: 'cartographie mnémique abyssale, effacement civique, technologie de pression, témoignages retrouvés et aube sous la mer'
  },
  mediaType: 'game',
  faction: 'sciFi',
  motif: 'facility',
  colors: ['#061d2b', '#01070d', '#64e6dd'],
  decor: {
    sky: ['#061d2b', '#01070d'],
    floor: 'rgba(100, 230, 221, 0.15)',
    grid: 'rgba(232, 189, 112, 0.28)',
    motif: 'facility',
    accent: '#64e6dd'
  },
  heroes: THALASSA_HEROES,
  monsters: THALASSA_MONSTERS,
  bosses: THALASSA_BOSSES,
  worldBoss: THALASSA_WORLD_BOSS,
  gear: THALASSA_GEAR,
  event: THALASSA_EVENT,
  missions: THALASSA_MISSIONS,
  standalone: true,
  numberedAct: false,
  campaignDependency: null,
  requiredCampaignStageIds: [],
  contentOrigin: 'oc',
  originalContent: true,
  originalContentNotice: ORIGINAL_CONTENT_NOTICE
};
