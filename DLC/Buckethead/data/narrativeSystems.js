// Buckethead — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'buckethead_bucketheadland_labyrinth',
    title: { fr: 'Arc Univers - Buckethead: labyrinthe Bucketheadland', en: 'Universe Arc - Buckethead: Bucketheadland Labyrinth' },
    universes: ['Buckethead'],
    intro: { fr: 'A.R.C.A. detecte une Trame musicale sans paroles: un parc instrumental ou le masque blanc, le bucket et les riffs ouvrent des couloirs que les cartes ne comprennent pas.', en: 'A.R.C.A. detects a wordless music Thread: an instrumental park where white mask, bucket, and riffs open corridors maps cannot understand.' },
    missions: [
      { fr: 'Intro - Portail silencieux: entrer dans Bucketheadland sans forcer le personnage a parler pour expliquer ses regles.', en: 'Intro - Silent Gate: enter Bucketheadland without forcing the persona to speak its rules.' },
      { fr: 'Mission - Salle des Pikes: suivre trois riffs differents pour separer shred, melancolie et arcade-horreur.', en: 'Mission - Pike Hall: follow three different riffs to separate shred, melancholy, and arcade-horror.' },
      { fr: 'Interlude - Death Cube K: une nappe sombre ralentit la carte et revele que le silence est une porte.', en: 'Interlude - Death Cube K: a dark drone slows the map and reveals silence is a door.' },
      { fr: 'Mission - Giant Robot Riff Engine: couper les automates qui rejouent les solos comme des boucles sans ame.', en: 'Mission - Giant Robot Riff Engine: cut automata replaying solos as soulless loops.' },
      { fr: 'Boss - Automate Bucketheadland: vaincre la copie mecanique avant qu elle ne remplace la Persona par un masque vide.', en: 'Boss - Bucketheadland Automaton: defeat the mechanical copy before it replaces the Persona with an empty mask.' }
    ],
    outro: { fr: 'Le labyrinthe reste etrange, mais il redevient musical. A.R.C.A. archive Buckethead comme Trame de resonance: elle se comprend par trajectoire, pas par discours.', en: 'The labyrinth remains strange, but becomes musical again. A.R.C.A. archives Buckethead as a resonance Thread: understood by trajectory, not speech.' },
    reward: { fr: 'Relique Masque blanc + mediator Pike', en: 'White Mask Relic + Pike pick' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'buckethead_silent_mask',
    stageId: 9229,
    heroId: 'buckethead_avatar',
    title: { fr: 'Arc Personnage - Buckethead: masque silencieux', en: 'Character Arc - Buckethead: Silent Mask' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Automate au masque vide',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Le Sans-Auteur tente de retirer le silence de Buckethead pour ne garder qu une icone creuse. A.R.C.A. doit proteger la Persona sans expliquer ce qui doit rester mysterieux.', en: 'The Authorless tries to remove Buckethead silence and keep only a hollow icon. A.R.C.A. must protect the Persona without explaining what should remain mysterious.' },
    missions: [
      { fr: 'Mission 1 - Masque blanc: recuperer la signature visuelle avant qu elle ne devienne un simple skin vide.', en: 'Mission 1 - White Mask: recover the visual signature before it becomes a hollow skin.' },
      { fr: 'Mission 2 - Couloir Soothsayer: suivre une melodie longue sans la couper en objectif banal.', en: 'Mission 2 - Soothsayer Corridor: follow a long melody without cutting it into a banal objective.' },
      { fr: 'Mission 3 - Bucketheadland: fermer l automate qui imite les gestes sans comprendre le rythme.', en: 'Mission 3 - Bucketheadland: shut down the automaton that copies gestures without understanding rhythm.' }
    ],
    outro: { fr: 'Buckethead ne donne pas de discours final. Une ligne de guitare suffit a marquer la sortie.', en: 'Buckethead gives no final speech. One guitar line is enough to mark the exit.' },
    reward: { fr: 'Apparence Bucketheadland + resonateur masque blanc', en: 'Bucketheadland Skin + white mask resonator' },
    rewardItemId: 'char_buckethead_bucketheadland'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'death_cube_k_shadow_drone',
    stageId: 9230,
    heroId: 'death_cube_k_echo',
    title: { fr: 'Arc Personnage - Death Cube K: drone d ombre', en: 'Character Arc - Death Cube K: Shadow Drone' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Drone sans sortie',
    unlock: { type: 'clears', value: 5 },
    intro: { fr: 'Une nappe Death Cube K s etire dans le Nexus jusqu a ralentir les menus eux-memes. Il faut garder l ombre comme protection, pas comme prison.', en: 'A Death Cube K drone stretches through the Nexus until even menus slow down. The shadow must stay protection, not prison.' },
    missions: [
      { fr: 'Mission 1 - Nappe noire: ralentir les ennemis sans figer l escouade dans une boucle ambient.', en: 'Mission 1 - Black Drone: slow enemies without freezing the squad inside an ambient loop.' },
      { fr: 'Mission 2 - Parc eteint: trouver les couloirs caches dans Bucketheadland apres extinction des lumieres.', en: 'Mission 2 - Dark Park: find hidden corridors in Bucketheadland after the lights go out.' },
      { fr: 'Mission 3 - Echo inverse: vaincre le Drone sans sortie avant qu il ne transforme le silence en effacement.', en: 'Mission 3 - Inverted Echo: defeat the Exitless Drone before it turns silence into deletion.' }
    ],
    outro: { fr: 'L echo sombre recule mais laisse une mesure de protection. A.R.C.A. classe Death Cube K comme ombre utile, jamais comme fond generique.', en: 'The dark echo retreats but leaves one measure of protection. A.R.C.A. classifies Death Cube K as useful shadow, never generic ambience.' },
    reward: { fr: 'Apparence Death Cube K + drone protecteur', en: 'Death Cube K Skin + protective drone' },
    rewardItemId: 'char_death_cube_k_shadow'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'pike_riff_archive',
    stageId: 9231,
    heroId: 'pike_riff_signal',
    title: { fr: 'Arc Personnage - Pike Signal: archive de riffs', en: 'Character Arc - Pike Signal: Riff Archive' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Archive Pike corrompue',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'La Pike Series devient une carte trop vaste: chaque piste ouvre une porte differente. Pike Signal doit rendre le labyrinthe jouable sans reduire la musique a une liste.', en: 'The Pike Series becomes a map too vast: each track opens a different door. Pike Signal must make the labyrinth playable without reducing music to a list.' },
    missions: [
      { fr: 'Mission 1 - Mediator Pike: retrouver le motif qui ouvre la premiere salle de riff.', en: 'Mission 1 - Pike Pick: recover the motif opening the first riff room.' },
      { fr: 'Mission 2 - Variation arcade: changer de tempo avant que les automates ne copient la route.', en: 'Mission 2 - Arcade Variation: shift tempo before automata copy the route.' },
      { fr: 'Mission 3 - Cascade archive: vaincre l Archive corrompue et graver une sortie dans la derniere mesure.', en: 'Mission 3 - Archive Cascade: defeat the corrupted Archive and carve an exit into the final measure.' }
    ],
    outro: { fr: 'Pike Signal ne ferme pas les archives: il les ordonne assez pour que l escouade puisse y revenir.', en: 'Pike Signal does not close the archives: it orders them enough for the squad to return.' },
    reward: { fr: 'Apparence Pike Signal + mediator archive', en: 'Pike Signal Skin + archive pick' },
    rewardItemId: 'char_pike_riff_archive'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_buckethead_bucketheadland',
    heroId: 'buckethead_avatar',
    name: { fr: 'Bucketheadland', en: 'Bucketheadland' },
    colors: { primaryColor: '#f5f5f5', secondaryColor: '#181818' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_death_cube_k_shadow',
    heroId: 'death_cube_k_echo',
    name: { fr: 'Death Cube K Ombre', en: 'Death Cube K Shadow' },
    colors: { primaryColor: '#1a1a1a', secondaryColor: '#9d9d9d' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_pike_riff_archive',
    heroId: 'pike_riff_signal',
    name: { fr: 'Pike Signal Archive', en: 'Pike Signal Archive' },
    colors: { primaryColor: '#d9d9d9', secondaryColor: '#f5f5f5' }
  });
}
