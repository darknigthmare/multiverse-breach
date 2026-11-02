/** A mounted battle may report its outcome more than once; progression must not. */
export function createBattleCompletionGate() {
  let sequence = 0;
  let current = null;
  return {
    begin() {
      current = { id: ++sequence, settled: false };
      return current.id;
    },
    claim(id, result) {
      if (!current || current.id !== id || current.settled || !['victory', 'defeat', 'quit'].includes(result)) return false;
      current.settled = true;
      return true;
    },
    invalidate() { current = null; }
  };
}
