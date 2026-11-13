import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { readDlcDistributionManifests, resolveDlcSelection } from './dlcDistribution.mjs';
import { createDlcProfileTransformer } from './dlcProfileTransform.mjs';

/** Compile actual application imports; SSR alone does not reject missing exports. */
export async function checkDlcProfileBundle({ root = process.cwd(), profile } = {}) {
  root = path.resolve(root);
  const document = typeof profile === 'string'
    ? JSON.parse(fs.readFileSync(path.resolve(root, profile), 'utf8')) : profile;
  const selection = resolveDlcSelection({ manifests: readDlcDistributionManifests({ root }), profile: document });
  const installed = new Set(selection.packIds);
  const transformer = createDlcProfileTransformer({ root, manifests: selection.manifests, installedPackIds: installed });
  const selectedFolders = new Set(selection.selectedManifests.map(pack => pack.directory));
  const observed = new Set();
  const dlcModules = new Set();
  const normalizedProfile = { schemaVersion: 1, mode: selection.mode,
    packIds: selection.mode === 'selected' ? selection.packIds : [], sharedPolicy: selection.sharedPolicy };
  const result = await build({
    root, configFile: path.join(root, 'vite.config.js'), publicDir: false, logLevel: 'silent',
    plugins: [{
      name: 'verify-dlc-profile-application-bundle', enforce: 'pre',
      transform(source, id) {
        const filename = id.split('?')[0];
        if (filename === path.join(root, 'DLC/distribution.json')) {
          return { code: JSON.stringify(normalizedProfile), map: null };
        }
        if (!filename.startsWith(root + '/src/') && !filename.startsWith(root + '/DLC/')) return null;
        const transformed = transformer.transform(source, id);
        return transformed ? { code: transformed.code, map: null } : null;
      },
      generateBundle(_options, bundle) {
        for (const chunk of Object.values(bundle)) {
          if (chunk.type !== 'chunk') continue;
          for (const raw of Object.keys(chunk.modules)) {
            observed.add(raw);
            const filename = raw.split('?')[0].split(path.sep).join('/');
            const match = filename.match(/\/DLC\/([^/]+)\//);
            if (!match) continue;
            if (!selectedFolders.has('DLC/' + match[1])) throw new Error('Excluded DLC entered the application bundle: ' + raw);
            dlcModules.add(filename);
          }
        }
      }
    }],
    build: { write: false, copyPublicDir: false }
  });
  const outputs = Array.isArray(result) ? result.flatMap(item => item.output) : result.output;
  return {
    schemaVersion: 1, passed: true, profile: normalizedProfile,
    selectedPacks: installed.size, modules: observed.size, dlcModules: dlcModules.size,
    javascriptBytes: outputs.filter(item => item.type === 'chunk').reduce((sum, item) => sum + Buffer.byteLength(item.code), 0),
    scope: 'Full executable application compile and selected-DLC module closure. No exported edition, media hydration/copy, production prebuild, or artwork approval.',
    emittedFiles: 0
  };
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 2 || args[0] !== '--profile' || !args[1]) {
      throw new Error('Usage: node scripts/checkDlcProfileBundle.mjs --profile FILE');
    }
    console.log(JSON.stringify(await checkDlcProfileBundle({ profile: args[1] }), null, 2));
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}
