import { build } from 'vite';
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const baseline = process.argv.includes('--baseline');
const revision = '98991b161d0116dd9fa8d52d42f2337a243f2091';
const paths = ['src/game/combat/presentationCatalog.js', 'src/game/engineFighter.js', 'src/game/engineSmash.js'];
const sources = new Map(paths.map(file => [path.join(root, file), baseline
  ? execFileSync('git', ['show', `${revision}:${file}`], { cwd: root, encoding: 'utf8' })
  : readFileSync(path.join(root, file), 'utf8')]));
const pins = paths.map(file => ({ path: file, sha256: createHash('sha256').update(sources.get(path.join(root, file))).digest('hex') }));
const label = baseline ? 'before' : 'after';
await build({ root, configFile: false, publicDir: false,
  plugins: baseline ? [{ name: 'exact-prior-presentation-sources', enforce: 'pre',
    load(id) { return sources.get(id.split('?')[0]) || null; } }] : [],
  build: { outDir: `/tmp/multiverse-revan-presentation-${label}`, emptyOutDir: true,
    rollupOptions: { input: path.join(root, 'scripts/fixtures/reviewed-revan-presentation.html') } }
});
writeFileSync(new URL(`./validation/${label}-bundle.json`, import.meta.url), JSON.stringify({
  baseline, priorRevision: revision, sourcePins: pins,
  scope: baseline ? 'Same QA harness and on-disk media; three exact Git9899 presentation/engine modules replace their current versions. Not a complete archived application build.'
    : 'Real current Fighter and Smash engine/rendering modules; no public-media copy or global prebuild.'
}, null, 2) + '\n');
