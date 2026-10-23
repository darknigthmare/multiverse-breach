import motion from '../combat/vegetaMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/vegetaMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const VEGETA_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'vegeta_dbz', universe: 'Dragon Ball Z',
  characterReferenceId: 'vegeta-dbz-black-hair-blue-sleeveless-training', atlasVersion: 'native-vegeta-wave5'
});
