import { LORE_DB } from './lore';
import { getUniverseSignature } from './loreDescriptions';

export const CHARACTER_PLAQUES = {
  player_anchor: {
    clearance: 'ARC-00',
    rank: { fr: 'Ancre vivante', en: 'Living Anchor' },
    role: { fr: 'Commandant joueur', en: 'Player commander' },
    callSign: 'Ancre',
    origin: { fr: 'Nexus de Convergence', en: 'Nexus of Convergence' },
    dossier: {
      fr: 'Le premier heros n est pas invoque par portail: c est le joueur lui-meme, une signature assez stable pour rester entiere quand plusieurs Trames se superposent. A.R.C.A. le classe comme Ancre vivante, capable de retenir une trace Nexus, commander les cellules et servir de cle aux futures Ancres partagees.',
      en: 'The first hero is not summoned through a portal: it is the player, a signature stable enough to remain whole when several Threads overlap. A.R.C.A. classifies this profile as a living Anchor, able to retain a Nexus trace, command cells, and serve as the key to future shared Anchors.'
    },
    doctrine: {
      fr: 'Commandement d Ancrage: stabilisation de l equipe, lecture des failles et resistance aux suppressions du Sans-Auteur.',
      en: 'Anchor Command: squad stabilization, breach reading, and resistance against Authorless deletion.'
    },
    tags: ['Nexus', 'Ancre', 'A.R.C.A.', 'Player']
  },
  marcus: {
    clearance: 'COG-01',
    rank: { fr: 'Sergent veteran', en: 'Veteran Sergeant' },
    role: { fr: 'Assaut lourd et couverture', en: 'Heavy assault and cover' },
    callSign: 'Fenix',
    origin: { fr: 'Sera - Coalition des Gouvernements Unis', en: 'Sera - Coalition of Ordered Governments' },
    dossier: {
      fr: 'Veteran de la guerre Locuste, Marcus tient la ligne quand une breche devient un front. Sa plaquette le classe comme pilier blindage, tir soutenu et avancee sous pression.',
      en: 'Locust War veteran, Marcus holds the line when a breach turns into a front. His plaque marks him for armor, suppressive fire, and pressure advances.'
    },
    doctrine: { fr: 'Lancer, couverture COG, frappe orbitale Hammer of Dawn.', en: 'Lancer, COG cover, Hammer of Dawn orbital strike.' },
    tags: ['COG', 'Lancer', 'Cover', 'Heavy']
  },
  masterchief: {
    clearance: 'UNSC-117',
    rank: { fr: 'Spartan-II', en: 'Spartan-II' },
    role: { fr: 'Dernier Spartan operationnel', en: 'Last operational Spartan' },
    callSign: 'Sierra 117',
    origin: { fr: 'Univers Halo - UNSC / Programme Spartan-II / Installation 04', en: 'Halo universe - UNSC / Spartan-II Program / Installation 04' },
    dossier: {
      fr: 'Dans sa Trame d origine, John-117 est un Spartan-II de l UNSC, enleve enfant, augmente, entraine et equipe d une armure MJOLNIR pour survivre a des guerres que des soldats ordinaires ne peuvent pas porter. Il devient le Master Chief pendant la guerre contre le Covenant, combat sur les anneaux Halo, affronte les forces Covenantes, les Sentinelles Forerunner et la menace du Parasite, tout en portant une relation tactique centrale avec Cortana. Son monde d origine n est pas celui d un heros bavard: c est une doctrine de survie militaire, de bouclier rechargeable, d armes UNSC, de technologie Covenant capturee et de secrets Forerunner.',
      en: 'In his origin Thread, John-117 is a UNSC Spartan-II, taken as a child, augmented, trained, and fitted with MJOLNIR armor to survive wars ordinary soldiers cannot carry. He becomes the Master Chief during the war against the Covenant, fights across Halo rings, faces Covenant forces, Forerunner Sentinels, and the Flood threat, while sharing a central tactical bond with Cortana. His origin world is not built around speeches: it is a doctrine of military survival, rechargeable shields, UNSC weapons, captured Covenant technology, and Forerunner secrets.'
    },
    breachLore: {
      fr: 'Quand la Breche du Multivers traverse l Installation 04, A.R.C.A. ne recupere pas une copie du Chief: elle accroche une signature de combat encore coherente, protegee par les protocoles MJOLNIR et par un fragment de matrice Cortana arrache au bruit blanc. Dans Multiverse Breach, John-117 traite chaque faille comme un anneau a securiser: identifier les zones Forerunner corrompues, couper les lignes Covenant recodees par le Sans-Auteur, empecher le Parasite de devenir une metaphore vivante de toutes les Trames infectees, puis extraire l escouade avant l effacement. Il reste Halo dans sa methode: silence radio utile, avancee sous feu, priorite aux civils et a l objectif, jamais a la gloire.',
      en: 'When the Multiverse Breach crosses Installation 04, A.R.C.A. does not recover a copy of the Chief: it hooks a still-coherent combat signature, protected by MJOLNIR protocols and by a Cortana matrix shard torn from white noise. In Multiverse Breach, John-117 treats every rift like a ring to secure: identify corrupted Forerunner zones, cut Covenant lines recoded by the Authorless, prevent the Flood from becoming a living metaphor for every infected Thread, then extract the squad before erasure. His method remains Halo: useful radio silence, advance under fire, priority to civilians and the objective, never to glory.'
    },
    doctrine: { fr: 'Fusil d assaut MA5, magnum M6D, grenade plasma, bouclier MJOLNIR, laser Spartan.', en: 'MA5 assault rifle, M6D magnum, plasma grenade, MJOLNIR shield, Spartan Laser.' },
    tags: ['UNSC', 'Spartan-II', 'MJOLNIR', 'Cortana', 'Forerunner', 'Covenant']
  },
  ripley: {
    clearance: 'WY-426',
    rank: { fr: 'Survivante certifiee', en: 'Certified Survivor' },
    role: { fr: 'Survie anti-Xenomorphe', en: 'Anti-Xenomorph survival' },
    callSign: 'Ripley',
    origin: { fr: 'LV-426 / Nostromo', en: 'LV-426 / Nostromo' },
    dossier: {
      fr: 'Ripley sait lire une infestation avant qu elle devienne une ruche. Sa plaquette priorise evacuation, feu controle et refus net des protocoles Weyland-Yutani.',
      en: 'Ripley reads an infestation before it becomes a hive. Her plaque prioritizes extraction, controlled fire, and hard refusal of Weyland-Yutani protocols.'
    },
    doctrine: { fr: 'Pulse rifle, lance-flammes, chargeur exosquelette.', en: 'Pulse rifle, flamethrower, power loader.' },
    tags: ['LV-426', 'Hive', 'Flame', 'Survivor']
  },
  predator: {
    clearance: 'YAU-01',
    rank: { fr: 'Chasseur Yautja', en: 'Yautja Hunter' },
    role: { fr: 'Traque et duel plasma', en: 'Hunt and plasma duel' },
    callSign: 'Yautja',
    origin: { fr: 'Clan de chasse interstellaire', en: 'Interstellar hunting clan' },
    dossier: {
      fr: 'Predateur discipline par le code de chasse. Le Nexus l indexe comme combattant de pression: camouflage, ciblage thermique et execution des menaces dominantes.',
      en: 'Predator bound by the hunt code. The Nexus indexes him as a pressure fighter: cloaking, thermal targeting, and execution of dominant threats.'
    },
    doctrine: { fr: 'Lames de poignet, plasma caster, disque intelligent.', en: 'Wristblades, plasma caster, smart disc.' },
    tags: ['Yautja', 'Cloak', 'Plasma', 'Hunter']
  },
  leon: {
    clearance: 'RPD-04',
    rank: { fr: 'Survivant R.P.D. / agent federal', en: 'R.P.D. survivor / federal agent' },
    role: { fr: 'Extraction biohazard', en: 'Biohazard extraction' },
    callSign: 'Kennedy',
    origin: { fr: 'Univers Resident Evil - Raccoon City / R.P.D. / Umbrella', en: 'Resident Evil universe - Raccoon City / R.P.D. / Umbrella' },
    dossier: {
      fr: 'Dans sa Trame d origine, Leon S. Kennedy arrive a Raccoon City pour son premier jour au R.P.D. au moment ou l epidemie T-Virus transforme la ville en zone de quarantaine. Il survit au commissariat, aux zombies, aux Lickers, aux manipulations d Umbrella, aux Tyrants et aux armes biologiques qui reduisent les civils a des specimens. Plus tard, il devient agent federal specialise dans les crises bio-organic weapons, mais son noyau reste Raccoon City: munitions comptees, portes verrouillees, rubans encreurs, herbes de soin, decisions rapides et refus de laisser les survivants devenir des dossiers Umbrella.',
      en: 'In his origin Thread, Leon S. Kennedy reaches Raccoon City for his first day at the R.P.D. exactly as the T-Virus outbreak turns the city into a quarantine zone. He survives the police station, zombies, Lickers, Umbrella manipulation, Tyrants, and bio-organic weapons that reduce civilians to specimens. Later he becomes a federal agent specialized in B.O.W. crises, but his core remains Raccoon City: counted ammunition, locked doors, ink ribbons, healing herbs, quick decisions, and refusal to let survivors become Umbrella files.'
    },
    breachLore: {
      fr: 'Quand la Breche du Multivers recouvre Raccoon City, A.R.C.A. detecte que Leon ne stabilise pas la Trame par puissance brute: il la stabilise en gardant une route de sortie humaine. Dans Multiverse Breach, son objectif n est jamais seulement de tuer des infectes; il doit identifier quelle souche a ete recodee par le Sans-Auteur, sauver les signatures civiles encore lisibles, empecher Umbrella de classer la Breche comme un nouveau laboratoire, puis fermer les portes une par une avant qu un Tyrant de Trame ne transforme le Nexus en commissariat sans issue. Son lore Breach reste Resident Evil: tension, ressources rares, horreur biologique et extraction sous pression.',
      en: 'When the Multiverse Breach overlays Raccoon City, A.R.C.A. detects that Leon does not stabilize the Thread through brute force: he stabilizes it by keeping a human exit route open. In Multiverse Breach, his objective is never only killing infected; he must identify which strain was recoded by the Authorless, save still-readable civilian signatures, prevent Umbrella from classifying the Breach as a new laboratory, then close each door before a Thread Tyrant turns the Nexus into a police station with no exit. His Breach lore remains Resident Evil: tension, scarce resources, biological horror, and extraction under pressure.'
    },
    doctrine: { fr: 'Matilda, couteau de survie, fusil tactique, herbes de soin, roquette anti-BOW.', en: 'Matilda, survival knife, tactical shotgun, healing herbs, anti-B.O.W. rocket.' },
    tags: ['RPD', 'Umbrella', 'T-Virus', 'BOW', 'Survivor', 'Extraction']
  },
  pyramidhead: {
    clearance: 'SH-RED',
    rank: { fr: 'Executioner', en: 'Executioner' },
    role: { fr: 'Punition et zone de peur', en: 'Punishment and fear zone' },
    callSign: 'Red Pyramid',
    origin: { fr: 'Univers Silent Hill - cauchemar personnel / Otherworld rouille', en: 'Silent Hill universe - personal nightmare / rust Otherworld' },
    dossier: {
      fr: 'Dans sa Trame d origine, Pyramid Head n est pas un soldat ni un monstre ordinaire: c est une manifestation de jugement, de culpabilite et de punition liee aux lois psychologiques de Silent Hill, particulierement a la descente de James Sunderland. Sa grande lame, son casque rouge et sa marche lente ne servent pas seulement a tuer; ils rendent visible une sentence interieure. Son monde d origine fonctionne par brouillard, sirenes, Otherworld rouille, symboles personnels et horreur qui accuse celui qui la traverse.',
      en: 'In his origin Thread, Pyramid Head is not a soldier or ordinary monster: he is a manifestation of judgment, guilt, and punishment tied to Silent Hill psychological laws, especially James Sunderland descent. His great knife, red helmet, and slow march do not only kill; they make an inner sentence visible. His origin world runs on fog, sirens, rust Otherworld, personal symbols, and horror that accuses whoever crosses it.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, A.R.C.A. ne classe pas Pyramid Head comme heros fiable, mais comme ancre dangereuse de la loi Silent Hill. Quand une faille tente de transformer la culpabilite des autres univers en arme generique, sa presence force le cauchemar a rester personnel: pas de punition gratuite, pas de monstre sans raison. Le Sans-Auteur veut utiliser Pyramid Head comme bourreau universel; A.R.C.A. l emploie au contraire comme limite rouge, pour couper les jugements faux et enfermer les peurs qui cherchent a sortir de leur Trame.',
      en: 'In Multiverse Breach, A.R.C.A. does not classify Pyramid Head as a reliable hero, but as a dangerous anchor of Silent Hill law. When a breach tries to turn guilt from other universes into generic weaponry, his presence forces the nightmare to remain personal: no free punishment, no monster without reason. The Authorless wants to use Pyramid Head as a universal executioner; A.R.C.A. uses him instead as a red boundary, cutting false judgments and sealing fears trying to leave their Thread.'
    },
    doctrine: { fr: 'Grande lame, brouillard, sirene Otherworld, zone de culpabilite, execution lente.', en: 'Great knife, fog, Otherworld siren, guilt zone, slow execution.' },
    tags: ['Silent Hill', 'Otherworld', 'Guilt', 'Judgment', 'Executioner']
  },
  james_s: {
    clearance: 'SH-JS2',
    rank: { fr: 'Survivant appele par la ville', en: 'Town-called survivor' },
    role: { fr: 'Survie psychologique et verite enfouie', en: 'Psychological survival and buried truth' },
    callSign: 'Sunderland',
    origin: { fr: 'Univers Silent Hill 2 - South Vale / Lakeview / culpabilite', en: 'Silent Hill 2 universe - South Vale / Lakeview / guilt' },
    dossier: {
      fr: 'Dans sa Trame d origine, James Sunderland vient a Silent Hill apres avoir recu une lettre de Mary, sa femme morte. La ville ne lui oppose pas seulement des monstres: elle reconstruit ses mensonges, son deuil, son desir d oubli et sa culpabilite sous forme de brouillard, d appartements vides, d hopital, de prison, d hotel Lakeview et de creatures symboliques comme les Lying Figures, les Nurses, Abstract Daddy et Pyramid Head. James represente Silent Hill dans sa forme la plus intime: avancer parce qu une verite attend, meme quand survivre signifie se regarder enfin.',
      en: 'In his origin Thread, James Sunderland comes to Silent Hill after receiving a letter from Mary, his dead wife. The town does not only place monsters before him: it rebuilds his lies, grief, desire to forget, and guilt as fog, empty apartments, hospital, prison, Lakeview Hotel, and symbolic creatures such as Lying Figures, Nurses, Abstract Daddy, and Pyramid Head. James represents Silent Hill at its most intimate: moving forward because a truth waits, even when survival means finally looking at himself.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, James est une signature fragile mais essentielle: il prouve que la Trame Silent Hill ne doit jamais devenir un simple decor horrifique. A.R.C.A. l envoie dans les failles ou le Sans-Auteur transforme les regrets des heros en ennemis anonymes. Son role est de nommer le cauchemar, separer la punition juste de la manipulation, puis sortir avec une verite intacte plutot qu une victoire spectaculaire. Si James echoue, la Cite-Mosaique risque de produire des Otherworlds pour n importe quelle peur non resolue.',
      en: 'In Multiverse Breach, James is a fragile but essential signature: he proves Silent Hill must never become a simple horror backdrop. A.R.C.A. sends him into rifts where the Authorless turns heroes regrets into anonymous enemies. His role is to name the nightmare, separate deserved reckoning from manipulation, then leave with an intact truth rather than a spectacular victory. If James fails, Mosaic City may start producing Otherworlds for any unresolved fear.'
    },
    doctrine: { fr: 'Tuyau de fer, radio parasite, carte de ville, soin rare, confrontation de memoire.', en: 'Steel pipe, static radio, town map, scarce healing, memory confrontation.' },
    tags: ['Silent Hill 2', 'James', 'Mary', 'Fog', 'Guilt']
  },
  heather: {
    clearance: 'SH-HM3',
    rank: { fr: 'Heritiere de l Ordre', en: 'Heir of the Order' },
    role: { fr: 'Resistance a la naissance du dieu', en: 'Resistance against the god birth' },
    callSign: 'Mason',
    origin: { fr: 'Univers Silent Hill 3 - Heather Mason / Alessa / l Ordre', en: 'Silent Hill 3 universe - Heather Mason / Alessa / the Order' },
    dossier: {
      fr: 'Dans sa Trame d origine, Heather Mason decouvre que sa vie est liee a Alessa Gillespie, a Harry Mason et au culte de Silent Hill. Elle traverse centre commercial, metro, hopital Brookhaven, parc d attractions et Otherworld organique pendant que Claudia et l Ordre cherchent a faire naitre leur dieu a travers elle. Heather represente Silent Hill comme herite refuse: une adolescente qui porte une histoire trop lourde, mais qui choisit de ne pas devenir l outil d une prophetie.',
      en: 'In her origin Thread, Heather Mason discovers her life is tied to Alessa Gillespie, Harry Mason, and the cult of Silent Hill. She crosses mall, subway, Brookhaven Hospital, amusement park, and organic Otherworld while Claudia and the Order try to birth their god through her. Heather represents Silent Hill as rejected inheritance: a teenager carrying a story too heavy, yet choosing not to become the tool of a prophecy.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Heather sert de verrou vivant contre les failles qui se font passer pour destin. Le Sans-Auteur tente de recycler les propheties de l Ordre pour creer une divinite de Trame capable de juger tous les univers. A.R.C.A. l emploie pour briser les rituels, proteger les heros marques par une naissance imposee et rappeler qu une origine ne doit pas decider toute une vie. Son combat n est pas seulement contre les monstres de Silent Hill: c est contre la facon dont le Nexus pourrait transformer les personnages en roles fixes.',
      en: 'In Multiverse Breach, Heather acts as a living lock against breaches pretending to be destiny. The Authorless tries to recycle the Order prophecies into a Thread deity able to judge every universe. A.R.C.A. uses her to break rituals, protect heroes marked by imposed birth, and remind the Nexus that origin should not decide an entire life. Her fight is not only against Silent Hill monsters: it is against the way the Nexus could turn characters into fixed roles.'
    },
    doctrine: { fr: 'Pistolet, katana, pendentif Aglaophotis, rejet du dieu, marche dans l Otherworld.', en: 'Handgun, katana, Aglaophotis pendant, refusal of the god, Otherworld march.' },
    tags: ['Silent Hill 3', 'Heather', 'Alessa', 'Order', 'Prophecy']
  },
  regina: {
    clearance: 'DC-03',
    rank: { fr: 'Operatrice SORT', en: 'SORT Operative' },
    role: { fr: 'Extraction et crise temporelle', en: 'Extraction and time crisis' },
    callSign: 'Regina',
    origin: { fr: 'Ibis Island - Third Energy', en: 'Ibis Island - Third Energy' },
    dossier: {
      fr: 'Specialiste des installations hostiles et incidents prehistoriques. Regina transforme une poursuite de raptor en trajectoire de repli exploitable.',
      en: 'Specialist in hostile facilities and prehistoric incidents. Regina turns a raptor chase into an exploitable extraction route.'
    },
    doctrine: { fr: 'Tir mobile, fleche explosive, leurre anti-raptor.', en: 'Mobile fire, explosive dart, anti-raptor lure.' },
    tags: ['SORT', 'Raptor', 'Third Energy', 'Escape']
  },
  neo: {
    clearance: 'ZION-01',
    rank: { fr: 'Anomalie systeme', en: 'System Anomaly' },
    role: { fr: 'Alteration de realite', en: 'Reality alteration' },
    callSign: 'The One',
    origin: { fr: 'Matrix / Zion', en: 'Matrix / Zion' },
    dossier: {
      fr: 'Signature impossible a stabiliser completement: Neo plie les regles locales au lieu de les subir. Ideal contre les failles codees et les ennemis synthetiques.',
      en: 'Signature impossible to fully stabilize: Neo bends local rules instead of obeying them. Ideal against coded breaches and synthetic enemies.'
    },
    doctrine: { fr: 'Bullet time, arts martiaux, reecriture du code.', en: 'Bullet time, martial arts, code rewrite.' },
    tags: ['Matrix', 'Code', 'Glitch', 'Dodge']
  },
  oneill: {
    clearance: 'SGC-01',
    rank: { fr: 'Colonel USAF / commandant SG-1', en: 'USAF Colonel / SG-1 commander' },
    role: { fr: 'Commandement expeditionnaire par Porte', en: 'Gate expedition command' },
    callSign: 'O\'Neill',
    origin: { fr: 'Univers Stargate SG-1 - Terre / SGC / Cheyenne Mountain', en: 'Stargate SG-1 universe - Earth / SGC / Cheyenne Mountain' },
    dossier: {
      fr: 'Dans sa Trame d origine, Jack O Neill commande SG-1 depuis le SGC, sous Cheyenne Mountain, apres la decouverte que la Porte des Etoiles relie la Terre a un reseau galactique de mondes, de cultures humaines transplantees et de menaces Goa uld. Soldat marque par les operations speciales et Abydos, il oppose aux faux dieux une logique simple: humour sec, P90, retraite couverte, iris ferme quand il le faut, et priorite absolue a ramener son equipe vivante.',
      en: 'In his origin Thread, Jack O Neill commands SG-1 from the SGC under Cheyenne Mountain after the Stargate reveals a galactic network of worlds, transplanted human cultures, and Goa uld threats. A soldier shaped by special operations and Abydos, he answers false gods with a simple logic: dry humor, P90, covered fallback, iris closed when needed, and absolute priority on bringing his team home alive.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, O Neill traite chaque faille comme une adresse inconnue: on reconnait, on verifie le GDO, on protege l iris et on refuse de laisser un faux dieu transformer la Cité-Mosaïque en territoire conquis. A.R.C.A. l emploie pour decider quand ouvrir une route et quand la fermer, car son lore ne vend jamais l exploration comme une promenade: chaque Porte peut sauver une civilisation ou laisser entrer une flotte hostile.',
      en: 'In Multiverse Breach, O Neill treats every rift like an unknown address: scout, verify the GDO, protect the iris, and refuse to let a false god turn Mosaic City into conquered territory. A.R.C.A. uses him to decide when to open a route and when to close it, because his lore never frames exploration as a stroll: every Gate can save a civilization or let a hostile fleet in.'
    },
    doctrine: { fr: 'P90, Zat nik tel, GDO, iris, repli couvert, decisions de commandement SG-1.', en: 'P90, Zat nik tel, GDO, iris, covered fallback, SG-1 command decisions.' },
    tags: ['SG-1', 'SGC', 'P90', 'Iris', 'Goauld', 'Command']
  },
  freeman: {
    clearance: 'BM-HEV',
    rank: { fr: 'Physicien HEV / anomalie Black Mesa', en: 'HEV physicist / Black Mesa anomaly' },
    role: { fr: 'Cascade de resonance', en: 'Resonance cascade' },
    callSign: 'Freeman',
    origin: { fr: 'Univers Half-Life - Black Mesa / Xen / Combine', en: 'Half-Life universe - Black Mesa / Xen / Combine' },
    dossier: {
      fr: 'Dans sa Trame d origine, Gordon Freeman est un physicien theoricien de Black Mesa equipe d une combinaison HEV au moment ou l experience de materiaux anormaux provoque la cascade de resonance. L accident ouvre la Terre a Xen, aux headcrabs, vortigaunts, forces militaires HECU, puis a une domination Combine qui transforme l incident scientifique en guerre d occupation. Freeman traverse ce monde sans discours: pied-de-biche, armes improvisees, modules HEV, saut long, gravity gun, silence et refus constant de devenir l instrument du G-Man ou du Combine.',
      en: 'In his origin Thread, Gordon Freeman is a Black Mesa theoretical physicist wearing an HEV suit when the anomalous materials experiment triggers the resonance cascade. The accident opens Earth to Xen, headcrabs, vortigaunts, HECU forces, then a Combine occupation that turns a research disaster into a war of control. Freeman crosses this world without speeches: crowbar, improvised weapons, HEV modules, long jump, gravity gun, silence, and constant refusal to become a tool of the G-Man or the Combine.'
    },
    breachLore: {
      fr: 'Quand la Breche touche Black Mesa, A.R.C.A. detecte une anomalie rare: Freeman ne ferme pas les portails par autorite, il les traverse jusqu a ce que leur logique s effondre. Dans Multiverse Breach, son role est de stabiliser les cascades avant qu elles ne deviennent des portes permanentes entre Trames, d isoler Xen du Sans-Auteur, de retourner les technologies Combine contre leurs noeuds de controle et de garder le silence comme une resistance: aucun slogan, seulement une trajectoire que le Nexus peut suivre.',
      en: 'When the Breach hits Black Mesa, A.R.C.A. detects a rare anomaly: Freeman does not close portals through authority, he crosses them until their logic collapses. In Multiverse Breach, his role is to stabilize cascades before they become permanent doors between Threads, isolate Xen from the Authorless, turn Combine technology against its control nodes, and keep silence as resistance: no slogan, only a trajectory the Nexus can follow.'
    },
    doctrine: { fr: 'Pied-de-biche, combinaison HEV, armes Black Mesa, saut long, gravity gun, rayon gluon.', en: 'Crowbar, HEV suit, Black Mesa weapons, long jump, gravity gun, gluon beam.' },
    tags: ['Black Mesa', 'HEV', 'Xen', 'Combine', 'Gravity', 'G-Man']
  },
  chell: {
    clearance: 'APT-01',
    rank: { fr: 'Sujet de test', en: 'Test Subject' },
    role: { fr: 'Mobilite par portails', en: 'Portal mobility' },
    callSign: 'Chell',
    origin: { fr: 'Aperture Science', en: 'Aperture Science' },
    dossier: {
      fr: 'Sujet silencieux a resistance exceptionnelle. Chell transforme la geometrie d une breche en raccourci, piege ou redirection tactique.',
      en: 'Silent subject with exceptional endurance. Chell turns breach geometry into shortcuts, traps, or tactical redirection.'
    },
    doctrine: { fr: 'Portail, redirection, tourelle improvisee.', en: 'Portal, redirect, improvised turret.' },
    tags: ['Aperture', 'Portal', 'Redirect', 'Test']
  },
  snake: {
    clearance: 'FOX-01',
    rank: { fr: 'Agent d infiltration', en: 'Infiltration Agent' },
    role: { fr: 'Espionnage tactique', en: 'Tactical espionage' },
    callSign: 'Snake',
    origin: { fr: 'Shadow Moses / FOXHOUND', en: 'Shadow Moses / FOXHOUND' },
    dossier: {
      fr: 'Operateur d infiltration concu pour les objectifs impossibles. Sa plaquette met l accent sur furtivite, sabotage et frappe courte contre cible prioritaire.',
      en: 'Infiltration operator built for impossible objectives. His plaque emphasizes stealth, sabotage, and short strikes against priority targets.'
    },
    doctrine: { fr: 'SOCOM, missile Nikita, CQC et chaff.', en: 'SOCOM, Nikita missile, CQC and chaff.' },
    tags: ['FOXHOUND', 'Stealth', 'CQC', 'Sabotage']
  },
  isaac: {
    clearance: 'CEC-RIG',
    rank: { fr: 'Ingenieur CEC', en: 'CEC Engineer' },
    role: { fr: 'Demembrement necromorphe', en: 'Necromorph dismemberment' },
    callSign: 'Clarke',
    origin: { fr: 'USG Ishimura', en: 'USG Ishimura' },
    dossier: {
      fr: 'Ingenieur force a survivre a l impossible. Isaac traite une breche comme un systeme en panne: coupe, ralentit, repare, puis avance.',
      en: 'Engineer forced to survive the impossible. Isaac treats a breach like a failing system: cut, slow, repair, then move.'
    },
    doctrine: { fr: 'Plasma cutter, stase, telekinesie RIG.', en: 'Plasma cutter, stasis, RIG kinesis.' },
    tags: ['CEC', 'RIG', 'Stasis', 'Dismember']
  },
  shepard: {
    clearance: 'N7-01',
    rank: { fr: 'Commandant N7', en: 'N7 Commander' },
    role: { fr: 'Commandement galactique', en: 'Galactic command' },
    callSign: 'Shepard',
    origin: { fr: 'Alliance Systems', en: 'Systems Alliance' },
    dossier: {
      fr: 'Commandant capable d unir des factions incompatibles sous le feu. Le Nexus l utilise pour stabiliser les failles ou la diplomatie et la puissance doivent avancer ensemble.',
      en: 'Commander able to unite incompatible factions under fire. The Nexus uses Shepard where diplomacy and force have to move together.'
    },
    doctrine: { fr: 'Omni-lame, biotique, frappe Mako.', en: 'Omni-blade, biotics, Mako strike.' },
    tags: ['N7', 'Biotic', 'Squad', 'Command']
  },
  doomslayer: {
    clearance: 'UAC-666',
    rank: { fr: 'Tueur infernal', en: 'Hell Slayer' },
    role: { fr: 'Eradication demoniaque', en: 'Demonic eradication' },
    callSign: 'Slayer',
    origin: { fr: 'Mars / Argent D Nur', en: 'Mars / Argent D Nur' },
    dossier: {
      fr: 'Aucune negociation, aucune retraite longue. Sa plaquette sert a une seule chose: confirmer que la breche infernale doit etre fermee par force brute.',
      en: 'No negotiation, no long retreat. His plaque exists for one purpose: confirming that a hell breach must be closed by brute force.'
    },
    doctrine: { fr: 'Super shotgun, Flame Belch, BFG 9000.', en: 'Super shotgun, Flame Belch, BFG 9000.' },
    tags: ['UAC', 'Demon', 'BFG', 'Brutal']
  },
  arbiter: {
    clearance: 'SANG-01',
    rank: { fr: 'Arbiter', en: 'Arbiter' },
    role: { fr: 'Dueliste Covenant', en: 'Covenant duelist' },
    callSign: 'Thel',
    origin: { fr: 'Sanghelios', en: 'Sanghelios' },
    dossier: {
      fr: 'Guerrier Sangheili passe de l obeissance au jugement. Le Nexus le classe comme lame d honneur, utile contre les elites et les boss rapides.',
      en: 'Sangheili warrior who moved from obedience to judgment. The Nexus classifies him as an honor blade, useful against elites and fast bosses.'
    },
    doctrine: { fr: 'Epee energetique, camouflage actif, charge Sangheili.', en: 'Energy sword, active camouflage, Sangheili charge.' },
    tags: ['Sangheili', 'Sword', 'Honor', 'Cloak']
  },
  barney: {
    clearance: 'BM-SEC',
    rank: { fr: 'Securite Black Mesa / Resistance City 17', en: 'Black Mesa security / City 17 Resistance' },
    role: { fr: 'Extraction humaine', en: 'Human extraction' },
    callSign: 'Barney',
    origin: { fr: 'Univers Half-Life - Black Mesa Security / Resistance', en: 'Half-Life universe - Black Mesa Security / Resistance' },
    dossier: {
      fr: 'Dans sa Trame d origine, Barney Calhoun commence comme agent de securite a Black Mesa pendant la cascade de resonance. Il survit aux couloirs envahis par Xen, aux ordres militaires contradictoires et aux ruptures de confinement, puis reapparait comme membre de la Resistance contre l occupation Combine a City 17. Barney represente le Half-Life humain: escorter, ouvrir une route, donner une arme, tenir une barricade, plaisanter juste assez pour que la panique ne gagne pas.',
      en: 'In his origin Thread, Barney Calhoun starts as a Black Mesa security officer during the resonance cascade. He survives Xen-infested corridors, contradictory military orders, and containment failures, then returns as a Resistance member against the Combine occupation in City 17. Barney represents human Half-Life: escort, open a route, hand over a weapon, hold a barricade, joke just enough to keep panic from winning.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Barney sert de contrepoids a l anomalie Freeman: il rappelle que la Breche Half-Life ne concerne pas seulement des portails, mais les gens coincés derriere. A.R.C.A. l emploie pour evacuer les signatures civiles, convertir une salle de laboratoire en point de resistance, couvrir les replis et empecher le Sans-Auteur de transformer Black Mesa en simple decor de catastrophe. Sa valeur est claire: si Barney tient la porte, quelqu un rentre vivant.',
      en: 'In Multiverse Breach, Barney is the counterweight to the Freeman anomaly: he reminds A.R.C.A. that a Half-Life breach is not only about portals, but about people trapped behind them. A.R.C.A. uses him to evacuate civilian signatures, convert a lab room into a resistance point, cover retreats, and prevent the Authorless from turning Black Mesa into generic disaster scenery. His value is simple: if Barney holds the door, someone comes back alive.'
    },
    doctrine: { fr: 'Pistolet 9mm, couverture courte, radio Resistance, evacuation de survivants, barrage anti-Combine.', en: '9mm sidearm, short cover, Resistance radio, survivor evacuation, anti-Combine suppression.' },
    tags: ['Black Mesa', 'Security', 'Resistance', 'City 17', 'Combine', 'Rescue']
  },
  shephard: {
    clearance: 'HECU-OP4',
    rank: { fr: 'Caporal HECU / survivant Opposing Force', en: 'HECU corporal / Opposing Force survivor' },
    role: { fr: 'Intervention militaire Black Mesa', en: 'Black Mesa military intervention' },
    callSign: 'Shephard',
    origin: { fr: 'Univers Half-Life - HECU / Black Mesa / Race X', en: 'Half-Life universe - HECU / Black Mesa / Race X' },
    dossier: {
      fr: 'Dans sa Trame d origine, Adrian Shephard est un marine HECU envoye a Black Mesa pendant l incident de resonance. Il arrive comme force de nettoyage militaire, mais se retrouve piege dans le meme cauchemar que les scientifiques: Xen, Race X, teleports instables, chaines de commandement brisees et G-Man qui observe chaque sortie possible. Shephard represente le Half-Life vu depuis l autre cote du fusil: mission officielle, survie improvisee et refus progressif d etre seulement un executant.',
      en: 'In his origin Thread, Adrian Shephard is a HECU marine sent to Black Mesa during the resonance incident. He arrives as a military cleanup force, but becomes trapped in the same nightmare as the scientists: Xen, Race X, unstable teleports, broken chains of command, and the G-Man watching every possible exit. Shephard represents Half-Life from the other side of the rifle: official mission, improvised survival, and gradual refusal to remain only an executor.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Shephard sert a lire les failles Half-Life que Freeman traverse trop vite et que Barney veut evacuer. A.R.C.A. l emploie pour securiser les zones HECU, recuperer du materiel lourd, neutraliser Race X avant qu elle ne se greffe aux autres Trames et surveiller les choix du G-Man. Son danger est politique: s il redevient simple soldat d ordre, le Sans-Auteur peut transformer Black Mesa en operation de nettoyage sans temoins.',
      en: 'In Multiverse Breach, Shephard reads the Half-Life breaches Freeman crosses too quickly and Barney wants to evacuate. A.R.C.A. uses him to secure HECU zones, recover heavy gear, neutralize Race X before it grafts onto other Threads, and monitor G-Man choices. His danger is political: if he becomes only a soldier following orders again, the Authorless can turn Black Mesa into a cleanup operation with no witnesses.'
    },
    doctrine: { fr: 'Fusil HECU, cle a pipe, spores Race X, explosifs, extraction sous observation G-Man.', en: 'HECU rifle, pipe wrench, Race X spores, explosives, extraction under G-Man observation.' },
    tags: ['HECU', 'Opposing Force', 'Race X', 'Black Mesa', 'G-Man', 'Marine']
  },
  alyx_vance: {
    clearance: 'C17-ALYX',
    rank: { fr: 'Operatrice Resistance / ingenieure de terrain', en: 'Resistance operative / field engineer' },
    role: { fr: 'Piraterie Combine et survie urbaine', en: 'Combine hacking and urban survival' },
    callSign: 'Alyx',
    origin: { fr: 'Univers Half-Life - City 17 / Resistance / Combine', en: 'Half-Life universe - City 17 / Resistance / Combine' },
    dossier: {
      fr: 'Dans sa Trame d origine, Alyx Vance grandit dans un monde deja brise par la cascade de resonance et l occupation Combine. Fille d Eli Vance, ingenieure de terrain, combattante de la Resistance et partenaire centrale de Gordon Freeman, elle traverse City 17, Ravenholm, la Citadelle et les ruines de l occupation avec une competence rare: transformer la technologie ennemie en issue. Alyx represente le Half-Life de la Resistance humaine: piratage, improvisation, confiance, Dog, gravite manipulee et refus de laisser le Combine definir l avenir.',
      en: 'In her origin Thread, Alyx Vance grows up in a world already broken by the resonance cascade and Combine occupation. Daughter of Eli Vance, field engineer, Resistance fighter, and central partner to Gordon Freeman, she crosses City 17, Ravenholm, the Citadel, and the ruins of occupation with a rare skill: turning enemy technology into an exit. Alyx represents human Resistance Half-Life: hacking, improvisation, trust, Dog, manipulated gravity, and refusal to let the Combine define the future.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Alyx est la voix humaine qui empeche les failles Half-Life de devenir seulement des experiences ou des guerres. A.R.C.A. l envoie la ou les noeuds Combine ont verrouille les civils dans des boucles de surveillance: elle pirate les serrures de Trame, retourne les scanners, ouvre les routes que Freeman traverse ensuite et maintient le lien moral de l escouade. Sa Breche personnelle n est pas de prouver sa force; c est de sauver assez de choix pour que la Resistance reste une decision vivante.',
      en: 'In Multiverse Breach, Alyx is the human voice that prevents Half-Life breaches from becoming only experiments or wars. A.R.C.A. sends her where Combine nodes have locked civilians inside surveillance loops: she hacks Thread locks, turns scanners around, opens routes Freeman can cross, and keeps the squad moral link alive. Her personal Breach is not about proving strength; it is about saving enough choices for Resistance to remain a living decision.'
    },
    doctrine: { fr: 'Pistolet Resistance, piratage Combine, gravity gloves, Dog, extraction de civils.', en: 'Resistance pistol, Combine hacking, gravity gloves, Dog, civilian extraction.' },
    tags: ['Alyx', 'Resistance', 'City 17', 'Combine', 'Dog', 'Gravity']
  },
  dutch: {
    clearance: 'VAL-VERDE',
    rank: { fr: 'Major operations speciales', en: 'Special Operations Major' },
    role: { fr: 'Contre-chasse jungle', en: 'Jungle counter-hunt' },
    callSign: 'Dutch',
    origin: { fr: 'Val Verde', en: 'Val Verde' },
    dossier: {
      fr: 'Soldat qui a compris qu une chasse peut se retourner. Dutch est indexe pour pieges, endurance et combat contre predateur superieur.',
      en: 'Soldier who learned that a hunt can be reversed. Dutch is indexed for traps, endurance, and combat against superior predators.'
    },
    doctrine: { fr: 'Armes lourdes, pieges, combat de boue thermique.', en: 'Heavy weapons, traps, thermal mud combat.' },
    tags: ['Jungle', 'Trap', 'Commando', 'Counterhunt']
  },
  jill: {
    clearance: 'STARS-01',
    rank: { fr: 'Operatrice S.T.A.R.S. / survivante Nemesis', en: 'S.T.A.R.S. operative / Nemesis survivor' },
    role: { fr: 'Survie tactique anti-B.O.W.', en: 'Anti-B.O.W. tactical survival' },
    callSign: 'Valentine',
    origin: { fr: 'Univers Resident Evil - S.T.A.R.S. / Manoir Spencer / Raccoon City', en: 'Resident Evil universe - S.T.A.R.S. / Spencer Mansion / Raccoon City' },
    dossier: {
      fr: 'Dans sa Trame d origine, Jill Valentine est membre des S.T.A.R.S., formee au crochetage, au combat tactique et a la survie en environnement ferme. Elle survit au Manoir Spencer, decouvre les experiences d Umbrella, affronte zombies, Hunters, Tyrants et finit traquee dans Raccoon City par Nemesis, arme bio-organique programmee pour eliminer les S.T.A.R.S. Jill represente le Resident Evil des portes verrouillees, des salles de sauvegarde, des enigmes sous pression, du poison, des herbes de soin et de la poursuite implacable.',
      en: 'In her origin Thread, Jill Valentine is a S.T.A.R.S. member trained in lockpicking, tactical combat, and survival inside sealed environments. She survives the Spencer Mansion, uncovers Umbrella experiments, faces zombies, Hunters, Tyrants, and is later hunted through Raccoon City by Nemesis, a bio-organic weapon programmed to eliminate S.T.A.R.S. Jill represents Resident Evil locked doors, save rooms, puzzles under pressure, poison, healing herbs, and relentless pursuit.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Jill est l operatrice qui refuse que la Breche transforme Raccoon City en boucle de poursuite infinie. A.R.C.A. l emploie pour ouvrir les salles scellees, identifier les serrures de Trame, poser des contre-mesures anti-B.O.W. et guider les survivants quand Nemesis ou un Tyrant recode force le joueur a bouger. Sa logique Breach est Resident Evil pure: comprendre le plan, economiser les ressources, choisir quand fuir et quand abattre la menace.',
      en: 'In Multiverse Breach, Jill is the operative who refuses to let the Breach turn Raccoon City into an endless pursuit loop. A.R.C.A. uses her to open sealed rooms, identify Thread locks, deploy anti-B.O.W. countermeasures, and guide survivors when Nemesis or a recoded Tyrant forces movement. Her Breach logic is pure Resident Evil: read the map, conserve resources, choose when to run and when to drop the threat.'
    },
    doctrine: { fr: 'Pistolet S.T.A.R.S., crochetage, esquive, herbes de soin, contre-mesure anti-Nemesis.', en: 'S.T.A.R.S. pistol, lockpick, dodge, healing herbs, anti-Nemesis countermeasure.' },
    tags: ['S.T.A.R.S.', 'Nemesis', 'Lockpick', 'Biohazard', 'Survival', 'Umbrella']
  },
  wesker: {
    clearance: 'UMB-W',
    rank: { fr: 'Ancien capitaine S.T.A.R.S. / sujet viral avance', en: 'Former S.T.A.R.S. captain / advanced viral subject' },
    role: { fr: 'Menace controlee Umbrella', en: 'Controlled Umbrella threat' },
    callSign: 'Wesker',
    origin: { fr: 'Univers Resident Evil - Umbrella / Projet Wesker / Uroboros', en: 'Resident Evil universe - Umbrella / Wesker Project / Uroboros' },
    dossier: {
      fr: 'Dans sa Trame d origine, Albert Wesker est l un des visages les plus dangereux d Umbrella: capitaine S.T.A.R.S. infiltre, produit d un programme d eugenisme viral, manipulateur froid et futur porteur d une force surhumaine liee aux experiences d Umbrella. Il incarne le Resident Evil de la trahison corporative, des laboratoires caches, des virus comme outils d evolution forcee, d Uroboros et de l idee que l humanite peut etre triee comme une experience.',
      en: 'In his origin Thread, Albert Wesker is one of Umbrella most dangerous faces: infiltrating S.T.A.R.S. captain, product of a viral eugenics program, cold manipulator, and later bearer of superhuman power tied to Umbrella experiments. He embodies Resident Evil corporate betrayal, hidden laboratories, viruses as forced evolution tools, Uroboros, and the idea that humanity can be sorted like an experiment.'
    },
    breachLore: {
      fr: 'A.R.C.A. ne classe jamais Wesker comme simple recrue. Dans Multiverse Breach, sa signature est une arme sous scelle: utile pour lire les protocoles Umbrella, predire les mutations et retourner un laboratoire contre lui-meme, mais dangereuse car le Sans-Auteur peut lui offrir exactement ce qu il veut: un multivers a selectionner. Son arc Breach doit donc rester sous surveillance: exploiter son intelligence sans le laisser transformer la Cité-Mosaïque en protocole Uroboros.',
      en: 'A.R.C.A. never classifies Wesker as a simple recruit. In Multiverse Breach, his signature is a sealed weapon: useful for reading Umbrella protocols, predicting mutations, and turning a lab against itself, but dangerous because the Authorless can offer exactly what he wants: a multiverse to select. His Breach arc must stay monitored: exploit his intelligence without letting him turn Mosaic City into an Uroboros protocol.'
    },
    doctrine: { fr: 'Esquive surhumaine, tir de precision, Uroboros, manipulation de laboratoire.', en: 'Superhuman evasion, precision gunfire, Uroboros, laboratory manipulation.' },
    tags: ['Umbrella', 'Uroboros', 'Wesker', 'Virus', 'Traitor', 'BOW']
  },
  sam_carter: {
    clearance: 'SGC-02',
    rank: { fr: 'Major USAF / astrophysicienne SGC', en: 'USAF Major / SGC astrophysicist' },
    role: { fr: 'Science de Porte et contre-mesures', en: 'Gate science and countermeasures' },
    callSign: 'Carter',
    origin: { fr: 'Univers Stargate SG-1 - Terre / SGC / USAF / naquadah', en: 'Stargate SG-1 universe - Earth / SGC / USAF / naquadah' },
    dossier: {
      fr: 'Dans sa Trame d origine, Samantha Carter est officier de l USAF et astrophysicienne, l une des rares personnes capables de comprendre a la fois la physique de la Porte, les moteurs hyperspatiaux, le naquadah, les boucliers Goa uld et les risques temporels ou dimensionnels qui suivent SG-1. Elle represente le Stargate scientifique: resoudre vite, expliquer juste assez, puis transformer une anomalie mortelle en solution tactique.',
      en: 'In her origin Thread, Samantha Carter is a USAF officer and astrophysicist, one of the few people able to understand Gate physics, hyperspace engines, naquadah, Goa uld shields, and the temporal or dimensional risks that follow SG-1. She represents scientific Stargate: solve fast, explain just enough, then turn a lethal anomaly into a tactical solution.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Carter est celle qui empeche les Portes de devenir des trous narratifs. A.R.C.A. la branche aux chevrons instables pour recalculer les adresses de Trame, isoler les surcharges de naquadah, transformer les boucliers ennemis en fenetres de tir et prouver qu une breche peut etre comprise sans perdre son mystere. Si O Neill decide quand ouvrir, Carter explique comment survivre a l ouverture.',
      en: 'In Multiverse Breach, Carter prevents Gates from becoming narrative holes. A.R.C.A. connects her to unstable chevrons to recalculate Thread addresses, isolate naquadah overloads, turn enemy shields into firing windows, and prove a breach can be understood without losing its mystery. If O Neill decides when to open, Carter explains how to survive the opening.'
    },
    doctrine: { fr: 'Calcul de chevrons, surcharge naquadah, piratage de bouclier Goa uld, science de terrain.', en: 'Chevron calculation, naquadah overload, Goa uld shield hacking, field science.' },
    tags: ['SG-1', 'Carter', 'Naquadah', 'Chevron', 'Science', 'USAF']
  },
  tealc: {
    clearance: 'SGC-03',
    rank: { fr: 'Jaffa libre / ancien Prima d Apophis', en: 'Free Jaffa / former First Prime of Apophis' },
    role: { fr: 'Avant-garde anti-Goa uld', en: 'Anti-Goa uld vanguard' },
    callSign: 'Teal\'c',
    origin: { fr: 'Univers Stargate SG-1 - Chulak / Jaffa libre / Goa uld', en: 'Stargate SG-1 universe - Chulak / Free Jaffa / Goa uld' },
    dossier: {
      fr: 'Dans sa Trame d origine, Teal c nait dans la culture Jaffa, porteur d un symbiote larvaire et soldat d un empire qui sert les Goa uld comme des dieux. Ancien Prima d Apophis, il trahit son faux dieu pour rejoindre SG-1 et ouvrir la route a la rebellion Jaffa. Son lore est discipline, honneur, lance serpent, connaissance intime des tactiques ennemies et liberte conquise contre des millenaires de mensonge religieux.',
      en: 'In his origin Thread, Teal c is born into Jaffa culture, carrying a larval symbiote and serving an empire that worships Goa uld as gods. Former First Prime of Apophis, he betrays his false god to join SG-1 and open the road to the Free Jaffa rebellion. His lore is discipline, honor, serpent staff, intimate knowledge of enemy tactics, and freedom won against millennia of religious lies.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Teal c reconnait tout de suite le danger du Sans-Auteur: une force qui veut etre obei sans histoire ressemble trop aux Goa uld. A.R.C.A. l envoie contre les faux dieux de Trame, les Primes recodes et les temples qui tentent de transformer la foi en controle. Sa presence rappelle que Stargate ne parle pas seulement de technologie ancienne, mais de peuples qui apprennent a ne plus s agenouiller.',
      en: 'In Multiverse Breach, Teal c immediately recognizes the danger of the Authorless: a force demanding obedience without story resembles the Goa uld too closely. A.R.C.A. sends him against Thread false gods, recoded First Primes, and temples trying to turn faith into control. His presence reminds Stargate is not only about ancient technology, but about peoples learning not to kneel.'
    },
    doctrine: { fr: 'Lance Jaffa, duel frontal, protection SG-1, contre-doctrine Goa uld.', en: 'Jaffa staff, frontal duel, SG-1 protection, anti-Goa uld doctrine.' },
    tags: ['SG-1', 'Tealc', 'Jaffa', 'Chulak', 'Apophis', 'Freedom']
  },
  daniel_jackson: {
    clearance: 'SGC-04',
    rank: { fr: 'Archeologue / linguiste SG-1', en: 'Archaeologist / SG-1 linguist' },
    role: { fr: 'Langues anciennes et memoire de Porte', en: 'Ancient languages and Gate memory' },
    callSign: 'Daniel',
    origin: { fr: 'Univers Stargate SG-1 - Abydos / Anciens / mythologies Goa uld', en: 'Stargate SG-1 universe - Abydos / Ancients / Goa uld mythologies' },
    dossier: {
      fr: 'Dans sa Trame d origine, Daniel Jackson est l archeologue et linguiste qui comprend que les dieux antiques caches dans les mythes etaient souvent des Goa uld, et que la Porte des Etoiles relie la Terre a une histoire galactique oubliee. Abydos, Sha re, les Anciens, l Ascension et les langues mortes font de lui le membre de SG-1 qui lit les mondes avant de les traverser. Son arme principale n est pas seulement un pistolet: c est la traduction juste au bon moment.',
      en: 'In his origin Thread, Daniel Jackson is the archaeologist and linguist who understands that ancient gods hidden in myth were often Goa uld, and that the Stargate connects Earth to a forgotten galactic history. Abydos, Sha re, the Ancients, Ascension, and dead languages make him the SG-1 member who reads worlds before crossing them. His primary weapon is not only a pistol: it is the right translation at the right time.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Daniel protege le sens des Trames. A.R.C.A. l utilise quand une Porte ouvre sur des symboles que les armes ne peuvent pas resoudre: cartouches Goa uld, dialectes Anciens, mythes contamines par le Sans-Auteur, rituels qui sont en fait des protocoles. Il empeche la Breche de reduire Stargate a des tirs de couloir, parce qu une mauvaise traduction peut ouvrir une invasion, mais une bonne peut sauver un monde.',
      en: 'In Multiverse Breach, Daniel protects Thread meaning. A.R.C.A. uses him when a Gate opens onto symbols weapons cannot solve: Goa uld cartouches, Ancient dialects, myths contaminated by the Authorless, rituals that are actually protocols. He prevents the Breach from reducing Stargate to corridor firefights, because a bad translation can open an invasion, but a good one can save a world.'
    },
    doctrine: { fr: 'Traduction de glyphes, lecture Ancienne, diplomatie, archeologie de terrain, ascension surveillee.', en: 'Glyph translation, Ancient reading, diplomacy, field archaeology, monitored Ascension.' },
    tags: ['SG-1', 'Daniel', 'Abydos', 'Ancients', 'Glyphs', 'Ascension']
  }
};

