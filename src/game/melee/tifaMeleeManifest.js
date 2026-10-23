import motion from '../combat/tifaMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/tifaMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const TIFA_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'tifa_ff7', universe: 'Final Fantasy VII',
  characterReferenceId: 'tifa-ff7-original-martial-artist', atlasVersion: 'native-tifa-wave3'
});
