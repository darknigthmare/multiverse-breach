// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcRickAstley from '../../DLC/RickAstley/data/canonRosterWavePartB.js';
import * as dlcNyanCat from '../../DLC/NyanCat/data/canonRosterWavePartB.js';
import * as dlcSCPFoundation from '../../DLC/SCPFoundation/data/canonRosterWavePartB.js';
import * as dlcMrBean from '../../DLC/MrBean/data/canonRosterWavePartB.js';
import * as dlcKillBill from '../../DLC/KillBill/data/canonRosterWavePartB.js';
import * as dlcFamillePirate from '../../DLC/FamillePirate/data/canonRosterWavePartB.js';
import * as dlcTheWildThornberrys from '../../DLC/TheWildThornberrys/data/canonRosterWavePartB.js';
import * as dlcTelechat from '../../DLC/Telechat/data/canonRosterWavePartB.js';
import * as dlcNicolasEtPimprenelle from '../../DLC/NicolasEtPimprenelle/data/canonRosterWavePartB.js';

const RESEARCH_DATE = '2026-08-01';

const slugify = value => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const lore = (fr, en) => Object.freeze({ fr, en });

const fidelity = (source, visualAnchor, authoredLore, canonStatus = 'canon', extra = {}) => Object.freeze({
  referenceUrl: source.url,
  visualAnchor,
  canonStatus,
  lore: authoredLore,
  ...extra
});

const ROLE_STATS = Object.freeze({
  marine: Object.freeze({ hp: 130, atk: 10, def: 8, spd: 4 }),
  horror: Object.freeze({ hp: 115, atk: 11, def: 7, spd: 5 }),
  slayer: Object.freeze({ hp: 105, atk: 14, def: 5, spd: 6 }),
  hacker: Object.freeze({ hp: 100, atk: 12, def: 6, spd: 6 }),
  tactical: Object.freeze({ hp: 120, atk: 11, def: 7, spd: 4 })
});

const inferWeaponType = (name, moves) => {
  const kit = `${name} ${moves.simple || ''} ${moves.secondary || ''} ${moves.special || ''}`.toLowerCase();
  if (/carbine|rifle|shotgun|pistol|controlled burst|tranquiliser|tranquilizer/.test(kit)) return 'gun';
  if (/katana|hanzo|sabre|sword|steel|slash/.test(kit)) return 'blade';
  if (/micro|chorus|band|beat|song|lullaby|headline|call|chatter|warning/.test(kit)) return 'sound';
  if (/rainbow|pixel|nyan|spark|trail/.test(kit)) return 'rainbow';
  if (/scan|index|procedure|tablet|story|signal|radio|route|order|plan/.test(kit)) return 'focus';
  if (/paw|punch|jab|kick|strike|dash|roll|nudge|toss|swing/.test(kit)) return 'fists';
  return 'improvised';
};

const move = (value, defaults) => Object.freeze(
  typeof value === 'object' && value !== null
    ? { ...defaults, ...value }
    : { ...defaults, name: value }
);

