// Half-Life — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'half_life_resonance_cascade',
    title: { fr: 'Arc Univers - Half-Life: cascade de resonance', en: 'Universe Arc - Half-Life: Resonance Cascade' },
    universes: ['Half-Life'],
    intro: { fr: 'Black Mesa se rouvre au moment exact ou la science cesse d etre controlee: Xen traverse les murs, le HECU descend, puis le Combine ecoute depuis l avenir.', en: 'Black Mesa reopens at the exact moment science stops being controlled: Xen crosses the walls, HECU descends, then the Combine listens from the future.' },
    missions: [
      { fr: 'Intro - Materiaux anormaux: stabiliser le cristal Xen avant qu il ne synchronise d autres univers.', en: 'Intro - Anomalous Materials: stabilize the Xen crystal before it synchronizes other universes.' },
      { fr: 'Mission - Complexe Lambda: ouvrir une route entre scientifiques, securite et Resistance naissante.', en: 'Mission - Lambda Complex: open a route between scientists, security, and the future Resistance.' },
      { fr: 'Interlude - Observation G-Man: une offre apparait dans les marges du rapport A.R.C.A.', en: 'Interlude - G-Man Observation: an offer appears in the margins of the A.R.C.A. report.' },
      { fr: 'Mission - Xen instable: fermer les nids aliennes sans tuer les Vortigaunts liberables.', en: 'Mission - Unstable Xen: close alien nests without killing Vortigaunts who can be freed.' },
      { fr: 'Boss - Relais Strider: detruire le signal Combine avant qu il ne convertisse la Breche en occupation.', en: 'Boss - Strider Relay: destroy the Combine signal before it turns the Breach into an occupation.' }
    ],
    outro: { fr: 'La cascade se calme, mais Black Mesa reste une blessure scientifique. A.R.C.A. note que comprendre une anomalie ne signifie pas la posseder.', en: 'The cascade quiets, but Black Mesa remains a scientific wound. A.R.C.A. notes that understanding an anomaly does not mean owning it.' },
    reward: { fr: 'Module Lambda stabilise + combinaison HEV archive', en: 'Stabilized Lambda Module + archived HEV suit' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'freeman_silent_key',
    stageId: 9202,
    heroId: 'freeman',
    title: { fr: 'Arc Personnage - Freeman: cascade silencieuse', en: 'Character Arc - Freeman: Silent Cascade' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Strider Combine de Resonance',
    unlock: { type: 'level', value: 3 },
    intro: {
      fr: 'La Breche reproduit l instant critique de Black Mesa: materiaux anormaux, combinaison HEV, portail Xen et un signal Combine qui attend de coloniser la faille. Freeman ne parle pas; son trajet suffit a indiquer ce qui doit etre ferme.',
      en: 'The Breach reproduces Black Mesa critical instant: anomalous materials, HEV suit, Xen portal, and a Combine signal waiting to colonize the rift. Freeman does not speak; his route is enough to show what must be closed.'
    },
    missions: [
      { fr: 'Mission 1 - Materiaux anormaux: stabiliser la combinaison HEV et retirer les cristaux Xen avant que la cascade ne gagne une autre Trame.', en: 'Mission 1 - Anomalous Materials: stabilize the HEV suit and remove Xen crystals before the cascade reaches another Thread.' },
      { fr: 'Mission 2 - Couloir Xen: utiliser pied-de-biche, snarks et gravity gun pour traverser une ligne de headcrabs, bullsquids et vortigaunts hostiles.', en: 'Mission 2 - Xen Corridor: use crowbar, snarks, and gravity gun to cross a line of headcrabs, bullsquids, and hostile vortigaunts.' },
      { fr: 'Mission 3 - Signal Combine: detruire un relais Strider avant qu il ne transforme la Breche Black Mesa en occupation permanente.', en: 'Mission 3 - Combine Signal: destroy a Strider relay before it turns the Black Mesa Breach into permanent occupation.' }
    ],
    outro: {
      fr: 'La cascade se referme sans ordre verbal. A.R.C.A. classe Freeman comme une coordonnee vivante: la preuve qu une Trame Half-Life peut rester scientifique, hostile et lisible sans expliquer son mystere.',
      en: 'The cascade closes without a verbal order. A.R.C.A. classifies Freeman as a living coordinate: proof that a Half-Life Thread can stay scientific, hostile, and readable without explaining away its mystery.'
    },
    reward: { fr: 'Apparence HEV Black Mesa + Module saut long instable', en: 'Black Mesa HEV Skin + Unstable Long Jump Module' },
    rewardItemId: 'char_freeman_hev_nexus'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'barney_resistance_door',
    stageId: 9215,
    heroId: 'barney',
    title: { fr: 'Arc Personnage - Barney: porte de Resistance', en: 'Character Arc - Barney: Resistance Door' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Officier Combine recode',
    unlock: { type: 'level', value: 3 },
    intro: {
      fr: 'Une zone Black Mesa/City 17 se superpose dans la Breche: couloirs de securite, sirenes de confinement, scanners Combine et civils sans route de sortie. Barney sait que tenir une porte peut sauver plus qu une bataille.',
      en: 'A Black Mesa/City 17 zone overlaps inside the Breach: security corridors, containment sirens, Combine scanners, and civilians with no exit route. Barney knows holding a door can save more than a battle.'
    },
    missions: [
      { fr: 'Mission 1 - Poste de securite: reactiver les portes coupe-feu sans enfermer les survivants avec les headcrabs.', en: 'Mission 1 - Security Post: reactivate fire doors without locking survivors in with headcrabs.' },
      { fr: 'Mission 2 - Passage Resistance: couvrir une cellule Lambda pendant qu elle deplace munitions et medkits sous surveillance Combine.', en: 'Mission 2 - Resistance Passage: cover a Lambda cell while it moves ammunition and medkits under Combine surveillance.' },
      { fr: 'Mission 3 - Sortie City 17: tenir un couloir assez longtemps pour que l escouade franchisse la Breche sans perdre les civils indexes.', en: 'Mission 3 - City 17 Exit: hold a corridor long enough for the squad to cross the Breach without losing indexed civilians.' }
    ],
    outro: { fr: 'Barney verrouille la porte derriere les survivants, pas devant eux. A.R.C.A. archive son protocole comme extraction humaine prioritaire.', en: 'Barney locks the door behind survivors, not in front of them. A.R.C.A. archives his protocol as priority human extraction.' },
    reward: { fr: 'Apparence Resistance City 17 + radio Lambda', en: 'City 17 Resistance Skin + Lambda Radio' },
    rewardItemId: 'char_barney_city17'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'shephard_opposing_breach',
    stageId: 9216,
    heroId: 'shephard',
    title: { fr: 'Arc Personnage - Shephard: ordre oppose', en: 'Character Arc - Shephard: Opposing Order' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Gene Worm de Trame',
    unlock: { type: 'clears', value: 6 },
    intro: {
      fr: 'La Breche rouvre un theatre HECU de Black Mesa. Les ordres disent nettoyer; les capteurs A.R.C.A. disent survivants. Shephard doit choisir si sa mission reste un ordre ou devient une responsabilite.',
      en: 'The Breach reopens a HECU theater inside Black Mesa. Orders say cleanup; A.R.C.A. sensors say survivors. Shephard must decide whether his mission remains an order or becomes responsibility.'
    },
    missions: [
      { fr: 'Mission 1 - Zone HECU: recuperer du materiel lourd sans executer les temoins scientifiques.', en: 'Mission 1 - HECU Zone: recover heavy gear without executing scientific witnesses.' },
      { fr: 'Mission 2 - Faille Race X: neutraliser les spores et empecher leur greffe sur une autre Trame.', en: 'Mission 2 - Race X Rift: neutralize spores and prevent them from grafting onto another Thread.' },
      { fr: 'Mission 3 - Observation G-Man: fermer une sortie que le G-Man voulait garder ouverte pour plus tard.', en: 'Mission 3 - G-Man Observation: close an exit the G-Man wanted to keep open for later.' }
    ],
    outro: { fr: 'Shephard sort du rapport militaire et entre dans l archive A.R.C.A.: un soldat peut refuser que la mission efface les personnes.', en: 'Shephard leaves the military report and enters the A.R.C.A. archive: a soldier can refuse to let the mission erase people.' },
    reward: { fr: 'Apparence HECU Opposing Force + balise Race X scellee', en: 'Opposing Force HECU Skin + Sealed Race X Beacon' },
    rewardItemId: 'char_shephard_opposing_force'
  });
}

export function createCuratedCharacterNarrativeArcs4() {
  return ({
    id: 'alyx_city17_signal',
    stageId: 9217,
    heroId: 'alyx_vance',
    title: { fr: 'Arc Personnage - Alyx: signal City 17', en: 'Character Arc - Alyx: City 17 Signal' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Noyau de surveillance Combine',
    unlock: { type: 'level', value: 3 },
    intro: {
      fr: 'Un noeud Combine s installe dans la Breche et commence a classer les signatures comme citoyens, rebelles ou erreurs. Alyx entre dans le signal pour rendre aux civils une chose que le Combine ne sait pas mesurer: le choix.',
      en: 'A Combine node settles inside the Breach and starts classifying signatures as citizens, rebels, or errors. Alyx enters the signal to give civilians back something the Combine cannot measure: choice.'
    },
    missions: [
      { fr: 'Mission 1 - Scanner renverse: pirater des drones Combine pour retrouver les civils caches dans les appartements compresses.', en: 'Mission 1 - Reversed Scanner: hack Combine drones to find civilians hidden inside compressed apartments.' },
      { fr: 'Mission 2 - Route de Dog: ouvrir une breche courte ou Dog peut arracher une barricade de Trame sans casser la sortie.', en: 'Mission 2 - Dog Route: open a short breach where Dog can tear out a Thread barricade without breaking the exit.' },
      { fr: 'Mission 3 - Citadelle miniature: couper le noyau de surveillance avant qu il ne fasse de la Cite-Mosaique une City 17 locale.', en: 'Mission 3 - Miniature Citadel: cut the surveillance core before it turns Mosaic City into a local City 17.' }
    ],
    outro: { fr: 'Alyx ne detruit pas seulement le signal: elle le remplace par une route. A.R.C.A. classe son protocole comme Resistance vivante.', en: 'Alyx does not only destroy the signal: she replaces it with a route. A.R.C.A. classifies her protocol as living Resistance.' },
    reward: { fr: 'Apparence Resistance Alyx + gants gravite de Trame', en: 'Alyx Resistance Skin + Thread Gravity Gloves' },
    rewardItemId: 'char_alyx_resistance'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_freeman_hev_nexus',
    heroId: 'freeman',
    name: { fr: 'HEV Black Mesa', en: 'Black Mesa HEV' },
    colors: { primaryColor: '#ff8c00', secondaryColor: '#39c5bb' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_barney_city17',
    heroId: 'barney',
    name: { fr: 'Resistance City 17', en: 'City 17 Resistance' },
    colors: { primaryColor: '#345c8c', secondaryColor: '#ffb15c' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_shephard_opposing_force',
    heroId: 'shephard',
    name: { fr: 'HECU Opposing Force', en: 'Opposing Force HECU' },
    colors: { primaryColor: '#5f6f57', secondaryColor: '#f2d16b' }
  });
}

export function createSkinCatalog4() {
  return ({
    id: 'char_alyx_resistance',
    heroId: 'alyx_vance',
    name: { fr: 'Alyx Resistance', en: 'Alyx Resistance' },
    colors: { primaryColor: '#8e6f4e', secondaryColor: '#7bdcff' }
  });
}
