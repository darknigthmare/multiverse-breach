const BOSS_ID = 'tawantinsuyu_split_sun:pachakuti_du_soleil_noir';
const BOSS_UNIVERSE = 'Tawantinsuyu: The Split Sun';
const BOSS_ATLAS = '/sprites/generated/bosses/tawantinsuyu-the-split-sun/pachakuti-du-soleil-noir.png';

// Keep the original environmental boss legible even if its atlas fails to
// load. The regular humanoid fallback would depict an unrelated combatant.
export function drawPachakutiFallback(ctx, x, y, boss, targetHeight, facing) {
  if (boss?.id !== BOSS_ID || boss.weapon !== 'world_power') return false;
  const native = boss.universe === BOSS_UNIVERSE && (!boss.sourceUniverse || boss.sourceUniverse === BOSS_UNIVERSE);
  const projected = boss.sourceUniverse === BOSS_UNIVERSE && boss.spriteSource === BOSS_ATLAS;
  if (!native && !projected) return false;

  const scale = targetHeight / 126;
  const striking = boss.state === 'attack' || boss.state === 'special';
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scale, scale);
  ctx.fillStyle = '#140f22';
  ctx.strokeStyle = boss.state === 'hit' ? '#cca1f2' : '#f4b478';
  ctx.lineWidth = striking ? 2.6 : 1.5;
  ctx.beginPath();
  ctx.arc(0, -73, striking ? 23 : 21, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#72554f';
  ctx.strokeStyle = '#d6a66c';
  ctx.lineWidth = 1;
  for (const ledge of [
    [[-52, -31], [-39, -42], [-26, -44], [-11, -38], [-10, -27], [-32, -23]],
    [[11, -40], [26, -45], [49, -35], [52, -27], [41, -23], [16, -29]],
    [[-56, -12], [-44, -22], [-27, -19], [-12, -15], [-13, -5], [-26, -1], [-49, -5]],
    [[3, -13], [18, -24], [35, -18], [52, -12], [46, -4], [33, 0], [10, -5]],
  ]) {
    ctx.beginPath();
    ctx.moveTo(...ledge[0]);
    for (const vertex of ledge.slice(1)) ctx.lineTo(...vertex);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.strokeStyle = striking ? '#ffc3ef' : '#b267ca';
  ctx.lineWidth = striking ? 2.6 : 1.4;
  ctx.beginPath();
  ctx.moveTo(-3, -38);
  ctx.lineTo(-7, -26);
  ctx.lineTo(-3, -21);
  ctx.lineTo(-8, -14);
  ctx.lineTo(-5, -7);
  ctx.stroke();
  ctx.restore();
  return true;
}
