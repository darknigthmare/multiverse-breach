import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const root = new URL('../../', import.meta.url), directory = new URL('./', import.meta.url);
const prefix = 'docs/combat-fidelity-wave12-2026-10-23/';
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const startedAt = new Date().toISOString();
const plan = json(prefix + 'batch-plan-before.json'), ids = Object.values(plan.parts).flat();
const initial = json(prefix + 'independent-review-initial.json');
const sourcePaths = [
  'src/game/engineFighter.js', 'src/game/engineRpg.js', 'src/game/combatIdentity.js', 'src/game/heroes.js',
  'src/game/rpgTargeting.js', 'src/game/combat/characterSuperVisuals.js',
  'src/game/combat/nativeSuperVisualsWave12.js', 'src/game/combat/presentationCatalog.js',
  'src/game/combat/presentationCatalogWave12.js', 'src/game/combat/combatSourceDefinitionsWave12.js',
  'src/game/combat/abilities/abilitiesWave12.js', 'src/game/combat/abilities/catalog.js',
  'src/game/combat/rosterReinforcementsWave12.js', 'src/game/combat/rosterSummonChoreographyWave12.js',
  'src/game/combat/rosterSummonChoreographyWave11.js', 'src/game/combat/summonAnimationCatalog.js',
  'src/game/combat/summonChoreography.js', 'src/game/combat/summonAnimationsWave12.generated.json',
  ...['A', 'B', 'C', 'D'].flatMap(part => [
    `src/game/combat/combatSourceDefinitionsWave12Part${part}.js`,
    `src/game/combat/abilities/abilitiesWave12Part${part}.js`,
    `src/game/combat/nativeSuperAnchorsWave12Part${part}.generated.json`,
    `src/game/combat/characterAnimationsWave12Part${part}.generated.json`,
    `src/game/combat/characterSpriteCorrectionsWave12Part${part}.generated.json`
  ]), prefix + 'batch-plan-before.json', prefix + 'independent-review-initial.json', prefix + 'independent-review.mjs'
];
const stageSourcePaths = fs.readdirSync(new URL('src/game/melee/', root))
  .filter(path => /^stageAnimationCatalog.*\.js$/.test(path)).map(path => 'src/game/melee/' + path);
const stageEvidencePaths = ['stage-browser.json', 'stage-browser.log', 'stage-browser.png', 'stage-browser-panel-1.png',
  'stage-browser-panel-2.png', 'browser/stage-animation.browser.mjs', 'browser/stage-animation-before.mjs']
  .map(path => prefix + path);
