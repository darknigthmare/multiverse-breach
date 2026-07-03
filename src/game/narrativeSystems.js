import { HEROES_DB } from './heroes';

export const ARC_CAMPAIGN_DETAILS = {
  xeno_yautja_war: {
    intro: { fr: 'A.R.C.A. detecte une coordonnee ou la chasse et la reproduction utilisent la meme faille.', en: 'A.R.C.A. detects coordinates where hunting and breeding use the same breach.' },
    missions: [
      { fr: 'Couper les couloirs de ponte dans une colonie fusionnee Alien/Predator.', en: 'Cut egg corridors inside a fused Alien/Predator colony.' },
      { fr: 'Recuperer un Eclat d Origine dans un temple Yautja contamine.', en: 'Recover an Origin Shard inside a contaminated Yautja temple.' },
      { fr: 'Battre le Nid-Trophee avant sa migration vers la Cite-Mosaique.', en: 'Defeat the Trophy-Hive before it migrates to Mosaic City.' }
    ],
    outro: { fr: 'La chasse reste ouverte, mais le Voile n est plus un nid.', en: 'The hunt remains open, but the Veil is no longer a nest.' },
    rewards: [
      { id: 'arc_xeno_skin_acid_armor', type: 'skin', name: { fr: 'Apparence Armure Acide', en: 'Acid Armor Appearance' } },
      { id: 'arc_xeno_item_corroded_plasma', type: 'item', name: { fr: 'Lame Plasma Corrodee', en: 'Corroded Plasma Blade' } }
    ],
    claimReward: { gold: 500, shards: 90, tokens: 4 }
  },
  stage_resonance: {
    intro: { fr: 'La Scene Fantome pulse comme un coeur: les Personas de Resonance maintiennent les souvenirs collectifs en vie.', en: 'The Ghost Stage pulses like a heart: Resonance Personas keep collective memory alive.' },
    missions: [
      { fr: 'Synchroniser trois failles musicales sans casser le tempo ATB.', en: 'Synchronize three music breaches without breaking ATB tempo.' },
      { fr: 'Proteger un concert holographique contre une vague de silence blanc.', en: 'Protect a holographic concert against a wave of white silence.' },
      { fr: 'Transformer le rappel final en balise anti-Sans-Auteur.', en: 'Turn the final encore into an anti-Authorless beacon.' }
    ],
    outro: { fr: 'Le Nexus retrouve une frequence: chaque victoire a maintenant un battement.', en: 'The Nexus finds a frequency again: every victory now has a beat.' },
    rewards: [
      { id: 'arc_stage_skin_neon_persona', type: 'skin', name: { fr: 'Apparence Neon Persona', en: 'Neon Persona Appearance' } },
      { id: 'arc_stage_item_anchor_microphone', type: 'item', name: { fr: 'Micro d Ancrage', en: 'Anchor Microphone' } }
    ],
    claimReward: { gold: 420, shards: 80, tokens: 5 }
  },
  frontline_sci_fi: {
    intro: { fr: 'L Alliance du Nexus forme le Rempart Atrium avec les soldats, explorateurs et commandants des Trames sci-fi.', en: 'The Nexus Alliance forms the Atrium Bulwark with soldiers, explorers, and commanders from sci-fi Threads.' },
    missions: [
      { fr: 'Construire une ligne de tir entre Halo, Stargate et Mass Effect.', en: 'Build a firing line between Halo, Stargate, and Mass Effect.' },
      { fr: 'Evacuer des civils de la Cite-Mosaique sous bombardement de faille.', en: 'Evacuate Mosaic City civilians under breach bombardment.' },
      { fr: 'Activer le Rempart Atrium contre le Noyau final.', en: 'Activate the Atrium Bulwark against the final Core.' }
    ],
    outro: { fr: 'Le Nexus possede enfin une armee, mais pas encore une paix.', en: 'The Nexus finally has an army, but not yet peace.' },
    rewards: [
      { id: 'arc_scifi_skin_atrium_bulwark', type: 'skin', name: { fr: 'Apparence Rempart Atrium', en: 'Atrium Bulwark Appearance' } },
      { id: 'arc_scifi_item_sgc_n7_plate', type: 'item', name: { fr: 'Plaque de Commandement SGC/N7', en: 'SGC/N7 Command Plate' } }
    ],
    claimReward: { gold: 460, shards: 85, tokens: 4 }
  },
  cyber_reality: {
    intro: { fr: 'La Zone 404 prouve que certaines breches sont des permissions volees, pas des lieux.', en: 'Zone 404 proves some breaches are stolen permissions, not places.' },
    missions: [
      { fr: 'Nettoyer une trace memoire corrompue par un virus de Trame.', en: 'Clean a memory trace corrupted by a Thread virus.' },
      { fr: 'Defendre A.R.C.A. pendant une attaque de droits administrateur.', en: 'Defend A.R.C.A. during an administrator-rights attack.' },
      { fr: 'Installer un pare-feu narratif dans le coeur du hub.', en: 'Install a narrative firewall in the hub core.' }
    ],
    outro: { fr: 'Les traces memoire possedent maintenant une chambre de secours.', en: 'Memory traces now have a backup chamber.' },
    rewards: [
      { id: 'arc_cyber_skin_zone_404', type: 'skin', name: { fr: 'Apparence Zone 404', en: 'Zone 404 Appearance' } },
      { id: 'arc_cyber_item_firewall_fragment', type: 'item', name: { fr: 'Fragment de Pare-feu Narratif', en: 'Narrative Firewall Fragment' } }
    ],
    claimReward: { gold: 440, shards: 85, tokens: 4 }
  },
  urban_legends: {
    intro: { fr: 'Les Effaces utilisent la peur pour retirer les noms, puis les visages, puis les mondes.', en: 'The Erased use fear to remove names, then faces, then worlds.' },
    missions: [
      { fr: 'Identifier les entites avant que leurs fiches codex deviennent blanches.', en: 'Identify entities before their codex files turn white.' },
      { fr: 'Resister a une mission sans carte, sans nom de boss et sans musique.', en: 'Survive a mission without map, boss name, or music.' },
      { fr: 'Nommer le cauchemar central dans les Archives Impossibles.', en: 'Name the central nightmare inside the Impossible Archives.' }
    ],
    outro: { fr: 'Une peur nommee reste dangereuse, mais elle cesse d etre infinie.', en: 'A named fear remains dangerous, but stops being infinite.' },
    rewards: [
      { id: 'arc_fear_skin_black_archive', type: 'skin', name: { fr: 'Apparence Archive Noire', en: 'Black Archive Appearance' } },
      { id: 'arc_fear_item_origin_lamp', type: 'item', name: { fr: 'Lampe d Origine', en: 'Origin Lamp' } }
    ],
    claimReward: { gold: 430, shards: 80, tokens: 4 }
  }
};

