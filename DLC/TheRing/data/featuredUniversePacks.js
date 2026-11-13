// The Ring — definitions consumed by src/game/featuredUniversePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createFeaturedUniversePacks({ hero, threat }) {
  return ({
    universe: 'The Ring',
    mediaType: 'movie',
    faction: 'horror',
    stageName: 'Shelter Mountain Cabin 12',
    mode: 'RPG',
    difficulty: 'Very Hard',
    bossName: 'Samara Television Crawl',
    title: { en: 'The Ring', fr: 'Le Cercle' },
    desc: {
      en: 'Rachel Keller investigates a VHS recording imprinted by Samara Morgans psychic rage. The seven-day call, distorted photographs, Morgan Ranch, Moesko Island, Shelter Mountain, the stone well, and the need to copy the tape define a curse that wants circulation rather than closure.',
      fr: 'Rachel Keller enquete sur une cassette VHS imprimee par la rage psychique de Samara Morgan. L appel des sept jours, les photos deformees, Morgan Ranch, Moesko Island, Shelter Mountain, le puits de pierre et la copie de la cassette definissent une malediction qui cherche a circuler plutot qu a se refermer.'
    },
    hero: hero('rachel_ring', 'Rachel Keller', 'tactical', '#59666a', 'camera', 'Camera Flash', 'Tape Frame Analysis', 'Deadline Route', 'Copy the Tape'),
    allies: [
      hero('aiden_ring', 'Aidan Keller', 'hacker', '#9ba6a8', 'psychic', 'Static Warning', 'Samara Drawing Read', 'Childs Premonition', 'Seven-Day Pattern Break'),
      hero('noah_ring', 'Noah Clay', 'tactical', '#596d72', 'camera', 'Photo Lab Flash', 'Video Timecode Trace', 'Darkroom Cover', 'Nensha Evidence Reconstruction')
    ],
    monsters: [
      threat('Distorted Victim Echo', '/sprites/generated/bosses/the-ring/distorted-victim-echo.png', 'fear', 'Twisted Photograph'),
      threat('Cursed Tape Static', '/sprites/generated/bosses/the-ring/cursed-tape-static.png', 'static', 'Seven-Day Mark'),
      threat('Morgan Ranch Horse Panic', '/sprites/generated/bosses/the-ring/morgan-ranch-horse-panic.png', 'charge', 'Ferry Stampede')
    ],
    bosses: [
      threat('Anna Morgan Well Vision', '/sprites/generated/bosses/the-ring/anna-morgan-well-vision.png', 'psychic', 'Moesko Cliff Memory'),
      threat('Samara Television Crawl', '/sprites/generated/bosses/the-ring/samara-television-crawl.png', 'nensha', 'Screen Threshold')
    ],
    worldBoss: threat('Samara Morgan', '/sprites/generated/bosses/the-ring/samara-morgan.png', 'psychic_curse', 'Seven Days Without End'),
    gear: [
      ['ring_cursed_vhs', 'Cursed VHS Copy', 'Copie VHS maudite', { atk: 9, spd: 1 }],
      ['ring_distorted_photo', 'Distorted Polaroid', 'Polaroid deforme', { def: 5, hp: 55 }],
      ['ring_shelter_well_stone', 'Aidans Black Ring Drawing', 'Dessin de lanneau noir d Aidan', { hp: 85, def: 3 }]
    ],
    event: ['evt_ring_copy_deadline', 'Copied Cursed VHS Tape', 'Copie de la cassette VHS maudite', 'Rachel duplicates the unlabelled physical tape because copying and showing it to another viewer is the curses actual survival rule, not a cure.', 'Rachel duplique la cassette physique sans etiquette, car la copier puis la montrer a un autre spectateur constitue la veritable regle de survie de la malediction, pas un remede.'],
    decor: { sky: ['#10191b', '#020303'], floor: 'rgba(82, 106, 108, 0.17)', grid: 'rgba(196, 224, 221, 0.24)', motif: 'hauntedset', accent: '#bedbd6' },
    stageVariants: [
      { mode: 'Tactics', name: 'Morgan Ranch Nensha Investigation', difficulty: 'Very Hard', bossName: 'Anna Morgan Well Vision' },
      { mode: 'Smash', name: 'Stone Well Television Threshold', difficulty: 'Expert', bossName: 'Samara Morgan' }
    ]
  });
}

