import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildBoosterCatalogGroups, getRewardCatalogPage, normalizePortalSearch } from '../src/game/portalCatalogView.js';
import { OC_DLC_UNIVERSE_KEYS } from '../src/game/ocDlcPacks.js';

const heroes = ['First', 'Second', 'Third', 'Fourth', 'Éléonore Hidden'].map((name, index) => ({ id: index, name, universe: 'Franchise' }));
const banners = [
  { id: 'nexus', scope: 'core', universe: 'Nexus de Convergence', label: { fr: 'Socle', en: 'Core' }, match: () => false },
  { id: 'original', scope: 'universe', universe: 'Original World', label: { fr: 'Monde OC', en: 'Original World' }, match: () => false },
  { id: 'franchise', scope: 'universe', universe: 'Franchise', label: { fr: 'Booster Franchise', en: 'Franchise Booster' }, searchText: 'First Second Third', match: hero => hero.universe === 'Franchise' }
];
const group = query => buildBoosterCatalogGroups({ banners, heroes, originalUniverses: new Set(['Original World']), query });

test('original universes and Nexus core are separated from franchise boosters', () => {
  const result = group('');
  assert.deepEqual(result.map(({ id, banners: values }) => [id, values.map(value => value.id)]), [
    ['original', ['nexus', 'original']], ['franchise', ['franchise']]
  ]);
});

test('all three standalone original universes belong to the OC drawer', async () => {
  const standalone = OC_DLC_UNIVERSE_KEYS.map(universe => ({ id: universe, universe, scope: 'universe', match: () => false }));
  const result = buildBoosterCatalogGroups({ banners: standalone, heroes: [], originalUniverses: new Set(OC_DLC_UNIVERSE_KEYS) });
  assert.equal(result[0].banners.length, 3);
  assert.equal(result[1].banners.length, 0);
  const source = await readFile(new URL('../src/components/PortalScreen.jsx', import.meta.url), 'utf8');
  assert.match(source, /\.\.\.OC_DLC_UNIVERSE_KEYS/u);
});

test('search includes every hero rather than only the first three teaser names', () => {
  assert.deepEqual(group('eleonore hidden')[1].banners.map(value => value.id), ['franchise']);
  assert.deepEqual(group('fourth')[1].banners.map(value => value.id), ['franchise']);
  assert.equal(group('missing').flatMap(value => value.banners).length, 0);
});

test('catalog search covers both localizations and normalizes accents without modifying source data', () => {
  assert.equal(normalizePortalSearch('  ÉLÉONORE  '), 'eleonore');
  assert.equal(group('core')[0].banners[0], banners[0]);
  assert.equal(group('monde oc')[0].banners[0], banners[1]);
  assert.equal(heroes.at(-1).name, 'Éléonore Hidden');
});

const rewards = Array.from({ length: 139 }, (_, index) => ({
  id: `card-${index}`,
  kind: index % 2 ? 'hero' : 'equipment',
  name: { fr: `Carte spéciale ${index}`, en: `Special card ${index}` },
  universe: index < 90 ? 'Nexus' : 'Franchise'
}));

test('all rewards are reachable exactly once over pages, including cards beyond the former 12-item cap', () => {
  const result = [];
  const first = getRewardCatalogPage(rewards);
  assert.equal(first.pageCount, 12);
  for (let page = 0; page < first.pageCount; page += 1) result.push(...getRewardCatalogPage(rewards, { page }).items);
  assert.deepEqual(result, rewards);
  assert.equal(new Set(result.map(reward => reward.id)).size, 139);
});

test('reward queries inspect the entire catalog before pagination and work in both languages', () => {
  assert.deepEqual(getRewardCatalogPage(rewards, { query: 'carte speciale 138' }).items.map(reward => reward.id), ['card-138']);
  assert.deepEqual(getRewardCatalogPage(rewards, { query: 'special card 138' }).items.map(reward => reward.id), ['card-138']);
  assert.equal(getRewardCatalogPage(rewards, { query: 'Franchise', kind: 'hero' }).total, 24);
});

