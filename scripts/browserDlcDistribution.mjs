import assert from 'node:assert/strict';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep, join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';

const options = {};
for (let index = 2; index < process.argv.length; index += 2) {
  const key = process.argv[index];
  if (!['--root', '--output'].includes(key) || !process.argv[index + 1]) {
    throw new Error('Usage: node scripts/browserDlcDistribution.mjs --root EXPORT [--output EVIDENCE_DIRECTORY]');
  }
  options[key.slice(2)] = process.argv[index + 1];
}
if (!options.root) throw new Error('--root must identify an exported distribution with a built dist directory');
const root = resolve(options.root);
const dist = resolve(root, 'dist');
await access(resolve(dist, 'index.html'));
const profile = JSON.parse(await readFile(resolve(root, 'DLC/distribution.json'), 'utf8'));
const identities = JSON.parse(await readFile(resolve(root, 'DLC/content-identities.json'), 'utf8'));
const { DLC_PACK_MANIFESTS } = await import(pathToFileURL(resolve(root, 'DLC/index.js')).href);
const { PERMANENT_OC_BOOSTERS } = await import(pathToFileURL(resolve(root, 'src/game/portalBoosterCatalog.js')).href);
const installedIds = new Set(profile.mode === 'all'
  ? DLC_PACK_MANIFESTS.map(pack => pack.id) : profile.packIds);
const halo = DLC_PACK_MANIFESTS.find(pack => pack.universe === 'Halo');
const absent = DLC_PACK_MANIFESTS.find(pack => pack.registration === 'runtime' && !installedIds.has(pack.id));
const haloInstalled = installedIds.has(halo.id);
const output = resolve(options.output || join(tmpdir(), 'multiverse-dlc-browser-' + profile.mode + (haloInstalled ? '-halo' : '')));
if (output === root || !relative(root, output).startsWith('..')) {
  throw new Error('Browser evidence must be outside the exported source inventory');
}
await mkdir(output, { recursive: true });

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined,
  args: process.env.PLAYWRIGHT_CHROMIUM_ARGS ? JSON.parse(process.env.PLAYWRIGHT_CHROMIUM_ARGS) : []
});
const origin = 'http://multiverse.test';
const saveKey = 'multiverse_breach_save_v2';
const seed = {
  saveVersion: 8,
  lang: 'en',
  gold: 913, breachShards: 85, eventTokens: 7,
  playerProfile: { name: 'Distribution test' },
  unlockedHeroes: ['player_anchor', 'masterchief', 'neris_vale'],
  activeTeam: ['masterchief', 'player_anchor', 'neris_vale'],
  heroLevels: { player_anchor: 8, masterchief: 23, neris_vale: 11 },
  heroTalents: { masterchief: 'spartan_training' },
  heroSkins: {},
  inventory: ['assault_rifle', 'assault_rifle', 'distribution_test_relic'],
  equippedGear: { masterchief: 'assault_rifle' },
  equippedEventItems: { neris_vale: 'thalassa_event' },
  completedStages: [47001],
  hiddenUniverses: ['Halo', 'Thalassa Mnémique', 'Half-Life', 'Future universe'],
  campaignProgress: { future_pack: { missionIds: [99881], ending: 'preserved' } },
  portalStats: { pulls: 2, packsOpened: 1, history: [] },
  onboarding: { profileCreated: true, prologueCompleted: true, prologueStep: 4, introSeen: true },
  activityProgress: { lifetimeWins: 4, lifetimeAttempts: 4, tutorialCompanionsUnlocked: true },
  portalCollection: {
    cards: {}, setProgress: {}, karts: ['future_kart'], activeKart: 'future_kart',
    battleMusic: ['future_track'], customLoadout: { battleMusic: 'future_track' }
  }
};
const results = [];
const types = {
  '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript',
  '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.woff': 'font/woff',
  '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.wav': 'audio/wav',
  '.ogg': 'audio/ogg', '.mp4': 'video/mp4', '.wasm': 'application/wasm'
};

async function savedTrace(page) {
  await page.waitForFunction(key => {
    try { return JSON.parse(localStorage.getItem(key))?.saveVersion === 9; } catch { return false; }
  }, saveKey);
  return page.evaluate(key => JSON.parse(localStorage.getItem(key)), saveKey);
}

