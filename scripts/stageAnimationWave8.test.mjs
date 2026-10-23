import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_8, WAVE_8_MODE_REFERENCE_SCENES, getStageAnimationWave8Geometry } from '../src/game/melee/stageAnimationCatalogWave8.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave8-2026-10-20/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = STAGE_ANIMATION_WAVE_8.map(p => [p.universes[0], p.sourceScene, p.mechanism]);
const recorder = () => {
  const operations = []; let depth = 0;
  const ctx = new Proxy({}, {
    get(_, key) { return (...args) => { if (key === 'save') depth++; if (key === 'restore') { depth--; assert.ok(depth >= 0); } operations.push([key, ...args]); }; },
    set(_, key, value) { operations.push([key, value]); return true; }
  });
  return { ctx, operations, depth: () => depth };
};
const draw = (stage, time, options = {}) => {
  const { ctx, operations, depth } = recorder();
  assert.equal(renderStageAnimation(ctx, { stage, width: 1040, height: 460, elapsedSeconds: time, ...options }), true);
  assert.equal(depth(), 0); return operations;
};
const geometry = ops => ops.filter(op => ['rect', 'arc', 'ellipse', 'moveTo', 'lineTo', 'strokeRect', 'fillRect', 'translate', 'rotate'].includes(op[0]));

