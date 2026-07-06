// Pixel Art Renderer and Particle System for Multiverse Breach

import { EXPANDED_DECOR_THEMES } from './expandedUniverses';
import { getEnemySpriteSheetSrc, getHeroSpriteSheetSrc, getSpriteFrameForLayout, getSpriteSheetLayout, MIRELLE_COMPLETE_SPRITES } from './spriteAssets';

const spriteSheetCache = new Map();

const getCachedSpriteSheet = (src) => {
  if (!src || typeof Image === 'undefined') return null;
  const cached = spriteSheetCache.get(src);
  if (cached) return cached;

  const image = new Image();
  const entry = {
    image,
    status: 'loading',
    pendingDraws: new Map()
  };
  image.onload = () => {
    entry.status = 'ready';
    const callbacks = Array.from(entry.pendingDraws.values());
    entry.pendingDraws.clear();
    const runCallbacks = () => callbacks.forEach(redraw => redraw());
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(runCallbacks);
    } else {
      runCallbacks();
    }
  };
  image.onerror = () => {
    entry.status = 'error';
    const callbacks = Array.from(entry.pendingDraws.values());
    entry.pendingDraws.clear();
    callbacks.forEach(redraw => redraw());
  };
  image.src = src;
  if (image.complete && image.naturalWidth > 0) {
    entry.status = 'ready';
  }
  spriteSheetCache.set(src, entry);
  return entry;
};

const queueSpriteSheetRedraw = (entry, ctx, draw) => {
  if (!entry?.pendingDraws || !ctx?.canvas) return;
  entry.pendingDraws.set(ctx.canvas, () => {
    if (typeof document !== 'undefined' && ctx.canvas && !ctx.canvas.isConnected) return;
    draw();
  });
};

export const preloadSpriteSheetSrcs = (srcs = []) => {
  srcs.forEach(src => getCachedSpriteSheet(src));
};

const drawMirelleItemVfx = (ctx, x, y, entity, animTime, facing, targetHeight, context, redrawWhenResolved) => {
  if (entity?.id !== 'arca_mirelle' || !['attack', 'defense', 'hit'].includes(entity.state)) return;
  const entry = getCachedSpriteSheet(MIRELLE_COMPLETE_SPRITES.itemsVfx);
  if (!entry || entry.status === 'error') return;
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) {
    queueSpriteSheetRedraw(entry, ctx, () => redrawWhenResolved?.());
    return;
  }
  const frameMap = {
    attack: { row: 1, colBase: 0, width: 0.82, alpha: 0.72 },
    defense: { row: 3, colBase: 0, width: 0.7, alpha: 0.64 },
    hit: { row: 4, colBase: 0, width: 0.76, alpha: 0.78 }
  };
  const spec = frameMap[entity.state];
  const columns = 4;
  const rows = 7;
  const frameW = entry.image.naturalWidth / columns;
  const frameH = entry.image.naturalHeight / rows;
  const col = (spec.colBase + Math.floor(animTime / 8)) % columns;
  const drawH = targetHeight * (context === 'nexus' ? 0.64 : 0.54);
  const drawW = drawH * spec.width;
  ctx.save();
  ctx.globalAlpha = spec.alpha;
  ctx.imageSmoothingEnabled = false;
  ctx.translate(x + facing * targetHeight * 0.22, y - targetHeight * 0.52);
  ctx.scale(facing, 1);
  ctx.drawImage(entry.image, col * frameW, spec.row * frameH, frameW, frameH, -drawW / 2, -drawH / 2, drawW, drawH);
  ctx.restore();
};

const drawGeneratedSpriteSheet = (ctx, x, y, entity, animTime, facing, targetHeight, srcGetter, redrawWhenResolved, context = 'auto') => {
  const entry = getCachedSpriteSheet(srcGetter(entity, context));
  if (!entry || entry.status === 'error') return 'missing';
  if (entry.status !== 'ready' || !entry.image.complete || entry.image.naturalWidth === 0) {
    queueSpriteSheetRedraw(entry, ctx, () => {
      redrawWhenResolved?.();
    });
    return 'loading';
  }

  const layout = getSpriteSheetLayout(entry.image.currentSrc || entry.image.src);
  const frameWidth = entry.image.naturalWidth / layout.columns;
  const frameHeight = entry.image.naturalHeight / layout.rows;
  const frame = getSpriteFrameForLayout(entity.state, animTime, layout);
  const trim = frame.trim || {};
  const sourceX = frame.col * frameWidth + (trim.left || 0);
  const sourceY = frame.row * frameHeight + (trim.top || 0);
  const sourceW = Math.max(1, frameWidth - (trim.left || 0) - (trim.right || 0));
  const sourceH = Math.max(1, frameHeight - (trim.top || 0) - (trim.bottom || 0));
  const scale = targetHeight / sourceH;
  const drawW = sourceW * scale;
  const drawH = targetHeight;

  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    entry.image,
    sourceX,
    sourceY,
    sourceW,
    sourceH,
    -drawW / 2,
    -drawH + 24 * scale,
    drawW,
    drawH
  );
  ctx.restore();
  drawMirelleItemVfx(ctx, x, y, entity, animTime, facing, targetHeight, context, redrawWhenResolved);
  return 'drawn';
};

export class ParticleSystem {
  constructor() {
    this.particles = [];
  }

  add(x, y, vx, vy, color, size, life, type = 'spark', text = '') {
    this.particles.push({
      x, y, vx, vy, color, size, maxLife: life, life, type, text,
      alpha: 1
    });
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;

      if (p.type === 'text') {
        p.vy *= 0.96; // slow down vertical rise
      } else if (p.type === 'gravity') {
        p.vy += 0.2; // apply gravity
      }

      p.alpha = Math.max(0, p.life / p.maxLife);

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      ctx.globalAlpha = p.alpha;
      if (p.type === 'text') {
        ctx.font = 'bold 12px "Share Tech Mono", monospace';
        ctx.fillStyle = p.color;
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 4;
        ctx.fillText(p.text, p.x, p.y);
      } else if (p.type === 'laser_line') {
        ctx.strokeStyle = p.color;
        ctx.lineWidth = p.size;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.vx * 10, p.y + p.vy * 10);
        ctx.stroke();
      } else if (p.type === 'music') {
        ctx.fillStyle = p.color;
        ctx.font = `${p.size}px monospace`;
        ctx.fillText('♫', p.x, p.y);
      } else if (p.type === 'glitch') {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size * (Math.random() + 0.5), p.size * (Math.random() + 0.5));
      } else {
        // Star or square spark
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }
    });
    ctx.restore();
  }
}

