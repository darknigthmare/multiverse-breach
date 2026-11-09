// Four actual FighterMode keyboard routes; prepared geometry, no gameplay mocks.
// Invoke only after the integration owner releases browser execution/memory.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

assert.ok(process.argv.includes('--run-current-integration'), 'Explicit --run-current-integration is required; preparing or syntax checking must not launch Chromium');
const root = fileURLToPath(new URL('../', import.meta.url));
const base = process.env.FIGHTER_P0_UI_URL || 'http://127.0.0.1:5188';
assert.ok(['127.0.0.1', 'localhost'].includes(new URL(base).hostname), 'Use the isolated local fixture');
const startedAt = new Date().toISOString();
const output = process.env.FIGHTER_P0_PROOF_DIR || `/tmp/merged-integration-fighter-p0-projectiles/${startedAt.replace(/[^0-9]/g, '')}`;
assert.equal(fs.existsSync(path.join(output, 'result.json')), false, 'Preserve previous executions; select a fresh output directory');
fs.mkdirSync(output, { recursive: true });
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sourceSnapshot = () => {
  const files = {};
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (/\.(?:jsx?|json)$/.test(entry.name)) files[path.relative(root, file)] = sha(fs.readFileSync(file));
    }
  };
  visit(path.join(root, 'src'));
  return files;
};
const sourceHashesBefore = sourceSnapshot();
const harnessFiles = [
  'scripts/fighterP0Projectiles.browser.mjs',
  'scripts/fixtures/fighterP0ProjectilesHarness.jsx',
  'scripts/fixtures/fighter-p0-projectiles.html',
  'scripts/fixtures/combatHarness.css'
];
const harnessHashesBefore = Object.fromEntries(harnessFiles.map(file => [file, sha(fs.readFileSync(path.join(root, file)))]));
const artifacts = [];
for (const file of harnessFiles) {
  const target = path.join(output, path.basename(file));
  fs.copyFileSync(path.join(root, file), target);
  artifacts.push({ path: target, sha256: sha(fs.readFileSync(target)), bytes: fs.statSync(target).size });
}
const readRevision = ref => {
  try { return execFileSync('git', ['rev-parse', '--verify', ref], { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
  catch { return null; }
};
const provenance = {
  gitHead: readRevision('HEAD'), gitMergeHead: readRevision('MERGE_HEAD'), originMaster: readRevision('origin/master'),
  nodeVersion: process.version,
  packageSha256: sha(fs.readFileSync(path.join(root, 'package.json'))),
  packageLockSha256: sha(fs.readFileSync(path.join(root, 'package-lock.json')))
};
const expected = [
  { heroId: 'raven_tt', kind: 'shadow_wisp', color: '#383044' },
  { heroId: 'starfire_tt', kind: 'starbolt', color: '#63ef72' }
];
const cases = [], pageErrors = [];
let browser, browserVersion = null, allBrowserWindowsClosed = false, failure = null;
const capture = async (page, name) => {
  const file = path.join(output, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  artifacts.push({ path: file, sha256: sha(fs.readFileSync(file)), bytes: fs.statSync(file).size });
};
try {
  const require = createRequire(import.meta.url);
  const { chromium } = require(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium', headless: true, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  browserVersion = browser.version();
  for (const profile of expected) for (const side of ['player', 'cpu']) {
    const name = `${profile.heroId}-${side}`;
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [];
    page.on('pageerror', error => { errors.push(error.message); pageErrors.push({ case: name, message: error.message }); });
    page.on('console', message => {
      if (message.type() === 'error' && message.text().startsWith('Fighter render loop failed')) errors.push(message.text());
    });
    await page.route('**/*', route => ['127.0.0.1', 'localhost'].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
    const result = { ...profile, side, passed: false, source1to1Verified: false, nativeArtClaimed: false };
    try {
      await page.goto(`${base}/scripts/fixtures/fighter-p0-projectiles.html?actor=${profile.heroId}&side=${side}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await page.waitForFunction(() => window.__fighterP0Projectiles?.engine?.paused && !window.__fighterP0Projectiles.engine.disposed);
      await page.locator('#qa-prepare').click();
      const initial = await page.evaluate(() => window.__fighterP0Projectiles.initial);
      assert.equal(initial.gap, 540);
      await page.locator('#qa-pause').click();
      await page.waitForFunction(() => !window.__fighterP0Projectiles.engine.paused);
      await page.locator('canvas[data-fighter-phase="running"]').waitFor();
      const key = side === 'player' ? 'f' : 'p';
      await page.keyboard.press(key);
      await page.waitForFunction(() => window.__fighterP0Projectiles.paints.some(paint => paint.travelFromMuzzle >= 180));
      await page.locator('#qa-pause').click();
      await page.waitForFunction(() => window.__fighterP0Projectiles.engine.paused);
      const flight = await page.evaluate(() => window.__fighterP0Projectiles.snapshot());
      assert.equal(flight.spawns.length, 1);
      const spawn = flight.spawns[0];
      assert.equal(spawn.sourceHeroId, profile.heroId);
      assert.equal(spawn.side, side);
      assert.equal(spawn.kind, profile.kind);
      assert.equal(spawn.maxRange, 640);
      assert.equal(Math.abs(spawn.vx), 520);
      assert.equal(spawn.canonSourceAbility, true);
      assert.equal(spawn.authoredAbility, false);
      assert.equal(spawn.identityAuthored, false);
      assert.equal(spawn.delivery, 'projectile');
      assert.equal(spawn.shape, 'single');
      assert.equal(spawn.maxTargets, 1);
      assert.equal(flight.projectiles.length, 1, 'The screenshot must contain a live, moving projectile paused through the real UI');
      assert.equal(flight.hits.length, 0);
      assert.deepEqual(flight.hp, initial.hp, 'Flight before contact cannot damage any actor');
      assert.ok(flight.paints.length > 1);
      assert.ok(flight.paints.every(paint => paint.kind === profile.kind && paint.color.toLowerCase() === profile.color));
      assert.ok(flight.paints.every(paint => Math.abs(paint.x - paint.projectileX) < .001 && Math.abs(paint.y - paint.projectileY) < .001));
      assert.ok(flight.paints.every(paint => Math.abs(paint.radiusX - 9.1) < .001 && Math.abs(paint.radiusY - 6.5) < .001), 'Actual typed procedural ellipses must follow the projectile, rather than a generic laser');
      assert.equal(flight.particleTypes.includes('laser_line'), false);
      assert.deepEqual(flight.keyEvents, [{ key, code: side === 'player' ? 'KeyF' : 'KeyP', repeat: false, trusted: true }]);
      await page.waitForTimeout(150);
      assert.deepEqual(await page.evaluate(() => window.__fighterP0Projectiles.snapshot().projectiles), flight.projectiles, 'UI pause freezes physical projectile travel');
      await capture(page, `${name}-flight`);
      await page.locator('#qa-pause').click();
      await page.waitForFunction(() => {
        const audit = window.__fighterP0Projectiles;
        return audit.hits.length > 0 && audit.engine.projectiles.length === 0;
      });
      await page.waitForTimeout(200);
      await page.locator('#qa-pause').click();
      await page.waitForFunction(() => window.__fighterP0Projectiles.engine.paused);
      const final = await page.evaluate(() => window.__fighterP0Projectiles.snapshot());
      assert.equal(final.spawns.length, 1);
      assert.equal(final.hits.length, 1);
      assert.equal(final.hits[0].target, initial.target);
      assert.equal(final.hits[0].owner, initial.actor);
      assert.equal(final.hits[0].side, side);
      assert.equal(final.hits[0].canonSourceAbility, true);
      assert.equal(final.hp[initial.target], initial.hp[initial.target] - final.hits[0].damage);
      const changed = Object.keys(initial.hp).filter(id => final.hp[id] !== initial.hp[id]);
      assert.deepEqual(changed, [initial.target], 'Only the active victim can lose HP; both bench actors in the flight corridor remain untouched');
      assert.ok(Math.max(...final.paints.map(paint => paint.travelFromMuzzle)) >= 400, 'The rendered projectile must physically travel at least 400 logical pixels before impact');
      assert.equal(final.particleTypes.includes('laser_line'), false);
      assert.equal(final.liveEngines, 1);
      assert.equal(final.results.length, 0);
      assert.equal(final.exits.length, 0);
      assert.equal(final.storage, initial.storage);
      assert.deepEqual(errors, []);
      await capture(page, `${name}-impact`);
      Object.assign(result, { passed: true, input: key, initial, flight, final,
        maximumRenderedTravel: Math.max(...final.paints.map(paint => paint.travelFromMuzzle)) });
      console.log(JSON.stringify({ case: name, passed: true, travel: result.maximumRenderedTravel, damage: final.hits[0].damage }));
    } catch (error) {
      result.failure = error.stack || String(error);
      result.pageErrors = errors;
      try { await capture(page, `${name}-failure`); } catch { /* Preserve the original failure. */ }
      console.log(JSON.stringify({ case: name, passed: false, failure: result.failure }));
    } finally {
      cases.push(result);
      await context.close();
    }
  }
} catch (error) {
  failure = error.stack || String(error);
} finally {
  if (browser) { await browser.close(); allBrowserWindowsClosed = true; }
}
const sourceHashesAfter = sourceSnapshot();
const harnessHashesAfter = Object.fromEntries(harnessFiles.map(file => [file, sha(fs.readFileSync(path.join(root, file)))]));
const sourceStable = JSON.stringify(sourceHashesBefore) === JSON.stringify(sourceHashesAfter);
const harnessStable = JSON.stringify(harnessHashesBefore) === JSON.stringify(harnessHashesAfter);
const passed = !failure && cases.length === 4 && cases.every(result => result.passed)
  && sourceStable && harnessStable && pageErrors.length === 0 && allBrowserWindowsClosed;
const report = {
  passed, verificationKind: 'current-merged-integration', startedAt, finishedAt: new Date().toISOString(),
  provenance, browserVersion, finalProductionFreezeClaimed: false, source1to1Verified: false, nativeArtClaimed: false,
  fixturePolicy: 'Paused synthetic geometry: 540px active-opponent gap; inactive reserves at x480 within the flight corridor; no AI, campaign rewards or generation. Actual FighterMode keyboard controls, updates, collision and renderer are unchanged.',
  cases, pageErrors, failure, allBrowserWindowsClosed,
  sourceHashesBefore, sourceHashesAfter, productionInputsStableDuringRun: sourceStable,
  harnessHashesBefore, harnessHashesAfter, harnessStableDuringRun: harnessStable, artifacts
};
fs.writeFileSync(path.join(output, 'result.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ passed, cases: cases.length, sourceStable, harnessStable, output, failure }));
process.exitCode = passed ? 0 : 1;
