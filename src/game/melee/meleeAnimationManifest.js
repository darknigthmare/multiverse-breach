import { MELEE_STATES } from './meleeStateMachine.js';

const PLAYER_ANCHOR_MELEE_BASE = '/sprites/generated/heroes/nexus-de-convergence/player-anchor/melee';

export const PLAYER_ANCHOR_MELEE_SHEETS = Object.freeze({
  movement: `${PLAYER_ANCHOR_MELEE_BASE}/player-anchor-m1-movement-openai-v1.webp`,
  crouchDefense: `${PLAYER_ANCHOR_MELEE_BASE}/player-anchor-m2-crouch-defense-openai-v1.webp`,
  chargeTaunt: `${PLAYER_ANCHOR_MELEE_BASE}/player-anchor-m3-charge-taunt-openai-v1.webp`,
  ledge: `${PLAYER_ANCHOR_MELEE_BASE}/player-anchor-m4-ledge-openai-v1.webp`,
  introOutro: `${PLAYER_ANCHOR_MELEE_BASE}/player-anchor-m5-intro-outro-openai-v1.webp`
});

const standingHurtbox = Object.freeze({ frame: '*', x: 0.29, y: 0.08, width: 0.42, height: 0.82 });
const crouchHurtbox = Object.freeze({ frame: '*', x: 0.22, y: 0.38, width: 0.56, height: 0.52 });
const ledgeHurtbox = Object.freeze({ frame: '*', x: 0.24, y: 0.26, width: 0.52, height: 0.68 });

const animation = (sheet, row, frameCount, options = {}) => Object.freeze({
  sheet,
  row,
  startColumn: 0,
  frameCount,
  fps: 12,
  loop: false,
  rootMotion: [],
  hurtboxes: [standingHurtbox],
  hitboxes: [],
  events: [],
  ...options
});

const attackEvents = (enableFrame = 1, disableFrame = 3) => [
  { frame: 0, type: 'playSfx', value: 'slash' },
  { frame: enableFrame, type: 'enableHitbox', value: 'primary' },
  { frame: disableFrame, type: 'disableHitbox', value: 'primary' },
  { frame: Math.max(enableFrame, disableFrame - 1), type: 'openCancelWindow', value: 'movement' }
];

const A = {};
const S = PLAYER_ANCHOR_MELEE_SHEETS;

A.idle = animation(S.movement, 0, 4, { fps: 8, loop: true });
A.walk = animation(S.movement, 1, 3, { fps: 8, loop: true });
A.run = animation(S.movement, 1, 4, { fps: 12, loop: true, rootMotion: [{ frame: '*', x: 0.018, y: 0 }] });
A.turn = animation(S.movement, 3, 1, { fps: 8 });
A.jumpStart = animation(S.movement, 2, 2, { fps: 12, events: [{ frame: 0, type: 'playSfx', value: 'jump' }] });
A.jumpRise = animation(S.movement, 2, 2, { startColumn: 1, fps: 10 });
A.jumpApex = animation(S.movement, 2, 1, { startColumn: 2, fps: 6, loop: true });
A.fall = animation(S.movement, 2, 1, { startColumn: 3, fps: 8, loop: true });
A.fastFall = animation(S.movement, 2, 1, { startColumn: 3, fps: 14, loop: true, rootMotion: [{ frame: '*', x: 0, y: 0.025 }] });
A.land = animation(S.movement, 3, 3, { startColumn: 1, fps: 14 });

