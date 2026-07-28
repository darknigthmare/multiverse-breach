const ORIGINAL_CONTENT_NOTICE = {
  en: 'Entirely original content created for Multiverse Breach.',
  fr: 'Contenu entièrement original créé pour Multiverse Breach.'
};

function defineSkill(id, name, desc, role) {
  return { id, name, desc, role };
}

function defineHero(contentPackId, universeSlug, {
  id,
  name,
  cat,
  color,
  weapon,
  stats,
  lore,
  visual,
  skills
}) {
  return {
    id,
    name,
    cat,
    color,
    weapon,
    weaponType: weapon,
    stats,
    skills,
    lore,
    loreLocalized: lore,
    contentPackId,
    contentOrigin: 'oc',
    originalContent: true,
    originalContentNotice: ORIGINAL_CONTENT_NOTICE,
    spriteSource: `/sprites/generated/heroes/${universeSlug}/${id.replaceAll('_', '-')}.png`,
    spritePrompt: `Entirely original character for Multiverse Breach, no existing franchise reference. ${visual} Complete 4 by 4 pixel-art combat sprite sheet: idle, run, attack, hit reactions; consistent silhouette and equipment; isolated on flat chroma green background; no text, no logo, no frame.`
  };
}

function defineThreat(contentPackId, universeSlug, {
  id,
  name,
  nameLocalized,
  lore,
  visual,
  weapon,
  special,
  stats = {}
}) {
  return {
    id,
    name,
    nameLocalized,
    lore,
    loreLocalized: lore,
    weapon,
    special,
    ...stats,
    contentPackId,
    contentOrigin: 'oc',
    originalContent: true,
    originalContentNotice: ORIGINAL_CONTENT_NOTICE,
    spriteSource: `/sprites/generated/bosses/${universeSlug}/${id.replaceAll('_', '-')}.png`,
    spritePrompt: `Entirely original enemy for Multiverse Breach, no existing franchise reference. ${visual} Complete 4 by 4 pixel-art combat sprite sheet: idle, movement, signature attack, hit reactions; readable silhouette and anatomy; isolated on flat chroma green background; no text, no logo, no frame.`
  };
}

function defineGear(contentPackId, universeSlug, {
  id,
  name,
  desc,
  boost,
  visual
}) {
  return [
    id,
    name.en,
    name.fr,
    boost,
    {
      contentPackId,
      contentOrigin: 'oc',
      originalContent: true,
      originalContentNotice: ORIGINAL_CONTENT_NOTICE,
      desc,
      icon: `/sprites/generated/items/${universeSlug}/${id.replaceAll('_', '-')}.png`,
      iconPrompt: `Entirely original Multiverse Breach relic. ${visual} Single centered pixel-art inventory icon, crisp silhouette, controlled glow, transparent background, no text, no logo, no border.`,
      visualAnchor: visual,
      audit: 'original-oc'
    }
  ];
}

function defineEvent(contentPackId, universeSlug, {
  id,
  name,
  desc,
  visual
}) {
  return [
    id,
    name.en,
    name.fr,
    desc.en,
    desc.fr,
    {
      contentPackId,
      contentOrigin: 'oc',
      originalContent: true,
      originalContentNotice: ORIGINAL_CONTENT_NOTICE,
      icon: `/sprites/generated/items/${universeSlug}/${id.replaceAll('_', '-')}.png`,
      iconPrompt: `Entirely original Multiverse Breach event relic. ${visual} Single centered pixel-art event icon, strong readable silhouette, transparent background, no text, no logo, no border.`,
      summonIcon: `/sprites/generated/items/${universeSlug}/${universeSlug}-summon.png`,
      summonIconPrompt: `Entirely original Multiverse Breach allied assist inspired by this universe's visual language: ${visual} Single centered pixel-art summon icon, compact readable silhouette, transparent background, no text, no logo, no border.`,
      visualAnchor: visual,
      audit: 'original-oc'
    }
  ];
}

