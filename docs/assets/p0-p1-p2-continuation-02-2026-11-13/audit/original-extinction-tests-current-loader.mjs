/** Original Git9899 test bytes; all imported implementations remain current. */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = '/workspace/multiverse-breach/';
const revision = '98991b161d0116dd9fa8d52d42f2337a243f2091';
const tests = new Set(['scripts/extinctionFighterProfiles.test.mjs', 'scripts/extinctionSchematicView.test.mjs']);
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
    if (filename.startsWith(root) && tests.has(filename.slice(root.length))) {
      const source = execFileSync('git', ['cat-file', 'blob', `${revision}:${filename.slice(root.length)}`], {
        cwd: root, encoding: 'utf8', maxBuffer: 4 * 1024 * 1024,
        env: { ...process.env, GIT_NO_LAZY_FETCH: '1', GIT_OPTIONAL_LOCKS: '0' }
      });
      return { format: 'module', shortCircuit: true, source };
    }
    if (filename.endsWith('.json')) {
      const source = JSON.parse(await readFile(filename, 'utf8'));
      return { format: 'module', shortCircuit: true, source: `export default ${JSON.stringify(source)};` };
    }
  }
  return nextLoad(url, context);
}