function assertPreserved(save) {
  assert.deepEqual(save.activeTeam, seed.activeTeam, 'Opening a reduced distribution must not replace saved team slots');
  for (const id of seed.unlockedHeroes) assert.ok(save.unlockedHeroes.includes(id), 'Lost owned hero: ' + id);
  for (const [id, level] of Object.entries(seed.heroLevels)) assert.equal(save.heroLevels[id], level);
  assert.equal(save.equippedGear.masterchief, seed.equippedGear.masterchief);
  assert.equal(save.equippedEventItems.neris_vale, seed.equippedEventItems.neris_vale);
  assert.equal(save.inventory.filter(id => id === 'assault_rifle').length, 2);
  assert.ok(save.inventory.includes('distribution_test_relic'));
  assert.deepEqual(save.campaignProgress.future_pack, seed.campaignProgress.future_pack);
  assert.ok(save.completedStages.includes(47001));
  assert.equal(save.portalCollection.activeKart, 'future_kart');
  assert.equal(save.portalCollection.customLoadout.battleMusic, 'future_track');
  for (const universe of ['Thalassa Mnémique', 'Half-Life', 'Future universe']) {
    assert.ok(save.hiddenUniverses.includes(universe), 'Lost absent-pack reserve preference: ' + universe);
  }
  assert.equal('installedPackIds' in save, false);
}

async function activateWithKeyboard(page, locator) {
  await locator.focus();
  assert.equal(await locator.evaluate(element => document.activeElement === element), true);
  await page.keyboard.press('Enter');
}

async function openTab(page, group, tab, keyboard = false) {
  const groupButton = page.getByRole('button', { name: group, exact: true }).first();
  if (keyboard) await activateWithKeyboard(page, groupButton);
  else await groupButton.click();
  const tabButton = page.getByRole('button', { name: tab, exact: true }).first();
  if (keyboard) await activateWithKeyboard(page, tabButton);
  else await tabButton.click();
}

async function assertResponsive(page, label, result) {
  const measurement = await page.evaluate(() => ({
    viewport: innerWidth,
    document: document.documentElement.scrollWidth,
    body: document.body.scrollWidth
  }));
  result.layouts.push({ screen: label, ...measurement });
  assert.ok(measurement.document <= measurement.viewport + 2, label + ' overflows the viewport: ' + JSON.stringify(measurement));
}

async function assertHubNavigation(page, label, result) {
  const primary = page.locator('.hub-navigation-primary');
  await primary.waitFor({ state: 'visible' });
  const settle = () => page.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  });
  await settle();
  const measurement = await primary.evaluate(element => ({
    viewport: innerWidth,
    container: element.getBoundingClientRect().toJSON(),
    sidebar: element.closest('.hub-navigation').getBoundingClientRect().toJSON(),
    buttons: [...element.querySelectorAll(':scope > button')].map(button => {
      const range = document.createRange();
      range.selectNodeContents(button);
      return {
        label: button.textContent.trim(),
        bounds: button.getBoundingClientRect().toJSON(),
        text: [...range.getClientRects()].map(rect => rect.toJSON())
      };
    })
  }));
  result.navigation.push({ screen: label, ...measurement });
  const context = label + ': ' + JSON.stringify(measurement);
  assert.ok(measurement.buttons.length > 1, 'Hub navigation must contain buttons: ' + context);
  const contains = (outer, inner) => inner.left >= outer.left - 1 && inner.right <= outer.right + 1
    && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
  for (const [index, button] of measurement.buttons.entries()) {
    assert.ok(button.bounds.width > 0 && button.bounds.height > 0 && button.text.length > 0, 'Empty navigation button: ' + context);
    assert.ok(button.text.every(rect => contains(button.bounds, rect)), 'Navigation text escapes its button: ' + context);
    if (measurement.viewport > 760) {
      assert.ok(contains(measurement.container, button.bounds) && contains(measurement.sidebar, button.bounds), 'Navigation button escapes its sidebar: ' + context);
    }
    for (const other of measurement.buttons.slice(index + 1)) {
      const width = Math.min(button.bounds.right, other.bounds.right) - Math.max(button.bounds.left, other.bounds.left);
      const height = Math.min(button.bounds.bottom, other.bounds.bottom) - Math.max(button.bounds.top, other.bounds.top);
      assert.ok(width <= 1 || height <= 1, 'Navigation buttons overlap: ' + context);
    }
  }
  if (measurement.viewport <= 760) {
    await primary.getByRole('button').first().focus();
    for (let index = 1; index < measurement.buttons.length; index += 1) await page.keyboard.press('Tab');
    await settle();
    const keyboard = await primary.evaluate(element => {
      const button = element.querySelector(':scope > button:last-child');
      const bounds = button.getBoundingClientRect();
      const container = element.getBoundingClientRect();
      const x = (bounds.left + bounds.right) / 2;
      const y = (bounds.top + bounds.bottom) / 2;
      return {
        label: button.textContent.trim(),
        focused: document.activeElement === button,
        centerVisible: x >= Math.max(0, container.left) && x <= Math.min(innerWidth, container.right)
          && y >= Math.max(0, container.top) && y <= Math.min(innerHeight, container.bottom),
        centerHit: button.contains(document.elementFromPoint(x, y)),
        scrollLeft: element.scrollLeft, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth
      };
    });
    result.navigation.at(-1).keyboard = keyboard;
    assert.ok(keyboard.focused && keyboard.centerVisible && keyboard.centerHit, 'Last navigation button is not reachable with Tab: ' + JSON.stringify(keyboard));
  }
}

