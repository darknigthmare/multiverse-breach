import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, relative, sep, extname } from 'node:path';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: process.env.PLAYWRIGHT_CHROMIUM_ARGS ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS) : []
});
const root = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/gamedev-display');
const results = [];
const trace = gold => ({ gold, completedStages: [], unlockedHeroes: ['player_anchor'] });
const readState = async page => JSON.parse(await page.getByTestId('save-state').textContent());

async function runScenario(name, exercise) {
  const context = await browser.newContext();
  const result = { scenario: name, status: 'failed', pageErrors: [] };
  results.push(result);
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
        await route.fulfill({ body: await readFile(path),
          contentType: { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' }[extname(path)] || 'application/octet-stream'
        });
      } catch { await route.fulfill({ status: 404, body: 'Fixture resource missing' }); }
    });
    // Two actual pages in one context have distinct JS realms and shared
    // same-origin browser localStorage; no Map or storage shim backs the data.
    const page = await context.newPage();
    const peer = await context.newPage();
    for (const target of [page, peer]) {
      target.setDefaultTimeout(15000);
      target.on('pageerror', error => result.pageErrors.push(error.message));
      await target.goto('http://multiverse.test/scripts/fixtures/gamedev-save.html');
      await target.getByTestId('save-fixture').waitFor();
    }
    const key = await page.getByTestId('save-fixture').getAttribute('data-save-key');
    const backupKey = await page.getByTestId('save-fixture').getAttribute('data-backup-key');
    const disk = {
      write: async gold => peer.evaluate(({ key, value }) => localStorage.setItem(key, value), { key, value: JSON.stringify(trace(gold)) }),
      read: async () => peer.evaluate(key => localStorage.getItem(key), key),
      backup: async () => peer.evaluate(key => localStorage.getItem(key), backupKey)
    };
    await exercise({ page, peer, disk, result });
    assert.deepEqual(result.pageErrors, []);
    result.status = 'passed';
  } catch (error) {
    result.failure = error.message;
  } finally { await context.close(); }
}

try {
  await runScenario('stable load, progression save and fresh reload', async ({ page, disk, result }) => {
    await disk.write(100);
    await page.getByRole('button', { name: 'Load saved progression', exact: true }).click();
    assert.equal((await readState(page)).loadedGold, 100);
    await page.getByRole('button', { name: 'Initialize writer', exact: true }).click();
    await page.getByRole('button', { name: 'Add 25 gold', exact: true }).click();
    result.save = (await readState(page)).result;
    result.storedGold = JSON.parse(await disk.read()).gold;
    assert.deepEqual(result.save, { saved: true });
    assert.equal(result.storedGold, 125);
    await page.reload();
    await page.getByRole('button', { name: 'Load saved progression', exact: true }).click();
    assert.equal((await readState(page)).loadedGold, 125);
    await page.getByRole('button', { name: 'Initialize writer', exact: true }).click();
    await page.getByRole('button', { name: 'Save loaded progression', exact: true }).click();
    assert.deepEqual((await readState(page)).result, { saved: true });
    result.reloadGold = (await readState(page)).loadedGold;
  });

  await runScenario('second page changes save between load and writer initialization', async ({ page, disk, result }) => {
    await disk.write(100);
    await page.getByRole('button', { name: 'Load saved progression', exact: true }).click();
    assert.equal((await readState(page)).loadedGold, 100);
    await disk.write(250);
    const newerRaw = await disk.read();
    await page.getByRole('button', { name: 'Initialize writer', exact: true }).click();
    await page.getByRole('button', { name: 'Save loaded progression', exact: true }).click();
    result.staleSave = (await readState(page)).result;
    result.newerGold = 250;
    result.storedGoldAfterStaleSave = JSON.parse(await disk.read()).gold;
    assert.deepEqual(result.staleSave, { saved: false, reason: 'save-conflict' });
    assert.equal(await disk.read(), newerRaw);
    assert.equal((await readState(page)).issue, 'save-conflict');
    await page.getByRole('button', { name: 'Save loaded progression', exact: true }).click();
    assert.equal(await disk.read(), newerRaw, 'Repeated automatic saves must remain blocked');
    await page.getByRole('button', { name: 'Explicitly import 900 gold', exact: true }).click();
    assert.deepEqual((await readState(page)).result, { saved: true });
    assert.equal((await readState(page)).issue, null);
    assert.equal(await disk.backup(), newerRaw, 'Explicit adoption backs up the newer native value');
    result.importedGold = JSON.parse(await disk.read()).gold;
    result.backupGold = JSON.parse(await disk.backup()).gold;
    assert.equal(result.importedGold, 900);
  });

  await runScenario('one injected initial read failure, native recovery and explicit reload', async ({ page, disk, result }) => {
    await disk.write(250);
    const preservedRaw = await disk.read();
    await page.getByRole('button', { name: 'Load with one injected read error', exact: true }).click();
    const loaded = await readState(page);
    assert.equal(loaded.loadedGold, 0);
    assert.equal(loaded.initialIssue, 'persistence-failed');
    assert.equal(loaded.injectedReadErrors, 1);
    // The one-shot patch has already been restored; this page can read native
    // storage again before the real App guard initialization runs.
    const key = await page.getByTestId('save-fixture').getAttribute('data-save-key');
    assert.equal(await page.evaluate(key => localStorage.getItem(key), key), preservedRaw);
    await page.getByRole('button', { name: 'Initialize writer', exact: true }).click();
    await page.getByRole('button', { name: 'Save loaded progression', exact: true }).click();
    result.defaultSave = (await readState(page)).result;
    result.storedGoldAfterDefaultSave = JSON.parse(await disk.read()).gold;
    result.injectedReadErrors = loaded.injectedReadErrors;
    assert.deepEqual(result.defaultSave, { saved: false, reason: 'persistence-failed' });
    assert.equal(await disk.read(), preservedRaw);
    assert.equal((await readState(page)).issue, 'persistence-failed');
    await page.getByRole('button', { name: 'Save loaded progression', exact: true }).click();
    assert.equal(await disk.read(), preservedRaw);
    await page.reload();
    await page.getByRole('button', { name: 'Load saved progression', exact: true }).click();
    assert.equal((await readState(page)).loadedGold, 250);
    await page.getByRole('button', { name: 'Initialize writer', exact: true }).click();
    await page.getByRole('button', { name: 'Add 25 gold', exact: true }).click();
    assert.deepEqual((await readState(page)).result, { saved: true });
    result.goldAfterExplicitReload = JSON.parse(await disk.read()).gold;
    assert.equal(result.goldAfterExplicitReload, 275);
  });

  console.log(JSON.stringify({
    browser: browser.version(),
    native: 'two same-origin pages, localStorage, reload, backup and persistence writes',
    controlled: 'pause between actual App load and guard construction; one injected getItem error in the third scenario',
    stubs: 'React bookkeeping inside extracted App closures, navigation and catalog normalization; no full App, migration or cloud coverage',
    results
  }, null, 2));
  assert.equal(results.filter(result => result.status === 'failed').length, 0, 'Save initialization browser regression');
} finally { await browser.close(); }
