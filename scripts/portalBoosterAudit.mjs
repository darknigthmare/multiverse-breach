import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

import {
  BOOSTER_ART_BY_UNIVERSE,
  BOOSTER_ART_UNIVERSES,
  MULTIVERSE_CONVERGENCE_BOOSTER_ART
} from '../src/game/portalBoosterCatalog.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, '..');
const errors = [];
const contentErrors = [];
const contentGaps = [];
const paths = new Set();
let totalBytes = 0;

const contentMinimums = Object.freeze({
  hero: 3,
  equipment: 3,
  event: 1,
  skin: 3,
  archive: 1,
  hud: 1
});

const isRecord = (value) => (
  value !== null
  && typeof value === 'object'
  && !Array.isArray(value)
);

const hasVisibleText = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  if (!isRecord(value)) {
    return false;
  }
  return Object.values(value).some(
    (entry) => typeof entry === 'string' && entry.trim().length > 0
  );
};

const vite = await createServer({
  root: projectRoot,
  appType: 'custom',
  logLevel: 'silent',
  server: { middlewareMode: true }
});

let HEROES_DB;
let EQUIP_ITEMS_DB;
let EVENT_ITEMS_DB;
let SKIN_CATALOG;
let makeBoosterCandidates;
try {
  const heroModule = await vite.ssrLoadModule('/src/game/heroes.js');
  const narrativeModule = await vite.ssrLoadModule('/src/game/narrativeSystems.js');
  const portalModule = await vite.ssrLoadModule('/src/components/PortalScreen.jsx');
  HEROES_DB = heroModule.HEROES_DB;
  EQUIP_ITEMS_DB = heroModule.EQUIP_ITEMS_DB;
  EVENT_ITEMS_DB = heroModule.EVENT_ITEMS_DB;
  SKIN_CATALOG = narrativeModule.SKIN_CATALOG;
  makeBoosterCandidates = portalModule.default.makeBoosterCandidates;
} finally {
  await vite.close();
}

const runtimeUniverses = [...new Set(
  HEROES_DB.map((hero) => hero?.universe).filter(Boolean)
)];
const runtimeUniverseSet = new Set(runtimeUniverses);
const contentByUniverse = new Map(runtimeUniverses.map((universe) => [
  universe,
  {
    hero: 0,
    equipment: 0,
    event: 0,
    skin: 0,
    archive: 0,
    hud: 0
  }
]));
const idsByFamily = new Map([
  ['hero', new Set()],
  ['equipment', new Set()],
  ['event', new Set()],
  ['skin', new Set()]
]);

const registerId = (family, id, sourceLabel) => {
  if (!hasVisibleText(id)) {
    contentErrors.push(`${sourceLabel}: missing id`);
    return;
  }
  const familyIds = idsByFamily.get(family);
  if (familyIds.has(id)) {
    contentErrors.push(`${sourceLabel}: duplicate ${family} id "${id}"`);
  }
  familyIds.add(id);
};

HEROES_DB.forEach((hero, index) => {
  const sourceLabel = `hero[${index}]`;
  if (!isRecord(hero)) {
    contentErrors.push(`${sourceLabel}: expected an object`);
    return;
  }
  registerId('hero', hero.id, sourceLabel);
  if (!hasVisibleText(hero.name)) {
    contentErrors.push(`${sourceLabel}: missing name`);
  }
  if (!hasVisibleText(hero.universe)) {
    contentErrors.push(`${sourceLabel}: missing universe`);
    return;
  }
  const universeCounts = contentByUniverse.get(hero.universe);
  if (universeCounts) {
    universeCounts.hero++;
  }
});

EQUIP_ITEMS_DB.forEach((item, index) => {
  const sourceLabel = `equipment[${index}]`;
  if (!isRecord(item)) {
    contentErrors.push(`${sourceLabel}: expected an object`);
    return;
  }
  registerId('equipment', item.id, sourceLabel);
  if (!hasVisibleText(item.name)) {
    contentErrors.push(`${sourceLabel}: missing name`);
  }
  if (!hasVisibleText(item.universe)) {
    contentErrors.push(`${sourceLabel}: missing universe`);
  } else if (!runtimeUniverseSet.has(item.universe)) {
    contentErrors.push(`${sourceLabel}: unknown universe "${item.universe}"`);
  } else {
    contentByUniverse.get(item.universe).equipment++;
  }

  const boostEntries = isRecord(item.boost) ? Object.entries(item.boost) : [];
  if (
    boostEntries.length === 0
    || boostEntries.some(([statName, value]) => (
      !hasVisibleText(statName) || !Number.isFinite(value)
    ))
  ) {
    contentErrors.push(`${sourceLabel}: boost must contain finite numeric values`);
  }
});

