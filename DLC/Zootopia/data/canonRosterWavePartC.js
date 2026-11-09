// Zootopia — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createZootopia() {
  return (Object.freeze({
  key: 'zootopia',
  universe: 'Zootopia',
  url: 'https://movies.disney.com/zootopia'
}));
}

export function createZootopia2({ ZOOTOPIA, definePack, stageVariant }) {
  return (definePack(ZOOTOPIA, {
  aliases: ['Zootopie', 'Zootropolis'],
  mediaType: 'movie', faction: 'sciFi', mode: 'Tactics', difficulty: 'Hard',
  colors: ['#266b86', '#071217', '#f2a73a'], motif: 'city',
  theme: 'ZPD investigation into the Night Howler conspiracy in the 2016 film',
  continuity: 'Zootopia (2016) first film only',
  adaptationRule: 'Never classify an animal species as inherently hostile. Savage predators are poisoned victims who must be cured. Manchas and Mr. Big are nonlethal story encounters, and Bellwether is exposed, recorded and arrested rather than killed.',
  visualAnchor: 'Multi-scale mammal metropolis with Savanna Central glass towers, tiny rodent infrastructure, climate districts and ZPD blue-orange lighting.',
  canonStatus: '2016 film canon with investigation and nonlethal encounter rules',
  fr: 'Judy, Nick et Bogo suivent la piste des Hurleurs nocturnes jusqu’au complot de Bellwether sans transformer les prédateurs victimes en ennemis par nature.',
  en: 'Judy, Nick and Bogo trace the Night Howlers to Bellwether’s conspiracy without treating poisoned predator victims as natural enemies.',
  referenceUrls: [ZOOTOPIA.url, 'https://www.disney.co.jp/fc/zootopia/character/bellwether', 'https://assets.scriptslug.com/live/pdf/scripts/zootopia-2016.pdf'],
  characters: [
    { id: 'judy_hopps', runtimeId: 'judy_hopps', name: 'Judy Hopps', role: 'tactical', weapon: 'Recovered Night Howler dart launcher loaded with antidote', weaponType: 'gun', simple: 'Antidote dart', secondary: 'Carrot recorder feint', defense: 'Rabbit footwork', special: 'Case breakthrough', visualAnchor: 'Small gray rabbit in a fitted blue ZPD patrol uniform, utility belt and long upright ears; original fan-made proportions.', fr: 'Première lapine policière du ZPD, Judy mène l’enquête avec détermination ; le lanceur récupéré sert uniquement à administrer l’antidote.', en: 'The ZPD’s first rabbit officer, Judy drives the investigation; the recovered launcher is used only to deliver antidote.', canonStatus: 'canon protagonist with disclosed nonlethal rescue-tool adaptation', equipmentSource: 'Recovered from Bellwether’s Night Howler conspiracy, not ZPD issue.' },
    { id: 'nick_wilde', runtimeId: 'nick_wilde', name: 'Nick Wilde', role: 'hacker', weapon: 'Investigation ruse', weaponType: 'focus', simple: 'Streetwise distraction', secondary: 'Pawpsicle hustle', defense: 'Fox sidestep', special: 'Recorded confession setup', visualAnchor: 'Slim red fox in light green short-sleeve shirt, striped tie and tan trousers, expressive ears and tail.', fr: 'Nick met ses combines et sa lecture de la ville au service de l’enquête.', en: 'Nick puts his hustles and knowledge of the city to work for the case.' },
    { id: 'chief_bogo', runtimeId: 'chief_bogo', name: 'Chief Bogo', role: 'marine', weapon: 'ZPD command', weaponType: 'focus', simple: 'Commanding push', secondary: 'ZPD backup', defense: 'Buffalo brace', special: 'Precinct lockdown', visualAnchor: 'Massive Cape buffalo in dark blue ZPD command uniform with gold insignia, broad horns and stern posture.', fr: 'Le chef du ZPD engage les moyens de la police lorsque les preuves sont établies.', en: 'The ZPD chief commits police resources once the evidence is established.' }
  ],
  monsters: [
    { id: 'duke_weaselton', name: 'Duke Weaselton', weapon: 'Stolen goods bag', special: 'Little Rodentia escape', visualAnchor: 'Small brown weasel in a red sleeveless top carrying a stolen-goods sack, scaled correctly against city props.', fr: 'Le voleur à la petite semaine fuit Judy à travers Little Rodentia.', en: 'The petty thief flees Judy through Little Rodentia.', canonStatus: 'canon suspect; arrest objective', entityType: 'nonlethal-suspect', nonCombat: true, objective: 'Catch and arrest Duke without harming bystanders.', objectiveFr: 'Rattraper et arrêter Duke sans blesser les passants.' },
    { id: 'woolter', name: 'Woolter', weapon: 'Ram tackle', special: 'Bellwether ram-cop formation', visualAnchor: 'Black-wool ram in a white T-shirt, bright red suspenders and blue jeans, with curled horns and compact build.', fr: 'Woolter est l’un des béliers impliqués dans le complot de Bellwether.', en: 'Woolter is one of the rams involved in Bellwether’s conspiracy.', canonStatus: 'canon conspirator; nonlethal arrest target', entityType: 'conspirator' },
    { id: 'jesse', name: 'Jesse', weapon: 'Ram tackle', special: 'Evidence-room blockade', visualAnchor: 'Gray-wool one-eyed ram with an eye patch, green T-shirt and blue jeans, distinct from Woolter.', fr: 'Jesse protège les opérations clandestines liées aux Hurleurs nocturnes.', en: 'Jesse protects the clandestine Night Howler operation.', canonStatus: 'canon conspirator; nonlethal arrest target', entityType: 'conspirator' }
  ],
  bosses: [
    { id: 'manchas', name: 'Renato Manchas', weapon: 'Night Howler frenzy', special: 'Rainforest District chase', visualAnchor: 'Large black jaguar in torn chauffeur clothes, eyes and posture showing drug-induced distress rather than villainy.', fr: 'Manchas est une victime empoisonnée ; il faut lui administrer l’antidote, pas le tuer.', en: 'Manchas is a poisoned victim; the objective is to administer the antidote, not kill him.', canonStatus: 'canon poisoned victim and rescue encounter', entityType: 'rescue-target', nonCombat: true, objective: 'Cure Manchas with a Night Howler antidote dart.', objectiveFr: 'Soigner Manchas avec une fléchette d’antidote au Hurleur nocturne.', victoryCondition: 'cure' },
    { id: 'mr_big', name: 'Mr. Big', weapon: 'Tundratown authority', special: 'Icing threat', visualAnchor: 'Tiny arctic shrew in formal black suit seated at an oversized desk, flanked only by environmental polar-bear silhouettes.', fr: 'Mr. Big menace d’abord Judy et Nick puis leur fournit une piste ; la victoire est une négociation.', en: 'Mr. Big initially threatens Judy and Nick, then supplies a lead; victory is negotiation.', canonStatus: 'canon initial threat and later ally', entityType: 'dialogue-trial', nonCombat: true, objective: 'Earn Mr. Big’s trust and obtain the Manchas lead.', objectiveFr: 'Gagner la confiance de Mr. Big puis obtenir la piste menant à Manchas.', victoryCondition: 'negotiate' },
    { id: 'doug', name: 'Doug', weapon: 'Night Howler dart rifle', special: 'Subway lab ambush', visualAnchor: 'Ram chemist in yellow protective coveralls and respirator beside blue Night Howler serum canisters.', fr: 'Doug fabrique et tire les doses de Hurleur nocturne depuis le laboratoire du métro.', en: 'Doug manufactures and fires Night Howler doses from the subway lab.', canonStatus: 'canon conspirator; arrest target', entityType: 'chemist-shooter', objective: 'Secure the serum evidence and arrest Doug.' }
  ],
  worldBoss: { id: 'bellwether', name: 'Mayor Dawn Bellwether', weapon: 'Fear campaign', special: 'Night Howler conspiracy', visualAnchor: 'Small cream-wool sheep in a blue business suit framed by museum displays, a dart case and the carrot recorder evidence.', fr: 'Bellwether est vaincue lorsque son complot et ses aveux sont enregistrés puis remis au ZPD.', en: 'Bellwether is defeated when her conspiracy and confession are recorded and delivered to the ZPD.', canonStatus: 'canon principal antagonist; expose-and-arrest finale', entityType: 'investigation-world-boss', nonCombat: true, objective: 'Bait Bellwether into confessing, record the evidence and arrest her.', objectiveFr: 'Pousser Bellwether à avouer, enregistrer les preuves puis l’arrêter.', victoryCondition: 'expose-confession-and-arrest' },
  stage: { name: 'Cliffside Asylum — aile des disparus', visualAnchor: 'Abandoned cliffside hospital with barred observation cells, wet concrete, vines and evidence boards, no horror gore.', fr: 'Judy et Nick découvrent les prédateurs disparus enfermés à Cliffside.', en: 'Judy and Nick discover the missing predators confined at Cliffside.' },
  stageVariants: [
    stageVariant('RPG', 'Tundratown — manoir de Mr. Big', 'Hard', 'Mr. Big', { objective: 'Negotiate for the Manchas lead; violence fails the scene.' }),
    stageVariant('Tactics', 'Musée d’histoire naturelle — aveux', 'Very Hard', 'Mayor Dawn Bellwether', { objective: 'Record Bellwether’s confession and complete a nonlethal arrest.' })
  ],
  gear: [
    { id: 'carrot_recorder', enName: 'Carrot Recorder Pen', frName: 'Stylo-carotte enregistreur', boost: { atk: 6, spd: 2 }, visualAnchor: 'Orange carrot-shaped pen with green clip and tiny recorder grille.', fr: 'Le stylo de Judy enregistre la confession décisive.', en: 'Judy’s pen captures the decisive confession.' },
    { id: 'zpd_badge', enName: 'ZPD Badge', frName: 'Insigne du ZPD', boost: { def: 6, hp: 45 }, visualAnchor: 'Small gold shield-shaped police badge with original unreadable markings rather than copied logo text.', fr: 'L’insigne matérialise l’autorité policière et ses responsabilités.', en: 'The badge represents police authority and its responsibilities.' },
    { id: 'night_howler_antidote', enName: 'Night Howler Antidote', frName: 'Antidote aux Hurleurs nocturnes', boost: { hp: 70 }, visualAnchor: 'Blue antidote vial and nonlethal dart in a sealed evidence pouch.', fr: 'L’antidote permet de sauver les victimes empoisonnées.', en: 'The antidote saves poisoned victims.' }
  ],
  event: { id: 'case_breakthrough', enName: 'Night Howler Case Breakthrough', frName: 'Percée dans l’affaire des Hurleurs nocturnes', en: 'Evidence links the serum, Doug’s lab and Bellwether, converting every victim encounter into a rescue objective.', fr: 'Les preuves relient le sérum, le laboratoire de Doug et Bellwether, transformant chaque rencontre de victime en mission de sauvetage.', visualAnchor: 'ZPD evidence board linking blue serum vials, subway route and a carrot recorder without readable copyrighted text.' }
}));
}
