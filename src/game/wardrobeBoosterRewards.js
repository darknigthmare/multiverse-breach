/** Cosmetic entitlements, separate from the five-card economy and from artwork approval. */
import { HEROES_DB } from './heroes.js';
import { ENEMIES_DB } from './enemies.js';
import { createPlayerHero } from './playerHero.js';
import { PERMANENT_OC_BOOSTERS, ORIGINAL_WORLD_BOOSTERS } from './portalBoosterCatalog.js';
import { getOfficialCostumes, getOriginalCostumes, wardrobeActorKey } from './wardrobe.js';

const NEXUS = 'Nexus de Convergence';
const EMPTY = Object.freeze([]);
const originalPacks = new Map(ORIGINAL_WORLD_BOOSTERS.map(p => [p.universe, p.id]));
const chapterPacks = new Map(PERMANENT_OC_BOOSTERS.map(p => [p.id, p]));
const safeIds = value => new Set(Array.isArray(value) ? value.filter(v => typeof v === 'string') : []);
let catalogue;
let byId;

export function getWardrobeBoosterRoutes(actor) {
  if (!wardrobeActorKey(actor)) return EMPTY;
  if (actor.universe !== NEXUS) return Object.freeze([originalPacks.get(actor.universe) || `universe:${actor.universe}`, 'multi']);
  return Object.freeze([
    ...PERMANENT_OC_BOOSTERS.filter(p => p.heroIds.includes(actor.id)).map(p => p.id),
    'multi'
  ]);
}

// Only runtime actors: non-combat trial definitions and unbound research are NOT imported.
export function getWardrobeUnlockCatalogue() {
  if (catalogue) return catalogue;
  const actors = [createPlayerHero(), ...HEROES_DB].map(actor => ({ actor, kind: 'hero' }));
  for (const [universe, roster] of Object.entries(ENEMIES_DB)) {
    for (const [key, kind] of [['monsters', 'enemy'], ['bosses', 'boss'], ['worldBoss', 'worldBoss']]) {
      const list = key === 'worldBoss' ? [roster[key]].filter(Boolean) : roster[key] || [];
      for (const actor of list) actors.push({ actor: { ...actor, universe: actor.universe || universe }, kind });
    }
  }
  const rows = [];
  const ids = new Set();
  for (const { actor, kind } of actors) {
    for (const costume of [...getOfficialCostumes(actor), ...getOriginalCostumes(actor)]) {
      if (!costume.id || ids.has(costume.id)) throw new Error(`Duplicate wardrobe entitlement: ${costume.id}`);
      ids.add(costume.id);
      rows.push(Object.freeze({
        id: costume.id, actorKey: wardrobeActorKey(actor), actorId: actor.id || '',
        actorName: actor.name, actorKind: kind, universe: actor.universe,
        name: costume.name, origin: costume.origin, nature: costume.nature,
        sourceWork: costume.sourceWork || '', sourceUrl: costume.sourceUrl || '',
        component: costume.component || '', sourceMode: costume.sourceMode || '',
        targetIncarnation: costume.targetIncarnation || costume.sourceWork || '',
        relatedDesignKey: costume.relatedDesignKey || '',
        collection: costume.collection || '', artworkStatus: costume.artworkStatus,
        // Unlocking a right is never approval of a sprite or a grant of its actor.
        artApproved: false, equippable: false, rewardKind: 'costume',
        routes: getWardrobeBoosterRoutes(actor)
      }));
    }
  }
  catalogue = Object.freeze(rows);
  byId = new Map(catalogue.map(row => [row.id, row]));
  return catalogue;
}

export function getWardrobeUnlockById(id) {
  getWardrobeUnlockCatalogue();
  return typeof id === 'string' ? byId.get(id) || null : null;
}

