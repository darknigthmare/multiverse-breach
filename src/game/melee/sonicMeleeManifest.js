import motion from '../combat/sonicMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/sonicMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const SONIC_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'sonic_hedgehog', universe: 'Sonic',
  characterReferenceId: 'sonic-adventure-1998-blue-green-eyes-standard-shoes', atlasVersion: 'native-sonic-wave6'
});