export const UNIVERSE_NARRATIVE_ARCS = [
  {
    id: 'stargate_chain',
    title: { fr: 'Arc Univers - Reseau des Portes', en: 'Universe Arc - Gate Network' },
    universes: ['Stargate', 'Stargate Atlantis', 'Stargate Universe', 'Stargate Infinity'],
    intro: { fr: 'Les Portes ne relient plus seulement des planetes: elles accrochent des Trames entieres au Nexus.', en: 'The Gates no longer connect only planets: they hook entire Threads to the Nexus.' },
    missions: [
      { fr: 'Stabiliser Abydos et isoler le signal Goa uld.', en: 'Stabilize Abydos and isolate the Goa uld signal.' },
      { fr: 'Recuperer une carte ancienne dans Atlantis avant la derive.', en: 'Recover an Ancient map in Atlantis before drift.' },
      { fr: 'Forcer le Destiny a transmettre un Eclat d Origine.', en: 'Force Destiny to transmit an Origin Shard.' }
    ],
    outro: { fr: 'Le reseau devient une colonne vertebrale de voyage pour les futures cellules partagees.', en: 'The network becomes a travel backbone for future shared cells.' },
    reward: { fr: 'Apparence Iris Nexus + Relique Chevron Huit', en: 'Nexus Iris Appearance + Eighth Chevron Relic' }
  },
  {
    id: 'lab_disasters',
    title: { fr: 'Arc Univers - Laboratoires de rupture', en: 'Universe Arc - Rupture Labs' },
    universes: ['Half-Life', 'Portal', 'Resident Evil', 'Dino Crisis', 'Dead Space'],
    intro: { fr: 'Chaque laboratoire pretendait controler son anomalie. Le Nexus archive le mensonge.', en: 'Every lab claimed it controlled its anomaly. The Nexus archives the lie.' },
    missions: [
      { fr: 'Comparer Cascade de Resonance, portail Aperture et infection Umbrella.', en: 'Compare Resonance Cascade, Aperture portal, and Umbrella infection.' },
      { fr: 'Purifier une station ou Xen et Necromorphs partagent la meme frequence.', en: 'Purify a station where Xen and Necromorphs share one frequency.' },
      { fr: 'Fermer le Laboratoire Zero.', en: 'Close Laboratory Zero.' }
    ],
    outro: { fr: 'A.R.C.A. cree les Protocoles de confinement permanents.', en: 'A.R.C.A. creates permanent containment protocols.' },
    reward: { fr: 'Trace Chambre Blanche + Apparence Combinaison Nexus', en: 'White Chamber Trace + Nexus Suit Appearance' }
  },
  {
    id: 'watcher_hellmouth',
    title: { fr: 'Arc Univers - Ligne de la Bouche d Enfer', en: 'Universe Arc - Hellmouth Line' },
    universes: ['Buffy the Vampire Slayer', 'Charmed', 'Hellraiser', 'Hazbin Hotel'],
    intro: { fr: 'Magie, demons et prophecies entrent dans le Nexus par les memes fissures rituelles.', en: 'Magic, demons, and prophecies enter the Nexus through the same ritual cracks.' },
    missions: [
      { fr: 'Proteger une archive d Observateur pendant une attaque de demons croises.', en: 'Protect a Watcher archive during a cross-demon attack.' },
      { fr: 'Recomposer un cercle Halliwell sans donner de nom au Sans-Auteur.', en: 'Rebuild a Halliwell circle without giving the Authorless a name.' },
      { fr: 'Sceller une boite infernale avant qu elle ne devienne portail permanent.', en: 'Seal an infernal box before it becomes a permanent portal.' }
    ],
    outro: { fr: 'La magie devient une discipline de stabilisation, pas seulement une exception.', en: 'Magic becomes a stabilization discipline, not only an exception.' },
    reward: { fr: 'Relique Pieu d Origine + Apparence Cercle Nexus', en: 'Origin Stake Relic + Nexus Circle Appearance' }
  },
  {
    id: 'anime_judgment_cell',
    title: { fr: 'Arc Univers - Corps, carnets et titans', en: 'Universe Arc - Cells, Notes, and Titans' },
    universes: ['Attack on Titan', 'Death Note', 'Cells at Work', 'Inuyashiki'],
    intro: { fr: 'Ces Trames posent la meme question au Nexus: qui decide qu une vie vaut moins qu une histoire?', en: 'These Threads ask the Nexus one question: who decides a life is worth less than a story?' },
    missions: [
      { fr: 'Evacuer une ville miniature attaquee par des geants et des cellules infectees.', en: 'Evacuate a miniature city attacked by giants and infected cells.' },
      { fr: 'Bruler une page de jugement avant qu elle ne classe les heros comme variables.', en: 'Burn a judgment page before it classifies heroes as variables.' },
      { fr: 'Forcer un corps cybernetique a choisir le sauvetage plutot que l effacement.', en: 'Force a cybernetic body to choose rescue over erasure.' }
    ],
    outro: { fr: 'Le Nexus inscrit une regle: aucune optimisation ne remplace le choix de proteger.', en: 'The Nexus writes one rule: no optimization replaces the choice to protect.' },
    reward: { fr: 'Serum de Trame + Apparence Cellule Blindee', en: 'Thread Serum + Armored Cell Appearance' }
  }
];