A.crouchEnter = animation(S.crouchDefense, 0, 2, { fps: 12, hurtboxes: [crouchHurtbox] });
A.crouchIdle = animation(S.crouchDefense, 0, 2, { startColumn: 1, fps: 6, loop: true, hurtboxes: [crouchHurtbox] });
A.crouchExit = animation(S.crouchDefense, 0, 2, { startColumn: 2, fps: 12, hurtboxes: [crouchHurtbox] });
A.crouchLight = animation(S.crouchDefense, 1, 4, {
  fps: 15,
  hurtboxes: [crouchHurtbox],
  hitboxes: [{ id: 'primary', frames: [1, 2], x: 0.52, y: 0.48, width: 0.42, height: 0.24 }],
  events: attackEvents(1, 3)
});
A.crouchCharge = animation(S.crouchDefense, 1, 4, {
  fps: 8,
  loop: true,
  hurtboxes: [crouchHurtbox],
  events: [{ frame: 0, type: 'playSfx', value: 'charge' }, { frame: 2, type: 'spawnVfx', value: 'anchorCharge' }]
});
A.shieldEnter = animation(S.crouchDefense, 2, 2, { fps: 14, events: [{ frame: 0, type: 'playSfx', value: 'shield' }] });
A.shieldHold = animation(S.crouchDefense, 2, 2, { startColumn: 1, fps: 6, loop: true });
A.shieldHit = animation(S.crouchDefense, 2, 1, { startColumn: 3, fps: 12, events: [{ frame: 0, type: 'cameraShake', value: 0.2 }] });
A.perfectShield = animation(S.crouchDefense, 3, 2, { fps: 16, events: [{ frame: 0, type: 'spawnVfx', value: 'perfectShield' }] });
A.shieldBreak = animation(S.crouchDefense, 3, 3, { startColumn: 1, fps: 10, events: [{ frame: 0, type: 'playSfx', value: 'guardBreak' }] });
A.shieldExit = animation(S.crouchDefense, 2, 2, { startColumn: 2, fps: 12 });

A.attackLight1 = animation(S.chargeTaunt, 0, 2, { fps: 16, hitboxes: [{ id: 'primary', frames: [1], x: 0.52, y: 0.3, width: 0.38, height: 0.32 }], events: attackEvents(1, 1) });
A.attackLight2 = animation(S.chargeTaunt, 0, 2, { startColumn: 1, fps: 16, hitboxes: [{ id: 'primary', frames: [0, 1], x: 0.5, y: 0.24, width: 0.44, height: 0.38 }], events: attackEvents(0, 1) });
A.attackLight3 = animation(S.chargeTaunt, 0, 2, { startColumn: 2, fps: 14, hitboxes: [{ id: 'primary', frames: [0, 1], x: 0.46, y: 0.2, width: 0.5, height: 0.46 }], events: attackEvents(0, 1) });
A.chargeStart = animation(S.chargeTaunt, 1, 2, { fps: 12, events: [{ frame: 0, type: 'playSfx', value: 'charge' }] });
A.chargeLoop = animation(S.chargeTaunt, 1, 2, { startColumn: 2, fps: 8, loop: true, events: [{ frame: 0, type: 'spawnVfx', value: 'anchorCharge' }] });
A.chargeRelease = animation(S.chargeTaunt, 2, 3, {
  fps: 15,
  hitboxes: [{ id: 'primary', frames: [1, 2], x: 0.48, y: 0.18, width: 0.5, height: 0.5 }],
  events: [...attackEvents(1, 2), { frame: 1, type: 'applyImpulse', value: { x: 0.08, y: 0 } }, { frame: 1, type: 'cameraShake', value: 0.45 }]
});
A.chargeRecovery = animation(S.chargeTaunt, 2, 1, { startColumn: 3, fps: 8 });
A.attackRecovery = animation(S.chargeTaunt, 2, 1, { startColumn: 3, fps: 8 });
A.special = animation(S.chargeTaunt, 2, 4, { fps: 14, hitboxes: [{ id: 'primary', frames: [1, 2], x: 0.42, y: 0.12, width: 0.56, height: 0.62 }], events: [...attackEvents(1, 3), { frame: 1, type: 'spawnVfx', value: 'nexusImpulse' }] });
A.aerialNeutral = animation(S.chargeTaunt, 0, 3, { fps: 14, hitboxes: [{ id: 'primary', frames: [1], x: 0.22, y: 0.14, width: 0.68, height: 0.64 }], events: attackEvents(1, 2) });
A.aerialForward = animation(S.chargeTaunt, 2, 3, { fps: 14, hitboxes: [{ id: 'primary', frames: [1, 2], x: 0.5, y: 0.2, width: 0.48, height: 0.48 }], events: attackEvents(1, 2) });
A.aerialDown = animation(S.chargeTaunt, 2, 2, { startColumn: 1, fps: 12, hitboxes: [{ id: 'primary', frames: [0, 1], x: 0.3, y: 0.55, width: 0.46, height: 0.42 }], events: attackEvents(0, 1) });
A.taunt1 = animation(S.chargeTaunt, 3, 4, { fps: 10, events: [{ frame: 0, type: 'playSfx', value: 'signal' }] });

