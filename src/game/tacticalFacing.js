const DIRECTIONS = [
  { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }, { x: -1, y: 1 },
  { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 }
];

export const getGridFacingVector = unit => {
  const vector = unit?.facingVector;
  if (Number.isFinite(vector?.x) && Number.isFinite(vector?.y) && (vector.x || vector.y)) {
    return { x: Math.sign(vector.x), y: Math.sign(vector.y) };
  }
  return { x: unit?.facing === -1 ? -1 : 1, y: 0 };
};

// Grid heading drives back/flank rules. The horizontal sprite mirror remains
// stable for a purely vertical turn: side-view art cannot depict north/south.
export const faceGridUnitToward = (unit, target) => {
  const dx = (target?.gridX ?? target?.x) - (unit?.gridX ?? unit?.x);
  const dy = (target?.gridY ?? target?.y) - (unit?.gridY ?? unit?.y);
  if (!unit || !Number.isFinite(dx) || !Number.isFinite(dy) || (!dx && !dy)) return false;
  const index = (Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) + 8) % 8;
  unit.facingVector = { ...DIRECTIONS[index] };
  if (dx) unit.facing = Math.sign(dx);
  return true;
};

export const getGridFacingBonus = (attacker, defender) => {
  const neutral = { bonus: 0, label: null };
  if (!defender || (!defender.facingVector && defender.facing !== 1 && defender.facing !== -1)) return neutral;
  const dx = attacker?.gridX - defender.gridX;
  const dy = attacker?.gridY - defender.gridY;
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || (!dx && !dy)) return neutral;
  const facing = getGridFacingVector(defender);
  const dot = dx * facing.x + dy * facing.y;
  if (dot < 0) return { bonus: 0.25, label: 'BACK' };
  if (dot === 0 && Math.abs(dx) + Math.abs(dy) <= 2) return { bonus: 0.12, label: 'FLANK' };
  return neutral;
};