const character = (source, id, name, role, visualAnchor, authoredLore, canonStatus, moves = {}) => {
  const {
    runtimeId: authoredRuntimeId,
    simple,
    secondary,
    defense,
    special,
    weapon: authoredWeapon,
    weaponType: authoredWeaponType,
    stats: authoredStats,
    ...provenance
  } = moves;
  const runtimeId = authoredRuntimeId || `${source.key}_${id}`;
  const weaponType = authoredWeaponType || inferWeaponType(name, { simple, secondary, special });
  const weapon = authoredWeapon || simple || `${name} signature action`;
  const metadata = fidelity(source, visualAnchor, authoredLore, canonStatus, {
    ...provenance,
    weapon,
    weaponType,
    stats: Object.freeze({ ...(authoredStats || ROLE_STATS[role] || ROLE_STATS.tactical) }),
    simple: move(simple, { type: weaponType === 'gun' ? 'bullet' : weaponType === 'laser' ? 'energy' : weaponType === 'sound' ? 'sound' : weaponType === 'focus' ? 'hack' : weaponType === 'rainbow' ? 'energy' : 'melee', dmg: 1.0 }),
    secondary: move(secondary, { type: 'signature', cd: 7, dmg: 1.8 }),
    defense: move(defense, { type: 'dodge', dur: 1.8, reduce: 0.74 }),
    special: move(special, { type: 'origin_aoe', dmg: 4.0 }),
    output: `/sprites/generated/heroes/${slugify(source.universe)}/${slugify(runtimeId)}.png`,
    spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text or cross-franchise costume.`
  });
  return Object.freeze([runtimeId, name, role, metadata]);
};

const threat = (source, id, name, weapon, special, visualAnchor, authoredLore, canonStatus = 'canon', extra = {}) => Object.freeze({
  id: `${source.key}_${id}`,
  name,
  weapon,
  special,
  phases: Object.freeze(extra.phases || [`Uses ${weapon}`, `Escalates with ${special}`]),
  ...fidelity(source, visualAnchor, authoredLore, canonStatus, {
    output: `/sprites/generated/bosses/${slugify(source.universe)}/${slugify(name)}.png`,
    spritePrompt: `Original fan-made pixel-art sprite sheet, three-quarter RPG battle view. ${name}. Preserve: ${visualAnchor} No official artwork, logos, text or unrelated redesign.`
  }),
  ...extra
});

const gear = (source, id, enName, frName, boost, visualAnchor, authoredLore, canonStatus = 'canon prop') => Object.freeze([
  `${source.key}_${id}`,
  enName,
  frName,
  Object.freeze({ ...boost }),
  fidelity(source, visualAnchor, authoredLore, canonStatus, {
    output: `/sprites/generated/gear/${slugify(source.universe)}/${source.key}_${id}.png`
  })
]);

const event = (source, id, enName, frName, enText, frText, visualAnchor, canonStatus = 'canon-inspired event') => Object.freeze([
  `evt_${source.key}_${id}`,
  enName,
  frName,
  enText,
  frText,
  fidelity(source, visualAnchor, lore(frText, enText), canonStatus)
]);

const stageMeta = (source, visualAnchor, fr, en, canonStatus = 'canon location') => fidelity(
  source,
  visualAnchor,
  lore(fr, en),
  canonStatus
);

const stageVariant = (mode, name, difficulty, bossName, metadata) => Object.freeze([
  mode,
  name,
  difficulty,
  bossName,
  metadata
]);

const definePack = (source, config) => Object.freeze({
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
  lore: config.lore,
  desc: config.lore,
  canonProfile: Object.freeze({
    continuity: config.continuity,
    adaptationRule: config.adaptationRule
  }),
  fidelityNotes: config.adaptationRule,
  ...(config.licensing ? { licensing: Object.freeze(config.licensing) } : {}),
  hero: config.hero,
  allies: Object.freeze(config.allies),
  monsters: Object.freeze(config.monsters),
  bosses: Object.freeze(config.bosses),
  boss: config.bosses[2].name,
  worldBoss: config.worldBoss,
  stage: config.stage,
  stageMeta: config.stageMeta,
  stageVariants: Object.freeze(config.stageVariants),
  gear: Object.freeze(config.gear),
  event: config.event
});

const RICK = dlcRickAstley.createRick();

const NYAN = dlcNyanCat.createNyan();

const SCP = dlcSCPFoundation.createScp();

const BEAN = dlcMrBean.createBean();

const KILL_BILL = dlcKillBill.createKillBill();

const PIRATE = dlcFamillePirate.createPirate();

const THORNBERRYS = dlcTheWildThornberrys.createThornberrys();

const TELECHAT = dlcTelechat.createTelechat();

const BEDTIME = dlcNicolasEtPimprenelle.createBedtime();

const rickAstley = dlcRickAstley.createRickAstley({ RICK, character, definePack, event, gear, lore, stageMeta, stageVariant, threat });

const nyanCat = dlcNyanCat.createNyanCat({ NYAN, character, definePack, event, gear, lore, stageMeta, stageVariant, threat });

const scpLicense = Object.freeze({
  license: 'CC BY-SA 3.0',
  attribution: 'Based on SCP Foundation collaborative fiction and the specific SCP Wiki pages linked by each entry; attributed to SCP Wiki contributors.',
  guideUrl: 'https://scp-wiki.wikidot.com/licensing-guide'
});

const scpExtra = referenceUrl => ({
  referenceUrl,
  licensing: 'CC BY-SA 3.0',
  attribution: `SCP Wiki contributors: ${referenceUrl}`
});

const scpFoundation = dlcSCPFoundation.createScpFoundation({ SCP, character, definePack, event, fidelity, gear, lore, scpExtra, scpLicense, stageMeta, stageVariant, threat });

const mrBean = dlcMrBean.createMrBean({ BEAN, character, definePack, event, gear, lore, stageMeta, stageVariant, threat });

const killBill = dlcKillBill.createKillBill2({ KILL_BILL, character, definePack, event, gear, lore, stageMeta, stageVariant, threat });

const famillePirate = dlcFamillePirate.createFamillePirate({ PIRATE, character, definePack, event, gear, lore, stageMeta, stageVariant, threat });

const wildThornberrys = dlcTheWildThornberrys.createWildThornberrys({ THORNBERRYS, character, definePack, event, gear, lore, stageMeta, stageVariant, threat });

const telechat = dlcTelechat.createTelechat2({ TELECHAT, character, definePack, event, gear, lore, stageMeta, stageVariant, threat });

const nicolasEtPimprenelle = dlcNicolasEtPimprenelle.createNicolasEtPimprenelle({ BEDTIME, character, definePack, event, gear, lore, stageMeta, stageVariant, threat });

export const CANON_ROSTER_WAVE_PART_B = Object.freeze([
  rickAstley,
  nyanCat,
  scpFoundation,
  mrBean,
  killBill,
  famillePirate,
  wildThornberrys,
  telechat,
  nicolasEtPimprenelle
]);
