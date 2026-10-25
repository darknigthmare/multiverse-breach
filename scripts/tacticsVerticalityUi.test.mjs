import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { isTacticsPickupAtSurface } from '../src/game/tacticsPickupSurface.js';
import { getTacticsCursorDestination } from '../src/game/tacticsTerrainControls.js';
import { normalizeTacticsTerrain } from '../src/game/tacticsTerrain.js';

let vite;
let customBattle;
let App;
let Panel;
before(async () => {
  vite = await createServer({ appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  [customBattle, { default: App }, { default: Panel }] = await Promise.all([
    vite.ssrLoadModule('/src/game/customBattle.js'),
    vite.ssrLoadModule('/src/App.jsx'),
    vite.ssrLoadModule('/src/components/TacticsTerrainPanel.jsx')
  ]);
});
after(async () => vite?.close());

test('each playable vertical terrain survives setup, saved trace migration and a Tactics runtime launch', () => {
  for (const id of ['nexus_skybridge', 'ruined_terraces', 'cyber_catwalks']) {
    const preset = customBattle.normalizeCustomBattlePreset({ mode: 'Tactics', tacticsBattlefieldId: id });
    assert.equal(preset.tacticsBattlefieldId, id);
    const normalized = App.normalizeSavePayload({ portalCollection: { customBattlePreset: preset } });
    assert.equal(normalized.portalCollection.customBattlePreset.tacticsBattlefieldId, id);
    const stage = customBattle.buildCustomRuntimeStage({ preset, enemyData: { monsters: [] } });
    assert.equal(stage.mode, 'Tactics');
    assert.equal(stage.tacticsBattlefieldId, id);
    assert.equal(stage.customBattle.tacticsBattlefieldId, id);
    const otherMode = customBattle.buildCustomRuntimeStage({ preset: { ...preset, mode: 'RPG' }, enemyData: {} });
    assert.equal(otherMode.tacticsBattlefieldId, null, 'terrain selection must not alter other engines');
  }
});

test('legacy presets remain automatic and malformed or inherited terrain IDs cannot select a map', () => {
  assert.equal(customBattle.normalizeCustomBattlePreset({ mode: 'Tactics' }).tacticsBattlefieldId, 'auto');
  for (const id of ['missing-map', '__proto__', 'constructor', {}, null]) {
    const preset = customBattle.normalizeCustomBattlePreset({ mode: 'Tactics', tacticsBattlefieldId: id });
    assert.equal(preset.tacticsBattlefieldId, 'auto');
    const normalized = App.normalizeSavePayload({ portalCollection: { customBattlePreset: { tacticsBattlefieldId: id } } });
    assert.equal(normalized.portalCollection.customBattlePreset.tacticsBattlefieldId, 'auto');
  }
});

test('terrain controls expose two distinct surfaces at one XY and an explicit confirmation', () => {
  const ground = { id: 'ground:4:3', x: 4, y: 3, z: 0, materialId: 'stone', moveCost: 2, reachable: true };
  const bridge = { id: 'bridge:4:3', x: 4, y: 3, z: 2, materialId: 'metal', walkable: false, reason: 'Passage occupé' };
  const terrain = { vertical: true, levels: [0, 1, 2], visibleLevel: null, selectedSurface: bridge, stackedSurfaces: [ground, bridge] };
  const html = renderToStaticMarkup(React.createElement(Panel, { terrain, lang: 'fr' }));
  assert.match(html, /Hauteurs et cases du terrain/);
  assert.match(html, /Coupe du terrain/);
  assert.match(html, /value="ground:4:3"/);
  assert.match(html, /value="bridge:4:3" selected=""/);
  assert.match(html, /E4 · Z 0/);
  assert.match(html, /E4 · Z 2/);
  assert.match(html, /ALLER \/ CIBLER CETTE CASE/);
  assert.match(html, /Passage occupé/);
  assert.match(html, /role="status"/);
  assert.match(html, /Sélectionner une surface dans la liste ne consomme aucun AP/);
});

test('pause disables every terrain control and flat battlefields have no terrain panel', () => {
  const surface = { id: 'ground:0:0', x: 0, y: 0, z: 0, materialId: 'stone' };
  const terrain = { vertical: true, levels: [0, 2], selectedSurface: surface, stackedSurfaces: [surface, { ...surface, id: 'bridge:0:0', z: 2 }] };
  const paused = renderToStaticMarkup(React.createElement(Panel, { terrain, disabled: true, lang: 'en' }));
  for (const control of paused.matchAll(/<(?:button|select)\b[^>]*>/g)) assert.match(control[0], /\bdisabled=""/, control[0]);
  assert.equal(renderToStaticMarkup(React.createElement(Panel, { terrain: { vertical: false } })), '');
  assert.equal(renderToStaticMarkup(React.createElement(Panel)), '');
});

test('a resource under a bridge cannot trigger from the upper surface or an ambiguous XY', () => {
  const pickup = { gridX: 4, gridY: 3, surfaceId: 'ground:4:3', used: false };
  assert.equal(isTacticsPickupAtSurface(pickup, 4, 3, 'ground:4:3'), true);
  assert.equal(isTacticsPickupAtSurface(pickup, 4, 3, 'bridge:4:3'), false);
  assert.equal(isTacticsPickupAtSurface(pickup, 4, 3), false);
  assert.equal(isTacticsPickupAtSurface(pickup, 3, 3, 'ground:4:3'), false);
  assert.equal(isTacticsPickupAtSurface({ ...pickup, used: true }, 4, 3, 'ground:4:3'), false);
  const legacy = { gridX: 4, gridY: 3, used: false };
  assert.equal(isTacticsPickupAtSurface(legacy, 4, 3), true);
  assert.equal(isTacticsPickupAtSurface(legacy, 4, 3, 'ground:4:3'), false);
});

test('keyboard inspection preserves the nearest visible floor and respects empty map edges', () => {
  const terrain = normalizeTacticsTerrain({ formatVersion: 2, cols: 2, rows: 1, surfaces: [
    { id: 'ground:left', x: 0, y: 0, z: 0 }, { id: 'bridge:left', x: 0, y: 0, z: 3 },
    { id: 'ground:right', x: 1, y: 0, z: 0 }, { id: 'bridge:right', x: 1, y: 0, z: 3 }
  ] });
  const lower = terrain.byId.get('ground:left'), upper = terrain.byId.get('bridge:left');
  assert.equal(getTacticsCursorDestination(terrain, lower, 1, 0).id, 'ground:right');
  assert.equal(getTacticsCursorDestination(terrain, upper, 1, 0).id, 'bridge:right');
  assert.equal(getTacticsCursorDestination(terrain, upper, 1, 0, id => id !== 'bridge:right').id, 'ground:right');
  assert.equal(getTacticsCursorDestination(terrain, lower, -1, 0), null);
  assert.equal(getTacticsCursorDestination(terrain, lower, 1, 1), null);
  assert.equal(lower.x, 0); assert.equal(lower.z, 0);
});