function defineScene(id, speaker, text, direction) {
  return { id, speaker, text, direction };
}

function defineMission({
  id,
  contentPackId,
  universe,
  previousStageId,
  mode,
  difficulty,
  tacticsBattlefieldId = null,
  smashArenaId = null,
  name,
  bossName,
  bossNameLocalized,
  enemyRoster,
  enemyRosterExclusive = true,
  intro,
  scenes,
  outro,
  objective,
  stakes,
  consequence,
  reward,
  rewardItemId,
  rewardItemName,
  eventRewardId = null,
  goldPrize,
  shardPrize,
  tokenPrize
}) {
  return {
    id,
    stageId: id,
    contentPackId,
    universe,
    ocDlc: true,
    dlcStage: true,
    contentOrigin: 'oc',
    originalContent: true,
    standalone: true,
    campaignDependency: null,
    previousStageId,
    mode,
    difficulty,
    tacticsBattlefieldId,
    smashArenaId,
    name,
    displayName: name,
    bossName,
    bossNameLocalized,
    enemyRoster,
    enemyRosterExclusive,
    intro,
    scenes,
    outro,
    storyBeat: { intro, scenes, outro },
    objective,
    stakes,
    consequence,
    reward,
    rewardItemId,
    rewardItemName,
    eventRewardId,
    goldPrize,
    shardPrize,
    tokenPrize
  };
}

const DROWNED_DAWN_ID = 'oc-dlc-drowned-dawn';
const BORROWED_HOURS_ID = 'oc-dlc-borrowed-hours';
const STAR_GARDEN_ID = 'oc-dlc-star-garden';

const THALASSA_SLUG = 'thalassa-mnemique';
const MERIDIEN_SLUG = 'meridien-creux';
const VIRIDIENNE_SLUG = 'viridienne-ultime';

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

export const OC_DLC_PACKS = [
  {
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
  },
  {
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
  },
  {
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
  }
];

function missionToStageMetadata(mission) {
  return {
    id: mission.id,
    stageId: mission.id,
    contentPackId: mission.contentPackId,
    ocDlc: true,
    dlcStage: true,
    contentOrigin: 'oc',
    standalone: true,
    campaignDependency: null,
    previousStageId: mission.previousStageId,
    mode: mission.mode,
    difficulty: mission.difficulty,
    tacticsBattlefieldId: mission.tacticsBattlefieldId,
    smashArenaId: mission.smashArenaId,
    name: mission.name.fr,
    displayName: mission.displayName,
    bossName: mission.bossName,
    bossNameLocalized: mission.bossNameLocalized,
    enemyRoster: mission.enemyRoster,
    enemyRosterExclusive: mission.enemyRosterExclusive,
    intro: mission.intro,
    scenes: mission.scenes,
    outro: mission.outro,
    storyBeat: mission.storyBeat,
    objective: mission.objective,
    stakes: mission.stakes,
    consequence: mission.consequence,
    reward: mission.reward,
    rewardItemId: mission.rewardItemId,
    rewardItemName: mission.rewardItemName,
    eventRewardId: mission.eventRewardId,
    goldPrize: mission.goldPrize,
    shardPrize: mission.shardPrize,
    tokenPrize: mission.tokenPrize
  };
}

