import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { load as sourceLoad, resolve } from '../../../../scripts/sourceSceneTestLoader.mjs';

export { resolve };
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const files = ['src/game/combat/presentationCatalog.js', 'src/game/engineFighter.js', 'src/game/engineSmash.js'];
const sources = new Map(files.map(file => [path.join(root, file), execFileSync('git',
  ['show', `98991b161d0116dd9fa8d52d42f2337a243f2091:${file}`], { cwd: root, encoding: 'utf8' })]));
export async function load(url, context, nextLoad) {
  const old = url.startsWith('file:') ? sources.get(fileURLToPath(url)) : null;
  if (old) return { format: 'module', source: old, shortCircuit: true };
  return sourceLoad(url, context, nextLoad);
}
