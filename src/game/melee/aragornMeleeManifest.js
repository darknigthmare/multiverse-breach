import motion from '../combat/aragornMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/aragornMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const ARAGORN_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'aragorn_lotr', universe: 'The Lord of the Rings',
  characterReferenceId: 'aragorn-strider-fellowship-2001-before-amon-hen-ranger-longsword', atlasVersion: 'native-aragorn-wave14'
});
