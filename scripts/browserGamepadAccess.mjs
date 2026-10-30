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

async function check(name, { policy = 'allowed', missing = false, recover = false, controlled = false, scenario } = {}) {
  const context = await browser.newContext({ viewport: { width: 1000, height: 800 }, hasTouch: true });
  const result = { name, passed: false, pageErrors: [] };
  results.push(result);
  try {
    if (missing) {
      // Controlled absence, separate from the real Permissions Policy refusal.
      await context.addInitScript(() => Object.defineProperty(navigator, 'getGamepads', { configurable: true, value: undefined }));
    }
    if (controlled) {
      // Deliberately simulated device data, kept separate from the native
      // Permissions Policy cases. Real reader, dispatcher and runtime follow it.
      await context.addInitScript(() => {
        window.__controlledGamepadPlatform = { pads: [], mode: 'available' };
        Object.defineProperty(navigator, 'getGamepads', { configurable: true, value() {
          if (window.__controlledGamepadPlatform.mode === 'denied') throw new DOMException('Controlled transient API failure', 'SecurityError');
          return window.__controlledGamepadPlatform.pads;
        } });
      });
    }
    await context.addInitScript(() => {
      window.__gamepadControlEvents = [];
      for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'gotpointercapture', 'lostpointercapture']) {
        window.addEventListener(type, event => {
          if (event.target?.id === 'actual-touch-charge') window.__gamepadControlEvents.push({
            type, pointerId: event.pointerId, trusted: event.isTrusted
          });
        }, true);
      }
    });
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
    await page.waitForFunction(() => Boolean(window.__gamedevGamepads));
    if (scenario) {
      result.observations = await scenario(page, context);
      result.pointerEvents = await page.evaluate(() => window.__gamepadControlEvents);
    } else {
      result.initial = await exercise(page, missing ? { available: false }
        : policy === 'denied' ? { available: true, ok: false, error: 'SecurityError' } : { available: true, ok: true });
    }
    if (recover && !scenario) {
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

const actor = (state, side = 'player') => state.actors[side];
const charge = (buttons = [3], extra = {}) => ({ buttons, ...extra });
async function observe(page, frames = 0) {
  const state = await page.evaluate(count => count ? window.__gamedevGamepads.advance(count) : window.__gamedevGamepads.sample(), frames);
  assert.equal(state.readError, null, `Reader/dispatcher failed: ${JSON.stringify(state.readError)}`);
  return state;
}
async function platform(page, pads, mode = 'available') {
  await page.evaluate(({ pads, mode }) => {
    window.__controlledGamepadPlatform.mode = mode;
    window.__controlledGamepadPlatform.pads = pads.map((spec, index) => spec && ({
      id: spec.id || `controlled-pad-${index}`, index, connected: spec.connected !== false,
      axes: spec.axes || [0, 0],
      buttons: Array.from({ length: 18 }, (_, button) => ({
        pressed: (spec.buttons || []).includes(button), value: (spec.buttons || []).includes(button) ? 1 : 0
      }))
    }));
  }, { pads, mode });
  return observe(page);
}
function idleWithoutHit(state, side = 'player') {
  assert.equal(actor(state, side).charging, false, `${side} charge must be cancelled`);
  assert.equal(actor(state, side).action, null, `${side} cancellation must not commit an attack`);
  assert.equal(actor(state, side).hits, 0, `${side} cancellation must not reach the hit hook`);
}
async function startedCharge(page, pads = [charge()]) {
  await platform(page, pads);
  const state = await observe(page, 30);
  assert.equal(actor(state).charging, true);
  assert.ok(actor(state).chargeHoldSeconds > 0.45, 'The real runtime must accumulate a held charge');
  return state;
}
async function finishCharge(page, side = 'player') {
  let state = await observe(page);
  assert.equal(actor(state, side).action, 'charged', 'An intentional final release must commit the charge');
  state = await observe(page, 90);
  assert.equal(actor(state, side).charging, false);
  assert.equal(actor(state, side).hits, 1, 'One intentional release must reach the actual runtime hit hook once');
  assert.equal(actor(await observe(page, 30), side).hits, 1, 'Repeated polling must not add another hit');
  return actor(state, side);
}
async function nativeTouch(page, context) {
  const control = page.locator('#actual-touch-charge');
  await control.waitFor({ state: 'visible' });
  const box = await control.boundingBox();
  assert.ok(box);
  const cdp = await context.newCDPSession(page);
  const point = { x: box.x + box.width / 2, y: box.y + box.height / 2, id: 11 };
  return {
    down: () => cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [point] }),
    up: () => cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }),
    cancel: () => cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] })
  };
}
async function assertNativeEvent(page, type) {
  assert.equal(await page.evaluate(name => window.__gamepadControlEvents.some(event => event.type === name && event.trusted), type), true,
    `${type} must come from the native browser event path`);
}

