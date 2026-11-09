// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGex from '../../DLC/Gex/data/canonRosterWavePartE.js';
import * as dlcSpyro from '../../DLC/Spyro/data/canonRosterWavePartE.js';
import * as dlcRayman from '../../DLC/Rayman/data/canonRosterWavePartE.js';
import * as dlcNieR from '../../DLC/NieR/data/canonRosterWavePartE.js';
import * as dlcDisciplineTheRecordOfACrusade from '../../DLC/DisciplineTheRecordOfACrusade/data/canonRosterWavePartE.js';
import * as dlcBibleBlack from '../../DLC/BibleBlack/data/canonRosterWavePartE.js';
import * as dlcHotlineMiami from '../../DLC/HotlineMiami/data/canonRosterWavePartE.js';
import * as dlcWarhammer40000SpaceMarine from '../../DLC/Warhammer40000SpaceMarine/data/canonRosterWavePartE.js';
import * as dlcBackToTheFuture from '../../DLC/BackToTheFuture/data/canonRosterWavePartE.js';
import * as dlcTerminator from '../../DLC/Terminator/data/canonRosterWavePartE.js';
import * as dlcRoboCop from '../../DLC/RoboCop/data/canonRosterWavePartE.js';
import * as dlcTheWalkingDeadTelltale from '../../DLC/TheWalkingDeadTelltale/data/canonRosterWavePartE.js';
import * as dlcHorizonZeroDawn from '../../DLC/HorizonZeroDawn/data/canonRosterWavePartE.js';

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

const definePack = (source, config) => {
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

const SOURCES = Object.freeze({
  gex: dlcGex.createSources(),
  spyro: dlcSpyro.createSources(),
  rayman: dlcRayman.createSources(),
  nier: dlcNieR.createSources(),
  discipline: dlcDisciplineTheRecordOfACrusade.createSources(),
  bibleBlack: dlcBibleBlack.createSources(),
  hotlineMiami: dlcHotlineMiami.createSources(),
  spaceMarine: dlcWarhammer40000SpaceMarine.createSources(),
  backToTheFuture: dlcBackToTheFuture.createSources(),
  terminator: dlcTerminator.createSources(),
  robocop: dlcRoboCop.createSources(),
  walkingDead: dlcTheWalkingDeadTelltale.createSources(),
  horizon: dlcHorizonZeroDawn.createSources()
});

const gex = dlcGex.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const spyro = dlcSpyro.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const rayman = dlcRayman.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const nier = dlcNieR.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const noDamageAction = name => Object.freeze({ name, type: 'status', dmg: 0 });

const discipline = dlcDisciplineTheRecordOfACrusade.createCanonRosterWavePartE({ SOURCES, definePack, noDamageAction, stageVariant });

const bibleBlack = dlcBibleBlack.createCanonRosterWavePartE({ SOURCES, definePack, noDamageAction, stageVariant });

const hotlineMiami = dlcHotlineMiami.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const spaceMarine = dlcWarhammer40000SpaceMarine.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const backToTheFuture = dlcBackToTheFuture.createCanonRosterWavePartE({ SOURCES, definePack, noDamageAction, stageVariant });

const terminator = dlcTerminator.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const robocop = dlcRoboCop.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const walkingDead = dlcTheWalkingDeadTelltale.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

const horizonZeroDawn = dlcHorizonZeroDawn.createCanonRosterWavePartE({ SOURCES, definePack, stageVariant });

export const CANON_ROSTER_WAVE_PART_E = Object.freeze([
  gex,
  spyro,
  rayman,
  nier,
  discipline,
  bibleBlack,
  hotlineMiami,
  spaceMarine,
  backToTheFuture,
  terminator,
  robocop,
  walkingDead,
  horizonZeroDawn
]);
