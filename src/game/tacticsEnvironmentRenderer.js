// Dedicated environments for every Tactics board, including source sectors
// and the older Nexus grids. These draw the horizon around real geometry;
// they never borrow another engine's backdrop or define a walkable tile.
const PROFILES = Object.freeze({
  'nibel-crags': {
    sky: ['#596c7d', '#a6b1b0'], ground: '#374847', haze: '#bac4bc',
    far: '#727d82', near: '#4c5963', ridge: 'spires', flora: 'none',
    accent: '#94c99c', architecture: 'mako-industrial'
  },
  archylte: {
    sky: ['#729cae', '#d0d8bd'], ground: '#6c884b', haze: '#c6cfac',
    far: '#8d9d80', near: '#627c59', ridge: 'mesas', flora: 'steppe',
    accent: '#b7c783', architecture: 'none'
  },
  wetlands: {
    sky: ['#748e8a', '#b5c6ae'], ground: '#476b5c', haze: '#c7d2bc',
    far: '#81998a', near: '#506f60', ridge: 'lowlands', flora: 'reeds',
    accent: '#a9bba1', architecture: 'wooden-boardwalk'
  },
  alpine: {
    sky: ['#7b94a8', '#c6d3d7'], ground: '#8c9ba4', haze: '#d8e0dd',
    far: '#a2b2bd', near: '#687e91', ridge: 'snow-peaks', flora: 'none',
    accent: '#eff3e9', architecture: 'none'
  },
  woodland: {
    sky: ['#7f9c9a', '#c4d1af'], ground: '#4c6945', haze: '#c8d3b7',
    far: '#839c79', near: '#4e7154', ridge: 'hills', flora: 'broadleaf',
    accent: '#b7c491', architecture: 'gondorian-ruins'
  },
  'enchanted-forest': {
    sky: ['#273c49', '#708282'], ground: '#2e453c', haze: '#8b9c91',
    far: '#47615d', near: '#2b4941', ridge: 'hills', flora: 'old-forest',
    accent: '#b3c6ab', architecture: 'old-stone'
  },
  volcanic: {
    sky: ['#7b5147', '#c79a72'], ground: '#51413c', haze: '#d2ad87',
    far: '#9d7766', near: '#68544d', ridge: 'basalt', flora: 'none',
    accent: '#e7a15c', architecture: 'prothean-industrial'
  },
  'forerunner-valley': {
    sky: ['#7a9cae', '#cbd6cd'], ground: '#587951', haze: '#d2ddcb',
    far: '#879d9a', near: '#5c7873', ridge: 'valley', flora: 'conifers',
    accent: '#c6d4d1', architecture: 'forerunner'
  }
});
const LEGACY_PROFILES = Object.freeze({
  nexus: { sky: ['#10232f', '#33525c'], ground: '#203b44', haze: '#75a5aa', far: '#466773', near: '#294c58', ridge: 'city', flora: 'none', accent: '#7fbbb5', architecture: 'none' },
  industrial: { sky: ['#35434e', '#82918f'], ground: '#455258', haze: '#b9c5be', far: '#6c7f85', near: '#4b626b', ridge: 'city', flora: 'none', accent: '#a2bfc0', architecture: 'none' },
  stone: { sky: ['#677f8a', '#b1bdae'], ground: '#666b53', haze: '#c3c7b3', far: '#899884', near: '#647b68', ridge: 'hills', flora: 'broadleaf', accent: '#bdc6a1', architecture: 'old-stone' },
  desert: { sky: ['#879b9b', '#d2c3a0'], ground: '#a18761', haze: '#d9cbab', far: '#b09f81', near: '#88785e', ridge: 'mesas', flora: 'none', accent: '#d2bf93', architecture: 'none' }
});

const finite = (number, fallback) => Number.isFinite(number) ? number : fallback;
const clamp = (value, low, high) => Math.max(low, Math.min(high, value));
const seedOf = value => Array.from(String(value || '')).reduce((total, character) => (total * 31 + character.charCodeAt(0)) >>> 0, 7);
const unit = (seed, index) => ((seed + index * 127) % 997) / 997;
const alpha = (hex, opacity) => {
  const color = String(hex).replace('#', '');
  return 'rgba(' + parseInt(color.slice(0, 2), 16) + ',' + parseInt(color.slice(2, 4), 16) + ',' + parseInt(color.slice(4, 6), 16) + ',' + opacity + ')';
};

