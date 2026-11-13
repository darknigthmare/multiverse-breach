import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from './fixtures/ssrTestServer.mjs';
import { createPiratesCurseEncounter, getPiratesCurseEncounterSnapshot } from '../src/game/canonPiratesCurseEncounter.js';
import { extractStaticPublicAssetPaths } from './dlcCommonUiAssets.mjs';
import { readDlcPublicationEntries } from './prepareDlcAssets.mjs';

const stage = {
  id: 269, mode: 'RPG', universe: 'Pirates of the Caribbean', enemyRosterExclusive: true,
  canonicalBossName: 'Hector Barbossa',
  incarnation: 'Pirates of the Caribbean: The Curse of the Black Pearl (2003) - Isla de Muerta'
};
const hero = { currentHp: 120, atb: 100, state: 'idle' };
const enemies = [{ id: 'enemy:barbossa', isBoss: true, canonicalName: 'Hector Barbossa' }];
const snapshot = encounter => getPiratesCurseEncounterSnapshot(encounter, enemies, true);
let vite, PiratesCursePanel;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  ({ default: PiratesCursePanel } = await vite.ssrLoadModule('/src/components/PiratesCursePanel.jsx'));
});
after(async () => { await vite?.close(); });
const render = overrides => renderToStaticMarkup(React.createElement(PiratesCursePanel, {
  stage, hero, encounter: snapshot(createPiratesCurseEncounter(stage)), ...overrides
}));
const elements = (tree, type) => {
  if (!tree || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(child => elements(child, type));
  return [...(tree.type === type ? [tree] : []), ...elements(tree.props?.children, type)];
};

test('only the exact guarded 2003 RPG encounter gets the decorative 64px medallion', () => {
  const html = render();
  assert.match(html, /<img[^>]*src="\/sprites\/source-scenes\/curse-of-the-black-pearl-2003\/aztec-medallion-front-20261113\.png"[^>]*width="64" height="64" alt="" aria-hidden="true"/);
  assert.match(html, /Médaillon aztèque/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /880\/882/);
  for (const other of [undefined, null, {}, ...Object.entries({
    id: 270, mode: 'Tactics', universe: 'another universe', enemyRosterExclusive: false,
    canonicalBossName: 'Davy Jones', incarnation: 'Pirates of the Caribbean: At World’s End (2007)',
    customBattle: true, isCustomBattle: true, isCustom: true
  }).map(([key, value]) => ({ ...stage, [key]: value }))]) {
    const fallback = render({ stage: other });
    assert.doesNotMatch(fallback, /<img|pirates-curse-object-name/);
    assert.match(fallback, /880\/882/, 'native counter survives without illustration');
  }
  const encounter = snapshot(createPiratesCurseEncounter(stage));
  assert.doesNotMatch(render({ encounter: { ...encounter, totalPieces: 999 } }), /<img/);
  assert.equal(render({ encounter: null }), '');
});

test('the icon and its failure fallback do not change sequential commands or native ritual state', () => {
  const encounter = createPiratesCurseEncounter(stage), received = [];
  const renderTree = (current, extra = {}) => PiratesCursePanel({ stage, hero, encounter: snapshot(current), onCommand: action => received.push(action), ...extra });
  for (const [phase, expectedAction] of [['coins', 'collect-final-coins'], ['offerings', 'coordinate-will'], ['restore', 'restore-chest']]) {
    encounter.finalCoinsCollected = phase !== 'coins';
    encounter.willBloodReady = encounter.jackBloodReady = phase === 'restore';
    const before = structuredClone(encounter), tree = renderTree(encounter);
    elements(tree, 'button').forEach(button => button.props.onClick());
    assert.equal(received.at(-1), expectedAction);
    assert.deepEqual(encounter, before, 'render and command dispatch never mutate the encounter');
    const removedClasses = [];
    const fallback = { style: {}, parentElement: { classList: { remove: name => removedClasses.push(name) } } };
    elements(tree, 'img')[0].props.onError({ currentTarget: fallback });
    assert.equal(fallback.style.display, 'none');
    assert.deepEqual(removedClasses, ['pirates-curse-treasure-illustrated'], 'failed art releases the icon column for native text');
    assert.deepEqual(encounter, before, 'image failure leaves source state intact');
  }
  const beforeBlocked = received.length;
  for (const extra of [{ paused: true }, { targeting: true }, { hero: { ...hero, atb: 99 } }]) {
    elements(renderTree(encounter, extra), 'button').forEach(button => button.props.onClick());
  }
  assert.equal(received.length, beforeBlocked);
  encounter.curseActive = false; encounter.returnedPieces = 882;
  const html = render({ encounter: snapshot(encounter), lang: 'en' });
  assert.match(html, /Aztec medallion/);
  assert.match(html, /882\/882/);
  assert.equal(elements(renderTree(encounter), 'button').filter(button => !button.props.disabled).length, 0);
});

test('the runtime publication matches the inspected canonical DLC asset and its provenance hash', () => {
  const manifest = JSON.parse(readFileSync(new URL('../docs/assets/p0-p1-menu-continuation-2026-11-13/art/aztec-medallion/prop-manifest.json', import.meta.url)));
  const source = readFileSync(new URL(`../${manifest.asset.sourcePath}`, import.meta.url));
  const publication = readFileSync(new URL(`../public${manifest.asset.path}`, import.meta.url));
  assert.deepEqual(publication, source);
  assert.equal(source.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  assert.equal(source.readUInt32BE(16), 256); assert.equal(source.readUInt32BE(20), 256);
  assert.equal(source[25], 6);
  assert.equal(createHash('sha256').update(source).digest('hex'), manifest.asset.sha256);
  assert.equal(manifest.visualReview.canonicalFidelityApproved, false);
  const canvas = readFileSync(new URL('../src/components/GameCanvas.jsx', import.meta.url), 'utf8');
  assert.match(canvas, /<PiratesCursePanel\s[^>]*stage=\{stage\}/, 'the real caller forwards the stage identity');
});

test('the production publisher includes the medallion with unambiguous Pirates ownership', () => {
  const publicPath = '/sprites/source-scenes/curse-of-the-black-pearl-2003/aztec-medallion-front-20261113.png';
  const manifest = JSON.parse(readFileSync(new URL('../DLC/PiratesOfTheCaribbean/assets.json', import.meta.url)));
  const entries = manifest.assets.filter(entry => entry.publicPath === publicPath);
  assert.equal(entries.length, 1);
  assert.deepEqual(entries[0].basis, [
    'DLC/PiratesOfTheCaribbean/runtime/canonPiratesCurseEncounter.js',
    'canonical-dlc-directory:DLC/PiratesOfTheCaribbean'
  ]);
  const publication = readDlcPublicationEntries({ root: new URL('../', import.meta.url).pathname })
    .filter(entry => entry.publicPath === publicPath);
  assert.equal(publication.length, 1);
  assert.equal(publication[0].sourcePath, entries[0].sourcePath);
  const sourcePath = 'src/components/PiratesCursePanel.jsx';
  const source = readFileSync(new URL(`../${sourcePath}`, import.meta.url), 'utf8');
  assert.equal(extractStaticPublicAssetPaths({ sourcePath, source }).includes(publicPath), false,
    'the shared UI imports the DLC-owned path rather than reclassifying it as a Nexus literal');
});
