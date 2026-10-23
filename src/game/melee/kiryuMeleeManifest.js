import motion from '../combat/kiryuMeleeMotion.generated.json' with { type: 'json' };
import combat from '../combat/kiryuMeleeCombat.generated.json' with { type: 'json' };
import { buildNativeMeleeManifest } from './nativeMeleeManifest.js';

export const KIRYU_MELEE_MANIFEST = buildNativeMeleeManifest({
  entries: [...motion.entries, ...combat.entries], heroId: 'kiryu_yakuza', universe: 'Yakuza',
  characterReferenceId: 'kiryu-yakuza-kiwami-2016-dragon-dojima', atlasVersion: 'native-kiryu-wave8'
});
