import motion from '../combat/ripleyMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/ripleyMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const RIPLEY_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'ripley', universe: 'Alien',
  characterReferenceId: 'ripley-aliens-1986-pre-power-loader-m41a', atlasVersion: 'native-ripley-wave13'
});
