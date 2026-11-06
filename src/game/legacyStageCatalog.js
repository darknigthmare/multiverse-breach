import { createLegacyStage as createPredatorStage } from '../../DLC/Predator/data/legacyStages.js';
import { createLegacyStage as createResidentEvilStage } from '../../DLC/ResidentEvil/data/legacyStages.js';
import { createLegacyStage as createSilentHillStage } from '../../DLC/SilentHill/data/legacyStages.js';
import { createLegacyStage as createDinoCrisisStage } from '../../DLC/DinoCrisis/data/legacyStages.js';
import { createLegacyStage as createTheMatrixStage } from '../../DLC/TheMatrix/data/legacyStages.js';
import { createLegacyStage as createStargateStage } from '../../DLC/Stargate/data/legacyStages.js';
import { createLegacyStage as createPortalStage } from '../../DLC/Portal/data/legacyStages.js';
import { createLegacyStage as createPaydayStage } from '../../DLC/Payday/data/legacyStages.js';
import { createLegacyStage as createVocaloidStage } from '../../DLC/Vocaloid/data/legacyStages.js';
import { createLegacyStage as createYuGiOhStage } from '../../DLC/YuGiOh/data/legacyStages.js';
import { createLegacyStage as createGuiltyGearStage } from '../../DLC/GuiltyGear/data/legacyStages.js';
import { createLegacyStage as createBlazBlueStage } from '../../DLC/BlazBlue/data/legacyStages.js';
import { createLegacyStage as createSlenderManStage } from '../../DLC/SlenderMan/data/legacyStages.js';
import { createLegacyStage as createChuckyStage } from '../../DLC/Chucky/data/legacyStages.js';
import { createLegacyStage as createHellraiserStage } from '../../DLC/Hellraiser/data/legacyStages.js';
import { createLegacyStage as createMassEffectStage } from '../../DLC/MassEffect/data/legacyStages.js';
import { createLegacyStage as createDoomStage } from '../../DLC/Doom/data/legacyStages.js';
import { createLegacyStage as createUnrealStage } from '../../DLC/Unreal/data/legacyStages.js';
import { createLegacyStage as createHarryPotterStage } from '../../DLC/HarryPotter/data/legacyStages.js';
import { createLegacyStage as createStarWarsStage } from '../../DLC/StarWars/data/legacyStages.js';
import { createLegacyStage as createLeCinquiemeElementStage } from '../../DLC/LeCinquiemeElement/data/legacyStages.js';
import { createLegacyStage as createRickMortyStage } from '../../DLC/RickMorty/data/legacyStages.js';
import { createLegacyStage as createScaryMovieStage } from '../../DLC/ScaryMovie/data/legacyStages.js';
import { createLegacyStage as createDeadSpaceStage } from '../../DLC/DeadSpace/data/legacyStages.js';
import { createLegacyStage as createDigitalCircusStage } from '../../DLC/DigitalCircus/data/legacyStages.js';
import { createLegacyStage as createDigimonStage } from '../../DLC/Digimon/data/legacyStages.js';
import { createLegacyStage as createSawStage } from '../../DLC/Saw/data/legacyStages.js';
import { createLegacyStage as createRosarioVampireStage } from '../../DLC/RosarioVampire/data/legacyStages.js';
import { createLegacyStage as createNegimaStage } from '../../DLC/Negima/data/legacyStages.js';
import { createLegacyStage as createGhostInTheShellStage } from '../../DLC/GhostInTheShell/data/legacyStages.js';
import { createLegacyStage as createMadMaxStage } from '../../DLC/MadMax/data/legacyStages.js';

// Fresh objects preserve the Hub's historical per-render stage projection.
export const createLegacyStageCatalog = () => ({
  4: createPredatorStage(),
  5: createResidentEvilStage(),
  6: createSilentHillStage(),
  7: createDinoCrisisStage(),
  8: createTheMatrixStage(),
  9: createStargateStage(),
  11: createPortalStage(),
  13: createPaydayStage(),
  14: createVocaloidStage(),
  15: createYuGiOhStage(),
  16: createGuiltyGearStage(),
  17: createBlazBlueStage(),
  18: createSlenderManStage(),
  19: createChuckyStage(),
  20: createHellraiserStage(),
  21: createMassEffectStage(),
  23: createDoomStage(),
  24: createUnrealStage(),
  25: createHarryPotterStage(),
  26: createStarWarsStage(),
  27: createLeCinquiemeElementStage(),
  30: createRickMortyStage(),
  28: createScaryMovieStage(),
  29: createDeadSpaceStage(),
  31: createDigitalCircusStage(),
  32: createDigimonStage(),
  33: createSawStage(),
  34: createRosarioVampireStage(),
  35: createNegimaStage(),
  36: createGhostInTheShellStage(),
  37: createMadMaxStage()
});
