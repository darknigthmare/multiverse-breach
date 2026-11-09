import { DLC_PACK_MANIFESTS } from '../../DLC/index.js';
import { isDlcPackInstalled } from './dlcInstallation.js';
// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcPoppyPlaytime from '../../DLC/PoppyPlaytime/data/canonRosterWavePartA.js';
import * as dlcPlantsVsZombies from '../../DLC/PlantsVsZombies/data/canonRosterWavePartA.js';
import * as dlcAvatarNavi from '../../DLC/AvatarNavi/data/canonRosterWavePartA.js';
import * as dlcSkyline from '../../DLC/Skyline/data/canonRosterWavePartA.js';
import * as dlcHappyWheels from '../../DLC/HappyWheels/data/canonRosterWavePartA.js';
import * as dlcMarbleHornets from '../../DLC/MarbleHornets/data/canonRosterWavePartA.js';
import * as dlcTheHorriblySlowMurderer from '../../DLC/TheHorriblySlowMurderer/data/canonRosterWavePartA.js';
import * as dlcSartoriusStedimBiotech from '../../DLC/SartoriusStedimBiotech/data/canonRosterWavePartA.js';
import * as dlcSkibidi from '../../DLC/Skibidi/data/canonRosterWavePartA.js';
import * as dlcTrololo from '../../DLC/Trololo/data/canonRosterWavePartA.js';

// Canon-grounded crossover roster, wave A.
// Runtime tuples stay compatible with requestedUniverseWave.js while metadata keeps
// the source boundary explicit for art direction and lore review.

const CANON = "canon";
const INSPIRED = "canon-inspired";
const ADAPTED = "crossover-adaptation";

const localizedLore = (fr, en) => Object.freeze({ fr, en });

const metadata = (referenceUrl, visualAnchor, canonStatus, fr, en, extra = {}) => Object.freeze({
  referenceUrl,
  visualAnchor,
  canonStatus,
  lore: localizedLore(fr, en),
  ...extra
});

const heroStats = (role) => {
  const profiles = {
    guardian: { hp: 148, atk: 9, def: 12, spd: 4 },
    titan: { hp: 170, atk: 15, def: 12, spd: 4 },
    racer: { hp: 112, atk: 8, def: 6, spd: 12 },
    support: { hp: 116, atk: 8, def: 8, spd: 7 },
    medic: { hp: 118, atk: 7, def: 9, spd: 7 },
    operator: { hp: 124, atk: 8, def: 10, spd: 6 },
    technician: { hp: 120, atk: 9, def: 9, spd: 7 },
    investigator: { hp: 118, atk: 9, def: 7, spd: 8 },
    survivor: { hp: 132, atk: 9, def: 9, spd: 8 },
    performer: { hp: 120, atk: 8, def: 8, spd: 8 }
  };
  return Object.freeze(profiles[role] || { hp: 126, atk: 11, def: 8, spd: 7 });
};

const heroKit = (name, role, signature) => Object.freeze({
  weapon: signature,
  weaponType: signature,
  stats: heroStats(role),
  simple: Object.freeze({ name: signature, type: role === "racer" ? "dash" : "ability", dmg: 1.0 }),
  secondary: Object.freeze({ name: `${signature} Follow-up`, type: "buff", cd: 6, dmg: 1.35 }),
  defense: Object.freeze({ name: `${name} Guard`, type: "shield", dur: 2.0, reduce: 0.7 }),
  special: Object.freeze({ name: `${name} — ${signature}`, type: "nexus_aoe", dmg: 3.4 })
});

const hero = (id, name, role, referenceUrl, visualAnchor, canonStatus, fr, en, signature) => Object.freeze([
  id,
  name,
  role,
  metadata(referenceUrl, visualAnchor, canonStatus, fr, en, {
    signature,
    ...heroKit(name, role, signature)
  })
]);

const threat = (id, name, role, referenceUrl, visualAnchor, canonStatus, fr, en, signature) => Object.freeze({
  id,
  name,
  role,
  signature,
  weapon: signature,
  special: signature,
  ...metadata(referenceUrl, visualAnchor, canonStatus, fr, en)
});

const gear = (id, nameEn, nameFr, boost, referenceUrl, visualAnchor, canonStatus, fr, en) => Object.freeze([
  id,
  nameEn,
  nameFr,
  Object.freeze({ ...boost }),
  metadata(referenceUrl, visualAnchor, canonStatus, fr, en)
]);

const event = (id, nameEn, nameFr, en, fr, referenceUrl, visualAnchor, canonStatus) => Object.freeze([
  id,
  nameEn,
  nameFr,
  en,
  fr,
  metadata(referenceUrl, visualAnchor, canonStatus, fr, en)
]);

const stageVariant = (mode, name, difficulty, bossName, referenceUrl, visualAnchor, canonStatus, fr, en) => Object.freeze([
  mode,
  name,
  difficulty,
  bossName,
  metadata(referenceUrl, visualAnchor, canonStatus, fr, en)
]);

