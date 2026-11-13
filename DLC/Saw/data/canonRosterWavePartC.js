// Saw — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSaw() {
  return (Object.freeze({
  key: 'saw',
  universe: 'Saw',
  url: 'https://www.lionsgate.com/movies/saw'
}));
}

export function createSaw2({ SAW, definePack, stageVariant }) {
  return (definePack(SAW, {
  aliases: ['Saw franchise'],
  mediaType: 'movie', faction: 'horror', mode: 'Tactics', difficulty: 'Expert',
  colors: ['#243027', '#030504', '#9b382e'], motif: 'traproom',
  theme: 'moral tests, clues and escape mechanisms across the Saw film series',
  continuity: 'Saw film series; playable trio anchored in Saw (2004), later apprentices explicitly labelled by film arc',
  adaptationRule: 'Traps are environmental puzzle objectives, never collectible monsters. Billy is only John Kramer’s messenger prop. John/Jigsaw is a noncombat test controller: victory is interpreting rules, disarming mechanisms and rescuing captives, never reducing him to a melee boss.',
  visualAnchor: 'Decayed industrial rooms, sickly green practical light, analog tape machines, red-black mechanical puzzle parts and restrained non-gory framing.',
  canonStatus: 'film-series canon with puzzle-first, noncombat Jigsaw policy',
  fr: 'Adam, le docteur Gordon et l’inspecteur Tapp résolvent les règles des tests tandis que les apprentis de Jigsaw détournent son héritage.',
  en: 'Adam, Dr. Gordon and Detective Tapp solve the tests’ rules while Jigsaw’s apprentices distort his legacy.',
  referenceUrls: [SAW.url, 'https://www.lionsgate.com/franchises/saw', 'https://catalog.afi.com/Film/63212-SAW', 'https://shop.lionsgate.com/products/saw-vi-br'],
  characters: [
    { id: 'adam', runtimeId: 'adam_stanheight', name: 'Adam Stanheight', role: 'horror', weapon: 'Camera flash', weaponType: 'focus', simple: 'Flash distraction', secondary: 'Clue photograph', defense: 'Bathroom cover', special: 'Reconstruct the room', visualAnchor: 'Young photographer in damp dark shirt with small analog camera and shoulder bag, no actor likeness and no gore.', fr: 'Adam se réveille enchaîné dans la salle de bains avec son appareil et des indices incomplets.', en: 'Adam wakes chained in the bathroom with his camera and incomplete clues.' },
    { id: 'lawrence_gordon', runtimeId: 'lawrence_gordon', name: 'Dr. Lawrence Gordon', role: 'tactical', weapon: 'Medical reasoning', weaponType: 'focus', simple: 'Clinical assessment', secondary: 'Timed clue order', defense: 'Emergency first aid', special: 'Test solution', visualAnchor: 'Middle-aged doctor in rumpled pale shirt with medical penlight and restrained distressed posture, no actor likeness or injury detail.', fr: 'Le docteur Gordon analyse les règles du piège tout en cherchant à sauver sa famille.', en: 'Dr. Gordon analyzes the trap’s rules while trying to save his family.' },
    { id: 'david_tapp', runtimeId: 'detective_tapp', name: 'Detective David Tapp', role: 'marine', weapon: 'Detective sidearm', weaponType: 'gun', simple: 'Covering shot', secondary: 'Case-board lead', defense: 'Police cover', special: 'Jigsaw trail', visualAnchor: 'Obsessive detective in dark coat carrying a flashlight and holstered sidearm, no actor likeness.', fr: 'Tapp poursuit obstinément Jigsaw et relie les lieux de ses tests.', en: 'Tapp obsessively pursues Jigsaw and connects the locations of his tests.' }
  ],
  monsters: [
    { id: 'zep_hindle', name: 'Zep Hindle', weapon: 'Revolver', special: 'Poisoned hostage order', visualAnchor: 'Hospital orderly in dark practical clothes holding a cassette recorder and weapon, no actor likeness or gore.', fr: 'Zep agit sous la contrainte d’un poison et des instructions de Jigsaw.', en: 'Zep acts under poison and Jigsaw’s instructions.', canonStatus: 'canon coerced victim-antagonist', coercionStatus: 'poisoned test subject' },
    { id: 'xavier_chavez', name: 'Xavier Chavez', weapon: 'Brute force', special: 'Nerve Gas House pursuit', visualAnchor: 'Large desperate test subject in worn sleeveless clothes inside a green-lit house, no actor likeness or injury detail.', fr: 'Xavier retourne la violence contre les autres victimes dans Saw II.', en: 'Xavier turns violence against the other victims in Saw II.', canonStatus: 'canon Saw II human antagonist' },
    { id: 'pig_masked_abductors', name: 'Pig-Masked Abductors', weapon: 'Sedative ambush', special: 'Test-subject capture', visualAnchor: 'Anonymous figure in black robe and coarse pig mask emerging from industrial shadow, no identity implied and no Billy tricycle.', fr: 'Les ravisseurs masqués capturent les sujets des tests ; ils ne sont pas Billy.', en: 'Pig-masked abductors capture test subjects; they are not Billy.', canonStatus: 'canon recurring abductor role', identityRule: 'Do not depict Billy the puppet as this enemy.' }
  ],
  bosses: [
    { id: 'amanda_young', name: 'Amanda Young', weapon: 'Rigged test mechanisms', special: 'Unwinnable trap sequence', visualAnchor: 'Jigsaw apprentice in dark layered clothes beside a mechanical control board, no actor likeness or gore.', fr: 'Amanda, survivante devenue apprentie, conçoit des tests truqués.', en: 'Amanda, a survivor turned apprentice, builds rigged tests.', canonStatus: 'canon apprentice antagonist' },
    { id: 'mark_hoffman', name: 'Detective Lt. Mark Hoffman', weapon: 'Police access and traps', special: 'Evidence-room reversal', visualAnchor: 'Police detective in dark suit with evidence keycard and concealed trap controls, no actor likeness.', fr: 'Hoffman exploite son accès policier pour poursuivre l’œuvre de Jigsaw.', en: 'Hoffman exploits police access to continue Jigsaw’s work.', canonStatus: 'canon apprentice antagonist' },
    { id: 'william_schenk', name: 'William Schenk / William Emmerson', weapon: 'Spiral traps', special: 'False-identity reveal', visualAnchor: 'Plainclothes detective silhouette with spiral evidence marker and compact tape player, no actor likeness.', fr: 'William Schenk, né Emmerson, agit dans la branche Spiral.', en: 'William Schenk, born Emmerson, acts within the Spiral branch.', canonStatus: 'canon Spiral copycat antagonist', continuityScope: 'Spiral (2021)' }
  ],
  worldBoss: { id: 'john_kramer', name: 'John Kramer / Jigsaw', weapon: 'Test rules and recordings', special: 'Final lesson reveal', visualAnchor: 'Terminally ill engineer represented at a worktable through notebooks, tape recorder and mechanical plans, no actor likeness, weapon pose or gore.', fr: 'John Kramer contrôle les tests par leurs règles et leurs révélations ; Billy n’est que son messager.', en: 'John Kramer controls tests through rules and revelations; Billy is only his messenger.', canonStatus: 'canon central test controller; explicitly noncombat', entityType: 'narrative-test-controller', nonCombat: true, objective: 'Interpret every rule, disarm the mechanisms and rescue the captives.', objectiveFr: 'Interpréter chaque règle, désamorcer les mécanismes puis sauver les captifs.', victoryCondition: 'solve-disarm-rescue', messenger: 'Billy the Puppet', spritePrompt: 'Original fan-made pixel-art narrative objective sheet: worktable, tape recorder, engineering notes and four clue-reveal states. No combat pose, gore, text, logo, actor likeness or Billy as the boss.' },
  stage: { name: 'Salle de bains industrielle — premier test', visualAnchor: 'Dilapidated tiled bathroom, two distant chain points, analog tape clues and green-gray light, framed without bodies or gore.', fr: 'Adam et Gordon doivent comprendre les règles de la salle avant l’expiration du délai.', en: 'Adam and Gordon must understand the room’s rules before time expires.' },
  stageVariants: [
    stageVariant('RPG', 'Entrepôt de Jigsaw — mécanismes', 'Expert', 'Amanda Young', { objective: 'Find and disable the rigged mechanisms; traps are stage hazards, not enemies.' }),
    stageVariant('Tactics', 'Réseau des tests — leçon finale', 'Expert', 'John Kramer / Jigsaw', { objective: 'Solve, disarm and rescue; attacking John fails the encounter.', nonCombat: true })
  ],
  gear: [
    { id: 'tape_recorder', enName: 'Jigsaw Tape Recorder', frName: 'Magnétophone de Jigsaw', boost: { atk: 5, spd: 2 }, visualAnchor: 'Small worn analog microcassette recorder with play button and no readable label.', fr: 'Les enregistrements énoncent les règles des tests.', en: 'Recordings state each test’s rules.' },
    { id: 'hacksaw', enName: 'Bathroom Hacksaw', frName: 'Scie de la salle de bains', boost: { def: 6, hp: 45 }, visualAnchor: 'Plain worn hand saw presented as an escape clue, clean and without injury context.', fr: 'Un outil ambigu du premier test, représenté sans violence graphique.', en: 'An ambiguous tool from the first test, shown without graphic violence.' },
    { id: 'hidden_key', enName: 'Hidden Test Key', frName: 'Clé cachée du test', boost: { hp: 75 }, visualAnchor: 'Small brass key inside a clear evidence envelope with a simple clue tag lacking readable text.', fr: 'La clé récompense l’observation attentive des indices.', en: 'The key rewards careful observation of clues.' }
  ],
  event: { id: 'follow_the_rules', enName: 'Follow the Test Rules', frName: 'Suivre les règles du test', en: 'The recording is replayed, revealing a literal instruction that disables the next mechanism and opens a rescue route.', fr: 'L’enregistrement est réécouté et révèle une instruction littérale qui neutralise le mécanisme suivant et ouvre une voie de sauvetage.', visualAnchor: 'Tape waveform, mechanical timer and three highlighted safety catches with no readable text or gore.' }
}));
}
