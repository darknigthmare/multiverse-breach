import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { ABILITIES_WAVE15, ABILITY_REVISIONS_WAVE15 } from '../src/game/combat/abilities/abilitiesWave15.js';
import { HISTORICAL_ABILITY_OVERRIDES_BEFORE_WAVE16 as COMBAT_ABILITY_OVERRIDES } from './combatFidelityHistoricalCohortWave16.mjs';
import { COMBAT_SOURCE_DEFINITIONS_WAVE15 } from '../src/game/combat/combatSourceDefinitionsWave15.js';
import { CHARACTER_PRESENTATIONS } from '../src/game/combat/presentationCatalog.js';
import { WAVE_15_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave15.js';
import { getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { supportsNativeSuperWave15 } from '../src/game/combat/nativeSuperVisualsWave15.js';
import { resolveSummonAnimationAsset } from '../src/game/combat/summonAnimationCatalog.js';

const root = new URL('../', import.meta.url);
const directory = 'docs/combat-fidelity-wave15-2026-10-26';
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const sorted = values => [...values].sort();
const slots = ['simple', 'secondary', 'defense'];
const summarize = records => ({
  authoredHeroes: Object.keys(records).length,
  authoredSlots: Object.values(records).reduce((sum, entry) => sum + slots.filter(slot => entry[slot]).length, 0),
  completeThreeSlotKits: Object.values(records).filter(entry => slots.every(slot => entry[slot])).length,
  partialSlotKits: Object.values(records).filter(entry => slots.some(slot => entry[slot]) && !slots.every(slot => entry[slot])).length
});

function pngDelivered(entry) {
  if (!entry?.sheet || !existsSync(new URL(`public${entry.sheet}`, root))) return false;
  const bytes = read(`public${entry.sheet}`);
  return bytes.length >= 29 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    && sha(bytes) === entry.sha256 && bytes.readUInt32BE(16) === (entry.width ?? entry.dimensions?.width)
    && bytes.readUInt32BE(20) === (entry.height ?? entry.dimensions?.height) && [4, 6].includes(bytes[25]);
}

// The W14 report and the pre-edit selection are immutable evidence. Only live
// W15 coverage is measured here; a declared recipe is never counted as artwork.
export function extendCombatFidelityWave15(report) {
  const planPath = `${directory}/batch-plan-before.json`;
  const planBytes = read(planPath), plan = JSON.parse(planBytes);
  assert.equal(sha(planBytes), '08c143270255b5bc83fc051d37f5203351da868b232856d9f43a4dc943463dd1');
  const receipt = json(`${directory}/baseline-receipt.json`);
  for (const [file, expected] of Object.entries(receipt.files)) assert.equal(sha(read(file)), expected, `W15 pre-edit evidence changed: ${file}`);
  const baselinePath = `${directory}/baseline-current-wave14.json`;
  const baseline = json(baselinePath), priorValidation = json(`${directory}/baseline-validation-wave14.json`);
  assert.equal(baseline.assetInventory.deliveredUniquePngFiles, 730);
  assert.equal(baseline.assetInventory.registryFiles, 118);
  assert.equal(sha(read(baselinePath)), priorValidation.currentAuditSha256);
  assert.equal(sha(read(plan.priorAudit.path)), plan.priorAudit.sha256);
  assert.equal(sha(read(plan.priorValidation.path)), plan.priorValidation.sha256);
  const preservation = json(`${directory}/baseline-preservation.json`);
  assert.equal(Object.keys(preservation.pngFiles).length, 730);
  assert.equal(Object.keys(preservation.registries).length, 118);
  const preserved = { ...preservation.pngFiles, ...preservation.registries, ...preservation.historicalReports };
  for (const [file, expected] of Object.entries(preserved)) assert.equal(sha(read(file)), expected, `Historical W1–W14 file changed: ${file}`);

  const ids = Object.values(plan.parts).flat();
  assert.equal(ids.length, 120); assert.equal(new Set(ids).size, 120);
  for (const part of ['A', 'B', 'C']) assert.equal(plan.parts[part].length, 40);
  assert.deepEqual(sorted(Object.keys(COMBAT_SOURCE_DEFINITIONS_WAVE15)), sorted(ids));
  assert.deepEqual(sorted(WAVE_15_PRESENTATION_DEFINITIONS.map(entry => entry[0])), sorted(ids));
  assert.deepEqual(sorted(Object.keys(ABILITIES_WAVE15)), sorted(plan.heroes.filter(entry => !entry.alreadyAuthored).map(entry => entry.hero.id)));
  assert.deepEqual(sorted(Object.keys(ABILITY_REVISIONS_WAVE15)), sorted(plan.heroes.filter(entry => entry.alreadyAuthored).map(entry => entry.hero.id)));
  assert.equal(Object.keys(ABILITIES_WAVE15).length, 42);
  assert.equal(Object.keys(ABILITY_REVISIONS_WAVE15).length, 78);
  const before = Object.fromEntries(Object.entries(COMBAT_ABILITY_OVERRIDES).filter(([id]) => !Object.hasOwn(ABILITIES_WAVE15, id)));
  for (const row of plan.heroes) if (row.priorAuthored) before[row.hero.id] = row.priorAuthored;
  const priorCounts = summarize(before), currentCounts = summarize(COMBAT_ABILITY_OVERRIDES);
  const delta = Object.fromEntries(Object.keys(priorCounts).map(key => [key, currentCounts[key] - priorCounts[key]]));
  assert.deepEqual(priorCounts, { authoredHeroes: 1540, authoredSlots: 4517, completeThreeSlotKits: 1468, partialSlotKits: 72 });
  assert.deepEqual(delta, { authoredHeroes: 42, authoredSlots: 133, completeThreeSlotKits: 49, partialSlotKits: -7 });

  const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
  const native = getCharacterAnimationAssets();
  const bases = ['A', 'B', 'C'].flatMap(part => json(`src/game/combat/characterSpriteCorrectionsWave15Part${part}.generated.json`).entries);
  const delivery = ids.map(id => {
    const hero = roster.get(id), source = COMBAT_SOURCE_DEFINITIONS_WAVE15[id];
    const atlas = native.find(entry => entry.heroId === id && entry.sheet.includes('-wave15-'));
    const base = bases.find(entry => entry.heroId === id);
    const profile = resolveCombatAbility(hero, 'special');
    const summon = resolveUniverseSummon(hero), summonAtlas = resolveSummonAnimationAsset(summon);
    const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
    const native32 = atlas?.frames === 32 && phases.every(phase => atlas.phases?.[phase]?.frames === 4) && pngDelivered(atlas);
    return { id, universe: hero.universe, sourceWork: source.sourceWork, sourceReference: source.sourceReference,
      actionName: source.actionName || source.name, effect: profile?.effect, delivery: profile?.delivery,
      rosterHero: source.universe === hero.universe,
      recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === hero.universe
        && CHARACTER_PRESENTATIONS[id]?.sourceAction === (source.actionName || source.name),
      nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave15(profile),
      namedSlots: [...slots, 'special'].filter(slot => resolveCombatAbility(hero, slot)?.provenance.identityAuthored).length,
      nativeAnimationDelivered: !!native32, nativeSheet: native32 ? atlas.sheet : null,
      baseCorrectionDelivered: base?.frames === 16 && pngDelivered(base),
      baseRuntimeBindingConfirmed: !!base && getHeroSpriteSheetSrc(hero, 'rpg') === base.sheet,
      partnerHeroId: summon?.performer?.id || null,
      sameUniverseNonSelfPartner: summon?.kind === 'reinforcement' && summon.universe === hero.universe
        && !!summon.performer && summon.performer.universe === hero.universe && summon.performer.id !== id,
      native16AssetId: summonAtlas && pngDelivered(summonAtlas) ? summonAtlas.id : null,
      source1to1Verified: false };
  });
  const summonFile = 'src/game/combat/summonAnimationsWave15.generated.json';
  const summonEntries = existsSync(new URL(summonFile, root)) ? json(summonFile).entries.filter(pngDelivered) : [];
  return { ...report, date: '2026-10-26',
    wave15Baseline: { path: baselinePath, sha256: sha(read(baselinePath)), plan: planPath, planSha256: sha(planBytes) },
    previousHistoricalAssetPreservation: report.historicalAssetPreservation,
    historicalAssetPreservation: { previousWave: 14, pngFiles: 730, registryFiles: 118,
      historicalReports: Object.keys(preservation.historicalReports).length, changedPngFiles: [], changedRegistries: [], changedReports: [],
      baseline: `${directory}/baseline-preservation.json`, source1to1Verified: false },
    batch: { wave: 15, requestedCharacters: 120, charactersPerAgent: 40, actualCharacterIds: ids, parts: plan.parts, plan: planPath,
      newlyAuthoredAbilityIds: Object.keys(ABILITIES_WAVE15), revisedAbilityIds: Object.keys(ABILITY_REVISIONS_WAVE15),
      deliveredNativeCharacterIds: delivery.filter(entry => entry.nativeAnimationDelivered).map(entry => entry.id),
      remainingNativeCharacterIds: delivery.filter(entry => !entry.nativeAnimationDelivered).map(entry => entry.id),
      deliveredBaseCharacterIds: delivery.filter(entry => entry.baseCorrectionDelivered).map(entry => entry.id),
      remainingBaseCharacterIds: delivery.filter(entry => !entry.baseCorrectionDelivered).map(entry => entry.id),
      newProductionPngFiles: report.assetInventory.sheets.filter(sheet => !Object.hasOwn(preservation.pngFiles, `public${sheet}`)),
      native45CharacterIds: report.meleeBindings.fullDetailedMeleeManifestHeroes.filter(id => ids.includes(id)), source1to1Verified: false },
    abilities: { ...report.abilities, wave15RoleCorrections: { reviewedHeroes: 120, newlyAuthoredHeroes: 42, revisedHeroes: 78,
      namedActionSlots: delivery.reduce((sum, entry) => sum + entry.namedSlots, 0), countDelta: delta, entries: delivery.map(({ id, actionName, effect, delivery }) => ({ id, actionName, effect, delivery })), source1to1Verified: false } },
    presentations: { ...report.presentations, wave15Delivery: { recipes: delivery.length,
      registeredRecipes: delivery.filter(entry => entry.recipeRegistered).length,
      acceptedNativeSuperHelpers: delivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length,
      native32Delivered: delivery.filter(entry => entry.nativeAnimationDelivered).length,
      base16Delivered: delivery.filter(entry => entry.baseCorrectionDelivered).length,
      baseRuntimeBindingsConfirmed: delivery.filter(entry => entry.baseRuntimeBindingConfirmed).length, entries: delivery } },
    entities: { ...report.entities, wave15Native16Atlases: summonEntries.length,
      wave15Native16Poses: summonEntries.reduce((sum, entry) => sum + entry.frames, 0),
      wave15RosterBindings: delivery.map(entry => ({ callerHeroId: entry.id, universe: entry.universe,
        performerHeroId: entry.partnerHeroId, sameUniverseNonSelfPartner: entry.sameUniverseNonSelfPartner, native16AssetId: entry.native16AssetId, source1to1Verified: false })) },
    source1to1Verified: false };
}