export const TACTICS_ENVIRONMENT_BIOMES = Object.freeze(Object.keys(PROFILES));

export function getTacticsEnvironmentProfile(battlefield, mode = 'Tactics', options = {}) {
  if (mode !== 'Tactics' || !battlefield?.id) return null;
  if (options.forceBaseArena || options.dlcSuppressedArena) {
    return {
      ...LEGACY_PROFILES.nexus, biome: 'tactical-nexus', skyline: LEGACY_PROFILES.nexus.ridge,
      id: 'tactics:nexus-base', universe: 'Nexus de Convergence', location: 'Nexus', work: '',
      weather: 'clear', sourceSpecific: false, source1to1Verified: false, usesSharedBackdrop: false,
      adaptation: 'Original Nexus tactical-board landscape.'
    };
  }
  const presentation = battlefield?.tacticsPresentation;
  if (!presentation) {
    const material = battlefield.tileTheme && typeof battlefield.tileTheme === 'object' ? battlefield.tileTheme : {};
    const universe = battlefield.source?.universe || battlefield.sourceUniverse || options.universe || '';
    const description = [universe, battlefield.id, material.pattern, typeof battlefield.tileTheme === 'string' ? battlefield.tileTheme : '', ...(battlefield.tags || [])].join(' ').toLowerCase();
    const legacyKind = /nexus|convergence/.test(description) ? 'nexus'
      : /snow|frost|ice|alpine/.test(description) ? 'alpine'
        : /lava|volcan|infernal|molten/.test(description) ? 'volcanic'
          : /desert|sand|dune/.test(description) ? 'desert'
            : /water|swamp|marsh|wetland|ocean/.test(description) ? 'wetlands'
              : /circuit|glass|armor|alloy|hangar|steel|prison|lab|facility|urban|cyber/.test(description) ? 'industrial'
                : /organic|roots|moss|forest|grass|wood|garden/.test(description) ? 'woodland' : 'stone';
    const selected = LEGACY_PROFILES[legacyKind] || PROFILES[legacyKind];
    const colors = {};
    if (/^#[0-9a-f]{6}$/i.test(material.base)) colors.ground = material.base;
    if (/^#[0-9a-f]{6}$/i.test(material.mid)) colors.near = material.mid;
    if (/^#[0-9a-f]{6}$/i.test(material.detail)) colors.accent = material.detail;
    return {
      ...selected, ...colors, biome: 'tactical-' + legacyKind, skyline: selected.ridge,
      id: 'tactics:' + battlefield.id + ':' + universe,
      universe, location: battlefield.label?.en || battlefield.id, work: '',
      weather: 'clear', sourceSpecific: false, source1to1Verified: false,
      usesSharedBackdrop: false,
      adaptation: 'Original tactical-board landscape using the universe material family; no exact source location is claimed.'
    };
  }
  if (battlefield.modeExclusive !== 'Tactics' || battlefield.formatVersion !== 2 || !PROFILES[presentation.biome]) return null;
  const selected = PROFILES[presentation.biome];
  // An authored palette may tune an original sector. It does not select another
  // universe's image or make an arbitrary background path part of the runtime.
  const palette = Object.fromEntries(Object.entries(presentation.palette || {})
    .filter(([key, value]) => ['ground', 'haze', 'far', 'near', 'accent'].includes(key) && /^#[0-9a-f]{6}$/i.test(value)));
  return {
    ...selected, ...palette, biome: presentation.biome,
    architecture: presentation.architecture || selected.architecture,
    skyline: presentation.skyline || selected.ridge,
    weather: presentation.weather || 'clear',
    id: battlefield.layoutId || battlefield.id,
    universe: battlefield.source?.universe || '',
    location: battlefield.source?.location || '',
    work: battlefield.source?.work || '',
    sourceSpecific: true,
    source1to1Verified: false,
    usesSharedBackdrop: false
  };
}

function polygon(ctx, points, color) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
  for (const point of points.slice(1)) ctx.lineTo(point[0], point[1]);
  ctx.closePath(); ctx.fillStyle = color; ctx.fill();
}

function ridge(ctx, width, horizon, profile, seed, back, pan) {
  const peakCount = profile.ridge === 'spires' ? 11 : profile.ridge === 'mesas' ? 7 : 9;
  const floor = horizon + (back ? 14 : 34), color = back ? profile.far : profile.near;
  const height = horizon * (back ? 0.36 : 0.48), points = [[-90 + pan, floor]];
  const peaks = [];
  for (let index = 0; index <= peakCount; index += 1) {
    const x = -70 + index / peakCount * (width + 140) + pan;
    const elevation = 0.3 + unit(seed, index + (back ? 2 : 23)) * 0.7;
    const y = floor - elevation * height;
    const span = (width + 140) / peakCount;
    if (profile.ridge === 'city') {
      points.push([x - span * 0.45, floor], [x - span * 0.45, y + height * 0.17], [x + span * 0.12, y + height * 0.17],
        [x + span * 0.12, y - height * 0.08], [x + span * 0.32, y - height * 0.08], [x + span * 0.32, floor]);
    } else if (profile.ridge === 'mesas') {
      points.push([x - span * 0.3, floor - elevation * height * 0.22], [x - span * 0.11, y], [x + span * 0.35, y], [x + span * 0.55, floor - elevation * height * 0.18]);
    } else if (profile.ridge === 'lowlands' || profile.ridge === 'hills') {
      points.push([x - span * 0.25, y + height * 0.24], [x, y], [x + span * 0.4, y + height * 0.2]);
    } else if (profile.ridge === 'valley') {
      const side = Math.abs(index / peakCount - 0.5) * 1.7 + 0.2;
      points.push([x - span * 0.4, floor - elevation * height * side * 0.5], [x, floor - elevation * height * side], [x + span * 0.35, floor - elevation * height * side * 0.25]);
    } else {
      points.push([x - span * 0.35, floor - elevation * height * 0.22], [x, y], [x + span * 0.43, floor - elevation * height * 0.11]);
    }
    peaks.push({ x, y, elevation, span });
  }
  points.push([width + 90 + pan, floor + height], [-90 + pan, floor + height]);
  polygon(ctx, points, color);
  if (!back && ['spires', 'basalt', 'snow-peaks', 'valley'].includes(profile.ridge)) {
    for (const peak of peaks) {
      polygon(ctx, [[peak.x, peak.y], [peak.x + peak.span * 0.34, floor + 10], [peak.x - peak.span * 0.03, floor - peak.elevation * height * 0.1]],
        alpha(profile.ground, 0.55));
      if (profile.ridge === 'snow-peaks') {
        polygon(ctx, [[peak.x - peak.span * 0.1, peak.y + height * 0.3], [peak.x, peak.y], [peak.x + peak.span * 0.12, peak.y + height * 0.3], [peak.x + peak.span * 0.02, peak.y + height * 0.2]],
          alpha(profile.accent, 0.84));
      }
    }
  }
}

function broadleaf(ctx, x, y, size, color, old = false) {
  ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, size * 0.1);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - size * 0.12, y - size * 0.82);
  ctx.lineTo(x + size * 0.06, y - size * 1.2); ctx.stroke();
  if (old) {
    ctx.beginPath(); ctx.moveTo(x - size * 0.06, y - size * 0.5); ctx.lineTo(x - size * 0.5, y - size * 0.8);
    ctx.moveTo(x - size * 0.09, y - size * 0.88); ctx.lineTo(x + size * 0.38, y - size * 1.1); ctx.stroke();
  }
  for (const [dx, dy, radius] of [[-0.28, -0.96, 0.37], [0.19, -1.08, 0.4], [0.02, -1.36, 0.36]]) {
    ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x + size * dx, y + size * dy, size * radius, size * radius * 0.7, 0, 0, Math.PI * 2); ctx.fill();
  }
}

function conifer(ctx, x, y, size, color) {
  ctx.fillStyle = color; ctx.fillRect(x - size * 0.035, y - size * 0.8, size * 0.07, size * 0.8);
  for (const [rise, span] of [[1.4, 0.22], [1.12, 0.34], [0.79, 0.46]]) {
    polygon(ctx, [[x, y - size * rise], [x + size * span, y - size * (rise - 0.68)], [x - size * span, y - size * (rise - 0.68)]], color);
  }
}

function forest(ctx, profile, width, horizon, seed, pan) {
  if (profile.flora === 'none' || profile.flora === 'steppe' || profile.flora === 'reeds') return;
  for (let layer = 0; layer < 2; layer += 1) {
    const step = layer ? 67 : 43;
    for (let x = -30, index = 0; x < width + 50; x += step, index += 1) {
      const size = (layer ? 24 : 14) + unit(seed + layer * 71, index) * (layer ? 15 : 8);
      const locationX = x + pan * (layer ? 1 : 0.6), locationY = horizon + 14 + layer * 16 + unit(seed, index + 13) * 10;
      const color = alpha(layer ? profile.near : profile.far, layer ? 0.94 : 0.8);
      if (profile.flora === 'conifers') conifer(ctx, locationX, locationY, size, color);
      else broadleaf(ctx, locationX, locationY, size, color, profile.flora === 'old-forest');
    }
  }
}

function architecturalLandmarks(ctx, profile, width, horizon, pan) {
  const x = width * 0.84 + pan, y = horizon + 2;
  if (profile.architecture === 'mako-industrial') {
    polygon(ctx, [[x - 18, y + 14], [x - 12, y - 35], [x + 18, y - 35], [x + 27, y + 14]], alpha(profile.near, 0.82));
    ctx.strokeStyle = alpha(profile.accent, 0.65); ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x - 20, y + 12); ctx.lineTo(x - 20, y - 16); ctx.lineTo(x - 9, y - 16); ctx.stroke();
    ctx.fillStyle = alpha(profile.ground, 0.7); ctx.fillRect(x - 7, y - 26, 19, 8);
  } else if (profile.architecture === 'forerunner') {
    for (const position of [width * 0.12 + pan, width * 0.88 + pan]) {
      polygon(ctx, [[position - 23, y + 23], [position - 14, y - 30], [position - 5, y - 43], [position + 13, y - 22], [position + 24, y + 23]], alpha(profile.near, 0.84));
      polygon(ctx, [[position - 5, y - 43], [position + 13, y - 22], [position + 9, y + 11], [position - 5, y + 18]], alpha(profile.accent, 0.39));
      ctx.strokeStyle = alpha(profile.accent, 0.7); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(position + 1, y - 18); ctx.lineTo(position + 1, y + 1); ctx.stroke();
    }
  } else if (profile.architecture === 'gondorian-ruins' || profile.architecture === 'old-stone') {
    const origin = width * 0.17 + pan;
    ctx.fillStyle = alpha(profile.near, 0.66);
    for (let index = 0; index < 4; index += 1) {
      const height = [22, 34, 18, 29][index];
      ctx.fillRect(origin + index * 15, y - height, 9, height + 6);
      ctx.fillRect(origin + index * 15 - 2, y - height - 3, 13, 4);
    }
    polygon(ctx, [[origin - 5, y - 23], [origin + 17, y - 29], [origin + 44, y - 17], [origin + 44, y - 12], [origin - 5, y - 16]], alpha(profile.near, 0.65));
  } else if (profile.architecture === 'prothean-industrial') {
    ctx.strokeStyle = alpha(profile.near, 0.86); ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(x - 24, y + 15); ctx.lineTo(x - 24, y - 21); ctx.lineTo(x + 18, y - 21); ctx.lineTo(x + 18, y + 15); ctx.stroke();
    ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 20, y + 12); ctx.lineTo(x + 14, y - 17); ctx.stroke();
    ctx.fillStyle = alpha(profile.near, 0.7); ctx.fillRect(x + 25, y - 8, 19, 22);
  }
}

