// A resource belongs to one walkable surface. XY alone cannot identify it on a
// bridge, and an old resource without a surface ID stays on the flat-map path.
export function isTacticsPickupAtSurface(pickup, gridX, gridY, surfaceId = null) {
  if (!pickup || pickup.used || pickup.gridX !== gridX || pickup.gridY !== gridY) return false;
  return surfaceId == null ? pickup.surfaceId == null : pickup.surfaceId === surfaceId;
}