async function assertHubNavigationViewports(page, viewport, lang, result, screenshot) {
  await assertHubNavigation(page, lang + ' initial Hub', result);
  await screenshot('navigation-' + lang, viewport.width);
  if (viewport.width === 1365) {
    for (const width of [1000, 761, 760]) {
      await page.setViewportSize({ width, height: viewport.height });
      await assertHubNavigation(page, lang + ' Hub resized to ' + width + 'px', result);
      await screenshot('navigation-' + lang, width);
    }
    await page.setViewportSize(viewport);
    await assertHubNavigation(page, lang + ' Hub restored to desktop', result);
  }
}

async function routeDistribution(context, missing, external) {
  await context.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.origin !== origin) {
      external.add(url.origin);
      await route.abort();
      return;
    }
    const file = resolve(dist, '.' + (url.pathname === '/' ? '/index.html' : decodeURIComponent(url.pathname)));
    const fromRoot = relative(dist, file);
    if (fromRoot === '..' || fromRoot.startsWith('..' + sep)) {
      await route.fulfill({ status: 403, body: 'Outside distribution' });
      return;
    }
    try {
      await route.fulfill({ body: await readFile(file), contentType: types[extname(file)] || 'application/octet-stream' });
    } catch {
      missing.add(url.pathname);
      await route.fulfill({ status: 404, body: 'Resource missing from distribution' });
    }
  });
}

