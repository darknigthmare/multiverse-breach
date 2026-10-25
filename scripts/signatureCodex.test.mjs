import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
let vite, api, heroes, enemies, kits, Panel, CardDetails, lore;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  api = await vite.ssrLoadModule('/src/game/signatureCodex.js');
  ({ HEROES_DB: heroes } = await vite.ssrLoadModule('/src/game/heroes.js'));
  ({ ENEMIES_DB: enemies } = await vite.ssrLoadModule('/src/game/enemies.js'));
  ({ SIGNATURE_SOURCE_KITS: kits } = await vite.ssrLoadModule('/src/game/signatureSourceKits.js'));
  ({ default: Panel } = await vite.ssrLoadModule('/src/components/SignatureCodexPanel.jsx'));
  ({ default: CardDetails } = await vite.ssrLoadModule('/src/components/collection/CardSignatureDetails.jsx'));
  lore = await vite.ssrLoadModule('/src/game/loreDescriptions.js');
});
after(async () => vite?.close());
const byId = id => heroes.find(actor => actor.id === id);
const findSource = d => d.actorId ? byId(d.actorId)
  : [...(enemies[d.universe]?.monsters || []), ...(enemies[d.universe]?.bosses || []), enemies[d.universe]?.worldBoss]
    .filter(Boolean).find(actor => (actor.canonicalName || actor.name) === d.enemyName);
const card = (id = 'cloud_ff7') => ({ kind: 'character', rewardKind: 'hero', characterId: id,
  rewardId: id, universe: byId(id)?.universe, name: 'Presentation is not an identity' });
const freeze = value => { if (value && typeof value === 'object') { Object.values(value).forEach(freeze); Object.freeze(value); } return value; };
const render = (actor, lang = 'fr') => renderToStaticMarkup(React.createElement(Panel, { actor, lang }));

