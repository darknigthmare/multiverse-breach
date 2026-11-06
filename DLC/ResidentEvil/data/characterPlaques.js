// Resident Evil — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
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
  });
}

export function createCharacterPlaques2() {
  return ({
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
  });
}

export function createCharacterPlaques3() {
  return ({
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
  });
}