A.ledgeCatch = animation(S.ledge, 0, 3, { fps: 14, hurtboxes: [ledgeHurtbox] });
A.ledgeHang = animation(S.ledge, 1, 3, { fps: 6, loop: true, hurtboxes: [ledgeHurtbox] });
A.ledgeClimb = animation(S.ledge, 2, 4, { fps: 12, hurtboxes: [ledgeHurtbox], rootMotion: [{ frame: '*', x: 0.018, y: -0.018 }] });
A.ledgeDrop = animation(S.ledge, 2, 2, { startColumn: 2, fps: 12, hurtboxes: [ledgeHurtbox], rootMotion: [{ frame: '*', x: -0.012, y: 0.025 }] });
A.ledgeAttack = animation(S.ledge, 3, 3, { fps: 14, hurtboxes: [ledgeHurtbox], hitboxes: [{ id: 'primary', frames: [1, 2], x: 0.48, y: 0.18, width: 0.5, height: 0.48 }], events: attackEvents(1, 2) });
A.ledgeJump = animation(S.ledge, 3, 2, { startColumn: 2, fps: 14, hurtboxes: [ledgeHurtbox], rootMotion: [{ frame: '*', x: 0.02, y: -0.03 }] });

A.intro = animation(S.introOutro, 0, 4, { fps: 10 });
A.victory = animation(S.introOutro, 1, 4, { fps: 10, loop: true });
A.defeat = animation(S.introOutro, 2, 4, { fps: 9 });
A.hitStun = animation(S.introOutro, 3, 2, { fps: 14 });
A.dead = animation(S.introOutro, 2, 4, { fps: 8 });

const anchors = Object.fromEntries(MELEE_STATES.map(state => [state, {
  x: 0.5,
  y: state.startsWith('ledge') ? 0.72 : 0.94,
  baseline: state.startsWith('ledge') ? 'ledgeGrip' : 'feet'
}]));

export const PLAYER_ANCHOR_MELEE_MANIFEST = Object.freeze({
  characterId: 'player_anchor',
  characterReferenceId: 'nexus-player-anchor-v1',
  context: 'melee',
  atlasVersion: 'p4-openai-v1',
  cellWidth: 256,
  cellHeight: 256,
  imageWidth: 1024,
  imageHeight: 1024,
  columns: 4,
  rows: 4,
  facingMode: 'flip',
  animations: Object.freeze(A),
  trimByState: Object.freeze({}),
  anchorByState: Object.freeze(anchors),
  weaponAnchorByFrame: Object.freeze({
    attackLight1: [{ frame: 1, x: 0.75, y: 0.42 }],
    attackLight2: [{ frame: 1, x: 0.78, y: 0.38 }],
    attackLight3: [{ frame: 1, x: 0.8, y: 0.34 }],
    chargeRelease: [{ frame: 1, x: 0.82, y: 0.36 }],
    special: [{ frame: 1, x: 0.8, y: 0.38 }],
    crouchLight: [{ frame: 1, x: 0.8, y: 0.62 }],
    ledgeAttack: [{ frame: 1, x: 0.82, y: 0.42 }]
  })
});

