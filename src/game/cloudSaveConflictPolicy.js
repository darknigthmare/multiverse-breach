export const CLOUD_SAVE_CONFLICT_ACTIONS = Object.freeze({
  NOOP: 'noop',
  UPLOAD_LOCAL: 'upload-local',
  LOAD_CLOUD: 'load-cloud',
  REQUIRE_CONFIRMATION: 'require-confirmation'
});

export const CLOUD_SAVE_CONFLICT_REASONS = Object.freeze({
  NO_TRACE: 'no-trace',
  LOCAL_TRACE_ONLY: 'local-trace-only',
  CLOUD_TRACE_ONLY: 'cloud-trace-only',
  EQUIVALENT_TRACES: 'equivalent-traces',
  DIVERGENT_TRACES: 'divergent-traces'
});

const isPresent = value => value !== null && value !== undefined;

// Save payloads are JSON values. Sorting object keys makes equality stable
// across Supabase and localStorage without changing meaningful array order.
const canonicalizeJsonValue = value => {
  if (Array.isArray(value)) {
    return value.map(item => canonicalizeJsonValue(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .filter(key => value[key] !== undefined)
        .sort()
        .map(key => [key, canonicalizeJsonValue(value[key])])
    );
  }

  return value;
};

export const serializeCloudSavePayload = payload => JSON.stringify(canonicalizeJsonValue(payload));

export const areCloudSavePayloadsEquivalent = (localPayload, cloudPayload) => (
  serializeCloudSavePayload(localPayload) === serializeCloudSavePayload(cloudPayload)
);

const decision = (action, reason) => Object.freeze({
  action,
  reason,
  requiresConfirmation: action === CLOUD_SAVE_CONFLICT_ACTIONS.REQUIRE_CONFIRMATION
});

/**
 * Selects the only safe automatic action for two save snapshots.
 *
 * `localHasTrace` and `cloudHasTrace` describe meaningful player traces, not
 * merely the presence of a default payload. When both meaningful traces exist,
 * differing content is never overwritten without explicit confirmation.
 */
export const resolveCloudSaveConflict = ({
  localPayload = null,
  cloudPayload = null,
  localHasTrace = isPresent(localPayload),
  cloudHasTrace = isPresent(cloudPayload)
} = {}) => {
  if (!localHasTrace && !cloudHasTrace) {
    return decision(CLOUD_SAVE_CONFLICT_ACTIONS.NOOP, CLOUD_SAVE_CONFLICT_REASONS.NO_TRACE);
  }

  if (localHasTrace && !cloudHasTrace) {
    return decision(
      CLOUD_SAVE_CONFLICT_ACTIONS.UPLOAD_LOCAL,
      CLOUD_SAVE_CONFLICT_REASONS.LOCAL_TRACE_ONLY
    );
  }

  if (!localHasTrace && cloudHasTrace) {
    return decision(
      CLOUD_SAVE_CONFLICT_ACTIONS.LOAD_CLOUD,
      CLOUD_SAVE_CONFLICT_REASONS.CLOUD_TRACE_ONLY
    );
  }

  if (areCloudSavePayloadsEquivalent(localPayload, cloudPayload)) {
    return decision(
      CLOUD_SAVE_CONFLICT_ACTIONS.NOOP,
      CLOUD_SAVE_CONFLICT_REASONS.EQUIVALENT_TRACES
    );
  }

  return decision(
    CLOUD_SAVE_CONFLICT_ACTIONS.REQUIRE_CONFIRMATION,
    CLOUD_SAVE_CONFLICT_REASONS.DIVERGENT_TRACES
  );
};
