// Woodruff — definitions consumed by src/game/featuredUniversePacks.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createFeaturedUniversePacks({ hero, threat }) {
  return ({
    universe: 'Woodruff',
    mediaType: 'game',
    faction: 'arcane',
    stageName: 'Vlurxtrznbnaxl Lower City Search',
    mode: 'RPG',
    difficulty: 'Hard',
    bossName: 'Bigwig Captive Beast',
    title: { en: 'The Bizarre Adventures of Woodruff and the Schnibble', fr: 'Woodruff et le Schnibble d Azimuth' },
    desc: {
      en: 'A hand-painted point-and-click Thread set in the vertical dystopian city of Vlurxtrznbnaxl after returning humans conquered and oppressed the peaceful Boozooks. Woodruff, aged by Azimuths Viblefrotzer, must learn language, collect syllables, rebuild the Wisemens Council, free Azimuth, and oppose Bigwigs absurd bureaucracy.',
      fr: 'Une Trame point-and-click peinte a la main dans la ville verticale et dystopique de Vlurxtrznbnaxl, apres que les humains revenus a la surface ont conquis et opprime les paisibles Bouzouks. Vieilli par le Viblefrotzer d Azimuth, Woodruff doit apprendre le langage, reunir les syllabes, reformer le Conseil des Sages, liberer Azimuth et affronter la bureaucratie absurde de Bigwig.'
    },
    hero: hero('woodruff_hero', 'Woodruff', 'hacker', '#e1c34d', 'schnibble', 'Glove Slap', 'Tobozon Misdial', 'Transportozon Escape', 'Schnibble Syllable Release'),
    allies: [
      hero('professor_azimuth', 'Professor Azimuth', 'tactical', '#e8d26a', 'device', 'Viblefrotzer Pulse', 'Laboratory Override', 'Hidden Workshop Guard', 'Growth Formula Reversal'),
      hero('master_boozook', 'Boozook Master', 'hacker', '#5bbf88', 'syllable', 'Ear Control Lesson', 'Council Formula', 'Past Vision', 'Sage Council Convergence')
    ],
    monsters: [
      threat('Bigwig Henchman', '/sprites/generated/bosses/woodruff/bigwig-henchman.png', 'ray_pistol', 'Azimuth House Raid'),
      threat('Slammers End Jailer', '/sprites/generated/bosses/woodruff/slammers-end-jailer.png', 'prison_keys', 'Prison Tower Lockout'),
      threat('Factory Permit Guard', '/sprites/generated/bosses/woodruff/factory-permit-guard.png', 'work_permit', 'Factory Entrance Refusal')
    ],
    bosses: [
      threat('Schnibble Sect High Priest', '/sprites/generated/bosses/woodruff/schnibble-sect-high-priest.png', 'sacred_code', 'Chosen Initiate Donation Loop'),
      threat('Bigwig Captive Beast', '/sprites/generated/bosses/woodruff/bigwig-captive-beast.png', 'possession', 'Schprotznog Escape')
    ],
    worldBoss: threat('The Bigwig', '/sprites/generated/bosses/woodruff/the-bigwig.png', 'command', 'Schnibble Suppression Decree'),
    gear: [
      ['woodruff_tobozon', 'Tobozon Communicator', 'Communicateur Tobozon', { spd: 2, def: 5 }],
      ['woodruff_viblefrotzer', 'Viblefrotzer Regulator', 'Regulateur Viblefrotzer', { atk: 8, hp: 45 }],
      ['woodruff_syllable_stone', 'Council Syllable Stone', 'Pierre-syllabe du Conseil', { hp: 70, def: 4 }]
    ],
    event: ['evt_woodruff_schnibble_formula', 'Boozook Council Syllable Set', 'Jeu de pierres-syllabes du Conseil Bouzouk', 'The recovered physical syllable stones reform the Boozook Councils words and formulas. Their exact order exposes false permits, opens locked routes, and restores the Chprotznog.', 'Les pierres-syllabes physiques recuperees reforment les mots et les formules du Conseil Bouzouk. Leur ordre exact devoile les faux permis, ouvre les routes verrouillees et restaure le Chprotznog.'],
    decor: { sky: ['#382a19', '#080503'], floor: 'rgba(92, 131, 86, 0.18)', grid: 'rgba(225, 195, 77, 0.28)', motif: 'arcanecity', accent: '#e1c34d' },
    stageVariants: [
      { mode: 'Tactics', name: 'Administration Permit and Factory Gate', difficulty: 'Hard', bossName: 'Schnibble Sect High Priest' },
      { mode: 'Smash', name: 'Bigwig Apartment Schprotznog Trap', difficulty: 'Very Hard', bossName: 'The Bigwig' }
    ]
  });
}

