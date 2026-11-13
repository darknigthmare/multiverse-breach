/** Scoped runtime probes only. Keys are supplied explicitly; no identity aliases. */
import fs from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const [sourceRoot, keyFile, output] = process.argv.slice(2);
if (!sourceRoot || !keyFile || !output) throw new Error('Usage: inspect_actor_lot.mjs SOURCE_ROOT KEYS.json OUTPUT.json');
const keys = JSON.parse(fs.readFileSync(keyFile, 'utf8'));
if (!Array.isArray(keys) || keys.some(key => typeof key !== 'string') || new Set(keys).size !== keys.length) throw new Error('Distinct exact actor keys required.');
const load = file => import(pathToFileURL(path.join(sourceRoot, file)).href);
const { HEROES_DB } = await load('src/game/heroes.js');
const { ENEMIES_DB } = await load('src/game/enemies.js');
const { createPlayerHero } = await load('src/game/playerHero.js');
const { wardrobeActorKey } = await load('src/game/wardrobe.js');
const { resolveCombatAbility, resolveUniverseSummon } = await load('src/game/combatIdentity.js');
const { prepareSourceSignature } = await load('src/game/signatureSourceKits.js');
const { getRpgCombatantAbility, getRpgActionProfile } = await load('src/game/rpgTargeting.js');
const { CANON_ROSTER_WAVE } = await load('src/game/canonRosterWave.js');
const { buildActorFidelityBacklog, indexActorContinuities } = await load('src/game/actorFidelityBacklog.js');
const continuityIndex = indexActorContinuities(CANON_ROSTER_WAVE);
const clone = value => Array.isArray(value) ? value.map(clone) : value && typeof value === 'object'
  ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)])) : value;
const actors = [createPlayerHero(), ...HEROES_DB].map(actor => ({ actor, kind: 'hero' }));
for (const [universe, roster] of Object.entries(ENEMIES_DB)) for (const [field, kind] of [['monsters', 'enemy'], ['bosses', 'boss'], ['worldBoss', 'worldBoss']]) {
  for (const actor of field === 'worldBoss' ? (roster[field] ? [roster[field]] : []) : roster[field] || []) actors.push({ actor: { ...actor, universe: actor.universe || universe }, kind });
}
const indexed = new Map(actors.map(row => [wardrobeActorKey(row.actor), row]));
if (indexed.size !== actors.length) throw new Error('Runtime actor identity collision.');
const rows = keys.map(actorKey => {
  const row = indexed.get(actorKey);
  if (!row) throw new Error('Missing exact runtime identity: ' + actorKey);
  const { actor, kind } = row;
  const sourceFindings = buildActorFidelityBacklog(actor, { kind, continuityIndex });
  const prepared = clone(actor), signature = prepareSourceSignature(prepared);
  const probe = target => Object.fromEntries(['simple', 'secondary', 'defense', 'special'].map(slot => [slot, {
    raw: target[slot] || null, combat: resolveCombatAbility(target, slot), rpgAbility: getRpgCombatantAbility(target, slot),
    rpgProfile: getRpgActionProfile(target, slot, kind === 'hero' ? 'player' : 'enemy')
  }]));
  return { actorKey, actorId: actor.id || '', name: actor.name, universe: actor.universe, kind,
    actor: clone(actor),
    metadata: { incarnation: actor.incarnation || actor.sourceIncarnation || '', referenceUrl: actor.referenceUrl || '',
      visualAnchor: actor.visualAnchor || '', continuity: actor.continuity || null, canonStatus: actor.canonStatus || '', equipment: actor.equipment || null },
    unprepared: probe(actor), prepared: probe(prepared), selectedLegacySignature: signature,
    summon: resolveUniverseSummon(prepared),
    sourceClassification: { incarnation: sourceFindings.incarnation, incarnationEvidence: sourceFindings.incarnationEvidence,
      scope: 'Source fields only; this probe does not inspect or reclassify raster availability.',
      findings: sourceFindings.tasks.filter(task => /CONTINUITY_PRECISION|INCARNATION_|VISUAL_CONTRACT_|REFERENCE_(MISSING|SCENE_REVIEW)|GENERIC_TECHNIQUE_NAMES/.test(task.code)).map(task => ({ code: task.code, priority: task.priority })) },
    artApproved: false, source1to1Verified: false };
});
fs.mkdirSync(path.dirname(output), { recursive: true });
const encodeNumbers = (_key, value) => typeof value === 'number' && !Number.isFinite(value)
  ? { $auditNumber: String(value) } : value;
fs.writeFileSync(output, gzipSync(JSON.stringify({ scope: 'Read-only exact-identity source/runtime probes; no visual or complete gameplay approval.',
  probeScriptSha256: createHash('sha256').update(fs.readFileSync(new URL(import.meta.url))).digest('hex'),
  numericEncoding: 'Non-finite numbers are explicitly tagged; Infinity, -Infinity and NaN are never collapsed into JSON null.', rows }, encodeNumbers, 2) + '\n'));
console.log(JSON.stringify({ actors: rows.length, artApprovals: 0, source1to1Verified: false }));
