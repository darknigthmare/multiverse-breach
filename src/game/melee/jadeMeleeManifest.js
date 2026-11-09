import motion from '../combat/characterJadeMotionWave17.generated.json' with { type: 'json' };
import combat from '../combat/characterJadeActionWave17.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

// Native illustrations bind all45 states; simulation retains combat authority.
// Source2003 supports the Daï-Jo, charge, crouch, dodge, hanging and climbing.
// Platform-fighter shield/aerial timing and opposite-facing mirroring remain
// declared adaptations. The selected personal special is informative photography.
export const JADE_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries],
  heroId: 'beyond_good_evil_jade', universe: 'Beyond Good & Evil',
  characterReferenceId: 'jade-bge-2003-green-headband-teal-trousers-dai-jo-camera',
  atlasVersion: 'native-jade-wave17'
});
