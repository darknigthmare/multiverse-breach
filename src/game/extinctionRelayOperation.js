export const EXTINCTION_RELAY_REQUIRED_TICKS = 180;
export const EXTINCTION_RELAY_RANGE = 1.25;
const identifier = value => typeof value === 'string' && value.trim() ? value : null;
const localize = (fr, en, lang) => lang === 'fr' ? fr : en;

/** Optional run-local state. null leaves every legacy mode on its existing path. */
export function createExtinctionRelayOperation({ enabled = false, runId, mode = 'extraction' } = {}) {
  return enabled === true && mode === 'extraction' && identifier(runId)
    ? { runId, activeBeaconId: null, beacons: {} } : null;
}

const validRun = (operation, run) => operation && run?.runId === operation.runId && run.phase === 'running';
const validTick = value => Number.isSafeInteger(value) && value >= 0;
const liveBeacon = (run, item) => item?.type === 'beacon' && identifier(item.id) && item.used !== true
  && Number.isInteger(item.wave) && item.wave >= 1 && item.wave <= 3 && item.wave === run.wave
  && Array.isArray(run.loot) && run.loot.includes(item)
  && Number.isFinite(item.wx) && Number.isFinite(item.wy);
const inRange = (run, item) => Number.isFinite(run.px) && Number.isFinite(run.py)
  && Math.hypot(run.px - item.wx, run.py - item.wy) < EXTINCTION_RELAY_RANGE;
const entryFor = (operation, id) => operation && Object.hasOwn(operation.beacons, id) ? operation.beacons[id] : null;
const withBeacon = (operation, id, entry, activeBeaconId = operation.activeBeaconId) => ({
  ...operation, activeBeaconId, beacons: { ...operation.beacons, [id]: entry }
});

const feedback = {
  disabled: ['', ''],
  wrong_run: ['Ce relais n’appartient pas à la partie active.', 'This relay does not belong to the active run.'],
  paused: ['Synchronisation en pause.', 'Synchronization paused.'],
  invalid_beacon: ['Cette balise n’est pas disponible.', 'This beacon is unavailable.'],
  out_of_range: ['Approche la balise pour la synchroniser.', 'Move near the beacon to synchronize it.'],
  invalid_tick: ['Synchronisation indisponible pendant cette image.', 'Synchronization is unavailable during this frame.'],
  started: ['Synchronisation lancée : reste près de la balise.', 'Synchronization started: stay near the beacon.'],
  synchronizing: ['Synchronisation en cours : défends le périmètre.', 'Synchronization in progress: defend the perimeter.'],
  ready: ['Synchronisation terminée. Utilise E / LOOT pour stabiliser.', 'Synchronization complete. Use E / LOOT to stabilize.'],
  secured: ['Balise synchronisée et stabilisée.', 'Beacon synchronized and stabilized.'],
  already_secured: ['Cette balise a déjà été stabilisée.', 'This beacon has already been stabilized.'],
  another_beacon: ['Termine la balise déjà activée.', 'Finish the beacon already activated.']
};

function gate(operation, handled, allowCollect, reason, lang) {
  const [fr, en] = feedback[reason];
  return { operation, handled, allowCollect, reason, feedback: localize(fr, en, lang) };
}

/** Call before the existing item.used/reward code. Ordinary loot is untouched. */
export function interactExtinctionRelayOperation(operation, run, item, { paused = false, lang = 'fr' } = {}) {
  if (!operation) return gate(operation, false, true, 'disabled', lang);
  if (item?.type !== 'beacon') return gate(operation, false, true, 'disabled', lang);
  if (!validRun(operation, run)) return gate(operation, true, false, 'wrong_run', lang);
  if (paused || run.paused) return gate(operation, true, false, 'paused', lang);
  const entry = entryFor(operation, item.id);
  if (entry?.status === 'secured') return gate(operation, true, false, 'already_secured', lang);
  if (!liveBeacon(run, item)) return gate(operation, true, false, 'invalid_beacon', lang);
  if (!inRange(run, item)) return gate(operation, true, false, 'out_of_range', lang);
  if (!validTick(run.t)) return gate(operation, true, false, 'invalid_tick', lang);
  if (operation.activeBeaconId && operation.activeBeaconId !== item.id) return gate(operation, true, false, 'another_beacon', lang);
  if (entry?.status === 'ready') return gate(withBeacon(operation, item.id, { ...entry, status: 'secured' }, null), true, true, 'secured', lang);
  if (entry) return gate(operation, true, false, 'synchronizing', lang);
  return gate(withBeacon(operation, item.id, { status: 'synchronizing', ticks: 0, lastTick: run.t, inRange: true }, item.id), true, false, 'started', lang);
}

/** One call per fixed simulation tick; skipped ticks never produce catch-up credit. */
export function tickExtinctionRelayOperation(operation, run, { paused = false } = {}) {
  if (!operation || !validRun(operation, run) || paused || run.paused || !validTick(run.t)) return operation;
  const id = operation.activeBeaconId, entry = entryFor(operation, id);
  if (!entry || entry.status !== 'synchronizing' || run.t <= entry.lastTick) return operation;
  const item = Array.isArray(run.loot) ? run.loot.find(candidate => candidate.id === id) : null;
  if (!liveBeacon(run, item)) return withBeacon(operation, id, { ...entry, lastTick: run.t, inRange: false });
  const withinRange = inRange(run, item);
  const ticks = Math.min(EXTINCTION_RELAY_REQUIRED_TICKS, entry.ticks + (withinRange ? 1 : 0));
  return withBeacon(operation, id, { ...entry, lastTick: run.t, ticks, inRange: withinRange,
    status: ticks === EXTINCTION_RELAY_REQUIRED_TICKS ? 'ready' : 'synchronizing' });
}

export function getExtinctionRelayStatus(operation, beaconId, lang = 'fr') {
  const entry = entryFor(operation, beaconId);
  const status = !operation ? 'disabled' : entry?.status || 'idle';
  const ticks = entry?.ticks || 0;
  const outside = status === 'synchronizing' && entry.inRange === false;
  const text = outside
    ? localize('Synchronisation suspendue : reviens dans le périmètre de la balise.', 'Synchronization suspended: return to the beacon perimeter.', lang)
    : status === 'idle'
    ? localize('Approche la balise et utilise E / LOOT pour commencer.', 'Approach the beacon and use E / LOOT to begin.', lang)
    : localize(...feedback[status], lang);
  const short = {
    disabled: ['', ''], idle: ['Active la balise (E / LOOT)', 'Activate the beacon (E / LOOT)'],
    synchronizing: outside ? ['Reviens dans le périmètre', 'Return to the perimeter'] : ['Maintiens la position', 'Hold your position'],
    ready: ['Stabilise la balise (E / LOOT)', 'Secure the beacon (E / LOOT)'],
    secured: ['Balise stabilisée', 'Beacon secured']
  };
  return { status, ticks, inRange: entry?.inRange ?? null, requiredTicks: EXTINCTION_RELAY_REQUIRED_TICKS,
    progress: ticks / EXTINCTION_RELAY_REQUIRED_TICKS,
    remainingSeconds: Math.ceil((EXTINCTION_RELAY_REQUIRED_TICKS - ticks) / 60), text,
    shortText: localize(...short[status], lang) };
}
