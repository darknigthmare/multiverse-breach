import { projectAssetPath } from './dlcAssetPaths.mjs';

/**
 * Project a supplied Git tree, never the current checkout or its manifests.
 * Keep the physical keys for provenance/source validation and add the public
 * aliases expected by the runtime's asset probes. Old public/ trees work too.
 */
export function projectExportAssetTree(tree) {
  const index = new Map(tree);
  const owners = new Map();
  for (const [sourcePath, entry] of tree) {
    if (entry.type && entry.type !== 'blob') continue;
    const candidate = sourcePath === 'public' || sourcePath.startsWith('public/')
      || /^DLC\/[^/]+\/assets(?:\/|$)/.test(sourcePath);
    if (!candidate) continue;
    const asset = projectAssetPath(sourcePath);
    if (!asset) throw new Error(`Invalid asset source path in supplied Git tree: ${JSON.stringify(sourcePath)}`);
    const previous = owners.get(asset.publicPath);
    if (previous) {
      const error = new Error(`Asset URL collision in supplied Git tree for ${JSON.stringify(asset.publicPath)}: ${JSON.stringify(previous)} and ${JSON.stringify(sourcePath)}`);
      error.code = 'ASSET_PUBLIC_PATH_COLLISION';
      error.publicPath = asset.publicPath;
      error.sourcePaths = [previous, sourcePath];
      throw error;
    }
    owners.set(asset.publicPath, sourcePath);
    index.set(`public${asset.publicPath}`, entry);
  }
  return index;
}
