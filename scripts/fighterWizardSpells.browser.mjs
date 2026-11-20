import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = process.env.FIGHTER_WIZARD_PROOF_DIR || `/tmp/mvb-fighter-wizards-${Date.now()}`;
const fixture = 'scripts/fixtures/fighter-p0-projectiles.html';
const inputs = [fixture, 'scripts/fixtures/fighterP0ProjectilesHarness.jsx', 'src/components/FighterMode.jsx',
  'src/game/engineFighter.js', 'src/game/combat/historicalIconicP0FighterActions.js', 'src/game/canonP0ParticleRenderer.js',
  'DLC/HarryPotter/data/canonP0SourceKits.js'];
const hashes = () => Promise.all(inputs.map(async file => [file, createHash('sha256')
  .update(await readFile(path.join(root, file))).digest('hex')]));
const protectedRoutes = ['/sprites/generated/heroes/harry-potter/harry.png',
  '/sprites/generated/heroes/harry-potter/hermione.png', '/sprites/generated/heroes/harry-potter/harry-potter.png',
  '/sprites/generated/heroes/harry-potter/hermione-granger.png'];
const cases = [
  { id: 'harry', side: 'player', key: 'f', name: 'Expelliarmus', color: '#ed6456', hitstun: 0.24 },
  { id: 'hermione', side: 'cpu', key: 'p', name: 'Stupefy', color: '#e35c5c', hitstun: 0.62 }
];

await mkdir(output, { recursive: true });
const before = await hashes();
const require = createRequire(import.meta.url);
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
process.env.MULTIVERSE_TEST_SERVER = '1';
const server = await createServer({ root, cacheDir: path.join(output, 'vite-cache'), logLevel: 'silent',
  server: { host: '127.0.0.1', port: 0 }, optimizeDeps: { entries: [fixture] } });
const results = [];
let browser;
try {
  await server.listen();
  const url = new URL(fixture, server.resolvedUrls.local[0]);
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--disk-cache-size=1'] });
  for (const scenario of cases) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(15000);
    const errors = [], badRoutes = [], missingUrls = new Set();
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
      if (message.type() === 'error' && message.text().startsWith('Fighter render loop failed')) errors.push(message.text());
    });
    page.on('response', response => {
      if (response.status() === 404) missingUrls.add(new URL(response.url()).pathname);
    });
    await page.route('**/*', route => {
      const source = new URL(route.request().url());
      if (protectedRoutes.includes(source.pathname)) badRoutes.push(source.pathname);
      return source.origin === url.origin ? route.continue() : route.abort();
    });
    try {
      url.search = new URLSearchParams({ actor: scenario.id, side: scenario.side });
      await page.goto(url.toString(), { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => window.__fighterP0Projectiles?.engine?.paused);
      await page.locator('#qa-prepare').click();
      const initial = await page.evaluate(() => window.__fighterP0Projectiles.initial);
      assert.equal(initial.gap, 270);
      await page.locator('#qa-pause').click();
      await page.locator('canvas[data-fighter-phase="running"]').waitFor();
      await page.keyboard.press(scenario.key);
      await page.waitForFunction(() => window.__fighterP0Projectiles.paints.some(paint => paint.travelFromMuzzle >= 36));
      await page.locator('#qa-pause').click();
      await page.waitForFunction(() => window.__fighterP0Projectiles.engine.paused);
      const flight = await page.evaluate(() => window.__fighterP0Projectiles.snapshot());
      assert.equal(flight.spawns.length, 1);
      const spawn = flight.spawns[0];
      assert.equal(spawn.sourceHeroId, scenario.id);
      assert.equal(spawn.side, scenario.side);
      assert.equal(spawn.name, scenario.name);
      assert.equal(spawn.delivery, 'projectile');
      assert.equal(spawn.kind, 'spell_bolt');
      assert.equal(spawn.maxRange, 300);
      assert.equal(spawn.vx, scenario.side === 'player' ? 520 : -520);
      assert.equal(flight.projectiles.length, 1);
      assert.deepEqual(flight.hits, []);
      assert.deepEqual(flight.hp, initial.hp);
      assert.ok(flight.paints.every(paint => paint.color === scenario.color && paint.kind === 'spell_bolt'
        && paint.x === paint.projectileX && paint.y === paint.projectileY && paint.radiusX > paint.radiusY));
      const capture = `${scenario.id}-flight.jpg`;
      await page.screenshot({ path: path.join(output, capture), type: 'jpeg', quality: 80 });
      await page.locator('#qa-pause').click();
      await page.waitForFunction(() => window.__fighterP0Projectiles.hits.length === 1);
      const final = await page.evaluate(() => window.__fighterP0Projectiles.snapshot());
      assert.equal(final.projectiles.length, 0);
      assert.equal(final.hits[0].owner, initial.actor);
      assert.equal(final.hits[0].target, initial.target);
      assert.equal(final.hits[0].hitstun, scenario.hitstun);
      assert.equal(final.hp[initial.target], initial.hp[initial.target] - final.hits[0].damage);
      assert.deepEqual(Object.keys(initial.hp).filter(id => initial.hp[id] !== final.hp[id]), [initial.target]);
      assert.deepEqual(final.keyEvents, [{ key: scenario.key, code: `Key${scenario.key.toUpperCase()}`, repeat: false, trusted: true }]);
      assert.equal(final.particleTypes.includes('laser_line'), false);
      assert.equal(final.storage, initial.storage);
      assert.deepEqual(errors, []);
      assert.deepEqual(badRoutes, []);
      results.push({ ...scenario, spawn, capture, flightPaints: flight.paints.length,
        maximumRenderedTravel: Math.max(...final.paints.map(paint => paint.travelFromMuzzle)),
        hit: final.hits[0], errors, badRoutes, missingUrls: [...missingUrls], passed: true });
      console.log(`${scenario.id}/${scenario.side}: ${spawn.name}, ${final.hits[0].damage} damage, ${final.hits[0].hitstun}s hitstun`);
    } finally {
      await context.close();
    }
  }
  assert.deepEqual(await hashes(), before, 'Scoped source and fixture files changed while Chromium was running');
  await writeFile(path.join(output, 'browser.json'), `${JSON.stringify({ passed: true, cases: results,
    node: process.version, chromium: browser.version(), inputSha256: Object.fromEntries(before),
    source1to1Verified: false }, null, 2)}\n`);
} finally {
  await browser?.close();
  await server.close();
}
