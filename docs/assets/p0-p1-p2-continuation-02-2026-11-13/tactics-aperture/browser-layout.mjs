import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const folder = fileURLToPath(new URL('./browser/', import.meta.url));
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'] });
const rows = [];
try {
  for (const [width, height] of [[390, 640], [844, 390]]) for (const factor of [1, 1.5]) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = []; page.on('pageerror', e => errors.push(e.message));
    await page.goto('http://127.0.0.1:4199/scripts/fixtures/aperture-continuation.html', { waitUntil: 'networkidle' });
    await page.waitForFunction(() => window.__apertureAudit?.engine?.activeUnit);
    await page.evaluate(scale => document.documentElement.style.setProperty('--game-hud-scale', scale), String(factor));
    await page.waitForTimeout(120);
    const measured = await page.evaluate(() => {
      const menu = document.querySelector('.combat-terrain-overlay'), header = document.querySelector('.combat-hud-header');
      const dock = document.querySelector('.combat-hud-dock');
      const rect = e => { const r = e.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, height: r.height }; };
      const controls = [...header.querySelectorAll('button')].map(button => {
        const r = button.getBoundingClientRect(), x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
        if (x < 0 || x >= innerWidth || y < 0 || y >= innerHeight) return null;
        const clip = button.closest('.combat-hud-tools')?.getBoundingClientRect();
        if (clip && (x < clip.left || x >= clip.right)) return null;
        return { text: button.textContent, accessibleAtCenter: button.contains(document.elementFromPoint(x, y)) };
      }).filter(Boolean);
      return { open: menu.open, menu: rect(menu), header: rect(header), dock: rect(dock), controls,
        maxHeight: getComputedStyle(menu).maxHeight, scrollHeight: menu.scrollHeight, clientHeight: menu.clientHeight };
    });
    assert.equal(measured.open, true);
    assert.ok(measured.menu.top >= measured.header.bottom + 8, 'Open terrain menu covers the mission header');
    assert.ok(measured.menu.bottom <= measured.dock.top - 8, 'Open terrain menu covers HP or commands');
    assert.ok(measured.controls.length > 3);
    assert.ok(measured.controls.every(c => c.accessibleAtCenter), JSON.stringify(measured.controls));
    const focusedControls = [];
    const headerButtons = page.locator('.combat-hud-header button:visible');
    for (let i = 0; i < await headerButtons.count(); i++) {
      await headerButtons.nth(i).scrollIntoViewIfNeeded();
      await headerButtons.nth(i).focus();
      focusedControls.push(await headerButtons.nth(i).evaluate(button => {
        const r = button.getBoundingClientRect(), x = (r.left + r.right) / 2, y = (r.top + r.bottom) / 2;
        const top = document.elementFromPoint(x, y);
        return { text: button.textContent, accessibleAtCenter: button.contains(top),
          topElement: top?.tagName, topText: top?.textContent?.slice(0, 80) };
      }));
    }
    assert.ok(focusedControls.every(c => c.accessibleAtCenter), JSON.stringify(focusedControls));
    assert.ok(measured.scrollHeight > measured.clientHeight, 'Compact terrain menu must remain scrollable');
    assert.deepEqual(errors, []);
    await page.screenshot({ path: folder + `aperture-${width}x${height}-open-${factor}.png` });
    rows.push({ width, height, factor, ...measured, focusedControls, errors }); await page.close();
  }
  fs.writeFileSync(folder + 'layout-result.json', JSON.stringify({ status: 'passed', cases: rows.length,
    scope: 'Actual GameCanvas open terrain menu, compact portrait/landscape and HUD scaling. Not a full campaign or a complete accessibility certification.', rows }, null, 2) + '\n');
  console.log(JSON.stringify({ status: 'passed', cases: rows.length }));
} catch (error) {
  fs.writeFileSync(folder + 'layout-failed.json', JSON.stringify({ error: String(error), rows }, null, 2) + '\n');
  throw error;
} finally { await browser.close(); }
