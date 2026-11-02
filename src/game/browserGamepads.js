/** Optional gamepad access must not interrupt keyboard or touch gameplay. */
export function readBrowserGamepads() {
  try {
    const platform = typeof navigator === 'undefined' ? null : navigator;
    return typeof platform?.getGamepads === 'function' ? platform.getGamepads() : [];
  } catch {
    // Permissions Policy and browser privacy restrictions may deny this API.
    return [];
  }
}
