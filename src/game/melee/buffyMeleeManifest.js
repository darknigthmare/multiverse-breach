import motion from '../combat/buffyMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/buffyMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const BUFFY_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'buffy_summers', universe: 'Buffy the Vampire Slayer',
  characterReferenceId: 'buffy-season7-wooden-stake-before-scythe-amulet', atlasVersion: 'native-buffy-wave11'
});
