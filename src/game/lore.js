import { EXPANDED_LORE_DB } from './expandedUniverses';
import { SOLAR_OPPOSITES_SIREN_STAR_WARS_LORE_DB } from './solarOppositesSirenStarWarsPack.js';

export const NEXUS_CANON = {
  name: { en: 'Nexus of Convergence', fr: 'Nexus de Convergence' },
  playerRole: { en: 'Anchored One', fr: 'Ancre' },
  guide: 'A.R.C.A.',
  antagonist: { en: 'The Authorless', fr: 'Le Sans-Auteur' },
  breachEvent: { en: 'First Breach', fr: 'Premiere Breche' },
  twistFigure: { en: 'Veyr, Cartographer of Ruptures', fr: 'Veyr, Cartographe des Ruptures' }
};

export const CORE_CODEX_ENTRIES = [
  {
    id: 'veil',
    category: { en: 'Foundation', fr: 'Fondation' },
    title: { en: 'The Veil', fr: 'Le Voile' },
    desc: {
      en: 'The Veil was the membrane separating each Thread of reality. Since the First Breach, it no longer closes cleanly: it frays, leaks rules, and lets impossible worlds touch.',
      fr: 'Le Voile etait la membrane qui separait chaque Trame de realite. Depuis la Premiere Breche, il ne se referme plus proprement: il s effiloche, laisse fuir les regles et permet a des mondes impossibles de se toucher.'
    }
  },
  {
    id: 'threads',
    category: { en: 'Multiverse Law', fr: 'Loi multiverselle' },
    title: { en: 'Threads', fr: 'Les Trames' },
    desc: {
      en: 'A Thread is a complete universe with an origin, internal laws, symbols, heroes, and anchor figures. Multiverse Breach never treats a crossover as random: every arrival is a damaged Thread seeking stability.',
      fr: 'Une Trame est un univers complet avec une origine, des lois internes, des symboles, des heros et des figures d ancrage. Multiverse Breach ne traite jamais un crossover comme un hasard: chaque arrivee est une Trame blessee qui cherche une stabilite.'
    }
  },
  {
    id: 'first-breach',
    category: { en: 'Cataclysm', fr: 'Cataclysme' },
    title: { en: 'The First Breach', fr: 'La Premiere Breche' },
    desc: {
      en: 'Also called the Night of a Thousand Portals, the First Breach shattered the Veil and collapsed many Threads into the Nexus of Convergence. It was not a natural disaster: someone opened the wound.',
      fr: 'Aussi appelee Nuit des Mille Portails, la Premiere Breche a fracture le Voile et projete de nombreuses Trames dans le Nexus de Convergence. Ce n etait pas une catastrophe naturelle: quelqu un a ouvert la blessure.'
    }
  },
  {
    id: 'arca',
    category: { en: 'Archive AI', fr: 'IA d archive' },
    title: { en: 'A.R.C.A.', fr: 'A.R.C.A.' },
    desc: {
      en: 'The Archive of Resonance for Anomalous Continuities records heroes, bosses, relics, and world-laws before they are rewritten. A.R.C.A. guides the player because the player signature remains unusually whole.',
      fr: 'L Archive de Resonance des Continuites Anormales enregistre les heros, boss, reliques et lois de monde avant leur reecriture. A.R.C.A. guide le joueur car sa signature reste etrangement entiere.'
    }
  },
  {
    id: 'anchored',
    category: { en: 'Player Role', fr: 'Role joueur' },
    title: { en: 'The Anchored Ones', fr: 'Les Ancres' },
    desc: {
      en: 'An Anchored One can hold several incompatible realities without dissolving. This is why the player can command displaced heroes, bind relics, and keep a coherent Nexus trace across unstable breaches.',
      fr: 'Un Ancre peut contenir plusieurs realites incompatibles sans se dissoudre. C est pour cela que le joueur peut commander des heros deplaces, lier des reliques et garder une trace Nexus coherente entre des breches instables.'
    }
  },
  {
    id: 'origin-shards',
    category: { en: 'Nexus Matter', fr: 'Matiere Nexus' },
    title: { en: 'Origin Shards', fr: 'Eclats d Origine' },
    desc: {
      en: 'Origin Shards are fragments of coherent history recovered after a breach. A.R.C.A. uses them to anchor signatures, infuse relics, engrave Nexus traces, and one day let several Anchored Ones share the same stabilized memory.',
      fr: 'Les Eclats d Origine sont des fragments d histoire coherente recuperes apres une breche. A.R.C.A. les utilise pour ancrer les signatures, infuser les reliques, graver les traces Nexus et, plus tard, permettre a plusieurs Ancres de partager une meme memoire stabilisee.'
    }
  },
  {
    id: 'compression',
    category: { en: 'Nexus Law', fr: 'Loi Nexus' },
    title: { en: 'Resonance Compression', fr: 'Compression de Resonance' },
    desc: {
      en: 'Compression of Resonance explains why legendary figures fight on equal playable scale. The Nexus reduces impossible power gaps while preserving signature abilities, roles, and weaknesses.',
      fr: 'La Compression de Resonance explique pourquoi des figures mythiques combattent a une echelle jouable commune. Le Nexus reduit les ecarts de puissance impossibles tout en preservant les capacites, roles et faiblesses signatures.'
    }
  },
  {
    id: 'personas',
    category: { en: 'Media Rule', fr: 'Regle media' },
    title: { en: 'Resonance Personas', fr: 'Personas de Resonance' },
    desc: {
      en: 'Music, web, and cultural icons appear as symbolic Resonance Personas: avatars born from collective impact, not ordinary civilians pulled into combat by accident.',
      fr: 'Les icones musicales, web et culturelles apparaissent comme des Personas de Resonance: des avatars symboliques nes de leur impact collectif, pas de simples civils tires au hasard dans le combat.'
    }
  },
  {
    id: 'authorless',
    category: { en: 'Threat', fr: 'Menace' },
    title: { en: 'The Authorless', fr: 'Le Sans-Auteur' },
    desc: {
      en: 'The Authorless is the causal pressure of Route X, the inhabited route sacrificed during the First Breach and then stripped of names by A.R.C.A. Veyr passage gave that pressure form and access to the multiverse; it did not summon an external entity. It removes meaning, origin, memory, and choice until no Thread can resist.',
      fr: 'Le Sans-Auteur est la pression causale de la Route X, route habitee sacrifiee pendant la Premiere Breche puis privee de noms par A.R.C.A. Le passage de Veyr a donne une forme et un acces multiversel a cette pression; il n a pas invoque une entite exterieure. Elle retire le sens, l origine, la memoire et le choix jusqu a ce qu aucune Trame ne puisse resister.'
    }
  },
  {
    id: 'veyr',
    category: { en: 'Hidden Truth', fr: 'Verite cachee' },
    title: { en: 'Veyr, Cartographer of Ruptures', fr: 'Veyr, Cartographe des Ruptures' },
    desc: {
      en: 'Veyr was an Archivist who tried to build a peaceful Nexus between worlds. He opened the First Breach knowing one route would fall. Route X became causal pressure when A.R.C.A. erased its names; Veyr passage gave that pressure form and access, but did not import a being from outside the multiverse.',
      fr: 'Veyr etait un Archiviste qui voulait creer un Nexus de paix entre les mondes. Il ouvrit la Premiere Breche en sachant qu une route tomberait. La Route X devint une pression causale quand A.R.C.A. effaca ses noms; le passage de Veyr donna une forme et un acces a cette pression, sans importer un etre venu de l exterieur du multivers.'
    }
  }
];

