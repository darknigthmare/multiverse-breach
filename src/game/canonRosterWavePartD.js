// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcSanctum from '../../DLC/Sanctum/data/canonRosterWavePartD.js';
import * as dlcGoatSimulator from '../../DLC/GoatSimulator/data/canonRosterWavePartD.js';
import * as dlcQuake from '../../DLC/Quake/data/canonRosterWavePartD.js';
import * as dlcLikeADragon from '../../DLC/LikeADragon/data/canonRosterWavePartD.js';
import * as dlcItalianBrainrot from '../../DLC/ItalianBrainrot/data/canonRosterWavePartD.js';
import * as dlcLegacyOfKain from '../../DLC/LegacyOfKain/data/canonRosterWavePartD.js';
import * as dlcPrey2006 from '../../DLC/Prey2006/data/canonRosterWavePartD.js';
import * as dlcBeyondGoodEvil from '../../DLC/BeyondGoodEvil/data/canonRosterWavePartD.js';
import * as dlcMetalHellsinger from '../../DLC/MetalHellsinger/data/canonRosterWavePartD.js';
import * as dlcDeadByDaylight from '../../DLC/DeadByDaylight/data/canonRosterWavePartD.js';
import * as dlcDantesInferno from '../../DLC/DantesInferno/data/canonRosterWavePartD.js';
import * as dlcShadowMan from '../../DLC/ShadowMan/data/canonRosterWavePartD.js';
import * as dlcCrocLegendOfTheGobbos from '../../DLC/CrocLegendOfTheGobbos/data/canonRosterWavePartD.js';

const RESEARCH_DATE = '2026-08-02';

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const lore = (fr, en) => Object.freeze({ fr, en });

const ROLE_STATS = Object.freeze({
  marine: Object.freeze({ hp: 130, atk: 10, def: 8, spd: 4 }),
  horror: Object.freeze({ hp: 115, atk: 11, def: 7, spd: 5 }),
  slayer: Object.freeze({ hp: 105, atk: 14, def: 5, spd: 6 }),
  hacker: Object.freeze({ hp: 100, atk: 12, def: 6, spd: 6 }),
  tactical: Object.freeze({ hp: 120, atk: 11, def: 7, spd: 4 })
});

const move = (value, defaults) => Object.freeze(
  typeof value === 'object' && value !== null
    ? { ...defaults, ...value }
    : { ...defaults, name: value }
);

const fidelity = (source, visualAnchor, authoredLore, canonStatus, extra = {}) => Object.freeze({
  referenceUrl: source.url,
  visualAnchor,
  canonStatus,
  lore: authoredLore,
  ...extra
});