async function scenario(viewport) {
  const name = viewport.width + 'px';
  const result = { scenario: 'preserved-trace', viewport, status: 'failed', pageErrors: [], missingResources: [], blockedExternalOrigins: [], layouts: [], navigation: [], actions: [] };
  results.push(result);
  const missing = new Set();
  const external = new Set();
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.on('pageerror', error => result.pageErrors.push(error.message));
  await routeDistribution(context, missing, external);
  await context.addInitScript(({ key, trace }) => {
    if (localStorage.getItem('distribution-smoke-seeded') !== 'true') {
      localStorage.setItem(key, JSON.stringify(trace));
      localStorage.setItem('distribution-smoke-seeded', 'true');
    }
  }, { key: saveKey, trace: seed });
  const screenshot = (label, width = viewport.width) => page.screenshot({ path: join(output, width + 'px-' + label + '.png'), fullPage: true });
  try {
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    const continueButton = page.getByRole('button', { name: 'CONTINUE', exact: true });
    await continueButton.waitFor({ state: 'visible' });
    assertPreserved(await savedTrace(page));
    await assertResponsive(page, 'title', result);
    await screenshot('title');
    await activateWithKeyboard(page, continueButton);
    await page.getByRole('button', { name: 'OPERATIONS', exact: true }).waitFor();
    result.actions.push('Title to Hub using Enter');
    await assertHubNavigationViewports(page, viewport, 'en', result, screenshot);

    await openTab(page, 'ARSENAL', 'ANCHOR CELL', true);
    await page.getByRole('status').filter({ hasText: 'member(s) of your selection' }).waitFor();
    assertPreserved(await savedTrace(page));
    await assertResponsive(page, 'team', result);
    await screenshot('team');
    result.actions.push('Available squad shown; dormant saved slots retained');

    await openTab(page, 'ARCHIVES', 'A.R.C.A. REGULATION', true);
    const summary = page.locator('[data-dlc-installation-mode]');
    assert.equal(await summary.getAttribute('data-dlc-installation-mode'), profile.mode);
    const haloRow = page.locator('[data-dlc-pack="' + halo.id + '"]');
    assert.equal(await haloRow.getAttribute('data-pack-installed'), String(haloInstalled));
    if (absent) {
      const absentRow = page.locator('[data-dlc-pack="' + absent.id + '"]');
      assert.equal(await absentRow.getAttribute('data-pack-installed'), 'false');
      await absentRow.getByText('NOT INCLUDED', { exact: true }).waitFor();
      assert.equal(await absentRow.getByRole('button', { name: 'OPEN THREAD', exact: true }).count(), 0);
    }
    assert.ok((await savedTrace(page)).hiddenUniverses.includes('Halo'));
    await activateWithKeyboard(page, page.getByRole('button', { name: 'SHOW ALL', exact: true }));
    await page.waitForFunction(({ key, installed }) => {
      const save = JSON.parse(localStorage.getItem(key));
      return save?.hiddenUniverses.includes('Halo') === !installed;
    }, { key: saveKey, installed: haloInstalled });
    assertPreserved(await savedTrace(page));
    if (haloInstalled) {
      await openTab(page, 'ARSENAL', 'ANCHOR CELL');
      await page.getByText('Master Chief', { exact: true }).first().waitFor();
      assert.match(await page.getByRole('status').filter({ hasText: 'member(s) of your selection' }).innerText(), /^1 member/);
      assertPreserved(await savedTrace(page));
      await assertResponsive(page, 'restored Halo squad', result);
      await screenshot('team-halo-active');
      await openTab(page, 'ARCHIVES', 'A.R.C.A. REGULATION');
      await haloRow.getByRole('button', { name: 'MOVE TO RESERVE', exact: true }).click();
      await page.waitForFunction(key => JSON.parse(localStorage.getItem(key))?.hiddenUniverses.includes('Halo'), saveKey);
      await openTab(page, 'ARSENAL', 'ANCHOR CELL');
      assert.match(await page.getByRole('status').filter({ hasText: 'member(s) of your selection' }).innerText(), /^2 member/);
      await page.getByText('Master Chief', { exact: true }).first().waitFor({ state: 'hidden' });
      assertPreserved(await savedTrace(page));
      await openTab(page, 'ARCHIVES', 'A.R.C.A. REGULATION');
      result.actions.push('Halo hero restored to the playable squad when enabled; reserve hides him without rewriting saved slots');
    }
    await assertResponsive(page, 'DLC register', result);
    await screenshot('dlc-register');
    result.actions.push('Absent packs unavailable; Show All preserves their preferences');

    await openTab(page, 'OPERATIONS', 'RIFT MAP');
    const back = page.getByRole('button', { name: 'BACK TO SCREENS', exact: true });
    if (await back.isVisible()) await back.click();
    await page.getByTitle('Open this mission screen: OC STANDALONE ACTS.', { exact: true }).click();
    for (const pack of identities.ocPacks) {
      const runtimePack = DLC_PACK_MANIFESTS.find(entry => entry.universe === pack.universe);
      if (!installedIds.has(runtimePack.id)) {
        const card = page.locator('[data-oc-dlc-pack="' + pack.id + '"]');
        await card.getByText('NOT INCLUDED IN THIS VERSION', { exact: true }).waitFor();
        assert.equal(await card.getByRole('button').count(), 0);
      }
    }
    await assertResponsive(page, 'OC acts', result);
    await screenshot('oc-acts');
    result.actions.push('OC acts display unavailable packs with retained progress');

    await page.getByRole('button', { name: 'BREACH PORTAL', exact: true }).first().click();
    await page.getByRole('button', { name: 'BACK TO NEXUS', exact: true }).waitFor();
    await activateWithKeyboard(page, page.getByRole('button', { name: 'CHOOSE A BOOSTER', exact: true }));
    const catalog = page.getByRole('dialog', { name: 'Booster catalog', exact: true });
    const boosterSearch = catalog.getByRole('searchbox', { name: 'Search every booster', exact: true });
    await boosterSearch.waitFor({ state: 'visible' });
    const boosterScope = catalog.getByRole('combobox', { name: 'Show', exact: true });
    assert.equal(await boosterScope.inputValue(), 'available');
    const searches = [];
    const checkBoosterSearch = async (query, expectedIds) => {
      await boosterSearch.fill(query);
      await page.waitForFunction(count => document.querySelector('.portal-catalog-results')?.textContent === `${count} matching booster(s)`, expectedIds.length);
      const ids = await catalog.locator('[data-preview-booster]').evaluateAll(nodes => nodes.map(node => node.dataset.previewBooster));
      assert.deepEqual(ids.sort(), [...expectedIds].sort(), `Incorrect booster search for ${query}`);
      assert.equal(await boosterScope.inputValue(), 'all', 'Search must include the complete installed, active catalogue');
      assert.equal(await boosterScope.isDisabled(), true);
      searches.push({ query, ids, count: ids.length });
    };
    const nexusIds = PERMANENT_OC_BOOSTERS.filter(pack => pack.universe === 'Nexus de Convergence').map(pack => pack.id);
    assert.ok(nexusIds.length > 0, 'The exported base must retain its authored Nexus boosters');
    await checkBoosterSearch('Nexus de Convergence', nexusIds);
    // Halo was placed back in reserve above, including in Halo distributions.
    // Global search must not resurrect a reserved or uninstalled universe.
    for (const universe of new Set([halo.universe, absent?.universe].filter(Boolean))) await checkBoosterSearch(universe, []);
    await catalog.getByRole('button', { name: 'Clear search', exact: true }).click();
    assert.equal(await boosterSearch.inputValue(), '');
    assert.equal(await boosterScope.inputValue(), 'available');
    assert.equal(await boosterScope.isDisabled(), false);
    result.portalSearches = searches;
    await assertResponsive(page, 'portal', result);
    await screenshot('portal');
    assertPreserved(await savedTrace(page));
    await page.keyboard.press('Escape');
    await catalog.waitFor({ state: 'hidden' });
    await activateWithKeyboard(page, page.getByRole('button', { name: 'BACK TO NEXUS', exact: true }));
    result.actions.push('Portal opens without spending resources');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'CONTINUE', exact: true }).waitFor();
    const reloaded = await savedTrace(page);
    assertPreserved(reloaded);
    assert.ok(reloaded.hiddenUniverses.includes('Halo'));
    await activateWithKeyboard(page, page.getByRole('button', { name: 'CONTINUE', exact: true }));
    await openTab(page, 'OPERATIONS', 'RIFT MAP');
    if (await back.isVisible()) await back.click();
    await page.getByTitle('Open this mission screen: OC campaign.', { exact: true }).click();
    await page.getByRole('button', { name: 'CONTINUE CAMPAIGN', exact: true }).click();
    await page.getByTestId('selected-briefing-deploy').click();
    await page.getByRole('button', { name: 'LAUNCH MISSION', exact: true }).click();
    await page.locator('.campaign-session canvas').first().waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    const pause = page.getByRole('dialog', { name: 'MISSION PAUSED', exact: true });
    await pause.waitFor();
    assert.equal(await pause.getByRole('button', { name: 'RESUME', exact: true }).evaluate(element => document.activeElement === element), true);
    await page.keyboard.press('Tab');
    assert.equal(await pause.evaluate(element => element.contains(document.activeElement)), true, 'Pause keyboard focus stays inside the dialog');
    await screenshot('mission-paused');
    const afterLaunch = await savedTrace(page);
    assertPreserved(afterLaunch);
    assert.deepEqual(afterLaunch.completedStages, reloaded.completedStages, 'This smoke launches and pauses; it must not award a simulated victory');
    result.actions.push('Base mission launched and paused with Escape; no combat completion simulated');
    assert.deepEqual(result.pageErrors, []);
    result.missingResources = [...missing];
    const missingGameResources = result.missingResources.filter(path => path !== '/favicon.ico');
    assert.deepEqual(missingGameResources, [], 'Built distribution requested missing resources');

    await page.reload({ waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'CONTINUE', exact: true }).waitFor();
    await page.getByTitle('Switch the whole interface to French.', { exact: true }).click();
    const continueFrench = page.getByRole('button', { name: 'CONTINUER', exact: true });
    await continueFrench.waitFor({ state: 'visible' });
    await screenshot('title-fr');
    await page.getByTitle('Menu système', { exact: true }).click();
    const systemMenu = page.getByRole('dialog', { name: 'SYSTÈME', exact: true });
    await systemMenu.waitFor({ state: 'visible' });
    await page.keyboard.press('Escape');
    await systemMenu.waitFor({ state: 'hidden' });
    await activateWithKeyboard(page, continueFrench);
    await page.getByRole('navigation', { name: 'Navigation du Nexus', exact: true }).waitFor();
    await assertHubNavigationViewports(page, viewport, 'fr', result, screenshot);
    await page.waitForFunction(key => JSON.parse(localStorage.getItem(key))?.lang === 'fr', saveKey);
    assertPreserved(await savedTrace(page));
    result.actions.push('French title language and system controls and Hub navigation validated');
    assert.deepEqual(result.pageErrors, []);
    assert.deepEqual([...missing].filter(path => path !== '/favicon.ico'), [], 'French navigation requested missing resources');
    result.status = 'passed';
  } catch (error) {
    result.failure = error.stack || error.message;
    await writeFile(join(output, name + '-failure.html'), await page.content()).catch(() => {});
    await writeFile(join(output, name + '-failure.txt'), await page.locator('body').innerText()).catch(() => {});
    await screenshot('failure').catch(() => {});
  } finally {
    result.missingResources = [...missing];
    result.blockedExternalOrigins = [...external];
    await context.close();
  }
}

