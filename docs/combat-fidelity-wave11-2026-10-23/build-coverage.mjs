// Run after the final runtime registration and current.json audit are frozen.
// This writes only this wave's coverage.csv, never prior-wave reports.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { HEROES_DB } from '../../src/game/heroes.js';
import { getCharacterAnimationAssets, getCharacterAnimationFrame, resolveCharacterAnimationAsset } from '../../src/game/combat/characterAnimationCatalog.js';
import { getMeleeAnimationManifest } from '../../src/game/melee/meleeAnimationManifest.js';
import { MELEE_STATES } from '../../src/game/melee/meleeStateMachine.js';
import { getHeroMeleeAnimationFrame, getHeroSpriteSheetSrc } from '../../src/game/spriteAssets.js';
import { CHARACTER_PRESENTATIONS } from '../../src/game/combat/presentationCatalog.js';
import { getStageAnimationProfile } from '../../src/game/melee/stageAnimationCatalog.js';
import { getStageAtmosphereProfile } from '../../src/game/melee/stageAtmosphere.js';
const root = new URL('../../', import.meta.url);
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const parseCSV = text => {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (c === '\n' && !quoted) { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (c !== '\r' || quoted) cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  assert.equal(quoted, false); return rows;
};
const [oldHeader, ...old] = parseCSV(read('docs/combat-fidelity-wave10-2026-10-23/coverage.csv').toString());
assert.deepEqual(oldHeader.slice(0, 7), ['heroId', 'name', 'universe', 'nativePresentationAtlas', 'full45StateMeleeManifest', 'correctedBaseAtlas', 'source1to1Verified']);
const roster = new Map(HEROES_DB.map(hero => [hero.id, hero]));
assert.equal(roster.size, 1911); assert.equal(old.length, 1911);
assert.deepEqual(new Set(old.map(row => row[0])), new Set(roster.keys()));
const delivered = entry => {
  const bytes = read('public' + entry.sheet);
  assert.equal(sha(bytes), entry.sha256, entry.sheet);
  assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])));
  assert.equal(bytes.readUInt32BE(16), entry.width ?? entry.dimensions.width);
  assert.equal(bytes.readUInt32BE(20), entry.height ?? entry.dimensions.height);
  assert.ok([4, 6].includes(bytes[25])); return true;
};
const allNative = getCharacterAnimationAssets().filter(delivered);
const native = allNative.filter(entry => entry.frames === 32);
const partial = allNative.filter(entry => entry.frames !== 32);
const nativeMap = new Map(native.map(entry => [entry.heroId, entry]));
const files = fs.readdirSync(new URL('src/game/combat/', root));
const meleeMap = new Map(files.filter(file => /Melee(?:Motion|Combat)\.generated\.json$/.test(file)).flatMap(file => json('src/game/combat/' + file).entries).map(entry => [entry.sheet, entry]));
const correctionCandidates = files.filter(file => /^characterSpriteCorrections.*\.generated\.json$/.test(file)).flatMap(file => json('src/game/combat/' + file).entries);
const correctedMap = new Map(correctionCandidates.filter(entry => roster.has(entry.heroId) && getHeroSpriteSheetSrc(roster.get(entry.heroId), 'combat') === entry.sheet).filter(delivered).map(entry => [entry.heroId, entry]));
const full = new Set();
for (const hero of HEROES_DB) {
  const asset = nativeMap.get(hero.id);
  if (asset) {
    assert.equal(asset.universe, hero.universe); assert.equal(asset.frames, 32);
    assert.equal(resolveCharacterAnimationAsset(hero), asset);
    assert.notEqual(asset.visualValidation?.canon1to1Verified, true);
    for (const phase of ['intro', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'victory', 'defeat', 'super']) for (const progress of [0, 0.26, 0.51, 1]) {
      const frame = getCharacterAnimationFrame(hero, { phase, progress });
      assert.equal(frame.asset, asset); assert.equal(frame.frames, 4);
    }
  }
  const manifest = getMeleeAnimationManifest(hero.id);
  if (manifest) {
    assert.equal(manifest.universe, hero.universe); const rows = new Set();
    assert.notEqual(manifest.source1to1Verified, true);
    for (const state of MELEE_STATES) {
      const animation = manifest.animations[state], source = meleeMap.get(animation?.sheet);
      assert.ok(animation && source, `${hero.id}/${state}`);
      assert.equal(source.heroId, hero.id); assert.equal(source.universe, hero.universe); delivered(source);
      assert.equal(animation.frameCount, 4); assert.ok(animation.row >= 0 && animation.row < source.rows);
      assert.ok(animation.startColumn >= 0 && animation.startColumn + animation.frameCount <= source.columns);
      rows.add(animation.sheet + ':' + animation.row);
      const selected = getHeroMeleeAnimationFrame({ ...hero, state }, 0);
      assert.equal(selected.animation.sheet, animation.sheet); assert.equal(selected.animation.row, animation.row);
    }
    assert.equal(rows.size, 45); full.add(hero.id);
  }
  const corrected = correctedMap.get(hero.id);
  if (corrected) { assert.equal(corrected.frames, 16); assert.equal(corrected.universe, hero.universe); }
}
const modes = ['Combat', 'Melee', 'RPG', 'Tactics'];
const header = [...oldHeader.slice(0, 7), 'scriptedPresentation', 'stageBaseAtmosphere', 'stageMechanismAnyMode', 'stageMechanismAllFourModes', ...modes.map(mode => mode.toLowerCase() + 'StageMechanism'), 'nativeAtlasSheet', 'correctedBaseSheet', 'full45StateFrames', 'sourceFidelityStatus', 'partialNativePresentation', 'partialNativePoseCount'];
const rows = old.map(previous => {
  const hero = roster.get(previous[0]), asset = nativeMap.get(hero.id), correction = correctedMap.get(hero.id);
  const mechanisms = modes.map(mode => getStageAnimationProfile({ universe: hero.universe, mode })?.id || '');
  const row = [hero.id, hero.name, hero.universe, String(!!asset), String(full.has(hero.id)), String(!!correction), 'false',
    String(CHARACTER_PRESENTATIONS[hero.id]?.universe === hero.universe), String(!!getStageAtmosphereProfile({ universe: hero.universe }).enabled),
    String(mechanisms.some(Boolean)), String(mechanisms.every(Boolean)), ...mechanisms,
    asset?.sheet || '', correction?.sheet || '', String(full.has(hero.id) ? MELEE_STATES.length * 4 : 0), 'not-validated-1:1', String(partial.some(entry => entry.heroId === hero.id)), String(partial.find(entry => entry.heroId === hero.id)?.frames || 0)];
  for (const column of [3, 4, 5]) if (previous[column] === 'true') assert.equal(row[column], 'true', 'previous coverage regressed');
  return row;
});
// Refused native requests, refused bases and unattempted Luke/Vader bases must never become delivered flags.
for (const id of ['luke', 'vader', 'obi_wan', 'robin_tt', 'raven_tt', 'starfire_tt', 'harry_potter', 'hermione_granger', 'snape']) { assert.equal(nativeMap.has(id), false, id); assert.equal(correctedMap.has(id), false, id); }
assert.equal(correctedMap.has('leia_organa'), false, 'Leia base was refused; her accepted presentation atlas is a separate asset');
const current = json('docs/combat-fidelity-wave11-2026-10-23/current.json');
assert.equal(current.meleeBindings.nativePresentationHeroes, nativeMap.size);
assert.equal(current.baseSpriteCorrections.heroes, correctedMap.size);
assert.equal(current.meleeBindings.fullDetailedMeleeManifestHeroes.length, full.size);
assert.equal(current.presentations.scriptedHeroes, rows.filter(row => row[7] === 'true').length);
const quote = value => '"' + String(value).replaceAll('"', '""') + '"';
const output = new URL('coverage.csv', import.meta.url);
const csv = [header, ...rows].map(row => row.map(quote).join(',')).join('\n') + '\n';
assert.deepEqual(parseCSV(csv), [header, ...rows]);

