import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { OC_DLC_PACKS } from '../src/game/ocDlcPacks.js';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, '..');
const publicRoot = path.join(repositoryRoot, 'public');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const stageModes = [
  ['Combat', 'combat'],
  ['Melee', 'melee'],
  ['RPG', 'rpg'],
  ['Tactics', 'tactics']
];
const errors = [];

const publicFile = (assetRoute) => {
  if (typeof assetRoute !== 'string' || !assetRoute.startsWith('/')) {
    throw new Error(`Invalid public asset route: ${String(assetRoute)}`);
  }
  const output = path.resolve(publicRoot, assetRoute.replace(/^\/+/, ''));
  if (output !== publicRoot && !output.startsWith(`${publicRoot}${path.sep}`)) {
    throw new Error(`Asset route escapes public/: ${assetRoute}`);
  }
  return output;
};

const requireFile = (assetRoute) => {
  const filePath = publicFile(assetRoute);
  if (!existsSync(filePath)) {
    throw new Error(`${assetRoute}: file is missing`);
  }
  return filePath;
};

const inspectPng = (assetRoute, expectedSize) => {
  const filePath = requireFile(assetRoute);
  const source = readFileSync(filePath);
  if (source.length < 26 || !source.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`${assetRoute}: expected a valid PNG file`);
  }

  const width = source.readUInt32BE(16);
  const height = source.readUInt32BE(20);
  const colorType = source[25];
  if (width !== expectedSize || height !== expectedSize) {
    throw new Error(`${assetRoute}: expected ${expectedSize}x${expectedSize}, received ${width}x${height}`);
  }
  if (![4, 6].includes(colorType)) {
    throw new Error(`${assetRoute}: PNG does not expose an alpha channel`);
  }
  return {
    route: assetRoute,
    width,
    height,
    colorType,
    bytes: statSync(filePath).size
  };
};

const inspectWebp = (assetRoute) => {
  const filePath = requireFile(assetRoute);
  const source = readFileSync(filePath);
  if (
    source.length < 30
    || source.toString('ascii', 0, 4) !== 'RIFF'
    || source.toString('ascii', 8, 12) !== 'WEBP'
  ) {
    throw new Error(`${assetRoute}: expected a valid WebP file`);
  }

  const format = source.toString('ascii', 12, 16);
  let width;
  let height;
  if (format === 'VP8X') {
    width = source.readUIntLE(24, 3) + 1;
    height = source.readUIntLE(27, 3) + 1;
  } else if (format === 'VP8 ') {
    if (
      source[23] !== 0x9d
      || source[24] !== 0x01
      || source[25] !== 0x2a
    ) {
      throw new Error(`${assetRoute}: malformed VP8 frame header`);
    }
    width = source.readUInt16LE(26) & 0x3fff;
    height = source.readUInt16LE(28) & 0x3fff;
  } else if (format === 'VP8L') {
    if (source[20] !== 0x2f) {
      throw new Error(`${assetRoute}: malformed VP8L frame header`);
    }
    width = 1 + source[21] + ((source[22] & 0x3f) << 8);
    height = 1 + (source[22] >> 6) + (source[23] << 2) + ((source[24] & 0x0f) << 10);
  } else {
    throw new Error(`${assetRoute}: unsupported WebP format ${format}`);
  }

  if (width <= 1_000 || height <= 600) {
    throw new Error(`${assetRoute}: expected dimensions above 1000x600, received ${width}x${height}`);
  }
  return {
    route: assetRoute,
    width,
    height,
    format: format.trim(),
    bytes: statSync(filePath).size
  };
};

const capture = (label, inspect) => {
  try {
    return inspect();
  } catch (error) {
    errors.push(`${label}: ${error.message}`);
    return null;
  }
};

const readJson = (filePath) => {
  if (!existsSync(filePath)) return null;
  return JSON.parse(readFileSync(filePath, 'utf8'));
};

const stageRegistry = readJson(path.join(repositoryRoot, 'src', 'game', 'generatedStageAssets.json'));
const spriteManifest = readJson(path.join(publicRoot, 'sprites', 'generated', 'sprite-manifest.json'));
const stageRows = [];
const sheetRows = [];
const iconRows = [];
const registryRows = [];
const manifestRows = [];

