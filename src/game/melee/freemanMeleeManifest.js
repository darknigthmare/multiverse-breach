import motion from '../combat/freemanMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/freemanMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const FREEMAN_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'freeman', universe: 'Half-Life',
  characterReferenceId: 'gordon-freeman-half-life2-2004-hev-mkv', atlasVersion: 'native-freeman-wave10'
});