const roleByCategory = {
  marine: {
    rank: { fr: 'Operateur de front', en: 'Frontline Operator' },
    role: { fr: 'Ancrage de front', en: 'Frontline anchor' },
    protocol: {
      fr: 'Tenir la ligne, absorber la premiere vague et transformer la pression ennemie en couloir de tir.',
      en: 'Hold the line, absorb the first wave, and turn enemy pressure into a firing corridor.'
    }
  },
  slayer: {
    rank: { fr: 'Executeur de breche', en: 'Breach Executioner' },
    role: { fr: 'Rupture offensive', en: 'Offensive rupture' },
    protocol: {
      fr: 'Casser le tempo adverse, isoler la cible dominante et fermer la sequence par une frappe decisive.',
      en: 'Break enemy tempo, isolate the dominant target, and close the sequence with a decisive strike.'
    }
  },
  horror: {
    rank: { fr: 'Survivant anomalie', en: 'Anomaly Survivor' },
    role: { fr: 'Survie contre-anomalie', en: 'Counter-anomaly survival' },
    protocol: {
      fr: 'Lire les signaux faibles, survivre a la peur locale et retourner la regle du monstre contre lui.',
      en: 'Read weak signals, survive local fear pressure, and turn the monster rule back against it.'
    }
  },
  hacker: {
    rank: { fr: 'Lecteur de trame', en: 'Thread Reader' },
    role: { fr: 'Lecture du code-realite', en: 'Code-reality reader' },
    protocol: {
      fr: 'Scanner les lois cachees de la scene, ouvrir une faille courte et forcer le Nexus a garder la memoire.',
      en: 'Scan the hidden laws of the scene, open a short breach, and force the Nexus to keep memory.'
    }
  },
  tactical: {
    rank: { fr: 'Coordinateur terrain', en: 'Field Coordinator' },
    role: { fr: 'Commandement de terrain', en: 'Field command' },
    protocol: {
      fr: 'Organiser l escouade, proteger les signatures fragiles et choisir le moment exact de l engagement.',
      en: 'Organize the squad, protect fragile signatures, and choose the exact moment of engagement.'
    }
  }
};

