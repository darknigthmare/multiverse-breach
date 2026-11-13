// Mr. Bean — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createBean() {
  return (Object.freeze({
  key: 'mr_bean',
  universe: 'Mr. Bean',
  url: 'https://www.youtube.com/@MrBean'
}));
}

export function createMrBean({ BEAN, character, definePack, event, gear, lore, stageMeta, stageVariant, threat }) {
  return (definePack(BEAN, {
  aliases: ['Mr Bean Classic'],
  mediaType: 'live-action-comedy',
  faction: 'cyber',
  mode: 'Tactics',
  difficulty: 'Medium',
  colors: ['#7c7765', '#181b17', '#9a332e'],
  motif: 'street',
  theme: 'silent physical comedy, improvised solutions, Teddy, Irma, the Mini and escalating everyday chain reactions',
  continuity: '1990–1995 live-action Mr. Bean television series only',
  adaptationRule: 'No person becomes a villain. Encounters are clocks, rooms, props and Bean-created chain reactions, all labelled comedy abstractions.',
  visualAnchor: 'Live-action classic Mr. Bean silhouette: brown tweed jacket, white shirt, red tie, brown trousers, black hair and expressive brows; green Mini and small dark Teddy as props.',
  canonStatus: 'classic-series adaptation with transparent comedy hazards',
  lore: lore('Mr. Bean, Teddy et Irma traversent des situations ordinaires dont les solutions improvisées deviennent des puzzles du Nexus.', 'Mr. Bean, Teddy and Irma cross ordinary situations whose improvised solutions become Nexus puzzles.'),
  referenceUrls: [BEAN.url, 'https://www.youtube.com/@MrBean/videos', 'https://mrbean.fr/en/irma-gobb', 'https://en.wikipedia.org/wiki/List_of_Mr._Bean_episodes'],
  hero: character(BEAN, 'bean', 'Mr. Bean', 'hacker', 'Classic live-action brown tweed jacket, white shirt, narrow red tie, brown trousers, black side-parted hair and highly expressive eyebrows; no animated-series proportions.', lore('Bean résout chaque problème par une méthode imprévisible mais souvent efficace.', 'Bean solves each problem through an unpredictable but often effective method.'), 'canonical live-action character', { simple: 'Improvised Nudge', secondary: 'Mini Shortcut', defense: 'Act Innocent', special: 'Bean Chain Reaction' }),
  allies: [
    character(BEAN, 'teddy', 'Teddy', 'tactical', 'Small dark-brown classic Teddy with mismatched button-like eyes, thin limbs and worn fabric; preserve live-action prop scale.', lore('Teddy est le compagnon le plus fidèle de Bean et reste un soutien, jamais une cible.', 'Teddy is Bean’s most faithful companion and remains support, never a target.'), 'canonical live-action prop character', { simple: 'Teddy Toss', secondary: 'Picnic Signal', defense: 'Drawer Hide', special: 'Best Friend Focus' }),
    character(BEAN, 'irma', 'Irma Gobb', 'tactical', 'Live-action Irma Gobb with curled auburn-to-light-brown hair, large round glasses, a blue floral early-1990s dress and an original non-photoreal face respecting Matilda Ziegler’s costume silhouette.', lore('Irma apporte le bon sens que Bean oublie souvent.', 'Irma provides the common sense Bean often forgets.'), 'canonical live-action character', { referenceUrl: 'https://mrbean.fr/en/irma-gobb', simple: 'Firm Reminder', secondary: 'Library Plan', defense: 'Teddy Rescue', special: 'Common-Sense Reset' })
  ],
  monsters: [
    threat(BEAN, 'exam_clock', 'Exam Clock', 'countdown pressure', 'Last-Second Bell', 'Oversized original analogue school clock above a neat exam desk, rendered as a prop hazard with no face.', lore('L’horloge condense la panique de l’examen du premier épisode.', 'The clock condenses the first episode’s exam panic.'), 'canon-scene gameplay abstraction'),
    threat(BEAN, 'laundry_machine', 'Laundry Machine', 'spinning mixed load', 'Colour Mix-up', '1990s front-loading laundrette machine, tumbling shirts and one tiny sock, no brand or creature features.', lore('La machine reprend le chaos de la laverie sans transformer les clients en ennemis.', 'The machine returns the laundrette chaos without making customers into enemies.'), 'canon-scene gameplay abstraction'),
    threat(BEAN, 'christmas_turkey', 'Christmas Turkey', 'stuck-prop scramble', 'Stuffing Surprise', 'Large uncooked Christmas turkey on a kitchen tray, handled as a slapstick prop with no gore or monster anatomy.', lore('La dinde rappelle le célèbre incident de Noël de Bean.', 'The turkey recalls Bean’s famous Christmas incident.'), 'canonical comedy prop')
  ],
  bosses: [
    threat(BEAN, 'room_426', 'Room 426 Scramble', 'hotel-rule puzzle', 'Wall-to-Wall Shortcut', 'Original 1990s hotel room with adjoining wall, bed, suitcase and service trolley arranged as a puzzle, no human opponent.', lore('La chambre d’hôtel devient un puzzle d’accès et de discrétion.', 'The hotel room becomes an access-and-stealth puzzle.'), 'canon-episode gameplay abstraction'),
    threat(BEAN, 'premiere_queue', 'Royal Premiere Queue', 'formal-etiquette sequence', 'Handshake Panic', 'Red-carpet queue, velvet ropes and bright premiere lights with all guests represented as neutral silhouettes.', lore('La file de la première teste l’étiquette de Bean sans désigner la reine ni les invités comme adversaires.', 'The premiere queue tests Bean’s etiquette without casting the Queen or guests as opponents.'), 'canon-scene gameplay abstraction'),
    threat(BEAN, 'nativity_mixup', 'Department Store Nativity Mix-up', 'toy-display rearrangement', 'Dalek Diversion', 'Department-store toy nativity display assembled from generic unbranded figures and one original sci-fi toy silhouette.', lore('Le rayon de jouets devient un puzzle de mise en scène burlesque.', 'The toy department becomes a slapstick staging puzzle.'), 'canon-scene gameplay abstraction')
  ],
  worldBoss: threat(BEAN, 'paint_bomb_chain', 'Do-It-Yourself Paint-Bomb Chain Reaction', 'exploding paint-can renovation', 'One-Stroke Finale', 'Bean’s flat covered for New Year renovation, white paint can rigged to an original firework-like mechanism, newspaper silhouettes and the green Mini safely outside.', lore('La rénovation de Nouvel An devient une réaction en chaîne à résoudre ; aucun voisin n’est présenté comme méchant.', 'The New Year renovation becomes a chain reaction to solve; no neighbour is presented as a villain.'), 'canon-scene world-boss abstraction', { layout: 'stationary', objective: 'Complete the one-stroke renovation, contain the paint burst and leave the flat presentable.', objectiveFr: 'Achever la rénovation d’un seul geste, contenir l’explosion de peinture puis laisser l’appartement présentable.' }),
  stage: 'Exam Hall — The Curse of Mr. Bean',
  stageMeta: stageMeta(BEAN, 'Early-1990s British exam hall with separate wooden desks, envelopes and an analogue clock; neutral invigilator silhouettes.', 'La salle reprend l’examen du premier épisode.', 'The hall returns to the first episode’s exam.', 'canon-episode-inspired fan stage'),
  stageVariants: [
    stageVariant('Tactics', 'Hotel Room 426', 'Hard', 'Room 426 Scramble', stageMeta(BEAN, 'Classic British hotel corridor and compact room with brass number 426, service trolley and muted floral wallpaper.', 'La variante suit la chambre 426.', 'The variant follows Room 426.', 'canon-episode-inspired fan stage')),
    stageVariant('Smash', 'New Year Flat Renovation', 'Hard', 'Do-It-Yourself Paint-Bomb Chain Reaction', stageMeta(BEAN, 'Bean’s compact live-action flat wrapped in newspaper for a white-paint renovation, preserving practical 1990s props.', 'Le décor prépare la rénovation de Nouvel An.', 'The set prepares the New Year renovation.', 'canon-episode-inspired fan stage'))
  ],
  gear: [
    gear(BEAN, 'mini_keys', 'Mini Keys', 'Clés de la Mini', { spd: 2, atk: 4 }, 'Simple metal keys with an original green Mini-shaped fob and no marque badge.', lore('Les clés ouvrent les raccourcis automobiles de Bean.', 'The keys open Bean’s automotive shortcuts.'), 'canon-inspired prop'),
    gear(BEAN, 'tweed_jacket', 'Tweed Jacket', 'Veste en tweed', { def: 7, hp: 45 }, 'Folded brown tweed jacket, white cuff and narrow red tie, matching the classic live-action costume.', lore('La veste fixe la continuité classique.', 'The jacket locks the classic continuity.')),
    gear(BEAN, 'picnic_basket', 'Picnic Basket', 'Panier de pique-nique', { hp: 70, def: 3 }, 'Plain wicker picnic basket with sandwich, thermos and folded checked cloth; no brand marks.', lore('Le panier transforme les petits objets en solutions improvisées.', 'The basket turns small objects into improvised solutions.'), 'canon-inspired prop')
  ],
  event: event(BEAN, 'improvised_solution', 'Improvised Solution', 'Solution improvisée', 'Bean links harmless props into an absurd mechanism that clears every puzzle lane.', 'Bean relie des accessoires inoffensifs dans un mécanisme absurde qui résout chaque couloir-puzzle.', 'Tweed sleeve, Mini key, Teddy and a chain of practical household props arranged like a Rube Goldberg device.', 'canon-style comedy event')
}));
}
