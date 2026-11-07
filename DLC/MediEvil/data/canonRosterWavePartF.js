// MediEvil — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createMedievil() {
  return (Object.freeze({ key: 'medievil', universe: 'MediEvil', url: 'https://www.playstation.com/en-gb/games/medievil/' }));
}

export function createMedievil2({ MEDIEVIL, definePack, stageVariant }) {
  return (definePack(MEDIEVIL, {
  aliases: ['Médiéval', 'Medieval', 'MediEvil franchise'],
  mediaType: 'video-game', faction: 'gothic', mode: 'RPG', difficulty: 'Hard',
  colors: ['#273c35', '#060807', '#cfb85b'], motif: 'gallowmere',
  theme: 'Sir Daniel Fortesque earning the heroism his legend falsely claimed',
  continuity: 'MediEvil (1998/2019 remake) with Kiya tagged from MediEvil 2 and Al-Zalam from Resurrection',
  adaptationRule: '“médiéval” is resolved as Sony’s MediEvil. Sir Dan remains the one-eyed jawless skeleton hero. Kiya’s and Al-Zalam’s entries retain their stated sequel/remake arcs; Al-Zalam is a non-combat guide Trial. Never merge Zarok with generic necromancers.',
  visualAnchor: 'Crooked storybook Gallowmere graveyards, green moonlight, exaggerated gothic stone and Sir Dan’s asymmetrical skeleton silhouette.',
  canonStatus: 'franchise roster with every cross-title entity explicitly tagged',
  fr: 'Sir Dan se relève par accident avec l’armée de Zarok et obtient enfin la chance de mériter sa place au Hall des Héros.',
  en: 'Sir Dan is accidentally raised with Zarok’s army and finally gets the chance to earn his place in the Hall of Heroes.',
  referenceUrls: [MEDIEVIL.url, 'https://blog.playstation.com/2012/09/07/behind-the-classics-medievil/', 'https://blog.playstation.com/2018/10/31/medievil-story-trailer-reveals-sir-daniels-origin-story/'],
  characters: [
    { id: 'sir_dan', runtimeId: 'sir_daniel_fortesque', name: 'Sir Daniel Fortesque', role: 'slayer', weapon: 'Broadsword', weaponType: 'blade', simple: 'Sword swing', secondary: 'Detached-arm throw', defense: 'Silver-shield block', special: 'Hero of Gallowmere charge', visualAnchor: 'Tall one-eyed jawless skeleton knight in dented silver armor, single horned shoulder, red plume and broad sword.', fr: 'Chevalier mort trop tôt dont la fausse légende devient une véritable quête de rédemption.', en: 'A knight who died too soon and turns his false legend into a real redemption quest.' },
    { id: 'kiya', name: 'Kiya', role: 'tactical', weapon: 'Ancient Egyptian blades', weaponType: 'blade', simple: 'Kiya slash', secondary: 'Mummy-princess leap', defense: 'Royal guard turn', special: 'MediEvil 2 alliance', visualAnchor: 'Reawakened ancient Egyptian princess in wrapped royal linen, turquoise-gold ornaments and paired curved blades, no sexualization.', fr: 'Princesse momifiée et alliée de Dan dans MediEvil 2.', en: 'A mummified princess and Dan’s ally in MediEvil 2.', canonStatus: 'canon MediEvil 2 ally' },
    { id: 'al_zalam', name: 'Al-Zalam — Guidance Route', role: 'trial', nonCombat: true, objective: 'Reveal hidden Resurrection routes and translate Zarok’s magical barriers.', objectiveFr: 'Révéler les routes cachées de Resurrection et traduire les barrières magiques de Zarok.', victoryCondition: 'guidance-route-complete', visualAnchor: 'Tiny blue-green genie spirit emerging from Sir Dan’s hollow skull beside route glyphs.', fr: 'Le génie de Resurrection vit dans le crâne de Dan et le guide sans devenir un combattant inventé.', en: 'The Resurrection genie lives in Dan’s skull and guides him without becoming an invented fighter.', canonStatus: 'canon MediEvil: Resurrection non-combat guide' }
  ],
  monsters: [
    { id: 'zombie', name: 'Gallowmere Zombie', weapon: 'Clawed hands', special: 'Graveyard rise', visualAnchor: 'Green-gray storybook corpse in torn peasant clothes rising from crooked soil, no gore.', fr: 'Un mort de Gallowmere relevé par la magie de Zarok.', en: 'A Gallowmere corpse raised by Zarok’s magic.' },
    { id: 'imp', name: 'Imp', weapon: 'Claws', special: 'Gear theft', visualAnchor: 'Small red-brown winged imp carrying an oversized stolen shield through a gothic hall.', fr: 'Un petit démon qui vole l’équipement de Dan.', en: 'A small demon that steals Dan’s equipment.' },
    { id: 'headless_zombie', name: 'Headless Zombie', weapon: 'Heavy swing', special: 'Unlife advance', visualAnchor: 'Broad headless undead soldier in corroded Gallowmere armor, stylized and gore-free.', fr: 'Un soldat sans tête réanimé dans l’armée de Zarok.', en: 'A headless soldier reanimated in Zarok’s army.' }
  ],
  bosses: [
    { id: 'stained_glass_demon', name: 'Stained Glass Demon', weapon: 'Glass shard volley', special: 'Cathedral-window reform', visualAnchor: 'Blue-red horned demon assembled from luminous cathedral glass above a dark mausoleum floor.', fr: 'Une figure de vitrail qui quitte sa fenêtre pour attaquer Dan.', en: 'A stained-glass figure that leaves its window to attack Dan.' },
    { id: 'pumpkin_king', name: 'Pumpkin King', weapon: 'Vine lashes', special: 'Pumpkin-field awakening', visualAnchor: 'Huge crowned pumpkin rooted in tangled green vines under a sickly moon.', fr: 'Le souverain végétal corrompu du champ de citrouilles.', en: 'The corrupted plant sovereign of the pumpkin field.' },
    { id: 'lord_kardok', name: 'Lord Kardok', weapon: 'Mounted lance', special: 'Skeletal cavalry charge', visualAnchor: 'Armored skeletal champion on a skeletal horse in Zarok’s arena, gold-black plate and long lance.', fr: 'Le champion de Zarok affronte Dan avant le sorcier.', en: 'Zarok’s champion faces Dan before the sorcerer.' }
  ],
  worldBoss: { id: 'zarok', name: 'Zarok', weapon: 'Necromancy', special: 'Monster-form transformation', visualAnchor: 'Gaunt green-skinned sorcerer in long red-black robes with crooked staff, transforming into his final serpentine monster form.', fr: 'Le sorcier qui ressuscite son armée et, par accident, Sir Dan.', en: 'The sorcerer who raises his army and accidentally raises Sir Dan.' },
  stage: { name: 'Cimetière de Gallowmere', visualAnchor: 'Crooked tombstones, thorny trees, green fog, mausoleum doors and the distant Hilltop Mausoleum.', fr: 'Dan quitte sa crypte au milieu des morts relevés.', en: 'Dan leaves his crypt among the risen dead.' },
  stageVariants: [
    stageVariant('RPG', 'Mausolée de la Colline — vitrail vivant', 'Very Hard', 'Stained Glass Demon', { objective: 'Return reflected shards to expose the glass heart.' }),
    stageVariant('RPG', 'Repaire de Zarok — arène de rédemption', 'Expert', 'Zarok', { objective: 'Protect the spectral heroes, defeat Kardok and survive Zarok’s transformation.' })
  ],
  gear: [
    { id: 'dans_sword', enName: 'Dan’s Broadsword', frName: 'Épée large de Dan', boost: { atk: 7 }, visualAnchor: 'Worn broad knight sword with simple crossguard and Gallowmere age marks.', fr: 'L’arme emblématique de Sir Dan.', en: 'Sir Dan’s emblematic weapon.' },
    { id: 'silver_shield', enName: 'Silver Shield', frName: 'Bouclier d’argent', boost: { def: 8 }, visualAnchor: 'Round silver shield with dents and an original abstract lionlike boss mark.', fr: 'Un bouclier solide mais destructible.', en: 'A strong but breakable shield.' },
    { id: 'chalice', enName: 'Chalice of Souls', frName: 'Calice des âmes', boost: { hp: 60, def: 3 }, visualAnchor: 'Golden gothic chalice filled with soft green soul light, no text.', fr: 'Le calice qui ouvre l’accès au Hall des Héros lorsqu’il est rempli.', en: 'The chalice that opens the Hall of Heroes once filled.' }
  ],
  event: { id: 'hall_of_heroes', enName: 'Hall of Heroes Recognition', frName: 'Reconnaissance du Hall des Héros', en: 'The spectral heroes finally acknowledge Dan after the chalices and Gallowmere are secured.', fr: 'Les héros spectraux reconnaissent enfin Dan après la sécurisation des calices et de Gallowmere.', visualAnchor: 'Jawless Sir Dan beneath luminous statues raising their cups in a vast golden hall.', canonStatus: 'canon redemption event' }
}));
}