const mediaProfiles = {
  game: {
    fr: 'A.R.C.A. traduit cette signature de jeu en boucle lisible: entree, pattern, contre-pattern, recompense.',
    en: 'A.R.C.A. translates this game signature into a readable loop: entry, pattern, counter-pattern, reward.'
  },
  movie: {
    fr: 'Le Nexus conserve le montage d origine comme une sequence de mission: exposition, menace, scene cle, resolution.',
    en: 'The Nexus preserves the original edit as a mission sequence: setup, threat, key scene, resolution.'
  },
  series: {
    fr: 'La signature vient d une trame longue: le risque principal est la contamination par arcs, retours et variations de ton.',
    en: 'The signature comes from a long-form Thread: the main risk is contamination by arcs, callbacks, and tone shifts.'
  },
  manga: {
    fr: 'La compression respecte la logique de panels: silhouette forte, technique nommee, evolution visible et impact net.',
    en: 'Compression respects panel logic: strong silhouette, named technique, visible escalation, clean impact.'
  },
  music: {
    fr: 'La signature est rythmique: le Nexus l ancre par tempo, motif visuel, rupture sonore et presence de scene.',
    en: 'The signature is rhythmic: the Nexus anchors it through tempo, visual motif, sonic rupture, and stage presence.'
  },
  web: {
    fr: 'La trame est instable par nature: A.R.C.A. priorise les symboles reconnaissables et les regles de scene.',
    en: 'The Thread is unstable by nature: A.R.C.A. prioritizes recognizable symbols and scene rules.'
  }
};

