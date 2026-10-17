/** Progression uses UTC everywhere; ISO weeks start Monday, including year edges. */
export const PROGRESS_CALENDAR_VERSION = 1;
const DAY_MS = 86400000;
export function getProgressKeys(date = new Date()) {
  const instant = date instanceof Date ? date : new Date(date);
  if (!Number.isFinite(instant.getTime())) throw new TypeError('Date de progression invalide.');
  const dayKey = instant.toISOString().slice(0, 10);
  const thursday = new Date(`${dayKey}T00:00:00.000Z`);
  thursday.setUTCDate(thursday.getUTCDate() + 4 - (thursday.getUTCDay() || 7));
  const year = thursday.getUTCFullYear();
  const week = Math.floor((thursday - Date.UTC(year, 0, 1)) / (7 * DAY_MS)) + 1;
  return { dayKey, weekKey: `${year}-W${week}` };
}

export function getNextProgressRolloverDelay(date = new Date()) {
  const next = new Date(date);
  next.setUTCHours(24, 0, 0, 25);
  return Math.max(25, next - date);
}

const legacyWeek = date => {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return `${date.getUTCFullYear()}-W${Math.ceil((((date - start) / DAY_MS) + start.getUTCDay() + 1) / 7)}`;
};

/** Preserve current legacy claims once; an upgrade must not reopen a paid reward. */
export function migrateProgressCalendar(progress = {}, date = new Date()) {
  if (progress.calendarVersion === PROGRESS_CALENDAR_VERSION) return progress;
  const { dayKey, weekKey } = getProgressKeys(date);
  const localDay = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const legacyTitleDate = new Date(`${localDay}T12:00:00Z`);
  const sameDay = [dayKey, localDay].includes(progress.dayKey);
  const sameWeek = [weekKey, legacyWeek(date), legacyWeek(legacyTitleDate)].includes(progress.weekKey);
  return {
    ...progress,
    calendarVersion: PROGRESS_CALENDAR_VERSION,
    dayKey: sameDay ? dayKey : progress.dayKey,
    weekKey: sameWeek ? weekKey : progress.weekKey,
    lastSeenDay: progress.lastSeenDay === localDay ? dayKey : progress.lastSeenDay
  };
}

/** Reset *all* period-scoped fields before recording a result, even if the title
 * rollover effect has not run yet (hidden tabs and midnight results). */
export function rollProgressCalendar(progress = {}, keys = getProgressKeys()) {
  const sameDay = progress.dayKey === keys.dayKey;
  const sameWeek = progress.weekKey === keys.weekKey;
  if (sameDay && sameWeek) return progress;
  return {
    ...progress,
    ...keys,
    claimedDaily: sameDay ? (progress.claimedDaily || []) : [],
    itemActivations: sameDay ? (progress.itemActivations || 0) : 0,
    dailyWins: sameDay ? (progress.dailyWins || 0) : 0,
    dailyModeWins: sameDay ? (progress.dailyModeWins || {}) : {},
    claimedWeekly: sameWeek ? (progress.claimedWeekly || []) : [],
    weeklyItemActivations: sameWeek ? (progress.weeklyItemActivations || 0) : 0,
    weeklyWins: sameWeek ? (progress.weeklyWins || 0) : 0,
    weeklyModeWins: sameWeek ? (progress.weeklyModeWins || {}) : {}
  };
}
