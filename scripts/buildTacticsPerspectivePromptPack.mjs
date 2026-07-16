import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDir, '..');
const textureDir = path.join(root, 'public', 'textures', 'recent-universes');
const sourceManifestPath = path.join(textureDir, 'openai-level-texture-sources.json');
const promptPath = path.join(textureDir, 'openai-tactics-perspective-prompts.jsonl');
const manifestPath = path.join(textureDir, 'openai-tactics-perspective-sources.json');

const exists = async filePath => {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile() && stat.size > 80000;
  } catch {
    return false;
  }
};

const buildPrompt = entry => [
  'Use case: stylized-concept',
  `Asset type: lore-faithful pixel-art battlefield plate for Multiverse Breach Tactics mode, universe ${entry.universe}`,
  'Input image: canonical visual reference for palette, architecture, materials and source-world atmosphere only.',
  `Primary request: create the playable ground for ${entry.visualAnchor}.`,
  'Camera: elevated three-quarter tactical camera, roughly 35 degrees above the ground, looking from the lower foreground toward the upper background. The lower rows are visibly closer and must read in front of the upper rows.',
  'Board geometry: screen-aligned rectangular battlefield footprint compatible with an 8x6 tactics grid. Horizontal rows recede upward with mild depth compression; vertical columns remain readable. This is not a diamond isometric board.',
  'Style/medium: highly detailed 16-bit/32-bit cinematic pixel art with crisp nearest-neighbor clusters, stable material scale and readable tactical contrast.',
  'Composition: continuous unobstructed terrain covering the whole frame. Leave the center and every potential grid cell playable. Environmental detail belongs near edges or is embedded flat in the material.',
  'Constraints: environment only; no unit, person, creature, boss, vehicle, weapon, obstacle, cover prop, baked grid, coordinate, UI, text, letter, number, logo or watermark.',
  'Avoid: strict bird-eye view, flat top-down texture, side view, horizon-dominant landscape, diamond tiles, tilted board rotation, miniature diorama border, blur or painterly rendering.'
].join('\n');

const main = async () => {
  const sourceManifest = JSON.parse(await fs.readFile(sourceManifestPath, 'utf8'));
  const entries = await Promise.all(sourceManifest.entries.map(async entry => {
    const tacticsPath = `/textures/recent-universes/${entry.key}-openai-tactics-3q.webp`;
    return {
      universe: entry.universe,
      key: entry.key,
      sourcePage: entry.sourcePage,
      referencePage: entry.referencePage,
      referenceImage: entry.referenceImage,
      visualAnchor: entry.visualAnchor,
      tacticsPath,
      camera: 'elevated-three-quarter-rectangular-grid',
      available: await exists(path.join(root, 'public', tacticsPath.slice(1))),
      prompt: buildPrompt(entry)
    };
  }));

  await fs.writeFile(promptPath, entries.map(entry => JSON.stringify(entry)).join('\n') + '\n', 'utf8');
  await fs.writeFile(manifestPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    generator: 'OpenAI ImageGen',
    camera: 'elevated three-quarter view; lower rows render in front of upper rows',
    counts: {
      universes: entries.length,
      available: entries.filter(entry => entry.available).length,
      missing: entries.filter(entry => !entry.available).length
    },
    entries: entries.map(({ prompt: _prompt, ...entry }) => entry)
  }, null, 2), 'utf8');

  console.log(`Wrote ${entries.length} three-quarter Tactics texture prompts.`);
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