export const drawPixelSprite = (ctx, x, y, character, animTime, facing = 1, targetHeight = 72, context = 'auto') => {
  const generatedStatus = drawGeneratedSpriteSheet(ctx, x, y, character, animTime, facing, targetHeight, getHeroSpriteSheetSrc, () => {
    drawPixelSprite(ctx, x, y, character, animTime, facing, targetHeight, context);
  }, context);
  if (generatedStatus !== 'missing') {
    return;
  }

  const { primaryColor, secondaryColor, weaponType, weaponColor, id, state } = character;
  const scaleFactor = targetHeight / 72;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing * scaleFactor, scaleFactor);

  // Apply visual effect based on state
  let isDead = state === 'dead';
  let isHit = state === 'hit';
  let isDefending = state === 'defense';
  let isAttacking = state === 'attack';

  if (isDead) {
    ctx.rotate(-Math.PI / 2);
    ctx.translate(-20, 10); // shift down on ground
  }

  // Animation offsets
  let bounce = 0;
  let legSwing = 0;
  let armSwing = 0;

  if (state === 'run') {
    bounce = Math.sin(animTime * 0.2) * 2;
    legSwing = Math.sin(animTime * 0.2) * 5;
    armSwing = -Math.sin(animTime * 0.2) * 6;
  } else if (state === 'idle') {
    bounce = Math.sin(animTime * 0.05) * 1;
  }

  // Draw Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Legs (Left & Right)
  ctx.fillStyle = primaryColor;
  if (isDead) {
    ctx.fillRect(-6, 8, 4, 8);
    ctx.fillRect(2, 8, 4, 8);
  } else {
    // Leg 1
    ctx.fillRect(-6, 6 + bounce, 4, 10 + legSwing);
    // Leg 2
    ctx.fillRect(2, 6 + bounce, 4, 10 - legSwing);
  }

  // Draw Torso/Body
  ctx.fillStyle = primaryColor;
  ctx.fillRect(-8, -12 + bounce, 16, 18);

  // Draw Backpack/HEV unit/details depending on character ID
  if (id === 'masterchief') {
    // Spartan Green backpack
    ctx.fillStyle = '#1c3b12';
    ctx.fillRect(-11, -10 + bounce, 3, 12);
  } else if (id === 'freeman') {
    // Orange neck collar/HEV pack
    ctx.fillStyle = '#e65c00';
    ctx.fillRect(-10, -11 + bounce, 2, 8);
  } else if (id === 'shepard') {
    // Tech strip on chest
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(-6, -8 + bounce, 12, 2);
  } else if (id === 'miku') {
    // Vocaloid tie
    ctx.fillStyle = '#e0007a';
    ctx.fillRect(-1, -6 + bounce, 2, 8);
  }

  // Draw Head / Helmet
  if (id === 'pyramidhead') {
    // Huge red metal pyramid instead of head
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.moveTo(-10, -12 + bounce);
    ctx.lineTo(10, -12 + bounce);
    ctx.lineTo(-4, -34 + bounce);
    ctx.closePath();
    ctx.fill();
    // Metal rust lines
    ctx.fillStyle = '#3a0202';
    ctx.fillRect(-2, -22 + bounce, 4, 8);
  } else {
    // Standard Head
    ctx.fillStyle = (id === 'miku') ? '#ffe0bd' : (id === 'neo') ? '#ffe0bd' : primaryColor;
    ctx.fillRect(-6, -24 + bounce, 12, 12);

    // Visors / Hair / Helmets
    if (id === 'masterchief') {
      // Golden orange visor
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(1, -21 + bounce, 5, 3);
      // Helmet line
      ctx.fillStyle = '#1e3c14';
      ctx.fillRect(-6, -25 + bounce, 12, 2);
    } else if (id === 'freeman') {
      // Black glasses and beard
      ctx.fillStyle = '#331a00';
      ctx.fillRect(1, -21 + bounce, 5, 2); // glasses
      ctx.fillRect(-2, -15 + bounce, 8, 3); // goatee
    } else if (id === 'miku') {
      // Miku twin tails
      ctx.fillStyle = primaryColor;
      // Left tail
      ctx.fillRect(-12, -24 + bounce, 5, 22 + Math.sin(animTime * 0.1) * 3);
      // Right tail
      ctx.fillRect(7, -24 + bounce, 5, 22 - Math.sin(animTime * 0.1) * 3);
      // Hair ties
      ctx.fillStyle = secondaryColor;
      ctx.fillRect(-9, -25 + bounce, 3, 2);
      ctx.fillRect(6, -25 + bounce, 3, 2);
    } else if (id === 'valtweller') {
      // Yellow Vault Boy hair
      ctx.fillStyle = primaryColor;
      ctx.fillRect(-7, -26 + bounce, 14, 3);
      ctx.fillRect(-2, -23 + bounce, 9, 3);
    } else if (id === 'marcus') {
      // Dark grey bandana
      ctx.fillStyle = '#111111';
      ctx.fillRect(-7, -25 + bounce, 14, 3);
    } else if (id === 'snake') {
      // Grey bandana with ribbon extending back
      ctx.fillStyle = '#111111';
      ctx.fillRect(-7, -23 + bounce, 14, 2);
      ctx.fillRect(-10, -22 + bounce, 4, 2); // bandana tail
    } else if (id === 'neo') {
      // Sunglasses
      ctx.fillStyle = '#000';
      ctx.fillRect(0, -21 + bounce, 6, 2);
      // Short black hair
      ctx.fillStyle = '#111';
      ctx.fillRect(-7, -26 + bounce, 14, 3);
    } else if (id === 'dallas') {
      // White clown mask with red/blue stripes
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(1, -23 + bounce, 5, 10);
      ctx.fillStyle = '#d91e1e';
      ctx.fillRect(2, -22 + bounce, 2, 2);
    } else if (id === 'yugi') {
      // Spiky violet/yellow hair
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(-10, -28 + bounce, 20, 4);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(-7, -24 + bounce, 2, 6);
      ctx.fillRect(5, -24 + bounce, 2, 6);
    }
  }

  // Draw Arm holding weapon
  ctx.fillStyle = primaryColor;
  let armX = -2;
  let armY = -4 + bounce;

  if (isAttacking) {
    // Lunge arm forward
    ctx.fillRect(armX + 4, armY - 2, 10, 4);
    drawWeapon(ctx, armX + 12, armY, weaponType, weaponColor, animTime);
  } else {
    // Idle/moving swing
    ctx.save();
    ctx.translate(armX, armY);
    ctx.rotate(armSwing * Math.PI / 180);
    ctx.fillRect(0, 0, 8, 4);
    drawWeapon(ctx, 6, 2, weaponType, weaponColor, animTime);
    ctx.restore();
  }

  // Defending overlay shield bubble
  if (isDefending) {
    ctx.strokeStyle = (id === 'masterchief') ? 'rgba(0, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    ctx.fillStyle = (id === 'masterchief') ? 'rgba(0, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.1)';
    ctx.shadowColor = ctx.strokeStyle;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(0, -6, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  // Hit red flash
  if (isHit) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.4)';
    ctx.fillRect(-10, -28, 20, 40);
  }

  ctx.restore();
};

