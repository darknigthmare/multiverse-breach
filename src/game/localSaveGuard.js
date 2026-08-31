/**
 * Detect stale local-save writers by retaining the exact raw storage value.
 * This is a synchronous optimistic check, not an inter-tab atomic CAS: callers
 * must serialize competing transactions (for example with Web Locks) when they
 * require protection against truly simultaneous read/compare/write operations.
 */
export const createLocalSaveGuard = (storage, key) => {
  let baseline;
  let hasBaseline = false;

  const rebase = () => {
    try {
      const current = storage.getItem(key);
      baseline = current;
      hasBaseline = true;
      return { ok: true };
    } catch {
      return { ok: false, reason: 'persistence-failed' };
    }
  };

  const check = () => {
    if (!hasBaseline) return { ok: false, reason: 'persistence-failed' };
    try {
      return storage.getItem(key) === baseline
        ? { ok: true }
        : { ok: false, reason: 'save-conflict' };
    } catch {
      return { ok: false, reason: 'persistence-failed' };
    }
  };

  const write = payload => {
    const status = check();
    if (!status.ok) return { saved: false, reason: status.reason };
    try {
      const raw = JSON.stringify(payload);
      if (typeof raw !== 'string') return { saved: false, reason: 'persistence-failed' };

      // A custom toJSON may itself alter storage. Check again after encoding;
      // this still cannot close the separate cross-process CAS race above.
      const encodedStatus = check();
      if (!encodedStatus.ok) return { saved: false, reason: encodedStatus.reason };
      if (raw === baseline) return { saved: true };

      storage.setItem(key, raw);
      baseline = raw;
      return { saved: true };
    } catch {
      // Quota, security and serialization errors leave the accepted baseline
      // untouched so callers can roll back their in-memory transaction.
      return { saved: false, reason: 'persistence-failed' };
    }
  };

  rebase();
  return {
    write,
    check,
    // Only use when explicitly adopting storage after an authorized import or
    // reset. A conflict must never be silently resolved by automatic rebasing.
    rebase
  };
};
