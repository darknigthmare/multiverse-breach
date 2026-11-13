import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname, relative, resolve, sep } from 'node:path';
import { DISPLAY_PREFERENCES_KEY } from '../src/game/displayPreferences.js';
import { AUDIO_PREFERENCES_KEY } from '../src/game/audioPreferences.js';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE_PATH || 'playwright');
const fixture = resolve(process.env.PLAYWRIGHT_FIXTURE_DIR || '.tmp/custom-battle-lobby');
const evidence = resolve(process.env.PLAYWRIGHT_EVIDENCE_DIR || '.tmp/custom-battle-lobby-evidence');
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
const results = [];
const focused = async locator => {
  const element = await locator.elementHandle();
  try { await locator.page().waitForFunction(node => document.activeElement === node, element); }
  finally { await element.dispose(); }
};
const presetOf = page => page.evaluate(() => window.__customLobbyQA.collection.customBattlePreset);
const expectPreset = async (page, expected) => {
  await page.waitForFunction(patch => Object.entries(patch).every(([key, value]) =>
    JSON.stringify(window.__customLobbyQA.collection.customBattlePreset[key]) === JSON.stringify(value)), expected);
  return presetOf(page);
};
const fontsOf = root => root.locator('.custom-lobby-header h2, .custom-lobby-header p, .custom-lobby-steps button, .custom-lobby-summary strong').evaluateAll(nodes => nodes.map(node => parseFloat(getComputedStyle(node).fontSize)));
const inspectLayout = async (root, viewport) => {
  const geometry = await root.evaluate(node => {
    const bounds = node.getBoundingClientRect();
    const controls = [...node.querySelectorAll('button, input:not([type="checkbox"]), select')]
      .filter(control => control.getClientRects().length)
      .map(control => { const r = control.getBoundingClientRect(); return { label: control.getAttribute('aria-label') || control.textContent.slice(0, 80), x: r.x, right: r.right, width: r.width, height: r.height }; });
    const areas = [...node.querySelectorAll('.custom-lobby-panel, .custom-lobby-teams, .custom-hero-grid, .custom-threat-picker, .catalog-pagination, .custom-lobby-footer')]
      .filter(area => area.getClientRects().length)
      .map(area => ({ name: area.className, width: area.clientWidth, scroll: area.scrollWidth }));
    return { x: bounds.x, right: bounds.right, width: node.clientWidth, scroll: node.scrollWidth, controls, areas };
  });
  assert.ok(geometry.x >= 31 && geometry.right <= viewport.width - 31, 'lobby escaped the 32px workspace inset');
  assert.ok(geometry.scroll <= geometry.width + 1, 'lobby requires horizontal scrolling');
  for (const area of geometry.areas) assert.ok(area.scroll <= area.width + 1, `${area.name} requires horizontal scrolling`);
  for (const control of geometry.controls) {
    assert.ok(control.width >= 43 && control.height >= 43, `small control ${JSON.stringify(control)}`);
    assert.ok(control.x >= 31 && control.right <= viewport.width - 31, `control escaped viewport ${JSON.stringify(control)}`);
  }
  return geometry;
};

