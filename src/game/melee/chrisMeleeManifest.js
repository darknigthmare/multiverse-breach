import motion from '../combat/chrisMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/chrisMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const CHRIS_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'chris_redfield', universe: 'Resident Evil',
  characterReferenceId: 'chris-redfield-re5-2009-bsaa', atlasVersion: 'native-chris-wave9'
});