const drawWeapon = (ctx, x, y, type, color, animTime) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;

  switch (type) {
    case 'gun':
      // Gun barrel & handle
      ctx.fillRect(0, -2, 8, 3);
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, 2, 4);
      break;
    case 'chainsaw':
      // Lancer rifle with red chainsaw blade below it
      ctx.fillRect(0, -2, 9, 3);
      ctx.fillStyle = '#d32f2f'; // spinning blade
      ctx.fillRect(1, 1, 8, 2 + Math.sin(animTime * 0.8) * 0.5);
      break;
    case 'crowbar':
      // Curved red crowbar
      ctx.fillRect(0, -5, 2, 8);
      ctx.fillRect(0, -6, 4, 2);
      break;
    case 'greatsword':
      // Large heavy sword angled up
      ctx.rotate(-Math.PI / 4);
      ctx.fillRect(0, -2, 3, 4); // hilt
      ctx.fillStyle = '#a9a9a9';
      ctx.fillRect(3, -1, 16, 2); // blade
      break;
    case 'leek':
      // Vocaloid green/white leek
      ctx.rotate(-Math.PI / 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, -1, 4, 2); // white base
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(4, -1, 10, 2); // green body
      break;
    case 'cards':
      // Small card deck
      ctx.fillRect(0, -3, 4, 6);
      ctx.fillStyle = '#2980b9';
      ctx.fillRect(1, -2, 2, 4);
      break;
    case 'flashlight':
      // Heavy torch
      ctx.fillRect(0, -2, 5, 3);
      ctx.fillStyle = '#fff799';
      // Draw light cone
      ctx.globalAlpha = 0.2;
      ctx.beginPath();
      ctx.moveTo(5, -1);
      ctx.lineTo(25, -8);
      ctx.lineTo(25, 6);
      ctx.closePath();
      ctx.fill();
      break;
    case 'puzzlebox':
      // Gold Laminate cube
      ctx.fillRect(0, -3, 5, 5);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(1, -2, 3, 3);
      break;
    case 'doomblade':
      // Arm blade
      ctx.rotate(Math.PI / 8);
      ctx.fillRect(0, -1, 10, 2);
      ctx.fillStyle = '#ff3300'; // energy edge
      ctx.fillRect(2, 0, 8, 1);
      break;
    case 'baseballbat':
      // Wood color bat
      ctx.rotate(-Math.PI / 5);
      ctx.fillStyle = '#d7a15c';
      ctx.fillRect(0, -1, 3, 2);
      ctx.fillRect(3, -2, 10, 3);
      break;
    case 'wristblade':
      // Dual predator claws
      ctx.fillRect(0, -2, 7, 1);
      ctx.fillRect(0, 1, 7, 1);
      break;
    case 'portalgun':
      // Portal gun with colored glow
      ctx.fillRect(0, -2, 6, 4);
      ctx.fillStyle = '#3498db'; // portal light
      ctx.fillRect(3, -1, 2, 2);
      break;
  }

  ctx.restore();
};

export const drawPixelEnemy = (ctx, x, y, enemy, animTime, facing = -1) => {
  const generatedStatus = drawGeneratedSpriteSheet(ctx, x, y, enemy, animTime, facing, 68, getEnemySpriteSheetSrc, () => {
    drawPixelEnemy(ctx, x, y, enemy, animTime, facing);
  });
  if (generatedStatus !== 'missing') {
    return;
  }

  const { name, color, state } = enemy;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

  let isDead = state === 'dead';
  let isHit = state === 'hit';
  let isAttacking = state === 'attack';

  if (isDead) {
    ctx.rotate(Math.PI / 2);
    ctx.translate(-20, -10);
  }

  let bounce = Math.sin(animTime * 0.08) * 1.5;
  let legSwing = state === 'run' ? Math.sin(animTime * 0.25) * 5 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.beginPath();
  ctx.ellipse(0, 16, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw Legs
  ctx.fillStyle = '#222';
  ctx.fillRect(-5, 6 + bounce, 4, 10 + legSwing);
  ctx.fillRect(1, 6 + bounce, 4, 10 - legSwing);

  // Draw Torso
  ctx.fillStyle = color;
  ctx.fillRect(-8, -12 + bounce, 16, 18);

  // Draw Head
  ctx.fillStyle = color;
  ctx.fillRect(-6, -24 + bounce, 12, 12);

  // Visor / details based on name
  if (name.includes('Xenomorph')) {
    // Elongated head, glowing drool
    ctx.fillRect(-12, -24 + bounce, 6, 10);
    ctx.fillStyle = '#1a5f7a';
    ctx.fillRect(-10, -20 + bounce, 2, 2);
  } else if (name.includes('Grunt')) {
    // Big methane tank on back
    ctx.fillStyle = '#e67e22';
    ctx.fillRect(-12, -14 + bounce, 5, 14);
  } else if (name.includes('Zombie')) {
    // Red expose brain / rags
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-3, -25 + bounce, 6, 3);
  } else if (name.includes('Agent')) {
    // Suit and glasses
    ctx.fillStyle = '#ffffff'; // shirt
    ctx.fillRect(-2, -12 + bounce, 4, 6);
    ctx.fillStyle = '#111111'; // tie
    ctx.fillRect(-1, -8 + bounce, 2, 4);
    ctx.fillStyle = '#111'; // glasses
    ctx.fillRect(1, -21 + bounce, 5, 2);
  } else if (name.includes('Turret')) {
    // Portal white/black sleek tripod turret (this is drawn differently!)
    ctx.restore();
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(facing, 1);
    if (isDead) {
      ctx.rotate(Math.PI / 2);
      ctx.translate(-20, -10);
    }
    // Tripod legs
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(-8, 16);
    ctx.moveTo(0, 0); ctx.lineTo(8, 16);
    ctx.stroke();
    // Body egg
    ctx.fillStyle = '#ececec';
    ctx.fillRect(-6, -18, 12, 20);
    ctx.fillStyle = '#ff0000'; // Red eye
    ctx.fillRect(2, -12, 3, 3);
    ctx.restore();
    return;
  }

  // Enemy weapon/arm
  ctx.fillStyle = color;
  if (isAttacking) {
    ctx.fillRect(2, -3 + bounce, 10, 4);
    ctx.fillStyle = '#222';
    ctx.fillRect(12, -5 + bounce, 4, 6);
  } else {
    ctx.fillRect(2, -1 + bounce, 6, 4);
  }

  if (isHit) {
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.fillRect(-10, -26, 20, 40);
  }

  ctx.restore();
};

