import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import {
  getStageAnimationFrame,
  getStageAnimationProfile,
  renderStageAnimation,
  STAGE_ANIMATION_PROFILES
} from '../src/game/melee/stageAnimationCatalog.js';
import { getStageAtmosphereProfile, renderStageAtmosphere } from '../src/game/melee/stageAtmosphere.js';

const context = () => {
  const operations = [];
  const ctx = Object.fromEntries(['save', 'restore', 'beginPath', 'closePath', 'rect', 'clip', 'arc', 'ellipse', 'moveTo', 'lineTo', 'stroke', 'fill', 'fillRect', 'strokeRect'].map(name => [name, (...args) => operations.push([name, ...args])]));
  ctx.drawImage = (image, ...args) => operations.push(['drawImage', image.src, ...args]);
  for (const name of ['globalAlpha', 'globalCompositeOperation', 'lineWidth', 'strokeStyle', 'fillStyle', 'imageSmoothingEnabled']) {
    Object.defineProperty(ctx, name, { set(value) { operations.push([name, value]); } });
  }
  return { ctx, operations };
};
const draw = (stage, elapsedSeconds, options = {}) => {
  const { ctx, operations } = context();
  assert.equal(renderStageAnimation(ctx, { stage, width: 1040, height: 460, elapsedSeconds, ...options }), true);
  return operations;
};
const examples = [
  ['ff7-reactor-mako-circulation', 'Final Fantasy VII', 'Mako Reactor 1'],
  ['dbz-cell-games-cloud-drift', 'Dragon Ball Z', 'Cell Games arena'],
  ['dbz-namek-water-refraction', 'Dragon Ball Z', 'Namek battlefield'],
  ['dbz-time-chamber-hourglasses', 'Dragon Ball Z', 'Hyperbolic Time Chamber'],
  ['naruto-forest-canopy-wind', 'Naruto', 'Chunin Exams Forest of Death'],
  ['naruto-valley-waterfall-current', 'Naruto', 'Valley of the End'],
  ['matrix-operator-terminal-refresh', 'The Matrix', 'Nebuchadnezzar operator station'],
  ['matrix-authored-digital-curtain', 'The Matrix', 'Zion Digital Pipeline'],
  ['doom-uac-mars-cooling-cycle', 'Doom', 'UAC Mars cooling room'],
  ['doom-nekravol-chain-and-gate-cycle', 'Doom', 'Nekravol Argent Tower'],
  ['halo-truth-and-reconciliation-gravity-lift', 'Halo', 'Truth and Reconciliation night canyon'],
  ['halo-installation04-forerunner-beacons', 'Halo', 'Installation 04 Ring'],
  ['stargate-sgc-four-phase-event-horizon', 'Stargate', 'SGC gate room'],
  ['portal-aperture-wall-aperture-phases', 'Portal', 'Aperture test chamber'],
  ['rick-morty-garage-portal-phases', 'Rick & Morty', 'Smith garage portal'],
  ['daft-punk-alive-led-sequencer', 'Daft Punk', 'Alive 2007 LED pyramid'],
  ['demon-slayer-infinity-background-screens', 'Demon Slayer', 'Infinity Castle']
];
const waveTwoExamples = [
  ['resident-evil-rpd-reception-console', 'Resident Evil', 'RPD main hall reception'],
  ['resident-evil-spencer-dining-clock', 'Resident Evil', 'Spencer dining room clock'],
  ['half-life-sector-c-spectrometer-rotor', 'Half-Life', 'Black Mesa Sector C test chamber'],
  ['half-life-black-mesa-transit-tram', 'Half-Life', 'Black Mesa transit tram'],
  ['bioshock-bathysphere-pressure-winch', 'BioShock', 'Rapture bathysphere station'],
  ['bioshock-hephaestus-core-regulators', 'BioShock', 'Hephaestus Core'],
  ['silent-hill-toluca-rowboat-wake', 'Silent Hill', 'Toluca Lake crossing'],
  ['silent-hill-lakeside-carousel', 'Silent Hill', 'Lakeside Amusement Park carousel'],
  ['alien-nostromo-mother-relay-panels', 'Alien', 'Nostromo MU/TH/UR room'],
  ['alien-nostromo-airlock-pressure-cycle', 'Alien', 'Nostromo technical airlock'],
  ['predator-jungle-waterfall-vines', 'Predator', 'Dutch jungle waterfall'],
  ['predator-dutch-counterweight-ropes', 'Predator', 'Dutch trap preparation counterweight'],
  ['terminator-2029-hk-searchlight', 'Terminator', 'Los Angeles 2029 Future War'],
  ['terminator-factory-hydraulic-press', 'Terminator', 'Automated factory hydraulic press'],
  ['sonic-green-hill-sunflowers', 'Sonic', 'Green Hill Zone'],
  ['sonic-scrap-brain-conveyor-gears', 'Sonic', 'Scrap Brain Zone'],
  ['back-future-1955-clocktower-escapement', 'Back to the Future', 'Hill Valley 1955 clock tower before the strike'],
  ['back-future-doc-garage-flux-capacitor', 'Back to the Future', 'Doc garage flux capacitor'],
  ['dino-crisis-ibis-reactor-regulation', 'Dino Crisis', 'Ibis Third Energy reactor'],
  ['dino-crisis-ibis-perimeter-beacons', 'Dino Crisis', 'Ibis facility perimeter gate'],
  ['aliens-hadleys-hope-operations-display', 'Aliens', 'Hadleys Hope operations room'],
  ['aliens-atmosphere-processor-pressure-valves', 'Aliens', 'Atmosphere processor exterior valves'],
  ['alien3-fiorina-leadworks-ladle-hoist', 'Alien 3', 'Fiorina 161 leadworks furnace'],
  ['alien3-fiorina-mold-cooling-sprinklers', 'Alien 3', 'Fiorina 161 mold cooling sprinklers']
];
examples.push(...waveTwoExamples);

