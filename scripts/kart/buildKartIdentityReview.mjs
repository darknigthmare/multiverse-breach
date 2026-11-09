import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { KART_ROSTER, getKartForHero } from '../../src/game/kart/kartRoster.js';
import { UNIVERSE_KART_IDENTITIES } from '../../src/game/kart/kartIdentityCatalog.js';
import { buildKartMesh } from '../../src/game/kart/kartModel.js';
import { rasterKartFrame } from './buildKartAssets.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const BASELINE = 'e2a48558aa8e174b21e331b65298bdf0e3c23415';
const OUT = resolve(ROOT, 'docs/kart');
const escapeXml = text => String(text).replace(/[&<>"']/g, value => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[value]);
const textSvg = (width, height, lines) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${lines.map(({ x, y, size = 14, text, fill = '#c6d9df', weight = 'normal' }) => `<text x="${x}" y="${y}" font-family="DejaVu Sans,sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeXml(text)}</text>`).join('')}</svg>`);
const framePng = async (spec, direction = 3, size = 128) => sharp(rasterKartFrame(buildKartMesh(spec), direction, size), { raw: { width: size, height: size, channels: 4 } }).png().toBuffer();
const countBy = (rows, select) => rows.reduce((counts, row) => { const key = select(row); counts[key] = (counts[key] || 0) + 1; return counts; }, {});

export async function buildKartIdentityReview() {
  mkdirSync(OUT, { recursive: true });
  const assets = JSON.parse(readFileSync(resolve(OUT, 'kart-assets.json'), 'utf8'));
  const baselineAssets = JSON.parse(execFileSync('git', ['show', `${BASELINE}:docs/kart/kart-assets.json`], { cwd: ROOT, maxBuffer: 32 * 1024 * 1024 }).toString('utf8'));
  const byOldId = new Map(baselineAssets.assets.map(asset => [asset.heroId, asset]));
  const geometryGroups = new Map();
  for (const [universe, design] of Object.entries(UNIVERSE_KART_IDENTITIES)) {
    const key = [design.model, design.variant || '', ...[...design.motifs].sort()].join('|');
    const group = geometryGroups.get(key) || [];
    group.push(universe); geometryGroups.set(key, group);
  }
  const beforeAfter = ['ripley', 'masterchief', 'arbiter', 'luke', 'vader', 'han_solo'];
  const width = 760, header = 104, cellW = 380, cellH = 214;
  const compareLayers = [];
  const labels = [
    { x: 28, y: 35, size: 24, weight: 'bold', fill: '#e7f5f0', text: 'Multiverse · Identité des karts' },
    { x: 28, y: 62, size: 13, text: 'Avant / après · même angle et même taille de rendu : 128 px' },
    { x: 28, y: 84, size: 12, text: 'Projections des vrais modèles du jeu · adaptations au format kart' }
  ];
  for (let i = 0; i < beforeAfter.length; i += 1) {
    const spec = getKartForHero(beforeAfter[i]), old = byOldId.get(spec.heroId);
    const x = (i % 2) * cellW, y = header + Math.floor(i / 2) * cellH;
    const png = execFileSync('git', ['show', `${BASELINE}:${old.sprite.sourcePath}`], { cwd: ROOT, maxBuffer: 2 * 1024 * 1024 });
    compareLayers.push({ input: await sharp(png).extract({ left: 3 * 128, top: 0, width: 128, height: 128 }).png().toBuffer(), left: x + 30, top: y + 48 });
    compareLayers.push({ input: await framePng(spec), left: x + 211, top: y + 48 });
    labels.push(
      { x: x + 25, y: y + 19, size: 16, weight: 'bold', fill: '#edf6f1', text: spec.name },
      { x: x + 25, y: y + 39, size: 12, text: spec.vehicleIdentity.referenceVehicle || spec.kartName.fr },
      { x: x + 72, y: y + 190, size: 12, text: 'Avant' },
      { x: x + 252, y: y + 190, size: 12, fill: '#99ebcf', text: 'Après' }
    );
  }
  compareLayers.push({ input: textSvg(width, header + cellH * 3, labels), top: 0, left: 0 });
  await sharp({ create: { width, height: header + cellH * 3, channels: 4, background: '#17242d' } }).composite(compareLayers).png().toFile(resolve(OUT, 'kart-identities-before-after.png'));

  const galleryIds = ['ripley', 'masterchief', 'arbiter', 'bishop', 'luke', 'vader', 'han_solo', 'freeman', 'chell', 'oneill',
    'shepard', 'marty_mcfly', 'batman_tdk', 'sonic_hedgehog', 'miles_tails_prower', 'gandalf_lotr',
    'guybrush_threepwood', 'homer_simpson', 'spyro_spyro', 'crash_bandicoot', 'miku', 'arca_mirelle', 'predator', 'player_anchor'];
  const cols = 4, tileW = 300, tileH = 207, galleryWidth = cols * tileW, galleryHeight = 90 + Math.ceil(galleryIds.length / cols) * tileH;
  const galleryLayers = [], galleryLabels = [
    { x: 25, y: 34, size: 24, weight: 'bold', fill: '#edf6f1', text: 'Véhicules et créations par univers' },
    { x: 25, y: 60, size: 13, text: '24 exemples · deux angles de 128 px · modèle 3D et sprite 2D issus des mêmes faces' }
  ];
  for (let i = 0; i < galleryIds.length; i += 1) {
    const spec = getKartForHero(galleryIds[i]);
    if (!spec) throw new Error(`Unknown gallery pilot: ${galleryIds[i]}`);
    const x = (i % cols) * tileW, y = 90 + Math.floor(i / cols) * tileH;
    galleryLayers.push({ input: await framePng(spec, 1), left: x + 10, top: y + 37 });
    galleryLayers.push({ input: await framePng(spec, 3), left: x + 156, top: y + 37 });
    galleryLabels.push(
      { x: x + 15, y: y + 18, size: 15, weight: 'bold', fill: '#edf6f1', text: spec.name },
      { x: x + 15, y: y + 37, size: 11, text: spec.universe },
      { x: x + 15, y: y + 185, size: 11, fill: '#99ebcf', text: spec.vehicleIdentity.referenceVehicle || spec.kartName.fr }
    );
  }
  galleryLayers.push({ input: textSvg(galleryWidth, galleryHeight, galleryLabels), top: 0, left: 0 });
  await sharp({ create: { width: galleryWidth, height: galleryHeight, channels: 4, background: '#17242d' } }).composite(galleryLayers).png().toFile(resolve(OUT, 'kart-identities-gallery.png'));

  const report = {
    date: '2026-11-09', baselineCommit: BASELINE, modelVersion: assets.modelVersion,
    counts: assets.counts,
    profileKinds: countBy(KART_ROSTER, spec => spec.vehicleIdentity.sourceKind),
    designScopes: countBy(KART_ROSTER, spec => spec.vehicleIdentity.designScope),
    shapes: countBy(KART_ROSTER, spec => spec.vehicleIdentity.model),
    inheritedRoleFallbacks: KART_ROSTER.filter(spec => spec.designSource === 'character-palette-and-role').map(spec => spec.heroId),
    sharedUniverseGeometry: [...geometryGroups.entries()].filter(([, names]) => names.length > 1).map(([geometry, universes]) => ({ geometry, universes })),
    visualReview: {
      automatedScope: 'All exported models and 8 projection crops checked; explicit model/motif coverage tested.',
      interpretation: 'Comparison images are actual mesh projections, not concept illustrations.',
      canonical1to1Approved: 0,
      status: 'Individual reference fidelity, materials and seated driver animation remain open for artistic review.'
    },
    gallery: galleryIds.map(id => {
      const spec = getKartForHero(id);
      return { heroId: id, name: spec.name, universe: spec.universe, kartName: spec.kartName.fr, ...spec.vehicleIdentity };
    })
  };
  writeFileSync(resolve(OUT, 'kart-identity-review.json'), `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ models: assets.counts.models, profiles: assets.counts.distinctDesignProfiles,
    roleFallbacks: report.inheritedRoleFallbacks.length, sharedUniverseGeometry: report.sharedUniverseGeometry.length,
    gallery: galleryIds.length, output: OUT }, null, 2));
  return report;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildKartIdentityReview();
