import { CG_CATALOG } from './cgCatalog.js';
import generatedRoster from './cgRosterArtwork.generated.json' with { type: 'json' };
import { buildCgPaths, createCgDefinition } from './cgSchema.js';

// Only delivered ImageGen records are registered here. Planning entries and
// missing-reference subjects never become gallery placeholders.
export const CG_ROSTER_CATALOG = Object.freeze(generatedRoster.entries.map(entry => {
  // The pilot's v1 filenames are immutable. A new hero may start with a dated
  // delivery: expose those real files directly, without inventing a v1 image
  // or an earlier variant. Semantic metadata still uses the same schema.
  const definition = createCgDefinition({ ...entry, ...buildCgPaths(entry) });
  const imagePath = entry.assets?.master?.path;
  const thumbnailPath = entry.assets?.thumbnail?.path;
  const sourcePath = entry.assets?.source?.path;
  const expectedPrefix = `/cg/${definition.universeKey}/${definition.characterKey}/`;
  for (const assetPath of [imagePath, thumbnailPath, sourcePath]) {
    if (typeof assetPath !== 'string' || !assetPath.startsWith(expectedPrefix) || !/^\/[a-z0-9/.-]+$/.test(assetPath) || assetPath.includes('..')) {
      throw new TypeError(`Invalid delivered roster CG path for ${definition.id}.`);
    }
  }
  if (sourcePath !== imagePath.replace(/\.webp$/, '.png') || thumbnailPath !== imagePath.replace(/\.webp$/, '-thumb.webp')) {
    throw new TypeError(`Delivered roster CG derivatives must share the same filename stem: ${definition.id}.`);
  }
  return Object.freeze({ ...definition, imagePath, thumbnailPath });
}));
export const CG_GALLERY_CATALOG = Object.freeze([...CG_CATALOG, ...CG_ROSTER_CATALOG]);
const ids = new Set(CG_GALLERY_CATALOG.map(entry => entry.id));
if (ids.size !== CG_GALLERY_CATALOG.length) throw new Error('Duplicate CG ID in the complete roster gallery.');

export const CG_GALLERY_BY_ID = Object.freeze(Object.fromEntries(CG_GALLERY_CATALOG.map(entry => [entry.id, entry])));
