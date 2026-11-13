// Soldier of Fortune — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSoldierOfFortune() {
  return (Object.freeze({ key: 'soldier_of_fortune', universe: 'Soldier of Fortune', url: 'https://www.gog.com/en/game/soldier_of_fortune_platinum_edition' }));
}

export function createSoldierOfFortune2({ SOLDIER_OF_FORTUNE, definePack, stageVariant }) {
  return (definePack(SOLDIER_OF_FORTUNE, {
  aliases: ['Soldier of Fortunes', 'Soldier of Fortune (2000)', 'SoF'],
  mediaType: 'video-game', faction: 'modern', mode: 'Tactics', difficulty: 'Very Hard',
  colors: ['#344238', '#090c0a', '#d5a34a'], motif: 'covertops',
  theme: 'The Shop covert missions to recover four stolen nuclear warheads',
  continuity: 'Soldier of Fortune (2000) / Platinum Edition only',
  adaptationRule: 'Keep John Mullins, Hawk, Sam Gladstone, The Shop, The Order and the four-warhead pursuit in the first game. Sabre dies in a cutscene and Sam is mission control: both are Trials, never fabricated arena fighters. Avoid gore, real extremist insignia and real-person likenesses.',
  visualAnchor: 'Turn-of-the-millennium covert gear, olive tactical webbing, dark transit tunnels, snowy missile facilities and compact Shop briefings.',
  canonStatus: '2000 Raven game canon with non-graphic original fan adaptation',
  fr: 'John Mullins et Hawk poursuivent quatre ogives volées pour The Shop tandis que Sam Gladstone relie les indices qui mènent à l’Ordre de Sergei Dekker.',
  en: 'John Mullins and Hawk pursue four stolen warheads for The Shop while Sam Gladstone connects the evidence leading to Sergei Dekker’s Order.',
  referenceUrls: [SOLDIER_OF_FORTUNE.url, 'https://segaretro.org/images/c/cf/SoldierofFortune_DC_US_Manual.pdf', 'https://media.gdcvault.com/GD_Mag_Archives/GDM_September_2000.pdf'],
  characters: [
    { id: 'john_mullins', name: 'John Mullins', role: 'tactical', weapon: 'Shop carbine', weaponType: 'gun', simple: 'Controlled burst', secondary: 'Flashpak entry', defense: 'Lean from cover', special: 'Shop assault plan', visualAnchor: 'Older covert operator with close-cropped gray hair, green-black field clothes, tactical vest and carbine; no likeness to the real consultant.', fr: 'Agent de terrain de The Shop chargé de retrouver les ogives.', en: 'The Shop field operative assigned to recover the warheads.' },
    { id: 'hawk_parsons', name: 'Aaron “Hawk” Parsons', role: 'marine', weapon: 'Shop rifle', weaponType: 'gun', simple: 'Covering fire', secondary: 'Partner advance', defense: 'Tactical brace', special: 'Hawk crossfire', visualAnchor: 'Tall Black covert operative in dark field jacket, body armor and rifle; original face, no voice-actor likeness.', fr: 'Partenaire de Mullins et second agent de terrain de The Shop.', en: 'Mullins’s partner and The Shop’s second field operative.' },
    { id: 'sam_gladstone', name: 'Sam Gladstone', role: 'trial', nonCombat: true, objective: 'Decode Shop intelligence and identify the next warhead route.', objectiveFr: 'Décoder les renseignements de The Shop et identifier la prochaine route des ogives.', victoryCondition: 'briefing-chain-complete', visualAnchor: 'Bookshop proprietor at a cluttered back-room intelligence desk with paper maps, telephone and evidence board; original face.', fr: 'Libraire et contact de The Shop, Sam transmet les briefings plutôt que de combattre.', en: 'A bookseller and Shop contact, Sam delivers briefings rather than fighting.', canonStatus: 'canon non-combat mission-control ally' }
  ],
  monsters: [
    { id: 'ministry_gunman', name: 'Ministry of Sin Gunman', weapon: 'Submachine gun', special: 'Subway hostage crossfire', visualAnchor: 'Street gang gunman in mismatched dark layers and improvised armor, with no real extremist markings or gore.', fr: 'Un homme de main de Sabre rencontré dans le métro de New York.', en: 'One of Sabre’s gunmen encountered in the New York subway.', canonStatus: 'canon mission enemy archetype' },
    { id: 'order_commando', name: 'The Order Commando', weapon: 'Assault rifle', special: 'Warhead perimeter defense', visualAnchor: 'Paramilitary commando in olive winter equipment and anonymous original insignia.', fr: 'Un commando de l’Ordre affecté aux transferts d’ogives.', en: 'An Order commando assigned to warhead transfers.', canonStatus: 'canon faction enemy archetype' },
    { id: 'order_sniper', name: 'The Order Sniper', weapon: 'Sniper rifle', special: 'Long-range ambush', visualAnchor: 'Cold-weather sniper silhouette on industrial scaffolding, abstract unit patch and no gore.', fr: 'Un tireur de l’Ordre qui verrouille les itinéraires industriels.', en: 'An Order marksman locking down industrial routes.', canonStatus: 'canon mission enemy archetype' }
  ],
  bosses: [
    { id: 'general_amu', name: 'General Mohammed Amu', weapon: 'Command sidearm', special: 'Palace guard deployment', visualAnchor: 'Fictional military general in decorated olive uniform inside a fortified palace, original face and no real-state emblems.', fr: 'Le général Amu intervient dans l’étape irakienne de la piste nucléaire.', en: 'General Amu appears during the Iraqi leg of the nuclear trail.', canonStatus: 'canon fictional antagonist' },
    { id: 'sabre_pursuit', name: 'Sabre / Wilhelm Dekker — Rooftop Pursuit', nonCombat: true, objective: 'Corner Sabre and recover his Order intelligence before his scripted fall.', objectiveFr: 'Coincer Sabre et récupérer ses renseignements sur l’Ordre avant sa chute scénarisée.', victoryCondition: 'evidence-recovered', visualAnchor: 'Rainy New York rooftop chase with a broad tattooed gang leader kept at a distance, no fall impact or extremist symbols.', fr: 'Sabre est poursuivi puis meurt dans une cinématique ; il n’est pas transformé en sac à PV.', en: 'Sabre is pursued and then dies in a cutscene; he is not turned into a health-bar opponent.', canonStatus: 'canon cutscene pursuit represented as Trial' },
    { id: 'warhead_transfer', name: 'Fourth Warhead Transfer', nonCombat: true, objective: 'Secure the fourth nuclear warhead and disarm its transfer system.', objectiveFr: 'Sécuriser la quatrième ogive nucléaire et désarmer son système de transfert.', victoryCondition: 'warhead-secured', visualAnchor: 'Armored warhead cradle in a German underground launch facility across four disarm states.', fr: 'La récupération de l’ultime ogive est un objectif de mission, pas une créature.', en: 'Recovering the final warhead is a mission objective, not a creature.', canonStatus: 'canon mission objective' }
  ],
  worldBoss: { id: 'sergei_dekker', name: 'Sergei Dekker', weapon: 'Heavy command weapon', special: 'Missile-silo turret network', visualAnchor: 'Exiled Order commander in red-black armored field uniform on launch-silo catwalks, original face and no extremist insignia.', fr: 'Le fondateur de l’Ordre attend Mullins dans le complexe final allemand.', en: 'The Order’s founder awaits Mullins in the final German complex.', canonStatus: 'canon final antagonist' },
  stage: { name: 'Métro de New York — prise d’otages', visualAnchor: 'Wet tiled platforms, stopped subway train, police lights beyond gates and civilians behind cover.', fr: 'Mullins et Hawk ouvrent l’enquête en libérant le métro.', en: 'Mullins and Hawk begin the investigation by freeing the subway.' },
  stageVariants: [
    stageVariant('Tactics', 'Toits de New York — filature de Sabre', 'Hard', 'Sabre / Wilhelm Dekker — Rooftop Pursuit', { nonCombat: true, trialType: 'Trial', objective: 'Maintain pursuit and collect Order evidence; no fake duel.' }),
    stageVariant('Tactics', 'Complexe de lancement allemand', 'Expert', 'Sergei Dekker', { objective: 'Secure the last warhead, cross the silo and stop Dekker.' })
  ],
  gear: [
    { id: 'shop_goggles', enName: 'Shop Night-Vision Goggles', frName: 'Lunettes nocturnes de The Shop', boost: { spd: 2, def: 4 }, visualAnchor: 'Compact green-lensed tactical goggles with worn elastic strap.', fr: 'Équipement de vision utilisé lors des infiltrations sombres.', en: 'Vision equipment used during dark infiltrations.' },
    { id: 'flashpak', enName: 'Flashpak', frName: 'Flashpak', boost: { atk: 5, spd: 1 }, visualAnchor: 'Small cylindrical tactical flash device with safety lever, no readable brand.', fr: 'Un outil d’entrée pour désorienter une pièce.', en: 'An entry tool used to disorient a room.' },
    { id: 'plastic_explosive', enName: 'Plastic Explosive Charge', frName: 'Charge d’explosif plastique', boost: { atk: 8 }, visualAnchor: 'Rectangular demolition charge with timer and coiled wire, no text.', fr: 'Une charge réservée aux objectifs destructibles.', en: 'A charge reserved for destructible objectives.' }
  ],
  event: { id: 'shop_briefing', enName: 'The Shop Briefing Chain', frName: 'Chaîne de briefings de The Shop', en: 'Sam links each recovered clue to the next continent while the four warhead indicators are cleared one by one.', fr: 'Sam relie chaque indice au continent suivant pendant que les quatre indicateurs d’ogive sont neutralisés un à un.', visualAnchor: 'Back-room bookshop map with four abstract warhead markers extinguishing in sequence.', canonStatus: 'canon mission-chain Trial', nonCombat: true }
}));
}