const baseline = json('docs/combat-fidelity-wave11-2026-10-23/baseline.json');
const beforeNative = new Set(baseline.meleeBindings.nativePresentationHeroIds);
const newNative = native.filter(entry => !beforeNative.has(entry.heroId));
const beforeBases = new Set(baseline.baseSpriteCorrections.entries.map(entry => entry.heroId));
const newBases = [...correctedMap.values()].filter(entry => !beforeBases.has(entry.heroId));
const beforeFull = new Set(baseline.meleeBindings.fullDetailedMeleeManifestHeroes);
const newFull = current.meleeBindings.detailedManifestCoverage.filter(entry => entry.complete && !beforeFull.has(entry.id));
const beforeSummons = new Set(baseline.entities.nativeAnimationEntries.map(entry => entry.key));
const newSummons = current.entities.nativeAnimationEntries.filter(entry => !beforeSummons.has(entry.key));
const beforePartial = new Set(baseline.meleeBindings.nativePartialPresentationEntries.map(entry => entry.heroId));
const newPartial = partial.filter(entry => !beforePartial.has(entry.heroId));
const poses = newPartial.reduce((n, e) => n + e.frames, 0) + newNative.reduce((n, e) => n + e.frames, 0) + newBases.reduce((n, e) => n + e.frames, 0)
  + newFull.reduce((n, e) => n + e.boundFrames, 0) + newSummons.length * 16;
