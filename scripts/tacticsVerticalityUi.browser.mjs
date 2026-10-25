// Exercise the actual CustomBattleMode → GameCanvas → EngineTactics path.
// The only runtime hook observes the real engine instance; no rule, position,
// movement cost, projection, targeting or rendering implementation is replaced.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const preliminary = process.argv.includes('--preliminary');
assert.ok(preliminary || process.argv.includes('--after-integration-freeze'), 'Use --preliminary or --after-integration-freeze');
const startedAt = new Date().toISOString();
const output = process.env.TACTICS_UI_PROOF_DIR || `/tmp/tactics-ui-proof/${startedAt.replace(/[^0-9]/g, '')}`;
fs.mkdirSync(output, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const harnessPath = fileURLToPath(import.meta.url);
const harnessBytesAtStart = fs.readFileSync(harnessPath);
const harnessSha256AtStart = sha(harnessBytesAtStart);
const harnessSnapshotPath = path.join(output, 'harness.mjs');
fs.writeFileSync(harnessSnapshotPath, harnessBytesAtStart);
function snapshot() {
  const files = {};
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.(?:jsx?|json)$/.test(entry.name)) files[path.relative(root, file)] = sha(fs.readFileSync(file));
    }
  }
  visit(path.join(root, 'src'));
  return files;
}
const sourceHashesBefore = snapshot();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const pageErrors = [], rows = [], artifacts = [{ path: harnessSnapshotPath, sha256: harnessSha256AtStart, bytes: harnessBytesAtStart.length }];
page.on('pageerror', error => pageErrors.push(error.message));
async function capture(name, locator) {
  const target = path.join(output, name + '.png');
  if (locator) await locator.screenshot({ path: target });
  else await page.screenshot({ path: target, fullPage: true });
  artifacts.push({ path: target, sha256: sha(fs.readFileSync(target)), bytes: fs.statSync(target).size });
}
async function mount() {
  await page.goto(process.env.TACTICS_UI_URL || 'http://127.0.0.1:5188/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(async () => {
    const source = await (await fetch('/src/components/GameCanvas.jsx')).text();
    const main = await (await fetch('/src/main.jsx')).text();
    const reactUrl = source.match(/from ["'](\/node_modules\/\.vite\/deps\/react\.js[^"']*)["']/)?.[1];
    const domUrl = main.match(/from ["'](\/node_modules\/\.vite\/deps\/react-dom_client\.js[^"']*)["']/)?.[1];
    const engineUrl = source.match(/from ["'](\/src\/game\/engineTactics\.js[^"']*)["']/)?.[1];
    if (!reactUrl || !domUrl || !engineUrl) throw new Error('Application singleton/module URLs were not resolved');
    const react = await import(reactUrl), React = react.default || react;
    const dom = await import(domUrl), { createRoot } = dom.default || dom;
    const { EngineTactics } = await import(engineUrl);
    const { getSpriteSheetLayout } = await import('/src/game/spriteAssets.js');
    const { default: CustomBattleMode } = await import('/src/components/CustomBattleMode.jsx');
    const { HEROES_DB } = await import('/src/game/heroes.js');
    const startTurn = EngineTactics.prototype.startTurn;
    EngineTactics.prototype.startTurn = function (...args) {
      window.terrainUiEngine = this;
      return startTurn.apply(this, args);
    };
    // Observe the real unit renderer and Canvas transform. Delegation preserves
    // every pixel/rule; no renderer, actor coordinate or movement is substituted.
    const drawTacticsUnit = EngineTactics.prototype.drawTacticsUnit;
    window.terrainUiCloudDraws = [];
    EngineTactics.prototype.drawTacticsUnit = function (ctx, entry, ...args) {
      const unit = entry.unit;
      if ((unit.sourceHeroId || unit.sourceId || unit.id) !== 'cloud_ff7') return drawTacticsUnit.call(this, ctx, entry, ...args);
      const original = ctx.drawImage;
      ctx.drawImage = function (image, ...coordinates) {
        const matrix = ctx.getTransform(), layout = getSpriteSheetLayout(new URL(image.src).pathname);
        const baseline = layout.baseline ?? 232;
        const [sx, sy, sw, sh, dx, dy, dw, dh] = coordinates;
        window.terrainUiCloudDraws.push({ surfaceId: unit.surfaceId, gridZ: unit.gridZ,
          moving: !!unit.terrainMotion, renderZ: unit.terrainRenderPosition?.z ?? unit.gridZ,
          pivot: { x: unit.x, y: unit.y }, sheet: new URL(image.src).pathname,
          source: [sx, sy, sw, sh], baseline,
          projectedFeetY: matrix.f + matrix.b * (dx + dw / 2) + matrix.d * (dy + baseline / sh * dh) });
        window.terrainUiCloudDraws = window.terrainUiCloudDraws.slice(-200);
        return original.call(ctx, image, ...coordinates);
      };
      try { return drawTacticsUnit.call(this, ctx, entry, ...args); }
      finally { ctx.drawImage = original; }
    };
    const props = {
      lang: 'fr', playerProfile: { name: 'Contrôle terrain' }, heroes: HEROES_DB,
      unlockedHeroes: ['cloud_ff7', 'isaac'], activeTeam: ['cloud_ff7'],
      heroLevels: {}, equippedGear: {}, equippedEventItems: {}, heroTalents: {},
      heroSkins: {}, completedStages: [], hiddenUniverses: [], disabledAssets: {}, dedicatedSession: true
    };
    const host = document.body.appendChild(document.createElement('div'));
    host.style.padding = '8px';
    document.getElementById('root').style.display = 'none';
    function Session() {
      const [paused, setPaused] = React.useState(false);
      const [collection, setCollection] = React.useState({ archives: [], customBattlePreset: { mode: 'Tactics', playerTeamIds: ['cloud_ff7'], opponentControl: 'p2', items: false, tacticsBattlefieldId: 'auto' } });
      window.terrainUiCollection = collection;
      return React.createElement(React.Fragment, null,
        React.createElement('button', { type: 'button', id: 'terrain-ui-review-pause', onClick: () => setPaused(value => !value) }, paused ? 'Reprendre le terrain' : 'Pause du terrain'),
        React.createElement(CustomBattleMode, { ...props, portalCollection: collection, setPortalCollection: setCollection, sessionPaused: paused }));
    }
    window.terrainUiRoot = createRoot(host);
    window.terrainUiRoot.render(React.createElement(Session));
  });
  await page.getByLabel('TERRAIN TACTIQUE', { exact: true }).waitFor();
}
const actorSnapshot = () => {
  const engine = window.terrainUiEngine;
  return JSON.stringify({ actors: [...engine.heroes, ...engine.enemies].map(unit => [unit.id, unit.runtimeId, unit.gridX, unit.gridY, unit.surfaceId, unit.currentHp]), spent: engine.movementSpent, phase: engine.actionPhase });
};
let failure = null, browserClosedAt = null;
try {
  for (const fieldId of ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks']) {
    await mount();
    const field = page.getByLabel('TERRAIN TACTIQUE', { exact: true });
    for (const id of ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks']) assert.equal(await field.locator(`option[value="${id}"]`).count(), 1);
    await field.selectOption(fieldId);
    await page.waitForFunction(id => window.terrainUiCollection.customBattlePreset.tacticsBattlefieldId === id, fieldId);
    await page.getByRole('button', { name: /^LANCER TACTIQUE/ }).click();
    const panel = page.getByRole('region', { name: 'Hauteurs et cases du terrain' });
    await panel.waitFor({ timeout: 30000 });
    await page.waitForFunction(() => window.terrainUiEngine?.getTerrainViewState?.()?.vertical && !window.terrainUiEngine.paused);
    const launch = await page.evaluate(() => ({ field: window.terrainUiEngine.battlefield.id, vertical: window.terrainUiEngine.getTerrainViewState().vertical, levels: window.terrainUiEngine.getTerrainViewState().levels }));
    assert.equal(launch.field, fieldId); assert.equal(launch.vertical, true); assert.ok(launch.levels.length > 1);
    const canonicalCommands = ['Taille de Buster Sword', 'Braver', 'Parade de Buster Sword'];
    for (const name of canonicalCommands) await page.getByRole('button', { name: new RegExp(name) }).waitFor();
    rows.push({ check: 'source-defined-canonical-command-labels-in-the-real-GameCanvas', fieldId, commands: canonicalCommands, passed: true });
    const beforeCut = await page.evaluate(actorSnapshot);
    const cut = panel.getByLabel('Coupe du terrain', { exact: true });
    await cut.selectOption(String(launch.levels[0]));
    assert.equal(await page.evaluate(actorSnapshot), beforeCut, 'Changing a cut cannot move a unit or spend AP');
    const canvas = page.getByLabel(/^Plateau tactique/);
    await canvas.focus();
    await page.keyboard.press('PageUp');
    await page.waitForFunction(level => window.terrainUiEngine.getTerrainViewState().visibleLevel !== level, launch.levels[0]);
    assert.equal(await page.evaluate(actorSnapshot), beforeCut, 'Keyboard cuts cannot change world state');
    await cut.selectOption('all');
    const zoomBefore = await page.evaluate(() => window.terrainUiEngine.getCameraState().zoom);
    await panel.getByRole('button', { name: 'Zoomer le plateau', exact: true }).click();
    assert.ok(await page.evaluate(() => window.terrainUiEngine.getCameraState().zoom) > zoomBefore);
    assert.equal(await page.evaluate(actorSnapshot), beforeCut, 'Zoom cannot change world state');
    await panel.getByRole('button', { name: /^Recadrer/ }).click();
    assert.equal(await page.evaluate(() => window.terrainUiEngine.getCameraState().zoom), 1);
    assert.equal(await page.evaluate(actorSnapshot), beforeCut, 'Recentering cannot change world state');
    rows.push({ check: 'real-touch-zoom-and-recenter-without-AP', fieldId, passed: true });
    await capture(fieldId + '-desktop', panel);
    rows.push({ check: 'real-custom-map-launch-and-view-only-cuts', fieldId, levels: launch.levels, passed: true });

    if (fieldId === 'nexus_skybridge') {
      const stack = await page.evaluate(() => {
        const terrain = window.terrainUiEngine.terrain;
        return [...terrain.byCell.values()].find(surfaces => surfaces.length > 1).map(surface => ({ id: surface.id, x: surface.x, y: surface.y, z: surface.z }));
      });
      assert.ok(stack.length >= 2);
      // Inspecting a known overlapping coordinate does not replace picking or
      // any engine rule; the following choices and confirmation use real UI.
      await page.evaluate(id => window.terrainUiEngine.selectTerrainSurface(id), stack[0].id);
      const surfaces = panel.getByLabel('Surfaces à cette coordonnée', { exact: true });
      await surfaces.waitFor();
      const beforeInspection = await page.evaluate(actorSnapshot);
      await surfaces.selectOption(stack.at(-1).id);
      await page.waitForFunction(id => window.terrainUiEngine.getTerrainViewState().selectedSurface?.id === id, stack.at(-1).id);
      assert.equal(await page.evaluate(actorSnapshot), beforeInspection);
      await canvas.focus();
      await page.keyboard.press('BracketLeft');
      await page.waitForFunction(id => window.terrainUiEngine.getTerrainViewState().selectedSurface?.id !== id, stack.at(-1).id);
      assert.equal(await page.evaluate(actorSnapshot), beforeInspection);
      rows.push({ check: 'explicit-overlapping-surface-selection-without-AP', surfaces: stack, passed: true });
      const cursorBefore = await page.evaluate(() => window.terrainUiEngine.getTerrainViewState().selectedSurface);
      await page.keyboard.press('ArrowRight');
      const cursorAfter = await page.evaluate(() => window.terrainUiEngine.getTerrainViewState().selectedSurface);
      assert.equal(cursorAfter.x, cursorBefore.x + 1);
      assert.equal(cursorAfter.y, cursorBefore.y);
      assert.equal(cursorAfter.z, cursorBefore.z);
      assert.equal(await page.evaluate(actorSnapshot), beforeInspection);
      await page.keyboard.press('ArrowLeft');
      assert.equal(await page.evaluate(() => window.terrainUiEngine.getTerrainViewState().selectedSurface.id), cursorBefore.id);
      rows.push({ check: 'real-arrow-key-inspection-preserves-floor-and-AP', from: cursorBefore.id, to: cursorAfter.id, passed: true });

      await page.getByRole('button', { name: 'Pause du terrain', exact: true }).click();
      await page.waitForFunction(() => window.terrainUiEngine.paused === true);
      for (const control of await panel.locator('button,select').all()) assert.equal(await control.isDisabled(), true);
      const pausedState = await page.evaluate(actorSnapshot);
      await canvas.focus(); await page.keyboard.press('PageDown'); await page.keyboard.press('Enter');
      assert.equal(await page.evaluate(actorSnapshot), pausedState);
      await page.getByRole('button', { name: 'Reprendre le terrain', exact: true }).click();
      await page.waitForFunction(() => window.terrainUiEngine.paused === false);
      rows.push({ check: 'pause-disables-real-view-and-confirmation-controls', passed: true });

      const movement = await page.evaluate(() => {
        const engine = window.terrainUiEngine, unit = engine.activeUnit;
        const start = { id: unit.surfaceId, x: unit.gridX, y: unit.gridY, z: unit.gridZ,
          pivot: { x: unit.x, y: unit.y } };
        const candidates = [...engine.movementRange].sort((a, b) =>
          Number(b.surfaceId === 'ground:0:3') - Number(a.surfaceId === 'ground:0:3') || a.cost - b.cost);
        for (const cell of candidates) {
          if (!cell.surfaceId || cell.surfaceId === unit.surfaceId) continue;
          const surface = engine.terrain.byId.get(cell.surfaceId);
          if (!surface || surface.id !== 'ground:0:3') continue;
          engine.setTerrainLevel(surface.z);
          const point = engine.gridToScreen(surface.x, surface.y, true, surface.id);
          if (engine.screenToGrid(point.x, point.y)?.surfaceId !== surface.id) continue;
          engine.selectTerrainSurface(unit.surfaceId);
          return { id: surface.id, x: surface.x, y: surface.y, z: surface.z, point, cost: cell.cost,
            path: cell.path, transitions: cell.transitions, start, spentBefore: engine.movementSpent };
        }
        throw new Error('The real staircase approach ground:0:3 is not reachable/pickable: ' + JSON.stringify({ start, candidates }));
      });
      await cut.selectOption(String(movement.z));
      assert.notEqual(await page.evaluate(() => window.terrainUiEngine.getTerrainViewState().selectedSurface?.id), movement.id);
      const rect = await canvas.boundingBox();
      await canvas.click({ position: { x: movement.point.x * rect.width / 1040, y: movement.point.y * rect.height / 460 } });
      await page.waitForFunction(id => window.terrainUiEngine.getTerrainViewState().selectedSurface?.id === id, movement.id);
      assert.equal(await page.evaluate(() => window.terrainUiEngine.movementSpent), movement.spentBefore, 'Picking alone cannot spend AP');
      await page.keyboard.press('Enter');
      await page.waitForFunction(id => window.terrainUiEngine.activeUnit?.surfaceId === id, movement.id);
      await page.waitForFunction(() => window.terrainUiEngine.actionPhase !== 'moving');
      const afterMove = await page.evaluate(() => ({ surfaceId: window.terrainUiEngine.activeUnit.surfaceId, spent: window.terrainUiEngine.movementSpent }));
      assert.equal(afterMove.spent - movement.spentBefore, movement.cost);
      rows.push({ check: 'real-canvas-pick-and-keyboard-confirmation-move-with-exact-AP', movement, afterMove, passed: true });
      // Cloud has two movement AP here; reaching the first stair from its
      // original spawn costs three. End real turns to renew the real budget.
      const turnsPassed = [];
      for (let turn = 0; turn < 8; turn++) {
        const beforeTurn = await page.evaluate(() => {
          const engine = window.terrainUiEngine, unit = engine.activeUnit;
          return { runtimeId: unit.runtimeId || unit.id, sourceId: unit.sourceHeroId || unit.sourceId || unit.id,
            type: engine.activeUnitType, surfaceId: unit.surfaceId, spent: engine.movementSpent };
        });
        await page.getByRole('button', { name: /FINIR LE TOUR/ }).click();
        await page.waitForFunction(previous => {
          const unit = window.terrainUiEngine.activeUnit;
          return unit && (unit.runtimeId || unit.id) !== previous;
        }, beforeTurn.runtimeId);
        turnsPassed.push(beforeTurn);
        const returned = await page.evaluate(() => {
          const engine = window.terrainUiEngine, unit = engine.activeUnit;
          return engine.activeUnitType === 'hero' && (unit.sourceHeroId || unit.sourceId || unit.id) === 'cloud_ff7'
            && engine.actionPhase === 'move' && engine.movementSpent === 0;
        });
        if (returned) break;
      }
      const ascending = await page.evaluate(() => {
        const engine = window.terrainUiEngine, unit = engine.activeUnit;
        const start = { id: unit.surfaceId, x: unit.gridX, y: unit.gridY, z: unit.gridZ };
        if (engine.activeUnitType !== 'hero' || (unit.sourceHeroId || unit.sourceId || unit.id) !== 'cloud_ff7') throw new Error('Real UI turns did not return to Cloud');
        const diagnostics = [];
        for (const candidate of [...engine.movementRange].sort((a, b) => a.cost - b.cost)) {
          const surface = engine.terrain.byId.get(candidate.surfaceId);
          if (!surface || surface.z <= start.z) continue;
          engine.setTerrainLevel(surface.z);
          const point = engine.gridToScreen(surface.x, surface.y, true, surface.id);
          const picked = engine.screenToGrid(point.x, point.y);
          if (picked?.surfaceId !== surface.id) { diagnostics.push({ id: surface.id, point, picked }); continue; }
          engine.selectTerrainSurface(unit.surfaceId);
          return { id: surface.id, x: surface.x, y: surface.y, z: surface.z, point, cost: candidate.cost,
            path: candidate.path, transitions: candidate.transitions, start, spentBefore: engine.movementSpent };
        }
        throw new Error('No real higher accessible stair after the approach turn: ' + JSON.stringify({ start, range: engine.movementRange, diagnostics }));
      });
      await cut.selectOption(String(ascending.z));
      const ascendingRect = await canvas.boundingBox();
      await canvas.click({ position: { x: ascending.point.x * ascendingRect.width / 1040, y: ascending.point.y * ascendingRect.height / 460 } });
      await page.waitForFunction(id => window.terrainUiEngine.getTerrainViewState().selectedSurface?.id === id, ascending.id);
      assert.equal(await page.evaluate(() => window.terrainUiEngine.movementSpent), ascending.spentBefore);
      await page.keyboard.press('Enter');
      await page.waitForFunction(id => window.terrainUiEngine.activeUnit?.surfaceId === id, ascending.id);
      await page.waitForFunction(() => window.terrainUiEngine.actionPhase !== 'moving');
      assert.equal(await page.evaluate(() => window.terrainUiEngine.movementSpent), ascending.spentBefore + ascending.cost);
      await page.waitForFunction(id => window.terrainUiCloudDraws.some(draw => draw.surfaceId === id && !draw.moving), ascending.id);
      const ascent = await page.evaluate(() => {
        const engine = window.terrainUiEngine, unit = engine.activeUnit;
        const support = engine.gridToScreen(unit.gridX, unit.gridY, true, unit.surfaceId);
        const groundAtSameXY = engine.getPerspectivePoint(unit.gridX + 0.5, unit.gridY + 0.5);
        const rendered = window.terrainUiCloudDraws.filter(draw => draw.surfaceId === unit.surfaceId && !draw.moving).at(-1);
        return { surfaceId: unit.surfaceId, gridZ: unit.gridZ, support, groundAtSameXY,
          pivot: { x: unit.x, y: unit.y }, rendered, actualRoute: engine.verticalTerrain.lastMove,
          animationSamples: window.terrainUiCloudDraws.filter(draw => draw.moving && draw.surfaceId === unit.surfaceId)
            .map(draw => ({ renderZ: draw.renderZ, pivotY: draw.pivot.y, projectedFeetY: draw.projectedFeetY })),
          canvasFloatPrecisionTolerancePx: 0.001 };
      });
      assert.ok(ascent.gridZ > ascending.start.z, 'Real UI confirmation must ascend to a higher terrain surface');
      assert.deepEqual(ascent.actualRoute.path, ascending.path);
      assert.equal(ascent.actualRoute.cost, ascending.cost);
      assert.ok(ascent.animationSamples.length > 0, 'The real route must render intermediate movement frames');
      assert.ok(ascent.animationSamples.some(sample => sample.renderZ > ascending.start.z && sample.renderZ < ascent.gridZ), 'The real climb must render intermediate elevation');
      assert.ok(ascent.groundAtSameXY.y > ascent.support.y, 'The destination must project above ground at the same XY');
      assert.ok(Math.abs(ascent.pivot.x - ascent.support.x) < 1e-8 && Math.abs(ascent.pivot.y - ascent.support.y) < 1e-8);
      // Canvas exposes its transform with float precision: compare subpixel
      // feet to 1/1000px, rather than demanding exact JavaScript doubles.
      assert.ok(Math.abs(ascent.rendered.projectedFeetY - ascent.support.y) < ascent.canvasFloatPrecisionTolerancePx, 'The actual sprite feet must meet the elevated support: ' + JSON.stringify(ascent));
      rows.push({ check: 'real-UI-ascent-through-stairs-with-projected-sprite-feet', approach: movement, turnsPassed, ascending, ascent, passed: true });
      await capture('nexus-skybridge-ascent', canvas);
      await cut.selectOption('all');
      await capture('nexus-skybridge-full-height-after-ascent');

      const beforeCamera = await page.evaluate(actorSnapshot);
      await panel.getByRole('button', { name: 'Zoomer le plateau', exact: true }).click();
      const dragRect = await canvas.boundingBox();
      const cameraBefore = await page.evaluate(() => window.terrainUiEngine.getCameraState());
      await page.mouse.move(dragRect.x + dragRect.width * 0.6, dragRect.y + dragRect.height * 0.6);
      await page.mouse.down();
      await page.mouse.move(dragRect.x + dragRect.width * 0.6 + 35, dragRect.y + dragRect.height * 0.6 + 22, { steps: 5 });
      await page.mouse.up();
      const cameraAfter = await page.evaluate(() => window.terrainUiEngine.getCameraState());
      assert.notDeepEqual(cameraAfter, cameraBefore, 'The real drag must change the camera');
      assert.equal(await page.evaluate(actorSnapshot), beforeCamera, 'Panning must never move a unit or spend AP');
      const zoomedPick = await page.evaluate(() => {
        const engine = window.terrainUiEngine, previous = engine.getTerrainViewState().selectedSurface?.id;
        for (const surface of engine.terrain.surfaces) {
          if (surface.id === previous || !engine.isTerrainSurfaceVisible(surface.id)) continue;
          const point = engine.gridToScreen(surface.x, surface.y, true, surface.id);
          if (point.x < 15 || point.y < 15 || point.x > 1025 || point.y > 445) continue;
          if (engine.screenToGrid(point.x, point.y)?.surfaceId !== surface.id) continue;
          engine.selectTerrainSurface(previous);
          return { id: surface.id, point };
        }
        throw new Error('No pickable second surface after the real camera drag');
      });
      const zoomedRect = await canvas.boundingBox();
      await canvas.click({ position: { x: zoomedPick.point.x * zoomedRect.width / 1040, y: zoomedPick.point.y * zoomedRect.height / 460 } });
      await page.waitForFunction(id => window.terrainUiEngine.getTerrainViewState().selectedSurface?.id === id, zoomedPick.id);
      assert.equal(await page.evaluate(actorSnapshot), beforeCamera);
      rows.push({ check: 'real-drag-and-zoom-preserve-surface-picking-and-world-state', cameraBefore, cameraAfter, picked: zoomedPick.id, passed: true });

      await page.setViewportSize({ width: 375, height: 812 });
      const mobile = await panel.evaluate(element => ({ left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, width: innerWidth, controls: [...element.querySelectorAll('button,select')].map(control => ({ width: control.getBoundingClientRect().width, height: control.getBoundingClientRect().height })) }));
      assert.ok(mobile.left >= 0 && mobile.right <= mobile.width + 1, 'Terrain controls overflow the mobile viewport');
      assert.ok(mobile.controls.every(control => control.height >= 39 && control.width > 0));
      await capture('nexus-skybridge-mobile', panel);
      rows.push({ check: 'mobile375-visible-touch-controls', ...mobile, passed: true });
      await page.setViewportSize({ width: 1440, height: 1100 });
    }
    await capture(fieldId + '-battle');
  }
  assert.deepEqual(pageErrors, []);
} catch (error) {
  failure = error.stack || String(error);
  try { await capture('failure'); } catch { /* retain the original failure */ }
} finally {
  await browser.close();
  browserClosedAt = new Date().toISOString();
}
const sourceHashesAfter = snapshot();
const stable = JSON.stringify(sourceHashesBefore) === JSON.stringify(sourceHashesAfter);
const harnessStableDuringRun = harnessSha256AtStart === sha(fs.readFileSync(harnessPath));
if (!preliminary && !stable) failure ||= 'Production inputs changed during the final UI browser run';
if (!preliminary && !harnessStableDuringRun) failure ||= 'UI browser harness changed during the final verification';
const report = {
  passed: !failure, preliminary, startedAt, browserClosedAt, finishedAt: new Date().toISOString(),
  allBrowserWindowsClosed: true, harness: path.relative(root, harnessPath), harnessSha256: harnessSha256AtStart,
  harnessStableDuringRun,
  actualCustomBattleLaunches: rows.filter(row => row.check === 'real-custom-map-launch-and-view-only-cuts').length,
  sourceHashesBefore, sourceHashesAfter, productionInputsStableDuringRun: stable,
  pageErrors, rows, artifacts, failure
};
fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed: report.passed, preliminary, actualCustomBattleLaunches: report.actualCustomBattleLaunches, checks: rows.length, stable, output, failure }));
process.exitCode = report.passed ? 0 : 1;
