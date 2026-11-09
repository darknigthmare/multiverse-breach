import { readFileSync, lstatSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { build } from 'vite';
import { auditDlcDistribution } from './auditDlcDistribution.mjs';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const slash = value => value.split(path.sep).join('/');

export async function buildDlcDistribution({ root = process.cwd() } = {}) {
  root = path.resolve(root);
  const audited = auditDlcDistribution({ root });
  const receipt = audited.receipt || JSON.parse(readFileSync(path.join(root, 'DLC/distribution-receipt.json'), 'utf8'));
  const selectedDirectories = new Set(receipt.packs.map(pack => pack.directory.split('/')[1]));
  let moduleCount = 0;
  let dlcModuleCount = 0;
  let javascriptBytes = 0;
  const closurePlugin = {
    name: 'verify-installed-dlc-bundle',
    generateBundle(_options, bundle) {
      for (const item of Object.values(bundle)) {
        if (item.type !== 'chunk') continue;
        javascriptBytes += Buffer.byteLength(item.code);
        for (const id of Object.keys(item.modules)) {
          moduleCount++;
          const normalized = slash(id.split('?')[0]);
          const match = normalized.match(/\/DLC\/([^/]+)\//);
          if (!match) continue;
          if (!selectedDirectories.has(match[1])) throw new Error('Excluded DLC module entered the build: ' + id);
          dlcModuleCount++;
        }
      }
    }
  };
  await build({
    root,
    configFile: path.join(root, 'vite.config.js'),
    plugins: [closurePlugin],
    build: { outDir: path.join(root, 'dist'), emptyOutDir: true }
  });
  for (const asset of receipt.assets) {
    const file = path.join(root, 'dist', asset.publicPath.slice(1));
    const stat = lstatSync(file, { throwIfNoEntry: false });
    if (!stat?.isFile() || stat.isSymbolicLink()) throw new Error('Missing built distribution media: ' + asset.publicPath);
    const bytes = readFileSync(file);
    if (bytes.length !== asset.bytes || sha256(bytes) !== asset.sha256) throw new Error('Built distribution media differs: ' + asset.publicPath);
  }
  auditDlcDistribution({ root });
  const result = { mode: receipt.profile.mode, packs: receipt.packs.length, media: receipt.assets.length, moduleCount, dlcModuleCount, javascriptBytes };
  console.log('DLC distribution build: ' + JSON.stringify(result));
  return result;
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const args = process.argv.slice(2);
    if (args.length !== 0 && (args.length !== 2 || args[0] !== '--root')) throw new Error('Usage: node scripts/buildDlcDistribution.mjs [--root EXPORTED_DIRECTORY]');
    await buildDlcDistribution({ root: args[1] || process.cwd() });
  } catch (error) {
    console.error(error.stack || error.message);
    process.exitCode = 1;
  }
}