const character = (source, definition) => {
  const {
    id,
    runtimeId = `${source.key}_${id}`,
    name,
    role,
    visualAnchor,
    fr,
    en,
    canonStatus = 'canon protagonist',
    weapon = 'signature action',
    weaponType = 'improvised',
    simple = weapon,
    secondary = `${name} signature technique`,
    defense = `${name} defensive action`,
    special = `${name} decisive action`,
    stats = ROLE_STATS[role] || ROLE_STATS.tactical,
    ...provenance
  } = definition;

  if (provenance.nonCombat === true) {
    return Object.freeze([runtimeId, name, role, fidelity(
      source,
      visualAnchor,
      lore(fr, en),
      canonStatus,
      {
        ...provenance,
        nonCombat: true,
        entityType: provenance.entityType || 'non-combat-character-trial',
        objective: provenance.objective || `Complete ${typeof special === 'object' ? special.name : special} through interaction without combat.`,
        objectiveFr: provenance.objectiveFr || `Terminer l'objectif de ${name} par l'exploration et l'interaction, sans combat.`,
        victoryCondition: provenance.victoryCondition || `complete-${slugify(id)}-objective`,
        output: `/sprites/generated/heroes/${slugify(source.universe)}/${slugify(runtimeId)}.png`,
        spritePrompt: `Original fan-made pixel-art environmental objective sheet, three-quarter RPG exploration view. ${name}. Preserve: ${visualAnchor} Show four readable interaction states, no attack pose, combat HUD, official artwork, logos, text, actor likeness or cross-franchise costume.`
      }
    )]);
  }

  return Object.freeze([runtimeId, name, role, fidelity(
    source,
    visualAnchor,
    lore(fr, en),
    canonStatus,
    {
      ...provenance,
      weapon,
      weaponType,
      stats: Object.freeze({ ...stats }),
      simple: move(simple, { type: weaponType === 'gun' ? 'bullet' : weaponType === 'magic' ? 'energy' : weaponType === 'focus' ? 'status' : 'melee', dmg: weaponType === 'focus' ? 0 : 1.0 }),
      secondary: move(secondary, { type: 'signature', cd: 7, dmg: 1.8 }),
      defense: move(defense, { type: 'dodge', dur: 1.8, reduce: 0.74 }),
      special: move(special, { type: 'origin_aoe', dmg: 4.0 }),
      output: `/sprites/generated/heroes/${slugify(source.universe)}/${slugify(runtimeId)}.png`,
      spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text, actor likeness or cross-franchise costume.`
    }
  )]);
};

const threat = (source, definition) => {
  const {
    id,
    name,
    weapon,
    special,
    visualAnchor,
    fr,
    en,
    canonStatus = 'canon adversary',
    phases = [`Uses ${weapon}`, `Escalates with ${special}`],
    ...extra
  } = definition;

  if (extra.nonCombat === true) {
    return Object.freeze({
      id: `${source.key}_${id}`,
      name,
      ...fidelity(source, visualAnchor, lore(fr, en), canonStatus, {
        output: `/sprites/generated/bosses/${slugify(source.universe)}/${slugify(name)}.png`,
        spritePrompt: `Original fan-made pixel-art environmental objective sheet, three-quarter RPG exploration view. ${name}. Preserve: ${visualAnchor} Show four readable interaction states, no attack pose, combat HUD, official artwork, logo, text, actor likeness or unrelated redesign.`
      }),
      ...extra
    });
  }

  return Object.freeze({
    id: `${source.key}_${id}`,
    name,
    weapon,
    special,
    phases: Object.freeze(phases),
    ...fidelity(source, visualAnchor, lore(fr, en), canonStatus, {
      output: `/sprites/generated/bosses/${slugify(source.universe)}/${slugify(name)}.png`,
      spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text, actor likeness or unrelated redesign.`
    }),
    ...extra
  });
};

const gear = (source, definition) => Object.freeze([
  `${source.key}_${definition.id}`,
  definition.enName,
  definition.frName,
  Object.freeze({ ...definition.boost }),
  fidelity(source, definition.visualAnchor, lore(definition.fr, definition.en), definition.canonStatus || 'canon prop', {
    output: `/sprites/generated/gear/${slugify(source.universe)}/${source.key}_${definition.id}.png`
  })
]);

const event = (source, definition) => Object.freeze([
  `evt_${source.key}_${definition.id}`,
  definition.enName,
  definition.frName,
  definition.en,
  definition.fr,
  fidelity(source, definition.visualAnchor, lore(definition.fr, definition.en), definition.canonStatus || 'canon-inspired event')
]);

const stageMeta = (source, definition) => fidelity(
  source,
  definition.visualAnchor,
  lore(definition.fr, definition.en),
  definition.canonStatus || 'canon location'
);

const stageVariant = (mode, name, difficulty, bossName, metadata) => Object.freeze([
  mode,
  name,
  difficulty,
  bossName,
  metadata
]);

const requiredTrialFields = Object.freeze(['entityType', 'objective', 'objectiveFr', 'victoryCondition']);

const validateTrialDefinition = (source, definition) => {
  if (definition.nonCombat !== true) return;
  const missing = requiredTrialFields.filter(field => !definition[field]);
  if (missing.length > 0) {
    throw new Error(`${source.universe} non-combat entity ${definition.name || definition.id} is missing: ${missing.join(', ')}.`);
  }
};

