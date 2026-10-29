import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: process.env.PLAYWRIGHT_CHROMIUM_ARGS ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS) : []
});
const checked = [];
const errors = [];
try {
  const root = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/gamedev-display');
  const context = await browser.newContext({ viewport: { width: 900, height: 700 }, hasTouch: true });
  try {
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== 'http://multiverse.test') { await route.abort(); return; }
      const path = resolve(root, '.' + url.pathname);
      const fromRoot = relative(root, path);
      if (fromRoot === '..' || fromRoot.startsWith('..' + sep)) {
        await route.fulfill({ status: 403, body: 'Outside fixture' }); return;
      }
      try {
        await route.fulfill({ body: await readFile(path), contentType: {
          '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css'
        }[extname(path)] || 'application/octet-stream' });
      } catch { await route.fulfill({ status: 404, body: 'Fixture resource missing' }); }
    });
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      window.__heldInputEvents = [];
      for (const type of ['pointerdown', 'pointerup', 'pointercancel', 'gotpointercapture', 'lostpointercapture', 'keydown', 'keyup']) {
        window.addEventListener(type, event => {
          const button = event.target?.closest?.('[data-touch-slot], [data-testid="fighter-left"], [data-testid="scene-forward"]');
          window.__heldInputEvents.push({ type, pointerId: event.pointerId, trusted: event.isTrusted,
            code: event.code, repeat: event.repeat,
            slot: button?.dataset.touchSlot || button?.dataset.testid || null });
        }, true);
      }
    });
    await page.goto('http://multiverse.test/scripts/fixtures/gamedev-inputs.html');
    await page.getByTestId('input-state').waitFor();
    const cdp = await context.newCDPSession(page);
    const guard = page.locator('[data-touch-slot="shield"]');
    const charge = page.locator('[data-touch-slot="chargedAttack"]');
    const state = async expected => {
      await page.waitForFunction(values => {
        const output = document.querySelector('[data-testid="input-state"]');
        return Object.entries(values).every(([name, value]) => output?.getAttribute(`data-${name}`) === String(value));
      }, expected);
    };
    const check = async (name, action) => {
      try { await action(); checked.push(name); }
      catch (error) { throw new Error(`${name}: ${error.message}`, { cause: error }); }
    };
    const points = async () => {
      const box = await guard.boundingBox();
      assert.ok(box, 'The actual guard control must be visible');
      return [
        { x: box.x + box.width / 2 - 20, y: box.y + box.height / 2, id: 11 },
        { x: box.x + box.width / 2 + 20, y: box.y + box.height / 2, id: 22 }
      ];
    };
    // CDP touchEnd with points releases the named touches; [] releases all.
    const touch = (type, touchPoints) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints });
    const toggle = testId => page.getByTestId(testId).evaluate(element => element.click());
    const heldKeys = async (control, attribute) => {
      await control.focus();
      await page.keyboard.down('Space'); await state({ [attribute]: true });
      await page.keyboard.down('Enter');
      await page.keyboard.up('Enter'); await state({ [attribute]: true });
      await page.keyboard.up('Space'); await state({ [attribute]: false });
    };

    await check('native Space + Enter preserve guard until the last release', () => heldKeys(guard, 'guard'));
    await check('native Space + Enter preserve charge until the last release', () => heldKeys(charge, 'charge'));
    await check('the shared button feeds the real Fighter ownership registry', () => heldKeys(page.getByTestId('fighter-left'), 'fighter-left'));

    await check('scene movement keeps main Enter and NumpadEnter independent', async () => {
      const scene = page.getByTestId('scene-forward');
      await scene.focus();
      for (const [first, last] of [['Enter', 'NumpadEnter'], ['NumpadEnter', 'Enter']]) {
        await page.keyboard.down('Enter');
        await page.keyboard.down('NumpadEnter');
        await state({ 'scene-forward': true });
        await page.keyboard.up(first); await state({ 'scene-forward': true });
        await page.keyboard.up(last); await state({ 'scene-forward': false });
      }
      const codes = await page.evaluate(() => window.__heldInputEvents
        .filter(event => event.type === 'keydown' && event.trusted && event.slot === 'scene-forward')
        .map(event => event.code));
      assert.ok(codes.includes('Enter') && codes.includes('NumpadEnter'), 'Distinct physical key codes must come from native events');
    });

    await check('scene reset rejects native key repeat until a fresh activation', async () => {
      await page.getByTestId('scene-forward').focus();
      await page.keyboard.down('Space'); await state({ 'scene-forward': true });
      await toggle('reset-scene'); await state({ 'scene-forward': false });
      await page.keyboard.down('Space'); await state({ 'scene-forward': false });
      assert.equal(await page.evaluate(() => window.__heldInputEvents
        .filter(event => event.type === 'keydown' && event.slot === 'scene-forward').at(-1).repeat), true);
      await page.keyboard.down('Enter'); await state({ 'scene-forward': true });
      await page.keyboard.up('Space'); await state({ 'scene-forward': true });
      await page.keyboard.up('Enter'); await state({ 'scene-forward': false });
    });

    await check('scene pointer activation still focuses the actual movement button', async () => {
      const scene = page.getByTestId('scene-forward');
      await page.getByTestId('focus-target').focus();
      const box = await scene.boundingBox(); assert.ok(box);
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await page.mouse.down(); await state({ 'scene-forward': true });
      assert.equal(await scene.evaluate(element => document.activeElement === element), true);
      await page.mouse.up(); await state({ 'scene-forward': false });
    });

    await check('two native touches on one guard survive either first release', async () => {
      const [a, b] = await points();
      for (const released of [a, b]) {
        await touch('touchStart', [a]); await touch('touchStart', [a, b]);
        await state({ guard: true });
        await touch('touchEnd', [released]); await state({ guard: true });
        await touch('touchEnd', []); await state({ guard: false });
      }
      const nativeDowns = await page.evaluate(() => window.__heldInputEvents.filter(event => event.type === 'pointerdown' && event.slot === 'shield'));
      assert.ok(nativeDowns.length >= 4 && nativeDowns.every(event => event.trusted), 'Touches must produce trusted native pointer events');
    });

    await check('moving DOM focus preserves a native pointer hold', async () => {
      const [a] = await points();
      await guard.focus(); await touch('touchStart', [a]);
      await page.getByTestId('focus-target').focus();
      assert.equal(await page.getByTestId('focus-target').evaluate(element => element === document.activeElement), true);
      await state({ guard: true });
      await touch('touchEnd', []); await state({ guard: false });
    });

    await check('native mouse capture releases outside the button', async () => {
      const [a] = await points();
      await page.mouse.move(a.x, a.y); await page.mouse.down(); await state({ guard: true });
      const id = await page.evaluate(() => window.__heldInputEvents.filter(event => event.type === 'pointerdown' && event.slot === 'shield').at(-1).pointerId);
      assert.equal(await guard.evaluate((element, pointerId) => element.hasPointerCapture(pointerId), id), true);
      await page.mouse.move(890, 690); await page.mouse.up(); await state({ guard: false });
      assert.equal(await guard.evaluate((element, pointerId) => element.hasPointerCapture(pointerId), id), false);
      assert.equal(await page.evaluate(() => window.__heldInputEvents.filter(event => event.type === 'pointerup').at(-1).slot), 'shield');
    });

    await check('native pointer cancellation preserves an independent keyboard owner', async () => {
      const [a, b] = await points();
      await guard.focus(); await page.keyboard.down('Space');
      await touch('touchStart', [a]); await touch('touchStart', [a, b]);
      await touch('touchCancel', []); await state({ guard: true });
      await page.keyboard.up('Space'); await state({ guard: false });
      assert.equal(await page.evaluate(() => window.__heldInputEvents.some(event => event.type === 'pointercancel' && event.trusted && event.slot === 'shield')), true);
    });

    await check('native lost capture cancels only its own pointer', async () => {
      const [a, b] = await points();
      await touch('touchStart', [a]); await touch('touchStart', [a, b]);
      const id = await page.evaluate(() => window.__heldInputEvents.filter(event => event.type === 'pointerdown' && event.slot === 'shield').slice(-2)[0].pointerId);
      // setPointerCapture first establishes a pending target. Commit it with a
      // native move before requesting release, then flush that release too.
      await touch('touchMove', [{ ...a, x: a.x + 5 }, b]);
      await page.waitForFunction(pointerId => window.__heldInputEvents.some(event => event.type === 'gotpointercapture' && event.pointerId === pointerId && event.trusted), id);
      await guard.evaluate((element, pointerId) => element.releasePointerCapture(pointerId), id);
      const movedA = { ...a, x: a.x + 10 };
      await touch('touchMove', [movedA, b]);
      await page.waitForFunction(pointerId => window.__heldInputEvents.some(event => event.type === 'lostpointercapture' && event.pointerId === pointerId && event.trusted), id);
      await state({ guard: true });
      await touch('touchEnd', [b]); await state({ guard: false });
      await touch('touchEnd', []);
    });

    await check('a fresh native touch works after scene reset and ignores stale releases', async () => {
      const [a, b] = await points();
      await touch('touchStart', [a]); await state({ guard: true });
      await toggle('reset-scene'); await state({ guard: false });
      await touch('touchStart', [a, b]); await state({ guard: true });
      await touch('touchEnd', [a]); await state({ guard: true });
      await touch('touchEnd', []); await state({ guard: false });
    });

    await check('disabled controls clear holds and re-enable without stale input', async () => {
      const [a] = await points();
      await touch('touchStart', [a]); await state({ guard: true });
      await toggle('disable-controls'); await state({ disabled: true, guard: false });
      await toggle('disable-controls'); await state({ disabled: false, guard: false });
      await touch('touchEnd', []); await state({ guard: false });
      await touch('touchStart', [a]); await state({ guard: true });
      await touch('touchEnd', []); await state({ guard: false });
    });

    await check('unmount and remount cannot revive or cancel a new hold', async () => {
      const [a, b] = await points();
      await touch('touchStart', [a]); await state({ guard: true });
      await toggle('mount-controls'); await state({ mounted: false, guard: false });
      await toggle('mount-controls'); await state({ mounted: true, guard: false });
      await touch('touchStart', [a, b]); await state({ guard: true });
      await touch('touchEnd', [a]); await state({ guard: true });
      await touch('touchEnd', []); await state({ guard: false });
    });

    // Headless lifecycle signals are injected deliberately. Pointer events
    // remain native; this does not claim an OS task-switch/browser-tab test.
    await check('synthetic window blur clears native holds without reactivation', async () => {
      const [a] = await points();
      await touch('touchStart', [a]); await state({ guard: true });
      await page.evaluate(() => window.dispatchEvent(new Event('blur')));
      await state({ guard: false });
      await page.evaluate(() => window.dispatchEvent(new Event('focus')));
      await state({ guard: false });
      await touch('touchEnd', []);
      await touch('touchStart', [a]); await state({ guard: true });
      await touch('touchEnd', []); await state({ guard: false });
    });

    await check('synthetic hidden document clears holds and rejects input until visible', async () => {
      const [a, b] = await points();
      await touch('touchStart', [a]); await state({ guard: true });
      await page.evaluate(() => {
        window.__fixtureHiddenDescriptor = Object.getOwnPropertyDescriptor(document, 'hidden');
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await state({ guard: false });
      await touch('touchStart', [a, b]); await state({ guard: false });
      await page.evaluate(() => {
        if (window.__fixtureHiddenDescriptor) Object.defineProperty(document, 'hidden', window.__fixtureHiddenDescriptor);
        else delete document.hidden;
        delete window.__fixtureHiddenDescriptor;
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await state({ guard: false });
      await touch('touchEnd', []);
      await touch('touchStart', [a]); await state({ guard: true });
      await touch('touchEnd', []); await state({ guard: false });
    });

    await check('right mouse button does not activate a held action', async () => {
      const [a] = await points();
      await page.mouse.move(a.x, a.y); await page.mouse.down({ button: 'right' });
      await state({ guard: false }); await page.mouse.up({ button: 'right' });
      await page.keyboard.press('Escape');
    });

    await check('Escape cancels remapping before closing the real combat drawer', async () => {
      await page.getByTestId('open-settings').click();
      const dialog = page.locator('dialog[open]'); await dialog.waitFor();
      await dialog.getByRole('button', { name: 'JOUEUR 1 / GAUCHE: Q', exact: true }).click();
      await page.keyboard.press('Escape');
      await state({ 'settings-open': true });
      assert.equal(await dialog.locator('[role="status"]').textContent(), 'Remappage annule.');
      await page.keyboard.press('Escape'); await state({ 'settings-open': false });
      assert.equal(await page.getByTestId('open-settings').evaluate(element => element === document.activeElement), true);
    });

    for (const activation of ['Enter', 'NumpadEnter', 'KeyW']) {
      await check(`a native held ${activation} cannot become an unintended remap`, async () => {
        await page.getByTestId('open-settings').click();
        const dialog = page.locator('dialog[open]'); await dialog.waitFor();
        const left = dialog.getByRole('button', { name: /^JOUEUR 1 \/ GAUCHE:/ });
        await left.focus();
        await page.keyboard.down(activation);
        if (activation === 'KeyW') await left.click();
        assert.equal(await left.getAttribute('aria-pressed'), 'true');
        await page.keyboard.down(activation);
        assert.equal(await left.getAttribute('aria-pressed'), 'true', 'Repeat must leave capture pending');
        const repeated = await page.evaluate(code => window.__heldInputEvents
          .filter(event => event.type === 'keydown' && event.code === code).at(-1), activation);
        assert.equal(repeated.repeat, true); assert.equal(repeated.trusted, true);
        await page.keyboard.up(activation);
        await page.keyboard.press('KeyA');
        assert.equal(await left.getAttribute('aria-label'), 'JOUEUR 1 / GAUCHE: A');
        assert.equal(await left.getAttribute('aria-pressed'), 'false');
        await dialog.getByRole('button', { name: 'RÉINITIALISER', exact: true }).click();
        assert.equal(await left.getAttribute('aria-label'), 'JOUEUR 1 / GAUCHE: Q');
        await page.keyboard.press('Escape'); await state({ 'settings-open': false });
      });
    }

    await check('opposite-axis conflict preserves bindings, supports Escape and accepts a free key', async () => {
      await page.getByTestId('open-settings').click();
      const dialog = page.locator('dialog[open]'); await dialog.waitFor();
      const left = dialog.getByRole('button', { name: /^JOUEUR 1 \/ GAUCHE:/ });
      const right = dialog.getByRole('button', { name: /^JOUEUR 1 \/ DROITE:/ });
      await left.click(); await page.keyboard.press('KeyD');
      assert.equal(await left.getAttribute('aria-pressed'), 'true');
      assert.match(await dialog.locator('[role="status"]').textContent(), /GAUCHE.*D.*DROITE.*autre touche/);
      assert.equal(await right.getAttribute('aria-label'), 'JOUEUR 1 / DROITE: D');
      await page.keyboard.press('Escape'); await state({ 'settings-open': true });
      assert.equal(await left.getAttribute('aria-label'), 'JOUEUR 1 / GAUCHE: Q');
      await left.click(); await page.keyboard.press('KeyD'); await page.keyboard.press('KeyA');
      assert.equal(await left.getAttribute('aria-label'), 'JOUEUR 1 / GAUCHE: A');
      assert.equal(await right.getAttribute('aria-label'), 'JOUEUR 1 / DROITE: D');
      await dialog.getByRole('button', { name: 'RÉINITIALISER', exact: true }).click();
      await page.keyboard.press('Escape'); await state({ 'settings-open': false });
    });

    await check('Space activation and a fresh Enter still produce an intentional remap', async () => {
      await page.getByTestId('open-settings').click();
      const dialog = page.locator('dialog[open]'); await dialog.waitFor();
      const left = dialog.getByRole('button', { name: /^JOUEUR 1 \/ GAUCHE:/ });
      await left.focus(); await page.keyboard.press('Space');
      assert.equal(await left.getAttribute('aria-pressed'), 'true');
      await page.keyboard.press('Enter');
      assert.equal(await left.getAttribute('aria-label'), 'JOUEUR 1 / GAUCHE: ENTER');
      assert.equal(await left.getAttribute('aria-pressed'), 'false');
      await dialog.getByRole('button', { name: 'RÉINITIALISER', exact: true }).click();
      await page.keyboard.press('Escape'); await state({ 'settings-open': false });
    });

    await check('focus leaving the panel and reset both cancel a rejected remap', async () => {
      await page.getByTestId('open-settings').click();
      const dialog = page.locator('dialog[open]'); await dialog.waitFor();
      const left = dialog.getByRole('button', { name: /^JOUEUR 1 \/ GAUCHE:/ });
      await left.click(); await page.keyboard.press('KeyD');
      assert.equal(await left.getAttribute('aria-pressed'), 'true');
      await dialog.locator('[data-drawer-close]').focus();
      assert.equal(await left.getAttribute('aria-pressed'), 'false');
      assert.equal(await left.getAttribute('aria-label'), 'JOUEUR 1 / GAUCHE: Q');
      await left.click(); await page.keyboard.press('KeyD');
      assert.equal(await left.getAttribute('aria-pressed'), 'true');
      await dialog.getByRole('button', { name: 'RÉINITIALISER', exact: true }).click();
      assert.equal(await left.getAttribute('aria-pressed'), 'false');
      assert.equal(await left.getAttribute('aria-label'), 'JOUEUR 1 / GAUCHE: Q');
      await page.keyboard.press('Escape'); await state({ 'settings-open': false });
    });

    await state({ guard: false, charge: false, 'fighter-left': false, 'scene-forward': false });
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ browser: browser.version(), viewport: { width: 900, height: 700 },
      passed: checked.length, cases: checked,
      native: ['CDP multi-touch and pointer cancellation', 'DOM pointer capture and focus', 'mouse and keyboard input', 'native combat dialog'],
      synthetic: ['window blur/focus events', 'document.hidden override and visibilitychange', 'fixture controls drive scene reset, disabled and mount state'],
      scope: 'Real control components including City/FPS SceneHoldButton, scene/Fighter registries and extracted GameCanvas touch callback/mapping; no full combat simulation.',
      pageErrors: errors }, null, 2));
  } finally { await context.close(); }
} finally { await browser.close(); }