export const NARRATIVE_ACTS = [
  {
    id: 'prologue',
    title: { en: 'Prologue - The Sky Breaks', fr: 'Prologue - Le ciel se brise' },
    text: {
      en: 'A.R.C.A. detects a living signal inside the Nexus. The Anchor forms Cell ZERO and restores the first Lock of Name.',
      fr: 'A.R.C.A. detecte un signal vivant dans le Nexus. L Ancre forme la cellule ZERO et restaure le premier Verrou du Nom.'
    }
  },
  {
    id: 'arrivals',
    title: { en: 'Act I - The Lives That Arrive', fr: 'Acte I - Les vies qui arrivent' },
    text: {
      en: 'Contradictory memories and possible lives reveal how the Authorless turns regret into attractive replacements.',
      fr: 'Les memoires contradictoires et les vies possibles revelent comment le Sans-Auteur transforme le regret en remplacements seduisants.'
    }
  },
  {
    id: 'anchors',
    title: { en: 'Act II - The War of Anchors', fr: 'Acte II - La Guerre des Ancrages' },
    text: {
      en: 'The Black Ledger exposes the route sacrificed to stabilize the first anchors. A.R.C.A. must acknowledge its debt instead of turning it into a weapon.',
      fr: 'Le Registre noir expose la route sacrifiee pour stabiliser les premiers ancrages. A.R.C.A. doit reconnaitre sa dette au lieu d en faire une arme.'
    }
  },
  {
    id: 'archives',
    title: { en: 'Act III - The Impossible Archives', fr: 'Acte III - Les Archives Impossibles' },
    text: {
      en: 'Perfect portals offer lives without failure. Cell ZERO preserves the only causal passage because it still carries names, losses, and contradictions.',
      fr: 'Les portails parfaits offrent des vies sans echec. La cellule ZERO conserve le seul passage causal parce qu il transporte encore noms, pertes et contradictions.'
    }
  },
  {
    id: 'white-void',
    title: { en: 'Act IV - The White Void', fr: 'Acte IV - Le Vide Blanc' },
    text: {
      en: 'The Authorless takes form at the White Threshold. The Anchor records and bounds it rather than repeating the original erasure; its first coordinate reveals Route X.',
      fr: 'Le Sans-Auteur prend forme au Seuil blanc. L Ancre l inscrit et le limite au lieu de repeter l effacement originel; sa premiere coordonnee revele la Route X.'
    }
  },
  {
    id: 'primordial',
    title: { en: 'Act V - The Primordial Breach', fr: 'Acte V - La Breche Primordiale' },
    text: {
      en: 'Route X recovers its names, Veyr and A.R.C.A. answer for their distinct decisions, and the squad reaches the first wound to choose whether to seal, converge, break, or surrender the multiverse.',
      fr: 'La Route X retrouve ses noms, Veyr et A.R.C.A. repondent de leurs decisions distinctes, puis l escouade atteint la premiere blessure et choisit entre sceller, faire converger, rompre ou abandonner le multivers.'
    }
  }
];

