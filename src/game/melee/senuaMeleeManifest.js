import motion from '../combat/characterSenuaMotionWave16.generated.json' with { type: 'json' };
import combat from '../combat/characterSenuaActionWave16.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const SENUA_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'hellblade_senua', universe: 'Hellblade: Senua’s Sacrifice',
  characterReferenceId: 'senua-hellblade-2017-before-first-hela-initial-ring-pommel-sword-right-hand-focus-mirror',
  atlasVersion: 'native-senua-wave16'
});
