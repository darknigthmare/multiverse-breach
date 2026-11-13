// Gex — definitions consumed by src/game/canonRosterWavePartE.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createSources() {
  return (Object.freeze({ key: 'gex', universe: 'Gex', url: 'https://gextrilogy.com/' }));
}

export function createCanonRosterWavePartE({ SOURCES, definePack, stageVariant }) {
  return (definePack(SOURCES.gex, {
  aliases: ['Gex Trilogy', 'Gex the Gecko'], mediaType: 'game-franchise', faction: 'tech', mode: 'RPG', difficulty: 'Hard',
  colors: ['#3f8c39', '#10180e', '#d8bd43'], motif: 'television',
  theme: 'channel-surfing platform adventures inside the Media Dimension',
  continuity: 'Crystal Dynamics Gex trilogy as preserved in the official Gex Trilogy collection',
  adaptationRule: 'Gex is the only frontline fighter. Agent Xtra and Alfred remain canon support allies; do not sexualise Xtra, imitate a performer, or turn Alfred into a generic ninja turtle. Rez and named trilogy bosses retain their television-world identities.',
  visualAnchor: '1990s cathode-ray televisions opening into themed channels, remote controls, saturated low-poly sets and Gex’s green gecko silhouette.',
  canonStatus: 'canon trilogy anthology with support allies transparently adapted as playable specialists',
  fr: 'Gex replonge dans la Dimension Média avec l’aide à distance de l’Agent Xtra et de son majordome Alfred pour couper le signal de Rez.',
  en: 'Gex dives back into the Media Dimension with remote support from Agent Xtra and his butler Alfred to cut Rez’s signal.',
  referenceUrls: [SOURCES.gex.url, 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/Manual/formated/Gex_3-_Deep_Cover_Gecko_-_1999_-_Eidos_Interactive.pdf'],
  characters: [
    { id: 'gex', name: 'Gex', role: 'slayer', weapon: 'Tail whip', weaponType: 'fists', secondary: 'Tongue grab', defense: 'Wall-cling evade', special: 'Channel-surfing tailspin', visualAnchor: 'Small anthropomorphic green gecko with cream belly, expressive brow, long whipping tail and bare clawed feet; no costume unless a level-specific disguise is named.', fr: 'Le gecko téléphage traverse les écrans grâce à sa queue, sa langue et son adhérence aux murs.', en: 'The television-obsessed gecko crosses screens using his tail, tongue and wall grip.' },
    { id: 'agent_xtra', name: 'Agent Xtra', role: 'hacker', weapon: 'Mission uplink', weaponType: 'focus', secondary: 'Channel intelligence', defense: 'Encrypted relay', special: 'Media Dimension override', visualAnchor: 'Original stylised secret agent shown through a compact video communicator, practical dark-red field jacket and earpiece; no live-action performer likeness, glamour pose or sexualisation.', fr: 'Partenaire de mission de Gex, Xtra fournit les renseignements et doit être sauvée de Rez dans Deep Cover Gecko.', en: 'Gex’s mission partner supplies intelligence and must be rescued from Rez in Deep Cover Gecko.', canonStatus: 'canon mission partner adapted as noncombat support', nonCombat: true, objective: 'Guide Gex through the channel grid and maintain the secure uplink.' },
    { id: 'alfred', name: 'Alfred', role: 'tactical', weapon: 'Butler’s mission console', weaponType: 'focus', secondary: 'Secret-level briefing', defense: 'Island security', special: 'Emergency channel route', visualAnchor: 'Small elderly anthropomorphic tortoise butler in a neat black tailcoat, round spectacles and white gloves, carrying a compact console; no martial-arts redesign.', fr: 'Le fidèle majordome tortue de Gex l’assiste depuis son île et signale les urgences.', en: 'Gex’s loyal tortoise butler assists from the island and reports emergencies.', canonStatus: 'canon butler adapted as noncombat tactical support', nonCombat: true, objective: 'Unlock secret routes and coordinate extraction from the Media Dimension.' }
  ],
  monsters: [
    { id: 'rezling', name: 'Rezling', weapon: 'Channel-static claws', special: 'Television spawn', visualAnchor: 'Small purple-black Media Dimension creature built from angular 1990s game geometry and flickering scanline highlights.', fr: 'Un sbire engendré par le signal corrompu de Rez.', en: 'A minion spawned by Rez’s corrupted signal.', canonStatus: 'canon recurring Rez minion' },
    { id: 'mecha_rezling', name: 'Mecha Rezling', weapon: 'Mechanical pounce', special: 'Static discharge', visualAnchor: 'Compact metal Rezling variant with green CRT glow, exposed rivets and a low-poly jaw.', fr: 'Une variante mécanique renforcée des créatures de Rez.', en: 'A reinforced mechanical variant of Rez’s creatures.', canonStatus: 'canon trilogy enemy variant' },
    { id: 'rez_trooper', name: 'Rez Trooper', weapon: 'Media blaster', special: 'Channel ambush', visualAnchor: 'Cartoon television-world guard with angular purple armour, antenna pack and original abstract screen emblem.', fr: 'Un garde de chaîne chargé de bloquer les téléviseurs de sortie.', en: 'A channel guard assigned to block exit televisions.', canonStatus: 'canon-derived Media Dimension enemy class' }
  ],
  bosses: [
    { id: 'flatulator', name: 'The Flatulator', weapon: 'Toxic gas bursts', special: 'Waste-plant pressure wave', visualAnchor: 'Bulky mutant boss from the first Gex framed by pipes, toxic green vapor and chunky 2D-game proportions.', fr: 'Le boss des installations toxiques du premier Gex sature l’arène de gaz.', en: 'The first Gex game’s toxic-facility boss fills the arena with gas.' },
    { id: 'mooshoo_pork', name: 'Mooshoo Pork', weapon: 'Sumo charges', special: 'Arena shockwave', visualAnchor: 'Massive cartoon pig sumo boss in a television martial-arts set, preserving the exaggerated Gex 2 silhouette without ethnic caricature.', fr: 'Le boss de la chaîne Kung Fu Theater impose des charges de sumo.', en: 'The Kung Fu Theater channel boss attacks with sumo charges.', canonStatus: 'canon Gex: Enter the Gecko boss' },
    { id: 'mecha_rez', name: 'Mecha Rez', weapon: 'Mechanical tail and missiles', special: 'Channel Z overload', visualAnchor: 'Huge robotic Rez replica with angular purple shell, green-lit joints and CRT-era launch pods.', fr: 'La réplique mécanique de Rez défend Channel Z.', en: 'Rez’s mechanical replica defends Channel Z.', canonStatus: 'canon Gex: Enter the Gecko final machine' }
  ],
  worldBoss: { id: 'rez', name: 'Rez', weapon: 'Media Dimension control', special: 'Total channel takeover', visualAnchor: 'Tall purple cybernetic reptilian overlord emerging from a wall of cathode-ray screens, angular red eyes and long segmented tail.', fr: 'L’ennemi juré de Gex tente une nouvelle fois de prendre le contrôle de la Dimension Média.', en: 'Gex’s archenemy once again attempts to control the Media Dimension.', canonStatus: 'canon trilogy principal antagonist', objective: 'Break Rez’s channel relays and eject his signal from every television gateway.' },
  stage: { name: 'Media Dimension — Hub des téléviseurs', visualAnchor: 'Dark floating hub lined with glowing CRT portals, remote-control pedestals and separate horror, cartoon and science-fiction channels.', fr: 'Chaque téléviseur ouvre une chaîne thématique contrôlée par Rez.', en: 'Each television opens a themed channel controlled by Rez.' },
  stageVariants: [stageVariant('RPG', 'Kung Fu Theater', 'Hard', 'Mooshoo Pork', { objective: 'Use tail timing to redirect the sumo charges.' }), stageVariant('Tactics', 'Channel Z — coupure du signal', 'Expert', 'Rez', { objective: 'Disable every broadcast relay before confronting Rez.' })],
  gear: [
    { id: 'red_remote', enName: 'Red Remote', frName: 'Télécommande rouge', boost: { atk: 6, spd: 2 }, visualAnchor: 'Chunky red 1990s television remote with one glowing green button and no readable branding.', fr: 'Une télécommande de progression qui ouvre de nouvelles chaînes.', en: 'A progression remote that opens new channels.' },
    { id: 'paw_coin', enName: 'Gex Paw Coin', frName: 'Pièce-patte de Gex', boost: { hp: 55, def: 3 }, visualAnchor: 'Round golden collectible embossed with an original three-toed gecko paw.', fr: 'Un objet de collecte dissimulé dans les niveaux.', en: 'A collectible hidden throughout the levels.' },
    { id: 'firefly', enName: 'Firefly Power-up', frName: 'Bonus luciole', boost: { hp: 45, atk: 4 }, visualAnchor: 'Small warm-yellow cartoon firefly encased in a transparent television pickup bubble.', fr: 'Une luciole confère temporairement une capacité à Gex.', en: 'A firefly temporarily grants Gex an ability.' }
  ],
  event: { id: 'prime_time', enName: 'Prime-Time Channel Sweep', frName: 'Balayage des chaînes en prime time', en: 'Gex clears three television genres in sequence while Xtra and Alfred keep the exit frequency stable.', fr: 'Gex nettoie trois genres télévisés à la suite tandis que Xtra et Alfred stabilisent la fréquence de sortie.', visualAnchor: 'Three CRT portals changing from horror to cartoon to science fiction around Gex’s exact green silhouette.' }
}));
}
