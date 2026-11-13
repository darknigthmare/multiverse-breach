// Kill Bill — definitions consumed by src/game/canonRosterWavePartB.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createKillBill() {
  return (Object.freeze({
  key: 'kill_bill',
  universe: 'Kill Bill',
  url: 'https://staging.miramax.com/movie/kill-bill-volume-i/'
}));
}

export function createKillBill2({ KILL_BILL, character, definePack, event, gear, lore, stageMeta, stageVariant, threat }) {
  return (definePack(KILL_BILL, {
  aliases: ['Kill Bill Vol. 1', 'Kill Bill Vol. 2'],
  mediaType: 'film',
  faction: 'horror',
  mode: 'Smash',
  difficulty: 'Very Hard',
  colors: ['#f2bd18', '#110606', '#b20f19'],
  motif: 'dojo',
  theme: 'Beatrix Kiddo’s revenge path, Hattori Hanzo steel, Pai Mei training, Crazy 88 sword fights and the Deadly Viper Assassination Squad',
  continuity: 'Kill Bill Volume 1 and Volume 2 film continuity',
  adaptationRule: 'Preserve each film costume, weapon and location. Cross-volume mentor support is explicitly a gameplay roster, not a rewritten chronology.',
  visualAnchor: 'Beatrix Kiddo in yellow-and-black motorcycle leathers with Hattori Hanzo katana; high-contrast yellow, black and blood-red cinema palette; no supernatural armour.',
  canonStatus: 'two-volume film adaptation',
  lore: lore('Beatrix retrace sa liste à travers les deux volumes, soutenue dans le gameplay par Hanzo et Pai Mei sans réécrire la chronologie.', 'Beatrix retraces her list across both volumes, supported in gameplay by Hanzo and Pai Mei without rewriting chronology.'),
  referenceUrls: [KILL_BILL.url, 'https://test.miramax.com/movie/kill-bill-volume-ii/'],
  hero: character(KILL_BILL, 'beatrix', 'Beatrix Kiddo', 'slayer', 'Yellow-and-black motorcycle jacket and trousers, blonde ponytail, Hattori Hanzo katana and no added armour; film-scale anatomy.', lore('Black Mamba poursuit les responsables du massacre de Two Pines.', 'Black Mamba pursues those responsible for the Two Pines massacre.'), 'canonical protagonist', { runtimeId: 'beatrix_kiddo_kb', weapon: 'Hattori Hanzo Katana', weaponType: 'katana', simple: 'Hanzo Slash', secondary: 'Flying Kick', defense: 'Scabbard Guard', special: 'Five Point Palm Technique' }),
  allies: [
    character(KILL_BILL, 'hattori_hanzo', 'Hattori Hanzo', 'tactical', 'Retired Okinawan swordsmith in simple dark work clothes and headcloth, presenting a wrapped katana from his workshop; no historical ninja armour.', lore('Hanzo forge pour Beatrix une lame capable d’atteindre son ancien élève Bill.', 'Hanzo forges Beatrix a blade capable of reaching his former student Bill.'), 'canonical mentor adapted as support', { runtimeId: 'hattori_hanzo_kb', weapon: 'Hattori Hanzo Katana', weaponType: 'katana', simple: 'Workshop Strike', secondary: 'Steel Appraisal', defense: 'Perfect Scabbard', special: 'Finest Hanzo Steel' }),
    character(KILL_BILL, 'pai_mei', 'Pai Mei', 'slayer', 'Elder martial-arts master in white traditional robes, very long white brows, moustache and beard, hands behind back; no magic aura or fantasy armour.', lore('Pai Mei transmet à Beatrix un entraînement décisif du second volume.', 'Pai Mei gives Beatrix decisive training in the second volume.'), 'canonical mentor adapted as support', { referenceUrl: 'https://test.miramax.com/movie/kill-bill-volume-ii/', simple: 'Finger Jab', secondary: 'Three-Inch Punch', defense: 'Sleeve Parry', special: 'Five Point Lesson' })
  ],
  monsters: [
    threat(KILL_BILL, 'crazy_88_swordsman', 'Crazy 88 Swordsman', 'yakuza katana', 'Black-Suit Rush', 'Anonymous Crazy 88 fighter in exact black suit, white shirt, black tie and black eye mask, carrying a plain katana; no invented insignia.', lore('Un combattant anonyme des Crazy 88 défend la Maison des Feuilles Bleues.', 'An anonymous Crazy 88 fighter defends the House of Blue Leaves.'), 'canonical enemy archetype'),
    threat(KILL_BILL, 'crazy_88_axe', 'Crazy 88 Axe Fighter', 'one-handed axe', 'Balcony Drop', 'Anonymous Crazy 88 member in the same black suit and eye mask, distinguished only by the film-style hand axe and stance.', lore('Cette variante reprend les armes mêlées visibles durant l’affrontement collectif.', 'This variant reflects melee weapons seen during the group showdown.'), 'canon-derived enemy archetype'),
    threat(KILL_BILL, 'yakuza_guard', 'O-Ren Yakuza Guard', 'club and formation tactics', 'Sliding-Door Ambush', 'Original anonymous Tokyo yakuza guard in restrained black suit, white shirt and no face mask, grounded in O-Ren’s organisation.', lore('Un garde anonyme complète la troupe sans inventer un nouveau lieutenant nommé.', 'An anonymous guard completes the force without inventing a named lieutenant.'), 'canon-derived enemy archetype')
  ],
  bosses: [
    threat(KILL_BILL, 'oren_ishii', 'O-Ren Ishii', 'katana', 'Snow-Garden Duel', 'White kimono, tied black hair and unsheathed katana in the snow garden; preserve Lucy Liu’s film costume silhouette without photoreal likeness.', lore('Cottonmouth affronte Beatrix dans le jardin enneigé.', 'Cottonmouth faces Beatrix in the snow garden.'), 'canonical antagonist'),
    threat(KILL_BILL, 'elle_driver', 'Elle Driver', 'concealed blade and ruthless close combat', 'California Mountain Snake', 'Tall blonde assassin with black eyepatch marked by a red cross, fitted black outfit and film-grounded weapons; no fantasy snake armour.', lore('California Mountain Snake poursuit sa rivalité avec Beatrix et Pai Mei.', 'California Mountain Snake continues her rivalry with Beatrix and Pai Mei.'), 'canonical antagonist', { referenceUrl: 'https://test.miramax.com/movie/kill-bill-volume-ii/' }),
    threat(KILL_BILL, 'budd', 'Budd', 'rock-salt shotgun and buried-alive trap', 'Sidewinder Ambush', 'Weathered man in work shirt and jeans at his desert trailer, carrying the rock-salt shotgun; grounded film silhouette and no cowboy fantasy gear.', lore('Sidewinder prépare une embuscade pragmatique dans le désert.', 'Sidewinder prepares a pragmatic desert ambush.'), 'canonical antagonist', { referenceUrl: 'https://test.miramax.com/movie/kill-bill-volume-ii/' })
  ],
  worldBoss: threat(KILL_BILL, 'bill', 'Bill', 'Hattori Hanzo sword and psychological control', 'Superman Monologue Feint', 'Older man in simple dark open-collar clothing at the Mexican villa, carrying a sheathed Hanzo katana; calm film-scale duelist, no samurai armour.', lore('Snake Charmer reste la dernière cible de la liste de Beatrix.', 'Snake Charmer remains the final name on Beatrix’s list.'), 'canonical final antagonist', { referenceUrl: 'https://test.miramax.com/movie/kill-bill-volume-ii/', layout: 'duelist', objective: 'Reach Bill through his final conversation and complete Beatrix’s revenge path.' }),
  stage: 'House of Blue Leaves',
  stageMeta: stageMeta(KILL_BILL, 'Tokyo restaurant-club with glass dance floor, blue-lit interior, wooden balcony and snow garden, preserving the Volume 1 film geography.', 'La scène principale suit l’affrontement de la Maison des Feuilles Bleues.', 'The main stage follows the House of Blue Leaves showdown.', 'canonical film location adaptation'),
  stageVariants: [
    stageVariant('Tactics', 'Hattori Hanzo Okinawa Workshop', 'Hard', 'O-Ren Ishii', stageMeta(KILL_BILL, 'Warm wooden Okinawa sword workshop above the sushi bar, wrapped blades and clean forging tools; no generic ninja dojo.', 'L’atelier reprend la remise solennelle de la lame.', 'The workshop returns to the solemn sword presentation.', 'canonical film location adaptation')),
    stageVariant('Smash', 'Bill’s Mexican Villa', 'Very Hard', 'Bill', stageMeta(KILL_BILL, 'Quiet Mexican villa patio and living room at night, simple chairs, garden light and grounded final-film palette.', 'La villa accueille la confrontation finale du second volume.', 'The villa hosts Volume 2’s final confrontation.', 'canonical film location adaptation'))
  ],
  gear: [
    gear(KILL_BILL, 'hanzo_katana', 'Hattori Hanzo Katana', 'Katana de Hattori Hanzo', { atk: 11, spd: 1 }, 'Film-accurate Japanese katana and black scabbard with restrained Hanzo lion marking, isolated without copied title graphics.', lore('Hanzo présente cette lame comme sa meilleure création.', 'Hanzo presents this blade as his finest creation.')),
    gear(KILL_BILL, 'yellow_leathers', 'Yellow Motorcycle Leathers', 'Combinaison moto jaune', { def: 7, spd: 2 }, 'Folded yellow motorcycle jacket and trousers with black side stripes, no added patches or armour plates.', lore('La tenue jaune identifie Beatrix durant le combat de Tokyo.', 'The yellow outfit identifies Beatrix during the Tokyo fight.')),
    gear(KILL_BILL, 'pussy_wagon_keys', 'Pussy Wagon Keys', 'Clés du Pussy Wagon', { spd: 3, hp: 35 }, 'Plain vehicle key with a small original pink pickup silhouette, no readable slogan.', lore('Les clés rappellent le véhicule utilisé après le réveil de Beatrix.', 'The keys recall the vehicle used after Beatrix awakens.'), 'canonical prop adapted without text')
  ],
  event: event(KILL_BILL, 'unfinished_business', 'Unfinished Business', 'Affaires inachevées', 'Beatrix marks the next name and crosses the arena in one disciplined Hanzo-steel sequence.', 'Beatrix désigne le prochain nom et traverse l’arène dans une séquence disciplinée à l’acier Hanzo.', 'Yellow sleeve, handwritten list with unreadable names and unsheathed Hanzo blade against a red-black field.', 'canonical narrative motif event')
}));
}
