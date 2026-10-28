/** Read-only, reproducible inventory of resolved actors and five item registries.
 * node --experimental-loader ./docs/excel/tools/json-loader.mjs \
 *   scripts/exportEquipmentWorkbookData.mjs OUT_DIR SOURCE_COMMIT [TREE_JSON] [YYYY-MM-DD]
 * TREE_JSON, when supplied: {sourceCommit,truncated:false,raw:<complete output of
 * git ls-tree -r -z --full-tree SOURCE_COMMIT>}. No media blob download is needed.
 * Catalog occurrences, rendering aliases, source research and physical gear are
 * separate concepts; this exporter never awards artistic or canonical approval.
 */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { HEROES_DB, EQUIP_ITEMS_DB, EVENT_ITEMS_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { createPlayerHero, PLAYER_HERO_ID } from '../src/game/playerHero.js';
import { BATTLE_ITEM_CATALOG } from '../src/game/battleItems.js';
import { SPECIAL_EVENT_REWARD_ITEMS } from '../src/game/specialEvents.js';
import { EXPANDED_EVENT_SHOP_ITEMS } from '../src/game/expandedUniverses.js';
import { CANON_ROSTER_WAVE } from '../src/game/canonRosterWave.js';
import { ORIGINAL_UNIVERSE_DEFINITIONS } from '../src/game/originalUniverseWave.js';
import { OC_DLC_UNIVERSE_KEYS } from '../src/game/ocDlcPacks.js';
import { actorSourceScope, indexActorContinuities } from '../src/game/actorFidelityBacklog.js';
import { wardrobeActorKey } from '../src/game/wardrobe.js';
import { getItemSpriteSrc } from '../src/game/spriteAssets.js';
import { GEAR_SHOP_VISUAL_CONTRACTS } from '../src/game/gearShopVisualContracts.js';
import { resolveSourceSignature } from '../src/game/signatureSourceKits.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const REPO = 'https://github.com/darknigthmare/multiverse-breach';
const cmp = (a, b) => String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
const text = (v, lang = 'fr') => typeof v === 'string' ? v : v?.[lang] || v?.en || v?.fr || '';
const unique = values => [...new Set(values.filter(Boolean))].sort(cmp);
const clone = value => JSON.parse(JSON.stringify(value));
const digest = value => createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const url = (sha, filename) => `${REPO}/blob/${sha}/${filename}`;
const normalized = value => String(value || '').normalize('NFKC').toLowerCase().replace(/[’‘]/g, "'").replace(/\s+/g, ' ').trim();

export function safeReferences(values) {
  return unique(values.flat(Infinity).filter(value => {
    if (typeof value !== 'string') return false;
    try { const parsed = new URL(value); return parsed.protocol === 'https:' && !parsed.username && !parsed.password; }
    catch { return false; }
  }));
}
const refs = value => safeReferences([value?.referenceUrl, value?.referenceUrls || [], value?.additionalReferences || []]);

/** Explicit triage, not canonical research. The unmodified label is preserved. */
export function classifyEquipmentLabel(label, { tier = '', field = '', isCombatEvent = false, sourceOriginal = false } = {}) {
  const value = normalized(label), result = (nature, natureBasis) => ({ nature, natureBasis });
  if (tier === 'summon') return result('INVOCATION_OU_RENFORT', 'Type summon déclaré ; ce n’est pas une arme portée.');
  if (tier === 'ultimate' || isCombatEvent) return result('EVENEMENT_OU_ATTAQUE', 'Entrée d’événement ou attaque ; une icône d’objet ne prouve pas un équipement porté.');
  if (field === 'sourceProps') return result('OBJET_DE_SCENE', 'sourceProps explicite ; possession, scène et usage à contrôler séparément.');
  if (/\b(anatomy|bare fists|toon body|organic sirens|camouflage tissue|vertebral path|serpent arm|inner jaw|clawed main arms|bladed tail|retractable claws|bestial claw|elastic claws|cybernetic spider body|ritual sith tattoos)\b/.test(value))
    return result('ANATOMIE_OU_PROTHESE', 'Mot anatomique explicite ; aucun objet transportable n’est déduit.');
  if (/\b(mystical powers|starbolts|energy projectiles|teleportation orbs|orbiting energy spheres|plague aura|night eternal|warning|omen trace|cross-thread|frequency|broadcast archive)\b/.test(value))
    return result('POUVOIR_OU_INFORMATION', 'Pouvoir, émission ou information nommés ; pas une arme physique certifiée.');
  if (/\b(kryll swarm|summon|renfort|invocation|assist|eidolon)\b/.test(value)) return result('INVOCATION_OU_RENFORT', 'Créature ou soutien dans le libellé ; ne pas compter comme arme portée.');
  if (/\b(costume|outfit|dress|uniform|overalls|tunic|clothes|bow tie|cloak|dance shoes)\b/.test(value)) return result('TENUE_OU_ACCESSOIRE', 'Triage lexical du vêtement ou accessoire, distinct des droits de costumes.');
  // Containers and mounts are their own objects: a blaster holster is not the
  // blaster, and a rifle magazine is not the rifle named in its description.
  if (/\b(holsters?|scabbards?|sheaths?|weapon slings?)\b/.test(value)) return result('PROTECTION_OU_EQUIPEMENT', 'Étui, fourreau ou fixation nommés ; ne pas les confondre avec l’arme qu’ils contiennent.');
  if (/\b(magazines?|ammo|ammunition|rounds|cartridges?)\b/.test(value)) return result('OBJET_OU_CONSOMMABLE_NOMME', 'Munition ou chargeur nommé ; distinct de l’arme compatible.');
  if (/\b(power loaders?|p-5000)\b/.test(value)) return result('MACHINE_OU_VEHICULE', 'Machine ou exosquelette utilitaire nommé ; usage et scène à vérifier, sans conversion en arme personnelle standard.');
  if (/\b(sigil|echo|spark|trace|memory|resonance|essence|spirit|program|permission|code|harmonic|cadence|relic|shard)\b/.test(value)) return result('ABSTRACTION_OU_RELIQUE_A_REVOIR', 'Libellé abstrait ou adaptation possible ; forme physique et origine à établir.');
  if (/\b(pistols?|rifles?|guns?|shotguns?|blasters?|lightsabers?|sabers?|swords?|blades?|knife|knives|daggers?|katanas?|polearms?|flamethrowers?|incinerators?|batarangs|mallets?|hammers?|grenades?|launchers?|cannons?|repeaters|crowbars?|wands?|wristblades|caster|machetes?|slasher attachment|electro-beam cyber-leg)\b/.test(value))
    return result('ARME_OU_OUTIL_NOMME', 'Arme ou outil nommé ; modèle exact, porteur, fonctions et incarnation à vérifier.');
  if (/\b(armor|armour|batsuit|suit|helmet|biomask|goggles|goggle|glasses|holster|belt|comlink|bracers|chest control box|life-support|shield|plate|boots|gloves|mechanical right hand|cybernetic legs|articulated dwarf gekko arms)\b/.test(value))
    return result('PROTECTION_OU_EQUIPEMENT', 'Triage lexical de protection ou équipement, sans conclusion de compatibilité canonique.');
  if (/\b(camera|scanner|tracker|computer|beacon|device|compass|radio|microphone|guitar|medicomp|teddy bear|doll|banana|battery|magazine|rounds|ammo|munition|herb|medkit|health drink|ration|torch|key|map|journal|medallion)\b/.test(value))
    return result('OBJET_OU_CONSOMMABLE_NOMME', 'Objet ou consommable nommé ; usage narratif, possession et effet réel restent distincts.');
  return result(sourceOriginal ? 'DESIGN_ORIGINAL_A_PRECISER' : 'NATURE_A_DETERMINER', 'Données insuffisantes pour décider entre objet physique, capacité et adaptation.');
}

export function classifyWeaponField(value) {
  const v = text(value);
  if (!v) return 'ABSENT';
  if (/(signature action|signature strike|origin burst|breach technique|signature technique|defensive action|decisive action)$/i.test(v)) return 'ACTION_GENERIQUE';
  // Factories can copy a full description to both weapon and weaponType. Mere
  // equality must not erase "neutrophil knife" or "oxygen delivery box".
  if (/^[a-z][a-z0-9_]*$/.test(v)) return 'ALIAS_MOTEUR';
  return 'LIBELLE_DECLARE_A_REVOIR';
}

export function inspectItemAsset(iconPath, tree) {
  const empty = { iconBlob: '', iconBytes: null };
  if (typeof iconPath !== 'string' || !iconPath) return { iconPath: '', iconStatus: 'NON_RESOLU', ...empty };
  if (!iconPath.startsWith('/') || iconPath.startsWith('//')) return { iconPath, iconStatus: 'EXTERNE_OU_NON_PRIS_EN_CHARGE', ...empty };
  let local;
  try { local = decodeURIComponent(iconPath.split(/[?#]/, 1)[0]); } catch { return { iconPath, iconStatus: 'CHEMIN_INVALIDE', ...empty }; }
  if (local.includes('\\') || local.split('/').some(part => part === '..' || part === '.')) return { iconPath, iconStatus: 'CHEMIN_INVALIDE', ...empty };
  const entry = tree.get(`public${local}`);
  return { iconPath: local, iconStatus: entry ? 'PRESENT_DANS_GIT' : 'ABSENT_DANS_GIT', iconBlob: entry?.sha || '', iconBytes: entry?.size ?? null };
}

function gitTree(sha, suppliedFile) {
  let raw;
  if (suppliedFile) {
    const snapshot = JSON.parse(fs.readFileSync(suppliedFile, 'utf8'));
    if (snapshot.sourceCommit !== sha || snapshot.truncated !== false || typeof snapshot.raw !== 'string' || !snapshot.raw.endsWith('\0')) throw new Error('Complete tree snapshot for the exact commit required.');
    raw = snapshot.raw;
  } else {
    // No -l: requesting blob sizes would download omitted media in a partial clone.
    raw = execFileSync('git', ['-C', ROOT, 'ls-tree', '-r', '-z', '--full-tree', sha], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  }
  return new Map(raw.split('\0').filter(Boolean).map(line => {
    const [head, ...name] = line.split('\t'), [mode, type, blob] = head.split(/\s+/);
    return [name.join('\t'), { mode, type, sha: blob, size: null }];
  }).filter(([, row]) => row.type === 'blob'));
}

function validateSources(tree) {
  const files = [];
  function walk(folder) {
    for (const entry of fs.readdirSync(path.join(ROOT, folder), { withFileTypes: true }).sort((a, b) => cmp(a.name, b.name))) {
      const filename = `${folder}/${entry.name}`;
      if (entry.isDirectory()) walk(filename);
      else if (entry.isFile() && /\.(js|json)$/.test(entry.name)) files.push(filename);
    }
  }
  walk('src/game'); files.push('src/App.jsx', 'src/components/HubScreen.jsx');
  return files.map(filename => {
    const bytes = fs.readFileSync(path.join(ROOT, filename));
    const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    if (tree.get(filename)?.sha !== blob) throw new Error(`Source differs from pinned commit: ${filename}`);
    return { path: filename, gitBlob: blob, bytes: bytes.length };
  });
}

/** Evaluate two data literals only; no application JSX or event handlers run. */
export function readShopRows(source) {
  const hints = source.match(/const SHOP_ITEM_UNIVERSE_HINTS = (\{[\s\S]*?\n  \});/);
  const rows = source.match(/const EVENT_SHOP_ITEMS = (\[[\s\S]*?\n  \])\.map\(resolveShopItem\);/);
  if (!hints || !rows || !rows[1].includes('...EXPANDED_EVENT_SHOP_ITEMS')) throw new Error('Shop source shape changed; review extraction.');
  const hintData = vm.runInNewContext(`(${hints[1]})`, Object.create(null), { timeout: 1000 });
  const staticRows = vm.runInNewContext(`(${rows[1].replace('...EXPANDED_EVENT_SHOP_ITEMS', '')})`, Object.create(null), { timeout: 1000 });
  if (!Array.isArray(staticRows) || staticRows.some(row => !row.id)) throw new Error('Invalid shop literal.');
  return [...staticRows, ...EXPANDED_EVENT_SHOP_ITEMS].map((item, i) => {
    const universe = item.universe || hintData[item.id] || '';
    const event = item.isCombatEvent ? EVENT_ITEMS_DB[universe] : null;
    return { row: { ...item, ...(event?.id === item.id ? event : {}), universe, isCombatEvent: Boolean(item.isCombatEvent), tokenCost: item.tokenCost },
      staticProjection: i < staticRows.length, projectionData: clone(item), sourceRecord: `EVENT_SHOP_ITEMS[${i}] after resolveShopItem` };
  });
}

export function readInitialLoadout(source) {
  const start = source.indexOf('const DEFAULT_SAVE = {');
  if (start < 0) throw new Error('DEFAULT_SAVE not found.');
  const section = source.slice(start, source.indexOf('\n};', start) + 3);
  const inventory = section.match(/\n  inventory: (\[[^\n]*\]),/);
  const gear = section.match(/\n  equippedGear: (\{[\s\S]*?\n  \}),/);
  const events = section.match(/\n  equippedEventItems: (\{[\s\S]*?\n  \}),/);
  if (!inventory || !gear || !events) throw new Error('Default equipment source shape changed.');
  const parse = value => clone(vm.runInNewContext(`(${value})`, { PLAYER_HERO_ID }, { timeout: 1000 }));
  return { inventory: parse(inventory[1]), equippedGear: parse(gear[1]), equippedEventItems: parse(events[1]) };
}

function assertUnique(rows, key) {
  const seen = new Set();
  for (const row of rows) { if (!row[key] || seen.has(row[key])) throw new Error(`Duplicate or empty ${key}: ${row[key]}`); seen.add(row[key]); }
}
const tally = (rows, key) => {
  const counts = new Map(); for (const row of rows) counts.set(row[key], (counts.get(row[key]) || 0) + 1);
  return Object.fromEntries([...counts.entries()].sort(([a], [b]) => cmp(a, b)));
};

export function buildEquipmentInventory(sourceCommit, suppliedTree = '', asOfDate = '2026-10-26') {
  if (!/^[a-f0-9]{40}$/.test(sourceCommit || '') || !/^\d{4}-\d{2}-\d{2}$/.test(asOfDate)) throw new Error('Full source SHA and YYYY-MM-DD date required.');
  const tree = gitTree(sourceCommit, suppliedTree), sourceFiles = validateSources(tree);
  const runtimeCatalogs = () => [HEROES_DB, ENEMIES_DB, EQUIP_ITEMS_DB, EVENT_ITEMS_DB, BATTLE_ITEM_CATALOG, SPECIAL_EVENT_REWARD_ITEMS, EXPANDED_EVENT_SHOP_ITEMS];
  const sourceDigest = digest(runtimeCatalogs());
  const originals = new Set(['Nexus de Convergence', ...ORIGINAL_UNIVERSE_DEFINITIONS.filter(row => row.isOriginal === true || row.sourceType === 'original').map(row => row.universe), ...OC_DLC_UNIVERSE_KEYS]);
  const continuities = indexActorContinuities(CANON_ROSTER_WAVE);
  const rawActors = [{ row: createPlayerHero(), kind: 'hero', sourcePath: 'src/game/playerHero.js', sourceRecord: 'createPlayerHero()' },
    ...HEROES_DB.map((row, i) => ({ row, kind: 'hero', sourcePath: 'src/game/heroes.js', sourceRecord: `HEROES_DB[${i}] after overrides` }))];
  for (const [universe, roster] of Object.entries(ENEMIES_DB)) for (const [field, kind] of [['monsters', 'enemy'], ['bosses', 'boss'], ['worldBoss', 'worldBoss']]) {
    const rows = field === 'worldBoss' ? (roster[field] ? [roster[field]] : []) : roster[field] || [];
    rows.forEach((row, index) => rawActors.push({ row: { ...row, universe: row.universe || universe }, kind, sourcePath: 'src/game/enemies.js',
      sourceRecord: `ENEMIES_DB[${JSON.stringify(universe)}].${field}${field === 'worldBoss' ? '' : `[${index}]`} after overrides` }));
  }
  const actors = rawActors.map(({ row, kind, sourcePath, sourceRecord }) => {
    const actorKey = wardrobeActorKey(row), packContinuities = continuities.get(actorKey) || [];
    const own = text(row.incarnation) || text(row.sourceIncarnation) || text(row.continuity) || text(row.continuityScope);
    const signature = resolveSourceSignature(row);
    return { actorKey, actorId: row.id || '', actorName: row.name, universe: row.universe, kind, sourceScope: actorSourceScope(row, originals),
      incarnation: own || (packContinuities.length === 1 ? packContinuities[0].continuity : ''),
      incarnationEvidence: own ? 'ACTOR_DECLARED' : packContinuities.length === 1 ? 'EXACT_PACK_BINDING' : packContinuities.length > 1 ? 'AMBIGUOUS_PACK_BINDING' : 'UNSPECIFIED', packContinuities,
      weaponTypeAlias: text(row.weaponType), weaponField: text(row.weapon), weaponFieldKind: classifyWeaponField(row.weapon),
      declaredEquipment: Array.isArray(row.equipment) ? row.equipment.map(v => text(v)).filter(Boolean) : [], sourceProps: Array.isArray(row.sourceProps) ? row.sourceProps.map(v => text(v)).filter(Boolean) : [],
      equipmentSource: text(row.equipmentSource), equipmentEvidenceStatus: text(row.equipmentEvidenceStatus), signatureName: signature?.name || '', signature: signature ? clone(signature) : null,
      referenceUrls: safeReferences([refs(row), packContinuities.map(v => v.referenceUrl)]), visualAnchor: text(row.visualAnchor), canonStatus: text(row.canonStatus),
      nonCombat: row.nonCombat === true || row.nonCombatTrial === true || row.combatEnabled === false || row.combatEligible === false,
      combatFlags: { nonCombat: row.nonCombat ?? null, nonCombatTrial: row.nonCombatTrial ?? null, combatEnabled: row.combatEnabled ?? null, combatEligible: row.combatEligible ?? null },
      sourcePath, sourceUrl: url(sourceCommit, sourcePath), sourceRecord,
      equipmentStatus: row.equipment?.length ? 'LISTE_DECLAREE_NON_CERTIFIEE' : 'INVENTAIRE_INDIVIDUEL_A_COMPLETER',
      associationCount: 0, gapCount: 0, fidelityStatus: 'AUCUNE_CERTIFICATION_1A1', canonicalFidelityApproved: false };
  }).sort((a, b) => cmp(a.actorKey, b.actorKey));
  assertUnique(actors, 'actorKey');
  const rawItems = [], add = (row, catalog, sourcePath, sourceRecord, projectionData = null) => rawItems.push({ row, catalog, sourcePath, sourceRecord, projectionData });
  EQUIP_ITEMS_DB.forEach((row, i) => add(row, 'EQUIPMENT', 'src/game/heroes.js', `EQUIP_ITEMS_DB[${i}] after overrides`));
  Object.entries(EVENT_ITEMS_DB).forEach(([universe, row]) => add({ ...row, universe: row.universe || universe }, 'EVENT', 'src/game/heroes.js', `EVENT_ITEMS_DB[${JSON.stringify(universe)}] after overrides`));
  BATTLE_ITEM_CATALOG.forEach((row, i) => add(row, 'BATTLE', 'src/game/battleItems.js', `BATTLE_ITEM_CATALOG[${i}]`));
  SPECIAL_EVENT_REWARD_ITEMS.forEach((row, i) => add(row, 'SEASON_REWARD', 'src/game/specialEvents.js', `SPECIAL_EVENT_REWARD_ITEMS[${i}]`));
  const shop = readShopRows(fs.readFileSync(path.join(ROOT, 'src/components/HubScreen.jsx'), 'utf8'));
  shop.forEach(({ row, sourceRecord, projectionData }) => add(row, 'SHOP', 'src/components/HubScreen.jsx', sourceRecord, projectionData));
  const items = rawItems.map(({ row, catalog, sourcePath, sourceRecord, projectionData }) => {
    if (!row.id || !row.universe) throw new Error(`Missing item identity: ${catalog}/${row.id}`);
    const contract = GEAR_SHOP_VISUAL_CONTRACTS[row.id], original = row.originalContent === true || row.contentOrigin === 'oc' || originals.has(row.universe) || catalog === 'SEASON_REWARD';
    return { itemKey: JSON.stringify([catalog, row.universe, row.id]), catalog, itemId: row.id, itemName: text(row.name), itemNameEn: text(row.name, 'en'), universe: row.universe,
      ...classifyEquipmentLabel(text(row.name, 'en'), { tier: row.tier || '', isCombatEvent: catalog === 'EVENT' || row.isCombatEvent === true, sourceOriginal: original }),
      slot: text(row.slot), role: text(row.role), tier: text(row.tier), canonicalName: text(row.canonicalName), sourceOwner: text(row.sourceOwner), incarnation: text(row.incarnation),
      canonicalItemId: text(row.canonicalItemId), sourceItemId: text(row.sourceItemId), linkedItemKeys: [], catalogPeerKeys: [], sourceItemLinkStatus: row.sourceItemId ? 'A_RESOUDRE' : 'NON_APPLICABLE',
      description: text(row.desc) || text(row.description), descriptionEn: text(row.desc, 'en') || text(row.description, 'en'),
      visualAnchor: text(row.visualAnchor) || text(contract?.visualAnchor), referenceUrls: safeReferences([refs(row), refs(contract)]), ...inspectItemAsset(getItemSpriteSrc(row), tree),
      declaredIconPath: row.icon || '', iconPrompt: row.iconPrompt || row.prompt || '', boost: row.boost || {}, cost: row.cost ?? null, tokenCost: row.tokenCost ?? null,
      effect: row.effect ?? null, effectSource: row.effectSource || '', gameplayPolicy: row.gameplayPolicy || {}, defaultKitPolicy: text(row.defaultKitPolicy),
      sourceScope: original ? 'ORIGINAL_DESIGN_OR_ADAPTATION' : 'EXTERNAL_OR_UNRESOLVED', sourcePath, sourceUrl: url(sourceCommit, sourcePath), sourceRecord,
      projectionData, declaredData: clone(row), declaredAuditTag: text(row.audit), declaredCanonStatus: text(row.canonStatus),
      sourceReviewStatus: 'REFERENCE_DECLAREE_NON_REVALIDEE', fidelityStatus: 'AUCUNE_CERTIFICATION_1A1', canonicalFidelityApproved: false };
  }).sort((a, b) => cmp(a.itemKey, b.itemKey));
  assertUnique(items, 'itemKey');
  const byItemIdentity = new Map();
  for (const row of items) { const key = JSON.stringify([row.universe, row.itemId]), group = byItemIdentity.get(key) || []; group.push(row); byItemIdentity.set(key, group); }
  for (const row of items) {
    const same = byItemIdentity.get(JSON.stringify([row.universe, row.itemId]));
    row.catalogPeerKeys = same.filter(v => v.itemKey !== row.itemKey).map(v => v.itemKey);
    if (row.sourceItemId) {
      row.linkedItemKeys = (byItemIdentity.get(JSON.stringify([row.universe, row.sourceItemId])) || []).filter(v => v.catalog !== 'BATTLE').map(v => v.itemKey);
      row.sourceItemLinkStatus = row.linkedItemKeys.length ? 'ID_SOURCE_EXPLICITE' : 'ID_SOURCE_NON_RESOLU';
    } else if (row.catalog === 'SHOP') {
      row.linkedItemKeys = same.filter(v => ['EQUIPMENT', 'EVENT'].includes(v.catalog)).map(v => v.itemKey);
      row.sourceItemLinkStatus = row.linkedItemKeys.length ? 'PROJECTION_MEME_ID' : 'ENTREE_BOUTIQUE_SEULE';
    }
  }
  const associations = [];
  function association(actor, label, relationship, evidenceField, sourcePath, referenceUrls = actor.referenceUrls, forcedNature = '') {
    const c = classifyEquipmentLabel(label, { field: evidenceField, sourceOriginal: actor.sourceScope === 'ORIGINAL_DESIGN' });
    associations.push({ associationKey: JSON.stringify([actor.actorKey, evidenceField, label]), actorKey: actor.actorKey, actorId: actor.actorId, actorName: actor.actorName,
      universe: actor.universe, incarnation: actor.incarnation, itemKey: '', label, relationship, nature: forcedNature || c.nature,
      natureBasis: forcedNature ? 'Signature résolue : technique ou invocation, sans inventaire d’objet porté déduit.' : c.natureBasis,
      evidenceField, evidence: evidenceField === 'sourceSignature' ? `resolveSourceSignature(${actor.sourceRecord}) => ${label}` : `${actor.sourceRecord}.${evidenceField}: ${label}`,
      referenceUrls, sourcePath, sourceUrl: url(sourceCommit, sourcePath), catalogBindingStatus: 'AUCUN_ID_OBJET_EXPLICITE', fidelityStatus: 'DECLARATION_DU_CODE_A_VERIFIER', canonicalFidelityApproved: false });
  }
  for (const actor of actors) {
    actor.declaredEquipment.forEach(label => association(actor, label, 'KIT_DECLARE', 'equipment', actor.sourcePath));
    actor.sourceProps.forEach(label => association(actor, label, 'OBJET_DE_SCENE_DECLARE', 'sourceProps', actor.sourcePath));
    if (actor.weaponFieldKind === 'LIBELLE_DECLARE_A_REVOIR') association(actor, actor.weaponField, 'CHAMP_ARME_DECLARE', 'weapon', actor.sourcePath);
    if (actor.signature) association(actor, actor.signature.name, 'TECHNIQUE_SIGNEE_NON_EQUIPEMENT', 'sourceSignature', 'src/game/signatureSourceKits.js', safeReferences([actor.signature.referenceUrl]), actor.signature.kind === 'summon' ? 'INVOCATION_OU_RENFORT' : 'TECHNIQUE_DE_COMBAT');
  }
  associations.sort((a, b) => cmp(a.associationKey, b.associationKey)); assertUnique(associations, 'associationKey');
  const initialLoadout = readInitialLoadout(fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf8'));
  const defaultAssignments = ['equippedGear', 'equippedEventItems'].flatMap(field => Object.entries(initialLoadout[field]).filter(([, id]) => id != null).map(([actorId, itemId]) => ({ actorId, itemId, field, relation: 'GAME_DEFAULT_NOT_CANON' })));
  const gaps = [];
  function gap(row, entityType, kind, priority, evidence, action) {
    const entityKey = entityType === 'actor' ? row.actorKey : row.itemKey;
    gaps.push({ gapKey: JSON.stringify([entityType, entityKey, kind]), entityType, entityKey, actorName: row.actorName || '', itemName: row.itemName || '', universe: row.universe,
      kind, priority, status: 'OUVERT', evidence, action, sourceUrl: row.sourceUrl });
  }
  for (const row of actors) {
    const original = row.sourceScope === 'ORIGINAL_DESIGN';
    if (!row.declaredEquipment.length) gap(row, 'actor', 'INVENTAIRE_INDIVIDUEL_ABSENT', 'P1', `Aucune liste equipment[] ; weaponType=${row.weaponTypeAlias || '(absent)'}.`, original
      ? 'Définir la dotation du design interne, ou confirmer l’absence d’équipement porté ; ne pas inventer de source officielle externe.'
      : 'Lister les armes et objets de cette incarnation, ou confirmer l’absence d’équipement porté. Ne pas transformer l’anatomie et les pouvoirs en objets.');
    if (!row.incarnation) gap(row, 'actor', 'INCARNATION_NON_FIXEE', 'P1', 'Aucune incarnation unique déclarée sur la fiche ou son pack exact.', original
      ? 'Fixer la version du design interne, ses formes et sa dotation de référence.' : 'Fixer opus, version, époque et forme avant d’attribuer un modèle ou une dotation.');
    if (!row.referenceUrls.length) gap(row, 'actor', 'SOURCE_INDIVIDUELLE_ABSENTE', original ? 'P2' : 'P1', 'Pas de référence HTTPS déclarée sur la fiche ou son pack exact.', original
      ? 'Relier le personnage et ses objets au design interne.' : 'Rechercher une source correspondant à l’identité et à l’incarnation exactes.');
    if (row.weaponFieldKind === 'ALIAS_MOTEUR' || row.weaponTypeAlias) gap(row, 'actor', 'ALIAS_ARME_NON_MODELE', 'P2', `weapon=${row.weaponField || '(absent)'}; weaponType=${row.weaponTypeAlias || '(absent)'}.`, 'Relier le rendu au nom exact de l’objet s’il existe ; un alias technique ne prouve pas un modèle canonique.');
    if (row.declaredEquipment.length || row.sourceProps.length || row.weaponFieldKind === 'LIBELLE_DECLARE_A_REVOIR') gap(row, 'actor', 'DOTATION_ET_RENDU_A_VERIFIER', 'P1', 'Des libellés individuels existent, sans validation visuelle produite par cet inventaire.', 'Vérifier possession, scène, compatibilité, silhouettes, matériaux, proportions, prise en main, rangements et animations de chaque pièce.');
  }
  for (const row of items) {
    if (row.sourceOwner) gap(row, 'item', 'PORTEUR_TEXTE_NON_LIE', 'P1', `sourceOwner=${row.sourceOwner}; incarnation=${row.incarnation || '(absente)'}; ${row.defaultKitPolicy}`, 'Résoudre l’identité et l’incarnation exactes ; ne pas équiper un personnage par son nom ou sa franchise.');
    if (row.defaultKitPolicy) gap(row, 'item', 'EXCLUSION_DOTATION_A_CONSERVER', 'P1', row.defaultKitPolicy, 'Conserver cette exclusion ; une compatibilité de jeu ne confirme pas une dotation canonique.');
    if (!row.referenceUrls.length && row.sourceScope !== 'ORIGINAL_DESIGN_OR_ADAPTATION') gap(row, 'item', 'SOURCE_OBJET_ABSENTE', 'P1', 'Aucun lien de référence déclaré.', 'Identifier une source et le modèle précis ; contrôler séparément forme physique et effet adapté au jeu.');
    if (row.iconStatus === 'ABSENT_DANS_GIT') gap(row, 'item', 'ICONE_RESOLUE_ABSENTE', 'P1', row.iconPath, 'Produire ou raccorder ce chemin, puis vérifier le rendu. Un fichier présent ne certifie pas sa fidélité.');
    if (row.sourceItemLinkStatus === 'ID_SOURCE_NON_RESOLU') gap(row, 'item', 'OBJET_SOURCE_NON_RESOLU', 'P1', `${row.universe} / ${row.sourceItemId}`, 'Contrôler cet identifiant source et son catalogue sans substitution par un nom proche.');
    if (['NATURE_A_DETERMINER', 'ABSTRACTION_OU_RELIQUE_A_REVOIR'].includes(row.nature)) gap(row, 'item', 'NATURE_PHYSIQUE_A_VERIFIER', 'P2', `${row.itemNameEn}: ${row.natureBasis}`, 'Distinguer accessoire attesté, pouvoir, mécanique de jeu et création originale.');
    gap(row, 'item', 'REVUE_VISUELLE_1A1_OUVERTE', 'P2', `Icône ${row.iconStatus}; audit déclaré=${row.declaredAuditTag || '(absent)'}.`, 'Comparer référence, édition, détails et rendu. Les descriptions générées et tags canon-reference ne valent pas approbation.');
  }
  gaps.sort((a, b) => cmp(a.gapKey, b.gapKey)); assertUnique(gaps, 'gapKey');
  const counts = tally(associations, 'actorKey'), gapCounts = tally(gaps.filter(row => row.entityType === 'actor'), 'entityKey');
  actors.forEach(row => { row.associationCount = counts[row.actorKey] || 0; row.gapCount = gapCounts[row.actorKey] || 0; });
  const uniqueIcons = [...new Map(items.map(row => [row.iconPath, row])).values()].filter(row => row.iconPath);
  const summary = { version: 'equipment-inventory-v2', sourceCommit, asOfDate, repository: REPO,
    actors: actors.length, actorKinds: tally(actors, 'kind'), actorUniverses: new Set(actors.map(row => row.universe)).size,
    actorsWithDeclaredEquipment: actors.filter(row => row.declaredEquipment.length).length, declaredEquipmentEntries: actors.reduce((s, row) => s + row.declaredEquipment.length, 0),
    actorsWithSourceProps: actors.filter(row => row.sourceProps.length).length, actorsWithNamedWeaponFields: actors.filter(row => row.weaponFieldKind === 'LIBELLE_DECLARE_A_REVOIR').length,
    sourceSignatures: actors.filter(row => row.signatureName).length, catalogRecords: items.length, catalogs: tally(items, 'catalog'),
    distinctRuntimeUniverseItemKeys: byItemIdentity.size, distinctPhysicalObjects: null, catalogRecordsAreNotDistinctPhysicalObjects: true,
    originalActorIdentities: actors.filter(row => row.sourceScope === 'ORIGINAL_DESIGN').length, itemNatures: tally(items, 'nature'), iconStatuses: tally(items, 'iconStatus'),
    uniqueIconPaths: uniqueIcons.length, uniqueIconStatuses: tally(uniqueIcons, 'iconStatus'), unresolvedSourceItemLinks: items.filter(row => row.sourceItemLinkStatus === 'ID_SOURCE_NON_RESOLU').length,
    associations: associations.length, associationKinds: tally(associations, 'relationship'), gaps: gaps.length, gapKinds: tally(gaps, 'kind'),
    defaultAssignedEquipment: defaultAssignments.length, playerInventoryStartsWith: initialLoadout.inventory, actualUserSaveRead: false,
    newArtApprovals: 0, generatedSprites: 0, sourceFilesVerified: sourceFiles.length,
    completeness: 'EXHAUSTIVE_RESOLVED_CATALOGS_AND_ACTIVE_ACTORS; CANONICAL_RESEARCH_AND_VISUAL_REVIEW_OPEN' };
  const compatibilityRules = [
    ['ACTOR_IDENTITY', 'Univers + identifiant exact ; adversaires sans id : univers + nom exact, selon wardrobeActorKey.', 'src/game/wardrobe.js'],
    ['CATALOG_IDENTITY', 'Une ligne par catalogue + univers + id ; projections et dérivés restent distincts avec leurs liens explicites.', 'src/game/battleItems.js'],
    ['NO_CANON_BY_UNIVERSE', 'Univers partagé, sourceOwner textuel et nom semblable ne prouvent pas une dotation d’incarnation.', 'src/game/heroes.js'],
    ['RUNTIME_RELIC_ASSIGNMENT', 'proposeRelicAssignment trie les objets possédés par bonus sans contrainte de franchise ; compatibilité ludique et canon restent distincts.', 'src/game/squadPreparation.js'],
    ['DEFAULT_SAVE', `Inventaire initial : ${initialLoadout.inventory.join(', ')}. ${defaultAssignments.length} affectation(s) d’équipement non nulle(s). Aucune sauvegarde de joueur lue.`, 'src/App.jsx'],
    ['RENDER_ALIAS', 'weaponType peut être un alias technique ou une description copiée ; ce champ n’est jamais une certification de modèle.', 'src/game/canonRosterPackFactory.js'],
    ['CLAIMS_VS_APPROVAL', 'Prompts, descriptions et tags canon-reference sont des déclarations conservées, pas une validation indépendante.', 'src/game/loreItemOverrides.js'],
    ['ASSET_TREE', 'Chemins résolus par spriteAssets.js et présence contrôlée dans l’arbre Git complet, sans inspection des pixels.', 'src/game/spriteAssets.js']
  ].map(([rule, detail, sourcePath]) => ({ rule, detail, sourcePath, sourceUrl: url(sourceCommit, sourcePath) }));
  if (sourceDigest !== digest(runtimeCatalogs())) throw new Error('Export mutated runtime catalogs.');
  if (digest(sourceFiles) !== digest(validateSources(tree))) throw new Error('Sources changed during export.');
  return { metadata: { sourceCommit, asOfDate, sourceDigest, sourceFiles, actorKeyFormat: 'JSON [universe, id:ID or name:NAME]',
    limitations: ['Acteurs actifs et cinq catalogues résolus ; pas tous les objets absents des œuvres.', 'Catégories matérielles issues d’un triage explicite ; recherche externe et revue visuelle restent ouvertes.', 'Statistiques et effets de combat sont des adaptations du projet.', 'Les références déclarées ne sont pas revalidées sur le Web par cet export.'] },
    summary, compatibilityRules, initialLoadout, defaultAssignments, actors, items, associations, gaps };
}

export function csvCell(value) {
  let s = Array.isArray(value) ? value.join(' | ') : value && typeof value === 'object' ? JSON.stringify(value) : String(value ?? '');
  const first = [...s].find(char => char.charCodeAt(0) > 31 && !/\s/.test(char));
  if (first && '=+@-'.includes(first)) s = `'${s}`;
  return `"${s.replaceAll('"', '""')}"`;
}
const csv = (rows, keys) => '\uFEFF' + [keys, ...rows.map(row => keys.map(key => row[key]))].map(row => row.map(csvCell).join(';')).join('\r\n') + '\r\n';

export function writeEquipmentInventory(out, data) {
  fs.mkdirSync(out, { recursive: true });
  const json = (name, value) => fs.writeFileSync(path.join(out, name), JSON.stringify(value, null, 2) + '\n');
  json('equipment-workbook-data.json', data); json('summary.json', data.summary);
  for (const [name, rows, keys] of [
    ['actors.csv', data.actors, ['actorKey', 'actorId', 'actorName', 'universe', 'kind', 'sourceScope', 'incarnation', 'incarnationEvidence', 'weaponTypeAlias', 'weaponField', 'weaponFieldKind', 'declaredEquipment', 'sourceProps', 'signatureName', 'referenceUrls', 'equipmentStatus', 'associationCount', 'gapCount', 'sourceUrl']],
    ['items.csv', data.items, ['itemKey', 'catalog', 'itemId', 'itemName', 'itemNameEn', 'universe', 'nature', 'natureBasis', 'slot', 'role', 'tier', 'sourceOwner', 'incarnation', 'canonicalItemId', 'sourceItemId', 'linkedItemKeys', 'catalogPeerKeys', 'description', 'visualAnchor', 'referenceUrls', 'iconPath', 'iconStatus', 'iconBlob', 'boost', 'cost', 'tokenCost', 'gameplayPolicy', 'defaultKitPolicy', 'sourceUrl', 'fidelityStatus']],
    ['associations.csv', data.associations, ['associationKey', 'actorKey', 'actorName', 'universe', 'incarnation', 'itemKey', 'label', 'relationship', 'nature', 'evidenceField', 'evidence', 'referenceUrls', 'sourceUrl', 'fidelityStatus']],
    ['gaps.csv', data.gaps, ['gapKey', 'entityType', 'entityKey', 'actorName', 'itemName', 'universe', 'kind', 'priority', 'status', 'evidence', 'action', 'sourceUrl']]
  ]) fs.writeFileSync(path.join(out, name), csv(rows, keys));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [out, sourceCommit, suppliedTree, asOfDate] = process.argv.slice(2);
  if (!out || !sourceCommit) throw new Error('Usage: exportEquipmentWorkbookData.mjs OUT_DIR SOURCE_COMMIT [TREE_JSON] [YYYY-MM-DD]');
  const data = buildEquipmentInventory(sourceCommit, suppliedTree, asOfDate);
  writeEquipmentInventory(path.resolve(out), data); console.log(JSON.stringify(data.summary, null, 2));
}
