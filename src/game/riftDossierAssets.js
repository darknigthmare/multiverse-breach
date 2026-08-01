import registry from './riftDossierAssets.json' with { type: 'json' };

export const RIFT_DOSSIER_ASSET_SCHEMA_VERSION = 1;
export const RIFT_DOSSIER_ASSET_ROOT = '/images/rift-dossiers/openai/';
export const RIFT_DOSSIER_ASSET_STATUSES = Object.freeze({
  AVAILABLE: 'available',
  PENDING: 'pending'
});

const VALID_STATUSES = new Set(Object.values(RIFT_DOSSIER_ASSET_STATUSES));
const GENERATED_DOSSIER_ASSET_PATH_PATTERN = /^\/images\/rift-dossiers\/openai\/(?:[a-z0-9][a-z0-9-]*\/)*[a-z0-9][a-z0-9-]*\.(?:avif|png|webp)$/;
const ORIGINAL_OC_STAGE_ART_PATH_PATTERN = /^\/images\/oc-worlds\/v2\/[a-z0-9][a-z0-9_-]*\/stages\/[a-z0-9][a-z0-9_-]*\.png$/;
const isKnownDedicatedAssetPath = assetPath => (
  GENERATED_DOSSIER_ASSET_PATH_PATTERN.test(assetPath)
  || ORIGINAL_OC_STAGE_ART_PATH_PATTERN.test(assetPath)
);

const normalizeStageId = (stageOrId) => {
  const value = typeof stageOrId === 'object' && stageOrId !== null
    ? stageOrId.id
    : stageOrId;

  if (typeof value !== 'number' && typeof value !== 'string') return null;
  const normalized = String(value).trim();
  return normalized || null;
};

const freezeEntry = (entry) => Object.freeze({
  stageId: entry.stageId,
  assetPath: entry.assetPath,
  status: entry.status
});

export const RIFT_DOSSIER_ASSET_ENTRIES = Object.freeze(
  (Array.isArray(registry.entries) ? registry.entries : []).map(freezeEntry)
);

export const RIFT_DOSSIER_ASSET_REGISTRY_META = Object.freeze({
  schemaVersion: registry.schemaVersion,
  source: registry.source,
  assetRoot: registry.assetRoot
});

/**
 * Validates the public URL contract for a dedicated rift-dossier thumbnail.
 * The route must stay inside the OpenAI dossier directory and cannot contain
 * traversal segments, query strings, hashes, or shared backdrop locations.
 */
export const auditRiftDossierAssetPath = (assetPath) => {
  const issues = [];

  if (typeof assetPath !== 'string' || !assetPath.trim()) {
    issues.push('assetPath must be a non-empty string');
  } else {
    if (assetPath.includes('\\')) issues.push('assetPath must use URL separators');
    if (assetPath.includes('..')) issues.push('assetPath cannot contain traversal segments');
    if (assetPath.includes('?') || assetPath.includes('#')) {
      issues.push('assetPath cannot contain a query string or hash');
    }
    if (!isKnownDedicatedAssetPath(assetPath)) {
      issues.push(
        `assetPath must use ${RIFT_DOSSIER_ASSET_ROOT} or a dedicated original-OC stage-art route`
      );
    }
  }

  return Object.freeze({
    assetPath,
    valid: issues.length === 0,
    issues: Object.freeze(issues)
  });
};

export const isDedicatedRiftDossierAssetPath = (assetPath) => (
  auditRiftDossierAssetPath(assetPath).valid
);

const buildIndex = (entries) => {
  const index = new Map();
  const ambiguousStageIds = new Set();

  entries.forEach((entry) => {
    const stageId = normalizeStageId(entry?.stageId);
    if (!stageId) return;
    if (index.has(stageId)) ambiguousStageIds.add(stageId);
    else index.set(stageId, entry);
  });

  ambiguousStageIds.forEach(stageId => index.delete(stageId));
  return { index, ambiguousStageIds };
};

const registryIndex = buildIndex(RIFT_DOSSIER_ASSET_ENTRIES).index;

/**
 * Resolves only a declared, available, dedicated dossier thumbnail.
 * Missing, pending, malformed, or ambiguous entries deliberately return null;
 * this API never accepts or derives a fallback image.
 */
export const resolveRiftDossierAssetSrc = (stageOrId) => {
  const stageId = normalizeStageId(stageOrId);
  if (!stageId) return null;

  const entry = registryIndex.get(stageId);
  if (
    !entry
    || entry.status !== RIFT_DOSSIER_ASSET_STATUSES.AVAILABLE
    || !isDedicatedRiftDossierAssetPath(entry.assetPath)
  ) {
    return null;
  }

  return entry.assetPath;
};