function groundAtmosphere(ctx, profile, width, height, horizon, seed, time) {
  if (profile.biome === 'wetlands') {
    ctx.strokeStyle = alpha(profile.accent, 0.15); ctx.lineWidth = 1;
    for (let index = 0; index < 14; index += 1) {
      const y = horizon + 28 + index * (height - horizon - 28) / 14, x = unit(seed, index) * width;
      ctx.beginPath(); ctx.moveTo(x - 60, y); ctx.lineTo(x + 80 + Math.sin(time * 0.01 + index) * 8, y); ctx.stroke();
    }
    ctx.strokeStyle = alpha(profile.near, 0.55);
    for (let index = 0; index < 30; index += 1) {
      const x = unit(seed + 13, index) * width, y = height * (0.79 + unit(seed + 23, index) * 0.18);
      if (x > width * 0.11 && x < width * 0.89) continue;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - 3, y - 14); ctx.moveTo(x, y); ctx.lineTo(x + 6, y - 21); ctx.stroke();
    }
  } else if (profile.biome === 'volcanic') {
    for (let index = 0; index < 5; index += 1) {
      const x = width * (index / 4);
      polygon(ctx, [[x - 23, height], [x + 11, horizon + 28], [x + 28, horizon + 43], [x + 13, height]], alpha(profile.accent, 0.16));
    }
  } else if (profile.biome === 'archylte') {
    ctx.strokeStyle = alpha(profile.accent, 0.28); ctx.lineWidth = 1;
    for (let index = 0; index < 23; index += 1) {
      const x = unit(seed, index) * width, y = height * (0.84 + unit(seed + 41, index) * 0.14);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 5, y - 7); ctx.stroke();
    }
  }
}

