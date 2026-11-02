// Meaningful production-command fixtures cover both camps and flat/vertical
// terrain. The assertion script closes its private watcher-free SSR server.
import { test } from 'node:test';
test('W16 Tactics typed source mechanics: production-command fixtures', async () => {
  await import('../docs/combat-fidelity-wave16-2026-10-28/part-a/tactics/verify-source-runtime.mjs');
});
