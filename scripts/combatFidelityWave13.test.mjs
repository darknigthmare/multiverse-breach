import assert from 'node:assert/strict';
import { WAVE14_PRESENTATION_IDS } from './combatFidelityHistoricalCohortWave14.mjs';
import { WAVE16_PRESENTATION_IDS } from './combatFidelityHistoricalCohortWave16.mjs';
import { WAVE15_PRESENTATION_IDS, HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE15, HISTORICAL_REGISTRY_PATHS_BEFORE_WAVE15 } from './combatFidelityHistoricalCohortWave15.mjs';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import test from 'node:test';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveCombatPresentation, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { ABILITIES_WAVE13, ABILITY_REVISIONS_WAVE13 } from '../src/game/combat/abilities/abilitiesWave13.js';
import { ABILITIES_WAVE14 } from '../src/game/combat/abilities/abilitiesWave14.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE13 as sources } from '../src/game/combat/combatSourceDefinitionsWave13.js';
import { COMBAT_CAPABILITY_COMPLETION } from '../src/game/combat/completion/catalog.js';
import { CHARACTER_PRESENTATIONS, PRESENTATION_PHASES } from '../src/game/combat/presentationCatalog.js';
import { supportsNativeSuperWave13, getNativeSuperVisualStateWave13, drawNativeSuperVisualsWave13, projectNativeSuperAnchorWave13 } from '../src/game/combat/nativeSuperVisualsWave13.js';
import { getCharacterAnimationFrame } from '../src/game/combat/characterAnimationCatalog.js';
import { getCharacterSuperVisualState, supportsConfirmedCharacterSuperContact } from '../src/game/combat/characterSuperVisuals.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { measureCombatFidelity } from './combatFidelityAudit.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const directory = 'docs/combat-fidelity-wave13-2026-10-24/';
const plan = json(directory + 'batch-plan-before.json');
const before = json(directory + 'ability-baseline-before.json');
const baseline = json(directory + 'baseline.json');
const ids = Object.values(plan.parts).flat();
// Keep the immutable W13 cardinalities verifiable after the exact12 W14 additions.
const historicalW13AbilityIds = Object.keys(HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE15).filter(id => !Object.hasOwn(ABILITIES_WAVE14, id));
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
const hero = id => { assert.ok(roster.has(id), id); return roster.get(id); };

