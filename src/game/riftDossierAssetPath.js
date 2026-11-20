export const RIFT_DOSSIER_ASSET_ROOT = '/images/rift-dossiers/openai/';

const GENERATED_DOSSIER_ASSET_PATH_PATTERN = /^\/images\/rift-dossiers\/openai\/(?:[a-z0-9][a-z0-9-]*\/)*[a-z0-9][a-z0-9-]*\.(?:avif|png|webp)$/;
const ORIGINAL_OC_STAGE_ART_PATH_PATTERN = /^\/images\/oc-worlds\/v2\/[a-z0-9][a-z0-9_-]*\/stages\/[a-z0-9][a-z0-9_-]*\.png$/;

/** Dedicated thumbnails use a public route without traversal or URL options. */
export const auditRiftDossierAssetPath = assetPath => {
  const issues = [];
  if (typeof assetPath !== 'string' || !assetPath.trim()) {
    issues.push('assetPath must be a non-empty string');
  } else {
    if (assetPath.includes('\\')) issues.push('assetPath must use URL separators');
    if (assetPath.includes('..')) issues.push('assetPath cannot contain traversal segments');
    if (assetPath.includes('?') || assetPath.includes('#')) {
      issues.push('assetPath cannot contain a query string or hash');
    }
    if (!GENERATED_DOSSIER_ASSET_PATH_PATTERN.test(assetPath) && !ORIGINAL_OC_STAGE_ART_PATH_PATTERN.test(assetPath)) {
      issues.push(`assetPath must use ${RIFT_DOSSIER_ASSET_ROOT} or a dedicated original-OC stage-art route`);
    }
  }
  return Object.freeze({ assetPath, valid: issues.length === 0, issues: Object.freeze(issues) });
};

export const isDedicatedRiftDossierAssetPath = assetPath => auditRiftDossierAssetPath(assetPath).valid;
