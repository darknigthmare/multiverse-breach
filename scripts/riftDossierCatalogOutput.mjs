import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import * as fs from 'node:fs';
import path from 'node:path';

// Alternate output is generation-only: --check always refers to the live catalog.
export const resolveCatalogOutputPath = (args, { defaultOutputPath, cwd = process.cwd() }) => {
  let requestedPath;
  let outputSpecified = false;
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument !== '--output' && !argument.startsWith('--output=')) continue;
    assert.equal(outputSpecified, false, '--output may be specified only once');
    outputSpecified = true;
    requestedPath = argument === '--output' ? args[++index] : argument.slice('--output='.length);
    assert.ok(
      typeof requestedPath === 'string'
        && requestedPath.trim().length > 0
        && !requestedPath.startsWith('-')
        && !requestedPath.includes('\0'),
      '--output requires a non-empty file path'
    );
  }
  assert.equal(outputSpecified && args.includes('--check'), false, '--check and --output cannot be combined');
  return outputSpecified ? path.resolve(cwd, requestedPath) : defaultOutputPath;
};

// Never open the destination for writing. Fully write, flush and close an
// exclusively owned sibling before one same-volume rename replaces it.
export const writeCatalogAtomically = (outputPath, contents, { io = fs } = {}) => {
  const destination = path.resolve(outputPath);
  const directory = path.dirname(destination);
  const temporaryPath = path.join(directory, `.${path.basename(destination)}.${randomUUID()}.tmp`);
  io.mkdirSync(directory, { recursive: true });
  let descriptor;
  let temporaryOwned = false;
  let failure;
  try {
    descriptor = io.openSync(temporaryPath, 'wx');
    temporaryOwned = true;
    io.writeFileSync(descriptor, contents, 'utf8');
    io.fsyncSync(descriptor);
    io.closeSync(descriptor);
    descriptor = undefined;
    io.renameSync(temporaryPath, destination);
    temporaryOwned = false;
  } catch (error) {
    failure = error;
  } finally {
    if (descriptor !== undefined) {
      try { io.closeSync(descriptor); } catch (error) { failure ||= error; }
    }
    // Only unlink the unique file this writer successfully opened with 'wx'.
    if (temporaryOwned) {
      try { io.unlinkSync(temporaryPath); } catch (error) {
        if (error.code !== 'ENOENT') failure ||= error;
      }
    }
  }
  if (failure) throw failure;
};
