import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { EXPANDED_EVENT_SHOP_ITEMS } from '../src/game/expandedUniverses.js';
import { GEAR_SHOP_VISUAL_CONTRACTS } from '../src/game/gearShopVisualContracts.js';
import { getItemSpriteSrc } from '../src/game/spriteAssets.js';

const root = process.cwd();
const strict = process.argv.includes('--strict');
const showAll = process.argv.includes('--all');
const showDetails = process.argv.includes('--details');
const canonicalOnly = process.argv.includes('--canonical-only');
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const spriteManifest = JSON.parse(readFileSync(
  path.join(root, 'public', 'sprites', 'generated', 'sprite-manifest.json'),
  'utf8'
));
const manifestEntriesByOutput = new Map();
for (const entry of spriteManifest.entries || []) {
  const entries = manifestEntriesByOutput.get(entry.output) || [];
  entries.push(entry);
  manifestEntriesByOutput.set(entry.output, entries);
}

// These seven prototypes are authored directly in HubScreen. Expanded combat
// events include canon OpenAI production and original-OC visuals; provenance,
// rather than the current file format, determines the applicable manifest check.
const STATIC_GEAR_SHOP_ITEMS = [
  { id: 'millennium_puzzle', universe: 'Yu-Gi-Oh', name: { en: 'Millennium Puzzle', fr: 'Puzzle du Millenium' } },
  { id: 'bandana_infinite', universe: 'Metal Gear', name: { en: 'Infinite Bandana', fr: 'Bandana Infini' } },
  { id: 'crucible_guard', universe: 'Doom', name: { en: 'Crucible Hilt', fr: 'Creuset de Chasse' } },
  { id: 'udamage_power', universe: 'Unreal', name: { en: 'U-Damage Amplifier', fr: 'Double Degats U-Damage' } },
  { id: 'evt_fo_nuke', universe: 'Fallout', name: { en: 'Fat Man Nuke Launcher', fr: 'Fat Man Lance-Nuke' } },
  { id: 'evt_doom_quad', universe: 'Doom', name: { en: 'Quad Damage Powerup', fr: 'Multiplicateur Quad Damage' } },
  {
    id: 'evt_ut_redeemer',
    universe: 'Unreal',
    name: { en: 'Redeemer Missile Targeter', fr: 'Viseur de Missile Redempteur' },
    audit: 'legacy-project-art',
    provenance: 'Pre-existing project asset; no OpenAI generation record is available.'
  }
];

const getLocalPath = (assetPath) => (
  path.join(root, 'public', String(assetPath || '').replace(/^\/+/, ''))
);

const inspectPng = (filePath, { originalOc = false } = {}) => {
  const source = readFileSync(filePath);
  if (source.length < 26 || !source.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`${filePath}: expected a valid PNG file`);
  }

  const image = {
    format: 'png',
    width: source.readUInt32BE(16),
    height: source.readUInt32BE(20),
    colorType: source[25],
    alphaCapable: [4, 6].includes(source[25]),
    bytes: statSync(filePath).size
  };
  if (originalOc && (image.width !== image.height || image.width < 512)) {
    throw new Error(
      `${filePath}: expected a square original-OC PNG of at least 512px, `
      + `received ${image.width}x${image.height}`
    );
  }
  if (!originalOc && (image.width !== 512 || image.height !== 512)) {
    throw new Error(`${filePath}: expected 512x512, received ${image.width}x${image.height}`);
  }
  if (originalOc && ![2, 4, 6].includes(image.colorType)) {
    throw new Error(`${filePath}: unsupported original-OC PNG color type ${image.colorType}`);
  }
  if (!originalOc && !image.alphaCapable) {
    throw new Error(`${filePath}: PNG has no alpha-capable color type`);
  }
  return image;
};

const inspectAsset = (filePath, options) => {
  const source = readFileSync(filePath);
  if (source.length >= 26 && source.subarray(0, 8).equals(pngSignature)) {
    return inspectPng(filePath, options);
  }
  if (
    path.extname(filePath).toLowerCase() === '.svg'
    && /<svg(?:\s|>)/i.test(source.toString('utf8'))
  ) {
    return {
      format: 'svg',
      bytes: statSync(filePath).size
    };
  }
  throw new Error(`${filePath}: expected a valid PNG or SVG image`);
};

