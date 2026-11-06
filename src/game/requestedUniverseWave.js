// Universe definitions live in DLC/<Universe>/data; this module preserves the public runtime API.
import * as dlcChainsawMan from '../../DLC/ChainsawMan/data/requestedUniverseWave.js';
import * as dlcCyberpunkEdgerunners from '../../DLC/CyberpunkEdgerunners/data/requestedUniverseWave.js';
import * as dlcDemonSlayer from '../../DLC/DemonSlayer/data/requestedUniverseWave.js';
import * as dlcParasyte from '../../DLC/Parasyte/data/requestedUniverseWave.js';
import * as dlcSteinsGate from '../../DLC/SteinsGate/data/requestedUniverseWave.js';
import * as dlcZeroEscapeTheNonaryGames from '../../DLC/ZeroEscapeTheNonaryGames/data/requestedUniverseWave.js';
import * as dlcJoJosBizarreAdventure from '../../DLC/JoJosBizarreAdventure/data/requestedUniverseWave.js';
import * as dlcRurouniKenshin from '../../DLC/RurouniKenshin/data/requestedUniverseWave.js';
import * as dlcTokyoGhoul from '../../DLC/TokyoGhoul/data/requestedUniverseWave.js';
import * as dlcCowboyBebop from '../../DLC/CowboyBebop/data/requestedUniverseWave.js';
import * as dlcDragonBallZ from '../../DLC/DragonBallZ/data/requestedUniverseWave.js';
import * as dlcElfenLied from '../../DLC/ElfenLied/data/requestedUniverseWave.js';
import * as dlcFullmetalAlchemist from '../../DLC/FullmetalAlchemist/data/requestedUniverseWave.js';
import * as dlcGantz from '../../DLC/Gantz/data/requestedUniverseWave.js';
import * as dlcPsychoPass from '../../DLC/PsychoPass/data/requestedUniverseWave.js';
import * as dlcMashle from '../../DLC/Mashle/data/requestedUniverseWave.js';
import * as dlcSoloLeveling from '../../DLC/SoloLeveling/data/requestedUniverseWave.js';
import * as dlcFrierenBeyondJourneysEnd from '../../DLC/FrierenBeyondJourneysEnd/data/requestedUniverseWave.js';
import * as dlcDeadmanWonderland from '../../DLC/DeadmanWonderland/data/requestedUniverseWave.js';
import * as dlcDevilman from '../../DLC/Devilman/data/requestedUniverseWave.js';
import * as dlcNeonGenesisEvangelion from '../../DLC/NeonGenesisEvangelion/data/requestedUniverseWave.js';
import * as dlcNaruto from '../../DLC/Naruto/data/requestedUniverseWave.js';
import * as dlcNarutoShippuden from '../../DLC/NarutoShippuden/data/requestedUniverseWave.js';
import * as dlcBorutoNarutoNextGenerations from '../../DLC/BorutoNarutoNextGenerations/data/requestedUniverseWave.js';
import * as dlcBorutoTwoBlueVortex from '../../DLC/BorutoTwoBlueVortex/data/requestedUniverseWave.js';
import * as dlcOnePunchMan from '../../DLC/OnePunchMan/data/requestedUniverseWave.js';
import * as dlcSwordArtOnlineGunGaleOnline from '../../DLC/SwordArtOnlineGunGaleOnline/data/requestedUniverseWave.js';
import * as dlcSwordArtOnline from '../../DLC/SwordArtOnline/data/requestedUniverseWave.js';
import * as dlcLesAventuresDeSaturnin from '../../DLC/LesAventuresDeSaturnin/data/requestedUniverseWave.js';
import * as dlcMagiCJacK from '../../DLC/MagiCJacK/data/requestedUniverseWave.js';
import * as dlcTeenTitans from '../../DLC/TeenTitans/data/requestedUniverseWave.js';
import * as dlcGodzilla from '../../DLC/Godzilla/data/requestedUniverseWave.js';

import { SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE } from './solarOppositesSirenStarWarsPack.js';

// Canon-focused universe packs requested after the large expanded-universe wave.
// Keep aliases in comments so future imports do not create duplicate universes.
export const REQUESTED_UNIVERSE_WAVE = [
  dlcChainsawMan.createRequestedUniverseWave(),
  dlcCyberpunkEdgerunners.createRequestedUniverseWave(),
  dlcDemonSlayer.createRequestedUniverseWave(),
  dlcParasyte.createRequestedUniverseWave(),
  dlcSteinsGate.createRequestedUniverseWave(),
  dlcZeroEscapeTheNonaryGames.createRequestedUniverseWave(),
  dlcJoJosBizarreAdventure.createRequestedUniverseWave(),
  dlcRurouniKenshin.createRequestedUniverseWave(),
  dlcTokyoGhoul.createRequestedUniverseWave(),
  dlcCowboyBebop.createRequestedUniverseWave(),
  dlcDragonBallZ.createRequestedUniverseWave(),
  dlcElfenLied.createRequestedUniverseWave(),
  dlcFullmetalAlchemist.createRequestedUniverseWave(),
  dlcGantz.createRequestedUniverseWave(),
  dlcPsychoPass.createRequestedUniverseWave(),
  dlcMashle.createRequestedUniverseWave(),
  dlcSoloLeveling.createRequestedUniverseWave(),
  dlcFrierenBeyondJourneysEnd.createRequestedUniverseWave(),
  dlcDeadmanWonderland.createRequestedUniverseWave(),
  dlcDevilman.createRequestedUniverseWave(),
  dlcNeonGenesisEvangelion.createRequestedUniverseWave(),
  dlcNaruto.createRequestedUniverseWave(),
  dlcNarutoShippuden.createRequestedUniverseWave(),
  dlcBorutoNarutoNextGenerations.createRequestedUniverseWave(),
  dlcBorutoTwoBlueVortex.createRequestedUniverseWave(),
  dlcOnePunchMan.createRequestedUniverseWave(),
  dlcSwordArtOnlineGunGaleOnline.createRequestedUniverseWave(),
  dlcSwordArtOnline.createRequestedUniverseWave(),
  dlcLesAventuresDeSaturnin.createRequestedUniverseWave(),
  dlcMagiCJacK.createRequestedUniverseWave(),
  dlcTeenTitans.createRequestedUniverseWave(),
  dlcGodzilla.createRequestedUniverseWave()
];

REQUESTED_UNIVERSE_WAVE.push(...SOLAR_OPPOSITES_SIREN_STAR_WARS_UNIVERSE_WAVE);
