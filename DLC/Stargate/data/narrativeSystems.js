// Stargate — definitions consumed by src/game/narrativeSystems.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createUniverseNarrativeArcs() {
  return ({
    id: 'stargate_sgc_first_contact',
    title: { fr: 'Arc Univers - Stargate: protocole premier contact', en: 'Universe Arc - Stargate: First Contact Protocol' },
    universes: ['Stargate'],
    intro: { fr: 'Le SGC detecte une adresse inconnue: la Porte ne mene pas a une planete, mais a une Trame ou les Goa uld, les Jaffa libres, les Anciens et A.R.C.A. se disputent le sens du passage.', en: 'The SGC detects an unknown address: the Gate does not lead to a planet, but to a Thread where Goa uld, free Jaffa, Ancients, and A.R.C.A. fight over the meaning of passage.' },
    missions: [
      { fr: 'Intro - Chevron inconnu: composer l adresse avec GDO actif et iris pret a se fermer.', en: 'Intro - Unknown Chevron: dial the address with GDO active and iris ready to close.' },
      { fr: 'Mission - Abydos miroir: sauver des civils pendant qu un faux dieu reutilise leurs mythes.', en: 'Mission - Mirror Abydos: save civilians while a false god reuses their myths.' },
      { fr: 'Interlude - Carte des Anciens: Daniel et Carter prouvent que la Porte est un texte autant qu une machine.', en: 'Interlude - Ancient Map: Daniel and Carter prove the Gate is as much text as machine.' },
      { fr: 'Mission - Soulagement Jaffa: couper les anneaux de transport sans condamner les soldats qui peuvent encore se liberer.', en: 'Mission - Jaffa Relief: cut transport rings without condemning soldiers who can still be freed.' },
      { fr: 'Boss - Primate d Anubis: vaincre le commandant qui veut transformer le reseau de Portes en arme de Breche.', en: 'Boss - Anubis First Prime: defeat the commander trying to turn the Gate network into a Breach weapon.' }
    ],
    outro: { fr: 'L iris se referme sur une adresse propre. Stargate reste une histoire d exploration prudente, de faux dieux demasques et d allies gagnes par choix.', en: 'The iris closes on a clean address. Stargate remains a story of cautious exploration, exposed false gods, and allies won by choice.' },
    reward: { fr: 'Patch SG-1 Nexus + coordonnee Abydos stable', en: 'SG-1 Nexus Patch + stable Abydos coordinate' }
  });
}

