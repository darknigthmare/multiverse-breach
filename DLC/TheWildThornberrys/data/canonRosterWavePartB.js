// The Wild Thornberrys — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createThornberrys() {
  return (Object.freeze({
  key: 'wild_thornberrys',
  universe: 'The Wild Thornberrys',
  url: 'https://www.paramountpictures.com/movies/the-wild-thornberrys-movie'
}));
}

export function createWildThornberrys({ THORNBERRYS, character, definePack, event, gear, lore, stageMeta, stageVariant, threat }) {
  return (definePack(THORNBERRYS, {
  aliases: ['Wild Thornberrys'],
  mediaType: 'animated-series-film',
  faction: 'tactical',
  mode: 'Tactics',
  difficulty: 'Hard',
  colors: ['#d18a32', '#24451f', '#75b75b'],
  motif: 'savanna',
  theme: 'Eliza’s animal speech, Darwin and Donnie, wildlife rescue, the ComVee and opposition to human poachers',
  continuity: 'Nickelodeon animated series with The Wild Thornberrys Movie poacher continuity',
  adaptationRule: 'Every animal and Pandoran-style fauna equivalent remains neutral or allied. Only confirmed human poachers, their crews and traps occupy enemy slots.',
  visualAnchor: 'Late-1990s Klasky Csupo-style angular animation, Eliza with red pigtails, round glasses and braces, Darwin in striped shirt, Donnie in leopard shorts; warm savanna palette.',
  canonStatus: 'series-and-film rescue adaptation',
  lore: lore('Eliza, Darwin et Donnie libèrent des animaux capturés tandis que des braconniers humains ferment les voies de migration.', 'Eliza, Darwin and Donnie free captured animals while human poachers close migration routes.'),
  referenceUrls: [THORNBERRYS.url, 'https://en.wikipedia.org/wiki/The_Wild_Thornberrys'],
  hero: character(THORNBERRYS, 'eliza', 'Eliza Thornberry', 'tactical', 'Eliza in series look: red pigtails, round glasses, braces, yellow-orange dress over green leggings and small field pack; no combat armour.', lore('Eliza comprend les animaux et organise leur sauvetage sans les envoyer contre leur habitat.', 'Eliza understands animals and organises their rescue without turning them against their habitat.'), 'canonical protagonist', { simple: 'Rescue Signal', secondary: 'Animal Translation', defense: 'Field Dodge', special: 'Migration Call' }),
  allies: [
    character(THORNBERRYS, 'darwin', 'Darwin', 'hacker', 'Darwin the chimpanzee in his exact red-and-white striped shirt and blue shorts, angular cartoon anatomy and expressive face.', lore('Darwin traduit les dangers du monde humain à sa manière anxieuse.', 'Darwin interprets human-world dangers in his anxious way.'), 'canonical animal ally', { simple: 'Branch Swing', secondary: 'Warning Chatter', defense: 'Quick Climb', special: 'Darwin Diversion' }),
    character(THORNBERRYS, 'donnie', 'Donnie Thornberry', 'slayer', 'Small wild child with spiky blond hair, leopard-print shorts and loose-limbed series animation; no shoes, weapons or added tribal markings.', lore('Donnie ouvre les cages et traverse le camp avec son énergie sauvage.', 'Donnie opens cages and crosses the camp with wild energy.'), 'canonical protagonist', { simple: 'Wild Dash', secondary: 'Cage-Key Snatch', defense: 'Jungle Roll', special: 'Donnie Stampede Diversion' })
  ],
  monsters: [
    threat(THORNBERRYS, 'kip_poacher_net_team', 'Kip Poacher Net Team', 'capture nets', 'Net-Line Sweep', 'Original human poacher scouts in practical khaki field clothes carrying folded capture nets; no animal body parts or fantasy trophies.', lore('Une équipe humaine de braconniers de Kip tend des filets sur la migration.', 'A human poacher team working for Kip lays nets across the migration.'), 'canon-derived human poacher crew'),
    threat(THORNBERRYS, 'neil_biederman_truck_crew', 'Neil Biederman Poacher Truck Crew', 'cage truck and spotlights', 'Headlight Pin', 'Original human poacher drivers beside an unbranded cage truck and field spotlights, in the series’ angular animation style.', lore('L’équipe humaine de Biederman bloque la piste avec un camion-cage.', 'Biederman’s human crew blocks the trail with a cage truck.'), 'canon-derived human poacher crew'),
    threat(THORNBERRYS, 'blackburn_poacher_guard', 'Blackburn Poacher Camp Guard', 'tranquiliser launcher', 'Camp Alarm', 'Original adult human Blackburn poacher guard in neutral safari clothing with a clearly fictional tranquiliser tool and radio; no animal antagonist.', lore('Un garde humain du camp Blackburn protège les cages de guépards.', 'A human Blackburn camp guard protects the cheetah cages.'), 'movie-derived human poacher crew')
  ],
  bosses: [
    threat(THORNBERRYS, 'kip_odonnell', "Kip O'Donnell", 'poaching equipment and schemes', 'Poacher’s Prowl', 'Series-accurate very tall bald human poacher in camouflage garb and matching sun hat, round-frame sunglasses, British-style moustache, one wooden peg leg and one boot; preserve angular cartoon proportions and add no animal mutation.', lore('Kip est un braconnier récurrent et l’ennemi juré des Thornberry.', 'Kip is a recurring poacher and sworn enemy of the Thornberrys.'), 'canonical human poacher'),
    threat(THORNBERRYS, 'neil_biederman', 'Neil Biederman', 'capture cages and vehicle traps', 'Biederman Blockade', 'Series-accurate heavyset, comparatively short human Neil Biederman with styled brown hair, rectangular sunglasses, green field outfit and black boots; preserve angular cartoon proportions and add no animal traits.', lore('Neil Biederman participe aux enlèvements d’animaux avec Kip.', 'Neil Biederman joins Kip in animal kidnappings.'), 'canonical human poacher'),
    threat(THORNBERRYS, 'bree_blackburn', 'Bree Blackburn', 'movie poacher deception', 'Cheetah-Decoy Trap', 'Movie-accurate adult human Bree Blackburn with long dark-purple hair tied back by a red band, thin angular face, pale tank top under a tan utility vest and composed veterinarian-expedition posture; no weapon trophy or animal redesign.', lore('Bree dissimule l’opération de braconnage des Blackburn derrière une expédition.', 'Bree hides the Blackburn poaching operation behind an expedition.'), 'canonical movie human poacher')
  ],
  worldBoss: threat(THORNBERRYS, 'sloan_blackburn', 'Sloan Blackburn', 'coordinated cheetah-poaching operation', 'Migration Valley Ambush', 'Movie-accurate adult human Sloan Blackburn with shaggy dirty-blond hair, narrow goatee, very long hooked nose and dark olive expedition jumpsuit with diagonal utility harness, field radio and vehicle map; rendered in the film’s angular style while all cheetahs remain allied.', lore('Sloan dirige le plan visant les guépards et devient la cible humaine finale du sauvetage.', 'Sloan leads the plot against the cheetahs and becomes the rescue’s final human target.'), 'canonical movie human poacher', { layout: 'duelist', objective: 'Expose Sloan’s poaching operation, open every cage and escort the cheetahs to the migration route.' }),
  stage: 'Savanna Poacher Rescue Camp',
  stageMeta: stageMeta(THORNBERRYS, 'Angular animated East African savanna camp with canvas tents, empty cages, ComVee rescue lane and free cheetahs kept outside enemy positions.', 'Le camp organise le sauvetage des animaux capturés.', 'The camp structures the rescue of captured animals.', 'series-and-film-inspired rescue stage'),
  stageVariants: [
    stageVariant('Tactics', 'Kip and Biederman Jungle Trapline', 'Hard', "Kip O'Donnell", stageMeta(THORNBERRYS, 'Dense angular cartoon jungle with dismantlable human nets, empty cages and a clear animal escape route.', 'La piste reprend les pièges des deux braconniers récurrents.', 'The trail returns to the recurring poachers’ traps.', 'series-inspired rescue stage')),
    stageVariant('Smash', 'Blackburn Cheetah Valley', 'Very Hard', 'Sloan Blackburn', stageMeta(THORNBERRYS, 'Wide animated valley from the movie rescue premise, distant migration herd, human vehicles and an unobstructed safe corridor.', 'La vallée préserve les guépards comme alliés à évacuer.', 'The valley keeps the cheetahs as allies to evacuate.', 'movie-inspired rescue stage'))
  ],
  gear: [
    gear(THORNBERRYS, 'field_notebook', 'Eliza’s Field Notebook', 'Carnet de terrain d’Eliza', { spd: 2, def: 4 }, 'Small worn field notebook with original animal-track sketches and no readable copyrighted text.', lore('Eliza note les pistes et les besoins des animaux.', 'Eliza records tracks and animal needs.'), 'canon-inspired prop'),
    gear(THORNBERRYS, 'comvee_radio', 'ComVee Rescue Radio', 'Radio de secours du ComVee', { hp: 45, def: 6 }, 'Rugged original handheld radio in olive and yellow, visually tied to the ComVee without logos.', lore('La radio coordonne Marianne, Nigel et les enfants.', 'The radio coordinates Marianne, Nigel and the children.'), 'canon-inspired prop'),
    gear(THORNBERRYS, 'cage_keyring', 'Poacher Cage Keyring', 'Trousseau des cages', { spd: 3, atk: 3 }, 'Plain ring of differently shaped cage keys with a broken human-made padlock, no animal materials.', lore('Le trousseau libère les animaux sans les transformer en combattants forcés.', 'The keyring frees animals without forcing them into combat.'), 'gameplay rescue prop')
  ],
  event: event(THORNBERRYS, 'animal_rescue', 'Animal Rescue Corridor', 'Couloir de sauvetage animal', 'Eliza opens a safe route; freed wildlife leaves the combat grid while the human poacher gear shuts down.', 'Eliza ouvre une voie sûre ; la faune libérée quitte la grille tandis que le matériel des braconniers humains s’arrête.', 'Eliza’s glasses, open empty cage, ComVee light and animal tracks leading safely away from combat.', 'franchise-faithful rescue event')
}));
}