test('wave8 preserves the 161 previous definitions and all 322 drawing-command hashes', () => {
  assert.equal(baseline.profiles.length, 161);
  assert.equal(baseline.profiles.reduce((n, p) => n + p.samples.length, 0), 322);
  const throughWave8 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 8);
  assert.equal(throughWave8.length, 201);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, v) => v instanceof RegExp ? v.toString() : v)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} at ${sample.time}`);
  }
});

test('40 explicitly sourced mechanisms cover 20 real previously uncovered universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_8.length, 40);
  const roster = new Set(HEROES_DB.map(hero => hero.universe)), old = new Set(baseline.profiles.flatMap(p => p.definition.universes)), counts = new Map();
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(roster.has(universe)); assert.equal(old.has(universe), false);
    assert.equal(p?.mechanism, mechanism, name); assert.equal(p.animationWave, 8);
    assert.equal(p.sourceVisualValidation, 'not-validated-1:1'); assert.equal(p.fidelityVerified, false); assert.equal(p.officialSourceFrames, false);
    assert.equal(p.gameplayEffect, 'none'); assert.equal(p.renderingKind, 'authored-mechanism');
    assert.equal(p.animationProvenance, 'authored-scene-mechanism-geometry-and-timing');
    assert.equal(p.timeSource, 'simulation-elapsed-seconds'); assert.equal(p.reducedMotionBehavior, 'freeze-at-time-zero');
    assert.ok(p.sourceWork && p.sourceScene && p.continuity && p.sourceAccess);
    assert.ok(p.sourceReference.startsWith('https://')); assert.ok(p.sceneEvidence.length > 120);
    assert.deepEqual(p.localAssetPaths, []); assert.equal(p.atlas, undefined);
    assert.equal(getStageAnimationFrame({ universe, name }, 1).frameCount, 0);
    assert.equal(getStageAnimationProfile({ universe, name: p.sourceScene })?.id, p.id, p.sourceScene);
    counts.set(universe, (counts.get(universe) || 0) + 1);
  }
  assert.equal(counts.size, 20); assert.ok([...counts.values()].every(n => n === 2));
});

test('precise scenes and continuity exclusions resolve before all four mode defaults', () => {
  const rejected = [
    ['Teen Titans', 'Car Trouble T-Car garage Teen Titans Go 2013'],
    ['Teen Titans', 'Deep Six T-Sub space T-Ship'],
    ['Yakuza', 'Kamurocho Pocket Circuit Kiwami'],
    ['Yakuza', 'Sotenbori UFO catcher Director’s Cut 2025'],
    ['Dungeon Meshi', 'Kakiage second floor trap manga only'],
    ['Dungeon Meshi', 'Exorcism Sorbet episode 5 jar live-action'],
    ['Left 4 Dead', 'No Mercy hospital roof helicopter L4D2'],
    ['Left 4 Dead', 'Death Toll boathouse The Sacrifice'],
    ['Counter-Strike', 'cs_assault garage security sliding door 1.6'],
    ['Counter-Strike', 'de_nuke turbine CS2'],
    ['Borderlands 2', 'Sanctuary Moxxi Lucky Shot Borderlands 3'],
    ['Borderlands 2', 'Lynchwood mine elevator Wonderlands'],
    ['Cuphead', 'Carnival Kerfuffle rollercoaster Netflix'],
    ['Cuphead', 'Railroad Wrath handcart train legs'],
    ['Beyond Good & Evil', 'Akuda Francis disk game 20th Anniversary 2024'],
    ['Beyond Good & Evil', 'Mammago garage Beyond Good and Evil 2'],
    ['Sam & Max', 'Ball of Twine cable car Telltale'],
    ['Sam & Max', 'Mystery Vortex magnets VR'],
    ['Deponia', 'Kuvaq Lonzo coffee Chaos on Deponia'],
    ['Deponia', 'Kuvaq post office conveyor Doomsday'],
    ['HITMAN — World of Assassination', 'Paris Sanguine light rig winch collapsed'],
    ['HITMAN — World of Assassination', 'Hokkaido GAMA KAI patient'],
    ['Red Faction', 'Abandoned Mine old crusher Guerrilla'],
    ['Red Faction', 'Geothermal Power Plant turbine sabotaged'],
    ['Marathon', 'Arrival Hangar 49-h elevator Redux'],
    ['Marathon', 'Colony Ship For Sale Cheap platform 2026 reboot'],
    ['Unreal Tournament 2004', 'DM-Insidious fan UT99'],
    ['Unreal Tournament 2004', 'AS-Convoy repair vessel UT3'],
    ['Metal Slug', 'Mission 1 jungle SV-001 Metal Slug 2'],
    ['Metal Slug', 'Rail section rolling train car 1st Mission'],
    ['Dead Rising', 'Wonderland Space Rider coaster Deluxe Remaster 2024'],
    ['Dead Rising', 'Play Park windmill Leisure Park'],
    ['Quake', 'E1M1 Slipgate Complex cave lift Saturn'],
    ['Quake', 'E1M2 Castle of the Damned column plate remaster 2021'],
    ['Steins;Gate', 'Future Gadget Lab PhoneWave microwave Steins Gate 0 2018'],
    ['Steins;Gate', 'Braun Tube Workshop 42 CRT Elite'],
    ['Minecraft', 'Plains village grindstone Bedrock'],
    ['Minecraft', 'Abandoned mineshaft minecart TNT'],
    ['Unreal', 'Vortex Rikers cargo lift beta 1997'],
    ['Unreal', 'ISV-Kran Deck 4 duct fan Return to Na Pali']
  ];
  for (const [universe, name] of rejected) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, name, mode }), null, `${universe}/${name}/${mode}`);
  for (const [universe, name] of examples) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
    assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 8);
    assert.equal(getStageAnimationProfile({ universe, name, mode })?.id, getStageAnimationProfile({ universe, name })?.id);
    assert.equal(getStageAnimationProfile({ universe, name: 'Quiet ordinary room', mode }), null);
    assert.equal(getStageAnimationProfile({ universe: 'Unknown Universe', name, mode }), null);
  }
  assert.equal(Object.keys(WAVE_8_MODE_REFERENCE_SCENES).length, 20);
});

test('all 40 mechanisms change real geometry deterministically without changing gameplay', () => {
  const signatures = new Set();
  for (const [universe, name] of examples) {
    const stage = { universe, name, actors: [{ hp: 73, state: 'idle' }], events: [], safeZones: [1, 2], cameraX: 12 };
    const before = structuredClone(stage), p = getStageAnimationProfile(stage), time = p.periodSeconds * 0.23;
    const first = draw(stage, 0), later = draw(stage, time);
    assert.notDeepEqual(geometry(first), geometry(later), p.id); assert.deepEqual(later, draw(stage, time));
    assert.deepEqual(first, draw(stage, p.periodSeconds)); assert.deepEqual(stage, before);
    signatures.add(hash(geometry(later)));
    assert.ok(later.some(op => op[0] === 'strokeStyle' && op[1] === p.color), p.id + '/source-specific color');
    assert.ok(later.some(op => op[0] === 'lineWidth' && op[1] > 0));
    assert.deepEqual(later.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, 460 * 0.065, 1040, 460 * 0.55], ['clip']]);
    assert.equal(later.at(-1)[0], 'restore');
    for (const op of later) {
      for (const n of op.slice(1).filter(v => typeof v === 'number')) assert.ok(Number.isFinite(n), `${p.id}/${op[0]}`);
      if (op[0] === 'globalAlpha') assert.ok(op[1] >= 0 && op[1] <= 0.2);
    }
  }
  assert.equal(signatures.size, 40);
});

test('simulation time, reduced motion, stage disable flags, mirrors and viewport clipping remain safe', () => {
  for (const [universe, name] of examples) {
    const stage = { universe, name };
    assert.deepEqual(draw(stage, 7), draw(stage, 7));
    assert.deepEqual(draw(stage, 7, { reducedMotion: true }), draw(stage, 700, { reducedMotion: true }));
    assert.deepEqual(draw({ ...stage, reducedMotion: true }, 7), draw({ ...stage, reducedMotion: true }, 700));
    assert.deepEqual(draw(stage, NaN), draw(stage, 0)); assert.deepEqual(draw(stage, -1), draw(stage, 0));
    assert.deepEqual(draw(stage, 7), draw({ ...stage, facing: -1, mirror: true, flipX: true, player2: true }, 7));
    for (const key of ['disableStageAtmosphere', 'disableStageAnimations']) {
      const r = recorder(); assert.equal(renderStageAnimation(r.ctx, { stage: { ...stage, [key]: true }, width: 1040, height: 460, elapsedSeconds: 7 }), false); assert.deepEqual(r.operations, []);
    }
    for (const [width, height] of [[360, 780], [1920, 480], [512, 512]]) {
      const r = recorder(); assert.equal(renderStageAnimation(r.ctx, { stage, width, height, elapsedSeconds: 7 }), true); assert.equal(r.depth(), 0);
      assert.deepEqual(r.operations.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, height * 0.065, width, height * 0.55], ['clip']]);
      for (const op of r.operations) for (const n of op.slice(1).filter(v => typeof v === 'number')) assert.ok(Number.isFinite(n));
    }
  }
});

test('actual drawn rope, cable, rigid tool links, gantry and train rods obey their constraints', () => {
  const distance = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const contains = (ops, point) => ops.some(op => ['moveTo', 'lineTo', 'ellipse'].includes(op[0]) && Math.abs(op[1] - point[0]) < 1e-8 && Math.abs(op[2] - point[1]) < 1e-8);
  for (const [width, height] of [[1040, 460], [360, 780], [1920, 480], [512, 512]]) {
    for (const progress of [0, 0.13, 0.23, 0.5, 0.77, 0.99999]) for (const index of [3, 5, 15, 16, 21, 29]) {
      const [universe, name, mechanism] = examples[index], g = getStageAnimationWave8Geometry(mechanism, progress, width, height);
      const p = getStageAnimationProfile({ universe, name }), r = recorder();
      renderStageAnimation(r.ctx, { stage: { universe, name }, width, height, elapsedSeconds: p.periodSeconds * progress });
      assert.ok(g, mechanism);
      if (g.length) { assert.ok(Math.abs(distance(g.root, g.end) - g.length) < 1e-8); assert.ok(contains(r.operations, g.root) && contains(r.operations, g.end)); }
      if (g.trolley) {
        assert.ok(Math.abs(distance(g.trolley, g.cage) - g.hanger) < 1e-8);
        assert.ok(Math.abs(g.trolley[0] - g.start[0] - g.t * (g.end[0] - g.start[0])) < 1e-8);
        assert.ok(Math.abs(g.trolley[1] - g.start[1] - g.t * (g.end[1] - g.start[1])) < 1e-8);
        assert.ok(contains(r.operations, g.trolley) && contains(r.operations, g.cage));
      }
      if (g.arms) for (const arm of g.arms) {
        assert.ok(Math.abs(distance(arm.root, arm.elbow) - arm.lengths[0]) < 1e-8);
        assert.ok(Math.abs(distance(arm.elbow, arm.tip) - arm.lengths[1]) < 1e-8);
        assert.ok(contains(r.operations, arm.root) && contains(r.operations, arm.elbow) && contains(r.operations, arm.tip));
      }
      if (g.axles) {
        assert.ok(Math.abs(distance(...g.axles) - g.wheelbase) < 1e-8);
        assert.ok(Math.abs(distance(...g.pins) - g.wheelbase) < 1e-8);
        for (let i = 0; i < 2; i++) { assert.ok(Math.abs(distance(g.axles[i], g.pins[i]) - g.radius * .62) < 1e-8); assert.ok(contains(r.operations, g.axles[i]) && contains(r.operations, g.pins[i])); }
      }
      if (g.claw) { assert.equal(g.carriage[0], g.claw[0]); assert.ok(Math.abs(distance(g.carriage, g.claw) - g.ropeLength) < 1e-8); assert.ok(contains(r.operations, g.carriage) && contains(r.operations, g.claw)); }
      if (g.cableLength) { assert.equal(g.drum[1], g.end[1]); assert.ok(Math.abs(distance(g.drum, g.end) - g.cableLength) < 1e-8); assert.ok(contains(r.operations, g.drum) && contains(r.operations, g.end)); }
    }
  }
});
