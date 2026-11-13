// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcPuttPutt from '../../DLC/PuttPutt/data/canonRosterWavePartH.js';
import * as dlcBorderlands2 from '../../DLC/Borderlands2/data/canonRosterWavePartH.js';
import * as dlcBRINK from '../../DLC/BRINK/data/canonRosterWavePartH.js';
import * as dlcBrutalLegend from '../../DLC/BrutalLegend/data/canonRosterWavePartH.js';
import * as dlcBuckshotRoulette from '../../DLC/BuckshotRoulette/data/canonRosterWavePartH.js';
import * as dlcChooChooCharles from '../../DLC/ChooChooCharles/data/canonRosterWavePartH.js';
import * as dlcCrysis from '../../DLC/Crysis/data/canonRosterWavePartH.js';
import * as dlcCuphead from '../../DLC/Cuphead/data/canonRosterWavePartH.js';
import * as dlcDaikatana from '../../DLC/Daikatana/data/canonRosterWavePartH.js';
import * as dlcDarkSouls from '../../DLC/DarkSouls/data/canonRosterWavePartH.js';
import * as dlcDeadRising from '../../DLC/DeadRising/data/canonRosterWavePartH.js';
import * as dlcDeponia from '../../DLC/Deponia/data/canonRosterWavePartH.js';
import * as dlcDeusEx from '../../DLC/DeusEx/data/canonRosterWavePartH.js';
import * as dlcDevilMayCry from '../../DLC/DevilMayCry/data/canonRosterWavePartH.js';
import * as dlcTheBackroomsKanePixels from '../../DLC/TheBackroomsKanePixels/data/canonRosterWavePartH.js';
import * as dlcEvolve from '../../DLC/Evolve/data/canonRosterWavePartH.js';
import * as dlcEYEDivineCybermancy from '../../DLC/EYEDivineCybermancy/data/canonRosterWavePartH.js';

import { freezeCompactCanonRosterPart } from './canonRosterPackFactory.js';
const N=name=>({id:name.toLowerCase().replace(/\W+/g,'_'),name,visualAnchor:name,nonCombat:true,objective:`Complete ${name} without combat.`});
const X=(aliases,allNonCombat=false,rule)=>({aliases,allNonCombat,...(rule?{rule}:{})});
export const CANON_ROSTER_WAVE_PART_H=freezeCompactCanonRosterPart([
dlcPuttPutt.createCanonRosterWavePartH({ X })
,dlcBorderlands2.createCanonRosterWavePartH({ X })
,dlcBRINK.createCanonRosterWavePartH({ X })
,dlcBrutalLegend.createCanonRosterWavePartH({ X })
,dlcBuckshotRoulette.createCanonRosterWavePartH({ N, X })
,dlcChooChooCharles.createCanonRosterWavePartH({ X })
,dlcCrysis.createCanonRosterWavePartH({ X })
,dlcCuphead.createCanonRosterWavePartH({ X })
,dlcDaikatana.createCanonRosterWavePartH({ X })
,dlcDarkSouls.createCanonRosterWavePartH({ X })
,dlcDeadRising.createCanonRosterWavePartH({ X })
,dlcDeponia.createCanonRosterWavePartH({ X })
,dlcDeusEx.createCanonRosterWavePartH({ X })
,dlcDevilMayCry.createCanonRosterWavePartH({ X })
,dlcTheBackroomsKanePixels.createCanonRosterWavePartH({ N, X })
,dlcEvolve.createCanonRosterWavePartH({ X })
,dlcEYEDivineCybermancy.createCanonRosterWavePartH({ X })
]);
