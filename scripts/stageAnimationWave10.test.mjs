import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile, getStageAnimationFrame, renderStageAnimation } from '../src/game/melee/stageAnimationCatalog.js';
import { STAGE_ANIMATION_WAVE_10, WAVE_10_MODE_REFERENCE_SCENES, getStageAnimationWave10Geometry } from '../src/game/melee/stageAnimationCatalogWave10.js';

const baseline = JSON.parse(readFileSync(new URL('../docs/combat-fidelity-wave10-2026-10-23/stage-baseline.json', import.meta.url), 'utf8'));
const hash = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const examples = STAGE_ANIMATION_WAVE_10.map(p => [p.universes[0], p.sourceScene, p.mechanism]);
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

test('wave10 preserves the 241 previous definitions and all 482 drawing-command hashes', () => {
  assert.equal(baseline.profiles.length, 241);
  assert.equal(baseline.profiles.reduce((n, p) => n + p.samples.length, 0), 482);
  const throughWave10 = STAGE_ANIMATION_PROFILES.filter(p => !p.animationWave || p.animationWave <= 10);
  assert.equal(throughWave10.length, 321);
  assert.equal(new Set(STAGE_ANIMATION_PROFILES.map(p => p.id)).size, STAGE_ANIMATION_PROFILES.length);
  for (const original of baseline.profiles) {
    const current = STAGE_ANIMATION_PROFILES.find(p => p.id === original.id);
    assert.deepEqual(JSON.parse(JSON.stringify(current, (_, v) => v instanceof RegExp ? v.toString() : v)), original.definition, original.id);
    assert.equal(getStageAnimationProfile(original.stage)?.id, original.id);
    for (const sample of original.samples) assert.equal(hash(draw(original.stage, sample.time)), sample.sha256, `${original.id} at ${sample.time}`);
  }
});

