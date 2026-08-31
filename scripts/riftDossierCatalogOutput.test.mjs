import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, test } from 'node:test';
import { resolveCatalogOutputPath, writeCatalogAtomically } from './riftDossierCatalogOutput.mjs';

const temporaryRoot = path.resolve(os.tmpdir());
const fixturePrefix = 'mb-rift-catalog-output-';
const fixtures = [];
const makeFixture = () => {
  const directory = fs.mkdtempSync(path.join(temporaryRoot, fixturePrefix));
  fixtures.push(directory);
  return directory;
};
afterEach(() => {
  for (const directory of fixtures.splice(0)) {
    const resolved = path.resolve(directory);
    assert.equal(path.dirname(resolved), temporaryRoot);
    assert.ok(path.basename(resolved).startsWith(fixturePrefix));
    fs.rmSync(resolved, { recursive: true, force: true });
  }
});

const options = {
  defaultOutputPath: path.resolve('docs/rift-dossiers/catalog.json'),
  cwd: path.resolve('alternate-output-cwd')
};
const errorWithCode = code => Object.assign(new Error(`injected ${code}`), { code });

test('catalog output retains the existing default with and without existing flags', () => {
  for (const args of [[], ['--check'], ['--refresh-character-reference-audit']]) {
    assert.equal(resolveCatalogOutputPath(args, options), options.defaultOutputPath);
  }
});

test('catalog output accepts relative paths, spaces and absolute destinations', () => {
  const relative = path.join('staging directory', 'catalog.json');
  assert.equal(resolveCatalogOutputPath(['--output', relative], options), path.resolve(options.cwd, relative));
  const absolute = path.resolve('staging directory', 'catalog.json');
  assert.equal(resolveCatalogOutputPath(['--output', absolute], options), absolute);
  assert.equal(resolveCatalogOutputPath([`--output=${relative}`], options), path.resolve(options.cwd, relative));
});

test('catalog output rejects missing, blank, option-shaped and NUL paths', () => {
  for (const args of [
    ['--output'], ['--output', ''], ['--output', '   '],
    ['--output='], ['--output', '--refresh-character-reference-audit'],
    ['--output', 'invalid\0.json']
  ]) assert.throws(() => resolveCatalogOutputPath(args, options), /--output requires a non-empty file path/);
});

test('catalog output rejects duplicated output destinations', () => {
  for (const args of [
    ['--output', 'a.json', '--output', 'b.json'],
    ['--output=a.json', '--output=b.json'],
    ['--output=a.json', '--output', 'b.json']
  ]) assert.throws(() => resolveCatalogOutputPath(args, options), /only once/);
});

test('catalog output rejects --check with any alternate-output syntax or order', () => {
  for (const args of [
    ['--check', '--output', 'a.json'],
    ['--output', 'a.json', '--check'],
    ['--output=a.json', '--check']
  ]) assert.throws(() => resolveCatalogOutputPath(args, options), /--check and --output cannot be combined/);
});

test('atomic output creates parents and leaves only the final UTF-8 file', () => {
  const root = makeFixture();
  const destination = path.join(root, 'nested staging', 'catalog.json');
  const content = '{"name":"Épreuve — sauvetage"}\n';
  writeCatalogAtomically(destination, content);
  assert.equal(fs.readFileSync(destination, 'utf8'), content);
  assert.deepEqual(fs.readdirSync(path.dirname(destination)), ['catalog.json']);
});

test('atomic output replaces a prior file only through a sibling rename', () => {
  const root = makeFixture();
  const destination = path.join(root, 'catalog.json');
  fs.writeFileSync(destination, 'original catalog must stay until rename');
  let renamed = false;
  writeCatalogAtomically(destination, '{"new":true}\n', { io: {
    ...fs,
    renameSync(source, target) {
      assert.equal(path.dirname(source), root);
      assert.equal(target, destination);
      assert.notEqual(source, target);
      assert.equal(fs.readFileSync(destination, 'utf8'), 'original catalog must stay until rename');
      assert.equal(fs.readFileSync(source, 'utf8'), '{"new":true}\n');
      fs.renameSync(source, target);
      renamed = true;
    }
  } });
  assert.equal(renamed, true);
  assert.equal(fs.readFileSync(destination, 'utf8'), '{"new":true}\n');
  assert.deepEqual(fs.readdirSync(root), ['catalog.json']);
});

test('partial ENOSPC write preserves old catalog and removes partial sibling', () => {
  const root = makeFixture();
  const destination = path.join(root, 'catalog.json');
  fs.writeFileSync(destination, 'original');
  const failure = errorWithCode('ENOSPC');
  assert.throws(() => writeCatalogAtomically(destination, 'replacement', { io: {
    ...fs,
    writeFileSync(descriptor) {
      fs.writeFileSync(descriptor, 'partial bytes');
      throw failure;
    }
  } }), error => error === failure);
  assert.equal(fs.readFileSync(destination, 'utf8'), 'original');
  assert.deepEqual(fs.readdirSync(root), ['catalog.json']);
});

test('flush failure preserves old catalog and cleans pending sibling', () => {
  const root = makeFixture();
  const destination = path.join(root, 'catalog.json');
  fs.writeFileSync(destination, 'original');
  const failure = errorWithCode('ENOSPC');
  assert.throws(() => writeCatalogAtomically(destination, 'replacement', { io: {
    ...fs,
    fsyncSync() { throw failure; }
  } }), error => error === failure);
  assert.equal(fs.readFileSync(destination, 'utf8'), 'original');
  assert.deepEqual(fs.readdirSync(root), ['catalog.json']);
});

test('rename failure preserves old catalog and cleans fully written sibling', () => {
  const root = makeFixture();
  const destination = path.join(root, 'catalog.json');
  fs.writeFileSync(destination, 'original');
  const failure = errorWithCode('EACCES');
  assert.throws(() => writeCatalogAtomically(destination, 'replacement', { io: {
    ...fs,
    renameSync() { throw failure; }
  } }), error => error === failure);
  assert.equal(fs.readFileSync(destination, 'utf8'), 'original');
  assert.deepEqual(fs.readdirSync(root), ['catalog.json']);
});

test('exclusive-open failure never unlinks a file writer does not own', () => {
  const root = makeFixture();
  const destination = path.join(root, 'catalog.json');
  fs.writeFileSync(destination, 'original');
  let unlinkCalls = 0;
  const failure = errorWithCode('EACCES');
  assert.throws(() => writeCatalogAtomically(destination, 'replacement', { io: {
    ...fs,
    openSync() { throw failure; },
    unlinkSync() { unlinkCalls += 1; }
  } }), error => error === failure);
  assert.equal(unlinkCalls, 0);
  assert.equal(fs.readFileSync(destination, 'utf8'), 'original');
  assert.deepEqual(fs.readdirSync(root), ['catalog.json']);
});

test('failed first generation creates no empty catalog or leftover temporary file', () => {
  const root = makeFixture();
  const destination = path.join(root, 'catalog.json');
  assert.throws(() => writeCatalogAtomically(destination, 'replacement', { io: {
    ...fs,
    writeFileSync(descriptor) {
      fs.writeFileSync(descriptor, 'partial');
      throw errorWithCode('ENOSPC');
    }
  } }), { code: 'ENOSPC' });
  assert.equal(fs.existsSync(destination), false);
  assert.deepEqual(fs.readdirSync(root), []);
});
