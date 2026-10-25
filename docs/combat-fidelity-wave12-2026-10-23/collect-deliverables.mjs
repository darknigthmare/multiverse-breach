// Run BEFORE combatFidelityAudit --write, after the production owner freezes.
// Output is subsequently hashed as evidence. Coverage writes only README / CSV.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {measureCombatFidelity} from '../../scripts/combatFidelityAudit.mjs';
import {getCharacterAnimationAssets} from '../../src/game/combat/characterAnimationCatalog.js';
import {getMeleeAnimationManifest} from '../../src/game/melee/meleeAnimationManifest.js';
import sharp from 'sharp';
const root=new URL('../../',import.meta.url),directory=new URL('./',import.meta.url);
const read=path=>fs.readFileSync(new URL(path,root)),sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const baseline=JSON.parse(fs.readFileSync(new URL('baseline.json',directory)));
const current=measureCombatFidelity();
const fresh=(entries,oldEntries,key)=>entries.filter(e=>!new Set(oldEntries.map(e=>e[key])).has(e[key]));
const nativeBySheet=new Map(getCharacterAnimationAssets().map(e=>[e.sheet,e]));
const baseBySheet=new Map(fs.readdirSync(new URL('src/game/combat/',root)).filter(p=>/^characterSpriteCorrections.*\.generated\.json$/.test(p)).flatMap(p=>JSON.parse(read('src/game/combat/'+p)).entries).map(e=>[e.sheet,e]));
const completeNative32=fresh(current.meleeBindings.nativePresentationEntries,baseline.meleeBindings.nativePresentationEntries,'heroId').map(e=>{const asset=nativeBySheet.get(e.sheet);assert.equal(asset.frames,32);return asset;});
const partialNative=fresh(current.meleeBindings.nativePartialPresentationEntries,baseline.meleeBindings.nativePartialPresentationEntries,'heroId');
const base16=fresh(current.baseSpriteCorrections.entries,baseline.baseSpriteCorrections.entries,'heroId').map(e=>{const asset=baseBySheet.get(e.sheet);assert.equal(asset.frames,16);return asset;});
const full45=fresh(current.meleeBindings.detailedManifestCoverage.filter(e=>e.complete),baseline.meleeBindings.detailedManifestCoverage.filter(e=>e.complete),'id');
const rosterReinforcement16=fresh(current.entities.nativeAnimationEntries,baseline.entities.nativeAnimationEntries,'key');
const sheets=[...new Set([...completeNative32,...partialNative,...base16,...rosterReinforcement16].map(e=>e.sheet).concat(full45.flatMap(e=>e.sheets)))].sort();
const newPoses=completeNative32.reduce((n,e)=>n+e.frames,0)+partialNative.reduce((n,e)=>n+e.frames,0)+base16.reduce((n,e)=>n+e.frames,0)+full45.reduce((n,e)=>n+e.boundFrames,0)+rosterReinforcement16.reduce((n,e)=>n+e.frames,0);
for(const id of ['morty']){assert.equal(completeNative32.some(e=>e.heroId===id),false);assert.equal(base16.some(e=>e.heroId===id),false);}
assert.equal(rosterReinforcement16.some(e=>e.performerHeroId==='morty'),false);
for(const asset of [...completeNative32,...partialNative,...base16,...rosterReinforcement16])assert.equal(sha(read('public'+asset.sheet)),asset.sha256,asset.sheet);
// Count only cells actually bound in production, including non-square RPG cells.
// The unused padding rows of the six full45 sheets never become new poses.
const cells = new Map();
for (const asset of [...completeNative32, ...partialNative, ...base16, ...rosterReinforcement16]) {
  const entry = nativeBySheet.get(asset.sheet) || baseBySheet.get(asset.sheet)
    || JSON.parse(read('src/game/combat/summonAnimationsWave12.generated.json')).entries.find(e => e.sheet === asset.sheet);
  assert.ok(entry, asset.sheet);
  const rows = entry.phases ? [...new Set(Object.values(entry.phases).map(p => p.row))] : Array.from({ length: entry.rows }, (_, i) => i);
  cells.set(entry.sheet, { width: entry.frameWidth, height: entry.frameHeight,
    cells: rows.flatMap(row => Array.from({ length: entry.columns }, (_, col) => ({ row, col }))) });
}
for (const hero of full45) {
  const manifest = getMeleeAnimationManifest(hero.id);
  for (const animation of Object.values(manifest.animations)) {
    const group = cells.get(animation.sheet) || { width: manifest.cellWidth, height: manifest.cellHeight, cells: [] };
    for (let i = 0; i < animation.frameCount; i++) group.cells.push({ row: animation.row, col: animation.startColumn + i });
    cells.set(animation.sheet, group);
  }
}
const distinctCells = new Set(); let checkedCells = 0;
for (const [sheet, group] of cells) {
  assert.ok(Number.isInteger(group.width) && Number.isInteger(group.height), sheet);
  const { data, info } = await sharp(read('public' + sheet)).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  for (const { row, col } of group.cells) {
    const rgba = Buffer.alloc(group.width * group.height * 4);
    for (let y = 0; y < group.height; y++) {
      const offset = ((row * group.height + y) * info.width + col * group.width) * 4;
      data.copy(rgba, y * group.width * 4, offset, offset + group.width * 4);
    }
    const digest = sha(rgba); assert.equal(distinctCells.has(digest), false, `${sheet}/${row}/${col}: duplicate retained cell`);
    distinctCells.add(digest); checkedCells++;
  }
}
assert.equal(checkedCells, newPoses); assert.equal(distinctCells.size, newPoses);
const deliverables={date:'2026-10-23',wave:12,source1to1Verified:false,completeNative32,partialNative,base16,full45,rosterReinforcement16,newPoses,newPngFiles:sheets.length,sheets,blockedNativeHeroIds:['morty'],fallbackPartnerHeroIds:[],nativeRgbaCellsChecked:checkedCells,globallyDistinctNativeRgbaCells:distinctCells.size,countsDerivedFrom:'Delivered runtime entries, PNG SHA/dimensions/alpha, globally distinct retained RGBA cells, distinct manifest rows and immutable W11 baseline; no rejected image, old reused pose or screenshot counted.'};
fs.writeFileSync(new URL('deliverables.json',directory),JSON.stringify(deliverables,null,2)+'\n');
console.log(JSON.stringify({complete32:completeNative32.length,partialNative:partialNative.length,base16:base16.length,full45:full45.length,reinforcement16:rosterReinforcement16.length,newPoses,newPngFiles:sheets.length}));