const universeProtocols = {
  'Attack on Titan': { fr: 'Mobilite verticale, pression titanesque et sacrifice tactique.', en: 'Vertical mobility, titan pressure, and tactical sacrifice.' },
  Another: { fr: 'Identification de l Extra, silence de classe et rupture de calamite.', en: 'Extra identification, class silence, and calamity rupture.' },
  'Cells at Work!': { fr: 'Flux vital, reparation cellulaire et defense immunitaire.', en: 'Vital flow, cellular repair, and immune defense.' },
  Dandadan: { fr: 'Collision yokai-alien, impulsion psychique et poursuite turbo.', en: 'Yokai-alien collision, psychic impulse, and turbo pursuit.' },
  'Death Note': { fr: 'Guerre d identite, deduction froide et trace ecrite interdite.', en: 'Identity war, cold deduction, and forbidden written trace.' },
  Discworld: { fr: 'Magie octarine, logique satirique et realite approximative mais tenace.', en: 'Octarine magic, satirical logic, and approximate but stubborn reality.' },
  'Ghost in the Shell': { fr: 'Cybercerveau, infiltration reseau et doute sur l identite.', en: 'Cyberbrain, network infiltration, and doubt over identity.' },
  Gunnm: { fr: 'Corps cyborg, arene motorball et fracture sociale de Zalem.', en: 'Cyborg body, motorball arena, and Zalem class fracture.' },
  Inuyashiki: { fr: 'Corps reconstruit, humanite fragile et puissance mecanique disproportionnee.', en: 'Rebuilt body, fragile humanity, and disproportionate mechanical power.' },
  Negima: { fr: 'Pactio, academie magique et surcharge de sorts coordonnes.', en: 'Pactio, magic academy, and coordinated spell overload.' },
  'Kung Pow': { fr: 'Parodie martiale, timing absurde et coup impossible assume.', en: 'Martial parody, absurd timing, and proudly impossible strike.' },
  'La Cite de la Peur': { fr: 'Festival de Cannes, slasher comique et meta-cinema instable.', en: 'Cannes festival, comedy slasher, and unstable meta-cinema.' },
  'Le Cinquieme Element': { fr: 'Langage elementaire, opera cosmique et protection de la vie.', en: 'Elemental language, cosmic opera, and protection of life.' },
  M3GAN: { fr: 'Robotique domestique, attachement toxique et protocole de controle.', en: 'Domestic robotics, toxic attachment, and control protocol.' },
  'Mars Attacks': { fr: 'Invasion pulp, rayon martien et inversion sonore ridicule mais efficace.', en: 'Pulp invasion, Martian ray, and ridiculous but effective sonic reversal.' },
  'Meet the Feebles': { fr: 'Marionnettes corrompues, backstage sale et satire de spectacle.', en: 'Corrupted puppets, dirty backstage, and showbiz satire.' },
  Onechanbara: { fr: 'Katana, brouillard de sang et chasse zombie stylisee.', en: 'Katana, blood mist, and stylized zombie hunting.' },
  Pingu: { fr: 'Chaos arctique, economie du poisson et logique noot-noot.', en: 'Arctic chaos, fish economy, and noot-noot logic.' }
};

