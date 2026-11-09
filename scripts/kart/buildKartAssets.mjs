import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { KART_ROSTER, KART_DIRECTIONS, KART_MODEL_VERSION } from '../../src/game/kart/kartRoster.js';
import { buildKartMesh } from '../../src/game/kart/kartModel.js';
import { createAssetSourceResolver } from '../assetSourceResolver.mjs';
import { listGitAssetSources, projectAssetPath } from '../dlcAssetPaths.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const MANIFEST = 'docs/kart/kart-assets.json';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const align4 = value => (value + 3) & ~3;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const linear = value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;

/** glTF 2.0 binary with an individual scene node and pivot for every wheel. */
export function exportKartGlb(spec, mesh = buildKartMesh(spec)) {
  const chunks = [], bufferViews = [], accessors = [], meshes = [], nodes = [];
  let offset = 0;
  const addBytes = (bytes, target) => {
    const data = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const view = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: data.length, target });
    chunks.push(data, Buffer.alloc(align4(data.length) - data.length));
    offset += align4(data.length);
    return view;
  };
  const accessor = definition => { accessors.push(definition); return accessors.length - 1; };
  for (const part of mesh.parts) {
    const positions = [], normals = [], colors = [], indices = [], vertices = new Map();
    const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
    for (let vertex = part.start; vertex < part.start + part.count; vertex += 1) {
      const p = Array.from(mesh.positions.subarray(vertex * 3, vertex * 3 + 3), (value, axis) => value - part.pivot[axis]);
      const n = Array.from(mesh.normals.subarray(vertex * 3, vertex * 3 + 3));
      const c = Array.from(mesh.colors.subarray(vertex * 4, vertex * 4 + 4), (value, channel) => Math.round((channel === 3 ? value : linear(value)) * 255));
      const key = [...p, ...n].map(value => value.toFixed(7)).join(',') + ':' + c.join(',');
      let index = vertices.get(key);
      if (index === undefined) {
        index = positions.length / 3; vertices.set(key, index);
        positions.push(...p); normals.push(...n); colors.push(...c);
        for (let axis = 0; axis < 3; axis += 1) { min[axis] = Math.min(min[axis], p[axis]); max[axis] = Math.max(max[axis], p[axis]); }
      }
      indices.push(index);
    }
    const count = positions.length / 3;
    const position = accessor({ bufferView: addBytes(new Float32Array(positions), 34962), componentType: 5126, count, type: 'VEC3', min, max });
    const normal = accessor({ bufferView: addBytes(new Float32Array(normals), 34962), componentType: 5126, count, type: 'VEC3' });
    const color = accessor({ bufferView: addBytes(new Uint8Array(colors), 34962), componentType: 5121, normalized: true, count, type: 'VEC4' });
    const indexType = count > 65535 ? Uint32Array : Uint16Array;
    const index = accessor({ bufferView: addBytes(new indexType(indices), 34963), componentType: count > 65535 ? 5125 : 5123, count: indices.length, type: 'SCALAR' });
    meshes.push({ name: part.id, primitives: [{ attributes: { POSITION: position, NORMAL: normal, COLOR_0: color }, indices: index, mode: 4, material: part.kind === 'wheel' ? 1 : 0 }] });
    nodes.push({ name: part.id, mesh: meshes.length - 1, translation: part.pivot,
      extras: { kind: part.kind, ...(part.kind === 'wheel' ? { steering: part.steering, rollAxis: part.rollAxis, radius: part.radius } : {}) } });
  }
  const driverNode = nodes.length;
  nodes.push({ name: 'DriverSpriteAnchor', translation: mesh.driverAnchor,
    extras: { heroId: spec.heroId, sprite: spec.driverSprite, note: 'Attach the existing character sprite as a camera-facing layer. No substitute driver mesh.' } });
  const rootNode = nodes.length;
  nodes.push({ name: spec.kartName.fr, children: Array.from({ length: driverNode + 1 }, (_, index) => index),
    extras: { heroId: spec.heroId, universe: spec.universe, modelVersion: KART_MODEL_VERSION,
      forwardAxis: '-Z', upAxis: '+Y', unit: 'metre', sourceReferences: spec.sourceReferences,
      referenceAsset: spec.referenceAsset, fidelityStatus: spec.fidelityStatus,
      vehicleIdentity: spec.vehicleIdentity, originalCrossoverAdaptation: true } });
  const binary = Buffer.concat(chunks);
  const document = {
    asset: { version: '2.0', generator: 'Multiverse Breach kartModel.js / authored vehicle mesh export v2',
      copyright: 'Kart adaptation mesh authored for the Multiverse Breach fan project. Referenced vehicles and characters retain their original rights.' },
    scene: 0, scenes: [{ name: spec.kartName.fr, nodes: [rootNode] }], nodes, meshes,
    materials: [
      { name: 'Chassis vertex colours', pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0.35, roughnessFactor: 0.58 } },
      { name: 'Wheel vertex colours', pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0.08, roughnessFactor: 0.86 } }
    ],
    buffers: [{ byteLength: binary.length }], bufferViews, accessors
  };
  const json = Buffer.from(JSON.stringify(document));
  const jsonPadded = Buffer.concat([json, Buffer.alloc(align4(json.length) - json.length, 0x20)]);
  const header = Buffer.alloc(12); header.writeUInt32LE(0x46546c67, 0); header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + binary.length, 8);
  const jsonHeader = Buffer.alloc(8); jsonHeader.writeUInt32LE(jsonPadded.length, 0); jsonHeader.writeUInt32LE(0x4e4f534a, 4);
  const binaryHeader = Buffer.alloc(8); binaryHeader.writeUInt32LE(binary.length, 0); binaryHeader.writeUInt32LE(0x004e4942, 4);
  return Buffer.concat([header, jsonHeader, jsonPadded, binaryHeader, binary]);
}

