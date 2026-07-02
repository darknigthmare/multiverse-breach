export const CHARACTER_PLAQUES = {
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
    role: { fr: 'Fer de lance militaire', en: 'Military spearhead' },
    callSign: 'Sierra 117',
    origin: { fr: 'Terre - UNSC', en: 'Earth - UNSC' },
    dossier: {
      fr: 'Super-soldat concu pour casser les fronts impossibles. Le Nexus l emploie quand une faille exige discipline, bouclier et elimination rapide de cible lourde.',
      en: 'Super-soldier built to break impossible fronts. The Nexus deploys him when a breach demands discipline, shielding, and fast removal of heavy targets.'
    },
    doctrine: { fr: 'Rafales UNSC, grenade plasma, laser Spartan.', en: 'UNSC bursts, plasma grenade, Spartan laser.' },
    tags: ['UNSC', 'Spartan', 'Shield', 'Laser']
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
    rank: { fr: 'Agent special', en: 'Special Agent' },
    role: { fr: 'Confinement biohazard', en: 'Biohazard containment' },
    callSign: 'Kennedy',
    origin: { fr: 'Raccoon City / DSO', en: 'Raccoon City / DSO' },
    dossier: {
      fr: 'Survivant de Raccoon City devenu operateur anti-BOW. Sa plaquette couvre tir de precision, esquive rapprochee et neutralisation de specimens infectes.',
      en: 'Raccoon City survivor turned anti-BOW operator. His plaque covers precision fire, close evasion, and neutralization of infected specimens.'
    },
    doctrine: { fr: 'Matilda, fusil tactique, roquette anti-BOW.', en: 'Matilda, tactical shotgun, anti-BOW rocket.' },
    tags: ['RPD', 'BOW', 'Pistol', 'Survival']
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
    rank: { fr: 'Chercheur arme', en: 'Armed Researcher' },
    role: { fr: 'Incident dimensionnel', en: 'Dimensional incident' },
    callSign: 'Freeman',
    origin: { fr: 'Black Mesa', en: 'Black Mesa' },
    dossier: {
      fr: 'Physicien survivant a la cascade de resonance. Le Nexus le classe comme operateur anomalie: silencieux, precis et dangereusement compatible avec les armes experimentales.',
      en: 'Physicist who survived the resonance cascade. The Nexus marks him as an anomaly operator: silent, precise, and dangerously compatible with experimental weapons.'
    },
    doctrine: { fr: 'Pied-de-biche, manipulation gravitationnelle, rayon gluon.', en: 'Crowbar, gravity manipulation, gluon beam.' },
    tags: ['Black Mesa', 'HEV', 'Gravity', 'Scientist']
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
    rank: { fr: 'Agent de securite', en: 'Security Officer' },
    role: { fr: 'Soutien Black Mesa', en: 'Black Mesa support' },
    callSign: 'Barney',
    origin: { fr: 'Black Mesa Security', en: 'Black Mesa Security' },
    dossier: {
      fr: 'Securite improvisee dans un desastre scientifique total. Barney apporte tir fiable, sang-froid et soutien de proximite aux equipes de faille.',
      en: 'Improvised security inside a total scientific disaster. Barney brings reliable fire, composure, and close support to breach teams.'
    },
    doctrine: { fr: 'Pistolet, couverture courte, extraction de survivants.', en: 'Sidearm, short cover, survivor extraction.' },
    tags: ['Black Mesa', 'Security', 'Support', 'Rescue']
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
    rank: { fr: 'Operatrice S.T.A.R.S.', en: 'S.T.A.R.S. Operative' },
    role: { fr: 'Evasion et verrouillage', en: 'Evasion and lockdown' },
    callSign: 'Valentine',
    origin: { fr: 'Raccoon City - S.T.A.R.S.', en: 'Raccoon City - S.T.A.R.S.' },
    dossier: {
      fr: 'Specialiste survie, crochetage et combat contre armes biologiques. Jill stabilise les failles ou les couloirs sont aussi dangereux que les monstres.',
      en: 'Specialist in survival, lockpicking, and combat against biological weapons. Jill stabilizes breaches where corridors are as dangerous as monsters.'
    },
    doctrine: { fr: 'Pistolet S.T.A.R.S., esquive, contre-mesure anti-Nemesis.', en: 'S.T.A.R.S. pistol, dodge, anti-Nemesis countermeasure.' },
    tags: ['S.T.A.R.S.', 'Biohazard', 'Dodge', 'Lockpick']
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
  marine: { fr: 'Ancrage de front', en: 'Frontline anchor' },
  slayer: { fr: 'Rupture offensive', en: 'Offensive rupture' },
  horror: { fr: 'Survie contre-anomalie', en: 'Counter-anomaly survival' },
  hacker: { fr: 'Lecture du code-realite', en: 'Code-reality reader' },
  tactical: { fr: 'Commandement de terrain', en: 'Field command' }
};

export const getCharacterPlaque = (hero) => {
  if (CHARACTER_PLAQUES[hero.id]) return CHARACTER_PLAQUES[hero.id];
  const role = roleByCategory[hero.category] || roleByCategory.tactical;
  const doctrine = hero.special?.name || hero.weaponType || 'signature inconnue';
  return {
    clearance: `${hero.universe.slice(0, 3).toUpperCase()}-${hero.id.slice(0, 3).toUpperCase()}`,
    rank: { fr: hero.category.toUpperCase(), en: hero.category.toUpperCase() },
    role,
    callSign: hero.name,
    origin: { fr: `Trame d origine - ${hero.universe}`, en: `Origin Thread - ${hero.universe}` },
    dossier: {
      fr: `${hero.name} a ete archive par A.R.C.A. comme signature stable de la Trame ${hero.universe}. Le Nexus conserve son histoire d origine, puis applique une Compression de Resonance pour lui donner une seconde fonction: servir de cle vivante contre les breches ou son monde est copie, tordu ou rendu muet par le Sans-Auteur.`,
      en: `${hero.name} has been archived by A.R.C.A. as a stable signature from the ${hero.universe} Thread. The Nexus preserves the origin story, then applies Resonance Compression to give the hero a second function: acting as a living key against breaches where that world is copied, twisted, or silenced by the Authorless.`
    },
    doctrine: {
      fr: `${doctrine}. Stabilisation de scene, rupture de pattern, recuperation d Eclats d Origine et protection des archives locales.`,
      en: `${doctrine}. Scene stabilization, pattern rupture, recovery of Origin Shards, and protection of local archives.`
    },
    tags: [hero.universe, hero.category, hero.weaponType || 'combat']
  };
};