const normalizeKey = (value) => String(value || '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/gi, ' ')
  .trim()
  .toLowerCase();

const getUniverseProtocol = (universe) => {
  const direct = universeProtocols[universe];
  if (direct) return direct;
  const normalizedUniverse = normalizeKey(universe);
  const match = Object.entries(universeProtocols).find(([key]) => normalizeKey(key) === normalizedUniverse);
  return match?.[1] || {
    fr: `Regles locales de ${universe}: symboles, posture, arme signature et menace principale.`,
    en: `${universe} local laws: symbols, posture, signature weapon, and primary threat.`
  };
};

const getMediaTypeFromUniverse = (universe) => {
  if (/vocaloid|rammstein|system of a down|rob zombie|daft punk|oliver tree|linkin park|michael jackson|die antwoord/i.test(universe)) return 'music';
  if (/anime|manga|gunnm|dandadan|death note|negima|another|tanya|overlord|spy x family|rosario|uzumaki|cells at work|attack on titan/i.test(universe)) return 'manga';
  if (/series|hotel|circus|pingu|noob|camera cafe|malcolm|defiance|scp/i.test(universe)) return 'series';
  if (/gear|halo|portal|payday|unreal|digimon|saw|onechanbara|house of the dead/i.test(universe)) return 'game';
  return 'movie';
};

const buildClearance = (hero) => {
  const universeCode = String(hero.universe || 'ARC')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .slice(0, 4)
    .toUpperCase() || 'ARC';
  const heroCode = String(hero.id || hero.name || 'unit')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]/g, '')
    .slice(0, 4)
    .toUpperCase() || 'UNIT';
  return `${universeCode}-${heroCode}`;
};