/**
 * Technical render of the real mesh, not generated concept art or hand-drawn
 * replacement imagery. Every view uses the same geometry, scale and pivot.
 */
export function rasterKartFrame(mesh, view, size = 128) {
  const pixels = Buffer.alloc(size * size * 4), depth = new Float64Array(size * size).fill(-Infinity);
  const angle = view * Math.PI / 4, elevation = 0.56;
  const sa = Math.sin(angle), ca = Math.cos(angle), se = Math.sin(elevation), ce = Math.cos(elevation);
  const right = [ca, 0, -sa], up = [-sa * se, ce, -ca * se], forward = [sa * ce, se, ca * ce];
  const dot = (vector, basis) => vector[0] * basis[0] + vector[1] * basis[1] + vector[2] * basis[2];
  const scale = size * 0.203125, center = [size * 0.5, size * 0.67];
  const project = position => [center[0] + dot(position, right) * scale, center[1] - dot(position, up) * scale, dot(position, forward)];
  const keyLight = [-0.42, 0.82, 0.38];
  // A soft ground shadow remains transparent and does not hide the silhouette.
  for (let y = 0; y < size; y += 1) for (let x = 0; x < size; x += 1) {
    const value = ((x - center[0]) / (size * 0.25)) ** 2 + ((y - center[1]) / (size * 0.13)) ** 2;
    if (value >= 1) continue;
    const index = (y * size + x) * 4;
    pixels[index] = 8; pixels[index + 1] = 13; pixels[index + 2] = 19; pixels[index + 3] = Math.round((1 - value) * 48);
  }
  const edge = (a, b, x, y) => (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
  for (let triangle = 0; triangle < mesh.positions.length / 9; triangle += 1) {
    const vertex = triangle * 3, normal = mesh.normals.subarray(vertex * 3, vertex * 3 + 3);
    if (dot(normal, forward) <= 0) continue;
    const points = [0, 1, 2].map(corner => project(mesh.positions.subarray((vertex + corner) * 3, (vertex + corner + 1) * 3)));
    const [a, b, c] = points, area = edge(a, b, c[0], c[1]);
    if (Math.abs(area) < 1e-8) continue;
    const minX = clamp(Math.floor(Math.min(a[0], b[0], c[0])), 0, size - 1);
    const maxX = clamp(Math.ceil(Math.max(a[0], b[0], c[0])), 0, size - 1);
    const minY = clamp(Math.floor(Math.min(a[1], b[1], c[1])), 0, size - 1);
    const maxY = clamp(Math.ceil(Math.max(a[1], b[1], c[1])), 0, size - 1);
    const illumination = 0.5 + Math.max(0, dot(normal, keyLight)) * 0.48;
    const color = [0, 1, 2].map(channel => clamp(Math.round(mesh.colors[vertex * 4 + channel] * 255 * illumination), 0, 255));
    for (let y = minY; y <= maxY; y += 1) for (let x = minX; x <= maxX; x += 1) {
      const w0 = edge(b, c, x + 0.5, y + 0.5) / area;
      const w1 = edge(c, a, x + 0.5, y + 0.5) / area;
      const w2 = 1 - w0 - w1;
      if (w0 < -1e-7 || w1 < -1e-7 || w2 < -1e-7) continue;
      const z = w0 * a[2] + w1 * b[2] + w2 * c[2], index = y * size + x;
      if (z <= depth[index]) continue;
      depth[index] = z;
      const pixel = index * 4;
      pixels[pixel] = color[0]; pixels[pixel + 1] = color[1]; pixels[pixel + 2] = color[2]; pixels[pixel + 3] = 255;
    }
  }
  return pixels;
}

export function scanAlphaBounds(pixels, width, height) {
  let left = width, top = height, right = -1, bottom = -1, opaquePixels = 0, transparentPixels = 0;
  for (let y = 0; y < height; y += 1) for (let x = 0; x < width; x += 1) {
    const alpha = pixels[(y * width + x) * 4 + 3];
    if (!alpha) { transparentPixels += 1; continue; }
    if (alpha === 255) opaquePixels += 1;
    left = Math.min(left, x); right = Math.max(right, x); top = Math.min(top, y); bottom = Math.max(bottom, y);
  }
  return { left, top, right, bottom, opaquePixels, transparentPixels };
}

export async function exportKartAtlas(mesh, size = 128) {
  const pixels = Buffer.alloc(size * 8 * size * 4), frames = [];
  for (let view = 0; view < 8; view += 1) {
    const frame = rasterKartFrame(mesh, view, size);
    const bounds = scanAlphaBounds(frame, size, size);
    if (bounds.opaquePixels < 100 || bounds.transparentPixels < size * size / 3
      || bounds.left < 2 || bounds.top < 2 || bounds.right >= size - 2 || bounds.bottom >= size - 2) {
      throw new Error(`Kart projection clipped, empty or missing alpha: ${mesh.id} view ${view}`);
    }
    for (let row = 0; row < size; row += 1) frame.copy(pixels, (row * size * 8 + view * size) * 4, row * size * 4, (row + 1) * size * 4);
    frames.push({ direction: KART_DIRECTIONS[view], col: view, row: 0, bounds });
  }
  const png = await sharp(pixels, { raw: { width: size * 8, height: size, channels: 4 } })
    .png({ compressionLevel: 9, adaptiveFiltering: false }).toBuffer();
  return { png, frames, width: size * 8, height: size };
}

const readSources = root => Object.fromEntries([
  'src/game/kart/kartRoster.js', 'src/game/kart/kartModel.js',
  'src/game/kart/kartIdentityCatalog.js', 'src/game/kart/kartIdentityCatalogA.js',
  'src/game/kart/kartIdentityCatalogB.js', 'src/game/kart/kartIdentityGeometry.js',
  'scripts/kart/buildKartAssets.mjs', 'src/game/spriteAssets.js'
].map(path => [path, hash(readFileSync(resolve(root, path)))]));

const listTracked = root => {
  try { return new Map(listGitAssetSources(root).map(path => [projectAssetPath(path).publicPath, path])); }
  catch (error) {
    if (!existsSync(resolve(root, '.git'))) return null;
    throw error;
  }
};

export async function buildKartAssets({ root = ROOT, heroIds = null } = {}) {
  const specs = heroIds ? KART_ROSTER.filter(spec => heroIds.includes(spec.heroId)) : KART_ROSTER;
  if (heroIds && specs.length !== new Set(heroIds).size) throw new Error('Unknown or duplicate requested kart hero ID');
  const sourceFor = createAssetSourceResolver(root), tracked = listTracked(root);
  const assets = [];
  let bytes = 0;
  for (const spec of specs) {
    const mesh = buildKartMesh(spec), glb = exportKartGlb(spec, mesh), atlas = await exportKartAtlas(mesh);
    const modelPath = sourceFor(spec.modelAsset, spec.universe);
    const spritePath = sourceFor(spec.sprite2D.src, spec.universe);
    for (const [path, data] of [[modelPath, glb], [spritePath, atlas.png]]) {
      mkdirSync(dirname(resolve(root, path)), { recursive: true }); writeFileSync(resolve(root, path), data); bytes += data.length;
    }
    const drivers = spec.driverSprite.candidates.map(candidate => {
      const sourcePath = sourceFor(candidate.src, spec.universe);
      const materialized = existsSync(resolve(root, sourcePath));
      return {
        ...candidate, sourcePath,
        tracked: tracked ? tracked.has(candidate.src) : null, materialized,
        sha256: materialized ? hash(readFileSync(resolve(root, sourcePath))) : null,
        availability: tracked?.has(candidate.src) ? 'present-in-git-tree' : materialized ? 'present-in-export' : 'not-found-in-current-source-tree'
      };
    });
    assets.push({
      id: spec.id, heroId: spec.heroId, name: spec.name, universe: spec.universe,
      kartName: spec.kartName, vehicleIdentity: spec.vehicleIdentity,
      bodyStyle: spec.bodyStyle, signature: spec.signature, designSource: spec.designSource,
      fidelityStatus: spec.fidelityStatus, referenceAsset: spec.referenceAsset, sourceReferences: spec.sourceReferences,
      driverFidelityStatus: spec.driverFidelityStatus, driverDirections: spec.driverSprite.directionalStatus,
      driverAvailable: drivers.some(driver => driver.tracked || driver.materialized), driverSprites: drivers,
      model: { sourcePath: modelPath, publicPath: spec.modelAsset, format: 'glTF 2.0 binary', bytes: glb.length,
        sha256: hash(glb), triangleCount: mesh.positions.length / 9, parts: mesh.parts.length, bounds: mesh.bounds,
        features: mesh.features, driverAnchor: mesh.driverAnchor, forwardAxis: '-Z', upAxis: '+Y', units: mesh.units },
      sprite: { sourcePath: spritePath, publicPath: spec.sprite2D.src, bytes: atlas.png.length, sha256: hash(atlas.png),
        width: atlas.width, height: atlas.height, frameWidth: 128, frameHeight: 128, columns: 8, rows: 1,
        anchor: spec.sprite2D.anchor, containsDriver: false, projection: 'orthographic mesh raster',
        frames: atlas.frames }
    });
    if (assets.length % 100 === 0) console.log(`Karts exported ${assets.length}/${specs.length}`);
  }
  const manifest = {
    schemaVersion: 2, modelVersion: KART_MODEL_VERSION, generation: 'explicit vehicle designs, deterministic authored geometry and software projection',
    sourceHashes: readSources(root),
    rosterSha256: hash(Buffer.from(JSON.stringify(KART_ROSTER))),
    sourceRights: 'Kart meshes authored from vehicle references or original universe briefs; referenced vehicle designs, characters and art retain their source rights. No licence to franchise IP is asserted.',
    spriteTreatment: 'Kart-only RGBA eight-view atlas. Existing character sprite remains a separate driver layer in game.',
    fidelity: 'Every model has an explicit vehicle or universe design. Racing proportions, an open seat and simplified geometry adapt the reference; individual 1:1 visual fidelity remains unverified.',
    geometryScope: 'Visual mesh and wheel nodes only. Collision and performance remain governed by the existing race simulation.',
    counts: { characters: assets.length, universes: new Set(assets.map(asset => asset.universe)).size,
      models: assets.length, spriteAtlases: assets.length, directionalFrames: assets.length * 8,
      driverSpritesPresentInGit: assets.filter(asset => asset.driverSprites.some(driver => driver.tracked)).length,
      driverSpritesMaterialized: assets.filter(asset => asset.driverSprites.some(driver => driver.materialized)).length,
      driverSpritesUnresolved: assets.filter(asset => !asset.driverAvailable).length,
      identityAuthored: assets.filter(asset => asset.designSource === 'authored-character-adaptation').length,
      universeFamily: assets.filter(asset => asset.designSource === 'universe-family-adaptation').length,
      roleAndPalette: assets.filter(asset => asset.designSource === 'character-palette-and-role').length,
      canonicalVehicleAdaptations: assets.filter(asset => asset.vehicleIdentity.sourceKind === 'canonical-vehicle-adaptation').length,
      universeInventions: assets.filter(asset => asset.vehicleIdentity.sourceKind === 'universe-invention').length,
      originalUniverseDesigns: assets.filter(asset => asset.vehicleIdentity.sourceKind === 'original-universe-design').length,
      vehicleSilhouettes: new Set(assets.map(asset => asset.vehicleIdentity.model)).size,
      distinctDesignProfiles: new Set(assets.map(asset => asset.vehicleIdentity.id)).size,
      bytes }, assets
  };
  mkdirSync(resolve(root, 'docs/kart'), { recursive: true });
  writeFileSync(resolve(root, MANIFEST), `${JSON.stringify(manifest, null, 2)}\n`);
  return manifest;
}

export async function checkKartAssets({ root = ROOT } = {}) {
  const manifest = JSON.parse(readFileSync(resolve(root, MANIFEST), 'utf8'));
  const sources = readSources(root);
  for (const [path, digest] of Object.entries(sources)) if (manifest.sourceHashes[path] !== digest) throw new Error(`Stale kart source fingerprint: ${path}`);
  if (manifest.rosterSha256 !== hash(Buffer.from(JSON.stringify(KART_ROSTER)))) throw new Error('Stale kart palette, source sprite or character catalogue');
  if (manifest.assets.length !== KART_ROSTER.length) throw new Error('Kart exports do not cover the active character catalogue');
  const byId = new Map(KART_ROSTER.map(spec => [spec.id, spec]));
  for (const asset of manifest.assets) {
    const spec = byId.get(asset.id);
    if (!spec || asset.model.publicPath !== spec.modelAsset || asset.sprite.publicPath !== spec.sprite2D.src) throw new Error(`Wrong kart asset identity: ${asset.id}`);
    if (JSON.stringify(asset.vehicleIdentity) !== JSON.stringify(spec.vehicleIdentity)) throw new Error(`Stale vehicle identity: ${asset.id}`);
    for (const entry of [asset.model, asset.sprite]) {
      const data = readFileSync(resolve(root, entry.sourcePath));
      if (data.length !== entry.bytes || hash(data) !== entry.sha256) throw new Error(`Kart asset bytes changed: ${entry.sourcePath}`);
    }
    const image = await sharp(resolve(root, asset.sprite.sourcePath)).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
    if (image.info.width !== 1024 || image.info.height !== 128 || image.info.channels !== 4) throw new Error(`Bad kart atlas dimensions: ${asset.id}`);
    for (let view = 0; view < 8; view += 1) {
      const frame = Buffer.alloc(128 * 128 * 4);
      for (let row = 0; row < 128; row += 1) image.data.copy(frame, row * 128 * 4, (row * 1024 + view * 128) * 4, (row * 1024 + (view + 1) * 128) * 4);
      const bounds = scanAlphaBounds(frame, 128, 128);
      if (JSON.stringify(bounds) !== JSON.stringify(asset.sprite.frames[view].bounds)) throw new Error(`Kart frame alpha differs: ${asset.id} ${view}`);
    }
  }
  return manifest.counts;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  const valid = args.length === 0 || (args.length === 1 && ['--all', '--check'].includes(args[0]))
    || (args.length === 2 && args[0] === '--heroes' && args[1]);
  if (!valid) throw new Error('Usage: node scripts/kart/buildKartAssets.mjs [--all|--check|--heroes id1,id2]');
  const result = args[0] === '--check' ? await checkKartAssets()
    : (await buildKartAssets({ heroIds: args[0] === '--heroes' ? args[1].split(',') : null })).counts;
  console.log(JSON.stringify(result, null, 2));
}
