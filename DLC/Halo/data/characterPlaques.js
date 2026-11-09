// Halo — definitions consumed by src/game/characterPlaques.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createCharacterPlaques() {
  return ({
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
  });
}

export function createCharacterPlaques2() {
  return ({
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
  });
}
