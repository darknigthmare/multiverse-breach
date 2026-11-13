// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcLeDonjonDeNaheulbeuk from '../../DLC/LeDonjonDeNaheulbeuk/data/canonRosterWavePartC.js';
import * as dlcLesAventuriersDuSurvivaure from '../../DLC/LesAventuriersDuSurvivaure/data/canonRosterWavePartC.js';
import * as dlcAdoprixtoxis from '../../DLC/Adoprixtoxis/data/canonRosterWavePartC.js';
import * as dlcRefletsDAcide from '../../DLC/RefletsDAcide/data/canonRosterWavePartC.js';
import * as dlcUnrealTournament from '../../DLC/UnrealTournament/data/canonRosterWavePartC.js';
import * as dlcUnreal from '../../DLC/Unreal/data/canonRosterWavePartC.js';
import * as dlcZootopia from '../../DLC/Zootopia/data/canonRosterWavePartC.js';
import * as dlcMadMaxFuryRoad from '../../DLC/MadMaxFuryRoad/data/canonRosterWavePartC.js';
import * as dlcThePurge from '../../DLC/ThePurge/data/canonRosterWavePartC.js';
import * as dlcSaw from '../../DLC/Saw/data/canonRosterWavePartC.js';
import * as dlcPuppetMaster from '../../DLC/PuppetMaster/data/canonRosterWavePartC.js';
import * as dlcPlaneteHurlante from '../../DLC/PlaneteHurlante/data/canonRosterWavePartC.js';

const RESEARCH_DATE = '2026-08-01';

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

const NAHEULBEUK = dlcLeDonjonDeNaheulbeuk.createNaheulbeuk();

const SURVIVAURE = dlcLesAventuriersDuSurvivaure.createSurvivaure();

const ADOPRIXTOXIS = dlcAdoprixtoxis.createAdoprixtoxis();

const REFLETS = dlcRefletsDAcide.createReflets();

const naheulbeuk = dlcLeDonjonDeNaheulbeuk.createNaheulbeuk2({ NAHEULBEUK, definePack, stageVariant });

const survivaure = dlcLesAventuriersDuSurvivaure.createSurvivaure2({ SURVIVAURE, definePack, stageVariant });

const adoprixtoxis = dlcAdoprixtoxis.createAdoprixtoxis2({ ADOPRIXTOXIS, definePack, stageVariant });

const refletsAcide = dlcRefletsDAcide.createRefletsAcide({ REFLETS, definePack, stageVariant });

const UNREAL_TOURNAMENT = dlcUnrealTournament.createUnrealTournament();

const UNREAL_1998 = dlcUnreal.createUnreal1998();

const unrealTournament = dlcUnrealTournament.createUnrealTournament2({ UNREAL_TOURNAMENT, definePack, stageVariant });

const unreal1998 = dlcUnreal.createUnreal19982({ UNREAL_1998, definePack, stageVariant });

const ZOOTOPIA = dlcZootopia.createZootopia();

const FURY_ROAD = dlcMadMaxFuryRoad.createFuryRoad();

const zootopia = dlcZootopia.createZootopia2({ ZOOTOPIA, definePack, stageVariant });

const furyRoad = dlcMadMaxFuryRoad.createFuryRoad2({ FURY_ROAD, definePack, stageVariant });

const PURGE = dlcThePurge.createPurge();

const SAW = dlcSaw.createSaw();

const thePurge = dlcThePurge.createThePurge({ PURGE, definePack, stageVariant });

const saw = dlcSaw.createSaw2({ SAW, definePack, stageVariant });

const PUPPET_MASTER = dlcPuppetMaster.createPuppetMaster();

const SCREAMERS = dlcPlaneteHurlante.createScreamers();

const puppetMaster = dlcPuppetMaster.createPuppetMaster2({ PUPPET_MASTER, definePack, stageVariant });

const planeteHurlante = dlcPlaneteHurlante.createPlaneteHurlante({ SCREAMERS, definePack, stageVariant });

export const CANON_ROSTER_WAVE_PART_C = Object.freeze([
  naheulbeuk,
  survivaure,
  adoprixtoxis,
  refletsAcide,
  unrealTournament,
  unreal1998,
  zootopia,
  furyRoad,
  thePurge,
  saw,
  puppetMaster,
  planeteHurlante
]);
