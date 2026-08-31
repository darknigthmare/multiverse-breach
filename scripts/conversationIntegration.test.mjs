import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createServer } from 'vite';

let vite;
before(async () => { vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } }); });
after(async () => { await vite?.close(); });

test('App and all changed runtime screens compile together', async () => {
  for (const module of ['App', 'components/GameCanvas', 'components/FighterMode', 'components/RaceMode', 'components/PortalScreen', 'components/IntroSequence']) {
    const loaded = await vite.ssrLoadModule(`/src/${module}.jsx`);
    assert.equal(typeof loaded.default, 'function', module);
  }
});

test('RPG targeting exposes selection, confirmation, cancellation and wait controls', async () => {
  const { default: Panel } = await vite.ssrLoadModule('/src/components/RpgTargetingPanel.jsx');
  const markup = renderToStaticMarkup(React.createElement(Panel, { lang: 'fr', wait: true, targeting: {
    side: 'player', actorName: 'Mirelle', abilityName: 'Patch de Trame', shape: 'single', valid: true,
    eligibleTargets: [{ id: 'ally', name: 'Bastion', hp: 10, maxHp: 100 }], selectedTargetIds: ['ally'], previewTargetIds: ['ally'], estimates: [{ id: 'ally', effect: 'heal', amount: 20, min: 20, max: 20 }]
  } }));
  for (const text of ['Confirmer les cibles', 'Annuler sans coût', 'Attendre pendant', 'Bastion', 'Soin']) assert.ok(markup.includes(text), text);
  assert.match(markup, /aria-pressed="true"/);
});

test('personalization is owned by Anchor record and never by booster acquisition', async () => {
  const portal = readFileSync(new URL('../src/components/PortalScreen.jsx', import.meta.url), 'utf8');
  const hub = readFileSync(new URL('../src/components/HubScreen.jsx', import.meta.url), 'utf8');
  assert.doesNotMatch(portal, /onChange=\{event => equipCustomCosmetic/);
  assert.match(hub, /<AnchorCustomizationPanel/);
  const { default: Panel } = await vite.ssrLoadModule('/src/components/AnchorCustomizationPanel.jsx');
  const markup = renderToStaticMarkup(React.createElement(Panel, { lang: 'fr', portalCollection: {}, setPortalCollection() {} }));
  assert.ok(markup.includes('Soutien de combat — effet de gameplay'));
  assert.ok(markup.includes('garage'));
});

test('OC prologue uses existing Nexus art for ARCA, Anchor and its first squad', () => {
  const source = readFileSync(new URL('../src/components/IntroSequence.jsx', import.meta.url), 'utf8');
  for (const [id, path] of [['arca-awakens', 'images/campaign-oc/chapter-01-atrium-v1.png'], ['anchor-signal', 'backgrounds/lore-stages/nexus-de-convergence/rpg.webp'], ['first-cell', 'backgrounds/lore-stages/nexus-de-convergence/tactics.webp']]) {
    const block = source.slice(source.indexOf(`id: '${id}'`), source.indexOf(`id: '${id}'`) + 200);
    assert.ok(block.includes(path));
    assert.ok(existsSync(new URL(`../public/${path}`, import.meta.url)));
  }
});

test('duel and race use shared fixed simulation, freeze hidden tabs and ignore typing shortcuts', () => {
  for (const name of ['FighterMode', 'RaceMode']) {
    const source = readFileSync(new URL(`../src/components/${name}.jsx`, import.meta.url), 'utf8');
    assert.match(source, /simulationClock\.advance\(now, \{ paused: sessionPausedRef\.current \|\| document\.hidden \}\)/);
    assert.match(source, /engine\.update\(COMBAT_STEP_MS \/ 1000\)/);
    assert.match(source, /event\.repeat \|\| \['INPUT', 'TEXTAREA', 'SELECT'\]/);
  }
});

test('rotation persistence completes before React publishes currency and selection', () => {
  const source = readFileSync(new URL('../src/App.jsx', import.meta.url), 'utf8');
  const transaction = source.slice(source.indexOf('const rerollPortalRotation'), source.indexOf('const persistAndScheduleCloud'));
  assert.match(transaction, /persistLocalSave\(result\.save\)[\s\S]*if \(!persisted\.saved\) return[\s\S]*setGold\(result\.save\.gold\)/);
  assert.match(transaction, /navigator\.locks\.request\(SAVE_KEY, commit\)/);
  assert.match(source, /onOpenAnchorProfile=\{\(\) => \{ setHubInitialTab\('anchorProfile'\)/);
});
