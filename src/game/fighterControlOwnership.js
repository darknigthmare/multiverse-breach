/** A held input belongs to the current fighter, not to the next roster member.
 * Synchronize both before dispatching input and after simulation (forced KO
 * swaps can happen there). Clearing one side must not affect the other player.
 */
export function synchronizeFighterControlOwners(engine, inputRef, ownersRef) {
  if (!engine || engine.disposed || !inputRef || !ownersRef) return;
  let owners = ownersRef.current;
  if (!owners || owners.engine !== engine) {
    owners = { engine };
    ownersRef.current = owners;
  }
  for (const side of ['player', 'cpu']) {
    const actor = engine.getActive(side);
    if (owners[side] !== actor) {
      inputRef.current[side] = {};
      engine.clearSideInput(side);
      owners[side] = actor;
    }
  }
}
