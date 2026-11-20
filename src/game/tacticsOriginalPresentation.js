const material = (family, top, mid, side, underside, detail, accent, edge, sideFamily = family) =>
  ({ family, sideFamily, top, mid, side, underside, detail, accent, edge });

export const TACTICS_ORIGINAL_MATERIALS = Object.freeze({
  'ashline-grass': material('grass', '#6d7850', '#596344', '#77634c', '#44392e', '#a0a56c', '#c5bd86', '#9d9a65', 'strata'),
  'ashline-mud': material('mud', '#64533f', '#524534', '#473b2e', '#2e291f', '#917b57', '#b49b6d', '#8c7b55', 'strata'),
  'ashline-gravel': material('gravel', '#9b9986', '#817f6d', '#6d6251', '#413b30', '#d1cbbb', '#e5d9bc', '#b8ad92', 'strata'),
  'ashline-rock': material('rock', '#77776b', '#606458', '#4f5148', '#32382e', '#aaa792', '#cec2a2', '#a5a18a', 'strata'),
  'ashline-planks': material('wood', '#97764d', '#7b5d3d', '#674b33', '#3c2e23', '#c49f6d', '#dfbd83', '#b99a67'),
  'dead-calm-channel': material('water', '#265a69', '#204656', '#163643', '#101f29', '#6caca9', '#a4cbc1', '#699da0'),
  'dead-calm-silt': material('mud', '#635249', '#51443c', '#483e36', '#2d2a28', '#968073', '#bca496', '#a18b7d'),
  'dead-calm-shingle': material('gravel', '#80847b', '#68766e', '#5e6460', '#3b4745', '#a1b4aa', '#c2cec0', '#a2b4ab', 'strata'),
  'dead-calm-towpath': material('wood', '#887458', '#6b624d', '#594f43', '#392e26', '#b39b75', '#dbbf8b', '#ad9370'),
  'dead-calm-wreck': material('wood', '#976343', '#75513a', '#513a2e', '#392820', '#b8815a', '#dec09a', '#b88d63'),
  'dead-calm-reef': material('rock', '#525f63', '#3e535d', '#35444e', '#233039', '#788789', '#a7b9b2', '#7b9393', 'strata'),
  'greywake-causeway': material('stone', '#3c5d65', '#2b4852', '#28424c', '#172632', '#63949c', '#81c1cb', '#71a9b6'),
  'greywake-crypt': material('rock', '#2d424a', '#223640', '#1f2e3d', '#15212b', '#527581', '#72a4ab', '#5f8e95'),
  'greywake-gallery': material('panel', '#494b6b', '#383953', '#2e304f', '#1f2038', '#8c7fa0', '#d7abef', '#a184bc'),
  'greywake-amethyst': material('panel', '#5d4273', '#432e5b', '#3a2c56', '#221a3b', '#b68be6', '#f0b6ff', '#c193e9'),
  'greywake-verdigris': material('panel', '#346468', '#274c51', '#243d44', '#17282f', '#79baae', '#abffdb', '#84cbbb'),
  'valedor-commonway': material('stone', '#7d7965', '#696754', '#575746', '#40392f', '#a8a38a', '#d7c7a2', '#b8a88b'),
  'valedor-garden': material('grass', '#648653', '#4e7144', '#6c6245', '#474031', '#93b779', '#c5d58b', '#a7ba83', 'strata'),
  'valedor-forge': material('stone', '#99816e', '#846956', '#694b3c', '#49352e', '#c3a181', '#f1ba88', '#cba487'),
  'valedor-basalt': material('rock', '#514e57', '#443f47', '#39323c', '#292630', '#827286', '#c1a4ab', '#9c858d'),
  'valedor-market': material('wood', '#997149', '#805b3b', '#6a4933', '#463129', '#c1956a', '#dfb982', '#c09770'),
  'qhapaq-trail': material('earth', '#9c7c59', '#826249', '#654d3d', '#412f27', '#bd9b6e', '#e4bb78', '#bd9d74', 'strata'),
  'qhapaq-wall': material('stone', '#9a9484', '#81796c', '#655f55', '#41403c', '#b7b0a1', '#d6c6a1', '#c1b5a0'),
  'qhapaq-crag': material('rock', '#797783', '#646470', '#50505e', '#353441', '#9b99a5', '#c1b2bc', '#a29ba8', 'strata'),
  'qhapaq-pampa': material('grass', '#8a8453', '#706c49', '#665340', '#42362e', '#a49d62', '#d9c97e', '#b6a971', 'strata'),
  'infernum-clinker': material('rock', '#53353d', '#442b34', '#37262c', '#2a1c25', '#8d5965', '#b17c76', '#946570'),
  'infernum-iron': material('grate', '#6c4e4d', '#513939', '#442b2e', '#271c25', '#a17b6e', '#eca471', '#b28273'),
  'infernum-obsidian': material('rock', '#41323d', '#342735', '#312331', '#221923', '#71566a', '#a76f8c', '#885e79'),
  'infernum-lava': material('lava', '#c14f2e', '#9e3027', '#6d2e30', '#421d28', '#f79658', '#ffcc72', '#f67b53')
});

