// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcFEAR from '../../DLC/FEAR/data/canonRosterWavePartI.js';
import * as dlcFindingFrankie from '../../DLC/FindingFrankie/data/canonRosterWavePartI.js';
import * as dlcFreddiFish from '../../DLC/FreddiFish/data/canonRosterWavePartI.js';
import * as dlcGTFO from '../../DLC/GTFO/data/canonRosterWavePartI.js';
import * as dlcHAWKEN from '../../DLC/HAWKEN/data/canonRosterWavePartI.js';
import * as dlcHaydeeSafeAdaptation from '../../DLC/HaydeeSafeAdaptation/data/canonRosterWavePartI.js';
import * as dlcHellbladeSenuasSacrifice from '../../DLC/HellbladeSenuasSacrifice/data/canonRosterWavePartI.js';
import * as dlcHelloNeighbor from '../../DLC/HelloNeighbor/data/canonRosterWavePartI.js';
import * as dlcHITMANWorldOfAssassination from '../../DLC/HITMANWorldOfAssassination/data/canonRosterWavePartI.js';
import * as dlcTomClancysSplinterCell from '../../DLC/TomClancysSplinterCell/data/canonRosterWavePartI.js';
import * as dlcSuperMeatBoy from '../../DLC/SuperMeatBoy/data/canonRosterWavePartI.js';
import * as dlcBITTRIP from '../../DLC/BITTRIP/data/canonRosterWavePartI.js';

import { freezeCanonRosterPart } from './canonRosterPackFactory.js';

const partI = [
  dlcFEAR.createPartI(),
  dlcFindingFrankie.createPartI(),
  dlcFreddiFish.createPartI(),
  dlcGTFO.createPartI(),
  dlcHAWKEN.createPartI(),
  dlcHaydeeSafeAdaptation.createPartI(),
  dlcHellbladeSenuasSacrifice.createPartI(),
  dlcHelloNeighbor.createPartI(),
  dlcHITMANWorldOfAssassination.createPartI(),
  dlcTomClancysSplinterCell.createPartI(),
  dlcSuperMeatBoy.createPartI(),
  dlcBITTRIP.createPartI()
];

export const CANON_ROSTER_WAVE_PART_I = freezeCanonRosterPart(partI);
