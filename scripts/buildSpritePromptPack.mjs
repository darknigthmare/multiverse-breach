import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const tmpDir = path.join(root, '.sprite-prompt-tmp');
const sourceDir = path.join(root, 'src', 'game');
const outDir = path.join(root, 'public', 'sprites', 'generated');
const outJsonl = path.join(outDir, 'openai-sprite-prompts.jsonl');
const outManifest = path.join(outDir, 'sprite-manifest.json');

const slugify = (value) => String(value || 'unknown')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '') || 'unknown';

const rewriteImports = (source) => source
  .replaceAll("from './expandedUniverses'", "from './expandedUniverses.js'")
  .replaceAll("from './heroes'", "from './heroes.js'")
  .replaceAll("from './enemies'", "from './enemies.js'");

const copyRuntimeModules = async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
  const files = ['expandedUniverses.js', 'heroes.js', 'enemies.js', 'spriteAssets.js'];
  await Promise.all(files.map(async (file) => {
    const raw = await fs.readFile(path.join(sourceDir, file), 'utf8');
    await fs.writeFile(path.join(tmpDir, file), rewriteImports(raw), 'utf8');
  }));
};

const buildPrompt = ({ kind, name, universe, role, weapon, color, special }) => [
  'Use case: stylized-concept',
  'Asset type: transparent game sprite sheet for a 2D canvas battle game',
  `Primary request: create a detailed pixel-art animation sheet for ${name}, ${kind} from ${universe}.`,
  'Style/medium: highly detailed dark fantasy pixel art, matching the provided vendor reference: ornate pixel texture, hand-painted highlights, crisp dark outline, strong readable silhouette.',
  'Composition/framing: exact 4 columns x 4 rows sprite sheet, equal cells, full body, three-quarter side battle angle facing right, centered in every cell.',
  'Animation rows: row 1 idle breathing, row 2 walk/run cycle, row 3 attack using the signature weapon or power, row 4 hit/recoil.',
  `Lore lock: preserve the recognizable silhouette, outfit, equipment, colors, and attitude of ${name}.`,
  `Combat identity: ${role || 'fighter'} using ${weapon || 'signature weapon or power'}${special ? `; special motif: ${special}` : ''}.`,
  `Palette anchor: ${color || 'lore-accurate colors'}; add fine highlights only where they fit the character.`,
  'Background: perfectly flat solid #00ff00 chroma key, no floor, no cast shadow, no text, no watermark.',
  'Constraints: one character only, no extra characters, no UI labels, no cropped body, consistent proportions across all 16 frames.'
].join('\n');

const main = async () => {
  await copyRuntimeModules();
  const [{ HEROES_DB }, { ENEMIES_DB, FINAL_GAME_BOSS }] = await Promise.all([
    import(pathToFileURL(path.join(tmpDir, 'heroes.js')).href),
    import(pathToFileURL(path.join(tmpDir, 'enemies.js')).href)
  ]);

  const heroEntries = HEROES_DB.map(hero => {
    const universeSlug = slugify(hero.universe);
    const file = `heroes/${universeSlug}/${slugify(hero.id)}.png`;
    return {
      kind: 'hero',
      id: hero.id,
      name: hero.name,
      universe: hero.universe,
      output: `/sprites/generated/${file}`,
      frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
      prompt: buildPrompt({
        kind: 'hero',
        name: hero.name,
        universe: hero.universe,
        role: hero.category,
        weapon: hero.weaponType || hero.simple?.name,
        color: `${hero.primaryColor}${hero.secondaryColor ? ` and ${hero.secondaryColor}` : ''}`,
        special: hero.special?.name
      })
    };
  });

  const bossEntries = [];
  Object.entries(ENEMIES_DB).forEach(([universe, data]) => {
    [...(data.bosses || []), data.worldBoss].filter(Boolean).forEach((boss) => {
      const universeSlug = slugify(universe);
      const file = `bosses/${universeSlug}/${slugify(boss.name)}.png`;
      bossEntries.push({
        kind: 'boss',
        id: slugify(`${universe}-${boss.name}`),
        name: boss.name,
        universe,
        output: `/sprites/generated/${file}`,
      frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
        prompt: buildPrompt({
          kind: 'boss',
          name: boss.name,
          universe,
          role: 'boss',
          weapon: boss.weapon,
          color: boss.color,
          special: boss.special
        })
      });
    });
  });

  bossEntries.push({
    kind: 'boss',
    id: 'final-breach-singularity-core',
    name: FINAL_GAME_BOSS.name,
    universe: 'Matrix',
    output: `/sprites/generated/bosses/matrix/${slugify(FINAL_GAME_BOSS.name)}.png`,
    frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
    prompt: buildPrompt({
      kind: 'boss',
      name: FINAL_GAME_BOSS.name,
      universe: 'Matrix',
      role: 'final boss',
      weapon: FINAL_GAME_BOSS.weapon,
      color: FINAL_GAME_BOSS.color,
      special: FINAL_GAME_BOSS.special
    })
  });

  const all = [...heroEntries, ...bossEntries];
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outJsonl, all.map(entry => JSON.stringify(entry)).join('\n') + '\n', 'utf8');
  await fs.writeFile(outManifest, JSON.stringify({
    generatedAt: new Date().toISOString(),
    sheet: { width: 1024, height: 1024, frameWidth: 256, frameHeight: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
    counts: { heroes: heroEntries.length, bosses: bossEntries.length, total: all.length },
    entries: all.map((item) => {
      const entry = { ...item };
      delete entry.prompt;
      return entry;
    })
  }, null, 2), 'utf8');
  await fs.rm(tmpDir, { recursive: true, force: true });
  console.log(`Wrote ${all.length} sprite prompts (${heroEntries.length} heroes, ${bossEntries.length} bosses).`);
  console.log(outJsonl);
  console.log(outManifest);
};

main().catch(async (error) => {
  await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  console.error(error);
  process.exit(1);
});
