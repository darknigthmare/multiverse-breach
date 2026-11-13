// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcInterstellarMarines from '../../DLC/InterstellarMarines/data/canonRosterWavePartJ.js';
import * as dlcJetSetRadio from '../../DLC/JetSetRadio/data/canonRosterWavePartJ.js';
import * as dlcKillerInstinct from '../../DLC/KillerInstinct/data/canonRosterWavePartJ.js';
import * as dlcKillingFloor2 from '../../DLC/KillingFloor2/data/canonRosterWavePartJ.js';
import * as dlcLostPlanet2 from '../../DLC/LostPlanet2/data/canonRosterWavePartJ.js';
import * as dlcMagicka from '../../DLC/Magicka/data/canonRosterWavePartJ.js';
import * as dlcMaxPayne2 from '../../DLC/MaxPayne2/data/canonRosterWavePartJ.js';
import * as dlcMetalSlug from '../../DLC/MetalSlug/data/canonRosterWavePartJ.js';
import * as dlcMirrorsEdge from '../../DLC/MirrorsEdge/data/canonRosterWavePartJ.js';
import * as dlcOddworld from '../../DLC/Oddworld/data/canonRosterWavePartJ.js';
import * as dlcOvergrowth from '../../DLC/Overgrowth/data/canonRosterWavePartJ.js';
import * as dlcPalworld from '../../DLC/Palworld/data/canonRosterWavePartJ.js';
import * as dlcPhantasmagoria from '../../DLC/Phantasmagoria/data/canonRosterWavePartJ.js';
import * as dlcSamMax from '../../DLC/SamMax/data/canonRosterWavePartJ.js';
import * as dlcPostal from '../../DLC/Postal/data/canonRosterWavePartJ.js';
import * as dlcPUBG from '../../DLC/PUBG/data/canonRosterWavePartJ.js';
import * as dlcLaPetiteHistoireDeFrance from '../../DLC/LaPetiteHistoireDeFrance/data/canonRosterWavePartJ.js';

import { freezeCanonRosterPart } from './canonRosterPackFactory.js';
import { authoredWave6NonCombatStage } from './wave6NonCombatObjectives.js';
const r=(key,universe,referenceUrl,heroes,enemies,bosses,worldBoss,gear,stages,x={})=>({key:key.replaceAll('-','_'),universe,aliases:[],continuity:universe,adaptationRule:'Adaptation originale fidele au canon.',visualAnchor:`silhouettes et decors de ${universe}`,referenceUrl,heroes,enemies,bosses,worldBoss,gear,stages,event:`${universe} Event`,...x});
const t=authoredWave6NonCombatStage;
const rows=[
dlcInterstellarMarines.createRows({ r }),
dlcJetSetRadio.createRows({ r, t }),
dlcKillerInstinct.createRows({ r }),
dlcKillingFloor2.createRows({ r }),
dlcLostPlanet2.createRows({ r }),
dlcMagicka.createRows({ r }),
dlcMaxPayne2.createRows({ r }),
dlcMetalSlug.createRows({ r }),
dlcMirrorsEdge.createRows({ r, t }),
dlcOddworld.createRows({ r }),
dlcOvergrowth.createRows({ r }),
dlcPalworld.createRows({ r }),
dlcPhantasmagoria.createRows({ r, t }),
dlcSamMax.createRows({ r }),
dlcPostal.createRows({ r }),
dlcPUBG.createRows({ r, t }),
dlcLaPetiteHistoireDeFrance.createRows({ r, t }),
];
export const CANON_ROSTER_WAVE_PART_J=freezeCanonRosterPart(rows);