export function createFeaturedUniverseNarrativeArcs() {
  return ({
    id: 'woodruff_schnibble_of_azimuth',
    title: { fr: 'Arc Univers - Woodruff: le Schnibble d Azimuth', en: 'Universe Arc - Woodruff: Azimuths Schnibble' },
    universes: ['Woodruff'],
    intro: {
      fr: 'Bigwig fait enlever Azimuth et detruire le foyer de Woodruff. Le Viblefrotzer du professeur transforme le jeune adopte demi-humain, demi-Bouzouk en adolescent avant que la ville de Vlurxtrznbnaxl ne puisse effacer les preuves.',
      en: 'Bigwig has Azimuth abducted and Woodruffs home destroyed. The professors Viblefrotzer ages his half-human, half-Boozook adopted son into a teenager before the city of Vlurxtrznbnaxl can erase the evidence.'
    },
    missions: [
      { fr: 'Intro - Laboratoire detruit: retrouver le Viblefrotzer, la trace d Azimuth et le souvenir du nounours qui donne a Woodruff une raison personnelle de poursuivre Bigwig.', en: 'Intro - Ruined Laboratory: recover the Viblefrotzer, Azimuths trail, and the memory of the teddy bear that gives Woodruff a personal reason to pursue Bigwig.' },
      { fr: 'Mission - Basse ville: utiliser Tobozons, Transportozons et services absurdes pour obtenir de vrais permis sans accepter les decrets contradictoires de l Administration.', en: 'Mission - Lower City: use Tobozons, Transportozons, and absurd public services to obtain real permits without accepting the Administrations contradictory decrees.' },
      { fr: 'Interlude - Memoire Bouzouk: apprendre les syllabes, decouvrir le passe des humains et des Bouzouks, puis comprendre pourquoi le Schnibble ne peut pas etre traite comme une arme.', en: 'Interlude - Boozook Memory: learn the syllables, uncover the history of humans and Boozooks, then understand why the Schnibble cannot be treated as a weapon.' },
      { fr: 'Mission - Conseil des Sages: retrouver les membres disperses, reconstituer leurs formules et annuler les faux titres avec la logique exacte de leurs mots.', en: 'Mission - Wisemens Council: find the scattered members, rebuild their formulas, and cancel false titles through the exact logic of their words.' },
      { fr: 'Boss - Palais de Bigwig: liberer Azimuth, exposer les mensonges du regime et laisser le Schnibble rendre la ville aux Bouzouks au lieu de la reprogrammer.', en: 'Boss - Bigwigs Palace: free Azimuth, expose the regimes lies, and let the Schnibble return the city to the Boozooks instead of reprogramming it.' }
    ],
    outro: { fr: 'Azimuth retrouve son fils adopte et le Conseil peut de nouveau parler avec des syllabes completes. La Breche conserve la satire, les enigmes et la memoire du monde au lieu de normaliser son absurdite.', en: 'Azimuth reunites with his adopted son and the Council can speak in complete syllables again. The Breach preserves the satire, puzzles, and world memory instead of normalizing its absurdity.' },
    reward: { fr: 'Transportozon d Azimuth + apparence Woodruff Viblefrotzer', en: 'Azimuth Transportozon + Viblefrotzer Woodruff skin' }
  });
}

