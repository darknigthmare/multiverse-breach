/** Real Git9899 modules at their original repository URLs; no filesystem mocks. */
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = '/workspace/multiverse-breach/';
const snapshot = '/tmp/p0-p1-p2-final-b9e616b-source/';
const revision = '98991b161d0116dd9fa8d52d42f2337a243f2091';
export async function resolve(specifier, context, nextResolve) {
  try { return await nextResolve(specifier, context); }
  catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND' || !/^\.{1,2}\//.test(specifier) || /\.[a-z]+$/i.test(specifier)) throw error;
    return nextResolve(`${specifier}.js`, context);
  }
}
export async function load(url, context, nextLoad) {
  if (url.startsWith('file:')) {
    const filename = fileURLToPath(new URL(url));
    if (filename.startsWith(root) && !filename.includes('/node_modules/') && /\.(?:mjs|js|json)$/.test(filename)) {
      const relative = filename.slice(root.length);
      const prior = path.join(snapshot, relative);
      const source = existsSync(prior)
        ? await readFile(prior, 'utf8')
        : execFileSync('git', ['cat-file', 'blob', `${revision}:${relative}`], {
          cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024,
          env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }
        });
      return { format: 'module', shortCircuit: true,
        source: filename.endsWith('.json') ? `export default ${JSON.stringify(JSON.parse(source))};` : source };
    }
  }
  return nextLoad(url, context);
}
