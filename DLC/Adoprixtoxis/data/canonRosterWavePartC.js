// Adoprixtoxis — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createAdoprixtoxis() {
  return (Object.freeze({
  key: 'adoprixtoxis',
  universe: 'Adoprixtoxis',
  url: 'https://www.capitainegloomy.com/encyclopedie/'
}));
}

export function createAdoprixtoxis2({ ADOPRIXTOXIS, definePack, stageVariant }) {
  return (definePack(ADOPRIXTOXIS, {
  aliases: ['Adorpixtoxic', 'Adoprixtoxis'],
  mediaType: 'audio-drama', faction: 'sciFi', mode: 'Tactics', difficulty: 'Very Hard',
  colors: ['#263356', '#05070f', '#ef5bd2'], motif: 'alienbase',
  theme: 'French science-fiction parody on the planet Adoprixtoxis',
  continuity: 'Capitaine Gloomy audio saga, official encyclopedia and episode pages',
  adaptationRule: 'Use the official names and roles from the saga. “Vador” is the parody character’s canonical credited name here; never relabel him as Darth Vader or import Star Wars branding.',
  visualAnchor: 'Colorful pulp science-fiction planet, angular alien installations, improvised expedition gear and comic military robots.',
  canonStatus: 'canon audio-saga roster with transparent tactical adaptation',
  fr: 'Gloomy, Kellogs et K.R.O.T.E. affrontent soldats, robots et plans de Phobizer sur la planète Adoprixtoxis.',
  en: 'Gloomy, Kellogs and K.R.O.T.E. face soldiers, robots and Phobizer’s schemes on planet Adoprixtoxis.',
  referenceUrls: [ADOPRIXTOXIS.url, 'https://www.capitainegloomy.com/encyclopedie/qui-sommes-nous/', 'https://www.capitainegloomy.com/episodes/', 'https://sagas.neamar.fr/Adoprixtoxis-17/', 'https://sagas.neamar.fr/Adoprixtoxis-18/'],
  characters: [
    { id: 'gloomy', name: 'Capitaine Jean-Claude Gloomy', role: 'tactical', weapon: 'Pistolet spatial', weaponType: 'gun', simple: 'Tir du capitaine', secondary: 'Ordre de Gloomy', defense: 'Couverture expéditionnaire', special: 'Plan de sauvetage improvisé', visualAnchor: 'Human expedition captain in a practical sci-fi uniform, compact sidearm and expressive command stance.', fr: 'Le capitaine Gloomy dirige l’expédition avec plus de bonne volonté que de maîtrise.', en: 'Captain Gloomy leads the expedition with more goodwill than control.' },
    { id: 'kellogs', name: 'Professeur Albert Kellogs', role: 'hacker', weapon: 'Scanner scientifique', weaponType: 'focus', simple: 'Impulsion du scanner', secondary: 'Analyse de Kellogs', defense: 'Contre-mesure scientifique', special: 'Hypothèse décisive', visualAnchor: 'Human scientist in expedition clothes with spectacles, handheld analyzer and equipment satchel.', fr: 'Le professeur Kellogs étudie la planète et cherche une explication scientifique à chaque catastrophe.', en: 'Professor Kellogs studies the planet and seeks a scientific explanation for every catastrophe.' },
    { id: 'krote', name: 'K.R.O.T.E.', role: 'marine', weapon: 'Armement robotique', weaponType: 'gun', simple: 'Rafale robotique', secondary: 'Calcul de trajectoire', defense: 'Blindage K.R.O.T.E.', special: 'Protocole de protection', visualAnchor: 'Compact expedition robot with visible joint plating, sensor head and integrated utility weapon, not a humanoid franchise droid.', fr: 'Le robot K.R.O.T.E. apporte puissance de calcul, résistance et remarques mécaniques.', en: 'The robot K.R.O.T.E. supplies processing power, resilience and mechanical commentary.' }
  ],
  monsters: [
    { id: 'soldat_adoprixtoxitien', name: 'Soldat adoprixtoxitien', weapon: 'Fusil alien', special: 'Feu de section', visualAnchor: 'Planetary soldier in bright angular armor with an original long energy rifle.', fr: 'Un fantassin local engagé dans le conflit qui entoure l’expédition.', en: 'A local infantryman drawn into the conflict around the expedition.' },
    { id: 'robot_unite_22', name: 'Robot soldat — unité 22', weapon: 'Canon intégré', special: 'Salve automatisée', visualAnchor: 'Numbered military robot with blocky plated torso, tracked or sturdy mechanical legs and integrated cannon.', fr: 'Une unité militaire automatisée identifiée par son numéro.', en: 'An automated military unit identified by its number.' },
    { id: 'garde_zurpien', name: 'Garde zurpien', weapon: 'Lance zurpienne', special: 'Verrouillage zurpien', visualAnchor: 'Zurpian guard with nonhuman silhouette, ceremonial-tech armor and a long energy staff.', fr: 'Un garde zurpien chargé de défendre les positions de son camp.', en: 'A Zurpian guard assigned to defend its faction’s positions.' }
  ],
  bosses: [
    { id: 'vador', name: 'Vador', weapon: 'Pouvoirs de Vador', special: 'Renforts de ses soldats', visualAnchor: 'The saga’s own helmeted black-armored parody antagonist, rendered as original fan art without Star Wars logos, actor likeness or the name Darth.', fr: 'Vador et ses soldats interviennent dans la saga sous ce nom précis.', en: 'Vador and his soldiers appear in the saga under this exact name.', canonStatus: 'canon parody character in Adoprixtoxis; name locked to Vador' },
    { id: 'numero_69', name: 'N°69', weapon: 'Arme zurpienne', special: 'Impulsion électromagnétique', visualAnchor: 'Named Zurpian officer with a clear 69 designation, alien command armor and EMP emitter.', fr: 'L’officier zurpien N°69 utilise notamment une impulsion électromagnétique.', en: 'Zurpian officer No. 69 notably employs an electromagnetic pulse.' },
    { id: 'kiki_phobizer', name: 'Kiki de Phobizer', weapon: 'Morsure de créature', special: 'Assaut du cul-de-sac', visualAnchor: 'Phobizer’s strange pet creature in a confined alien corridor, quirky yet dangerous and not a generic dragon.', fr: 'La créature de Phobizer transforme une impasse en rencontre dangereuse.', en: 'Phobizer’s creature turns a dead end into a dangerous encounter.' }
  ],
  worldBoss: { id: 'phobizer', name: 'Seigneur Phobizer', weapon: 'Technologie de Phobizer', special: 'Contrôle de la planète', visualAnchor: 'Alien overlord with theatrical high-tech regalia, magenta energy architecture and an original silhouette.', fr: 'Phobizer orchestre la menace principale et domine les forces opposées aux héros.', en: 'Phobizer orchestrates the principal threat and commands the forces arrayed against the heroes.', canonStatus: 'canon principal antagonist', entityType: 'command-world-boss', objective: 'Disable Phobizer’s planetary command systems before confronting him.' },
  stage: { name: 'Adoprixtoxis — zone d’atterrissage', visualAnchor: 'Alien landing field with expedition wreckage, saturated sky and angular city structures in the distance.', fr: 'L’expédition sécurise sa zone d’atterrissage avant de rejoindre les installations de Phobizer.', en: 'The expedition secures its landing area before reaching Phobizer’s installations.' },
  stageVariants: [
    stageVariant('Smash', 'Base des soldats de Vador', 'Very Hard', 'Vador', { objective: 'Cross the guarded base without importing any outside franchise identity.' }),
    stageVariant('Tactics', 'Centre de commandement de Phobizer', 'Expert', 'Seigneur Phobizer', { objective: 'Disable the command grid node by node.' })
  ],
  gear: [
    { id: 'pistolet_gloomy', enName: 'Gloomy’s Space Pistol', frName: 'Pistolet spatial de Gloomy', boost: { atk: 8, spd: 1 }, visualAnchor: 'Compact colorful pulp-sci-fi sidearm with original proportions.', fr: 'L’arme d’expédition du capitaine.', en: 'The captain’s expedition sidearm.' },
    { id: 'scanner_kellogs', enName: 'Kellogs Analyzer', frName: 'Analyseur de Kellogs', boost: { def: 6, hp: 45 }, visualAnchor: 'Handheld scientific analyzer with antennae and a small waveform screen.', fr: 'L’outil scientifique du professeur Kellogs.', en: 'Professor Kellogs’s scientific tool.' },
    { id: 'module_krote', enName: 'K.R.O.T.E. Armor Module', frName: 'Module de blindage K.R.O.T.E.', boost: { hp: 65, atk: 3 }, visualAnchor: 'Interlocking robot armor module matching K.R.O.T.E.’s compact construction.', fr: 'Un module de protection du robot de l’équipe.', en: 'A protection module from the team’s robot.' }
  ],
  event: { id: 'expedition_gloomy', enName: 'Gloomy Expedition Protocol', frName: 'Protocole d’expédition Gloomy', en: 'Kellogs identifies a weak point, K.R.O.T.E. calculates the route and Gloomy orders the charge.', fr: 'Kellogs identifie une faiblesse, K.R.O.T.E. calcule l’itinéraire et Gloomy ordonne la charge.', visualAnchor: 'The three expedition members acting together against a saturated alien landscape.' }
}));
}
