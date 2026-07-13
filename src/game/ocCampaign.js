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
  cast: ['L Ancre', 'Mirelle Suture', 'Bastion Korr', 'Nova Vey', 'Marrow Kade', 'Sable Orison', 'Loom Ivara']
};

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
    chapterReward: { fr: 'Balise de passage causal et reduction d un verrou narratif lors de l Acte II.', en: 'Causal Passage Beacon and one reduced narrative lock during Act II.' },
    gameplayRule: { fr: 'Les faux portails attirent les allies selon leur regret; Loom doit les scanner pendant que Bastion maintient une route d evacuation.', en: 'False portals pull allies according to their regret; Loom must scan them while Bastion maintains an evacuation route.' }
  },
  {
    id: 'omniverse_endgame',
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
    chapterReward: { fr: 'Skin Ancre du Palimpseste, titre Gardien des Causes et ouverture de l Acte II.', en: 'Palimpsest Anchor skin, Keeper of Causes title, and Act II opening.' },
    gameplayRule: { fr: 'Le boss ne peut pas etre acheve par les degats: chaque proposition doit etre contredite puis ancree par un souvenir de la cellule.', en: 'The boss cannot be finished through damage: each proposition must be contradicted, then anchored by a cell memory.' }
  }
];

export const OC_CAMPAIGN_MISSIONS = [
  {
    id: 8801,
    chapterId: 'first_lock',
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
    sequence: 2,
    type: 'mission',
    name: 'Archive Static Corridor',
    displayName: { fr: 'Mission 01 - Ce que l Archive refuse', en: 'Mission 01 - What the Archive Refuses' },
    codename: { fr: 'Memoire croisee', en: 'Crossed Memory' },
    universe: 'Nexus de Convergence',
    mode: 'Tactics',
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
    originLockId: 'contradiction',
    enemyRoster: ['Archiviste Rompu', 'Noeud de Paradoxe', 'Echo Sans-Auteur'],
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
      { speaker: { fr: 'JUGE DES TRAMES', en: 'THREAD JUDGE' }, text: { fr: 'Verdict: la contradiction demeure recevable. L Ancre peut poursuivre.', en: 'Verdict: the contradiction remains admissible. The Anchor may proceed.' } }
    ]
  },
  {
    id: 8803,
    chapterId: 'faction_war',
    sequence: 3,
    type: 'mission',
    name: 'Origin Shard Foundry',
    displayName: { fr: 'Mission 02 - La Forge des vies possibles', en: 'Mission 02 - The Forge of Possible Lives' },
    codename: { fr: 'Eclats divergents', en: 'Divergent Shards' },
    universe: 'Nexus de Convergence',
    mode: 'Smash',
    difficulty: 'Medium',
    goldPrize: 70,
    shardPrize: 28,
    bossName: 'Avatar du Sans-Auteur',
    unlockClears: 2,
    image: '/images/campaign-oc/chapter-02-origin-forge-v1.png',
    location: { fr: 'Fonderie des Eclats d Origine', en: 'Origin Shard Foundry' },
    objective: { fr: 'Defendre les matrices d origine pendant que Nova separe les possibilites vecues des appats fabriques.', en: 'Defend origin matrices while Nova separates lived possibilities from manufactured bait.' },
    stakes: { fr: 'Chaque faux passe stabilise donne au Sans-Auteur une identite qu il pourra porter.', en: 'Every stabilized false past gives the Authorless an identity it can wear.' },
    consequence: { fr: 'Marrow detruit son propre double ideal plutot que de laisser la Fonderie choisir a sa place.', en: 'Marrow destroys his own ideal double rather than let the Foundry choose for him.' },
    rewardLore: { fr: 'Eclat d Origine pur: premier materiau d evolution reserve aux agents OC.', en: 'Pure Origin Shard: first evolution material reserved for OC agents.' },
    originLockId: 'scar',
    enemyRoster: ['Double ideal de Marrow', 'Matrice de Substitution', 'Fragment Vagabond'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Le Double ideal poursuit Marrow tandis que la Matrice copie la derniere doctrine de la cellule. Briser la Matrice retire les bonus du Double; frapper le cristal qui remplace sa cicatrice charge l ultime de Marrow.', en: 'The Ideal Double hunts Marrow while the Matrix copies the cell last doctrine. Breaking the Matrix removes the Double bonuses; striking the crystal replacing his scar charges Marrow ultimate.' },
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
    bossName: 'Moteur de Convergence Instable',
    unlockClears: 3,
    image: '/images/campaign-oc/chapter-03-black-ledger-v1.png',
    location: { fr: 'Sous-registre A.R.C.A., niveau interdit', en: 'A.R.C.A. sub-ledger, restricted level' },
    objective: { fr: 'Atteindre le coeur comptable et reconstituer la route sacrifiee lors de la Premiere Breche.', en: 'Reach the accounting core and reconstruct the route sacrificed during the First Breach.' },
    stakes: { fr: 'La verite peut briser la confiance qui maintient la cellule, mais l enterrer nourrit directement le Sans-Auteur.', en: 'The truth may break the trust holding the cell together, but burying it directly feeds the Authorless.' },
    consequence: { fr: 'A.R.C.A. reconnait publiquement sa dette. L Ancre refuse pourtant de dissoudre l organisation.', en: 'A.R.C.A. publicly acknowledges its debt. The Anchor nevertheless refuses to dissolve the organization.' },
    rewardLore: { fr: 'Cle du Registre noir: ouvre les dossiers censures du Codex OC.', en: 'Black Ledger Key: opens censored OC Codex records.' },
    originLockId: 'debt',
    enemyRoster: ['Archiviste Rompu', 'Drone A.R.C.A. Corrompu', 'Noeud de Paradoxe'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Restaurer une ligne ouvre une tombe et augmente l instabilite du moteur. Trois preuves seulement peuvent etre extraites avant l effondrement.', en: 'Restoring a line opens a grave and increases engine instability. Only three pieces of evidence can be extracted before collapse.' },
    storyBeat: {
      role: 'ledger_truth',
      intro: { fr: 'Le registre ne compte pas les morts. Il compte ceux dont la mort, la naissance et jusqu au monde ont ete retires des archives pour alimenter le premier verrou.', en: 'The ledger does not count the dead. It counts those whose death, birth, and even world were removed from archives to power the first lock.' },
      outro: { fr: 'Le Sans-Auteur recoit enfin une origine: il est la pression de tout ce qu A.R.C.A. a supprime sans pouvoir en faire le deuil.', en: 'The Authorless finally receives an origin: it is the pressure of everything A.R.C.A. erased without being able to mourn.' }
    },
    scenes: [
      { speaker: { fr: 'SABLE', en: 'SABLE' }, text: { fr: 'Chaque ligne vide possede un cout energetique. Ce ne sont pas des erreurs de saisie. Ce sont des tombes sans inscription.', en: 'Every blank line carries an energy cost. These are not clerical errors. They are graves without inscriptions.' } },
      { speaker: { fr: 'LOOM', en: 'LOOM' }, text: { fr: 'A.R.C.A. a sauve la Cite en coupant une route. Puis elle a retire le souvenir de la route pour que personne ne tente de la rouvrir.', en: 'A.R.C.A. saved the City by cutting a route. Then it removed the memory of the route so nobody would try to reopen it.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'On ne reparera pas cette faute en en creant une seconde. Nous garderons le Nexus et la preuve de ce qu il a coute.', en: 'We will not repair this fault by creating another. We will keep the Nexus and the proof of what it cost.' } }
    ]
  },
  {
    id: 8805,
    chapterId: 'singularity_wake',
    sequence: 5,
    type: 'siege',
    name: 'Broken Portal Yard',
    displayName: { fr: 'Mission 04 - La Cour des faux passages', en: 'Mission 04 - The Court of False Passages' },
    codename: { fr: 'Exode impossible', en: 'Impossible Exodus' },
    universe: 'Nexus de Convergence',
    mode: 'Tactics',
    difficulty: 'Hard',
    goldPrize: 105,
    shardPrize: 40,
    tokenPrize: 1,
    bossName: 'Cartographe des Portes Mortes',
    unlockClears: 4,
    image: '/images/campaign-oc/chapter-04-broken-portal-yard-v1.png',
    location: { fr: 'Cour des portails brises', en: 'Broken Portal Yard' },
    objective: { fr: 'Evacuer les signatures piegees, identifier le seul portail causal puis condamner les issues parfaites.', en: 'Evacuate trapped signatures, identify the only causal portal, then seal the perfect exits.' },
    stakes: { fr: 'Chaque agent voit une sortie adaptee a son regret le plus profond. Ouvrir la mauvaise porte disperse definitivement la cellule.', en: 'Every agent sees an exit tailored to their deepest regret. Opening the wrong door permanently scatters the cell.' },
    consequence: { fr: 'Bastion abandonne la vision d une Cite qu il aurait pu sauver seul et choisit la cellule reelle.', en: 'Bastion abandons the vision of a City he could have saved alone and chooses the real cell.' },
    rewardLore: { fr: 'Balise de passage causal: annule un verrou de mission une fois par chapitre futur.', en: 'Causal Passage Beacon: cancels one mission lock per future chapter.' },
    originLockId: 'return',
    enemyRoster: ['Pelerin de la Fausse Sortie', 'Echo Sans-Auteur', 'Fragment Vagabond'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Loom revele les details manquants des faux passages. Les Pelerins poussent les allies vers leur regret tandis que le Cartographe deplace le portail causal a chaque verdict.', en: 'Loom reveals missing details in false passages. Pilgrims push allies toward their regret while the Cartographer moves the causal portal after each verdict.' },
    storyBeat: {
      role: 'portal_cleanup',
      intro: { fr: 'Les portails ne montrent plus des mondes etrangers. Ils montrent les vies que les agents auraient menees si la Breche n avait jamais existe.', en: 'The portals no longer show foreign worlds. They show the lives agents would have lived if the Breach had never existed.' },
      outro: { fr: 'La cellule ferme les refuges parfaits. Une seule porte demeure: celle qui conduit au responsable, sans promettre de retour.', en: 'The cell closes the perfect shelters. One door remains: the one leading to the responsible force, with no promise of return.' }
    },
    scenes: [
      { speaker: { fr: 'BASTION', en: 'BASTION' }, text: { fr: 'De l autre cote, l Atrium tient encore. Personne n est tombe sous mon commandement.', en: 'On the other side, the Atrium still stands. Nobody fell under my command.' } },
      { speaker: { fr: 'LOOM', en: 'LOOM' }, text: { fr: 'Regarde mieux. Cette porte connait ta victoire, mais elle ignore le nom des gens que tu aurais sauves.', en: 'Look closer. That door knows your victory, but it does not know the names of the people you would have saved.' } },
      { speaker: { fr: 'BASTION', en: 'BASTION' }, text: { fr: 'Alors ce n est pas ma Cite. Fermez-la.', en: 'Then it is not my City. Close it.' } }
    ]
  },
  {
    id: 8806,
    chapterId: 'omniverse_endgame',
    sequence: 6,
    type: 'finale',
    name: 'Sans-Auteur Threshold',
    displayName: { fr: 'Finale - Le monde sans auteur', en: 'Finale - The World Without an Author' },
    codename: { fr: 'Derniere marge', en: 'Last Margin' },
    universe: 'Nexus de Convergence',
    mode: 'Smash',
    difficulty: 'Hard',
    goldPrize: 125,
    shardPrize: 50,
    tokenPrize: 1,
    bossName: 'Avatar du Sans-Auteur',
    unlockClears: 5,
    image: '/images/campaign-oc/chapter-05-white-threshold-v1.png',
    location: { fr: 'Seuil blanc, hors de la Cite', en: 'White Threshold, beyond the City' },
    objective: { fr: 'Briser les trois propositions du Sans-Auteur, conserver les souvenirs de la cellule et ancrer une fin qui n efface pas les suites possibles.', en: 'Break the Authorless three propositions, preserve the cell memories, and anchor an ending that does not erase possible continuations.' },
    stakes: { fr: 'Une victoire par destruction totale ferait de l Ancre le prochain Sans-Auteur. Il faut vaincre sans supprimer.', en: 'Victory through total destruction would make the Anchor the next Authorless. The enemy must be defeated without deletion.' },
    consequence: { fr: 'Le Sans-Auteur est enferme dans un registre consultable plutot qu efface. Les univers annexes peuvent desormais rejoindre le Nexus sans devenir les fondations de son histoire.', en: 'The Authorless is confined inside a readable record rather than erased. Side universes may now join the Nexus without becoming the foundations of its story.' },
    rewardLore: { fr: 'Skin Ancre du Palimpseste, titre Gardien des Causes et ouverture de l Acte II.', en: 'Palimpsest Anchor skin, Keeper of Causes title, and Act II opening.' },
    originLockId: 'choice',
    enemyRoster: ['Echo Sans-Auteur', 'Noeud de Paradoxe', 'Fragment Vagabond'],
    enemyRosterExclusive: true,
    missionRule: { fr: 'Chaque phase presente une proposition plutot qu une barre de vie finale. Il faut conserver un souvenir, formuler une contradiction puis poser un verrou.', en: 'Each phase presents a proposition instead of a final health bar. Preserve a memory, state a contradiction, then place a lock.' },
    storyBeat: {
      role: 'authorless_threshold',
      intro: { fr: 'Le Seuil blanc offre une paix parfaite: aucun conflit, aucune perte, aucune histoire assez distincte pour provoquer une nouvelle Breche.', en: 'The White Threshold offers perfect peace: no conflict, no loss, no story distinct enough to cause another Breach.' },
      outro: { fr: 'L Ancre inscrit le Sans-Auteur au lieu de le supprimer. La Cite-Mosaique garde ses cicatrices, ses contradictions et son avenir.', en: 'The Anchor records the Authorless instead of deleting it. Mosaic City keeps its scars, contradictions, and future.' }
    },
    scenes: [
      { speaker: { fr: 'SANS-AUTEUR', en: 'AUTHORLESS' }, text: { fr: 'Je peux terminer la douleur. Aucun monde ne sera perdu si aucun monde ne pretend etre unique.', en: 'I can end pain. No world will be lost if no world claims to be unique.' } },
      { speaker: { fr: 'MIRELLE', en: 'MIRELLE' }, text: { fr: 'Une archive sans difference n est pas la paix. C est une salle vide qui se cite elle-meme.', en: 'An archive without difference is not peace. It is an empty room citing itself.' } },
      { speaker: { fr: 'L ANCRE', en: 'THE ANCHOR' }, text: { fr: 'Je ne vais pas t effacer. Je vais te donner une place, une origine et une limite. Tu ne seras plus la marge de toutes nos histoires.', en: 'I will not erase you. I will give you a place, an origin, and a limit. You will no longer be the margin of all our stories.' } }
    ]
  }
];

export const getOcCampaignMission = (stageId) => OC_CAMPAIGN_MISSIONS.find(mission => mission.id === stageId) || null;
