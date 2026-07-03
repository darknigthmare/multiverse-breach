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
    origin: { fr: 'Silent Hill - manifestation punitive', en: 'Silent Hill - punitive manifestation' },
    dossier: {
      fr: 'Entite lourde liee a la culpabilite et aux cycles de punition. Sa plaquette n est pas une autorisation: c est un avertissement de zone rouge.',
      en: 'Heavy entity bound to guilt and punishment cycles. His plaque is not clearance: it is a red-zone warning.'
    },
    doctrine: { fr: 'Grande lame, brouillard, execution lente.', en: 'Great knife, fog, slow execution.' },
    tags: ['Silent Hill', 'Fear', 'Blade', 'Entity']
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
    rank: { fr: 'Colonel', en: 'Colonel' },
    role: { fr: 'Commandement SG-1', en: 'SG-1 Command' },
    callSign: 'O\'Neill',
    origin: { fr: 'Terre - SGC / Cheyenne Mountain', en: 'Earth - SGC / Cheyenne Mountain' },
    dossier: {
      fr: 'Officier de terrain specialiste des premieres prises de contact. Son humour sec masque une lecture rapide des menaces Goa\'uld et une priorite constante: ramener l equipe vivante.',
      en: 'Field officer specialized in first contact operations. His dry humor hides a fast read on Goa\'uld threats and one constant priority: bringing the team home alive.'
    },
    doctrine: { fr: 'Tir P90, repli couvert, verrouillage Iris.', en: 'P90 fire, covered fallback, Iris lockdown.' },
    tags: ['SG-1', 'P90', 'Iris', 'Command']
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
    rank: { fr: 'Major', en: 'Major' },
    role: { fr: 'Astrophysique et contre-mesures', en: 'Astrophysics and countermeasures' },
    callSign: 'Carter',
    origin: { fr: 'Terre - SGC / USAF', en: 'Earth - SGC / USAF' },
    dossier: {
      fr: 'Scientifique-combattante capable de recalibrer une Porte, neutraliser une technologie Goa\'uld et transformer une anomalie de naquadah en avantage tactique.',
      en: 'Scientist-soldier able to recalibrate a Gate, neutralize Goa\'uld technology, and turn a naquadah anomaly into a tactical advantage.'
    },
    doctrine: { fr: 'Analyse de faille, surcharge au naquadah, piratage de bouclier.', en: 'Breach analysis, naquadah overload, shield hacking.' },
    tags: ['SG-1', 'Naquadah', 'Tech', 'Science']
  },
  tealc: {
    clearance: 'SGC-03',
    rank: { fr: 'Jaffa libre', en: 'Free Jaffa' },
    role: { fr: 'Avant-garde et anti-Goa\'uld', en: 'Vanguard and anti-Goa\'uld' },
    callSign: 'Teal\'c',
    origin: { fr: 'Chulak - rebellion Jaffa', en: 'Chulak - Jaffa rebellion' },
    dossier: {
      fr: 'Ancien Prima d Apophis devenu pilier de SG-1. Discipline, endurance et connaissance intime des tactiques Jaffa en font le meilleur rempart contre les incursions Goa\'uld.',
      en: 'Former First Prime of Apophis turned SG-1 pillar. Discipline, endurance, and intimate knowledge of Jaffa tactics make him the strongest wall against Goa\'uld incursions.'
    },
    doctrine: { fr: 'Lance Jaffa, duel frontal, protection de l escouade.', en: 'Jaffa staff, frontal duel, squad protection.' },
    tags: ['SG-1', 'Jaffa', 'Staff', 'Honor']
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
