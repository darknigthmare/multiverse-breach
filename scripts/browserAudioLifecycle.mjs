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
const checked = [], errors = [];
const stopped = { scheduled: false, sources: 0, stage: null, plan: null, theme: null };
const sceneA = 'fixture-combat-a', sceneB = 'fixture-race-b';

async function check(name, test) {
  const context = await browser.newContext();
  try {
    await context.route('**/*', async route => {
      const url = new URL(route.request().url());
      if (url.origin !== 'http://multiverse.test') { await route.abort(); return; }
      const path = resolve(root, '.' + url.pathname);
      const relativePath = relative(root, path);
      if (relativePath === '..' || relativePath.startsWith('..' + sep)) {
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
    await page.goto('http://multiverse.test/scripts/fixtures/gamedev-audio.html');
    await page.waitForFunction(() => Boolean(window.__gamedevAudio));
    const click = id => page.getByTestId(id).click();
    const mute = () => page.locator('button.global-audio-control').click();
    const read = () => page.evaluate(() => window.__gamedevAudio.read());
    const expect = async expected => {
      const actual = await read();
      for (const [key, value] of Object.entries(expected)) assert.equal(actual[key], value, `${key}: ${JSON.stringify(actual)}`);
    };
    const contextState = async value => {
      await page.waitForFunction(state => window.__gamedevAudio.read().context === state, value);
    };
    const start = async () => {
      await click('queue-a'); await click('unlock'); await contextState('running');
      await expect({ stage: sceneA, scheduled: true, muted: false });
    };
    await test({ click, mute, read, expect, contextState, start });
    await click('stop'); await expect(stopped);
    checked.push(name);
  } catch (error) {
    throw new Error(`${name}: ${error.message}`, { cause: error });
  } finally { await context.close(); }
}

try {
  await check('cancelled cold request does not start at the first native gesture', async ({ click, expect, contextState }) => {
    await expect({ context: null, unlocked: false });
    await click('queue-a'); await expect({ context: null, stage: sceneA, scheduled: false });
    await click('stop');
    await click('unlock'); await contextState('running');
    await expect(stopped);
  });
  await check('an effect after explicit stop leaves the old scene music stopped', async ({ start, click, expect, contextState }) => {
    await start(); await click('stop'); await click('sfx'); await contextState('running');
    await expect(stopped);
  });
  await check('mute and unmute after explicit stop do not revive music', async ({ start, click, mute, expect, contextState }) => {
    await start(); await click('stop'); await mute(); await contextState('suspended');
    await mute(); await contextState('running'); await expect({ ...stopped, muted: false });
  });
  await check('ordinary mute and unmute retain the current intended scene', async ({ start, mute, read, expect, contextState }) => {
    await start(); const original = await read();
    await mute(); await contextState('suspended');
    await expect({ stage: sceneA, plan: original.plan, scheduled: false, sources: 0, muted: true });
    await mute(); await contextState('running');
    await expect({ stage: sceneA, plan: original.plan, scheduled: true, muted: false });
  });
  await check('a scene requested while muted replaces the earlier pending scene', async ({ start, click, mute, expect, contextState }) => {
    await start(); await mute(); await contextState('suspended');
    await click('queue-b'); await expect({ stage: sceneB, scheduled: false, muted: true });
    await mute(); await contextState('running');
    await expect({ stage: sceneB, scheduled: true, muted: false });
  });
  await check('stopping while muted cancels the latest pending scene', async ({ start, click, mute, expect, contextState }) => {
    await start(); await mute(); await contextState('suspended'); await click('queue-b');
    await click('stop'); await mute(); await contextState('running'); await click('sfx');
    await expect(stopped);
  });
  await check('a new explicit scene can start after cancellation without reviving the old one', async ({ start, click, expect }) => {
    await start(); await click('stop'); await click('queue-b'); await click('sfx'); await click('unlock');
    await expect({ stage: sceneB, scheduled: true, muted: false });
  });
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ browser: browser.version(), passed: checked.length, cases: checked,
    native: ['browser AudioContext, audio nodes and music scheduler', 'trusted clicks and the real AudioControl'],
    scope: 'Actual SoundEngine singleton; verifies requests, sources and scheduling, not listening or mix quality.',
    pageErrors: errors }, null, 2));
} finally { await browser.close(); }