export const LORE_DB = {
  'Nexus de Convergence': {
    mediaType: 'game',
    title: { en: 'Nexus of Convergence', fr: 'Nexus de Convergence' },
    desc: {
      en: 'Stable hub formed after the First Breach. It is not a normal universe, but the Atrium where Anchored Ones, A.R.C.A., displaced heroes, and recovered Origin Shards can coexist without immediate collapse.',
      fr: 'Hub stable forme apres la Premiere Breche. Ce n est pas un univers normal, mais l Atrium ou les Ancres, A.R.C.A., les heros deplaces et les Eclats d Origine recuperes peuvent coexister sans effondrement immediat.'
    }
  },
  'Gears of War': {
    mediaType: 'game',
    title: { en: 'Gears of War', fr: 'Gears of War' },
    desc: {
      en: 'A war-torn industrial planet, Sera, devastated by the subterranean Locust Horde threat.',
      fr: 'Une planète industrielle ravagée par la guerre contre la Horde de Locustes souterraines.'
    }
  },
  'Halo': {
    mediaType: 'game',
    title: { en: 'Halo', fr: 'Halo' },
    desc: {
      en: 'A military science-fiction universe where the UNSC fights the Covenant across ancient Forerunner ringworlds, while the Flood and the true purpose of the Halo array threaten every living civilization.',
      fr: 'Un univers de science-fiction militaire ou l UNSC affronte le Covenant sur d anciens anneaux Forerunner, tandis que le Parasite et la vraie fonction du reseau Halo menacent toute civilisation vivante.'
    }
  },
  'Alien': {
    mediaType: 'movie',
    title: { en: 'Alien', fr: 'Alien' },
    desc: {
      en: 'Deep-space sci-fi horror centered around Weyland-Yutani and the lethal Xenomorphs.',
      fr: 'Horreur de science-fiction spatiale centrée sur Weyland-Yutani et les Xenomorphes.'
    }
  },
  'Predator': {
    mediaType: 'movie',
    title: { en: 'Predator', fr: 'Predator' },
    desc: {
      en: 'An interstellar clan of honorable trophy hunters stalking deadly prey.',
      fr: 'Un clan de chasseurs extraterrestres honorables traquant les proies les plus dangereuses.'
    }
  },
  'Resident Evil': {
    mediaType: 'game',
    title: { en: 'Resident Evil', fr: 'Resident Evil' },
    desc: {
      en: 'A survival-horror universe shaped by Umbrella Corporation experiments, Raccoon City outbreak, T-Virus and G-Virus contamination, scarce resources, locked routes, and bio-organic weapons such as Lickers, Tyrants, Nemesis, and William Birkin mutations.',
      fr: 'Un univers survival-horror faconne par les experiences d Umbrella Corporation, l epidemie de Raccoon City, les contaminations T-Virus et G-Virus, les ressources rares, les routes verrouillees et les armes bio-organiques comme les Lickers, les Tyrants, Nemesis et les mutations de William Birkin.'
    }
  },
  'Silent Hill': {
    mediaType: 'game',
    title: { en: 'Silent Hill', fr: 'Silent Hill' },
    desc: {
      en: 'A psychological survival-horror universe where the town of Silent Hill reshapes guilt, grief, trauma, cult ritual, and buried truth into fog streets, rust Otherworld cycles, symbolic monsters, sirens, radios, and personal trials that cannot be solved by violence alone.',
      fr: 'Un univers survival-horror psychologique ou la ville de Silent Hill transforme culpabilite, deuil, trauma, rituel de culte et verite enfouie en rues de brouillard, cycles Otherworld rouilles, monstres symboliques, sirenes, radios parasites et proces personnels qui ne se resolvent pas seulement par la violence.'
    }
  },
  'Dino Crisis': {
    mediaType: 'game',
    title: { en: 'Dino Crisis', fr: 'Dino Crisis' },
    desc: {
      en: 'A survival-action universe where Third Energy research on Ibis Island and later temporal disasters around Edward City tear prehistoric predators into modern facilities, forcing SORT and TRAT operatives to balance infiltration, key-card routes, scarce supplies, dinosaur pursuit, and scientific containment.',
      fr: 'Recherches sur la Troisième Énergie ouvrant des failles temporelles remplies de dinosaures.'
    }
  },
  'The Matrix': {
    mediaType: 'movie',
    title: { en: 'The Matrix', fr: 'The Matrix' },
    desc: {
      en: 'A cyberpunk universe where humanity is imprisoned inside a machine-made simulation while Zion resists underground, operators jack free minds into the Matrix, Agents enforce control, rogue programs exploit causality, and the Source turns prophecy, choice, and rebellion into system-level conflict.',
      fr: 'Un univers cyberpunk ou l humanite est enfermee dans une simulation creee par les Machines pendant que Zion resiste sous terre, les operateurs connectent les esprits libres, les Agents maintiennent le controle, les programmes exiles manipulent la causalite et la Source transforme prophetie, choix et rebellion en conflit systeme.'
    }
  },
  'Stargate': {
    mediaType: 'series',
    title: { en: 'Stargate', fr: 'Stargate' },
    desc: {
      en: 'A military exploration universe where the SGC uses an Ancient Stargate network to reach alien worlds, confront Goa uld false gods, protect Earth with the iris, ally with free Jaffa, study naquadah and Ancient technology, and survive threats like Replicators and Anubis.',
      fr: 'Un univers d exploration militaire ou le SGC utilise le reseau de Portes des Anciens pour atteindre d autres mondes, affronter les faux dieux Goa uld, proteger la Terre avec l iris, s allier aux Jaffa libres, etudier le naquadah et survivre aux Replicateurs comme a Anubis.'
    }
  },
  'Half-Life': {
    mediaType: 'game',
    title: { en: 'Half-Life', fr: 'Half-Life' },
    desc: {
      en: 'A science-fiction disaster universe born from Black Mesa resonance cascade: Xen creatures, HEV survival, HECU cleanup, G-Man manipulation, Resistance cells, and Combine occupation turn one experiment into a planetary rupture.',
      fr: 'Un univers de catastrophe science-fiction ne de la cascade de resonance de Black Mesa: creatures de Xen, survie HEV, intervention HECU, manipulation du G-Man, cellules de Resistance et occupation Combine transforment une experience en rupture planetaire.'
    }
  },
  'Portal': {
    mediaType: 'game',
    title: { en: 'Portal', fr: 'Portal' },
    desc: {
      en: 'Aperture Science quantum testing loops monitored by the passive-aggressive AI GLaDOS.',
      fr: 'Salles de tests d\'Aperture Science gérées par l\'IA passive-agressive GLaDOS.'
    }
  },
  'Metal Gear': {
    mediaType: 'game',
    title: { en: 'Metal Gear', fr: 'Metal Gear' },
    desc: {
      en: 'Tactical espionage stealth operations against giant nuclear weapon mechs.',
      fr: 'Opérations d\'infiltration tactique contre des méchas nucléaires bipèdes.'
    }
  },
  'Payday': {
    mediaType: 'game',
    title: { en: 'Payday', fr: 'Payday' },
    desc: {
      en: 'A notorious mask-wearing crew conducting high-stakes robberies and bank heists.',
      fr: 'Un gang de braqueurs masqués effectuant des casses de banques spectaculaires.'
    }
  },
  'Vocaloid': {
    mediaType: 'manga',
    title: { en: 'Vocaloid', fr: 'Vocaloid' },
    desc: {
      en: 'Synthesized voice music idols performing on virtual holographic neon stages.',
      fr: 'Idoles de chant synthétisé performant sur des scènes holographiques néon.'
    }
  },
  'Yu-Gi-Oh': {
    mediaType: 'manga',
    title: { en: 'Yu-Gi-Oh', fr: 'Yu-Gi-Oh' },
    desc: {
      en: 'Ancient Egyptian magic manifest through modern trading card duel monsters.',
      fr: 'La magie de l\'Égypte ancienne manifestée à travers des cartes de duels de monstres.'
    }
  },
  'Guilty Gear': {
    mediaType: 'game',
    title: { en: 'Guilty Gear', fr: 'Guilty Gear' },
    desc: {
      en: 'High-octane magical brawls in a future shaped by living biological weapons.',
      fr: 'Combats magiques intenses dans un futur façonné par des armes biologiques vivantes.'
    }
  },
  'BlazBlue': {
    mediaType: 'game',
    title: { en: 'BlazBlue', fr: 'BlazBlue' },
    desc: {
      en: 'A magical technological loop centered around the Grimoires and the Boundary.',
      fr: 'Une boucle temporelle magico-technologique centrée sur les Grimoires et la Frontière.'
    }
  },
  'Slender Man': {
    mediaType: 'manga',
    title: { en: 'Slender Man', fr: 'Slender Man' },
    desc: {
      en: 'A tall, faceless entity in a suit stalking and abducting victims in dark woods.',
      fr: 'Une entité longiligne sans visage traquant ses victimes dans les bois sombres.'
    }
  },
  'Chucky': {
    mediaType: 'movie',
    title: { en: 'Chucky', fr: 'Chucky' },
    desc: {
      en: 'Charles Lee Ray transfers his soul into a Good Guy doll through Damballa voodoo, later splitting it across distinct dolls. Tiffany Valentine, Tiffany doll bodies and Jennifer Tilly remain separate identities, while the 2019 Buddi remake is an independent artificial-intelligence continuity. The leather-jacket bride and all-black human looks are canon-inspired 1998 Tiffany variants; dark-haired Wedding Belle, burned bald Tiffany, Street Siren, Synthetic Doll, Leather Mistress, Voluptuous Original and the two-piece swimwear forms are explicitly non-canon Nexus AU costumes for fictional Tiffany.',
      fr: 'Charles Lee Ray transfere son ame dans une poupee Good Guy par le vaudou de Damballa, puis la divise entre plusieurs corps distincts. Tiffany Valentine, les corps de poupee Tiffany et Jennifer Tilly restent des identites separees, tandis que le Buddi du remake de 2019 appartient a une continuite independante fondee sur une intelligence artificielle. La mariee a veste en cuir et la Tiffany humaine tout en noir sont des variantes inspirees du canon 1998; Dark-Haired Wedding Belle, Tiffany brulee et chauve, Street Siren, Synthetic Doll, Leather Mistress, Voluptuous Original et les formes en maillot deux pieces sont explicitement des costumes Nexus AU non canoniques pour la Tiffany fictive.'
    }
  },
  'Hellraiser': {
    mediaType: 'movie',
    title: { en: 'Hellraiser', fr: 'Hellraiser' },
    desc: {
      en: 'Lemarchand configurations open Leviathans Labyrinth, where distinct Cenobite orders interpret desire, sensation, transformation, and loss as ritual bargains.',
      fr: 'Les configurations de Lemarchand ouvrent le Labyrinthe de Leviathan, ou plusieurs ordres cenobites interpretent desir, sensation, transformation et perte comme des pactes rituels.'
    }
  },
  'Mass Effect': {
    mediaType: 'game',
    title: { en: 'Mass Effect', fr: 'Mass Effect' },
    desc: {
      en: 'A galaxy-wide space opera defending organic life from the machine Reapers.',
      fr: 'Un space-opera galactique défendant les organiques contre les machines Moissonneurs.'
    }
  },
  'Fallout': {
    mediaType: 'game',
    title: { en: 'Fallout', fr: 'Fallout' },
    desc: {
      en: 'A retro-futuristic post-apocalyptic nuclear wasteland survival world.',
      fr: 'Un monde rétro-futuriste post-apocalyptique ravagé par la guerre nucléaire.'
    }
  },
  'Doom': {
    mediaType: 'game',
    title: { en: 'Doom', fr: 'Doom' },
    desc: {
      en: 'Hellish portals on Mars producing waves of demons crushed by the Doom Slayer.',
      fr: 'Des portails infernaux s\'ouvrant sur Mars, terrassés par le Doom Slayer.'
    }
  },
  'Unreal': {
    mediaType: 'game',
    title: { en: 'Unreal Tournament', fr: 'Unreal Tournament' },
    desc: {
      en: 'Galactic blood sport tournaments featuring high-velocity weapons.',
      fr: 'Tournois de combats sanglants galactiques avec des armes à haute vélocité.'
    }
  },
  'Harry Potter': {
    mediaType: 'manga',
    title: { en: 'Harry Potter', fr: 'Harry Potter' },
    desc: {
      en: 'A secret wizarding world fighting the dark forces of Voldemort.',
      fr: 'Un monde secret de sorcellerie combattant les forces obscures de Voldemort.'
    }
  },
  'Star Wars': {
    mediaType: 'movie',
    title: { en: 'Star Wars', fr: 'Star Wars' },
    desc: {
      en: 'A space conflict between the Jedi Knights and the Sith Lords.',
      fr: 'Un conflit spatial galactique opposant les Chevaliers Jedi aux Seigneurs Sith.'
    }
  },
  'Le Cinquième Element': {
    mediaType: 'movie',
    title: { en: 'The Fifth Element', fr: 'Le Cinquième Élément' },
    desc: {
      en: 'A colorful future defending the universe from the Ultimate Cosmic Evil.',
      fr: 'Un futur coloré défendant l\'univers contre le Mal Cosmique Suprême.'
    }
  },
  'Scary Movie': {
    mediaType: 'movie',
    title: { en: 'Scary Movie', fr: 'Scary Movie' },
    desc: {
      en: 'A hilarious parody franchise spoofing popular horror movies.',
      fr: 'Une franchise de parodies hilarantes tournant en dérision les films d\'horreur.'
    }
  },
  'Dead Space': {
    mediaType: 'game',
    title: { en: 'Dead Space', fr: 'Dead Space' },
    desc: {
      en: 'An industrial space miner fighting mutated Necromorphs spawned by Marker signals.',
      fr: 'Un ingénieur spatial combattant des Nécromorphes mutants générés par le Monolithe.'
    }
  },
  'Rick & Morty': {
    mediaType: 'movie',
    title: { en: 'Rick & Morty', fr: 'Rick & Morty' },
    desc: {
      en: 'Crazed multiversal dimension hopping adventures of a cynical scientist and his grandson.',
      fr: 'Les aventures dimensionnelles d\'un scientifique cynique et de son petit-fils.'
    }
  },
  'Digital Circus': {
    mediaType: 'movie',
    title: { en: 'The Amazing Digital Circus', fr: 'The Amazing Digital Circus' },
    desc: {
      en: 'Humans trapped in a whimsical yet distressing digital virtual reality circus.',
      fr: 'Des humains piégés dans un cirque virtuel de réalité numérique loufoque.'
    }
  },
  'Digimon': {
    mediaType: 'game',
    title: { en: 'Digimon', fr: 'Digimon' },
    desc: {
      en: 'Digital monsters bred in the internet networking parallel world.',
      fr: 'Des monstres numériques élevés dans le monde virtuel parallèle du réseau internet.'
    }
  },
  'Saw': {
    mediaType: 'movie',
    title: { en: 'Saw', fr: 'Saw' },
    desc: {
      en: 'Moral testing traps designed by the Jigsaw killer to value human life.',
      fr: 'Des pièges moraux mortels conçus par le tueur au puzzle pour évaluer la volonté de vivre.'
    }
  },
  'Rosario + Vampire': {
    mediaType: 'manga',
    title: { en: 'Rosario + Vampire', fr: 'Rosario + Vampire' },
    desc: {
      en: 'A human boy accidentally enrolling in a boarding school for Yokai monsters.',
      fr: 'Un garçon humain inscrit par erreur dans un lycée secret pour monstres Yokai.'
    }
  },
  'Negima': {
    mediaType: 'manga',
    title: { en: 'Negima!', fr: 'Negima!' },
    desc: {
      en: 'A child wizard tutor training class 3-A in magic and fighting off dark mages.',
      fr: 'Un enfant magicien enseignant à la classe 3-A et combattant des mages noirs.'
    }
  },
  'Ghost in the Shell': {
    mediaType: 'manga',
    title: { en: 'Ghost in the Shell', fr: 'Ghost in the Shell' },
    desc: {
      en: 'Cybernetic counter-terrorism Section 9 chasing cyber-brain hackers.',
      fr: 'La Section 9 cyber-antiterroriste traquant les pirates de cyber-cerveaux.'
    }
  },
  'Mad Max': {
    mediaType: 'movie',
    title: { en: 'Mad Max', fr: 'Mad Max' },
    desc: {
      en: 'A desolate apocalyptic desert wasteland ruled by high-speed vehicular gangs.',
      fr: 'Un désert apocalyptique gouverné par des gangs motorisés de bolides armés.'
    }
  }
};

Object.assign(LORE_DB, EXPANDED_LORE_DB, SOLAR_OPPOSITES_SIREN_STAR_WARS_LORE_DB);
