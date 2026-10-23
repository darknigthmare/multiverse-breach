import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { HEROES_DB } from '../src/game/heroes.js';
import { getHeroSpriteSheetSrc, getHeroCompleteSpritePack, getSpriteSheetLayout } from '../src/game/spriteAssets.js';
import { MELEE_STATES } from '../src/game/melee/meleeStateMachine.js';
import { getMeleeAnimationManifest } from '../src/game/melee/meleeAnimationManifest.js';

const root = path.resolve(import.meta.dirname, '..');
const directory = path.resolve(root, 'docs/combat-fidelity-2026-10-18');
const hash = data => crypto.createHash('sha256').update(data).digest('hex');
const states = [...new Set([...MELEE_STATES, 'attack', 'defense', 'hit', 'jump', 'outro', 'roundVictory', 'roundDefeat', 'fatality', 'super'])];
const heroSources = HEROES_DB.map(hero => ({
  id: hero.id, name: hero.name, universe: hero.universe,
  dedicatedMeleeManifest: !!getMeleeAnimationManifest(hero.id),
  completeContextPack: !!getHeroCompleteSpritePack(hero),
  sourceByState: Object.fromEntries(states.map(state => [state, getHeroSpriteSheetSrc({ ...hero, state }, 'melee')]))
}));
const sources = [...new Set(heroSources.flatMap(hero => Object.values(hero.sourceByState)))];
const results = new Map();
let next = 0;
async function inspect(source) {
  const file = path.resolve(root, `public${source}`);
  let bytes;
  try { bytes = await fs.readFile(file); } catch (error) { return { source, status: 'missing', error: error.code }; }
  try {
    const { data, info } = await sharp(bytes).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const layout = getSpriteSheetLayout(source);
    const columns = layout.columns, rows = layout.rows;
    if (info.width % columns || info.height % rows) return { source, status: 'non-integral-grid', width: info.width, height: info.height, columns, rows, sha256: hash(bytes), note: 'Image decodes; source cells have fractional dimensions. Renderer supports fractional sampling, but independent cell hashing needs separate normalization and visual grid review.' };
    const cellWidth = info.width / columns, cellHeight = info.height / rows;
    const rgbaHashes = [], alphaHashes = [], occupied = [];
    for (let row = 0; row < rows; row++) for (let col = 0; col < columns; col++) {
      const rgba = Buffer.alloc(cellWidth * cellHeight * 4), alpha = Buffer.alloc(cellWidth * cellHeight);
      let visible = 0;
      for (let y = 0; y < cellHeight; y++) for (let x = 0; x < cellWidth; x++) {
        const offset = ((row * cellHeight + y) * info.width + col * cellWidth + x) * 4;
        const target = (y * cellWidth + x) * 4;
        const opacity = data[offset + 3]; alpha[y * cellWidth + x] = opacity;
        if (opacity > 0) data.copy(rgba, target, offset, offset + 4);
        if (opacity > 12) visible++;
      }
      rgbaHashes.push(hash(rgba)); alphaHashes.push(hash(alpha)); occupied.push(visible);
    }
    return { source, status: 'decoded', width: info.width, height: info.height, columns, rows, cellWidth, cellHeight, sha256: hash(bytes),
      frames: rows * columns, occupiedFrames: occupied.filter(n => n > 100).length,
      uniqueVisibleRgbaFrames: new Set(rgbaHashes).size, uniqueAlphaFrames: new Set(alphaHashes).size,
      uniqueVisibleRgbaPerRow: Array.from({ length: rows }, (_, row) => new Set(rgbaHashes.slice(row * columns, (row + 1) * columns)).size),
      exactDuplicateFrames: rgbaHashes.length - new Set(rgbaHashes).size,
      rgbaHashes, alphaHashes };
  } catch (error) { return { source, status: 'decode-error', error: error.message }; }
}
await Promise.all(Array.from({ length: 4 }, async () => {
  while (next < sources.length) { const source = sources[next++]; results.set(source, await inspect(source)); }
}));
const heroes = heroSources.map(hero => ({ ...hero,
  sheets: [...new Set(Object.values(hero.sourceByState))].map(source => results.get(source)),
  hasMissingOrInvalidSheet: Object.values(hero.sourceByState).some(source => !['decoded', 'non-integral-grid'].includes(results.get(source).status)),
  hasNonIntegralGrid: Object.values(hero.sourceByState).some(source => results.get(source).status === 'non-integral-grid'),
  hasRepeatedTiles: Object.values(hero.sourceByState).some(source => results.get(source).exactDuplicateFrames > 0)
}));
const decoded = [...results.values()].filter(sheet => sheet.status === 'decoded');
const report = { schemaVersion: 1, date: '2026-10-18', method: 'Decode actual melee-resolved image bytes with Sharp. Hash cell RGBA after zeroing hidden RGB at alpha=0, plus alpha-only hashes. Exact duplicates are pixel facts, not a claim of semantic pose quality.',
  summary: { rosterHeroes: heroes.length, rosterUniverses: new Set(heroes.map(hero => hero.universe)).size,
    dedicatedMeleeManifestHeroes: heroes.filter(hero => hero.dedicatedMeleeManifest).length,
    completeContextPackHeroes: heroes.filter(hero => hero.completeContextPack).length,
    uniqueResolvedSheets: sources.length, decodedSheets: [...results.values()].filter(sheet => ['decoded', 'non-integral-grid'].includes(sheet.status)).length,
    pixelHashedSheets: decoded.length, nonIntegralGridSheets: [...results.values()].filter(sheet => sheet.status === 'non-integral-grid').length,
    missingSheets: [...results.values()].filter(sheet => sheet.status === 'missing').length,
    invalidSheets: [...results.values()].filter(sheet => !['decoded', 'non-integral-grid', 'missing'].includes(sheet.status)).length,
    heroesWithMissingOrInvalidSheet: heroes.filter(hero => hero.hasMissingOrInvalidSheet).length,
    heroesWithExactRepeatedTiles: heroes.filter(hero => hero.hasRepeatedTiles).length,
    sheetsWithExactRepeatedTiles: decoded.filter(sheet => sheet.exactDuplicateFrames > 0).length,
    sheetsWithSingleUniqueVisibleFrame: decoded.filter(sheet => sheet.uniqueVisibleRgbaFrames === 1).length,
    sheetsWithStaticRows: decoded.filter(sheet => sheet.uniqueVisibleRgbaPerRow.some(count => count === 1)).length,
    playerAnchorIsOutsideRoster: !HEROES_DB.some(hero => hero.id === 'player_anchor') },
  priorities: ['cloud_ff7', 'tifa_ff7', 'aerith_ff7', 'goku_dbz', 'vegeta_dbz', 'naruto_six_paths', 'sasuke_rinnegan'].map(id => heroes.find(hero => hero.id === id)),
  heroes, sheets: [...results.values()] };
