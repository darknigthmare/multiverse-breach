import assert from 'node:assert/strict';
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { ABILITIES_WAVE12_PART_D as ABILITIES } from '../../src/game/combat/abilities/abilitiesWave12PartD.js';

const root = new URL('../../', import.meta.url), dir = new URL('./', import.meta.url);
const prefix = 'docs/combat-fidelity-wave12-2026-10-23/';
const read = path => fs.readFileSync(new URL(path, root));
const json = path => JSON.parse(read(path));
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
const run = async (argv, log) => {
  const startedAt = new Date().toISOString(), fd = fs.openSync(new URL(log, dir), 'w');
  const child = spawn(argv[0], argv.slice(1), { cwd: fileURLToPath(root), stdio: ['ignore', fd, fd] });
  let spawnError = null;
  child.once('error', error => { spawnError = error.message; });
  const result = await new Promise(resolve => child.once('close', (exitCode, signal) => resolve({ exitCode, signal })));
  fs.closeSync(fd);
  return { argv, startedAt, finishedAt: new Date().toISOString(), ...result, spawnError,
    receiptOrigin: 'node-child-process-close-event', log, logSha256: sha(read(prefix + log)) };
};

const checks = await Promise.all([
  run(['node', 'scripts/buildCombatCharacterAnimationsWave12PartD.mjs', '--check'], 'part-d-native-check.log'),
  run(['node', 'scripts/buildCombatCharacterSpriteCorrectionsWave12PartD.mjs', '--check'], 'part-d-base-check.log'),
  run(['node_modules/.bin/oxlint', 'src/game/combat/abilities/abilitiesWave12PartD.js',
    'src/game/combat/combatSourceDefinitionsWave12PartD.js', prefix + 'part-d-builder-lib.mjs',
    prefix + 'part-d-final-check.mjs', 'scripts/buildCombatCharacterAnimationsWave12PartD.mjs',
    'scripts/buildCombatCharacterSpriteCorrectionsWave12PartD.mjs'], 'part-d-lint.log')
]);
for (const check of checks) { assert.equal(check.exitCode, 0); assert.equal(check.signal, null); assert.equal(check.spawnError, null); }
const native = json('src/game/combat/characterAnimationsWave12PartD.generated.json').entries;
const bases = json('src/game/combat/characterSpriteCorrectionsWave12PartD.generated.json').entries;
assert.equal(native.length, 9); assert.equal(bases.length, 9);
const poses = [];
for (const entry of native) {
  const base = bases.find(value => value.heroId === entry.heroId);
  assert.ok(base);
  const hashes = [];
  for (const asset of [entry, base]) {
    const bytes = read('public' + asset.sheet); assert.equal(sha(bytes), asset.sha256);
    for (let row = 0; row < asset.rows; row++) for (let col = 0; col < 4; col++) {
      const pixels = await sharp(bytes).extract({ left: col * 256, top: row * 256, width: 256, height: 256 }).raw().toBuffer();
      hashes.push(sha(pixels));
    }
  }
  assert.equal(hashes.length, 48); assert.equal(new Set(hashes).size, 48, entry.heroId + ': repeated native/base drawing');
  poses.push({ heroId: entry.heroId, retainedNative32: 32, retainedBase16: 16, distinctRetainedCells: 48,
    nativeSheetSha256: entry.sha256, baseSheetSha256: base.sha256 });
}
assert.equal(native.some(entry => entry.heroId === 'morty'), false);
assert.equal(bases.some(entry => entry.heroId === 'morty'), false);
let checkedActions = 0;
for (const [id, kit] of Object.entries(ABILITIES)) {
  assert.equal(kit.sourceHeroId, id);
  for (const slot of ['simple', 'secondary', 'defense', 'special']) {
    const action = kit[slot]; assert.ok(action.name && action.targeting);
    if (action.targeting.effect !== 'damage') assert.equal(action.dmg, 0, id + '/' + slot);
    checkedActions++;
  }
}
assert.equal(checkedActions, 40);
const records = json(prefix + 'part-d-generation-records.json').records;
const observedSources = records.flatMap(record => [...(record.sources || []), ...(record.historySources || [])]);
const sourcePaths = new Set(observedSources.map(source => source.path));
const observedDrawings = observedSources.reduce((sum, source) => sum + source.nativeDrawingsObserved, 0);
assert.equal(sourcePaths.size, 14); assert.equal(observedDrawings, 546);
const before = json(prefix + 'historical-assets-before.json');
for (const entry of before.png) assert.equal(sha(read('public' + entry.sheet)), entry.sha256, entry.sheet);
for (const entry of before.registries) assert.equal(sha(read(entry.path)), entry.sha256, entry.path);
const result = { wave: 12, part: 'D', passed: true, nativeHeroes: 9, baseHeroes: 9,
  retainedNativePoses: 288, retainedBasePoses: 144, retainedPoses: 432, newPng: 18,
  generationRequestsAttempted: 16, acceptedSourceImages: sourcePaths.size,
  nativeDrawingsObserved: observedDrawings, unusedOrSupersededDrawings: observedDrawings - 432,
  checkedActions, blockedHeroIds: ['morty'], blockedNativeOrBaseDelivered: false,
  historicalPngPreserved: before.png.length, historicalRegistriesPreserved: before.registries.length,
  checks, poses, source1to1Verified: false,
  browserChecksRunByThisScript: false,
  readOnlyRpgSourceReview: ['leela-original.png', 'birdperson-original.png'].map(name => ({
    path: prefix + 'summon-sources/' + name, sha256: sha(read(prefix + 'summon-sources/' + name)),
    reviewed: true, notes: name.startsWith('leela') ? 'Single eye, purple ponytail, white top, black trousers, physical martial actions.'
      : 'Biological wings, white feather crest and collar, green trousers; zero-damage wing protection, no gun/cybernetics.' }))
};
fs.writeFileSync(new URL('part-d-final-check.json', dir), JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({ passed: true, nativeHeroes: 9, baseHeroes: 9, retainedPoses: 432,
  newPng: 18, nativeDrawingsObserved: observedDrawings, discarded: observedDrawings - 432,
  historicalPngPreserved: before.png.length, historicalRegistriesPreserved: before.registries.length }));
