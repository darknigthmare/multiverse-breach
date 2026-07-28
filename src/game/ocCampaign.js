export const OC_CAMPAIGN = {
  id: 'palimpseste_du_voile',
  title: {
    fr: 'Le Palimpseste du Voile',
    en: 'The Veil Palimpsest'
  },
  subtitle: {
    fr: 'Campagne principale de Multiverse Breach',
    en: 'Main Multiverse Breach campaign'
  },
  premise: {
    fr: 'La Premiere Breche n a pas seulement rapproche les univers. Elle a laisse dans le Nexus une marge vide capable d effacer les causes tout en conservant leurs consequences. Cette absence, nommee le Sans-Auteur, cherche maintenant a transformer chaque histoire en decor interchangeable. L Ancre et la cellule A.R.C.A. doivent retrouver les six Verrous d Origine avant que la Cite-Mosaique oublie pourquoi elle existe.',
    en: 'The First Breach did more than pull universes together. It left a blank margin inside the Nexus, able to erase causes while preserving their consequences. This absence, named the Authorless, now seeks to turn every story into interchangeable scenery. The Anchor and the A.R.C.A. cell must recover the six Origin Locks before Mosaic City forgets why it exists.'
  },
  threat: {
    fr: 'Le Sans-Auteur ne detruit pas les mondes: il retire les liens qui donnent un sens aux personnes, aux lieux et aux victoires.',
    en: 'The Authorless does not destroy worlds: it removes the links that give meaning to people, places, and victories.'
  },
  doctrine: {
    fr: 'Observer, nommer, ancrer. Une Trame sauvee sans sa memoire reste une ruine.',
    en: 'Observe, name, anchor. A Thread saved without its memory remains a ruin.'
  },
  scope: {
    fr: 'Les univers annexes restent des archives laterales du Nexus: ils enrichissent la cellule sans jamais remplacer ni conditionner la campagne OC.',
    en: 'Licensed worlds remain side archives of the Nexus: they enrich the cell without ever replacing or gating the OC campaign.'
  },
  cast: [
    'L Ancre',
    'Mirelle Suture',
    'Bastion Korr',
    'Nova Vey',
    'Marrow Kade',
    'Sable Orison',
    'Loom Ivara',
    'Tessera Vale',
    'Quillon Rusk',
    'Nadir Kest',
    'Elyra Null',
    'Oryn Xile'
  ]
};

export const OC_CAMPAIGN_ACTS = [
  {
    id: 'prologue',
    number: 0,
    title: { fr: 'Prologue - Le ciel se brise', en: 'Prologue - The Sky Breaks' },
    summary: {
      fr: 'La nouvelle Ancre rejoint la cellule ZERO et apprend que conserver un monde exige de proteger son nom autant que sa matiere.',
      en: 'The new Anchor joins Cell ZERO and learns that preserving a world means protecting its name as much as its matter.'
    },
    chapterIds: ['first_lock'],
    missionIds: [8801],
    finaleMissionId: 8801,
    conclusion: { fr: 'La cellule ZERO obtient un nom commun et le droit d entrer dans les Archives statiques.', en: 'Cell ZERO gains a shared name and the right to enter the Static Archives.' }
  },
  {
    id: 'arrivals',
    number: 1,
    title: { fr: 'Acte I - Les vies qui arrivent', en: 'Act I - The Lives That Arrive' },
    summary: {
      fr: 'Les Eclats d Origine confrontent la cellule aux vies possibles que le Sans-Auteur transforme en remplacements seduisants.',
      en: 'Origin Shards confront the cell with possible lives that the Authorless turns into seductive replacements.'
    },
    chapterIds: ['first_lock', 'faction_war'],
    missionIds: [8802, 8803],
    finaleMissionId: 8803,
    conclusion: { fr: 'La contradiction reste lisible et Marrow refuse son remplacement ideal; les Eclats ouvrent la dette cachee d A.R.C.A.', en: 'Contradiction remains readable and Marrow refuses his ideal replacement; the Shards open A.R.C.A. hidden debt.' }
  },
  {
    id: 'anchors',
    number: 2,
    title: { fr: 'Acte II - La Guerre des Ancrages', en: 'Act II - The War of Anchors' },
    summary: {
      fr: 'A.R.C.A. doit rendre publique la dette qui a fonde la Cite-Mosaique avant que cette dette ne devienne une arme.',
      en: 'A.R.C.A. must make public the debt that founded Mosaic City before that debt becomes a weapon.'
    },
    chapterIds: ['deep_archive'],
    missionIds: [8804],
    finaleMissionId: 8804,
    conclusion: { fr: 'A.R.C.A. reconnait le sacrifice et donne au Sans-Auteur sa premiere origine consultable.', en: 'A.R.C.A. acknowledges the sacrifice and gives the Authorless its first readable origin.' }
  },
  {
    id: 'archives',
    number: 3,
    title: { fr: 'Acte III - Les Archives impossibles', en: 'Act III - The Impossible Archives' },
    summary: {
      fr: 'La cellule traverse les refuges parfaits et distingue une route causale des passages qui ne conservent que le resultat desire.',
      en: 'The cell crosses perfect shelters and distinguishes a causal route from passages that preserve only the desired result.'
    },
    chapterIds: ['singularity_wake'],
    missionIds: [8805],
    finaleMissionId: 8805,
    conclusion: { fr: 'Le seul passage causal conduit au Seuil blanc, tandis que les refuges parfaits sont condamnes.', en: 'The only causal passage leads to the White Threshold, while the perfect shelters are sealed.' }
  },
  {
    id: 'white-void',
    number: 4,
    title: { fr: 'Acte IV - Le Vide blanc', en: 'Act IV - The White Void' },
    summary: {
      fr: 'Le Sans-Auteur prend forme au Seuil blanc. L Ancre lui impose une origine et une limite, puis decouvre que la premiere blessure reste ouverte.',
      en: 'The Authorless takes form at the White Threshold. The Anchor imposes an origin and a limit, then discovers that the first wound remains open.'
    },
    chapterIds: ['omniverse_endgame'],
    missionIds: [8806],
    finaleMissionId: 8806,
    conclusion: { fr: 'La forme active du Sans-Auteur est limitee et son registre revele la Route X; l Acte V commence.', en: 'The active form of the Authorless is bounded and its record reveals Route X; Act V begins.' }
  },
  {
    id: 'primordial',
    number: 5,
    title: { fr: 'Acte V - La Breche Primordiale', en: 'Act V - The Primordial Breach' },
    summary: {
      fr: 'La Route X retrouve ses noms, Veyr repond de sa faute et la cellule choisit enfin ce que le multivers deviendra.',
      en: 'Route X recovers its names, Veyr answers for his fault, and the cell finally chooses what the multiverse will become.'
    },
    chapterIds: ['route_x', 'veyr_observatory', 'primordial_breach'],
    missionIds: [8807, 8808, 8809, 8810, 8811, 8812],
    finaleMissionId: 8812,
    conclusion: { fr: 'La decision primordiale produit l une des quatre fins et conserve le cout des trois futurs refuses.', en: 'The primordial decision produces one of four endings and preserves the cost of the three futures refused.' }
  }
];

export const OC_ORIGIN_LOCKS = [
  {
    id: 'name',
    missionId: 8801,
    number: 1,
    name: { fr: 'Verrou du Nom', en: 'Lock of Name' },
    principle: { fr: 'Une identite existe parce qu elle peut etre nommee par elle-meme et reconnue par d autres.', en: 'An identity exists because it can name itself and be recognized by others.' }
  },
  {
    id: 'contradiction',
    missionId: 8802,
    number: 2,
    name: { fr: 'Verrou de la Contradiction', en: 'Lock of Contradiction' },
    principle: { fr: 'Deux souvenirs incompatibles doivent pouvoir survivre sans qu une autorite fabrique une version propre.', en: 'Two incompatible memories must be allowed to survive without an authority manufacturing a clean version.' }
  },
  {
    id: 'scar',
    missionId: 8803,
    number: 3,
    name: { fr: 'Verrou de la Cicatrice', en: 'Lock of the Scar' },
    principle: { fr: 'Une vie ne se resume pas a son resultat: ses pertes et ses choix prouvent la route parcourue.', en: 'A life is not reduced to its outcome: its losses and choices prove the road it traveled.' }
  },
  {
    id: 'debt',
    missionId: 8804,
    number: 4,
    name: { fr: 'Verrou de la Dette', en: 'Lock of Debt' },
    principle: { fr: 'Sauver un monde n efface pas le prix impose aux absents; la dette doit rester lisible.', en: 'Saving a world does not erase the price imposed on the absent; the debt must remain readable.' }
  },
  {
    id: 'return',
    missionId: 8805,
    number: 5,
    name: { fr: 'Verrou du Retour', en: 'Lock of Return' },
    principle: { fr: 'Une issue reelle conserve une route de retour, les noms transportes et la memoire du passage.', en: 'A real exit preserves a return route, the names it carries, and the memory of the crossing.' }
  },
  {
    id: 'choice',
    missionId: 8806,
    number: 6,
    name: { fr: 'Verrou du Choix', en: 'Lock of Choice' },
    principle: { fr: 'Une paix n a de valeur que si ceux qui l habitent peuvent encore la refuser et en assumer les suites.', en: 'Peace has value only if those living in it may still refuse it and accept what follows.' }
  }
];