const MANIFESTS = Object.freeze({
  [PLAYER_ANCHOR_MELEE_MANIFEST.characterId]: PLAYER_ANCHOR_MELEE_MANIFEST
});

const normalizePath = value => {
  const path = String(value || '');
  if (!path) return '';
  if (path.startsWith('/')) return path;
  try {
    return new URL(path).pathname;
  } catch {
    const index = path.indexOf('/sprites/');
    return index >= 0 ? path.slice(index) : path;
  }
};

export const getMeleeAnimationManifest = characterId => MANIFESTS[characterId] || null;

export const resolveMeleeAnimation = (manifest, state) => (
  manifest?.animations?.[state]
  || manifest?.animations?.idle
  || null
);

export const getMeleeAnimationFrame = (manifest, state, elapsedMs = 0) => {
  const entry = resolveMeleeAnimation(manifest, state);
  if (!entry) return null;
  const frameCount = Math.max(1, Math.floor(Number(entry.frameCount) || 1));
  const absoluteFrame = Math.max(0, Math.floor((Math.max(0, Number(elapsedMs) || 0) / 1000) * (Number(entry.fps) || 1)));
  const relativeFrame = entry.loop ? absoluteFrame % frameCount : Math.min(frameCount - 1, absoluteFrame);
  return {
    animation: entry,
    frame: relativeFrame,
    col: (Number(entry.startColumn) || 0) + relativeFrame,
    row: Number(entry.row) || 0,
    trim: manifest.trimByState?.[state] || null,
    anchor: manifest.anchorByState?.[state] || { x: 0.5, y: 0.94, baseline: 'feet' }
  };
};

export const getMeleeAnimationSheetSources = characterOrId => {
  const id = typeof characterOrId === 'string' ? characterOrId : characterOrId?.id;
  const manifest = getMeleeAnimationManifest(id);
  return manifest ? [...new Set(Object.values(manifest.animations).map(entry => entry.sheet))] : [];
};

export const getMeleeSheetLayout = source => {
  const path = normalizePath(source);
  for (const manifest of Object.values(MANIFESTS)) {
    if (Object.values(manifest.animations).some(entry => entry.sheet === path)) {
      return { columns: manifest.columns, rows: manifest.rows, cellWidth: manifest.cellWidth, cellHeight: manifest.cellHeight };
    }
  }
  return null;
};

export const validateMeleeAnimationManifest = manifest => {
  const errors = [];
  if (!manifest || typeof manifest !== 'object') return ['manifest must be an object'];
  if (!manifest.characterId) errors.push('characterId is required');
  if (manifest.context !== 'melee') errors.push("context must be 'melee'");
  ['cellWidth', 'cellHeight', 'imageWidth', 'imageHeight', 'columns', 'rows'].forEach(field => {
    if (!(Number(manifest[field]) > 0)) errors.push(`${field} must be positive`);
  });
  MELEE_STATES.forEach(state => {
    const entry = manifest.animations?.[state];
    if (!entry) {
      errors.push(`${state}: animation is required`);
      return;
    }
    ['sheet', 'row', 'startColumn', 'frameCount', 'fps', 'loop', 'rootMotion', 'hurtboxes', 'hitboxes', 'events'].forEach(field => {
      if (!Object.prototype.hasOwnProperty.call(entry, field)) errors.push(`${state}: ${field} is required`);
    });
    if (!(Number(entry.frameCount) > 0)) errors.push(`${state}: frameCount must be positive`);
    if ((Number(entry.startColumn) || 0) + (Number(entry.frameCount) || 0) > Number(manifest.columns)) errors.push(`${state}: frames exceed sheet columns`);
    if (!manifest.anchorByState?.[state]?.baseline) errors.push(`${state}: baseline anchor is required`);
  });
  const validEntries = Object.values(manifest.animations || {}).filter(entry => entry && typeof entry === 'object');
  if (new Set(validEntries.map(entry => entry.frameCount)).size < 2) errors.push('frameCount must vary by state');
  return errors;
};