test('scene mechanisms are explicit and retain source and rendering provenance', () => {
  assert.equal(STAGE_ANIMATION_PROFILES.filter(profile => examples.some(([id]) => id === profile.id)).length, examples.length);
  for (const [id, universe, name] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.equal(p?.id, id, name);
    assert.ok(p.sourceWork.length > 10);
    assert.ok(p.sourceReference.startsWith('https://') || p.sourceReference.startsWith('public/'));
    assert.ok(p.sourceScene.length > 15);
    assert.ok(p.periodSeconds >= 7);
    assert.equal(p.gameplayEffect, 'none');
    assert.equal(p.sourceVisualValidation, 'not-validated-1:1');
    assert.ok(Object.isFrozen(p));
    assert.ok(Object.isFrozen(p.localAssetPaths));
    assert.equal(getStageAnimationProfile({ universe, name: p.sourceScene })?.id, id, 'Authored sourceScene does not resolve to its own mechanism');
  }
});

test('mode reference scenes follow the actual distinct local environments', () => {
  assert.equal(getStageAnimationProfile({ universe: 'Dragon Ball Z', mode: 'Combat' }).id, 'dbz-cell-games-cloud-drift');
  assert.equal(getStageAnimationProfile({ universe: 'Dragon Ball Z', mode: 'Smash' }).id, 'dbz-namek-water-refraction');
  assert.equal(getStageAnimationProfile({ universe: 'Dragon Ball Z', mode: 'RPG' }).id, 'dbz-time-chamber-hourglasses');
  assert.equal(getStageAnimationProfile({ universe: 'Naruto', mode: 'Fighter' }).id, 'naruto-forest-canopy-wind');
  assert.equal(getStageAnimationProfile({ universe: 'Naruto', mode: 'Melee' }).id, 'naruto-valley-waterfall-current');
  assert.equal(getStageAnimationProfile({ universe: 'Halo', mode: 'Tactics' }).id, 'halo-installation04-forerunner-beacons');
  assert.equal(getStageAnimationProfile({ universe: 'Halo', mode: 'Combat' }).id, 'halo-truth-and-reconciliation-gravity-lift');
  for (const mode of ['Combat', 'Smash', 'RPG', 'Tactics']) {
    assert.equal(getStageAnimationProfile({ universe: 'Final Fantasy VII', mode }).id, 'ff7-reactor-mako-circulation');
  }
});