export const drawBoss = (ctx, x, y, boss, animTime) => {
  const generatedStatus = drawGeneratedSpriteSheet(ctx, x, y, boss, animTime, -1, 126, getEnemySpriteSheetSrc, () => {
    drawBoss(ctx, x, y, boss, animTime);
  });
  if (generatedStatus !== 'missing') {
    return;
  }

  const { name, color, state } = boss;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(-1, 1); // Bosses face left

  let isDead = state === 'dead';
  let isHit = state === 'hit';
  let isAttacking = state === 'attack';

  if (isDead) {
    ctx.rotate(Math.PI / 2);
    ctx.translate(-40, -20);
  }

  let bounce = Math.sin(animTime * 0.05) * 4;
  let legSwing = state === 'run' ? Math.sin(animTime * 0.15) * 8 : 0;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 32, 30, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Boss is twice the size of a normal character!
  // Draw legs
  ctx.fillStyle = '#111';
  ctx.fillRect(-12, 12 + bounce, 8, 20 + legSwing);
  ctx.fillRect(4, 12 + bounce, 8, 20 - legSwing);

  // Draw torso
  ctx.fillStyle = color;
  ctx.fillRect(-20, -24 + bounce, 40, 36);

  // Draw head
  ctx.fillStyle = color;
  ctx.fillRect(-15, -48 + bounce, 30, 24);

  // Custom details per boss
  if (name.includes('REX')) {
    // Railgun barrel & radar dish
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(-35, -40 + bounce, 25, 8); // railgun
    ctx.beginPath();
    ctx.arc(20, -36 + bounce, 12, 0, Math.PI * 2); // dish
    ctx.fill();
  } else if (name.includes('Tyrannosaurus')) {
    // Dinosaur jaws & eyes
    ctx.fillStyle = '#c0392b'; // mouth open red
    ctx.fillRect(10, -36 + bounce, 15, 8);
    ctx.fillStyle = '#ffeb3b'; // yellow eye
    ctx.fillRect(4, -44 + bounce, 4, 4);
  } else if (name.includes('Sovereign')) {
    // Reaper mechanical tentacles
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-10, 10 + bounce);
    ctx.quadraticCurveTo(-30, 20, -20, 40);
    ctx.moveTo(10, 10 + bounce);
    ctx.quadraticCurveTo(30, 20, 20, 40);
    ctx.stroke();
  } else if (name.includes('Cyberdemon')) {
    // Arm rocket launcher & horns
    ctx.fillStyle = '#7f8c8d';
    ctx.fillRect(15, -16 + bounce, 16, 10); // Arm rocket
    ctx.fillStyle = '#cca43b'; // Horns
    ctx.fillRect(-18, -54 + bounce, 6, 8);
    ctx.fillRect(12, -54 + bounce, 6, 8);
  } else if (name.includes('GLaDOS')) {
    // Hanging robotic eye
    ctx.restore();
    ctx.save();
    ctx.translate(x, y);
    // Draw ceiling support beam
    ctx.fillStyle = '#444';
    ctx.fillRect(-8, -120, 16, 80);
    // Arm pivots
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, -40);
    ctx.lineTo(20, -10 + Math.sin(animTime * 0.05) * 5);
    ctx.lineTo(0, 20 + Math.cos(animTime * 0.05) * 5);
    ctx.stroke();
    // Hanging pod
    ctx.fillStyle = '#ececec';
    ctx.fillRect(-12, 10 + Math.cos(animTime * 0.05) * 5, 24, 24);
    ctx.fillStyle = '#ffb300'; // Yellow core eye
    ctx.beginPath();
    ctx.arc(0, 22 + Math.cos(animTime * 0.05) * 5, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
    return;
  }

  // Arm/Weapons
  ctx.fillStyle = color;
  if (isAttacking) {
    ctx.fillRect(15, -10 + bounce, 20, 8);
  } else {
    ctx.fillRect(15, -4 + bounce, 12, 8);
  }

  if (isHit) {
    ctx.fillStyle = 'rgba(255,0,0,0.5)';
    ctx.fillRect(-22, -50, 44, 82);
  }

  ctx.restore();
};

