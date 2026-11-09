import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { readFileSync } from 'node:fs';
let vite;
before(async () => { vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } }); });
after(async () => { await vite?.close(); });

test('the actual application renders its title with inaccessible browser persistence', async () => {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx');
  const html = renderToStaticMarkup(React.createElement(App));
  assert.match(html, /role="alert"/);
  assert.match(html, /Sauvegarde locale impossible/);
  assert.match(html, /Exporter cette Trace/);
  assert.match(html, /NEXUS|MULTIVERSE|MULTIVERSELLE/);
});

for (const lang of ['fr', 'en']) {
  test(`account controls expose ordinary sign-in and save labels in ${lang}`, async () => {
    const { default: Panel } = await vite.ssrLoadModule('/src/components/AuthPanel.jsx');
    const guest = renderToStaticMarkup(React.createElement(Panel, { lang, variant: 'embedded' }));
    const signed = renderToStaticMarkup(React.createElement(Panel, { lang, variant: 'embedded',
      account: { user: { id: 'fake-audit-user', email: 'audit@example.test' } }, cloudStatus: 'Local progress preserved' }));
    assert.ok(guest.includes(lang === 'fr' ? 'Se connecter' : 'Sign in'));
    assert.ok(guest.includes(lang === 'fr' ? 'Creer un compte' : 'Create account'));
    assert.ok(signed.includes(lang === 'fr' ? 'Sauvegarder' : 'Save to cloud'));
    assert.ok(signed.includes(lang === 'fr' ? 'Se deconnecter' : 'Sign out'));
    assert.match(signed, /role="status"/);
  });
}

test('backup export, unsafe storage guarding and shared period reset are wired in App', () => {
  const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  assert.match(source, /onExportBackup=\{exportPreservedSave\}/);
  assert.match(source, /backupLocalSave\(LEGACY_KART_CAREER_KEY\)\.ok/);
  assert.doesNotMatch(source, /window\.localStorage\.(setItem|removeItem)/);
  assert.match(source, /const localStatus = localSaveGuardRef\.current\?\.check\(\);[\s\S]*const latestPayload/);
  assert.equal((source.match(/\.\.\.rollProgressCalendar\(prev, \{ dayKey, weekKey \}\)/g) || []).length, 3);
});
