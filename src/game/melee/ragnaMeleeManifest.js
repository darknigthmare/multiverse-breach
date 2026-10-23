import motion from '../combat/ragnaMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/ragnaMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const RAGNA_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'ragna', universe: 'BlazBlue',
  characterReferenceId: 'ragna-continuum-shift-extend-2011-blood-scythe', atlasVersion: 'native-ragna-wave7'
});