const definePack = (source, config) => {
  [...config.characters, ...config.monsters, ...config.bosses, config.worldBoss]
    .forEach(definition => validateTrialDefinition(source, definition));

  const characters = config.characters.map(definition => character(source, definition));
  const monsters = config.monsters.map(definition => threat(source, definition));
  const bosses = config.bosses.map(definition => threat(source, definition));
  const worldBoss = threat(source, config.worldBoss);

  if (characters.length !== 3 || monsters.length !== 3 || bosses.length !== 3 || config.gear.length !== 3) {
    throw new Error(`${source.universe} must expose exactly 3 heroes, 3 enemies, 3 bosses and 3 gear items.`);
  }

  return Object.freeze({
    key: source.key,
    universe: source.universe,
    aliases: Object.freeze(config.aliases || []),
    title: config.title || source.universe,
    titleFr: config.titleFr || source.universe,
    mediaType: config.mediaType,
    faction: config.faction,
    mode: config.mode,
    difficulty: config.difficulty,
    colors: Object.freeze(config.colors),
    motif: config.motif,
    theme: config.theme,
    continuity: config.continuity,
    researchDate: RESEARCH_DATE,
    referenceUrl: source.url,
    referenceUrls: Object.freeze(config.referenceUrls || [source.url]),
    visualAnchor: config.visualAnchor,
    canonStatus: config.canonStatus,
    lore: lore(config.fr, config.en),
    desc: lore(config.fr, config.en),
    canonProfile: Object.freeze({
      continuity: config.continuity,
      adaptationRule: config.adaptationRule
    }),
    fidelityNotes: config.adaptationRule,
    ...(config.licensing ? { licensing: Object.freeze(config.licensing) } : {}),
    hero: characters[0],
    allies: Object.freeze(characters.slice(1)),
    monsters: Object.freeze(monsters),
    bosses: Object.freeze(bosses),
    boss: bosses[2].name,
    worldBoss,
    stage: config.stage.name,
    stageMeta: stageMeta(source, config.stage),
    stageVariants: Object.freeze(config.stageVariants),
    gear: Object.freeze(config.gear.map(definition => gear(source, definition))),
    event: event(source, config.event)
  });
};

const SANCTUM = dlcSanctum.createSanctum();
const GOAT_SIMULATOR = dlcGoatSimulator.createGoatSimulator();
const QUAKE = dlcQuake.createQuake();
const LIKE_A_DRAGON = dlcLikeADragon.createLikeADragon();
const ITALIAN_BRAINROT = dlcItalianBrainrot.createItalianBrainrot();
const LEGACY_OF_KAIN = dlcLegacyOfKain.createLegacyOfKain();
const PREY_2006 = dlcPrey2006.createPrey2006();
const BEYOND_GOOD_EVIL = dlcBeyondGoodEvil.createBeyondGoodEvil();
const METAL_HELLSINGER = dlcMetalHellsinger.createMetalHellsinger();
const DEAD_BY_DAYLIGHT = dlcDeadByDaylight.createDeadByDaylight();
const DANTES_INFERNO = dlcDantesInferno.createDantesInferno();
const SHADOW_MAN = dlcShadowMan.createShadowMan();
const CROC = dlcCrocLegendOfTheGobbos.createCroc();

const sanctum = dlcSanctum.createSanctum2({ SANCTUM, definePack, stageVariant });

const goatSimulator = dlcGoatSimulator.createGoatSimulator2({ GOAT_SIMULATOR, definePack, stageVariant });

const quake = dlcQuake.createQuake2({ QUAKE, definePack, stageVariant });

const likeADragon = dlcLikeADragon.createLikeADragon2({ LIKE_A_DRAGON, definePack, stageVariant });

const italianBrainrot = dlcItalianBrainrot.createItalianBrainrot2({ ITALIAN_BRAINROT, definePack, stageVariant });

const legacyOfKain = dlcLegacyOfKain.createLegacyOfKain2({ LEGACY_OF_KAIN, definePack, stageVariant });

const prey2006 = dlcPrey2006.createPrey20062({ PREY_2006, definePack, stageVariant });

const beyondGoodEvil = dlcBeyondGoodEvil.createBeyondGoodEvil2({ BEYOND_GOOD_EVIL, definePack, stageVariant });

const metalHellsinger = dlcMetalHellsinger.createMetalHellsinger2({ METAL_HELLSINGER, definePack, stageVariant });

const deadByDaylight = dlcDeadByDaylight.createDeadByDaylight2({ DEAD_BY_DAYLIGHT, definePack, stageVariant });

const dantesInferno = dlcDantesInferno.createDantesInferno2({ DANTES_INFERNO, definePack, stageVariant });

const shadowMan = dlcShadowMan.createShadowMan2({ SHADOW_MAN, definePack, stageVariant });

const croc = dlcCrocLegendOfTheGobbos.createCroc2({ CROC, definePack, stageVariant });

export const CANON_ROSTER_WAVE_PART_D = Object.freeze([
  sanctum,
  goatSimulator,
  quake,
  likeADragon,
  italianBrainrot,
  legacyOfKain,
  prey2006,
  beyondGoodEvil,
  metalHellsinger,
  deadByDaylight,
  dantesInferno,
  shadowMan,
  croc
]);