const auditedItems = [...STATIC_GEAR_SHOP_ITEMS, ...EXPANDED_EVENT_SHOP_ITEMS]
  .filter(item => !canonicalOnly || item.audit !== 'original-oc');
const contractIds = Object.keys(GEAR_SHOP_VISUAL_CONTRACTS);
const contractIdSet = new Set(contractIds);

const rows = auditedItems.map((item) => {
  const output = getItemSpriteSrc(item);
  const filePath = getLocalPath(output);
  const available = Boolean(output) && existsSync(filePath);
  const manifestEntries = manifestEntriesByOutput.get(output) || [];
  const openAiManifestEntry = manifestEntries.find(entry => (
    entry.kind === 'item'
    && entry.available === true
    && entry.source === 'openai'
  ));
  return {
    universe: item.universe,
    id: item.id,
    name: item.name?.en || item.name?.fr || item.id,
    output,
    audit: item.audit,
    provenance: item.provenance,
    metadataContract: Boolean(item.icon && item.iconPrompt && item.referenceUrl && item.visualAnchor),
    available,
    openAiManifest: Boolean(openAiManifestEntry),
    manifestEntries: manifestEntries.length,
    image: available
      ? inspectAsset(filePath, { originalOc: item.audit === 'original-oc' })
      : null
  };
});

const duplicateIds = rows
  .filter((row, index) => rows.findIndex(candidate => candidate.id === row.id) !== index)
  .map(row => row.id);
const duplicateOutputs = rows
  .filter((row, index) => rows.findIndex(candidate => candidate.output === row.output) !== index)
  .map(row => row.output);
const available = rows.filter(row => row.available);
const missing = rows.filter(row => !row.available);
const manifestViolations = available.filter(
  row => !['original-oc', 'legacy-project-art'].includes(row.audit) && !row.openAiManifest
);
const expandedRows = rows.slice(STATIC_GEAR_SHOP_ITEMS.length);
const contractedRows = rows.filter(row => contractIdSet.has(row.id));
const contractMetadataViolations = contractedRows.filter(row => !row.metadataContract);
const orphanContractIds = contractIds.filter(
  id => !rows.some(row => row.id === id)
);
const pngAssets = available.filter(row => row.image?.format === 'png');
const alphaCapablePngs = pngAssets.filter(row => row.image.alphaCapable);
const svgAssets = available.filter(row => row.image?.format === 'svg');

console.log(JSON.stringify({
  scope: canonicalOnly ? 'canonical-only' : 'all',
  total: rows.length,
  staticItems: STATIC_GEAR_SHOP_ITEMS.length,
  expandedItems: expandedRows.length,
  available: available.length,
  missing: missing.length,
  pngAssets: pngAssets.length,
  alphaCapablePngs: alphaCapablePngs.length,
  svgAssets: svgAssets.length,
  originalOcItems: expandedRows.filter(row => row.audit === 'original-oc').length,
  legacyProjectArtItems: rows
    .filter(row => row.audit === 'legacy-project-art')
    .map(row => ({ id: row.id, output: row.output, provenance: row.provenance })),
  openAiManifestEntries: available.filter(
    row => row.audit !== 'original-oc' && row.openAiManifest
  ).length,
  expandedMetadataContracts: expandedRows.filter(row => row.metadataContract).length,
  targetedVisualContracts: contractIds.length,
  matchedVisualContracts: contractedRows.length,
  contractMetadataViolations: contractMetadataViolations.map(row => row.id),
  orphanContractIds,
  duplicateIds: [...new Set(duplicateIds)].sort(),
  duplicateOutputs: [...new Set(duplicateOutputs)].sort(),
  manifestViolations: manifestViolations.map(item => ({
    universe: item.universe,
    id: item.id,
    output: item.output,
    manifestEntries: item.manifestEntries
  })),
  ...(showDetails ? { items: rows } : {}),
  nextMissing: (showAll ? missing : missing.slice(0, 40)).map(item => ({
    universe: item.universe,
    id: item.id,
    name: item.name,
    output: item.output
  }))
}, null, 2));

if (
  duplicateIds.length > 0
  || duplicateOutputs.length > 0
  || (
    strict
    && (
      missing.length > 0
      || manifestViolations.length > 0
      || contractMetadataViolations.length > 0
      || orphanContractIds.length > 0
    )
  )
) {
  process.exitCode = 1;
}
