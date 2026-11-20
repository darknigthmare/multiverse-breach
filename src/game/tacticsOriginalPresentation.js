const material = (family, top, mid, side, underside, detail, accent, edge, sideFamily = family) =>
  ({ family, sideFamily, top, mid, side, underside, detail, accent, edge });

export const TACTICS_ORIGINAL_MATERIALS = Object.freeze({
  'greywake-causeway': material('stone', '#3c5d65', '#2b4852', '#28424c', '#172632', '#63949c', '#81c1cb', '#71a9b6'),
  'greywake-crypt': material('rock', '#2d424a', '#223640', '#1f2e3d', '#15212b', '#527581', '#72a4ab', '#5f8e95'),
  'greywake-gallery': material('panel', '#494b6b', '#383953', '#2e304f', '#1f2038', '#8c7fa0', '#d7abef', '#a184bc'),
  'greywake-amethyst': material('panel', '#5d4273', '#432e5b', '#3a2c56', '#221a3b', '#b68be6', '#f0b6ff', '#c193e9'),
  'greywake-verdigris': material('panel', '#346468', '#274c51', '#243d44', '#17282f', '#79baae', '#abffdb', '#84cbbb'),
  'valedor-commonway': material('stone', '#7d7965', '#696754', '#575746', '#40392f', '#a8a38a', '#d7c7a2', '#b8a88b'),
  'valedor-garden': material('grass', '#648653', '#4e7144', '#6c6245', '#474031', '#93b779', '#c5d58b', '#a7ba83', 'strata'),
  'valedor-forge': material('stone', '#99816e', '#846956', '#694b3c', '#49352e', '#c3a181', '#f1ba88', '#cba487'),
  'valedor-basalt': material('rock', '#514e57', '#443f47', '#39323c', '#292630', '#827286', '#c1a4ab', '#9c858d'),
  'valedor-market': material('wood', '#997149', '#805b3b', '#6a4933', '#463129', '#c1956a', '#dfb982', '#c09770')
});

export const TACTICS_ORIGINAL_ENVIRONMENTS = Object.freeze({
  'greywake-observatory': {
    sky: ['#071b24', '#172b3b'], ground: '#182b36', haze: '#9c88b5',
    far: '#324358', near: '#203442', ridge: 'spires', flora: 'none',
    accent: '#c77dff', architecture: 'greywake-observatory'
  },
  'valedor-crossroads': {
    sky: ['#243954', '#9ea99d'], ground: '#4e5349', haze: '#e0bd8b',
    far: '#6d807d', near: '#495654', ridge: 'hills', flora: 'broadleaf',
    accent: '#f4a261', architecture: 'valedor-crossroads'
  }
});

const outline = (ctx, points) => {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath();
};

export function drawOriginalTacticsLandmarks(ctx, profile, width, horizon, pan) {
  if (profile.architecture === 'greywake-observatory') {
    ctx.save();
    ctx.translate(width * 0.75 + pan, horizon + 28);
    ctx.fillStyle = '#172936';
    outline(ctx, [[-48, 12], [-31, -21], [-27, -63], [-10, -63], [18, -34], [31, 12]]);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#645281';
    for (const [x, y, radius, tilt] of [[-12, -45, 25, -0.42], [15, -34, 35, 0.38], [18, -45, 19, 1.05]]) {
      ctx.beginPath();
      ctx.ellipse(x, y, radius, radius * 0.36, tilt, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#c491e8';
    outline(ctx, [[14, -56], [20, -44], [14, -34], [8, -44]]);
    ctx.fill();
    ctx.restore();
    return true;
  }
  if (profile.architecture === 'valedor-crossroads') {
    ctx.save();
    for (const [index, roofColor] of ['#556d50', '#915c48', '#6c555c', '#937451'].entries()) {
      const x = width * (0.2 + 0.19 * index) + pan;
      const y = horizon + 23;
      ctx.fillStyle = '#495050';
      ctx.fillRect(x - 21, y - 29, 42, 37);
      ctx.fillStyle = roofColor;
      outline(ctx, [[x - 29, y - 28], [x + (index % 2 ? 5 : -5), y - 51], [x + 28, y - 28]]);
      ctx.fill();
      ctx.fillStyle = '#d29c61';
      ctx.fillRect(x - 8, y - 18, 3, 6);
      ctx.fillRect(x + 6, y - 18, 3, 6);
    }
    ctx.restore();
    return true;
  }
  return false;
}
