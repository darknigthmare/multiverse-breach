/** Source-only actor graph: no local-image guesses and no artificial art closures. */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const [sourceRoot, output] = process.argv.slice(2);
if (!sourceRoot || !output) throw new Error('Usage: inspect_metadata_graph.mjs SOURCE_ROOT OUTPUT.json');
const load = file => import(pathToFileURL(path.join(sourceRoot, file)).href);
const { HEROES_DB } = await load('src/game/heroes.js');
const { ENEMIES_DB } = await load('src/game/enemies.js');
const { createPlayerHero } = await load('src/game/playerHero.js');
const { CANON_ROSTER_WAVE } = await load('src/game/canonRosterWave.js');
const { buildActorFidelityBacklog, indexActorContinuities } = await load('src/game/actorFidelityBacklog.js');
const continuityIndex = indexActorContinuities(CANON_ROSTER_WAVE);
const actors = [createPlayerHero(), ...HEROES_DB].map(actor => ({ actor, kind: 'hero' }));
for (const [universe, roster] of Object.entries(ENEMIES_DB)) for (const [field, kind] of [['monsters', 'enemy'], ['bosses', 'boss'], ['worldBoss', 'worldBoss']]) {
  for (const actor of field === 'worldBoss' ? (roster[field] ? [roster[field]] : []) : roster[field] || []) actors.push({ actor: { ...actor, universe: actor.universe || universe }, kind });
}
const rows = actors.map(({ actor, kind }) => {
  const row = buildActorFidelityBacklog(actor, { kind, continuityIndex });
  return { actorKey: row.actorKey, actorId: row.actorId, actorName: row.actorName, universe: row.universe, kind,
    incarnation: row.incarnation, incarnationEvidence: row.incarnationEvidence, declaredReference: row.declaredReference,
    visualAnchor: row.visualAnchor, techniques: row.techniques,
    tasks: row.tasks.filter(task => /CONTINUITY_PRECISION|INCARNATION_|VISUAL_CONTRACT_|REFERENCE_(MISSING|SCENE_REVIEW)|GENERIC_TECHNIQUE_NAMES/.test(task.code)).map(({ code, priority }) => ({ code, priority })),
    artApproved: false };
});
if (new Set(rows.map(row => row.actorKey)).size !== rows.length) throw new Error('Source actor identity collision.');
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ scope: 'Source-metadata findings only, using explicit input graph; not a replacement for the full Git-backed raster backlog.', actors: rows.length, rows, artApprovals: 0, source1to1Verified: false }, null, 2) + '\n');
console.log(JSON.stringify({ actors: rows.length, artApprovals: 0 }));