export const requireRiftDossierAssetSrc = (stageOrId) => {
  const assetPath = resolveRiftDossierAssetSrc(stageOrId);
  if (assetPath) return assetPath;

  const stageId = normalizeStageId(stageOrId) || '<invalid>';
  throw new Error(`No dedicated rift-dossier thumbnail is available for stage ${stageId}`);
};

/**
 * Audits schema, uniqueness, path validity, generation state, and optionally
 * physical file presence. `assetExists` receives a public route and should
 * return true when the corresponding file exists.
 */
export const auditRiftDossierAssetEntries = (
  entries,
  { assetExists } = {}
) => {
  const sourceEntries = Array.isArray(entries) ? entries : [];
  const stageIdCounts = new Map();
  const assetPathCounts = new Map();
  const invalidEntries = [];
  const missingFiles = [];

  sourceEntries.forEach((entry, index) => {
    const issues = [];
    const stageId = normalizeStageId(entry?.stageId);
    const assetPath = entry?.assetPath;
    const status = entry?.status;

    if (!stageId) issues.push('stageId must be a non-empty string or number');
    else stageIdCounts.set(stageId, (stageIdCounts.get(stageId) || 0) + 1);

    if (typeof assetPath === 'string') {
      assetPathCounts.set(assetPath, (assetPathCounts.get(assetPath) || 0) + 1);
    }
    issues.push(...auditRiftDossierAssetPath(assetPath).issues);

    if (!VALID_STATUSES.has(status)) {
      issues.push(`status must be "${RIFT_DOSSIER_ASSET_STATUSES.AVAILABLE}" or "${RIFT_DOSSIER_ASSET_STATUSES.PENDING}"`);
    }

    if (issues.length > 0) {
      invalidEntries.push({ index, stageId: stageId || null, issues });
    } else if (
      status === RIFT_DOSSIER_ASSET_STATUSES.AVAILABLE
      && typeof assetExists === 'function'
      && !assetExists(assetPath)
    ) {
      missingFiles.push({ index, stageId, assetPath });
    }
  });

  const duplicateStageIds = [...stageIdCounts]
    .filter(([, count]) => count > 1)
    .map(([stageId]) => stageId);
  const duplicateAssetPaths = [...assetPathCounts]
    .filter(([, count]) => count > 1)
    .map(([assetPath]) => assetPath);
  const available = sourceEntries.filter(
    entry => entry?.status === RIFT_DOSSIER_ASSET_STATUSES.AVAILABLE
  ).length;
  const pending = sourceEntries.filter(
    entry => entry?.status === RIFT_DOSSIER_ASSET_STATUSES.PENDING
  ).length;

  const counts = Object.freeze({
    declared: sourceEntries.length,
    available,
    pending,
    invalid: invalidEntries.length,
    missingFiles: missingFiles.length,
    duplicateStageIds: duplicateStageIds.length,
    duplicateAssetPaths: duplicateAssetPaths.length
  });

  return Object.freeze({
    valid: (
      invalidEntries.length === 0
      && missingFiles.length === 0
      && duplicateStageIds.length === 0
      && duplicateAssetPaths.length === 0
    ),
    counts,
    invalidEntries: Object.freeze(invalidEntries),
    missingFiles: Object.freeze(missingFiles),
    duplicateStageIds: Object.freeze(duplicateStageIds),
    duplicateAssetPaths: Object.freeze(duplicateAssetPaths)
  });
};

export const auditRiftDossierAssets = (options) => {
  const registryIssues = [];
  if (registry.schemaVersion !== RIFT_DOSSIER_ASSET_SCHEMA_VERSION) {
    registryIssues.push(`schemaVersion must be ${RIFT_DOSSIER_ASSET_SCHEMA_VERSION}`);
  }
  if (registry.source !== 'openai') registryIssues.push('source must be "openai"');
  if (registry.assetRoot !== RIFT_DOSSIER_ASSET_ROOT) {
    registryIssues.push(`assetRoot must be ${RIFT_DOSSIER_ASSET_ROOT}`);
  }

  const entryAudit = auditRiftDossierAssetEntries(RIFT_DOSSIER_ASSET_ENTRIES, options);
  return Object.freeze({
    ...entryAudit,
    valid: registryIssues.length === 0 && entryAudit.valid,
    registryIssues: Object.freeze(registryIssues)
  });
};

const initialAudit = auditRiftDossierAssets();

export const RIFT_DOSSIER_ASSET_COUNTS = Object.freeze({
  declared: initialAudit.counts.declared,
  available: initialAudit.counts.available,
  pending: initialAudit.counts.pending
});