function weather(ctx, profile, width, height, seed, time) {
  if (profile.weather === 'snow') {
    ctx.fillStyle = alpha(profile.accent, 0.53);
    for (let index = 0; index < 37; index += 1) {
      const x = (unit(seed, index) * width + time * 0.22 + index * 7) % width;
      const y = (unit(seed + 31, index) * height + time * 0.35) % height;
      ctx.fillRect(x, y, index % 4 ? 1 : 2, index % 4 ? 1 : 2);
    }
  } else if (profile.weather === 'mist' || profile.biome === 'enchanted-forest') {
    for (let index = 0; index < 3; index += 1) {
      ctx.fillStyle = alpha(profile.haze, 0.045 + index * 0.01);
      ctx.beginPath(); ctx.ellipse(width * (0.14 + index * 0.37) + Math.sin(time * 0.003 + index) * 12, height * (0.38 + index * 0.05), width * 0.42, height * 0.033, 0, 0, Math.PI * 2); ctx.fill();
    }
  } else if (profile.weather === 'embers') {
    ctx.fillStyle = alpha(profile.accent, 0.42);
    for (let index = 0; index < 16; index += 1) {
      const x = unit(seed, index) * width;
      const y = height - (unit(seed + 71, index) * height + time * 0.3) % height;
      ctx.fillRect(x, y, 1.2, 1.2);
    }
  }
}

