import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const root = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/gamedev-display');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: process.env.PLAYWRIGHT_CHROMIUM_ARGS ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS) : []
});
const results = [];
const url = policy => `https://multiverse.test/scripts/fixtures/gamedev-gamepad.html?policy=${policy}`;

async function exercise(page, expectedNative) {
  await page.waitForFunction(() => Boolean(window.__gamedevGamepads));
  const native = await page.evaluate(() => window.__gamedevGamepads.nativeProbe());
  for (const [key, value] of Object.entries(expectedNative)) assert.equal(native[key], value, `Native API: ${JSON.stringify(native)}`);
  await page.keyboard.down('q'); await page.keyboard.down('ArrowRight');
  await page.locator('#touch-player').click(); await page.locator('#touch-cpu').click();
  for (let poll = 0; poll < 3; poll++) {
    const state = await page.evaluate(() => window.__gamedevGamepads.sample());
    assert.equal(state.readError, null, `GameCanvas reader failed: ${JSON.stringify(state.readError)}`);
    assert.equal(state.inputs.player.horizontal, -1);
    assert.equal(state.inputs.player.actions.Shield, true);
    assert.equal(state.inputs.cpu.horizontal, 1);
    assert.equal(state.inputs.cpu.actions.ChargedAttack, true);
  }
  await page.keyboard.up('q'); await page.keyboard.up('ArrowRight');
  await page.locator('#touch-player').click(); await page.locator('#touch-cpu').click();
  const released = await page.evaluate(() => window.__gamedevGamepads.sample());
  assert.equal(released.readError, null);
  for (const side of ['player', 'cpu']) assert.equal(Object.values(released.inputs[side].actions).some(Boolean), false);
  return { native, pollsWithBothPlayers: 3, sourcesReleased: true };
}

async function check(name, { policy = 'allowed', missing = false, recover = false } = {}) {
  const context = await browser.newContext();
  const result = { name, passed: false, pageErrors: [] };
  results.push(result);
  try {
    if (missing) {
      // Controlled absence, separate from the real Permissions Policy refusal.
      await context.addInitScript(() => Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: undefined }));
    }
    await context.route('**/*', async route => {
      const request = new URL(route.request().url());
      if (request.origin !== 'https://multiverse.test') { await route.abort(); return; }
      const path = resolve(root, '.' + request.pathname), relativePath = relative(root, path);
      if (relativePath === '..' || relativePath.startsWith('..' + sep)) {
        await route.fulfill({ status: 403, body: 'Outside fixture' }); return;
      }
      try {
        await route.fulfill({ body: await readFile(path),
          contentType: { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(path)] || 'application/octet-stream',
          headers: request.searchParams.get('policy') === 'denied' ? { 'Permissions-Policy': 'gamepad=()' } : {}
        });
      } catch { await route.fulfill({ status: 404, body: 'Fixture resource missing' }); }
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', error => result.pageErrors.push(error.message));
    await page.goto(url(policy));
    assert.equal(await page.evaluate(() => isSecureContext), true);
    result.initial = await exercise(page, missing ? { available: false }
      : policy === 'denied' ? { available: true, ok: false, error: 'SecurityError' } : { available: true, ok: true });
    if (recover) {
      // A document's policy is fixed. Navigate to a newly permitted document
      // in the same context to verify commands remain usable on returning to
      // an allowed policy. The same-instance retry is covered by the unit test.
      await page.goto(url('allowed'));
      result.recovered = await exercise(page, { available: true, ok: true });
    }
    assert.deepEqual(result.pageErrors, []);
    result.passed = true;
  } catch (error) { result.failure = error.message; }
  finally { await context.close(); }
}

try {
  await check('available native API preserves keyboard and prepared touch inputs');
  await check('native Permissions Policy refusal preserves both players', { policy: 'denied' });
  await check('controlled missing API preserves both players', { missing: true });
  await check('a permitted document remains usable after a denied document', { policy: 'denied', recover: true });
  console.log(JSON.stringify({
    browser: browser.version(), results,
    native: 'Secure browser context, getGamepads, Permissions-Policy SecurityError and keyboard events',
    controlled: 'Missing API case and held touch states in the real scene registry; React refs for extracted GameCanvas reader',
    scope: 'Actual reader and mapping/scene-input helpers; no physical gamepad or full combat simulation'
  }, null, 2));
  assert.equal(results.filter(result => !result.passed).length, 0, 'Optional gamepad access browser regression');
} finally { await browser.close(); }