export function createFeaturedEnemyLore({ localized }) {
  return ({
    'Bigwig Henchman': localized('Ces hommes de main en noir participent au raid contre la maison d Azimuth, enlevent le professeur et abattent le nounours de Woodruff. Ils representent la violence concrete derriere la bureaucratie.', 'These black-clad henchmen raid Azimuths home, abduct the professor, and shoot Woodruffs teddy bear. They are the concrete violence behind the bureaucracy.'),
    'Slammers End Jailer': localized('Le geolier de Slammers End bloque la tour de prison par sa fonction et ses clefs. Woodruff ne le vainc pas par la force: il doit obtenir la bonne route et le bon objet.', 'The Slammers End jailer blocks the prison tower through office and keys. Woodruff does not defeat him by force: he needs the right route and item.'),
    'Factory Permit Guard': localized('Le garde de l usine refuse toute entree sans certificat de travail. Dans le jeu, sa menace est administrative: une enigme de permis, pas un soldat fantastique invente.', 'The factory guard refuses entry without a work certificate. In the original game his threat is administrative: a permit puzzle, not an invented fantasy soldier.'),
    'Schnibble Sect High Priest': localized('Le Grand Pretre exige mantra, donations, code sacre et cycle de concentration avant de designer un initie. Son combat A.R.C.A. conserve cette boucle de manipulation sectaire.', 'The High Priest demands a mantra, donations, the sacred code, and a concentration cycle before choosing an initiate. His A.R.C.A. encounter preserves that cult manipulation loop.'),
    'Bigwig Captive Beast': localized('La bete liberee dans l appartement de Bigwig tente de posseder Woodruff. Le Bouzooioli permet de resister avant de la capturer dans le Schprotznog avec le chewing-gum.', 'The beast released inside Bigwigs apartment tries to possess Woodruff. Boozooioli resists it before the creature is trapped in the Schprotznog with chewing gum.'),
    'The Bigwig': localized('Bigwig est le conseiller corrompu qui gouverne la ville par impots, interdictions et police, fait enlever Azimuth et veut accaparer le Schnibble. Il reste un tyran humain, jamais un demon generique.', 'Bigwig is the corrupt adviser ruling the city through taxes, restrictions, and police, abducting Azimuth and seeking the Schnibble. He remains a human tyrant, never a generic demon.')
  });
}

export function createFeaturedStageLore({ localized }) {
  return ({
    RPG: localized('La basse ville de Vlurxtrznbnaxl reste une aventure point-and-click: apprendre a lire, composer des syllabes au Tobozon, parler aux habitants et relier les objets vaut mieux que frapper un faux monstre.', 'The lower city of Vlurxtrznbnaxl remains a point-and-click adventure: learning to read, dialing syllables on the Tobozon, speaking with residents, and connecting objects matter more than striking an invented monster.'),
    Tactics: localized('L Administration, la porte de lusine et le temple Bouzouk forment une carte de permis, codes et trajets. Chaque formule correcte change une regle de case et retire une interdiction reelle.', 'The Administration, factory gate, and Boozook temple form a map of permits, codes, and routes. Every correct formula changes one tile rule and removes a real restriction.'),
    Smash: localized('L appartement de Bigwig rejoue le final: Ceedeerom dans le lecteur, Viblefrotzer sur le tyran, carte magnetique, bete de possession puis Schprotznog arme de chewing-gum.', 'Bigwigs apartment reenacts the finale: Ceedeerom in the player, Viblefrotzer on the tyrant, magnetic card, possessing beast, then a Schprotznog prepared with chewing gum.')
  });
}

export function createFeaturedGearLore({ localized }) {
  return (localized('Le Tobozon compose des mots avec les syllabes apprises pour appeler personnes et services. Une mauvaise combinaison produit une mauvaise route, pas une attaque magique.', 'The Tobozon combines learned syllables to call people and services. A wrong combination produces a wrong route rather than a magic attack.'));
}

export function createFeaturedGearLore2({ localized }) {
  return (localized('Azimuth utilise le Viblefrotzer pour accelerer lage des cellules et permettre a Woodruff de quitter sa cachette sous une forme adolescente.', 'Azimuth uses the Viblefrotzer to accelerate cellular aging and let Woodruff leave hiding in an adolescent form.'));
}

export function createFeaturedGearLore3({ localized }) {
  return (localized('Les pierres-syllabes rendent au Conseil des Sages ses mots et ses formules. Leur ordre exact permet de comprendre le passe Bouzouk et de retablir le Chprotznog.', 'Syllable stones restore words and formulas to the Wisemens Council. Their exact order reveals Boozook history and restores the Chprotznog.'));
}

export function createFeaturedBackdrops() {
  return ({
    RPG: '/backgrounds/featured/woodruff-rpg-openai.png',
    Tactics: '/backgrounds/featured/woodruff-tactics-openai.png',
    Smash: '/backgrounds/featured/woodruff-smash-openai.png'
  });
}