test('filters clamp stale pages and report empty selections coherently', () => {
  const narrowed = getRewardCatalogPage(rewards, { query: 'special card 138', page: 8 });
  assert.equal(narrowed.page, 0);
  assert.equal(narrowed.start, 1);
  assert.equal(narrowed.end, 1);
  const empty = getRewardCatalogPage(rewards, { kind: 'nonexistent', page: 100 });
  assert.deepEqual(empty, { items: [], total: 0, page: 0, pageCount: 1, start: 0, end: 0 });
  assert.equal(getRewardCatalogPage(rewards, { page: -8 }).page, 0);
});

test('opening the dossier is separate from selecting or purchasing a booster', async () => {
  const source = await readFile(new URL('../src/components/PortalScreen.jsx', import.meta.url), 'utf8');
  assert.match(source, /onClick=\{\(\) => setDossierBannerId\(banner\.id\)\}/u);
  assert.match(source, /onClick=\{\(\) => setDossierBannerId\(activeBannerData\.id\)\}/u);
  assert.match(source, /onSelect=\{bannerId => \{\s*handleSelectBanner\(bannerId\);\s*closeDossier\(\);/u);
  assert.match(source, /onClick=\{handleOpenBooster\}/u);
  assert.match(source, /available=\{availableBannerIds\.has\(dossierBanner\.id\) && !openingLocked\}/u);
  assert.doesNotMatch(source, /REWARD_MANIFEST_LIMIT/u);
});

test('drawers open during global search and history starts closed', async () => {
  const source = await readFile(new URL('../src/components/PortalScreen.jsx', import.meta.url), 'utf8');
  assert.match(source, /open=\{Boolean\(normalizedPackQuery\) \|\| openPackGroups\[group\.id\]\}/u);
  assert.match(source, /showAllPacks \|\| normalizedPackQuery\s*\? catalogPortalBanners/u);
  const history = source.match(/<details className="booster-history-panel"[^>]*>/u)?.[0];
  assert.ok(history);
  assert.doesNotMatch(history, /\bopen\b/u);
});

test('dossier traps keyboard focus and restores outer focus/scroll without economic writes', async () => {
  const source = await readFile(new URL('../src/components/PortalBoosterDossier.jsx', import.meta.url), 'utf8');
  assert.match(source, /role="dialog" aria-modal="true"/u);
  assert.match(source, /event\.key === 'Escape'/u);
  assert.match(source, /event\.key !== 'Tab'/u);
  assert.match(source, /previousFocus\.focus\(\{ preventScroll: true \}\)/u);
  assert.match(source, /document\.body\.style\.overflow = previousOverflow/u);
  assert.match(source, /disabled=\{!available\}/u);
  assert.doesNotMatch(source, /setBreachShards|applyBoosterTransaction|createBoosterRewards/u);
});

test('paid rotation UI preserves the confirmation request for retries and blocks repeated submission', async () => {
  const source = await readFile(new URL('../src/components/PortalScreen.jsx', import.meta.url), 'utf8');
  const request = source.slice(source.indexOf('const requestRotationReroll'), source.indexOf('const confirmRotationReroll'));
  const confirm = source.slice(source.indexOf('const confirmRotationReroll'), source.indexOf('const rotationMessages'));
  assert.match(request, /requestId: crypto\.randomUUID\(\)/u);
  assert.match(confirm, /rotationPendingRef\.current = true/u);
  assert.match(confirm, /await onRerollRotation\(rotationConfirmation\)/u);
  assert.doesNotMatch(confirm, /randomUUID|setGold|setBreachShards|applyBoosterTransaction/u);
  assert.match(source, /gold >= ROTATION_REROLL_GOLD_COST/u);
  assert.match(source, /openingPhase === 'sealed'\s*&& !rotationPending/u);
  assert.match(source, /ANNULER SANS FRAIS/u);
});