test('80 explicitly sourced mechanisms cover 40 real previously uncovered universes', () => {
  assert.equal(STAGE_ANIMATION_WAVE_10.length, 80);
  const roster = new Set(HEROES_DB.map(hero => hero.universe)), old = new Set(baseline.profiles.flatMap(p => p.definition.universes)), counts = new Map();
  for (const [universe, name, mechanism] of examples) {
    const p = getStageAnimationProfile({ universe, name });
    assert.ok(roster.has(universe)); assert.equal(old.has(universe), false);
    assert.equal(p?.mechanism, mechanism, name); assert.equal(p.animationWave, 10);
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
  assert.equal(counts.size, 40); assert.ok([...counts.values()].every(n => n === 2));
});

test('precise scenes and continuity exclusions resolve before all four mode defaults', () => {
  const rejected = STAGE_ANIMATION_WAVE_10.map(p => [p.universes[0],p.sourceScene+' destroyed']);
  const variants = [
    ['Breaking Bad','el camino'], ['La Casa de Papel','korea'], ['The Da Vinci Code','inferno'], ['Home Alone','home alone 2'], ['Men in Black','international'], ['Starship Troopers','outpost 29'], ['H2G2','infocom'], ['Inside Out','inside out 2'], ['Zootopia','zootopia 2'], ['Chappie','district 9'], ['BlazBlue','embryo'], ['Killzone','shadow fall'], ['Jet Set Radio','future'], ['Streets of Rage','game gear'], ['Parasite Eve','parasite eve 2'], ['Dead by Daylight','event generator'], ['Crysis','remastered'], ['F.E.A.R.','extraction point'], ['Remember Me','remix'], ['The Binding of Isaac: Rebirth','repentance'], ['Stranger Things','season 1'], ['Prometheus','occupied'], ['Alien Resurrection','covenant'], ['Alien: Covenant','romulus'], ['Alien: Romulus','early draft'], ['Predator 2','prey 2022'], ['Predators','badlands'], ['Alien vs Predator','requiem'], ['Prey (2006)','talos'], ["Assassin's Creed",'odyssey'], ['Warhammer 40,000: Space Marine','space marine 2'], ['Tail Concerto','solatorobo'], ['Natural Selection 2','alien harvester'], ['Nemesis — Awaken Realms','lockdown'], ['Phantasmagoria','puzzle of flesh'], ['The Ball','2008 mod'], ['Turok','dinosaur hunter'], ['Hotline Miami','wrong number'], ['Lilo & Stitch','2025'], ['Spy Kids','armageddon']
  ];
  assert.equal(variants.length,40);
  for (const [universe,variant] of variants) for(const p of STAGE_ANIMATION_WAVE_10.filter(p=>p.universes.includes(universe))) rejected.push([universe,p.sourceScene+' '+variant]);
  for (const [universe, name] of rejected) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) assert.equal(getStageAnimationProfile({ universe, name, mode }), null, `${universe}/${name}/${mode}`);
  for (const [universe, name] of examples) for (const mode of ['Combat', 'Melee', 'RPG', 'Tactics']) {
    assert.equal(getStageAnimationProfile({ universe, mode })?.animationWave, 10);
    assert.equal(getStageAnimationProfile({ universe, name, mode })?.id, getStageAnimationProfile({ universe, name })?.id);
    assert.equal(getStageAnimationProfile({ universe, name: 'Quiet ordinary room', mode }), null);
    assert.equal(getStageAnimationProfile({ universe: 'Unknown Universe', name, mode }), null);
  }
  assert.equal(Object.keys(WAVE_10_MODE_REFERENCE_SCENES).length, 40);
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

test('eleven real drawn mechanisms obey rigid hinges, scissor links, crank rods, clamps and circular guides', () => {
  const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
  const contains=(ops,p)=>ops.some(op=>['moveTo','lineTo','ellipse'].includes(op[0])&&Math.abs(op[1]-p[0])<1e-8&&Math.abs(op[2]-p[1])<1e-8);
  const constrained=STAGE_ANIMATION_WAVE_10.filter(p=>getStageAnimationWave10Geometry(p.mechanism,0,1040,460));
  assert.equal(constrained.length,11);
  for(const [width,height] of [[1040,460],[360,780],[1920,480],[512,512]])for(const t of [0,.13,.23,.5,.77,.99999])for(const p of constrained){
    const g=getStageAnimationWave10Geometry(p.mechanism,t,width,height),r=recorder();
    renderStageAnimation(r.ctx,{stage:{universe:p.universes[0],name:p.sourceScene},width,height,elapsedSeconds:p.periodSeconds*t});
    if(g.type==='rigid-hinge'){assert.ok(Math.abs(distance(g.root,g.end)-g.length)<1e-8);assert.ok(contains(r.operations,g.root)&&contains(r.operations,g.end));}
    if(g.type==='scissor'){for(let i=1;i<g.points.length;i++)assert.ok(Math.abs(distance(g.points[i-1],g.points[i])-g.length)<1e-8);for(const point of g.points)assert.ok(contains(r.operations,point));}
    if(g.type==='crank-slider')for(const rod of g.rods){assert.ok(Math.abs(distance(rod.root,rod.crank)-rod.radius)<1e-8);assert.ok(Math.abs(distance(rod.crank,rod.slider)-rod.length)<1e-8);assert.equal(rod.slider[1],rod.root[1]);for(const point of [rod.root,rod.crank,rod.slider])assert.ok(contains(r.operations,point));}
    if(g.type==='rigid-arms')for(const arm of g.arms){assert.ok(Math.abs(distance(arm.root,arm.elbow)-arm.lengths[0])<1e-8);assert.ok(Math.abs(distance(arm.elbow,arm.tip)-arm.lengths[1])<1e-8);for(const point of [arm.root,arm.elbow,arm.tip])assert.ok(contains(r.operations,point));}
    if(g.type==='bridge')for(const leaf of g.leaves){assert.ok(Math.abs(distance(leaf.root,leaf.end)-leaf.length)<1e-8);assert.ok(contains(r.operations,leaf.root)&&contains(r.operations,leaf.end));}
    if(g.type==='circular-marker'){assert.ok(Math.abs(distance(g.center,g.marker)-g.radius)<1e-8);assert.ok(contains(r.operations,g.marker));}
    if(g.type==='counterrotation')g.ends.forEach((point,i)=>{assert.ok(Math.abs(distance(g.center,point)-g.radii[i])<1e-8);assert.ok(contains(r.operations,point));});
  }
});