test('a concrete scene prevents unrelated mode defaults or foreign-universe assets', () => {
  assert.equal(getStageAnimationProfile({ universe: 'Dragon Ball Z', name: 'Namek battlefield', mode: 'Combat' }).id, 'dbz-namek-water-refraction');
  assert.equal(getStageAnimationProfile({ universe: 'Dragon Ball Z', name: 'Cell Games arena', mode: 'RPG' }).id, 'dbz-cell-games-cloud-drift');
  assert.equal(getStageAnimationProfile({ universe: 'Naruto', name: 'Forest of Death', mode: 'Smash' }).id, 'naruto-forest-canopy-wind');
  assert.equal(getStageAnimationProfile({ universe: 'Final Fantasy VII', name: 'Aerith church timber hall' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'Demon Slayer', name: 'Mount Natagumo forest' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'Halo', name: 'New Mombasa streets' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'The Matrix', name: 'Ordinary timber library hall' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'Unknown Universe', name: 'Mako Reactor 1' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'Portal', name: 'SGC gate room' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'Stargate Atlantis', name: 'Atlantis gate room' }), null, 'SG-1 artwork was transplanted into a different gate design');
  assert.equal(getStageAnimationProfile({ universe: 'Back to the Future', name: 'Hill Valley 1985 stopped clock tower' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'Back to the Future', name: 'Hill Valley 1955 clock tower after lightning strike' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'Back to the Future', name: 'Hill Valley 1955 horloge arrêtée après la foudre' }), null);
  assert.equal(getStageAnimationProfile({ universe: 'Alien 3', name: 'Fiorina leadworks mold cooling sprinklers' }).id, 'alien3-fiorina-mold-cooling-sprinklers');
});

test('scene mechanisms render deterministic finite geometry behind the combat lane', () => {
  const signatures = new Set();
  for (const [id, universe, name] of examples) {
    const stage = { universe, name };
    const before = structuredClone(stage);
    const p = getStageAnimationProfile(stage);
    const first = draw(stage, p.periodSeconds * 0.23);
    assert.deepEqual(first, draw(stage, p.periodSeconds * 0.23), id);
    assert.notDeepEqual(first, draw(stage, 0), id);
    assert.deepEqual(stage, before);
    assert.deepEqual(first.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, 460 * 0.065, 1040, 460 * 0.55], ['clip']]);
    assert.deepEqual(first.at(-1), ['restore']);
    for (const op of first) {
      for (const number of op.slice(1).filter(value => typeof value === 'number')) assert.ok(Number.isFinite(number), id);
      if (op[0] === 'globalAlpha') assert.ok(op[1] >= 0 && op[1] <= 0.2, id);
    }
    signatures.add(JSON.stringify(first));
  }
  assert.ok(signatures.size >= 14, 'Distinct mechanisms collapsed to one shared ambience');
});

test('pause, reduced motion and animation-off keep the scene state stable', () => {
  for (const [, universe, name] of examples) {
    const stage = { universe, name };
    assert.deepEqual(draw(stage, 8, { reducedMotion: true }), draw(stage, 80, { reducedMotion: true }));
    assert.deepEqual(draw({ ...stage, reducedMotion: true }, 8), draw({ ...stage, reducedMotion: true }, 80));
    assert.deepEqual(draw(stage, NaN), draw(stage, 0));
    assert.deepEqual(draw(stage, 8), draw(stage, 8), 'same paused simulation time advanced animation');
    for (const key of ['disableStageAnimations', 'disableStageAtmosphere']) {
      const { ctx, operations } = context();
      assert.equal(renderStageAnimation(ctx, { stage: { ...stage, [key]: true }, width: 1040, height: 460 }), false);
      assert.deepEqual(operations, []);
    }
  }
});

