// A custom Melee opponent has a runtime slot ID in addition to its exact
// catalogue ID. Only recognize the slot IDs the Melee roster creates.
export function getOriginalBossMotionId(actor) {
  const id = actor?.id;
  if (typeof id !== 'string') return null;
  if (actor.sourceId == null || actor.sourceId === id) return id;
  const slot = /^(?:p2|cpu-custom):(.+):[0-2]$/.exec(id);
  return slot?.[1] === actor.sourceId ? actor.sourceId : null;
}
