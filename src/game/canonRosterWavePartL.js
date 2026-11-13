// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcTurok from '../../DLC/Turok/data/canonRosterWavePartL.js';
import * as dlcWallaceGromit from '../../DLC/WallaceGromit/data/canonRosterWavePartL.js';
import * as dlcWorms from '../../DLC/Worms/data/canonRosterWavePartL.js';
import * as dlcTheAmazingPatateShow from '../../DLC/TheAmazingPatateShow/data/canonRosterWavePartL.js';
import * as dlcElfenLied from '../../DLC/ElfenLied/data/canonRosterWavePartL.js';
import * as dlcHazbinHotel from '../../DLC/HazbinHotel/data/canonRosterWavePartL.js';
import * as dlcHelluvaBoss from '../../DLC/HelluvaBoss/data/canonRosterWavePartL.js';
import * as dlcMurderDrones from '../../DLC/MurderDrones/data/canonRosterWavePartL.js';
import * as dlcGushingOverMagicalGirlsSafeAdultReinterpretation from '../../DLC/GushingOverMagicalGirlsSafeAdultReinterpretation/data/canonRosterWavePartL.js';
import * as dlcPeepoodoSafeEducationalAdaptation from '../../DLC/PeepoodoSafeEducationalAdaptation/data/canonRosterWavePartL.js';
import * as dlcLesKassos from '../../DLC/LesKassos/data/canonRosterWavePartL.js';
import * as dlcMarvelZombiesMCUAnimation from '../../DLC/MarvelZombiesMCUAnimation/data/canonRosterWavePartL.js';
import * as dlcStrangerThings from '../../DLC/StrangerThings/data/canonRosterWavePartL.js';
import * as dlcInvincible from '../../DLC/Invincible/data/canonRosterWavePartL.js';
import * as dlcWakfu from '../../DLC/Wakfu/data/canonRosterWavePartL.js';
import * as dlcOggyEtLesCafards from '../../DLC/OggyEtLesCafards/data/canonRosterWavePartL.js';
import * as dlcLesZinzinsDeLespace from '../../DLC/LesZinzinsDeLespace/data/canonRosterWavePartL.js';

import { freezeCompactCanonRosterPart } from './canonRosterPackFactory.js';

const rows = [
  dlcTurok.createRows(),
  dlcWallaceGromit.createRows(),
  dlcWorms.createRows(),
  dlcTheAmazingPatateShow.createRows(),
  dlcElfenLied.createRows(),
  dlcHazbinHotel.createRows(),
  dlcHelluvaBoss.createRows(),
  dlcMurderDrones.createRows(),
  dlcGushingOverMagicalGirlsSafeAdultReinterpretation.createRows(),
  dlcPeepoodoSafeEducationalAdaptation.createRows(),
  dlcLesKassos.createRows(),
  dlcMarvelZombiesMCUAnimation.createRows(),
  dlcStrangerThings.createRows(),
  dlcInvincible.createRows(),
  dlcWakfu.createRows(),
  dlcOggyEtLesCafards.createRows(),
  dlcLesZinzinsDeLespace.createRows()
];

export const CANON_ROSTER_WAVE_PART_L = freezeCompactCanonRosterPart(rows);
