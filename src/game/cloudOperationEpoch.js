/** Invalidate all older async UI work before changing an account or local trace. */
export function createCloudOperationEpoch() {
  let generation = 0;
  return {
    invalidate() { generation++; },
    capture() { const expected = generation; return () => expected === generation; }
  };
}
