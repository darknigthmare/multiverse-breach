import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';
import { CG_CATALOG } from '../src/game/cg/cgCatalog.js';

let vite, CgGallery, CollectionHome, UniverseArchiveDialog, IntroSequence;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: CgGallery } = await vite.ssrLoadModule('/src/components/cg/CgGallery.jsx'));
  ({ default: CollectionHome } = await vite.ssrLoadModule('/src/components/collection/CollectionHome.jsx'));
  ({ default: UniverseArchiveDialog } = await vite.ssrLoadModule('/src/components/UniverseArchiveDialog.jsx'));
  ({ default: IntroSequence } = await vite.ssrLoadModule('/src/components/IntroSequence.jsx'));
});
after(async () => { await vite?.close(); });
const render = (Component, props, ...children) => renderToStaticMarkup(React.createElement(Component, props, ...children));

test('the gallery main stage uses an unlocked illustration without exposing locked full-size media', () => {
  const entry = CG_CATALOG.find(item => item.family === 'Canon');
  assert.ok(entry?.imagePath);
  const available = render(CgGallery, { entries: [entry], unlockedHeroes: [entry.unlock.heroId], lang: 'fr' });
  assert.ok(available.includes(entry.imagePath));
  assert.match(available, /cg-gallery__stage-open/);
  assert.match(available, /aria-pressed="true"/);
  assert.match(available, /cg-gallery__filter-drawer/);
  const locked = render(CgGallery, { entries: [entry], unlockedHeroes: [], lang: 'fr' });
  assert.ok(!locked.includes(entry.imagePath));
  assert.match(locked, /data-cg-unlocked="false"/);
});

test('the album remains one labelled dialog with all three views and explicitly scoped filters', () => {
  const html = render(CollectionHome, { lang: 'fr', definitions: [{ id: 'one', name: 'Une carte', universe: 'Nexus', kind: 'hero', rarityId: 'rare' }], cards: { one: { copies: 1 } } });
  assert.equal((html.match(/role="dialog"/g) || []).length, 1);
  assert.match(html, /aria-labelledby="tcg-album-title"/);
  for (const label of ['BIBLIOTHEQUE', 'CLASSEUR', 'HISTORIQUE', 'OBTENUES', 'FAVORIS']) assert.ok(html.includes(label));
  assert.ok(html.includes('La progression reste calculée sur le set complet'));
});

test('the universe reader preserves every supplied section inside one modal', () => {
  const html = render(UniverseArchiveDialog, { universe: 'Nexus', onClose() {} },
    React.createElement('h2', { id: 'universe-archive-title' }, 'Nexus'),
    React.createElement('p', {}, 'Texte source intégral'),
    React.createElement('button', { 'data-archive-close': true }, 'Fermer'));
  assert.equal((html.match(/role="dialog"/g) || []).length, 1);
  assert.match(html, /aria-modal="true"/);
  assert.ok(html.includes('Texte source intégral'));
  assert.match(html, /universe-archive-reader/);
});

test('creating an Anchor keeps local play primary and account controls in an optional section', () => {
  const html = render(IntroSequence, { phase: 'profile', lang: 'fr', playerProfile: { name: 'Test' }, account: null, cloudStatus: '', authProps: {} });
  assert.match(html, /<form class="intro-identity-panel"/);
  assert.match(html, /type="submit"/);
  assert.ok(html.includes('CONTINUER EN LOCAL'));
  assert.match(html, /<details class="intro-optional-account">/);
  assert.ok(html.includes('facultatif'));
  assert.ok(html.includes('Mirelle'));
  assert.ok(html.includes('Bastion'));
});
