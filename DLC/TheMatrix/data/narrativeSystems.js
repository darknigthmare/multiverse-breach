// The Matrix — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'matrix_source_rebellion',
    title: { fr: 'Arc Univers - The Matrix: rebellion de la Source', en: 'Universe Arc - The Matrix: Source Rebellion' },
    universes: ['The Matrix'],
    intro: { fr: 'Une poche de Matrice s ouvre dans le Nexus. Elle ne simule pas un decor: elle simule des choix, puis tente de prouver que chaque choix etait deja ecrit.', en: 'A Matrix pocket opens inside the Nexus. It does not simulate scenery: it simulates choices, then tries to prove every choice was already written.' },
    missions: [
      { fr: 'Intro - Pilule rouge: identifier les profils encore endormis sans casser leur droit de choisir la verite.', en: 'Intro - Red Pill: identify still-sleeping profiles without breaking their right to choose truth.' },
      { fr: 'Mission - Lobby systeme: traverser une securite Agent/SWAT pendant que l operateur cherche un telephone de sortie.', en: 'Mission - System Lobby: cross Agent/SWAT security while the operator searches for an exit phone.' },
      { fr: 'Interlude - Programme exile: le Merovingien cache une cle de causalite dans une mission qui se repete.', en: 'Interlude - Exile Program: the Merovingian hides a causality key inside a repeating mission.' },
      { fr: 'Mission - Siege de Zion: empecher les Sentinels de transformer la Cite-Mosaique en ferme de batteries.', en: 'Mission - Siege of Zion: prevent Sentinels from turning Mosaic City into a battery farm.' },
      { fr: 'Boss - Source Smith: vaincre un Smith recode avant qu il ne copie le Sans-Auteur dans chaque avatar.', en: 'Boss - Source Smith: defeat a recoded Smith before he copies the Authorless into every avatar.' }
    ],
    outro: { fr: 'La Source perd le monopole du choix. A.R.C.A. classe Matrix comme guerre de controle: le vrai objectif n est pas de casser le code, mais de rendre la sortie possible.', en: 'The Source loses its monopoly on choice. A.R.C.A. classifies Matrix as a war of control: the real goal is not breaking code, but making exit possible.' },
    reward: { fr: 'Relique Pilule rouge + telephone de sortie Zion', en: 'Red Pill Relic + Zion exit phone' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'neo_choice_source',
    stageId: 9207,
    heroId: 'neo',
    title: { fr: 'Arc Personnage - Choix source', en: 'Character Arc - Source Choice' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Agent Racine',
    unlock: { type: 'level', value: 4 },
    intro: { fr: 'Neo ne voit pas seulement le code du Nexus: il voit les endroits ou le code ment pour proteger une histoire.', en: 'Neo does not only see Nexus code: he sees where the code lies to protect a story.' },
    missions: [
      { fr: 'Lire une mission avant qu elle ne soit generee.', en: 'Read a mission before it is generated.' },
      { fr: 'Desobeir a une prediction d A.R.C.A. sans fissurer la trace memoire.', en: 'Disobey an A.R.C.A. prediction without cracking the memory trace.' },
      { fr: 'Affronter l Agent Racine dans une matrice sans sortie rouge ou bleue.', en: 'Face the Root Agent in a matrix with no red or blue exit.' }
    ],
    outro: { fr: 'Le choix devient une mecanique: le Nexus accepte enfin l imprevisible.', en: 'Choice becomes a mechanic: the Nexus finally accepts the unpredictable.' },
    reward: { fr: 'Apparence Code Libre + fragment de Source', en: 'Free Code Appearance + Source Fragment' },
    rewardItemId: 'char_neo_free_code'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'trinity_exit_phone',
    stageId: 9227,
    heroId: 'trinity',
    title: { fr: 'Arc Personnage - Trinity: telephone de sortie', en: 'Character Arc - Trinity: Exit Phone' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Agent de verrouillage',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Le Sans-Auteur efface les telephones de sortie un par un. Trinity entre dans la simulation pour prouver qu une route existe encore quand le systeme affirme le contraire.', en: 'The Authorless deletes exit phones one by one. Trinity enters the simulation to prove a route still exists when the system claims otherwise.' },
    missions: [
      { fr: 'Mission 1 - Trace blanche: retrouver une ligne de telephone cachee dans un immeuble rempli d Agents.', en: 'Mission 1 - White Trace: recover a hidden phone line inside an Agent-filled building.' },
      { fr: 'Mission 2 - Course de toit: proteger l Ancre pendant que les programmes SWAT verrouillent les escaliers.', en: 'Mission 2 - Rooftop Run: protect the Anchor while SWAT programs lock the stairwells.' },
      { fr: 'Mission 3 - Extraction moto: ouvrir une sortie mobile avant que le code ne transforme la route en boucle.', en: 'Mission 3 - Motorcycle Extraction: open a moving exit before code turns the road into a loop.' }
    ],
    outro: { fr: 'Trinity ne detruit pas la Matrice: elle ramene quelqu un dehors. A.R.C.A. classe son protocole comme extraction humaine prioritaire.', en: 'Trinity does not destroy the Matrix: she brings someone out. A.R.C.A. classifies her protocol as priority human extraction.' },
    reward: { fr: 'Apparence Trinity Nebuchadnezzar + ligne de sortie', en: 'Nebuchadnezzar Trinity Skin + exit line' },
    rewardItemId: 'char_trinity_nebuchadnezzar'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'morpheus_red_pill_doctrine',
    stageId: 9228,
    heroId: 'morpheus',
    title: { fr: 'Arc Personnage - Morpheus: doctrine pilule rouge', en: 'Character Arc - Morpheus: Red Pill Doctrine' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Architecte de Prophecie',
    unlock: { type: 'clears', value: 5 },
    intro: { fr: 'Une simulation A.R.C.A. commence a expliquer trop bien les regles, jusqu a retirer le choix. Morpheus comprend le piege: une verite imposee devient une autre prison.', en: 'An A.R.C.A. simulation starts explaining the rules too well, until it removes choice. Morpheus understands the trap: imposed truth becomes another prison.' },
    missions: [
      { fr: 'Mission 1 - Dojo charge: entrainer une cellule sans confondre preparation et programmation.', en: 'Mission 1 - Loaded Dojo: train a cell without confusing preparation with programming.' },
      { fr: 'Mission 2 - Pilule rouge: proposer la verite a des signatures endormies sans forcer leur reveil.', en: 'Mission 2 - Red Pill: offer truth to sleeping signatures without forcing their awakening.' },
      { fr: 'Mission 3 - Architecte miroir: briser une prophetie qui transforme Neo, Trinity et l Ancre en variables obligatoires.', en: 'Mission 3 - Mirror Architect: break a prophecy turning Neo, Trinity, and the Anchor into mandatory variables.' }
    ],
    outro: { fr: 'Morpheus garde la foi, mais refuse le script. A.R.C.A. archive sa lecon: guider n est pas programmer.', en: 'Morpheus keeps faith, but refuses the script. A.R.C.A. archives his lesson: guiding is not programming.' },
    reward: { fr: 'Apparence Morpheus Pilule Rouge + module dojo', en: 'Red Pill Morpheus Skin + dojo module' },
    rewardItemId: 'char_morpheus_red_pill'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_neo_free_code',
    heroId: 'neo',
    name: { fr: 'Code Libre', en: 'Free Code' },
    colors: { primaryColor: '#050505', secondaryColor: '#41ff7a' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_trinity_nebuchadnezzar',
    heroId: 'trinity',
    name: { fr: 'Trinity Nebuchadnezzar', en: 'Nebuchadnezzar Trinity' },
    colors: { primaryColor: '#050505', secondaryColor: '#39ff6e' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_morpheus_red_pill',
    heroId: 'morpheus',
    name: { fr: 'Morpheus Pilule Rouge', en: 'Red Pill Morpheus' },
    colors: { primaryColor: '#34495e', secondaryColor: '#c0392b' }
  });
}