try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }, { width: 1365, height: 900 }]) for (const lang of ['fr', 'en']) {
    const name = `${viewport.width}x${viewport.height}-${lang}`;
    const fr = lang === 'fr';
    const context = await browser.newContext({ viewport, reducedMotion: 'reduce' });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    const errors = [], missing = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => { if (response.status() >= 400) missing.push(`${response.status()} ${response.url()}`); });
    await context.route('http://multiverse.test/**', async route => {
      const file = resolve(fixture, '.' + new URL(route.request().url()).pathname);
      const rel = relative(fixture, file);
      if (rel === '..' || rel.startsWith('..' + sep)) return route.fulfill({ status: 403, body: 'Outside fixture' });
      try { await route.fulfill({ body: await readFile(file), contentType: ({ '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' })[extname(file)] || 'application/octet-stream' }); }
      catch { await route.fulfill({ status: 404, body: 'Missing fixture resource' }); }
    });
    await context.route(/https:\/\/fonts\.(googleapis|gstatic)\.com\//, route => route.abort());
    await page.addInitScript(({ displayKey, audioKey }) => {
      localStorage.setItem(displayKey, JSON.stringify({ version: 1, textScale: 1, hudScale: 1.4, safeArea: 32, contrast: 'high', motion: 'reduced' }));
      localStorage.setItem(audioKey, JSON.stringify({ musicVolume: 0, sfxVolume: 0, muted: true }));
    }, { displayKey: DISPLAY_PREFERENCES_KEY, audioKey: AUDIO_PREFERENCES_KEY });
    const record = { name, viewport, lang, status: 'running', limitations: 'Synthetic heroes, drawing and two battle children; real lobby, enemy catalog, rules, settings, input and handoff callbacks.' };
    results.push(record);
    try {
      await page.goto(`http://multiverse.test/scripts/fixtures/custom-battle-lobby.html?lang=${lang}`);
      const root = page.getByTestId('custom-battle-mode');
      await root.waitFor();
      await page.waitForFunction(() => window.__customLobbyQA.collection?.customBattlePreset?.playerTeamIds.length === 1);
      const baseFonts = await fontsOf(root);
      await page.locator('.game-system-trigger').click();
      await page.getByLabel(fr ? 'Taille du texte' : 'Text size').focus();
      await page.keyboard.press('End');
      await page.waitForFunction(() => getComputedStyle(document.documentElement).fontSize === '24px');
      await page.keyboard.press('Escape');
      await page.getByRole('dialog').waitFor({ state: 'detached' });
      await page.waitForFunction(() => !document.getElementById('root').inert);
      const largeFonts = await fontsOf(root);
      record.textScale = { before: baseFonts, after: largeFonts };
      baseFonts.forEach((font, index) => assert.ok(Math.abs(largeFonts[index] / font - 1.5) < .01, `text scale ignored: ${font} -> ${largeFonts[index]}`));
      record.modeLayout = await inspectLayout(root, viewport);

      const tabs = root.getByRole('tab');
      const panel = root.getByRole('tabpanel');
      assert.equal(await tabs.count(), 4);
      assert.equal(await root.locator('[role="tab"][tabindex="0"]').count(), 1);
      await tabs.nth(0).focus();
      for (const [key, expected] of [['ArrowLeft', 3], ['ArrowRight', 0], ['End', 3], ['Home', 0], ['ArrowRight', 1]]) {
        await page.keyboard.press(key);
        await page.waitForFunction(index => document.querySelectorAll('.custom-lobby-steps button')[index].getAttribute('aria-selected') === 'true', expected);
        await focused(tabs.nth(expected));
      }
      const next = root.getByRole('button', { name: fr ? 'SUIVANT' : 'NEXT', exact: true });
      const previous = root.getByRole('button', { name: fr ? 'PRÉCÉDENT' : 'PREVIOUS', exact: true });
      for (const expected of [2, 3]) {
        await next.focus(); await page.keyboard.press('Enter');
        await focused(panel);
        assert.equal(await tabs.nth(expected).getAttribute('aria-selected'), 'true');
      }
      assert.equal(await next.count(), 0, 'the removed Next control cannot retain focus at the last step');
      await previous.focus(); await page.keyboard.press('Enter'); await focused(panel);
      await tabs.nth(1).click();

      const team = root.locator('.custom-team-picker').first();
      const search = team.getByRole('searchbox');
      assert.equal(await team.locator('.custom-hero-choice').count(), 24);
      await search.fill('eclaireuse');
      assert.equal(await team.locator('.custom-hero-choice').count(), 1);
      await team.locator('[data-hero-id="qa-lobby-31"]').click();
      await expectPreset(page, { playerTeamIds: ['qa-lobby-01', 'qa-lobby-31'] });
      await search.fill('');
      await team.getByRole('button', { name: fr ? 'Dernière page' : 'Last page', exact: true }).click();
      assert.equal(await team.locator('.custom-hero-choice').count(), 8);
      await team.locator('[data-hero-id="qa-lobby-32"]').click();
      await expectPreset(page, { playerTeamIds: ['qa-lobby-01', 'qa-lobby-31', 'qa-lobby-32'] });
      await team.locator('[data-hero-id="qa-lobby-30"]').focus();
      await page.keyboard.press('Enter');
      assert.deepEqual((await presetOf(page)).playerTeamIds, ['qa-lobby-01', 'qa-lobby-31', 'qa-lobby-32'], 'full squad rejects a fourth keyboard selection');
      await search.fill('no-such-hero');
      assert.equal(await team.locator('.custom-hero-choice').count(), 0);
      assert.equal(await team.locator('.custom-selected-roster button').count(), 3, 'filter does not hide the selected squad');
      await team.locator('.custom-selected-roster button').nth(1).click(); await focused(search);
      await expectPreset(page, { playerTeamIds: ['qa-lobby-01', 'qa-lobby-32'] });
      await search.fill('eclaireuse');
      await tabs.nth(2).click(); await tabs.nth(1).click();
      assert.equal(await search.inputValue(), 'eclaireuse', 'step changes keep local catalogue filters');
      record.teamLayout = await inspectLayout(root, viewport);
      await team.scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(evidence, `${name}-team.png`) });

      const threats = root.locator('.custom-threat-picker');
      const threatSearch = threats.getByRole('searchbox');
      const candidate = threats.getByLabel(fr ? 'Menace à ajouter' : 'Threat to add', { exact: true });
      const add = threats.getByRole('button', { name: fr ? 'AJOUTER' : 'ADD', exact: true });
      const beforeThreats = (await presetOf(page)).enemyIds;
      const choices = await page.evaluate(selected => window.__customLobbyQA.catalog.filter(entry => !selected.includes(entry.id)), beforeThreats);
      assert.ok(choices.length > 250);
      const first = choices[20], replacement = choices[choices.length - 1];
      await threatSearch.fill(first.id); await candidate.selectOption(first.id);
      await threatSearch.fill(replacement.id);
      assert.equal(await candidate.inputValue(), replacement.id);
      await add.click(); await focused(threatSearch);
      await expectPreset(page, { enemyIds: [...beforeThreats, replacement.id] });
      const afterReplacement = (await presetOf(page)).enemyIds;
      assert.deepEqual(afterReplacement, [...beforeThreats, replacement.id], 'only the visible replacement is added');
      assert.equal(afterReplacement.includes(first.id), false, 'stale selected option is not added');
      await threatSearch.fill('no-such-threat');
      assert.equal(await add.isDisabled(), true);
      assert.equal(await candidate.isDisabled(), true);
      assert.deepEqual((await presetOf(page)).enemyIds, afterReplacement);
      await threatSearch.fill('');
      const additional = await candidate.inputValue();
      await add.click();
      await expectPreset(page, { enemyIds: [...afterReplacement, additional] });
      assert.equal(await add.isDisabled(), true, 'three-threat limit is enforced in RPG');
      assert.deepEqual((await presetOf(page)).enemyIds, [...afterReplacement, additional]);
      await threats.locator('.custom-roster-token').filter({ hasText: replacement.name }).click(); await focused(threatSearch);
      await expectPreset(page, { enemyIds: [...beforeThreats, additional] });
      record.threatSelection = { original: beforeThreats, stale: first.id, replacement: replacement.id, final: (await presetOf(page)).enemyIds };
      record.threatLayout = await inspectLayout(root, viewport);

      await tabs.nth(2).click();
      const field = label => root.locator('label').filter({ has: page.getByText(label, { exact: true }) }).locator('select');
      await field('STAGE').selectOption('qa-archive');
      await expectPreset(page, { stageArchiveId: 'qa-archive' });
      record.handoffs = [];
      const expectedSettings = { stageArchiveId: 'qa-archive' };
      for (const [mode, index] of [['Tactics', 1], ['Smash', 2], ['Fighter', 3], ['RPG', 0]]) {
        await tabs.nth(0).click(); await root.locator('.custom-mode-options button').nth(index).click();
        Object.assign(expectedSettings, { mode }, mode === 'Smash' ? { hazards: true } : {});
        await expectPreset(page, expectedSettings);
        await tabs.nth(3).click();
        if (mode === 'Smash') {
          const variant = field(fr ? 'VARIANTE' : 'VARIANT');
          const intensity = field(fr ? 'INTENSITE' : 'INTENSITY');
          await variant.selectOption('competitive');
          Object.assign(expectedSettings, { stageVariant: 'competitive', stageEventIntensity: 'off' });
          await expectPreset(page, expectedSettings);
          assert.equal(await intensity.isDisabled(), true); assert.equal(await intensity.inputValue(), 'off');
          await variant.selectOption('lore');
          Object.assign(expectedSettings, { stageVariant: 'lore' });
          await expectPreset(page, expectedSettings);
          await intensity.selectOption('light');
          Object.assign(expectedSettings, { stageEventIntensity: 'light' });
          await expectPreset(page, expectedSettings);
          await field(fr ? 'DIFFICULTE CPU' : 'CPU DIFFICULTY').selectOption('training');
          Object.assign(expectedSettings, { difficulty: 'training' });
          await expectPreset(page, expectedSettings);
          await root.getByLabel(fr ? 'Ignorer automatiquement en entrainement' : 'Skip automatically in training', { exact: true }).check();
          Object.assign(expectedSettings, { skipPreMatchInTraining: true });
          await expectPreset(page, expectedSettings);
        }
        if (mode === 'Fighter') {
          await tabs.nth(0).click(); await root.locator('.custom-opponent-options button').nth(1).click();
          Object.assign(expectedSettings, { opponentControl: 'p2', difficulty: 'standard', skipPreMatchInTraining: false });
          await expectPreset(page, expectedSettings);
          await tabs.nth(1).click();
          assert.equal(await root.locator('.custom-team-picker').count(), 2, 'fighter keeps two independently selectable squads');
          await tabs.nth(3).click();
          assert.equal(await field(fr ? 'DIFFICULTE CPU' : 'CPU DIFFICULTY').isDisabled(), true);
        }
        // The collection is published by effects after the local controls
        // update. Wait for every requested value before taking the full snapshot.
        const prepared = await expectPreset(page, expectedSettings);
        const launch = root.locator('.custom-lobby-actions button').last();
        await launch.focus(); await page.keyboard.press('Enter');
        await page.getByTestId('battle-handoff').waitFor();
        await page.waitForFunction(expected => window.__customLobbyQA.handoff?.mode === expected, mode);
        const handoff = await page.evaluate(() => window.__customLobbyQA.handoff);
        if (mode === 'Fighter') {
          assert.deepEqual(handoff.config.playerTeamIds, prepared.playerTeamIds);
          assert.deepEqual(handoff.config.opponentTeamIds, prepared.opponentTeamIds);
          assert.equal(handoff.config.archiveId, 'qa-archive');
          assert.equal(handoff.config.opponentControl, 'p2');
        } else {
          assert.deepEqual(handoff.team, prepared.playerTeamIds);
          assert.equal(handoff.custom.opponentControl, prepared.opponentControl);
          assert.equal(handoff.stage.universe, 'Nexus de Convergence');
          if (mode === 'Smash') {
            assert.equal(handoff.custom.stageVariant, 'lore');
            assert.equal(handoff.custom.stageEventIntensity, 'light');
            assert.equal(handoff.custom.skipPreMatchInTraining, true);
          }
        }
        record.handoffs.push({ mode, prepared, handoff });
        await page.getByRole('button', { name: 'Return to preparation', exact: true }).click();
        await root.waitFor(); await focused(root.locator('.custom-lobby-actions button').last());
        assert.deepEqual(await presetOf(page), prepared, 'return preserves the complete preparation');
      }
      assert.equal(await page.evaluate(() => window.__customLobbyQA.starts), 4);
      assert.equal(await page.evaluate(() => window.__customLobbyQA.reports.length), 4);
      record.rulesLayout = await inspectLayout(root, viewport);
      await panel.scrollIntoViewIfNeeded();
      await page.screenshot({ path: resolve(evidence, `${name}-rules.png`) });
      const saved = await presetOf(page);
      await page.getByText('QA controls', { exact: true }).click();
      await page.getByRole('button', { name: 'Unmount lobby', exact: true }).click();
      await root.waitFor({ state: 'detached' });
      await page.getByRole('button', { name: 'Remount lobby', exact: true }).click();
      await root.waitFor();
      assert.deepEqual(await presetOf(page), saved, 'parent collection restores the complete preset after remount');
      assert.deepEqual(errors, []); assert.deepEqual(missing, []);
      record.status = 'passed';
    } catch (error) {
      record.status = 'failed'; record.error = error.stack || error.message; record.errors = errors; record.missing = missing;
      await page.screenshot({ path: resolve(evidence, `${name}-failure.png`), fullPage: true }).catch(() => {});
    } finally {
      await writeFile(resolve(evidence, 'results.json'), JSON.stringify({ browser: browser.version(), results }, null, 2));
      await context.close();
    }
  }
  const passed = results.filter(record => record.status === 'passed').length;
  console.log(`${passed}/${results.length} custom battle lobby browser cases passed`);
  assert.equal(passed, results.length, 'Custom battle lobby browser failures; see results.json for every viewport and locale');
} finally { await browser.close(); }
