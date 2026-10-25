import motion from '../combat/isaacMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/isaacMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const ISAAC_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'isaac', universe: 'Dead Space',
  characterReferenceId: 'isaac-dead-space-2008-level3-engineering-rig', atlasVersion: 'native-isaac-wave12'
});