export function createFeaturedUniverseNarrativeArcs() {
  return ({
    id: 'the_ring_seven_day_investigation',
    title: { fr: 'Arc Univers - Le Cercle: sept jours', en: 'Universe Arc - The Ring: Seven Days' },
    universes: ['The Ring'],
    intro: {
      fr: 'Rachel Keller regarde la cassette sans etiquette apres la mort de Katie. Le telephone annonce sept jours; les images du puits, de l echelle, des chevaux et du miroir deviennent les seules pistes capables de mener jusqu a Samara Morgan.',
      en: 'Rachel Keller watches the unmarked tape after Katies death. The telephone announces seven days; images of the well, ladder, horses, and mirror become the only clues leading to Samara Morgan.'
    },
    missions: [
      { fr: 'Intro - Shelter Mountain: recuperer la cassette, photographier ses distortions et lancer un compte a rebours qui ne se met jamais en pause entre deux missions.', en: 'Intro - Shelter Mountain: recover the tape, photograph its distortions, and start a countdown that never pauses between missions.' },
      { fr: 'Mission - Morgan Ranch: interroger Richard, relier les chevaux a Anna et retrouver les dossiers qui prouvent que les images viennent de Samara.', en: 'Mission - Morgan Ranch: question Richard, connect the horses to Anna, and recover records proving the images come from Samara.' },
      { fr: 'Interlude - Dessins d Aidan: comprendre que l enfant voit deja Samara et que lui rendre son corps ne signifie pas apaiser la malediction.', en: 'Interlude - Aidans Drawings: understand that the child already sees Samara and that recovering her body does not mean appeasing the curse.' },
      { fr: 'Mission - Moesko Island: suivre l arbre brule jusqu au puits, descendre dans la chambre de sept jours et ramener les preuves avant la fermeture.', en: 'Mission - Moesko Island: follow the burned tree to the well, descend into the seven-day chamber, and recover the evidence before it closes.' },
      { fr: 'Boss - Samara hors de l ecran: survivre a la sortie de television, isoler la nensha et produire une copie controlee sans la transmettre a un innocent.', en: 'Boss - Samara Beyond the Screen: survive the television crawl, isolate the nensha, and create a controlled copy without passing it to an innocent.' }
    ],
    outro: { fr: 'Rachel ne celebre pas une victoire fausse. La copie est enfermee dans une coordonnee A.R.C.A., le compte des sept jours reste visible et chaque nouveau visionnage devient une decision de quarantaine.', en: 'Rachel does not celebrate a false victory. The copy is sealed inside an A.R.C.A. coordinate, the seven-day count remains visible, and every new viewing becomes a quarantine decision.' },
    reward: { fr: 'Cassette de quarantaine + apparence Rachel enquetrice', en: 'Quarantine Tape + Investigator Rachel skin' }
  });
}

