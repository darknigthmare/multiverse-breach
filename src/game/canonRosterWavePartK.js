// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcHalloween from '../../DLC/Halloween/data/canonRosterWavePartK.js';
import * as dlcRedFaction from '../../DLC/RedFaction/data/canonRosterWavePartK.js';
import * as dlcRememberMe from '../../DLC/RememberMe/data/canonRosterWavePartK.js';
import * as dlcREPO from '../../DLC/REPO/data/canonRosterWavePartK.js';
import * as dlcWolfenstein from '../../DLC/Wolfenstein/data/canonRosterWavePartK.js';
import * as dlcRockOfAges from '../../DLC/RockOfAges/data/canonRosterWavePartK.js';
import * as dlcSeriousSam from '../../DLC/SeriousSam/data/canonRosterWavePartK.js';
import * as dlcSkullgirls from '../../DLC/Skullgirls/data/canonRosterWavePartK.js';
import * as dlcTheForest from '../../DLC/TheForest/data/canonRosterWavePartK.js';
import * as dlcSpyFox from '../../DLC/SpyFox/data/canonRosterWavePartK.js';
import * as dlcSquirrelWithAGun from '../../DLC/SquirrelWithAGun/data/canonRosterWavePartK.js';
import * as dlcStarshipTroopers from '../../DLC/StarshipTroopers/data/canonRosterWavePartK.js';
import * as dlcSUPERHOT from '../../DLC/SUPERHOT/data/canonRosterWavePartK.js';
import * as dlcTheBall from '../../DLC/TheBall/data/canonRosterWavePartK.js';
import * as dlcTheBindingOfIsaacRebirth from '../../DLC/TheBindingOfIsaacRebirth/data/canonRosterWavePartK.js';
import * as dlcTheDarkness from '../../DLC/TheDarkness/data/canonRosterWavePartK.js';
import * as dlcTheSurge from '../../DLC/TheSurge/data/canonRosterWavePartK.js';

import { freezeCanonRosterPart } from './canonRosterPackFactory.js';
import { authoredWave6NonCombatStage } from './wave6NonCombatObjectives.js';
const r=(key,universe,referenceUrl,heroes,enemies,bosses,worldBoss,gear,stages,x={})=>({key:key.replaceAll('-','_'),universe,aliases:[],continuity:universe,adaptationRule:'Adaptation originale fidele au canon.',visualAnchor:`silhouettes et decors de ${universe}`,referenceUrl,heroes,enemies,bosses,worldBoss,gear,stages,event:`${universe} Event`,...x});
const t=authoredWave6NonCombatStage;
const rows=[
dlcHalloween.createRows({ r, t }),
dlcRedFaction.createRows({ r }),
dlcRememberMe.createRows({ r }),
dlcREPO.createRows({ r, t }),
dlcWolfenstein.createRows({ r }),
dlcRockOfAges.createRows({ r, t }),
dlcSeriousSam.createRows({ r }),
dlcSkullgirls.createRows({ r }),
dlcTheForest.createRows({ r }),
dlcSpyFox.createRows({ r, t }),
dlcSquirrelWithAGun.createRows({ r, t }),
dlcStarshipTroopers.createRows({ r }),
dlcSUPERHOT.createRows({ r, t }),
dlcTheBall.createRows({ r, t }),
dlcTheBindingOfIsaacRebirth.createRows({ r }),
dlcTheDarkness.createRows({ r }),
dlcTheSurge.createRows({ r }),
];
export const CANON_ROSTER_WAVE_PART_K=freezeCanonRosterPart(rows);