/** Exact universe/chapter scope. Unknown banners fail closed instead of becoming a global pool. */
export function getWardrobeBoosterPool({ banner, visibleUniverses, hiddenUniverses = [], disabledAssets = {} } = {}) {
  if (!banner || typeof banner.id !== 'string') return EMPTY;
  const visible = safeIds(visibleUniverses);
  const hidden = safeIds(hiddenUniverses);
  const disabledHeroes = safeIds(disabledAssets.heroes);
  const disabledEnemies = safeIds(disabledAssets.enemies);
  const chapter = chapterPacks.get(banner.id);
  const scope = banner.id === 'multi' ? 'multi'
    : chapter && banner.universe === chapter.universe ? 'chapter'
    : typeof banner.universe === 'string' && (
      banner.id === `universe:${banner.universe}` || originalPacks.get(banner.universe) === banner.id
    ) ? 'universe' : null;
  if (!scope) return EMPTY;
  return getWardrobeUnlockCatalogue().filter(entry => {
    if (!visible.has(entry.universe) || hidden.has(entry.universe)) return false;
    if (entry.actorKind === 'hero' && disabledHeroes.has(entry.actorId)) return false;
    if (entry.actorKind !== 'hero' && (disabledEnemies.has(`${entry.universe}::${entry.actorName}`)
      || disabledEnemies.has(entry.actorKey) || disabledEnemies.has(entry.actorId))) return false;
    if (scope === 'multi') return true;
    if (entry.universe !== banner.universe) return false;
    // Chapter packs retain their exact cast. Original-world packs cover their whole universe.
    return scope !== 'chapter' || (entry.actorKind === 'hero' && chapter.heroIds.includes(entry.actorId));
  });
}

export function getWardrobeBoosterProgress(pool, inventory = []) {
  const owned = safeIds(inventory);
  const total = pool.length;
  const unlocked = pool.reduce((n, row) => n + Number(owned.has(row.id)), 0);
  return { total, unlocked, remaining: total - unlocked, guaranteedNew: total > unlocked,
    probabilityPerMissing: total > unlocked ? 1 / (total - unlocked) : 0 };
}

/** One free additional right, uniform among remaining exact entries. No duplicate/refund/pity change. */
export function drawWardrobeBoosterBonus({ pool = EMPTY, inventory = [], rng = Math.random } = {}) {
  if (typeof rng !== 'function') throw new TypeError('Wardrobe RNG must be a function.');
  const owned = safeIds(inventory);
  const seen = new Set();
  const missing = pool.filter(row => {
    const canonical = getWardrobeUnlockById(row?.id);
    if (!canonical || canonical !== row || owned.has(row.id) || seen.has(row.id)) return false;
    seen.add(row.id);
    return true;
  });
  if (!missing.length) return null;
  const roll = Number(rng());
  if (!Number.isFinite(roll)) throw new TypeError('Wardrobe RNG must return a finite number.');
  const index = Math.floor(Math.min(1 - Number.EPSILON, Math.max(0, roll)) * missing.length);
  return missing[index];
}

/** Immutable/idempotent grant; preserve existing equipment copies, unknown future IDs and selections. */
export function grantWardrobeBoosterBonus(inventory, bonus, eligiblePool) {
  if (!Array.isArray(inventory)) throw new TypeError('Inventory must be an array.');
  if (!bonus || getWardrobeUnlockById(bonus.id) !== bonus
      || !Array.isArray(eligiblePool) || !eligiblePool.some(row => row === bonus)) return inventory;
  return inventory.includes(bonus.id) ? inventory : [...inventory, bonus.id];
}

export function getWardrobeOwnership(entry, inventory = []) {
  if (!entry || typeof entry.id !== 'string') return 'UNKNOWN';
  if (entry.nature === 'procedural-effect') return 'FREE_EFFECT';
  return safeIds(inventory).has(entry.id) ? 'UNLOCKED_ARTWORK_PENDING' : 'LOCKED';
}

export function makeWardrobeBonusHistory(bonus, banner, lang, at) {
  if (!bonus || getWardrobeUnlockById(bonus.id) !== bonus) return null;
  const l = lang === 'fr' ? 'fr' : 'en';
  return {
    rewardId: bonus.id, kind: 'costume', universe: bonus.universe,
    name: `${bonus.actorName} — ${bonus.name[l] || bonus.name.en}`,
    packId: banner.id, pack: banner.label?.[l] || banner.id,
    rarity: 'bonus', rarityLabel: l === 'fr' ? 'Bonus de tenue' : 'Outfit bonus',
    rarityColor: '#39c5bb', duplicate: false, pricePaid: 0,
    shardsReturned: 0, rawShardsReturned: 0, netCost: 0, at
  };
}
