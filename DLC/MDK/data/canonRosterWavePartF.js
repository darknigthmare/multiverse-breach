// MDK — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMdk() {
  return (Object.freeze({ key: 'mdk', universe: 'MDK', url: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/38460/manuals/Manual%20-%20English.pdf' }));
}

export function createMdk2({ MDK, definePack, stageVariant }) {
  return (definePack(MDK, {
  aliases: ['MDR', 'MDK franchise', 'MDK 2'],
  mediaType: 'video-game', faction: 'sciFi', mode: 'RPG', difficulty: 'Very Hard',
  colors: ['#293d50', '#05080a', '#e84f4f'], motif: 'streamrider',
  theme: 'Kurt, Max and Dr. Hawkins repelling the second Streamrider invasion',
  continuity: 'MDK 2, continuing directly after MDK; first-game facts tagged as prologue',
  adaptationRule: 'The ambiguous “mdr” is resolved as MDK from the surrounding 1990s game list. Use MDK2’s three playable heroes exactly: Kurt’s Coil Suit, Max’s four gun arms and Hawkins’s item combinations. Streamrider enemy names follow the official manual.',
  visualAnchor: 'Surreal silver-blue alien megastructures, Coil Suit ribbon chute, oversized comic weapons and bright energy streams.',
  canonStatus: 'MDK2 canon with official manual anchors',
  fr: 'Kurt Hectic, Max et le Dr Fluke Hawkins quittent le Jim Dandy pour arrêter la nouvelle invasion organisée comme divertissement impérial.',
  en: 'Kurt Hectic, Max and Dr. Fluke Hawkins leave the Jim Dandy to stop a renewed invasion staged as imperial entertainment.',
  referenceUrls: [MDK.url, 'https://www.gog.com/en/game/mdk_2', 'https://www.gog.com/en/game/mdk'],
  characters: [
    { id: 'kurt_hectic', name: 'Kurt Hectic', role: 'tactical', weapon: 'Coil Suit chain gun', weaponType: 'gun', simple: 'Chain-gun burst', secondary: 'Sniper shot', defense: 'Ribbon Chute glide', special: 'Coil Suit precision run', visualAnchor: 'Reluctant janitor hero in sleek black-silver Coil Suit with long pointed helmet, arm chain gun and red ribbon parachute.', fr: 'Le concierge réticent combine tir continu, précision et vol plané.', en: 'The reluctant janitor combines sustained fire, precision and gliding.' },
    { id: 'max', runtimeId: 'max_mdk', name: 'Max', role: 'marine', weapon: 'Four simultaneous guns', weaponType: 'gun', simple: 'Four-gun volley', secondary: 'Jetpack strafe', defense: 'Robotic-dog brace', special: 'Atomic jetpack barrage', visualAnchor: 'Six-legged robotic dog standing on two legs with four weapon-bearing arms, long canine head and steel-blue body.', fr: 'Le chien robot de Hawkins peut porter quatre armes à la fois.', en: 'Hawkins’s robotic dog can carry four weapons at once.' },
    { id: 'dr_hawkins', name: 'Dr. Fluke Hawkins', role: 'hacker', weapon: 'Combined inventions', weaponType: 'focus', simple: 'Inventory combination', secondary: 'Explosive loaf', defense: 'Improvised shield device', special: 'Unlikely invention chain', visualAnchor: 'Eccentric elderly scientist with white hair tufts, round goggles, blue coat and one odd household item in each hand.', fr: 'Physiquement fragile, Hawkins résout ses niveaux en combinant des objets.', en: 'Physically frail, Hawkins solves his levels by combining items.' }
  ],
  monsters: [
    { id: 'conehead', name: 'Conehead', weapon: 'Psychic attack', special: 'Barrier-passing pulse', visualAnchor: 'Small alien worker with elongated cone head, bright work suit and visible psychic wave.', fr: 'La classe ouvrière Streamrider répond par une attaque psychique lorsqu’elle est provoquée.', en: 'The Streamrider working class responds with a psychic attack when provoked.', canonStatus: 'canon official-manual enemy' },
    { id: 'bottrock', name: 'Bottrock', weapon: 'Energy cannon', special: 'Concussive grenade leap', visualAnchor: 'Agile alien shock trooper with squat armored body, energy cannon and grenade belt.', fr: 'Le fantassin de choc mobile des Streamriders.', en: 'The Streamriders’ mobile shock trooper.', canonStatus: 'canon official-manual enemy' },
    { id: 'birdbrain', name: 'Birdbrain', weapon: 'Sentry blaster', special: 'Flying pursuit', visualAnchor: 'Irritable winged alien sentry with beaked head and compact blaster.', fr: 'Une sentinelle volante tenace.', en: 'A tenacious flying sentry.', canonStatus: 'canon official-manual enemy' }
  ],
  bosses: [
    { id: 'bfb', name: 'BFB', weapon: 'Giant-brain energy', special: 'Regenerating shield', visualAnchor: 'Comically top-heavy alien with enormous exposed stylized brain, tiny body and spherical force shield, no gore.', fr: 'L’extraterrestre à très grand cerveau oppose son intelligence à Hawkins.', en: 'The very-big-brained alien pits its intelligence against Hawkins.', canonStatus: 'canon MDK2 boss' },
    { id: 'badmax', name: 'BadMax', weapon: 'Tracking lasers', special: 'Shield-and-heal cycle', visualAnchor: 'Oversized hostile mechanical dog modeled after Max, dark red steel, laser emitters and broad force shield.', fr: 'Une imitation hostile et agrandie de Max créée par BFB.', en: 'A hostile enlarged imitation of Max created by BFB.', canonStatus: 'canon MDK2 boss' },
    { id: 'shwang_shwing', name: 'Shwang Shwing', weapon: 'Alien heavy strikes', special: 'Warship pursuit', visualAnchor: 'Huge cocky Streamrider lieutenant with pink shades, broad green body and damaged wheelchair-mounted return form kept mechanical.', fr: 'Le bras droit impérial annonce que l’invasion n’est pas terminée.', en: 'The imperial right-hand alien reveals that the invasion is not over.', canonStatus: 'canon recurring MDK2 boss', aliases: ['Shwang Shwing', 'Shwing Shwang'] }
  ],
  worldBoss: { id: 'zizzy_ballooba', name: 'Emperor Zizzy Ballooba', weapon: 'Imperial energy', special: 'Palace reality assault', visualAnchor: 'Gigantic legless green alien emperor with crownlike headpiece, broad grin and surreal palace chamber, no copied logo.', fr: 'Le souverain de Swizzle Firma attaque la Terre pour tromper son ennui.', en: 'The ruler of Swizzle Firma attacks Earth to relieve his boredom.', canonStatus: 'canon MDK2 final boss' },
  stage: { name: 'Jim Dandy — seconde alerte d’invasion', visualAnchor: 'Eccentric orbital laboratory with blue metal corridors, household-item workbench and Earth behind panoramic glass.', fr: 'La célébration de la première victoire est interrompue par un nouveau Minecrawler.', en: 'Celebration of the first victory is interrupted by another Minecrawler.' },
  stageVariants: [
    stageVariant('Tactics', 'Minecrawler d’Edmonton', 'Very Hard', 'Shwang Shwing', { objective: 'Infiltrate the last Minecrawler, destroy its control point and identify the second invasion.' }),
    stageVariant('RPG', 'Palais de Swizzle Firma', 'Expert', 'Emperor Zizzy Ballooba', { objective: 'Choose Kurt, Max or Hawkins and reach Zizzy through the hero-specific route.' })
  ],
  gear: [
    { id: 'coil_suit', enName: 'Coil Suit', frName: 'Coil Suit', boost: { atk: 5, def: 5 }, visualAnchor: 'Black-silver armored suit module with integrated chain gun, sniper optic and folded red ribbon chute.', fr: 'L’invention de Hawkins portée par Kurt.', en: 'Hawkins’s invention worn by Kurt.' },
    { id: 'atomic_jetpack', enName: 'Atomic Jetpack', frName: 'Jetpack atomique', boost: { spd: 3, hp: 35 }, visualAnchor: 'Compact twin-cylinder atomic jetpack sized for Max with blue exhaust glow.', fr: 'La variante de jetpack de Max qui se recharge.', en: 'Max’s recharging jetpack variant.' },
    { id: 'explosive_loaf', enName: 'Explosive Loaf', frName: 'Pain explosif', boost: { atk: 7 }, visualAnchor: 'Cartoon loaf wired to a tiny Hawkins detonator, no brand or text.', fr: 'Une combinaison improbable des objets de Hawkins.', en: 'One of Hawkins’s unlikely item combinations.', canonStatus: 'canon gameplay combination' }
  ],
  event: { id: 'three_routes', enName: 'Three Routes to Zizzy', frName: 'Trois routes vers Zizzy', en: 'Kurt sneaks, Max blasts and Hawkins improvises through three distinct palace routes before the same confrontation.', fr: 'Kurt s’infiltre, Max arrose et Hawkins improvise sur trois routes distinctes du palais avant la même confrontation.', visualAnchor: 'Palace split into sniper, four-gun and invention lanes converging on one surreal chamber.', canonStatus: 'canon level-ten choice event' }
}));
}
