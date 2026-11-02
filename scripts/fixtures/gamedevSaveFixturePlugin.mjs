import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Build a small persistence fixture from App's current closures. It deliberately
// separates snapshot loading from writer initialization so a second real page
// can write in between. No App persistence decisions are copied into the harness.
export default function createGamedevSaveFixturePlugin(root, {
  appPath = resolve(root, 'src/App.jsx'),
  guardPath = resolve(root, 'src/game/localSaveGuard.js')
} = {}) {
  const virtualId = 'virtual:gamedev-save-init';
  return {
    name: 'gamedev-save-initialization-fixture',
    resolveId(id) { if (id === virtualId) return '\0' + virtualId; },
    async load(id) {
      if (id !== '\0' + virtualId) return;
      const app = await readFile(appPath, 'utf8');
      const section = (start, end) => {
        const first = app.indexOf(start);
        const last = app.indexOf(end, first + start.length);
        if (first < 0 || last <= first) throw new Error(`Missing App save fixture boundary: ${start}`);
        return app.slice(first, last);
      };
      const load = section('const loadSave = () => {', 'const saveGame =');
      const save = section('const saveGame =', 'const appendUnique =');
      const initialize = section('  const [initialLoad] = useState(loadSave);', '  const [localSaveIssue, setLocalSaveIssue]');
      const persist = section('  const persistLocalSave = useCallback(payload => {', '  const rerollPortalRotation =');
      const apply = section('  const applySave = ', '  const exportSave =');
      const setters = [...new Set([...apply.matchAll(/\b(set[A-Z]\w+)\(/g)].map(match => match[1]))]
        .filter(name => name !== 'setLocalSaveIssue');
      return `
        import { createLocalSaveGuard } from ${JSON.stringify(guardPath)};
        import { readLocalSaveSnapshot, backupLocalSave, getSaveBackupKey } from '/src/game/saveRecovery.js';
        import { getBrowserStorage, readStorageValue, removeStorageValue } from '/src/game/safeStorage.js';
        export const SAVE_KEY = 'gamedev-browser-startup-save';
        export const BACKUP_KEY = getSaveBackupKey(SAVE_KEY);
        const LEGACY_KART_CAREER_KEY = 'gamedev-browser-startup-legacy';
        const DEFAULT_SAVE = { gold: 0, completedStages: [], unlockedHeroes: ['player_anchor'] };
        // Catalog migration is outside this fixture's scope. The real storage
        // parser, backup writer, optimistic guard and App persistence run below.
        const normalizeSavePayload = value => structuredClone(value);
        const migrateLegacyKartCareer = value => value;
        ${load}
        ${save}
        export const loadAppSave = loadSave;
        export function initializeAppSave(snapshot, onIssue) {
          // Supply the already-read snapshot and replace only React bookkeeping
          // and unrelated navigation. The rendered harness itself uses React.
          const useState = () => [snapshot];
          const useRef = value => ({ current: value });
          const useCallback = callback => callback;
          const setLocalSaveIssue = onIssue;
          const cloudSaveTimerRef = { current: null };
          const getCurrentSaveRef = { current: null };
          const battleGateRef = { current: { invalidate() {} } };
          const hubNavigationRef = { current: null };
          const battleOutcomeRef = { current: null };
          ${setters.map(name => `const ${name} = () => {};`).join('\n')}
          ${initialize}
          ${persist}
          ${apply}
          return { initialLoad, persistLocalSave, applySave };
        }
      `;
    }
  };
}
