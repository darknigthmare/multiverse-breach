// Tail Concerto — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createTailConcerto() {
  return (Object.freeze({ key: 'tail_concerto', universe: 'Tail Concerto', url: 'https://www.mobygames.com/game/8483/tail-concerto/' }));
}

export function createTailConcerto2({ TAIL_CONCERTO, definePack, stageVariant }) {
  return (definePack(TAIL_CONCERTO, {
  aliases: ['Tail Concerto', 'Little Tail Bronx: Tail Concerto'],
  mediaType: 'video-game', faction: 'skyisland', mode: 'RPG', difficulty: 'Hard',
  colors: ['#5aa7cf', '#102337', '#f3cf5d'], motif: 'policerobo',
  theme: 'Waffle’s police pursuit becoming a rescue of Alicia and Prairie',
  continuity: 'Tail Concerto (PlayStation) only',
  adaptationRule: 'Waffle arrests Black Cat kittens non-lethally with bubbles and transport. Kittens are capture Trials, never evil HP fodder. Alicia changes sides for the Iron Giant finale; Fool’s manipulation and the Giant’s core are kept distinct.',
  visualAnchor: 'Bright floating Prairie islands, anime airships, Caninu and Felineko citizens, Police Robo walker and cat-shaped mecha.',
  canonStatus: 'single-game Little Tail Bronx canon with non-lethal arrest rules',
  fr: 'L’officier Waffle poursuit le gang des Chats Noirs, retrouve Alicia et découvre que Fool utilise les cinq cristaux pour réveiller le Géant de Fer.',
  en: 'Officer Waffle pursues the Black Cats, reunites with Alicia and learns Fool is using five crystals to awaken the Iron Giant.',
  referenceUrls: [TAIL_CONCERTO.url, 'https://gamefaqs.gamespot.com/ps/198882-tail-concerto/faqs/17187', 'https://littletail.wiki/Tail_Concerto'],
  characters: [
    { id: 'waffle', name: 'Waffle Ryebread', role: 'tactical', weapon: 'Police Robo bubble blaster', weaponType: 'focus', simple: 'Bubble capture', secondary: 'Extendable-arm grab', defense: 'Police Robo hover', special: 'Transporter arrest sweep', visualAnchor: 'Cream-furred Caninu police officer in blue short-sleeved uniform and backward cap piloting a round blue-gray Police Robo walker.', fr: 'Policier Caninu qui privilégie l’arrestation et le sauvetage.', en: 'A Caninu police officer focused on arrest and rescue.', captureRule: 'All kitten captures are non-lethal.' },
    { id: 'alicia', name: 'Alicia Pris', role: 'slayer', weapon: 'Black Cat mecha controls', weaponType: 'focus', simple: 'Mecha command', secondary: 'Skull-bomb redirect', defense: 'Balloon retreat', special: 'Iron-Giant rescue alliance', visualAnchor: 'Orange-haired Felineko gang leader with black eyepatch, red flight jacket, black shorts over opaque leggings and cat-eared aviator cap; practical, non-sexualized design.', fr: 'Cheffe du gang et amie d’enfance de Waffle, manipulée par Fool avant la finale.', en: 'The gang leader and Waffle’s childhood friend, manipulated by Fool before the finale.', canonStatus: 'canon boss-then-ally' },
    { id: 'cyan', name: 'Cyan Garland', role: 'marine', weapon: 'Royal Guard saber', weaponType: 'blade', simple: 'Guard saber cut', secondary: 'Airship cover', defense: 'Royal brace', special: 'Prairie evacuation guard', visualAnchor: 'Tall Caninu royal guard in blue-white formal armor, cape, saber and airship harness.', fr: 'Garde royal qui assiste le sauvetage final de Prairie.', en: 'A royal guard who assists Prairie’s final rescue.', canonStatus: 'canon finale ally' }
  ],
  monsters: [
    { id: 'red_vest_kitten', name: 'Red-Vest Kitten Capture', nonCombat: true, objective: 'Catch the fast kitten in a bubble and transport it safely to headquarters.', objectiveFr: 'Capturer le chaton rapide dans une bulle et le transporter sans danger au quartier général.', victoryCondition: 'safe-capture', visualAnchor: 'Small Felineko kitten in red vest dodging a transparent blue bubble across four capture states.', fr: 'Le chaton rapide est arrêté, pas blessé.', en: 'The fast kitten is arrested, not harmed.', canonStatus: 'canon non-lethal capture target' },
    { id: 'blue_overalls_kitten', name: 'Blue-Overalls Kitten Vehicle Stop', nonCombat: true, objective: 'Disable the kitten’s small vehicle, then bubble-transport the unharmed driver.', objectiveFr: 'Désactiver le petit véhicule du chaton puis transporter le conducteur indemne dans une bulle.', victoryCondition: 'vehicle-disabled-safe-capture', visualAnchor: 'Small kitten in blue overalls leaving a stopped toy-like gang vehicle for a capture bubble.', fr: 'Le conducteur est extrait de son véhicule puis arrêté sans violence.', en: 'The driver is removed from the vehicle and arrested without harm.', canonStatus: 'canon non-lethal capture target' },
    { id: 'black_shirt_kitten', name: 'Black-Shirt Kitten Bomb Disposal', nonCombat: true, objective: 'Contain every skull bomb and capture the kitten after the fuse line is safe.', objectiveFr: 'Contenir toutes les bombes-crâne et capturer le chaton une fois les mèches sécurisées.', victoryCondition: 'bombs-contained-safe-capture', visualAnchor: 'Small kitten in black shirt beside stylized skull bombs being enclosed by blue police bubbles.', fr: 'Le lanceur de bombes devient une épreuve de désamorçage et d’arrestation.', en: 'The bomb thrower becomes a disposal-and-arrest Trial.', canonStatus: 'canon non-lethal capture target' }
  ],
  bosses: [
    { id: 'cat_mecha_1', name: 'Black Cat Mecha-I', weapon: 'Skull bombs', special: 'Two-handed balloon charge', visualAnchor: 'Round cat-faced balloon mecha with two huge grab arms, tiny walking bombs and Pris sisters visible in the cockpit.', fr: 'Le premier mecha renvoie ses propres bombes lorsqu’elles sont saisies.', en: 'The first mecha is hit by its own bombs when they are caught.' },
    { id: 'cat_mecha_3', name: 'Black Cat Mecha-III', weapon: 'Cat-bomb cannon', special: 'Six-legged tank stomp', visualAnchor: 'Large six-legged cat tank with central cannon, balloon rigging and three-sister cockpit.', fr: 'Le troisième mecha combine canon, pattes et arène ouverte.', en: 'The third mecha combines cannon, legs and an open arena.' },
    { id: 'fool', name: 'Fool', weapon: 'Relic manipulation', special: 'Five-crystal betrayal', visualAnchor: 'Sly purple-clad Felineko relic merchant with tall hat, crystal satchel and theatrical grin, original fan-made face.', fr: 'Le marchand de reliques pousse Alicia à réunir les cristaux.', en: 'The relic merchant pushes Alicia to gather the crystals.', canonStatus: 'canon true manipulator antagonist' }
  ],
  worldBoss: { id: 'iron_giant_core', name: 'Iron Giant Core Shutdown', nonCombat: true, objective: 'Reach Alicia, remove the five-crystal activation and destroy only the Giant’s control core before evacuating.', objectiveFr: 'Atteindre Alicia, retirer l’activation des cinq cristaux et détruire uniquement le noyau de contrôle avant l’évacuation.', victoryCondition: 'core-disabled-allies-evacuated', visualAnchor: 'Ancient colossal Iron Giant interior, five colored crystal sockets and central core across four shutdown states, no humanoid opponent.', fr: 'Le Géant est neutralisé depuis son noyau pendant le sauvetage d’Alicia.', en: 'The Giant is disabled from its core while Alicia is rescued.', canonStatus: 'canon environmental finale Trial' },
  stage: { name: 'Resaca — intervention du Police Robo', visualAnchor: 'Sunny floating-island town with canals, small balloons, Black Cat vehicles and Police Robo capture lanes.', fr: 'Waffle ouvre l’affaire en protégeant Resaca et en arrêtant les chatons.', en: 'Waffle opens the case by protecting Resaca and arresting kittens.' },
  stageVariants: [
    stageVariant('Trial', 'Forteresse des Chats Noirs — arrestations sûres', 'Hard', 'Black-Shirt Kitten Bomb Disposal', { nonCombat: true, trialType: 'Trial', objective: 'Disable vehicles, dispose of bombs and transport every kitten safely.' }),
    stageVariant('Trial', 'Géant de Fer — noyau ancestral', 'Expert', 'Iron Giant Core Shutdown', { nonCombat: true, trialType: 'Trial', objective: 'Rescue Alicia, remove the five crystals and shut down the core.' })
  ],
  gear: [
    { id: 'police_robo', enName: 'Police Robo', frName: 'Police Robo', boost: { def: 7, hp: 45 }, visualAnchor: 'Round blue-gray two-legged police walker with extendable arms, bubble nozzle and transporter lamp.', fr: 'Le véhicule de patrouille de Waffle.', en: 'Waffle’s patrol vehicle.' },
    { id: 'bubble_blaster', enName: 'Bubble Blaster', frName: 'Lanceur de bulles', boost: { atk: 3, spd: 2 }, visualAnchor: 'Police Robo nozzle generating a soft transparent blue capture sphere.', fr: 'L’outil d’arrestation non létal.', en: 'The non-lethal arrest tool.', canonStatus: 'canon non-lethal tool' },
    { id: 'blue_crystal', enName: 'Blue Crystal Pendant', frName: 'Pendentif au cristal bleu', boost: { hp: 55, def: 4 }, visualAnchor: 'Small blue crystal pendant tied with a simple childhood cord.', fr: 'Le pendentif rappelle le lien d’enfance entre Waffle et Alicia.', en: 'The pendant recalls Waffle and Alicia’s childhood bond.' }
  ],
  event: { id: 'pris_alliance', enName: 'Pris Sisters Alliance', frName: 'Alliance des sœurs Pris', en: 'Alicia, Flare and Stare turn the Black Cats’ machines toward the evacuation route while Waffle enters the Iron Giant.', fr: 'Alicia, Flare et Stare orientent les machines des Chats Noirs vers l’évacuation pendant que Waffle entre dans le Géant de Fer.', visualAnchor: 'Three distinct Pris sisters directing balloons away from the Iron Giant as Police Robo enters the core route.', canonStatus: 'canon finale alliance' }
}));
}
