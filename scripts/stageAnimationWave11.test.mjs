import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_11, WAVE_11_MODE_REFERENCE_SCENES, getStageAnimationWave11Geometry } from '../src/game/melee/stageAnimationCatalogWave11.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave11-2026-10-23/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = STAGE_ANIMATION_WAVE_11.map(p => [p.universes[0], p.sourceScene, p.mechanism]);
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
const geometry = ops => ops.filter(op => ['rect', 'arc', 'ellipse', 'moveTo', 'lineTo', 'quadraticCurveTo', 'bezierCurveTo', 'strokeRect', 'fillRect', 'translate', 'rotate'].includes(op[0]));

test('wave11 preserves the 321 previous definitions and all 642 drawing-command hashes', () => {
  assert.equal(baseline.profiles.length, 321);
  assert.equal(baseline.profiles.reduce((n, p) => n + p.samples.length, 0), 642);
  const throughWave11 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 11);
  assert.equal(throughWave11.length, 401);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, v) => v instanceof RegExp ? v.toString() : v)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} at ${sample.time}`);
  }
});

test('80 explicitly sourced mechanisms cover 40 real previously uncovered universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_11.length, 80);
  const roster = new Set(HEROES_DB.map(hero => hero.universe)), old = new Set(baseline.profiles.flatMap(p => p.definition.universes)), counts = new Map();
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(roster.has(universe)); assert.equal(old.has(universe), false);
    assert.equal(p?.mechanism, mechanism, name); assert.equal(p.animationWave, 11);
    assert.equal(p.sourceVisualValidation, 'not-validated-1:1'); assert.equal(p.fidelityVerified, false); assert.equal(p.officialSourceFrames, false);
    assert.equal(p.gameplayEffect, 'none'); assert.equal(p.renderingKind, 'authored-mechanism');
    assert.equal(p.animationProvenance, 'authored-scene-architecture-landscape-geometry-and-timing');
    assert.equal(p.timeSource, 'simulation-elapsed-seconds'); assert.equal(p.reducedMotionBehavior, 'freeze-at-time-zero');
    assert.ok(p.sourceWork && p.sourceScene && p.continuity && p.sourceAccess);
    assert.ok(p.sourceReference.startsWith('https://')); assert.ok(p.sceneEvidence.length > 120);
    assert.deepEqual(p.localAssetPaths, []); assert.equal(p.atlas, undefined);
    assert.equal(getStageAnimationFrame({ universe, name }, 1).frameCount, 0);
    assert.equal(getStageAnimationProfile({ universe, name: p.sourceScene })?.id, p.id, p.sourceScene);
    counts.set(universe, (counts.get(universe) || 0) + 1);
  }
  assert.equal(counts.size, 40); assert.ok([...counts.values()].every(n => n === 2));
});

test('precise scenes and continuity exclusions resolve before all four mode defaults', () => {
  const rejected = STAGE_ANIMATION_WAVE_11.map(p => [p.universes[0],p.sourceScene+' destroyed']);
  const variants = [
    ['The Dark Knight','rises'],['Ghosts of Mars','overload'],['Small Soldiers','video game'],['The Truman Show','storm'],['John Wick','chapter 4'],['The Conjuring','enfield'],['Insidious','2023'],['The Ring','ringu'],['The Grudge','2020'],['REC','rec 2'],['Sinister','sinister 2'],['28 Days Later','28 years'],['Day of the Dead','2008'],['Night of the Living Dead','1990'],['Land of the Dead','explosion'],['Zombi','zombiu'],['Kill Bill','volume 2'],['Rocky','creed'],['Rambo','1985'],['Commando','val verde'],['The Silence of the Lambs','hannibal'],['Ash vs Evil Dead','season 2'],['Evil Dead (2013)','1981'],['Last Action Hero','2025'],['Mars Attacks','1962'],['Iron Sky','coming race'],['Roger Rabbit','1989 game'],['Minions','rise of gru'],['Ice Age','meltdown'],["Avatar (Na'vi)",'way of water'],['Godzilla','shin'],['The Creator','2010'],['Tremors','tremors 2'],['War of the Worlds','1953'],['Charmed','2018'],['Buffy the Vampire Slayer','1992'],['Death Note','2017'],['Squid Game','season 2'],['From','season 2'],['The Simpsons','treehouse']
  ];
  assert.equal(variants.length,40);
  for (const [universe,variant] of variants) for(const p of STAGE_ANIMATION_WAVE_11.filter(p=>p.universes.includes(universe))) rejected.push([universe,p.sourceScene+' '+variant]);
  for (const [universe, name] of rejected) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, name, mode }), null, `${universe}/${name}/${mode}`);
  for (const [universe, name] of examples) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
    assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 11);
    assert.equal(getStageAnimationProfile({ universe, name, mode })?.id, getStageAnimationProfile({ universe, name })?.id);
    assert.equal(getStageAnimationProfile({ universe, name: 'Quiet ordinary room', mode }), null);
    assert.equal(getStageAnimationProfile({ universe: 'Unknown Universe', name, mode }), null);
  }
  assert.equal(Object.keys(WAVE_11_MODE_REFERENCE_SCENES).length, 40);
});

test('all 80 mechanisms change real geometry deterministically without changing gameplay', () => {
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
  assert.equal(signatures.size, 80);
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

test('actual drawn hinges, pendulums, lift ropes and clock hands retain physical lengths in four formats', () => {
  const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const contains=(ops,p)=>ops.some(op=>['moveTo','lineTo','ellipse'].includes(op[0])&&Math.abs(op[1]-p[0])<1e-8&&Math.abs(op[2]-p[1])<1e-8);
  let hingeChecks=0,pendulumChecks=0,liftChecks=0,clockChecks=0;
  for(const [width,height] of [[1040,460],[360,780],[1920,480],[512,512]])for(const t of [0,.13,.23,.5,.77,.99999])for(const p of STAGE_ANIMATION_WAVE_11){
    assert.equal(Object.isFrozen(p.blueprint),true);assert.ok(p.blueprint.every(Object.isFrozen));
    const g=getStageAnimationWave11Geometry(p,t,width,height),r=recorder();
    renderStageAnimation(r.ctx,{stage:{universe:p.universes[0],name:p.sourceScene},width,height,elapsedSeconds:p.periodSeconds*t});
    for(const part of g){
      assert.ok([part.x,part.y,part.w,part.h,...part.options].every(Number.isFinite),p.id+'/finite blueprint geometry');
      if(part.kind==='hinge'||part.kind==='bamboo'||part.kind==='pendulum'){
        assert.ok(Math.abs(distance(part.root,part.end)-part.w)<1e-8,p.id+'/rigid length');
        assert.ok(contains(r.operations,part.root)&&contains(r.operations,part.end),p.id+'/coordinates used by draw');
        if(part.kind==='pendulum'){assert.ok(Math.abs(part.angle-Math.PI/2)<=.15);assert.ok(part.options[1]>=5);pendulumChecks++;}else hingeChecks++;
      }
      if(part.kind==='lift'){
        const travel=part.options[0]*Math.min(width,height);assert.ok(part.offset>=0&&part.offset<=travel);
        const deck=r.operations.find(op=>op[0]==='strokeRect'&&Math.abs(op[2]-(part.y+part.offset))<1e-8);assert.ok(deck,p.id+'/actual translated deck');
        for(const x of [part.x+part.w*.25,part.x+part.w*.75])assert.ok(contains(r.operations,[x,part.y+part.offset]));liftChecks++;
      }
      if(part.kind==='clock'){
        for(const [i,end] of part.ends.entries()){assert.ok(Math.abs(distance([part.x,part.y],end)-part.w*(i?.44:.68))<1e-8);assert.ok(contains(r.operations,end));}clockChecks++;
      }
    }
  }
  assert.ok(hingeChecks>=24*15);assert.equal(pendulumChecks,24*2);assert.equal(liftChecks,24*3);assert.equal(clockChecks,24);
});

