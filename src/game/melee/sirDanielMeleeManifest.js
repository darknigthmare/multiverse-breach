import motion from '../combat/sirDanielMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/sirDanielMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const SIR_DANIEL_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'sir_daniel_fortesque', universe: 'MediEvil',
  characterReferenceId: 'sir-daniel-medievil-1998-ps1-short-sword-right-hand-no-shield', atlasVersion: 'native-sir-daniel-wave15'
});
