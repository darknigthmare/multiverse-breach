// Minions — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
    clearance: 'MIN-BOB-2015',
    rank: { fr: 'Compagnon de Kevin et Stuart', en: 'Kevin and Stuart s companion' },
    role: { fr: 'Comedie et diversion', en: 'Comedy and distraction' },
    callSign: 'Bob',
    origin: { fr: 'Minions (2015) - aventure de la couronne a Londres', en: 'Minions (2015) - London crown adventure' },
    dossier: {
      fr: 'Bob est le plus petit du trio: rond, chauve, avec deux yeux de couleurs differentes, un vert et un brun. Illumination le decrit comme doux et naif. Il garde ses lunettes doubles, sa salopette et son ours Tim; son role de classe ne lui attribue plus de laser. Les bousculades et diversions sont une adaptation comique pour le jeu.',
      en: 'Bob is the smallest of the trio: round and bald, with two differently colored eyes, one green and one brown. Illumination describes him as sweet and naive. He retains his double goggles, overalls and Tim teddy bear; his game class no longer grants him a laser. Bumps and distractions are a comic game adaptation.'
    },
    doctrine: { fr: 'Petit corps rond, yeux heterochromes, lunettes doubles, Tim et gestes comiques; aucun pouvoir laser canonique.', en: 'Small round body, mismatched eyes, double goggles, Tim and comic gestures; no canonical laser power.' },
    tags: ['Minions 2015', 'Bob', 'Tim', 'Comedy']
  });
}

export function createCharacterPlaques2() {
  return ({
    clearance: 'MIN-KEV-2015',
    rank: { fr: 'Meneur du trio', en: 'Trio leader' },
    role: { fr: 'Protection et conduite du groupe', en: 'Protection and team guidance' },
    callSign: 'Kevin',
    origin: { fr: 'Minions (2015) - aventure de la couronne a Londres', en: 'Minions (2015) - London crown adventure' },
    dossier: {
      fr: 'Kevin est le grand Minion a deux yeux et a touffe de cheveux centrale. Il lance le voyage de Bob et Stuart pour trouver un nouveau chef. Illumination le decrit comme protecteur et un peu autoritaire. Sa classe tactique ne lui donne plus automatiquement un fusil; les bousculades, bananes et charges de groupe sont une adaptation comique du jeu.',
      en: 'Kevin is the tall two-eyed Minion with a central hair tuft. He starts Bob and Stuart s journey to find a new master. Illumination describes him as protective and slightly bossy. His tactical class no longer automatically grants a rifle; bumps, bananas and team charges are a comic game adaptation.'
    },
    doctrine: { fr: 'Grande silhouette, deux yeux bruns, touffe centrale, lunettes doubles et protection du trio.', en: 'Tall silhouette, two brown eyes, central hair tuft, double goggles and protection of the trio.' },
    tags: ['Minions 2015', 'Kevin', 'Leader', 'Comedy']
  });
}

export function createCharacterPlaques3() {
  return ({
    clearance: 'MIN-STU-2015',
    rank: { fr: 'Aspirant rockeur', en: 'Aspiring rock star' },
    role: { fr: 'Comedie musicale', en: 'Musical comedy' },
    callSign: 'Stuart',
    origin: { fr: 'Minions (2015) - finale rock a Londres', en: 'Minions (2015) - London rock finale' },
    dossier: {
      fr: 'Stuart possede un seul oeil brun, une lunette unique et quelques cheveux noirs separes au milieu. Illumination le decrit comme rebelle et aspirant rockeur; sa guitare electrique rouge figure dans la reference officielle. Les riffs offensifs du jeu adaptent cet accessoire musical, sans pretendre que Stuart possede un pouvoir sonore dans le film.',
      en: 'Stuart has one brown eye, a single goggle and sparse black hair parted in the middle. Illumination describes him as rebellious and an aspiring rock star; his red electric guitar appears in the official reference. Offensive riffs adapt this musical prop for the game without claiming Stuart has a sound power in the film.'
    },
    doctrine: { fr: 'Un oeil, une lunette, guitare electrique rouge et gestes de rockeur; degats sonores adaptes au jeu.', en: 'One eye, one goggle, red electric guitar and rock-star gestures; sound damage adapted for the game.' },
    tags: ['Minions 2015', 'Stuart', 'Guitar', 'Comedy']
  });
}
