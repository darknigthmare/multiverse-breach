// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcSoldierOfFortune from '../../DLC/SoldierOfFortune/data/canonRosterWavePartF.js';
import * as dlcExtremeGhostbusters from '../../DLC/ExtremeGhostbusters/data/canonRosterWavePartF.js';
import * as dlcHeartOfDarkness from '../../DLC/HeartOfDarkness/data/canonRosterWavePartF.js';
import * as dlcRivalSchools from '../../DLC/RivalSchools/data/canonRosterWavePartF.js';
import * as dlcMediEvil from '../../DLC/MediEvil/data/canonRosterWavePartF.js';
import * as dlcJerseyDevil from '../../DLC/JerseyDevil/data/canonRosterWavePartF.js';
import * as dlcGoemonsGreatAdventure from '../../DLC/GoemonsGreatAdventure/data/canonRosterWavePartF.js';
import * as dlcMDK from '../../DLC/MDK/data/canonRosterWavePartF.js';
import * as dlcTailConcerto from '../../DLC/TailConcerto/data/canonRosterWavePartF.js';
import * as dlcRedneckRampage from '../../DLC/RedneckRampage/data/canonRosterWavePartF.js';
import * as dlcHexen from '../../DLC/Hexen/data/canonRosterWavePartF.js';
import * as dlcDukeNukem from '../../DLC/DukeNukem/data/canonRosterWavePartF.js';
import * as dlcMarathon from '../../DLC/Marathon/data/canonRosterWavePartF.js';

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
    nonCombat = false,
    objective,
    objectiveFr,
    victoryCondition,
    ...provenance
  } = definition;

  const common = {
    ...provenance,
    output: `/sprites/generated/heroes/${slugify(source.universe)}/${slugify(runtimeId)}.png`,
    spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text, actor likeness or cross-franchise costume.`
  };

  if (nonCombat) {
    return Object.freeze([runtimeId, name, 'trial', fidelity(
      source,
      visualAnchor,
      lore(fr, en),
      canonStatus,
      {
        ...common,
        nonCombat: true,
        trialType: 'Trial',
        entityType: provenance.entityType || 'non-combat-character-trial',
        objective: objective || `Complete ${typeof special === 'object' ? special.name : special} through interaction without combat.`,
        objectiveFr: objectiveFr || `Terminer l'objectif de ${name} par l'exploration et l'interaction, sans combat.`,
        victoryCondition: victoryCondition || `complete-${slugify(id)}-objective`,
        spritePrompt: `Original fan-made pixel-art environmental Trial sheet. ${name}. Preserve: ${visualAnchor} Show four readable objective states. No combat pose, weapon, opponent bar, official artwork, logo, text or actor likeness.`
      }
    )]);
  }

  return Object.freeze([runtimeId, name, role, fidelity(
    source,
    visualAnchor,
    lore(fr, en),
    canonStatus,
    {
      ...common,
      weapon,
      weaponType,
      stats: Object.freeze({ ...stats }),
      simple: move(simple, { type: weaponType === 'gun' ? 'bullet' : weaponType === 'magic' ? 'energy' : weaponType === 'focus' ? 'status' : 'melee', dmg: weaponType === 'focus' ? 0 : 1.0 }),
      secondary: move(secondary, { type: 'signature', cd: 7, dmg: 1.8 }),
      defense: move(defense, { type: 'dodge', dur: 1.8, reduce: 0.74 }),
      special: move(special, { type: 'origin_aoe', dmg: 4.0 })
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
    phases = weapon && special ? [`Uses ${weapon}`, `Escalates with ${special}`] : [],
    nonCombat = false,
    objective,
    objectiveFr,
    victoryCondition,
    ...extra
  } = definition;

  if (nonCombat) {
    return Object.freeze({
      id: `${source.key}_${id}`,
      name,
      ...fidelity(source, visualAnchor, lore(fr, en), canonStatus, {
        output: `/sprites/generated/bosses/${slugify(source.universe)}/${slugify(name)}.png`,
        spritePrompt: `Original fan-made pixel-art environmental Trial sheet. ${name}. Preserve: ${visualAnchor} Show four readable objective states. No humanoid opponent, combat pose, health bar, official artwork, logo or text.`
      }),
      nonCombat: true,
      trialType: 'Trial',
      objective,
      objectiveFr,
      victoryCondition,
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

const SOLDIER_OF_FORTUNE = dlcSoldierOfFortune.createSoldierOfFortune();
const EXTREME_GHOSTBUSTERS = dlcExtremeGhostbusters.createExtremeGhostbusters();
const HEART_OF_DARKNESS = dlcHeartOfDarkness.createHeartOfDarkness();
const RIVAL_SCHOOLS = dlcRivalSchools.createRivalSchools();
const MEDIEVIL = dlcMediEvil.createMedievil();
const JERSEY_DEVIL = dlcJerseyDevil.createJerseyDevil();
const GOEMON = dlcGoemonsGreatAdventure.createGoemon();
const MDK = dlcMDK.createMdk();
const TAIL_CONCERTO = dlcTailConcerto.createTailConcerto();
const REDNECK_RAMPAGE = dlcRedneckRampage.createRedneckRampage();
const HEXEN = dlcHexen.createHexen();
const DUKE_NUKEM = dlcDukeNukem.createDukeNukem();
const MARATHON = dlcMarathon.createMarathon();

const soldierOfFortune = dlcSoldierOfFortune.createSoldierOfFortune2({ SOLDIER_OF_FORTUNE, definePack, stageVariant });

const extremeGhostbusters = dlcExtremeGhostbusters.createExtremeGhostbusters2({ EXTREME_GHOSTBUSTERS, definePack, stageVariant });

const heartOfDarkness = dlcHeartOfDarkness.createHeartOfDarkness2({ HEART_OF_DARKNESS, definePack, stageVariant });

const rivalSchools = dlcRivalSchools.createRivalSchools2({ RIVAL_SCHOOLS, definePack, stageVariant });

const medievil = dlcMediEvil.createMedievil2({ MEDIEVIL, definePack, stageVariant });

const jerseyDevil = dlcJerseyDevil.createJerseyDevil2({ JERSEY_DEVIL, definePack, stageVariant });

const goemonsGreatAdventure = dlcGoemonsGreatAdventure.createGoemonsGreatAdventure({ GOEMON, definePack, stageVariant });

const mdk = dlcMDK.createMdk2({ MDK, definePack, stageVariant });

const tailConcerto = dlcTailConcerto.createTailConcerto2({ TAIL_CONCERTO, definePack, stageVariant });

const redneckRampage = dlcRedneckRampage.createRedneckRampage2({ REDNECK_RAMPAGE, definePack, stageVariant });

const hexen = dlcHexen.createHexen2({ HEXEN, definePack, stageVariant });

const dukeNukem = dlcDukeNukem.createDukeNukem2({ DUKE_NUKEM, definePack, stageVariant });

const marathon = dlcMarathon.createMarathon2({ MARATHON, definePack, stageVariant });

export const CANON_ROSTER_WAVE_PART_F = Object.freeze([
  soldierOfFortune,
  extremeGhostbusters,
  heartOfDarkness,
  rivalSchools,
  medievil,
  jerseyDevil,
  goemonsGreatAdventure,
  mdk,
  tailConcerto,
  redneckRampage,
  hexen,
  dukeNukem,
  marathon
]);
