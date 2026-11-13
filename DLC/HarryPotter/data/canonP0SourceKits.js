// Harry Potter — definitions consumed by src/game/canonP0SourceKits.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCanonP0SourceKits({ REF, guard, lock, ranged }) {
  return (lock({
    incarnation: 'Harry Potter and the Order of the Phoenix (2007 film) - fifth-year Dumbledore s Army',
    referenceUrls: [REF.harry, REF.phoenix],
    equipment: ['Holly Wand with Phoenix-Feather Core', 'Gryffindor School Uniform', 'Round Glasses'],
    sourceAbilities: ['Expelliarmus', 'Stupefy', 'Protego', 'Expecto Patronum - Stag'],
    visualAnchor: 'Harry in the 2007 Order of the Phoenix film: teenage Harry, untidy dark hair, round glasses and lightning scar, Hogwarts Gryffindor school clothing, original holly wand with phoenix-feather core. No Elder Wand, adult epilogue version or green Killing Curse. A corporeal Patronus is a stag, not a generic blast.',
    weapon: 'wand', weaponType: 'wand', weaponColor: '#6b4b35',
    primaryColor: '#494752', secondaryColor: '#a5443d',
    simple: ranged('Expelliarmus', 'projectile', '#ed6456'),
    secondary: ranged('Stupefy', 'projectile', '#e35c5c'),
    defense: guard('Protego'),
    special: ranged('Dumbledore s Army Stupefy Duel', 'projectile', '#e35c5c'),
    mechanicsReviewStatus: 'Spells use game damage/guard; disarm, stun and Dementor-specific Patronus behavior require dedicated mechanics. Patronus is not an offensive area explosion.',
    loreLocalized: {
      fr: 'Ce Harry est en cinquieme annee dans le film Order of the Phoenix de 2007. Il enseigne la defense a l Armee de Dumbledore avec sa baguette de houx a plume de phenix. Expelliarmus desarme, Stupefy etourdit et Protego protege dans la source ; les degats du moteur en sont une abstraction explicite. Son Patronus est un cerf protecteur face aux Detraqueurs et n est plus remplace par une explosion offensive generique.',
      en: 'This Harry is a fifth-year student in the 2007 Order of the Phoenix film. He teaches defense to Dumbledore s Army with his holly and phoenix-feather wand. In the source, Expelliarmus disarms, Stupefy stuns and Protego protects; engine damage is an explicit abstraction. His Patronus is a protective stag against Dementors and is no longer replaced by a generic offensive explosion.'
    }
  }));
}

export function createCanonP0SourceKits2({ REF, guard, lock, ranged }) {
  return (lock({
    incarnation: 'Harry Potter and the Order of the Phoenix (2007 film) - fifth-year Dumbledore s Army',
    referenceUrls: [REF.hermione, REF.phoenix],
    equipment: ['Vine Wand with Dragon-Heartstring Core', 'Gryffindor School Uniform'],
    sourceAbilities: ['Stupefy', 'Expelliarmus', 'Protego'],
    visualAnchor: 'Hermione in the 2007 Order of the Phoenix film: teenage Hermione with brown hair, Hogwarts Gryffindor school clothing and her vine wand with dragon-heartstring core. Fifth-year incarnation; no permanent third-year Time-Turner pendant, Elder Wand or Deathly Hallows forest outfit. Final film-costume review remains pending.',
    weapon: 'wand', weaponType: 'wand', weaponColor: '#795a44',
    primaryColor: '#6d5247', secondaryColor: '#a5443d',
    simple: ranged('Stupefy', 'projectile', '#e35c5c'),
    secondary: ranged('Expelliarmus', 'projectile', '#ed6456'),
    defense: guard('Protego'),
    special: ranged('Dumbledore s Army Stunning Duel', 'projectile', '#e35c5c'),
    mechanicsReviewStatus: 'Spells use game damage/guard; canonical disarm and stun effects are not yet simulated. No offensive Time-Turner or later-film Protego Maxima is attributed to this kit.',
    loreLocalized: {
      fr: 'Cette Hermione est la cinquieme annee du film Order of the Phoenix de 2007 et membre de l Armee de Dumbledore, avec sa baguette de vigne a coeur de dragon. Son intelligence et son apprentissage des sorts structurent le kit a distance. Le Retourneur de Temps de Prisoner of Azkaban et Protego Maxima des films suivants ne sont pas fusionnes dans cette incarnation ; desarmement et etourdissement restent a distinguer des degats abstraits du jeu.',
      en: 'This Hermione is the fifth-year Dumbledore s Army member from the 2007 Order of the Phoenix film, using her vine and dragon-heartstring wand. Intelligence and learned spells structure her ranged kit. The Prisoner of Azkaban Time-Turner and later-film Protego Maxima are not merged into this incarnation; disarm and stun still require separation from abstract game damage.'
    }
  }));
}