const DECOR_THEMES = {
  'Gears of War': { sky: ['#301615', '#080303'], floor: 'rgba(101, 64, 55, 0.2)', grid: 'rgba(190, 45, 36, 0.35)', motif: 'fortress', accent: '#d84a36' },
  'Halo': { sky: ['#0e3022', '#02100b'], floor: 'rgba(52, 178, 125, 0.14)', grid: 'rgba(80, 214, 205, 0.35)', motif: 'ringworld', accent: '#5af2d6' },
  'Alien': { sky: ['#0b2530', '#02080c'], floor: 'rgba(98, 122, 129, 0.18)', grid: 'rgba(103, 208, 218, 0.24)', motif: 'hive', accent: '#8adbe6' },
  'Predator': { sky: ['#21320f', '#050a02'], floor: 'rgba(41, 151, 74, 0.18)', grid: 'rgba(111, 211, 90, 0.28)', motif: 'jungle', accent: '#9bff62' },
  'Resident Evil': { sky: ['#272325', '#070707'], floor: 'rgba(117, 40, 35, 0.18)', grid: 'rgba(209, 61, 50, 0.25)', motif: 'biohazard', accent: '#e95444' },
  'Silent Hill': { sky: ['#2c2926', '#090807'], floor: 'rgba(135, 124, 105, 0.14)', grid: 'rgba(199, 170, 122, 0.18)', motif: 'fogtown', accent: '#c4a56f' },
  'Dino Crisis': { sky: ['#17332a', '#030d09'], floor: 'rgba(44, 160, 116, 0.16)', grid: 'rgba(253, 87, 68, 0.24)', motif: 'facility', accent: '#ff6b56' },
  'The Matrix': { sky: ['#032403', '#000500'], floor: 'rgba(45, 206, 90, 0.1)', grid: 'rgba(57, 255, 110, 0.42)', motif: 'code', accent: '#39ff6e' },
  'Stargate': { sky: ['#132c43', '#030812'], floor: 'rgba(196, 151, 58, 0.16)', grid: 'rgba(80, 200, 255, 0.3)', motif: 'stargate', accent: '#d7b45a' },
  'Half-Life': { sky: ['#33200f', '#080401'], floor: 'rgba(230, 104, 26, 0.16)', grid: 'rgba(255, 134, 37, 0.32)', motif: 'lab', accent: '#ff7a1a' },
  'Portal': { sky: ['#10151c', '#030507'], floor: 'rgba(232, 232, 232, 0.11)', grid: 'rgba(80, 180, 255, 0.32)', motif: 'testchamber', accent: '#ff9f1a' },
  'Metal Gear': { sky: ['#1d2624', '#050807'], floor: 'rgba(107, 133, 123, 0.16)', grid: 'rgba(133, 166, 151, 0.25)', motif: 'stealthbase', accent: '#9eb79d' },
  'Payday': { sky: ['#172235', '#03060b'], floor: 'rgba(40, 88, 145, 0.16)', grid: 'rgba(248, 198, 56, 0.28)', motif: 'vault', accent: '#f8c638' },
  'Vocaloid': { sky: ['#153043', '#050616'], floor: 'rgba(37, 218, 197, 0.14)', grid: 'rgba(255, 75, 190, 0.32)', motif: 'concert', accent: '#39e5d0' },
  'Yu-Gi-Oh': { sky: ['#221335', '#05030d'], floor: 'rgba(218, 164, 45, 0.16)', grid: 'rgba(174, 92, 255, 0.28)', motif: 'duelarena', accent: '#e4b449' },
  'Guilty Gear': { sky: ['#351419', '#090304'], floor: 'rgba(206, 57, 46, 0.17)', grid: 'rgba(255, 205, 70, 0.3)', motif: 'gearstage', accent: '#f2c744' },
  'BlazBlue': { sky: ['#111b3d', '#030511'], floor: 'rgba(47, 107, 218, 0.16)', grid: 'rgba(107, 210, 255, 0.32)', motif: 'arcanecity', accent: '#68d6ff' },
  'Slender Man': { sky: ['#151818', '#020303'], floor: 'rgba(111, 125, 112, 0.13)', grid: 'rgba(210, 224, 210, 0.16)', motif: 'forest', accent: '#cbd8c8' },
  'Chucky': { sky: ['#2e1d21', '#080304'], floor: 'rgba(205, 70, 60, 0.16)', grid: 'rgba(70, 170, 255, 0.24)', motif: 'toyfactory', accent: '#ffcf4a' },
  'Hellraiser': { sky: ['#2b1511', '#070202'], floor: 'rgba(146, 45, 35, 0.18)', grid: 'rgba(218, 160, 72, 0.26)', motif: 'labyrinth', accent: '#d19845' },
  'Mass Effect': { sky: ['#071a34', '#01040a'], floor: 'rgba(66, 117, 170, 0.16)', grid: 'rgba(73, 179, 255, 0.34)', motif: 'citadel', accent: '#58baff' },
  'Fallout': { sky: ['#352a14', '#0a0702'], floor: 'rgba(177, 142, 77, 0.18)', grid: 'rgba(73, 210, 95, 0.24)', motif: 'wasteland', accent: '#49d25f' },
  'Doom': { sky: ['#4b0807', '#110101'], floor: 'rgba(229, 64, 42, 0.22)', grid: 'rgba(255, 80, 42, 0.42)', motif: 'hellgate', accent: '#ff4f2b' },
  'Unreal': { sky: ['#17283f', '#03060d'], floor: 'rgba(47, 129, 195, 0.18)', grid: 'rgba(255, 92, 51, 0.35)', motif: 'tournament', accent: '#ff5c33' },
  'Harry Potter': { sky: ['#1a1730', '#05040c'], floor: 'rgba(170, 121, 42, 0.16)', grid: 'rgba(215, 184, 105, 0.3)', motif: 'castle', accent: '#d9b86b' },
  'Star Wars': { sky: ['#05061a', '#000107'], floor: 'rgba(88, 103, 130, 0.16)', grid: 'rgba(84, 179, 255, 0.3)', motif: 'trench', accent: '#54b3ff' },
  'Le Cinquième Element': { sky: ['#1d2740', '#050713'], floor: 'rgba(236, 135, 57, 0.14)', grid: 'rgba(83, 225, 255, 0.3)', motif: 'cruise', accent: '#ff9d4c' },
  'Scary Movie': { sky: ['#221a23', '#060306'], floor: 'rgba(158, 68, 115, 0.15)', grid: 'rgba(255, 255, 255, 0.18)', motif: 'hauntedset', accent: '#f05aa7' },
  'Dead Space': { sky: ['#10202b', '#03070b'], floor: 'rgba(104, 116, 128, 0.18)', grid: 'rgba(76, 201, 210, 0.26)', motif: 'shipdeck', accent: '#65d7de' },
  'Rick & Morty': { sky: ['#102d27', '#030806'], floor: 'rgba(83, 224, 95, 0.15)', grid: 'rgba(173, 80, 255, 0.3)', motif: 'portalgarage', accent: '#4de65c' },
  'Digital Circus': { sky: ['#251041', '#07020f'], floor: 'rgba(251, 80, 154, 0.16)', grid: 'rgba(255, 226, 68, 0.34)', motif: 'circus', accent: '#ffe244' },
  'Digimon': { sky: ['#0f263e', '#03070d'], floor: 'rgba(50, 155, 225, 0.15)', grid: 'rgba(250, 205, 60, 0.3)', motif: 'digitalfield', accent: '#facd3c' },
  'Saw': { sky: ['#231b18', '#070403'], floor: 'rgba(111, 45, 35, 0.18)', grid: 'rgba(199, 58, 42, 0.24)', motif: 'traproom', accent: '#c73a2a' },
  'Rosario + Vampire': { sky: ['#2a1735', '#07030d'], floor: 'rgba(203, 76, 165, 0.15)', grid: 'rgba(98, 214, 255, 0.27)', motif: 'academy', accent: '#df64c5' },
  'Negima': { sky: ['#183323', '#040a05'], floor: 'rgba(82, 175, 94, 0.16)', grid: 'rgba(244, 214, 93, 0.28)', motif: 'worldtree', accent: '#f4d65d' },
  'Ghost in the Shell': { sky: ['#061f2b', '#010508'], floor: 'rgba(54, 158, 184, 0.15)', grid: 'rgba(65, 255, 172, 0.32)', motif: 'cybercity', accent: '#41ffac' },
  'Mad Max': { sky: ['#412409', '#0c0501'], floor: 'rgba(221, 116, 36, 0.2)', grid: 'rgba(255, 150, 58, 0.28)', motif: 'desert', accent: '#ff963a' },
  Matrix: { sky: ['#061706', '#000300'], floor: 'rgba(50, 255, 98, 0.12)', grid: 'rgba(50, 255, 98, 0.45)', motif: 'singularity', accent: '#32ff62' }
};

Object.assign(DECOR_THEMES, EXPANDED_DECOR_THEMES);

