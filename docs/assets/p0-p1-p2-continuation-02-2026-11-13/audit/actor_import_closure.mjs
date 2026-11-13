/** Parse literal transitive imports without executing/exporting the actor graph. */
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { isBuiltin } from 'node:module';
import { gzipSync, gunzipSync } from 'node:zlib';
import { parseAst } from 'rolldown/parseAst';
const [snapshotArg, outputArg] = process.argv.slice(2);
if (!snapshotArg || !outputArg) throw new Error('Usage: actor_import_closure.mjs SOURCE_SNAPSHOT OUTPUT_JSON');
const root = path.resolve(snapshotArg), output = path.resolve(outputArg);
if (fs.existsSync(output)) throw new Error('Use a new receipt path.');
const entries = ['scripts/exportActorFidelityBacklog.mjs', 'src/game/heroes.js', 'src/game/enemies.js',
  'src/game/playerHero.js', 'src/game/combatIdentity.js', 'src/game/signatureSourceKits.js',
  'src/game/rpgTargeting.js', 'src/game/wardrobe.js', 'src/game/canonRosterWave.js'];
const visited = new Set(), pending = [...entries], edges = [], external = new Set(), unresolved = [];
const walk = (value, visit) => {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) { for (const item of value) walk(item, visit); return; }
  visit(value);
  for (const [key, item] of Object.entries(value)) if (!['loc', 'range', 'start', 'end'].includes(key)) walk(item, visit);
};
const reference = (from, value, kind) => {
  if (typeof value !== 'string') { unresolved.push({ from, kind, reason: 'non-literal-module-reference' }); return; }
  if (isBuiltin(value)) { external.add(value); return; }
  if (!value.startsWith('.')) { unresolved.push({ from, kind, specifier: value, reason: 'non-relative-nonbuiltin-reference' }); return; }
  const base = path.resolve(root, path.dirname(from), value.split(/[?#]/, 1)[0]);
  const candidates = path.extname(base) ? [base] : [base, base + '.js'];
  const resolved = candidates.find(file => fs.existsSync(file) && fs.statSync(file).isFile());
  if (!resolved || !resolved.startsWith(root + path.sep)) {
    unresolved.push({ from, kind, specifier: value, reason: 'unresolved-or-outside-snapshot' }); return;
  }
  const target = path.relative(root, resolved);
  edges.push({ from, to: target, kind });
  pending.push(target);
};
while (pending.length) {
  const relative = pending.pop();
  if (visited.has(relative)) continue;
  visited.add(relative);
  const file = path.join(root, relative);
  if (!fs.existsSync(file)) { unresolved.push({ from: relative, reason: 'missing-entry' }); continue; }
  if (relative.endsWith('.json')) continue; // Provenance strings are not imports.
  if (!/\.(?:[cm]?js|jsx|tsx?)$/.test(relative)) { unresolved.push({ from: relative, reason: 'unsupported-code-extension' }); continue; }
  const ast = parseAst(fs.readFileSync(file, 'utf8'), { lang: /\.[jt]sx$/.test(relative) ? 'jsx' : 'js' });
  walk(ast, node => {
    if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source)
      reference(relative, node.source.value, node.type);
    else if (node.type === 'ImportExpression') reference(relative, node.source?.value, node.type);
    else if (node.type === 'CallExpression' && node.callee?.type === 'Identifier' && node.callee.name === 'require')
      reference(relative, node.arguments?.[0]?.value, 'require');
    else if (node.type === 'CallExpression' && node.callee?.type === 'MemberExpression'
      && node.callee.object?.type === 'MetaProperty' && node.callee.property?.name === 'glob')
      unresolved.push({ from: relative, reason: 'import-meta-glob-needs-separate-resolution' });
  });
}
const target = 'src/game/extinctionFighterProfiles.js';
const payload = Buffer.from(JSON.stringify({ entries, modules: [...visited].sort(), edges }, null, 0) + '\n');
const encoded = gzipSync(payload, { level: 9 });
if (!gunzipSync(encoded).equals(payload)) throw new Error('Closure retention mismatch.');
const archive = output.replace(/\.json$/, '') + '-graph.json.gz';
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(archive, encoded);
const hash = data => createHash('sha256').update(data).digest('hex');
const report = { scope: 'Closed literal transitive module graph of the actual actor exporter and native cohort resolvers, parsed from the immutable source snapshot. No module execution, media decode or second export.',
  sourceSnapshot: root, entries, modules: visited.size, importEdges: edges.length,
  externalBuiltinModules: [...external].sort(), unresolvedReferences: unresolved,
  fpsConsumer: target, fpsConsumerImported: visited.has(target),
  closureComplete: unresolved.length === 0, graphArchive: path.basename(archive),
  graphOriginalSha256: hash(payload), graphGzipSha256: hash(encoded),
  scriptSha256: hash(fs.readFileSync(new URL(import.meta.url))), mediaCopiedOrHydrated: 0 };
fs.writeFileSync(output, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify({ modules: report.modules, importEdges: report.importEdges, unresolved: unresolved.length, fpsConsumerImported: report.fpsConsumerImported }));
if (!report.closureComplete || report.fpsConsumerImported) process.exitCode = 1;
