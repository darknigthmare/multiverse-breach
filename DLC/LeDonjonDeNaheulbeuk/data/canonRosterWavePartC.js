// Le Donjon de Naheulbeuk — definitions consumed by src/game/canonRosterWavePartC.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createNaheulbeuk() {
  return (Object.freeze({
  key: 'naheulbeuk',
  universe: 'Le Donjon de Naheulbeuk',
  url: 'https://www.naheulbeuk.com/amulettedudesordre/index-personnages.htm'
}));
}

export function createNaheulbeuk2({ NAHEULBEUK, definePack, stageVariant }) {
  return (definePack(NAHEULBEUK, {
  aliases: ['Dongeon de Naheulbeuk', 'Donjon de Naheulbeuk'],
  mediaType: 'audio-drama', faction: 'arcane', mode: 'RPG', difficulty: 'Hard',
  colors: ['#513521', '#120d09', '#d8a83f'], motif: 'dungeon',
  theme: 'heroic-fantasy dungeon parody, disastrous teamwork and the Amulet of Chaos quest',
  continuity: 'Pen of Chaos audio saga and official character/bestiary material',
  adaptationRule: 'Keep the dysfunctional party heroic and distinct. Use named canon antagonists; do not replace the saga with generic fantasy archetypes.',
  visualAnchor: 'Stone dungeon corridors, torchlight, treasure clutter and the deliberately mismatched adventuring party described by Pen of Chaos.',
  canonStatus: 'canon audio-saga roster with transparent combat adaptation',
  fr: 'Le Ranger tente de mener une compagnie notoirement désunie dans le donjon de Zangdar, tandis que l’Amulette du Désordre attire des menaces bien plus vastes.',
  en: 'The Ranger tries to lead a notoriously dysfunctional company through Zangdar’s dungeon while the Amulet of Chaos attracts far greater threats.',
  referenceUrls: [NAHEULBEUK.url, 'https://www.naheulbeuk.com/maitredudonjon/', 'https://www.naheulbeuk.com/doc-baston.htm', 'https://www.penofchaos.com/warham/donjon-episodes.htm'],
  characters: [
    { id: 'ranger', name: 'Le Ranger', role: 'tactical', weapon: 'Épée du Ranger', weaponType: 'blade', simple: 'Coup d’épée prudent', secondary: 'Plan approximatif', defense: 'Repli tactique', special: 'Chef de compagnie malgré lui', visualAnchor: 'Human ranger with brown travel leathers, green cloak, short sword and the weary posture of an improvised leader.', fr: 'Chef autoproclamé du groupe, il tente de coordonner les autres avec une patience très relative.', en: 'The group’s self-appointed leader tries to coordinate everyone with very limited patience.' },
    { id: 'magicienne', name: 'La Magicienne', role: 'hacker', weapon: 'Sortilèges', weaponType: 'magic', simple: 'Projectile magique', secondary: 'Invocation étudiée', defense: 'Barrière arcanique', special: 'Sort du grimoire', visualAnchor: 'Young human magician in a practical robe, spellbook and staff, scholarly rather than armored.', fr: 'Érudite et polyglotte, elle compense les lacunes du groupe par ses connaissances et ses sorts.', en: 'A learned polyglot, she offsets the party’s shortcomings with knowledge and spells.' },
    { id: 'nain', name: 'Le Nain', role: 'slayer', weapon: 'Hache naine', weaponType: 'blade', simple: 'Coup de hache', secondary: 'Charge rancunière', defense: 'Solidité naine', special: 'Fureur cupide', visualAnchor: 'Short, broad dwarf in heavy mail with a large axe, beard and permanently combative expression.', fr: 'Résistant, cupide et querelleur, le Nain préfère la hache aux longues explications.', en: 'Tough, greedy and quarrelsome, the Dwarf prefers his axe to lengthy explanations.' }
  ],
  monsters: [
    { id: 'gobelin', name: 'Gobelin', weapon: 'Lame grossière', special: 'Embuscade en bande', visualAnchor: 'Small green dungeon goblin in scavenged leather carrying a crude blade.', fr: 'Un pillard du donjon dangereux surtout lorsqu’il agit en bande.', en: 'A dungeon raider most dangerous when attacking in a pack.' },
    { id: 'orque', name: 'Orque', weapon: 'Hachoir orque', special: 'Assaut brutal', visualAnchor: 'Broad green-skinned orc with battered iron plates and a heavy cleaver.', fr: 'Fantassin brutal des profondeurs, plus solide qu’un gobelin.', en: 'A brutal undercroft infantryman, sturdier than a goblin.' },
    { id: 'troll', name: 'Troll', weapon: 'Massue', special: 'Régénération du troll', visualAnchor: 'Towering cave troll with rough hide, simple loincloth and an uprooted club.', fr: 'Une masse vivante difficile à abattre sans méthode.', en: 'A living battering ram that is difficult to stop without a plan.' }
  ],
  bosses: [
    { id: 'zangdar', name: 'Zangdar', weapon: 'Magie noire', special: 'Pièges du maître du donjon', visualAnchor: 'Lean human dark wizard in an imposing black robe, angular silhouette and dungeon-master control dais.', fr: 'Le maître du donjon orchestre les pièges depuis ses salles de contrôle.', en: 'The dungeon master orchestrates traps from his control rooms.' },
    { id: 'golbargh', name: 'Golbargh', weapon: 'Crocs et griffes', special: 'Ruée monstrueuse', visualAnchor: 'Huge horned fantasy monster occupying most of a torchlit stone chamber.', fr: 'Une créature majeure du donjon qui exige l’effort de toute la compagnie.', en: 'A major dungeon creature that requires the whole company’s effort.' },
    { id: 'wuxxus', name: 'Wuxxus l’Indicible', weapon: 'Puissance indicible', special: 'Terreur de l’Indicible', visualAnchor: 'Ancient occult entity suggested through tentacular shadow, runes and a silhouette never rendered as a generic demon.', fr: 'Une entité dont le nom même annonce une menace au-delà des monstres ordinaires.', en: 'An entity whose very name signals a threat beyond ordinary monsters.' }
  ],
  worldBoss: { id: 'gzor', name: 'Gzor', weapon: 'Corruption du Chaos', special: 'Convergence des Sept Couronnes', visualAnchor: 'Colossal dark god presence framed by seven-crown symbolism, red-black magical storm and no borrowed franchise iconography.', fr: 'Gzor est la menace cosmique liée au grand arc des Sept Couronnes.', en: 'Gzor is the cosmic threat tied to the larger Seven Crowns arc.', canonStatus: 'canon overarching antagonist', entityType: 'cosmic-antagonist', objective: 'Disrupt the Seven Crowns convergence and seal Gzor outside the Nexus.' },
  stage: { name: 'Donjon de Zangdar — couloirs piégés', visualAnchor: 'Irregular stone corridors, wood doors, torch brackets, treasure decoys and a remote control room.', fr: 'La compagnie progresse dans les couloirs piégés du donjon de Zangdar.', en: 'The company advances through the trapped corridors of Zangdar’s dungeon.' },
  stageVariants: [
    stageVariant('Smash', 'Antre du Golbargh', 'Very Hard', 'Golbargh', { objective: 'Break the monster’s charge pattern without splitting the party.' }),
    stageVariant('Tactics', 'Convergence des Sept Couronnes', 'Expert', 'Gzor', { objective: 'Disable the crown relays before sealing the cosmic breach.' })
  ],
  gear: [
    { id: 'amulette_desordre', enName: 'Amulet of Chaos', frName: 'Amulette du Désordre', boost: { atk: 8, spd: 1 }, visualAnchor: 'Small quest amulet with intentionally ambiguous magical ornament, not a generic jeweled crown.', fr: 'L’objet de quête au cœur de la première expédition.', en: 'The quest object at the heart of the first expedition.' },
    { id: 'grimoire_magicienne', enName: 'Magician’s Spellbook', frName: 'Grimoire de la Magicienne', boost: { def: 6, hp: 45 }, visualAnchor: 'Travel-worn spellbook with handwritten tabs and practical leather binding.', fr: 'Le grimoire rassemble les sorts préparés de la Magicienne.', en: 'The spellbook holds the Magician’s prepared spells.' },
    { id: 'hache_nain', enName: 'Dwarf’s Axe', frName: 'Hache du Nain', boost: { hp: 60, atk: 4 }, visualAnchor: 'Heavy one-handed dwarf axe, broad practical blade and nicked metal.', fr: 'La solution favorite du Nain aux problèmes du donjon.', en: 'The Dwarf’s preferred answer to dungeon problems.' }
  ],
  event: { id: 'baston_generale', enName: 'Dungeon Party Brawl', frName: 'Baston générale du donjon', en: 'The whole party attacks in chaotic sequence; success comes from keeping their incompatible talents aimed at the same target.', fr: 'Toute la compagnie attaque dans un ordre chaotique ; la réussite consiste à orienter ses talents incompatibles vers la même cible.', visualAnchor: 'Torchlit dungeon melee with the three heroes retaining their exact silhouettes and roles.' }
}));
}
