import { HEROES_DB } from './heroes';
import { FEATURED_UNIVERSE_NARRATIVE_ARCS } from './featuredUniversePacks';

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
  ...FEATURED_UNIVERSE_NARRATIVE_ARCS,
  {
    id: 'halo_installation_04_containment',
    title: { fr: 'Arc Univers - Halo: confinement Installation 04', en: 'Universe Arc - Halo: Installation 04 Containment' },
    universes: ['Halo'],
    intro: { fr: 'Une section de l Installation 04 reapparait dans le Nexus avec son vrai danger: Covenant en poursuite, protocoles Forerunner actifs et spores Parasite qui cherchent une sortie.', en: 'A section of Installation 04 reappears inside the Nexus with its real danger: Covenant pursuit, active Forerunner protocols, and Flood spores looking for an exit.' },
    missions: [
      { fr: 'Intro - Signal Cortana: identifier pourquoi l anneau ne repond plus aux protocoles UNSC.', en: 'Intro - Cortana Signal: identify why the ring no longer answers UNSC protocols.' },
      { fr: 'Mission - Cartographe silencieux: securiser une carte Forerunner pendant que les Elites et Sentinelles se disputent le controle.', en: 'Mission - Silent Cartographer: secure a Forerunner map while Elites and Sentinels fight for control.' },
      { fr: 'Interlude - Infection detectee: A.R.C.A. confirme que le Parasite ne doit jamais atteindre la Cite-Mosaique.', en: 'Interlude - Infection Detected: A.R.C.A. confirms the Flood must never reach Mosaic City.' },
      { fr: 'Mission - Couloirs de confinement: bruler les formes de combat avant qu elles contaminent une autre Trame.', en: 'Mission - Containment Corridors: burn combat forms before they infect another Thread.' },
      { fr: 'Boss - Scarab recode: abattre une machine Covenant marquee par le Sans-Auteur avant activation de l anneau.', en: 'Boss - Recoded Scarab: destroy an Authorless-marked Covenant machine before ring activation.' }
    ],
    outro: { fr: 'L anneau reste une arme, pas un miracle. A.R.C.A. archive Halo comme protocole de guerre, de sacrifice et de confinement absolu.', en: 'The ring remains a weapon, not a miracle. A.R.C.A. archives Halo as a protocol of war, sacrifice, and absolute containment.' },
    reward: { fr: 'Relique Cartographe silencieux + skin Installation 04', en: 'Silent Cartographer Relic + Installation 04 skin' }
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    id: 'silent_hill_otherworld_trial',
    title: { fr: 'Arc Univers - Silent Hill: proces de l Otherworld', en: 'Universe Arc - Silent Hill: Otherworld Trial' },
    universes: ['Silent Hill'],
    intro: { fr: 'Le brouillard entre dans la Cite-Mosaique sans ouvrir de porte. Il apporte une regle simple et terrible: chaque peur non dite peut devenir une rue.', en: 'Fog enters Mosaic City without opening a door. It brings a simple and terrible rule: every unspoken fear can become a street.' },
    missions: [
      { fr: 'Intro - Radio parasite: suivre le bruit blanc jusqu a South Vale sans tirer sur les ombres qui ne sont que souvenirs.', en: 'Intro - Static Radio: follow the white noise into South Vale without shooting shadows that are only memories.' },
      { fr: 'Mission - Brookhaven: distinguer malade, symbole et monstre avant que l hopital ne change de version.', en: 'Mission - Brookhaven: distinguish patient, symbol, and monster before the hospital changes version.' },
      { fr: 'Interlude - Sirene: la rouille recouvre la carte et A.R.C.A. perd le nom des pieces.', en: 'Interlude - Siren: rust covers the map and A.R.C.A. loses the room names.' },
      { fr: 'Mission - Lakeview efface: recuperer une verite personnelle avant que le Sans-Auteur la transforme en punition commune.', en: 'Mission - Erased Lakeview: recover a personal truth before the Authorless turns it into common punishment.' },
      { fr: 'Boss - Dieu sans culte: empecher l Otherworld de donner naissance a un juge universel.', en: 'Boss - God Without Cult: prevent the Otherworld from birthing a universal judge.' }
    ],
    outro: { fr: 'Le brouillard recule sans etre vaincu. A.R.C.A. apprend que Silent Hill ne se nettoie pas: on y survit en refusant de mentir a la Trame.', en: 'The fog retreats without being defeated. A.R.C.A. learns Silent Hill is not cleaned: one survives it by refusing to lie to the Thread.' },
    reward: { fr: 'Radio parasite scellee + relique Lakeview', en: 'Sealed Static Radio + Lakeview relic' }
  },
  {
    id: 'dino_crisis_third_energy_incident',
    title: { fr: 'Arc Univers - Dino Crisis: incident Third Energy', en: 'Universe Arc - Dino Crisis: Third Energy Incident' },
    universes: ['Dino Crisis'],
    intro: { fr: 'Ibis Island reapparait dans le Nexus avec son alarme principale active. La Third Energy n ouvre pas une porte: elle deplace un ecosysteme prehistorique entier dans un laboratoire militaire.', en: 'Ibis Island reappears inside the Nexus with its main alarm active. Third Energy does not open a door: it displaces an entire prehistoric ecosystem into a military laboratory.' },
    missions: [
      { fr: 'Intro - Signal Kirk: recuperer les premiers fichiers Third Energy avant que le systeme ne classe les dinosaures comme securite locale.', en: 'Intro - Kirk Signal: recover the first Third Energy files before the system classifies dinosaurs as local security.' },
      { fr: 'Mission - Couloirs raptors: traverser les laboratoires avec key plugs, darts et munitions comptees.', en: 'Mission - Raptor Corridors: cross the laboratories with key plugs, darts, and counted ammunition.' },
      { fr: 'Interlude - Edward City derive: A.R.C.A. confirme que la crise commence a importer des fragments de Dino Crisis 2.', en: 'Interlude - Edward City Drift: A.R.C.A. confirms the crisis is importing Dino Crisis 2 fragments.' },
      { fr: 'Mission - Jungle temporelle: escorter les survivants TRAT pendant qu une meute alpha cherche la sortie Nexus.', en: 'Mission - Temporal Jungle: escort TRAT survivors while an alpha pack searches for the Nexus exit.' },
      { fr: 'Boss - T-Rex Third Energy: attirer le predateur dans une chambre de confinement et couper la frequence avant collision temporelle.', en: 'Boss - Third Energy T-Rex: lure the predator into a containment chamber and cut the frequency before temporal collision.' }
    ],
    outro: { fr: 'Le laboratoire cesse de hurler, mais la lecon reste ouverte: le temps n est pas une ressource exploitable sans retour de morsure.', en: 'The laboratory stops screaming, but the lesson remains open: time is not a resource to exploit without a bite back.' },
    reward: { fr: 'Relique Reacteur Third Energy + cache SORT', en: 'Third Energy Reactor Relic + SORT cache' }
  },
  {
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
  },
  {
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
  },
  {
    id: 'soad_toxicity_protest_stage',
    title: { fr: 'Arc Univers - System of a Down: scene Toxicity', en: 'Universe Arc - System of a Down: Toxicity Stage' },
    universes: ['System of a Down'],
    intro: { fr: 'Une scene de protestation apparait dans le Nexus: les ecrans diffusent des ordres contradictoires, les riffs changent de mesure et la foule de resonance refuse de marcher droit.', en: 'A protest stage appears inside the Nexus: screens broadcast contradictory orders, riffs change meter, and the resonance crowd refuses to march straight.' },
    missions: [
      { fr: 'Intro - Signal Toxicity: identifier les broadcasts qui transforment la colere en bruit manipulable.', en: 'Intro - Toxicity Signal: identify broadcasts turning anger into manipulable noise.' },
      { fr: 'Mission - Prison Song Siren: couper les sirenes de controle sans effacer le message de protestation.', en: 'Mission - Prison Song Siren: cut control sirens without erasing the protest message.' },
      { fr: 'Interlude - Chop Suey Pulse: la mesure se casse et A.R.C.A. perd le tempo pendant huit battements.', en: 'Interlude - Chop Suey Pulse: the meter breaks and A.R.C.A. loses tempo for eight beats.' },
      { fr: 'Mission - Aerials Falling Sky: stabiliser une montee melodique avant qu elle ne devienne chute de Trame.', en: 'Mission - Aerials Falling Sky: stabilize a melodic rise before it becomes Thread collapse.' },
      { fr: 'Boss - Toxicity Riot Core: vaincre le noyau qui recycle protestation, satire et guerre en propagande vide.', en: 'Boss - Toxicity Riot Core: defeat the core recycling protest, satire, and war into empty propaganda.' }
    ],
    outro: { fr: 'La scene reste chaotique, mais le message redevient lisible. A.R.C.A. classe SOAD comme Trame de rupture: elle derange pour empecher le mensonge de devenir cadence.', en: 'The stage remains chaotic, but the message becomes readable again. A.R.C.A. classifies SOAD as a rupture Thread: it disturbs to prevent lies from becoming cadence.' },
    reward: { fr: 'Relique Banniere anti-guerre + pick rupture tempo', en: 'Anti-War Banner Relic + tempo break pick' }
  },
  {
    id: 'kaamelott_grail_council',
    title: { fr: 'Arc Univers - Kaamelott: conseil du Graal', en: 'Universe Arc - Kaamelott: Grail Council' },
    universes: ['Kaamelott'],
    intro: { fr: 'Le Royaume de Logres reapparait dans le Nexus sous forme de Table Ronde instable: chaque ordre devient debat, chaque debat devient mission et la quete du Graal menace de se dissoudre dans la mauvaise organisation.', en: 'The Kingdom of Logres reappears in the Nexus as an unstable Round Table: every order becomes debate, every debate becomes mission, and the Grail quest risks dissolving into bad organization.' },
    missions: [
      { fr: 'Intro - Table Ronde ouverte: reunir Arthur, Perceval et Karadoc avant que le Sans-Auteur ne reduise Kaamelott a une farce vide.', en: 'Intro - Round Table Opened: gather Arthur, Perceval, and Karadoc before the Authorless reduces Kaamelott to empty farce.' },
      { fr: 'Mission - Conseil impossible: trier les ordres de Leodagan, les excuses de chevaliers et les pistes de Graal encore utiles.', en: 'Mission - Impossible Council: sort Leodagan orders, knight excuses, and Grail leads that are still useful.' },
      { fr: 'Interlude - Lancelot Noir: la rupture de Lancelot attire Meleagant dans une marge que la Trame refuse de nommer.', en: 'Interlude - Black Lancelot: Lancelot rupture draws Meleagant into a margin the Thread refuses to name.' },
      { fr: 'Mission - Foret des Burgondes: traverser une embuscade ou les ennemis comprennent parfois moins le plan que les allies.', en: 'Mission - Burgundian Forest: cross an ambush where enemies sometimes understand the plan even less than allies do.' },
      { fr: 'Boss - Faille du Graal: empecher le Sans-Auteur de transformer la quete sacree en objectif generique sans consequence.', en: 'Boss - Grail Rift: prevent the Authorless from turning the sacred quest into a generic objective without consequence.' }
    ],
    outro: { fr: 'Logres reste bancal, humain et dangereux. A.R.C.A. classe Kaamelott comme Trame de commandement fatigue: le rire protege la verite, mais ne remplace jamais la quete.', en: 'Logres remains shaky, human, and dangerous. A.R.C.A. classifies Kaamelott as a weary command Thread: laughter protects truth, but never replaces the quest.' },
    reward: { fr: 'Relique Etincelle Excalibur + dossier Table Ronde', en: 'Excalibur Spark Relic + Round Table dossier' }
  },
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    id: 'soad_frontline_voice_broadcast',
    stageId: 9232,
    heroId: 'soad_vocal',
    title: { fr: 'Arc Personnage - SOAD Voice: broadcast brise', en: 'Character Arc - SOAD Voice: Broken Broadcast' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Propagande a voix vide',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Le Sans-Auteur vole les refrains de protestation pour en faire des ordres sans sens. Frontline Voice doit rendre la cassure audible sans transformer la colere en slogan automatique.', en: 'The Authorless steals protest choruses and turns them into meaningless orders. Frontline Voice must make the rupture audible without turning anger into automatic slogan.' },
    missions: [
      { fr: 'Mission 1 - Murmure et cri: retrouver le contraste vocal avant que la Trame ne normalise toute emotion.', en: 'Mission 1 - Whisper and Scream: recover vocal contrast before the Thread normalizes every emotion.' },
      { fr: 'Mission 2 - Toxicity feed: interrompre une diffusion qui recycle la peur politique en bruit de fond.', en: 'Mission 2 - Toxicity Feed: interrupt a broadcast recycling political fear into background noise.' },
      { fr: 'Mission 3 - Voix vide: vaincre la propagande qui imite la protestation sans porter de memoire.', en: 'Mission 3 - Empty Voice: defeat propaganda imitating protest without carrying memory.' }
    ],
    outro: { fr: 'La voix ne devient pas propre; elle redevient vraie. A.R.C.A. archive la dissonance comme protection contre les recits trop lisses.', en: 'The voice does not become clean; it becomes true again. A.R.C.A. archives dissonance as protection against overly smooth narratives.' },
    reward: { fr: 'Apparence Frontline Voice Toxicity + micro rupture', en: 'Toxicity Frontline Voice Skin + rupture mic' },
    rewardItemId: 'char_soad_frontline_voice'
  },
  {
    id: 'soad_staccato_guitar_measure',
    stageId: 9233,
    heroId: 'soad_guitar',
    title: { fr: 'Arc Personnage - SOAD Guitar: mesure brisee', en: 'Character Arc - SOAD Guitar: Broken Measure' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Metronome de controle',
    unlock: { type: 'clears', value: 5 },
    intro: { fr: 'Une faille impose une mesure militaire droite a la scene SOAD. Staccato Guitar entre pour casser le metronome et rendre au riff son danger.', en: 'A breach imposes a straight military meter on the SOAD stage. Staccato Guitar enters to break the metronome and give the riff its danger back.' },
    missions: [
      { fr: 'Mission 1 - Riff angulaire: couper les drones qui marchent uniquement sur temps forts.', en: 'Mission 1 - Angular Riff: cut drones that march only on downbeats.' },
      { fr: 'Mission 2 - Relance absurde: changer de motif avant que le Sans-Auteur ne prevoie le solo.', en: 'Mission 2 - Absurd Restart: shift motif before the Authorless predicts the solo.' },
      { fr: 'Mission 3 - Metronome de controle: vaincre la machine qui veut rendre tous les riffs obeissants.', en: 'Mission 3 - Control Metronome: defeat the machine trying to make every riff obedient.' }
    ],
    outro: { fr: 'La mesure reste instable, donc vivante. A.R.C.A. classe la guitare staccato comme arme contre la cadence imposee.', en: 'The meter remains unstable, therefore alive. A.R.C.A. classifies staccato guitar as a weapon against imposed cadence.' },
    reward: { fr: 'Apparence Staccato Guitar + mediator syncopé', en: 'Staccato Guitar Skin + syncopated pick' },
    rewardItemId: 'char_soad_staccato_guitar'
  },
  {
    id: 'soad_groove_bass_frontline',
    stageId: 9234,
    heroId: 'soad_bass',
    title: { fr: 'Arc Personnage - SOAD Bass: ligne de front', en: 'Character Arc - SOAD Bass: Frontline Groove' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Riot Core de basse vide',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'La scene Toxicity devient trop chaotique pour avancer. Groove Bass doit transformer la protestation en ligne tactique sans calmer ce qui doit rester en colere.', en: 'The Toxicity stage becomes too chaotic to advance. Groove Bass must turn protest into tactical line without calming what must remain angry.' },
    missions: [
      { fr: 'Mission 1 - Pulsation lourde: ancrer l escouade pendant une cascade de ruptures de tempo.', en: 'Mission 1 - Heavy Pulse: anchor the squad during a cascade of tempo breaks.' },
      { fr: 'Mission 2 - Banniere stable: proteger une zone de protestation pendant que les broadcasts ennemis la parasitent.', en: 'Mission 2 - Stable Banner: protect a protest zone while hostile broadcasts corrupt it.' },
      { fr: 'Mission 3 - Riot Core: vaincre le noyau qui transforme la foule en bruit sans direction.', en: 'Mission 3 - Riot Core: defeat the core turning the crowd into directionless noise.' }
    ],
    outro: { fr: 'La basse laisse une ligne au sol: pas une marche militaire, une route de resistance.', en: 'The bass leaves a line on the floor: not a military march, a resistance route.' },
    reward: { fr: 'Apparence Groove Bass Protest + ampli d ancrage', en: 'Protest Groove Bass Skin + anchor amp' },
    rewardItemId: 'char_soad_groove_bass'
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    id: 'pyramidhead_red_limit',
    stageId: 9221,
    heroId: 'pyramidhead',
    title: { fr: 'Arc Personnage - Pyramid Head: limite rouge', en: 'Character Arc - Pyramid Head: Red Limit' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'Juge Sans-Auteur',
    unlock: { type: 'clears', value: 8 },
    intro: { fr: 'Le Sans-Auteur tente de voler Pyramid Head a Silent Hill pour en faire un bourreau universel. A.R.C.A. doit prouver qu une punition hors contexte devient un mensonge.', en: 'The Authorless tries to steal Pyramid Head from Silent Hill and turn him into a universal executioner. A.R.C.A. must prove punishment without context becomes a lie.' },
    missions: [
      { fr: 'Mission 1 - Casque rouge: isoler la signature de jugement sans la laisser condamner une escouade innocente.', en: 'Mission 1 - Red Helmet: isolate the judgment signature without letting it condemn an innocent squad.' },
      { fr: 'Mission 2 - Couloir de rouille: traverser un Otherworld qui veut appliquer la culpabilite de James a tous les heros.', en: 'Mission 2 - Rust Corridor: cross an Otherworld trying to apply James guilt to every hero.' },
      { fr: 'Mission 3 - Faux tribunal: abattre le Juge Sans-Auteur avant qu il ne transforme Pyramid Head en outil de suppression.', en: 'Mission 3 - False Tribunal: defeat the Authorless Judge before it turns Pyramid Head into a deletion tool.' }
    ],
    outro: { fr: 'Pyramid Head reste une limite, pas une excuse. A.R.C.A. archive la regle: Silent Hill juge une verite intime, pas le multivers entier.', en: 'Pyramid Head remains a boundary, not an excuse. A.R.C.A. archives the rule: Silent Hill judges an intimate truth, not the entire multiverse.' },
    reward: { fr: 'Apparence Pyramid Head Rouille Rouge + marque de limite', en: 'Red Rust Pyramid Head Skin + boundary mark' },
    rewardItemId: 'char_pyramidhead_red_rust'
  },
  {
    id: 'james_lakeview_letter',
    stageId: 9222,
    heroId: 'james_s',
    title: { fr: 'Arc Personnage - James: lettre de Lakeview', en: 'Character Arc - James: Lakeview Letter' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Memoire Mary effacee',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Une lettre arrive dans les Archives A.R.C.A. avec une ecriture qui ne devrait plus exister. James comprend que Silent Hill ne l appelle pas pour gagner: elle l appelle pour dire vrai.', en: 'A letter arrives in the A.R.C.A. Archives with handwriting that should no longer exist. James understands Silent Hill is not calling him to win: it is calling him to tell the truth.' },
    missions: [
      { fr: 'Mission 1 - South Vale: suivre la radio parasite jusqu a une carte qui retire les mensonges au lieu d ajouter des routes.', en: 'Mission 1 - South Vale: follow the static radio to a map that removes lies instead of adding routes.' },
      { fr: 'Mission 2 - Brookhaven: survivre aux Nurses et Lying Figures sans confondre symbole et ennemi ordinaire.', en: 'Mission 2 - Brookhaven: survive Nurses and Lying Figures without mistaking symbol for ordinary enemy.' },
      { fr: 'Mission 3 - Lakeview: affronter la memoire de Mary avant que le Sans-Auteur ne transforme la lettre en piege commun.', en: 'Mission 3 - Lakeview: face Mary memory before the Authorless turns the letter into a common trap.' }
    ],
    outro: { fr: 'James ne sort pas indemne, mais il sort avec la lettre entiere. A.R.C.A. classe son arc comme preuve qu une verite douloureuse stabilise mieux qu un mensonge confortable.', en: 'James does not leave unharmed, but he leaves with the whole letter. A.R.C.A. classifies his arc as proof that painful truth stabilizes better than comfortable lies.' },
    reward: { fr: 'Apparence James Lakeview + lettre scellee', en: 'Lakeview James Skin + sealed letter' },
    rewardItemId: 'char_james_lakeview'
  },
  {
    id: 'heather_no_god_birth',
    stageId: 9223,
    heroId: 'heather',
    title: { fr: 'Arc Personnage - Heather: pas de naissance divine', en: 'Character Arc - Heather: No God Birth' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Claudia Prophetesse de Trame',
    unlock: { type: 'clears', value: 6 },
    intro: { fr: 'L Ordre trouve dans la Breche une prophetie neuve: faire naitre un dieu capable de juger toutes les Trames. Heather refuse que son origine devienne une cage.', en: 'The Order finds a new prophecy inside the Breach: birth a god able to judge every Thread. Heather refuses to let her origin become a cage.' },
    missions: [
      { fr: 'Mission 1 - Centre commercial: briser les premiers signes du rituel avant que l Otherworld ne verrouille les sorties.', en: 'Mission 1 - Mall: break the first ritual signs before the Otherworld locks the exits.' },
      { fr: 'Mission 2 - Brookhaven rouge: recuperer l Aglaophotis et separer Alessa, Heather et la Breche.', en: 'Mission 2 - Red Brookhaven: recover Aglaophotis and separate Alessa, Heather, and the Breach.' },
      { fr: 'Mission 3 - Parc d attractions: vaincre Claudia de Trame avant la naissance d un dieu sans monde.', en: 'Mission 3 - Amusement Park: defeat Thread Claudia before the birth of a god without a world.' }
    ],
    outro: { fr: 'Heather quitte le rituel en gardant son nom. A.R.C.A. archive son protocole comme refus de destin impose.', en: 'Heather leaves the ritual while keeping her name. A.R.C.A. archives her protocol as refusal of imposed destiny.' },
    reward: { fr: 'Apparence Heather Aglaophotis + pendentif scelle', en: 'Aglaophotis Heather Skin + sealed pendant' },
    rewardItemId: 'char_heather_aglaophotis'
  },
  {
    id: 'regina_ibis_extraction',
    stageId: 9224,
    heroId: 'regina',
    title: { fr: 'Arc Personnage - Regina: extraction Ibis Island', en: 'Character Arc - Regina: Ibis Island Extraction' },
    mode: 'Smash',
    difficulty: 'Personal',
    bossName: 'T-Rex de confinement',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'A.R.C.A. rouvre Ibis Island au moment ou les alarmes SORT se melangent au signal Third Energy. Regina entre pour recuperer les preuves, pas pour jouer les chasseuses.', en: 'A.R.C.A. reopens Ibis Island as SORT alarms mix with the Third Energy signal. Regina enters to recover proof, not to play hunter.' },
    missions: [
      { fr: 'Mission 1 - Key plug rouge: ouvrir une route de laboratoire sans liberer la meute enfermee derriere.', en: 'Mission 1 - Red Key Plug: open a lab route without releasing the pack locked behind it.' },
      { fr: 'Mission 2 - Secteur raptor: utiliser darts, leurres et tir mobile pour traverser une zone de poursuite.', en: 'Mission 2 - Raptor Sector: use darts, lures, and mobile fire to cross a pursuit zone.' },
      { fr: 'Mission 3 - Extraction Kirk: recuperer les donnees Third Energy avant que le T-Rex ne deforme la sortie Nexus.', en: 'Mission 3 - Kirk Extraction: recover Third Energy data before the T-Rex bends the Nexus exit.' }
    ],
    outro: { fr: 'Regina sort avec les preuves et une regle claire: l anomalie doit etre fermee avant de devenir attraction.', en: 'Regina leaves with the proof and a clear rule: the anomaly must be closed before it becomes an attraction.' },
    reward: { fr: 'Apparence Regina SORT Ibis + key plug rouge', en: 'Ibis SORT Regina Skin + red key plug' },
    rewardItemId: 'char_regina_sort_ibis'
  },
  {
    id: 'dylan_edward_city_route',
    stageId: 9225,
    heroId: 'dylan',
    title: { fr: 'Arc Personnage - Dylan: route Edward City', en: 'Character Arc - Dylan: Edward City Route' },
    mode: 'Tactics',
    difficulty: 'Personal',
    bossName: 'Giganotosaurus de derive',
    unlock: { type: 'clears', value: 6 },
    intro: { fr: 'La Breche recolle Edward City a une jungle prehistorique. Dylan sait qu un soldat ne vaut rien s il gagne la route en abandonnant les survivants.', en: 'The Breach stitches Edward City to a prehistoric jungle. Dylan knows a soldier is worthless if he wins the route by abandoning survivors.' },
    missions: [
      { fr: 'Mission 1 - Route TRAT: former une ligne de tir et sauver les signatures civiles avant fermeture du passage.', en: 'Mission 1 - TRAT Route: form a firing line and save civilian signatures before the passage closes.' },
      { fr: 'Mission 2 - Paula fantome: suivre une trace future sans provoquer de paradoxe Third Energy.', en: 'Mission 2 - Ghost Paula: follow a future trace without causing a Third Energy paradox.' },
      { fr: 'Mission 3 - Chute du Giganotosaurus: tenir le terrain assez longtemps pour extraire la ville indexee.', en: 'Mission 3 - Giganotosaurus Fall: hold the field long enough to extract the indexed city.' }
    ],
    outro: { fr: 'Dylan transforme la retraite en sauvetage. A.R.C.A. archive Edward City comme avertissement: un futur sauve de force peut encore blesser le present.', en: 'Dylan turns retreat into rescue. A.R.C.A. archives Edward City as warning: a future saved by force can still wound the present.' },
    reward: { fr: 'Apparence Dylan TRAT + balise Edward City', en: 'TRAT Dylan Skin + Edward City beacon' },
    rewardItemId: 'char_dylan_trat'
  },
  {
    id: 'rick_third_energy_lockout',
    stageId: 9226,
    heroId: 'rick_dc',
    title: { fr: 'Arc Personnage - Rick: verrou Third Energy', en: 'Character Arc - Rick: Third Energy Lockout' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Console Kirk recodee',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Les portes d Ibis Island changent de codes a chaque impulsion. Rick entre dans le systeme pour prouver que Dino Crisis n est pas qu une poursuite: c est aussi une panne scientifique.', en: 'Ibis Island doors change codes with every pulse. Rick enters the system to prove Dino Crisis is not only a chase: it is also a scientific failure.' },
    missions: [
      { fr: 'Mission 1 - Terminal SORT: recuperer les droits d acces sans ouvrir les cages de specimens.', en: 'Mission 1 - SORT Terminal: recover access rights without opening specimen cages.' },
      { fr: 'Mission 2 - Boucle key card: casser une sequence de portes que le Sans-Auteur utilise pour enfermer l escouade.', en: 'Mission 2 - Key Card Loop: break a door sequence the Authorless uses to trap the squad.' },
      { fr: 'Mission 3 - Arret du reacteur: couper la Third Energy avant que le laboratoire ne copie une autre epoque.', en: 'Mission 3 - Reactor Shutdown: cut Third Energy before the lab copies another era.' }
    ],
    outro: { fr: 'Rick ferme la console et laisse une route propre derriere l equipe. A.R.C.A. classe le verrouillage comme victoire de support, pas comme detail technique.', en: 'Rick closes the console and leaves a clean route behind the team. A.R.C.A. classifies the lockout as a support victory, not a technical detail.' },
    reward: { fr: 'Apparence Rick Terminal SORT + verrou Third Energy', en: 'SORT Terminal Rick Skin + Third Energy lock' },
    rewardItemId: 'char_rick_third_energy'
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
  },
  {
    id: 'arthur_kaamelott_grail_burden',
    stageId: 9235,
    heroId: 'arthur_kaamelott',
    title: { fr: 'Arc Personnage - Roi fatigue', en: 'Character Arc - Weary King' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Meleagant Murmure',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Arthur n arrive pas dans le Nexus pour jouer au roi. Il arrive avec le poids d une quete sacree que personne ne sait vraiment organiser.', en: 'Arthur does not enter the Nexus to play king. He arrives with the weight of a sacred quest no one truly knows how to organize.' },
    missions: [
      { fr: 'Mission 1 - Ordre de Logres: reprendre la Table Ronde sans laisser les disputes masquer le Graal.', en: 'Mission 1 - Order of Logres: retake the Round Table without letting arguments hide the Grail.' },
      { fr: 'Mission 2 - Frontiere de Carmelite: tenir Leodagan, les bandits et les mauvaises decisions loin du meme couloir.', en: 'Mission 2 - Carmelite Border: keep Leodagan, bandits, and bad decisions away from the same corridor.' },
      { fr: 'Mission 3 - Lancelot Noir: affronter la rupture de Lancelot sans transformer Kaamelott en simple guerre de chevaliers.', en: 'Mission 3 - Black Lancelot: face Lancelot rupture without turning Kaamelott into a simple knight war.' },
      { fr: 'Boss - Meleagant Murmure: refuser la voix qui veut faire croire qu abandonner la quete serait enfin du repos.', en: 'Boss - Meleagant Whisper: refuse the voice claiming that abandoning the quest would finally mean rest.' }
    ],
    outro: { fr: 'Arthur ne repart pas gueri, mais il repart debout. A.R.C.A. comprend que son heroisme tient dans la decision de commander encore quand tout l use.', en: 'Arthur does not leave healed, but he leaves standing. A.R.C.A. understands his heroism lies in choosing to command again when everything wears him down.' },
    reward: { fr: 'Apparence Roi de Logres + etincelle Excalibur', en: 'King of Logres Skin + Excalibur spark' },
    rewardItemId: 'char_arthur_kaamelott_king'
  },
  {
    id: 'perceval_kaamelott_oblique_rule',
    stageId: 9236,
    heroId: 'perceval_kaamelott',
    title: { fr: 'Arc Personnage - C est pas faux', en: 'Character Arc - Not Wrong Exactly' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Regle Sans Definition',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Perceval comprend rarement la consigne comme A.R.C.A. l ecrit. C est precisement pour ca qu il repere parfois la sortie cachee.', en: 'Perceval rarely understands the instruction as A.R.C.A. writes it. That is exactly why he sometimes spots the hidden exit.' },
    missions: [
      { fr: 'Mission 1 - Mauvaise definition: suivre une piste de Graal qui n existe que si on accepte de mal poser la question.', en: 'Mission 1 - Wrong Definition: follow a Grail clue that exists only if the question is phrased badly.' },
      { fr: 'Mission 2 - Jeu gallois: survivre a des regles qui changent chaque fois que quelqu un tente de les expliquer.', en: 'Mission 2 - Welsh Game: survive rules that change whenever someone tries to explain them.' },
      { fr: 'Mission 3 - Bonne porte par erreur: ouvrir le passage que le Sans-Auteur croyait protege par une logique trop parfaite.', en: 'Mission 3 - Right Door by Mistake: open the passage the Authorless thought protected by logic too perfect.' },
      { fr: 'Boss - Regle Sans Definition: vaincre une anomalie qui devient invincible des qu on pretend tout comprendre.', en: 'Boss - Rule Without Definition: defeat an anomaly that becomes invincible whenever everyone pretends to understand it.' }
    ],
    outro: { fr: 'Perceval ne donne pas une explication claire. Il donne mieux: une route praticable et une loyaute intacte envers Arthur.', en: 'Perceval does not give a clear explanation. He gives something better: a usable route and loyalty to Arthur left intact.' },
    reward: { fr: 'Apparence Pays de Galles + boucle C est pas faux', en: 'Wales Skin + Not Wrong Loop' },
    rewardItemId: 'char_perceval_c_est_pas_faux'
  },
  {
    id: 'karadoc_kaamelott_survival_ration',
    stageId: 9237,
    heroId: 'karadoc_kaamelott',
    title: { fr: 'Arc Personnage - Casse-croute de survie', en: 'Character Arc - Survival Snack' },
    mode: 'RPG',
    difficulty: 'Personal',
    bossName: 'Famine de Trame',
    unlock: { type: 'level', value: 3 },
    intro: { fr: 'Karadoc regarde une faille cosmique et pose la seule question que personne n a prevue: combien de temps tient une quete sans manger?', en: 'Karadoc looks at a cosmic breach and asks the one question no one planned for: how long does a quest last without food?' },
    missions: [
      { fr: 'Mission 1 - Reserve de Vannes: recuperer les rations avant que le Sans-Auteur ne classe la faim comme detail comique.', en: 'Mission 1 - Vannes Reserve: recover rations before the Authorless classifies hunger as a comic detail.' },
      { fr: 'Mission 2 - Route trop longue: proteger les chevaliers fatigues pendant qu Arthur cherche encore un plan presentable.', en: 'Mission 2 - Too Long Road: protect exhausted knights while Arthur still looks for a presentable plan.' },
      { fr: 'Mission 3 - Table de repli: transformer un repas improvise en point de ralliement tactique.', en: 'Mission 3 - Fallback Table: turn an improvised meal into a tactical rally point.' },
      { fr: 'Boss - Famine de Trame: vaincre l anomalie qui veut couper les corps de la legende pour rendre Logres abstrait.', en: 'Boss - Thread Famine: defeat the anomaly trying to cut bodies out of legend and make Logres abstract.' }
    ],
    outro: { fr: 'Karadoc prouve que survivre n est pas moins noble que chercher le Graal. Sans corps debout, aucune legende ne traverse la nuit.', en: 'Karadoc proves survival is not less noble than searching for the Grail. Without bodies still standing, no legend crosses the night.' },
    reward: { fr: 'Apparence Clan de Vannes + ration Karadoc', en: 'Vannes Clan Skin + Karadoc ration' },
    rewardItemId: 'char_karadoc_vannes_ration'
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
    name: { fr: 'HEV Black Mesa', en: 'Black Mesa HEV' },
    colors: { primaryColor: '#ff8c00', secondaryColor: '#39c5bb' }
  },
  char_barney_city17: {
    id: 'char_barney_city17',
    heroId: 'barney',
    name: { fr: 'Resistance City 17', en: 'City 17 Resistance' },
    colors: { primaryColor: '#345c8c', secondaryColor: '#ffb15c' }
  },
  char_shephard_opposing_force: {
    id: 'char_shephard_opposing_force',
    heroId: 'shephard',
    name: { fr: 'HECU Opposing Force', en: 'Opposing Force HECU' },
    colors: { primaryColor: '#5f6f57', secondaryColor: '#f2d16b' }
  },
  char_alyx_resistance: {
    id: 'char_alyx_resistance',
    heroId: 'alyx_vance',
    name: { fr: 'Alyx Resistance', en: 'Alyx Resistance' },
    colors: { primaryColor: '#8e6f4e', secondaryColor: '#7bdcff' }
  },
  char_masterchief_atrium: {
    id: 'char_masterchief_atrium',
    heroId: 'masterchief',
    name: { fr: 'MJOLNIR Installation 04', en: 'Installation 04 MJOLNIR' },
    colors: { primaryColor: '#6aa84f', secondaryColor: '#63d7ff' }
  },
  char_oneill_sgc_nexus: {
    id: 'char_oneill_sgc_nexus',
    heroId: 'oneill',
    name: { fr: 'SGC Cheyenne', en: 'Cheyenne SGC' },
    colors: { primaryColor: '#233c31', secondaryColor: '#6ed0ff' }
  },
  char_carter_sgc_science: {
    id: 'char_carter_sgc_science',
    heroId: 'sam_carter',
    name: { fr: 'Carter Science SGC', en: 'SGC Science Carter' },
    colors: { primaryColor: '#2d3f7f', secondaryColor: '#9b59b6' }
  },
  char_tealc_free_jaffa: {
    id: 'char_tealc_free_jaffa',
    heroId: 'tealc',
    name: { fr: 'Jaffa libre', en: 'Free Jaffa' },
    colors: { primaryColor: '#6a3a1c', secondaryColor: '#d35400' }
  },
  char_daniel_abydos: {
    id: 'char_daniel_abydos',
    heroId: 'daniel_jackson',
    name: { fr: 'Daniel Abydos', en: 'Abydos Daniel' },
    colors: { primaryColor: '#d9b36c', secondaryColor: '#6ed0ff' }
  },
  char_pyramidhead_red_rust: {
    id: 'char_pyramidhead_red_rust',
    heroId: 'pyramidhead',
    name: { fr: 'Pyramid Head Rouille Rouge', en: 'Red Rust Pyramid Head' },
    colors: { primaryColor: '#7c0a02', secondaryColor: '#3b0000' }
  },
  char_james_lakeview: {
    id: 'char_james_lakeview',
    heroId: 'james_s',
    name: { fr: 'James Lakeview', en: 'Lakeview James' },
    colors: { primaryColor: '#7f8c8d', secondaryColor: '#cbd8c8' }
  },
  char_heather_aglaophotis: {
    id: 'char_heather_aglaophotis',
    heroId: 'heather',
    name: { fr: 'Heather Aglaophotis', en: 'Aglaophotis Heather' },
    colors: { primaryColor: '#e67e22', secondaryColor: '#f1c27d' }
  },
  char_regina_sort_ibis: {
    id: 'char_regina_sort_ibis',
    heroId: 'regina',
    name: { fr: 'Regina SORT Ibis', en: 'Ibis SORT Regina' },
    colors: { primaryColor: '#a52a2a', secondaryColor: '#ff6b56' }
  },
  char_dylan_trat: {
    id: 'char_dylan_trat',
    heroId: 'dylan',
    name: { fr: 'Dylan TRAT', en: 'TRAT Dylan' },
    colors: { primaryColor: '#2f6b43', secondaryColor: '#f1c40f' }
  },
  char_rick_third_energy: {
    id: 'char_rick_third_energy',
    heroId: 'rick_dc',
    name: { fr: 'Rick Verrou Third Energy', en: 'Third Energy Lockout Rick' },
    colors: { primaryColor: '#e74c3c', secondaryColor: '#39c5bb' }
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
  char_trinity_nebuchadnezzar: {
    id: 'char_trinity_nebuchadnezzar',
    heroId: 'trinity',
    name: { fr: 'Trinity Nebuchadnezzar', en: 'Nebuchadnezzar Trinity' },
    colors: { primaryColor: '#050505', secondaryColor: '#39ff6e' }
  },
  char_morpheus_red_pill: {
    id: 'char_morpheus_red_pill',
    heroId: 'morpheus',
    name: { fr: 'Morpheus Pilule Rouge', en: 'Red Pill Morpheus' },
    colors: { primaryColor: '#34495e', secondaryColor: '#c0392b' }
  },
  char_buckethead_bucketheadland: {
    id: 'char_buckethead_bucketheadland',
    heroId: 'buckethead_avatar',
    name: { fr: 'Bucketheadland', en: 'Bucketheadland' },
    colors: { primaryColor: '#f5f5f5', secondaryColor: '#181818' }
  },
  char_death_cube_k_shadow: {
    id: 'char_death_cube_k_shadow',
    heroId: 'death_cube_k_echo',
    name: { fr: 'Death Cube K Ombre', en: 'Death Cube K Shadow' },
    colors: { primaryColor: '#1a1a1a', secondaryColor: '#9d9d9d' }
  },
  char_pike_riff_archive: {
    id: 'char_pike_riff_archive',
    heroId: 'pike_riff_signal',
    name: { fr: 'Pike Signal Archive', en: 'Pike Signal Archive' },
    colors: { primaryColor: '#d9d9d9', secondaryColor: '#f5f5f5' }
  },
  char_soad_frontline_voice: {
    id: 'char_soad_frontline_voice',
    heroId: 'soad_vocal',
    name: { fr: 'Frontline Voice Toxicity', en: 'Toxicity Frontline Voice' },
    colors: { primaryColor: '#b03a2e', secondaryColor: '#f1c40f' }
  },
  char_soad_staccato_guitar: {
    id: 'char_soad_staccato_guitar',
    heroId: 'soad_guitar',
    name: { fr: 'Staccato Guitar Syncopé', en: 'Syncopated Staccato Guitar' },
    colors: { primaryColor: '#1c2833', secondaryColor: '#f1c40f' }
  },
  char_soad_groove_bass: {
    id: 'char_soad_groove_bass',
    heroId: 'soad_bass',
    name: { fr: 'Groove Bass Protest', en: 'Protest Groove Bass' },
    colors: { primaryColor: '#7d6608', secondaryColor: '#b03a2e' }
  },
  char_arthur_kaamelott_king: {
    id: 'char_arthur_kaamelott_king',
    heroId: 'arthur_kaamelott',
    name: { fr: 'Roi de Logres', en: 'King of Logres' },
    colors: { primaryColor: '#2f3d52', secondaryColor: '#d6b465' }
  },
  char_perceval_c_est_pas_faux: {
    id: 'char_perceval_c_est_pas_faux',
    heroId: 'perceval_kaamelott',
    name: { fr: 'Pays de Galles', en: 'Wales Knight' },
    colors: { primaryColor: '#5b7f95', secondaryColor: '#8ecae6' }
  },
  char_karadoc_vannes_ration: {
    id: 'char_karadoc_vannes_ration',
    heroId: 'karadoc_kaamelott',
    name: { fr: 'Clan de Vannes', en: 'Vannes Clan' },
    colors: { primaryColor: '#6a4a2c', secondaryColor: '#b88746' }
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
    stageId: 41001,
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
    stageId: 41002,
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
    stageId: 41003,
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
    stageId: 41004,
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
