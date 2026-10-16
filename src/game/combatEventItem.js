// The equipped ID, not the carrier's universe, selects a crossover artifact.
export function resolveEquippedCombatEvent(eventId, catalog, hiddenUniverses = new Set(), disabledIds = new Set()) {
  if (typeof eventId !== 'string' || !eventId || disabledIds.has(eventId)) return null;
  for (const [universe, item] of Object.entries(catalog || {})) {
    if (item?.id === eventId) return hiddenUniverses.has(universe) ? null : item;
  }
  return null;
}
