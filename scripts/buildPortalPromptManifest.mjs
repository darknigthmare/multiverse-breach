import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PORTAL_FALLBACK_VISUAL,
  PORTAL_VISUAL_MANIFEST
} from '../src/game/visuals/portalVisualManifest.js';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const outputPath = path.join(projectRoot, 'docs', 'portal-visuals', 'portal-prompt-manifest.json');

const readReferenceDossier = async (referenceDossier) => {
  const dossierPath = path.join(projectRoot, 'public', ...referenceDossier.split('/').filter(Boolean));
  return JSON.parse(await readFile(dossierPath, 'utf8'));
};

export const buildPortalPromptManifest = async () => {
  const portals = [];

  for (const visual of [...PORTAL_VISUAL_MANIFEST].sort((left, right) => (
    left.slug.localeCompare(right.slug, 'en')
  ))) {
    const dossier = await readReferenceDossier(visual.referenceDossier);
    portals.push({
      universe: visual.universe,
      slug: visual.slug,
      continuityId: visual.continuityId,
      status: visual.status,
      promptVersion: visual.promptVersion,
      source: visual.source,
      rightsClass: dossier.rightsClass,
      releaseYear: dossier.releaseYear,
      medium: dossier.medium,
      generationAllowed: dossier.generationAllowed,
      atlas: visual.atlas,
      motifs: visual.motifs,
      materials: visual.materials,
      palette: visual.palette,
      mustAvoid: visual.mustAvoid,
      officialReferenceUrls: visual.officialReferenceUrls,
      review: visual.review,
      referenceDossier: visual.referenceDossier,
      generationPrompt: dossier.generationPrompt || dossier.prompt
    });
  }

  return {
    schemaVersion: 1,
    id: 'multiverse-breach.portal-prompt-manifest',
    promptVersion: 'portal-atlas-v1',
    fallback: {
      universe: PORTAL_FALLBACK_VISUAL.universe,
      slug: PORTAL_FALLBACK_VISUAL.slug,
      continuityId: PORTAL_FALLBACK_VISUAL.continuityId,
      status: PORTAL_FALLBACK_VISUAL.status,
      source: PORTAL_FALLBACK_VISUAL.source,
      atlas: PORTAL_FALLBACK_VISUAL.atlas,
      adminLabel: PORTAL_FALLBACK_VISUAL.adminLabel
    },
    portals
  };
};

export const serializePortalPromptManifest = manifest => `${JSON.stringify(manifest, null, 2)}\n`;

const run = async () => {
  const expected = serializePortalPromptManifest(await buildPortalPromptManifest());
  if (process.argv.includes('--check')) {
    const current = await readFile(outputPath, 'utf8').catch(() => '');
    if (current !== expected) {
      console.error(`Portal prompt manifest is stale: ${path.relative(projectRoot, outputPath)}`);
      process.exitCode = 1;
      return;
    }
    console.log(`Portal prompt manifest is current: ${path.relative(projectRoot, outputPath)}`);
    return;
  }

  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, expected, 'utf8');
  console.log(`Wrote ${path.relative(projectRoot, outputPath)}`);
};

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await run();
}
