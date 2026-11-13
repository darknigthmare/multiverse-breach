// Silent Hill — definitions consumed by src/game/heroes.js.
// Constructors receive shared builders explicitly, avoiding imports back into the aggregate catalog.

export function createHeroesDb() {
  return ({
    id: 'pyramidhead',
    name: 'Pyramid Head',
    universe: 'Silent Hill',
    category: 'slayer',
    primaryColor: '#7c0a02',
    secondaryColor: '#d3d3d3',
    weaponType: 'greatsword',
    weaponColor: '#5a5a5a',
    stats: { hp: 200, atk: 20, def: 14, spd: 2 },
    simple: { name: 'Great Knife Slash', type: 'melee', dmg: 1.5 },
    secondary: { name: 'Spear Impale', type: 'projectile', cd: 9, dmg: 2.0 },
    defense: { name: 'Rust Ward', type: 'shield', dur: 2.5, reduce: 0.7 },
    special: { name: 'Executioner Fog', type: 'darkness', dmg: 4.6 }
  });
}

export function createEquipItemsDb() {
  return ({
    id: 'steel_pipe',
    universe: 'Silent Hill',
    name: { en: 'South Vale Steel Pipe', fr: 'Tuyau de fer South Vale' },
    desc: {
      fr: 'Arme improvisee typique de Silent Hill: lourde, simple, presque honteuse. Elle rappelle que survivre dans le brouillard commence souvent par tenir a distance une peur trop proche.',
      en: 'Typical Silent Hill improvised weapon: heavy, simple, almost shameful. It recalls that surviving the fog often starts by keeping a too-close fear at distance.'
    },
    boost: { atk: 12 },
    cost: 90
  });
}

export function createEquipItemsDb2() {
  return ({
    id: 'pocket_radio',
    universe: 'Silent Hill',
    name: { en: 'Static Pocket Radio', fr: 'Radio parasite de poche' },
    desc: {
      fr: 'Radio qui gronde quand un monstre approche. Dans le Nexus, son bruit blanc sert d alarme de Trame: elle ne dit pas quoi fuir, seulement que quelque chose a deja entendu le joueur.',
      en: 'Radio that growls when a monster nears. In the Nexus, its white noise acts as a Thread alarm: it does not say what to flee, only that something has already heard the player.'
    },
    boost: { def: 6, spd: 1 },
    cost: 90
  });
}

export function createEquipItemsDb3() {
  return ({
    id: 'flauros',
    universe: 'Silent Hill',
    name: { en: 'Flauros Seal Fragment', fr: 'Fragment du sceau de Flauros' },
    desc: {
      fr: 'Artefact lie a l Ordre et aux forces enfermees de Silent Hill. A.R.C.A. l utilise comme verrou rituel: pas pour purifier la ville, mais pour empecher son dieu de traverser la Breche.',
      en: 'Artifact tied to the Order and Silent Hill bound forces. A.R.C.A. uses it as a ritual lock: not to purify the town, but to prevent its god from crossing the Breach.'
    },
    boost: { hp: 60, def: 6 },
    cost: 120
  });
}

export function createEventItemsDb() {
  return ({
    id: 'evt_sh_fog',
    name: { en: 'Flauros Otherworld Seal', fr: 'Sceau Otherworld de Flauros' },
    desc: {
      en: 'Forces a Silent Hill siren cycle over the breach. Fog blinds hostile signatures, rust slows their attacks, and the Flauros mark prevents a false god from fully manifesting for a short window.',
      fr: 'Force un cycle de sirene Silent Hill sur la breche. Le brouillard aveugle les signatures hostiles, la rouille ralentit leurs attaques et la marque de Flauros empeche un faux dieu de se manifester completement pendant une courte fenetre.'
    },
    effect: 'blind_fog'
  });
}

export function createExtraHeroData() {
  return ([
    { id: 'james_s', name: 'James Sunderland', cat: 'horror', color: '#7f8c8d' },
    { id: 'heather', name: 'Heather Mason', cat: 'horror', color: '#e67e22' }
  ]);
}

export function createCanonRosterExpansion() {
  return ([
    { id: 'harry_mason', name: 'Harry Mason', cat: 'horror', color: '#59656f' },
    { id: 'alessa_gillespie', name: 'Alessa Gillespie', cat: 'hacker', color: '#6c3483' },
    { id: 'maria_sh2', name: 'Maria', cat: 'horror', color: '#c27a7a' },
    { id: 'cybil_bennett', name: 'Cybil Bennett', cat: 'tactical', color: '#2e5f8a' },
    { id: 'claudia_wolf', name: 'Claudia Wolf', cat: 'hacker', color: '#8d7b60' }
  ]);
}

export function createHeroOverrides() {
  return ({
    simple: { name: 'Great Knife Sentence', type: 'melee', dmg: 1.55 },
    secondary: { name: 'Spear of Judgment', type: 'projectile', cd: 9, dmg: 2.05 },
    defense: { name: 'Rust Otherworld Ward', type: 'shield', dur: 2.5, reduce: 0.72 },
    special: { name: 'Execution Fog Trial', type: 'darkness', dmg: 4.7, color: '#7c0a02' }
  });
}

export function createHeroOverrides2() {
  return ({
    weaponType: 'pipe',
    weaponColor: '#7f8c8d',
    simple: { name: 'Steel Pipe Swing', type: 'melee', dmg: 0.95 },
    secondary: { name: 'Static Radio Warning', type: 'fear', cd: 6, dmg: 1.35 },
    defense: { name: 'Health Drink Breath', type: 'heal', dur: 1.6, reduce: 0.58 },
    special: { name: 'Lakeview Truth Break', type: 'dark_aoe', dmg: 4.1, color: '#cbd8c8' }
  });
}

export function createHeroOverrides3() {
  return ({
    weaponType: 'gun',
    weaponColor: '#2b1d16',
    simple: { name: 'Handgun in the Fog', type: 'bullet', dmg: 1.0 },
    secondary: { name: 'Aglaophotis Rejection', type: 'magic', cd: 7, dmg: 1.55 },
    defense: { name: 'Pendant Refusal', type: 'shield', dur: 2.0, reduce: 0.8 },
    special: { name: 'No God Birth', type: 'ritual_aoe', dmg: 4.5, color: '#e67e22' }
  });
}
