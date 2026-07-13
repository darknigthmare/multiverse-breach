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
  .replaceAll("from './loreAccuratePacks'", "from './loreAccuratePacks.js'")
  .replaceAll("from './lore'", "from './lore.js'")
  .replaceAll("from './heroes'", "from './heroes.js'")
  .replaceAll("from './enemies'", "from './enemies.js'");

const copyRuntimeModules = async () => {
  await fs.rm(tmpDir, { recursive: true, force: true });
  await fs.mkdir(tmpDir, { recursive: true });
  const files = ['expandedUniverses.js', 'loreAccuratePacks.js', 'heroes.js', 'enemies.js', 'lore.js', 'battleItems.js', 'spriteAssets.js'];
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

const fileExists = async (relativeOutput) => {
  const localPath = path.join(outDir, relativeOutput.replace(/^\/sprites\/generated\//, ''));
  try {
    const stat = await fs.stat(localPath);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
};

const main = async () => {
  await copyRuntimeModules();
  const [{ HEROES_DB, EQUIP_ITEMS_DB, EVENT_ITEMS_DB }, { ENEMIES_DB, FINAL_GAME_BOSS }, { BATTLE_ITEM_CATALOG }] = await Promise.all([
    import(pathToFileURL(path.join(tmpDir, 'heroes.js')).href),
    import(pathToFileURL(path.join(tmpDir, 'enemies.js')).href),
    import(pathToFileURL(path.join(tmpDir, 'battleItems.js')).href)
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
    (data.monsters || []).filter(Boolean).forEach((enemy) => {
      const universeSlug = slugify(universe);
      const file = `bosses/${universeSlug}/${slugify(enemy.name)}.png`;
      bossEntries.push({
        kind: 'enemy',
        id: slugify(`${universe}-${enemy.name}`),
        name: enemy.name,
        universe,
        output: enemy.spriteSource || `/sprites/generated/${file}`,
        frame: { width: 256, height: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
        prompt: buildPrompt({
          kind: 'enemy',
          name: enemy.name,
          universe,
          role: 'standard enemy',
          weapon: enemy.weapon,
          color: enemy.color,
          special: enemy.special
        })
      });
    });
    [...(data.bosses || []), data.worldBoss].filter(Boolean).forEach((boss) => {
      const universeSlug = slugify(universe);
      const file = `bosses/${universeSlug}/${slugify(boss.name)}.png`;
      bossEntries.push({
        kind: 'boss',
        id: slugify(`${universe}-${boss.name}`),
        name: boss.name,
        universe,
        output: boss.spriteSource || `/sprites/generated/${file}`,
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

  const itemSource = [
    ...EQUIP_ITEMS_DB,
    ...Object.entries(EVENT_ITEMS_DB).map(([universe, item]) => ({ ...item, universe: item.universe || universe })),
    ...BATTLE_ITEM_CATALOG
  ];
  const seenItemOutputs = new Set();
  const itemEntryCandidates = itemSource.flatMap((item) => {
    if (!item?.id) return [];
    const universe = item.universe || 'unknown';
    const universeSlug = slugify(universe);
    const file = `items/${universeSlug}/${slugify(item.id)}.png`;
    const output = `/sprites/generated/${file}`;
    if (seenItemOutputs.has(output)) return [];
    seenItemOutputs.add(output);
    return [{
      kind: 'item',
      id: item.id,
      name: item.name?.en || item.name?.fr || item.id,
      universe,
      output,
      frame: { width: 512, height: 512, columns: 1, rows: ['icon'] },
      prompt: [
        'Use case: stylized-concept',
        'Asset type: transparent game item icon for a 2D canvas battle game',
        `Primary request: create a detailed pixel-art item icon for ${item.name?.en || item.id} from ${universe}.`,
        'Style/medium: highly detailed dark fantasy pixel art, ornate pixel texture, crisp outline, readable at small UI size.',
        'Composition/framing: centered single item icon, generous padding, three-quarter top angle, no character.',
        'Background: perfectly flat solid #00ff00 chroma key, no floor, no cast shadow, no text, no watermark.',
        'Constraints: one item only, no UI labels, no readable logos unless explicitly part of the item lore, consistent icon scale.'
      ].join('\n')
    }];
  });

  const itemEntries = (await Promise.all(itemEntryCandidates.map(async (entry) => (
    await fileExists(entry.output) ? entry : null
  )))).filter(Boolean);

  const all = [...heroEntries, ...bossEntries, ...itemEntries];
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(outJsonl, all.map(entry => JSON.stringify(entry)).join('\n') + '\n', 'utf8');
  const manifestEntries = await Promise.all(all.map(async (item) => {
    const entry = { ...item };
    delete entry.prompt;
    entry.available = await fileExists(entry.output);
    entry.source = entry.available ? 'openai' : null;
    return entry;
  }));

  await fs.writeFile(outManifest, JSON.stringify({
    generatedAt: new Date().toISOString(),
    sheet: { width: 1024, height: 1024, frameWidth: 256, frameHeight: 256, columns: 4, rows: ['idle', 'run', 'attack', 'hit'] },
    counts: {
      heroes: heroEntries.length,
      enemies: bossEntries.filter(entry => entry.kind === 'enemy').length,
      bosses: bossEntries.filter(entry => entry.kind === 'boss').length,
      items: itemEntries.length,
      total: all.length
    },
    availableCounts: {
      heroes: manifestEntries.filter(entry => entry.kind === 'hero' && entry.available).length,
      enemies: manifestEntries.filter(entry => entry.kind === 'enemy' && entry.available).length,
      bosses: manifestEntries.filter(entry => entry.kind === 'boss' && entry.available).length,
      items: manifestEntries.filter(entry => entry.kind === 'item' && entry.available).length,
      total: manifestEntries.filter(entry => entry.available).length
    },
    entries: manifestEntries
  }, null, 2), 'utf8');
  await fs.rm(tmpDir, { recursive: true, force: true });
  const enemyCount = bossEntries.filter(entry => entry.kind === 'enemy').length;
  const bossCount = bossEntries.filter(entry => entry.kind === 'boss').length;
  console.log(`Wrote ${all.length} sprite prompts (${heroEntries.length} heroes, ${enemyCount} enemies, ${bossCount} bosses, ${itemEntries.length} items).`);
  console.log(outJsonl);
  console.log(outManifest);
};

main().catch(async (error) => {
  await fs.rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  console.error(error);
  process.exit(1);
});
