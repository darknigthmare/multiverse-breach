import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { extendCombatFidelityWave15 } from './combatFidelityWave15Audit.mjs';
import { extendCombatFidelityWave16 } from './combatFidelityWave16Audit.mjs';
import { HEROES_DB } from '../src/game/heroes.js';
import { resolveCombatAbility, resolveUniverseSummon } from '../src/game/combatIdentity.js';
import { COMBAT_ABILITY_OVERRIDES } from '../src/game/combat/abilities/catalog.js';
import { ABILITIES_CORRECTIONS } from '../src/game/combat/abilities/abilitiesCorrections.js';
import { ABILITIES_WAVE6 } from '../src/game/combat/abilities/abilitiesWave6.js';
import { ABILITIES_WAVE7, ABILITY_REVISIONS_WAVE7 } from '../src/game/combat/abilities/abilitiesWave7.js';
import { WAVE_7_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave7.js';
import { supportsNativeSuperWave7 } from '../src/game/combat/nativeSuperVisualsWave7.js';
import { ABILITIES_WAVE8, ABILITY_REVISIONS_WAVE8 } from '../src/game/combat/abilities/abilitiesWave8.js';
import { WAVE_8_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave8.js';
import { supportsNativeSuperWave8 } from '../src/game/combat/nativeSuperVisualsWave8.js';
import { ABILITIES_WAVE9, ABILITY_REVISIONS_WAVE9 } from '../src/game/combat/abilities/abilitiesWave9.js';
import { WAVE_9_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave9.js';
import { supportsNativeSuperWave9 } from '../src/game/combat/nativeSuperVisualsWave9.js';
import { ABILITIES_WAVE10, ABILITY_REVISIONS_WAVE10 } from '../src/game/combat/abilities/abilitiesWave10.js';
import { WAVE_10_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave10.js';
import { supportsNativeSuperWave10 } from '../src/game/combat/nativeSuperVisualsWave10.js';
import { resolveSummonAnimationAsset } from '../src/game/combat/summonAnimationCatalog.js';
import { ROSTER_REINFORCEMENTS_WAVE10 } from '../src/game/combat/rosterReinforcementsWave10.js';
import { ABILITIES_WAVE11, ABILITY_REVISIONS_WAVE11 } from '../src/game/combat/abilities/abilitiesWave11.js';
import { WAVE_11_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave11.js';
import { supportsNativeSuperWave11 } from '../src/game/combat/nativeSuperVisualsWave11.js';
import { ROSTER_REINFORCEMENTS_WAVE11 } from '../src/game/combat/rosterReinforcementsWave11.js';
import { ABILITIES_WAVE12, ABILITY_REVISIONS_WAVE12 } from '../src/game/combat/abilities/abilitiesWave12.js';
import { WAVE_12_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave12.js';
import { supportsNativeSuperWave12 } from '../src/game/combat/nativeSuperVisualsWave12.js';
import { ROSTER_REINFORCEMENTS_WAVE12 } from '../src/game/combat/rosterReinforcementsWave12.js';
import { ABILITIES_WAVE13, ABILITY_REVISIONS_WAVE13 } from '../src/game/combat/abilities/abilitiesWave13.js';
import { WAVE_13_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave13.js';
import { supportsNativeSuperWave13 } from '../src/game/combat/nativeSuperVisualsWave13.js';
import { ROSTER_REINFORCEMENTS_WAVE13 } from '../src/game/combat/rosterReinforcementsWave13.js';
import { ABILITIES_WAVE14, ABILITY_REVISIONS_WAVE14 } from '../src/game/combat/abilities/abilitiesWave14.js';
import { WAVE_14_PRESENTATION_DEFINITIONS } from '../src/game/combat/presentationCatalogWave14.js';
import { supportsNativeSuperWave14 } from '../src/game/combat/nativeSuperVisualsWave14.js';
import { ROSTER_REINFORCEMENTS_WAVE14 } from '../src/game/combat/rosterReinforcementsWave14.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS } from '../src/game/tacticsUniverseBattlefields.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15 } from '../src/game/tacticsUniverseBattlefieldsWave15.js';
import { TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 } from '../src/game/tacticsUniverseBattlefieldsWave16.js';
import { TACTICS_VERTICAL_BATTLEFIELDS } from '../src/game/tacticsVerticalBattlefields.js';
import { normalizeTacticsTerrain, findTerrainPath, canOccupyTerrainSurface, getTerrainSurface, terrainLineOfSight } from '../src/game/tacticsTerrain.js';
import { getCharacterAnimationAssets } from '../src/game/combat/characterAnimationCatalog.js';
import { getCharacterFormAssets } from '../src/game/combat/characterFormCatalog.js';
import { CHARACTER_PRESENTATIONS, PRESENTATION_PHASES, resolvePresentationScript, samplePresentationScript } from '../src/game/combat/presentationCatalog.js';
import { SUMMON_CHOREOGRAPHIES, getSummonChoreographyState } from '../src/game/combat/summonChoreography.js';
import { MELEE_STATES } from '../src/game/melee/meleeStateMachine.js';
import { getMeleeAnimationManifest } from '../src/game/melee/meleeAnimationManifest.js';
import { getHeroMeleeAnimationFrame, getHeroSpriteSheetSrc, getSpriteSheetLayout, getSpriteStateResolution } from '../src/game/spriteAssets.js';
import { STAGE_ANIMATION_PROFILES, getStageAnimationProfile } from '../src/game/melee/stageAnimationCatalog.js';
import { getStageAtmosphereProfile } from '../src/game/melee/stageAtmosphere.js';

const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const patterns = {
  simple: /Signature Strike|signature action/i,
  secondary: /Breach Technique|signature technique/i,
  defense: /Signature Guard|defensive action|\bGuard$/i
};
const slots = Object.keys(patterns);
const count = values => values.reduce((result, value) => ({ ...result, [value]: (result[value] || 0) + 1 }), {});
const inspectPng = entry => {
  const file = new URL(`public${entry.sheet}`, root);
  if (!existsSync(file)) return { exists: false, hashMatches: false, dimensionsMatch: false, alpha: false };
  const bytes = readFileSync(file);
  const png = bytes.length >= 29 && bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return { exists: true, hashMatches: createHash('sha256').update(bytes).digest('hex') === entry.sha256,
    dimensionsMatch: png && bytes.readUInt32BE(16) === (entry.width ?? entry.dimensions?.width) && bytes.readUInt32BE(20) === (entry.height ?? entry.dimensions?.height),
    alpha: png && [4, 6].includes(bytes[25]) };
};
const delivered = entry => Object.values(inspectPng(entry)).every(Boolean);
const isStrictGeneric = (hero, slot, name) => slot === 'defense'
  ? /Signature Guard|defensive action/i.test(name) || name === `${hero.name} Guard`
  : patterns[slot].test(name);

export function measureCombatFidelity() {
  const baseline = json('docs/combat-fidelity-2026-10-18/baseline.json');
  const entities = json('src/game/combat/entityAssets.generated.json').entries;
  const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
  const rawGeneric = [];
  const effectiveGeneric = [];
  const rawStrict = [];
  const effectiveStrict = [];
  const unresolved = [];
  for (const hero of HEROES_DB) for (const slot of slots) {
    if (patterns[slot].test(hero[slot]?.name || '')) rawGeneric.push({ id: hero.id, universe: hero.universe, slot, name: hero[slot].name });
    if (isStrictGeneric(hero, slot, hero[slot]?.name || '')) rawStrict.push({ id: hero.id, universe: hero.universe, slot, name: hero[slot].name });
    const profile = resolveCombatAbility(hero, slot);
    if (!profile) unresolved.push({ id: hero.id, universe: hero.universe, slot });
    else if (patterns[slot].test(profile.name)) effectiveGeneric.push({ id: hero.id, universe: hero.universe, slot, name: profile.name });
    if (profile && isStrictGeneric(hero, slot, profile.name)) effectiveStrict.push({ id: hero.id, universe: hero.universe, slot, name: profile.name });
  }
  const remainingKeys = new Set(effectiveGeneric.map(entry => `${entry.id}:${entry.slot}`));
  const fixedBaseline = baseline.genericAbilitySlots.entries.filter(entry => !remainingKeys.has(`${entry.id}:${entry.slot}`)
    && resolveCombatAbility(roster.get(entry.id), entry.slot));
  const bindings = [];
  const dedicatedManifestHeroes = [];
  for (const hero of HEROES_DB) {
    if (getMeleeAnimationManifest(hero.id)) dedicatedManifestHeroes.push(hero.id);
    for (const state of MELEE_STATES) {
      const actor = { ...hero, state };
      const dedicated = getHeroMeleeAnimationFrame(actor, 0);
      const sheet = dedicated?.animation?.sheet || getHeroSpriteSheetSrc(actor, 'melee');
      const resolution = getSpriteStateResolution(state, getSpriteSheetLayout(sheet));
      bindings.push({ heroId: hero.id, state, sourceState: resolution.sourceState, row: resolution.row,
        binding: dedicated ? 'dedicated-melee-manifest' : resolution.binding });
    }
  }
  const presentations = Object.values(CHARACTER_PRESENTATIONS).map(record => {
    const hero = roster.get(record.heroId) || { id: record.heroId, universe: record.universe };
    return {
      id: record.heroId, universe: record.universe,
      phases: PRESENTATION_PHASES.map(phase => {
        const script = resolvePresentationScript(hero, phase);
        const samples = script.beats.map(beat => samplePresentationScript(script, script.duration * beat.at));
        return { phase, scriptId: script.id, sourceReference: script.sourceReference, effectKind: script.effect.kind,
          uniqueSelectedFrames: new Set(samples.map(sample => `${sample.asset.sheet}:${sample.asset.row}:${sample.asset.col}`)).size,
          uniquePositions: new Set(samples.map(sample => `${sample.x}:${sample.y}:${sample.scale}:${sample.opacity}`)).size,
          missingAssets: script.missingAssets,
          selectedAssets: [...new Set(samples.map(sample => sample.asset.sheet))],
          sourceSequenceVerified: script.provenance.canonicalSequence === true };
      })
    };
  });
  const choreography = entities.map(entity => {
    const spec = SUMMON_CHOREOGRAPHIES[entity.key];
    if (!spec) return { id: entity.id, key: entity.key, missing: true };
    const scene = { actor: { id: 'caller', x: 140, y: 330 }, targets: [{ id: 'target', x: 600, y: 330 }],
      choreography: spec, side: 'player', durationTicks: 192, impactTick: 99 };
    const samples = [0, 24, 48, 72, 98, 99, 110, 140, 170, 192].map(tick => getSummonChoreographyState({ ...scene, tick }, { width: 760, height: 420 }));
    return { id: entity.id, key: entity.key, path: spec.path, sourceReference: spec.sourceReference,
      poseIndices: [...new Set(samples.map(sample => sample.poseIndex))],
      effectKinds: [...new Set(samples.flatMap(sample => sample.visuals.map(visual => visual.kind)))],
      sampledGeometry: samples.map(sample => ({ tick: sample.tick, ...sample.performer })),
      sourceSequenceVerified: false };
  });
  const universes = [...new Set(HEROES_DB.map(hero => hero.universe))];
  const stageDefaults = universes.map(universe => {
    const atmosphere = getStageAtmosphereProfile({ universe });
    const animation = getStageAnimationProfile({ universe });
    return { universe, enabled: atmosphere.enabled, effect: atmosphere.effect,
      sceneAnimation: animation?.id || null, renderingKind: atmosphere.renderingKind || 'shared-procedural-overlay',
      sourceVisualValidation: atmosphere.sourceVisualValidation };
  });
  const pixelAuditPath = 'docs/combat-fidelity-2026-10-18/character-animation-pixel-audit.json';
  const nativeDeclared = getCharacterAnimationAssets();
  const deliveredNative = nativeDeclared.filter(delivered);
  const completePresentation = entry => entry.frames === 32 && ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super'].every(phase => entry.phases?.[phase]?.frames === 4);
  const nativeEntries = deliveredNative.filter(completePresentation);
  const partialNativeEntries = deliveredNative.filter(entry => !completePresentation(entry));
  const nativeIds = nativeEntries.map(entry => entry.heroId || entry.sourceHeroId || entry.id);
  const cloudRegistryPaths = ['src/game/combat/cloudMeleeMotion.generated.json', 'src/game/combat/cloudMeleeCombat.generated.json', 'src/game/combat/tifaMeleeMotion.generated.json', 'src/game/combat/tifaMeleeCombat.generated.json', 'src/game/combat/gokuMeleeMotion.generated.json', 'src/game/combat/gokuMeleeCombat.generated.json', 'src/game/combat/vegetaMeleeMotion.generated.json', 'src/game/combat/vegetaMeleeCombat.generated.json', 'src/game/combat/sonicMeleeMotion.generated.json', 'src/game/combat/sonicMeleeCombat.generated.json', 'src/game/combat/ragnaMeleeMotion.generated.json', 'src/game/combat/ragnaMeleeCombat.generated.json', 'src/game/combat/kiryuMeleeMotion.generated.json', 'src/game/combat/kiryuMeleeCombat.generated.json', 'src/game/combat/chrisMeleeMotion.generated.json', 'src/game/combat/chrisMeleeCombat.generated.json', 'src/game/combat/neoMeleeMotion.generated.json', 'src/game/combat/neoMeleeCombat.generated.json', 'src/game/combat/freemanMeleeMotion.generated.json', 'src/game/combat/freemanMeleeCombat.generated.json'];
  cloudRegistryPaths.push(...['buffy', 'arthur', 'isaac', 'ripley', 'aragorn', 'sirDaniel'].flatMap(id => [`src/game/combat/${id}MeleeMotion.generated.json`, `src/game/combat/${id}MeleeCombat.generated.json`]));
  cloudRegistryPaths.push('src/game/combat/characterSenuaMotionWave16.generated.json', 'src/game/combat/characterSenuaActionWave16.generated.json');
  const cloudAssets = cloudRegistryPaths.flatMap(file => existsSync(new URL(file, root)) ? json(file).entries : []);
  const cloudAssetsBySheet = new Map(cloudAssets.map(entry => [entry.sheet, entry]));
  const detailedManifests = dedicatedManifestHeroes.map(id => {
    const manifest = getMeleeAnimationManifest(id);
    const entries = MELEE_STATES.filter(state => manifest.animations?.[state]).map(state => ({ state, ...manifest.animations[state] }));
    const rows = entries.map(entry => `${entry.sheet}:${entry.row}`);
    const statesWithoutNativeFile = entries.filter(entry => {
      const asset = cloudAssetsBySheet.get(entry.sheet);
      return !asset || asset.heroId !== id || asset.universe !== roster.get(id).universe || !delivered(asset);
    }).map(entry => entry.state);
    const missingStates = MELEE_STATES.filter(state => !manifest.animations?.[state]);
    const rowBoundsValid = entries.every(entry => entry.row >= 0 && entry.row < manifest.rows && entry.startColumn >= 0 && entry.startColumn + entry.frameCount <= manifest.columns);
    const complete = missingStates.length === 0 && new Set(rows).size === MELEE_STATES.length && statesWithoutNativeFile.length === 0
      && rowBoundsValid && entries.every(entry => entry.frameCount >= 4);
    return { id, states: entries.length, uniqueSheetRows: new Set(rows).size, missingStates, statesWithoutNativeFile, rowBoundsValid,
      boundFrames: entries.reduce((sum, entry) => sum + entry.frameCount, 0),
      sheets: [...new Set(entries.map(entry => entry.sheet))], complete, source1to1Verified: false };
  });
  const residualBaseline = json('docs/combat-fidelity-2026-10-18/residual-ability-baseline.json');
  const loreCorrections = Object.entries(ABILITIES_CORRECTIONS).map(([id, entry]) => ({
    id, universe: entry.universe, sourceWork: entry.sourceWork, sourceReference: entry.sourceReference,
    slots: slots.filter(slot => entry[slot]).map(slot => ({ slot, name: entry[slot].name,
      effect: entry[slot].targeting.effect, damage: entry[slot].dmg, targetSide: entry[slot].targeting.targetSide })),
    source1to1Verified: false
  }));
  const correctionPaths = ['src/game/combat/characterSpriteCorrections.generated.json', 'src/game/combat/characterSpriteCorrectionsWave2.generated.json', 'src/game/combat/characterSpriteCorrectionsWave4.generated.json', 'src/game/combat/characterSpriteCorrectionsWave5.generated.json', ...['A', 'B', 'C'].flatMap(part => [6, 7].map(wave => `src/game/combat/characterSpriteCorrectionsWave${wave}Part${part}.generated.json`))];
  correctionPaths.push(...['A', 'B', 'C', 'D'].map(part => `src/game/combat/characterSpriteCorrectionsWave8Part${part}.generated.json`));
  correctionPaths.push(...['A', 'B', 'C', 'D'].map(part => `src/game/combat/characterSpriteCorrectionsWave9Part${part}.generated.json`));
  correctionPaths.push(...['A', 'B', 'C', 'D'].map(part => `src/game/combat/characterSpriteCorrectionsWave10Part${part}.generated.json`));
  correctionPaths.push(...['A', 'B', 'C', 'D'].map(part => `src/game/combat/characterSpriteCorrectionsWave11Part${part}.generated.json`));
  correctionPaths.push(...['A', 'B', 'C', 'D'].map(part => `src/game/combat/characterSpriteCorrectionsWave12Part${part}.generated.json`));
  correctionPaths.push(...['A', 'B'].map(part => `src/game/combat/characterSpriteCorrectionsWave13Part${part}.generated.json`));
  correctionPaths.push(...['A', 'B'].map(part => `src/game/combat/characterSpriteCorrectionsWave14Part${part}.generated.json`));
  correctionPaths.push(...['A', 'B', 'C'].map(part => `src/game/combat/characterSpriteCorrectionsWave15Part${part}.generated.json`));
  correctionPaths.push(...['A', 'B', 'C'].map(part => `src/game/combat/characterSpriteCorrectionsWave16Part${part}.generated.json`));
  const baseCorrectionDeclared = correctionPaths.flatMap(file => existsSync(new URL(file, root)) ? json(file).entries : []);
  const baseCorrections = baseCorrectionDeclared.filter(delivered);
  const formDeclared = getCharacterFormAssets();
  const forms = formDeclared.filter(delivered);
  const summonAnimationPaths = ['src/game/combat/summonAnimationsWave5.generated.json', 'src/game/combat/summonAnimationsWave6.generated.json', 'src/game/combat/summonAnimationsWave7.generated.json', 'src/game/combat/summonAnimationsWave8.generated.json', 'src/game/combat/summonAnimationsWave9.generated.json', 'src/game/combat/summonAnimationsWave10.generated.json', 'src/game/combat/summonAnimationsWave11.generated.json'];
  summonAnimationPaths.push('src/game/combat/summonAnimationsWave12.generated.json');
  summonAnimationPaths.push('src/game/combat/summonAnimationsWave13.generated.json');
  summonAnimationPaths.push('src/game/combat/summonAnimationsWave14.generated.json');
  summonAnimationPaths.push('src/game/combat/summonAnimationsWave15.generated.json');
  summonAnimationPaths.push('src/game/combat/summonAnimationsWave16.generated.json');
  const summonAnimationDeclared = summonAnimationPaths.flatMap(file => existsSync(new URL(file, root)) ? json(file).entries : []);
  const summonAnimations = summonAnimationDeclared.filter(delivered);
  const wave14SummonAnimations = existsSync(new URL('src/game/combat/summonAnimationsWave14.generated.json', root))
    ? json('src/game/combat/summonAnimationsWave14.generated.json').entries.filter(delivered) : [];
  const liveSummonDescriptors = HEROES_DB.map(hero => ({ hero, descriptor: resolveUniverseSummon(hero) }));
  const wave10RosterBindings = liveSummonDescriptors.filter(({ hero }) => ROSTER_REINFORCEMENTS_WAVE10[hero.id]).map(({ hero, descriptor }) => ({
    callerHeroId: hero.id, universe: hero.universe, performerHeroId: descriptor?.performer?.id || null,
    actionName: descriptor?.action?.name || null, effect: descriptor?.action?.targeting?.effect || null,
    native16AssetId: resolveSummonAnimationAsset(descriptor)?.id || null, source1to1Verified: false
  }));
  const wave11RosterBindings = liveSummonDescriptors.filter(({ hero }) => ROSTER_REINFORCEMENTS_WAVE11[hero.id]).map(({ hero, descriptor }) => ({
    callerHeroId: hero.id, universe: hero.universe, performerHeroId: descriptor?.performer?.id || null,
    actionName: descriptor?.action?.name || null, effect: descriptor?.action?.targeting?.effect || null,
    native16AssetId: resolveSummonAnimationAsset(descriptor)?.id || null, source1to1Verified: false
  }));
  const wave12RosterBindings = liveSummonDescriptors.filter(({ hero }) => ROSTER_REINFORCEMENTS_WAVE12[hero.id]).map(({ hero, descriptor }) => ({
    callerHeroId: hero.id, universe: hero.universe, performerHeroId: descriptor?.performer?.id || null,
    actionName: descriptor?.action?.name || null, effect: descriptor?.action?.targeting?.effect || null,
    native16AssetId: resolveSummonAnimationAsset(descriptor)?.id || null, source1to1Verified: false
  }));
  const wave13RosterBindings = liveSummonDescriptors.filter(({ hero }) => ROSTER_REINFORCEMENTS_WAVE13[hero.id]).map(({ hero, descriptor }) => ({
    callerHeroId: hero.id, universe: hero.universe, performerHeroId: descriptor?.performer?.id || null,
    actionName: descriptor?.action?.name || null, effect: descriptor?.action?.targeting?.effect || null,
    native16AssetId: resolveSummonAnimationAsset(descriptor)?.id || null, source1to1Verified: false
  }));
  const wave14RosterBindings = liveSummonDescriptors.filter(({ hero }) => ROSTER_REINFORCEMENTS_WAVE14[hero.id]).map(({ hero, descriptor }) => ({
    callerHeroId: hero.id, universe: hero.universe, performerHeroId: descriptor?.performer?.id || null,
    actionName: descriptor?.action?.name || null, effect: descriptor?.action?.targeting?.effect || null,
    native16AssetId: resolveSummonAnimationAsset(descriptor)?.id || null, source1to1Verified: false
  }));
  const wave2BaselinePath = 'docs/combat-fidelity-wave2-2026-10-18/baseline.json';
  const wave3BaselinePath = 'docs/combat-fidelity-wave3-2026-10-18/baseline.json';
  const wave4BaselinePath = 'docs/combat-fidelity-wave4-2026-10-18/baseline.json';
  const wave5BaselinePath = 'docs/combat-fidelity-wave5-2026-10-20/baseline.json';
  const wave6BaselinePath = 'docs/combat-fidelity-wave6-2026-10-20/baseline.json';
  const wave7Directory = 'docs/combat-fidelity-wave7-2026-10-20';
  const wave7BaselinePath = `${wave7Directory}/baseline.json`;
  const stageModes = ['Combat', 'Melee', 'RPG', 'Tactics'];
  const stageModeCoverage = universes.map(universe => ({ universe, mechanisms: Object.fromEntries(stageModes.map(mode => [mode, getStageAnimationProfile({ universe, mode })?.id || null])) }));
  const wave7PresentationDelivery = WAVE_7_PRESENTATION_DEFINITIONS.map(([id, universe, sourceReference, actionName]) => ({
    id, universe, sourceReference, actionName,
    rosterHero: roster.get(id)?.universe === universe,
    recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === universe,
    nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave7(resolveCombatAbility(roster.get(id), 'special')),
    source1to1Verified: false
  }));
  const wave8Directory = 'docs/combat-fidelity-wave8-2026-10-20';
  const wave8BaselinePath = `${wave8Directory}/baseline.json`;
  const wave8PresentationDelivery = WAVE_8_PRESENTATION_DEFINITIONS.map(([id, universe, sourceReference, actionName]) => ({
    id, universe, sourceReference, actionName,
    rosterHero: roster.get(id)?.universe === universe,
    recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === universe,
    nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave8(resolveCombatAbility(roster.get(id), 'special')),
    nativeAnimationDelivered: nativeIds.includes(id),
    partialNativeAnimationDelivered: partialNativeEntries.some(entry => entry.heroId === id),
    baseCorrectionDelivered: baseCorrections.some(entry => entry.heroId === id), source1to1Verified: false
  }));
  // Archive inputs and browser results are hashed only once they exist. Reports,
  // validation outputs and logs are excluded to avoid self-referential hashes.
  const wave8EvidenceFiles = readdirSync(new URL(wave8Directory, root), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(json|mjs|txt)$/.test(entry.name)
      && !['current.json', 'validation.json', 'production-assets-http.json', 'production-assets-http-result.json'].includes(entry.name))
    .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), ''));
  const wave9Directory = 'docs/combat-fidelity-wave9-2026-10-22';
  const wave9BaselinePath = `${wave9Directory}/baseline.json`;
  const wave9PresentationDelivery = WAVE_9_PRESENTATION_DEFINITIONS.map(([id, universe, sourceReference, actionName]) => ({
    id, universe, sourceReference, actionName,
    rosterHero: roster.get(id)?.universe === universe,
    recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === universe,
    nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave9(resolveCombatAbility(roster.get(id), 'special')),
    nativeAnimationDelivered: nativeIds.includes(id),
    partialNativeAnimationDelivered: partialNativeEntries.some(entry => entry.heroId === id),
    baseCorrectionDelivered: baseCorrections.some(entry => entry.heroId === id), source1to1Verified: false
  }));
  const wave9EvidenceFiles = readdirSync(new URL(wave9Directory, root), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(json|mjs|txt)$/.test(entry.name)
      && !['current.json', 'validation.json', 'production-assets-http.json', 'production-assets-http-result.json'].includes(entry.name))
    .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), ''));
  const wave10Directory = 'docs/combat-fidelity-wave10-2026-10-23';
  const wave10BaselinePath = `${wave10Directory}/baseline.json`;
  const wave10PresentationDelivery = WAVE_10_PRESENTATION_DEFINITIONS.map(([id, universe, sourceReference, actionName]) => ({
    id, universe, sourceReference, actionName,
    rosterHero: roster.get(id)?.universe === universe,
    recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === universe,
    nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave10(resolveCombatAbility(roster.get(id), 'special')),
    nativeAnimationDelivered: nativeIds.includes(id),
    partialNativeAnimationDelivered: partialNativeEntries.some(entry => entry.heroId === id),
    baseCorrectionDelivered: baseCorrections.some(entry => entry.heroId === id), source1to1Verified: false
  }));
  const wave10EvidenceFiles = readdirSync(new URL(wave10Directory, root), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(json|mjs|txt)$/.test(entry.name)
      && !['current.json', 'validation.json', 'production-assets-http.json', 'production-assets-http-result.json'].includes(entry.name))
    .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), ''));
  const wave11Directory = 'docs/combat-fidelity-wave11-2026-10-23';
  const wave11BaselinePath = `${wave11Directory}/baseline.json`;
  const wave11PresentationDelivery = WAVE_11_PRESENTATION_DEFINITIONS.map(([id, universe, sourceReference, actionName]) => ({
    id, universe, sourceReference, actionName,
    rosterHero: roster.get(id)?.universe === universe,
    recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === universe,
    nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave11(resolveCombatAbility(roster.get(id), 'special')),
    nativeAnimationDelivered: nativeIds.includes(id),
    partialNativeAnimationDelivered: partialNativeEntries.some(entry => entry.heroId === id),
    baseCorrectionDelivered: baseCorrections.some(entry => entry.heroId === id), source1to1Verified: false
  }));
  const wave11EvidenceFiles = readdirSync(new URL(wave11Directory, root), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(json|mjs|txt|py)$/.test(entry.name)
      && !['current.json', 'validation.json', 'build-exit.json', 'production-assets-http.json', 'production-assets-http-result.json'].includes(entry.name))
    .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), ''));
  const wave12Directory = 'docs/combat-fidelity-wave12-2026-10-23';
  const wave12BaselinePath = `${wave12Directory}/baseline.json`;
  const wave12PresentationDelivery = WAVE_12_PRESENTATION_DEFINITIONS.map(([id, universe, sourceReference, actionName]) => ({
    id, universe, sourceReference, actionName,
    rosterHero: roster.get(id)?.universe === universe,
    recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === universe,
    nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave12(resolveCombatAbility(roster.get(id), 'special')),
    nativeAnimationDelivered: nativeIds.includes(id),
    partialNativeAnimationDelivered: partialNativeEntries.some(entry => entry.heroId === id),
    baseCorrectionDelivered: baseCorrections.some(entry => entry.heroId === id), source1to1Verified: false
  }));
  const wave12EvidenceFiles = readdirSync(new URL(wave12Directory, root), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /\.(json|mjs|txt|py)$/.test(entry.name)
      && !['current.json', 'validation.json', 'build-exit.json', 'production-assets-http.json', 'production-assets-http-result.json'].includes(entry.name))
    .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), ''));
  const wave13Directory = 'docs/combat-fidelity-wave13-2026-10-24';
  const wave13BaselinePath = `${wave13Directory}/baseline.json`;
  const wave13Baseline = json(wave13BaselinePath);
  const wave14Directory = 'docs/combat-fidelity-wave14-2026-10-25';
  const wave14BaselinePath = `${wave14Directory}/baseline.json`;
  const wave14Baseline = json(wave14BaselinePath);
  const wave14PlanPath = `${wave14Directory}/batch-plan-before.json`;
  const wave14Plan = json(wave14PlanPath);
  const wave14BaselineProvenance = json(`${wave14Directory}/baseline-provenance.json`);
  const wave14CharacterIds = WAVE_14_PRESENTATION_DEFINITIONS.map(entry => entry[0]);
  const sameIds = (left, right) => JSON.stringify([...left].sort()) === JSON.stringify([...right].sort());
  if (wave14CharacterIds.length !== 40 || new Set(wave14CharacterIds).size !== 40
      || !sameIds(wave14CharacterIds, wave14Plan.heroes.map(entry => entry.hero.id))
      || !sameIds(Object.keys(ABILITIES_WAVE14), wave14BaselineProvenance.newAbilityIds)
      || !sameIds(Object.keys(ABILITY_REVISIONS_WAVE14), wave14BaselineProvenance.revisedAbilityIds)
      || Object.keys(ABILITIES_WAVE14).length !== 12 || Object.keys(ABILITY_REVISIONS_WAVE14).length !== 28) {
    throw new Error('Wave14 definitions no longer match the frozen 40-character plan and its 12 new / 28 revised ability IDs');
  }
  const previousValidationPath = `${wave13Directory}/validation.json`;
  const previousValidation = json(previousValidationPath);
  const previousCurrentSha256 = createHash('sha256').update(read(`${wave13Directory}/current.json`)).digest('hex');
  if (previousCurrentSha256 !== previousValidation.currentAuditSha256
      || previousCurrentSha256 !== createHash('sha256').update(read(wave14BaselinePath)).digest('hex')
      || previousCurrentSha256 !== wave14Plan.priorAudit.sha256
      || createHash('sha256').update(read(previousValidationPath)).digest('hex') !== wave14Plan.priorValidation.sha256) {
    throw new Error('Historical W13 audit/validation no longer match the frozen W14 baseline and plan');
  }
  if (wave14Baseline.assetInventory.registryFiles !== 111 || previousValidation.distAssets.length !== 638) {
    throw new Error('W14 requires the validated W13 baseline of 111 production registries and 638 PNG files');
  }
  const historicalRegistryChanges = wave14Baseline.assetInventory.registries.filter(file => (
    !existsSync(new URL(file, root))
    || createHash('sha256').update(read(file)).digest('hex') !== wave14Baseline.inputHashes[file]
  ));
  const historicalPngChanges = previousValidation.distAssets.filter(entry => !delivered(entry)).map(entry => entry.sheet);
  if (historicalRegistryChanges.length || historicalPngChanges.length) throw new Error('Historical W13 assets changed: ' + JSON.stringify({ registries: historicalRegistryChanges, png: historicalPngChanges }));
  const wave13PresentationDelivery = WAVE_13_PRESENTATION_DEFINITIONS.map(([id, universe, sourceReference, actionName]) => ({
    id, universe, sourceReference, actionName,
    rosterHero: roster.get(id)?.universe === universe,
    recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === universe,
    nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave13(resolveCombatAbility(roster.get(id), 'special')),
    nativeAnimationDelivered: nativeEntries.some(entry => entry.heroId === id && entry.sheet.includes('-wave13-')),
    partialNativeAnimationDelivered: partialNativeEntries.some(entry => entry.heroId === id && entry.sheet.includes('-wave13-')),
    baseCorrectionDelivered: baseCorrections.some(entry => entry.heroId === id && entry.sheet.includes('-wave13-')),
    source1to1Verified: false
  }));
  const wave14PresentationDelivery = WAVE_14_PRESENTATION_DEFINITIONS.map(([id, universe, sourceReference, actionName]) => {
    const base = baseCorrections.find(entry => entry.heroId === id && entry.sheet.includes('-wave14-'));
    const native = nativeEntries.find(entry => entry.heroId === id && entry.sheet.includes('-wave14-'));
    return {
      id, universe, sourceReference, actionName,
      rosterHero: roster.get(id)?.universe === universe,
      recipeRegistered: CHARACTER_PRESENTATIONS[id]?.universe === universe
        && CHARACTER_PRESENTATIONS[id]?.sourceAction === actionName
        && CHARACTER_PRESENTATIONS[id]?.sourceReference === sourceReference,
      nativeSuperHelperAcceptsResolvedAction: supportsNativeSuperWave14(resolveCombatAbility(roster.get(id), 'special')),
      nativeAnimationDelivered: Boolean(native && !wave14Baseline.assetInventory.sheets.includes(native.sheet)),
      partialNativeAnimationDelivered: partialNativeEntries.some(entry => entry.heroId === id && entry.sheet.includes('-wave14-')),
      baseCorrectionDelivered: Boolean(base && !wave14Baseline.assetInventory.sheets.includes(base.sheet)),
      baseRuntimeBindingConfirmed: Boolean(base && getHeroSpriteSheetSrc(roster.get(id), 'rpg') === base.sheet),
      source1to1Verified: false
    };
  });
  const reservedReportNames = new Set(['current.json', 'validation.json', 'build-exit.json', 'production-assets-http.json', 'production-assets-http-result.json']);
  const evidenceFiles = (directory, includeSourceImages = false) => existsSync(new URL(directory, root))
    ? readdirSync(new URL(directory, root), { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile() && (includeSourceImages ? /\.(json|js|mjs|txt|py|html|png)$/i : /\.(json|mjs|txt|py)$/).test(entry.name) && !reservedReportNames.has(entry.name))
      .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), '')) : [];
  const wave13EvidenceFiles = evidenceFiles(wave13Directory);
  const tacticsEvidenceFiles = evidenceFiles('docs/tactics-verticality-2026-10-24');
  const wave14EvidenceFiles = evidenceFiles(wave14Directory, true);
  const universeTacticsEvidenceDirectories = readdirSync(new URL('docs/', root), { withFileTypes: true })
    .filter(entry => entry.isDirectory() && /tactics/i.test(entry.name) && /2026-10-(?:25|26|28)/.test(entry.name))
    .map(entry => `docs/${entry.name}`);
  const universeTacticsEvidenceFiles = universeTacticsEvidenceDirectories.flatMap(directory => evidenceFiles(directory, true));
  const wave14RuntimeInputs = ['src/game/combat', 'src/game/melee', 'scripts'].flatMap(directory => (
    readdirSync(new URL(directory, root), { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile() && /(?:Wave14|aragorn|tacticsUniverse)/i.test(entry.name) && /\.(?:js|mjs|json)$/.test(entry.name))
      .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), ''))
  ));
  const wave13RuntimeInputs = ['src/game/combat', 'src/game/melee', 'scripts'].flatMap(directory => (
    readdirSync(new URL(directory, root), { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile() && /(?:Wave13|ripley)/i.test(entry.name) && /\.(?:js|mjs|json)$/.test(entry.name))
      .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), ''))
  ));
  const allUniverseBattlefields = { ...TACTICS_UNIVERSE_BATTLEFIELDS, ...TACTICS_UNIVERSE_BATTLEFIELDS_WAVE15, ...TACTICS_UNIVERSE_BATTLEFIELDS_WAVE16 };
  const tacticsTerrains = [...Object.values(TACTICS_VERTICAL_BATTLEFIELDS), ...Object.values(allUniverseBattlefields)].map(field => {
    const terrain = normalizeTacticsTerrain(field);
    const unit = { tacticsHeight: 1.6 };
    const routeOptions = { unit, isOccupied: surface => (field.obstacles || []).some(obstacle => obstacle.hp > 0 && obstacle.surfaceId === surface.id) };
    const routeTo = (start, goal) => {
      const route = findTerrainPath(terrain, start, goal, routeOptions);
      return { from: start.surfaceId, to: goal.surfaceId || goal.id,
        cost: route?.cost ?? null, path: route?.path ?? [], transitions: route?.transitions ?? [] };
    };
    const targets = field.objective === 'extract' ? field.extractionZone || []
      : field.objective === 'disable' ? (field.obstacles || []).filter(obstacle => obstacle.type === 'objective')
        : terrain.surfaces.filter(surface => surface.type === ({ control: 'objective', artifact: 'artifact' }[field.objective]));
    const objectiveRoutes = targets.flatMap(goal => field.heroSpawns.map(start => {
      if (field.objective !== 'disable') return routeTo(start, goal);
      const target = getTerrainSurface(terrain, goal);
      const approaches = terrain.surfaces.filter(surface => Math.abs(surface.x - target.x) + Math.abs(surface.y - target.y) === 1
        && canOccupyTerrainSurface(terrain, surface, routeOptions)
        && terrainLineOfSight(terrain, surface, target, { obstacles: field.obstacles }));
      const routes = approaches.map(surface => routeTo(start, surface)).filter(route => route.cost !== null).sort((a, b) => a.cost - b.cost);
      return { from: start.surfaceId, to: goal.surfaceId, attackApproach: routes[0] || null, reachable: routes.length > 0 };
    }));
    const topology = { cols: field.cols, rows: field.rows,
      surfaces: field.surfaces.map(({ x, y, z, cornerZ, walkable, shape }) => ({ x, y, z, cornerZ, walkable, shape })) };
    return { id: field.id, layoutId: field.layoutId || null, modeExclusive: field.modeExclusive || null,
      cols: field.cols, rows: field.rows, source: field.source, presentation: field.tacticsPresentation || null,
      objective: field.objective, objectiveTarget: field.objectiveTarget, objectiveRoutes,
      allHeroObjectiveRoutesReachable: objectiveRoutes.every(route => route.reachable ?? route.cost !== null),
      geometrySha256: createHash('sha256').update(JSON.stringify(topology)).digest('hex'),
      surfaceCount: terrain.surfaces.length,
      stackedXYCells: [...terrain.byCell.values()].filter(entries => entries.length > 1).length,
      distinctAltitudes: [...new Set(terrain.surfaces.map(surface => surface.z))].sort((a, b) => a - b),
      stairs: terrain.surfaces.filter(surface => surface.shape === 'stairs').length,
      ramps: terrain.surfaces.filter(surface => surface.shape === 'ramp').length,
      thinSlabs: terrain.surfaces.filter(surface => surface.shape === 'slab').length,
      nonWalkableSurfaces: terrain.surfaces.filter(surface => !surface.walkable).length,
      weightedSurfaces: terrain.surfaces.filter(surface => surface.moveCost > 1).length,
      materials: [...new Set(terrain.surfaces.map(surface => surface.materialId))].sort(),
      sceneryKinds: [...new Set((field.obstacles || []).map(obstacle => obstacle.sceneryKind).filter(Boolean))].sort(),
      extractionRoutes: (field.extractionZone || []).map(goal => routeTo(field.heroSpawns[1], goal)),
      originalNexusArena: field.source?.universe === 'Nexus de Convergence', source1to1Verified: false };
  });
  const inputPaths = [
    'src/game/heroes.js', 'src/game/combatIdentity.js', 'src/game/spriteAssets.js', 'src/game/renderer.js',
    'src/game/canonicalCombatOverrides.js', 'src/game/combatCanonExtensions.js', 'src/game/combat/ff8SuperVisuals.js',
    'src/game/engineSmash.js', 'src/game/engineFighter.js', 'src/game/engineRpg.js', 'src/game/engineTactics.js',
    'src/components/GameCanvas.jsx', 'src/components/FighterMode.jsx',
    'src/game/combat/abilities/catalog.js', 'src/game/combat/abilities/rules.js',
    ...['abilitiesLot1', 'abilitiesLot2', 'abilitiesLot3', 'abilitiesLot4', 'abilitiesAdditional', 'abilitiesCanonical', 'abilitiesResidual', 'abilitiesCorrections']
      .map(file => `src/game/combat/abilities/${file}.js`),
    'src/game/combat/presentationCatalog.js', 'src/game/combat/summonChoreography.js',
    'src/game/combat/characterAnimationCatalog.js', 'src/game/combat/characterAnimations.generated.json',
    'src/game/combat/entityAssets.generated.json', 'src/game/melee/stageAnimationCatalog.js', 'src/game/melee/stageAtmosphere.js',
    'docs/combat-fidelity-2026-10-18/character-animation-provenance.json',
    ...correctionPaths, 'docs/combat-fidelity-2026-10-18/character-sprite-corrections-provenance.json',
    'src/game/originalUniversesManifest.json',
    'src/game/combat/characterAnimationsWave2PartA.generated.json', 'src/game/combat/characterAnimationsWave2PartB.generated.json',
    ...cloudRegistryPaths, 'src/game/melee/cloudMeleeManifest.js', 'src/game/melee/meleeAnimationManifest.js',
    'src/game/melee/stageAnimationCatalogWave2.js',
    'docs/combat-fidelity-wave2-2026-10-18/part-a-provenance.json', 'docs/combat-fidelity-wave2-2026-10-18/part-b-provenance.json',
    'docs/combat-fidelity-wave2-2026-10-18/seifer-base-provenance.json',
    'docs/combat-fidelity-wave2-2026-10-18/cloud-sources/source-archive-manifest.json',
    'docs/combat-fidelity-wave2-2026-10-18/ff8-source-facts.json', 'src/game/melee/meleeStateMachine.js',
    'src/game/melee/meleeCombatRuntime.js',
    'src/game/melee/nativeMeleeManifest.js', 'src/game/melee/tifaMeleeManifest.js',
    'src/game/combat/presentationCatalogWave3.js', 'src/game/combat/partySuperVisuals.js', 'src/game/combat/characterSuperVisuals.js',
    'src/game/combat/characterAnimationsWave3PartA.generated.json', 'src/game/combat/characterAnimationsWave3PartB.generated.json', 'src/game/combat/characterAnimationsWave3PartC.generated.json',
    'src/game/melee/stageAnimationCatalogWave3.js',
    'docs/combat-fidelity-wave3-2026-10-18/part-a-provenance.json', 'docs/combat-fidelity-wave3-2026-10-18/part-b-provenance.json', 'docs/combat-fidelity-wave3-2026-10-18/part-c-provenance.json',
    'docs/combat-fidelity-wave3-2026-10-18/tifa-sources/provenance-motion.json', 'docs/combat-fidelity-wave3-2026-10-18/tifa-sources/provenance-combat.json',
    'docs/combat-fidelity-wave3-2026-10-18/ff13-source-facts.json', 'docs/combat-fidelity-wave3-2026-10-18/ff13-part-a-source-facts.json',
    'docs/combat-fidelity-wave3-2026-10-18/ff15-part-c-source-facts.json', 'docs/combat-fidelity-wave3-2026-10-18/runtime-baseline.json',
    'src/game/combat/characterAnimationsWave4PartA.generated.json', 'src/game/combat/characterAnimationsWave4PartB.generated.json', 'src/game/combat/characterAnimationsWave4PartC.generated.json',
    'src/game/combat/characterFormsWave4.generated.json', 'src/game/combat/characterFormCatalog.js', 'src/game/combat/characterFormState.js',
    'src/game/combat/nativeSuperVisualsWave4.js', 'src/game/melee/gokuMeleeManifest.js', 'src/game/melee/stageAnimationCatalogWave4.js',
    'docs/combat-fidelity-wave4-2026-10-18/part-a-provenance.json', 'docs/combat-fidelity-wave4-2026-10-18/part-b-provenance.json', 'docs/combat-fidelity-wave4-2026-10-18/part-c-provenance.json',
    'docs/combat-fidelity-wave4-2026-10-18/goku-sources/provenance-motion.json', 'docs/combat-fidelity-wave4-2026-10-18/goku-sources/provenance-combat.json',
    'docs/combat-fidelity-wave4-2026-10-18/runtime-baseline.json',
    'docs/combat-fidelity-wave4-2026-10-18/chaos-provenance.json', 'docs/combat-fidelity-wave4-2026-10-18/chaos-source-facts.json',
    'docs/combat-fidelity-wave4-2026-10-18/part-b-source-facts.json', 'docs/combat-fidelity-wave4-2026-10-18/part-c-source-facts.json',
    'docs/combat-fidelity-wave4-2026-10-18/base-provenance.json',
    'docs/combat-fidelity-wave4-2026-10-18/goku-sources/source-archive-manifest.json',
    'docs/combat-fidelity-wave4-2026-10-18/goku-sources/grip-pixel-checks.json',
    'docs/combat-fidelity-wave4-2026-10-18/stage-source-checks.json', 'docs/combat-fidelity-wave4-2026-10-18/stage-baseline.json',
    'package.json',
    'scripts/combatCompletionAudit.mjs', 'scripts/combatCompletion.test.mjs', 'docs/combat-completion-2026-10-18/coverage.json', 'docs/audits/combat-identity-coverage.md',
    'src/game/combat/characterAnimationsWave5PartA.generated.json', 'src/game/combat/characterAnimationsWave5PartB.generated.json', 'src/game/combat/characterAnimationsWave5PartC.generated.json',
    'src/game/melee/vegetaMeleeManifest.js', 'src/game/combat/nativeSuperVisualsWave5.js',
    ...summonAnimationPaths, 'src/game/combat/summonAnimationState.js', 'src/game/combat/summonAnimationCatalog.js',
    'src/game/melee/stageAnimationCatalogWave5.js',
    'docs/combat-fidelity-wave5-2026-10-20/part-a-provenance.json', 'docs/combat-fidelity-wave5-2026-10-20/part-b-provenance.json', 'docs/combat-fidelity-wave5-2026-10-20/part-c-provenance.json',
    'docs/combat-fidelity-wave5-2026-10-20/vegeta-sources/provenance-motion.json', 'docs/combat-fidelity-wave5-2026-10-20/vegeta-sources/provenance-combat.json',
    'docs/combat-fidelity-wave5-2026-10-20/runtime-baseline.json', 'docs/combat-fidelity-wave5-2026-10-20/base-provenance.json',
    'docs/combat-fidelity-wave5-2026-10-20/stage-source-checks.json', 'docs/combat-fidelity-wave5-2026-10-20/stage-baseline.json',
    'docs/combat-fidelity-wave5-2026-10-20/ifrit-provenance.json',
    'docs/combat-fidelity-wave5-2026-10-20/part-b-source-facts.json', 'docs/combat-fidelity-wave5-2026-10-20/part-c-source-facts.json',
    'docs/combat-fidelity-wave5-2026-10-20/vegeta-sources/source-archive-manifest.json',
    'docs/combat-fidelity-wave5-2026-10-20/vegeta-sources/grip-pixel-checks.json',
    'docs/combat-fidelity-wave5-2026-10-20/presentation-stature-bc-review.json',
    'docs/combat-fidelity-wave5-2026-10-20/part-a-stature-review.json',
    'docs/combat-fidelity-wave5-2026-10-20/part-b-stature-review.json',
    'docs/combat-fidelity-wave5-2026-10-20/part-c-stature-review.json',
    'scripts/auditCharacterReferenceQuality.py', 'scripts/combatFidelityAudit.mjs',
    'scripts/buildCombatCharacterAnimationsWave5PartA.mjs', 'scripts/buildCombatCharacterAnimationsWave5PartB.mjs', 'scripts/buildCombatCharacterAnimationsWave5PartC.mjs',
    'scripts/buildCombatCharacterSpriteCorrectionsWave5.mjs', 'scripts/buildSummonAnimationsWave5.mjs',
    'scripts/combatFidelityWave5.test.mjs', 'scripts/nativeSuperRuntimeWave5.test.mjs', 'scripts/fighterProjectileVisualWave5.test.mjs', 'scripts/presentationStatureWave5.test.mjs',
    'src/game/combat/abilities/abilitiesWave6.js', 'src/game/combat/presentationCatalogWave6.js',
    'src/game/combat/nativeSuperVisualsWave6.js', 'src/game/melee/sonicMeleeManifest.js', 'src/game/melee/stageAnimationCatalogWave6.js',
    ...['A', 'B', 'C'].flatMap(part => [`src/game/combat/characterAnimationsWave6Part${part}.generated.json`,
      `scripts/buildCombatCharacterAnimationsWave6Part${part}.mjs`, `scripts/buildCombatCharacterSpriteCorrectionsWave6Part${part}.mjs`,
      `docs/combat-fidelity-wave6-2026-10-20/part-${part.toLowerCase()}-provenance.json`,
      `docs/combat-fidelity-wave6-2026-10-20/base-part-${part.toLowerCase()}-provenance.json`]),
    'scripts/buildSummonAnimationsWave6.mjs', 'docs/combat-fidelity-wave6-2026-10-20/summon-provenance.json',
    'docs/combat-fidelity-wave6-2026-10-20/sonic-sources/provenance-motion.json', 'docs/combat-fidelity-wave6-2026-10-20/sonic-sources/provenance-combat.json',
    'docs/combat-fidelity-wave6-2026-10-20/sonic-sources/grip-pixel-checks.json', 'docs/combat-fidelity-wave6-2026-10-20/sonic-sources/source-archive-manifest.json',
    'docs/combat-fidelity-wave6-2026-10-20/stage-baseline.json', 'docs/combat-fidelity-wave6-2026-10-20/stage-source-checks.json',
    'docs/combat-fidelity-wave6-2026-10-20/runtime-baseline.json',
    'scripts/combatFidelityWave6.test.mjs', 'scripts/nativeSuperRuntimeWave6.test.mjs', 'scripts/summonAnimationWave6.test.mjs',
    'scripts/combatContactVisualWave6.test.mjs', 'scripts/meleeSupportCpuWave6.test.mjs', 'scripts/stageAnimationWave6.test.mjs', 'scripts/stageAtmosphere.test.mjs',
    'docs/combat-fidelity-wave6-2026-10-20/sonic-sources/normalize-sonic-motion-atlases.mjs',
    'docs/combat-fidelity-wave6-2026-10-20/sonic-sources/verify-sonic-combat.mjs',
    // Wave7 owns its report directory; all prior baselines/current reports stay immutable.
    wave7BaselinePath, `${wave7Directory}/runtime-baseline.json`, `${wave7Directory}/role-and-source-revisions.json`, `${wave7Directory}/build-coverage.mjs`, `${wave7Directory}/browser-checks.json`, `${wave7Directory}/build-browser-checks.mjs`,
    `${wave7Directory}/part-b-attempts.json`, `${wave7Directory}/part-b-delivery.json`,
    'src/game/combat/abilities/abilitiesWave7.js', 'src/game/combat/presentationCatalogWave7.js',
    'src/game/combat/nativeSuperVisualsWave7.js', 'src/game/melee/ragnaMeleeManifest.js', 'src/game/melee/stageAnimationCatalogWave7.js',
    ...['A', 'B', 'C'].flatMap(part => [
      `src/game/combat/characterAnimationsWave7Part${part}.generated.json`,
      `scripts/buildCombatCharacterAnimationsWave7Part${part}.mjs`,
      `scripts/buildCombatCharacterSpriteCorrectionsWave7Part${part}.mjs`,
      `${wave7Directory}/part-${part.toLowerCase()}-provenance.json`,
      `${wave7Directory}/base-part-${part.toLowerCase()}-provenance.json`,
      `${wave7Directory}/part-${part.toLowerCase()}-generation-records.json`,
      `${wave7Directory}/base-part-${part.toLowerCase()}-generation-records.json`,
      `${wave7Directory}/part-${part.toLowerCase()}-source-access/access.json`
    ]),
    'scripts/buildSummonAnimationsWave7.mjs', `${wave7Directory}/summon-provenance.json`,
    `${wave7Directory}/summon-generation-records.json`, `${wave7Directory}/summon-generation-plan.json`,
    `${wave7Directory}/summon-sources/source-access.json`, `${wave7Directory}/summon-sources/source-facts.json`,
    ...['provenance-motion.json', 'provenance-combat.json', 'motion-evidence.json', 'validation-motion.json',
      'source-archive-manifest-motion.json', 'source-archive-manifest-combat.json', 'actual-tool-calls-motion.json', 'actual-tool-calls-combat.json',
      'grip-pixel-checks-combat.json', 'natural-projection-checks-combat.json', 'technical-review-combat.json',
      'normalize-ragna-motion-atlases.mjs', 'build-ragna-combat.mjs', 'verify-ragna-combat.mjs']
      .map(file => `${wave7Directory}/ragna-sources/${file}`),
    ...['stage-baseline.json', 'stage-source-checks.json', 'stage-coverage.json', 'stage-browser.json', 'stage-audit.mjs']
      .map(file => `${wave7Directory}/${file}`),
    ...['summon-wave7-result.json', 'summon-wave7-browser.mjs', 'summon-wave7-anchor-diagnostic.json',
      'ragna-core-result.json', 'ragna-core-browser.mjs', 'ragna-movement-result.json', 'ragna-movement-browser.mjs',
      'ragna-super-result.json', 'ragna-super-browser.mjs', 'ragna-evidence.json', 'fighter-projectiles-wave7.browser.mjs',
      'fighter-projectiles-result.json', 'native-presentations.json', 'native-presentations.mjs', 'base-corrections.json', 'base-corrections.mjs']
      .map(file => `${wave7Directory}/browser/${file}`),
    'scripts/combatFidelityWave7.test.mjs', 'scripts/nativeSuperRuntimeWave7.test.mjs', 'scripts/summonAnimationWave7.test.mjs',
    'scripts/combatContactVisualWave7.test.mjs', 'scripts/stageAnimationWave7.test.mjs', 'scripts/stageAnimationWave7.browser.mjs'
  ];
  inputPaths.push(...wave8EvidenceFiles,
    'src/game/combat/abilities/abilitiesWave8.js', 'src/game/combat/presentationCatalogWave8.js',
    'src/game/combat/nativeSuperVisualsWave8.js', 'src/game/combat/rosterSummonChoreographyWave8.js',
    'src/game/melee/kiryuMeleeManifest.js', 'src/game/melee/stageAnimationCatalogWave8.js',
    ...['A', 'B', 'C', 'D'].flatMap(part => [`src/game/combat/characterAnimationsWave8Part${part}.generated.json`,
      `scripts/buildCombatCharacterAnimationsWave8Part${part}.mjs`, `scripts/buildCombatCharacterSpriteCorrectionsWave8Part${part}.mjs`]),
    'scripts/buildSummonAnimationsWave8.mjs', 'scripts/combatFidelityWave8.test.mjs',
    'scripts/nativeSuperRuntimeWave8.test.mjs', 'scripts/summonAnimationWave8.test.mjs',
    'scripts/stageAnimationWave8.test.mjs', 'scripts/stageAnimationWave8.browser.mjs');
  inputPaths.push(...wave9EvidenceFiles,
    'src/game/combat/abilities/abilitiesWave9.js', 'src/game/combat/presentationCatalogWave9.js',
    'src/game/combat/nativeSuperVisualsWave9.js', 'src/game/combat/rosterSummonChoreographyWave9.js',
    'src/game/melee/chrisMeleeManifest.js', 'src/game/melee/stageAnimationCatalogWave9.js',
    ...['A', 'B', 'C', 'D'].flatMap(part => [`src/game/combat/abilities/abilitiesWave9Part${part}.js`,
      `src/game/combat/nativeSuperAnchorsWave9Part${part}.generated.json`,
      `src/game/combat/characterAnimationsWave9Part${part}.generated.json`,
      `scripts/buildCombatCharacterAnimationsWave9Part${part}.mjs`, `scripts/buildCombatCharacterSpriteCorrectionsWave9Part${part}.mjs`]),
    'scripts/buildSummonAnimationsWave9.mjs', 'scripts/combatFidelityWave9.test.mjs',
    'scripts/nativeSuperRuntimeWave9.test.mjs', 'scripts/summonAnimationWave9.test.mjs',
    'scripts/stageAnimationWave9.test.mjs', 'scripts/stageAnimationWave9.browser.mjs');
  inputPaths.push(...wave10EvidenceFiles, 'src/game/combat/combatSourceDefinitionsWave10.js', 'src/game/combat/characterPresentationFallbacksWave10.js', 'src/game/combat/rosterReinforcementsWave10.js', 'scripts/buildCombatEntityAssets.mjs',
    'src/game/combat/abilities/abilitiesWave10.js', 'src/game/combat/presentationCatalogWave10.js',
    'src/game/combat/nativeSuperVisualsWave10.js', 'src/game/combat/rosterSummonChoreographyWave10.js',
    'src/game/melee/neoMeleeManifest.js', 'src/game/melee/freemanMeleeManifest.js', 'src/game/melee/stageAnimationCatalogWave10.js',
    ...['A', 'B', 'C', 'D'].flatMap(part => [`src/game/combat/abilities/abilitiesWave10Part${part}.js`,
      `src/game/combat/nativeSuperAnchorsWave10Part${part}.generated.json`,
      `src/game/combat/characterAnimationsWave10Part${part}.generated.json`,
      `scripts/buildCombatCharacterAnimationsWave10Part${part}.mjs`, `scripts/buildCombatCharacterSpriteCorrectionsWave10Part${part}.mjs`]),
    'scripts/buildSummonAnimationsWave10.mjs', 'scripts/combatFidelityWave10.test.mjs',
    'scripts/nativeSuperRuntimeWave10.test.mjs', 'scripts/summonAnimationWave10.test.mjs',
    'scripts/stageAnimationWave10.test.mjs', 'scripts/stageAnimationWave10.browser.mjs',
    'docs/combat-fidelity-wave10-2026-10-23/rift-refresh/test-retired-known-cases.py',
    'docs/combat-fidelity-wave10-2026-10-23/rift-refresh/auditCharacterReferenceQuality-before-retired-cases.py',
    'docs/combat-fidelity-wave10-2026-10-23/rift-refresh/run-sequential-refresh.py');
  inputPaths.push(...wave11EvidenceFiles, 'scripts/combatFidelity.test.mjs', 'src/game/combat/combatSourceDefinitionsWave11.js', 'src/game/combat/characterLegacyFallbacksWave11.js', 'src/game/combat/rosterReinforcementsWave11.js', 'scripts/buildCombatEntityAssets.mjs',
    'src/game/combat/abilities/abilitiesWave11.js', 'src/game/combat/presentationCatalogWave11.js',
    'src/game/combat/nativeSuperVisualsWave11.js', 'src/game/combat/rosterSummonChoreographyWave11.js',
    'src/game/melee/buffyMeleeManifest.js', 'src/game/melee/arthurMeleeManifest.js', 'src/game/melee/stageAnimationCatalogWave11.js',
    ...['A', 'B', 'C', 'D'].flatMap(part => [`src/game/combat/abilities/abilitiesWave11Part${part}.js`,
      `src/game/combat/nativeSuperAnchorsWave11Part${part}.generated.json`,
      `src/game/combat/characterAnimationsWave11Part${part}.generated.json`,
      `scripts/buildCombatCharacterAnimationsWave11Part${part}.mjs`, `scripts/buildCombatCharacterSpriteCorrectionsWave11Part${part}.mjs`]),
    'scripts/buildSummonAnimationsWave11.mjs', 'scripts/combatFidelityWave11.test.mjs',
    'scripts/nativeSuperRuntimeWave11.test.mjs', 'scripts/summonAnimationWave11.test.mjs',
    'scripts/stageAnimationWave11.test.mjs', 'scripts/stageAnimationWave11.browser.mjs');
  inputPaths.push(...wave12EvidenceFiles, 'docs/tactics-terrain-verticality.md', 'docs/tactics-terrain-demo.html',
    'src/game/combat/abilities/abilitiesWave12.js', 'src/game/combat/combatSourceDefinitionsWave12.js',
    'src/game/combat/nativeSuperVisualsWave12.js', 'src/game/combat/presentationCatalogWave12.js', 'src/game/combat/characterLegacyFallbacksWave12.js',
    'src/game/combat/rosterReinforcementsWave12.js', 'src/game/combat/rosterSummonChoreographyWave12.js',
    'src/game/combat/summonAnimationsWave12.generated.json', 'scripts/buildSummonAnimationsWave12.mjs',
    'scripts/combatFidelityWave12.test.mjs', 'scripts/stageAnimationWave12.test.mjs', 'src/game/melee/stageAnimationCatalogWave12.js', 'src/game/melee/isaacMeleeManifest.js',
    ...['A', 'B', 'C', 'D'].flatMap(part => [`src/game/combat/abilities/abilitiesWave12Part${part}.js`,
      `src/game/combat/combatSourceDefinitionsWave12Part${part}.js`,
      `src/game/combat/nativeSuperAnchorsWave12Part${part}.generated.json`,
      `src/game/combat/characterAnimationsWave12Part${part}.generated.json`,
      `scripts/buildCombatCharacterAnimationsWave12Part${part}.mjs`, `scripts/buildCombatCharacterSpriteCorrectionsWave12Part${part}.mjs`]));
  inputPaths.push(...wave13EvidenceFiles, ...tacticsEvidenceFiles, ...wave13RuntimeInputs,
    wave13BaselinePath, `${wave12Directory}/current.json`, `${wave12Directory}/validation.json`,
    `${wave12Directory}/build-exit.json`, `${wave12Directory}/browser/production-assets-http.json`,
    'src/game/tacticsTerrain.js', 'src/game/tacticsVerticalBattlefields.js', 'src/game/tacticsTerrainRenderer.js',
    'src/game/tacticsVerticalRuntime.js', 'src/game/tacticsTerrainControls.js', 'src/game/tacticsBattlefields.js',
    'src/game/customBattle.js', 'src/components/CustomBattleMode.jsx',
    'scripts/tacticsTerrain.test.mjs', 'scripts/tacticsTerrainRenderer.test.mjs',
    'scripts/tacticsVerticalIntegration.test.mjs', 'scripts/tacticsVerticalEffects.test.mjs', 'scripts/tacticsVerticalReview.test.mjs',
    'scripts/tacticsVerticalityUi.test.mjs', 'scripts/tacticsVerticalityUi.browser.mjs', 'scripts/progressionAudit.mjs');
  inputPaths.push(...wave14EvidenceFiles, ...universeTacticsEvidenceFiles, ...wave14RuntimeInputs,
    wave14BaselinePath, wave14PlanPath, `${wave13Directory}/current.json`, previousValidationPath,
    `${wave13Directory}/build-exit.json`, `${wave13Directory}/browser/production-assets-http.json`,
    'src/game/tacticsUniverseBattlefields.js', 'src/game/tacticsEnvironmentRenderer.js', 'src/game/tacticsPickupSurface.js',
    'src/components/TacticsTerrainPanel.jsx', 'src/components/GameCanvas.jsx', 'src/App.jsx',
    'scripts/tacticsUniverseBattlefields.test.mjs', 'scripts/tacticsUniversePresentation.test.mjs',
    'scripts/tacticsUniverseRuntime.test.mjs', 'scripts/tacticsUniverseRouting.test.mjs',
    'scripts/tacticsUniverseUi.test.mjs', 'scripts/tacticsUniverseUi.browser.mjs', 'scripts/progressionAudit.mjs');
  const wave15RuntimeInputs = ['src/game/combat', 'src/game/melee', 'scripts'].flatMap(directory => (
    readdirSync(new URL(directory, root), { recursive: true, withFileTypes: true })
      .filter(entry => entry.isFile() && /Wave15/i.test(entry.name) && /\.(?:js|mjs|json)$/.test(entry.name))
      .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), ''))
  ));
  inputPaths.push(...wave15RuntimeInputs, ...evidenceFiles('docs/combat-fidelity-wave15-2026-10-26', true),
    'scripts/combatFidelityAudit.mjs', 'scripts/combatCompletionAudit.mjs', 'scripts/auditCharacterReferenceQuality.py',
    'src/game/rpgTargeting.js', 'src/game/tacticsControl.js', 'src/game/melee/sirDanielMeleeManifest.js', 'scripts/rpgAuthoredSpecial.test.mjs',
    'scripts/buildRiftDossierCatalog.mjs', 'scripts/buildRiftDossierAssetRegistry.mjs',
    'src/game/tacticsUniverseBattlefieldsWave15.js', 'src/game/tacticsUniversePresentationWave15.js',
    'package.json', 'package-lock.json');
  // Archived source registries remain hashed evidence, but only production
  // registries can contribute delivered assets to the HTTP/build inventory.
  const assetRegistries = [...new Set(inputPaths)].filter(file => file.startsWith('src/game/') && file.endsWith('.generated.json') && existsSync(new URL(file, root)))
    .map(file => ({ file, entries: json(file).entries || [] })).filter(record => record.entries.some(entry => typeof entry.sheet === 'string'));
  const assetFiles = new Map(assetRegistries.flatMap(record => record.entries).filter(delivered).map(entry => [entry.sheet, entry]));
  const wave16RuntimeInputs = ['src', 'scripts'].flatMap(directory => readdirSync(new URL(directory, root), { recursive: true, withFileTypes: true })
    .filter(entry => entry.isFile() && /(?:Wave16|senua|cohortWave16)/i.test(entry.name) && /\.(?:js|jsx|mjs|json|py)$/.test(entry.name))
    .map(entry => `${entry.parentPath}/${entry.name}`.replace(fileURLToPath(root), '')));
  inputPaths.push(...wave16RuntimeInputs, ...evidenceFiles('docs/combat-fidelity-wave16-2026-10-28', true),
    'src/game/enemies.js', 'src/game/rpgTargetingPresentation.js', 'src/components/RpgTargetingPanel.jsx',
    'public/sprites/generated/bosses/oddworld/slig.png',
    'docs/combat-fidelity-wave16-2026-10-28/CLOSURE.md', 'docs/tactics-universes-2026-10-28/README.md');
  for (const file of wave16RuntimeInputs.filter(file => file.startsWith('src/game/') && file.endsWith('.generated.json'))) {
    const record = json(file), entries = (record.entries || []).filter(entry => typeof entry.sheet === 'string');
    if (!entries.length || assetRegistries.some(item => item.file === file)) continue;
    assetRegistries.push({ file, entries });
    for (const entry of entries.filter(delivered)) assetFiles.set(entry.sheet, entry);
  }
  return extendCombatFidelityWave16(extendCombatFidelityWave15({
    assetInventory: { registryFiles: assetRegistries.length, deliveredUniquePngFiles: assetFiles.size,
      registries: assetRegistries.map(record => record.file), sheets: [...assetFiles.keys()].sort(),
      method: 'Declared asset registries with real PNG/hash/dimension/alpha checks; shared sheets counted once. This does not certify source-frame fidelity.', source1to1Verified: false },
    schemaVersion: 1, date: '2026-10-25',
    evidenceRules: baseline.evidenceRules,
    baselineSha256: createHash('sha256').update(read('docs/combat-fidelity-2026-10-18/baseline.json')).digest('hex'),
    wave2Baseline: { path: wave2BaselinePath, sha256: existsSync(new URL(wave2BaselinePath, root)) ? createHash('sha256').update(read(wave2BaselinePath)).digest('hex') : null },
    wave3Baseline: { path: wave3BaselinePath, sha256: createHash('sha256').update(read(wave3BaselinePath)).digest('hex') },
    wave4Baseline: { path: wave4BaselinePath, sha256: createHash('sha256').update(read(wave4BaselinePath)).digest('hex') },
    wave5Baseline: { path: wave5BaselinePath, sha256: createHash('sha256').update(read(wave5BaselinePath)).digest('hex') },
    wave6Baseline: { path: wave6BaselinePath, sha256: createHash('sha256').update(read(wave6BaselinePath)).digest('hex') },
    wave7Baseline: { path: wave7BaselinePath, sha256: createHash('sha256').update(read(wave7BaselinePath)).digest('hex') },
    wave8Baseline: { path: wave8BaselinePath, sha256: createHash('sha256').update(read(wave8BaselinePath)).digest('hex') },
    wave9Baseline: { path: wave9BaselinePath, sha256: createHash('sha256').update(read(wave9BaselinePath)).digest('hex') },
    wave10Baseline: { path: wave10BaselinePath, sha256: createHash('sha256').update(read(wave10BaselinePath)).digest('hex') },
    wave11Baseline: { path: wave11BaselinePath, sha256: createHash('sha256').update(read(wave11BaselinePath)).digest('hex') },
    wave12Baseline: { path: wave12BaselinePath, sha256: createHash('sha256').update(read(wave12BaselinePath)).digest('hex') },
    wave13Baseline: { path: wave13BaselinePath, sha256: createHash('sha256').update(read(wave13BaselinePath)).digest('hex') },
    wave14Baseline: { path: wave14BaselinePath, sha256: createHash('sha256').update(read(wave14BaselinePath)).digest('hex') },
    historicalAssetPreservation: { previousWave: 13, previousAuditSha256: previousCurrentSha256,
      previousValidation: previousValidationPath, previousValidationSha256: createHash('sha256').update(read(previousValidationPath)).digest('hex'),
      pngFiles: previousValidation.distAssets.length, registryFiles: wave14Baseline.assetInventory.registries.length,
      changedPngFiles: historicalPngChanges, changedRegistryFiles: historicalRegistryChanges, preserved: true },
    batch: { wave: 14, requestedCharacters: 40, actualCharacterIds: wave14CharacterIds,
      plan: wave14PlanPath, parts: wave14Plan.parts,
      newlyAuthoredAbilityIds: Object.keys(ABILITIES_WAVE14), revisedAbilityIds: Object.keys(ABILITY_REVISIONS_WAVE14),
      deliveredNativeCharacterIds: wave14PresentationDelivery.filter(entry => entry.nativeAnimationDelivered).map(entry => entry.id),
      remainingNativeCharacterIds: wave14PresentationDelivery.filter(entry => !entry.nativeAnimationDelivered).map(entry => entry.id),
      deliveredPartialCharacterIds: wave14PresentationDelivery.filter(entry => entry.partialNativeAnimationDelivered).map(entry => entry.id),
      deliveredBaseCharacterIds: wave14PresentationDelivery.filter(entry => entry.baseCorrectionDelivered).map(entry => entry.id),
      remainingBaseCharacterIds: wave14PresentationDelivery.filter(entry => !entry.baseCorrectionDelivered).map(entry => entry.id),
      native45CharacterIds: detailedManifests.filter(entry => entry.complete && wave14CharacterIds.includes(entry.id)).map(entry => entry.id),
      newProductionPngFiles: [...assetFiles.keys()].filter(sheet => !wave14Baseline.assetInventory.sheets.includes(sheet)).sort(),
      source1to1Verified: false },
    scope: { heroes: HEROES_DB.length, universes: universes.length, abilitySlots: HEROES_DB.length * slots.length, meleeStates: MELEE_STATES.length },
    abilities: { wave14RoleCorrections: {
      heroes: Object.keys(ABILITIES_WAVE14).length, newlyAuthoredHeroes: Object.keys(ABILITIES_WAVE14).length,
      revisedHeroes: Object.keys(ABILITY_REVISIONS_WAVE14).length, reviewedHeroes: wave14CharacterIds.length,
      basicSlots: Object.values(ABILITIES_WAVE14).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0),
      revisedBasicSlots: Object.values(ABILITY_REVISIONS_WAVE14).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0),
      superSlots: Object.values(ABILITIES_WAVE14).filter(entry => entry.special).length,
      revisedSuperSlots: Object.values(ABILITY_REVISIONS_WAVE14).filter(entry => entry.special).length,
      versionRevisions: Object.keys(ABILITY_REVISIONS_WAVE14), source1to1Verified: false },
      wave13RoleCorrections: { heroes: Object.keys(ABILITIES_WAVE13).length,
      newlyAuthoredHeroes: Object.keys(ABILITIES_WAVE13).length, revisedHeroes: Object.keys(ABILITY_REVISIONS_WAVE13).length,
      reviewedHeroes: Object.keys(ABILITIES_WAVE13).length + Object.keys(ABILITY_REVISIONS_WAVE13).length,
      basicSlots: Object.values(ABILITIES_WAVE13).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0),
      revisedBasicSlots: Object.values(ABILITY_REVISIONS_WAVE13).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0),
      superSlots: Object.values(ABILITIES_WAVE13).filter(entry => entry.special).length, versionRevisions: Object.keys(ABILITY_REVISIONS_WAVE13), source1to1Verified: false },
      wave12RoleCorrections: { heroes: Object.keys(ABILITIES_WAVE12).length, basicSlots: Object.values(ABILITIES_WAVE12).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0), superSlots: Object.values(ABILITIES_WAVE12).filter(entry => entry.special).length, versionRevisions: Object.keys(ABILITY_REVISIONS_WAVE12), source1to1Verified: false },
      wave11RoleCorrections: { heroes: Object.keys(ABILITIES_WAVE11).length, basicSlots: Object.values(ABILITIES_WAVE11).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0), superSlots: Object.values(ABILITIES_WAVE11).filter(entry => entry.special).length, versionRevisions: Object.keys(ABILITY_REVISIONS_WAVE11), source1to1Verified: false },
      wave10RoleCorrections: { heroes: Object.keys(ABILITIES_WAVE10).length, basicSlots: Object.values(ABILITIES_WAVE10).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0), superSlots: Object.values(ABILITIES_WAVE10).filter(entry => entry.special).length, versionRevisions: Object.keys(ABILITY_REVISIONS_WAVE10), source1to1Verified: false },
      wave9RoleCorrections: { heroes: Object.keys(ABILITIES_WAVE9).length, basicSlots: Object.values(ABILITIES_WAVE9).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0), superSlots: Object.values(ABILITIES_WAVE9).filter(entry => entry.special).length, versionRevisions: Object.keys(ABILITY_REVISIONS_WAVE9), source1to1Verified: false },
      wave8RoleCorrections: { heroes: Object.keys(ABILITIES_WAVE8).length, basicSlots: Object.values(ABILITIES_WAVE8).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0), superSlots: Object.values(ABILITIES_WAVE8).filter(entry => entry.special).length, versionRevisions: Object.keys(ABILITY_REVISIONS_WAVE8), source1to1Verified: false },
      baselineHeuristicCandidateSlots: baseline.genericAbilitySlots.total, rawHeuristicCandidateSlots: rawGeneric.length,
      heuristicNote: 'The original broad Guard suffix includes 118 concrete defense names requiring review, not 118 confirmed generic actions.',
      strictDefinition: 'simple/secondary: original placeholder expressions; defense: Signature Guard|defensive action or exact hero.name + " Guard".',
      rawStrictGenericSlots: rawStrict.length, rawStrictCounts: count(rawStrict.map(entry => entry.slot)),
      rawConcreteDefenseCandidatesForReview: rawGeneric.filter(entry => !isStrictGeneric(roster.get(entry.id), entry.slot, entry.name)),
      rawCandidateCounts: count(rawGeneric.map(entry => entry.slot)), authoredHeroes: Object.keys(COMBAT_ABILITY_OVERRIDES).length,
      completeThreeSlotKits: Object.values(COMBAT_ABILITY_OVERRIDES).filter(entry => slots.every(slot => entry[slot])).length,
      partialSlotKits: Object.values(COMBAT_ABILITY_OVERRIDES).filter(entry => slots.some(slot => entry[slot]) && !slots.every(slot => entry[slot])).length,
      wave6RoleCorrections: { heroes: 3, basicSlots: 9, superSlots: 3, entries: Object.entries(ABILITIES_WAVE6).map(([id, entry]) => ({ id, universe: entry.universe, sourceWork: entry.sourceWork, sourceReference: entry.sourceReference, special: { name: entry.special.name, effect: entry.special.targeting.effect, delivery: entry.special.targeting.delivery }, source1to1Verified: false })) },
      wave7RoleCorrections: {
        heroes: Object.keys(ABILITIES_WAVE7).length,
        basicSlots: Object.values(ABILITIES_WAVE7).reduce((n, entry) => n + slots.filter(slot => entry[slot]).length, 0),
        superSlots: Object.values(ABILITIES_WAVE7).filter(entry => entry.special).length,
        entries: Object.entries(ABILITIES_WAVE7).map(([id, entry]) => ({ id, universe: entry.universe, sourceWork: entry.sourceWork, sourceReference: entry.sourceReference,
          special: { name: entry.special.name, effect: entry.special.targeting.effect, delivery: entry.special.targeting.delivery }, source1to1Verified: false })),
        versionRevisions: Object.entries(ABILITY_REVISIONS_WAVE7).map(([id, entry]) => ({ id, ...entry, source1to1Verified: false }))
      },
      originalResidualCohort: { heroes: residualBaseline.length, slots: residualBaseline.reduce((sum, entry) => sum + entry.missingSlots.length, 0),
        baselineSha256: createHash('sha256').update(read('docs/combat-fidelity-2026-10-18/residual-ability-baseline.json')).digest('hex') },
      separateLoreCorrections: { heroes: loreCorrections.length, slots: loreCorrections.reduce((sum, entry) => sum + entry.slots.length, 0), entries: loreCorrections },
      authoredSlots: Object.values(COMBAT_ABILITY_OVERRIDES).reduce((sum, entry) => sum + slots.filter(slot => entry[slot]).length, 0),
      baselineCandidateSlotsReplaced: fixedBaseline.length, effectiveHeuristicCandidateSlots: effectiveGeneric.length,
      effectiveCandidateCounts: count(effectiveGeneric.map(entry => entry.slot)),
      effectiveStrictGenericSlots: effectiveStrict.length, effectiveStrictCounts: count(effectiveStrict.map(entry => entry.slot)),
      effectiveConcreteDefenseCandidatesForReview: effectiveGeneric.filter(entry => !isStrictGeneric(roster.get(entry.id), entry.slot, entry.name)),
      unresolvedSlots: unresolved.length, remainingHeuristicCandidates: effectiveGeneric, remainingStrictGeneric: effectiveStrict,
      unresolved, verifiedSourceAbilities: 0, source1to1UnverifiedSlots: HEROES_DB.length * slots.length },
    meleeBindings: { total: bindings.length, counts: count(bindings.map(binding => binding.binding)),
      adaptedPoseSourceStates: count(bindings.filter(binding => binding.binding === 'adapted-existing-pose').map(binding => binding.sourceState)),
      adaptedPoseBindingsAtIdle: bindings.filter(binding => binding.binding === 'adapted-existing-pose' && binding.sourceState === 'idle').length,
      dedicatedManifestHeroes, nativePresentationHeroIds: nativeIds, nativePresentationHeroes: nativeIds.length,
      detailedManifestCoverage: detailedManifests,
      fullDetailedMeleeManifestHeroes: detailedManifests.filter(entry => entry.complete).map(entry => entry.id),
      heroesWithoutFullDetailedMeleeManifest: HEROES_DB.length - detailedManifests.filter(entry => entry.complete).length,
      nativePresentationDeclaredHeroes: nativeDeclared.length,
      nativePartialPresentationHeroes: partialNativeEntries.length,
      nativePartialPresentationPoses: partialNativeEntries.reduce((n, entry) => n + entry.frames, 0),
      nativePartialPresentationEntries: partialNativeEntries.map(entry => ({ heroId: entry.heroId, universe: entry.universe, sheet: entry.sheet, sha256: entry.sha256, frames: entry.frames, phases: Object.keys(entry.phases), source1to1Verified: false })),
      nativePresentationPendingFiles: nativeDeclared.filter(entry => !delivered(entry)).map(entry => ({ id: entry.heroId, sheet: entry.sheet, integrity: inspectPng(entry) })),
      nativePresentationPhases: nativeEntries.reduce((sum, entry) => sum + Object.keys(entry.phases || {}).length, 0),
      nativePresentationPoses: nativeEntries.reduce((sum, entry) => sum + (entry.frames || 0), 0),
      nativeStatureCorrections: nativeEntries.flatMap(entry => (entry.normalization?.rows || []).flatMap((row, index) => row.statureReview
        ? [{ heroId: entry.heroId, phase: Object.keys(entry.phases).find(phase => entry.phases[phase].row === index), row: index,
          renderScale: row.renderScale, statureReview: row.statureReview }] : [])),
      nativePresentationEntries: nativeEntries.map(({ heroId, universe, sheet, sha256, phases, sourceImage, sourceImageSha256, sourceReference, visualValidation }) => ({
        heroId, universe, sheet, sha256, phases, sourceImage, sourceImageSha256, sourceReference,
        source1to1Verified: visualValidation?.canon1to1Verified === true
      })),
      heroesWithoutDedicatedPresentationAtlas: HEROES_DB.length - nativeIds.filter(id => roster.has(id)).length,
      sourceAnimationSequencesVerified: 0, source1to1UnverifiedHeroes: HEROES_DB.length,
      nativeAtlasStatus: { missing: HEROES_DB.length - nativeIds.filter(id => roster.has(id)).length, adapted: nativeIds.length, source1to1Verified: 0 } },
    characterPixelBaseline: { path: pixelAuditPath, sha256: createHash('sha256').update(read(pixelAuditPath)).digest('hex'), summary: json(pixelAuditPath).summary },
    baseSpriteCorrections: { heroes: baseCorrections.length, declaredHeroes: baseCorrectionDeclared.length,
      pendingFiles: baseCorrectionDeclared.filter(entry => !delivered(entry)).map(entry => entry.heroId),
      poses: baseCorrections.reduce((sum, entry) => sum + entry.frames, 0),
      entries: baseCorrections.map(({ heroId, universe, sheet, sha256, sourceWork, sourceReference, sourceImage, sourceImageSha256 }) => ({
        heroId, universe, sheet, sha256, sourceWork, sourceReference, sourceImage, sourceImageSha256, source1to1Verified: false
      })), countedAsDedicatedPresentationAtlases: false },
    characterForms: { delivered: forms.length, declared: formDeclared.length,
      poses: forms.reduce((sum, entry) => sum + entry.frames, 0),
      pendingFiles: formDeclared.filter(entry => !delivered(entry)).map(entry => entry.id),
      entries: forms.map(({ id, heroId, universe, sheet, sha256, frames, sourceImage, sourceImageSha256 }) => ({ id, heroId, universe, sheet, sha256, frames, sourceImage, sourceImageSha256, source1to1Verified: false })),
      authority: 'Existing source-specific combat buff clocks; final-scene projection has no gameplay effect.',
      sourceRulesLimit: 'Vincent retains player control and existing attacks. FFVII Berserk, Chaos Saber and Satan Slam mechanics are not reproduced.',
      countedAsFullMeleeManifest: false, countedAsDedicatedPresentationHero: false },
    presentations: { wave14Delivery: { recipes: wave14PresentationDelivery.length,
      newRecipes: wave14PresentationDelivery.filter(entry => !wave14Baseline.presentations.entries.some(previous => previous.id === entry.id)).length,
      revisedRecipes: wave14PresentationDelivery.filter(entry => wave14Baseline.presentations.entries.some(previous => previous.id === entry.id)).length,
      registeredRecipes: wave14PresentationDelivery.filter(entry => entry.recipeRegistered).length,
      acceptedNativeSuperHelpers: wave14PresentationDelivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length,
      native32Delivered: wave14PresentationDelivery.filter(entry => entry.nativeAnimationDelivered).length,
      base16Delivered: wave14PresentationDelivery.filter(entry => entry.baseCorrectionDelivered).length,
      baseRuntimeBindingsConfirmed: wave14PresentationDelivery.filter(entry => entry.baseRuntimeBindingConfirmed).length,
      entries: wave14PresentationDelivery },
      wave13Delivery: { recipes: wave13PresentationDelivery.length,
      newRecipes: wave13PresentationDelivery.filter(entry => !wave13Baseline.presentations.entries.some(previous => previous.id === entry.id)).length,
      revisedRecipes: wave13PresentationDelivery.filter(entry => wave13Baseline.presentations.entries.some(previous => previous.id === entry.id)).length,
      registeredRecipes: wave13PresentationDelivery.filter(entry => entry.recipeRegistered).length, acceptedNativeSuperHelpers: wave13PresentationDelivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length, entries: wave13PresentationDelivery },
      wave12Delivery: { recipes: wave12PresentationDelivery.length, registeredRecipes: wave12PresentationDelivery.filter(entry => entry.recipeRegistered).length, acceptedNativeSuperHelpers: wave12PresentationDelivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length, entries: wave12PresentationDelivery },
      wave11Delivery: { recipes: wave11PresentationDelivery.length, registeredRecipes: wave11PresentationDelivery.filter(entry => entry.recipeRegistered).length, acceptedNativeSuperHelpers: wave11PresentationDelivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length, entries: wave11PresentationDelivery },
      wave10Delivery: { recipes: wave10PresentationDelivery.length, registeredRecipes: wave10PresentationDelivery.filter(entry => entry.recipeRegistered).length, acceptedNativeSuperHelpers: wave10PresentationDelivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length, entries: wave10PresentationDelivery },
      wave9Delivery: { recipes: wave9PresentationDelivery.length, registeredRecipes: wave9PresentationDelivery.filter(entry => entry.recipeRegistered).length, acceptedNativeSuperHelpers: wave9PresentationDelivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length, entries: wave9PresentationDelivery },
      wave8Delivery: { recipes: wave8PresentationDelivery.length, registeredRecipes: wave8PresentationDelivery.filter(entry => entry.recipeRegistered).length, acceptedNativeSuperHelpers: wave8PresentationDelivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length, entries: wave8PresentationDelivery },
      scriptedRecipes: presentations.length, nonRosterRecipeHeroes: presentations.filter(entry => !roster.has(entry.id)).map(entry => entry.id),
      wave7Delivery: { recipes: wave7PresentationDelivery.length, registeredRecipes: wave7PresentationDelivery.filter(entry => entry.recipeRegistered).length, acceptedNativeSuperHelpers: wave7PresentationDelivery.filter(entry => entry.nativeSuperHelperAcceptsResolvedAction).length, entries: wave7PresentationDelivery },
      scriptedHeroes: presentations.filter(entry => roster.has(entry.id)).length,
      scriptedPairs: presentations.filter(entry => roster.has(entry.id)).length * PRESENTATION_PHASES.length,
      sharedTemplatePairs: (HEROES_DB.length - presentations.filter(entry => roster.has(entry.id)).length) * PRESENTATION_PHASES.length,
      entries: presentations, sourceSequencesVerified: 0, source1to1UnverifiedRosterPairs: HEROES_DB.length * PRESENTATION_PHASES.length },
    entities: { sheets: entities.length, callerProfiles: entities.reduce((sum, entry) => sum + entry.callers.length, 0),
      callerProfilesMeaning: 'Historical declared entity bindings. Active legacy calls and explicit roster replacements are counted separately by wave below.',
      activeLegacyEntityCallerProfiles: liveSummonDescriptors.filter(({ descriptor }) => descriptor?.entityRender?.kind === 'sprite-sheet').length,
      wave11RosterBindings, wave11Native16CallerProfiles: wave11RosterBindings.filter(entry => entry.native16AssetId).length,
      wave11AlternateRosterCallerProfiles: wave11RosterBindings.filter(entry => !entry.native16AssetId).length,
      wave12RosterBindings, wave12Native16CallerProfiles: wave12RosterBindings.filter(entry => entry.native16AssetId).length,
      wave12AlternateRosterCallerProfiles: wave12RosterBindings.filter(entry => !entry.native16AssetId).length,
      wave13RosterBindings, wave13Native16CallerProfiles: wave13RosterBindings.filter(entry => entry.native16AssetId).length,
      wave13AlternateRosterCallerProfiles: wave13RosterBindings.filter(entry => !entry.native16AssetId).length,
      wave14RosterBindings, wave14Native16CallerProfiles: wave14RosterBindings.filter(entry => entry.native16AssetId).length,
      wave14AlternateRosterCallerProfiles: wave14RosterBindings.filter(entry => !entry.native16AssetId).length,
      wave14Native16Atlases: wave14SummonAnimations.length,
      wave14Native16Poses: wave14SummonAnimations.reduce((sum, entry) => sum + entry.frames, 0),
      wave14Native16DeliveredCallerProfiles: wave14RosterBindings.filter(binding => wave14SummonAnimations.some(entry => entry.id === binding.native16AssetId)).length,
      wave10RosterBindings, wave10Native16CallerProfiles: wave10RosterBindings.filter(entry => entry.native16AssetId).length,
      wave10AlternateRosterCallerProfiles: wave10RosterBindings.filter(entry => !entry.native16AssetId).length,
      nativeAnimationAtlases: summonAnimations.length,
      nativeRosterPerformerAtlases: summonAnimations.filter(entry => entry.bodySource === 'roster-performer').length,
      nativeEntityOrEquipmentAtlases: summonAnimations.filter(entry => entry.bodySource !== 'roster-performer').length,
      rosterPartnerChoreographies: Object.values(SUMMON_CHOREOGRAPHIES).filter(entry => entry.fidelity === 'authored-native-roster-motion-adaptation').length, nativeAnimationDeclared: summonAnimationDeclared.length,
      nativeAnimationPoses: summonAnimations.reduce((sum, entry) => sum + entry.frames, 0),
      nativeAnimationEntries: summonAnimations.map(({ id, key, universe, entityName, actionName, kind, bodySource, performerHeroId, sheet, sha256, frames }) => ({ id, key, universe, entityName, actionName, kind, bodySource, performerHeroId, sheet, sha256, frames, source1to1Verified: false })),
      legacyEntityAtlasesPreserved: true,
      scriptedEntities: choreography.filter(entry => !entry.missing).length,
      distinctPathLabels: new Set(choreography.map(entry => entry.path).filter(Boolean)).size,
      distinctSampledTrajectories: new Set(choreography.filter(entry => !entry.missing).map(entry => JSON.stringify(entry.sampledGeometry))).size,
      entries: choreography, sourceSequencesVerified: 0, source1to1UnverifiedEntitySequences: entities.length },
    stages: { modeDefaultCoverage: Object.fromEntries(stageModes.map(mode => [mode, stageModeCoverage.filter(entry => entry.mechanisms[mode]).length])),
      rosterUniversesWithMechanismInEveryMode: stageModeCoverage.filter(entry => Object.values(entry.mechanisms).every(Boolean)).length,
      configuredUniverses: stageDefaults.filter(entry => entry.enabled).length,
      sceneMechanismDefinitions: STAGE_ANIMATION_PROFILES.length,
      rosterUniversesWithSceneMechanismDefinition: new Set(STAGE_ANIMATION_PROFILES.flatMap(entry => entry.universes).filter(universe => universes.includes(universe))).size,
      rosterUniversesWithoutSpecificSceneMechanism: universes.filter(universe => !STAGE_ANIMATION_PROFILES.some(entry => entry.universes.includes(universe))).length,
      localFourFrameAtlasMechanisms: STAGE_ANIMATION_PROFILES.filter(entry => entry.atlas).length,
      staticBackdropCompositingMechanisms: STAGE_ANIMATION_PROFILES.filter(entry => Object.keys(entry.localBackdrops).length).length,
      sharedEffectFamilies: new Set(stageDefaults.map(entry => entry.effect)).size,
      entries: stageDefaults, sourceScenesVerified: 0, source1to1UnverifiedRosterUniverses: universes.length },
    tacticsTerrain: { selectableVerticalBattlefields: tacticsTerrains.length,
      universeBattlefields: Object.keys(allUniverseBattlefields).length,
      universeSourceCoverage: [...new Set(Object.values(allUniverseBattlefields).map(field => field.source.universe))],
      modeExclusiveUniverseBattlefields: tacticsTerrains.filter(field => field.modeExclusive === 'Tactics').length,
      uniqueTopologyCount: new Set(tacticsTerrains.map(field => field.geometrySha256)).size,
      universeBattlefieldsWithReachableObjectives: tacticsTerrains.filter(field => field.modeExclusive === 'Tactics' && field.allHeroObjectiveRoutesReachable).length,
      battlefields: tacticsTerrains,
      runtime: 'src/game/tacticsVerticalRuntime.js', geometry: 'src/game/tacticsTerrain.js', renderer: 'src/game/tacticsTerrainRenderer.js',
      environmentRenderer: 'src/game/tacticsEnvironmentRenderer.js',
      integrationTests: ['scripts/tacticsVerticalIntegration.test.mjs', 'scripts/tacticsUniverseRuntime.test.mjs', 'scripts/tacticsUniverseRouting.test.mjs'],
      dedicatedEnvironmentTests: 'scripts/tacticsUniversePresentation.test.mjs',
      universeEvidenceDirectories: universeTacticsEvidenceDirectories,
      measurementScope: 'Logical surface definitions and Dijkstra routes are measured here. Real EngineTactics and GameCanvas proofs are retained separately; a module import does not certify an end-to-end flow.', source1to1Verified: false },
    inputHashes: Object.fromEntries([...new Set(inputPaths)].filter(file => existsSync(new URL(file, root)))
      .map(file => [file, createHash('sha256').update(read(file)).digest('hex')])),
    source1to1Verified: false
  }));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const report = measureCombatFidelity();
  const reportDirectory = 'docs/combat-fidelity-wave16-2026-10-28';
  const output = `${reportDirectory}/current.json`;
  const encoded = `${JSON.stringify(report, null, 2)}\n`;
  if (process.argv.includes('--write')) {
    writeFileSync(new URL(output, root), encoded);
    const ability = report.abilities;
    const animation = report.meleeBindings;
    const markdown = `# Mesures des combats — lot 16, 28 octobre 2026

Trois lots disjoints de quarante personnages sont traités en parallèle. Le plan initial et ses annexes antérieures aux générations correspondantes conservent 124 révisions documentées, dont 120 personnages effectifs pour les dessins. John Wick reste sans nouveaux dessins après un refus correctif ; Robin natif32/base16 est suspendu et non demandé après son refus RPG. Raven et Starfire restent sans natif32/base16 après deux refus réels. Tank, MEIKO, KAITO et l’Oracle sont quatre identités distinctes ajoutées aux lots, sans prétendu déblocage des refus. Le Starfire RPG16, généré avant le refus natif48 séparé, reste une livraison RPG et ne compte pas comme natif32/base16. Les versions, équipements et gestes retenus sont explicites ; la rédaction d’une capacité ou d’une recette ne constitue pas une livraison d’animation.

| Couverture cumulative mesurée | Résultat |
| --- | --- |
| Capacités rédigées | ${ability.authoredHeroes} personnages, ${ability.authoredSlots} actions, ${ability.completeThreeSlotKits} kits complets |
| Libellés strictement génériques | ${ability.effectiveStrictGenericSlots} |
| Présentations natives32 | ${animation.nativePresentationHeroes}, ${animation.nativePresentationPoses} poses |
| Présentations partielles hors complets | ${animation.nativePartialPresentationHeroes}, ${animation.nativePartialPresentationPoses} poses |
| Mêlée complète45 | ${animation.fullDetailedMeleeManifestHeroes.length} personnages |
| Bases natives16 | ${report.baseSpriteCorrections.heroes} personnages |
| Recettes | ${report.presentations.scriptedHeroes} personnages, ${report.presentations.scriptedPairs} paires personnage/phase |
| Renforts et invocations natifs16 | ${report.entities.nativeAnimationAtlases} atlas |
| Familier de protection autonome16 | ${report.entities.wave16PersistentProtection16Atlases} atlas, ${report.entities.wave16PersistentProtection16Poses} poses |
| Actions natives supplémentaires16 | ${report.actions.nativeAction16Atlases} atlas, ${report.actions.nativeActionPoses} poses |
| Mécanismes de décor | ${report.stages.sceneMechanismDefinitions} dans ${report.stages.rosterUniversesWithSceneMechanismDefinition}/${report.scope.universes} univers |
| PNG suivis | ${report.assetInventory.deliveredUniquePngFiles} dans ${report.assetInventory.registryFiles} registres |

Dans le lot : ${report.batch.deliveredNativeCharacterIds.length}/120 nouveaux atlas complets32 et ${report.batch.deliveredBaseCharacterIds.length}/120 bases16. Présentations restantes : ${report.batch.remainingNativeCharacterIds.join(', ') || 'aucune'}. Les ressources historiques, miroirs, refus et captures ne comptent pas comme nouveaux dessins.

Tactics comprend ${report.tacticsTerrain.universeBattlefields} secteurs adaptés aux univers, soit ${report.tacticsTerrain.selectableVerticalBattlefields} terrains verticaux avec les trois Nexus et ${report.tacticsTerrain.materials} matières. Les hauteurs, routes, couverts et objectifs reposent sur les surfaces jouables ; les environnements sont propres au mode. Les géométries adaptées ne sont pas des plans officiels certifiés. Les contrôles des définitions et chemins restent distincts des preuves réelles EngineTactics et GameCanvas.

Les ${report.historicalAssetPreservation.pngFiles} PNG et ${report.historicalAssetPreservation.registryFiles} registres W1–W15 restent identiques. Les actions et images générées sont des adaptations documentées, sans certification officielle 1:1. Le résultat du build et des parcours se trouve dans [validation.json](validation.json).
`;
    writeFileSync(new URL(`${reportDirectory}/current.md`, root), markdown);
  }
  if (process.argv.includes('--check') && read(output).toString() !== encoded) throw new Error('Combat fidelity audit is stale; regenerate after reviewing the measurements.');
  console.log(JSON.stringify({ output, scope: report.scope, abilities: { ...report.abilities, remainingHeuristicCandidates: undefined, remainingStrictGeneric: undefined,
    rawConcreteDefenseCandidatesForReview: report.abilities.rawConcreteDefenseCandidatesForReview.length,
    effectiveConcreteDefenseCandidatesForReview: report.abilities.effectiveConcreteDefenseCandidatesForReview.length, unresolved: undefined },
    meleeBindings: { ...report.meleeBindings, nativePresentationEntries: undefined }, characterPixelBaseline: report.characterPixelBaseline.summary,
    baseSpriteCorrections: { ...report.baseSpriteCorrections, entries: undefined },
    presentations: { ...report.presentations, entries: undefined }, entities: { ...report.entities, entries: undefined },
    stages: { ...report.stages, entries: undefined }, source1to1Verified: false }, null, 2));
}
