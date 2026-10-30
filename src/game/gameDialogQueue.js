/** Resolve one explicit decision at a time. Stale buttons cannot settle a newer dialog. */
export function createGameDialogQueue(onChange) {
  let sequence = 0;
  const pending = [];
  return {
    request(options) {
      return new Promise(resolve => {
        pending.push({ ...options, id: ++sequence, resolve });
        if (pending.length === 1) onChange(pending[0]);
      });
    },
    settle(id, value) {
      if (!pending.length || pending[0].id !== id) return false;
      const request = pending.shift();
      request.resolve(value);
      onChange(pending[0] || null);
      return true;
    },
    cancelAll() {
      const cancelled = pending.splice(0);
      for (const request of cancelled) request.resolve(null);
    }
  };
}
