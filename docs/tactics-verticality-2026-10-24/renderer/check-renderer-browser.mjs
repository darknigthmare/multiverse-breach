// Focused browser verification of the real terrain renderer module. These
// canvases are deliberately separate from a GameCanvas user-flow proof.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const root = new URL('../../../', import.meta.url);
const directory = new URL('./', import.meta.url);
const sourcePaths = ['src/game/tacticsTerrainRenderer.js', 'src/game/tacticsTerrain.js', 'src/game/tacticsVerticalBattlefields.js'];
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceHashes = async () => Object.fromEntries(await Promise.all(sourcePaths.map(async path => [path, hash(await fs.readFile(new URL(path, root)))])));
const startedAt = new Date().toISOString(), before = await sourceHashes();
const browser = await chromium.launch({ headless: true, executablePath: '/usr/bin/chromium', args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1200, height: 820 }, deviceScaleFactor: 1 });
const pageErrors = [], captures = [], checks = [];
let overlayPixelCheck;
page.on('pageerror', error => pageErrors.push(error.message));
let failure = null, browserClosedAt;
try {
  await page.goto(process.env.TACTICS_BASE_URL || 'http://127.0.0.1:5188', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => { document.body.innerHTML = '<canvas width="1200" height="820" id="terrain"></canvas>'; document.body.style.margin = '0'; });
  for (const map of ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks']) {
    for (const cutLevel of [null, 0]) {
      const result = await page.evaluate(async ({ map, cutLevel }) => {
        const { TACTICS_VERTICAL_BATTLEFIELDS } = await import('/src/game/tacticsVerticalBattlefields.js');
        const { normalizeTacticsTerrain } = await import('/src/game/tacticsTerrain.js');
        const { drawTacticsTerrain, getTerrainDrawList, hitTestTacticsSurface, getSurfacePolygon } = await import('/src/game/tacticsTerrainRenderer.js');
        const definition = TACTICS_VERTICAL_BATTLEFIELDS[map], terrain = normalizeTacticsTerrain(definition);
        const canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
        const project = (x, y, z) => ({ x: 600 + (x - definition.cols / 2) * 84 * (1 + y * 0.025), y: 210 + y * 66 - z * 40 });
        ctx.fillStyle = '#0c1421'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e4edf3'; ctx.font = 'bold 24px sans-serif'; ctx.fillText(definition.label.fr, 32, 44);
        ctx.fillStyle = '#9ab0c1'; ctx.font = '15px sans-serif'; ctx.fillText(cutLevel === null ? 'Terrain complet — toutes les surfaces' : 'Coupe niveau 0 — passage inférieur et accès', 32, 76);
        ctx.fillStyle = '#688093'; ctx.font = '13px sans-serif'; ctx.fillText('Module de rendu du jeu • textures procédurales originales • cette capture n’est pas un parcours GameCanvas', 32, 103);
        const actorSurfaces = terrain.surfaces.filter(surface => map === 'nexus_skybridge'
          ? ['ground:4:3', 'bridge:4:3'].includes(surface.id)
          : map === 'ruined_terraces' ? ['terrace:5:2', 'ground:2:4'].includes(surface.id)
            : ['catwalk:5:2', 'ground:5:2'].includes(surface.id));
        const actors = actorSurfaces.map((surface, index) => ({
          id: 'marker' + index, surfaceId: surface.id, x: surface.x, y: surface.y, z: surface.z, height: 1.9,
          draw: context => {
            const p = project(surface.x + 0.5, surface.y + 0.78, surface.z);
            context.save(); context.fillStyle = 'rgba(1,5,10,0.45)'; context.beginPath(); context.ellipse(p.x, p.y + 1, 18, 6, 0, 0, Math.PI * 2); context.fill();
            context.fillStyle = surface.z > 0 ? '#e8bf61' : '#70bdd4';
            context.fillRect(p.x - 10, p.y - 43, 20, 27); context.fillRect(p.x - 12, p.y - 17, 8, 17); context.fillRect(p.x + 4, p.y - 17, 8, 17);
            context.beginPath(); context.arc(p.x, p.y - 53, 9, 0, Math.PI * 2); context.fill(); context.restore();
          }
        }));
        const overlayCount = new Map();
        const commands = drawTacticsTerrain(ctx, terrain, {
          project, cutLevel, actors,
          drawSurfaceOverlay: (context, surface, face) => {
            overlayCount.set(surface.id, (overlayCount.get(surface.id) || 0) + 1);
            if (face.segment > 0) return;
            const label = `${String.fromCharCode(65 + surface.x)}${surface.y + 1}${surface.z ? ` ↑${surface.z}` : ''}`;
            context.font = '11px monospace'; context.fillStyle = 'rgba(240,248,255,0.66)'; context.fillText(label, face.polygon[0].x + 5, face.polygon[0].y + 13);
          }
        });
        ctx.fillStyle = '#91a9b9'; ctx.font = '14px sans-serif'; ctx.fillText('Pieds bleus : niveau inférieur • pieds dorés : niveau supérieur • les garde-corps sont ajourés', 32, 776);
        const faces = getTerrainDrawList(terrain, { project, cutLevel });
        const topIds = [...new Set(faces.filter(face => face.kind === 'top').map(face => face.surfaceId))];
        const hits = topIds.map(id => {
          const surface = terrain.byId.get(id), polygon = getSurfacePolygon(surface, project);
          const center = { x: polygon.reduce((sum, p) => sum + p.x, 0) / 4, y: polygon.reduce((sum, p) => sum + p.y, 0) / 4 };
          const hit = hitTestTacticsSurface(terrain, center.x, center.y, { project, cutLevel });
          return { id, hit: hit?.id || null };
        });
        return {
          map, cutLevel, surfaces: terrain.surfaces.length, visibleTopSurfaces: topIds.length,
          faces: faces.length, actorCount: commands.filter(command => command.type === 'actor').length,
          guardRails: faces.filter(face => face.kind === 'railing').length,
          overlaysCoverEveryTopSurface: topIds.every(id => overlayCount.has(id)),
          visibleVerticesFinite: faces.every(face => face.polygon.every(point => Number.isFinite(point.x) && Number.isFinite(point.y))),
          cutHidesUpperDecks: cutLevel !== 0 || !faces.some(face => face.surface.shape === 'slab' && face.surface.minZ > 0),
          centerPicking: hits
        };
      }, { map, cutLevel });
      assert.equal(result.overlaysCoverEveryTopSurface, true);
      assert.equal(result.visibleVerticesFinite, true);
      assert.equal(result.cutHidesUpperDecks, true);
      assert.ok(result.faces > result.visibleTopSurfaces);
      const name = `${map}-${cutLevel === null ? 'full' : 'cut0'}.png`;
      await page.locator('canvas').screenshot({ path: fileURLToPath(new URL(name, directory)) });
      const bytes = await fs.readFile(new URL(name, directory));
      captures.push({ path: name, sha256: hash(bytes), bytes: bytes.length });
      checks.push(result);
    }
  }
  overlayPixelCheck = await page.evaluate(async () => {
    const { drawTacticsTerrain, getTerrainDrawList } = await import('/src/game/tacticsTerrainRenderer.js');
    const canvas = document.createElement('canvas'); canvas.width = 240; canvas.height = 240;
    const ctx = canvas.getContext('2d'), project = (x, y, z) => ({ x: 60 + x * 60, y: 170 + y * 45 - z * 30 });
    const tile = { id: 'clip-check', x: 0, y: 0, z: 1, cornerZ: [1, 1, 1, 1], solidBottom: 0.75, materialId: 'nexus-floor' };
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 240, 240);
    drawTacticsTerrain(ctx, { surfaces: [tile] }, { project, drawSurfaceOverlay: context => { context.fillStyle = '#ff00ff'; context.fillRect(0, 0, 240, 240); } });
    const pixel = (x, y) => [...ctx.getImageData(Math.round(x), Math.round(y), 1, 1).data];
    const side = getTerrainDrawList({ surfaces: [tile] }, { project }).find(face => face.kind === 'side');
    const center = { x: side.polygon.reduce((sum, point) => sum + point.x, 0) / side.polygon.length, y: side.polygon.reduce((sum, point) => sum + point.y, 0) / side.polygon.length };
    return { top: pixel(90, 160), outside: pixel(10, 10), wall: pixel(center.x, center.y) };
  });
  assert.deepEqual(overlayPixelCheck.top, [255, 0, 255, 255]);
  assert.deepEqual(overlayPixelCheck.outside, [0, 0, 0, 255]);
  assert.notDeepEqual(overlayPixelCheck.wall, overlayPixelCheck.top);
  assert.deepEqual(pageErrors, []);
} catch (error) {
  failure = error.stack || error.message;
} finally {
  await browser.close();
  browserClosedAt = new Date().toISOString();
}
const after = await sourceHashes();
const sourcesUnchangedDuringRun = JSON.stringify(before) === JSON.stringify(after);
const report = {
  passed: !failure && sourcesUnchangedDuringRun, kind: 'focused-renderer-module-proof',
  actualGameCanvasUserFlows: 0, preliminary: true, finalProductionFreezeClaimed: false,
  startedAt, browserClosedAt, finishedAt: new Date().toISOString(), pageErrors, failure,
  sourceHashesBefore: before, sourceHashesAfter: after, sourcesUnchangedDuringRun, captures, checks, overlayPixelCheck
};
await fs.writeFile(new URL('renderer-browser.json', directory), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: report.passed, captures: captures.length, maps: checks.length / 2, pageErrors, failure, sourcesUnchangedDuringRun }));
assert.equal(report.passed, true);
