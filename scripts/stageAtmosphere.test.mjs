import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { HEROES_DB } from '../src/game/heroes.js';
import {
  AUTHORED_STAGE_ATMOSPHERES,
  getStageAtmosphereProfile,
  renderStageAtmosphere,
  STAGE_ATMOSPHERE_FIDELITY
} from '../src/game/melee/stageAtmosphere.js';
import { STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS } from '../src/game/melee/stageAtmosphereUniverseDefaults.js';
import { STAGE_ARC_LORE_PROFILES, STAGE_LORE_PROFILES } from '../src/game/stageLoreProfiles.js';

const recordingContext = () => {
  const operations = [];
  const methods = ['save', 'restore', 'translate', 'rotate', 'scale', 'beginPath', 'closePath', 'rect', 'clip', 'ellipse', 'arc', 'moveTo', 'lineTo', 'quadraticCurveTo', 'stroke', 'fill', 'fillRect', 'strokeRect'];
  const ctx = Object.fromEntries(methods.map(name => [name, (...args) => {
    for (const value of args) if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: ${value}`);
    operations.push([name, ...args]);
  }]));
  for (const name of ['globalAlpha', 'lineWidth', 'fillStyle', 'strokeStyle', 'globalCompositeOperation']) {
    Object.defineProperty(ctx, name, { set(value) { operations.push([name, value]); } });
  }
  return { ctx, operations };
};

const draw = (stage, elapsedSeconds, options = {}) => {
  const { ctx, operations } = recordingContext();
  assert.equal(renderStageAtmosphere(ctx, { stage, width: 1040, height: 460, elapsedSeconds, ...options }), true);
  return operations;
};

test('authored atmosphere identifies the actual location, with transparent adaptation provenance', () => {
  const examples = [
    [{ universe: 'Alien', name: 'LV-426 Colony Hive' }, 'alien-processor-vents'],
    [{ universe: 'Stargate', name: 'Abydos Pyramids Breach' }, 'stargate-event-horizon'],
    [{ universe: 'The Matrix', name: 'Zion Digital Pipeline' }, 'matrix-digital-pipeline'],
    [{ universe: 'Ghost in the Shell', name: 'New Port City Network Node' }, 'new-port-network'],
    [{ universe: 'Silent Hill', name: 'Toluca Lake Fog Sector' }, 'toluca-fog'],
    [{ universe: 'Dead Space', name: 'USG Ishimura Mining Deck' }, 'ishimura-ventilation'],
    [{ universe: 'Final Fantasy VII', name: 'Mako Reactor 1' }, 'mako-reactor-1'],
    [{ universe: 'Final Fantasy VII', name: 'A.R.C.A. Impact Arena - Final Fantasy VII' }, 'mako-reactor-1'],
    [{ universe: 'Camera Cafe' }, 'camera-cafe-machine'],
    [{ universe: 'Daft Punk' }, 'alive-led-pyramid']
  ];
  examples.forEach(([stage, expected]) => {
    const profile = getStageAtmosphereProfile(stage);
    assert.equal(profile.id, expected);
    assert.equal(profile.fidelity, STAGE_ATMOSPHERE_FIDELITY.authored);
    assert.equal(profile.sourceVisualValidation, 'not-validated-1:1');
    assert.equal(profile.gameplayEffect, 'none');
    assert.ok(profile.sourceAnchor);
    assert.ok(profile.sourceFields.length);
    assert.ok(Object.isFrozen(profile));
  });
});

test('different places in one universe do not inherit unrelated canonical set pieces', () => {
  assert.equal(getStageAtmosphereProfile({ universe: 'Dragon Ball Z', name: 'Namek battlefield' }).id, 'namek-water');
  assert.notEqual(getStageAtmosphereProfile({ universe: 'Dragon Ball Z', name: 'Cell Games arena' }).effect, 'water-ripples');
  assert.notEqual(getStageAtmosphereProfile({ universe: 'Demon Slayer', name: 'Mount Natagumo forest' }).effect, 'castle-panels');
  assert.notEqual(getStageAtmosphereProfile({ universe: 'Tokyo Ghoul', name: 'Cochlea prison concrete' }).effect, 'rain');
  assert.notEqual(getStageAtmosphereProfile({ universe: 'Silent Hill', name: 'Otherworld hospital corridor' }).id, 'toluca-fog');
});

test('physical profiles use authored surfaces and never genre, faction or stage hashes', () => {
  const stage = { universe: 'Unlisted Universe', name: 'Timber hall', id: 1, faction: 'cyber' };
  const physical = getStageAtmosphereProfile(stage);
  assert.equal(physical.effect, 'dust');
  assert.equal(physical.fidelity, STAGE_ATMOSPHERE_FIDELITY.physical);
  assert.deepEqual(physical, getStageAtmosphereProfile({ ...stage, id: 999, faction: 'horror' }));
  const absent = getStageAtmosphereProfile({ universe: 'Unlisted Universe', name: 'Trial 123', faction: 'arcane' });
  assert.equal(absent.effect, null);
  assert.equal(absent.fidelity, STAGE_ATMOSPHERE_FIDELITY.unavailable);
  assert.equal(absent.enabled, false);
  assert.equal(getStageAtmosphereProfile({ universe: 'Unlisted Universe', name: 'A.R.C.A. Impact Arena - Unlisted Universe' }).enabled, false);
});

test('every authored rendering branch draws finite, deterministic, low-opacity background geometry', () => {
  const representativeStages = AUTHORED_STAGE_ATMOSPHERES.map(profile => {
    const universe = profile.universes[0];
    const lore = STAGE_LORE_PROFILES[universe];
    const coreNames = {
      Stargate: 'Abydos gate', 'The Matrix': 'Digital pipeline', 'Ghost in the Shell': 'New Port network',
      'Silent Hill': 'Toluca fog', 'Dead Space': 'Ishimura mining deck', Alien: 'LV-426 hive'
    };
    return { universe, name: coreNames[universe] || lore?.visualAnchor || universe };
  });
  for (const stage of representativeStages) {
    const atZero = draw(stage, 0);
    const atTen = draw(stage, 10);
    assert.deepEqual(atTen, draw(stage, 10), stage.universe);
    assert.notDeepEqual(atZero, atTen, stage.universe);
    assert.ok(atTen.some(operation => ['fillRect', 'ellipse', 'arc', 'strokeRect', 'lineTo'].includes(operation[0])), stage.universe);
    for (const operation of atTen) {
      for (const value of operation.slice(1)) {
        if (typeof value === 'number') assert.ok(Number.isFinite(value), `${stage.universe}: ${operation}`);
      }
      if (operation[0] === 'globalAlpha') assert.ok(operation[1] >= 0 && operation[1] <= 0.2);
    }
    assert.deepEqual(atTen.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, 460 * 0.065, 1040, 460 * 0.55], ['clip']]);
    assert.deepEqual(atTen.at(-1), ['restore']);
  }
});

test('reduced motion freezes animation, invalid clocks cannot poison drawing and stage options disable the layer', () => {
  const stage = { universe: 'Final Fantasy VII', name: 'Mako Reactor 1', stageVariant: 'competitive', stageEventIntensity: 'off' };
  const before = structuredClone(stage);
  assert.deepEqual(draw(stage, 3, { reducedMotion: true }), draw(stage, 300, { reducedMotion: true }));
  assert.deepEqual(draw({ ...stage, reducedMotion: true }, 3), draw({ ...stage, reducedMotion: true }, 300));
  assert.deepEqual(draw(stage, NaN), draw(stage, 0));
  assert.deepEqual(stage, before, 'atmosphere mutated stage or competitive event settings');
  for (const option of ['disableStageAtmosphere', 'disableStageAnimations']) {
    const { ctx, operations } = recordingContext();
    assert.equal(renderStageAtmosphere(ctx, { stage: { ...stage, [option]: true }, width: 1040, height: 460 }), false);
    assert.deepEqual(operations, []);
  }
  assert.equal(renderStageAtmosphere(null, { stage, width: 1040, height: 460 }), false);
  assert.equal(renderStageAtmosphere(recordingContext().ctx, { stage, width: NaN, height: 460 }), false);
});

test('lore and crossover registry entries resolve without pretending visual validation', () => {
  for (const lore of [...Object.values(STAGE_LORE_PROFILES), ...Object.values(STAGE_ARC_LORE_PROFILES)]) {
    const stage = lore.stageId ? { stageId: lore.stageId } : { universe: lore.key };
    const profile = getStageAtmosphereProfile(stage);
    assert.equal(profile.sourceVisualValidation, 'not-validated-1:1');
    assert.deepEqual(profile.referenceUrls, lore.referenceUrls);
    assert.equal(profile.sourceAuditStatus, lore.auditStatus);
    if (profile.enabled) draw(stage, 4);
  }
});

test('all 255 formerly missing universes have explicit reference scenes, local motifs and placements', () => {
  const baseline = JSON.parse(fs.readFileSync(new URL('../docs/audits/stage-atmosphere-missing-baseline-2026-10-18.json', import.meta.url), 'utf8'));
  const entries = Object.values(STAGE_ATMOSPHERE_UNIVERSE_DEFAULTS);
  assert.equal(entries.length, 255);
  assert.deepEqual(entries.map(entry => entry.universe).sort(), [...baseline.universes].sort());
  const effects = new Set();
  for (const entry of entries) {
    assert.ok(entry.sourceWork?.length > 3, entry.universe);
    assert.ok(entry.sourceReference?.startsWith('https://') || entry.sourceReference?.startsWith('src/'), entry.universe);
    assert.ok(entry.location?.length > 8, entry.universe);
    assert.ok(entry.motif?.length > 15, entry.universe);
    assert.match(entry.color, /^#[0-9a-f]{6}$/i);
    assert.equal(entry.fidelity, 'authored-universe-adaptation');
    assert.equal(entry.visualValidation, 'not-validated-1:1');
    assert.ok(entry.placement.x >= 0.1 && entry.placement.x <= 0.9, entry.universe);
    assert.ok(entry.placement.y >= 0.12 && entry.placement.y <= 0.5, entry.universe);
    assert.ok(entry.placement.spread >= 0.3 && entry.placement.spread <= 0.9, entry.universe);
    assert.ok(Object.isFrozen(entry.placement));
    const p = getStageAtmosphereProfile({ universe: entry.universe, mode: 'Combat' });
    assert.equal(p.selection, 'universe-default', entry.universe);
    assert.equal(p.effect, entry.effect, entry.universe);
    assert.equal(p.color, entry.color, entry.universe);
    assert.equal(p.sourceAnchor, entry.location, entry.universe);
    assert.equal(p.sourceMatchedMotif, entry.motif, entry.universe);
    assert.equal(p.sourceReference, entry.sourceReference, entry.universe);
    assert.equal(p.sourceVisualValidation, 'not-validated-1:1');
    effects.add(p.effect);
    const rendered = draw({ universe: entry.universe }, 5);
    assert.ok(rendered.some(operation => ['lineTo', 'arc', 'ellipse', 'fillRect', 'strokeRect'].includes(operation[0])), entry.universe);
    if (!p.sceneAnimation) {
      assert.ok(rendered.some(operation => operation[0] === 'translate'), entry.universe);
      assert.ok(rendered.some(operation => operation[0] === 'scale'), entry.universe);
    }
    assert.deepEqual(rendered, draw({ universe: entry.universe }, 5), entry.universe);
    assert.notDeepEqual(rendered, draw({ universe: entry.universe }, 0), entry.universe);
    assert.deepEqual(draw({ universe: entry.universe }, 5, { reducedMotion: true }), draw({ universe: entry.universe }, 50, { reducedMotion: true }), entry.universe);
    for (const operation of rendered) {
      for (const value of operation.slice(1)) {
        if (typeof value === 'number') assert.ok(Number.isFinite(value), `${entry.universe}: ${operation}`);
      }
      if (operation[0] === 'globalAlpha') assert.ok(operation[1] >= 0 && operation[1] <= 0.2, entry.universe);
    }
  }
  assert.ok(effects.size >= 15, `Only ${effects.size} distinct effects for 255 authored scenes`);
  assert.ok(entries.filter(entry => entry.effect === 'dust').length < entries.length * 0.3, 'Defaults collapsed into generic dust');
});

test('all 525 roster universes resolve without a scene name and unknown universes stay unconfigured', () => {
  const universes = [...new Set(HEROES_DB.map(hero => hero.universe))];
  assert.equal(universes.length, 525);
  const missing = universes.filter(universe => !getStageAtmosphereProfile({ universe, mode: 'Combat' }).enabled);
  assert.deepEqual(missing, []);
  const unknown = getStageAtmosphereProfile({ universe: 'Unlisted Universe 987', mode: 'Combat' });
  assert.equal(unknown.effect, null);
  assert.equal(unknown.enabled, false);
});

test('caller scenes always beat universe defaults, including unknown scenes and ordinary rooms', () => {
  const matrix = { universe: 'The Matrix', mode: 'Combat' };
  assert.equal(getStageAtmosphereProfile(matrix).selection, 'universe-default');
  const concrete = getStageAtmosphereProfile({ ...matrix, name: 'Ordinary timber library hall' });
  assert.equal(concrete.selection, 'stage-scene');
  assert.equal(concrete.effect, 'dust');
  assert.equal(concrete.sourceAnchor, 'Ordinary timber library hall');
  assert.equal(concrete.placement, null);
  const unknownScene = getStageAtmosphereProfile({ ...matrix, name: 'Unmapped Location ZZZ' });
  assert.equal(unknownScene.effect, null, 'An unknown precise scene inherited an unrelated default');
  assert.equal(unknownScene.enabled, false);
  assert.equal(getStageAtmosphereProfile({ universe: 'Alien', name: 'A.R.C.A. Impact Arena - Alien' }).selection, 'universe-default');
});