test('W13 retains the exact40 identities and separately measures18 additions and22 prior-version revisions', () => {
  assert.equal(ids.length, 40); assert.equal(new Set(ids).size, 40);
  assert.equal(plan.parts.A.length, 20); assert.equal(plan.parts.B.length, 20);
  assert.equal(sha(read(directory + 'batch-plan-before.json')), before.frozenPlanSha256);
  assert.deepEqual(sorted(Object.keys(sources)), sorted(ids));
  assert.deepEqual(sorted(Object.keys(ABILITIES_WAVE13)), sorted(before.newAbilityIds));
  assert.deepEqual(sorted(Object.keys(ABILITY_REVISIONS_WAVE13)), sorted(before.revisionIds));
  assert.equal(before.newAbilityIds.length, 18); assert.equal(before.revisionIds.length, 22);
  assert.equal(historicalW13AbilityIds.length, 1528);
  assert.equal(historicalW13AbilityIds.filter(id => !before.newAbilityIds.includes(id)).length, 1510);
  for (const row of plan.heroes) {
    const actual = hero(row.hero.id), source = sources[actual.id];
    assert.equal(actual.universe, row.hero.universe);
    assert.equal(source.universe, actual.universe);
    assert.equal(actual.weaponType, source.weaponType);
    assert.equal(source.sourceWork, row.source.sourceWork);
    assert.equal(source.appearance, row.source.appearance);
    assert.match(source.sourceReference, /^https:\/\//);
    assert.equal(source.source1to1Verified, false); assert.equal(source.networkVerified, false);
    for (const slot of ['simple','secondary','defense','special']) assert.deepEqual(actual[slot], row.hero[slot], actual.id + ': raw catalog action changed');
  }
});

test('W13 personal kits resolve all160 source-authored slots with bounded target and cost semantics', () => {
  let offensiveSupers = 0, supportSupers = 0, meleeSupers = 0, projectileSupers = 0;
  for (const id of ids) {
    const actor = hero(id), source = sources[id];
    for (const slot of ['simple','secondary','defense','special']) {
      const profile = resolveCombatAbility(actor, slot);
      assert.equal(profile.sourceHeroId, id); assert.equal(profile.universe, actor.universe);
      assert.doesNotMatch(profile.name, /Signature Strike|Breach Technique|Origin Burst|Signature Guard/i);
      assert.equal(profile.provenance.identityAuthored, true);
      assert.equal(profile.provenance.canonicalVerified, false); assert.equal(profile.provenance.networkVerified, false);
      assert.equal(profile.provenance.sourceWork, source.sourceWork);
      assert.ok(profile.hitAt > 0 && profile.hitAt < profile.duration);
      if (profile.effect === 'damage') {
        assert.equal(profile.targetSide, 'enemy'); assert.ok(profile.multiplier > 0);
      } else {
        assert.equal(profile.multiplier, 0); assert.notEqual(profile.targetSide, 'enemy');
        assert.equal(profile.delivery, 'support');
      }
    }
    const special = resolveCombatAbility(actor, 'special');
    assert.equal(special.name, source.name); assert.equal(special.effect, source.effect); assert.equal(special.delivery, source.delivery);
    if (special.effect === 'damage') {
      offensiveSupers++;
      if (special.delivery === 'melee') meleeSupers++; else if (special.delivery === 'projectile') projectileSupers++;
    } else supportSupers++;
  }
  assert.equal(offensiveSupers, 24); assert.equal(supportSupers, 16);
  assert.equal(meleeSupers, 14); assert.equal(projectileSupers, 10);
});

test('W13 keeps all20 historical completion records and22 prior authored records independently inspectable', () => {
  assert.equal(Object.keys(before.completion).length, 20);
  for (const [id, historical] of Object.entries(before.completion)) assert.deepEqual(COMBAT_CAPABILITY_COMPLETION[id], historical, id);
  for (const [id, historical] of Object.entries(before.authored)) {
    const selected = COMBAT_ABILITY_OVERRIDES[id];
    assert.equal(selected.versionRevision, 'wave13-explicit-source-version', id);
    assert.equal(selected.priorSourceWork, historical.sourceWork, id);
    assert.equal(selected.sourceWork, sources[id].sourceWork, id);
    assert.ok(selected.sourceReference.startsWith(historical.sourceReference), id);
  }
});

test('W13 distinguishes source-specific support roles from offensive tools and ordinary lightsabers', () => {
  const nonoffensive = ['bishop','dallas_alien','parker_alien','lambert_alien','ash_alien','chell','atlas','pbody','glados','wheatley','doug_rattmann','rincewind_dw','granny_dw','twoflower_dw','nanny_ogg_dw','hayden'];
  for (const id of nonoffensive) for (const slot of ['simple','secondary','special']) {
    const profile = resolveCombatAbility(hero(id), slot);
    assert.notEqual(profile.effect, 'damage', id); assert.equal(profile.multiplier, 0, id);
    assert.equal(profile.targetSide, 'ally', id); assert.equal(profile.statusEffect, null, id);
  }
  for (const id of ['luke','vader','ahsoka_adult','aayla_secura','darth_revan','obi_wan','yoda','darth_maul']) {
    const profile = resolveCombatAbility(hero(id), 'special');
    assert.equal(profile.delivery, 'melee', id); assert.equal(profile.shape, 'single', id);
    assert.equal(profile.statusEffect, null, id); assert.ok(profile.range <= 185, id);
    assert.doesNotMatch(profile.name, /lightning|éclair|choke|étrangl|instant|soul/i, id);
  }
  assert.ok(resolveCombatAbility(hero('yoda'), 'special').range < resolveCombatAbility(hero('vader'), 'special').range);
  assert.equal(resolveCombatAbility(hero('death_dw'), 'special').shape, 'single');
  assert.equal(resolveCombatAbility(hero('granny_dw'), 'special').effect, 'guard');
});

test('W13 exposes seven source-version recipes per character and replaces only three older recipes', () => {
  const oldRecipes = new Set(baseline.presentations.entries.map(entry => entry.heroId || entry.id));
  // The independent W12 audit explicitly records these previously scripted IDs.
  assert.deepEqual(ids.filter(id => oldRecipes.has(id)).sort(), ['luke','obi_wan','vader']);
  assert.equal(Object.keys(CHARACTER_PRESENTATIONS).filter(id => roster.has(id) && !WAVE14_PRESENTATION_IDS.has(id) && !WAVE15_PRESENTATION_IDS.has(id) && !WAVE16_PRESENTATION_IDS.has(id)).length, 280);
  for (const id of ids) {
    const recipe = CHARACTER_PRESENTATIONS[id];
    assert.equal(recipe.sourceAction, sources[id].name, id);
    assert.equal(recipe.universe, sources[id].universe, id);
    for (const phase of PRESENTATION_PHASES) {
      const profile = resolveCombatPresentation(hero(id), phase);
      assert.equal(profile.provenance.presentationAuthored, true, id + ':' + phase);
      assert.equal(profile.presentationScript.phase, phase, id + ':' + phase);
      assert.ok(recipe.phases[phase].beats.length >= 4, id + ':' + phase);
      assert.match(recipe.phases[phase].sourceReference, /source 1:1 is not certified/);
    }
  }
});

test('W13 reinforcement partners are exact nonself same-universe roster identities', () => {
  const beforeRoster = JSON.stringify(HEROES_DB);
  for (const id of ids) {
    const actor = hero(id), descriptor = resolveUniverseSummon(actor);
    assert.equal(descriptor.kind, 'reinforcement', id);
    assert.equal(descriptor.performer.universe, actor.universe, id);
    assert.notEqual(descriptor.performer.id, id, id);
    assert.equal(descriptor.sourceHeroId, descriptor.performer.id, id);
    assert.equal(descriptor.provenance.partnerSelection, 'wave13-explicit-source-version', id);
    if (actor.universe === 'Portal') {
      assert.ok(['buff','guard'].includes(descriptor.action.targeting.effect), id);
      assert.equal(descriptor.action.targeting.multiplier, 0, id);
      assert.equal(descriptor.action.dmg, 0, id);
    }
  }
  assert.equal(JSON.stringify(HEROES_DB), beforeRoster);
});

test('W13 visual admission requires exact identity and never manufactures confirmed contacts in either camp', () => {
  const calls = [];
  const ctx = new Proxy({ globalAlpha:1 }, { get:(target,key)=>key in target ? target[key] : (...args)=>calls.push([key,...args]), set:(target,key,value)=>{target[key]=value;return true;} });
  for (const id of ids) {
    const actor = hero(id), profile = resolveCombatAbility(actor, 'special');
    assert.equal(supportsNativeSuperWave13(profile), true, id);
    assert.equal(supportsConfirmedCharacterSuperContact(profile), true, id);
    for (const patch of [{sourceHeroId:'unknown'}, {universe:'Foreign universe'}, {name:'Unrelated source action'}, {effect:profile.effect==='damage'?'guard':'damage'}, {delivery:profile.delivery==='melee'?'projectile':'melee'}]) assert.equal(supportsNativeSuperWave13({...profile,...patch}),false,id);
    for (const facing of [-1,1]) {
      const runtimeActor={...actor,id:'battle-instance',sourceHeroId:id,x:400,y:330,currentHp:91,meter:42,facing};
      const original=structuredClone(runtimeActor), action={duration:1.1,hitAt:.451,elapsed:.6,facing};
      const options={actor:runtimeActor,profile,action,target:{x:400+facing*60,y:330},contactVisual:{confirmed:false}};
      const state=getNativeSuperVisualStateWave13(options);
      assert.equal(state.family,'native-wave13',id); assert.equal(state.contactEligible,false,id);
      assert.equal(state.gameplayEffect,'none',id); calls.length=0;
      drawNativeSuperVisualsWave13(ctx,state); assert.deepEqual(runtimeActor,original,id);
      assert.equal(getCharacterSuperVisualState(options).family,'native-wave13',id);
      const accepted=getNativeSuperVisualStateWave13({...options,target:null,contactVisual:{confirmed:true,x:450,y:330}});
      assert.equal(accepted.contactEligible,profile.effect==='damage',id);
      if(profile.effect==='damage')assert.equal(calls.some(call=>call[0]==='ellipse'),false,id+': missed action drew an impact');
      assert.equal(getNativeSuperVisualStateWave13({...options,actor:{...runtimeActor,universe:'Wrong universe'}}),null,id);
    }
  }
});

test('W13 preserves all556 historical managed PNGs and104 registry files byte for byte', () => {
  assert.equal(baseline.assetInventory.deliveredUniquePngFiles,556); assert.equal(baseline.assetInventory.registryFiles,104);
  const expectedSheets=new Map();
  for(const path of baseline.assetInventory.registries){
    assert.equal(sha(read(path)),baseline.inputHashes[path],path);
    for(const entry of json(path).entries||[])if(entry.sheet)expectedSheets.set(entry.sheet,entry.sha256);
  }
  assert.deepEqual(sorted(expectedSheets.keys()),sorted(baseline.assetInventory.sheets));
  for(const [sheet,digest]of expectedSheets)assert.equal(sha(read('public'+sheet)),digest,sheet);
});

test('W13 production inventory preserves archived corrections as evidence without shipping their old registry versions', () => {
  const report = measureCombatFidelity();
  const runtimeRegistries = [
    'characterAnimationsWave13PartA', 'characterAnimationsWave13PartB',
    'characterSpriteCorrectionsWave13PartA', 'characterSpriteCorrectionsWave13PartB',
    'ripleyMeleeCombat', 'ripleyMeleeMotion', 'summonAnimationsWave13'
  ].map(name => 'src/game/combat/' + name + '.generated.json');
  const wave14Registries = new Set([
    'characterAnimationsWave14PartA', 'characterAnimationsWave14PartB',
    'characterSpriteCorrectionsWave14PartA', 'characterSpriteCorrectionsWave14PartB',
    'aragornMeleeCombat', 'aragornMeleeMotion', 'summonAnimationsWave14'
  ].map(name => 'src/game/combat/' + name + '.generated.json'));
  const wave13Registries = report.assetInventory.registries.filter(path => HISTORICAL_REGISTRY_PATHS_BEFORE_WAVE15.has(path) && !wave14Registries.has(path));
  assert.deepEqual(sorted(wave13Registries), sorted([...baseline.assetInventory.registries, ...runtimeRegistries]));
  assert.equal(wave13Registries.length, 111);
  const wave13Sheets = new Set(wave13Registries.flatMap(path => (json(path).entries || []).map(entry => entry.sheet).filter(Boolean)));
  assert.equal(wave13Sheets.size, 638);
  assert.ok([...wave13Sheets].every(sheet => report.assetInventory.sheets.includes(sheet)));
  for (const name of ['characterAnimationsWave13PartB', 'characterSpriteCorrectionsWave13PartB']) {
    const archived = directory + 'part-b/before-final-muzzle-correction/' + name + '.generated.json';
    assert.equal(report.inputHashes[archived], sha(read(archived)), 'Correction provenance must remain available');
  }
});

test('W13 explicit native refusals retain old bytes and cannot acquire native poses, muzzle or painted effects', () => {
  for(const id of ['vader','obi_wan','yoda','darth_maul','ahsoka_adult']){
    const files=id==='ahsoka_adult'?['ahsoka_adult-correction32-tool-result.json','ahsoka_adult-correction16-tool-result.json']:[id+'-tool-result.json'];
    for(const file of files){
      const response=json(directory+'part-b/sources/'+file);
      assert.equal(response.failed,true,id);assert.equal(response.imageReturned,false,id);
      assert.equal(response.code,'moderation_blocked',id);assert.equal(response.retryPerformed,false,id);
      assert.ok(response.requestId,id);
    }
    const original=plan.heroes.find(row=>row.hero.id===id);
    assert.equal(sha(read('public'+original.referenceAsset)),original.referenceSha256,id);
    for(const identityField of ['sourceHeroId','sourceId'])for(const context of ['auto','rpg','melee']){
      const clone={...hero(id),id:'enemy:custom:0:'+id,[identityField]:id};
      assert.equal(getHeroSpriteSheetSrc(clone,context),original.referenceAsset,id+': exact source fallback clone');
      const foreign={...clone,universe:'Foreign fallback continuity'};
      const foreignPath=getHeroSpriteSheetSrc(foreign,context);
      assert.notEqual(foreignPath,original.referenceAsset,id+': foreign universe borrowed a fallback');
      assert.ok(foreignPath.includes('/foreign-fallback-continuity/enemy-custom-0-'),id);
    }
    assert.equal(getCharacterAnimationFrame(hero(id),{phase:'super',progress:.6}),null,id);
    const actor={...hero(id),x:400,y:330,facing:1},profile=resolveCombatAbility(actor,'special');
    assert.equal(projectNativeSuperAnchorWave13(actor,.6,.41,72),null,id);
    const state=getNativeSuperVisualStateWave13({actor,profile,action:{duration:1.1,elapsed:.6,hitAt:.451,facing:1},target:{x:450,y:330},contactVisual:{confirmed:true,x:450,y:330}});
    assert.equal(state.nativeArtworkAvailable,false,id);assert.equal(state.nativeMuzzleActive,false,id);assert.equal(state.nativeAnchor,null,id);
    const calls=[],ctx=new Proxy({},{get:(_,key)=>(...args)=>calls.push([key,...args])});
    assert.equal(drawNativeSuperVisualsWave13(ctx,state),true,id);assert.deepEqual(calls,[],id);
    for(const phase of PRESENTATION_PHASES){
      const scene=CHARACTER_PRESENTATIONS[id].phases[phase];
      assert.ok(scene.missingAssets.includes('native-all-phase-artwork'),id+':'+phase);
      assert.ok(scene.missingAssets.includes('native-base16-artwork'),id+':'+phase);
    }
  }
});