export function createCuratedCharacterNarrativeArcs() {
  return ({
    id: 'oneill_eighth_chevron',
    stageId: 9208,
    heroId: 'oneill',
    title: { fr: 'Arc Personnage - O Neill: huitieme chevron', en: 'Character Arc - O Neill: Eighth Chevron' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Primate Goa uld miroir',
    unlock: { type: 'clears', value: 6 },
    intro: {
      fr: 'Une adresse inconnue apparait sur la roue de la Porte: huit chevrons, mais aucune galaxie stable en face. O Neill refuse d appeler cela un miracle ou une invitation. Pour SG-1, une Porte inconnue est une mission: reconnaissance, GDO, iris, repli et personne laisse derriere.',
      en: 'An unknown address appears on the Gate wheel: eight chevrons, but no stable galaxy on the other side. O Neill refuses to call it a miracle or an invitation. For SG-1, an unknown Gate is a mission: recon, GDO, iris, fallback, and nobody left behind.'
    },
    missions: [
      { fr: 'Mission 1 - Salle de Porte: composer l adresse sans laisser un signal Goa uld copier le code GDO.', en: 'Mission 1 - Gate Room: dial the address without letting a Goa uld signal copy the GDO code.' },
      { fr: 'Mission 2 - Abydos miroir: evacuer des civils pendant qu un Primate recode les anneaux de transport.', en: 'Mission 2 - Mirror Abydos: evacuate civilians while a First Prime recodes transport rings.' },
      { fr: 'Mission 3 - Iris noir: fermer une Porte miroir avant qu un faux SGC envahisse la Cite-Mosaique.', en: 'Mission 3 - Black Iris: close a mirror Gate before a false SGC invades Mosaic City.' }
    ],
    outro: { fr: 'O Neill referme l iris et sourit seulement quand tout le monde est rentre. A.R.C.A. classe le huitieme chevron comme route tactique, pas comme jouet cosmique.', en: 'O Neill closes the iris and only smiles once everyone is home. A.R.C.A. classifies the eighth chevron as a tactical route, not a cosmic toy.' },
    reward: { fr: 'Apparence SGC Cheyenne + patch Chevron Huit', en: 'Cheyenne SGC Skin + Eighth Chevron Patch' },
    rewardItemId: 'char_oneill_sgc_nexus'
  });
}

export function createCuratedCharacterNarrativeArcs2() {
  return ({
    id: 'carter_naquadah_window',
    stageId: 9218,
    heroId: 'sam_carter',
    title: { fr: 'Arc Personnage - Carter: fenetre naquadah', en: 'Character Arc - Carter: Naquadah Window' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Reacteur Goa uld instable',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Une Porte de Trame surcharge au naquadah. Si Carter se trompe, la Breche ne s ouvre pas: elle explose en emportant son adresse.', en: 'A Thread Gate overloads with naquadah. If Carter is wrong, the Breach does not open: it explodes and takes its address with it.' },
    missions: [
      { fr: 'Mission 1 - Chevron fantome: recalculer une adresse qui change a chaque impulsion de naquadah.', en: 'Mission 1 - Ghost Chevron: recalculate an address shifting with every naquadah pulse.' },
      { fr: 'Mission 2 - Bouclier Goa uld: inverser une defense ennemie pour ouvrir une fenetre de tir SG-1.', en: 'Mission 2 - Goa uld Shield: invert an enemy defense to open an SG-1 firing window.' },
      { fr: 'Mission 3 - Reacteur critique: refroidir la surcharge avant qu Anubis ne convertisse la Porte en arme.', en: 'Mission 3 - Critical Reactor: cool the overload before Anubis converts the Gate into a weapon.' }
    ],
    outro: { fr: 'Carter sauve l adresse et prouve qu une Breche peut etre comprise assez longtemps pour etre sauvee.', en: 'Carter saves the address and proves a Breach can be understood long enough to be saved.' },
    reward: { fr: 'Apparence Carter SGC Science + cellule naquadah stable', en: 'SGC Science Carter Skin + Stable Naquadah Cell' },
    rewardItemId: 'char_carter_sgc_science'
  });
}

export function createCuratedCharacterNarrativeArcs3() {
  return ({
    id: 'tealc_free_jaffa_gate',
    stageId: 9219,
    heroId: 'tealc',
    title: { fr: 'Arc Personnage - Teal c: Porte des Jaffa libres', en: 'Character Arc - Teal c: Free Jaffa Gate' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Prima d Apophis recode',
    unlock: { type: 'clears', value: 6 },
    intro: { fr: 'Un temple Goa uld recode appelle Teal c par son ancien titre. La Breche veut savoir si un Prima reste un soldat du faux dieu ou devient vraiment libre.', en: 'A recoded Goa uld temple calls Teal c by his old title. The Breach wants to know whether a First Prime remains a false god soldier or becomes truly free.' },
    missions: [
      { fr: 'Mission 1 - Chulak scelle: briser une procession Jaffa sans tuer ceux qui peuvent encore se liberer.', en: 'Mission 1 - Sealed Chulak: break a Jaffa procession without killing those who can still be freed.' },
      { fr: 'Mission 2 - Lance serpent: retourner une arme de terreur contre les gardes d Apophis.', en: 'Mission 2 - Serpent Staff: turn a terror weapon against Apophis guards.' },
      { fr: 'Mission 3 - Faux dieu: vaincre un Prima recode avant qu il ne force la Cite a s agenouiller.', en: 'Mission 3 - False God: defeat a recoded First Prime before he forces the City to kneel.' }
    ],
    outro: { fr: 'Teal c quitte le temple debout. A.R.C.A. archive sa lecon: aucune Porte ne doit rouvrir une servitude.', en: 'Teal c leaves the temple standing. A.R.C.A. archives his lesson: no Gate should reopen servitude.' },
    reward: { fr: 'Apparence Jaffa libre + marque Chulak', en: 'Free Jaffa Skin + Chulak Mark' },
    rewardItemId: 'char_tealc_free_jaffa'
  });
}

export function createCuratedCharacterNarrativeArcs4() {
  return ({
    id: 'daniel_ancient_translation',
    stageId: 9220,
    heroId: 'daniel_jackson',
    title: { fr: 'Arc Personnage - Daniel: traduction ancienne', en: 'Character Arc - Daniel: Ancient Translation' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Cartouche Sans-Auteur',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Une Porte s ouvre sur des glyphes qui refusent d etre lus. Daniel comprend le danger: le Sans-Auteur ne detruit pas seulement les mondes, il retire leur sens.', en: 'A Gate opens onto glyphs that refuse to be read. Daniel understands the danger: the Authorless does not only destroy worlds, it removes their meaning.' },
    missions: [
      { fr: 'Mission 1 - Cartouche Abydos: traduire une adresse avant qu elle ne devienne une priere Goa uld.', en: 'Mission 1 - Abydos Cartouche: translate an address before it becomes a Goa uld prayer.' },
      { fr: 'Mission 2 - Archive Ancienne: differencier un protocole des Anciens d un piege du Sans-Auteur.', en: 'Mission 2 - Ancient Archive: tell an Ancient protocol from an Authorless trap.' },
      { fr: 'Mission 3 - Langue effacee: restaurer le nom d un monde pour empecher la Breche de l avaler.', en: 'Mission 3 - Erased Language: restore a world name before the Breach swallows it.' }
    ],
    outro: { fr: 'Daniel ne ferme pas la Porte par la force: il lui rend son adresse. A.R.C.A. classe la traduction comme arme de sauvetage.', en: 'Daniel does not close the Gate by force: he gives it back its address. A.R.C.A. classifies translation as a rescue weapon.' },
    reward: { fr: 'Apparence Daniel Abydos + tablette des Anciens', en: 'Abydos Daniel Skin + Ancient Tablet' },
    rewardItemId: 'char_daniel_abydos'
  });
}

export function createSkinCatalog() {
  return ({
    id: 'char_oneill_sgc_nexus',
    heroId: 'oneill',
    name: { fr: 'SGC Cheyenne', en: 'Cheyenne SGC' },
    colors: { primaryColor: '#233c31', secondaryColor: '#6ed0ff' }
  });
}

export function createSkinCatalog2() {
  return ({
    id: 'char_carter_sgc_science',
    heroId: 'sam_carter',
    name: { fr: 'Carter Science SGC', en: 'SGC Science Carter' },
    colors: { primaryColor: '#2d3f7f', secondaryColor: '#9b59b6' }
  });
}

export function createSkinCatalog3() {
  return ({
    id: 'char_tealc_free_jaffa',
    heroId: 'tealc',
    name: { fr: 'Jaffa libre', en: 'Free Jaffa' },
    colors: { primaryColor: '#6a3a1c', secondaryColor: '#d35400' }
  });
}

export function createSkinCatalog4() {
  return ({
    id: 'char_daniel_abydos',
    heroId: 'daniel_jackson',
    name: { fr: 'Daniel Abydos', en: 'Abydos Daniel' },
    colors: { primaryColor: '#d9b36c', secondaryColor: '#6ed0ff' }
  });
}