test('four-phase local effect atlases are played from their real distinct transparent cells', async () => {
  const atlases = STAGE_ANIMATION_PROFILES.filter(p => p.atlas);
  assert.equal(atlases.length, 4);
  for (const p of atlases) {
    const path = fileURLToPath(new URL('../public' + p.atlas.path, import.meta.url));
    assert.ok(fs.existsSync(path));
    const m = await sharp(path).metadata();
    assert.equal(m.width, 1024);
    assert.equal(m.height, 256);
    assert.ok(m.hasAlpha);
    const hashes = new Set();
    for (let frame = 0; frame < 4; frame++) {
      const { data, info } = await sharp(path).extract({ left: frame * 256, top: 0, width: 256, height: 256 }).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      hashes.add(crypto.createHash('sha256').update(data).digest('hex'));
      let visible = 0;
      let transparent = 0;
      for (let pixel = 3; pixel < data.length; pixel += info.channels) {
        if (data[pixel] > 16) visible++;
        if (data[pixel] < 4) transparent++;
      }
      assert.ok(visible > 200 && transparent > 200, `${p.id} cell ${frame}`);
    }
    assert.equal(hashes.size, 4, `${p.id} repeats a still cell`);
    const stage = { universe: p.universes[0], name: examples.find(e => e[0] === p.id)[2] };
    const selected = new Set(Array.from({ length: 8 }, (_, index) => getStageAnimationFrame(stage, p.periodSeconds * (index + 0.01) / 8).frameIndex));
    assert.deepEqual([...selected].sort(), [0, 1, 2, 3]);
    assert.equal(getStageAnimationFrame(stage, p.periodSeconds).frameIndex, getStageAnimationFrame(stage, 0).frameIndex);
  }
});

test('actual bitmaps are decoded and cropped by source cell or backdrop region', () => {
  const OriginalImage = globalThis.Image;
  globalThis.Image = class {
    complete = true;
    naturalWidth = 1024;
    naturalHeight = 256;
    set src(value) {
      this.path = value;
      if (!value.includes('portal-effects')) { this.naturalWidth = 1672; this.naturalHeight = 941; }
      this.onload?.();
    }
    get src() { return this.path; }
  };
  try {
    const stage = { universe: 'Stargate', name: 'SGC gate room' };
    const before = draw(stage, 0).find(op => op[0] === 'drawImage');
    const dormant = draw(stage, 21).find(op => op[0] === 'drawImage');
    assert.equal(before[1], '/visuals/cosmetics/openai/universes/stargate/portal-effects-atlas.webp');
    assert.deepEqual(before.slice(2, 6), [512, 0, 256, 256]);
    assert.deepEqual(dormant.slice(2, 6), [0, 0, 256, 256]);
    const mako = draw({ universe: 'Final Fantasy VII', name: 'Mako Reactor 1', mode: 'Combat' }, 3).find(op => op[0] === 'drawImage');
    assert.equal(mako[1], '/backgrounds/lore-stages/final-fantasy-vii/combat.webp');
    assert.equal(mako[2], 1672 * 0.4);
    assert.equal(mako[3], 941 * 0.46);
    assert.equal(mako[4], 1672 * 0.2);
    assert.equal(mako[5], 941 * 0.17);
    const incompatible = draw({ universe: 'Naruto', name: 'Valley of the End', mode: 'Combat' }, 3);
    assert.equal(incompatible.some(op => op[0] === 'drawImage'), false, 'Melee waterfall bitmap was painted over the Combat forest');
    const fiorina = draw({ universe: 'Alien 3', name: 'Fiorina leadworks furnace', mode: 'Combat' }, 3).find(op => op[0] === 'drawImage');
    assert.equal(fiorina[1], '/backgrounds/lore-stages/alien-3/combat.webp');
    assert.deepEqual(fiorina.slice(2, 6), [1672 * 0.11, 941 * 0.43, 1672 * 0.07, 941 * 0.14]);
    const ibis = draw({ universe: 'Dino Crisis', name: 'Ibis perimeter gate', mode: 'Melee' }, 3).find(op => op[0] === 'drawImage');
    assert.equal(ibis[1], '/backgrounds/dino-crisis-smash-openai.png');
    assert.deepEqual(ibis.slice(2, 6), [1672 * 0.17, 941 * 0.12, 1672 * 0.04, 941 * 0.07]);
  } finally {
    if (OriginalImage === undefined) delete globalThis.Image;
    else globalThis.Image = OriginalImage;
  }
});