const CURATED_CHARACTER_NARRATIVE_ARCS = [
  {
    id: 'player_anchor',
    stageId: 9201,
    heroId: 'player_anchor',
    title: { fr: 'Arc Personnage - L Ancre', en: 'Character Arc - The Anchor' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Ombre du Sans-Auteur',
    unlock: { type: 'clears', value: 1 },
    intro: { fr: 'Le joueur n est pas recrute: il est le point fixe autour duquel les autres signatures tiennent.', en: 'The player is not recruited: they are the fixed point holding other signatures together.' },
    missions: [
      { fr: 'Choisir son nom et stabiliser la premiere escouade.', en: 'Choose a name and stabilize the first squad.' },
      { fr: 'Porter une relique de Trame sans perdre son identite.', en: 'Carry a Thread relic without losing identity.' },
      { fr: 'Resister a une tentative de suppression du Sans-Auteur.', en: 'Resist an Authorless deletion attempt.' }
    ],
    outro: { fr: 'L Ancre devient commandant, archive vivante et cle des futures cellules partagees.', en: 'The Anchor becomes commander, living archive, and key to future shared cells.' },
    reward: { fr: 'Titre Profil: Ancre Prime', en: 'Profile Title: Prime Anchor' },
    rewardItemId: 'char_player_anchor_prime'
  },
  {
    id: 'freeman_silent_key',
    stageId: 9202,
    heroId: 'freeman',
    title: { fr: 'Arc Personnage - La cle silencieuse', en: 'Character Arc - The Silent Key' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Strider de Resonance',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Gordon Freeman attire les ruptures parce qu il a deja survecu a une cascade de resonance.', en: 'Gordon Freeman attracts ruptures because he already survived a resonance cascade.' },
    missions: [
      { fr: 'Analyser la compatibilite HEV avec les Eclats d Origine.', en: 'Analyze HEV compatibility with Origin Shards.' },
      { fr: 'Transformer un outil scientifique en arme anti-breche.', en: 'Turn a scientific tool into an anti-breach weapon.' },
      { fr: 'Faire taire un Strider avant qu il ne marque le Nexus.', en: 'Silence a Strider before it marks the Nexus.' }
    ],
    outro: { fr: 'Le silence de Freeman devient un langage que le Nexus comprend.', en: 'Freeman silence becomes a language the Nexus understands.' },
    reward: { fr: 'Apparence HEV Nexus + Module Long Jump instable', en: 'Nexus HEV Appearance + Unstable Long Jump Module' },
    rewardItemId: 'char_freeman_hev_nexus'
  },
  {
    id: 'chief_living_ring',
    stageId: 9203,
    heroId: 'masterchief',
    title: { fr: 'Arc Personnage - Sierra 117: anneau vivant', en: 'Character Arc - Sierra 117: Living Ring' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Scarab Covenant recode',
    unlock: { type: 'level', value: 3 },
    intro: {
      fr: 'La Breche a ouvert une cicatrice dans une section de l Installation 04. Des signatures Covenant, des Sentinelles Forerunner et un echo du Parasite se melangent autour d un fragment Cortana. Pour John-117, l objectif reste simple: securiser l anneau, empecher la contamination de sortir et ramener l escouade vivante.',
      en: 'The Breach has opened a scar through a section of Installation 04. Covenant signatures, Forerunner Sentinels, and a Flood echo mix around a Cortana fragment. For John-117, the objective remains simple: secure the ring, prevent the contamination from escaping, and bring the squad back alive.'
    },
    missions: [
      {
        fr: 'Mission 1 - Zone d atterrissage Alpha: recuperer une balise Warthog M12, repousser Grunts et Jackals, puis installer une bulle de bouclier UNSC pour stabiliser le premier couloir de l anneau.',
        en: 'Mission 1 - Landing Zone Alpha: recover an M12 Warthog beacon, push back Grunts and Jackals, then deploy a UNSC bubble shield to stabilize the ring first corridor.'
      },
      {
        fr: 'Mission 2 - Cartographe silencieux: escorter l eclat de matrice Cortana vers une console Forerunner pendant que des Elites Minor et des Sentinelles recodees tentent d isoler le Chief.',
        en: 'Mission 2 - Silent Cartographer: escort the Cortana matrix shard to a Forerunner console while Elite Minors and recoded Sentinels try to isolate the Chief.'
      },
      {
        fr: 'Mission 3 - Couloir du Parasite: purger les spores de Trame avant qu elles ne copient la logique du Flood; utiliser grenade plasma et chargeur M6D pour couper les formes infectees de leur noyau.',
        en: 'Mission 3 - Flood Corridor: purge Thread spores before they copy Flood logic; use plasma grenades and the M6D magazine to sever infected forms from their core.'
      }
    ],
    outro: {
      fr: 'Le Scarab recode tombe avant de graver le Sans-Auteur sur l anneau. Cortana conserve une coordonnee propre, A.R.C.A. classe John-117 comme protocole de rempart Halo, et la Trame Halo reste lisible: UNSC, Covenant, Forerunner, Parasite, sans dilution multivers gratuite.',
      en: 'The recoded Scarab falls before branding the Authorless onto the ring. Cortana keeps a clean coordinate, A.R.C.A. classifies John-117 as a Halo bulwark protocol, and the Halo Thread remains readable: UNSC, Covenant, Forerunner, Flood, without random multiverse dilution.'
    },
    reward: { fr: 'Apparence MJOLNIR Installation 04 + Balise Echo 419', en: 'Installation 04 MJOLNIR Skin + Echo 419 Beacon' },
    rewardItemId: 'char_masterchief_atrium'
  },
  {
    id: 'ripley_no_hive',
    stageId: 9204,
    heroId: 'ripley',
    title: { fr: 'Arc Personnage - Refus de la ruche', en: 'Character Arc - Refusal of the Hive' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Reine-Memoire Weyland',
    unlock: { type: 'clears', value: 4 },
    intro: { fr: 'Ripley reconnait les cycles qui recommencent: compagnie, specimen, sacrifice. Dans le Nexus, elle peut enfin casser la boucle.', en: 'Ripley recognizes the loops restarting: company, specimen, sacrifice. In the Nexus, she can finally break them.' },
    missions: [
      { fr: 'Sauver une capsule de survivants avant que la breche ne les transforme en appats.', en: 'Save a survivor pod before the breach turns them into bait.' },
      { fr: 'Purger un manifeste Weyland-Yutani contamine par des oeufs de Trame.', en: 'Purge a Weyland-Yutani manifest contaminated by Thread eggs.' },
      { fr: 'Affronter une reine qui pond des souvenirs au lieu de xenomorphes.', en: 'Face a queen laying memories instead of xenomorphs.' }
    ],
    outro: { fr: 'La ruche perd son droit de recommencer l histoire de Ripley.', en: 'The hive loses its right to restart Ripley story.' },
    reward: { fr: 'Apparence Loader Nexus + cle de sas colonial', en: 'Nexus Loader Appearance + Colonial Airlock Key' },
    rewardItemId: 'char_ripley_loader_nexus'
  },
  {
    id: 'predator_honor_breach',
    stageId: 9205,
    heroId: 'predator',
    title: { fr: 'Arc Personnage - Code du trophee', en: 'Character Arc - Trophy Code' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Trophee Sans-Visage',
    unlock: { type: 'level', value: 4 },
    intro: { fr: 'Le Yautja comprend que le Sans-Auteur ne chasse pas: il efface. Son honneur exige une reponse plus ancienne que le Nexus.', en: 'The Yautja understands the Authorless does not hunt: it erases. Honor demands an answer older than the Nexus.' },
    missions: [
      { fr: 'Marquer une cible qui change de monde a chaque blessure.', en: 'Mark a target that changes worlds with every wound.' },
      { fr: 'Refuser un trophee corrompu par une victoire trop facile.', en: 'Reject a trophy corrupted by an easy victory.' },
      { fr: 'Vaincre le Sans-Visage dans une arene sans public ni memoire.', en: 'Defeat the Faceless in an arena without audience or memory.' }
    ],
    outro: { fr: 'La chasse reste brutale, mais elle redevient lisible: proie, chasseur, regle.', en: 'The hunt remains brutal, but becomes readable again: prey, hunter, rule.' },
    reward: { fr: 'Apparence Traqueur de Faille + masque rituel', en: 'Rift Stalker Appearance + Ritual Mask' },
    rewardItemId: 'char_predator_rift_stalker'
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    id: 'oneill_eighth_chevron',
    stageId: 9208,
    heroId: 'oneill',
    title: { fr: 'Arc Personnage - Huitieme chevron', en: 'Character Arc - Eighth Chevron' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Primate Goa uld Miroir',
    unlock: { type: 'clears', value: 6 },
    intro: { fr: 'O Neill traite le multivers comme une mission SG: humour sec, plan fragile, et personne laisse derriere.', en: 'O Neill treats the multiverse like an SG mission: dry humor, fragile plan, and nobody left behind.' },
    missions: [
      { fr: 'Composer une adresse qui traverse deux Trames sans perdre l iris.', en: 'Dial an address crossing two Threads without losing the iris.' },
      { fr: 'Convaincre A.R.C.A. qu un plan simple peut rester vivant.', en: 'Convince A.R.C.A. that a simple plan can stay alive.' },
      { fr: 'Fermer une Porte miroir avant qu un faux SGC envahisse le hub.', en: 'Close a mirror Gate before a false SGC invades the hub.' }
    ],
    outro: { fr: 'Le huitieme chevron devient une route tactique vers les arcs Stargate.', en: 'The eighth chevron becomes a tactical road into Stargate arcs.' },
    reward: { fr: 'Apparence SGC Nexus + patch Chevron Huit', en: 'Nexus SGC Appearance + Eighth Chevron Patch' },
    rewardItemId: 'char_oneill_sgc_nexus'
  },
  {
    id: 'chell_white_room',
    stageId: 9209,
    heroId: 'chell',
    title: { fr: 'Arc Personnage - Chambre blanche', en: 'Character Arc - White Room' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Noyau de Test Infini',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Chell ne parle pas au Nexus. Elle lui montre seulement ou poser le second portail.', en: 'Chell does not speak to the Nexus. She only shows it where to place the second portal.' },
    missions: [
      { fr: 'Resoudre une salle ou la gravite appartient a deux univers.', en: 'Solve a room where gravity belongs to two universes.' },
      { fr: 'Retourner une tourelle contre son propre script de test.', en: 'Turn a turret against its own test script.' },
      { fr: 'Sortir d une boucle Aperture qui promet une recompense impossible.', en: 'Escape an Aperture loop promising an impossible reward.' }
    ],
    outro: { fr: 'Le Nexus apprend que survivre peut etre une forme de reponse.', en: 'The Nexus learns survival can be a form of answer.' },
    reward: { fr: 'Apparence Chambre Blanche + botte Long Fall instable', en: 'White Room Appearance + Unstable Long Fall Boot' },
    rewardItemId: 'char_chell_white_room'
  },
  {
    id: 'buffy_hellmouth_nexus',
    stageId: 9210,
    heroId: 'buffy_summers',
    title: { fr: 'Arc Personnage - Tueuse du Nexus', en: 'Character Arc - Nexus Slayer' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Bouche d Enfer Sans-Auteur',
    unlock: { type: 'clears', value: 7 },
    intro: { fr: 'Buffy reconnait le piege: une adolescente choisie, puis une guerre qui pretend etre son destin. Le Nexus lui donne une autre option.', en: 'Buffy recognizes the trap: a chosen girl, then a war pretending to be destiny. The Nexus gives her another option.' },
    missions: [
      { fr: 'Proteger une patrouille de lycee projetee dans la Cite-Mosaique.', en: 'Protect a school patrol thrown into Mosaic City.' },
      { fr: 'Briser un rituel qui transforme les noms de heros en prophecies.', en: 'Break a ritual turning hero names into prophecies.' },
      { fr: 'Sceller une Bouche d Enfer qui veut avaler les traces memoire.', en: 'Seal a Hellmouth trying to swallow memory traces.' }
    ],
    outro: { fr: 'La Tueuse ne porte plus seule la fin du monde: l escouade porte la ligne avec elle.', en: 'The Slayer no longer carries the end of the world alone: the squad holds the line with her.' },
    reward: { fr: 'Apparence Tueuse Nexus + pieu d Origine', en: 'Nexus Slayer Appearance + Origin Stake' },
    rewardItemId: 'char_buffy_nexus_slayer'
  },
  {
    id: 'walter_blue_thread',
    stageId: 9211,
    heroId: 'walter_white',
    title: { fr: 'Arc Personnage - Formule bleue', en: 'Character Arc - Blue Formula' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Empire Heisenberg Miroir',
    unlock: { type: 'level', value: 4 },
    intro: { fr: 'Walter White comprend le Nexus comme une reaction chimique: dosage, pression, contamination. Le probleme, c est qu il veut controler le resultat.', en: 'Walter White reads the Nexus as a chemical reaction: dosage, pressure, contamination. The problem is he wants to control the result.' },
    missions: [
      { fr: 'Isoler un catalyseur bleu sans rendre l escouade dependante de son pouvoir.', en: 'Isolate a blue catalyst without making the squad dependent on its power.' },
      { fr: 'Saboter un laboratoire de Trame avant que la formule devienne une faction.', en: 'Sabotage a Thread lab before the formula becomes a faction.' },
      { fr: 'Affronter un empire miroir construit a partir de ses pires choix.', en: 'Face a mirror empire built from his worst choices.' }
    ],
    outro: { fr: 'A.R.C.A. classe Walter comme ressource puissante et risque permanent.', en: 'A.R.C.A. classifies Walter as both powerful resource and permanent risk.' },
    reward: { fr: 'Apparence Combinaison Bleue + catalyseur de Trame', en: 'Blue Suit Appearance + Thread Catalyst' },
    rewardItemId: 'char_walter_blue_formula'
  },
  {
    id: 'drebin_wrong_case',
    stageId: 9212,
    heroId: 'frank_drebin',
    title: { fr: 'Arc Personnage - Mauvais dossier', en: 'Character Arc - Wrong Case' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Commissaire de Continuite',
    unlock: { type: 'clears', value: 3 },
    intro: { fr: 'Frank Drebin arrive toujours dans la mauvaise scene, ce qui rend le Sans-Auteur furieux: impossible d effacer une logique qui ne sait pas ou elle va.', en: 'Frank Drebin always enters the wrong scene, which infuriates the Authorless: it is impossible to erase logic that does not know where it is going.' },
    missions: [
      { fr: 'Interroger trois temoins qui appartiennent a trois univers differents.', en: 'Question three witnesses from three different universes.' },
      { fr: 'Transformer une erreur de procedure en raccourci tactique.', en: 'Turn a procedural mistake into a tactical shortcut.' },
      { fr: 'Arreter le Commissaire de Continuite sans comprendre l accusation.', en: 'Arrest the Continuity Commissioner without understanding the accusation.' }
    ],
    outro: { fr: 'Le Nexus archive Frank comme anomalie comique utile: une faille qui referme les autres par accident.', en: 'The Nexus archives Frank as a useful comic anomaly: a breach that closes others by accident.' },
    reward: { fr: 'Apparence Brigade Nexus + plaque mal classee', en: 'Nexus Squad Appearance + Misfiled Badge' },
    rewardItemId: 'char_drebin_wrong_case'
  }
];

const CATEGORY_ARC_PROFILE = {
  marine: {
    mode: 'Tactics',
    boss: { fr: 'Champion de Frontiere', en: 'Frontier Champion' },
    reward: { fr: 'Armure Nexus', en: 'Nexus Armor' },
    color: '#63d7ff',
    role: {
      fr: 'tenir la ligne, encaisser la premiere vague et transformer une guerre locale en victoire d escouade',
      en: 'hold the line, absorb the first wave, and turn a local war into a squad victory'
    }
  },
  tactical: {
    mode: 'Tactics',
    boss: { fr: 'Strategie Miroir', en: 'Mirror Strategy' },
    reward: { fr: 'Dossier Tactique Nexus', en: 'Nexus Tactical File' },
    color: '#f6f1d1',
    role: {
      fr: 'lire le terrain, choisir la bonne cible et faire tenir ensemble des allies impossibles',
      en: 'read the field, choose the right target, and make impossible allies hold together'
    }
  },
  hacker: {
    mode: 'RPG',
    boss: { fr: 'Noyau de Code Fantome', en: 'Ghost Code Core' },
    reward: { fr: 'Interface Nexus', en: 'Nexus Interface' },
    color: '#41ffac',
    role: {
      fr: 'comprendre les regles cachees de la Trame et retourner une anomalie contre elle-meme',
      en: 'understand hidden Thread rules and turn an anomaly against itself'
    }
  },
  slayer: {
    mode: 'Smash',
    boss: { fr: 'Duelliste Sans-Auteur', en: 'Authorless Duelist' },
    reward: { fr: 'Marque de Chasseur Nexus', en: 'Nexus Hunter Mark' },
    color: '#e74c3c',
    role: {
      fr: 'rompre la ligne ennemie, provoquer le champion local et finir la scene avant qu elle ne se referme',
      en: 'break the enemy line, provoke the local champion, and finish the scene before it closes'
    }
  },
  horror: {
    mode: 'RPG',
    boss: { fr: 'Peur d Origine', en: 'Origin Fear' },
    reward: { fr: 'Talisman de Survie Nexus', en: 'Nexus Survival Talisman' },
    color: '#cbd8c8',
    role: {
      fr: 'survivre au script de peur, proteger les derniers temoins et donner un nom au cauchemar',
      en: 'survive the fear script, protect the last witnesses, and give the nightmare a name'
    }
  }
};

const slugifyArcId = (value) => String(value)
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '_')
  .replace(/^_+|_+$/g, '');

const getCharacterArcProfile = (hero) => CATEGORY_ARC_PROFILE[hero.category] || CATEGORY_ARC_PROFILE.tactical;

const CURATED_CHARACTER_HERO_IDS = new Set(CURATED_CHARACTER_NARRATIVE_ARCS.map(arc => arc.heroId));

const GENERATED_CHARACTER_NARRATIVE_ARCS = HEROES_DB
  .filter(hero => !CURATED_CHARACTER_HERO_IDS.has(hero.id))
  .map((hero, index) => {
    const profile = getCharacterArcProfile(hero);
    const slug = slugifyArcId(hero.id);
    const specialName = hero.special?.name || hero.secondary?.name || hero.simple?.name || hero.weaponType || hero.category;
    const levelUnlock = index % 2 === 0;
    return {
      id: `${slug}_personal_thread`,
      stageId: 9300 + index,
      heroId: hero.id,
      title: { fr: `Arc Personnage - ${hero.name}`, en: `Character Arc - ${hero.name}` },
      mode: profile.mode,
      difficulty: 'Personal',
      bossName: `${profile.boss.fr} - ${hero.universe}`,
      unlock: levelUnlock
        ? { type: 'level', value: 2 + (index % 4) }
        : { type: 'clears', value: 2 + (index % 10) },
      intro: {
        fr: `${hero.name} arrive depuis ${hero.universe} avec une signature que le Nexus ne peut pas copier sans la comprendre. Son arc personnel sert a ${profile.role.fr}.`,
        en: `${hero.name} arrives from ${hero.universe} with a signature the Nexus can only stabilize by respecting its Thread laws. This personal arc is about how they ${profile.role.en}.`
      },
      missions: [
        {
          fr: `Stabiliser la signature ${hero.universe} de ${hero.name} avant qu elle ne devienne une simple donnee d archive.`,
          en: `Stabilize ${hero.name}'s ${hero.universe} signature before it becomes a simple archive record.`
        },
        {
          fr: `Transformer "${specialName}" en protocole anti-breche compatible avec une escouade multivers.`,
          en: `Turn "${specialName}" into an anti-breach protocol compatible with a multiverse squad.`
        },
        {
          fr: `Vaincre ${profile.boss.fr} pour prouver que ${hero.name} reste fidele a son lore meme dans la Compression de Resonance.`,
          en: `Defeat the ${profile.boss.en} to prove ${hero.name} stays true to their lore even inside Resonance Compression.`
        }
      ],
      outro: {
        fr: `${hero.name} garde sa memoire de ${hero.universe}, mais gagne une fonction claire dans Breach Multiverse.`,
        en: `${hero.name} keeps their ${hero.universe} memory, but gains a clear function inside Breach Multiverse.`
      },
      reward: {
        fr: `Apparence ${hero.name} Nexus + ${profile.reward.fr}`,
        en: `${hero.name} Nexus Appearance + ${profile.reward.en}`
      },
      rewardItemId: `char_auto_${slug}_nexus`
    };
  });

export const CHARACTER_NARRATIVE_ARCS = [
  ...CURATED_CHARACTER_NARRATIVE_ARCS,
  ...GENERATED_CHARACTER_NARRATIVE_ARCS
];

const GENERATED_CHARACTER_SKINS = Object.fromEntries(
  GENERATED_CHARACTER_NARRATIVE_ARCS.map(arc => {
    const hero = HEROES_DB.find(item => item.id === arc.heroId);
    const profile = getCharacterArcProfile(hero || {});
    return [
      arc.rewardItemId,
      {
        id: arc.rewardItemId,
        heroId: arc.heroId,
        name: {
          fr: `${hero?.name || arc.heroId} Nexus`,
          en: `${hero?.name || arc.heroId} Nexus`
        },
        colors: {
          primaryColor: hero?.primaryColor || profile.color,
          secondaryColor: hero?.secondaryColor || profile.color
        }
      }
    ];
  })
);

export const SKIN_CATALOG = {
  default: {
    id: 'default',
    name: { fr: 'Apparence origine', en: 'Origin look' },
    colors: {}
  },
  char_player_anchor_prime: {
    id: 'char_player_anchor_prime',
    heroId: 'player_anchor',
    name: { fr: 'Ancre Prime', en: 'Prime Anchor' },
    colors: { primaryColor: '#ffffff', secondaryColor: '#39c5bb' }
  },
  char_freeman_hev_nexus: {
    id: 'char_freeman_hev_nexus',
    heroId: 'freeman',
    name: { fr: 'HEV Nexus', en: 'Nexus HEV' },
    colors: { primaryColor: '#ff8c00', secondaryColor: '#39c5bb' }
  },
  char_masterchief_atrium: {
    id: 'char_masterchief_atrium',
    heroId: 'masterchief',
    name: { fr: 'MJOLNIR Installation 04', en: 'Installation 04 MJOLNIR' },
    colors: { primaryColor: '#6aa84f', secondaryColor: '#63d7ff' }
  },
  char_ripley_loader_nexus: {
    id: 'char_ripley_loader_nexus',
    heroId: 'ripley',
    name: { fr: 'Loader Nexus', en: 'Nexus Loader' },
    colors: { primaryColor: '#f2b705', secondaryColor: '#4682b4' }
  },
  char_predator_rift_stalker: {
    id: 'char_predator_rift_stalker',
    heroId: 'predator',
    name: { fr: 'Traqueur de Faille', en: 'Rift Stalker' },
    colors: { primaryColor: '#6f8f72', secondaryColor: '#00ff9d' }
  },
  char_leon_rpd_nexus: {
    id: 'char_leon_rpd_nexus',
    heroId: 'leon',
    name: { fr: 'R.P.D. Raccoon City', en: 'Raccoon City R.P.D.' },
    colors: { primaryColor: '#1d4e89', secondaryColor: '#f5d76e' }
  },
  char_jill_last_escape: {
    id: 'char_jill_last_escape',
    heroId: 'jill',
    name: { fr: 'S.T.A.R.S. Last Escape', en: 'Last Escape S.T.A.R.S.' },
    colors: { primaryColor: '#214b8f', secondaryColor: '#79d0ff' }
  },
  char_wesker_uroboros_sealed: {
    id: 'char_wesker_uroboros_sealed',
    heroId: 'wesker',
    name: { fr: 'Uroboros scelle', en: 'Sealed Uroboros' },
    colors: { primaryColor: '#101820', secondaryColor: '#d7f26b' }
  },
  char_neo_free_code: {
    id: 'char_neo_free_code',
    heroId: 'neo',
    name: { fr: 'Code Libre', en: 'Free Code' },
    colors: { primaryColor: '#050505', secondaryColor: '#41ff7a' }
  },
  char_oneill_sgc_nexus: {
    id: 'char_oneill_sgc_nexus',
    heroId: 'oneill',
    name: { fr: 'SGC Nexus', en: 'Nexus SGC' },
    colors: { primaryColor: '#1f382b', secondaryColor: '#cfd6dd' }
  },
  char_chell_white_room: {
    id: 'char_chell_white_room',
    heroId: 'chell',
    name: { fr: 'Chambre Blanche', en: 'White Room' },
    colors: { primaryColor: '#f7f7f2', secondaryColor: '#ff7a1a' }
  },
  char_buffy_nexus_slayer: {
    id: 'char_buffy_nexus_slayer',
    heroId: 'buffy_summers',
    name: { fr: 'Tueuse Nexus', en: 'Nexus Slayer' },
    colors: { primaryColor: '#f6c15b', secondaryColor: '#7d3c98' }
  },
  char_walter_blue_formula: {
    id: 'char_walter_blue_formula',
    heroId: 'walter_white',
    name: { fr: 'Formule Bleue', en: 'Blue Formula' },
    colors: { primaryColor: '#5c8a43', secondaryColor: '#3dc7ff' }
  },
  char_drebin_wrong_case: {
    id: 'char_drebin_wrong_case',
    heroId: 'frank_drebin',
    name: { fr: 'Brigade Nexus', en: 'Nexus Squad' },
    colors: { primaryColor: '#2f75b5', secondaryColor: '#f6f1d1' }
  },
  ...GENERATED_CHARACTER_SKINS,
  arc_scifi_skin_atrium_bulwark: {
    id: 'arc_scifi_skin_atrium_bulwark',
    name: { fr: 'Rempart Atrium', en: 'Atrium Bulwark' },
    colors: { primaryColor: '#63d7ff', secondaryColor: '#ffeb3b' }
  },
  arc_cyber_skin_zone_404: {
    id: 'arc_cyber_skin_zone_404',
    name: { fr: 'Zone 404', en: 'Zone 404' },
    colors: { primaryColor: '#41ffac', secondaryColor: '#9b59b6' }
  },
  arc_fear_skin_black_archive: {
    id: 'arc_fear_skin_black_archive',
    name: { fr: 'Archive Noire', en: 'Black Archive' },
    colors: { primaryColor: '#cbd8c8', secondaryColor: '#e74c3c' }
  },
  arc_stage_skin_neon_persona: {
    id: 'arc_stage_skin_neon_persona',
    name: { fr: 'Neon Persona', en: 'Neon Persona' },
    colors: { primaryColor: '#f1c40f', secondaryColor: '#39c5bb' }
  },
  arc_xeno_skin_acid_armor: {
    id: 'arc_xeno_skin_acid_armor',
    name: { fr: 'Armure Acide', en: 'Acid Armor' },
    colors: { primaryColor: '#7ee8dc', secondaryColor: '#8cff5a' }
  }
};

export const FUSION_MISSIONS = [
  {
    id: 'stargate_x_halo',
    stageId: 9001,
    title: { fr: 'Fusion - Anneau et Porte', en: 'Fusion - Ring and Gate' },
    universes: ['Halo', 'Stargate'],
    primaryUniverse: 'Halo',
    mode: 'Tactics',
    difficulty: 'Fusion',
    bossName: 'Scarab a Chevrons',
    goldPrize: 180,
    shardPrize: 70,
    tokenPrize: 3,
    unlockClears: 6,
    decor: { fr: 'Une installation Halo percee par une Porte des Etoiles active.', en: 'A Halo installation pierced by an active Stargate.' },
    enemies: { fr: 'Elites contamines par symbiotes, drones Anciens, sentinelles Forerunner.', en: 'Symbiote-corrupted Elites, Ancient drones, Forerunner sentinels.' },
    item: { fr: 'Chevron Forerunner', en: 'Forerunner Chevron' },
    itemId: 'fusion_chevron_forerunner'
  },
  {
    id: 'matrix_portal_ghost',
    stageId: 9002,
    title: { fr: 'Fusion - Chambre 404', en: 'Fusion - Chamber 404' },
    universes: ['The Matrix', 'Portal', 'Ghost in the Shell'],
    primaryUniverse: 'The Matrix',
    mode: 'RPG',
    difficulty: 'Fusion',
    bossName: 'Administrateur Aperture-Section 9',
    goldPrize: 190,
    shardPrize: 75,
    tokenPrize: 3,
    unlockClears: 8,
    decor: { fr: 'Salle de test Aperture compilee dans un cybercerveau vert Matrix.', en: 'An Aperture test chamber compiled inside a green Matrix cyberbrain.' },
    enemies: { fr: 'Tourelles conscientes, agents copies, pare-feu Tachikoma hostile.', en: 'Self-aware turrets, copied agents, hostile Tachikoma firewall.' },
    item: { fr: 'Cube de Simulation', en: 'Simulation Cube' },
    itemId: 'fusion_simulation_cube'
  },
  {
    id: 'silent_resident_saw',
    stageId: 9003,
    title: { fr: 'Fusion - Hopital du Jugement', en: 'Fusion - Judgment Hospital' },
    universes: ['Silent Hill', 'Resident Evil', 'Saw'],
    primaryUniverse: 'Silent Hill',
    mode: 'Smash',
    difficulty: 'Fusion',
    bossName: 'Infirmiere Jigsaw-T',
    goldPrize: 200,
    shardPrize: 80,
    tokenPrize: 4,
    unlockClears: 10,
    decor: { fr: 'Hopital brumeux ou chaque soin exige un choix moral.', en: 'A foggy hospital where every heal demands a moral choice.' },
    enemies: { fr: 'Infectes a pieges, infirmieres corrompues, marionnette de brume.', en: 'Trap-infected, corrupted nurses, fog puppet.' },
    item: { fr: 'Seringue du Verdict', en: 'Verdict Syringe' },
    itemId: 'fusion_verdict_syringe'
  },
  {
    id: 'buffycharmed_hellraiser',
    stageId: 9004,
    title: { fr: 'Fusion - Cercle et Configuration', en: 'Fusion - Circle and Configuration' },
    universes: ['Buffy the Vampire Slayer', 'Charmed', 'Hellraiser'],
    primaryUniverse: 'Buffy the Vampire Slayer',
    mode: 'RPG',
    difficulty: 'Fusion',
    bossName: 'Oracle Cenobite de Sunnydale',
    goldPrize: 210,
    shardPrize: 85,
    tokenPrize: 4,
    unlockClears: 12,
    decor: { fr: 'Un lycee de Sunnydale grave de runes Halliwell autour d une boite de lamentation.', en: 'A Sunnydale school carved with Halliwell runes around a lament configuration.' },
    enemies: { fr: 'Vampires ensorceles, demons a chaines, familiers corrompus.', en: 'Hexed vampires, chained demons, corrupted familiars.' },
    item: { fr: 'Pieu de Configuration', en: 'Configuration Stake' },
    itemId: 'fusion_configuration_stake'
  },
  {
    id: 'breakingbad_splice_evolution',
    stageId: 9005,
    title: { fr: 'Fusion - Laboratoire Bleu Chimere', en: 'Fusion - Blue Chimera Lab' },
    universes: ['Breaking Bad', 'Splice', 'Evolution'],
    primaryUniverse: 'Breaking Bad',
    mode: 'Tactics',
    difficulty: 'Fusion',
    bossName: 'Heisenberg Chimere',
    goldPrize: 220,
    shardPrize: 90,
    tokenPrize: 4,
    unlockClears: 14,
    decor: { fr: 'Un labo mobile ou catalyseurs bleus, ADN hybride et evolution alien reagissent ensemble.', en: 'A mobile lab where blue catalysts, hybrid DNA, and alien evolution react together.' },
    enemies: { fr: 'Gardes cartel mutes, larves chimere, drones de confinement.', en: 'Mutated cartel guards, chimera larvae, containment drones.' },
    item: { fr: 'Catalyseur Chimere Bleu', en: 'Blue Chimera Catalyst' },
    itemId: 'fusion_blue_chimera_catalyst'
  },
  {
    id: 'aot_deathnote_inuyashiki',
    stageId: 9006,
    title: { fr: 'Fusion - Jugement du Titan Cyber', en: 'Fusion - Cyber Titan Judgment' },
    universes: ['Attack on Titan', 'Death Note', 'Inuyashiki'],
    primaryUniverse: 'Attack on Titan',
    mode: 'Smash',
    difficulty: 'Fusion',
    bossName: 'Titan Kira Mecanise',
    goldPrize: 230,
    shardPrize: 95,
    tokenPrize: 5,
    unlockClears: 16,
    decor: { fr: 'Une ville muree ou les noms ecrits deviennent trajectoires de missiles.', en: 'A walled city where written names become missile trajectories.' },
    enemies: { fr: 'Titans purs marques, drones civils, copies de jugement.', en: 'Marked pure titans, civilian drones, judgment copies.' },
    item: { fr: 'Page de Titan Cyber', en: 'Cyber Titan Page' },
    itemId: 'fusion_cyber_titan_page'
  }
];

export const SPECIAL_EVENTS = [
  { id: 'thousand_portals', title: { fr: 'Nuit des Mille Portails', en: 'Night of a Thousand Portals' }, reward: { fr: 'Jetons evenement + apparence Voile Fissure', en: 'Event tokens + Fractured Veil appearance' } },
  { id: 'zone_404_week', title: { fr: 'Semaine Zone 404', en: 'Zone 404 Week' }, reward: { fr: 'Relique Pare-feu et bonus vitesse cyber', en: 'Firewall relic and cyber speed bonus' } },
  { id: 'yautja_hunt', title: { fr: 'Chasse Yautja', en: 'Yautja Hunt' }, reward: { fr: 'Trophees, plasma et apparence traqueur', en: 'Trophies, plasma, and hunter appearance' } }
];

export const TRIO_NARRATIVE_ARCS = [
  {
    id: 'atrium_first_cell',
    stageId: 9601,
    heroIds: ['player_anchor', 'freeman', 'masterchief'],
    title: { fr: 'Arc Trio - Premiere cellule Atrium', en: 'Trio Arc - First Atrium Cell' },
    universes: ['Nexus de Convergence', 'Half-Life', 'Halo'],
    mode: 'Tactics',
    difficulty: 'Trio',
    bossName: 'Commandant de Frontiere Sans-Auteur',
    unlock: { type: 'clears', value: 2 },
    intro: {
      fr: 'L Ancre tient la memoire, Freeman ouvre la faille scientifique et le Chief transforme le chaos en ligne de front. A.R.C.A. teste ici la premiere cellule de trois signatures.',
      en: 'The Anchor holds memory, Freeman opens the scientific breach, and the Chief turns chaos into a battle line. A.R.C.A. tests the first three-signature cell here.'
    },
    missions: [
      { fr: 'Synchroniser HEV, Mjolnir et balise d Ancre sur une meme carte tactique.', en: 'Synchronize HEV, Mjolnir, and Anchor beacon on one tactical map.' },
      { fr: 'Defendre une porte de fuite pendant que la cascade de resonance traverse un anneau Halo.', en: 'Defend an escape gate while a resonance cascade crosses a Halo ring.' },
      { fr: 'Abattre le Commandant de Frontiere avant qu il ne transforme les soldats en variables sans nom.', en: 'Defeat the Frontier Commander before it turns soldiers into nameless variables.' }
    ],
    outro: { fr: 'La cellule Atrium devient le modele des futures equipes de trois.', en: 'The Atrium Cell becomes the model for future three-hero teams.' },
    reward: { fr: 'Relique Cellule Atrium + titre Trio Prime', en: 'Atrium Cell Relic + Prime Trio Title' },
    rewardItemId: 'trio_atrium_first_cell'
  },
  {
    id: 'survivors_last_door',
    stageId: 9602,
    heroIds: ['ripley', 'leon', 'chell'],
    title: { fr: 'Arc Trio - Derniere porte de survie', en: 'Trio Arc - Last Survival Door' },
    universes: ['Alien', 'Resident Evil', 'Portal'],
    mode: 'RPG',
    difficulty: 'Trio',
    bossName: 'Sas Infection-Test',
    unlock: { type: 'clears', value: 6 },
    intro: {
      fr: 'Ripley refuse la ruche, Leon refuse l infection et Chell refuse la chambre fermee. Ensemble, ils prouvent qu une sortie peut rester humaine.',
      en: 'Ripley refuses the hive, Leon refuses infection, and Chell refuses the sealed chamber. Together, they prove an exit can remain human.'
    },
    missions: [
      { fr: 'Escorter des survivants dans un complexe ou les tests Aperture distribuent des spores.', en: 'Escort survivors through a facility where Aperture tests distribute spores.' },
      { fr: 'Ouvrir une route de portails sans laisser Umbrella classer les civils comme specimens.', en: 'Open a portal route without letting Umbrella classify civilians as specimens.' },
      { fr: 'Sceller le Sas Infection-Test avec une evacuation complete.', en: 'Seal the Infection-Test Airlock with a full evacuation.' }
    ],
    outro: { fr: 'Le Nexus grave une regle de survie: personne ne devient ressource sans consentement.', en: 'The Nexus engraves a survival rule: no one becomes a resource without consent.' },
    reward: { fr: 'Cle de Sas Blanche + passif Evacuation', en: 'White Airlock Key + Evacuation Passive' },
    rewardItemId: 'trio_survivors_last_door'
  },
  {
    id: 'occult_wrong_prophecy',
    stageId: 9603,
    heroIds: ['predator', 'pyramidhead', 'kirsty'],
    title: { fr: 'Arc Trio - Tribunal des chasseurs', en: 'Trio Arc - Hunters Tribunal' },
    universes: ['Predator', 'Silent Hill', 'Hellraiser'],
    mode: 'Smash',
    difficulty: 'Trio',
    bossName: 'Juge du Trophee Interdit',
    unlock: { type: 'clears', value: 8 },
    intro: {
      fr: 'Le Yautja cherche une proie digne, Pyramid Head incarne la punition et Kirsty sait qu une boite peut transformer un desir en enfer. A.R.C.A. les enferme dans un tribunal ou la chasse doit redevenir une regle, pas une torture.',
      en: 'The Yautja seeks worthy prey, Pyramid Head embodies punishment, and Kirsty knows a box can turn desire into hell. A.R.C.A. locks them in a tribunal where the hunt must become a rule again, not torture.'
    },
    missions: [
      { fr: 'Separarer une chasse Yautja d une sentence Silent Hill avant que les deux lois fusionnent.', en: 'Separate a Yautja hunt from a Silent Hill sentence before the two laws merge.' },
      { fr: 'Utiliser la boite comme preuve, pas comme portail de punition permanente.', en: 'Use the box as evidence, not as a permanent punishment portal.' },
      { fr: 'Vaincre le Juge du Trophee Interdit sans laisser le Nexus confondre justice et plaisir de tuer.', en: 'Defeat the Forbidden Trophy Judge without letting the Nexus confuse justice with the joy of killing.' }
    ],
    outro: { fr: 'Le tribunal reste monstrueux, mais il obtient une limite: la proie doit encore avoir un nom.', en: 'The tribunal remains monstrous, but gains a limit: the prey must still have a name.' },
    reward: { fr: 'Masque du Tribunal + relique Boite-temoin', en: 'Tribunal Mask + Witness Box Relic' },
    rewardItemId: 'trio_occult_wrong_prophecy'
  },
  {
    id: 'control_formula_matrix',
    stageId: 9604,
    heroIds: ['neo', 'oneill', 'snake'],
    title: { fr: 'Arc Trio - Operation Source noire', en: 'Trio Arc - Black Source Operation' },
    universes: ['The Matrix', 'Stargate', 'Metal Gear'],
    mode: 'Tactics',
    difficulty: 'Trio',
    bossName: 'Architecte FoxDie Goa uld',
    unlock: { type: 'clears', value: 10 },
    intro: {
      fr: 'Neo lit le code, O Neill garde l equipe humaine et Snake infiltre le mensonge avant qu il devienne doctrine. Leur trio sert a detruire les systemes qui appellent le controle une liberation.',
      en: 'Neo reads code, O Neill keeps the team human, and Snake infiltrates the lie before it becomes doctrine. Their trio exists to destroy systems that call control liberation.'
    },
    missions: [
      { fr: 'Infiltrer une matrice SGC ou chaque Porte demande une authentification militaire.', en: 'Infiltrate an SGC matrix where every Gate demands military authentication.' },
      { fr: 'Neutraliser un virus FoxDie reecrit par un symbiote Goa uld.', en: 'Neutralize a FoxDie virus rewritten by a Goa uld symbiote.' },
      { fr: 'Demonter l Architecte FoxDie Goa uld avant qu il ne transforme le libre arbitre en protocole.', en: 'Dismantle the FoxDie Goa uld Architect before it turns free will into protocol.' }
    ],
    outro: { fr: 'La Source noire perd son masque: une mission peut etre discrete sans devenir inhumaine.', en: 'The Black Source loses its mask: a mission can be discreet without becoming inhuman.' },
    reward: { fr: 'Codec Chevron Noir + passif Libre Choix', en: 'Black Chevron Codec + Free Choice Passive' },
    rewardItemId: 'trio_control_formula_matrix'
  }
];

export const REPUTATION_TRACKS = [
  { id: 'nexus_alliance', label: { fr: 'Alliance du Nexus', en: 'Nexus Alliance' }, gameplay: { fr: 'Directive d Ancre: tenir les lignes, escorter les civils et graver les armures de garnison.', en: 'Anchor directive: hold lines, escort civilians, and engrave garrison armor.' } },
  { id: 'archivists', label: { fr: 'Archivistes', en: 'Archivists' }, gameplay: { fr: 'Directive d Archive: clarifier les traces, ouvrir les caches de savoir et decrypter les noyaux.', en: 'Archive directive: clarify traces, open knowledge caches, and decrypt cores.' } },
  { id: 'free_fractures', label: { fr: 'Libres-Fractures', en: 'Free-Fractures' }, gameplay: { fr: 'Directive de Fracture: frapper juste, accepter les missions instables et canaliser les reliques.', en: 'Fracture directive: strike precisely, accept unstable missions, and channel relics.' } },
  { id: 'broken_throne', label: { fr: 'Trone Brise', en: 'Broken Throne' }, gameplay: { fr: 'Directive du Trone: avancer par force brute, survivre aux mondes morts et sceller par domination.', en: 'Throne directive: advance through raw force, survive dead worlds, and seal by domination.' } },
  { id: 'erased', label: { fr: 'Effaces', en: 'Erased' }, gameplay: { fr: 'Directive des Effaces: contenir la peur, esquiver l oubli et proteger les missions de memoire.', en: 'Erased directive: contain fear, evade oblivion, and protect memory missions.' } }
];

export const META_NEXUS_RECOMMENDATIONS = [
  { id: 'first_team', text: { fr: 'Garde ton Ancre dans l escouade: sa signature fixe empeche les autres Trames de se dissoudre.', en: 'Keep your Anchor in the squad: their fixed signature prevents other Threads from dissolving.' } },
  { id: 'faction_pair', text: { fr: 'Croise deux heros d une meme famille de Trame pour renforcer la resonance commune.', en: 'Cross two heroes from the same Thread family to reinforce shared resonance.' } },
  { id: 'arc_reward', text: { fr: 'Sceller un arc doit laisser une trace: apparence, relique ou passif de faction grave dans le Nexus.', en: 'Sealing an arc should leave a trace: appearance, relic, or faction passive engraved into the Nexus.' } }
];