export const OPENAI_BACKDROPS = {
  RPG: {
    'Gears of War': '/backgrounds/gears-of-war-rpg-openai.png',
    Predator: '/backgrounds/predator-rpg-openai.png',
    'Silent Hill': '/backgrounds/silent-hill-rpg-openai.png',
    Stargate: '/backgrounds/stargate-rpg-openai.png',
    Portal: '/backgrounds/portal-rpg-openai.png',
    BlazBlue: '/backgrounds/blazblue-rpg-openai.png',
    Hellraiser: '/backgrounds/hellraiser-rpg-openai.png',
    Doom: '/backgrounds/doom-rpg-openai.png',
    'Harry Potter': '/backgrounds/harry-potter-rpg-openai.png',
    'Scary Movie': '/backgrounds/scary-movie-rpg-openai.png',
    Vocaloid: '/backgrounds/vocaloid-smash-openai.png',
    'Digital Circus': '/backgrounds/digital-circus-rpg-openai.png',
    'Rosario + Vampire': '/backgrounds/rosario-vampire-rpg-openai.png',
    'Mad Max': '/backgrounds/mad-max-rpg-openai.png',
    Discworld: '/backgrounds/harry-potter-rpg-openai.png',
    Kaamelott: '/backgrounds/harry-potter-rpg-openai.png',
    'Alien 3': '/backgrounds/alien-smash-openai.png',
    'Alien: Covenant': '/backgrounds/alien-smash-openai.png',
    'The Predator': '/backgrounds/predator-rpg-openai.png',
    'Predator: Badlands': '/backgrounds/predator-rpg-openai.png',
    'Dungeon Meshi': '/backgrounds/rosario-vampire-rpg-openai.png',
    'Hazbin Hotel': '/backgrounds/digital-circus-rpg-openai.png',
    Matrix: '/backgrounds/matrix-rpg-openai.png'
  },
  Tactics: {
    Halo: '/backgrounds/halo-tactics-openai.png',
    'Resident Evil': '/backgrounds/resident-evil-tactics-openai.png',
    'The Matrix': '/backgrounds/matrix-tactics-openai.png',
    'Metal Gear': '/backgrounds/metal-gear-tactics-openai.png',
    'Yu-Gi-Oh': '/backgrounds/yu-gi-oh-tactics-openai.png',
    'Mass Effect': '/backgrounds/mass-effect-tactics-openai.png',
    'Le Cinquième Element': '/backgrounds/fifth-element-tactics-openai.png',
    'Dead Space': '/backgrounds/dead-space-tactics-openai.png',
    Digimon: '/backgrounds/digimon-tactics-openai.png',
    Negima: '/backgrounds/negima-tactics-openai.png',
    'Slender Man': '/backgrounds/slender-man-smash-openai.png',
    Unreal: '/backgrounds/unreal-smash-openai.png',
    'The Batman Who Laughs': '/backgrounds/metal-gear-tactics-openai.png',
    Prometheus: '/backgrounds/dead-space-tactics-openai.png',
    'Alien Resurrection': '/backgrounds/dead-space-tactics-openai.png',
    Predators: '/backgrounds/halo-tactics-openai.png',
    'Predator: Killer of Killers': '/backgrounds/yu-gi-oh-tactics-openai.png',
    'Alien vs Predator': '/backgrounds/resident-evil-tactics-openai.png',
    Noob: '/backgrounds/digimon-tactics-openai.png',
    'System of a Down': '/backgrounds/metal-gear-tactics-openai.png',
    'Daft Punk': '/backgrounds/matrix-tactics-openai.png'
  },
  Smash: {
    Alien: '/backgrounds/alien-smash-openai.png',
    'Dino Crisis': '/backgrounds/dino-crisis-smash-openai.png',
    'Half-Life': '/backgrounds/half-life-smash-openai.png',
    Payday: '/backgrounds/payday-smash-openai.png',
    Vocaloid: '/backgrounds/vocaloid-smash-openai.png',
    'Guilty Gear': '/backgrounds/guilty-gear-smash-openai.png',
    'Slender Man': '/backgrounds/slender-man-smash-openai.png',
    Chucky: '/backgrounds/chucky-smash-openai.png',
    Fallout: '/backgrounds/fallout-smash-openai.png',
    Unreal: '/backgrounds/unreal-smash-openai.png',
    'Star Wars': '/backgrounds/star-wars-smash-openai.png',
    'Rick & Morty': '/backgrounds/rick-morty-smash-openai.png',
    Saw: '/backgrounds/saw-smash-openai.png',
    'Ghost in the Shell': '/backgrounds/ghost-in-the-shell-smash-openai.png',
    'Joker New 52': '/backgrounds/chucky-smash-openai.png',
    Aliens: '/backgrounds/alien-smash-openai.png',
    'Alien: Romulus': '/backgrounds/alien-smash-openai.png',
    'Predator 2': '/backgrounds/predator-rpg-openai.png',
    Prey: '/backgrounds/predator-rpg-openai.png',
    'Aliens vs Predator: Requiem': '/backgrounds/alien-smash-openai.png',
    Rammstein: '/backgrounds/doom-rpg-openai.png',
    'Rob Zombie': '/backgrounds/chucky-smash-openai.png',
    'Oliver Tree': '/backgrounds/rick-morty-smash-openai.png'
  }
};

const backdropCache = new Map();

const getTheme = (universe) => DECOR_THEMES[universe] || {
  sky: ['#0c071d', '#030209'],
  floor: 'rgba(57, 197, 187, 0.08)',
  grid: 'rgba(57, 197, 187, 0.25)',
  motif: 'rift',
  accent: '#39c5bb'
};

function withAlpha(hex, alpha) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getOpenAiBackdrop(universe, mode) {
  const src = getOpenAiBackdropSrc(universe, mode);
  if (!src || typeof Image === 'undefined') return null;

  let img = backdropCache.get(src);
  if (!img) {
    img = new Image();
    img.decoding = 'async';
    img.src = src;
    backdropCache.set(src, img);
  }
  return img.complete && img.naturalWidth > 0 ? img : null;
}

export function getOpenAiBackdropSrc(universe, mode) {
  return OPENAI_BACKDROPS[mode]?.[universe] || null;
}

function drawOpenAiBackdrop(ctx, universe, width, height, mode) {
  const img = getOpenAiBackdrop(universe, mode);
  if (!img) return false;

  const sourceRatio = img.naturalWidth / img.naturalHeight;
  const targetRatio = width / height;
  let sx = 0;
  let sy = 0;
  let sw = img.naturalWidth;
  let sh = img.naturalHeight;

  if (sourceRatio > targetRatio) {
    sw = img.naturalHeight * targetRatio;
    sx = (img.naturalWidth - sw) / 2;
  } else if (sourceRatio < targetRatio) {
    sh = img.naturalWidth / targetRatio;
    sy = (img.naturalHeight - sh) / 2;
  }

  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  return true;
}

