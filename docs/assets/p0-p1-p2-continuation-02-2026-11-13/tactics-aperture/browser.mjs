import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const folder = fileURLToPath(new URL('.', import.meta.url));
const output = path.join(folder, 'browser'); fs.mkdirSync(output, { recursive: true });
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const results = [];
try {
  for (const width of [1280, 390]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 } });
    const errors = [], failedRequests = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', r => { if (r.status() >= 400) failedRequests.push({ status: r.status(), url: r.url() }); });
    await page.goto('http://127.0.0.1:4199/scripts/fixtures/aperture-continuation.html', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__apertureAudit?.engine?.activeUnit);
    await page.locator('summary').filter({ hasText: 'TERRAIN' }).click();
    await page.screenshot({ path: path.join(output, `aperture-${width}-overview.png`) });
    const separation = await page.evaluate(() => {
      const terrain = document.querySelector('.combat-terrain-overlay').getBoundingClientRect();
      const dock = document.querySelector('.combat-hud-dock').getBoundingClientRect();
      const squad = document.querySelector('.combat-squad-strip').getBoundingClientRect();
      return { terrainBottom: terrain.bottom, dockTop: dock.top, squadTop: squad.top };
    });
    assert.ok(separation.terrainBottom <= separation.dockTop - 8, 'Terrain summary covers the live squad/action dock');
    await page.locator('canvas').focus();
    await page.keyboard.press('ArrowRight');
    const initial = await page.evaluate(() => {
      const e = window.__apertureAudit.engine, unit = e.heroes[0];
      const selected = e.getTerrainViewState().selectedSurface;
      const step = e.movementRange.find(s => s.surfaceId === selected?.id && s.surfaceId !== unit.surfaceId && s.cost > 0 && s.cost <= 2);
      if (!step) throw new Error('No legal initial movement');
      const original = e.handleSurfaceClick.bind(e); e.__reviewMoves = [];
      e.handleSurfaceClick = id => { const result = original(id); e.__reviewMoves.push({ id,
        handled: result?.handled, reason: result?.reason, type: result?.type,
        position: unit.surfaceId, phase: e.actionPhase, selected: e.getTerrainViewState().selectedSurface?.id }); return result; };
      return { field: e.battlefield.id, initial: unit.surfaceId, target: step.surfaceId, cost: step.cost };
    });
    assert.equal(initial.field, 'portal2_maintenance_shaft_tactics');
    await page.locator('summary').filter({ hasText: 'TERRAIN' }).click();
    await page.getByRole('button', { name: /ALLER \/ CIBLER CETTE CASE/ }).click();
    await page.waitForTimeout(500);
    console.log(JSON.stringify({ initial, observed: await page.evaluate(() => ({ beforeWait: __apertureAudit.engine.__reviewMoves,
      surface: __apertureAudit.engine.heroes[0].surfaceId, phase: __apertureAudit.engine.actionPhase,
      paused: __apertureAudit.engine.paused, motion: __apertureAudit.engine.heroes[0].terrainMotion })) }));
    await page.waitForFunction(id => window.__apertureAudit.engine.heroes[0].surfaceId === id
      && !window.__apertureAudit.engine.heroes[0].terrainMotion, initial.target);
    const moved = await page.evaluate(() => ({ id: __apertureAudit.engine.heroes[0].surfaceId, spent: __apertureAudit.engine.movementSpent }));
    assert.equal(moved.id, initial.target); assert.equal(moved.spent, initial.cost);
    await page.locator('#qa-pause').click();
    await page.waitForFunction(() => window.__apertureAudit.engine.paused === true);
    const frozen = await page.evaluate(() => JSON.stringify({ x: __apertureAudit.engine.heroes[0].x,
      y: __apertureAudit.engine.heroes[0].y, turn: __apertureAudit.engine.turnCount }));
    await page.waitForTimeout(180);
    assert.equal(await page.evaluate(() => JSON.stringify({ x: __apertureAudit.engine.heroes[0].x,
      y: __apertureAudit.engine.heroes[0].y, turn: __apertureAudit.engine.turnCount })), frozen);
    await page.locator('#qa-pause').click();
    await page.waitForFunction(() => window.__apertureAudit.engine.paused === false);
    // Controlled two-AP turn starts isolate geometry from opponent AI. Each
    // transition still uses the engine's actual path/range/motion/cost methods.
    const ascent = await page.evaluate(() => {
      const e = __apertureAudit.engine, unit = e.heroes[0], dest = `${e.battlefield.id}:bridge:8:8`;
      const visited = [unit.surfaceId], costs = [];
      for (let i = 0; i < 50 && unit.surfaceId !== dest; i++) {
        e.activeUnit = unit; e.activeUnitType = 'hero'; e.movementBudget = 2; e.movementSpent = 0;
        e.actionPhase = 'move'; e.selectedAction = null; e.selectedActionExplicit = false; e.calculateMovementRange();
        const route = e.getReachableCells(unit, Infinity).find(s => s.surfaceId === dest);
        if (!route?.path?.[1]) throw new Error('Missing route to upper marker');
        const next = e.movementRange.find(s => s.surfaceId === route.path[1]);
        if (!next) throw new Error('Transition exceeds a fresh two-AP turn');
        const result = e.handleSurfaceClick(next.surfaceId);
        if (!result.handled || e.movementSpent !== next.cost) throw new Error('AP/movement mismatch');
        for (let tick = 0; tick < 120 && unit.terrainMotion; tick++) e.update();
        if (unit.terrainMotion) throw new Error('Motion never completed');
        visited.push(unit.surfaceId); costs.push(next.cost);
      }
      return { dest, final: unit.surfaceId, z: unit.gridZ, visited, costs,
        markerCount: e.collectedArtifactKeys.size, disposed: e.disposed };
    });
    assert.equal(ascent.final, ascent.dest); assert.equal(ascent.z, 3);
    assert.ok(ascent.costs.includes(2)); assert.ok(ascent.visited.length > 5);
    await page.locator('summary').filter({ hasText: 'TERRAIN' }).click();
    await page.screenshot({ path: path.join(output, `aperture-${width}-upper.png`) });
    await page.locator('#qa-unmount').click();
    await page.waitForFunction(() => window.__apertureAudit.engine.disposed === true);
    assert.deepEqual(errors, []);
    results.push({ width, initial, moved, ascent, separation, pausePositionStable: true, disposed: true,
      pageErrors: errors, failedRequests, scope: 'Actual GameCanvas and move-confirm button; ascent uses controlled fresh two-AP turns, not a full normal-turn campaign.' });
    await page.close();
  }
  const page = await browser.newPage({ viewport: { width: 520, height: 280 } });
  const requests = []; page.on('request', r => requests.push(r.url()));
  await page.goto('http://127.0.0.1:4199/scripts/fixtures/aperture-continuation.html?view=batman', { waitUntil: 'networkidle' });
  const batman = await page.evaluate(() => ({ ...__apertureAudit.batman, drawCalls: __apertureAudit.drawCalls }));
  assert.equal(batman.ready, true); assert.deepEqual(batman.drawCalls, []);
  assert.ok(batman.texts.filter(t => t === 'ART PENDING').length >= 5);
  assert.equal(requests.some(url => /batman-tdk\.png/.test(url)), false);
  await page.locator('canvas').screenshot({ path: path.join(output, 'batman-pending-body-and-hud.png') });
  results.push({ view: 'batman', ...batman, wrongAtlasRequested: false }); await page.close();
  const screenshots = fs.readdirSync(output).filter(f => f.endsWith('.png')).map(name => {
    const bytes = fs.readFileSync(path.join(output, name));
    return { path: name, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
  });
  fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify({ status: 'passed', cases: results.length,
    results, screenshots, visual1to1Verified: false }, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'passed', cases: results.length, screenshots: screenshots.length,
    failedRequests: results.flatMap(r => r.failedRequests || []) }));
} catch (error) {
  fs.writeFileSync(path.join(output, 'failed.json'), JSON.stringify({ status: 'failed', error: String(error), results }, null, 2) + '\n');
  throw error;
} finally { await browser.close(); }