const PACK_PALETTES = Object.freeze({
  poppy_playtime: dlcPoppyPlaytime.createPackPalettes(),
  plants_vs_zombies: dlcPlantsVsZombies.createPackPalettes(),
  avatar_navi: dlcAvatarNavi.createPackPalettes(),
  skyline: dlcSkyline.createPackPalettes(),
  happy_wheels: dlcHappyWheels.createPackPalettes(),
  marble_hornets: dlcMarbleHornets.createPackPalettes(),
  horribly_slow_murderer: dlcTheHorriblySlowMurderer.createPackPalettes(),
  sartorius_stedim_biotech: dlcSartoriusStedimBiotech.createPackPalettes(),
  skibidi: dlcSkibidi.createPackPalettes(),
  trololo: dlcTrololo.createPackPalettes()
});

const definePack = (pack) => {
  const heroes = [pack.hero, ...pack.allies];
  if (heroes.length !== 3 || pack.monsters.length !== 3 || pack.bosses.length !== 3) {
    throw new TypeError(`${pack.universe}: expected 3 heroes, 3 enemies and 3 bosses.`);
  }
  if (pack.stageVariants.length !== 2 || pack.gear.length !== 3 || !pack.worldBoss || !pack.event) {
    throw new TypeError(`${pack.universe}: incomplete world boss, stage variants, gear or event contract.`);
  }

  return Object.freeze({
    ...pack,
    title: pack.title || pack.universe,
    titleFr: pack.titleFr || pack.universe,
    theme: pack.theme || pack.visualAnchor,
    desc: pack.desc || pack.lore,
    colors: pack.colors || PACK_PALETTES[pack.key],
    motif: pack.motif || "facility",
    researchDate: pack.researchDate || "2026-08-01",
    referenceUrls: Object.freeze(pack.referenceUrls || [pack.referenceUrl]),
    continuity: pack.continuity || pack.visualAnchor,
    fidelityNotes: pack.fidelityNotes || pack.lore.en,
    lore: Object.freeze(pack.lore),
    hero: Object.freeze(pack.hero),
    allies: Object.freeze([...pack.allies]),
    monsters: Object.freeze([...pack.monsters]),
    bosses: Object.freeze([...pack.bosses]),
    stageMeta: Object.freeze(pack.stageMeta),
    stageVariants: Object.freeze([...pack.stageVariants]),
    gear: Object.freeze([...pack.gear]),
    event: Object.freeze(pack.event)
  });
};

const POPPY = "https://poppyplaytime.com/pages/characters";
const PVZ = "https://www.ea.com/games/plants-vs-zombies";
const AVATAR = "https://www.avatar.com/pandorapedia/";
const SKYLINE = "https://www.wired.com/2010/11/skyline/";
const HAPPY_WHEELS = "https://www.fancyforce.com/";
const MARBLE_HORNETS = "https://www.youtube.com/@MarbleHornets";
const GINOSAJI = "https://www.youtube.com/watch?v=9VDvgL58h_Y";
const SARTORIUS = "https://www.sartorius.com/en/company/newsroom/capacity-expansions/aubagne-france";
const SKIBIDI = "https://www.youtube.com/@DaFuqBoom";
const TROLOLO = "https://doodles.google/doodle/eduard-khils-83rd-birthday/";

export const CANON_ROSTER_WAVE_PART_A = Object.freeze([
  dlcPoppyPlaytime.createCanonRosterWavePartA({ ADAPTED, CANON, INSPIRED, POPPY, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcPlantsVsZombies.createCanonRosterWavePartA({ CANON, INSPIRED, PVZ, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcAvatarNavi.createCanonRosterWavePartA({ ADAPTED, AVATAR, CANON, INSPIRED, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcSkyline.createCanonRosterWavePartA({ ADAPTED, CANON, INSPIRED, SKYLINE, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcHappyWheels.createCanonRosterWavePartA({ ADAPTED, CANON, HAPPY_WHEELS, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcMarbleHornets.createCanonRosterWavePartA({ ADAPTED, CANON, INSPIRED, MARBLE_HORNETS, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcTheHorriblySlowMurderer.createCanonRosterWavePartA({ ADAPTED, CANON, GINOSAJI, INSPIRED, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcSartoriusStedimBiotech.createCanonRosterWavePartA({ ADAPTED, SARTORIUS, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcSkibidi.createCanonRosterWavePartA({ ADAPTED, CANON, INSPIRED, SKIBIDI, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat }),

  dlcTrololo.createCanonRosterWavePartA({ ADAPTED, CANON, TROLOLO, definePack, event, gear, hero, localizedLore, metadata, stageVariant, threat })
]);

const declaredCanonRosterPacks = DLC_PACK_MANIFESTS.filter(pack => pack.modules.some(module => module.path === 'data/canonRosterWavePartA.js'));
if (declaredCanonRosterPacks.length !== 10) {
  throw new TypeError('CANON_ROSTER_WAVE_PART_A must declare exactly 10 universes.');
}
const expectedCanonRosterUniverses = new Set(declaredCanonRosterPacks.filter(pack => isDlcPackInstalled(pack.id)).map(pack => pack.universe));
if (CANON_ROSTER_WAVE_PART_A.length !== expectedCanonRosterUniverses.size
  || CANON_ROSTER_WAVE_PART_A.some(pack => !expectedCanonRosterUniverses.has(pack.universe))) {
  throw new TypeError('CANON_ROSTER_WAVE_PART_A must contain exactly the installed declared universes.');
}

const runtimeNames = CANON_ROSTER_WAVE_PART_A.map((pack) => pack.universe);
if (new Set(runtimeNames).size !== runtimeNames.length) {
  throw new TypeError("CANON_ROSTER_WAVE_PART_A contains duplicate runtime universe names.");
}
