import { getSurfacesAt } from './tacticsTerrain.js';

// Keyboard arrows move an inspection cursor, never a combat unit. Prefer the
// visible support nearest the current altitude at the neighboring coordinate.
export function getTacticsCursorDestination(terrain, selected, dx, dy, isVisible = () => true) {
  if (!selected || !Number.isInteger(dx) || !Number.isInteger(dy) || Math.abs(dx) + Math.abs(dy) !== 1) return null;
  const x = selected.x ?? selected.gridX, y = selected.y ?? selected.gridY;
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return [...getSurfacesAt(terrain, x + dx, y + dy)]
    .filter(surface => isVisible(surface.id))
    .sort((a, b) => Math.abs(a.z - selected.z) - Math.abs(b.z - selected.z) || a.z - b.z)[0] || null;
}