try {
  await check('available native API preserves keyboard and prepared touch inputs');
  await check('native Permissions Policy refusal preserves both players', { policy: 'denied' });
  await check('controlled missing API preserves both players', { missing: true });
  await check('a permitted document remains usable after a denied document', { policy: 'denied', recover: true });
  await check('an intentional gamepad release commits one charged hit', { controlled: true, scenario: async page => {
    const held = await startedCharge(page);
    await platform(page, [charge([])]);
    return { held: actor(held), released: await finishCharge(page) };
  } });
  await check('losing pad zero cancels its charge and preserves pad one', { controlled: true, scenario: async page => {
    await startedCharge(page, [charge(), charge()]);
    let state = await platform(page, [null, charge()]);
    idleWithoutHit(state);
    assert.equal(actor(state, 'cpu').charging, true);
    assert.equal(state.inputs.cpu.actions.ChargedAttack, true);
    state = await observe(page, 30);
    idleWithoutHit(state);
    await platform(page, [null, charge([])]);
    return { player: actor(state), cpu: await finishCharge(page, 'cpu') };
  } });
  await check('a disconnected flag cancels even when stale pad buttons remain pressed', { controlled: true, scenario: async page => {
    await startedCharge(page);
    const disconnected = await platform(page, [charge([3], { connected: false })]);
    idleWithoutHit(disconnected);
    idleWithoutHit(await observe(page, 60));
    return { disconnected: actor(disconnected) };
  } });
  await check('replacing a pad in the same slot cancels and requires its neutral state', { controlled: true, scenario: async page => {
    await startedCharge(page);
    let state = await platform(page, [charge([3], { id: 'replacement' })]);
    idleWithoutHit(state);
    assert.equal(state.inputs.player.actions.ChargedAttack, false);
    await platform(page, [charge([], { id: 'replacement' })]);
    state = await platform(page, [charge([3], { id: 'replacement' })]);
    assert.equal(actor(state).charging, true);
    await observe(page, 30);
    await platform(page, [charge([], { id: 'replacement' })]);
    return { released: await finishCharge(page) };
  } });
  await check('a disconnect event cancels a same-ID reconnection between polls', { controlled: true, scenario: async page => {
    await startedCharge(page, [charge(), charge()]);
    // There is deliberately no absent-device poll: identical controller models
    // can reuse both id and index. The simulated platform event carries the loss.
    const trusted = await page.evaluate(() => {
      const event = new Event('gamepaddisconnected');
      Object.defineProperty(event, 'gamepad', { value: { index: 0 } });
      window.dispatchEvent(event);
      return event.isTrusted;
    });
    assert.equal(trusted, false, 'This case injects a device event, not a physical disconnect');
    const state = await observe(page);
    idleWithoutHit(state);
    assert.equal(actor(state, 'cpu').charging, true);
    assert.equal(state.inputs.player.actions.ChargedAttack, false);
    return { simulatedEventTrusted: trusted, player: actor(state), cpu: actor(state, 'cpu') };
  } });
  await check('API loss cancels charge and reconnection gates only the gamepad', { controlled: true, scenario: async page => {
    await startedCharge(page);
    let state = await platform(page, [charge()], 'denied');
    assert.equal(state.native.error, 'SecurityError');
    idleWithoutHit(state);
    idleWithoutHit(await observe(page, 30));
    state = await platform(page, [charge()]);
    assert.equal(state.inputs.player.actions.ChargedAttack, false);
    await page.keyboard.down('d');
    await page.evaluate(() => window.__gamedevGamepads.touch('player', 'shield', true));
    state = await observe(page);
    assert.equal(state.inputs.player.horizontal, 1, 'Keyboard must work while the pad waits for neutral');
    assert.equal(actor(state).guarding, true, 'A touch guard must work while the pad waits for neutral');
    const duringGate = actor(state);
    // Keyboard and touch remain held when this neutral pad sample rearms it.
    await platform(page, [charge([])]);
    await page.keyboard.up('d');
    await page.evaluate(() => window.__gamedevGamepads.touch('player', 'shield', false));
    state = await platform(page, [charge()]);
    assert.equal(actor(state).charging, true);
    await observe(page, 30);
    await platform(page, [charge([])]);
    return { duringGate, released: await finishCharge(page) };
  } });
  await check('keyboard ownership preserves a charge after the gamepad disconnects', { controlled: true, scenario: async page => {
    await startedCharge(page);
    await page.keyboard.down('k');
    let state = await platform(page, [null]);
    assert.equal(actor(state).charging, true);
    const before = actor(state).chargeHoldSeconds;
    state = await observe(page, 15);
    assert.ok(actor(state).chargeHoldSeconds > before, 'Surviving ownership must retain accumulated charge');
    assert.equal(actor(state).hits, 0);
    await page.keyboard.up('k');
    return { preservedChargeSeconds: actor(state).chargeHoldSeconds, released: await finishCharge(page) };
  } });
  await check('a native touch owner preserves charge after the gamepad disconnects', { controlled: true, scenario: async (page, context) => {
    await startedCharge(page);
    const touch = await nativeTouch(page, context);
    await touch.down();
    const state = await platform(page, [null]);
    assert.equal(actor(state).charging, true);
    assert.ok(actor(state).chargeHoldSeconds > 0.45);
    await touch.up();
    await assertNativeEvent(page, 'pointerup');
    return { preserved: actor(state), released: await finishCharge(page) };
  } });
  await check('normal release of the actual touch control commits one charged hit', { scenario: async (page, context) => {
    const touch = await nativeTouch(page, context);
    await touch.down();
    const held = await observe(page, 30);
    assert.equal(actor(held).charging, true);
    await touch.up();
    await assertNativeEvent(page, 'pointerdown');
    await assertNativeEvent(page, 'pointerup');
    return { held: actor(held), released: await finishCharge(page) };
  } });
  await check('native touch cancellation cancels charge without a hit', { scenario: async (page, context) => {
    const touch = await nativeTouch(page, context);
    await touch.down();
    assert.equal(actor(await observe(page, 30)).charging, true);
    await touch.cancel();
    await assertNativeEvent(page, 'pointercancel');
    const cancelled = await observe(page);
    idleWithoutHit(cancelled);
    idleWithoutHit(await observe(page, 90));
    return { cancelled: actor(cancelled) };
  } });
  await check('native lost pointer capture cancels charge without a hit', { scenario: async page => {
    const control = page.locator('#actual-touch-charge');
    await control.waitFor({ state: 'visible' });
    const box = await control.boundingBox(); assert.ok(box);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    assert.equal(actor(await observe(page, 30)).charging, true);
    const pointerId = await page.evaluate(() => window.__gamepadControlEvents.find(event => event.type === 'pointerdown').pointerId);
    assert.equal(await control.evaluate((element, id) => element.hasPointerCapture(id), pointerId), true);
    await control.evaluate((element, id) => element.releasePointerCapture(id), pointerId);
    await page.mouse.move(box.x + box.width / 2 + 1, box.y + box.height / 2);
    await assertNativeEvent(page, 'lostpointercapture');
    const cancelled = await observe(page);
    idleWithoutHit(cancelled);
    await page.mouse.up();
    idleWithoutHit(await observe(page, 90));
    return { cancelled: actor(cancelled) };
  } });
  await check('native touch cancellation preserves an independent keyboard charge', { scenario: async (page, context) => {
    const touch = await nativeTouch(page, context);
    await page.keyboard.down('k');
    await touch.down();
    const held = await observe(page, 30);
    assert.equal(actor(held).charging, true);
    await touch.cancel();
    await assertNativeEvent(page, 'pointercancel');
    const survived = await observe(page, 15);
    assert.equal(actor(survived).charging, true);
    assert.ok(actor(survived).chargeHoldSeconds > actor(held).chargeHoldSeconds);
    assert.equal(actor(survived).hits, 0);
    await page.keyboard.up('k');
    return { survived: actor(survived), released: await finishCharge(page) };
  } });
  await check('a fresh touch works immediately after cleanup while a held pad stays gated', { controlled: true, scenario: async (page, context) => {
    await startedCharge(page);
    const touch = await nativeTouch(page, context);
    // No reader sample may sit between the clear and the fresh pointer press.
    await page.evaluate(() => window.__gamedevGamepads.clear());
    await touch.down();
    const state = await observe(page, 30);
    assert.equal(actor(state).charging, true, 'A fresh touch must not wait for an all-device neutral sample');
    assert.ok(actor(state).chargeHoldSeconds > 0.45);
    await touch.up();
    return { fresh: actor(state), released: await finishCharge(page) };
  } });
  console.log(JSON.stringify({
    browser: browser.version(), results,
    native: 'Secure browser context, getGamepads, Permissions-Policy SecurityError, keyboard, pointerup, pointercancel and lostpointercapture events',
    controlled: 'Device snapshots/API failure in lifecycle cases; prepared touch states in API cases; React-shaped refs and two runtime actors; hit hook counts',
    scope: 'Actual GameCanvas reader/dispatcher/touch callback, HeldControlButton and extracted engine charge/shield methods with real melee runtime. Keyboard events feed a fixture registry bridge. No physical gamepad, full combat, damage resolution or visual review'
  }, null, 2));
  assert.equal(results.filter(result => !result.passed).length, 0, 'Optional gamepad access browser regression');
} finally { await browser.close(); }