Object.entries(EVENT_ITEMS_DB).forEach(([universe, item], index) => {
  const sourceLabel = `event[${index}]`;
  if (!isRecord(item)) {
    contentErrors.push(`${sourceLabel}: expected an object`);
    return;
  }
  registerId('event', item.id, sourceLabel);
  if (!hasVisibleText(item.name)) {
    contentErrors.push(`${sourceLabel}: missing name`);
  }
  if (!hasVisibleText(universe)) {
    contentErrors.push(`${sourceLabel}: missing universe key`);
  } else if (!runtimeUniverseSet.has(universe)) {
    contentErrors.push(`${sourceLabel}: unknown universe "${universe}"`);
  } else {
    contentByUniverse.get(universe).event++;
  }
  if (!hasVisibleText(item.effect)) {
    contentErrors.push(`${sourceLabel}: missing effect`);
  }
});

const heroById = new Map(HEROES_DB.map((hero) => [hero.id, hero]));
const collectibleSkins = [];
Object.entries(SKIN_CATALOG).forEach(([catalogKey, skin]) => {
  if (!isRecord(skin) || skin.id === 'default' || !skin.heroId) {
    return;
  }

  const sourceLabel = `skin["${catalogKey}"]`;
  const hero = heroById.get(skin.heroId);
  if (!hero) {
    if (skin.heroId !== 'player_anchor') {
      contentErrors.push(`${sourceLabel}: unknown hero "${skin.heroId}"`);
    }
    return;
  }

  registerId('skin', skin.id, sourceLabel);
  if (!hasVisibleText(skin.name)) {
    contentErrors.push(`${sourceLabel}: missing name`);
  }
  if (!hasVisibleText(hero.universe) || !runtimeUniverseSet.has(hero.universe)) {
    contentErrors.push(`${sourceLabel}: missing runtime universe for hero "${skin.heroId}"`);
    return;
  }

  collectibleSkins.push(skin);
  contentByUniverse.get(hero.universe).skin++;
});

const candidateIds = new Set();
for (const universe of runtimeUniverses) {
  const universeHeroes = HEROES_DB.filter((hero) => hero.universe === universe);
  const candidates = makeBoosterCandidates({
    banner: {
      id: `audit:${universe}`,
      color: '#39c5bb',
      match: (hero) => hero.universe === universe
    },
    visibleHeroes: universeHeroes,
    disabledGearIds: new Set()
  });
  const candidateCounts = candidates.reduce((counts, candidate) => ({
    ...counts,
    [candidate.kind]: (counts[candidate.kind] || 0) + 1
  }), {});
  const sourceCounts = contentByUniverse.get(universe);

  for (const kind of ['hero', 'equipment', 'event', 'skin']) {
    if ((candidateCounts[kind] || 0) !== sourceCounts[kind]) {
      contentErrors.push(
        `${universe}: PortalScreen exposes ${candidateCounts[kind] || 0} ${kind}, source registry contains ${sourceCounts[kind]}`
      );
    }
  }
  sourceCounts.archive = candidateCounts.archive || 0;
  sourceCounts.hud = candidateCounts.hud || 0;

  for (const candidate of candidates) {
    if (!hasVisibleText(candidate.id) || !hasVisibleText(candidate.rewardId)) {
      contentErrors.push(`${universe}: PortalScreen candidate is missing an id`);
      continue;
    }
    if (candidate.universe !== universe) {
      contentErrors.push(
        `${universe}: candidate "${candidate.id}" leaked from "${candidate.universe}"`
      );
    }
    if (candidateIds.has(candidate.id)) {
      contentErrors.push(`${universe}: duplicate PortalScreen candidate id "${candidate.id}"`);
    }
    candidateIds.add(candidate.id);
  }
}

