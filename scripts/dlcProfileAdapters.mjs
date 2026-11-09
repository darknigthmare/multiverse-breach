// Explicit absence contracts for compatibility modules imported by shared engines.
// These contracts are reviewed API by API. New exports require a matching contract;
// an unknown module must never receive an inferred empty object or function.
const contracts = Object.freeze({
  'src/game/canonScarabEncounter.js': {
    module: 'DLC/Halo/runtime/canonScarabEncounter.js',
    code: [
      'export const SCARAB_BOARDING_SOURCE_URLS = Object.freeze([]);',
      'export const SCARAB_BOARDING_CELL = null;',
      'export const createScarabBoardingEncounter = () => null;',
      'export const advanceScarabBoardingEncounter = () => null;',
      'export const getScarabEncounterSummary = () => null;'
    ]
  },
  'src/game/canonRexEncounter.js': {
    module: 'DLC/MetalGear/runtime/canonRexEncounter.js',
    code: [
      "export const REX_SOURCE_INCARNATION = '';",
      'export const REX_SOURCE_URLS = Object.freeze([]);',
      'export const REX_STINGER_ACTION = null;',
      'export const isCanonRexStage = () => false;',
      'export const createRexEncounter = () => null;',
      'export const applyRexStingerDamage = () => null;',
      'export const getRexEncounterSummary = () => null;'
    ]
  },
  'src/game/canonRexAttackPatterns.js': {
    module: 'DLC/MetalGear/runtime/canonRexAttackPatterns.js',
    code: [
      'export const REX_ATTACK_NAMES = Object.freeze({});',
      'export const REX_CHAFF_SUPPLY = 0;',
      'export const REX_CHAFF_ATTACKS = 0;',
      "export const REX_ATTACK_ADAPTATION = '';",
      'export const prepareRexAttack = () => null;',
      'export const getRexAttackIntent = () => null;',
      'export const activateRexChaff = () => false;',
      'export const finishRexAttack = () => {};'
    ]
  },
  'src/game/canonNihilanthEncounter.js': {
    module: 'DLC/HalfLife/runtime/canonNihilanthEncounter.js',
    code: [
      "export const NIHILANTH_SOURCE_URL = '';",
      'export const NIHILANTH_ENCOUNTER_BALANCE = Object.freeze({});',
      'export const createNihilanthEncounter = () => null;',
      'export const attachNihilanthBoss = () => false;',
      'export const getNihilanthTargets = () => [];',
      'export const resolveNihilanthDamage = () => null;',
      'export const tickNihilanthEncounter = () => {};',
      'export const getNihilanthObjectiveText = () => null;',
      'export const getNihilanthEncounterSummary = () => null;'
    ]
  },
  'src/game/canonNihilanthEncounterPresentation.js': {
    module: 'DLC/HalfLife/runtime/canonNihilanthEncounterPresentation.js',
    code: ['export const drawNihilanthEncounter = () => {};']
  },
  'src/game/canonAliensRescueEncounter.js': {
    module: 'DLC/Alien/runtime/canonAliensRescueEncounter.js',
    code: [
      'export const ALIENS_RESCUE_SOURCE_URLS = Object.freeze([]);',
      'export const ALIENS_RESCUE_BALANCE = Object.freeze({ interactionRadius: 0 });',
      "export const ALIENS_RESCUE_INCARNATION = '';",
      'export const createAliensRescueEncounter = () => null;',
      // Shared Smash code applies this to every hero, including non-Alien heroes.
      'export const getAliensHiveHeroLoadout = (_runtime, hero) => hero;',
      'export const attachAliensRescueQueen = () => false;',
      'export const isAtAliensRescuePoint = () => false;',
      'export const aliensRescueHeroId = hero => hero?.battleId || hero?.runtimeId || hero?.id || null;',
      'export const getAliensRescueEncounterSummary = () => null;',
      'export const getAliensRescueObjectiveText = () => null;'
    ]
  },
  'src/game/canonAliensRescueEncounterPresentation.js': {
    module: 'DLC/Alien/runtime/canonAliensRescueEncounterPresentation.js',
    code: [
      "export const ALIENS_RESCUE_NEWT_SPRITE_HERO_ID = '';",
      'export const getAliensRescueNewtSpriteView = () => null;',
      'export const emitAliensHiveAttackEffect = () => false;',
      'export const drawAliensRescueEncounter = () => {};'
    ]
  },
  'src/game/canonRaamEncounter.js': {
    module: 'DLC/GearsOfWar/runtime/canonRaamEncounter.js',
    code: [
      'export const RAAM_ENCOUNTER_RULES = Object.freeze({});',
      'export const isCanonRaamStage = () => false;',
      'export const createRaamEncounter = () => null;',
      'export const getRaamBoss = () => null;',
      'export const isRaamShieldActive = () => false;',
      'export const getRaamLightPosition = () => null;',
      'export const isHeroInRaamLight = () => false;',
      'export const getRaamEnemyAction = () => null;',
      'export const startRaamKryll = () => {};',
      'export const tickRaamEncounter = () => null;',
      'export const getRaamEncounterSnapshot = () => null;'
    ]
  },
  'src/game/canonPiratesCurseEncounter.js': {
    module: 'DLC/PiratesOfTheCaribbean/runtime/canonPiratesCurseEncounter.js',
    code: [
      'export const PIRATES_CURSE_RULES = Object.freeze({});',
      'export const isCanonPiratesCurseStage = () => false;',
      'export const createPiratesCurseEncounter = () => null;',
      'export const isPiratesCursedCombatant = () => false;',
      'export const isPiratesCurseProtected = () => false;',
      'export const bindPiratesJackCurse = () => {};',
      'export const isPiratesCursedHero = () => false;',
      'export const repairPiratesCursedHeroes = () => {};',
      'export const getPiratesBarbossa = () => null;',
      'export const getPiratesCurseNextCommand = () => null;',
      'export const getPiratesCurseEncounterSnapshot = () => null;'
    ]
  },
  'src/game/cloudMeadowAdditionalCharacters.js': {
    module: 'DLC/CloudMeadow/data/cloudMeadowAdditionalCharacters.js',
    code: [
      'export const ADDITIONAL_CLOUD_MEADOW_REFERENCES = Object.freeze([]);',
      'export const ADDITIONAL_CLOUD_MEADOW_ARTWORK = Object.freeze([]);'
    ]
  },
  'src/game/cloudMeadowCharacters.js': {
    module: 'DLC/CloudMeadow/data/cloudMeadowCharacters.js',
    code: [
      "export const CLOUD_MEADOW_UNIVERSE = 'Cloud Meadow';",
      "export const CLOUD_MEADOW_REVIEW_PATH = '';",
      "export const CLOUD_MEADOW_REFERENCE_SRC = '';",
      "export const CLOUD_MEADOW_INITIAL_REFERENCE_ID = '';",
      'export const CLOUD_MEADOW_REFERENCES = Object.freeze([]);',
      'export const CLOUD_MEADOW_SCALE_GROUPS = Object.freeze([]);',
      'export const CLOUD_MEADOW_STATIC_LAYOUT = null;',
      'export const CLOUD_MEADOW_CHARACTERS = Object.freeze([]);',
      'export const getCloudMeadowCharacter = () => null;',
      'export const getCloudMeadowReference = () => null;',
      'export const filterCloudMeadowCharacters = () => [];',
      "export const getCloudMeadowSpriteSrc = () => '';",
      'export const getCloudMeadowSpriteLayout = () => null;'
    ]
  },
  'src/game/disciplineSpriteCatalog.js': {
    module: 'DLC/DisciplineTheRecordOfACrusade/data/disciplineSpriteCatalog.js',
    code: ['export const DISCIPLINE_SPRITE_CATALOG = Object.freeze([]);']
  },
  'src/game/disciplineSprites.js': {
    module: 'DLC/DisciplineTheRecordOfACrusade/data/disciplineSprites.js',
    code: [
      "export const DISCIPLINE_UNIVERSE = 'Discipline: The Record of a Crusade';",
      "export const DISCIPLINE_COSTUME_BASE = '';",
      'export const DISCIPLINE_HERO_BINDINGS = Object.freeze({});',
      'export const DISCIPLINE_STATIC_LAYOUT = null;',
      'export const DISCIPLINE_PROVENANCE_LABELS = Object.freeze({});',
      'export const DISCIPLINE_CATEGORY_LABELS = Object.freeze({});',
      "export const disciplineCostumeId = () => '';",
      'const emptyMap = () => Object.freeze(Object.create(null));',
      'export const DISCIPLINE_SPRITE_REGISTRY = Object.freeze({ entries: Object.freeze([]), byId: emptyMap(), byCharacter: emptyMap(), layouts: emptyMap() });',
      'export const DISCIPLINE_SPRITE_LAYOUTS = DISCIPLINE_SPRITE_REGISTRY.layouts;',
      'export function createDisciplineSpriteRegistry(catalogue) {',
      "  if (!Array.isArray(catalogue)) throw new TypeError('Discipline sprite catalogue must be an array');",
      "  if (catalogue.length) throw new Error('Discipline content is not installed in this distribution');",
      '  return DISCIPLINE_SPRITE_REGISTRY;',
      '}',
      "export const getDisciplineCharacterId = () => '';",
      'export const getDisciplineCostumes = () => [];',
      'export const resolveDisciplineCostume = () => null;',
      'export const getDisciplineSpriteSources = () => [];',
      'export const getDisciplineSpriteLayout = () => null;'
    ]
  }
});

