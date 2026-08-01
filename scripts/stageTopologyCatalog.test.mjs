import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createCanonicalTopologyPlatforms,
  P5_STAGE_PILOTS,
  resolveStageTopologyProfile,
  STAGE_EVENT_INTENSITIES,
  STAGE_TOPOLOGY_CATALOG,
  STAGE_TOPOLOGY_IDS,
  STAGE_VARIANTS
} from '../src/game/melee/stageTopologyCatalog.js';

const WIDTH = 1040;
const HEIGHT = 460;

const assertBounded = platforms => {
  platforms.forEach(platform => {
    assert.ok(platform.x1 >= 0 && platform.x1 < platform.x2);
    assert.ok(platform.x2 <= WIDTH);
    assert.ok(platform.y >= 0 && platform.y <= HEIGHT);
    assert.ok(Number.isFinite(platform.baseX1));
    assert.ok(Number.isFinite(platform.baseX2));
    assert.ok(Number.isFinite(platform.baseY));
  });
};

test('P5 exposes exactly the six required bounded topology definitions', () => {
  const requiredIds = Object.values(STAGE_TOPOLOGY_IDS);
  assert.equal(requiredIds.length, 6);
  assert.deepEqual(Object.keys(STAGE_TOPOLOGY_CATALOG).sort(), [...requiredIds].sort());
  requiredIds.forEach(topologyId => {
    assert.equal(STAGE_TOPOLOGY_CATALOG[topologyId].id, topologyId);
    assert.ok(STAGE_TOPOLOGY_CATALOG[topologyId].name.fr);
    assert.ok(STAGE_TOPOLOGY_CATALOG[topologyId].name.en);
    assertBounded(createCanonicalTopologyPlatforms(topologyId, WIDTH, HEIGHT));
  });
});
test('canonical topologies preserve their distinct gameplay semantics', () => {
  const flat = createCanonicalTopologyPlatforms(STAGE_TOPOLOGY_IDS.flat, WIDTH, HEIGHT);
  const two = createCanonicalTopologyPlatforms(STAGE_TOPOLOGY_IDS.twoPlatform, WIDTH, HEIGHT);
  const three = createCanonicalTopologyPlatforms(STAGE_TOPOLOGY_IDS.threePlatform, WIDTH, HEIGHT);
  const mobile = createCanonicalTopologyPlatforms(STAGE_TOPOLOGY_IDS.mobilePlatform, WIDTH, HEIGHT);
  const location = createCanonicalTopologyPlatforms(STAGE_TOPOLOGY_IDS.noPlatformLevel, WIDTH, HEIGHT);
  const transforms = [0, 1, 2].map(index => (
    createCanonicalTopologyPlatforms(STAGE_TOPOLOGY_IDS.transformingEvent, WIDTH, HEIGHT, index)
  ));

  assert.equal(flat.length, 1, 'FLAT gained an extra platform');
  assert.equal(two.filter(platform => platform.kind !== 'main').length, 2);
  assert.equal(three.filter(platform => platform.kind !== 'main').length, 3);
  assert.ok(mobile.filter(platform => platform.motion).length >= 1);
  assert.ok(mobile.filter(platform => platform.motion).length <= 3);
  assert.ok(location.every(platform => platform.kind === 'main'), 'location uses abstract floating slabs');
  assert.equal(new Set(transforms.map(layout => JSON.stringify(layout))).size, 3);
});
test('mobile platform rails are slow, bounded and deterministic', () => {
  const first = createCanonicalTopologyPlatforms(STAGE_TOPOLOGY_IDS.mobilePlatform, WIDTH, HEIGHT);
  const second = createCanonicalTopologyPlatforms(STAGE_TOPOLOGY_IDS.mobilePlatform, WIDTH, HEIGHT);
  assert.deepEqual(first, second);
  first.filter(platform => platform.motion).forEach(platform => {
    const peakPixelsPerSecond = platform.motion.range * Math.PI * 2 / (platform.motion.periodMs / 1000);
    assert.ok(peakPixelsPerSecond <= 100, `mobile rail exceeds safe speed: ${peakPixelsPerSecond}`);
  });
});

test('three P5 pilots resolve exact Lore and Competitive topology variants', () => {
  assert.deepEqual(Object.keys(P5_STAGE_PILOTS), [
    'Alien',
    'Camera Cafe',
    'Godzilla The Animated Series'
  ]);

  const alienLore = resolveStageTopologyProfile({ universe: 'Alien', stageVariant: STAGE_VARIANTS.lore }, 'hive_corridor');
  const alienCompetitive = resolveStageTopologyProfile({ universe: 'Alien', stageVariant: STAGE_VARIANTS.competitive }, 'hive_corridor');
  const officeLore = resolveStageTopologyProfile({ universe: 'Camera Cafe', stageVariant: STAGE_VARIANTS.lore }, 'absurd_party');
  const godzillaLore = resolveStageTopologyProfile({ universe: 'Godzilla The Animated Series', stageVariant: STAGE_VARIANTS.lore }, 'boss_coliseum');

  assert.equal(alienLore.topologyId, STAGE_TOPOLOGY_IDS.twoPlatform);
  assert.equal(alienCompetitive.topologyId, STAGE_TOPOLOGY_IDS.flat);
  assert.equal(alienCompetitive.eventIntensity, STAGE_EVENT_INTENSITIES.off);
  assert.equal(officeLore.topologyId, STAGE_TOPOLOGY_IDS.mobilePlatform);
  assert.equal(godzillaLore.topologyId, STAGE_TOPOLOGY_IDS.threePlatform);
});

test('explicit options stay normalized while Competitive always disables events', () => {
  const lore = resolveStageTopologyProfile({
    universe: 'Nexus de Convergence',
    meleeTopologyId: STAGE_TOPOLOGY_IDS.transformingEvent,
    meleeStageVariant: STAGE_VARIANTS.lore,
    meleeEventIntensity: STAGE_EVENT_INTENSITIES.light
  }, 'training_flat');
  const competitive = resolveStageTopologyProfile({
    universe: 'Nexus de Convergence',
    meleeTopologyId: STAGE_TOPOLOGY_IDS.mobilePlatform,
    meleeStageVariant: STAGE_VARIANTS.competitive,
    meleeEventIntensity: STAGE_EVENT_INTENSITIES.full
  }, 'training_flat');

  assert.equal(lore.topologyId, STAGE_TOPOLOGY_IDS.transformingEvent);
  assert.equal(lore.eventIntensity, STAGE_EVENT_INTENSITIES.light);
  assert.equal(competitive.requestedIntensity, STAGE_EVENT_INTENSITIES.full);
  assert.equal(competitive.eventIntensity, STAGE_EVENT_INTENSITIES.off);
  assert.equal(competitive.eventsEnabled, false);
});
