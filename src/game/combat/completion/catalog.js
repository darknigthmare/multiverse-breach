import { CAPABILITIES_LOT_1 } from './capabilitiesLot1.js';
import { CAPABILITIES_LOT_2 } from './capabilitiesLot2.js';
import { CAPABILITIES_LOT_3 } from './capabilitiesLot3.js';
import { CAPABILITIES_LOT_4 } from './capabilitiesLot4.js';
import { CAPABILITIES_ADDITIONAL_1 } from './capabilitiesAdditional1.js';
import { CAPABILITIES_ADDITIONAL_2 } from './capabilitiesAdditional2.js';

// Each lot is an explicitly authored table. This merge supplies no guessed
// identity or renamed fallback for a missing character.
const entries = [CAPABILITIES_LOT_1, CAPABILITIES_LOT_2, CAPABILITIES_LOT_3, CAPABILITIES_LOT_4, CAPABILITIES_ADDITIONAL_1, CAPABILITIES_ADDITIONAL_2]
  .flatMap(lot => Object.entries(lot));
if (new Set(entries.map(([id]) => id)).size !== entries.length) {
  throw new Error('Duplicate authored combat completion identity');
}
export const COMBAT_CAPABILITY_COMPLETION = Object.freeze(Object.fromEntries(entries));