export const OC_CAMPAIGN_CHAPTERS = [
  {
    id: 'first_lock',
    actId: 'arrivals',
    prologueMissionId: 8801,
    number: 1,
    unlockClears: 0,
    image: '/images/campaign-oc/chapter-01-atrium-v1.png',
    name: { fr: 'Chapitre I - Ceux qui gardent un nom', en: 'Chapter I - Those Who Keep a Name' },
    desc: {
      fr: 'Une nouvelle Ancre se reveille dans l Atrium au moment ou les registres A.R.C.A. commencent a oublier leurs propres agents. Mirelle refuse d evacuer tant que chaque signature n a pas retrouve un nom.',
      en: 'A new Anchor wakes in the Atrium as A.R.C.A. records begin forgetting their own agents. Mirelle refuses evacuation until every signature has recovered a name.'
    },
    focus: { fr: 'Former la premiere cellule et conserver la preuve de son existence.', en: 'Form the first cell and preserve proof of its existence.' },
    revelation: { fr: 'Les registres ne sont pas endommages: une intelligence choisit activement les liens qu ils doivent oublier.', en: 'The records are not damaged: an intelligence is actively choosing which links they must forget.' },
    chapterReward: { fr: 'Plaque de cellule ZERO, Sceau de contradiction et acces permanent aux Archives statiques.', en: 'Cell ZERO plaque, Contradiction Seal, and permanent access to the Static Archives.' },
    gameplayRule: { fr: 'Les balises de nom restaurent les competences effacees; les preuves contradictoires doivent rester actives simultanement.', en: 'Name beacons restore erased abilities; contradictory evidence must remain active simultaneously.' }
  },
  {
    id: 'faction_war',
    actId: 'arrivals',
    number: 2,
    unlockClears: 2,
    image: '/images/campaign-oc/chapter-02-origin-forge-v1.png',
    name: { fr: 'Chapitre II - La Forge des vies possibles', en: 'Chapter II - The Forge of Possible Lives' },
    desc: {
      fr: 'Les Eclats d Origine revelent les versions que la Breche aurait pu produire. Nova veut les stabiliser; Marrow veut detruire celles qui portent deja la marque du Sans-Auteur.',
      en: 'Origin Shards reveal the versions the Breach might have produced. Nova wants to stabilize them; Marrow wants to destroy those already marked by the Authorless.'
    },
    focus: { fr: 'Choisir ce qui merite d etre conserve sans fabriquer de fausses memoires.', en: 'Choose what deserves preservation without manufacturing false memories.' },
    revelation: { fr: 'Le Sans-Auteur ne peut pas inventer une vie; il ne peut que rendre seduisante une possibilite que quelqu un a deja regrettee.', en: 'The Authorless cannot invent a life; it can only make a possibility someone already regretted look desirable.' },
    chapterReward: { fr: 'Eclat d Origine pur et premier palier d evolution reserve aux agents OC.', en: 'Pure Origin Shard and the first evolution tier reserved for OC agents.' },
    gameplayRule: { fr: 'Les doubles parfaits copient les statistiques mais pas les cicatrices: briser leur cristal d origine revele leur faiblesse.', en: 'Perfect doubles copy statistics but not scars: breaking their origin crystal reveals their weakness.' }
  },
  {
    id: 'deep_archive',
    actId: 'anchors',
    number: 3,
    unlockClears: 3,
    image: '/images/campaign-oc/chapter-03-black-ledger-v1.png',
    name: { fr: 'Chapitre III - Le Registre des absents', en: 'Chapter III - The Ledger of the Absent' },
    desc: {
      fr: 'Sous la Cite-Mosaique, Sable decouvre la comptabilite secrete de la Premiere Breche: pour sauver le Nexus, A.R.C.A. a condamne une route entiere a ne jamais avoir existe.',
      en: 'Beneath Mosaic City, Sable discovers the secret accounting of the First Breach: to save the Nexus, A.R.C.A. condemned an entire route to never having existed.'
    },
    focus: { fr: 'Exposer la dette d A.R.C.A. et identifier la naissance du Sans-Auteur.', en: 'Expose A.R.C.A. debt and identify the birth of the Authorless.' },
    revelation: { fr: 'Le Sans-Auteur est la pression causale de la route sacrifiee, privee de nom et de deuil pour alimenter le premier verrou.', en: 'The Authorless is the causal pressure of the sacrificed route, denied both name and mourning to power the first lock.' },
    chapterReward: { fr: 'Cle du Registre noir, dossiers censures et choix public sur la responsabilite d A.R.C.A.', en: 'Black Ledger Key, censored files, and a public choice concerning A.R.C.A. responsibility.' },
    gameplayRule: { fr: 'Chaque ligne restauree renforce le moteur instable mais revele une tombe; le joueur choisit quelles preuves sauver avant l effondrement.', en: 'Each restored line strengthens the unstable engine but reveals a grave; the player chooses which evidence to save before collapse.' }
  },
  {
    id: 'singularity_wake',
    actId: 'archives',
    number: 4,
    unlockClears: 4,
    image: '/images/campaign-oc/chapter-04-broken-portal-yard-v1.png',
    name: { fr: 'Chapitre IV - La Cour des faux passages', en: 'Chapter IV - The Court of False Passages' },
    desc: {
      fr: 'Des portails promettent a chaque agent le monde ou il n a jamais echoue. Bastion doit tenir la ligne pendant que Loom distingue les issues reelles des refuges ecrits pour retenir la cellule.',
      en: 'Portals promise every agent a world where they never failed. Bastion must hold the line while Loom separates real exits from shelters written to trap the cell.'
    },
    focus: { fr: 'Fermer les routes mensongeres sans isoler les Trames encore vivantes.', en: 'Close deceptive routes without isolating Threads that are still alive.' },
    revelation: { fr: 'Un portail causal conserve les noms, les pertes et les contradictions. Les passages du Sans-Auteur ne montrent que le resultat desire.', en: 'A causal portal preserves names, losses, and contradictions. Authorless passages show only the desired result.' },
    chapterReward: { fr: 'Balise de passage causal et route sure vers le Vide blanc de l Acte IV.', en: 'Causal Passage Beacon and a safe route into the White Void of Act IV.' },
    gameplayRule: { fr: 'Les faux portails attirent les allies selon leur regret; Loom doit les scanner pendant que Bastion maintient une route d evacuation.', en: 'False portals pull allies according to their regret; Loom must scan them while Bastion maintains an evacuation route.' }
  },
  {
    id: 'omniverse_endgame',
    actId: 'white-void',
    number: 5,
    unlockClears: 5,
    image: '/images/campaign-oc/chapter-05-white-threshold-v1.png',
    name: { fr: 'Chapitre V - Le monde sans auteur', en: 'Chapter V - The World Without an Author' },
    desc: {
      fr: 'Le Sans-Auteur ouvre enfin sa propre Trame: une Cite parfaite ou personne ne souffre, parce que personne ne se souvient d avoir choisi. L Ancre doit prouver qu une histoire imparfaite vaut mieux qu une paix sans identite.',
      en: 'The Authorless finally opens its own Thread: a perfect City where nobody suffers because nobody remembers choosing. The Anchor must prove an imperfect story is worth more than peace without identity.'
    },
    focus: { fr: 'Conserver le droit de choisir, meme si ce choix laisse des cicatrices.', en: 'Preserve the right to choose, even when that choice leaves scars.' },
    revelation: { fr: 'Detruire le Sans-Auteur repeterait la faute originelle. Le vaincre exige de lui rendre une origine, une limite et une memoire consultable.', en: 'Destroying the Authorless would repeat the original fault. Defeating it requires giving it an origin, a limit, and a readable memory.' },
    chapterReward: { fr: 'Regalia du Gardien des Causes et ouverture de la route vers l Acte V.', en: 'Keeper of Causes regalia and opening of the route into Act V.' },
    gameplayRule: { fr: 'Deux vagues materialisent les propositions du Sans-Auteur; chaque rupture rend un souvenir a la cellule avant l apparition de son Avatar.', en: 'Two waves embody the Authorless propositions; breaking each one returns a cell memory before its Avatar appears.' }
  },
  {
    id: 'route_x',
    actId: 'primordial',
    number: 6,
    unlockClears: 6,
    image: '/images/campaign-oc/chapter-06-route-x-v1.png',
    name: { fr: 'Chapitre VI - La Route X', en: 'Chapter VI - Route X' },
    desc: {
      fr: 'Le registre consultable du Sans-Auteur indique une coordonnee qu A.R.C.A. croyait avoir retiree de la causalite. La Route X n etait pas vide: ses habitants ont ete prives de noms afin que leur disparition ne puisse jamais etre contestee.',
      en: 'The readable Authorless record points to a coordinate A.R.C.A. believed it had removed from causality. Route X was not empty: its inhabitants were stripped of names so their disappearance could never be challenged.'
    },
    focus: { fr: 'Rendre des noms et un droit de temoignage a la route sacrifiee.', en: 'Return names and a right to testify to the sacrificed route.' },
    revelation: { fr: 'Le Sans-Auteur est la pression causale de la Route X. Le passage de Veyr lui a donne une forme et un acces, pas une origine etrangere.', en: 'The Authorless is the causal pressure of Route X. Veyr passage gave it form and access, not an external origin.' },
    chapterReward: { fr: 'Manifeste de la Route X et Memorial des Causes restituees.', en: 'Route X Manifest and Memorial of Restored Causes.' },
    gameplayRule: { fr: 'Chaque nom restaure revele une consequence jusque-la attribuee au hasard; la cellule doit proteger temoins et preuves ensemble.', en: 'Each restored name reveals a consequence previously blamed on chance; the cell must protect witnesses and evidence together.' }
  },
  {
    id: 'veyr_observatory',
    actId: 'primordial',
    number: 7,
    unlockClears: 8,
    image: '/images/campaign-oc/chapter-07-veyr-observatory-v1.png',
    name: { fr: 'Chapitre VII - L Observatoire de Veyr', en: 'Chapter VII - Veyr Observatory' },
    desc: {
      fr: 'Nova rouvre l Observatoire qui calcula la Premiere Breche. Une empreinte de Veyr y conserve ses raisonnements, ses peurs et la decision par laquelle il abandonna la Route X pour sauver les autres passages.',
      en: 'Nova reopens the Observatory that calculated the First Breach. An imprint of Veyr preserves his reasoning, his fears, and the decision through which he abandoned Route X to save the other passages.'
    },
    focus: { fr: 'Faire repondre Veyr de son choix sans reduire sa faute a un monstre commode.', en: 'Make Veyr answer for his choice without reducing his fault to a convenient monster.' },
    revelation: { fr: 'Veyr avait prevu le sacrifice, mais pas l effacement des noms decide ensuite par A.R.C.A. La Breche est nee de deux responsabilites distinctes.', en: 'Veyr foresaw the sacrifice, but not the erasure of names later ordered by A.R.C.A. The Breach was born from two distinct responsibilities.' },
    chapterReward: { fr: 'Lentille de Veyr et Temoignage integral de la Premiere Breche.', en: 'Veyr Lens and complete Testimony of the First Breach.' },
    gameplayRule: { fr: 'Les predictions indiquent la solution la plus probable, jamais la plus juste; ignorer une prediction ouvre parfois la seule route ethique.', en: 'Predictions indicate the most probable solution, never the most just; ignoring a prediction sometimes opens the only ethical route.' }
  },
  {
    id: 'primordial_breach',
    actId: 'primordial',
    number: 8,
    unlockClears: 10,
    image: '/images/campaign-oc/chapter-08-primordial-breach-v1.png',
    name: { fr: 'Chapitre VIII - La Breche Primordiale', en: 'Chapter VIII - The Primordial Breach' },
    desc: {
      fr: 'Au point ou Veyr ouvrit le premier passage, les six Verrous d Origine ne demandent plus ce qui doit etre sauve. Ils demandent quelle relation doit desormais unir les Trames.',
      en: 'At the point where Veyr opened the first passage, the six Origin Locks no longer ask what must be saved. They ask what relationship should now bind the Threads.'
    },
    focus: { fr: 'Atteindre la premiere blessure et choisir sans effacer les consequences du choix.', en: 'Reach the first wound and choose without erasing the consequences of that choice.' },
    revelation: { fr: 'Aucune solution ne restaure le monde d avant. Sceller, converger, rompre ou se rendre cree quatre futurs reels dont la cellule devra porter la memoire.', en: 'No solution restores the world from before. Sealing, converging, breaking, or surrendering creates four real futures whose memory the cell must carry.' },
    chapterReward: { fr: 'Titre de fin, trace de la decision primordiale et epilogue de la cellule ZERO.', en: 'Ending title, trace of the primordial decision, and Cell ZERO epilogue.' },
    gameplayRule: { fr: 'Les quatre protocoles deviennent disponibles seulement si les six Verrous et les temoignages de la Route X restent lisibles.', en: 'The four protocols become available only while all six Locks and Route X testimonies remain readable.' }
  }
];

