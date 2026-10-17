import { migrateProgressCalendar } from './progressCalendar.js';
const unsafeKeys = new Set(['__proto__', 'prototype', 'constructor']);
const record = value => value && typeof value === 'object' && !Array.isArray(value) ? value : {};
const stringIds = value => Array.isArray(value)
  ? value.filter(id => typeof id === 'string' && id.trim() && !unsafeKeys.has(id)).map(id => id.trim()) : [];
export const safeSaveInteger = (value, fallback = 0) => {
  if ((typeof value !== 'number' && typeof value !== 'string') || value === '') return fallback;
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(number))) : fallback;
};
const safeRecord = (value, convert = value => value) => Object.fromEntries(
  Object.entries(record(value)).filter(([key]) => !unsafeKeys.has(key)).map(([key, entry]) => [key, convert(entry)])
);

/** Preserve unknown owned IDs for future content. Only deployed IDs must resolve. */
export function sanitizeSaveCore(save, { defaults = {}, knownHeroIds = [], playerHeroId = 'player_anchor', now = new Date() } = {}) {
  if (!save || typeof save !== 'object' || Array.isArray(save)) throw new TypeError('Trace Nexus invalide : objet attendu.');
  const result = { ...save };
  for (const key of ['gold', 'breachShards', 'eventTokens']) result[key] = safeSaveInteger(save[key], defaults[key] || 0);
  const unlocked = [...new Set([playerHeroId, ...stringIds(save.unlockedHeroes || defaults.unlockedHeroes)])];
  result.unlockedHeroes = unlocked;
  const known = new Set([playerHeroId, ...knownHeroIds]);
  result.activeTeam = [...new Set(stringIds(save.activeTeam || defaults.activeTeam))]
    .filter(id => known.has(id) && unlocked.includes(id)).slice(0, 3);
  if (!result.activeTeam.includes(playerHeroId)) result.activeTeam = [playerHeroId, ...result.activeTeam].slice(0, 3);
  // Inventory duplicates represent copies/crafting ingredients, not invalid data.
  result.inventory = stringIds(save.inventory ?? defaults.inventory);
  result.heroLevels = safeRecord(save.heroLevels, value => Math.max(1, safeSaveInteger(value, 1)));
  result.heroLevels[playerHeroId] = result.heroLevels[playerHeroId] || 1;
  for (const key of ['heroTalents', 'heroSkins', 'equippedGear', 'equippedEventItems']) {
    result[key] = safeRecord(save[key], value => typeof value === 'string' ? value : null);
  }
  result.playerProfile = { ...record(save.playerProfile), name: String(save.playerProfile?.name || defaults.playerProfile?.name || 'Ancre').trim().slice(0, 80) || 'Ancre' };
  result.completedStages = [...new Set((Array.isArray(save.completedStages) ? save.completedStages : []).filter(id =>
    (typeof id === 'number' && Number.isSafeInteger(id) && id >= 0) || (typeof id === 'string' && id.trim() && !unsafeKeys.has(id))
  ))];
  for (const key of ['completedArcIds', 'arcReplayUnlockedIds']) result[key] = [...new Set(stringIds(save[key]))];
  result.portalStats = { ...record(save.portalStats), history: Array.isArray(save.portalStats?.history) ? save.portalStats.history.filter(entry => entry && typeof entry === 'object') : [] };
  for (const key of ['pulls', 'packsOpened', 'duplicateStreak']) result.portalStats[key] = safeSaveInteger(save.portalStats?.[key]);
  const progress = { ...record(save.activityProgress) };
  for (const key of ['itemActivations', 'weeklyItemActivations', 'dailyWins', 'weeklyWins', 'lifetimeWins', 'lifetimeAttempts', 'seasonXp', 'loginStreak']) progress[key] = safeSaveInteger(progress[key]);
  for (const key of ['claimedDaily', 'claimedWeekly', 'claimedMilestones']) progress[key] = [...new Set(stringIds(progress[key]))];
  for (const key of ['modeWins', 'dailyModeWins', 'weeklyModeWins', 'heroInstability']) progress[key] = safeRecord(progress[key], value => safeSaveInteger(value));
  progress.riftJournal = Array.isArray(progress.riftJournal) ? progress.riftJournal.filter(entry => entry && typeof entry === 'object') : [];
  result.activityProgress = migrateProgressCalendar(progress, now);
  // Nested catalog-specific migrations remain responsible for card definitions.
  result.portalCollection = record(save.portalCollection);
  return result;
}