export function createFeaturedEnemyLore({ localized }) {
  return ({
    'Distorted Victim Echo': localized('Cet echo reprend la deformation faciale laissee par Samara sur ses victimes et dans les photographies. Il represente une preuve de la malediction, pas un zombie supplementaire.', 'This echo reproduces the facial distortion Samara leaves on victims and photographs. It represents evidence of the curse rather than an additional zombie.'),
    'Cursed Tape Static': localized('Le parasite de la cassette masque des images de puits, echelle, miroir, chevaux et arbre. Chaque frame est un indice projete par la nensha de Samara.', 'The tapes static masks images of a well, ladder, mirror, horses, and tree. Every frame is a clue projected through Samaras nensha.'),
    'Morgan Ranch Horse Panic': localized('Les chevaux Morgan reagissent violemment a la presence psychique de Samara. Cette menace est une charge de panique environnementale, jamais une creature possedee inventee.', 'The Morgan horses react violently to Samaras psychic presence. This threat is an environmental panic charge, never an invented possessed creature.'),
    'Anna Morgan Well Vision': localized('La vision reconstruit le moment ou Anna etouffe Samara puis la pousse dans le puits de Shelter Mountain. Elle doit etre comprise comme memoire de la cassette, pas comme un second fantome antagoniste.', 'The vision reconstructs Anna suffocating Samara and pushing her into the Shelter Mountain well. It is a tape memory, not a second antagonistic ghost.'),
    'Samara Television Crawl': localized('Samara sort de limage du puits, traverse le poste puis la piece jusqu a sa victime. La distance de lecran cesse alors de proteger celui qui a regarde la cassette.', 'Samara leaves the wells image, crosses the television, then the room toward her victim. Distance from the screen no longer protects anyone who watched the tape.'),
    'Samara Morgan': localized('Samara projette mentalement des images sur film et dans les esprits. Morte apres sept jours au fond du puits, elle attache ce delai a une cassette qui ne laisse vivre que par copie et transmission.', 'Samara projects images psychically onto film and into minds. Dead after seven days in the well, she binds that deadline to a tape that only spares through copying and transmission.')
  });
}

export function createFeaturedStageLore({ localized }) {
  return ({
    RPG: localized('La Cabine 12 de Shelter Mountain conserve le televiseur, le magnetoscope et le plancher place au-dessus du puits. Le compte des sept jours avance pendant lenquete au lieu de disparaitre entre les combats.', 'Shelter Mountain Cabin 12 keeps the television, VCR, and floor built above the well. The seven-day count advances throughout the investigation instead of disappearing between fights.'),
    Tactics: localized('Morgan Ranch et le laboratoire photo de Noah deviennent une table dindices: cheval, miroir, echelle, arbre, timecode et photographies deformees doivent etre relies avant la prochaine manifestation.', 'Morgan Ranch and Noahs photo lab become an evidence grid: horse, mirror, ladder, tree, timecode, and distorted photographs must be connected before the next manifestation.'),
    Smash: localized('Le puits ouvre directement dans une salle de television ou Samara reduit la distance image par image. Les sorties-ecran doivent etre bloquees avant la fin du septieme jour.', 'The well opens directly into a television room where Samara closes the distance frame by frame. Screen exits must be sealed before the seventh day ends.')
  });
}

export function createFeaturedGearLore({ localized }) {
  return (localized('La cassette sans etiquette contient les images psychiques de Samara et declenche un appel annoncant sept jours. La survie exige une copie montree a une autre personne.', 'The unmarked tape contains Samaras psychic images and triggers a call announcing seven days. Survival requires a copy shown to another person.'));
}

export function createFeaturedGearLore2({ localized }) {
  return (localized('Les visages photographies se deforment apres exposition a la cassette. Rachel et Noah utilisent cette anomalie comme preuve mesurable de la nensha.', 'Photographed faces distort after exposure to the tape. Rachel and Noah use the anomaly as measurable evidence of nensha.'));
}

export function createFeaturedGearLore3({ localized }) {
  return (localized('Aidan dessine un cercle noir avant que Rachel ne comprenne quil reproduit lanneau de lumiere visible depuis le puits de Samara. Le dessin sert d indice physique de sa communication avec elle.', 'Aidan draws a black ring before Rachel understands that it reproduces the ring of light visible from Samaras well. The drawing is physical evidence of his contact with her.'));
}

export function createFeaturedBackdrops() {
  return ({
    RPG: '/backgrounds/featured/the-ring-rpg-openai.png',
    Tactics: '/backgrounds/featured/the-ring-tactics-openai.png',
    Smash: '/backgrounds/featured/the-ring-smash-openai.png'
  });
}