await fs.mkdir(directory, { recursive: true });
await fs.writeFile(path.join(directory, 'character-animation-pixel-audit.json'), `${JSON.stringify(report, null, 2)}\n`);
const lines = ['# Audit réel des feuilles d’animation des personnages', '',
  'Audit des fichiers résolus pour les 1 911 héros, avant production des nouvelles animations dédiées. La présence de quatre rangées ne démontre aucune animation dédiée aux présentations ou aux supers. Les anciennes conclusions de QA sont des documents historiques, pas un résultat repris par cet audit.', '',
  'Reproduction : `node scripts/auditCombatCharacterAnimations.mjs`.', '',
  ...Object.entries(report.summary).map(([key, value]) => `- ${key} : ${value}`), '',
  'Les hashes ignorent les couleurs invisibles à alpha nul. Une cellule différente en pixels peut néanmoins rester une variante d’une pose générique ; cet audit ne certifie pas une chorégraphie ou une fidélité 1:1.', '',
  '| Héros | Univers | Feuilles | Frames uniques / total | Problèmes |', '| --- | --- | ---: | --- | --- |',
  ...heroes.map(hero => `| ${String(hero.name).replaceAll('|', '\\|')} (${hero.id}) | ${hero.universe.replaceAll('|', '\\|')} | ${hero.sheets.length} | ${hero.sheets.map(sheet => sheet.status === 'decoded' ? `${sheet.uniqueVisibleRgbaFrames}/${sheet.frames}` : sheet.status).join(', ')} | ${[hero.hasMissingOrInvalidSheet ? 'source absente/invalide' : '', hero.hasNonIntegralGrid ? 'grille fractionnaire à revoir' : '', hero.hasRepeatedTiles ? 'tuiles identiques' : '', !hero.dedicatedMeleeManifest ? 'aucun manifeste mêlée dédié' : ''].filter(Boolean).join('; ')} |`), ''];
await fs.writeFile(path.join(directory, 'character-animation-pixel-audit.md'), lines.join('\n'));
console.log(JSON.stringify(report.summary));