export function createFeaturedCharacterPlaques({ plaque }) {
  return (plaque(
    'Woodruff est le fils adoptif mi-humain mi-Bouzouk du professeur Azimuth. Le Viblefrotzer le fait vieillir d environ quinze ans en quelques secondes; encore illetre, pieds nus et mentalement jeune, il part sauver Azimuth, venger son ours et comprendre le Schnibble.',
    'Woodruff is Professor Azimuths adopted half-human, half-Boozook son. The Viblefrotzer ages him roughly fifteen years in seconds; still illiterate, barefoot, and mentally young, he leaves to save Azimuth, avenge his teddy bear, and understand the Schnibble.',
    'La Breche transforme les formulaires de Bigwig en verrous reels. Woodruff progresse comme dans son aventure: il apprend, collecte des syllabes, obtient des certificats absurdes, reforme le Conseil des Sages et gagne par une solution de puzzle plutot que par une puissance inventee.',
    'The Breach turns Bigwigs paperwork into physical locks. Woodruff progresses as in his adventure: he learns, collects syllables, obtains absurd certificates, rebuilds the Wisemens Council, and wins through puzzle logic rather than invented power.',
    'Tobozon, Transportozon, formules de syllabes, objets combines et Schnibble.',
    'Tobozon, Transportozon, syllable formulas, combined objects, and the Schnibble.',
    ['Schnibble', 'Viblefrotzer', 'point and click']
  ));
}

export function createFeaturedCharacterPlaques2({ plaque }) {
  return (plaque(
    'Azimuth cache ses recherches dans une maison-laboratoire et protege Woodruff apres la guerre contre les Bouzouks. Son Viblefrotzer est un accelerateur de croissance improvise, pas une arme de combat.',
    'Azimuth hides his research inside a house laboratory and protects Woodruff after the war against the Boozooks. His Viblefrotzer is an improvised growth accelerator, not a combat weapon.',
    'A.R.C.A. lui confie les anomalies d age et de causalite que Bigwig utilise pour falsifier les dossiers. Azimuth stabilise Woodruff sans annuler ce que la machine lui a fait et transforme son laboratoire en point de retour.',
    'A.R.C.A. assigns him age and causality anomalies Bigwig uses to falsify records. Azimuth stabilizes Woodruff without undoing what the machine did and turns his laboratory into a return point.',
    'Reglage du Viblefrotzer, appareils de laboratoire, cache secrete et formule de croissance.',
    'Viblefrotzer tuning, laboratory devices, hidden workshop, and growth formula.',
    ['Azimuth', 'laboratory', 'Viblefrotzer']
  ));
}

export function createFeaturedCharacterPlaques3({ plaque }) {
  return (plaque(
    'Le Maitre Bouzouk transmet a Woodruff des controles corporels et l aide a relier les Sages, les syllabes et les formules necessaires au Conseil.',
    'The Boozook Master teaches Woodruff bodily controls and helps connect the Wisemen, syllables, and formulas required by the Council.',
    'Dans Multiverse Breach, il conserve la grammaire Bouzouk lorsque le Sans-Auteur remplace les mots par des icones sans sens. Ses formules donnent au terrain une logique lisible et rendent les faux decrets de Bigwig contradictoires.',
    'In Multiverse Breach, he preserves Boozook grammar when the Authorless replaces words with meaningless icons. His formulas give the field readable logic and make Bigwigs false decrees contradict themselves.',
    'Syllabes, formules, controle corporel, memoire du passe et Conseil des Sages.',
    'Syllables, formulas, body control, past memory, and the Wisemens Council.',
    ['Boozook', 'Wisemen', 'syllables']
  ));
}

export function createFeaturedBattleItemOverrides() {
  return ({
    pickups: [
      ['Tobozon public', 'Public Tobozon', 'Compose un contact, appelle un service ou transmet une preuve a distance selon la piece active.'],
      ['Transportozon d Azimuth', 'Azimuth Transportozon', 'Ramene le porteur vers un lieu deja visite sans inventer un teleporteur de combat hors lore.'],
      ['Pierre-syllabe', 'Syllable Stone', 'Ajoute un mot a une formule Bouzouk et change la regle dune case verrouillee.']
    ],
    summon: ['Viblefrotzer d Azimuth', 'Azimuths Viblefrotzer', 'Lappareil d Azimuth accelere lage cellulaire de Woodruff puis sert contre Bigwig au moment precis du plan final.'],
    ultimate: ['Chprotznog bloque au chewing-gum', 'Chewing-Gum-Locked Chprotznog', 'Le Chprotznog est suspendu au crochet puis verrouille avec le chewing-gum afin de capturer physiquement la Bete.']
  });
}
