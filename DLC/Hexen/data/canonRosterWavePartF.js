// Hexen — definitions consumed by src/game/canonRosterWavePartF.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHexen() {
  return (Object.freeze({ key: 'hexen', universe: 'Hexen', url: 'https://www.gamesdatabase.org/Media/SYSTEM/Sony_Playstation/manual/Formated/Hexen-_Beyond_Heretic_-_1997_-_GT_Interactive_Software.pdf' }));
}

export function createHexen2({ HEXEN, definePack, stageVariant }) {
  return (definePack(HEXEN, {
  aliases: ['Hexen: Beyond Heretic', 'Hexen franchise'],
  mediaType: 'video-game', faction: 'arcane', mode: 'RPG', difficulty: 'Expert',
  colors: ['#33402a', '#070807', '#8cbf57'], motif: 'chaossphere',
  theme: 'the three survivors of Cronos breaking Korax’s corrupted order',
  continuity: 'Hexen: Beyond Heretic (1995) game and official manual',
  adaptationRule: 'Use exactly the manual’s three class heroes, their ultimate weapons, hub structure and corrupted leaders. Zedek, Traductus and Menelkir are former human leaders granted Unlife by Korax; Korax is the second Serpent Rider and sole world boss.',
  visualAnchor: 'Oppressive Cronos fortresses, mossy stone hubs, green magic, medieval machinery and three sharply different class silhouettes.',
  canonStatus: 'Hexen game canon grounded in Raven/GT manual text',
  fr: 'Baratus, Parias et Daedolon sont les seuls humains à échapper au pouvoir de Korax et jurent d’abattre leurs anciens dirigeants corrompus.',
  en: 'Baratus, Parias and Daedolon are the only humans to escape Korax’s power and swear to destroy their corrupted former leaders.',
  referenceUrls: [HEXEN.url, 'https://store.steampowered.com/app/2360/HeXen_Beyond_Heretic/', 'https://www.gog.com/en/game/hexen_beyond_heretic'],
  characters: [
    { id: 'baratus', name: 'Baratus', role: 'marine', weapon: 'Timon’s Axe', weaponType: 'blade', simple: 'Axe cut', secondary: 'Hammer of Retribution', defense: 'Legion armor brace', special: 'Quietus assembly', visualAnchor: 'Powerful Legion warrior in heavy brown-steel armor, bare muscular arms, horned helm and broad enchanted axe.', fr: 'Guerrier de la Légion, le plus rapide et le plus robuste au contact.', en: 'A Legion warrior, fastest and strongest at close range.' },
    { id: 'parias', name: 'Parias', role: 'tactical', weapon: 'Serpent Staff', weaponType: 'magic', simple: 'Mace of Contrition', secondary: 'Firestorm', defense: 'Healing prayer', special: 'Wraithverge assembly', visualAnchor: 'Stern Church cleric in green-gold battle robes, steel pauldrons and serpent-headed staff.', fr: 'Clerc de l’Église qui combine entraînement militaire et magie sacrée.', en: 'A Church cleric combining military training and sacred magic.' },
    { id: 'daedolon', name: 'Daedolon', role: 'hacker', weapon: 'Arc of Death', weaponType: 'magic', simple: 'Sapphire Wand', secondary: 'Frost Shards', defense: 'Mystic ward', special: 'Bloodscourge assembly', visualAnchor: 'Lean Arcanum mage in deep blue robe, pointed hood, glowing hands and crystal-tipped staff.', fr: 'Mage de l’Arcanum doté de la plus grande portée magique.', en: 'An Arcanum mage with the greatest magical reach.' }
  ],
  monsters: [
    { id: 'ettin', name: 'Ettin', weapon: 'Twin clubs', special: 'Corrupted Legion rush', visualAnchor: 'Two-headed broad green-brown former legionnaire with one crude club in each hand.', fr: 'Ce qui reste de légionnaires transformés par Korax.', en: 'What remains of legionnaires transformed by Korax.' },
    { id: 'centaur', name: 'Centaur', weapon: 'Sword', special: 'Missile-reflecting shield', visualAnchor: 'Armored reptilian centaur-shaped front-line soldier with bronze shield and curved sword.', fr: 'Un soldat de première ligne capable de renvoyer les projectiles.', en: 'A front-line soldier capable of reflecting missiles.' },
    { id: 'dark_bishop', name: 'Dark Bishop', weapon: 'Jade seeking projectiles', special: 'Phase teleport', visualAnchor: 'Floating corrupted church leader in dark green robe, gold mask and circling jade magic.', fr: 'Un dirigeant de l’Église transformé en serviteur magique.', en: 'A Church leader transformed into a magical servant.' }
  ],
  bosses: [
    { id: 'zedek', name: 'Zedek', weapon: 'Corrupted Quietus', special: 'Undead Legion mastery', visualAnchor: 'Former Legion marshal in black-red Unlife armor with broken Quietus-like runeblade.', fr: 'L’ancien maréchal de la Légion devenu pion de Korax.', en: 'The former Legion marshal turned into Korax’s pawn.', canonStatus: 'canon manual corrupted leader' },
    { id: 'traductus', name: 'Traductus', weapon: 'Corrupted Wraithverge', special: 'Unlife church storm', visualAnchor: 'Grand Patriarch in decayed green-gold vestments wielding a spectral holy symbol.', fr: 'L’ancien Grand Patriarche bloque la route de Parias.', en: 'The former Grand Patriarch blocks Parias’s path.', canonStatus: 'canon manual corrupted leader' },
    { id: 'menelkir', name: 'Menelkir', weapon: 'Corrupted Bloodscourge', special: 'Crystal Dais sorcery', visualAnchor: 'Tall undead Arch-Mage in midnight blue robes with red runic staff and crystal-dais aura.', fr: 'L’ancien Archimage manie une magie que le manuel dit presque indestructible.', en: 'The former Arch-Mage wields magic the manual calls almost indestructible.', canonStatus: 'canon manual corrupted leader' }
  ],
  worldBoss: { id: 'korax', name: 'Korax', weapon: 'Chaos Sphere corruption', special: 'Serpent Rider legion summon', visualAnchor: 'Enormous six-armed brown-green Serpent Rider with horned skull face and Chaos Sphere energy in a black stone stronghold.', fr: 'Deuxième des trois Cavaliers Serpents, Korax contrôle et déforme Cronos.', en: 'Second of the three Serpent Riders, Korax controls and warps Cronos.', canonStatus: 'canon final boss' },
  stage: { name: 'Seven Portals — premier Hub de Cronos', visualAnchor: 'Central mossy courtyard with seven sealed stone portals, gears, switches and green-lit runes.', fr: 'Le Hub impose des retours entre sous-niveaux pour ouvrir la route.', en: 'The Hub requires revisiting sublevels to open the route.' },
  stageVariants: [
    stageVariant('RPG', 'Nécropole — trois dirigeants sans vie', 'Expert', 'Menelkir', { objective: 'Defeat Zedek, Traductus and Menelkir with each class’s recovered ultimate weapon.' }),
    stageVariant('RPG', 'Dark Crucible — forteresse de Korax', 'Expert', 'Korax', { objective: 'Solve the final hub locks and break the Chaos Sphere’s summons.' })
  ],
  gear: [
    { id: 'quietus', enName: 'Quietus', frName: 'Quietus', boost: { atk: 8 }, visualAnchor: 'Completed warrior runesword with three visibly joined dark-steel pieces and green-red edge glow.', fr: 'L’arme ultime assemblée de Baratus.', en: 'Baratus’s assembled ultimate weapon.' },
    { id: 'wraithverge', enName: 'Wraithverge', frName: 'Wraithverge', boost: { hp: 50, def: 5 }, visualAnchor: 'Completed cleric holy symbol with skulllike but original silver-green shape and circling spirits.', fr: 'Le symbole sacré ultime de Parias.', en: 'Parias’s ultimate holy symbol.' },
    { id: 'bloodscourge', enName: 'Bloodscourge', frName: 'Bloodscourge', boost: { atk: 6, spd: 2 }, visualAnchor: 'Completed mage staff with dark shaft, split horned head and contained red-green orb.', fr: 'Le bâton ultime de Daedolon.', en: 'Daedolon’s ultimate staff.' }
  ],
  event: { id: 'three_orders_fall', enName: 'The Three Orders Fall', frName: 'Chute des trois Ordres', en: 'The Legion, Church and Arcanum survivors recover their weapon pieces and confront the leaders who surrendered Cronos.', fr: 'Les survivants de la Légion, de l’Église et de l’Arcanum récupèrent leurs armes puis affrontent les dirigeants qui ont livré Cronos.', visualAnchor: 'Three class-colored weapon silhouettes joining above the Seven Portals hub.' }
}));
}