export function drawTacticsEnvironment(ctx, { battlefield, mode = 'Tactics', universe = '', forceBaseArena = false, dlcSuppressedArena = false, width, height, animTime = 0, reducedMotion = false, camera = {} } = {}) {
  const profile = getTacticsEnvironmentProfile(battlefield, mode, { universe, forceBaseArena, dlcSuppressedArena });
  if (!profile || !ctx || !(width > 0) || !(height > 0)) return false;
  const seed = seedOf(profile.id), time = reducedMotion ? 0 : Math.max(0, finite(animTime, 0));
  const pan = clamp(finite(camera.panX, 0) * 0.1, -width * 0.12, width * 0.12);
  const horizon = height * 0.38;
  ctx.save();
  ctx.globalAlpha = 1;
  const gradient = ctx.createLinearGradient?.(0, 0, 0, height);
  if (gradient?.addColorStop) {
    gradient.addColorStop(0, profile.sky[0]); gradient.addColorStop(0.6, profile.sky[1]); gradient.addColorStop(1, profile.ground);
  }
  ctx.fillStyle = gradient?.addColorStop ? gradient : profile.sky[0];
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = alpha(profile.haze, profile.biome === 'volcanic' ? 0.14 : 0.12);
  ctx.beginPath(); ctx.ellipse(width * 0.72, height * 0.16, width * 0.22, height * 0.08, 0, 0, Math.PI * 2); ctx.fill();
  ridge(ctx, width, horizon, profile, seed, true, pan * 0.4);
  ridge(ctx, width, horizon + 18, profile, seed + 53, false, pan);
  ctx.fillStyle = profile.ground; ctx.fillRect(0, horizon + 42, width, height - horizon - 42);
  forest(ctx, profile, width, horizon, seed, pan);
  architecturalLandmarks(ctx, profile, width, horizon, pan);
  groundAtmosphere(ctx, profile, width, height, horizon, seed, time);
  weather(ctx, profile, width, height, seed, time);
  const vignette = ctx.createLinearGradient?.(0, height * 0.55, 0, height);
  if (vignette?.addColorStop) {
    vignette.addColorStop(0, 'rgba(7,16,22,0)'); vignette.addColorStop(1, 'rgba(7,16,22,0.36)');
    ctx.fillStyle = vignette; ctx.fillRect(0, height * 0.55, width, height * 0.45);
  }
  ctx.restore();
  return true;
}

