export const LEGACY_KART_CAREER_KEY = 'multiverse-breach-kart-career';

export const DEFAULT_KART_CAREER = Object.freeze({
  xp: 0,
  fragments: 0,
  garageParts: 0,
  upgrades: Object.freeze({ engine: 0, grip: 0, capacitor: 0, stabilizer: 0 }),
  bestTimes: Object.freeze({}),
  completedObjectives: Object.freeze({})
});

const toNonNegativeInteger = value => Math.max(0, Math.floor(Number(value) || 0));

export const normalizeKartCareer = (career = {}) => ({
  xp: toNonNegativeInteger(career?.xp),
  fragments: toNonNegativeInteger(career?.fragments),
  garageParts: toNonNegativeInteger(career?.garageParts),
  upgrades: Object.fromEntries(
    Object.keys(DEFAULT_KART_CAREER.upgrades).map(upgradeId => [
      upgradeId,
      Math.min(5, toNonNegativeInteger(career?.upgrades?.[upgradeId]))
    ])
  ),
  bestTimes: Object.fromEntries(
    Object.entries(career?.bestTimes || {})
      .map(([trackId, time]) => [String(trackId), Number(time)])
      .filter(([trackId, time]) => trackId.trim() && Number.isFinite(time) && time > 0)
  ),
  completedObjectives: Object.fromEntries(
    Object.entries(career?.completedObjectives || {})
      .filter(([trackId, complete]) => String(trackId).trim() && complete === true)
      .map(([trackId]) => [String(trackId), true])
  )
});

export const migrateLegacyKartCareer = (save = {}, legacyCareer = null) => {
  const portalCollection = save?.portalCollection && typeof save.portalCollection === 'object'
    ? save.portalCollection
    : {};
  const hasIntegratedCareer = portalCollection.raceCareer
    && typeof portalCollection.raceCareer === 'object';

  return {
    ...save,
    portalCollection: {
      ...portalCollection,
      raceCareer: normalizeKartCareer(hasIntegratedCareer ? portalCollection.raceCareer : legacyCareer)
    }
  };
};

export const applyRaceResult = (career, raceSummary = {}) => {
  const normalized = normalizeKartCareer(career);
  const trackId = String(raceSummary.trackId || '').trim();
  if (!trackId) return normalized;
  const raceTime = Number(raceSummary.time);
  const previousBest = normalized.bestTimes[trackId];
  const nextBest = Number.isFinite(raceTime) && raceTime > 0
    ? (previousBest ? Math.min(previousBest, raceTime) : raceTime)
    : previousBest;
  const rewards = raceSummary.rewards || {};

  return normalizeKartCareer({
    ...normalized,
    xp: normalized.xp + toNonNegativeInteger(rewards.xp),
    fragments: normalized.fragments + toNonNegativeInteger(rewards.fragments),
    garageParts: normalized.garageParts + toNonNegativeInteger(rewards.garageParts),
    bestTimes: {
      ...normalized.bestTimes,
      ...(nextBest ? { [trackId]: nextBest } : {})
    },
    completedObjectives: {
      ...normalized.completedObjectives,
      [trackId]: Boolean(normalized.completedObjectives[trackId] || raceSummary.objectiveComplete)
    }
  });
};
