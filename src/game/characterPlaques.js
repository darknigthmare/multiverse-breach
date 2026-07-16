import { LORE_DB } from './lore';
import { getUniverseSignature } from './loreDescriptions';
import { FEATURED_CHARACTER_PLAQUES } from './featuredUniversePacks';

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
  arca_bastion: {
    clearance: 'ARC-BSTN',
    rank: { fr: 'Gardien du Premier Rempart', en: 'First Bulwark Guardian' },
    role: { fr: 'Protection lourde et controle de passage', en: 'Heavy protection and passage control' },
    callSign: 'Bastion',
    origin: { fr: 'Nexus de Convergence - Atrium avant la Premiere Breche', en: 'Nexus of Convergence - Atrium before the First Breach' },
    dossier: {
      fr: 'Bastion Korr commandait les equipes de securite de l Atrium quand Veyr ouvrit le premier reseau de passages. Il ne vient donc d aucune franchise annexe: son monde d origine est la Cite-Mosaique avant qu elle porte ce nom, lorsque chaque porte exigeait encore une cause, un registre et une personne responsable de sa fermeture. Pendant la Premiere Breche, Bastion maintint le Rempart Est assez longtemps pour evacuer neuf cellules, mais accepta de condamner une dixieme route dont A.R.C.A. effaca ensuite les noms. Depuis, son bouclier hexagonal n est pas un symbole d invulnerabilite; c est la preuve visible de chaque direction qu il choisit de proteger au prix des autres.',
      en: 'Bastion Korr commanded Atrium security teams when Veyr opened the first passage network. He therefore comes from no side franchise: his origin world is Mosaic City before it carried that name, when every door still required a cause, a record, and someone responsible for closing it. During the First Breach, Bastion held the East Bulwark long enough to evacuate nine cells, but agreed to condemn a tenth route whose names A.R.C.A. later erased. His hexagonal shield is not a symbol of invulnerability; it is visible proof of every direction he chooses to protect at the expense of another.'
    },
    doctrine: {
      fr: 'Dans la cellule ZERO, Bastion transforme la culpabilite en geometrie tactique: Rafale Atrium pour fixer une menace, Balise Barricade pour definir une route sure, Rempart d Ancre pour absorber une suppression et Verrou de Convergence pour condamner un passage mensonger. La Cour des faux passages lui offre une Cite parfaite ou personne n est mort sous son commandement. Il la refuse parce que cette victoire ignore les noms des sauves. Son arc Breach consiste a tenir une ligne reelle, imparfaite et partagee plutot qu a devenir le gardien solitaire d un monde invente pour le pardonner.',
      en: 'Within Cell ZERO, Bastion turns guilt into tactical geometry: Atrium Burst pins a threat, Barricade Beacon defines a safe route, Anchor Bulwark absorbs deletion, and Convergence Lock seals a deceptive passage. The Court of False Passages offers him a perfect City where nobody died under his command. He refuses it because that victory does not know the names of those it claims he saved. His Breach arc is about holding a real, imperfect, shared line instead of becoming the lone guardian of a world invented to forgive him.'
    },
    threat: {
      fr: 'Risque A.R.C.A.: les portails de regret peuvent convertir son instinct de protection en immobilisme et forcer toute la cellule a defendre une position deja perdue.',
      en: 'A.R.C.A. risk: regret portals can turn his protective instinct into paralysis and force the whole cell to defend a position already lost.'
    },
    tags: ['Nexus', 'A.R.C.A.', 'Rempart', 'Portails', 'Tactical']
  },
  arca_nova: {
    clearance: 'ARC-NOVA',
    rank: { fr: 'Analyste des possibles', en: 'Possibility Analyst' },
    role: { fr: 'Lecture de Trame et stabilisation mobile', en: 'Thread reading and mobile stabilization' },
    callSign: 'Nova',
    origin: { fr: 'Nexus de Convergence - Observatoire Veyr avant la Premiere Breche', en: 'Nexus of Convergence - Veyr Observatory before the First Breach' },
    dossier: {
      fr: 'Nova Vey grandit dans l Observatoire Veyr, une institution chargee de comparer les consequences probables avant l ouverture d un passage. Son monocle cyan ne predit pas l avenir: il superpose les routes qui possedent encore une cause mesurable. La nuit de la Premiere Breche, Nova detecta trente-deux issues plausibles et recommanda celle qui sauvait le plus grand nombre. Cette route mena pourtant a la disparition du secteur dont A.R.C.A. effaca ensuite le registre. Depuis, elle refuse de confondre probabilite et justice. Son baton bifurque est un diapason de resonance qui interroge une Trame sans lui imposer une reponse.',
      en: 'Nova Vey grew up in Veyr Observatory, an institution tasked with comparing probable consequences before a passage was opened. Her cyan monocle does not predict the future: it overlays routes that still possess a measurable cause. On the night of the First Breach, Nova detected thirty-two plausible exits and recommended the one that saved the greatest number. That route nevertheless led to the disappearance of the sector A.R.C.A. later erased from its ledger. Since then, she refuses to confuse probability with justice. Her forked staff is a resonance tuner that questions a Thread without forcing an answer upon it.'
    },
    breachLore: {
      fr: 'Dans la cellule ZERO, Nova lit les failles comme des choix encore ouverts. Ping de Trame revele une faiblesse causale, Surcadence A.R.C.A. synchronise les allies, Reflexe d Ancre traverse une prediction hostile et Reboot de Faille rend au terrain sa derniere version stable. Dans la Fonderie des Eclats d Origine, le Sans-Auteur lui offre une machine parfaite ou chaque perte peut etre evitee en supprimant les decisions imprevisibles. Nova la refuse: une Trame sans risque n est plus une histoire vecue, seulement un calcul ferme. Son arc consiste a fournir des options a l Ancre sans jamais choisir a sa place.',
      en: 'Within Cell ZERO, Nova reads breaches as choices that remain open. Thread Ping reveals a causal weakness, A.R.C.A. Overclock synchronizes allies, Anchor Reflex crosses a hostile prediction, and Breach Reboot restores the terrain last stable version. In the Origin Shard Foundry, the Authorless offers her a perfect machine where every loss can be avoided by deleting unpredictable decisions. Nova refuses it: a Thread without risk is no longer a lived story, only a closed calculation. Her arc is about giving the Anchor options without ever choosing in their place.'
    },
    doctrine: { fr: 'Monocle de lecture, diapason de resonance, scan causal, surcadence de cellule, reboot local.', en: 'Reading monocle, resonance tuner, causal scan, cell overclock, local reboot.' },
    threat: { fr: 'Risque A.R.C.A.: une surcharge de futurs possibles peut la figer dans l analyse ou lui faire traiter un sacrifice humain comme une simple valeur optimale.', en: 'A.R.C.A. risk: too many possible futures can trap her in analysis or make her treat a human sacrifice as a merely optimal value.' },
    tags: ['Nexus', 'A.R.C.A.', 'Possibles', 'Scan', 'Hacker']
  },
  arca_marrow: {
    clearance: 'ARC-MRW',
    rank: { fr: 'Chasseur de sceaux', en: 'Seal Hunter' },
    role: { fr: 'Execution de paradoxes et rupture de doubles', en: 'Paradox execution and duplicate breaking' },
    callSign: 'Marrow',
    origin: { fr: 'Nexus de Convergence - Patrouilles exterieures du Rempart', en: 'Nexus of Convergence - Outer Bulwark patrols' },
    dossier: {
      fr: 'Marrow Kade appartenait aux patrouilles qui coupaient les passages devenus irreversibles avant la fondation officielle d A.R.C.A. Sa lame de fracture est forgee avec les bords refroidis de trois portails condamnes; elle ne tranche correctement que ce qui possede deux continuations incompatibles. La cicatrice de son visage vient de sa premiere erreur: il attaqua une copie parfaite d un coequipier avant de comprendre que l original et le double partageaient encore la meme memoire. Il sauva l original, mais condamna la copie consciente. Marrow porte depuis le poids de cette distinction et refuse toute execution fondee sur une simple ressemblance.',
      en: 'Marrow Kade served among the patrols that severed irreversible passages before A.R.C.A. was formally founded. His fracture blade is forged from the cooled edges of three condemned portals; it cuts cleanly only through something holding two incompatible continuations. The scar on his face came from his first mistake: he attacked a perfect copy of a teammate before realizing original and duplicate still shared the same memory. He saved the original but condemned the conscious copy. Marrow has carried the weight of that distinction ever since and refuses any execution based on resemblance alone.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Marrow intervient quand une anomalie a deja appris a porter un nom. Coupe-Sceau rompt ses protections, Entaille de Breche ouvre une ligne dans sa causalite, Pas Entre Deux esquive par une route condamnee et Execution de Paradoxe force deux versions incompatibles a declarer laquelle choisit de continuer. A la Fonderie, son double ideal ne possede ni cicatrice ni dette et lui promet une vie ou aucune copie n a souffert. Marrow le detruit seulement apres que le double revendique le droit de remplacer tous les autres. Son arc ne consiste pas a tuer les faux, mais a proteger le droit de chaque conscience a prouver ce qu elle est devenue.',
      en: 'In Multiverse Breach, Marrow intervenes once an anomaly has learned to wear a name. Seal Cut breaks its protections, Breach Gash opens a line through its causality, Step Between Two dodges along a condemned route, and Paradox Execution forces incompatible versions to declare which one chooses to continue. At the Foundry, his ideal double bears neither scar nor debt and promises a life where no copy suffered. Marrow destroys it only after the double claims the right to replace everyone else. His arc is not about killing what is false, but protecting every consciousness right to prove what it has become.'
    },
    doctrine: { fr: 'Lame de fracture, lecture de sceau, pas de phase, duel de double, execution conditionnelle.', en: 'Fracture blade, seal reading, phase step, duplicate duel, conditional execution.' },
    threat: { fr: 'Risque A.R.C.A.: le Sans-Auteur peut falsifier une signature de remplacement et retourner son instinct d execution contre une version innocente.', en: 'A.R.C.A. risk: the Authorless can forge a replacement signature and turn his execution instinct against an innocent version.' },
    tags: ['Nexus', 'A.R.C.A.', 'Paradoxe', 'Fracture', 'Slayer']
  },
  arca_sable: {
    clearance: 'ARC-SBL',
    rank: { fr: 'Cartographe des routes assumees', en: 'Cartographer of Accountable Routes' },
    role: { fr: 'Reconnaissance, balisage et preuve de terrain', en: 'Reconnaissance, marking, and field evidence' },
    callSign: 'Sable',
    origin: { fr: 'Nexus de Convergence - Corps des Cartographes de l Atrium', en: 'Nexus of Convergence - Atrium Cartographer Corps' },
    dossier: {
      fr: 'Avant A.R.C.A., Sable Orison parcourait les marges de l Atrium pour dessiner les passages qui apparaissaient plus vite que les institutions ne pouvaient les nommer. Son chapeau, sa longue-vue et son manteau sable ne sont pas un uniforme ceremonial: ils viennent des semaines passees dans des secteurs ou la lumiere, la gravite et les distances changeaient apres chaque ouverture. Sable signait chaque carte avec les noms de ceux qui avaient mesure la route. Lors de la Premiere Breche, ses releves prouverent qu une dixieme voie d evacuation avait existe, mais le Registre noir absorba ses coordonnees et transforma ses temoins en erreurs administratives.',
      en: 'Before A.R.C.A., Sable Orison crossed the Atrium margins to chart passages appearing faster than institutions could name them. Her hat, scope, and sand-colored coat are not ceremonial uniform: they come from weeks spent in sectors where light, gravity, and distance changed after every opening. Sable signed each map with the names of those who measured the route. During the First Breach, her surveys proved a tenth evacuation route had existed, but the Black Ledger absorbed its coordinates and turned its witnesses into administrative errors.'
    },
    breachLore: {
      fr: 'Dans la cellule ZERO, Sable refuse les cartes qui pretendent etre neutres. Tir de Balise fixe une coordonnee dans le combat, Mine de Lecture enregistre ce qui la traverse, Couverture Archivee restaure un abri prouve et Barrage du Cartographe transforme ses releves en corridor de tir. Dans le Registre des absents, elle decouvre que ses propres cartes avaient servi a choisir le secteur sacrifie. Elle ne detruit pas A.R.C.A.: elle force l organisation a publier la dette, les criteres et les noms. Son arc Breach affirme qu une route sure n est pas celle qui cache son cout, mais celle dont quelqu un accepte de repondre.',
      en: 'Within Cell ZERO, Sable rejects maps that pretend to be neutral. Beacon Shot fixes a coordinate in battle, Reading Mine records what crosses it, Archived Cover restores a proven shelter, and Cartographer Barrage turns her surveys into a firing corridor. In the Ledger of the Absent, she discovers her own maps were used to choose the sacrificed sector. She does not destroy A.R.C.A.; she forces the organization to publish the debt, the criteria, and the names. Her Breach arc states that a safe route is not one hiding its cost, but one someone accepts responsibility for.'
    },
    doctrine: { fr: 'Longue-vue causale, fusil de balise, carte vivante, mine de lecture, corridor cartographie.', en: 'Causal scope, beacon rifle, living map, reading mine, mapped firing corridor.' },
    threat: { fr: 'Risque A.R.C.A.: une carte falsifiee peut retourner son besoin de preuve contre elle et lui faire defendre une coordonnee qui n a jamais existe.', en: 'A.R.C.A. risk: a forged map can turn her need for evidence against her and make her defend a coordinate that never existed.' },
    tags: ['Nexus', 'A.R.C.A.', 'Cartographie', 'Registre noir', 'Tactical']
  },
  arca_loom: {
    clearance: 'ARC-LOOM',
    rank: { fr: 'Tisseuse de lignes de vie', en: 'Lifeline Weaver' },
    role: { fr: 'Extraction, soin de Trame et verification d issue', en: 'Extraction, Thread repair, and exit verification' },
    callSign: 'Loom',
    origin: { fr: 'Nexus de Convergence - Service de recuperation des Marges', en: 'Nexus of Convergence - Margin Recovery Service' },
    dossier: {
      fr: 'Loom Ivara appartenait aux equipes qui entraient dans une route apres les cartographes et avant les archivistes. Elle retrouvait les blesses, posait des plaques resonantes sur les structures instables et maintenait un fil de retour avec son drone de suture. Pendant la Premiere Breche, Loom suivit ce fil jusqu a la dixieme route condamnee. Le signal revint sans les personnes qu il devait guider, charge de voix dont les dossiers n existaient deja plus. Elle conserva clandestinement ces voix dans le noyau cyan de son drone, faisant de son outil medical une archive vivante que le Sans-Auteur ne parvient pas a classer.',
      en: 'Loom Ivara served on teams entering a route after the cartographers and before the archivists. She recovered the wounded, placed resonance plates on unstable structures, and maintained a return thread through her suture drone. During the First Breach, Loom followed that thread into the condemned tenth route. The signal returned without the people it was meant to guide, carrying voices whose records had already ceased to exist. She secretly preserved those voices in her drone cyan core, turning a medical tool into a living archive the Authorless cannot classify.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Loom juge une issue par ce qu elle peut ramener, jamais par la perfection du monde qu elle montre. Rafale d Origine repousse ce qui coupe le fil, Drone de Suture maintient un allie lisible, Plaque Resonante empeche une suppression et Ligne de Vie Nexus retisse les signatures d une cellule entiere. Dans la Cour des faux passages, elle detecte que les refuges parfaits ne possedent aucun signal de retour: ils savent attirer, mais pas rendre. Son arc consiste a accepter que sauver une personne ne restaure pas toujours son monde, puis a garantir qu aucune extraction reelle ne soit effacee pour simplifier le rapport.',
      en: 'In Multiverse Breach, Loom judges an exit by what it can bring back, never by the perfection of the world it displays. Origin Burst pushes away what cuts the thread, Suture Drone keeps an ally readable, Resonance Plate prevents deletion, and Nexus Lifeline reweaves an entire cell signatures. In the Court of False Passages, she detects that perfect refuges have no return signal: they know how to attract, but not how to release. Her arc is about accepting that saving a person does not always restore their world, then ensuring no real extraction is erased to simplify a report.'
    },
    doctrine: { fr: 'Drone de suture, plaque resonante, fil de retour, soin de signature, extraction sous effacement.', en: 'Suture drone, resonance plate, return thread, signature repair, extraction under deletion.' },
    threat: { fr: 'Risque A.R.C.A.: les voix conservees dans son drone peuvent etre imitees pour l attirer dans une route sans retour ou saturer ses priorites de sauvetage.', en: 'A.R.C.A. risk: the voices stored in her drone can be imitated to draw her into a route without return or overload her rescue priorities.' },
    tags: ['Nexus', 'A.R.C.A.', 'Extraction', 'Suture', 'Marine']
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
    origin: { fr: 'Univers Dino Crisis - Ibis Island / Third Energy / SORT', en: 'Dino Crisis universe - Ibis Island / Third Energy / SORT' },
    dossier: {
      fr: 'Dans sa Trame d origine, Regina est une operatrice SORT envoyee sur Ibis Island pour recuperer le docteur Kirk et comprendre les recherches Third Energy. Elle decouvre une installation militaire ou l energie experimentale a arrache des predateurs prehistoriques a leur temps: Velociraptors dans les couloirs, Pteranodons au-dessus des zones ouvertes, T-Rex impossible a ignorer, systemes de securite verrouilles et decisions de mission qui opposent objectif, extraction et survie. Regina represente Dino Crisis dans sa forme nerveuse: infiltration, munitions comptees, key cards, pansements hemostatiques, poursuites de dinosaures et sang-froid tactique.',
      en: 'In her origin Thread, Regina is a SORT operative sent to Ibis Island to recover Dr. Kirk and understand Third Energy research. She discovers a military facility where experimental energy has torn prehistoric predators out of time: Velociraptors in corridors, Pteranodons above open areas, a T-Rex impossible to ignore, locked security systems, and mission decisions that oppose objective, extraction, and survival. Regina represents Dino Crisis at its sharpest: infiltration, counted ammunition, key cards, hemostatic patches, dinosaur chases, and tactical composure.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Regina comprend vite que la Breche Third Energy n est pas seulement un portail temporel: c est une erreur scientifique qui peut importer des ecologies entieres dans le Nexus. A.R.C.A. l emploie pour cartographier les laboratoires instables, separer les specimens prehistoriques des civils, neutraliser les batteries Third Energy et empecher le Sans-Auteur de transformer chaque mission en parc de chasse. Son objectif Breach reste Dino Crisis: extraire la preuve, survivre au predateur et fermer le systeme avant que le T-Rex ne devienne une constante multivers.',
      en: 'In Multiverse Breach, Regina quickly understands a Third Energy breach is not only a time portal: it is a scientific error able to import entire ecologies into the Nexus. A.R.C.A. uses her to map unstable labs, separate prehistoric specimens from civilians, neutralize Third Energy batteries, and prevent the Authorless from turning every mission into a hunting park. Her Breach objective remains Dino Crisis: extract proof, survive the predator, and shut the system down before the T-Rex becomes a multiverse constant.'
    },
    doctrine: { fr: 'Glock, darts anesthesiants, key cards, patch hemostatique, leurre anti-raptor, extraction SORT.', en: 'Glock, tranquilizer darts, key cards, hemostatic patch, anti-raptor lure, SORT extraction.' },
    tags: ['SORT', 'Third Energy', 'Ibis Island', 'Raptor', 'T-Rex', 'Extraction']
  },
  dylan: {
    clearance: 'DC-ED2',
    rank: { fr: 'Soldat TRAT', en: 'TRAT Soldier' },
    role: { fr: 'Assaut de survie et protection de civils', en: 'Survival assault and civilian protection' },
    callSign: 'Morton',
    origin: { fr: 'Univers Dino Crisis 2 - Edward City / jungle temporelle', en: 'Dino Crisis 2 universe - Edward City / temporal jungle' },
    dossier: {
      fr: 'Dans sa Trame d origine, Dylan Morton est envoye avec TRAT apres la disparition d Edward City dans une derive Third Energy. Contrairement a Ibis Island, la crise devient plus large: jungle prehistorique, base militaire, dinosaures en masse, survivants perdus, machines temporelles et une tragedie familiale liee a Paula. Dylan represente le Dino Crisis plus frontal: armes lourdes, progression sous pression, sauvetage, culpabilite de soldat et refus de laisser les civils devenir dommages collateraux d une experience.',
      en: 'In his origin Thread, Dylan Morton is deployed with TRAT after Edward City disappears in a Third Energy drift. Unlike Ibis Island, the crisis becomes wider: prehistoric jungle, military base, dinosaur swarms, lost survivors, time machines, and a family tragedy tied to Paula. Dylan represents the more frontal Dino Crisis: heavy weapons, pressure advance, rescue, soldier guilt, and refusal to let civilians become collateral damage of an experiment.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Dylan sert a contenir les zones ou la Third Energy n importe plus un specimen, mais un champ de bataille entier. A.R.C.A. l envoie quand une faille Dino Crisis genere trop de menaces mobiles pour une simple extraction: couvrir les routes, escorter les survivants indexes, detruire les nids de raptors et empecher le Sans-Auteur de reecrire Edward City comme une arene infinie. Sa faille personnelle est liee a Paula: sauver une trace future sans casser le present.',
      en: 'In Multiverse Breach, Dylan contains zones where Third Energy no longer imports one specimen, but an entire battlefield. A.R.C.A. sends him when a Dino Crisis rift generates too many mobile threats for simple extraction: cover routes, escort indexed survivors, destroy raptor nests, and prevent the Authorless from rewriting Edward City as an infinite arena. His personal breach is tied to Paula: save a future trace without breaking the present.'
    },
    doctrine: { fr: 'Fusil d assaut, shotgun, grenades, couverture TRAT, extraction de survivants.', en: 'Assault rifle, shotgun, grenades, TRAT cover, survivor extraction.' },
    tags: ['Dino Crisis 2', 'TRAT', 'Edward City', 'Paula', 'Survival Assault']
  },
  rick_dc: {
    clearance: 'DC-SORT-R',
    rank: { fr: 'Technicien SORT', en: 'SORT Technician' },
    role: { fr: 'Piratage de laboratoire et routes de securite', en: 'Lab hacking and security routes' },
    callSign: 'Rick',
    origin: { fr: 'Univers Dino Crisis - SORT / systemes Ibis Island', en: 'Dino Crisis universe - SORT / Ibis Island systems' },
    dossier: {
      fr: 'Dans sa Trame d origine, Rick est le specialiste technique de l equipe SORT. Moins spectaculaire que Regina en combat, il maintient la mission vivante en lisant les systemes, en ouvrant les portes, en detournant les securites et en comprenant comment les experiences de Kirk ont transforme Ibis Island en piege temporel. Rick incarne la partie Dino Crisis des claviers, des codes, des fichiers de laboratoire et des decisions de support qui evitent qu une poursuite de raptor devienne une impasse.',
      en: 'In his origin Thread, Rick is SORT technical specialist. Less spectacular than Regina in combat, he keeps the mission alive by reading systems, opening doors, bypassing security, and understanding how Kirk experiments turned Ibis Island into a temporal trap. Rick embodies Dino Crisis keyboards, codes, lab files, and support decisions that prevent a raptor chase from becoming a dead end.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Rick devient l interprete technique des anomalies Third Energy. A.R.C.A. l utilise pour fermer les portes temporelles dans le bon ordre, eviter que les key cards deviennent des boucles absurdes et transformer les fichiers de Kirk en contre-mesures exploitables. Quand le Sans-Auteur essaye de recoder Dino Crisis en simple horde de dinosaures, Rick rappelle que le vrai danger vient du laboratoire qui a cru pouvoir mesurer le temps sans payer le prix.',
      en: 'In Multiverse Breach, Rick becomes the technical interpreter of Third Energy anomalies. A.R.C.A. uses him to close temporal doors in the right order, prevent key cards from becoming absurd loops, and turn Kirk files into usable countermeasures. When the Authorless tries to recode Dino Crisis as a simple dinosaur horde, Rick reminds the Nexus that the real danger comes from a lab that believed it could measure time without paying the price.'
    },
    doctrine: { fr: 'Piratage SORT, key cards, detournement de tourelles, verrouillage Third Energy.', en: 'SORT hacking, key cards, turret bypass, Third Energy lockout.' },
    tags: ['SORT', 'Hack', 'Key Card', 'Third Energy', 'Support']
  },
  neo: {
    clearance: 'ZION-01',
    rank: { fr: 'Anomalie systeme', en: 'System Anomaly' },
    role: { fr: 'Alteration de realite', en: 'Reality alteration' },
    callSign: 'The One',
    origin: { fr: 'Univers The Matrix - simulation des Machines / Zion / Nebuchadnezzar', en: 'The Matrix universe - Machine simulation / Zion / Nebuchadnezzar' },
    dossier: {
      fr: 'Dans sa Trame d origine, Thomas Anderson est un programmeur piege dans une realite simulee par les Machines, jusqu a ce que Morpheus, Trinity et l equipage du Nebuchadnezzar lui revelent la Matrice. Devenu Neo, il apprend que le monde visible est un code de controle, que les Agents maintiennent la prison, que Zion survit sous terre et que le choix rouge/bleu n est pas un symbole abstrait: c est accepter une verite douloureuse contre une paix fabriquee. Neo represente Matrix comme anomalie vivante: bullet time, arts martiaux telecharges, lecture du code, refus du destin impose par l Architecte et capacite a modifier les regles de la simulation.',
      en: 'In his origin Thread, Thomas Anderson is a programmer trapped inside a reality simulated by the Machines, until Morpheus, Trinity, and the Nebuchadnezzar crew reveal the Matrix to him. As Neo, he learns the visible world is control code, Agents maintain the prison, Zion survives underground, and the red/blue choice is not abstract symbolism: it is accepting painful truth over manufactured peace. Neo represents Matrix as a living anomaly: bullet time, downloaded martial arts, code reading, refusal of destiny imposed by the Architect, and ability to bend simulation rules.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Neo est l un des rares heros capables de voir quand une faille n est pas un lieu, mais une permission volee. A.R.C.A. l emploie contre les zones ou le Sans-Auteur remplace les mondes par des scripts de controle: missions qui se repetent, ennemis qui respawnent comme Agents, recompenses qui servent a endormir le joueur. Son danger est immense, car s il reecrit trop fort la Breche, il peut casser le libre arbitre qu il veut sauver. Son objectif Breach est donc precis: ouvrir une sortie, montrer le code, laisser le choix au joueur.',
      en: 'In Multiverse Breach, Neo is one of the few heroes able to see when a rift is not a place, but stolen permission. A.R.C.A. uses him against zones where the Authorless replaces worlds with control scripts: repeating missions, enemies respawning like Agents, rewards designed to sedate the player. His danger is immense, because rewriting the Breach too strongly could break the free will he wants to save. His Breach objective is precise: open an exit, reveal the code, leave the choice to the player.'
    },
    doctrine: { fr: 'Bullet time, kung-fu charge, lecture du code vert, arret de balles, choix Source.', en: 'Bullet time, loaded kung fu, green code reading, bullet stop, Source choice.' },
    tags: ['Matrix', 'Zion', 'The One', 'Agents', 'Source', 'Choice']
  },
  trinity: {
    clearance: 'ZION-02',
    rank: { fr: 'Operatrice Nebuchadnezzar', en: 'Nebuchadnezzar Operator' },
    role: { fr: 'Infiltration, extraction et foi active', en: 'Infiltration, extraction, and active faith' },
    callSign: 'Trinity',
    origin: { fr: 'Univers The Matrix - resistance de Zion / Nebuchadnezzar', en: 'The Matrix universe - Zion resistance / Nebuchadnezzar' },
    dossier: {
      fr: 'Dans sa Trame d origine, Trinity est une combattante centrale de la resistance humaine contre la Matrice. Elle n est pas seulement la personne qui trouve Neo: elle est l operatrice capable d entrer dans le systeme, de voler une issue, de tenir une poursuite sur les toits ou en moto et de croire au choix quand le code affirme que tout est deja ecrit. Son lore Matrix est celui de l extraction sous pression: telephones de sortie, piratage, armes cachees, sauts impossibles et confiance dans un humain que le systeme classe comme impossible.',
      en: 'In her origin Thread, Trinity is a central fighter of the human resistance against the Matrix. She is not only the one who finds Neo: she is the operator able to enter the system, steal an exit, hold a rooftop or motorcycle chase, and believe in choice when the code claims everything is already written. Her Matrix lore is pressure extraction: exit phones, hacking, hidden weapons, impossible jumps, and trust in a human the system classifies as impossible.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Trinity devient la specialiste des sorties impossibles. A.R.C.A. l envoie dans les failles ou le Sans-Auteur ferme les menus, brouille les objectifs ou supprime les routes de retraite. Elle ne reecrit pas le monde comme Neo: elle trouve la ligne praticable, protege l Ancre, ouvre le telephone de sortie et force le systeme a admettre qu une extraction existe encore. Sa presence garde Matrix humain: le code est important, mais quelqu un doit ramener les corps hors de la simulation.',
      en: 'In Multiverse Breach, Trinity becomes the specialist of impossible exits. A.R.C.A. sends her into rifts where the Authorless closes menus, blurs objectives, or deletes retreat routes. She does not rewrite the world like Neo: she finds the usable line, protects the Anchor, opens the exit phone, and forces the system to admit extraction still exists. Her presence keeps Matrix human: code matters, but someone must bring bodies out of the simulation.'
    },
    doctrine: { fr: 'Dual pistols, piratage d acces, course murale, moto d extraction, telephone de sortie.', en: 'Dual pistols, access hack, wall run, extraction motorcycle, exit phone.' },
    tags: ['Matrix', 'Trinity', 'Zion', 'Extraction', 'Hack']
  },
  morpheus: {
    clearance: 'ZION-03',
    rank: { fr: 'Capitaine du Nebuchadnezzar', en: 'Captain of the Nebuchadnezzar' },
    role: { fr: 'Commandement, revelation et discipline du choix', en: 'Command, revelation, and discipline of choice' },
    callSign: 'Morpheus',
    origin: { fr: 'Univers The Matrix - Zion / Prophecy / Nebuchadnezzar', en: 'The Matrix universe - Zion / Prophecy / Nebuchadnezzar' },
    dossier: {
      fr: 'Dans sa Trame d origine, Morpheus est le capitaine du Nebuchadnezzar et l un des plus fervents croyants dans la prophetie de l Elu. Il recrute les esprits libres, explique la Matrice, propose la pilule rouge, entraine Neo et tient une ligne morale que les Machines ne comprennent pas: un humain doit choisir la verite, pas seulement etre debranche. Morpheus represente Matrix comme transmission: dojo charge, enseignement du saut, foi risquee, combat contre les Agents et responsabilite envers Zion.',
      en: 'In his origin Thread, Morpheus is captain of the Nebuchadnezzar and one of the strongest believers in the prophecy of the One. He recruits free minds, explains the Matrix, offers the red pill, trains Neo, and holds a moral line the Machines do not understand: a human must choose truth, not merely be unplugged. Morpheus represents Matrix as transmission: loaded dojo, jump teaching, risky faith, combat against Agents, and responsibility toward Zion.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Morpheus sert de guide in-lore pour les failles de controle. A.R.C.A. l utilise quand une mission doit expliquer ses regles sans casser l immersion: il ne dit pas "tutoriel", il propose une pilule rouge, un entrainement charge, une sortie de simulation. Son arc Breach vise a empecher le Sans-Auteur de transformer la prophetie en script obligatoire. Morpheus croit, mais il sait que croire ne vaut rien si le joueur n a plus le droit de choisir.',
      en: 'In Multiverse Breach, Morpheus acts as an in-lore guide for control rifts. A.R.C.A. uses him when a mission must explain its rules without breaking immersion: he does not say "tutorial", he offers a red pill, a loaded training program, a simulation exit. His Breach arc prevents the Authorless from turning prophecy into mandatory script. Morpheus believes, but he knows belief means nothing if the player is no longer allowed to choose.'
    },
    doctrine: { fr: 'Pilule rouge, dojo charge, katana, commandement Nebuchadnezzar, extraction de Zion.', en: 'Red pill, loaded dojo, katana, Nebuchadnezzar command, Zion extraction.' },
    tags: ['Matrix', 'Morpheus', 'Red Pill', 'Prophecy', 'Zion']
  },
  buckethead_avatar: {
    clearance: 'MUS-BH01',
    rank: { fr: 'Persona de Resonance masquee', en: 'Masked Resonance Persona' },
    role: { fr: 'Labyrinthe instrumental et piratage de tempo', en: 'Instrumental labyrinth and tempo hacking' },
    callSign: 'Buckethead',
    origin: { fr: 'Univers Buckethead - Bucketheadland / Pike Series / guitare instrumentale', en: 'Buckethead universe - Bucketheadland / Pike Series / instrumental guitar' },
    dossier: {
      fr: 'Dans sa Trame d origine, Buckethead est une figure de guitare instrumentale reconnaissable par son masque blanc, son bucket, sa virtuosite et un imaginaire surrealiste qui passe de Bucketheadland aux Pike albums, du shred technique aux pieces atmospheriques, du funk et metal experimental a des paysages sonores presque fantomatiques. Le personnage public fonctionne comme une presence silencieuse: peu de paroles, beaucoup de gestes, une identite sculptee par le son, le masque, le parc imaginaire et la vitesse des doigts.',
      en: 'In his origin Thread, Buckethead is an instrumental guitar figure recognizable through his white mask, bucket, virtuosity, and surreal imaginary world running from Bucketheadland to the Pike albums, from technical shred to atmospheric pieces, from experimental funk and metal to almost ghostly soundscapes. The public character works as a silent presence: few words, many gestures, an identity shaped by sound, mask, imaginary park, and finger speed.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, A.R.C.A. ne capture pas la personne civile: elle stabilise une Persona de Resonance nee de la scene, du masque et des labyrinthes instrumentaux. Bucketheadland devient une zone de Trame ou les riffs ouvrent des couloirs, ou les silences servent de portes et ou le Sans-Auteur tente de transformer la musique sans paroles en bruit blanc. Buckethead sert a reparer les failles de tempo: il ne parle pas a l escouade, il lui donne un chemin rythmique assez precis pour sortir vivant.',
      en: 'In Multiverse Breach, A.R.C.A. does not capture the private person: it stabilizes a Resonance Persona born from stage, mask, and instrumental labyrinths. Bucketheadland becomes a Thread zone where riffs open corridors, silences act as doors, and the Authorless tries to turn wordless music into white noise. Buckethead repairs tempo breaches: he does not speak to the squad, he gives it a rhythmic path precise enough to leave alive.'
    },
    doctrine: { fr: 'Shred, riffs Pike, masque blanc, bucket antenna, labyrinthe Bucketheadland, silence tactique.', en: 'Shred, Pike riffs, white mask, bucket antenna, Bucketheadland labyrinth, tactical silence.' },
    tags: ['Buckethead', 'Music', 'Bucketheadland', 'Pike', 'Guitar']
  },
  death_cube_k_echo: {
    clearance: 'MUS-BH02',
    rank: { fr: 'Echo sombre inverse', en: 'Dark inverted echo' },
    role: { fr: 'Drone ambient, peur sonore et contre-melodie', en: 'Ambient drone, sonic fear, and counter-melody' },
    callSign: 'Death Cube K',
    origin: { fr: 'Univers Buckethead - Death Cube K / ambient sombre', en: 'Buckethead universe - Death Cube K / dark ambient' },
    dossier: {
      fr: 'Dans la Trame musicale de Buckethead, Death Cube K fonctionne comme un reflet inverse: une forme plus sombre, lente et ambient, ou la virtuosite devient espace, menace et texture. Son monde d origine n est pas construit sur la demonstration, mais sur les nappes, la repetition, les ombres et les couloirs sonores qui donnent l impression qu un parc d attraction s est eteint mais continue de respirer.',
      en: 'In Buckethead musical Thread, Death Cube K works like an inverted reflection: a darker, slower, ambient form where virtuosity becomes space, threat, and texture. Its origin world is not built on display, but on drones, repetition, shadows, and sonic corridors that feel like an amusement park has gone dark but keeps breathing.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Death Cube K Echo est l alarme sombre de Bucketheadland. Quand le Sans-Auteur essaie d aplatir les riffs en boucles vides, cet echo ralentit la zone, revele les couloirs caches et transforme l angoisse sonore en protection. Il est dangereux si on l ecoute trop longtemps: la Trame peut devenir un drone sans sortie. Mais bien canalise, il donne a l escouade le temps exact pour esquiver une rupture.',
      en: 'In Multiverse Breach, Death Cube K Echo is Bucketheadland dark alarm. When the Authorless tries to flatten riffs into empty loops, this echo slows the zone, reveals hidden corridors, and turns sonic dread into protection. It is dangerous if heard too long: the Thread may become a drone without exit. Properly channeled, it gives the squad the exact time to dodge a rupture.'
    },
    doctrine: { fr: 'Drone sombre, contre-temps, ralentissement de faille, peur ambient.', en: 'Dark drone, off-beat timing, breach slowdown, ambient fear.' },
    tags: ['Buckethead', 'Death Cube K', 'Ambient', 'Shadow', 'Tempo']
  },
  pike_riff_signal: {
    clearance: 'MUS-BH03',
    rank: { fr: 'Signal de serie Pike', en: 'Pike Series Signal' },
    role: { fr: 'Assaut melodique et trajectoire de riff', en: 'Melodic assault and riff trajectory' },
    callSign: 'Pike Signal',
    origin: { fr: 'Univers Buckethead - Pike Series / archives instrumentales', en: 'Buckethead universe - Pike Series / instrumental archives' },
    dossier: {
      fr: 'La Pike Series represente l aspect prolifique et modulaire de Buckethead: albums courts, variations de ton, morceaux qui peuvent etre explosifs, etranges, melancoliques ou presque arcade. Pike Riff Signal condense cette logique en avatar de combat: chaque riff est une piste, chaque variation un embranchement, chaque solo une ouverture de route dans le labyrinthe.',
      en: 'The Pike Series represents Buckethead prolific modular side: short albums, tonal variations, tracks that can be explosive, strange, melancholic, or almost arcade-like. Pike Riff Signal condenses this logic into a combat avatar: each riff is a path, each variation a branch, each solo a route opening inside the labyrinth.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Pike Riff Signal sert a indexer les chemins de Bucketheadland. A.R.C.A. l utilise pour transformer une avalanche de pistes instrumentales en carte jouable: intro, montee, rupture, boss, sortie. Quand une faille musicale devient trop abstraite, ce signal redonne une structure sans casser le mystere. Il frappe vite, change de motif et laisse derriere lui une trace que les autres heros peuvent suivre.',
      en: 'In Multiverse Breach, Pike Riff Signal indexes Bucketheadland paths. A.R.C.A. uses it to turn an avalanche of instrumental tracks into a playable map: intro, rise, rupture, boss, exit. When a music rift becomes too abstract, this signal restores structure without breaking mystery. It strikes fast, changes motif, and leaves a trace other heroes can follow.'
    },
    doctrine: { fr: 'Mediator Pike, shred directionnel, changement de motif, frappe melodique.', en: 'Pike pick, directional shred, motif shift, melodic strike.' },
    tags: ['Buckethead', 'Pike Series', 'Riff', 'Shred', 'Signal']
  },
  soad_vocal: {
    clearance: 'MUS-SOAD01',
    rank: { fr: 'Persona vocale frontline', en: 'Frontline vocal persona' },
    role: { fr: 'Rupture de tempo, satire et cri de protestation', en: 'Tempo rupture, satire, and protest scream' },
    callSign: 'Frontline Voice',
    origin: { fr: 'Univers System of a Down - alt-metal politique / Toxicity / memoire armenienne-americaine', en: 'System of a Down universe - political alt-metal / Toxicity / Armenian-American memory' },
    dossier: {
      fr: 'Dans sa Trame d origine, System of a Down est une signature alternative-metal construite sur contrastes vocaux, riffs syncopes, ruptures soudaines, humour absurde, critique politique, memoire armenienne-americaine et refus de transformer la colere en simple posture. La Persona Frontline Voice condense l axe vocal du groupe: passer du murmure au cri, du chant presque rituel a la satire mordante, puis casser le tempo au moment ou l auditeur croit avoir compris la mesure.',
      en: 'In its origin Thread, System of a Down is an alternative-metal signature built on vocal contrasts, syncopated riffs, sudden breaks, absurd humor, political critique, Armenian-American memory, and refusal to turn anger into mere posture. The Frontline Voice Persona condenses the band vocal axis: moving from whisper to scream, from almost ritual singing to biting satire, then breaking tempo exactly when the listener thinks the measure is understood.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, A.R.C.A. stabilise System of a Down comme Trame de protestation rythmique, pas comme copie de personnes civiles. Frontline Voice sert a casser les diffusions du Sans-Auteur: slogans vides, ordres militaires, publicites de controle, faux refrains de victoire. Sa force est d utiliser la dissonance comme verite: quand une faille ment trop proprement, il introduit une cassure assez brutale pour rendre le mensonge audible.',
      en: 'In Multiverse Breach, A.R.C.A. stabilizes System of a Down as a rhythmic protest Thread, not as copies of private people. Frontline Voice breaks Authorless broadcasts: empty slogans, military orders, control advertisements, false victory choruses. Its strength is using dissonance as truth: when a breach lies too cleanly, it introduces a break brutal enough to make the lie audible.'
    },
    doctrine: { fr: 'Cri syncopé, satire sonore, cassure Toxicity, interruption de propagande.', en: 'Syncopated scream, sonic satire, Toxicity break, propaganda interrupt.' },
    tags: ['System of a Down', 'Toxicity', 'Protest', 'Voice', 'Tempo']
  },
  soad_guitar: {
    clearance: 'MUS-SOAD02',
    rank: { fr: 'Persona guitare staccato', en: 'Staccato guitar persona' },
    role: { fr: 'Riff syncopé et assaut de cassure', en: 'Syncopated riff and break assault' },
    callSign: 'Staccato Guitar',
    origin: { fr: 'Univers System of a Down - riffs syncopes / metal alternatif / rupture', en: 'System of a Down universe - syncopated riffs / alternative metal / rupture' },
    dossier: {
      fr: 'La Persona Staccato Guitar represente le cote sec, angulaire et imprevisible de System of a Down: riffs courts, changements de mesure, attaques presque punk, passages orientalisants, lourdeur metal puis bascule absurde ou melodique. Son monde d origine ne cherche pas une ligne droite; il fonctionne par virages, silences soudains et relances qui transforment chaque riff en ordre de mouvement.',
      en: 'The Staccato Guitar Persona represents System of a Down dry, angular, unpredictable side: short riffs, meter changes, almost punk attacks, Eastern-tinged passages, metal heaviness, then absurd or melodic turns. Its origin world does not seek a straight line; it works through turns, sudden silences, and restarts that turn each riff into a movement order.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Staccato Guitar sert de lame rythmique. Quand les ennemis avancent en formation trop stable, il coupe la grille en contretemps, force les menaces a perdre leur cadence et ouvre des angles d attaque. Le Sans-Auteur veut lisser la musique pour en faire un fond sonore; cette Persona rappelle qu un riff SOAD doit surprendre, deranger et deplacer le corps avant meme que le sens arrive.',
      en: 'In Multiverse Breach, Staccato Guitar acts as a rhythmic blade. When enemies advance in overly stable formation, it cuts the grid off-beat, forces threats to lose cadence, and opens attack angles. The Authorless wants to smooth the music into background sound; this Persona reminds that a SOAD riff must surprise, disturb, and move the body before meaning even arrives.'
    },
    doctrine: { fr: 'Riff staccato, coupure de mesure, assaut syncopé, relance metal.', en: 'Staccato riff, measure cut, syncopated assault, metal restart.' },
    tags: ['System of a Down', 'Guitar', 'Syncopation', 'Riff', 'Break']
  },
  soad_bass: {
    clearance: 'MUS-SOAD03',
    rank: { fr: 'Persona basse groove', en: 'Groove bass persona' },
    role: { fr: 'Ancrage, tension et ligne tactique', en: 'Anchor, tension, and tactical line' },
    callSign: 'Groove Bass',
    origin: { fr: 'Univers System of a Down - groove lourd / protest stage / basse tactique', en: 'System of a Down universe - heavy groove / protest stage / tactical bass' },
    dossier: {
      fr: 'La Persona Groove Bass porte l ancrage corporel de System of a Down: lignes qui collent au riff, tension qui soutient les ruptures, energie de scene et poids collectif sous les voix et guitares. Elle represente le moment ou la protestation devient marche, ou une cassure de tempo ne disperse pas le groupe mais le rassemble dans une pulsation plus lourde.',
      en: 'The Groove Bass Persona carries System of a Down bodily anchor: lines locked to the riff, tension supporting breaks, stage energy, and collective weight beneath voices and guitars. It represents the moment protest becomes march, where a tempo break does not scatter the group but gathers it into a heavier pulse.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Groove Bass sert a tenir le terrain quand la Trame SOAD devient trop chaotique. A.R.C.A. l utilise pour transformer la protestation en formation tactique: proteger les allies pendant une cassure, attirer les ennemis dans une pulsation basse, puis stabiliser l escouade apres un changement brutal de mesure. Sans lui, la colere devient bruit; avec lui, elle devient ligne de front.',
      en: 'In Multiverse Breach, Groove Bass holds the field when the SOAD Thread becomes too chaotic. A.R.C.A. uses it to turn protest into tactical formation: protect allies during a break, pull enemies into a low pulse, then stabilize the squad after a brutal meter shift. Without it, anger becomes noise; with it, it becomes a frontline.'
    },
    doctrine: { fr: 'Ligne basse lourde, ancrage de tempo, garde de protestation, pulsation tactique.', en: 'Heavy bass line, tempo anchor, protest guard, tactical pulse.' },
    tags: ['System of a Down', 'Bass', 'Groove', 'Anchor', 'Protest']
  },
  arthur_kaamelott: {
    clearance: 'KAA-AR01',
    rank: { fr: 'Roi de Bretagne', en: 'King of Brittany' },
    role: { fr: 'Commandement fatigue, strategie et quete du Graal', en: 'Tired command, strategy, and Grail quest' },
    callSign: 'Arthur',
    origin: { fr: 'Univers Kaamelott - Royaume de Logres / Table Ronde / quete du Graal', en: 'Kaamelott universe - Kingdom of Logres / Round Table / Grail quest' },
    dossier: {
      fr: 'Dans sa Trame d origine, Arthur Pendragon tente de tenir un royaume, une Table Ronde et une quete du Graal avec des chevaliers rarement au niveau de la mission. Kaamelott n est pas une legende arthurienne lisse: c est une serie francaise ou le pouvoir fatigue, les reunions derapent, la politique familiale use le roi, Lancelot glisse vers la rupture et le Graal reste un objectif sacre noye dans l incompetence ordinaire. Arthur represente le coeur grave de la serie: humour sec, solitude du commandement, lucidite strategique et fatigue de porter une mission trop grande pour son equipe.',
      en: 'In his origin Thread, Arthur Pendragon tries to hold a kingdom, a Round Table, and a Grail quest together with knights rarely equal to the mission. Kaamelott is not a polished Arthurian legend: it is a French series where power grows tired, meetings derail, family politics wear down the king, Lancelot slides toward rupture, and the Grail remains a sacred objective drowned in ordinary incompetence. Arthur carries the serious heart of the series: dry humor, command loneliness, strategic lucidity, and exhaustion from carrying a mission too large for his team.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Arthur devient une ancre de commandement fragile mais essentielle. A.R.C.A. l emploie dans les failles ou l ordre heroique s effondre sous l administration, les malentendus et les mauvaises decisions de conseil. Le Sans-Auteur veut transformer Kaamelott en farce pure ou en fantasy generique; Arthur force la Trame a rester entre les deux: drole parce que les gens ratent, grave parce que le royaume risque vraiment de tomber. Son objectif Breach est simple: garder la quete lisible quand tout le monde parle en meme temps.',
      en: 'In Multiverse Breach, Arthur becomes a fragile but essential command anchor. A.R.C.A. uses him in rifts where heroic order collapses under administration, misunderstandings, and bad council decisions. The Authorless wants to turn Kaamelott into pure farce or generic fantasy; Arthur forces the Thread to remain between both: funny because people fail, serious because the kingdom can truly fall. His Breach objective is simple: keep the quest readable while everyone speaks at once.'
    },
    doctrine: { fr: 'Excalibur, ordre de Table Ronde, strategie lasse, sarcasme royal, repli du royaume.', en: 'Excalibur, Round Table order, tired strategy, royal sarcasm, kingdom fallback.' },
    tags: ['Kaamelott', 'Arthur', 'Graal', 'Table Ronde', 'Bretagne']
  },
  perceval_kaamelott: {
    clearance: 'KAA-PE02',
    rank: { fr: 'Chevalier du Pays de Galles', en: 'Knight of Wales' },
    role: { fr: 'Logique oblique, intuition et chaos utile', en: 'Oblique logic, intuition, and useful chaos' },
    callSign: 'Perceval',
    origin: { fr: 'Univers Kaamelott - Pays de Galles / Table Ronde / incomprehension fertile', en: 'Kaamelott universe - Wales / Round Table / fertile misunderstanding' },
    dossier: {
      fr: 'Dans sa Trame d origine, Perceval est l un des chevaliers les plus improbables de la Table Ronde: souvent perdu dans les mots, les plans, les chiffres et les consignes, mais capable d intuitions que les chevaliers plus brillants ratent. Sa logique n est pas celle d un idiot generique; c est une maniere oblique de traverser le monde, faite de malentendus, de jeux incomprehensibles, de fidelite a Arthur et de moments ou l absurde touche presque au mystique.',
      en: 'In his origin Thread, Perceval is one of the Round Table most unlikely knights: often lost in words, plans, numbers, and instructions, yet capable of intuitions brighter knights miss. His logic is not generic stupidity; it is an oblique way of crossing the world, made of misunderstandings, incomprehensible games, loyalty to Arthur, and moments where absurdity almost touches the mystical.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Perceval sert a lire les failles que la logique classique ne comprend pas. A.R.C.A. l envoie quand une mission devient trop tordue, quand les objectifs se contredisent ou quand le Sans-Auteur cache une sortie dans une phrase absurde. Perceval ne resout pas les problemes comme un stratege: il tombe parfois sur la bonne porte parce qu il n a jamais accepte la mauvaise definition du couloir. Son arc Breach protege l esprit Kaamelott: l incompetence peut devenir intuition, mais seulement si elle reste humaine.',
      en: 'In Multiverse Breach, Perceval reads rifts classical logic cannot understand. A.R.C.A. sends him when a mission becomes too twisted, objectives contradict one another, or the Authorless hides an exit inside an absurd sentence. Perceval does not solve problems like a strategist: he sometimes finds the right door because he never accepted the wrong definition of the corridor. His Breach arc protects Kaamelott spirit: incompetence can become intuition, but only if it remains human.'
    },
    doctrine: { fr: 'Confusion fertile, phrase de travers, intuition mystique, mini-jeu absurde, fidelite a Arthur.', en: 'Fertile confusion, crooked sentence, mystical intuition, absurd minigame, loyalty to Arthur.' },
    tags: ['Kaamelott', 'Perceval', 'Pays de Galles', 'Absurd Logic', 'Graal']
  },
  karadoc_kaamelott: {
    clearance: 'KAA-KA03',
    rank: { fr: 'Chevalier de Vannes', en: 'Knight of Vannes' },
    role: { fr: 'Survie, ration, bon sens de travers', en: 'Survival, ration, crooked common sense' },
    callSign: 'Karadoc',
    origin: { fr: 'Univers Kaamelott - Vannes / clan de la bouffe / Table Ronde', en: 'Kaamelott universe - Vannes / food clan / Round Table' },
    dossier: {
      fr: 'Dans sa Trame d origine, Karadoc est moins un heros de geste qu un survivant pragmatique: manger, dormir, eviter les plans trop compliques et rester pres de Perceval quand la Table Ronde pretend comprendre ce qu elle fait. Son rapport a la nourriture est comique, mais aussi structurel: il ramene la quete du Graal au corps, a la fatigue, aux besoins simples et a une forme de bon sens souvent mal place mais rarement completement inutile.',
      en: 'In his origin Thread, Karadoc is less a heroic champion than a pragmatic survivor: eat, sleep, avoid overcomplicated plans, and stay close to Perceval when the Round Table pretends to understand what it is doing. His relationship to food is comic, but also structural: he brings the Grail quest back to the body, fatigue, simple needs, and a form of common sense often misplaced but rarely entirely useless.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, Karadoc devient l ancre de survie de Kaamelott. A.R.C.A. l utilise quand les failles transforment la noblesse, les titres et les grandes phrases en bruit inutile: Karadoc demande ce qu on mange, ou on dort, combien de temps on tient, et pourquoi on suivrait un plan qui n a meme pas prevu le casse-croute. Sa presence empeche la Trame Kaamelott de devenir une legende abstraite: un royaume tombe aussi quand ses chevaliers n ont plus de forces.',
      en: 'In Multiverse Breach, Karadoc becomes Kaamelott survival anchor. A.R.C.A. uses him when rifts turn nobility, titles, and grand speeches into useless noise: Karadoc asks what people eat, where they sleep, how long they can hold, and why anyone would follow a plan that did not even account for food. His presence prevents Kaamelott from becoming abstract legend: a kingdom also falls when its knights have no strength left.'
    },
    doctrine: { fr: 'Ration de Vannes, garde du clan, endurance absurde, repli casse-croute.', en: 'Vannes ration, clan guard, absurd endurance, snack fallback.' },
    tags: ['Kaamelott', 'Karadoc', 'Vannes', 'Ration', 'Survival']
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
  bratac: {
    clearance: 'JAFFA-MASTER',
    rank: { fr: 'Ancien Prima d Apophis / maitre Jaffa libre', en: 'Former First Prime of Apophis / Free Jaffa master' },
    role: { fr: 'Mentor Jaffa et commandant de resistance', en: 'Jaffa mentor and resistance commander' },
    callSign: 'Bra\'tac',
    origin: { fr: 'Univers Stargate SG-1 - Chulak / rebellion Jaffa', en: 'Stargate SG-1 universe - Chulak / Jaffa rebellion' },
    dossier: {
      fr: 'Dans sa Trame d origine, Bra tac est un maitre Jaffa, ancien Prima d Apophis et mentor de Teal c. Il a servi assez longtemps les Goa uld pour connaitre leurs mensonges, leurs tactiques et leurs faiblesses, puis a consacre son experience a la rebellion et a la liberte des Jaffa. Son age ne diminue ni sa precision au Ma Tok ni son autorite sur un champ de bataille.',
      en: 'In his origin Thread, Bra tac is a Jaffa master, former First Prime of Apophis, and Teal c s mentor. He served the Goa uld long enough to know their lies, tactics, and weaknesses, then devoted that experience to rebellion and Jaffa freedom. His age diminishes neither his Ma Tok precision nor his battlefield authority.'
    },
    breachLore: {
      fr: 'Dans Multiverse Breach, A.R.C.A. confie a Bra tac les Trames ou un faux dieu utilise une armee, une religion ou une technologie volee pour imposer son recit. Il organise les cellules Jaffa libres, reconnait les doctrines Goa uld contrefaites et transforme chaque Porte stabilisee en route d evacuation ou en point de soulevement.',
      en: 'In Multiverse Breach, A.R.C.A. assigns Bra tac to Threads where a false god uses an army, religion, or stolen technology to impose its narrative. He organizes Free Jaffa cells, recognizes counterfeit Goa uld doctrine, and turns each stabilized Gate into an evacuation route or uprising point.'
    },
    doctrine: { fr: 'Ma Tok, tir plasma rapide, commandement Jaffa, sabotage Goa uld, repli par la Porte.', en: 'Ma Tok staff, rapid plasma fire, Jaffa command, Goa uld sabotage, Gate withdrawal.' },
    tags: ['SG-1', 'Bratac', 'Jaffa', 'Chulak', 'Free Jaffa', 'Ma Tok']
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

Object.assign(CHARACTER_PLAQUES, FEATURED_CHARACTER_PLAQUES);

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
