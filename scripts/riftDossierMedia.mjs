import { readFileSync, realpathSync, statSync } from 'node:fs';
import path from 'node:path';
import { isDedicatedRiftDossierAssetPath } from '../src/game/riftDossierAssetPath.js';
import { isGitLfsPointer } from './auditLocalPublicAssets.mjs';

const isMaterializedFile = file => {
  const info = statSync(file, { throwIfNoEntry: false });
  return info?.isFile() && info.size > 0
    && (info.size > 1024 || !isGitLfsPointer(readFileSync(file)));
};

export function createRiftDossierFileResolver({ projectRoot, mediaRoot }) {
  const publicRoot = path.resolve(projectRoot, 'public');
  const supplementalRoot = mediaRoot ? realpathSync(mediaRoot) : null;
  if (supplementalRoot && !statSync(supplementalRoot).isDirectory()) {
    throw new TypeError('RIFT_DOSSIER_MEDIA_ROOT must point to a directory containing public asset routes.');
  }

  return assetPath => {
    if (!isDedicatedRiftDossierAssetPath(assetPath)) return null;
    const relativePath = assetPath.slice(1);
    const local = path.join(publicRoot, relativePath);
    if (isMaterializedFile(local)) return local;
    if (!supplementalRoot) return null;

    const extra = path.join(supplementalRoot, relativePath);
    if (!statSync(extra, { throwIfNoEntry: false })?.isFile()) return null;
    const resolved = realpathSync(extra);
    const relative = path.relative(supplementalRoot, resolved);
    if (relative === '..' || relative.startsWith('..' + path.sep) || path.isAbsolute(relative)) return null;
    return isMaterializedFile(resolved) ? resolved : null;
  };
}