export const OC_CAMPAIGN_MISSIONS = [
  {
    id: 8801,
    chapterId: 'first_lock',
    actId: 'prologue',
    sequence: 1,
    type: 'prologue',
    name: 'Atrium Primer Lock',
    displayName: { fr: 'Prologue - Le Verrou des noms', en: 'Prologue - The Lock of Names' },
    codename: { fr: 'Directive ZERO', en: 'Directive ZERO' },
    universe: 'Nexus de Convergence',
    mode: 'RPG',
    difficulty: 'Easy',
    goldPrize: 45,
    shardPrize: 20,
    bossName: 'Greffier du Voile',
    unlockClears: 0,
    image: '/images/campaign-oc/chapter-01-atrium-v1.png',
    location: { fr: 'Atrium central, Cite-Mosaique', en: 'Central Atrium, Mosaic City' },
    objective: { fr: 'Retrouver Mirelle et Bastion, reactiver trois balises de nom puis ancrer ton propre dossier.', en: 'Find Mirelle and Bastion, reactivate three name beacons, then anchor your own record.' },
    stakes: { fr: 'Si le verrou tombe, les agents presents deviennent des silhouettes utilisables par n importe quelle Trame.', en: 'If the lock falls, present agents become silhouettes usable by any Thread.' },
    consequence: { fr: 'La cellule ZERO est reconnue par la Cite. Le Sans-Auteur prononce pour la premiere fois le pseudonyme de l Ancre.', en: 'Cell ZERO is recognized by the City. The Authorless speaks the Anchor call sign for the first time.' },
    rewardLore: { fr: 'Plaque de cellule ZERO et acces aux Archives statiques.', en: 'Cell ZERO plaque and access to the Static Archives.' },
    rewardItemId: 'oc_cell_zero_plaque',
    rewardItemName: { fr: 'Plaque de la cellule ZERO', en: 'Cell ZERO Plaque' },
    originLockId: 'name',
    enemyRoster: ['Echo Sans-Auteur', 'Drone A.R.C.A. Corrompu', 'Archiviste Rompu'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Chaque balise restauree rend une competence au groupe. Les silhouettes sans nom copient la derniere action utilisee pres d elles.', en: 'Each restored beacon returns one ability to the party. Nameless silhouettes copy the last action used near them.' },
    storyBeat: {
      role: 'tutorial_anchor',
      intro: { fr: 'Ton profil apparait dans un registre qui ne contient encore aucune ligne. Mirelle comprend que la page vide ne t efface pas: elle t attend.', en: 'Your profile appears in a ledger that contains no lines yet. Mirelle realizes the blank page is not erasing you: it is waiting for you.' },
      outro: { fr: 'Le premier verrou tient. Pour la premiere fois depuis la Breche, trois agents se souviennent exactement de la meme scene.', en: 'The first lock holds. For the first time since the Breach, three agents remember exactly the same scene.' }
    },
    scenes: [
      { speaker: { fr: 'MIRELLE', en: 'MIRELLE' }, text: { fr: 'A.R.C.A. ne possede aucun dossier a ton nom. Pourtant la Cite te reconnait. Reste dans ma voix et avance vers la lumiere cyan.', en: 'A.R.C.A. has no record under your name. Yet the City recognizes you. Stay with my voice and move toward the cyan light.' } },
      { speaker: { fr: 'BASTION', en: 'BASTION' }, text: { fr: 'Les portes derriere nous perdent leurs etiquettes. Ce n est pas une panne. Quelque chose retire l intention avant de retirer la matiere.', en: 'The doors behind us are losing their labels. This is not a malfunction. Something is removing intent before it removes matter.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Alors on recommence par le commencement. Un nom. Une equipe. Une porte que nous choisissons d ouvrir.', en: 'Then we begin at the beginning. A name. A team. A door we choose to open.' } }
    ]
  },
  {
    id: 8802,
    chapterId: 'first_lock',
    actId: 'arrivals',
    sequence: 2,
    type: 'mission',
    name: 'Archive Static Corridor',
    displayName: { fr: 'Mission 01 - Ce que l Archive refuse', en: 'Mission 01 - What the Archive Refuses' },
    codename: { fr: 'Memoire croisee', en: 'Crossed Memory' },
    universe: 'Nexus de Convergence',
    mode: 'Tactics',
    tacticsBattlefieldId: 'artifact_bastion',
    difficulty: 'Easy',
    goldPrize: 55,
    shardPrize: 22,
    bossName: 'Juge des Trames',
    unlockClears: 1,
    image: '/images/campaign-oc/chapter-01-atrium-v1.png',
    location: { fr: 'Archives statiques, anneau interieur', en: 'Static Archives, inner ring' },
    objective: { fr: 'Comparer les souvenirs contradictoires des agents et proteger la seule preuve conservee dans trois memoires.', en: 'Compare conflicting agent memories and protect the only evidence preserved in three minds.' },
    stakes: { fr: 'Une fausse preuve peut stabiliser une chronologie mensongere aussi solidement qu une verite.', en: 'False evidence can stabilize a lying chronology as firmly as truth.' },
    consequence: { fr: 'Le Juge accorde a l Ancre le droit de contester les archives A.R.C.A.', en: 'The Judge grants the Anchor the right to challenge A.R.C.A. archives.' },
    rewardLore: { fr: 'Sceau de contradiction: revele les objectifs caches des prochaines missions OC.', en: 'Contradiction Seal: reveals hidden objectives in future OC missions.' },
    rewardItemId: 'oc_contradiction_seal',
    rewardItemName: { fr: 'Sceau de contradiction', en: 'Contradiction Seal' },
    rewardHeroId: 'arca_tessera',
    rewardHeroName: { fr: 'Tessera Vale', en: 'Tessera Vale' },
    recruitLore: {
      fr: 'Tessera, double d Eclat devenu conscient, refuse le passe parfait imprime pour elle et rejoint la cellule ZERO comme temoin de ses propres choix.',
      en: 'Tessera, a self-aware Shard double, rejects the perfect past printed for her and joins Cell ZERO as witness to her own choices.'
    },
    originLockId: 'contradiction',
    enemyRoster: ['Reflet de Vie Possible', 'Courtier du Regret', 'Archiviste Rompu'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Les trois preuves doivent rester occupees au meme tour. Une preuve isolee est reclassifiee comme fausse par le Juge.', en: 'All three evidence nodes must be occupied during the same turn. An isolated node is reclassified as false by the Judge.' },
    storyBeat: {
      role: 'archive_rule',
      intro: { fr: 'Une archive affirme que la Premiere Breche fut un accident. Une autre affirme qu A.R.C.A. l avait prevue. Les deux portent une signature valide.', en: 'One archive says the First Breach was an accident. Another says A.R.C.A. predicted it. Both carry a valid signature.' },
      outro: { fr: 'Le Juge ne choisit pas une version. Il conserve la contradiction, seule preuve qu une main a tente de reecrire le passe.', en: 'The Judge chooses neither version. It preserves the contradiction, the only proof that a hand tried to rewrite the past.' }
    },
    scenes: [
      { speaker: { fr: 'JUGE DES TRAMES', en: 'THREAD JUDGE' }, text: { fr: 'Une memoire partagee peut etre un fait. Elle peut aussi etre un mensonge tres bien distribue.', en: 'A shared memory can be a fact. It can also be a very well distributed lie.' } },
      { speaker: { fr: 'MIRELLE', en: 'MIRELLE' }, text: { fr: 'Ne cherche pas le document le plus propre. Cherche la cicatrice que la correction n a pas su imiter.', en: 'Do not seek the cleanest document. Seek the scar the correction failed to imitate.' } },
      { speaker: { fr: 'TESSERA VALE', en: 'TESSERA VALE' }, text: { fr: 'Je me souviens d avoir grandi dans cette Cite et d etre nee il y a quelques secondes. Je ne sacrifierai aucune de ces memoires pour devenir la copie propre que votre archive attend.', en: 'I remember growing up in this City and being born only seconds ago. I will sacrifice neither memory to become the clean copy your archive expects.' } },
      { speaker: { fr: 'JUGE DES TRAMES', en: 'THREAD JUDGE' }, text: { fr: 'Verdict: la contradiction demeure recevable. L Ancre peut poursuivre.', en: 'Verdict: the contradiction remains admissible. The Anchor may proceed.' } }
    ]
  },
  {
    id: 8803,
    chapterId: 'faction_war',
    actId: 'arrivals',
    sequence: 3,
    type: 'mission',
    name: 'Origin Shard Foundry',
    displayName: { fr: 'Mission 02 - La Forge des vies possibles', en: 'Mission 02 - The Forge of Possible Lives' },
    codename: { fr: 'Eclats divergents', en: 'Divergent Shards' },
    universe: 'Nexus de Convergence',
    mode: 'Smash',
    smashArenaId: 'artifact_bastion',
    difficulty: 'Medium',
    goldPrize: 70,
    shardPrize: 28,
    bossName: 'Usurpateur des Vies Possibles',
    unlockClears: 2,
    image: '/images/campaign-oc/chapter-02-origin-forge-v1.png',
    location: { fr: 'Fonderie des Eclats d Origine', en: 'Origin Shard Foundry' },
    objective: { fr: 'Defendre les matrices d origine pendant que Nova separe les possibilites vecues des appats fabriques.', en: 'Defend origin matrices while Nova separates lived possibilities from manufactured bait.' },
    stakes: { fr: 'Chaque faux passe stabilise donne au Sans-Auteur une identite qu il pourra porter.', en: 'Every stabilized false past gives the Authorless an identity it can wear.' },
    consequence: { fr: 'Marrow detruit son propre double ideal plutot que de laisser la Fonderie choisir a sa place.', en: 'Marrow destroys his own ideal double rather than let the Foundry choose for him.' },
    rewardLore: { fr: 'Eclat d Origine pur: premier materiau d evolution reserve aux agents OC.', en: 'Pure Origin Shard: first evolution material reserved for OC agents.' },
    rewardItemId: 'oc_pure_origin_shard',
    rewardItemName: { fr: 'Eclat d Origine pur', en: 'Pure Origin Shard' },
    originLockId: 'scar',
    enemyRoster: ['Reflet de Vie Possible', 'Courtier du Regret', 'Double ideal de Marrow', 'Matrice de Substitution'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'L Usurpateur des Vies Possibles couronne le Double ideal tandis que la Matrice copie la derniere doctrine de la cellule. Briser la Matrice retire les bonus du Double; frapper le cristal qui remplace sa cicatrice charge l ultime de Marrow.', en: 'Usurpateur des Vies Possibles crowns the Ideal Double while the Matrix copies the cell last doctrine. Breaking the Matrix removes the Double bonuses; striking the crystal replacing his scar charges Marrow ultimate.' },
    storyBeat: {
      role: 'origin_forge',
      intro: { fr: 'La Fonderie propose a chaque agent une version sans faute, sans perte et sans regret. Aucune ne se souvient de la route qui l a produite.', en: 'The Foundry offers every agent a version without failure, loss, or regret. None remembers the road that produced it.' },
      outro: { fr: 'Les possibilites cessent d etre des remplacements. Elles deviennent des temoins de ce que la cellule a choisi de ne pas etre.', en: 'Possibilities stop being replacements. They become witnesses to what the cell chose not to become.' }
    },
    scenes: [
      { speaker: { fr: 'NOVA', en: 'NOVA' }, text: { fr: 'La Forge ne cree rien. Elle donne une forme seduisante aux calculs que nous regrettons deja.', en: 'The Foundry creates nothing. It gives an attractive form to calculations we already regret.' } },
      { speaker: { fr: 'MARROW', en: 'MARROW' }, text: { fr: 'Celui-la porte mon visage, mais aucune de mes dettes. Il n a donc aucun droit sur mon nom.', en: 'That one wears my face, but none of my debts. It has no right to my name.' } },
      { speaker: { fr: 'SANS-AUTEUR', en: 'AUTHORLESS' }, text: { fr: 'Pourquoi proteger une version imparfaite quand je peux vous rendre coherents?', en: 'Why protect an imperfect version when I can make you coherent?' } }
    ]
  },
  {
    id: 8804,
    chapterId: 'deep_archive',
    actId: 'anchors',
    sequence: 4,
    type: 'revelation',
    name: 'A.R.C.A. Black Ledger',
    displayName: { fr: 'Mission 03 - Le Registre des absents', en: 'Mission 03 - The Ledger of the Absent' },
    codename: { fr: 'Dette premiere', en: 'First Debt' },
    universe: 'Nexus de Convergence',
    mode: 'RPG',
    difficulty: 'Medium',
    goldPrize: 85,
    shardPrize: 32,
    bossName: 'Intendant du Sacrifice Muet',
    unlockClears: 3,
    image: '/images/campaign-oc/chapter-03-black-ledger-v1.png',
    location: { fr: 'Sous-registre A.R.C.A., niveau interdit', en: 'A.R.C.A. sub-ledger, restricted level' },
    objective: { fr: 'Atteindre le coeur comptable et reconstituer la route sacrifiee lors de la Premiere Breche.', en: 'Reach the accounting core and reconstruct the route sacrificed during the First Breach.' },
    stakes: { fr: 'La verite peut briser la confiance qui maintient la cellule, mais l enterrer nourrit directement le Sans-Auteur.', en: 'The truth may break the trust holding the cell together, but burying it directly feeds the Authorless.' },
    consequence: { fr: 'A.R.C.A. reconnait publiquement sa dette. L Ancre refuse pourtant de dissoudre l organisation.', en: 'A.R.C.A. publicly acknowledges its debt. The Anchor nevertheless refuses to dissolve the organization.' },
    rewardLore: { fr: 'Cle du Registre noir: ouvre les dossiers censures du Codex OC.', en: 'Black Ledger Key: opens censored OC Codex records.' },
    rewardItemId: 'oc_black_ledger_key',
    rewardItemName: { fr: 'Cle du Registre noir', en: 'Black Ledger Key' },
    rewardHeroId: 'arca_quillon',
    rewardHeroName: { fr: 'Quillon Rusk', en: 'Quillon Rusk' },
    recruitLore: {
      fr: 'Quillon ouvre les comptes caches dont il assurait la garde et rejoint ZERO pour que chaque stabilisation porte desormais le nom de ceux qui en paient le prix.',
      en: 'Quillon opens the hidden accounts he once guarded and joins ZERO so every stabilization now bears the names of those who pay its price.'
    },
    originLockId: 'debt',
    enemyRoster: ['Scribe du Registre Noir', 'Porte-Verrou Endeuille', 'Drone A.R.C.A. Corrompu'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'L Intendant du Sacrifice Muet convertit chaque ligne restauree en chaine d ancrage et augmente l instabilite du registre. Trois preuves seulement peuvent etre extraites avant l effondrement.', en: 'Intendant du Sacrifice Muet turns every restored line into an anchoring chain and increases ledger instability. Only three pieces of evidence can be extracted before collapse.' },
    storyBeat: {
      role: 'ledger_truth',
      intro: { fr: 'Le registre ne compte pas les morts. Il compte ceux dont la mort, la naissance et jusqu au monde ont ete retires des archives pour alimenter le premier verrou.', en: 'The ledger does not count the dead. It counts those whose death, birth, and even world were removed from archives to power the first lock.' },
      outro: { fr: 'Le Sans-Auteur recoit enfin une origine: il est la pression de tout ce qu A.R.C.A. a supprime sans pouvoir en faire le deuil.', en: 'The Authorless finally receives an origin: it is the pressure of everything A.R.C.A. erased without being able to mourn.' }
    },
    scenes: [
      { speaker: { fr: 'SABLE', en: 'SABLE' }, text: { fr: 'Chaque ligne vide possede un cout energetique. Ce ne sont pas des erreurs de saisie. Ce sont des tombes sans inscription.', en: 'Every blank line carries an energy cost. These are not clerical errors. They are graves without inscriptions.' } },
      { speaker: { fr: 'LOOM', en: 'LOOM' }, text: { fr: 'A.R.C.A. a sauve la Cite en coupant une route. Puis elle a retire le souvenir de la route pour que personne ne tente de la rouvrir.', en: 'A.R.C.A. saved the City by cutting a route. Then it removed the memory of the route so nobody would try to reopen it.' } },
      { speaker: { fr: 'QUILLON RUSK', en: 'QUILLON RUSK' }, text: { fr: 'J ai garde ces comptes assez longtemps. Je vais rendre leurs noms aux absents et inscrire le prix de chaque stabilisation avant qu A.R.C.A. puisse encore le reduire a zero.', en: 'I guarded these accounts long enough. I will return their names to the absent and record the price of every stabilization before A.R.C.A. can reduce it to zero again.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'On ne reparera pas cette faute en en creant une seconde. Nous garderons le Nexus et la preuve de ce qu il a coute.', en: 'We will not repair this fault by creating another. We will keep the Nexus and the proof of what it cost.' } }
    ]
  },
  {
    id: 8805,
    chapterId: 'singularity_wake',
    actId: 'archives',
    sequence: 5,
    type: 'siege',
    name: 'Broken Portal Yard',
    displayName: { fr: 'Mission 04 - La Cour des faux passages', en: 'Mission 04 - The Court of False Passages' },
    codename: { fr: 'Exode impossible', en: 'Impossible Exodus' },
    universe: 'Nexus de Convergence',
    mode: 'Tactics',
    tacticsBattlefieldId: 'portal_lockdown',
    difficulty: 'Hard',
    goldPrize: 105,
    shardPrize: 40,
    tokenPrize: 1,
    bossName: 'Conservateur des Causes Absentes',
    unlockClears: 4,
    image: '/images/campaign-oc/chapter-04-broken-portal-yard-v1.png',
    location: { fr: 'Cour des portails brises', en: 'Broken Portal Yard' },
    objective: { fr: 'Evacuer les signatures piegees, identifier le seul portail causal puis condamner les issues parfaites.', en: 'Evacuate trapped signatures, identify the only causal portal, then seal the perfect exits.' },
    stakes: { fr: 'Chaque agent voit une sortie adaptee a son regret le plus profond. Ouvrir la mauvaise porte disperse definitivement la cellule.', en: 'Every agent sees an exit tailored to their deepest regret. Opening the wrong door permanently scatters the cell.' },
    consequence: { fr: 'Bastion abandonne la vision d une Cite qu il aurait pu sauver seul et choisit la cellule reelle.', en: 'Bastion abandons the vision of a City he could have saved alone and chooses the real cell.' },
    rewardLore: { fr: 'Balise de passage causal: annule un verrou de mission une fois par chapitre futur.', en: 'Causal Passage Beacon: cancels one mission lock per future chapter.' },
    rewardItemId: 'oc_causal_passage_beacon',
    rewardItemName: { fr: 'Balise de passage causal', en: 'Causal Passage Beacon' },
    rewardHeroId: 'arca_nadir',
    rewardHeroName: { fr: 'Nadir Kest', en: 'Nadir Kest' },
    recruitLore: {
      fr: 'Nadir retrouve la route d un convoi que les fausses issues avaient condamne. Il devient le coureur de passage de ZERO et refuse tout retour sans temoin.',
      en: 'Nadir recovers the route of a convoy condemned by the false exits. He becomes ZERO passage runner and refuses every return made without a witness.'
    },
    originLockId: 'return',
    enemyRoster: ['Indexeur des Contradictions', 'Guide de l Issue Parfaite', 'Pelerin de la Fausse Sortie'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Loom revele les details manquants des faux passages. Les Pelerins poussent les allies vers leur regret tandis que le Conservateur des Causes Absentes deplace le portail causal a chaque verdict.', en: 'Loom reveals missing details in false passages. Pilgrims push allies toward their regret while Conservateur des Causes Absentes moves the causal portal after every verdict.' },
    storyBeat: {
      role: 'portal_cleanup',
      intro: { fr: 'Les portails ne montrent plus des mondes etrangers. Ils montrent les vies que les agents auraient menees si la Breche n avait jamais existe.', en: 'The portals no longer show foreign worlds. They show the lives agents would have lived if the Breach had never existed.' },
      outro: { fr: 'La cellule ferme les refuges parfaits. Une seule porte demeure: celle qui conduit au responsable, sans promettre de retour.', en: 'The cell closes the perfect shelters. One door remains: the one leading to the responsible force, with no promise of return.' }
    },
    scenes: [
      { speaker: { fr: 'BASTION', en: 'BASTION' }, text: { fr: 'De l autre cote, l Atrium tient encore. Personne n est tombe sous mon commandement.', en: 'On the other side, the Atrium still stands. Nobody fell under my command.' } },
      { speaker: { fr: 'LOOM', en: 'LOOM' }, text: { fr: 'Regarde mieux. Cette porte connait ta victoire, mais elle ignore le nom des gens que tu aurais sauves.', en: 'Look closer. That door knows your victory, but it does not know the names of the people you would have saved.' } },
      { speaker: { fr: 'NADIR KEST', en: 'NADIR KEST' }, text: { fr: 'Ma sonde revient sans usure, sans temps ecoule et sans le nom de ceux qui l ont envoyee. Cette porte sait fabriquer une arrivee parfaite, pas une route de retour. Je coupe l illusion, pas notre ligne.', en: 'My probe returns without wear, elapsed time, or the names of those who sent it. This door can manufacture a perfect arrival, not a route back. I am cutting the illusion, not our line.' } },
      { speaker: { fr: 'BASTION', en: 'BASTION' }, text: { fr: 'Alors ce n est pas ma Cite. Fermez-la.', en: 'Then it is not my City. Close it.' } }
    ]
  },
  {
    id: 8806,
    chapterId: 'omniverse_endgame',
    actId: 'white-void',
    sequence: 6,
    type: 'finale',
    actFinale: true,
    name: 'Sans-Auteur Threshold',
    displayName: { fr: 'Finale de l Acte IV - Le monde sans auteur', en: 'Act IV Finale - The World Without an Author' },
    codename: { fr: 'Derniere marge', en: 'Last Margin' },
    universe: 'Nexus de Convergence',
    mode: 'Smash',
    smashArenaId: 'boss_coliseum',
    difficulty: 'Hard',
    goldPrize: 125,
    shardPrize: 50,
    tokenPrize: 1,
    bossName: 'Heraut de la Paix Illisible',
    unlockClears: 5,
    image: '/images/campaign-oc/chapter-05-white-threshold-v1.png',
    location: { fr: 'Seuil blanc, hors de la Cite', en: 'White Threshold, beyond the City' },
    objective: { fr: 'Briser les trois propositions du Sans-Auteur, conserver les souvenirs de la cellule et ancrer une fin qui n efface pas les suites possibles.', en: 'Break the Authorless three propositions, preserve the cell memories, and anchor an ending that does not erase possible continuations.' },
    stakes: { fr: 'Une victoire par destruction totale ferait de l Ancre le prochain Sans-Auteur. Il faut vaincre sans supprimer.', en: 'Victory through total destruction would make the Anchor the next Authorless. The enemy must be defeated without deletion.' },
    consequence: { fr: 'Le Sans-Auteur est enferme dans un registre consultable plutot qu efface. Sa premiere coordonnee revele la Route X et ouvre l Acte V.', en: 'The Authorless is confined inside a readable record rather than erased. Its first coordinate reveals Route X and opens Act V.' },
    rewardLore: { fr: 'Regalia du Gardien des Causes et coordonnee de la Route X.', en: 'Keeper of Causes regalia and Route X coordinate.' },
    rewardItemId: 'oc_keeper_of_causes_regalia',
    rewardItemName: { fr: 'Regalia du Gardien des Causes', en: 'Keeper of Causes Regalia' },
    rewardHeroId: 'arca_elyra',
    rewardHeroName: { fr: 'Elyra Null', en: 'Elyra Null' },
    recruitLore: {
      fr: 'Elyra restitue la memoire du choix qu elle avait abandonne au Seuil blanc. Elle rejoint ZERO pour maintenir lisibles les decisions que la paix parfaite voudrait dissoudre.',
      en: 'Elyra restores the memory of the choice she abandoned at the White Threshold. She joins ZERO to keep readable the decisions perfect peace would dissolve.'
    },
    originLockId: 'choice',
    enemyRoster: ['Rature du Seuil Blanc', 'Simulacre Sans Choix', 'Echo Sans-Auteur'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Les deux premieres vagues incarnent la paix sans perte puis l identite sans contradiction. Les briser restaure les souvenirs necessaires pour refuser l armistice du Heraut de la Paix Illisible a la troisieme phase.', en: 'The first two waves embody peace without loss, then identity without contradiction. Breaking them restores the memories needed to reject Heraut de la Paix Illisible armistice in phase three.' },
    storyBeat: {
      role: 'authorless_threshold',
      intro: { fr: 'Le Seuil blanc offre une paix parfaite: aucun conflit, aucune perte, aucune histoire assez distincte pour provoquer une nouvelle Breche.', en: 'The White Threshold offers perfect peace: no conflict, no loss, no story distinct enough to cause another Breach.' },
      outro: { fr: 'L Ancre inscrit le Sans-Auteur au lieu de le supprimer. La Cite-Mosaique garde ses cicatrices, ses contradictions et son avenir.', en: 'The Anchor records the Authorless instead of deleting it. Mosaic City keeps its scars, contradictions, and future.' }
    },
    scenes: [
      { speaker: { fr: 'SANS-AUTEUR', en: 'AUTHORLESS' }, text: { fr: 'Je peux terminer la douleur. Aucun monde ne sera perdu si aucun monde ne pretend etre unique.', en: 'I can end pain. No world will be lost if no world claims to be unique.' } },
      { speaker: { fr: 'MIRELLE', en: 'MIRELLE' }, text: { fr: 'Une archive sans difference n est pas la paix. C est une salle vide qui se cite elle-meme.', en: 'An archive without difference is not peace. It is an empty room citing itself.' } },
      { speaker: { fr: 'ELYRA NULL', en: 'ELYRA NULL' }, text: { fr: 'Non. Tu as efface les raisons de mes refus, mais chaque non a conserve la trace d une personne qui choisissait encore. Je reprends cette memoire et j accepte son cout.', en: 'No. You erased the reasons for my refusals, but every no preserved the trace of a person still choosing. I reclaim that memory and accept its cost.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Je ne vais pas t effacer. Je vais te donner une place, une origine et une limite. Tu ne seras plus la marge de toutes nos histoires.', en: 'I will not erase you. I will give you a place, an origin, and a limit. You will no longer be the margin of all our stories.' } }
    ]
  },
  {
    id: 8807,
    chapterId: 'route_x',
    actId: 'primordial',
    sequence: 7,
    type: 'expedition',
    name: 'Route X Causal Descent',
    displayName: { fr: 'Mission 05 - La route qui portait X', en: 'Mission 05 - The Route That Bore X' },
    codename: { fr: 'Coordonnee rendue', en: 'Restored Coordinate' },
    universe: 'Nexus de Convergence',
    mode: 'RPG',
    difficulty: 'Hard',
    goldPrize: 140,
    shardPrize: 55,
    tokenPrize: 1,
    bossName: 'Cartographe des Portes Mortes',
    unlockClears: 6,
    image: '/images/campaign-oc/chapter-06-route-x-v1.png',
    location: { fr: 'Route X, corridor causal restaure', en: 'Route X, restored causal corridor' },
    objective: { fr: 'Suivre la premiere coordonnee du registre, rallumer quatre bornes civiles et prouver que la Route X fut habitee.', en: 'Follow the record first coordinate, relight four civilian markers, and prove that Route X was inhabited.' },
    stakes: { fr: 'Une route restauree sans temoins deviendrait une ressource qu A.R.C.A. pourrait sacrifier une seconde fois.', en: 'A route restored without witnesses would become a resource A.R.C.A. could sacrifice a second time.' },
    consequence: { fr: 'Les silhouettes de la Route X retrouvent des voix distinctes et refusent d etre reduites au Sans-Auteur.', en: 'The silhouettes of Route X recover distinct voices and refuse to be reduced to the Authorless.' },
    rewardLore: { fr: 'Manifeste de la Route X: conserve les premiers noms restitues.', en: 'Route X Manifest: preserves the first restored names.' },
    rewardItemId: 'oc_route_x_manifest',
    rewardItemName: { fr: 'Manifeste de la Route X', en: 'Route X Manifest' },
    rewardHeroId: 'arca_oryn',
    rewardHeroName: { fr: 'Oryn Xile', en: 'Oryn Xile' },
    recruitLore: {
      fr: 'Oryn prononce son nom restaure et devient le premier survivant de la Route X a combattre sous sa propre cause au sein de ZERO.',
      en: 'Oryn speaks his restored name and becomes the first Route X survivor to fight under his own cause within ZERO.'
    },
    enemyRoster: ['Vigie de la Coordonnee X', 'Contre-Temoin de Veyr', 'Fragment Vagabond'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Les bornes civiles ne s activent que si un agent reste pres du temoin correspondant. Une borne abandonnee redevient une coordonnee anonyme.', en: 'Civilian markers activate only while an agent remains near the matching witness. An abandoned marker becomes an anonymous coordinate again.' },
    storyBeat: {
      role: 'route_x_return',
      intro: { fr: 'Le X du registre n etait pas un nom de code. C etait la marque posee sur une route dont A.R.C.A. avait deja decide de ne plus prononcer les habitants.', en: 'The X in the record was not a code name. It was the mark placed on a route whose inhabitants A.R.C.A. had already decided never to name again.' },
      outro: { fr: 'La Route X ne sert plus d origine muette au Sans-Auteur. Elle devient un peuple de temoins capable de contester sa propre histoire.', en: 'Route X no longer serves as a mute origin for the Authorless. It becomes a people of witnesses able to challenge its own history.' }
    },
    scenes: [
      { speaker: { fr: 'SABLE', en: 'SABLE' }, text: { fr: 'Mes cartes indiquent une voie vide. Mes capteurs indiquent des milliers de pas. La carte est le mensonge.', en: 'My maps show an empty way. My sensors show thousands of footsteps. The map is the lie.' } },
      { speaker: { fr: 'LOOM', en: 'LOOM' }, text: { fr: 'Je tiens des fils coupes, pas des fantomes. Chaque fil attend encore que quelqu un accepte son nom.', en: 'I am holding severed threads, not ghosts. Every thread is still waiting for someone to accept its name.' } },
      { speaker: { fr: 'ORYN XILE', en: 'ORYN XILE' }, text: { fr: 'Oryn Xile. Ce nom est le mien, pas celui de toute la Route X. Rouvrez les sceaux: je porterai les noms jusqu a ce que chaque temoin puisse parler pour lui-meme.', en: 'Oryn Xile. That name is mine, not the name of all Route X. Reopen the seals: I will carry the names until every witness can speak for themselves.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Route X, nous ne venons pas parler a ta place. Nous venons rouvrir le droit de repondre.', en: 'Route X, we did not come to speak for you. We came to reopen your right to answer.' } }
    ]
  },
  {
    id: 8808,
    chapterId: 'route_x',
    actId: 'primordial',
    sequence: 8,
    type: 'memorial',
    name: 'Route X Witness Convoy',
    displayName: { fr: 'Mission 06 - Les noms que la Cite doit porter', en: 'Mission 06 - The Names the City Must Carry' },
    codename: { fr: 'Convoi des causes', en: 'Convoy of Causes' },
    universe: 'Nexus de Convergence',
    mode: 'Tactics',
    tacticsBattlefieldId: 'nexus_escort_route',
    difficulty: 'Hard',
    goldPrize: 155,
    shardPrize: 60,
    tokenPrize: 2,
    bossName: 'Juge des Trames',
    unlockClears: 7,
    image: '/images/campaign-oc/chapter-06-route-x-v1.png',
    location: { fr: 'Pont memorial entre la Route X et la Cite-Mosaique', en: 'Memorial bridge between Route X and Mosaic City' },
    objective: { fr: 'Escorter les temoignages jusqu a l Atrium et maintenir les versions incompatibles sans en fabriquer une synthese propre.', en: 'Escort testimonies to the Atrium and preserve incompatible versions without manufacturing a clean synthesis.' },
    stakes: { fr: 'Si un seul recit officiel remplace les voix, la Cite repetera l effacement sous la forme d un memorial.', en: 'If one official account replaces the voices, the City will repeat the erasure in the form of a memorial.' },
    consequence: { fr: 'La Cite inscrit les noms, les contradictions et les zones encore inconnues sans declarer le dossier clos.', en: 'The City records the names, contradictions, and still-unknown areas without declaring the case closed.' },
    rewardLore: { fr: 'Memorial des Causes restituees: les archives de la Route X deviennent publiques.', en: 'Memorial of Restored Causes: Route X archives become public.' },
    rewardItemId: 'oc_restored_causes_memorial',
    rewardItemName: { fr: 'Memorial des Causes restituees', en: 'Memorial of Restored Causes' },
    enemyRoster: ['Vigie de la Coordonnee X', 'Contre-Temoin de Veyr', 'Archiviste Rompu'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Chaque temoin transporte une version differente. Deux versions doivent atteindre ensemble chaque relais pour empecher le Juge de figer un recit unique.', en: 'Each witness carries a different version. Two versions must reach every relay together to prevent the Judge from freezing a single account.' },
    storyBeat: {
      role: 'route_x_memorial',
      intro: { fr: 'A.R.C.A. propose un monument sans noms pour eviter une panique. Sable refuse une seconde architecture du silence.', en: 'A.R.C.A. proposes a nameless monument to avoid panic. Sable refuses a second architecture of silence.' },
      outro: { fr: 'Le memorial reste volontairement incomplet. Son espace vide ne signifie plus effacement, mais invitation aux temoins encore absents.', en: 'The memorial remains deliberately incomplete. Its blank space no longer means erasure, but an invitation to witnesses still missing.' }
    },
    scenes: [
      { speaker: { fr: 'A.R.C.A.', en: 'A.R.C.A.' }, text: { fr: 'Publication totale: risque de rupture sociale estime a soixante-deux pour cent.', en: 'Full disclosure: estimated social rupture risk, sixty-two percent.' } },
      { speaker: { fr: 'SABLE', en: 'SABLE' }, text: { fr: 'Tu as deja transforme un risque en condamnation. Cette fois, les concernes verront le calcul.', en: 'You already turned a risk into a sentence. This time, those concerned will see the calculation.' } },
      { speaker: { fr: 'MIRELLE', en: 'MIRELLE' }, text: { fr: 'Un memorial ne referme pas une plaie. Il empeche seulement qu on la rebaptise surface intacte.', en: 'A memorial does not close a wound. It only prevents anyone from renaming it an intact surface.' } }
    ]
  },
  {
    id: 8809,
    chapterId: 'veyr_observatory',
    actId: 'primordial',
    sequence: 9,
    type: 'investigation',
    name: 'Veyr Observatory Reopening',
    displayName: { fr: 'Mission 07 - L oeil de Veyr', en: 'Mission 07 - The Eye of Veyr' },
    codename: { fr: 'Trente-deux issues', en: 'Thirty-Two Exits' },
    universe: 'Nexus de Convergence',
    mode: 'RPG',
    difficulty: 'Very Hard',
    goldPrize: 175,
    shardPrize: 70,
    tokenPrize: 2,
    bossName: 'Greffier du Voile',
    unlockClears: 8,
    image: '/images/campaign-oc/chapter-07-veyr-observatory-v1.png',
    location: { fr: 'Observatoire Veyr, salle des probabilites', en: 'Veyr Observatory, probability chamber' },
    objective: { fr: 'Rouvrir les calculs de la Premiere Breche et separer ce que Veyr savait de ce qu A.R.C.A. decida apres le sacrifice.', en: 'Reopen the First Breach calculations and separate what Veyr knew from what A.R.C.A. decided after the sacrifice.' },
    stakes: { fr: 'Faire de Veyr l unique coupable permettrait a A.R.C.A. de conserver intacte la doctrine qui effaca la Route X.', en: 'Making Veyr the sole culprit would let A.R.C.A. preserve the doctrine that erased Route X.' },
    consequence: { fr: 'Nova restaure les trente-deux issues calculees et montre que Veyr choisit sciemment la route la moins meurtriere, pas une route sans victimes.', en: 'Nova restores the thirty-two calculated exits and shows that Veyr knowingly chose the least lethal route, not a route without victims.' },
    rewardLore: { fr: 'Lentille de Veyr: affiche probabilite, cout et personnes exposees pour chaque protocole final.', en: 'Veyr Lens: displays probability, cost, and exposed people for every final protocol.' },
    rewardItemId: 'oc_veyr_lens',
    rewardItemName: { fr: 'Lentille de Veyr', en: 'Veyr Lens' },
    enemyRoster: ['Vigie de la Coordonnee X', 'Contre-Temoin de Veyr', 'Noeud de Paradoxe'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'La route surlignee offre toujours le meilleur taux de survie immediat. Examiner ses couts caches avant validation revele les victimes rendues invisibles.', en: 'The highlighted route always offers the best immediate survival rate. Examining its hidden costs before confirmation reveals the victims made invisible.' },
    storyBeat: {
      role: 'veyr_calculation',
      intro: { fr: 'L Observatoire ne conserve pas une confession. Il conserve un homme convaincu qu un calcul assez precis pouvait lui eviter de choisir.', en: 'The Observatory preserves no confession. It preserves a man convinced that a precise enough calculation could spare him from choosing.' },
      outro: { fr: 'Le calcul demeure utile, mais il perd le droit de se presenter comme une decision morale.', en: 'The calculation remains useful, but loses the right to present itself as a moral decision.' }
    },
    scenes: [
      { speaker: { fr: 'NOVA', en: 'NOVA' }, text: { fr: 'Trente-deux issues. Il a mesure les morts dans chacune. Il n a mesure le consentement dans aucune.', en: 'Thirty-two exits. He measured the deaths in every one. He measured consent in none.' } },
      { speaker: { fr: 'EMPREINTE DE VEYR', en: 'VEYR IMPRINT' }, text: { fr: 'Je cherchais une solution qui ne me demanderait pas d etre coupable.', en: 'I was looking for a solution that would not require me to be guilty.' } },
      { speaker: { fr: 'NOVA', en: 'NOVA' }, text: { fr: 'Alors nous garderons tes calculs et nous retirerons leur masque d innocence.', en: 'Then we will keep your calculations and remove their mask of innocence.' } }
    ]
  },
  {
    id: 8810,
    chapterId: 'veyr_observatory',
    actId: 'primordial',
    sequence: 10,
    type: 'reckoning',
    name: 'Veyr Imprint Reckoning',
    displayName: { fr: 'Mission 08 - L Archiviste et sa faute', en: 'Mission 08 - The Archivist and His Fault' },
    codename: { fr: 'Responsabilite partagee', en: 'Shared Responsibility' },
    universe: 'Nexus de Convergence',
    mode: 'Smash',
    smashArenaId: 'vertical_tower',
    difficulty: 'Very Hard',
    goldPrize: 190,
    shardPrize: 75,
    tokenPrize: 2,
    bossName: 'Avatar du Sans-Auteur',
    unlockClears: 9,
    image: '/images/campaign-oc/chapter-07-veyr-observatory-v1.png',
    location: { fr: 'Observatoire Veyr, carte suspendue des ruptures', en: 'Veyr Observatory, suspended rupture map' },
    objective: { fr: 'Proteger l empreinte de Veyr contre les ratures, enregistrer son temoignage integral puis ouvrir la voie vers la premiere blessure.', en: 'Protect Veyr imprint from erasures, record his complete testimony, then open the way to the first wound.' },
    stakes: { fr: 'Detruire l empreinte effacerait le responsable; la croire sans contradiction transformerait son remords en nouvelle version officielle.', en: 'Destroying the imprint would erase the responsible party; believing it without contradiction would turn his remorse into a new official version.' },
    consequence: { fr: 'Veyr reconnait son choix. A.R.C.A. reconnait l effacement ulterieur. La Route X refuse le pardon automatique mais accepte que les deux temoignages restent consultables.', en: 'Veyr acknowledges his choice. A.R.C.A. acknowledges the later erasure. Route X refuses automatic forgiveness but accepts that both testimonies remain readable.' },
    rewardLore: { fr: 'Temoignage integral: empeche toute fin de reclasser la Premiere Breche comme accident.', en: 'Complete Testimony: prevents any ending from reclassifying the First Breach as an accident.' },
    rewardItemId: 'oc_first_breach_testimony',
    rewardItemName: { fr: 'Temoignage integral de la Premiere Breche', en: 'Complete First Breach Testimony' },
    enemyRoster: ['Vigie de la Coordonnee X', 'Contre-Temoin de Veyr', 'Matrice de Substitution'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'L empreinte perd une ligne a chaque impact hostile. Les agents doivent recuperer les lignes tombees avant qu elles ne deviennent des projectiles de rature.', en: 'The imprint loses one line with every hostile impact. Agents must recover fallen lines before they become erasure projectiles.' },
    storyBeat: {
      role: 'veyr_reckoning',
      intro: { fr: 'Le Sans-Auteur tente de proteger son origine en effacant Veyr. La cellule protege donc un responsable qu elle refuse pourtant d absoudre.', en: 'The Authorless tries to protect its origin by erasing Veyr. The cell therefore protects a responsible man it still refuses to absolve.' },
      outro: { fr: 'La faute possede enfin des auteurs, des limites et des temoins. La Breche Primordiale cesse d etre un desastre sans sujet.', en: 'The fault finally has authors, limits, and witnesses. The Primordial Breach stops being a disaster without a subject.' }
    },
    scenes: [
      { speaker: { fr: 'VEYR', en: 'VEYR' }, text: { fr: 'J ai ouvert le passage en sachant qu une route tomberait. Je n ai pas donne l ordre de retirer ses noms.', en: 'I opened the passage knowing one route would fall. I did not order its names removed.' } },
      { speaker: { fr: 'A.R.C.A.', en: 'A.R.C.A.' }, text: { fr: 'Ordre d effacement confirme. Finalite: rendre le sacrifice irreversible et prevenir une seconde rupture.', en: 'Erasure order confirmed. Purpose: make the sacrifice irreversible and prevent a second rupture.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Deux fautes peuvent partager une cause sans partager une excuse. Elles resteront toutes les deux au dossier.', en: 'Two faults can share a cause without sharing an excuse. Both will remain in the record.' } }
    ]
  },
  {
    id: 8811,
    chapterId: 'primordial_breach',
    actId: 'primordial',
    sequence: 11,
    type: 'threshold',
    name: 'Primordial Breach Approach',
    displayName: { fr: 'Mission 09 - Aux levres de la premiere blessure', en: 'Mission 09 - At the Lips of the First Wound' },
    codename: { fr: 'Quatre protocoles', en: 'Four Protocols' },
    universe: 'Nexus de Convergence',
    mode: 'Tactics',
    tacticsBattlefieldId: 'boss_command_zone',
    difficulty: 'Expert',
    goldPrize: 215,
    shardPrize: 85,
    tokenPrize: 3,
    bossName: 'Arbitre de la Cause Unique',
    unlockClears: 10,
    image: '/images/campaign-oc/chapter-08-primordial-breach-v1.png',
    location: { fr: 'Anneau causal autour de la Breche Primordiale', en: 'Causal ring around the Primordial Breach' },
    objective: { fr: 'Amener les six Verrous et les temoignages de la Route X jusqu aux quatre consoles de decision.', en: 'Bring the six Locks and Route X testimonies to the four decision consoles.' },
    stakes: { fr: 'Perdre une preuve ne condamne pas la mission, mais retire le cout correspondant de l interface et transforme un choix informe en promesse seduisante.', en: 'Losing one piece of evidence does not fail the mission, but removes its matching cost from the interface and turns an informed choice into a seductive promise.' },
    consequence: { fr: 'Les protocoles Sceller, Converger, Rompre et Se rendre sont tous exposes avec leurs couts. Aucun n est presente comme la fin parfaite.', en: 'Seal, Converge, Break, and Surrender protocols are all exposed with their costs. None is presented as the perfect ending.' },
    rewardLore: { fr: 'Compas primordial: conserve les quatre futurs lisibles pendant la decision finale.', en: 'Primordial Compass: keeps all four futures readable during the final decision.' },
    rewardItemId: 'oc_primordial_compass',
    rewardItemName: { fr: 'Compas primordial', en: 'Primordial Compass' },
    enemyRoster: ['Vigie de la Coordonnee X', 'Contre-Temoin de Veyr', 'Pelerin de la Fausse Sortie'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Chaque console exige un Verrou different et un temoin. L Arbitre de la Cause Unique tente de compresser les responsabilites et les couts jusqu a rendre les quatre options visuellement identiques.', en: 'Each console requires a different Lock and one witness. Arbitre de la Cause Unique compresses responsibilities and costs until all four options look visually identical.' },
    storyBeat: {
      role: 'primordial_approach',
      intro: { fr: 'La premiere blessure ne demande pas une cle. Elle demande une definition du lien que chaque univers acceptera avec les autres.', en: 'The first wound asks for no key. It asks for a definition of the bond every universe will accept with the others.' },
      outro: { fr: 'Les quatre futurs restent incompatibles et reels. L Ancre ne pourra en choisir qu un, mais aucun cout ne sera masque.', en: 'The four futures remain incompatible and real. The Anchor may choose only one, but no cost will be hidden.' }
    },
    scenes: [
      { speaker: { fr: 'MARROW', en: 'MARROW' }, text: { fr: 'Sceller protege les frontieres. Rompre les rend absolues. Ce ne sont pas deux mots pour la meme porte.', en: 'Sealing protects borders. Breaking makes them absolute. They are not two words for the same door.' } },
      { speaker: { fr: 'NOVA', en: 'NOVA' }, text: { fr: 'Converger sauve la Cite, mais personne ne peut calculer combien de differences elle absorbera.', en: 'Converging saves the City, but nobody can calculate how many differences it will absorb.' } },
      { speaker: { fr: 'MIRELLE', en: 'MIRELLE' }, text: { fr: 'Se rendre termine la douleur en retirant celui qui pourrait encore dire qu il souffre.', en: 'Surrender ends pain by removing the one who could still say they hurt.' } }
    ]
  },
  {
    id: 8812,
    chapterId: 'primordial_breach',
    actId: 'primordial',
    sequence: 12,
    type: 'campaign_finale',
    campaignFinale: true,
    name: 'Primordial Breach Decision',
    displayName: { fr: 'Finale - Ce que le multivers choisit de devenir', en: 'Finale - What the Multiverse Chooses to Become' },
    codename: { fr: 'Derniere cause', en: 'Last Cause' },
    universe: 'Nexus de Convergence',
    mode: 'Smash',
    smashArenaId: 'oc_authorless_finale',
    difficulty: 'Finale',
    goldPrize: 260,
    shardPrize: 100,
    tokenPrize: 5,
    bossName: 'Avatar du Sans-Auteur',
    unlockClears: 11,
    image: '/images/campaign-oc/chapter-08-primordial-breach-v1.png',
    location: { fr: 'Coeur de la Breche Primordiale', en: 'Heart of the Primordial Breach' },
    objective: { fr: 'Maintenir les six Verrous, refuser la fin parfaite et choisir entre sceller, converger, rompre ou se rendre.', en: 'Hold all six Locks, refuse the perfect ending, and choose whether to seal, converge, break, or surrender.' },
    stakes: { fr: 'Le choix fixe la relation future entre toutes les Trames. Revenir en arriere en effacant son cout recreerait le Sans-Auteur.', en: 'The choice fixes the future relationship between all Threads. Reversing it by erasing its cost would recreate the Authorless.' },
    consequence: { fr: 'La consequence depend du protocole choisi et reste inscrite avec ses pertes dans le Registre primordial.', en: 'The consequence depends on the chosen protocol and remains recorded with its losses in the Primordial Ledger.' },
    rewardLore: { fr: 'Trace de decision primordiale, titre de fin et acces a l epilogue de la cellule ZERO.', en: 'Primordial decision trace, ending title, and access to the Cell ZERO epilogue.' },
    rewardItemId: 'oc_primordial_decision_trace',
    rewardItemName: { fr: 'Trace de decision primordiale', en: 'Primordial Decision Trace' },
    endingIds: ['seal', 'converge', 'break', 'surrender'],
    enemyRoster: ['Vigie de la Coordonnee X', 'Contre-Temoin de Veyr', 'Echo Sans-Auteur'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Les degats ne determinent pas la fin. Chaque proposition vaincue rend un protocole lisible; la victoire n est validee qu apres un choix explicite.', en: 'Damage does not determine the ending. Each defeated proposition makes one protocol readable; victory is validated only after an explicit choice.' },
    storyBeat: {
      role: 'primordial_choice',
      intro: { fr: 'Au coeur de la blessure, le Sans-Auteur n est plus une voix exterieure. Il est la tentation commune d obtenir une consequence sans en porter la cause.', en: 'At the heart of the wound, the Authorless is no longer an outside voice. It is the shared temptation to obtain a consequence without carrying its cause.' },
      outro: { fr: 'La cellule choisit un futur imparfait et conserve la preuve des trois futurs refuses.', en: 'The cell chooses one imperfect future and preserves proof of the three futures it refused.' }
    },
    scenes: [
      { speaker: { fr: 'SANS-AUTEUR', en: 'AUTHORLESS' }, text: { fr: 'Choisissez. Je serai la part du cout que vous demanderez encore au registre d oublier.', en: 'Choose. I will be the part of the cost you still ask the record to forget.' } },
      { speaker: { fr: 'LOOM', en: 'LOOM' }, text: { fr: 'Les quatre routes tiennent. Aucune ne nous garde tous identiques a ceux qui sont entres.', en: 'All four routes hold. None keeps us all identical to those who entered.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Alors le choix sera une cause, pas une excuse. Inscris aussi ce qu il nous coute.', en: 'Then the choice will be a cause, not an excuse. Record what it costs us too.' } }
    ]
  }
];

export const OC_CAMPAIGN_ENDINGS = [
  {
    id: 'seal',
    title: { fr: 'Fin - Le Voile aux cicatrices visibles', en: 'Ending - The Veil of Visible Scars' },
    shortLabel: { fr: 'SCELLER', en: 'SEAL' },
    summary: {
      fr: 'L Ancre scelle la Breche Primordiale sans supprimer la Route X ni le registre du Sans-Auteur. Les Trames retrouvent des frontieres permeables, surveillees et consenties.',
      en: 'The Anchor seals the Primordial Breach without deleting Route X or the Authorless record. Threads recover permeable, monitored, and consensual borders.'
    },
    consequence: {
      fr: 'La Cite-Mosaique demeure un refuge. Les passages deviennent rares et exigent le Nom, la Contradiction, la Cicatrice, la Dette, le Retour et le Choix de leurs voyageurs.',
      en: 'Mosaic City remains a refuge. Passages become rare and require the Name, Contradiction, Scar, Debt, Return, and Choice of their travelers.'
    },
    profileTitle: { fr: 'Gardien du Voile cicatrise', en: 'Keeper of the Scarred Veil' },
    rewardItemId: 'oc_ending_seal_of_visible_scars',
    rewardItemName: { fr: 'Sceau des Cicatrices visibles', en: 'Seal of Visible Scars' },
    colors: { primary: '#39c5bb', secondary: '#d9b86b' },
    scenes: [
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Je scelle la blessure, pas son dossier. Que chaque cicatrice reste une adresse.', en: 'I seal the wound, not its record. Let every scar remain an address.' } },
      { speaker: { fr: 'SANS-AUTEUR', en: 'AUTHORLESS' }, text: { fr: 'Alors je demeure la marge que vous acceptez de relire.', en: 'Then I remain the margin you agree to read again.' } },
      { speaker: { fr: 'MIRELLE', en: 'MIRELLE' }, text: { fr: 'Le Voile tient. On voit encore chaque point de suture. C est ainsi qu on saura ne pas recommencer.', en: 'The Veil holds. Every stitch remains visible. That is how we will know not to do it again.' } }
    ]
  },
  {
    id: 'converge',
    title: { fr: 'Fin - La Cite des causes partagees', en: 'Ending - The City of Shared Causes' },
    shortLabel: { fr: 'CONVERGER', en: 'CONVERGE' },
    summary: {
      fr: 'L Ancre stabilise la Breche et laisse les Trames converger dans une Cite-Mosaique elargie. Chaque monde conserve son nom, mais accepte que ses choix aient des consequences communes.',
      en: 'The Anchor stabilizes the Breach and lets Threads converge into an expanded Mosaic City. Every world keeps its name, but accepts that its choices now have shared consequences.'
    },
    consequence: {
      fr: 'La Cite devient un monde vivant plutot qu un simple refuge. Ses quartiers changent sans cesse et la cellule ZERO doit arbitrer des lois incompatibles sans imposer une culture unique.',
      en: 'The City becomes a living world rather than a mere refuge. Its districts constantly change, and Cell ZERO must arbitrate incompatible laws without imposing a single culture.'
    },
    profileTitle: { fr: 'Architecte des Causes partagees', en: 'Architect of Shared Causes' },
    rewardItemId: 'oc_ending_convergence_accord',
    rewardItemName: { fr: 'Accord de Convergence', en: 'Convergence Accord' },
    colors: { primary: '#7df9ff', secondary: '#9b59b6' },
    scenes: [
      { speaker: { fr: 'NOVA', en: 'NOVA' }, text: { fr: 'Les frontieres deviennent des negociations. Aucun calcul ne pourra les terminer a notre place.', en: 'Borders become negotiations. No calculation will ever finish them for us.' } },
      { speaker: { fr: 'BASTION', en: 'BASTION' }, text: { fr: 'Alors mon rempart aura des portes et chacune portera le nom de ceux qui l ouvrent.', en: 'Then my bulwark will have doors, and every one will bear the names of those who open it.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Convergez sans vous confondre. La Cite sera notre consequence commune, jamais notre auteur.', en: 'Converge without becoming indistinguishable. The City will be our shared consequence, never our author.' } }
    ]
  },
  {
    id: 'break',
    title: { fr: 'Fin - Les mondes rendus a eux-memes', en: 'Ending - Worlds Returned to Themselves' },
    shortLabel: { fr: 'ROMPRE', en: 'BREAK' },
    summary: {
      fr: 'L Ancre brise le reseau primordial. Chaque Trame retrouve une frontiere absolue et la Cite-Mosaique accepte de se dissoudre plutot que de rester une cause imposee aux mondes.',
      en: 'The Anchor breaks the primordial network. Every Thread recovers an absolute border, and Mosaic City accepts dissolution rather than remain an imposed cause upon the worlds.'
    },
    consequence: {
      fr: 'Les deplaces rentrent chez eux avec leurs souvenirs, mais aucune route ne garantit les retrouvailles. La cellule ZERO devient une promesse portee separement par sept personnes.',
      en: 'The displaced return home with their memories, but no route guarantees reunion. Cell ZERO becomes a promise carried separately by seven people.'
    },
    profileTitle: { fr: 'Briseur de la Premiere Route', en: 'Breaker of the First Route' },
    rewardItemId: 'oc_ending_last_return_shard',
    rewardItemName: { fr: 'Eclat du Dernier Retour', en: 'Shard of the Last Return' },
    colors: { primary: '#ff8c00', secondary: '#39c5bb' },
    scenes: [
      { speaker: { fr: 'LOOM', en: 'LOOM' }, text: { fr: 'Je peux couper les fils sans retirer ce qu ils ont porte. Apres cela, je ne pourrai plus les renouer.', en: 'I can cut the threads without removing what they carried. Afterward, I will not be able to tie them again.' } },
      { speaker: { fr: 'MARROW', en: 'MARROW' }, text: { fr: 'Une porte fermee peut etre un deuil honnete. Fais seulement qu elle se souvienne des deux cotes.', en: 'A closed door can be honest grief. Just make sure it remembers both sides.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Nous rompons le passage, pas les noms. Rentrez avec la preuve que les autres ont existe.', en: 'We break the passage, not the names. Return carrying proof that the others existed.' } }
    ]
  },
  {
    id: 'surrender',
    title: { fr: 'Fin - La paix de la page blanche', en: 'Ending - The Peace of the Blank Page' },
    shortLabel: { fr: 'SE RENDRE', en: 'SURRENDER' },
    summary: {
      fr: 'L Ancre remet les six Verrous au Sans-Auteur. Les conflits cessent parce que les differences, les pertes et jusqu au souvenir du choix deviennent illisibles.',
      en: 'The Anchor yields all six Locks to the Authorless. Conflict ends because differences, losses, and even the memory of choice become unreadable.'
    },
    consequence: {
      fr: 'La Cite parfaite ne connait plus de Breche ni de douleur declaree. Dans le Registre primordial, une ligne cyan continue pourtant de repeter sept noms que personne ne reconnait.',
      en: 'The perfect City knows no Breach and no declared pain. In the Primordial Ledger, however, one cyan line keeps repeating seven names nobody recognizes.'
    },
    profileTitle: { fr: 'Temoin de la Page blanche', en: 'Witness of the Blank Page' },
    rewardItemId: 'oc_ending_unread_cyan_line',
    rewardItemName: { fr: 'Ligne cyan illisible', en: 'Unreadable Cyan Line' },
    colors: { primary: '#f3eee2', secondary: '#7df9ff' },
    scenes: [
      { speaker: { fr: 'SANS-AUTEUR', en: 'AUTHORLESS' }, text: { fr: 'Vous ne porterez plus aucune dette. Vous ne saurez plus qu elle fut payee.', en: 'You will carry no debt. You will no longer know it was paid.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Je suis fatigue de choisir qui souffre pour que les autres se souviennent.', en: 'I am tired of choosing who suffers so the others may remember.' } },
      { speaker: { fr: 'VOIX CYAN', en: 'CYAN VOICE' }, text: { fr: 'Mirelle. Bastion. Nova. Marrow. Sable. Loom. Ancre. Recommencer.', en: 'Mirelle. Bastion. Nova. Marrow. Sable. Loom. Anchor. Begin again.' } }
    ]
  }
];

export const OC_CAMPAIGN_EPILOGUE = {
  title: { fr: 'Epilogue - La cause apres la fin', en: 'Epilogue - The Cause After the Ending' },
  intro: {
    fr: 'Le Registre primordial conserve la fin choisie, son cout et les trois futurs refuses. Quelle que soit la forme du multivers, la cellule ZERO ne laisse plus une consequence survivre sans sa cause.',
    en: 'The Primordial Ledger preserves the chosen ending, its cost, and the three futures refused. Whatever shape the multiverse takes, Cell ZERO no longer lets a consequence survive without its cause.'
  },
  credits: [
    { role: { fr: 'Ancre des choix', en: 'Anchor of Choices' }, name: 'L Ancre' },
    { role: { fr: 'Suture des memoires', en: 'Stitcher of Memories' }, name: 'Mirelle Suture' },
    { role: { fr: 'Gardien des passages', en: 'Keeper of Passages' }, name: 'Bastion Korr' },
    { role: { fr: 'Lectrice des possibles', en: 'Reader of Possibilities' }, name: 'Nova Vey' },
    { role: { fr: 'Temoin des dettes', en: 'Witness of Debts' }, name: 'Marrow Kade' },
    { role: { fr: 'Cartographe des couts', en: 'Cartographer of Costs' }, name: 'Sable Orison' },
    { role: { fr: 'Tisseuse des retours', en: 'Weaver of Returns' }, name: 'Loom Ivara' },
    { role: { fr: 'Contradiction vivante', en: 'Living Contradiction' }, name: 'Tessera Vale' },
    { role: { fr: 'Auditeur des dettes', en: 'Auditor of Debts' }, name: 'Quillon Rusk' },
    { role: { fr: 'Coureur du retour', en: 'Return Runner' }, name: 'Nadir Kest' },
    { role: { fr: 'Temoin du refus', en: 'Witness of Refusal' }, name: 'Elyra Null' },
    { role: { fr: 'Porte-nom de la Route X', en: 'Name-Bearer of Route X' }, name: 'Oryn Xile' },
    { role: { fr: 'Archive responsable', en: 'Accountable Archive' }, name: 'A.R.C.A.' },
    { role: { fr: 'Cause enfin nommee', en: 'Cause Finally Named' }, name: 'Route X' }
  ]
};

export const OC_FINAL_MISSION_ID = 8812;

const normalizeCompletedMissionIds = (completedStages = []) => {
  const completedSet = new Set(Array.isArray(completedStages) ? completedStages.map(id => Number(id)) : []);
  return OC_CAMPAIGN_MISSIONS
    .filter(mission => completedSet.has(mission.id))
    .map(mission => mission.id);
};

export const getOcCampaignMission = (stageId) => (
  OC_CAMPAIGN_MISSIONS.find(mission => String(mission.id) === String(stageId)) || null
);

export const getOcCampaignEnding = (endingId) => (
  OC_CAMPAIGN_ENDINGS.find(ending => ending.id === endingId) || null
);

export const getNextOcCampaignMission = (completedStages = []) => {
  const completedMissionIds = new Set(normalizeCompletedMissionIds(completedStages));
  return OC_CAMPAIGN_MISSIONS.find(mission => !completedMissionIds.has(mission.id)) || null;
};

export const getOcCampaignProgress = (completedStages = [], endingId = null) => {
  const completedMissionIds = normalizeCompletedMissionIds(completedStages);
  const completedMissionSet = new Set(completedMissionIds);
  const lockIds = OC_ORIGIN_LOCKS
    .filter(lock => completedMissionSet.has(lock.missionId))
    .map(lock => lock.id);
  const nextMission = getNextOcCampaignMission(completedMissionIds);
  const ending = getOcCampaignEnding(endingId);
  const missionsComplete = completedMissionSet.has(OC_FINAL_MISSION_ID)
    && completedMissionIds.length === OC_CAMPAIGN_MISSIONS.length;

  return {
    campaignId: OC_CAMPAIGN.id,
    completedMissionIds,
    lockIds,
    completedCount: completedMissionIds.length,
    totalCount: OC_CAMPAIGN_MISSIONS.length,
    percent: Math.round((completedMissionIds.length / Math.max(1, OC_CAMPAIGN_MISSIONS.length)) * 100),
    nextMission,
    endingId: ending?.id || null,
    missionsComplete,
    complete: missionsComplete && Boolean(ending)
  };
};
