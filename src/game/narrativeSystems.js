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
      { type: 'skin', name: { fr: 'Skin Armure Acide', en: 'Acid Armor Skin' } },
      { type: 'item', name: { fr: 'Lame Plasma Corrodee', en: 'Corroded Plasma Blade' } }
    ]
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
      { type: 'skin', name: { fr: 'Skin Neon Persona', en: 'Neon Persona Skin' } },
      { type: 'item', name: { fr: 'Micro d Ancrage', en: 'Anchor Microphone' } }
    ]
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
      { type: 'skin', name: { fr: 'Skin Rempart Atrium', en: 'Atrium Bulwark Skin' } },
      { type: 'item', name: { fr: 'Plaque de Commandement SGC/N7', en: 'SGC/N7 Command Plate' } }
    ]
  },
  cyber_reality: {
    intro: { fr: 'La Zone 404 prouve que certaines breches sont des permissions volees, pas des lieux.', en: 'Zone 404 proves some breaches are stolen permissions, not places.' },
    missions: [
      { fr: 'Nettoyer une sauvegarde corrompue par un virus de Trame.', en: 'Clean a save corrupted by a Thread virus.' },
      { fr: 'Defendre A.R.C.A. pendant une attaque de droits administrateur.', en: 'Defend A.R.C.A. during an administrator-rights attack.' },
      { fr: 'Installer un pare-feu narratif dans le coeur du hub.', en: 'Install a narrative firewall in the hub core.' }
    ],
    outro: { fr: 'Les sauvegardes ont maintenant une memoire de secours.', en: 'Saves now have a backup memory.' },
    rewards: [
      { type: 'skin', name: { fr: 'Skin Zone 404', en: 'Zone 404 Skin' } },
      { type: 'item', name: { fr: 'Fragment de Pare-feu Narratif', en: 'Narrative Firewall Fragment' } }
    ]
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
      { type: 'skin', name: { fr: 'Skin Archive Noire', en: 'Black Archive Skin' } },
      { type: 'item', name: { fr: 'Lampe d Origine', en: 'Origin Lamp' } }
    ]
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
    outro: { fr: 'Le reseau devient une colonne vertebrale de voyage pour les futures missions multijoueur.', en: 'The network becomes a travel backbone for future multiplayer missions.' },
    reward: { fr: 'Skin Iris Nexus + Relique Chevron Huit', en: 'Nexus Iris Skin + Eighth Chevron Relic' }
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
    reward: { fr: 'Item Chambre Blanche + skin Combinaison Nexus', en: 'White Chamber Item + Nexus Suit Skin' }
  }
];

export const CHARACTER_NARRATIVE_ARCS = [
  {
    id: 'player_anchor',
    heroId: 'player_anchor',
    title: { fr: 'Arc Personnage - L Ancre', en: 'Character Arc - The Anchor' },
    intro: { fr: 'Le joueur n est pas recrute: il est le point fixe autour duquel les autres signatures tiennent.', en: 'The player is not recruited: they are the fixed point holding other signatures together.' },
    missions: [
      { fr: 'Choisir son nom et stabiliser la premiere escouade.', en: 'Choose a name and stabilize the first squad.' },
      { fr: 'Porter une relique de Trame sans perdre son identite.', en: 'Carry a Thread relic without losing identity.' },
      { fr: 'Resister a une tentative de suppression du Sans-Auteur.', en: 'Resist an Authorless deletion attempt.' }
    ],
    outro: { fr: 'L Ancre devient commandant, archive vivante et cle du futur multijoueur.', en: 'The Anchor becomes commander, living archive, and key to future multiplayer.' },
    reward: { fr: 'Titre Profil: Ancre Prime', en: 'Profile Title: Prime Anchor' }
  },
  {
    id: 'freeman_silent_key',
    heroId: 'freeman',
    title: { fr: 'Arc Personnage - La cle silencieuse', en: 'Character Arc - The Silent Key' },
    intro: { fr: 'Gordon Freeman attire les ruptures parce qu il a deja survecu a une cascade de resonance.', en: 'Gordon Freeman attracts ruptures because he already survived a resonance cascade.' },
    missions: [
      { fr: 'Analyser la compatibilite HEV avec les Eclats d Origine.', en: 'Analyze HEV compatibility with Origin Shards.' },
      { fr: 'Transformer un outil scientifique en arme anti-breche.', en: 'Turn a scientific tool into an anti-breach weapon.' },
      { fr: 'Faire taire un Strider avant qu il ne marque le Nexus.', en: 'Silence a Strider before it marks the Nexus.' }
    ],
    outro: { fr: 'Le silence de Freeman devient un langage que le Nexus comprend.', en: 'Freeman silence becomes a language the Nexus understands.' },
    reward: { fr: 'Skin HEV Nexus + Module Long Jump instable', en: 'Nexus HEV Skin + Unstable Long Jump Module' }
  }
];

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
  }
];

export const SPECIAL_EVENTS = [
  { id: 'thousand_portals', title: { fr: 'Nuit des Mille Portails', en: 'Night of a Thousand Portals' }, reward: { fr: 'Jetons evenement + skin Voile Fissure', en: 'Event tokens + Fractured Veil skin' } },
  { id: 'zone_404_week', title: { fr: 'Semaine Zone 404', en: 'Zone 404 Week' }, reward: { fr: 'Relique Pare-feu et bonus vitesse cyber', en: 'Firewall relic and cyber speed bonus' } },
  { id: 'yautja_hunt', title: { fr: 'Chasse Yautja', en: 'Yautja Hunt' }, reward: { fr: 'Trophees, plasma et skin traqueur', en: 'Trophies, plasma, and hunter skin' } }
];

export const REPUTATION_TRACKS = [
  { id: 'nexus_alliance', label: { fr: 'Alliance du Nexus', en: 'Nexus Alliance' }, gameplay: { fr: 'Bonus defense, missions de protection, skins militaires.', en: 'Defense bonus, protection missions, military skins.' } },
  { id: 'archivists', label: { fr: 'Archivistes', en: 'Archivists' }, gameplay: { fr: 'Codex plus rapide, recompenses lore, decryptage boss.', en: 'Faster codex, lore rewards, boss decryption.' } },
  { id: 'free_fractures', label: { fr: 'Libres-Fractures', en: 'Free-Fractures' }, gameplay: { fr: 'Critique, missions risquees, reliques instables.', en: 'Critical damage, risky missions, unstable relics.' } },
  { id: 'broken_throne', label: { fr: 'Trone Brise', en: 'Broken Throne' }, gameplay: { fr: 'Puissance brute, survie apocalypse, choix agressifs.', en: 'Raw power, apocalypse survival, aggressive choices.' } },
  { id: 'erased', label: { fr: 'Effaces', en: 'Erased' }, gameplay: { fr: 'Controle peur, esquive, missions de memoire.', en: 'Fear control, dodge, memory missions.' } }
];

export const META_NEXUS_RECOMMENDATIONS = [
  { id: 'first_team', text: { fr: 'Garde ton Ancre dans l escouade: c est le heros joueur et le meilleur repere de progression.', en: 'Keep your Anchor in the squad: it is the player hero and the clearest progression marker.' } },
  { id: 'faction_pair', text: { fr: 'Cherche toujours 2 heros de la meme faction pour activer le bonus +8%.', en: 'Always look for 2 heroes from the same faction to activate the +8% bonus.' } },
  { id: 'arc_reward', text: { fr: 'Terminer un arc devrait viser skin + item special + passif; c est la prochaine grande couche gameplay.', en: 'Completing an arc should aim for skin + special item + passive; that is the next big gameplay layer.' } }
];
