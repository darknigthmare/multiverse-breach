import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';
import react from '@vitejs/plugin-react';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const output = fileURLToPath(new URL('./', import.meta.url));
const require = createRequire(import.meta.url);
const playwright = process.env.PLAYWRIGHT_MODULE_PATH || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright';
const { chromium } = require(playwright);
const fixture = '/docs/assets/p0-p1-p2-continuation-12-2026-11-20/iconic/harness.jsx';
const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><div id="root"></div><script type="module" src="${fixture}"></script></html>`;
const vite = await createServer({ root, configFile: false, plugins: [react(), {
  name: 'iconic-duel-fixture', configureServer(server) {
    server.middlewares.use(async (request, response, next) => {
      if (request.url?.split('?')[0] !== '/') return next();
      response.setHeader('Content-Type', 'text/html');
      response.end(await server.transformIndexHtml(request.url, html));
    });
  }
}], cacheDir: path.join(tmpdir(), 'mvb-pass12-iconic-vite-cache'),
define: { __MULTIVERSE_BUILD__: '{}' },
optimizeDeps: { entries: [fileURLToPath(new URL('harness.jsx', import.meta.url))] },
server: { host: '127.0.0.1', port: 0, watch: null, hmr: false }, logLevel: 'error' });
await vite.listen();
const cases = [];
let browser;
const plans = [
  { scenario: 'rounds', width: 1280, height: 900, reducedMotion: 'no-preference', gap: 195, rounds: 2, name: 'Camera Flash Distraction' },
  { scenario: 'static', width: 1280, height: 900, reducedMotion: 'reduce', gap: 64, rounds: 2, name: 'Pirate Sword Cut' },
  { scenario: 'stitch', width: 390, height: 844, reducedMotion: 'reduce', gap: 64, rounds: 1, name: 'Alien Strength Pounce' }
];
const sheets = {
  'lilo-pelekai.png': { 0: [2, 3], 1: [0, 3] },
  'jack-sparrow-potc.png': { 0: [2, 3], 1: [0, 1], 3: [1, 3] },
  'roger-rabbit.png': { 0: [1, 3], 1: [0, 1], 3: [1] }
};
const describeRows = rows => {
  const result = {};
  for (const { phase, route, source, position, reducedMotion, facing } of rows) {
    const basename = path.basename(route);
    const [sx, sy, width, height] = source;
    const row = Math.floor(sy / 256), column = sx / 256;
    const trimmed = ['jack-sparrow-potc.png', 'roger-rabbit.png'].includes(basename) && row === 1;
    assert.equal(sx, column * 256);
    assert.ok(sheets[basename][row]?.includes(column), `${basename} (${row},${column})`);
    assert.deepEqual([sy, width, height], [row * 256 + (trimmed ? 20 : 0), 256, trimmed ? 236 : 256]);
    const byPhase = result[phase] ||= {};
    const entry = byPhase[basename] ||= { count: 0, cells: new Set(), positions: new Set(), facings: new Set(), reducedMotion };
    entry.count++;
    entry.cells.add(`${row}:${column}`);
    entry.positions.add(position.map(value => Math.round(value)).join(':'));
    entry.facings.add(facing);
  }
  return Object.fromEntries(Object.entries(result).map(([phase, members]) => [phase, Object.fromEntries(
    Object.entries(members).map(([member, entry]) => [member, { ...entry, cells: [...entry.cells],
      distinctPositions: entry.positions.size, facings: [...entry.facings], positions: undefined }]))]));
};

try {
  browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || '/usr/bin/chromium',
    headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disk-cache-size=1'] });
  for (const plan of plans.filter(item => !process.env.ICONIC_SCENARIO || item.scenario === process.env.ICONIC_SCENARIO)) {
    const context = await browser.newContext({ viewport: { width: plan.width, height: plan.height }, hasTouch: plan.width < 500,
      reducedMotion: plan.reducedMotion });
    const page = await context.newPage();
    const errors = [], failures = [], responses = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => { if (message.type() === 'error' && message.text().startsWith('Fighter render loop failed')) errors.push(message.text()); });
    page.on('response', response => {
      const route = new URL(response.url()).pathname;
      if (route.endsWith('.png')) responses.push(route);
      if (response.status() >= 400) failures.push(route);
    });
    try {
      await page.goto(new URL(`/?scenario=${plan.scenario}`, vite.resolvedUrls.local[0]).href, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => window.__iconicDuel?.engine && window.__iconicDuel.draws.length > 2, {}, { timeout: 30000 });
      const canvas = page.locator('canvas[data-fighter-phase]');
      const capture = plan.scenario === 'rounds' ? 'duel-manche-un.jpg' : null;
      for (let round = 1; round <= plan.rounds; round++) {
        await page.waitForFunction(expected => {
          const engine = window.__iconicDuel.engine;
          return engine.roundNumber === expected && !engine.countdown && !engine.getCurrentPresentation();
        }, round, { timeout: 18000 });
        await page.locator('canvas[data-fighter-phase="running"]').waitFor({ timeout: 18000 });
        await page.evaluate(({ gap, targetHp }) => window.__iconicDuel.prepare(gap, targetHp), {
          gap: plan.gap, targetHp: plan.scenario === 'stitch' ? null : 1
        });
        if (plan.scenario === 'stitch') await page.getByTitle('P2 heavy attack [M]', { exact: true }).tap();
        else await page.keyboard.press('f');
        await page.waitForFunction(round => window.__iconicDuel.impacts.length === round, round, { timeout: 7000 });
        if (capture && round === 1) {
          await page.locator('canvas[data-fighter-phase="roundResult"]').waitFor();
          await page.getByText('Lilo regains her confidence', { exact: true }).waitFor();
          await page.getByText('Roger straightens up', { exact: true }).waitFor();
          await canvas.screenshot({ path: path.join(output, capture), type: 'jpeg', quality: 82 });
        }
      }
      if (plan.scenario !== 'stitch') await page.waitForFunction(() => window.__iconicDuel.completions.length === 1, {}, { timeout: 18000 });
      const result = await page.evaluate(() => {
        const audit = window.__iconicDuel;
        return { phases: [...audit.phases], draws: audit.draws, inputs: audit.inputs, impacts: audit.impacts,
          shutter: audit.shutter, pendingArtDraws: audit.pendingArtDraws, completionCount: audit.completions.length, roundsWon: audit.engine.roundWins,
          stitchIllustration: audit.engine.getActive('cpu').id === 'stitch_626' ? audit.engine.getActive('cpu').incarnation : null };
      });
      const observed = describeRows(result.draws);
      const names = result.impacts.map(impact => impact.name);
      assert.deepEqual(names, Array(plan.rounds).fill(plan.name));
      assert.deepEqual(errors, []);
      assert.equal(failures.some(route => Object.hasOwn(sheets, path.basename(route))), false);
      if (plan.scenario === 'stitch') {
        assert.deepEqual(result.inputs, [{ kind: 'touch', trusted: true, button: 'P2 heavy attack [M]' }]);
        assert.equal(result.impacts[0].range, 70);
        assert.equal(result.impacts[0].delivery, 'melee');
        assert.ok(result.pendingArtDraws > 0);
        assert.equal(responses.some(route => route.includes('stitch-626.png')), false);
      } else {
        assert.deepEqual(result.phases, ['intro', 'roundResult', 'fatality', 'victory', 'outro']);
        assert.deepEqual(result.roundsWon, { player: 2, cpu: 0 });
        assert.deepEqual(result.inputs, Array(2).fill({ kind: 'key', trusted: true, code: 'KeyF' }));
        assert.ok(Object.keys(observed.roundResult).length === 2);
        if (plan.scenario === 'rounds') {
          assert.ok(result.shutter.length > 0 && result.shutter.every(p => p >= .45 && p <= .56));
          assert.ok(observed.intro['lilo-pelekai.png'].distinctPositions > 1);
          assert.ok(observed.outro['lilo-pelekai.png'].facings.includes(-1));
        } else {
          assert.equal(result.shutter.length, 0);
          for (const members of Object.values(observed)) for (const entry of Object.values(members)) {
            assert.equal(entry.reducedMotion, true);
            assert.equal(entry.cells.length, 1);
            assert.equal(entry.distinctPositions, 1);
          }
        }
      }
      cases.push({ ...plan, ...result, draws: undefined, observed, capture, expectedSpriteFailures: [], unrelatedFailures: [...new Set(failures)],
        pageErrors: errors });
      console.log(`${plan.scenario}: ${result.impacts.length} impacts, ${result.draws.length} reviewed Canvas crops`);
      await writeFile(path.join(tmpdir(), `mvb-pass12-iconic-${plan.scenario}.json`),
        JSON.stringify({ chromium: browser.version(), cases: [cases.at(-1)] }, null, 2) + '\n');
    } catch (error) {
      console.error(plan.scenario, error.message, await page.evaluate(() => {
        const audit = window.__iconicDuel;
        return { phase: audit?.engine?.getSnapshot().phase, round: audit?.engine?.roundNumber,
          input: audit?.inputs, command: audit?.lastCommand, impacts: audit?.impacts };
      }).catch(() => null));
      throw error;
    } finally { await context.close(); }
  }
  await writeFile(path.join(output, 'browser.json'), JSON.stringify({ chromium: browser.version(), cases }, null, 2) + '\n');
} finally { await browser?.close(); await vite.close(); }
