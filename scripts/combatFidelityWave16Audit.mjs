import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { ABILITIES_WAVE16, ABILITY_REVISIONS_WAVE16 } from '../src/game/combat/abilities/abilitiesWave16.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE16 } from '../src/game/combat/combatSourceDefinitionsWave16.js';
import { CHARACTER_PRESENTATIONS } from '../src/game/combat/presentationCatalog.js';
import { getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { supportsNativeSuperWave16 } from '../src/game/combat/nativeSuperAdmissionWave16.js';
import { resolveSummonAnimationAsset } from '../src/game/combat/summonAnimationCatalog.js';
import { TACTICS_TERRAIN_MATERIALS } from '../src/game/tacticsTerrainRenderer.js';
import { effectiveBatchPlan, historicalBaseline } from '../docs/combat-fidelity-wave16-2026-10-28/closure-support.mjs';
import { projectAbilitiesBeforeWave16 } from './combatFidelityHistoricalCohortWave16.mjs';

const root = new URL('../', import.meta.url), directory = 'docs/combat-fidelity-wave16-2026-10-28/';
const read = file => readFileSync(new URL(file, root));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = file => JSON.parse(read(file));
const entries = file => existsSync(new URL(file, root)) ? json(file).entries || [] : [];
const sort = values => [...values].sort();
const basicSlots = ['simple', 'secondary', 'defense'];
const summarize = table => ({ authoredHeroes: Object.keys(table).length,
  authoredSlots: Object.values(table).reduce((n, item) => n + basicSlots.filter(slot => item[slot]).length, 0),
  completeThreeSlotKits: Object.values(table).filter(item => basicSlots.every(slot => item[slot])).length,
  partialSlotKits: Object.values(table).filter(item => !basicSlots.every(slot => item[slot])).length });
function pngDelivered(entry) {
  if (!entry?.sheet || !existsSync(new URL('public' + entry.sheet, root))) return false;
  const bytes = read('public' + entry.sheet);
  return bytes.length >= 29 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    && sha(bytes) === entry.sha256 && bytes.readUInt32BE(16) === entry.width
    && bytes.readUInt32BE(20) === entry.height && [4, 6].includes(bytes[25]);
}

export function extendCombatFidelityWave16(report) {
  const { baseline, preservation } = historicalBaseline(), plan = effectiveBatchPlan();
  const ids = Object.values(plan.parts).flat(), reviewed = new Set(plan.reviewedIds);
  assert.equal(Object.keys(ABILITIES_WAVE16).length, 0);
  for (const id of Object.keys(ABILITY_REVISIONS_WAVE16)) assert.ok(reviewed.has(id), id + ': unplanned revision');
  for (const id of Object.keys(COMBAT_SOURCE_DEFINITIONS_WAVE16)) assert.ok(reviewed.has(id), id + ': unplanned source');
  const before = summarize(projectAbilitiesBeforeWave16(COMBAT_ABILITY_OVERRIDES));
  const current = summarize(COMBAT_ABILITY_OVERRIDES);
  assert.deepEqual(current, before, 'W16 revisions must not inflate authored/basic completeness');
  assert.deepEqual(current, { authoredHeroes: 1582, authoredSlots: 4650, completeThreeSlotKits: 1517, partialSlotKits: 65 });
  const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
  const native = getCharacterAnimationAssets();
  const bases = ['A', 'B', 'C'].flatMap(part => entries(`src/game/combat/characterSpriteCorrectionsWave16Part${part}.generated.json`));
  const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
  const delivery = ids.map(id => {
    const hero = roster.get(id), source = COMBAT_SOURCE_DEFINITIONS_WAVE16[id]; assert.ok(hero, id);
    const profile = resolveCombatAbility(hero, 'special'), summon = resolveUniverseSummon(hero);
    const atlas = native.find(item => item.heroId === id && item.sheet.includes('wave16'));
    const base = bases.find(item => item.heroId === id);
    const native32 = atlas?.frames === 32 && phases.every(phase => atlas.phases?.[phase]?.frames === 4) && pngDelivered(atlas);
    const summonAsset = resolveSummonAnimationAsset(summon);
    return { id, universe: hero.universe, sourceWork: source?.sourceWork || null, sourceReference: source?.sourceReference || null,
      sourceDefinitionPresent: !!source, actionName: profile?.name, effect: profile?.effect, delivery: profile?.delivery,
      recipeRegistered: !!source && CHARACTER_PRESENTATIONS[id]?.universe === hero.universe
        && CHARACTER_PRESENTATIONS[id]?.sourceAction === (source.actionName || source.name),
      nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave16(profile),
      namedSlots: [...basicSlots, 'special'].filter(slot => resolveCombatAbility(hero, slot)?.provenance.identityAuthored).length,
      nativeAnimationDelivered: !!native32, nativeSheet: native32 ? atlas.sheet : null,
      baseCorrectionDelivered: base?.frames === 16 && pngDelivered(base),
      baseRuntimeBindingConfirmed: !!base && pngDelivered(base) && getHeroSpriteSheetSrc(hero, 'rpg') === base.sheet,
      partnerHeroId: summon?.performer?.id || null,
      sameUniverseNonSelfPartner: summon?.kind === 'reinforcement' && summon.universe === hero.universe
        && !!summon.performer && summon.performer.universe === hero.universe && summon.performer.id !== id,
      sourceEntityInvocation: summon?.kind === 'summon' && summon?.universe === hero.universe
        && summonAsset?.bodySource !== 'roster-performer' && pngDelivered(summonAsset),
      native16AssetId: summonAsset && pngDelivered(summonAsset) ? summonAsset.id : null,
      source1to1Verified: false };
  });
  const summonEntries = entries('src/game/combat/summonAnimationsWave16.generated.json').filter(pngDelivered);
  const actionEntries = entries('src/game/combat/characterActionAnimationsWave16PartC.generated.json').filter(pngDelivered);
  const protectionEntries = entries('src/game/combat/sourceProtectionEntitiesWave16.generated.json').filter(pngDelivered);
  const roleCounts = Object.fromEntries([...new Set(delivery.map(row => row.effect))].map(effect => [effect, delivery.filter(row => row.effect === effect).length]));
  const newPng = report.assetInventory.sheets.filter(sheet => !baseline.assetInventory.sheets.includes(sheet));
  return { ...report, date: '2026-10-28',
    wave16Baseline: { path: directory + 'baseline-current-wave15.json', sha256: sha(read(directory + 'baseline-current-wave15.json')),
      plan: directory + 'batch-plan-before.json', planSha256: sha(read(directory + 'batch-plan-before.json')), amendment: plan.amendment },
    previousHistoricalAssetPreservation: report.historicalAssetPreservation,
    historicalAssetPreservation: { previousWave: 15, pngFiles: 982, registryFiles: 127,
      historicalReports: Object.keys(preservation.historicalReports).length, changedPngFiles: [], changedRegistries: [], changedReports: [],
      baseline: directory + 'baseline-preservation.json', source1to1Verified: false },
    batch: { wave: 16, requestedCharacters: 120, charactersPerAgent: 40, originallySelectedCharacters: 120,
      reviewedIdentityCount: plan.reviewedIds.length, reviewedIdentityIds: plan.reviewedIds, actualCharacterIds: ids, parts: plan.parts,
      plan: directory + 'batch-plan-before.json', amendment: plan.amendment,
      withheldOriginalIdentities: plan.withheld.map(({ withheldId, nativeRequestStatus, refusal }) => ({ id: withheldId, status: nativeRequestStatus, refusal })),
      newlyAuthoredAbilityIds: [], revisedAbilityIds: Object.keys(ABILITY_REVISIONS_WAVE16),
      deliveredNativeCharacterIds: delivery.filter(row => row.nativeAnimationDelivered).map(row => row.id),
      remainingNativeCharacterIds: delivery.filter(row => !row.nativeAnimationDelivered).map(row => row.id),
      deliveredBaseCharacterIds: delivery.filter(row => row.baseCorrectionDelivered).map(row => row.id),
      remainingBaseCharacterIds: delivery.filter(row => !row.baseCorrectionDelivered).map(row => row.id),
      newProductionPngFiles: newPng,
      native45CharacterIds: report.meleeBindings.fullDetailedMeleeManifestHeroes.filter(id => ids.includes(id)), source1to1Verified: false },
    abilities: { ...report.abilities, wave16RoleCorrections: { reviewedHeroes: plan.reviewedIds.length, artisticCharacters: 120,
      newlyAuthoredHeroes: 0, revisedHeroes: Object.keys(ABILITY_REVISIONS_WAVE16).length,
      namedActionSlots: delivery.reduce((sum, row) => sum + row.namedSlots, 0), roleCounts,
      countDelta: Object.fromEntries(Object.keys(before).map(key => [key, current[key] - before[key]])), source1to1Verified: false } },
    presentations: { ...report.presentations, wave16Delivery: { recipes: delivery.length,
      registeredRecipes: delivery.filter(row => row.recipeRegistered).length,
      acceptedNativeSuperHelpers: delivery.filter(row => row.nativeSuperHelperAcceptsResolvedAction).length,
      native32Delivered: delivery.filter(row => row.nativeAnimationDelivered).length,
      base16Delivered: delivery.filter(row => row.baseCorrectionDelivered).length,
      baseRuntimeBindingsConfirmed: delivery.filter(row => row.baseRuntimeBindingConfirmed).length, entries: delivery } },
    entities: { ...report.entities, wave16Native16Atlases: summonEntries.length,
      wave16Native16Poses: summonEntries.reduce((sum, entry) => sum + entry.frames, 0),
      wave16PersistentProtection16Atlases: protectionEntries.length,
      wave16PersistentProtection16Poses: protectionEntries.reduce((sum, entry) => sum + entry.frames, 0),
      wave16PersistentProtectionEntries: protectionEntries,
      wave16RosterBindings: delivery.map(row => ({ callerHeroId: row.id, universe: row.universe,
        performerHeroId: row.partnerHeroId, sameUniverseNonSelfPartner: row.sameUniverseNonSelfPartner,
        sourceEntityInvocation: row.sourceEntityInvocation, native16AssetId: row.native16AssetId, source1to1Verified: false })) },
    actions: { nativeAction16Atlases: actionEntries.length, nativeActionPoses: actionEntries.reduce((sum, entry) => sum + entry.frames, 0),
      entries: actionEntries.map(({ id, heroId, sheet, sha256, frames }) => ({ id, heroId, sheet, sha256, frames })), source1to1Verified: false },
    tacticsTerrain: { ...report.tacticsTerrain, materials: Object.keys(TACTICS_TERRAIN_MATERIALS).length,
      materialIds: sort(Object.keys(TACTICS_TERRAIN_MATERIALS)) },
    source1to1Verified: false };
}
