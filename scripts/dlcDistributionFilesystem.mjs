import { closeSync, constants, lstatSync, openSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

export const slash = (value) => value.split(path.sep).join('/');
export function safeDistributionPath(value) {
  if (typeof value !== 'string' || !value || value.startsWith('/') || /[\\:]/.test(value)
    || Array.from(value).some((character) => character.codePointAt(0) < 32 || character.codePointAt(0) === 127)
    || value.split('/').some((part) => !part || part === '.' || part === '..')) {
    throw new Error('Unsafe distribution source path: ' + JSON.stringify(value));
  }
  return value;
}

export function assertDistributionDirectory(root) {
  const absolute = path.resolve(root);
  let current = path.parse(absolute).root;
  for (const part of absolute.slice(current.length).split(path.sep).filter(Boolean)) {
    current = path.join(current, part);
    const stat = lstatSync(current);
    if (stat.isSymbolicLink() || !stat.isDirectory()) {
      throw new Error('Distribution directory must not contain symlinks or non-directories: ' + current);
    }
  }
  return absolute;
}

export function inspectDistributionPath(root, relative, { directory = false, optional = false } = {}) {
  const parts = safeDistributionPath(relative).split('/');
  let current = root;
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    let stat;
    try { stat = lstatSync(current); } catch (error) {
      if (optional && error.code === 'ENOENT') return null;
      throw error;
    }
    if (stat.isSymbolicLink()) throw new Error('Distribution refuses a symlink: ' + relative);
    const needsDirectory = index < parts.length - 1 || directory;
    if (needsDirectory ? !stat.isDirectory() : !stat.isFile()) {
      throw new Error('Unexpected distribution file type: ' + relative);
    }
  }
  return current;
}

export function readDistributionFile(root, relative) {
  const source = inspectDistributionPath(root, relative);
  const descriptor = openSync(source, constants.O_RDONLY | constants.O_NOFOLLOW);
  try { return readFileSync(descriptor); } finally { closeSync(descriptor); }
}

/** Ignore predicates apply to names without following links. All delivered entries must be regular files. */
export function listDistributionFiles({ root, relative = '', ignore = () => false } = {}) {
  const absolute = relative ? inspectDistributionPath(root, relative, { directory: true, optional: true }) : root;
  if (!absolute) return [];
  const files = [];
  for (const entry of readdirSync(absolute, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const file = relative ? relative + '/' + entry.name : entry.name;
    if (ignore(file, entry)) continue;
    if (entry.isSymbolicLink()) throw new Error('Distribution refuses a symlink: ' + file);
    if (entry.isDirectory()) files.push(...listDistributionFiles({ root, relative: file, ignore }));
    else if (entry.isFile()) files.push(file);
    else throw new Error('Unexpected distribution file type: ' + file);
  }
  return files;
}