OC_DLC_PACKS.forEach(pack => {
  const stageSlug = pack.universeKey.replaceAll('_', '-');
  const expectedStageRoutes = stageModes.map(([, fileName]) => (
    `/backgrounds/lore-stages/${stageSlug}/${fileName}.webp`
  ));

  expectedStageRoutes.forEach(route => {
    const result = capture(`${pack.id} stage`, () => inspectWebp(route));
    if (result) stageRows.push({ packId: pack.id, ...result });
  });

  const sprites = [
    ...pack.heroes.map(hero => ({ kind: 'hero', id: hero.id, route: hero.spriteSource })),
    ...pack.monsters.map(threat => ({ kind: 'monster', id: threat.id, route: threat.spriteSource })),
    ...pack.bosses.map(threat => ({ kind: 'boss', id: threat.id, route: threat.spriteSource })),
    { kind: 'worldBoss', id: pack.worldBoss.id, route: pack.worldBoss.spriteSource }
  ];
  sprites.forEach(sprite => {
    const result = capture(`${pack.id} ${sprite.kind} ${sprite.id}`, () => inspectPng(sprite.route, 1_024));
    if (result) sheetRows.push({ packId: pack.id, kind: sprite.kind, id: sprite.id, ...result });
  });

  const icons = [
    ...pack.gear.map(gear => ({ kind: 'gear', id: gear[0], route: gear[4]?.icon })),
    { kind: 'event', id: pack.event[0], route: pack.event[5]?.icon },
    { kind: 'summon', id: `${pack.universeKey}_summon`, route: pack.event[5]?.summonIcon }
  ];
  icons.forEach(icon => {
    const result = capture(`${pack.id} ${icon.kind} ${icon.id}`, () => inspectPng(icon.route, 512));
    if (result) iconRows.push({ packId: pack.id, kind: icon.kind, id: icon.id, ...result });
  });

  const registryProfile = stageRegistry?.byProfile?.[pack.universe]
    ?? stageRegistry?.byProfile?.[pack.universeKey];
  if (registryProfile) {
    const registeredRoutes = stageModes.map(([modeName], index) => {
      const route = registryProfile[modeName]?.assetPath;
      const expectedRoute = expectedStageRoutes[index];
      capture(`${pack.id} stage registry ${modeName}`, () => {
        if (route !== expectedRoute) {
          throw new Error(`expected ${expectedRoute}, received ${String(route)}`);
        }
        requireFile(route);
        return true;
      });
      return route;
    });
    registryRows.push({ packId: pack.id, generated: true, routes: registeredRoutes });
  } else {
    registryRows.push({ packId: pack.id, generated: false, routes: [] });
  }

  const manifestEntries = Array.isArray(spriteManifest?.entries)
    ? spriteManifest.entries.filter(entry => (
        entry.kind === 'stage'
        && (
          entry.universe === pack.universe
          || expectedStageRoutes.includes(entry.output)
        )
      ))
    : [];
  if (manifestEntries.length > 0) {
    expectedStageRoutes.forEach(route => {
      capture(`${pack.id} stage manifest ${route}`, () => {
        const entry = manifestEntries.find(candidate => candidate.output === route);
        if (!entry) throw new Error('entry is missing');
        if (entry.available !== true) throw new Error('entry is not marked available');
        requireFile(route);
        return true;
      });
    });
    manifestRows.push({ packId: pack.id, generated: true, entries: manifestEntries.length });
  } else {
    manifestRows.push({ packId: pack.id, generated: false, entries: 0 });
  }
});

const expected = {
  stages: OC_DLC_PACKS.length * 4,
  sheets: OC_DLC_PACKS.reduce((total, pack) => (
    total + pack.heroes.length + pack.monsters.length + pack.bosses.length + 1
  ), 0),
  icons: OC_DLC_PACKS.reduce((total, pack) => total + pack.gear.length + 2, 0)
};

if (stageRows.length !== expected.stages) {
  errors.push(`stage coverage: expected ${expected.stages}, validated ${stageRows.length}`);
}
if (sheetRows.length !== expected.sheets) {
  errors.push(`sprite coverage: expected ${expected.sheets}, validated ${sheetRows.length}`);
}
if (iconRows.length !== expected.icons) {
  errors.push(`icon coverage: expected ${expected.icons}, validated ${iconRows.length}`);
}

console.log(JSON.stringify({
  packs: OC_DLC_PACKS.length,
  expected,
  validated: {
    stages: stageRows.length,
    sheets: sheetRows.length,
    icons: iconRows.length
  },
  stageRegistry: registryRows,
  stageManifest: manifestRows,
  errors
}, null, 2));

if (errors.length > 0) {
  process.exitCode = 1;
}
