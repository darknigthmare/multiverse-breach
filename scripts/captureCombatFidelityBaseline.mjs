import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { HEROES_DB } from '../src/game/heroes.js';
import { MELEE_STATES } from '../src/game/melee/meleeStateMachine.js';
import { getMeleeAnimationManifest } from '../src/game/melee/meleeAnimationManifest.js';
import { getHeroMeleeAnimationFrame, getHeroSpriteSheetSrc, getSpriteFrameForLayout, getSpriteSheetLayout } from '../src/game/spriteAssets.js';
import { getStageAtmosphereProfile } from '../src/game/melee/stageAtmosphere.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = path.join(root, 'docs/combat-fidelity-2026-10-18/baseline.json');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const slotPatterns = {
  simple: /Signature Strike|signature action/i,
  secondary: /Breach Technique|signature technique/i,
  defense: /Signature Guard|defensive action|\bGuard$/i
};
const genericSlots = HEROES_DB.flatMap(hero => Object.entries(slotPatterns)
  .filter(([slot, pattern]) => pattern.test(hero[slot]?.name || ''))
  .map(([slot]) => ({ id: hero.id, universe: hero.universe, slot, originalAction: structuredClone(hero[slot]) })));

const routeGroups = new Map();
const heroBindings = [];
const bindingCounts = { dedicatedManifest: 0, explicitRow: 0, standardState: 0, idleFallback: 0 };
const standardStates = new Set(['idle', 'run', 'attack', 'hit', 'dead']);
for (const hero of HEROES_DB) {
  const sheets = [];
  const bindings = {};
  for (const state of MELEE_STATES) {
    const actor = { ...hero, state };
    const dedicated = getHeroMeleeAnimationFrame(actor, 0);
    const manifest = getMeleeAnimationManifest(hero.id);
    const sheet = dedicated?.animation?.sheet || getHeroSpriteSheetSrc(actor, 'melee');
    const layout = getSpriteSheetLayout(sheet);
    if (!sheets.includes(sheet)) sheets.push(sheet);
    const kind = manifest?.animations?.[state] ? 'dedicatedManifest'
      : layout.rowByState && Object.hasOwn(layout.rowByState, state) ? 'explicitRow'
        : standardStates.has(state) ? 'standardState' : 'idleFallback';
    bindingCounts[kind]++;
    const frame = dedicated || getSpriteFrameForLayout(state, 0, layout);
    bindings[state] = {
      kind,
      sheetIndex: sheets.indexOf(sheet),
      row: frame.row,
      startColumn: dedicated?.animation?.startColumn || 0,
      frameCount: dedicated?.animation?.frameCount || layout.columns,
      columns: layout.columns,
      rows: layout.rows
    };
  }
  const key = JSON.stringify(bindings);
  if (!routeGroups.has(key)) routeGroups.set(key, { id: `routes-${routeGroups.size + 1}`, bindings, heroes: [] });
  const group = routeGroups.get(key);
  group.heroes.push(hero.id);
  heroBindings.push({ id: hero.id, universe: hero.universe, routeGroupId: group.id, sheets,
    missingFiles: sheets.filter(sheet => !existsSync(path.join(root, 'public', sheet.replace(/^\//, '')))) });
}

const entityRegistry = JSON.parse(readFileSync(path.join(root, 'src/game/combat/entityAssets.generated.json'), 'utf8'));
const universes = [...new Set(HEROES_DB.map(hero => hero.universe))];
const stages = universes.map(universe => {
  const profile = getStageAtmosphereProfile({ universe });
  return { universe, id: profile.id, enabled: profile.enabled, effect: profile.effect, fidelity: profile.fidelity,
    selection: profile.selection, sourceAnchor: profile.sourceAnchor, sourceVisualValidation: profile.sourceVisualValidation };
});
const effectCounts = stages.reduce((counts, entry) => ({ ...counts, [entry.effect || 'missing']: (counts[entry.effect || 'missing'] || 0) + 1 }), {});
const sourceFiles = [
  'src/game/heroes.js', 'src/game/spriteAssets.js', 'src/game/renderer.js',
  'src/game/melee/meleeAnimationManifest.js', 'src/game/melee/meleeStateMachine.js',
  'src/game/combatIdentity.js', 'src/game/engineFighter.js', 'src/game/engineRpg.js',
  'src/game/combat/entityAssets.js', 'src/game/combat/entityAssets.generated.json',
  'src/game/melee/stageAtmosphere.js'
];
const baseline = {
  schemaVersion: 1,
  date: '2026-10-18',
  purpose: 'Independent snapshot before ability-slot, presentation, entity choreography and scene-mechanism work.',
  evidenceRules: {
    missing: 'An authored capability or dedicated animation/script is absent; a generic rendering fallback may still draw successfully.',
    adaptation: 'An authored runtime sequence, generated bitmap, reused pose, transformed static layer or procedural effect. Its existence does not prove source fidelity.',
    verified: 'Requires independently retained source reference, frame/scene comparison and explicit validation. No such certification is inferred from a name, profile, bitmap, or passing tests.',
    bitmapEvidence: 'Binding analysis below inspects routing metadata only. Exact repeated RGBA cells are measured separately by auditCombatCharacterAnimations.mjs.',
    sourceGameExactnessVerified: false
  },
  scope: { heroes: HEROES_DB.length, universes: universes.length, meleeStates: MELEE_STATES.length },
  genericAbilitySlots: {
    detectionPatterns: Object.fromEntries(Object.entries(slotPatterns).map(([slot, regex]) => [slot, regex.source])),
    counts: Object.fromEntries(Object.keys(slotPatterns).map(slot => [slot, genericSlots.filter(entry => entry.slot === slot).length])),
    total: genericSlots.length,
    entries: genericSlots
  },
  meleeAnimationBindings: {
    states: [...MELEE_STATES],
    totalBindings: HEROES_DB.length * MELEE_STATES.length,
    counts: bindingCounts,
    dedicatedManifestHeroIds: HEROES_DB.filter(hero => getMeleeAnimationManifest(hero.id)).map(hero => hero.id),
    externalAnchor: { id: 'player_anchor', inRoster: HEROES_DB.some(hero => hero.id === 'player_anchor'), declaredStates: Object.keys(getMeleeAnimationManifest('player_anchor')?.animations || {}).length },
    routeGroups: [...routeGroups.values()],
    heroes: heroBindings,
    missingFileHeroes: heroBindings.filter(hero => hero.missingFiles.length).map(hero => hero.id),
    pixelAudit: 'docs/combat-fidelity-2026-10-18/character-animation-pixel-audit.json',
    sourceFrameComparisonsVerified: 0
  },
  presentations: {
    phases: ['intro', 'outro', 'fatality', 'victory', 'defeat', 'roundVictory', 'roundDefeat'],
    heroPhasePairs: HEROES_DB.length * 7,
    scriptedCharacterPairs: 0,
    sharedTemplatePairs: HEROES_DB.length * 7,
    dedicatedFrameSelection: false,
    templatePoseState: { intro: 'run', outro: 'run', fatality: 'special', victory: 'idle', defeat: 'hit', roundVictory: 'idle', roundDefeat: 'hit' },
    evidence: 'engineFighter.drawCharacterPresentation chooses a state from the phase and shares entrance/exit offsets; combatIdentity.resolveCombatPresentation supplies no per-character keyframe script.',
    sourceSequencesVerified: 0
  },
  entityChoreography: {
    uniqueEntitySheets: entityRegistry.entries.length,
    bitmapCallerProfiles: entityRegistry.entries.reduce((sum, entry) => sum + entry.callers.length, 0),
    posesPerEntity: 4,
    dedicatedEntityScripts: 0,
    sharedTimelineFamilies: 1,
    evidence: 'engineRpg.drawSummonScene slides all entities laterally; getCombatEntityFrame supplies the same arrival/preparation/impact/return timeline. Four native poses are real, but a distinct choreographic script is absent.',
    entries: entityRegistry.entries.map(({ id, key, universe, entityName, actionName, callers, sheet, sha256 }) => ({ id, key, universe, entityName, actionName, callers, sheet, sha256 })),
    sourceSequencesVerified: 0
  },
  stagePresentation: {
    configuredUniverses: stages.filter(stage => stage.enabled).length,
    sharedEffectFamilies: Object.keys(effectCounts).length,
    effectCounts,
    entries: stages,
    rendering: 'Shared procedural overlay functions with scene-specific choice, placement and color. The supplied base artwork is static; this count does not claim source-game stage animation.',
    locationMechanismScriptsAtCapture: 0,
    nativeAnimationMediaInspection: 'Independent stage-agent asset inspection is reported separately; no multiframe or foreground-asset count is inferred here.',
    sourceScenesVerified: 0
  },
  inputHashes: Object.fromEntries(sourceFiles.map(file => [file, sha256(readFileSync(path.join(root, file)))]))
};
assert.equal(baseline.scope.heroes, 1911);
assert.equal(baseline.scope.meleeStates, 45);
assert.equal(baseline.genericAbilitySlots.total, 4252);
assert.equal(baseline.meleeAnimationBindings.totalBindings, 85995);
assert.equal(baseline.entityChoreography.uniqueEntitySheets, 28);
assert.equal(baseline.entityChoreography.bitmapCallerProfiles, 82);

if (process.argv.includes('--write-baseline')) {
  assert.equal(existsSync(output), false, 'The original fidelity baseline is immutable; do not overwrite it after implementation.');
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(baseline, null, 2)}\n`);
}
console.log(JSON.stringify({ output: path.relative(root, output), scope: baseline.scope, genericSlots: baseline.genericAbilitySlots.counts,
  genericTotal: baseline.genericAbilitySlots.total, bindingCounts, routeGroups: routeGroups.size,
  missingFiles: baseline.meleeAnimationBindings.missingFileHeroes.length, entitySheets: baseline.entityChoreography.uniqueEntitySheets,
  entityProfiles: baseline.entityChoreography.bitmapCallerProfiles, stageEffects: baseline.stagePresentation.sharedEffectFamilies,
  sourceGameExactnessVerified: false }, null, 2));
