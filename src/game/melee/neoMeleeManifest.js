import motion from '../combat/neoMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/neoMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const NEO_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'neo', universe: 'The Matrix',
  characterReferenceId: 'neo-matrix-reloaded-2003-closed-cassock', atlasVersion: 'native-neo-wave10'
});