export const TACTICS_ORIGINAL_ENVIRONMENTS = Object.freeze({
  'iron-ashline': {
    sky: ['#59645f', '#a9ac98'], ground: '#4f5141', haze: '#c2b995',
    far: '#7c8270', near: '#5d6852', ridge: 'hills', flora: 'steppe',
    accent: '#d0b987', architecture: 'none'
  },
  'dead-calm-graveyard': {
    sky: ['#102a43', '#45707a'], ground: '#263d4a', haze: '#a7bbad',
    far: '#4a6570', near: '#334d5b', ridge: 'lowlands', flora: 'none',
    accent: '#e3b66f', architecture: 'dead-calm-wrecks'
  },
  'greywake-observatory': {
    sky: ['#071b24', '#172b3b'], ground: '#182b36', haze: '#9c88b5',
    far: '#324358', near: '#203442', ridge: 'spires', flora: 'none',
    accent: '#c77dff', architecture: 'greywake-observatory'
  },
  'valedor-crossroads': {
    sky: ['#243954', '#9ea99d'], ground: '#4e5349', haze: '#e0bd8b',
    far: '#6d807d', near: '#495654', ridge: 'hills', flora: 'broadleaf',
    accent: '#f4a261', architecture: 'valedor-crossroads'
  },
  'qhapaq-terraces': {
    sky: ['#294c60', '#a6a89e'], ground: '#4f4840', haze: '#dbbd90',
    far: '#74828a', near: '#615c60', ridge: 'valley', flora: 'steppe',
    accent: '#e9c46a', architecture: 'qhapaq-terraces'
  },
  'infernum-auditors': {
    sky: ['#260808', '#5d2728'], ground: '#31212a', haze: '#ad5940',
    far: '#673a40', near: '#49313f', ridge: 'basalt', flora: 'none',
    accent: '#f29b57', architecture: 'infernum-auditors'
  }
});

const outline = (ctx, points) => {
  ctx.beginPath();
  ctx.moveTo(...points[0]);
  for (const point of points.slice(1)) ctx.lineTo(...point);
  ctx.closePath();
};

