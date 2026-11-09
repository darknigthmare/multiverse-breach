import { createHash } from 'node:crypto';
import { readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { buildDlcDistributionPlan, readDlcDistributionManifests, resolveDlcSelection } from './dlcDistribution.mjs';
import { DLC_SHARED_DEPENDENCIES, readDlcSharedDependencies, REVIEWED_SHARED_POLICY } from './dlcSharedAssetDependencies.mjs';
import { readDistributionFile, inspectDistributionPath } from './dlcDistributionFilesystem.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function buildDlcSharedDependencyReport({ root = ROOT } = {}) {
  const manifests = readDlcDistributionManifests({ root });
  const dependencies = readDlcSharedDependencies({ root, required: true });
  const consumers = [...new Set(dependencies.assets.flatMap(asset => asset.packIds))];
  const profiles = [], plans = [];
  for (const [name, mode, packIds, sharedPolicy] of [
    ['base', 'base', [], 'preserve-all'], ['halo', 'selected', ['halo'], 'preserve-all'],
    ['base-reviewed', 'base', [], REVIEWED_SHARED_POLICY], ['halo-reviewed', 'selected', ['halo'], REVIEWED_SHARED_POLICY],
    ['consumers-reviewed', 'selected', consumers, REVIEWED_SHARED_POLICY],
  ]) {
    const selection = resolveDlcSelection({ manifests, profile: { schemaVersion: 1, mode, packIds, sharedPolicy } });
    const plan = buildDlcDistributionPlan({ root, selection }); plans.push(plan);
    const measure = asset => statSync(inspectDistributionPath(root, asset.sourcePath)).size;
    profiles.push({ name, mode, sharedPolicy, installedPacks: selection.packIds.length,
      ...plan.counts, sharedBytes: plan.publicAssets.reduce((sum, asset) => sum + measure(asset), 0),
      excludedSharedFiles: plan.excludedSharedAssets.length,
      excludedSharedBytes: plan.excludedSharedAssets.reduce((sum, asset) => sum + measure(asset), 0),
      commonIntroIncluded: plan.publicAssets.some(asset => asset.publicPath === '/backgrounds/halo-tactics-openai.png'),
      commonProfileIncluded: plan.publicAssets.some(asset => asset.publicPath === '/backgrounds/stargate-rpg-openai.png') });
  }
  const proof = plans.find(plan => plan.sharedDependencyProof).sharedDependencyProof;
  return { schemaVersion: 1,
    scope: 'Explicit dependency closure for reviewed OpenAI backdrop factories, generated registry data, common consumers and guarded dynamic resolvers. No general-purpose shared asset purge, hot installation, performance or artwork-fidelity claim.',
    defaultPolicy: 'preserve-all', optInPolicy: REVIEWED_SHARED_POLICY,
    dependencyManifestSha256: sha256(readDistributionFile(root, DLC_SHARED_DEPENDENCIES)),
    sourceFiles: proof.sourceFiles, sourceInventorySha256: proof.sourceInventorySha256,
    resolvers: proof.resolvers, profiles,
    assets: proof.assets.map(asset => {
      const sourcePath = 'public' + asset.publicPath;
      const bytes = readDistributionFile(root, sourcePath);
      if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
        throw new Error('Reviewed backdrop is not a materialized PNG: ' + sourcePath);
      }
      return { ...asset, sourcePath, bytes: bytes.length, sha256: sha256(bytes) };
    }),
  };
}
if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  try {
    const options = {};
    for (let index = 2; index < process.argv.length; index += 2) {
      const flag = process.argv[index], value = process.argv[index + 1];
      if (!['--root', '--out', '--check'].includes(flag) || !value || value.startsWith('--') || options[flag]) throw new Error('Invalid shared dependency report arguments');
      options[flag] = value;
    }
    if (options['--out'] && options['--check']) throw new Error('Choose --out or --check');
    const report = buildDlcSharedDependencyReport({ root: options['--root'] || ROOT });
    const serialized = JSON.stringify(report, null, 2) + '\n';
    if (options['--out']) writeFileSync(path.resolve(options['--out']), serialized);
    if (options['--check'] && readFileSync(path.resolve(options['--check']), 'utf8') !== serialized) throw new Error('Shared dependency proof report is stale; review current sources and regenerate');
    console.log(JSON.stringify({ assets: report.assets.length, consumers: new Set(report.assets.flatMap(asset => asset.packIds)).size,
      sourceFiles: report.sourceFiles, profiles: report.profiles }, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
