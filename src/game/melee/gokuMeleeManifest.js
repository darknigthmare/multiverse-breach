import motion from '../combat/gokuMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/gokuMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const GOKU_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'goku_dbz', universe: 'Dragon Ball Z',
  characterReferenceId: 'goku-dbz-adult-black-hair-orange-gi', atlasVersion: 'native-goku-wave4'
});
