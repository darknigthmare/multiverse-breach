// Les Aventuriers du Survivaure — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSurvivaure() {
  return (Object.freeze({
  key: 'survivaure',
  universe: 'Les Aventuriers du Survivaure',
  url: 'https://www.knarfworld.net/dernier-episode.html'
}));
}

export function createSurvivaure2({ SURVIVAURE, definePack, stageVariant }) {
  return (definePack(SURVIVAURE, {
  aliases: ['Les Aventuriers du NHL2987 Survivaure', 'Aventurier du survivaure'],
  mediaType: 'audio-drama', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
  colors: ['#17334a', '#040a10', '#58d6ff'], motif: 'starship',
  theme: 'French space-opera parody aboard the NHL2987 Survivaure',
  continuity: 'Knarf audio saga and official episode transcripts',
  adaptationRule: 'Preserve the crew’s ranks, comic incompetence and radio-play technology. Haldar is a human Consortium political strategist exposed and arrested for his Krygonite complicity, never a melee boss. The Grand Gluant is the tentacled sovereign and supreme fleet commander of the Krygonite Empire, not a generic slime.',
  visualAnchor: 'Cramped retro-future starship corridors, blue instrument panels, bulky space suits and improvised military equipment.',
  canonStatus: 'canon audio-saga roster; local specification only pending rights permission',
  fr: 'Bleûten, Johnson et Rasmusen tentent de remplir une mission spatiale qui dégénère entre Krygonites, pannes et créatures improbables.',
  en: 'Bleûten, Johnson and Rasmusen attempt a space mission that collapses into Krygonites, breakdowns and improbable creatures.',
  referenceUrls: [SURVIVAURE.url, 'https://www.knarfworld.net/sites/default/files/survivaure_episode_10.pdf', 'https://www.knarfworld.net/sites/default/files/Episode_15.pdf', 'https://www.knarfworld.net/sites/default/files/Episode_16.pdf', 'https://www.knarfworld.net/bd.html'],
  licensing: {
    permissionRequired: true,
    status: 'authorized-for-public-release',
    authorizationConfirmedAt: '2026-08-02',
    authorizationSource: 'project-owner confirmation',
    referenceUrl: 'https://www.knarfworld.net/comment/reply/21.html',
    releaseRule: 'Written permission is confirmed for this project; retain the authorization record with the project documentation.'
  },
  characters: [
    { id: 'bleuten', name: 'Capitaine Bleûten', role: 'tactical', weapon: 'Blaster réglementaire', weaponType: 'gun', simple: 'Tir de blaster', secondary: 'Ordre improvisé', defense: 'Abri de passerelle', special: 'Manœuvre du capitaine', visualAnchor: 'Human starship captain in a dark practical uniform with rank details, sidearm and an often overwhelmed command posture.', fr: 'Le capitaine du Survivaure maintient tant bien que mal une chaîne de commandement.', en: 'The Survivaure’s captain keeps a chain of command together as best he can.' },
    { id: 'johnson', name: 'Sergent Johnson', role: 'marine', weapon: 'Fusil spatial', weaponType: 'gun', simple: 'Rafale du sergent', secondary: 'Couverture rapprochée', defense: 'Position fortifiée', special: 'Discipline militaire', visualAnchor: 'Stocky sergeant in a reinforced space uniform, long firearm and squared military stance.', fr: 'Le sergent apporte une réponse militaire directe aux problèmes de l’équipage.', en: 'The sergeant supplies a direct military answer to the crew’s problems.' },
    { id: 'rasmusen', name: 'Ingénieur Thobias Rasmusen', role: 'hacker', weapon: 'Outils d’ingénierie', weaponType: 'focus', simple: 'Décharge de maintenance', secondary: 'Dérivation de circuit', defense: 'Champ bricolé', special: 'Réparation impossible', visualAnchor: 'Starship engineer with utility coveralls, diagnostic tools, cable spool and an equipment harness.', fr: 'Rasmusen connaît les systèmes du vaisseau, même lorsqu’ils refusent obstinément de fonctionner.', en: 'Rasmusen understands the ship’s systems even when they stubbornly refuse to work.' }
  ],
  monsters: [
    { id: 'soldat_krygonite', name: 'Soldat krygonite', weapon: 'Fusil krygonite', special: 'Tir coordonné', visualAnchor: 'Armored alien infantry silhouette with utilitarian Krygonite rifle and no borrowed sci-fi insignia.', fr: 'Le fantassin standard des forces krygonites.', en: 'The standard infantry of the Krygonite forces.' },
    { id: 'lieutenant_krygonite', name: 'Lieutenant krygonite', weapon: 'Pistolet d’officier', special: 'Ordre de section', visualAnchor: 'Krygonite junior officer with distinct rank panel, sidearm and compact communicator.', fr: 'Un officier subalterne qui coordonne les sections krygonites.', en: 'A junior officer coordinating Krygonite squads.' },
    { id: 'garde_prison_krygonite', name: 'Garde de prison krygonite', weapon: 'Matraque énergétique', special: 'Verrouillage de cellule', visualAnchor: 'Heavy Krygonite prison guard with key console, visor and short energy baton.', fr: 'Un garde chargé de maintenir les prisonniers dans les cellules krygonites.', en: 'A guard tasked with keeping prisoners inside Krygonite cells.' }
  ],
  bosses: [
    { id: 'commandeur_krygonite', name: 'Commandeur krygonite', weapon: 'Arme de commandement', special: 'Renforts krygonites', visualAnchor: 'Senior Krygonite officer with ornate command armor and a tactical holographic display.', fr: 'Le commandeur dirige les opérations krygonites sur le terrain.', en: 'The commander directs Krygonite field operations.' },
    { id: 'krasbeurk', name: 'Lieutenant Krasbeurk', weapon: 'Blaster d’officier', special: 'Contre-attaque de Krasbeurk', visualAnchor: 'Named Krygonite lieutenant with recognizable officer panel, compact blaster and severe stance.', fr: 'Krasbeurk est un officier identifié, pas un simple soldat renommé.', en: 'Krasbeurk is a named officer, not a relabeled rank-and-file soldier.' },
    { id: 'haldar', name: 'Haldar', weapon: 'Réseau d’influence du Consortium', special: 'Manipulation de campagne électorale', visualAnchor: 'Human political strategist in a terrestrial Consortium meeting room with advisers, campaign dossiers and communications screens; no alien armor or melee weapon.', fr: 'Cadre du Consortium, Haldar protège les intérêts économiques de ses employeurs par une stratégie électorale ; sa complicité krygonite mène à son arrestation pour haute trahison.', en: 'A Consortium executive, Haldar protects his employers’ economic interests through election strategy; exposing his Krygonite complicity leads to his arrest for high treason.', canonStatus: 'canon political-economic antagonist; expose-and-arrest encounter', entityType: 'political-investigation-trial', nonCombat: true, objective: 'Gather the campaign evidence, expose Haldar’s Krygonite complicity and obtain his arrest for high treason.', objectiveFr: 'Rassembler les preuves de campagne, dévoiler la complicité krygonite de Haldar puis obtenir son arrestation pour haute trahison.', victoryCondition: 'expose-and-arrest', referenceUrls: ['https://www.knarfworld.net/sites/default/files/survivaure_episode_11.pdf', 'https://www.knarfworld.net/sites/default/files/Episode_16.pdf'] }
  ],
  worldBoss: { id: 'grand_gluant', name: 'Le Grand Gluant', weapon: 'Commandement de la flotte krygonite', special: 'Ordre de destruction planétaire', visualAnchor: 'Physical tentacled Krygonite sovereign aboard the command deck of his personal cruiser, imperial control displays and fleet formations; limacine and imposing but never an amorphous blob.', fr: 'Le Grand Gluant est le souverain de l’Empire krygonite et le commandant suprême de sa flotte depuis son croiseur personnel.', en: 'The Grand Gluant is sovereign of the Krygonite Empire and supreme commander of its fleet from his personal cruiser.', canonStatus: 'canon Krygonite sovereign and supreme fleet commander', entityType: 'fleet-command-world-boss', objective: 'Board the personal cruiser, disrupt the planetary-destruction order and defeat the Krygonite supreme command.', referenceUrls: ['https://www.knarfworld.net/sites/default/files/Episode_15.pdf', 'https://www.knarfworld.net/sites/default/files/Episode_16.pdf'] },
  stage: { name: 'NHL2987 Survivaure — pont principal', visualAnchor: 'Compact retro-future bridge, blue readouts, worn metal bulkheads and the crew’s mismatched stations.', fr: 'Le pont du Survivaure devient le centre d’une bataille de communications et de systèmes défaillants.', en: 'The Survivaure bridge becomes the center of a fight over communications and failing systems.' },
  stageVariants: [
    stageVariant('Smash', 'Prison krygonite', 'Very Hard', 'Lieutenant Krasbeurk', { objective: 'Open the cells and escape before the lockdown completes.' }),
    stageVariant('Tactics', 'Croiseur personnel du Grand Gluant', 'Expert', 'Le Grand Gluant', { objective: 'Disrupt the planetary-destruction order across the command deck and fleet relays.' })
  ],
  gear: [
    { id: 'blaster_reglementaire', enName: 'Regulation Blaster', frName: 'Blaster réglementaire', boost: { atk: 8, spd: 1 }, visualAnchor: 'Compact retro-future sidearm matching the saga’s military parody rather than a modern real weapon.', fr: 'L’arme de service de l’équipage.', en: 'The crew’s service weapon.' },
    { id: 'console_diagnostic', enName: 'Engineering Diagnostic Console', frName: 'Console de diagnostic', boost: { def: 6, hp: 45 }, visualAnchor: 'Portable diagnostic slab with cable leads and simple blue waveform display.', fr: 'Rasmusen s’en sert pour comprendre les pannes du NHL2987.', en: 'Rasmusen uses it to understand the NHL2987’s failures.' },
    { id: 'combinaison_spatiale', enName: 'Survivaure Space Suit', frName: 'Combinaison spatiale du Survivaure', boost: { hp: 65, def: 3 }, visualAnchor: 'Bulky patched space suit with broad collar ring and practical life-support pack.', fr: 'Une protection spatiale fonctionnelle malgré son entretien incertain.', en: 'Functional space protection despite uncertain maintenance.' }
  ],
  event: { id: 'ordre_bleuten', enName: 'Bleûten’s Emergency Order', frName: 'Ordre d’urgence de Bleûten', en: 'Bleûten issues an urgent maneuver while Johnson covers Rasmusen’s emergency rerouting.', fr: 'Bleûten lance une manœuvre urgente pendant que Johnson couvre le reroutage de secours de Rasmusen.', visualAnchor: 'Three stations on the NHL2987 bridge lighting in rapid sequence.' }
}));
}
