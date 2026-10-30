import assert from 'node:assert/strict';
import test from 'node:test';
import { applyDisplayPreferences, readSceneHudPreferences } from '../src/game/displayPreferences.js';
import { getSceneHudLayout } from '../src/game/immersiveHubState.js';

const closeTo = (actual, expected, label) => {
  assert.ok(Math.abs(actual - expected) < 1e-7, `${label}: expected ${expected}, got ${actual}`);
};

const cssRoot = () => {
  const properties = new Map();
  return {
    dataset: {},
    style: {
      setProperty: (name, value) => properties.set(name, value),
      getPropertyValue: name => properties.get(name) || ''
    }
  };
};

test('every offered HUD margin reaches the city map and FPS radar in CSS pixels', () => {
  const root = cssRoot();
  for (const [width, height] of [[360, 800], [844, 390], [1366, 768]]) {
    for (const hudScale of [0.9, 1, 1.4]) {
      // Exercise the whole range offered by the settings slider, including 0–10 px.
      for (let safeArea = 0; safeArea <= 32; safeArea += 2) {
        applyDisplayPreferences({ hudScale, safeArea }, root);
        const preferences = readSceneHudPreferences(root.style);
        assert.equal(preferences.safeArea, safeArea);
        assert.equal(preferences.hudScale, hudScale);

        const city = getSceneHudLayout({ width, height, logicalHeight: 540, ...preferences });
        const map = city.cityMinimap;
        closeTo(width - (map.x + map.width) / city.unitsPerCssPixel, safeArea, 'map right margin');
        closeTo(height - (map.y + map.height) / city.unitsPerCssPixel,
          safeArea + (width <= 760 ? 64 * hudScale : 0), 'map bottom margin and touch-control clearance');

        const fps = getSceneHudLayout({ width, height, logicalHeight: 430, ...preferences });
        const radar = fps.fpsRadar;
        closeTo(width - (radar.x + radar.radius) / fps.unitsPerCssPixel, safeArea, 'radar right margin');
        closeTo((radar.y - radar.radius) / fps.unitsPerCssPixel, 56 + safeArea, 'radar toolbar clearance');
      }
    }
  }
});

test('successive applied preferences replace the previous canvas margin including zero', () => {
  const root = cssRoot();
  for (const safeArea of [32, 0, 6, 12]) {
    applyDisplayPreferences({ safeArea }, root);
    assert.deepEqual(readSceneHudPreferences(root.style), { hudScale: 1, safeArea });
  }
});

test('missing or invalid computed CSS keeps the established readable defaults', () => {
  assert.deepEqual(readSceneHudPreferences(), { hudScale: 1, safeArea: 12 });
  assert.deepEqual(readSceneHudPreferences({}), { hudScale: 1, safeArea: 12 });
  for (const value of ['', 'not-a-number', 'Infinity']) {
    const style = { getPropertyValue: () => value };
    assert.deepEqual(readSceneHudPreferences(style), { hudScale: 1, safeArea: 12 });
  }
});

test('computed preferences use the same safe bounds as the settings screen', () => {
  const style = (hudScale, safeArea) => ({
    getPropertyValue: name => name === '--game-hud-scale' ? hudScale : safeArea
  });
  assert.deepEqual(readSceneHudPreferences(style('1.2', '6px')), { hudScale: 1.2, safeArea: 6 });
  assert.deepEqual(readSceneHudPreferences(style('0', '-5px')), { hudScale: 0.9, safeArea: 0 });
  assert.deepEqual(readSceneHudPreferences(style('5', '99px')), { hudScale: 1.4, safeArea: 32 });
});