sourcePaths.push(...stageSourcePaths, ...stageEvidencePaths, prefix + 'production-freeze.json');
const sourceHashesBefore = Object.fromEntries(sourcePaths.map(path => [path, sha(read(path))]));
const checks = [], engines = [], noop = () => {};
const report = {
  date: '2026-10-23', startedAt, passed: false,
  reviewer: 'wave12_b; independent read-only review of the shared integration and other character parts',
  scope: 'Forty curated kits and source versions, same-universe partners, native visual gates, Fighter scripted presentation, RPG target camps and selected support status behavior. Part B pixels were reviewed independently by wave12_a.',
  source1to1Verified: false, officialFrameComparisonPerformed: false, newScreenshots: 0,
  sourceHashes: sourceHashesBefore, checks, resolvedFindings: [], risks: []
};
const check = async (name, evaluate) => {
  const at = new Date().toISOString();
  try { const details = await evaluate(); checks.push({ name, passed: true, evaluatedAt: at, ...details }); }
  catch (error) { checks.push({ name, passed: false, evaluatedAt: at, error: String(error.stack || error) }); }
};
const record = () => {
  const calls = [], stack = []; let props = { globalAlpha: 0.73, lineWidth: 7, strokeStyle: '#123456', fillStyle: '#654321' };
  const original = { ...props };
  const ctx = new Proxy({}, {
    get(_, key) {
      if (key in props) return props[key];
      if (key === 'save') return () => { stack.push({ ...props }); calls.push(['save']); };
      if (key === 'restore') return () => { assert.ok(stack.length, 'unbalanced restore'); props = stack.pop(); calls.push(['restore']); };
      if (key === 'createLinearGradient' || key === 'createRadialGradient') return () => ({ addColorStop: noop });
      return (...args) => { for (const arg of args) if (typeof arg === 'number') assert.ok(Number.isFinite(arg), `${String(key)} received non-finite input`); calls.push([key, ...args]); };
    }, set(_, key, value) { props[key] = value; return true; }
  });
  return { ctx, calls, balanced() { assert.equal(stack.length, 0); assert.deepEqual(props, original); } };
};
const visibleCalls = calls => calls.filter(call => ['ellipse', 'arc', 'lineTo', 'fillRect', 'strokeRect', 'drawImage', 'fillText'].includes(call[0]));
const versionFacts = {
  pyramidhead: ['2001', 'great-knife', 'damage', 'melee'], james_s: ['2001', 'steel-pipe', 'damage', 'melee'],
  heather: ['2003', 'handgun', 'damage', 'projectile'], harry_mason: ['1999', 'handgun', 'damage', 'projectile'],
  alessa_gillespie: ['1999', 'quiet-presence', 'guard', 'support'], maria_sh2: ['2001', 'safe-route', 'guard', 'support'],
  cybil_bennett: ['1999', 'police-handgun', 'damage', 'projectile'], claudia_wolf: ['2003', 'cult-instruction', 'buff', 'support'],
  regina: ['1999', 'handgun', 'damage', 'projectile'], dylan: ['2000', 'shotgun', 'damage', 'projectile'],
  predator: ['1987', 'wristblade', 'damage', 'melee'], city_hunter: ['1990', 'spear', 'damage', 'melee'],
  dutch: ['1987', 'rifle', 'damage', 'projectile'], anna_predator: ['1987', 'safe-route', 'guard', 'support'],
  billy_predator: ['1987', 'machete', 'damage', 'melee'], mac_predator: ['1987', 'machinegun', 'damage', 'projectile'],
  harrigan_predator: ['1990', 'pistol', 'damage', 'projectile'], greyback_yautja: ['1990', 'elder-trophy', 'guard', 'support'],
  naru: ['2022', 'hatchet', 'damage', 'melee'], royce_predators_core: ['2010', 'shotgun', 'damage', 'projectile'],
  ash_williams: ['1992', 'chainsaw', 'damage', 'melee'], annie_knowby: ['1987', 'book-reading', 'guard', 'support'],
  henry_red_ed: ['1992', 'sword', 'damage', 'melee'], pablo_evil_dead: ['2015', 'ritual-support', 'guard', 'support'],
  kelly_evil_dead: ['2015', 'shotgun', 'damage', 'projectile'], ruby_evil_dead: ['2015', 'dagger-guard', 'guard', 'support'],
  isaac: ['2008', 'plasma-cutter', 'damage', 'projectile'], carver: ['2013', 'military-rifle', 'damage', 'projectile'],
  ellie: ['2011', 'rifle', 'damage', 'projectile'], nicole_brennan: ['2008', 'medical-coordination', 'guard', 'support'],
  fry_futurama: ['1999–2003', 'parcel-relay', 'guard', 'support'], leela_futurama: ['1999–2003', 'martial-arts', 'damage', 'melee'],
  bender_futurama: ['1999–2003', 'robot-contact', 'damage', 'melee'], amy_futurama: ['1999–2003', 'engineering-diagnostic', 'buff', 'support'],
  hermes_futurama: ['1999–2003', 'bureaucratic-coordination', 'buff', 'support'], zoidberg_futurama: ['1999–2003', 'medical-advice', 'guard', 'support'],
  rick: ['2015', 'space-pistol', 'damage', 'projectile'], morty: ['2015', 'cover-signal', 'guard', 'support'],
  summer: ['2015', 'regroup-signal', 'guard', 'support'], birdperson: ['2015', 'wing-guard', 'guard', 'support']
};
let vite;
try {
  vite = await createServer({ root: fileURLToPath(root), appType: 'custom', logLevel: 'silent', server: { middlewareMode: true } });
  const { EngineFighter } = await vite.ssrLoadModule('/src/game/engineFighter.js');
  const { EngineRpg } = await vite.ssrLoadModule('/src/game/engineRpg.js');
  const { HEROES_DB } = await vite.ssrLoadModule('/src/game/heroes.js');
  const { resolveCombatAbility, resolveUniverseSummon, resolveCombatPresentation } = await vite.ssrLoadModule('/src/game/combatIdentity.js');
  const { COMBAT_SOURCE_DEFINITIONS_WAVE12: definitions } = await vite.ssrLoadModule('/src/game/combat/combatSourceDefinitionsWave12.js');
  const { resolvePresentationScript, samplePresentationScript, PRESENTATION_PHASES } = await vite.ssrLoadModule('/src/game/combat/presentationCatalog.js');
  const { supportsNativeSuperWave12, getNativeSuperVisualStateWave12: stateFor, drawNativeSuperVisualsWave12: drawNative } = await vite.ssrLoadModule('/src/game/combat/nativeSuperVisualsWave12.js');
  const { resolveSummonAnimationAsset: summonAsset, getSummonAnimationAssets } = await vite.ssrLoadModule('/src/game/combat/summonAnimationCatalog.js');
  const { ROSTER_REINFORCEMENTS_WAVE12: partners } = await vite.ssrLoadModule('/src/game/combat/rosterReinforcementsWave12.js');
  const { ROSTER_SUMMON_CHOREOGRAPHIES_WAVE12: choreographies, drawRosterSummonCueWave12: drawCue,
    projectNativeSummonEffectOriginWave12: projectSummon, usesConfirmedSummonContactWave12 } = await vite.ssrLoadModule('/src/game/combat/rosterSummonChoreographyWave12.js');
  const { projectNativeSummonEffectOriginWave11: projectPrevious } = await vite.ssrLoadModule('/src/game/combat/rosterSummonChoreographyWave11.js');
  const { rpgUnitId } = await vite.ssrLoadModule('/src/game/rpgTargeting.js');
  const hero = id => { const found = HEROES_DB.find(value => value.id === id); assert.ok(found, id); return found; };

  await check('Forty explicit versions and all 160 role-safe resolved commands', () => {
    assert.deepEqual(sorted(Object.keys(definitions)), sorted(ids)); assert.deepEqual(sorted(Object.keys(versionFacts)), sorted(ids));
    let damaging = 0, supportive = 0, commandCount = 0;
    const rows = [];
    for (const id of ids) {
      const d = definitions[id], expected = versionFacts[id], h = hero(id), special = resolveCombatAbility(h, 'special');
      assert.ok(d.sourceWork.includes(expected[0]), `${id}: wrong version`);
      assert.deepEqual([d.kind, d.effect, d.delivery], expected.slice(1), id);
      assert.equal(d.weaponType, h.weaponType, id); assert.equal(d.universe, h.universe);
      assert.notEqual(d.source1to1Verified, true); assert.match(d.sourceReference, /^https:\/\//);
      assert.equal(special.name, d.name); assert.equal(special.effect, d.effect); assert.equal(special.delivery, d.delivery);
      assert.equal(special.sourceAbility.animationDuration, 1.1); assert.equal(special.sourceAbility.hitAt, 0.451);
      assert.equal(special.sourceAbility.meterCost, 100);
      if (d.effect === 'damage') damaging++; else supportive++;
      for (const slot of ['simple', 'secondary', 'defense', 'special']) {
        const action = resolveCombatAbility(h, slot); commandCount++;
        assert.equal(action.sourceHeroId, id); assert.equal(action.universe, d.universe);
        assert.equal(action.provenance.canonicalVerified, false); assert.equal(action.provenance.networkVerified, false);
        assert.ok(['damage', 'guard', 'buff'].includes(action.effect), `${id}/${slot}: unselected healing or supernatural effect`);
        assert.ok(['melee', 'projectile', 'support'].includes(action.delivery), `${id}/${slot}: invented area/beam`);
        if (action.effect === 'damage') { assert.ok(action.multiplier > 0); assert.equal(action.targetSide, 'enemy'); }
        else { assert.equal(action.multiplier, 0); assert.ok(['self', 'ally'].includes(action.targetSide)); assert.equal(action.delivery, 'support'); }
      }
      rows.push({ id, sourceWork: d.sourceWork, kind: d.kind, effect: d.effect, delivery: d.delivery, weaponType: d.weaponType });
    }
    assert.equal(definitions.annie_knowby.weaponType, 'book');
    assert.equal(damaging, 24); assert.equal(supportive, 16);
    return { heroes: 40, commands: commandCount, damagingSupers: damaging, supportiveSupers: supportive, rows };
  });

  await check('Strict native gates reject forged abilities, retain role from curation, and never mutate simulation', () => {
    let rejectedProfiles = 0, acceptedContacts = 0, rejectedContacts = 0, renderCases = 0;
    for (const id of ids) for (const facing of [-1, 1]) {
      const h = hero(id), profile = resolveCombatAbility(h, 'special');
      for (const patch of [{ sourceHeroId: 'unknown' }, { universe: 'wrong' }, { name: 'invented magic' },
        { effect: profile.effect === 'damage' ? 'guard' : 'damage' }, { delivery: profile.delivery === 'melee' ? 'projectile' : 'melee' }]) {
        assert.equal(supportsNativeSuperWave12({ ...profile, ...patch }), false); rejectedProfiles++;
      }
      for (const alias of ['id', 'sourceHeroId', 'sourceId']) {
        const actor = { ...h, id: alias === 'id' ? id : 'runtime-instance', [alias]: id,
          x: 410, y: 330, currentHp: 80, meter: 17, statusEffects: { glitched: 0 }, facing };
        const target = { x: 410 + facing * 65, y: 330, currentHp: 50 }, action = { elapsed: 0.8, duration: 1.1, hitAt: 0.451, facing };
        const original = JSON.stringify({ actor, target, profile, action });
        const refused = stateFor({ actor, profile: { ...profile, kind: 'invented-portal' }, action, target, contactVisual: { confirmed: false } });
        assert.ok(refused); assert.equal(refused.kind, definitions[id].kind); assert.equal(refused.contactEligible, false);
        const recorder = record(); drawNative(recorder.ctx, refused); recorder.balanced(); renderCases++;
        assert.deepEqual(refused.motion, { x: 0, y: 0 }); assert.equal(refused.gameplayEffect, 'none');
        const visible = visibleCalls(recorder.calls);
        if (profile.effect === 'damage') assert.equal(visible.length, 0, `${id}: rejected contact still renders a hit`);
        else {
          assert.equal(visible.length, 1); const marker = visible[0]; assert.equal(marker[0], 'ellipse');
          assert.ok(marker[3] <= 16); assert.ok(marker[4] <= 4); assert.equal(marker[1], actor.x);
        }
        rejectedContacts++;
        const acceptedPoint = { confirmed: true, x: 480, y: 325 };
        const accepted = stateFor({ actor, profile, action, target, contactVisual: acceptedPoint });
        const hitRecorder = record(); drawNative(hitRecorder.ctx, accepted); hitRecorder.balanced();
        if (profile.effect === 'damage') {
          assert.equal(accepted.contactEligible, true); assert.deepEqual(accepted.target, { x: 480, y: 325 });
          const ring = visibleCalls(hitRecorder.calls); assert.equal(ring.length, 1); assert.equal(ring[0][0], 'ellipse');
          assert.equal(ring[0][1], acceptedPoint.x); acceptedContacts++;
        } else { assert.equal(accepted.contactEligible, false); assert.deepEqual(accepted.target, { x: 410, y: 330 }); }
        assert.equal(JSON.stringify({ actor, target, profile, action }), original);
        target.x += 200; target.y -= 90;
        if (profile.effect === 'damage') assert.deepEqual(accepted.target, { x: 480, y: 325 });
        assert.equal(stateFor({ actor: { ...actor, universe: 'wrong' }, profile, action, target }), null);
        assert.equal(stateFor({ actor: { ...actor, id: 'wrong', sourceHeroId: 'wrong', sourceId: 'wrong' }, profile, action, target }), null);
      }
    }
    return { camps: 2, aliasesPerIdentity: 3, rejectedProfiles, rejectedContacts, acceptedContacts, renderCases, simulationMutation: false, contextStylesRestored: true };
  });

  await check('Every scripted W12 phase in both camps excludes generic aura and unsolicited shots or impacts', () => {
    let calls = 0, fatalityCases = 0;
    for (const id of ids) for (const phase of PRESENTATION_PHASES) for (const facing of [-1, 1]) for (const progress of [0.1, 0.35, 0.6, 0.85]) {
      const h = hero(id), identity = resolveCombatPresentation(h, phase), script = resolvePresentationScript(h, phase);
      const sample = samplePresentationScript(script, script.duration * progress), recorder = record();
      const before = JSON.stringify({ sample, identity });
      EngineFighter.prototype.drawScriptedPresentationEffect.call({ width: 1200, height: 540 }, recorder.ctx, sample, identity, 400, 330, facing, phase);
      recorder.balanced(); assert.equal(JSON.stringify({ sample, identity }), before);
      assert.equal(visibleCalls(recorder.calls).length, 0, `${id}/${phase}/${facing}/${progress}: extra finale geometry`);
      calls++; if (phase === 'fatality') fatalityCases++;
    }
    return { identities: 40, phases: 7, camps: 2, progressSamples: 4, evaluatedCalls: calls, fatalityCases, extraBodyAuras: 0, extraProjectiles: 0, extraContacts: 0 };
  });

  await check('Legacy Goku and Barret finales still draw with incomplete historical identity fixtures', () => {
    const dummy = { id: 'legacy-review-opponent', name: 'Fixture', universe: 'Independent review fixture', weaponType: 'fist',
      stats: { hp: 1000, atk: 10, def: 10, spd: 1 }, simple: { name: 'fixture', type: 'melee', dmg: 1 },
      special: { name: 'fixture', type: 'melee', dmg: 1 } };
    const rows = [];
    for (const id of ['goku_dbz', 'barret_ff7']) {
      const engine = new EngineFighter(960, 540, [hero(id)], [dummy], { add: noop }, noop, noop, { opponentControl: 'p2' });
      engines.push(engine); engine.countdown = 0;
      const script = resolvePresentationScript(hero(id), 'fatality');
      for (const facing of [-1, 1]) for (const progress of [0.6, 0.65, 0.7]) for (const fixture of ['no-source', 'unknown-source', 'legacy-source']) {
        const identity = { color: '#9bdcff', ...(fixture === 'no-source' ? {} : { sourceHeroId: fixture === 'unknown-source' ? 'legacy-unknown-source' : id }) };
        const sample = samplePresentationScript(script, script.duration * progress), recorder = record();
        const cpu = engine.getActive('cpu');
        const before = JSON.stringify({ sample, identity, hp: cpu.currentHp, damage: engine.stats.player.damage, finished: engine.finished });
        engine.drawScriptedPresentationEffect(recorder.ctx, sample, identity, 480, 350 + sample.y, facing, 'fatality');
        recorder.balanced();
        assert.equal(JSON.stringify({ sample, identity, hp: cpu.currentHp, damage: engine.stats.player.damage, finished: engine.finished }), before);
        if (id === 'goku_dbz') {
          const beam = recorder.calls.find(call => call[0] === 'fillRect' && Math.abs(call[3]) > 200);
          assert.ok(beam, `${id}/${facing}/${progress}/${fixture}: historical Kamehameha was suppressed`);
          assert.ok(beam[3] * facing > 200);
        } else {
          const segments = recorder.calls.flatMap((call, index) => call[0] === 'moveTo' && recorder.calls[index + 1]?.[0] === 'lineTo'
            ? [[call, recorder.calls[index + 1]]] : []);
          assert.ok(segments.length >= 2, `${id}/${facing}/${progress}/${fixture}: historical Catastrophe was suppressed`);
          for (const [from, to] of segments) {
            assert.ok(to[2] > from[2] + 100, 'Catastrophe ray must descend from the airborne muzzle');
            assert.ok((to[1] - from[1]) * facing > 200, 'Catastrophe ray must travel forward in either camp');
          }
          assert.equal(recorder.calls.some(call => call[0] === 'fillRect'), false);
        }
        rows.push({ id, facing, progress, fixture, recordedGeometryCommands: visibleCalls(recorder.calls).length, simulationUnchanged: true });
      }
    }
    const freeze = json(prefix + 'production-freeze.json');
    const productionSources = sourcePaths.filter(path => Object.hasOwn(freeze.files, path));
    for (const path of productionSources) assert.equal(sourceHashesBefore[path], freeze.files[path], path + ': current review differs from production freeze');
    report.productionFreeze = { path: prefix + 'production-freeze.json', sha256: sha(read(prefix + 'production-freeze.json')),
      createdAt: freeze.createdAt, checkedProductionSources: productionSources.length };
    return { identities: 2, camps: 2, progressSamples: 3, identityFixtures: 3, evaluatedCalls: rows.length,
      suppressedLegacyBeams: 0, simulationMutation: false, productionSourceHashesMatchFreeze: true, rows };
  });

  await check('Forty actual same-universe performers and seven strict native partners retain their selected role', () => {
    const native = json('src/game/combat/summonAnimationsWave12.generated.json').entries;
    assert.equal(native.length, 7); assert.equal(getSummonAnimationAssets().length, 37);
    assert.deepEqual(sorted(Object.keys(partners)), sorted(ids));
    const rows = []; let forgedDescriptors = 0;
    for (const id of ids) {
      const h = hero(id), descriptor = resolveUniverseSummon(h), partner = partners[id], performer = hero(partner.performerHeroId);
      assert.ok(descriptor); assert.equal(descriptor.kind, 'reinforcement'); assert.equal(descriptor.performerRole, 'reinforcement');
      assert.notEqual(performer.id, id); assert.equal(performer.universe, h.universe);
      assert.equal(descriptor.performer.id, performer.id); assert.equal(descriptor.sourceHeroId, performer.id);
      const action = resolveCombatAbility(performer, partner.slot);
      assert.equal(descriptor.action.name, action.name); assert.equal(descriptor.action.sourceHeroId, performer.id);
      assert.equal(descriptor.provenance.canonicalEntity, false);
      rows.push({ caller: id, performer: performer.id, callerWork: definitions[id].sourceWork,
        performerWork: definitions[performer.id].sourceWork, effect: action.effect, delivery: action.delivery });
    }
    const bindings = [ ['james_s', 'cybil_bennett', 'gun'], ['dylan', 'regina', 'gun'], ['anna_predator', 'dutch', 'gun'],
      ['annie_knowby', 'ash_williams', 'melee'], ['carver', 'isaac', 'gun'], ['fry_futurama', 'leela_futurama', 'melee'], ['rick', 'birdperson', 'support'] ];
    for (const [caller, performer, role] of bindings) {
      const descriptor = resolveUniverseSummon(hero(caller)), asset = summonAsset(descriptor);
      assert.ok(asset); assert.equal(asset.performerHeroId, performer); assert.equal(asset.nativeRole, role);
      const choreography = choreographies.find(value => value.id === asset.id + '-native'); assert.ok(choreography);
      assert.equal(choreography.actionName, descriptor.action.name); assert.equal(choreography.entityName, descriptor.entityName);
      assert.equal(choreography.universe, descriptor.universe); assert.equal(usesConfirmedSummonContactWave12(asset), role !== 'support');
      for (const mutate of [copy => { copy.universe = 'wrong'; }, copy => { copy.performer.universe = 'wrong'; },
        copy => { copy.action.name = 'invented attack'; }, copy => { copy.sourceHeroId = 'wrong'; },
        copy => { copy.performer.sourceHeroId = 'wrong'; }, copy => { copy.action.sourceHeroId = 'wrong'; },
        copy => { copy.performerRole = 'caller'; }]) {
        const copy = structuredClone(descriptor); mutate(copy); assert.equal(summonAsset(copy), null); forgedDescriptors++;
      }
    }
    return { selectedPartners: rows.length, nativePartners: bindings.length, nativeGunPartners: 4, nativeMeleePartners: 2, nativeSupportPartners: 1, forgedDescriptors, rows };
  });

  await check('Roster cue feedback preserves old origins and requires accepted contact, with quiet support', () => {
    let oldOrigins = 0, cueCases = 0;
    const newIds = new Set(json('src/game/combat/summonAnimationsWave12.generated.json').entries.map(value => value.id));
    for (const asset of getSummonAnimationAssets().filter(value => !newIds.has(value.id))) {
      for (const phase of ['arrival', 'preparation', 'attack', 'recovery']) for (let col = 0; col < 4; col++) {
        const frame = { phase, col, row: ['arrival', 'preparation', 'attack', 'recovery'].indexOf(phase), asset };
        const choreography = { muzzle: [0.2, -0.45], performer: { x: 100, y: 330, size: 132, facing: 1, rotation: 0 },
          origin: { x: 125, y: 280 }, visuals: [] };
        assert.deepEqual(projectSummon(choreography, asset, frame), projectPrevious(choreography, asset, frame)); oldOrigins++;
      }
    }
    for (const side of [-1, 1]) for (const entry of choreographies) for (const stage of ['preparation', 'travel', 'contact']) {
      const cue = { kind: stage === 'preparation' ? entry.preparation : entry.attack, stage, progress: 0.7 };
      const state = { side, origin: { x: 100, y: 250 }, target: { x: 450, y: 330 }, height: 100,
        nativeMuzzleActive: false, attackProgress: 0.6, targets: [] }, original = JSON.stringify({ state, cue });
      const recorder = record(); assert.equal(drawCue(recorder.ctx, state, cue), true);
      assert.equal(visibleCalls(recorder.calls).length, 0, `${entry.id}/${stage}: no anchor or accepted contact`);
      assert.equal(JSON.stringify({ state, cue }), original); cueCases++;
      if (!entry.attack.endsWith('-support') && stage === 'contact') {
        const contact = { ...state, targets: [{ x: 410, centerY: 280 }] }, acceptedRecorder = record();
        drawCue(acceptedRecorder.ctx, contact, cue);
        const calls = visibleCalls(acceptedRecorder.calls); assert.equal(calls.length, 1); assert.equal(calls[0][0], 'ellipse');
        assert.equal(calls[0][1], 410); assert.equal(calls[0][2], 280);
      }
    }
    return { historicalAssets: 30, oldOriginComparisons: oldOrigins, cueCases, falseContactRings: 0, supportShotsOrContacts: 0 };
  });

  await check('RPG commands reject an explicitly selected target in the wrong camp without spending resources', () => {
    const dummy = id => ({ id, name: id, universe: 'Independent review fixture', weaponType: 'fist', stats: { hp: 1000, atk: 10, def: 10, spd: 1 },
      simple: { name: 'fixture', type: 'melee', dmg: 1 }, secondary: { name: 'fixture', type: 'melee', dmg: 1 },
      defense: { name: 'fixture', type: 'shield', reduce: 0.4, dur: 1 }, special: { name: 'fixture', type: 'melee', dmg: 1 } });
    let rejected = 0, acceptedStatusCases = 0;
    for (const id of ids) for (const side of ['player', 'enemy']) {
      const own = [hero(id), dummy('companion')], other = [dummy('opponent'), dummy('opponent2')];
      const players = side === 'player' ? own : other, opponents = side === 'enemy' ? own : other;
      const engine = new EngineRpg(1200, 540, players, { monsters: opponents, bosses: [], customRoster: opponents },
        { add: noop }, noop, noop, { universe: 'Nexus de Convergence', disableHazards: true, customBattle: { singleRoster: true, opponentControl: 'p2' } });
      engine.autoBattle = false; engine.enemyGlobalRecovery = 0; engines.push(engine);
      const allies = side === 'player' ? engine.heroes : engine.enemies, enemies = side === 'player' ? engine.enemies : engine.heroes, actor = allies[0];
      [...allies, ...enemies].forEach((unit, index) => { unit.currentHp = unit.maxHp = 1000; unit.atb = 100; unit.specialCharge = 100;
        unit.cooldown = 0; unit.state = 'idle'; unit.actionPending = false; unit.x = unit === actor ? 400 : 460 + index * 10; unit.y = 330;
        unit.statusEffects = { infected: 0, glitched: 0, radiated: 0 }; });
      const emitted = []; engine.emitTargetedProjectile = (...args) => emitted.push(args);
      for (const slot of ['simple', 'secondary', 'defense', 'special']) {
        const profile = engine.getActionContext(actor, slot, side).profile;
        const wrong = profile.effect === 'damage' ? allies[1] : enemies[0];
        const before = JSON.stringify({ atb: actor.atb, charge: actor.specialCharge, hp: [...allies, ...enemies].map(unit => unit.currentHp) });
        const accepted = side === 'player' ? engine.triggerAbility(actor, slot, [rpgUnitId(wrong)])
          : engine.triggerEnemyAbility(actor, slot, [rpgUnitId(wrong)]);
        assert.equal(accepted, false, `${id}/${side}/${slot}: accepts wrong camp`);
        assert.equal(JSON.stringify({ atb: actor.atb, charge: actor.specialCharge, hp: [...allies, ...enemies].map(unit => unit.currentHp) }), before);
        assert.equal(emitted.length, 0); rejected++;
      }
      if (['morty', 'summer'].includes(id)) for (const slot of ['simple', 'secondary', 'special']) {
        actor.atb = actor.specialCharge = 100; actor.cooldown = 0; actor.state = 'idle'; actor.actionPending = false; engine.enemyActionLock = false;
        const before = [...allies, ...enemies].map(unit => unit.currentHp);
        const accepted = side === 'player' ? engine.triggerAbility(actor, slot) : engine.triggerEnemyAbility(actor, slot);
        assert.equal(accepted, true);
        for (let tick = 0; tick < 100; tick++) engine.advanceActions();
        assert.deepEqual([...allies, ...enemies].map(unit => unit.currentHp), before);
        assert.ok(enemies.every(unit => Object.values(unit.statusEffects).every(value => value === 0)));
        assert.equal(emitted.length, 0); acceptedStatusCases++;
      }
      engine.dispose?.();
    }
    return { identities: 40, camps: 2, commandsPerIdentity: 4, rejectedWrongCampSelections: rejected,
      unchangedResourcesForRejectedActions: true, mortyAndSummerAcceptedSupportCases: acceptedStatusCases, smithNameStatusLeak: false, genericAlliedLaser: false };
  });

  await check('Retain the already executed stage browser evidence and bind current files to the production freeze', () => {
    const evidence = json(prefix + 'stage-browser.json'), freeze = json(prefix + 'production-freeze.json');
    assert.equal(evidence.passed, true); assert.equal(evidence.mechanisms, 14); assert.equal(evidence.universes, 7);
    assert.equal(evidence.modeRenderChecks, 56); assert.equal(evidence.additionalViewportChecks, 42);
    assert.equal(evidence.historicalComparison.preservedCanvasSignatures, 802); assert.deepEqual(evidence.pageErrors, []);
    assert.ok(evidence.rows.every(row => row.stageStateUnchanged && row.actorsAndTerrainUnchanged && row.fullCycleRepeats));
    for (const path of stageSourcePaths) assert.equal(sourceHashesBefore[path], freeze.files[path], path + ': source changed after freeze');
    const artifacts = stageEvidencePaths.map(path => {
      const bytes = read(path), entry = { path, bytes: bytes.length, sha256: sha(bytes) };
      if (path.endsWith('.png')) {
        assert.equal(bytes.subarray(1, 4).toString(), 'PNG');
        entry.width = bytes.readUInt32BE(16); entry.height = bytes.readUInt32BE(20);
        assert.ok(entry.width > 500 && entry.height > 300);
      }
      return entry;
    });
    report.retainedStageEvidence = { originalStartedAt: evidence.startedAt, originalFinishedAt: evidence.finishedAt,
      retainedAt: new Date().toISOString(), retentionOnly: true,
      hashTiming: 'The hashes here are measured during this independent review, after the recorded browser execution. They verify current retention and production-freeze agreement, and do not claim hashes were captured before that browser run.', artifacts };
    return { scenes: 14, universes: 7, originalModeRenders: 56, originalAdditionalViewports: 42,
      originalHistoricalCanvasSignatures: 802, currentStageSourcesMatchFreeze: true, retainedArtifacts: artifacts.length, repeatedScreenshots: 0 };
  });

  report.resolvedFindings = initial.findings.map(finding => ({ ...finding,
    resolution: finding.id === 'W12-REVIEW-001'
      ? 'Integration explicitly excludes supplemental generic scripted effects for Wave12 native presentations. The independent replay covers all 40 identities, seven phases and both facings.'
      : 'The selected source definition and resolved roster metadata now use book for Annie Knowby.',
    verified: finding.id === 'W12-REVIEW-001' ? checks.find(entry => entry.name.startsWith('Every scripted'))?.passed === true
      : definitions.annie_knowby.weaponType === 'book' && hero('annie_knowby').weaponType === 'book' }));
  report.risks = [
    { id: 'SOURCE-FIDELITY', status: 'declared limitation', detail: 'Generated drawings and bounded combat timing are adaptations. No exact original animation or official frame comparison was performed; source 1:1 certification remains false.' },
    { id: 'CROSSOVER-PARTNERS', status: 'declared adaptation', detail: 'All 40 partners belong to the same universe and use their own action. Some relays cross source dates, protagonists and antagonists: this is game roster composition, not a canonical alliance or a literal original-world summon. Examples include Pyramid Head → Cybil, Naru → Dutch, and living Nicole → original Isaac.' },
    { id: 'SUPPORT-MECHANICS', status: 'declared adaptation', detail: 'Coordination gestures, medical advice and physical cover resolve to bounded guard or attack buffs for playability. They do not claim canonical magical shields, instant treatment, healing rays or source-accurate numerical mechanics.' },
    { id: 'MORTY-ART', status: 'explicitly blocked', detail: 'The image-generation refusal is preserved. Morty has no new 32-pose presentation atlas or 16-pose base atlas; the one calm legacy cell remains an explicitly disclosed fallback. No alias or alternate request bypass is introduced.' },
    { id: 'VISUAL-REVIEW-SCOPE', status: 'bounded independent review', detail: 'This review evaluates source metadata, executable dispatch, Canvas commands and camp/role rules. Native image quality is established by the separate recorded contact-sheet and pixel reviews; this report does not claim a fresh visual inspection of every other part.' }
  ];
} catch (error) {
  checks.push({ name: 'Review harness loaded all requested modules', passed: false, error: String(error.stack || error) });
} finally {
  engines.forEach(engine => engine.dispose?.()); await vite?.close();
  report.finishedAt = new Date().toISOString();
  report.sourceHashesAfter = Object.fromEntries(sourcePaths.map(path => [path, sha(read(path))]));
  report.sourcesStableDuringReview = JSON.stringify(sourceHashesBefore) === JSON.stringify(report.sourceHashesAfter);
  report.passed = checks.length === 8 && checks.every(entry => entry.passed) && report.sourcesStableDuringReview
    && report.resolvedFindings.length === 2 && report.resolvedFindings.every(finding => finding.verified);
  fs.writeFileSync(new URL('independent-review.json', directory), JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ passed: report.passed, checks: checks.map(({ name, passed, error }) => ({ name, passed, ...(error ? { error } : {}) })), sourcesStable: report.sourcesStableDuringReview }));
  if (!report.passed) process.exitCode = 1;
}