export function createFeaturedCharacterPlaques({ plaque }) {
  return (plaque(
    'Rachel Keller est une journaliste de Seattle qui remonte la cassette jusqu a Shelter Mountain, Morgan Ranch et Moesko Island. Elle decouvre que retrouver le corps de Samara ne suffit pas: la cassette exige d etre copiee et transmise.',
    'Rachel Keller is a Seattle journalist who traces the tape through Shelter Mountain, Morgan Ranch, and Moesko Island. She discovers that recovering Samaras body is not enough: the tape demands to be copied and passed on.',
    'A.R.C.A. la classe comme enquetrice de malediction, pas comme exorciste. Rachel conserve le compte des sept jours, compare chaque image et isole la nouvelle copie dans une coordonnee de quarantaine au lieu de pretendre avoir obtenu une fin heureuse.',
    'A.R.C.A. classifies her as a curse investigator, not an exorcist. Rachel keeps the seven-day count, compares every image, and isolates the new copy in a quarantine coordinate instead of pretending she earned a happy ending.',
    'Appareil photo, analyse VHS, itineraire de deadline et copie controlee.',
    'Camera, VHS analysis, deadline routing, and controlled copying.',
    ['Rachel Keller', 'cursed tape', 'seven days']
  ));
}

export function createFeaturedCharacterPlaques2({ plaque }) {
  return (plaque(
    'Aidan Keller percoit Samara avant les adultes, dessine ses visions et comprend que Rachel ne devait pas aider la jeune fille du puits.',
    'Aidan Keller perceives Samara before the adults, draws his visions, and understands that Rachel was not supposed to help the girl in the well.',
    'Dans la Cite-Mosaique, Aidan reste un temoin protege. Ses dessins signalent les images que la cassette va projeter et donnent a l escouade une seconde davance sans transformer un enfant en combattant de premiere ligne.',
    'Inside Mosaic City, Aidan remains a protected witness. His drawings flag images the tape is about to project and give the squad one second of warning without turning a child into a frontline fighter.',
    'Premonition, dessin de Samara, alerte statique et lecture du cycle des sept jours.',
    'Premonition, Samara drawing, static warning, and seven-day cycle reading.',
    ['Aidan Keller', 'drawings', 'premonition']
  ));
}

export function createFeaturedCharacterPlaques3({ plaque }) {
  return (plaque(
    'Noah Clay travaille avec l image et la video. Son laboratoire revele les distortions photographiques et les informations cachees dans la bande, mais il sous-estime la regle de transmission de la malediction.',
    'Noah Clay works with photography and video. His lab reveals photographic distortions and information hidden in the tape, but he underestimates the curses transmission rule.',
    'A.R.C.A. conserve Noah au point exact avant sa mort comme analyste de support. Il ralentit la bande, reconstruit les timecodes et marque les frames impossibles, sachant desormais qu une preuve comprise peut encore tuer son observateur.',
    'A.R.C.A. anchors Noah at the exact point before his death as a support analyst. He slows the tape, reconstructs timecodes, and marks impossible frames, now knowing understood evidence can still kill its viewer.',
    'Chambre noire, timecode VHS, flash photographique et reconstruction nensha.',
    'Darkroom, VHS timecode, photographic flash, and nensha reconstruction.',
    ['Noah Clay', 'photo lab', 'timecode']
  ));
}

export function createFeaturedBattleItemOverrides() {
  return ({
    pickups: [
      ['Cassette sans etiquette', 'Unmarked VHS Tape', 'Marque une cible avec le compte des sept jours et revele sa prochaine action sous forme de frame parasite.'],
      ['Polaroid deforme', 'Distorted Polaroid', 'Montre quelle unite est deja touchee par la nensha et augmente son esquive avant manifestation.'],
      ['Dessin de lanneau noir d Aidan', 'Aidans Black Ring Drawing', 'Le dessin au crayon noir reproduit lanneau de lumiere vu depuis le puits et signale le contact psychique de Samara.']
    ],
    summon: ['Cle de la Cabine 12', 'Cabin 12 Key Tag', 'La cle etiquetee de Shelter Mountain localise la cabine ou Rachel trouve et visionne la cassette sans etiquette.'],
    ultimate: ['Telephone des sept jours', 'Seven-Days Telephone', 'Le combine noir sonne juste apres la cassette et transmet lannonce physique du delai de sept jours.']
  });
}
