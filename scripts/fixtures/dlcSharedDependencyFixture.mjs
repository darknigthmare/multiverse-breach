import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseSync } from 'rolldown/utils';

const REPO = fileURLToPath(new URL('../../', import.meta.url));
const original = file => readFileSync(path.join(REPO, file), 'utf8');
function sourceDeclaration(file, name) {
  const source = original(file), program = parseSync(file, source, { lang: 'js' }).program;
  for (const item of program.body) {
    const node = item.type === 'ExportNamedDeclaration' ? item.declaration : item;
    if (node?.type === 'FunctionDeclaration' && node.id?.name === name) return source.slice(item.start, item.end);
    if (node?.type === 'VariableDeclaration' && node.declarations.some(value => value.id?.name === name)) return source.slice(item.start, item.end);
    if (name === 'registry-extension' && item.type === 'ExpressionStatement'
      && source.slice(item.start, item.end).startsWith('Object.entries(FEATURED_BACKDROPS)')) return source.slice(item.start, item.end);
  }
  throw new Error('Missing real fixture declaration: ' + name);
}

/** Small media fixture; resolver functions and the three DLC factories are real source. */
export function createSharedDependencyFixture(t) {
  const parent = mkdtempSync(path.join(tmpdir(), 'mb-shared-dependency-'));
  t.after(() => rmSync(parent, { recursive: true, force: true }));
  const root = path.join(parent, 'source');
  mkdirSync(root);
  const write = (file, bytes) => {
    mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    writeFileSync(path.join(root, file), bytes);
  };
  const json = (file, value) => write(file, JSON.stringify(value, null, 2) + '\n');
  const manifests = ['Alien', 'Aliens', 'Halo'].map((universe, catalogOrder) => ({
    schemaVersion: 1, id: universe.toLowerCase(), universe, directory: 'DLC/' + universe,
    registration: 'runtime', catalogOrder, assetManifest: 'assets.json',
    modules: [{ path: 'data/renderer.js', runtimeAdapter: 'src/game/renderer.js' }],
  }));
  const alienBackdrop = '/backgrounds/alien-smash-openai.png';
  const haloBackdrop = '/backgrounds/halo-tactics-openai.png';
  for (const manifest of manifests) {
    json(manifest.directory + '/manifest.json', manifest);
    write(manifest.directory + '/data/renderer.js', original(manifest.directory + '/data/renderer.js'));
    write(manifest.directory + '/index.js', "export * as renderer from './data/renderer.js';\n");
    const asset = { sourcePath: manifest.directory + '/assets/images/' + manifest.id + '.bin', publicPath: '/images/' + manifest.id + '.bin' };
    json(manifest.directory + '/assets.json', { schemaVersion: 1, universe: manifest.universe, assets: [asset],
      sharedDependencies: [manifest.id === 'halo' ? haloBackdrop : alienBackdrop] });
    write(asset.sourcePath, Buffer.from([0, 255, manifest.catalogOrder]));
  }
  write('DLC/index.js', 'export const DLC_PACK_MANIFESTS = ' + JSON.stringify(manifests) + ';\n');
  json('DLC/content-identities.json', { schemaVersion: 1, indexes: {} });
  json('DLC/distribution.json', { schemaVersion: 1, mode: 'all', packIds: [], sharedPolicy: 'preserve-all' });
  json('DLC/shared-asset-dependencies.json', { schemaVersion: 1,
    assets: [{ publicPath: alienBackdrop, family: 'openai-backdrop', packIds: ['alien', 'aliens'] }] });
  json('DLC/shared-assets.json', { schemaVersion: 1,
    assets: [alienBackdrop, haloBackdrop, '/common.bin'].map(publicPath => ({ publicPath, sourcePath: 'public' + publicPath })) });
  for (const [index, url] of [alienBackdrop, haloBackdrop, '/common.bin'].entries()) write('public' + url, Buffer.alloc(128 + index, index + 17));
  write('src/game/renderer.js', [
    "import * as dlcAlien from '../../DLC/Alien/data/renderer.js';",
    "import * as dlcAliens from '../../DLC/Aliens/data/renderer.js';",
    "import * as dlcHalo from '../../DLC/Halo/data/renderer.js';",
    "import { getGeneratedStageBackdropSrc } from './generatedStageAssets.js';",
    'const FEATURED_BACKDROPS = {};',
    'export const OPENAI_BACKDROPS = { RPG: {}, Tactics: { Halo: dlcHalo.createOpenaiBackdropsTactics() },',
    '  Smash: { Alien: dlcAlien.createOpenaiBackdropsSmash(), Aliens: dlcAliens.createOpenaiBackdropsSmash() } };',
    sourceDeclaration('src/game/renderer.js', 'registry-extension'),
    sourceDeclaration('src/game/renderer.js', 'getOpenAiBackdropSrc'),
  ].join('\n') + '\n');
  write('src/game/stageLoreProfiles.js', 'const MODE_SPECS = {};\n' + sourceDeclaration('src/game/stageLoreProfiles.js', 'buildModes') + '\n');
  write('src/game/generatedStageAssets.js', original('src/game/generatedStageAssets.js'));
  json('src/game/generatedStageAssets.json', { byProfile: {} });
  write('src/game/dlcInstallation.js', original('src/game/dlcInstallation.js'));
  write('src/App.jsx', "import { getInstalledDlcPackIds } from './game/dlcInstallation.js';\nexport default function App(){return <main>{getInstalledDlcPackIds().length}</main>;}\n");
  write('src/components/Intro.jsx', 'export const intro = <img src="' + haloBackdrop + '" />;\n');
  json('package.json', { name: 'shared-dependency-fixture', type: 'module', private: true });
  write('index.html', '<main id="root"></main>');
  return { root, parent, manifests, write, json, alienBackdrop, haloBackdrop };
}
