import { ALL_OFFICIAL_WARDROBE } from '../src/game/wardrobe.js';
import fs from 'node:fs';
import path from 'node:path';
import { getWardrobeUnlockCatalogue, getWardrobeBoosterPool } from '../src/game/wardrobeBoosterRewards.js';
import { PERMANENT_OC_BOOSTERS, ORIGINAL_WORLD_BOOSTERS } from '../src/game/portalBoosterCatalog.js';
const [outDir, sourceCommit] = process.argv.slice(2);
if (!outDir || !/^[a-f0-9]{40}$/.test(sourceCommit || '')) throw new Error('Usage: exportWardrobeBoosters.mjs OUT_DIR SOURCE_COMMIT');
const out = path.resolve(outDir); fs.mkdirSync(out, { recursive: true });
const entries = getWardrobeUnlockCatalogue();
const universes = [...new Set(entries.map(e => e.universe))];
const worldByUniverse = new Map(ORIGINAL_WORLD_BOOSTERS.map(p => [p.universe, p]));
const banners = [{ id: 'multi', universe: 'Nexus de Convergence' }, ...PERMANENT_OC_BOOSTERS,
  ...universes.filter(u => u !== 'Nexus de Convergence').map(universe => worldByUniverse.get(universe) || {id:`universe:${universe}`,universe})];
const boosters = banners.map(banner => {
  const pool = getWardrobeBoosterPool({ banner, visibleUniverses: universes });
  return { boosterId: banner.id, universe: banner.universe, total: pool.length,
    official: pool.filter(e => e.origin === 'OFFICIAL').length,
    original: pool.filter(e => e.origin === 'ORIGINAL').length,
    actors: new Set(pool.map(e => e.actorKey)).size, bonusPerOpening: pool.length ? 1 : 0,
    extraPrice: 0, baseCardsUnchanged: 5, scope: banner.id === 'multi' ? 'MULTIVERSE' : banner.id.startsWith('oc:') ? 'EXACT_CHAPTER_CAST' : 'EXACT_UNIVERSE' };
});
const actors = [...new Set(entries.map(e => e.actorKey))].map(actorKey => {
  const list = entries.filter(e => e.actorKey === actorKey), first = list[0];
  return {actorKey,actorId:first.actorId,name:first.actorName,universe:first.universe,kind:first.actorKind,
    official:list.filter(e=>e.origin==='OFFICIAL').length,original:list.filter(e=>e.origin==='ORIGINAL').length,
    total:list.length,routes:first.routes.join(' | '),artwork:'NOT_PRODUCED',equippable:false};
});
const summary = {version:'R11',sourceCommit,actors:actors.length,universes:universes.length,
  costumeRights:entries.length,officialBindings:entries.filter(e=>e.origin==='OFFICIAL').length,
  originalBriefs:entries.filter(e=>e.origin==='ORIGINAL').length,boosterRoutes:boosters.length,
  newCostumeSheets:0,officialDesigns:ALL_OFFICIAL_WARDROBE.length,extraPrice:0,
  note:'A free additional entitlement, distinct from the five paid/free-credit cards. Uniform sampling without replacement within the eligible, unowned pool. Artwork remains pending; no new actor or gameplay bonus.'};
const cell = value => {
  let text = String(value ?? '');
  const first = [...text].find(c => c.charCodeAt(0) > 31 && !/\s/.test(c));
  if (first && '=+@-'.includes(first)) text = `'${text}`;
  return `"${text.replaceAll('"','""')}"`;
};
const csv = (rows, keys) => '\uFEFF' + [keys,...rows.map(row=>keys.map(key=>row[key]))].map(row=>row.map(cell).join(';')).join('\r\n')+'\r\n';
for (const [name, data] of Object.entries({summary,actors,boosters,entries})) fs.writeFileSync(path.join(out,`${name}.json`),JSON.stringify(data,null,2)+'\n');
fs.writeFileSync(path.join(out,'official-booster-routes.csv'),csv(entries.filter(e=>e.origin==='OFFICIAL').map(e=>({...e,name:e.name.fr,routes:e.routes.join(' | ')})),['id','actorName','universe','name','sourceWork','sourceUrl','component','sourceMode','targetIncarnation','relatedDesignKey','routes','artworkStatus','equippable']));
fs.writeFileSync(path.join(out,'booster-coverage.csv'),csv(boosters,['boosterId','universe','scope','total','official','original','actors','bonusPerOpening','extraPrice','baseCardsUnchanged']));
console.log(JSON.stringify(summary,null,2));