const enrichPlaque = (hero, plaque) => {
  const category = roleByCategory[hero.category] || roleByCategory.tactical;
  const mediaType = getMediaTypeFromUniverse(hero.universe);
  const mediaLine = mediaProfiles[mediaType] || mediaProfiles.web;
  const universeLine = getUniverseProtocol(hero.universe);
  const weapon = hero.weaponType || hero.simple?.name || 'signature';
  const special = hero.special?.name || hero.secondary?.name || weapon;
  return {
    ...plaque,
    rank: plaque.rank || category.rank,
    role: plaque.role || category.role,
    protocol: plaque.protocol || {
      fr: `${category.protocol.fr} ${universeLine.fr}`,
      en: `${category.protocol.en} ${universeLine.en}`
    },
    threat: plaque.threat || {
      fr: `Risque A.R.C.A.: si ${hero.name} perd son ancrage, la Trame ${hero.universe} peut vider sa signature de toute memoire stable.`,
      en: `A.R.C.A. risk: if ${hero.name} loses anchoring, the ${hero.universe} Thread can reduce the signature to a hollow reference without memory.`
    },
    resonance: plaque.resonance || {
      fr: `Resonance: ${weapon} / ${special}. ${mediaLine.fr}`,
      en: `Resonance: ${weapon} / ${special}. ${mediaLine.en}`
    },
    tags: Array.from(new Set([...(plaque.tags || []), hero.universe, hero.category, weapon].filter(Boolean))).slice(0, 6)
  };
};