export function getTacticsSceneryBounds(obstacle, point, width, height) {
  const radius = width * (obstacle.sceneryKind === 'tree' ? 0.68 : 0.52);
  const canopyHeight = obstacle.sceneryKind === 'tree' ? height * 1.1 : height;
  return { left: point.x - radius, right: point.x + radius, top: point.y - canopyHeight - 6, bottom: point.y + width * 0.14 };
}

// The caller supplies a real obstacle's support and physical height. Artwork
// never adds a blocker, changes HP or expands its collision footprint.
export function drawTacticsScenery(ctx, { obstacle, point, width, height } = {}) {
  const kind = obstacle?.sceneryKind;
  if (!kind || !['tree', 'boulder', 'ruin-wall', 'mako-conduit', 'prothean-generator', 'forerunner-pylon', 'wooden-crate'].includes(kind)) return false;
  const w = Math.max(4, width), h = Math.max(8, height), color = obstacle.color || '#6e7a6c';
  ctx.save(); ctx.translate(point.x, point.y);
  ctx.fillStyle = 'rgba(9,20,20,0.21)'; ctx.beginPath(); ctx.ellipse(0, 1, w * 0.48, w * 0.13, 0, 0, Math.PI * 2); ctx.fill();
  if (kind === 'tree') {
    const bark = obstacle.barkColor || '#514b3b', foliage = obstacle.foliageColor || '#3e624a';
    if (obstacle.treeStyle === 'conifer') conifer(ctx, 0, 0, h / 1.4, foliage);
    else {
      // Broadleaf canopy and crooked old-forest branches remain distinct from
      // Valhalla's narrow conifers. The base stays at the addressed surface.
      ctx.strokeStyle = bark; ctx.lineWidth = Math.max(3, w * 0.13);
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-w * 0.06, -h * 0.62); ctx.lineTo(w * 0.03, -h * 0.91); ctx.stroke();
      ctx.lineWidth = Math.max(2, w * 0.07);
      ctx.beginPath(); ctx.moveTo(-w * 0.04, -h * 0.42); ctx.lineTo(-w * 0.33, -h * 0.68);
      ctx.moveTo(-w * 0.05, -h * 0.57); ctx.lineTo(w * 0.35, -h * 0.79); ctx.stroke();
      for (const [x, y, radius] of [[-0.3, -0.67, 0.36], [0.27, -0.79, 0.4], [0, -0.92, 0.38]]) {
        ctx.fillStyle = foliage; ctx.beginPath(); ctx.ellipse(w * x, h * y, w * radius, h * 0.17, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = 'rgba(174,195,134,0.14)';
      ctx.beginPath(); ctx.ellipse(-w * 0.16, -h * 0.91, w * 0.27, h * 0.08, -0.1, 0, Math.PI * 2); ctx.fill();
      if (obstacle.treeStyle === 'old-forest') {
        ctx.strokeStyle = '#77896b'; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(-w * 0.1, -h * 0.57); ctx.lineTo(-w * 0.27, -h * 0.3);
        ctx.moveTo(w * 0.23, -h * 0.75); ctx.lineTo(w * 0.28, -h * 0.4); ctx.stroke();
      }
    }
  } else if (kind === 'boulder') {
    polygon(ctx, [[-w * 0.5, -h * 0.17], [-w * 0.34, -h * 0.84], [w * 0.05, -h], [w * 0.43, -h * 0.65], [w * 0.51, -h * 0.12], [w * 0.08, h * 0.06]], color);
    polygon(ctx, [[-w * 0.34, -h * 0.84], [w * 0.05, -h], [w * 0.16, -h * 0.46], [-w * 0.15, -h * 0.21]], 'rgba(231,234,211,0.17)');
    polygon(ctx, [[w * 0.16, -h * 0.46], [w * 0.43, -h * 0.65], [w * 0.51, -h * 0.12], [w * 0.08, h * 0.06]], 'rgba(8,21,27,0.24)');
    ctx.strokeStyle = 'rgba(12,25,29,0.45)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-w * 0.15, -h * 0.21); ctx.lineTo(w * 0.16, -h * 0.46); ctx.lineTo(w * 0.04, -h * 0.77); ctx.stroke();
  } else if (kind === 'ruin-wall') {
    polygon(ctx, [[-w * 0.48, 0], [-w * 0.48, -h * 0.86], [-w * 0.27, -h], [-w * 0.02, -h * 0.85], [w * 0.15, -h * 0.93], [w * 0.48, -h * 0.66], [w * 0.48, 0]], color);
    ctx.strokeStyle = 'rgba(230,227,203,0.29)'; ctx.lineWidth = 1;
    for (let row = 1; row < 4; row += 1) {
      ctx.beginPath(); ctx.moveTo(-w * 0.46, -h * row / 4); ctx.lineTo(w * 0.46, -h * row / 4); ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(17,28,28,0.4)'; ctx.beginPath(); ctx.moveTo(-w * 0.11, -h * 0.9); ctx.lineTo(-w * 0.06, -h * 0.53); ctx.lineTo(w * 0.13, -h * 0.31); ctx.stroke();
  } else if (kind === 'forerunner-pylon') {
    polygon(ctx, [[-w * 0.42, 0], [-w * 0.31, -h * 0.58], [-w * 0.12, -h], [w * 0.11, -h * 0.91], [w * 0.4, -h * 0.38], [w * 0.42, 0]], color);
    polygon(ctx, [[-w * 0.12, -h], [w * 0.11, -h * 0.91], [w * 0.2, -h * 0.21], [-w * 0.09, -h * 0.13]], 'rgba(216,231,220,0.32)');
    ctx.strokeStyle = '#a9d6d0'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(w * 0.01, -h * 0.63); ctx.lineTo(w * 0.05, -h * 0.3); ctx.stroke();
  } else if (kind === 'mako-conduit') {
    ctx.fillStyle = color; ctx.fillRect(-w * 0.3, -h, w * 0.6, h);
    ctx.strokeStyle = '#88b69b'; ctx.lineWidth = Math.max(2, w * 0.12);
    ctx.beginPath(); ctx.moveTo(-w * 0.25, -h * 0.15); ctx.lineTo(-w * 0.25, -h * 0.78); ctx.lineTo(w * 0.13, -h * 0.78); ctx.stroke();
    ctx.fillStyle = '#223b36'; ctx.fillRect(-w * 0.12, -h * 0.59, w * 0.31, h * 0.17);
    ctx.fillStyle = '#9bceb0'; ctx.fillRect(-w * 0.07, -h * 0.54, w * 0.12, h * 0.04);
  } else if (kind === 'prothean-generator') {
    polygon(ctx, [[-w * 0.43, 0], [-w * 0.32, -h], [w * 0.26, -h], [w * 0.43, -h * 0.21], [w * 0.43, 0]], color);
    ctx.fillStyle = '#333f42'; ctx.fillRect(-w * 0.23, -h * 0.8, w * 0.42, h * 0.26);
    ctx.strokeStyle = '#b8b7a6'; ctx.lineWidth = 1;
    for (let index = 0; index < 4; index += 1) {
      ctx.beginPath(); ctx.moveTo(-w * 0.21, -h * (0.73 - index * 0.045)); ctx.lineTo(w * 0.18, -h * (0.73 - index * 0.045)); ctx.stroke();
    }
    ctx.fillStyle = '#c6a781'; ctx.fillRect(w * 0.21, -h * 0.47, w * 0.08, h * 0.09);
  } else {
    ctx.fillStyle = color; ctx.fillRect(-w * 0.42, -h, w * 0.84, h);
    ctx.strokeStyle = '#bd9e6f'; ctx.lineWidth = 2;
    ctx.strokeRect(-w * 0.38, -h * 0.96, w * 0.76, h * 0.92);
    ctx.beginPath(); ctx.moveTo(-w * 0.35, -h * 0.92); ctx.lineTo(w * 0.35, -h * 0.08); ctx.moveTo(w * 0.35, -h * 0.92); ctx.lineTo(-w * 0.35, -h * 0.08); ctx.stroke();
  }
  ctx.restore();
  return true;
}