function drawBackdropAnomalyOverlay(ctx, universe, width, height, mode, time) {
  const theme = getTheme(universe);
  const accent = theme.accent;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  if (mode === 'RPG') {
    ctx.strokeStyle = withAlpha(accent, 0.32);
    ctx.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      const y = height * 0.62 + Math.sin(time * 0.04 + i) * 6 + i * 10;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y + width * 0.18);
      ctx.stroke();
    }
  }

  if (mode === 'Tactics') {
    ctx.strokeStyle = withAlpha(accent, 0.26);
    ctx.lineWidth = 1;
    for (let x = 70; x < width - 70; x += 55) {
      ctx.beginPath();
      ctx.moveTo(x, 48);
      ctx.lineTo(x + Math.sin(time * 0.03 + x) * 5, height - 55);
      ctx.stroke();
    }
  }

  if (mode === 'Smash') {
    ctx.fillStyle = withAlpha(accent, 0.22);
    for (let i = 0; i < 12; i++) {
      const x = (i * 67 + time * 1.7) % width;
      const y = 36 + ((i * 29) % Math.max(1, height - 90));
      ctx.fillRect(x, y, 3 + (i % 3), 2);
    }
  }

  if (universe === 'Stargate') {
    ctx.strokeStyle = 'rgba(80, 200, 255, 0.34)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(width * 0.5, height * 0.42, 54 + Math.sin(time * 0.05) * 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  if (universe === 'The Matrix' || universe === 'Matrix' || universe === 'Ghost in the Shell') {
    ctx.fillStyle = 'rgba(80,255,120,0.22)';
    ctx.font = '10px monospace';
    for (let x = 16; x < width; x += 64) {
      ctx.fillText('0101', x, (time * 2 + x * 3) % height);
    }
  }

  if (universe === 'Silent Hill' || universe === 'Dead Space') {
    ctx.fillStyle = 'rgba(220,220,210,0.08)';
    for (let y = 28; y < height; y += 44) {
      ctx.fillRect(0, y + Math.sin(time * 0.02 + y) * 8, width, 10);
    }
  }

  ctx.restore();
}

function drawStageFloor(ctx, width, height, mode, theme) {
  if (mode === 'RPG') {
    ctx.fillStyle = theme.floor;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.46);
    ctx.lineTo(width, height * 0.72);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.46);
    ctx.lineTo(width, height * 0.72);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let xOffset = -width; xOffset < width * 2; xOffset += 80) {
      ctx.beginPath();
      ctx.moveTo(xOffset, height);
      ctx.lineTo(xOffset + width * 0.6, height * 0.4);
      ctx.stroke();
    }
    return;
  }

  if (mode === 'Tactics') {
    const startX = 60;
    const startY = 50;
    const colW = 55;
    const rowH = 40;

    ctx.fillStyle = theme.floor;
    ctx.fillRect(startX, startY, colW * 8, rowH * 5);
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, colW * 8, rowH * 5);

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.08)';
        ctx.fillRect(startX + c * colW + 2, startY + r * rowH + 2, colW - 4, rowH - 4);
      }
    }
    return;
  }

  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.fillRect(0, height - 20, width, 20);
  ctx.fillStyle = theme.grid;
  ctx.fillRect(width * 0.18, height - 48, width * 0.64, 8);
  ctx.fillRect(width * 0.08, height - 118, width * 0.22, 7);
  ctx.fillRect(width * 0.7, height - 132, width * 0.22, 7);
}

function drawStars(ctx, width, height, theme, count = 32) {
  ctx.fillStyle = withAlpha(theme.accent, 0.45);
  for (let i = 0; i < count; i++) {
    const x = (i * 73) % width;
    const y = (i * 41) % Math.max(1, height * 0.58);
    const size = i % 5 === 0 ? 2 : 1;
    ctx.fillRect(x, y, size, size);
  }
}

function drawMotif(ctx, theme, width, height, time) {
  const accent = theme.accent;
  const soft = withAlpha(accent, 0.22);
  const bright = withAlpha(accent, 0.5);

  ctx.save();
  ctx.strokeStyle = soft;
  ctx.fillStyle = soft;
  ctx.lineWidth = 3;

  switch (theme.motif) {
    case 'ringworld':
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(width / 2, -height * 1.45, width * 2, 0.1, 0.5);
      ctx.stroke();
      break;
    case 'stargate':
      ctx.strokeStyle = withAlpha('#7c8794', 0.55);
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.34, 70, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = withAlpha(accent, 0.45);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.34, 52 + Math.sin(time * 0.03) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = bright;
      for (let i = 0; i < 9; i++) {
        const a = (i / 9) * Math.PI * 2;
        ctx.fillRect(width / 2 + Math.cos(a) * 76 - 3, height * 0.34 + Math.sin(a) * 76 - 3, 6, 6);
      }
      break;
    case 'code':
    case 'cybercity':
      ctx.fillStyle = bright;
      ctx.font = '10px monospace';
      for (let i = 10; i < width; i += 58) {
        const fallY = (time * 2 + i * 7) % (height - 25);
        ctx.fillText(theme.motif === 'code' ? '01' : 'SYS', i, fallY);
        ctx.fillText(theme.motif === 'code' ? '10' : 'NET', i, fallY - 20);
      }
      break;
    case 'hive':
    case 'shipdeck':
      ctx.fillStyle = 'rgba(0,0,0,0.42)';
      for (let x = 40; x < width; x += 92) ctx.fillRect(x, 0, 24, height);
      ctx.fillStyle = bright;
      ctx.fillRect(80, 28, 42, 24);
      ctx.fillRect(width - 130, 42, 48, 18);
      break;
    case 'jungle':
    case 'forest':
    case 'worldtree':
      ctx.fillStyle = 'rgba(0,0,0,0.45)';
      for (let x = 0; x < width; x += 70) {
        const top = height - 120 - ((x * 13) % 70);
        ctx.beginPath();
        ctx.moveTo(x, height);
        ctx.lineTo(x + 24, top);
        ctx.lineTo(x + 52, height);
        ctx.fill();
      }
      if (theme.motif === 'worldtree') {
        ctx.strokeStyle = bright;
        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(width / 2, height);
        ctx.lineTo(width / 2, height * 0.18);
        ctx.stroke();
      }
      break;
    case 'biohazard':
      ctx.strokeStyle = bright;
      ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.arc(width / 2 + Math.cos(i * 2.1) * 28, 95 + Math.sin(i * 2.1) * 18, 32, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    case 'fogtown':
      ctx.fillStyle = 'rgba(210,210,190,0.08)';
      for (let y = 50; y < height; y += 45) ctx.fillRect(0, y + Math.sin(time * 0.01 + y) * 8, width, 12);
      break;
    case 'facility':
    case 'lab':
    case 'testchamber':
      ctx.strokeStyle = soft;
      for (let x = 50; x < width; x += 110) {
        ctx.strokeRect(x, 36, 70, 88);
        ctx.fillStyle = withAlpha(accent, 0.22);
        ctx.fillRect(x + 10, 50, 50, 10);
      }
      break;
    case 'stealthbase':
    case 'vault':
      ctx.strokeStyle = bright;
      ctx.strokeRect(width / 2 - 95, 48, 190, 92);
      ctx.beginPath();
      ctx.arc(width / 2, 94, 34, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'concert':
      ctx.strokeStyle = bright;
      for (let x = 70; x < width; x += 120) {
        ctx.beginPath();
        ctx.moveTo(x, 25);
        ctx.lineTo(x - 40, height * 0.55);
        ctx.stroke();
      }
      break;
    case 'duelarena':
    case 'arcanecity':
    case 'castle':
    case 'academy':
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      for (let x = 40; x < width; x += 120) {
        ctx.fillRect(x, 75, 50, height);
        ctx.fillRect(x + 12, 50, 26, 25);
      }
      break;
    case 'gearstage':
      ctx.strokeStyle = bright;
      for (let x = 80; x < width; x += 150) {
        ctx.beginPath();
        ctx.arc(x, 100, 32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeRect(x - 5, 58, 10, 84);
      }
      break;
    case 'toyfactory':
    case 'hauntedset':
      ctx.strokeStyle = bright;
      for (let x = 70; x < width; x += 130) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + Math.sin(time * 0.02 + x) * 20, 120);
        ctx.stroke();
      }
      break;
    case 'labyrinth':
    case 'traproom':
      ctx.strokeStyle = bright;
      for (let x = 30; x < width; x += 90) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 120);
        ctx.lineTo(x + 36, 150);
        ctx.stroke();
      }
      break;
    case 'citadel':
    case 'cruise':
      drawStars(ctx, width, height, theme, 38);
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.beginPath();
      ctx.moveTo(width / 2, 35);
      ctx.lineTo(width / 2 - 160, 180);
      ctx.lineTo(width / 2 + 160, 180);
      ctx.closePath();
      ctx.fill();
      break;
    case 'wasteland':
    case 'desert':
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(width * 0.16, height - 75);
      ctx.lineTo(width * 0.32, height - 45);
      ctx.lineTo(width * 0.58, height - 95);
      ctx.lineTo(width, height - 70);
      ctx.lineTo(width, height);
      ctx.fill();
      break;
    case 'hellgate':
      ctx.strokeStyle = bright;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 45, 72);
      ctx.lineTo(width / 2 + 45, 72);
      ctx.lineTo(width / 2, 145);
      ctx.closePath();
      ctx.stroke();
      break;
    case 'tournament':
      ctx.strokeStyle = bright;
      ctx.strokeRect(width / 2 - 120, 58, 240, 95);
      ctx.fillStyle = soft;
      ctx.fillRect(width / 2 - 8, 58, 16, 95);
      break;
    case 'trench':
      drawStars(ctx, width, height, theme, 45);
      ctx.fillStyle = 'rgba(120,130,150,0.18)';
      ctx.fillRect(0, height * 0.54, width, 35);
      for (let x = 0; x < width; x += 80) ctx.fillRect(x, height * 0.5, 42, 70);
      break;
    case 'portalgarage':
      ctx.strokeStyle = bright;
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(width / 2, height * 0.35, 62 + Math.sin(time * 0.04) * 5, 0, Math.PI * 2);
      ctx.stroke();
      break;
    case 'circus':
      ctx.fillStyle = soft;
      for (let x = 0; x < width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + 40, height * 0.42);
        ctx.lineTo(x + 80, 0);
        ctx.fill();
      }
      break;
    case 'digitalfield':
      ctx.strokeStyle = bright;
      for (let x = 20; x < width; x += 80) {
        ctx.strokeRect(x, 40 + (x % 3) * 18, 42, 28);
      }
      break;
    case 'singularity':
      ctx.strokeStyle = bright;
      for (let r = 30; r < 150; r += 26) {
        ctx.beginPath();
        ctx.arc(width / 2, height * 0.34, r + Math.sin(time * 0.03 + r) * 4, 0, Math.PI * 2);
        ctx.stroke();
      }
      break;
    default:
      ctx.strokeStyle = bright;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 90, 0, Math.PI * 2);
      ctx.stroke();
      break;
  }

  ctx.restore();
}

