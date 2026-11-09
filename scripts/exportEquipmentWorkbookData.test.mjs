/**
 * Regression tests reconstructed after workspace maintenance on 2026-10-26.
 * The exporter itself was recovered byte-for-byte. This suite retains the
 * seventeen documented checks; it does not claim to restore the lost test file.
 * Run after an export, passing EQUIPMENT_INVENTORY_JSON to that JSON snapshot.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import {
  classifyEquipmentLabel, classifyWeaponField, safeReferences,
  inspectItemAsset, readShopRows, readInitialLoadout, csvCell,
} from './exportEquipmentWorkbookData.mjs';
import { HEROES_DB, EQUIP_ITEMS_DB, EVENT_ITEMS_DB } from '../src/game/heroes.js';
import { ENEMIES_DB } from '../src/game/enemies.js';
import { createPlayerHero } from '../src/game/playerHero.js';
import { wardrobeActorKey } from '../src/game/wardrobe.js';
import { BATTLE_ITEM_CATALOG } from '../src/game/battleItems.js';
import { SPECIAL_EVENT_REWARD_ITEMS } from '../src/game/specialEvents.js';
import { EXPANDED_EVENT_SHOP_ITEMS } from '../src/game/expandedUniverses.js';
import { resolveSourceSignature } from '../src/game/signatureSourceKits.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const snapshot = process.env.EQUIPMENT_INVENTORY_JSON;
assert.ok(snapshot, 'Export first and set EQUIPMENT_INVENTORY_JSON to its equipment-workbook-data.json.');
const inventory = JSON.parse(fs.readFileSync(snapshot, 'utf8'));
const { actors, items, associations, gaps, summary } = inventory;
const actorMap = new Map(actors.map(row => [row.actorKey, row]));
const itemMap = new Map(items.map(row => [row.itemKey, row]));
const nature = (label, options) => classifyEquipmentLabel(label, options).nature;
const item = (universe, id) => items.find(row => row.catalog === 'EQUIPMENT' && row.universe === universe && row.itemId === id);
const actor = id => actors.find(row => row.actorId === id);
const rawActors = [createPlayerHero(), ...HEROES_DB];
for (const [universe, roster] of Object.entries(ENEMIES_DB)) {
  for (const row of [...(roster.monsters || []), ...(roster.bosses || []), ...(roster.worldBoss ? [roster.worldBoss] : [])]) {
    rawActors.push({ ...row, universe: row.universe || universe });
  }
}

test('anatomy, natural powers, and creatures in equipment remain non-gear', () => {
  for (const label of ['Inner jaw', 'Bladed tail', 'Bare fists', 'Cybernetic spider body']) {
    assert.equal(nature(label), 'ANATOMIE_OU_PROTHESE', label);
  }
  for (const label of ['Starbolts', 'Mystical powers', 'Plague aura']) {
    assert.equal(nature(label), 'POUVOIR_OU_INFORMATION', label);
  }
  assert.equal(nature('Kryll swarm'), 'INVOCATION_OU_RENFORT');
});

test('summon and event identity override a weapon-like displayed name', () => {
  assert.equal(nature('Sword', { tier: 'summon' }), 'INVOCATION_OU_RENFORT');
  assert.equal(nature('Rifle', { tier: 'ultimate' }), 'EVENEMENT_OU_ATTAQUE');
  assert.equal(nature('Cannon', { isCombatEvent: true }), 'EVENEMENT_OU_ATTAQUE');
  for (const row of items.filter(row => row.tier === 'summon')) assert.equal(row.nature, 'INVOCATION_OU_RENFORT');
  for (const row of items.filter(row => row.catalog === 'EVENT' || row.tier === 'ultimate')) assert.equal(row.nature, 'EVENEMENT_OU_ATTAQUE');
});

test('scene props, clothing, original designs, and unknown materiality stay separate', () => {
  assert.equal(nature('Rifle', { field: 'sourceProps' }), 'OBJET_DE_SCENE');
  assert.equal(nature('Black Jedi Duel Outfit'), 'TENUE_OU_ACCESSOIRE');
  assert.equal(nature('Unidentified nexus feature', { sourceOriginal: true }), 'DESIGN_ORIGINAL_A_PRECISER');
  assert.equal(nature('Unidentified feature'), 'NATURE_A_DETERMINER');
  assert.equal(nature('Caterpillar P-5000 power loader'), 'MACHINE_OU_VEHICULE');
});

test('holsters and magazines are distinct from their weapons; plural blades and suits remain recognizable', () => {
  for (const label of ['Blaster holster', 'Pistol holsters', 'Sword sheath', 'Weapon sling']) assert.equal(nature(label), 'PROTECTION_OU_EQUIPEMENT', label);
  for (const label of ['Rifle magazine', 'Pistol rounds', 'Blaster cartridges']) assert.equal(nature(label), 'OBJET_OU_CONSOMMABLE_NOMME', label);
  for (const label of ['Wrist blades', 'Knives', 'Pulse rifles']) assert.equal(nature(label), 'ARME_OU_OUTIL_NOMME', label);
  assert.equal(nature('HEV Mark V suit'), 'PROTECTION_OU_EQUIPEMENT');
  assert.equal(nature('Round Glasses'), 'PROTECTION_OU_EQUIPEMENT');
  assert.equal(nature('Round Table Dossier'), 'NATURE_A_DETERMINER');
});

test('render aliases do not erase multiword descriptions copied into weaponType', () => {
  for (const value of ['gun', 'laser', 'slash', 'my_alias_2']) assert.equal(classifyWeaponField(value), 'ALIAS_MOTEUR');
  for (const value of ['neutrophil knife', 'oxygen delivery box', 'HEV Mark V suit']) assert.equal(classifyWeaponField(value), 'LIBELLE_DECLARE_A_REVOIR');
  assert.equal(classifyWeaponField(''), 'ABSENT');
  assert.equal(classifyWeaponField('Example Origin Burst'), 'ACTION_GENERIQUE');
  const copied = actors.filter(row => row.weaponField === row.weaponTypeAlias && /\s/.test(row.weaponField) && row.weaponFieldKind === 'LIBELLE_DECLARE_A_REVOIR');
  assert.ok(copied.length > 0, 'Factory-copied descriptions remain represented.');
  for (const row of copied) assert.ok(associations.some(link => link.actorKey === row.actorKey && link.evidenceField === 'weapon' && link.label === row.weaponField));
});

test('references accept HTTPS sources only and reject credentials or executable protocols', () => {
  assert.deepEqual(safeReferences(['https://example.com/a', ['https://example.com/a', 'https://example.com/b'], null, 'http://example.com', 'javascript:alert(1)', 'file:///tmp/x', 'https://name:secret@example.com', 'https://name@example.com', 'invalid']), ['https://example.com/a', 'https://example.com/b']);
  for (const row of [...actors, ...items, ...associations]) assert.deepEqual(row.referenceUrls, safeReferences(row.referenceUrls));
});

test('asset membership uses the full supplied Git tree without probing sparse media', () => {
  const sha = 'a'.repeat(40);
  const tree = new Map([['public/sprites/example.png', { sha, size: 123 }]]);
  assert.deepEqual(inspectItemAsset('/sprites/example.png?version=1#x', tree), { iconPath: '/sprites/example.png', iconStatus: 'PRESENT_DANS_GIT', iconBlob: sha, iconBytes: 123 });
  assert.equal(inspectItemAsset('/sprites/absent.png', tree).iconStatus, 'ABSENT_DANS_GIT');
  assert.equal(inspectItemAsset('', tree).iconStatus, 'NON_RESOLU');
  for (const value of ['/sprites/../example.png', '/sprites/%2e%2e/example.png', '/sprites\\example.png', '/bad%zz']) assert.equal(inspectItemAsset(value, tree).iconStatus, 'CHEMIN_INVALIDE');
  for (const value of ['https://example.com/a.png', '//example.com/a.png', 'relative.png']) assert.equal(inspectItemAsset(value, tree).iconStatus, 'EXTERNE_OU_NON_PRIS_EN_CHARGE');
});

test('shop parser keeps static projections and rejects unrecognized source shapes', () => {
  const source = fs.readFileSync(path.join(ROOT, 'src/components/HubScreen.jsx'), 'utf8');
  const rows = readShopRows(source);
  assert.equal(rows.length, EXPANDED_EVENT_SHOP_ITEMS.length + 7);
  assert.equal(rows.filter(row => row.staticProjection).length, 7);
  assert.ok(rows.every(row => row.projectionData.id === row.row.id && row.row.universe));
  assert.deepEqual(rows.map(row => [row.row.universe, row.row.id]).sort(), items.filter(row => row.catalog === 'SHOP').map(row => [row.universe, row.itemId]).sort());
  assert.throws(() => readShopRows('const EVENT_SHOP_ITEMS = [];'), /source shape changed/);
  assert.throws(() => readShopRows(source.replace('...EXPANDED_EVENT_SHOP_ITEMS', '')), /source shape changed/);
});

test('inventory ownership does not become a default equipped assignment', () => {
  const source = fs.readFileSync(path.join(ROOT, 'src/App.jsx'), 'utf8');
  const initial = readInitialLoadout(source);
  assert.deepEqual(initial, inventory.initialLoadout);
  assert.deepEqual(initial.inventory, ['nexus_anchor_coil']);
  assert.ok(Object.values(initial.equippedGear).every(value => value === null));
  assert.ok(Object.values(initial.equippedEventItems).every(value => value === null));
  assert.deepEqual(inventory.defaultAssignments, []);
  assert.equal(summary.actualUserSaveRead, false);
  assert.throws(() => readInitialLoadout(''), /DEFAULT_SAVE not found/);
});

test('actor keys preserve adversaries without IDs and different incarnations', () => {
  const first = wardrobeActorKey({ universe: 'A', name: 'Guard' });
  const second = wardrobeActorKey({ universe: 'B', name: 'Guard' });
  assert.notEqual(first, second);
  assert.deepEqual(JSON.parse(first), ['A', 'name:Guard']);
  assert.deepEqual(JSON.parse(wardrobeActorKey({ universe: 'A', id: 'guard', name: 'Guard' })), ['A', 'id:guard']);
  assert.equal(actors.filter(row => !row.actorId).length, 1885);
  assert.notEqual(actor('ripley').actorKey, actor('ripley_aliens').actorKey);
  assert.match(actor('ripley').incarnation, /1979/);
  assert.match(actor('ripley_aliens').incarnation, /1986/);
  assert.ok(!actor('ripley').declaredEquipment.some(label => /M41A|M240|loader/i.test(label)));
  assert.ok(actor('ripley_aliens').declaredEquipment.some(label => /P-5000/.test(label)));
  assert.match(actor('freeman').incarnation, /Half-Life 2/);
});

test('CSV escapes embedded quotes and formula prefixes while retaining Unicode', () => {
  assert.equal(csvCell('Épée "verte"; modèle\n2'), '"Épée ""verte""; modèle\n2"');
  for (const prefix of ['=', '+', '-', '@']) assert.equal(csvCell(` \t${prefix}SUM(A1)`), `"' \t${prefix}SUM(A1)"`);
  assert.equal(csvCell(['Épée', 'Armure']), '"Épée | Armure"');
  assert.equal(csvCell(null), '""');
  assert.equal(csvCell({ key: 1 }), '"{""key"":1}"');
});

test('export preserves every exact runtime actor and all registry cardinalities', () => {
  assert.deepEqual(actors.map(row => row.actorKey).sort(), rawActors.map(wardrobeActorKey).sort());
  assert.equal(summary.actors, 4936);
  assert.equal(summary.actorUniverses, 525);
  assert.deepEqual(summary.actorKinds, { boss: 1110, enemy: 1518, hero: 1912, worldBoss: 396 });
  assert.deepEqual(summary.catalogs, { BATTLE: BATTLE_ITEM_CATALOG.length, EQUIPMENT: EQUIP_ITEMS_DB.length, EVENT: Object.keys(EVENT_ITEMS_DB).length, SEASON_REWARD: SPECIAL_EVENT_REWARD_ITEMS.length, SHOP: EXPANDED_EVENT_SHOP_ITEMS.length + 7 });
  assert.equal(items.length, 5241);
  assert.equal(summary.actorsWithDeclaredEquipment, 54);
  assert.equal(summary.declaredEquipmentEntries, 141);
  assert.equal(associations.length, 1500);
  assert.equal(gaps.length, 28304);
  assert.equal(actors.filter(row => row.nonCombat).length, 101);
  assert.equal(summary.distinctPhysicalObjects, null);
  assert.equal(summary.catalogRecordsAreNotDistinctPhysicalObjects, true);
});

test('sourceOwner and cross-incarnation exclusions create no fabricated assignment', () => {
  assert.ok(associations.every(row => row.itemKey === '' && row.catalogBindingStatus === 'AUCUN_ID_OBJET_EXPLICITE'));
  assert.ok(actor('luke').declaredEquipment.some(label => /Green Lightsaber/.test(label)));
  assert.equal(item('Star Wars', 'blue_saber').gameplayPolicy.replacesHeroWeapon, false);
  assert.match(actor('joker_n52').incarnation, /Endgame/);
  assert.equal(item('Joker New 52', 'joker_face_mask').defaultKitPolicy, 'not-part-of-endgame-joker');
  assert.ok(!actor('joker_n52').declaredEquipment.some(label => /mask|face/i.test(label)));
  const ray = item('Minions', 'minions_fart_gun');
  assert.equal(ray.sourceOwner, 'Young Gru');
  assert.equal(ray.canonicalItemId, 'gru_freeze_ray_minions_2015');
  assert.equal(ray.gameplayPolicy.hasRuntimeFreeze, false);
  assert.ok(!associations.some(row => row.universe === 'Minions' && /freeze ray|rayon gelant/i.test(row.label)));
  assert.equal(gaps.filter(row => row.kind === 'PORTEUR_TEXTE_NON_LIE').length, 3);
  assert.equal(gaps.filter(row => row.kind === 'EXCLUSION_DOTATION_A_CONSERVER').length, 1);
});

test('sourceItemId resolves only explicit same-universe catalog IDs', () => {
  const sourceLinks = items.filter(row => row.sourceItemId);
  assert.ok(sourceLinks.length > 0);
  for (const row of sourceLinks) {
    const expected = items.filter(target => target.universe === row.universe && target.itemId === row.sourceItemId && target.catalog !== 'BATTLE').map(target => target.itemKey).sort();
    assert.deepEqual([...row.linkedItemKeys].sort(), expected);
    assert.equal(row.sourceItemLinkStatus, expected.length ? 'ID_SOURCE_EXPLICITE' : 'ID_SOURCE_NON_RESOLU');
  }
  for (const row of items) for (const key of row.catalogPeerKeys) {
    const peer = itemMap.get(key);
    assert.ok(peer && peer.itemKey !== row.itemKey);
    assert.equal(peer.universe, row.universe);
    assert.equal(peer.itemId, row.itemId);
  }
  assert.equal(summary.unresolvedSourceItemLinks, 0);
});

test('resolved signatures are derived techniques, not newly equipped physical items', () => {
  const expected = rawActors.map(row => [wardrobeActorKey(row), resolveSourceSignature(row)]).filter(([, signature]) => signature);
  const actual = associations.filter(row => row.relationship === 'TECHNIQUE_SIGNEE_NON_EQUIPEMENT');
  assert.equal(expected.length, 124);
  assert.equal(actual.length, expected.length);
  for (const [key, signature] of expected) {
    const row = actual.find(link => link.actorKey === key);
    assert.ok(row);
    assert.equal(row.label, signature.name);
    assert.equal(row.itemKey, '');
    assert.equal(row.evidenceField, 'sourceSignature');
    assert.match(row.evidence, /^resolveSourceSignature\(/);
    assert.equal(row.nature, signature.kind === 'summon' ? 'INVOCATION_OU_RENFORT' : 'TECHNIQUE_DE_COMBAT');
  }
  for (const [id, name] of [['irvine_ff8', 'Quick Shot'], ['laguna_ff8', 'Desperado'], ['seifer_ff8', 'No Mercy'], ['zell_ff8', 'My Final Heaven']]) assert.equal(actor(id).signatureName, name);
});

test('all relationships and gaps point to real rows and never award 1:1 approval', () => {
  for (const [rows, key] of [[actors, 'actorKey'], [items, 'itemKey'], [associations, 'associationKey'], [gaps, 'gapKey']]) {
    assert.equal(new Set(rows.map(row => row[key])).size, rows.length);
    assert.ok(rows.every(row => row[key]));
  }
  for (const row of associations) assert.ok(actorMap.has(row.actorKey));
  for (const row of gaps) {
    assert.ok((row.entityType === 'actor' ? actorMap : itemMap).has(row.entityKey));
    assert.equal(row.status, 'OUVERT');
  }
  const associationCounts = new Map();
  const gapCounts = new Map();
  for (const row of associations) associationCounts.set(row.actorKey, (associationCounts.get(row.actorKey) || 0) + 1);
  for (const row of gaps.filter(row => row.entityType === 'actor')) gapCounts.set(row.entityKey, (gapCounts.get(row.entityKey) || 0) + 1);
  for (const row of actors) {
    assert.equal(row.associationCount, associationCounts.get(row.actorKey) || 0);
    assert.equal(row.gapCount, gapCounts.get(row.actorKey) || 0);
  }
  for (const row of [...actors, ...items, ...associations]) assert.equal(row.canonicalFidelityApproved, false);
  assert.equal(summary.newArtApprovals, 0);
  assert.equal(summary.generatedSprites, 0);
});

test('original identities use internal design requirements and icon counts distinguish duplicate paths', () => {
  const originals = actors.filter(row => row.sourceScope === 'ORIGINAL_DESIGN');
  assert.equal(originals.length, 312);
  for (const row of originals) {
    for (const gap of gaps.filter(gap => gap.entityType === 'actor' && gap.entityKey === row.actorKey && ['INVENTAIRE_INDIVIDUEL_ABSENT', 'INCARNATION_NON_FIXEE', 'SOURCE_INDIVIDUELLE_ABSENTE'].includes(gap.kind))) assert.match(gap.action, /design interne/);
  }
  const missing = items.filter(row => row.iconStatus === 'ABSENT_DANS_GIT');
  assert.equal(missing.length, 1816);
  assert.equal(new Set(missing.map(row => row.iconPath)).size, 1184);
  assert.equal(new Set(items.map(row => row.iconPath)).size, 2755);
  assert.equal(inventory.metadata.sourceFiles.length, 213);
  for (const source of inventory.metadata.sourceFiles) {
    const bytes = fs.readFileSync(path.join(ROOT, source.path));
    const hash = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    assert.equal(hash, source.gitBlob, source.path);
  }
});
