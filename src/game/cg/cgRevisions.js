import revisionManifest from './cgRevisions.generated.json' with { type: 'json' };
import { CG_GALLERY_CATALOG } from './cgRosterCatalog.js';
import { isCgUnlocked } from './cgSchema.js';

const EMPTY_VERSIONS = Object.freeze([]);
const LOCKED_MEDIA = Object.freeze({ imagePath: null, thumbnailPath: null });
const SAFE_KEY = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SAFE_ASSET_SUFFIX = /^(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)*[a-z0-9]+(?:-[a-z0-9]+)*\.(png|webp)$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const requireText = (value, field) => {
  if (typeof value !== 'string' || !value.trim()) throw new TypeError(`${field} must be a non-empty string.`);
  return value.trim();
};

const freezeSummary = (summary) => {
  if (typeof summary === 'string') return requireText(summary, 'promptSummary');
  if (!summary || typeof summary !== 'object' || Array.isArray(summary) || (!summary.fr && !summary.en)) {
    throw new TypeError('promptSummary must provide localized fr or en text.');
  }
  return Object.freeze(Object.fromEntries(Object.entries(summary)
    .map(([locale, value]) => [locale, requireText(value, `promptSummary.${locale}`)])));
};

/**
 * Revisions change the displayed media, never the catalog identity or unlock.
 * Append corrections in publication order. The immutable catalog assets are
 * retained automatically as the oldest version; no archival copy is needed.
 */
export const createCgRevisionRegistry = (manifest, catalog = CG_GALLERY_CATALOG) => {
  if (manifest?.schemaVersion !== 1 || !Array.isArray(manifest.revisions)) {
    throw new TypeError('CG revision manifest must use schemaVersion 1 and a revisions array.');
  }
  const definitions = new Map(catalog.map((definition) => [definition.id, definition]));
  const assetPaths = new Set(catalog.flatMap(({ imagePath, thumbnailPath }) => (
    [imagePath, thumbnailPath, imagePath.replace(/\.webp$/, '.png')]
  )));
  const backgrounds = new Map();
  const grouped = {};

  for (const input of manifest.revisions) {
    const cgId = requireText(input?.cgId, 'cgId');
    const definition = definitions.get(cgId);
    if (!definition) throw new TypeError(`Unknown CG revision identity: ${cgId}.`);
    const revisionId = requireText(input.revisionId, 'revisionId');
    if (!SAFE_KEY.test(revisionId) || revisionId === 'catalog-original') {
      throw new TypeError('revisionId must be a unique kebab-case key other than catalog-original.');
    }
    const previous = grouped[cgId] || [];
    if (previous.some((revision) => revision.revisionId === revisionId)) {
      throw new TypeError(`Duplicate CG revision: ${cgId} / ${revisionId}.`);
    }
    const publishedAt = requireText(input.publishedAt, 'publishedAt');
    if (!ISO_DATE.test(publishedAt) || publishedAt < (previous.at(-1)?.publishedAt || definition.publishedAt)) {
      throw new TypeError('CG revisions must use YYYY-MM-DD dates in publication order.');
    }
    const directory = `/cg/${definition.universeKey}/${definition.characterKey}/`;
    const revision = { cgId, revisionId, publishedAt };
    for (const [field, extension] of [['imagePath', '.webp'], ['thumbnailPath', '.webp'], ['sourcePath', '.png']]) {
      const assetPath = requireText(input[field], field);
      if (!assetPath.startsWith(directory) || !SAFE_ASSET_SUFFIX.test(assetPath.slice(directory.length)) || !assetPath.endsWith(extension)) {
        throw new TypeError(`${field} must be a local ${extension} asset inside ${directory}.`);
      }
      if (assetPaths.has(assetPath)) throw new TypeError(`CG revision assets must preserve existing files: ${assetPath}.`);
      assetPaths.add(assetPath);
      revision[field] = assetPath;
    }
    if (input.backgroundId !== undefined) {
      const backgroundId = requireText(input.backgroundId, 'backgroundId');
      if (!SAFE_KEY.test(backgroundId)) throw new TypeError('backgroundId must use kebab-case.');
      if (backgrounds.has(backgroundId) && backgrounds.get(backgroundId) !== cgId) {
        throw new TypeError(`Each CG must use a different backgroundId: ${backgroundId}.`);
      }
      backgrounds.set(backgroundId, cgId);
      revision.backgroundId = backgroundId;
    }
    if (input.promptId !== undefined) revision.promptId = requireText(input.promptId, 'promptId');
    if (input.promptSummary !== undefined) revision.promptSummary = freezeSummary(input.promptSummary);
    if (input.sourceRefs !== undefined) {
      if (!Array.isArray(input.sourceRefs) || !input.sourceRefs.length) throw new TypeError('sourceRefs must contain at least one reference.');
      revision.sourceRefs = Object.freeze([...new Set(input.sourceRefs.map((value) => requireText(value, 'sourceRefs entry')))]);
    }
    grouped[cgId] = [...previous, Object.freeze(revision)];
  }

  return Object.freeze(Object.fromEntries(Object.entries(grouped)
    .map(([cgId, revisions]) => [cgId, Object.freeze(revisions)])));
};

export const CG_REVISION_REGISTRY = createCgRevisionRegistry(revisionManifest);

/** Locked heroes expose no revision paths, just like their catalog media. */
export const resolveCgVersions = (definition, progression = {}, registry = CG_REVISION_REGISTRY) => {
  if (!isCgUnlocked(definition, progression)) return EMPTY_VERSIONS;
  const original = {
    revisionId: 'catalog-original',
    imagePath: definition.imagePath,
    thumbnailPath: definition.thumbnailPath,
    sourcePath: definition.imagePath.replace(/\.webp$/, '.png'),
    publishedAt: definition.publishedAt,
    promptId: definition.promptId,
    promptSummary: definition.promptSummary,
    sourceRefs: definition.sourceRefs
  };
  const chronological = [original, ...(registry[definition.id] || []).map((revision) => ({ ...original, ...revision }))];
  return Object.freeze(chronological.reverse().map((version, index) => Object.freeze({ ...version, isCurrent: index === 0 })));
};

export const resolveCurrentCgMedia = (definition, progression = {}, registry = CG_REVISION_REGISTRY) => {
  const current = resolveCgVersions(definition, progression, registry)[0];
  return current
    ? Object.freeze({ imagePath: current.imagePath, thumbnailPath: current.thumbnailPath })
    : LOCKED_MEDIA;
};
