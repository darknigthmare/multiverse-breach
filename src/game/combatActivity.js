/** Whether one simulation step advances gameplay rather than presentation.
 * Sample before update(): a cinematic ending in this step must not turn the
 * preceding frozen steps of a catch-up batch into active gameplay time.
 */
export function isCombatGameplayAdvancing(engine) {
  return !!engine && !engine.disposed && !engine.paused && !engine.gameOver
    && !engine.isTargetingPaused?.() && !engine.isMatchInputLocked?.()
    && !engine.signatureDirector?.freezesWorld;
}
