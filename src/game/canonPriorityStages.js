// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcGearsOfWar from '../../DLC/GearsOfWar/data/canonPriorityStages.js';
import * as dlcHalo from '../../DLC/Halo/data/canonPriorityStages.js';
import * as dlcAlien from '../../DLC/Alien/data/canonPriorityStages.js';
import * as dlcHalfLife from '../../DLC/HalfLife/data/canonPriorityStages.js';
import * as dlcMetalGear from '../../DLC/MetalGear/data/canonPriorityStages.js';
import * as dlcFallout from '../../DLC/Fallout/data/canonPriorityStages.js';

// Historical stage IDs and enemy template names stay stable for saves and sprite catalogs.
// Explicit rosters also make the battle use the selected local boss instead of
// the universe-wide world boss from a different game or period.
export const CANON_PRIORITY_STAGES = Object.freeze({
  lightmassTrain: dlcGearsOfWar.createCanonPriorityStages(),
  metropolisScarab: dlcHalo.createCanonPriorityStages(),
  hadleysQueen: dlcAlien.createCanonPriorityStages(),
  xenNihilanth: dlcHalfLife.createCanonPriorityStages(),
  shadowMoses: dlcMetalGear.createCanonPriorityStages(),
  legatesCamp: dlcFallout.createCanonPriorityStages()
});