const newSheets = new Set([...newPartial.map(e => e.sheet), ...newNative.map(e => e.sheet), ...newBases.map(e => e.sheet), ...newFull.flatMap(e => e.sheets), ...newSummons.map(e => e.sheet)]);
let validationText = 'Les contrôles finaux du build et de distribution sont encore en cours. Aucun build complet réussi n’est déduit des tests ciblés.';
const validationPath = new URL('validation.json', import.meta.url);
if (fs.existsSync(validationPath)) {
 const v = JSON.parse(fs.readFileSync(validationPath));
 if (v.build?.exitCode === 0 && v.passed === true && v.testsFailed === 0) validationText = `Build complet réussi (code 0), ${v.testsPassed} tests dans ${v.testSuites} groupes, aucun échec. [Journal du build](build.log) · [Validation](validation.json) · [Preuves navigateur](browser-checks.json).`;
}
const {wave11Readme}=await import('./build-readme-fragment.mjs');
const batch=json('docs/combat-fidelity-wave11-2026-10-23/batch-plan-before.json');
const doc=wave11Readme({current,baseline,newNative,newPartial,newBases,newFull,newSummons,newSheets,poses,validationText,batch});
const deliveryCounts=json('docs/combat-fidelity-wave11-2026-10-23/deliverables.json');
assert.equal(deliveryCounts.newPoses,poses);assert.equal(deliveryCounts.newPngFiles,newSheets.size);assert.deepEqual(deliveryCounts.sheets,[...newSheets].sort());
// Validate the complete measured delivery before mutating either report.
fs.writeFileSync(output, csv);
fs.writeFileSync(new URL('README.md',import.meta.url),doc);
console.log(JSON.stringify({ output: output.pathname, characters: rows.length, nativeHeroes: nativeMap.size, nativePoses: native.reduce((n, e) => n + e.frames, 0),
  full45Heroes: [...full], correctedBaseHeroes: correctedMap.size, correctedBasePoses: [...correctedMap.values()].reduce((n, e) => n + e.frames, 0),
  scriptedRosterHeroes: rows.filter(row => row[7] === 'true').length, missingNative: rows.length - nativeMap.size, missingFull45: rows.length - full.size,
  source1to1Verified: rows.filter(row => row[6] === 'true').length, orderPreserved: true }, null, 2));
console.log(JSON.stringify({wave:11,newNativeHeroes:newNative.length,newBases:newBases.length,newFull:newFull.length,newPartners:newSummons.length,newPoses:poses,newPng:newSheets.size}));
