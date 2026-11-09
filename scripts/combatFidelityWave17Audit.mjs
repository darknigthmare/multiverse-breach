import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { ABILITIES_WAVE17, ABILITY_REVISIONS_WAVE17 } from '../src/game/combat/abilities/abilitiesWave17.js';
import { COMBAT_SOURCE_DEFINITIONS_WAVE17 } from '../src/game/combat/combatSourceDefinitionsWave17.js';
import { CHARACTER_PRESENTATIONS } from '../src/game/combat/presentationCatalog.js';
import { getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';
import { getHeroSpriteSheetSrc } from '../src/game/spriteAssets.js';
import { resolveSummonAnimationAsset } from '../src/game/combat/summonAnimationCatalog.js';
import { supportsNativeSuperWave17 } from '../src/game/combat/nativeSuperAdmissionWave17.js';
import { effectiveBatchPlanWave17, WAVE17_DIRECTORY as directory } from '../docs/combat-fidelity-wave17-2026-11-02/closure-support.mjs';
import { HISTORICAL_ABILITY_BASELINE_BEFORE_WAVE17 as priorAbilities, WAVE17_ABILITY_COUNT_DELTA, projectAbilitiesBeforeWave17 } from './combatFidelityHistoricalCohortWave17.mjs';

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const json = file => JSON.parse(read(file));
const entries = file => existsSync(new URL(file, root)) ? json(file).entries || [] : [];
const basicSlots = ['simple', 'secondary', 'defense'];
const summarize = table => ({ authoredHeroes: Object.keys(table).length,
  authoredSlots: Object.values(table).reduce((sum, entry) => sum + basicSlots.filter(slot => entry[slot]).length, 0),
  completeThreeSlotKits: Object.values(table).filter(entry => basicSlots.every(slot => entry[slot])).length,
  partialSlotKits: Object.values(table).filter(entry => !basicSlots.every(slot => entry[slot])).length });
function pngDelivered(entry) {
  if (!entry?.sheet || !existsSync(new URL('public' + entry.sheet, root))) return false;
  const bytes = read('public' + entry.sheet);
  return bytes.length >= 29 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    && sha(bytes) === entry.sha256 && bytes.readUInt32BE(16) === entry.width
    && bytes.readUInt32BE(20) === entry.height && [4, 6].includes(bytes[25]);
}
export function extendCombatFidelityWave17(report) {
  const plan = effectiveBatchPlanWave17(), ids = Object.values(plan.parts).flat();
  const previous = json(directory + 'baseline-current-wave16.json');
  const preservation = json(directory + 'baseline-preservation.json');
  const changes = {};
  for (const section of ['pngFiles', 'registries', 'historicalReports']) {
    changes[section] = Object.entries(preservation[section]).filter(([file, expected]) =>
      !existsSync(new URL(file, root)) || sha(read(file)) !== expected).map(([file]) => file);
    assert.deepEqual(changes[section], [], 'Published W16 evidence changed: ' + section);
  }
  projectAbilitiesBeforeWave17(COMBAT_ABILITY_OVERRIDES);
  const before = summarize(priorAbilities), current = summarize(COMBAT_ABILITY_OVERRIDES);
  const countDelta = Object.fromEntries(Object.keys(before).map(key => [key, current[key] - before[key]]));
  assert.deepEqual(countDelta, WAVE17_ABILITY_COUNT_DELTA, 'W17 count delta must match the pre-generation selection and refusal amendment');
  const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
  const native = getCharacterAnimationAssets();
  const bases = ['A', 'B', 'C'].flatMap(part => entries(`src/game/combat/characterSpriteCorrectionsWave17Part${part}.generated.json`));
  const phases = ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'];
  const delivery = ids.map(id => {
    const hero = roster.get(id), source = COMBAT_SOURCE_DEFINITIONS_WAVE17[id];
    assert.ok(hero && source, id + ': missing selected source identity');
    const profile = resolveCombatAbility(hero, 'special'), summon = resolveUniverseSummon(hero);
    const atlas = native.find(entry => entry.heroId === id && entry.sheet.includes('wave17'));
    const base = bases.find(entry => entry.heroId === id);
    const native32 = atlas?.frames === 32 && phases.every(phase => atlas.phases?.[phase]?.frames === 4) && pngDelivered(atlas);
    const summonAsset = resolveSummonAnimationAsset(summon);
    return { id, universe: hero.universe, sourceWork: source.sourceWork, sourceReference: source.sourceReference,
      sourceDefinitionPresent: true, actionName: profile?.name, effect: profile?.effect, delivery: profile?.delivery,
      recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === hero.universe
        && CHARACTER_PRESENTATIONS[id]?.sourceAction === (source.actionName || source.name),
      nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave17(profile),
      namedSlots: [...basicSlots, 'special'].filter(slot => resolveCombatAbility(hero, slot)?.provenance.identityAuthored).length,
      nativeAnimationDelivered: !!native32, nativeSheet: native32 ? atlas.sheet : null,
      baseCorrectionDelivered: base?.frames === 16 && pngDelivered(base),
      baseRuntimeBindingConfirmed: !!base && pngDelivered(base) && getHeroSpriteSheetSrc(hero, 'rpg') === base.sheet,
      partnerHeroId: summon?.performer?.id || null,
      sameUniverseNonSelfPartner: summon?.kind === 'reinforcement' && summon.universe === hero.universe
        && !!summon.performer && summon.performer.universe === hero.universe && summon.performer.id !== id,
      native16AssetId: summonAsset && pngDelivered(summonAsset) ? summonAsset.id : null, source1to1Verified: false };
  });
  const summonEntries = entries('src/game/combat/summonAnimationsWave17.generated.json').filter(pngDelivered);
  const actionEntries = entries('src/game/combat/characterJadeGyrodiskWave17.generated.json').filter(pngDelivered);
  const captureEntries = entries('src/game/combat/sourceCaptureEnemiesWave17.generated.json').filter(pngDelivered);
  const newPng = report.assetInventory.sheets.filter(sheet => !previous.assetInventory.sheets.includes(sheet));
  const revisedIds = Object.keys(ABILITY_REVISIONS_WAVE17), authoredIds = Object.keys(ABILITIES_WAVE17);
  return { ...report, date: '2026-11-02', wave17Baseline: {
    path: directory + 'baseline-current-wave16.json', sha256: sha(read(directory + 'baseline-current-wave16.json')),
    plan: directory + 'batch-plan-before.json', planSha256: sha(read(directory + 'batch-plan-before.json')), amendments: plan.amendments },
    previousHistoricalAssetPreservation: report.historicalAssetPreservation,
    historicalAssetPreservation: { previousWave: 16, pngFiles: Object.keys(preservation.pngFiles).length,
      registryFiles: Object.keys(preservation.registries).length, historicalReports: Object.keys(preservation.historicalReports).length,
      changedPngFiles: changes.pngFiles, changedRegistries: changes.registries, changedReports: changes.historicalReports,
      baseline: directory + 'baseline-preservation.json', source1to1Verified: false },
    batch: { wave: 17, requestedCharacters: 120, charactersPerAgent: 40, originallySelectedCharacters: 120,
      reviewedIdentityCount: plan.reviewedIds.length, reviewedIdentityIds: plan.reviewedIds, actualCharacterIds: ids, parts: plan.parts,
      plan: directory + 'batch-plan-before.json', amendments: plan.amendments,
      withheldOriginalIdentities: plan.withheld.map(({ withheldId, nativeRequestStatus, refusal }) => ({ id: withheldId, status: nativeRequestStatus, refusal })),
      newlyAuthoredAbilityIds: authoredIds, revisedAbilityIds: revisedIds,
      deliveredNativeCharacterIds: delivery.filter(row => row.nativeAnimationDelivered).map(row => row.id),
      remainingNativeCharacterIds: delivery.filter(row => !row.nativeAnimationDelivered).map(row => row.id),
      deliveredBaseCharacterIds: delivery.filter(row => row.baseCorrectionDelivered).map(row => row.id),
      remainingBaseCharacterIds: delivery.filter(row => !row.baseCorrectionDelivered).map(row => row.id),
      newProductionPngFiles: newPng, native45CharacterIds: report.meleeBindings.fullDetailedMeleeManifestHeroes.filter(id => ids.includes(id)), source1to1Verified: false },
    abilities: { ...report.abilities, wave17RoleCorrections: { reviewedHeroes: plan.reviewedIds.length, artisticCharacters: 120,
      newlyAuthoredHeroes: authoredIds.length, revisedHeroes: revisedIds.length, countDelta,
      roleCounts: Object.fromEntries([...new Set(delivery.map(row => row.effect))].map(effect => [effect, delivery.filter(row => row.effect === effect).length])), source1to1Verified: false } },
    presentations: { ...report.presentations, wave17Delivery: delivery,
      wave17Native32Delivered: delivery.filter(row => row.nativeAnimationDelivered).length,
      wave17Base16Delivered: delivery.filter(row => row.baseCorrectionDelivered).length, wave17Source1to1Verified: false },
    entities: { ...report.entities, wave17RosterBindings: delivery.map(row => ({ callerHeroId: row.id, universe: row.universe,
      performerHeroId: row.partnerHeroId, sameUniverseNonSelfPartner: row.sameUniverseNonSelfPartner, native16AssetId: row.native16AssetId })),
      wave17Native16Atlases: summonEntries.length, wave17Native16Poses: summonEntries.reduce((sum, entry) => sum + entry.frames, 0),
      wave17CaptureNpc16Atlases: captureEntries.length, wave17CaptureNpc16Poses: captureEntries.reduce((sum, entry) => sum + entry.frames, 0),
      wave17CaptureNpc16: captureEntries.map(entry => ({ id: entry.id, sourceEnemyId: entry.sourceEnemyId, sheet: entry.sheet, sha256: entry.sha256, source1to1Verified: false })) },
    actions: { ...report.actions, nativeAction16Atlases: (report.actions?.nativeAction16Atlases || 0) + actionEntries.length,
      nativeActionPoses: (report.actions?.nativeActionPoses || 0) + actionEntries.reduce((sum, entry) => sum + entry.frames, 0),
      entries: [...(report.actions?.entries || []), ...actionEntries.map(entry => ({ id: entry.id, heroId: entry.heroId, sheet: entry.sheet, sha256: entry.sha256, frames: entry.frames }))],
      wave17Action16Atlases: actionEntries.length, wave17Action16Poses: actionEntries.reduce((sum, entry) => sum + entry.frames, 0), source1to1Verified: false },
    source1to1Verified: false };
}