export const getCharacterPlaque = (hero) => {
  if (CHARACTER_PLAQUES[hero.id]) return enrichPlaque(hero, CHARACTER_PLAQUES[hero.id]);
  const category = roleByCategory[hero.category] || roleByCategory.tactical;
  const doctrine = hero.special?.name || hero.weaponType || 'signature inconnue';
  const signature = getUniverseSignature(hero.universe, LORE_DB[hero.universe]);
  return enrichPlaque(hero, {
    clearance: buildClearance(hero),
    rank: category.rank,
    role: category.role,
    callSign: hero.name,
    origin: { fr: `Trame d origine - ${hero.universe}`, en: `Origin Thread - ${hero.universe}` },
    dossier: {
      fr: `${hero.name} est classe comme signature ${hero.category} de la Trame ${hero.universe}. Signature source: ${signature.theme}. A.R.C.A. relie son arme, sa posture et sa doctrine a ${signature.stageName}, afin que le personnage reste reconnaissable meme face au noyau ${signature.worldBoss || signature.bossName}.`,
      en: `${hero.name} is classified as a ${hero.category} signature from the ${hero.universe} Thread. Source signature: ${signature.theme}. A.R.C.A. ties weapon, posture, and doctrine to ${signature.stageName}, so the character remains recognizable even against the ${signature.worldBoss || signature.bossName} core.`
    },
    doctrine: {
      fr: `${doctrine}. Stabilisation de ${signature.stageName}, rupture de pattern, recuperation d Eclats d Origine et protection des archives ${hero.universe}.`,
      en: `${doctrine}. Stabilization of ${signature.stageName}, pattern rupture, recovery of Origin Shards, and protection of ${hero.universe} archives.`
    },
    tags: [hero.universe, hero.category, hero.weaponType || 'combat']
  });
};
