// Pixel Art Renderer and Particle System for Multiverse Breach

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

export const drawPixelSprite = (ctx, x, y, character, animTime, facing = 1) => {
  const { primaryColor, secondaryColor, weaponType, weaponColor, id, state, defense } = character;
  
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);

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
  const { name, color, weapon, state } = enemy;
  
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

export function drawUniverseBackground(ctx, universe, width, height, mode) {
  ctx.save();
  
  // 1. Ambient Backdrop Gradient
  let grad = ctx.createRadialGradient(width/2, height/2, 50, width/2, height/2, width*0.8);
  let floorColor = 'rgba(255, 255, 255, 0.05)';
  let gridColor = 'rgba(57, 197, 187, 0.2)';
  
  switch (universe) {
    case 'Gears of War':
      grad.addColorStop(0, '#2d1b1b');
      grad.addColorStop(1, '#0c0505');
      floorColor = 'rgba(80, 50, 50, 0.15)';
      gridColor = 'rgba(180, 40, 40, 0.3)';
      break;
    case 'Halo':
      grad.addColorStop(0, '#102d1d');
      grad.addColorStop(1, '#030e06');
      floorColor = 'rgba(46, 204, 113, 0.1)';
      gridColor = 'rgba(57, 197, 187, 0.3)';
      break;
    case 'Alien':
    case 'Dead Space':
      grad.addColorStop(0, '#11222b');
      grad.addColorStop(1, '#040d12');
      floorColor = 'rgba(100, 110, 120, 0.15)';
      gridColor = 'rgba(52, 152, 219, 0.25)';
      break;
    case 'Predator':
    case 'Negima':
      grad.addColorStop(0, '#212a14');
      grad.addColorStop(1, '#070b03');
      floorColor = 'rgba(39, 174, 96, 0.15)';
      gridColor = 'rgba(46, 204, 113, 0.25)';
      break;
    case 'Resident Evil':
    case 'Silent Hill':
    case 'Saw':
    case 'Hellraiser':
      grad.addColorStop(0, '#262222');
      grad.addColorStop(1, '#0a0909');
      floorColor = 'rgba(192, 57, 43, 0.1)';
      gridColor = 'rgba(231, 76, 60, 0.25)';
      break;
    case 'The Matrix':
    case 'Ghost in the Shell':
      grad.addColorStop(0, '#022502');
      grad.addColorStop(1, '#000600');
      floorColor = 'rgba(46, 204, 113, 0.08)';
      gridColor = 'rgba(46, 204, 113, 0.4)';
      break;
    case 'Stargate':
    case 'Yu-Gi-Oh':
    case 'Harry Potter':
      grad.addColorStop(0, '#1c1535');
      grad.addColorStop(1, '#050410');
      floorColor = 'rgba(241, 196, 15, 0.1)';
      gridColor = 'rgba(155, 89, 182, 0.3)';
      break;
    case 'Star Wars':
    case 'Mass Effect':
      grad.addColorStop(0, '#020216');
      grad.addColorStop(1, '#000003');
      floorColor = 'rgba(52, 73, 94, 0.15)';
      gridColor = 'rgba(52, 152, 219, 0.3)';
      break;
    case 'Rick & Morty':
    case 'Digital Circus':
      grad.addColorStop(0, '#2a0a22');
      grad.addColorStop(1, '#080107');
      floorColor = 'rgba(230, 126, 34, 0.1)';
      gridColor = 'rgba(155, 89, 182, 0.3)';
      break;
    case 'Doom':
      grad.addColorStop(0, '#420a0a');
      grad.addColorStop(1, '#0f0202');
      floorColor = 'rgba(231, 76, 60, 0.2)';
      gridColor = 'rgba(231, 76, 60, 0.4)';
      break;
    case 'Mad Max':
      grad.addColorStop(0, '#3a220a');
      grad.addColorStop(1, '#0d0702');
      floorColor = 'rgba(230, 126, 34, 0.15)';
      gridColor = '#d35400';
      break;
    default:
      grad.addColorStop(0, '#0c071d');
      grad.addColorStop(1, '#030209');
      floorColor = 'rgba(57, 197, 187, 0.08)';
      gridColor = 'rgba(57, 197, 187, 0.25)';
      break;
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // 2. Draw Highly Representative Universe Ground / Platforms / Grids
  if (mode === 'RPG') {
    // --- DIAGONAL PERSPECTIVE ROAD/GROUND VIEW ---
    ctx.fillStyle = floorColor;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.45);
    ctx.lineTo(width, height * 0.75);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.45);
    ctx.lineTo(width, height * 0.75);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let xOffset = -width; xOffset < width * 2; xOffset += 80) {
      ctx.beginPath();
      ctx.moveTo(xOffset, height);
      ctx.lineTo(xOffset + width * 0.6, height * 0.4);
      ctx.stroke();
    }
  } else if (mode === 'Tactics') {
    // Tactics board bounds
    const startX = 60;
    const startY = 50;
    const colW = 55;
    const rowH = 40;

    ctx.fillStyle = floorColor;
    ctx.fillRect(startX, startY, colW * 8, rowH * 5);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 8; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(startX + c * colW + 2, startY + r * rowH + 2, colW - 4, rowH - 4);
        }
      }
    }
  } else if (mode === 'Smash') {
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, height - 20, width, 20);
  }

  // 3. Detailed Thematic Universe Elements in Sky / Background
  ctx.save();
  switch (universe) {
    case 'Gears of War':
      ctx.strokeStyle = 'rgba(180, 20, 20, 0.2)';
      ctx.lineWidth = 4;
      ctx.strokeRect(width/2 - 90, 60, 180, 100);
      ctx.beginPath();
      ctx.arc(width/2, 110, 30, 0, Math.PI*2);
      ctx.stroke();
      break;

    case 'Halo':
      ctx.strokeStyle = 'rgba(57, 197, 187, 0.12)';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.arc(width/2, -height * 1.5, width * 2, 0.1, 0.5);
      ctx.stroke();
      break;

    case 'Alien':
    case 'Dead Space':
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(40, 0, 30, height);
      ctx.fillRect(width - 70, 0, 30, height);
      ctx.fillStyle = 'rgba(52, 152, 219, 0.2)';
      ctx.fillRect(80, 30, 40, 30);
      break;

    case 'Predator':
    case 'Negima':
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(50, height - 120);
      ctx.lineTo(70, height - 120);
      ctx.lineTo(120, height);
      ctx.fill();
      break;

    case 'Resident Evil':
    case 'Silent Hill':
    case 'Saw':
    case 'Hellraiser':
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.25)';
      ctx.lineWidth = 2;
      for (let i = 80; i < width; i += 160) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 120 + Math.sin(i) * 30);
        ctx.stroke();
      }
      break;

    case 'The Matrix':
    case 'Ghost in the Shell':
      ctx.fillStyle = 'rgba(46, 204, 113, 0.15)';
      ctx.font = '10px monospace';
      for (let i = 10; i < width; i += 60) {
        const fallY = (Date.now() / 12 + i * 7) % (height - 30);
        ctx.fillText('01', i, fallY);
        ctx.fillText('10', i, fallY - 20);
      }
      break;

    case 'Stargate':
    case 'Yu-Gi-Oh':
    case 'Harry Potter':
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, 20, height);
      ctx.fillRect(width - 20, 0, 20, height);
      ctx.fillStyle = 'rgba(241, 196, 15, 0.4)';
      for (let i = 0; i < 8; i++) {
        ctx.fillRect(60 + i * 90, 40 + (Math.sin(Date.now()*0.003 + i)*15), 3, 3);
      }
      break;

    case 'Star Wars':
    case 'Mass Effect':
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      for (let i = 0; i < 25; i++) {
        ctx.fillRect((i * 73) % width, (i * 41) % height, i % 2 === 0 ? 1 : 2, i % 2 === 0 ? 1 : 2);
      }
      break;

    case 'Rick & Morty':
    case 'Digital Circus':
      ctx.strokeStyle = 'rgba(155, 89, 182, 0.15)';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.arc(width/2, height/2 - 20, 90, 0, Math.PI*2);
      ctx.stroke();
      break;

    case 'Doom':
      ctx.strokeStyle = 'rgba(231, 76, 60, 0.18)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width/2 - 40, 80);
      ctx.lineTo(width/2 + 40, 80);
      ctx.lineTo(width/2, 140);
      ctx.closePath();
      ctx.stroke();
      break;

    case 'Mad Max':
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.lineTo(100, height - 70);
      ctx.lineTo(180, height - 40);
      ctx.lineTo(width, height - 90);
      ctx.lineTo(width, height);
      ctx.fill();
      break;
  }
  ctx.restore();
  ctx.restore();
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