export function drawOriginalTacticsLandmarks(ctx, profile, width, horizon, pan) {
  if (profile.architecture === 'dead-calm-wrecks') {
    for (const [position, scale, lean] of [[0.23, 0.8, -1], [0.72, 1, 1]]) {
      ctx.save();
      ctx.translate(position * width + pan, horizon + 10);
      ctx.scale(scale * lean, scale);
      ctx.fillStyle = '#223844';
      outline(ctx, [[-65, -1], [-47, 8], [46, 7], [68, -12], [21, -6], [-41, -15]]);
      ctx.fill();
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#293e49';
      ctx.beginPath();
      ctx.moveTo(-18, -4); ctx.lineTo(-23, -64);
      ctx.moveTo(16, -4); ctx.lineTo(8, -46);
      ctx.moveTo(-38, -47); ctx.lineTo(3, -56);
      ctx.stroke();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#52636a';
      ctx.beginPath();
      ctx.moveTo(-23, -60); ctx.lineTo(-60, -9);
      ctx.moveTo(-23, -60); ctx.lineTo(31, -7);
      ctx.stroke();
      ctx.restore();
    }
    return true;
  }
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
  if (profile.architecture === 'qhapaq-terraces') {
    ctx.save();
    ctx.translate(width * 0.62 + pan, horizon + 4);
    for (const [x, y, color] of [[-56, 0, '#4a4547'], [-40, -13, '#756759'], [-18, -26, '#9f8768']]) {
      ctx.fillStyle = color;
      outline(ctx, [[x - 12, y + 12], [x, y], [x + 78, y - 9], [x + 91, y - 2], [x + 78, y + 6]]);
      ctx.fill();
    }
    ctx.restore();
    return true;
  }
  if (profile.architecture === 'infernum-auditors') {
    ctx.save();
    ctx.translate(width * 0.59 + pan, horizon + 16);
    for (const [x, h] of [[-41, 50], [2, 76], [39, 43]]) {
      ctx.fillStyle = '#341f2a';
      outline(ctx, [[x - 13, 0], [x - 10, -h], [x + 8, -h - 12], [x + 13, 0]]);
      ctx.fill();
      ctx.fillStyle = '#e08e51';
      ctx.fillRect(x - 2, -h + 10, 3, h * 0.36);
    }
    ctx.restore();
    return true;
  }
  return false;
}

export function drawDeadCalmWreck(ctx, { obstacle, point, width, height }) {
  if (obstacle?.sceneryKind !== 'dead-calm-wreck') return false;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.scale(width, height);
  ctx.fillStyle = '#654734';
  outline(ctx, [[-0.5, -0.83], [-0.22, -0.56], [0.19, -0.42], [0.48, -0.12], [0.25, -0.02], [-0.29, -0.04]]);
  ctx.fill();
  ctx.lineWidth = 0.045;
  ctx.strokeStyle = '#c09b75';
  ctx.beginPath();
  ctx.moveTo(-0.42, -0.48); ctx.lineTo(-0.47, -0.96);
  ctx.moveTo(-0.19, -0.32); ctx.lineTo(-0.23, -0.72);
  ctx.moveTo(0.07, -0.2); ctx.lineTo(0.03, -0.56);
  ctx.moveTo(-0.38, -0.32); ctx.lineTo(0.32, -0.1);
  ctx.stroke();
  ctx.restore();
  return true;
}

export function drawInfernumLedger(ctx, { obstacle, point, width, height }) {
  if (obstacle?.sceneryKind !== 'infernum-ledger') return false;
  ctx.save();
  ctx.translate(point.x, point.y);
  ctx.scale(width, height);
  ctx.fillStyle = '#331d26';
  ctx.fillRect(-0.34, -0.42, 0.68, 0.42);
  ctx.fillStyle = '#6f4141';
  outline(ctx, [[-0.46, -0.5], [-0.38, -0.92], [0.34, -0.92], [0.46, -0.5]]);
  ctx.fill();
  ctx.fillStyle = '#c49a70';
  outline(ctx, [[-0.36, -0.57], [-0.31, -0.87], [-0.03, -0.84], [0.3, -0.87], [0.35, -0.57], [-0.03, -0.53]]);
  ctx.fill();
  ctx.fillStyle = '#693942';
  for (const row of [-0.81, -0.74, -0.67]) {
    ctx.fillRect(-0.26, row, 0.19, 0.02);
    ctx.fillRect(0.03, row, 0.21, 0.02);
  }
  ctx.fillStyle = '#e89b56';
  ctx.fillRect(-0.07, -0.52, 0.14, 0.13);
  ctx.restore();
  return true;
}
