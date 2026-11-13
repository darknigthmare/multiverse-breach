import assert from 'node:assert/strict';
import test from 'node:test';
import { HEROES_DB } from '../../src/game/heroes.js';
import { KART_ROSTER, createKartSpec, getKartForHero } from '../../src/game/kart/kartRoster.js';
import { UNIVERSE_KART_IDENTITIES, getKartVehicleIdentity } from '../../src/game/kart/kartIdentityCatalog.js';
import { KART_IDENTITY_MODELS, KART_IDENTITY_MOTIFS, KART_IDENTITY_VARIANTS } from '../../src/game/kart/kartIdentityGeometry.js';
import { buildKartMesh } from '../../src/game/kart/kartModel.js';
import { applyKartLivery } from '../../src/game/kart/kartLivery.js';
import { exportKartGlb } from './buildKartAssets.mjs';

const sourceKinds = new Set(['canonical-vehicle-adaptation', 'universe-invention', 'original-universe-design']);

test('every registered universe and every pilot resolves an explicit vehicle design with drawn recognition cues', () => {
  const universes = [...new Set(HEROES_DB.map(hero => hero.universe))].sort();
  assert.deepEqual(Object.keys(UNIVERSE_KART_IDENTITIES).sort(), universes);
  const inspectedProfiles = new Set();
  for (const spec of KART_ROSTER) {
    const identity = spec.vehicleIdentity;
    assert.ok(identity, spec.heroId);
    assert.ok(sourceKinds.has(identity.sourceKind), spec.heroId);
    assert.ok(identity.label?.length > 3, spec.heroId);
    assert.ok(identity.recognition.length >= 3, spec.heroId);
    assert.ok(identity.recognition.every(cue => typeof cue === 'string' && cue.length > 3), spec.heroId);
    assert.ok(identity.rationale?.length > 12, spec.heroId);
    assert.notEqual(spec.designSource, 'character-palette-and-role', spec.heroId);
    if (identity.sourceKind === 'canonical-vehicle-adaptation') {
      assert.ok(typeof identity.referenceVehicle === 'string' && identity.referenceVehicle.length > 2, spec.heroId);
    }
    // Mirelle keeps her existing reference-backed disc rather than an identity
    // replacement. All other profiles must emit actual nonempty feature parts.
    if (spec.heroId === 'arca_mirelle') {
      assert.equal(identity.model, 'suture-disc');
      continue;
    }
    assert.ok(KART_IDENTITY_MODELS.includes(identity.model), `${spec.heroId}: ${identity.model}`);
    if (identity.variant) assert.ok(KART_IDENTITY_VARIANTS[identity.model]?.includes(identity.variant), `${spec.heroId}: ${identity.model}/${identity.variant}`);
    assert.ok(identity.motifs.length >= 2, spec.heroId);
    assert.ok(identity.motifs.every(motif => KART_IDENTITY_MOTIFS.includes(motif)), spec.heroId);
    const geometryKey = [identity.model, identity.variant || '', ...identity.motifs].join('|');
    if (inspectedProfiles.has(geometryKey)) continue;
    inspectedProfiles.add(geometryKey);
    const mesh = buildKartMesh(spec);
    assert.ok(mesh.features.includes(`identity:${identity.model}`), spec.heroId);
    for (const motif of identity.motifs) {
      assert.ok(mesh.features.includes(`motif:${motif}`), `${spec.heroId}: ${motif}`);
      assert.ok(mesh.parts.some(part => part.id.endsWith(`-motif-${motif}`) && part.count > 0), `${spec.heroId}: ${motif} must own faces`);
    }
  }
});

test('Ripley uses her 1979 Narcissus and UNSC and Star Wars pilots retain the chosen reference vehicles', () => {
  const references = {
    ripley: ['narcissus', /Narcissus/i],
    masterchief: ['warthog', /Warthog/i],
    luke: ['x-wing', /X.?wing/i],
    vader: ['tie-fighter', /TIE/i],
    han_solo: ['falcon', /Falcon|Faucon/i]
  };
  for (const [heroId, [model, name]] of Object.entries(references)) {
    const spec = getKartForHero(heroId);
    assert.equal(spec.vehicleIdentity.model, model, heroId);
    assert.match(spec.vehicleIdentity.referenceVehicle, name, heroId);
    assert.equal(spec.vehicleIdentity.sourceKind, 'canonical-vehicle-adaptation', heroId);
    assert.equal(spec.driverSprite.identity, heroId);
  }
  const ripley = getKartForHero('ripley');
  assert.match(ripley.vehicleIdentity.sourceIncarnation, /1979/);
  assert.doesNotMatch(ripley.signature, /loader/);
  assert.ok(ripley.sourceReferences.some(url => url.includes('narcissus-shuttlecraft-model')));
  assert.notEqual(getKartForHero('arbiter').vehicleIdentity.model, 'warthog');
});