export const OC_DLC_UNIVERSES = OC_DLC_PACKS.map(pack => {
  const [primaryMission, ...variantMissions] = pack.missions;
  const primaryStage = missionToStageMetadata(primaryMission);

  return {
    key: pack.universeKey,
    universe: pack.universe,
    mediaType: pack.mediaType,
    faction: pack.faction,
    contentPackId: pack.contentPackId,
    contentOrigin: 'oc',
    originalContent: true,
    originalContentNotice: ORIGINAL_CONTENT_NOTICE,
    ocDlc: true,
    standalone: true,
    numberedAct: false,
    campaignDependency: null,
    requiredCampaignStageIds: [],
    actLabel: pack.actLabel,
    packTitle: pack.title,
    title: pack.title,
    desc: pack.desc,
    theme: pack.theme.en,
    themeLocalized: pack.theme,
    motif: pack.motif,
    colors: pack.colors,
    decor: pack.decor,
    hero: pack.heroes[0],
    allies: pack.heroes.slice(1),
    monsters: pack.monsters,
    bosses: pack.bosses,
    worldBoss: pack.worldBoss,
    gear: pack.gear,
    event: pack.event,
    missions: pack.missions,
    stageId: primaryMission.id,
    stageName: primaryStage.name,
    mode: primaryStage.mode,
    difficulty: primaryStage.difficulty,
    bossName: primaryStage.bossName,
    displayName: primaryStage.displayName,
    previousStageId: null,
    tacticsBattlefieldId: primaryStage.tacticsBattlefieldId,
    smashArenaId: primaryStage.smashArenaId,
    enemyRoster: primaryStage.enemyRoster,
    enemyRosterExclusive: primaryStage.enemyRosterExclusive,
    storyBeat: primaryStage.storyBeat,
    intro: primaryStage.intro,
    scenes: primaryStage.scenes,
    outro: primaryStage.outro,
    objective: primaryStage.objective,
    stakes: primaryStage.stakes,
    consequence: primaryStage.consequence,
    reward: primaryStage.reward,
    rewardItemId: primaryStage.rewardItemId,
    rewardItemName: primaryStage.rewardItemName,
    eventRewardId: primaryStage.eventRewardId,
    goldPrize: primaryStage.goldPrize,
    shardPrize: primaryStage.shardPrize,
    tokenPrize: primaryStage.tokenPrize,
    stageVariants: variantMissions.map(missionToStageMetadata)
  };
});

export const OC_DLC_UNIVERSE_KEYS = OC_DLC_PACKS.map(pack => pack.universe);
export const UNIVERSE_KEYS = OC_DLC_UNIVERSE_KEYS;
export const OC_DLC_PACK_IDS = OC_DLC_PACKS.map(pack => pack.id);
export const OC_DLC_STAGE_IDS = OC_DLC_PACKS.flatMap(pack => pack.missions.map(mission => mission.id));

export function getOcDlcPack(packId) {
  return OC_DLC_PACKS.find(pack => pack.id === packId) || null;
}

export function getOcDlcPackByUniverse(universe) {
  return OC_DLC_PACKS.find(pack => (
    pack.universe === universe || pack.universeKey === universe
  )) || null;
}

export function getOcDlcMission(stageOrId) {
  const rawId = typeof stageOrId === 'object' && stageOrId !== null
    ? stageOrId.id ?? stageOrId.stageId
    : stageOrId;
  const stageId = Number(rawId);
  if (!Number.isFinite(stageId)) return null;

  for (const pack of OC_DLC_PACKS) {
    const mission = pack.missions.find(entry => entry.id === stageId);
    if (mission) return mission;
  }
  return null;
}

export function isOcDlcStage(stageOrId) {
  return getOcDlcMission(stageOrId) !== null;
}

function getCompletedStageIds(completionState) {
  const source = completionState?.completedStages
    ?? completionState?.stageIds
    ?? completionState
    ?? [];

  if (source instanceof Set) {
    return new Set([...source].map(entry => Number(entry?.id ?? entry?.stageId ?? entry)));
  }

  if (Array.isArray(source)) {
    return new Set(source.map(entry => Number(entry?.id ?? entry?.stageId ?? entry)));
  }

  if (typeof source === 'object') {
    return new Set(
      Object.entries(source)
        .filter(([, completed]) => Boolean(completed))
        .map(([stageId]) => Number(stageId))
    );
  }

  return new Set();
}

export function isOcDlcMissionUnlocked(stageOrId, completionState = []) {
  const mission = getOcDlcMission(stageOrId);
  if (!mission) return false;
  if (mission.previousStageId === null) return true;

  return getCompletedStageIds(completionState).has(mission.previousStageId);
}
