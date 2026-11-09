// Resident Evil — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'resident_evil_raccoon_lockdown',
    title: { fr: 'Arc Univers - Resident Evil: quarantaine Raccoon City', en: 'Universe Arc - Resident Evil: Raccoon City Quarantine' },
    universes: ['Resident Evil'],
    intro: { fr: 'Raccoon City se reconstruit dans une poche de Breche: le R.P.D., les egouts, le laboratoire NEST et les sirenes Umbrella cherchent a redevenir une experience.', en: 'Raccoon City rebuilds inside a Breach pocket: the R.P.D., sewers, NEST laboratory, and Umbrella sirens try to become an experiment again.' },
    missions: [
      { fr: 'Intro - Premier jour: entrer dans le R.P.D. et comprendre quelle souche virale a traverse le Nexus.', en: 'Intro - First Day: enter the R.P.D. and identify which viral strain crossed the Nexus.' },
      { fr: 'Mission - Clefs et rubans: recuperer les preuves Umbrella sans gaspiller les munitions de crise.', en: 'Mission - Keys and Ribbons: recover Umbrella evidence without wasting crisis ammunition.' },
      { fr: 'Interlude - NEST respire: le laboratoire classe les survivants comme specimens de Trame.', en: 'Interlude - NEST Breathes: the lab classifies survivors as Thread specimens.' },
      { fr: 'Mission - Mutation G: couper les incubateurs avant que Birkin ne contamine la sortie.', en: 'Mission - G Mutation: cut incubators before Birkin contaminates the exit.' },
      { fr: 'Boss - Tyrant de quarantaine: vaincre l arme B.O.W. chargee d empecher toute extraction A.R.C.A.', en: 'Boss - Quarantine Tyrant: defeat the B.O.W. weapon ordered to prevent any A.R.C.A. extraction.' }
    ],
    outro: { fr: 'La ville ne disparait pas comme un simple decor zombie: elle laisse un dossier. Umbrella a voulu cacher l incident; A.R.C.A. le rend lisible.', en: 'The city does not vanish as a simple zombie backdrop: it leaves a file. Umbrella wanted the incident hidden; A.R.C.A. makes it readable.' },
    reward: { fr: 'Dossier NEST scelle + cache R.P.D.', en: 'Sealed NEST File + R.P.D. cache' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'leon_last_door',
    stageId: 9206,
    heroId: 'leon',
    title: { fr: 'Arc Personnage - Leon: derniere porte R.P.D.', en: 'Character Arc - Leon: Last R.P.D. Door' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Tyrant T-00 Ruban-Memoire',
    unlock: { type: 'clears', value: 5 },
    intro: {
      fr: 'Une section de Raccoon City se reconstitue dans la Breche: hall du R.P.D., chambre noire, couloirs de Lickers, laboratoire Umbrella et portes qui changent de serrure quand A.R.C.A. les regarde. Leon comprend le piege: le Sans-Auteur utilise la logique Resident Evil pour transformer chaque survivant en specimen et chaque sauvegarde en dossier Umbrella.',
      en: 'A section of Raccoon City rebuilds itself inside the Breach: R.P.D. hall, darkroom, Licker corridors, Umbrella lab, and doors that change locks whenever A.R.C.A. looks at them. Leon understands the trap: the Authorless is using Resident Evil logic to turn every survivor into a specimen and every save point into an Umbrella file.'
    },
    missions: [
      {
        fr: 'Mission 1 - Hall principal: escorter une survivante jusqu a la chambre noire, recuperer une herbe verte et garder assez de munitions pour contenir zombies et Cerberus.',
        en: 'Mission 1 - Main Hall: escort a survivor to the darkroom, recover a green herb, and keep enough ammunition to contain zombies and Cerberus dogs.'
      },
      {
        fr: 'Mission 2 - Couloir Licker: trouver le ruban encreur infecte avant Umbrella, utiliser flash R.P.D. et viseur laser pour traverser sans transformer l alarme en massacre.',
        en: 'Mission 2 - Licker Corridor: find the infected ink ribbon before Umbrella, using R.P.D. flash and laser sight discipline to cross without turning the alarm into a massacre.'
      },
      {
        fr: 'Mission 3 - Laboratoire G: couper la liaison G-Virus du noyau de Breche, neutraliser Hunters et embryons mutants, puis ouvrir la derniere porte d extraction.',
        en: 'Mission 3 - G Laboratory: sever the G-Virus link from the Breach core, neutralize Hunters and embryo mutants, then open the final extraction door.'
      }
    ],
    outro: {
      fr: 'Le Tyrant T-00 Ruban-Memoire s effondre devant la sortie, incapable de transformer la sauvegarde en prison. Leon remet a A.R.C.A. un ruban encreur propre: preuve qu une Trame Resident Evil peut rester survival-horror sans devenir simple horde zombie.',
      en: 'The Memory-Ribbon T-00 Tyrant collapses at the exit, unable to turn the save point into a prison. Leon gives A.R.C.A. a clean ink ribbon: proof that a Resident Evil Thread can stay survival horror without becoming a generic zombie horde.'
    },
    reward: { fr: 'Apparence R.P.D. Raccoon City + cle ruban encreur propre', en: 'Raccoon City R.P.D. Skin + Clean Ink Ribbon Key' },
    rewardItemId: 'char_leon_rpd_nexus'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'jill_nemesis_lockdown',
    stageId: 9213,
    heroId: 'jill',
    title: { fr: 'Arc Personnage - Jill: protocole Nemesis', en: 'Character Arc - Jill: Nemesis Protocol' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Nemesis T-Type recode',
    unlock: { type: 'level', value: 3 },
    intro: {
      fr: 'Une portion de Raccoon City rejoue la traque de Jill, mais la Breche modifie les serrures: chaque porte ouverte peut liberer des survivants ou donner a Nemesis une nouvelle route. Jill refuse que le Sans-Auteur transforme la poursuite en boucle parfaite.',
      en: 'A section of Raccoon City replays Jill pursuit, but the Breach changes the locks: every opened door can free survivors or give Nemesis a new route. Jill refuses to let the Authorless turn the chase into a perfect loop.'
    },
    missions: [
      {
        fr: 'Mission 1 - Rue barricadee: recuperer un crochet S.T.A.R.S., ouvrir une pharmacie verrouillee et extraire des civils avant que les Cerberus ne coupent la retraite.',
        en: 'Mission 1 - Barricaded Street: recover a S.T.A.R.S. lockpick, open a sealed pharmacy, and extract civilians before Cerberus dogs cut off retreat.'
      },
      {
        fr: 'Mission 2 - Sous-station infectee: retablir le courant, neutraliser Hunters et Lickers, puis poser une contre-mesure qui force Nemesis a quitter sa route ideale.',
        en: 'Mission 2 - Infected Substation: restore power, neutralize Hunters and Lickers, then deploy a countermeasure that forces Nemesis off his ideal route.'
      },
      {
        fr: 'Mission 3 - Tour d evacuation: utiliser herbes, munitions rares et esquive S.T.A.R.S. pour guider l evacuation pendant que Nemesis recode les points de sauvegarde.',
        en: 'Mission 3 - Evacuation Tower: use herbs, scarce ammunition, and S.T.A.R.S. evasion to guide extraction while Nemesis recodes save points.'
      }
    ],
    outro: {
      fr: 'Nemesis tombe sans que Jill accepte son role de proie. A.R.C.A. archive le protocole: une poursuite Resident Evil doit creer de la tension, pas retirer le choix du survivant.',
      en: 'Nemesis falls without Jill accepting the role of prey. A.R.C.A. archives the protocol: a Resident Evil pursuit must create tension, not remove survivor choice.'
    },
    reward: { fr: 'Apparence S.T.A.R.S. Last Escape + crochet de Trame', en: 'Last Escape S.T.A.R.S. Skin + Thread Lockpick' },
    rewardItemId: 'char_jill_last_escape'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'wesker_uroboros_selection',
    stageId: 9214,
    heroId: 'wesker',
    title: { fr: 'Arc Personnage - Wesker: selection Uroboros', en: 'Character Arc - Wesker: Uroboros Selection' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Prototype Uroboros Sans-Auteur',
    unlock: { type: 'clears', value: 8 },
    intro: {
      fr: 'A.R.C.A. ouvre un dossier interdit: une copie de laboratoire Umbrella tente d utiliser la Breche comme filtre d evolution. Wesker accepte d entrer dans la zone, mais personne ne sait s il veut la fermer ou prouver qu elle lui appartient deja.',
      en: 'A.R.C.A. opens a forbidden file: an Umbrella lab copy is trying to use the Breach as an evolution filter. Wesker agrees to enter the zone, but nobody knows whether he wants to close it or prove it already belongs to him.'
    },
    missions: [
      {
        fr: 'Mission 1 - Laboratoire sous scelle: voler les donnees Uroboros avant qu Umbrella ne les synchronise avec le Sans-Auteur.',
        en: 'Mission 1 - Sealed Laboratory: steal Uroboros data before Umbrella synchronizes it with the Authorless.'
      },
      {
        fr: 'Mission 2 - Chambre de selection: eliminer les sujets instables sans permettre a Wesker de transformer l essai en recrutement personnel.',
        en: 'Mission 2 - Selection Chamber: eliminate unstable subjects without letting Wesker turn the trial into personal recruitment.'
      },
      {
        fr: 'Mission 3 - Noyau Uroboros: affronter un prototype qui veut faire du multivers entier une experience de tri viral.',
        en: 'Mission 3 - Uroboros Core: face a prototype that wants to turn the whole multiverse into a viral selection experiment.'
      }
    ],
    outro: {
      fr: 'Wesker remet les donnees a A.R.C.A., mais conserve un silence trop long. Le Nexus gagne un protocole anti-Umbrella; Wesker gagne la preuve que la Breche peut etre exploitee. Les deux camps le savent.',
      en: 'Wesker gives the data to A.R.C.A., but keeps silent too long. The Nexus gains an anti-Umbrella protocol; Wesker gains proof that the Breach can be exploited. Both sides know it.'
    },
    reward: { fr: 'Apparence Wesker Uroboros scelle + protocole anti-labo', en: 'Sealed Uroboros Wesker Skin + Anti-Lab Protocol' },
    rewardItemId: 'char_wesker_uroboros_sealed'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_leon_rpd_nexus',
    heroId: 'leon',
    name: { fr: 'R.P.D. Raccoon City', en: 'Raccoon City R.P.D.' },
    colors: { primaryColor: '#1d4e89', secondaryColor: '#f5d76e' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_jill_last_escape',
    heroId: 'jill',
    name: { fr: 'S.T.A.R.S. Last Escape', en: 'Last Escape S.T.A.R.S.' },
    colors: { primaryColor: '#214b8f', secondaryColor: '#79d0ff' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_wesker_uroboros_sealed',
    heroId: 'wesker',
    name: { fr: 'Uroboros scelle', en: 'Sealed Uroboros' },
    colors: { primaryColor: '#101820', secondaryColor: '#d7f26b' }
  });
}