test('authored proportions do not change when a different character uses the same universe design', () => {
  const source = HEROES_DB.find(hero => hero.universe === 'Alien');
  const a = createKartSpec({ ...source, id: 'test-crew-a', name: 'Crew A' });
  const b = createKartSpec({ ...source, id: 'test-crew-b', name: 'Crew B' });
  assert.notEqual(a.seed, b.seed);
  assert.equal(a.vehicleIdentity.id, b.vehicleIdentity.id);
  assert.deepEqual(a.dimensions, b.dimensions);
  assert.deepEqual(buildKartMesh(a).positions, buildKartMesh(b).positions);
  assert.equal(getKartVehicleIdentity({ id: 'future-character', universe: 'An unmapped future universe' }), null);
  assert.equal(createKartSpec({ id: 'future-character', universe: 'An unmapped future universe' }), null);
});

test('locked incarnations and personal vehicles do not inherit another episode, faction or character identity', () => {
  const will = getKartForHero('will_turner_potc').vehicleIdentity;
  assert.match(will.referenceVehicle, /Interceptor/);
  assert.doesNotMatch(will.referenceVehicle, /Dutchman|Hollandais/i);
  assert.ok(!will.motifs.includes('tentacles'));
  const elizabeth = getKartForHero('elizabeth_swann_potc').vehicleIdentity;
  assert.match(elizabeth.referenceVehicle, /Black Pearl/);
  assert.doesNotMatch(elizabeth.label, /reine|king/i);
  assert.ok(!elizabeth.motifs.includes('swords'));
  for (const id of ['hermione', 'hermione_granger']) {
    const identity = getKartForHero(id).vehicleIdentity;
    assert.equal(identity.model, 'book');
    assert.ok(!identity.motifs.includes('clock'));
    assert.doesNotMatch([identity.label, identity.rationale, ...identity.recognition].join(' '), /Retourneur|Time.?Turner/i);
  }
  assert.equal(getKartForHero('hotline_miami_biker').vehicleIdentity.model, 'motorbike');
  assert.doesNotMatch(getKartForHero('marathon_classic_sphtkr_defender').kartName.fr, /UESC/);
  for (const [id, variant] of [['hw_wheelchair_guy', 'wheelchair'], ['hw_business_guy', 'segway'], ['hw_irresponsible_dad', 'bicycle']]) {
    assert.equal(getKartForHero(id).vehicleIdentity.variant, variant, id);
  }
  const tails = getKartForHero('miles_tails_prower').vehicleIdentity;
  assert.equal(tails.model, 'biplane');
  assert.match(tails.referenceVehicle, /Tornado/);
  assert.doesNotMatch(tails.referenceVehicle, /Whirlwind|MTP/);
  assert.notEqual(getKartForHero('grim_knight').vehicleIdentity.model, 'tumbler');
  for (const id of ['kaiba', 'joey']) {
    const identity = getKartForHero(id).vehicleIdentity;
    assert.equal(identity.model, 'dragon');
    assert.equal(identity.variant, null, 'A dragon must not inherit the universe duel-disk variant');
  }
  const alicia = getKartForHero('tail_concerto_alicia').vehicleIdentity;
  assert.equal(alicia.sourceKind, 'universe-invention');
  assert.ok(!alicia.motifs.includes('badge'));
});

test('the exported GLB keeps its vehicle reference and livery never replaces its model or ornaments', () => {
  for (const id of ['ripley', 'masterchief', 'luke', 'vader', 'han_solo']) {
    const original = getKartForHero(id);
    const painted = applyKartLivery(original, { id: 'identity-test-paint', color: '#e87a2a' });
    assert.equal(painted.vehicleIdentity, original.vehicleIdentity);
    const a = buildKartMesh(original), b = buildKartMesh(painted);
    assert.deepEqual(a.positions, b.positions);
    assert.deepEqual(a.parts, b.parts);
    const glb = exportKartGlb(original, a);
    const json = JSON.parse(glb.subarray(20, 20 + glb.readUInt32LE(12)).toString('utf8'));
    const root = json.nodes[json.scenes[0].nodes[0]];
    assert.deepEqual(root.extras.vehicleIdentity, original.vehicleIdentity);
    assert.equal(json.nodes.find(node => node.name === 'DriverSpriteAnchor').extras.heroId, id);
  }
});
