import motion from '../combat/cloudMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/cloudMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const CLOUD_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'cloud_ff7', universe: 'Final Fantasy VII',
  characterReferenceId: 'cloud-ff7-original-buster-sword', atlasVersion: 'native-cloud-wave2'
});
