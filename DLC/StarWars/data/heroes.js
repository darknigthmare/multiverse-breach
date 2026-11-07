// Star Wars — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'luke',
    name: 'Luke Skywalker',
    universe: 'Star Wars',
    category: 'slayer',
    primaryColor: '#2ecc71',
    secondaryColor: '#3498db',
    weaponType: 'greatsword',
    weaponColor: '#00ff00',
    stats: { hp: 140, atk: 18, def: 9, spd: 7 },
    simple: { name: 'Lightsaber Cut', type: 'melee', dmg: 1.2 },
    secondary: { name: 'Force Push Blast', type: 'gravity', cd: 5, dmg: 1.8 },
    defense: { name: 'Saber Deflect', type: 'shield', dur: 2.0, reduce: 0.9 },
    special: { name: 'Jedi Mind Strike', type: 'beam_aoe', dmg: 5.2 }
  });
}

export function createEquipItemsDb() {
  return ({ id: 'blue_saber', universe: 'Star Wars', name: { en: 'Luke\'s Inherited Blue Lightsaber (ANH / ESB)', fr: 'Sabre bleu hérité de Luke (ANH / ESB)' }, canonicalName: 'Skywalker lightsaber (blue blade)', incarnation: 'Star Wars: A New Hope (1977) / The Empire Strikes Back (1980) - Luke\'s inherited blue blade', sourceOwner: 'Luke Skywalker, inherited from Anakin Skywalker', referenceUrl: 'https://www.starwars.com/databank/luke-skywalker', referenceUrls: ['https://www.starwars.com/databank/luke-skywalker', 'https://www.starwars.com/databank/luke-skywalkers-lightsaber'], visualReviewStatus: 'pending', gameplayPolicy: { runtimeEffect: 'stat-boost-only', replacesHeroWeapon: false }, desc: { en: 'The blue-bladed weapon inherited from Anakin and carried by Luke in A New Hope and The Empire Strikes Back, then lost on Cloud City. It is distinct from Luke\'s green replacement in Return of the Jedi. This relic supplies passive stats and does not recolor the playable ROTJ kit.', fr: 'Le sabre à lame bleue hérité d’Anakin, porté par Luke dans Un nouvel espoir et L’Empire contre-attaque, puis perdu sur Bespin. Il est distinct du sabre vert construit pour Le Retour du Jedi. Cette relique fournit des bonus passifs et ne recolore pas le kit ROTJ jouable.' }, boost: { atk: 15 }, cost: 150 });
}

export function createEquipItemsDb2() {
  return ({ id: 'jedi_holocron', universe: 'Star Wars', name: { en: 'Jedi Holocron', fr: 'Holocron Jedi' }, boost: { hp: 60, def: 5 }, cost: 100 });
}

export function createEquipItemsDb3() {
  return ({ id: 'jedi_robes', universe: 'Star Wars', name: { en: 'Jedi Robes', fr: 'Bures de Jedi' }, boost: { spd: 3 }, cost: 90 });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_sw_laser',
    name: { en: 'Death Star Targeter', fr: 'Viseur de l\'Étoile de la Mort' },
    desc: { en: 'Signals orbital superlaser blast dealing 250 damage to all enemies and slows them.', fr: 'Cible un tir de superlaser orbital : inflige 250 dégâts à tous et les ralentit.' },
    effect: 'orbital_laser'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'vader', name: 'Darth Vader', cat: 'slayer', color: '#2d3436' },
    { id: 'han_solo', name: 'Han Solo', cat: 'tactical', color: '#ffeaa7' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'leia_organa', name: 'Leia Organa', cat: 'tactical', color: '#ecf0f1' },
    { id: 'obi_wan', name: 'Obi-Wan Kenobi', cat: 'slayer', color: '#5dade2' },
    { id: 'yoda', name: 'Yoda', cat: 'hacker', color: '#58d68d' },
    { id: 'darth_maul', name: 'Darth Maul', cat: 'slayer', color: '#a93226' }
  ]);
}
