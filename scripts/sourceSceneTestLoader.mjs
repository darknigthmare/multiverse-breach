// Read-only compatibility for the project's Vite JSON and extensionless imports.
import { readFile } from 'node:fs/promises';
export async function resolve(specifier, context, nextResolve) {
  try { return await nextResolve(specifier, context); }
  catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND' || !/^\.{1,2}\//.test(specifier) || /\.[a-z]+$/i.test(specifier)) throw error;
    return nextResolve(`${specifier}.js`, context);
  }
}
export async function load(url, context, nextLoad) {
  if (url.startsWith('file:') && new URL(url).pathname.endsWith('.json')) {
    const data = JSON.parse(await readFile(new URL(url), 'utf8'));
    return { format:'module', shortCircuit:true, source:`export default ${JSON.stringify(data)};` };
  }
  return nextLoad(url, context);
}