test('all explicit contracts have an immutable display view matching battle preparation', async t => {
  assert.equal(Object.values(kits).filter(kit => !kit.wave || kit.wave <= 5).length, 118);
  assert.equal(Object.values(kits).filter(kit => kit.wave === 6).length, 6);
  assert.equal(Object.keys(kits).length, 124);
  for (const d of Object.values(kits)) await t.test(d.key, () => {
    const source = findSource(d); assert.ok(source, d.key);
    const actor = freeze({ ...structuredClone(source), universe: d.universe, specialCharge: 42, atb: 17 });
    const before = JSON.stringify(actor);
    const view = api.getSignatureCodex(actor);
    assert.ok(view); assert.equal(view.name, d.name); assert.equal(view.key, d.key);
    assert.equal(view.effect, d.effect); assert.equal(view.hits, d.hits);
    assert.equal(view.projectile, d.projectile || null); assert.equal(view.summonAgent, d.summonAgent || null);
    assert.equal(view.protection, d.protection || null); assert.equal(view.durationTicks, d.durationTicks || null);
    assert.equal(view.canonicalFidelityApproved, false); assert.ok(Object.isFrozen(view));
    assert.equal(JSON.stringify(actor), before, 'reading the codex mutated its input');
  });
});
test('unknown, malformed and prototype-like identities never acquire a display contract', () => {
  for (const actor of [null, undefined, [], 1, 'Cloud', {}, { id: '__proto__' }, { id: 'constructor' }]) assert.equal(api.getSignatureCodex(actor), null);
  for (const patch of [{ universe: 'Wrong' }, { id: 'unknown' }, { nonCombat: true }, { combatEligible: false }, { canonCombatPresentation: true },
    { special: { name: 'Custom skill', dmg: 2 } }, { special: { ...byId('cloud_ff7').special, rpgProfile: {} } }]) {
    assert.equal(api.getSignatureCodex({ ...byId('cloud_ff7'), ...patch }), null);
  }
});
test('card identity requires an unambiguous hero reward ID and its exact universe', () => {
  assert.equal(api.resolveCardSignatureActor(card(), heroes), byId('cloud_ff7'));
  for (const patch of [{ kind: 'skin' }, { rewardKind: 'skin' }, { rewardId: 'tifa_ff7' }, { characterId: '' }, { universe: 'Halo' }]) {
    assert.equal(api.resolveCardSignatureActor({ ...card(), ...patch }, heroes), null);
  }
  assert.equal(api.resolveCardSignatureActor(card(), [byId('cloud_ff7'), byId('cloud_ff7')]), null);
  assert.equal(api.resolveCardSignatureActor(card(), [null, {}, byId('cloud_ff7')]), byId('cloud_ff7'));
  assert.equal(api.resolveCardSignatureActor(card(), null), null);
});
test('real portal-to-card conversion exposes the verified reward contract', async () => {
  const { createCardDefinitionFromPortalCandidate } = await vite.ssrLoadModule('/src/game/cards/cardCatalog.js');
  const source = byId('cloud_ff7');
  const { definition } = createCardDefinitionFromPortalCandidate({ id: 'hero:cloud_ff7', rewardId: source.id,
    kind: 'hero', universe: source.universe, name: { fr: source.name, en: source.name }, data: { hero: source } });
  assert.ok(definition); assert.equal(api.resolveCardSignatureActor(definition, heroes), source);
});
test('known legacy labels are replaced without rewriting biography or other powers', () => {
  const view = api.getSignatureCodex(byId('cloud_ff7'));
  const text = `Biographie. ${view.legacyName}. Autre technique: Octaslash. ${view.legacyName}`;
  assert.equal(api.synchronizeSignatureText(text, view), 'Biographie. Omnislash. Autre technique: Octaslash. Omnislash');
  assert.equal(api.synchronizeSignatureText(text, null), text);
  assert.equal(api.synchronizeSignatureText(null, view), '');
});
test('action objects and localized strings produce text, never an object React child', () => {
  assert.equal(api.signatureText({ name: 'Tentacle sweep' }, 'fr'), 'Tentacle sweep');
  assert.equal(api.signatureText({ fr: 'Français', en: 'English' }, 'en'), 'English');
  assert.equal(api.signatureText({ fr: {}, en: 'English' }, 'fr'), 'English');
  for (const value of [null, [], { name: {} }, 8]) assert.equal(api.signatureText(value, 'fr', 'Fallback'), 'Fallback');
  assert.equal(api.signatureText({}, 'fr', {}), '');
});
test('reference links reject script URLs, credentials and malformed values', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,test', 'http://example.com', 'https://user:secret@example.com', '/relative', null, {}]) assert.equal(api.safeSignatureReference(value), null);
  assert.equal(api.safeSignatureReference('https://example.com/reference'), 'https://example.com/reference');
});
for (const lang of ['fr', 'en']) test(`${lang}: semantic descriptions distinguish spirits, disc, support and healing`, () => {
  assert.match(render(byId('hexen_parias'), lang), lang === 'fr' ? /Quatre spectres autonomes/ : /Four autonomous spirits/);
  assert.match(render(byId('city_hunter'), lang), lang === 'fr' ? /trajectoire réelle en mêlée/ : /Physical disc in melee/);
  assert.match(render(byId('team_fortress_2_medic'), lang), /8 (?:secondes|active seconds)/);
  assert.match(render(byId('aerith_ff7'), lang), lang === 'fr' ? /ne purifie pas et ne ressuscite pas/ : /does not cleanse or revive/);
  const html = render(byId('cloud_ff7'), lang);
  assert.match(html, /Omnislash/); assert.match(html, /15/); assert.match(html, /Tactics/);
  assert.match(html, /noopener noreferrer/); assert.doesNotMatch(html, /\[object Object\]/);
});
test('unsupported card and skin lore remains verbatim without offering a wrong incarnation', () => {
  const biography = 'Original text with <script>markup</script>';
  const html = renderToStaticMarkup(React.createElement(CardDetails, { definition: { ...card(), rewardKind: 'skin' }, lore: biography, lang: 'fr' }));
  assert.doesNotMatch(html, /data-signature-codex/); assert.match(html, /&lt;script&gt;/);
});
test('collection lore and the expanded panel agree on the prepared action', () => {
  const text = 'Cloud Strife Origin Burst. Biography remains.';
  const html = renderToStaticMarkup(React.createElement(CardDetails, { definition: card(), lore: text, lang: 'en' }));
  assert.match(html, /Omnislash\. Biography remains/); assert.doesNotMatch(html, /Origin Burst/);
  assert.match(html, /Integrated combat ability/);
});
test('booster display and search use copies without changing reward odds or identity', () => {
  const hero = byId('cloud_ff7');
  const candidate = freeze({ id: 'hero:cloud_ff7', rewardId: hero.id, kind: 'hero', universe: hero.universe,
    name: { fr: hero.name, en: hero.name }, desc: { fr: 'Texte original', en: 'Original text' }, rarity: { weight: 9 }, data: { hero: structuredClone(hero) } });
  const before = JSON.stringify(candidate); const [searchable] = api.withSignatureSearchText([candidate]);
  assert.equal(searchable.id, candidate.id); assert.equal(searchable.rewardId, candidate.rewardId);
  assert.equal(searchable.rarity, candidate.rarity); assert.equal(searchable.data, candidate.data);
  assert.match(searchable.desc.fr, /Texte original Omnislash/); assert.match(searchable.desc.en, /Original text Omnislash/);
  assert.equal(JSON.stringify(candidate), before);
  for (const patch of [{ kind: 'skin' }, { universe: 'Halo' }, { rewardId: 'someone_else' }]) assert.equal(api.getRewardSignatureCodex({ ...candidate, ...patch }), null);
});
test('booster search can find an integrated action with the existing pagination helper', async () => {
  const { getRewardCatalogPage } = await vite.ssrLoadModule('/src/game/portalCatalogView.js');
  const a = byId('cloud_ff7');const rewards = api.withSignatureSearchText([{id:'hero:cloud_ff7',rewardId:a.id,kind:'hero',universe:a.universe,name:a.name,data:{hero:a}}]);
  const page = getRewardCatalogPage(rewards,{query:'Omnislash'});assert.equal(page.total,1);assert.equal(page.items[0].rewardId,a.id);
});
test('enemy archive displays the source skill, without writing into the catalog', () => {
  const enemy = enemies['Resident Evil'].bosses.find(e => e.name === 'Nemesis T-Type');
  const before = JSON.stringify(enemy);
  const text = lore.getEnemyLoreDescription({ enemy, universe: 'Resident Evil', lang: 'fr' });
  assert.match(text, /Nemesis Tentacle Sweep/); assert.doesNotMatch(text, /Tentacle Bind Slam|\[object Object\]/);
  assert.match(text, /Tactics/);assert.equal(JSON.stringify(enemy),before);
});
test('an unregistered enemy keeps its custom action object label without an invented source profile', () => {
  const text = lore.getEnemyLoreDescription({ enemy: { name: 'Test unit', special: { name: 'Authored custom move' } }, universe: 'Nexus de Convergence', lang: 'en' });
  assert.match(text, /Authored custom move/);assert.doesNotMatch(text, /Signature available/);
  assert.equal(lore.getEnemyLoreDescription(null),'');
});
