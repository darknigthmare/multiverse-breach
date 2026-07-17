import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { LORE_ITEM_OVERRIDES } from '../src/game/loreItemOverrides.js';

const root = process.cwd();
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const getLocalPath = (assetPath) => (
  path.join(root, 'public', String(assetPath || '').replace(/^\/+/, ''))
);

const inspectPng = (filePath) => {
  const source = readFileSync(filePath);
  if (source.length < 26 || !source.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`${filePath}: expected a valid PNG file`);
  }

  return {
    width: source.readUInt32BE(16),
    height: source.readUInt32BE(20),
    colorType: source[25],
    bytes: statSync(filePath).size
  };
};

const rows = [];
for (const [universe, policy] of Object.entries(LORE_ITEM_OVERRIDES)) {
  if (policy.status === 'disabled') continue;
  for (const item of policy.allItems || []) {
    const filePath = getLocalPath(item.icon);
    const available = existsSync(filePath);
    const image = available ? inspectPng(filePath) : null;
    if (image && (image.width !== 512 || image.height !== 512)) {
      throw new Error(`${item.icon}: expected 512x512, received ${image.width}x${image.height}`);
    }
    if (image && ![4, 6].includes(image.colorType)) {
      throw new Error(`${item.icon}: PNG has no alpha-capable color type`);
    }
    rows.push({
      universe,
      id: item.id,
      name: item.name?.en || item.name?.fr || item.id,
      output: item.icon,
      referenceUrl: item.referenceUrl,
      available,
      image
    });
  }
}

const available = rows.filter(row => row.available);
const missing = rows.filter(row => !row.available);
const byUniverse = Object.groupBy(rows, row => row.universe);
const completeUniverses = Object.entries(byUniverse)
  .filter(([, items]) => items.every(item => item.available))
  .map(([universe]) => universe);

console.log(JSON.stringify({
  total: rows.length,
  available: available.length,
  missing: missing.length,
  completeUniverses: completeUniverses.length,
  alphaCapablePngs: available.length,
  completeUniverseNames: completeUniverses,
  nextMissing: missing.slice(0, 24).map(item => ({
    universe: item.universe,
    name: item.name,
    output: item.output,
    referenceUrl: item.referenceUrl
  }))
}, null, 2));
