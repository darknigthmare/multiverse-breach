import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  PORTAL_FALLBACK_VISUAL,
  PORTAL_VISUAL_MANIFEST,
  PORTAL_VISUALS_BY_UNIVERSE,
  getPortalFrameForPhase,
  getPortalVisual,
  resolvePortalVisual
} from '../src/game/visuals/portalVisualCatalog.js';
import {
  buildPortalPromptManifest,
  serializePortalPromptManifest
} from './buildPortalPromptManifest.mjs';

const projectRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

test('the P3 manifest exposes exactly four approved production pilots', () => {
  assert.equal(PORTAL_VISUAL_MANIFEST.length, 4);
  assert.deepEqual(
    PORTAL_VISUAL_MANIFEST.map(visual => visual.universe),
    [
      '28 Days Later',
      'A Nightmare on Elm Street',
      'Ado',
      'Aegea: War of the Moirai'
    ]
  );

  PORTAL_VISUAL_MANIFEST.forEach((visual) => {
    assert.equal(visual.status, 'approved');
    assert.equal(visual.source, 'openai');
    assert.equal(visual.promptVersion, 'portal-atlas-v1');
    assert.deepEqual(
      { ...visual.atlas },
      {
        sheet: `/visuals/cosmetics/openai/universes/${visual.slug}/portal-effects-atlas-p3.webp`,
        width: 1024,
        height: 256,
        columns: 4,
        rows: 1,
        frames: 4,
        frameWidth: 256,
        frameHeight: 256,
        source: 'openai'
      }
    );
    assert.deepEqual(
      { ...visual.review },
      {
        lore: true,
        composition: true,
        alpha: true,
        distinctFrames: true,
        approvedAt: '2026-08-01'
      }
    );
  });
});

test('catalog lookup and resolver distinguish approved assets from the Nexus production fallback', () => {
  const approved = getPortalVisual('28-days-later');
  assert.equal(approved, PORTAL_VISUALS_BY_UNIVERSE['28 Days Later']);
  assert.equal(resolvePortalVisual('28 Days Later').isFallback, false);

  const fallback = resolvePortalVisual('Universe sans portail');
  assert.equal(fallback.universe, 'Nexus de Convergence');
  assert.equal(fallback.status, 'production');
  assert.equal(fallback.isFallback, true);
  assert.equal(fallback.requestedUniverse, 'Universe sans portail');
  assert.equal(fallback.adminLabel.fr, 'PORTAIL EN PRODUCTION');
  assert.equal(PORTAL_FALLBACK_VISUAL.status, 'production');
});

test('portal reveal phases map to the sealed four-frame contract', () => {
  assert.equal(getPortalFrameForPhase('sealed'), 0);
  assert.equal(getPortalFrameForPhase('charging'), 1);
  assert.equal(getPortalFrameForPhase('cutting'), 2);
  assert.equal(getPortalFrameForPhase('opening'), 2);
  assert.equal(getPortalFrameForPhase('revealing'), 3);
  assert.equal(getPortalFrameForPhase('complete'), 3);
  assert.equal(getPortalFrameForPhase('unknown'), 0);
});

test('reference dossiers preserve the required rights and portal approvals', async () => {
  for (const visual of PORTAL_VISUAL_MANIFEST) {
    const dossierPath = path.join(
      projectRoot,
      'public',
      ...visual.referenceDossier.split('/').filter(Boolean)
    );
    const dossier = JSON.parse(await readFile(dossierPath, 'utf8'));
    const { processedAt, ...approvalReview } = dossier.review;
    assert.deepEqual(approvalReview, visual.review);
    if (processedAt !== undefined) {
      assert.equal(new Date(processedAt).toISOString(), processedAt);
    }
  }

  const ado = JSON.parse(await readFile(path.join(
    projectRoot,
    'public/visuals/cosmetics/openai/universes/ado/reference-dossier.json'
  ), 'utf8'));
  assert.equal(ado.rightsClass, 'real-person-persona');

  const aegea = JSON.parse(await readFile(path.join(
    projectRoot,
    'public/visuals/cosmetics/openai/universes/aegea-war-of-the-moirai/reference-dossier.json'
  ), 'utf8'));
  assert.equal(aegea.rightsClass, 'original');
  assert.equal(aegea.releaseYear, 2026);
});

test('the checked-in portal prompt manifest is deterministic', async () => {
  const artifactPath = path.join(projectRoot, 'docs/portal-visuals/portal-prompt-manifest.json');
  const checkedIn = await readFile(artifactPath, 'utf8');
  const rebuilt = serializePortalPromptManifest(await buildPortalPromptManifest());
  assert.equal(checkedIn, rebuilt);
});
