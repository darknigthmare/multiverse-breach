import motion from '../combat/arthurMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/arthurMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const ARTHUR_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'arthur_kaamelott', universe: 'Kaamelott',
  characterReferenceId: 'arthur-kaamelott-livre3-2005-excalibur', atlasVersion: 'native-arthur-wave11'
});
