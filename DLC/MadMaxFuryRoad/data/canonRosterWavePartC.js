// Mad Max: Fury Road — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createFuryRoad() {
  return (Object.freeze({
  key: 'mad_max_fury_road',
  universe: 'Mad Max: Fury Road',
  url: 'https://www.warnerbros.it/scheda-film/genere-avventura/mad-max-fury-road/'
}));
}

export function createFuryRoad2({ FURY_ROAD, definePack, stageVariant }) {
  return (definePack(FURY_ROAD, {
  aliases: ['Mad Max Fury Road'],
  mediaType: 'movie', faction: 'sciFi', mode: 'Smash', difficulty: 'Expert',
  colors: ['#c1602d', '#211108', '#f1c15c'], motif: 'desertconvoy',
  theme: 'War Rig escape, desert pursuit and return to the Citadel',
  continuity: 'Mad Max: Fury Road (2015) film and official DC prelude',
  adaptationRule: 'Follow the film’s convoy chronology and Nux’s redemption. Keep vehicles and wasteland silhouettes recognisable but use original fan-made art without actor likeness or copied official assets.',
  visualAnchor: 'Orange Namib desert, cyan storm shadows, practical scrap vehicles, War Rig tanker silhouette and vertical Citadel cliffs.',
  canonStatus: '2015 film canon with original fan-made visual adaptation',
  fr: 'Max, Furiosa et Nux brisent la poursuite d’Immortan Joe puis ramènent les épouses et les graines vers la Citadelle.',
  en: 'Max, Furiosa and Nux break Immortan Joe’s pursuit, then return the wives and seeds to the Citadel.',
  referenceUrls: [FURY_ROAD.url, 'https://www.dc.com/comics/mad-max-fury-road-2015/mad-max-fury-road-nux-and-immortan-joe-1', 'https://assets.scriptslug.com/live/pdf/scripts/mad-max-fury-road-2015.pdf'],
  characters: [
    { id: 'max', runtimeId: 'max_rockatansky_fr', name: 'Max Rockatansky', role: 'slayer', weapon: 'Sawed-off shotgun', weaponType: 'gun', simple: 'Close shotgun blast', secondary: 'Chain disarm', defense: 'Road-warrior roll', special: 'Convoy counterattack', visualAnchor: 'Weathered road warrior in dusty leather jacket, neck brace remnants and practical desert gear; no actor likeness.', fr: 'Max passe de captif solitaire à partenaire essentiel de l’évasion.', en: 'Max changes from solitary captive to an essential partner in the escape.' },
    { id: 'furiosa', runtimeId: 'furiosa_fr', name: 'Imperator Furiosa', role: 'tactical', weapon: 'SKS rifle', weaponType: 'gun', simple: 'Controlled rifle shot', secondary: 'Prosthetic-arm strike', defense: 'War Rig cover', special: 'Imperator convoy maneuver', visualAnchor: 'Furiosa with shaved head silhouette, dark forehead paint, white wrap top, mechanical left arm and utility trousers; no actor likeness.', fr: 'Furiosa conduit le War Rig et organise la libération des épouses.', en: 'Furiosa drives the War Rig and organizes the wives’ liberation.' },
    { id: 'nux', runtimeId: 'nux_fr', name: 'Nux', role: 'marine', weapon: 'War Boy car spear', weaponType: 'blade', simple: 'Vehicle spear jab', secondary: 'Engine boost', defense: 'Repentant guard', special: 'Witness Me redemption', visualAnchor: 'Pale War Boy with scarification, cargo trousers and engine grease, later protecting the escapees; no actor likeness.', fr: 'Nux renonce à la gloire d’Immortan Joe et se sacrifie pour le groupe.', en: 'Nux rejects Immortan Joe’s promised glory and sacrifices himself for the group.', canonStatus: 'canon redeemed War Boy hero' }
  ],
  monsters: [
    { id: 'war_boy', name: 'War Boy', weapon: 'Thunder stick', special: 'Vehicle boarding leap', visualAnchor: 'Pale Citadel War Boy with white body paint, goggles and explosive thunder stick on a scrap vehicle.', fr: 'Un fanatique motorisé de la Citadelle.', en: 'A motorized Citadel zealot.' },
    { id: 'polecat', name: 'Polecat', weapon: 'Swinging pole', special: 'Convoy pendulum assault', visualAnchor: 'War Boy suspended atop a long flexing pole over the convoy with desert goggles and hooked weapon.', fr: 'Le Polecat attaque depuis une longue perche articulée.', en: 'The Polecat attacks from a long articulated pole.' },
    { id: 'rock_rider', name: 'Rock Rider', weapon: 'Motorcycle spear', special: 'Canyon bike swarm', visualAnchor: 'Masked canyon biker on a stripped dirt motorcycle carrying a long explosive spear.', fr: 'Les Rock Riders harcèlent le War Rig dans le canyon.', en: 'Rock Riders harry the War Rig through the canyon.' }
  ],
  bosses: [
    { id: 'rictus', name: 'Rictus Erectus', weapon: 'Raw strength', special: 'War Rig engine tear', visualAnchor: 'Immense Citadel enforcer with breathing harness, bare muscular torso and heavy utility gear; no actor likeness.', fr: 'Rictus poursuit le War Rig par la force brute.', en: 'Rictus pursues the War Rig through brute force.' },
    { id: 'bullet_farmer', name: 'The Bullet Farmer', weapon: 'Twin machine guns', special: 'Blind marsh barrage', visualAnchor: 'Wasteland arms baron in ammunition-covered coat and headgear firing from a tracked vehicle; no actor likeness.', fr: 'Le Bullet Farmer couvre le marais d’un tir aveugle.', en: 'The Bullet Farmer fills the marsh with blind gunfire.' },
    { id: 'people_eater', name: 'The People Eater', weapon: 'Gaston limousine guns', special: 'Fuel convoy squeeze', visualAnchor: 'Corpulent wasteland baron in formal scrap attire aboard the ornate Gastown limousine; no actor likeness.', fr: 'Le People Eater engage les ressources de Gastown dans la poursuite.', en: 'The People Eater commits Gastown’s resources to the pursuit.' }
  ],
  worldBoss: { id: 'immortan_joe', name: 'Immortan Joe', weapon: 'Gigahorse pursuit', special: 'Citadel war party', visualAnchor: 'Masked Citadel ruler in transparent chest armor aboard the twin-V8 Gigahorse, white-clad war convoy behind him; no actor likeness.', fr: 'Immortan Joe mène personnellement la poursuite finale avant la reconquête de la Citadelle.', en: 'Immortan Joe personally leads the final pursuit before the Citadel is reclaimed.', canonStatus: 'canon principal antagonist', entityType: 'convoy-world-boss', objective: 'Disable the Gigahorse, protect the War Rig and open the return road to the Citadel.' },
  stage: { name: 'War Rig — poursuite dans le désert', visualAnchor: 'Armored tanker crossing orange desert at speed, practical scrap convoy, dust plumes and cyan horizon.', fr: 'Le War Rig doit maintenir sa vitesse tout en repoussant les véhicules de la Citadelle.', en: 'The War Rig must keep moving while repelling the Citadel convoy.' },
  stageVariants: [
    stageVariant('Tactics', 'Marais du Bullet Farmer', 'Very Hard', 'The Bullet Farmer', { objective: 'Extinguish the lights and cross the mud under blind fire.' }),
    stageVariant('Smash', 'Retour à la Citadelle — Gigahorse', 'Expert', 'Immortan Joe', { objective: 'Board the Gigahorse and reopen the Citadel route.' })
  ],
  gear: [
    { id: 'furiosa_prosthesis', enName: 'Furiosa’s Prosthetic Arm', frName: 'Bras mécanique de Furiosa', boost: { atk: 8, spd: 1 }, visualAnchor: 'Practical cable-and-metal left-arm prosthesis with articulated fingers and leather harness.', fr: 'Le bras mécanique fonctionnel de l’Imperator.', en: 'The Imperator’s functional mechanical arm.' },
    { id: 'green_place_seeds', enName: 'Green Place Seeds', frName: 'Graines du Green Place', boost: { def: 6, hp: 45 }, visualAnchor: 'Small cloth satchel of carefully preserved seeds, dusty but intact.', fr: 'Les graines préservées portent l’espoir d’un avenir différent.', en: 'The preserved seeds carry hope for a different future.' },
    { id: 'war_rig_engine', enName: 'War Rig Engine Relay', frName: 'Relais moteur du War Rig', boost: { hp: 60, atk: 4 }, visualAnchor: 'Grease-covered mechanical relay and braided cable from the practical tanker engine bay.', fr: 'Une pièce vitale pour maintenir le War Rig en mouvement.', en: 'A vital component that keeps the War Rig moving.' }
  ],
  event: { id: 'turn_the_rig', enName: 'Turn the War Rig Around', frName: 'Faire demi-tour au War Rig', en: 'The convoy reverses course toward the undefended Citadel, turning pursuit into liberation.', fr: 'Le convoi repart vers la Citadelle sans défense, transformant la fuite en libération.', visualAnchor: 'War Rig carving a broad turn in the salt desert as the sunrise reveals the route back.' }
}));
}