for (const [family, familyIds] of idsByFamily) {
  for (const id of familyIds) {
    const owners = [...idsByFamily.entries()]
      .filter(([, ids]) => ids.has(id))
      .map(([owner]) => owner);
    if (owners[0] === family && owners.length > 1) {
      contentErrors.push(`ID collision "${id}" between families: ${owners.join(', ')}`);
    }
  }
}

for (const [universe, counts] of contentByUniverse) {
  const missing = Object.fromEntries(
    Object.entries(contentMinimums)
      .filter(([kind, minimum]) => counts[kind] < minimum)
      .map(([kind, minimum]) => [
        kind,
        { actual: counts[kind], minimum }
      ])
  );
  if (Object.keys(missing).length === 0) {
    continue;
  }
  contentGaps.push({ universe, counts, missing });
  for (const [kind, gap] of Object.entries(missing)) {
    contentErrors.push(
      `${universe}: ${kind} has ${gap.actual}, requires at least ${gap.minimum}`
    );
  }
}

const contentTotals = {
  universes: runtimeUniverses.length,
  hero: HEROES_DB.length,
  equipment: EQUIP_ITEMS_DB.length,
  event: Object.keys(EVENT_ITEMS_DB).length,
  skin: collectibleSkins.length,
  archive: [...contentByUniverse.values()].reduce((sum, counts) => sum + counts.archive, 0),
  hud: [...contentByUniverse.values()].reduce((sum, counts) => sum + counts.hud, 0)
};
contentTotals.total = Object.entries(contentTotals)
  .filter(([kind]) => kind !== 'universes')
  .reduce((sum, [, count]) => sum + count, 0);

const missingUniverses = runtimeUniverses.filter(
  (universe) => universe !== 'Nexus de Convergence' && !BOOSTER_ART_BY_UNIVERSE[universe]
);
const orphanUniverses = BOOSTER_ART_UNIVERSES.filter(
  (universe) => !runtimeUniverseSet.has(universe)
);

if (missingUniverses.length > 0) {
  errors.push(`Missing runtime universes: ${missingUniverses.join(', ')}`);
}
if (orphanUniverses.length > 0) {
  errors.push(`Orphan catalogue universes: ${orphanUniverses.join(', ')}`);
}

for (const universe of BOOSTER_ART_UNIVERSES) {
  const publicPath = BOOSTER_ART_BY_UNIVERSE[universe];

  if (!publicPath?.startsWith('/boosters/') || !publicPath.endsWith('.webp')) {
    errors.push(`${universe}: invalid public path "${publicPath}"`);
    continue;
  }

  if (paths.has(publicPath)) {
    errors.push(`${universe}: duplicate public path "${publicPath}"`);
  }
  paths.add(publicPath);

  const localPath = path.join(projectRoot, 'public', ...publicPath.split('/').filter(Boolean));
  try {
    const fileStats = await stat(localPath);
    totalBytes += fileStats.size;
    if (!fileStats.isFile() || fileStats.size < 50_000) {
      errors.push(`${universe}: suspicious booster asset (${fileStats.size} bytes)`);
    }
  } catch (error) {
    errors.push(`${universe}: missing asset (${error.code || error.message})`);
  }
}

const multiverseAssetPath = path.join(
  projectRoot,
  'public',
  ...MULTIVERSE_CONVERGENCE_BOOSTER_ART.split('/').filter(Boolean)
);
try {
  const fileStats = await stat(multiverseAssetPath);
  totalBytes += fileStats.size;
  if (!fileStats.isFile() || fileStats.size < 50_000) {
    errors.push(`Multiverse convergence: suspicious booster asset (${fileStats.size} bytes)`);
  }
} catch (error) {
  errors.push(`Multiverse convergence: missing asset (${error.code || error.message})`);
}

console.log(JSON.stringify({
  runtimeUniverses: runtimeUniverses.length,
  catalogUniverses: BOOSTER_ART_UNIVERSES.length,
  uniqueAssets: paths.size + 1,
  totalBytes,
  missingUniverses,
  orphanUniverses,
  contentTotals,
  contentMinimums,
  contentGaps,
  contentErrors,
  errors
}, null, 2));

if (errors.length > 0 || contentErrors.length > 0) {
  process.exitCode = 1;
}