async function decodedBackgrounds(locator, label, result) {
  const images = await locator.evaluate(async element => {
    const urls = [...getComputedStyle(element).backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)].map(match => match[1]);
    return Promise.all(urls.map(async url => {
      const image = new Image();
      image.src = url;
      await image.decode();
      return { url: new URL(url, location.href).pathname, width: image.naturalWidth, height: image.naturalHeight };
    }));
  });
  assert.ok(images.length > 0, label + ' has an actual backdrop');
  for (const image of images) assert.ok(image.width > 0 && image.height > 0, label + ' backdrop decodes');
  result.backgrounds.push({ label, images });
  return images;
}

async function freshProfileScenario(viewport) {
  const name = viewport.width + 'px-new-profile';
  const result = { scenario: 'fresh-profile', viewport, status: 'failed', pageErrors: [], missingResources: [], blockedExternalOrigins: [], layouts: [], navigation: [], backgrounds: [], actions: [] };
  results.push(result);
  const missing = new Set();
  const external = new Set();
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(30000);
  page.on('pageerror', error => result.pageErrors.push(error.message));
  await routeDistribution(context, missing, external);
  const screenshot = label => page.screenshot({ path: join(output, name + '-' + label + '.png'), fullPage: true });
  try {
    assert.deepEqual((await context.storageState()).origins, [], 'New profile starts without a seeded save');
    await page.goto(origin + '/', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: 'NOUVELLE TRACE', exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'CONTINUER', exact: true }).isDisabled(), true);
    await page.getByTitle('Passe toute l interface en anglais.', { exact: true }).click();
    await page.getByRole('button', { name: 'NEW TRACE', exact: true }).click();
    const nameInput = page.getByLabel('Anchor name', { exact: true });
    await nameInput.waitFor();
    const playerName = 'Fresh ' + profile.mode + ' ' + viewport.width;
    await nameInput.fill(playerName);
    const profileImages = await decodedBackgrounds(page.locator('.intro-profile-screen'), 'profile', result);
    assert.ok(profileImages.some(image => image.url === '/backgrounds/stargate-rpg-openai.png'), 'Shared profile artwork retains its original URL');
    await assertResponsive(page, 'new profile', result);
    await screenshot('identification');
    await page.getByRole('button', { name: 'CONTINUE LOCALLY', exact: true }).click();
    result.actions.push('Empty browser context creates an Anchor through the local profile form');
    const scenes = ['The sky breaks', 'The Threads fall', 'A.R.C.A. answers', 'One signal remains whole', 'The first cell'];
    for (const [index, title] of scenes.entries()) {
      await page.getByRole('heading', { name: title, exact: true }).waitFor();
      await decodedBackgrounds(page.locator('.prologue-screen'), 'prologue ' + index, result);
      await assertResponsive(page, 'new profile prologue ' + index, result);
      await screenshot('prologue-' + index);
      await page.getByRole('button', { name: index === scenes.length - 1 ? 'ENTER THE NEXUS' : 'NEXT', exact: true }).click();
    }
    await page.getByRole('button', { name: 'OPERATIONS', exact: true }).waitFor();
    await page.waitForFunction(({ key, name }) => {
      const save = JSON.parse(localStorage.getItem(key));
      return save?.playerProfile?.name === name && save?.onboarding?.prologueCompleted === true;
    }, { key: saveKey, name: playerName });
    const created = await savedTrace(page);
    assert.equal(created.onboarding.profileCreated, true);
    assert.equal(created.onboarding.prologueStep, 4);
    for (const id of ['player_anchor', 'arca_mirelle', 'arca_bastion']) assert.ok(created.unlockedHeroes.includes(id), 'Starter hero retained: ' + id);
    assert.deepEqual(created.completedStages, [], 'Creating a profile must not award a mission victory');
    await assertResponsive(page, 'new profile Hub', result);
    await screenshot('hub');
    await page.reload({ waitUntil: 'domcontentloaded' });
    const continueButton = page.getByRole('button', { name: 'CONTINUE', exact: true });
    await continueButton.waitFor();
    assert.equal(await continueButton.isEnabled(), true);
    const reloaded = await savedTrace(page);
    assert.equal(reloaded.playerProfile.name, playerName);
    assert.deepEqual(reloaded.onboarding, created.onboarding);
    assert.deepEqual(reloaded.activeTeam, created.activeTeam);
    assert.deepEqual(reloaded.completedStages, created.completedStages);
    await activateWithKeyboard(page, continueButton);
    await page.getByRole('button', { name: 'OPERATIONS', exact: true }).waitFor();
    result.actions.push('All five prologue pages decode; new save reloads and continues to the Hub');
    assert.deepEqual(result.pageErrors, []);
    assert.deepEqual([...missing].filter(path => path !== '/favicon.ico'), [], 'New profile requested missing resources');
    result.status = 'passed';
  } catch (error) {
    result.failure = error.stack || error.message;
    await writeFile(join(output, name + '-failure.html'), await page.content()).catch(() => {});
    await writeFile(join(output, name + '-failure.txt'), await page.locator('body').innerText()).catch(() => {});
    await screenshot('failure').catch(() => {});
  } finally {
    result.missingResources = [...missing];
    result.blockedExternalOrigins = [...external];
    await context.close();
  }
}

try {
  for (const viewport of [{ width: 1365, height: 900 }, { width: 390, height: 844 }]) await scenario(viewport);
  for (const viewport of [{ width: 1365, height: 900 }, { width: 390, height: 844 }]) await freshProfileScenario(viewport);
  const report = {
    root, profile, browser: browser.version(), evidence: output,
    native: 'Built exported App, DOM, keyboard, canvas and browser localStorage; real reload and autosave',
    controlled: 'Existing-save scenarios seed a v8 trace with dormant possessions and English locale; new-profile scenarios start with empty storage and use the actual language/profile/prologue controls. Same-origin static file routing; external requests blocked',
    limits: 'English gameplay covers mission launch and pause only; French checks navigation only. No simulated victory, no cloud account and no real purchases.',
    results
  };
  await writeFile(join(output, 'report.json'), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify(report, null, 2));
  assert.equal(results.filter(result => result.status !== 'passed').length, 0, 'DLC distribution browser smoke failed; inspect ' + join(output, 'report.json'));
} finally {
  await browser.close();
}