export function drawUniverseBackground(ctx, universe, width, height, mode) {
  if (drawOpenAiBackdrop(ctx, universe, width, height, mode)) {
    drawBackdropAnomalyOverlay(ctx, universe, width, height, mode, Date.now() / 33);
    return true;
  }

  const theme = getTheme(universe);
  const time = Date.now() / 33;

  ctx.save();

  const grad = ctx.createRadialGradient(width / 2, height * 0.35, 40, width / 2, height / 2, width * 0.85);
  grad.addColorStop(0, theme.sky[0]);
  grad.addColorStop(1, theme.sky[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  drawMotif(ctx, theme, width, height, time);
  drawStageFloor(ctx, width, height, mode, theme);

  ctx.fillStyle = withAlpha(theme.accent, 0.12);
  for (let i = 0; i < 8; i++) {
    ctx.fillRect(48 + i * 92, 34 + Math.sin(time * 0.08 + i) * 13, 4, 4);
  }

  ctx.restore();
  return false;
}

export function drawSynergyOverlay(ctx, activeSynergies, width, height, animTime) {
  if (!activeSynergies || activeSynergies.length === 0) return;

  ctx.save();
  activeSynergies.forEach(syn => {
    if (syn === 'hacker') {
      ctx.fillStyle = 'rgba(46, 204, 113, 0.15)';
      ctx.font = '10px Courier New';
      for (let x = 10; x < width; x += 40) {
        const yOffset = (animTime * 120 + x * 3) % (height + 100);
        ctx.fillText('01101001011', x, yOffset - 40);
        ctx.fillText('10101100110', x, yOffset);
      }
    }
    if (syn === 'horror') {
      ctx.fillStyle = 'rgba(46, 204, 113, 0.05)';
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(animTime * 0.5 + i * 2) * 0.4 + 0.5) * width;
        const y = height - ((animTime * 40 + i * 80) % height);
        ctx.beginPath();
        ctx.arc(x, y, 35 + i * 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    if (syn === 'tactical') {
      ctx.strokeStyle = 'rgba(57, 197, 187, 0.08)';
      ctx.lineWidth = 2;
      const pulse = Math.abs(Math.sin(animTime * 2)) * 0.3 + 0.7;
      ctx.beginPath();
      for (let size = 30; size < 120; size += 40) {
        drawHex(ctx, width * 0.1, height * 0.8, size * pulse);
        drawHex(ctx, width * 0.9, height * 0.8, size * pulse);
      }
      ctx.stroke();
    }
    if (syn === 'slayer') {
      ctx.strokeStyle = 'rgba(52, 152, 219, 0.15)';
      ctx.lineWidth = 1.5;
      const count = 3;
      for (let i = 0; i < count; i++) {
        const seed = Math.floor(animTime * 2 + i);
        const x1 = (Math.sin(seed) * 0.5 + 0.5) * width;
        const y1 = (Math.cos(seed) * 0.5 + 0.5) * height;
        const x2 = x1 + Math.sin(seed * 1.5) * 80;
        const y2 = y1 + Math.cos(seed * 1.5) * 80;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    }
    if (syn === 'marine') {
      ctx.strokeStyle = 'rgba(230, 126, 34, 0.06)';
      ctx.lineWidth = 3;
      const radius = (animTime * 60) % 250;
      ctx.beginPath();
      ctx.arc(width * 0.25, height * 0.6, radius, 0, Math.PI * 2);
      ctx.stroke();
    }
  });
  ctx.restore();
}

function drawHex(ctx, x, y, size) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const hx = x + Math.cos(angle) * size;
    const hy = y + Math.sin(angle) * size;
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
}
