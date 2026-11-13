import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { getBoosterFreeDrawRates } from '../src/game/portalBoosterEngine.js';
import { denseBanner, denseCandidates, denseDetail, denseKindLabels, denseKindOrder, denseOwned, denseRarities } from './fixtures/portalDenseCatalogData.mjs';

let vite, Dossier, Pager;
before(async () => {
  vite = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: Dossier } = await vite.ssrLoadModule('/src/components/PortalBoosterDossier.jsx?dense-dossier-tests'));
  ({ default: Pager } = await vite.ssrLoadModule('/src/components/PortalCatalogPager.jsx?dense-pager-tests'));
});
after(async () => { await vite?.close(); });

const dossier = (props = {}) => renderToStaticMarkup(React.createElement(Dossier, {
  banner: denseBanner, candidates: denseCandidates, lang: 'fr', available: true, selected: false,
  duplicateStreak: 3, pityLimit: 6, isCandidateOwned: denseOwned, kindLabels: denseKindLabels,
  kindOrder: denseKindOrder, rarities: denseRarities, Artwork: () => null, getRewardDetail: denseDetail,
  onSelect: () => assert.fail('Rendering a dossier must never select a booster'),
  onClose: () => assert.fail('Rendering a dossier must never navigate away'), ...props
}));
const descendants = (node, type) => React.Children.toArray(node).flatMap(child => React.isValidElement(child)
  ? [...(child.type === type ? [child] : []), ...descendants(child.props.children, type)]
  : []);
const pagerProps = { lang: 'fr', label: 'Cartes', controlsId: 'qa-cards', page: 0, pageCount: 5, start: 1, end: 12, total: 53, pageSize: 12, onPageChange: () => {}, onPageSizeChange: () => {} };

test('dense dossiers keep the full count, owned count, guarantees and missing-card compass visible in both languages', () => {
  for (const lang of ['fr', 'en']) {
    const html = dossier({ lang });
    assert.ok(html.includes(denseBanner.label[lang]));
    assert.ok(html.includes(lang === 'fr' ? 'CATALOGUE COMPLET DES CARTES (53)' : 'COMPLETE CARD CATALOG (53)'));
    assert.ok(html.includes(lang === 'fr' ? '17/53 cartes obtenues' : '17/53 owned cards'));
    assert.ok(html.includes(lang === 'fr' ? '5 cartes / 1 personnage / 1 Rare ou mieux hors personnage.' : '5 cards / 1 character / 1 Rare or better non-character reward.'));
    assert.ok(html.includes(lang === 'fr' ? 'Compas Nexus dans 3' : 'Nexus Compass in 3'));
    assert.ok(html.includes(lang === 'fr' ? '70 % du prix payé' : '70% of the paid price'));
    assert.match(html, /role="region" aria-label="[^"]+"/u);
    assert.match(html, /tabindex="0" role="region"/u);
  }
});

test('the first dossier page limits mounted cards but preserves exact full-pool probabilities and descriptions', () => {
  const original = structuredClone(denseCandidates);
  const rates = getBoosterFreeDrawRates(denseCandidates);
  const html = dossier();
  const articles = [...html.matchAll(/<article[^>]+data-dossier-card="([^"]+)"[^>]*>(.*?)<\/article>/gsu)];
  assert.equal(articles.length, 12);
  assert.equal(new Set(articles.map(match => match[1])).size, 12);
  for (const [, id, article] of articles) {
    const card = denseCandidates.find(candidate => candidate.id === id);
    assert.ok(card, 'Every displayed card must belong to the supplied catalogue');
    assert.ok(article.includes(card.name.fr));
    assert.ok(article.includes(card.desc.fr));
    const probability = (rates.get(id) * 100).toLocaleString('fr', { maximumFractionDigits: 4 });
    assert.ok(article.includes(`${probability}% par slot libre`), `${id}: probability must use all 53 cards, not the current page`);
  }
  assert.deepEqual(denseCandidates, original, 'Spotlight ordering must not mutate reward identities/order/weights');
});

test('off-rotation dossier exposes every consultation path while its selection stays disabled', () => {
  const off = dossier({ available: false, lang: 'en' });
  assert.match(off, /OFF ROTATION · PREVIEW/u);
  assert.match(off, /<button[^>]*disabled=""[^>]*data-select-previewed-booster="qa:reading-room"/u);
  assert.ok(off.includes('EVERY CARD (53)'));
  assert.ok(off.includes('GUARANTEES AND SELECTION'));
  const available = dossier({ available: true, lang: 'en' });
  const selection = available.match(/<button[^>]*data-select-previewed-booster="qa:reading-room"[^>]*>/u)?.[0];
  assert.ok(selection); assert.doesNotMatch(selection, /disabled/u);
  assert.ok(available.includes('SELECT WITHOUT BUYING'));
});

test('pagination controls expose only bounded destinations at first, middle, last and empty pages', () => {
  for (const [page, pageCount, expected] of [[0, 5, [true, true, false, false]], [2, 5, [false, false, false, false]], [4, 5, [false, false, true, true]], [0, 1, [true, true, true, true]]]) {
    const chosen = [];
    const node = Pager({ ...pagerProps, page, pageCount, onPageChange: value => chosen.push(value) });
    const controls = descendants(node, 'button');
    assert.deepEqual(controls.map(control => control.props.disabled), expected);
    controls.filter(control => !control.props.disabled).forEach(control => {
      assert.equal(control.props['aria-controls'], 'qa-cards');
      assert.ok(control.props['aria-label']);
      control.props.onClick();
    });
    for (const target of chosen) assert.ok(target >= 0 && target < pageCount && target !== page);
  }
});

test('changing page size delivers numeric values and the lower pager does not duplicate the live announcement or size selector', () => {
  const chosen = [];
  const top = Pager({ ...pagerProps, onPageSizeChange: value => chosen.push(value) });
  const selector = descendants(top, 'select')[0];
  assert.deepEqual(descendants(selector, 'option').map(option => option.props.value), [12, 24, 48]);
  for (const value of ['12', '24', '48']) selector.props.onChange({ target: { value } });
  assert.deepEqual(chosen, [12, 24, 48]);
  const bottom = Pager({ ...pagerProps, position: 'bottom' });
  assert.equal(descendants(bottom, 'select').length, 0);
  assert.equal(descendants(top, 'p')[0].props['aria-live'], 'polite');
  assert.equal(descendants(bottom, 'p')[0].props['aria-live'], 'off');
});
