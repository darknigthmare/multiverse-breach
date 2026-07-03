import { LORE_DB } from './lore';

export const BASE_GAME_UNIVERSES = ['Nexus de Convergence'];

export const isBaseGameUniverse = (universe) => BASE_GAME_UNIVERSES.includes(universe);

export const getDlcUniverseKeys = () => Object.keys(LORE_DB).filter(universe => !isBaseGameUniverse(universe));

export const DEFAULT_HIDDEN_UNIVERSES = getDlcUniverseKeys();