export const DLC_PROFILE_ADAPTER_CONTRACTS = Object.freeze(
  Object.entries(contracts).map(([adapter, value]) => Object.freeze({
    adapter,
    module: value.module,
    code: '// This distribution does not include this optional content.\n' + value.code.join('\n') + '\n'
  }))
);

export function getUnavailableDlcAdapter(adapter, module) {
  const contract = DLC_PROFILE_ADAPTER_CONTRACTS.find(entry => entry.adapter === adapter && entry.module === module);
  return contract?.code ?? null;
}

// Public catalog exports need to retain their names even when their pack is absent.
// Unlike private factory results, they cannot be erased from the module interface.
const exportedValues = Object.freeze({
  'src/game/wardrobeOfficialR13.js': Object.freeze({
    PAYDAY_WEARERS_R13: Object.freeze({ packId: 'payday', factory: 'createWearers', replacement: 'Object.freeze([])' }),
    MAGICKA_WEARERS_R13: Object.freeze({ packId: 'magicka', factory: 'createWearers', replacement: 'Object.freeze([])' }),
    PAYDAY_NAMED_PACKS_R13: Object.freeze({ packId: 'payday', factory: 'createNamedPacks', replacement: 'Object.freeze([])' })
  })
});

export function getUnavailableDlcExport(adapter, name, packId, factory) {
  const contract = exportedValues[adapter]?.[name];
  return contract?.packId === packId && contract.factory === factory ? contract.replacement : null;
}
