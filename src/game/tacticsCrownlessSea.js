export const LANTERN_SHIP_ID = 'tactics_crownless_lantern_ship';
export const LANTERN_SHIP_UNIVERSE = 'The Crownless Sea';

// The original campaign describes a mission vessel, with its own geometry
// drawn at the surface position reported by the terrain simulation.
export function drawDeadCalmLanternShip(ctx, unit, scale) {
  ctx.save();
  ctx.translate(unit.x, unit.y);
  ctx.scale(scale * (unit.facing === -1 ? -1 : 1), scale);
  ctx.beginPath();
  ctx.moveTo(-24, -9);
  ctx.lineTo(23, -9);
  ctx.lineTo(15, -1);
  ctx.lineTo(-14, -1);
  ctx.closePath();
  ctx.fillStyle = unit.currentHp > 0 ? '#754930' : '#352c2b';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#d4ad70';
  ctx.beginPath();
  ctx.moveTo(-22, -9);
  ctx.lineTo(21, -9);
  ctx.moveTo(-4, -9);
  ctx.lineTo(-4, -27);
  ctx.lineTo(6, -27);
  ctx.stroke();
  if (unit.currentHp > 0) {
    ctx.fillStyle = '#ffc774';
    ctx.fillRect(2, -26, 8, 10);
    ctx.fillStyle = '#fff2bd';
    ctx.fillRect(4, -24, 4, 6);
  }
  ctx.restore();
}