test('the second wave adds 24 sourced mechanisms in 12 new universes without inventing animation frames', async () => {
  const originalUniverses = new Set(examples.slice(0, 17).map(([, universe]) => universe));
  const addedUniverses = new Set(waveTwoExamples.map(([, universe]) => universe));
  assert.equal(waveTwoExamples.length, 24);
  assert.equal(addedUniverses.size, 12);
  for (const universe of addedUniverses) assert.equal(originalUniverses.has(universe), false, universe);
  let localStillRegions = 0;
  for (const [id, universe, name] of waveTwoExamples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.equal(p.id, id);
    assert.equal(p.animationProvenance, 'authored-scene-geometry-and-timing');
    assert.equal(p.timeSource, 'simulation-elapsed-seconds');
    assert.equal(p.reducedMotionBehavior, 'freeze-at-time-zero');
    assert.ok(p.sceneEvidence.length > 80);
    assert.equal(p.atlas, undefined);
    assert.equal(getStageAnimationFrame({ universe, name }, 2).frameCount, 0);
    for (const spec of Object.values(p.localBackdrops)) {
      localStillRegions++;
      const path = fileURLToPath(new URL('../public' + spec.path, import.meta.url));
      const metadata = await sharp(path).metadata();
      assert.ok(metadata.width > 1000 && metadata.height > 500);
      assert.ok(!metadata.pages || metadata.pages === 1, 'a still backdrop was declared to contain animation frames');
      assert.ok(spec.region.x + spec.region.width <= 1 && spec.region.y + spec.region.height <= 1);
    }
  }
  assert.equal(localStillRegions, 5);
});

test('new mechanisms keep physical geometry, backdrop coordinates and fighter mirror independence', () => {
  const w = 1040, h = 460;
  const tram = { universe: 'Half-Life', name: 'Black Mesa transit tram' };
  const tramBody = time => draw(tram, time).find(op => op[0] === 'strokeRect' && op[3] === w * 0.12 && op[4] === h * 0.075);
  assert.equal(tramBody(0)[1], w * -0.12);
  assert.equal(tramBody(22.5)[1], w * 0.5);
  const clock = { universe: 'Resident Evil', name: 'Spencer dining room clock' };
  const bob = time => draw(clock, time).find(op => op[0] === 'ellipse' && op[3] === h * 0.011);
  assert.equal(bob(0)[1], w * 0.115);
  assert.equal(bob(0)[2], h * 0.18 + h * 0.11 + h * 0.105);
  assert.ok(bob(3)[1] > bob(0)[1], 'clock pendulum did not swing to the right');
  const press = { universe: 'Terminator', name: 'Automated factory hydraulic press' };
  const platen = time => draw(press, time).find(op => op[0] === 'strokeRect' && op[3] === w * 0.082);
  assert.equal(platen(0)[2], h * 0.305);
  assert.equal(platen(11)[2], h * 0.305 + h * 0.07);
  assert.ok(platen(11)[2] + platen(11)[4] < h * 0.475, 'decorative press closed onto its base');
  for (const [, universe, name] of waveTwoExamples) {
    const stage = { universe, name };
    assert.deepEqual(draw(stage, 2), draw({ ...stage, facing: -1, flipX: true, mirror: true, cameraX: 400 }, 2), name);
    for (const [width, height] of [[360, 780], [1920, 480], [512, 512]]) {
      const { ctx, operations } = context();
      assert.equal(renderStageAnimation(ctx, { stage, width, height, elapsedSeconds: 2 }), true);
      assert.deepEqual(operations.slice(0, 4), [['save'], ['beginPath'], ['rect', 0, height * 0.065, width, height * 0.55], ['clip']]);
      for (const op of operations) for (const number of op.slice(1).filter(v => typeof v === 'number')) assert.ok(Number.isFinite(number));
    }
  }
});

test('the battle background entrypoint actually dispatches the selected scene mechanism', () => {
  const stage = { universe: 'Final Fantasy VII', name: 'Mako Reactor 1', mode: 'Combat' };
  const { ctx, operations } = context();
  assert.equal(renderStageAtmosphere(ctx, { stage, width: 1040, height: 460, elapsedSeconds: 3 }), true);
  assert.deepEqual(operations, draw(stage, 3));
  const profile = getStageAtmosphereProfile(stage);
  assert.equal(profile.sceneAnimation.id, 'ff7-reactor-mako-circulation');
  assert.equal(profile.renderingKind, 'static-backdrop-compositing-and-authored-mechanism');
});
